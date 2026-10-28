// การเงิน (ใบ 10 · 11 · 14): ผลตอบแทนสินทรัพย์รายปี · ค่าจ้างตามอาชีพ · การ์ดจัดสรรเงิน — ฟังก์ชันล้วน ไม่แตะ DOM/ไฟล์
import { makeRng } from './rng.mjs';
import { seriesAt, seriesYear, inflationRate, priceRatio, protoYear } from './era.mjs';
import { regionRatio } from './birth.mjs';

// system = id ใน data/system-starts.json ที่กั้นปีที่ซื้อได้ · ไม่มี system = มีตลอดช่วงเกม
// สลากออมสินอยู่ในรายการเพื่อให้ด่าน build รู้จัก id แต่ระบบยังปิด จึงไม่มีผลตอบแทนให้คำนวณ
export const ASSETS = [
  { id: 'cash', name: 'เงินสด' },
  { id: 'deposit', name: 'เงินฝาก' },
  { id: 'stock', name: 'หุ้นไทย', system: 'stock' },
  { id: 'gold', name: 'ทอง' },
  { id: 'land', name: 'ที่ดิน' },
  { id: 'savings_lottery', name: 'สลากออมสิน', system: 'savings_lottery' },
];
const ASSET_BY_ID = new Map(ASSETS.map((a) => [a.id, a]));
export const DISCLAIMER = 'เกม ไม่ใช่คำแนะนำการลงทุน';

const systemOpen = (era, id, year) => {
  const s = era.systems.find((x) => x.id === id);
  return !!s && s.status === 'open' && year >= s.from && (s.to === undefined || year <= s.to);
};

export function assetOpen(era, id, year) {
  const a = ASSET_BY_ID.get(id);
  if (!a) throw new Error(`สินทรัพย์ไม่รู้จัก: ${id}`);
  return !a.system || systemOpen(era, a.system, year);
}

// ชนิดหนี้ (B08b) กั้นปีด้วย system แบบเดียวกับสินทรัพย์ · ดอก/ระยะผ่อนอยู่ใน data/debt.json
export const DEBTS = [
  { id: 'student_loan', name: 'กยศ.', system: 'student_loan' },
  { id: 'mortgage', name: 'ผ่อนบ้าน' },
  { id: 'car', name: 'ผ่อนรถ' },
  { id: 'informal', name: 'หนี้นอกระบบ' },
  { id: 'credit_card', name: 'บัตรเครดิต', system: 'credit_card' },
  // แหล่งกู้มาจ่าย (B111) — ปีเริ่มของกองทุนอยู่ใน data/debt.json (from) ไม่ใช่ system: คำว่ากองทุนหมู่บ้านในการ์ดเก่าไม่ได้อ้างการกู้
  { id: 'bank_loan', name: 'สินเชื่อธนาคาร' },
  { id: 'coop', name: 'กองทุนหมู่บ้าน/สหกรณ์' },
];
const DEBT_BY_ID = new Map(DEBTS.map((d) => [d.id, d]));
export const debtName = (id) => DEBT_BY_ID.get(id)?.name ?? id;

// ตารางรางวัลสลากกินแบ่งรัฐบาล (ใบ 11 · ใบ 12 ตรวจกับ glo.or.th แล้ว): จำนวนรางวัลต่อ 1 ชุด 1,000,000 ฉบับ · บาทต่อรางวัล ณ ราคาใบ price
// ใหญ่ 168 ต่อล้าน + เล็ก 14,000 ต่อล้าน = 1.4168% · เนื้อหาอ้างตารางนี้ด้วยชื่อ finance.lottery ห้ามตั้งตารางเอง
// ใช้ทุกปีด้วยมูลค่าต่อราคาใบเท่าเดิม — ยุคก่อน 2560 รางวัลครึ่งหนึ่งพร้อมราคาครึ่งหนึ่ง (อนุมาน) ก่อน 2550 ไม่มีข้อมูล
export const LOTTERY_PRIZES = {
  per: 1_000_000,
  price: 80,
  prizes: [
    { id: 'first', name: 'รางวัลที่ 1', n: 1, baht: 6_000_000, small: false },
    { id: 'near_first', name: 'รางวัลข้างเคียงรางวัลที่ 1', n: 2, baht: 100_000, small: false },
    { id: 'second', name: 'รางวัลที่ 2', n: 5, baht: 200_000, small: false },
    { id: 'third', name: 'รางวัลที่ 3', n: 10, baht: 80_000, small: false },
    { id: 'fourth', name: 'รางวัลที่ 4', n: 50, baht: 40_000, small: false },
    { id: 'fifth', name: 'รางวัลที่ 5', n: 100, baht: 20_000, small: false },
    { id: 'front3', name: 'รางวัลเลขหน้า 3 ตัว', n: 2_000, baht: 4_000, small: true },
    { id: 'last3', name: 'รางวัลเลขท้าย 3 ตัว', n: 2_000, baht: 4_000, small: true },
    { id: 'last2', name: 'รางวัลเลขท้าย 2 ตัว', n: 10_000, baht: 2_000, small: true },
  ],
};
export const PRIZE_TABLES = { 'finance.lottery': LOTTERY_PRIZES };

