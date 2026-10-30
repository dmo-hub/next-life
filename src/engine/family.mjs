// ครอบครัวเป็นคนจริง (B36a): คู่ครอง · ลูก · หลาน มีชื่อ เพศ ปีเกิด ยังอยู่/จากไป · พ่อแม่อยู่ใน st.parents แบบเดิม
// ทุกสุ่มของสมาชิกใหม่มาจาก st.kinRng (stream แยกจากโลกและจาก famRng ของพ่อแม่) — ชีวิตที่ไม่มีครอบครัวของตัวเองไม่ดึงเลขนี้เลย
// ชะตาการตายของพ่อแม่และลำดับสุ่มของโลกจึงเหมือนก่อนมีระบบนี้ทุกหลัก
import { makeRng, mixSeed } from './rng.mjs';
import { pickName } from './birth.mjs';
import { kinDeathRoll, kinCause, inherit, KIN_ILL_TEXT } from './death.mjs';

export const KIN_ROLES = ['spouse', 'child', 'grandchild'];
export const FAMILY_ROLE_NAMES = { parent: 'พ่อแม่', spouse: 'คู่ครอง', child: 'ลูก', grandchild: 'หลาน', pet: 'สัตว์คู่ใจ', herd: 'ฝูงสัตว์', peer: 'เพื่อนรุ่น' };
// ธงเดิมที่เนื้อหาอ่านอยู่ ↔ บทบาทที่ธงนั้นหมายถึง · ตั้งธงจากตัวเลือก = มีสมาชิกคนนั้นเพิ่มขึ้นจริง
const KIN_FLAG_ROLE = { married: 'spouse', has_kids: 'child', raised_grandkids: 'grandchild' };
// ลูกที่โตแล้วมีหลานให้เองปีละโอกาสนี้ ช่วงอายุนี้ ไม่เกินจำนวนนี้ต่อคน — ค่าตั้งของเกม (ไม่มีข้อมูลเจริญพันธุ์รายยุคในชุดข้อมูล)
export const GRANDKID = { from: 22, to: 40, chance: 0.08, max: 3 };
// คู่ครองอายุห่างจากเราได้เท่านี้ (ปีเกิด) · ค่าตั้งของเกม
const KIN_SPOUSE_GAP = [-5, 5];
// pet · herd (B44) · peer (B43) เป็นสมาชิกได้ แต่ไม่ใช่ทายาท ไม่ตั้งธง ไม่มีหลาน — สัตว์ตายตามอายุขัยของชนิด เพื่อนรุ่นตายตามตารางชีพแบบคน
export const KIN_EXTRA_ROLES = ['pet', 'herd', 'peer'];
// คนในบ้าน = คนที่การ์ดครอบครัวดูแลถึง และคนที่นับว่า "ยังมีใคร" ตอนแก่ · เพื่อนรุ่นไม่นับ
const KIN_HOUSEHOLD = ['spouse', 'child', 'grandchild', 'pet'];

// ความผูกพันรายคน 0–100 (B36a2): ปีที่ไม่ได้ดูแลลดเอง 1 แต่การลดเองไม่พาต่ำกว่า floor — ผลร้ายจากเนื้อหาพาต่ำกว่าได้
export const BOND_START = { parent: 70, spouse: 70, child: 75, grandchild: 60, pet: 65, herd: 50, peer: 50 };
export const BOND_FLOOR = 38;
export const BOND_LEVELS = [[80, 'ผูกพัน'], [60, 'สนิท'], [40, 'คุ้นเคย'], [20, 'เฉย ๆ'], [0, 'ห่างเหิน']];
// การ์ดหมวด family ที่ตัวเลือกให้ความสัมพันธ์บวก = ดูแลคนในบ้านปีนั้น · bond ขึ้นเท่านี้ต่อระดับความสัมพันธ์ (1–3)
const BOND_CARE_PER_REL = 2;
// ญาติช่วยตอนเจอผลร้าย: คนที่ผูกพันตั้งแต่ from ขึ้นไป มีโอกาส (bond − base) / span ช่วยให้เสียหายเหลือ scale
export const KIN_AID = { from: 60, base: 50, span: 120, scale: 0.5, roles: ['spouse', 'child', 'grandchild'] };
// แก่แล้วไม่เหลือคนในบ้านที่ยังอยู่ = เสียความสุข/สุขภาพต่อปี · ปิดไว้ (0) จนเนื้อหามีทางมีลูกมากพอ — ตอนนี้คนแก่ส่วนใหญ่ไม่มีลูก
export const KIN_LONELY = { from: 65, happiness: 0, health: 0 };

