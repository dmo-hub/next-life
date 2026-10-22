import { makeRng } from './rng.mjs';
import { pickBirthYear, qx, priceRatio, inflationRate, infantMortality, lastCpiYear, eraEventsAt } from './era.mjs';
import { pickRegion, regionRatio, nationalIncome, classOdds } from './birth.mjs';

export const SEXES = ['ชาย', 'หญิง'];
// เรียงตามเส้นแบ่งฐานะใน data/birthplace.json (rules.classes) — ต่ำไปสูง
export const CLASSES = ['ยากจน', 'ชนชั้นกลาง', 'ร่ำรวย'];
// ค่าแถบเริ่มตามฐานะยังเป็นค่าตั้งของเกม ไม่มีสถิติให้แปลงตรง ๆ
const START = {
  ยากจน: { health: 55, happiness: 50, knowledge: 30, relations: 60 },
  ชนชั้นกลาง: { health: 65, happiness: 55, knowledge: 45, relations: 60 },
  ร่ำรวย: { health: 75, happiness: 60, knowledge: 60, relations: 55 },
};
// ตารางกลางแปลงระดับ ±1/±2/±3 เป็นตัวเลข (ใบ 07) ปรับสมดุลที่จุดเดียว · ไม่เป็นเส้นตรงเพื่อให้ ±3 เป็นเหตุใหญ่จริง
export const LEVELS = { 1: 5, 2: 12, 3: 20 };
const STAT_KEYS = ['health', 'happiness', 'knowledge', 'relations'];

// ช่วงชีวิต (ใบ 03) · ระหว่างชาติไม่ใช่ช่วงอายุ แต่จองชื่อไว้ให้ใบที่ทำหลังตาย
export const STAGES = [
  { name: 'เด็ก', from: 0 },
  { name: 'วัยรุ่น', from: 13 },
  { name: 'หนุ่มสาว', from: 19 },
  { name: 'ทำงาน', from: 31 },
  { name: 'กลางคน', from: 46 },
  { name: 'ชรา', from: 60 },
];
export const AFTERLIFE_STAGE = 'ระหว่างชาติ';
export function stageOf(age) {
  let s = STAGES[0].name;
  for (const x of STAGES) if (age >= x.from) s = x.name;
  return s;
}

// ไหลตามธรรมชาติรายปี (ใบ 03) — ทุกตัวไหลแบบสัดส่วน ค่าจึงเข้าใกล้ขอบได้แต่ไม่ทะลุเอง
// สุขภาพ: ลดตามอายุ เร่งหลัง 60 · ความสุข: กลับสู่ค่าพื้นฐานของคนนั้น ครึ่งชีวิต 3 ปี
// ความรู้: เพิ่มง่ายตอนเด็ก แล้วชะลอ · ความสัมพันธ์: จางลงถ้าไม่มีเหตุการณ์ดูแล
const healthDecay = (age) => (age <= 30 ? 0 : age <= 60 ? 0.005 : 0.005 + 0.0007 * (age - 60));
const HAPPY_PULL = 1 - 0.5 ** (1 / 3);
const knowledgeGain = (age) => (age <= 12 ? 3 : age <= 18 ? 2.5 : age <= 30 ? 1 : age < 60 ? 0.4 : 0);
const RELATION_FADE = 0.007;
// ออกการ์ดสรุปอย่างน้อยทุก K ปี ถึงไม่มีอะไรเกิด
export const SUMMARY_EVERY = 1;

const clamp = (v) => Math.max(0, Math.min(100, v));

function weighted(rng, items, weights) {
  let r = rng.next() * weights.reduce((s, w) => s + w, 0);
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r < 0) return items[i];
  }
  return items[items.length - 1];
}

// เงินเก็บต่อปี เป็นบาทของปีนั้น: รายได้ครัวเรือนทั่วประเทศปีนั้น × สัดส่วนภาค × รายได้เฉลี่ยของฐานะในภาคนั้น × อัตราออม
export function yearlySaving(st, year = st.birthYear + st.age) {
  const era = st.content.era;
  const ratio = regionRatio(era.birth, st.ses, year);
  const factor = classOdds(era.birth, ratio)[CLASSES.indexOf(st.cls)].factor;
  return nationalIncome(era, st.seed, year) * 12 * ratio * factor * era.birth.saveRate;
}

