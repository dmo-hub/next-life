// ทดสอบด่านเนื้อหา: content-fixtures/bad/<กติกา>.yaml ต้องตกด้วยกติกาตามชื่อไฟล์เท่านั้น (ตกด้วยกติกาอื่นด้วย = ทดสอบไม่ได้แยกกติกา)
// · good/*.yaml ต้องผ่าน · ทุกกติกาต้องมีไฟล์ bad ≥1 · คำต้องห้ามทุกข้อต้องจับ bad และปล่อย ok ของตัวเอง · content/ จริงต้องผ่าน
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { RULES, DOC_SHAPE, lintContext, lintDocs, formatProblem } from '../src/node/lint/index.mjs';
import { strings } from '../src/node/lint/util.mjs';
import { loadEvents, loadEra, loadContent } from '../src/node/load.mjs';
import { allocOptions, DISCLAIMER } from '../src/engine/finance.mjs';
import { schoolGate, jobCard, TRACKS, EDU } from '../src/engine/career.mjs';
import { newLife, CLASSES } from '../src/engine/life.mjs';
import { MERIT_CATS, MAX_LEN, MIN_CHOICES, SCHOOL_VALUES } from '../src/node/lint/vocab.mjs';
import { SCENES } from '../src/engine/afterlife.mjs';
import { checkMeritTable, MERIT_WEIGHTS, OMEN_TEXT, MERIT_LEVELS, KARMA } from '../src/engine/merit.mjs';

const root = new URL('../', import.meta.url);
const dir = (d) => readdirSync(new URL(d, root)).filter((n) => n.endsWith('.yaml')).sort();
const load = (d, f) => ({ file: `${d}${f}`, doc: parse(readFileSync(new URL(`${d}${f}`, root), 'utf8')) });
const ctx = lintContext();
// ชื่อธงทุกตัวที่โผล่ในตำแหน่งธง (ตั้ง ล้าง เงื่อนไข ตัวคูณ ล็อก)
const FLAG_PATH = /(sets_flags|clears_flags|\.flags\.(has|not))\[\d+\]$/;
function* flagNames(doc) {
  for (const x of strings(doc)) if (FLAG_PATH.test(x.path)) yield x;
  for (const e of doc.events ?? []) for (const node of [e, ...(e.choices ?? []).flatMap((c) => c.outcomes ?? [])]) for (const f of Object.keys(node.multipliers?.flags ?? {})) yield { s: f };
}
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

// การ์ดจัดสรรเงินสร้างในแกน ไม่ผ่านด่านเนื้อหา — ตรวจทุกปีของเกม: ≥4 ตัวเลือก · ยาว · คำต้องห้าม · หุ้นไม่โผล่ก่อน 2518
const era = loadEra();
const seenLabels = new Set();
for (let y = 2500; y <= 2700; y++) {
  const opts = allocOptions(era, y);
  if (opts.length < MIN_CHOICES) fails.push(`การ์ดจัดสรรปี ${y}: ${opts.length} ตัวเลือก`);
  if (y < 2518 && opts.some((o) => o.alloc?.stock)) fails.push(`การ์ดจัดสรรปี ${y}: เสนอหุ้นก่อนตลาดเปิด`);
  for (const o of opts) seenLabels.add(o.label);
}
for (const s of [...seenLabels, DISCLAIMER]) {
  for (const b of ctx.banned) if (b.re.test(s)) fails.push(`การ์ดจัดสรร: โดนคำต้องห้าม ${b.id} "${s}"`);
  if (s.length > MAX_LEN.choice) fails.push(`การ์ดจัดสรร: ยาวเกิน ${MAX_LEN.choice} "${s}"`);
}
rows.push(['การ์ดจัดสรร 2500–2700', `${seenLabels.size} ข้อความ`]);

