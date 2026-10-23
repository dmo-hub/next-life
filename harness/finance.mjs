// harness การเงิน (B08): ทรัพย์สุทธิตอนตาย (บาทค่าเงินปีเกิด) ตามฐานะเกิด/ภาค ต้องไม่ผิดทิศกับความเหลื่อมล้ำจริง
// ตัวควบคุม: ปิดผลจุดเกิด (อาชีพเท่ากันทุกฐานะ · รายได้ทุกภาค = ทั่วประเทศ · เงินติดตัวเท่ากัน) แล้วช่องว่างต้องหดลงชัด
// — พิสูจน์ว่าตัววัดจับผลจุดเกิดได้จริง ไม่ใช่เรียงถูกเพราะบังเอิญ · รันซ้ำ seed เดิมต้องได้ผลเดิมทุกหลัก
import { playLife, openChoices, mixSeed, CLASSES } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 50000);
const seed = opt('seed', 1);
const randomBot = (card, rng) => {
  const open = openChoices(card);
  return open[rng.int(0, open.length - 1)];
};
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : NaN;
};
const f = (v, d = 2) => (Number.isFinite(v) ? v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) : '-');

function run(content, count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const { state } = playLife(mixSeed(seed, i), content, randomBot);
    out.push({ d: CLASSES.indexOf(state.cls), ses: state.ses, decade: Math.floor(state.birthYear / 10) * 10, w: state.estate.moneyAtBirth, occ: state.occupation, bk: state.bankruptcies });
  }
  return out;
}

// ปิดผลจุดเกิด 3 ทางในสำเนาของข้อมูล ไม่แตะแกนเกม
function flat(content) {
  const era = structuredClone(content.era);
  const mid = era.finance.occByClass[CLASSES[5]];
  for (const c of CLASSES) era.finance.occByClass[c] = mid;
  era.birth.income = era.birth.income.map((row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [k, k === 'y' ? v : row.all])));
  era.birth.startMoney = era.birth.startMoney.map(() => 1);
  return { ...content, era };
}

const BANDS = [
  ['ล่าง 40%', (d) => d <= 3],
  ['กลาง 50%', (d) => d >= 4 && d <= 8],
  ['บน 10%', (d) => d === 9],
];
const MIN_BAND = 100;
let fails = 0;

const content = loadContent();
const real = run(content, n);

console.log(`ชีวิต ${n} · seed ${seed} · ทรัพย์สุทธิตอนตาย เป็นบาทค่าเงินปีเกิด (ค่ามัธยฐาน)\n`);
console.log('ฐานะ            ชีวิต      มัธยฐาน');
const byDecile = CLASSES.map((c, d) => median(real.filter((x) => x.d === d).map((x) => x.w)));
CLASSES.forEach((c, d) => console.log(`${String(d + 1).padStart(2)} ${c.padEnd(14)} ${String(real.filter((x) => x.d === d).length).padStart(6)} ${f(byDecile[d], 0).padStart(14)}`));
const inversions = byDecile.slice(1).filter((v, i) => !(v > byDecile[i])).length;
console.log(`เรียงขึ้นทุกระดับ: กลับทิศ ${inversions} คู่ → ${inversions ? 'ตก' : 'ผ่าน'}`);
if (inversions) fails++;

console.log('\nทศวรรษเกิด  ' + BANDS.map(([b]) => b.padStart(14)).join('') + '  ผล');
let badDecades = 0;
for (const dec of [...new Set(real.map((x) => x.decade))].sort()) {
  const rows = real.filter((x) => x.decade === dec);
  const meds = BANDS.map(([, ok]) => rows.filter((x) => ok(x.d)));
  const small = meds.some((xs) => xs.length < MIN_BAND);
  const m = meds.map((xs) => median(xs.map((x) => x.w)));
  const ok = m[0] < m[1] && m[1] < m[2];
  if (!small && !ok) badDecades++;
  console.log(`${dec}s       ${m.map((v) => f(v, 0).padStart(14)).join('')}  ${small ? 'ไม่ตัดสิน (ชีวิตน้อย)' : ok ? 'ผ่าน' : 'ตก'}`);
}
if (badDecades) fails++;

