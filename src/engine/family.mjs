// ครอบครัวเป็นคนจริง (B36a): คู่ครอง · ลูก · หลาน มีชื่อ เพศ ปีเกิด ยังอยู่/จากไป · พ่อแม่อยู่ใน st.parents แบบเดิม
// ทุกสุ่มของสมาชิกใหม่มาจาก st.kinRng (stream แยกจากโลกและจาก famRng ของพ่อแม่) — ชีวิตที่ไม่มีครอบครัวของตัวเองไม่ดึงเลขนี้เลย
// ชะตาการตายของพ่อแม่และลำดับสุ่มของโลกจึงเหมือนก่อนมีระบบนี้ทุกหลัก
import { makeRng, mixSeed } from './rng.mjs';
import { pickName } from './birth.mjs';
import { kinDeathRoll, kinCause, inherit, KIN_ILL_TEXT } from './death.mjs';

export const KIN_ROLES = ['partner', 'spouse', 'child', 'grandchild'];
export const FAMILY_ROLE_NAMES = { parent: 'พ่อแม่', partner: 'แฟน', spouse: 'คู่ครอง', child: 'ลูก', grandchild: 'หลาน', pet: 'สัตว์คู่ใจ', herd: 'ฝูงสัตว์', peer: 'เพื่อนรุ่น', courter: 'คนจีบ' };
// ธงเดิมที่เนื้อหาอ่านอยู่ ↔ บทบาทที่ธงนั้นหมายถึง · ตั้งธงจากตัวเลือก = มีสมาชิกคนนั้นเพิ่มขึ้นจริง
const KIN_FLAG_ROLE = { married: 'spouse', has_kids: 'child', raised_grandkids: 'grandchild' };
// ลูกที่โตแล้วมีหลานให้เองปีละโอกาสนี้ ช่วงอายุนี้ ไม่เกินจำนวนนี้ต่อคน — ค่าตั้งของเกม (ไม่มีข้อมูลเจริญพันธุ์รายยุคในชุดข้อมูล)
export const GRANDKID = { from: 22, to: 40, chance: 0.08, max: 3 };
// คู่ครองอายุห่างจากเราได้เท่านี้ (ปีเกิด) · ค่าตั้งของเกม
const KIN_SPOUSE_GAP = [-5, 5];
// pet · herd (B44) · peer (B43) เป็นสมาชิกได้ แต่ไม่ใช่ทายาท ไม่ตั้งธง ไม่มีหลาน — สัตว์ตายตามอายุขัยของชนิด เพื่อนรุ่นตายตามตารางชีพแบบคน
export const KIN_EXTRA_ROLES = ['pet', 'herd', 'peer', 'courter'];
// คนในบ้าน = คนที่การ์ดครอบครัวดูแลถึง และคนที่นับว่า "ยังมีใคร" ตอนแก่ · เพื่อนรุ่นไม่นับ
const KIN_HOUSEHOLD = ['partner', 'spouse', 'child', 'grandchild', 'pet'];

// ความผูกพันรายคน 0–100 (B36a2): ปีที่ไม่ได้ดูแลลดเอง 1 แต่การลดเองไม่พาต่ำกว่า floor — ผลร้ายจากเนื้อหาพาต่ำกว่าได้
export const BOND_START = { parent: 70, partner: 70, spouse: 70, child: 75, grandchild: 60, pet: 65, herd: 50, peer: 50, courter: 50 };
export const BOND_FLOOR = 38;
export const BOND_LEVELS = [[80, 'ผูกพัน'], [60, 'สนิท'], [40, 'คุ้นเคย'], [20, 'เฉย ๆ'], [0, 'ห่างเหิน']];
// การ์ดหมวด family ที่ตัวเลือกให้ความสัมพันธ์บวก = ดูแลคนในบ้านปีนั้น · bond ขึ้นเท่านี้ต่อระดับความสัมพันธ์ (1–3)
const BOND_CARE_PER_REL = 2;
// ญาติช่วยตอนเจอผลร้าย: คนที่ผูกพันตั้งแต่ from ขึ้นไป มีโอกาส (bond − base) / span ช่วยให้เสียหายเหลือ scale
export const KIN_AID = { from: 60, base: 50, span: 120, scale: 0.5, roles: ['spouse', 'child', 'grandchild'] };
// แก่แล้วไม่เหลือคนในบ้านที่ยังอยู่ (คู่ ลูก หลาน สัตว์คู่ใจ) = เสียความสุข/สุขภาพต่อปี · ไม่ดึงเลขสุ่ม — ค่าตั้งของเกม (B167)
export const KIN_LONELY = { from: 65, happiness: 2, health: 0.3 };
// ลูกอยู่ไกล (m.far): ยังเป็นคนในบ้านทุกเรื่อง ต่างจาก left ที่หลุดจากธง has_kids การ์ดเรียกชื่อ ญาติช่วย และความเหงา
// ความผูกพันลดเพิ่มปีละเท่านี้ แม้ปีนั้นได้ดูแล · ไม่ทะลุ BOND_FLOOR
export const KIN_FAR = { decay: 2 };
// ลูกหลังหย่าที่อยู่กับอีกฝ่าย (ใบ 92 ข้อ 154): ผูกพันกับเราจางเพิ่มปีละเท่านี้ · ไม่ทะลุ BOND_FLOOR · ยังเป็นทายาท
export const KIN_CUSTODY = { decay: 2, minorUntil: 18 };
// หย่าแบ่งสินสมรส (ใบ 92 ข้อ 153 · AI ตัดสิน "แบ่งครึ่ง"): ส่วนสมรส = เงินที่งอกจากปีเริ่มอยู่ด้วยกัน (trail) ถึงวันหย่า · เสียสัดส่วนนี้ของส่วนนั้น
export const DIVORCE_SPLIT = 0.5;
// ลูกไม่ใช่ลูก (ใบ 95 ข้อ 149 166): ผู้เล่นชายเท่านั้น · ลูกที่เกิดช่วงคู่นอกใจ (ปีเกิด − ปีที่จด spouse_cheated อยู่ใน [-before, after]) มีโอกาส p ที่ไม่ใช่ลูกทางสายเลือดของเรา
// ทอยจาก seed+id ไม่ดึง kinRng · paternity: 'kept' ยังเป็นลูกเรา (ผูกพันขึ้น keepBond) · 'cut' ตัดขาด (ผูกพันตกเหลือ cutTo) · ทั้งสองทางทายาทเท่าเดิม ต่างแค่ไม่ได้ประวัติโรคกรรมพันธุ์ฝั่งเรา
export const NOT_MINE = { p: 0.3, before: 1, after: 2, keepBond: 4, cutTo: 15 };
// เราดูแลพ่อแม่แบบไหน (B167) — ตัวเลือกการ์ดดูแลพ่อแม่ติด filial · จดเฉพาะชีวิตนี้ ไม่ส่งต่อรุ่น
// way = วิธีครั้งล่าสุด (การ์ดชราให้ลูกทำแบบเดียวกัน) · score = บุญดูแลพ่อแม่ − บาปทำร้ายผู้ใหญ่ ตามระดับของตัวเลือก
// ถึงอายุ at ลูกที่ยังอยู่ได้ bond ± step × score (ไม่เกิน cap) — ลูกที่เห็นเราดูแลพ่อแม่ผูกพันกับเรามากขึ้น · kinAid ทำงานต่อเอง
export const FILIAL_WAYS = ['self', 'share', 'hire', 'home', 'away'];
export const FILIAL = { at: 60, step: 3, cap: 5 };

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
// อัตลักษณ์: ค่าเดียวที่เปิด (เจ้าของเคาะ decisions 423) · ได้จากการ์ดวัยรุ่นที่ผู้เล่นเลือก · ไม่มีช่อง = ตามเพศกำเนิด (ชีวิตเดิม/เซฟเก่าเท่าเดิม)
// birth = เพศกำเนิดที่ตั้งค่านี้ได้ (lint ตรวจ when.sex ของการ์ดที่ตั้ง) · partner = เพศของคู่ · ตารางชีพยังตามเพศกำเนิด
export const BIRTH_IDENTITY = 'ตามเพศกำเนิด';
export const IDENTITY = { หญิงข้ามเพศ: { birth: ['ชาย'], partner: 'ชาย', speech: 'หญิง' } };
export const IDENTITIES = [BIRTH_IDENTITY, ...Object.keys(IDENTITY)];
export const identityOf = (st) => st.identity ?? BIRTH_IDENTITY;
// เพศที่ตัวละครใช้พูดถึงตัวเอง (คำลงท้าย · สรรพนาม) — อัตลักษณ์ทับเพศกำเนิด
export const speechSex = (st) => IDENTITY[st.identity]?.speech ?? st.sex;
// ไม่ดึงเลขสุ่ม — ชีวิตที่ไม่มีอัตลักษณ์ได้คู่ต่างเพศกำเนิดเหมือนเดิมทุกหลัก
const partnerSex = (st) => IDENTITY[st.identity]?.partner ?? kinOtherSex(st.sex);
const kinInRange = (v, r) => !r || (v >= r[0] && v <= r[1]);
const kinYearOf = (st) => st.birthYear + st.age;
export const memberAge = (st, m, year = kinYearOf(st)) => (m.alive ? year - m.born : m.diedAge);