// สัตว์ (B44) — ค่าตั้งของเกม · อายุขัยตามชนิดโดยประมาณ · เงินต่อปีเป็นสัดส่วนของเงินเก็บรายปีของชีวิตนั้น
// (บาทคงที่บีบส่วนต่างทรัพย์ของชั้นล่างที่ห่างกันน้อยจนลำดับพลิกในด่าน finance)
// pet = สัตว์คู่ใจ ทีละ 1 ตัว มีชื่อ ชนิดต่างกันให้ค่าสถานะต่างกัน (gives ต่อปี) · cost = ค่าข้าว ยา วัคซีนพื้นฐาน
export const PET_KINDS = {
  หมา: { life: [10, 15], cost: 0.06, gives: { health: 0.2, relations: 0.3 }, names: ['ดำ', 'ด่าง', 'ขาว', 'บุญมี', 'ตูบ', 'โต้ง', 'มะลิ', 'ถุงทอง', 'แดง', 'ปุยฝ้าย'] },
  แมว: { life: [12, 18], cost: 0.05, gives: { happiness: 1.5 }, names: ['ส้ม', 'มอม', 'ขาวมณี', 'ลายเสือ', 'ทองคำ', 'เหมียว', 'สีสวาด', 'ข้าวตัง'] },
  นกขุนทอง: { life: [10, 20], cost: 0.02, gives: { knowledge: 0.5, happiness: 0.5 }, names: ['แก้ว', 'ขุนทอง', 'เจ๊ก', 'ดำดี', 'สาลี'] },
  หมาพันธุ์: { life: [10, 14], cost: 0.25, gives: { health: 0.1, network: 0.3, happiness: 0.5 }, names: ['ลัคกี้', 'โมจิ', 'บราวนี่', 'ช็อกโก้', 'คุกกี้', 'ลาเต้'] },
  แมวพันธุ์: { life: [12, 16], cost: 0.2, gives: { happiness: 1.5, network: 0.2 }, names: ['มิลค์', 'ไข่มุก', 'ซูชิ', 'ลูน่า', 'โอปอ'] },
};
// herd = ฝูงที่เป็นทรัพย์สิน/อาชีพ (ไข่ นม แรงไถ ขายลูก) นับเป็นหน่วยเดียว ไม่มีชื่อ ไม่ให้ค่าสถานะแบบคู่ใจ · net = เงินสุทธิต่อปีหลังค่าอาหาร
export const HERD_KINDS = {
  ไก่: { life: [5, 10], net: 0.04 },
  วัว: { life: [12, 20], net: 0.1 },
  ควาย: { life: [15, 25], net: 0.06 },
  ปลา: { life: [3, 8], net: 0.015 },
};
// ความสุขที่เสียไปตอนคู่ใจตายตามอายุขัย (ตายจากการ์ดป่วย/หาย การ์ดใบนั้นหักเอง)
export const PET_GRIEF = 6;
// ติดบ้านตอนเกิด: บ้านฐานะดี (ชั้น ≥ richFrom) · บ้านในเมือง (ภาค city) · บ้านนอก — [โอกาส, ชนิด] คู่ใจกับฝูงสุ่มแยกกัน ได้ทั้งคู่ก็ได้
export const PET_AT_BIRTH = {
  richFrom: 7,
  city: 'กรุงเทพฯ และปริมณฑล',
  rich: { pet: [0.4, ['หมาพันธุ์', 'แมวพันธุ์']], herd: [0, []] },
  town: { pet: [0.3, ['แมว', 'หมา', 'นกขุนทอง']], herd: [0.1, ['ปลา']] },
  rural: { pet: [0.35, ['หมา', 'แมว', 'นกขุนทอง']], herd: [0.4, ['ไก่', 'วัว', 'ควาย']] },
};
// การ์ดเรียกสัตว์แบบคนเลี้ยงเรียก (เจ้าดำ) · มรณบัตรบอกชนิดด้วย (หมาชื่อดำ) · ฝูงเรียกตามชนิด
export const petCall = (m) => (m.role === 'herd' ? `ฝูง${m.kind}` : m.name ? `เจ้า${m.name}` : `${m.kind}ที่เลี้ยงไว้`);
const petLabel = (m) => (m.role === 'herd' ? `ฝูง${m.kind}` : m.name ? `${m.kind}ชื่อ${m.name}` : m.kind);
const petName = (st, kind, id) => {
  const names = PET_KINDS[kind]?.names;
  return names ? names[makeRng(mixSeed(st.seed, 0x9e7 + id)).int(0, names.length - 1)] : null;
};
const ANIMAL = ['pet', 'herd'];

export const bondLabel = (b) => BOND_LEVELS.find(([min]) => b >= min)[1];
const bondClamp = (b) => Math.max(0, Math.min(100, b));

const kinOtherSex = (sex) => (sex === 'ชาย' ? 'หญิง' : 'ชาย');
const kinInRange = (v, r) => !r || (v >= r[0] && v <= r[1]);
const kinYearOf = (st) => st.birthYear + st.age;
export const memberAge = (st, m, year = kinYearOf(st)) => (m.alive ? year - m.born : m.diedAge);

export function newKin(seed) {
  return { kin: [], kinRng: makeRng(seed ^ 0x510e527f), kinSeq: 0, kinCared: false, kinFocus: {}, kinLoss: [] };
}

// ชื่อทุกคนในบ้าน (รวมรุ่นก่อนในผังตระกูล) — ชื่อใหม่เลี่ยงชุดนี้
const kinTakenNames = (st) => [st.name, ...st.parents.map((p) => p.name), ...st.kin.map((m) => m.name), ...(st.lineage ?? []).map((l) => l.name)].filter(Boolean);

