// ทดสอบด่านเนื้อหา: content-fixtures/bad/<กติกา>.yaml ต้องตกด้วยกติกาตามชื่อไฟล์เท่านั้น (ตกด้วยกติกาอื่นด้วย = ทดสอบไม่ได้แยกกติกา)
// · good/*.yaml ต้องผ่าน · ทุกกติกาต้องมีไฟล์ bad ≥1 · คำต้องห้ามทุกข้อต้องจับ bad และปล่อย ok ของตัวเอง · content/ จริงต้องผ่าน
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { RULES, DOC_SHAPE, lintContext, lintDocs, formatProblem } from '../src/node/lint/index.mjs';
import { OK_DIRECTION_SKIP } from '../src/node/lint/shape.mjs';
import { strings, isObj } from '../src/node/lint/util.mjs';
import { parentRefs } from '../src/node/lint/flags.mjs';
import { loadEvents, loadEra, loadContent, checkNames } from '../src/node/load.mjs';
import { allocOptions, DISCLAIMER } from '../src/engine/finance.mjs';
import { schoolGate, jobCard, TRACKS, EDU, BOND_EVENT, CHILD_UNTIL, SCHOOL_FROM } from '../src/engine/career.mjs';
import { newLife, CLASSES, SEXES, fill } from '../src/engine/life.mjs';
import { CATEGORIES, MERIT_CATS, MAX_LEN, MIN_CHOICES, SCHOOL_VALUES, PLACEHOLDERS } from '../src/node/lint/vocab.mjs';
import { SCENES } from '../src/engine/afterlife.mjs';
import { checkMeritTable, MERIT_WEIGHTS, OMEN_TEXT, MERIT_LEVELS, KARMA, omenText, SIN_CATS, ISEKAI_CATS, GAME_CATS, meritName, meritId } from '../src/engine/merit.mjs';
import { ISEKAI_EVENTS, ISEKAI_MERIT, ISEKAI_SKILLS, checkSkillThai } from '../src/engine/isekai.mjs';
import { lintIsekai, formatIsekaiProblem, ISEKAI_RULES } from '../src/node/lint/isekai.mjs';

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
  'หมวดกลไกเกมหนักเท่าหมวดตามคติ': [MERIT_CATS, { ...MERIT_WEIGHTS, cheat_exploit: 1 }],
  'ขาดหมวด dana': [MERIT_CATS, Object.fromEntries(Object.entries(MERIT_WEIGHTS).filter(([k]) => k !== 'dana'))],
  'หมวดเกินจากด่าน': [MERIT_CATS.filter((c) => c.id !== 'sila'), MERIT_WEIGHTS],
  'ด่านว่าเป็นธงแต่แกนไม่รู้': [MERIT_CATS.map((c) => (c.id === 'adultery' ? { ...c, flag: true } : c)), MERIT_WEIGHTS],
  'ระดับไม่เรียง': [MERIT_CATS, MERIT_WEIGHTS, { ...MERIT_LEVELS, 2: 5 }],
  'บุญเพิ่มความเสี่ยง': [MERIT_CATS, MERIT_WEIGHTS, MERIT_LEVELS, { ...KARMA, meritMin: 1.2 }],
};
for (const [name, args] of Object.entries(controls)) if (!checkMeritTable(...args).length) fails.push(`merit-table ตัวควบคุม "${name}" ไม่ตก`);
rows.push(['merit-table ตัวควบคุม', `${Object.keys(controls).length} แบบ`]);
// หมวดบาปไตรภูมิ (ใบ 202): บาปตามคติชาติไทย หนักเท่าหมวดเดิม · ไม่ใช่หมวดต่างโลก/กลไกเกม · ชื่อบนการ์ดคิดบัญชีเป็นไทย
for (const [id, th] of [['kill_animal', 'ฆ่าสัตว์'], ['wrong_view', 'มิจฉาทิฏฐิ']]) {
  if (!SIN_CATS.includes(id)) fails.push(`ใบ 202: ${id} ไม่อยู่ใน SIN_CATS`);
  if (ISEKAI_CATS.includes(id) || GAME_CATS.includes(id)) fails.push(`ใบ 202: ${id} ต้องไม่อยู่ใน ISEKAI_CATS/GAME_CATS`);
  if (MERIT_WEIGHTS[id] !== 1) fails.push(`ใบ 202: ${id} น้ำหนัก ${MERIT_WEIGHTS[id]} ไม่ใช่ 1`);
  if (meritName(id) !== th || meritId(th) !== id) fails.push(`ใบ 202: ${id} ชื่อแสดง ${meritName(id)} ไม่ใช่ ${th}`);
}
rows.push(['ใบ 202 หมวดไตรภูมิ', 'kill_animal · wrong_view']);
// ผลเบาชาติไทยของสกิล (06s): ของจริงผ่าน · ตัวควบคุมผิดทีละอย่างต้องตก
const skThai = checkSkillThai(CATEGORIES);
rows.push(['skill-thai', skThai.length ? `ตก ${skThai.length} ข้อ` : `ผ่าน (${Object.values(ISEKAI_SKILLS).filter((s) => s.thai).length} สกิล)`]);
for (const t of skThai) fails.push(`skill-thai: ${t}`);
const skControls = {
  'หมวดสะกดผิด': [CATEGORIES, { ...ISEKAI_SKILLS, sword: { ...ISEKAI_SKILLS.sword, thai: { cats: ['healt'] } } }],
  'cats ว่าง': [CATEGORIES, { ...ISEKAI_SKILLS, sword: { ...ISEKAI_SKILLS.sword, thai: { cats: [] } } }],
  'k ติดลบ': [CATEGORIES, ISEKAI_SKILLS, -0.1],
};
for (const [name, args] of Object.entries(skControls)) if (!checkSkillThai(...args).length) fails.push(`skill-thai ตัวควบคุม "${name}" ไม่ตก`);
// ขั้นค่าซ้อนทับ (โลกซ้อนทับ ใบ 09): ทุกเคสเป็นการ์ดเดียวกัน ต่างแค่ช่องนี้ — ตกต้องตกที่ช่อง overlap_stage เท่านั้น ผ่านต้องไม่มีปัญหาเลย
const overlapCard = (extra) => ({ id: 'overlap_case_01', type: 'A', stage: 'ทำงาน', years: [2500, 2650], weight: 1, text: 'ข้อความการ์ด', ...extra, choices: [1, 2, 3, 4].map((n) => ({ text: `ทางเลือก ${n}`, merit: [{ cat: 'neutral' }] })) });
const overlapCases = [
  ['when [1, 2]', { when: { overlap_stage: [1, 2] } }, true],
  ['when [0, 4]', { when: { overlap_stage: [0, 4] } }, true],
  ['ตัวคูณ 2', { multipliers: { overlap_stage: 2 } }, true],
  ['ตัวคูณ 0', { multipliers: { overlap_stage: 0 } }, true],
  ['when ขั้น 5', { when: { overlap_stage: [1, 5] } }, false],
  ['when ติดลบ', { when: { overlap_stage: [-1, 2] } }, false],
  ['when ไม่ใช่จำนวนเต็ม', { when: { overlap_stage: [1.5, 2] } }, false],
  ['when ข้อความ', { when: { overlap_stage: ['1', 2] } }, false],
  ['when ตัวเลขเดียว', { when: { overlap_stage: 1 } }, false],
  ['when min > max', { when: { overlap_stage: [3, 1] } }, false],
  ['ตัวคูณติดลบ', { multipliers: { overlap_stage: -1 } }, false],
  ['ตัวคูณข้อความ', { multipliers: { overlap_stage: '2' } }, false],
];
for (const [name, extra, pass] of overlapCases) {
  const ps = lintDocs([{ file: `overlap-case:${name}`, doc: { events: [overlapCard(extra)] } }], ctx);
  const ok = pass ? !ps.length : ps.length > 0 && ps.every((p) => p.path.endsWith('.overlap_stage'));
  if (!ok) fails.push(`overlap_stage "${name}": ต้อง${pass ? 'ผ่าน' : 'ตกที่ช่อง overlap_stage'} ได้ [${ps.map(formatProblem).join(' | ') || 'ผ่าน'}]`);
}
rows.push(['overlap_stage ตก/ผ่าน', `${overlapCases.length} เคส`]);
// ความจำชาติก่อน (ใบ 159): การ์ดเดียวกัน ต่างแค่ช่อง when.past_life — ตกต้องตกที่ past_life เท่านั้น · ช่องที่ไม่มีแล้ว (ตัวควบคุม) ต้องตกด้วย
const pastCases = [
  ['มีชาติก่อน', { any: true }, true],
  ['จังหวัดเดิม + ช่าง', { province: 'same', job: ['craft'] }, true],
  ['พรสวรรค์', { talent: true }, true],
  ['ช่องที่ไม่มี', { lover: ['x'] }, false],
  ['อาชีพไม่รู้จัก', { job: ['wizard'] }, false],
  ['ภูมิเป็นชื่อไทย', { realm: ['นรก'] }, false],
  ['ว่าง', {}, false],
];
for (const [name, past, pass] of pastCases) {
  const ps = lintDocs([{ file: `past-case:${name}`, doc: { events: [overlapCard({ when: { past_life: past } })] } }], ctx);
  const ok = pass ? !ps.length : ps.length > 0 && ps.every((p) => p.path.includes('.past_life'));
  if (!ok) fails.push(`past_life "${name}": ต้อง${pass ? 'ผ่าน' : 'ตกที่ช่อง past_life'} ได้ [${ps.map(formatProblem).join(' | ') || 'ผ่าน'}]`);
}
rows.push(['past_life ตก/ผ่าน', `${pastCases.length} เคส`]);
// ป้ายบุญบาปต่างโลก (B68c) อยู่นอก yaml ไม่ผ่านด่านเนื้อหา — ตรวจ id/ลำดับตัวเลือก/หมวด/ระดับ ที่นี่แทน
const iskById = Object.fromEntries(ISEKAI_EVENTS.map((e) => [e.id, e]));
let iskTags = 0;
for (const [id, byIdx] of Object.entries(ISEKAI_MERIT)) for (const [i, tags] of Object.entries(byIdx)) {
  if (!iskById[id]?.choices?.[i]) { fails.push(`isekai-merit: ไม่มีตัวเลือก ${id} #${i}`); continue; }
  for (const t of tags) {
    iskTags++;
    const cat = MERIT_CATS.find((c) => c.id === t.cat);
    if (!cat) fails.push(`isekai-merit: ${id} #${i} หมวดไม่รู้จัก ${t.cat}`);
    else if (cat.kind === 'neutral' || cat.flag ? t.level !== undefined : !MERIT_LEVELS[t.level]) fails.push(`isekai-merit: ${id} #${i} ระดับ ${t.level} ไม่เข้ากับหมวด ${t.cat}`);
  }
}
rows.push(['isekai-merit', `${iskTags} ป้าย`]);
// ข้อความลางอยู่ในแกน ไม่ผ่านด่านเนื้อหา — ตรวจคำต้องห้าม · ความยาว · ไม่มีตัวเลข ที่นี่แทน
for (const [tone, xs] of Object.entries(OMEN_TEXT)) for (const s of xs) {
  for (const b of ctx.banned) if (b.re.test(s)) fails.push(`ลาง ${tone}: โดนคำต้องห้าม ${b.id} "${s}"`);
  if (s.length > MAX_LEN.text) fails.push(`ลาง ${tone}: ยาวเกิน ${MAX_LEN.text} "${s}"`);
  if (/[0-9๐-๙]/.test(s)) fails.push(`ลาง ${tone}: มีตัวเลข "${s}"`);
}
// ตัวเลือกข้อความลางมาจาก hash ของ seed+อายุ — ไล่ช่วงกว้างให้เจอ index ติดลบ (ข้อความ undefined บนการ์ด)
let omenMiss = 0;
for (const tone of Object.keys(OMEN_TEXT)) for (let s = 0; s < 500; s++) for (let a = 0; a < 120; a++) if (typeof omenText(tone, Math.imul(s, 2654435761) >>> 0, a) !== 'string') omenMiss++;
rows.push(['ข้อความลางเลือกได้ทุก seed', omenMiss ? `ไม่ได้ข้อความ ${omenMiss} ครั้ง` : 'ผ่าน']);
if (omenMiss) fails.push(`omenText คืนค่าที่ไม่ใช่ข้อความ ${omenMiss} ครั้ง`);
// ทุกช่องในรายการปิดของด่าน build ต้องมีตัวเติมในแกน ไม่งั้นผ่านด่านแต่โผล่ดิบบนการ์ด · ทั้งสองเพศ
for (const sex of SEXES) {
  const st = { ...newLife(1, loadContent()), sex };
  for (const k of Object.keys(PLACEHOLDERS)) {
    const out = fill(`{${k}}`, st);
    if (/[{}]/.test(out) || !out.trim()) fails.push(`ช่อง {${k}} แกนไม่เติม (${sex}): "${out}"`);
    else if (out.length > PLACEHOLDERS[k].length) fails.push(`ช่อง {${k}} เติมแล้วยาว ${out.length} เกินค่ายาวสุดที่ด่านความยาวใช้ (${PLACEHOLDERS[k].length}) — แก้ PLACEHOLDERS`);
  }
}
rows.push(['ช่องแทนค่าแกนเติมครบ', `${Object.keys(PLACEHOLDERS).length} ช่อง × ${SEXES.length} เพศ`]);

