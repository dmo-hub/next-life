import { makeRng } from './rng.mjs';
import { pickBirthYear, lifeQx, priceRatio, inflationRate, infantMortality, eraEventsAt, protoYear } from './era.mjs';
import { pickRegion, regionRatio, classOdds, nationalIncome, pickName } from './birth.mjs';
import { monthlyWage, minWage, pickOccupation, portfolioReturn, lendingRate, assetReturn, assetOpen, assetName, isAllocAge, allocOptions, periodReturns, formatReturn, ALLOC, DISCLAIMER, newDebt, payDebt, debtDone, debtOpen, debtName, complainDebt } from './finance.mjs';
import { newLedger, recordMerit, karmaMultiplier, omenTone, omenText, OMEN, netLedger, ledgerLevel, meritName, SIN_CATS } from './merit.mjs';
import { TRACKS, SCHOOL_FROM, eduRank, schoolGate, jobCard } from './career.mjs';
import { beliefOk, beliefFired, beliefChoice } from './belief.mjs';
import { introCard, eraStory } from './intro.mjs';

export const SEXES = ['ชาย', 'หญิง'];
// 10 ระดับตามเส้นแบ่ง decile ใน data/birthplace.json (rules.classes) — ต่ำไปสูง
// ชื่อเดิม 3 ระดับ (ยากจน · ชนชั้นกลาง · ร่ำรวย) คงไว้ที่ระดับ 3 · 6 · 9 เนื้อหาที่อ้างชื่อเดิมจึงยังใช้ได้
export const CLASSES = ['ยากไร้', 'ยากจนมาก', 'ยากจน', 'ค่อนข้างจน', 'ชนชั้นกลางล่าง', 'ชนชั้นกลาง', 'ชนชั้นกลางบน', 'มีอันจะกิน', 'ร่ำรวย', 'มั่งคั่ง'];
// ค่าแถบเริ่มเป็นค่าตั้งของเกม ไม่มีสถิติให้แปลงตรง ๆ — ตั้งไว้ 3 จุด ระดับอื่นลากเส้นตรงผ่าน (ปลายสองข้างต่อเส้นออกไป)
// คอนเน็คชั่นต่อท้ายเสมอ — ค่าเริ่มสุ่มทีละ key ตามลำดับ ค่าเดิม 4 ตัวจึงได้เลขสุ่มชุดเดิม
const START_ANCHORS = [
  [2, { health: 55, happiness: 50, knowledge: 30, relations: 60, network: 20 }],
  [5, { health: 65, happiness: 55, knowledge: 45, relations: 60, network: 40 }],
  [8, { health: 75, happiness: 60, knowledge: 60, relations: 55, network: 65 }],
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
// network ไม่แตะการตาย (อ่านแค่ health) — เปิดทางงาน/ผลสมัครงานเท่านั้น
export const STAT_KEYS = ['health', 'happiness', 'knowledge', 'relations', 'network'];
export const STAT_LABELS = { health: 'สุขภาพ', happiness: 'ความสุข', knowledge: 'ความรู้', relations: 'ความสัมพันธ์', network: 'คอนเน็คชั่น', money: 'เงิน' };

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
// ปีหนึ่งจับเหตุการณ์จากกองสุ่มได้ด้วยโอกาสนี้ (เมื่อกองมีใบที่เกิดได้) แยกตามช่วงวัย — วัยรุ่น/หนุ่มสาวสั้นแต่เรื่องเยอะ
// ชราเป็นช่วงยาวสุด ถ้าถี่เท่ากันการ์ดจะล้นเพดานด่าน 4 (80–150 การ์ด)
export const POOL_CHANCE = { เด็ก: 0.3, วัยรุ่น: 0.5, หนุ่มสาว: 0.45, ทำงาน: 0.35, กลางคน: 0.35, ชรา: 0.3 };
// ตัวคูณรายได้ถาวรสะสมทั้งชีวิตอยู่ในเพดานนี้ — ผลซ้อนหลายครั้งไม่ทำให้รายได้หายหมดหรือพุ่งไร้ขอบ
export const INCOME_MULT = [0.1, 5];
// ผลเรื้อรังสะสมต่อค่าได้ไม่เกิน ±CHRONIC_MAX ระดับ · ไหลระดับละ CHRONIC_STEP หน่วยต่อปี · จางลงระดับละ 1 ทุก CHRONIC_FADE ปี
// สุขภาพไหลเบากว่าค่าอื่น: การตายอ่านสุขภาพตัวเดียว ค่าแรงกว่านี้ดึงอายุตายของบอทหลุดด่าน 3b · ค่าอื่นไม่แตะการตาย
const CHRONIC_MAX = 3;
const CHRONIC_STEP = { health: 0.35, happiness: 1, knowledge: 1, relations: 1, network: 1 };
const CHRONIC_FADE = 5;
// ตัวคูณตามค่าสถานะเป็นขั้นบันได: คนเขียนเนื้อหารู้ว่าค่าเท่าไรถึงนับว่า "สูง/ต่ำ" ไม่ต้องคิดเลขยกกำลัง
const STAT_HIGH = 70;
const STAT_LOW = 30;
const clamp = (v) => Math.max(0, Math.min(100, v));

export function weighted(rng, items, weights) {
  let r = rng.next() * weights.reduce((s, w) => s + w, 0);
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r < 0) return items[i];
  }
  return items[items.length - 1];
}

// เริ่มทำงานเมื่อได้งานแรก (เลิกเรียนอายุไหนก็เริ่มอายุนั้น) จนเกษียณ — แกนเติมเงินเก็บและหน้าจอแสดงรายได้จากเกณฑ์เดียวกัน
export const RETIRE_AGE = 60;
export const isWorking = (st, age = st.age) => st.workFrom !== null && age >= st.workFrom && age < RETIRE_AGE;

// ป้ายสถานะงานบนจอ: ก่อนมีงานไม่โชว์อาชีพ (อาชีพตอนเกิดเป็นของครอบครัว ใช้คิดเงินติดตัวเท่านั้น)
export function jobText(st, age = st.age) {
  if (st.workFrom === null) {
    if (st.school && age >= SCHOOL_FROM) return `กำลังเรียน${TRACKS[st.school].name}`;
    return age < SCHOOL_FROM ? 'ยังไม่เข้าเรียน' : 'ยังไม่ทำงาน';
  }
  return age >= RETIRE_AGE ? `เกษียณ (เคยเป็น${st.occupationName})` : st.occupationName;
}