export function debtOpen(era, id, year) {
  const d = DEBT_BY_ID.get(id);
  if (!d) throw new Error(`หนี้ไม่รู้จัก: ${id}`);
  if (era.finance.debt.kinds[id]?.from > year) return false;
  return !d.system || systemOpen(era, d.system, year);
}

// ก้อนหนี้ใหม่ · ดอกคงที่ล็อกตั้งแต่วันกู้ · ผ่อนบ้านไม่ล็อก ลอยตามดอกเงินกู้ทุกปี (float)
export function newDebt(era, seed, kind, amount, year) {
  const k = era.finance.debt.kinds[kind];
  const base = () => lendingRate(era, seed, year) + k.premium;
  let rate = k.rate;
  if (kind === 'car') rate = k.cap && year >= k.cap.from ? Math.min(base(), k.cap.v) : base();
  else if (kind === 'bank_loan') rate = base();
  return { kind, balance: amount, rate, float: kind === 'mortgage', premium: k.premium ?? 0, years: k.years ?? null, grace: k.grace ?? 0, simple: !!k.simple };
}

// ยอดจ่ายของปีนี้ แล้วลดก้อนหนี้ตาม · ปลอดหนี้ = ดอกทบเข้าเงินต้น ไม่จ่าย · ไม่ทบ = จ่ายแต่ดอก เงินต้นค้าง
// ที่เหลือผ่อนเท่ากันทุกปีแบบลดต้นลดดอก ให้หมดพอดีในปีที่เหลือ
export function payDebt(era, seed, d, year) {
  const r = d.float ? lendingRate(era, seed, year) + d.premium : d.rate;
  if (d.grace > 0) {
    d.grace--;
    d.balance *= 1 + r;
    return 0;
  }
  if (d.simple) return d.balance * r;
  const pay = r ? (d.balance * r) / (1 - (1 + r) ** -d.years) : d.balance / d.years;
  d.balance = d.balance * (1 + r) - pay;
  d.years--;
  return pay;
}
// ยอดจ่ายปีแรกของก้อนที่เพิ่งกู้ ไม่แตะก้อนหนี้ — ปุ่มกู้บอกก่อนกด (ก้อนดอกคงที่ไม่มีปลอดหนี้เท่านั้น)
export const firstPay = (d) => (d.simple ? d.balance * d.rate : d.rate ? (d.balance * d.rate) / (1 - (1 + d.rate) ** -d.years) : d.balance / d.years);
export const debtDone = (d) => !d.simple && (d.years <= 0 || d.balance <= 0.5);

// ร้องเรียนหนี้นอกระบบ: ดอกลดเหลืออัตราตามกฎหมาย แต่ยังจ่ายแต่ดอกเหมือนเดิม — เงินต้นค้างจนมีการ์ดให้ปิดหนี้
export function complainDebt(era, d) {
  if (d.kind === 'informal') d.rate = era.finance.debt.kinds.informal.complaint_rate;
}

// ผลตอบแทนทั้งปีเป็นสัดส่วน (0.05 = 5%) · สินทรัพย์ที่คิดจากราคาสองปี อ่านปีต้นแบบครั้งเดียวแล้วเทียบกับปีก่อนหน้าของปีต้นแบบ
export function assetReturn(era, seed, id, year) {
  const f = era.finance;
  const at = (s, y) => s.v[y - s.from];
  switch (id) {
    case 'cash':
      return 0;
    case 'deposit':
      return seriesAt(era, seed, f.deposit, year) / 100;
    case 'stock': {
      const y = seriesYear(era, seed, f.setClose, year);
      return at(f.setClose, y) / at(f.setClose, y - 1) - 1 + at(f.setDiv, y) / 100;
    }
    case 'gold': {
      const y = seriesYear(era, seed, f.gold, year);
      const prev = Math.max(f.gold.from, y - 1);
      return (at(f.gold, y) * at(f.fx, y)) / (at(f.gold, prev) * at(f.fx, prev)) - 1;
    }
    case 'land': {
      const y = seriesYear(era, seed, f.house, year);
      if (y - 1 >= f.house.from) return at(f.house, y) / at(f.house, y - 1) - 1;
      // y เป็นปีต้นแบบแล้ว อ่านชุดตรง — ผ่าน inflationRate จะสุ่มปีต้นแบบซ้ำอีกชั้น
      return (at(era.cpi, y) + f.housePremium) / 100;
    }
    default:
      throw new Error(`ไม่มีผลตอบแทนของ ${id}`);
  }
}

export const lendingRate = (era, seed, year) => seriesAt(era, seed, era.finance.lending, year) / 100;