// พ่อแม่ที่ยังไม่มีชื่อ (ชีวิตแรก/ทางเกิดใหม่) ได้ชื่อจาก seed ตามยุคปีเกิดของเขา — ไม่ดึงเลขสุ่ม ไม่แตะชื่อผู้เล่น
export function nameParents(st) {
  st.parents.forEach((p, i) => {
    p.name ??= pickName(mixSeed(st.seed, 0x9a01 + i), p.sex, st.birthYear - p.age, st.content.era.names, kinTakenNames(st));
    p.bond ??= BOND_START.parent;
  });
}

// extra: of (หลาน = id ลูกที่เป็นพ่อแม่) · สัตว์เลี้ยง kind (ชนิด) + life [จาก, ถึง] (อายุขัยของชนิด) + name? (เนื้อหาตั้งให้ · ไม่ตั้ง = เรียกตามชนิด)
export function addMember(st, role, extra = {}) {
  const year = kinYearOf(st);
  const id = ++st.kinSeq;
  // สัตว์ติดบ้าน/ส่งต่อทายาทส่ง sex born maxAge มาเอง — ไม่ดึง kinRng ลำดับสุ่มของคนในบ้านจึงไม่ขยับ
  const sex = extra.sex ?? (role === 'spouse' ? kinOtherSex(st.sex) : st.kinRng.next() < 0.5 ? 'ชาย' : 'หญิง');
  const born = extra.born ?? (role === 'spouse' ? st.birthYear + st.kinRng.int(...KIN_SPOUSE_GAP) : role === 'peer' ? st.birthYear : year);
  // ชื่อคู่ใจสุ่มจาก seed+id ไม่ดึงเลข · ฝูงไม่มีชื่อ
  const name = role === 'herd' ? null : role === 'pet' ? (extra.name ?? petName(st, extra.kind, id)) : pickName(mixSeed(st.seed, 0x4b1d + id), sex, born, st.content.era.names, kinTakenNames(st));
  const m = { id, role, sex, born, alive: true, diedAge: null, name, bond: extra.bond ?? BOND_START[role] };
  if (ANIMAL.includes(role)) {
    m.kind = extra.kind;
    m.maxAge = extra.maxAge ?? st.kinRng.int(...extra.life);
  }
  if (role === 'child') m.order = st.kin.filter((x) => x.role === 'child').length + 1;
  if (role === 'grandchild') {
    // หลานจากเนื้อหา (รับหลานมาเลี้ยง) เป็นลูกของลูกที่ยังอยู่ ถ้ามี — ไม่มีลูกเหลือ = ไม่ระบุพ่อแม่
    const kids = st.kin.filter((x) => x.role === 'child' && x.alive);
    m.of = extra.of ?? (kids.length ? kids[st.kinRng.int(0, kids.length - 1)].id : null);
  }
  st.kin.push(m);
  // คนที่เพิ่งเข้าบ้านในการ์ดนี้คือคนที่ข้อความพูดถึง ("ได้ลูกชื่อ {ชื่อลูก}")
  if (st.kinFocus) st.kinFocus[role] = id;
  return m;
}

const livingOf = (st, role) => st.kin.filter((m) => m.role === role && m.alive && !m.left);
// ลูกที่ยังมีชีวิต นับแบบเดียวกับที่ afterlife.mjs หารมรดก (ย้ายออกไปแล้วยังเป็นทายาท) · ไม่มีระบบครอบครัว = null
export const livingChildren = (st) => (st.kin ? st.kin.filter((m) => m.role === 'child' && m.alive).length : null);

// คนที่การ์ดเรียกชื่อ = คนที่ผลการ์ดไปลง ต้องเป็นคนเดียวกันตลอดใบ (ข้อความ · ตัวเลือก · ผลสุ่ม) — สุ่มจาก kinRng ตอนการ์ดขึ้น
// ทอยเฉพาะบทบาทที่มีคนให้เลือก ≥2 — ชีวิตที่ไม่มีครอบครัว/มีคนเดียวไม่ดึงเลข
export function pickFocus(st) {
  st.kinFocus = {};
  for (const role of ['spouse', 'child', 'grandchild', 'pet', 'herd']) {
    const live = livingOf(st, role);
    if (live.length) st.kinFocus[role] = (live.length > 1 ? live[st.kinRng.int(0, live.length - 1)] : live[0]).id;
  }
}
// คนเป้าของการ์ดใบปัจจุบัน (ยังคืนคนเดิมแม้ผลการ์ดใบนี้ทำให้เขาจากไป — การ์ดผลจะได้เรียกชื่อถูกคน) · นอกการ์ด = คนล่าสุดที่ยังอยู่
export function focusOf(st, role) {
  const id = st.kinFocus?.[role];
  return (id !== undefined && st.kin.find((m) => m.id === id)) || livingOf(st, role).at(-1) || null;
}

// cause = สาเหตุที่การ์ดเนื้อหาเล่าเอง (เช่น เมาแล้วขับ = road) ไม่ดึงเลขสุ่ม · ไม่ใส่ = สุ่มตามสัดส่วนของอายุนั้น
function kinDie(st, m, cause) {
  m.diedAge = kinYearOf(st) - m.born;
  m.alive = false;
  if (m.role === 'pet') m.cause = cause ?? petCause(st, m);
  else if (m.role !== 'herd') m.cause = cause ?? kinCause(st.content.era, st.seed, st.kinCauseRng, m.sex, kinYearOf(st), m.diedAge);
}

