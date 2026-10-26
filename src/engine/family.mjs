// ครอบครัวเป็นคนจริง (B36a): คู่ครอง · ลูก · หลาน มีชื่อ เพศ ปีเกิด ยังอยู่/จากไป · พ่อแม่อยู่ใน st.parents แบบเดิม
// ทุกสุ่มของสมาชิกใหม่มาจาก st.kinRng (stream แยกจากโลกและจาก famRng ของพ่อแม่) — ชีวิตที่ไม่มีครอบครัวของตัวเองไม่ดึงเลขนี้เลย
// ชะตาการตายของพ่อแม่และลำดับสุ่มของโลกจึงเหมือนก่อนมีระบบนี้ทุกหลัก
import { makeRng, mixSeed } from './rng.mjs';
import { lifeQx } from './era.mjs';
import { pickName } from './birth.mjs';

export const KIN_ROLES = ['spouse', 'child', 'grandchild'];
export const FAMILY_ROLE_NAMES = { parent: 'พ่อแม่', spouse: 'คู่ครอง', child: 'ลูก', grandchild: 'หลาน' };
// ธงเดิมที่เนื้อหาอ่านอยู่ ↔ บทบาทที่ธงนั้นหมายถึง · ตั้งธงจากตัวเลือก = มีสมาชิกคนนั้นเพิ่มขึ้นจริง
const KIN_FLAG_ROLE = { married: 'spouse', has_kids: 'child', raised_grandkids: 'grandchild' };
// ลูกที่โตแล้วมีหลานให้เองปีละโอกาสนี้ ช่วงอายุนี้ ไม่เกินจำนวนนี้ต่อคน — ค่าตั้งของเกม (ไม่มีข้อมูลเจริญพันธุ์รายยุคในชุดข้อมูล)
export const GRANDKID = { from: 22, to: 40, chance: 0.08, max: 3 };
// คู่ครองอายุห่างจากเราได้เท่านี้ (ปีเกิด) · ค่าตั้งของเกม
const KIN_SPOUSE_GAP = [-5, 5];

const kinOtherSex = (sex) => (sex === 'ชาย' ? 'หญิง' : 'ชาย');
const kinInRange = (v, r) => !r || (v >= r[0] && v <= r[1]);
const kinYearOf = (st) => st.birthYear + st.age;
export const memberAge = (st, m, year = kinYearOf(st)) => (m.alive ? year - m.born : m.diedAge);

export function newKin(seed) {
  return { kin: [], kinRng: makeRng(seed ^ 0x510e527f), kinSeq: 0 };
}

// ชื่อทุกคนในบ้าน (รวมรุ่นก่อนในผังตระกูล) — ชื่อใหม่เลี่ยงชุดนี้
const kinTakenNames = (st) => [st.name, ...st.parents.map((p) => p.name), ...st.kin.map((m) => m.name), ...(st.lineage ?? []).map((l) => l.name)].filter(Boolean);

// พ่อแม่ที่ยังไม่มีชื่อ (ชีวิตแรก/ทางเกิดใหม่) ได้ชื่อจาก seed ตามยุคปีเกิดของเขา — ไม่ดึงเลขสุ่ม ไม่แตะชื่อผู้เล่น
export function nameParents(st) {
  st.parents.forEach((p, i) => {
    p.name ??= pickName(mixSeed(st.seed, 0x9a01 + i), p.sex, st.birthYear - p.age, st.content.era.names, kinTakenNames(st));
  });
}

export function addMember(st, role, extra = {}) {
  const year = kinYearOf(st);
  const id = ++st.kinSeq;
  const sex = role === 'spouse' ? kinOtherSex(st.sex) : st.kinRng.next() < 0.5 ? 'ชาย' : 'หญิง';
  const born = role === 'spouse' ? st.birthYear + st.kinRng.int(...KIN_SPOUSE_GAP) : year;
  const m = { id, role, sex, born, alive: true, diedAge: null, name: pickName(mixSeed(st.seed, 0x4b1d + id), sex, born, st.content.era.names, kinTakenNames(st)) };
  if (role === 'child') m.order = st.kin.filter((x) => x.role === 'child').length + 1;
  if (role === 'grandchild') {
    // หลานจากเนื้อหา (รับหลานมาเลี้ยง) เป็นลูกของลูกที่ยังอยู่ ถ้ามี — ไม่มีลูกเหลือ = ไม่ระบุพ่อแม่
    const kids = st.kin.filter((x) => x.role === 'child' && x.alive);
    m.of = extra.of ?? (kids.length ? kids[st.kinRng.int(0, kids.length - 1)].id : null);
  }
  st.kin.push(m);
  return m;
}