// เงินเก็บต่อปี เป็นบาทของปีนั้น: ค่าจ้างตามอาชีพ × ภาค ทั้งปี × อัตราออม (ใบ 14)
export function yearlySaving(st, year = st.birthYear + st.age) {
  const era = st.content.era;
  return monthlyIncome(st, year) * 12 * era.birth.saveRate;
}

// รายได้/เดือนของชีวิตนี้: ค่าจ้างอาชีพ × ตัวคูณรายได้ถาวรจากเหตุการณ์
export function monthlyIncome(st, year = st.birthYear + st.age) {
  return monthlyWage(st.content.era, st.seed, st.occupation, st.ses, year) * st.incomeMult;
}

// heir = รุ่นถัดไปจากระหว่างชาติ (afterlife.mjs): จุดเกิด/ฐานะ/ค่าเริ่ม/บัญชีที่ส่งต่อ ทับค่าที่สุ่ม
// ยังดึงเลขสุ่มของโลกครบชุดเดิมก่อนทับ — ตำแหน่ง stream ของรุ่นถัดไปเหมือนชีวิตแรกทุกประการ
export function newLife(seed, content, heir = null) {
  const era = content.era;
  const rng = makeRng(seed);
  let birthYear = pickBirthYear(rng, era);
  let sex = rng.pick(SEXES);
  let region = pickRegion(rng, era.birth);
  const odds = classOdds(era.birth, regionRatio(era.birth, region.ses, birthYear));
  let cls = weighted(rng, CLASSES, odds.map((o) => o.p));
  if (heir) ({ birthYear, sex, region, cls } = heir);
  // ค่าเริ่มสุ่มจาก stream แยก — ไม่กินเลขสุ่มของโลก ลำดับสุ่มการตายจึงเหมือนก่อนมีการสุ่มนี้
  const jit = makeRng(seed ^ 0x6a09e667);
  const s = Object.fromEntries(Object.entries(startStats(cls)).map(([k, v]) => [k, clamp(v + (jit.next() * 2 - 1) * START_JITTER + (heir?.bonus[k] ?? 0))]));
  const occupation = (heir?.occupation && era.finance.occupations.find((o) => o.id === heir.occupation)) ?? pickOccupation(era, seed, cls);
  // พ่อแม่ใช้ stream แยก — การมีพ่อแม่ไม่กินเลขสุ่มของโลก ลำดับสุ่มการตายของตัวเองจึงไม่ขยับ
  // อายุพ่อแม่ตอนเกิดเป็นค่าตั้งของเกม (ยังไม่มีข้อมูลอายุแม่ตอนคลอดรายยุคในชุดข้อมูล)
  const famRng = makeRng(seed ^ 0x3c6ef372);
  const motherAge = famRng.int(18, 40);
  const parents = heir?.parents ?? [
    { sex: 'หญิง', age: motherAge, alive: true },
    { sex: 'ชาย', age: motherAge + famRng.int(0, 8), alive: true },
  ];
  const st = {
    rng,
    seed,
    content,
    birthYear,
    sex,
    // heir ของ harness ไม่มี lineage — ไม่มีรุ่นก่อนให้เลี่ยงชื่อ
    name: pickName(seed, sex, birthYear, era.names, (heir?.lineage ?? []).map((l) => l.name)),
    region: region.name,
    ses: region.ses,
    cls,
    // ก่อนได้งาน occupation = อาชีพของครอบครัว เป็นฐานของเงินในผลการ์ด (income_x) · ได้งานแล้วเปลี่ยนเป็นงานของตัวเอง
    occupation: occupation.id,
    occupationName: occupation.name,
    familyOcc: occupation.id,
    workFrom: null,
    // ช่วงเรียนปัจจุบัน (null = เลิกเรียนแล้ว) · วุฒิที่จบจริง (null = ยังไม่จบอะไร)
    school: 'primary',
    edu: null,
    needJob: false,
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
    network: s.network,
    money: 0,
    // หนี้รายก้อน (B08b) แยกจากเงิน · เงินติดลบยังเป็นหนี้เงินกู้ทบดอกแบบเดิม (จ่ายงวดไม่พอ = เงินติดลบ)
    debts: [],
    // ปีติดกันที่หนี้สุทธิเกินเกณฑ์ล้มละลาย · จำนวนครั้งที่ล้มละลาย
    debtYears: 0,
    bankruptcies: 0,
    // รายได้ทั้งปีของปีสุดท้ายที่ทำงาน เป็นบาทค่าเงินปีเกิด — ฐานรายจ่ายหลังเกษียณและเกณฑ์ล้มละลายของคนเกษียณ
    retireBase: null,
    // เส้นสุขภาพของชีวิตนี้ถ้าไม่มีเหตุการณ์ใดเลย — ตัวคูณการตายวัดจากส่วนต่างกับเส้นนี้
    healthNatural: s.health,
    // บัญชีบุญบาปซ่อน — ห้ามส่งออกไปกับการ์ดหรือ statsOf
    ledger: heir?.ledger ?? newLedger(),
    // รุ่นที่เท่าไรของตระกูล + บันทึกรุ่นก่อน · มรดกจากรุ่นก่อนที่ยังไม่ถึงอายุรับ (ทางเป็นลูก)
    gen: heir?.gen ?? 1,
    lineage: heir?.lineage ?? [],
    legacy: heir?.legacy ?? null,
    // อายุที่ธงแต่ละตัวติดครั้งแรก — ระหว่างชาติอ่านอายุตอนมีลูก
    flagAge: {},
    omenTone: null,
    omenAge: null,
    flags: {},
    scheduled: [],
    baseHappiness: s.happiness,
    // ราคาปีนี้เป็นกี่เท่าของปีเกิด
    price: 1,
    // ผลตอบแทนจริงรายปีของสินทรัพย์เสี่ยงที่ถือ ตั้งแต่ต้นช่วงวัย — การ์ดเปลี่ยนช่วงเล่าย้อนหลังแล้วล้าง
    returns: [],
    trail: [],
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
    // อายุที่ระดับเรื้อรังของค่านั้นเปลี่ยนล่าสุด — นับรอบจางจากจุดนี้
    chronicAge: {},
    // เหตุการณ์ที่ออกแล้ว: จำนวนครั้ง + อายุครั้งล่าสุด ให้ใบที่ตั้ง repeat ออกซ้ำตามช่วงเว้น
    fired: {},
    parents,
    famRng,
  };
  st.money = era.birth.startMoney[CLASSES.indexOf(cls)] * yearlySaving(st);
  // การ์ดเปิดชีวิตมาก่อนการ์ดมรดกตอนแรกเกิด — ต้องเล่ามรดกก่อน receiveLegacy ล้าง st.legacy
  st.due.push(introCard(st, heir));
  if (st.legacy?.age === 0) receiveLegacy(st, birthYear, stageOf(0));
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
  const items = st.returns.map((x) => `อายุ ${x.age} ${assetName(x.id)} ${formatReturn(x.r)}`);
  for (const d of st.debts) items.push(`${debtName(d.kind)} ค้าง ${Math.round(d.balance).toLocaleString('en-US')} บาท`);
  const disclaimer = st.returns.length ? DISCLAIMER : null;
  st.returns = [];
  return {
    items,
    disclaimer,
    moneySeries: st.trail.filter((p) => p.year >= st.birthYear + m.age),
    stage: m.stage,
    fromAge: m.age,
    toAge: lastAge,
    picks: st.log.filter((x) => x.age >= m.age).map(({ age, text }) => ({ age, text })),
    stats: STAT_KEYS.map((k) => ({ key: k, label: STAT_LABELS[k], from: m[k], to: st[k] })),
    money: { from: Math.round(m.money), to: Math.round(st.money) },
  };
}

