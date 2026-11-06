// ช่วงระหว่างชาติ (ใบ 05 · 09) + ส่งต่อรุ่นถัดไป — ลำดับตามใบ 09:
// บันทึกการตาย → ส่วนบุญ/อนุโมทนา → เทวทูต 5 → ปรโลกเปิดบัญชีชี้ปลายทาง → ทางเกิด → ภูมิปลายทาง หรือ ผีบรรพบุรุษ → ส่งต่อ 30–70% → รุ่นถัดไป
// ฉากเป็นเนื้อหา (stage ระหว่างชาติ + scene) ผ่านด่าน build ชุดเดียวกับการ์ดชีวิต · ปรโลก/ทางเกิด/ส่งต่อเป็นการ์ดที่แกนสร้าง
// ใช้ stream สุ่มของตัวเอง — ระหว่างชาติไม่กินเลขสุ่มของโลกของชีวิตใด · ชีวิตที่มี heir ดึงเลขสุ่มของโลกตำแหน่งเดียวกับชีวิตแรก (harness/lineage ตรวจ)
import { makeRng, mixSeed } from './rng.mjs';
import { pickBirthYear } from './era.mjs';
import { pickRegion, placeName, nationalIncome } from './birth.mjs';
import { newLedger, recordMerit, netLedger, SIN_CATS } from './merit.mjs';
import { goalsMet, titlesOf } from './titles.mjs';
import { heirPets, letterTo, deadKinOf } from './family.mjs';
import { CHRONIC } from './death.mjs';
import { newLife, causeWords, CLASSES, STAT_KEYS, STAT_LABELS, levelValue, whenOk, poolMultiplier, fill, reckoning, weighted, AFTERLIFE_STAGE, disputes, choiceHints, noteDeed, standingOf, funeralGuests, realAt, netWorth, lifeFocusKid, lifeGatesOpen, overlapOf, overlapStep, overlapLeftIsekai, overlapStageOf } from './life.mjs';
import { ISEKAI, ISEKAI_SKILLS, SKILL, carryPick, skillsBack, startIsekai, nextIsekaiCard, chooseIsekai, isekaiFocusCard, isekaiFocusPick, isekaiCalled, isekaiMemory, isekaiLineage, isekaiWorldLore, isekaiWorldLegends, lifeEndWord, isGone } from './isekai.mjs';
import { ladderOf } from './rank.mjs';
import { warnPick } from './warn.mjs';
import { pastOf } from './past.mjs';

// ระดับกรรมที่ปรโลก (−1..1) = บัญชีสุทธิ ÷ ref · ref แยกจากตัวคูณกรรมระหว่างชีวิต (KARMA.ref) เพราะบัญชีทั้งชีวิตสะสมไกลกว่า
// จุดอิ่มของตัวคูณการตายมาก — ใช้ ref เดียวกันแล้วเกือบทุกคนชนเพดาน ภูมิกับฐานะชาติหน้าจะไม่แยกคน
export const VERDICT_REF = 30;
export const verdictLevel = (ledger) => Math.max(-1, Math.min(1, netLedger(ledger) / VERDICT_REF));
// ภูมิปลายทาง (lore-afterlife หัวข้อ 2 ชุดที่เกมออกแบบเอง) ชี้จากบัญชีสุทธิ ณ ปรโลก — ฝ่ายใดหนักก็ไปฝ่ายนั้น
// upTo = ขอบบนของระดับกรรม · เกณฑ์เป็นค่าตั้งของเกม ไม่มีคัมภีร์ให้แปลงเป็นตัวเลข · บุญบาปเสมอ (0) ไปเกิดเป็นมนุษย์
// เทวดาตั้งสูงกว่าฝั่งบาป: เนื้อหามีทางบุญมากกว่าทางบาป บอทสุ่มจึงเอียงบวกเอง (สุทธิมัธยฐาน ~+11) — ขอบ 2/3 ให้เทวดาเหลือราวหนึ่งในสิบ
export const REALMS = [
  { id: 'hell', name: 'นรก', upTo: -0.5 },
  { id: 'peta', name: 'เปรต', upTo: -0.2 },
  { id: 'beast', name: 'ดิรัจฉาน', upTo: -0.01 },
  { id: 'human', name: 'มนุษย์', upTo: 2 / 3 },
  { id: 'deva', name: 'เทวดา', upTo: Infinity },
];
export const realmOf = (x) => REALMS.find((r) => x <= r.upTo);
// ฉากที่เนื้อหาเขียนได้ · realm/ancestor/loop แยกตามภูมิได้ด้วย field realm · loop = การ์ดปีละใบในวงปรโลก
export const SCENES = ['transfer', 'devaduta', 'realm', 'ancestor', 'loop'];
export const REALM_SCENES = ['realm', 'ancestor', 'loop'];

// วงปรโลก (03a): หลังฉากภูมิปลายทาง อยู่ในภูมิปีละ 1 การ์ด จนครบปีหรือชีวิตทิพย์หมด แล้วไปการ์ดส่งต่อ
// 4 ค่าบนจอใช้คีย์ค่าสถานะเดิม สเกล 0–100 แบบแถบชีวิต — การ์ดวงเขียน effects ชุดเดียวกับฉากอื่นได้ แต่ผลลงค่าวง ไม่ใช่ค่าเริ่มชาติหน้า
// ปีทิพย์ = base + |สุทธิ| ÷ div เพดาน cap · ชีวิตทิพย์ลดเองปีละ drain + ผลการ์ด · ปัญญาธรรม/ความผูกพันเริ่มที่ inherit × ความรู้/ความสัมพันธ์ตอนตาย
// เข้าวงเฉพาะทางเป็นลูก/เกิดใหม่ — คนถูกเรียกตัวและทางต่างโลกไปเล่นชาติต่างโลกแทน
// วงใช้ stream สุ่มของตัวเองและไม่แตะบัญชี/ค่าเริ่มชาติหน้า ⇒ ทายาทเกิดเหมือนก่อนมีวงทุกไบต์
export const LOOP = {
  base: 3,
  div: 2,
  cap: 30,
  drain: 2,
  inherit: 0.5,
  start: { hell: { health: 30, happiness: 10 }, peta: { health: 40, happiness: 25 }, beast: { health: 50, happiness: 40 }, human: { health: 60, happiness: 50 }, deva: { health: 100, happiness: 90 } },
  paths: ['child', 'reborn'],
};
export const LOOP_LABELS = { health: 'ชีวิตทิพย์', happiness: 'สุข/ทุกข์', knowledge: 'ปัญญาธรรม', relations: 'ความผูกพัน' };
export const LOOP_KEYS = Object.keys(LOOP_LABELS);
export const loopYears = (net) => Math.min(LOOP.cap, LOOP.base + Math.floor(Math.abs(net) / LOOP.div));

