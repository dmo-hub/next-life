// ข้อมูลยุคในรูปที่แกนเกมใช้ (สร้างจาก data/*.json โดย src/node/load.mjs) — ฟังก์ชันล้วน ไม่แตะ DOM/ไฟล์
export const MAX_AGE = 120;

const at = (series, year) => series.v[Math.max(0, Math.min(series.v.length - 1, year - series.from))];

export function pickBirthYear(rng, era) {
  const w = era.births.w;
  let r = rng.next() * w.reduce((s, x) => s + x, 0);
  for (let i = 0; i < w.length; i++) {
    r -= w[i];
    if (r < 0) return era.births.from + i;
  }
  return era.births.from + w.length - 1;
}

// Brass logit: Y(x) = alpha + beta·Ys(x) — ปรับรูปเส้นการตายของตารางมาตรฐานด้วย 2 ค่า
const logit = (l) => 0.5 * Math.log((1 - l) / l);
export function brassLx(stdLx, alpha, beta) {
  return stdLx.map((l, x) => (x === 0 ? 1 : l <= 0 ? 0 : 1 / (1 + Math.exp(2 * (alpha + beta * logit(l))))));
}

// อายุคาดเมื่อแรกเกิดแบบเดียวกับที่ World Bank รายงาน (ปีแรกอยู่รอดเฉลี่ยไม่ถึงครึ่งปี)
export function e0FromLx(lx) {
  const q0 = 1 - lx[1];
  const a0 = q0 >= 0.1 ? 0.33 : 0.05 + 3 * q0;
  let e = lx[1] + a0 * q0;
  for (let x = 1; x < lx.length - 1; x++) e += (lx[x] + lx[x + 1]) / 2;
  return e;
}

// ตารางมาตรฐานล่าสุดที่ปีไม่เกิน year (ตารางไม่ได้มีทุกปี เช่น HLD 2503 แล้วข้ามไป WHO 2543) · ก่อนตารางแรกใช้ตารางแรก
export function stdFor(std, year) {
  let i = 0;
  while (i + 1 < std.ys.length && std.ys[i + 1] <= year) i++;
  return std.lx[i];
}

const qCache = new WeakMap();
// โอกาสตายภายในปีที่อายุ age ตามตารางชีพของปีปฏิทิน year (ชีวิตหนึ่งเดินผ่านตารางของแต่ละปีไปตามแนวทแยง)
export function qx(era, sex, year, age) {
  if (age >= MAX_AGE) return 1;
  let bySex = qCache.get(era);
  if (!bySex) qCache.set(era, (bySex = {}));
  const m = era.mort;
  const y = Math.max(m.from, Math.min(m.from + m.fit[sex].a.length - 1, year));
  const key = `${sex}:${y}`;
  let q = bySex[key];
  if (!q) {
    const i = y - m.from;
    const lx = brassLx(stdFor(m.std[sex], y), m.fit[sex].a[i], m.fit[sex].b[i]);
    q = lx.slice(0, -1).map((l, x) => (l > 0 ? 1 - lx[x + 1] / l : 1));
    bySex[key] = q;
  }
  return q[age];
}

// โอกาสตายของชีวิตหนึ่งในปีเกม year — อ่านตารางชีพของปีต้นแบบ ปีเดียวกับที่การเงินอ่าน
export const lifeQx = (era, seed, sex, year, age) => qx(era, sex, protoYear(era, seed, year), age);

// อายุตอนตายที่คาดได้จากข้อมูลล้วน (นับปีเต็มแบบเดียวกับการ์ด "ตายอายุ X") ใช้เป็นเป้าของ harness
// เดินตามปีต้นแบบของชีวิตนั้นเอง — ปีสลับคนละชุดต่อ seed เป้าจึงต้องคิดรายชีวิต
export function expectedDeathAge(era, sex, birthYear, seed) {
  let alive = 1;
  let sum = 0;
  for (let a = 0; a < MAX_AGE; a++) {
    alive *= 1 - lifeQx(era, seed, sex, birthYear + a, a);
    sum += alive;
  }
  return sum;
}

export const periodE0 = (era, sex, year) => at(era.mort.e0[sex], year);
export const infantMortality = (era, sex, year) => at(era.mort.imr[sex], year);

// ทุกปีในเกมยืมทั้งปีจากปีจริงปีเดียว (ปีต้นแบบ) สุ่มรายปีอิสระ แล้วทุกชุด (เงินเฟ้อ หุ้น ทอง ดอกเบี้ย ค่าแรง การตาย)
// อ่านค่าของปีนั้นพร้อมกัน — ผู้เล่นเดาไม่ได้ว่าวิกฤตมาเมื่อไร แต่ความสัมพันธ์ข้ามชุดของปีจริงยังอยู่
// hash ของ seed กับปี ชีวิตเดิมได้ชุดปีเดิม และไม่กินลำดับสุ่มของโลก
export function protoYear(era, seed, year) {
  // ปีหลังข้อมูลจริงยืมเฉพาะช่วงกรอบเป้าเงินเฟ้อ (recent) — ยืมทั้งช่วงแล้วคนตายปลายศตวรรษเจอราคาพอง ~25 เท่า
  const { to } = era.future;
  const from = year > to ? era.future.recent : era.future.from;
  let h = Math.imul((seed ^ Math.imul(year, 0x9e3779b1)) >>> 0, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  return from + ((h >>> 0) % (to - from + 1));
}

// ช่วงปีต้นแบบ (era.future) อยู่ในข้อมูลจริงของทุกชุด — load.mjs ตรวจไว้
export const seriesYear = (era, seed, series, year) => protoYear(era, seed, year);
export const seriesAt = (era, seed, series, year) => at(series, seriesYear(era, seed, series, year));

export function inflationRate(era, seed, year) {
  return seriesAt(era, seed, era.cpi, year);
}

export const lastCpiYear = (era) => era.cpi.from + era.cpi.v.length - 1;

// ราคาของปี toYear เป็นกี่เท่าของปี fromYear
export function priceRatio(era, seed, fromYear, toYear) {
  let r = 1;
  for (let y = fromYear + 1; y <= toYear; y++) r *= 1 + inflationRate(era, seed, y) / 100;
  return r;
}

// ค่าความชุกพฤติกรรม (%) ปีระหว่างจุดใช้เส้นตรง นอกช่วงใช้จุดที่ใกล้สุด
export function habitRate(era, kind, sex, year) {
  const pts = era.habits[kind]?.[sex] ?? era.habits[kind]?.all;
  if (!pts) throw new Error(`ไม่มีข้อมูลพฤติกรรม ${kind}`);
  if (year <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [y1, v1] = pts[i];
    if (year <= y1) {
      const [y0, v0] = pts[i - 1];
      return v0 + ((v1 - v0) * (year - y0)) / (y1 - y0);
    }
  }
  return pts[pts.length - 1][1];
}

// เหตุการณ์บ้านเมืองเกิดในปีเกมที่ยืมปีเริ่มของเหตุการณ์มา — วิกฤตที่เห็นจึงตรงกับเงินที่เสียปีนั้น
export const eraEventsAt = (era, seed, year) => {
  const p = protoYear(era, seed, year);
  return era.events.filter((e) => e.from === p);
};
