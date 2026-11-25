// นิสัยจากวัยเด็ก (B41 · ใบ ft07): ทะเบียน content/rules/nature.yaml ต้องถูกรูปก่อนแกนอ่าน (ย้ายมาจาก checkFocus ใบ ft15a)
import { CATEGORIES, STAGE_AGES } from './vocab.mjs';
import { isObj, isInt, list, choicesOf } from './util.mjs';
import { STAT_KEYS } from '../../engine/life.mjs';
// คำบนปุ่มห้ามบอกตัวเลขและห้ามพูดถึงบัญชีบุญบาป (ผลบุญบาปแตะได้ แต่เป็นความลับ)
export const FOCUS_BANNED = /[0-9๐-๙]|บุญ|บาป|กรรม/;

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

// ป้าย nature บนตัวเลือกการ์ดนับแต้มได้ถึง nature_age · การ์ดอายุ 0–5 ยังไม่ใช่การเลือกของเด็กเอง จึงไม่ติดป้าย
export const NATURE_CARD_FROM = 6;
// ช่วงอายุที่การ์ดออกได้ = ช่วงวัย ∩ when.age ∩ at_age
function cardAges(e) {
  let [lo, hi] = STAGE_AGES[e.stage] ?? [0, 120];
  const w = isObj(e.when) ? e.when.age : undefined;
  if (Array.isArray(w) && w.length === 2) [lo, hi] = [Math.max(lo, w[0]), Math.min(hi, w[1])];
  if (isInt(e.at_age)) [lo, hi] = [Math.max(lo, e.at_age), Math.min(hi, e.at_age)];
  return [lo, hi];
}

export const rules = [
  {
    id: 'focus-gate',
    desc: 'gate ของตัวเลือก = โหนดประตูใน tree.yaml gates (ตัวเดียวหรือรายการ) · การ์ดต้องเหลือตัวเลือกที่ไม่ติดประตูอย่างน้อย 1 ให้ชีวิตที่ประตูปิด',
    event(e, ctx, r) {
      const cs = Array.isArray(e.choices) ? e.choices : [];
      let gated = 0;
      cs.forEach((c, i) => {
        if (c?.gate === undefined) return;
        gated++;
        const ids = [c.gate].flat();
        if (!ids.length || ids.some((id) => typeof id !== 'string')) return r(`.choices[${i}].gate`, 'gate ต้องเป็นชื่อโหนดประตูหรือรายการชื่อ');
        for (const id of ids) if (!ctx.gateFocuses.includes(id)) r(`.choices[${i}].gate`, `ไม่ใช่โหนดประตูใน tree.yaml gates: ${id}`);
      });
      if (gated && gated === cs.length) r('.choices', 'ทุกตัวเลือกติดประตู — ชีวิตที่ประตูปิดจะได้การ์ดไม่มีตัวเลือก');
    },
  },
  {
    id: 'nature-tag',
    desc: `nature ของตัวเลือก และ requires.nature = id นิสัยใน content/rules/nature.yaml · ป้าย nature ติดได้เฉพาะการ์ดที่ออกได้ช่วงอายุ ${NATURE_CARD_FROM}–nature_age (แต้มนับถึงอายุล็อก)`,
    event(e, ctx, r) {
      const ids = Object.keys(ctx.natures ?? {});
      const [lo, hi] = cardAges(e);
      for (const { c, path } of choicesOf(e)) {
        const q = isObj(c.requires) ? c.requires : {};
        for (const [id, at] of [[c.nature, `${path}.nature`], [q.nature, `${path}.requires.nature`]]) {
          if (id !== undefined && !ids.includes(id)) r(at, `อ้างนิสัยที่ไม่มี: ${JSON.stringify(id)} (${ids.join(' ') || 'ไม่มีทะเบียนนิสัย'})`);
        }
        if (c.nature !== undefined && !(hi >= NATURE_CARD_FROM && lo <= ctx.natureAge)) r(`${path}.nature`, `การ์ดออกอายุ ${lo}–${hi} ไม่แตะช่วง ${NATURE_CARD_FROM}–${ctx.natureAge} — ป้ายไม่ได้แต้ม`);
      }
    },
  },
];