// ด่านเรียนต่อ + การ์ดหางานสร้างในแกน ไม่ผ่านด่านเนื้อหา — ตรวจทุกช่วงเรียน × ทุกฐานะ × คอนเน็คชั่น/วุฒิหลายระดับ:
// ≥4 ตัวเลือก · มีทางไม่ล็อก · ยาว · คำต้องห้าม · ผล job/school ชี้ของที่มีจริง
const career = { ...loadContent(), events: [] };
const occIds = career.era.finance.occupations.map((o) => o.id);
const careerTexts = new Set();
let careerCards = 0;
function checkCareer(ev, where) {
  careerCards++;
  if (ev.choices.length < MIN_CHOICES) fails.push(`${where}: ${ev.choices.length} ตัวเลือก`);
  if (ev.choices.every((c) => c.requires)) fails.push(`${where}: ล็อกได้ทุกตัวเลือก`);
  if (ev.text.length > MAX_LEN.text) fails.push(`${where}: ข้อความยาวเกิน ${MAX_LEN.text}`);
  for (const c of ev.choices) {
    if (c.text.length > MAX_LEN.choice) fails.push(`${where}: ตัวเลือกยาวเกิน ${MAX_LEN.choice} "${c.text}"`);
    for (const node of [c, ...(c.outcomes ?? [])]) {
      if (node.text) careerTexts.add(node.text);
      const fx = node.effects ?? {};
      if (fx.job !== undefined && !occIds.includes(fx.job)) fails.push(`${where}: อาชีพ ${fx.job} ไม่มีจริง`);
      if (fx.school !== undefined && !SCHOOL_VALUES.includes(fx.school)) fails.push(`${where}: ช่วงเรียน ${fx.school} ไม่มีจริง`);
    }
  }
}
for (const cls of CLASSES) for (const network of [0, 50, 100]) for (const [i, edu] of [null, ...EDU].entries()) {
  checkCareer(jobCard(Object.assign(newLife(i + 1, career), { cls, network, edu, age: 22 })), `การ์ดหางาน ${cls} คอนเน็คชั่น ${network} วุฒิ ${edu}`);
}
for (const [t, track] of Object.entries(TRACKS)) {
  if (track.gate) checkCareer(schoolGate(Object.assign(newLife(1, career), { school: t, age: track.until })), `ด่านเรียนต่อ ${t}`);
}
for (const s of careerTexts) for (const b of ctx.banned) if (b.re.test(s)) fails.push(`การ์ดเรียน/งาน: โดนคำต้องห้าม ${b.id} "${s}"`);
rows.push(['การ์ดเรียน/งานจากแกน', `${careerCards} ใบ · ${careerTexts.size} ข้อความ`]);

// ทะเบียนธงต้องไม่มีชื่อค้างที่ไม่มีเนื้อหาไหนใช้ — ตรวจกับ content/ จริง (ด่านรายไฟล์มองไม่เห็นทั้งชุด)
const realDocs = dir('content/').map((f) => load('content/', f));
const used = new Set();
for (const { doc } of realDocs) for (const { s: f } of flagNames(doc)) used.add(f.split(':')[0]);
// ธงที่แกนตั้งเอง (ป้ายหมวด 9 · ศาลสั่งล้มละลาย) มีในทะเบียนเพื่อให้เนื้อหาอ่านได้ ไม่ต้องรอเนื้อหาใช้
const ENGINE_FLAGS = ['vow_broken', 'bankrupt'];
const stale = [...ctx.flags.flags, ...ctx.flags.prefixes].filter((f) => !used.has(f) && !ENGINE_FLAGS.includes(f));
rows.push(['ทะเบียนธง', `${ctx.flags.flags.size} ธง · ${ctx.flags.prefixes.size} ชื่อหน้า · ค้าง ${stale.length}`]);
// ธงมีพารามิเตอร์ยังไม่มีเนื้อหาจริงใช้ (มีแค่ใน fixture สายมู) จึงไม่นับว่าค้าง
for (const f of stale) if (!ctx.flags.prefixes.has(f)) fails.push(`ทะเบียนธง: "${f}" ไม่มีเนื้อหาใน content/ ใช้`);

try {
  const real = loadEvents();
  rows.push(['content/', `ผ่าน ${real.length} เหตุการณ์`]);
  // ด่าน afterlife-coverage ตรวจได้แค่ scene ที่มีเนื้อหา — ชุดจริงต้องมีครบทุก scene ไม่งั้นแกนเดินช่วงที่ 7 แล้วหาการ์ดไม่เจอ
  const open = SCENES.map((sc) => real.filter((e) => e.scene === sc && !e.when).length);
  rows.push(['ฉากระหว่างชาติ (ใบไม่มี when)', SCENES.map((sc, i) => `${sc} ${open[i]}`).join(' · ')]);
  SCENES.forEach((sc, i) => !open[i] && fails.push(`content/: ไม่มีฉาก ${sc} ที่ออกได้ทุกคน`));
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
