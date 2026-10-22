// ทดสอบด่านเนื้อหา: content-fixtures/bad/<กติกา>.yaml ต้องตกด้วยกติกาตามชื่อไฟล์เท่านั้น (ตกด้วยกติกาอื่นด้วย = ทดสอบไม่ได้แยกกติกา)
// · good/*.yaml ต้องผ่าน · ทุกกติกาต้องมีไฟล์ bad ≥1 · คำต้องห้ามทุกข้อต้องจับ bad และปล่อย ok ของตัวเอง · content/ จริงต้องผ่าน
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { RULES, DOC_SHAPE, lintContext, lintDocs, formatProblem } from '../src/node/lint/index.mjs';
import { loadEvents } from '../src/node/load.mjs';
import { MERIT_CATS, MAX_LEN } from '../src/node/lint/vocab.mjs';
import { checkMeritTable, MERIT_WEIGHTS, OMEN_TEXT, MERIT_LEVELS, KARMA } from '../src/engine/merit.mjs';

const root = new URL('../', import.meta.url);
const dir = (d) => readdirSync(new URL(d, root)).filter((n) => n.endsWith('.yaml')).sort();
const load = (d, f) => ({ file: `${d}${f}`, doc: parse(readFileSync(new URL(`${d}${f}`, root), 'utf8')) });
const ctx = lintContext();
const fails = [];
const rows = [];

const ruleIds = [DOC_SHAPE, ...RULES].map((r) => r.id);
const bad = dir('content-fixtures/bad/');
for (const f of bad) {
  const want = f.replace(/\.yaml$/, '');
  const got = [...new Set(lintDocs([load('content-fixtures/bad/', f)], ctx).map((p) => p.rule))];
  const ok = got.length === 1 && got[0] === want;
  rows.push([want, ok ? 'ตกถูกกติกา' : `ได้ ${got.join(', ') || 'ผ่าน (ไม่ตก)'}`]);
  if (!ok) fails.push(`bad/${f}: ต้องตกด้วย ${want} อย่างเดียว ได้ [${got.join(', ')}]`);
  if (!ruleIds.includes(want)) fails.push(`bad/${f}: ไม่มีกติกาชื่อ ${want}`);
}
for (const id of ruleIds) if (!bad.includes(`${id}.yaml`)) fails.push(`กติกา ${id} ไม่มีไฟล์ bad ทดสอบ`);

for (const f of dir('content-fixtures/good/')) {
  const ps = lintDocs([load('content-fixtures/good/', f)], ctx);
  rows.push([`good/${f}`, ps.length ? `ตก ${ps.length} ข้อ` : 'ผ่าน']);
  for (const p of ps) fails.push(`good: ${formatProblem(p)}`);
}

for (const b of ctx.banned) {
  for (const s of b.bad ?? []) if (!b.re.test(s)) fails.push(`banned ${b.id}: ไม่จับ "${s}"`);
  for (const s of b.ok ?? []) if (b.re.test(s)) fails.push(`banned ${b.id}: จับผิด "${s}"`);
  if (!b.bad?.length || !b.ok?.length) fails.push(`banned ${b.id}: ต้องมีตัวอย่าง bad และ ok`);
}

// ตารางบุญบาป: ของจริงผ่าน · ตัวควบคุมที่ผิดทีละอย่างต้องตก (กันด่านที่ไม่เคยตก)
const table = checkMeritTable(MERIT_CATS);
rows.push(['merit-table', table.length ? `ตก ${table.length} ข้อ` : 'ผ่าน']);
for (const t of table) fails.push(`merit-table: ${t}`);
const controls = {
  'vow_broken หนักเท่าระดับ 1': [MERIT_CATS, { ...MERIT_WEIGHTS, vow_broken: 1 }],
  'ขาดหมวด dana': [MERIT_CATS, Object.fromEntries(Object.entries(MERIT_WEIGHTS).filter(([k]) => k !== 'dana'))],
  'หมวดเกินจากด่าน': [MERIT_CATS.filter((c) => c.id !== 'sila'), MERIT_WEIGHTS],
  'ด่านว่าเป็นธงแต่แกนไม่รู้': [MERIT_CATS.map((c) => (c.id === 'adultery' ? { ...c, flag: true } : c)), MERIT_WEIGHTS],
  'ระดับไม่เรียง': [MERIT_CATS, MERIT_WEIGHTS, { ...MERIT_LEVELS, 2: 5 }],
  'บุญเพิ่มความเสี่ยง': [MERIT_CATS, MERIT_WEIGHTS, MERIT_LEVELS, { ...KARMA, meritMin: 1.2 }],
};
for (const [name, args] of Object.entries(controls)) if (!checkMeritTable(...args).length) fails.push(`merit-table ตัวควบคุม "${name}" ไม่ตก`);
rows.push(['merit-table ตัวควบคุม', `${Object.keys(controls).length} แบบ`]);
// ข้อความลางอยู่ในแกน ไม่ผ่านด่านเนื้อหา — ตรวจคำต้องห้าม · ความยาว · ไม่มีตัวเลข ที่นี่แทน
for (const [tone, xs] of Object.entries(OMEN_TEXT)) for (const s of xs) {
  for (const b of ctx.banned) if (b.re.test(s)) fails.push(`ลาง ${tone}: โดนคำต้องห้าม ${b.id} "${s}"`);
  if (s.length > MAX_LEN.text) fails.push(`ลาง ${tone}: ยาวเกิน ${MAX_LEN.text} "${s}"`);
  if (/[0-9๐-๙]/.test(s)) fails.push(`ลาง ${tone}: มีตัวเลข "${s}"`);
}

try {
  rows.push(['content/', `ผ่าน ${loadEvents().length} เหตุการณ์`]);
} catch (err) {
  fails.push(err.message);
}

const w = Math.max(...rows.map((r) => r[0].length));
for (const [a, b] of rows) console.log(`${a.padEnd(w)}  ${b}`);
console.log(`\nกติกา ${ruleIds.length} · ไฟล์ bad ${bad.length} · คำต้องห้าม ${ctx.banned.length} ข้อ`);
if (fails.length) {
  for (const f of fails) console.log(`  ✗ ${f}`);
  console.log(`ไม่ผ่าน ${fails.length} ข้อ`);
  process.exitCode = 1;
} else console.log('ผ่านทั้งหมด');
