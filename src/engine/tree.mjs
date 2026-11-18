// ต้นไม้โฟกัส (ใบ 03 tracer): กติกากลางตัวเดียว เรียกจากโลกใดก็ได้ — h = ผู้ถือสถานะของโลกนั้น (โลกหลัก = st)
// สถานะอยู่บน h.tree = { cur, done:{id:อายุที่ปลด}, yrs:{id:ปีที่ทุ่ม}, cards:{id:การ์ดที่นับ}, hist:[[อายุ,id]] } — ภาพถ่ายเซฟพาไปเอง
// ไม่เคยทุ่ม = ไม่มี h.tree: ชีวิตที่ไม่แตะต้นไม้เดินเท่าเดิมทุกหลัก (ไม่ดึงเลขสุ่ม ไม่ถ่วงการ์ด)
// ทุ่มได้แค่โหนดที่ยังไม่ปลด (ข้อ 36) · ปลดแล้วเลื่อนไปโหนดถัดไปเอง ไม่เสียปี · เปลี่ยนเองทีหลังได้ ไม่เสียปี (ข้อ 43) · ทางแยกไม่ล็อก เวลาเป็นราคา (ข้อ 8)

import { makeRng, mixSeed } from './rng.mjs';

// ตัวควบคุมของ harness: ปิดการนับการ์ด → โหนดที่ต้องตอบการ์ดต้องปลดไม่ได้เลย
// anyCat / cardsFree = ทางเลือกที่ harness ใช้ทำตารางเสนอเจ้าของเท่านั้น (นับทุกหมวด · ไม่ต้องตอบการ์ด) ห้ามเปิดนอก harness
// passive = ผลติดตัวหลังปลด (ผลเบารายปี · ทอย · ถ่วงการ์ด · ใบ 04) ปิด = ปลดแล้วไม่ให้อะไรเลย (ตัวควบคุมของด่านงบ)
export const treeCtl = { cards: true, anyCat: false, cardsFree: false, passive: true };
// ตัวเร่ง/ชะลอการปลด (ใบ 08) แยกเปิด/ปิดทีละตัว: ตัวควบคุมของ harness `tree-pace` ปิดตัวที่วัดแล้วต้องเท่าเดิมเป๊ะ
export const treePaceCtl = { teacher: true, cls: true, learn: true, age: true };

// ต้นทางผ่านแล้ว: ไม่มีต้นทาง = เปิดอยู่ · ในแขนงเดียวกันปลดอันใดอันหนึ่งก็พอ (ข้อ 72) · โหนดกลาง (and) ต้องครบทุกต้นทาง
export const treeReach = (h, def) => {
  const need = def.pre ?? [];
  const done = h?.tree?.done ?? {};
  return !need.length || (def.and ? need.every((p) => done[p] !== undefined) : need.some((p) => done[p] !== undefined));
};

// ทุ่มได้ตอนนี้: ยังไม่ปลด + ช่วงวัยตรง + ต้นทางผ่านแล้ว (โหนดซ่อนโผล่ตอนต้นทางผ่าน = เกณฑ์เดียวกัน)
export const treeOpen = (h, def, id, stage) => !!def && h?.tree?.done?.[id] === undefined && (!def.stages || def.stages.includes(stage)) && treeReach(h, def);
export const treeOffers = (h, defs, stage) => Object.keys(defs).filter((id) => treeOpen(h, defs[id], id, stage));

// เลือกทุ่มโหนด · ซ้ำตัวเดิมไม่ใช่การเปลี่ยน · เปลี่ยนไม่เสียปี (ปีที่เปลี่ยนยังนับให้โหนดใหม่ตอนสิ้นปี)
export function treeInvest(h, defs, id, stage) {
  if (!treeOpen(h, defs[id], id, stage)) throw new Error(`ทุ่มโหนดนี้ตอนนี้ไม่ได้: ${id}`);
  (h.tree ??= { cur: null, done: {}, yrs: {}, cards: {}, hist: [] }).cur = id;
}