export function newLife(seed, content) {
  const era = content.era;
  const rng = makeRng(seed);
  const birthYear = pickBirthYear(rng, era);
  const sex = rng.pick(SEXES);
  const region = pickRegion(rng, era.birth);
  const odds = classOdds(era.birth, regionRatio(era.birth, region.ses, birthYear));
  const cls = weighted(rng, CLASSES, odds.map((o) => o.p));
  const s = START[cls];
  const st = {
    rng,
    seed,
    content,
    birthYear,
    sex,
    region: region.name,
    ses: region.ses,
    cls,
    age: 0,
    health: s.health,
    happiness: s.happiness,
    knowledge: s.knowledge,
    relations: s.relations,
    money: 0,
    // เส้นสุขภาพของชีวิตนี้ถ้าไม่มีเหตุการณ์ใดเลย — ตัวคูณการตายวัดจากส่วนต่างกับเส้นนี้
    healthNatural: s.health,
    baseHappiness: s.happiness,
    // ราคาปีนี้เป็นกี่เท่าของปีเกิด
    price: 1,
    trail: [],
    lastCardAge: 0,
    lastCardMoney: 0,
    due: [],
    queue: [],
    done: {},
    dead: false,
    pending: null,
    advance: false,
    cards: 0,
    log: [],
  };
  st.money = era.birth.startMoney[cls] * yearlySaving(st);
  st.lastCardMoney = st.money;
  st.trail.push({ year: birthYear, money: Math.round(st.money) });
  return st;
}

// โอกาสตายภายในปีนี้ = ตารางชีพจริงของปีปฏิทินนั้นตามอายุ/เพศ × ตัวคูณจากสุขภาพ (ใบ 03)
// ตัวคูณอิงส่วนต่างจากเส้นสุขภาพตามธรรมชาติของชีวิตนั้น ไม่ใช่ค่าคงที่ — ชีวิตที่ไม่มีเหตุการณ์จึงได้ qx จริงพอดี
// และสุขภาพที่ไหลลงตามวัยไม่ถูกนับซ้ำกับ qx ที่สูงขึ้นตามวัยอยู่แล้ว · สุขภาพแย่เพิ่มความเสี่ยงแรงกว่าสุขภาพดีลด
export function healthMultiplier(st) {
  const d = st.health - st.healthNatural;
  return d < 0 ? 1 - d / 50 : Math.max(0.6, 1 - d / 150);
}

export function deathChance(st) {
  const base = qx(st.content.era, st.sex, st.birthYear + st.age, st.age);
  if (base >= 1) return 1;
  return Math.min(1, base * healthMultiplier(st));
}

function fill(text, st) {
  return text
    .replaceAll('{อายุ}', st.age)
    .replaceAll('{ปี}', st.birthYear + st.age)
    .replaceAll('{ภาค}', regionLabel(st))
    .replaceAll('{เงิน}', Math.round(st.money).toLocaleString('en-US'));
}

export function levelValue(level) {
  const v = LEVELS[Math.abs(level)];
  if (v === undefined) throw new Error(`ระดับผลต้องเป็น ±1..±3 ได้ ${level}`);
  return Math.sign(level) * v;
}

// เงินในผลตัวเลือก: ตัวเลขเปล่า = บาทของปีนั้น · {unit: income_x} = จำนวนเท่าของเงินเก็บต่อปีตอนนี้
// · {unit: fixed_baht, ref_year} = บาทของปีอ้างอิง ปรับตามเงินเฟ้อจริงมาเป็นบาทของปีนี้
export function moneyValue(st, m) {
  if (typeof m === 'number') return m;
  if (m.unit === 'income_x') return m.amount * yearlySaving(st);
  if (m.unit === 'fixed_baht') {
    const year = st.birthYear + st.age;
    const ref = m.ref_year ?? year;
    const era = st.content.era;
    return ref <= year ? m.amount * priceRatio(era, st.seed, ref, year) : m.amount / priceRatio(era, st.seed, year, ref);
  }
  throw new Error(`หน่วยเงินไม่รู้จัก: ${m.unit}`);
}

function applyEffects(st, fx = {}) {
  for (const k of STAT_KEYS) if (fx[k]) st[k] = clamp(st[k] + levelValue(fx[k]));
  if (fx.money) st.money += moneyValue(st, fx.money);
}

// เดินหนึ่งปี: ทุกอย่างไหลเป็นรายปีในลูปนี้ที่เดียว การกระโดดหลายปีจึงได้ผลเท่ากับเดินทีละปีเสมอ
function stepYear(st) {
  const prevStage = stageOf(st.age);
  st.age += 1;
  const year = st.birthYear + st.age;
  st.price *= 1 + inflationRate(st.content.era, st.seed, year) / 100;

  const r = healthDecay(st.age);
  st.health = clamp(st.health * (1 - r));
  st.healthNatural *= 1 - r;
  st.happiness = clamp(st.happiness + (st.baseHappiness - st.happiness) * HAPPY_PULL);
  st.knowledge = clamp(st.knowledge + (knowledgeGain(st.age) * (100 - st.knowledge)) / 100);
  st.relations = clamp(st.relations * (1 - RELATION_FADE));
  if (st.age >= 22 && st.age < 60) st.money += yearlySaving(st, year);
  st.trail.push({ year, money: Math.round(st.money) });

  const stage = stageOf(st.age);
  if (stage !== prevStage) st.due.push({ kind: 'stage', age: st.age, stage, text: `เข้าสู่ช่วง${stage}` });
  for (const e of eraEventsAt(st.content.era, year)) {
    if (e.from === year && (!e.regions || e.regions.includes(st.region))) {
      st.due.push({ kind: 'era', id: e.id, age: st.age, stage, eraKind: e.kind, text: `ปี ${year} ${e.name}` });
    }
  }
}

