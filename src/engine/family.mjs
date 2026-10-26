// ครอบครัวเป็นคนจริง (B36a): คู่ครอง · ลูก · หลาน มีชื่อ เพศ ปีเกิด ยังอยู่/จากไป · พ่อแม่อยู่ใน st.parents แบบเดิม
// ทุกสุ่มของสมาชิกใหม่มาจาก st.kinRng (stream แยกจากโลกและจาก famRng ของพ่อแม่) — ชีวิตที่ไม่มีครอบครัวของตัวเองไม่ดึงเลขนี้เลย
// ชะตาการตายของพ่อแม่และลำดับสุ่มของโลกจึงเหมือนก่อนมีระบบนี้ทุกหลัก
import { makeRng, mixSeed } from './rng.mjs';
import { lifeQx } from './era.mjs';
import { pickName } from './birth.mjs';

export const KIN_ROLES = ['spouse', 'child', 'grandchild'];
export const FAMILY_ROLE_NAMES = { parent: 'พ่อแม่', spouse: 'คู่ครอง', child: 'ลูก', grandchild: 'หลาน', pet: 'สัตว์เลี้ยง', peer: 'เพื่อนรุ่น' };
// ธงเดิมที่เนื้อหาอ่านอยู่ ↔ บทบาทที่ธงนั้นหมายถึง · ตั้งธงจากตัวเลือก = มีสมาชิกคนนั้นเพิ่มขึ้นจริง
const KIN_FLAG_ROLE = { married: 'spouse', has_kids: 'child', raised_grandkids: 'grandchild' };
// ลูกที่โตแล้วมีหลานให้เองปีละโอกาสนี้ ช่วงอายุนี้ ไม่เกินจำนวนนี้ต่อคน — ค่าตั้งของเกม (ไม่มีข้อมูลเจริญพันธุ์รายยุคในชุดข้อมูล)
export const GRANDKID = { from: 22, to: 40, chance: 0.08, max: 3 };
// คู่ครองอายุห่างจากเราได้เท่านี้ (ปีเกิด) · ค่าตั้งของเกม
const KIN_SPOUSE_GAP = [-5, 5];
// pet (B44) · peer (B43) เป็นสมาชิกได้ แต่ไม่ใช่ทายาท ไม่ตั้งธง ไม่มีหลาน — สัตว์ตายตามอายุขัยของชนิด เพื่อนรุ่นตายตามตารางชีพแบบคน
export const KIN_EXTRA_ROLES = ['pet', 'peer'];
// คนในบ้าน = คนที่การ์ดครอบครัวดูแลถึง และคนที่นับว่า "ยังมีใคร" ตอนแก่ · เพื่อนรุ่นไม่นับ
const KIN_HOUSEHOLD = ['spouse', 'child', 'grandchild', 'pet'];

// ความผูกพันรายคน 0–100 (B36a2): ปีที่ไม่ได้ดูแลลดเอง 1 แต่การลดเองไม่พาต่ำกว่า floor — ผลร้ายจากเนื้อหาพาต่ำกว่าได้
export const BOND_START = { parent: 70, spouse: 70, child: 75, grandchild: 60, pet: 65, peer: 50 };
export const BOND_FLOOR = 38;
export const BOND_LEVELS = [[80, 'ผูกพัน'], [60, 'สนิท'], [40, 'คุ้นเคย'], [20, 'เฉย ๆ'], [0, 'ห่างเหิน']];
// การ์ดหมวด family ที่ตัวเลือกให้ความสัมพันธ์บวก = ดูแลคนในบ้านปีนั้น · bond ขึ้นเท่านี้ต่อระดับความสัมพันธ์ (1–3)
const BOND_CARE_PER_REL = 2;
// ญาติช่วยตอนเจอผลร้าย: คนที่ผูกพันตั้งแต่ from ขึ้นไป มีโอกาส (bond − base) / span ช่วยให้เสียหายเหลือ scale
export const KIN_AID = { from: 60, base: 50, span: 120, scale: 0.5, roles: ['spouse', 'child', 'grandchild'] };
// แก่แล้วไม่เหลือคนในบ้านที่ยังอยู่ = เสียความสุข/สุขภาพต่อปี · ปิดไว้ (0) จนเนื้อหามีทางมีลูกมากพอ — ตอนนี้คนแก่ส่วนใหญ่ไม่มีลูก
export const KIN_LONELY = { from: 65, happiness: 0, health: 0 };

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
  const sex = role === 'spouse' ? kinOtherSex(st.sex) : st.kinRng.next() < 0.5 ? 'ชาย' : 'หญิง';
  const born = role === 'spouse' ? st.birthYear + st.kinRng.int(...KIN_SPOUSE_GAP) : role === 'peer' ? st.birthYear : year;
  const name = role === 'pet' ? (extra.name ?? null) : pickName(mixSeed(st.seed, 0x4b1d + id), sex, born, st.content.era.names, kinTakenNames(st));
  const m = { id, role, sex, born, alive: true, diedAge: null, name, bond: BOND_START[role] };
  if (role === 'pet') {
    m.kind = extra.kind;
    m.maxAge = st.kinRng.int(...extra.life);
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
  for (const role of ['spouse', 'child', 'grandchild', 'pet']) {
    const live = livingOf(st, role);
    if (live.length) st.kinFocus[role] = (live.length > 1 ? live[st.kinRng.int(0, live.length - 1)] : live[0]).id;
  }
}
// คนเป้าของการ์ดใบปัจจุบัน (ยังคืนคนเดิมแม้ผลการ์ดใบนี้ทำให้เขาจากไป — การ์ดผลจะได้เรียกชื่อถูกคน) · นอกการ์ด = คนล่าสุดที่ยังอยู่
export function focusOf(st, role) {
  const id = st.kinFocus?.[role];
  return (id !== undefined && st.kin.find((m) => m.id === id)) || livingOf(st, role).at(-1) || null;
}