// ส่งต่อข้ามชาติ (ใบ 09): ฝั่งที่ชี้ปลายทางถูกหักไปส่วนหนึ่งก่อน แล้วสุ่มส่งต่อ min–max ของที่เหลือ
export const CARRY = { spend: 0.5, min: 0.3, max: 0.7 };
// ผลกรรมต่อชาติหน้า "แรงทุกทาง" (ใบ 05 — ห้ามแก้คืน): ฐานะกับค่าเริ่มคิดจากระดับบัญชีที่ปรโลก
// sd = ความกว้างของฐานะเกิดใหม่รอบจุดกลางตามกรรม · childStep = ฐานะลูกเลื่อนได้สูงสุดกี่ระดับจากกรรม
// stat = ค่าเริ่มเลื่อนสูงสุดเมื่อบัญชีสุดขั้ว · bonusCap = เพดานผลรวมจากฉากระหว่างชาติต่อค่า
// kin = ทางเป็นลูกรับความสัมพันธ์/คอนเน็คชั่นของบ้านต่อ (ใบ 05) เป็นสัดส่วนของส่วนต่างจากค่ากลาง 50 ตอนพ่อแม่ตาย เพดาน bonusCap · หลาน/เหลนคูณ KIN_TIERS.kin
export const FATE = { sd: 1.2, childStep: 3, stat: 10, bonusCap: 12, kin: 0.3 };
// ฐานะตอนตายส่งต่อรุ่นถัดไป (B95b · เจ้าของเคาะ 50/50) ทั้งทางเป็นลูกและเกิดใหม่บ้านอื่น — ผสมกับชั้นที่กรรม/สุ่มเดิมให้
// ตายพร้อมหนี้ = ชั้นล่างสุด ⇒ รุ่นถัดไปตกชั้นได้จริง · ไม่ดึงเลขสุ่มเพิ่ม (รุ่นแรกเท่า main)
export const STAND_MIX = 0.5;
const deathStanding = (st) => ((st.estate?.money ?? 0) < 0 ? 0 : standingOf(st));
// ชื่อเสียงตระกูล (B95b · เจ้าของเคาะ 4 ขั้น) — แต้มของรุ่นที่เพิ่งจบ บวกกับครึ่งหนึ่งของขั้นเดิม ปัดครึ่งลง (ปัดขึ้นแล้วขั้น 1 ไม่จางเลย) ⇒ ไม่ทำอะไรต่อสองสามรุ่นก็จางเอง
// office = แต้มตามตำแหน่งสูงสุดที่เคยได้ (ผู้ใหญ่บ้าน กำนัน นายก อบต. ส.ส. นายกฯ) · rich = ฐานะตอนตายตั้งแต่ระดับ 8 (index 7) · guests = แขกงานศพที่นับว่างานใหญ่ · network = คอนเน็คชั่นตั้งต้นของทายาทต่อขั้น
export const FAME = { names: ['ไร้ชื่อ', 'มีหน้ามีตา', 'ผู้มีบารมีในถิ่น', 'ตระกูลใหญ่'], decay: 0.5, rich: 7, guests: 300, network: 5, office: [0, 0, 1, 2, 3] };
export const famePoints = (st, death) => (FAME.office[st.officeTop ?? -1] ?? 0) - (st.flags?.caught_fraud ? 1 : 0) + (death >= FAME.rich ? 1 : 0) + (funeralGuests(st) >= FAME.guests ? 1 : 0) - (st.bankruptcies > 0 ? 1 : 0) - ((st.estate?.money ?? 0) < 0 ? 1 : 0);
export const nextFame = (st, death) => Math.max(0, Math.min(FAME.names.length - 1, Math.ceil((st.fame ?? 0) * FAME.decay + famePoints(st, death) - 0.5)));
const mixStanding = (death, fate) => clampIdx(Math.round(STAND_MIX * death + (1 - STAND_MIX) * fate));
// มรดก (ใบ 05 · lore-finance-belief): แบ่งตามจำนวนลูก · ภาษีการรับมรดก 5% ส่วนที่เกิน 100 ล้าน ตั้งแต่ปีที่กฎหมายมีผล
// จำนวนลูกเป็นค่าตั้งของเกม — ธง has_kids ไม่ได้บอกว่ากี่คน
// dispute = ส่วนของมรดกที่เสียไปกับการทะเลาะแบ่งกันเองเมื่อไม่มีพินัยกรรม (B25 · ค่าตั้งของเกม)
export const LEGACY = { kids: 2, taxFrom: 100e6, tax: 0.05, taxYear: 2559, richUnits: [10, 40], dispute: 0.1 };
// ทางในตระกูล (B18): เกิดเป็นลูก/หลาน/เหลน ยิ่งห่างสายเลือดยิ่งได้ต่อน้อย — ค่าตั้งของเกม
// w = น้ำหนักสุ่มชั้น · carry คูณสัดส่วนส่งต่อบุญบาป (ลูก 1 = กรอบ CARRY เดิม) · kin คูณความสัมพันธ์/คอนเน็คชั่นของบ้าน
// legacy คูณมรดกต่อหัว: หลานได้ส่วนของพ่อแม่ที่แบ่งต่อให้ลูก LEGACY.kids คนอีกทอด เหลนอีกทอด
export const KIN_TIERS = [
  { tier: 1, name: 'ลูก', w: 6, carry: 1, kin: 1, legacy: 1 },
  { tier: 2, name: 'หลาน', w: 3, carry: 0.75, kin: 0.6, legacy: 1 / LEGACY.kids },
  { tier: 3, name: 'เหลน', w: 1, carry: 0.5, kin: 0.3, legacy: 1 / LEGACY.kids ** 2 },
];
export const kinTier = (n) => KIN_TIERS[(n ?? 1) - 1];
// ช่วงห่างรุ่น = อายุแม่ตอนคลอดช่วงเดียวกับ newLife
const GEN_GAP = [18, 40];

const clampIdx = (i) => Math.max(0, Math.min(CLASSES.length - 1, i));
const gauss = (rng) => Math.sqrt(-2 * Math.log(1 - rng.next())) * Math.cos(2 * Math.PI * rng.next());

export function startAfterlife(st) {
  if (!st.dead) throw new Error('ยังไม่ตาย เข้าระหว่างชาติไม่ได้');
  return {
    st,
    rng: makeRng(st.seed ^ 0x1b873593),
    botRng: makeRng(st.seed ^ 0x2545f491),
    // เซฟก่อนมีวงเก็บ steps ชุดเดิม (ไม่มี loop) ⇒ โหลดแล้วเล่นแบบเดิมจนเกิด
    steps: ['transfer', 'devaduta', 'verdict', 'path', 'scene', 'loop', 'carry'],
    i: 0,
    loop: null,
    queue: [],
    pending: null,
    bonus: {},
    verdict: null,
    path: null,
    heir: null,
    cards: 0,
    // ต่างโลก (B68): ชีวิตที่กำลังเล่น · แถว lineage ของชีวิตต่างโลกที่จบแล้ว · เทพธิดาโผล่เอง/ตายแบบต่างโลก = ได้ของแถม
    isekai: null,
    isekaiLives: [],
    blessed: isekaiCalled(st),
    // ชาติต่างโลกล่าสุดที่จบแล้ว (รอบปรโลกของชาตินั้น) · คำตัดสินของชาติไทย — แถวชาติไทยในผังตระกูลบันทึกภูมิของชาติไทย
    from: null,
    thaiVerdict: null,
  };
}

// ลูกหลานที่ยังอยู่ตอนตาย (B36a) — state ก่อนมีระบบครอบครัว (ไม่มี kin) ใช้ธงเดิม
const livingKin = (st, role) => (st.kin ?? []).filter((m) => m.role === role && m.alive);
const hasKids = (st) => (st.kin ? livingKin(st, 'child').length + livingKin(st, 'grandchild').length > 0 : !!st.flags.has_kids);

// ผู้สืบสายเลือดที่เล่นต่อได้ (B76): ลูก/หลานที่ยังอยู่ อายุจริงปีที่ตายอยู่ในช่วง · หน้าเลือกคนของต่างโลก (isekai ใบ 21) ใช้รายชื่อชุดเดียวกัน
// เรียงตามลำดับในบ้าน (เกิดก่อนก่อน) ไม่ดึงเลขสุ่ม · state ก่อนมีระบบครอบครัว (ไม่มี kin) = ไม่มีรายชื่อ
export const HEIR_AGE = [16, 22];
export function heirCandidates(st) {
  const year = st.birthYear + st.age;
  return (st.kin ?? [])
    .filter((m) => (m.role === 'child' || m.role === 'grandchild') && m.alive)
    .map((m) => ({ id: m.id, name: m.name, sex: m.sex, role: m.role, age: year - m.born }))
    .filter((m) => m.age >= HEIR_AGE[0] && m.age <= HEIR_AGE[1]);
}

// ฉากของช่วงที่ 7: เนื้อหาที่ตรงเงื่อนไขของผู้ตาย สุ่มตามน้ำหนัก · ด่าน afterlife-coverage รับประกันว่ามีใบไม่มีเงื่อนไขเสมอ
function pickScene(af, scene, rng = af.rng) {
  const realm = af.verdict?.realm.id;
  const pool = af.st.content.events.filter((e) => e.stage === AFTERLIFE_STAGE && e.scene === scene && (!e.realm || e.realm.includes(realm)) && whenOk(af.st, e.when));
  if (!pool.length) throw new Error(`ไม่มีฉาก ${scene} ที่ออกได้ (ภูมิ ${realm})`);
  return weighted(rng, pool, pool.map((e) => (e.weight ?? 1) * poolMultiplier(af.st, e.multipliers)));
}