// ชื่อเล่น (B27): ผ่านด่านของ loader แล้ว ยังต้องไม่โดนคำต้องห้ามของเนื้อหา · ด่านต้องจับชื่อที่หลุดรายการ avoid/ยุคมีรู
// ชื่อจริงขึ้นจอได้เหมือนชื่อเล่น (pickRealName) และผู้เล่นพิมพ์ชื่อเองไม่ได้ — รายการนี้คือที่เดียวที่กันชื่อนักการเมือง/สถาบันได้
const namesRaw = JSON.parse(readFileSync(new URL('data/names.json', root), 'utf8'));
const nameFrom = namesRaw.eras[0].from, nameTo = namesRaw.eras.at(-1).to;
const bannedNames = (names) => names.eras.flatMap((e) => SEXES.flatMap((sex) => [[sex, e[sex]], [`จริง${sex}`, e.จริง[sex]]].flatMap(([kind, xs]) =>
  xs.flatMap((n) => ctx.banned.filter((b) => b.re.test(n)).map((b) => ({ id: b.id, msg: `ชื่อ ${e.from} ${kind}: โดนคำต้องห้าม ${b.id} "${n}"` }))))));
const nameCount = namesRaw.eras.reduce((t, e) => t + SEXES.reduce((u, sex) => u + e[sex].length + e.จริง[sex].length, 0), 0);
for (const { msg } of bannedNames(namesRaw)) fails.push(msg);
// ตัวควบคุมคำต้องห้าม: ชื่อเล่นและชื่อจริงต้องจับได้ทั้งการเมืองจริงและสถาบัน
const withReal = (sex, n) => ({ ...namesRaw, eras: [{ ...namesRaw.eras[0], จริง: { ...namesRaw.eras[0].จริง, [sex]: [...namesRaw.eras[0].จริง[sex], n] } }, ...namesRaw.eras.slice(1)] });
const bannedControls = [
  ['ชื่อเล่นชนนักการเมือง', 'real_politics', { ...namesRaw, eras: [{ ...namesRaw.eras[0], ชาย: [...namesRaw.eras[0].ชาย, 'ทักษิณ'] }, ...namesRaw.eras.slice(1)] }],
  ['ชื่อจริงชนนักการเมือง', 'real_politics', withReal('หญิง', 'ยิ่งลักษณ์')],
  ['ชื่อจริงชนสถาบัน', 'monarchy', withReal('ชาย', 'เจ้าฟ้าชาย')],
];
for (const [name, id, n] of bannedControls) if (!bannedNames(n).some((x) => x.id === id)) fails.push(`names ตัวควบคุม "${name}" ไม่ตก ${id}`);
for (const p of checkNames(namesRaw, nameFrom, nameTo)) fails.push(`names: ${p}`);
const withFirst = (k, xs) => ({ ...namesRaw, eras: [{ ...namesRaw.eras[0], [k]: xs }, ...namesRaw.eras.slice(1)] });
const nameControls = {
  'ชื่อในรายการ avoid': withFirst('ชาย', [...namesRaw.eras[0].ชาย, namesRaw.avoid[0].name]),
  'ยุคมีรู': { ...namesRaw, eras: namesRaw.eras.slice(1) },
  'ชื่อซ้ำในยุค': withFirst('หญิง', [...namesRaw.eras[0].หญิง, namesRaw.eras[0].หญิง[0]]),
  'ชื่อยาวเกินช่อง': withFirst('ชาย', ['ก'.repeat(PLACEHOLDERS.ชื่อ.length + 1)]),
};
for (const [name, n] of Object.entries(nameControls)) if (!checkNames(n, nameFrom, nameTo).length) fails.push(`names ตัวควบคุม "${name}" ไม่ตก`);
// {ชื่อ} บนการ์ดต้องเป็นชื่อของชีวิตนั้น · รุ่นถัดไปไม่ได้ชื่อซ้ำรุ่นก่อน (ไล่หลาย seed ให้เจอรอบที่สุ่มได้ชื่อชนกันจริง)
const nameContent = loadContent();
const nameLife = newLife(7, nameContent);
if (!nameLife.name || fill('{ชื่อ}', nameLife) !== nameLife.name) fails.push(`{ชื่อ} เติม "${fill('{ชื่อ}', nameLife)}" ไม่ใช่ชื่อของชีวิต "${nameLife.name}"`);
const nameHeir = { birthYear: nameLife.birthYear, sex: nameLife.sex, region: { name: nameLife.region, ses: nameLife.ses }, cls: nameLife.cls, bonus: {} };
let nameClash = 0;
for (let s = 1; s <= 200; s++) {
  const free = newLife(s, nameContent, nameHeir).name;
  if (newLife(s, nameContent, { ...nameHeir, lineage: [{ gen: 1, name: free }] }).name === free) nameClash++;
}
if (nameClash) fails.push(`รุ่นถัดไปได้ชื่อซ้ำรุ่นก่อน ${nameClash} ครั้งใน 200 seed`);
rows.push(['ชื่อเล่น+ชื่อจริง', `${nameCount} ชื่อ · ${namesRaw.eras.length} ยุค ${nameFrom}–${nameTo} · ตัวควบคุม ${Object.keys(nameControls).length + bannedControls.length} แบบ`]);

