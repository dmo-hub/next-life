import { makeRng, mixSeed } from './rng.mjs';
import { newKin, nameParents, applyFamily, ageKin, familyOk, focusOf, livingChildren, kinAid, KIN_AID, pickFocus, lossText, lossOk, lastLoss, petsAtBirth, petsAfter, funeralWho, petCall, lossCall, petArrivals, petArriveText, parentDied, kinIllNews, kinIllOk, lastSpouseLoss, spouseYears, filialNote, filialOk, filialMirrorText, illParentWord, letterTo, letterToText } from './family.mjs';
import { pickBirthYear, lifeQx, priceRatio, inflationRate, infantMortality, eraEventsAt, protoYear, qx, MAX_AGE } from './era.mjs';
import { CHRONIC, ILL_YEARS, causeHazards, causeShares, pickCause, kinDeathRoll, inherit, careHelp } from './death.mjs';
import { pickRegion, pickProvince, placeName, regionRatio, classOdds, nationalIncome, pickName, pickRealName } from './birth.mjs';
import { monthlyWage, minWage, pickOccupation, portfolioReturn, lendingRate, assetOpen, assetName, isAllocAge, allocOptions, periodReturns, formatReturn, ALLOC, DISCLAIMER, newDebt, payDebt, debtDone, debtOpen, debtName, complainDebt, firstPay } from './finance.mjs';
import { newLedger, recordMerit, addMerit, karmaMultiplier, omenTone, omenText, OMEN, netLedger, ledgerLevel, meritName, SIN_CATS, meritId, MERIT_LEVELS } from './merit.mjs';
import { TRACKS, SCHOOL_FROM, eduRank, schoolGate, jobCard, netAid } from './career.mjs';
import { jobWage, officePay, officeFull, rankName, enterByJob, enterLadder, promote, setOffice, ageRank, promoDue, promoCard, officeDue, officeCard, ladderOf, recruitDue, recruitCard, severanceDays, rankLevel, earlyDue, earlyCard, ladderStartPay, officeStep, budgetDue, budgetCard } from './rank.mjs';
import { beliefOk, beliefFired, beliefChoice, moneyTight } from './belief.mjs';
import { nearMiss, summonsCourt, courtCard, chooseCourt, courtPick } from './court.mjs';
import { cadetActive, cadetCard, chooseCadet, cadetAfterChoice } from './cadet.mjs';
import { introCard, eraStory } from './intro.mjs';
import { poolRounds, poolEffectScale, poolStatScale } from './pace.mjs';
import { FOCUS_FLOW, focusOffers, focusOpen, focusSet, focusYearEnd, focusCardMul, focusMain } from './focus.mjs';
import { entryCard, ENTRY, lifeEndWord, isGone, GONE_SEARCH, TRIP, tripRoll, startIsekai, nextIsekaiCard, chooseIsekai, isekaiFocusCard, isekaiFocusPick, tripCarry, tripLineage, isekaiWorldLore, isekaiWorldLegends, SKILL, SKILL_UP, skillUp, upgradeOffer, skillsBack, thaiSkillMul } from './isekai.mjs';
import { WARN, crossedLow, warnCard, warnPick } from './warn.mjs';
import { memoryCard, memoryEligible } from './memory.mjs';
import { pastLifeOk, pastTalent, talentStart } from './past.mjs';

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
// ป้ายที่ผู้เล่นเห็น (ปุ่ม · เหตุล็อก · ฉากเกิด · หน้าเฉลย) — health ขึ้นว่า "ชีวิต" เพราะหมดแล้วตาย · network เป็นค่าซ่อน ป้ายจึงเป็นคำคนพูด ไม่ใช่ชื่อค่า
// บอทใน harness อ่านป้ายย้อนกลับจากตารางนี้ เปลี่ยนคำแล้วบอทตามเอง
export const STAT_LABELS = { health: 'ชีวิต', happiness: 'ความสุข', knowledge: 'ความรู้', relations: 'ความสัมพันธ์', network: 'เส้นสาย', money: 'เงิน' };
// ป้ายหมวดการ์ดผล (ui-redo 60): จอเลือกภาพตามหมวด · จับจากข้อมูลบนการ์ด (แหล่ง · ชนิดข่าว · ทิศผลค่า) ไม่ดึงเลขสุ่ม ไม่อ่านคำในข้อความ
// ทิศนับเฉพาะค่าที่ลูกศรบนแถบโชว์ (network เป็นค่าซ่อน) และไม่ถูก hidden ของการ์ด/ตัวเลือกปิดไว้ — ป้ายห้ามเผยค่าที่ซ่อน
// ไม่มีป้าย (การ์ดค้างในเซฟเก่า · repairLife ไม่เติม) = หมวดกลาง ⇒ จออ่านผ่าน resultTag เท่านั้น
export const TAG_MID = 'mid';
export const RESULT_TAGS = ['good', 'bad', TAG_MID, 'loot', 'loss', 'sick', 'pet', 'inherit', 'retire', 'bankrupt', 'nature', 'search', 'survive', 'trip', 'belief', 'afterlife'];
export const resultTag = (card) => card.tag ?? TAG_MID;
const TAG_STATS = STAT_KEYS.filter((k) => k !== 'network');
export function fxTag(fx, hidden = []) {
  let n = 0;
  for (const k of TAG_STATS) if (fx?.[k] && !hidden.includes(k)) n += fx[k];
  return n > 0 ? 'good' : n < 0 ? 'bad' : TAG_MID;
}

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
// รอบจั่วหนึ่งจับเหตุการณ์จากกองสุ่มได้ด้วยโอกาสนี้ (เมื่อกองมีใบที่เกิดได้ · ปีหนึ่งจั่วหลายรอบตาม pace.mjs) แยกตามช่วงวัย — วัยรุ่น/หนุ่มสาวสั้นแต่เรื่องเยอะ
// ชราเป็นช่วงยาวสุด ถ้าถี่เท่ากันการ์ดจะล้นเพดานด่าน 4 (CARD_MAX ใน harness/gates.mjs)
export const POOL_CHANCE = { เด็ก: 0.3, วัยรุ่น: 0.5, หนุ่มสาว: 0.45, ทำงาน: 0.35, กลางคน: 0.35, ชรา: 0.3 };
// ตัวคูณรายได้ถาวรสะสมทั้งชีวิตอยู่ในเพดานนี้ — ผลซ้อนหลายครั้งไม่ทำให้รายได้หายหมดหรือพุ่งไร้ขอบ
export const INCOME_MULT = [0.1, 5];
// ผลเรื้อรังสะสมต่อค่าได้ไม่เกิน ±CHRONIC_MAX ระดับ · ไหลระดับละ CHRONIC_STEP หน่วยต่อปี · จางลงระดับละ 1 ทุก CHRONIC_FADE ปี
// สุขภาพไหลเบากว่าค่าอื่น: การตายอ่านสุขภาพตัวเดียว ค่าแรงกว่านี้ดึงอายุตายของบอทหลุดด่าน 3b · ค่าอื่นไม่แตะการตาย
const CHRONIC_MAX = 3;
const CHRONIC_STEP = { health: 0.35, happiness: 1, knowledge: 1, relations: 1, network: 1 };
const CHRONIC_FADE = 5;
// ค่าสถานะเอียงน้ำหนักต่อเนื่องทุกแต้ม (B112 · เจ้าของเคาะ) — v^((ค่า−50)/20) ตัดที่ ±2 ⇒ 70 = v และ 30 = 1/v เท่าแบบขั้นเดิม (เดิมคูณเฉพาะ ≥70 / ≤30)
// สุดทาง (≥90 / ≤10) = v² · โอกาสสำเร็จของตัวเลือกตัดที่ 5–95% (แบบต่างโลก B107b)
export const STAT_CURVE = { mid: 50, span: 20, cap: 2, okMin: 0.05, okMax: 0.95 };
export const statMul = (v, x) => v ** Math.max(-STAT_CURVE.cap, Math.min(STAT_CURVE.cap, (x - STAT_CURVE.mid) / STAT_CURVE.span));
const clamp = (v) => Math.max(0, Math.min(100, v));
// สุขต่ำมากทำอะไรก็ไม่เข้าหัว (B40): ความรู้ที่งอกเองรายปี + โอกาสสำเร็จของการ์ดเรียน/งาน คูณตามขั้น · เกณฑ์ = ต่ำกว่าค่าแรก
export const MOOD = [[15, 0.5], [30, 0.7]];
export const moodMul = (st) => MOOD.find(([below]) => st.happiness < below)?.[1] ?? 1;
const MOOD_CATS = ['work_money', 'study'];
// การ์ดที่แกนสร้าง (หางาน · ด่านเรียนต่อ) ไม่มีหมวด — นับเป็นเรียน/งานด้วย id
const moodCard = (ev) => !!ev && (MOOD_CATS.includes(ev.category) || ev.id === 'first_job' || ev.id?.startsWith('school_gate_'));
// สัญญากับมาร (B156): ยืมโชค = น้ำหนักทางสำเร็จคูณ luck จนถึงอายุที่สัญญาหมด (ยังโดนเพดาน okMax) · รอดตายได้ครั้งเดียวต่อชีวิต
// ราคาคือบาป mara_pact บนตัวเลือก (lint pact-shape) · st.pact อยู่กับชีวิตนี้ ไม่ส่งต่อรุ่น
export const PACT = { luck: 1.5, maxYears: 10, surviveText: 'ความตายเฉียดผ่านไปเหมือนมีใครเบี่ยงทางให้ ในหัวมีเสียงหัวเราะเบา ๆ ดังอยู่ครู่หนึ่ง' };
const pactLuck = (st) => (st.age < (st.pact?.luck ?? 0) ? PACT.luck : 1);
function signPact(st, p) {
  st.pact ??= {};
  if (p.luck) st.pact.luck = Math.max(st.pact.luck ?? 0, st.age + p.luck);
  if (p.survive && !st.pact.survive) st.pact.survive = true;
}
// น้ำหนักทางผลหลังเอียงตาม multipliers และอารมณ์ · การ์ดที่มีทั้งทางสำเร็จและไม่สำเร็จ ตัดโอกาสสำเร็จรวมไว้ okMin–okMax (B112) โดยปรับสองกลุ่มตามสัดส่วน
// (ไม่ดึงเลขสุ่มเพิ่ม · ป้าย % กับผลจริงใช้ตัวเดียวกัน)
const outcomeWeights = (st, ev, c) => {
  const m = (moodCard(ev) ? moodMul(st) : 1) * pactLuck(st) * thaiSkillMul(st.skills, ev?.category);
  const w = c.outcomes.map((o) => o.weight * poolMultiplier(st, o.multipliers) * (o.ok ? m : 1));
  const ok = w.reduce((a, x, i) => a + (c.outcomes[i].ok ? x : 0), 0);
  const all = w.reduce((a, x) => a + x, 0);
  if (ok <= 0 || ok >= all) return w;
  const p = ok / all;
  const q = Math.max(STAT_CURVE.okMin, Math.min(STAT_CURVE.okMax, p));
  if (q === p) return w;
  const kOk = q / p, kNo = (1 - q) / (1 - p);
  return w.map((x, i) => x * (c.outcomes[i].ok ? kOk : kNo));
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

// คำนำหน้าของนักเรียนเตรียมทหาร: "นรม." ตั้งแต่วันรายงานตัว แล้วเป็น "นตท." เมื่อได้ชุดปกติ (เจ้าของเคาะ 2026-11-11)
const CADET_TITLES = ['นรม.', 'นตท.'];
// ป้ายสถานะงานบนจอ: ก่อนมีงานไม่โชว์อาชีพ (อาชีพตอนเกิดเป็นของครอบครัว ใช้คิดเงินติดตัวเท่านั้น)
export function jobText(st, age = st.age) {
  if (st.workFrom === null) {
    // นตท. (สอบติดเตรียมทหาร) ใช้ track โรงเรียนนายร้อยชั่วคราว — ป้ายบนจอต้องเป็นนักเรียนเตรียมทหาร (เจ้าของเคาะ A 2026-11-06)
    // ช่วงแรกเป็น "นรม." (นักเรียนใหม่) ได้ชุดปกติแล้วเป็น "นตท." ทั้งสองแบบคือนักเรียนเตรียมทหาร (เจ้าของเคาะ 2026-11-11)
    if (CADET_TITLES.includes(st.title)) return 'นักเรียนเตรียมทหาร';
    if (st.school && age >= SCHOOL_FROM) return `กำลังเรียน${TRACKS[st.school].name}`;
    return age < SCHOOL_FROM ? 'ยังไม่เข้าเรียน' : 'ยังไม่ทำงาน';
  }
  // เกษียณก่อนกำหนด (fx.retire ตั้ง retiredAt) ไม่ต้องรอ 60 ถึงขึ้น "เกษียณ"
  return isWorking(st, age) || age < Math.min(RETIRE_AGE, st.retiredAt ?? Infinity) ? rankName(st) : `เกษียณ (เคยเป็น${rankName({ ...st, office: null })})`;
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
// B5 ทายาทจากการเกิด (เจ้าของเคาะ 2026-11-10 · 5.00% · from_age 0): ครอบครัวใหม่ (ชีวิตแรก / ไปเกิดบ้านอื่น) สุ่มว่าพ่อหรือแม่เคยรับราชการ
// ทางเป็นลูก/สายเลือด (heir.tier) = บ้านเดิม ไม่สุ่ม — ได้ธงก็ต่อเมื่อรุ่นก่อนถือธงจริง (afterlife heirFlags)
// stream แยกจาก seed เหมือนจังหวัด/พ่อแม่ — ไม่กินเลขสุ่มของโลก ลำดับชีวิตเดิมไม่เลื่อน · ค่าเป็นชั้น 1 (ลูก) แบบที่ heirFlags ส่ง
function birthHeirFlags(seed, content, heir) {
  if (heir?.tier) return {};
  const n = content.cadet?.numbers ?? {}, r = makeRng((seed ^ 0x7a3c11e5) >>> 0);   // salt ของ B5 เอง (ไม่ใช้ร่วมกับ stream อื่น)
  if (r.next() >= (n.heir_birth_p ?? 0)) return {};
  return { [r.next() < (n.heir_police_share ?? 0.5) ? 'police_family' : 'army_family']: 1 };
}

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
    // ชื่อจริงของตัวเอกเท่านั้น (ญาติ/ผังตระกูลใช้ชื่อเล่น) · ทายาทได้ชื่อจริงใหม่จาก seed ของชีวิตตัวเอง
    realName: pickRealName(seed, sex, birthYear, era.names),
    region: region.name,
    province,
    ses: region.ses,
    cls,
    // ก่อนได้งาน occupation = อาชีพของครอบครัว เป็นฐานของเงินในผลการ์ด (income_x) · ได้งานแล้วเปลี่ยนเป็นงานของตัวเอง
    occupation: occupation.id,
    occupationName: occupation.name,
    familyOcc: occupation.id,
    // บ้านสายยศ (afterlife ส่งมาเมื่ออาชีพสุดท้ายของพ่อแม่เป็นขั้นยศ) · ไม่มีคีย์ = สืบต่อด้วยอาชีพบ้านตามปกติ
    ...(heir?.familyLadder && { familyLadder: heir.familyLadder }),
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
    // อยู่ใต้เกณฑ์เตือนแล้ว (B160) — เกิดมาใต้เกณฑ์ไม่นับว่าตก
    lowWarned: s.health <= WARN.human,
    // บัญชีบุญบาปซ่อน — ห้ามส่งออกไปกับการ์ดหรือ statsOf
    ledger: heir?.ledger ?? newLedger(),
    // ที่มาของบัญชีชาตินี้ตามอายุ (B26) — บัญชีที่พกมาจากชาติก่อนไม่มีรายการ
    deeds: [],
    // รุ่นที่เท่าไรของตระกูล + บันทึกรุ่นก่อน · มรดกจากรุ่นก่อนที่ยังไม่ถึงอายุรับ (ทางเป็นลูก)
    gen: heir?.gen ?? 1,
    // ชื่อเสียงตระกูล 0–3 (B95b) ส่งต่อจากรุ่นก่อน · การ์ดเอียงตาม multipliers.family_fame
    fame: heir?.fame ?? 0,
    // ค่าซ้อนทับของตระกูล (overlapOf) — ใส่ช่องเฉพาะเมื่อ > 0 ⇒ ตระกูลที่ไม่เคยข้ามโลกได้สถานะเท่าเดิมทุกไบต์ · เซฟเก่าไม่มีช่อง = 0
    ...(heir?.overlap && { overlap: heir.overlap }),
    // ความจำข้ามชาติ (past.mjs) + อาชีพที่ติดพรสวรรค์มา — ชีวิตแรกไม่มีช่อง
    ...(heir?.past && { past: heir.past }),
    ...(pastTalent(heir?.past) && { talent: pastTalent(heir.past) }),
    // คนตายที่ตระกูลจำได้ (deadKinOf) — มีเฉพาะตระกูลค่าซ้อน > 0 · เซฟเก่าไม่มีช่อง = ยังไม่มีผีญาติ
    ...(heir?.deadKin && { deadKin: heir.deadKin }),
    lineage: heir?.lineage ?? [],
    legacy: heir?.legacy ?? null,
    // จดหมายคำฝากของรุ่นก่อน (afterfall-3) {age, from, cause, by} — ออกหลังมรดกถึงมือเท่านั้น
    letter: heir?.letter ?? null,
    // อายุที่ธงแต่ละตัวติดครั้งแรก — ระหว่างชาติอ่านอายุตอนมีลูก
    flagAge: {},
    omenTone: null,
    omenAge: null,
    flags: {},
    // ธงของรุ่นก่อนที่ทายาทได้รู้ {ธง: ชั้น} — แยกจาก flags เพราะ flags คือสิ่งที่ตัวเองเคยทำ (ฉายา/ความเสี่ยงตายอ่านอยู่)
    // B5: ทางเป็นลูก/สายเลือด = ธงจากรุ่นก่อนเท่านั้น · ครอบครัวใหม่ (afterlife ส่ง {} มา) = สุ่มทายาทจากการเกิด
    parentFlags: heir?.tier ? heir.parentFlags ?? {} : { ...(heir?.parentFlags ?? {}), ...birthHeirFlags(seed, content, heir) },
    // สกิลที่พกมาจากคลัง [{ id, lv }] (06s) ใช้ทั้งชีวิตนี้และชาติต่างโลกที่ตามมา · ไม่พก = ไม่มีช่อง (state เท่าก่อนมีสกิลข้ามชาติ)
    ...(heir?.skills?.length && { skills: heir.skills }),
    // ค่าที่ได้จากช่องพกที่ไม่ใช้ (ใบ 201) — การ์ดเกิดบอกเป็นคำ · เซฟเก่าไม่มี = ไม่มีบรรทัด
    ...(heir?.spare && { spare: heir.spare }),
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
    poolOwed: 0,
    incomeMult: 1,
    chronic: {},
    // อายุที่ระดับเรื้อรังของค่านั้นเปลี่ยนล่าสุด — นับรอบจางจากจุดนี้
    chronicAge: {},
    // เหตุการณ์ที่ออกแล้ว: จำนวนครั้ง + อายุครั้งล่าสุด ให้ใบที่ตั้ง repeat ออกซ้ำตามช่วงเว้น
    fired: {},
    parents,
    famRng,
    // สาเหตุตาย + นัดป่วยก่อนตาย (B110) — stream แยก ชีวิตที่รอดทุกปีไม่ทำให้ลำดับสุ่มของโลกขยับ
    causeRng: makeRng(seed ^ 0x9b05688c),
    terminal: null,
    cause: null,
    // สาเหตุ+นัดป่วยของพ่อแม่/ญาติ (B110 ชิ้น 2) — stream แยกจาก famRng/kinRng ที่ตัดสินว่าตายปีไหน ลำดับสุ่มเดิมจึงไม่ขยับ
    kinCauseRng: makeRng(seed ^ 0xc1059ed8),
    // โรคที่พ่อ/แม่จากไปด้วยและถ่ายทอดได้ (HEREDITARY) — คูณความเสี่ยงโรคนั้นของชีวิตนี้
    heredity: [],
    // คู่ครอง/ลูก/หลานที่เป็นคนจริง (B36a · family.mjs) — stream kinRng แยกจากโลกและจากพ่อแม่
    ...newKin(seed),
  };
  nameParents(st);
  // พ่อ/แม่ที่จากไปก่อนเราเกิด (ทางในตระกูล) เป็นประวัติครอบครัวตั้งแต่แรก
  for (const p of st.parents) if (!p.alive) inherit(st, p.cause);
  petsAtBirth(st, heir, CLASSES.indexOf(cls));
  if (heir?.start) skipToAge(st, heir.start.age);
  // เริ่มกลางวัย = เงินของบ้านเป็นบาทของปีที่เริ่ม (yearlySaving อ่านปีจาก st.age)
  st.money = era.birth.startMoney[CLASSES.indexOf(cls)] * yearlySaving(st);
  // การ์ดเปิดชีวิตมาก่อนการ์ดมรดกตอนแรกเกิด — ต้องเล่ามรดกก่อน receiveLegacy ล้าง st.legacy
  st.due.push(introCard(st, heir));
  // ทางเป็นลูก legacy.age >= 0 ⇒ อายุ 0 ได้ผลเท่าเดิม · เริ่มกลางวัย มรดกถึงมือปีที่เริ่ม (รุ่นก่อนตายปีนี้)
  if (st.legacy && st.legacy.age <= st.age) receiveLegacy(st, birthYear + st.age, stageOf(st.age));
  if (st.age > 0 && st.letter && !st.letter.read && !st.legacy && st.age >= st.letter.age) receiveLetter(st);
  if (heir?.start) startSchool(st, birthYear + st.age);
  st.trail.push({ year: birthYear + st.age, money: Math.round(st.money) });
  st.statTrail.push(statPoint(st));
  st.stageMark = markStage(st);
  lifeFocusBorn(st, heir?.focus);
  if (heir?.gates?.length) st.gates = [...heir.gates];
  overlapPlan(st);
  driftPlan(st);
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
// ค่าดิบไม่ปัด — harness ที่วัดผลเอียงเล็ก ๆ (ผลเบาสกิล k) เห็นต่างกันต่ำกว่าขั้นป้าย
export function successP(st, c, ev = null) {
  const fx = c.effects ?? {};
  const p = { ...st, flags: { ...st.flags } };
  for (const k of STAT_KEYS) if (fx[k]) p[k] = clamp(p[k] + levelValue(fx[k]));
  for (const f of c.sets_flags ?? []) p.flags[f] = true;
  for (const f of c.clears_flags ?? []) delete p.flags[f];
  const w = outcomeWeights(p, ev, c);
  return w.reduce((s, x, i) => s + (c.outcomes[i].ok ? x : 0), 0) / w.reduce((s, x) => s + x, 0);
}
export function successPct(st, c, ev = null) {
  const r = successP(st, c, ev);
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
    out.push(`${k === 'money' && fx[k].grey ? 'เงินเทา' : STAT_LABELS[k]}\u00a0${sign > 0 ? '↑' : '↓'}`);
  }
  if (fx.invest) out.push('ลงทุน');
  if (fx.grey_seize) out.push('เงินเทาถูกยึด');
  if (fx.grey_launder) out.push('ฟอกเงินเทา');
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
// ทุกที่ที่อ่านตารางชีพ/สัดส่วนสาเหตุ/ช่วงป่วยใช้อายุนี้ (B110) ไม่งั้นคนกลับจากต่างโลกตายตามอายุไทย
const bodyAge = (st) => st.age + (st.away ?? 0);

// ผลรวมทุกสาเหตุ (B110) — ปัจจัยเสี่ยงเอียงทั้งสาเหตุและโอกาสตายรวม
export function deathChance(st) {
  const py = protoYear(st.content.era, st.seed, st.birthYear + st.age);
  const age = bodyAge(st);
  if (qx(st.content.era, st.sex, py, age) >= 1) return 1;
  return Math.min(1, causeHazards(st, py, age, healthMultiplier(st) * karmaMultiplier(st.ledger)).reduce((s, x) => s + x, 0));
}

// ตายปีนี้ด้วยสาเหตุอะไร · null = รอด — ดึง st.rng ครั้งเดียวต่อปีเท่าเดิม สาเหตุและนัดป่วยใช้ causeRng แยก
// โรคเรื้อรังไม่ตายปีที่สุ่มโดน แต่นัดตายอีก 1–3 ปีข้างหน้าด้วยโอกาสของอายุนั้น (scheduleIllness) — ผลรวมยังตรงตารางชีพ
function deathRoll(st) {
  const u = st.rng.next();
  if (st.terminal && st.age >= st.terminal.age) return st.terminal.cause;
  const era = st.content.era;
  const py = protoYear(era, st.seed, st.birthYear + st.age);
  const age = bodyAge(st);
  if (qx(era, st.sex, py, age) >= 1) return 'other';
  const keys = era.causes.keys;
  const hz = causeHazards(st, py, age, healthMultiplier(st) * karmaMultiplier(st.ledger));
  // เด็กเล็กยังไม่มีนัดจากปีก่อนครบทุกระยะ — ส่วนที่นัดไม่ถึงของโรคเรื้อรังตายปีนี้เลย
  const span = ILL_YEARS[1] - ILL_YEARS[0] + 1;
  const unscheduled = (span - Math.max(0, Math.min(span, age - ILL_YEARS[0] + 1))) / span;
  const now = hz.map((x, j) => (CHRONIC.includes(keys[j]) ? x * unscheduled : x));
  const sum = now.reduce((s, x) => s + x, 0);
  if (u < sum) return pickCause(st.causeRng, keys, now);
  // เฉียดตาย (B153) ต้องไหลต่อไปนัดป่วยเหมือนรอดปกติ — ข้ามแล้ว causeRng ขาดหนึ่งครั้ง นัดโรคทั้งชีวิตเลื่อน
  nearMiss(st, u - sum, keys, now);
  if (!st.terminal) scheduleIllness(st);
  return null;
}

function scheduleIllness(st) {
  const era = st.content.era;
  const years = st.causeRng.int(...ILL_YEARS);
  // นัดเก็บเป็นอายุไทย (ตัวนับที่ deathRoll เทียบ) · โอกาสอ่านด้วยอายุร่างกาย ณ วันนัด
  const age = st.age + years;
  const body = bodyAge(st) + years;
  const py = protoYear(era, st.seed, st.birthYear + age);
  if (body >= MAX_AGE || qx(era, st.sex, py, body) >= 1) return;
  const keys = era.causes.keys;
  const ch = causeHazards(st, py, body, healthMultiplier(st) * karmaMultiplier(st.ledger)).map((x, j) => (CHRONIC.includes(keys[j]) ? x : 0));
  if (!(st.causeRng.next() < ch.reduce((s, x) => s + x, 0))) return;
  st.terminal = { cause: pickCause(st.causeRng, keys, ch), age, told: false };
}

// ด่านตายเดียวของโลกหลัก (ขอบปี + ชีวิตหมดกลางปี): สัญญารอดตาย (B156) มาก่อนพิธีโกงความตาย (B153) แล้วจึงตาย
// คืน 'survive' พร้อมการ์ดเล่า (ผู้เรียกวางเอง) · 'court' = ตั้ง st.court แล้ว · 'dead' = ตั้ง st.dead/st.cause แล้ว ผู้เรียกจัดงานศพ
function faceDeath(st, cause, opts = {}) {
  if (st.pact?.survive === true) {
    // สัญญาจ่ายบาปแล้วจึงได้ของจริง · สุขภาพกลับค่าธรรมชาติ ไม่งั้นหมดตัวแล้วตายซ้ำทันที
    st.pact.survive = 'used';
    // เสี่ยงของโฟกัสที่ทอยตายไว้ต้องหายด้วย ไม่งั้นรอดปีนี้แล้วปีถัดไปตายด้วยเหตุเดิมทันที
    st.focusDoom = undefined;
    st.health = Math.max(st.health, st.healthNatural, 1);
    return { fate: 'survive', card: { kind: 'result', type: 'B', age: st.age, stage: stageOf(st.age), text: PACT.surviveText, tag: 'survive' } };
  }
  if (st.flags.cheat_death) {
    // ไปศาลก่อน แล้วตายปีนี้ด้วยสาเหตุเดิม · afterQueue = การ์ดผลที่รอในคิวเล่าก่อนเข้าศาล
    st.court = { ...summonsCourt(cause), ...(opts.afterQueue ? { afterQueue: true } : {}) };
    return { fate: 'court' };
  }
  st.dead = true;
  st.cause = cause;
  return { fate: 'dead' };
}

function healthCause(st) {
  const era = st.content.era;
  const py = protoYear(era, st.seed, st.birthYear + st.age);
  return pickCause(st.causeRng, era.causes.keys, causeShares(era, st.sex, py, bodyAge(st)));
}

// ข้อความแกนตอนตรวจเจอ — เลน A ต่อยอดด้วยการ์ด when.illness (ดูแล/ค่ารักษา/บอกลา)
export const ILL_TEXT = {
  heart: 'หมอตรวจพบว่าหัวใจไม่ค่อยดีแล้ว ต้องกินยาและระวังตัวไปตลอด',
  stroke: 'เส้นเลือดในสมองตีบจนต้องนอนโรงพยาบาล ออกมาแล้วร่างกายไม่เหมือนเดิม',
  cancer: 'ผลตรวจออกมาว่าเป็นมะเร็ง หมอเริ่มพูดถึงการรักษาที่ยาวและหนัก',
  diabetes_kidney: 'เบาหวานกับไตทรุดลงจนหมอนัดตรวจถี่ขึ้นทุกเดือน',
  liver: 'หมอบอกว่าตับเริ่มแข็ง ต้องเลิกเหล้าและดูแลตัวเองอย่างจริงจัง',
  chronic_resp: 'หายใจหอบเหนื่อยง่ายขึ้นทุกวัน หมอบอกว่าปอดเสื่อมเรื้อรัง',
};

// ช่องแทนค่าครบทุกตัวในรายการปิดของด่าน build (PLACEHOLDERS) — ตัวที่ไม่เติมจะโผล่เป็น {ชื่อ} ดิบบนการ์ด
// ชื่อ = ชื่อเล่นที่สุ่มตอนเกิด (คำบรรยายยังเรียกผู้เล่นว่า "คุณ") · ลูกยังไม่มีชื่อ: เพศลูกรู้ตอนส่งไปเกิด ชื่อจึงตั้งที่รุ่นถัดไป
// จังหวัด = จังหวัดที่เกิด · ภาค = ภาคที่เกิด · คำพูดตามเพศ
export const FILL = {
  อายุ: (st) => st.age,
  ภาค: (st) => regionLabel(st),
  จังหวัด: (st) => provinceLabel(st),
  เงิน: (st) => Math.round(st.money).toLocaleString('en-US'),
  ชื่อ: (st) => st.name,
  // ผู้ใหญ่คนเดียวที่ดูแลในบ้าน (เจ้าของเคาะ ก 2026-11-06 · ใช้แทน "ผู้ใหญ่ในบ้าน" ที่หมายถึงคนเดียว): แม่ยังอยู่ = แม่ · มีแต่พ่อ = พ่อ · ไม่มีพ่อแม่ = ป้า
  ผู้ใหญ่: (st) => homeElder(st),
  // ---- เส้นเตรียมทหาร B1 (เจ้าของสั่ง "เริ่มสร้าง" 2026-11-09 · ยกจาก Demo fill) ----
  // คำลงท้ายภาษาถิ่น เฉพาะคำพูดครอบครัวที่ติดป้ายไว้: อีสาน เด้อ · เหนือ เน้อ · ใต้ หนิ · ภาคอื่นว่าง ("นะ{ถิ่น}" / "ๆ{ถิ่น}" จัดใน fill)
  ถิ่น: (st) => DIALECT[st.region] ?? '',
  // คนพูดเรียกตัวละคร: พ่อ/แม่พูด = ลูก · ป้าพูด (ไม่มีพ่อแม่) = หลาน
  ลูก: (st) => (homeElder(st) === 'ป้า' ? 'หลาน' : 'ลูก'),
  // คนในบ้านที่เคยใส่เครื่องแบบ (heirCase): พ่อยังอยู่ = พ่อ · มีแต่แม่ที่รับราชการเอง = แม่ · ไม่งั้น = ผู้ใหญ่ที่ดูแล
  // กันชั้นที่สอง (S3 · g-b7 2026-11-09): ไม่ใช่ทายาท = ว่าง แม้ด่าน heir-unguarded หลุด
  ผู้ใหญ่ทายาท: (st) => (heirOfLine(st) ? ({ father: 'พ่อ', mother: 'แม่' })[heirCase(st)] ?? homeElder(st) : ''),
  // ทางรับราชการของแม่ (เจ้าของเคาะ 2026-11-09): ทายาทตำรวจ = พนักงานสอบสวนหญิง · ทายาททหาร = พยาบาลทหาร
  // เจ้าของเคาะ 2026-11-10 ทาง ก (cadet-b5-late-mother.md ข้อ 4): แม่เป็นผู้เล่นชาติก่อน (ancestor) = "ทหาร"/"ตำรวจ" ไม่ระบุสาย (เกมไม่ได้เก็บสายจริง) · ทายาทจากการเกิดใช้ค่าเดิม
  ทางแม่: (st) => (st.parents?.some((p) => p.ancestor && p.sex === 'หญิง') ? { police: 'ตำรวจ', army: 'ทหาร' } : { police: 'พนักงานสอบสวนหญิง', army: 'พยาบาลทหาร' })[heirOfLine(st)] ?? '',
  // ที่ตั้งโรงเรียนเตรียมทหารตามปี (numbers.campus_nayok_year)
  ที่ตั้ง: (st) => campusName(st),
  // ชื่อ + นามสกุล (บท S1 2026-11-06 ใช้กับ "นตท.{ชื่อเต็ม}") · เกมยังไม่มีนามสกุล = ชื่อเฉย ๆ · คำนำหน้าไม่ใส่ใน {ชื่อ}/{ชื่อเต็ม} (เจ้าของเคาะ A1)
  ชื่อเต็ม: (st) => (st.surname ? `${st.name} ${st.surname}` : st.name),
  ชื่อลูก: (st) => focusOf(st, 'child')?.name ?? 'ลูก',
  ชื่อคู่: (st) => focusOf(st, 'spouse')?.name ?? 'คู่ชีวิต',
  ชื่อหลาน: (st) => focusOf(st, 'grandchild')?.name ?? 'หลาน',
  ชื่อผู้จากไป: (st) => (lastLoss(st) ? lossCall(lastLoss(st)) : 'คนในบ้าน'),
  ชื่อคู่เก่า: (st) => lastSpouseLoss(st)?.name ?? 'คู่ชีวิตคนก่อน',
  ปีคู่เก่า: (st) => (spouseYears(st) ? `${spouseYears(st)} ปี` : 'หลายปี'),
  ชื่อสัตว์: (st) => (focusOf(st, 'pet') ? petCall(focusOf(st, 'pet')) : 'เจ้าตัวเล็ก'),
  ชนิดสัตว์: (st) => focusOf(st, 'pet')?.kind ?? 'สัตว์',
  ชื่อฝูง: (st) => (focusOf(st, 'herd') ? petCall(focusOf(st, 'herd')) : 'สัตว์ในคอก'),
  ครับ: (st) => (st.sex === 'หญิง' ? 'ค่ะ' : 'ครับ'),
  ผม: (st) => (st.sex === 'หญิง' ? 'ฉัน' : 'ผม'),
  ลูกดูแลแบบเรา: (st) => filialMirrorText(st),
  พ่อแม่ที่ป่วย: (st) => illParentWord(st),
  // จดหมายคำฝาก (afterfall-3): ฝั่งผู้ฝากอ่านคนรอบตัวตอนตาย · ฝั่งทายาทอ่าน st.letter ที่ระหว่างชาติสร้างไว้
  ผู้รับซอง: (st) => (letterTo(st) ? letterToText(letterTo(st)) : 'คนข้างหลัง'),
  ผู้ฝาก: (st) => st.letter?.from ?? 'ผู้ใหญ่รุ่นก่อน',
  // ไม่บอกเหตุ (self_harm · other ก่อนชรา) ก็ยังต้องได้คำ — "ที่จากไปแล้ว" ไม่เผยเหตุ และช่องไม่ว่าง
  เหตุผู้ฝาก: (st) => st.letter?.cause?.join('') ?? 'แล้ว',
  ผู้ยื่นซอง: (st) => st.letter?.by ?? 'คนในบ้าน',
};

// สาเหตุการตาย (B110 · เจ้าของเคาะ): ป้ายสั้นภาษาคน [คำเชื่อม, คำนาม] — หน้าจอและจดหมายคำฝากใช้ตารางเดียวกัน
// self_harm ไม่อยู่ในตารางโดยตั้งใจ: ห้ามขึ้นจอจนกว่าแกนจะมีข้อความระวัง + สายด่วน 1323 · other ที่ยังไม่ชราไม่บอกอะไร
const CAUSE_TEXT = {
  infection: ['ด้วย', 'โรคติดเชื้อ'], pneumonia: ['ด้วย', 'ปอดอักเสบ'], heart: ['ด้วย', 'โรคหัวใจ'], stroke: ['ด้วย', 'โรคหลอดเลือดสมอง'],
  cancer: ['ด้วย', 'โรคมะเร็ง'], diabetes_kidney: ['ด้วย', 'โรคเบาหวานและไต'], liver: ['ด้วย', 'โรคตับ'], chronic_resp: ['ด้วย', 'โรคปอดเรื้อรัง'],
  road: ['จาก', 'อุบัติเหตุบนท้องถนน'], accident: ['จาก', 'อุบัติเหตุ'], assault: ['เพราะ', 'ถูกทำร้าย'], newborn: ['ด้วย', 'ภาวะแทรกซ้อนแรกเกิด'],
};
export const causeWords = (cause, age) => (cause === 'other' ? (age >= STAGES.at(-1).from ? ['ด้วย', 'วัยชรา'] : null) : CAUSE_TEXT[cause] ?? null);
// ตัวแทนมีเงื่อนไข {key:ทาง1|ทาง2|…} (B1 เส้นเตรียมทหาร · ยกจาก Demo) — แต่ละทางซ้อนตัวแทนธรรมดาได้หนึ่งชั้น เช่น {ลับ:{ผู้ใหญ่}ยังไม่รู้|…}
// ค่าที่คืน = ลำดับทาง · ทางที่ไม่ได้เขียน = ว่าง · lint (util.condBranches) วัดความยาวที่ทางยาวสุด
export const FILL_COND = {
  // ทายาท 3 ทาง: พ่อรับราชการยังอยู่ | แม่รับราชการเอง | พ่อที่เสียแล้ว (เจ้าของเคาะ 2026-11-09)
  // ไม่ใช่ทายาท = ไม่มีทางไหนตรง → ว่าง (กันชั้นที่สอง)
  // ทาง 4 = lateMother แม่ (ผู้เล่นชาติก่อน) ที่รับราชการแล้วเสียไปแล้ว (เจ้าของเคาะบท S1 2026-11-10 · cadet-b5-late-mother.md) · ข้อความที่มีแค่ 3 ทาง = ว่าง
  ทายาท: (st) => (heirOfLine(st) ? ({ father: 0, mother: 1, lateFather: 2, lateMother: 3 })[heirCase(st)] ?? -1 : -1),
  // มือถือ: ตั้งแต่ปี numbers.mobile_year | ก่อนหน้า
  มือถือ: (st) => (st.birthYear + st.age >= (cadetNum(st).mobile_year ?? 2542) ? 0 : 1),
  // ลับ: แอบสอบ (cadet_family_secret) | ที่บ้านรู้
  ลับ: (st) => (st.flags.cadet_family_secret ? 0 : 1),
  // ค่าย: เด็กค่ายติว (cadet_prep_camp) | คนอื่น (มักเว้นว่าง)
  ค่าย: (st) => (st.flags.cadet_prep_camp ? 0 : 1),
};
const COND_RE = /\{([^{}:|]+):((?:[^{}]|\{[^{}]*\})*)\}/g;
export function fill(text, st) {
  const picked = text.replace(COND_RE, (m, k, body) => (FILL_COND[k] ? body.split('|')[FILL_COND[k](st)] ?? '' : m));
  // คำลงท้ายถิ่น: "นะ{ถิ่น}" แทน นะ · "ๆ{ถิ่น}" เว้นวรรคก่อนคำลงท้าย · ภาคที่ไม่มีคำลงท้ายคงรูปเดิม
  const p = FILL.ถิ่น(st);
  const dialect = picked.replaceAll('นะ{ถิ่น}', p || 'นะ').replaceAll('ๆ{ถิ่น}', p ? `ๆ ${p}` : 'ๆ');
  return dialect.replace(/\{([^{}]*)\}/g, (m, k) => (FILL[k] ? String(FILL[k](st)) : m));
}

// ---- ตัวช่วยของเส้นเตรียมทหาร (B1) · cadet.mjs ใช้ชุดเดียวกัน ----
const DIALECT = { ตะวันออกเฉียงเหนือ: 'เด้อ', เหนือ: 'เน้อ', ใต้: 'หนิ' };
const cadetNum = (st) => st.content?.cadet?.numbers ?? {};
export const parentAlive = (st, sex) => !!st.parents?.find((p) => p.sex === sex)?.alive;
export const homeElder = (st) => (parentAlive(st, 'หญิง') ? 'แม่' : parentAlive(st, 'ชาย') ? 'พ่อ' : 'ป้า');
export const heirOfLine = (st) => (st.parentFlags?.army_family ? 'army' : st.parentFlags?.police_family ? 'police' : null);
// คนที่เคยรับราชการ (เจ้าของเคาะ 2026-11-09): พ่อยังอยู่ = father · มีแต่แม่ = mother (แม่รับราชการทางอื่น)
// ยกเว้นทายาทตำรวจที่เกิดก่อน numbers.police_woman_year (ยังไม่รับผู้หญิงเป็นพนักงานสอบสวน) = lateFather · ไม่มีพ่อแม่ = lateFather (พ่อที่เสียแล้ว ป้าเล่า)
// ตัดสินจากปีเกิด (คงที่ทั้งชีวิต) ไม่ต้องเก็บใน state
// เจ้าของเคาะ 2026-11-10 (ยกเว้น R2 เฉพาะกรณีนี้): ทายาทที่สืบจากผู้เล่นชาติก่อน = parents[].ancestor คือคนที่เคยรับราชการ (เกมรู้เพศจริง)
// ancestor ยังอยู่ = father/mother ตามเพศ · ancestor ชายที่เสียแล้ว = lateFather · ancestor หญิงที่เสียแล้ว = lateMother (ยังไม่มีบท → ไม่ขึ้นบทฝั่งทายาท · {ทายาท:} ว่าง)
// ทายาทจากการเกิด 5.00% (ไม่มี ancestor) ใช้กติกาเดิมด้านล่าง
export function heirCase(st) {
  const anc = heirOfLine(st) && st.parents?.find((p) => p.ancestor);
  if (anc) return anc.alive ? (anc.sex === 'หญิง' ? 'mother' : 'father') : anc.sex === 'หญิง' ? 'lateMother' : 'lateFather';
  if (parentAlive(st, 'ชาย')) return 'father';
  if (parentAlive(st, 'หญิง') && !(heirOfLine(st) === 'police' && st.birthYear < (cadetNum(st).police_woman_year ?? 2538))) return 'mother';
  return 'lateFather';
}
export const campusName = (st) => (st.birthYear + st.age < (cadetNum(st).campus_nayok_year ?? 2543) ? 'กรุงเทพฯ' : 'นครนายก');

// ตัวเลือกที่แทนกัน show_if / hide_if (B1): เงื่อนไขแบบ when · ไม่ตรง = ซ่อน (ไม่โชว์ล็อก) · ยังอยู่ในรายการตามเลขลำดับเดิม (เซฟ/ผลย้อนจับเลขลำดับ) แต่ล็อก + hidden
export const choiceHidden = (st, c) => (c.show_if !== undefined && !whenOk(st, c.show_if)) || (c.hide_if !== undefined && whenOk(st, c.hide_if));
const HIDE_LOCK = 'ไม่ใช่ทางของชีวิตนี้';

export function levelValue(level) {
  const v = LEVELS[Math.abs(level)];
  if (v === undefined) throw new Error(`ระดับผลต้องเป็น ±1..±3 ได้ ${level}`);
  return Math.sign(level) * v;
}

// เพดานค่าใช้จ่าย income_x: เรื่องเดียวกัน (ค่าหาเสียง · งานบวช · ค่ารักษา) คนรายได้สูงจ่ายแพงกว่าได้แต่ไม่เกิน
// SPEND_CAP เท่าของคนรายได้ขั้นต่ำ — ไม่งั้นรายได้ร้อยเท่าค่าแรงขั้นต่ำทำให้ค่าหาเสียงผู้ใหญ่บ้านเป็นสิบล้าน · ฝั่งรายรับยังโตตามรายได้
// เงินเก็บต่อปีติดลบ/ศูนย์ (รายจ่ายเกินรายได้) ใช้ฐานของคนรายได้ขั้นต่ำแทน — ไม่งั้นค่าใช้จ่ายกลายเป็นได้เงิน
// เงินเก็บบวกแม้ต่ำกว่านั้นใช้ค่าจริง: ยกขึ้นทุกคนที่ต่ำกว่าฐานทำให้คนจนจ่ายแพงขึ้นทั้งกระดาน
export const SPEND_CAP = 10;
function spendBase(st) {
  const year = st.birthYear + st.age;
  const era = st.content.era;
  const floor = minWage(era, st.seed, year) * era.finance.daysPerMonth * 12 * era.birth.saveRate;
  const saving = yearlySaving(st, year);
  return saving > 0 ? Math.min(saving, SPEND_CAP * floor) : floor;
}

// เงินในผลตัวเลือก: ตัวเลขเปล่า = บาทของปีนั้น · {unit: income_x} = จำนวนเท่าของเงินเก็บต่อปีตอนนี้
// · {unit: fixed_baht, ref_year} = บาทของปีอ้างอิง ปรับตามเงินเฟ้อจริงมาเป็นบาทของปีนี้
// spend = ผู้เรียกถามยอดที่ต้องมี/ต้องจ่าย (requires.money · ราคาใบหวย) ทั้งที่ amount เป็นบวก
export function moneyValue(st, m, spend = false) {
  if (typeof m === 'number') return m;
  if (m.unit === 'income_x') return m.amount * (spend || m.amount < 0 ? spendBase(st) : yearlySaving(st));
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
// ก่อนเริ่มทำงาน ค่าใช้จ่าย (ผลการ์ด · ค่าเลี้ยงสัตว์ · งวดหนี้) คิดจากรายได้บ้าน เกินกระเป๋าเด็กได้ — ส่วนเกินบ้านจ่าย เด็กไม่ติดหนี้
function homePays(st) {
  if (st.workFrom === null && st.money < 0) st.money = 0;
}

// hurt = ตัวคูณส่วนที่ติดลบของค่าและเงิน (ญาติช่วยประคองตอนเจอผลร้าย) · ส่วนที่เป็นบวกไม่แตะ
// nat = ตัวคูณนิสัย (natureBoost) ส่วนที่เป็นบวกของค่าตรงนิสัยเท่านั้น · คืน true เมื่อตัวคูณมีผล (ป้าย "เพราะคุณเป็นคน…")
function applyEffects(st, fx = {}, s = 1, ss = s, hurt = 1, nat = null) {
  let hit = false;
  const cut = (v) => (v < 0 ? v * hurt : v);
  const up = (k, v) => (nat?.stat === k && v > 0 ? ((hit = true), v * nat.mul) : v);
  for (const k of STAT_KEYS) if (fx[k]) st[k] = clamp(st[k] + cut(up(k, levelValue(fx[k]) * ss)));
  if (fx.money?.grey) greyAdd(st, moneyValue(st, fx.money) * s);
  else if (fx.money) {
    st.money += cut(up('money', moneyValue(st, fx.money) * s));
    homePays(st);
  }
  if (fx.grey_seize) greySeize(st, fx.grey_seize);
  if (fx.grey_launder) greyLaunder(st, fx.grey_launder);
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
  if (fx.income_mult) {
    const m = nat?.job && fx.income_mult > 1 ? ((hit = true), 1 + (fx.income_mult - 1) * nat.mul) : fx.income_mult;
    st.incomeMult = Math.max(INCOME_MULT[0], Math.min(INCOME_MULT[1], st.incomeMult * m ** s));
  }
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
    // ตัวคูณรายได้ผูกกับงานเดิม เปลี่ยนงานแล้วเริ่มนับใหม่ · งานตรงพรสวรรค์ติดชาติเริ่มสูงกว่านิดหนึ่ง
    st.incomeMult = talentStart(st);
    st.jobSince = st.age;
    enterByJob(st, o.id);
  }
  if (fx.ladder) {
    if (st.workFrom === null) st.workFrom = st.age;
    st.jobSince = st.age;
    enterLadder(st, fx.ladder);
    // วัดพรสวรรค์หลังเข้าสาย — อาชีพเปลี่ยนตามขั้นแรกของสาย
    st.incomeMult = talentStart(st);
    // ทางแรกของสาย (B170): การ์ด first_of ออกปีที่เข้าสาย ครั้งเดียวต่อชีวิต (เข้าสายซ้ำไม่ออกอีก) · แทนการ์ดกองสุ่มหนึ่งใบแบบผลย้อน ชีวิตจึงไม่ยาวขึ้น
    const first = st.content.events.find((e) => e.first_of === fx.ladder && !st.done[e.id]);
    if (first) {
      st.done[first.id] = true;
      st.due.push({ kind: 'eraEvent', ev: first, age: st.age });
      takeYearQuota(st);
    }
  }
  if (fx.promote !== undefined) promote(st, fx.promote);
  if (fx.office !== undefined) setOffice(st, fx.office);
  for (const [k, v] of Object.entries(fx.chronic ?? {})) {
    const lv = Math.max(-CHRONIC_MAX, Math.min(CHRONIC_MAX, (st.chronic[k] ?? 0) + v));
    if (lv) st.chronic[k] = lv;
    else delete st.chronic[k];
    st.chronicAge[k] = st.age;
  }
  return hit;
}

// ไอเทมติดตัว (B78): state สร้างตอนได้ชิ้นแรก — ชีวิตที่ไม่เคยได้ของและเซฟก่อนมีระบบจึงไม่มีช่องนี้ ผู้อ่านใช้ itemsOf ได้ช่องว่าง
export const itemsOf = (st) => st.items ?? { wear: Object.fromEntries(Object.keys(st.content.items.slots).map((k) => [k, null])), bag: [], cap: st.content.items.cap };
// จอโชว์ช่องไอเทมเมื่อโลกซ้อนทับถึงขั้น 3 หรือมีของแล้ว — ก่อนนั้นช่องว่างเปล่าบอกใบ้ระบบที่ผู้เล่นยังไปไม่ถึง
export const itemsVisible = (st) => overlapStageOf(st) >= 3 || (st.items ? Object.values(st.items.wear).some(Boolean) || st.items.bag.length > 0 : false);

// ไม่ดึงเลขสุ่ม: ได้ชิ้นแรกในลิสต์ที่ยังไม่มี ครบแล้วไม่ได้เพิ่ม · ลงช่องชนิดตรงถ้าว่าง ไม่งั้นเข้าเป้ · เป้เต็มขายทันที (ไม่มีปุ่มทิ้ง/ให้)
// คืนข้อความที่ผู้เล่นเห็น หรือ null เมื่อไม่ได้อะไร
function gainLoot(st, ids) {
  const reg = st.content.items;
  const it = itemsOf(st);
  const id = ids.find((x) => !Object.values(it.wear).includes(x) && !it.bag.includes(x));
  if (!id) return null;
  st.items = it;
  const item = reg.list[id];
  let where;
  if (!it.wear[item.slot]) {
    it.wear[item.slot] = id;
    where = ` ใส่ช่อง${reg.slots[item.slot]}`;
  } else if (it.bag.length < it.cap) {
    it.bag.push(id);
    where = ' เก็บเข้าเป้';
  } else {
    st.money += moneyValue(st, item.sell);
    where = ' แต่เป้เต็ม เลยขายต่อได้เงินแทน';
  }
  return `${item.text} · ได้${item.name}${where}`;
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

// พ่อแม่แก่และตายตามตารางชีพเดียวกับตัวเอง (แนวชีวิตของปีปฏิทินนั้น) ด้วย stream ของครอบครัว · สาเหตุ+นัดป่วยจาก kinCauseRng (B110)
// พ่อ/แม่ที่เป็นผู้เล่นรุ่นก่อน (diesAt) ตายตามชะตาที่เล่นไปแล้ว ไม่สุ่มซ้ำ · สาเหตุติดมากับ heir
function ageParents(st, year) {
  for (const p of st.parents) {
    if (!p.alive) continue;
    p.age += 1;
    const roll = st.famRng.next();
    if (p.diesAt !== undefined) {
      if (p.age >= p.diesAt) {
        p.diedAge = p.age;
        parentDied(st, p, year);
      }
      continue;
    }
    const cause = kinDeathRoll(st.content.era, st.seed, st.kinCauseRng, p, year, p.age, roll);
    if (cause) {
      p.diedAge = p.age;
      p.cause = cause;
      parentDied(st, p, year);
    }
  }
}

// มรดกจากรุ่นก่อน (ทางเป็นลูก) ถึงมือปีที่พ่อ/แม่ผู้เล่นรุ่นก่อนตาย · เก็บเป็นเท่าของรายได้ครัวเรือนทั้งปีของประเทศ แปลงเป็นบาทของปีนี้
function receiveLegacy(st, year, stage) {
  const { units, debt, from } = st.legacy;
  st.legacy = null;
  // มรดกมาพร้อมการจากไป — มรดกตอนแรกเกิด (ตายปีที่ลูกเกิด) ต้องปิดชีวิตพ่อ/แม่ตรงนี้ ageParents ยังไม่เคยเดิน
  for (const p of st.parents) {
    if (!p.ancestor || !p.alive) continue;
    parentDied(st, p, year);
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
  st.due.push({ kind: 'result', type: 'A', age: st.age, stage, text, tag: 'inherit' });
}

// จดหมายคำฝาก (afterfall-3): ตามหลังการ์ดมรดก ⇒ ไม่มีทางออกขณะผู้ฝากยังอยู่ · ไม่กินโควตาปี ไม่ดึงเลขสุ่ม
// ใบที่ออกเลือกจาก parent_flags (ชนิดคำฝาก) · ธงไม่ถึงชั้นนี้ = ไม่มีใบ
function receiveLetter(st) {
  st.letter = { ...st.letter, read: true };
  const ev = st.content.events.find((e) => e.id.startsWith(LETTER.read) && whenOk(st, e.when));
  if (!ev) return;
  st.done[ev.id] = true;
  st.fired[ev.id] = { n: 1, age: st.age };
  st.due.push({ kind: 'eraEvent', ev, age: st.age });
}

// ย้ายสัดส่วน share ของเงินทั้งหมดเข้าสินทรัพย์เดียว · ด่าน build กั้นปีไว้แล้ว ถึงตรงนี้ปีผิด = เนื้อหาหลุดด่าน
function invest(st, { asset, share }) {
  if (!assetOpen(st.content.era, asset, st.birthYear + st.age)) throw new Error(`${assetName(asset)} ยังไม่มีในปี ${st.birthYear + st.age}`);
  const next = {};
  for (const [id, w] of Object.entries(st.alloc)) next[id] = w * (1 - share);
  next[asset] = (next[asset] ?? 0) + share;
  st.alloc = next;
}

// จบช่วงเรียน: ได้วุฒิ แล้วออกด่านเรียนต่อ หรือการ์ดหางานถ้าเป็นช่วงสุดท้าย
function finishTrack(st, year) {
  const track = st.school && TRACKS[st.school];
  if (!track || st.age !== track.until) return;
  if (eduRank(track.edu) > eduRank(st.edu)) st.edu = track.edu;
  // เส้นเตรียมทหาร (OQ-1 เจ้าของเคาะ): ยังถือธงฝัน/กำลังอยู่ในสนามสอบ = ด่านจบ ม.6/ปวช. รอจนรู้ผล (trackExit ออกทีหลังใน afterChoice)
  // เฉพาะ ม.ปลาย/ปวช. — ด่านจบ ม.ต้น (เลือกเรียนต่อ) ต้องออกตามเวลา ไม่งั้นเลือก ม.ปลายช้าเกินอายุจบแล้วค้างในโรงเรียน
  if (cadetLive(st) && (st.school === 'upper' || st.school === 'voc')) {
    st.trackWait = true;
    return;
  }
  trackExit(st, track, year);
}

// ทางออกของช่วงเรียน: ด่านสอบ/ด่านเรียนต่อ หรือบันไดยศ/หางาน
// out = ที่วางการ์ด: ต้นปีใช้ st.due · ออกกลางปีหลังรู้ผลสอบใช้ after ของการ์ดที่เพิ่งเลือก (st.due รอขึ้นปีใหม่)
function trackExit(st, track, year, out = st.due) {
  if (track.exam) for (const ev of preludes(st, track.exam, year)) out.push({ kind: 'eraEvent', ev, age: st.age });
  if (track.gate) out.push({ kind: 'eraEvent', ev: schoolGate(st), age: st.age });
  else {
    st.school = null;
    // จบโรงเรียนนายร้อยเข้าบันไดยศ: เลิกเป็น นตท. (G2 เจ้าของเคาะ 2026-11-06) · เฟส 3 ค่อยใส่ยศจริง
    // ติดยศแล้วเอาคำนำหน้านักเรียนออก ทั้ง "นรม." และ "นตท." (เจ้าของเคาะ 2026-11-11)
    if (track.ladder && CADET_TITLES.includes(st.title)) delete st.title;
    if (track.ladder) applyEffects(st, { ladder: track.ladder });
    else dueJob(st);
  }
}

// เริ่มกลางวัย (B76 ผู้สืบสายเลือด): คนที่โตมาแล้วจริง ไม่เล่นวัยเด็กซ้ำ · ค่าสถานะเดินตามธรรมชาติของปีที่ข้าม ไม่มีเหตุการณ์ ไม่ดึงเลขสุ่มของโลก
// พ่อแม่: คนที่มีอายุตายจริง (คนในครอบครัวรุ่นก่อน) ตายตามนั้น · คนที่สร้างใหม่ยังอยู่ · รุ่นก่อน (ancestor) ตายปีที่เริ่มผ่านมรดก
function skipToAge(st, age) {
  const era = st.content.era;
  while (st.age < age) {
    st.age += 1;
    const year = st.birthYear + st.age;
    st.price *= 1 + inflationRate(era, st.seed, year) / 100;
    const r = healthDecay(st.age);
    st.health = clamp(st.health * (1 - r));
    st.healthNatural *= 1 - r;
    st.happiness = clamp(st.happiness + (st.baseHappiness - st.happiness) * HAPPY_PULL);
    st.knowledge = clamp(st.knowledge + (knowledgeGain(st.age) * moodMul(st) * (100 - st.knowledge)) / 100);
    st.relations = clamp(st.relations * (1 - RELATION_FADE));
    for (const p of st.parents) {
      if (!p.alive) continue;
      p.age += 1;
      if (p.diesAt !== undefined && !p.ancestor && p.age >= p.diesAt) {
        p.diedAge = p.age;
        parentDied(st, p, year);
      }
    }
  }
  st.lowWarned = st.health <= WARN.human;
  st.standing = [{ age: st.age, cls: CLASSES.indexOf(st.cls) }];
}

// ช่วงเรียนตามอายุจริง: ถึงมัธยมปลายเสมอ (16–18) · 18 = เพิ่งจบ ออกด่านสอบ/ทางต่อปีนี้
// 19–22 = เรียนมหาวิทยาลัยถ้าความรู้ถึงเกณฑ์ (ปีจบ = ออกการ์ดหางานปีนี้) · ไม่ถึง = เลิกเรียนแล้ว หางานทันที
function startSchool(st, year) {
  st.edu = TRACKS.lower.edu;
  if (st.age <= TRACKS.upper.until) {
    st.school = 'upper';
    finishTrack(st, year);
    return;
  }
  st.edu = TRACKS.upper.edu;
  if (st.knowledge >= HEIR_UNI_KNOW) {
    st.school = 'uni';
    finishTrack(st, year);
    return;
  }
  st.school = null;
  dueJob(st);
}

// การ์ดหางาน: ระหว่างถือธงฝันเตรียมทหาร เลื่อนไว้ (needJob) ออกหลังธงหลุด (เจ้าของเคาะ 2026-11-06)
// ยังอยู่ในเส้นเตรียมทหาร: ถือธงฝัน · มีลำดับสนามสอบค้าง · หรือผ่านประตูสนามแล้วแต่ยังไม่จบปีสอบ (cadet_exam_door)
// ประตูต้องนับ: ตัวเลือกเช้าวันสอบล้างธงฝันก่อนแกนเปิดลำดับสนามสอบ — ไม่นับ = การ์ดหางานที่เลื่อนไว้หลุดออกกลางสนามสอบ (S3 ข้อ B)
// ปล่อยด่านจบ ม.6/ปวช. ที่เลื่อนไว้ (OQ-1) เมื่อพ้นเส้นสอบ · สอบติด = เปลี่ยน track ไปแล้ว ไม่มีด่านนี้ · out = คิวที่จะวางการ์ด
function releaseTrack(st, out) {
  if (!st.trackWait || cadetLive(st)) return;
  st.trackWait = false;
  const track = !st.flags.cadet_passed && st.school && TRACKS[st.school];
  if (track) trackExit(st, track, st.birthYear + st.age, out);
}
// เลิกสอบแล้ว (cadet_let_go) ประตูไม่นับ: คนสละที่นั่งถือประตูข้ามปีไว้รอการ์ดสอบซ้ำ ถ้าเลิกกลางทาง ประตูไม่มีปีสอบมาล้าง
const cadetLive = (st) => !!(st.flags.cadet_dream || st.cadet || (st.flags.cadet_exam_door && !st.flags.cadet_passed && !st.flags.cadet_let_go));
function dueJob(st) {
  if (cadetLive(st)) st.needJob = true;
  else st.due.push({ kind: 'eraEvent', ev: jobCard(st), age: st.age });
}
// เกณฑ์เดียวกับด่านสอบโรงเรียนดัง (career.mjs) — มหาวิทยาลัยรัฐเองไม่มีเกณฑ์ล็อก มีแต่โอกาสสอบติด
const HEIR_UNI_KNOW = 55;

// เดินหนึ่งปี: ทุกอย่างไหลเป็นรายปีในลูปนี้ที่เดียว การกระโดดหลายปีจึงได้ผลเท่ากับเดินทีละปีเสมอ
function stepYear(st) {
  const prevStage = stageOf(st.age);
  lifeFocusYear(st);
  natureLock(st);
  // ปีสุดท้ายที่ทำงานต้องวัดก่อนขึ้นอายุ — ขึ้นแล้ว isWorking เป็นเท็จ
  // คนที่ยังนั่งตำแหน่งเต็มเวลาหลังเกษียณวัดใหม่ทุกปีจนเลิกทำงาน — ปีที่ปกติถึงเกษียณได้ค่าเดิม
  if (isWorking(st) && st.age + 1 >= RETIRE_AGE) {
    st.retireBase = (monthlyIncome(st) * 12) / st.price;
    // บำนาญข้าราชการ (B40): ค่าจ้างสุดท้าย × ปีรับราชการ ÷ div ไม่เกิน cap เท่าของค่าจ้างสุดท้าย
    const pen = st.content.era.careers.pension;
    st.pension = ladderOf(st)?.pension ? Math.min(pen.cap, (st.age + 1 - st.ladder.from) / pen.div) * jobWage(st, st.birthYear + st.age) * 12 / st.price : 0;
  }
  // ปีทำงานต่ออาชีพ — อาชีพหลักที่ชาติถัดไปจำได้ (past.mjs) · ช่องเกิดปีแรกที่ทำงาน
  if (isWorking(st)) {
    const w = (st.workYears ??= {});
    w[st.occupation] = (w[st.occupation] ?? 0) + 1;
    // ช่วงงานตามอายุ (ui-redo 131) ให้แผงตัวฉันเรียงประวัติงาน · ปีว่างงานคั่น = ช่วงใหม่ · workYears คงไว้ให้ past/titles
    // เซฟก่อนมีช่องนี้เริ่มนับจากปีที่เล่นต่อ — ปีก่อนหน้าจอคิดจาก workYears ลบผลรวมช่วง ไม่เดาอายุย้อนหลัง
    const spans = (st.workSpans ??= []);
    const last = spans.at(-1);
    if (last?.occ === st.occupation && last.to === st.age - 1) last.to = st.age;
    else spans.push({ occ: st.occupation, from: st.age, to: st.age });
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
  // digest = ชนิดข่าวญาติ/สัตว์ (ui-redo ใบ 27) ให้จอรวมหลายใบติดกันเป็นใบเดียว · ป้ายคงที่ไม่ดึงเลขสุ่ม · ข่าวตัวเรา/เงิน/ตำแหน่งไม่ติด จึงคงใบเดี่ยว
  for (const l of ageKin(st, year, yearlySaving(st))) st.due.push({ kind: 'result', type: 'A', age: st.age, stage: stageOf(st.age), text: lossText(l), loss: l, ...(careHelp(l.cause) && { help: careHelp(l.cause) }), digest: 'kin_loss', tag: 'loss' });
  for (const n of kinIllNews(st, year)) st.due.push({ kind: 'result', type: 'A', age: st.age, stage: stageOf(st.age), ...n, digest: 'kin_ill', tag: 'sick' });
  for (const m of petArrivals(st, year)) st.due.push({ kind: 'result', type: 'A', age: st.age, stage: stageOf(st.age), text: petArriveText(m), digest: 'pet', tag: 'pet' });
  if (st.terminal && !st.terminal.told) {
    st.terminal.told = true;
    st.terminal.toldAge = st.age;
    st.due.push({ kind: 'result', type: 'A', age: st.age, stage: stageOf(st.age), text: ILL_TEXT[st.terminal.cause], illness: { cause: st.terminal.cause, left: st.terminal.age - st.age }, tag: 'sick' });
  }
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
  homePays(st);
  const stage = stageOf(st.age);
  if (st.legacy && st.age >= st.legacy.age) receiveLegacy(st, year, stage);
  if (st.letter && !st.letter.read && !st.legacy && st.age >= st.letter.age) receiveLetter(st);
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
  finishTrack(st, year);
  // สายยศ (B40): ปีในขั้นนับตามความสุข ถึงคิวแล้วการ์ดเลื่อนขั้น · ผู้ใหญ่บ้าน/กำนันพ้นตำแหน่งตอนเกษียณ · ครบวาระ/ถูกชวนลงสมัคร = การ์ดเลือกตั้ง
  // การ์ดงบ/ครบวาระของคนมีตำแหน่งการเมืองกินโควตากองสุ่มแบบเรื่องต่อ — เจอทุกวาระ ชีวิตจึงยาวขึ้นเฉพาะสายนี้ (หางด่าน 4)
  // ไม่หัก: การ์ดเลื่อนขั้น (ออกกับคนทำงานแทบทุกคน) · ใบชวนลงสมัครครั้งแรก (ออกกับทุกคนที่คอนเน็คชั่นถึง แม้ไม่ลง) — หักแล้วชีวิตสั้นลงทั้งกระดาน ไม่ใช่แค่หาง
  const officeDueCard = (ev) => {
    st.due.push({ kind: 'eraEvent', ev, age: st.age });
    if (st.office) takeYearQuota(st);
  };
  if (isWorking(st)) {
    ageRank(st, moodMul(st));
    if (promoDue(st)) st.due.push({ kind: 'eraEvent', ev: promoCard(st), age: st.age });
  }
  if (st.office && !officeFull(st) && st.age >= RETIRE_AGE) {
    st.due.push({ kind: 'result', type: 'A', age: st.age, stage, text: `อายุครบ ${RETIRE_AGE} พ้นตำแหน่ง${officeStep(st).name}ตามกฎหมาย ชาวบ้านจัดงานเลี้ยงส่ง`, tag: 'retire' });
    st.office = null;
  }
  if (budgetDue(st)) officeDueCard(budgetCard(st));
  // ทอยเลขสุ่มของการ์ดชวนก่อนเสมอ แล้วจึงดูประตู — ชีวิตที่ประตูปิดดึงเลขเท่าเดิม เส้นทางอื่นจึงไม่ขยับ
  if (officeDue(st) && (st.office || lifeGateOpen(st, OFFICE_GATE))) officeDueCard(officeCard(st));
  if (recruitDue(st)) st.due.push({ kind: 'eraEvent', ev: recruitCard(st), age: st.age });
  if (isWorking(st) && earlyDue(st)) st.due.push({ kind: 'eraEvent', ev: earlyCard(st), age: st.age });
  if (isAllocAge(st.age)) st.due.push(allocCard(st, year, stage));
  // ทุกภาคเจอได้ · เว้นอย่างน้อย ERA_GAP ปีไม่ให้ถี่จนกลบเรื่องชีวิต — ปีที่เว้น เงินยังเสียตามปีต้นแบบ
  // ปีต้นแบบวนได้ แต่เหตุจริงครั้งเดียวในประวัติศาสตร์ (B99a): กลุ่มเหตุเดิมออกครั้งเดียวต่อชีวิต ทั้งการ์ดเล่าและใบรับมือ · ปีที่ข้าม เงินยังเสียตามปีต้นแบบ
  let eras = eraEventsAt(st.content.era, st.seed, year);
  if (eras.length) {
    const seen = erasSeen(st, st.age - 1);
    eras = eras.filter((e) => !seen.has(e.id));
  }
  if (eras.length && (st.lastEraAge === null || st.age - st.lastEraAge >= ERA_GAP)) {
    st.lastEraAge = st.age;
    for (const e of eras) {
      // เล่าเหตุการณ์บ้านเมืองก่อนเสมอ · มีการ์ดเนื้อหาผูกไว้ = ตามด้วยการ์ดให้เลือกรับมือ
      st.due.push({ kind: 'era', id: e.id, age: st.age, stage, eraKind: e.kind, text: e.name, story: eraStory(st, e) });
      const ev = st.content.events.find((c) => c.era === e.id && !st.done[c.id] && whenOk(st, c.when) && (c.when?.age || c.stage === stage));
      if (ev) {
        st.done[ev.id] = true;
        st.due.push({ kind: 'eraEvent', ev, age: st.age });
      }
    }
  }
  heraldNextYear(st, year);
}

// กลุ่มเหตุบ้านเมืองที่ออกแล้วถึงอายุ upTo — ไล่ย้อนจาก seed + ปีเกิดด้วยกติกาเดียวกับ stepYear แทนการเก็บคีย์ใหม่ใน st
// lifehash hash state ทั้งก้อน: เก็บคีย์ = ทุกชีวิตที่เจอเหตุบ้านเมืองขยับ · ไล่ย้อน = ขยับเฉพาะชีวิตที่เคยเจอซ้ำ
function erasSeen(st, upTo) {
  return new Set(erasShown(st, upTo).map(({ e }) => e.id));
}

// เหตุบ้านเมืองที่ขึ้นการ์ดเล่าจริงถึงอายุ upTo พร้อมอายุที่ออก — ฉายาที่นับภัยต้องนับเฉพาะที่ผู้เล่นเห็น ไม่ใช่ทุกปีต้นแบบที่วนมา
export function erasShown(st, upTo) {
  const shown = [], seen = new Set();
  let last = null;
  for (let a = 1; a <= upTo; a++) {
    const es = eraEventsAt(st.content.era, st.seed, st.birthYear + a).filter((e) => !seen.has(e.id));
    if (!es.length || (last !== null && a - last < ERA_GAP)) continue;
    last = a;
    for (const e of es) {
      seen.add(e.id);
      shown.push({ e, age: a });
    }
  }
  return shown;
}

// ลางภัยยุค (afterfall-1): ปีหน้ามีภัยที่จะได้ใบรับมือครั้งแรก = ใบ herald_of ออกปีนี้ให้เตรียมตัว
// ปีภัยคำนวณจาก seed ได้ล่วงหน้า (protoYear) จึงไม่ดึงเลขสุ่ม · ERA_GAP ตัดปีไหนก็รู้ก่อนเหมือนกัน — ลางเกือบไม่หลอก นอกจากตายก่อน
// ผู้ใหญ่: แทนการ์ดกองสุ่มหนึ่งใบแบบ first_of ชีวิตจึงไม่ยาวขึ้น · ลางเริ่มอายุ 18 (เด็ก/วัยรุ่นเตรียมอะไรเองไม่ได้ · ลางก่อน 18 ทำแบบชีวิตสั้นลูกนกหัดบินหาย จน full ตก)
// ก่อน HERALD_QUOTA_FROM ไม่กินโควตา (ใบกองสุ่มวัยเด็กมีน้อย เบียดออกแล้วแบบชีวิตสั้นหายครึ่ง) — ตอนนี้เท่า HERALD_MIN_AGE ทุกลางจึงกินโควตา · แยกค่าไว้ถ้าลดอายุลางอีก
function heraldNextYear(st, year) {
  // ของที่เตรียมไว้ใช้ได้แค่ปีภัย — ไม่กดใช้ในใบรับมือก็หมดอายุ ธงไม่ค้างไปปลดอะไรตอนแก่
  for (const f of Object.keys(st.flags)) {
    if (f.startsWith(HERALD_FLAG) && st.age - st.flagAge[f] > 1) {
      delete st.flags[f];
      delete st.flagAge[f];
    }
  }
  if (st.age < HERALD_MIN_AGE) return;
  if (st.lastEraAge !== null && st.age + 1 - st.lastEraAge < ERA_GAP) return;
  // เพดานต่อชีวิต: ภัยทุกชนิดได้ลาง = แฟนตาซีเกินเป้า 5–8 ใบ/ชีวิตทุกบอท · นับจาก st.done ไม่เพิ่มคีย์ใน st (lifehash hash ทั้งก้อน)
  let left = HERALD_PER_LIFE - st.content.events.filter((c) => c.herald_of && st.done[c.id]).length;
  if (left <= 0) return;
  const next = eraEventsAt(st.content.era, st.seed, year + 1);
  // กลุ่มเหตุที่เจอแล้วจะไม่ออกอีก ลางของมันจึงหลอก
  const seen = next.length ? erasSeen(st, st.age) : null;
  for (const e of next) {
    if (seen.has(e.id)) continue;
    const answers = st.content.events.filter((c) => c.era === e.id);
    if (answers.some((c) => st.done[c.id])) continue;
    // ช่วงอายุปีหน้าไม่มีใบรับมือ (วิกฤตเศรษฐกิจวัยรุ่นนอกโรงเรียน) = ลางไม่มีใบให้ใช้ของที่เตรียม · เงื่อนไขอื่นของปีหน้ายังเดาไม่ได้
    const age = st.age + 1;
    if (!answers.some((c) => (c.when?.age ? age >= c.when.age[0] && age <= c.when.age[1] : c.stage === stageOf(age)))) continue;
    const h = st.content.events.find((c) => c.herald_of === e.id && !st.done[c.id] && inYears(c, year) && whenOk(st, c.when));
    if (!h) continue;
    st.done[h.id] = true;
    st.due.push({ kind: 'eraEvent', ev: h, age: st.age });
    if (st.age >= HERALD_QUOTA_FROM) takeYearQuota(st);
    if (--left <= 0) return;
  }
}
const HERALD_MIN_AGE = 18;
const HERALD_PER_LIFE = 1;
const HERALD_QUOTA_FROM = 18;
const HERALD_FLAG = 'braced:';

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
// ค่าโลกจริงตอนข้ามไปต่างโลก (B100) — ปรโลกส่งตอนเกิดใหม่ข้ามโลก ทริปกลางชีวิตส่งตอนกดรับ (B136)
export const realAt = (st) => ({ stats: Object.fromEntries(STAT_KEYS.map((k) => [k, st[k]])), money: netWorth(st), unit: nationalIncome(st.content.era, st.seed, st.birthYear + st.age) * 12, age: st.age });

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
// ธงที่ engine ตั้งเอง (debtLoad · informalFlag) — lint flag-unset นับเป็นธงที่มีคนตั้ง การ์ดไม่ต้องตั้งเองก็อ่านได้
export const DEBT_FLAGS = ['in_debt', 'informal_debt'];
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
  st.due.push({ kind: 'result', type: 'A', age: st.age, stage, text: 'ศาลสั่งล้มละลาย ทรัพย์ที่มีถูกนำไปชำระเจ้าหนี้ หนี้ที่เหลือถูกล้าง เริ่มนับหนึ่งใหม่', tag: 'bankrupt' });
}

// กู้ก้อนใหม่: เงินกู้เข้ากระเป๋าทั้งก้อน แล้วผ่อนคืนทุกปีใน stepYear · ด่าน build กั้นปีไว้แล้ว ถึงตรงนี้ปีผิด = เนื้อหาหลุดด่าน
// ยอดกู้ income_x ใช้ฐานเดียวกับค่าใช้จ่าย (spendBase) — การ์ดกู้คู่กับเงินจ่ายออกเท่ากัน ฐานต่างกันทำให้คนรายได้สูงได้หนี้หลายเท่าของที่จ่าย
function borrow(st, { kind, amount }, s = 1) {
  const year = st.birthYear + st.age;
  const era = st.content.era;
  if (!debtOpen(era, kind, year)) throw new Error(`${debtName(kind)} ยังไม่มีในปี ${year}`);
  const baht = moneyValue(st, amount, true) * s;
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
  const gap = moneyValue(st, q.money, true) - (st.dead ? deadPurse(st) : st.money);
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

// ใบคนที่บ้านตามหา (B137) ออกครั้งเดียวแทนงานศพของทางหายตัว · ไม่มีญาติให้เรียกชื่อ ⇒ ล้าง kinFocus ที่ค้างจากใบก่อน
function goneSearchCard(st) {
  st.searched = true;
  st.kinFocus = {};
  st.pending = { search: true, choices: GONE_SEARCH.choices };
  return emit(st, {
    kind: 'event', id: GONE_SEARCH.id, search: true, type: 'B', national: false, funeral: false,
    age: st.age, stage: stageOf(st.age), title: null, text: GONE_SEARCH.text,
    choices: GONE_SEARCH.choices.map((c) => c.text), fx: GONE_SEARCH.choices.map(() => ''), locked: GONE_SEARCH.choices.map(() => null),
  });
}

// การ์ดเลือกของเหตุการณ์ — ตั้ง pending ไว้ให้ choose อ่าน
// ปิด merge = ข่าวกับการ์ดรับมือแยกใบแบบเดิม (ตัวควบคุมของ harness)
export const ERA_NEWS = { merge: true };

// news = ข่าวบ้านเมืองที่รวมมาเป็นบรรทัดนำ (B58) — การ์ดยังเป็นของเหตุการณ์ ตัวเลือก/เซฟเดินเหมือนเดิม
function eventCard(st, ev, news = null, echoFrom = undefined) {
  pickFocus(st);
  // การ์ดเล่าเรื่อง (choices: [] ใบ 07) ไม่มีอะไรให้เลือก — ไม่ตั้ง pending ไม่งั้นใบถัดไปเปิดไม่ได้
  st.pending = ev.choices.length ? ev : null;
  // ตัดสินแบบงานศพตอนการ์ดออก (หลังคำสั่งเสียครบ) ครั้งเดียว — lockReason อ่านค่านี้ทั้งตอนวาดและตอนกด
  if (ev.id === FUNERAL.rite) st.funeralPick ??= pickRite(st, ev);
  if (ev.arc) arcFired(st, ev);
  return emit(st, {
    kind: 'event',
    id: ev.id,
    // แนวการ์ดตามประเภทเหตุการณ์ (ใบ 06): A ชีวิตจริง · B ความเชื่อ/แฟนตาซี
    type: ev.type ?? 'A',
    // การ์ดเนื้อหาที่ผูกเหตุการณ์บ้านเมือง — หน้าจอติดป้ายบ้านเมืองแทนช่วงวัย
    national: !!ev.era,
    ...(news && { news }),
    // ผลย้อน: อายุตอนเลือกตัวเลือกที่นัดการ์ดนี้ไว้
    ...(echoFrom !== undefined && { echoFrom }),
    // สายเรื่องรายคน: ตอนที่เท่าไร ห่างตอนก่อนกี่ปี — ป้ายบนการ์ด · harness นับระยะจากช่องนี้
    ...(ev.arc && { arc: { key: ev.arc, n: st.arcs[ev.arc].n, ...(st.arcs[ev.arc].gap && { gap: st.arcs[ev.arc].gap }) } }),
    ...parentFrom(st, ev),
    funeral: ev.id === FUNERAL.wishes || ev.id === FUNERAL.rite,
    age: st.age,
    stage: stageOf(st.age),
    title: ev.title ? fill(ev.title, st) : null,
    text: fill(ev.text, st) + pastSelfLine(st, ev),
    choices: ev.choices.map((c) => fill(c.text, st)),
    ...choiceHints(ev, st),
    fx: ev.choices.map((c) => choiceFx(st, ev, c)),
    // เหตุผลที่ตัวเลือกกดไม่ได้ (null = กดได้) — หน้าจอแสดงเทาพร้อมเหตุผล
    locked: ev.choices.map((c) => lockReason(st, c)),
    // ตัวเลือกที่พาเข้าสาย (ป้าย gate) ซ่อนจนประตูเปิด — ล็อกไว้ด้วย (กดไม่ได้ · บอทข้าม) แต่ไม่ตัดออก
    // เพราะ harness/เซฟ/ผลย้อนจับตัวเลือกด้วยเลขลำดับในเนื้อหา · ใบที่ไม่มีป้ายไม่มีช่องนี้
    ...(ev.choices.some((c) => c.gate || c.show_if || c.hide_if) && { hidden: ev.choices.map((c) => gateShut(st, c) || choiceHidden(st, c)) }),
    ...moneyShort(ev, st),
  });
}

// ทายาทชั้นลูก (B167): การ์ดดูแลพ่อแม่ที่พ่อ/แม่เป็นผู้เล่นรุ่นก่อนบอกว่าเป็นเราเอง — การ์ดที่ระบุเพศพ่อแม่คนละเพศกับรุ่นก่อนไม่บอก (พูดถึงอีกคน)
function pastSelfLine(st, ev) {
  const p = st.parents.find((x) => x.ancestor && x.alive);
  if (!p || !ev.choices.some((c) => c.filial)) return '';
  if ((ev.when?.family ?? []).some((f) => f.role === 'parent' && f.sex && f.sex !== p.sex)) return '';
  return ` · ${p.sex === 'หญิง' ? 'แม่' : 'พ่อ'}คนนี้คือคุณเองในชาติก่อน`;
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

// เหตุผลตั้งต้นของตัวเลือกที่ล็อกด้วยครอบครัว — เงื่อนไขพ่อ/แม่ล้วนบอกตัวคนที่ไม่อยู่ ที่เหลือเนื้อหาใส่ reason เอง
function familyWhy(fs) {
  if (!fs.every((f) => f.role === 'parent')) return 'ครอบครัวยังไม่เข้าเงื่อนไข';
  const sexes = new Set(fs.map((f) => f.sex));
  return sexes.size > 1 || sexes.has(undefined) ? 'พ่อแม่ไม่อยู่แล้ว' : sexes.has('หญิง') ? 'แม่ไม่อยู่แล้ว' : 'พ่อไม่อยู่แล้ว';
}

// เงินเทา (ใบ 36 · เจ้าของเคาะ 2026-10-31): ถุง st.grey แยกจาก money — ฐานะ/มรดก/ชื่อเสียงอ่าน money จึงไม่นับ · ใช้ได้เมื่อฟอกเข้า money
// ยึดครึ่งถุงตอนถูกจับครั้งแรก · ฟอกเสียค่าฟอก 30% ปีละครั้ง · ตายแล้วหายไปกับตัว (ไม่เข้า estate)
// ช่องเกิดเมื่อได้เงินเทาครั้งแรก — ชีวิตที่ไม่เคยแตะมี state เท่าเดิมทุกไบต์ (lifehash) และเซฟเก่าโหลดได้โดยไม่ต้องแปลง
export const GREY = { seize: 0.5, fee: 0.3 };
export function greyAdd(st, baht) {
  st.grey = (st.grey ?? 0) + Math.max(0, baht);
}
export function greySeize(st, share) {
  if (st.grey) st.grey *= 1 - share;
}
export function greyLaunder(st, share) {
  const moved = (st.grey ?? 0) * share;
  st.grey = (st.grey ?? 0) - moved;
  st.money += moved * (1 - GREY.fee);
  st.greyLaunderAge = st.age;
}
export const greyLaunderLock = (st) => ((st.grey ?? 0) <= 0 ? 'ไม่มีเงินที่ต้องฟอก' : st.greyLaunderAge === st.age ? 'ฟอกไปแล้วปีนี้' : null);

// ตัวเลือกที่ต้องมีเงิน/ค่าสถานะ/ธงถึงจะเลือกได้ (B14 A6) · ข้อความเหตุผลจากเนื้อหาทับข้อความตั้งต้น
// extra = เงินที่จะกู้มาเติม — ถามว่ากู้แล้วกดได้ไหม โดยไม่แตะ state
function lockReason(st, c, extra = 0) {
  if (st.pending?.id === FUNERAL.rite && st.funeralPick && c.id !== st.funeralPick) return 'ไม่ใช่แบบที่ตกลงกัน';
  if (gateShut(st, c)) return GATE_LOCK;
  if (choiceHidden(st, c)) return HIDE_LOCK;
  if (c.effects?.grey_launder) {
    const g = greyLaunderLock(st);
    if (g) return g;
  }
  if (c.letter && !letterTo(st)) return LETTER.nobody;
  const q = c.requires;
  if (!q) return null;
  // อายุตามกฎหมายบอกเหตุผลของตัวเอง — reason ของเนื้อหาเขียนไว้ให้เงื่อนไขอื่น (เช่น "สั่งไว้แล้ว")
  if (q.age && st.age < (q.age.min ?? 0)) return `อายุยังไม่ถึง ${q.age.min} ปี`;
  if (q.age && st.age > (q.age.max ?? Infinity)) return `อายุเกิน ${q.age.max} ปี`;
  // ตัวเลือกวัยโตของนิสัย (B41) — บอกนิสัยที่ขาดเป็นคำ ผู้เล่นจึงรู้ว่าวัยเด็กแบบไหนเปิดทางนี้
  if (q.nature && st.nature !== q.nature) return `ต้องเป็นคน${st.content.focus?.natures?.[q.nature]?.name ?? ''}`;
  // why = [ข้อที่ไม่ผ่าน, ข้อความ] · requires.reasons ใส่เหตุแยกตามข้อได้ (B1 เช่น flags = "ต้องให้ที่บ้านเซ็นยินยอม" · money = เงินไม่พอ)
  const why = [];
  // ตายแล้ว (การ์ดงานศพ) หนี้ต้องหักก่อน — จ่ายได้ไม่เกินทรัพย์สุทธิ ค่างานศพจึงไม่ทำให้ตายพร้อมหนี้
  const purse = (st.dead ? deadPurse(st) : st.money) + extra;
  if (q.money && purse < moneyValue(st, q.money, true)) why.push(['money', 'เงินไม่พอ']);
  for (const [k, b] of Object.entries(q.stats ?? {})) {
    if (b.min !== undefined && st[k] < b.min) why.push(['stats', k === 'network' ? 'ยังไม่มีเส้นสายพอ' : `${STAT_LABELS[k]}ไม่ถึง`]);
    if (b.max !== undefined && st[k] > b.max) why.push(['stats', `${STAT_LABELS[k]}มากเกินไป`]);
  }
  if (q.flags && !flagsOk(st, q.flags)) why.push(['flags', 'ยังไม่เข้าเงื่อนไข']);
  if (q.edu && eduRank(st.edu) < eduRank(q.edu)) why.push(['edu', 'วุฒิไม่ถึง']);
  if (q.family && !q.family.every((f) => familyOk(st, f))) why.push(['family', familyWhy(q.family)]);
  if (!why.length) return null;
  // เหตุแยกข้อมาก่อน · R3 (เจ้าของเคาะ 2026-11-09): เหตุเรื่องเล่าก่อนเหตุเงิน (แอบสอบ + เงินไม่พอ → "ต้องให้ที่บ้านเซ็นยินยอม")
  // ไม่มีเหตุแยกข้อ = reason รวม · ไม่มีทั้งคู่ = เหตุอัตโนมัติ
  const own = why.find(([k]) => k !== 'money' && q.reasons?.[k]) ?? why.find(([k]) => q.reasons?.[k]);
  if (own) return q.reasons[own[0]];
  return q.reason ?? why.map(([, t]) => t).join(' · ');
}

// ดัชนีตัวเลือกที่กดได้ — บอทเลือกจากชุดนี้เท่านั้น · ไม่มีตัวล็อก = ทุกตัว (ลำดับสุ่มของบอทจึงเหมือนก่อนมีการล็อก)
// manual = ปุ่มที่คนกดได้แต่บอทไม่กด (B76 เล่นต่อเป็นผู้สืบสายเลือด) — หน้าจอไม่อ่านชุดนี้ ปุ่มยังกดได้ · ไม่มีฟิลด์ = ชุดเท่าเดิม
export const openChoices = (card) => card.choices.map((_, i) => i).filter((i) => !card.locked?.[i] && !card.manual?.[i]);

// เดินปีละครั้งจนมีการ์ดถึงกำหนดหรือตาย คืนการ์ดใบถัดไป
// ป้าย "เพราะคุณเป็นคน…" ติดการ์ดใบถัดไปหลังตัวเลือกที่ตัวคูณนิสัยมีผล — ไม่เพิ่มการ์ด ชีวิตจึงยาวเท่าเดิม (เจ้าของเคาะ)
export function nextCard(st) {
  const card = drawCard(st);
  if (!st.because) return card;
  const text = st.because;
  delete st.because;
  return { ...card, because: text };
}
function drawCard(st) {
  // ทริปศาล (B153) ช่องแยกจาก st.trip — st.trip ผูกก้อนต่างโลกทั้งก้อน
  if (st.court && !(st.court.afterQueue && st.queue.length)) {
    const card = courtCard(st);
    if (card) return card;
    const c = st.court;
    st.court = null;
    if (c.mode !== 'summons') return nextCard(st);
    st.dead = true;
    st.cause = c.cause;
    return queueFuneral(st) ? nextCard(st) : deathCard(st);
  }
  if (st.trip) {
    if (st.trip.step !== 'over') return { ...nextIsekaiCard(st.trip), trip: true, life: st.age };
    return tripBack(st);
  }
  if (st.pending) throw new Error('ยังมีการ์ดที่รอเลือก');
  // คิวมาก่อนการตาย — การ์ดงานศพเข้าคิวตอนตายแล้วต้องออกก่อนมรณบัตร
  if (st.dead && !st.queue.length && isGone(st) && !st.searched) return goneSearchCard(st);
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
    if (card.kind === 'warn') st.pending = { warn: true, choices: card.choices };
    if (card.kind === 'memory') st.pending = { memory: true, choices: card.choices };
    // ปุ่มสร้างตอนการ์ดออก ไม่ใช่ตอนเข้าคิว — ขั้นที่เห็นต้องเป็นขั้นปัจจุบัน
    if (card.kind === 'upgrade') {
      Object.assign(card, { title: SKILL_UP.title, text: SKILL_UP.text, ...upgradeOffer(st.skills) });
      st.pending = { upgrade: true, choices: card.choices };
    }
    return emit(st, card);
  }
  // เส้นเตรียมทหาร (cadet.mjs): ลำดับฉากรอบสมัคร/สนามสอบ ออกต่อจากการ์ดผลของตัวเลือกที่เปิดมัน · ไม่เดินเวลา
  if (st.cadet && !st.dead && cadetActive(st)) {
    if (st.cadet.cur) throw new Error('ยังมีการ์ดที่รอเลือก');
    const card = cadetCard(st);
    if (card) return emit(st, card);
    // ปิดลำดับเส้นสอบแล้ว (ตก/สละสิทธิ์/เลิก): ปล่อยด่านจบ ม.6/ปวช. ที่รอผลทันทีในปีเดียวกัน — ใบท้ายปีเป็นการ์ดเส้นสอบ ไม่ผ่าน choose() ของการ์ดปกติ (S3 ข้อ 3 รั่ว)
    const out = [];
    releaseTrack(st, out);
    if (out.length) st.queue.unshift(...out);
    // ขั้นของ cadet เติมคิวได้ ต้องเปิดคิวก่อนลงไปขึ้นปี (จาก main)
    if (st.queue.length) return nextCard(st);
  }
  for (;;) {
    if (st.advance) {
      // สุ่มตายของปีที่อายุ st.age ก่อนขึ้นปีใหม่ — ทารกจึงตายได้ตั้งแต่ขวบปีแรกตามอัตราตายทารกจริง และอายุบนการ์ดตายเป็นปีเต็ม
      // สุขภาพหมดตัว = ตายด้วยสาเหตุตามสัดส่วนของอายุนั้น ไม่มีช่วงป่วย
      const cause = st.focusDoom ?? (st.health <= 0 ? healthCause(st) : deathRoll(st));
      const d = cause && faceDeath(st, cause);
      if (d?.fate === 'survive') {
        st.queue.push(d.card);
        stepYear(st);
        st.advance = false;
        return nextCard(st);
      }
      if (d?.fate === 'court') return nextCard(st);
      if (d?.fate === 'dead') {
        // ตายสงบตอนขึ้นปี (B168) ย้อนชีวิตก่อนคำสั่งเสีย — ทางศาล/กลางปี/ต่างโลกไม่ผ่านจุดนี้
        const mem = memoryEligible(st, isGone) && memoryCard(st, stageOf);
        if (!queueFuneral(st)) return deathCard(st);
        if (mem) st.queue.unshift(mem);
        return nextCard(st);
      }
      stepYear(st);
      if (crossedLow(st, st.health, WARN.human)) st.due.push(warnCard(st.age, stageOf(st.age), WARN.text));
    }
    st.advance = true;
    // เฉียดตายปีนี้: ออกทริปก่อน · advance ปิดไว้ให้รอบถัดไปไม่ทอยตายซ้ำ แล้วเดินต่อจุดนี้เหมือนไม่มีทริป
    if (st.court) {
      st.advance = false;
      return nextCard(st);
    }
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
    arcDefer(st);
    let ev = dueAt(st).find((e) => !st.done[e.id] && inYears(e, year) && whenOk(st, e.when) && beliefOk(st, e));
    // ผลย้อนที่นัดไว้ปีนี้กินโควตาแบบเรื่องต่อ — หลักไมล์ที่ออกจาก dueAt เหมือนกันไม่หัก
    if (ev && st.scheduled.some((x) => x.event === ev.id && x.age === st.age)) takeYearQuota(st, ev.id.startsWith('cadet_') ? 0.5 : 1);
    // กองสุ่มจับได้ปีละ poolRounds รอบ หลังหลักไมล์/นัดของปีนั้นหมดแล้ว · การ์ดที่จับได้อาจนัดตอนต่อปีเดียวกัน — ค้นนัดก่อนรอบถัดไป
    poolTurn(st);
    while (!ev && st.poolLeft > 0) {
      st.poolLeft--;
      ev = drawPool(st, year);
      // ใบที่ทิ้งแทนเรื่องต่อไม่นับว่าออก — ยังจั่วได้อีกในปีหลัง
      if (ev && st.poolOwed >= 1) {
        st.poolOwed--;
        ev = null;
      }
    }
    if (ev) {
      st.done[ev.id] = true;
      st.fired[ev.id] = { n: (st.fired[ev.id]?.n ?? 0) + 1, age: st.age };
      beliefFired(st, ev);
    }
    // ผลย้อนพกอายุตอนเลือกไปให้หน้าจอบอกที่มา — อ่านก่อนกรองนัดที่ใช้แล้วทิ้ง · นัดจากเซฟเก่าไม่มี from = ไม่มีป้าย
    // นัดปีเดียวกัน (after_years [0, 0]) ไม่ส่ง — ป้ายจะบอกอายุเดียวกับการ์ดเอง
    const due = ev ? st.scheduled.find((x) => x.event === ev.id && x.age === st.age) : undefined;
    const from = due?.from;
    const echoFrom = from < st.age ? from : undefined;
    // คู่เหตุและผลให้หน้าจบ (gameslash-4) — ข้อความตัวเลือกกับชื่อการ์ดที่ผู้เล่นเห็นมาแล้ว · นัดจากเซฟเก่าไม่มี pick = ไม่เก็บ
    if (echoFrom !== undefined && due.pick) (st.echoes ??= []).push({ from, age: st.age, pick: due.pick, title: ev.title ? fill(ev.title, st) : null });
    if (st.scheduled.length) st.scheduled = st.scheduled.filter((x) => x.age >= st.age && !st.done[x.event]);
    if (ev) {
      // อายุนี้อาจมีเหตุการณ์อื่นรออยู่ (หลักไมล์ชนกับนัด) — ค้นอายุเดิมอีกรอบก่อนเดินปี
      st.advance = false;
      return eventCard(st, ev, null, echoFrom);
    }
  }
}

// รอบจั่วกองสุ่มของปีตั้งครั้งแรกที่อายุนั้นต้องใช้ — ไม่ดึงเลขสุ่ม จึงตั้งก่อนถึงคิวจั่วได้
function poolTurn(st) {
  if (st.poolAge === st.age) return;
  st.poolAge = st.age;
  st.poolLeft = poolRounds(stageOf(st.age));
  // เส้นเตรียมทหาร (เจ้าของเคาะ 2026-11-06): ถือธงอยู่ = จั่ว numbers.dream_pool_rounds รอบ · ผลการ์ดยังหรี่ด้วยรอบปกติของวัย (poolStatScale)
  // รอบที่ตกไปกองปกติ (กองเฉพาะว่าง) ใช้ได้ไม่เกินรอบของชีวิตปกติ
  if (dreamPool(st)) {
    st.poolNormalLeft = st.poolLeft;
    st.poolLeft = st.content.cadet.numbers.dream_pool_rounds ?? st.poolLeft;
  }
}
const dreamPool = (st) => { const f = st.content.cadet?.numbers?.pool_focus_flag; return !!f && !!st.flags[f]; };

// โควตาการ์ด: การ์ดเรื่องต่อ (next) ผลย้อน (schedules) และการ์ดงบ/เลือกตั้งของตำแหน่งการเมือง แทนที่การ์ดกองสุ่มหนึ่งใบ — ติดค้างไว้ แล้วทิ้งการ์ดกองสุ่มใบถัดไปที่จั่วได้
// หักเป็นใบ ไม่ใช่รอบจั่ว เพราะรอบหนึ่งออกการ์ดแค่ตามโอกาส POOL_CHANCE · ปีที่จั่วไม่ได้อีกแล้วค้างไปหักปีถัดไป
// หนี้ค้างได้ไม่เกินรอบจั่วของปีหนึ่ง (เจ้าของเคาะข้อ 432) — สายที่นัดถี่สะสมหนี้จนกองไม่ออกอีกหลายปี
// เนื้อหาเพิ่มสายเรื่องต่อได้โดยชีวิตไม่ยาวขึ้น · ชีวิตที่ไม่เจอเรื่องต่อจั่วและดึงเลขสุ่มเท่าเดิมทุกรอบ
// การ์ดนัดสายเตรียมทหารหักครึ่งเดียว (เจ้าของเคาะข้อ 453) — สายนี้ชายล้วนและนัดถี่ หักเต็มทำให้ใบกองวัยรุ่นของชายน้อยกว่าหญิง ทุกสายที่ทางเข้าเป็นใบกองวัยรุ่นจึงเอียงตามเพศ
export function takeYearQuota(st, n = 1) {
  st.poolOwed = Math.min((st.poolOwed ?? 0) + n, poolRounds(stageOf(st.age)));
}

// สายเรื่องรายคน (krung-1): การ์ดที่มี arc เดินใต้โควตาปีเดิม ไม่ใช่ตัวคุมแยก — ใบกองสุ่มเป็นใบกองอยู่แล้ว ใบนัด/เรื่องต่อหักโควตาตามเดิม ชีวิตจึงไม่ยาวขึ้น
// ตอนใหม่ของสายใดก็ตามห่างตอนล่าสุดของทุกสาย ≥ gap ปี (ปีละไม่เกินตอนเดียวมาด้วย) · คนเดิม (สายเดียวกัน) ห่าง ≥ same ปี
// คูลดาวน์รายคนข้อนี้คือ reigns-2 ของการ์ดคนมีชื่อ · ใบกองทั่วไปใช้ repeat.gap เดิม · เนื้อหาไม่มี arc = ไม่แตะเลขสุ่ม/สถานะเลย
export const ARC = { gap: 2, same: 4 };
const arcLast = (st) => Math.max(-Infinity, ...Object.values(st.arcs ?? {}).map((a) => a.age));
export const arcFrom = (st, key) => Math.max(arcLast(st) + ARC.gap, (st.arcs?.[key]?.age ?? -Infinity) + ARC.same);
// กองสุ่มไม่หยิบสายที่ปิดแล้ว · นัด/เรื่องต่อที่ผู้เขียนผูกไว้ยังออกได้หลังปิด (เล่าผลที่ตามมา)
const arcPoolOk = (st, e) => !e.arc || (!st.arcs?.[e.arc]?.end && st.age >= arcFrom(st, e.arc));
// เรื่องต่อของสายเดียวกันปีเดียวกัน = ตอนเดียวกัน ไม่ติดระยะเว้น
const arcNextOk = (st, ev, follow) => !follow.arc || (follow.arc === ev.arc && st.arcs?.[ev.arc]?.age === st.age) || st.age >= arcFrom(st, follow.arc);

// นัดของสายที่ตรงปีเว้นเลื่อนไปปีแรกที่ออกได้ ไม่ถูกกรองทิ้งเงียบ — อายุที่เลือก (from) ติดไปด้วย ป้ายผลย้อนจึงยังบอกที่มาถูก
function arcDefer(st) {
  if (!st.scheduled.length) return;
  const ix = lifeEventIndex(st.content.events);
  for (const x of st.scheduled) {
    const e = x.age === st.age && ix.pos.has(x.event) && st.content.events[ix.pos.get(x.event)];
    if (e?.arc && !st.done[e.id]) x.age = Math.max(x.age, arcFrom(st, e.arc));
  }
}

// จดตอนตอนการ์ดออก (eventCard จุดเดียว ทุกทางเข้า) · ช่องใส่เมื่อมีค่า
function arcFired(st, ev) {
  const a = st.arcs?.[ev.arc];
  if (a?.age === st.age) return;
  (st.arcs ??= {})[ev.arc] = { n: (a?.n ?? 0) + 1, age: st.age, ...(a && { gap: st.age - a.age }), ...(a?.end && { end: true }) };
}

// หน้าจบ: ทุกสายที่เปิดในชีวิตนี้ · ชื่อจากทะเบียน content.arcs
export const arcSummary = (st) => Object.entries(st.arcs ?? {}).map(([key, a]) => ({ key, name: st.content.arcs?.[key]?.name ?? key, n: a.n, end: !!a.end }));

// กองสุ่ม (B14): เหตุการณ์ไม่มี at_age แต่มี weight · ใบเดิมไม่ซ้ำในชีวิต เว้นแต่ตั้ง repeat · ไม่มีใบที่เกิดได้ = ไม่ดึงเลขสุ่ม
// ชีวิตที่เนื้อหาไม่มีกองจึงได้ชะตาเดิมทุกหลัก
function drawPool(st, year) {
  const stage = stageOf(st.age);
  let pool = (lifeEventIndex(st.content.events).pool.get(stage) ?? []).filter((e) => (!st.done[e.id] || canRepeat(st, e)) && inYears(e, year) && whenOk(st, e.when) && beliefOk(st, e) && arcPoolOk(st, e));
  // เส้นเตรียมทหาร (เจ้าของ 2026-11-06): ถือธงนี้อยู่ = จั่วเฉพาะใบที่ต้องมีธงนี้ เรื่องชีวิตวัยรุ่นทั่วไปพักไว้ก่อน
  // ถือธงอยู่: จั่วถี่ขึ้นตาม numbers.dream_pool_chance (รอบต่อปีตั้งใน poolTurn) · กองเฉพาะว่าง = กลับไปกองปกติ ด้วยโอกาสและรอบของชีวิตปกติ
  let chance = POOL_CHANCE[stage];
  if (dreamPool(st)) {
    const focus = pool.filter((e) => e.when?.flags?.has?.includes(st.content.cadet.numbers.pool_focus_flag));
    if (focus.length) {
      pool = focus;
      chance = st.content.cadet.numbers.dream_pool_chance ?? chance;
    } else if (!(st.poolNormalLeft-- > 0)) return null;
  }
  // รอบที่กองแห้งนับแยกช่วงวัย — harness/pace.mjs อ่านเป็นรายการกองที่ต้องเติม (ไม่ออกไปกับการ์ด)
  if (!pool.length) (st.poolDry ??= {})[stage] = (st.poolDry[stage] ?? 0) + 1;
  if (!pool.length || st.rng.next() >= chance) return null;
  // การ์ดทาง B (สายมู/ลาง) มีเป้าจำนวนต่อชีวิต — จับหลายรอบแล้วหรี่น้ำหนักตามรอบ ไม่ให้ล้นเป้า
  const b = poolEffectScale(stage);
  return weighted(st.rng, pool, pool.map((e) => e.weight * poolMultiplier(st, e.multipliers) * (e.type === 'B' ? b : 1) * lifeFocusMul(st, e)));
}

// โฟกัสชีวิตโลกหลัก (B163): เนื้ออยู่ content.focus · กติกากลางอยู่ focus.mjs · เนื้อหาชุดทดสอบที่ไม่มี focus = ตามน้ำเสมอ
// need = สถานะที่ when ของการ์ดเขียนไม่ได้ (หรือ · ไม่มี · ช่วงไว้ทุกข์) — ทะเบียนอ้างชื่อ lint ตรวจชื่อกับรายการนี้
const alive = (role, age) => (st) => familyOk(st, { role, alive: true, ...(age && { age }) });
const hasSpouse = alive('spouse');
const hasChild = alive('child');
// ไว้ทุกข์ = คู่จากไปปีนี้หรือปีก่อน
const mourning = (st) => (st.kinLoss ?? []).some((l) => l.role === 'spouse' && st.birthYear + st.age - l.year <= FOCUS_MOURN);
const FOCUS_MOURN = 1;
export const FOCUS_NEEDS = {
  working: (st) => isWorking(st),
  single: (st) => !hasSpouse(st) && !mourning(st),
  partnered_or_kids: (st) => hasSpouse(st) || hasChild(st),
  has_kids: hasChild,
  kids_or_grandkids: (st) => hasChild(st) || alive('grandchild')(st),
  old_parent: alive('parent', [60, 200]),
  savings_or_credit: (st) => st.money > 0 || isWorking(st),
};
const lifeFocusOk = (st) => (w, def) => whenOk(st, w) && (def?.need ?? []).every((k) => FOCUS_NEEDS[k](st));
export const lifeFocusDefs = (st) => st.content.focus?.focuses ?? {};
// ตามน้ำอยู่หัวรายการเสมอ แล้วตามลำดับในเนื้อหา
export const lifeFocusOffers = (st) => [FOCUS_FLOW, ...focusOffers(lifeFocusDefs(st), stageOf(st.age), lifeFocusOk(st), st)];
export function setLifeFocus(st, id) {
  if (!lifeFocusOffers(st).includes(id)) throw new Error(`โฟกัสนี้เลือกตอนนี้ไม่ได้: ${id}`);
  // ผู้เล่นเปลี่ยนเองแล้ว ปีทุ่มเทหลังจากนี้นับแต้มนิสัยเต็ม · กดตัวเดิมที่รับจากพ่อแม่ไม่ใช่การเปลี่ยน
  if ((st.focus ?? FOCUS_FLOW) !== id) delete st.focusBorn;
  focusSet(st, id, st.age);
  delete st.focusHeir;
}
// ปิดปีก่อนขึ้นอายุ: ผลของปีที่อายุ st.age ตามโฟกัสตอนนี้ · ตามน้ำไม่ดึงเลขสุ่มใด
function lifeFocusYear(st) {
  const c = st.content.focus;
  // โฟกัสที่รับจากพ่อแม่แต่ยังเปิดไม่ได้ (เช่นยังไม่เข้าเรียน) รอจนเปิด แล้วนับปีนั้นเต็ม · ผู้เล่นตั้งเองก่อน = ทิ้ง
  if (!st.focus && st.focusHeir && focusOpen(c.focuses[st.focusHeir], stageOf(st.age), lifeFocusOk(st), st)) {
    focusSet(st, st.focusHeir, st.age - 1);
    delete st.focusHeir;
  }
  if (!st.focus) return;
  const full = st.focusAt < st.age;
  const id = focusYearEnd(st, c.focuses, stageOf(st.age), lifeFocusOk(st), st.age, c.chain_years);
  if (!id) return;
  const def = c.focuses[id];
  if (full) naturePoint(st, def.nature, st.focusBorn ? c.heir_nature : 1);
  // ผลเงินเป็นเท่าของรายได้ จึงคิดเฉพาะปีที่มีรายได้ของตัวเอง · ค่าใช้จ่ายหรี่ด้วย spend_scale และหักได้ไม่เกินส่วนหนึ่งของเงินเก็บ (ไม่กู้มาทุ่ม)
  // เจ้าของเคาะ "ผลเงินชนด่าน finance = finance ชนะ": หักเต็มกินเงินเก็บไว้ใช้ยามเกษียณ ชีวิตที่ทุ่มยาวล้มละลายเกินกรอบ
  const { money, ...rest } = def.fx;
  applyEffects(st, rest, c.year_scale);
  if (money && isWorking(st)) {
    const v = moneyValue(st, money) * c.year_scale;
    st.money += v < 0 ? Math.max(v * c.spend_scale, -FOCUS_SPEND_CAP * Math.max(0, st.money)) : v;
  }
  if (def.career && isWorking(st)) {
    if (st.ladder) st.ladder.prog = Math.max(0, st.ladder.prog + def.career.rank);
    st.incomeMult = Math.max(INCOME_MULT[0], Math.min(INCOME_MULT[1], st.incomeMult * (1 + def.career.raise)));
  }
  (def.risk ?? []).forEach((r, i) => lifeFocusRisk(st, id, r, i));
}

// เสี่ยงสุ่มของโฟกัส: ทอยจาก stream ของ (seed · อายุ · ข้อ) ไม่แตะ rng ของโลก ชีวิตจึงต่างจากตามน้ำแค่ผลที่เกิดจริง
// เสี่ยงตาย (cause): ครั้งแรกเป็นการ์ดเตือน (ผลเจ็บตาม fx) · โดนซ้ำหลังเตือน = ตายต้นปีถัดไปด้วยสาเหตุนั้น — ไม่มีใครตายจากโฟกัสโดยไม่ได้เห็นสัญญาณก่อน
const FOCUS_RISK_SALT = 0x6f0c5a17;
const FOCUS_SPEND_CAP = 0.1;
function lifeFocusRisk(st, id, r, i) {
  if (makeRng(mixSeed(st.seed ^ FOCUS_RISK_SALT, st.age * 8 + i)).next() >= r.chance) return;
  const key = `${id}:${i}`;
  if (r.cause && st.focusWarn?.[key] !== undefined) {
    st.focusDoom = r.cause;
    return;
  }
  if (r.cause) (st.focusWarn ??= {})[key] = st.age;
  applyEffects(st, r.fx ?? {});
  for (const f of r.flags ?? []) raiseFlag(st, f);
  st.due.push({ kind: 'result', type: 'A', age: st.age, stage: stageOf(st.age), text: r.cause ? r.warn : r.text, focusRisk: key, tag: r.cause ? 'sick' : fxTag(r.fx) });
}

// ทายาททางสายเลือด (โฟกัสใบ 03): เริ่มชาติด้วยตัวเด็กของหมวดโฟกัสหลักของพ่อแม่ (kid ในทะเบียน) · ไม่มีหมวด/ไม่มีตัวเด็ก = ตามน้ำ
export function lifeFocusKid(st) {
  const defs = lifeFocusDefs(st);
  const main = focusMain(st, defs);
  return (main && defs[main].kid) || null;
}
function lifeFocusBorn(st, kid) {
  if (!kid || !lifeFocusDefs(st)[kid]) return;
  if (lifeFocusOffers(st).includes(kid)) focusSet(st, kid, -1);
  else st.focusHeir = kid;
  st.focusBorn = true;
}

// นิสัยจากวัยเด็ก (B41): แต้มสะสมถึงอายุ nature_age แล้วล็อกตัวเดียวถาวร · เนื้อหาที่ไม่มีทะเบียนนิสัย = ไม่มีระบบนี้ ชีวิตเดินเหมือนเดิมทุกหลัก
// ทายาทเริ่มชาติด้วยทุ่มเทตัวเด็กของพ่อแม่ — นับปีเต็มเท่าลูกที่เลือกเอง ทายาทแทบทุกคนจะได้นิสัยพ่อแม่ จึงนับแค่ heir_nature จนผู้เล่นเปลี่ยนเอง
// ตัวที่ได้แต้มล่าสุดย้ายไปท้าย naturePts เสมอ แต้มเสมอกันจึงเลือกตัวท้าย (ตัวที่ได้แต้มล่าสุด)
const NATURE_NONE = 'ยังไม่รู้ว่าตัวเองเป็นคนแบบไหน';
function naturePoint(st, id, n) {
  const c = st.content.focus;
  if (!id || !n || !c?.natures?.[id] || st.age > c.nature_age) return;
  const pts = (st.naturePts ??= {});
  const v = (pts[id] ?? 0) + n;
  delete pts[id];
  pts[id] = v;
}
// ปิดปีอายุ nature_age: การ์ดบอกนิสัยออกก่อนการ์ดเข้าช่วงวัยถัดไป · ไม่มีแต้ม (ตามน้ำ ไม่กดป้าย) = ไม่มีนิสัยเด่น
function natureLock(st) {
  const c = st.content.focus;
  if (!c?.natures || st.age !== c.nature_age) return;
  const pts = st.naturePts ?? {};
  let id = null;
  for (const [k, v] of Object.entries(pts)) if (v > 0 && (!id || v >= pts[id])) id = k;
  delete st.naturePts;
  delete st.focusBorn;
  if (id) st.nature = id;
  st.due.push({ kind: 'result', type: 'A', age: st.age, stage: stageOf(st.age), text: id ? `คุณโตมาเป็นคน${c.natures[id].name}` : NATURE_NONE, nature: id, tag: 'nature' });
}
// ตัวคูณนิสัยของการ์ดใบนี้: ค่าตรงนิสัย (เงินนับเฉพาะการ์ดหมวดใน cards) + การ์ดขึ้นเงินเดือนเมื่ออาชีพตรงสาย · ไม่มีนิสัย = null คูณ 1 ทุกค่า
function natureBoost(st, ev) {
  const n = st.nature && st.content.focus?.natures?.[st.nature];
  if (!n) return null;
  const stat = n.stat && (n.stat !== 'money' || !n.cards || n.cards.includes(ev.category)) ? n.stat : null;
  const job = !!n.jobs?.includes(st.occupation) && isWorking(st);
  if (!stat && !job) return null;
  return { stat, job, mul: st.content.focus.nature_mul, text: `เพราะคุณเป็นคน${n.name} ผลดีเมื่อกี้เลยมากขึ้นอีกนิด` };
}
// ประตูเข้าสาย (โฟกัสใบ 04 · เจ้าของเคาะ: ล็อกแค่ประตู): เปิดเมื่อโฟกัสนั้นสะสมครบ chain_years · ทายาทในตระกูลรับประตูที่รุ่นก่อนเปิดไว้
// · การ์ดชวน (ธง gate:<โฟกัส>) เปิดให้ได้โดยไม่ต้องโฟกัส เช่น นักธุรกิจถูกชวนลงการเมือง
export const GATE_FLAG = 'gate:';
export const lifeGateOpen = (st, id) => (st.focusYears?.[id] ?? 0) >= (st.content.focus?.chain_years ?? Infinity) || !!st.gates?.includes(id) || !!st.flags[GATE_FLAG + id];
export const lifeGatesOpen = (st) => Object.entries(lifeFocusDefs(st)).filter(([id, d]) => d.group === 'gate' && lifeGateOpen(st, id)).map(([id]) => id);
// การ์ดชวนลงสมัครตอนยังไม่มีตำแหน่ง = ประตูสายการเมือง
export const OFFICE_GATE = 'politics_base';
const gateShut = (st, c) => !!c.gate && ![c.gate].flat().some((id) => lifeGateOpen(st, id));
const GATE_LOCK = 'ยังไม่เคยทุ่มเทกับทางนี้';
function lifeFocusMul(st, e) {
  if (!st.focus) return 1;
  return focusCardMul(lifeFocusDefs(st)[st.focus], [e.category, ...(e.focus ?? [])], st.content.focus.card_mul);
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
  for (const [k, v] of Object.entries(m.stats ?? {})) x *= statMul(v, st[k]);
  if (m.karma) x *= m.karma ** Math.sign(netLedger(st.ledger));
  // ขอพร: เอียงตามบัญชีแบบต่อเนื่อง บุญน้อยเอียงน้อย บาปหนักกลับทิศ
  if (m.wish) x *= m.wish ** ledgerLevel(st.ledger);
  if (m.family_fame) x *= m.family_fame ** (st.fame ?? 0);
  if (m.overlap_stage !== undefined) x *= m.overlap_stage ** overlapStageOf(st);
  for (const [f, v] of Object.entries(m.flags ?? {})) if (st.flags[f]) x *= v;
  for (const [f, v] of Object.entries(m.parent_flags ?? {})) if (st.parentFlags?.[f]) x *= v;
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
// การ์ดช่วงป่วยก่อนตาย (B110): ผ่านเมื่อตรวจเจอโรคเรื้อรังแล้ว · causes = กลุ่มโรค · left = ปีที่เหลือก่อนถึงนัด (0 = ปีสุดท้าย)
export const illnessOk = (st, w) => !!st.terminal?.told && (!w.causes || w.causes.includes(st.terminal.cause)) && inRange(st.terminal.age - st.age, w.left);
// การ์ดตรวจสุขภาพจากประวัติครอบครัว (B110 ชิ้น 2): พ่อ/แม่จากไปด้วยโรคที่ถ่ายทอดได้แล้ว · causes = โรคไหนบ้าง (ไม่ใส่ = โรคใดก็ได้)
export const heredityOk = (st, w) => (st.heredity ?? []).some((k) => !w.causes || w.causes.includes(k));
const inBound = (v, b) => !b || ((b.min === undefined || v >= b.min) && (b.max === undefined || v <= b.max));
const flagsOk = (st, f) => (f.has ?? []).every((k) => st.flags[k]) && !(f.not ?? []).some((k) => st.flags[k]);
// เซฟก่อนมีช่องนี้ไม่มี parentFlags — อ่านแบบ ?. ให้เท่ากับไม่มีธงพ่อแม่
const parentFlagsOk = (st, f) => (f.has ?? []).every((k) => st.parentFlags?.[k]) && !(f.not ?? []).some((k) => st.parentFlags?.[k]);
// ป้ายบนการ์ด: ธงพ่อแม่ที่ทำให้ใบนี้ออก (when.parent_flags.has เท่านั้น — ตัวคูณแค่เอียงโอกาส ไม่ได้เล่า)
const parentFrom = (st, ev) => {
  const x = (ev.when?.parent_flags?.has ?? []).filter((f) => st.parentFlags?.[f]).map((f) => ({ flag: f, tier: st.parentFlags[f] }));
  return x.length ? { parentFrom: x } : {};
};
// ครอบครัวมีแค่พ่อแม่ (ด่าน family-system กั้นบทบาทอื่นไว้) · เงื่อนไขผ่านเมื่อพ่อหรือแม่คนใดคนหนึ่งตรง
// เงื่อนไขเกิดแบบประกาศทุกฟิลด์ (ใบ 07)
export function whenOk(st, when) {
  if (!when) return true;
  if (when.family && !when.family.every((f) => familyOk(st, f))) return false;
  if (when.loss && !lossOk(st, when.loss)) return false;
  if (when.illness && !illnessOk(st, when.illness)) return false;
  if (when.kin_illness && !kinIllOk(st, when.kin_illness)) return false;
  if (when.filial && !filialOk(st, when.filial)) return false;
  if (when.heredity && !heredityOk(st, when.heredity)) return false;
  if (!inRange(st.age, when.age) || !inRange(st.birthYear + st.age, when.year)) return false;
  if (when.class && !when.class.includes(classNow(st))) return false;
  if (when.region && !when.region.includes(st.region)) return false;
  if (when.sex && !when.sex.includes(st.sex)) return false;
  if (when.overlap_stage && !inRange(overlapStageOf(st), when.overlap_stage)) return false;
  for (const [k, b] of Object.entries(when.stats ?? {})) if (!inBound(st[k], b)) return false;
  // อาชีพนับเมื่อมีงานของตัวเองแล้ว — อาชีพครอบครัวก่อนทำงานไม่ทำให้การ์ดที่ทำงานออก
  if (when.occupation && !(st.workFrom !== null && when.occupation.includes(st.occupation))) return false;
  if (when.school && !when.school.includes(schoolOf(st))) return false;
  if (when.ladder && !when.ladder.includes(st.ladder?.id ?? 'none')) return false;
  if (MONEY_KEYS.some((k) => when[k])) {
    const r = moneyRatios(st);
    if (MONEY_KEYS.some((k) => when[k] && !inBound(r[k], when[k]))) return false;
  }
  if (when.parent_flags && !parentFlagsOk(st, when.parent_flags)) return false;
  if (when.dark_gate && !darkGateOk(st)) return false;
  if (when.past_life && !pastLifeOk(st, when.past_life)) return false;
  return !when.flags || flagsOk(st, when.flags);
}

// ประตูทางมืด (B99a): ข้อเสนอผิดกฎหมายถึงคนที่ทั้งเงินตึงและเคยเลือกทางบาปเองชาตินี้ถึงเกณฑ์ — คนจนที่มือสะอาดไม่ถูกชวน
// นับจากตัวเลือกที่กดจริงใน st.log ไม่อ่านบัญชีบุญบาปซ่อน · log เริ่มใหม่ทุกชาติ บาปชาติก่อนจึงไม่นับ
export const DARK_GATE = { picks: 2 };
export function sinPicks(st) {
  const ix = lifeEventIndex(st.content.events);
  let n = 0;
  for (const l of st.log) {
    const i = ix.pos.get(l.id);
    const c = i === undefined ? null : st.content.events[i].choices?.[l.choice];
    if (c?.merit?.some((t) => SIN_CATS.includes(meritId(t.cat)))) n++;
  }
  return n;
}
export const darkGateOk = (st) => moneyTight(st) && sinPicks(st) >= DARK_GATE.picks;

// ธงจากเนื้อหา (ตัวเลือก · ผลลัพธ์ · การ์ดที่แกนสร้าง · เสี่ยงของโฟกัส) ติดผ่านจุดนี้จุดเดียว — ผลที่ต้องเกิดตอนธงติดจึงดักได้ที่เดียว
// ธงจากบัญชีบุญบาป (recordMerit) ไม่ผ่านที่นี่: ไม่จดอายุที่ได้มาตั้งแต่เดิม
function raiseFlag(st, f) {
  // ถูกจับครั้งแรกเท่านั้นที่ยึด — ต้องเช็กก่อนตั้งธง · ผลลัพธ์ใส่เงินก่อนติดธง เงินก้อนที่ได้พร้อมถูกจับจึงถูกยึดด้วย
  if (f === 'caught_fraud' && !st.flags[f]) greySeize(st, GREY.seize);
  st.flags[f] = true;
  st.flagAge[f] ??= st.age;
}

// ป้ายบุญบาปเข้าบัญชีซ่อน · ธง · นัดเหตุการณ์ต่อเนื่อง (ใบ 07) — นัดสุ่มปีจาก rng ของโลก เพราะเป็นผลของการเลือก
function applyChoice(st, ev, c, text) {
  // คำบนเดียวกันมีหลายการ์ดนัด (ครั้งที่ 1 · ครั้งที่ 2) — ใช้ธงคำบนที่การ์ดปิดเป็นตัวระบุ ไม่ใช่ id การ์ด
  const vow = (c.clears_flags ?? []).find((f) => f.startsWith('vow_open:')) ?? ev.id;
  noteDeed(st, text, () => {
    for (const f of recordMerit(st.ledger, c.merit, vow)) st.flags[f] = true;
  });
  for (const f of c.sets_flags ?? []) raiseFlag(st, f);
  for (const f of c.clears_flags ?? []) delete st.flags[f];
  applyFamily(st, c, ev.category === 'family' && c.effects?.relations > 0 ? c.effects.relations : 0);
  for (const s of c.schedules ?? []) {
    const age = st.age + st.rng.int(s.after_years[0], s.after_years[1]);
    // ผลย้อนมีโอกาส (gameslash-2): ไม่ใส่ chance หรือ chance 1 = ไม่สุ่มเพิ่ม เลขสุ่มของชีวิตเดิมไม่ขยับ
    // ไม่ผ่าน = ไม่นัด แต่จดใน echoes ช่องเดียวกับคู่เหตุและผล (missed) — หน้าจบ/สมุดเล่าได้ว่ารอดผลย้อนมา
    const chance = s.chance;
    if (chance < 1 && st.rng.next() >= chance) {
      const target = st.content.events.find((e) => e.id === s.event);
      (st.echoes ??= []).push({ from: st.age, age, pick: text, title: target?.title ? fill(target.title, st) : null, missed: true });
    } else st.scheduled.push({ event: s.event, age, from: st.age, pick: text });
  }
  // ปิดสายเรื่องรายคน: หน้าจบบอกว่าจบแล้ว · กองสุ่มเลิกหยิบตอนใหม่ของสายนี้
  if (c.arc_end && ev.arc) st.arcs[ev.arc].end = true;
}

// แรงที่เราดูแลพ่อแม่ (B167): บุญดูแลพ่อแม่บวก บาปทำร้ายผู้ใหญ่ลบ ตามระดับของป้าย — ป้ายหมวดอื่นบนตัวเลือกเดียวกันไม่นับ
const FILIAL_CATS = { care_parents: 1, abuse_elders: -1 };
const filialScore = (tags = []) => tags.reduce((s, t) => s + (FILIAL_CATS[meritId(t.cat)] ?? 0) * (MERIT_LEVELS[t.level] ?? 0), 0);

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
  if (st.court) return chooseCourt(st, idx);
  if (st.trip) return chooseIsekai(st.trip, idx);
  if (st.cadet?.cur) return chooseCadet(st, idx);
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
  if (ev?.search) {
    const c = ev.choices[idx];
    if (!c) throw new Error('ตัวเลือกไม่ถูกต้อง');
    st.pending = null;
    st.log.push({ id: GONE_SEARCH.id, age: st.age, choice: idx, text: c.text });
    st.queue.push({ kind: 'result', type: 'B', age: st.age, stage: stageOf(st.age), text: c.reply, tag: 'search' });
    return;
  }
  if (ev?.warn) {
    if (!ev.choices[idx]) throw new Error('ตัวเลือกไม่ถูกต้อง');
    st.pending = null;
    st.log.push({ id: 'warn', age: st.age, choice: idx, text: ev.choices[idx] });
    return;
  }
  // ภาพสุดท้าย (B168) ขึ้นแค่มรณบัตร — ไม่ลง log ชีวิตจบแล้ว ไม่มีอะไรอ่านต่อ
  if (ev?.memory) {
    if (!ev.choices[idx]) throw new Error('ตัวเลือกไม่ถูกต้อง');
    st.pending = null;
    st.lastImage = ev.choices[idx];
    return;
  }
  // ปุ่มสุดท้าย = ผ่าน · ไม่ดึงเลขสุ่ม
  if (ev?.upgrade) {
    const s = st.skills[idx];
    if (!s && idx !== st.skills.length) throw new Error('ตัวเลือกไม่ถูกต้อง');
    if (s && s.lv >= SKILL.top) throw new Error('ตัวเลือกนี้ล็อกอยู่');
    st.pending = null;
    if (s) st.skills = st.skills.map((x) => (x === s ? { ...x, lv: skillUp(x.lv, x.cap) } : x));
    st.log.push({ id: 'upgrade', age: st.age, choice: idx, text: ev.choices[idx] });
    return;
  }
  if (ev?.entry) {
    if (!ev.choices[idx]) throw new Error('ตัวเลือกไม่ถูกต้อง');
    st.pending = null;
    // ปฏิเสธ = ไม่แตะอะไรเลย · กดรับ = จบชีวิตตรงนี้ แล้วปรโลกส่งข้ามโลก (ธง isekai_call) · ตาย = งานศพตามปกติ · หายตัว = ใบคนที่บ้านตามหาแทน (B137)
    // ทางที่ได้กลับ (B68m) = ไปต่างโลกทั้งตัวกลางชีวิต ไม่ตั้งธง · บัญชีบุญบาปส่งตัวเดียวกันเข้าไป
    const n = st.trips?.length ?? 0;
    const trip = idx === ENTRY.accept && tripRoll(st.seed, ev.entry, n);
    if (trip) {
      if (overlapLeftIsekai(st)) overlapStep(st);
      st.log.push({ id: `isekai_${ev.entry}`, age: st.age, choice: idx, text: ev.choices[idx].text });
      st.trip = startIsekai({
        seed: (st.seed ^ TRIP.salt ^ Math.imul(n + 1, 0x9e3779b1)) >>> 0, past: st.name, ledger: st.ledger,
        lore: isekaiWorldLore([...(st.lineage ?? []), { trips: st.trips }]),
        legends: isekaiWorldLegends([...(st.lineage ?? []), { trips: st.trips }]),
        trip: { ...trip, age: st.age, wit: st.knowledge / TRIP.wit },
        // ค่าจริงของชีวิตนี้ตอนข้าม (B136) — ผลในต่างโลกสะท้อนกลับชุดนี้ แล้ว tripBack เขียนลง st
        real: realAt(st),
        hints: st.content.nearHints,
        carry: st.skills ?? [],
        overlapStage: overlapStageOf(st),
      });
      return;
    }
    if (idx === ENTRY.accept) {
      st.flags.isekai_call = true;
      st.isekaiVia = ev.entry;
      st.log.push({ id: `isekai_${ev.entry}`, age: st.age, choice: idx, text: ev.choices[idx].text });
      st.dead = true;
      if (!isGone(st)) queueFuneral(st);
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
  // ใบในรอบเดียวกัน (ev.run) ที่สุขภาพหมดอยู่ก่อนกด = โรคที่ถึงคิวกลางรอบ ไม่ใช่ผลของใบนี้ — จำไว้ก่อนผลของตัวเลือกลง
  const ill = ev.run !== undefined && st.health <= 0;
  const nat = natureBoost(st, ev);
  const flagsBefore = { ...st.flags };
  let because = applyEffects(st, c.effects, s, ss, 1, nat);
  const gotC = c.effects?.loot && gainLoot(st, c.effects.loot);
  applyChoice(st, ev, c, text);
  naturePoint(st, c.nature, 1);
  if (c.filial) filialNote(st, c.filial, filialScore(c.merit));
  if (c.pact) signPact(st, c.pact);
  st.log.push({ id: ev.id, age: st.age, choice: idx, text, ...(loan !== undefined && { loan }) });
  // ผลสุ่ม: จับทางด้วย rng ของโลก (เป็นผลของการเลือก) แล้วเล่าเป็นการ์ดผลลัพธ์ใบถัดไป
  // น้ำหนักแต่ละทางเอียงตาม multipliers ของทางนั้น — บัญชีอ่านหลังป้ายบุญบาปของตัวเลือกนี้ลงแล้ว (กรรมตามทันทันที)
  // การ์ดที่ตัวเลือกนี้ก่อ (ผล → เรื่องต่อ → หางาน) เข้าหัวคิวตามลำดับ ก่อนการ์ดอื่นของปีที่รออยู่
  // สายมูก่อการ์ดของตัวเองได้ (ผลหวยสายมู) — มาก่อนผลสุ่มของตัวเลือก
  const after = beliefChoice(st, ev, c);
  // ตัวเลือกตรงไม่มีการ์ดผล — ของที่ได้เล่าเป็นการ์ดผลใบเดียว (lint ห้าม loot บนตัวเลือกที่มี outcomes)
  if (gotC) after.unshift({ kind: 'result', type: ev.type ?? 'A', age: st.age, stage: stageOf(st.age), text: gotC, tag: 'loot', evId: ev.id });
  let doom, wound;
  let o = null;
  if (c.outcomes?.length) {
    o = weighted(st.rng, c.outcomes, outcomeWeights(st, ev, c));
    doom = o.effects?.die;
    // ตัวเลือกที่มีทางตาย (ห้องบอส): ชีวิตหมดจากบาดแผลทางอื่นของตัวเลือกเดียวกันก็ตายในดันเจียน ไม่ใช่ด้วยโรค
    wound = c.outcomes.find((x) => x.effects?.die)?.effects.die;
    // ตายในการ์ด ญาติประคองไม่ได้ — ป้าย "หนักแค่ครึ่งเดียว" จะขัดกับมรณบัตรใบถัดไป
    const helper = !o.ok && !doom && hurts(st, o.effects) ? (kinAid(st) ?? netAid(st, ev, o)) : null;
    because = applyEffects(st, o.effects, s, ss, helper ? KIN_AID.scale : 1, nat) || because;
    const gotO = o.effects?.loot && gainLoot(st, o.effects.loot);
    applyChoice(st, ev, o, text);
    if (c.filial) filialNote(st, c.filial, filialScore(o.merit), true);
    if (o.text) after.push({ kind: 'result', type: ev.type ?? 'A', age: st.age, stage: stageOf(st.age), text: fill(o.text, st) + (helper ? ` · ${helper.who ?? AID_WHO[helper.role]}${helper.name}มาช่วยประคอง เลยหนักแค่ครึ่งเดียว` : '') + (gotO ? ` · ${gotO}` : ''), tag: fxTag(o.effects, [...(ev.hidden ?? []), ...(c.hidden ?? [])]), evId: ev.id });
    // ผลชี้เรื่องต่อ: การ์ดเลือกของเหตุการณ์นั้นตามหลังการ์ดผลทันที อายุเดียวกัน · เงื่อนไขปี/when ไม่ผ่าน = จบที่การ์ดผล
    const follow = o.next && st.content.events.find((e) => e.id === o.next);
    if (follow && inYears(follow, st.birthYear + st.age) && whenOk(st, follow.when) && beliefOk(st, follow) && arcNextOk(st, ev, follow)) {
      st.done[follow.id] = true;
      st.fired[follow.id] = { n: (st.fired[follow.id]?.n ?? 0) + 1, age: st.age };
      beliefFired(st, follow);
      takeYearQuota(st);
      after.push({ kind: 'eraEvent', ev: follow, age: st.age });
    }
  } else if (c.result) {
    // ผลทางเดียว (Q1 เจ้าของเคาะ ก 2026-11-09): ตัวเลือกไม่มีผลสุ่มแต่มีข้อความผล → การ์ดผลใบเดียว ป้ายหมวดจากผลของตัวเลือก
    after.push({ kind: 'result', type: ev.type ?? 'A', age: st.age, stage: stageOf(st.age), text: fill(c.result, st), tag: fxTag(c.effects, [...(ev.hidden ?? []), ...(c.hidden ?? [])]), evId: ev.id });
  }
  if (because) st.because = nat.text;
  // จดหมายคำฝาก: เลือกคำฝากใบย่อยก่อน แล้วคำสั่งเสียกลับมาตามปกติ
  const pick = c.letter && st.content.events.find((e) => e.id === LETTER.pick);
  if (pick) {
    st.done[pick.id] = true;
    st.fired[pick.id] = { n: 1, age: st.age };
    after.push({ kind: 'eraEvent', ev: pick, age: st.age });
  }
  // คำสั่งเสียเลือกได้หลายข้อ: สั่งเรื่องหนึ่งแล้วการ์ดกลับมาให้สั่งต่อ ข้อที่สั่งแล้วล็อกด้วยธงของมันเอง
  if (ev.id === FUNERAL.wishes && (c.sets_flags ?? []).some((f) => f.startsWith('wish_'))) after.push({ kind: 'eraEvent', ev, age: st.age });
  // เลิกเรียนแล้วหางานทันที
  if (st.needJob && st.flags.cadet_passed) st.needJob = false;   // สอบติดเตรียมทหารแล้ว ไม่ต้องหางาน
  // ด่านจบ ม.6/ปวช. ที่รอผล: เลิกฝันจากการ์ดปกติ (ทางปิดลำดับเส้นสอบอยู่ใน nextCard)
  releaseTrack(st, after);
  if (st.needJob && !cadetLive(st)) {
    st.needJob = false;
    after.push({ kind: 'eraEvent', ev: jobCard(st), age: st.age });
  }
  // ชีวิตหมดจากผลการ์ด = ตายในการ์ดนั้น (B160) ไม่รอขอบปี · การ์ดผลยังเล่าก่อน · เรื่องต่อ หางาน และการ์ดที่รอในปีนั้นไม่ออกแล้ว
  // การ์ดงานศพเลือกหลังตายแล้ว ⇒ ไม่ตัดสินซ้ำ
  // ผลที่สั่งตาย (ดันเจียนของนักล่า) เดินทางเดียวกัน แต่สาเหตุมาจากการ์ด ไม่ใช่โรคตามสุขภาพ
  // โรคที่ถึงคิวกลางรอบรอให้รอบจบก่อน (ตัดกลางรอบ = ผู้เล่นไม่รู้ว่าออกจากเกตหรือไม่) แล้วตายด้วยโรคที่ใบสุดท้าย — บาดแผลของห้องบอสไม่ใช่เหตุ
  const runOn = ill && !doom && after.some((x) => x.kind === 'eraEvent' && x.ev.run === ev.run);
  if (!st.dead && !st.court && !runOn && (doom || st.health <= 0)) {
    const d = faceDeath(st, doom ?? (ill ? undefined : wound) ?? healthCause(st), { afterQueue: true });
    st.queue = after.filter((x) => x.kind === 'result');
    st.due = [];
    if (d.fate === 'dead') queueFuneral(st);
    if (d.fate === 'survive') {
      // รอดแบบเดียวกับขอบปี: ปีนั้นจบที่ความตายเฉียดผ่าน แล้วขึ้นปีโดยไม่ทอยตายอายุเดิมซ้ำ
      st.queue.push(d.card);
      stepYear(st);
      st.advance = false;
    }
    return;
  }
  // ผลที่ให้อัปเกรด (06s) → การ์ดอัปเกรดต่อจากการ์ดผล ก่อนเรื่องต่อ · ไม่ได้พกสกิลมา = ไม่มีการ์ด
  if (st.skills?.length && (c.upgrade || o?.upgrade)) {
    const at = after.findIndex((x) => x.kind !== 'result');
    after.splice(at < 0 ? after.length : at, 0, { kind: 'upgrade', age: st.age, stage: stageOf(st.age) });
  }
  // เตือนต่อท้ายการ์ดผลของตัวเลือกนี้ ก่อนเรื่องต่อ — เรื่องต่อที่ทำชีวิตหมดล้างคิว การ์ดเตือนที่อยู่หลังจะไม่เคยออก
  if (!st.dead && crossedLow(st, st.health, WARN.human)) {
    const at = after.findIndex((x) => x.kind !== 'result');
    after.splice(at < 0 ? after.length : at, 0, warnCard(st.age, stageOf(st.age), WARN.text));
  }
  st.queue.unshift(...after);
  cadetAfterChoice(st, ev, c, flagsBefore);
}

function deathCard(st) {
  const year = st.birthYear + st.age;
  const era = st.content.era;
  const card = {
    kind: 'death',
    age: st.age,
    text: `${lifeEndWord(isGone(st))} ${st.age}`,
    cause: st.cause ?? 'other',
    ...(careHelp(st.cause) && { help: careHelp(st.cause) }),
    // money = ทรัพย์สุทธิหลังหักหนี้รายก้อน · debt = ยอดหนี้รายก้อนที่ค้าง (ระหว่างชาติ B06 อ่านแยก)
    summary: {
      year,
      money: Math.round(netWorth(st)),
      moneyAtBirth: Math.round(netWorth(st) / priceRatio(era, st.seed, st.birthYear, year)),
      debt: Math.round(totalDebt(st)),
      bankruptcies: st.bankruptcies,
      // เงินเทาที่ยังไม่ฟอกหายไปกับตัว — ไม่เข้า estate จึงไม่เป็นมรดก/ฐานะรุ่นถัดไป · มีช่องเฉพาะชีวิตที่เหลือถุง
      ...(st.grey > 0 && { grey: Math.round(st.grey) }),
    },
  };
  st.estate = { year, money: card.summary.money, moneyAtBirth: card.summary.moneyAtBirth, debt: card.summary.debt, bankruptcies: st.bankruptcies };
  // ช่วงวัยสุดท้ายไม่มีการ์ดเปลี่ยนช่วงมาปิด — เล่าบนบันทึกการตายแทน
  card.recap = stageRecap(st, st.age);
  card.life = lifeSeries(st);
  card.job = jobText(st);
  card.gen = st.gen;
  if (st.lastImage) card.lastImage = st.lastImage;
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
    const guests = funeralGuests(st);
    const who = funeralWho(st, guests);
    // ยอดที่โชว์ไม่ต่ำกว่าคนในบ้านที่มา (บริจาคร่างปัดได้ 0) — ชื่อเสียง/บุญแขกยังคิดจากยอดเดิม
    card.funeral = { text, guests: Math.max(guests, who?.came ?? 0), cost: Math.round(cost), ...(who && { who: who.text }) };
  }
  // มีทรัพย์ให้แบ่ง + ลูกที่ยังอยู่ถึงเกณฑ์ = เรื่องพินัยกรรม (afterlife.mjs หักส่วนที่เสียไปกับการทะเลาะ) · ลูกคนเดียวไม่มีใครให้ทะเลาะด้วย
  if (card.summary.money > 0 && !card.short && disputes(st)) card.will = !!st.flags.wish_will;
  if (st.flags.wish_letter && letterTo(st)) card.letter = `ฝากจดหมายไว้กับ${letterToText(letterTo(st))}`;
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
// จดหมายคำฝาก (afterfall-3): ใบเลือกคำฝากตามหลังคำสั่งเสีย · ใบที่ทายาทอ่านขึ้นต้นด้วย read (ใบละชนิดคำฝาก)
export const LETTER = { pick: 'funeral_letter_01', read: 'heir_letter_', nobody: 'ไม่มีใครให้ฝาก' };
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
    return !!c && (!c.requires?.money || purse >= moneyValue(st, c.requires.money, true));
  };
  let want = ['one_day'];
  if (st.relations >= FUNERAL.love.high) want = [...(st.rng.next() < 0.5 ? ['grand', 'chant_7'] : ['chant_7', 'grand']), 'chant_3', 'one_day'];
  else if (st.relations >= FUNERAL.love.low) want = ['chant_3', 'one_day'];
  return want.find(ok) ?? 'temple';
}
// ทริปจบ (การ์ดจบออกไปแล้ว): ตายในต่างโลก = ชีวิตไทยจบแบบหายตัว · กลับบ้าน = เวลาไทยเดินตามที่ทอยไว้แล้วเล่าการกลับ
// ค่าจริงที่ต่างโลกสะท้อนกลับ เขียนลงชีวิตไทย (B136 · เจ้าของเคาะ): เงินมาทางนี้ทางเดียว (tripCarry ไม่มีเงิน)
// ตายในต่างโลก = นับแค่เงิน (เข้ากองมรดก) · ค่าสถานะที่สะท้อนไปไม่มีผล เพราะชีวิตนี้จบแล้ว · ทริปในเซฟก่อน B136 ไม่มี real
export function tripSettle(st, isk) {
  if (!isk.real) return;
  st.money += isk.real.money - isk.trip.money0;
  if (isk.home) for (const k of STAT_KEYS) st[k] = clamp(isk.real.stats[k]);
}

// ค่าซ้อนทับ (โลกซ้อนทับ): ตัวนับเดียวของตระกูล ขึ้นทีละ 1 ทุกครั้งที่กลับเข้าโลกที่เคยออกไป ไม่มีทางลด · ไปกับทายาทเหมือนบัญชีบุญบาป
// ไม่ดึงเลขสุ่ม — ชีวิตที่ไม่ข้ามโลกเดินเท่าเดิม · เริ่มตระกูลใหม่ (newLife ไม่มี heir) = 0
export const overlapOf = (st) => st?.overlap ?? 0;
export function overlapStep(st) {
  st.overlap = overlapOf(st) + 1;
}
// ขั้นของค่าซ้อนทับ 0–4: การ์ดอ่านแค่ขั้น ไม่อ่านค่าดิบ · ขั้น 1 = ค่า 1 ล็อก · ขั้น 2–4 ไปไม่ถึงจนใบ 16 วัดบอทอัตราจริงแล้วใส่เลข
export const OVERLAP_STAGE_MIN = [0, 1, Infinity, Infinity, Infinity];
// อ่านค่าสดทุกครั้ง — ขึ้นขั้นกลางชีวิต (ทริปกลับบ้าน) การ์ดขั้นใหม่ออกได้ปีถัดไปเลย
export const overlapStageOf = (st) => OVERLAP_STAGE_MIN.findLastIndex((min) => overlapOf(st) >= min);
// ตระกูลเคยออกจากต่างโลกมาแล้ว = มีชาติต่างโลกลงผัง (กลับมาเกิดแล้ว) หรือทริปที่กลับถึงบ้าน · ทริปหลงตายในต่างโลก ไม่นับว่าออก
// เข้าต่างโลกอีกเมื่อจริง = กลับเข้าโลกที่เคยออกไป +1 (เกิด · ถูกเรียก · ทริป)
export const overlapLeftIsekai = (st) => [...(st.lineage ?? []), { trips: st.trips }].some((l) => l.isekai || l.trips?.some((t) => t.home));

// ตารางนัดการ์ดซ้อนทับต่อชีวิต: ลอกแบบตารางนัดการ์ดชวนต่างโลก — สุ่มจาก stream แยกของ seed ไม่ดึง st.rng
// ขั้น 0 ไม่มีตารางและไม่เพิ่มช่องใด ⇒ ตระกูลค่า 0 เดินเท่าเดิมทุกหลัก · การ์ดซ้อนทับไม่อยู่ในกองสุ่ม ออกทางนัดนี้ทางเดียว
// นัดลง st.scheduled จึงกินโควตาปีแบบผลย้อน (ชีวิตไม่ยาวขึ้น) · ขั้น 1 อย่างน้อย 1 ใบ ให้คนที่ข้ามโลกครั้งแรกเห็นผลแน่นอน
// ขั้นขึ้นกลางชีวิตได้ทางเดียวคือทริปกลับบ้าน ⇒ ทิ้งนัดที่ยังไม่ออกแล้วสุ่มใหม่ด้วย stream ของรอบนั้น หลังเดินปีที่หายไปแล้ว
export const OVERLAP_PLAN = { salt: 0x3c6ef372, prefix: 'overlap_', ages: [15, 60], quota: [[0, 0], [1, 1], [1, 2], [2, 4], [2, 4]] };
// stage ส่งเองได้เฉพาะด่าน — ขั้น 2–4 ยังไม่มีเลขเกณฑ์ให้ตระกูลจริงไปถึง
export function overlapPlan(st, run = 0, stage = overlapStageOf(st)) {
  if (!stage) return;
  st.scheduled = st.scheduled.filter((x) => !x.overlap);
  const rng = makeRng(mixSeed(st.seed ^ OVERLAP_PLAN.salt, run));
  const [lo, hi] = OVERLAP_PLAN.quota[stage];
  const from = Math.max(st.age + 1, OVERLAP_PLAN.ages[0]);
  const pool = st.content.events.filter((e) => e.id.startsWith(OVERLAP_PLAN.prefix) && !st.done[e.id] && inRange(stage, e.when?.overlap_stage));
  for (let left = rng.int(lo, hi); left > 0 && pool.length && from <= OVERLAP_PLAN.ages[1]; left--) {
    const [ev] = pool.splice(rng.int(0, pool.length - 1), 1);
    st.scheduled.push({ event: ev.id, age: rng.int(from, OVERLAP_PLAN.ages[1]), overlap: true });
  }
}

// ขั้นความเพี้ยน: ค่าแยกจากค่าซ้อนทับ ไม่เขียนกลับไปที่ค่านั้น · ชีวิตแรกของเซฟ = 0 เสมอ แม้ทริปกลับบ้านดันค่าซ้อนทับขึ้นแล้ว
// รุ่น 2 ขึ้นไปได้อย่างน้อยขั้น 1 แล้วตามขั้นซ้อนทับเมื่อสูงกว่า
// ขั้น 4 ได้จำนวนเท่าขั้น 3 (เจ้าของเคาะ world-drift ข้อ 34) · ตัดที่แถวสุดท้ายกันค่าซ้อนทับเพิ่มขั้นในอนาคตแล้วอ่านแถวที่ไม่มี
export const DRIFT_PLAN = { salt: 0x510e527f, prefix: 'drift_', ages: [15, 70], quota: [[0, 0], [1, 1], [2, 3], [4, 6], [4, 6]] };
export const driftStageOf = (st) => ((st.gen ?? 1) < 2 ? 0 : Math.min(Math.max(1, overlapStageOf(st)), DRIFT_PLAN.quota.length - 1));
const driftFired = (st) => Object.keys(st.done).filter((id) => id.startsWith(DRIFT_PLAN.prefix)).length;
// เหตุแต่งเป็นการ์ดนัด: ลง st.scheduled ⇒ กินโควตาปีแบบผลย้อน ไม่ผ่านทางเหตุบ้านเมือง (lastEraAge · ฉายา storm/survivor ไม่เห็น)
// stream แยกจาก seed ไม่ดึง st.rng · ขั้น 0 ไม่เพิ่มช่องใด ⇒ ชีวิตแรกเดินเท่าเดิมทุกหลัก
// st.drift = ขั้นตอนวางแผน · ชีวิตจากเซฟเก่าไม่มีช่องนี้ ⇒ ทริปกลับบ้านไม่วางแผนให้ชีวิตที่เล่นค้าง (เซฟเก่าเริ่มนับชีวิตถัดไป)
// ทริปกลับบ้านวางใหม่ด้วย stream ของรอบนั้น หักเหตุที่ออกไปแล้ว ⇒ ทั้งชีวิตไม่เกินจำนวนของขั้นล่าสุด
export function driftPlan(st, run = 0, stage = driftStageOf(st)) {
  if (!stage || (run && !st.drift)) return;
  st.drift = stage;
  st.scheduled = st.scheduled.filter((x) => !x.drift);
  const rng = makeRng(mixSeed(st.seed ^ DRIFT_PLAN.salt, run));
  const [lo, hi] = DRIFT_PLAN.quota[stage];
  const pool = st.content.events.filter((e) => e.id.startsWith(DRIFT_PLAN.prefix) && !st.done[e.id]);
  for (let left = rng.int(lo, hi) - driftFired(st); left > 0 && pool.length; left--) {
    const [ev] = pool.splice(rng.int(0, pool.length - 1), 1);
    // ช่วงอายุของการ์ดตัดกับช่วงแผน ⇒ นัดตกปีที่ when.age ผ่าน การ์ดออกตรงปีที่นัด
    const [a0, a1] = ev.when?.age ?? DRIFT_PLAN.ages;
    const from = Math.max(st.age + 1, DRIFT_PLAN.ages[0], a0), to = Math.min(DRIFT_PLAN.ages[1], a1);
    if (from <= to) st.scheduled.push({ event: ev.id, age: rng.int(from, to), drift: true });
  }
}

// ปีที่หายไปเดินด้วย stepYear ปกติ (เงิน คนในบ้าน ด่านเรียน) แต่ไม่ทอยตายและไม่จับกอง — ตัวไม่อยู่ เรื่องของปีนั้นจึงมาเป็นข่าวหลังกลับ
function tripBack(st) {
  const isk = st.trip;
  st.trip = null;
  (st.trips ??= []).push(tripLineage(isk));
  tripSettle(st, isk);
  // ตายในทริปก็เขียนกลับ — ชาติต่างโลกหลังปรโลกพกชุดนี้ต่อ
  if (st.skills) st.skills = skillsBack(st.skills, isk);
  if (!isk.home) {
    st.tripLost = true;
    st.dead = true;
    return nextCard(st);
  }
  // กลับถึงบ้าน = กลับเข้าโลกที่เคยออกไป · ทริปหลงไม่ได้กลับ จึงไม่นับ
  overlapStep(st);
  const away = isk.age - isk.trip.from;
  const c = tripCarry(isk);
  st.network = clamp(st.network + c.network);
  st.knowledge = clamp(st.knowledge + c.knowledge);
  for (let i = 0; i < isk.trip.thai; i++) stepYear(st);
  overlapPlan(st, st.trips.length);
  driftPlan(st, st.trips.length);
  // ใบตัดสินใจที่ถึงกำหนดทุกปี (เลื่อนขั้น ทบทวนเงิน ช่วงวัย) ซ้อนกันหลายใบ — เก็บใบล่าสุดของแต่ละเรื่อง ใบเก่าสร้างจากสถานะที่ไม่ใช่แล้ว
  const key = (c) => (c.kind === 'eraEvent' ? `e:${c.ev.id}` : ['alloc', 'stage', 'omen'].includes(c.kind) ? c.kind : null);
  st.due = st.due.filter((c, i) => !key(c) || !st.due.slice(i + 1).some((d) => key(d) === key(c))).map((c) => ({ ...c, age: st.age }));
  // ค่าจริงจากต่างโลก + ปีที่หายไปเขียนสุขภาพนอก choose/ขอบปี — ตัดสินเกณฑ์เตือนที่สภาพตอนกลับถึงบ้าน
  if (crossedLow(st, st.health, WARN.human)) st.due.push(warnCard(st.age, stageOf(st.age), WARN.text));
  st.away = (st.away ?? 0) + away - isk.trip.thai;
  st.advance = false;
  const when = isk.trip.thai ? `ผ่านไป ${isk.trip.thai} ปี` : 'ผ่านไปแค่ไม่กี่เดือน';
  return emit(st, { kind: 'result', type: 'B', trip: true, tag: 'trip', age: st.age, stage: stageOf(st.age), text: `ลืมตาอีกทีก็ยืนอยู่หน้าบ้านหลังเดิม ในต่างโลกคุณอยู่มา ${away} ปี แต่ที่นี่${when} คนที่บ้านนึกว่าคุณหายตัวไป` });
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
  let courtBot = null;
  for (;;) {
    const card = nextCard(st);
    onCard?.(card, st);
    if (card.kind === 'death') return { age: card.age, cards: st.cards + 1, state: st };
    // บอทที่มีนโยบายโฟกัส (ใบ 04) ตั้งโฟกัสหลังเห็นการ์ด — นโยบายสุ่มจาก stream ของตัวเอง ไม่แตะ rng ของโลก
    if (pickChoice.focus && !st.dead && !st.trip && !st.court) pickChoice.focus(st);
    // บอทที่ไม่ได้ประกาศ isekai ปฏิเสธการ์ดชวนโดยไม่ดึงเลขสุ่ม ⇒ ชีวิตเดินเท่าเดิม
    // การ์ดในทริป (B68m) ไม่มีป้ายบุญบาปแบบชีวิตไทย — บอทที่ประกาศ trip เลือกเอง ที่เหลือสุ่มตัวที่ไม่ล็อก
    if (card.court) {
      if (card.choices.length) choose(st, courtPick(card, (courtBot ??= makeRng(seed ^ 0x1f83d9ab))));
      continue;
    }
    if (card.trip && card.kind === 'isekai') {
      if (card.choices.length) choose(st, warnPick(card) >= 0 ? warnPick(card) : pickChoice.trip ? pickChoice.trip(card, bot) : tripAny(card, bot));
      // ไม่มีใบทุ่มเทเข้าช่วงวัยแล้ว (ui-redo 83) — บอทตั้งโฟกัสตาแรกของช่วงจากใบเลือกรูปเดิม เหมือนผู้เล่นเปิดแผงตัวฉัน
      else if (card.entered) {
        const fc = isekaiFocusCard(st.trip);
        isekaiFocusPick(st.trip, pickChoice.trip ? pickChoice.trip(fc, bot) : tripAny(fc, bot));
      }
      continue;
    }
    // บอทคืนเลขตัวเลือก หรือ {i, loan} เมื่อกู้มาจ่าย (B111)
    if (card.choices?.length) {
      // การ์ดย้อนความทรงจำไม่ดึงเลขบอท — งานศพหลังจากนี้เลือกเหมือนไม่มีการ์ดนี้
      const p = card.entry && !pickChoice.isekai ? ENTRY.decline : card.kind === 'memory' ? 0 : warnPick(card) >= 0 ? warnPick(card) : pickChoice(card, bot, st);
      if (typeof p === 'object') choose(st, p.i, p.loan);
      else choose(st, p);
    }
  }
}