// สัตว์คู่ใจ (B110 ชิ้น 3): แก่ · ป่วย · อุบัติเหตุ — ค่าตั้งของเกม (ไม่มีสถิติสาเหตุตายของสัตว์เลี้ยงไทย)
// ทอยจาก seed+id ของตัวนั้น ไม่ดึง kinRng/kinCauseRng ลำดับสุ่มของคนในบ้านจึงไม่ขยับ · ฝูงนับเป็นหน่วยเดียว ไม่มีสาเหตุรายตัว
export const PET_CAUSES = { old: 0.7, sick: 0.2, accident: 0.1 };
function petCause(st, m) {
  let u = makeRng(mixSeed(st.seed, 0xde7d + m.id)).next();
  for (const [k, w] of Object.entries(PET_CAUSES)) if ((u -= w) < 0) return k;
  return 'old';
}

// พ่อ/แม่จากไป: สาเหตุที่รู้อยู่แล้ว (ผู้เล่นรุ่นก่อน/นัดป่วย) หรือสุ่มตามสัดส่วนของอายุนั้น · โรคที่ถ่ายทอดได้จดเป็นประวัติครอบครัว
// ผู้เล่นรุ่นก่อนที่หายไปต่างโลก (gone) ไม่มีศพ จึงไม่มีสาเหตุ
export function parentDied(st, p, year) {
  p.alive = false;
  p.diedAge ??= p.diesAt ?? p.age;
  if (p.gone) return;
  p.cause ??= kinCause(st.content.era, st.seed, st.kinCauseRng, p.sex, year, p.diedAge);
  inherit(st, p.cause);
}

// คนที่ op bond กระทบ: parent = พ่อแม่ที่ยังอยู่ทุกคน · all = คนในบ้านที่ยังอยู่ทุกคน (รวมพ่อแม่) · บทบาทอื่น = คนล่าสุดของบทบาท
function bondTargets(st, role) {
  if (role === 'parent') return st.parents.filter((p) => p.alive);
  if (role === 'all') return [...st.parents.filter((p) => p.alive), ...st.kin.filter((m) => KIN_HOUSEHOLD.includes(m.role) && m.alive && !m.left)];
  const m = focusOf(st, role);
  return m?.alive ? [m] : [];
}

function bondAdd(st, list, d) {
  for (const m of list) m.bond = bondClamp((m.bond ?? BOND_START[m.role ?? 'parent']) + d);
  if (d > 0 && list.length) st.kinCared = true;
}

// ผลครอบครัวของตัวเลือก/ผลสุ่ม: family = [{add, n?} | {leave: spouse} | {die: role} | {bond: role|all, d}] + ธงเดิมที่ตั้ง
// ธงครอบครัวที่ตั้งโดยไม่มี add ของบทบาทนั้น = มีสมาชิกเพิ่ม 1 คน (เนื้อหาเดิมที่เขียนก่อนมีระบบ)
// care = แต้ม bond ที่คนในบ้านได้จากการ์ดหมวด family ที่ตัวเลือกให้ความสัมพันธ์บวก (ผู้เรียกคิดจากระดับผล)
export function applyFamily(st, c, care = 0) {
  const ops = c.family ?? [];
  for (const op of ops) {
    // คู่ใจทีละ 1 ตัว — เนื้อหากั้นด้วย when อยู่แล้ว ตรงนี้กันเผื่อหลุด (ไม่เพิ่มตัวที่สอง)
    if (op.add === 'pet' && livingOf(st, 'pet').length) continue;
    if (op.add) for (let i = 0; i < (op.n ?? 1); i++) addMember(st, op.add, ANIMAL.includes(op.add) ? { kind: op.kind, life: op.life, name: op.name } : {});
    if (op.bond) bondAdd(st, bondTargets(st, op.bond), op.d);
    if (op.leave) for (const m of livingOf(st, op.leave)) m.left = true;
    if (op.die === 'parent') {
      const p = st.parents.find((x) => x.alive);
      if (p) {
        p.diedAge = p.age;
        if (op.cause) p.cause = op.cause;
        parentDied(st, p, kinYearOf(st));
      }
    } else if (op.die) {
      const m = focusOf(st, op.die);
      if (m?.alive) kinDie(st, m, op.cause);
    }
  }
  for (const f of c.sets_flags ?? []) {
    const role = KIN_FLAG_ROLE[f];
    if (!role || ops.some((op) => op.add === role)) continue;
    // แต่งงานซ้ำตอนคู่ยังอยู่ = คนเดิม ไม่เพิ่มคู่
    if (role === 'spouse' && livingOf(st, 'spouse').length) continue;
    addMember(st, role);
  }
  if (care > 0) bondAdd(st, bondTargets(st, 'all'), care * BOND_CARE_PER_REL);
  kinSyncFlags(st);
}

// ธงเดิมตามสมาชิกจริง: married = มีคู่ที่ยังอยู่ด้วยกัน · has_kids = มีลูกที่ยังอยู่ · raised_grandkids เป็นเรื่องที่เคยทำ ไม่ถอด
function kinSyncFlags(st) {
  for (const [f, role] of [['married', 'spouse'], ['has_kids', 'child']]) {
    if (livingOf(st, role).length) {
      st.flags[f] = true;
      st.flagAge[f] ??= st.age;
    } else if (st.kin.some((m) => m.role === role)) delete st.flags[f];
  }
}