// ความแรงของผลทางหนึ่งเป็นแต้มเดียว (ระดับค่าสถานะ + เรื้อรัง + เงิน + รายได้) ใช้วัดความกว้างของผลสุ่ม
// อ่านเนื้อหาล้วน ไม่อ่าน state — ป้ายเสี่ยงจึงไม่บอกค่าที่ซ่อนอยู่ เช่นบัญชีบุญบาปที่เอียงผล
function outcomeScore(o) {
  const fx = o.effects ?? {};
  let s = 0;
  for (const k of STAT_KEYS) s += fx[k] ?? 0;
  for (const v of Object.values(fx.chronic ?? {})) s += v;
  const m = fx.money;
  if (m) s += m.unit === 'income_x' ? Math.sign(m.amount) * Math.min(3, Math.max(1, Math.round(Math.abs(m.amount)))) : Math.sign(m.amount ?? m) * 2;
  if (fx.income_mult) s += fx.income_mult > 1 ? 2 : -2;
  return s;
}
// เกณฑ์แบ่งความกว้างของผล (แต้มสูงสุด − ต่ำสุด) เป็น 3 ระดับที่ผู้เล่นเห็น
export const RISK = [[2, 'เสี่ยงต่ำ'], [5, 'เสี่ยงกลาง'], [Infinity, 'เสี่ยงสูง']];
export function riskLabel(outcomes) {
  const s = outcomes.map(outcomeScore);
  const spread = Math.max(...s) - Math.min(...s);
  return RISK.find(([max]) => spread <= max)[1];
}

// ป้ายผลบนตัวเลือก (ใบ 07): ผลคงที่ = ↑/↓ · ค่าที่เหตุการณ์ซ่อน = ? · หวยสายมู = ? เสมอ (ใบ 12)
// ผลสุ่มที่มีทางสำเร็จ (ok) = % สำเร็จ · ผลสุ่มที่ไม่มีทางสำเร็จ = ระดับเสี่ยงจากความกว้างของผล
function choiceFx(st, ev, c) {
  if (ev.belief?.kind === 'lottery_numen') return '?';
  const fixed = fixedFx(ev, c);
  if (!c.outcomes?.length) return fixed;
  return [fixed, outcomeFx(st, c)].filter(Boolean).join(' · ');
}

// ทางที่เอียงด้วยบัญชีบุญบาปโชว์ ? — % จะบอกยอดบัญชีที่ต้องซ่อนจนตาย
function outcomeFx(st, c) {
  if (!c.outcomes.some((o) => o.ok)) return riskLabel(c.outcomes);
  if (c.outcomes.some((o) => o.multipliers?.karma || o.multipliers?.wish)) return 'สำเร็จ ?';
  return `สำเร็จ ~${successPct(st, c)}%`;
}

// โอกาสได้ทางสำเร็จ ปัดเป็นขั้น PCT_STEP ไม่โชว์ 0/100 · ผลของตัวเลือกลงก่อนสุ่มทาง (choose)
// จึงคิดบนค่าหลังผลตัวเลือกในสำเนา ไม่แตะ state จริง
export const PCT_STEP = 5;
export function successPct(st, c) {
  const fx = c.effects ?? {};
  const p = { ...st, flags: { ...st.flags } };
  for (const k of STAT_KEYS) if (fx[k]) p[k] = clamp(p[k] + levelValue(fx[k]));
  for (const f of c.sets_flags ?? []) p.flags[f] = true;
  for (const f of c.clears_flags ?? []) delete p.flags[f];
  const w = c.outcomes.map((o) => o.weight * poolMultiplier(p, o.multipliers));
  const r = w.reduce((s, x, i) => s + (c.outcomes[i].ok ? x : 0), 0) / w.reduce((s, x) => s + x, 0);
  return Math.max(PCT_STEP, Math.min(100 - PCT_STEP, Math.round((r * 100) / PCT_STEP) * PCT_STEP));
}

