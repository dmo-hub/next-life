// ต้นไม้โฟกัส (ใบ 03): ทะเบียน content/rules/tree.yaml ต้องถูกรูปก่อนแกนอ่าน — ขอบชี้โหนดที่ไม่มี · วนเป็นวง · หมวด/ช่วงวัย/ผลผิด = หยุด build
import { CATEGORIES, EFFECT_KEYS, STAGE_AGES } from './vocab.mjs';
import { isObj, isInt } from './util.mjs';
// ชื่อโหนดห้ามมีตัวเลข · คำ "บุญ" ใช้ได้ (ร่างที่เจ้าของเคาะมี "ทำบุญเป็นนิจ") ต่างจากปุ่มโฟกัสที่ห้ามคำบัญชีบุญบาป
const NAME_BANNED = /[0-9๐-๙]/;

export const TREE_SIZES = ['s', 'b', 'k'];
const STAGE_SET = new Set(Object.keys(STAGE_AGES));
const fxLevel = (v) => isInt(v) && v !== 0 && Math.abs(v) <= 3;

// ผลเบาถาวรรวมทั้งต้น/ปี หน่วยระดับการ์ด/ปี (ข้อ 93) — ใช้ทั้ง lint และ harness `tree`
export const treeBudgetSpent = (doc) => Object.values(doc.nodes ?? {}).reduce((a, n) => a + Object.values(n.light ?? {}).reduce((b, v) => b + Math.abs(v), 0) * (doc.light_unit?.[n.size] ?? 0), 0);

