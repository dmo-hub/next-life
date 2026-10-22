import { playLife, mixSeed, expectedDeathAge, periodE0, qx, e0FromLx, infantMortality, MAX_AGE } from '../src/engine/index.mjs';
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
// ค่าแถบต้องอยู่ใน 0–100 ทุกการ์ด (การ์ดสรุปออกทุกปี จึงเท่ากับตรวจทุกปี) · เงินต้องเป็นตัวเลขจำกัด
const STAT_KEYS = ['health', 'happiness', 'knowledge', 'relations'];
let statChecks = 0, statBad = 0, yearsCovered = 0, yearsLived = 0;
const checkStats = (card, st) => {
  if (card.kind === 'summary') yearsCovered += card.age - card.fromAge;
  for (const k of STAT_KEYS) {
    statChecks++;
    if (!(st[k] >= 0 && st[k] <= 100)) statBad++;
  }
  if (!Number.isFinite(st.money)) statBad++;
};
// ด่าน 4: จำนวนการ์ดของชีวิตที่ตายหลังอายุ 60 (นับการ์ดสรุปและการ์ดตายด้วย)
const CARD_MIN = 80, CARD_MAX = 150;
const cardsOver60 = [];
const bySex = { ชาย: [0, 0], หญิง: [0, 0] };
// ด่าน 3 จัดกลุ่มตามทศวรรษเกิด × เพศ: [ผลรวมอายุจริง, ผลรวมอายุที่ข้อมูลคาด, ผลรวม e0 ปีเกิด, จำนวน]
const groups = new Map();
for (let i = 0; i < n; i++) {
  const { age, cards, state } = playLife(mixSeed(seed, i), content, randomBot, checkStats);
  yearsLived += age;
  if (age > 60) cardsOver60.push(cards);
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

console.log(`
ค่าสถานะ: ตรวจ ${statChecks.toLocaleString('en-US')} ค่า · การ์ดสรุปครอบ ${yearsCovered.toLocaleString('en-US')} จาก ${yearsLived.toLocaleString('en-US')} ปีที่มีชีวิต · หลุด 0–100/ไม่ใช่ตัวเลข ${statBad} → ${statBad ? 'ตก' : 'ผ่าน'}`);
if (statBad) process.exitCode = 1;

cardsOver60.sort((a, b) => a - b);
const inRange = cardsOver60.filter((c) => c >= CARD_MIN && c <= CARD_MAX).length;
const share = cardsOver60.length ? inRange / cardsOver60.length : 0;
const pct = (p) => cardsOver60[Math.min(cardsOver60.length - 1, Math.floor(p * cardsOver60.length))];
console.log(`ด่าน 4: ชีวิตที่ตายหลัง 60 ยาว ${CARD_MIN}–${CARD_MAX} การ์ด ${f(share * 100)}% (ต้อง ≥90%) · ${cardsOver60.length} ชีวิต · การ์ด p5 ${pct(0.05)} · p25 ${pct(0.25)} · p50 ${pct(0.5)} · p75 ${pct(0.75)} · p95 ${pct(0.95)} · ต่ำกว่า ${CARD_MIN} ${cardsOver60.filter((c) => c < CARD_MIN).length} · เกิน ${CARD_MAX} ${cardsOver60.filter((c) => c > CARD_MAX).length} → ${share >= 0.9 ? 'ผ่าน' : 'ตก'}`);
if (share < 0.9) process.exitCode = 1;

// ด่าน 3 มีสองชั้น เพราะเป้าของ 3b คำนวณจาก qx ตัวเดียวกับที่เกมใช้ ถ้าตารางชีพผิด 3b ก็ยังผ่าน
// 3a: ตารางชีพรายปีที่เกมใช้ต้องให้ e0 และอัตราตายทารกตรงข้อมูลจริงของปีนั้น (ไม่ผ่านแกนเกม ไม่ผ่านการสุ่ม)
const E0_TOL = 0.05, IMR_TOL = 0.5;
let bad3a = 0, worstE0 = 0, worstImr = 0;
const lastMort = era.mort.from + era.mort.e0.ชาย.v.length - 1;
for (const sex of ['ชาย', 'หญิง']) {
  for (let y = era.mort.from; y <= lastMort; y++) {
    const lx = [1];
    for (let a = 0; a < MAX_AGE; a++) lx.push(lx[a] * (1 - qx(era, sex, y, a)));
    const dE0 = Math.abs(e0FromLx(lx) - periodE0(era, sex, y));
    const dImr = Math.abs((1 - lx[1]) * 1000 - infantMortality(era, sex, y));
    worstE0 = Math.max(worstE0, dE0);
    worstImr = Math.max(worstImr, dImr);
    if (dE0 > E0_TOL || dImr > IMR_TOL) {
      bad3a++;
      console.log(`  ✗ ${sex} ${y}: e0 ห่าง ${f(dE0)} · IMR ห่าง ${f(dImr)}`);
    }
  }
}
console.log(`\nด่าน 3a: ตารางชีพที่เกมใช้ vs ข้อมูลจริงรายปี (e0 ±${E0_TOL} · IMR ±${IMR_TOL}/1,000) ห่างสุด e0 ${worstE0.toFixed(4)} · IMR ${worstImr.toFixed(4)} → ${bad3a ? `ตก ${bad3a} ปี-เพศ` : 'ผ่าน'}`);
if (bad3a) process.exitCode = 1;

// 3b (ใบ 07 + MAP: ตายตามแนวชีวิต): อายุเฉลี่ยของบอทสุ่ม vs อายุตายที่ข้อมูลคาดตามแนวชีวิต (ตารางชีพของแต่ละปีที่ผ่าน) ไม่ใช่ e0 ปีเกิด
const TOL = 3;
// กลุ่มเล็กกว่านี้ค่าเฉลี่ยแกว่งเกิน ±1 ปีจากสุ่มล้วน (อายุตาย SD ราว 22 ปี) ตัดสินไม่ได้
const MIN_LIVES = 500;
let fail = 0, small = 0;
console.log(`\nด่าน 3b: อายุเฉลี่ยห่างค่าที่ข้อมูลคาดตามแนวชีวิต ไม่เกิน ±${TOL} ปี`);
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
if (fail) console.log(`ด่าน 3b ตก ${fail} กลุ่ม`);
else if (small) console.log(`ด่าน 3b ยังไม่ตัดสิน: ${small} กลุ่มมีไม่ถึง ${MIN_LIVES} ชีวิต — รัน npm run gate (20,000 ชีวิต)`);
else console.log('ด่าน 3b ผ่านทุกกลุ่ม');
if (fail) process.exitCode = 1;
