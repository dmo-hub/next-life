import { makeRng } from './rng.mjs';
import { pickBirthYear, lifeQx, priceRatio, inflationRate, infantMortality, eraEventsAt, protoYear } from './era.mjs';
import { pickRegion, regionRatio, classOdds } from './birth.mjs';
import { monthlyWage, pickOccupation, portfolioReturn, lendingRate, assetReturn, assetOpen, assetName, isAllocAge, allocOptions, periodReturns, formatReturn, ALLOC, DISCLAIMER } from './finance.mjs';
import { newLedger, recordMerit, karmaMultiplier, omenTone, omenText, OMEN, netLedger } from './merit.mjs';

export const SEXES = ['ชาย', 'หญิง'];
// 10 ระดับตามเส้นแบ่ง decile ใน data/birthplace.json (rules.classes) — ต่ำไปสูง
// ชื่อเดิม 3 ระดับ (ยากจน · ชนชั้นกลาง · ร่ำรวย) คงไว้ที่ระดับ 3 · 6 · 9 เนื้อหาที่อ้างชื่อเดิมจึงยังใช้ได้
export const CLASSES = ['ยากไร้', 'ยากจนมาก', 'ยากจน', 'ค่อนข้างจน', 'ชนชั้นกลางล่าง', 'ชนชั้นกลาง', 'ชนชั้นกลางบน', 'มีอันจะกิน', 'ร่ำรวย', 'มั่งคั่ง'];
// ค่าแถบเริ่มเป็นค่าตั้งของเกม ไม่มีสถิติให้แปลงตรง ๆ — ตั้งไว้ 3 จุด ระดับอื่นลากเส้นตรงผ่าน (ปลายสองข้างต่อเส้นออกไป)
const START_ANCHORS = [
  [2, { health: 55, happiness: 50, knowledge: 30, relations: 60 }],
  [5, { health: 65, happiness: 55, knowledge: 45, relations: 60 }],
  [8, { health: 75, happiness: 60, knowledge: 60, relations: 55 }],
];
// ค่าเริ่มของแต่ละคนสุ่ม ±START_JITTER รอบค่าของฐานะ — คนฐานะเดียวกันไม่เกิดมาเหมือนกันทุกคน
export const START_JITTER = 8;
export function startStats(cls) {
  const d = CLASSES.indexOf(cls);
  const [a, b] = d <= START_ANCHORS[1][0] ? [START_ANCHORS[0], START_ANCHORS[1]] : [START_ANCHORS[1], START_ANCHORS[2]];
  const t = (d - a[0]) / (b[0] - a[0]);
  return Object.fromEntries(Object.keys(a[1]).map((k) => [k, a[1][k] + (b[1][k] - a[1][k]) * t]));
}
// ตารางกลางแปลงระดับ ±1/±2/±3 เป็นตัวเลข (ใบ 07) ปรับสมดุลที่จุดเดียว · ไม่เป็นเส้นตรงเพื่อให้ ±3 เป็นเหตุใหญ่จริง
export const LEVELS = { 1: 5, 2: 12, 3: 20 };
const STAT_KEYS = ['health', 'happiness', 'knowledge', 'relations'];
export const STAT_LABELS = { health: 'สุขภาพ', happiness: 'ความสุข', knowledge: 'ความรู้', relations: 'ความสัมพันธ์', money: 'เงิน' };

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
export const ERA_GAP = 3;
// ปีหนึ่งจับเหตุการณ์จากกองสุ่มได้ด้วยโอกาสนี้ (เมื่อกองมีใบที่เกิดได้) — ปรับให้ด่าน 4 (80–150 การ์ด) ผ่าน
export const POOL_CHANCE = 0.35;
// ตัวคูณรายได้ถาวรสะสมทั้งชีวิตอยู่ในเพดานนี้ — ผลซ้อนหลายครั้งไม่ทำให้รายได้หายหมดหรือพุ่งไร้ขอบ
export const INCOME_MULT = [0.25, 3];
// ผลเรื้อรังสะสมต่อค่าได้ไม่เกิน ±CHRONIC_MAX ระดับ · ไหลระดับละ CHRONIC_STEP หน่วยต่อปี
const CHRONIC_MAX = 3;
const CHRONIC_STEP = 0.35;
// ออกการ์ดสรุปอย่างน้อยทุก K ปี ถึงไม่มีอะไรเกิด · ปีที่มีเรื่อง (เปลี่ยนช่วง · ยุค · ลาง · จัดสรรเงิน) สรุปทันที
// ปีเงียบรวบเป็นใบเดียว — การ์ดสรุปทุกปีที่มีแค่เงินขยับอ่านแล้วเปล่า
export const SUMMARY_EVERY = 5;