// ผลของฉากระหว่างชาติต่อค่าสถานะ = ค่าเริ่มของชาติหน้า · บุญบาปไม่ขึ้นป้ายเหมือนการ์ดชีวิต
function afterFx(c) {
  const fx = Object.entries(c.effects ?? {}).filter(([k]) => STAT_KEYS.includes(k));
  const out = fx.map(([k, v]) => `ชาติหน้า ${STAT_LABELS[k]}\u00a0${v > 0 ? '↑' : '↓'}`);
  if (c.outcomes?.length) out.push('?');
  return out.join(' · ');
}

function emitAfter(af, card) {
  af.cards++;
  return { stage: AFTERLIFE_STAGE, ...card };
}

function sceneCard(af, ev) {
  af.pending = ev.choices.length ? ev : null;
  return emitAfter(af, {
    kind: 'scene',
    id: ev.id,
    type: 'B',
    scene: ev.scene,
    title: ev.title ? fill(ev.title, af.st) : null,
    text: fill(ev.text, af.st),
    choices: ev.choices.map((c) => fill(c.text, af.st)),
    ...choiceHints(ev, af.st),
    fx: ev.choices.map(afterFx),
  });
}

// สกิลที่ชีวิตไทยนี้ลงคลังได้ (06s) จากตาราง content.skillMap — อ่านอย่างเดียว ไม่ดึงเลขสุ่ม
// ตารางว่างไม่คำนวณแหล่งเลย ⇒ เนื้อยังไม่จ่ายก็เดินเท่าเดิม · เรียงตามลำดับ ISEKAI_SKILLS ให้การ์ดเหมือนกันทุกเครื่อง
export function thaiEarn(st) {
  const map = st.content.skillMap;
  if (!map || Object.values(map).every((m) => !Object.keys(m).length)) return [];
  const t = titlesOf(st);
  const chain = st.content.focus?.chain_years ?? Infinity;
  const src = {
    job: st.occupation ? [st.occupation] : [],
    title: t.titles.map((x) => x.id),
    pattern: t.pattern ? [t.pattern.id] : [],
    cause: isGone(st) || !st.cause ? [] : [st.cause],
    goal: goalsMet(st, (st.estate?.money ?? 0) < 0),
    focus: Object.keys(st.focusYears ?? {}).filter((id) => st.focusYears[id] >= chain),
    lifeGoal: [],
  };
  const got = new Set(Object.entries(src).flatMap(([k, ids]) => ids.flatMap((id) => map[k]?.[id] ?? [])));
  return Object.keys(ISEKAI_SKILLS).filter((id) => got.has(id)).map((id) => ({ id, name: ISEKAI_SKILLS[id].name, lv: 1 }));
}

function verdictCard(af) {
  const ledger = af.st.ledger;
  const x = verdictLevel(ledger);
  const realm = realmOf(x);
  // กำหนดเวลาในภูมิ (ใบ 02: โทษมีกำหนดเวลา) เป็นสีสันของการ์ด — เวลานรกเทียบเวลามนุษย์ไม่ได้ จึงไม่ผูกปีเกิดชาติหน้า
  // รอบที่มีวงต่อ (steps มี loop) กำหนดเท่าปีทิพย์ที่จะเล่นจริง — คำบนการ์ดกับจำนวนปีในวงต้องตรงกัน
  const loops = af.steps.includes('loop') && !af.st.flags?.isekai_call;
  const term = loops ? loopYears(netLedger(ledger)) : realm.id === 'human' ? 0 : Math.max(1, Math.round(Math.abs(netLedger(ledger)) * 10));
  af.verdict = { x, net: netLedger(ledger), realm, term };
  af.thaiVerdict ??= af.verdict;
  const where = loops ? (realm.id === 'human' ? `รอเกิดเป็นมนุษย์อีก ${term} ปีทิพย์` : `ไปภูมิ${realm.name} กำหนด ${term} ปีทิพย์`) : realm.id === 'human' ? 'ไปเกิดเป็นมนุษย์ทันที ไม่ต้องรอ' : `ไปภูมิ${realm.name} กำหนด ${term} ปีของภูมินั้น`;
  const back = af.from ? `ดวงวิญญาณของ${af.from.name}ถูกดึงกลับจากต่างโลกมายืนหน้าปรโลกอีกครั้ง ` : '';
  // ชาติต่างโลกให้สกิลบนการ์ดจบของมันแล้ว — ตอนกลับมาปรโลกจึงไม่ให้ซ้ำจากชีวิตไทยเดิม
  const earn = af.from ? [] : thaiEarn(af.st);
  return emitAfter(af, {
    kind: 'verdict',
    type: 'B',
    realm: realm.name,
    text: `${back}เทวดาผู้ถือบัญชีชักบุญกับบาปมาดูทั้งสองฝ่าย ฝ่ายใดหนักก็ไปฝ่ายนั้น พญายมชี้ว่า${where}`,
    reckoning: reckoning(ledger),
    note: 'กติกาแฟนตาซีของเกม ได้แรงบันดาลใจจากไตรภูมิพระร่วงและคติไทย',
    ...(earn.length && { earn }),
    choices: [],
  });
}

// ทางเกิด (ใบ 05): เป็นลูก (รับมรดกต่อ · ผีบรรพบุรุษเฝ้า) หรือเกิดใหม่ตามกรรม · ไม่มีลูกยังเล่นต่อได้ทางเกิดใหม่
// การ์ดนี้เป็นทางแยกของเกม ไม่ใช่เหตุการณ์ จึงไม่ต้องมี 4 ตัวเลือกตามกติกาเนื้อหา · ทางที่ 3 ต่างโลก (B68) เลือกได้เสมอ
export const PATHS = [
  { id: 'child', text: 'เฝ้าลูกหลาน แล้วกลับมาเกิดในตระกูลเดิม เป็นลูก หลาน หรือเหลน' },
  { id: 'reborn', text: 'ไปตามกรรม แล้วเกิดใหม่ที่ไหนก็ได้' },
  { id: 'isekai', text: 'ตามเทพธิดาต่างโลกไปเกิดในโลกแฟนตาซีก่อน' },
  // B76: ต่อท้ายเสมอ ดัชนีทางเดิมจึงไม่ขยับ · ขึ้นเฉพาะเมื่อมีรายชื่อ ไม่มี = การ์ดเท่าเดิมทุกไบต์
  { id: 'blood', text: 'เล่นต่อเป็นผู้สืบสายเลือด' },
];
// กลับจากต่างโลก: ลูกหลานชาติไทยห่างไปหลายรุ่นแล้ว จึงกลับได้ทางตามกรรมเท่านั้น · ทางที่ 3 = อยู่ต่างโลกต่อ ติดเพดานชาติติดกัน
const FROM_ISEKAI_PATHS = {
  child: 'เฝ้าลูกหลานในโลกเดิม',
  reborn: 'กลับโลกเดิม ไปเกิดเป็นคนตามกรรม',
  isekai: 'อยู่ต่างโลกต่อ ให้เทพธิดาส่งไปเกิดอีกรอบ',
};
const pathLocked = (af, id) => {
  if (id === 'child') return af.from ? 'ลูกหลานในโลกเดิมห่างไปหลายรุ่นแล้ว' : hasKids(af.st) ? null : 'ไม่มีลูกหลานให้กลับไปเกิด';
  if (id === 'isekai' && af.from && af.from.run >= ISEKAI.stay) return 'เทพธิดาบอกว่าวิญญาณนี้อยู่ต่างโลกนานพอแล้ว';
  if (id === 'blood' && !pathHeirs(af).length) return 'ไม่มีลูกหลานวัยที่เล่นต่อได้';
  return null;
};
// กลับจากต่างโลก = ลูกหลานห่างไปหลายรุ่นแล้ว ไม่มีรายชื่อ
const pathHeirs = (af) => (af.from ? [] : heirCandidates(af.st));
function pathCard(af) {
  const heirs = pathHeirs(af);
  const paths = PATHS.filter((p) => p.id !== 'blood' || heirs.length);
  af.pending = { path: true, choices: paths.map(() => ({ merit: [] })) };
  const base = af.from
    ? 'เทพธิดาต่างโลกยืนรออยู่ข้างพญายม ถามว่าจะกลับไปเกิดในโลกเดิม หรือจะไปต่างโลกอีกรอบ'
    : hasKids(af.st) ? 'ก่อนไปตามคำตัดสิน ดวงวิญญาณเลือกได้ว่าจะกลับไปใกล้ลูกหลาน หรือปล่อยวางแล้วไปเกิดตามกรรม' : 'ไม่มีลูกหลานให้เฝ้า ดวงวิญญาณไปเกิดตามกรรม';
  return emitAfter(af, {
    kind: 'path',
    type: 'B',
    text: af.blessed && !af.from ? `${base} · มีหญิงผมสีเงินยืนโบกมือรออยู่ข้างทาง บอกว่าเป็นเทพธิดาจากอีกโลกหนึ่ง` : base,
    choices: paths.map((p) => (af.from ? FROM_ISEKAI_PATHS[p.id] : p.text)),
    locked: paths.map((p) => pathLocked(af, p.id)),
    // ปุ่มสายเลือดคนกดได้ บอทไม่กด (openChoices) · หน้าเลือกคนอ่าน heirs แล้วส่ง id กลับทาง chooseAfter
    ...(heirs.length && { manual: paths.map((p) => p.id === 'blood'), heirs }),
  });
}