// ทิศเทียบ SES: กทม.+ปริมณฑล ≈ 2.92 เท่าอีสาน (ปี 2541) · Q5/Q1 ≈ 4.60 (ปี 2566) — ดูแค่ว่าไม่ผิดทิศ ไม่ใช่ตรงตัวเลข
// ด่านใช้ส่วนต่างมัธยฐาน ไม่ใช่อัตราส่วน: มีคนตายพร้อมหนี้แล้วมัธยฐานกลุ่มล่างติดลบได้ อัตราส่วนจะกลับเครื่องหมายทั้งที่ทิศถูก
// อัตราส่วนพิมพ์ไว้เทียบ SES เมื่อตัวหารยังเป็นบวก
const med = (xs, ok) => median(xs.filter(ok).map((x) => x.w));
const pair = (xs, a, b) => ({ diff: med(xs, a) - med(xs, b), ratio: med(xs, b) > 0 ? med(xs, a) / med(xs, b) : NaN });
const topBottom = (xs) => pair(xs, (x) => x.d >= 8, (x) => x.d <= 1);
const bkkIsan = (xs) => pair(xs, (x) => x.ses === 'bkk', (x) => x.ses === 'northeast');
const rTB = topBottom(real), rBI = bkkIsan(real);
console.log(`\nบน 20% − ล่าง 20% = ${f(rTB.diff, 0)} บาท (${f(rTB.ratio)} เท่า · SES รายได้ Q5/Q1 ≈ 4.60) → ${rTB.diff > 0 ? 'ทิศถูก' : 'ผิดทิศ'}`);
console.log(`กทม.+ปริมณฑล − อีสาน = ${f(rBI.diff, 0)} บาท (${f(rBI.ratio)} เท่า · SES ปี 2541 ≈ 2.92) → ${rBI.diff > 0 ? 'ทิศถูก' : 'ผิดทิศ'}`);
if (!(rTB.diff > 0 && rBI.diff > 0)) fails++;

// กรอบที่เจ้าของเคาะ (B08b): ตายพร้อมหนี้ 15–30% · ล้มละลายอย่างน้อยครั้งหนึ่ง 3–8% — โหดตามหนี้ครัวเรือนไทย
const DEBT_BAND = [15, 30];
const BANKRUPT_BAND = [3, 8];
const pct = (k) => (k / n) * 100;
const inBand = (v, [lo, hi]) => v >= lo && v <= hi;
const negP = pct(real.filter((x) => x.w < 0).length);
const bkP = pct(real.filter((x) => x.bk > 0).length);
console.log(`ตายพร้อมหนี้ (ทรัพย์สุทธิติดลบ) ${f(negP)}% (กรอบ ${DEBT_BAND.join('–')}%) → ${inBand(negP, DEBT_BAND) ? 'ผ่าน' : 'ตก'}`);
console.log(`ล้มละลายอย่างน้อย 1 ครั้ง ${f(bkP)}% (กรอบ ${BANKRUPT_BAND.join('–')}%) → ${inBand(bkP, BANKRUPT_BAND) ? 'ผ่าน' : 'ตก'}`);
if (!inBand(negP, DEBT_BAND)) fails++;
if (!inBand(bkP, BANKRUPT_BAND)) fails++;
const share = (xs, ok) => (xs.filter((x) => ok(x.d) && x.w < 0).length / xs.filter((x) => ok(x.d)).length) * 100;
console.log('ตายพร้อมหนี้ตามฐานะ: ' + BANDS.map(([b, ok]) => `${b} ${f(share(real, ok))}%`).join(' · '));

const ctl = run(flat(content), n);
const cTB = topBottom(ctl), cBI = bkkIsan(ctl);
const shrunk = cTB.diff < rTB.diff / 2 && Math.abs(cBI.diff) < Math.abs(rBI.diff) / 2;
console.log(`\nตัวควบคุม ปิดผลจุดเกิด: บน−ล่าง ${f(cTB.diff, 0)} บาท · กทม.−อีสาน ${f(cBI.diff, 0)} บาท → ${shrunk ? 'ช่องว่างหดเกินครึ่ง ผ่าน' : 'ไม่หด ตก (ตัววัดไม่ได้จับผลจุดเกิด)'}`);
if (!shrunk) fails++;

const a = JSON.stringify(run(content, 300));
const b = JSON.stringify(run(content, 300));
console.log(`รันซ้ำ seed เดิม 300 ชีวิต: ${a === b ? 'ผลเดิมทุกหลัก ผ่าน' : 'ผลต่าง ตก'}`);
if (a !== b) fails++;

console.log(fails ? `\nไม่ผ่าน ${fails} ด่าน` : '\nผ่านทั้งหมด');
if (fails) process.exitCode = 1;