export function checkTree(doc, jobs = null) {
  const out = [];
  if (!isObj(doc)) return ['ทะเบียนต้นไม้ต้องเป็น object'];
  if (!(typeof doc.year_scale === 'number' && doc.year_scale > 0)) out.push('year_scale ต้องเป็นเลขบวก');
  for (const k of TREE_SIZES) if (!(typeof doc.light_unit?.[k] === 'number' && doc.light_unit[k] > 0)) out.push(`light_unit.${k} ต้องเป็นเลขบวก`);
  if (!(typeof doc.roll_k === 'number' && doc.roll_k >= 0)) out.push('roll_k ต้องเป็นเลข ≥ 0');
  if (!(typeof doc.card_mul === 'number' && doc.card_mul >= 1)) out.push('card_mul ต้องเป็นเลข ≥ 1');
  if (!(typeof doc.budget === 'number' && doc.budget > 0)) out.push('budget ต้องเป็นเลขบวก');
  const nodes = doc.nodes;
  if (!isObj(nodes) || !Object.keys(nodes).length) return [...out, 'nodes ต้องมีอย่างน้อย 1 โหนด'];
  for (const [id, n] of Object.entries(nodes)) {
    const at = `โหนด ${id}`;
    if (!isObj(n)) { out.push(`${at} ต้องเป็น object`); continue; }
    if (typeof n.name !== 'string' || !n.name.trim()) out.push(`${at} ต้องมี name`);
    else if (NAME_BANNED.test(n.name)) out.push(`${at} ชื่อห้ามมีตัวเลข: ${n.name}`);
    if (typeof n.branch !== 'string' || !n.branch) out.push(`${at} ต้องมี branch`);
    if (!TREE_SIZES.includes(n.size)) out.push(`${at}.size ต้องเป็น ${TREE_SIZES.join(' | ')}`);
    if (!isInt(n.years) || n.years < 1) out.push(`${at}.years ต้องเป็นจำนวนเต็ม ≥ 1`);
    if (!isInt(n.cards) || n.cards < 0) out.push(`${at}.cards ต้องเป็นจำนวนเต็ม ≥ 0`);
    if (!Array.isArray(n.cat) || !n.cat.length || n.cat.some((c) => !CATEGORIES.includes(c))) out.push(`${at}.cat ต้องเป็นรายการหมวดการ์ด (${CATEGORIES.join(' ')})`);
    if (!Array.isArray(n.stages) || !n.stages.length || n.stages.some((s) => !STAGE_SET.has(s))) out.push(`${at}.stages ต้องเป็นรายการช่วงวัยที่แกนรู้จัก`);
    if (!Array.isArray(n.pre)) out.push(`${at}.pre ต้องเป็นรายการ (ว่างได้)`);
    else for (const p of n.pre) {
      if (p === id) out.push(`${at}.pre ชี้ตัวเอง`);
      else if (!(p in nodes)) out.push(`${at}.pre ชี้โหนด ${p} ที่ไม่มีในทะเบียน`);
    }
    if (!isInt(n.roll) || n.roll < 0) out.push(`${at}.roll ต้องเป็นจำนวนเต็ม ≥ 0`);
    if (n.jobs !== undefined && (!Array.isArray(n.jobs) || !n.jobs.length || n.jobs.some((j) => typeof j !== 'string'))) out.push(`${at}.jobs ต้องเป็นรายการ id อาชีพ`);
    if (n.job_roll !== undefined && (n.jobs === undefined || !isInt(n.job_roll) || n.job_roll < 1)) out.push(`${at}.job_roll ต้องเป็นจำนวนเต็ม ≥ 1 และต้องมี jobs`);
    if (jobs && Array.isArray(n.jobs)) for (const j of n.jobs) if (!jobs.includes(j)) out.push(`${at}.jobs ไม่รู้จักอาชีพ ${j}`);
    if (n.jobs !== undefined && n.job_roll === undefined) out.push(`${at}.jobs ต้องมี job_roll`);
    for (const key of ['fx', 'light']) {
      if (!isObj(n[key]) || !Object.keys(n[key]).length) out.push(`${at}.${key} ต้องมีผลอย่างน้อย 1 ค่า`);
      else for (const [k, v] of Object.entries(n[key])) if (!EFFECT_KEYS.includes(k) || k === 'money' || !fxLevel(v)) out.push(`${at}.${key}.${k} ต้องเป็นค่าสถานะระดับ ±1..±3`);
    }
  }
  // การ์ดด่านเฉพาะโหนดใหญ่ (ข้อ 32 64): ผล 2–3 ทาง · keystone ได้แรงแต่เสียถาวร (ข้อ 28): 1 ตัวต่อแขนง · ห้ามซ่อน · ต้องมีคำบอกข้อเสียก่อนทุ่ม
  const keys = {};
  for (const [id, n] of Object.entries(nodes)) {
    if (!isObj(n)) continue;
    const at = `โหนด ${id}`;
    if (n.gate !== undefined) {
      const g = n.gate;
      if (n.size !== 'b') out.push(`${at}.gate ใช้ได้เฉพาะโหนดใหญ่ (size b)`);
      if (!isObj(g) || typeof g.title !== 'string' || !g.title.trim() || typeof g.text !== 'string' || !g.text.trim()) out.push(`${at}.gate ต้องมี title และ text`);
      else if (!Array.isArray(g.results) || g.results.length < 2 || g.results.length > 3) out.push(`${at}.gate.results ต้องมี 2–3 ทาง`);
      else g.results.forEach((r, i) => {
        if (!isObj(r) || typeof r.text !== 'string' || !r.text.trim()) { out.push(`${at}.gate.results[${i}] ต้องมี text`); return; }
        if (!isObj(r.fx) || !Object.keys(r.fx).length || Object.entries(r.fx).some(([k, v]) => !EFFECT_KEYS.includes(k) || k === 'money' || !fxLevel(v))) out.push(`${at}.gate.results[${i}].fx ต้องเป็นค่าสถานะระดับ ±1..±3`);
      });
    }
    if (n.keystone !== undefined) {
      if (n.keystone !== true) out.push(`${at}.keystone ต้องเป็น true หรือไม่ใส่`);
      if (n.size !== 'k') out.push(`${at} keystone ต้องเป็น size k`);
      if (n.hidden) out.push(`${at} keystone ห้ามเป็นโหนดซ่อน`);
      if (n.gate !== undefined) out.push(`${at} keystone ห้ามมีการ์ดด่าน`);
      if (typeof n.warn !== 'string' || !n.warn.trim()) out.push(`${at} keystone ต้องมี warn (คำบอกข้อเสียก่อนทุ่ม)`);
      if (!isObj(n.cost) || !Object.keys(n.cost).length || Object.entries(n.cost).some(([k, v]) => !EFFECT_KEYS.includes(k) || k === 'money' || !fxLevel(v) || v > 0)) out.push(`${at}.cost ต้องเป็นค่าสถานะลบระดับ -1..-3 (ข้อเสียถาวร)`);
      keys[n.branch] = (keys[n.branch] ?? 0) + 1;
    } else if (n.warn !== undefined || n.cost !== undefined) out.push(`${at} มี warn/cost แต่ไม่ใช่ keystone`);
  }
  for (const [b, c] of Object.entries(keys)) if (c > 1) out.push(`แขนง ${b} มี keystone ${c} ตัว (ข้อ 66: แขนงละ 1)`);
  // งบผลเบาถาวรรวมทั้งต้น/ปี (ข้อ 42 · 93): Σ |light| × light_unit เกิน budget = ตก
  const spent = treeBudgetSpent(doc);
  if (spent > doc.budget) out.push(`งบผลเบาถาวรรวม ${spent.toFixed(3)} เกินเพดาน ${doc.budget}`);
  // วนเป็นวง = ไม่มีโหนดไหนในวงปลดได้เลย
  const state = {};
  const walk = (id, trail) => {
    if (state[id] === 2) return;
    if (state[id] === 1) { out.push(`ต้นทางวนเป็นวง: ${[...trail, id].join(' → ')}`); return; }
    state[id] = 1;
    for (const p of Array.isArray(nodes[id]?.pre) ? nodes[id].pre : []) if (p in nodes) walk(p, [...trail, id]);
    state[id] = 2;
  };
  for (const id of Object.keys(nodes)) walk(id, []);
  return out;
}