function fixedFx(ev, c) {
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
  if (fx.debt) out.push(`กู้${debtName(fx.debt.kind)}`);
  if (fx.settle) out.push(`ปิด${debtName(fx.settle)}`);
  if (fx.complain) out.push('ร้องเรียนดอกโหด');
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

// ช่องแทนค่าครบทุกตัวในรายการปิดของด่าน build (PLACEHOLDERS) — ตัวที่ไม่เติมจะโผล่เป็น {ชื่อ} ดิบบนการ์ด
// ชื่อ = ชื่อเล่นที่สุ่มตอนเกิด (คำบรรยายยังเรียกผู้เล่นว่า "คุณ") · ลูกยังไม่มีชื่อ: เพศลูกรู้ตอนส่งไปเกิด ชื่อจึงตั้งที่รุ่นถัดไป
// จังหวัด = ภาคที่เกิด · คำพูดตามเพศ
export const FILL = {
  อายุ: (st) => st.age,
  ภาค: (st) => regionLabel(st),
  จังหวัด: (st) => regionLabel(st),
  เงิน: (st) => Math.round(st.money).toLocaleString('en-US'),
  ชื่อ: (st) => st.name,
  ชื่อลูก: () => 'ลูก',
  ครับ: (st) => (st.sex === 'หญิง' ? 'ค่ะ' : 'ครับ'),
  ผม: (st) => (st.sex === 'หญิง' ? 'ฉัน' : 'ผม'),
};
export function fill(text, st) {
  return text.replace(/\{([^{}]*)\}/g, (m, k) => (FILL[k] ? String(FILL[k](st)) : m));
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
  if (fx.debt) borrow(st, fx.debt);
  if (fx.settle) settle(st, fx.settle);
  if (fx.complain) for (const d of st.debts) complainDebt(st.content.era, d);
  if (fx.income_mult) st.incomeMult = Math.max(INCOME_MULT[0], Math.min(INCOME_MULT[1], st.incomeMult * fx.income_mult));
  if (fx.school) {
    st.school = fx.school === 'none' ? null : fx.school;
    if (!st.school && st.workFrom === null) st.needJob = true;
  }
  if (fx.job) {
    const o = st.content.era.finance.occupations.find((x) => x.id === fx.job);
    if (!o) throw new Error(`อาชีพไม่รู้จัก: ${fx.job}`);
    st.occupation = o.id;
    st.occupationName = o.name;
    if (st.workFrom === null) st.workFrom = st.age;
    // ตัวคูณรายได้ผูกกับงานเดิม เปลี่ยนงานแล้วเริ่มนับใหม่
    st.incomeMult = 1;
  }
  for (const [k, v] of Object.entries(fx.chronic ?? {})) {
    const lv = Math.max(-CHRONIC_MAX, Math.min(CHRONIC_MAX, (st.chronic[k] ?? 0) + v));
    if (lv) st.chronic[k] = lv;
    else delete st.chronic[k];
    st.chronicAge[k] = st.age;
  }
}

// เรื้อรังไหลทุกปี แล้วจางลงระดับละ 1 ทุก CHRONIC_FADE ปีนับจากครั้งล่าสุดที่ระดับเปลี่ยน
// ไม่แตะเส้นสุขภาพธรรมชาติ — ป่วยเรื้อรังจึงเพิ่มโอกาสตายจริง
function flowChronic(st) {
  for (const [k, lv] of Object.entries(st.chronic)) {
    st[k] = clamp(st[k] + lv * CHRONIC_STEP[k]);
    if (st.age - st.chronicAge[k] < CHRONIC_FADE) continue;
    const next = lv - Math.sign(lv);
    if (next) st.chronic[k] = next;
    else delete st.chronic[k];
    st.chronicAge[k] = st.age;
  }
}

// พ่อแม่แก่และตายตามตารางชีพเดียวกับตัวเอง (แนวชีวิตของปีปฏิทินนั้น) ด้วย stream ของครอบครัว
// พ่อ/แม่ที่เป็นผู้เล่นรุ่นก่อน (diesAt) ตายตามชะตาที่เล่นไปแล้ว ไม่สุ่มซ้ำ
function ageParents(st, year) {
  for (const p of st.parents) {
    if (!p.alive) continue;
    p.age += 1;
    const roll = st.famRng.next();
    if (p.diesAt !== undefined ? p.age >= p.diesAt : roll < lifeQx(st.content.era, st.seed, p.sex, year, p.age)) p.alive = false;
  }
}

// มรดกจากรุ่นก่อน (ทางเป็นลูก) ถึงมือปีที่พ่อ/แม่ผู้เล่นรุ่นก่อนตาย · เก็บเป็นเท่าของรายได้ครัวเรือนทั้งปีของประเทศ แปลงเป็นบาทของปีนี้
function receiveLegacy(st, year, stage) {
  const { units, debt, from } = st.legacy;
  st.legacy = null;
  // มรดกมาพร้อมการจากไป — มรดกตอนแรกเกิด (ตายปีที่ลูกเกิด) ต้องปิดชีวิตพ่อ/แม่ตรงนี้ ageParents ยังไม่เคยเดิน
  for (const p of st.parents) if (p.ancestor) p.alive = false;
  const baht = units * nationalIncome(st.content.era, st.seed, year) * 12;
  st.money += baht;
  const ancestor = st.parents.find((p) => p.ancestor);
  const who = from ?? (ancestor?.sex === 'หญิง' ? 'แม่' : 'พ่อ');
  const sum = Math.round(baht).toLocaleString('en-US');
  // หลาน/เหลน (B18): รุ่นก่อนไม่ใช่พ่อแม่ มรดกตกทอดผ่านพ่อแม่ — พ่อแม่ไม่ได้จากไปด้วย
  const text = !ancestor && from
    ? (baht > 0 ? `มรดกจาก${who}ตกทอดผ่านพ่อแม่มาถึงเรา ${sum} บาท` : debt ? `${who}จากไปพร้อมหนี้ ทายาทรับผิดไม่เกินมรดก หนี้จึงไม่ตกถึงเรา` : `${who}จากไป ไม่มีทรัพย์เหลือตกทอดมาถึงเรา`)
    : baht > 0
      ? `${who}จากไป ทิ้งมรดกส่วนของเราไว้ ${sum} บาท`
      : debt
        ? `${who}จากไปพร้อมหนี้ ทายาทรับผิดไม่เกินมรดกที่ได้ หนี้ที่เหลือจึงไม่ตกถึงเรา`
        : `${who}จากไป ไม่มีทรัพย์เหลือเป็นมรดก`;
  st.due.push({ kind: 'result', type: 'A', age: st.age, stage, text });
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
  // ปีสุดท้ายที่ทำงานต้องวัดก่อนขึ้นอายุ — ขึ้นแล้ว isWorking เป็นเท็จ
  if (isWorking(st) && st.age + 1 === RETIRE_AGE) st.retireBase = (monthlyIncome(st) * 12) / st.price;
  st.age += 1;
  const year = st.birthYear + st.age;
  st.price *= 1 + inflationRate(st.content.era, st.seed, year) / 100;

  const r = healthDecay(st.age);
  st.health = clamp(st.health * (1 - r));
  st.healthNatural *= 1 - r;
  st.happiness = clamp(st.happiness + (st.baseHappiness - st.happiness) * HAPPY_PULL);
  st.knowledge = clamp(st.knowledge + (knowledgeGain(st.age) * (100 - st.knowledge)) / 100);
  st.relations = clamp(st.relations * (1 - RELATION_FADE));
  flowChronic(st);
  ageParents(st, year);
  // ผลตอบแทนคิดกับเงินต้นปีก่อนเงินเก็บของปีนี้เข้า · ติดลบ = หนี้ ทบดอกเบี้ยเงินกู้ของปีนั้น
  const era = st.content.era;
  if (st.money > 0) {
    st.money *= 1 + portfolioReturn(era, st.seed, st.alloc, year);
    for (const id of Object.keys(st.alloc)) {
      if (id === 'cash' || id === 'deposit' || !assetOpen(era, id, year)) continue;
      st.returns.push({ age: st.age, id, r: assetReturn(era, st.seed, id, year) });
    }
  } else if (st.money < 0) st.money *= 1 + lendingRate(era, st.seed, year);
  if (isWorking(st)) st.money += yearlySaving(st, year);
  else if (st.retireBase !== null) st.money -= retireSpend(st, year);
  for (const d of st.debts) st.money -= payDebt(era, st.seed, d, year);
  st.debts = st.debts.filter((d) => !debtDone(d));
  const stage = stageOf(st.age);
  if (st.legacy && st.age >= st.legacy.age) receiveLegacy(st, year, stage);
  st.trail.push({ year, money: Math.round(st.money) });

  checkBankrupt(st, year, stage);
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
  // จบช่วงเรียน: ได้วุฒิ แล้วออกด่านเรียนต่อ หรือการ์ดหางานถ้าเป็นช่วงสุดท้าย
  const track = st.school && TRACKS[st.school];
  if (track && st.age === track.until) {
    if (eduRank(track.edu) > eduRank(st.edu)) st.edu = track.edu;
    if (track.gate) st.due.push({ kind: 'eraEvent', ev: schoolGate(st), age: st.age });
    else {
      st.school = null;
      st.due.push({ kind: 'eraEvent', ev: jobCard(st), age: st.age });
    }
  }
  if (isAllocAge(st.age)) st.due.push(allocCard(st, year, stage));
  // ทุกภาคเจอได้ เกิดซ้ำได้ (B14 ข้อ 13) · เว้นอย่างน้อย ERA_GAP ปีไม่ให้ถี่จนกลบเรื่องชีวิต — ปีที่เว้น เงินยังเสียตามปีต้นแบบ
  const eras = eraEventsAt(st.content.era, st.seed, year);
  if (eras.length && (st.lastEraAge === null || st.age - st.lastEraAge >= ERA_GAP)) {
    st.lastEraAge = st.age;
    for (const e of eras) {
      // เล่าเหตุการณ์บ้านเมืองก่อนเสมอ · มีการ์ดเนื้อหาผูกไว้ = ตามด้วยการ์ดให้เลือกรับมือ
      st.due.push({ kind: 'era', id: e.id, age: st.age, stage, eraKind: e.kind, text: e.name, story: eraStory(st, e) });
      // ใบรับมือเดิมไม่ออกซ้ำในชีวิตเดียว — เหตุการณ์เกิดซ้ำได้ แต่ข้อความ/ผลเดิมทุกตัวอักษรอ่านเหมือนบั๊ก · ครั้งหลังเล่าแค่การ์ดบ้านเมือง
      const ev = st.content.events.find((c) => c.era === e.id && !st.done[c.id] && whenOk(st, c.when) && (c.when?.age || c.stage === stage));
      if (ev) {
        st.done[ev.id] = true;
        st.due.push({ kind: 'eraEvent', ev, age: st.age });
      }
    }
  }
}

// รายจ่ายหลังเกษียณ/ปี = พื้นค่าครองชีพ (เท่าของค่าแรงขั้นต่ำทั้งปี) + สัดส่วนของรายได้ปีสุดท้าย
// สัดส่วนล้วนกินเงินเก็บทุกฐานะเท่ากันจนครึ่งล่างแบน · พื้นคงที่ทำให้คนรายได้น้อยกินเงินเก็บเร็วกว่า
function retireSpend(st, year) {
  const f = st.content.era.finance;
  const floor = f.debt.retireFloor * minWage(st.content.era, st.seed, year) * f.daysPerMonth * 12;
  return floor + f.debt.retireSpend * st.retireBase * st.price;
}

export const totalDebt = (st) => st.debts.reduce((s, d) => s + d.balance, 0);
// ทรัพย์สุทธิ = เงิน − หนี้รายก้อน (เงินติดลบนับเป็นหนี้อยู่แล้ว)
export const netWorth = (st) => st.money - totalDebt(st);

// รายได้ทั้งปีที่ใช้วัดว่าหนี้ท่วมแค่ไหน: ทำงานอยู่ = รายได้ปีนี้ · เกษียณแล้ว = รายได้ปีสุดท้ายปรับเงินเฟ้อ
// ยังไม่เคยทำงาน (เรียนอยู่ระหว่างปลอดหนี้ กยศ.) ไม่มีฐาน จึงไม่นับ
function debtIncome(st, year) {
  if (isWorking(st)) return monthlyIncome(st, year) * 12;
  return st.retireBase === null ? null : st.retireBase * st.price;
}

// ล้มละลาย (B08b): หนี้สุทธิเกิน k เท่าของรายได้ทั้งปีติดกัน n ปี → ล้างหนี้ ทรัพย์เหลือ 0 · ไม่แตะสุขภาพ
function checkBankrupt(st, year, stage) {
  const { k, n } = st.content.era.finance.debt.bankrupt;
  const base = debtIncome(st, year);
  st.debtYears = base !== null && -netWorth(st) > k * base ? st.debtYears + 1 : 0;
  if (st.debtYears < n) return;
  st.debtYears = 0;
  st.bankruptcies++;
  st.debts = [];
  st.money = 0;
  st.alloc = { deposit: 1 };
  st.flags.bankrupt = true;
  st.happiness = clamp(st.happiness - LEVELS[2]);
  st.relations = clamp(st.relations - LEVELS[1]);
  st.due.push({ kind: 'result', type: 'A', age: st.age, stage, text: 'ศาลสั่งล้มละลาย ทรัพย์ที่มีถูกนำไปชำระเจ้าหนี้ หนี้ที่เหลือถูกล้าง เริ่มนับหนึ่งใหม่' });
}

// กู้ก้อนใหม่: เงินกู้เข้ากระเป๋าทั้งก้อน แล้วผ่อนคืนทุกปีใน stepYear · ด่าน build กั้นปีไว้แล้ว ถึงตรงนี้ปีผิด = เนื้อหาหลุดด่าน
function borrow(st, { kind, amount }) {
  const year = st.birthYear + st.age;
  const era = st.content.era;
  if (!debtOpen(era, kind, year)) throw new Error(`${debtName(kind)} ยังไม่มีในปี ${year}`);
  const baht = moneyValue(st, amount);
  st.money += baht;
  st.debts.push(newDebt(era, st.seed, kind, baht, year));
}

// ปิดหนี้ทุกก้อนของชนิดนั้นด้วยเงินที่มี · เงินไม่พอ = เงินติดลบ ทบดอกเงินกู้ปกติแทน (ย้ายหนี้ออกจากดอกโหด)
function settle(st, kind) {
  for (const d of st.debts) if (d.kind === kind) st.money -= d.balance;
  st.debts = st.debts.filter((d) => d.kind !== kind);
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
  return card;
}

// การ์ดเลือกของเหตุการณ์ — ตั้ง pending ไว้ให้ choose อ่าน
function eventCard(st, ev) {
  // การ์ดเล่าเรื่อง (choices: [] ใบ 07) ไม่มีอะไรให้เลือก — ไม่ตั้ง pending ไม่งั้นใบถัดไปเปิดไม่ได้
  st.pending = ev.choices.length ? ev : null;
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
    fx: ev.choices.map((c) => choiceFx(st, ev, c)),
    // เหตุผลที่ตัวเลือกกดไม่ได้ (null = กดได้) — หน้าจอแสดงเทาพร้อมเหตุผล
    locked: ev.choices.map((c) => lockReason(st, c)),
  });
}