// การ์ดเปิดชีวิตของรุ่นถัดไปเล่าคำเดียวกัน — ผู้เล่นเห็นสองใบตรงกัน
// คำบอกขนาดบุญ+บาปที่ส่งต่อจริง (B137) ไม่ใช่สัดส่วนที่สุ่ม — สัดส่วนสูงของบัญชีว่างยังเท่ากับไม่มีอะไรติดตัว
// เกณฑ์วางให้ชีวิตทั่วไปตกช่วงกลาง (วัด 300 ชีวิตบอทสุ่ม: p25 ≈ 10 · p50 ≈ 14 · p75 ≈ 18) · เซฟเก่าไม่มี kept ใช้คำตามสัดส่วนแบบเดิม
export const CARRY_WORDS = [[1, 'แทบไม่มี'], [8, 'น้อย'], [18, 'พอประมาณ']];
export const carryAmount = (h) => (h.kept === undefined ? (h.carried >= 0.55 ? 'มาก' : h.carried >= 0.45 ? 'พอประมาณ' : 'น้อย') : (CARRY_WORDS.find(([cut]) => h.kept < cut)?.[1] ?? 'มาก'));

function carryCard(af) {
  const r = CARRY.min + af.rng.next() * (CARRY.max - CARRY.min);
  af.heir = makeHeir(af, r);
  const h = af.heir;
  const amount = carryAmount(h);
  const who = af.path === 'blood' ? `เล่นต่อเป็น${h.name} ${kinTier(h.tier).name}อายุ ${h.start.age} ปี` : af.path === 'child' ? `กลับมาเกิดเป็น${kinTier(h.tier).name}ของตัวเอง` : af.from ? 'กลับจากต่างโลกมาเกิดใหม่' : 'ไปเกิดใหม่';
  return emitAfter(af, {
    kind: 'carry',
    type: 'B',
    text: `ก่อนดื่มน้ำลืมชาติ พญายมแจ้งว่ากรรมที่ติดตัวไปครั้งนี้${amount} · ${who} เป็น${h.sex} ฐานะ${h.cls}`,
    lineage: lineageText(h.lineage),
    note: 'กติกาแฟนตาซีของเกม ได้แรงบันดาลใจจากไตรภูมิพระร่วงและคติไทย',
    choices: [],
    done: true,
  });
}

// ผังตระกูล (ใบ 05: เลิกเมื่อไรก็ดูได้) — หน้าจอวาดระหว่างชีวิตจาก st.lineage และบนการ์ดส่งต่อ
export const lineageText = (lineage) => lineage.map((l) => l.isekai ? `รุ่นที่ ${l.gen} · ${l.name} · ต่างโลก (${l.world}) · ${l.ending}` : `รุ่นที่ ${l.gen} · ${l.name ? `${l.name} · ` : ''}${l.sex} · ${l.province ? `${placeName(l.province)} · ` : ''}ฐานะ${l.cls} · ${lifeEndWord(l.gone)} ${l.age} · ไปภูมิ${l.realm}${l.path === 'child' ? ` · กลับมาเกิดเป็น${kinTier(l.tier).name}` : l.path === 'blood' ? ` · เล่นต่อเป็น${kinTier(l.tier).name}` : ''}${l.trips?.some((t) => t.home) ? ` · เคยไปต่างโลกแล้วกลับมา ${l.trips.filter((t) => t.home).length} ครั้ง` : ''}`);

// ชาติต่างโลกจบ (การ์ดตอนจบออกไปแล้ว): ลงผังตระกูลเป็นรุ่นของตัวเอง แล้วเปิดปรโลกรอบใหม่ให้ชาตินั้น
// ยมทูต/เทวทูตเป็นฉากของชีวิตไทย (เนื้อหาอ่านค่าชาติไทย) จึงเริ่มที่คำตัดสิน
function closeIsekai(af) {
  const isk = af.isekai;
  af.isekaiLives.push(isekaiLineage(isk, (af.st.gen ?? 1) + 1 + af.isekaiLives.length));
  // บัญชีเดียวของดวงวิญญาณ (B26 · B68a-2): ชาติต่างโลกที่จบแล้วเขียนกลับลง af.st.ledger ปรโลกรอบใหม่และบันทึกการกระทำ (noteDeed) จึงอ่านที่เดียวกัน
  af.st.ledger = isk.ledger;
  // ขั้นที่อัปในชาตินี้ติดไปชาติต่างโลกถัดไป (sendToIsekai อ่าน af.st.skills)
  if (af.st.skills) af.st.skills = skillsBack(af.st.skills, isk);
  af.from = { name: isk.name, run: isk.run, memory: isekaiMemory(isk), real: isk.real };
  af.isekai = null;
  af.path = null;
  af.steps = ['verdict', 'path', 'scene', 'carry'];
  af.i = 0;
}

// ส่งดวงวิญญาณไปต่างโลก: กรรมที่ติดตัวไปคิดแบบเดียวกับการเกิดใหม่ (หักฝั่งที่ชี้ปลายทาง แล้วสุ่มสัดส่วน) — ไปต่างโลกไม่ใช่ทางลบบาป
// ถูกเรียกแล้วหายตัวไปทั้งร่าง (B173) ไม่ได้ตายแล้วเกิดใหม่ จึงพกบัญชีไปทั้งก้อนแบบทริป · ยังดึงเลขสุ่มเท่าเดิมให้ทางอื่นเดินตรงกับก่อนแก้
function sendToIsekai(af) {
  const r = CARRY.min + af.rng.next() * (CARRY.max - CARRY.min);
  const prev = af.from;
  // เข้าต่างโลกครั้งแรกของรอบปรโลกนี้ (เกิด/ถูกเรียก) ขณะตระกูลเคยออกจากต่างโลกมาแล้ว = กลับเข้าโลกเดิม · รอบต่อเนื่อง (prev) ยังไม่ได้ออก
  if (!prev && overlapLeftIsekai(af.st)) overlapStep(af.st);
  // ชาติต่างโลกที่จบแล้ว (prev) ตายจริงในโลกนั้น — ธงของชาติไทยยังติดอยู่ จึงต้องกันไว้ ไม่ให้รอบถัดไปพกทั้งก้อนด้วย
  const whole = !prev && !!af.st.flags?.isekai_call && isGone(af.st);
  af.isekai = startIsekai({
    seed: af.st.seed,
    karma: af.verdict.x,
    past: af.st.name,
    ledger: whole ? af.st.ledger : carryLedger(af.st.ledger, af.verdict.net, r),
    blessed: !prev && af.blessed,
    fated: !prev && !!af.st.flags?.isekai_call,
    run: prev ? prev.run + 1 : 0,
    memory: prev?.memory ?? null,
    // ค่าโลกจริงตอนข้าม (B100) — รอบต่างโลกติดกันใช้ค่าจริงที่สะท้อนมาจากรอบก่อน
    real: prev?.real ?? realAt(af.st),
    hints: af.st.content.nearHints,
    // ชุดที่พกตอนเกิดชีวิตไทยนี้ ใช้ต่อทุกชาติต่างโลกที่ตามมาจนเกิดใหม่ (06s)
    carry: af.st.skills ?? [],
    // โลกจำของที่ชาติต่างโลกก่อน ๆ ทั้งเซฟสร้างไว้ (B68h) — รวมชาติที่เพิ่งจบในช่วงนี้ซึ่งยังไม่ลงผังของชาติไทย
    // ทริปไปกลับของชาตินี้ (B68m) ยังไม่ลงผัง — ส่งเป็นแถวชั่วคราว
    lore: isekaiWorldLore([...(af.st.lineage ?? []), { trips: af.st.trips }, ...af.isekaiLives]),
    // คนต่างโลกรุ่นก่อนที่ดังพอให้โลกจำชื่อ (B68i) — อ่านแถวชุดเดียวกับโลกจำ
    legends: isekaiWorldLegends([...(af.st.lineage ?? []), { trips: af.st.trips }, ...af.isekaiLives]),
    overlapStage: overlapStageOf(af.st),
  });
}