// การ์ดจัดสรรเงินสร้างในแกน ไม่ผ่านด่านเนื้อหา — ตรวจทุกปีของเกม: ≥4 ตัวเลือก · ยาว · คำต้องห้าม · หุ้นไม่โผล่ก่อน 2518
const era = loadEra();
// ปีเกมทุกปีแม็ปเข้าช่วงปีต้นแบบ era.future — การ์ดที่ผูกเหตุการณ์บ้านเมืองซึ่งเริ่มนอกช่วงนี้ไม่มีวันออก
const eraFrom = new Map(era.events.map((e) => [e.id, e.from]));
const deadEra = loadEvents().filter((e) => e.era && !(eraFrom.get(e.era) >= era.future.from && eraFrom.get(e.era) <= era.future.to));
rows.push(['การ์ดบ้านเมืองอยู่ในช่วงปีต้นแบบ', deadEra.length ? `ไม่มีวันออก ${deadEra.length} ใบ` : `ผ่าน (${era.future.from}–${era.future.to})`]);
for (const e of deadEra) fails.push(`${e.id}: เหตุการณ์ ${e.era} เริ่มปี ${eraFrom.get(e.era)} นอกช่วงปีต้นแบบ ${era.future.from}–${era.future.to} — การ์ดไม่มีวันออก`);
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
// อาชีพตามขั้นยศได้จากการเข้าสายเท่านั้น — การ์ดหางานเสนอเป็นงานตรง ๆ = คนนอกสายได้ยศโดยไม่มีสาย
const rankOccs = career.era.finance.occupations.filter((o) => !o.birth).map((o) => o.id);
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
      if (rankOccs.includes(fx.job)) fails.push(`${where}: เสนออาชีพตามขั้นยศ ${fx.job} เป็นงาน`);
      if (fx.school !== undefined && !SCHOOL_VALUES.includes(fx.school)) fails.push(`${where}: ช่วงเรียน ${fx.school} ไม่มีจริง`);
    }
  }
}
for (const cls of CLASSES) for (const network of [0, 50, 100]) for (const [i, edu] of [null, ...EDU].entries()) {
  checkCareer(jobCard(Object.assign(newLife(i + 1, career), { cls, network, edu, age: 22 })), `การ์ดหางาน ${cls} คอนเน็คชั่น ${network} วุฒิ ${edu}`);
}
// บ้านสายยศ (ทายาทของคนที่ตายในขั้นยศ): สืบต่องานบ้าน = เข้าสายของพ่อแม่ ไม่ใช่รับอาชีพยศไปตรง ๆ
for (const occ of rankOccs) for (const lad of Object.keys(career.era.careers.ladders).filter((id) => career.era.careers.ladders[id].steps.some((s) => s.occ === occ))) {
  const where = `การ์ดหางาน บ้าน ${occ} สาย ${lad}`;
  const ev = jobCard(Object.assign(newLife(1, career), { cls: CLASSES[3], network: 50, edu: 'อุดมศึกษา', age: 22, familyOcc: occ, familyLadder: lad }));
  checkCareer(ev, where);
  if (!ev.choices.some((c) => c.effects?.ladder === lad)) fails.push(`${where}: ไม่มีทางสืบต่อเข้าสาย ${lad}`);
}
for (const [t, track] of Object.entries(TRACKS)) {
  if (track.gate) checkCareer(schoolGate(Object.assign(newLife(1, career), { school: t, age: track.until })), `ด่านเรียนต่อ ${t}`);
}
for (const s of careerTexts) for (const b of ctx.banned) if (b.re.test(s)) fails.push(`การ์ดเรียน/งาน: โดนคำต้องห้าม ${b.id} "${s}"`);
rows.push(['การ์ดเรียน/งานจากแกน', `${careerCards} ใบ · ${careerTexts.size} ข้อความ`]);