// ค่าแรงขั้นต่ำกรุงเทพฯ บาท/วัน = ค่าจริงปีอ้างอิง × อัตราโตของปีต้นแบบสะสมทีละปี
// อ่านระดับค่าแรงของปีต้นแบบตรง ๆ ไม่ได้ — ปีติดกันยืมคนละยุค ค่าแรงจะกระโดดขึ้นลงหลายเท่า
export function minWage(era, seed, year) {
  const s = era.finance.minWage;
  const ref = era.finance.refYear;
  const growth = (y) => {
    const p = protoYear(era, seed, y) - s.from;
    return s.v[p] / s.v[p - 1];
  };
  let w = s.v[ref - s.from];
  for (let y = ref + 1; y <= year; y++) w *= growth(y);
  for (let y = ref; y > year; y--) w /= growth(y);
  return w;
}

// ค่าจ้าง/เดือนของอาชีพ = ค่าจ้างปีอ้างอิง × ดัชนีค่าแรงขั้นต่ำ × สัดส่วนรายได้ภาค — วุฒิผูกกับอาชีพแล้ว ไม่คูณซ้ำ
export function monthlyWage(era, seed, occupation, ses, year) {
  const f = era.finance;
  const o = f.occupations.find((x) => x.id === occupation);
  return o.wage * (minWage(era, seed, year) / minWage(era, seed, f.refYear)) * regionRatio(era.birth, ses, year);
}

// อาชีพตามฐานะเกิด สุ่มจาก stream ของตัวเอง — ไม่กินเลขสุ่มของโลก ชะตาการตายจึงไม่เปลี่ยนเพราะระบบเงิน
export function pickOccupation(era, seed, cls) {
  const f = era.finance;
  const w = f.occByClass[cls];
  let r = makeRng(seed ^ 0x2c1b3c6d).next() * w.reduce((s, x) => s + x, 0);
  for (let i = 0; i < w.length; i++) {
    r -= w[i];
    if (r < 0) return f.occupations[i];
  }
  return f.occupations.at(-1);
}

// พอร์ตปรับสัดส่วนคืนทุกต้นปี · สินทรัพย์ที่ปีนี้ซื้อไม่ได้ย้ายไปเงินฝาก
export function portfolioReturn(era, seed, alloc, year) {
  let r = 0;
  for (const [id, w] of Object.entries(alloc)) r += w * assetReturn(era, seed, assetOpen(era, id, year) ? id : 'deposit', year);
  return r;
}

// การ์ดจัดสรร (ใบ 11): ทุก every ปีตั้งแต่อายุ from ถึง to · ≥4 ตัวเลือกเสมอ (ก่อนตลาดหุ้นเปิดยังมี 6)
export const ALLOC = { from: 20, every: 5, to: 70 };
export const isAllocAge = (age) => age >= ALLOC.from && age <= ALLOC.to && (age - ALLOC.from) % ALLOC.every === 0;

export function allocOptions(era, year) {
  const open = (id) => assetOpen(era, id, year);
  const opts = [
    { label: 'ฝากธนาคารทั้งหมด', alloc: { deposit: 1 } },
    { label: 'ถือเงินสดไว้กับตัว', alloc: { cash: 1 } },
    { label: 'ซื้อทองไว้ครึ่งหนึ่ง', alloc: { gold: 0.5, deposit: 0.5 } },
    { label: 'ซื้อที่ดินไว้ครึ่งหนึ่ง', alloc: { land: 0.5, deposit: 0.5 } },
  ];
  if (open('stock')) opts.push({ label: 'ซื้อหุ้นไทยไว้ครึ่งหนึ่ง', alloc: { stock: 0.5, deposit: 0.5 } });
  const spread = ASSETS.filter((a) => a.id !== 'cash' && open(a.id)).map((a) => a.id);
  opts.push({ label: 'แบ่งเท่า ๆ กันทุกทาง', alloc: Object.fromEntries(spread.map((id) => [id, 1 / spread.length])) });
  opts.push({ label: 'คงแบบเดิม', alloc: null });
  return opts;
}

export const formatReturn = (r) => `${r >= 0 ? '+' : '−'}${Math.abs(r * 100).toFixed(2)}%`;

// ผลหลังเกิดแล้วของช่วงปีเกม from..to ต่อสินทรัพย์ที่ซื้อได้ (ใบ 11: บอกย้อนหลัง ไม่บอกล่วงหน้า)
export function periodReturns(era, seed, from, to) {
  const out = [];
  for (const a of ASSETS) {
    if (a.id === 'cash') continue;
    let g = 1, any = false;
    for (let y = from; y <= to; y++) {
      if (!assetOpen(era, a.id, y)) continue;
      any = true;
      g *= 1 + assetReturn(era, seed, a.id, y);
    }
    if (any) out.push({ id: a.id, name: a.name, r: g - 1 });
  }
  return out;
}

export const assetName = (id) => ASSET_BY_ID.get(id)?.name ?? id;
