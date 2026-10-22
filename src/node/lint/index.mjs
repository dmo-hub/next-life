// ด่าน build ของเนื้อหา: รันทุกกติกาครบรอบเดียวแล้วรายงานทุกข้อ (ไม่หยุดที่ข้อแรก)
// รูปข้อความ "<ไฟล์> · <id>[path] · <กติกา>: <อธิบาย>" เป็นสัญญากับหน้าตรวจของเจ้าของ — อย่าเปลี่ยนรูปเงียบ ๆ
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { rules as shape } from './shape.mjs';
import { rules as merit } from './merit.mjs';
import { rules as flags } from './flags.mjs';
import { rules as systems } from './systems.mjs';
import { rules as banned, compileBanned } from './banned.mjs';
import { rules as lore, loreHeadings } from './lore.mjs';
import { rules as belief } from './belief.mjs';
import { isObj } from './util.mjs';

export const RULES = [...shape, ...merit, ...flags, ...systems, ...banned, ...lore, ...belief];
const root = new URL('../../../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

// ข้อมูลที่กติกาต้องรู้จากนอกไฟล์เนื้อหา — โหลดครั้งเดียว
export function lintContext() {
  const regions = JSON.parse(read('data/birthplace.json')).population.regions.map((x) => x.name);
  const systems = new Map(JSON.parse(read('data/system-starts.json')).systems.map((s) => [s.id, s]));
  const lore = new Map();
  for (const f of readdirSync(new URL('docs/spec/', root)).filter((n) => /^lore-.*\.(md|html)$/.test(n))) {
    lore.set(f, loreHeadings(f, read(`docs/spec/${f}`)));
  }
  return { regions, systems, lore, banned: compileBanned(parse(read('content/rules/banned.yaml')), 'content/rules/banned.yaml') };
}

// docs = [{file, doc}] จาก YAML ที่ parse แล้ว · คืน [{file, id, path, rule, msg}]
export function lintDocs(docs, ctx = lintContext(), rules = RULES) {
  const problems = [];
  const events = [];
  for (const { file, doc } of docs) {
    const bad = !isObj(doc) || !Array.isArray(doc.events) || Object.keys(doc).some((k) => k !== 'events');
    if (bad) problems.push({ file, id: '-', path: '', rule: 'doc-shape', msg: 'ไฟล์ต้องมี key เดียวคือ events: [...]' });
    if (!isObj(doc) || !Array.isArray(doc.events)) continue;
    doc.events.forEach((e, i) => events.push({ file, e: isObj(e) ? e : {}, at: `events[${i}]` }));
  }
  const add = (x, rule) => (path, msg) => problems.push({ file: x.file, id: typeof x.e.id === 'string' ? x.e.id : x.at, path, rule: rule.id, msg });
  for (const rule of rules) {
    if (rule.event) for (const x of events) rule.event(x.e, ctx, add(x, rule));
    if (rule.all) rule.all(events, ctx, (x, path, msg) => add(x, rule)(path, msg));
  }
  return problems;
}

export const DOC_SHAPE = { id: 'doc-shape', desc: 'ไฟล์เนื้อหาต้องเป็น {events: [...]} ไม่มี key อื่น' };
export const formatProblem = (p) => `${p.file} · ${p.id}${p.path} · ${p.rule}: ${p.msg}`;