const clamp100 = (v) => Math.max(0, Math.min(100, v));

function startLoop(af) {
  const st = af.st;
  const realm = af.verdict.realm.id;
  const half = (k) => Math.round(clamp100(st[k] ?? 50) * LOOP.inherit);
  return { rng: makeRng(st.seed ^ 0x3c6ef372), realm, year: 0, years: loopYears(af.verdict.net), ...LOOP.start[realm], knowledge: half('knowledge'), relations: half('relations'), cards: 0, end: null };
}
const loopOver = (l) => l.year >= l.years || l.health <= 0;

// การ์ดในวงไม่นับใน af.cards (เหมือนการ์ดต่างโลก) — ความยาววงขึ้นกับปีทิพย์ แยกจากด่านความยาวฉากระหว่างชาติ
// ทุกใบพกค่าวงตอนนั้นไปให้จอวาดแถบ · year = ปีของใบนั้น (การ์ดปีใหม่ = ปีที่กำลังเล่น · การ์ดผล/จบวง = ปีที่เพิ่งผ่าน)
function loopEmit(af, card) {
  const l = af.loop;
  l.cards++;
  const { rng, cards, ...view } = l;
  return { stage: AFTERLIFE_STAGE, ...card, loop: { ...view, year: card.kind === 'scene' ? l.year + 1 : l.year } };
}

function loopFx(c) {
  const out = Object.entries(c.effects ?? {}).filter(([k]) => LOOP_KEYS.includes(k)).map(([k, v]) => `${LOOP_LABELS[k]} ${v > 0 ? '↑' : '↓'}`);
  if (c.outcomes?.length) out.push('?');
  return out.join(' · ');
}

function loopCard(af) {
  const ev = pickScene(af, 'loop', af.loop.rng);
  af.pending = ev;
  return loopEmit(af, {
    kind: 'scene',
    id: ev.id,
    type: 'B',
    scene: 'loop',
    title: ev.title ? fill(ev.title, af.st) : null,
    text: fill(ev.text, af.st),
    choices: ev.choices.map((c) => fill(c.text, af.st)),
    ...choiceHints(ev, af.st),
    fx: ev.choices.map(loopFx),
  });
}

function loopEndCard(af) {
  const l = af.loop;
  l.end = l.health <= 0 ? 'spent' : 'served';
  const text = l.end === 'spent'
    ? `ชีวิตทิพย์หมดลงในปีที่ ${l.year} ก่อนครบกำหนด ${l.years} ปี ดวงวิญญาณจึงถูกพาไปรอเกิดเร็วกว่าที่ชี้ไว้`
    : `ครบกำหนด ${l.years} ปีทิพย์ในภูมิ${af.verdict.realm.name} ดวงวิญญาณถูกพาไปรอเกิด`;
  return loopEmit(af, { kind: 'loopEnd', type: 'B', text, choices: [] });
}

function addLoop(l, fx = {}) {
  for (const k of LOOP_KEYS) if (fx[k]) l[k] = clamp100(l[k] + levelValue(fx[k]));
}

// ผลในวงลงค่าวงอย่างเดียว · ป้ายบุญบาปบนการ์ดวงเป็น neutral (ด่าน lint) จึงไม่ลงบัญชี · ปีเดินหลังผลการ์ด
function chooseLoop(af, ev, idx) {
  const c = ev.choices[idx];
  if (!c) throw new Error('ตัวเลือกไม่ถูกต้อง');
  af.pending = null;
  const l = af.loop;
  addLoop(l, c.effects);
  const o = c.outcomes?.length ? weighted(l.rng, c.outcomes, c.outcomes.map((x) => x.weight * poolMultiplier(af.st, x.multipliers))) : null;
  if (o) addLoop(l, o.effects);
  l.health = clamp100(l.health - LOOP.drain);
  l.year++;
  if (o?.text) af.queue.push({ kind: 'result', type: 'B', text: fill(o.text, af.st), choices: [], loop: true, tag: 'afterlife', evId: ev.id });
}

// การ์ดถัดไปของช่วงที่ 7 · การ์ด carry (done) เป็นใบสุดท้าย แล้วผู้เรียกต่อ nextLife
export function nextAfterCard(af) {
  if (af.pending) throw new Error('ยังมีการ์ดที่รอเลือก');
  if (af.isekai?.ending) closeIsekai(af);
  // การ์ดต่างโลกไม่นับใน af.cards — ความยาวช่วงที่ 7 (ด่าน lineage) วัดเฉพาะการ์ดระหว่างชาติ
  if (af.isekai) return { stage: AFTERLIFE_STAGE, ...nextIsekaiCard(af.isekai) };
  if (af.queue.length) {
    const q = af.queue.shift();
    return q.loop ? loopEmit(af, q) : emitAfter(af, q);
  }
  const step = af.steps[af.i++];
  if (step === 'loop') {
    if (!LOOP.paths.includes(af.path)) return nextAfterCard(af);
    af.loop ??= startLoop(af);
    if (loopOver(af.loop)) return loopEndCard(af);
    // ค้างที่ขั้นวงจนจบวง — เซฟกลางวงเก็บ i ชี้ขั้นนี้
    af.i--;
    return loopCard(af);
  }
  if (step === 'transfer' || step === 'devaduta') return sceneCard(af, pickScene(af, step));
  if (step === 'verdict') return verdictCard(af);
  // กดรับการ์ดชวนในชีวิต (B68d) = ถูกเรียกไปแล้ว ไม่มีการ์ดเลือกทางเกิด
  if (step === 'path' && af.st.flags?.isekai_call && !af.from) {
    af.path = 'isekai';
    sendToIsekai(af);
    return nextAfterCard(af);
  }
  if (step === 'path') return pathCard(af);
  if (step === 'scene') return sceneCard(af, pickScene(af, af.path === 'child' ? 'ancestor' : 'realm'));
  if (step === 'carry') return carryCard(af);
  throw new Error('ระหว่างชาติจบแล้ว — ต่อด้วย nextLife');
}

function addBonus(af, fx = {}) {
  for (const k of STAT_KEYS) if (fx[k]) af.bonus[k] = Math.max(-FATE.bonusCap, Math.min(FATE.bonusCap, (af.bonus[k] ?? 0) + levelValue(fx[k])));
}

// heirId = คนที่เลือกจากรายชื่อ card.heirs (เฉพาะปุ่มสายเลือด)
export function chooseAfter(af, idx, heirId = null) {
  if (af.isekai) return chooseIsekai(af.isekai, idx);
  const p = af.pending;
  if (p?.path) {
    const path = idx < p.choices.length ? PATHS[idx] : null;
    if (!path || pathLocked(af, path.id)) throw new Error('ตัวเลือกไม่ถูกต้อง');
    if (path.id === 'blood') {
      if (!pathHeirs(af).some((m) => m.id === heirId)) throw new Error('ต้องเลือกคนจากรายชื่อผู้สืบสายเลือด');
      af.blood = heirId;
    }
    af.pending = null;
    af.path = path.id;
    if (path.id === 'isekai') sendToIsekai(af);
    return;
  }
  if (p?.scene === 'loop') return chooseLoop(af, p, idx);
  const c = p?.choices[idx];
  if (!c) throw new Error('ตัวเลือกไม่ถูกต้อง');
  af.pending = null;
  // บุญบาปในช่วงที่ 7 เข้าบัญชีเดิม: ก่อนปรโลก = เปลี่ยนคำตัดสิน · หลังปรโลก = เปลี่ยนส่วนที่ส่งต่อ (ใบ 09 แก้เพิ่ม)
  // อายุ null = ทำหลังตาย หน้าจอเรียกตามนั้น
  const text = fill(c.text, af.st);
  noteDeed(af.st, text, () => recordMerit(af.st.ledger, c.merit, p.id), null);
  addBonus(af, c.effects);
  if (!c.outcomes?.length) return;
  const o = weighted(af.rng, c.outcomes, c.outcomes.map((x) => x.weight * poolMultiplier(af.st, x.multipliers)));
  noteDeed(af.st, text, () => recordMerit(af.st.ledger, o.merit, p.id), null);
  addBonus(af, o.effects);
  if (o.text) af.queue.push({ kind: 'result', type: 'B', text: fill(o.text, af.st), choices: [], tag: 'afterlife', evId: p.id });
}

