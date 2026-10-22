import { playLife, mixSeed, expectedDeathAge, periodE0 } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 1000);
const seed = opt('seed', 1);
const content = loadContent();
const era = content.era;

// บอทสุ่มล้วน เลือกจากตัวเลือกที่ผู้เล่นเห็นเท่านั้น
const randomBot = (card, rng) => rng.int(0, card.choices.length - 1);

let sum = 0, min = Infinity, max = -Infinity, over60 = 0, under5 = 0;
const bySex = { ชาย: [0, 0], หญิง: [0, 0] };
// ด่าน 3 จัดกลุ่มตามทศวรรษเกิด × เพศ: [ผลรวมอายุจริง, ผลรวมอายุที่ข้อมูลคาด, ผลรวม e0 ปีเกิด, จำนวน]
const groups = new Map();
for (let i = 0; i < n; i++) {
  const { age, state } = playLife(mixSeed(seed, i), content, randomBot);
  sum += age;
  min = Math.min(min, age);
  max = Math.max(max, age);
  if (age > 60) over60++;
  if (age < 5) under5++;
  bySex[state.sex][0] += age;
  bySex[state.sex][1]++;
  const key = `${Math.floor(state.birthYear / 10) * 10}|${state.sex}`;
  const g = groups.get(key) ?? [0, 0, 0, 0];
  g[0] += age;
  g[1] += expectedDeathAge(era, state.sex, state.birthYear);
  g[2] += periodE0(era, state.sex, state.birthYear);
  g[3]++;
  groups.set(key, g);
}
const f = (v) => v.toFixed(2);
console.log(`ชีวิต ${n} · seed ${seed}`);
console.log(`อายุเฉลี่ย ${f(sum / n)} ปี · ต่ำสุด ${min} · สูงสุด ${max}`);
console.log(`ตายหลังอายุ 60: ${f((over60 / n) * 100)}% · ตายก่อน 5 ขวบ: ${f((under5 / n) * 100)}%`);
for (const [s, [t, c]] of Object.entries(bySex)) console.log(`${s}: อายุเฉลี่ย ${f(t / c)} ปี (${c} ชีวิต)`);

// ด่าน 3 (ใบ 07): เป้า = อายุตายที่ข้อมูลจริงคาดไว้ตามแนวชีวิต (ตารางชีพของแต่ละปีที่ผ่าน) ไม่ใช่ e0 ของปีเกิดปีเดียว
const TOL = 3;
// กลุ่มเล็กกว่านี้ค่าเฉลี่ยแกว่งเกิน ±1 ปีจากสุ่มล้วน (อายุตาย SD ราว 22 ปี) ตัดสินไม่ได้
const MIN_LIVES = 500;
let fail = 0, small = 0;
console.log(`\nด่าน 3: อายุเฉลี่ยห่างค่าที่ข้อมูลคาด ไม่เกิน ±${TOL} ปี`);
console.log('ทศวรรษเกิด เพศ   ชีวิต  อายุเฉลี่ย  ข้อมูลคาด  ต่าง   (e0 ปีเกิด)');
for (const key of [...groups.keys()].sort()) {
  const [dec, sex] = key.split('|');
  const [real, exp, e0, c] = groups.get(key);
  const diff = real / c - exp / c;
  const ok = Math.abs(diff) <= TOL;
  const judged = c >= MIN_LIVES;
  if (!judged) small++;
  else if (!ok) fail++;
  const verdict = !judged ? 'ไม่ตัดสิน (ชีวิตน้อย)' : ok ? 'ผ่าน' : 'ตก';
  console.log(`${dec}s ${sex.padEnd(4)} ${String(c).padStart(6)} ${f(real / c).padStart(10)} ${f(exp / c).padStart(10)} ${(diff >= 0 ? '+' : '') + f(diff)} (${f(e0 / c)}) ${verdict}`);
}
if (fail) console.log(`ด่าน 3 ตก ${fail} กลุ่ม`);
else if (small) console.log(`ด่าน 3 ยังไม่ตัดสิน: ${small} กลุ่มมีไม่ถึง ${MIN_LIVES} ชีวิต — รัน npm run gate (20,000 ชีวิต)`);
else console.log('ด่าน 3 ผ่านทุกกลุ่ม');
if (fail) process.exitCode = 1;