// ตัวเลือกที่ต้องมีเงิน/ค่าสถานะ/ธงถึงจะเลือกได้ (B14 A6) · ข้อความเหตุผลจากเนื้อหาทับข้อความตั้งต้น
function lockReason(st, c) {
  const q = c.requires;
  if (!q) return null;
  const why = [];
  if (q.money && st.money < moneyValue(st, q.money)) why.push('เงินไม่พอ');
  for (const [k, b] of Object.entries(q.stats ?? {})) {
    if (b.min !== undefined && st[k] < b.min) why.push(`${STAT_LABELS[k]}ไม่ถึง`);
    if (b.max !== undefined && st[k] > b.max) why.push(`${STAT_LABELS[k]}มากเกินไป`);
  }
  if (q.flags && !flagsOk(st, q.flags)) why.push('ยังไม่เข้าเงื่อนไข');
  if (q.edu && eduRank(st.edu) < eduRank(q.edu)) why.push('วุฒิไม่ถึง');
  if (q.family && !q.family.every((f) => familyOk(st, f))) why.push('พ่อแม่ไม่อยู่แล้ว');
  if (!why.length) return null;
  return q.reason ?? why.join(' · ');
}

// ดัชนีตัวเลือกที่กดได้ — บอทเลือกจากชุดนี้เท่านั้น · ไม่มีตัวล็อก = ทุกตัว (ลำดับสุ่มของบอทจึงเหมือนก่อนมีการล็อก)
export const openChoices = (card) => card.choices.map((_, i) => i).filter((i) => !card.locked?.[i]);

