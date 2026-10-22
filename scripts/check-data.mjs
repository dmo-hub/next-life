// ตรวจว่าทุกค่าใน data/*.json บอกที่มาได้: มี source เป็น URL https หรือ assumption: true พร้อม note
// ค่า = object ที่มีฟิลด์ตัวเลข v · กติกาใต้ rules · เหตุการณ์ใน events
import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../data/', import.meta.url);
const problems = [];
let checked = 0;

const traced = (o) =>
  (typeof o.source === 'string' && /^https:\/\/\S+$/.test(o.source)) ||
  (o.assumption === true && typeof o.note === 'string' && o.note.trim() !== '');

function walk(node, path, inRules) {
  if (Array.isArray(node)) return node.forEach((x, i) => walk(x, `${path}[${i}]`, false));
  if (!node || typeof node !== 'object') return;
  const isValue = typeof node.v === 'number';
  if (isValue || inRules) {
    checked++;
    if (!traced(node)) problems.push(`${path}: ไม่มี source (https) หรือ assumption+note`);
  }
  if (Array.isArray(node.facts)) {
    if (!node.facts.length) problems.push(`${path}: เหตุการณ์ไม่มี facts`);
  }
  if ('v' in node && !isValue) problems.push(`${path}: v ไม่ใช่ตัวเลข`);
  for (const [k, child] of Object.entries(node)) {
    if (k === 'rules' && child && typeof child === 'object') {
      for (const [rk, rule] of Object.entries(child)) walk(rule, `${path}.rules.${rk}`, true);
    } else walk(child, `${path}.${k}`, false);
  }
}

const files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
for (const f of files) walk(JSON.parse(readFileSync(new URL(f, dir), 'utf8')), f, false);

console.log(`ตรวจ ${checked} ค่าใน ${files.length} ไฟล์`);
if (problems.length) {
  for (const p of problems) console.log(`  ✗ ${p}`);
  console.log(`ไม่ผ่าน ${problems.length} จุด`);
  process.exitCode = 1;
} else console.log('ผ่าน: ทุกค่ามี source หรือ assumption');
