// ตรวจว่าทุกค่าใน data/*.json บอกที่มาได้: ตัวเลขทุกตัว (รวมสตริงที่เป็นตัวเลข) ต้องอยู่ใน object ที่มี
// source เป็น URL https หรือ assumption: true พร้อม note — ตัวมันเองหรือ object ที่ครอบมันชั้นใดก็ได้
// ยกเว้นคีย์ที่เป็นแค่ป้ายตำแหน่ง (ปี y · อายุเริ่มกลุ่ม age) · กติกาใต้ rules ต้องเป็น object ที่บอกที่มาเสมอ
import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../data/', import.meta.url);
const INDEX_KEYS = new Set(['y', 'age']);
const NUMERIC_STRING = /^-?\d+(\.\d+)?$/;
const problems = [];
let checked = 0;

const traced = (o) =>
  (typeof o.source === 'string' && /^https:\/\/\S+$/.test(o.source)) ||
  (o.assumption === true && typeof o.note === 'string' && o.note.trim() !== '');

function walk(node, path, covered, key) {
  if (typeof node === 'number' || (typeof node === 'string' && NUMERIC_STRING.test(node))) {
    if (INDEX_KEYS.has(key)) return;
    checked++;
    if (typeof node === 'string') problems.push(`${path}: ตัวเลขเก็บเป็นสตริง`);
    else if (!Number.isFinite(node)) problems.push(`${path}: ไม่ใช่ตัวเลขจำกัด`);
    if (!covered) problems.push(`${path}: ไม่มี source (https) หรือ assumption+note ครอบอยู่`);
    return;
  }
  if (Array.isArray(node)) return node.forEach((x, i) => walk(x, `${path}[${i}]`, covered, key));
  if (!node || typeof node !== 'object') return;
  const here = covered || traced(node);
  if ('v' in node && typeof node.v !== 'number') problems.push(`${path}: v ไม่ใช่ตัวเลข`);
  for (const [k, child] of Object.entries(node)) {
    if (k === 'rules') {
      if (!child || typeof child !== 'object' || Array.isArray(child)) {
        problems.push(`${path}.rules: ต้องเป็น object`);
        continue;
      }
      for (const [rk, rule] of Object.entries(child)) {
        if (!rule || typeof rule !== 'object' || Array.isArray(rule) || !traced(rule)) {
          problems.push(`${path}.rules.${rk}: กติกาต้องมี source (https) หรือ assumption+note`);
          continue;
        }
        walk(rule, `${path}.rules.${rk}`, true, rk);
      }
    } else if (k === 'events' && Array.isArray(child)) {
      // เหตุการณ์ต้องบอกที่มาของช่วงปีเองด้วย ไม่ใช่อาศัยที่มาของตัวเลขผลกระทบ
      child.forEach((e, i) => {
        const p = `${path}.events[${i}]`;
        if (!e || typeof e !== 'object' || !traced(e)) problems.push(`${p}: เหตุการณ์ต้องมี source หรือ assumption+note ของช่วงปี`);
        if (!Number.isInteger(e?.from) || !Number.isInteger(e?.to) || e.from > e.to) problems.push(`${p}: from/to ต้องเป็นปีจำนวนเต็มและ from ≤ to`);
        if (!Array.isArray(e?.facts) || !e.facts.length) problems.push(`${p}: ไม่มี facts`);
        walk(e, p, here, 'events');
      });
    } else walk(child, `${path}.${k}`, here, k);
  }
}

const files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
for (const f of files) walk(JSON.parse(readFileSync(new URL(f, dir), 'utf8')), f, false, '');

// จังหวัดซ้อนใต้ภาค (B34): เกมสุ่มภาคก่อนแล้วสุ่มจังหวัดในภาค — ยอดสองชั้นมาจากตารางเดียวกัน ผลรวมจึงต้องเท่ากันพอดี
const pop = JSON.parse(readFileSync(new URL('birthplace.json', dir), 'utf8')).population;
const provNames = new Set();
for (const r of pop.regions) {
  const sum = (r.provinces ?? []).reduce((s, p) => s + p.v, 0);
  checked++;
  if (!r.provinces?.length) problems.push(`birthplace.json ภาค${r.name}: ไม่มีรายจังหวัด`);
  else if (sum !== r.v) problems.push(`birthplace.json ภาค${r.name}: ผลรวมจังหวัด ${sum} ≠ ยอดภาค ${r.v}`);
  for (const p of r.provinces ?? []) {
    if (provNames.has(p.name)) problems.push(`birthplace.json: จังหวัด${p.name} ซ้ำ`);
    provNames.add(p.name);
  }
}
if (provNames.size !== 77) problems.push(`birthplace.json: จังหวัด ${provNames.size} ≠ 77`);

console.log(`ตรวจ ${checked.toLocaleString('en-US')} ตัวเลขใน ${files.length} ไฟล์`);
if (problems.length) {
  for (const p of problems.slice(0, 50)) console.log(`  ✗ ${p}`);
  if (problems.length > 50) console.log(`  … อีก ${problems.length - 50} จุด`);
  console.log(`ไม่ผ่าน ${problems.length} จุด`);
  process.exitCode = 1;
} else console.log('ผ่าน: ทุกตัวเลขมี source หรือ assumption ครอบ');