// ส่งต่อบัญชี: ฝั่งที่ชี้ปลายทางถูกหัก spend × |สุทธิที่ปรโลก| (ไม่ติดลบ) แล้วคูณ r ทั้งสองฝั่งและทุกหมวด
// คำบนที่ผิด (broken) ไม่ส่งต่อ — ผูกกับชีวิตที่บน
// หมวดใน FULL_CARRY ไม่คูณ r — บาปสัญญากับมาร (B156) ต้องตามทุกชาติจนชดใช้ จางได้ทางส่วน spend เท่านั้น
export const FULL_CARRY = ['mara_pact'];
export function carryLedger(ledger, net, r) {
  const keep = { merit: ledger.merit, sin: ledger.sin };
  const side = net >= 0 ? 'merit' : 'sin';
  keep[side] = Math.max(0, keep[side] - Math.abs(net) * CARRY.spend);
  const out = newLedger();
  out.merit = keep.merit * r;
  out.sin = keep.sin * r;
  for (const [id, v] of Object.entries(ledger.byCat)) {
    const s = SIN_CATS.includes(id) ? 'sin' : 'merit';
    const f = ledger[s] ? keep[s] / ledger[s] : 0;
    const full = FULL_CARRY.includes(id);
    if (v * f * (full ? 1 : r)) out.byCat[id] = v * f * (full ? 1 : r);
    if (full) out[s] += v * f * (1 - r);
  }
  return out;
}

// มรดกต่อลูกหนึ่งคน เป็นจำนวนเท่าของรายได้ครัวเรือนทั้งปีของทั้งประเทศตอนตาย — ชีวิตลูกเดินเงินเฟ้อคนละชุด (seed ต่างกัน)
// จึงส่งต่อเป็นสัดส่วนของรายได้ แล้วแปลงกลับเป็นบาทในปีที่ลูกได้รับ · ทรัพย์สุทธิติดลบ = หนี้ไม่ตกถึงลูก (ป.พ.พ. ม.1601)
// kids = จำนวนลูกที่ยังอยู่จริง (B36a) · ไม่รู้จำนวน (harness/state เก่า) ใช้ LEGACY.kids
export function legacyUnits(st, kids = LEGACY.kids) {
  const e = st.estate;
  if (!e || e.money <= 0) return 0;
  let share = e.money / Math.max(1, kids);
  // ผ่านฉากงานศพแล้วไม่ได้ทำพินัยกรรม และมีลูกพอจะแบ่งกันเอง — ตายตอนเด็ก/ลูกคนเดียวไม่หัก
  if (st.funeral && !st.flags?.wish_will && disputes(st)) share *= 1 - LEGACY.dispute;
  if (e.year >= LEGACY.taxYear && share > LEGACY.taxFrom) share -= (share - LEGACY.taxFrom) * LEGACY.tax;
  return share / (nationalIncome(st.content.era, st.seed, e.year) * 12);
}

// อายุตอนมีลูกคนแรก: อายุที่ธง has_kids ติด · ไม่มีบันทึก (เนื้อหาเก่า) ใช้ 28 ตามค่ากลางที่เกมตั้ง
const KID_AGE_DEFAULT = 28;

const otherSex = (sex) => (sex === 'ชาย' ? 'หญิง' : 'ชาย');
// คู่ของพ่อ/แม่สายเลือด: ฝ่ายชายแก่กว่าได้ถึง 8 ปี (แบบพ่อแม่ใน newLife)
const spouseAge = (rng, sex, age) => (sex === 'หญิง' ? age + rng.int(0, 8) : Math.max(18, age - rng.int(0, 8)));
// รุ่นก่อนในฐานะญาติของผู้เล่นใหม่ — หลานเรียกตามฝั่งของพ่อแม่ที่เป็นสายเลือด
const elderWord = (tier, linkSex, sex) => (tier === 3 ? 'ทวด' : tier === 1 ? (sex === 'หญิง' ? 'แม่' : 'พ่อ') : linkSex === 'หญิง' ? (sex === 'หญิง' ? 'ยาย' : 'ตา') : sex === 'หญิง' ? 'ย่า' : 'ปู่');

// พ่อ/แม่ของรุ่นถัดไปที่ชะตารู้แล้ว (diesAt) พาสาเหตุไปด้วย (B110 ชิ้น 2) — ลูกได้ประวัติครอบครัวและการ์ดรู้ว่าป่วยปีเดียวกับที่ชาติก่อนรู้
// ผู้เล่นรุ่นก่อนหายไปต่างโลก = ไม่มีศพ ไม่มีสาเหตุ · เซฟเก่าไม่มีอายุที่รู้ ใช้ปีก่อนตาย
const illOf = (cause, age, from) => (CHRONIC.includes(cause) ? { ill: { cause, age, from } } : {});
const deathOf = (st) => (isGone(st) ? { gone: true } : { cause: st.cause ?? 'other', ...illOf(st.cause, st.age, st.terminal?.cause === st.cause ? (st.terminal.toldAge ?? st.age - 1) : st.age) });
const kinDeathOf = (m) => (m.cause ? { cause: m.cause, ...illOf(m.cause, m.diedAge, m.ill?.cause === m.cause ? (m.ill.toldAt ?? m.diedAge - 1) : m.diedAge) } : {});

// ธงที่ทายาททางสายเลือดได้รู้จากรุ่นก่อน — allow-list ตามหมวด heir: ของทะเบียน (ธงอื่นเป็นเรื่องส่วนตัวของรุ่นก่อน) · เพดานชั้นต่อธง
// ไม่ดึงเลขสุ่ม: ไม่มีการ์ดอ่าน parent_flags = เล่นเท่าเดิมทุกไบต์ · เก็บแยกจาก st.flags ของทายาท (ธงตัวตนของเขาเอง)
const heirFlags = (st, tier) => Object.fromEntries(Object.entries(st.content.heir ?? {}).filter(([f, h]) => st.flags[f] && tier <= h.tier).map(([f]) => [f, tier]));

