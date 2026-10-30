// โฟกัสชีวิต (B163): ทะเบียน content/rules/focus.yaml ต้องถูกรูปก่อนแกนอ่าน · การ์ดที่ติดป้ายหมวดโฟกัสต้องอ้างป้ายที่มีจริง
import { CATEGORIES, EFFECT_KEYS, STAGE_AGES, SCHOOL_VALUES } from './vocab.mjs';
import { isObj, isInt, list } from './util.mjs';
import { FOCUS_NEEDS } from '../../engine/life.mjs';

export const FOCUS_GROUPS = ['work', 'people', 'body', 'gate'];
// คำบนปุ่มห้ามบอกตัวเลขและห้ามพูดถึงบัญชีบุญบาป (ผลบุญบาปแตะได้ แต่เป็นความลับ)
export const FOCUS_BANNED = /[0-9๐-๙]|บุญ|บาป|กรรม/;
const STAGE_SET = new Set(Object.keys(STAGE_AGES));

// ป้ายที่การ์ดใช้ถ่วงได้ = category ของการ์ด + ป้ายเพิ่มในทะเบียน
export const focusTags = (doc) => [...CATEGORIES, ...Object.keys(doc?.tags ?? {})];

// ผลเป็นระดับ ±1..±3 แบบการ์ด · เงิน = {unit: income_x, amount} (ผลต่อปีและผลเสี่ยงใช้รูปเดียวกัน)
function checkFx(fx, at, out, need = true) {
  if (!isObj(fx) || (need && !Object.keys(fx).length)) return out.push(`${at} ต้องมีผลอย่างน้อย 1 ค่า`);
  for (const [k, v] of Object.entries(fx)) {
    if (!EFFECT_KEYS.includes(k)) out.push(`${at}.${k} ไม่ใช่ค่าที่โฟกัสแตะได้`);
    else if (k === 'money' ? !(isObj(v) && v.unit === 'income_x' && typeof v.amount === 'number' && v.amount) : !(isInt(v) && v && Math.abs(v) <= 3)) out.push(`${at}.${k} ต้องเป็นระดับ ±1..±3 (เงิน = {unit: income_x, amount})`);
  }
}

// ctx (ไม่ส่ง = ข้ามการตรวจที่ต้องอ่านทะเบียนอื่น): causes = สาเหตุตายที่แกนรู้จัก · flags = ธงที่ลงทะเบียน
export function checkFocus(doc, ctx = {}) {
  const out = [];
  if (!isObj(doc)) return ['ทะเบียนโฟกัสต้องเป็น object'];
  for (const k of ['year_scale', 'spend_scale', 'card_mul', 'chain_years']) if (!(typeof doc[k] === 'number' && doc[k] > 0)) out.push(`${k} ต้องเป็นเลขบวก`);
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
    for (const n of list(f.need)) if (!FOCUS_NEEDS[n]) out.push(`${at}.need ไม่รู้จัก ${n} (มี ${Object.keys(FOCUS_NEEDS).join(' ')})`);
    for (const k of ['after', 'kid']) if (f[k] !== undefined && !doc.focuses[f[k]]) out.push(`${at}.${k} อ้างโฟกัสที่ไม่มี: ${f[k]}`);
    if (f.after === id) out.push(`${at}.after อ้างตัวเอง`);
    // ตัวเด็กต้องเลือกได้ตั้งแต่เด็ก ไม่งั้นทายาทรอจนโต
    if (f.kid && doc.focuses[f.kid] && !(doc.focuses[f.kid].stages ?? ['เด็ก']).includes('เด็ก')) out.push(`${at}.kid ต้องเป็นโฟกัสที่เปิดช่วงเด็ก: ${f.kid}`);
    checkFx(f.fx, `${at}.fx`, out);
    if (f.career !== undefined && !(isObj(f.career) && typeof f.career.rank === 'number' && typeof f.career.raise === 'number' && f.career.raise > -1)) out.push(`${at}.career ต้องเป็น {rank: เลข, raise: เลข}`);
    if (f.risk !== undefined && !(Array.isArray(f.risk) && f.risk.length)) out.push(`${at}.risk ต้องเป็นรายการ`);
    list(f.risk).forEach((r, i) => {
      const ra = `${at}.risk[${i}]`;
      if (!isObj(r)) return out.push(`${ra} ต้องเป็น object`);
      if (!(typeof r.chance === 'number' && r.chance > 0 && r.chance < 1)) out.push(`${ra}.chance ต้องอยู่ระหว่าง 0–1`);
      if (r.fx !== undefined) checkFx(r.fx, `${ra}.fx`, out, false);
      // เสี่ยงตายต้องมีการ์ดเตือนก่อน (เจ้าของเคาะ) · เสี่ยงธรรมดามีการ์ดผล
      const txt = r.cause ? 'warn' : 'text';
      if (typeof r[txt] !== 'string' || !r[txt]) out.push(`${ra}.${txt} ต้องมีข้อความ`);
      if (r.cause && ctx.causes && !ctx.causes.includes(r.cause)) out.push(`${ra}.cause ไม่รู้จัก ${r.cause}`);
      for (const fl of list(r.flags)) if (ctx.flags && !ctx.flags.includes(fl)) out.push(`${ra}.flags ไม่ได้ลงทะเบียน ${fl}`);
    });
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
  {
    id: 'focus-gate',
    desc: 'gate ของตัวเลือก = โฟกัสหมวด gate ที่มีจริง (ตัวเดียวหรือรายการ) · การ์ดต้องเหลือตัวเลือกที่ไม่ติดประตูอย่างน้อย 1 ให้ชีวิตที่ประตูปิด',
    event(e, ctx, r) {
      const cs = Array.isArray(e.choices) ? e.choices : [];
      let gated = 0;
      cs.forEach((c, i) => {
        if (c?.gate === undefined) return;
        gated++;
        const ids = [c.gate].flat();
        if (!ids.length || ids.some((id) => typeof id !== 'string')) return r(`.choices[${i}].gate`, 'gate ต้องเป็นชื่อโฟกัสหรือรายการชื่อ');
        for (const id of ids) if (!ctx.gateFocuses.includes(id)) r(`.choices[${i}].gate`, `ไม่ใช่โฟกัสหมวด gate: ${id}`);
      });
      if (gated && gated === cs.length) r('.choices', 'ทุกตัวเลือกติดประตู — ชีวิตที่ประตูปิดจะได้การ์ดไม่มีตัวเลือก');
    },
  },
];
