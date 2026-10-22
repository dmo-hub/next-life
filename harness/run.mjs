import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { playLife, mixSeed } from '../src/engine/index.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 1000);
const seed = opt('seed', 1);
const content = parse(readFileSync(new URL('../content/milestones.yaml', import.meta.url), 'utf8'));

// บอทสุ่มล้วน เลือกจากตัวเลือกที่ผู้เล่นเห็นเท่านั้น
const randomBot = (card, rng) => rng.int(0, card.choices.length - 1);

let sum = 0, min = Infinity, max = -Infinity, over60 = 0;
const bySex = { ชาย: [0, 0], หญิง: [0, 0] };
for (let i = 0; i < n; i++) {
  const { age, state } = playLife(mixSeed(seed, i), content, randomBot);
  sum += age;
  min = Math.min(min, age);
  max = Math.max(max, age);
  if (age > 60) over60++;
  bySex[state.sex][0] += age;
  bySex[state.sex][1]++;
}
const f = (v) => v.toFixed(2);
console.log(`ชีวิต ${n} · seed ${seed}`);
console.log(`อายุเฉลี่ย ${f(sum / n)} ปี · ต่ำสุด ${min} · สูงสุด ${max}`);
console.log(`ตายหลังอายุ 60: ${f((over60 / n) * 100)}%`);
for (const [s, [t, c]] of Object.entries(bySex)) console.log(`${s}: อายุเฉลี่ย ${f(t / c)} ปี (${c} ชีวิต)`);