function makeHeir(af, r) {
  const st = af.st;
  const era = st.content.era;
  const { x, net } = af.verdict;
  const rng = af.rng;
  const lastBirth = era.births.from + era.births.w.length - 1;
  let sex = rng.next() < 0.5 ? 'ชาย' : 'หญิง', name = null;
  let cls, region, birthYear, parents = null, legacy = null, tier = null, occupation = null, familyLadder = null, province = null, parentFlags = {}, letter = null;
  const death = deathStanding(st);
  // เป้าตระกูลที่เพิ่งสำเร็จรุ่นนี้ ได้ชื่อเสียง +1 ต่อข้อ (ครั้งเดียวต่อตระกูล)
  const goals = goalsMet(st, (st.estate?.money ?? 0) < 0);
  const fame = Math.min(FAME.names.length - 1, nextFame(st, death) + goals.length);
  // ทางสายเลือด (B76) = คนที่ผู้เล่นเลือก ชั้นตามบทบาท ไม่สุ่มชั้น/คน · ที่เหลือคิดแบบทางเป็นลูก (พ่อแม่ มรดก ธงรุ่นก่อน)
  const blood = af.path === 'blood' ? st.kin.find((m) => m.id === af.blood) : null;
  if (af.path === 'child' || blood) {
    // บ้านของรุ่นถัดไปคือบ้านของคนในชาติก่อน — อาชีพของครอบครัวจึงเป็นงานสุดท้ายของเขา ไม่สุ่มใหม่
    occupation = st.occupation;
    // อาชีพตามขั้นยศมีความหมายแค่ในสาย — บ้านส่งต่อสายของพ่อแม่ให้การ์ดหางานพากลับเข้าสาย
    if (st.content.era.finance.occupations.find((o) => o.id === occupation)?.birth === false) familyLadder = st.ladder?.id ?? null;
    tier = blood ? KIN_TIERS[blood.role === 'child' ? 0 : 1] : weighted(rng, KIN_TIERS, KIN_TIERS.map((t) => t.w));
    // ลูก/หลานที่ยังอยู่จริง (B36a): เกิดเป็นคนหนึ่งในนั้น · ไม่มีลูกเหลือแต่มีหลาน = ชั้นลูกเลื่อนเป็นหลาน · สุ่มเลือกคนจาก kinRng ของชีวิตก่อน
    const kids = livingKin(st, 'child'), grand = livingKin(st, 'grandchild');
    if (st.kin && tier.tier === 1 && !kids.length) tier = KIN_TIERS[1];
    const pickOne = (list) => (list.length ? list[st.kinRng.int(0, list.length - 1)] : null);
    const me = blood ?? (st.kin ? (tier.tier === 1 ? pickOne(kids) : tier.tier === 2 ? pickOne(grand) : null) : null);
    const link = me?.role === 'grandchild' ? st.kin.find((m) => m.id === me.of) ?? null : tier.tier > 1 ? pickOne(kids) : null;
    const spouse = (st.kin ?? []).filter((m) => m.role === 'spouse').at(-1) ?? null;
    if (me) ({ sex, name } = me);
    parentFlags = heirFlags(st, tier.tier);
    const kidAge = me?.role === 'child' ? me.born - st.birthYear : link ? link.born - st.birthYear : Math.min(st.age, st.flagAge?.has_kids ?? KID_AGE_DEFAULT);
    region = { name: st.region, ses: st.ses };
    province = st.province;
    // ชั้นลูกหารด้วยลูกที่ยังอยู่จริง · หลานจริงหารต่อด้วยพี่น้องของเขา · ชั้นที่ไม่มีคนจริงใช้ตัวคูณเดิมของชั้น
    const sibs = me?.role === 'grandchild' ? grand.filter((g) => g.of === me.of).length : 0;
    const units = st.kin ? legacyUnits(st, kids.length) * (tier.tier === 1 ? 1 : sibs ? 1 / sibs : tier.legacy) : legacyUnits(st) * tier.legacy;
    const rich = LEGACY.richUnits.filter((u) => units >= u).length;
    const wealth = st.estate?.money < 0 ? -1 : rich;
    cls = CLASSES[mixStanding(death, clampIdx(CLASSES.indexOf(st.cls) + wealth + Math.round(x * FATE.childStep)))];
    const debt = st.estate?.money < 0;
    let year = st.birthYear + kidAge;
    if (tier.tier === 1) {
      // ผู้เล่นรุ่นก่อนตายตามชะตาเดิมของตัวเอง (diesAt) · อีกคนแก่และตายตามตารางชีพแบบพ่อแม่ทั่วไป
      // คู่ครองจริงเป็นพ่อ/แม่อีกคน: อายุตอนลูกเกิดจากปีเกิดจริง · ตายไปแล้วตอนเราตาย = ตายที่อายุนั้น · ไม่มีคู่จริง = สร้างแบบเดิม
      const year0 = st.birthYear + kidAge;
      parents = [
        { sex: st.sex, age: kidAge, alive: true, diesAt: st.age, ancestor: true, name: st.name, ...deathOf(st) },
        spouse && spouse.born <= year0
          ? { sex: spouse.sex, age: year0 - spouse.born, alive: spouse.diedAge === null || spouse.diedAge > year0 - spouse.born, ...(spouse.diedAge !== null && { diesAt: spouse.diedAge, ...kinDeathOf(spouse) }), name: spouse.name }
          : { sex: otherSex(st.sex), age: spouseAge(rng, st.sex, kidAge), alive: true },
      ];
      legacy = { age: st.age - kidAge, units, debt, from: elderWord(1, null, st.sex) };
    } else {
      // รุ่นคั่นกลางเกิดห่างกันตามช่วงอายุแม่ตอนคลอด · พ่อ/แม่ของผู้เล่นใหม่เป็นลูก (หรือหลาน) ของรุ่นก่อน แก่และตายตามตารางชีพ
      // หลานจริง = เกิดปีของเขา พ่อ/แม่สายเลือดคือลูกจริงที่ให้กำเนิด · ไม่มีคนจริง = ห่างรุ่นสุ่มแบบเดิม (เริ่มจากปีเกิดลูกจริงถ้ามี)
      let gap = 0;
      if (me) {
        gap = me.born - (link?.born ?? year);
        year = me.born;
      } else {
        for (let i = 1; i < tier.tier; i++) {
          gap = rng.int(...GEN_GAP);
          year += gap;
        }
      }
      const linkSex = link?.sex ?? (rng.next() < 0.5 ? 'หญิง' : 'ชาย');
      // ลูกจริงเป็นพ่อ/แม่ได้ตรง ๆ เฉพาะชั้นหลาน · เหลนมีรุ่นคั่นที่ยังไม่มีตัวตน
      const direct = link && tier.tier === 2;
      parents = [
        direct ? { sex: link.sex, age: gap, alive: link.diedAge === null || link.diedAge > gap, ...(link.diedAge !== null && { diesAt: link.diedAge, ...kinDeathOf(link) }), name: link.name } : { sex: linkSex, age: gap, alive: true },
        { sex: otherSex(linkSex), age: spouseAge(rng, linkSex, gap), alive: true },
      ];
      // รุ่นก่อนไม่อยู่ในพ่อแม่ — มรดกตกทอดปีที่รุ่นก่อนตาย ตายก่อนเกิดก็ได้รับตอนแรกเกิด
      legacy = { age: Math.max(0, st.birthYear + st.age - year), units, debt, from: elderWord(tier.tier, linkSex, st.sex) };
    }
    // จดหมายคำฝาก (afterfall-3): ถึงมือปีที่ผู้ฝากตายในชีวิตทายาท ไม่ก่อนอายุที่ทะเบียน heir: ยอมให้เล่า
    // ผู้รับเป็นคนอื่น = คนนั้นยื่นซอง · ผู้รับคือทายาทเอง/ไม่มีชื่อ = คนในบ้าน (ช่อง {ผู้ยื่นซอง})
    const sent = Object.keys(parentFlags).find((f) => f.startsWith('wish_letter_'));
    if (sent) {
      const to = letterTo(st);
      letter = { age: Math.max(legacy.age, st.content.heir[sent].from_age ?? 0), from: `${legacy.from} ${st.name}`, cause: causeWords(st.cause ?? 'other', st.age), by: to && to.id !== me?.id ? to.name ?? null : null };
    }
    // ปีเกมไม่เกินปีเกิดสุดท้ายในข้อมูล — เนื้อหา/ข้อมูลยุคครอบถึงช่วงนั้น · หน้าจอไม่แสดงปีอยู่แล้ว
    // สายเลือดเกิดจริงแล้ว — ตัดปีเกิดทำให้อายุตอนเริ่มเพี้ยนจากอายุจริง
    birthYear = blood ? blood.born : Math.min(lastBirth, year);
  } else {
    birthYear = pickBirthYear(rng, era);
    region = pickRegion(rng, era.birth);
    cls = CLASSES[mixStanding(death, clampIdx(Math.round(4.5 + 4.5 * x + gauss(rng) * FATE.sd)))];
  }
  const kin = (k) => (tier && (k === 'relations' || k === 'network') ? Math.max(-FATE.bonusCap, Math.min(FATE.bonusCap, (st[k] - 50) * FATE.kin * tier.kin)) : 0);
  const bonus = Object.fromEntries(STAT_KEYS.map((k) => [k, x * FATE.stat + (af.bonus[k] ?? 0) + kin(k) + (k === 'network' ? fame * FAME.network : 0)]));
  const gen = st.gen ?? 1;
  // broke = จากไปพร้อมหนี้ — ฉายาตระกูล (titles.mjs) นับรุ่นติดกัน · tier = กลับมาเกิดเป็นชั้นไหนของตัวเอง (ทางเป็นลูก)
  // ชีวิตต่างโลกต่อท้ายเป็นรุ่นของตัวเอง (B68) — แถวชาติไทยบันทึกทางว่าไปต่างโลกกับภูมิที่ปรโลกชี้ให้ชาติไทย แม้ขากลับจะเกิดใหม่ตามกรรมของชาติต่างโลก
  const thai = af.thaiVerdict ?? af.verdict;
  const lineage = [...(st.lineage ?? []), { gen, name: st.name, sex: st.sex, province: st.province, cls: st.cls, age: st.age, ...(isGone(st) ? { gone: true } : { cause: st.cause ?? 'other' }), realm: thai.realm.name, path: af.isekaiLives.length ? 'isekai' : af.path, ...(tier && { tier: tier.tier }), broke: (st.estate?.money ?? 0) < 0, standing: [...(st.standing ?? []), { age: st.age, cls: death }], fame, ...(goals.length && { goals }), ...(st.officeTop >= 0 && { office: st.officeTop }), ...(ladderOf(st)?.pension && { service: true }), ...(st.trips?.length && { trips: st.trips }) }, ...af.isekaiLives];
  const carried = r * (tier?.carry ?? 1);
  const ledger = carryLedger(af.st.ledger, net, carried);
  // ทายาทเกิดในโลกปกติเสมอ — รอบนี้มีชาติต่างโลกคั่น = กลับเข้าโลกที่เคยออกไป +1 (ชาติต่างโลกติดกันหลายรอบก็กลับครั้งเดียว) · ปรโลกคั่นชาติไม่นับ
  const overlap = overlapOf(st) + (af.isekaiLives.length ? 1 : 0);
  // ตระกูลเริ่มจำคนตายตั้งแต่ชาติที่ทำให้ค่าซ้อนขึ้นจาก 0 · ค่า 0 ไม่มีช่อง ⇒ ทายาทเท่าเดิมทุกไบต์ · ไม่จำกัดจำนวน (ล้างตอนรอบใหม่)
  const deadKin = overlap ? [...(st.deadKin ?? []), ...deadKinOf(st)] : [];
  return {
    seed: mixSeed(st.seed, 0x5eed + gen),
    gen: gen + 1 + af.isekaiLives.length,
    sex,
    name,
    cls,
    region,
    province,
    birthYear,
    parents,
    legacy,
    occupation,
    ...(familyLadder && { familyLadder }),
    bonus,
    ledger,
    carried,
    kept: ledger.merit + ledger.sin,
    tier: tier?.tier ?? null,
    parentFlags,
    letter,
    // ส่วนที่บ้านส่งต่อ แยกจาก bonus (ซึ่งรวมผลกรรม) ให้การ์ดเปิดชีวิตเล่าทิศได้โดยไม่เผยบัญชี
    kin: { relations: kin('relations'), network: kin('network') },
    lineage,
    pets: heirPets(st, birthYear, tier),
    // เกิดในตระกูล = รับหมวดโฟกัสหลักของรุ่นก่อนเป็นตัวเด็ก · เกิดที่อื่น/ไม่เคยโฟกัส = ตามน้ำ (ไม่มีฟิลด์ heir จึงเท่าเดิม)
    ...(tier && lifeFocusKid(st) && { focus: lifeFocusKid(st) }),
    // ประตูเข้าสายที่รุ่นก่อนเปิดไว้ ส่งต่อเฉพาะทายาทในตระกูล
    ...(tier && lifeGatesOpen(st).length && { gates: lifeGatesOpen(st) }),
    // เริ่มกลางวัย (B76): อายุจริงปีที่รุ่นก่อนตาย · newLife อ่านแล้วข้ามวัยเด็ก
    ...(blood && { start: { age: st.birthYear + st.age - blood.born, kinId: blood.id } }),
    fame,
    ...(overlap && { overlap }),
    // ความจำข้ามชาติไปกับทุกทางเกิด · ภูมิ = ภูมิที่ปรโลกชี้ให้ชาติไทย (แบบแถวผังตระกูล)
    past: pastOf(st, thai.realm.id, isGone(st)),
    ...(deadKin.length && { deadKin }),
  };
}