// นับการ์ดที่ตอบ: เฉพาะโหนดที่กำลังทุ่ม และหมวดการ์ดตรงหมวดของโหนด
export function treeCard(h, defs, category) {
  const t = h.tree;
  if (!treeCtl.cards || !t?.cur) return;
  if (treeCtl.anyCat || defs[t.cur].cat.includes(category)) t.cards[t.cur] = (t.cards[t.cur] ?? 0) + 1;
}

// ความเร็วปลดต่อปี (ใบ 08): 1 = ปีเต็มเท่าเดิม · ไม่ส่ง cfg = 1 ทุกหลัก (ชีวิตเก่า/โลกที่ไม่มีตัวเร่งเดินเท่าเดิม)
// ยิ่งแก่ยิ่งช้า: ลดเชิงเส้นถึง age_end_mul ที่อายุ age_end (สูตรเรียนวิชาอสงไขยย่อสเกลอายุไทย) · ฐานะอ่านจากฐานะตอนเกิด (standing[0]) ทายาท/โลกที่ไม่มี = ไม่ปรับ
export function treePace(h, cfg, age) {
  if (!cfg) return 1;
  let m = 1;
  if (treePaceCtl.age) m *= 1 - (1 - cfg.age_end_mul) * Math.min(age, cfg.age_end) / cfg.age_end;
  if (treePaceCtl.teacher && h.flags?.tree_teacher) m *= cfg.teacher;
  if (treePaceCtl.learn && h.nature === 'learn') m *= cfg.learn;
  const born = h.standing?.[0]?.cls;
  if (treePaceCtl.cls && born !== undefined) m *= 1 + cfg.class_step * (born - cfg.class_mid);
  return m;
}

// ปิดปีที่อายุ age: คืน { id, unlocked } ของโหนดที่ทุ่มปีนี้ · ไม่ได้ทุ่ม/โหนดหลุดช่วงวัยแล้ว = null (ปีนั้นไม่นับให้ใคร)
// ปลด = ปีเต็มครบ + การ์ดหมวดตรงครบ · ปลดแล้วเลื่อนไปโหนดแรกที่ทุ่มได้ต่อทันที ปีถัดไปนับเลย ไม่เสียปี
export function treeYearEnd(h, defs, stage, age, pace = null) {
  const t = h.tree;
  if (!t?.cur) return null;
  const id = t.cur;
  if (!treeOpen(h, defs[id], id, stage)) {
    t.cur = null;
    return null;
  }
  // การ์ดด่านของโหนดนี้รอตอบอยู่ (ใบ 05): ปีนี้ไม่นับให้ใคร
  if (t.pend === id) return null;
  // ปีเศษส่วนปัดทศนิยม 3 ตำแหน่ง กันเลขลอยสะสมจนปลดเพี้ยนปี · ไม่มีตัวเร่ง = +1 เป๊ะเท่าเดิม
  // t.carry = เศษเกินปีของโหนดที่เพิ่งปลด ทบเข้าปีแรกของโหนดถัดไป (ตัวเร่งเล็กจึงมีผลเฉลี่ยแม้โหนดปีเป็นจำนวนเต็ม) · มีแต่เมื่อความเร็วไม่ใช่จำนวนเต็ม
  const carry = t.carry ?? 0;
  if (carry) t.carry = 0;
  t.yrs[id] = Math.round(((t.yrs[id] ?? 0) + treePace(h, pace, age) + carry) * 1000) / 1000;
  t.hist.push([age, id]);
  const def = defs[id];
  const ready = t.yrs[id] >= def.years && (treeCtl.cardsFree || (t.cards[id] ?? 0) >= def.cards);
  // โหนดใหญ่มีการ์ดด่าน: ปีครบ = การ์ดด่านโผล่ ยังไม่ปลด · ปลดตอนตอบการ์ดด่าน (treeGateDone)
  if (ready && def.gate) {
    t.pend = id;
    return { id, unlocked: false, gate: true };
  }
  if (ready) {
    t.done[id] = age;
    // เศษเกินเฉพาะส่วนทศนิยม: ปีเต็มที่ค้างเพราะรอการ์ดไม่ทบ (ไม่ให้การรอการ์ดกลายเป็นโบนัสโหนดถัดไป)
    const over = Math.round((t.yrs[id] - def.years) * 1000) / 1000 % 1;
    if (over > 0) t.carry = over;
    t.cur = treeNext(h, defs, stage, id);
  }
  return { id, unlocked: ready };
}