// เสียงเด็ก (B61): การ์ดเรียน/งานที่แกนสร้างก่อน CHILD_UNTIL ต้องไม่มีตัวเลือกเสียงผู้ใหญ่ — ไล่ทุกอายุที่ออกได้ × ฐานะ × คอนเน็คชั่น
// ตัวควบคุม: การ์ดหางานวัยผู้ใหญ่ต้องโดนกติกาเดียวกัน ไม่งั้นคำที่จับไม่ตรงกับข้อความจริงในแกน
const ADULT_VOICE = /^(จ่าย|ทุ่มเงิน|ฝากเส้น)/;
const adultVoice = (ev) => ev.choices.map((c) => c.text).filter((t) => ADULT_VOICE.test(t));
let childCards = 0;
const childVoice = (ev, where) => {
  childCards++;
  checkCareer(ev, where);
  for (const t of adultVoice(ev)) fails.push(`${where}: ตัวเลือกเสียงผู้ใหญ่ก่อนอายุ ${CHILD_UNTIL} "${t}"`);
};
childVoice(schoolGate(Object.assign(newLife(1, career), { school: 'primary', age: TRACKS.primary.until })), 'ด่านจบประถม');
for (let age = SCHOOL_FROM; age < CHILD_UNTIL; age++) for (const cls of CLASSES) for (const network of [0, 50, 100]) for (const edu of [null, 'ประถม']) {
  childVoice(jobCard(Object.assign(newLife(age, career), { cls, network, edu, age })), `การ์ดหางานอายุ ${age} ${cls} คอนเน็คชั่น ${network}`);
}
const adultCtl = CLASSES.flatMap((cls) => adultVoice(jobCard(Object.assign(newLife(1, career), { cls, network: 100, edu: 'มัธยม', age: 22 }))));
if (!adultCtl.length) fails.push('เสียงเด็ก: ตัวควบคุมการ์ดหางานอายุ 22 ไม่โดนกติกา — ADULT_VOICE ไม่ตรงข้อความในแกนแล้ว');
rows.push(['เสียงเด็กการ์ดเรียน/งาน', `${childCards} ใบ · ตัวควบคุมผู้ใหญ่ ${adultCtl.length} ตัวเลือก`]);

