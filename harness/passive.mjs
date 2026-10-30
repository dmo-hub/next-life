// บอทเฉยต้องไม่ได้ชีวิตดีกว่าบอทสุ่ม (ไอเดีย 65-15) — เกมที่ไม่ทำอะไรเลยแล้วชีวิตออกมาดี = ตัวเลือกไม่มีน้ำหนัก
// เทียบ 3 ด้านตอนตาย: อายุเฉลี่ย · ผลรวม 5 ค่าสถานะเฉลี่ย · ทรัพย์มัธยฐาน · ตกเฉพาะเฉยดีกว่าที่พิสูจน์ได้แบบด่าน finance/lineage:
// bootstrap 95% ของ (สุ่ม − เฉย) ขอบบน < 0 = ตก · คร่อม 0 = เสมอ ผ่าน · RNG ของ bootstrap ผูกกับ --seed ไม่แตะ stream ของแกน
import { playLife, mixSeed, makeRng } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { random, passive } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 2000), seed = arg('--seed', 1);
const STATS = ['health', 'happiness', 'knowledge', 'relations', 'network'];
const content = loadContent();
const tested = passive;

const run = (bot) => {
  const r = { age: [], stats: [], worth: [] };
  for (let i = 0; i < n; i++) {
    const { state: st, age } = playLife(mixSeed(seed, i), content, bot);
    r.age.push(age);
    r.stats.push(STATS.reduce((s, k) => s + st[k], 0));
    r.worth.push(st.estate?.money ?? st.money);
  }
  return r;
};
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const median = (xs) => { const s = Float64Array.from(xs).sort(); return s[Math.floor(s.length / 2)]; };
const BOOT = 1000;
const bootRng = makeRng(mixSeed(seed, 0xb007));
const boot = (xs, stat) => {
  const out = new Float64Array(BOOT), s = new Array(xs.length);
  for (let b = 0; b < BOOT; b++) {
    for (let i = 0; i < xs.length; i++) s[i] = xs[Math.floor(bootRng.next() * xs.length)];
    out[b] = stat(s);
  }
  return out;
};

console.log(`บอทเฉย เทียบ บอทสุ่ม · ${n} ชีวิต/บอท · seed ${seed} · ค่าตอนตาย`);
const base = run(random), still = run(tested);
let fail = 0;
for (const [k, label, stat] of [['age', 'อายุตายเฉลี่ย', mean], ['stats', 'ผลรวม 5 ค่าเฉลี่ย', mean], ['worth', 'ทรัพย์มัธยฐาน', median]]) {
  const f = (v) => (k === 'worth' ? Math.round(v).toLocaleString('en-US') : v.toFixed(2));
  const a = boot(base[k], stat), b = boot(still[k], stat);
  const d = Float64Array.from(a, (v, i) => v - b[i]).sort();
  const [lo, hi] = [d[Math.floor(BOOT * 0.025)], d[Math.ceil(BOOT * 0.975) - 1]];
  const gap = stat(base[k]) - stat(still[k]);
  if (hi < 0) fail++;
  console.log(`  ${label.padEnd(18)} สุ่ม ${f(stat(base[k]))} · เฉย ${f(stat(still[k]))} · สุ่ม−เฉย ${f(gap)} ช่วง 95% [${f(lo)}, ${f(hi)}] → ${hi < 0 ? 'เฉยดีกว่า → ตก' : gap > 0 ? 'ผ่าน' : 'เสมอ (noise) → ผ่าน'}`);
}
console.log(`บอทเฉยไม่ได้ชีวิตดีกว่าบอทสุ่ม (ตกเฉพาะที่พิสูจน์ได้) → ${fail ? `ตก ${fail}` : 'ผ่าน'}`);
if (fail) process.exitCode = 1;