export function newKin(seed) {
  return { kin: [], kinRng: makeRng(seed ^ 0x510e527f), kinSeq: 0, kinCared: false, kinFocus: {}, kinLoss: [] };
}

// ชื่อทุกคนในบ้าน (รวมรุ่นก่อนในผังตระกูล) — ชื่อใหม่เลี่ยงชุดนี้
const kinTakenNames = (st) => [st.name, ...st.parents.map((p) => p.name), ...st.kin.flatMap((m) => [m.name, m.mate]), ...(st.lineage ?? []).map((l) => l.name)].filter(Boolean);

// พ่อแม่ที่ยังไม่มีชื่อ (ชีวิตแรก/ทางเกิดใหม่) ได้ชื่อจาก seed ตามยุคปีเกิดของเขา — ไม่ดึงเลขสุ่ม ไม่แตะชื่อผู้เล่น
export function nameParents(st) {
  st.parents.forEach((p, i) => {
    p.name ??= pickName(mixSeed(st.seed, 0x9a01 + i), p.sex, st.birthYear - p.age, st.content.era.names, kinTakenNames(st));
    p.bond ??= BOND_START.parent;
  });
}

// extra: of (หลาน = id ลูกที่เป็นพ่อแม่) · สัตว์เลี้ยง kind (ชนิด) + life [จาก, ถึง] (อายุขัยของชนิด) + name? (เนื้อหาตั้งให้ · ไม่ตั้ง = เรียกตามชนิด)
// แฟน (ใบ 90) เข้ามากลางชีวิตได้โดยไม่ขยับลำดับสุ่ม/ชื่อของคนที่มาทีหลัง: id นับแยก (OWN_ID_BASE+) · ปีเกิด/ทอยตายใช้สุ่มจาก seed+id+ปี ไม่ใช่ kinRng/kinCauseRng · own = ติดตัวไปตลอดแม้แต่งแล้วเปลี่ยนบทเป็นคู่
const OWN_ID_BASE = 10000;
const ownRoll = (st, m, year, salt) => makeRng(mixSeed(st.seed ^ salt, m.id * 1000 + (year % 1000)));
export function addMember(st, role, extra = {}) {
  const year = kinYearOf(st);
  // จีบซ้อนได้ไม่เกิน COURT_MAX คน (ใบ 172 ข้อ 307) · คนที่ 3 ไม่เข้า
  if (role === 'courter' && livingOf(st, 'courter').length >= COURT_MAX) return null;
  const own = role === 'partner' || role === 'courter';
  const id = own ? OWN_ID_BASE + (st.ownSeq = (st.ownSeq ?? 0) + 1) : ++st.kinSeq;
  // สัตว์ติดบ้าน/ส่งต่อทายาทส่ง sex born maxAge มาเอง — ไม่ดึง kinRng ลำดับสุ่มของคนในบ้านจึงไม่ขยับ
  const mate = role === 'spouse' || role === 'partner' || role === 'courter';
  const sex = extra.sex ?? (mate ? partnerSex(st) : st.kinRng.next() < 0.5 ? 'ชาย' : 'หญิง');
  const born0 = extra.born ?? (mate ? st.birthYear + (own ? makeRng(mixSeed(st.seed ^ 0x7a10, id)) : st.kinRng).int(...KIN_SPOUSE_GAP) : role === 'peer' ? st.birthYear : year);
  // คนจีบต้องถึงเกณฑ์แฟน (≥18) เท่าผู้เล่น (ข้อ 309) · ย้ายปีเกิดหลังสุ่มแล้ว ไม่ดึงเลขเพิ่ม
  const born = role === 'courter' ? Math.min(born0, year - COURT_MIN.partner) : born0;
  // ชื่อคู่ใจสุ่มจาก seed+id ไม่ดึงเลข · ฝูงไม่มีชื่อ
  const name = role === 'herd' ? null : role === 'pet' ? (extra.name ?? petName(st, extra.kind, id)) : pickName(mixSeed(st.seed, 0x4b1d + id), sex, born, st.content.era.names, kinTakenNames(st));
  const m = { id, role, sex, born, alive: true, diedAge: null, name, bond: extra.bond ?? BOND_START[role], ...(own && { own: true }) };
  if (ANIMAL.includes(role)) {
    m.kind = extra.kind;
    m.maxAge = extra.maxAge ?? st.kinRng.int(...extra.life);
  }
  // อายุของเราตอนคู่เข้าบ้าน — ให้แผงบอก "อยู่ด้วยกัน N ปี" ของคู่เก่า · เซฟก่อนมีช่องนี้ไม่มี since
  if (mate) m.since = st.age;
  // คนจีบ (ใบ 172 ขั้น 2): เจอ → จีบ → แฟน เดินด้วยนัดล่วงหน้า (ปีที่ครบกำหนดสุ่มจาก seed+id ไม่ดึง kinRng) · extra.after = [น้อย, มาก] ปีถึงขั้นถัดไป
  if (role === 'courter') { m.stage = 'met'; courtDue(st, m, extra.after); }
  if (role === 'child') {
    m.order = st.kin.filter((x) => x.role === 'child').length + 1;
    // พ่อ/แม่อีกคน (ใบ 91 ข้อ 149 154 166): id ของคู่ปัจจุบันตอนลูกเกิด · null = ไม่มีคู่ (พ่อ/แม่เลี้ยงเดี่ยว) · ลูกจากเซฟเก่าไม่มีช่อง by = คิดย้อนจากปีเกิด (parentSpouseOf)
    m.by = spouseOf(st)?.id ?? null;
    if (notMineBorn(st, m)) m.notMine = true;
  }
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

// เงินของเราตอนคู่เข้าบ้าน (จาก trail รายปี) · ไม่มี since/trail (เซฟเก่า) = ไม่แบ่ง · ฐานติดลบนับ 0 · ไม่งอก = ไม่เสีย
function splitMarital(st, m) {
  if (m.since === undefined || !st.trail) return;
  const at = st.trail.find((p) => p.year === st.birthYear + m.since);
  if (!at) return;
  const grew = st.money - Math.max(0, at.money);
  if (st.money > 0 && grew > 0) st.money -= grew * DIVORCE_SPLIT;
}
// เงื่อนไขการ์ดตามคู่ปัจจุบัน (when.spouse): status = together|apart · bond [lo,hi] · together [lo,hi] ปีที่อยู่ด้วยกัน · apart [lo,hi] ปีที่แยกทางมาแล้ว · wed [lo,hi] ปี พ.ศ. ที่แต่งกับคู่นี้ (birthYear + since)
// คู่ที่หย่าแล้วไม่นับ · เซฟเก่าไม่มี since/leftAge = เงื่อนไขช่วงปีไม่ผ่าน
export function spouseOk(st, w) {
  const m = (st.kin ?? []).findLast((x) => x.role === 'spouse' && x.alive && spouseStatus(x) !== 'divorced');
  if (!m) return false;
  if (w.status && spouseStatus(m) !== w.status) return false;
  if (w.bond && !kinInRange(m.bond ?? BOND_START.spouse, w.bond)) return false;
  if (w.wed && (m.since === undefined || !kinInRange(st.birthYear + m.since, w.wed))) return false;
  if (w.together && (m.left || m.since === undefined || !kinInRange(st.age - m.since, w.together))) return false;
  if (w.apart && (spouseStatus(m) !== 'apart' || m.leftAge === undefined || !kinInRange(st.age - m.leftAge, w.apart))) return false;
  return true;
}

// ลูกที่เกิดช่วงคู่นอกใจและทอยได้ว่าไม่ใช่ลูกเรา (ใบ 95) · เซฟก่อนมีช่องไม่มี notMine = ลูกเราทั้งหมด
function notMineBorn(st, m) {
  const at = st.flagAge?.spouse_cheated;
  if (st.sex !== 'ชาย' || !st.flags.spouse_cheated || at === undefined || m.by === null) return false;
  const d = st.age - at;
  return d >= -NOT_MINE.before && d <= NOT_MINE.after && makeRng(mixSeed(st.seed ^ 0x95c1, m.id)).next() < NOT_MINE.p;
}
// when.child_not_mine = {age?: [lo, hi]} — ลูกที่ยังอยู่ ไม่ใช่ลูกเรา ยังไม่ได้ตัดสิน (ไม่มี paternity) · การ์ดเรียกลูกคนนั้น (โตสุดก่อน ไม่ดึงเลขสุ่ม)
const childNotMineList = (st, w) => st.kin.filter((m) => m.role === 'child' && m.alive && !m.left && m.notMine && !m.paternity && kinInRange(kinYearOf(st) - m.born, w.age));
export const childNotMineOk = (st, w) => childNotMineList(st, w).length > 0;
export function focusChildNotMine(st, w) {
  const m = childNotMineList(st, w)[0];
  if (m) st.kinFocus.child = m.id;
}

// when.ex_spouse = {within: [lo, hi]} — คู่เก่าที่หย่าแล้วและยังอยู่ · หย่ามาแล้ว lo–hi ปี · เรายังโสด (ไม่มีคู่/แฟนอยู่ในบ้าน) · คืนดีได้ครั้งเดียวต่อชีวิต m.reunited (ใบ 97)
// spouseOk ตัดคู่ที่หย่าทิ้ง จึงมีฟังก์ชันของตัวเอง · การ์ดเรียกคู่เก่าล่าสุด ไม่ดึงเลขสุ่ม
const exSpouseOf = (st, w) => {
  if (st.kin.some((m) => m.reunited !== undefined)) return null;
  if (st.kin.some((m) => (m.role === 'spouse' && m.alive && !isDivorced(m)) || (m.role === 'partner' && m.alive && !m.left))) return null;
  const m = st.kin.findLast((x) => x.role === 'spouse' && x.alive && isDivorced(x));
  return m && m.divorcedAge !== undefined && kinInRange(st.age - m.divorcedAge, w.within) ? m : null;
};
export const exSpouseOk = (st, w) => exSpouseOf(st, w) !== null;
export function focusExSpouse(st, w) {
  const m = exSpouseOf(st, w);
  if (m) st.kinFocus.spouse = m.id;
}

const livingOf = (st, role) => st.kin.filter((m) => m.role === role && m.alive && !m.left);
// สถานะคู่ (ใบ 89 B114 ข้อ 145 164): together อยู่ด้วยกัน · apart แยกทาง (ยังมีคู่ตามกฎหมาย แต่งใหม่ไม่ได้) · divorced หย่า · ม่าย = ตายแล้วและไม่ได้หย่า (derived)
// ไม่มีช่อง = together (เซฟเก่า) · หย่าแล้วไม่นับเป็นคู่ในงานศพ/จดหมาย/ผู้ถูกหยิบเป็นพ่อแม่ทายาท และคู่ที่หย่าแล้วตายไม่ลงบันทึกสูญเสีย
export const spouseStatus = (m) => m.status ?? 'together';
export const isDivorced = (m) => m.role === 'spouse' && m.status === 'divorced';
// พ่อ/แม่อีกคนของลูก (รวมคู่ที่หย่าไปแล้ว — เขายังเป็นพ่อ/แม่) · ลูกที่จด by ใช้ตามนั้น · เซฟเก่าไม่มี by = คู่ที่อยู่ตอนลูกเกิด (since ล่าสุดที่ไม่เกินอายุเราตอนลูกเกิด) ไม่เจอก็คู่ล่าสุด · ไม่มีคู่เลย = null
export function parentSpouseOf(st, child) {
  const rows = (st.kin ?? []).filter((m) => m.role === 'spouse');
  if (child?.by !== undefined) return rows.find((m) => m.id === child.by) ?? null;
  if (!rows.length) return null;
  const at = child.born - st.birthYear;
  return rows.findLast((m) => (m.since ?? 0) <= at) ?? rows.at(-1);
}
// บทแฟน (ใบ 90 ข้อ 146 165): partner = คนมีชื่อในบ้าน ไม่ใช่สถานะของคู่ · เลิกกัน = status ex (ออกจากบ้าน · ชื่อยังอ้างได้) · แต่งกับแฟน = คนเดิมเปลี่ยนบทเป็น spouse
export const isEx = (m) => m.role === 'partner' && m.status === 'ex';
export const exPartnerOf = (st) => (st.kin ?? []).findLast((m) => isEx(m)) ?? null;
// เกณฑ์อายุขั้นความสัมพันธ์ (ข้อ 309): แฟน ≥18 · คู่ ≥20 ทั้งผู้เล่นและอีกฝ่าย · จีบซ้อนพร้อมกัน ≤2 (ข้อ 307)
export const COURT_MIN = { partner: 18, spouse: 20 };
const COURT_MAX = 2;
const COURT_STEP_YEARS = [1, 2];
// นัดขั้นถัดไปของคนจีบ: สุ่มจำนวนปีจาก seed+id+ปีที่นัด ไม่ใช่ kinRng/rng ชีวิต — ชีวิตที่ไม่มีคนจีบไม่มีอะไรขยับ
function courtDue(st, m, after = COURT_STEP_YEARS) {
  m.due = st.age + ownRoll(st, m, kinYearOf(st), 0xc5ed).int(after[0], after[1]);
}
// เดินขั้นคนจีบปีละครั้ง (เรียกใน ageKin): ครบกำหนด met→courting→แฟน (becomePartner · เข้าบ้านตอนเป็นแฟนตามข้อ 305) · ขอแต่งเป็นของการ์ด/ใบ 173
export function stepCourtship(st) {
  for (const m of st.kin) {
    if (m.role !== 'courter' || !m.alive || m.left || m.due === undefined || st.age < m.due) continue;
    if (m.stage === 'met') {
      m.stage = 'courting';
      courtDue(st, m);
    } else if (m.stage === 'courting') {
      // ยังไม่ถึงเกณฑ์แฟนทั้งสองฝ่าย = รอปีหน้า
      if (st.age < COURT_MIN.partner || kinYearOf(st) - m.born < COURT_MIN.partner) { m.due = st.age + 1; continue; }
      delete m.stage;
      delete m.due;
      becomePartner(st, m);
    }
  }
}
// รับคนที่มีอยู่แล้วนอกบ้าน (เช่น courter ของใบ 172 · peer) เป็นแฟน: id/ชื่อ/เพศ/ปีเกิดเดิม · เริ่มนับปีคบจากอายุตอนนี้ · ไม่ดึงเลขสุ่ม · คนในบ้านอยู่ในหมวดคู่/แฟนอยู่แล้ว = ไม่ทำอะไร
export function becomePartner(st, m) {
  if (!m || !m.alive || m.role === 'partner' || m.role === 'spouse') return null;
  // เลือกคนเดียวเป็นแฟน คนจีบที่เหลือหลุด (ข้อ 307) · ออกจากรายชื่อคนจีบแต่ชื่อยังอยู่ในบันทึก
  for (const o of st.kin) if (o !== m && o.role === 'courter' && o.alive && !o.left) { o.left = true; o.leftAge = st.age; o.status = 'dropped'; }
  m.role = 'partner';
  m.since = st.age;
  m.bond = m.bond ?? BOND_START.partner;
  delete m.left;
  delete m.leftAge;
  delete m.status;
  return m;
}
function marryPartner(st, m) {
  m.dated = { since: m.since, ...(m.endedBy && { endedBy: m.endedBy }) };
  m.role = 'spouse';
  m.since = st.age;
  delete m.status;
  delete m.endedBy;
  delete m.left;
  delete m.leftAge;
}
// คู่ปัจจุบัน: อยู่ด้วยกัน > แยกทาง > ม่ายล่าสุด · ไม่รวมคู่ที่หย่า · ไม่มี = null
export function spouseOf(st) {
  const rows = (st.kin ?? []).filter((m) => m.role === 'spouse' && !isDivorced(m));
  return rows.findLast((m) => m.alive && !m.left) ?? rows.findLast((m) => m.alive) ?? rows.at(-1) ?? null;
}
// ลูกที่ยังมีชีวิต นับแบบเดียวกับที่ afterlife.mjs หารมรดก (ย้ายออกไปแล้วยังเป็นทายาท) · ไม่มีระบบครอบครัว = null
export const livingChildren = (st) => (st.kin ? st.kin.filter((m) => m.role === 'child' && m.alive).length : null);

// คนที่การ์ดเรียกชื่อ = คนที่ผลการ์ดไปลง ต้องเป็นคนเดียวกันตลอดใบ (ข้อความ · ตัวเลือก · ผลสุ่ม) — สุ่มจาก kinRng ตอนการ์ดขึ้น
// ทอยเฉพาะบทบาทที่มีคนให้เลือก ≥2 — ชีวิตที่ไม่มีครอบครัว/มีคนเดียวไม่ดึงเลข
export function pickFocus(st) {
  st.kinFocus = {};
  for (const role of ['partner', 'spouse', 'child', 'grandchild', 'pet', 'herd']) {
    const live = livingOf(st, role);
    if (live.length) st.kinFocus[role] = (live.length > 1 ? live[st.kinRng.int(0, live.length - 1)] : live[0]).id;
  }
  // คนจีบ (ใบ 172): จีบพร้อมกัน ≥2 คน เลือกคนเป้าจาก seed+ปีของเรา ไม่ดึง kinRng — ชีวิตที่ไม่มีคนจีบไม่มีอะไรขยับ
  const courting = livingOf(st, 'courter');
  if (courting.length) st.kinFocus.courter = (courting.length > 1 ? courting[makeRng(mixSeed(st.seed ^ 0xc0e7, st.age)).int(0, courting.length - 1)] : courting[0]).id;
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
  else if (m.role !== 'herd') m.cause = cause ?? kinCause(st.content.era, st.seed, m.own ? ownRoll(st, m, kinYearOf(st), 0x7a12) : st.kinCauseRng, m.sex, kinYearOf(st), m.diedAge);
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
  // อายุของเราตอนพ่อ/แม่จากไป — การ์ดย้อนความทรงจำ (B168) เล่า · diedAge เป็นอายุของพ่อแม่
  p.diedAtYou ??= st.age;
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
  for (const m of list) {
    const b = m.bond ?? BOND_START[m.role ?? 'parent'];
    // ลดไม่ทะลุ BOND_FLOOR (การ์ดทะเลาะใบ 92) — ด่าน family ถือช่วงพื้น–100 · บวกยังตัดที่ 100
    m.bond = d < 0 ? (b > BOND_FLOOR ? Math.max(BOND_FLOOR, b + d) : b) : bondClamp(b + d);
  }
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
    if (op.leave) for (const m of livingOf(st, op.leave)) {
      m.left = true;
      m.leftAge = st.age;
    }
    // เลิกกับแฟน: by = us (เราบอกเลิก · ค่าตั้งต้น) | them (เขาบอกเลิก) · แต่งกับแฟน = แฟนคนเดิมเป็นคู่ (id ชื่อเดิม) ไม่มีแฟน = เพิ่มคู่ใหม่
    if (op.breakup) for (const m of livingOf(st, op.breakup)) {
      m.status = 'ex';
      m.left = true;
      m.leftAge = st.age;
      m.endedBy = op.by === 'them' ? 'them' : 'us';
    }
    if (op.marry) {
      const m = livingOf(st, op.marry).at(-1);
      if (m) marryPartner(st, m);
      else if (!livingOf(st, 'spouse').length) addMember(st, 'spouse');
    }
    // แยกทาง: ออกจากบ้านแต่ยังเป็นคู่ (ธง married ไม่หาย) · หย่า: จบความเป็นคู่ + ธง divorced ให้เนื้อหาแต่งใหม่/คืนดีอ่าน
    if (op.separate) for (const m of livingOf(st, op.separate)) {
      m.status = 'apart';
      m.left = true;
      m.leftAge = st.age;
    }
    if (op.divorce) {
      for (const m of st.kin.filter((x) => x.role === op.divorce && x.alive && spouseStatus(x) !== 'divorced')) {
        m.status = 'divorced';
        m.left = true;
        m.leftAge ??= st.age;
        m.divorcedAge = st.age;
        splitMarital(st, m);
      }
      st.flags.divorced = true;
      st.flagAge.divorced ??= st.age;
    }
    // คืนดีช่วงแยกทาง: กลับเข้าบ้าน สถานะ together · ผูกพันขยับด้วย op bond ในการ์ดเอง
    if (op.reconcile) for (const m of st.kin.filter((x) => x.role === 'spouse' && x.alive && spouseStatus(x) === 'apart')) {
      m.status = 'together';
      m.left = false;
      delete m.leftAge;
      m.reconciledAge = st.age;
    }
    // คืนดีหลังหย่า (ใบ 97): คู่เก่าคนเดิม (id/ชื่อ/ผูกพันที่ค้างไว้) กลับเป็นคู่ · อายุแต่งนับรอบใหม่ · m.reunited กันซ้ำ · ex_bitter ของคู่คนนี้จบลง ไม่งั้นการ์ดแฟนเก่ากลับมา (B166) อ่านเป็นคนอื่น
    if (op.remarry) {
      const m = st.kin.find((x) => x.id === st.kinFocus?.spouse && isDivorced(x) && x.alive) ?? st.kin.findLast((x) => isDivorced(x) && x.alive);
      if (m && !st.kin.some((x) => x.reunited !== undefined || (x.role === 'spouse' && x.alive && !isDivorced(x)))) {
        m.status = 'together';
        m.left = false;
        delete m.leftAge;
        m.since = st.age;
        m.reunited = st.age;
        m.reunitedGap = st.age - (m.divorcedAge ?? st.age);
        delete m.divorcedAge;
        for (const c of st.kin) if (c.role === 'child' && c.by === m.id) delete c.custody;
        delete st.flags.ex_bitter;
      }
    }
    // ลูกเล็กของคู่ที่หย่า: self = เราเลี้ยง · other = อยู่กับอีกฝ่าย (ผูกพันจางเร็วกว่า) · ทั้งสองทางยังเป็นทายาท
    if (op.custody) for (const c of st.kin) {
      if (c.role !== 'child' || !c.alive || memberAge(st, c) >= KIN_CUSTODY.minorUntil) continue;
      if (!isDivorced(parentSpouseOf(st, c) ?? {})) continue;
      c.custody = op.custody;
    }
    // ตัดสินลูกที่ไม่ใช่ลูกเรา (ใบ 95): keep = ยังเป็นลูกเรา · cut = ตัดขาด · จดครั้งเดียวต่อคน
    if (op.paternity) {
      const m = st.kin.find((x) => x.id === st.kinFocus?.child && x.notMine && !x.paternity && x.alive) ?? st.kin.find((x) => x.role === 'child' && x.notMine && !x.paternity && x.alive);
      if (m) {
        m.paternity = op.paternity === 'keep' ? 'kept' : 'cut';
        m.paternityAge = st.age;
        if (op.paternity === 'keep') bondAdd(st, [m], NOT_MINE.keepBond);
        else m.bond = Math.min(m.bond ?? BOND_START.child, NOT_MINE.cutTo);
      }
    }
    if (op.far || op.back) {
      const m = focusOf(st, op.far ?? op.back);
      if (m?.alive) m.far = !!op.far;
    }
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
    if (role === 'spouse' && !livingOf(st, 'spouse').length && livingOf(st, 'partner').length && !ops.some((op) => op.marry)) {
      marryPartner(st, livingOf(st, 'partner').at(-1));
      continue;
    }
    if (role === 'spouse' && (livingOf(st, 'spouse').length || st.kin.some((m) => m.role === 'spouse' && m.alive && m.status === 'apart'))) continue;
    addMember(st, role);
  }
  if (care > 0) bondAdd(st, bondTargets(st, 'all'), care * BOND_CARE_PER_REL);
  kinSyncFlags(st);
}