const livingOf = (st, role) => st.kin.filter((m) => m.role === role && m.alive && !m.left);
// คนที่การ์ดเรียกชื่อ/คนที่ผลการ์ดกระทบ: คนล่าสุดที่ยังอยู่ของบทบาทนั้น (ลูกคนเล็ก · หลานคนเล็ก · คู่ปัจจุบัน)
export const focusOf = (st, role) => livingOf(st, role).at(-1) ?? null;

function kinDie(st, m) {
  m.diedAge = kinYearOf(st) - m.born;
  m.alive = false;
}

// ผลครอบครัวของตัวเลือก/ผลสุ่ม: family = [{add, n?} | {leave: spouse} | {die: role}] + ธงเดิมที่ตั้ง
// ธงครอบครัวที่ตั้งโดยไม่มี add ของบทบาทนั้น = มีสมาชิกเพิ่ม 1 คน (เนื้อหาเดิมที่เขียนก่อนมีระบบ)
export function applyFamily(st, c) {
  const ops = c.family ?? [];
  for (const op of ops) {
    if (op.add) for (let i = 0; i < (op.n ?? 1); i++) addMember(st, op.add);
    if (op.leave) for (const m of livingOf(st, op.leave)) m.left = true;
    if (op.die === 'parent') {
      const p = st.parents.find((x) => x.alive);
      if (p) {
        p.alive = false;
        p.diedAge = p.age;
      }
    } else if (op.die) {
      const m = focusOf(st, op.die);
      if (m) kinDie(st, m);
    }
  }
  for (const f of c.sets_flags ?? []) {
    const role = KIN_FLAG_ROLE[f];
    if (!role || ops.some((op) => op.add === role)) continue;
    // แต่งงานซ้ำตอนคู่ยังอยู่ = คนเดิม ไม่เพิ่มคู่
    if (role === 'spouse' && livingOf(st, 'spouse').length) continue;
    addMember(st, role);
  }
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
export function ageKin(st, year) {
  if (!st.kin.length) return;
  for (const m of [...st.kin]) {
    if (!m.alive) continue;
    const a = year - m.born - 1;
    if (st.kinRng.next() < lifeQx(st.content.era, st.seed, m.sex, year, a)) {
      m.diedAge = a;
      m.alive = false;
      continue;
    }
    if (m.role === 'child' && kinInRange(year - m.born, [GRANDKID.from, GRANDKID.to]) && st.kin.filter((g) => g.of === m.id).length < GRANDKID.max && st.kinRng.next() < GRANDKID.chance) {
      addMember(st, 'grandchild', { of: m.id });
    }
  }
  kinSyncFlags(st);
}

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

// รายชื่อให้แผงครอบครัว (B36c) อ่านอย่างเดียว — ช่องที่ไล่ไว้เท่านั้น ไม่มีค่าบัญชีหรือค่าที่อนุมานกรรมได้
export function familyOf(st) {
  const year = kinYearOf(st);
  const parents = st.parents.map((p) => ({ role: 'parent', name: p.name ?? null, sex: p.sex, age: p.alive ? p.age : (p.diedAge ?? null), alive: p.alive, diedAge: p.alive ? null : (p.diedAge ?? null) }));
  const kin = (st.kin ?? []).map((m) => ({ id: m.id, role: m.role, name: m.name, sex: m.sex, age: memberAge(st, m, year), alive: m.alive, diedAge: m.diedAge, ...(m.order && { order: m.order }), ...(m.of !== undefined && { of: m.of }), ...(m.left && { left: true }) }));
  return [...parents, ...kin];
}