// ทะเบียนธงต้องไม่มีชื่อค้างที่ไม่มีเนื้อหาไหนใช้ — ตรวจกับ content/ จริง (ด่านรายไฟล์มองไม่เห็นทั้งชุด)
const realDocs = dir('content/').map((f) => load('content/', f));
const used = new Set();
for (const { doc } of realDocs) for (const { s: f } of flagNames(doc)) used.add(f.split(':')[0]);
// ธงที่แกนตั้งเอง (ป้ายหมวด 9 · ศาลสั่งล้มละลาย) มีในทะเบียนเพื่อให้เนื้อหาอ่านได้ ไม่ต้องรอเนื้อหาใช้
// cheat_death: แกนอ่านตอนผลสุ่มตาย (ถูกเรียกตัว B153) — มีผู้อ่านแล้วแม้ยังไม่มีการ์ดตั้ง
const ENGINE_FLAGS = ['vow_broken', 'bankrupt', 'isekai_call', 'cheat_death'];
const stale = [...ctx.flags.flags, ...ctx.flags.prefixes].filter((f) => !used.has(f) && !ENGINE_FLAGS.includes(f));
rows.push(['ทะเบียนธง', `${ctx.flags.flags.size} ธง · ${ctx.flags.prefixes.size} ชื่อหน้า · ค้าง ${stale.length}`]);
// ธงมีพารามิเตอร์ยังไม่มีเนื้อหาจริงใช้ (มีแค่ใน fixture สายมู) จึงไม่นับว่าค้าง
for (const f of stale) if (!ctx.flags.prefixes.has(f)) fails.push(`ทะเบียนธง: "${f}" ไม่มีเนื้อหาใน content/ ใช้`);
// แกนนัดการ์ดชดใช้ทุนด้วย id — ไม่มีใน content = dueAt ข้ามเงียบ ทุนกลับเป็นของฟรี
if (!realDocs.some(({ doc }) => (doc.events ?? []).some((e) => e.id === BOND_EVENT))) fails.push(`การ์ดชดใช้ทุน "${BOND_EVENT}" ไม่มีใน content/`);

