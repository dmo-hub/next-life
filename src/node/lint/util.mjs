// ตัวช่วยร่วมของกติกา — เดินหาจุดต่าง ๆ ในเหตุการณ์ด้วยวิธีเดียวกันทุกกติกา path ในข้อความจึงตรงกัน
import { PLACEHOLDERS, LEDGER_PLACEHOLDER, COND_PLACEHOLDERS } from './vocab.mjs';

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
    if (typeof c.hint === 'string') out.push({ kind: 'hint', path: `${path}.hint`, s: c.hint });
    // ผลทางเดียว (Q1) ผ่านด่านความยาว/คำต้องห้ามแบบข้อความผล
    if (typeof c.result === 'string') out.push({ kind: 'text', path: `${path}.result`, s: c.result });
    if (typeof c.requires?.reason === 'string') out.push({ kind: 'choice', path: `${path}.requires.reason`, s: c.requires.reason });
    // เหตุล็อกแยกข้อ (B1 requires.reasons) ขึ้นบนปุ่มแบบเดียวกับ reason
    for (const [k, v] of Object.entries(c.requires?.reasons ?? {})) if (typeof v === 'string') out.push({ kind: 'choice', path: `${path}.requires.reasons.${k}`, s: v });
    list(c.outcomes).forEach((o, j) => typeof o?.text === 'string' && out.push({ kind: 'text', path: `${path}.outcomes[${j}].text`, s: o.text }));
  }
  return out;
}

// ตัวแทนมีเงื่อนไข {key:ทาง1|ทาง2} (B1): ชื่อ key ต้องอยู่ใน COND_PLACEHOLDERS · ทางซ้อนตัวแทนธรรมดาได้หนึ่งชั้น
const COND_RE = /\{([^{}:|]+):((?:[^{}]|\{[^{}]*\})*)\}/g;
export const condBranches = (body) => body.split('|');
// ช่องทั้งหมดในข้อความ: ตัวมีเงื่อนไขคืน "key:" (ให้ด่านตรวจชื่อ) + ช่องธรรมดาในทุกทาง · จำนวนทางเกินคืน "key:เกินทาง"
export const placeholdersIn = (s) => {
  const out = [];
  const rest = s.replace(COND_RE, (m, k, body) => {
    const n = condBranches(body).length;
    out.push(k in COND_PLACEHOLDERS && n <= COND_PLACEHOLDERS[k] ? `${k}:` : `${k}:เกินทาง`);
    for (const b of condBranches(body)) out.push(...[...b.matchAll(/\{([^{}]*)\}/g)].map((x) => x[1]));
    return '';
  });
  return [...out, ...[...rest.matchAll(/\{([^{}]*)\}/g)].map((m) => m[1])];
};
export const isCondPlaceholder = (k) => k.endsWith(':') && k.slice(0, -1) in COND_PLACEHOLDERS;
export const isLedgerPlaceholder = (name) => LEDGER_PLACEHOLDER.test(name);
const fillPlain = (s) => s.replace(/\{([^{}]*)\}/g, (m, k) => PLACEHOLDERS[k] ?? m);
// ค่ายาวสุด: ตัวมีเงื่อนไขเลือกทางที่ยาวสุดหลังเติมช่องข้างใน · "นะ{ถิ่น}" กลายเป็นคำลงท้ายแทน นะ ความยาวไม่เกินเติมตรง ๆ
export const fillLongest = (s) => fillPlain(s.replace(COND_RE, (m, k, body) => (k in COND_PLACEHOLDERS ? condBranches(body).map(fillPlain).reduce((a, b) => (b.length > a.length ? b : a), '') : m)));

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