const clamp = (v) => Math.max(0, Math.min(100, v));

function weighted(rng, items, weights) {
  let r = rng.next() * weights.reduce((s, w) => s + w, 0);
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r < 0) return items[i];
  }
  return items[items.length - 1];
}

// ช่วงอายุที่มีงานทำ [เริ่ม, เกษียณ) — แกนเติมเงินเก็บและหน้าจอแสดงรายได้จากเกณฑ์เดียวกัน
export const WORK_AGES = [22, 60];
export const isWorking = (age) => age >= WORK_AGES[0] && age < WORK_AGES[1];

// เงินเก็บต่อปี เป็นบาทของปีนั้น: ค่าจ้างตามอาชีพ × ภาค ทั้งปี × อัตราออม (ใบ 14)
export function yearlySaving(st, year = st.birthYear + st.age) {
  const era = st.content.era;
  return monthlyIncome(st, year) * 12 * era.birth.saveRate;
}

// รายได้/เดือนของชีวิตนี้: ค่าจ้างอาชีพ × ตัวคูณรายได้ถาวรจากเหตุการณ์
export function monthlyIncome(st, year = st.birthYear + st.age) {
  return monthlyWage(st.content.era, st.seed, st.occupation, st.ses, year) * st.incomeMult;
}

export function newLife(seed, content) {
  const era = content.era;
  const rng = makeRng(seed);
  const birthYear = pickBirthYear(rng, era);
  const sex = rng.pick(SEXES);
  const region = pickRegion(rng, era.birth);
  const odds = classOdds(era.birth, regionRatio(era.birth, region.ses, birthYear));
  const cls = weighted(rng, CLASSES, odds.map((o) => o.p));
  // ค่าเริ่มสุ่มจาก stream แยก — ไม่กินเลขสุ่มของโลก ลำดับสุ่มการตายจึงเหมือนก่อนมีการสุ่มนี้
  const jit = makeRng(seed ^ 0x6a09e667);
  const s = Object.fromEntries(Object.entries(startStats(cls)).map(([k, v]) => [k, clamp(v + (jit.next() * 2 - 1) * START_JITTER)]));
  const occupation = pickOccupation(era, seed, cls);
  const st = {
    rng,
    seed,
    content,
    birthYear,
    sex,
    region: region.name,
    ses: region.ses,
    cls,
    occupation: occupation.id,
    occupationName: occupation.name,
    edu: occupation.edu,
    // สัดส่วนเงินต่อสินทรัพย์ ปรับคืนทุกต้นปี · ก่อนการ์ดจัดสรรใบแรกเงินอยู่ในเงินฝาก
    alloc: { deposit: 1 },
    lastAllocYear: null,
    // ยอดสุทธิตอนตาย ให้ระหว่างชาติ/รุ่นถัดไป (B06) อ่าน — มีค่าเมื่อตายแล้วเท่านั้น
    estate: null,
    age: 0,
    health: s.health,
    happiness: s.happiness,
    knowledge: s.knowledge,
    relations: s.relations,
    money: 0,
    // เส้นสุขภาพของชีวิตนี้ถ้าไม่มีเหตุการณ์ใดเลย — ตัวคูณการตายวัดจากส่วนต่างกับเส้นนี้
    healthNatural: s.health,
    // บัญชีบุญบาปซ่อน — ห้ามส่งออกไปกับการ์ดหรือ statsOf
    ledger: newLedger(),
    omenTone: null,
    omenAge: null,
    flags: {},
    scheduled: [],
    baseHappiness: s.happiness,
    // ราคาปีนี้เป็นกี่เท่าของปีเกิด
    price: 1,
    // ผลตอบแทนจริงรายปีของสินทรัพย์เสี่ยงที่ถือ ตั้งแต่การ์ดใบก่อน — การ์ดสรุปเล่าย้อนหลังแล้วล้าง
    returns: [],
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
    // ค่าตอนเริ่มช่วงวัยปัจจุบัน — การ์ดเปลี่ยนช่วงเล่าว่าช่วงที่ผ่านมาเปลี่ยนไปเท่าไร
    stageMark: null,
    lastEraAge: null,
    // อายุล่าสุดที่จับกองสุ่มแล้ว — กันจับซ้ำเมื่อการ์ดอายุเดียวกันทำให้ลูปค้นซ้ำ
    poolAge: null,
    incomeMult: 1,
    chronic: {},
  };
  st.money = era.birth.startMoney[CLASSES.indexOf(cls)] * yearlySaving(st);
  st.lastCardMoney = st.money;
  st.trail.push({ year: birthYear, money: Math.round(st.money) });
  st.stageMark = markStage(st);
  return st;
}