// เดินหนึ่งปีของสมาชิก: ตายตามตารางชีพของเพศ/ปีนั้น ที่อายุของปีที่เพิ่งผ่าน (ทารกจึงเจออัตราตายขวบปีแรก) · ลูกที่โตแล้วมีหลานได้ · ไม่มีสมาชิก = ไม่ดึงเลขสุ่ม
// ปีที่ไม่ได้ดูแล bond ลด 1 ถึง floor · ความเหงาตอนแก่ — ทั้งสองอย่างไม่ดึงเลขสุ่ม ชีวิตที่ไม่มีครอบครัวจึงเดินเหมือนเดิม
function kinYearlyBond(st) {
  if (!st.kinCared) {
    for (const m of [...st.parents, ...st.kin]) {
      if (!m.alive || m.left) continue;
      const b = m.bond ?? BOND_START[m.role ?? 'parent'];
      m.bond = b > BOND_FLOOR ? Math.max(BOND_FLOOR, b - 1) : b;
    }
  }
  st.kinCared = false;
  if (st.age >= KIN_LONELY.from && (KIN_LONELY.happiness || KIN_LONELY.health) && !st.kin.some((m) => KIN_HOUSEHOLD.includes(m.role) && m.alive && !m.left)) {
    st.happiness = bondClamp(st.happiness - KIN_LONELY.happiness);
    st.health = bondClamp(st.health - KIN_LONELY.health);
  }
}

// คนในบ้านที่จากไปเองตามตารางชีพ/อายุขัย ปีนี้ → st.kinLoss (สัญญาณให้เนื้อหาทำการ์ดสูญเสีย · when.loss) + คืนรายการให้แกนออกการ์ดแจ้งทุกครั้ง
// ตายจาก op die ของเนื้อหาไม่นับ — การ์ดใบนั้นเล่าเองแล้ว · เพื่อนรุ่นไม่นับ (ไม่ใช่คนในบ้าน)
function kinLost(st, m, age, year, out) {
  m.diedAge = age;
  m.alive = false;
  if (!KIN_HOUSEHOLD.includes(m.role) && m.role !== 'herd') return;
  if (m.role === 'pet') st.happiness = bondClamp(st.happiness - PET_GRIEF);
  const loss = { id: m.id, role: m.role, name: m.name, age, year, ...(m.kind && { kind: m.kind }), ...(m.cause && { cause: m.cause }) };
  st.kinLoss.push(loss);
  out.push(loss);
}

// ผลต่อปีของสัตว์ (B44): คู่ใจให้ค่าสถานะตามชนิด หักค่าเลี้ยง · ฝูงให้เงินสุทธิ · บาทของปีนั้น — ไม่ดึงเลขสุ่ม
function petYear(st, saving) {
  const live = st.kin.filter((m) => ANIMAL.includes(m.role) && m.alive && !m.left);
  if (!live.length) return;
  for (const m of live) {
    if (m.role === 'herd') {
      st.money += (HERD_KINDS[m.kind]?.net ?? 0) * saving;
      continue;
    }
    const k = PET_KINDS[m.kind] ?? {};
    for (const [stat, v] of Object.entries(k.gives ?? {})) st[stat] = bondClamp(st[stat] + v);
    st.money -= (k.cost ?? 0) * saving;
  }
}

// saving = เงินเก็บรายปีของชีวิตนี้ (ผู้เรียกคิดให้) ฐานของเงินสัตว์
export function ageKin(st, year, saving = 0) {
  kinYearlyBond(st);
  const lost = [];
  if (!st.kin.length) return lost;
  petYear(st, saving);
  for (const m of [...st.kin]) {
    if (!m.alive) continue;
    const a = year - m.born - 1;
    if (ANIMAL.includes(m.role)) {
      if (a + 1 >= m.maxAge) {
        if (m.role === 'pet') m.cause = petCause(st, m);
        kinLost(st, m, a + 1, year, lost);
      }
      continue;
    }
    const cause = kinDeathRoll(st.content.era, st.seed, st.kinCauseRng, m, year, a, st.kinRng.next());
    if (cause) {
      m.cause = cause;
      kinLost(st, m, a, year, lost);
      continue;
    }
    if (m.role === 'child' && kinInRange(year - m.born, [GRANDKID.from, GRANDKID.to]) && st.kin.filter((g) => g.of === m.id).length < GRANDKID.max && st.kinRng.next() < GRANDKID.chance) {
      addMember(st, 'grandchild', { of: m.id });
    }
  }
  kinSyncFlags(st);
  return lost;
}