// ทะเบียน heir: (ธงที่แกนส่งถึงทายาท) — ตรวจทั้งชุด ไม่ใส่ใน RULES เพราะ fixture รันทีละไฟล์ จะตกด้วยกติกานี้ทุกไฟล์
// tier เพดาน 2 (หลาน) — เหลนไม่ได้รับธง
function heirCheck(reg, docs) {
  const problems = [];
  const flagSet = new Set(Object.keys(reg.flags ?? {}));
  for (const [f, h] of Object.entries(reg.heir ?? {})) {
    if (!flagSet.has(f)) problems.push(`ทะเบียน heir: "${f}" ไม่อยู่ใน flags: — ชีวิตก่อนไม่มีทางติดธงนี้`);
    if (!isObj(h) || ![1, 2].includes(h.tier)) problems.push(`ทะเบียน heir: "${f}" tier ต้องเป็น 1 (ลูก) หรือ 2 (หลาน)`);
    if (!isObj(h) || typeof h.tell !== 'string' || !h.tell.trim() || h.tell.length > MAX_LEN.hint) problems.push(`ทะเบียน heir: "${f}" tell ต้องเป็นข้อความไม่ว่าง ≤ ${MAX_LEN.hint} ตัวอักษร (หน้าจอใช้คำนี้)`);
    if (isObj(h) && h.from_age !== undefined && !(Number.isInteger(h.from_age) && h.from_age >= 0 && h.from_age <= 60)) problems.push(`ทะเบียน heir: "${f}" from_age ต้องเป็นจำนวนเต็ม 0–60`);
  }
  const read = new Set();
  for (const { doc } of docs) for (const e of doc.events ?? []) for (const { f } of parentRefs(isObj(e) ? e : {})) read.add(f);
  return { problems, unread: Object.keys(reg.heir ?? {}).filter((f) => !read.has(f)) };
}
const flagReg = parse(readFileSync(new URL('content/rules/flags.yaml', root), 'utf8'));
const heir = heirCheck(flagReg, realDocs);
for (const p of heir.problems) fails.push(p);
const heirControls = {
  'ธงนอก flags:': { ...flagReg, heir: { ...flagReg.heir, no_such: { tier: 1, tell: 'x' } } },
  'tier 3': { ...flagReg, heir: { ...flagReg.heir, smoker: { tier: 3, tell: 'x' } } },
  'tell ว่าง': { ...flagReg, heir: { ...flagReg.heir, smoker: { tier: 1, tell: ' ' } } },
  'from_age ติดลบ': { ...flagReg, heir: { ...flagReg.heir, smoker: { tier: 1, tell: 'x', from_age: -1 } } },
};
for (const [name, r] of Object.entries(heirControls)) if (!heirCheck(r, realDocs).problems.length) fails.push(`ทะเบียน heir: ตัวควบคุม "${name}" ไม่ตก`);
// ธงในทะเบียนที่ไม่มีการ์ดอ่าน = แกนส่งไปเปล่า ๆ ผู้เล่นไม่เคยเห็นผล
for (const f of heir.unread) fails.push(`ทะเบียน heir: "${f}" ไม่มีการ์ดอ่าน (when.parent_flags / multipliers.parent_flags)`);
if (!heirCheck(flagReg, []).unread.length) fails.push('ทะเบียน heir: ตัวควบคุม "ไม่มีการ์ด" ไม่ตก');
rows.push(['ทะเบียน heir:', `${Object.keys(flagReg.heir ?? {}).length} ธง · ตัวควบคุม ${Object.keys(heirControls).length + 1} แบบ · ไม่มีการ์ดอ่าน ${heir.unread.length}`]);