function markStage(st) {
  return { age: st.age, stage: stageOf(st.age), price: st.price, money: st.money, ...Object.fromEntries(STAT_KEYS.map((k) => [k, st[k]])) };
}

// สรุปช่วงวัยที่เพิ่งจบ: ตัวเลือกที่เลือก + ค่าสถานะ/เงินต้นช่วง → ตอนนี้ · อ่าน state ล้วน ไม่ดึงเลขสุ่มของโลก
// ไม่มีค่าบัญชีบุญบาป — การ์ดทุกใบถูก harness ตรวจรั่ว
// lastAge = อายุสุดท้ายของช่วง: การ์ดเปลี่ยนช่วงออกตอนขึ้นอายุแรกของช่วงใหม่แล้ว
function stageRecap(st, lastAge) {
  const m = st.stageMark;
  return {
    stage: m.stage,
    fromAge: m.age,
    toAge: lastAge,
    picks: st.log.filter((x) => x.age >= m.age).map(({ age, text }) => ({ age, text })),
    stats: STAT_KEYS.map((k) => ({ key: k, label: STAT_LABELS[k], from: m[k], to: st[k] })),
    // ค่าเงินปีเกิดคู่กัน — เงินต้น/ท้ายช่วงเป็นบาทคนละปี เทียบตรง ๆ ไม่ได้
    money: { from: Math.round(m.money), to: Math.round(st.money), fromAtBirth: Math.round(m.money / m.price), toAtBirth: Math.round(st.money / st.price) },
  };
}

// ป้ายผลบนตัวเลือก (ใบ 07): ผลคงที่ = ↑/↓ · ผลสุ่มหรือค่าที่เหตุการณ์ซ่อน = ? · หวยสายมู = ? เสมอ (ใบ 12)
function choiceFx(ev, c) {
  if (c.outcomes || ev.belief?.kind === 'lottery_numen') return '?';
  const hidden = [...(ev.hidden ?? []), ...(c.hidden ?? [])];
  const fx = c.effects ?? {};
  const out = [];
  for (const k of [...STAT_KEYS, 'money']) {
    if (!fx[k]) continue;
    if (hidden.includes(k)) { out.push('?'); break; }
    const sign = k === 'money' && typeof fx[k] === 'object' ? Math.sign(fx[k].amount) : Math.sign(fx[k]);
    // ช่องว่างไม่ตัดบรรทัด: ลูกศรต้องติดชื่อค่า ไม่หล่นไปบรรทัดใหม่
    out.push(`${STAT_LABELS[k]}\u00a0${sign > 0 ? '↑' : '↓'}`);
  }
  if (fx.invest) out.push('ลงทุน');
  if (fx.income_mult) out.push(`รายได้\u00a0${fx.income_mult > 1 ? '↑' : '↓'}`);
  for (const [k, v] of Object.entries(fx.chronic ?? {})) out.push(`${STAT_LABELS[k]}\u00a0${v > 0 ? '↑' : '↓'}\u00a0ระยะยาว`);
  return out.join(' · ');
}

// โอกาสตายภายในปีนี้ = ตารางชีพจริงของปีปฏิทินนั้นตามอายุ/เพศ × ตัวคูณจากสุขภาพ (ใบ 03) × ตัวคูณกรรม (ใบ 09)
// ตัวคูณอิงส่วนต่างจากเส้นสุขภาพตามธรรมชาติของชีวิตนั้น ไม่ใช่ค่าคงที่ — ชีวิตที่ไม่มีเหตุการณ์จึงได้ qx จริงพอดี
// และสุขภาพที่ไหลลงตามวัยไม่ถูกนับซ้ำกับ qx ที่สูงขึ้นตามวัยอยู่แล้ว · สุขภาพแย่เพิ่มความเสี่ยงแรงกว่าสุขภาพดีลด
export function healthMultiplier(st) {
  const d = st.health - st.healthNatural;
  return d < 0 ? 1 - d / 50 : Math.max(0.6, 1 - d / 150);
}

