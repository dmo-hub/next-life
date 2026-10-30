// โฟกัสชีวิต (B163): ทะเบียน content/rules/focus.yaml ต้องถูกรูปก่อนแกนอ่าน · การ์ดที่ติดป้ายหมวดโฟกัสต้องอ้างป้ายที่มีจริง
import { CATEGORIES, EFFECT_KEYS, STAGE_AGES, SCHOOL_VALUES } from './vocab.mjs';
import { isObj, isInt, list } from './util.mjs';

export const FOCUS_GROUPS = ['work', 'people', 'body', 'gate'];
// คำบนปุ่มห้ามบอกตัวเลขและห้ามพูดถึงบัญชีบุญบาป (ผลบุญบาปแตะได้ แต่เป็นความลับ)
export const FOCUS_BANNED = /[0-9๐-๙]|บุญ|บาป|กรรม/;
const STAGE_SET = new Set(Object.keys(STAGE_AGES));

// ป้ายที่การ์ดใช้ถ่วงได้ = category ของการ์ด + ป้ายเพิ่มในทะเบียน
export const focusTags = (doc) => [...CATEGORIES, ...Object.keys(doc?.tags ?? {})];

export function checkFocus(doc) {
  const out = [];
  if (!isObj(doc)) return ['ทะเบียนโฟกัสต้องเป็น object'];
  for (const k of ['year_scale', 'card_mul']) if (!(typeof doc[k] === 'number' && doc[k] > 0)) out.push(`${k} ต้องเป็นเลขบวก`);
  const tags = new Set(focusTags(doc));
  if (!isObj(doc.focuses) || !Object.keys(doc.focuses).length) out.push('focuses ต้องมีอย่างน้อย 1 ตัว');
  for (const [id, f] of Object.entries(doc.focuses ?? {})) {
    const at = `focuses.${id}`;
    if (!isObj(f)) {
      out.push(`${at} ต้องเป็น object`);
      continue;
    }
    if (typeof f.name !== 'string' || !f.name || FOCUS_BANNED.test(f.name)) out.push(`${at}.name ต้องเป็นข้อความ ไม่มีตัวเลข/คำบุญบาป`);
    if (!FOCUS_GROUPS.includes(f.group)) out.push(`${at}.group ต้องเป็นหนึ่งใน ${FOCUS_GROUPS.join(' ')}`);
    if (f.stages !== undefined && !(Array.isArray(f.stages) && f.stages.length && f.stages.every((s) => STAGE_SET.has(s)))) out.push(`${at}.stages ต้องเป็นชื่อช่วงวัยของแกน`);
    for (const s of list(f.when?.school)) if (!SCHOOL_VALUES.includes(s)) out.push(`${at}.when.school ไม่รู้จัก ${s}`);
    if (!isObj(f.fx) || !Object.keys(f.fx).length) out.push(`${at}.fx ต้องมีผลอย่างน้อย 1 ค่า`);
    for (const [k, v] of Object.entries(f.fx ?? {})) {
      if (!EFFECT_KEYS.includes(k)) out.push(`${at}.fx.${k} ไม่ใช่ค่าที่โฟกัสแตะได้`);
      else if (k === 'money' ? !(isObj(v) && v.unit === 'income_x' && typeof v.amount === 'number' && v.amount) : !(isInt(v) && v && Math.abs(v) <= 3)) out.push(`${at}.fx.${k} ต้องเป็นระดับ ±1..±3 (เงิน = {unit: income_x, amount})`);
    }
    if (!Array.isArray(f.cards) || !f.cards.length) out.push(`${at}.cards ต้องมีป้ายหมวดการ์ดอย่างน้อย 1`);
    for (const t of list(f.cards)) if (!tags.has(t)) out.push(`${at}.cards อ้างป้ายที่ไม่มี: ${t}`);
  }
  return out;
}

export const rules = [
  {
    id: 'focus-tag',
    desc: 'focus ของการ์ด = รายการป้ายหมวดโฟกัสที่มีจริง (category หรือ tags ใน content/rules/focus.yaml)',
    event(e, ctx, r) {
      if (e.focus === undefined) return;
      if (!Array.isArray(e.focus) || !e.focus.length) return r('.focus', 'focus ต้องเป็นรายการป้าย');
      e.focus.forEach((t, i) => {
        if (!ctx.focusTags.includes(t)) r(`.focus[${i}]`, `ป้ายหมวดโฟกัสไม่มีจริง: ${t}`);
      });
    },
  },
];
