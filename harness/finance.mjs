// harness การเงิน (B08): ทรัพย์สุทธิตอนตาย (บาทค่าเงินปีเกิด) ตามฐานะเกิด/ภาค ต้องไม่ผิดทิศกับความเหลื่อมล้ำจริง
// ตัวควบคุม: ปิดผลจุดเกิด (อาชีพเท่ากันทุกฐานะ · รายได้ทุกภาค = ทั่วประเทศ · เงินติดตัวเท่ากัน) แล้วช่องว่างต้องหดลงชัด
// — พิสูจน์ว่าตัววัดจับผลจุดเกิดได้จริง ไม่ใช่เรียงถูกเพราะบังเอิญ · รันซ้ำ seed เดิมต้องได้ผลเดิมทุกหลัก
import { playLife, openChoices, mixSeed, makeRng, CLASSES, standingOf } from '../src/engine/index.mjs';
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
// เรียงชั้น: ตกเฉพาะกลับทิศที่พิสูจน์ได้ — การ์ดที่เพิ่มตัวเลือกสับเส้นทางชีวิตทั้งชุด มัธยฐานคู่ชั้นติดกันจึงสลับกันได้จาก noise ล้วน
// (main เดียวกัน คนละ seed ก็สลับ) · bootstrap มัธยฐานในแต่ละชั้น หาช่วง 95% ของ (ชั้นสูง − ชั้นต่ำ) · ขอบบน < 0 = ชั้นสูงจนกว่าแน่
// RNG ของ bootstrap ผูกกับ --seed ⇒ ผลซ้ำทุกหลัก
const BOOT = 1000;
const bootRng = makeRng(mixSeed(seed, 0xb007));
const bootMedians = (xs) => {
  const out = new Float64Array(BOOT);
  const s = new Float64Array(xs.length);
  for (let b = 0; b < BOOT; b++) {
    for (let i = 0; i < xs.length; i++) s[i] = xs[Math.floor(bootRng.next() * xs.length)];
    s.sort();
    out[b] = s[Math.floor(s.length / 2)];
  }
  return out;
};
const boots = CLASSES.map((c, d) => bootMedians(real.filter((x) => x.d === d).map((x) => x.w)));
let inversions = 0;
let ties = 0;
console.log('\nคู่ชั้นติดกัน               ส่วนต่าง    ช่วง 95% (บาท)                ผล');
for (let d = 1; d < CLASSES.length; d++) {
  const diffs = boots[d].map((v, b) => v - boots[d - 1][b]).sort();
  const [lo, hi] = [diffs[Math.floor(BOOT * 0.025)], diffs[Math.ceil(BOOT * 0.975) - 1]];
  const pct = ((byDecile[d] - byDecile[d - 1]) / Math.abs(byDecile[d - 1] || 1)) * 100;
  const verdict = hi < 0 ? 'กลับทิศ → ตก' : byDecile[d] > byDecile[d - 1] ? 'ผ่าน' : 'เสมอ (noise) → ผ่าน';
  if (hi < 0) inversions++;
  else if (!(byDecile[d] > byDecile[d - 1])) ties++;
  console.log(`${`${CLASSES[d - 1]}→${CLASSES[d]}`.padEnd(26)} ${`${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`.padStart(9)}  [${f(lo, 0)}, ${f(hi, 0)}]`.padEnd(70) + verdict);
}
console.log(`เรียงขึ้นทุกระดับ: กลับทิศที่พิสูจน์ได้ ${inversions} คู่ · เสมอใน noise ${ties} คู่ → ${inversions ? 'ตก' : 'ผ่าน'}`);
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

// การ์ดที่เช็กชนชั้น (B111): ต้องออกตามฐานะปีที่ออก ไม่ใช่ฐานะตอนเกิด — รั่ว = ออกตอนฐานะปีนั้นไม่อยู่ใน when.class
// ตัวควบคุม: นับครั้งที่ฐานะตอนเกิดไม่อยู่ในเงื่อนไข ต้องมากกว่า 0 ไม่งั้นชุดนี้ไม่มีใครเลื่อนฐานะ ด่านรั่ว 0 ไม่ได้พิสูจน์อะไร
const gated = new Map(content.events.filter((e) => e.when?.class).map((e) => [e.id, e.when.class]));
let classFired = 0, classLeak = 0, classMoved = 0;
const CLASS_LIVES = Math.min(n, 2000);
for (let i = 0; i < CLASS_LIVES; i++) {
  playLife(mixSeed(seed, i), content, randomBot, (card, st) => {
    const allow = card.kind === 'event' && gated.get(card.id);
    if (!allow) return;
    classFired++;
    if (!allow.includes(CLASSES[standingOf(st)])) classLeak++;
    if (!allow.includes(st.cls)) classMoved++;
  });
}
const classOk = classLeak === 0 && classMoved > 0;
console.log(`การ์ดเช็กชนชั้น ${CLASS_LIVES} ชีวิต: ออก ${classFired} ครั้ง · ฐานะปีนั้นไม่ตรง ${classLeak} · ฐานะตอนเกิดไม่ตรง (ตัวควบคุม) ${classMoved} → ${classOk ? 'ผ่าน' : 'ตก'}`);
if (!classOk) fails++;

// กู้มาจ่าย (B111): บอทเดิมไม่กู้ ผลข้างบนจึงเท่าก่อนมีระบบ · บอทกู้นับตัวเลือกที่ขาดเงินเป็นตัวเลือกด้วย แล้วกู้จากแหล่งที่สุ่มได้
// ด่าน: กู้แล้วต้องกดได้ทุกครั้ง (choose ไม่ throw) · ธง informal_debt ตรงกับหนี้นอกระบบที่ค้างทุกการ์ด · ต้องมีการกู้จริงทั้ง 3 แหล่ง ไม่งั้นด่านไม่ได้วัดอะไร
// ตายพร้อมหนี้/ล้มละลายของคนกู้พิมพ์เทียบบอทเดิม ไม่ใช่ด่าน — กรอบของเจ้าของวัดกับบอทเดิม
const loanBot = (card, rng) => {
  const open = openChoices(card);
  const loanable = (card.loans ?? []).map((l, i) => (l ? i : -1)).filter((i) => i >= 0);
  const pick = rng.int(0, open.length + loanable.length - 1);
  if (pick < open.length) return open[pick];
  const i = loanable[pick - open.length];
  return { i, loan: card.loans[i][rng.int(0, card.loans[i].length - 1)].kind };
};
const LOAN_LIVES = Math.min(n, 5000);
const bySource = {};
let loanLives = 0, loanErr = 0, flagLeak = 0, loanNeg = 0, loanBk = 0;
for (let i = 0; i < LOAN_LIVES; i++) {
  let took = false;
  const bot = (card, rng) => {
    const p = loanBot(card, rng);
    if (typeof p === 'object') {
      took = true;
      bySource[p.loan] = (bySource[p.loan] ?? 0) + 1;
    }
    return p;
  };
  try {
    const { state } = playLife(mixSeed(seed ^ 0x10a7, i), content, bot, (card, st) => {
      if (!!st.flags.informal_debt !== st.debts.some((d) => d.kind === 'informal')) flagLeak++;
    });
    if (took) {
      loanLives++;
      if (state.estate.moneyAtBirth < 0) loanNeg++;
      if (state.bankruptcies > 0) loanBk++;
    }
  } catch (e) {
    loanErr++;
    if (loanErr === 1) console.log(`กู้มาจ่ายพัง: ${e.message}`);
  }
}
const SOURCES = ['bank_loan', 'coop', 'informal'];
const loanOk = loanErr === 0 && flagLeak === 0 && SOURCES.every((k) => bySource[k] > 0);
console.log(`\nบอทกู้ ${LOAN_LIVES} ชีวิต: กู้อย่างน้อยครั้งหนึ่ง ${loanLives} ชีวิต · ` + SOURCES.map((k) => `${k} ${bySource[k] ?? 0}`).join(' · ') + ` · พัง ${loanErr} · ธงนอกระบบไม่ตรง ${flagLeak} → ${loanOk ? 'ผ่าน' : 'ตก'}`);
console.log(`คนที่กู้: ตายพร้อมหนี้ ${f(loanLives ? (loanNeg / loanLives) * 100 : NaN)}% · ล้มละลาย ${f(loanLives ? (loanBk / loanLives) * 100 : NaN)}% (บอทเดิม ${f(negP)}% · ${f(bkP)}%)`);
if (!loanOk) fails++;

console.log(fails ? `\nไม่ผ่าน ${fails} ด่าน` : '\nผ่านทั้งหมด');
if (fails) process.exitCode = 1;