// เดินปีละครั้งจนมีการ์ดถึงกำหนดหรือตาย คืนการ์ดใบถัดไป
export function nextCard(st) {
  if (st.pending) throw new Error('ยังมีการ์ดที่รอเลือก');
  if (st.dead) return deathCard(st);
  // การ์ดเปลี่ยนช่วง/เหตุการณ์ยุค/ผลสุ่มเป็นใบของตัวเอง เรียงตามที่ถึงกำหนดในปีนั้น
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
    if (st.due.length) {
      // เหตุการณ์ของอายุนี้ยังรอ: การ์ดใบถัดไปต้องไม่เดินเวลา · เงิน/ผลตอบแทน/หนี้ไปสรุปรวมที่การ์ดเปลี่ยนช่วงวัย
      st.advance = false;
      st.queue = st.due;
      st.due = [];
      return nextCard(st);
    }
    // years ของเหตุการณ์กั้นปีปฏิทินจริง — ด่าน build ตรวจปีสินทรัพย์/ระบบจาก years จึงต้องบังคับที่นี่ด้วย
    const year = st.birthYear + st.age;
    let ev = dueAt(st).find((e) => !st.done[e.id] && inYears(e, year) && whenOk(st, e.when) && beliefOk(st, e));
    // กองสุ่มจับได้ปีละครั้ง หลังหลักไมล์/นัดของปีนั้นหมดแล้ว
    if (!ev && st.poolAge !== st.age) {
      st.poolAge = st.age;
      ev = drawPool(st, year);
    }
    if (ev) {
      st.done[ev.id] = true;
      st.fired[ev.id] = { n: (st.fired[ev.id]?.n ?? 0) + 1, age: st.age };
      beliefFired(st, ev);
    }
    if (st.scheduled.length) st.scheduled = st.scheduled.filter((x) => x.age >= st.age && !st.done[x.event]);
    if (ev) {
      // อายุนี้อาจมีเหตุการณ์อื่นรออยู่ (หลักไมล์ชนกับนัด) — ค้นอายุเดิมอีกรอบก่อนเดินปี
      st.advance = false;
      return eventCard(st, ev);
    }
  }
}

// กองสุ่ม (B14): เหตุการณ์ไม่มี at_age แต่มี weight · ใบเดิมไม่ซ้ำในชีวิต เว้นแต่ตั้ง repeat · ไม่มีใบที่เกิดได้ = ไม่ดึงเลขสุ่ม
// ชีวิตที่เนื้อหาไม่มีกองจึงได้ชะตาเดิมทุกหลัก
function drawPool(st, year) {
  const stage = stageOf(st.age);
  const pool = (lifeEventIndex(st.content.events).pool.get(stage) ?? []).filter((e) => (!st.done[e.id] || canRepeat(st, e)) && inYears(e, year) && whenOk(st, e.when) && beliefOk(st, e));
  if (!pool.length || st.rng.next() >= POOL_CHANCE[stage]) return null;
  return weighted(st.rng, pool, pool.map((e) => e.weight * poolMultiplier(st, e.multipliers)));
}

