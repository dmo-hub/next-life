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

// ตัวเร่ง/ชะลอการปลด (ใบ 08): ทุกค่าต้องเป็นเลขบวก ความเร็วต่อปีไม่ติดลบ/ไม่หยุดนิ่ง (ต่ำสุด = age_end_mul × ตัวชะลอที่สุด > 0)
export function checkTreePace(doc) {
  if (!isObj(doc)) return ['tree-pace ต้องเป็น object'];
  const out = [];
  for (const k of ['age_end', 'teacher', 'learn']) if (!(typeof doc[k] === 'number' && doc[k] > 0)) out.push(`${k} ต้องเป็นเลขบวก`);
  if (!(typeof doc.age_end_mul === 'number' && doc.age_end_mul > 0 && doc.age_end_mul <= 1)) out.push('age_end_mul ต้องอยู่ใน (0, 1]');
  if (!(typeof doc.class_step === 'number' && doc.class_step >= 0)) out.push('class_step ต้องเป็นเลข ≥ 0');
  if (!(typeof doc.class_mid === 'number' && doc.class_mid >= 0 && doc.class_mid <= 9)) out.push('class_mid ต้องอยู่ใน [0, 9]');
  if (typeof doc.class_step === 'number' && typeof doc.class_mid === 'number' && 1 - doc.class_step * doc.class_mid <= 0) out.push('class_step × class_mid ต้อง < 1 (ฐานะต่ำสุดห้ามหยุดนิ่ง)');
  return out;
}
