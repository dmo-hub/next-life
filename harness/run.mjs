import { playLife, openChoices, mixSeed } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { gate3a, gate3b, gate4, addGroup } from './gates.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 1000);
const seed = opt('seed', 1);
const content = loadContent();
const era = content.era;

// บอทสุ่มล้วน เลือกจากตัวเลือกที่ผู้เล่นกดได้เท่านั้น
const randomBot = (card, rng) => {
  const open = openChoices(card);
  return open[rng.int(0, open.length - 1)];
};

let sum = 0, min = Infinity, max = -Infinity, over60 = 0, under5 = 0;
// ค่าแถบต้องอยู่ใน 0–100 ทุกการ์ด · เงินต้องเป็นตัวเลขจำกัด
// การ์ดสรุปช่วงวัย (เปลี่ยนช่วง + การ์ดตาย) ต้องครอบทุกปีที่มีชีวิต — ไม่มีการ์ดสรุปรายปีแล้ว ปีที่ไม่มีเรื่องเล่าผ่านใบนี้ใบเดียว
const STAT_KEYS = ['health', 'happiness', 'knowledge', 'relations', 'network'];
let statChecks = 0, statBad = 0, yearsCovered = 0, yearsLived = 0;
const checkStats = (card, st) => {
  if (card.recap) yearsCovered += card.recap.toAge - card.recap.fromAge + 1;
  for (const k of STAT_KEYS) {
    statChecks++;
    if (!(st[k] >= 0 && st[k] <= 100)) statBad++;
  }
  if (!Number.isFinite(st.money)) statBad++;
};
const cardsOver60 = [];
const bySex = { ชาย: [0, 0], หญิง: [0, 0] };
const groups = new Map();
for (let i = 0; i < n; i++) {
  const { age, cards, state } = playLife(mixSeed(seed, i), content, randomBot, checkStats);
  // นับอายุ 0 ถึงอายุตาย รวมปีที่ตาย — ตรงกับช่วงที่การ์ดสรุปช่วงวัยครอบ
  yearsLived += age + 1;
  if (age > 60) cardsOver60.push(cards);
  sum += age;
  min = Math.min(min, age);
  max = Math.max(max, age);
  if (age > 60) over60++;
  if (age < 5) under5++;
  bySex[state.sex][0] += age;
  bySex[state.sex][1]++;
  addGroup(groups, era, state, age);
}
const f = (v) => v.toFixed(2);
console.log(`ชีวิต ${n} · seed ${seed}`);
console.log(`อายุเฉลี่ย ${f(sum / n)} ปี · ต่ำสุด ${min} · สูงสุด ${max}`);
console.log(`ตายหลังอายุ 60: ${f((over60 / n) * 100)}% · ตายก่อน 5 ขวบ: ${f((under5 / n) * 100)}%`);
for (const [s, [t, c]] of Object.entries(bySex)) console.log(`${s}: อายุเฉลี่ย ${f(t / c)} ปี (${c} ชีวิต)`);

console.log(`
ค่าสถานะ: ตรวจ ${statChecks.toLocaleString('en-US')} ค่า · การ์ดสรุปครอบ ${yearsCovered.toLocaleString('en-US')} จาก ${yearsLived.toLocaleString('en-US')} ปีที่มีชีวิต · หลุด 0–100/ไม่ใช่ตัวเลข ${statBad} → ${statBad ? 'ตก' : 'ผ่าน'}`);
if (statBad) process.exitCode = 1;

const g4 = gate4(cardsOver60);
console.log(g4.line);
if (g4.fail) process.exitCode = 1;

const g3a = gate3a(era);
console.log(g3a.lines.join('\n'));
if (g3a.fail) process.exitCode = 1;

const g3b = gate3b(groups);
console.log(g3b.lines.join('\n'));
if (g3b.fail) process.exitCode = 1;