// ไล่ทั้งกองเหตุการณ์ทุกปีกินเวลา harness ราวหนึ่งในห้า — จัดกลุ่มครั้งเดียวต่อชุดเนื้อหา (ผูกกับตัวอาเรย์ แทนทั้งอาเรย์ = กลุ่มใหม่)
// ในกลุ่มเรียงตามลำดับในเนื้อหา ใบที่ค้นเจอและลำดับสุ่มจึงเหมือนไล่ทั้งกองทุกหลัก
const lifeEventCache = new WeakMap();
function lifeEventIndex(events) {
  let ix = lifeEventCache.get(events);
  if (ix) return ix;
  ix = { byAge: new Map(), pos: new Map(), pool: new Map() };
  const add = (m, k, v) => (m.get(k) ?? m.set(k, []).get(k)).push(v);
  events.forEach((e, i) => {
    if (!ix.pos.has(e.id)) ix.pos.set(e.id, i);
    if (e.age !== undefined) add(ix.byAge, e.age, i);
    if (e.weight && e.age === undefined && !e.era) add(ix.pool, e.stage, e);
  });
  lifeEventCache.set(events, ix);
  return ix;
}

// เหตุการณ์ที่ถึงกำหนดอายุนี้: หลักไมล์ของอายุนี้ + ใบที่นัดไว้ปีนี้ เรียงตามลำดับในเนื้อหา
function dueAt(st) {
  const events = st.content.events;
  const ix = lifeEventIndex(events);
  const at = [...(ix.byAge.get(st.age) ?? [])];
  for (const x of st.scheduled) if (x.age === st.age && ix.pos.has(x.event)) at.push(ix.pos.get(x.event));
  return [...new Set(at)].sort((a, b) => a - b).map((i) => events[i]);
}

const canRepeat = (st, e) => e.repeat && st.fired[e.id].n < e.repeat.max && st.age - st.fired[e.id].age >= e.repeat.gap;

// ตัวคูณโอกาส (ใบ 07) ใช้ทั้งโอกาสเกิดของเหตุการณ์และน้ำหนักผลสุ่มแต่ละทาง: ค่าสถานะขั้นบันได · กรรมตามทิศบัญชีสุทธิ · ธงที่ถืออยู่
// ชื่อเสียงตระกูลยังไม่มีระบบ คูณ 1
export function poolMultiplier(st, m) {
  if (!m) return 1;
  let x = m.class?.[st.cls] ?? 1;
  for (const [k, v] of Object.entries(m.stats ?? {})) x *= st[k] >= STAT_HIGH ? v : st[k] <= STAT_LOW ? 1 / v : 1;
  if (m.karma) x *= m.karma ** Math.sign(netLedger(st.ledger));
  // ขอพร: เอียงตามบัญชีแบบต่อเนื่อง บุญน้อยเอียงน้อย บาปหนักกลับทิศ
  if (m.wish) x *= m.wish ** ledgerLevel(st.ledger);
  for (const [f, v] of Object.entries(m.flags ?? {})) if (st.flags[f]) x *= v;
  if (m.occupation && st.workFrom !== null) x *= m.occupation[st.occupation] ?? 1;
  return x;
}

const inYears = (e, year) => !e.years || (year >= e.years[0] && year <= e.years[1]);
const inRange = (v, r) => !r || (v >= r[0] && v <= r[1]);
const inBound = (v, b) => !b || ((b.min === undefined || v >= b.min) && (b.max === undefined || v <= b.max));
const flagsOk = (st, f) => (f.has ?? []).every((k) => st.flags[k]) && !(f.not ?? []).some((k) => st.flags[k]);
// ครอบครัวมีแค่พ่อแม่ (ด่าน family-system กั้นบทบาทอื่นไว้) · เงื่อนไขผ่านเมื่อพ่อหรือแม่คนใดคนหนึ่งตรง
const familyOk = (st, f) => f.role === 'parent' && st.parents.some((p) => (f.alive === undefined || p.alive === f.alive) && inRange(p.age, f.age));
// เงื่อนไขเกิดแบบประกาศทุกฟิลด์ (ใบ 07)
export function whenOk(st, when) {
  if (!when) return true;
  if (when.family && !when.family.every((f) => familyOk(st, f))) return false;
  if (!inRange(st.age, when.age) || !inRange(st.birthYear + st.age, when.year)) return false;
  if (when.class && !when.class.includes(st.cls)) return false;
  if (when.region && !when.region.includes(st.region)) return false;
  if (when.sex && !when.sex.includes(st.sex)) return false;
  for (const [k, b] of Object.entries(when.stats ?? {})) if (!inBound(st[k], b)) return false;
  // อาชีพนับเมื่อมีงานของตัวเองแล้ว — อาชีพครอบครัวก่อนทำงานไม่ทำให้การ์ดที่ทำงานออก
  if (when.occupation && !(st.workFrom !== null && when.occupation.includes(st.occupation))) return false;
  return !when.flags || flagsOk(st, when.flags);
}

// ป้ายบุญบาปเข้าบัญชีซ่อน · ธง · นัดเหตุการณ์ต่อเนื่อง (ใบ 07) — นัดสุ่มปีจาก rng ของโลก เพราะเป็นผลของการเลือก
function applyChoice(st, ev, c) {
  // คำบนเดียวกันมีหลายการ์ดนัด (ครั้งที่ 1 · ครั้งที่ 2) — ใช้ธงคำบนที่การ์ดปิดเป็นตัวระบุ ไม่ใช่ id การ์ด
  const vow = (c.clears_flags ?? []).find((f) => f.startsWith('vow_open:')) ?? ev.id;
  for (const f of recordMerit(st.ledger, c.merit, vow)) st.flags[f] = true;
  for (const f of c.sets_flags ?? []) {
    st.flags[f] = true;
    st.flagAge[f] ??= st.age;
  }
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
  if (lockReason(st, ev.choices[idx])) throw new Error('ตัวเลือกนี้ล็อกอยู่');
  st.pending = null;
  // เติมข้อความก่อนผลลง — {เงิน} ต้องเป็นยอดตอนที่ผู้เล่นเห็นตัวเลือก
  const text = fill(ev.choices[idx].text, st);
  const c = ev.choices[idx];
  applyEffects(st, c.effects);
  applyChoice(st, ev, c);
  st.log.push({ id: ev.id, age: st.age, choice: idx, text });
  // ผลสุ่ม: จับทางด้วย rng ของโลก (เป็นผลของการเลือก) แล้วเล่าเป็นการ์ดผลลัพธ์ใบถัดไป
  // น้ำหนักแต่ละทางเอียงตาม multipliers ของทางนั้น — บัญชีอ่านหลังป้ายบุญบาปของตัวเลือกนี้ลงแล้ว (กรรมตามทันทันที)
  // การ์ดที่ตัวเลือกนี้ก่อ (ผล → เรื่องต่อ → หางาน) เข้าหัวคิวตามลำดับ ก่อนการ์ดอื่นของปีที่รออยู่
  // สายมูก่อการ์ดของตัวเองได้ (ผลหวยสายมู) — มาก่อนผลสุ่มของตัวเลือก
  const after = beliefChoice(st, ev, c);
  if (c.outcomes?.length) {
    const o = weighted(st.rng, c.outcomes, c.outcomes.map((x) => x.weight * poolMultiplier(st, x.multipliers)));
    applyEffects(st, o.effects);
    applyChoice(st, ev, o);
    if (o.text) after.push({ kind: 'result', type: ev.type ?? 'A', age: st.age, stage: stageOf(st.age), text: fill(o.text, st) });
    // ผลชี้เรื่องต่อ: การ์ดเลือกของเหตุการณ์นั้นตามหลังการ์ดผลทันที อายุเดียวกัน · เงื่อนไขปี/when ไม่ผ่าน = จบที่การ์ดผล
    const follow = o.next && st.content.events.find((e) => e.id === o.next);
    if (follow && inYears(follow, st.birthYear + st.age) && whenOk(st, follow.when) && beliefOk(st, follow)) {
      st.done[follow.id] = true;
      st.fired[follow.id] = { n: (st.fired[follow.id]?.n ?? 0) + 1, age: st.age };
      beliefFired(st, follow);
      after.push({ kind: 'eraEvent', ev: follow, age: st.age });
    }
  }
  // เลิกเรียนแล้วหางานทันที
  if (st.needJob) {
    st.needJob = false;
    after.push({ kind: 'eraEvent', ev: jobCard(st), age: st.age });
  }
  st.queue.unshift(...after);
}