// การ์ดสรุปเป็นของคำนวณล้วน ไม่ดึงเลขสุ่มของโลก — เพิ่ม/ลดการ์ดสรุปแล้วชะตาชีวิตต้องเหมือนเดิม
function summaryCard(st) {
  const from = st.lastCardAge;
  const items = [];
  const money = Math.round(st.money);
  if (money !== Math.round(st.lastCardMoney)) {
    items.push(`เงิน ${Math.round(st.lastCardMoney).toLocaleString('en-US')} → ${money.toLocaleString('en-US')} บาท`);
  }
  const year = st.birthYear + st.age;
  return {
    kind: 'summary',
    fromAge: from,
    age: st.age,
    stage: stageOf(st.age),
    text: `ผ่านไป ${st.age - from} ปี · อายุ ${from} → ${st.age}`,
    items,
    money,
    moneyAtBirth: Math.round(st.money / st.price),
    moneySeries: st.trail.filter((p) => p.year >= st.birthYear + from && p.year <= year),
  };
}

function emit(st, card) {
  st.cards++;
  st.lastCardAge = st.age;
  st.lastCardMoney = st.money;
  return card;
}

// เดินปีละครั้งจนมีการ์ดถึงกำหนดหรือตาย คืนการ์ดใบถัดไป
export function nextCard(st) {
  if (st.pending) throw new Error('ยังมีการ์ดที่รอเลือก');
  if (st.dead) return deathCard(st);
  // การ์ดเปลี่ยนช่วง/เหตุการณ์ยุคเป็นใบของตัวเอง ตามหลังการ์ดสรุปของปีเดียวกัน
  if (st.queue.length) return emit(st, st.queue.shift());
  for (;;) {
    if (st.advance) {
      // สุ่มตายของปีที่อายุ st.age ก่อนขึ้นปีใหม่ — ทารกจึงตายได้ตั้งแต่ขวบปีแรกตามอัตราตายทารกจริง และอายุบนการ์ดตายเป็นปีเต็ม
      if (st.health <= 0 || st.rng.next() < deathChance(st)) {
        st.dead = true;
        return deathCard(st);
      }
      stepYear(st);
    }
    st.advance = true;
    if (st.age > st.lastCardAge && (st.due.length || st.age - st.lastCardAge >= SUMMARY_EVERY)) {
      // เหตุการณ์ของอายุนี้ยังรอ: การ์ดใบถัดไปต้องไม่เดินเวลา
      st.advance = false;
      const card = summaryCard(st);
      st.queue = st.due;
      st.due = [];
      return emit(st, card);
    }
    const ev = st.content.events.find((e) => e.age === st.age && !st.done[e.id]);
    if (ev) {
      st.done[ev.id] = true;
      st.pending = ev;
      return emit(st, {
        kind: 'event',
        id: ev.id,
        age: st.age,
        stage: stageOf(st.age),
        text: fill(ev.text, st),
        choices: ev.choices.map((c) => fill(c.text, st)),
      });
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

// "ภาค" นำหน้าไม่เข้ากับกรุงเทพฯ และปริมณฑล
export const regionLabel = (st) => (st.ses === 'bkk' ? st.region : `ภาค${st.region}`);

export function profileText(st) {
  return `เกิดปี ${st.birthYear} · ${st.sex} · ${regionLabel(st)} · ฐานะ${st.cls}`;
}

export function statsOf(st) {
  return { health: st.health, happiness: st.happiness, knowledge: st.knowledge, relations: st.relations, money: st.money };
}

// harness วิ่งชีวิตผ่านฟังก์ชันชุดเดียวกับหน้าเว็บ ผู้เรียกส่งแค่ตัวเลือกเลือกตัวเลือก · onCard เห็นสถานะทุกการ์ด
// stream ของบอทแยกจาก rng ของแกนเกม เพื่อไม่ให้การเลือกไปเปลี่ยนลำดับสุ่มของโลก
export function playLife(seed, content, pickChoice, onCard) {
  const st = newLife(seed, content);
  const bot = makeRng(seed ^ 0x5bd1e995);
  for (;;) {
    const card = nextCard(st);
    onCard?.(card, st);
    if (card.kind === 'death') return { age: card.age, cards: st.cards + 1, state: st };
    if (card.kind === 'event') choose(st, pickChoice(card, bot));
  }
}
