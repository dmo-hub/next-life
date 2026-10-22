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

export function assetOpen(era, id, year) {
  const a = ASSET_BY_ID.get(id);
  if (!a) throw new Error(`สินทรัพย์ไม่รู้จัก: ${id}`);
  if (!a.system) return true;
  const s = era.systems.find((x) => x.id === a.system);
  return !!s && s.status === 'open' && year >= s.from && (s.to === undefined || year <= s.to);
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