function deathCard(st) {
  const year = st.birthYear + st.age;
  const era = st.content.era;
  const card = {
    kind: 'death',
    age: st.age,
    text: `ตายอายุ ${st.age}`,
    // money = ทรัพย์สุทธิหลังหักหนี้รายก้อน · debt = ยอดหนี้รายก้อนที่ค้าง (ระหว่างชาติ B06 อ่านแยก)
    summary: {
      year,
      money: Math.round(netWorth(st)),
      moneyAtBirth: Math.round(netWorth(st) / priceRatio(era, st.seed, st.birthYear, year)),
      debt: Math.round(totalDebt(st)),
      bankruptcies: st.bankruptcies,
    },
  };
  st.estate = { year, money: card.summary.money, moneyAtBirth: card.summary.moneyAtBirth, debt: card.summary.debt, bankruptcies: st.bankruptcies };
  // ช่วงวัยสุดท้ายไม่มีการ์ดเปลี่ยนช่วงมาปิด — เล่าบนบันทึกการตายแทน
  card.recap = stageRecap(st, st.age);
  card.job = jobText(st);
  card.gen = st.gen;
  // ใบ 07: ตายตอนเด็กได้บันทึกสั้นบอกสถิติยุคนั้น (ทารกใช้อัตราตายทารก · เด็กโตใช้โอกาสตายรายปีของอายุนั้น) แล้วเข้าช่วงที่ 7 ตามปกติ
  if (st.age < 5) {
    const imr = infantMortality(era, st.sex, protoYear(era, st.seed, st.birthYear));
    card.note = `ยุคนั้นทารก${st.sex}ไทยตายก่อนอายุ 1 ขวบ ราว ${Math.round(imr)} คนในทุก 1,000 คน`;
  } else if (st.age < STAGES[1].from) {
    const q = lifeQx(era, st.seed, st.sex, year, st.age);
    card.note = `ยุคนั้นเด็ก${st.sex}อายุ ${st.age} ปีจากไปราว ${Math.max(1, Math.round(q * 10000))} คนในทุก 10,000 คนต่อปี`;
  }
  if (st.age < STAGES[1].from) card.short = true;
  return card;
}

// เฉลยบัญชีบุญบาป (ใบ 09 "เฉลยที่ศาลพญายม") — ออกบนการ์ดศาลในระหว่างชาติใบเดียว (afterlife.mjs)
// ชื่อ key เลี่ยงคำที่ด่านรั่วของ harness จับ · harness ยกเว้นช่องนี้บนการ์ดศาลช่องเดียว
export const RECKON_TOP = 3;
export function reckoning(ledger) {
  const r1 = (v) => Math.round(v * 10) / 10;
  const good = r1(ledger.merit), bad = r1(ledger.sin);
  const top = Object.entries(ledger.byCat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, RECKON_TOP)
    .map(([id, v]) => ({ name: meritName(id), bad: SIN_CATS.includes(id), weight: r1(v) }));
  return { good, bad, lean: good > bad ? 'บุญ' : bad > good ? 'บาป' : 'เสมอ', top };
}

// "ภาค" นำหน้าไม่เข้ากับกรุงเทพฯ และปริมณฑล
export const regionLabel = (st) => (st.ses === 'bkk' ? st.region : `ภาค${st.region}`);

export function profileText(st) {
  return `เกิดปี ${st.birthYear} · ${st.sex} · ${regionLabel(st)} · ฐานะ${st.cls} · ${jobText(st)}`;
}

export function statsOf(st) {
  return { health: st.health, happiness: st.happiness, knowledge: st.knowledge, relations: st.relations, network: st.network, money: st.money };
}

// harness วิ่งชีวิตผ่านฟังก์ชันชุดเดียวกับหน้าเว็บ ผู้เรียกส่งแค่ตัวเลือกเลือกตัวเลือก · onCard เห็นสถานะทุกการ์ด
// บอทได้ st เพื่ออ่านป้ายบุญบาปของตัวเลือกแทนการอ่านความหมายของข้อความแบบที่ผู้เล่นทำ — ห้ามอ่านบัญชีเอง
// stream ของบอทแยกจาก rng ของแกนเกม เพื่อไม่ให้การเลือกไปเปลี่ยนลำดับสุ่มของโลก
// st ส่งเข้ามาได้ = เล่นชีวิตรุ่นถัดไปที่ระหว่างชาติสร้างไว้
export function playLife(seed, content, pickChoice, onCard, st = newLife(seed, content)) {
  const bot = makeRng(seed ^ 0x5bd1e995);
  for (;;) {
    const card = nextCard(st);
    onCard?.(card, st);
    if (card.kind === 'death') return { age: card.age, cards: st.cards + 1, state: st };
    if (card.choices?.length) choose(st, pickChoice(card, bot, st));
  }
}
