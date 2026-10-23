// ตัวช่วยร่วมของกติกา — เดินหาจุดต่าง ๆ ในเหตุการณ์ด้วยวิธีเดียวกันทุกกติกา path ในข้อความจึงตรงกัน
import { PLACEHOLDERS, LEDGER_PLACEHOLDER } from './vocab.mjs';

export const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
export const isInt = (v) => Number.isInteger(v);
export const isRange = (v, lo, hi) => Array.isArray(v) && v.length === 2 && v.every((x) => isInt(x) && x >= lo && x <= hi) && v[0] <= v[1];
export const list = (v) => (Array.isArray(v) ? v : []);
export const choicesOf = (e) => list(e.choices).map((c, i) => ({ c: isObj(c) ? c : {}, path: `.choices[${i}]` }));

// ทุกจุดที่ "ผล" เกิดได้: ตัวเลือก และผลสุ่มแต่ละทางของตัวเลือก
export function effectSites(e) {
  const out = [];
  for (const { c, path } of choicesOf(e)) {
    out.push({ node: c, path, choice: c });
    list(c.outcomes).forEach((o, j) => isObj(o) && out.push({ node: o, path: `${path}.outcomes[${j}]`, choice: c }));
  }
  return out;
}

// ข้อความทุกชิ้นที่ผู้เล่นเห็น พร้อมชนิดสำหรับเพดานความยาว
export function textsOf(e) {
  const out = [];
  if (typeof e.title === 'string') out.push({ kind: 'title', path: '.title', s: e.title });
  if (typeof e.text === 'string') out.push({ kind: 'text', path: '.text', s: e.text });
  for (const { c, path } of choicesOf(e)) {
    for (const k of ['text', 'label']) if (typeof c[k] === 'string') out.push({ kind: 'choice', path: `${path}.${k}`, s: c[k] });
    // เหตุผลที่ล็อกขึ้นบนปุ่มแทนป้ายผล — ผ่านด่านความยาว/คำต้องห้ามเหมือนข้อความตัวเลือก
    if (typeof c.requires?.reason === 'string') out.push({ kind: 'choice', path: `${path}.requires.reason`, s: c.requires.reason });
    list(c.outcomes).forEach((o, j) => typeof o?.text === 'string' && out.push({ kind: 'text', path: `${path}.outcomes[${j}].text`, s: o.text }));
  }
  return out;
}

export const placeholdersIn = (s) => [...s.matchAll(/\{([^{}]*)\}/g)].map((m) => m[1]);
export const isLedgerPlaceholder = (name) => LEDGER_PLACEHOLDER.test(name);
export const fillLongest = (s) => s.replace(/\{([^{}]*)\}/g, (m, k) => PLACEHOLDERS[k] ?? m);

export const MONEY_UNITS = ['income_x', 'fixed_baht'];
export const isMoney = (m) =>
  isObj(m) &&
  MONEY_UNITS.includes(m.unit) &&
  typeof m.amount === 'number' &&
  Number.isFinite(m.amount) &&
  (m.ref_year === undefined || (m.unit === 'fixed_baht' && isInt(m.ref_year)));

// เทียบโครงข้อมูลแบบลึก ไม่สนลำดับ key
export function same(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => same(a[k], b[k]));
}

// ค่าสตริงทุกตัวในเหตุการณ์ (ใช้หาว่าใครอ้างบัญชีบุญบาป)
export function* strings(node, path = '') {
  if (typeof node === 'string') yield { path, s: node };
  else if (Array.isArray(node)) for (let i = 0; i < node.length; i++) yield* strings(node[i], `${path}[${i}]`);
  else if (isObj(node)) for (const [k, v] of Object.entries(node)) yield* strings(v, `${path}.${k}`);
}