// ข้อความการ์ดแจ้งการจากไป (แกนออกเองทุกครั้ง — เนื้อหาต่อยอดด้วย when.loss ได้)
const LOSS_WHO = { spouse: 'คู่ชีวิต', child: 'ลูก', grandchild: 'หลาน' };
const PET_LOSS_TEXT = {
  old: (who, age) => `${who}หลับไปอย่างสงบตามวัย ด้วยวัย ${age} ปี`,
  sick: (who, age) => `${who}ป่วยหนักแล้วจากไป ด้วยวัย ${age} ปี`,
  accident: (who, age) => `${who}ประสบอุบัติเหตุจากไปกะทันหัน ตอนอายุ ${age} ปี`,
};
export function lossText(l) {
  if (l.role === 'herd') return `ฝูง${l.kind}ที่เลี้ยงไว้ค่อย ๆ หมดไป ไม่ได้เลี้ยงต่อแล้ว`;
  const who = l.role === 'pet' ? (l.name ? `เจ้า${l.name} ${l.kind}ที่เลี้ยงไว้` : `${l.kind}ที่เลี้ยงไว้`) : `${LOSS_WHO[l.role]}${l.name}`;
  if (l.role === 'pet' && PET_LOSS_TEXT[l.cause]) return PET_LOSS_TEXT[l.cause](who, l.age);
  return l.age < 1 ? `${who}จากไปตั้งแต่ยังไม่ทันครบขวบ` : `${who}จากไปแล้ว ด้วยวัย ${l.age} ปี`;
}

// พ่อแม่/คนในบ้านที่ถึงปีรู้ว่าป่วยโรคเรื้อรังที่นัดตาย (B110 ชิ้น 2) → คืนการ์ดให้แกนออกแจ้ง · เพื่อนรุ่นไม่แจ้ง (ไม่ใช่คนในบ้าน)
// ill.from = อายุที่รู้ (พ่อ/แม่ที่เป็นผู้เล่นรุ่นก่อนรู้ตามชาติที่เล่นไปแล้ว) · ไม่มี = รู้ปีที่นัด
// left = ปีที่เหลือหลังปีนี้ก่อนถึงนัด (นับแบบ when.illness ของตัวเอง)
const illPeople = (st, year) => [
  ...st.parents.filter((p) => p.alive && p.ill).map((p) => ({ p, role: 'parent', cur: p.age, who: p.sex === 'หญิง' ? 'แม่' : 'พ่อ' })),
  ...(st.kin ?? []).filter((m) => LOSS_WHO[m.role] && m.alive && !m.left && m.ill).map((m) => ({ p: m, role: m.role, cur: year - m.born - 1, who: `${LOSS_WHO[m.role]}${m.name}` })),
];
export function kinIllNews(st, year) {
  const out = [];
  for (const { p, role, cur, who } of illPeople(st, year)) {
    if (p.ill.toldAt !== undefined || (p.ill.from !== undefined && cur < p.ill.from)) continue;
    p.ill.toldAt = cur;
    out.push({ text: KIN_ILL_TEXT[p.ill.cause](who), kinIllness: { role, ...(p.id !== undefined && { id: p.id }), cause: p.ill.cause, left: Math.max(0, p.ill.age - cur - 1) } });
  }
  return out;
}
// เงื่อนไขการ์ดช่วงญาติป่วย (when.kin_illness): มีพ่อแม่/คนในบ้านที่ยังอยู่และรู้แล้วว่าป่วย · roles · causes · left แบบ when.illness
export function kinIllOk(st, w) {
  const year = kinYearOf(st);
  return illPeople(st, year).some(({ p, role, cur }) => p.ill.toldAt !== undefined && (!w.roles || w.roles.includes(role)) && (!w.causes || w.causes.includes(p.ill.cause)) && kinInRange(Math.max(0, p.ill.age - cur - 1), w.left));
}

// เงื่อนไขการ์ดสูญเสีย (when.loss): มีคนในบ้านบทบาทที่ระบุ (ไม่ใส่ = ทุกบทบาท) จากไปเองภายใน within ปีที่ผ่านมา (ไม่ใส่ = ปีนี้)
export function lossOk(st, w) {
  const year = kinYearOf(st);
  return (st.kinLoss ?? []).some((l) => (!w.roles || w.roles.includes(l.role)) && year - l.year <= (w.within ?? 0));
}
// ชื่อคนที่จากไปล่าสุด ให้การ์ดสูญเสียเรียก ({ชื่อผู้จากไป})
export const lastLoss = (st) => (st.kinLoss ?? []).at(-1) ?? null;
// ชื่อที่การ์ดสูญเสียเรียก — สัตว์เรียกแบบ petCall
export const lossCall = (l) => (ANIMAL.includes(l.role) ? petCall(l) : l.name);

// เงื่อนไขครอบครัวของการ์ด (when.family / requires.family): บทบาท · เพศ · ยังอยู่ · ช่วงอายุ · จำนวน
// ไม่ใส่ count = ต้องมีอย่างน้อย 1 คนที่ตรง · คู่ที่หย่าแล้วไม่นับเป็นคู่ครอง
// sex แยกพ่อกับแม่ — ข้อความที่เอ่ย "แม่" ต้องไม่ผ่านเพราะพ่อยังอยู่ (B138)
export function familyOk(st, f) {
  const year = kinYearOf(st);
  const pool = f.role === 'parent'
    ? st.parents.map((p) => ({ alive: p.alive, age: p.age, sex: p.sex }))
    : (st.kin ?? []).filter((m) => m.role === f.role && !m.left).map((m) => ({ alive: m.alive, age: memberAge(st, m, year), sex: m.sex }));
  const n = pool.filter((m) => (f.alive === undefined || m.alive === f.alive) && (f.sex === undefined || m.sex === f.sex) && kinInRange(m.age, f.age)).length;
  return f.count ? kinInRange(n, f.count) : n > 0;
}

