import { makeRng } from './rng.mjs';
import { pickBirthYear, qx, priceRatio, infantMortality, lastCpiYear } from './era.mjs';

// ภาค/ฐานะ/ค่าเริ่มยังเป็นค่าคงที่ชั่วคราวของ tracer — ปีเกิดและการตายใช้ข้อมูลยุคจริงแล้ว (era.mjs)
export const SEXES = ['ชาย', 'หญิง'];
export const REGIONS = ['กลาง', 'เหนือ', 'ตะวันออกเฉียงเหนือ', 'ใต้', 'ตะวันออก', 'ตะวันตก'];
export const CLASSES = ['ยากจน', 'ชนชั้นกลาง', 'ร่ำรวย'];
const CLASS_WEIGHTS = [0.4, 0.5, 0.1];
const START = {
  ยากจน: { health: 55, happiness: 50, knowledge: 30, relations: 60, money: 2000, income: 8000 },
  ชนชั้นกลาง: { health: 65, happiness: 55, knowledge: 45, relations: 60, money: 20000, income: 25000 },
  ร่ำรวย: { health: 75, happiness: 60, knowledge: 60, relations: 55, money: 500000, income: 60000 },
};
// ตารางกลางแปลงระดับ ±1/±2/±3 เป็นตัวเลข (ใบ 07) ปรับสมดุลที่จุดเดียว
export const LEVEL_STEP = 6;
const STAT_KEYS = ['health', 'happiness', 'knowledge', 'relations'];

const clamp = (v) => Math.max(0, Math.min(100, v));

function weighted(rng, items, weights) {
  let r = rng.next() * weights.reduce((s, w) => s + w, 0);
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r < 0) return items[i];
  }
  return items[items.length - 1];
}

export function newLife(seed, content) {
  const rng = makeRng(seed);
  const cls = weighted(rng, CLASSES, CLASS_WEIGHTS);
  const s = START[cls];
  return {
    rng,
    seed,
    content,
    birthYear: pickBirthYear(rng, content.era),
    sex: rng.pick(SEXES),
    region: rng.pick(REGIONS),
    cls,
    age: 0,
    health: s.health,
    happiness: s.happiness,
    knowledge: s.knowledge,
    relations: s.relations,
    money: s.money,
    income: s.income,
    done: {},
    dead: false,
    pending: null,
    started: false,
    log: [],
  };
}

// โอกาสตายภายในปีนี้ = ตารางชีพจริงของปีปฏิทินนั้นตามอายุ/เพศ × ตัวคูณจากสุขภาพ (ใบ 03)
export function deathChance(st) {
  const base = qx(st.content.era, st.sex, st.birthYear + st.age, st.age);
  if (base >= 1) return 1;
  const mult = 1 + Math.max(0, 50 - st.health) / 40 - Math.max(0, st.health - 50) / 200;
  return Math.min(1, base * mult);
}

function fill(text, st) {
  return text
    .replaceAll('{อายุ}', st.age)
    .replaceAll('{ปี}', st.birthYear + st.age)
    .replaceAll('{ภาค}', st.region)
    .replaceAll('{เงิน}', Math.round(st.money).toLocaleString('en-US'));
}

function applyEffects(st, fx = {}) {
  for (const k of STAT_KEYS) if (fx[k]) st[k] = clamp(st[k] + fx[k] * LEVEL_STEP);
  if (fx.money) st.money += fx.money;
}

// เดินปีละครั้งจนเจอหลักไมล์ถึงกำหนดหรือตาย คืนการ์ดใบถัดไป
export function nextCard(st) {
  if (st.pending) throw new Error('ยังมีการ์ดที่รอเลือก');
  if (st.dead) return deathCard(st);
  for (;;) {
    if (st.started) {
      // สุ่มตายของปีที่อายุ st.age ก่อนขึ้นปีใหม่ — ทารกจึงตายได้ตั้งแต่ขวบปีแรกตามอัตราตายทารกจริง และอายุบนการ์ดตายเป็นปีเต็ม
      if (st.health <= 0 || st.rng.next() < deathChance(st)) {
        st.dead = true;
        return deathCard(st);
      }
      st.age += 1;
      // ธรรมชาติ: สุขภาพไหลลงตามอายุ ความสัมพันธ์จางลง
      if (st.age > 30) st.health = clamp(st.health - 0.4);
      st.relations = clamp(st.relations - 0.3);
      if (st.age >= 22 && st.age < 60) st.money += st.income;
    }
    st.started = true;
    const ev = st.content.events.find((e) => e.age === st.age && !st.done[e.id]);
    if (ev) {
      st.done[ev.id] = true;
      st.pending = ev;
      return {
        kind: 'event',
        id: ev.id,
        age: st.age,
        text: fill(ev.text, st),
        choices: ev.choices.map((c) => fill(c.text, st)),
      };
    }
  }
}

export function choose(st, idx) {
  const ev = st.pending;
  if (!ev || !ev.choices[idx]) throw new Error('ตัวเลือกไม่ถูกต้อง');
  st.pending = null;
  applyEffects(st, ev.choices[idx].effects);
  st.log.push({ id: ev.id, age: st.age, choice: idx });
}

function deathCard(st) {
  const year = st.birthYear + st.age;
  const era = st.content.era;
  const card = {
    kind: 'death',
    age: st.age,
    text: `ตายอายุ ${st.age}`,
    summary: {
      year,
      money: Math.round(st.money),
      moneyAtBirth: Math.round(st.money / priceRatio(era, st.seed, st.birthYear, year)),
      // lore หัวข้อ 6: เงินเฟ้อปีหลังข้อมูลเป็นอนาคตจำลอง ต้องบอกผู้เล่น
      simulatedFrom: year > lastCpiYear(era) ? lastCpiYear(era) + 1 : null,
    },
  };
  // ใบ 07: ตายตอนเด็กได้บันทึกสั้นบอกสถิติยุคนั้น
  if (st.age < 5) {
    const imr = infantMortality(era, st.sex, st.birthYear);
    card.note = `ปี ${st.birthYear} ทารก${st.sex}ไทยตายก่อนอายุ 1 ขวบ ราว ${Math.round(imr)} คนในทุก 1,000 คน`;
  }
  return card;
}

export function profileText(st) {
  return `เกิดปี ${st.birthYear} · ${st.sex} · ภาค${st.region} · ฐานะ${st.cls}`;
}

export function statsOf(st) {
  return { health: st.health, happiness: st.happiness, knowledge: st.knowledge, relations: st.relations, money: st.money };
}

// harness วิ่งชีวิตผ่านฟังก์ชันชุดเดียวกับหน้าเว็บ ผู้เรียกส่งแค่ตัวเลือกเลือกตัวเลือก
// stream ของบอทแยกจาก rng ของแกนเกม เพื่อไม่ให้การเลือกไปเปลี่ยนลำดับสุ่มของโลก
export function playLife(seed, content, pickChoice) {
  const st = newLife(seed, content);
  const bot = makeRng(seed ^ 0x5bd1e995);
  for (;;) {
    const card = nextCard(st);
    if (card.kind === 'death') return { age: card.age, state: st };
    choose(st, pickChoice(card, bot));
  }
}
