import { makeRng } from './rng.mjs';
import { newKin, nameParents, applyFamily, ageKin, familyOk, focusOf, livingChildren, kinAid, KIN_AID, pickFocus, lossText, lossOk, lastLoss, petsAtBirth, petsAfter, petCall, lossCall, petArrivals, petArriveText } from './family.mjs';
import { pickBirthYear, lifeQx, priceRatio, inflationRate, infantMortality, eraEventsAt, protoYear } from './era.mjs';
import { pickRegion, pickProvince, placeName, regionRatio, classOdds, nationalIncome, pickName } from './birth.mjs';
import { monthlyWage, minWage, pickOccupation, portfolioReturn, lendingRate, assetOpen, assetName, isAllocAge, allocOptions, periodReturns, formatReturn, ALLOC, DISCLAIMER, newDebt, payDebt, debtDone, debtOpen, debtName, complainDebt, firstPay } from './finance.mjs';
import { newLedger, recordMerit, addMerit, karmaMultiplier, omenTone, omenText, OMEN, netLedger, ledgerLevel, meritName, SIN_CATS } from './merit.mjs';
import { TRACKS, SCHOOL_FROM, eduRank, schoolGate, jobCard, netAid } from './career.mjs';
import { jobWage, officePay, officeFull, rankName, enterByJob, enterLadder, promote, setOffice, ageRank, promoDue, promoCard, officeDue, officeCard, ladderOf, recruitDue, recruitCard, severanceDays, rankLevel, earlyDue, earlyCard, ladderStartPay, officeStep, budgetDue, budgetCard } from './rank.mjs';
import { beliefOk, beliefFired, beliefChoice } from './belief.mjs';
import { introCard, eraStory } from './intro.mjs';
import { poolRounds, poolEffectScale, poolStatScale } from './pace.mjs';
import { entryCard, ENTRY, lifeEndWord, isGone, TRIP, tripRoll, startIsekai, nextIsekaiCard, chooseIsekai, tripCarry, tripLineage, isekaiWorldLore } from './isekai.mjs';

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
// สุขต่ำมากทำอะไรก็ไม่เข้าหัว (B40): ความรู้ที่งอกเองรายปี + โอกาสสำเร็จของการ์ดเรียน/งาน คูณตามขั้น · เกณฑ์ = ต่ำกว่าค่าแรก
export const MOOD = [[15, 0.5], [30, 0.7]];
export const moodMul = (st) => MOOD.find(([below]) => st.happiness < below)?.[1] ?? 1;
const MOOD_CATS = ['work_money', 'study'];
// การ์ดที่แกนสร้าง (หางาน · ด่านเรียนต่อ) ไม่มีหมวด — นับเป็นเรียน/งานด้วย id
const moodCard = (ev) => !!ev && (MOOD_CATS.includes(ev.category) || ev.id === 'first_job' || ev.id?.startsWith('school_gate_'));
const outcomeWeights = (st, ev, c) => {
  const m = moodCard(ev) ? moodMul(st) : 1;
  return c.outcomes.map((o) => o.weight * poolMultiplier(st, o.multipliers) * (o.ok ? m : 1));
};

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
// ตำแหน่งการเมืองเต็มเวลา (B40) ไม่เกษียณตามอายุ — ทำงานต่อจนแพ้เลือกตั้งหรือวางมือ
export const isWorking = (st, age = st.age) => st.workFrom !== null && age >= st.workFrom && age < (st.retiredAt ?? Infinity) && (age < RETIRE_AGE || officeFull(st));

// ช่วงเรียนที่การ์ดเห็น: ก่อนวัยเข้าเรียนยังไม่มีช่วงเรียน (ค่าเริ่ม primary รออยู่) · เลิกเรียนแล้ว = none
export const schoolOf = (st, age = st.age) => (st.school && age >= SCHOOL_FROM ? st.school : 'none');

// ป้ายสถานะงานบนจอ: ก่อนมีงานไม่โชว์อาชีพ (อาชีพตอนเกิดเป็นของครอบครัว ใช้คิดเงินติดตัวเท่านั้น)
export function jobText(st, age = st.age) {
  if (st.workFrom === null) {
    if (st.school && age >= SCHOOL_FROM) return `กำลังเรียน${TRACKS[st.school].name}`;
    return age < SCHOOL_FROM ? 'ยังไม่เข้าเรียน' : 'ยังไม่ทำงาน';
  }
  return isWorking(st, age) || age < RETIRE_AGE ? rankName(st) : `เกษียณ (เคยเป็น${rankName({ ...st, office: null })})`;
}

// เงินเก็บต่อปี เป็นบาทของปีนั้น: ค่าจ้างตามอาชีพ × ภาค ทั้งปี × อัตราออม (ใบ 14)
export function yearlySaving(st, year = st.birthYear + st.age) {
  const era = st.content.era;
  return monthlyIncome(st, year) * 12 * era.birth.saveRate;
}

// รายได้/เดือนของชีวิตนี้: ค่าจ้างอาชีพ × ตัวคูณรายได้ถาวรจากเหตุการณ์
// รายได้/เดือนของชีวิตนี้: ค่าจ้างงาน (ขั้นในสายยศทับค่าจ้างอาชีพ) × ตัวคูณรายได้ถาวร
// ตำแหน่งการเมือง: ท้องถิ่นได้ค่าตอบแทนบวกจากงาน · เต็มเวลาได้อย่างที่มากกว่า (ลาออกจากงานเดิมไปนั่งตำแหน่ง)
export function monthlyIncome(st, year = st.birthYear + st.age) {
  const job = jobWage(st, year) * st.incomeMult;
  if (!st.office) return job;
  return officeFull(st) ? Math.max(job, officePay(st, year)) : job + officePay(st, year);
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
  // จังหวัดสุ่มจาก stream แยกในภาคที่ได้ (B34) — ไม่กินเลขสุ่มของโลก · ทางเป็นลูกเกิดบ้านเดิม · เซฟเก่าไม่มีจังหวัด สุ่มซ้ำจาก seed ได้ค่าเดิม
  const province = heir?.province ?? pickProvince(makeRng(seed ^ 0xa54ff53a), era.birth, region.name);
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
    // ทางในตระกูลเกิดเป็นลูก/หลานจริงที่มีชื่ออยู่แล้ว (B36a) — คงชื่อเดิมของเขา
    name: heir?.name ?? pickName(seed, sex, birthYear, era.names, (heir?.lineage ?? []).map((l) => l.name)),
    region: region.name,
    province,
    ses: region.ses,
    cls,
    // ก่อนได้งาน occupation = อาชีพของครอบครัว เป็นฐานของเงินในผลการ์ด (income_x) · ได้งานแล้วเปลี่ยนเป็นงานของตัวเอง
    occupation: occupation.id,
    occupationName: occupation.name,
    familyOcc: occupation.id,
    workFrom: null,
    // สายยศ/ตำแหน่ง (B40 · rank.mjs): ขั้นในสายอาชีพ · ตำแหน่งการเมือง · บำนาญต่อปีเป็นบาทค่าเงินปีเกิด
    ladder: null,
    office: null,
    pension: 0,
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
    // ที่มาของบัญชีชาตินี้ตามอายุ (B26) — บัญชีที่พกมาจากชาติก่อนไม่มีรายการ
    deeds: [],
    // รุ่นที่เท่าไรของตระกูล + บันทึกรุ่นก่อน · มรดกจากรุ่นก่อนที่ยังไม่ถึงอายุรับ (ทางเป็นลูก)
    gen: heir?.gen ?? 1,
    // ชื่อเสียงตระกูล 0–3 (B95b) ส่งต่อจากรุ่นก่อน · การ์ดเอียงตาม multipliers.family_fame
    fame: heir?.fame ?? 0,
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
    trail: [],
    // ค่าสถานะรายปีทั้งชีวิต (B38a) — แยกจาก trail เพราะ trail ออกไปกับการ์ดสรุปช่วงวัยอยู่แล้ว
    statTrail: [],
    // ฐานะ 10 ระดับต้นช่วงวัย (B95 กราฟตระกูล) — จุดแรก = ฐานะบ้านตอนเกิด
    standing: [{ age: 0, cls: CLASSES.indexOf(cls) }],
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
    // คู่ครอง/ลูก/หลานที่เป็นคนจริง (B36a · family.mjs) — stream kinRng แยกจากโลกและจากพ่อแม่
    ...newKin(seed),
  };
  nameParents(st);
  petsAtBirth(st, heir, CLASSES.indexOf(cls));
  st.money = era.birth.startMoney[CLASSES.indexOf(cls)] * yearlySaving(st);
  // การ์ดเปิดชีวิตมาก่อนการ์ดมรดกตอนแรกเกิด — ต้องเล่ามรดกก่อน receiveLegacy ล้าง st.legacy
  st.due.push(introCard(st, heir));
  if (st.legacy?.age === 0) receiveLegacy(st, birthYear, stageOf(0));
  st.trail.push({ year: birthYear, money: Math.round(st.money) });
  st.statTrail.push(statPoint(st));
  st.stageMark = markStage(st);
  return st;
}

