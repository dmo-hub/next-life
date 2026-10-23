// จุดเกิด (ใบ 01 · ใบ 03): ภาคตามประชากรจริง → ฐานะตามการกระจายรายได้ของภาคนั้นในปีเกิด → รายได้ตามปีที่ใช้ชีวิต
import { priceRatio } from './era.mjs';
import { makeRng } from './rng.mjs';

// CDF ปกติมาตรฐาน (Abramowitz–Stegun 7.1.26 · คลาดไม่เกิน 1.5e-7)
export function normCdf(z) {
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(z * z) / 2);
  return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
}

export function pickRegion(rng, birth) {
  let r = rng.next() * birth.regions.reduce((s, x) => s + x.w, 0);
  for (const x of birth.regions) {
    r -= x.w;
    if (r < 0) return x;
  }
  return birth.regions[birth.regions.length - 1];
}

// จังหวัดในภาคที่ได้ ตามประชากร (B34) — ผู้เรียกส่ง rng แยกเสมอ ภาคและทุกผลที่คิดจากภาคจึงไม่ขยับ
export function pickProvince(rng, birth, regionName) {
  const list = birth.regions.find((x) => x.name === regionName).provinces;
  let r = rng.next() * list.reduce((s, x) => s + x.w, 0);
  for (const x of list) {
    r -= x.w;
    if (r < 0) return x.name;
  }
  return list[list.length - 1].name;
}

// ชื่อจังหวัดบนจอ: กรุงเทพฯ ไม่ใช่ "จังหวัด" จึงไม่นำหน้า จ.
export const placeName = (province) => (province === 'กรุงเทพมหานคร' ? province : `จ.${province}`);

// ค่าในแถวสำรวจ ณ ปีใดก็ได้: ก่อนรอบแรก/หลังรอบสุดท้ายใช้รอบที่ใกล้สุด ระหว่างรอบเป็นเส้นตรง
function between(rows, year, f) {
  if (year <= rows[0].y) return f(rows[0]);
  for (let i = 1; i < rows.length; i++) {
    if (year <= rows[i].y) {
      const a = rows[i - 1], b = rows[i];
      return f(a) + ((f(b) - f(a)) * (year - a.y)) / (b.y - a.y);
    }
  }
  return f(rows[rows.length - 1]);
}

// รายได้ครัวเรือนของภาคนั้นเทียบทั้งประเทศ ณ ปีนั้น
export const regionRatio = (birth, ses, year) => between(birth.income, year, (row) => row[ses] / row.all);

// รายได้ครัวเรือนทั่วประเทศ บาท/เดือน เป็นบาทของปีนั้น
export function nationalIncome(era, seed, year) {
  const rows = era.birth.income;
  const first = rows[0], last = rows[rows.length - 1];
  if (year < first.y) return first.all / (1 + era.birth.backcastGrowth / 100) ** (first.y - year);
  if (year > last.y) return last.all * priceRatio(era, seed, last.y, year);
  return Math.exp(between(rows, year, (row) => Math.log(row.all)));
}

// เส้นแบ่งฐานะเป็นระดับประเทศ ภาคที่รายได้ต่ำกว่าจึงมีสัดส่วนคนจนมากกว่า (lognormal เลื่อนค่าเฉลี่ย ความกว้างเท่ากัน)
// คืนโอกาสของแต่ละฐานะ และรายได้เฉลี่ยของฐานะนั้นเป็นกี่เท่าของค่าเฉลี่ยทั้งประเทศ
export function classOdds(birth, ratio) {
  const { sigma, cutZ } = birth;
  const shift = Math.log(ratio) / sigma;
  const edges = [-Infinity, ...cutZ, Infinity];
  const out = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const p = normCdf(edges[i + 1] - shift) - normCdf(edges[i] - shift);
    const m = normCdf(edges[i + 1] - shift - sigma) - normCdf(edges[i] - shift - sigma);
    out.push({ p, factor: (ratio * m) / p });
  }
  return out;
}

// ชื่อเล่นตอนเกิด (B27) ตามเพศ × ยุคปีเกิด · stream แยก ไม่ดึงเลขสุ่มของโลก ผลเกมจึงเหมือนก่อนมีชื่อ
export const nameEra = (names, birthYear) => names.eras.find((e) => birthYear >= e.from && birthYear <= e.to) ?? names.eras.at(-1);

// taken = ชื่อรุ่นก่อนในตระกูล ให้ผังตระกูลแยกคนได้ · ยุคนั้นใช้ครบทุกชื่อแล้วค่อยยอมซ้ำ
export function pickName(seed, sex, birthYear, names, taken = []) {
  const pool = nameEra(names, birthYear)[sex];
  const free = pool.filter((n) => !taken.includes(n));
  return makeRng(seed ^ 0x510e527f).pick(free.length ? free : pool);
}