function kinDie(st, m) {
  m.diedAge = kinYearOf(st) - m.born;
  m.alive = false;
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
    if (op.add) for (let i = 0; i < (op.n ?? 1); i++) addMember(st, op.add, op.add === 'pet' ? { kind: op.kind, life: op.life, name: op.name } : {});
    if (op.bond) bondAdd(st, bondTargets(st, op.bond), op.d);
    if (op.leave) for (const m of livingOf(st, op.leave)) m.left = true;
    if (op.die === 'parent') {
      const p = st.parents.find((x) => x.alive);
      if (p) {
        p.alive = false;
        p.diedAge = p.age;
      }
    } else if (op.die) {
      const m = focusOf(st, op.die);
      if (m?.alive) kinDie(st, m);
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
  if (!KIN_HOUSEHOLD.includes(m.role)) return;
  const loss = { id: m.id, role: m.role, name: m.name, age, year, ...(m.kind && { kind: m.kind }) };
  st.kinLoss.push(loss);
  out.push(loss);
}

export function ageKin(st, year) {
  kinYearlyBond(st);
  const lost = [];
  if (!st.kin.length) return lost;
  for (const m of [...st.kin]) {
    if (!m.alive) continue;
    const a = year - m.born - 1;
    if (m.role === 'pet') {
      if (a + 1 >= m.maxAge) kinLost(st, m, a + 1, year, lost);
      continue;
    }
    if (st.kinRng.next() < lifeQx(st.content.era, st.seed, m.sex, year, a)) {
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
export function lossText(l) {
  const who = l.role === 'pet' ? `${l.kind}${l.name ?? 'ที่เลี้ยงไว้'}` : `${LOSS_WHO[l.role]}${l.name}`;
  return l.age < 1 ? `${who}จากไปตั้งแต่ยังไม่ทันครบขวบ` : `${who}จากไปแล้ว ด้วยวัย ${l.age} ปี`;
}

// เงื่อนไขการ์ดสูญเสีย (when.loss): มีคนในบ้านบทบาทที่ระบุ (ไม่ใส่ = ทุกบทบาท) จากไปเองภายใน within ปีที่ผ่านมา (ไม่ใส่ = ปีนี้)
export function lossOk(st, w) {
  const year = kinYearOf(st);
  return (st.kinLoss ?? []).some((l) => (!w.roles || w.roles.includes(l.role)) && year - l.year <= (w.within ?? 0));
}
// ชื่อคนที่จากไปล่าสุด ให้การ์ดสูญเสียเรียก ({ชื่อผู้จากไป})
export const lastLoss = (st) => (st.kinLoss ?? []).at(-1) ?? null;

// เงื่อนไขครอบครัวของการ์ด (when.family / requires.family): บทบาท · ยังอยู่ · ช่วงอายุ · จำนวน
// ไม่ใส่ count = ต้องมีอย่างน้อย 1 คนที่ตรง · คู่ที่หย่าแล้วไม่นับเป็นคู่ครอง
export function familyOk(st, f) {
  const year = kinYearOf(st);
  const pool = f.role === 'parent'
    ? st.parents.map((p) => ({ alive: p.alive, age: p.age }))
    : (st.kin ?? []).filter((m) => m.role === f.role && !m.left).map((m) => ({ alive: m.alive, age: memberAge(st, m, year) }));
  const n = pool.filter((m) => (f.alive === undefined || m.alive === f.alive) && kinInRange(m.age, f.age)).length;
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

// รายชื่อให้แผงครอบครัว (B36c) อ่านอย่างเดียว — ช่องที่ไล่ไว้เท่านั้น ไม่มีค่าบัญชีหรือค่าที่อนุมานกรรมได้
export function familyOf(st) {
  const year = kinYearOf(st);
  const bondOf = (m) => {
    const b = m.bond ?? BOND_START[m.role ?? 'parent'];
    return { bond: b, bondLevel: bondLabel(b) };
  };
  // พ่อแม่ที่ตายก่อนเราเกิด (คู่ของรุ่นก่อนในทางตระกูล) ไม่เคยผ่าน ageParents — อายุตอนตายอยู่ที่ diesAt
  const diedOf = (p) => (p.alive ? null : (p.diedAge ?? p.diesAt ?? null));
  const parents = st.parents.map((p) => ({ role: 'parent', name: p.name ?? null, sex: p.sex, age: p.alive ? p.age : diedOf(p), alive: p.alive, diedAge: diedOf(p), ...bondOf(p) }));
  const kin = (st.kin ?? []).map((m) => ({ id: m.id, role: m.role, name: m.name, sex: m.sex, age: memberAge(st, m, year), alive: m.alive, diedAge: m.diedAge, ...bondOf(m), ...(m.kind && { kind: m.kind }), ...(m.order && { order: m.order }), ...(m.of !== undefined && { of: m.of }), ...(m.left && { left: true }) }));
  return [...parents, ...kin];
}
