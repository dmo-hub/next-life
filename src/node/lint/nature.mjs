// นิสัยจากวัยเด็ก (B41 · ใบ ft07): ทะเบียน content/rules/nature.yaml ต้องถูกรูปก่อนแกนอ่าน (ย้ายมาจาก checkFocus ใบ ft15a)
import { CATEGORIES, STAGE_AGES } from './vocab.mjs';
import { isObj, isInt, list } from './util.mjs';
import { STAT_KEYS } from '../../engine/life.mjs';
import { FOCUS_BANNED } from './focus.mjs';

// ctx: jobs = id อาชีพ · treeNodes = id โหนดต้นไม้ (ไม่ส่ง = ข้ามการตรวจที่ต้องอ่านทะเบียนอื่น)
export function checkNature(doc, ctx = {}) {
  const out = [];
  if (!isObj(doc)) return ['ทะเบียนนิสัยต้องเป็น object'];
  // นิสัยจากวัยเด็ก (B41): มาเป็นชุด — มีทะเบียนนิสัย ต้องมีอายุล็อกและแต้มทายาท
  if (!isObj(doc.natures) || !Object.keys(doc.natures).length) out.push('natures ต้องมีอย่างน้อย 1 ตัว');
  for (const [id, n] of Object.entries(isObj(doc.natures) ? doc.natures : {})) {
    if (!(isObj(n) && typeof n.name === 'string' && n.name && !FOCUS_BANNED.test(n.name))) {
      out.push(`natures.${id}.name ต้องเป็นข้อความ ไม่มีตัวเลข/คำบุญบาป`);
      continue;
    }
    if (n.stat !== undefined && ![...STAT_KEYS, 'money'].includes(n.stat)) out.push(`natures.${id}.stat ไม่ใช่ค่าที่คูณได้: ${n.stat}`);
    for (const t of list(n.cards)) if (!CATEGORIES.includes(t)) out.push(`natures.${id}.cards ไม่ใช่หมวดการ์ด: ${t}`);
    for (const j of list(n.jobs)) if (ctx.jobs && !ctx.jobs.includes(j)) out.push(`natures.${id}.jobs ไม่รู้จักอาชีพ ${j}`);
    for (const t of list(n.nodes)) if (ctx.treeNodes && !ctx.treeNodes.includes(t)) out.push(`natures.${id}.nodes ไม่รู้จักโหนดต้นไม้ ${t}`);
  }
  if (!(typeof doc.nature_mul === 'number' && doc.nature_mul >= 1)) out.push('nature_mul ต้องเป็นเลข ≥ 1');
  if (!(isInt(doc.nature_age) && doc.nature_age > 0 && doc.nature_age < STAGE_AGES['วัยรุ่น'][0])) out.push('nature_age ต้องเป็นอายุช่วงเด็ก');
  if (Object.values(isObj(doc.natures) ? doc.natures : {}).some((n) => list(n?.nodes).length) && !(isInt(doc.node_pts) && doc.node_pts >= 1)) out.push('node_pts ต้องเป็นจำนวนเต็ม ≥ 1 เมื่อมีนิสัยผูกโหนด');
  const owner = {};
  for (const [id, n] of Object.entries(isObj(doc.natures) ? doc.natures : {})) for (const t of list(n?.nodes)) {
    if (owner[t]) out.push(`โหนด ${t} ผูกนิสัยซ้ำ ${owner[t]} กับ ${id} (โหนดเดียวผูกได้นิสัยเดียว)`);
    owner[t] = id;
  }
  if (!(typeof doc.heir_nature === 'number' && doc.heir_nature >= 0 && doc.heir_nature <= 1)) out.push('heir_nature ต้องอยู่ระหว่าง 0–1');
  return out;
}