// ผลร้ายของผลสุ่ม: คนในบ้านที่ผูกพันที่สุดอาจช่วยประคอง → คืนคนนั้น (ผู้เรียกลดความเสียหายตาม KIN_AID.scale) หรือ null
// ทอยด้วย kinRng เฉพาะตอนมีคนเข้าเกณฑ์ — ชีวิตที่ไม่มีครอบครัวไม่ดึงเลขนี้
export function kinAid(st) {
  const able = (st.kin ?? []).filter((m) => KIN_AID.roles.includes(m.role) && m.alive && !m.left && m.bond >= KIN_AID.from);
  if (!able.length) return null;
  const h = able.reduce((a, b) => (b.bond > a.bond ? b : a));
  return st.kinRng.next() < (h.bond - KIN_AID.base) / KIN_AID.span ? h : null;
}

// สัตว์ติดบ้านตอนเกิด (B44): ทางในตระกูลได้ตัวที่บ้านเดิมยังเลี้ยงอยู่ (heir.pets) · ที่เหลือสุ่มตามบ้านจาก stream แยก
// ไม่ดึง rng ของโลก/kinRng — ชีวิตที่ไม่ได้สัตว์ไม่มีอะไรเปลี่ยนจากส่วนนี้
export function petsAtBirth(st, heir, clsIndex) {
  if (heir?.pets) {
    // ตัวที่บ้านรับมาหลังทายาทเกิด เข้าบ้านตอนถึงปีของมัน (petArrivals)
    for (const p of heir.pets) if (p.born <= st.birthYear) addMember(st, p.role, p);
    st.petsLater = heir.pets.filter((p) => p.born > st.birthYear);
    return;
  }
  // เกิดในตระกูลเดิมแต่บ้านไม่มีสัตว์เหลือ = ไม่สุ่มเพิ่ม · เกิดที่อื่นสุ่มตามบ้านใหม่
  if (heir?.tier) return;
  const rng = makeRng(st.seed ^ 0x7e7f1a2b);
  const set = clsIndex >= PET_AT_BIRTH.richFrom ? PET_AT_BIRTH.rich : st.region === PET_AT_BIRTH.city ? PET_AT_BIRTH.town : PET_AT_BIRTH.rural;
  for (const role of ANIMAL) {
    const [chance, kinds] = set[role];
    if (rng.next() >= chance) continue;
    const kind = kinds[rng.int(0, kinds.length - 1)];
    const maxAge = rng.int(...(role === 'pet' ? PET_KINDS : HERD_KINDS)[kind].life);
    // ตัวที่อยู่บ้านมาก่อนเราเกิด อายุสุ่มไม่เกินครึ่งอายุขัย
    const born = st.birthYear - rng.int(0, Math.floor(maxAge / 2));
    addMember(st, role, { kind, maxAge, born, sex: rng.next() < 0.5 ? 'ชาย' : 'หญิง' });
  }
}

// สัตว์ที่ส่งต่อมาถึงปีเข้าบ้านแล้ว — คืนรายการให้แกนออกการ์ดแจ้ง · ไม่ดึงเลขสุ่ม
// คู่ใจมีอยู่แล้ว (ได้จากการ์ดระหว่างนั้น) = ตัวที่ส่งต่อไม่เข้าบ้าน
export function petArrivals(st, year) {
  if (!st.petsLater?.length) return [];
  const now = st.petsLater.filter((p) => p.born <= year);
  st.petsLater = st.petsLater.filter((p) => p.born > year);
  return now.filter((p) => p.role !== 'pet' || !livingOf(st, 'pet').length).map((p) => addMember(st, p.role, p));
}
export const petArriveText = (m) => `บ้านเรารับ${petLabel(m)}มาเลี้ยง`;

// ส่งต่อทายาทในตระกูล: ทุกตัวที่ยังอยู่ตอนเราตาย (ยังอยู่ตลอดตั้งแต่เกิดถึงปีนั้น) · ตัวที่เกิดหลังทายาทเข้าบ้านตอนถึงปีของมัน
export function heirPets(st, birthYear, tier) {
  if (!tier || !st.kin) return undefined;
  const pets = st.kin
    .filter((m) => ANIMAL.includes(m.role) && m.alive && !m.left)
    .map(({ role, kind, name, born, maxAge, sex, bond }) => ({ role, kind, name, born, maxAge, sex, bond }));
  return pets.length ? pets : undefined;
}

// มรณบัตร: ใครรับเลี้ยงสัตว์ต่อ — คู่ชีวิต > ลูก > หลาน ที่ยังอยู่ ไม่มีใคร = เพื่อนบ้าน
export function petsAfter(st) {
  const pets = (st.kin ?? []).filter((m) => ANIMAL.includes(m.role) && m.alive && !m.left);
  if (!pets.length) return null;
  const keeper = ['spouse', 'child', 'grandchild'].map((r) => st.kin.find((m) => m.role === r && m.alive && !m.left)).find(Boolean);
  const who = keeper ? `${LOSS_WHO[keeper.role]}${keeper.name}` : 'เพื่อนบ้าน';
  return `${pets.map(petLabel).join(' กับ')} ได้${who}รับไปเลี้ยงต่อ`;
}