export function deathChance(st) {
  const base = lifeQx(st.content.era, st.seed, st.sex, st.birthYear + st.age, st.age);
  if (base >= 1) return 1;
  return Math.min(1, base * healthMultiplier(st) * karmaMultiplier(st.ledger));
}

function fill(text, st) {
  return text
    .replaceAll('{อายุ}', st.age)
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
  if (fx.invest) invest(st, fx.invest);
  if (fx.income_mult) st.incomeMult = Math.max(INCOME_MULT[0], Math.min(INCOME_MULT[1], st.incomeMult * fx.income_mult));
  for (const [k, v] of Object.entries(fx.chronic ?? {})) {
    const lv = Math.max(-CHRONIC_MAX, Math.min(CHRONIC_MAX, (st.chronic[k] ?? 0) + v));
    if (lv) st.chronic[k] = lv;
    else delete st.chronic[k];
  }
}

// ย้ายสัดส่วน share ของเงินทั้งหมดเข้าสินทรัพย์เดียว · ด่าน build กั้นปีไว้แล้ว ถึงตรงนี้ปีผิด = เนื้อหาหลุดด่าน
function invest(st, { asset, share }) {
  if (!assetOpen(st.content.era, asset, st.birthYear + st.age)) throw new Error(`${assetName(asset)} ยังไม่มีในปี ${st.birthYear + st.age}`);
  const next = {};
  for (const [id, w] of Object.entries(st.alloc)) next[id] = w * (1 - share);
  next[asset] = (next[asset] ?? 0) + share;
  st.alloc = next;
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
  // ผลเรื้อรังไหลทุกปีจนกว่าจะมีผลกลับทาง · ไม่แตะเส้นสุขภาพธรรมชาติ — ป่วยเรื้อรังจึงเพิ่มโอกาสตายจริง
  for (const [k, lv] of Object.entries(st.chronic)) st[k] = clamp(st[k] + lv * CHRONIC_STEP);
  // ผลตอบแทนคิดกับเงินต้นปีก่อนเงินเก็บของปีนี้เข้า · ติดลบ = หนี้ ทบดอกเบี้ยเงินกู้ของปีนั้น
  const era = st.content.era;
  if (st.money > 0) {
    st.money *= 1 + portfolioReturn(era, st.seed, st.alloc, year);
    for (const id of Object.keys(st.alloc)) {
      if (id === 'cash' || id === 'deposit' || !assetOpen(era, id, year)) continue;
      st.returns.push({ age: st.age, id, r: assetReturn(era, st.seed, id, year) });
    }
  } else if (st.money < 0) st.money *= 1 + lendingRate(era, st.seed, year);
  if (isWorking(st.age)) st.money += yearlySaving(st, year);
  st.trail.push({ year, money: Math.round(st.money) });

  const stage = stageOf(st.age);
  const tone = omenTone(st.ledger);
  if (!tone) st.omenTone = null;
  else if (tone !== st.omenTone && (st.omenAge === null || st.age - st.omenAge >= OMEN.gap)) {
    st.omenTone = tone;
    st.omenAge = st.age;
    st.due.push({ kind: 'omen', tone, age: st.age, stage, text: omenText(tone, st.seed, st.age) });
  }
  if (stage !== prevStage) {
    st.due.push({ kind: 'stage', age: st.age, stage, text: `เข้าสู่ช่วง${stage}`, recap: stageRecap(st, st.age - 1) });
    st.stageMark = markStage(st);
  }
  if (isAllocAge(st.age)) st.due.push(allocCard(st, year, stage));
  // ทุกภาคเจอได้ เกิดซ้ำได้ (B14 ข้อ 13) · เว้นอย่างน้อย ERA_GAP ปีไม่ให้ถี่จนกลบเรื่องชีวิต — ปีที่เว้น เงินยังเสียตามปีต้นแบบ
  const eras = eraEventsAt(st.content.era, st.seed, year);
  if (eras.length && (st.lastEraAge === null || st.age - st.lastEraAge >= ERA_GAP)) {
    st.lastEraAge = st.age;
    for (const e of eras) {
      // มีการ์ดเนื้อหาผูกเหตุการณ์นี้ = ให้เลือกรับมือ · ไม่มี = การ์ดเล่าเรื่องเดิม
      const ev = st.content.events.find((c) => c.era === e.id && whenOk(st, c.when) && (c.when?.age || c.stage === stage));
      st.due.push(ev ? { kind: 'eraEvent', ev, age: st.age } : { kind: 'era', id: e.id, age: st.age, stage, eraKind: e.kind, text: e.name });
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
  for (const x of st.returns) items.push(`อายุ ${x.age} ${assetName(x.id)} ${formatReturn(x.r)}`);
  const disclaimer = st.returns.length ? DISCLAIMER : null;
  st.returns = [];
  return {
    kind: 'summary',
    disclaimer,
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

// การ์ดจัดสรรเงิน (ใบ 11) เล่าผลจริงของช่วงที่ผ่านมาก่อนให้เลือก — ไม่บอกปีถัดไป · ตัวเลือกสร้างตอนออกการ์ด
function allocCard(st, year, stage) {
  const era = st.content.era;
  const from = st.lastAllocYear === null ? year - ALLOC.every + 1 : st.lastAllocYear + 1;
  const items = periodReturns(era, st.seed, from, year).map((x) => `${x.name} ${formatReturn(x.r)}`);
  items.push(`ของแพงขึ้น ${formatReturn(priceRatio(era, st.seed, from - 1, year) - 1)}`);
  return {
    kind: 'alloc',
    age: st.age,
    stage,
    text: `อายุ ${st.age} ปี ทบทวนเงินเก็บ ${Math.round(st.money).toLocaleString('en-US')} บาท · ผลช่วงอายุ ${st.age - (year - from)}–${st.age}`,
    items,
    disclaimer: DISCLAIMER,
    choices: [],
  };
}

function emit(st, card) {
  st.cards++;
  st.lastCardAge = st.age;
  st.lastCardMoney = st.money;
  return card;
}

// การ์ดเลือกของเหตุการณ์ — ตั้ง pending ไว้ให้ choose อ่าน
function eventCard(st, ev) {
  st.pending = ev;
  return emit(st, {
    kind: 'event',
    id: ev.id,
    // แนวการ์ดตามประเภทเหตุการณ์ (ใบ 06): A ชีวิตจริง · B ความเชื่อ/แฟนตาซี
    type: ev.type ?? 'A',
    // การ์ดเนื้อหาที่ผูกเหตุการณ์บ้านเมือง — หน้าจอติดป้ายบ้านเมืองแทนช่วงวัย
    national: !!ev.era,
    age: st.age,
    stage: stageOf(st.age),
    title: ev.title ? fill(ev.title, st) : null,
    text: fill(ev.text, st),
    choices: ev.choices.map((c) => fill(c.text, st)),
    fx: ev.choices.map((c) => choiceFx(ev, c)),
  });
}

// เดินปีละครั้งจนมีการ์ดถึงกำหนดหรือตาย คืนการ์ดใบถัดไป
export function nextCard(st) {
  if (st.pending) throw new Error('ยังมีการ์ดที่รอเลือก');
  if (st.dead) return deathCard(st);
  // การ์ดเปลี่ยนช่วง/เหตุการณ์ยุค/ผลสุ่มเป็นใบของตัวเอง ตามหลังการ์ดสรุปของปีเดียวกัน
  if (st.queue.length) {
    const card = st.queue.shift();
    if (card.kind === 'eraEvent') return eventCard(st, card.ev);
    if (card.kind === 'alloc') {
      const options = allocOptions(st.content.era, st.birthYear + st.age);
      card.choices = options.map((o) => o.label);
      st.pending = { alloc: options };
    }
    return emit(st, card);
  }
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
    // years ของเหตุการณ์กั้นปีปฏิทินจริง — ด่าน build ตรวจปีสินทรัพย์/ระบบจาก years จึงต้องบังคับที่นี่ด้วย
    const year = st.birthYear + st.age;
    let ev = st.content.events.find((e) => !st.done[e.id] && (e.age === st.age || isScheduled(st, e.id)) && inYears(e, year) && whenOk(st, e.when));
    // กองสุ่มจับได้ปีละครั้ง หลังหลักไมล์/นัดของปีนั้นหมดแล้ว
    if (!ev && st.poolAge !== st.age) {
      st.poolAge = st.age;
      ev = drawPool(st, year);
    }
    if (ev) st.done[ev.id] = true;
    st.scheduled = st.scheduled.filter((x) => x.age >= st.age && !st.done[x.event]);
    if (ev) {
      // อายุนี้อาจมีเหตุการณ์อื่นรออยู่ (หลักไมล์ชนกับนัด) — ค้นอายุเดิมอีกรอบก่อนเดินปี
      st.advance = false;
      return eventCard(st, ev);
    }
  }
}

// กองสุ่ม (B14): เหตุการณ์ไม่มี at_age แต่มี weight · ใบเดิมไม่ซ้ำในชีวิต · ไม่มีใบที่เกิดได้ = ไม่ดึงเลขสุ่ม
// ชีวิตที่เนื้อหาไม่มีกองจึงได้ชะตาเดิมทุกหลัก
function drawPool(st, year) {
  const stage = stageOf(st.age);
  const pool = st.content.events.filter((e) => e.weight && e.age === undefined && !e.era && !st.done[e.id] && e.stage === stage && inYears(e, year) && whenOk(st, e.when));
  if (!pool.length || st.rng.next() >= POOL_CHANCE) return null;
  return weighted(st.rng, pool, pool.map((e) => e.weight * poolMultiplier(st, e.multipliers)));
}

// ตัวคูณโอกาสเกิด (ใบ 07): ค่าสถานะคูณแบบต่อเนื่อง m^((ค่า−50)/50) · กรรมตามทิศบัญชีสุทธิ · ธงที่ถืออยู่
// ชื่อเสียงตระกูลยังไม่มีระบบ คูณ 1
function poolMultiplier(st, m) {
  if (!m) return 1;
  let x = m.class?.[st.cls] ?? 1;
  for (const [k, v] of Object.entries(m.stats ?? {})) x *= v ** ((st[k] - 50) / 50);
  if (m.karma) x *= m.karma ** Math.sign(netLedger(st.ledger));
  for (const [f, v] of Object.entries(m.flags ?? {})) if (st.flags[f]) x *= v;
  return x;
}

const isScheduled = (st, id) => st.scheduled.some((x) => x.event === id && x.age === st.age);
const inYears = (e, year) => !e.years || (year >= e.years[0] && year <= e.years[1]);
const inRange = (v, r) => !r || (v >= r[0] && v <= r[1]);
const inBound = (v, b) => !b || ((b.min === undefined || v >= b.min) && (b.max === undefined || v <= b.max));
// เงื่อนไขเกิดแบบประกาศทุกฟิลด์ (ใบ 07) · family ยังไม่มีระบบครอบครัว จึงไม่ผ่านเสมอ
function whenOk(st, when) {
  if (!when) return true;
  if (when.family) return false;
  if (!inRange(st.age, when.age) || !inRange(st.birthYear + st.age, when.year)) return false;
  if (when.class && !when.class.includes(st.cls)) return false;
  if (when.region && !when.region.includes(st.region)) return false;
  if (when.sex && !when.sex.includes(st.sex)) return false;
  for (const [k, b] of Object.entries(when.stats ?? {})) if (!inBound(st[k], b)) return false;
  const f = when.flags;
  return !f || ((f.has ?? []).every((k) => st.flags[k]) && !(f.not ?? []).some((k) => st.flags[k]));
}

// ป้ายบุญบาปเข้าบัญชีซ่อน · ธง · นัดเหตุการณ์ต่อเนื่อง (ใบ 07) — นัดสุ่มปีจาก rng ของโลก เพราะเป็นผลของการเลือก
function applyChoice(st, ev, c) {
  // คำบนเดียวกันมีหลายการ์ดนัด (ครั้งที่ 1 · ครั้งที่ 2) — ใช้ธงคำบนที่การ์ดปิดเป็นตัวระบุ ไม่ใช่ id การ์ด
  const vow = (c.clears_flags ?? []).find((f) => f.startsWith('vow_open:')) ?? ev.id;
  for (const f of recordMerit(st.ledger, c.merit, vow)) st.flags[f] = true;
  for (const f of c.sets_flags ?? []) st.flags[f] = true;
  for (const f of c.clears_flags ?? []) delete st.flags[f];
  for (const s of c.schedules ?? []) st.scheduled.push({ event: s.event, age: st.age + st.rng.int(s.after_years[0], s.after_years[1]) });
}

export function choose(st, idx) {
  const ev = st.pending;
  if (ev?.alloc) {
    const opt = ev.alloc[idx];
    if (!opt) throw new Error('ตัวเลือกไม่ถูกต้อง');
    st.pending = null;
    if (opt.alloc) st.alloc = opt.alloc;
    st.lastAllocYear = st.birthYear + st.age;
    st.log.push({ id: 'alloc', age: st.age, choice: idx, text: opt.label });
    return;
  }
  if (!ev || !ev.choices[idx]) throw new Error('ตัวเลือกไม่ถูกต้อง');
  st.pending = null;
  // เติมข้อความก่อนผลลง — {เงิน} ต้องเป็นยอดตอนที่ผู้เล่นเห็นตัวเลือก
  const text = fill(ev.choices[idx].text, st);
  const c = ev.choices[idx];
  applyEffects(st, c.effects);
  applyChoice(st, ev, c);
  st.log.push({ id: ev.id, age: st.age, choice: idx, text });
  // ผลสุ่ม: จับทางด้วย rng ของโลก (เป็นผลของการเลือก) แล้วเล่าเป็นการ์ดผลลัพธ์ใบถัดไป
  if (c.outcomes?.length) {
    const o = weighted(st.rng, c.outcomes, c.outcomes.map((x) => x.weight));
    applyEffects(st, o.effects);
    applyChoice(st, ev, o);
    if (o.text) st.queue.unshift({ kind: 'result', type: ev.type ?? 'A', age: st.age, stage: stageOf(st.age), text: fill(o.text, st) });
  }
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
    },
  };
  st.estate = { year, money: card.summary.money, moneyAtBirth: card.summary.moneyAtBirth };
  // ช่วงวัยสุดท้ายไม่มีการ์ดเปลี่ยนช่วงมาปิด — เล่าบนบันทึกการตายแทน
  card.recap = stageRecap(st, st.age);
  // ใบ 07: ตายตอนเด็กได้บันทึกสั้นบอกสถิติยุคนั้น
  if (st.age < 5) {
    const imr = infantMortality(era, st.sex, protoYear(era, st.seed, st.birthYear));
    card.note = `ยุคนั้นทารก${st.sex}ไทยตายก่อนอายุ 1 ขวบ ราว ${Math.round(imr)} คนในทุก 1,000 คน`;
  }
  return card;
}

// "ภาค" นำหน้าไม่เข้ากับกรุงเทพฯ และปริมณฑล
export const regionLabel = (st) => (st.ses === 'bkk' ? st.region : `ภาค${st.region}`);

export function profileText(st) {
  return `เกิดปี ${st.birthYear} · ${st.sex} · ${regionLabel(st)} · ฐานะ${st.cls} · ${st.occupationName}`;
}

export function statsOf(st) {
  return { health: st.health, happiness: st.happiness, knowledge: st.knowledge, relations: st.relations, money: st.money };
}

// harness วิ่งชีวิตผ่านฟังก์ชันชุดเดียวกับหน้าเว็บ ผู้เรียกส่งแค่ตัวเลือกเลือกตัวเลือก · onCard เห็นสถานะทุกการ์ด
// บอทได้ st เพื่ออ่านป้ายบุญบาปของตัวเลือกแทนการอ่านความหมายของข้อความแบบที่ผู้เล่นทำ — ห้ามอ่านบัญชีเอง
// stream ของบอทแยกจาก rng ของแกนเกม เพื่อไม่ให้การเลือกไปเปลี่ยนลำดับสุ่มของโลก
export function playLife(seed, content, pickChoice, onCard) {
  const st = newLife(seed, content);
  const bot = makeRng(seed ^ 0x5bd1e995);
  for (;;) {
    const card = nextCard(st);
    onCard?.(card, st);
    if (card.kind === 'death') return { age: card.age, cards: st.cards + 1, state: st };
    if (card.choices?.length) choose(st, pickChoice(card, bot, st));
  }
}