// รุ่นถัดไป: ชีวิตใหม่จาก heir ที่การ์ดส่งต่อสร้างไว้ · carry = id สกิลที่ผู้เล่นเลือกพกจากคลัง (06s · bookCarryOffers) · book = คลังของผู้เล่น ให้การ์ดอัปเกรดรู้ขั้นคลัง
// offered = การ์ดเลือกสกิลขึ้นจริง (สมุดไม่ว่าง) — ผู้เรียกบอก ไม่เดาจาก carry ว่าง ⇒ บอท/harness ที่เรียก nextLife(af) เดินเท่าเดิม
export function nextLife(af, carry = [], book = {}, offered = false) {
  if (!af.heir) throw new Error('ยังไม่ถึงการ์ดส่งต่อ');
  const heir = { ...af.heir, skills: carryPick(carry, book) };
  const spare = offered ? SKILL.carry - carry.length : 0;
  if (!spare) return newLife(heir.seed, af.st.content, heir);
  // ค่าเข้าเกณฑ์ดูจากค่าเริ่มสุดท้ายของชีวิตเดียวกันที่ยังไม่ได้ค่าเพิ่ม (ฐาน+jitter+bonus หลัง clamp)
  // ได้ 0 ค่ายังส่ง spare: [] ไป — การ์ดเกิดขึ้นบรรทัดสำรองแทน (decisions 360)
  const keys = spareKeys(newLife(heir.seed, af.st.content, heir), spare, heir.seed);
  const bonus = { ...heir.bonus };
  for (const k of keys) bonus[k] = (bonus[k] ?? 0) + SPARE_STAT;
  return newLife(heir.seed, af.st.content, { ...heir, bonus, spare: keys });
}

// ช่องพกที่ไม่ใช้แลกเป็นค่าเริ่ม (decisions 355–359): ช่องละ 1 ค่าสุ่มไม่ซ้ำ +SPARE_STAT · ไม่อยู่ใต้ FATE.bonusCap (ของแลก ไม่ใช่ผลกรรม)
// สุ่มเฉพาะค่าที่บวกได้เต็ม (≤ SPARE_MAX) · เข้าเกณฑ์น้อยกว่าช่องว่าง = ได้เท่าที่มี
// stream แยกจาก seed ของ heir — ไม่กินเลขสุ่มของโลก ชีวิตใหม่ต่างจากพกเต็มเฉพาะผลของค่าเริ่ม
// filter = false ใช้เป็นตัวควบคุมของด่านเท่านั้น (ต้องเห็นค่าชน 100)
export const SPARE_STAT = 10;
const SPARE_MAX = 100 - SPARE_STAT;
export function spareKeys(base, spare, seed, filter = true) {
  const rng = makeRng(seed ^ 0x2b7e1516);
  const pool = STAT_KEYS.filter((k) => !filter || base[k] <= SPARE_MAX);
  const out = [];
  while (out.length < spare && pool.length) out.push(...pool.splice(rng.int(0, pool.length - 1), 1));
  return out;
}

// harness/หน้าเว็บเดินช่วงที่ 7 ด้วยฟังก์ชันชุดเดียวกัน · บอทได้ af (มี pending.choices ให้อ่านป้ายบุญบาปแบบเดียวกับการ์ดชีวิต)
export function playAfterlife(st, pickChoice, onCard) {
  const af = startAfterlife(st);
  for (;;) {
    const card = nextAfterCard(af);
    onCard?.(card, af);
    if (card.choices?.length) chooseAfter(af, warnPick(card) >= 0 ? warnPick(card) : pickChoice(card, af.botRng, af));
    // ชาติต่างโลกไม่มีใบทุ่มเทเข้าช่วงวัยแล้ว (ui-redo 83) — บอทตั้งโฟกัสตาแรกของช่วงจากใบเลือกรูปเดิม
    else if (card.entered && af.isekai) isekaiFocusPick(af.isekai, pickChoice({ stage: card.stage, ...isekaiFocusCard(af.isekai) }, af.botRng, af));
    if (card.done) return af;
  }
}
