// ต้นไม้โฟกัส (ใบ 03): ทะเบียน content/rules/tree.yaml ต้องถูกรูปก่อนแกนอ่าน — ขอบชี้โหนดที่ไม่มี · วนเป็นวง · หมวด/ช่วงวัย/ผลผิด = หยุด build
import { CATEGORIES, EFFECT_KEYS, STAGE_AGES } from './vocab.mjs';
import { isObj, isInt } from './util.mjs';
// ชื่อโหนดห้ามมีตัวเลข · คำ "บุญ" ใช้ได้ (ร่างที่เจ้าของเคาะมี "ทำบุญเป็นนิจ") ต่างจากปุ่มโฟกัสที่ห้ามคำบัญชีบุญบาป
const NAME_BANNED = /[0-9๐-๙]/;

export const TREE_SIZES = ['s', 'b', 'k'];
export const MID = 'mid';
const STAGE_SET = new Set(Object.keys(STAGE_AGES));
const fxLevel = (v) => isInt(v) && v !== 0 && Math.abs(v) <= 3;

// ผลเบาถาวรรวมทั้งต้น/ปี หน่วยระดับการ์ด/ปี (ข้อ 93) — ใช้ทั้ง lint และ harness `tree`
export const treeBudgetSpent = (doc) => Object.values(doc.nodes ?? {}).reduce((a, n) => a + Object.values(n.light ?? {}).reduce((b, v) => b + Math.abs(v), 0) * (doc.light_unit?.[n.size] ?? 0), 0);

const natural = (v) => isInt(v) && v >= 0;
function checkTreeStart(st, nodes, jobs) {
  if (!isObj(st)) return ['start ต้องเป็น object'];
  const out = [];
  if (!natural(st.base)) out.push('start.base ต้องเป็นจำนวนเต็ม ≥ 0');
  if (!natural(st.parent_branch)) out.push('start.parent_branch ต้องเป็นจำนวนเต็ม ≥ 0');
  const branches = [...new Set(Object.values(isObj(nodes) ? nodes : {}).map((n) => n?.branch).filter((b) => typeof b === 'string' && b !== MID))];
  for (const band of ['low', 'mid', 'high']) {
    const row = st.class?.[band];
    if (!isObj(row)) { out.push(`start.class.${band} ต้องมีตารางแต้มต่อแขนง`); continue; }
    for (const b of branches) if (!natural(row[b])) out.push(`start.class.${band}.${b} ต้องเป็นจำนวนเต็ม ≥ 0 (ทุกแขนงต้องมี)`);
    for (const k of Object.keys(row)) if (!branches.includes(k)) out.push(`start.class.${band}.${k} ไม่ใช่แขนงของทะเบียน`);
    if (branches.every((b) => !((st.base ?? 0) + (row[b] ?? 0)))) out.push(`start.class.${band} น้ำหนักรวมเป็นศูนย์ ไม่มีแขนงให้เริ่ม`);
  }
  for (const [j, row] of Object.entries(isObj(st.job) ? st.job : {})) {
    if (jobs && !jobs.includes(j)) out.push(`start.job.${j} ไม่รู้จักอาชีพ`);
    if (!isObj(row)) { out.push(`start.job.${j} ต้องเป็นตารางแต้มต่อแขนง`); continue; }
    for (const [b, v] of Object.entries(row)) if (!branches.includes(b) || !natural(v)) out.push(`start.job.${j}.${b} ต้องเป็นแขนงจริง + จำนวนเต็ม ≥ 0`);
  }
  return out;
}