// ป้ายนิสัย (B41): ไฟล์ bad จับได้แค่ทางเดียว — ไล่ทุกทางที่กติกาต้องตก จากการ์ดฐานที่ผ่าน แก้ทีละจุด
const natureProblems = (e, c = ctx) => lintDocs([{ file: 'nature-control', doc: { events: [e] } }], c).filter((p) => p.rule === 'nature-tag');
const natureBase = { id: 'nature_ctl_01', type: 'A', stage: 'เด็ก', years: [2500, 2650], when: { age: [6, 12] }, text: 'ข้อความการ์ด', choices: ['ตกลง', 'ทางเลือกอื่น 2', 'ทางเลือกอื่น 3', 'ทางเลือกอื่น 4'].map((text) => ({ text, merit: [{ cat: 'neutral' }] })) };
const natureCard = (patch, choice) => Object.fromEntries(Object.entries({ ...natureBase, ...patch, choices: [{ ...natureBase.choices[0], ...choice }, ...natureBase.choices.slice(1)] }).filter(([, v]) => v !== undefined));
const natureId = Object.keys(ctx.natures)[0];
const natureOk = natureProblems(natureCard({}, { nature: natureId }));
for (const p of natureOk) fails.push(`nature-tag: การ์ดฐานต้องผ่าน ${formatProblem(p)}`);
const natureControls = {
  'ป้ายนิสัยที่ไม่มี': [natureCard({}, { nature: 'no_such' })],
  'requires.nature ที่ไม่มี': [natureCard({ stage: 'ทำงาน', when: undefined }, { requires: { nature: 'no_such' } })],
  'ป้ายบนการ์ดอายุ 0–5': [natureCard({ when: { age: [0, 5] } }, { nature: natureId })],
  'ป้ายบนการ์ด at_age 3': [natureCard({ when: undefined, at_age: 3 }, { nature: natureId })],
  'ป้ายบนการ์ดวัยโต': [natureCard({ stage: 'ทำงาน', when: undefined }, { nature: natureId })],
  'ไม่มีทะเบียนนิสัย': [natureCard({}, { nature: natureId }), { ...ctx, natures: {} }],
};
for (const [name, args] of Object.entries(natureControls)) if (!natureProblems(...args).length) fails.push(`nature-tag: ตัวควบคุม "${name}" ไม่ตก`);
rows.push(['ป้ายนิสัย nature-tag', `การ์ดฐาน ${natureOk.length ? 'ตก' : 'ผ่าน'} · ตัวควบคุม ${Object.keys(natureControls).length} แบบ`]);

try {
  const real = loadEvents();
  rows.push(['content/', `ผ่าน ${real.length} เหตุการณ์`]);
  // ยกเว้นที่ไม่มีการ์ดแล้ว = ค้างในโค้ดโดยไม่มีใครเห็น
  const realIds = new Set(real.map((e) => e.id));
  for (const id of OK_DIRECTION_SKIP.keys()) if (!realIds.has(id)) fails.push(`ok-direction ยกเว้น "${id}" ไม่มีการ์ดนี้ใน content/ แล้ว`);
  rows.push(['ok-direction ยกเว้น', [...OK_DIRECTION_SKIP].map(([id, why]) => `${id} (${why})`).join(' · ') || '-']);
  // ด่าน afterlife-coverage ตรวจได้แค่ scene ที่มีเนื้อหา — ชุดจริงต้องมีครบทุก scene ไม่งั้นแกนเดินช่วงที่ 7 แล้วหาการ์ดไม่เจอ
  const open = SCENES.map((sc) => real.filter((e) => e.scene === sc && !e.when).length);
  rows.push(['ฉากระหว่างชาติ (ใบไม่มี when)', SCENES.map((sc, i) => `${sc} ${open[i]}`).join(' · ')]);
  SCENES.forEach((sc, i) => !open[i] && fails.push(`content/: ไม่มีฉาก ${sc} ที่ออกได้ทุกคน`));
} catch (err) {
  fails.push(err.message);
}