const statPoint = (st) => ({ age: st.age, ...Object.fromEntries(STAT_KEYS.map((k) => [k, Math.round(st[k])])) });

// กราฟทั้งชีวิตบนบันทึกการตาย (B38a): ค่าสถานะ + เงินรายปีตั้งแต่เกิดถึงตาย · จุดเก็บตอนขึ้นอายุ
// จุดสุดท้ายแทนด้วยค่า ณ ตอนตาย — เหตุการณ์ปีสุดท้ายจึงไม่หายจากกราฟ · ไม่แตะ state การ์ดตายสร้างซ้ำได้
function lifeSeries(st) {
  const stats = st.statTrail.filter((p) => p.age < st.age);
  stats.push(statPoint(st));
  const money = st.trail.map((p) => ({ age: p.year - st.birthYear, money: p.money })).filter((p) => p.age < st.age);
  money.push({ age: st.age, money: Math.round(st.money) });
  return { stats, money };
}

function markStage(st) {
  return { age: st.age, stage: stageOf(st.age), price: st.price, money: st.money, ...Object.fromEntries(STAT_KEYS.map((k) => [k, st[k]])) };
}

// สรุปช่วงวัยที่เพิ่งจบ: ตัวเลือกที่เลือก + ค่าสถานะ/เงินต้นช่วง → ตอนนี้ · อ่าน state ล้วน ไม่ดึงเลขสุ่มของโลก
// ไม่มีค่าบัญชีบุญบาป — การ์ดทุกใบถูก harness ตรวจรั่ว
// lastAge = อายุสุดท้ายของช่วง: การ์ดเปลี่ยนช่วงออกตอนขึ้นอายุแรกของช่วงใหม่แล้ว
function stageRecap(st, lastAge) {
  const m = st.stageMark;
  // ไม่เล่าผลตอบแทนรายปีของสินทรัพย์ — ตัวเลขรายปีอ่านเหมือนคำแนะนำลงทุน · ผลรวมยังเห็นในเงินต้นช่วง → ตอนนี้
  const items = st.debts.map((d) => `${debtName(d.kind)} ค้าง ${Math.round(d.balance).toLocaleString('en-US')} บาท`);
  return {
    items,
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
  return [fixed, outcomeFx(st, c, ev)].filter(Boolean).join(' · ');
}

// ทางที่เอียงด้วยบัญชีบุญบาปโชว์ ? — % จะบอกยอดบัญชีที่ต้องซ่อนจนตาย
function outcomeFx(st, c, ev) {
  if (!c.outcomes.some((o) => o.ok)) return riskLabel(c.outcomes);
  if (c.outcomes.some((o) => o.multipliers?.karma || o.multipliers?.wish)) return 'สำเร็จ ?';
  return `สำเร็จ ~${successPct(st, c, ev)}%`;
}

// โอกาสได้ทางสำเร็จ ปัดเป็นขั้น PCT_STEP ไม่โชว์ 0/100 · ผลของตัวเลือกลงก่อนสุ่มทาง (choose)
// จึงคิดบนค่าหลังผลตัวเลือกในสำเนา ไม่แตะ state จริง
export const PCT_STEP = 5;
export function successPct(st, c, ev = null) {
  const fx = c.effects ?? {};
  const p = { ...st, flags: { ...st.flags } };
  for (const k of STAT_KEYS) if (fx[k]) p[k] = clamp(p[k] + levelValue(fx[k]));
  for (const f of c.sets_flags ?? []) p.flags[f] = true;
  for (const f of c.clears_flags ?? []) delete p.flags[f];
  const w = outcomeWeights(p, ev, c);
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
  if (fx.severance) out.push('ได้เงินชดเชย');
  if (fx.retire) out.push('เกษียณ');
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

// อายุร่างกาย = อายุไทย + ปีที่อยู่ต่างโลก (B68m) — ปีปฏิทินยังตามอายุไทย · ชีวิตที่ไม่ข้ามโลกไม่มี st.away
export function deathChance(st) {
  const base = lifeQx(st.content.era, st.seed, st.sex, st.birthYear + st.age, st.age + (st.away ?? 0));
  if (base >= 1) return 1;
  return Math.min(1, base * healthMultiplier(st) * karmaMultiplier(st.ledger));
}

// ช่องแทนค่าครบทุกตัวในรายการปิดของด่าน build (PLACEHOLDERS) — ตัวที่ไม่เติมจะโผล่เป็น {ชื่อ} ดิบบนการ์ด
// ชื่อ = ชื่อเล่นที่สุ่มตอนเกิด (คำบรรยายยังเรียกผู้เล่นว่า "คุณ") · ลูกยังไม่มีชื่อ: เพศลูกรู้ตอนส่งไปเกิด ชื่อจึงตั้งที่รุ่นถัดไป
// จังหวัด = จังหวัดที่เกิด · ภาค = ภาคที่เกิด · คำพูดตามเพศ
export const FILL = {
  อายุ: (st) => st.age,
  ภาค: (st) => regionLabel(st),
  จังหวัด: (st) => provinceLabel(st),
  เงิน: (st) => Math.round(st.money).toLocaleString('en-US'),
  ชื่อ: (st) => st.name,
  ชื่อลูก: (st) => focusOf(st, 'child')?.name ?? 'ลูก',
  ชื่อคู่: (st) => focusOf(st, 'spouse')?.name ?? 'คู่ชีวิต',
  ชื่อหลาน: (st) => focusOf(st, 'grandchild')?.name ?? 'หลาน',
  ชื่อผู้จากไป: (st) => (lastLoss(st) ? lossCall(lastLoss(st)) : 'คนในบ้าน'),
  ชื่อสัตว์: (st) => (focusOf(st, 'pet') ? petCall(focusOf(st, 'pet')) : 'เจ้าตัวเล็ก'),
  ชนิดสัตว์: (st) => focusOf(st, 'pet')?.kind ?? 'สัตว์',
  ชื่อฝูง: (st) => (focusOf(st, 'herd') ? petCall(focusOf(st, 'herd')) : 'สัตว์ในคอก'),
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

// ผลสุ่มที่เป็นผลร้าย = ไม่ใช่ทางสำเร็จ และมีค่าหรือเงินติดลบ — ญาติช่วยได้เฉพาะแบบนี้
function hurts(st, fx) {
  return !!fx && (STAT_KEYS.some((k) => fx[k] < 0) || (fx.money !== undefined && moneyValue(st, fx.money) < 0));
}
const AID_WHO = { spouse: 'คู่ชีวิต', child: 'ลูก', grandchild: 'หลาน' };

// s = ตัวหรี่ผลของการ์ดกองสุ่มเมื่อจับหลายรอบต่อปี (pace.mjs) · ยอดกู้หรี่ด้วยเพราะการ์ดกู้คู่กับเงินจ่ายออก · ลงทุน/งาน/เรื้อรังเป็นโครงสร้าง ไม่หรี่
// hurt = ตัวคูณส่วนที่ติดลบของค่าและเงิน (ญาติช่วยประคองตอนเจอผลร้าย) · ส่วนที่เป็นบวกไม่แตะ
function applyEffects(st, fx = {}, s = 1, ss = s, hurt = 1) {
  const cut = (v) => (v < 0 ? v * hurt : v);
  for (const k of STAT_KEYS) if (fx[k]) st[k] = clamp(st[k] + cut(levelValue(fx[k]) * ss));
  if (fx.money) st.money += cut(moneyValue(st, fx.money) * s);
  // เงินชดเชยคิดจากงานเดิม — ต้องลงก่อนผลเปลี่ยนงานในก้อนเดียวกัน
  if (fx.severance && isWorking(st)) st.money += (severanceDays(st) * monthlyIncome(st)) / 30;
  if (fx.retire && isWorking(st)) {
    st.retireBase = (monthlyIncome(st) * 12) / st.price;
    st.retiredAt = st.age + 1;
  }
  if (fx.invest) invest(st, fx.invest);
  if (fx.debt) borrow(st, fx.debt, s);
  if (fx.settle) settle(st, fx.settle);
  if (fx.complain) for (const d of st.debts) complainDebt(st.content.era, d);
  if (fx.income_mult) st.incomeMult = Math.max(INCOME_MULT[0], Math.min(INCOME_MULT[1], st.incomeMult * fx.income_mult ** s));
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
    st.jobSince = st.age;
    enterByJob(st, o.id);
  }
  if (fx.ladder) {
    if (st.workFrom === null) st.workFrom = st.age;
    st.incomeMult = 1;
    st.jobSince = st.age;
    enterLadder(st, fx.ladder);
  }
  if (fx.promote !== undefined) promote(st, fx.promote);
  if (fx.office !== undefined) setOffice(st, fx.office);
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
    if (p.diesAt !== undefined ? p.age >= p.diesAt : roll < lifeQx(st.content.era, st.seed, p.sex, year, p.age)) {
      p.alive = false;
      p.diedAge = p.age;
    }
  }
}

// มรดกจากรุ่นก่อน (ทางเป็นลูก) ถึงมือปีที่พ่อ/แม่ผู้เล่นรุ่นก่อนตาย · เก็บเป็นเท่าของรายได้ครัวเรือนทั้งปีของประเทศ แปลงเป็นบาทของปีนี้
function receiveLegacy(st, year, stage) {
  const { units, debt, from } = st.legacy;
  st.legacy = null;
  // มรดกมาพร้อมการจากไป — มรดกตอนแรกเกิด (ตายปีที่ลูกเกิด) ต้องปิดชีวิตพ่อ/แม่ตรงนี้ ageParents ยังไม่เคยเดิน
  for (const p of st.parents) {
    if (!p.ancestor) continue;
    p.alive = false;
    p.diedAge ??= p.diesAt ?? p.age;
  }
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
  // คนที่ยังนั่งตำแหน่งเต็มเวลาหลังเกษียณวัดใหม่ทุกปีจนเลิกทำงาน — ปีที่ปกติถึงเกษียณได้ค่าเดิม
  if (isWorking(st) && st.age + 1 >= RETIRE_AGE) {
    st.retireBase = (monthlyIncome(st) * 12) / st.price;
    // บำนาญข้าราชการ (B40): ค่าจ้างสุดท้าย × ปีรับราชการ ÷ div ไม่เกิน cap เท่าของค่าจ้างสุดท้าย
    const pen = st.content.era.careers.pension;
    st.pension = ladderOf(st)?.pension ? Math.min(pen.cap, (st.age + 1 - st.ladder.from) / pen.div) * jobWage(st, st.birthYear + st.age) * 12 / st.price : 0;
  }

  st.age += 1;
  const year = st.birthYear + st.age;
  st.price *= 1 + inflationRate(st.content.era, st.seed, year) / 100;

  const r = healthDecay(st.age);
  st.health = clamp(st.health * (1 - r));
  st.healthNatural *= 1 - r;
  st.happiness = clamp(st.happiness + (st.baseHappiness - st.happiness) * HAPPY_PULL);
  st.knowledge = clamp(st.knowledge + (knowledgeGain(st.age) * moodMul(st) * (100 - st.knowledge)) / 100);
  st.relations = clamp(st.relations * (1 - RELATION_FADE));
  flowChronic(st);
  ageParents(st, year);
  // คนในบ้านจากไปเองปีนี้ = การ์ดแจ้งทุกครั้ง ก่อนเหตุการณ์ของปี
  for (const l of ageKin(st, year, yearlySaving(st))) st.due.push({ kind: 'result', type: 'A', age: st.age, stage: stageOf(st.age), text: lossText(l), loss: l });
  for (const m of petArrivals(st, year)) st.due.push({ kind: 'result', type: 'A', age: st.age, stage: stageOf(st.age), text: petArriveText(m) });
  // ผลตอบแทนคิดกับเงินต้นปีก่อนเงินเก็บของปีนี้เข้า · ติดลบ = หนี้ ทบดอกเบี้ยเงินกู้ของปีนั้น
  const era = st.content.era;
  if (st.money > 0) {
    st.money *= 1 + portfolioReturn(era, st.seed, st.alloc, year);
  } else if (st.money < 0) st.money *= 1 + lendingRate(era, st.seed, year);
  if (isWorking(st)) st.money += yearlySaving(st, year);
  else if (st.retireBase !== null) st.money -= retireSpend(st, year) - st.pension * st.price;
  let paid = 0;
  for (const d of st.debts) {
    const p = payDebt(era, st.seed, d, year);
    st.money -= p;
    paid += p;
  }
  st.debts = st.debts.filter((d) => !debtDone(d));
  const stage = stageOf(st.age);
  if (st.legacy && st.age >= st.legacy.age) receiveLegacy(st, year, stage);
  st.trail.push({ year, money: Math.round(st.money) });
  st.statTrail.push(statPoint(st));

  checkBankrupt(st, year, stage);
  debtLoad(st, year, paid);
  informalFlag(st);
  const tone = omenTone(st.ledger);
  if (!tone) st.omenTone = null;
  else if (tone !== st.omenTone && (st.omenAge === null || st.age - st.omenAge >= OMEN.gap)) {
    st.omenTone = tone;
    st.omenAge = st.age;
    st.due.push({ kind: 'omen', tone, age: st.age, stage, text: omenText(tone, st.seed, st.age) });
  }
  if (stage !== prevStage) {
    // จุดกราฟฐานะตระกูล (B95) ทุกต้นช่วงวัย — ไม่ออกไปกับการ์ด
    st.standing.push({ age: st.age, cls: standingOf(st, year) });
    st.due.push({ kind: 'stage', age: st.age, stage, text: `เข้าสู่ช่วง${stage}`, recap: stageRecap(st, st.age - 1) });
    st.stageMark = markStage(st);
  }
  // จบช่วงเรียน: ได้วุฒิ แล้วออกด่านเรียนต่อ หรือการ์ดหางานถ้าเป็นช่วงสุดท้าย
  const track = st.school && TRACKS[st.school];
  if (track && st.age === track.until) {
    if (eduRank(track.edu) > eduRank(st.edu)) st.edu = track.edu;
    if (track.exam) for (const ev of preludes(st, track.exam, year)) st.due.push({ kind: 'eraEvent', ev, age: st.age });
    if (track.gate) st.due.push({ kind: 'eraEvent', ev: schoolGate(st), age: st.age });
    else {
      st.school = null;
      if (track.ladder) applyEffects(st, { ladder: track.ladder });
      else st.due.push({ kind: 'eraEvent', ev: jobCard(st), age: st.age });
    }
  }
  // สายยศ (B40): ปีในขั้นนับตามความสุข ถึงคิวแล้วการ์ดเลื่อนขั้น · ผู้ใหญ่บ้าน/กำนันพ้นตำแหน่งตอนเกษียณ · ครบวาระ/ถูกชวนลงสมัคร = การ์ดเลือกตั้ง
  if (isWorking(st)) {
    ageRank(st, moodMul(st));
    if (promoDue(st)) st.due.push({ kind: 'eraEvent', ev: promoCard(st), age: st.age });
  }
  if (st.office && !officeFull(st) && st.age >= RETIRE_AGE) {
    st.due.push({ kind: 'result', type: 'A', age: st.age, stage, text: `อายุครบ ${RETIRE_AGE} พ้นตำแหน่ง${officeStep(st).name}ตามกฎหมาย ชาวบ้านจัดงานเลี้ยงส่ง` });
    st.office = null;
  }
  if (budgetDue(st)) st.due.push({ kind: 'eraEvent', ev: budgetCard(st), age: st.age });
  if (officeDue(st)) st.due.push({ kind: 'eraEvent', ev: officeCard(st), age: st.age });
  if (recruitDue(st)) st.due.push({ kind: 'eraEvent', ev: recruitCard(st), age: st.age });
  if (isWorking(st) && earlyDue(st)) st.due.push({ kind: 'eraEvent', ev: earlyCard(st), age: st.age });
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

// การ์ดนำของด่านสอบ (B63): ไม่อยู่ในกองสุ่ม ออกในคิวก่อนด่านปีเดียวกัน — "พรุ่งนี้สอบ" จึงตามด้วยด่านจริงเสมอ
// ทอย chance หลังผ่านเงื่อนไขแล้วเท่านั้น ชีวิตที่ไม่เข้าเงื่อนไขจึงไม่กิน rng ของโลก
function preludes(st, exam, year) {
  const out = [];
  for (const ev of st.content.events) {
    if (ev.prelude?.before !== exam || st.done[ev.id] || !inYears(ev, year) || !whenOk(st, ev.when) || !beliefOk(st, ev)) continue;
    if (st.rng.next() >= ev.prelude.chance) continue;
    st.done[ev.id] = true;
    st.fired[ev.id] = { n: 1, age: st.age };
    beliefFired(st, ev);
    out.push(ev);
  }
  return out;
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

// ฐานะระหว่างชีวิต (B95): รายได้เทียบเท่าต่อเดือนเทียบรายได้ครัวเรือนของประเทศปีนั้น ตัดด้วยเส้นแบ่ง 10 ระดับชุดเดียวกับฐานะตอนเกิด
// รายได้เทียบเท่า = รายได้จากงาน × STANDING.household (คนเดียวเทียบรายได้ทั้งบ้าน) + ทรัพย์สุทธิ × STANDING.yield ต่อปี (ติดลบได้)
// ยังไม่เคยทำงาน = ฐานะของบ้านตอนเกิด · อ่าน state ล้วน ไม่ดึงเลขสุ่ม
export const STANDING = { household: 1.6, yield: 0.04 };
export function standingOf(st, year = st.birthYear + st.age) {
  if (st.workFrom === null) return CLASSES.indexOf(st.cls);
  const b = st.content.era.birth;
  const work = isWorking(st) ? monthlyIncome(st, year) : st.retireBase !== null ? (st.retireBase * st.price) / 12 : 0;
  const eq = work * STANDING.household + (netWorth(st) * STANDING.yield) / 12;
  if (eq <= 0) return 0;
  const z = (Math.log(eq / nationalIncome(st.content.era, st.seed, year)) + (b.sigma * b.sigma) / 2) / b.sigma;
  return b.cutZ.filter((c) => z > c).length;
}
// ชนชั้นที่การ์ดเช็ก (when.class · multipliers.class · B111 เจ้าของเคาะ): ฐานะตอนเกิดมีผลถึงก่อนเริ่มทำงาน หลังจากนั้นอ่านฐานะปีนั้น
// ไม่งั้นคนเกิดจนที่รวยแล้วไม่เจอการ์ดคนรวยตลอดชีวิต · standingOf คืนฐานะตอนเกิดให้เองเมื่อยังไม่เคยทำงาน
export const classNow = (st) => CLASSES[standingOf(st)];

// รายได้ทั้งปีที่ใช้วัดว่าหนี้ท่วมแค่ไหน: ทำงานอยู่ = รายได้ปีนี้ · เกษียณแล้ว = รายได้ปีสุดท้ายปรับเงินเฟ้อ
// ยังไม่เคยทำงาน (เรียนอยู่ระหว่างปลอดหนี้ กยศ.) ไม่มีฐาน จึงไม่นับ
function debtIncome(st, year) {
  if (isWorking(st)) return monthlyIncome(st, year) * 12;
  return st.retireBase === null ? null : st.retireBase * st.price;
}

// เงินก้อน/รายได้/หนี้ที่การ์ดเช็ก (B111 ข้อเคาะ 2–4) เป็นอัตราส่วน ไม่ใช่บาท — เกณฑ์เดียวใช้ได้ทุกยุคทุกฐานะ
// money_x = เงินสดเทียบรายได้ปี · income_x = รายได้ต่อเดือนเทียบค่าแรงขั้นต่ำทั้งเดือน · debt_x = หนี้สุทธิเทียบรายได้ปี
// ไม่มีรายได้ (เรียน/ว่างงาน) เทียบค่าแรงขั้นต่ำทั้งปีแทน — ไม่งั้นเด็กมีเงินแสนกับเด็กไม่มีเงินได้ค่าเดียวกัน
export const MONEY_KEYS = ['money_x', 'income_x', 'debt_x'];
export function moneyRatios(st, year = st.birthYear + st.age) {
  const f = st.content.era.finance;
  const minMonth = minWage(st.content.era, st.seed, year) * f.daysPerMonth;
  const base = debtIncome(st, year) || minMonth * 12;
  const monthly = isWorking(st) ? monthlyIncome(st, year) : st.retireBase !== null ? (st.retireBase * st.price) / 12 : 0;
  return { money_x: Math.max(0, st.money) / base, income_x: monthly / minMonth, debt_x: Math.max(0, -netWorth(st)) / base };
}

// หนี้เกินกำลัง (B111 · เจ้าของเคาะ) — ธง in_debt คิดใหม่ทุกปีจากยอดจริง ไม่ค้างจากการ์ดเก่า (บั๊ก: "หนี้ล้นตัว" ออกตอนมีเงิน 3.8 ล้าน)
// ติด: ผ่อนต่อปี > pay ของรายได้ปี หรือหนี้สุทธิ > net เท่ารายได้ปี · ล้าง: ต่ำกว่า payOff และ netOff · ช่วงกลางคงค่าเดิม กันธงกระพริบ
// ยังไม่มีฐานรายได้ (เรียน/ไม่เคยทำงาน) = ล้างเมื่อไม่มีหนี้เหลือ ไม่งั้นคงตามเดิม
export const DEBT_LOAD = { pay: 0.4, net: 2, payOff: 0.3, netOff: 1.5 };
function debtLoad(st, year, paid) {
  // หนี้สุทธิแบบเดียวกับ debt_x และด่านล้มละลาย: เงินติดลบ (ทบดอกเงินกู้ทุกปี) นับเป็นหนี้ด้วย
  const owe = -netWorth(st);
  const base = debtIncome(st, year);
  const was = !!st.flags.in_debt;
  let on = was;
  if (base === null || base <= 0) on = was && owe > 0;
  else if (paid > DEBT_LOAD.pay * base || owe > DEBT_LOAD.net * base) on = true;
  else if (paid < DEBT_LOAD.payOff * base && owe < DEBT_LOAD.netOff * base) on = false;
  if (on && !was) {
    st.flags.in_debt = true;
    st.flagAge.in_debt ??= st.age;
  } else if (!on && was) delete st.flags.in_debt;
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
function borrow(st, { kind, amount }, s = 1) {
  const year = st.birthYear + st.age;
  const era = st.content.era;
  if (!debtOpen(era, kind, year)) throw new Error(`${debtName(kind)} ยังไม่มีในปี ${year}`);
  const baht = moneyValue(st, amount) * s;
  st.money += baht;
  st.debts.push(newDebt(era, st.seed, kind, baht, year));
  informalFlag(st);
}

// ปิดหนี้ทุกก้อนของชนิดนั้นด้วยเงินที่มี · เงินไม่พอ = เงินติดลบ ทบดอกเงินกู้ปกติแทน (ย้ายหนี้ออกจากดอกโหด)
function settle(st, kind) {
  for (const d of st.debts) if (d.kind === kind) st.money -= d.balance;
  st.debts = st.debts.filter((d) => d.kind !== kind);
  informalFlag(st);
}

// ธง informal_debt ติดตลอดที่หนี้นอกระบบค้าง (B111 เจ้าของเคาะ) — การ์ดทวงหนี้ของเนื้อหาอ่านธงนี้ engine ไม่ลงโทษเอง
function informalFlag(st) {
  const on = st.debts.some((d) => d.kind === 'informal');
  if (on && !st.flags.informal_debt) {
    st.flags.informal_debt = true;
    st.flagAge.informal_debt ??= st.age;
  } else if (!on) delete st.flags.informal_debt;
}

// กู้มาจ่าย (B111 เจ้าของเคาะ): ตัวเลือกที่ล็อกเพราะเงินอย่างเดียวกู้ส่วนที่ขาดได้ · ปุ่มละแหล่งที่เข้าเกณฑ์ บอกดอก+ยอดจ่ายปีแรก
// ธนาคารต้องทำงานอยู่ · กองทุน/สหกรณ์ต้องมีรายได้ (ทำงานหรือบำนาญ) · นอกระบบให้ทุกคน · วงเงินนับหนี้ชนิดเดียวกันที่ค้างรวมก้อนใหม่
// อายุต่ำกว่าบรรลุนิติภาวะกู้เองไม่ได้ · ตายแล้ว (การ์ดงานศพ) ไม่กู้ — หนี้หักจากกองมรดกอยู่แล้ว
export const LOAN_AGE = 20;
export const LOAN_KINDS = ['bank_loan', 'coop', 'informal'];
export function loanOptions(st, gap) {
  if (st.dead || st.age < LOAN_AGE || !(gap > 0)) return [];
  const year = st.birthYear + st.age;
  const era = st.content.era;
  const kinds = era.finance.debt.kinds;
  const income = debtIncome(st, year);
  const owed = (kind) => st.debts.reduce((s, d) => s + (d.kind === kind ? d.balance : 0), 0);
  const fits = (kind) => income > 0 && owed(kind) + gap <= kinds[kind].limit * income;
  const ok = { bank_loan: isWorking(st) && fits('bank_loan'), coop: debtOpen(era, 'coop', year) && fits('coop'), informal: true };
  return LOAN_KINDS.filter((k) => ok[k]).map((kind) => {
    const d = newDebt(era, st.seed, kind, gap, year);
    return { kind, name: debtName(kind), rate: d.rate, years: d.simple ? null : d.years, yearly: firstPay(d) };
  });
}

// ยอดที่ขาดของตัวเลือก — ปัดขึ้นเป็นบาทเต็ม กู้แล้วต้องกดได้แน่ ไม่ติดเศษทศนิยม
function choiceGap(st, c) {
  const q = c.requires;
  if (!q?.money || lockReason(st, c) === null) return null;
  if (st.pending?.id === FUNERAL.rite && st.funeralPick && c.id !== st.funeralPick) return null;
  if (q.age && (st.age < (q.age.min ?? 0) || st.age > (q.age.max ?? Infinity))) return null;
  const gap = moneyValue(st, q.money) - (st.dead ? deadPurse(st) : st.money);
  return gap > 0 ? gap : null;
}

function borrowFor(st, c, kind) {
  const gap = choiceGap(st, c);
  const need = gap === null ? 0 : Math.ceil(gap);
  if (!need || lockReason(st, c, need) !== null) throw new Error('ตัวเลือกนี้กู้มาจ่ายไม่ได้');
  if (!loanOptions(st, need).some((o) => o.kind === kind)) throw new Error(`กู้จาก${debtName(kind)}ไม่ได้`);
  const year = st.birthYear + st.age;
  st.money += need;
  st.debts.push(newDebt(st.content.era, st.seed, kind, need, year));
  informalFlag(st);
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
// ปิด merge = ข่าวกับการ์ดรับมือแยกใบแบบเดิม (ตัวควบคุมของ harness)
export const ERA_NEWS = { merge: true };

// news = ข่าวบ้านเมืองที่รวมมาเป็นบรรทัดนำ (B58) — การ์ดยังเป็นของเหตุการณ์ ตัวเลือก/เซฟเดินเหมือนเดิม
function eventCard(st, ev, news = null) {
  pickFocus(st);
  // การ์ดเล่าเรื่อง (choices: [] ใบ 07) ไม่มีอะไรให้เลือก — ไม่ตั้ง pending ไม่งั้นใบถัดไปเปิดไม่ได้
  st.pending = ev.choices.length ? ev : null;
  // ตัดสินแบบงานศพตอนการ์ดออก (หลังคำสั่งเสียครบ) ครั้งเดียว — lockReason อ่านค่านี้ทั้งตอนวาดและตอนกด
  if (ev.id === FUNERAL.rite) st.funeralPick ??= pickRite(st, ev);
  return emit(st, {
    kind: 'event',
    id: ev.id,
    // แนวการ์ดตามประเภทเหตุการณ์ (ใบ 06): A ชีวิตจริง · B ความเชื่อ/แฟนตาซี
    type: ev.type ?? 'A',
    // การ์ดเนื้อหาที่ผูกเหตุการณ์บ้านเมือง — หน้าจอติดป้ายบ้านเมืองแทนช่วงวัย
    national: !!ev.era,
    ...(news && { news }),
    funeral: ev.id === FUNERAL.wishes || ev.id === FUNERAL.rite,
    age: st.age,
    stage: stageOf(st.age),
    title: ev.title ? fill(ev.title, st) : null,
    text: fill(ev.text, st),
    choices: ev.choices.map((c) => fill(c.text, st)),
    ...choiceHints(ev, st),
    fx: ev.choices.map((c) => choiceFx(st, ev, c)),
    // เหตุผลที่ตัวเลือกกดไม่ได้ (null = กดได้) — หน้าจอแสดงเทาพร้อมเหตุผล
    locked: ev.choices.map((c) => lockReason(st, c)),
    ...moneyShort(ev, st),
  });
}

// ตัวเลือกที่ล็อกเพราะเงินบอกยอดที่ขาด (B107) — ใส่ช่องเฉพาะการ์ดที่มีตัวนั้น การ์ดอื่นรูปเดิมทุกช่อง
// ล็อกด้วยเหตุที่ชนะเงินก่อน (อายุ · แบบงานศพที่ตกลงไว้) ไม่บอกยอด — เติมเงินก็ยังกดไม่ได้
// loans = แหล่งกู้ต่อตัวเลือก (B111) เฉพาะตัวที่ขาดแค่เงิน — ขาดอย่างอื่นด้วย กู้แล้วก็ยังกดไม่ได้ จึงไม่เสนอ
function moneyShort(ev, st) {
  const moneyGap = ev.choices.map((c) => choiceGap(st, c));
  if (!moneyGap.some((v) => v !== null)) return {};
  const loans = moneyGap.map((gap, i) => {
    if (gap === null || lockReason(st, ev.choices[i], Math.ceil(gap)) !== null) return null;
    const opts = loanOptions(st, Math.ceil(gap));
    return opts.length ? opts : null;
  });
  return { moneyGap, ...(loans.some((l) => l) && { loans }) };
}

// บรรทัดรองบอกข้อแลกใต้ตัวเลือก (B52) — ใส่ช่องเฉพาะการ์ดที่มี hint การ์ดเดิมจึงมีรูปเท่าเดิมทุกช่อง
export function choiceHints(ev, st) {
  const auto = ev.choices.map((c) => jobHint(st, c));
  if (!ev.choices.some((c, i) => c.hint || auto[i])) return {};
  return { hints: ev.choices.map((c, i) => (c.hint ? fill(c.hint, st) : auto[i])) };
}

// ตัวเลือกที่พาไปงานใหม่บอกช่วงรายได้ (B40) — ค่าจ้างอาชีพ×ภาคของปีนี้ บอกเป็นช่วงไม่ใช่เลขเป๊ะ ผู้เล่นจึงชั่งได้แต่เดาผลไม่ได้
// มีงานอยู่แล้วต่อท้ายช่วงของงานเดิมให้เทียบ · เปลี่ยนงานแล้วตัวคูณรายได้เริ่มนับใหม่ ช่วงงานใหม่จึงไม่คูณ
export const PAY_BAND = [0.8, 1.25];
const twoDigits = (v) => {
  const p = 10 ** Math.max(0, Math.floor(Math.log10(Math.max(1, v))) - 1);
  return (Math.round(v / p) * p).toLocaleString('en-US');
};
function jobHint(st, c) {
  const fx = c.effects?.job || c.effects?.ladder ? c.effects : c.outcomes?.find((o) => o.ok && (o.effects?.job || o.effects?.ladder))?.effects;
  const id = fx?.job;
  if (!fx || st.dead || (id && id === st.occupation && st.workFrom !== null)) return null;
  const year = st.birthYear + st.age;
  const band = (w) => `${twoDigits(w * PAY_BAND[0])}–${twoDigits(w * PAY_BAND[1])}`;
  const next = id ? monthlyWage(st.content.era, st.seed, id, st.ses, year) : ladderStartPay(st, fx.ladder, year);
  const now = isWorking(st) ? ` · งานเดิมราว ${band(monthlyIncome(st, year))}` : '';
  return `รายได้ราว ${band(next)} บาท/เดือน${now}`;
}

// ตัวเลือกที่ต้องมีเงิน/ค่าสถานะ/ธงถึงจะเลือกได้ (B14 A6) · ข้อความเหตุผลจากเนื้อหาทับข้อความตั้งต้น
// extra = เงินที่จะกู้มาเติม — ถามว่ากู้แล้วกดได้ไหม โดยไม่แตะ state
function lockReason(st, c, extra = 0) {
  if (st.pending?.id === FUNERAL.rite && st.funeralPick && c.id !== st.funeralPick) return 'ไม่ใช่แบบที่ตกลงกัน';
  const q = c.requires;
  if (!q) return null;
  // อายุตามกฎหมายบอกเหตุผลของตัวเอง — reason ของเนื้อหาเขียนไว้ให้เงื่อนไขอื่น (เช่น "สั่งไว้แล้ว")
  if (q.age && st.age < (q.age.min ?? 0)) return `อายุยังไม่ถึง ${q.age.min} ปี`;
  if (q.age && st.age > (q.age.max ?? Infinity)) return `อายุเกิน ${q.age.max} ปี`;
  const why = [];
  // ตายแล้ว (การ์ดงานศพ) หนี้ต้องหักก่อน — จ่ายได้ไม่เกินทรัพย์สุทธิ ค่างานศพจึงไม่ทำให้ตายพร้อมหนี้
  const purse = (st.dead ? deadPurse(st) : st.money) + extra;
  if (q.money && purse < moneyValue(st, q.money)) why.push('เงินไม่พอ');
  for (const [k, b] of Object.entries(q.stats ?? {})) {
    if (b.min !== undefined && st[k] < b.min) why.push(`${STAT_LABELS[k]}ไม่ถึง`);
    if (b.max !== undefined && st[k] > b.max) why.push(`${STAT_LABELS[k]}มากเกินไป`);
  }
  if (q.flags && !flagsOk(st, q.flags)) why.push('ยังไม่เข้าเงื่อนไข');
  if (q.edu && eduRank(st.edu) < eduRank(q.edu)) why.push('วุฒิไม่ถึง');
  if (q.family && !q.family.every((f) => familyOk(st, f))) why.push(q.family.every((f) => f.role === 'parent') ? 'พ่อแม่ไม่อยู่แล้ว' : 'ครอบครัวยังไม่เข้าเงื่อนไข');
  if (!why.length) return null;
  return q.reason ?? why.join(' · ');
}

// ดัชนีตัวเลือกที่กดได้ — บอทเลือกจากชุดนี้เท่านั้น · ไม่มีตัวล็อก = ทุกตัว (ลำดับสุ่มของบอทจึงเหมือนก่อนมีการล็อก)
export const openChoices = (card) => card.choices.map((_, i) => i).filter((i) => !card.locked?.[i]);

// เดินปีละครั้งจนมีการ์ดถึงกำหนดหรือตาย คืนการ์ดใบถัดไป
export function nextCard(st) {
  if (st.trip) {
    if (st.trip.step !== 'over') return { ...nextIsekaiCard(st.trip), trip: true, life: st.age };
    return tripBack(st);
  }
  if (st.pending) throw new Error('ยังมีการ์ดที่รอเลือก');
  // คิวมาก่อนการตาย — การ์ดงานศพเข้าคิวตอนตายแล้วต้องออกก่อนมรณบัตร
  if (st.dead && !st.queue.length) return deathCard(st);
  // การ์ดเปลี่ยนช่วง/เหตุการณ์ยุค/ผลสุ่มเป็นใบของตัวเอง เรียงตามที่ถึงกำหนดในปีนั้น
  if (st.queue.length) {
    const card = st.queue.shift();
    if (card.kind === 'eraEvent') {
      // ใบรับมือยุคถูกเลือกตอนขึ้นปี ก่อนด่านเรียนต่อของปีเดียวกันได้ตอบ — เลิกเรียนไปแล้วใบเรื่องโรงเรียนต้องไม่ออก
      if (card.ev.era && !whenOk(st, card.ev.when)) {
        delete st.done[card.ev.id];
        return nextCard(st);
      }
      return eventCard(st, card.ev);
    }
    // ข่าวบ้านเมืองที่มีการ์ดรับมือของเหตุการณ์เดียวกันต่อท้าย = ใบเดียว (B58) — ไม่งั้นผู้เล่นกด "ต่อไป" ใบเปล่าก่อนเรื่องจริง
    // ไม่แตะ rng/state ผลเกมจึงเท่าเดิม ต่างแค่จำนวนการ์ด
    const pair = st.queue[0];
    if (card.kind === 'era' && ERA_NEWS.merge && pair?.kind === 'eraEvent' && pair.ev.era === card.id) {
      st.queue.shift();
      if (whenOk(st, pair.ev.when)) return eventCard(st, pair.ev, { text: card.text, story: card.story });
      // ใบรับมือตกด่าน when ซ้ำ (B59) — ข่าวออกเดี่ยว
      delete st.done[pair.ev.id];
    }
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
        return queueFuneral(st) ? nextCard(st) : deathCard(st);
      }
      stepYear(st);
    }
    st.advance = true;
    // การ์ดชวนไปต่างโลก (B68d) ออกต้นปี ใบถัดไปต้องไม่เดินเวลา
    const offer = entryCard(st, stageOf(st.age));
    if (offer) {
      st.advance = false;
      return offer;
    }
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
    // กองสุ่มจับได้ปีละ poolRounds รอบ หลังหลักไมล์/นัดของปีนั้นหมดแล้ว · การ์ดที่จับได้อาจนัดตอนต่อปีเดียวกัน — ค้นนัดก่อนรอบถัดไป
    if (st.poolAge !== st.age) {
      st.poolAge = st.age;
      st.poolLeft = poolRounds(stageOf(st.age));
    }
    while (!ev && st.poolLeft > 0) {
      st.poolLeft--;
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
  // รอบที่กองแห้งนับแยกช่วงวัย — harness/pace.mjs อ่านเป็นรายการกองที่ต้องเติม (ไม่ออกไปกับการ์ด)
  if (!pool.length) (st.poolDry ??= {})[stage] = (st.poolDry[stage] ?? 0) + 1;
  if (!pool.length || st.rng.next() >= POOL_CHANCE[stage]) return null;
  // การ์ดทาง B (สายมู/ลาง) มีเป้าจำนวนต่อชีวิต — จับหลายรอบแล้วหรี่น้ำหนักตามรอบ ไม่ให้ล้นเป้า
  const b = poolEffectScale(stage);
  return weighted(st.rng, pool, pool.map((e) => e.weight * poolMultiplier(st, e.multipliers) * (e.type === 'B' ? b : 1)));
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
  // เพศมีผลต่อโอกาสการ์ด (B109 · เจ้าของเคาะ) — เพศกำเนิด ชาย/หญิง · when.sex มีอยู่แล้ว
  let x = (m.class ? (m.class[classNow(st)] ?? 1) : 1) * (m.sex?.[st.sex] ?? 1);
  for (const [k, v] of Object.entries(m.stats ?? {})) x *= st[k] >= STAT_HIGH ? v : st[k] <= STAT_LOW ? 1 / v : 1;
  if (m.karma) x *= m.karma ** Math.sign(netLedger(st.ledger));
  // ขอพร: เอียงตามบัญชีแบบต่อเนื่อง บุญน้อยเอียงน้อย บาปหนักกลับทิศ
  if (m.wish) x *= m.wish ** ledgerLevel(st.ledger);
  if (m.family_fame) x *= m.family_fame ** (st.fame ?? 0);
  for (const [f, v] of Object.entries(m.flags ?? {})) if (st.flags[f]) x *= v;
  if (m.occupation && st.workFrom !== null) x *= m.occupation[st.occupation] ?? 1;
  if (m.rank) x *= m.rank ** rankLevel(st);
  // ตัวคูณเงิน {min, max, v}: อัตราส่วนอยู่ในช่วง = คูณ v · คำนวณเฉพาะการ์ดที่ใช้ เพราะกองสุ่มเรียกทุกใบทุกปี
  if (MONEY_KEYS.some((k) => m[k])) {
    const r = moneyRatios(st);
    for (const k of MONEY_KEYS) if (m[k] && inBound(r[k], m[k])) x *= m[k].v;
  }
  return x;
}

const inYears = (e, year) => !e.years || (year >= e.years[0] && year <= e.years[1]);
const inRange = (v, r) => !r || (v >= r[0] && v <= r[1]);
const inBound = (v, b) => !b || ((b.min === undefined || v >= b.min) && (b.max === undefined || v <= b.max));
const flagsOk = (st, f) => (f.has ?? []).every((k) => st.flags[k]) && !(f.not ?? []).some((k) => st.flags[k]);
// ครอบครัวมีแค่พ่อแม่ (ด่าน family-system กั้นบทบาทอื่นไว้) · เงื่อนไขผ่านเมื่อพ่อหรือแม่คนใดคนหนึ่งตรง
// เงื่อนไขเกิดแบบประกาศทุกฟิลด์ (ใบ 07)
export function whenOk(st, when) {
  if (!when) return true;
  if (when.family && !when.family.every((f) => familyOk(st, f))) return false;
  if (when.loss && !lossOk(st, when.loss)) return false;
  if (!inRange(st.age, when.age) || !inRange(st.birthYear + st.age, when.year)) return false;
  if (when.class && !when.class.includes(classNow(st))) return false;
  if (when.region && !when.region.includes(st.region)) return false;
  if (when.sex && !when.sex.includes(st.sex)) return false;
  for (const [k, b] of Object.entries(when.stats ?? {})) if (!inBound(st[k], b)) return false;
  // อาชีพนับเมื่อมีงานของตัวเองแล้ว — อาชีพครอบครัวก่อนทำงานไม่ทำให้การ์ดที่ทำงานออก
  if (when.occupation && !(st.workFrom !== null && when.occupation.includes(st.occupation))) return false;
  if (when.school && !when.school.includes(schoolOf(st))) return false;
  if (when.ladder && !when.ladder.includes(st.ladder?.id ?? 'none')) return false;
  if (MONEY_KEYS.some((k) => when[k])) {
    const r = moneyRatios(st);
    if (MONEY_KEYS.some((k) => when[k] && !inBound(r[k], when[k]))) return false;
  }
  return !when.flags || flagsOk(st, when.flags);
}

// ป้ายบุญบาปเข้าบัญชีซ่อน · ธง · นัดเหตุการณ์ต่อเนื่อง (ใบ 07) — นัดสุ่มปีจาก rng ของโลก เพราะเป็นผลของการเลือก
function applyChoice(st, ev, c, text) {
  // คำบนเดียวกันมีหลายการ์ดนัด (ครั้งที่ 1 · ครั้งที่ 2) — ใช้ธงคำบนที่การ์ดปิดเป็นตัวระบุ ไม่ใช่ id การ์ด
  const vow = (c.clears_flags ?? []).find((f) => f.startsWith('vow_open:')) ?? ev.id;
  noteDeed(st, text, () => {
    for (const f of recordMerit(st.ledger, c.merit, vow)) st.flags[f] = true;
  });
  for (const f of c.sets_flags ?? []) {
    st.flags[f] = true;
    st.flagAge[f] ??= st.age;
  }
  for (const f of c.clears_flags ?? []) delete st.flags[f];
  applyFamily(st, c, ev.category === 'family' && c.effects?.relations > 0 ? c.effects.relations : 0);
  for (const s of c.schedules ?? []) st.scheduled.push({ event: s.event, age: st.age + st.rng.int(s.after_years[0], s.after_years[1]) });
}

// รายการบุญบาปตามอายุ (B26) — วัดจากบัญชีที่ขยับจริง ไม่ใช่ป้ายบนตัวเลือก: คำบนที่ผิดซ้ำไม่ทบ จึงไม่ควรขึ้นซ้ำ
// ผลสุ่มของตัวเลือกเดียวกันรวมเข้ารายการเดิม ผู้เล่นทำเรื่องเดียว · อยู่ใน st ไม่ออกไปกับการ์ด หน้าจออ่านตอนวาดการ์ดปรโลก
export function noteDeed(st, text, record, age = st.age) {
  const m0 = st.ledger.merit, s0 = st.ledger.sin;
  record();
  for (const [bad, w] of [[false, st.ledger.merit - m0], [true, st.ledger.sin - s0]]) {
    if (!(w > 0)) continue;
    const last = st.deeds.at(-1);
    if (last && last.age === age && last.text === text && last.bad === bad) last.weight += w;
    else st.deeds.push({ age, text, bad, weight: w });
  }
}

// loan = ชนิดหนี้จาก card.loans[idx] (กู้มาจ่าย) · ไม่ส่ง = เลือกแบบเดิม บอทและเซฟเก่าเดินเหมือนเดิมทุกก้าว
export function choose(st, idx, loan) {
  if (st.trip) return chooseIsekai(st.trip, idx);
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
  if (ev?.entry) {
    if (!ev.choices[idx]) throw new Error('ตัวเลือกไม่ถูกต้อง');
    st.pending = null;
    // ปฏิเสธ = ไม่แตะอะไรเลย · กดรับ = จบชีวิตตรงนี้ งานศพตามปกติ แล้วปรโลกส่งข้ามโลก (ธง isekai_call)
    // ทางที่ได้กลับ (B68m) = ไปต่างโลกทั้งตัวกลางชีวิต ไม่ตั้งธง · บัญชีบุญบาปส่งตัวเดียวกันเข้าไป
    const n = st.trips?.length ?? 0;
    const trip = idx === ENTRY.accept && tripRoll(st.seed, ev.entry, n);
    if (trip) {
      st.log.push({ id: `isekai_${ev.entry}`, age: st.age, choice: idx, text: ev.choices[idx].text });
      st.trip = startIsekai({
        seed: (st.seed ^ TRIP.salt ^ Math.imul(n + 1, 0x9e3779b1)) >>> 0, past: st.name, ledger: st.ledger,
        lore: isekaiWorldLore([...(st.lineage ?? []), { trips: st.trips }]),
        trip: { ...trip, age: st.age, wit: st.knowledge / TRIP.wit },
      });
      return;
    }
    if (idx === ENTRY.accept) {
      st.flags.isekai_call = true;
      st.isekaiVia = ev.entry;
      st.log.push({ id: `isekai_${ev.entry}`, age: st.age, choice: idx, text: ev.choices[idx].text });
      st.dead = true;
      queueFuneral(st);
    }
    return;
  }
  if (!ev || !ev.choices[idx]) throw new Error('ตัวเลือกไม่ถูกต้อง');
  if (loan !== undefined) borrowFor(st, ev.choices[idx], loan);
  if (lockReason(st, ev.choices[idx])) throw new Error('ตัวเลือกนี้ล็อกอยู่');
  st.pending = null;
  // เติมข้อความก่อนผลลง — {เงิน} ต้องเป็นยอดตอนที่ผู้เล่นเห็นตัวเลือก
  const text = fill(ev.choices[idx].text, st);
  const c = ev.choices[idx];
  if (ev.id === FUNERAL.rite) {
    st.funeral = { id: c.id, text, cost: c.effects?.money ? -moneyValue(st, c.effects.money) : 0 };
    // คนมาส่งทำบุญอุทิศให้ — ลงบัญชีก่อนถึงปรโลก
    noteDeed(st, 'คนที่มาส่งทำบุญอุทิศให้ในงานศพ', () => addMerit(st.ledger, 'dana', Math.min(FUNERAL.guestMerit.cap, guestBase(st) / FUNERAL.guestMerit.ref)));
  }
  const pool = ev.weight && ev.age === undefined && !ev.era;
  const s = pool ? poolEffectScale(stageOf(st.age)) : 1;
  const ss = pool ? poolStatScale(stageOf(st.age)) : 1;
  applyEffects(st, c.effects, s, ss);
  applyChoice(st, ev, c, text);
  st.log.push({ id: ev.id, age: st.age, choice: idx, text, ...(loan !== undefined && { loan }) });
  // ผลสุ่ม: จับทางด้วย rng ของโลก (เป็นผลของการเลือก) แล้วเล่าเป็นการ์ดผลลัพธ์ใบถัดไป
  // น้ำหนักแต่ละทางเอียงตาม multipliers ของทางนั้น — บัญชีอ่านหลังป้ายบุญบาปของตัวเลือกนี้ลงแล้ว (กรรมตามทันทันที)
  // การ์ดที่ตัวเลือกนี้ก่อ (ผล → เรื่องต่อ → หางาน) เข้าหัวคิวตามลำดับ ก่อนการ์ดอื่นของปีที่รออยู่
  // สายมูก่อการ์ดของตัวเองได้ (ผลหวยสายมู) — มาก่อนผลสุ่มของตัวเลือก
  const after = beliefChoice(st, ev, c);
  if (c.outcomes?.length) {
    const o = weighted(st.rng, c.outcomes, outcomeWeights(st, ev, c));
    const helper = !o.ok && hurts(st, o.effects) ? (kinAid(st) ?? netAid(st, ev, o)) : null;
    applyEffects(st, o.effects, s, ss, helper ? KIN_AID.scale : 1);
    applyChoice(st, ev, o, text);
    if (o.text) after.push({ kind: 'result', type: ev.type ?? 'A', age: st.age, stage: stageOf(st.age), text: fill(o.text, st) + (helper ? ` · ${helper.who ?? AID_WHO[helper.role]}${helper.name}มาช่วยประคอง เลยหนักแค่ครึ่งเดียว` : '') });
    // ผลชี้เรื่องต่อ: การ์ดเลือกของเหตุการณ์นั้นตามหลังการ์ดผลทันที อายุเดียวกัน · เงื่อนไขปี/when ไม่ผ่าน = จบที่การ์ดผล
    const follow = o.next && st.content.events.find((e) => e.id === o.next);
    if (follow && inYears(follow, st.birthYear + st.age) && whenOk(st, follow.when) && beliefOk(st, follow)) {
      st.done[follow.id] = true;
      st.fired[follow.id] = { n: (st.fired[follow.id]?.n ?? 0) + 1, age: st.age };
      beliefFired(st, follow);
      after.push({ kind: 'eraEvent', ev: follow, age: st.age });
    }
  }
  // คำสั่งเสียเลือกได้หลายข้อ: สั่งเรื่องหนึ่งแล้วการ์ดกลับมาให้สั่งต่อ ข้อที่สั่งแล้วล็อกด้วยธงของมันเอง
  if (ev.id === FUNERAL.wishes && (c.sets_flags ?? []).some((f) => f.startsWith('wish_'))) after.push({ kind: 'eraEvent', ev, age: st.age });
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
    text: `${lifeEndWord(isGone(st))} ${st.age}`,
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
  card.life = lifeSeries(st);
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
  const pets = petsAfter(st);
  if (pets) card.pets = pets;
  if (st.funeral) {
    const { text, cost } = st.funeral;
    card.funeral = { text, guests: funeralGuests(st), cost: Math.round(cost) };
  }
  // มีทรัพย์ให้แบ่ง + ลูกที่ยังอยู่ถึงเกณฑ์ = เรื่องพินัยกรรม (afterlife.mjs หักส่วนที่เสียไปกับการทะเลาะ) · ลูกคนเดียวไม่มีใครให้ทะเลาะด้วย
  if (card.summary.money > 0 && !card.short && disputes(st)) card.will = !!st.flags.wish_will;
  return card;
}

// งานศพ (B25): ตายหลังพ้นวัยเด็ก → การ์ดคำสั่งเสีย (วนจนกด "พอ") แล้วการ์ดแบบงานศพ ก่อนมรณบัตร
// ตายตอนเด็กข้ามฉากนี้ — มรณบัตรเด็กเป็นบันทึกสั้น (ใบ 07) · ตัวคูณแขกผูกกับ id ตัวเลือกใน content/funeral.yaml
export const FUNERAL = {
  wishes: 'funeral_wishes_01',
  rite: 'funeral_rite_01',
  guests: { one_day: 0.3, chant_3: 0.7, chant_7: 1, grand: 1.6, body: 0.2, temple: 0.4 },
  // B25b ค่าตั้งของเกม: บุญจากแขกคิดจากฐานแขกไม่คูณขนาดงาน (กันซื้อบุญด้วยเงิน) หารด้วย ref เพดาน cap (= บาประดับ 1 ของงานใหญ่)
  guestMerit: { ref: 500, cap: 1 },
  // คนข้างหลังเลือกแบบงานตามความสัมพันธ์: ถึง high = งานแพงที่จ่ายไหว · ต่ำกว่า low = เผาวันเดียว · ระหว่างนั้น = สวด 3 คืน
  love: { high: 70, low: 40 },
  // ลูกที่ยังอยู่ตั้งแต่เท่านี้ถึงมีการแบ่งมรดกกันเอง (เจ้าของเคาะ A9)
  disputeKids: 2,
};
const guestBase = (st) => 20 + st.relations * 2 + st.network * 3;
// แขกมาส่งตามความสัมพันธ์/คอนเน็คชั่น คูณขนาดงาน — ปัดสิบ ไม่ใช่ยอดนับจริง · ไม่มีงานศพ = 0
export const funeralGuests = (st) => (st.funeral ? Math.round(((FUNERAL.guests[st.funeral.id] ?? 1) * guestBase(st)) / 10) * 10 : 0);
// state ก่อนมีระบบครอบครัว (ไม่มี kin) ถือว่าถึงเกณฑ์ — ตรงกับ LEGACY.kids ของ afterlife.mjs
export const disputes = (st) => (livingChildren(st) ?? FUNERAL.disputeKids) >= FUNERAL.disputeKids;
const deadPurse = (st) => Math.min(st.money, netWorth(st));

// แบบงานศพที่คนข้างหลังเลือก (B25b) · คำสั่งบริจาคร่างทับทุกอย่าง · ไม่มีลูกหลานหรือจ่ายแบบไหนไม่ไหว = วัด/มูลนิธิจัดให้
// สุ่มจาก rng ของชีวิตครั้งเดียวเฉพาะตอนต้องเลือกระหว่างงานใหญ่กับสวด 7 คืน
function pickRite(st, ev) {
  if (st.flags.wish_body) return 'body';
  const heirs = st.kin ? st.kin.some((m) => (m.role === 'child' || m.role === 'grandchild') && m.alive) : !!st.flags.has_kids;
  if (!heirs) return 'temple';
  const purse = deadPurse(st);
  const ok = (id) => {
    const c = ev.choices.find((x) => x.id === id);
    return !!c && (!c.requires?.money || purse >= moneyValue(st, c.requires.money));
  };
  let want = ['one_day'];
  if (st.relations >= FUNERAL.love.high) want = [...(st.rng.next() < 0.5 ? ['grand', 'chant_7'] : ['chant_7', 'grand']), 'chant_3', 'one_day'];
  else if (st.relations >= FUNERAL.love.low) want = ['chant_3', 'one_day'];
  return want.find(ok) ?? 'temple';
}
// ทริปจบ (การ์ดจบออกไปแล้ว): ตายในต่างโลก = ชีวิตไทยจบแบบหายตัว · กลับบ้าน = เวลาไทยเดินตามที่ทอยไว้แล้วเล่าการกลับ
// ปีที่หายไปเดินด้วย stepYear ปกติ (เงิน คนในบ้าน ด่านเรียน) แต่ไม่ทอยตายและไม่จับกอง — ตัวไม่อยู่ เรื่องของปีนั้นจึงมาเป็นข่าวหลังกลับ
function tripBack(st) {
  const isk = st.trip;
  st.trip = null;
  (st.trips ??= []).push(tripLineage(isk));
  if (!isk.home) {
    st.tripLost = true;
    st.dead = true;
    return queueFuneral(st) ? nextCard(st) : deathCard(st);
  }
  const away = isk.age - isk.trip.from;
  const c = tripCarry(isk);
  st.money += c.gold * st.price;
  st.network = clamp(st.network + c.network);
  st.knowledge = clamp(st.knowledge + c.knowledge);
  for (let i = 0; i < isk.trip.thai; i++) stepYear(st);
  // ใบตัดสินใจที่ถึงกำหนดทุกปี (เลื่อนขั้น ทบทวนเงิน ช่วงวัย) ซ้อนกันหลายใบ — เก็บใบล่าสุดของแต่ละเรื่อง ใบเก่าสร้างจากสถานะที่ไม่ใช่แล้ว
  const key = (c) => (c.kind === 'eraEvent' ? `e:${c.ev.id}` : ['alloc', 'stage', 'omen'].includes(c.kind) ? c.kind : null);
  st.due = st.due.filter((c, i) => !key(c) || !st.due.slice(i + 1).some((d) => key(d) === key(c))).map((c) => ({ ...c, age: st.age }));
  st.away = (st.away ?? 0) + away - isk.trip.thai;
  st.advance = false;
  const when = isk.trip.thai ? `ผ่านไป ${isk.trip.thai} ปี` : 'ผ่านไปแค่ไม่กี่เดือน';
  return emit(st, { kind: 'result', type: 'B', trip: true, age: st.age, stage: stageOf(st.age), text: `ลืมตาอีกทีก็ยืนอยู่หน้าบ้านหลังเดิม ในต่างโลกคุณอยู่มา ${away} ปี แต่ที่นี่${when} คนที่บ้านนึกว่าคุณหายตัวไป` });
}

function queueFuneral(st) {
  if (st.age < STAGES[1].from) return false;
  const evs = [FUNERAL.wishes, FUNERAL.rite].map((id) => st.content.events.find((e) => e.id === id)).filter(Boolean);
  if (!evs.length) return false;
  for (const ev of evs) {
    st.done[ev.id] = true;
    st.fired[ev.id] = { n: 1, age: st.age };
    st.queue.push({ kind: 'eraEvent', ev, age: st.age });
  }
  return true;
}

// เฉลยบัญชีบุญบาป (ใบ 09 "เฉลยที่ปรโลก") — ออกบนการ์ดปรโลกในระหว่างชาติใบเดียว (afterlife.mjs)
// ชื่อ key เลี่ยงคำที่ด่านรั่วของ harness จับ · harness ยกเว้นช่องนี้บนการ์ดปรโลกช่องเดียว
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
// ที่เกิดบนจอ (B34) — ภาคยังใช้คิดฐานะ/รายได้/ภัยพิบัติ จังหวัดเป็นแค่ที่อยู่ที่เล่า
export const provinceLabel = (st) => placeName(st.province);
// จังหวัดพร้อมภาค ให้ประโยคที่ผลขึ้นกับภาค (ภัยรายภาค) บอกได้ว่าทำไมโดน · กรุงเทพฯ ไม่ต้องต่อ · ปริมณฑลต่อชื่อกลุ่ม
export const areaLabel = (st) => (st.ses !== 'bkk' ? `${provinceLabel(st)} ${regionLabel(st)}` : st.province === 'กรุงเทพมหานคร' ? st.province : `${provinceLabel(st)} ปริมณฑลของกรุงเทพฯ`);

export function profileText(st) {
  return `เกิดปี ${st.birthYear} · ${st.sex} · ${provinceLabel(st)} · ฐานะ${st.cls} · ${jobText(st)}`;
}

export function statsOf(st) {
  return { health: st.health, happiness: st.happiness, knowledge: st.knowledge, relations: st.relations, network: st.network, money: st.money };
}

// harness วิ่งชีวิตผ่านฟังก์ชันชุดเดียวกับหน้าเว็บ ผู้เรียกส่งแค่ตัวเลือกเลือกตัวเลือก · onCard เห็นสถานะทุกการ์ด
// บอทได้ st เพื่ออ่านป้ายบุญบาปของตัวเลือกแทนการอ่านความหมายของข้อความแบบที่ผู้เล่นทำ — ห้ามอ่านบัญชีเอง
// stream ของบอทแยกจาก rng ของแกนเกม เพื่อไม่ให้การเลือกไปเปลี่ยนลำดับสุ่มของโลก
// st ส่งเข้ามาได้ = เล่นชีวิตรุ่นถัดไปที่ระหว่างชาติสร้างไว้
const tripAny = (card, rng) => {
  const open = card.choices.map((_, i) => i).filter((i) => !card.locked?.[i]);
  return open[Math.floor(rng.next() * open.length)];
};

export function playLife(seed, content, pickChoice, onCard, st = newLife(seed, content)) {
  const bot = makeRng(seed ^ 0x5bd1e995);
  for (;;) {
    const card = nextCard(st);
    onCard?.(card, st);
    if (card.kind === 'death') return { age: card.age, cards: st.cards + 1, state: st };
    // บอทที่ไม่ได้ประกาศ isekai ปฏิเสธการ์ดชวนโดยไม่ดึงเลขสุ่ม ⇒ ชีวิตเดินเท่าเดิม
    // การ์ดในทริป (B68m) ไม่มีป้ายบุญบาปแบบชีวิตไทย — บอทที่ประกาศ trip เลือกเอง ที่เหลือสุ่มตัวที่ไม่ล็อก
    if (card.trip && card.kind === 'isekai') {
      if (card.choices.length) choose(st, pickChoice.trip ? pickChoice.trip(card, bot) : tripAny(card, bot));
      continue;
    }
    // บอทคืนเลขตัวเลือก หรือ {i, loan} เมื่อกู้มาจ่าย (B111)
    if (card.choices?.length) {
      const p = card.entry && !pickChoice.isekai ? ENTRY.decline : pickChoice(card, bot, st);
      if (typeof p === 'object') choose(st, p.i, p.loan);
      else choose(st, p);
    }
  }
}