// ปลดแล้วเลื่อนไปโหนดแรกที่ทุ่มได้ต่อ · ไม่เลื่อนเข้าโหนดซ่อน และไม่เลื่อนเข้า keystone เอง (ใบ 05 · ข้อ 28: ต้องเลือกทุ่มเองหลังเห็นข้อเสีย)
// แขนงเดียวกับโหนดที่เพิ่งปลดมาก่อน (ต้นไม้หลายแขนงต้นแขนงอื่นเปิดอยู่เสมอ ห้ามเลื่อนข้ามแขนงเอง) · แขนงเดียวกันหมดแล้วค่อยหาแขนงอื่น
const treeNext = (h, defs, stage, id) => {
  const open = treeOffers(h, defs, stage).filter((x) => x !== id && !defs[x].hidden && !defs[x].keystone);
  return open.find((x) => defs[x].branch === defs[id].branch) ?? open[0] ?? null;
};

// ── การ์ดด่าน + keystone (ใบ 05) ── ทุกตัวไม่ดึงเลขสุ่ม · ผลของการ์ดด่านลงผ่านตัวเลือกของการ์ด (ผลเต็มครั้งเดียว) ไม่ผ่านงบผลเบา
// ปีครบแต่การ์ดหมวดยังไม่ครบ (ข้อ 46): ใช้บอกขั้น "รอโอกาส" ที่หน้าต้นไม้ · ไม่แตะสถานะ
export const treeWaiting = (h, defs) => {
  const t = h?.tree;
  const id = t?.cur;
  return !!id && t.pend !== id && t.done[id] === undefined && (t.yrs[id] ?? 0) >= defs[id].years && (t.cards[id] ?? 0) < defs[id].cards;
};
// การ์ดด่านของโหนด id เป็นเหตุการณ์ตัวเลือก 2–3 ทาง (ไม่มี weight/category → ไม่ใช่การ์ดกองสุ่ม ไม่ขยับโควตาการ์ดโลกหลัก ไม่นับเป็นการ์ดหมวดของโหนดไหน)
export function treeGateEvent(defs, id) {
  const g = defs[id].gate;
  return {
    id: `tree_gate_${id}`,
    type: g.type ?? 'A',
    treeGate: id,
    title: g.title,
    text: g.text,
    choices: g.results.map((r) => ({ text: r.text, effects: r.fx, ...(r.flags && { sets_flags: r.flags }) })),
  };
}
// ตอบการ์ดด่านแล้ว = ปลดโหนด · จดว่าเลือกผลทางไหน · เลื่อนไปโหนดถัดไป
export function treeGateDone(h, defs, stage, id, idx, age) {
  const t = h.tree;
  if (t?.pend !== id) throw new Error(`ไม่มีการ์ดด่านรอของโหนด ${id}`);
  t.done[id] = age;
  (t.gate ??= {})[id] = idx;
  t.pend = null;
  t.cur = treeNext(h, defs, stage, id);
}

// ── จุดเกิด (ใบ 06 · ข้อ 15 39 17 · ข้อ 97) ── ทุกชีวิตเริ่ม 1 แขนง: ถ่วงน้ำหนักตาม ฐานะ > อาชีพ > แขนงพ่อแม่ (ตัวเลขใน tree.yaml start)
// ฟังก์ชันล้วนจาก seed (stream แยก ไม่ดึงเลขสุ่มของโลก · ไม่เขียนสถานะ) · พ่อแม่ไม่มีโหนดเลย (ไม่มี parentBranch) = ไม่มีน้ำหนักแขนงพ่อแม่ ส่วนที่เหลือยังถ่วงตามฐานะ/อาชีพ (ข้อ 67 73)
const START_SALT = 0x5bd1e995;
export const treeStartWeights = (cfg, cls, occ = null, parentBranch = null) => {
  const band = cls <= 3 ? 'low' : cls <= 6 ? 'mid' : 'high';
  return Object.fromEntries(Object.keys(cfg.class[band]).map((b) => [b, cfg.base + cfg.class[band][b] + (cfg.job[occ]?.[b] ?? 0) + (b === parentBranch ? cfg.parent_branch : 0)]));
};
export function treeStartBranch(cfg, seed, cls, occ = null, parentBranch = null) {
  const w = treeStartWeights(cfg, cls, occ, parentBranch);
  const keys = Object.keys(w);
  let x = makeRng(mixSeed(seed ^ START_SALT, 0)).next() * keys.reduce((a, b) => a + w[b], 0);
  for (const b of keys) if ((x -= w[b]) < 0) return b;
  return keys[keys.length - 1];
}
// ต้นแขนง = โหนดไม่มีต้นทางของแขนงนั้น (เปิดอยู่ตั้งแต่เด็ก)
export const treeStartNode = (defs, branch) => Object.keys(defs).find((id) => defs[id].branch === branch && !(defs[id].pre ?? []).length && !defs[id].hidden) ?? null;