export function checkTree(doc, jobs = null) {
  const out = [];
  if (!isObj(doc)) return ['ทะเบียนต้นไม้ต้องเป็น object'];
  if (!(typeof doc.year_scale === 'number' && doc.year_scale > 0)) out.push('year_scale ต้องเป็นเลขบวก');
  for (const k of TREE_SIZES) if (!(typeof doc.light_unit?.[k] === 'number' && doc.light_unit[k] > 0)) out.push(`light_unit.${k} ต้องเป็นเลขบวก`);
  if (!(typeof doc.roll_k === 'number' && doc.roll_k >= 0)) out.push('roll_k ต้องเป็นเลข ≥ 0');
  if (!(typeof doc.card_mul === 'number' && doc.card_mul >= 1)) out.push('card_mul ต้องเป็นเลข ≥ 1');
  if (!(typeof doc.budget === 'number' && doc.budget > 0)) out.push('budget ต้องเป็นเลขบวก');
  if (doc.budget_ref !== undefined && !(isObj(doc.budget_ref) && ['sum', 'one'].every((k) => typeof doc.budget_ref[k] === 'number' && doc.budget_ref[k] > 0))) out.push('budget_ref ต้องมี sum กับ one เป็นเลขบวก');
  // สนิม (ใบ 09): ไม่ใส่ = ไม่มีสนิม · ใส่ = years จำนวนเต็ม ≥ 1 · floor 0 < x < 1 (จางลง ไม่หายหมด ไม่เพิ่ม)
  if (doc.rust !== undefined && !(isObj(doc.rust) && Number.isInteger(doc.rust.years) && doc.rust.years >= 1 && typeof doc.rust.floor === 'number' && doc.rust.floor > 0 && doc.rust.floor < 1)) out.push('rust ต้องมี years จำนวนเต็ม ≥ 1 และ floor ระหว่าง 0 ถึง 1 (ไม่รวมปลาย)');
  const nodes = doc.nodes;
  // ประตูเข้าสาย (ใบ 10): โหนดต้องมีจริงและเป็นโหนดใหญ่/keystone (ประตูลึก ข้อ 37) · gates เป็นรายการรหัสโหนด
  if (doc.gates !== undefined) {
    if (!Array.isArray(doc.gates) || !doc.gates.length) out.push('gates ต้องเป็นรายการรหัสโหนด');
    else for (const id of doc.gates) {
      if (!isObj(nodes) || !isObj(nodes[id])) out.push(`gates.${id} ไม่ใช่โหนดในทะเบียน`);
      else if (nodes[id].size === 's') out.push(`gates.${id} ประตูต้องเป็นโหนดใหญ่หรือ keystone ไม่ใช่โหนดเล็ก`);
    }
  }
  // จุดเกิด (ใบ 06 ข้อ 97): ตารางต้องครอบทุกแขนงจริงของทะเบียน ทุกชั้นฐานะ · แต้มจำนวนเต็ม ≥ 0 · อาชีพต้องมีจริง
  if (doc.start !== undefined) out.push(...checkTreeStart(doc.start, nodes, jobs));
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
    // nolight = ปลดตัวเลือกอย่างเดียว ไม่มีผลเบาถาวร ไม่มีทอย (โหนดกลางชุดสอง ข้อ 83) · ไม่ใส่ nolight = ต้องมี light
    if (n.nolight !== undefined && n.nolight !== true) out.push(`${at}.nolight ต้องเป็น true หรือไม่ใส่`);
    if (n.nolight === true && (n.light !== undefined || n.roll !== 0)) out.push(`${at} nolight ต้องไม่มี light และ roll เป็น 0`);
    for (const key of n.nolight === true ? ['fx'] : ['fx', 'light']) {
      if (!isObj(n[key]) || !Object.keys(n[key]).length) out.push(`${at}.${key} ต้องมีผลอย่างน้อย 1 ค่า`);
      else for (const [k, v] of Object.entries(n[key])) if (!EFFECT_KEYS.includes(k) || k === 'money' || !fxLevel(v)) out.push(`${at}.${key}.${k} ต้องเป็นค่าสถานะระดับ ±1..±3`);
    }
    // โหนดกลาง (ข้อ 71 77): ไม่ใช่แขนงที่ 6 · แม่จาก ≥2 แขนงจริง ต้องปลดครบทุกตัว (and) · โหนดในแขนงห้าม and (ในแขนง = "หรือ" ข้อ 72)
    if (n.and !== undefined && n.and !== true) out.push(`${at}.and ต้องเป็น true หรือไม่ใส่`);
    if (n.branch === MID && n.and !== true) out.push(`${at} โหนดกลางต้องมี and: true`);
    else if (n.branch !== MID && n.and) out.push(`${at} มี and แต่ไม่ใช่โหนดกลาง (branch ${MID})`);
    if (n.branch === MID && Array.isArray(n.pre) && new Set(n.pre.map((p) => nodes[p]?.branch).filter((b) => b && b !== MID)).size < 2) out.push(`${at} โหนดกลางต้องมีแม่จากแขนงจริงอย่างน้อย 2 แขนง`);
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
  // ทุกวัยต้องมีโหนดให้ทุ่ม ≥1 ต่อแขนง นับเฉพาะโหนดที่เห็น (ข้อ 44 61) · โหนดซ่อนจองช่อง "?" ไว้เฉย ๆ ไม่ใช่ทางทุ่มที่ผู้เล่นรู้ · โหนดกลางไม่ใช่แขนง ไม่ต้องครอบทุกวัย
  const seen = {};
  for (const n of Object.values(nodes)) if (isObj(n) && typeof n.branch === 'string' && n.branch !== MID) (seen[n.branch] ??= []).push(n);
  for (const [b, list] of Object.entries(seen)) for (const s of STAGE_SET) if (!list.some((n) => !n.hidden && Array.isArray(n.stages) && n.stages.includes(s))) out.push(`แขนง ${b} ไม่มีโหนดที่เห็นให้ทุ่มในช่วงวัย ${s} (ข้อ 44 61)`);
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