// มรณบัตร: ใครมาส่ง (B164) — ผลย้อนของความสัมพันธ์ทั้งชีวิต เล่าเป็นคำ ไม่โชว์ค่าและไม่มีชื่อใคร (คนที่จากไปห้ามถูกเรียก)
// คนที่ยังอยู่มาจากที่ไกลได้ (นับคนที่ย้ายออกด้วย) · bond ถึงเกณฑ์ = อยู่ช่วยงาน ต่ำกว่า = แวะมาครู่เดียว (พื้น bond แค่ "เฉย ๆ" ไม่ถึงขั้นไม่มา) · แขกที่เหลือแบ่งตามน้ำหนักเดียวกับสูตรแขก
// ใช้ค่าเฉลี่ยวัยทำงาน ไม่ใช่ค่าตอนตาย — ค่าตกตามวัยชรา แต่คนที่เคยรู้จักกันยังมา · อ่าน state ล้วน ไม่ดึงเลขสุ่ม
export const FUNERAL_WHO = { come: 40, adult: 18, roles: ['spouse', 'child', 'grandchild', 'peer'] };
const WHO_WORD = { spouse: 'คู่ชีวิต', child: 'ลูก', grandchild: 'หลาน', peer: 'เพื่อนรุ่นเดียวกัน' };
const whoList = (by) => {
  const parts = FUNERAL_WHO.roles.filter((r) => by[r]).map((r) => (r === 'spouse' ? WHO_WORD[r] : `${WHO_WORD[r]} ${by[r]} คน`));
  return parts.length > 1 ? `${parts.slice(0, -1).join(' ')} และ${parts.at(-1)}` : parts[0];
};
export function funeralWho(st, guests) {
  const came = {}, away = {};
  let n = 0;
  for (const m of st.kin ?? []) {
    if (!FUNERAL_WHO.roles.includes(m.role) || !m.alive) continue;
    const to = (m.bond ?? BOND_START[m.role]) >= FUNERAL_WHO.come ? came : away;
    to[m.role] = (to[m.role] ?? 0) + 1;
    if (to === came) n++;
  }
  const parts = [];
  if (n) parts.push(`${whoList(came)}อยู่ช่วยงานจนเสร็จ`);
  if (Object.keys(away).length) parts.push(`${whoList(away)}แวะมาแค่ครู่เดียว`);
  const rest = n ? 'แขกที่เหลือส่วนใหญ่' : 'แขกส่วนใหญ่';
  if (guests > n) {
    const trail = (st.statTrail ?? []).filter((p) => p.age >= FUNERAL_WHO.adult);
    const avg = (k) => (trail.length ? trail.reduce((t, p) => t + p[k], 0) / trail.length : st[k]);
    parts.push(`${rest}${avg('network') * 3 > avg('relations') * 2 ? 'เป็นคนในวงการที่เคยร่วมงานกันมา' : 'เป็นเพื่อนบ้านและคนที่เคยช่วยเหลือกันมา'}`);
  } else if (n) parts.push('ศาลามีแต่คนในบ้าน');
  return parts.length ? { text: parts.join(' · '), came: n } : null;
}

// รายชื่อให้แผงครอบครัว (B36c) อ่านอย่างเดียว — ช่องที่ไล่ไว้เท่านั้น ไม่มีค่าบัญชีหรือค่าที่อนุมานกรรมได้
export function familyOf(st) {
  const year = kinYearOf(st);
  const bondOf = (m) => {
    const b = m.bond ?? BOND_START[m.role ?? 'parent'];
    return { bond: b, bondLevel: bondLabel(b) };
  };
  // พ่อแม่ที่ตายก่อนเราเกิด (คู่ของรุ่นก่อนในทางตระกูล) ไม่เคยผ่าน ageParents — อายุตอนตายอยู่ที่ diesAt
  const diedOf = (p) => (p.alive ? null : (p.diedAge ?? p.diesAt ?? null));
  // สาเหตุตาย (B110) ให้ผังตระกูลแสดง — มีเฉพาะคนที่จากไปแล้ว · เซฟก่อนมีสาเหตุไม่มีช่องนี้
  const causeOf = (m) => (!m.alive && m.cause ? { cause: m.cause } : {});
  const parents = st.parents.map((p) => ({ role: 'parent', name: p.name ?? null, sex: p.sex, age: p.alive ? p.age : diedOf(p), alive: p.alive, diedAge: diedOf(p), ...causeOf(p), ...bondOf(p) }));
  const kin = (st.kin ?? []).map((m) => ({ id: m.id, role: m.role, name: m.name, sex: m.sex, age: memberAge(st, m, year), alive: m.alive, diedAge: m.diedAge, ...causeOf(m), ...bondOf(m), ...(m.kind && { kind: m.kind }), ...(m.order && { order: m.order }), ...(m.of !== undefined && { of: m.of }), ...(m.left && { left: true }) }));
  return [...parents, ...kin];
}