// ── ผลติดตัว (ใบ 04) ── ทุกตัวเป็นฟังก์ชันล้วน ไม่ดึงเลขสุ่ม · ไม่เคยปลดอะไร = 1 เท่าเดิมทุกหลัก
// ทอยทุกโหนดตามหมวดการ์ด คิดรวมต่อแขนง (ข้อ 58): ระดับ = Σ roll ของโหนดที่ปลดแล้วและหมวดตรง · ตัวคูณ = 1 + k × ระดับ (แบบ thaiSkillMul) · ชนเพดาน okMax ที่ปลายทางเอง
// อาชีพตรง (ข้อ 17 50 53): โหนดที่ระบุ jobs ให้ job_roll เพิ่มอีกชั้นเดียวเมื่ออาชีพที่ทำอยู่ตรง · ซ้อนกี่โหนดก็นับสูงสุดตัวเดียว ไม่ซ้อน 2 ชั้น
export function treeRollLevel(h, defs, cat, occ = null) {
  const done = h?.tree?.done;
  if (!done || !cat || !treeCtl.passive) return 0;
  let lv = 0, job = 0;
  for (const id of Object.keys(done)) {
    const d = defs[id];
    if (!d?.cat.includes(cat)) continue;
    lv += d.roll ?? 0;
    if (occ && d.jobs?.includes(occ)) job = Math.max(job, d.job_roll ?? 0);
  }
  return lv + job;
}
export const treeRollMul = (h, defs, k, cat, occ = null) => (k > 0 ? 1 + k * treeRollLevel(h, defs, cat, occ) : 1);

// ถ่วงการ์ดถาวรเฉพาะแขนงที่ปลดมากสุด (ข้อ 42): แขนงอื่น = 1 · เสมอกัน = ไม่ถ่วงใคร (ไม่มีแขนงที่ "มากสุด") · ถ่วงหมวดการ์ดที่โหนดของแขนงนั้นนับ
// จำค่าไว้ต่อสถานะต้นไม้ (เรียกต่อใบในกองทุกปี) — คีย์ = จำนวนโหนดที่ปลด · ไม่เขียนลง st.tree จึงไม่เข้าเซฟ
const topCache = new WeakMap();
function topCats(t, defs) {
  const n = Object.keys(t.done).length;
  const hit = topCache.get(t);
  if (hit && hit.n === n && hit.defs === defs) return hit.cats;
  const cnt = {};
  for (const id of Object.keys(t.done)) if (defs[id] && !defs[id].and) cnt[defs[id].branch] = (cnt[defs[id].branch] ?? 0) + 1;
  const best = Math.max(0, ...Object.values(cnt));
  const top = Object.keys(cnt).filter((b) => cnt[b] === best);
  const cats = new Set();
  if (best > 0 && top.length === 1) for (const d of Object.values(defs)) if (d.branch === top[0]) for (const c of d.cat) cats.add(c);
  topCache.set(t, { n, defs, cats });
  return cats;
}
export const treeCardMul = (h, defs, mul, cat) => (treeCtl.passive && h?.tree?.done && mul > 1 && topCats(h.tree, defs).has(cat) ? mul : 1);
export const treeTopCats = (h, defs) => (h?.tree?.done ? [...topCats(h.tree, defs)] : []);