// ธงเดิมตามสมาชิกจริง: married = มีคู่ที่ยังอยู่ด้วยกัน · has_kids = มีลูกที่ยังอยู่ · raised_grandkids เป็นเรื่องที่เคยทำ ไม่ถอด
function kinSyncFlags(st) {
  for (const [f, role] of [['married', 'spouse'], ['has_kids', 'child']]) {
    if (livingOf(st, role).length || (role === 'spouse' && st.kin.some((m) => m.role === 'spouse' && m.alive && m.status === 'apart'))) {
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
  for (const m of st.kin) if (m.far && m.alive && m.bond > BOND_FLOOR) m.bond = Math.max(BOND_FLOOR, m.bond - KIN_FAR.decay);
  for (const m of st.kin) if (m.custody === 'other' && m.alive && m.bond > BOND_FLOOR) m.bond = Math.max(BOND_FLOOR, m.bond - KIN_CUSTODY.decay);
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
  if (isDivorced(m) || isEx(m)) return;
  if (m.role === 'pet') st.happiness = bondClamp(st.happiness - PET_GRIEF);
  const loss = { id: m.id, role: m.role, name: m.name, age, year, ...(m.kind && { kind: m.kind }), ...(m.cause && { cause: m.cause }), ...(m.since !== undefined && { since: m.since }) };
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
  filialMirror(st);
  const lost = [];
  if (!st.kin.length) return lost;
  stepCourtship(st);
  petYear(st, saving);
  for (const m of [...st.kin]) {
    if (!m.alive) continue;
    const a = year - m.born - 1;
    // คนจีบ (ใบ 172 ข้อ 305) อยู่นอกบ้านแบบเพื่อนรุ่น: ไม่ทอยตาย ไม่ดึง kinRng/kinCauseRng — ชีวิตที่มีคนจีบกับไม่มีจึงได้ญาติ/ผลตายชุดเดียวกัน
    if (m.role === 'courter') continue;
    if (ANIMAL.includes(m.role)) {
      if (a + 1 >= m.maxAge) {
        if (m.role === 'pet') m.cause = petCause(st, m);
        kinLost(st, m, a + 1, year, lost);
      }
      continue;
    }
    const cause = m.own
      ? kinDeathRoll(st.content.era, st.seed, ownRoll(st, m, year, 0x7a12), m, year, a, ownRoll(st, m, year, 0x7a11).next())
      : kinDeathRoll(st.content.era, st.seed, st.kinCauseRng, m, year, a, st.kinRng.next());
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
const LOSS_WHO = { partner: 'แฟน', spouse: 'คู่ชีวิต', child: 'ลูก', grandchild: 'หลาน' };
const lossParentWord = (l) => (l.sex === 'หญิง' ? 'แม่' : 'พ่อ');
const PET_LOSS_TEXT = {
  old: (who, age) => `${who}หลับไปอย่างสงบตามวัย ด้วยวัย ${age} ปี`,
  sick: (who, age) => `${who}ป่วยหนักแล้วจากไป ด้วยวัย ${age} ปี`,
  accident: (who, age) => `${who}ประสบอุบัติเหตุจากไปกะทันหัน ตอนอายุ ${age} ปี`,
};
export function lossText(l) {
  if (l.role === 'herd') return `ฝูง${l.kind}ที่เลี้ยงไว้ค่อย ๆ หมดไป ไม่ได้เลี้ยงต่อแล้ว`;
  const who = l.role === 'pet' ? (l.name ? `เจ้า${l.name} ${l.kind}ที่เลี้ยงไว้` : `${l.kind}ที่เลี้ยงไว้`) : l.role === 'parent' ? `${lossParentWord(l)}${l.name ?? ''}` : `${LOSS_WHO[l.role]}${l.name}`;
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
// after = ต้องผ่านมาอย่างน้อยกี่ปี (B165 ช่วงไว้ทุกข์ — การ์ดรักใหม่ไม่ขึ้นก่อนพ้นช่วง)
export function lossOk(st, w) {
  const year = kinYearOf(st);
  const match = (st.kinLoss ?? []).filter((l) => !w.roles || w.roles.includes(l.role));
  // after > 0: ช่วงไว้ทุกข์นับจากการสูญเสียล่าสุดเท่านั้น — คู่คนก่อนที่จากไปนานแล้วต้องไม่ปลดล็อกให้ตอนคู่คนใหม่เพิ่งตาย
  const pool = w.after > 0 ? match.slice(-1) : match;
  return pool.some((l) => year - l.year >= (w.after ?? 0) && year - l.year <= (w.within ?? 0));
}
// ชื่อคนที่จากไปล่าสุด ให้การ์ดสูญเสียเรียก ({ชื่อผู้จากไป})
// พ่อแม่ไม่นับ: ผู้เรียกคือการ์ดสัตว์เลี้ยง ถ้าพ่อแม่ตายทีหลังจะเรียกชื่อพ่อแม่แทนสัตว์
export const lastLoss = (st) => (st.kinLoss ?? []).findLast((l) => l.role !== 'parent') ?? null;
// คู่ที่จากไปล่าสุด ({ชื่อคู่เก่า}) — คนที่จากไปล่าสุดอาจเป็นสัตว์หรือลูก การ์ดรักใหม่จึงเรียกคู่ตรง ๆ
export const lastSpouseLoss = (st) => (st.kinLoss ?? []).findLast((l) => l.role === 'spouse') ?? null;
// ปีที่อยู่ด้วยกัน ({ปีคู่เก่า}): อายุตอนแต่ง = flagAge.married (ไม่ถูกลบตอนธงหลุด) · ไม่รู้อายุตอนแต่ง = ไม่บอกเลขปี
export function spouseYears(st) {
  const l = lastSpouseLoss(st);
  const wed = l?.since ?? st.flagAge?.married;
  return l && wed !== undefined ? Math.max(1, l.year - st.birthYear - wed) : null;
}
// ชื่อที่การ์ดสูญเสียเรียก — สัตว์เรียกแบบ petCall
export const lossCall = (l) => (ANIMAL.includes(l.role) ? petCall(l) : l.name);

// ลูกที่การ์ดย้ายไกล/กลับพร้อมหลานพูดถึง: far = อยู่ไกลอยู่ไหม · age = อายุลูก · grandkids = ต้องมีหลานที่ยังอยู่จากลูกคนนี้
const grandkidsOf = (st, m) => st.kin.filter((g) => g.role === 'grandchild' && g.of === m.id && g.alive && !g.left);
const childFarList = (st, w) => {
  const year = kinYearOf(st);
  return st.kin.filter((m) => m.role === 'child' && m.alive && !m.left && !!m.far === w.far && kinInRange(year - m.born, w.age) && (!w.grandkids || grandkidsOf(st, m).length));
};
export const childFarOk = (st, w) => childFarList(st, w).length > 0;
// การ์ด when.child_far ต้องเรียกลูกคนที่ตรงเงื่อนไข ไม่ใช่คนที่ pickFocus สุ่มได้ · เอาคนโตสุด ไม่ดึงเลขสุ่ม
export function focusChildFar(st, w) {
  const m = childFarList(st, w)[0];
  if (!m) return;
  st.kinFocus.child = m.id;
  const g = grandkidsOf(st, m)[0];
  if (g) st.kinFocus.grandchild = g.id;
}
// ชื่อคู่ของลูกอยู่บนตัวลูก ไม่ใช่สมาชิกอีกคน · สุ่มจาก seed+id ครั้งแรกที่ถูกเรียก ไม่ดึง kinRng เซฟเก่าจึงได้ชื่อเอง
export function childMate(st, m) {
  if (!m) return null;
  m.mate ??= pickName(mixSeed(st.seed, 0x3a7e + m.id), kinOtherSex(m.sex), m.born, st.content.era.names, kinTakenNames(st));
  return m.mate;
}
export const childMateWord = (m) => (m?.sex === 'หญิง' ? 'ลูกเขย' : 'ลูกสะใภ้');

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

// จดการดูแลพ่อแม่จากตัวเลือก (ผู้เรียกคิด score จากป้ายบุญบาป) · ผลสุ่มของตัวเลือกเดียวกันเติมแค่ score ไม่นับครั้งซ้ำ
export function filialNote(st, way, score, outcome = false) {
  st.filial ??= { way, n: 0, score: 0 };
  st.filial.way = way;
  if (!outcome) st.filial.n += 1;
  st.filial.score += score;
}
// ลูกเลียนแรงที่เราเคยดูแลพ่อแม่ — ครั้งเดียวตอนถึงอายุ at · ไม่ดึงเลขสุ่ม · ไม่ตั้ง kinCared (ไม่ใช่การดูแลปีนี้)
function filialMirror(st) {
  if (st.age !== FILIAL.at || !st.filial?.n) return;
  const d = Math.round(FILIAL.step * Math.max(-FILIAL.cap, Math.min(FILIAL.cap, st.filial.score)));
  if (!d) return;
  for (const m of st.kin) {
    if (m.role !== 'child' || !m.alive || m.left) continue;
    const b = m.bond ?? BOND_START.child;
    // ลดไม่ทะลุ floor แบบเดียวกับปีที่ไม่ได้ดูแล — bondClamp ตัดที่ 0 ทำลูกหลุดช่วงที่ด่าน family บังคับ
    m.bond = d > 0 ? bondClamp(b + d) : b > BOND_FLOOR ? Math.max(BOND_FLOOR, b + d) : b;
  }
}
// เงื่อนไขการ์ดตอนเราแก่ (when.filial): เคยดูแลพ่อแม่ n ครั้ง · วิธีล่าสุดอยู่ใน way
export function filialOk(st, w) {
  const n = st.filial?.n ?? 0;
  return kinInRange(n, w.n ?? [1, Infinity]) && (!w.way || (n > 0 && w.way.includes(st.filial.way)));
}
// ลูกเลียนวิธี: ประโยคที่ลูกบอกเรา ฉายวิธีที่เราเคยใช้กับพ่อแม่ ({ลูกดูแลแบบเรา}) · ไม่บอกตัวเลข
const FILIAL_MIRROR = {
  self: (p) => `"เดี๋ยวลูกลาออกมาอยู่กับ${p}เอง" — ประโยคเดียวกับที่คุณเคยพูดตอนพ่อแม่ของคุณล้ม`,
  share: () => '"พี่น้องแบ่งเวรกันแล้ว คนละวัน" — ตารางแบบเดียวกับที่คุณเคยนั่งแบ่งกับญาติตอนพ่อแม่ของคุณป่วย',
  hire: (p) => `"ลูกจ้างคนมาดูแล${p}ประจำ วันหยุดจะแวะมา" — แบบเดียวกับที่คุณเคยจ้างคนดูแลพ่อแม่ของคุณ`,
  home: (p) => `"ลูกหาบ้านพักคนชราดี ๆ ไว้ให้${p}แล้ว" — แบบเดียวกับที่คุณเคยพาพ่อแม่ของคุณไปส่ง`,
  away: () => '"งานลูกยุ่งมาก จะโอนเงินมาให้ทุกเดือน" — แบบเดียวกับที่คุณเคยทำกับพ่อแม่ของคุณ',
};
export const filialMirrorText = (st) => (FILIAL_MIRROR[st.filial?.way] ?? (() => '"เรื่องนี้ลูกจัดการเอง"'))(st.sex === 'หญิง' ? 'แม่' : 'พ่อ');
// พ่อหรือแม่ที่รู้แล้วว่าป่วย ให้การ์ด when.kin_illness roles parent เรียก ({พ่อแม่ที่ป่วย}) · คนล่าสุดที่แจ้ง
export function illParentWord(st) {
  const p = st.parents.filter((x) => x.alive && x.ill?.toldAt !== undefined).at(-1);
  return p ? (p.sex === 'หญิง' ? 'แม่' : 'พ่อ') : 'พ่อแม่';
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

// คนตายที่ตระกูลโลกซ้อนจำได้ (ผีญาติดึงไปใช้) — เฉพาะคนที่ตายก่อนเรา · พ่อ/แม่ที่เป็นผู้เล่นรุ่นก่อนคือชาติก่อนของเราเอง ไม่ใช่วิญญาณอื่น · ฝูงสัตว์ไม่มีตัวตนรายตัว
// เก็บเลขรุ่นแทนปีตาย: ผีสุ่มเอียงหารุ่นใกล้ ไม่ได้กรองว่าไปเกิดแล้วหรือยัง
export function deadKinOf(st) {
  const gen = st.gen ?? 1;
  const one = (m, role) => ({ name: m.name ?? null, role, bond: m.bond ?? BOND_START[role], cause: m.cause ?? null, gen });
  return [
    ...st.parents.filter((p) => !p.alive && !p.ancestor).map((p) => one(p, 'parent')),
    ...(st.kin ?? []).filter((m) => !m.alive && m.role !== 'herd').map((m) => one(m, m.role)),
  ];
}

// ผีญาติ (ใบ 26): หยิบหนึ่งคนจากรายชื่อคนตายที่ตระกูลจำ (รายชื่อชาติก่อน ๆ + คนตายของชาตินี้ เหมือนที่ปรโลกส่งต่อ)
// เจ้าของเคาะ 11-17: สีหน้าผีอ่านจากสาเหตุตาย + bond ที่เก็บอยู่แล้ว ไม่เพิ่มฟิลด์ deadKin · ตายผิดธรรมชาติหรือ bond ต่ำ = ทวง · ตายธรรมดาและ bond สูง = เตือน/ช่วย
// ถ่วงรุ่นใกล้กับ bond สูง · stream แยกจาก seed ไม่ดึง st.rng ⇒ ชีวิตที่ไม่มีการ์ดผีญาติเดินเท่าเดิม · ไม่ผูกกับจำนวนการ์ดที่ออกแล้ว กันชื่อกับสีหน้าเปลี่ยนกลางการ์ด
// self_harm ไม่ขึ้นจอ (เหมือนป้ายสาเหตุ) · สัตว์ไม่เป็นผีญาติ · คนไม่มีชื่อเรียกไม่ได้
export const KIN_GHOST = { salt: 0x6b1d9e57, haunt: { bond: 50, causes: ['road', 'accident', 'assault', 'training'] }, genDecay: 0.5 };
const ghostWord = (st, e) => {
  if (e.gen === (st.gen ?? 1)) {
    const word = { spouse: 'คู่ชีวิต', child: 'ลูก', grandchild: 'หลาน', peer: 'เพื่อน' }[e.role];
    return word ?? (st.parents.find((p) => p.name === e.name)?.sex === 'หญิง' ? 'แม่' : 'พ่อ');
  }
  return e.role === 'parent' ? 'บรรพบุรุษ' : e.role === 'spouse' ? 'ญาติผู้ใหญ่' : 'ญาติ';
};
export function pickKinGhost(st) {
  const list = [...(st.deadKin ?? []), ...deadKinOf(st)].filter((e) => e.name && !ANIMAL.includes(e.role) && e.cause !== 'self_harm');
  if (!list.length) return null;
  const gen = st.gen ?? 1;
  const w = list.map((e) => KIN_GHOST.genDecay ** Math.max(0, gen - e.gen) * (0.2 + e.bond / 100));
  let r = makeRng(mixSeed(st.seed ^ KIN_GHOST.salt, gen)).next() * w.reduce((a, b) => a + b, 0);
  const i = Math.max(0, w.findIndex((x) => (r -= x) < 0));
  const e = list[i];
  const mood = KIN_GHOST.haunt.causes.includes(e.cause) || e.bond < KIN_GHOST.haunt.bond ? 'haunt' : 'warn';
  return { name: e.name, role: e.role, gen: e.gen, bond: e.bond, mood, word: ghostWord(st, e) };
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
    if (!FUNERAL_WHO.roles.includes(m.role) || !m.alive || isDivorced(m)) continue;
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

// ผู้รับจดหมายคำฝาก (afterfall-3): คนเดียว ชี้จาก state ล้วนไม่ดึงเลขสุ่ม · สายเลือดก่อน แล้วคนนอกสายเลือดตามลำดับกลุ่ม
// กลุ่มเดียวกันเอา bond สูงสุด เท่ากัน = id น้อย · LETTER_BOND = ไม่มีเกณฑ์ (เจ้าของเคาะ: ใครยังมีชีวิตก็รับได้) แยกจาก FUNERAL_WHO.come
export const LETTER_TO = [['child', 'grandchild'], ['peer'], ['spouse']];
export const LETTER_BOND = 0;
export function letterTo(st) {
  for (const roles of LETTER_TO) {
    const ok = (st.kin ?? []).filter((m) => roles.includes(m.role) && m.alive && !isDivorced(m) && (m.bond ?? BOND_START[m.role]) >= LETTER_BOND);
    if (ok.length) return ok.reduce((a, m) => ((m.bond ?? BOND_START[m.role]) > (a.bond ?? BOND_START[a.role]) || ((m.bond ?? BOND_START[m.role]) === (a.bond ?? BOND_START[a.role]) && m.id < a.id) ? m : a));
  }
  return null;
}
export const letterToText = (m) => (m.name ? `${WHO_WORD[m.role]} ${m.name}` : WHO_WORD[m.role]);

// ปีที่อยู่ด้วยกันของคู่ที่จากไป/แยกทาง · ไม่มี since (เซฟเก่า) = ไม่ส่งช่องนี้ จอไม่โชว์ 0 ปี
function spouseSpan(st, m) {
  if (m.since === undefined || (m.alive && !m.left)) return null;
  const end = m.left ? m.leftAge : (st.kinLoss ?? []).findLast((l) => l.id === m.id)?.year - st.birthYear;
  return end === undefined || Number.isNaN(end) ? null : { since: m.since, together: Math.max(1, end - m.since), ...(m.leftAge !== undefined && { leftAge: m.leftAge }) };
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
  // คนจีบยังอยู่นอกบ้าน (ใบ 172 ข้อ 305) — เข้าแผงตอนเป็นแฟนเท่านั้น · ไม่กรองตรงนี้ app.mjs จะวาดเป็น "เพื่อนรุ่น"
  const kin = (st.kin ?? []).filter((m) => m.role !== 'courter').map((m) => ({ id: m.id, role: m.role, name: m.name, sex: m.sex, age: memberAge(st, m, year), alive: m.alive, diedAge: m.diedAge, ...causeOf(m), ...bondOf(m), ...(m.kind && { kind: m.kind }), ...(m.order && { order: m.order }), ...(m.of !== undefined && { of: m.of }), ...(m.left && { left: true }), ...((m.role === 'spouse' || m.role === 'partner') && m.status && m.status !== 'together' && { status: m.status }), ...(m.role === 'spouse' && spouseSpan(st, m)), ...(m.role === 'child' && m.by != null && { by: m.by }) }));
  return [...parents, ...kin];
}
