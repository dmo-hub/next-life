// ต้นไม้โฟกัส (ใบ 03 tracer): กติกากลางตัวเดียว เรียกจากโลกใดก็ได้ — h = ผู้ถือสถานะของโลกนั้น (โลกหลัก = st)
// สถานะอยู่บน h.tree = { cur, done:{id:อายุที่ปลด}, yrs:{id:ปีที่ทุ่ม}, cards:{id:การ์ดที่นับ}, hist:[[อายุ,id]] } — ภาพถ่ายเซฟพาไปเอง
// ไม่เคยทุ่ม = ไม่มี h.tree: ชีวิตที่ไม่แตะต้นไม้เดินเท่าเดิมทุกหลัก (ไม่ดึงเลขสุ่ม ไม่ถ่วงการ์ด)
// ทุ่มได้แค่โหนดที่ยังไม่ปลด (ข้อ 36) · ปลดแล้วเลื่อนไปโหนดถัดไปเอง ไม่เสียปี · เปลี่ยนเองทีหลังได้ ไม่เสียปี (ข้อ 43) · ทางแยกไม่ล็อก เวลาเป็นราคา (ข้อ 8)

// ตัวควบคุมของ harness: ปิดการนับการ์ด → โหนดที่ต้องตอบการ์ดต้องปลดไม่ได้เลย
// anyCat / cardsFree = ทางเลือกที่ harness ใช้ทำตารางเสนอเจ้าของเท่านั้น (นับทุกหมวด · ไม่ต้องตอบการ์ด) ห้ามเปิดนอก harness
// passive = ผลติดตัวหลังปลด (ผลเบารายปี · ทอย · ถ่วงการ์ด · ใบ 04) ปิด = ปลดแล้วไม่ให้อะไรเลย (ตัวควบคุมของด่านงบ)
export const treeCtl = { cards: true, anyCat: false, cardsFree: false, passive: true };

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

// ปิดปีที่อายุ age: คืน { id, unlocked } ของโหนดที่ทุ่มปีนี้ · ไม่ได้ทุ่ม/โหนดหลุดช่วงวัยแล้ว = null (ปีนั้นไม่นับให้ใคร)
// ปลด = ปีเต็มครบ + การ์ดหมวดตรงครบ · ปลดแล้วเลื่อนไปโหนดแรกที่ทุ่มได้ต่อทันที ปีถัดไปนับเลย ไม่เสียปี
export function treeYearEnd(h, defs, stage, age) {
  const t = h.tree;
  if (!t?.cur) return null;
  const id = t.cur;
  if (!treeOpen(h, defs[id], id, stage)) {
    t.cur = null;
    return null;
  }
  t.yrs[id] = (t.yrs[id] ?? 0) + 1;
  t.hist.push([age, id]);
  const def = defs[id];
  const unlocked = t.yrs[id] >= def.years && (treeCtl.cardsFree || (t.cards[id] ?? 0) >= def.cards);
  if (unlocked) {
    t.done[id] = age;
    t.cur = treeOffers(h, defs, stage).find((x) => x !== id && !defs[x].hidden) ?? null;
  }
  return { id, unlocked };
}

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
  for (const id of Object.keys(t.done)) if (defs[id]) cnt[defs[id].branch] = (cnt[defs[id].branch] ?? 0) + 1;
  const best = Math.max(0, ...Object.values(cnt));
  const top = Object.keys(cnt).filter((b) => cnt[b] === best);
  const cats = new Set();
  if (best > 0 && top.length === 1) for (const d of Object.values(defs)) if (d.branch === top[0]) for (const c of d.cat) cats.add(c);
  topCache.set(t, { n, defs, cats });
  return cats;
}
export const treeCardMul = (h, defs, mul, cat) => (treeCtl.passive && h?.tree?.done && mul > 1 && topCats(h.tree, defs).has(cat) ? mul : 1);
export const treeTopCats = (h, defs) => (h?.tree?.done ? [...topCats(h.tree, defs)] : []);