// การ์ดทวีป (06c-2) มีด่านแยก (รูปการ์ดต่างโลก) — กติกาเดียวกับข้างบน: isekai-bad/<กติกา>.yaml ตกด้วยกติกานั้นอย่างเดียว · ทุกกติกามีไฟล์ bad · ของจริงผ่าน
{
  const badDir = 'content-fixtures/isekai-bad/';
  const files = dir(badDir);
  for (const f of files) {
    const want = f.replace(/\.yaml$/, '');
    const got = [...new Set(lintIsekai([load(badDir, f)]).map((p) => p.rule))];
    if (got.length !== 1 || got[0] !== want) fails.push(`isekai-bad/${f}: ต้องตกด้วย ${want} อย่างเดียว ได้ [${got.join(', ')}]`);
  }
  for (const { id } of ISEKAI_RULES) if (!files.includes(`${id}.yaml`)) fails.push(`กติกา ${id} ไม่มีไฟล์ isekai-bad ทดสอบ`);
  const real = lintIsekai(dir('content/isekai/').map((f) => load('content/isekai/', f)));
  for (const p of real) fails.push(`content/isekai: ${formatIsekaiProblem(p)}`);
  rows.push(['content/isekai/', `${real.length ? `ตก ${real.length} ข้อ` : 'ผ่าน'} · กติกา ${ISEKAI_RULES.length} · ไฟล์ bad ${files.length}`]);
  // ขั้นค่าซ้อนทับฝั่งต่างโลก (ใบ 15): การ์ดเดียวกันต่างแค่ช่องนี้ — ตกต้องตกด้วย isekai-overlap อย่างเดียว ผ่านต้องไม่มีปัญหาเลย
  const iskOverlapCard = (stage) => ({ id: 'overlap_case_isk', power: 'major', ch: [2], ...(stage !== undefined && { overlap_stage: stage }), title: 'ชื่อ', text: 'ข้อความ', choices: [{ t: 'ก', text: 'ผลก' }, { t: 'ข', text: 'ผลข' }] });
  const iskOverlapCases = [
    ['ไม่มีช่อง', undefined, true],
    ['[1, 4]', [1, 4], true],
    ['[0, 0]', [0, 0], true],
    ['ขั้น 5', [1, 5], false],
    ['ติดลบ', [-1, 2], false],
    ['ไม่ใช่จำนวนเต็ม', [1.5, 2], false],
    ['ข้อความ', ['1', 2], false],
    ['ตัวเลขเดียว', 1, false],
    ['จาก > ถึง', [3, 1], false],
  ];
  for (const [name, stage, pass] of iskOverlapCases) {
    const ps = lintIsekai([{ file: `isekai-overlap-case:${name}`, doc: { cards: [iskOverlapCard(stage)] } }]);
    const ok = pass ? !ps.length : ps.length > 0 && ps.every((p) => p.rule === 'isekai-overlap');
    if (!ok) fails.push(`isekai overlap_stage "${name}": ต้อง${pass ? 'ผ่าน' : 'ตกด้วย isekai-overlap'} ได้ [${ps.map(formatIsekaiProblem).join(' | ') || 'ผ่าน'}]`);
  }
  rows.push(['isekai overlap_stage ตก/ผ่าน', `${iskOverlapCases.length} เคส`]);
}

// ชื่อที่ src/ui import ต้องมีจริงในไฟล์ปลายทาง — build ต่อไฟล์เป็นสคริปต์เดียวแล้วตัด import ทิ้ง ชื่อหายจึงไม่พังตอน build แต่พังทั้งเกมตอนกด (bookAdd v0.6.55)
{
  const uiDir = new URL('src/ui/', root);
  const IMPORT = /import\s*\{([^}]*)\}\s*from\s*['"](\.[^'"]+)['"]/g;
  let n = 0;
  for (const f of readdirSync(uiDir).filter((x) => x.endsWith('.mjs')).sort()) {
    for (const [, names, spec] of readFileSync(new URL(f, uiDir), 'utf8').matchAll(IMPORT)) {
      const mod = await import(new URL(spec, new URL(f, uiDir)));
      for (const name of names.split(',').map((s) => s.trim().split(/\s+as\s+/)[0]).filter(Boolean)) {
        n++;
        if (!(name in mod)) fails.push(`ui-imports: src/ui/${f} import ${name} จาก ${spec} แต่ไฟล์นั้นไม่มี export ชื่อนี้ (MISSING ${name})`);
      }
    }
  }
  rows.push(['ui-imports (src/ui ← import)', `${n} ชื่อ`]);
}

const w = Math.max(...rows.map((r) => r[0].length));
for (const [a, b] of rows) console.log(`${a.padEnd(w)}  ${b}`);
console.log(`\nกติกา ${ruleIds.length} · ไฟล์ bad ${bad.length} · คำต้องห้าม ${ctx.banned.length} ข้อ`);
if (fails.length) {
  for (const f of fails) console.log(`  ✗ ${f}`);
  console.log(`ไม่ผ่าน ${fails.length} ข้อ`);
  process.exitCode = 1;
} else console.log('ผ่านทั้งหมด');
