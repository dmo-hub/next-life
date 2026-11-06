(() => {
const APP_VERSION = "v0.6.102";
const APP_BUILD = "2026-11-06";
const RELEASE_NOTES = [{"v":"v0.6.102","items":["ต่างโลกเปลี่ยนโฟกัสได้จากแผงตัวฉัน ไม่มีการ์ดถามโฟกัสคั่นระหว่างช่วงวัยแล้ว","หัวกำลังทำเพิ่มสายนายร้อย และหน้าอธิบายโฟกัส"]},{"v":"v0.6.101","items":["การ์ดทั้งหมดกับเฉลยรวมเป็นหน้าเดียว กด ดูผล ที่ใบไหนก็พลิกดูผลของใบนั้น ใบอื่นยังไม่เปิด…"]},{"v":"v0.6.100","items":["ปรโลกมีแท็บโฟกัสแล้ว ดูได้ว่าชาติที่แล้วทุ่มเทเรื่องไหนมากสุด (ดูอย่างเดียว)…"]},{"v":"v0.6.99","items":["การ์ดตายเปลี่ยนเป็นกรอบเส้นคู่ มีลายกนกบนล่างและตราอาลัยสีแดงมุมขวาบน"]},{"v":"v0.6.98","items":["ห้องผู้พัฒนาและแผนที่ใช้แถบเมนูเดียวกับหน้าเว็บอื่น กลับหน้าเกมหรือไปหน้าอื่นได้จากแถบบน…"]},{"v":"v0.6.97","items":["การ์ดรายปีมีมุมกนกทองสี่มุม และป้ายเลขบนปุ่มตัวเลือกเป็นสี่เหลี่ยม","ป้ายผลบนปุ่มตัวเลือกไม่มีพื้นแล้ว ตัวใหญ่ขึ้นเล็กน้อย","แท็บชั้นสมุดมีไอคอน แท็บที่เปิดมีแถบสีด้านบน และไม่แสดงตัวเลขบนแท็บแล้ว"]},{"v":"v0.6.96","items":["หน้าเอกสารทั้งเว็บจัดใหม่ อ่านกว้างขึ้น ตารางมีเส้นทุกช่อง กล่องเตือนเป็นกรอบ…","หัวกำลังทำเพิ่มข้อห้ามประจำตระกูล หมวดบาปเพิ่ม เรื่องไม่ซ้ำถี่ และอาชีพสายยศ"]},{"v":"v0.6.95","items":["ห้องผู้พัฒนามีหน้าลองหน้าตาห้องกับแผนที่แบบใหม่ ไว้เลือกก่อนลงจริง"]},{"v":"v0.6.94","items":["หัวกำลังทำเพิ่มแท็บโฟกัสทุกโลก โฟกัสของปรโลกแบบใหม่ เกตที่แตกตามมา และรางวัลตามขั้นนักล่า"]},{"v":"v0.6.93","items":["เมนูชาติไทยมีแท็บโฟกัสแยกระหว่างตัวฉันกับครอบครัว เปลี่ยนเรื่องที่ทุ่มเทได้ในแท็บนี้…","ห้องผู้พัฒนารวมแผนที่ทุกแบบไว้หน้าเดียว มีปุ่มสลับแผนที่"]},{"v":"v0.6.92","items":["ห้องผู้พัฒนามีหน้าลองการ์ดรายปี ปุ่มตัวเลือก และแถบค่าแบบใหม่ ไว้เลือกก่อนลงจริง","ห้องผู้พัฒนามีหน้าลองป้ายผลบนการ์ดแบบใหม่ ไว้เลือกก่อนลงจริง","ห้องผู้พัฒนาปรับหน้าลองแท็บในสมุด เพิ่มแบบ 3 ช่องทุกจอไว้เลือกก่อนลงจริง"]},{"v":"v0.6.91","items":["ฉายาและสกิลใหม่ขึ้นเป็นตราแปดเหลี่ยม ชื่อฉายาใช้ฟอนต์ Maitree ตัวใหญ่ขึ้น อ่านง่ายขึ้น"]},{"v":"v0.6.90","items":["ห้องผู้พัฒนามีหน้าลองเลย์เอาต์หน้าเอกสาร ไว้เลือกก่อนลงจริง"]},{"v":"v0.6.89","items":["แถบบนการ์ดเตี้ยลง ฐานะกับเงินสดย้ายมาอยู่ใต้อายุ","ค่าทั้ง 4 มีแถบต่อท้ายตัวเลข และไอคอนใหญ่ขึ้น","เงินติดลบหรือมีกู้ คำเตือนเป็นสีแดง ส่วนตัวเลขยังอ่านง่ายเหมือนเดิม"]},{"v":"v0.6.88","items":["แผงตัวฉันรวมเงินไว้แล้ว ปุ่มเงินออกจากเมนูชาติไทย","คำอธิบายค่าสถานะพับเก็บได้ เกมจำว่าเปิดหรือปิดไว้","แผงตัวฉันมีประวัติงานเรียงตามช่วงอายุ เซฟเก่าปีที่ทำก่อนอัปเดตขึ้นเป็นจำนวนปีรวม"]},{"v":"v0.6.87","items":["ห้องผู้พัฒนามีหน้าลองตราเหรียญฉายาแบบใหม่ เทียบทรงตรา 4 แบบ ฟอนต์ชื่อ และสีเงินทอง…"]},{"v":"v0.6.86","items":["ห้องผู้พัฒนามีหน้าลองการ์ดตายแบบหนังสืองานศพ เลือกกรอบ ลาย และตราอาลัยได้ 3…","ห้องผู้พัฒนามีหน้าลองปุ่มดูผลและกล่องเฉลยของหน้าการ์ดรวม ไว้เลือกก่อนลงจริง"]},{"v":"v0.6.85","items":["ห้องผู้พัฒนามีหน้าลองแถบสถานะบนการ์ดแบบใหม่ ทั้งแถวเงิน ค่าสถานะ 4 ตัว ไอคอน…"]},{"v":"v0.6.84","items":["ทั้งเว็บและหน้าเล่นเปลี่ยนเป็นชุดสีคราม-ทอง ตัวหัว Maitree ตัวเนื้อ Sarabun","หัวเว็บแบบใหม่ และหน้าแรกเหลือหัวเต็มจอกับปุ่มเริ่มเล่น","ลิงก์ในเนื้อความขีดเส้นใต้ อ่านง่ายขึ้น"]},{"v":"v0.6.83","items":["ห้องผู้พัฒนามีหน้าลองแผงตัวฉันแบบใหม่ รวมเงินเข้าแผงตัวฉัน ปุ่มพับคำอธิบายค่าสถานะ…"]}];
const CONTENT = self.NL_CONTENT;
// mulberry32: เล็ก เร็ว และให้ลำดับเดิมทุกครั้งเมื่อ seed เท่ากัน (แทน Math.random ที่ตั้ง seed ไม่ได้)
function makeRng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    // สถานะภายใน — เซฟ (B128) เก็บเลขนี้แล้วคืนด้วย makeRng(state) เดินต่อจากจุดเดิมพอดี (ค่าเริ่ม a = seed)
    get state() {
      return a;
    },
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
  };
}

function mixSeed(seed, i) {
  return (Math.imul(seed >>> 0, 1000003) + Math.imul(i + 1, 2654435761)) >>> 0;
}

// ข้อมูลยุคในรูปที่แกนเกมใช้ (สร้างจาก data/*.json โดย src/node/load.mjs) — ฟังก์ชันล้วน ไม่แตะ DOM/ไฟล์
const MAX_AGE = 120;

const at = (series, year) => series.v[Math.max(0, Math.min(series.v.length - 1, year - series.from))];

function pickBirthYear(rng, era) {
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
function brassLx(stdLx, alpha, beta) {
  return stdLx.map((l, x) => (x === 0 ? 1 : l <= 0 ? 0 : 1 / (1 + Math.exp(2 * (alpha + beta * logit(l))))));
}

// อายุคาดเมื่อแรกเกิดแบบเดียวกับที่ World Bank รายงาน (ปีแรกอยู่รอดเฉลี่ยไม่ถึงครึ่งปี)
function e0FromLx(lx) {
  const q0 = 1 - lx[1];
  const a0 = q0 >= 0.1 ? 0.33 : 0.05 + 3 * q0;
  let e = lx[1] + a0 * q0;
  for (let x = 1; x < lx.length - 1; x++) e += (lx[x] + lx[x + 1]) / 2;
  return e;
}

// ตารางมาตรฐานล่าสุดที่ปีไม่เกิน year (ตารางไม่ได้มีทุกปี เช่น HLD 2503 แล้วข้ามไป WHO 2543) · ก่อนตารางแรกใช้ตารางแรก
function stdFor(std, year) {
  let i = 0;
  while (i + 1 < std.ys.length && std.ys[i + 1] <= year) i++;
  return std.lx[i];
}

const qCache = new WeakMap();
// โอกาสตายภายในปีที่อายุ age ตามตารางชีพของปีปฏิทิน year (ชีวิตหนึ่งเดินผ่านตารางของแต่ละปีไปตามแนวทแยง)
function qx(era, sex, year, age) {
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
const lifeQx = (era, seed, sex, year, age) => qx(era, sex, protoYear(era, seed, year), age);

// อายุตอนตายที่คาดได้จากข้อมูลล้วน (นับปีเต็มแบบเดียวกับการ์ด "ตายอายุ X") ใช้เป็นเป้าของ harness
// เดินตามปีต้นแบบของชีวิตนั้นเอง — ปีสลับคนละชุดต่อ seed เป้าจึงต้องคิดรายชีวิต
function expectedDeathAge(era, sex, birthYear, seed) {
  let alive = 1;
  let sum = 0;
  for (let a = 0; a < MAX_AGE; a++) {
    alive *= 1 - lifeQx(era, seed, sex, birthYear + a, a);
    sum += alive;
  }
  return sum;
}

const periodE0 = (era, sex, year) => at(era.mort.e0[sex], year);
const infantMortality = (era, sex, year) => at(era.mort.imr[sex], year);

// ทุกปีในเกมยืมทั้งปีจากปีจริงปีเดียว (ปีต้นแบบ) สุ่มรายปีอิสระ แล้วทุกชุด (เงินเฟ้อ หุ้น ทอง ดอกเบี้ย ค่าแรง การตาย)
// อ่านค่าของปีนั้นพร้อมกัน — ผู้เล่นเดาไม่ได้ว่าวิกฤตมาเมื่อไร แต่ความสัมพันธ์ข้ามชุดของปีจริงยังอยู่
// hash ของ seed กับปี ชีวิตเดิมได้ชุดปีเดิม และไม่กินลำดับสุ่มของโลก
function protoYear(era, seed, year) {
  // ปีหลังข้อมูลจริงยืมเฉพาะช่วงกรอบเป้าเงินเฟ้อ (recent) — ยืมทั้งช่วงแล้วคนตายปลายศตวรรษเจอราคาพอง ~25 เท่า
  const { to } = era.future;
  const from = year > to ? era.future.recent : era.future.from;
  let h = Math.imul((seed ^ Math.imul(year, 0x9e3779b1)) >>> 0, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  return from + ((h >>> 0) % (to - from + 1));
}

// ช่วงปีต้นแบบ (era.future) อยู่ในข้อมูลจริงของทุกชุด — load.mjs ตรวจไว้
const seriesYear = (era, seed, series, year) => protoYear(era, seed, year);
const seriesAt = (era, seed, series, year) => at(series, seriesYear(era, seed, series, year));

function inflationRate(era, seed, year) {
  return seriesAt(era, seed, era.cpi, year);
}

const lastCpiYear = (era) => era.cpi.from + era.cpi.v.length - 1;

// ราคาของปี toYear เป็นกี่เท่าของปี fromYear
function priceRatio(era, seed, fromYear, toYear) {
  let r = 1;
  for (let y = fromYear + 1; y <= toYear; y++) r *= 1 + inflationRate(era, seed, y) / 100;
  return r;
}

// ค่าความชุกพฤติกรรม (%) ปีระหว่างจุดใช้เส้นตรง นอกช่วงใช้จุดที่ใกล้สุด
function habitRate(era, kind, sex, year) {
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
const eraEventsAt = (era, seed, year) => {
  const p = protoYear(era, seed, year);
  return era.events.filter((e) => e.from === p);
};

// จุดเกิด (ใบ 01 · ใบ 03): ภาคตามประชากรจริง → ฐานะตามการกระจายรายได้ของภาคนั้นในปีเกิด → รายได้ตามปีที่ใช้ชีวิต


// CDF ปกติมาตรฐาน (Abramowitz–Stegun 7.1.26 · คลาดไม่เกิน 1.5e-7)
function normCdf(z) {
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(z * z) / 2);
  return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
}

function pickRegion(rng, birth) {
  let r = rng.next() * birth.regions.reduce((s, x) => s + x.w, 0);
  for (const x of birth.regions) {
    r -= x.w;
    if (r < 0) return x;
  }
  return birth.regions[birth.regions.length - 1];
}

// จังหวัดในภาคที่ได้ ตามประชากร (B34) — ผู้เรียกส่ง rng แยกเสมอ ภาคและทุกผลที่คิดจากภาคจึงไม่ขยับ
function pickProvince(rng, birth, regionName) {
  const list = birth.regions.find((x) => x.name === regionName).provinces;
  let r = rng.next() * list.reduce((s, x) => s + x.w, 0);
  for (const x of list) {
    r -= x.w;
    if (r < 0) return x.name;
  }
  return list[list.length - 1].name;
}

// ชื่อจังหวัดบนจอ: กรุงเทพฯ ไม่ใช่ "จังหวัด" จึงไม่นำหน้า จ.
const placeName = (province) => (province === 'กรุงเทพมหานคร' ? province : `จ.${province}`);

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
const regionRatio = (birth, ses, year) => between(birth.income, year, (row) => row[ses] / row.all);

// รายได้ครัวเรือนทั่วประเทศ บาท/เดือน เป็นบาทของปีนั้น
function nationalIncome(era, seed, year) {
  const rows = era.birth.income;
  const first = rows[0], last = rows[rows.length - 1];
  if (year < first.y) return first.all / (1 + era.birth.backcastGrowth / 100) ** (first.y - year);
  if (year > last.y) return last.all * priceRatio(era, seed, last.y, year);
  return Math.exp(between(rows, year, (row) => Math.log(row.all)));
}

// เส้นแบ่งฐานะเป็นระดับประเทศ ภาคที่รายได้ต่ำกว่าจึงมีสัดส่วนคนจนมากกว่า (lognormal เลื่อนค่าเฉลี่ย ความกว้างเท่ากัน)
// คืนโอกาสของแต่ละฐานะ และรายได้เฉลี่ยของฐานะนั้นเป็นกี่เท่าของค่าเฉลี่ยทั้งประเทศ
function classOdds(birth, ratio) {
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
const nameEra = (names, birthYear) => names.eras.find((e) => birthYear >= e.from && birthYear <= e.to) ?? names.eras.at(-1);

// taken = ชื่อรุ่นก่อนในตระกูล ให้ผังตระกูลแยกคนได้ · ยุคนั้นใช้ครบทุกชื่อแล้วค่อยยอมซ้ำ
function pickName(seed, sex, birthYear, names, taken = []) {
  const pool = nameEra(names, birthYear)[sex];
  const free = pool.filter((n) => !taken.includes(n));
  return makeRng(seed ^ 0x510e527f).pick(free.length ? free : pool);
}

// ชื่อจริง (names-fun): ฉากจริงจังเรียกด้วยชื่อนี้ ชื่อเล่นขำจึงไม่ไปอยู่บนหนังสืองานศพ · stream แยกจากชื่อเล่น — ชื่อเล่นเดิมของทุก seed ไม่เปลี่ยนเพราะชื่อจริง
const pickRealName = (seed, sex, birthYear, names) => makeRng(seed ^ 0x2c4e1a77).pick(nameEra(names, birthYear).จริง[sex]);

// ครอบครัวเป็นคนจริง (B36a): คู่ครอง · ลูก · หลาน มีชื่อ เพศ ปีเกิด ยังอยู่/จากไป · พ่อแม่อยู่ใน st.parents แบบเดิม
// ทุกสุ่มของสมาชิกใหม่มาจาก st.kinRng (stream แยกจากโลกและจาก famRng ของพ่อแม่) — ชีวิตที่ไม่มีครอบครัวของตัวเองไม่ดึงเลขนี้เลย
// ชะตาการตายของพ่อแม่และลำดับสุ่มของโลกจึงเหมือนก่อนมีระบบนี้ทุกหลัก



const KIN_ROLES = ['spouse', 'child', 'grandchild'];
const FAMILY_ROLE_NAMES = { parent: 'พ่อแม่', spouse: 'คู่ครอง', child: 'ลูก', grandchild: 'หลาน', pet: 'สัตว์คู่ใจ', herd: 'ฝูงสัตว์', peer: 'เพื่อนรุ่น' };
// ธงเดิมที่เนื้อหาอ่านอยู่ ↔ บทบาทที่ธงนั้นหมายถึง · ตั้งธงจากตัวเลือก = มีสมาชิกคนนั้นเพิ่มขึ้นจริง
const KIN_FLAG_ROLE = { married: 'spouse', has_kids: 'child', raised_grandkids: 'grandchild' };
// ลูกที่โตแล้วมีหลานให้เองปีละโอกาสนี้ ช่วงอายุนี้ ไม่เกินจำนวนนี้ต่อคน — ค่าตั้งของเกม (ไม่มีข้อมูลเจริญพันธุ์รายยุคในชุดข้อมูล)
const GRANDKID = { from: 22, to: 40, chance: 0.08, max: 3 };
// คู่ครองอายุห่างจากเราได้เท่านี้ (ปีเกิด) · ค่าตั้งของเกม
const KIN_SPOUSE_GAP = [-5, 5];
// pet · herd (B44) · peer (B43) เป็นสมาชิกได้ แต่ไม่ใช่ทายาท ไม่ตั้งธง ไม่มีหลาน — สัตว์ตายตามอายุขัยของชนิด เพื่อนรุ่นตายตามตารางชีพแบบคน
const KIN_EXTRA_ROLES = ['pet', 'herd', 'peer'];
// คนในบ้าน = คนที่การ์ดครอบครัวดูแลถึง และคนที่นับว่า "ยังมีใคร" ตอนแก่ · เพื่อนรุ่นไม่นับ
const KIN_HOUSEHOLD = ['spouse', 'child', 'grandchild', 'pet'];

// ความผูกพันรายคน 0–100 (B36a2): ปีที่ไม่ได้ดูแลลดเอง 1 แต่การลดเองไม่พาต่ำกว่า floor — ผลร้ายจากเนื้อหาพาต่ำกว่าได้
const BOND_START = { parent: 70, spouse: 70, child: 75, grandchild: 60, pet: 65, herd: 50, peer: 50 };
const BOND_FLOOR = 38;
const BOND_LEVELS = [[80, 'ผูกพัน'], [60, 'สนิท'], [40, 'คุ้นเคย'], [20, 'เฉย ๆ'], [0, 'ห่างเหิน']];
// การ์ดหมวด family ที่ตัวเลือกให้ความสัมพันธ์บวก = ดูแลคนในบ้านปีนั้น · bond ขึ้นเท่านี้ต่อระดับความสัมพันธ์ (1–3)
const BOND_CARE_PER_REL = 2;
// ญาติช่วยตอนเจอผลร้าย: คนที่ผูกพันตั้งแต่ from ขึ้นไป มีโอกาส (bond − base) / span ช่วยให้เสียหายเหลือ scale
const KIN_AID = { from: 60, base: 50, span: 120, scale: 0.5, roles: ['spouse', 'child', 'grandchild'] };
// แก่แล้วไม่เหลือคนในบ้านที่ยังอยู่ (คู่ ลูก หลาน สัตว์คู่ใจ) = เสียความสุข/สุขภาพต่อปี · ไม่ดึงเลขสุ่ม — ค่าตั้งของเกม (B167)
const KIN_LONELY = { from: 65, happiness: 2, health: 0.3 };
// เราดูแลพ่อแม่แบบไหน (B167) — ตัวเลือกการ์ดดูแลพ่อแม่ติด filial · จดเฉพาะชีวิตนี้ ไม่ส่งต่อรุ่น
// way = วิธีครั้งล่าสุด (การ์ดชราให้ลูกทำแบบเดียวกัน) · score = บุญดูแลพ่อแม่ − บาปทำร้ายผู้ใหญ่ ตามระดับของตัวเลือก
// ถึงอายุ at ลูกที่ยังอยู่ได้ bond ± step × score (ไม่เกิน cap) — ลูกที่เห็นเราดูแลพ่อแม่ผูกพันกับเรามากขึ้น · kinAid ทำงานต่อเอง
const FILIAL_WAYS = ['self', 'share', 'hire', 'home', 'away'];
const FILIAL = { at: 60, step: 3, cap: 5 };

// สัตว์ (B44) — ค่าตั้งของเกม · อายุขัยตามชนิดโดยประมาณ · เงินต่อปีเป็นสัดส่วนของเงินเก็บรายปีของชีวิตนั้น
// (บาทคงที่บีบส่วนต่างทรัพย์ของชั้นล่างที่ห่างกันน้อยจนลำดับพลิกในด่าน finance)
// pet = สัตว์คู่ใจ ทีละ 1 ตัว มีชื่อ ชนิดต่างกันให้ค่าสถานะต่างกัน (gives ต่อปี) · cost = ค่าข้าว ยา วัคซีนพื้นฐาน
const PET_KINDS = {
  หมา: { life: [10, 15], cost: 0.06, gives: { health: 0.2, relations: 0.3 }, names: ['ดำ', 'ด่าง', 'ขาว', 'บุญมี', 'ตูบ', 'โต้ง', 'มะลิ', 'ถุงทอง', 'แดง', 'ปุยฝ้าย'] },
  แมว: { life: [12, 18], cost: 0.05, gives: { happiness: 1.5 }, names: ['ส้ม', 'มอม', 'ขาวมณี', 'ลายเสือ', 'ทองคำ', 'เหมียว', 'สีสวาด', 'ข้าวตัง'] },
  นกขุนทอง: { life: [10, 20], cost: 0.02, gives: { knowledge: 0.5, happiness: 0.5 }, names: ['แก้ว', 'ขุนทอง', 'เจ๊ก', 'ดำดี', 'สาลี'] },
  หมาพันธุ์: { life: [10, 14], cost: 0.25, gives: { health: 0.1, network: 0.3, happiness: 0.5 }, names: ['ลัคกี้', 'โมจิ', 'บราวนี่', 'ช็อกโก้', 'คุกกี้', 'ลาเต้'] },
  แมวพันธุ์: { life: [12, 16], cost: 0.2, gives: { happiness: 1.5, network: 0.2 }, names: ['มิลค์', 'ไข่มุก', 'ซูชิ', 'ลูน่า', 'โอปอ'] },
};
// herd = ฝูงที่เป็นทรัพย์สิน/อาชีพ (ไข่ นม แรงไถ ขายลูก) นับเป็นหน่วยเดียว ไม่มีชื่อ ไม่ให้ค่าสถานะแบบคู่ใจ · net = เงินสุทธิต่อปีหลังค่าอาหาร
const HERD_KINDS = {
  ไก่: { life: [5, 10], net: 0.04 },
  วัว: { life: [12, 20], net: 0.1 },
  ควาย: { life: [15, 25], net: 0.06 },
  ปลา: { life: [3, 8], net: 0.015 },
};
// ความสุขที่เสียไปตอนคู่ใจตายตามอายุขัย (ตายจากการ์ดป่วย/หาย การ์ดใบนั้นหักเอง)
const PET_GRIEF = 6;
// ติดบ้านตอนเกิด: บ้านฐานะดี (ชั้น ≥ richFrom) · บ้านในเมือง (ภาค city) · บ้านนอก — [โอกาส, ชนิด] คู่ใจกับฝูงสุ่มแยกกัน ได้ทั้งคู่ก็ได้
const PET_AT_BIRTH = {
  richFrom: 7,
  city: 'กรุงเทพฯ และปริมณฑล',
  rich: { pet: [0.4, ['หมาพันธุ์', 'แมวพันธุ์']], herd: [0, []] },
  town: { pet: [0.3, ['แมว', 'หมา', 'นกขุนทอง']], herd: [0.1, ['ปลา']] },
  rural: { pet: [0.35, ['หมา', 'แมว', 'นกขุนทอง']], herd: [0.4, ['ไก่', 'วัว', 'ควาย']] },
};
// การ์ดเรียกสัตว์แบบคนเลี้ยงเรียก (เจ้าดำ) · มรณบัตรบอกชนิดด้วย (หมาชื่อดำ) · ฝูงเรียกตามชนิด
const petCall = (m) => (m.role === 'herd' ? `ฝูง${m.kind}` : m.name ? `เจ้า${m.name}` : `${m.kind}ที่เลี้ยงไว้`);
const petLabel = (m) => (m.role === 'herd' ? `ฝูง${m.kind}` : m.name ? `${m.kind}ชื่อ${m.name}` : m.kind);
const petName = (st, kind, id) => {
  const names = PET_KINDS[kind]?.names;
  return names ? names[makeRng(mixSeed(st.seed, 0x9e7 + id)).int(0, names.length - 1)] : null;
};
const ANIMAL = ['pet', 'herd'];

const bondLabel = (b) => BOND_LEVELS.find(([min]) => b >= min)[1];
const bondClamp = (b) => Math.max(0, Math.min(100, b));

const kinOtherSex = (sex) => (sex === 'ชาย' ? 'หญิง' : 'ชาย');
const kinInRange = (v, r) => !r || (v >= r[0] && v <= r[1]);
const kinYearOf = (st) => st.birthYear + st.age;
const memberAge = (st, m, year = kinYearOf(st)) => (m.alive ? year - m.born : m.diedAge);

function newKin(seed) {
  return { kin: [], kinRng: makeRng(seed ^ 0x510e527f), kinSeq: 0, kinCared: false, kinFocus: {}, kinLoss: [] };
}

// ชื่อทุกคนในบ้าน (รวมรุ่นก่อนในผังตระกูล) — ชื่อใหม่เลี่ยงชุดนี้
const kinTakenNames = (st) => [st.name, ...st.parents.map((p) => p.name), ...st.kin.map((m) => m.name), ...(st.lineage ?? []).map((l) => l.name)].filter(Boolean);

// พ่อแม่ที่ยังไม่มีชื่อ (ชีวิตแรก/ทางเกิดใหม่) ได้ชื่อจาก seed ตามยุคปีเกิดของเขา — ไม่ดึงเลขสุ่ม ไม่แตะชื่อผู้เล่น
function nameParents(st) {
  st.parents.forEach((p, i) => {
    p.name ??= pickName(mixSeed(st.seed, 0x9a01 + i), p.sex, st.birthYear - p.age, st.content.era.names, kinTakenNames(st));
    p.bond ??= BOND_START.parent;
  });
}

// extra: of (หลาน = id ลูกที่เป็นพ่อแม่) · สัตว์เลี้ยง kind (ชนิด) + life [จาก, ถึง] (อายุขัยของชนิด) + name? (เนื้อหาตั้งให้ · ไม่ตั้ง = เรียกตามชนิด)
function addMember(st, role, extra = {}) {
  const year = kinYearOf(st);
  const id = ++st.kinSeq;
  // สัตว์ติดบ้าน/ส่งต่อทายาทส่ง sex born maxAge มาเอง — ไม่ดึง kinRng ลำดับสุ่มของคนในบ้านจึงไม่ขยับ
  const sex = extra.sex ?? (role === 'spouse' ? kinOtherSex(st.sex) : st.kinRng.next() < 0.5 ? 'ชาย' : 'หญิง');
  const born = extra.born ?? (role === 'spouse' ? st.birthYear + st.kinRng.int(...KIN_SPOUSE_GAP) : role === 'peer' ? st.birthYear : year);
  // ชื่อคู่ใจสุ่มจาก seed+id ไม่ดึงเลข · ฝูงไม่มีชื่อ
  const name = role === 'herd' ? null : role === 'pet' ? (extra.name ?? petName(st, extra.kind, id)) : pickName(mixSeed(st.seed, 0x4b1d + id), sex, born, st.content.era.names, kinTakenNames(st));
  const m = { id, role, sex, born, alive: true, diedAge: null, name, bond: extra.bond ?? BOND_START[role] };
  if (ANIMAL.includes(role)) {
    m.kind = extra.kind;
    m.maxAge = extra.maxAge ?? st.kinRng.int(...extra.life);
  }
  if (role === 'child') m.order = st.kin.filter((x) => x.role === 'child').length + 1;
  if (role === 'grandchild') {
    // หลานจากเนื้อหา (รับหลานมาเลี้ยง) เป็นลูกของลูกที่ยังอยู่ ถ้ามี — ไม่มีลูกเหลือ = ไม่ระบุพ่อแม่
    const kids = st.kin.filter((x) => x.role === 'child' && x.alive);
    m.of = extra.of ?? (kids.length ? kids[st.kinRng.int(0, kids.length - 1)].id : null);
  }
  st.kin.push(m);
  // คนที่เพิ่งเข้าบ้านในการ์ดนี้คือคนที่ข้อความพูดถึง ("ได้ลูกชื่อ {ชื่อลูก}")
  if (st.kinFocus) st.kinFocus[role] = id;
  return m;
}

const livingOf = (st, role) => st.kin.filter((m) => m.role === role && m.alive && !m.left);
// ลูกที่ยังมีชีวิต นับแบบเดียวกับที่ afterlife.mjs หารมรดก (ย้ายออกไปแล้วยังเป็นทายาท) · ไม่มีระบบครอบครัว = null
const livingChildren = (st) => (st.kin ? st.kin.filter((m) => m.role === 'child' && m.alive).length : null);

// คนที่การ์ดเรียกชื่อ = คนที่ผลการ์ดไปลง ต้องเป็นคนเดียวกันตลอดใบ (ข้อความ · ตัวเลือก · ผลสุ่ม) — สุ่มจาก kinRng ตอนการ์ดขึ้น
// ทอยเฉพาะบทบาทที่มีคนให้เลือก ≥2 — ชีวิตที่ไม่มีครอบครัว/มีคนเดียวไม่ดึงเลข
function pickFocus(st) {
  st.kinFocus = {};
  for (const role of ['spouse', 'child', 'grandchild', 'pet', 'herd']) {
    const live = livingOf(st, role);
    if (live.length) st.kinFocus[role] = (live.length > 1 ? live[st.kinRng.int(0, live.length - 1)] : live[0]).id;
  }
}
// คนเป้าของการ์ดใบปัจจุบัน (ยังคืนคนเดิมแม้ผลการ์ดใบนี้ทำให้เขาจากไป — การ์ดผลจะได้เรียกชื่อถูกคน) · นอกการ์ด = คนล่าสุดที่ยังอยู่
function focusOf(st, role) {
  const id = st.kinFocus?.[role];
  return (id !== undefined && st.kin.find((m) => m.id === id)) || livingOf(st, role).at(-1) || null;
}

// cause = สาเหตุที่การ์ดเนื้อหาเล่าเอง (เช่น เมาแล้วขับ = road) ไม่ดึงเลขสุ่ม · ไม่ใส่ = สุ่มตามสัดส่วนของอายุนั้น
function kinDie(st, m, cause) {
  m.diedAge = kinYearOf(st) - m.born;
  m.alive = false;
  if (m.role === 'pet') m.cause = cause ?? petCause(st, m);
  else if (m.role !== 'herd') m.cause = cause ?? kinCause(st.content.era, st.seed, st.kinCauseRng, m.sex, kinYearOf(st), m.diedAge);
}

// สัตว์คู่ใจ (B110 ชิ้น 3): แก่ · ป่วย · อุบัติเหตุ — ค่าตั้งของเกม (ไม่มีสถิติสาเหตุตายของสัตว์เลี้ยงไทย)
// ทอยจาก seed+id ของตัวนั้น ไม่ดึง kinRng/kinCauseRng ลำดับสุ่มของคนในบ้านจึงไม่ขยับ · ฝูงนับเป็นหน่วยเดียว ไม่มีสาเหตุรายตัว
const PET_CAUSES = { old: 0.7, sick: 0.2, accident: 0.1 };
function petCause(st, m) {
  let u = makeRng(mixSeed(st.seed, 0xde7d + m.id)).next();
  for (const [k, w] of Object.entries(PET_CAUSES)) if ((u -= w) < 0) return k;
  return 'old';
}

// พ่อ/แม่จากไป: สาเหตุที่รู้อยู่แล้ว (ผู้เล่นรุ่นก่อน/นัดป่วย) หรือสุ่มตามสัดส่วนของอายุนั้น · โรคที่ถ่ายทอดได้จดเป็นประวัติครอบครัว
// ผู้เล่นรุ่นก่อนที่หายไปต่างโลก (gone) ไม่มีศพ จึงไม่มีสาเหตุ
function parentDied(st, p, year) {
  p.alive = false;
  p.diedAge ??= p.diesAt ?? p.age;
  // อายุของเราตอนพ่อ/แม่จากไป — การ์ดย้อนความทรงจำ (B168) เล่า · diedAge เป็นอายุของพ่อแม่
  p.diedAtYou ??= st.age;
  if (p.gone) return;
  p.cause ??= kinCause(st.content.era, st.seed, st.kinCauseRng, p.sex, year, p.diedAge);
  inherit(st, p.cause);
}

// คนที่ op bond กระทบ: parent = พ่อแม่ที่ยังอยู่ทุกคน · all = คนในบ้านที่ยังอยู่ทุกคน (รวมพ่อแม่) · บทบาทอื่น = คนล่าสุดของบทบาท
function bondTargets(st, role) {
  if (role === 'parent') return st.parents.filter((p) => p.alive);
  if (role === 'all') return [...st.parents.filter((p) => p.alive), ...st.kin.filter((m) => KIN_HOUSEHOLD.includes(m.role) && m.alive && !m.left)];
  const m = focusOf(st, role);
  return m?.alive ? [m] : [];
}

function bondAdd(st, list, d) {
  for (const m of list) m.bond = bondClamp((m.bond ?? BOND_START[m.role ?? 'parent']) + d);
  if (d > 0 && list.length) st.kinCared = true;
}

// ผลครอบครัวของตัวเลือก/ผลสุ่ม: family = [{add, n?} | {leave: spouse} | {die: role} | {bond: role|all, d}] + ธงเดิมที่ตั้ง
// ธงครอบครัวที่ตั้งโดยไม่มี add ของบทบาทนั้น = มีสมาชิกเพิ่ม 1 คน (เนื้อหาเดิมที่เขียนก่อนมีระบบ)
// care = แต้ม bond ที่คนในบ้านได้จากการ์ดหมวด family ที่ตัวเลือกให้ความสัมพันธ์บวก (ผู้เรียกคิดจากระดับผล)
function applyFamily(st, c, care = 0) {
  const ops = c.family ?? [];
  for (const op of ops) {
    // คู่ใจทีละ 1 ตัว — เนื้อหากั้นด้วย when อยู่แล้ว ตรงนี้กันเผื่อหลุด (ไม่เพิ่มตัวที่สอง)
    if (op.add === 'pet' && livingOf(st, 'pet').length) continue;
    if (op.add) for (let i = 0; i < (op.n ?? 1); i++) addMember(st, op.add, ANIMAL.includes(op.add) ? { kind: op.kind, life: op.life, name: op.name } : {});
    if (op.bond) bondAdd(st, bondTargets(st, op.bond), op.d);
    if (op.leave) for (const m of livingOf(st, op.leave)) m.left = true;
    if (op.die === 'parent') {
      const p = st.parents.find((x) => x.alive);
      if (p) {
        p.diedAge = p.age;
        if (op.cause) p.cause = op.cause;
        parentDied(st, p, kinYearOf(st));
      }
    } else if (op.die) {
      const m = focusOf(st, op.die);
      if (m?.alive) kinDie(st, m, op.cause);
    }
  }
  for (const f of c.sets_flags ?? []) {
    const role = KIN_FLAG_ROLE[f];
    if (!role || ops.some((op) => op.add === role)) continue;
    // แต่งงานซ้ำตอนคู่ยังอยู่ = คนเดิม ไม่เพิ่มคู่
    if (role === 'spouse' && livingOf(st, 'spouse').length) continue;
    addMember(st, role);
  }
  if (care > 0) bondAdd(st, bondTargets(st, 'all'), care * BOND_CARE_PER_REL);
  kinSyncFlags(st);
}

// ธงเดิมตามสมาชิกจริง: married = มีคู่ที่ยังอยู่ด้วยกัน · has_kids = มีลูกที่ยังอยู่ · raised_grandkids เป็นเรื่องที่เคยทำ ไม่ถอด
function kinSyncFlags(st) {
  for (const [f, role] of [['married', 'spouse'], ['has_kids', 'child']]) {
    if (livingOf(st, role).length) {
      st.flags[f] = true;
      st.flagAge[f] ??= st.age;
    } else if (st.kin.some((m) => m.role === role)) delete st.flags[f];
  }
}

// เดินหนึ่งปีของสมาชิก: ตายตามตารางชีพของเพศ/ปีนั้น ที่อายุของปีที่เพิ่งผ่าน (ทารกจึงเจออัตราตายขวบปีแรก) · ลูกที่โตแล้วมีหลานได้ · ไม่มีสมาชิก = ไม่ดึงเลขสุ่ม
// ปีที่ไม่ได้ดูแล bond ลด 1 ถึง floor · ความเหงาตอนแก่ — ทั้งสองอย่างไม่ดึงเลขสุ่ม ชีวิตที่ไม่มีครอบครัวจึงเดินเหมือนเดิม
function kinYearlyBond(st) {
  if (!st.kinCared) {
    for (const m of [...st.parents, ...st.kin]) {
      if (!m.alive || m.left) continue;
      const b = m.bond ?? BOND_START[m.role ?? 'parent'];
      m.bond = b > BOND_FLOOR ? Math.max(BOND_FLOOR, b - 1) : b;
    }
  }
  st.kinCared = false;
  if (st.age >= KIN_LONELY.from && (KIN_LONELY.happiness || KIN_LONELY.health) && !st.kin.some((m) => KIN_HOUSEHOLD.includes(m.role) && m.alive && !m.left)) {
    st.happiness = bondClamp(st.happiness - KIN_LONELY.happiness);
    st.health = bondClamp(st.health - KIN_LONELY.health);
  }
}

// คนในบ้านที่จากไปเองตามตารางชีพ/อายุขัย ปีนี้ → st.kinLoss (สัญญาณให้เนื้อหาทำการ์ดสูญเสีย · when.loss) + คืนรายการให้แกนออกการ์ดแจ้งทุกครั้ง
// ตายจาก op die ของเนื้อหาไม่นับ — การ์ดใบนั้นเล่าเองแล้ว · เพื่อนรุ่นไม่นับ (ไม่ใช่คนในบ้าน)
function kinLost(st, m, age, year, out) {
  m.diedAge = age;
  m.alive = false;
  if (!KIN_HOUSEHOLD.includes(m.role) && m.role !== 'herd') return;
  if (m.role === 'pet') st.happiness = bondClamp(st.happiness - PET_GRIEF);
  const loss = { id: m.id, role: m.role, name: m.name, age, year, ...(m.kind && { kind: m.kind }), ...(m.cause && { cause: m.cause }) };
  st.kinLoss.push(loss);
  out.push(loss);
}

// ผลต่อปีของสัตว์ (B44): คู่ใจให้ค่าสถานะตามชนิด หักค่าเลี้ยง · ฝูงให้เงินสุทธิ · บาทของปีนั้น — ไม่ดึงเลขสุ่ม
function petYear(st, saving) {
  const live = st.kin.filter((m) => ANIMAL.includes(m.role) && m.alive && !m.left);
  if (!live.length) return;
  for (const m of live) {
    if (m.role === 'herd') {
      st.money += (HERD_KINDS[m.kind]?.net ?? 0) * saving;
      continue;
    }
    const k = PET_KINDS[m.kind] ?? {};
    for (const [stat, v] of Object.entries(k.gives ?? {})) st[stat] = bondClamp(st[stat] + v);
    st.money -= (k.cost ?? 0) * saving;
  }
}

// saving = เงินเก็บรายปีของชีวิตนี้ (ผู้เรียกคิดให้) ฐานของเงินสัตว์
function ageKin(st, year, saving = 0) {
  kinYearlyBond(st);
  filialMirror(st);
  const lost = [];
  if (!st.kin.length) return lost;
  petYear(st, saving);
  for (const m of [...st.kin]) {
    if (!m.alive) continue;
    const a = year - m.born - 1;
    if (ANIMAL.includes(m.role)) {
      if (a + 1 >= m.maxAge) {
        if (m.role === 'pet') m.cause = petCause(st, m);
        kinLost(st, m, a + 1, year, lost);
      }
      continue;
    }
    const cause = kinDeathRoll(st.content.era, st.seed, st.kinCauseRng, m, year, a, st.kinRng.next());
    if (cause) {
      m.cause = cause;
      kinLost(st, m, a, year, lost);
      continue;
    }
    if (m.role === 'child' && kinInRange(year - m.born, [GRANDKID.from, GRANDKID.to]) && st.kin.filter((g) => g.of === m.id).length < GRANDKID.max && st.kinRng.next() < GRANDKID.chance) {
      addMember(st, 'grandchild', { of: m.id });
    }
  }
  kinSyncFlags(st);
  return lost;
}

// ข้อความการ์ดแจ้งการจากไป (แกนออกเองทุกครั้ง — เนื้อหาต่อยอดด้วย when.loss ได้)
const LOSS_WHO = { spouse: 'คู่ชีวิต', child: 'ลูก', grandchild: 'หลาน' };
const PET_LOSS_TEXT = {
  old: (who, age) => `${who}หลับไปอย่างสงบตามวัย ด้วยวัย ${age} ปี`,
  sick: (who, age) => `${who}ป่วยหนักแล้วจากไป ด้วยวัย ${age} ปี`,
  accident: (who, age) => `${who}ประสบอุบัติเหตุจากไปกะทันหัน ตอนอายุ ${age} ปี`,
};
function lossText(l) {
  if (l.role === 'herd') return `ฝูง${l.kind}ที่เลี้ยงไว้ค่อย ๆ หมดไป ไม่ได้เลี้ยงต่อแล้ว`;
  const who = l.role === 'pet' ? (l.name ? `เจ้า${l.name} ${l.kind}ที่เลี้ยงไว้` : `${l.kind}ที่เลี้ยงไว้`) : `${LOSS_WHO[l.role]}${l.name}`;
  if (l.role === 'pet' && PET_LOSS_TEXT[l.cause]) return PET_LOSS_TEXT[l.cause](who, l.age);
  return l.age < 1 ? `${who}จากไปตั้งแต่ยังไม่ทันครบขวบ` : `${who}จากไปแล้ว ด้วยวัย ${l.age} ปี`;
}

// พ่อแม่/คนในบ้านที่ถึงปีรู้ว่าป่วยโรคเรื้อรังที่นัดตาย (B110 ชิ้น 2) → คืนการ์ดให้แกนออกแจ้ง · เพื่อนรุ่นไม่แจ้ง (ไม่ใช่คนในบ้าน)
// ill.from = อายุที่รู้ (พ่อ/แม่ที่เป็นผู้เล่นรุ่นก่อนรู้ตามชาติที่เล่นไปแล้ว) · ไม่มี = รู้ปีที่นัด
// left = ปีที่เหลือหลังปีนี้ก่อนถึงนัด (นับแบบ when.illness ของตัวเอง)
const illPeople = (st, year) => [
  ...st.parents.filter((p) => p.alive && p.ill).map((p) => ({ p, role: 'parent', cur: p.age, who: p.sex === 'หญิง' ? 'แม่' : 'พ่อ' })),
  ...(st.kin ?? []).filter((m) => LOSS_WHO[m.role] && m.alive && !m.left && m.ill).map((m) => ({ p: m, role: m.role, cur: year - m.born - 1, who: `${LOSS_WHO[m.role]}${m.name}` })),
];
function kinIllNews(st, year) {
  const out = [];
  for (const { p, role, cur, who } of illPeople(st, year)) {
    if (p.ill.toldAt !== undefined || (p.ill.from !== undefined && cur < p.ill.from)) continue;
    p.ill.toldAt = cur;
    out.push({ text: KIN_ILL_TEXT[p.ill.cause](who), kinIllness: { role, ...(p.id !== undefined && { id: p.id }), cause: p.ill.cause, left: Math.max(0, p.ill.age - cur - 1) } });
  }
  return out;
}
// เงื่อนไขการ์ดช่วงญาติป่วย (when.kin_illness): มีพ่อแม่/คนในบ้านที่ยังอยู่และรู้แล้วว่าป่วย · roles · causes · left แบบ when.illness
function kinIllOk(st, w) {
  const year = kinYearOf(st);
  return illPeople(st, year).some(({ p, role, cur }) => p.ill.toldAt !== undefined && (!w.roles || w.roles.includes(role)) && (!w.causes || w.causes.includes(p.ill.cause)) && kinInRange(Math.max(0, p.ill.age - cur - 1), w.left));
}

// เงื่อนไขการ์ดสูญเสีย (when.loss): มีคนในบ้านบทบาทที่ระบุ (ไม่ใส่ = ทุกบทบาท) จากไปเองภายใน within ปีที่ผ่านมา (ไม่ใส่ = ปีนี้)
// after = ต้องผ่านมาอย่างน้อยกี่ปี (B165 ช่วงไว้ทุกข์ — การ์ดรักใหม่ไม่ขึ้นก่อนพ้นช่วง)
function lossOk(st, w) {
  const year = kinYearOf(st);
  return (st.kinLoss ?? []).some((l) => (!w.roles || w.roles.includes(l.role)) && year - l.year >= (w.after ?? 0) && year - l.year <= (w.within ?? 0));
}
// ชื่อคนที่จากไปล่าสุด ให้การ์ดสูญเสียเรียก ({ชื่อผู้จากไป})
const lastLoss = (st) => (st.kinLoss ?? []).at(-1) ?? null;
// คู่ที่จากไปล่าสุด ({ชื่อคู่เก่า}) — คนที่จากไปล่าสุดอาจเป็นสัตว์หรือลูก การ์ดรักใหม่จึงเรียกคู่ตรง ๆ
const lastSpouseLoss = (st) => (st.kinLoss ?? []).findLast((l) => l.role === 'spouse') ?? null;
// ปีที่อยู่ด้วยกัน ({ปีคู่เก่า}): อายุตอนแต่ง = flagAge.married (ไม่ถูกลบตอนธงหลุด) · ไม่รู้อายุตอนแต่ง = ไม่บอกเลขปี
function spouseYears(st) {
  const l = lastSpouseLoss(st);
  const wed = st.flagAge?.married;
  return l && wed !== undefined ? Math.max(1, l.year - st.birthYear - wed) : null;
}
// ชื่อที่การ์ดสูญเสียเรียก — สัตว์เรียกแบบ petCall
const lossCall = (l) => (ANIMAL.includes(l.role) ? petCall(l) : l.name);

// เงื่อนไขครอบครัวของการ์ด (when.family / requires.family): บทบาท · เพศ · ยังอยู่ · ช่วงอายุ · จำนวน
// ไม่ใส่ count = ต้องมีอย่างน้อย 1 คนที่ตรง · คู่ที่หย่าแล้วไม่นับเป็นคู่ครอง
// sex แยกพ่อกับแม่ — ข้อความที่เอ่ย "แม่" ต้องไม่ผ่านเพราะพ่อยังอยู่ (B138)
function familyOk(st, f) {
  const year = kinYearOf(st);
  const pool = f.role === 'parent'
    ? st.parents.map((p) => ({ alive: p.alive, age: p.age, sex: p.sex }))
    : (st.kin ?? []).filter((m) => m.role === f.role && !m.left).map((m) => ({ alive: m.alive, age: memberAge(st, m, year), sex: m.sex }));
  const n = pool.filter((m) => (f.alive === undefined || m.alive === f.alive) && (f.sex === undefined || m.sex === f.sex) && kinInRange(m.age, f.age)).length;
  return f.count ? kinInRange(n, f.count) : n > 0;
}

// จดการดูแลพ่อแม่จากตัวเลือก (ผู้เรียกคิด score จากป้ายบุญบาป) · ผลสุ่มของตัวเลือกเดียวกันเติมแค่ score ไม่นับครั้งซ้ำ
function filialNote(st, way, score, outcome = false) {
  st.filial ??= { way, n: 0, score: 0 };
  st.filial.way = way;
  if (!outcome) st.filial.n += 1;
  st.filial.score += score;
}
// ลูกเลียนแรงที่เราเคยดูแลพ่อแม่ — ครั้งเดียวตอนถึงอายุ at · ไม่ดึงเลขสุ่ม · ไม่ตั้ง kinCared (ไม่ใช่การดูแลปีนี้)
function filialMirror(st) {
  if (st.age !== FILIAL.at || !st.filial?.n) return;
  const d = Math.round(FILIAL.step * Math.max(-FILIAL.cap, Math.min(FILIAL.cap, st.filial.score)));
  if (!d) return;
  for (const m of st.kin) {
    if (m.role !== 'child' || !m.alive || m.left) continue;
    const b = m.bond ?? BOND_START.child;
    // ลดไม่ทะลุ floor แบบเดียวกับปีที่ไม่ได้ดูแล — bondClamp ตัดที่ 0 ทำลูกหลุดช่วงที่ด่าน family บังคับ
    m.bond = d > 0 ? bondClamp(b + d) : b > BOND_FLOOR ? Math.max(BOND_FLOOR, b + d) : b;
  }
}
// เงื่อนไขการ์ดตอนเราแก่ (when.filial): เคยดูแลพ่อแม่ n ครั้ง · วิธีล่าสุดอยู่ใน way
function filialOk(st, w) {
  const n = st.filial?.n ?? 0;
  return kinInRange(n, w.n ?? [1, Infinity]) && (!w.way || (n > 0 && w.way.includes(st.filial.way)));
}
// ลูกเลียนวิธี: ประโยคที่ลูกบอกเรา ฉายวิธีที่เราเคยใช้กับพ่อแม่ ({ลูกดูแลแบบเรา}) · ไม่บอกตัวเลข
const FILIAL_MIRROR = {
  self: (p) => `"เดี๋ยวลูกลาออกมาอยู่กับ${p}เอง" — ประโยคเดียวกับที่คุณเคยพูดตอนพ่อแม่ของคุณล้ม`,
  share: () => '"พี่น้องแบ่งเวรกันแล้ว คนละวัน" — ตารางแบบเดียวกับที่คุณเคยนั่งแบ่งกับญาติตอนพ่อแม่ของคุณป่วย',
  hire: (p) => `"ลูกจ้างคนมาดูแล${p}ประจำ วันหยุดจะแวะมา" — แบบเดียวกับที่คุณเคยจ้างคนดูแลพ่อแม่ของคุณ`,
  home: (p) => `"ลูกหาบ้านพักคนชราดี ๆ ไว้ให้${p}แล้ว" — แบบเดียวกับที่คุณเคยพาพ่อแม่ของคุณไปส่ง`,
  away: () => '"งานลูกยุ่งมาก จะโอนเงินมาให้ทุกเดือน" — แบบเดียวกับที่คุณเคยทำกับพ่อแม่ของคุณ',
};
const filialMirrorText = (st) => (FILIAL_MIRROR[st.filial?.way] ?? (() => '"เรื่องนี้ลูกจัดการเอง"'))(st.sex === 'หญิง' ? 'แม่' : 'พ่อ');
// พ่อหรือแม่ที่รู้แล้วว่าป่วย ให้การ์ด when.kin_illness roles parent เรียก ({พ่อแม่ที่ป่วย}) · คนล่าสุดที่แจ้ง
function illParentWord(st) {
  const p = st.parents.filter((x) => x.alive && x.ill?.toldAt !== undefined).at(-1);
  return p ? (p.sex === 'หญิง' ? 'แม่' : 'พ่อ') : 'พ่อแม่';
}

// ผลร้ายของผลสุ่ม: คนในบ้านที่ผูกพันที่สุดอาจช่วยประคอง → คืนคนนั้น (ผู้เรียกลดความเสียหายตาม KIN_AID.scale) หรือ null
// ทอยด้วย kinRng เฉพาะตอนมีคนเข้าเกณฑ์ — ชีวิตที่ไม่มีครอบครัวไม่ดึงเลขนี้
function kinAid(st) {
  const able = (st.kin ?? []).filter((m) => KIN_AID.roles.includes(m.role) && m.alive && !m.left && m.bond >= KIN_AID.from);
  if (!able.length) return null;
  const h = able.reduce((a, b) => (b.bond > a.bond ? b : a));
  return st.kinRng.next() < (h.bond - KIN_AID.base) / KIN_AID.span ? h : null;
}

// สัตว์ติดบ้านตอนเกิด (B44): ทางในตระกูลได้ตัวที่บ้านเดิมยังเลี้ยงอยู่ (heir.pets) · ที่เหลือสุ่มตามบ้านจาก stream แยก
// ไม่ดึง rng ของโลก/kinRng — ชีวิตที่ไม่ได้สัตว์ไม่มีอะไรเปลี่ยนจากส่วนนี้
function petsAtBirth(st, heir, clsIndex) {
  if (heir?.pets) {
    // ตัวที่บ้านรับมาหลังทายาทเกิด เข้าบ้านตอนถึงปีของมัน (petArrivals)
    for (const p of heir.pets) if (p.born <= st.birthYear) addMember(st, p.role, p);
    st.petsLater = heir.pets.filter((p) => p.born > st.birthYear);
    return;
  }
  // เกิดในตระกูลเดิมแต่บ้านไม่มีสัตว์เหลือ = ไม่สุ่มเพิ่ม · เกิดที่อื่นสุ่มตามบ้านใหม่
  if (heir?.tier) return;
  const rng = makeRng(st.seed ^ 0x7e7f1a2b);
  const set = clsIndex >= PET_AT_BIRTH.richFrom ? PET_AT_BIRTH.rich : st.region === PET_AT_BIRTH.city ? PET_AT_BIRTH.town : PET_AT_BIRTH.rural;
  for (const role of ANIMAL) {
    const [chance, kinds] = set[role];
    if (rng.next() >= chance) continue;
    const kind = kinds[rng.int(0, kinds.length - 1)];
    const maxAge = rng.int(...(role === 'pet' ? PET_KINDS : HERD_KINDS)[kind].life);
    // ตัวที่อยู่บ้านมาก่อนเราเกิด อายุสุ่มไม่เกินครึ่งอายุขัย
    const born = st.birthYear - rng.int(0, Math.floor(maxAge / 2));
    addMember(st, role, { kind, maxAge, born, sex: rng.next() < 0.5 ? 'ชาย' : 'หญิง' });
  }
}

// สัตว์ที่ส่งต่อมาถึงปีเข้าบ้านแล้ว — คืนรายการให้แกนออกการ์ดแจ้ง · ไม่ดึงเลขสุ่ม
// คู่ใจมีอยู่แล้ว (ได้จากการ์ดระหว่างนั้น) = ตัวที่ส่งต่อไม่เข้าบ้าน
function petArrivals(st, year) {
  if (!st.petsLater?.length) return [];
  const now = st.petsLater.filter((p) => p.born <= year);
  st.petsLater = st.petsLater.filter((p) => p.born > year);
  return now.filter((p) => p.role !== 'pet' || !livingOf(st, 'pet').length).map((p) => addMember(st, p.role, p));
}
const petArriveText = (m) => `บ้านเรารับ${petLabel(m)}มาเลี้ยง`;

// ส่งต่อทายาทในตระกูล: ทุกตัวที่ยังอยู่ตอนเราตาย (ยังอยู่ตลอดตั้งแต่เกิดถึงปีนั้น) · ตัวที่เกิดหลังทายาทเข้าบ้านตอนถึงปีของมัน
function heirPets(st, birthYear, tier) {
  if (!tier || !st.kin) return undefined;
  const pets = st.kin
    .filter((m) => ANIMAL.includes(m.role) && m.alive && !m.left)
    .map(({ role, kind, name, born, maxAge, sex, bond }) => ({ role, kind, name, born, maxAge, sex, bond }));
  return pets.length ? pets : undefined;
}

// มรณบัตร: ใครรับเลี้ยงสัตว์ต่อ — คู่ชีวิต > ลูก > หลาน ที่ยังอยู่ ไม่มีใคร = เพื่อนบ้าน
function petsAfter(st) {
  const pets = (st.kin ?? []).filter((m) => ANIMAL.includes(m.role) && m.alive && !m.left);
  if (!pets.length) return null;
  const keeper = ['spouse', 'child', 'grandchild'].map((r) => st.kin.find((m) => m.role === r && m.alive && !m.left)).find(Boolean);
  const who = keeper ? `${LOSS_WHO[keeper.role]}${keeper.name}` : 'เพื่อนบ้าน';
  return `${pets.map(petLabel).join(' กับ')} ได้${who}รับไปเลี้ยงต่อ`;
}

// มรณบัตร: ใครมาส่ง (B164) — ผลย้อนของความสัมพันธ์ทั้งชีวิต เล่าเป็นคำ ไม่โชว์ค่าและไม่มีชื่อใคร (คนที่จากไปห้ามถูกเรียก)
// คนที่ยังอยู่มาจากที่ไกลได้ (นับคนที่ย้ายออกด้วย) · bond ถึงเกณฑ์ = อยู่ช่วยงาน ต่ำกว่า = แวะมาครู่เดียว (พื้น bond แค่ "เฉย ๆ" ไม่ถึงขั้นไม่มา) · แขกที่เหลือแบ่งตามน้ำหนักเดียวกับสูตรแขก
// ใช้ค่าเฉลี่ยวัยทำงาน ไม่ใช่ค่าตอนตาย — ค่าตกตามวัยชรา แต่คนที่เคยรู้จักกันยังมา · อ่าน state ล้วน ไม่ดึงเลขสุ่ม
const FUNERAL_WHO = { come: 40, adult: 18, roles: ['spouse', 'child', 'grandchild', 'peer'] };
const WHO_WORD = { spouse: 'คู่ชีวิต', child: 'ลูก', grandchild: 'หลาน', peer: 'เพื่อนรุ่นเดียวกัน' };
const whoList = (by) => {
  const parts = FUNERAL_WHO.roles.filter((r) => by[r]).map((r) => (r === 'spouse' ? WHO_WORD[r] : `${WHO_WORD[r]} ${by[r]} คน`));
  return parts.length > 1 ? `${parts.slice(0, -1).join(' ')} และ${parts.at(-1)}` : parts[0];
};
function funeralWho(st, guests) {
  const came = {}, away = {};
  let n = 0;
  for (const m of st.kin ?? []) {
    if (!FUNERAL_WHO.roles.includes(m.role) || !m.alive) continue;
    const to = (m.bond ?? BOND_START[m.role]) >= FUNERAL_WHO.come ? came : away;
    to[m.role] = (to[m.role] ?? 0) + 1;
    if (to === came) n++;
  }
  const parts = [];
  if (n) parts.push(`${whoList(came)}อยู่ช่วยงานจนเสร็จ`);
  if (Object.keys(away).length) parts.push(`${whoList(away)}แวะมาแค่ครู่เดียว`);
  const rest = n ? 'แขกที่เหลือส่วนใหญ่' : 'แขกส่วนใหญ่';
  if (guests > n) {
    const trail = (st.statTrail ?? []).filter((p) => p.age >= FUNERAL_WHO.adult);
    const avg = (k) => (trail.length ? trail.reduce((t, p) => t + p[k], 0) / trail.length : st[k]);
    parts.push(`${rest}${avg('network') * 3 > avg('relations') * 2 ? 'เป็นคนในวงการที่เคยร่วมงานกันมา' : 'เป็นเพื่อนบ้านและคนที่เคยช่วยเหลือกันมา'}`);
  } else if (n) parts.push('ศาลามีแต่คนในบ้าน');
  return parts.length ? { text: parts.join(' · '), came: n } : null;
}

// ผู้รับจดหมายคำฝาก (afterfall-3): คนเดียว ชี้จาก state ล้วนไม่ดึงเลขสุ่ม · สายเลือดก่อน แล้วคนนอกสายเลือดตามลำดับกลุ่ม
// กลุ่มเดียวกันเอา bond สูงสุด เท่ากัน = id น้อย · LETTER_BOND = ไม่มีเกณฑ์ (เจ้าของเคาะ: ใครยังมีชีวิตก็รับได้) แยกจาก FUNERAL_WHO.come
const LETTER_TO = [['child', 'grandchild'], ['peer'], ['spouse']];
const LETTER_BOND = 0;
function letterTo(st) {
  for (const roles of LETTER_TO) {
    const ok = (st.kin ?? []).filter((m) => roles.includes(m.role) && m.alive && (m.bond ?? BOND_START[m.role]) >= LETTER_BOND);
    if (ok.length) return ok.reduce((a, m) => ((m.bond ?? BOND_START[m.role]) > (a.bond ?? BOND_START[a.role]) || ((m.bond ?? BOND_START[m.role]) === (a.bond ?? BOND_START[a.role]) && m.id < a.id) ? m : a));
  }
  return null;
}
const letterToText = (m) => (m.name ? `${WHO_WORD[m.role]} ${m.name}` : WHO_WORD[m.role]);

// รายชื่อให้แผงครอบครัว (B36c) อ่านอย่างเดียว — ช่องที่ไล่ไว้เท่านั้น ไม่มีค่าบัญชีหรือค่าที่อนุมานกรรมได้
function familyOf(st) {
  const year = kinYearOf(st);
  const bondOf = (m) => {
    const b = m.bond ?? BOND_START[m.role ?? 'parent'];
    return { bond: b, bondLevel: bondLabel(b) };
  };
  // พ่อแม่ที่ตายก่อนเราเกิด (คู่ของรุ่นก่อนในทางตระกูล) ไม่เคยผ่าน ageParents — อายุตอนตายอยู่ที่ diesAt
  const diedOf = (p) => (p.alive ? null : (p.diedAge ?? p.diesAt ?? null));
  // สาเหตุตาย (B110) ให้ผังตระกูลแสดง — มีเฉพาะคนที่จากไปแล้ว · เซฟก่อนมีสาเหตุไม่มีช่องนี้
  const causeOf = (m) => (!m.alive && m.cause ? { cause: m.cause } : {});
  const parents = st.parents.map((p) => ({ role: 'parent', name: p.name ?? null, sex: p.sex, age: p.alive ? p.age : diedOf(p), alive: p.alive, diedAge: diedOf(p), ...causeOf(p), ...bondOf(p) }));
  const kin = (st.kin ?? []).map((m) => ({ id: m.id, role: m.role, name: m.name, sex: m.sex, age: memberAge(st, m, year), alive: m.alive, diedAge: m.diedAge, ...causeOf(m), ...bondOf(m), ...(m.kind && { kind: m.kind }), ...(m.order && { order: m.order }), ...(m.of !== undefined && { of: m.of }), ...(m.left && { left: true }) }));
  return [...parents, ...kin];
}

// การเงิน (ใบ 10 · 11 · 14): ผลตอบแทนสินทรัพย์รายปี · ค่าจ้างตามอาชีพ · การ์ดจัดสรรเงิน — ฟังก์ชันล้วน ไม่แตะ DOM/ไฟล์



// system = id ใน data/system-starts.json ที่กั้นปีที่ซื้อได้ · ไม่มี system = มีตลอดช่วงเกม
// สลากออมสินอยู่ในรายการเพื่อให้ด่าน build รู้จัก id แต่ระบบยังปิด จึงไม่มีผลตอบแทนให้คำนวณ
const ASSETS = [
  { id: 'cash', name: 'เงินสด' },
  { id: 'deposit', name: 'เงินฝาก' },
  { id: 'stock', name: 'หุ้นไทย', system: 'stock' },
  { id: 'gold', name: 'ทอง' },
  { id: 'land', name: 'ที่ดิน' },
  { id: 'savings_lottery', name: 'สลากออมสิน', system: 'savings_lottery' },
];
const ASSET_BY_ID = new Map(ASSETS.map((a) => [a.id, a]));
const DISCLAIMER = 'เกม ไม่ใช่คำแนะนำการลงทุน';

const systemOpen = (era, id, year) => {
  const s = era.systems.find((x) => x.id === id);
  return !!s && s.status === 'open' && year >= s.from && (s.to === undefined || year <= s.to);
};

function assetOpen(era, id, year) {
  const a = ASSET_BY_ID.get(id);
  if (!a) throw new Error(`สินทรัพย์ไม่รู้จัก: ${id}`);
  return !a.system || systemOpen(era, a.system, year);
}

// ชนิดหนี้ (B08b) กั้นปีด้วย system แบบเดียวกับสินทรัพย์ · ดอก/ระยะผ่อนอยู่ใน data/debt.json
const DEBTS = [
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
const debtName = (id) => DEBT_BY_ID.get(id)?.name ?? id;

// ตารางรางวัลสลากกินแบ่งรัฐบาล (ใบ 11 · ใบ 12 ตรวจกับ glo.or.th แล้ว): จำนวนรางวัลต่อ 1 ชุด 1,000,000 ฉบับ · บาทต่อรางวัล ณ ราคาใบ price
// ใหญ่ 168 ต่อล้าน + เล็ก 14,000 ต่อล้าน = 1.4168% · เนื้อหาอ้างตารางนี้ด้วยชื่อ finance.lottery ห้ามตั้งตารางเอง
// ใช้ทุกปีด้วยมูลค่าต่อราคาใบเท่าเดิม — ยุคก่อน 2560 รางวัลครึ่งหนึ่งพร้อมราคาครึ่งหนึ่ง (อนุมาน) ก่อน 2550 ไม่มีข้อมูล
const LOTTERY_PRIZES = {
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
const PRIZE_TABLES = { 'finance.lottery': LOTTERY_PRIZES };

function debtOpen(era, id, year) {
  const d = DEBT_BY_ID.get(id);
  if (!d) throw new Error(`หนี้ไม่รู้จัก: ${id}`);
  if (era.finance.debt.kinds[id]?.from > year) return false;
  return !d.system || systemOpen(era, d.system, year);
}

// ก้อนหนี้ใหม่ · ดอกคงที่ล็อกตั้งแต่วันกู้ · ผ่อนบ้านไม่ล็อก ลอยตามดอกเงินกู้ทุกปี (float)
function newDebt(era, seed, kind, amount, year) {
  const k = era.finance.debt.kinds[kind];
  const base = () => lendingRate(era, seed, year) + k.premium;
  let rate = k.rate;
  if (kind === 'car') rate = k.cap && year >= k.cap.from ? Math.min(base(), k.cap.v) : base();
  else if (kind === 'bank_loan') rate = base();
  return { kind, balance: amount, rate, float: kind === 'mortgage', premium: k.premium ?? 0, years: k.years ?? null, grace: k.grace ?? 0, simple: !!k.simple };
}

// ยอดจ่ายของปีนี้ แล้วลดก้อนหนี้ตาม · ปลอดหนี้ = ดอกทบเข้าเงินต้น ไม่จ่าย · ไม่ทบ = จ่ายแต่ดอก เงินต้นค้าง
// ที่เหลือผ่อนเท่ากันทุกปีแบบลดต้นลดดอก ให้หมดพอดีในปีที่เหลือ
function payDebt(era, seed, d, year) {
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
const firstPay = (d) => (d.simple ? d.balance * d.rate : d.rate ? (d.balance * d.rate) / (1 - (1 + d.rate) ** -d.years) : d.balance / d.years);
const debtDone = (d) => !d.simple && (d.years <= 0 || d.balance <= 0.5);

// ร้องเรียนหนี้นอกระบบ: ดอกลดเหลืออัตราตามกฎหมาย แต่ยังจ่ายแต่ดอกเหมือนเดิม — เงินต้นค้างจนมีการ์ดให้ปิดหนี้
function complainDebt(era, d) {
  if (d.kind === 'informal') d.rate = era.finance.debt.kinds.informal.complaint_rate;
}

// ผลตอบแทนทั้งปีเป็นสัดส่วน (0.05 = 5%) · สินทรัพย์ที่คิดจากราคาสองปี อ่านปีต้นแบบครั้งเดียวแล้วเทียบกับปีก่อนหน้าของปีต้นแบบ
function assetReturn(era, seed, id, year) {
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

const lendingRate = (era, seed, year) => seriesAt(era, seed, era.finance.lending, year) / 100;

// ค่าแรงขั้นต่ำกรุงเทพฯ บาท/วัน = ค่าจริงปีอ้างอิง × อัตราโตของปีต้นแบบสะสมทีละปี
// อ่านระดับค่าแรงของปีต้นแบบตรง ๆ ไม่ได้ — ปีติดกันยืมคนละยุค ค่าแรงจะกระโดดขึ้นลงหลายเท่า
function minWage(era, seed, year) {
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
function monthlyWage(era, seed, occupation, ses, year) {
  const f = era.finance;
  const o = f.occupations.find((x) => x.id === occupation);
  return o.wage * (minWage(era, seed, year) / minWage(era, seed, f.refYear)) * regionRatio(era.birth, ses, year);
}

// อาชีพตามฐานะเกิด สุ่มจาก stream ของตัวเอง — ไม่กินเลขสุ่มของโลก ชะตาการตายจึงไม่เปลี่ยนเพราะระบบเงิน
function pickOccupation(era, seed, cls) {
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
function portfolioReturn(era, seed, alloc, year) {
  let r = 0;
  for (const [id, w] of Object.entries(alloc)) r += w * assetReturn(era, seed, assetOpen(era, id, year) ? id : 'deposit', year);
  return r;
}

// การ์ดจัดสรร (ใบ 11): ทุก every ปีตั้งแต่อายุ from ถึง to · ≥4 ตัวเลือกเสมอ (ก่อนตลาดหุ้นเปิดยังมี 6)
const ALLOC = { from: 20, every: 5, to: 70 };
const isAllocAge = (age) => age >= ALLOC.from && age <= ALLOC.to && (age - ALLOC.from) % ALLOC.every === 0;

function allocOptions(era, year) {
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

const formatReturn = (r) => `${r >= 0 ? '+' : '−'}${Math.abs(r * 100).toFixed(2)}%`;

// ผลหลังเกิดแล้วของช่วงปีเกม from..to ต่อสินทรัพย์ที่ซื้อได้ (ใบ 11: บอกย้อนหลัง ไม่บอกล่วงหน้า)
function periodReturns(era, seed, from, to) {
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

const assetName = (id) => ASSET_BY_ID.get(id)?.name ?? id;

// บัญชีบุญบาปซ่อน (ใบ 09) — ผู้เล่นไม่เห็นค่าใด ๆ ระหว่างชีวิต เห็นแค่ลางดี/ลางร้ายเป็นครั้งคราว · เฉลยที่ปรโลก (B06)
// ตารางกลางทั้งหมดอยู่ไฟล์นี้ ปรับสมดุลที่จุดเดียว · ทุกตัวเลขเป็นค่าตั้งของเกม ไม่มีคัมภีร์ให้แปลงเป็นตัวเลข harness เป็นคนปรับ

// น้ำหนักต่อระดับ 1–3 ไม่เป็นเส้นตรง ให้ป้ายระดับ 3 เป็นเรื่องใหญ่จริง แบบเดียวกับ LEVELS ของค่าสถานะ
const MERIT_LEVELS = { 1: 1, 2: 2.5, 3: 4 };
// น้ำหนักต่อหมวด: คติไม่ได้จัดลำดับความหนักของบาป 8 หมวด จึงเท่ากันหมด · vow_broken เป็นธงไม่มีระดับ น้ำหนักทั้งก้อน
// หมวดที่เป็นกลไกเกมตั้งเอง (GAME_CATS) ต้องเบากว่าระดับ 1 ของหมวดตามคติทุกหมวด (ใบ 09/12 — ห้ามหนักเท่าบาปตามคติ)
// สามหมวดท้ายเป็นของต่างโลก (B68c) · ฆ่าเพื่อแต้มเป็นปาณาติบาตตามคติ จึงหนักเท่าหมวดเดิม
const MERIT_WEIGHTS = {
  greed_harm: 1,
  disturb_monk: 1,
  abuse_elders: 1,
  unjust_judgment: 1,
  adultery: 1,
  love_charm: 1,
  oppress_subjects: 1,
  intoxicants: 1,
  vow_broken: 0.5,
  dana: 1,
  sila: 1,
  bhavana: 1,
  care_parents: 1,
  help_others: 1,
  kill_for_gain: 1,
  cheat_exploit: 0.5,
  keep_goddess_vow: 0.5,
  // ความรู้อันตรายจากโลกเดิม (B68h) — กลไกเกมตั้งเอง ไม่มีในคติ จึงเบากว่าระดับ 1 ของหมวดตามคติ
  forbidden_knowledge: 0.5,
  // ดื่มยาต่ออายุเกินที่ร่างกายรับ (B68k) — กลไกเกมตั้งเอง เบาเท่าหมวดเกมอื่น
  against_nature: 0.5,
  // สัญญากับมาร (B156) — กลไกเกมตั้งเอง ความหนักมาจากระดับ 3 + ไม่จางข้ามชาติ (FULL_CARRY ใน afterlife) ไม่ใช่น้ำหนักหมวด
  mara_pact: 0.5,
};
const SIN_CATS = ['greed_harm', 'disturb_monk', 'abuse_elders', 'unjust_judgment', 'adultery', 'love_charm', 'oppress_subjects', 'intoxicants', 'vow_broken', 'kill_for_gain', 'cheat_exploit', 'forbidden_knowledge', 'against_nature', 'mara_pact'];
const FLAG_CATS = ['vow_broken'];
const GAME_CATS = ['vow_broken', 'cheat_exploit', 'keep_goddess_vow', 'forbidden_knowledge', 'against_nature', 'mara_pact'];
// หมวดที่ไม่นับเป็นบาปตามคติพระมาลัยที่หน้าเว็บอ้าง (ส่วนใหญ่ใช้เฉพาะต่างโลก · mara_pact ใช้ได้ทั้งสองโลก)
const ISEKAI_CATS = ['kill_for_gain', 'cheat_exploit', 'keep_goddess_vow', 'forbidden_knowledge', 'against_nature', 'mara_pact'];
// ชื่อไทยที่เนื้อหาใช้แทน id ได้ (ใบ 12 เขียนหมวดเป็นไทย) — ต้องตรงกับ vocab ของด่าน build
const TH = {
  โลภจนเบียดเบียน: 'greed_harm', รบกวนนักบวช: 'disturb_monk', ด่าตีพ่อแม่ผู้ใหญ่: 'abuse_elders', ตัดสินไม่เป็นธรรม: 'unjust_judgment',
  ผิดเมียผู้อื่น: 'adultery', เสน่ห์ยาแฝด: 'love_charm', กดขี่ผู้ใต้ปกครอง: 'oppress_subjects', ดื่มสุรา: 'intoxicants', บนแล้วไม่แก้: 'vow_broken',
  ทาน: 'dana', ศีล: 'sila', ภาวนา: 'bhavana', ดูแลพ่อแม่: 'care_parents', ช่วยคน: 'help_others', กลาง: 'neutral',
  ฆ่าเพื่อแต้ม: 'kill_for_gain', ใช้สกิลโกงเอาเปรียบ: 'cheat_exploit', รักษาสัญญาเทพธิดา: 'keep_goddess_vow',
  ความรู้อันตราย: 'forbidden_knowledge', ฝืนธรรมชาติ: 'against_nature', สัญญากับมาร: 'mara_pact',
};
const meritId = (cat) => TH[cat] ?? cat;
const TH_BY_ID = Object.fromEntries(Object.entries(TH).map(([th, id]) => [id, th]));
const meritName = (id) => TH_BY_ID[id] ?? id;

// กรรมตามทัน (ใบ 09): ตัวคูณโอกาสตายจากบัญชีสุทธิ อิ่มตัวที่ ±ref · บาปเพิ่มเสี่ยงแรงกว่าบุญลด (ทรงเดียวกับตัวคูณสุขภาพ)
// เจ้าของเคาะค่าเริ่ม บาปสุด ×2.0 · บุญสุด ×0.75
const KARMA = { ref: 10, sinMax: 2, meritMin: 0.75 };
// สเกลอ้างอิงที่เนื้อหาชี้ด้วย ref_scale: table.<ชื่อ> (ใบ 12 หวยสายมู) — บัญชีสุทธิเท่านี้ขึ้นไป = บุญเต็ม
// ค่าเริ่มเท่า KARMA.ref ให้ "บุญเต็ม" ของหวยกับของกรรมตามทันเป็นจุดเดียวกัน
const REF_TABLE = { merit_ref: 10 };

// ลาง (ใบ 09): ออกเมื่อบัญชีข้ามเกณฑ์ ห่างกันอย่างน้อย gap ปี · ไม่ดึงเลขสุ่มของโลก ชะตาจึงเหมือนเดิมถึงจะไม่มีลาง
const OMEN = { at: 0.5, gap: 5 };
// ข้อความห้ามบอกตัวเลข ห้ามบอกเหตุ (ไม่พูดว่าเพราะทำบุญ/ทำบาป) — เป็นแค่บรรยากาศ
const OMEN_TEXT = {
  good: [
    'คืนนี้ฝันเห็นดอกบัวบานเต็มสระ ตื่นมาใจโปร่งอย่างบอกไม่ถูก',
    'นกเขาร้องรับแต่เช้า คนแถวบ้านทักว่าหน้าตาดูสดใส',
    'เดินผ่านวัดได้ยินเสียงระฆัง รู้สึกเบาใจไปทั้งวัน',
  ],
  bad: [
    'ฝันว่าฟันหลุด ตื่นมาใจคอไม่ดีทั้งวัน',
    'จิ้งจกทักตอนกำลังจะออกจากบ้าน ใจหวิว ๆ ไม่รู้เพราะอะไร',
    'นอนไม่ค่อยหลับหลายคืนติด รู้สึกเหมือนมีอะไรค้างคาใจ',
  ],
};

function newLedger() {
  return { merit: 0, sin: 0, byCat: {}, broken: {} };
}

// บันทึกป้ายของตัวเลือกที่เลือก · key = คำบนที่ผิด (vow_broken ติดครั้งเดียวต่อคำบน ไม่ทบ — ใบ 09)
// คืนรายการหมวดธงที่เพิ่งติด ให้แกนตั้งธงตาม
function recordMerit(ledger, tags = [], key = '') {
  const flags = [];
  for (const t of tags) {
    const id = meritId(t.cat);
    if (id === 'neutral') continue;
    const w = MERIT_WEIGHTS[id];
    if (w === undefined) throw new Error(`หมวดบุญบาปไม่รู้จัก: ${t.cat}`);
    let v;
    if (FLAG_CATS.includes(id)) {
      const k = `${id}:${key}`;
      if (ledger.broken[k]) continue;
      ledger.broken[k] = true;
      flags.push(id);
      v = w;
    } else {
      const lv = MERIT_LEVELS[t.level];
      if (lv === undefined) throw new Error(`ระดับบุญบาปต้องเป็น 1–3 ได้ ${t.level}`);
      v = w * lv;
    }
    ledger.byCat[id] = (ledger.byCat[id] ?? 0) + v;
    if (SIN_CATS.includes(id)) ledger.sin += v;
    else ledger.merit += v;
  }
  return flags;
}

// ค่าที่แกนคิดเองไม่ผ่านระดับ 1–3 ของเนื้อหา (เช่น บุญจากแขกงานศพ B25b) · เพดานเป็นหน้าที่ของผู้เรียก
function addMerit(ledger, cat, v) {
  const id = meritId(cat);
  if (!(v > 0) || id === 'neutral') return;
  if (MERIT_WEIGHTS[id] === undefined || FLAG_CATS.includes(id)) throw new Error(`หมวดบุญบาปใช้กับค่าที่แกนคิดไม่ได้: ${cat}`);
  ledger.byCat[id] = (ledger.byCat[id] ?? 0) + v;
  if (SIN_CATS.includes(id)) ledger.sin += v;
  else ledger.merit += v;
}

const netLedger = (ledger) => ledger.merit - ledger.sin;
const ledgerLevel = (ledger) => Math.max(-1, Math.min(1, netLedger(ledger) / KARMA.ref));

function karmaMultiplier(ledger) {
  const x = ledgerLevel(ledger);
  return x < 0 ? 1 - (KARMA.sinMax - 1) * x : 1 - (1 - KARMA.meritMin) * x;
}

// โทนลางตอนนี้: good · bad · null (กลาง)
function omenTone(ledger) {
  const x = ledgerLevel(ledger);
  return x >= OMEN.at ? 'good' : x <= -OMEN.at ? 'bad' : null;
}

function omenText(tone, seed, age) {
  const pool = OMEN_TEXT[tone];
  let h = Math.imul((seed ^ Math.imul(age + 1, 0x27d4eb2f)) >>> 0, 0x165667b1) >>> 0;
  // ^ คืนค่า int32 มีเครื่องหมาย — ไม่ดันกลับเป็น unsigned แล้ว index ติดลบ ได้ undefined ขึ้นการ์ด
  h = (h ^ (h >>> 15)) >>> 0;
  return pool[h % pool.length];
}

// ด่านตารางกลาง: หมวดครบตามรายการ · vow_broken ต้องเบากว่าระดับ 1 ของทุกหมวดเดิม · ตัวคูณกรรมอยู่ข้างที่ถูก
// cats = รายการหมวดของด่าน build [{id, th, kind}] — ตารางนี้กับด่านต้องรู้จักหมวดชุดเดียวกัน ชื่อไทยแปลงได้ตรงกัน
function checkMeritTable(cats, weights = MERIT_WEIGHTS, levels = MERIT_LEVELS, karma = KARMA, game = GAME_CATS) {
  const out = [];
  for (const c of cats) {
    if (c.kind !== 'neutral' && !(weights[c.id] > 0)) out.push(`หมวด ${c.id} ไม่มีน้ำหนักบวกในตารางกลาง`);
    if (meritId(c.th) !== c.id) out.push(`ชื่อไทย ${c.th} แปลงเป็น ${meritId(c.th)} ไม่ใช่ ${c.id}`);
    if ((c.kind === 'sin') !== SIN_CATS.includes(c.id)) out.push(`หมวด ${c.id} ฝั่งบุญ/บาปไม่ตรงกับด่าน`);
    if (!!c.flag !== FLAG_CATS.includes(c.id)) out.push(`หมวด ${c.id} เป็นธงในด่านกับในแกนไม่ตรงกัน`);
  }
  for (const c of Object.keys(weights)) if (!cats.some((x) => x.id === c)) out.push(`ตารางกลางมีหมวด ${c} ที่ไม่อยู่ในรายการของด่าน`);
  if (!(levels[1] > 0 && levels[1] < levels[2] && levels[2] < levels[3])) out.push('น้ำหนักระดับต้องเป็นบวกและเรียง 1 < 2 < 3');
  // เทียบกับหมวดตามคติเท่านั้น — หมวดกลไกเกมด้วยกันหนักเท่ากันได้
  const min1 = Math.min(...Object.keys(weights).filter((c) => !game.includes(c)).map((c) => weights[c] * levels[1]));
  for (const c of game) if (!(weights[c] < min1)) out.push(`${c} (${weights[c]}) ต้องเบากว่าระดับ 1 ของทุกหมวดตามคติ (${min1})`);
  if (!(karma.sinMax >= 1 && karma.meritMin > 0 && karma.meritMin <= 1 && karma.ref > 0)) out.push('ตัวคูณกรรม: sinMax ≥ 1 · 0 < meritMin ≤ 1 · ref > 0');
  return out;
}

// การเรียนต่อเนื่อง + งานแรก (B15): การ์ดที่แกนสร้างเป็น event object รูปเดียวกับเนื้อหา — วิ่งผ่าน eventCard/choose
// ได้ล็อก · ผลสุ่ม · ป้ายบุญบาป · ป้าย % ชุดเดียวกับการ์ดเนื้อหา · ฟังก์ชันล้วน อ่าน state ไม่แก้


// วุฒิเรียงต่ำไปสูง ตรงกับ edu ของอาชีพใน data/finance.json — อาชีพที่วุฒิสูงกว่าที่มีล็อก
const EDU = ['ประถม', 'มัธยม', 'อาชีวะ', 'อุดมศึกษา'];
const eduRank = (e) => EDU.indexOf(e) + 1;

// ช่วงเรียน: จบที่อายุ until แล้วได้วุฒิ edu · ช่วงที่มี gate = จบแล้วมีด่านเลือกเรียนต่อ ไม่มี = หางานทันที
// exam = ชื่อด่านสอบที่การ์ดนำ (prelude.before) ผูกได้ — การ์ดนำเข้าคิวก่อนด่านปีเดียวกัน
const TRACKS = {
  primary: { name: 'ประถม', until: 12, edu: 'ประถม', gate: true },
  lower: { name: 'มัธยมต้น', until: 15, edu: 'มัธยม', gate: true },
  upper: { name: 'มัธยมปลาย', until: 18, edu: 'มัธยม', gate: true, exam: 'uni_exam' },
  voc: { name: 'ปวช.', until: 18, edu: 'อาชีวะ', gate: true, exam: 'uni_exam' },
  hvoc: { name: 'ปวส.', until: 20, edu: 'อาชีวะ' },
  uni: { name: 'มหาวิทยาลัย', until: 22, edu: 'อุดมศึกษา' },
  // จบแล้วติดยศเข้าสายทันที ไม่ต้องหางาน (B40)
  cadet: { name: 'โรงเรียนนายร้อย จปร.', until: 22, edu: 'อุดมศึกษา', ladder: 'army' },
  police_cadet: { name: 'โรงเรียนนายร้อยตำรวจ', until: 22, edu: 'อุดมศึกษา', ladder: 'police' },
};
const EXAMS = [...new Set(Object.values(TRACKS).map((t) => t.exam).filter(Boolean))];
// ธงที่แกนตั้งเมื่อสอบเข้ามหาวิทยาลัยติด (ทุกทางที่มีการสอบ) — การ์ดแก้บนตอนสอบเข้าอ่านธงนี้ ไม่ติด/ไม่ได้สอบ = ไม่ทวง
const EXAM_PASS = 'exam_pass:uni';
// สอบเข้าโรงเรียนนายร้อยต้องผ่านทั้งข้อเขียนและร่างกาย · สอบ ก.พ. ต้องจบปริญญา (B40)
const CADET_NEED = { stats: { knowledge: { min: 45 }, health: { min: 50 } }, reason: 'ความรู้หรือชีวิตยังไม่ถึงเกณฑ์สอบ' };
const SCHOOL_FROM = 6;
// ทุนสอบชิงมีภาระใช้ทุน (B118): ธงค้างจนการ์ดชดใช้ทุนเคลียร์ · การ์ดอยู่ใน content/scholarship_bond.yaml
const BOND_FLAG = 'scholar_bond';
const BOND_EVENT = 'scholar_bond_due';
const UNI_YEARS = TRACKS.uni.until - TRACKS.upper.until;

const cash = (amount) => ({ unit: 'income_x', amount });
const pay = (amount) => ({ money: cash(-amount) });
const SIN_LIGHT = [{ cat: 'greed_harm', level: 1 }];
// ทางขอพร: น้ำหนักทางสำเร็จเอียงตามบัญชีบุญบาปแบบต่อเนื่อง (บุญน้อย = เอียงน้อย) — หน้าจอโชว์ ? ไม่โชว์ %
const WISH = 3;
// ก่อนอายุนี้ผู้เล่นยังเป็นเด็ก (B61): ด่านจบประถมและการ์ดหางานพูดด้วยเสียงเด็ก — ขอที่บ้าน · อ่านหนังสือ · ขอผู้ใหญ่ช่วย
// ผลเงิน/บาป/วุฒิเท่าเดิมทุกทาง เงินที่จ่ายยังเป็นเงินก้อนเดียวกับตัวผู้เล่น ไม่แยกเงินบ้าน
const CHILD_UNTIL = TRACKS.lower.until;

// ด่านเรียนต่อตอนจบช่วงเรียน · ทุกด่านมีทาง "ออกไปทำงาน" ที่ไม่ล็อก การ์ดจึงไม่ค้าง
function schoolGate(st) {
  const t = TRACKS[st.school];
  const id = `school_gate_${st.school}`;
  const base = { id, type: 'A', text: `อายุ ${st.age} ปี เรียนจบ${t.name}แล้ว จะเอายังไงต่อ` };
  if (st.school === 'primary') {
    return {
      ...base,
      choices: [
        { text: 'เรียนต่อ ม.ต้นใกล้บ้าน', effects: { school: 'lower', knowledge: 1 } },
        {
          text: 'อ่านหนังสือสอบโรงเรียนดังในเมือง',
          requires: { money: cash(0.3), reason: 'ที่บ้านไม่มีค่าเทอมค่ารถให้' },
          outcomes: [
            { weight: 1, ok: true, multipliers: { stats: { knowledge: 2 } }, text: 'สอบติดโรงเรียนดัง เพื่อนใหม่มาจากทั่วเมือง', effects: { school: 'lower', network: 2, ...pay(0.3) } },
            { weight: 1, text: 'สอบไม่ติด กลับมาเรียนโรงเรียนใกล้บ้าน', effects: { school: 'lower', happiness: -1 } },
          ],
        },
        {
          text: 'ขอผู้ปกครองจ่ายแป๊ะเจี๊ยะ',
          requires: { money: cash(1), reason: 'ที่บ้านไม่มีเงินจ่ายแป๊ะเจี๊ยะ' },
          effects: pay(1),
          merit: SIN_LIGHT,
          outcomes: [
            { weight: 4, ok: true, text: 'ได้ที่นั่งในโรงเรียนดังโดยไม่ต้องสอบ', effects: { school: 'lower', network: 2 } },
            { weight: 1, text: 'เรื่องเงินใต้โต๊ะเป็นข่าว ต้องย้ายกลับโรงเรียนเดิม', effects: { school: 'lower', happiness: -1, relations: -1 } },
          ],
        },
        {
          text: 'ขอพรหลวงพ่อก่อนสอบโรงเรียนดัง',
          requires: { money: cash(0.3), reason: 'ที่บ้านไม่มีค่าเทอมค่ารถให้' },
          outcomes: [
            { weight: 1, ok: true, multipliers: { wish: WISH, stats: { knowledge: 2 } }, text: 'สอบติดโรงเรียนดัง เพื่อนใหม่มาจากทั่วเมือง', effects: { school: 'lower', network: 2, ...pay(0.3) } },
            { weight: 1, text: 'สอบไม่ติด กลับมาเรียนโรงเรียนใกล้บ้าน', effects: { school: 'lower', happiness: -1 } },
          ],
        },
        // บวชเณรได้เฉพาะชาย — ตัวเลือกที่เหลือยังครบขั้นต่ำ 4 ทางสำหรับหญิง
        ...(st.sex === 'ชาย' ? [{ text: 'บวชเณรเรียนที่วัด', effects: { school: 'lower', relations: -1, network: 1 }, merit: [{ cat: 'sila', level: 1 }] }] : []),
        { text: 'ออกมาช่วยทำงานหาเงิน', effects: { school: 'none', happiness: -1 } },
      ],
    };
  }
  if (st.school === 'lower') {
    return {
      ...base,
      choices: [
        { text: 'เรียนต่อ ม.ปลาย', requires: { money: cash(0.1), reason: 'ค่าเทอมไม่พอ' }, effects: { school: 'upper', knowledge: 1, ...pay(0.1) } },
        { text: 'เรียนสายอาชีพ ปวช.', requires: { money: cash(0.1), reason: 'ค่าเทอมไม่พอ' }, effects: { school: 'voc', network: 1, ...pay(0.1) } },
        {
          text: 'สอบเข้า ม.ปลายโรงเรียนดัง',
          requires: { money: cash(0.3), stats: { knowledge: { min: 55 } }, reason: 'คะแนนหรือค่าเทอมยังไม่ถึง' },
          outcomes: [
            { weight: 1, ok: true, multipliers: { stats: { knowledge: 2 } }, text: 'สอบติด ม.ปลายโรงเรียนดัง', effects: { school: 'upper', network: 2, ...pay(0.3) } },
            { weight: 1, text: 'สอบไม่ติด เรียน ม.ปลายโรงเรียนเดิม', effects: { school: 'upper', happiness: -1 } },
          ],
        },
        {
          text: 'ลอกข้อสอบเพื่อนในห้องสอบ',
          requires: { money: cash(0.3), reason: 'ค่าเทอมไม่พอ' },
          merit: SIN_LIGHT,
          outcomes: [
            { weight: 3, ok: true, text: 'ลอกทันเวลา สอบติดโรงเรียนดัง', effects: { school: 'upper', network: 2, ...pay(0.3) } },
            { weight: 1, text: 'กรรมการจับได้ ถูกตัดสิทธิ์ ต้องเรียนโรงเรียนเดิม', effects: { school: 'upper', happiness: -2, relations: -1 } },
          ],
        },
        {
          text: 'ขอพรก่อนสอบโรงเรียนดัง',
          requires: { money: cash(0.3), stats: { knowledge: { min: 55 } }, reason: 'คะแนนหรือค่าเทอมยังไม่ถึง' },
          outcomes: [
            { weight: 1, ok: true, multipliers: { wish: WISH, stats: { knowledge: 2 } }, text: 'สอบติด ม.ปลายโรงเรียนดัง', effects: { school: 'upper', network: 2, ...pay(0.3) } },
            { weight: 1, text: 'สอบไม่ติด เรียน ม.ปลายโรงเรียนเดิม', effects: { school: 'upper', happiness: -1 } },
          ],
        },
        { text: 'ออกไปทำงานเลย', effects: { school: 'none' } },
      ],
    };
  }
  // จบ ม.ปลาย หรือ ปวช. — ด่านสุดท้ายก่อนมหาวิทยาลัย
  const exam = (multipliers) => [
    { weight: 1, ok: true, multipliers, text: 'สอบติดมหาวิทยาลัยรัฐ', sets_flags: [EXAM_PASS], effects: { school: 'uni', network: 2, ...pay(0.5) } },
    { weight: 1, text: 'สอบไม่ติด ต้องออกหางานทำ', effects: { school: 'none', happiness: -1 } },
  ];
  const uniLock = { money: cash(0.5), reason: 'ค่าเทอมมหาวิทยาลัยไม่พอ' };
  // hint แยกรายการค่าเรียน (B118) — บอกว่าเงินก้อนนี้ไปกับอะไรบ้าง ยอดรวมเท่าเดิม
  const uniHint = 'ค่าเทอม · ค่าสมัครสอบ · หอพักถ้าติดไกลบ้าน';
  return {
    ...base,
    choices: [
      { text: 'สอบเข้ามหาวิทยาลัยรัฐ', hint: uniHint, requires: uniLock, outcomes: exam({ stats: { knowledge: 3, network: 1.5 } }) },
      { text: 'เข้ามหาวิทยาลัยเอกชน', hint: 'ค่าเทอมแพง · หอพัก · ค่ารถ', requires: { money: cash(2), reason: 'ค่าเทอมเอกชนไม่พอ' }, effects: { school: 'uni', network: 1, ...pay(2) } },
      { text: 'เรียนมหาวิทยาลัยเปิด', hint: 'ค่าลงทะเบียน · ค่าตำรา · อ่านเองที่บ้านไม่ต้องเช่าหอ', requires: { money: cash(0.15), reason: 'ค่าลงทะเบียนไม่พอ' }, effects: { school: 'uni', knowledge: 1, ...pay(0.15) } },
      { text: 'เรียนต่อ ปวส.', hint: 'ค่าเทอม · ค่าอุปกรณ์ฝึกงาน · ค่ารถไปกลับ', requires: { money: cash(0.3), reason: 'ค่าเทอมไม่พอ' }, effects: { school: 'hvoc', network: 1, ...pay(0.3) } },
      {
        text: 'สอบชิงทุนเรียนมหาวิทยาลัย',
        hint: 'ไม่เสียค่าเทอม แต่เรียนจบต้องใช้ทุน',
        requires: { stats: { knowledge: { min: 70 } }, reason: 'คะแนนยังไม่ถึงเกณฑ์ทุน' },
        outcomes: [
          // ทุนรัฐมีสัญญาใช้ทุน — การ์ดชดใช้ทุนออกปีที่เรียนจบ (TRACKS.uni.until)
          { weight: 1, ok: true, multipliers: { stats: { knowledge: 2 } }, text: 'ได้ทุนเรียนฟรีจนจบ แลกกับสัญญาใช้ทุนหลังเรียนจบ', sets_flags: [EXAM_PASS, BOND_FLAG], schedules: [{ event: BOND_EVENT, after_years: [UNI_YEARS, UNI_YEARS] }], effects: { school: 'uni', network: 3 } },
          { weight: 2, text: 'พลาดทุน ต้องออกหางานทำ', effects: { school: 'none', happiness: -1 } },
        ],
      },
      { text: 'ใช้ทุนที่ได้ไว้เรียนต่อ', hint: 'ทุนจ่ายค่าเทอมให้', requires: { flags: { has: ['scholarship'] }, reason: 'ยังไม่มีทุน' }, clears_flags: ['scholarship'], effects: { school: 'uni', network: 2 } },
      {
        text: 'จ้างคนเข้าห้องสอบแทน',
        requires: { money: cash(1.5), reason: 'เงินไม่พอจ้างมือปืนรับจ้างสอบ' },
        effects: pay(1),
        merit: [{ cat: 'greed_harm', level: 2 }],
        outcomes: [
          { weight: 3, ok: true, text: 'คนสอบแทนทำคะแนนให้จนติด', sets_flags: [EXAM_PASS], effects: { school: 'uni', network: 1, ...pay(0.5) } },
          { weight: 1, text: 'กรรมการตรวจบัตรจับได้ ถูกตัดสิทธิ์สอบ', effects: { school: 'none', happiness: -2, relations: -1 } },
        ],
      },
      { text: 'ขอพรก่อนสอบมหาวิทยาลัยรัฐ', hint: uniHint, requires: uniLock, outcomes: exam({ wish: WISH, stats: { knowledge: 3, network: 1.5 } }) },
      // ชื่อปุ่มสองโรงเรียนต้องแยกกันออกตั้งแต่อ่านครั้งแรก — ต่อกันแค่คำว่า "ตำรวจ" ผู้เล่นเดาไม่ออกว่าอันแรกคือทหาร (B125)
      ...[
        ['cadet', 'สอบเข้านายร้อย จปร. (ทหารบก)', 'ไม่เสียค่าเทอม · จบแล้วติดยศร้อยตรี'],
        ['police_cadet', 'สอบเข้านายร้อยตำรวจ (สามพราน)', 'ไม่เสียค่าเทอม · จบแล้วติดยศร้อยตำรวจตรี'],
      ].map(([school, text, hint]) => ({
        text,
        hint,
        requires: CADET_NEED,
        outcomes: [
          { weight: 1, ok: true, multipliers: { stats: { knowledge: 2, health: 1.5 } }, text: `สอบติด ได้เข้า${TRACKS[school].name}`, effects: { school, network: 1 } },
          { weight: 1.2, text: 'สอบไม่ติด ต้องออกหางานทำ', effects: { school: 'none', happiness: -1 } },
        ],
      })),
      { text: 'ออกไปหางานทำ', effects: { school: 'none' } },
    ],
  };
}

// การ์ดงานแรก: สุ่มอาชีพที่เปิดรับจากน้ำหนักตามฐานะ เอียงขึ้นตามคอนเน็คชั่น ด้วย stream แยก (ไม่กินเลขสุ่มของโลก)
// อาชีพที่วุฒิเกินยังโชว์เป็นทางล็อก · ทางสมัครมีผลได้/ไม่ได้ · ไม่ได้ = รับจ้างทั่วไป
const JOB_OFFERS = 4;
const JOB_EXTRA_AT = 70;
const JOB_OPEN_MIN = 2;
function jobCard(st) {
  const f = st.content.era.finance;
  const occs = f.occupations;
  const top = occs.length - 1;
  const rank = new Map([...occs].sort((a, b) => a.wage - b.wage).map((o, r) => [o.id, r]));
  const tilt = (st.network - 50) / 50;
  const w = f.occByClass[st.cls].map((x, i) => x * Math.exp(tilt * (rank.get(occs[i].id) / top)));
  const rng = makeRng((st.seed ^ 0x1f83d9ab ^ Math.imul(st.age + 1, 0x9e3779b1)) >>> 0);
  const tooLow = (o) => eduRank(o.edu) > eduRank(st.edu);
  const pool = occs.map((o, i) => ({ o, w: w[i] })).filter((x) => x.o.id !== 'labor' && x.o.id !== st.familyOcc);
  const n = JOB_OFFERS + (st.network >= JOB_EXTRA_AT ? 1 : 0);
  const picked = [];
  const draw = (ok) => {
    const from = pool.filter((x) => ok(x.o));
    if (!from.length) return false;
    let r = rng.next() * from.reduce((s, x) => s + x.w, 0);
    let i = 0;
    for (; i < from.length - 1; i++) if ((r -= from[i].w) < 0) break;
    picked.push(from[i].o);
    pool.splice(pool.indexOf(from[i]), 1);
    return true;
  };
  // งานที่วุฒิถึงได้ที่ก่อน JOB_OPEN_MIN ใบ — สุ่มล้วนแล้ววุฒิต่ำเจอแต่ทางล็อก การ์ดไม่เหลือทางให้เลือก
  for (let k = 0; k < JOB_OPEN_MIN && draw((o) => !tooLow(o)); k++);
  while (picked.length < n && draw(() => true));
  picked.sort((a, b) => a.wage - b.wage);
  const okWeight = (o) => 3 - (2 * rank.get(o.id)) / top;
  const lock = (o) => (tooLow(o) ? { edu: o.edu, reason: `ต้องจบ${o.edu}` } : undefined);
  const apply = (o, ok, multipliers) => [
    { weight: ok, ok: true, multipliers, text: `ได้งาน${o.name}`, effects: { job: o.id } },
    { weight: 1, text: `ไม่ได้งาน${o.name} ต้องรับจ้างทั่วไปไปก่อน`, effects: { job: 'labor', happiness: -1 } },
  ];
  const choices = picked.map((o) => ({ text: `สมัครงาน${o.name}`, requires: lock(o), outcomes: apply(o, okWeight(o), { stats: { network: 1.6, knowledge: 1.4 } }) }));
  const fam = occs.find((o) => o.id === st.familyOcc);
  if (fam.id !== 'labor') choices.push({ text: `สืบต่องานบ้าน ${fam.name}`, effects: { job: fam.id, relations: 1 } });
  choices.push({ text: 'รับจ้างทั่วไปไปก่อน', effects: { job: 'labor' } });
  if (eduRank(st.edu) >= eduRank('อุดมศึกษา')) {
    choices.push({
      text: 'สอบ ก.พ. เข้ารับราชการ',
      outcomes: [
        { weight: 1.5, ok: true, multipliers: { stats: { knowledge: 1.6 } }, text: 'สอบผ่าน ได้บรรจุเป็นข้าราชการ', effects: { ladder: 'gov' } },
        { weight: 1, text: 'สอบไม่ผ่าน ต้องรับจ้างทั่วไปไปก่อน', effects: { job: 'labor', happiness: -1 } },
      ],
    });
  }
  // ทางพิเศษเล็งงานที่ดีที่สุดที่วุฒิถึง · ไม่มีงานไหนวุฒิถึงเลย = ไม่มีทางพิเศษ
  const target = picked.filter((o) => !tooLow(o)).at(-1);
  const child = st.age < CHILD_UNTIL;
  if (target) {
    const k = okWeight(target);
    const tutor = child
      ? { text: `ขอค่าติวสมัคร${target.name}`, hint: 'ขอเงินที่บ้านไปเรียนพิเศษก่อนไปสมัคร', requires: { money: cash(0.5), reason: 'ที่บ้านไม่มีเงินค่าติวให้' } }
      : { text: `ทุ่มเงินติวสมัคร${target.name}`, requires: { money: cash(0.5), reason: 'เงินไม่พอค่าติว' } };
    choices.push(
      { ...tutor, effects: pay(0.5), outcomes: apply(target, k * 2.5, { stats: { network: 1.6, knowledge: 1.4 } }) },
      {
        text: child ? `ขอผู้ใหญ่ฝากเข้า${target.name}` : `ฝากเส้นเข้า${target.name}`,
        requires: { stats: { network: { min: 50 } }, reason: child ? 'ไม่มีผู้ใหญ่ที่รู้จักให้ฝาก' : 'ไม่มีคนรู้จักให้ฝาก' },
        merit: SIN_LIGHT,
        outcomes: [
          { weight: k * 4, ok: true, text: `ได้งาน${target.name}ตามที่${child ? 'ผู้ใหญ่' : ''}ฝากไว้`, effects: { job: target.id } },
          { weight: 1, text: 'เรื่องฝากงานรู้ถึงหูหัวหน้า ถูกเลิกจ้างก่อนเริ่มงาน', effects: { job: 'labor', happiness: -1, relations: -1 } },
        ],
      },
      { text: `ขอพรก่อนไปสมัคร${target.name}`, outcomes: apply(target, k, { wish: WISH, stats: { network: 1.6, knowledge: 1.4 } }) },
    );
  }
  return {
    id: 'first_job',
    type: 'A',
    text: `อายุ ${st.age} ปี ${st.edu ? `วุฒิ${st.edu}` : 'ไม่มีวุฒิ'} ${child ? 'ต้องออกไปหางานช่วยที่บ้าน' : 'ถึงเวลาหางานทำ'} เงินติดตัว {เงิน} บาท`,
    choices,
  };
}

// คนรู้จักช่วยรับวิกฤต (B40): คอนเน็คชั่นตั้งแต่ from โอกาส (คอนเน็คชั่น − base) / span · ช่วยแล้วผลร้ายเหลือครึ่งแบบญาติช่วย
// วิกฤต = การ์ดรับมือเหตุบ้านเมือง · การ์ดสุขภาพ · ผลที่ทำให้คนมีงานตกไปรับจ้างทั่วไป · ทอยด้วย stream แยก เฉพาะตอนเข้าเกณฑ์
const NET_AID = { from: 60, base: 50, span: 120 };
const NET_WHO = { health: 'หมอรุ่นพี่ที่รู้จักกัน', job: 'อดีตหัวหน้าเก่า', era: 'เพื่อนเก่าที่ทำงาน' };
function netAid(st, ev, o) {
  // คนรู้จักในที่นี้มาจากที่ทำงาน — ยังไม่เคยทำงานไม่มีใครให้พึ่ง
  if (st.network < NET_AID.from || st.workFrom === null) return null;
  const kind = o.effects?.job === 'labor' && st.workFrom !== null && st.occupation !== 'labor' ? 'job' : ev.category === 'health' ? 'health' : ev.era ? 'era' : null;
  if (!kind) return null;
  st.netRng ??= makeRng((st.seed ^ 0x9b05688c) >>> 0);
  if (st.netRng.next() >= (st.network - NET_AID.base) / NET_AID.span) return null;
  const sex = st.netRng.next() < 0.5 ? 'ชาย' : 'หญิง';
  const taken = [st.name, ...(st.kin ?? []).map((m) => m.name)];
  return { who: NET_WHO[kind], name: pickName(st.netRng.int(1, 0x7fffffff), sex, st.birthYear, st.content.era.names, taken) };
}

// สายยศ/ตำแหน่ง (B40): ขั้นในสายอาชีพเลื่อนตามปีในขั้น + ค่าที่เกี่ยว ผ่านการ์ดเลื่อนขั้นที่แกนสร้าง (วิ่งผ่าน eventCard/choose เหมือนการ์ดเนื้อหา)
// ตำแหน่งการเมือง (office) แยกจากสายอาชีพ: ขั้นท้องถิ่นทำควบงานเดิม ขั้นระดับชาติเป็นงานเต็มเวลา — B79 อ่าน st.office ต่อ
// เวลาที่การ์ดโผล่สุ่มจาก stream แยก (rankRng) · ผลสุ่มในการ์ดใช้ rng ของโลกเพราะเป็นผลของการเลือก


const rankCash = (amount) => ({ unit: 'income_x', amount });
const RANK_WISH = 3;
const BRIBE = [{ cat: 'greed_harm', level: 1 }];
const VOTE_BUY = [{ cat: 'greed_harm', level: 2 }];

// ค่าตั้งของเกม (เจ้าของเคาะเป้าความหายากของยอดแต่ละสาย จูนด้วย build/b40-check.mjs):
// years = ปีขั้นต่ำในขั้นก่อนมีการ์ดเลื่อน · need = ค่าที่ต้องถึงถึงจะกดทางทำผลงาน · odds = น้ำหนักทางสำเร็จพื้น (ทางล้มเหลวหนัก 1)
const PROMO = {
  gov: [
    { years: 4, need: { knowledge: 50 }, odds: 3 },
    { years: 5, need: { knowledge: 60, network: 45 }, odds: 1.5 },
    { years: 5, need: { network: 60 }, odds: 0.8 },
    { years: 3, need: { network: 70 }, odds: 0.6 },
  ],
  army: [
    { years: 5, need: { health: 50 }, odds: 3 },
    { years: 6, need: { knowledge: 55, health: 50 }, odds: 2 },
    { years: 5, need: { network: 55 }, odds: 3 },
    { years: 3, need: { network: 60 }, odds: 3 },
  ],
  private: [
    { years: 3, need: { knowledge: 45 }, odds: 3 },
    { years: 4, need: { knowledge: 55, network: 45 }, odds: 2 },
    { years: 5, need: { network: 55 }, odds: 2 },
    { years: 4, need: { network: 65, knowledge: 60 }, odds: 1.6 },
  ],
  trade: [
    { years: 5, need: { knowledge: 35 }, odds: 2 },
    { years: 7, need: { relations: 50 }, odds: 1 },
  ],
  // นักล่า (โลกซ้อนทับขั้น 3): ขั้นล่างวัดร่างกาย ขั้นบนวัดเส้นสาย
  hunter: [
    { years: 3, need: { health: 50 }, odds: 3 },
    { years: 4, need: { health: 55, knowledge: 50 }, odds: 2 },
    { years: 5, need: { network: 60 }, odds: 1 },
  ],
};
// ตำรวจไต่ช้ากว่าทหาร — คนเข้าสายตำรวจมากกว่า (เปิดรับกลางทาง) ยอดสองสายจึงหายากใกล้กัน
PROMO.police = [
  { years: 5, need: { health: 50 }, odds: 3 },
  { years: 6, need: { knowledge: 55, health: 50 }, odds: 1.5 },
  { years: 5, need: { network: 60 }, odds: 0.8 },
  { years: 3, need: { network: 70 }, odds: 0.6 },
];
// การเมือง: ทุก term ปีมีการ์ดเลือกตั้ง · entry = โอกาสต่อปีที่ชาวบ้านชวนลงสมัครครั้งแรก (คอนเน็คชั่นถึง minNet)
// odds[r] = น้ำหนักชนะตอนชิงขั้น r · ขั้นที่ full = งานเต็มเวลา รายได้ตำแหน่งแทนงานเดิม และไม่เกษียณตามอายุ
// ผู้ใหญ่บ้าน/กำนันอยู่ได้ถึงอายุ 60 ตามกฎหมาย — ชวนลงสมัครครั้งแรกจึงหยุดก่อนนั้น (ซ้ำค่า RETIRE_AGE ของ life.mjs เพื่อไม่ import วน)
const RETIRE_AT = 60;
// net = ส่วนของค่าตอบแทนท้องถิ่นที่เหลือจริง · ติดลบ = ควักเนื้อเกินค่าตอบแทน (−0.25 = ขาดทุนหนึ่งในสี่ของค่าตอบแทน · −0.5 ขึ้นไปล้มละลายเกิน 8% บนฐานที่มีเงินสัตว์ B44) — ผู้ใหญ่บ้าน/กำนันต้องช่วยงานบวช งานศพ ค่าน้ำมันวิ่งงานชาวบ้าน (ค่าตั้ง)
// campaign = ค่าหาเสียงต่อการลงสมัคร เป็นเท่าของเงินเก็บต่อปี × (ขั้น+1)
const OFFICE = { net: -0.25, campaign: 1.5, term: 4, entry: 0.2, minNet: 45, ageFrom: 25, ageTo: RETIRE_AT - 1, keep: 2.5, fame: 0.5, odds: [2, 1.2, 0.8, 0.5, 0.018] };

const ladderOf = (st) => st.ladder && st.content.era.careers.ladders[st.ladder.id];
const stepOf = (st) => ladderOf(st).steps[st.ladder.rank];
const officeStep = (st) => st.office && st.content.era.careers.office.steps[st.office.rank];
const officeFull = (st) => !!officeStep(st)?.full;

// ค่าจ้างตามบัญชีเงินเดือน (บาท/เดือน ของปีอ้างอิงค่าจ้าง) ปรับตามดัชนีค่าแรงขั้นต่ำแบบเดียวกับอาชีพ — บัญชีเป็นของทั้งประเทศ จึงไม่คูณสัดส่วนภาค
const scaled = (st, baht, year) => baht * (minWage(st.content.era, st.seed, year) / minWage(st.content.era, st.seed, st.content.era.finance.refYear));

// ค่าจ้าง/เดือนจากงาน (ก่อนตัวคูณรายได้ถาวร): ขั้นที่มีบัญชีเงินเดือนใช้บัญชี · ขั้นเอกชน = ค่าจ้างอาชีพ × ตัวคูณขั้น ไม่ต่ำกว่าเพดานล่างของขั้น
function jobWage(st, year) {
  const base = monthlyWage(st.content.era, st.seed, st.occupation, st.ses, year);
  if (!st.ladder) return base;
  const s = stepOf(st);
  if (s.pay !== undefined && s.mul === undefined) return scaled(st, s.pay, year);
  return Math.max(base * (s.mul ?? 1), s.pay ? scaled(st, s.pay, year) : 0);
}

// ค่าตอบแทนตำแหน่งการเมือง/เดือน: ขั้นท้องถิ่นบวกเพิ่มจากงาน · ขั้นเต็มเวลาผู้เรียกใช้แทนงาน
const officePay = (st, year) => (st.office ? scaled(st, officeStep(st).pay, year) * (officeFull(st) ? 1 : OFFICE.net) : 0);

// ชื่อขั้น: ขั้นที่มีชื่อแทนชื่ออาชีพ · ขั้นไม่มีชื่อ = ชื่ออาชีพ (+คำต่อท้ายของสายอาชีพ)
const stepName = (st, rank) => {
  const s = ladderOf(st).steps[rank];
  return s.name ?? `${st.occupationName}${s.suffix ?? ''}`;
};

// ชื่อบนจอ: ขั้นในสาย · ตำแหน่งการเมืองต่อท้าย
function rankName(st) {
  const job = st.ladder ? stepName(st, st.ladder.rank) : st.occupationName;
  if (!st.office) return job;
  return officeFull(st) ? officeStep(st).name : `${job} · ${officeStep(st).name}`;
}

// เข้าสายตามงานที่ได้ (effects.job): อาชีพที่มีสายเอกชน/สายอาชีพสั้นเริ่มขั้นของอาชีพนั้น · งานอื่นออกจากสายเดิม
function enterByJob(st, occ) {
  const L = st.content.era.careers.ladders;
  const id = Object.keys(L).find((k) => L[k].occs?.includes(occ));
  st.ladder = id ? { id, rank: L[id].start?.[occ] ?? 0, since: st.age, prog: 0 } : null;
}

// เข้าสายราชการ/ทหาร/ตำรวจ (effects.ladder): อาชีพเปลี่ยนตามขั้น ให้การ์ดเนื้อหาที่กรองด้วยอาชีพยังเจอคนในสายนี้
function enterLadder(st, id) {
  st.ladder = { id, rank: 0, since: st.age, prog: 0, from: st.age };
  syncOcc(st);
}
function syncOcc(st) {
  const occ = stepOf(st).occ;
  if (!occ) return;
  const o = st.content.era.finance.occupations.find((x) => x.id === occ);
  st.occupation = o.id;
  st.occupationName = o.name;
}

// ผลของการ์ดเลื่อนขั้น: +1 = ได้เลื่อน · 0 = ไม่ได้ รอบหน้านับปีใหม่เต็มรอบ
// (เดิมนับครึ่งรอบ การ์ดขั้นเดิมวนกลับมาทุก 2–4 ปี เจ้าของเห็นว่าซ้ำ)
function promote(st, n) {
  if (n > 0) {
    st.ladder.rank += 1;
    st.ladder.since = st.age;
  }
  st.ladder.prog = 0;
  if (n > 0) syncOcc(st);
}

// ผลของการ์ดเลือกตั้ง: เลขขั้นที่ได้ · -1 = หลุดจากตำแหน่ง
function setOffice(st, rank) {
  st.office = rank < 0 ? null : { rank, since: st.age, next: st.age + OFFICE.term };
  // ตำแหน่งสูงสุดที่เคยได้ — ชื่อเสียงตระกูล/เป้าตระกูลการเมืองอ่านตอนตาย (ตำแหน่งปัจจุบันหายเมื่อแพ้)
  if (rank >= 0) st.officeTop = Math.max(st.officeTop ?? -1, rank);
}

// สุขต่ำทำให้ปีในขั้นนับช้าลง (ตัวคูณเดียวกับการเรียน) — ผู้เรียกส่งตัวคูณเข้ามา
function ageRank(st, mood) {
  if (st.ladder && PROMO[st.ladder.id]?.[st.ladder.rank]) st.ladder.prog += mood;
}

// ปีนี้ถึงคิวการ์ดเลื่อนขั้นไหม (ไม่ดึงเลขสุ่ม)
const promoDue = (st) => {
  const p = st.ladder && PROMO[st.ladder.id]?.[st.ladder.rank];
  return !!p && st.ladder.prog >= p.years;
};

// "อีกราว N ปีจะเลื่อนขั้น" — บอกทิศ ไม่บอกสูตร · ค่าไม่ถึง = บอกว่าต้องเก่งขึ้นก่อน
function promoText(st, mood) {
  const p = st.ladder && PROMO[st.ladder.id]?.[st.ladder.rank];
  if (!p) return null;
  const short = Object.entries(p.need).some(([k, v]) => st[k] < v);
  const n = Math.max(1, Math.ceil((p.years - st.ladder.prog) / mood));
  return short ? `ต้องเก่งขึ้นอีกหน่อยถึงจะมีลุ้นเลื่อนขั้น` : `อีกราว ${n} ปีมีลุ้นเลื่อนขั้น`;
}

const STAT_TH = { health: 'ชีวิต', knowledge: 'ความรู้', relations: 'ความสัมพันธ์', network: 'เส้นสาย' };
const needText = (need) => `${Object.keys(need).map((k) => STAT_TH[k]).join('/')}ยังไม่ถึง`;

// การ์ดเลื่อนขั้น: รอตามคิว (ไม่ล็อก การ์ดจึงไม่ค้าง) · ทำผลงาน (ค่าถึงเกณฑ์) · วิ่งเต้น (บาป) · ขอพร
function promoCard(st) {
  const p = PROMO[st.ladder.id][st.ladder.rank];
  const next = stepName(st, st.ladder.rank + 1);
  const lift = { stats: Object.fromEntries(Object.keys(p.need).map((k) => [k, 1.5])) };
  const win = (w, multipliers = lift) => ({ weight: w, ok: true, multipliers, text: `ได้เลื่อนเป็น${next}`, effects: { promote: 1, happiness: 1 } });
  const miss = (text, fx = {}) => ({ weight: 1, text, effects: { promote: 0, ...fx } });
  const k = 0.5 + st.ladder.rank * 0.5;
  return {
    id: `promo_${st.ladder.id}_${st.ladder.rank}`,
    category: 'work_money',
    type: 'A',
    text: `อายุ ${st.age} ปี ทำงานเป็น${stepName(st, st.ladder.rank)}มา ${st.age - st.ladder.since} ปี รอบประเมินเลื่อนเป็น${next}มาถึงแล้ว`,
    choices: [
      { text: 'ตั้งใจทำงาน รอผลประเมินตามคิว', outcomes: [win(p.odds * 0.6), miss('รอบนี้ยังไม่ถึงคิว ต้องรอรอบหน้า')] },
      {
        text: 'รับงานยากมาโชว์ฝีมือ',
        requires: { stats: Object.fromEntries(Object.entries(p.need).map(([s, v]) => [s, { min: v }])), reason: needText(p.need) },
        effects: { health: -1 },
        outcomes: [win(p.odds * 1.5), miss('งานยากล่มกลางทาง ผู้ใหญ่จำชื่อไปผิดทาง', { happiness: -1 })],
      },
      {
        text: 'วิ่งเต้น ฝากซองผู้ใหญ่',
        requires: { money: rankCash(k), reason: 'เงินไม่พอใส่ซอง' },
        effects: { money: rankCash(-k) },
        merit: BRIBE,
        outcomes: [
          win(p.odds * 2.5, null),
          { ...miss('ซองไปผิดคน เรื่องรั่วถึงหู ถูกย้ายไปนั่งตำแหน่งลอย', { happiness: -2, relations: -1 }), weight: 0.7 },
          { weight: 0.3, text: 'ถูกสอบวินัยเรื่องรับส่งซอง ถูกไล่ออกพร้อมเสียค่าทนาย', effects: { job: 'labor', money: rankCash(-1), happiness: -3, relations: -2 }, sets_flags: ['caught_fraud'] },
        ],
      },
      { text: 'ไหว้ขอพรก่อนประเมิน', outcomes: [win(p.odds * 0.6, { ...lift, wish: RANK_WISH }), miss('รอบนี้ยังไม่ถึงคิว ต้องรอรอบหน้า')] },
    ],
  };
}

// คิวการ์ดการเมืองปีนี้: มีตำแหน่ง = ครบวาระ · ยังไม่มี = สุ่มจาก rankRng ว่าชาวบ้านมาชวนไหม (เฉพาะคนถึงเกณฑ์ ชีวิตอื่นไม่ดึงเลขนี้)
function officeDue(st) {
  if (st.office) return st.age >= st.office.next;
  // เคยโดนใบแดง/คดีทุจริต = ถูกตัดสิทธิ์ ไม่มีใครมาชวนอีก
  if (st.flags.caught_fraud || st.workFrom === null || st.age < OFFICE.ageFrom || st.age > OFFICE.ageTo || st.network < OFFICE.minNet) return false;
  st.rankRng ??= makeRng((st.seed ^ 0x1f83d9ab ^ 0x5be0cd19) >>> 0);
  // ลูกหลานตระกูลดังถูกชวนบ่อยขึ้น (B95b · เจ้าของเคาะ) — ×(1 + 0.5 × ขั้นชื่อเสียง)
  return st.rankRng.next() < OFFICE.entry * (1 + OFFICE.fame * (st.fame ?? 0));
}

// การ์ดเลือกตั้ง: ชิงขั้นถัดไป · รักษาตำแหน่งเดิม · ซื้อเสียง (บาปหนัก โดนใบแดงหลุดตำแหน่ง) · ขอพร · วางมือ
// คนกรุงเทพฯ ไม่มีหมู่บ้าน เริ่มที่ขั้นแรกที่เป็นงานเต็มเวลา
function officeCard(st) {
  const steps = st.content.era.careers.office.steps;
  const first = st.ses === 'bkk' ? steps.findIndex((s) => s.full) : 0;
  const cur = st.office ? st.office.rank : -1;
  const up = cur < 0 ? first : cur + 1;
  const canUp = up < steps.length;
  const odds = (r) => OFFICE.odds[r] ?? OFFICE.odds.at(-1);
  const lift = { stats: { network: 1.6, relations: 1.4 } };
  const run = (r, w, multipliers = lift, text = `ชนะ ได้เป็น${steps[r].name}`) => [
    { weight: w, ok: true, multipliers, text, effects: { office: r, network: 1 } },
    { weight: 1, text: cur < 0 ? 'แพ้เลือกตั้ง คะแนนห่างคนที่ชนะไม่มาก' : `แพ้ หลุดจากตำแหน่ง${steps[cur].name}`, effects: { office: -1, happiness: -1 } },
  ];
  const choices = [];
  if (canUp) {
    const cost = rankCash(OFFICE.campaign * (up + 1));
    choices.push({ text: `ลงสมัคร${steps[up].name} หาเสียงด้วยผลงาน`, requires: { money: cost, reason: 'เงินไม่พอค่าหาเสียง' }, effects: { money: { ...cost, amount: -cost.amount } }, outcomes: run(up, odds(up)) });
    choices.push({
      text: `ลงสมัคร${steps[up].name} แจกเงินซื้อเสียง`,
      requires: { money: rankCash(1 + up), reason: 'เงินไม่พอแจก' },
      effects: { money: rankCash(-(1 + up)) },
      merit: VOTE_BUY,
      outcomes: [
        { weight: odds(up) * 2.5, ok: true, text: `ชนะ ได้เป็น${steps[up].name}`, effects: { office: up } },
        { weight: 1, text: 'กกต. แจกใบแดง ถูกตัดสิทธิ์ลงสมัครไปอีกหลายปี', effects: { office: -1, happiness: -2, relations: -1 }, sets_flags: ['caught_fraud'] },
      ],
    });
    choices.push({ text: `ไหว้ขอพรก่อนลงสมัคร${steps[up].name}`, outcomes: run(up, odds(up), { ...lift, wish: RANK_WISH }) });
  }
  if (cur >= 0) choices.push({ text: `ลงรักษาตำแหน่ง${steps[cur].name}`, outcomes: run(cur, OFFICE.keep, lift, `ชาวบ้านเลือกกลับมาอีกสมัย`) });
  choices.push(cur < 0 ? { text: 'ขอบคุณ แต่ไม่ลงสมัคร', effects: { office: -1 } } : { text: 'วางมือ ไม่ลงอีกแล้ว', effects: { office: -1, happiness: 1 } });
  return {
    id: `office_${up}`,
    category: 'society',
    type: 'A',
    text: cur < 0 ? `อายุ ${st.age} ปี คนในพื้นที่มาชวนให้ลงสมัคร${steps[up].name}` : `อายุ ${st.age} ปี ครบวาระ${steps[cur].name}แล้ว จะเอายังไงต่อ`,
    choices,
  };
}

// ประกาศรับสมัครสอบเข้ารับราชการ (B40) — ทางเข้าราชการ/ตำรวจกลางทางสำหรับคนที่ไม่ได้สอบตอนเรียนจบ
// ถึงเกณฑ์อายุและยังไม่อยู่ในสายที่มีบำนาญ ทอยจาก rankRng ปีละครั้ง · ออกได้ไม่เกิน RECRUIT.max ครั้งต่อชีวิต
const RECRUIT = { ageFrom: 22, ageTo: 35, chance: 0.07, max: 2, odds: 1.2 };
function recruitDue(st) {
  if (st.workFrom === null || st.age < RECRUIT.ageFrom || st.age > RECRUIT.ageTo || (st.recruited ?? 0) >= RECRUIT.max) return false;
  if (ladderOf(st)?.pension) return false;
  st.rankRng ??= makeRng((st.seed ^ 0x1f83d9ab ^ 0x5be0cd19) >>> 0);
  if (st.rankRng.next() >= RECRUIT.chance) return false;
  st.recruited = (st.recruited ?? 0) + 1;
  return true;
}
function recruitCard(st) {
  const join = (id, w, multipliers, text) => [
    { weight: w, ok: true, multipliers, text, effects: { ladder: id, happiness: 1 } },
    { weight: 1, text: 'สอบไม่ติด กลับไปทำงานเดิมต่อ', effects: { happiness: -1 } },
  ];
  const lift = { stats: { knowledge: 1.6 } };
  return {
    id: 'recruit_gov',
    category: 'work_money',
    type: 'A',
    text: `อายุ ${st.age} ปี มีประกาศรับสมัครสอบเข้ารับราชการ`,
    choices: [
      { text: 'สมัครสอบข้าราชการพลเรือน', requires: { edu: 'อาชีวะ', reason: 'ต้องจบ ปวช. ขึ้นไป' }, outcomes: join('gov', RECRUIT.odds, lift, 'สอบผ่าน ได้บรรจุเป็นข้าราชการ') },
      { text: 'สมัครสอบนายทหารจากบุคคลภายนอก', requires: { stats: { health: { min: 55 } }, edu: 'อุดมศึกษา', reason: 'ต้องจบปริญญาและร่างกายผ่านเกณฑ์' }, outcomes: join('army', RECRUIT.odds, { stats: { health: 1.5, knowledge: 1.3 } }, 'ผ่านการคัดเลือก ได้ติดยศนายทหาร') },
      { text: 'สมัครสอบเป็นตำรวจ', requires: { stats: { health: { min: 50 } }, edu: 'มัธยม', reason: 'ต้องจบมัธยมและร่างกายผ่านเกณฑ์' }, outcomes: join('police', RECRUIT.odds, { stats: { health: 1.5, knowledge: 1.3 } }, 'ผ่านทั้งข้อเขียนและร่างกาย ได้ติดยศตำรวจ') },
      {
        text: 'ฝากเส้นผู้ใหญ่ให้ช่วยดู',
        requires: { stats: { network: { min: 50 } }, edu: 'มัธยม', reason: 'ต้องจบมัธยมและมีคนรู้จักให้ฝาก' },
        merit: BRIBE,
        outcomes: [
          { weight: RECRUIT.odds * 3, ok: true, text: 'ชื่อผ่านตามที่ฝากไว้ ได้บรรจุเป็นข้าราชการ', effects: { ladder: 'gov' } },
          { weight: 1, text: 'เรื่องฝากเส้นรั่ว ถูกตัดสิทธิ์สอบ ที่ทำงานเดิมก็รู้กันทั่ว', effects: { happiness: -2, relations: -1 } },
        ],
      },
      { text: 'ไม่สอบ ทำงานเดิมต่อ', effects: {} },
    ],
  };
}

// เงินชดเชยเลิกจ้าง (พ.ร.บ.คุ้มครองแรงงาน ม.118): จำนวนวันของค่าจ้างสุดท้ายตามอายุงานในที่ทำงานนี้ — ผู้เรียกคูณค่าจ้างรายวัน
function severanceDays(st) {
  const days = (st.age - (st.jobSince ?? st.workFrom ?? st.age)) * 365;
  return [...st.content.era.careers.severance].reverse().find(([min]) => days >= min)?.[1] ?? 0;
}

// ขั้นยศ + ตำแหน่งการเมืองรวมเป็นระดับเดียว — การ์ดยั่วทุจริตออกถี่ขึ้นตามระดับ (multipliers.rank)
const rankLevel = (st) => (st.ladder?.rank ?? 0) + (st.office ? st.office.rank + 1 : 0);

// โครงการเกษียณก่อนกำหนด (B40): ลูกจ้างอายุ EARLY.from–EARLY.to ทอยจาก rankRng ครั้งเดียวต่อปี ออกได้ครั้งเดียวในชีวิต
// ราชการ/ทหาร/ตำรวจไม่มีโครงการนี้ · ตำแหน่งการเมืองเต็มเวลาไม่ใช่ลูกจ้าง
const EARLY = { from: 50, to: 58, chance: 0.06 };
function earlyDue(st) {
  if (st.earlyOffered || st.age < EARLY.from || st.age > EARLY.to || ladderOf(st)?.pension || officeFull(st) || st.occupation === 'labor' || st.occupation === 'farmer') return false;
  st.rankRng ??= makeRng((st.seed ^ 0x1f83d9ab ^ 0x5be0cd19) >>> 0);
  if (st.rankRng.next() >= EARLY.chance) return false;
  st.earlyOffered = true;
  return true;
}
function earlyCard(st) {
  return {
    id: 'early_retire',
    category: 'work_money',
    type: 'A',
    text: `อายุ ${st.age} ปี ที่ทำงานเปิดโครงการเกษียณก่อนกำหนด ใครสมัครได้เงินชดเชยก้อนตามอายุงาน`,
    choices: [
      { text: 'รับเงินก้อน เกษียณพักผ่อน', effects: { severance: true, retire: true, happiness: 1, health: 1 } },
      {
        text: 'รับเงินก้อน ไปเปิดกิจการเอง',
        effects: { severance: true },
        outcomes: [
          { weight: 2, ok: true, multipliers: { stats: { network: 1.5, relations: 1.3 } }, text: 'ลูกค้าเก่าตามมาอุดหนุน กิจการเล็กเลี้ยงตัวได้สบาย', effects: { job: 'service', income_mult: 1.3, happiness: 2 }, sets_flags: ['own_business'] },
          { weight: 2, text: 'ทำเลไม่ดี เงินชดเชยละลายไปกับค่าเช่าในสองปี', effects: { job: 'service', money: rankCash(-1.5), happiness: -2 }, sets_flags: ['own_business'] },
        ],
      },
      { text: 'อยู่ต่อจนครบเกษียณ', effects: {} },
      {
        text: 'ต่อรองขอเงินก้อนเพิ่มก่อนเซ็น',
        requires: { stats: { network: { min: 50 } }, reason: 'ไม่มีใครในฝ่ายบุคคลให้คุยด้วย' },
        outcomes: [
          { weight: 1, ok: true, multipliers: { stats: { network: 1.5 } }, text: 'ฝ่ายบุคคลยอมเพิ่มให้อีกครึ่งปี รับเงินแล้วเกษียณสบายใจ', effects: { severance: true, retire: true, money: rankCash(0.5), happiness: 1 } },
          { weight: 1, text: 'ต่อรองจนเขาปิดรับสมัคร ต้องทำงานต่อแบบเสียหน้า', effects: { happiness: -1 } },
        ],
      },
    ],
  };
}

// ค่าจ้างขั้นแรกของสายที่ตัวเลือกพาเข้า (ช่วงรายได้บนตัวเลือกสอบเข้า)
const ladderStartPay = (st, id, year) => scaled(st, st.content.era.careers.ladders[id].steps[0].pay, year);

// กลางวาระ (B40 · เจ้าของเคาะข้อ 3): งบก้อนใหม่ลงพื้นที่ — ทำเพื่อส่วนรวมได้บุญ · โกงงบบาปหนัก โดนจับหลุดตำแหน่ง · รังแกคนไม่เลือกเรา
// ออกปีที่นั่งตำแหน่งครบครึ่งวาระ ไม่ดึงเลขสุ่ม
const budgetDue = (st) => !!st.office && st.age === st.office.since + OFFICE.term / 2;
function budgetCard(st) {
  const name = officeStep(st).name;
  const k = 1 + st.office.rank;
  return {
    id: `office_budget_${st.office.rank}`,
    category: 'society',
    type: 'A',
    text: `อายุ ${st.age} ปี งบพัฒนาก้อนใหม่ลงมาถึงมือ${name}`,
    choices: [
      { text: 'ทำถนนกับประปาให้ชาวบ้านตามที่ขอ', effects: { relations: 1, network: 1, happiness: 1 }, merit: [{ cat: 'help_others', level: 1 }] },
      {
        text: 'ฮั้วประมูล กินหัวคิวผู้รับเหมา',
        merit: [{ cat: 'greed_harm', level: 2 }],
        outcomes: [
          { weight: 3, ok: true, text: 'ถนนเสร็จทันวาระ เงินส่วนต่างเข้ากระเป๋าเงียบ ๆ', effects: { money: rankCash(k) } },
          { weight: 1, text: 'ถนนพังก่อนหน้าฝน ป.ป.ช. มาสอบ ถูกให้พ้นตำแหน่งพร้อมคดีติดตัว', effects: { office: -1, money: rankCash(-2), happiness: -3, relations: -2 }, sets_flags: ['caught_fraud'] },
        ],
      },
      { text: 'แบ่งโครงการให้หัวคะแนนของตัวเอง', effects: { network: 2, relations: -1 }, merit: [{ cat: 'greed_harm', level: 1 }] },
      { text: 'ตัดงบหมู่ที่ไม่เลือกเรา ให้รู้ว่าใครเป็นใหญ่', effects: { network: 1, relations: -2 }, merit: [{ cat: 'oppress_subjects', level: 1 }] },
    ],
  };
}

// จังหวะการ์ด (B37a): ปีหนึ่งจับกองสุ่มได้หลายรอบ แต่ละรอบใช้โอกาสของช่วงวัย (POOL_CHANCE) เท่าเดิม
// ปีเงียบจึงยังมีได้ · ใบเดิมไม่ซ้ำในชีวิตเหมือนเดิม — รอบที่กองไม่มีใบให้จับไม่ดึงเลขสุ่ม
// POOL_ROUNDS_OFF = ทุกช่วง 1 รอบ เท่าก่อนมีจังหวะนี้ทุกหลัก (ใช้พิสูจน์ trace ว่าแกนไม่เปลี่ยนผลเกม)
const POOL_ROUNDS_OFF = { เด็ก: 1, วัยรุ่น: 1, หนุ่มสาว: 1, ทำงาน: 1, กลางคน: 1, ชรา: 1 };
// ค่าที่ใช้ — ตั้งตามที่กองเนื้อหาแต่ละช่วงรับไหวโดยไม่หมดกองก่อนจบช่วง (วัดด้วย harness/pace.mjs)
// เด็ก/ชรา 1 รอบ: กองช่วงนี้แห้งตั้งแต่ 2 รอบ — ใบเดิมจะวนซ้ำไม่ได้ ปีที่เหลือจึงเงียบแทน
const POOL_ROUNDS = { เด็ก: 1, วัยรุ่น: 2, หนุ่มสาว: 2, ทำงาน: 3, กลางคน: 3, ชรา: 1 };
// harness สลับค่าในโปรเซสเดียวเพื่อเทียบ — แทนที่ทั้งชุด ช่วงที่ไม่ระบุกลับเป็น 1 รอบ
function setPoolRounds(rounds) {
  for (const k of Object.keys(POOL_ROUNDS_OFF)) POOL_ROUNDS[k] = rounds[k] ?? 1;
}
const poolRounds = (stage) => POOL_ROUNDS[stage] ?? 1;

// การ์ดกองสุ่มถี่ขึ้นตามรอบ ผลต่อใบ (ค่าสถานะ · เงิน · ตัวคูณรายได้) จึงหารด้วยรอบยกกำลัง EFFECT_DAMP
// ไม่หาร = เงิน/สุขภาพสะสมเร็วขึ้นจนล้มละลายกับอายุตายหลุดกรอบข้อมูลจริง · จอบอกแค่ทิศ ผู้เล่นจึงไม่เห็นค่าที่ลด
// 1 รอบ = คูณ 1 ผลเท่าเดิมทุกหลัก
// ค่าสถานะหรี่แยกจากเงิน: สุขภาพแตะ 0 = ตาย (ไม่เชิงเส้น) หรี่เต็มอัตราแล้วอายุเฉลี่ยขึ้นเกินข้อมูล
// statDamp ตั้งให้อายุเฉลี่ยด่าน 3b เท่ากับตอนจับปีละรอบ (วัดด้วยบอทสุ่ม)
const PACE = { effectDamp: 1, statDamp: 0.25 };
const poolEffectScale = (stage) => poolRounds(stage) ** -PACE.effectDamp;
const poolStatScale = (stage) => poolRounds(stage) ** -PACE.statDamp;

// สาเหตุการตาย (B110): ตารางชีพบอกว่าตายเมื่อไร ตารางสาเหตุ (WHO GHE) บอกว่าตายด้วยอะไร
// ปัจจัยเสี่ยงคูณเฉพาะสาเหตุที่เกี่ยว แล้วหารด้วยค่าเฉลี่ยของทั้งประชากร (norm) — คนทั้งรุ่นยังตายตามตารางชีพ
// คนไม่มีปัจจัยเสี่ยงจึงอยู่ยืนกว่าค่าเฉลี่ย ส่วนคนมีปัจจัยเสี่ยงสั้นกว่า

// โรคเรื้อรังมีช่วงป่วยก่อนตาย (ตรวจเจอ → ดูแล → บอกลา) · ที่เหลือมาไม่บอกล่วงหน้า
const CHRONIC = ['heart', 'stroke', 'cancer', 'diabetes_kidney', 'liver', 'chronic_resp'];
const ILL_YEARS = [1, 3];
// พ่อ/แม่ตายด้วยโรคกลุ่มนี้ = ลูกเสี่ยงโรคเดียวกันเพิ่ม (นับตั้งแต่ปีที่พ่อ/แม่จากไป — ประวัติครอบครัวที่หมอถาม) · ส่งต่อทีละชั้น พ่อแม่→ลูก
const HEREDITARY = ['heart', 'diabetes_kidney', 'cancer'];
const HEREDITY_RISK = 1.3;
// ตัวคูณตามงานวิจัยที่เจ้าของเคาะ · รวมหลายตัวแล้วไม่เกิน DEATH_RISK_CAP
const DEATH_RISK = {
  smoker: { heart: 1.8, chronic_resp: 1.8, cancer: 1.8 },
  heavy_drinker: { liver: 1.6, road: 1.6 },
  sporty: { heart: 0.8, diabetes_kidney: 0.8 },
};
const DEATH_RISK_CAP = 2;
// ยุคก่อนข้อมูลสาเหตุ: อัตราตายส่วนที่เกินปีแรกของข้อมูลเป็นของกลุ่มนี้ (data/death-causes.json rules.past)
const COMMUNICABLE = ['infection', 'pneumonia', 'newborn'];

const causeBand = (era, age) => {
  const a = era.causes.ages;
  let i = 0;
  while (i + 1 < a.length && a[i + 1] <= age) i++;
  return i;
};

// สัดส่วนสาเหตุของผู้ตายอายุ age ในปีต้นแบบ py เรียงตาม era.causes.keys
function causeShares(era, sex, py, age) {
  const c = era.causes;
  const rows = c[sex];
  const b = causeBand(era, age);
  const base = rows[Math.max(0, Math.min(rows.length - 1, py - c.from))].map((v) => v[b]);
  if (py >= c.from) return base;
  const q0 = qx(era, sex, c.from, age);
  const q = qx(era, sex, py, age);
  if (!(q > q0)) return base;
  const out = base.map((v) => (v * q0) / q);
  const idx = COMMUNICABLE.map((k) => c.keys.indexOf(k));
  const w = idx.reduce((s, j) => s + base[j], 0);
  const extra = (q - q0) / q;
  if (w > 0) for (const j of idx) out[j] += (extra * base[j]) / w;
  else out[c.keys.indexOf('infection')] += extra;
  return out;
}

// ตัวคูณปัจจัยเสี่ยงของชีวิตนี้ต่อสาเหตุ key (ยังไม่หาร norm)
function riskOf(st, key) {
  let m = 1;
  for (const [flag, by] of Object.entries(DEATH_RISK)) if (st.flags[flag] && by[key]) m *= by[key];
  if (st.heredity?.includes(key)) m *= HEREDITY_RISK;
  return Math.min(DEATH_RISK_CAP, m);
}

// พ่อ/แม่จากไปด้วยโรคที่ถ่ายทอดได้ → จดเป็นประวัติครอบครัวของชีวิตนี้ (คืน true = เพิ่งรู้ปีนี้)
function inherit(st, cause) {
  if (!HEREDITARY.includes(cause) || st.heredity.includes(cause)) return false;
  st.heredity.push(cause);
  return true;
}

// ญาติ/พ่อแม่ (B110 ชิ้น 2): ตายตามตารางชีพทั้งรุ่น ไม่มีปัจจัยเสี่ยงรายคน · โรคเรื้อรังนัดล่วงหน้า 1–3 ปีแบบเดียวกับตัวเอง
// roll = เลขที่ stream เดิมของคนนั้น (famRng/kinRng) ดึงปีละครั้งเท่าเดิม · สาเหตุและนัดป่วยดึงจาก rng แยก (kinCauseRng)
// p.ill = {cause, age} นัดตายที่อายุนั้น (อายุแบบเดียวกับ age ที่ส่งเข้า) · คืนสาเหตุ หรือ null = รอดปีนี้
function kinDeathRoll(era, seed, rng, p, year, age, roll) {
  if (p.ill && age >= p.ill.age) return p.ill.cause;
  const keys = era.causes.keys;
  const py = protoYear(era, seed, year);
  const q = qx(era, p.sex, py, age);
  const s = causeShares(era, p.sex, py, age);
  if (q >= 1) return pickCause(rng, keys, s);
  // เด็กเล็กยังไม่มีนัดจากปีก่อนครบทุกระยะ — ส่วนที่นัดไม่ถึงของโรคเรื้อรังตายปีนี้เลย
  const span = ILL_YEARS[1] - ILL_YEARS[0] + 1;
  const unscheduled = (span - Math.max(0, Math.min(span, age - ILL_YEARS[0] + 1))) / span;
  const now = s.map((x, j) => q * x * (CHRONIC.includes(keys[j]) ? unscheduled : 1));
  if (roll < now.reduce((a, x) => a + x, 0)) return pickCause(rng, keys, now);
  if (!p.ill) {
    const years = rng.int(...ILL_YEARS);
    const at = age + years;
    const py2 = protoYear(era, seed, year + years);
    const q2 = at >= MAX_AGE ? 1 : qx(era, p.sex, py2, at);
    if (q2 < 1) {
      const ch = causeShares(era, p.sex, py2, at).map((x, j) => (CHRONIC.includes(keys[j]) ? q2 * x : 0));
      if (rng.next() < ch.reduce((a, x) => a + x, 0)) p.ill = { cause: pickCause(rng, keys, ch), age: at };
    }
  }
  return null;
}

// สาเหตุของการตายที่ไม่ได้มาจากตารางชีพ (การ์ดเนื้อหาสั่งตาย) — สุ่มตามสัดส่วนของอายุนั้น
function kinCause(era, seed, rng, sex, year, age) {
  return pickCause(rng, era.causes.keys, causeShares(era, sex, protoYear(era, seed, year), age));
}

// ทำร้ายตัวเอง (เจ้าของเคาะ): ไม่บอกวิธี ไม่มีการ์ดชวน · การ์ดที่บอกสาเหตุนี้ (ตายเอง · คนในบ้านจากไป) พา help ไปให้จอขึ้นสายด่วนเสมอ
// label = [คำเชื่อม, คำนาม] รูปเดียวกับป้ายสาเหตุของจอ · เนื้อหาสั่งตายด้วยสาเหตุนี้ไม่ได้ (lint family-ops)
const CARE_CAUSES = {
  self_harm: {
    label: ['จาก', 'การทำร้ายตัวเอง'],
    help: { phone: '1323', text: 'ถ้าคุณหรือคนใกล้ตัวกำลังรู้สึกแย่ หรือมีความคิดอยากทำร้ายตัวเอง โทรสายด่วนสุขภาพจิต 1323 ได้ฟรีตลอด 24 ชั่วโมง' },
  },
};
const careHelp = (cause) => CARE_CAUSES[cause]?.help;

// ข้อความแกนตอนญาติตรวจเจอโรคเรื้อรัง — เลน A ต่อยอดด้วยการ์ด when.kin_illness
const KIN_ILL_TEXT = {
  heart: (who) => `${who}ตรวจพบว่าหัวใจไม่ค่อยดีแล้ว หมอให้กินยาและระวังตัวไปตลอด`,
  stroke: (who) => `${who}เส้นเลือดในสมองตีบจนต้องนอนโรงพยาบาล กลับบ้านมาร่างกายไม่เหมือนเดิม`,
  cancer: (who) => `ผลตรวจของ${who}ออกมาว่าเป็นมะเร็ง หมอเริ่มพูดถึงการรักษาที่ยาวและหนัก`,
  diabetes_kidney: (who) => `เบาหวานกับไตของ${who}ทรุดลงจนหมอนัดตรวจถี่ขึ้นทุกเดือน`,
  liver: (who) => `หมอบอกว่าตับของ${who}เริ่มแข็ง ต้องดูแลตัวเองอย่างจริงจัง`,
  chronic_resp: (who) => `${who}หายใจหอบเหนื่อยง่ายขึ้นทุกวัน หมอบอกว่าปอดเสื่อมเรื้อรัง`,
};

// ค่าเฉลี่ยของ riskOf ทั้งประชากรที่ยังมีชีวิตในเพศ×ช่วงอายุนั้น — ไม่มีข้อมูล = 1
const normOf = (era, sex, key, b) => era.causes.norm?.[sex]?.[key]?.[b] ?? 1;

// ส่วนของ qx ที่แต่ละสาเหตุกิน (ผลรวม = โอกาสตายรวมของปีนั้น) · k = ตัวคูณสุขภาพ×กรรมของชีวิตนี้
function causeHazards(st, py, age, k) {
  const era = st.content.era;
  const base = qx(era, st.sex, py, age);
  const s = causeShares(era, st.sex, py, age);
  const b = causeBand(era, age);
  return era.causes.keys.map((key, j) => base * k * s[j] * (riskOf(st, key) / normOf(era, st.sex, key, b)));
}

// สุ่มสาเหตุตามน้ำหนัก · เฉพาะดัชนีที่ allow ยอม (ไม่ใส่ = ทุกตัว)
function pickCause(rng, keys, w, allow = null) {
  let sum = 0;
  for (let j = 0; j < w.length; j++) if (!allow || allow(keys[j])) sum += w[j];
  if (!(sum > 0)) return 'other';
  let r = rng.next() * sum;
  for (let j = 0; j < w.length; j++) {
    if (allow && !allow(keys[j])) continue;
    r -= w[j];
    if (r < 0) return keys[j];
  }
  return keys.findLast((key) => !allow || allow(key));
}

// เฉียดตาย + โกงความตายถูกเรียกตัว (B153): ทริปศาลทั้งตัวขณะยังมีชีวิต
// เฉียดตายไม่ยืดชีวิต — คิดจากแถบเลขสุ่มตายตัวเดิมที่เลยผลรวมไปนิดเดียว (ไม่ดึงเลขเพิ่มจาก st.rng/causeRng) ⇒ อายุตายและสาเหตุเท่าเดิมทุกชีวิต
// โกงความตาย = ผลสุ่มตายจริงตอนถือธง ⇒ ไปศาลก่อน แล้วตายปีเดิม (อายุขัยไม่ยืด)
// การ์ดศาลไม่แตะค่าสถานะ/บัญชี (เนื้อหาผ่าน lint court-shape) และไม่นับโควตาการ์ดของปี — ชีวิตหลังฟื้นจึงเดินเหมือนไม่มีทริป




// band = แถบเกือบตายเป็นสัดส่วนของโอกาสตายจากอุบัติเหตุของปีนั้น (ค่าตั้งของเกม วัดเป้าใน harness/near-death)
// minAge = ต่ำกว่านี้ไม่มีทริป (การ์ดเล่าเหตุแบบผู้ใหญ่) · salt = stream เลือกใบศาล แยกจากทุก stream ของโลก
const NEAR_DEATH = { band: 1, minAge: 15, causes: ['road', 'accident'], salt: 0x7f4a7c15 };
// คำใบ้ยาวเกินจะเป็นหัวการ์ด ⇒ หัวสั้นคงที่ ข้อความลงเนื้อ
const HINT_TITLE = 'ก่อนลืมตา';
const COURT_SCENES = ['near', 'visit', 'summons'];
// ระดับคำใบ้จากบัญชีสุทธิ (ช่วงเดียวกับ verdictLevel −1..1) · ขอบตามภูมิที่ปรโลก: นรก ≤ −0.5 · เปรต/ดิรัจฉาน < 0 · เทวดา > 2/3
const NEAR_HINT_LEVELS = [
  { id: 'dark2', upTo: -0.5 },
  { id: 'dark1', upTo: -0.01 },
  { id: 'even', upTo: 0.2 },
  { id: 'bright1', upTo: 2 / 3 },
  { id: 'bright2', upTo: Infinity },
];
const hintLevel = (ledger) => {
  const x = Math.max(-1, Math.min(1, netLedger(ledger) / VERDICT_REF));
  return NEAR_HINT_LEVELS.find((l) => x <= l.upTo).id;
};

// เรียกจาก deathRoll ตอนรอด: over = u − ผลรวมโอกาสตาย (≥ 0) · now = โอกาสรายสาเหตุของปีนี้
// สาเหตุของเหตุเกือบตายอ่านจากตำแหน่ง over ในแถบเอง ไม่ต้องสุ่มเพิ่ม
function nearMiss(st, over, keys, now) {
  if (st.nearDeath != null || st.court || st.age < NEAR_DEATH.minAge) return;
  let edge = 0;
  for (const cause of NEAR_DEATH.causes) {
    edge += NEAR_DEATH.band * (now[keys.indexOf(cause)] ?? 0);
    if (over < edge) {
      st.nearDeath = st.age;
      st.court = { mode: 'visit', near: cause, steps: ['near', 'visit', 'hint'], i: 0, wait: false };
      return;
    }
  }
}

const summonsCourt = (cause) => ({ mode: 'summons', cause, steps: ['summons'], i: 0, wait: false });

const courtRng = (st) => (st.nearRng ??= makeRng(st.seed ^ NEAR_DEATH.salt));

function courtEvent(st, scene) {
  const c = st.court;
  const pool = st.content.events.filter((e) => e.stage === AFTERLIFE_STAGE && e.scene === scene && (scene !== 'near' || e.near === c.near));
  return pool.length ? pool[Math.floor(courtRng(st).next() * pool.length)] : null;
}

const courtBase = (st, mode) => ({ kind: 'event', court: mode, type: 'B', national: false, funeral: false, age: st.age, stage: AFTERLIFE_STAGE });

// การ์ดใบถัดไปของทริป · null = ทริปจบ (ผู้เรียกปิดทริป) · ขั้นที่ไม่มีเนื้อหาข้ามไป
function courtCard(st) {
  const c = st.court;
  if (c.wait) throw new Error('ยังมีการ์ดที่รอเลือก');
  while (c.i < c.steps.length) {
    const step = c.steps[c.i];
    if (step === 'hint') {
      c.i++;
      const lines = st.content.nearHints?.[hintLevel(st.ledger)];
      if (!lines?.length) continue;
      const text = lines[Math.floor(courtRng(st).next() * lines.length)];
      return { ...courtBase(st, c.mode), id: 'court_hint', title: HINT_TITLE, text, choices: [], fx: [], locked: [] };
    }
    const ev = courtEvent(st, step);
    if (!ev) {
      c.i++;
      continue;
    }
    if (ev.choices.length) {
      c.ev = ev;
      c.wait = true;
    } else c.i++;
    return { ...courtBase(st, c.mode), id: ev.id, title: ev.title ?? null, text: ev.text, choices: ev.choices.map((x) => x.text), fx: ev.choices.map(() => ''), locked: ev.choices.map(() => null) };
  }
  return null;
}

// ใบเยือน/เกือบตาย = ป้ายกลางล้วน ไม่ลงบัญชี (karmaMultiplier ต้องไม่ขยับ) · ใบถูกเรียกตัวลงบัญชีได้ เพราะตายปีนี้อยู่แล้ว ผลไปถึงปรโลกเท่านั้น
// ไม่ลง st.log — การ์ดตายสรุปจาก log ทริปจะทำให้ชีวิตที่เฉียดตายต่างจากชีวิตเดียวกันที่ไม่เฉียด
function chooseCourt(st, idx) {
  const c = st.court;
  const ch = c.wait && c.ev.choices[idx];
  if (!ch) throw new Error('ตัวเลือกไม่ถูกต้อง');
  if (c.mode === 'summons') for (const f of recordMerit(st.ledger, ch.merit, c.ev.id)) st.flags[f] = true;
  c.ev = null;
  c.wait = false;
  c.i++;
}

// บอทเลือกใบศาลด้วย stream ของตัวเอง — stream บอทหลักของชีวิตไม่เลื่อน ทางเลือกหลังทริปจึงเท่าเดิม
const courtPick = (card, rng) => Math.floor(rng.next() * card.choices.length);

// การ์ดเตือนชีวิตใกล้หมด (B160 · B161): ตกจากเหนือเกณฑ์ลงถึงเกณฑ์ = 1 ใบ · ขึ้นเหนือเกณฑ์แล้วตกใหม่ = เตือนใหม่
// การ์ดระบบ ไม่หักโควตากองสุ่ม · มนุษย์มีแค่ "ช่างมัน" จนร้าน/โฟกัสโลกหลักเข้า · ต่างโลกส่งตัวเลือกของตัวเองได้
// แยกจาก life.mjs เพราะ isekai.mjs ใช้ด้วย และ life.mjs import isekai.mjs อยู่แล้ว (import วน)
const WARN = {
  human: 20,
  isekai: 25,
  ignore: 'ช่างมัน',
  text: 'ร่างกายทรุดลงจนรู้สึกได้ทุกเช้า ถ้ายังใช้ชีวิตแบบนี้ต่อไป อีกไม่นานร่างกายคงไม่ไหว',
};
// เซฟก่อนมีช่องนี้ไม่มี lowWarned = ถือว่ายังไม่เคยเตือน
function crossedLow(holder, value, line) {
  const low = value <= line;
  const was = holder.lowWarned ?? false;
  holder.lowWarned = low;
  return low && !was;
}
const warnCard = (age, stage, text, choices = [WARN.ignore]) => ({ kind: 'warn', age, stage, text, choices, fx: choices.map(() => ''), locked: choices.map(() => null) });
// บอทกด "ช่างมัน" บนการ์ดเตือนทุกโลกโดยไม่ดึงเลขสุ่ม ⇒ ทางเลือกหลังการ์ดเตือนเท่าเดิม · −1 = ไม่ใช่การ์ดเตือน
const warnPick = (card) => (card.kind === 'warn' || card.step === 'warn' ? card.choices.indexOf(WARN.ignore) : -1);

// โฟกัสชีวิต (สิ่งที่ทุ่มเท · แบบอสงไขย · B163): กติกากลางตัวเดียวที่ทุกโลกเรียก — เนื้อ (รายการ · ผล · ป้ายหมวดการ์ด) ต่างตามโลก
// h = ผู้ถือสถานะของโลกนั้น (โลกหลัก = st) เก็บ focus · focusAt · focusYears ไว้บนตัว ภาพถ่ายเซฟจึงพาไปด้วยเอง
// ไม่ตั้ง = ตามน้ำ: ไม่มีผล ไม่ดึงเลขสุ่ม ไม่ถ่วงการ์ด — ชีวิตที่ไม่แตะปุ่มเดินเหมือนก่อนมีระบบทุกหลัก
const FOCUS_FLOW = 'flow';
const FOCUS_FLOW_NAME = 'ใช้ชีวิตตามน้ำ';

// เลือกได้ตอนนี้: ช่วงวัยตรง + เงื่อนไขสถานะผ่าน + ต่อสายแล้ว · ok(when, def) = ตัวตรวจสถานะของโลกนั้น
// ปลายสาย (after) ซ่อนจนต้นสายสะสมครบปีเต็มตามเกณฑ์ แล้วโผล่ตั้งแต่ช่วงวัยถัดจากช่วงที่ครบ (เจ้าของเคาะ: ช่วงวัยก่อนส่งผลต่อช่วงวัยต่อไป)
const chained = (def, stage, h) => !def.after || (h?.focusMet?.[def.after] !== undefined && h.focusMet[def.after] !== stage);
const focusOpen = (def, stage, ok, h) => !!def && (!def.stages || def.stages.includes(stage)) && chained(def, stage, h) && ok(def.when, def);
const focusOffers = (defs, stage, ok, h) => Object.keys(defs).filter((id) => focusOpen(defs[id], stage, ok, h));

// เปลี่ยนแล้วจดอายุไว้ — ปีที่เปลี่ยนไม่นับเป็นปีเต็มของโฟกัสใด (กดซ้ำตัวเดิมไม่ใช่การเปลี่ยน)
function focusSet(h, id, age) {
  const next = id === FOCUS_FLOW ? null : id;
  if ((h.focus ?? null) === next) return;
  h.focus = next;
  h.focusAt = age;
}

// ปิดปีที่อายุ age: ผลทั้งปีคิดตามโฟกัสตอนสิ้นปีตัวเดียว คืน id นั้น · หลุดช่วงวัย/เงื่อนไขแล้วกลับเป็นตามน้ำ คืน null
// ตัวนับสะสม (ประตูเข้าสาย · ต่อสาย) นับเฉพาะปีที่ไม่ได้เปลี่ยนระหว่างปี · ครบ chain ปีจดช่วงวัยที่ครบไว้ใน focusMet (ปลายสายอ่าน)
function focusYearEnd(h, defs, stage, ok, age, chain = Infinity) {
  if (!h.focus) return null;
  if (!focusOpen(defs[h.focus], stage, ok, h)) {
    focusSet(h, FOCUS_FLOW, age);
    return null;
  }
  if (h.focusAt < age) {
    const n = ((h.focusYears ??= {})[h.focus] = (h.focusYears[h.focus] ?? 0) + 1);
    if (n >= chain) (h.focusMet ??= {})[h.focus] ??= stage;
  }
  return h.focus;
}

// โฟกัสหลักของชีวิต (ทายาทรับหมวด): ตัวที่สะสมปีเต็มมากสุด · เสมอกันเอาตัวที่ถืออยู่ตอนนี้ แล้วตามลำดับในเนื้อหา · ไม่เคยสะสม = null
function focusMain(h, defs) {
  const ys = h.focusYears ?? {};
  const ids = Object.keys(defs).filter((id) => ys[id] > 0);
  if (!ids.length) return null;
  const top = Math.max(...ids.map((id) => ys[id]));
  return ids.includes(h.focus) && ys[h.focus] === top ? h.focus : ids.find((id) => ys[id] === top);
}

// ตัวคูณน้ำหนักการ์ดกองสุ่ม: ป้ายหมวดของการ์ดตรงหมวดที่โฟกัสถ่วง = mul · ไม่ตรง/ไม่มีโฟกัส = 1 (คูณ 1 ไม่ขยับลำดับสุ่ม)
const focusCardMul = (def, tags, mul) => (def && def.cards.some((t) => tags.includes(t)) ? mul : 1);

// ทิศผลบนปุ่มเป็นคำ ไม่มีตัวเลข: ขึ้น/ลงตามเครื่องหมาย · ระดับ 2 ขึ้นไป = "มาก" · ค่าที่ไม่มีป้าย (บัญชีซ่อน) ไม่ขึ้นปุ่ม
// เงินบอก "มาก" เมื่อขนาดถึง 2 เท่ารายได้ต่อปีขึ้นไป
const focusLevel = (v) => (typeof v === 'number' ? v : Math.sign(v.amount) * (Math.abs(v.amount) >= 2 ? 2 : 1));
function focusWords(def, labels) {
  const parts = Object.entries(def.fx)
    .filter(([k]) => labels[k])
    .map(([k, v]) => [labels[k], focusLevel(v)])
    .filter(([, lv]) => lv);
  const up = parts.filter(([, lv]) => lv > 0).map(([n, lv]) => `${n}ขึ้น${lv >= 2 ? 'มาก' : ''}`);
  const down = parts.filter(([, lv]) => lv < 0).map(([n, lv]) => `${n}ลด${lv <= -2 ? 'มาก' : ''}`);
  // มีเสี่ยงสุ่ม = บอกว่ามีเสี่ยง ไม่บอกว่าเสี่ยงอะไร/เท่าไร
  return [...up, ...down, ...(def.risk?.length ? ['มีเสี่ยง'] : [])].join(' · ');
}

// ตายสงบย้อนความทรงจำ (B168): ตายตอนขึ้นปีด้วยวัยชราหรือโรคเรื้อรังที่หมอบอกไว้ อายุ 60 ขึ้นไป → การ์ดย้อนชีวิตใบเดียวก่อนคำสั่งเสีย
// คัดแบบกำหนดได้จาก log/ญาติของชีวิตนั้น ไม่ดึงเลขสุ่ม ไม่ตั้งธง ไม่ให้ผลค่า ⇒ บอทและผลเกมเดินเท่าเดิม ต่างแค่การ์ดหนึ่งใบกับบรรทัดบนมรณบัตร
// ไม่ import life.mjs (life.mjs import ไฟล์นี้) — ผู้เรียกส่ง stageOf มาเอง

const MEMORY = {
  from: 60,
  stories: 3,
  min: 2,
  // ช่วงที่เรื่องของตัวเองชัดที่สุด เมื่อไม่มีตัวเลือกที่ส่งผลต่อ
  prime: ['หนุ่มสาว', 'ทำงาน'],
  text: 'ภาพเก่า ๆ ค่อย ๆ ผุดขึ้นมาทีละภาพ ภาพไหนที่คุณอยากเก็บไว้เป็นภาพสุดท้าย',
};

const PARENT_WORD = (p) => (p.sex === 'หญิง' ? 'แม่' : 'พ่อ');

// ธงที่การ์ดใบอื่นอ่าน (when.flags · ตัวคูณตามธง) — ตัวเลือกที่ตั้งธงพวกนี้แล้วธงยังติดตัวอยู่ = ทางที่ส่งผลต่อจริง
const readCache = new WeakMap();
function flagsRead(content) {
  let set = readCache.get(content);
  if (set) return set;
  set = new Set();
  const walk = (x, key) => {
    if (!x || typeof x !== 'object') return;
    if (Array.isArray(x)) return x.forEach((v) => walk(v));
    if (key === 'flags') {
      for (const k of [...(x.has ?? []), ...(x.not ?? [])]) set.add(k);
      if (!x.has && !x.not) Object.keys(x).forEach((k) => set.add(k));
      return;
    }
    for (const [k, v] of Object.entries(x)) if (k !== 'sets_flags' && k !== 'clears_flags') walk(v, k);
  };
  for (const ev of content.events) walk(ev);
  readCache.set(content, set);
  return set;
}

function memoryEligible(st, isGone) {
  if (!st.dead || st.age < MEMORY.from || isGone(st)) return false;
  return st.cause === 'other' || (!!st.terminal && CHRONIC.includes(st.cause) && st.terminal.cause === st.cause && st.age >= st.terminal.age);
}

function weight(st, c, read) {
  const flags = [...(c.sets_flags ?? []), ...(c.outcomes ?? []).flatMap((o) => o.sets_flags ?? [])];
  if (flags.some((f) => st.flags[f] && read.has(f))) return 2;
  if ((c.schedules ?? []).some((s) => st.fired[s.event])) return 2;
  return 1;
}

// ช่วงวัยละไม่เกินหนึ่งเรื่อง · เรื่องที่ส่งผลต่อมาก่อน ช่วงหนุ่มสาว/ทำงานรองลงมา · เท่ากันเอาเรื่องแรกของช่วง
function memoryStories(st, stageOf) {
  const read = flagsRead(st.content);
  const byId = new Map(st.content.events.map((e) => [e.id, e]));
  const best = new Map();
  for (const l of st.log) {
    const ev = byId.get(l.id);
    const c = ev?.choices?.[l.choice];
    if (!c || /[{}]/.test(l.text)) continue;
    const stage = stageOf(l.age);
    const w = weight(st, c, read);
    if (w < 2 && !MEMORY.prime.includes(stage)) continue;
    if ((best.get(stage)?.w ?? 0) < w) best.set(stage, { w, age: l.age, text: `ตอนอายุ ${l.age} คุณ${l.text}` });
  }
  return [...best.values()].sort((a, b) => b.w - a.w || a.age - b.age).slice(0, MEMORY.stories).sort((a, b) => a.age - b.age).map((x) => x.text);
}

// คนในชีวิต 1–2 บรรทัด: พ่อแม่ที่จากไป (อายุของเราตอนนั้น) · คู่ชีวิตกับลูกหลานที่ยังอยู่
function memoryPeople(st) {
  const lines = [];
  const gone = st.parents.filter((p) => !p.alive && p.diedAtYou !== undefined && !p.gone);
  if (gone.length) lines.push(gone.map((p) => `${PARENT_WORD(p)}จากไป${p.diedAtYou ? `ตอนคุณอายุ ${p.diedAtYou}` : 'ตั้งแต่คุณยังไม่ทันจำความ'}`).join(' · '));
  const live = (role) => (st.kin ?? []).filter((m) => m.role === role && m.alive && !m.left);
  const spouse = live('spouse').at(-1);
  const lost = (st.kinLoss ?? []).findLast((l) => l.role === 'spouse');
  const parts = [];
  // ชื่อเล่นไทยอ่านติดกริยาได้ ("เฟซบุ๊กจากไป") จึงเว้นวรรคหลังชื่อ
  const who = (m) => `คู่ชีวิต${m.name ? `${m.name} ` : ''}`;
  if (spouse) parts.push(`${who(spouse)}ยังอยู่ข้าง ๆ`);
  else if (lost) parts.push(`${who(lost)}จากไปก่อนตอนคุณอายุ ${lost.year - st.birthYear}`);
  const kids = live('child').length, grand = live('grandchild').length;
  if (kids) parts.push(`ลูก ${kids} คน${grand ? ` หลาน ${grand} คน` : ''}ยังอยู่`);
  if (parts.length) lines.push(parts.join(' · '));
  return lines;
}

// null = เรื่องไม่พอให้เลือก — ไม่ออกการ์ด
function memoryCard(st, stageOf) {
  const choices = memoryStories(st, stageOf);
  if (choices.length < MEMORY.min) return null;
  return { kind: 'memory', age: st.age, stage: stageOf(st.age), text: MEMORY.text, items: memoryPeople(st), choices, fx: choices.map(() => ''), locked: choices.map(() => null) };
}

// ความจำข้ามชาติ (B67a · ใบ 159): ของชาติก่อนที่ชาตินี้จำได้ ส่งต่อทุกทางเกิดผ่านทายาท (makeHeir) ช่องเดียว
// ไม่ใช่บัญชีบุญบาป — ไม่มีแต้ม ไม่มีชื่อหมวด · การ์ดอ่านผ่าน when.past_life เท่านั้น
// ชีวิตแรกไม่มีช่อง st.past (ไม่ใช่ null) ⇒ ชีวิตที่ไม่มีชาติก่อนได้สถานะเท่าก่อนมีระบบทุกไบต์
// ไม่ import life.mjs (life.mjs import ไฟล์นี้)

// พรสวรรค์ติดชาติ (ข้อ 3): ชาติก่อนทำอาชีพหลักนานถึง years ปี → ชาตินี้ได้งานเดียวกันแล้วตัวคูณรายได้เริ่มที่ mul แทน 1
const PAST_TALENT = { years: 10, mul: 1.1 };
// วิธีตายของชีวิตที่หายไปต่างโลก — ไม่มีศพ ไม่มีสาเหตุในกลุ่มสาเหตุตาย
const PAST_GONE = 'gone';
const PAST_PROVINCE = ['same', 'other'];

// อาชีพที่ทำนานที่สุดของชีวิตนี้ · ปีเท่ากันเอาอาชีพที่เริ่มนับก่อน · ไม่เคยทำงาน = null
function pastMainJob(st) {
  let job = null, years = 0;
  for (const [k, n] of Object.entries(st.workYears ?? {})) if (n > years) [job, years] = [k, n];
  return { job, years };
}

const addOnce = (list, v) => (v && !list.includes(v) ? [...list, v] : list);

// ความจำที่ชีวิตที่เพิ่งจบฝากให้ชาติถัดไป · realm = id ภูมิที่ปรโลกชี้ให้ชาตินี้ · gone = หายไปต่างโลก
// รายการสะสม (ภูมิ/อาชีพที่เคยเป็น) ต่อจากความจำเดิม · treasures/wish/barami = ช่องของกิมมิคข้อ 6 7 10 ส่งต่อค่าเดิมจนกว่าใบนั้นจะเติม
function pastOf(st, realm, gone) {
  const prev = st.past;
  const { job, years } = pastMainJob(st);
  return {
    lives: (prev?.lives ?? 0) + 1,
    province: st.province ?? null,
    job,
    jobYears: years,
    cause: gone ? PAST_GONE : st.cause ?? 'other',
    realm,
    realms: addOnce(prev?.realms ?? [], realm),
    jobs: addOnce(prev?.jobs ?? [], job),
    treasures: [...(prev?.treasures ?? [])],
    wish: null,
    barami: prev?.barami ?? 0,
  };
}

// อาชีพที่ชาตินี้มีพรสวรรค์ติดมา · null = ไม่มี (ชีวิตแรก/ชาติก่อนทำงานไม่นานพอ)
const pastTalent = (past) => (past?.job && past.jobYears >= PAST_TALENT.years ? past.job : null);

// ตัวคูณรายได้ตอนเริ่มงาน: งานตรงพรสวรรค์ได้ mul · งานอื่น 1 เท่าเดิม
const talentStart = (st) => (st.talent && st.talent === st.occupation ? PAST_TALENT.mul : 1);

// when.past_life: any = มี/ไม่มีชาติก่อน · province = เกิดจังหวัดเดียวกับชาติก่อนไหม · job/cause = อาชีพหลัก/วิธีตายชาติก่อน
// realm = เคยไปภูมินั้นสักชาติ · talent = มีพรสวรรค์ติดชาติ · เงื่อนไขอื่นนอกจาก any:false ต้องมีชาติก่อน
function pastLifeOk(st, w) {
  const p = st.past;
  if (w.any !== undefined && w.any !== !!p) return false;
  if (!p) return w.any === false && Object.keys(w).length === 1;
  if (w.province !== undefined && (w.province === 'same') !== (p.province === st.province)) return false;
  if (w.job && !w.job.includes(p.job)) return false;
  if (w.cause && !w.cause.includes(p.cause)) return false;
  if (w.realm && !w.realm.some((r) => p.realms.includes(r))) return false;
  if (w.talent !== undefined && w.talent !== !!st.talent) return false;
  return true;
}

// เซฟก่อนมีความจำข้ามชาติ: ชีวิตรุ่นที่ 2 ขึ้นไปสร้างจากแถวท้ายของผังตระกูล (ที่เกิด · วิธีตาย · ภูมิ) · อาชีพไม่เคยบันทึก = null
// realmId แปลงชื่อภูมิในผังเป็น id (ผู้เรียกส่งมา — ไฟล์นี้ไม่ import ปรโลก)
function pastFromLineage(lineage, realmId) {
  const rows = (lineage ?? []).filter((l) => !l.isekai);
  const last = rows.at(-1);
  if (!last) return undefined;
  const realms = [];
  for (const l of rows) {
    const r = realmId(l.realm);
    if (r && !realms.includes(r)) realms.push(r);
  }
  return { lives: rows.length, province: last.province ?? null, job: null, jobYears: 0, cause: last.gone ? PAST_GONE : last.cause ?? 'other', realm: realmId(last.realm), realms, jobs: [], treasures: [], wish: null, barami: 0 };
}



















const SEXES = ['ชาย', 'หญิง'];
// 10 ระดับตามเส้นแบ่ง decile ใน data/birthplace.json (rules.classes) — ต่ำไปสูง
// ชื่อเดิม 3 ระดับ (ยากจน · ชนชั้นกลาง · ร่ำรวย) คงไว้ที่ระดับ 3 · 6 · 9 เนื้อหาที่อ้างชื่อเดิมจึงยังใช้ได้
const CLASSES = ['ยากไร้', 'ยากจนมาก', 'ยากจน', 'ค่อนข้างจน', 'ชนชั้นกลางล่าง', 'ชนชั้นกลาง', 'ชนชั้นกลางบน', 'มีอันจะกิน', 'ร่ำรวย', 'มั่งคั่ง'];
// ค่าแถบเริ่มเป็นค่าตั้งของเกม ไม่มีสถิติให้แปลงตรง ๆ — ตั้งไว้ 3 จุด ระดับอื่นลากเส้นตรงผ่าน (ปลายสองข้างต่อเส้นออกไป)
// คอนเน็คชั่นต่อท้ายเสมอ — ค่าเริ่มสุ่มทีละ key ตามลำดับ ค่าเดิม 4 ตัวจึงได้เลขสุ่มชุดเดิม
const START_ANCHORS = [
  [2, { health: 55, happiness: 50, knowledge: 30, relations: 60, network: 20 }],
  [5, { health: 65, happiness: 55, knowledge: 45, relations: 60, network: 40 }],
  [8, { health: 75, happiness: 60, knowledge: 60, relations: 55, network: 65 }],
];
// ค่าเริ่มของแต่ละคนสุ่ม ±START_JITTER รอบค่าของฐานะ — คนฐานะเดียวกันไม่เกิดมาเหมือนกันทุกคน
const START_JITTER = 8;
function startStats(cls) {
  const d = CLASSES.indexOf(cls);
  const [a, b] = d <= START_ANCHORS[1][0] ? [START_ANCHORS[0], START_ANCHORS[1]] : [START_ANCHORS[1], START_ANCHORS[2]];
  const t = (d - a[0]) / (b[0] - a[0]);
  return Object.fromEntries(Object.keys(a[1]).map((k) => [k, a[1][k] + (b[1][k] - a[1][k]) * t]));
}
// ตารางกลางแปลงระดับ ±1/±2/±3 เป็นตัวเลข (ใบ 07) ปรับสมดุลที่จุดเดียว · ไม่เป็นเส้นตรงเพื่อให้ ±3 เป็นเหตุใหญ่จริง
const LEVELS = { 1: 5, 2: 12, 3: 20 };
// network ไม่แตะการตาย (อ่านแค่ health) — เปิดทางงาน/ผลสมัครงานเท่านั้น
const STAT_KEYS = ['health', 'happiness', 'knowledge', 'relations', 'network'];
// ป้ายที่ผู้เล่นเห็น (ปุ่ม · เหตุล็อก · ฉากเกิด · หน้าเฉลย) — health ขึ้นว่า "ชีวิต" เพราะหมดแล้วตาย · network เป็นค่าซ่อน ป้ายจึงเป็นคำคนพูด ไม่ใช่ชื่อค่า
// บอทใน harness อ่านป้ายย้อนกลับจากตารางนี้ เปลี่ยนคำแล้วบอทตามเอง
const STAT_LABELS = { health: 'ชีวิต', happiness: 'ความสุข', knowledge: 'ความรู้', relations: 'ความสัมพันธ์', network: 'เส้นสาย', money: 'เงิน' };
// ป้ายหมวดการ์ดผล (ui-redo 60): จอเลือกภาพตามหมวด · จับจากข้อมูลบนการ์ด (แหล่ง · ชนิดข่าว · ทิศผลค่า) ไม่ดึงเลขสุ่ม ไม่อ่านคำในข้อความ
// ทิศนับเฉพาะค่าที่ลูกศรบนแถบโชว์ (network เป็นค่าซ่อน) และไม่ถูก hidden ของการ์ด/ตัวเลือกปิดไว้ — ป้ายห้ามเผยค่าที่ซ่อน
// ไม่มีป้าย (การ์ดค้างในเซฟเก่า · repairLife ไม่เติม) = หมวดกลาง ⇒ จออ่านผ่าน resultTag เท่านั้น
const TAG_MID = 'mid';
const RESULT_TAGS = ['good', 'bad', TAG_MID, 'loot', 'loss', 'sick', 'pet', 'inherit', 'retire', 'bankrupt', 'nature', 'search', 'survive', 'trip', 'belief', 'afterlife'];
const resultTag = (card) => card.tag ?? TAG_MID;
const TAG_STATS = STAT_KEYS.filter((k) => k !== 'network');
function fxTag(fx, hidden = []) {
  let n = 0;
  for (const k of TAG_STATS) if (fx?.[k] && !hidden.includes(k)) n += fx[k];
  return n > 0 ? 'good' : n < 0 ? 'bad' : TAG_MID;
}

// ช่วงชีวิต (ใบ 03) · ระหว่างชาติไม่ใช่ช่วงอายุ แต่จองชื่อไว้ให้ใบที่ทำหลังตาย
const STAGES = [
  { name: 'เด็ก', from: 0 },
  { name: 'วัยรุ่น', from: 13 },
  { name: 'หนุ่มสาว', from: 19 },
  { name: 'ทำงาน', from: 31 },
  { name: 'กลางคน', from: 46 },
  { name: 'ชรา', from: 60 },
];
const AFTERLIFE_STAGE = 'ระหว่างชาติ';
function stageOf(age) {
  let s = STAGES[0].name;
  for (const x of STAGES) if (age >= x.from) s = x.name;
  return s;
}

// ไหลตามธรรมชาติรายปี (ใบ 03) — ทุกตัวไหลแบบสัดส่วน ค่าจึงเข้าใกล้ขอบได้แต่ไม่ทะลุเอง
// สุขภาพ: ลดตามอายุ เร่งหลัง 60 · ความสุข: กลับสู่ค่าพื้นฐานของคนนั้น ครึ่งชีวิต 3 ปี
// ความรู้: เพิ่มง่ายตอนเด็ก แล้วชะลอ · ความสัมพันธ์: จางลงถ้าไม่มีเหตุการณ์ดูแล
const healthDecay = (age) => (age <= 30 ? 0 : age <= 60 ? 0.005 : 0.005 + 0.0007 * (age - 60));
const HAPPY_PULL = 1 - 0.5 ** (1 / 3);
const knowledgeGain = (age) => (age <= 12 ? 3 : age <= 18 ? 2.5 : age <= 30 ? 1 : age < 60 ? 0.4 : 0);
const RELATION_FADE = 0.007;
const ERA_GAP = 3;
// รอบจั่วหนึ่งจับเหตุการณ์จากกองสุ่มได้ด้วยโอกาสนี้ (เมื่อกองมีใบที่เกิดได้ · ปีหนึ่งจั่วหลายรอบตาม pace.mjs) แยกตามช่วงวัย — วัยรุ่น/หนุ่มสาวสั้นแต่เรื่องเยอะ
// ชราเป็นช่วงยาวสุด ถ้าถี่เท่ากันการ์ดจะล้นเพดานด่าน 4 (CARD_MAX ใน harness/gates.mjs)
const POOL_CHANCE = { เด็ก: 0.3, วัยรุ่น: 0.5, หนุ่มสาว: 0.45, ทำงาน: 0.35, กลางคน: 0.35, ชรา: 0.3 };
// ตัวคูณรายได้ถาวรสะสมทั้งชีวิตอยู่ในเพดานนี้ — ผลซ้อนหลายครั้งไม่ทำให้รายได้หายหมดหรือพุ่งไร้ขอบ
const INCOME_MULT = [0.1, 5];
// ผลเรื้อรังสะสมต่อค่าได้ไม่เกิน ±CHRONIC_MAX ระดับ · ไหลระดับละ CHRONIC_STEP หน่วยต่อปี · จางลงระดับละ 1 ทุก CHRONIC_FADE ปี
// สุขภาพไหลเบากว่าค่าอื่น: การตายอ่านสุขภาพตัวเดียว ค่าแรงกว่านี้ดึงอายุตายของบอทหลุดด่าน 3b · ค่าอื่นไม่แตะการตาย
const CHRONIC_MAX = 3;
const CHRONIC_STEP = { health: 0.35, happiness: 1, knowledge: 1, relations: 1, network: 1 };
const CHRONIC_FADE = 5;
// ค่าสถานะเอียงน้ำหนักต่อเนื่องทุกแต้ม (B112 · เจ้าของเคาะ) — v^((ค่า−50)/20) ตัดที่ ±2 ⇒ 70 = v และ 30 = 1/v เท่าแบบขั้นเดิม (เดิมคูณเฉพาะ ≥70 / ≤30)
// สุดทาง (≥90 / ≤10) = v² · โอกาสสำเร็จของตัวเลือกตัดที่ 5–95% (แบบต่างโลก B107b)
const STAT_CURVE = { mid: 50, span: 20, cap: 2, okMin: 0.05, okMax: 0.95 };
const statMul = (v, x) => v ** Math.max(-STAT_CURVE.cap, Math.min(STAT_CURVE.cap, (x - STAT_CURVE.mid) / STAT_CURVE.span));
const clamp = (v) => Math.max(0, Math.min(100, v));
// สุขต่ำมากทำอะไรก็ไม่เข้าหัว (B40): ความรู้ที่งอกเองรายปี + โอกาสสำเร็จของการ์ดเรียน/งาน คูณตามขั้น · เกณฑ์ = ต่ำกว่าค่าแรก
const MOOD = [[15, 0.5], [30, 0.7]];
const moodMul = (st) => MOOD.find(([below]) => st.happiness < below)?.[1] ?? 1;
const MOOD_CATS = ['work_money', 'study'];
// การ์ดที่แกนสร้าง (หางาน · ด่านเรียนต่อ) ไม่มีหมวด — นับเป็นเรียน/งานด้วย id
const moodCard = (ev) => !!ev && (MOOD_CATS.includes(ev.category) || ev.id === 'first_job' || ev.id?.startsWith('school_gate_'));
// สัญญากับมาร (B156): ยืมโชค = น้ำหนักทางสำเร็จคูณ luck จนถึงอายุที่สัญญาหมด (ยังโดนเพดาน okMax) · รอดตายได้ครั้งเดียวต่อชีวิต
// ราคาคือบาป mara_pact บนตัวเลือก (lint pact-shape) · st.pact อยู่กับชีวิตนี้ ไม่ส่งต่อรุ่น
const PACT = { luck: 1.5, maxYears: 10, surviveText: 'ความตายเฉียดผ่านไปเหมือนมีใครเบี่ยงทางให้ ในหัวมีเสียงหัวเราะเบา ๆ ดังอยู่ครู่หนึ่ง' };
const pactLuck = (st) => (st.age < (st.pact?.luck ?? 0) ? PACT.luck : 1);
function signPact(st, p) {
  st.pact ??= {};
  if (p.luck) st.pact.luck = Math.max(st.pact.luck ?? 0, st.age + p.luck);
  if (p.survive && !st.pact.survive) st.pact.survive = true;
}
// น้ำหนักทางผลหลังเอียงตาม multipliers และอารมณ์ · การ์ดที่มีทั้งทางสำเร็จและไม่สำเร็จ ตัดโอกาสสำเร็จรวมไว้ okMin–okMax (B112) โดยปรับสองกลุ่มตามสัดส่วน
// (ไม่ดึงเลขสุ่มเพิ่ม · ป้าย % กับผลจริงใช้ตัวเดียวกัน)
const outcomeWeights = (st, ev, c) => {
  const m = (moodCard(ev) ? moodMul(st) : 1) * pactLuck(st) * thaiSkillMul(st.skills, ev?.category);
  const w = c.outcomes.map((o) => o.weight * poolMultiplier(st, o.multipliers) * (o.ok ? m : 1));
  const ok = w.reduce((a, x, i) => a + (c.outcomes[i].ok ? x : 0), 0);
  const all = w.reduce((a, x) => a + x, 0);
  if (ok <= 0 || ok >= all) return w;
  const p = ok / all;
  const q = Math.max(STAT_CURVE.okMin, Math.min(STAT_CURVE.okMax, p));
  if (q === p) return w;
  const kOk = q / p, kNo = (1 - q) / (1 - p);
  return w.map((x, i) => x * (c.outcomes[i].ok ? kOk : kNo));
};

function weighted(rng, items, weights) {
  let r = rng.next() * weights.reduce((s, w) => s + w, 0);
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r < 0) return items[i];
  }
  return items[items.length - 1];
}

// เริ่มทำงานเมื่อได้งานแรก (เลิกเรียนอายุไหนก็เริ่มอายุนั้น) จนเกษียณ — แกนเติมเงินเก็บและหน้าจอแสดงรายได้จากเกณฑ์เดียวกัน
const RETIRE_AGE = 60;
// ตำแหน่งการเมืองเต็มเวลา (B40) ไม่เกษียณตามอายุ — ทำงานต่อจนแพ้เลือกตั้งหรือวางมือ
const isWorking = (st, age = st.age) => st.workFrom !== null && age >= st.workFrom && age < (st.retiredAt ?? Infinity) && (age < RETIRE_AGE || officeFull(st));

// ช่วงเรียนที่การ์ดเห็น: ก่อนวัยเข้าเรียนยังไม่มีช่วงเรียน (ค่าเริ่ม primary รออยู่) · เลิกเรียนแล้ว = none
const schoolOf = (st, age = st.age) => (st.school && age >= SCHOOL_FROM ? st.school : 'none');

// ป้ายสถานะงานบนจอ: ก่อนมีงานไม่โชว์อาชีพ (อาชีพตอนเกิดเป็นของครอบครัว ใช้คิดเงินติดตัวเท่านั้น)
function jobText(st, age = st.age) {
  if (st.workFrom === null) {
    if (st.school && age >= SCHOOL_FROM) return `กำลังเรียน${TRACKS[st.school].name}`;
    return age < SCHOOL_FROM ? 'ยังไม่เข้าเรียน' : 'ยังไม่ทำงาน';
  }
  // เกษียณก่อนกำหนด (fx.retire ตั้ง retiredAt) ไม่ต้องรอ 60 ถึงขึ้น "เกษียณ"
  return isWorking(st, age) || age < Math.min(RETIRE_AGE, st.retiredAt ?? Infinity) ? rankName(st) : `เกษียณ (เคยเป็น${rankName({ ...st, office: null })})`;
}

// เงินเก็บต่อปี เป็นบาทของปีนั้น: ค่าจ้างตามอาชีพ × ภาค ทั้งปี × อัตราออม (ใบ 14)
function yearlySaving(st, year = st.birthYear + st.age) {
  const era = st.content.era;
  return monthlyIncome(st, year) * 12 * era.birth.saveRate;
}

// รายได้/เดือนของชีวิตนี้: ค่าจ้างอาชีพ × ตัวคูณรายได้ถาวรจากเหตุการณ์
// รายได้/เดือนของชีวิตนี้: ค่าจ้างงาน (ขั้นในสายยศทับค่าจ้างอาชีพ) × ตัวคูณรายได้ถาวร
// ตำแหน่งการเมือง: ท้องถิ่นได้ค่าตอบแทนบวกจากงาน · เต็มเวลาได้อย่างที่มากกว่า (ลาออกจากงานเดิมไปนั่งตำแหน่ง)
function monthlyIncome(st, year = st.birthYear + st.age) {
  const job = jobWage(st, year) * st.incomeMult;
  if (!st.office) return job;
  return officeFull(st) ? Math.max(job, officePay(st, year)) : job + officePay(st, year);
}


// heir = รุ่นถัดไปจากระหว่างชาติ (afterlife.mjs): จุดเกิด/ฐานะ/ค่าเริ่ม/บัญชีที่ส่งต่อ ทับค่าที่สุ่ม
// ยังดึงเลขสุ่มของโลกครบชุดเดิมก่อนทับ — ตำแหน่ง stream ของรุ่นถัดไปเหมือนชีวิตแรกทุกประการ
function newLife(seed, content, heir = null) {
  const era = content.era;
  const rng = makeRng(seed);
  let birthYear = pickBirthYear(rng, era);
  let sex = rng.pick(SEXES);
  let region = pickRegion(rng, era.birth);
  const odds = classOdds(era.birth, regionRatio(era.birth, region.ses, birthYear));
  let cls = weighted(rng, CLASSES, odds.map((o) => o.p));
  if (heir) ({ birthYear, sex, region, cls } = heir);
  // จังหวัดสุ่มจาก stream แยกในภาคที่ได้ (B34) — ไม่กินเลขสุ่มของโลก · ทางเป็นลูกเกิดบ้านเดิม · เซฟเก่าไม่มีจังหวัด สุ่มซ้ำจาก seed ได้ค่าเดิม
  const province = heir?.province ?? pickProvince(makeRng(seed ^ 0xa54ff53a), era.birth, region.name);
  // ค่าเริ่มสุ่มจาก stream แยก — ไม่กินเลขสุ่มของโลก ลำดับสุ่มการตายจึงเหมือนก่อนมีการสุ่มนี้
  const jit = makeRng(seed ^ 0x6a09e667);
  const s = Object.fromEntries(Object.entries(startStats(cls)).map(([k, v]) => [k, clamp(v + (jit.next() * 2 - 1) * START_JITTER + (heir?.bonus[k] ?? 0))]));
  const occupation = (heir?.occupation && era.finance.occupations.find((o) => o.id === heir.occupation)) ?? pickOccupation(era, seed, cls);
  // พ่อแม่ใช้ stream แยก — การมีพ่อแม่ไม่กินเลขสุ่มของโลก ลำดับสุ่มการตายของตัวเองจึงไม่ขยับ
  // อายุพ่อแม่ตอนเกิดเป็นค่าตั้งของเกม (ยังไม่มีข้อมูลอายุแม่ตอนคลอดรายยุคในชุดข้อมูล)
  const famRng = makeRng(seed ^ 0x3c6ef372);
  const motherAge = famRng.int(18, 40);
  const parents = heir?.parents ?? [
    { sex: 'หญิง', age: motherAge, alive: true },
    { sex: 'ชาย', age: motherAge + famRng.int(0, 8), alive: true },
  ];
  const st = {
    rng,
    seed,
    content,
    birthYear,
    sex,
    // heir ของ harness ไม่มี lineage — ไม่มีรุ่นก่อนให้เลี่ยงชื่อ
    // ทางในตระกูลเกิดเป็นลูก/หลานจริงที่มีชื่ออยู่แล้ว (B36a) — คงชื่อเดิมของเขา
    name: heir?.name ?? pickName(seed, sex, birthYear, era.names, (heir?.lineage ?? []).map((l) => l.name)),
    // ชื่อจริงของตัวเอกเท่านั้น (ญาติ/ผังตระกูลใช้ชื่อเล่น) · ทายาทได้ชื่อจริงใหม่จาก seed ของชีวิตตัวเอง
    realName: pickRealName(seed, sex, birthYear, era.names),
    region: region.name,
    province,
    ses: region.ses,
    cls,
    // ก่อนได้งาน occupation = อาชีพของครอบครัว เป็นฐานของเงินในผลการ์ด (income_x) · ได้งานแล้วเปลี่ยนเป็นงานของตัวเอง
    occupation: occupation.id,
    occupationName: occupation.name,
    familyOcc: occupation.id,
    workFrom: null,
    // สายยศ/ตำแหน่ง (B40 · rank.mjs): ขั้นในสายอาชีพ · ตำแหน่งการเมือง · บำนาญต่อปีเป็นบาทค่าเงินปีเกิด
    ladder: null,
    office: null,
    pension: 0,
    // ช่วงเรียนปัจจุบัน (null = เลิกเรียนแล้ว) · วุฒิที่จบจริง (null = ยังไม่จบอะไร)
    school: 'primary',
    edu: null,
    needJob: false,
    // สัดส่วนเงินต่อสินทรัพย์ ปรับคืนทุกต้นปี · ก่อนการ์ดจัดสรรใบแรกเงินอยู่ในเงินฝาก
    alloc: { deposit: 1 },
    lastAllocYear: null,
    // ยอดสุทธิตอนตาย ให้ระหว่างชาติ/รุ่นถัดไป (B06) อ่าน — มีค่าเมื่อตายแล้วเท่านั้น
    estate: null,
    age: 0,
    health: s.health,
    happiness: s.happiness,
    knowledge: s.knowledge,
    relations: s.relations,
    network: s.network,
    money: 0,
    // หนี้รายก้อน (B08b) แยกจากเงิน · เงินติดลบยังเป็นหนี้เงินกู้ทบดอกแบบเดิม (จ่ายงวดไม่พอ = เงินติดลบ)
    debts: [],
    // ปีติดกันที่หนี้สุทธิเกินเกณฑ์ล้มละลาย · จำนวนครั้งที่ล้มละลาย
    debtYears: 0,
    bankruptcies: 0,
    // รายได้ทั้งปีของปีสุดท้ายที่ทำงาน เป็นบาทค่าเงินปีเกิด — ฐานรายจ่ายหลังเกษียณและเกณฑ์ล้มละลายของคนเกษียณ
    retireBase: null,
    // เส้นสุขภาพของชีวิตนี้ถ้าไม่มีเหตุการณ์ใดเลย — ตัวคูณการตายวัดจากส่วนต่างกับเส้นนี้
    healthNatural: s.health,
    // อยู่ใต้เกณฑ์เตือนแล้ว (B160) — เกิดมาใต้เกณฑ์ไม่นับว่าตก
    lowWarned: s.health <= WARN.human,
    // บัญชีบุญบาปซ่อน — ห้ามส่งออกไปกับการ์ดหรือ statsOf
    ledger: heir?.ledger ?? newLedger(),
    // ที่มาของบัญชีชาตินี้ตามอายุ (B26) — บัญชีที่พกมาจากชาติก่อนไม่มีรายการ
    deeds: [],
    // รุ่นที่เท่าไรของตระกูล + บันทึกรุ่นก่อน · มรดกจากรุ่นก่อนที่ยังไม่ถึงอายุรับ (ทางเป็นลูก)
    gen: heir?.gen ?? 1,
    // ชื่อเสียงตระกูล 0–3 (B95b) ส่งต่อจากรุ่นก่อน · การ์ดเอียงตาม multipliers.family_fame
    fame: heir?.fame ?? 0,
    // ค่าซ้อนทับของตระกูล (overlapOf) — ใส่ช่องเฉพาะเมื่อ > 0 ⇒ ตระกูลที่ไม่เคยข้ามโลกได้สถานะเท่าเดิมทุกไบต์ · เซฟเก่าไม่มีช่อง = 0
    ...(heir?.overlap && { overlap: heir.overlap }),
    // ความจำข้ามชาติ (past.mjs) + อาชีพที่ติดพรสวรรค์มา — ชีวิตแรกไม่มีช่อง
    ...(heir?.past && { past: heir.past }),
    ...(pastTalent(heir?.past) && { talent: pastTalent(heir.past) }),
    lineage: heir?.lineage ?? [],
    legacy: heir?.legacy ?? null,
    // จดหมายคำฝากของรุ่นก่อน (afterfall-3) {age, from, cause, by} — ออกหลังมรดกถึงมือเท่านั้น
    letter: heir?.letter ?? null,
    // อายุที่ธงแต่ละตัวติดครั้งแรก — ระหว่างชาติอ่านอายุตอนมีลูก
    flagAge: {},
    omenTone: null,
    omenAge: null,
    flags: {},
    // ธงของรุ่นก่อนที่ทายาทได้รู้ {ธง: ชั้น} — แยกจาก flags เพราะ flags คือสิ่งที่ตัวเองเคยทำ (ฉายา/ความเสี่ยงตายอ่านอยู่)
    parentFlags: heir?.parentFlags ?? {},
    // สกิลที่พกมาจากคลัง [{ id, lv }] (06s) ใช้ทั้งชีวิตนี้และชาติต่างโลกที่ตามมา · ไม่พก = ไม่มีช่อง (state เท่าก่อนมีสกิลข้ามชาติ)
    ...(heir?.skills?.length && { skills: heir.skills }),
    // ค่าที่ได้จากช่องพกที่ไม่ใช้ (ใบ 201) — การ์ดเกิดบอกเป็นคำ · เซฟเก่าไม่มี = ไม่มีบรรทัด
    ...(heir?.spare && { spare: heir.spare }),
    scheduled: [],
    baseHappiness: s.happiness,
    // ราคาปีนี้เป็นกี่เท่าของปีเกิด
    price: 1,
    trail: [],
    // ค่าสถานะรายปีทั้งชีวิต (B38a) — แยกจาก trail เพราะ trail ออกไปกับการ์ดสรุปช่วงวัยอยู่แล้ว
    statTrail: [],
    // ฐานะ 10 ระดับต้นช่วงวัย (B95 กราฟตระกูล) — จุดแรก = ฐานะบ้านตอนเกิด
    standing: [{ age: 0, cls: CLASSES.indexOf(cls) }],
    due: [],
    queue: [],
    done: {},
    dead: false,
    pending: null,
    advance: false,
    cards: 0,
    log: [],
    // ค่าตอนเริ่มช่วงวัยปัจจุบัน — การ์ดเปลี่ยนช่วงเล่าว่าช่วงที่ผ่านมาเปลี่ยนไปเท่าไร
    stageMark: null,
    lastEraAge: null,
    // อายุล่าสุดที่จับกองสุ่มแล้ว — กันจับซ้ำเมื่อการ์ดอายุเดียวกันทำให้ลูปค้นซ้ำ
    poolAge: null,
    poolOwed: 0,
    incomeMult: 1,
    chronic: {},
    // อายุที่ระดับเรื้อรังของค่านั้นเปลี่ยนล่าสุด — นับรอบจางจากจุดนี้
    chronicAge: {},
    // เหตุการณ์ที่ออกแล้ว: จำนวนครั้ง + อายุครั้งล่าสุด ให้ใบที่ตั้ง repeat ออกซ้ำตามช่วงเว้น
    fired: {},
    parents,
    famRng,
    // สาเหตุตาย + นัดป่วยก่อนตาย (B110) — stream แยก ชีวิตที่รอดทุกปีไม่ทำให้ลำดับสุ่มของโลกขยับ
    causeRng: makeRng(seed ^ 0x9b05688c),
    terminal: null,
    cause: null,
    // สาเหตุ+นัดป่วยของพ่อแม่/ญาติ (B110 ชิ้น 2) — stream แยกจาก famRng/kinRng ที่ตัดสินว่าตายปีไหน ลำดับสุ่มเดิมจึงไม่ขยับ
    kinCauseRng: makeRng(seed ^ 0xc1059ed8),
    // โรคที่พ่อ/แม่จากไปด้วยและถ่ายทอดได้ (HEREDITARY) — คูณความเสี่ยงโรคนั้นของชีวิตนี้
    heredity: [],
    // คู่ครอง/ลูก/หลานที่เป็นคนจริง (B36a · family.mjs) — stream kinRng แยกจากโลกและจากพ่อแม่
    ...newKin(seed),
  };
  nameParents(st);
  // พ่อ/แม่ที่จากไปก่อนเราเกิด (ทางในตระกูล) เป็นประวัติครอบครัวตั้งแต่แรก
  for (const p of st.parents) if (!p.alive) inherit(st, p.cause);
  petsAtBirth(st, heir, CLASSES.indexOf(cls));
  if (heir?.start) skipToAge(st, heir.start.age);
  // เริ่มกลางวัย = เงินของบ้านเป็นบาทของปีที่เริ่ม (yearlySaving อ่านปีจาก st.age)
  st.money = era.birth.startMoney[CLASSES.indexOf(cls)] * yearlySaving(st);
  // การ์ดเปิดชีวิตมาก่อนการ์ดมรดกตอนแรกเกิด — ต้องเล่ามรดกก่อน receiveLegacy ล้าง st.legacy
  st.due.push(introCard(st, heir));
  // ทางเป็นลูก legacy.age >= 0 ⇒ อายุ 0 ได้ผลเท่าเดิม · เริ่มกลางวัย มรดกถึงมือปีที่เริ่ม (รุ่นก่อนตายปีนี้)
  if (st.legacy && st.legacy.age <= st.age) receiveLegacy(st, birthYear + st.age, stageOf(st.age));
  if (st.age > 0 && st.letter && !st.letter.read && !st.legacy && st.age >= st.letter.age) receiveLetter(st);
  if (heir?.start) startSchool(st, birthYear + st.age);
  st.trail.push({ year: birthYear + st.age, money: Math.round(st.money) });
  st.statTrail.push(statPoint(st));
  st.stageMark = markStage(st);
  lifeFocusBorn(st, heir?.focus);
  if (heir?.gates?.length) st.gates = [...heir.gates];
  overlapPlan(st);
  return st;
}

const statPoint = (st) => ({ age: st.age, ...Object.fromEntries(STAT_KEYS.map((k) => [k, Math.round(st[k])])) });

// กราฟทั้งชีวิตบนบันทึกการตาย (B38a): ค่าสถานะ + เงินรายปีตั้งแต่เกิดถึงตาย · จุดเก็บตอนขึ้นอายุ
// จุดสุดท้ายแทนด้วยค่า ณ ตอนตาย — เหตุการณ์ปีสุดท้ายจึงไม่หายจากกราฟ · ไม่แตะ state การ์ดตายสร้างซ้ำได้
function lifeSeries(st) {
  const stats = st.statTrail.filter((p) => p.age < st.age);
  stats.push(statPoint(st));
  const money = st.trail.map((p) => ({ age: p.year - st.birthYear, money: p.money })).filter((p) => p.age < st.age);
  money.push({ age: st.age, money: Math.round(st.money) });
  return { stats, money };
}

function markStage(st) {
  return { age: st.age, stage: stageOf(st.age), price: st.price, money: st.money, ...Object.fromEntries(STAT_KEYS.map((k) => [k, st[k]])) };
}

// สรุปช่วงวัยที่เพิ่งจบ: ตัวเลือกที่เลือก + ค่าสถานะ/เงินต้นช่วง → ตอนนี้ · อ่าน state ล้วน ไม่ดึงเลขสุ่มของโลก
// ไม่มีค่าบัญชีบุญบาป — การ์ดทุกใบถูก harness ตรวจรั่ว
// lastAge = อายุสุดท้ายของช่วง: การ์ดเปลี่ยนช่วงออกตอนขึ้นอายุแรกของช่วงใหม่แล้ว
function stageRecap(st, lastAge) {
  const m = st.stageMark;
  // ไม่เล่าผลตอบแทนรายปีของสินทรัพย์ — ตัวเลขรายปีอ่านเหมือนคำแนะนำลงทุน · ผลรวมยังเห็นในเงินต้นช่วง → ตอนนี้
  const items = st.debts.map((d) => `${debtName(d.kind)} ค้าง ${Math.round(d.balance).toLocaleString('en-US')} บาท`);
  return {
    items,
    moneySeries: st.trail.filter((p) => p.year >= st.birthYear + m.age),
    stage: m.stage,
    fromAge: m.age,
    toAge: lastAge,
    picks: st.log.filter((x) => x.age >= m.age).map(({ age, text }) => ({ age, text })),
    stats: STAT_KEYS.map((k) => ({ key: k, label: STAT_LABELS[k], from: m[k], to: st[k] })),
    money: { from: Math.round(m.money), to: Math.round(st.money) },
  };
}

// ความแรงของผลทางหนึ่งเป็นแต้มเดียว (ระดับค่าสถานะ + เรื้อรัง + เงิน + รายได้) ใช้วัดความกว้างของผลสุ่ม
// อ่านเนื้อหาล้วน ไม่อ่าน state — ป้ายเสี่ยงจึงไม่บอกค่าที่ซ่อนอยู่ เช่นบัญชีบุญบาปที่เอียงผล
function outcomeScore(o) {
  const fx = o.effects ?? {};
  let s = 0;
  for (const k of STAT_KEYS) s += fx[k] ?? 0;
  for (const v of Object.values(fx.chronic ?? {})) s += v;
  const m = fx.money;
  if (m) s += m.unit === 'income_x' ? Math.sign(m.amount) * Math.min(3, Math.max(1, Math.round(Math.abs(m.amount)))) : Math.sign(m.amount ?? m) * 2;
  if (fx.income_mult) s += fx.income_mult > 1 ? 2 : -2;
  return s;
}
// เกณฑ์แบ่งความกว้างของผล (แต้มสูงสุด − ต่ำสุด) เป็น 3 ระดับที่ผู้เล่นเห็น
const RISK = [[2, 'เสี่ยงต่ำ'], [5, 'เสี่ยงกลาง'], [Infinity, 'เสี่ยงสูง']];
function riskLabel(outcomes) {
  const s = outcomes.map(outcomeScore);
  const spread = Math.max(...s) - Math.min(...s);
  return RISK.find(([max]) => spread <= max)[1];
}

// ป้ายผลบนตัวเลือก (ใบ 07): ผลคงที่ = ↑/↓ · ค่าที่เหตุการณ์ซ่อน = ? · หวยสายมู = ? เสมอ (ใบ 12)
// ผลสุ่มที่มีทางสำเร็จ (ok) = % สำเร็จ · ผลสุ่มที่ไม่มีทางสำเร็จ = ระดับเสี่ยงจากความกว้างของผล
function choiceFx(st, ev, c) {
  if (ev.belief?.kind === 'lottery_numen') return '?';
  const fixed = fixedFx(ev, c);
  if (!c.outcomes?.length) return fixed;
  return [fixed, outcomeFx(st, c, ev)].filter(Boolean).join(' · ');
}

// ทางที่เอียงด้วยบัญชีบุญบาปโชว์ ? — % จะบอกยอดบัญชีที่ต้องซ่อนจนตาย
function outcomeFx(st, c, ev) {
  if (!c.outcomes.some((o) => o.ok)) return riskLabel(c.outcomes);
  if (c.outcomes.some((o) => o.multipliers?.karma || o.multipliers?.wish)) return 'สำเร็จ ?';
  return `สำเร็จ ~${successPct(st, c, ev)}%`;
}

// โอกาสได้ทางสำเร็จ ปัดเป็นขั้น PCT_STEP ไม่โชว์ 0/100 · ผลของตัวเลือกลงก่อนสุ่มทาง (choose)
// จึงคิดบนค่าหลังผลตัวเลือกในสำเนา ไม่แตะ state จริง
const PCT_STEP = 5;
// ค่าดิบไม่ปัด — harness ที่วัดผลเอียงเล็ก ๆ (ผลเบาสกิล k) เห็นต่างกันต่ำกว่าขั้นป้าย
function successP(st, c, ev = null) {
  const fx = c.effects ?? {};
  const p = { ...st, flags: { ...st.flags } };
  for (const k of STAT_KEYS) if (fx[k]) p[k] = clamp(p[k] + levelValue(fx[k]));
  for (const f of c.sets_flags ?? []) p.flags[f] = true;
  for (const f of c.clears_flags ?? []) delete p.flags[f];
  const w = outcomeWeights(p, ev, c);
  return w.reduce((s, x, i) => s + (c.outcomes[i].ok ? x : 0), 0) / w.reduce((s, x) => s + x, 0);
}
function successPct(st, c, ev = null) {
  const r = successP(st, c, ev);
  return Math.max(PCT_STEP, Math.min(100 - PCT_STEP, Math.round((r * 100) / PCT_STEP) * PCT_STEP));
}

function fixedFx(ev, c) {
  const hidden = [...(ev.hidden ?? []), ...(c.hidden ?? [])];
  const fx = c.effects ?? {};
  const out = [];
  for (const k of [...STAT_KEYS, 'money']) {
    if (!fx[k]) continue;
    if (hidden.includes(k)) { out.push('?'); break; }
    const sign = k === 'money' && typeof fx[k] === 'object' ? Math.sign(fx[k].amount) : Math.sign(fx[k]);
    // ช่องว่างไม่ตัดบรรทัด: ลูกศรต้องติดชื่อค่า ไม่หล่นไปบรรทัดใหม่
    out.push(`${k === 'money' && fx[k].grey ? 'เงินเทา' : STAT_LABELS[k]}\u00a0${sign > 0 ? '↑' : '↓'}`);
  }
  if (fx.invest) out.push('ลงทุน');
  if (fx.grey_seize) out.push('เงินเทาถูกยึด');
  if (fx.grey_launder) out.push('ฟอกเงินเทา');
  if (fx.debt) out.push(`กู้${debtName(fx.debt.kind)}`);
  if (fx.settle) out.push(`ปิด${debtName(fx.settle)}`);
  if (fx.complain) out.push('ร้องเรียนดอกโหด');
  if (fx.income_mult) out.push(`รายได้\u00a0${fx.income_mult > 1 ? '↑' : '↓'}`);
  if (fx.severance) out.push('ได้เงินชดเชย');
  if (fx.retire) out.push('เกษียณ');
  for (const [k, v] of Object.entries(fx.chronic ?? {})) out.push(`${STAT_LABELS[k]}\u00a0${v > 0 ? '↑' : '↓'}\u00a0ระยะยาว`);
  return out.join(' · ');
}

// โอกาสตายภายในปีนี้ = ตารางชีพจริงของปีปฏิทินนั้นตามอายุ/เพศ × ตัวคูณจากสุขภาพ (ใบ 03) × ตัวคูณกรรม (ใบ 09)
// ตัวคูณอิงส่วนต่างจากเส้นสุขภาพตามธรรมชาติของชีวิตนั้น ไม่ใช่ค่าคงที่ — ชีวิตที่ไม่มีเหตุการณ์จึงได้ qx จริงพอดี
// และสุขภาพที่ไหลลงตามวัยไม่ถูกนับซ้ำกับ qx ที่สูงขึ้นตามวัยอยู่แล้ว · สุขภาพแย่เพิ่มความเสี่ยงแรงกว่าสุขภาพดีลด
function healthMultiplier(st) {
  const d = st.health - st.healthNatural;
  return d < 0 ? 1 - d / 50 : Math.max(0.6, 1 - d / 150);
}

// อายุร่างกาย = อายุไทย + ปีที่อยู่ต่างโลก (B68m) — ปีปฏิทินยังตามอายุไทย · ชีวิตที่ไม่ข้ามโลกไม่มี st.away
// ทุกที่ที่อ่านตารางชีพ/สัดส่วนสาเหตุ/ช่วงป่วยใช้อายุนี้ (B110) ไม่งั้นคนกลับจากต่างโลกตายตามอายุไทย
const bodyAge = (st) => st.age + (st.away ?? 0);

// ผลรวมทุกสาเหตุ (B110) — ปัจจัยเสี่ยงเอียงทั้งสาเหตุและโอกาสตายรวม
function deathChance(st) {
  const py = protoYear(st.content.era, st.seed, st.birthYear + st.age);
  const age = bodyAge(st);
  if (qx(st.content.era, st.sex, py, age) >= 1) return 1;
  return Math.min(1, causeHazards(st, py, age, healthMultiplier(st) * karmaMultiplier(st.ledger)).reduce((s, x) => s + x, 0));
}

// ตายปีนี้ด้วยสาเหตุอะไร · null = รอด — ดึง st.rng ครั้งเดียวต่อปีเท่าเดิม สาเหตุและนัดป่วยใช้ causeRng แยก
// โรคเรื้อรังไม่ตายปีที่สุ่มโดน แต่นัดตายอีก 1–3 ปีข้างหน้าด้วยโอกาสของอายุนั้น (scheduleIllness) — ผลรวมยังตรงตารางชีพ
function deathRoll(st) {
  const u = st.rng.next();
  if (st.terminal && st.age >= st.terminal.age) return st.terminal.cause;
  const era = st.content.era;
  const py = protoYear(era, st.seed, st.birthYear + st.age);
  const age = bodyAge(st);
  if (qx(era, st.sex, py, age) >= 1) return 'other';
  const keys = era.causes.keys;
  const hz = causeHazards(st, py, age, healthMultiplier(st) * karmaMultiplier(st.ledger));
  // เด็กเล็กยังไม่มีนัดจากปีก่อนครบทุกระยะ — ส่วนที่นัดไม่ถึงของโรคเรื้อรังตายปีนี้เลย
  const span = ILL_YEARS[1] - ILL_YEARS[0] + 1;
  const unscheduled = (span - Math.max(0, Math.min(span, age - ILL_YEARS[0] + 1))) / span;
  const now = hz.map((x, j) => (CHRONIC.includes(keys[j]) ? x * unscheduled : x));
  const sum = now.reduce((s, x) => s + x, 0);
  if (u < sum) return pickCause(st.causeRng, keys, now);
  // เฉียดตาย (B153) ต้องไหลต่อไปนัดป่วยเหมือนรอดปกติ — ข้ามแล้ว causeRng ขาดหนึ่งครั้ง นัดโรคทั้งชีวิตเลื่อน
  nearMiss(st, u - sum, keys, now);
  if (!st.terminal) scheduleIllness(st);
  return null;
}

function scheduleIllness(st) {
  const era = st.content.era;
  const years = st.causeRng.int(...ILL_YEARS);
  // นัดเก็บเป็นอายุไทย (ตัวนับที่ deathRoll เทียบ) · โอกาสอ่านด้วยอายุร่างกาย ณ วันนัด
  const age = st.age + years;
  const body = bodyAge(st) + years;
  const py = protoYear(era, st.seed, st.birthYear + age);
  if (body >= MAX_AGE || qx(era, st.sex, py, body) >= 1) return;
  const keys = era.causes.keys;
  const ch = causeHazards(st, py, body, healthMultiplier(st) * karmaMultiplier(st.ledger)).map((x, j) => (CHRONIC.includes(keys[j]) ? x : 0));
  if (!(st.causeRng.next() < ch.reduce((s, x) => s + x, 0))) return;
  st.terminal = { cause: pickCause(st.causeRng, keys, ch), age, told: false };
}

// ด่านตายเดียวของโลกหลัก (ขอบปี + ชีวิตหมดกลางปี): สัญญารอดตาย (B156) มาก่อนพิธีโกงความตาย (B153) แล้วจึงตาย
// คืน 'survive' พร้อมการ์ดเล่า (ผู้เรียกวางเอง) · 'court' = ตั้ง st.court แล้ว · 'dead' = ตั้ง st.dead/st.cause แล้ว ผู้เรียกจัดงานศพ
function faceDeath(st, cause, opts = {}) {
  if (st.pact?.survive === true) {
    // สัญญาจ่ายบาปแล้วจึงได้ของจริง · สุขภาพกลับค่าธรรมชาติ ไม่งั้นหมดตัวแล้วตายซ้ำทันที
    st.pact.survive = 'used';
    // เสี่ยงของโฟกัสที่ทอยตายไว้ต้องหายด้วย ไม่งั้นรอดปีนี้แล้วปีถัดไปตายด้วยเหตุเดิมทันที
    st.focusDoom = undefined;
    st.health = Math.max(st.health, st.healthNatural, 1);
    return { fate: 'survive', card: { kind: 'result', type: 'B', age: st.age, stage: stageOf(st.age), text: PACT.surviveText, tag: 'survive' } };
  }
  if (st.flags.cheat_death) {
    // ไปศาลก่อน แล้วตายปีนี้ด้วยสาเหตุเดิม · afterQueue = การ์ดผลที่รอในคิวเล่าก่อนเข้าศาล
    st.court = { ...summonsCourt(cause), ...(opts.afterQueue ? { afterQueue: true } : {}) };
    return { fate: 'court' };
  }
  st.dead = true;
  st.cause = cause;
  return { fate: 'dead' };
}

function healthCause(st) {
  const era = st.content.era;
  const py = protoYear(era, st.seed, st.birthYear + st.age);
  return pickCause(st.causeRng, era.causes.keys, causeShares(era, st.sex, py, bodyAge(st)));
}

// ข้อความแกนตอนตรวจเจอ — เลน A ต่อยอดด้วยการ์ด when.illness (ดูแล/ค่ารักษา/บอกลา)
const ILL_TEXT = {
  heart: 'หมอตรวจพบว่าหัวใจไม่ค่อยดีแล้ว ต้องกินยาและระวังตัวไปตลอด',
  stroke: 'เส้นเลือดในสมองตีบจนต้องนอนโรงพยาบาล ออกมาแล้วร่างกายไม่เหมือนเดิม',
  cancer: 'ผลตรวจออกมาว่าเป็นมะเร็ง หมอเริ่มพูดถึงการรักษาที่ยาวและหนัก',
  diabetes_kidney: 'เบาหวานกับไตทรุดลงจนหมอนัดตรวจถี่ขึ้นทุกเดือน',
  liver: 'หมอบอกว่าตับเริ่มแข็ง ต้องเลิกเหล้าและดูแลตัวเองอย่างจริงจัง',
  chronic_resp: 'หายใจหอบเหนื่อยง่ายขึ้นทุกวัน หมอบอกว่าปอดเสื่อมเรื้อรัง',
};

// ช่องแทนค่าครบทุกตัวในรายการปิดของด่าน build (PLACEHOLDERS) — ตัวที่ไม่เติมจะโผล่เป็น {ชื่อ} ดิบบนการ์ด
// ชื่อ = ชื่อเล่นที่สุ่มตอนเกิด (คำบรรยายยังเรียกผู้เล่นว่า "คุณ") · ลูกยังไม่มีชื่อ: เพศลูกรู้ตอนส่งไปเกิด ชื่อจึงตั้งที่รุ่นถัดไป
// จังหวัด = จังหวัดที่เกิด · ภาค = ภาคที่เกิด · คำพูดตามเพศ
const FILL = {
  อายุ: (st) => st.age,
  ภาค: (st) => regionLabel(st),
  จังหวัด: (st) => provinceLabel(st),
  เงิน: (st) => Math.round(st.money).toLocaleString('en-US'),
  ชื่อ: (st) => st.name,
  ชื่อลูก: (st) => focusOf(st, 'child')?.name ?? 'ลูก',
  ชื่อคู่: (st) => focusOf(st, 'spouse')?.name ?? 'คู่ชีวิต',
  ชื่อหลาน: (st) => focusOf(st, 'grandchild')?.name ?? 'หลาน',
  ชื่อผู้จากไป: (st) => (lastLoss(st) ? lossCall(lastLoss(st)) : 'คนในบ้าน'),
  ชื่อคู่เก่า: (st) => lastSpouseLoss(st)?.name ?? 'คู่ชีวิตคนก่อน',
  ปีคู่เก่า: (st) => (spouseYears(st) ? `${spouseYears(st)} ปี` : 'หลายปี'),
  ชื่อสัตว์: (st) => (focusOf(st, 'pet') ? petCall(focusOf(st, 'pet')) : 'เจ้าตัวเล็ก'),
  ชนิดสัตว์: (st) => focusOf(st, 'pet')?.kind ?? 'สัตว์',
  ชื่อฝูง: (st) => (focusOf(st, 'herd') ? petCall(focusOf(st, 'herd')) : 'สัตว์ในคอก'),
  ครับ: (st) => (st.sex === 'หญิง' ? 'ค่ะ' : 'ครับ'),
  ผม: (st) => (st.sex === 'หญิง' ? 'ฉัน' : 'ผม'),
  ลูกดูแลแบบเรา: (st) => filialMirrorText(st),
  พ่อแม่ที่ป่วย: (st) => illParentWord(st),
  // จดหมายคำฝาก (afterfall-3): ฝั่งผู้ฝากอ่านคนรอบตัวตอนตาย · ฝั่งทายาทอ่าน st.letter ที่ระหว่างชาติสร้างไว้
  ผู้รับซอง: (st) => (letterTo(st) ? letterToText(letterTo(st)) : 'คนข้างหลัง'),
  ผู้ฝาก: (st) => st.letter?.from ?? 'ผู้ใหญ่รุ่นก่อน',
  // ไม่บอกเหตุ (self_harm · other ก่อนชรา) ก็ยังต้องได้คำ — "ที่จากไปแล้ว" ไม่เผยเหตุ และช่องไม่ว่าง
  เหตุผู้ฝาก: (st) => st.letter?.cause?.join('') ?? 'แล้ว',
  ผู้ยื่นซอง: (st) => st.letter?.by ?? 'คนในบ้าน',
};

// สาเหตุการตาย (B110 · เจ้าของเคาะ): ป้ายสั้นภาษาคน [คำเชื่อม, คำนาม] — หน้าจอและจดหมายคำฝากใช้ตารางเดียวกัน
// self_harm ไม่อยู่ในตารางโดยตั้งใจ: ห้ามขึ้นจอจนกว่าแกนจะมีข้อความระวัง + สายด่วน 1323 · other ที่ยังไม่ชราไม่บอกอะไร
const CAUSE_TEXT = {
  infection: ['ด้วย', 'โรคติดเชื้อ'], pneumonia: ['ด้วย', 'ปอดอักเสบ'], heart: ['ด้วย', 'โรคหัวใจ'], stroke: ['ด้วย', 'โรคหลอดเลือดสมอง'],
  cancer: ['ด้วย', 'โรคมะเร็ง'], diabetes_kidney: ['ด้วย', 'โรคเบาหวานและไต'], liver: ['ด้วย', 'โรคตับ'], chronic_resp: ['ด้วย', 'โรคปอดเรื้อรัง'],
  road: ['จาก', 'อุบัติเหตุบนท้องถนน'], accident: ['จาก', 'อุบัติเหตุ'], assault: ['เพราะ', 'ถูกทำร้าย'], newborn: ['ด้วย', 'ภาวะแทรกซ้อนแรกเกิด'],
};
const causeWords = (cause, age) => (cause === 'other' ? (age >= STAGES.at(-1).from ? ['ด้วย', 'วัยชรา'] : null) : CAUSE_TEXT[cause] ?? null);
function fill(text, st) {
  return text.replace(/\{([^{}]*)\}/g, (m, k) => (FILL[k] ? String(FILL[k](st)) : m));
}

function levelValue(level) {
  const v = LEVELS[Math.abs(level)];
  if (v === undefined) throw new Error(`ระดับผลต้องเป็น ±1..±3 ได้ ${level}`);
  return Math.sign(level) * v;
}

// เพดานค่าใช้จ่าย income_x: เรื่องเดียวกัน (ค่าหาเสียง · งานบวช · ค่ารักษา) คนรายได้สูงจ่ายแพงกว่าได้แต่ไม่เกิน
// SPEND_CAP เท่าของคนรายได้ขั้นต่ำ — ไม่งั้นรายได้ร้อยเท่าค่าแรงขั้นต่ำทำให้ค่าหาเสียงผู้ใหญ่บ้านเป็นสิบล้าน · ฝั่งรายรับยังโตตามรายได้
// เงินเก็บต่อปีติดลบ/ศูนย์ (รายจ่ายเกินรายได้) ใช้ฐานของคนรายได้ขั้นต่ำแทน — ไม่งั้นค่าใช้จ่ายกลายเป็นได้เงิน
// เงินเก็บบวกแม้ต่ำกว่านั้นใช้ค่าจริง: ยกขึ้นทุกคนที่ต่ำกว่าฐานทำให้คนจนจ่ายแพงขึ้นทั้งกระดาน
const SPEND_CAP = 10;
function spendBase(st) {
  const year = st.birthYear + st.age;
  const era = st.content.era;
  const floor = minWage(era, st.seed, year) * era.finance.daysPerMonth * 12 * era.birth.saveRate;
  const saving = yearlySaving(st, year);
  return saving > 0 ? Math.min(saving, SPEND_CAP * floor) : floor;
}

// เงินในผลตัวเลือก: ตัวเลขเปล่า = บาทของปีนั้น · {unit: income_x} = จำนวนเท่าของเงินเก็บต่อปีตอนนี้
// · {unit: fixed_baht, ref_year} = บาทของปีอ้างอิง ปรับตามเงินเฟ้อจริงมาเป็นบาทของปีนี้
// spend = ผู้เรียกถามยอดที่ต้องมี/ต้องจ่าย (requires.money · ราคาใบหวย) ทั้งที่ amount เป็นบวก
function moneyValue(st, m, spend = false) {
  if (typeof m === 'number') return m;
  if (m.unit === 'income_x') return m.amount * (spend || m.amount < 0 ? spendBase(st) : yearlySaving(st));
  if (m.unit === 'fixed_baht') {
    const year = st.birthYear + st.age;
    const ref = m.ref_year ?? year;
    const era = st.content.era;
    return ref <= year ? m.amount * priceRatio(era, st.seed, ref, year) : m.amount / priceRatio(era, st.seed, year, ref);
  }
  throw new Error(`หน่วยเงินไม่รู้จัก: ${m.unit}`);
}

// ผลสุ่มที่เป็นผลร้าย = ไม่ใช่ทางสำเร็จ และมีค่าหรือเงินติดลบ — ญาติช่วยได้เฉพาะแบบนี้
function hurts(st, fx) {
  return !!fx && (STAT_KEYS.some((k) => fx[k] < 0) || (fx.money !== undefined && moneyValue(st, fx.money) < 0));
}
const AID_WHO = { spouse: 'คู่ชีวิต', child: 'ลูก', grandchild: 'หลาน' };

// s = ตัวหรี่ผลของการ์ดกองสุ่มเมื่อจับหลายรอบต่อปี (pace.mjs) · ยอดกู้หรี่ด้วยเพราะการ์ดกู้คู่กับเงินจ่ายออก · ลงทุน/งาน/เรื้อรังเป็นโครงสร้าง ไม่หรี่
// ก่อนเริ่มทำงาน ค่าใช้จ่าย (ผลการ์ด · ค่าเลี้ยงสัตว์ · งวดหนี้) คิดจากรายได้บ้าน เกินกระเป๋าเด็กได้ — ส่วนเกินบ้านจ่าย เด็กไม่ติดหนี้
function homePays(st) {
  if (st.workFrom === null && st.money < 0) st.money = 0;
}

// hurt = ตัวคูณส่วนที่ติดลบของค่าและเงิน (ญาติช่วยประคองตอนเจอผลร้าย) · ส่วนที่เป็นบวกไม่แตะ
// nat = ตัวคูณนิสัย (natureBoost) ส่วนที่เป็นบวกของค่าตรงนิสัยเท่านั้น · คืน true เมื่อตัวคูณมีผล (ป้าย "เพราะคุณเป็นคน…")
function applyEffects(st, fx = {}, s = 1, ss = s, hurt = 1, nat = null) {
  let hit = false;
  const cut = (v) => (v < 0 ? v * hurt : v);
  const up = (k, v) => (nat?.stat === k && v > 0 ? ((hit = true), v * nat.mul) : v);
  for (const k of STAT_KEYS) if (fx[k]) st[k] = clamp(st[k] + cut(up(k, levelValue(fx[k]) * ss)));
  if (fx.money?.grey) greyAdd(st, moneyValue(st, fx.money) * s);
  else if (fx.money) {
    st.money += cut(up('money', moneyValue(st, fx.money) * s));
    homePays(st);
  }
  if (fx.grey_seize) greySeize(st, fx.grey_seize);
  if (fx.grey_launder) greyLaunder(st, fx.grey_launder);
  // เงินชดเชยคิดจากงานเดิม — ต้องลงก่อนผลเปลี่ยนงานในก้อนเดียวกัน
  if (fx.severance && isWorking(st)) st.money += (severanceDays(st) * monthlyIncome(st)) / 30;
  if (fx.retire && isWorking(st)) {
    st.retireBase = (monthlyIncome(st) * 12) / st.price;
    st.retiredAt = st.age + 1;
  }
  if (fx.invest) invest(st, fx.invest);
  if (fx.debt) borrow(st, fx.debt, s);
  if (fx.settle) settle(st, fx.settle);
  if (fx.complain) for (const d of st.debts) complainDebt(st.content.era, d);
  if (fx.income_mult) {
    const m = nat?.job && fx.income_mult > 1 ? ((hit = true), 1 + (fx.income_mult - 1) * nat.mul) : fx.income_mult;
    st.incomeMult = Math.max(INCOME_MULT[0], Math.min(INCOME_MULT[1], st.incomeMult * m ** s));
  }
  if (fx.school) {
    st.school = fx.school === 'none' ? null : fx.school;
    if (!st.school && st.workFrom === null) st.needJob = true;
  }
  if (fx.job) {
    const o = st.content.era.finance.occupations.find((x) => x.id === fx.job);
    if (!o) throw new Error(`อาชีพไม่รู้จัก: ${fx.job}`);
    st.occupation = o.id;
    st.occupationName = o.name;
    if (st.workFrom === null) st.workFrom = st.age;
    // ตัวคูณรายได้ผูกกับงานเดิม เปลี่ยนงานแล้วเริ่มนับใหม่ · งานตรงพรสวรรค์ติดชาติเริ่มสูงกว่านิดหนึ่ง
    st.incomeMult = talentStart(st);
    st.jobSince = st.age;
    enterByJob(st, o.id);
  }
  if (fx.ladder) {
    if (st.workFrom === null) st.workFrom = st.age;
    st.jobSince = st.age;
    enterLadder(st, fx.ladder);
    // วัดพรสวรรค์หลังเข้าสาย — อาชีพเปลี่ยนตามขั้นแรกของสาย
    st.incomeMult = talentStart(st);
    // ทางแรกของสาย (B170): การ์ด first_of ออกปีที่เข้าสาย ครั้งเดียวต่อชีวิต (เข้าสายซ้ำไม่ออกอีก) · แทนการ์ดกองสุ่มหนึ่งใบแบบผลย้อน ชีวิตจึงไม่ยาวขึ้น
    const first = st.content.events.find((e) => e.first_of === fx.ladder && !st.done[e.id]);
    if (first) {
      st.done[first.id] = true;
      st.due.push({ kind: 'eraEvent', ev: first, age: st.age });
      takeYearQuota(st);
    }
  }
  if (fx.promote !== undefined) promote(st, fx.promote);
  if (fx.office !== undefined) setOffice(st, fx.office);
  for (const [k, v] of Object.entries(fx.chronic ?? {})) {
    const lv = Math.max(-CHRONIC_MAX, Math.min(CHRONIC_MAX, (st.chronic[k] ?? 0) + v));
    if (lv) st.chronic[k] = lv;
    else delete st.chronic[k];
    st.chronicAge[k] = st.age;
  }
  return hit;
}

// ไอเทมติดตัว (B78): state สร้างตอนได้ชิ้นแรก — ชีวิตที่ไม่เคยได้ของและเซฟก่อนมีระบบจึงไม่มีช่องนี้ ผู้อ่านใช้ itemsOf ได้ช่องว่าง
const itemsOf = (st) => st.items ?? { wear: Object.fromEntries(Object.keys(st.content.items.slots).map((k) => [k, null])), bag: [], cap: st.content.items.cap };
// จอโชว์ช่องไอเทมเมื่อโลกซ้อนทับถึงขั้น 3 หรือมีของแล้ว — ก่อนนั้นช่องว่างเปล่าบอกใบ้ระบบที่ผู้เล่นยังไปไม่ถึง
const itemsVisible = (st) => overlapStageOf(st) >= 3 || (st.items ? Object.values(st.items.wear).some(Boolean) || st.items.bag.length > 0 : false);

// ไม่ดึงเลขสุ่ม: ได้ชิ้นแรกในลิสต์ที่ยังไม่มี ครบแล้วไม่ได้เพิ่ม · ลงช่องชนิดตรงถ้าว่าง ไม่งั้นเข้าเป้ · เป้เต็มขายทันที (ไม่มีปุ่มทิ้ง/ให้)
// คืนข้อความที่ผู้เล่นเห็น หรือ null เมื่อไม่ได้อะไร
function gainLoot(st, ids) {
  const reg = st.content.items;
  const it = itemsOf(st);
  const id = ids.find((x) => !Object.values(it.wear).includes(x) && !it.bag.includes(x));
  if (!id) return null;
  st.items = it;
  const item = reg.list[id];
  let where;
  if (!it.wear[item.slot]) {
    it.wear[item.slot] = id;
    where = ` ใส่ช่อง${reg.slots[item.slot]}`;
  } else if (it.bag.length < it.cap) {
    it.bag.push(id);
    where = ' เก็บเข้าเป้';
  } else {
    st.money += moneyValue(st, item.sell);
    where = ' แต่เป้เต็ม เลยขายต่อได้เงินแทน';
  }
  return `${item.text} · ได้${item.name}${where}`;
}

// เรื้อรังไหลทุกปี แล้วจางลงระดับละ 1 ทุก CHRONIC_FADE ปีนับจากครั้งล่าสุดที่ระดับเปลี่ยน
// ไม่แตะเส้นสุขภาพธรรมชาติ — ป่วยเรื้อรังจึงเพิ่มโอกาสตายจริง
function flowChronic(st) {
  for (const [k, lv] of Object.entries(st.chronic)) {
    st[k] = clamp(st[k] + lv * CHRONIC_STEP[k]);
    if (st.age - st.chronicAge[k] < CHRONIC_FADE) continue;
    const next = lv - Math.sign(lv);
    if (next) st.chronic[k] = next;
    else delete st.chronic[k];
    st.chronicAge[k] = st.age;
  }
}

// พ่อแม่แก่และตายตามตารางชีพเดียวกับตัวเอง (แนวชีวิตของปีปฏิทินนั้น) ด้วย stream ของครอบครัว · สาเหตุ+นัดป่วยจาก kinCauseRng (B110)
// พ่อ/แม่ที่เป็นผู้เล่นรุ่นก่อน (diesAt) ตายตามชะตาที่เล่นไปแล้ว ไม่สุ่มซ้ำ · สาเหตุติดมากับ heir
function ageParents(st, year) {
  for (const p of st.parents) {
    if (!p.alive) continue;
    p.age += 1;
    const roll = st.famRng.next();
    if (p.diesAt !== undefined) {
      if (p.age >= p.diesAt) {
        p.diedAge = p.age;
        parentDied(st, p, year);
      }
      continue;
    }
    const cause = kinDeathRoll(st.content.era, st.seed, st.kinCauseRng, p, year, p.age, roll);
    if (cause) {
      p.diedAge = p.age;
      p.cause = cause;
      parentDied(st, p, year);
    }
  }
}

// มรดกจากรุ่นก่อน (ทางเป็นลูก) ถึงมือปีที่พ่อ/แม่ผู้เล่นรุ่นก่อนตาย · เก็บเป็นเท่าของรายได้ครัวเรือนทั้งปีของประเทศ แปลงเป็นบาทของปีนี้
function receiveLegacy(st, year, stage) {
  const { units, debt, from } = st.legacy;
  st.legacy = null;
  // มรดกมาพร้อมการจากไป — มรดกตอนแรกเกิด (ตายปีที่ลูกเกิด) ต้องปิดชีวิตพ่อ/แม่ตรงนี้ ageParents ยังไม่เคยเดิน
  for (const p of st.parents) {
    if (!p.ancestor || !p.alive) continue;
    parentDied(st, p, year);
  }
  const baht = units * nationalIncome(st.content.era, st.seed, year) * 12;
  st.money += baht;
  const ancestor = st.parents.find((p) => p.ancestor);
  const who = from ?? (ancestor?.sex === 'หญิง' ? 'แม่' : 'พ่อ');
  const sum = Math.round(baht).toLocaleString('en-US');
  // หลาน/เหลน (B18): รุ่นก่อนไม่ใช่พ่อแม่ มรดกตกทอดผ่านพ่อแม่ — พ่อแม่ไม่ได้จากไปด้วย
  const text = !ancestor && from
    ? (baht > 0 ? `มรดกจาก${who}ตกทอดผ่านพ่อแม่มาถึงเรา ${sum} บาท` : debt ? `${who}จากไปพร้อมหนี้ ทายาทรับผิดไม่เกินมรดก หนี้จึงไม่ตกถึงเรา` : `${who}จากไป ไม่มีทรัพย์เหลือตกทอดมาถึงเรา`)
    : baht > 0
      ? `${who}จากไป ทิ้งมรดกส่วนของเราไว้ ${sum} บาท`
      : debt
        ? `${who}จากไปพร้อมหนี้ ทายาทรับผิดไม่เกินมรดกที่ได้ หนี้ที่เหลือจึงไม่ตกถึงเรา`
        : `${who}จากไป ไม่มีทรัพย์เหลือเป็นมรดก`;
  st.due.push({ kind: 'result', type: 'A', age: st.age, stage, text, tag: 'inherit' });
}

// จดหมายคำฝาก (afterfall-3): ตามหลังการ์ดมรดก ⇒ ไม่มีทางออกขณะผู้ฝากยังอยู่ · ไม่กินโควตาปี ไม่ดึงเลขสุ่ม
// ใบที่ออกเลือกจาก parent_flags (ชนิดคำฝาก) · ธงไม่ถึงชั้นนี้ = ไม่มีใบ
function receiveLetter(st) {
  st.letter = { ...st.letter, read: true };
  const ev = st.content.events.find((e) => e.id.startsWith(LETTER.read) && whenOk(st, e.when));
  if (!ev) return;
  st.done[ev.id] = true;
  st.fired[ev.id] = { n: 1, age: st.age };
  st.due.push({ kind: 'eraEvent', ev, age: st.age });
}

// ย้ายสัดส่วน share ของเงินทั้งหมดเข้าสินทรัพย์เดียว · ด่าน build กั้นปีไว้แล้ว ถึงตรงนี้ปีผิด = เนื้อหาหลุดด่าน
function invest(st, { asset, share }) {
  if (!assetOpen(st.content.era, asset, st.birthYear + st.age)) throw new Error(`${assetName(asset)} ยังไม่มีในปี ${st.birthYear + st.age}`);
  const next = {};
  for (const [id, w] of Object.entries(st.alloc)) next[id] = w * (1 - share);
  next[asset] = (next[asset] ?? 0) + share;
  st.alloc = next;
}

// จบช่วงเรียน: ได้วุฒิ แล้วออกด่านเรียนต่อ หรือการ์ดหางานถ้าเป็นช่วงสุดท้าย
function finishTrack(st, year) {
  const track = st.school && TRACKS[st.school];
  if (!track || st.age !== track.until) return;
  if (eduRank(track.edu) > eduRank(st.edu)) st.edu = track.edu;
  if (track.exam) for (const ev of preludes(st, track.exam, year)) st.due.push({ kind: 'eraEvent', ev, age: st.age });
  if (track.gate) st.due.push({ kind: 'eraEvent', ev: schoolGate(st), age: st.age });
  else {
    st.school = null;
    if (track.ladder) applyEffects(st, { ladder: track.ladder });
    else st.due.push({ kind: 'eraEvent', ev: jobCard(st), age: st.age });
  }
}

// เริ่มกลางวัย (B76 ผู้สืบสายเลือด): คนที่โตมาแล้วจริง ไม่เล่นวัยเด็กซ้ำ · ค่าสถานะเดินตามธรรมชาติของปีที่ข้าม ไม่มีเหตุการณ์ ไม่ดึงเลขสุ่มของโลก
// พ่อแม่: คนที่มีอายุตายจริง (คนในครอบครัวรุ่นก่อน) ตายตามนั้น · คนที่สร้างใหม่ยังอยู่ · รุ่นก่อน (ancestor) ตายปีที่เริ่มผ่านมรดก
function skipToAge(st, age) {
  const era = st.content.era;
  while (st.age < age) {
    st.age += 1;
    const year = st.birthYear + st.age;
    st.price *= 1 + inflationRate(era, st.seed, year) / 100;
    const r = healthDecay(st.age);
    st.health = clamp(st.health * (1 - r));
    st.healthNatural *= 1 - r;
    st.happiness = clamp(st.happiness + (st.baseHappiness - st.happiness) * HAPPY_PULL);
    st.knowledge = clamp(st.knowledge + (knowledgeGain(st.age) * moodMul(st) * (100 - st.knowledge)) / 100);
    st.relations = clamp(st.relations * (1 - RELATION_FADE));
    for (const p of st.parents) {
      if (!p.alive) continue;
      p.age += 1;
      if (p.diesAt !== undefined && !p.ancestor && p.age >= p.diesAt) {
        p.diedAge = p.age;
        parentDied(st, p, year);
      }
    }
  }
  st.lowWarned = st.health <= WARN.human;
  st.standing = [{ age: st.age, cls: CLASSES.indexOf(st.cls) }];
}

// ช่วงเรียนตามอายุจริง: ถึงมัธยมปลายเสมอ (16–18) · 18 = เพิ่งจบ ออกด่านสอบ/ทางต่อปีนี้
// 19–22 = เรียนมหาวิทยาลัยถ้าความรู้ถึงเกณฑ์ (ปีจบ = ออกการ์ดหางานปีนี้) · ไม่ถึง = เลิกเรียนแล้ว หางานทันที
function startSchool(st, year) {
  st.edu = TRACKS.lower.edu;
  if (st.age <= TRACKS.upper.until) {
    st.school = 'upper';
    finishTrack(st, year);
    return;
  }
  st.edu = TRACKS.upper.edu;
  if (st.knowledge >= HEIR_UNI_KNOW) {
    st.school = 'uni';
    finishTrack(st, year);
    return;
  }
  st.school = null;
  st.due.push({ kind: 'eraEvent', ev: jobCard(st), age: st.age });
}
// เกณฑ์เดียวกับด่านสอบโรงเรียนดัง (career.mjs) — มหาวิทยาลัยรัฐเองไม่มีเกณฑ์ล็อก มีแต่โอกาสสอบติด
const HEIR_UNI_KNOW = 55;

// เดินหนึ่งปี: ทุกอย่างไหลเป็นรายปีในลูปนี้ที่เดียว การกระโดดหลายปีจึงได้ผลเท่ากับเดินทีละปีเสมอ
function stepYear(st) {
  const prevStage = stageOf(st.age);
  lifeFocusYear(st);
  natureLock(st);
  // ปีสุดท้ายที่ทำงานต้องวัดก่อนขึ้นอายุ — ขึ้นแล้ว isWorking เป็นเท็จ
  // คนที่ยังนั่งตำแหน่งเต็มเวลาหลังเกษียณวัดใหม่ทุกปีจนเลิกทำงาน — ปีที่ปกติถึงเกษียณได้ค่าเดิม
  if (isWorking(st) && st.age + 1 >= RETIRE_AGE) {
    st.retireBase = (monthlyIncome(st) * 12) / st.price;
    // บำนาญข้าราชการ (B40): ค่าจ้างสุดท้าย × ปีรับราชการ ÷ div ไม่เกิน cap เท่าของค่าจ้างสุดท้าย
    const pen = st.content.era.careers.pension;
    st.pension = ladderOf(st)?.pension ? Math.min(pen.cap, (st.age + 1 - st.ladder.from) / pen.div) * jobWage(st, st.birthYear + st.age) * 12 / st.price : 0;
  }
  // ปีทำงานต่ออาชีพ — อาชีพหลักที่ชาติถัดไปจำได้ (past.mjs) · ช่องเกิดปีแรกที่ทำงาน
  if (isWorking(st)) {
    const w = (st.workYears ??= {});
    w[st.occupation] = (w[st.occupation] ?? 0) + 1;
    // ช่วงงานตามอายุ (ui-redo 131) ให้แผงตัวฉันเรียงประวัติงาน · ปีว่างงานคั่น = ช่วงใหม่ · workYears คงไว้ให้ past/titles
    // เซฟก่อนมีช่องนี้เริ่มนับจากปีที่เล่นต่อ — ปีก่อนหน้าจอคิดจาก workYears ลบผลรวมช่วง ไม่เดาอายุย้อนหลัง
    const spans = (st.workSpans ??= []);
    const last = spans.at(-1);
    if (last?.occ === st.occupation && last.to === st.age - 1) last.to = st.age;
    else spans.push({ occ: st.occupation, from: st.age, to: st.age });
  }

  st.age += 1;
  const year = st.birthYear + st.age;
  st.price *= 1 + inflationRate(st.content.era, st.seed, year) / 100;

  const r = healthDecay(st.age);
  st.health = clamp(st.health * (1 - r));
  st.healthNatural *= 1 - r;
  st.happiness = clamp(st.happiness + (st.baseHappiness - st.happiness) * HAPPY_PULL);
  st.knowledge = clamp(st.knowledge + (knowledgeGain(st.age) * moodMul(st) * (100 - st.knowledge)) / 100);
  st.relations = clamp(st.relations * (1 - RELATION_FADE));
  flowChronic(st);
  ageParents(st, year);
  // คนในบ้านจากไปเองปีนี้ = การ์ดแจ้งทุกครั้ง ก่อนเหตุการณ์ของปี
  // digest = ชนิดข่าวญาติ/สัตว์ (ui-redo ใบ 27) ให้จอรวมหลายใบติดกันเป็นใบเดียว · ป้ายคงที่ไม่ดึงเลขสุ่ม · ข่าวตัวเรา/เงิน/ตำแหน่งไม่ติด จึงคงใบเดี่ยว
  for (const l of ageKin(st, year, yearlySaving(st))) st.due.push({ kind: 'result', type: 'A', age: st.age, stage: stageOf(st.age), text: lossText(l), loss: l, ...(careHelp(l.cause) && { help: careHelp(l.cause) }), digest: 'kin_loss', tag: 'loss' });
  for (const n of kinIllNews(st, year)) st.due.push({ kind: 'result', type: 'A', age: st.age, stage: stageOf(st.age), ...n, digest: 'kin_ill', tag: 'sick' });
  for (const m of petArrivals(st, year)) st.due.push({ kind: 'result', type: 'A', age: st.age, stage: stageOf(st.age), text: petArriveText(m), digest: 'pet', tag: 'pet' });
  if (st.terminal && !st.terminal.told) {
    st.terminal.told = true;
    st.terminal.toldAge = st.age;
    st.due.push({ kind: 'result', type: 'A', age: st.age, stage: stageOf(st.age), text: ILL_TEXT[st.terminal.cause], illness: { cause: st.terminal.cause, left: st.terminal.age - st.age }, tag: 'sick' });
  }
  // ผลตอบแทนคิดกับเงินต้นปีก่อนเงินเก็บของปีนี้เข้า · ติดลบ = หนี้ ทบดอกเบี้ยเงินกู้ของปีนั้น
  const era = st.content.era;
  if (st.money > 0) {
    st.money *= 1 + portfolioReturn(era, st.seed, st.alloc, year);
  } else if (st.money < 0) st.money *= 1 + lendingRate(era, st.seed, year);
  if (isWorking(st)) st.money += yearlySaving(st, year);
  else if (st.retireBase !== null) st.money -= retireSpend(st, year) - st.pension * st.price;
  let paid = 0;
  for (const d of st.debts) {
    const p = payDebt(era, st.seed, d, year);
    st.money -= p;
    paid += p;
  }
  st.debts = st.debts.filter((d) => !debtDone(d));
  homePays(st);
  const stage = stageOf(st.age);
  if (st.legacy && st.age >= st.legacy.age) receiveLegacy(st, year, stage);
  if (st.letter && !st.letter.read && !st.legacy && st.age >= st.letter.age) receiveLetter(st);
  st.trail.push({ year, money: Math.round(st.money) });
  st.statTrail.push(statPoint(st));

  checkBankrupt(st, year, stage);
  debtLoad(st, year, paid);
  informalFlag(st);
  const tone = omenTone(st.ledger);
  if (!tone) st.omenTone = null;
  else if (tone !== st.omenTone && (st.omenAge === null || st.age - st.omenAge >= OMEN.gap)) {
    st.omenTone = tone;
    st.omenAge = st.age;
    st.due.push({ kind: 'omen', tone, age: st.age, stage, text: omenText(tone, st.seed, st.age) });
  }
  if (stage !== prevStage) {
    // จุดกราฟฐานะตระกูล (B95) ทุกต้นช่วงวัย — ไม่ออกไปกับการ์ด
    st.standing.push({ age: st.age, cls: standingOf(st, year) });
    st.due.push({ kind: 'stage', age: st.age, stage, text: `เข้าสู่ช่วง${stage}`, recap: stageRecap(st, st.age - 1) });
    st.stageMark = markStage(st);
  }
  finishTrack(st, year);
  // สายยศ (B40): ปีในขั้นนับตามความสุข ถึงคิวแล้วการ์ดเลื่อนขั้น · ผู้ใหญ่บ้าน/กำนันพ้นตำแหน่งตอนเกษียณ · ครบวาระ/ถูกชวนลงสมัคร = การ์ดเลือกตั้ง
  // การ์ดงบ/ครบวาระของคนมีตำแหน่งการเมืองกินโควตากองสุ่มแบบเรื่องต่อ — เจอทุกวาระ ชีวิตจึงยาวขึ้นเฉพาะสายนี้ (หางด่าน 4)
  // ไม่หัก: การ์ดเลื่อนขั้น (ออกกับคนทำงานแทบทุกคน) · ใบชวนลงสมัครครั้งแรก (ออกกับทุกคนที่คอนเน็คชั่นถึง แม้ไม่ลง) — หักแล้วชีวิตสั้นลงทั้งกระดาน ไม่ใช่แค่หาง
  const officeDueCard = (ev) => {
    st.due.push({ kind: 'eraEvent', ev, age: st.age });
    if (st.office) takeYearQuota(st);
  };
  if (isWorking(st)) {
    ageRank(st, moodMul(st));
    if (promoDue(st)) st.due.push({ kind: 'eraEvent', ev: promoCard(st), age: st.age });
  }
  if (st.office && !officeFull(st) && st.age >= RETIRE_AGE) {
    st.due.push({ kind: 'result', type: 'A', age: st.age, stage, text: `อายุครบ ${RETIRE_AGE} พ้นตำแหน่ง${officeStep(st).name}ตามกฎหมาย ชาวบ้านจัดงานเลี้ยงส่ง`, tag: 'retire' });
    st.office = null;
  }
  if (budgetDue(st)) officeDueCard(budgetCard(st));
  // ทอยเลขสุ่มของการ์ดชวนก่อนเสมอ แล้วจึงดูประตู — ชีวิตที่ประตูปิดดึงเลขเท่าเดิม เส้นทางอื่นจึงไม่ขยับ
  if (officeDue(st) && (st.office || lifeGateOpen(st, OFFICE_GATE))) officeDueCard(officeCard(st));
  if (recruitDue(st)) st.due.push({ kind: 'eraEvent', ev: recruitCard(st), age: st.age });
  if (isWorking(st) && earlyDue(st)) st.due.push({ kind: 'eraEvent', ev: earlyCard(st), age: st.age });
  if (isAllocAge(st.age)) st.due.push(allocCard(st, year, stage));
  // ทุกภาคเจอได้ · เว้นอย่างน้อย ERA_GAP ปีไม่ให้ถี่จนกลบเรื่องชีวิต — ปีที่เว้น เงินยังเสียตามปีต้นแบบ
  // ปีต้นแบบวนได้ แต่เหตุจริงครั้งเดียวในประวัติศาสตร์ (B99a): กลุ่มเหตุเดิมออกครั้งเดียวต่อชีวิต ทั้งการ์ดเล่าและใบรับมือ · ปีที่ข้าม เงินยังเสียตามปีต้นแบบ
  let eras = eraEventsAt(st.content.era, st.seed, year);
  if (eras.length) {
    const seen = erasSeen(st, st.age - 1);
    eras = eras.filter((e) => !seen.has(e.id));
  }
  if (eras.length && (st.lastEraAge === null || st.age - st.lastEraAge >= ERA_GAP)) {
    st.lastEraAge = st.age;
    for (const e of eras) {
      // เล่าเหตุการณ์บ้านเมืองก่อนเสมอ · มีการ์ดเนื้อหาผูกไว้ = ตามด้วยการ์ดให้เลือกรับมือ
      st.due.push({ kind: 'era', id: e.id, age: st.age, stage, eraKind: e.kind, text: e.name, story: eraStory(st, e) });
      const ev = st.content.events.find((c) => c.era === e.id && !st.done[c.id] && whenOk(st, c.when) && (c.when?.age || c.stage === stage));
      if (ev) {
        st.done[ev.id] = true;
        st.due.push({ kind: 'eraEvent', ev, age: st.age });
      }
    }
  }
  heraldNextYear(st, year);
}

// กลุ่มเหตุบ้านเมืองที่ออกแล้วถึงอายุ upTo — ไล่ย้อนจาก seed + ปีเกิดด้วยกติกาเดียวกับ stepYear แทนการเก็บคีย์ใหม่ใน st
// lifehash hash state ทั้งก้อน: เก็บคีย์ = ทุกชีวิตที่เจอเหตุบ้านเมืองขยับ · ไล่ย้อน = ขยับเฉพาะชีวิตที่เคยเจอซ้ำ
function erasSeen(st, upTo) {
  return new Set(erasShown(st, upTo).map(({ e }) => e.id));
}

// เหตุบ้านเมืองที่ขึ้นการ์ดเล่าจริงถึงอายุ upTo พร้อมอายุที่ออก — ฉายาที่นับภัยต้องนับเฉพาะที่ผู้เล่นเห็น ไม่ใช่ทุกปีต้นแบบที่วนมา
function erasShown(st, upTo) {
  const shown = [], seen = new Set();
  let last = null;
  for (let a = 1; a <= upTo; a++) {
    const es = eraEventsAt(st.content.era, st.seed, st.birthYear + a).filter((e) => !seen.has(e.id));
    if (!es.length || (last !== null && a - last < ERA_GAP)) continue;
    last = a;
    for (const e of es) {
      seen.add(e.id);
      shown.push({ e, age: a });
    }
  }
  return shown;
}

// ลางภัยยุค (afterfall-1): ปีหน้ามีภัยที่จะได้ใบรับมือครั้งแรก = ใบ herald_of ออกปีนี้ให้เตรียมตัว
// ปีภัยคำนวณจาก seed ได้ล่วงหน้า (protoYear) จึงไม่ดึงเลขสุ่ม · ERA_GAP ตัดปีไหนก็รู้ก่อนเหมือนกัน — ลางเกือบไม่หลอก นอกจากตายก่อน
// ผู้ใหญ่: แทนการ์ดกองสุ่มหนึ่งใบแบบ first_of ชีวิตจึงไม่ยาวขึ้น · ลางเริ่มอายุ 18 (เด็ก/วัยรุ่นเตรียมอะไรเองไม่ได้ · ลางก่อน 18 ทำแบบชีวิตสั้นลูกนกหัดบินหาย จน full ตก)
// ก่อน HERALD_QUOTA_FROM ไม่กินโควตา (ใบกองสุ่มวัยเด็กมีน้อย เบียดออกแล้วแบบชีวิตสั้นหายครึ่ง) — ตอนนี้เท่า HERALD_MIN_AGE ทุกลางจึงกินโควตา · แยกค่าไว้ถ้าลดอายุลางอีก
function heraldNextYear(st, year) {
  // ของที่เตรียมไว้ใช้ได้แค่ปีภัย — ไม่กดใช้ในใบรับมือก็หมดอายุ ธงไม่ค้างไปปลดอะไรตอนแก่
  for (const f of Object.keys(st.flags)) {
    if (f.startsWith(HERALD_FLAG) && st.age - st.flagAge[f] > 1) {
      delete st.flags[f];
      delete st.flagAge[f];
    }
  }
  if (st.age < HERALD_MIN_AGE) return;
  if (st.lastEraAge !== null && st.age + 1 - st.lastEraAge < ERA_GAP) return;
  // เพดานต่อชีวิต: ภัยทุกชนิดได้ลาง = แฟนตาซีเกินเป้า 5–8 ใบ/ชีวิตทุกบอท · นับจาก st.done ไม่เพิ่มคีย์ใน st (lifehash hash ทั้งก้อน)
  let left = HERALD_PER_LIFE - st.content.events.filter((c) => c.herald_of && st.done[c.id]).length;
  if (left <= 0) return;
  const next = eraEventsAt(st.content.era, st.seed, year + 1);
  // กลุ่มเหตุที่เจอแล้วจะไม่ออกอีก ลางของมันจึงหลอก
  const seen = next.length ? erasSeen(st, st.age) : null;
  for (const e of next) {
    if (seen.has(e.id)) continue;
    const answers = st.content.events.filter((c) => c.era === e.id);
    if (answers.some((c) => st.done[c.id])) continue;
    // ช่วงอายุปีหน้าไม่มีใบรับมือ (วิกฤตเศรษฐกิจวัยรุ่นนอกโรงเรียน) = ลางไม่มีใบให้ใช้ของที่เตรียม · เงื่อนไขอื่นของปีหน้ายังเดาไม่ได้
    const age = st.age + 1;
    if (!answers.some((c) => (c.when?.age ? age >= c.when.age[0] && age <= c.when.age[1] : c.stage === stageOf(age)))) continue;
    const h = st.content.events.find((c) => c.herald_of === e.id && !st.done[c.id] && inYears(c, year) && whenOk(st, c.when));
    if (!h) continue;
    st.done[h.id] = true;
    st.due.push({ kind: 'eraEvent', ev: h, age: st.age });
    if (st.age >= HERALD_QUOTA_FROM) takeYearQuota(st);
    if (--left <= 0) return;
  }
}
const HERALD_MIN_AGE = 18;
const HERALD_PER_LIFE = 1;
const HERALD_QUOTA_FROM = 18;
const HERALD_FLAG = 'braced:';

// การ์ดนำของด่านสอบ (B63): ไม่อยู่ในกองสุ่ม ออกในคิวก่อนด่านปีเดียวกัน — "พรุ่งนี้สอบ" จึงตามด้วยด่านจริงเสมอ
// ทอย chance หลังผ่านเงื่อนไขแล้วเท่านั้น ชีวิตที่ไม่เข้าเงื่อนไขจึงไม่กิน rng ของโลก
function preludes(st, exam, year) {
  const out = [];
  for (const ev of st.content.events) {
    if (ev.prelude?.before !== exam || st.done[ev.id] || !inYears(ev, year) || !whenOk(st, ev.when) || !beliefOk(st, ev)) continue;
    if (st.rng.next() >= ev.prelude.chance) continue;
    st.done[ev.id] = true;
    st.fired[ev.id] = { n: 1, age: st.age };
    beliefFired(st, ev);
    out.push(ev);
  }
  return out;
}

// รายจ่ายหลังเกษียณ/ปี = พื้นค่าครองชีพ (เท่าของค่าแรงขั้นต่ำทั้งปี) + สัดส่วนของรายได้ปีสุดท้าย
// สัดส่วนล้วนกินเงินเก็บทุกฐานะเท่ากันจนครึ่งล่างแบน · พื้นคงที่ทำให้คนรายได้น้อยกินเงินเก็บเร็วกว่า
function retireSpend(st, year) {
  const f = st.content.era.finance;
  const floor = f.debt.retireFloor * minWage(st.content.era, st.seed, year) * f.daysPerMonth * 12;
  return floor + f.debt.retireSpend * st.retireBase * st.price;
}

const totalDebt = (st) => st.debts.reduce((s, d) => s + d.balance, 0);
// ทรัพย์สุทธิ = เงิน − หนี้รายก้อน (เงินติดลบนับเป็นหนี้อยู่แล้ว)
const netWorth = (st) => st.money - totalDebt(st);
// ค่าโลกจริงตอนข้ามไปต่างโลก (B100) — ปรโลกส่งตอนเกิดใหม่ข้ามโลก ทริปกลางชีวิตส่งตอนกดรับ (B136)
const realAt = (st) => ({ stats: Object.fromEntries(STAT_KEYS.map((k) => [k, st[k]])), money: netWorth(st), unit: nationalIncome(st.content.era, st.seed, st.birthYear + st.age) * 12, age: st.age });

// ฐานะระหว่างชีวิต (B95): รายได้เทียบเท่าต่อเดือนเทียบรายได้ครัวเรือนของประเทศปีนั้น ตัดด้วยเส้นแบ่ง 10 ระดับชุดเดียวกับฐานะตอนเกิด
// รายได้เทียบเท่า = รายได้จากงาน × STANDING.household (คนเดียวเทียบรายได้ทั้งบ้าน) + ทรัพย์สุทธิ × STANDING.yield ต่อปี (ติดลบได้)
// ยังไม่เคยทำงาน = ฐานะของบ้านตอนเกิด · อ่าน state ล้วน ไม่ดึงเลขสุ่ม
const STANDING = { household: 1.6, yield: 0.04 };
function standingOf(st, year = st.birthYear + st.age) {
  if (st.workFrom === null) return CLASSES.indexOf(st.cls);
  const b = st.content.era.birth;
  const work = isWorking(st) ? monthlyIncome(st, year) : st.retireBase !== null ? (st.retireBase * st.price) / 12 : 0;
  const eq = work * STANDING.household + (netWorth(st) * STANDING.yield) / 12;
  if (eq <= 0) return 0;
  const z = (Math.log(eq / nationalIncome(st.content.era, st.seed, year)) + (b.sigma * b.sigma) / 2) / b.sigma;
  return b.cutZ.filter((c) => z > c).length;
}
// ชนชั้นที่การ์ดเช็ก (when.class · multipliers.class · B111 เจ้าของเคาะ): ฐานะตอนเกิดมีผลถึงก่อนเริ่มทำงาน หลังจากนั้นอ่านฐานะปีนั้น
// ไม่งั้นคนเกิดจนที่รวยแล้วไม่เจอการ์ดคนรวยตลอดชีวิต · standingOf คืนฐานะตอนเกิดให้เองเมื่อยังไม่เคยทำงาน
const classNow = (st) => CLASSES[standingOf(st)];

// รายได้ทั้งปีที่ใช้วัดว่าหนี้ท่วมแค่ไหน: ทำงานอยู่ = รายได้ปีนี้ · เกษียณแล้ว = รายได้ปีสุดท้ายปรับเงินเฟ้อ
// ยังไม่เคยทำงาน (เรียนอยู่ระหว่างปลอดหนี้ กยศ.) ไม่มีฐาน จึงไม่นับ
function debtIncome(st, year) {
  if (isWorking(st)) return monthlyIncome(st, year) * 12;
  return st.retireBase === null ? null : st.retireBase * st.price;
}

// เงินก้อน/รายได้/หนี้ที่การ์ดเช็ก (B111 ข้อเคาะ 2–4) เป็นอัตราส่วน ไม่ใช่บาท — เกณฑ์เดียวใช้ได้ทุกยุคทุกฐานะ
// money_x = เงินสดเทียบรายได้ปี · income_x = รายได้ต่อเดือนเทียบค่าแรงขั้นต่ำทั้งเดือน · debt_x = หนี้สุทธิเทียบรายได้ปี
// ไม่มีรายได้ (เรียน/ว่างงาน) เทียบค่าแรงขั้นต่ำทั้งปีแทน — ไม่งั้นเด็กมีเงินแสนกับเด็กไม่มีเงินได้ค่าเดียวกัน
const MONEY_KEYS = ['money_x', 'income_x', 'debt_x'];
function moneyRatios(st, year = st.birthYear + st.age) {
  const f = st.content.era.finance;
  const minMonth = minWage(st.content.era, st.seed, year) * f.daysPerMonth;
  const base = debtIncome(st, year) || minMonth * 12;
  const monthly = isWorking(st) ? monthlyIncome(st, year) : st.retireBase !== null ? (st.retireBase * st.price) / 12 : 0;
  return { money_x: Math.max(0, st.money) / base, income_x: monthly / minMonth, debt_x: Math.max(0, -netWorth(st)) / base };
}

// หนี้เกินกำลัง (B111 · เจ้าของเคาะ) — ธง in_debt คิดใหม่ทุกปีจากยอดจริง ไม่ค้างจากการ์ดเก่า (บั๊ก: "หนี้ล้นตัว" ออกตอนมีเงิน 3.8 ล้าน)
// ติด: ผ่อนต่อปี > pay ของรายได้ปี หรือหนี้สุทธิ > net เท่ารายได้ปี · ล้าง: ต่ำกว่า payOff และ netOff · ช่วงกลางคงค่าเดิม กันธงกระพริบ
// ยังไม่มีฐานรายได้ (เรียน/ไม่เคยทำงาน) = ล้างเมื่อไม่มีหนี้เหลือ ไม่งั้นคงตามเดิม
const DEBT_LOAD = { pay: 0.4, net: 2, payOff: 0.3, netOff: 1.5 };
// ธงที่ engine ตั้งเอง (debtLoad · informalFlag) — lint flag-unset นับเป็นธงที่มีคนตั้ง การ์ดไม่ต้องตั้งเองก็อ่านได้
const DEBT_FLAGS = ['in_debt', 'informal_debt'];
function debtLoad(st, year, paid) {
  // หนี้สุทธิแบบเดียวกับ debt_x และด่านล้มละลาย: เงินติดลบ (ทบดอกเงินกู้ทุกปี) นับเป็นหนี้ด้วย
  const owe = -netWorth(st);
  const base = debtIncome(st, year);
  const was = !!st.flags.in_debt;
  let on = was;
  if (base === null || base <= 0) on = was && owe > 0;
  else if (paid > DEBT_LOAD.pay * base || owe > DEBT_LOAD.net * base) on = true;
  else if (paid < DEBT_LOAD.payOff * base && owe < DEBT_LOAD.netOff * base) on = false;
  if (on && !was) {
    st.flags.in_debt = true;
    st.flagAge.in_debt ??= st.age;
  } else if (!on && was) delete st.flags.in_debt;
}

// ล้มละลาย (B08b): หนี้สุทธิเกิน k เท่าของรายได้ทั้งปีติดกัน n ปี → ล้างหนี้ ทรัพย์เหลือ 0 · ไม่แตะสุขภาพ
function checkBankrupt(st, year, stage) {
  const { k, n } = st.content.era.finance.debt.bankrupt;
  const base = debtIncome(st, year);
  st.debtYears = base !== null && -netWorth(st) > k * base ? st.debtYears + 1 : 0;
  if (st.debtYears < n) return;
  st.debtYears = 0;
  st.bankruptcies++;
  st.debts = [];
  st.money = 0;
  st.alloc = { deposit: 1 };
  st.flags.bankrupt = true;
  st.happiness = clamp(st.happiness - LEVELS[2]);
  st.relations = clamp(st.relations - LEVELS[1]);
  st.due.push({ kind: 'result', type: 'A', age: st.age, stage, text: 'ศาลสั่งล้มละลาย ทรัพย์ที่มีถูกนำไปชำระเจ้าหนี้ หนี้ที่เหลือถูกล้าง เริ่มนับหนึ่งใหม่', tag: 'bankrupt' });
}

// กู้ก้อนใหม่: เงินกู้เข้ากระเป๋าทั้งก้อน แล้วผ่อนคืนทุกปีใน stepYear · ด่าน build กั้นปีไว้แล้ว ถึงตรงนี้ปีผิด = เนื้อหาหลุดด่าน
// ยอดกู้ income_x ใช้ฐานเดียวกับค่าใช้จ่าย (spendBase) — การ์ดกู้คู่กับเงินจ่ายออกเท่ากัน ฐานต่างกันทำให้คนรายได้สูงได้หนี้หลายเท่าของที่จ่าย
function borrow(st, { kind, amount }, s = 1) {
  const year = st.birthYear + st.age;
  const era = st.content.era;
  if (!debtOpen(era, kind, year)) throw new Error(`${debtName(kind)} ยังไม่มีในปี ${year}`);
  const baht = moneyValue(st, amount, true) * s;
  st.money += baht;
  st.debts.push(newDebt(era, st.seed, kind, baht, year));
  informalFlag(st);
}

// ปิดหนี้ทุกก้อนของชนิดนั้นด้วยเงินที่มี · เงินไม่พอ = เงินติดลบ ทบดอกเงินกู้ปกติแทน (ย้ายหนี้ออกจากดอกโหด)
function settle(st, kind) {
  for (const d of st.debts) if (d.kind === kind) st.money -= d.balance;
  st.debts = st.debts.filter((d) => d.kind !== kind);
  informalFlag(st);
}

// ธง informal_debt ติดตลอดที่หนี้นอกระบบค้าง (B111 เจ้าของเคาะ) — การ์ดทวงหนี้ของเนื้อหาอ่านธงนี้ engine ไม่ลงโทษเอง
function informalFlag(st) {
  const on = st.debts.some((d) => d.kind === 'informal');
  if (on && !st.flags.informal_debt) {
    st.flags.informal_debt = true;
    st.flagAge.informal_debt ??= st.age;
  } else if (!on) delete st.flags.informal_debt;
}

// กู้มาจ่าย (B111 เจ้าของเคาะ): ตัวเลือกที่ล็อกเพราะเงินอย่างเดียวกู้ส่วนที่ขาดได้ · ปุ่มละแหล่งที่เข้าเกณฑ์ บอกดอก+ยอดจ่ายปีแรก
// ธนาคารต้องทำงานอยู่ · กองทุน/สหกรณ์ต้องมีรายได้ (ทำงานหรือบำนาญ) · นอกระบบให้ทุกคน · วงเงินนับหนี้ชนิดเดียวกันที่ค้างรวมก้อนใหม่
// อายุต่ำกว่าบรรลุนิติภาวะกู้เองไม่ได้ · ตายแล้ว (การ์ดงานศพ) ไม่กู้ — หนี้หักจากกองมรดกอยู่แล้ว
const LOAN_AGE = 20;
const LOAN_KINDS = ['bank_loan', 'coop', 'informal'];
function loanOptions(st, gap) {
  if (st.dead || st.age < LOAN_AGE || !(gap > 0)) return [];
  const year = st.birthYear + st.age;
  const era = st.content.era;
  const kinds = era.finance.debt.kinds;
  const income = debtIncome(st, year);
  const owed = (kind) => st.debts.reduce((s, d) => s + (d.kind === kind ? d.balance : 0), 0);
  const fits = (kind) => income > 0 && owed(kind) + gap <= kinds[kind].limit * income;
  const ok = { bank_loan: isWorking(st) && fits('bank_loan'), coop: debtOpen(era, 'coop', year) && fits('coop'), informal: true };
  return LOAN_KINDS.filter((k) => ok[k]).map((kind) => {
    const d = newDebt(era, st.seed, kind, gap, year);
    return { kind, name: debtName(kind), rate: d.rate, years: d.simple ? null : d.years, yearly: firstPay(d) };
  });
}

// ยอดที่ขาดของตัวเลือก — ปัดขึ้นเป็นบาทเต็ม กู้แล้วต้องกดได้แน่ ไม่ติดเศษทศนิยม
function choiceGap(st, c) {
  const q = c.requires;
  if (!q?.money || lockReason(st, c) === null) return null;
  if (st.pending?.id === FUNERAL.rite && st.funeralPick && c.id !== st.funeralPick) return null;
  if (q.age && (st.age < (q.age.min ?? 0) || st.age > (q.age.max ?? Infinity))) return null;
  const gap = moneyValue(st, q.money, true) - (st.dead ? deadPurse(st) : st.money);
  return gap > 0 ? gap : null;
}

function borrowFor(st, c, kind) {
  const gap = choiceGap(st, c);
  const need = gap === null ? 0 : Math.ceil(gap);
  if (!need || lockReason(st, c, need) !== null) throw new Error('ตัวเลือกนี้กู้มาจ่ายไม่ได้');
  if (!loanOptions(st, need).some((o) => o.kind === kind)) throw new Error(`กู้จาก${debtName(kind)}ไม่ได้`);
  const year = st.birthYear + st.age;
  st.money += need;
  st.debts.push(newDebt(st.content.era, st.seed, kind, need, year));
  informalFlag(st);
}

// การ์ดจัดสรรเงิน (ใบ 11) เล่าผลจริงของช่วงที่ผ่านมาก่อนให้เลือก — ไม่บอกปีถัดไป · ตัวเลือกสร้างตอนออกการ์ด
function allocCard(st, year, stage) {
  const era = st.content.era;
  const from = st.lastAllocYear === null ? year - ALLOC.every + 1 : st.lastAllocYear + 1;
  const items = periodReturns(era, st.seed, from, year).map((x) => `${x.name} ${formatReturn(x.r)}`);
  items.push(`ของแพงขึ้น ${formatReturn(priceRatio(era, st.seed, from - 1, year) - 1)}`);
  return {
    kind: 'alloc',
    age: st.age,
    stage,
    text: `อายุ ${st.age} ปี ทบทวนเงินเก็บ ${Math.round(st.money).toLocaleString('en-US')} บาท · ผลช่วงอายุ ${st.age - (year - from)}–${st.age}`,
    items,
    disclaimer: DISCLAIMER,
    choices: [],
  };
}

function emit(st, card) {
  st.cards++;
  return card;
}

// ใบคนที่บ้านตามหา (B137) ออกครั้งเดียวแทนงานศพของทางหายตัว · ไม่มีญาติให้เรียกชื่อ ⇒ ล้าง kinFocus ที่ค้างจากใบก่อน
function goneSearchCard(st) {
  st.searched = true;
  st.kinFocus = {};
  st.pending = { search: true, choices: GONE_SEARCH.choices };
  return emit(st, {
    kind: 'event', id: GONE_SEARCH.id, search: true, type: 'B', national: false, funeral: false,
    age: st.age, stage: stageOf(st.age), title: null, text: GONE_SEARCH.text,
    choices: GONE_SEARCH.choices.map((c) => c.text), fx: GONE_SEARCH.choices.map(() => ''), locked: GONE_SEARCH.choices.map(() => null),
  });
}

// การ์ดเลือกของเหตุการณ์ — ตั้ง pending ไว้ให้ choose อ่าน
// ปิด merge = ข่าวกับการ์ดรับมือแยกใบแบบเดิม (ตัวควบคุมของ harness)
const ERA_NEWS = { merge: true };

// news = ข่าวบ้านเมืองที่รวมมาเป็นบรรทัดนำ (B58) — การ์ดยังเป็นของเหตุการณ์ ตัวเลือก/เซฟเดินเหมือนเดิม
function eventCard(st, ev, news = null, echoFrom = undefined) {
  pickFocus(st);
  // การ์ดเล่าเรื่อง (choices: [] ใบ 07) ไม่มีอะไรให้เลือก — ไม่ตั้ง pending ไม่งั้นใบถัดไปเปิดไม่ได้
  st.pending = ev.choices.length ? ev : null;
  // ตัดสินแบบงานศพตอนการ์ดออก (หลังคำสั่งเสียครบ) ครั้งเดียว — lockReason อ่านค่านี้ทั้งตอนวาดและตอนกด
  if (ev.id === FUNERAL.rite) st.funeralPick ??= pickRite(st, ev);
  if (ev.arc) arcFired(st, ev);
  return emit(st, {
    kind: 'event',
    id: ev.id,
    // แนวการ์ดตามประเภทเหตุการณ์ (ใบ 06): A ชีวิตจริง · B ความเชื่อ/แฟนตาซี
    type: ev.type ?? 'A',
    // การ์ดเนื้อหาที่ผูกเหตุการณ์บ้านเมือง — หน้าจอติดป้ายบ้านเมืองแทนช่วงวัย
    national: !!ev.era,
    ...(news && { news }),
    // ผลย้อน: อายุตอนเลือกตัวเลือกที่นัดการ์ดนี้ไว้
    ...(echoFrom !== undefined && { echoFrom }),
    // สายเรื่องรายคน: ตอนที่เท่าไร ห่างตอนก่อนกี่ปี — ป้ายบนการ์ด · harness นับระยะจากช่องนี้
    ...(ev.arc && { arc: { key: ev.arc, n: st.arcs[ev.arc].n, ...(st.arcs[ev.arc].gap && { gap: st.arcs[ev.arc].gap }) } }),
    ...parentFrom(st, ev),
    funeral: ev.id === FUNERAL.wishes || ev.id === FUNERAL.rite,
    age: st.age,
    stage: stageOf(st.age),
    title: ev.title ? fill(ev.title, st) : null,
    text: fill(ev.text, st) + pastSelfLine(st, ev),
    choices: ev.choices.map((c) => fill(c.text, st)),
    ...choiceHints(ev, st),
    fx: ev.choices.map((c) => choiceFx(st, ev, c)),
    // เหตุผลที่ตัวเลือกกดไม่ได้ (null = กดได้) — หน้าจอแสดงเทาพร้อมเหตุผล
    locked: ev.choices.map((c) => lockReason(st, c)),
    // ตัวเลือกที่พาเข้าสาย (ป้าย gate) ซ่อนจนประตูเปิด — ล็อกไว้ด้วย (กดไม่ได้ · บอทข้าม) แต่ไม่ตัดออก
    // เพราะ harness/เซฟ/ผลย้อนจับตัวเลือกด้วยเลขลำดับในเนื้อหา · ใบที่ไม่มีป้ายไม่มีช่องนี้
    ...(ev.choices.some((c) => c.gate) && { hidden: ev.choices.map((c) => gateShut(st, c)) }),
    ...moneyShort(ev, st),
  });
}

// ทายาทชั้นลูก (B167): การ์ดดูแลพ่อแม่ที่พ่อ/แม่เป็นผู้เล่นรุ่นก่อนบอกว่าเป็นเราเอง — การ์ดที่ระบุเพศพ่อแม่คนละเพศกับรุ่นก่อนไม่บอก (พูดถึงอีกคน)
function pastSelfLine(st, ev) {
  const p = st.parents.find((x) => x.ancestor && x.alive);
  if (!p || !ev.choices.some((c) => c.filial)) return '';
  if ((ev.when?.family ?? []).some((f) => f.role === 'parent' && f.sex && f.sex !== p.sex)) return '';
  return ` · ${p.sex === 'หญิง' ? 'แม่' : 'พ่อ'}คนนี้คือคุณเองในชาติก่อน`;
}

// ตัวเลือกที่ล็อกเพราะเงินบอกยอดที่ขาด (B107) — ใส่ช่องเฉพาะการ์ดที่มีตัวนั้น การ์ดอื่นรูปเดิมทุกช่อง
// ล็อกด้วยเหตุที่ชนะเงินก่อน (อายุ · แบบงานศพที่ตกลงไว้) ไม่บอกยอด — เติมเงินก็ยังกดไม่ได้
// loans = แหล่งกู้ต่อตัวเลือก (B111) เฉพาะตัวที่ขาดแค่เงิน — ขาดอย่างอื่นด้วย กู้แล้วก็ยังกดไม่ได้ จึงไม่เสนอ
function moneyShort(ev, st) {
  const moneyGap = ev.choices.map((c) => choiceGap(st, c));
  if (!moneyGap.some((v) => v !== null)) return {};
  const loans = moneyGap.map((gap, i) => {
    if (gap === null || lockReason(st, ev.choices[i], Math.ceil(gap)) !== null) return null;
    const opts = loanOptions(st, Math.ceil(gap));
    return opts.length ? opts : null;
  });
  return { moneyGap, ...(loans.some((l) => l) && { loans }) };
}

// บรรทัดรองบอกข้อแลกใต้ตัวเลือก (B52) — ใส่ช่องเฉพาะการ์ดที่มี hint การ์ดเดิมจึงมีรูปเท่าเดิมทุกช่อง
function choiceHints(ev, st) {
  const auto = ev.choices.map((c) => jobHint(st, c));
  if (!ev.choices.some((c, i) => c.hint || auto[i])) return {};
  return { hints: ev.choices.map((c, i) => (c.hint ? fill(c.hint, st) : auto[i])) };
}

// ตัวเลือกที่พาไปงานใหม่บอกช่วงรายได้ (B40) — ค่าจ้างอาชีพ×ภาคของปีนี้ บอกเป็นช่วงไม่ใช่เลขเป๊ะ ผู้เล่นจึงชั่งได้แต่เดาผลไม่ได้
// มีงานอยู่แล้วต่อท้ายช่วงของงานเดิมให้เทียบ · เปลี่ยนงานแล้วตัวคูณรายได้เริ่มนับใหม่ ช่วงงานใหม่จึงไม่คูณ
const PAY_BAND = [0.8, 1.25];
const twoDigits = (v) => {
  const p = 10 ** Math.max(0, Math.floor(Math.log10(Math.max(1, v))) - 1);
  return (Math.round(v / p) * p).toLocaleString('en-US');
};
function jobHint(st, c) {
  const fx = c.effects?.job || c.effects?.ladder ? c.effects : c.outcomes?.find((o) => o.ok && (o.effects?.job || o.effects?.ladder))?.effects;
  const id = fx?.job;
  if (!fx || st.dead || (id && id === st.occupation && st.workFrom !== null)) return null;
  const year = st.birthYear + st.age;
  const band = (w) => `${twoDigits(w * PAY_BAND[0])}–${twoDigits(w * PAY_BAND[1])}`;
  const next = id ? monthlyWage(st.content.era, st.seed, id, st.ses, year) : ladderStartPay(st, fx.ladder, year);
  const now = isWorking(st) ? ` · งานเดิมราว ${band(monthlyIncome(st, year))}` : '';
  return `รายได้ราว ${band(next)} บาท/เดือน${now}`;
}

// เหตุผลตั้งต้นของตัวเลือกที่ล็อกด้วยครอบครัว — เงื่อนไขพ่อ/แม่ล้วนบอกตัวคนที่ไม่อยู่ ที่เหลือเนื้อหาใส่ reason เอง
function familyWhy(fs) {
  if (!fs.every((f) => f.role === 'parent')) return 'ครอบครัวยังไม่เข้าเงื่อนไข';
  const sexes = new Set(fs.map((f) => f.sex));
  return sexes.size > 1 || sexes.has(undefined) ? 'พ่อแม่ไม่อยู่แล้ว' : sexes.has('หญิง') ? 'แม่ไม่อยู่แล้ว' : 'พ่อไม่อยู่แล้ว';
}

// เงินเทา (ใบ 36 · เจ้าของเคาะ 2026-10-31): ถุง st.grey แยกจาก money — ฐานะ/มรดก/ชื่อเสียงอ่าน money จึงไม่นับ · ใช้ได้เมื่อฟอกเข้า money
// ยึดครึ่งถุงตอนถูกจับครั้งแรก · ฟอกเสียค่าฟอก 30% ปีละครั้ง · ตายแล้วหายไปกับตัว (ไม่เข้า estate)
// ช่องเกิดเมื่อได้เงินเทาครั้งแรก — ชีวิตที่ไม่เคยแตะมี state เท่าเดิมทุกไบต์ (lifehash) และเซฟเก่าโหลดได้โดยไม่ต้องแปลง
const GREY = { seize: 0.5, fee: 0.3 };
function greyAdd(st, baht) {
  st.grey = (st.grey ?? 0) + Math.max(0, baht);
}
function greySeize(st, share) {
  if (st.grey) st.grey *= 1 - share;
}
function greyLaunder(st, share) {
  const moved = (st.grey ?? 0) * share;
  st.grey = (st.grey ?? 0) - moved;
  st.money += moved * (1 - GREY.fee);
  st.greyLaunderAge = st.age;
}
const greyLaunderLock = (st) => ((st.grey ?? 0) <= 0 ? 'ไม่มีเงินที่ต้องฟอก' : st.greyLaunderAge === st.age ? 'ฟอกไปแล้วปีนี้' : null);

// ตัวเลือกที่ต้องมีเงิน/ค่าสถานะ/ธงถึงจะเลือกได้ (B14 A6) · ข้อความเหตุผลจากเนื้อหาทับข้อความตั้งต้น
// extra = เงินที่จะกู้มาเติม — ถามว่ากู้แล้วกดได้ไหม โดยไม่แตะ state
function lockReason(st, c, extra = 0) {
  if (st.pending?.id === FUNERAL.rite && st.funeralPick && c.id !== st.funeralPick) return 'ไม่ใช่แบบที่ตกลงกัน';
  if (gateShut(st, c)) return GATE_LOCK;
  if (c.effects?.grey_launder) {
    const g = greyLaunderLock(st);
    if (g) return g;
  }
  if (c.letter && !letterTo(st)) return LETTER.nobody;
  const q = c.requires;
  if (!q) return null;
  // อายุตามกฎหมายบอกเหตุผลของตัวเอง — reason ของเนื้อหาเขียนไว้ให้เงื่อนไขอื่น (เช่น "สั่งไว้แล้ว")
  if (q.age && st.age < (q.age.min ?? 0)) return `อายุยังไม่ถึง ${q.age.min} ปี`;
  if (q.age && st.age > (q.age.max ?? Infinity)) return `อายุเกิน ${q.age.max} ปี`;
  // ตัวเลือกวัยโตของนิสัย (B41) — บอกนิสัยที่ขาดเป็นคำ ผู้เล่นจึงรู้ว่าวัยเด็กแบบไหนเปิดทางนี้
  if (q.nature && st.nature !== q.nature) return `ต้องเป็นคน${st.content.focus?.natures?.[q.nature]?.name ?? ''}`;
  const why = [];
  // ตายแล้ว (การ์ดงานศพ) หนี้ต้องหักก่อน — จ่ายได้ไม่เกินทรัพย์สุทธิ ค่างานศพจึงไม่ทำให้ตายพร้อมหนี้
  const purse = (st.dead ? deadPurse(st) : st.money) + extra;
  if (q.money && purse < moneyValue(st, q.money, true)) why.push('เงินไม่พอ');
  for (const [k, b] of Object.entries(q.stats ?? {})) {
    if (b.min !== undefined && st[k] < b.min) why.push(k === 'network' ? 'ยังไม่มีเส้นสายพอ' : `${STAT_LABELS[k]}ไม่ถึง`);
    if (b.max !== undefined && st[k] > b.max) why.push(`${STAT_LABELS[k]}มากเกินไป`);
  }
  if (q.flags && !flagsOk(st, q.flags)) why.push('ยังไม่เข้าเงื่อนไข');
  if (q.edu && eduRank(st.edu) < eduRank(q.edu)) why.push('วุฒิไม่ถึง');
  if (q.family && !q.family.every((f) => familyOk(st, f))) why.push(familyWhy(q.family));
  if (!why.length) return null;
  return q.reason ?? why.join(' · ');
}

// ดัชนีตัวเลือกที่กดได้ — บอทเลือกจากชุดนี้เท่านั้น · ไม่มีตัวล็อก = ทุกตัว (ลำดับสุ่มของบอทจึงเหมือนก่อนมีการล็อก)
// manual = ปุ่มที่คนกดได้แต่บอทไม่กด (B76 เล่นต่อเป็นผู้สืบสายเลือด) — หน้าจอไม่อ่านชุดนี้ ปุ่มยังกดได้ · ไม่มีฟิลด์ = ชุดเท่าเดิม
const openChoices = (card) => card.choices.map((_, i) => i).filter((i) => !card.locked?.[i] && !card.manual?.[i]);

// เดินปีละครั้งจนมีการ์ดถึงกำหนดหรือตาย คืนการ์ดใบถัดไป
// ป้าย "เพราะคุณเป็นคน…" ติดการ์ดใบถัดไปหลังตัวเลือกที่ตัวคูณนิสัยมีผล — ไม่เพิ่มการ์ด ชีวิตจึงยาวเท่าเดิม (เจ้าของเคาะ)
function nextCard(st) {
  const card = drawCard(st);
  if (!st.because) return card;
  const text = st.because;
  delete st.because;
  return { ...card, because: text };
}
function drawCard(st) {
  // ทริปศาล (B153) ช่องแยกจาก st.trip — st.trip ผูกก้อนต่างโลกทั้งก้อน
  if (st.court && !(st.court.afterQueue && st.queue.length)) {
    const card = courtCard(st);
    if (card) return card;
    const c = st.court;
    st.court = null;
    if (c.mode !== 'summons') return nextCard(st);
    st.dead = true;
    st.cause = c.cause;
    return queueFuneral(st) ? nextCard(st) : deathCard(st);
  }
  if (st.trip) {
    if (st.trip.step !== 'over') return { ...nextIsekaiCard(st.trip), trip: true, life: st.age };
    return tripBack(st);
  }
  if (st.pending) throw new Error('ยังมีการ์ดที่รอเลือก');
  // คิวมาก่อนการตาย — การ์ดงานศพเข้าคิวตอนตายแล้วต้องออกก่อนมรณบัตร
  if (st.dead && !st.queue.length && isGone(st) && !st.searched) return goneSearchCard(st);
  if (st.dead && !st.queue.length) return deathCard(st);
  // การ์ดเปลี่ยนช่วง/เหตุการณ์ยุค/ผลสุ่มเป็นใบของตัวเอง เรียงตามที่ถึงกำหนดในปีนั้น
  if (st.queue.length) {
    const card = st.queue.shift();
    if (card.kind === 'eraEvent') {
      // ใบรับมือยุคถูกเลือกตอนขึ้นปี ก่อนด่านเรียนต่อของปีเดียวกันได้ตอบ — เลิกเรียนไปแล้วใบเรื่องโรงเรียนต้องไม่ออก
      if (card.ev.era && !whenOk(st, card.ev.when)) {
        delete st.done[card.ev.id];
        return nextCard(st);
      }
      return eventCard(st, card.ev);
    }
    // ข่าวบ้านเมืองที่มีการ์ดรับมือของเหตุการณ์เดียวกันต่อท้าย = ใบเดียว (B58) — ไม่งั้นผู้เล่นกด "ต่อไป" ใบเปล่าก่อนเรื่องจริง
    // ไม่แตะ rng/state ผลเกมจึงเท่าเดิม ต่างแค่จำนวนการ์ด
    const pair = st.queue[0];
    if (card.kind === 'era' && ERA_NEWS.merge && pair?.kind === 'eraEvent' && pair.ev.era === card.id) {
      st.queue.shift();
      if (whenOk(st, pair.ev.when)) return eventCard(st, pair.ev, { text: card.text, story: card.story });
      // ใบรับมือตกด่าน when ซ้ำ (B59) — ข่าวออกเดี่ยว
      delete st.done[pair.ev.id];
    }
    if (card.kind === 'alloc') {
      const options = allocOptions(st.content.era, st.birthYear + st.age);
      card.choices = options.map((o) => o.label);
      st.pending = { alloc: options };
    }
    if (card.kind === 'warn') st.pending = { warn: true, choices: card.choices };
    if (card.kind === 'memory') st.pending = { memory: true, choices: card.choices };
    // ปุ่มสร้างตอนการ์ดออก ไม่ใช่ตอนเข้าคิว — ขั้นที่เห็นต้องเป็นขั้นปัจจุบัน
    if (card.kind === 'upgrade') {
      Object.assign(card, { title: SKILL_UP.title, text: SKILL_UP.text, ...upgradeOffer(st.skills) });
      st.pending = { upgrade: true, choices: card.choices };
    }
    return emit(st, card);
  }
  for (;;) {
    if (st.advance) {
      // สุ่มตายของปีที่อายุ st.age ก่อนขึ้นปีใหม่ — ทารกจึงตายได้ตั้งแต่ขวบปีแรกตามอัตราตายทารกจริง และอายุบนการ์ดตายเป็นปีเต็ม
      // สุขภาพหมดตัว = ตายด้วยสาเหตุตามสัดส่วนของอายุนั้น ไม่มีช่วงป่วย
      const cause = st.focusDoom ?? (st.health <= 0 ? healthCause(st) : deathRoll(st));
      const d = cause && faceDeath(st, cause);
      if (d?.fate === 'survive') {
        st.queue.push(d.card);
        stepYear(st);
        st.advance = false;
        return nextCard(st);
      }
      if (d?.fate === 'court') return nextCard(st);
      if (d?.fate === 'dead') {
        // ตายสงบตอนขึ้นปี (B168) ย้อนชีวิตก่อนคำสั่งเสีย — ทางศาล/กลางปี/ต่างโลกไม่ผ่านจุดนี้
        const mem = memoryEligible(st, isGone) && memoryCard(st, stageOf);
        if (!queueFuneral(st)) return deathCard(st);
        if (mem) st.queue.unshift(mem);
        return nextCard(st);
      }
      stepYear(st);
      if (crossedLow(st, st.health, WARN.human)) st.due.push(warnCard(st.age, stageOf(st.age), WARN.text));
    }
    st.advance = true;
    // เฉียดตายปีนี้: ออกทริปก่อน · advance ปิดไว้ให้รอบถัดไปไม่ทอยตายซ้ำ แล้วเดินต่อจุดนี้เหมือนไม่มีทริป
    if (st.court) {
      st.advance = false;
      return nextCard(st);
    }
    // การ์ดชวนไปต่างโลก (B68d) ออกต้นปี ใบถัดไปต้องไม่เดินเวลา
    const offer = entryCard(st, stageOf(st.age));
    if (offer) {
      st.advance = false;
      return offer;
    }
    if (st.due.length) {
      // เหตุการณ์ของอายุนี้ยังรอ: การ์ดใบถัดไปต้องไม่เดินเวลา · เงิน/ผลตอบแทน/หนี้ไปสรุปรวมที่การ์ดเปลี่ยนช่วงวัย
      st.advance = false;
      st.queue = st.due;
      st.due = [];
      return nextCard(st);
    }
    // years ของเหตุการณ์กั้นปีปฏิทินจริง — ด่าน build ตรวจปีสินทรัพย์/ระบบจาก years จึงต้องบังคับที่นี่ด้วย
    const year = st.birthYear + st.age;
    arcDefer(st);
    let ev = dueAt(st).find((e) => !st.done[e.id] && inYears(e, year) && whenOk(st, e.when) && beliefOk(st, e));
    // ผลย้อนที่นัดไว้ปีนี้กินโควตาแบบเรื่องต่อ — หลักไมล์ที่ออกจาก dueAt เหมือนกันไม่หัก
    if (ev && st.scheduled.some((x) => x.event === ev.id && x.age === st.age)) takeYearQuota(st);
    // กองสุ่มจับได้ปีละ poolRounds รอบ หลังหลักไมล์/นัดของปีนั้นหมดแล้ว · การ์ดที่จับได้อาจนัดตอนต่อปีเดียวกัน — ค้นนัดก่อนรอบถัดไป
    poolTurn(st);
    while (!ev && st.poolLeft > 0) {
      st.poolLeft--;
      ev = drawPool(st, year);
      // ใบที่ทิ้งแทนเรื่องต่อไม่นับว่าออก — ยังจั่วได้อีกในปีหลัง
      if (ev && st.poolOwed) {
        st.poolOwed--;
        ev = null;
      }
    }
    if (ev) {
      st.done[ev.id] = true;
      st.fired[ev.id] = { n: (st.fired[ev.id]?.n ?? 0) + 1, age: st.age };
      beliefFired(st, ev);
    }
    // ผลย้อนพกอายุตอนเลือกไปให้หน้าจอบอกที่มา — อ่านก่อนกรองนัดที่ใช้แล้วทิ้ง · นัดจากเซฟเก่าไม่มี from = ไม่มีป้าย
    // นัดปีเดียวกัน (after_years [0, 0]) ไม่ส่ง — ป้ายจะบอกอายุเดียวกับการ์ดเอง
    const due = ev ? st.scheduled.find((x) => x.event === ev.id && x.age === st.age) : undefined;
    const from = due?.from;
    const echoFrom = from < st.age ? from : undefined;
    // คู่เหตุและผลให้หน้าจบ (gameslash-4) — ข้อความตัวเลือกกับชื่อการ์ดที่ผู้เล่นเห็นมาแล้ว · นัดจากเซฟเก่าไม่มี pick = ไม่เก็บ
    if (echoFrom !== undefined && due.pick) (st.echoes ??= []).push({ from, age: st.age, pick: due.pick, title: ev.title ? fill(ev.title, st) : null });
    if (st.scheduled.length) st.scheduled = st.scheduled.filter((x) => x.age >= st.age && !st.done[x.event]);
    if (ev) {
      // อายุนี้อาจมีเหตุการณ์อื่นรออยู่ (หลักไมล์ชนกับนัด) — ค้นอายุเดิมอีกรอบก่อนเดินปี
      st.advance = false;
      return eventCard(st, ev, null, echoFrom);
    }
  }
}

// รอบจั่วกองสุ่มของปีตั้งครั้งแรกที่อายุนั้นต้องใช้ — ไม่ดึงเลขสุ่ม จึงตั้งก่อนถึงคิวจั่วได้
function poolTurn(st) {
  if (st.poolAge === st.age) return;
  st.poolAge = st.age;
  st.poolLeft = poolRounds(stageOf(st.age));
}

// โควตาการ์ด: การ์ดเรื่องต่อ (next) ผลย้อน (schedules) และการ์ดงบ/เลือกตั้งของตำแหน่งการเมือง แทนที่การ์ดกองสุ่มหนึ่งใบ — ติดค้างไว้ แล้วทิ้งการ์ดกองสุ่มใบถัดไปที่จั่วได้
// หักเป็นใบ ไม่ใช่รอบจั่ว เพราะรอบหนึ่งออกการ์ดแค่ตามโอกาส POOL_CHANCE · ปีที่จั่วไม่ได้อีกแล้วค้างไปหักปีถัดไป
// เนื้อหาเพิ่มสายเรื่องต่อได้โดยชีวิตไม่ยาวขึ้น · ชีวิตที่ไม่เจอเรื่องต่อจั่วและดึงเลขสุ่มเท่าเดิมทุกรอบ
function takeYearQuota(st) {
  st.poolOwed = (st.poolOwed ?? 0) + 1;
}

// สายเรื่องรายคน (krung-1): การ์ดที่มี arc เดินใต้โควตาปีเดิม ไม่ใช่ตัวคุมแยก — ใบกองสุ่มเป็นใบกองอยู่แล้ว ใบนัด/เรื่องต่อหักโควตาตามเดิม ชีวิตจึงไม่ยาวขึ้น
// ตอนใหม่ของสายใดก็ตามห่างตอนล่าสุดของทุกสาย ≥ gap ปี (ปีละไม่เกินตอนเดียวมาด้วย) · คนเดิม (สายเดียวกัน) ห่าง ≥ same ปี
// คูลดาวน์รายคนข้อนี้คือ reigns-2 ของการ์ดคนมีชื่อ · ใบกองทั่วไปใช้ repeat.gap เดิม · เนื้อหาไม่มี arc = ไม่แตะเลขสุ่ม/สถานะเลย
const ARC = { gap: 2, same: 4 };
const arcLast = (st) => Math.max(-Infinity, ...Object.values(st.arcs ?? {}).map((a) => a.age));
const arcFrom = (st, key) => Math.max(arcLast(st) + ARC.gap, (st.arcs?.[key]?.age ?? -Infinity) + ARC.same);
// กองสุ่มไม่หยิบสายที่ปิดแล้ว · นัด/เรื่องต่อที่ผู้เขียนผูกไว้ยังออกได้หลังปิด (เล่าผลที่ตามมา)
const arcPoolOk = (st, e) => !e.arc || (!st.arcs?.[e.arc]?.end && st.age >= arcFrom(st, e.arc));
// เรื่องต่อของสายเดียวกันปีเดียวกัน = ตอนเดียวกัน ไม่ติดระยะเว้น
const arcNextOk = (st, ev, follow) => !follow.arc || (follow.arc === ev.arc && st.arcs?.[ev.arc]?.age === st.age) || st.age >= arcFrom(st, follow.arc);

// นัดของสายที่ตรงปีเว้นเลื่อนไปปีแรกที่ออกได้ ไม่ถูกกรองทิ้งเงียบ — อายุที่เลือก (from) ติดไปด้วย ป้ายผลย้อนจึงยังบอกที่มาถูก
function arcDefer(st) {
  if (!st.scheduled.length) return;
  const ix = lifeEventIndex(st.content.events);
  for (const x of st.scheduled) {
    const e = x.age === st.age && ix.pos.has(x.event) && st.content.events[ix.pos.get(x.event)];
    if (e?.arc && !st.done[e.id]) x.age = Math.max(x.age, arcFrom(st, e.arc));
  }
}

// จดตอนตอนการ์ดออก (eventCard จุดเดียว ทุกทางเข้า) · ช่องใส่เมื่อมีค่า
function arcFired(st, ev) {
  const a = st.arcs?.[ev.arc];
  if (a?.age === st.age) return;
  (st.arcs ??= {})[ev.arc] = { n: (a?.n ?? 0) + 1, age: st.age, ...(a && { gap: st.age - a.age }), ...(a?.end && { end: true }) };
}

// หน้าจบ: ทุกสายที่เปิดในชีวิตนี้ · ชื่อจากทะเบียน content.arcs
const arcSummary = (st) => Object.entries(st.arcs ?? {}).map(([key, a]) => ({ key, name: st.content.arcs?.[key]?.name ?? key, n: a.n, end: !!a.end }));

// กองสุ่ม (B14): เหตุการณ์ไม่มี at_age แต่มี weight · ใบเดิมไม่ซ้ำในชีวิต เว้นแต่ตั้ง repeat · ไม่มีใบที่เกิดได้ = ไม่ดึงเลขสุ่ม
// ชีวิตที่เนื้อหาไม่มีกองจึงได้ชะตาเดิมทุกหลัก
function drawPool(st, year) {
  const stage = stageOf(st.age);
  const pool = (lifeEventIndex(st.content.events).pool.get(stage) ?? []).filter((e) => (!st.done[e.id] || canRepeat(st, e)) && inYears(e, year) && whenOk(st, e.when) && beliefOk(st, e) && arcPoolOk(st, e));
  // รอบที่กองแห้งนับแยกช่วงวัย — harness/pace.mjs อ่านเป็นรายการกองที่ต้องเติม (ไม่ออกไปกับการ์ด)
  if (!pool.length) (st.poolDry ??= {})[stage] = (st.poolDry[stage] ?? 0) + 1;
  if (!pool.length || st.rng.next() >= POOL_CHANCE[stage]) return null;
  // การ์ดทาง B (สายมู/ลาง) มีเป้าจำนวนต่อชีวิต — จับหลายรอบแล้วหรี่น้ำหนักตามรอบ ไม่ให้ล้นเป้า
  const b = poolEffectScale(stage);
  return weighted(st.rng, pool, pool.map((e) => e.weight * poolMultiplier(st, e.multipliers) * (e.type === 'B' ? b : 1) * lifeFocusMul(st, e)));
}

// โฟกัสชีวิตโลกหลัก (B163): เนื้ออยู่ content.focus · กติกากลางอยู่ focus.mjs · เนื้อหาชุดทดสอบที่ไม่มี focus = ตามน้ำเสมอ
// need = สถานะที่ when ของการ์ดเขียนไม่ได้ (หรือ · ไม่มี · ช่วงไว้ทุกข์) — ทะเบียนอ้างชื่อ lint ตรวจชื่อกับรายการนี้
const alive = (role, age) => (st) => familyOk(st, { role, alive: true, ...(age && { age }) });
const hasSpouse = alive('spouse');
const hasChild = alive('child');
// ไว้ทุกข์ = คู่จากไปปีนี้หรือปีก่อน
const mourning = (st) => (st.kinLoss ?? []).some((l) => l.role === 'spouse' && st.birthYear + st.age - l.year <= FOCUS_MOURN);
const FOCUS_MOURN = 1;
const FOCUS_NEEDS = {
  working: (st) => isWorking(st),
  single: (st) => !hasSpouse(st) && !mourning(st),
  partnered_or_kids: (st) => hasSpouse(st) || hasChild(st),
  has_kids: hasChild,
  kids_or_grandkids: (st) => hasChild(st) || alive('grandchild')(st),
  old_parent: alive('parent', [60, 200]),
  savings_or_credit: (st) => st.money > 0 || isWorking(st),
};
const lifeFocusOk = (st) => (w, def) => whenOk(st, w) && (def?.need ?? []).every((k) => FOCUS_NEEDS[k](st));
const lifeFocusDefs = (st) => st.content.focus?.focuses ?? {};
// ตามน้ำอยู่หัวรายการเสมอ แล้วตามลำดับในเนื้อหา
const lifeFocusOffers = (st) => [FOCUS_FLOW, ...focusOffers(lifeFocusDefs(st), stageOf(st.age), lifeFocusOk(st), st)];
function setLifeFocus(st, id) {
  if (!lifeFocusOffers(st).includes(id)) throw new Error(`โฟกัสนี้เลือกตอนนี้ไม่ได้: ${id}`);
  // ผู้เล่นเปลี่ยนเองแล้ว ปีทุ่มเทหลังจากนี้นับแต้มนิสัยเต็ม · กดตัวเดิมที่รับจากพ่อแม่ไม่ใช่การเปลี่ยน
  if ((st.focus ?? FOCUS_FLOW) !== id) delete st.focusBorn;
  focusSet(st, id, st.age);
  delete st.focusHeir;
}
// ปิดปีก่อนขึ้นอายุ: ผลของปีที่อายุ st.age ตามโฟกัสตอนนี้ · ตามน้ำไม่ดึงเลขสุ่มใด
function lifeFocusYear(st) {
  const c = st.content.focus;
  // โฟกัสที่รับจากพ่อแม่แต่ยังเปิดไม่ได้ (เช่นยังไม่เข้าเรียน) รอจนเปิด แล้วนับปีนั้นเต็ม · ผู้เล่นตั้งเองก่อน = ทิ้ง
  if (!st.focus && st.focusHeir && focusOpen(c.focuses[st.focusHeir], stageOf(st.age), lifeFocusOk(st), st)) {
    focusSet(st, st.focusHeir, st.age - 1);
    delete st.focusHeir;
  }
  if (!st.focus) return;
  const full = st.focusAt < st.age;
  const id = focusYearEnd(st, c.focuses, stageOf(st.age), lifeFocusOk(st), st.age, c.chain_years);
  if (!id) return;
  const def = c.focuses[id];
  if (full) naturePoint(st, def.nature, st.focusBorn ? c.heir_nature : 1);
  // ผลเงินเป็นเท่าของรายได้ จึงคิดเฉพาะปีที่มีรายได้ของตัวเอง · ค่าใช้จ่ายหรี่ด้วย spend_scale และหักได้ไม่เกินส่วนหนึ่งของเงินเก็บ (ไม่กู้มาทุ่ม)
  // เจ้าของเคาะ "ผลเงินชนด่าน finance = finance ชนะ": หักเต็มกินเงินเก็บไว้ใช้ยามเกษียณ ชีวิตที่ทุ่มยาวล้มละลายเกินกรอบ
  const { money, ...rest } = def.fx;
  applyEffects(st, rest, c.year_scale);
  if (money && isWorking(st)) {
    const v = moneyValue(st, money) * c.year_scale;
    st.money += v < 0 ? Math.max(v * c.spend_scale, -FOCUS_SPEND_CAP * Math.max(0, st.money)) : v;
  }
  if (def.career && isWorking(st)) {
    if (st.ladder) st.ladder.prog = Math.max(0, st.ladder.prog + def.career.rank);
    st.incomeMult = Math.max(INCOME_MULT[0], Math.min(INCOME_MULT[1], st.incomeMult * (1 + def.career.raise)));
  }
  (def.risk ?? []).forEach((r, i) => lifeFocusRisk(st, id, r, i));
}

// เสี่ยงสุ่มของโฟกัส: ทอยจาก stream ของ (seed · อายุ · ข้อ) ไม่แตะ rng ของโลก ชีวิตจึงต่างจากตามน้ำแค่ผลที่เกิดจริง
// เสี่ยงตาย (cause): ครั้งแรกเป็นการ์ดเตือน (ผลเจ็บตาม fx) · โดนซ้ำหลังเตือน = ตายต้นปีถัดไปด้วยสาเหตุนั้น — ไม่มีใครตายจากโฟกัสโดยไม่ได้เห็นสัญญาณก่อน
const FOCUS_RISK_SALT = 0x6f0c5a17;
const FOCUS_SPEND_CAP = 0.1;
function lifeFocusRisk(st, id, r, i) {
  if (makeRng(mixSeed(st.seed ^ FOCUS_RISK_SALT, st.age * 8 + i)).next() >= r.chance) return;
  const key = `${id}:${i}`;
  if (r.cause && st.focusWarn?.[key] !== undefined) {
    st.focusDoom = r.cause;
    return;
  }
  if (r.cause) (st.focusWarn ??= {})[key] = st.age;
  applyEffects(st, r.fx ?? {});
  for (const f of r.flags ?? []) raiseFlag(st, f);
  st.due.push({ kind: 'result', type: 'A', age: st.age, stage: stageOf(st.age), text: r.cause ? r.warn : r.text, focusRisk: key, tag: r.cause ? 'sick' : fxTag(r.fx) });
}

// ทายาททางสายเลือด (โฟกัสใบ 03): เริ่มชาติด้วยตัวเด็กของหมวดโฟกัสหลักของพ่อแม่ (kid ในทะเบียน) · ไม่มีหมวด/ไม่มีตัวเด็ก = ตามน้ำ
function lifeFocusKid(st) {
  const defs = lifeFocusDefs(st);
  const main = focusMain(st, defs);
  return (main && defs[main].kid) || null;
}
function lifeFocusBorn(st, kid) {
  if (!kid || !lifeFocusDefs(st)[kid]) return;
  if (lifeFocusOffers(st).includes(kid)) focusSet(st, kid, -1);
  else st.focusHeir = kid;
  st.focusBorn = true;
}

// นิสัยจากวัยเด็ก (B41): แต้มสะสมถึงอายุ nature_age แล้วล็อกตัวเดียวถาวร · เนื้อหาที่ไม่มีทะเบียนนิสัย = ไม่มีระบบนี้ ชีวิตเดินเหมือนเดิมทุกหลัก
// ทายาทเริ่มชาติด้วยทุ่มเทตัวเด็กของพ่อแม่ — นับปีเต็มเท่าลูกที่เลือกเอง ทายาทแทบทุกคนจะได้นิสัยพ่อแม่ จึงนับแค่ heir_nature จนผู้เล่นเปลี่ยนเอง
// ตัวที่ได้แต้มล่าสุดย้ายไปท้าย naturePts เสมอ แต้มเสมอกันจึงเลือกตัวท้าย (ตัวที่ได้แต้มล่าสุด)
const NATURE_NONE = 'ยังไม่รู้ว่าตัวเองเป็นคนแบบไหน';
function naturePoint(st, id, n) {
  const c = st.content.focus;
  if (!id || !n || !c?.natures?.[id] || st.age > c.nature_age) return;
  const pts = (st.naturePts ??= {});
  const v = (pts[id] ?? 0) + n;
  delete pts[id];
  pts[id] = v;
}
// ปิดปีอายุ nature_age: การ์ดบอกนิสัยออกก่อนการ์ดเข้าช่วงวัยถัดไป · ไม่มีแต้ม (ตามน้ำ ไม่กดป้าย) = ไม่มีนิสัยเด่น
function natureLock(st) {
  const c = st.content.focus;
  if (!c?.natures || st.age !== c.nature_age) return;
  const pts = st.naturePts ?? {};
  let id = null;
  for (const [k, v] of Object.entries(pts)) if (v > 0 && (!id || v >= pts[id])) id = k;
  delete st.naturePts;
  delete st.focusBorn;
  if (id) st.nature = id;
  st.due.push({ kind: 'result', type: 'A', age: st.age, stage: stageOf(st.age), text: id ? `คุณโตมาเป็นคน${c.natures[id].name}` : NATURE_NONE, nature: id, tag: 'nature' });
}
// ตัวคูณนิสัยของการ์ดใบนี้: ค่าตรงนิสัย (เงินนับเฉพาะการ์ดหมวดใน cards) + การ์ดขึ้นเงินเดือนเมื่ออาชีพตรงสาย · ไม่มีนิสัย = null คูณ 1 ทุกค่า
function natureBoost(st, ev) {
  const n = st.nature && st.content.focus?.natures?.[st.nature];
  if (!n) return null;
  const stat = n.stat && (n.stat !== 'money' || !n.cards || n.cards.includes(ev.category)) ? n.stat : null;
  const job = !!n.jobs?.includes(st.occupation) && isWorking(st);
  if (!stat && !job) return null;
  return { stat, job, mul: st.content.focus.nature_mul, text: `เพราะคุณเป็นคน${n.name} ผลดีเมื่อกี้เลยมากขึ้นอีกนิด` };
}
// ประตูเข้าสาย (โฟกัสใบ 04 · เจ้าของเคาะ: ล็อกแค่ประตู): เปิดเมื่อโฟกัสนั้นสะสมครบ chain_years · ทายาทในตระกูลรับประตูที่รุ่นก่อนเปิดไว้
// · การ์ดชวน (ธง gate:<โฟกัส>) เปิดให้ได้โดยไม่ต้องโฟกัส เช่น นักธุรกิจถูกชวนลงการเมือง
const GATE_FLAG = 'gate:';
const lifeGateOpen = (st, id) => (st.focusYears?.[id] ?? 0) >= (st.content.focus?.chain_years ?? Infinity) || !!st.gates?.includes(id) || !!st.flags[GATE_FLAG + id];
const lifeGatesOpen = (st) => Object.entries(lifeFocusDefs(st)).filter(([id, d]) => d.group === 'gate' && lifeGateOpen(st, id)).map(([id]) => id);
// การ์ดชวนลงสมัครตอนยังไม่มีตำแหน่ง = ประตูสายการเมือง
const OFFICE_GATE = 'politics_base';
const gateShut = (st, c) => !!c.gate && ![c.gate].flat().some((id) => lifeGateOpen(st, id));
const GATE_LOCK = 'ยังไม่เคยทุ่มเทกับทางนี้';
function lifeFocusMul(st, e) {
  if (!st.focus) return 1;
  return focusCardMul(lifeFocusDefs(st)[st.focus], [e.category, ...(e.focus ?? [])], st.content.focus.card_mul);
}

// ไล่ทั้งกองเหตุการณ์ทุกปีกินเวลา harness ราวหนึ่งในห้า — จัดกลุ่มครั้งเดียวต่อชุดเนื้อหา (ผูกกับตัวอาเรย์ แทนทั้งอาเรย์ = กลุ่มใหม่)
// ในกลุ่มเรียงตามลำดับในเนื้อหา ใบที่ค้นเจอและลำดับสุ่มจึงเหมือนไล่ทั้งกองทุกหลัก
const lifeEventCache = new WeakMap();
function lifeEventIndex(events) {
  let ix = lifeEventCache.get(events);
  if (ix) return ix;
  ix = { byAge: new Map(), pos: new Map(), pool: new Map() };
  const add = (m, k, v) => (m.get(k) ?? m.set(k, []).get(k)).push(v);
  events.forEach((e, i) => {
    if (!ix.pos.has(e.id)) ix.pos.set(e.id, i);
    if (e.age !== undefined) add(ix.byAge, e.age, i);
    if (e.weight && e.age === undefined && !e.era) add(ix.pool, e.stage, e);
  });
  lifeEventCache.set(events, ix);
  return ix;
}

// เหตุการณ์ที่ถึงกำหนดอายุนี้: หลักไมล์ของอายุนี้ + ใบที่นัดไว้ปีนี้ เรียงตามลำดับในเนื้อหา
function dueAt(st) {
  const events = st.content.events;
  const ix = lifeEventIndex(events);
  const at = [...(ix.byAge.get(st.age) ?? [])];
  for (const x of st.scheduled) if (x.age === st.age && ix.pos.has(x.event)) at.push(ix.pos.get(x.event));
  return [...new Set(at)].sort((a, b) => a - b).map((i) => events[i]);
}

const canRepeat = (st, e) => e.repeat && st.fired[e.id].n < e.repeat.max && st.age - st.fired[e.id].age >= e.repeat.gap;

// ตัวคูณโอกาส (ใบ 07) ใช้ทั้งโอกาสเกิดของเหตุการณ์และน้ำหนักผลสุ่มแต่ละทาง: ค่าสถานะขั้นบันได · กรรมตามทิศบัญชีสุทธิ · ธงที่ถืออยู่
// ชื่อเสียงตระกูลยังไม่มีระบบ คูณ 1
function poolMultiplier(st, m) {
  if (!m) return 1;
  // เพศมีผลต่อโอกาสการ์ด (B109 · เจ้าของเคาะ) — เพศกำเนิด ชาย/หญิง · when.sex มีอยู่แล้ว
  let x = (m.class ? (m.class[classNow(st)] ?? 1) : 1) * (m.sex?.[st.sex] ?? 1);
  for (const [k, v] of Object.entries(m.stats ?? {})) x *= statMul(v, st[k]);
  if (m.karma) x *= m.karma ** Math.sign(netLedger(st.ledger));
  // ขอพร: เอียงตามบัญชีแบบต่อเนื่อง บุญน้อยเอียงน้อย บาปหนักกลับทิศ
  if (m.wish) x *= m.wish ** ledgerLevel(st.ledger);
  if (m.family_fame) x *= m.family_fame ** (st.fame ?? 0);
  if (m.overlap_stage !== undefined) x *= m.overlap_stage ** overlapStageOf(st);
  for (const [f, v] of Object.entries(m.flags ?? {})) if (st.flags[f]) x *= v;
  for (const [f, v] of Object.entries(m.parent_flags ?? {})) if (st.parentFlags?.[f]) x *= v;
  if (m.occupation && st.workFrom !== null) x *= m.occupation[st.occupation] ?? 1;
  if (m.rank) x *= m.rank ** rankLevel(st);
  // ตัวคูณเงิน {min, max, v}: อัตราส่วนอยู่ในช่วง = คูณ v · คำนวณเฉพาะการ์ดที่ใช้ เพราะกองสุ่มเรียกทุกใบทุกปี
  if (MONEY_KEYS.some((k) => m[k])) {
    const r = moneyRatios(st);
    for (const k of MONEY_KEYS) if (m[k] && inBound(r[k], m[k])) x *= m[k].v;
  }
  return x;
}

const inYears = (e, year) => !e.years || (year >= e.years[0] && year <= e.years[1]);
const inRange = (v, r) => !r || (v >= r[0] && v <= r[1]);
// การ์ดช่วงป่วยก่อนตาย (B110): ผ่านเมื่อตรวจเจอโรคเรื้อรังแล้ว · causes = กลุ่มโรค · left = ปีที่เหลือก่อนถึงนัด (0 = ปีสุดท้าย)
const illnessOk = (st, w) => !!st.terminal?.told && (!w.causes || w.causes.includes(st.terminal.cause)) && inRange(st.terminal.age - st.age, w.left);
// การ์ดตรวจสุขภาพจากประวัติครอบครัว (B110 ชิ้น 2): พ่อ/แม่จากไปด้วยโรคที่ถ่ายทอดได้แล้ว · causes = โรคไหนบ้าง (ไม่ใส่ = โรคใดก็ได้)
const heredityOk = (st, w) => (st.heredity ?? []).some((k) => !w.causes || w.causes.includes(k));
const inBound = (v, b) => !b || ((b.min === undefined || v >= b.min) && (b.max === undefined || v <= b.max));
const flagsOk = (st, f) => (f.has ?? []).every((k) => st.flags[k]) && !(f.not ?? []).some((k) => st.flags[k]);
// เซฟก่อนมีช่องนี้ไม่มี parentFlags — อ่านแบบ ?. ให้เท่ากับไม่มีธงพ่อแม่
const parentFlagsOk = (st, f) => (f.has ?? []).every((k) => st.parentFlags?.[k]) && !(f.not ?? []).some((k) => st.parentFlags?.[k]);
// ป้ายบนการ์ด: ธงพ่อแม่ที่ทำให้ใบนี้ออก (when.parent_flags.has เท่านั้น — ตัวคูณแค่เอียงโอกาส ไม่ได้เล่า)
const parentFrom = (st, ev) => {
  const x = (ev.when?.parent_flags?.has ?? []).filter((f) => st.parentFlags?.[f]).map((f) => ({ flag: f, tier: st.parentFlags[f] }));
  return x.length ? { parentFrom: x } : {};
};
// ครอบครัวมีแค่พ่อแม่ (ด่าน family-system กั้นบทบาทอื่นไว้) · เงื่อนไขผ่านเมื่อพ่อหรือแม่คนใดคนหนึ่งตรง
// เงื่อนไขเกิดแบบประกาศทุกฟิลด์ (ใบ 07)
function whenOk(st, when) {
  if (!when) return true;
  if (when.family && !when.family.every((f) => familyOk(st, f))) return false;
  if (when.loss && !lossOk(st, when.loss)) return false;
  if (when.illness && !illnessOk(st, when.illness)) return false;
  if (when.kin_illness && !kinIllOk(st, when.kin_illness)) return false;
  if (when.filial && !filialOk(st, when.filial)) return false;
  if (when.heredity && !heredityOk(st, when.heredity)) return false;
  if (!inRange(st.age, when.age) || !inRange(st.birthYear + st.age, when.year)) return false;
  if (when.class && !when.class.includes(classNow(st))) return false;
  if (when.region && !when.region.includes(st.region)) return false;
  if (when.sex && !when.sex.includes(st.sex)) return false;
  if (when.overlap_stage && !inRange(overlapStageOf(st), when.overlap_stage)) return false;
  for (const [k, b] of Object.entries(when.stats ?? {})) if (!inBound(st[k], b)) return false;
  // อาชีพนับเมื่อมีงานของตัวเองแล้ว — อาชีพครอบครัวก่อนทำงานไม่ทำให้การ์ดที่ทำงานออก
  if (when.occupation && !(st.workFrom !== null && when.occupation.includes(st.occupation))) return false;
  if (when.school && !when.school.includes(schoolOf(st))) return false;
  if (when.ladder && !when.ladder.includes(st.ladder?.id ?? 'none')) return false;
  if (MONEY_KEYS.some((k) => when[k])) {
    const r = moneyRatios(st);
    if (MONEY_KEYS.some((k) => when[k] && !inBound(r[k], when[k]))) return false;
  }
  if (when.parent_flags && !parentFlagsOk(st, when.parent_flags)) return false;
  if (when.dark_gate && !darkGateOk(st)) return false;
  if (when.past_life && !pastLifeOk(st, when.past_life)) return false;
  return !when.flags || flagsOk(st, when.flags);
}

// ประตูทางมืด (B99a): ข้อเสนอผิดกฎหมายถึงคนที่ทั้งเงินตึงและเคยเลือกทางบาปเองชาตินี้ถึงเกณฑ์ — คนจนที่มือสะอาดไม่ถูกชวน
// นับจากตัวเลือกที่กดจริงใน st.log ไม่อ่านบัญชีบุญบาปซ่อน · log เริ่มใหม่ทุกชาติ บาปชาติก่อนจึงไม่นับ
const DARK_GATE = { picks: 2 };
function sinPicks(st) {
  const ix = lifeEventIndex(st.content.events);
  let n = 0;
  for (const l of st.log) {
    const i = ix.pos.get(l.id);
    const c = i === undefined ? null : st.content.events[i].choices?.[l.choice];
    if (c?.merit?.some((t) => SIN_CATS.includes(meritId(t.cat)))) n++;
  }
  return n;
}
const darkGateOk = (st) => moneyTight(st) && sinPicks(st) >= DARK_GATE.picks;

// ธงจากเนื้อหา (ตัวเลือก · ผลลัพธ์ · การ์ดที่แกนสร้าง · เสี่ยงของโฟกัส) ติดผ่านจุดนี้จุดเดียว — ผลที่ต้องเกิดตอนธงติดจึงดักได้ที่เดียว
// ธงจากบัญชีบุญบาป (recordMerit) ไม่ผ่านที่นี่: ไม่จดอายุที่ได้มาตั้งแต่เดิม
function raiseFlag(st, f) {
  // ถูกจับครั้งแรกเท่านั้นที่ยึด — ต้องเช็กก่อนตั้งธง · ผลลัพธ์ใส่เงินก่อนติดธง เงินก้อนที่ได้พร้อมถูกจับจึงถูกยึดด้วย
  if (f === 'caught_fraud' && !st.flags[f]) greySeize(st, GREY.seize);
  st.flags[f] = true;
  st.flagAge[f] ??= st.age;
}

// ป้ายบุญบาปเข้าบัญชีซ่อน · ธง · นัดเหตุการณ์ต่อเนื่อง (ใบ 07) — นัดสุ่มปีจาก rng ของโลก เพราะเป็นผลของการเลือก
function applyChoice(st, ev, c, text) {
  // คำบนเดียวกันมีหลายการ์ดนัด (ครั้งที่ 1 · ครั้งที่ 2) — ใช้ธงคำบนที่การ์ดปิดเป็นตัวระบุ ไม่ใช่ id การ์ด
  const vow = (c.clears_flags ?? []).find((f) => f.startsWith('vow_open:')) ?? ev.id;
  noteDeed(st, text, () => {
    for (const f of recordMerit(st.ledger, c.merit, vow)) st.flags[f] = true;
  });
  for (const f of c.sets_flags ?? []) raiseFlag(st, f);
  for (const f of c.clears_flags ?? []) delete st.flags[f];
  applyFamily(st, c, ev.category === 'family' && c.effects?.relations > 0 ? c.effects.relations : 0);
  for (const s of c.schedules ?? []) {
    const age = st.age + st.rng.int(s.after_years[0], s.after_years[1]);
    // ผลย้อนมีโอกาส (gameslash-2): ไม่ใส่ chance หรือ chance 1 = ไม่สุ่มเพิ่ม เลขสุ่มของชีวิตเดิมไม่ขยับ
    // ไม่ผ่าน = ไม่นัด แต่จดใน echoes ช่องเดียวกับคู่เหตุและผล (missed) — หน้าจบ/สมุดเล่าได้ว่ารอดผลย้อนมา
    const chance = s.chance;
    if (chance < 1 && st.rng.next() >= chance) {
      const target = st.content.events.find((e) => e.id === s.event);
      (st.echoes ??= []).push({ from: st.age, age, pick: text, title: target?.title ? fill(target.title, st) : null, missed: true });
    } else st.scheduled.push({ event: s.event, age, from: st.age, pick: text });
  }
  // ปิดสายเรื่องรายคน: หน้าจบบอกว่าจบแล้ว · กองสุ่มเลิกหยิบตอนใหม่ของสายนี้
  if (c.arc_end && ev.arc) st.arcs[ev.arc].end = true;
}

// แรงที่เราดูแลพ่อแม่ (B167): บุญดูแลพ่อแม่บวก บาปทำร้ายผู้ใหญ่ลบ ตามระดับของป้าย — ป้ายหมวดอื่นบนตัวเลือกเดียวกันไม่นับ
const FILIAL_CATS = { care_parents: 1, abuse_elders: -1 };
const filialScore = (tags = []) => tags.reduce((s, t) => s + (FILIAL_CATS[meritId(t.cat)] ?? 0) * (MERIT_LEVELS[t.level] ?? 0), 0);

// รายการบุญบาปตามอายุ (B26) — วัดจากบัญชีที่ขยับจริง ไม่ใช่ป้ายบนตัวเลือก: คำบนที่ผิดซ้ำไม่ทบ จึงไม่ควรขึ้นซ้ำ
// ผลสุ่มของตัวเลือกเดียวกันรวมเข้ารายการเดิม ผู้เล่นทำเรื่องเดียว · อยู่ใน st ไม่ออกไปกับการ์ด หน้าจออ่านตอนวาดการ์ดปรโลก
function noteDeed(st, text, record, age = st.age) {
  const m0 = st.ledger.merit, s0 = st.ledger.sin;
  record();
  for (const [bad, w] of [[false, st.ledger.merit - m0], [true, st.ledger.sin - s0]]) {
    if (!(w > 0)) continue;
    const last = st.deeds.at(-1);
    if (last && last.age === age && last.text === text && last.bad === bad) last.weight += w;
    else st.deeds.push({ age, text, bad, weight: w });
  }
}

// loan = ชนิดหนี้จาก card.loans[idx] (กู้มาจ่าย) · ไม่ส่ง = เลือกแบบเดิม บอทและเซฟเก่าเดินเหมือนเดิมทุกก้าว
function choose(st, idx, loan) {
  if (st.court) return chooseCourt(st, idx);
  if (st.trip) return chooseIsekai(st.trip, idx);
  const ev = st.pending;
  if (ev?.alloc) {
    const opt = ev.alloc[idx];
    if (!opt) throw new Error('ตัวเลือกไม่ถูกต้อง');
    st.pending = null;
    if (opt.alloc) st.alloc = opt.alloc;
    st.lastAllocYear = st.birthYear + st.age;
    st.log.push({ id: 'alloc', age: st.age, choice: idx, text: opt.label });
    return;
  }
  if (ev?.search) {
    const c = ev.choices[idx];
    if (!c) throw new Error('ตัวเลือกไม่ถูกต้อง');
    st.pending = null;
    st.log.push({ id: GONE_SEARCH.id, age: st.age, choice: idx, text: c.text });
    st.queue.push({ kind: 'result', type: 'B', age: st.age, stage: stageOf(st.age), text: c.reply, tag: 'search' });
    return;
  }
  if (ev?.warn) {
    if (!ev.choices[idx]) throw new Error('ตัวเลือกไม่ถูกต้อง');
    st.pending = null;
    st.log.push({ id: 'warn', age: st.age, choice: idx, text: ev.choices[idx] });
    return;
  }
  // ภาพสุดท้าย (B168) ขึ้นแค่มรณบัตร — ไม่ลง log ชีวิตจบแล้ว ไม่มีอะไรอ่านต่อ
  if (ev?.memory) {
    if (!ev.choices[idx]) throw new Error('ตัวเลือกไม่ถูกต้อง');
    st.pending = null;
    st.lastImage = ev.choices[idx];
    return;
  }
  // ปุ่มสุดท้าย = ผ่าน · ไม่ดึงเลขสุ่ม
  if (ev?.upgrade) {
    const s = st.skills[idx];
    if (!s && idx !== st.skills.length) throw new Error('ตัวเลือกไม่ถูกต้อง');
    if (s && s.lv >= SKILL.top) throw new Error('ตัวเลือกนี้ล็อกอยู่');
    st.pending = null;
    if (s) st.skills = st.skills.map((x) => (x === s ? { ...x, lv: skillUp(x.lv, x.cap) } : x));
    st.log.push({ id: 'upgrade', age: st.age, choice: idx, text: ev.choices[idx] });
    return;
  }
  if (ev?.entry) {
    if (!ev.choices[idx]) throw new Error('ตัวเลือกไม่ถูกต้อง');
    st.pending = null;
    // ปฏิเสธ = ไม่แตะอะไรเลย · กดรับ = จบชีวิตตรงนี้ แล้วปรโลกส่งข้ามโลก (ธง isekai_call) · ตาย = งานศพตามปกติ · หายตัว = ใบคนที่บ้านตามหาแทน (B137)
    // ทางที่ได้กลับ (B68m) = ไปต่างโลกทั้งตัวกลางชีวิต ไม่ตั้งธง · บัญชีบุญบาปส่งตัวเดียวกันเข้าไป
    const n = st.trips?.length ?? 0;
    const trip = idx === ENTRY.accept && tripRoll(st.seed, ev.entry, n);
    if (trip) {
      if (overlapLeftIsekai(st)) overlapStep(st);
      st.log.push({ id: `isekai_${ev.entry}`, age: st.age, choice: idx, text: ev.choices[idx].text });
      st.trip = startIsekai({
        seed: (st.seed ^ TRIP.salt ^ Math.imul(n + 1, 0x9e3779b1)) >>> 0, past: st.name, ledger: st.ledger,
        lore: isekaiWorldLore([...(st.lineage ?? []), { trips: st.trips }]),
        legends: isekaiWorldLegends([...(st.lineage ?? []), { trips: st.trips }]),
        trip: { ...trip, age: st.age, wit: st.knowledge / TRIP.wit },
        // ค่าจริงของชีวิตนี้ตอนข้าม (B136) — ผลในต่างโลกสะท้อนกลับชุดนี้ แล้ว tripBack เขียนลง st
        real: realAt(st),
        hints: st.content.nearHints,
        carry: st.skills ?? [],
        overlapStage: overlapStageOf(st),
      });
      return;
    }
    if (idx === ENTRY.accept) {
      st.flags.isekai_call = true;
      st.isekaiVia = ev.entry;
      st.log.push({ id: `isekai_${ev.entry}`, age: st.age, choice: idx, text: ev.choices[idx].text });
      st.dead = true;
      if (!isGone(st)) queueFuneral(st);
    }
    return;
  }
  if (!ev || !ev.choices[idx]) throw new Error('ตัวเลือกไม่ถูกต้อง');
  if (loan !== undefined) borrowFor(st, ev.choices[idx], loan);
  if (lockReason(st, ev.choices[idx])) throw new Error('ตัวเลือกนี้ล็อกอยู่');
  st.pending = null;
  // เติมข้อความก่อนผลลง — {เงิน} ต้องเป็นยอดตอนที่ผู้เล่นเห็นตัวเลือก
  const text = fill(ev.choices[idx].text, st);
  const c = ev.choices[idx];
  if (ev.id === FUNERAL.rite) {
    st.funeral = { id: c.id, text, cost: c.effects?.money ? -moneyValue(st, c.effects.money) : 0 };
    // คนมาส่งทำบุญอุทิศให้ — ลงบัญชีก่อนถึงปรโลก
    noteDeed(st, 'คนที่มาส่งทำบุญอุทิศให้ในงานศพ', () => addMerit(st.ledger, 'dana', Math.min(FUNERAL.guestMerit.cap, guestBase(st) / FUNERAL.guestMerit.ref)));
  }
  const pool = ev.weight && ev.age === undefined && !ev.era;
  const s = pool ? poolEffectScale(stageOf(st.age)) : 1;
  const ss = pool ? poolStatScale(stageOf(st.age)) : 1;
  // ใบในรอบเดียวกัน (ev.run) ที่สุขภาพหมดอยู่ก่อนกด = โรคที่ถึงคิวกลางรอบ ไม่ใช่ผลของใบนี้ — จำไว้ก่อนผลของตัวเลือกลง
  const ill = ev.run !== undefined && st.health <= 0;
  const nat = natureBoost(st, ev);
  let because = applyEffects(st, c.effects, s, ss, 1, nat);
  const gotC = c.effects?.loot && gainLoot(st, c.effects.loot);
  applyChoice(st, ev, c, text);
  naturePoint(st, c.nature, 1);
  if (c.filial) filialNote(st, c.filial, filialScore(c.merit));
  if (c.pact) signPact(st, c.pact);
  st.log.push({ id: ev.id, age: st.age, choice: idx, text, ...(loan !== undefined && { loan }) });
  // ผลสุ่ม: จับทางด้วย rng ของโลก (เป็นผลของการเลือก) แล้วเล่าเป็นการ์ดผลลัพธ์ใบถัดไป
  // น้ำหนักแต่ละทางเอียงตาม multipliers ของทางนั้น — บัญชีอ่านหลังป้ายบุญบาปของตัวเลือกนี้ลงแล้ว (กรรมตามทันทันที)
  // การ์ดที่ตัวเลือกนี้ก่อ (ผล → เรื่องต่อ → หางาน) เข้าหัวคิวตามลำดับ ก่อนการ์ดอื่นของปีที่รออยู่
  // สายมูก่อการ์ดของตัวเองได้ (ผลหวยสายมู) — มาก่อนผลสุ่มของตัวเลือก
  const after = beliefChoice(st, ev, c);
  // ตัวเลือกตรงไม่มีการ์ดผล — ของที่ได้เล่าเป็นการ์ดผลใบเดียว (lint ห้าม loot บนตัวเลือกที่มี outcomes)
  if (gotC) after.unshift({ kind: 'result', type: ev.type ?? 'A', age: st.age, stage: stageOf(st.age), text: gotC, tag: 'loot', evId: ev.id });
  let doom, wound;
  let o = null;
  if (c.outcomes?.length) {
    o = weighted(st.rng, c.outcomes, outcomeWeights(st, ev, c));
    doom = o.effects?.die;
    // ตัวเลือกที่มีทางตาย (ห้องบอส): ชีวิตหมดจากบาดแผลทางอื่นของตัวเลือกเดียวกันก็ตายในดันเจียน ไม่ใช่ด้วยโรค
    wound = c.outcomes.find((x) => x.effects?.die)?.effects.die;
    // ตายในการ์ด ญาติประคองไม่ได้ — ป้าย "หนักแค่ครึ่งเดียว" จะขัดกับมรณบัตรใบถัดไป
    const helper = !o.ok && !doom && hurts(st, o.effects) ? (kinAid(st) ?? netAid(st, ev, o)) : null;
    because = applyEffects(st, o.effects, s, ss, helper ? KIN_AID.scale : 1, nat) || because;
    const gotO = o.effects?.loot && gainLoot(st, o.effects.loot);
    applyChoice(st, ev, o, text);
    if (c.filial) filialNote(st, c.filial, filialScore(o.merit), true);
    if (o.text) after.push({ kind: 'result', type: ev.type ?? 'A', age: st.age, stage: stageOf(st.age), text: fill(o.text, st) + (helper ? ` · ${helper.who ?? AID_WHO[helper.role]}${helper.name}มาช่วยประคอง เลยหนักแค่ครึ่งเดียว` : '') + (gotO ? ` · ${gotO}` : ''), tag: fxTag(o.effects, [...(ev.hidden ?? []), ...(c.hidden ?? [])]), evId: ev.id });
    // ผลชี้เรื่องต่อ: การ์ดเลือกของเหตุการณ์นั้นตามหลังการ์ดผลทันที อายุเดียวกัน · เงื่อนไขปี/when ไม่ผ่าน = จบที่การ์ดผล
    const follow = o.next && st.content.events.find((e) => e.id === o.next);
    if (follow && inYears(follow, st.birthYear + st.age) && whenOk(st, follow.when) && beliefOk(st, follow) && arcNextOk(st, ev, follow)) {
      st.done[follow.id] = true;
      st.fired[follow.id] = { n: (st.fired[follow.id]?.n ?? 0) + 1, age: st.age };
      beliefFired(st, follow);
      takeYearQuota(st);
      after.push({ kind: 'eraEvent', ev: follow, age: st.age });
    }
  }
  if (because) st.because = nat.text;
  // จดหมายคำฝาก: เลือกคำฝากใบย่อยก่อน แล้วคำสั่งเสียกลับมาตามปกติ
  const pick = c.letter && st.content.events.find((e) => e.id === LETTER.pick);
  if (pick) {
    st.done[pick.id] = true;
    st.fired[pick.id] = { n: 1, age: st.age };
    after.push({ kind: 'eraEvent', ev: pick, age: st.age });
  }
  // คำสั่งเสียเลือกได้หลายข้อ: สั่งเรื่องหนึ่งแล้วการ์ดกลับมาให้สั่งต่อ ข้อที่สั่งแล้วล็อกด้วยธงของมันเอง
  if (ev.id === FUNERAL.wishes && (c.sets_flags ?? []).some((f) => f.startsWith('wish_'))) after.push({ kind: 'eraEvent', ev, age: st.age });
  // เลิกเรียนแล้วหางานทันที
  if (st.needJob) {
    st.needJob = false;
    after.push({ kind: 'eraEvent', ev: jobCard(st), age: st.age });
  }
  // ชีวิตหมดจากผลการ์ด = ตายในการ์ดนั้น (B160) ไม่รอขอบปี · การ์ดผลยังเล่าก่อน · เรื่องต่อ หางาน และการ์ดที่รอในปีนั้นไม่ออกแล้ว
  // การ์ดงานศพเลือกหลังตายแล้ว ⇒ ไม่ตัดสินซ้ำ
  // ผลที่สั่งตาย (ดันเจียนของนักล่า) เดินทางเดียวกัน แต่สาเหตุมาจากการ์ด ไม่ใช่โรคตามสุขภาพ
  // โรคที่ถึงคิวกลางรอบรอให้รอบจบก่อน (ตัดกลางรอบ = ผู้เล่นไม่รู้ว่าออกจากเกตหรือไม่) แล้วตายด้วยโรคที่ใบสุดท้าย — บาดแผลของห้องบอสไม่ใช่เหตุ
  const runOn = ill && !doom && after.some((x) => x.kind === 'eraEvent' && x.ev.run === ev.run);
  if (!st.dead && !st.court && !runOn && (doom || st.health <= 0)) {
    const d = faceDeath(st, doom ?? (ill ? undefined : wound) ?? healthCause(st), { afterQueue: true });
    st.queue = after.filter((x) => x.kind === 'result');
    st.due = [];
    if (d.fate === 'dead') queueFuneral(st);
    if (d.fate === 'survive') {
      // รอดแบบเดียวกับขอบปี: ปีนั้นจบที่ความตายเฉียดผ่าน แล้วขึ้นปีโดยไม่ทอยตายอายุเดิมซ้ำ
      st.queue.push(d.card);
      stepYear(st);
      st.advance = false;
    }
    return;
  }
  // ผลที่ให้อัปเกรด (06s) → การ์ดอัปเกรดต่อจากการ์ดผล ก่อนเรื่องต่อ · ไม่ได้พกสกิลมา = ไม่มีการ์ด
  if (st.skills?.length && (c.upgrade || o?.upgrade)) {
    const at = after.findIndex((x) => x.kind !== 'result');
    after.splice(at < 0 ? after.length : at, 0, { kind: 'upgrade', age: st.age, stage: stageOf(st.age) });
  }
  // เตือนต่อท้ายการ์ดผลของตัวเลือกนี้ ก่อนเรื่องต่อ — เรื่องต่อที่ทำชีวิตหมดล้างคิว การ์ดเตือนที่อยู่หลังจะไม่เคยออก
  if (!st.dead && crossedLow(st, st.health, WARN.human)) {
    const at = after.findIndex((x) => x.kind !== 'result');
    after.splice(at < 0 ? after.length : at, 0, warnCard(st.age, stageOf(st.age), WARN.text));
  }
  st.queue.unshift(...after);
}

function deathCard(st) {
  const year = st.birthYear + st.age;
  const era = st.content.era;
  const card = {
    kind: 'death',
    age: st.age,
    text: `${lifeEndWord(isGone(st))} ${st.age}`,
    cause: st.cause ?? 'other',
    ...(careHelp(st.cause) && { help: careHelp(st.cause) }),
    // money = ทรัพย์สุทธิหลังหักหนี้รายก้อน · debt = ยอดหนี้รายก้อนที่ค้าง (ระหว่างชาติ B06 อ่านแยก)
    summary: {
      year,
      money: Math.round(netWorth(st)),
      moneyAtBirth: Math.round(netWorth(st) / priceRatio(era, st.seed, st.birthYear, year)),
      debt: Math.round(totalDebt(st)),
      bankruptcies: st.bankruptcies,
      // เงินเทาที่ยังไม่ฟอกหายไปกับตัว — ไม่เข้า estate จึงไม่เป็นมรดก/ฐานะรุ่นถัดไป · มีช่องเฉพาะชีวิตที่เหลือถุง
      ...(st.grey > 0 && { grey: Math.round(st.grey) }),
    },
  };
  st.estate = { year, money: card.summary.money, moneyAtBirth: card.summary.moneyAtBirth, debt: card.summary.debt, bankruptcies: st.bankruptcies };
  // ช่วงวัยสุดท้ายไม่มีการ์ดเปลี่ยนช่วงมาปิด — เล่าบนบันทึกการตายแทน
  card.recap = stageRecap(st, st.age);
  card.life = lifeSeries(st);
  card.job = jobText(st);
  card.gen = st.gen;
  if (st.lastImage) card.lastImage = st.lastImage;
  // ใบ 07: ตายตอนเด็กได้บันทึกสั้นบอกสถิติยุคนั้น (ทารกใช้อัตราตายทารก · เด็กโตใช้โอกาสตายรายปีของอายุนั้น) แล้วเข้าช่วงที่ 7 ตามปกติ
  if (st.age < 5) {
    const imr = infantMortality(era, st.sex, protoYear(era, st.seed, st.birthYear));
    card.note = `ยุคนั้นทารก${st.sex}ไทยตายก่อนอายุ 1 ขวบ ราว ${Math.round(imr)} คนในทุก 1,000 คน`;
  } else if (st.age < STAGES[1].from) {
    const q = lifeQx(era, st.seed, st.sex, year, st.age);
    card.note = `ยุคนั้นเด็ก${st.sex}อายุ ${st.age} ปีจากไปราว ${Math.max(1, Math.round(q * 10000))} คนในทุก 10,000 คนต่อปี`;
  }
  if (st.age < STAGES[1].from) card.short = true;
  const pets = petsAfter(st);
  if (pets) card.pets = pets;
  if (st.funeral) {
    const { text, cost } = st.funeral;
    const guests = funeralGuests(st);
    const who = funeralWho(st, guests);
    // ยอดที่โชว์ไม่ต่ำกว่าคนในบ้านที่มา (บริจาคร่างปัดได้ 0) — ชื่อเสียง/บุญแขกยังคิดจากยอดเดิม
    card.funeral = { text, guests: Math.max(guests, who?.came ?? 0), cost: Math.round(cost), ...(who && { who: who.text }) };
  }
  // มีทรัพย์ให้แบ่ง + ลูกที่ยังอยู่ถึงเกณฑ์ = เรื่องพินัยกรรม (afterlife.mjs หักส่วนที่เสียไปกับการทะเลาะ) · ลูกคนเดียวไม่มีใครให้ทะเลาะด้วย
  if (card.summary.money > 0 && !card.short && disputes(st)) card.will = !!st.flags.wish_will;
  if (st.flags.wish_letter && letterTo(st)) card.letter = `ฝากจดหมายไว้กับ${letterToText(letterTo(st))}`;
  return card;
}

// งานศพ (B25): ตายหลังพ้นวัยเด็ก → การ์ดคำสั่งเสีย (วนจนกด "พอ") แล้วการ์ดแบบงานศพ ก่อนมรณบัตร
// ตายตอนเด็กข้ามฉากนี้ — มรณบัตรเด็กเป็นบันทึกสั้น (ใบ 07) · ตัวคูณแขกผูกกับ id ตัวเลือกใน content/funeral.yaml
const FUNERAL = {
  wishes: 'funeral_wishes_01',
  rite: 'funeral_rite_01',
  guests: { one_day: 0.3, chant_3: 0.7, chant_7: 1, grand: 1.6, body: 0.2, temple: 0.4 },
  // B25b ค่าตั้งของเกม: บุญจากแขกคิดจากฐานแขกไม่คูณขนาดงาน (กันซื้อบุญด้วยเงิน) หารด้วย ref เพดาน cap (= บาประดับ 1 ของงานใหญ่)
  guestMerit: { ref: 500, cap: 1 },
  // คนข้างหลังเลือกแบบงานตามความสัมพันธ์: ถึง high = งานแพงที่จ่ายไหว · ต่ำกว่า low = เผาวันเดียว · ระหว่างนั้น = สวด 3 คืน
  love: { high: 70, low: 40 },
  // ลูกที่ยังอยู่ตั้งแต่เท่านี้ถึงมีการแบ่งมรดกกันเอง (เจ้าของเคาะ A9)
  disputeKids: 2,
};
// จดหมายคำฝาก (afterfall-3): ใบเลือกคำฝากตามหลังคำสั่งเสีย · ใบที่ทายาทอ่านขึ้นต้นด้วย read (ใบละชนิดคำฝาก)
const LETTER = { pick: 'funeral_letter_01', read: 'heir_letter_', nobody: 'ไม่มีใครให้ฝาก' };
const guestBase = (st) => 20 + st.relations * 2 + st.network * 3;
// แขกมาส่งตามความสัมพันธ์/คอนเน็คชั่น คูณขนาดงาน — ปัดสิบ ไม่ใช่ยอดนับจริง · ไม่มีงานศพ = 0
const funeralGuests = (st) => (st.funeral ? Math.round(((FUNERAL.guests[st.funeral.id] ?? 1) * guestBase(st)) / 10) * 10 : 0);
// state ก่อนมีระบบครอบครัว (ไม่มี kin) ถือว่าถึงเกณฑ์ — ตรงกับ LEGACY.kids ของ afterlife.mjs
const disputes = (st) => (livingChildren(st) ?? FUNERAL.disputeKids) >= FUNERAL.disputeKids;
const deadPurse = (st) => Math.min(st.money, netWorth(st));

// แบบงานศพที่คนข้างหลังเลือก (B25b) · คำสั่งบริจาคร่างทับทุกอย่าง · ไม่มีลูกหลานหรือจ่ายแบบไหนไม่ไหว = วัด/มูลนิธิจัดให้
// สุ่มจาก rng ของชีวิตครั้งเดียวเฉพาะตอนต้องเลือกระหว่างงานใหญ่กับสวด 7 คืน
function pickRite(st, ev) {
  if (st.flags.wish_body) return 'body';
  const heirs = st.kin ? st.kin.some((m) => (m.role === 'child' || m.role === 'grandchild') && m.alive) : !!st.flags.has_kids;
  if (!heirs) return 'temple';
  const purse = deadPurse(st);
  const ok = (id) => {
    const c = ev.choices.find((x) => x.id === id);
    return !!c && (!c.requires?.money || purse >= moneyValue(st, c.requires.money, true));
  };
  let want = ['one_day'];
  if (st.relations >= FUNERAL.love.high) want = [...(st.rng.next() < 0.5 ? ['grand', 'chant_7'] : ['chant_7', 'grand']), 'chant_3', 'one_day'];
  else if (st.relations >= FUNERAL.love.low) want = ['chant_3', 'one_day'];
  return want.find(ok) ?? 'temple';
}
// ทริปจบ (การ์ดจบออกไปแล้ว): ตายในต่างโลก = ชีวิตไทยจบแบบหายตัว · กลับบ้าน = เวลาไทยเดินตามที่ทอยไว้แล้วเล่าการกลับ
// ค่าจริงที่ต่างโลกสะท้อนกลับ เขียนลงชีวิตไทย (B136 · เจ้าของเคาะ): เงินมาทางนี้ทางเดียว (tripCarry ไม่มีเงิน)
// ตายในต่างโลก = นับแค่เงิน (เข้ากองมรดก) · ค่าสถานะที่สะท้อนไปไม่มีผล เพราะชีวิตนี้จบแล้ว · ทริปในเซฟก่อน B136 ไม่มี real
function tripSettle(st, isk) {
  if (!isk.real) return;
  st.money += isk.real.money - isk.trip.money0;
  if (isk.home) for (const k of STAT_KEYS) st[k] = clamp(isk.real.stats[k]);
}

// ค่าซ้อนทับ (โลกซ้อนทับ): ตัวนับเดียวของตระกูล ขึ้นทีละ 1 ทุกครั้งที่กลับเข้าโลกที่เคยออกไป ไม่มีทางลด · ไปกับทายาทเหมือนบัญชีบุญบาป
// ไม่ดึงเลขสุ่ม — ชีวิตที่ไม่ข้ามโลกเดินเท่าเดิม · เริ่มตระกูลใหม่ (newLife ไม่มี heir) = 0
const overlapOf = (st) => st?.overlap ?? 0;
function overlapStep(st) {
  st.overlap = overlapOf(st) + 1;
}
// ขั้นของค่าซ้อนทับ 0–4: การ์ดอ่านแค่ขั้น ไม่อ่านค่าดิบ · ขั้น 1 = ค่า 1 ล็อก · ขั้น 2–4 ไปไม่ถึงจนใบ 16 วัดบอทอัตราจริงแล้วใส่เลข
const OVERLAP_STAGE_MIN = [0, 1, Infinity, Infinity, Infinity];
// อ่านค่าสดทุกครั้ง — ขึ้นขั้นกลางชีวิต (ทริปกลับบ้าน) การ์ดขั้นใหม่ออกได้ปีถัดไปเลย
const overlapStageOf = (st) => OVERLAP_STAGE_MIN.findLastIndex((min) => overlapOf(st) >= min);
// ตระกูลเคยออกจากต่างโลกมาแล้ว = มีชาติต่างโลกลงผัง (กลับมาเกิดแล้ว) หรือทริปที่กลับถึงบ้าน · ทริปหลงตายในต่างโลก ไม่นับว่าออก
// เข้าต่างโลกอีกเมื่อจริง = กลับเข้าโลกที่เคยออกไป +1 (เกิด · ถูกเรียก · ทริป)
const overlapLeftIsekai = (st) => [...(st.lineage ?? []), { trips: st.trips }].some((l) => l.isekai || l.trips?.some((t) => t.home));

// ตารางนัดการ์ดซ้อนทับต่อชีวิต: ลอกแบบตารางนัดการ์ดชวนต่างโลก — สุ่มจาก stream แยกของ seed ไม่ดึง st.rng
// ขั้น 0 ไม่มีตารางและไม่เพิ่มช่องใด ⇒ ตระกูลค่า 0 เดินเท่าเดิมทุกหลัก · การ์ดซ้อนทับไม่อยู่ในกองสุ่ม ออกทางนัดนี้ทางเดียว
// นัดลง st.scheduled จึงกินโควตาปีแบบผลย้อน (ชีวิตไม่ยาวขึ้น) · ขั้น 1 อย่างน้อย 1 ใบ ให้คนที่ข้ามโลกครั้งแรกเห็นผลแน่นอน
// ขั้นขึ้นกลางชีวิตได้ทางเดียวคือทริปกลับบ้าน ⇒ ทิ้งนัดที่ยังไม่ออกแล้วสุ่มใหม่ด้วย stream ของรอบนั้น หลังเดินปีที่หายไปแล้ว
const OVERLAP_PLAN = { salt: 0x3c6ef372, prefix: 'overlap_', ages: [15, 60], quota: [[0, 0], [1, 1], [1, 2], [2, 4], [2, 4]] };
// stage ส่งเองได้เฉพาะด่าน — ขั้น 2–4 ยังไม่มีเลขเกณฑ์ให้ตระกูลจริงไปถึง
function overlapPlan(st, run = 0, stage = overlapStageOf(st)) {
  if (!stage) return;
  st.scheduled = st.scheduled.filter((x) => !x.overlap);
  const rng = makeRng(mixSeed(st.seed ^ OVERLAP_PLAN.salt, run));
  const [lo, hi] = OVERLAP_PLAN.quota[stage];
  const from = Math.max(st.age + 1, OVERLAP_PLAN.ages[0]);
  const pool = st.content.events.filter((e) => e.id.startsWith(OVERLAP_PLAN.prefix) && !st.done[e.id] && inRange(stage, e.when?.overlap_stage));
  for (let left = rng.int(lo, hi); left > 0 && pool.length && from <= OVERLAP_PLAN.ages[1]; left--) {
    const [ev] = pool.splice(rng.int(0, pool.length - 1), 1);
    st.scheduled.push({ event: ev.id, age: rng.int(from, OVERLAP_PLAN.ages[1]), overlap: true });
  }
}

// ปีที่หายไปเดินด้วย stepYear ปกติ (เงิน คนในบ้าน ด่านเรียน) แต่ไม่ทอยตายและไม่จับกอง — ตัวไม่อยู่ เรื่องของปีนั้นจึงมาเป็นข่าวหลังกลับ
function tripBack(st) {
  const isk = st.trip;
  st.trip = null;
  (st.trips ??= []).push(tripLineage(isk));
  tripSettle(st, isk);
  // ตายในทริปก็เขียนกลับ — ชาติต่างโลกหลังปรโลกพกชุดนี้ต่อ
  if (st.skills) st.skills = skillsBack(st.skills, isk);
  if (!isk.home) {
    st.tripLost = true;
    st.dead = true;
    return nextCard(st);
  }
  // กลับถึงบ้าน = กลับเข้าโลกที่เคยออกไป · ทริปหลงไม่ได้กลับ จึงไม่นับ
  overlapStep(st);
  const away = isk.age - isk.trip.from;
  const c = tripCarry(isk);
  st.network = clamp(st.network + c.network);
  st.knowledge = clamp(st.knowledge + c.knowledge);
  for (let i = 0; i < isk.trip.thai; i++) stepYear(st);
  overlapPlan(st, st.trips.length);
  // ใบตัดสินใจที่ถึงกำหนดทุกปี (เลื่อนขั้น ทบทวนเงิน ช่วงวัย) ซ้อนกันหลายใบ — เก็บใบล่าสุดของแต่ละเรื่อง ใบเก่าสร้างจากสถานะที่ไม่ใช่แล้ว
  const key = (c) => (c.kind === 'eraEvent' ? `e:${c.ev.id}` : ['alloc', 'stage', 'omen'].includes(c.kind) ? c.kind : null);
  st.due = st.due.filter((c, i) => !key(c) || !st.due.slice(i + 1).some((d) => key(d) === key(c))).map((c) => ({ ...c, age: st.age }));
  // ค่าจริงจากต่างโลก + ปีที่หายไปเขียนสุขภาพนอก choose/ขอบปี — ตัดสินเกณฑ์เตือนที่สภาพตอนกลับถึงบ้าน
  if (crossedLow(st, st.health, WARN.human)) st.due.push(warnCard(st.age, stageOf(st.age), WARN.text));
  st.away = (st.away ?? 0) + away - isk.trip.thai;
  st.advance = false;
  const when = isk.trip.thai ? `ผ่านไป ${isk.trip.thai} ปี` : 'ผ่านไปแค่ไม่กี่เดือน';
  return emit(st, { kind: 'result', type: 'B', trip: true, tag: 'trip', age: st.age, stage: stageOf(st.age), text: `ลืมตาอีกทีก็ยืนอยู่หน้าบ้านหลังเดิม ในต่างโลกคุณอยู่มา ${away} ปี แต่ที่นี่${when} คนที่บ้านนึกว่าคุณหายตัวไป` });
}

function queueFuneral(st) {
  if (st.age < STAGES[1].from) return false;
  const evs = [FUNERAL.wishes, FUNERAL.rite].map((id) => st.content.events.find((e) => e.id === id)).filter(Boolean);
  if (!evs.length) return false;
  for (const ev of evs) {
    st.done[ev.id] = true;
    st.fired[ev.id] = { n: 1, age: st.age };
    st.queue.push({ kind: 'eraEvent', ev, age: st.age });
  }
  return true;
}

// เฉลยบัญชีบุญบาป (ใบ 09 "เฉลยที่ปรโลก") — ออกบนการ์ดปรโลกในระหว่างชาติใบเดียว (afterlife.mjs)
// ชื่อ key เลี่ยงคำที่ด่านรั่วของ harness จับ · harness ยกเว้นช่องนี้บนการ์ดปรโลกช่องเดียว
const RECKON_TOP = 3;
function reckoning(ledger) {
  const r1 = (v) => Math.round(v * 10) / 10;
  const good = r1(ledger.merit), bad = r1(ledger.sin);
  const top = Object.entries(ledger.byCat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, RECKON_TOP)
    .map(([id, v]) => ({ name: meritName(id), bad: SIN_CATS.includes(id), weight: r1(v) }));
  return { good, bad, lean: good > bad ? 'บุญ' : bad > good ? 'บาป' : 'เสมอ', top };
}

// "ภาค" นำหน้าไม่เข้ากับกรุงเทพฯ และปริมณฑล
const regionLabel = (st) => (st.ses === 'bkk' ? st.region : `ภาค${st.region}`);
// ที่เกิดบนจอ (B34) — ภาคยังใช้คิดฐานะ/รายได้/ภัยพิบัติ จังหวัดเป็นแค่ที่อยู่ที่เล่า
const provinceLabel = (st) => placeName(st.province);
// จังหวัดพร้อมภาค ให้ประโยคที่ผลขึ้นกับภาค (ภัยรายภาค) บอกได้ว่าทำไมโดน · กรุงเทพฯ ไม่ต้องต่อ · ปริมณฑลต่อชื่อกลุ่ม
const areaLabel = (st) => (st.ses !== 'bkk' ? `${provinceLabel(st)} ${regionLabel(st)}` : st.province === 'กรุงเทพมหานคร' ? st.province : `${provinceLabel(st)} ปริมณฑลของกรุงเทพฯ`);

function profileText(st) {
  return `เกิดปี ${st.birthYear} · ${st.sex} · ${provinceLabel(st)} · ฐานะ${st.cls} · ${jobText(st)}`;
}

function statsOf(st) {
  return { health: st.health, happiness: st.happiness, knowledge: st.knowledge, relations: st.relations, network: st.network, money: st.money };
}

// harness วิ่งชีวิตผ่านฟังก์ชันชุดเดียวกับหน้าเว็บ ผู้เรียกส่งแค่ตัวเลือกเลือกตัวเลือก · onCard เห็นสถานะทุกการ์ด
// บอทได้ st เพื่ออ่านป้ายบุญบาปของตัวเลือกแทนการอ่านความหมายของข้อความแบบที่ผู้เล่นทำ — ห้ามอ่านบัญชีเอง
// stream ของบอทแยกจาก rng ของแกนเกม เพื่อไม่ให้การเลือกไปเปลี่ยนลำดับสุ่มของโลก
// st ส่งเข้ามาได้ = เล่นชีวิตรุ่นถัดไปที่ระหว่างชาติสร้างไว้
const tripAny = (card, rng) => {
  const open = card.choices.map((_, i) => i).filter((i) => !card.locked?.[i]);
  return open[Math.floor(rng.next() * open.length)];
};

function playLife(seed, content, pickChoice, onCard, st = newLife(seed, content)) {
  const bot = makeRng(seed ^ 0x5bd1e995);
  let courtBot = null;
  for (;;) {
    const card = nextCard(st);
    onCard?.(card, st);
    if (card.kind === 'death') return { age: card.age, cards: st.cards + 1, state: st };
    // บอทที่มีนโยบายโฟกัส (ใบ 04) ตั้งโฟกัสหลังเห็นการ์ด — นโยบายสุ่มจาก stream ของตัวเอง ไม่แตะ rng ของโลก
    if (pickChoice.focus && !st.dead && !st.trip && !st.court) pickChoice.focus(st);
    // บอทที่ไม่ได้ประกาศ isekai ปฏิเสธการ์ดชวนโดยไม่ดึงเลขสุ่ม ⇒ ชีวิตเดินเท่าเดิม
    // การ์ดในทริป (B68m) ไม่มีป้ายบุญบาปแบบชีวิตไทย — บอทที่ประกาศ trip เลือกเอง ที่เหลือสุ่มตัวที่ไม่ล็อก
    if (card.court) {
      if (card.choices.length) choose(st, courtPick(card, (courtBot ??= makeRng(seed ^ 0x1f83d9ab))));
      continue;
    }
    if (card.trip && card.kind === 'isekai') {
      if (card.choices.length) choose(st, warnPick(card) >= 0 ? warnPick(card) : pickChoice.trip ? pickChoice.trip(card, bot) : tripAny(card, bot));
      // ไม่มีใบทุ่มเทเข้าช่วงวัยแล้ว (ui-redo 83) — บอทตั้งโฟกัสตาแรกของช่วงจากใบเลือกรูปเดิม เหมือนผู้เล่นเปิดแผงตัวฉัน
      else if (card.entered) {
        const fc = isekaiFocusCard(st.trip);
        isekaiFocusPick(st.trip, pickChoice.trip ? pickChoice.trip(fc, bot) : tripAny(fc, bot));
      }
      continue;
    }
    // บอทคืนเลขตัวเลือก หรือ {i, loan} เมื่อกู้มาจ่าย (B111)
    if (card.choices?.length) {
      // การ์ดย้อนความทรงจำไม่ดึงเลขบอท — งานศพหลังจากนี้เลือกเหมือนไม่มีการ์ดนี้
      const p = card.entry && !pickChoice.isekai ? ENTRY.decline : card.kind === 'memory' ? 0 : warnPick(card) >= 0 ? warnPick(card) : pickChoice(card, bot, st);
      if (typeof p === 'object') choose(st, p.i, p.loan);
      else choose(st, p);
    }
  }
}

// ป้ายเป้าหมายถัดไป (B89): บรรทัดเดียวบนหัวการ์ด บอกขั้นถัดไปของสายที่อยู่ + ค่าที่ยังขาด
// อ่านอย่างเดียว ไม่ดึงเลขสุ่ม ไม่เขียน state — ชีวิตเดินเหมือนไม่มีป้าย
// บอกทิศ ไม่บอกเลขเกณฑ์ ไม่บอกโอกาส · ด่านที่ตัดสินด้วยน้ำหนัก (สอบมหาวิทยาลัย เลือกตั้ง) ไม่บอกเงื่อนไข · บุญบาปไม่ขึ้นป้าย



// ข้อความสั้นแบบ "ขาด…" — ป้ายต้องไม่ทำให้แถบหัวการ์ดตกบรรทัดเพิ่ม (เจ้าของเคาะ B89 A6)
const SHORT_TH = { knowledge: 'ความรู้', relations: 'ความสัมพันธ์', network: 'เส้นสาย', health: 'ความแข็งแรง' };
function shortText(st, need) {
  const keys = Object.keys(need).filter((k) => st[k] < need[k]);
  if (!keys.length) return null;
  return `ขาด${keys.map((k) => SHORT_TH[k]).join('และ')}`;
}

// จบช่วงเรียนนี้อีกกี่ปี · ป้ายนี้ขึ้นแทนช่อง "กำลังเรียน…" บนแถบ จึงต้องไม่ยาวกว่าข้อความนั้น
// ไม่ต่อท้ายเกณฑ์นายร้อย — ต่อแล้วแถบตกบรรทัดบนจอแคบทุกครั้ง
function schoolGoal(st) {
  const id = schoolOf(st);
  const t = TRACKS[id];
  if (!t || t.until <= st.age) return null;
  return `จบ${t.name}อีก ${t.until - st.age} ปี`;
}

// ครบวาระเมื่อไร + ขั้นที่ลุ้นต่อ · ยอดสาย = ไม่ขึ้น · ท้องถิ่นที่พ้นตำแหน่งตามอายุก่อนครบวาระ = ไม่ขึ้น
function officeGoal(st) {
  const steps = st.content.era.careers.office.steps;
  const up = steps[st.office.rank + 1];
  if (!up) return null;
  if (!officeFull(st) && st.office.next > OFFICE.ageTo + 1) return null;
  const n = st.office.next - st.age;
  return `${n > 0 ? `ครบวาระอีก ${n} ปี` : 'ครบวาระปีนี้'} · ลุ้น${up.name}`;
}

// ขั้นถัดไปในสายยศ: ค่าไม่ถึงบอกชื่อค่า · ถึงแล้วบอกปีที่เหลือ (ความสุขต่ำนับปีช้าลง จึงหารตัวคูณเดียวกับแกน)
// ขั้นที่ตั้งชื่อจากอาชีพ บอกแค่ส่วนต่อท้าย — ชื่ออาชีพอยู่บนแถบเดียวกันแล้ว ซ้ำแล้วแถบตกบรรทัด
function ladderGoal(st) {
  const p = PROMO[st.ladder.id]?.[st.ladder.rank];
  if (!p) return null;
  const step = ladderOf(st).steps[st.ladder.rank + 1];
  const next = `ขึ้น${step.name ?? step.suffix ?? stepName(st, st.ladder.rank + 1)}`;
  const short = shortText(st, p.need);
  if (short) return `${next} · ${short}`;
  return `${next} · อีกราว ${Math.max(1, Math.ceil((p.years - st.ladder.prog) / moodMul(st)))} ปี`;
}

// ลำดับเมื่อเข้าหลายสาย: เรียน > การเมืองเต็มเวลา > ยศ > การเมืองท้องถิ่น (ทำควบงาน)
function nextGoal(st) {
  if (schoolOf(st) !== 'none') return schoolGoal(st);
  if (st.office && officeFull(st)) return officeGoal(st);
  const rank = st.ladder && isWorking(st) && ladderGoal(st);
  if (rank) return rank;
  return st.office ? officeGoal(st) : null;
}

// สายมู (ใบ 12): ส่วนที่แกนต้องทำเองนอกเหนือผลตัวเลือกปกติ — หวยสายมู · ทำบุญหวังผลที่ตามมาทวง · ตัวนับกิจกรรมสายมู
// กิจกรรมอื่น (ดูดวง ฤกษ์ บนบาน เครื่องราง) เป็นเนื้อหาล้วน ผลอยู่ในตัวเลือก ด่าน build กั้นให้แตะได้แค่ความสุข/ความสัมพันธ์/เงินจ่ายออก/ธง/ป้ายบุญ
// ไฟล์นี้อ่านบัญชีบุญบาปได้ที่เดียวคือโอกาสรางวัลเล็กของหวยสายมู — ค่าบัญชี/ตัวคูณห้ามออกไปกับการ์ด



// เงินตึง = ทรัพย์สุทธิต่ำกว่ารายได้กี่เดือน · ยังไม่เคยมีรายได้ของตัวเอง (เรียนอยู่) ไม่นับว่าตึง เพราะไม่มีฐานวัด
const TIGHT = { months: 3 };
// ความสุขตอนประกาศผลหวยสายมู (ระดับตาม LEVELS) · ไม่ถูก = 0 ไม่ซ้ำเติม
const PRIZE_JOY = { small: 1, big: 2, first: 3 };
// ทำบุญหวังผลแล้วเงินไม่ดีขึ้น (ใบ 12): ความสุข −1 ระดับ
const HOPE_UNMET = -1;
const HOPE = 'hope_set:';

// draws = รางวัลที่จับได้รายใบ (null = ไม่ถูก) ให้ harness ตรวจอัตรา · ไม่เก็บตัวคูณ ค่าที่อ่านจากบัญชีจึงไม่ค้างใน state
const stateOf = (st) => (st.belief ??= { lottery: 0, tickets: 0, draws: [], acts: 0, hope: {} });
const kind = (e) => e.belief?.kind;
// การ์ดตามทวงของทำบุญหวังผล = เหตุการณ์ที่รอธง hope_set:<id>
const hopeFlag = (e) => (e.when?.flags?.has ?? []).find((f) => f.startsWith(HOPE));

// รายได้ต่อเดือนที่ใช้วัดเงินตึง: ทำงาน = รายได้ปีนี้ · เกษียณ = รายได้ปีสุดท้ายปรับเงินเฟ้อ
function monthlyBase(st) {
  if (isWorking(st)) return monthlyIncome(st);
  return st.retireBase === null ? null : (st.retireBase * st.price) / 12;
}
function moneyTight(st) {
  const base = monthlyBase(st);
  return base !== null && netWorth(st) < TIGHT.months * base;
}

// เงินทรัพย์สุทธิเป็นบาทปีเกิด — เทียบข้ามปีได้โดยเงินเฟ้อไม่ทำให้ดูเหมือนรวยขึ้น
const realWorth = (st) => netWorth(st) / st.price;

// เหตุการณ์นี้เกิดได้ตอนนี้ไหม (เสริม when): หวยสายมูต้องเงินตึงและยังไม่ชนเพดาน · การ์ดตามทวงทำบุญหวังผลออกเมื่อเงินไม่ดีขึ้นเท่านั้น
function beliefOk(st, e) {
  if (kind(e) === 'lottery_numen') return stateOf(st).lottery < e.belief.cap_per_life && moneyTight(st);
  const hope = hopeFlag(e);
  if (hope) return realWorth(st) <= (stateOf(st).hope[hope] ?? -Infinity);
  return true;
}

// เหตุการณ์ถูกจับออกแล้ว: นับเพดานหวยสายมู · การ์ดตามทวงลดความสุขแล้วปิดธงหวังผล
function beliefFired(st, e) {
  const b = stateOf(st);
  if (kind(e) === 'lottery_numen') b.lottery++;
  const hope = hopeFlag(e);
  if (hope) {
    st.happiness = Math.max(0, st.happiness + Math.sign(HOPE_UNMET) * LEVELS[Math.abs(HOPE_UNMET)]);
    delete st.flags[hope];
    delete b.hope[hope];
  }
}

// ตัวคูณรางวัลเล็ก m = 1 + (max_mult − 1) × clamp(บัญชีสุทธิ / ref_scale, 0, 1) — ขึ้นอย่างเดียว บาปมากได้ฐานจริง
function smallPrizeMult(ledger, odds) {
  const ref = REF_TABLE[String(odds.ref_scale).replace(/^table\./, '')];
  if (!(ref > 0)) throw new Error(`ไม่รู้จัก ref_scale: ${odds.ref_scale}`);
  return 1 + (odds.max_mult - 1) * Math.max(0, Math.min(1, netLedger(ledger) / ref));
}

// จับรางวัลหนึ่งใบด้วยเลขสุ่ม u ∈ [0,1): รางวัลใหญ่ใช้อัตราจริงก่อน แล้วรางวัลเล็กคูณ m · คืน null = ไม่ถูก
function drawPrize(table, m, u) {
  let at = 0;
  for (const p of table.prizes) {
    at += (p.n / table.per) * (p.small ? m : 1);
    if (u < at) return p;
  }
  return null;
}

const LOSE_TEXT = [
  'ประกาศผลแล้ว ใบที่ซื้อไม่ถูกสักรางวัล พับเก็บไว้แล้วกลับไปคิดเรื่องเงินเดือนหน้าต่อ',
  'นั่งเทียบผลกับสลากอยู่นาน ไม่ถูกสักตัว ถือว่าดวงงวดนี้ยังไม่มา',
  'ฟังวิทยุประกาศผลจนจบ ไม่ถูกอะไรเลย เงินที่ตึงก็ยังตึงเท่าเดิม',
];

// ข้อความผลพูดได้แค่โชค/ดวงกลาง ๆ ไม่โยงกับที่มาของเลข ไม่ชวนซื้อต่อ (ใบ 11/12)
// มูลค่ารางวัลเป็นตัวเลขเฉพาะปีที่ใช้ตารางรางวัลชุดปัจจุบันแล้ว — ตรงกับด่าน build ข้อ (ค) ของเนื้อหา
const PRIZE_TEXT_FROM = 2560;
function prizeText(st, p, baht) {
  const amount = st.birthYear + st.age >= PRIZE_TEXT_FROM ? ` ${Math.round(baht).toLocaleString('en-US')} บาท` : null;
  if (p.id === 'first') return `ตรวจผลซ้ำหลายรอบ ใบที่ซื้อถูก${p.name}จริง ๆ ได้เงิน${amount ?? 'ก้อนใหญ่จนตั้งตัวไม่ถูก'} โชคมาหาแบบไม่ทันตั้งตัว`;
  if (!p.small) return `ใบที่ซื้อถูก${p.name} ได้เงิน${amount ?? 'ก้อนโต'} ดวงงวดนี้เข้าข้างจนตกใจ`;
  return `ใบที่ซื้อถูก${p.name} ได้เงิน${amount ?? 'มาก้อนเล็ก ๆ'} พอให้หายใจคล่องขึ้นอีกนิด`;
}

// ซื้อหวยสายมูหนึ่งใบ: จ่ายราคาใบ แล้วจับรางวัลด้วย rng ของโลก (เป็นผลของการเลือก) · คืนการ์ดผล
function buyTicket(st, ev) {
  const b = ev.belief;
  const table = PRIZE_TABLES[b.prize_table];
  if (!table) throw new Error(`ไม่รู้จักตารางรางวัล: ${b.prize_table}`);
  const stake = moneyValue(st, b.stake, true);
  st.money -= stake;
  stateOf(st).tickets++;
  const p = drawPrize(table, smallPrizeMult(st.ledger, b.odds_modifier), st.rng.next());
  stateOf(st).draws.push(p?.id ?? null);
  let text = LOSE_TEXT[(st.age + stateOf(st).tickets) % LOSE_TEXT.length];
  if (p) {
    // มูลค่ารางวัลต่อราคาใบคงที่ — ราคาใบปรับเงินเฟ้อแล้ว รางวัลจึงเป็นบาทของปีเดียวกัน
    const baht = p.baht * (stake / table.price);
    st.money += baht;
    const joy = PRIZE_JOY[p.id === 'first' ? 'first' : p.small ? 'small' : 'big'];
    st.happiness = Math.min(100, st.happiness + LEVELS[joy]);
    text = prizeText(st, p, baht);
  }
  return { kind: 'result', type: ev.type ?? 'B', age: st.age, stage: stageOf(st.age), text, tag: 'belief', evId: ev.id };
}

// กิจกรรมสายมูที่ "ทำ" จริง (ใบ 12 ตัวนับให้ใบ 04): ซื้อใบ · จ่ายเงิน · ตั้งธง (บน/เครื่องราง/หวังผล) · แก้บน
const isAct = (c) => c.ticket || c.effects?.money?.amount < 0 || (c.sets_flags ?? []).length > 0 || c.redeem === 'full' || c.redeem === 'light';

// หลังผลตัวเลือกปกติลงแล้ว: จำเงินตอนตั้งธงหวังผล · นับกิจกรรม · ซื้อใบ · คืนการ์ดที่ตัวเลือกนี้ก่อ
function beliefChoice(st, ev, c) {
  if (!ev.belief) return [];
  const b = stateOf(st);
  for (const f of c.sets_flags ?? []) if (f.startsWith(HOPE)) b.hope[f] = realWorth(st);
  if (isAct(c)) b.acts++;
  return c.ticket && kind(ev) === 'lottery_numen' ? [buyTicket(st, ev)] : [];
}

// จำนวนครั้งที่เลือกทำกิจกรรมสายมูในชีวิตนี้ — แกน ④ ทางโลก ↔ ทางธรรม ของฉายา (ใบ 04) อ่าน
const beliefActs = (st) => st.belief?.acts ?? 0;

// ทวีปเอเธอร์การ์ด (06a): ข้อมูลแคว้น/เผ่า/แผนที่ + ตัวสุ่มต่อชาติ — ยังไม่ต่อเข้าเกม (06b ต่อ)
// บริสุทธิ์: รับ seed/rng คืนค่า ไม่แตะสถานะเกม · ตัวสุ่มต่อชาติใช้ stream ของตัวเอง (CONT_SALT) ไม่กินเลขสุ่มของชาติ
// ชื่อระดับบนสุดขึ้นต้น CONT_/cont ทุกตัว — build.mjs รวมทุกโมดูลเป็นสโคปเดียว
// ค่าที่ยังรอเจ้าของเคาะ (06a-ticket หัว "ให้เจ้าของเคาะ") ใช้ค่าแนะนำในใบ: ค่าเริ่มเผ่า · น้ำหนักโอกาสเกิด · เผ่าแบ่งเท่า · ขาลง/มาแรง 50/50 · ข้อพิพาทเท่ากัน

const CONT_SALT = 0xc0a7;
// ระดับโอกาสเกิด → น้ำหนักแคว้น (ร่าง)
const CONT_TIER = { very: 8, often: 5, mid: 3, few: 2, rare: 1 };
const CONT_RACES = {
  human: { name: 'มนุษย์', start: { cha: 2 }, pace: 1 },
  elf: { name: 'เอลฟ์', start: { mag: 2, str: -2 }, pace: 3 },
  dwarf: { name: 'คนแคระ', start: { str: 2, cha: -2 }, pace: 2 },
  beastkin: { name: 'ชาวสัตว์', start: { str: 2, luk: 2, mag: -2 }, pace: 0.9 },
  halfling: { name: 'ฮาล์ฟลิง', start: { luk: 2, str: -2 }, pace: 1.3 },
  orc: { name: 'ออร์ค', start: { str: 4, mag: -2, cha: -2 }, pace: 0.8 },
  demon: { name: 'ปีศาจ', start: { mag: 2, str: 2, cha: -2, luk: -2 }, pace: 2.5 },
  dragonkin: { name: 'เชื้อมังกร', start: { str: 2, mag: 2, luk: -2 }, pace: 3 },
};
const ALL_RACES = Object.keys(CONT_RACES);
// about = แนวของแคว้น (บนแฟ้มเกิด) · ruler null = ไม่มีผู้ปกครอง (ไม่เข้าสุ่มขั้วอำนาจ) · danger = ดันเจียนลับออกถี่กว่า (รอบ 22: ไม่มีผู้ปกครองทั้ง 4 + ปากเหว · คาร์กัล · โอรัน)
const CONT_REGIONS = {
  helvard: { about: 'อาณาจักรมนุษย์ใหญ่ ขุนนางถือที่ดิน', name: 'เฮลวาร์ด', ruler: 'กษัตริย์', races: ['human', 'beastkin'], tier: 'very' },
  verdani: { about: 'ลุ่มน้ำ ทุ่งนา ยุ้งฉางของทวีป', name: 'เวอร์ดานี', ruler: 'ดยุก', races: ['human', 'beastkin'], tier: 'often' },
  marishaven: { about: 'เมืองท่าเสรี', name: 'มาริสฮาเวน', ruler: 'สภาพ่อค้า', races: ['human', 'halfling'], tier: 'often' },
  lioselle: { about: 'ป่าเอลฟ์', name: 'เลียวเซล', ruler: 'สภาอาวุโส', races: ['elf'], tier: 'mid' },
  gromdal: { about: 'นครใต้ภู เหมือง', name: 'กรอมดาล', ruler: 'สภากิลด์', races: ['dwarf'], tier: 'mid' },
  karghal: { about: 'แดนพ่ายสงครามจอมมาร', name: 'ทุ่งเถ้าคาร์กัล', ruler: 'สภาเผ่า', races: ['demon', 'orc'], tier: 'mid', danger: true },
  nameless_wood: { about: 'ป่ามอนสเตอร์', name: 'พนาไร้ชื่อ', ruler: null, races: ['orc', 'beastkin'], tier: 'mid', danger: true },
  northvale: { about: 'หิมะ 8 เดือน', name: 'นอร์ธเวล', ruler: 'หัวหน้าเผ่า', races: ['human'], tier: 'few' },
  windcliff: { about: 'มังกรเฒ่าบนยอด', name: 'ผาวายุ', ruler: 'ผู้เฒ่า', races: ['dragonkin'], tier: 'rare' },
  cloud_isles: { about: 'เกาะลอย ส่งของ', name: 'หมู่เกาะเมฆา', ruler: null, races: ['halfling'], tier: 'rare', danger: true },
  red_sands: { about: 'ชุมทางคาราวาน', name: 'ผืนทรายชาด', ruler: 'สภาคลัง', races: ['human', 'orc'], tier: 'mid' },
  lexaria: { about: 'นครสัญญา ทนาย', name: 'เล็กซาเรีย', ruler: 'สภารับรอง', races: ['human', 'dwarf'], tier: 'few' },
  aurelia: { about: 'นครศาสนจักร', name: 'ออเรเลีย', ruler: 'ประมุข', races: ['human'], tier: 'few' },
  zeron: { about: 'หอเวทมหาวิทยาลัย', name: 'ซีรอน', ruler: 'อธิการ', races: ['elf', 'human'], tier: 'few' },
  weir_marsh: { about: 'สาธารณรัฐสภาฝาย', name: 'บึงพันฝาย', ruler: 'ผู้แทน', races: ['halfling'], tier: 'mid' },
  abyss_mouth: { about: 'เขตเสรีนักผจญภัย', name: 'ปากเหวพันชั้น', ruler: 'ผู้แทนเขต', races: ALL_RACES, tier: 'few', danger: true },
  coralis: { about: 'เกาะโจรสลัด', name: 'โคราลิส', ruler: 'กัปตัน', races: ['human', 'beastkin'], tier: 'few' },
  poison_range: { about: 'ป่าอันตราย ของหายาก', name: 'เทือกพิษ', ruler: null, races: ['demon'], tier: 'rare', danger: true },
  oran: { about: 'เมืองหลวงเก่าล่มสลาย', name: 'โอรัน', ruler: 'ผู้สำเร็จราชการ', races: ['human'], tier: 'few', danger: true },
  singing_steppe: { about: 'เผ่าเร่ร่อน ม้า', name: 'ทุ่งหญ้าเสียง', ruler: null, races: ['beastkin', 'orc'], tier: 'mid', danger: true },
};
// แผนที่ติดกัน (รอบ 21) เก็บเป็นคู่ครั้งเดียว สร้างสองทิศตอนโหลด ⇒ สมมาตรเสมอ
const CONT_ROADS = [
  ['northvale', 'windcliff'], ['northvale', 'gromdal'], ['northvale', 'singing_steppe'],
  ['windcliff', 'gromdal'], ['windcliff', 'cloud_isles'],
  ['gromdal', 'helvard'], ['gromdal', 'abyss_mouth'],
  ['helvard', 'oran'], ['helvard', 'aurelia'], ['helvard', 'lexaria'], ['helvard', 'red_sands'],
  ['oran', 'abyss_mouth'], ['oran', 'karghal'],
  ['abyss_mouth', 'poison_range'],
  ['aurelia', 'zeron'], ['aurelia', 'verdani'],
  ['zeron', 'lexaria'], ['zeron', 'lioselle'],
  ['lexaria', 'marishaven'], ['lexaria', 'singing_steppe'],
  ['lioselle', 'nameless_wood'], ['lioselle', 'singing_steppe'],
  ['nameless_wood', 'weir_marsh'],
  ['poison_range', 'karghal'],
  ['karghal', 'red_sands'],
  ['red_sands', 'verdani'],
  ['verdani', 'weir_marsh'], ['verdani', 'marishaven'],
  ['weir_marsh', 'marishaven'],
  ['marishaven', 'coralis'], ['marishaven', 'cloud_isles'],
];
// เครือข่ายทางลับ 6 เส้น (รอบ 22) — คู่ที่ไม่ติดกันตรง
const CONT_SECRET = [
  ['poison_range', 'nameless_wood'], ['abyss_mouth', 'zeron'], ['oran', 'verdani'],
  ['northvale', 'lioselle'], ['karghal', 'weir_marsh'], ['windcliff', 'red_sands'],
];
const CONT_DISPUTES = {
  throne_war: { name: 'สงครามชิงบัลลังก์', w: 1 },
  trade_route: { name: 'แย่งเส้นทางการค้า', w: 1 },
  witch_hunt: { name: 'ศาสนจักรล่าแม่มด', w: 1 },
  plague: { name: 'โรคระบาด', w: 1 },
  dungeon_surge: { name: 'ดันเจี้ยนทะลัก', w: 1 },
  demon_lord: { name: 'จอมมารฟื้น', w: 1 },
  peasant_revolt: { name: 'กบฏชาวนา', w: 1 },
  frost_exodus: { name: 'เผ่าอพยพหนีหนาว', w: 1 },
};
// ขาลง/มาแรง: 2 แคว้นด้วยโอกาส two · ดันเจียน 3 หรือ 4 จุด (four) · แคว้นอันตรายน้ำหนัก ×danger
const CONT_T = { two: 0.5, four: 0.5, danger: 3, base: 10 };

const contLinks = (pairs) => {
  const out = Object.fromEntries(Object.keys(CONT_REGIONS).map((id) => [id, []]));
  for (const [a, b] of pairs) {
    out[a].push(b);
    out[b].push(a);
  }
  return out;
};
const CONT_NEAR = contLinks(CONT_ROADS);
const CONT_HIDDEN = contLinks(CONT_SECRET);
const contNeighbors = (id) => CONT_NEAR[id] ?? [];
const contSecret = (id) => CONT_HIDDEN[id] ?? [];

// สุ่มตามน้ำหนัก ดึงเลขสุ่ม 1 ตัว
const contWeighted = (rng, ids, w) => {
  let x = rng.next() * ids.reduce((s, id) => s + w(id), 0);
  return ids.find((id) => (x -= w(id)) < 0) ?? ids.at(-1);
};
// หยิบ n ตัวไม่ซ้ำตามน้ำหนัก
const contDraw = (rng, ids, n, w = () => 1) => {
  const left = ids.slice(), out = [];
  while (out.length < n && left.length) {
    const id = contWeighted(rng, left, w);
    out.push(id);
    left.splice(left.indexOf(id), 1);
  }
  return out;
};

// ต่อชาติ: ขั้วอำนาจจากแคว้นที่มีผู้ปกครอง (ไม่ซ้ำกัน) · ข้อพิพาท 1 ข้อ · ดันเจียนลับ 3–4 จุด แคว้นละไม่เกิน 1
function contNation(seed) {
  const rng = makeRng(mixSeed(seed ^ CONT_SALT, 0));
  const ruled = Object.keys(CONT_REGIONS).filter((id) => CONT_REGIONS[id].ruler);
  const nf = rng.next() < CONT_T.two ? 2 : 1;
  const nr = rng.next() < CONT_T.two ? 2 : 1;
  const [major, ...rest] = contDraw(rng, ruled, 1 + nf + nr);
  const ds = Object.keys(CONT_DISPUTES);
  const dispute = contWeighted(rng, ds, (id) => CONT_DISPUTES[id].w);
  const nd = rng.next() < CONT_T.four ? 4 : 3;
  const dungeons = contDraw(rng, Object.keys(CONT_REGIONS), nd, (id) => (CONT_REGIONS[id].danger ? CONT_T.danger : 1));
  return { powers: { major, falling: rest.slice(0, nf), rising: rest.slice(nf) }, dispute, dungeons };
}

// เกิด: แคว้นตามน้ำหนักระดับโอกาส (เฉพาะแคว้นที่เผ่านั้นเกิดได้ ถ้าระบุเผ่า) · เผ่าแบ่งเท่าในแคว้น
function contBirth(rng, race = null) {
  const ids = Object.keys(CONT_REGIONS).filter((id) => !race || CONT_REGIONS[id].races.includes(race));
  const region = contWeighted(rng, ids, (id) => CONT_TIER[CONT_REGIONS[id].tier]);
  return { region, race: race ?? rng.pick(CONT_REGIONS[region].races) };
}

// ค่าเริ่มเผ่า = ฐาน (base · ต่อค่า) + ส่วนเผ่า · ค่าไม่ต่ำกว่า 1
const contRaceStart = (race, base = CONT_T.base) =>
  Object.fromEntries(['str', 'mag', 'cha', 'luk'].map((k) => [k, Math.max(1, base + (CONT_RACES[race].start[k] ?? 0))]));
const contLifeMul = (race) => CONT_RACES[race].pace;

// ต่างโลก (B68): ทางที่ 3 ของการ์ดทางเกิด — เทพธิดาต่างโลกพาวิญญาณไปใช้ชีวิตหนึ่งชาติในโลกแฟนตาซี
// เลือกบทบาท 1 จากที่เทพธิดายื่น → เลือกสกิลโกง → เวลาเดินเองทีละปี ผู้เล่นเลือกสิ่งที่ทุ่มเทแล้วค้างไว้ข้ามปี (B68b)
// เหตุการณ์ที่มีตัวเลือกหยุดเวลารอ → แก่แล้วร่างกายเสื่อมจนสิ้นอายุ → ตอนจบ → ปรโลกตัดสิน แล้วการ์ดทางเกิดให้เลือกกลับโลกเดิมหรืออยู่ต่างโลกต่อ
// แนวเล่นต่างจากชาติไทย (การ์ดทีละใบ) โดยตั้งใจ — ชาติไทยกดทุกใบ ชาติต่างโลกกดเฉพาะตอนเปลี่ยนใจหรือมีเรื่องให้ตัดสิน
// ใช้ stream สุ่มของตัวเองจาก seed ของชีวิต — ไม่กินเลขของ af.rng ฉากระหว่างชาติกับการส่งต่อจึงสุ่มได้เหมือนไม่มีต่างโลก
// กรรมจากปรโลก (ระดับ −1..1) เป็นตัวตั้งของโลก: บุญมากได้สกิลให้เลือกมากขึ้นและค่าเริ่มดีขึ้น · บาปหนักได้น้อยลงและโลกโหดขึ้น · ไม่มีตัวเลขบัญชีบนการ์ด
// บัญชีบุญบาปเป็นของดวงวิญญาณ (ส่วนที่ส่งต่อจากชาติก่อน) — ชาติต่างโลกบันทึกต่อลงบัญชีนั้น แล้วปรโลกตัดสินตอนจบชาติ






const ISEKAI_STAT = { str: 'พลัง', mag: 'เวท', cha: 'บารมี', luk: 'โชค' };
const ISEKAI_FX = { hp: 'ชีวิต', str: 'พลัง', mag: 'เวท', cha: 'บารมี', luk: 'โชค', gold: 'ทอง', fame: 'ชื่อเสียง' };
// ค่าตั้งของเกม: stay = อยู่ต่างโลกต่อติดกันได้กี่รอบ (กันบอทวนไม่จบ) · chance = โอกาสเทพธิดาโผล่เองตอนถึงทางเกิด
// karma* = ผลของระดับกรรมต่อโลก · skills = จำนวนสกิลให้เลือกปกติ · memory = ค่าที่ติดตัวไปชาติต่างโลกถัดไป
// ค่าสถานะสองโลกผูกกัน (B100 · เจ้าของเคาะ 1ก 2ก 3ก) — ต่างโลก = ฐานของโลก + น้ำหนัก × (ค่าจริง − 50) ÷ div ส่วนจริงไม่เกิน ±part
// น้ำหนัก = อายุบนโลกเดิมตอนข้าม ÷ age ไม่เกิน 1 · HP หักเฉพาะสุขภาพต่ำกว่า 50 ไม่เกิน hpCut (สุขภาพตอนข้าม = ตอนตาย ซึ่งต่ำแทบทุกคน · ผูก 1:1 ตายต่างโลก 45% · เจ้าของเคาะ) ขากลับ HP สะท้อนสุขภาพ 1:1 · ทอง: เงินสุทธิเท่ารายได้ครัวเรือนประเทศ 1 ปี = gold ทอง ไม่เกิน goldCap เท่าทองตั้งต้น
// หลังข้าม ผลการ์ดต่างโลกสะท้อนกลับค่าจริงชุดที่พกมา (ต่างโลก 1 = จริง div) · ชนเพดานฝั่งไหน ส่วนเกินไม่สะท้อน
const ISEKAI_LINK = { str: 'health', mag: 'knowledge', cha: 'relations', luk: 'happiness', fame: 'network' };
// tick = ปีที่ทุ่มเท (B136 · เจ้าของเคาะ) สะท้อนกลับแค่ส่วนนี้ของอัตราผลการ์ด — ชาติละ ~80 ตา ไม่งั้นค่าจริงชนเพดานก่อนกลางชาติ
const LINK = { div: 10, part: 5, age: 40, gold: 100, goldCap: 3, hpCut: 30, tick: 0.25 };
// worlds = จำนวนการ์ดบทบาทที่เทพธิดายื่น (ชื่อเดิมจากตอนที่ยังเลือกโลก) · roleLean = กรรมเอียงโอกาสบทบาทได้แค่ไหน
const ISEKAI = { stay: 4, chance: 0.2, skills: 3, worlds: 3, karmaStat: 3, karmaDc: 4, karmaSkill: 0.3, memory: 3, roleLean: 0.6 };
// เวลาเดิน (B68b · เจ้าของเคาะ ตาละ 1 ปี วัยชราตาละ 5 ปี): ตัวเลขปีคูณ pace ของบทบาท (เอลฟ์แก่ช้า)
// eventP = โอกาสมีเรื่องให้ตัดสินต่อตา · quiet = อายุก่อนหน้านี้ไม่มีเรื่องสุ่ม (เด็กเล็ก) · regen/decay = HP ต่อปีก่อนและหลังวัยชรา
// gainK = ค่ายิ่งสูงยิ่งฝึกขึ้นช้า (ค่าที่ 20 ขึ้นครึ่งหนึ่งของค่าที่ 0) · later = เรื่องต่อมาถึงกี่ปีหลังเรื่องแรก · cap = อายุเกินวัยชราเท่านี้ร่างหมดแรงแน่
const ISEKAI_TIME = { step: 1, oldStep: 5, eventP: 0.3, quiet: 6, regen: 2, decay: 2, decayGrow: 0.4, gainK: 20, joy: 60, wit: 10, later: 3, cap: 45 };
// เทพธิดาโผล่ถี่ตามกรรม (B68e · เจ้าของเคาะ): chance × (1 + ระดับกรรมสุทธิ) ไม่ต่ำกว่า chanceMin ⇒ บุญเต็ม 40% กลาง 20% บาปเต็ม 5%
// ตายแบบต่างโลกได้โชคเพิ่ม fatedLuck · คำสัญญาที่ฝากไว้: รักษาได้ = บุญระดับ vowLevel · ผิด = ธงบนแล้วไม่แก้
const GODDESS = { chanceMin: 0.05, fatedLuck: 10, vowLevel: 1 };
// คำสัญญา 1 ข้อต่อรอบที่เทพธิดาโผล่ · เลือกจาก seed ไม่ดึงเลขสุ่มของรอบ · ผิด/รักษาวัดจากป้ายบุญบาปของตัวเลือกที่กด
const GODDESS_VOWS = [
  { id: 'no_kill', text: 'สัญญากันข้อเดียวนะ อย่าฆ่าใครเพื่อเอาแต้มหรือของ', breaks: 'kill_for_gain' },
  { id: 'help', text: 'สัญญากันข้อเดียวนะ ไปถึงแล้วช่วยใครสักคนด้วยมือตัวเองบ้าง', needs: 'help_others' },
];
const ISEKAI_SALT = 0x15e4a1;

const ISEKAI_SKILLS = {
  appraise: { name: 'ประเมินค่า', desc: 'มองทะลุของและคน · ตัวเลือกสายสังเกต +20%', tag: 'appraise', thai: { cats: ['work_money'] } },
  storage: { name: 'กล่องมิติไร้ขีดจำกัด', desc: 'เก็บได้ทุกอย่าง · ค้าขาย +20% · ได้ทองเพิ่มครึ่งเท่า', tag: 'trade', thai: { cats: ['work_money'] } },
  allmagic: { name: 'เวททุกธาตุ', desc: 'ร่ายได้ครบไฟ น้ำ ลม ดิน แสง มืด · ตัวเลือกเวท +20%', tag: 'magic', thai: { cats: ['study'] } },
  sword: { name: 'วิชาดาบศักดิ์สิทธิ์', desc: 'ดาบเดียวผ่าภูเขา · ตัวเลือกต่อสู้ +20%', tag: 'fight', thai: { cats: ['health'] } },
  tongue: { name: 'ลิ้นทองเทวี', desc: 'พูดได้ทุกภาษา คนฟังแล้วเคลิ้ม · ตัวเลือกเจรจา +20%', tag: 'talk', thai: { cats: ['society'] } },
  cook: { name: 'ฝีมือครัวจากโลกเดิม', desc: 'รสมือแม่ค้าตลาดนัด · ตัวเลือกทำอาหาร +25%', tag: 'cook', add: 25, thai: { cats: ['family'] } },
  stealth: { name: 'ซ่อนตัวระดับเทพ', desc: 'ไม่มีใครสังเกตเห็น · ตัวเลือกแอบ/หนี +20%', tag: 'sneak' },
  regen: { name: 'ฟื้นฟูอัตโนมัติ', desc: 'ชีวิตฟื้น +6 ทุกเหตุการณ์', thai: { cats: ['health'] } },
  exp: { name: 'ประสบการณ์ ×2', desc: 'ค่าสถานะที่ได้เพิ่มเป็นสองเท่า', thai: { cats: ['study', 'work_money'] } },
  luck: { name: 'โชคเทพธิดา', desc: 'โชค +15 ตั้งแต่เกิด' },
  rbd: { name: 'ย้อนเวลาเมื่อตาย', desc: 'ตายครั้งแรกเวลาจะย้อนกลับ ฟื้นด้วยชีวิต 40' },
};

// สกิลข้ามชาติ (06s): carry = พกไปชาติใหม่ได้กี่อย่าง · top = ขั้นสูงสุด · step = โอกาสที่เพิ่มต่อขั้นที่เกินขั้น 1
// ขั้น 1 ได้ค่าเดิมของสกิล ⇒ ชาติที่ไม่มีการอัปเกรดเดินเท่าก่อนมีขั้น
const SKILL = { carry: 3, top: 3, step: 10 };
// ผลเบาชาติไทย: ชาติไทยไม่มีแท็กตัวเลือกให้สกิลจับ ⇒ เอียงทั้งหมวดการ์ดแทน — ทาง ok ของการ์ดหมวดที่ตรงคูณ 1 + k × ผลรวมขั้นของสกิลที่ตรง
// (ยังโดนเพดาน okMax · ไม่ดึงเลขสุ่ม) · k = 0.1 ≈ +2–3 จุดต่อหมวดที่ขั้น 1 — เบาพอไม่ทำให้ชีวิตยาวขึ้น (วัดด้วย harness/skills.mjs)
const THAI_SKILL = { k: 0.1 };
function thaiSkillMul(skills, cat, k = THAI_SKILL.k) {
  if (!k || !cat || !skills?.length) return 1;
  let lv = 0;
  for (const s of skills) if (ISEKAI_SKILLS[s.id]?.thai?.cats.includes(cat)) lv += s.lv;
  return 1 + k * lv;
}
// หมวดของผลเบาอยู่ในแกน ไม่ผ่านด่านเนื้อหา — lint-test ตรวจกับรายการหมวดของด่าน (หมวดสะกดผิด = ผลเบาเงียบหาย)
function checkSkillThai(cats, skills = ISEKAI_SKILLS, k = THAI_SKILL.k) {
  const out = [];
  if (!(k >= 0)) out.push(`THAI_SKILL.k ต้องไม่ติดลบ (ได้ ${k})`);
  for (const [id, s] of Object.entries(skills)) {
    if (s.thai === undefined) continue;
    if (!Array.isArray(s.thai?.cats) || !s.thai.cats.length) { out.push(`${id}: thai.cats ต้องเป็นรายการหมวดอย่างน้อย 1`); continue; }
    for (const c of s.thai.cats) if (!cats.includes(c)) out.push(`${id}: ไม่รู้จักหมวด ${c}`);
  }
  return out;
}
const skillLv = (isk, s) => isk.lv?.[s] ?? 1;
const skillAdd = (isk, s) => (ISEKAI_SKILLS[s].add ?? 20) + SKILL.step * (skillLv(isk, s) - 1);
// คลังสกิลอยู่ในเครื่องผู้เล่นแบบสมุดฉายา (UI เก็บ ไม่อยู่ในเซฟ) — แกนแค่คำนวณ · จำขั้นสูงสุดที่เคยถึง ไม่ลด
// ลงซ้ำ = +1 ขั้น · ลงด้วยขั้นที่อัปถึงในชาติ (lv) สูงกว่า = ได้ขั้นนั้น
function skillBookAdd(book, id, lv = 1) {
  if (!ISEKAI_SKILLS[id]) throw new Error(`ไม่รู้จักสกิล ${id}`);
  const was = book?.[id] ?? 0;
  const to = Math.min(SKILL.top, Math.max(was ? was + 1 : 1, lv));
  return { book: { ...book, [id]: to }, up: to > was };
}
const bookCarryOffers = (book) => Object.keys(ISEKAI_SKILLS).filter((id) => book?.[id] > 0).map((id) => ({ id, name: ISEKAI_SKILLS[id].name, desc: ISEKAI_SKILLS[id].desc, lv: book[id] }));
// ชุดที่พกไปชาติใหม่ · ทุกตัวเริ่มขั้น 1 แม้คลังจำขั้นสูงกว่า (isd-1) · cap = ขั้นในคลังที่การ์ดอัปเกรดเร่งไปถึงได้ เก็บเฉพาะ > 1
function carryPick(ids = [], book = {}) {
  if (ids.length > SKILL.carry) throw new Error(`พกได้ไม่เกิน ${SKILL.carry} อย่าง`);
  if (new Set(ids).size !== ids.length) throw new Error('พกสกิลซ้ำ');
  for (const id of ids) if (!ISEKAI_SKILLS[id]) throw new Error(`ไม่รู้จักสกิล ${id}`);
  return ids.map((id) => ({ id, lv: 1, ...(book?.[id] > 1 && { cap: Math.min(SKILL.top, book[id]) }) }));
}
// อัปเกรดหนึ่งครั้ง: ยังต่ำกว่าขั้นในคลัง = ขึ้นทีละ 2 แต่ไม่เกินขั้นคลัง (Q2 ก) · ถึงแล้วขึ้นทีละ 1
const skillUp = (lv, cap = 1) => Math.min(SKILL.top, lv < cap ? Math.min(cap, lv + 2) : lv + 1);
const SKILL_UP = { title: 'ฝีมือที่คมขึ้น', text: 'เรื่องที่ผ่านมาทำให้ของที่ติดตัวมาคมขึ้นอีกขั้น จะฝึกอย่างไหน', pass: 'ยังไม่ฝึกตอนนี้', top: 'ขั้นสูงสุดแล้ว' };
// ปุ่มการ์ดอัปเกรด = สกิลที่ถือเรียงตามลำดับที่ได้ + ปุ่มผ่านท้ายสุด · ขั้นสูงสุดแล้ว = ล็อก ⇒ ปุ่มผ่านกดได้เสมอ การ์ดไม่ค้าง
const upgradeOffer = (held) => ({
  choices: [...held.map((s) => `${ISEKAI_SKILLS[s.id].name} · ขั้น ${s.lv}${s.lv < SKILL.top ? ` → ${skillUp(s.lv, s.cap)}` : ''}`), SKILL_UP.pass],
  desc: [...held.map((s) => ISEKAI_SKILLS[s.id].desc), ''],
  fx: [...held.map(() => ''), ''],
  locked: [...held.map((s) => (s.lv >= SKILL.top ? SKILL_UP.top : null)), null],
});
// ขั้นที่อัปในชาติต่างโลกกลับลงชุดที่พกของชีวิตไทย — ชาติต่างโลกถัดไป/ช่วงที่เหลือของชีวิตไทยใช้ขั้นนั้นต่อ · ของขวัญประจำชาติไม่ติดกลับ
const skillsBack = (skills, isk) => skills.map((s) => ({ ...s, lv: skillLv(isk, s.id) }));

const ISEKAI_WORLDS = {
  hero: {
    name: 'ผู้กล้าที่ถูกอัญเชิญ', pitch: 'ถูกเรียกมาพร้อมคนแปลกหน้าอีกสามคนจากโลกเดิม พระราชาขอให้ปราบจอมมาร',
    goal: 'เส้นทางสู่จอมมาร', start: { str: 12, mag: 10, cha: 9, luk: 8, gold: 100 },
    names: ['ผู้กล้า{p}', 'อัศวินแห่งแสง {p}', '{p} ผู้ถูกเลือก'], intro: 'h0', finale: 'h9', special: ['peacewin', 'peace'],
    end: {
      best: ['ผู้กล้าผู้กอบกู้โลก', 'จอมมารล้มลงกลางห้องบัลลังก์ดำ เสียงระฆังดังทั่วทวีป ชื่อคุณถูกสลักไว้บนกำแพงเมืองหลวง'],
      peace: ['ผู้กล้าผู้ยุติสงครามพันปี', 'ไม่มีใครต้องตาย จอมมารจับมือกับพระราชาต่อหน้าทั้งสองกองทัพ เด็ก ๆ ทั้งสองเผ่าโตมาโดยไม่รู้จักสงคราม'],
      good: ['ผู้กล้าที่รอดกลับมา', 'จอมมารยังไม่ตาย แต่คุณทำให้มันถอยไปได้อีกร้อยปี ได้บ้านหลังเล็กกับเบี้ยบำนาญที่พอใช้'],
      bad: ['ผู้กล้าที่ถูกลืม', 'อาณาจักรอัญเชิญผู้กล้าคนใหม่มาแทน คุณกลายเป็นนักผจญภัยแรงค์ C ที่เล่าเรื่องเก่าในโรงเตี๊ยม'],
    },
  },
  noble: {
    name: 'ลูกขุนนางบ้านนอก', pitch: 'เกิดใหม่เป็นลูกชายคนที่สามของบารอนชายแดน จำชาติก่อนได้ทุกอย่าง',
    goal: 'ชื่อเสียงตระกูล', start: { str: 9, mag: 12, cha: 10, luk: 9, gold: 200 },
    names: ['อัลเลน ฟอน ไฮเดล', 'ลูคัส เดอ วาลมอนต์', 'เอริค ฟอน เบิร์ก'], intro: 'n0', finale: 'n9', special: ['princess', 'princess'],
    end: {
      best: ['ดยุคคนใหม่แห่งอาณาจักร', 'จากลูกคนที่สามที่ไม่มีใครคาดหวัง คุณได้ดินแดนครึ่งภาคเหนือ ชาวบ้านเรียกยุคนี้ว่ายุคทอง'],
      princess: ['ราชบุตรเขยผู้ปฏิรูปแผ่นดิน', 'เจ้าหญิงที่เคยปลอมตัวมาเรียนจับมือคุณขึ้นยืนข้างบัลลังก์ อาณาจักรได้ทั้งระบบชลประทานและโรงเรียนสำหรับสามัญชน'],
      good: ['ลอร์ดผู้ครองเมืองชายแดน', 'ได้ตำแหน่งเจ้าเมืองเล็ก ๆ ที่ข้าวออกรวงดีที่สุดในแคว้น พี่ชายคนโตยอมรับคุณในที่สุด'],
      bad: ['ลูกขุนนางผู้เกือบดัง', 'ชื่อคุณเกือบถูกจารึก แต่ประวัติศาสตร์จำแค่ชื่อพี่ชาย คุณกลับไปเลี้ยงแกะที่ชายแดน ซึ่งก็ไม่แย่เท่าไร'],
    },
  },
  monster: {
    name: 'เกิดเป็นสไลม์', pitch: 'ลืมตาไม่ได้ เพราะไม่มีตา ไม่มีแขน ไม่มีขา คุณเป็นสไลม์ในถ้ำชื้น ๆ',
    goal: 'วิวัฒนาการ', start: { str: 8, mag: 11, cha: 8, luk: 11, gold: 0 },
    names: ['สไลม์ชื่อ{p}', '{p} เดอะ สไลม์', 'สไลม์ฟ้า{p}'], intro: 'm0', finale: 'm9', special: ['devour', 'devour'],
    end: {
      best: ['จอมมารผู้ใจดี', 'สหพันธ์มอนสเตอร์ของคุณมีถนน มีโรงอาบน้ำ และมีสนธิสัญญากับมนุษย์ทุกอาณาจักร คนเรียกคุณว่าจอมมาร แต่เด็ก ๆ เรียกว่าท่านสไลม์'],
      devour: ['ผู้กลืนกินโลก', 'สองกองทัพหายไปในร่างคุณ สงครามจบ เพราะไม่เหลือใครให้รบ ทุกอาณาจักรส่งเครื่องบรรณาการมาให้ด้วยความกลัว'],
      good: ['นายท่านของหมู่บ้านก็อบลิน', 'หมู่บ้านเล็กกลางป่าที่ทุกตัวมีชื่อ มีแปลงผัก และมีคุณนอนแผ่อยู่กลางลาน'],
      bad: ['สไลม์ธรรมดาที่เคยฝัน', 'คุณกลับไปอยู่ถ้ำเดิม ดูดตะไคร่เงียบ ๆ บางคืนยังฝันถึงตึกสูงกับข้าวมันไก่'],
    },
  },
  villainess: {
    name: 'นางร้ายในเกมจีบหนุ่ม', pitch: 'ตื่นมาเป็นท่านหญิงเรเวียน่า อายุ 8 ขวบ ในเกมที่เคยเล่นจบ ทุกเส้นทางของนางร้ายจบที่ถูกเนรเทศหรือแย่กว่านั้น',
    goal: 'หนีธงหายนะ', start: { str: 7, mag: 11, cha: 13, luk: 9, gold: 500 },
    names: ['ท่านหญิงเรเวียน่า', 'เลดี้เรเวียน่า', 'เรเวียน่า ฟอน โรเซนเบิร์ก'], intro: 'v0', finale: 'v9', special: ['heroine', 'heroine'],
    end: {
      best: ['ท่านหญิงผู้หักธงทุกเส้น', 'งานเต้นรำจบโดยไม่มีใครถูกประหาร คุณถอนหมั้นอย่างสง่างาม แล้วเปิดบริษัทการค้าที่ใหญ่ที่สุดในเมืองหลวง'],
      heroine: ['เพื่อนรักของนางเอก', 'นางเอกยืนข้างคุณต่อหน้าทุกคน เกมต้นฉบับไม่เคยมีฉากนี้ ทั้งสองไปเรียนต่อต่างแดนด้วยกัน'],
      good: ['นางร้ายผู้ทำฟาร์มสุขสันต์', 'ถูกส่งไปอยู่บ้านพักชายแดนตามบท แต่คุณปลูกผัก เลี้ยงไก่ และมีความสุขกว่าตอนอยู่วังทุกวัน'],
      bad: ['ธงหายนะทำงาน', 'บทเดิมเดินตามทุกฉาก คุณถูกส่งไปอารามบนเขาเย็นเฉียบ อย่างน้อยแม่ชีที่นั่นใจดี'],
    },
  },
  slowlife: {
    name: 'สโลว์ไลฟ์ชายป่า', pitch: 'เทพธิดาส่งคุณมาผิดคิว เลยชดเชยด้วยบ้านเล็กชายป่ากับคำสัญญาว่าจะได้อยู่สบาย ๆ',
    goal: 'ร้านในฝัน', start: { str: 9, mag: 9, cha: 12, luk: 12, gold: 150 },
    names: ['คุณ{p}แห่งชายป่า', 'เจ้าของร้าน{p}', 'แม่ครัว{p}'], intro: 's0', finale: 's9', special: ['fenrir', 'fenrir'],
    end: {
      best: ['เจ้าของร้านในตำนาน', 'ร้านเล็กชายป่ามีคิวยาวถึงเมืองหลวง มังกรตัวนั้นกลายเป็นลูกค้าประจำทุกวันพุธ'],
      fenrir: ['ผู้เลี้ยงหมาป่าเทพ', 'เฟนรีร์นอนเฝ้าหน้าร้าน ไม่มีโจรกล้าเข้าใกล้หมู่บ้านอีกเลย คุณได้นอนกลางวันทุกวันโดยไม่ต้องล็อกประตู'],
      good: ['ชีวิตชายป่าที่อบอุ่น', 'ร้านไม่ใหญ่ แต่ลูกค้าประจำรู้จักชื่อคุณ ตอนเย็นนั่งดูพระอาทิตย์สองดวงตกพร้อมชาร้อน'],
      bad: ['สโลว์ไลฟ์ที่ไม่สโลว์', 'ร้านปิด หมู่บ้านต้องย้าย คุณไปตั้งแผงข้าวไข่เจียวใหม่ในเมืองที่ไม่มีใครรู้จักชื่อร้าน'],
    },
  },
};
const ISEKAI_DEATH = ['ตายอีกครั้งในต่างโลก', 'ร่างนี้จากไปกลางทาง เทพธิดาถอนหายใจยาว แล้วหยิบแฟ้มของคุณขึ้นมาอีกรอบ'];
// ตายกลางทางเล่าตามโลกที่เลือก · โลกที่ไม่มีในนี้ใช้ข้อความกลางข้างบน
const ISEKAI_DEATH_BY = {
  hero: 'ผู้กล้าล้มลงกลางสนามรบ ดาบที่พระราชาให้มายังไม่ทันได้ลับเลย เทพธิดาถอนหายใจยาว แล้วหยิบแฟ้มของคุณขึ้นมาอีกรอบ',
  noble: 'ตระกูลจัดงานศพสมฐานะ คนที่ร้องไห้จริง ๆ มีแค่แม่นมคนเดียว เทพธิดาถอนหายใจยาว แล้วหยิบแฟ้มของคุณขึ้นมาอีกรอบ',
  monster: 'ร่างสไลม์แตกเป็นหยดเล็ก ๆ ก็อบลินตัวหนึ่งนั่งเฝ้าแอ่งนั้นอยู่ทั้งคืน เทพธิดาถอนหายใจยาว แล้วหยิบแฟ้มของคุณขึ้นมาอีกรอบ',
  villainess: 'เรื่องจบเร็วกว่าบทในเกมที่เคยเล่น หน้าสุดท้ายยังว่างอยู่ เทพธิดาถอนหายใจยาว แล้วหยิบแฟ้มของคุณขึ้นมาอีกรอบ',
  slowlife: 'บ้านเล็กชายป่าเงียบลง หมาป่าสีเงินนอนรออยู่หน้าประตูไม่ยอมไปไหน เทพธิดาถอนหายใจยาว แล้วหยิบแฟ้มของคุณขึ้นมาอีกรอบ',
  commoner: 'เสียงค้อนจากโรงตีเหล็กริมน้ำเงียบไปหลายวัน เพื่อนบ้านเอาดอกไม้มาวางไว้หน้าเตา เทพธิดาถอนหายใจยาว แล้วหยิบแฟ้มของคุณขึ้นมาอีกรอบ',
  merchant: 'เกวียนสินค้าจอดนิ่งอยู่ข้างทาง ม้าแก่ยังยืนรอคนบังคับ เทพธิดาถอนหายใจยาว แล้วหยิบแฟ้มของคุณขึ้นมาอีกรอบ',
  elf: 'ต้นไม้ในป่าลึกทิ้งใบพร้อมกันทั้งป่าในคืนเดียว เอลฟ์รุ่นพี่บอกว่าป่ากำลังไว้ทุกข์ เทพธิดาถอนหายใจยาว แล้วหยิบแฟ้มของคุณขึ้นมาอีกรอบ',
  dwarf: 'เมืองใต้ภูเขาตีระฆังหินสามครั้ง ค้อนของคุณถูกแขวนไว้บนกำแพงห้องโถง เทพธิดาถอนหายใจยาว แล้วหยิบแฟ้มของคุณขึ้นมาอีกรอบ',
  goblin: 'ก็อบลินทั้งรังนั่งล้อมกองไฟเงียบ ๆ ไม่มีใครแย่งกระดูกกันคืนนั้น เทพธิดาถอนหายใจยาว แล้วหยิบแฟ้มของคุณขึ้นมาอีกรอบ',
  demonchild: 'ปราสาทมืดลดธงครึ่งเสา จอมมารผู้เป็นพ่อนั่งเงียบอยู่บนบัลลังก์ทั้งคืน เทพธิดาถอนหายใจยาว แล้วหยิบแฟ้มของคุณขึ้นมาอีกรอบ',
};

// บทบาทตอนเกิด (B68b · เจ้าของเคาะ): สุ่มตามโอกาส p เอียงตามกรรม (lean +1 = บุญมากเจอบ่อยขึ้น · −1 = บาปมากเจอบ่อยขึ้น) แล้วเทพธิดายื่นให้เลือก
// world = บทบาทนี้เล่นเนื้อเรื่องของโลกนั้น (ฉากเปิด ฉากสุดท้าย ตอนจบ) · like = บทบาทที่ไม่มีเนื้อเรื่องของตัวเอง ยืมเหตุการณ์กลางที่โลกนั้นเจอ
// startAge/finaleAge = อายุก่อนคูณ pace · finaleAge = อายุที่ฉากสุดท้ายของเนื้อเรื่องมาถึง · focus = สิ่งที่ทุ่มเทเฉพาะบทบาท ดันค่าเป้าหมาย
// commoner อยู่ในการ์ดที่ยื่นเสมอ (เจ้าของเคาะ: ต้องมีคนธรรมดามีอาชีพ 1 ใบ)
const ISEKAI_ROLES = {
  hero: { world: 'hero', p: 6, lean: 1, startAge: 17, finaleAge: 25, focus: { name: 'ตามหาทางไปปราสาทจอมมาร', gain: { goal: 1.5, str: 0.3 }, tag: 'fight' } },
  noble: { world: 'noble', p: 14, lean: 1, startAge: 0, finaleAge: 18, focus: { name: 'เรียนงานปกครองที่ดิน', gain: { goal: 1.5, cha: 0.3 }, tag: 'talk' } },
  monster: { world: 'monster', p: 8, lean: -1, startAge: 0, finaleAge: 15, focus: { name: 'ดูดซับแล้ววิวัฒน์', gain: { goal: 1.5, str: 0.3 }, tag: 'fight' } },
  villainess: { world: 'villainess', p: 5, lean: 0, startAge: 8, finaleAge: 18, focus: { name: 'หักธงหายนะทีละธง', gain: { goal: 1.5, mag: 0.3 }, tag: 'appraise' } },
  slowlife: { world: 'slowlife', p: 8, lean: 0, startAge: 20, finaleAge: 30, focus: { name: 'ดูแลร้านชายป่า', gain: { goal: 1.5, gold: 20 }, tag: 'cook' } },
  commoner: {
    p: 25, lean: 0, like: 'slowlife', startAge: 0,
    name: 'ชาวบ้านมีอาชีพ', pitch: 'เกิดในบ้านช่างตีเหล็กริมแม่น้ำ ไม่มีใครอัญเชิญ ไม่มีคำทำนาย มีแค่เตาไฟกับค้อนของพ่อ',
    goal: 'ชีวิตที่มั่นคง', stat: { str: 10, mag: 8, cha: 10, luk: 10, gold: 50 },
    names: ['{p} ลูกช่างเหล็ก', 'ช่าง{p}', '{p} แห่งริมน้ำ'],
    focus: { name: 'ช่วยงานโรงตีเหล็ก', gain: { goal: 1.5, gold: 15, str: 0.3 }, tag: 'trade' },
    end: {
      best: ['ช่างใหญ่แห่งริมน้ำ', 'ดาบจากโรงตีเหล็กของคุณผ่านมือผู้กล้ามาสามรุ่น ลูกศิษย์สิบกว่าคนไปเปิดโรงของตัวเองทั่วแคว้น'],
      good: ['ช่างเหล็กที่ทั้งหมู่บ้านพึ่งได้', 'จอบ เคียว เกือกม้าของทุกบ้านผ่านมือคุณ ไม่ดัง แต่ไม่มีใครเดือดร้อนเพราะคุณ'],
      bad: ['ชาวบ้านธรรมดาคนหนึ่ง', 'โรงตีเหล็กปิดตั้งแต่พ่อตาย คุณรับจ้างทั่วไปจนแก่ ชื่อคุณอยู่ในความจำของคนในหมู่บ้านได้ไม่นาน'],
    },
  },
  merchant: {
    p: 13, lean: 0, like: 'noble', startAge: 0,
    name: 'ลูกพ่อค้าเร่', pitch: 'โตบนเกวียนสินค้าที่วิ่งระหว่างเมือง พ่อสอนนับเงินก่อนสอนอ่าน',
    goal: 'กองคาราวาน', stat: { str: 8, mag: 9, cha: 12, luk: 11, gold: 300 },
    names: ['{p} ลูกพ่อค้า', 'นายห้าง{p}', '{p} แห่งคาราวาน'],
    focus: { name: 'ตามพ่อไปค้าขาย', gain: { goal: 1.5, gold: 30 }, tag: 'trade' },
    end: {
      best: ['เจ้าของคาราวานร้อยเกวียน', 'ธงของห้างคุณปักอยู่ทุกตลาดตั้งแต่ทะเลทรายถึงเมืองท่า พระราชายังต้องมากู้เงินคุณตอนสงคราม'],
      good: ['พ่อค้าที่ทุกเมืองไว้ใจ', 'คาราวานสิบเกวียน ลูกค้าประจำทุกเมือง คนเชื่อตาชั่งของคุณมากกว่าตาชั่งหลวง'],
      bad: ['พ่อค้าเร่ที่ขายไม่ออก', 'เกวียนเหลือคันเดียวกับม้าแก่หนึ่งตัว แต่ของในเกวียนยังพอแลกข้าวได้ทุกเมือง'],
    },
  },
  elf: {
    p: 9, lean: 1, like: 'hero', startAge: 0, pace: 3,
    name: 'เอลฟ์ป่าลึก', pitch: 'เกิดเป็นเอลฟ์ในป่าที่ต้นไม้อายุเป็นพันปี เวลาของเอลฟ์เดินช้ากว่ามนุษย์สามเท่า',
    goal: 'สายใยกับป่า', stat: { str: 8, mag: 13, cha: 11, luk: 9, gold: 20 },
    names: ['เอลฟ์ชื่อ{p}', '{p}แห่งป่าลึก', 'ลีเรียน{p}'],
    focus: { name: 'ฟังเสียงป่า', gain: { goal: 1.5, mag: 0.3 }, tag: 'magic' },
    end: {
      best: ['ผู้พิทักษ์ป่าพันปี', 'ป่าที่คุณดูแลขยายจนถึงเชิงเขา มนุษย์สามอาณาจักรเซ็นสัญญาว่าจะไม่ตัดไม้ในเขตนี้ตลอดไป'],
      good: ['เอลฟ์ที่มนุษย์จำได้', 'คุณเห็นหมู่บ้านมนุษย์ข้างป่าเปลี่ยนไปสิบรุ่น ทุกรุ่นยังเล่าเรื่องเอลฟ์ที่มาช่วยตอนน้ำท่วม'],
      bad: ['เอลฟ์ผู้เหงาในป่าใหญ่', 'ร้อยปีผ่านไปโดยแทบไม่ได้คุยกับใคร คุณรู้จักชื่อต้นไม้ทุกต้น แต่จำหน้าเพื่อนสมัยเด็กไม่ได้แล้ว'],
    },
  },
  dwarf: {
    p: 8, lean: 0, like: 'slowlife', startAge: 0,
    name: 'คนแคระเหมืองหิน', pitch: 'เกิดใต้ภูเขาในเมืองคนแคระ ที่นี่วัดค่าคนจากของที่ตีขึ้นมาได้',
    goal: 'ผลงานในตำนาน', stat: { str: 13, mag: 7, cha: 8, luk: 10, gold: 120 },
    names: ['{p} ลูกเหมือง', 'คนแคระ{p}', '{p} เคราเหล็ก'],
    focus: { name: 'ขุดเหมืองกับตีเหล็ก', gain: { goal: 1.5, str: 0.3, gold: 15 }, tag: 'fight' },
    end: {
      best: ['ช่างผู้ตีขวานราชา', 'ขวานที่คุณตีถูกวางไว้กลางห้องโถงใหญ่ คนแคระทุกรุ่นต่อจากนี้ต้องมาแตะมันก่อนเริ่มงานชิ้นแรก'],
      good: ['หัวหน้าเหมืองชั้นลึก', 'เหมืองของคุณไม่เคยถล่มสักครั้ง ลูกน้องทุกคนกลับบ้านครบทุกเย็น'],
      bad: ['คนแคระที่เคราไม่ยาว', 'ตีอะไรก็ไม่เคยถูกใจผู้อาวุโส คุณย้ายไปเปิดโรงซ่อมกระทะในเมืองมนุษย์ และขายดีกว่าที่คิด'],
    },
  },
  goblin: {
    p: 8, lean: -1, like: 'monster', startAge: 0,
    name: 'ก็อบลินตัวเล็ก', pitch: 'เกิดเป็นก็อบลินตัวที่สามสิบสองของรัง ตัวเล็กที่สุดและหิวที่สุด',
    goal: 'รังที่อยู่รอด', stat: { str: 9, mag: 8, cha: 7, luk: 12, gold: 0 },
    names: ['ก็อบลินชื่อ{p}', '{p} ตัวจิ๋ว', 'โกบู{p}'],
    // ออกหาอาหารเสี่ยงเจอนักล่า — HP ลดเร็วกว่าที่ฟื้น ก็อบลินที่ทุ่มให้รังจึงอายุสั้นตามเรื่อง
    focus: { name: 'หาอาหารให้รัง', gain: { goal: 1.5, luk: 0.3, hp: -3 }, tag: 'sneak' },
    end: {
      best: ['หัวหน้าเผ่าก็อบลินที่มนุษย์ยอมคุยด้วย', 'รังของคุณเลิกปล้นแล้วหันมาปลูกเห็ดขาย มนุษย์หมู่บ้านข้าง ๆ มาซื้อทุกตลาดนัด'],
      good: ['ก็อบลินแก่ที่สุดในรัง', 'ก็อบลินส่วนใหญ่อยู่ไม่ถึงสิบปี คุณอยู่จนหลานเหลนเต็มรัง และทุกตัวฟังคุณเวลาเล่าเรื่อง'],
      bad: ['ก็อบลินธรรมดาตัวหนึ่ง', 'คุณหนีนักผจญภัยมาทั้งชีวิต รอดมาได้เพราะตัวเล็กพอจะมุดรูที่คนอื่นมุดไม่ได้'],
    },
  },
  demonchild: {
    p: 4, lean: -1, like: 'monster', startAge: 0,
    name: 'ลูกจอมมาร', pitch: 'เกิดเป็นลูกคนเล็กของจอมมาร ทุกคนรอดูว่าจะโหดกว่าพ่อแค่ไหน แต่คุณยังจำได้ว่าชาติก่อนกลัวแมลงสาบ',
    goal: 'บัลลังก์มืด', stat: { str: 11, mag: 13, cha: 9, luk: 7, gold: 400 },
    names: ['องค์ชายมืด{p}', '{p} ผู้สืบสายจอมมาร', 'องค์ชาย{p}'],
    focus: { name: 'เรียนวิชาสายจอมมาร', gain: { goal: 1.5, mag: 0.3 }, tag: 'magic' },
    end: {
      best: ['จอมมารผู้เปิดพรมแดน', 'คุณขึ้นบัลลังก์แล้วสั่งเปิดด่านค้าขายกับมนุษย์เป็นอย่างแรก ทหารปีศาจได้กลับบ้านหลังสงครามสามร้อยปี'],
      good: ['องค์ชายที่ปีศาจรัก', 'บัลลังก์ตกเป็นของพี่ชาย แต่ปีศาจทั้งเมืองมาหาคุณเวลามีเรื่องเดือดร้อน ไม่มีใครไปหาพี่ชาย'],
      bad: ['ลูกจอมมารที่ถูกลืม', 'พี่น้องแย่งบัลลังก์กันจนไม่มีใครสนใจคุณ คุณย้ายไปอยู่หอคอยชายแดนกับแมวดำหนึ่งตัว'],
    },
  },
};
// ชาติใหม่เกิดในทวีปเอเธอร์การ์ด (06b): แคว้น + เผ่า แทนบทบาท · ไม่มีเป้าหมาย/ฉากเปิด/ฉากจบ · ชาติเก่าในเซฟ (มี role) เดินเส้นบทบาทจนจบ
// ค่าที่ผู้รวมงานรับแทนเจ้าของตามค่าแนะนำ (รอเคาะเช้า) รวมที่นี่จุดเดียว:
// world = ถังความทรงจำ/ตำนานของทั้งทวีป · name = คำนำชื่อบนผังตระกูล ("เอเธอร์การ์ด · <แคว้น>") · offers = แฟ้มเกิดที่เทพธิดายื่น (กรรมไม่เอียง)
// tripRace = เผ่าของทริปจากโลกหลัก (ลงแคว้นสุ่ม) · like = บทบาทที่ยืมทองเริ่มกับชุดชื่อ · fame = ชื่อเสียงที่ตอนจบนับว่าดัง
const CONT_LIFE = { world: 'aethergard', name: 'เอเธอร์การ์ด', offers: 3, tripRace: 'human', like: 'commoner', fame: 30 };
// ย้ายแคว้น (06c-1 · เจ้าของเคาะ): สำรวจดินแดนครบ years ปีเต็มนับจากเกิด/ทางแยกครั้งก่อน ⇒ ใบทางแยกยื่นแคว้นติดกันสุ่ม ≤ offers + อยู่ที่เดิม
// ปีเต็มยืม focusYears.explore (กติกาเดียวกับอาชีพ) แต่นับจากหลักที่จดไว้ตอนทางแยก — focusYears สะสมทั้งชาติ ใช้ตรง ๆ ใบจะมาทุกปีหลังครบครั้งแรก
// ไม่ย้ายก็นับใหม่ ⇒ ใบไม่ตามจี้ทุกปี · ชาติเก่า (มีบทบาท) ไม่มีแคว้นจึงไม่มีใบนี้
const CONT_MOVE = { focus: 'explore', years: 2, offers: 3, event: 'cont_move' };
// ตอนจบชาติทวีป: ยังไม่มีเป้าหมาย (05b จบตามสายที่ไกลสุด) — ดังถึงเกณฑ์และมีอาชีพ / อย่างใดอย่างหนึ่ง / ไม่มีทั้งคู่ · {job} = อาชีพแรก · {land} = แคว้น
const CONT_END = {
  best: ['{job}ผู้เลื่องชื่อแห่ง{land}', 'ชื่อของคุณถูกเล่าต่อในโรงเตี๊ยมทั่ว{land} คนรุ่นหลังยังเอ่ยถึงเวลาพูดถึงยุคนั้น'],
  good: ['{job}แห่ง{land}', 'ไม่ได้ดังไปทั้งทวีป แต่คนใน{land}รู้ว่าถ้ามีเรื่องต้องพึ่งใคร ให้ไปหาคุณ'],
  bad: ['ชาวบ้านธรรมดาแห่ง{land}', 'ใช้ชีวิตเงียบ ๆ ใน{land} ไม่มีใครรู้ว่าคุณข้ามมาจากโลกอื่น และคุณก็ไม่เคยเล่าให้ใครฟัง'],
};
// ชื่อ เป้าหมาย ตอนจบของบทบาท — บทบาทที่เล่นเนื้อเรื่องของโลกใช้ของโลกนั้น
const roleInfo = (id) => {
  const r = ISEKAI_ROLES[id];
  return r.world ? { ...ISEKAI_WORLDS[r.world], ...r, stat: ISEKAI_WORLDS[r.world].start } : r;
};

// ช่วงวัยของชาติต่างโลก · ch = ชั้นเหตุการณ์ (ช่อง ch ของ ISEKAI_EVENTS) ที่สุ่มได้ในช่วงนี้ · rate = ความไวในการฝึก
const ISEKAI_STAGES = [
  { id: 'child', name: 'วัยเด็ก', from: 0, ch: [1], rate: 1.2 },
  { id: 'teen', name: 'วัยรุ่น', from: 13, ch: [1, 2], rate: 1.1 },
  { id: 'adult', name: 'วัยผู้ใหญ่', from: 20, ch: [2, 3], rate: 1 },
  { id: 'middle', name: 'วัยกลางคน', from: 40, ch: [3], rate: 0.7 },
  { id: 'old', name: 'วัยชรา', from: 60, ch: [3], rate: 0.4 },
];

// สิ่งที่ทุ่มเท (B68b): ค้างข้ามตาจนกว่าจะเปลี่ยน · gain = ค่าที่ได้ต่อปีก่อนคูณความไว · tag = สายเหตุการณ์ที่โผล่บ่อยขึ้น
// joy/wit = ความสุข/ความรู้ ค่าภายในที่ไม่ขึ้นหน้าต่างสถานะ (เจ้าของเคาะ) · สุขดีฝึกไวและแก่ช้า · รู้มากฝึกเวทไว
// lines = บรรทัดจดหมายเหตุของปีที่ทุ่มเทเรื่องนี้ (เลือกตามอายุ ไม่ดึงเลขสุ่ม)
const ISEKAI_FOCUS = {
  play: { name: 'วิ่งเล่นตามประสาเด็ก', stages: ['child'], gain: { hp: 2, joy: 5, luk: 0.5 }, tag: 'sneak',
    lines: ['วิ่งไล่จับแมลงปอจนตะวันตกดิน', 'ปีนต้นไม้หลังบ้านจนแม่ตะโกนเรียก', 'แอบไปเล่นน้ำที่ลำธารกับเด็กข้างบ้าน'] },
  sword: { name: 'ฝึกดาบ', gain: { str: 1, joy: -1 }, tag: 'fight',
    lines: ['ฟันหุ่นฟางทุกเช้าจนมือพอง', 'ขอให้ทหารยามสอนท่าตั้งรับ', 'ซ้อมจนดาบไม้หักไปอีกเล่ม'] },
  magic: { name: 'ฝึกเวท', gain: { mag: 1 }, tag: 'magic', wit: true,
    lines: ['นั่งสมาธิรวบรวมมานาทุกคืน', 'จุดไฟด้วยนิ้วได้นานขึ้นอีกนิด', 'ท่องคาถาจนเพื่อนบ้านบ่นว่าหนวกหู'] },
  people: { name: 'คบหาผู้คน', gain: { cha: 1, joy: 2 }, tag: 'talk',
    lines: ['นั่งคุยกับคนแปลกหน้าในโรงเตี๊ยมจนดึก', 'ไปช่วยงานบวชงานแต่งทั่วหมู่บ้าน', 'มีเพื่อนใหม่มากินข้าวที่บ้านทุกอาทิตย์'] },
  roam: { name: 'ออกเดินทางเสี่ยงโชค', stages: ['teen', 'adult', 'middle'], gain: { luk: 1, hp: -4, gold: 15, joy: 1 }, tag: 'sneak',
    lines: ['เดินทางข้ามเขาไปเมืองที่ไม่เคยไป', 'หลงทางในป่าสามวัน แต่เจอทางลัดใหม่', 'นอนกลางดินกินกลางทรายตามคาราวาน'] },
  // know = ความรู้โลกเดิมของหมวดที่แตะล่าสุด (ค่าเดียวกับ ISEKAI_KNOW_T.study · ประกาศทีหลังจึงอ้างตรงไม่ได้)
  study: { name: 'อ่านตำรา', gain: { wit: 2, mag: 0.3, know: 1.5 }, tag: 'appraise',
    lines: ['ยืมตำราจากหอสมุดจนบรรณารักษ์จำหน้าได้', 'จดสิ่งที่จำได้จากโลกเดิมลงสมุดเล่มหนา', 'อ่านแผนที่เก่าจนจำชื่อเมืองได้ทั้งทวีป'] },
  work: { name: 'ทำงานหาเงิน', stages: ['teen', 'adult', 'middle', 'old'], gain: { gold: 40, joy: -2 }, tag: 'trade',
    lines: ['รับจ้างแบกของที่ท่าเรือทั้งปี', 'ทำงานที่โรงเตี๊ยมจนรู้จักลูกค้าทุกคน', 'เก็บเงินได้อีกถุงหนึ่ง'] },
  rest: { name: 'พักผ่อนอยู่บ้าน', gain: { hp: 6, joy: 6 },
    lines: ['นอนตื่นสาย จิบชาร้อนดูฝนตก', 'ปลูกผักหน้าบ้านกับเลี้ยงไก่สามตัว', 'ปีนี้ไม่ได้ทำอะไรนอกจากพักให้หายเหนื่อย'] },
  // 5 ตัวใหม่ (05a · เจ้าของเคาะชุดแนะนำ) ต่อท้าย ⇒ ลำดับตัวเดิมบนใบทุ่มเทไม่เลื่อน · merit = บุญต่อปีเต็มที่ทุ่มเท
  fame: { name: 'สร้างชื่อเสียง', gain: { cha: 1, fame: 0.5 }, tag: 'talk',
    lines: ['รับงานที่คนอื่นไม่กล้ารับจนชื่อไปถึงเมืองข้าง ๆ', 'เล่าเรื่องตัวเองในโรงเตี๊ยมจนนักกวีเอาไปแต่งเพลง', 'ไปทุกงานเลี้ยงที่ขุนนางเชิญ'] },
  mate: { name: 'หาคู่', stages: ['teen', 'adult', 'middle'], gain: { cha: 0.5, joy: 3 }, tag: 'talk',
    lines: ['แต่งตัวไปงานเทศกาลทุกงาน', 'เขียนจดหมายถึงคนที่แอบชอบแต่ไม่กล้าส่ง', 'ไปนั่งร้านเดิมทุกเย็นเผื่อเจอคนเดิม'] },
  kin: { name: 'ดูแลครอบครัว', stages: ['adult', 'middle', 'old'], gain: { hp: 3, joy: 4 },
    lines: ['ซ่อมหลังคาบ้านก่อนหน้าฝน', 'สอนเด็ก ๆ ในบ้านอ่านหนังสือทุกค่ำ', 'ทำอาหารมื้อใหญ่ให้ทั้งบ้านทุกวันหยุด'] },
  alms: { name: 'ทำทาน', gain: { gold: -20, fame: 0.3 }, merit: { cat: 'dana', level: 1 },
    lines: ['แบ่งขนมปังให้เด็กข้างถนนทุกเช้า', 'บริจาคทองให้วิหารซ่อมหลังคา', 'ตั้งหม้อซุปแจกคนเดินทางหน้าบ้าน'] },
  explore: { name: 'สำรวจดินแดน', stages: ['teen', 'adult', 'middle'], gain: { luk: 1, hp: -3 }, tag: 'sneak',
    lines: ['เดินตามแม่น้ำขึ้นไปจนสุดต้นน้ำ', 'วาดแผนที่หุบเขาที่ยังไม่มีใครวาด', 'ข้ามช่องเขาที่คนแถวนี้บอกว่าไม่มีทางผ่าน'] },
};

// อาชีพตามโฟกัส (05a): โฟกัสต้นทางรวมกันสะสมปีเต็มครบ years ⇒ ได้อาชีพนั้นติดตัวทั้งชาติ · ได้หลายอาชีพพร้อมกันได้ (เจ้าของเคาะ)
// ISEKAI_CAREER_T.years = chain_years ของโลกหลัก (content/rules/focus.yaml · เจ้าของเคาะใช้ค่าเดียวกัน — harness-test เทียบให้)
// gain = ผลต่อปีของอาชีพ คิดแบบเดียวกับทุ่มเท ซ้อนกับโฟกัสที่ถืออยู่ · เจ้าของเคาะชุด T1 = ราว ¼ ของโฟกัสต้นทาง
const ISEKAI_CAREER_T = { years: 3 };
const ISEKAI_CAREERS = {
  swordsman: { name: 'นักดาบ', from: ['sword'], gain: { str: 0.25 } },
  mage: { name: 'จอมเวท', from: ['magic'], gain: { mag: 0.25 } },
  merchant: { name: 'พ่อค้า', from: ['work', 'k:trade'], gain: { gold: 10 } },
  adventurer: { name: 'นักผจญภัย', from: ['roam', 'explore'], gain: { luk: 0.25 } },
  priest: { name: 'นักบวช', from: ['alms', 'k:medic'], gain: { fame: 0.1, hp: 1 } },
};

// การ์ดเตือน HP (B161): "เปลี่ยนโฟกัส" เปิดใบทุ่มเทกลางช่วงวัยที่ชี้ทางฟื้นชีวิต · ร้านเติมทีหลัง
const ISEKAI_WARN = {
  title: 'ใกล้ตาย',
  text: 'แผลเก่ายังไม่ทันหาย แผลใหม่ก็มาซ้ำ ลุกจากที่นอนแต่ละเช้ายากขึ้นทุกวัน ถ้ายังฝืนแบบนี้ต่อ ชาตินี้คงจบเร็วกว่าที่คิด',
  focus: 'เปลี่ยนโฟกัส',
  rest: 'rest',
  ask: 'ร่างกายต้องการพัก ช่วงนี้จะโฟกัสอะไร',
};

// ความรู้จากโลกเดิม (B68h · เจ้าของเคาะ): 9 หมวด เริ่มศูนย์ทุกหมวด เป็นค่าซ่อนแบบ joy/wit · โตจากเหตุการณ์ของหมวด + ทางลัดทุ่มเท + อ่านตำรา
// focus = ทางลัดทุ่มเทที่เปิดเมื่อความรู้หมวดนั้นถึง shortcut · know ใน gain = ความรู้ของหมวดนี้เอง · stages = ช่วงวัยที่ทางลัดเปิด
const ISEKAI_KNOW = {
  food: { name: 'อาหาร', focus: { name: 'เปิดร้านอาหารแบบบ้านเกิด', gain: { gold: 30, fame: 0.5, know: 1, joy: 1 },
    lines: ['ร้านเล็กหน้าบ้านขายหมดก่อนเที่ยงทุกวัน', 'ลองตำน้ำพริกด้วยพริกของโลกนี้จนได้สูตรใหม่', 'ลูกค้าประจำเริ่มสั่ง "แบบเดิม" โดยไม่ต้องดูเมนู'] } },
  farm: { name: 'เกษตร', focus: { name: 'ทำแปลงทดลองแบบบ้านเกิด', gain: { gold: 20, fame: 0.4, know: 1, hp: 1 },
    lines: ['ไถกลบตอซังแทนการเผา ดินร่วนขึ้นทุกปี', 'ชาวนาข้างแปลงแอบมาจดว่าคุณปลูกอะไรสลับกับอะไร', 'ขุดคูน้ำเล็ก ๆ รอบแปลง ปีนี้น้ำไม่ท่วม'] } },
  medic: { name: 'แพทย์และสุขอนามัย', focus: { name: 'รักษาคนแบบบ้านเกิด', gain: { gold: 15, fame: 0.6, know: 1, cha: 0.3 },
    lines: ['ต้มผ้าพันแผลทุกเช้าจนคนในตรอกทำตาม', 'ประคบร้อนให้ยายข้างบ้านจนเธอเดินได้ไกลขึ้น', 'สอนเด็ก ๆ ล้างมือก่อนกินข้าว แลกกับขนมคนละชิ้น'] } },
  trade: { name: 'การค้า', focus: { name: 'ค้าขายแบบบ้านเกิด', gain: { gold: 45, know: 1, joy: -1 },
    lines: ['จดบัญชีรับจ่ายทุกคืนจนรู้ว่าของชิ้นไหนกำไรจริง', 'ลดราคาของค้างร้านแบบเซลส์ปลายปี ของหมดเกลี้ยง', 'ทำบัตรสะสมแต้มจากแผ่นไม้ ลูกค้ากลับมาซื้อซ้ำ'] } },
  craft: { name: 'ช่าง', focus: { name: 'ประดิษฐ์ของแบบบ้านเกิด', gain: { gold: 20, str: 0.3, know: 1 },
    lines: ['ทำรอกชักน้ำให้บ่อกลางหมู่บ้าน', 'ลองหล่อตะปูให้ขนาดเท่ากันทุกตัว', 'นั่งแกะเฟืองไม้จนนิ้วเป็นแผลทั้งสิบนิ้ว'] } },
  print: { name: 'การพิมพ์และการศึกษา', focus: { name: 'สอนหนังสือแบบบ้านเกิด', gain: { fame: 0.5, know: 1, wit: 1, joy: 1 },
    lines: ['สอนเด็กสามคนอ่านป้ายร้านค้าได้', 'พิมพ์ตารางสูตรคูณแจกตามบ้าน', 'เขียนแบบเรียน ก ไก่ ฉบับโลกนี้ ใช้ตัวอักษรของที่นี่'] } },
  war: { name: 'การทหาร', stages: ['adult', 'middle', 'old'], focus: { name: 'ฝึกทหารแบบบ้านเกิด', gain: { str: 0.5, fame: 0.4, know: 1, joy: -1 },
    lines: ['สอนทหารยามเดินแถวกับวิ่งรอบค่ายตอนเช้า', 'จัดเสบียงเป็นห่อละมื้อแบบข้าวกล่อง', 'ซ้อมขนคนเจ็บด้วยเปลไม้ไผ่'] } },
  law: { name: 'การเมืองและกฎหมาย', focus: { name: 'ช่วยงานราชการแบบบ้านเกิด', gain: { gold: 20, cha: 0.3, know: 1 },
    lines: ['ทำแบบฟอร์มคำร้องให้ชาวบ้านกรอก ไม่ต้องต่อแถวรอพูด', 'จดบันทึกการประชุมหมู่บ้านทุกครั้ง', 'ช่วยนับคะแนนเลือกผู้ใหญ่บ้าน เปิดหีบต่อหน้าทุกคน'] } },
  fun: { name: 'บันเทิง', focus: { name: 'ทำเรื่องสนุกแบบบ้านเกิด', gain: { gold: 15, cha: 0.4, know: 1, joy: 4 },
    lines: ['สอนเด็ก ๆ เล่นเป่ายิ้งฉุบกับซ่อนหา', 'แต่งเพลงลูกทุ่งใส่คำของโลกนี้ คนฮัมตามทั้งตลาด', 'เปิดวงหมากฮอสหน้าบ้านทุกเย็น'] } },
};
// shortcut = ความรู้ที่ทางลัดทุ่มเทเปิด · wit = ส่วนของความรู้ทั่วไปที่ช่วยทุกหมวด
// w0/w = น้ำหนักในกองของเรื่องระลึก (ขั้น 0 · มี 9 เรื่อง เบาไว้ไม่ให้กลบเรื่องประจำโลก) / เรื่องขั้นลึก (มาเฉพาะคนที่รู้แล้ว จึงหนักได้)
// focusW = ทุ่มเททางลัดหมวดไหน เหตุการณ์หมวดนั้นโผล่บ่อยขึ้นกี่เท่า · loreFame = ชื่อเสียงตอนสำเร็จที่โลกจะจำ (สำเร็จ + คนยอมรับ)
// gainK = ยิ่งรู้มากยิ่งโตช้า แบบ ISEKAI_TIME.gainK · study = อ่านตำราเติมความรู้หมวดที่แตะล่าสุดเท่านี้ต่อปี
const ISEKAI_KNOW_T = { shortcut: 20, wit: 0.5, w0: 0.15, w: 0.8, focusW: 3, loreFame: 20, gainK: 30, study: 1.5 };
// ของที่โลกจำได้ — ชื่อสั้นสำหรับบรรทัดจดหมายเหตุของชาติถัดไปในโลกเดียวกัน
const ISEKAI_LORE = {
  fishsauce: 'น้ำปลา', rotation: 'นาสลับ', soap: 'สบู่กับการต้มน้ำ', ledger: 'บัญชีสองช่อง', waterwheel: 'กังหันน้ำ',
  school: 'โรงเรียนในโรงนา', gunpowder: 'ปืนใหญ่', court: 'ศาลที่มีพยาน', boardgame: 'หมากฮอส',
};
// ตำนานข้ามชาติ (B68i · เจ้าของเคาะ): ชาติที่จบด้วยชื่อเสียงถึง legend = โลกนั้นจำชื่อไว้ทั้งเซฟ
// คนร้าย = ชื่อเสียงที่ได้จากตัวเลือกที่ลงบาปเกินครึ่งของชื่อเสียงตอนจบ — นับจากสิ่งที่ผู้เล่นทำ ไม่อ่านยอดบัญชีซ่อน
// chaPer/chaCap = ตัวเลือกทอยบารมีได้ +1% ต่อชื่อเสียงทุก chaPer สูงสุด chaCap · dark = ยากขึ้นเท่านี้ในโลกที่จำคนร้ายมากกว่าวีรบุรุษ
// lines = บรรทัดตำนานบนใบทุ่มเทแรก เล่าแค่รุ่นล่าสุดเท่านี้ (เซฟยาวมีหลายสิบชาติ)
const ISEKAI_FAME = { legend: 20, chaPer: 5, chaCap: 10, dark: 10, lines: 2 };
// ยาต่ออายุ (B68k · เจ้าของเคาะ): ขวดละ years ปี (คูณจังหวะเวลาบทบาท) เพดานรวม cap ปีต่อชาติ · ขวดที่เกิน free = ฝืนธรรมชาติ บาปเล็ก
// ดื่มทันทีที่ได้ ไม่ส่งต่อชาติหน้า · bless = เรื่องที่มาเฉพาะคนที่กรรมเป็นบวกหรือเทพธิดาอารมณ์ดี
const ISEKAI_POTION = { years: 5, cap: 15, free: 2, level: 1 };

// stat ว่าง = ไม่ทอยเต๋า · need = ต้องมีทองถึงกดได้ · bonus/bonus2 = ธงที่ทำให้ง่ายขึ้น · flag ของตัวเลือกไม่ทอย = ติดทันที
const ISEKAI_EVENTS = [
  // ─── ผู้กล้า ───
  { id: 'h0', worlds: ['hero'], ch: [1], title: 'วงเวทกลางห้องบัลลังก์',
    text: 'แสงวงเวทจางลง คุณยืนอยู่กลางห้องหินอ่อน พระราชาเคราขาวประกาศว่า "ท่านคือผู้กล้าที่จะปราบจอมมาร" อีกสามคนข้างคุณยังงงไม่ต่างกัน',
    choices: [
      { t: '"ข้าจะเป็นผู้กล้า!"', fx: { fame: 10, goal: 10, str: 2 }, text: 'พระราชาพอใจ มอบดาบประจำราชวงศ์ให้ ทื่อไปนิด แต่สวย' },
      { t: 'ขอเปิดหน้าต่างสถานะดูก่อน', stat: 'mag', tag: 'appraise', dc: 8,
        win: { fx: { mag: 3, goal: 5 }, flag: 'wary', text: 'คุณเห็นบรรทัดเล็ก ๆ ว่า "อยู่ใต้เวทชักจูงใจ" เลยเริ่มระวังพระราชาตั้งแต่วันแรก' },
        lose: { fx: { luk: 1 }, text: 'ตัวหนังสือเป็นภาษาของโลกนี้ อ่านไม่ออกสักตัว' } },
      { t: 'ต่อรองค่าตัวก่อนรับงาน', stat: 'cha', tag: 'talk', dc: 10,
        win: { fx: { gold: 300 }, text: 'ได้เงินล่วงหน้าเป็นถุงหนัก ขุนนางคลังหน้าซีด' },
        lose: { fx: { fame: -5 }, text: 'ขุนนางทั้งห้องมองค้อน "ผู้กล้าอะไรเห็นแก่เงิน"' } },
    ] },
  { id: 'h1', worlds: ['hero'], ch: [1, 2], title: 'ลานฝึกของอัศวินหญิง',
    text: 'หัวหน้าอัศวินหญิงโยนดาบไม้มาให้ "ผู้กล้าที่ถือดาบไม่เป็นก็แค่คนธรรมดา"',
    choices: [
      { t: 'ฟันกันจริงจัง', stat: 'str', tag: 'fight', dc: 10,
        win: { fx: { str: 4, fame: 5 }, text: 'คุณปัดดาบเธอหลุดมือ ทั้งลานเงียบกริบ เธอยิ้มเป็นครั้งแรก' },
        lose: { fx: { hp: -15, str: 1 }, text: 'โดนฟาดหลังจนจุก แต่เริ่มรู้แล้วว่าต้องยืนเท้าแบบไหน' } },
      { t: 'ขอไปเรียนเวทกับจอมเวทราชสำนักแทน', stat: 'mag', tag: 'magic', dc: 10,
        win: { fx: { mag: 4 }, text: 'ลูกไฟลูกแรกของคุณเผาหนวดจอมเวทไปครึ่งข้าง เขาภูมิใจมาก' },
        lose: { fx: { hp: -10, mag: 1 }, text: 'มานาย้อนกลับ ผมคุณตั้งชี้ฟ้าไปสามวัน' } },
    ] },
  { id: 'h2', worlds: ['hero'], ch: [2], title: 'เพื่อนร่วมโลกถูกใส่ร้าย',
    text: 'หนึ่งในสามคนที่ถูกอัญเชิญมาพร้อมคุณได้สกิล "ไร้ประโยชน์" ขุนนางกล่าวหาว่าเขาขโมยของในคลัง และกำลังจะขับไล่',
    choices: [
      { t: 'ยืนขึ้นปกป้องเขา', stat: 'cha', tag: 'talk', dc: 14,
        win: { fx: { cha: 3, goal: 5 }, flag: 'ally', text: 'คุณชี้ว่าคลังถูกงัดก่อนเขามาถึง เขาจับมือคุณแน่น "ข้าจะไม่ลืม"' },
        lose: { fx: { fame: -10 }, text: 'ไม่มีใครฟัง เขาถูกไล่ออกจากวัง ส่วนคุณโดนจับตามองไปด้วย' } },
      { t: 'แอบตามหาคนขโมยตัวจริง', stat: 'luk', tag: 'sneak', dc: 14,
        win: { fx: { luk: 3, goal: 5, fame: 5 }, flag: 'ally', text: 'เจอของกลางในห้องขุนนางคนที่กล่าวหาเอง เรื่องพลิกทั้งวัง' },
        lose: { fx: { hp: -15 }, text: 'โดนทหารยามจับได้ว่าแอบเข้าห้องเก็บของ โดนโบยสิบที' } },
      { t: 'เงียบไว้ ไม่ยุ่ง', fx: { gold: 100 }, flag: 'rival', text: 'เขาถูกขับไล่ ข่าวลือว่ากลายเป็นคนเก่งที่สุดในทวีป และเกลียดคุณมาก' },
    ] },
  { id: 'h3', worlds: ['hero'], ch: [2, 3], title: 'หมู่บ้านใต้เงาปีศาจ',
    text: 'ปีศาจหัวควายสามตัวล้อมหมู่บ้านเล็ก ชาวบ้านหลบอยู่ในโบสถ์ เด็กคนหนึ่งร้องเรียกแม่',
    choices: [
      { t: 'บุกเข้าไปฟันตรง ๆ', stat: 'str', tag: 'fight', dc: 16,
        win: { fx: { goal: 15, fame: 10, str: 2 }, text: 'สามตัวล้มในสามดาบ ชาวบ้านสร้างรูปปั้นคุณจากไม้' },
        lose: { fx: { hp: -25, goal: 5 }, text: 'ไล่ไปได้ แต่ซี่โครงคุณหักสองซี่' } },
      { t: 'อพยพชาวบ้านออกทางหลังก่อน', stat: 'cha', tag: 'talk', dc: 12,
        win: { fx: { fame: 15, goal: 5 }, text: 'ทุกคนรอด แม่ของเด็กคนนั้นกอดคุณร้องไห้' },
        lose: { fx: { hp: -10, fame: -5 }, text: 'ชาวบ้านแตกตื่น หนีกระจัดกระจาย บางคนบาดเจ็บ' } },
      { t: 'ร่ายเวทวงกว้าง', stat: 'mag', tag: 'magic', dc: 16,
        win: { fx: { goal: 15, mag: 3 }, text: 'สายฟ้าฟาดลงสามจุดพร้อมกัน โบสถ์ไม่ถลอกสักนิด' },
        lose: { fx: { hp: -20, fame: -5 }, text: 'เวทพลาด หลังคาโรงนาไหม้ ปีศาจหนีไปได้' } },
    ] },
  { id: 'h4', worlds: ['hero'], ch: [3], title: 'แม่ทัพปีศาจขอเจรจา',
    text: 'แม่ทัพปีศาจหญิงวางอาวุธลงกลางสะพาน "ข้าไม่ได้อยากรบ จอมมารก็ไม่อยาก ใครกันแน่ที่อยากให้สงครามนี้ไม่จบ"',
    choices: [
      { t: 'นั่งลงฟังเธอ', stat: 'cha', tag: 'talk', dc: 16,
        win: { fx: { goal: 15, cha: 3 }, flag: 'peace', text: 'เธอเล่าว่าสงครามเริ่มจากฝั่งมนุษย์ คุณได้จดหมายปิดผนึกจากจอมมารมาหนึ่งฉบับ' },
        lose: { fx: { goal: 5 }, text: 'คุยกันไม่รู้เรื่อง เธอถอยกลับไปแต่ไม่ได้โจมตี' } },
      { t: 'จู่โจมตอนเธอวางอาวุธ', stat: 'str', tag: 'fight', dc: 20,
        win: { fx: { goal: 20, fame: 10, cha: -3 }, text: 'แม่ทัพปีศาจล้มลง ทหารโห่ร้อง แต่สายตาเธอก่อนสิ้นใจติดตาคุณไปอีกนาน' },
        lose: { fx: { hp: -35 }, text: 'เธอเร็วกว่าที่คิดมาก คุณรอดมาได้เพราะเธอเลือกไม่ฆ่า' } },
    ] },
  { id: 'h5', worlds: ['hero'], ch: [3], title: 'ห้องใต้ดินของพระราชา',
    text: 'กลางดึก คุณได้ยินเสียงสวดจากใต้พระราชวัง วงเวทอัญเชิญวงใหม่กำลังถูกวาด และมีผลึกวิญญาณกองอยู่ข้าง ๆ',
    choices: [
      { t: 'แอบลงไปดูให้ชัด', stat: 'luk', tag: 'sneak', dc: 16, bonus: { flag: 'wary', add: 20 },
        win: { fx: { goal: 10, mag: 3 }, flag: 'truth', text: 'ผลึกพวกนั้นคือวิญญาณของผู้กล้ารุ่นก่อน ๆ คุณรู้แล้วว่าพระราชาต้องการอะไร' },
        lose: { fx: { hp: -20, fame: -10 }, text: 'องครักษ์ลับเจอคุณ หนีออกมาได้พร้อมแผลที่แขน' } },
      { t: 'ใช้สกิลมองทะลุกำแพง', stat: 'mag', tag: 'appraise', dc: 16,
        win: { fx: { goal: 10 }, flag: 'truth', text: 'คุณอ่านวงเวทออก มันเป็นวงเวทดูดวิญญาณ ไม่ใช่วงอัญเชิญ' },
        lose: { fx: { mag: 1 }, text: 'กำแพงมีเวทกันไว้ มองไม่เห็นอะไรเลย' } },
      { t: 'ทำเป็นไม่ได้ยิน กลับไปนอน', fx: { gold: 200, hp: 10 }, text: 'เช้ามาพระราชาให้ทองพิเศษ "สำหรับผู้กล้าที่หลับสบาย"' },
    ] },
  { id: 'h9', worlds: ['hero'], ch: [4], finale: true, title: 'ปราสาทจอมมาร',
    text: 'ห้องบัลลังก์ดำทอดยาว จอมมารเอนหลังบนบัลลังก์ "ผู้กล้าคนที่สิบสาม เจ้าจะต่างจากคนก่อน ๆ ไหม"',
    choices: [
      { t: 'ดวลตัวต่อตัว', stat: 'str', tag: 'fight', dc: 24,
        win: { fx: { goal: 20, fame: 20 }, flag: 'won', text: 'ดาบคุณแทงทะลุเกราะดำ จอมมารยิ้ม "ในที่สุด..."' },
        lose: { fx: { hp: -50 }, text: 'ดาบคุณหัก จอมมารเหวี่ยงคุณกระแทกเสา' } },
      { t: 'ร่ายเวทผนึกโบราณ', stat: 'mag', tag: 'magic', dc: 24,
        win: { fx: { goal: 20, fame: 15 }, flag: 'won', text: 'โซ่แสงพันจอมมารจมลงใต้พื้น ผนึกไว้อีกพันปี' },
        lose: { fx: { hp: -45 }, text: 'วงเวทแตกกลางทาง มานาย้อนเผาตัวคุณเอง' } },
      { t: 'ยื่นจดหมาย เสนอสันติภาพ', stat: 'cha', tag: 'talk', dc: 26, bonus: { flag: 'peace', add: 30 }, bonus2: { flag: 'truth', add: 15 },
        win: { fx: { goal: 25, fame: 25 }, flag: 'won', flag2: 'peacewin', text: 'จอมมารอ่านจดหมายของแม่ทัพตัวเอง แล้ววางมงกุฎลงข้างตัว' },
        lose: { fx: { hp: -40 }, text: '"คำพูดของมนุษย์ ข้าฟังมาพอแล้ว" เปลวไฟดำพุ่งใส่คุณ' } },
    ] },

  // ─── ลูกขุนนาง ───
  { id: 'n0', worlds: ['noble'], ch: [1], title: 'ลืมตาเป็นทารก',
    text: 'เพดานลายทอง แม่นมพูดภาษาที่ไม่เคยได้ยิน คุณพยายามพูด แต่ออกมาเป็น "อ้อแอ้" ความจำชาติก่อนยังอยู่ครบ',
    choices: [
      { t: 'แอบฝึกมานาตั้งแต่อยู่ในเปล', stat: 'mag', tag: 'magic', dc: 6,
        win: { fx: { mag: 6 }, text: 'ฝึกทุกคืนจนมานาหมดแล้วหลับ อายุสามขวบมีมานามากกว่าพ่อ' },
        lose: { fx: { hp: -10, mag: 2 }, text: 'มานาหมดจนสลบ แม่นมตกใจอุ้มวิ่งไปหาหมอ' } },
      { t: 'คลานไปห้องสมุดของพ่อ', fx: { mag: 3, luk: 2 }, text: 'คุณอ่านภาษาโลกนี้ออกตอนสองขวบ คนใช้กระซิบกันว่าเป็นเด็กอัจฉริยะ' },
      { t: 'ทำตัวเป็นเด็กน่ารักธรรมดา', fx: { cha: 4, hp: 10 }, text: 'แม่รักคุณมาก พี่สาวแบ่งขนมให้ทุกวัน' },
    ] },
  { id: 'n1', worlds: ['noble'], ch: [1, 2], title: 'พี่ชายคนโตไม่ชอบหน้า',
    text: 'พี่ชายคนโตผู้จะสืบทอดตระกูลมองคุณเป็นภัย "ลูกคนที่สามมีหน้าที่อยู่เงียบ ๆ"',
    choices: [
      { t: 'คุยกันตรง ๆ ว่าไม่อยากได้ตำแหน่ง', stat: 'cha', tag: 'talk', dc: 12,
        win: { fx: { cha: 3, goal: 5 }, flag: 'brother', text: 'เขาเงียบไปนาน แล้วพูดว่า "งั้นช่วยข้าดูแลที่ดินได้ไหม"' },
        lose: { fx: { fame: -5 }, text: 'เขาคิดว่าคุณประชด เกลียดหนักกว่าเดิม' } },
      { t: 'ท้าดวลดาบไม้', stat: 'str', tag: 'fight', dc: 12,
        win: { fx: { fame: 10, goal: 5, str: 2 }, text: 'ชนะต่อหน้าอัศวินทั้งบ้าน พ่อเริ่มมองคุณใหม่' },
        lose: { fx: { hp: -15, str: 1 }, text: 'แพ้ราบคาบ พี่ชายหัวเราะ แต่ก็ส่งยามาให้ตอนกลางคืน' } },
    ] },
  { id: 'n2', worlds: ['noble'], ch: [2], title: 'สอบเข้าสถาบันเวทหลวง',
    text: 'ลูกขุนนางทั้งอาณาจักรมารวมกัน ลูกแก้ววัดมานาวางอยู่กลางห้องสอบ ข้อสอบข้อเขียนก็ยากพอกัน',
    choices: [
      { t: 'วางมือบนลูกแก้วเต็มกำลัง', stat: 'mag', tag: 'magic', dc: 14,
        win: { fx: { goal: 15, fame: 10 }, text: 'ลูกแก้วแตกเป็นเสี่ยง กรรมการประกาศ "คะแนนสูงสุดในรอบร้อยปี"' },
        lose: { fx: { goal: 5 }, text: 'ได้ห้อง F ห้องของพวกที่ถูกทิ้ง แต่เพื่อนในห้องนิสัยดีทุกคน' } },
      { t: 'ทำข้อเขียนด้วยคณิตจากโลกเดิม', stat: 'mag', tag: 'appraise', dc: 10,
        win: { fx: { goal: 12, mag: 2 }, text: 'สมการกำลังสองที่นี่ยังไม่มีใครรู้จัก อาจารย์ขอให้คุณช่วยสอน' },
        lose: { fx: { goal: 3 }, text: 'ลืมไปว่าที่นี่ใช้เลขฐานสิบสอง คำตอบผิดทั้งหน้า' } },
    ] },
  { id: 'n3', worlds: ['noble'], ch: [2, 3], title: 'ที่ดินแห้งแล้งของพ่อ',
    text: 'ปีนี้ข้าวในที่ดินของตระกูลไม่ออกรวง ชาวนาจะไม่มีกิน พ่อถอนใจทั้งคืน',
    choices: [
      { t: 'สอนปลูกพืชหมุนเวียนกับทำปุ๋ยหมัก', stat: 'luk', tag: 'trade', dc: 12,
        win: { fx: { gold: 500, goal: 10, fame: 5 }, text: 'ปีถัดมาผลผลิตเพิ่มเท่าตัว ชาวนาเรียกคุณว่า "นายน้อยผู้เรียกฝน"' },
        lose: { fx: { gold: -150 }, text: 'ปุ๋ยหมักเหม็นทั้งหมู่บ้าน ผลยังไม่ทันออก' } },
      { t: 'ขุดคลองส่งน้ำด้วยเวทดิน', stat: 'mag', tag: 'magic', dc: 14,
        win: { fx: { goal: 12, mag: 2 }, text: 'คลองยาวสามกิโลเสร็จในคืนเดียว ชาวบ้านตื่นมานึกว่าฝันไป' },
        lose: { fx: { hp: -15 }, text: 'มานาหมดกลางทาง คลองได้แค่ครึ่ง ใช้เลี้ยงเป็ดได้' } },
    ] },
  { id: 'n4', worlds: ['noble'], ch: [3], title: 'เพื่อนร่วมห้องที่ไม่ธรรมดา',
    text: 'เด็กสาวผมสั้นในห้องคุณใส่ชุดสามัญชน แต่ถือมีดปอกผลไม้แบบคนไม่เคยปอกเอง และมีราชลัญจกรห้อยคอ',
    choices: [
      { t: 'ทำเป็นไม่รู้ แต่ช่วยเธอเนียน ๆ', stat: 'cha', tag: 'talk', dc: 14,
        win: { fx: { goal: 15, cha: 3 }, flag: 'princess', text: 'เธอรู้ว่าคุณรู้ และขอบคุณที่ไม่บอกใคร เจ้าหญิงมีเพื่อนคนแรก' },
        lose: { fx: { fame: -5 }, text: 'ทำเนียนไม่เนียน เธอคิดว่าคุณเป็นสายลับ เลยหลบหน้า' } },
      { t: 'อยู่ห่าง ๆ ไว้ เรื่องราชวงศ์อันตราย', fx: { luk: 3, hp: 5 }, text: 'ชีวิตเรียนสงบดี ไม่มีอะไรตื่นเต้น' },
    ] },
  { id: 'n5', worlds: ['noble'], ch: [3], title: 'แผนกบฏของดยุค',
    text: 'คุณได้ยินดยุคฝ่ายเหนือคุยกับนักฆ่าในห้องสมุด แผนการคืนงานเลี้ยงราชสำนัก',
    choices: [
      { t: 'แอบขโมยจดหมายสั่งการ', stat: 'luk', tag: 'sneak', dc: 16,
        win: { fx: { goal: 15, fame: 10 }, flag: 'evidence', text: 'ได้จดหมายที่มีตราประทับของดยุคมาเต็มมือ' },
        lose: { fx: { hp: -30 }, text: 'นักฆ่าเห็นคุณ มีดบินมาเฉียดคอ คุณหนีรอดแบบหวุดหวิด' } },
      { t: 'จดจำทุกคำด้วยสกิลประเมิน', stat: 'mag', tag: 'appraise', dc: 14,
        win: { fx: { goal: 12 }, flag: 'evidence', text: 'คุณจำได้ทุกชื่อ ทุกเวลา ทุกประตูที่จะเปิด' },
        lose: { fx: { goal: 3 }, text: 'ได้ยินไม่ครบ รู้แค่ว่าจะเกิดอะไรขึ้นในงานเลี้ยง' } },
    ] },
  { id: 'n9', worlds: ['noble'], ch: [4], finale: true, title: 'คืนงานเลี้ยงราชสำนัก',
    text: 'ดนตรีกำลังบรรเลง โคมระย้ากระพริบ คุณเห็นเงาคนถือมีดที่ระเบียงด้านหลังพระราชา',
    choices: [
      { t: 'พุ่งเข้าขวางนักฆ่า', stat: 'str', tag: 'fight', dc: 24,
        win: { fx: { goal: 20, fame: 20 }, flag: 'won', text: 'คุณปัดมีดหลุดมือกลางห้องโถง พระราชามองคุณนิ่ง ๆ แล้วพยักหน้า' },
        lose: { fx: { hp: -50 }, text: 'มีดเฉือนสีข้างคุณ พระราชารอด แต่คุณล้มกลางพื้นหินอ่อน' } },
      { t: 'เปิดโปงดยุคกลางงาน', stat: 'cha', tag: 'talk', dc: 26, bonus: { flag: 'evidence', add: 25 }, bonus2: { flag: 'princess', add: 15 },
        win: { fx: { goal: 25, fame: 20 }, flag: 'won', text: 'คุณชูหลักฐานขึ้น ทุกสายตาหันไปที่ดยุค เขาหน้าซีดจนไม่ต้องตัดสิน' },
        lose: { fx: { hp: -30, fame: -15 }, text: 'ไม่มีใครเชื่อลูกบารอนบ้านนอก ทหารลากคุณออกจากงาน' } },
      { t: 'ร่ายบาเรียรอบพระราชา', stat: 'mag', tag: 'magic', dc: 24,
        win: { fx: { goal: 20, fame: 15 }, flag: 'won', text: 'มีดกระทบบาเรียแสงดังเคร้ง นักฆ่าถูกจับได้คาที่' },
        lose: { fx: { hp: -40 }, text: 'บาเรียบางเกินไป มีดทะลุมาโดนไหล่คุณแทน' } },
    ] },

  // ─── สไลม์ ───
  { id: 'm0', worlds: ['monster'], ch: [1], title: 'ลืมตาไม่ได้ เพราะไม่มีตา',
    text: 'คุณรับรู้ได้ด้วยผิวทั้งตัว เย็น ชื้น เหนียว หน้าต่างสถานะเด้งขึ้น "เผ่าพันธุ์: สไลม์"',
    choices: [
      { t: 'ดูดกินสมุนไพรรอบตัว', fx: { hp: 10, mag: 3 }, text: 'ได้สกิลสร้างยารักษาติดตัว รสชาติเหมือนใบบัวบก' },
      { t: 'ดูดซากก็อบลินที่ตายอยู่', stat: 'str', tag: 'fight', dc: 6,
        win: { fx: { str: 5 }, text: 'ร่างคุณใหญ่ขึ้นนิดหน่อย และได้สกิลพุ่งชน' },
        lose: { fx: { hp: -10, str: 2 }, text: 'ย่อยไม่หมด ปวดท้องที่ไม่มีอยู่สามวัน' } },
      { t: 'นิ่ง ๆ รอดูโลกไปก่อน', stat: 'luk', tag: 'sneak', dc: 6,
        win: { fx: { luk: 4, mag: 2 }, text: 'มังกรตัวใหญ่ที่ถูกผนึกในถ้ำเดียวกันทักคุณ และสอนภาษาให้' },
        lose: { fx: { luk: 1 }, text: 'สามเดือนผ่านไป ไม่มีอะไรเกิดขึ้นเลย' } },
    ] },
  { id: 'm1', worlds: ['monster'], ch: [1, 2], title: 'ก็อบลินขอความช่วยเหลือ',
    text: 'ฝูงก็อบลินผอมโซคุกเข่าตรงหน้า "ท่านผู้ยิ่งใหญ่ หมาป่าจะมากินหมู่บ้านเราคืนนี้"',
    choices: [
      { t: 'ตั้งชื่อให้ทุกตัวแล้วนำทัพ', stat: 'cha', tag: 'talk', dc: 10,
        win: { fx: { goal: 15, cha: 3, hp: -10 }, flag: 'named', text: 'ก็อบลินที่ได้ชื่อวิวัฒน์ทันที คุณมานาหมดจนหลับไปสองวัน ตื่นมามีลูกน้องสามสิบ' },
        lose: { fx: { goal: 5, hp: -10 }, text: 'ตั้งชื่อได้ห้าตัวก็มานาหมด แต่ห้าตัวนั้นภักดีที่สุดในโลก' } },
      { t: 'ไปสู้หมาป่าเอง', stat: 'str', tag: 'fight', dc: 12,
        win: { fx: { goal: 10, str: 3 }, text: 'ดูดหัวหน้าหมาป่าเข้าไปทั้งตัว ฝูงที่เหลือยอมสยบ' },
        lose: { fx: { hp: -20 }, text: 'โดนกัดขาดไปครึ่งร่าง ดีที่สไลม์งอกใหม่ได้' } },
    ] },
  { id: 'm2', worlds: ['monster'], ch: [2], title: 'นักผจญภัยมาล่าแต้ม',
    text: 'ปาร์ตี้นักผจญภัยสามคนเดินเข้าถ้ำ "สไลม์สีฟ้าตัวนี้แปลก ๆ แฮะ"',
    choices: [
      { t: 'สู้', stat: 'str', tag: 'fight', dc: 14,
        win: { fx: { str: 4, goal: 10 }, text: 'พวกเขาหนีไปพร้อมเล่าเรื่องสไลม์ปีศาจให้ทั้งกิลด์ฟัง' },
        lose: { fx: { hp: -25 }, text: 'โดนไฟเผาไปครึ่งตัว คุณไหลหนีลงซอกหิน' } },
      { t: 'ทักทายเป็นภาษาคน', stat: 'cha', tag: 'talk', dc: 14,
        win: { fx: { fame: 10, cha: 3 }, flag: 'humanfriend', text: '"สไลม์พูดได้!" สุดท้ายพวกเขากลายเป็นเพื่อนคนแรกฝั่งมนุษย์' },
        lose: { fx: { hp: -15 }, text: 'พวกเขาตกใจ ปาไฟใส่ก่อนวิ่งหนี' } },
      { t: 'ทำตัวเป็นสไลม์โง่ ๆ', stat: 'luk', tag: 'sneak', dc: 10,
        win: { fx: { luk: 3 }, text: 'พวกเขาเมิน เดินผ่านไป คุณขโมยข้าวกล่องเขามาด้วย' },
        lose: { fx: { hp: -10 }, text: 'โดนเตะเล่นสองที' } },
    ] },
  { id: 'm3', worlds: ['monster'], ch: [2, 3], title: 'วิวัฒนาการครั้งแรก',
    text: 'เสียงระบบดังในหัว "ค่าประสบการณ์ถึงเกณฑ์ เลือกเส้นทางวิวัฒนาการ"',
    choices: [
      { t: 'ร่างมนุษย์', fx: { cha: 6, goal: 10 }, text: 'ได้ร่างเด็กหน้าตาจิ้มลิ้ม เดินเข้าเมืองมนุษย์ได้แล้ว' },
      { t: 'ร่างมังกรน้อย', fx: { str: 6, goal: 10 }, text: 'มีปีก มีเขา พ่นไฟได้นิดหน่อย ยังตัวเท่าแมว' },
      { t: 'ร่างจอมเวทเหลว', fx: { mag: 6, goal: 10 }, text: 'ร่างกายเป็นมานาบริสุทธิ์ ร่ายเวทได้สิบวงพร้อมกัน' },
    ] },
  { id: 'm4', worlds: ['monster'], ch: [3], title: 'สร้างเมืองมอนสเตอร์',
    text: 'ลูกน้องเพิ่มเป็นร้อย ทั้งก็อบลิน หมาป่า คนแคระที่หนีมา ทุกตัวมองคุณ "นายท่าน เราจะสร้างอะไรดี"',
    choices: [
      { t: 'ถนน ประปา โรงอาบน้ำ แบบโลกเดิม', stat: 'luk', tag: 'trade', dc: 16,
        win: { fx: { goal: 20, gold: 500 }, text: 'เมืองมอนสเตอร์มีน้ำร้อนใช้ก่อนเมืองหลวงมนุษย์ พ่อค้าเริ่มแวะมา' },
        lose: { fx: { goal: 5, gold: -100 }, text: 'ท่อแตก น้ำท่วมโรงเก็บอาหาร แต่ทุกตัวสนุก' } },
      { t: 'กำแพงกับป้อมก่อน', stat: 'str', tag: 'fight', dc: 14,
        win: { fx: { goal: 15, str: 3 }, text: 'กำแพงหินสูงห้าเมตรเสร็จในเดือนเดียว ไม่มีใครกล้ารุก' },
        lose: { fx: { goal: 5, hp: -10 }, text: 'กำแพงถล่มทับคุณ ดีที่เป็นสไลม์' } },
    ] },
  { id: 'm5', worlds: ['monster'], ch: [3], title: 'ราชาปีศาจอีกตนมาเยือน',
    text: 'ราชาปีศาจผมแดงลอยลงกลางเมือง "สไลม์ตัวเดียวสร้างเมืองได้ น่าสนใจ หรือน่ากำจัด"',
    choices: [
      { t: 'เชิญดื่มชา คุยกันดี ๆ', stat: 'cha', tag: 'talk', dc: 18,
        win: { fx: { goal: 10, cha: 3 }, flag: 'pact', text: 'นางดื่มชาสามกา แล้วประกาศเป็นเพื่อนสนิท ไม่ว่าคุณจะอยากหรือไม่' },
        lose: { fx: { hp: -20 }, text: 'นางไม่ชอบรสชา ระเบิดโต๊ะทิ้งก่อนกลับ' } },
      { t: 'ท้าสู้', stat: 'str', tag: 'fight', dc: 22,
        win: { fx: { goal: 20, fame: 15 }, text: 'สู้กันสามวันสามคืน จบด้วยนางหัวเราะ "เจ้าแข็งแกร่งพอ"' },
        lose: { fx: { hp: -35 }, text: 'นางเอานิ้วเดียวจิ้มคุณกระเด็นข้ามภูเขา' } },
    ] },
  { id: 'm9', worlds: ['monster'], ch: [4], finale: true, title: 'สองกองทัพที่หน้าประตูเมือง',
    text: 'กองทัพมนุษย์ทางใต้ กองทัพปีศาจทางเหนือ ทั้งคู่มาเพื่อยึดเมืองของคุณ ลูกน้องทุกตัวรอคำสั่ง',
    choices: [
      { t: 'ยืนกลางสนามรบ ขอให้หยุด', stat: 'cha', tag: 'talk', dc: 26, bonus: { flag: 'humanfriend', add: 20 }, bonus2: { flag: 'pact', add: 20 },
        win: { fx: { goal: 25, fame: 25 }, flag: 'won', text: 'เพื่อนมนุษย์กับราชาปีศาจผมแดงเดินมายืนข้างคุณ ทั้งสองกองทัพลดอาวุธลง' },
        lose: { fx: { hp: -45 }, text: 'ลูกธนูนับร้อยพุ่งใส่คุณจากทั้งสองฝั่ง' } },
      { t: 'กลืนกินทั้งสองกองทัพ', stat: 'str', tag: 'fight', dc: 26,
        win: { fx: { goal: 25, cha: -10 }, flag: 'won', flag2: 'devour', text: 'ร่างคุณขยายจนบังฟ้า แล้วทุกอย่างก็เงียบ' },
        lose: { fx: { hp: -50 }, text: 'ย่อยไม่ไหว ร่างแตกกระจายเป็นร้อยชิ้น' } },
      { t: 'ร่ายบาเรียครอบเมืองทั้งเมือง', stat: 'mag', tag: 'magic', dc: 24,
        win: { fx: { goal: 20, fame: 15 }, flag: 'won', text: 'โดมแสงครอบเมืองเจ็ดวัน ทั้งสองกองทัพเสบียงหมด ต้องถอยไปเอง' },
        lose: { fx: { hp: -40 }, text: 'โดมร้าวตอนวันที่สาม คุณกลั้นไว้จนตัวแห้ง' } },
    ] },

  // ─── นางร้าย ───
  { id: 'v0', worlds: ['villainess'], ch: [1], title: 'ตื่นมาเป็นนางร้าย',
    text: 'กระจกบานใหญ่สะท้อนเด็กหญิงผมม้วนสีทองกับตาสีม่วงเฉียบ คุณจำหน้านี้ได้ นี่คือนางร้ายในเกมที่เคยเล่นจนจบทุกเส้นทาง',
    choices: [
      { t: 'เขียนสมุดธงหายนะทุกเส้นทาง', stat: 'mag', tag: 'appraise', dc: 6,
        win: { fx: { goal: 10, mag: 3 }, text: 'สมุดสามเล่ม ครบทุกฉาก ทุกตัวละคร ทุกบทพูดที่ต้องห้าม' },
        lose: { fx: { goal: 4 }, text: 'จำได้แค่เส้นทางเจ้าชาย อีกสี่เส้นจำลาง ๆ' } },
      { t: 'ขอโทษสาวใช้ที่ "ตัวเดิม" เคยรังแก', fx: { goal: 8, cha: 3 }, text: 'สาวใช้ร้องไห้ ข่าวลือว่าท่านหญิงเปลี่ยนไปกระจายทั่วคฤหาสน์' },
      { t: 'ฝึกดาบไว้ เผื่อต้องหนี', fx: { str: 5 }, text: 'อัศวินประจำบ้านตกใจ แต่ยอมสอน ท่านหญิงฟันไม้ได้ทุกเช้า' },
    ] },
  { id: 'v1', worlds: ['villainess'], ch: [1, 2], title: 'พบเจ้าชายคู่หมั้นครั้งแรก',
    text: 'เจ้าชายวัยสิบขวบยื่นดอกกุหลาบให้ ในเกม ฉากนี้คือจุดเริ่มต้นของทุกหายนะ',
    choices: [
      { t: 'ขอถอนหมั้นตั้งแต่วันนี้', stat: 'cha', tag: 'talk', dc: 14,
        win: { fx: { goal: 15 }, text: 'เจ้าชายงง แต่ยอมเลื่อนประกาศหมั้นออกไปก่อน ธงแรกหักได้' },
        lose: { fx: { goal: -5, cha: 2 }, text: '"น่าสนใจ ไม่มีใครเคยปฏิเสธข้า" ไม่นะ เขาสนใจคุณมากขึ้น' } },
      { t: 'ทำตัวน่าเบื่อที่สุดในโลก', stat: 'luk', tag: 'sneak', dc: 10,
        win: { fx: { goal: 10, luk: 2 }, text: 'คุณเล่าเรื่องดินปลูกผักสองชั่วโมง เจ้าชายหลับคาเก้าอี้' },
        lose: { fx: { goal: -3 }, text: 'เขาบอกว่าชอบผักเหมือนกัน แย่แล้ว' } },
    ] },
  { id: 'v2', worlds: ['villainess'], ch: [2], title: 'นางเอกตัวจริงเข้าเรียน',
    text: 'สาวสามัญชนผมชมพูหกล้มต่อหน้าคุณที่ประตูสถาบัน ทุกคนหันมามอง ในเกม คุณต้องหัวเราะเยาะตรงนี้',
    choices: [
      { t: 'ยื่นมือช่วยพยุงขึ้น', stat: 'cha', tag: 'talk', dc: 12,
        win: { fx: { goal: 15, cha: 3 }, flag: 'heroine', text: 'เธอยิ้มกว้าง "ท่านหญิงใจดีจัง" คนที่มุงอยู่หันมองหน้ากันเลิ่กลั่ก' },
        lose: { fx: { goal: 5 }, text: 'มือคุณลื่น เธอล้มซ้ำ ทุกคนคิดว่าคุณผลัก' } },
      { t: 'เตือนเธอเรื่องอีเวนต์ที่จะเกิด', stat: 'mag', tag: 'appraise', dc: 14,
        win: { fx: { goal: 12 }, flag: 'heroine', text: '"ทำไมท่านรู้ว่าจะมีคนเอาหนังสือฉันไปซ่อน" เธอเริ่มไว้ใจคุณ' },
        lose: { fx: { goal: 3 }, text: 'เธอคิดว่าคุณขู่ เลยหลบหน้าทั้งเทอม' } },
      { t: 'เดินผ่านไปเฉย ๆ', fx: { goal: 5, luk: 2 }, text: 'ไม่ช่วย ไม่ซ้ำ บทของเกมงงไปพักหนึ่ง' },
    ] },
  { id: 'v3', worlds: ['villainess'], ch: [2, 3], title: 'แปลงผักหลังคฤหาสน์',
    text: 'คุณขอที่หลังคฤหาสน์มาปลูกผัก คนสวนคิดว่าท่านหญิงคงเบื่อในสามวัน',
    choices: [
      { t: 'ปลูกพริกกับกะเพราจากเมล็ดที่หาเจอ', stat: 'luk', tag: 'trade', dc: 10,
        win: { fx: { gold: 300, cha: 3, goal: 5 }, text: 'พ่อค้าแย่งซื้อกะเพรา เมนูผัดกะเพราของท่านหญิงดังทั้งเมืองหลวง' },
        lose: { fx: { gold: -50 }, text: 'หนอนกินหมด แต่คนสวนเริ่มนับถือที่คุณไม่ยอมแพ้' } },
      { t: 'เปิดร้านขนมหน้าโรงเรียน', stat: 'cha', tag: 'cook', dc: 12,
        win: { fx: { gold: 500, fame: 10 }, text: 'ขนมชั้นสูตรยายขายหมดทุกวัน ลูกขุนนางต่อคิว' },
        lose: { fx: { fame: -5 }, text: 'ขนมแข็งเหมือนหิน แต่มีคนซื้อไปใช้ทับกระดาษ' } },
    ] },
  { id: 'v4', worlds: ['villainess'], ch: [3], title: 'หลักฐานปลอม',
    text: 'สมุดนางเอกถูกฉีก มีคนเห็น "ผมม้วนสีทอง" เดินออกจากห้อง ทั้งที่ตอนนั้นคุณอยู่ห้องสมุด',
    choices: [
      { t: 'สืบหาตัวคนร้ายเอง', stat: 'luk', tag: 'sneak', dc: 16,
        win: { fx: { goal: 15 }, flag: 'evidence', text: 'เจอวิกผมสีทองในห้องลูกสาวเคานต์ที่อยากเป็นคู่หมั้นเจ้าชาย' },
        lose: { fx: { goal: -10, hp: -10 }, text: 'ยิ่งสืบยิ่งดูเหมือนแก้ตัว ข่าวลือหนักขึ้น' } },
      { t: 'ขอให้นางเอกเป็นพยาน', stat: 'cha', tag: 'talk', dc: 22, bonus: { flag: 'heroine', add: 35 },
        win: { fx: { goal: 15, cha: 2 }, flag: 'evidence', text: 'นางเอกยืนยันว่าเห็นคุณในห้องสมุดตลอด ข่าวลือจบในวันเดียว' },
        lose: { fx: { goal: -8 }, text: 'นางเอกไม่กล้ายืนยันต่อหน้าทุกคน' } },
    ] },
  { id: 'v5', worlds: ['villainess'], ch: [3], title: 'คนที่ควรเป็นศัตรู',
    text: 'ในเกม พี่ชายบุญธรรมกับอัศวินองครักษ์คือคนที่ลากคุณไปลงโทษ ตอนนี้ทั้งคู่ยืนลังเลอยู่หน้าห้องคุณ',
    choices: [
      { t: 'ชวนดื่มชา เล่าความจริงบางส่วน', stat: 'cha', tag: 'talk', dc: 14,
        win: { fx: { goal: 12, cha: 3 }, flag: 'allies', text: 'ทั้งคู่สาบานว่าจะไม่ปล่อยให้บทเดิมเกิดขึ้น' },
        lose: { fx: { goal: -3 }, text: 'พูดมากไป ทั้งคู่คิดว่าคุณป่วย ส่งหมอมาทุกวัน' } },
      { t: 'ช่วยพี่ชายแก้หนี้ของเขาแบบลับ ๆ', need: { gold: 400 }, fx: { gold: -400, goal: 12 }, flag: 'allies', text: 'เขารู้ทีหลังว่าใครจ่าย และไม่พูดอะไร แค่ยืนข้างคุณตลอดมา' },
    ] },
  { id: 'v9', worlds: ['villainess'], ch: [4], finale: true, title: 'งานเต้นรำวันจบการศึกษา',
    text: 'เจ้าชายยกมือขึ้นกลางห้องโถง "เรเวียน่า ข้าขอประกาศ..." นี่คือฉากที่ทุกเส้นทางเคยจบไม่สวย',
    choices: [
      { t: 'ชิงพูดก่อน แสดงหลักฐานทุกชิ้น', stat: 'mag', tag: 'appraise', dc: 24, bonus: { flag: 'evidence', add: 25 },
        win: { fx: { goal: 25, fame: 20 }, flag: 'won', text: 'หลักฐานกางเต็มโต๊ะ เจ้าชายลดมือลงช้า ๆ คนร้ายตัวจริงถูกพาออกไป' },
        lose: { fx: { goal: -15, hp: -20 }, text: 'หลักฐานไม่พอ เสียงซุบซิบดังขึ้นทั่วห้อง' } },
      { t: 'มองหาคนที่เคยช่วยไว้', stat: 'cha', tag: 'talk', dc: 26, bonus: { flag: 'allies', add: 20 }, bonus2: { flag: 'heroine', add: 20 },
        win: { fx: { goal: 25, cha: 3 }, flag: 'won', text: 'พี่ชาย อัศวิน และนางเอกเดินมายืนข้างคุณ เจ้าชายพูดต่อไม่ออก' },
        lose: { fx: { goal: -15 }, text: 'ไม่มีใครก้าวออกมา คุณยืนคนเดียวกลางห้อง' } },
      { t: 'ถอนหมั้นเองก่อน แล้วเดินออกอย่างสง่า', stat: 'luk', tag: 'sneak', dc: 20,
        win: { fx: { goal: 20 }, flag: 'won', text: '"ข้าขอถอนหมั้นเพคะ ขอให้ทรงพระเจริญ" คุณเดินออกไปท่ามกลางเสียงปรบมือ' },
        lose: { fx: { goal: -10, hp: -15 }, text: 'ส้นรองเท้าหัก ล้มกลางบันได ดราม่ากว่าที่ตั้งใจ' } },
    ] },

  // ─── สโลว์ไลฟ์ ───
  { id: 's0', worlds: ['slowlife'], ch: [1], title: 'บ้านเล็กชายป่า',
    text: 'เทพธิดาก้มหัวขอโทษห้าครั้งที่ส่งคุณมาผิดคิว ชดเชยด้วยบ้านไม้หลังเล็ก บ่อน้ำ และแปลงดินว่างเปล่า',
    choices: [
      { t: 'ปลูกผักก่อนเลย', stat: 'luk', tag: 'trade', dc: 6,
        win: { fx: { goal: 8, gold: 100 }, text: 'ดินที่นี่ดีมาก แตงกวาโตเท่าแขนในสามวัน' },
        lose: { fx: { goal: 3 }, text: 'ปลูกผิดฤดู งอกขึ้นมาสองต้น' } },
      { t: 'เปิดแผงขายข้าวไข่เจียวในหมู่บ้าน', stat: 'cha', tag: 'cook', dc: 8,
        win: { fx: { gold: 200, fame: 5, goal: 8 }, text: 'ไข่เจียวฟูกรอบราดซอสพริก คนทั้งหมู่บ้านไม่เคยกินมาก่อน' },
        lose: { fx: { gold: -30 }, text: 'น้ำมันที่นี่กลิ่นแรงมาก ไข่เจียวกลิ่นเหมือนตะเกียง' } },
      { t: 'เดินสำรวจป่า', stat: 'str', tag: 'fight', dc: 8,
        win: { fx: { str: 3, luk: 2 }, text: 'เจอต้นมะม่วงกับรังผึ้ง ป่านี้ใจดีกว่าที่คิด' },
        lose: { fx: { hp: -10 }, text: 'หลงป่าสองวัน กลับมาพร้อมยุงกัดทั้งตัว' } },
    ] },
  { id: 's1', worlds: ['slowlife'], ch: [1, 2], title: 'หมาป่าสีเงินบาดเจ็บ',
    text: 'หมาป่าตัวใหญ่ขนาดม้านอนเลือดออกหน้าบ้าน ดวงตาสีทองมองคุณอย่างระแวง',
    choices: [
      { t: 'ใช้เวทรักษา', stat: 'mag', tag: 'magic', dc: 10,
        win: { fx: { goal: 10, mag: 3 }, flag: 'fenrir', text: 'แผลปิดสนิท มันเลียหน้าคุณ หน้าต่างสถานะขึ้น "ทำสัญญากับเฟนรีร์"' },
        lose: { fx: { hp: -15 }, text: 'เวทไม่ติด มันขู่แล้วกัดแขนคุณ ก่อนหายเข้าป่า' } },
      { t: 'ต้มซุปกระดูกให้กิน', stat: 'cha', tag: 'cook', dc: 8,
        win: { fx: { goal: 10 }, flag: 'fenrir', text: 'มันกินหมดหม้อ แล้วนอนหน้าบ้านไม่ยอมไปไหน' },
        lose: { fx: { gold: -20 }, text: 'ซุปเค็มเกิน มันดมแล้วเดินหนี' } },
    ] },
  { id: 's2', worlds: ['slowlife'], ch: [2], title: 'ร้านเปิดวันแรก',
    text: 'ป้ายไม้แกะเองเขียนว่า "ร้านข้าวชายป่า" ลูกค้าคนแรกคือพ่อค้าเร่ที่หิวจนตาลาย',
    choices: [
      { t: 'ข้าวผัดกะเพราไข่ดาว', stat: 'cha', tag: 'cook', dc: 12,
        win: { fx: { gold: 400, goal: 15, fame: 10 }, text: 'พ่อค้าเล่าต่อทั้งเส้นทางการค้า อาทิตย์ต่อมาคิวยาวถึงลำธาร' },
        lose: { fx: { gold: -100, goal: 3 }, text: 'ใบกะเพราที่นี่ขมมาก ต้องเททิ้งทั้งกระทะ' } },
      { t: 'ต้มยำกุ้งน้ำข้น เสี่ยงหน่อย', stat: 'cha', tag: 'cook', dc: 16,
        win: { fx: { gold: 600, goal: 20, fame: 15 }, text: 'ลูกค้าเหงื่อแตก ร้องไห้ แล้วสั่งเพิ่มอีกสามชาม' },
        lose: { fx: { fame: -10 }, text: 'เผ็ดจนพ่อค้าเป็นลม ข่าวลือว่าร้านนี้วางยาพิษ' } },
    ] },
  { id: 's3', worlds: ['slowlife'], ch: [2, 3], title: 'ผู้กล้ามาขอยืมพลัง',
    text: 'ผู้กล้าที่ถูกอัญเชิญมาจากโลกเดิมเหมือนกันมาที่ร้าน "ได้ยินว่าคุณเก่ง มาช่วยปราบจอมมารกัน"',
    choices: [
      { t: 'ปฏิเสธ ฉันมาเพื่อสโลว์ไลฟ์', fx: { goal: 10, fame: -5 }, text: 'เขาผิดหวัง แต่กินข้าวหมดจาน และทิ้งทิปไว้ใต้ชาม' },
      { t: 'ช่วยแบบลับ ๆ ทำเสบียงให้', stat: 'cha', tag: 'cook', dc: 12,
        win: { fx: { goal: 8, fame: 10, gold: 200 }, text: 'เสบียงของคุณทำให้ทัพผู้กล้าเดินได้ไกลกว่าเดิมสองเท่า' },
        lose: { fx: { gold: -100 }, text: 'อาหารบูดกลางทาง ผู้กล้าท้องเสียทั้งทัพ' } },
      { t: 'ตามไปด้วยเลย', stat: 'str', tag: 'fight', dc: 16,
        win: { fx: { fame: 20, str: 4, goal: -10 }, text: 'ช่วยล้มแม่ทัพปีศาจได้หนึ่งตัว แต่ร้านปิดไปสองเดือน' },
        lose: { fx: { hp: -30, goal: -10 }, text: 'เกือบตายในด่านแรก กลับบ้านพร้อมแผลเต็มตัว' } },
    ] },
  { id: 's4', worlds: ['slowlife'], ch: [3], title: 'พ่อค้าใหญ่ขอซื้อสูตร',
    text: 'พ่อค้าจากเมืองหลวงวางถุงทองบนโต๊ะ "ขายสูตรน้ำปลาให้ข้า แล้วท่านไม่ต้องทำงานอีกเลย"',
    choices: [
      { t: 'ต่อรองเป็นหุ้นส่วนแทน', stat: 'luk', tag: 'trade', dc: 14,
        win: { fx: { gold: 800, goal: 10 }, text: 'ได้ส่วนแบ่งทุกขวดที่ขายทั่วทวีป ร้านยังเป็นของคุณ' },
        lose: { fx: { gold: 200 }, text: 'เขาให้แค่ค่าที่ปรึกษา แต่ก็ยังดี' } },
      { t: 'ไม่ขาย', fx: { goal: 12, cha: 2 }, text: 'ลูกค้าประจำรู้ข่าว ยิ่งรักร้านคุณขึ้นไปอีก' },
    ] },
  { id: 's5', worlds: ['slowlife'], ch: [3], title: 'ขุนนางขึ้นภาษี',
    text: 'ทหารของขุนนางเจ้าเมืองมาติดประกาศ ภาษีร้านค้าชายป่าขึ้นสามเท่า มีผลพรุ่งนี้',
    choices: [
      { t: 'ไปเจรจาที่คฤหาสน์', stat: 'cha', tag: 'talk', dc: 16,
        win: { fx: { goal: 10, fame: 10 }, text: 'ขุนนางชิมข้าวผัดของคุณ แล้วยกเลิกภาษีพร้อมขอเป็นลูกค้า' },
        lose: { fx: { gold: -200 }, text: 'โดนไล่กลับมา ต้องจ่ายตามประกาศ' } },
      { t: 'ให้เฟนรีร์ไปยืนหน้าคฤหาสน์', stat: 'str', tag: 'fight', dc: 24, bonus: { flag: 'fenrir', add: 40 },
        win: { fx: { goal: 10 }, text: 'ขุนนางเห็นหมาป่าขนาดม้าแล้วประกาศว่าชายป่าได้รับยกเว้นภาษีตลอดกาล' },
        lose: { fx: { hp: -20, gold: -200 }, text: 'ทหารเยอะกว่าที่คิด ต้องจ่ายภาษีพร้อมค่าปรับ' } },
      { t: 'จ่ายไปเงียบ ๆ', need: { gold: 300 }, fx: { gold: -300, hp: 5 }, text: 'เงินหาย แต่ใจสงบ' },
    ] },
  { id: 's9', worlds: ['slowlife'], ch: [4], finale: true, title: 'มังกรบุกหมู่บ้าน',
    text: 'เงาดำทาบทั้งหมู่บ้าน มังกรแดงร่อนลงกลางลาน แล้วยื่นจมูกเข้ามาที่หน้าต่างร้านคุณ ดูเหมือนมันได้กลิ่นอะไรบางอย่าง',
    choices: [
      { t: 'เลี้ยงข้าวมังกร', stat: 'cha', tag: 'cook', dc: 22,
        win: { fx: { goal: 25, fame: 20 }, flag: 'won', text: 'หมูกระทะชุดใหญ่สิบเตา มังกรกินจนหลับคาลาน ตื่นมาขอจองโต๊ะทุกอาทิตย์' },
        lose: { fx: { hp: -40 }, text: 'มันไม่ชอบผักชี พ่นไฟใส่ร้านครึ่งหลัง' } },
      { t: 'ไล่ด้วยกำลัง', stat: 'str', tag: 'fight', dc: 26, bonus: { flag: 'fenrir', add: 25 },
        win: { fx: { goal: 20, fame: 15 }, flag: 'won', text: 'คุณกับเฟนรีร์ไล่มันกลับขึ้นเขา หมู่บ้านจัดงานเลี้ยงสามวัน' },
        lose: { fx: { hp: -50 }, text: 'หางมังกรฟาดคุณกระเด็นข้ามแม่น้ำ' } },
      { t: 'กางบาเรียคลุมหมู่บ้าน', stat: 'mag', tag: 'magic', dc: 24,
        win: { fx: { goal: 20 }, flag: 'won', text: 'มันเคาะบาเรียสองสามที แล้วบินจากไปอย่างหงุดหงิด' },
        lose: { fx: { hp: -40, gold: -300 }, text: 'บาเรียแตก ร้านไหม้ไปครึ่งหนึ่ง' } },
    ] },

  // ─── ก็อบลินตัวเล็ก (บทบาทที่ไม่มีเนื้อเรื่องของโลก · worlds = id บทบาท) ───
  { id: 'gb1', worlds: ['goblin'], ch: [1], title: 'ก็อบลินตัวที่สามสิบสอง',
    text: 'มื้อเย็นของรังคือกระดูกกวางหนึ่งท่อน ก็อบลินสามสิบเอ็ดตัวกระโจนใส่พร้อมกัน คุณตัวเล็กที่สุด และยังจำได้ว่าชาติก่อนกินข้าวสามมื้อ',
    choices: [
      { t: 'แย่งกระดูกกับพี่ ๆ', stat: 'str', tag: 'fight', dc: 8,
        win: { fx: { str: 3, hp: 5 }, text: 'คุณกัดนิ้วพี่ใหญ่จนเขาปล่อย ได้กระดูกมาท่อนเล็ก ๆ แต่เป็นของคุณคนเดียว' },
        lose: { fx: { hp: -10, str: 1 }, text: 'โดนเหยียบหน้าไปสามรอบ คืนนั้นได้แค่เลียพื้น' } },
      { t: 'ย่องไปดูในโพรงของหัวหน้ารัง', stat: 'luk', tag: 'sneak', dc: 8,
        win: { fx: { luk: 3, hp: 8 }, text: 'หัวหน้ารังซ่อนเห็ดตากแห้งไว้ใต้หนังหมี คุณกินไปสองดอก ไม่มีใครรู้' },
        lose: { fx: { hp: -8 }, text: 'หัวหน้ารังนอนไม่หลับพอดี คุณโดนจับหางเหวี่ยงออกมา' } },
      { t: 'แบ่งเศษขนมปังที่เก็บไว้ให้ตัวที่เล็กรองลงมา', fx: { cha: 2, goal: 3 }, text: 'ก็อบลินตัวที่สามสิบเอ็ดมองหน้าคุณนาน แล้วเดินตามคุณไปทุกที่ตั้งแต่วันนั้น' },
    ] },
  { id: 'gb2', worlds: ['goblin'], ch: [1, 2], title: 'นับเลขเกินห้า',
    text: 'ก็อบลินในรังนับได้แค่ห้า เกินจากนั้นเรียกว่า "เยอะ" ทั้งหมด ทุกครั้งที่แบ่งของจึงต้องตีกันก่อน',
    choices: [
      { t: 'สอนทุกตัวนับเลขด้วยนิ้วเท้า', stat: 'cha', tag: 'talk', dc: 9,
        win: { fx: { goal: 8, cha: 2 }, flag: 'tally', text: 'ตอนนี้รังนับได้ถึงยี่สิบ แบ่งของตามจำนวนตัว ไม่มีใครตีกันตอนกินข้าวอีก' },
        lose: { fx: { goal: 2 }, text: 'ทุกตัวนับได้ถึงเจ็ด แล้วเถียงกันว่าเจ็ดมากกว่าเยอะไหม' } },
      { t: 'แอบใช้เลขที่รู้คนเดียวโกงส่วนแบ่ง', stat: 'luk', tag: 'sneak', dc: 8,
        win: { fx: { luk: 2, hp: 10 }, text: 'คุณได้ส่วนแบ่งมากกว่าตัวอื่นทุกมื้อ ตัวโตขึ้นทันพี่ ๆ ในฤดูเดียว' },
        lose: { fx: { hp: -10 }, text: 'พี่ใหญ่สังเกตว่ากองของคุณสูงกว่ากองอื่น คุณโดนแย่งคืนหมด' } },
    ] },
  { id: 'gb3', worlds: ['goblin'], ch: [2], title: 'นักผจญภัยมือใหม่หลงเข้ารัง',
    text: 'เด็กสาวในชุดเกราะหนังตกลงมาในหลุมหน้ารัง ขาพลิก ดาบหักครึ่ง เธอหลับตาแน่น "อย่ากินฉันนะ"',
    choices: [
      { t: 'ซ่อนเธอไว้แล้วพาออกทางอุโมงค์ลับ', stat: 'luk', tag: 'sneak', dc: 11,
        win: { fx: { goal: 5, fame: 5 }, flag: 'humanpal', next: 'gb3b', text: 'ก่อนจากกันเธอผูกผ้าเช็ดหน้าไว้ที่ข้อมือคุณ "ฉันชื่อมิร่า จะไม่ลืมก็อบลินตัวนี้"' },
        lose: { fx: { hp: -15 }, text: 'ก็อบลินยามเห็นเข้า คุณโดนรุมจนสลบ เธอหนีไปได้เองระหว่างนั้น' } },
      { t: 'ตะโกนเรียกทั้งรังมารุม', stat: 'str', tag: 'fight', dc: 9,
        win: { fx: { str: 2, gold: 30, goal: 3 }, text: 'รังได้ชุดเกราะกับถุงเงินมาหนึ่งถุง หัวหน้ารังลูบหัวคุณเป็นครั้งแรก' },
        lose: { fx: { hp: -15 }, text: 'ดาบหักครึ่งยังฟันได้ คุณได้แผลเป็นยาวพาดหน้า' } },
      { t: 'ยึดดาบไว้แล้วไล่เธอไป', fx: { str: 1, gold: 10 }, text: 'เธอกระโผลกกระเผลกหนีเข้าป่า คุณได้ดาบหักครึ่งไว้ขู่ตัวอื่น' },
    ] },
  // ใบตามของ gb3 — follow = ไม่อยู่ในกองสุ่ม · มาเมื่อช่วยนักผจญภัยออกจากรังได้
  { id: 'gb3b', worlds: ['goblin'], ch: [3], follow: true, title: 'ผ้าเช็ดหน้าผืนเดิม',
    text: 'มิร่ากลับมาที่ปากหุบเขา ตอนนี้เป็นนักผจญภัยระดับเงินแล้ว เธอโบกผ้าเช็ดหน้าผืนเดิม "หมู่บ้านฉันอยากซื้อเห็ดในถ้ำพวกนาย ขายไหม"',
    choices: [
      { t: 'ตกลง เปิดตลาดเห็ดที่ปากหุบ', stat: 'cha', tag: 'trade', dc: 12, bonus: { flag: 'tally', add: 15 },
        win: { fx: { goal: 15, gold: 150, fame: 8 }, text: 'ก็อบลินที่นับเลขเป็นทอนเงินถูกทุกเหรียญ คนจากหมู่บ้านเริ่มมาซื้อทุกตลาดนัด' },
        lose: { fx: { goal: 3, gold: -20 }, text: 'ก็อบลินกินเห็ดที่จะขายไปครึ่งกระสอบระหว่างทาง ตลาดนัดแรกเลยมีของแค่สามกอง' } },
      { t: 'ขอให้เธอบอกกิลด์ว่ารังนี้ไม่ทำร้ายใคร', fx: { goal: 8, hp: 10 }, text: 'ป้ายประกาศล่าก็อบลินในหุบนี้ถูกปลดลงจากกระดานกิลด์ รังนอนหลับเต็มอิ่มได้เป็นครั้งแรก' },
    ] },
  { id: 'gb4', worlds: ['goblin'], ch: [2, 3], title: 'หัวหน้ารังแก่แล้ว',
    text: 'หัวหน้ารังฟันหลุดไปครึ่งปาก ก็อบลินตัวโตสามตัวเริ่มยืนห่างจากเขาแล้วซุบซิบกัน ใครตัวใหญ่สุดจะได้ครองรัง ตามธรรมเนียมที่ไม่มีใครเขียนไว้',
    choices: [
      { t: 'ท้าดวลแย่งตำแหน่ง', stat: 'str', tag: 'fight', dc: 14,
        win: { fx: { goal: 15, fame: 5, str: 2 }, text: 'คุณตัวเล็กกว่าแต่ไม่ยอมล้ม ตัวโตทั้งสามยอมก้มหัวให้ก่อนพระอาทิตย์ขึ้น' },
        lose: { fx: { hp: -25 }, text: 'ฟันคุณหักไปสองซี่ แต่ทั้งรังจำได้ว่าตัวเล็กตัวนี้กล้า' } },
      { t: 'รวมเสียงก็อบลินตัวเล็กทั้งรัง', stat: 'cha', tag: 'talk', dc: 12, bonus: { flag: 'tally', add: 15 },
        win: { fx: { goal: 15, cha: 2 }, text: 'ตัวเล็กมีมากกว่าตัวโตสิบเท่า นับกันทีละตัว คุณได้ครองรังโดยไม่มีใครเลือดออก' },
        lose: { fx: { goal: 3, hp: -10 }, text: 'ตัวเล็กหนีหมดตอนตัวโตคำราม เหลือคุณยืนอยู่คนเดียว' } },
      { t: 'พาพวกที่อยากไปออกไปตั้งรังใหม่', stat: 'luk', tag: 'sneak', dc: 11,
        win: { fx: { goal: 10, luk: 3 }, text: 'ถ้ำใหม่หลังน้ำตกแห้งและกว้าง ก็อบลินสิบสองตัวที่ตามมาเรียกคุณว่าหัวหน้า' },
        lose: { fx: { hp: -15 }, text: 'ถ้ำที่เจอมีหมีอยู่ก่อน ทุกตัววิ่งกลับรังเดิมทั้งน้ำตา' } },
    ] },
  { id: 'gb5', worlds: ['goblin'], ch: [3], title: 'นักล่าก็อบลินมาถึงหุบเขา',
    text: 'ชายในเกราะเหล็กเต็มตัวเดินเข้าหุบเขาคนเดียว ข่าวลือว่าเขาล้างรังก็อบลินมาแล้วร้อยรัง และไม่เคยฟังใครพูด',
    choices: [
      { t: 'พาทั้งรังหนีทางอุโมงค์ลึก', stat: 'luk', tag: 'sneak', dc: 15,
        win: { fx: { goal: 15, luk: 2 }, text: 'ก็อบลินทุกตัวรอดออกไปอีกฝั่งเขา เขาเจอแต่ถ้ำว่างกับกองกระดูกเก่า' },
        lose: { fx: { goal: -5, hp: -25 }, text: 'อุโมงค์ถล่มกลางทาง ครึ่งรังติดอยู่ข้างหลัง คุณกลับไปขุดจนเล็บหลุด' } },
      { t: 'ออกไปโบกผ้าขาวคุยกับเขา', stat: 'cha', tag: 'talk', dc: 18, bonus: { flag: 'humanpal', add: 25 },
        win: { fx: { goal: 20, fame: 10 }, text: 'เขาเห็นผ้าเช็ดหน้าของนักผจญภัยที่ข้อมือคุณ แล้ววางดาบลงช้า ๆ "มิร่าเคยเล่าเรื่องเจ้า"' },
        lose: { fx: { hp: -35 }, text: 'เขาไม่ฟังจริง ๆ คุณรอดมาได้เพราะตัวเล็กพอมุดซอกหิน' } },
      { t: 'วางกับดักทั่วหุบเขา', stat: 'str', tag: 'fight', dc: 16,
        win: { fx: { goal: 10, str: 3, fame: 5 }, text: 'เขาตกหลุมขวากแล้วถอยกลับไปพร้อมขาที่เจ็บ รังรอดไปอีกหลายปี' },
        lose: { fx: { hp: -35 }, text: 'เขาข้ามกับดักทุกอันเหมือนเคยเห็นมาแล้วร้อยครั้ง' } },
    ] },

  // ─── ลูกจอมมาร ───
  { id: 'dk1', worlds: ['demonchild'], ch: [1], title: 'พี่เลี้ยงแวมไพร์',
    text: 'พี่เลี้ยงแวมไพร์ยื่นถ้วยเลือดอุ่น ๆ มาให้ "องค์ชายต้องดื่มทุกเช้าจะได้โตไว" คุณยังจำรสนมจืดตราหมีได้ดี',
    choices: [
      { t: 'ขอนมวัวแทน', stat: 'cha', tag: 'talk', dc: 8,
        win: { fx: { cha: 3, hp: 10 }, text: 'เธอหน้าซีดกว่าเดิม แต่ก็ไปรีดนมวัวมาให้เอง ปราสาทมืดมีวัวหนึ่งตัวตั้งแต่วันนั้น' },
        lose: { fx: { hp: -5 }, text: 'เธอบีบจมูกแล้วกรอกให้ คุณสำลักจนน้ำตาไหล' } },
      { t: 'แอบเปิดตำราเวทมืดในห้องพ่อ', stat: 'mag', tag: 'magic', dc: 8,
        win: { fx: { mag: 4 }, text: 'คุณจุดไฟดำบนปลายนิ้วได้ตอนสามขวบ พ่อดีใจจนจัดงานเลี้ยงเจ็ดวัน' },
        lose: { fx: { hp: -10, mag: 1 }, text: 'ไฟดำย้อนกลับมาไหม้คิ้ว คุณไม่มีคิ้วไปทั้งปี' } },
      { t: 'ร้องไห้ดังจนปราสาทสั่น', fx: { mag: 2, hp: 5 }, text: 'ค้างคาวทั้งปราสาทบินหนี พี่เลี้ยงยอมเอาถ้วยออกไปแล้วกล่อมจนคุณหลับ' },
    ] },
  { id: 'dk2', worlds: ['demonchild'], ch: [1, 2], title: 'บทเรียนแรกของสายจอมมาร',
    text: 'พ่อพาคุณลงคุกใต้ปราสาท อัศวินมนุษย์คนหนึ่งถูกล่ามอยู่ "ลูกจอมมารต้องตัดสินเชลยคนแรกด้วยตัวเอง ข้าจะดู"',
    choices: [
      { t: 'ร่ายเวทลงโทษตามธรรมเนียม', stat: 'mag', tag: 'magic', dc: 10,
        win: { fx: { goal: 10, mag: 2, fame: 5 }, text: 'พ่อพยักหน้าช้า ๆ ทหารปีศาจกระซิบกันว่าองค์ชายคนเล็กไม่ธรรมดา' },
        lose: { fx: { goal: 3, hp: -10 }, text: 'เวทไม่ออก พ่อถอนหายใจแล้วเดินขึ้นบันไดไปก่อน' } },
      { t: 'สั่งให้เขาไปทำงานในสวนปราสาท', fx: { goal: 3, cha: 1 }, text: 'พ่อเลิกคิ้ว แต่ไม่ว่าอะไร อีกสิบปีต่อมาสวนของปราสาทมืดมีดอกกุหลาบเป็นครั้งแรก' },
      { t: 'กลางดึกแอบไขกุญแจปล่อยเขาไป', stat: 'luk', tag: 'sneak', dc: 11,
        win: { fx: { cha: 2, luk: 2 }, flag: 'mercy', text: 'เขาหันกลับมามองคุณที่ประตูหลังปราสาท "ข้าจะเล่าให้พระราชาฟังว่าลูกจอมมารไม่เหมือนที่เราคิด"' },
        lose: { fx: { hp: -20, goal: -5 }, text: 'ยามจับได้คาประตู พ่อขังคุณไว้ในหอคอยหนึ่งเดือน' } },
    ] },
  { id: 'dk3', worlds: ['demonchild'], ch: [2], title: 'ถ้วยไวน์ของพี่ชาย',
    text: 'งานเลี้ยงวันเกิดคุณ พี่ชายคนโตยกถ้วยไวน์มาให้ด้วยตัวเอง ยิ้มกว้างผิดปกติ ไวน์ในถ้วยมีฟองเล็ก ๆ ที่ไม่ควรมี',
    choices: [
      { t: 'ส่องถ้วยด้วยเวทประเมิน', stat: 'mag', tag: 'appraise', dc: 13,
        win: { fx: { goal: 8, mag: 2 }, flag: 'proof', text: 'พิษงูดำสามหยด คุณเก็บถ้วยไว้ในห้องลับ ไม่พูดอะไรสักคำ' },
        lose: { fx: { hp: -25 }, text: 'มองไม่ออก ดื่มไปครึ่งถ้วยก่อนจะรู้ตัว นอนซมไปทั้งฤดู' } },
      { t: 'ดื่มให้หมด แล้วยิ้มตอบ', stat: 'str', tag: 'fight', dc: 13,
        win: { fx: { str: 3, fame: 5, hp: -10 }, text: 'พิษไม่พอจะล้มลูกจอมมาร พี่ชายหน้าซีดทั้งคืน ทั้งราชสำนักเห็น' },
        lose: { fx: { hp: -30 }, text: 'คุณล้มกลางงานเลี้ยง หมอหลวงเฝ้าอยู่สามวันกว่าจะฟื้น' } },
      { t: 'แอบสลับถ้วยกับพี่ชาย', stat: 'luk', tag: 'sneak', dc: 13,
        win: { fx: { goal: 10, luk: 2 }, text: 'พี่ชายดื่มรวดเดียวหมด แล้วต้องนอนติดเตียงไปทั้งปี ไม่มีใครพิสูจน์ได้ว่าใครทำ' },
        lose: { fx: { hp: -20 }, text: 'มือคุณช้าไป พี่ชายเห็น ถ้วยหล่นแตก กลิ่นพิษลอยทั่วห้องโถง' } },
    ] },
  { id: 'dk4', worlds: ['demonchild'], ch: [2, 3], title: 'ทูตมนุษย์ที่ชายแดน',
    text: 'พ่อส่งคุณไปพบทูตมนุษย์ที่ป้อมชายแดน "ไปทำให้มันกลัว" ทูตเป็นหญิงแก่ถือแค่ม้วนกระดาษ ไม่มีทหารตามมาสักคน',
    choices: [
      { t: 'เสนอเปิดด่านค้าขาย', stat: 'cha', tag: 'talk', dc: 15, bonus: { flag: 'mercy', add: 20 },
        win: { fx: { goal: 15, fame: 8 }, flag: 'border', next: 'dk4b', text: 'เธอคลี่ม้วนกระดาษออก ข้างในเป็นร่างสัญญาค้าขายที่เตรียมมาแล้ว "ข้ารอคนที่จะพูดประโยคนี้มาสามสิบปี"' },
        lose: { fx: { goal: 3 }, text: 'เธอไม่เชื่อว่าลูกจอมมารพูดจริง กลับไปโดยไม่เซ็นอะไร' } },
      { t: 'ข่มด้วยเวทให้เห็นพลัง', stat: 'mag', tag: 'magic', dc: 13,
        win: { fx: { goal: 10, mag: 2, fame: 5 }, text: 'ฟ้าเหนือป้อมมืดลงครึ่งวัน เธอกลับไปรายงานว่าลูกจอมมารน่ากลัวกว่าพ่อ' },
        lose: { fx: { hp: -10 }, text: 'เวทพลาดไปเผาหลังคาป้อมตัวเอง ทูตยืนดูเฉย ๆ' } },
      { t: 'รับถุงทองแล้วปล่อยกองคาราวานมนุษย์ผ่าน', fx: { gold: 300 }, text: 'ถุงทองหนักมือ แต่ทหารปีศาจที่เฝ้าด่านไม่ได้ส่วนแบ่ง และเริ่มมองคุณแปลก ๆ' },
    ] },
  // ใบตามของ dk4 — มาเมื่อทูตเซ็นสัญญาเปิดด่าน
  { id: 'dk4b', worlds: ['demonchild'], ch: [3], follow: true, title: 'ตลาดแรกบนพรมแดน',
    text: 'ตลาดนัดแรกระหว่างมนุษย์กับปีศาจเปิดที่ลานหน้าด่าน ยังไม่ทันเที่ยง ออร์กกับพ่อค้าผ้าก็เถียงกันเรื่องตาชั่งจนเริ่มชักมีด',
    choices: [
      { t: 'ลงไปยืนกลางตลาดตัดสินเอง', stat: 'cha', tag: 'talk', dc: 14,
        win: { fx: { goal: 15, fame: 10 }, text: 'คุณให้ทั้งสองฝ่ายชั่งของบนตาชั่งเดียวกันต่อหน้าทุกคน ตลาดเปิดต่อจนค่ำ และเปิดทุกเดือนนับจากนั้น' },
        lose: { fx: { goal: 3, hp: -15 }, text: 'ทั้งสองฝ่ายหันมาโทษคุณแทน ตลาดปิดไปสามเดือน' } },
      { t: 'กางเวทแบ่งเขตห้ามชักอาวุธ', stat: 'mag', tag: 'magic', dc: 14,
        win: { fx: { goal: 12, mag: 2 }, text: 'ใครชักมีดในเขตเวท มีดกลายเป็นดอกไม้ ออร์กถือช่อดอกไม้ยืนงงอยู่นาน' },
        lose: { fx: { goal: 3, hp: -10 }, text: 'เวทกินมานาเกินตัว คุณหมดแรงกลางตลาด ต้องให้พ่อค้ามนุษย์หามกลับ' } },
    ] },
  { id: 'dk5', worlds: ['demonchild'], ch: [3], title: 'บัลลังก์ว่าง',
    text: 'จอมมารประกาศสละบัลลังก์ สภาปีศาจทั้งเจ็ดเผ่าจะเลือกผู้สืบทอดจากลูกทั้งสี่ พี่ชายคนโตมองคุณข้ามโต๊ะประชุมไม่วางตา',
    choices: [
      { t: 'วางหลักฐานถ้วยพิษต่อหน้าสภา', stat: 'cha', tag: 'talk', dc: 18, bonus: { flag: 'proof', add: 25 }, bonus2: { flag: 'border', add: 10 },
        win: { fx: { goal: 20, fame: 10 }, text: 'สภาเงียบทั้งห้อง พี่ชายถูกตัดสิทธิ์ เสียงข้างมากยกให้คุณ' },
        lose: { fx: { goal: 5, fame: -10 }, text: 'สภาไม่เชื่อ หาว่าคุณใส่ร้ายพี่เพื่อแย่งบัลลังก์' } },
      { t: 'ท้าประลองเวทกับพี่ทั้งสาม', stat: 'mag', tag: 'magic', dc: 20,
        win: { fx: { goal: 20, fame: 15, mag: 2 }, text: 'ไฟดำของคุณกลืนเวทของพี่ทั้งสามในคราวเดียว สภาลุกขึ้นยืนทั้งห้อง' },
        lose: { fx: { hp: -40 }, text: 'พี่ทั้งสามรุมคุณพร้อมกัน ไม่มีใครในสภาห้าม' } },
      { t: 'ถอนตัว ขอไปอยู่หอคอยชายแดน', fx: { hp: 15, luk: 3, goal: 5 }, text: 'คุณได้หอคอยหนึ่งหลังกับแมวดำหนึ่งตัว พี่ ๆ แย่งกันต่อโดยไม่มีใครสนใจคุณ' },
    ] },

  // ─── ทุกโลก (worlds ว่าง = ทุกโลก) ───
  { id: 'g_guild', worlds: ['hero', 'noble', 'slowlife'], ch: [1, 2], title: 'ลงทะเบียนกิลด์นักผจญภัย',
    text: 'พนักงานสาวหูแมวยื่นแผ่นวัดพลังมาให้ "วางมือได้เลยค่ะ ปกติจะขึ้นแรงค์ F"',
    choices: [
      { t: 'วางมือเต็มกำลัง', stat: 'mag', tag: 'magic', dc: 10,
        win: { fx: { fame: 12, gold: 100 }, text: 'แผ่นวัดแตกกลางโต๊ะ ทั้งกิลด์เงียบ แล้วก็มีคนตะโกนว่า "แรงค์ S!"' },
        lose: { fx: { gold: -100 }, text: 'แผ่นวัดแตกเพราะคุณกดแรงเกิน ต้องจ่ายค่าซ่อม' } },
      { t: 'กดเบา ๆ ขอแรงค์ F พอ', fx: { luk: 3, hp: 5 }, text: 'ไม่มีใครสนใจ ได้รับงานเก็บสมุนไพรเงียบ ๆ ชีวิตสงบดี' },
    ] },
  { id: 'g_goblin', worlds: ['hero', 'noble', 'slowlife', 'villainess'], ch: [1, 2], title: 'ก็อบลินดักปล้นรถม้า',
    text: 'กลางทางป่า ก็อบลินสิบกว่าตัวกระโดดออกมาล้อมรถม้า สารถีตัวสั่น',
    choices: [
      { t: 'ลงไปสู้', stat: 'str', tag: 'fight', dc: 10,
        win: { fx: { gold: 150, str: 2, fame: 5 }, text: 'ล้มหมดในสองนาที เจอถุงทองที่มันปล้นมาก่อนหน้า' },
        lose: { fx: { hp: -20 }, text: 'ชนะ แต่โดนกระบองไม้ฟาดหัว' } },
      { t: 'ร่ายเวทไฟ', stat: 'mag', tag: 'magic', dc: 10,
        win: { fx: { gold: 150, mag: 2 }, text: 'ไฟวงเดียว ก็อบลินวิ่งหนีกระเจิง' },
        lose: { fx: { hp: -15 }, text: 'ไฟลามมาโดนผ้าคลุมรถม้า' } },
      { t: 'สั่งสารถีควบหนี', stat: 'luk', tag: 'sneak', dc: 8,
        win: { fx: { luk: 2 }, text: 'รถม้าพุ่งทะลุวงล้อมไปได้' },
        lose: { fx: { hp: -10, gold: -50 }, text: 'ล้อหลุด ต้องทิ้งของบางส่วนไว้' } },
    ] },
  { id: 'g_shop', worlds: ['hero', 'noble', 'slowlife', 'villainess'], ch: [2, 3], title: 'ร้านของเก่าในตรอก',
    text: 'ยายแก่ขายของในตรอกมืดชี้ไปที่ดาบสนิมเขรอะ "ร้อยเหรียญ ไม่ต่อ"',
    choices: [
      { t: 'ส่องดูให้ดีก่อนซื้อ', stat: 'mag', tag: 'appraise', dc: 12, need: { gold: 100 },
        win: { fx: { gold: -100, str: 6 }, text: 'ใต้สนิมคือดาบในตำนานที่หายไปห้าร้อยปี ยายแก่ยิ้มแปลก ๆ แล้วหายไป' },
        lose: { fx: { gold: -100 }, text: 'ดาบสนิมธรรมดา ใช้หั่นผักยังไม่ได้' } },
      { t: 'ซื้อสร้อยที่ยายแถมให้แทน', fx: { luk: 4 }, text: 'สร้อยเรืองแสงเบา ๆ ตอนกลางคืน รู้สึกโชคดีขึ้นมานิดหนึ่ง' },
    ] },
  { id: 'g_slave', worlds: ['hero', 'noble', 'slowlife'], ch: [2, 3], title: 'ตลาดค้าทาส',
    text: 'เด็กสาวเผ่าหูจิ้งจอกถูกล่ามโซ่อยู่ในกรง ป้ายราคาเขียนว่า 300 เหรียญ คนขายยิ้มเห็นฟันทอง',
    choices: [
      { t: 'จ่ายไถ่ตัวแล้วปล่อยเป็นอิสระ', need: { gold: 300 }, fx: { gold: -300, cha: 4, fame: 5 }, flag: 'companion', text: 'เธอไม่ยอมไปไหน "ข้าจะตามท่านไปจนกว่าจะใช้หนี้หมด" ทั้งที่คุณบอกว่าไม่มีหนี้' },
      { t: 'แจ้งกองทหารเรื่องค้าคนผิดกฎหมาย', stat: 'cha', tag: 'talk', dc: 14,
        win: { fx: { fame: 15, cha: 2 }, text: 'ทหารบุกตลาด ปล่อยทุกคนในกรง คุณได้คำขอบคุณจากเผ่าจิ้งจอกทั้งเผ่า' },
        lose: { fx: { hp: -15 }, text: 'ทหารคนนั้นรับส่วยจากตลาด คุณโดนอันธพาลรุมตอนกลางคืน' } },
      { t: 'เดินผ่านไป', fx: { luk: -3 }, text: 'สายตาเด็กคนนั้นตามคุณไปจนถึงปลายตลาด' },
    ] },
  // minFame = ต้องมีชื่อเสียงถึงก่อนเรื่องนี้จะมาหา (B68b · เรื่องระหว่างชีวิตผูกชื่อเสียง ไม่ผูกบุญบาป)
  { id: 'g_dragon', worlds: null, ch: [2, 3], minFame: 15, title: 'มังกรแก่ในถ้ำทอง',
    text: 'มังกรสีมรกตนอนขดบนกองทอง ลืมตาข้างเดียว "สิ่งมีชีวิตจากต่างโลก กลิ่นของเจ้าแปลกดี"',
    choices: [
      { t: 'นั่งคุยกับมัน', stat: 'cha', tag: 'talk', dc: 16,
        win: { fx: { mag: 5, goal: 5 }, flag: 'dragonfriend', text: 'มันเล่าประวัติโลกนี้ให้ฟังหนึ่งคืน แล้วสอนเวทโบราณให้หนึ่งบท' },
        lose: { fx: { hp: -10 }, text: 'มันเบื่อ เป่าลมใส่จนคุณกลิ้งออกจากถ้ำ' } },
      { t: 'แอบหยิบทองตอนมันหลับต่อ', stat: 'luk', tag: 'sneak', dc: 18,
        win: { fx: { gold: 1000 }, text: 'ได้ทองเต็มกระเป๋า มันกรนต่อไม่รู้ตัว หรือแกล้งไม่รู้' },
        lose: { fx: { hp: -40 }, text: 'ตามันเปิดทั้งสองข้าง คุณรอดมาได้ แต่ไม่ใช่ทั้งตัว' } },
      { t: 'ค่อย ๆ ถอยออกมา', fx: { luk: 2 }, text: 'ออกมามือเปล่า แต่แขนขายังครบ' },
    ] },
  { id: 'g_festival', worlds: ['hero', 'noble', 'slowlife', 'villainess'], ch: [2, 3], title: 'เทศกาลแข่งทำอาหาร',
    text: 'เมืองจัดเทศกาลเก็บเกี่ยว มีแข่งทำอาหาร รางวัลคือทอง 500 เหรียญ คุณมองวัตถุดิบแล้วนึกถึงตลาดสดที่บ้าน',
    choices: [
      { t: 'ส้มตำปูปลาร้า (ปลาร้าหมักเอง)', stat: 'cha', tag: 'cook', dc: 14,
        win: { fx: { gold: 500, fame: 12 }, text: 'กรรมการร้องไห้ทั้งแถว ไม่รู้เพราะเผ็ดหรือเพราะอร่อย ได้รางวัลที่หนึ่ง' },
        lose: { fx: { fame: -8 }, text: 'กลิ่นปลาร้าทำให้กรรมการลุกหนี ถูกตัดสิทธิ์' } },
      { t: 'ข้าวมันไก่ ปลอดภัยไว้ก่อน', stat: 'cha', tag: 'cook', dc: 10,
        win: { fx: { gold: 250, fame: 6 }, text: 'ได้ที่สอง และได้แฟนคลับข้าวมันไก่ทั้งเมือง' },
        lose: { fx: { gold: -50 }, text: 'ข้าวแฉะ ไก่ไม่สุก จบอันดับท้าย' } },
    ] },
  { id: 'g_goddess', worlds: null, ch: [2, 3], title: 'เทพธิดาโผล่มาในฝัน',
    text: 'เทพธิดาที่ส่งคุณมาโผล่ในฝัน กำลังกินมันฝรั่งทอด "เป็นยังไงบ้าง มีอะไรอยากขอไหม"',
    choices: [
      { t: 'ขอสกิลเพิ่มอีกอัน', stat: 'luk', dc: 14,
        win: { fx: {}, skill: true, text: 'เธอโยนสกิลมาให้อันหนึ่ง "อย่าบอกท่านพ่อนะ"' },
        lose: { fx: { luk: -2 }, text: 'เธอหลับคาฝันก่อนคุณพูดจบ' } },
      { t: 'ถามว่าครอบครัวที่โลกเดิมเป็นยังไง', fx: { cha: 3, luk: 3, hp: 10 }, text: 'เธอยิ้มแล้วโชว์ภาพ คนที่บ้านทำบุญให้คุณทุกวันพระ และยังอยู่กันพร้อมหน้า คุณตื่นมาน้ำตาเปียกหมอน' },
      { t: 'ขอทางกลับโลกเดิม', fx: { mag: 3 }, flag: 'homeway', text: '"มีทางนะ แต่ยังไม่ใช่ตอนนี้" เธอทิ้งแผนที่ดาวไว้ข้างหมอนคุณ' },
    ] },
  { id: 'g_home', worlds: null, ch: [1, 2, 3], title: 'คิดถึงรสชาติบ้าน',
    text: 'อาหารที่นี่มีแต่ขนมปังแข็งกับซุปจืด คุณนึกถึงข้าวเหนียวหมูปิ้งตอนเช้าที่ปากซอย',
    choices: [
      { t: 'ประดิษฐ์มายองเนส', stat: 'luk', tag: 'trade', dc: 10,
        win: { fx: { gold: 300, fame: 5 }, text: 'มายองเนสระบาดทั้งเมือง พ่อค้าแย่งสูตรกัน' },
        lose: { fx: { hp: -10 }, text: 'ไข่ที่นี่ไม่สด ท้องเสียสามวัน' } },
      { t: 'หมักน้ำปลาจากปลาท้องถิ่น', stat: 'cha', tag: 'cook', dc: 12,
        win: { fx: { gold: 200, cha: 3 }, text: 'สามเดือนต่อมา น้ำปลาขวดแรกของโลกนี้ถือกำเนิด' },
        lose: { fx: { fame: -5 }, text: 'เพื่อนบ้านร้องเรียนเรื่องกลิ่นจนต้องเททิ้ง' } },
      { t: 'ร้องไห้เงียบ ๆ คืนเดียว', fx: { hp: 10, cha: 2 }, text: 'เช้ามาตาบวม แต่ใจเบาขึ้น โลกนี้ก็มีพระอาทิตย์ขึ้นเหมือนกัน' },
    ] },
  { id: 'g_dungeon', worlds: ['hero', 'noble', 'monster', 'slowlife'], ch: [2, 3], title: 'ดันเจี้ยนเปิดใหม่',
    text: 'ประตูหินโผล่กลางทุ่งเมื่อคืน ข้างในมีเสียงเหรียญกระทบกัน และเสียงคำราม',
    choices: [
      { t: 'บุกลึกถึงชั้นบอส', stat: 'str', tag: 'fight', dc: 16,
        win: { fx: { gold: 500, str: 4 }, text: 'ล้มมิโนทอร์ชั้นสิบ ได้หีบสมบัติกับขวานยักษ์' },
        lose: { fx: { hp: -30 }, text: 'มิโนทอร์เร็วกว่าที่คิด คุณคลานออกมาเกือบไม่รอด' } },
      { t: 'ไล่อ่านกับดักด้วยเวท', stat: 'mag', tag: 'appraise', dc: 14,
        win: { fx: { gold: 350, mag: 3 }, text: 'เดินผ่านกับดักทุกตัว เจอห้องลับที่ไม่มีใครเคยเห็น' },
        lose: { fx: { hp: -20 }, text: 'พื้นถล่ม ตกลงไปชั้นล่างทั้งตัว' } },
      { t: 'เก็บแค่ชั้นแรกพอ', fx: { gold: 80, luk: 1 }, text: 'ได้ของนิดหน่อย กลับบ้านทันข้าวเย็น' },
    ] },
  { id: 'g_thai', worlds: ['hero', 'noble', 'slowlife', 'villainess'], ch: [2, 3], title: 'เสียงบ่นภาษาไทย',
    text: 'กลางตลาด มีคนบ่นดัง ๆ ว่า "ร้อนจะตายอยู่แล้ว อยากกินชาเย็น" เป็นภาษาไทยชัดแจ๋ว',
    choices: [
      { t: 'ทักว่า "สวัสดี"', stat: 'cha', tag: 'talk', dc: 8,
        win: { fx: { cha: 3, luk: 3 }, flag: 'thaifriend', next: 'g_thai2', text: 'เขาตกใจจนทำแอปเปิ้ลหล่น สองคนนั่งคุยถึงหมูกระทะจนตลาดวาย' },
        lose: { fx: { luk: 1 }, text: 'เขาวิ่งหนี คิดว่าคุณเป็นผีจากโลกเดิม' } },
      { t: 'แอบตามดูก่อนว่าเป็นใคร', stat: 'luk', tag: 'sneak', dc: 12,
        win: { fx: { luk: 3, gold: 150 }, text: 'เขาเป็นพ่อค้าที่รวยที่สุดในเมือง และเปิดตลาดนัดคลองถมจำลอง' },
        lose: { fx: { hp: -5 }, text: 'ตามจนหลง เดินชนแผงผลไม้' } },
    ] },
  // ใบตามของ g_thai — follow = ไม่อยู่ในกองสุ่ม · เข้าคิวก่อนฉากสุดท้ายเมื่อได้ธง thaifriend
  { id: 'g_thai2', worlds: ['hero', 'noble', 'slowlife', 'villainess'], ch: [3], follow: true, title: 'ข้าวเหนียวมะม่วงต่างโลก',
    text: 'คนไทยจากตลาดวันนั้นมาเคาะประตู ถือห่อใบตองมาด้วย "ลองทำข้าวเหนียวมะม่วงดู มะม่วงที่นี่รสแปลก ๆ หน่อยนะ"',
    choices: [
      { t: 'ชวนเปิดร้านอาหารไทยด้วยกัน', stat: 'cha', tag: 'talk', dc: 10,
        win: { fx: { gold: 300, fame: 5 }, text: 'ร้านส้มตำต่างโลกคิวยาวถึงหัวถนน คนแถวนี้เผ็ดจนน้ำตาไหลแต่ก็กลับมาทุกวัน' },
        lose: { fx: { gold: -50 }, text: 'พริกที่นี่เผ็ดเกินไป ลูกค้าคนแรกพ่นไฟออกมาจริง ๆ ต้องปิดร้านซ่อมหลังคา' } },
      { t: 'นั่งกินด้วยกัน คุยเรื่องบ้าน', fx: { hp: 10, luk: 3 }, text: 'สองคนนั่งเงียบไปพักหนึ่ง แล้วหัวเราะพร้อมกันตอนนึกถึงเสียงรถสองแถว' },
    ] },
  { id: 'g_fairy', worlds: null, ch: [1, 2], title: 'ภูตจิ๋วติดใยแมงมุม',
    text: 'ภูตตัวเท่านิ้วโป้งดิ้นอยู่ในใยแมงมุม ปีกใสสะท้อนแสงเจ็ดสี',
    choices: [
      { t: 'ช่วยปลดออก', fx: { luk: 5 }, flag: 'fairy', text: 'ภูตบินวนหัวคุณสามรอบ แล้วนั่งบนไหล่ไม่ยอมไปไหน' },
      { t: 'จับใส่ขวดไปขาย', fx: { gold: 200, luk: -5 }, text: 'ได้เงินดี แต่คืนนั้นฝันร้ายตลอดคืน' },
    ] },
  { id: 'g_storm', worlds: null, ch: [3], title: 'พายุมานา',
    text: 'ฟ้ากลายเป็นสีม่วง มานาในอากาศปั่นป่วน สัตว์ป่าคลั่ง ผู้คนวิ่งหาที่หลบ',
    choices: [
      { t: 'ดูดซับมานาส่วนเกินเข้าตัว', stat: 'mag', tag: 'magic', dc: 16,
        win: { fx: { mag: 6, goal: 5 }, text: 'มานาไหลเข้าตัวจนผมเรืองแสง พายุสงบลงเร็วกว่าที่ควร' },
        lose: { fx: { hp: -30 }, text: 'รับไม่ไหว เส้นมานาไหม้ ไข้ขึ้นสามวัน' } },
      { t: 'พาคนแถวนั้นหลบเข้าถ้ำ', stat: 'cha', tag: 'talk', dc: 12,
        win: { fx: { fame: 10, cha: 2 }, text: 'ทุกคนรอด เด็ก ๆ เรียกคุณว่าพี่ใหญ่' },
        lose: { fx: { hp: -15 }, text: 'ถ้ำมีหมีอยู่ก่อนแล้ว' } },
    ] },
  // ─── ตำนานชาติก่อน (B68i) ───
  // legend = มาเฉพาะในโลกที่จำคนต่างโลกรุ่นก่อนแบบนั้น (hero/dark) · {legend} = ชื่อของคนล่าสุดในตำนานแบบนั้น
  { id: 'lg_statue', worlds: null, ch: [1, 2, 3], legend: 'hero', title: 'รูปปั้นกลางจัตุรัส',
    text: 'กลางจัตุรัสมีรูปปั้น{legend} ตะไคร่ขึ้นครึ่งตัว ยายที่นั่งขายผักข้างฐานเล่าว่าคนคนนี้ก็มาจากต่างโลกเหมือนกัน',
    choices: [
      { t: 'ช่วยยายขัดรูปปั้นให้สะอาด', fx: { luk: 2, fame: 2 }, text: 'ยายเล่าเรื่องของ{legend}ให้ฟังจนตลาดวาย ครึ่งหนึ่งน่าจะแต่งเพิ่มเอง' },
      { t: 'บอกยายว่าตัวเองมาจากที่เดียวกัน', stat: 'cha', tag: 'talk', dc: 14,
        win: { fx: { fame: 8, cha: 2 }, text: 'ยายไม่เชื่อ จนคุณร้องเพลงที่สลักใต้ฐานได้ทั้งที่ยังไม่ได้ก้มอ่าน ข่าวลือไปถึงอีกฝั่งเมืองก่อนค่ำ' },
        lose: { fx: { fame: -3 }, text: 'ยายหัวเราะ "เดือนนี้คนที่สามแล้ว"' } },
      { t: 'ยืนดูเงียบ ๆ แล้วเดินต่อ', fx: { luk: 1 }, text: 'ใบหน้าหินนั้นดูคุ้นตาแปลก ๆ' },
    ] },
  { id: 'lg_heir', worlds: null, ch: [2, 3], legend: 'hero', title: 'หลานของคนที่เคยได้รับความช่วยเหลือ',
    text: 'ชายแก่คนหนึ่งจับมือคุณแน่น "ปู่ข้ารอดตายเพราะ{legend} ได้ยินว่าเจ้ามาจากที่เดียวกัน ให้ข้าตอบแทนบ้าง"',
    choices: [
      { t: 'รับน้ำใจไว้', fx: { gold: 150 }, text: 'ถุงเงินหนักกว่าที่คิด เขาบอกว่าปู่สั่งไว้ก่อนตาย' },
      { t: 'ไม่รับเงิน ขอช่วยงานในบ้านเขาแทน', fx: { cha: 2, fame: 3 }, text: 'ทั้งบ้านเลี้ยงข้าวคุณทุกเย็นไปอีกเดือน' },
      { t: 'ขอให้พาไปหาคนที่เคยเดินทางกับ{legend}', stat: 'cha', tag: 'talk', dc: 15,
        win: { fx: { mag: 2, fame: 5, goal: 5 }, text: 'แม่มดแก่ในหอคอยจำได้ทุกคำที่เพื่อนเก่าพูด สอนวิชาที่เคยสอนให้คนนั้นต่อให้คุณ' },
        lose: { fx: { luk: -2 }, text: 'คนสุดท้ายที่รู้จักตายไปเมื่อหน้าหนาวที่แล้ว' } },
    ] },
  { id: 'lg_fake', worlds: null, ch: [2, 3], legend: 'hero', title: 'คนที่อ้างว่ากลับชาติมาเกิด',
    text: 'ชายในชุดคลุมยืนบนลังไม้กลางตลาด ประกาศว่าตัวเองคือ{legend}กลับชาติมาเกิด แล้วเปิดรับเงินบริจาค ชาวบ้านต่อแถวยาว',
    choices: [
      { t: 'ถามเรื่องที่มีแต่คนต่างโลกตอบได้ ต่อหน้าทุกคน', stat: 'cha', tag: 'talk', dc: 16,
        win: { fx: { fame: 10 }, text: 'เขาตอบไม่ได้สักข้อ ชาวบ้านทวงเงินคืนแล้วหันมามองคุณแทน' },
        lose: { fx: { fame: -5 }, text: 'เขาเลี่ยงคำถามได้เนียน แล้วชี้ว่าคุณเป็นสายของปีศาจ' } },
      { t: 'ร่วมมือกับเขา แบ่งเงินกันครึ่งต่อครึ่ง', fx: { gold: 300, fame: 6 }, text: 'คนต่างโลกสองคนยืนยันกันเอง ใครจะไม่เชื่อ แถวยาวขึ้นอีกเท่าตัว' },
      { t: 'ปล่อยเขาไป', fx: { luk: 1 }, text: 'อย่างน้อยชาวบ้านก็ยังจำชื่อนั้นได้' },
    ] },
  { id: 'lg_fear', worlds: null, ch: [1, 2, 3], legend: 'dark', title: 'ชื่อที่ใช้ขู่เด็ก',
    text: 'แม่คนหนึ่งดุลูกเสียงดัง "ไม่นอนเดี๋ยว{legend}มาเอาตัวไป" แล้วหันมาเห็นคุณ คนในตรอกรู้กันว่าคุณมาจากต่างโลกเหมือนคนในนิทานนั้น',
    choices: [
      { t: 'ไม่บอกใครว่ามาจากที่ไหน', fx: { luk: 1 }, text: 'คุณเปลี่ยนสำเนียงอยู่หลายเดือน จนคนเลิกถาม' },
      { t: 'ช่วยงานทุกบ้านในตรอกจนคนลืมเรื่องเก่า', stat: 'cha', tag: 'talk', dc: 16,
        win: { fx: { fame: 6, cha: 2 }, text: 'สองปีต่อมาเด็กในตรอกเลิกกลัว เรียกคุณว่าคนต่างโลกคนดี' },
        lose: { fx: { fame: -4 }, text: 'ทำดีเท่าไรก็มีคนพูดว่าตอนแรก{legend}ก็ใจดีแบบนี้' } },
      { t: 'ใช้ชื่อนั้นขู่เอาของ', fx: { gold: 200, fame: 5 }, text: 'ไม่มีร้านไหนกล้าเก็บเงินคุณ ชื่อของคุณเริ่มถูกเล่าต่อท้ายนิทานเรื่องเดิม' },
    ] },
  { id: 'lg_hunter', worlds: null, ch: [2, 3], legend: 'dark', title: 'นักล่าคนต่างโลก',
    text: 'นักล่าสวมเกราะเก่ามาขวางทาง "{legend}ฆ่าครอบครัวข้า ข้าสาบานว่าจะล่าคนจากโลกนั้นทุกคน"',
    choices: [
      { t: 'สู้', stat: 'str', tag: 'fight', dc: 16,
        win: { fx: { str: 2, fame: 6 }, text: 'ดาบของเขาหัก คุณไม่ซ้ำ เขานั่งร้องไห้กลางถนนจนคุณเดินลับตา' },
        lose: { fx: { hp: -25 }, text: 'คุณหนีรอดมาพร้อมแผลยาวที่หลัง' } },
      { t: 'เล่าว่าคุณไม่ใช่คนคนนั้น และมาเพื่ออะไร', stat: 'cha', tag: 'talk', dc: 15,
        win: { fx: { cha: 2, goal: 5 }, text: 'เขาลดดาบลงช้า ๆ ก่อนจากไปบอกว่าจะคอยดูคุณ' },
        lose: { fx: { hp: -15, fame: -5 }, text: 'เขาไม่ฟังสักคำ คนทั้งถนนเห็นคุณวิ่งหนี' } },
      { t: 'ทิ้งของแล้วหนีเข้าป่า', fx: { gold: -100, luk: -2 }, text: 'รอดตัว แต่กระเป๋าทั้งใบอยู่กับเขา' },
    ] },
  { id: 'lg_ruin', worlds: null, ch: [2, 3], legend: 'dark', title: 'คฤหาสน์ไหม้บนเนิน',
    text: 'คฤหาสน์ของ{legend}ไหม้ดำอยู่บนเนิน ยังมีคนแอบมาจุดเทียน พวกเขาคุกเข่าให้คุณ "ท่านกลับมาแล้ว"',
    choices: [
      { t: 'รับเป็นหัวหน้าของพวกเขา', fx: { mag: 4, fame: 8 }, text: 'ลูกศิษย์ของคนรุ่นก่อนสอนเวทที่ถูกห้ามให้ทั้งคืน ชาวบ้านเริ่มพูดถึงคุณด้วยเสียงเบา ๆ' },
      { t: 'ไล่พวกเขาออกไปแล้วเผาเทียนทิ้ง', fx: { fame: 4, hp: -5 }, text: 'มีคนหนึ่งปาหินใส่ แต่คนที่เหลือเดินลงเนินไปเงียบ ๆ' },
      { t: 'ค้นห้องหนังสือที่ยังไม่ไหม้', stat: 'mag', tag: 'magic', dc: 15,
        win: { fx: { mag: 3, goal: 5 }, text: 'สมุดบันทึกเล่มสุดท้ายเขียนด้วยภาษาไทย อ่านแล้วนอนไม่หลับไปหลายคืน' },
        lose: { fx: { hp: -10 }, text: 'พื้นห้องผุพังลงไปทั้งแผ่น' } },
    ] },
  // ─── ยาต่ออายุ (B68k) ───
  // potion = ได้ยาแล้วดื่มทันที (isekaiDrink) · 4 ทาง: ดรอปจากการผจญภัย · ปรุงเอง (เวท/ความรู้แพทย์) · รางวัลของคนบุญถึง (bless) · ร้าน
  { id: 'pt_drop', worlds: null, ch: [2, 3], title: 'ขวดแก้วในถ้ำงู',
    text: 'ข้างโครงกระดูกนักผจญภัยมีกระเป๋าหนังเก่า ในนั้นมีขวดแก้วสีทองใสยังไม่แตก แต่งูใหญ่ขดตัวอยู่บนกระเป๋า',
    choices: [
      { t: 'ไล่งูออกไปแล้วเอากระเป๋ามา', stat: 'str', tag: 'fight', dc: 14,
        win: { fx: { str: 1 }, potion: true, text: 'งูเลื้อยหนีเข้าซอกหิน ยาในขวดหวานเหมือนน้ำผึ้ง ขาที่เคยปวดตอนเช้าหายเป็นปลิดทิ้ง' },
        lose: { fx: { hp: -20 }, text: 'งูฉกเข้าที่แขน คุณต้องทิ้งกระเป๋าแล้ววิ่งออกจากถ้ำ' } },
      { t: 'รอจนงูหลับแล้วค่อยหยิบ', stat: 'luk', tag: 'sneak', dc: 15,
        win: { fx: {}, potion: true, text: 'สามชั่วโมงผ่านไป งูไม่ขยับเลย มือคุณสั่นตอนดึงสายกระเป๋า แต่ได้มาจนได้' },
        lose: { fx: { hp: -10 }, text: 'กิ่งไม้หักใต้เท้า งูตื่นพอดี' } },
      { t: 'ฝังกระดูกให้เขาแล้วออกไป', fx: { luk: 2 }, text: 'คุณกองหินทับหลุมไว้ ขาออกรู้สึกตัวเบาแปลก ๆ' },
    ] },
  { id: 'pt_brew', worlds: null, ch: [2, 3], title: 'ตำรายาของหมอแก่',
    text: 'หมอยาในหมู่บ้านตายไปเมื่อหน้าหนาว ลูกสาวยกหีบตำราให้คุณ หน้าสุดท้ายเขียนสูตรยาที่ว่ากินแล้วอายุยืน แต่ยังไม่มีใครปรุงสำเร็จ',
    choices: [
      { t: 'ร่ายเวทเร่งให้สมุนไพรเข้ากัน', stat: 'mag', tag: 'magic', dc: 15,
        win: { fx: { mag: 2 }, potion: true, text: 'น้ำยาเปลี่ยนเป็นสีเขียวใสตอนรุ่งสาง คุณจิบไปครึ่งแก้วแล้วนอนหลับยาวที่สุดในรอบหลายปี' },
        lose: { fx: { hp: -10 }, text: 'หม้อแตกกลางเวท ห้องเต็มไปด้วยควันขม' } },
      { t: 'ต้มแบบที่หมอบ้านเกิดสอน กรอง ชั่ง จดทุกขั้น', know: 'medic', dc: 6,
        win: { fx: { cha: 1 }, potion: true, text: 'ครั้งที่เจ็ดได้ยาที่ไม่ขมและไม่ทำให้ท้องเสีย ลูกสาวหมอร้องไห้ตอนเห็นคุณดื่ม' },
        lose: { fx: { hp: -5 }, text: 'ยังขาดอะไรบางอย่างที่ตำราไม่ได้เขียน' } },
      { t: 'คืนตำราให้ลูกสาวเก็บไว้', fx: { cha: 2 }, text: 'เธอบอกว่าพ่อคงดีใจที่มีคนอ่านจนจบ' },
    ] },
  { id: 'pt_shrine', worlds: null, ch: [2, 3], bless: true, title: 'น้ำพุหลังศาลร้าง',
    text: 'คุณหลบฝนเข้าศาลร้างกลางป่า หลังแท่นบูชามีน้ำพุเล็ก ๆ ไหลอยู่ ยายเฝ้าศาลบอกว่าน้ำนี้ตักได้แค่คนที่เทพธิดาเอ็นดู',
    choices: [
      { t: 'ตักน้ำมาดื่ม', fx: {}, potion: true, text: 'น้ำเย็นจนฟันชา ยายพยักหน้าเหมือนรู้อยู่แล้ว' },
      { t: 'ตักใส่ขวดไปให้คนป่วยในหมู่บ้าน', fx: { cha: 2, fame: 3 }, text: 'ไข้ของเด็กคนนั้นลดลงตั้งแต่คืนแรก' },
      { t: 'ซ่อมหลังคาศาลให้ยายก่อน', fx: { str: 1, luk: 2 }, text: 'ฝนหยุดพอดีตอนตอกตะปูตัวสุดท้าย' },
    ] },
  { id: 'pt_shop', worlds: null, ch: [2, 3], adult: true, title: 'ร้านยาหลังหอนาฬิกา',
    text: 'ร้านแคบ ๆ มีขวดเรียงถึงเพดาน ป้ายเขียนว่า ยาต่ออายุ ขวดละสี่ร้อย ไม่ต่อราคา คนแก่สองคนต่อแถวรออยู่หน้าร้าน',
    choices: [
      { t: 'ซื้อหนึ่งขวด', need: { gold: 400 }, fx: { gold: -400 }, potion: true, text: 'เจ้าของร้านห่อขวดด้วยกระดาษสีน้ำตาล แล้วกำชับว่าอย่าดื่มเกินสองขวดในชีวิตเดียว' },
      { t: 'ดูว่าร้านนี้ของจริงไหม', stat: 'mag', tag: 'appraise', dc: 13,
        win: { fx: { mag: 1 }, text: 'ยาเป็นของจริง แต่คนต่อแถวบางคนดื่มมาแล้วหลายขวด ผิวขาวซีดเหมือนขี้ผึ้ง' },
        lose: { fx: {}, text: 'ดูยังไงก็เป็นแค่น้ำสีทองในขวด' } },
      { t: 'เดินผ่านไป', fx: {}, text: 'อายุเท่าที่มีก็พอแล้ว' },
    ] },
  // ─── ความรู้จากโลกเดิม (B68h) ───
  // know = { หมวด, ความรู้ขั้นต่ำที่เรื่องนี้จะมาหา } · ตัวเลือกที่มี know ทอยด้วยความรู้หมวดนั้น · fx.know = ความรู้หมวดของเรื่องที่ขึ้นลง
  // ล้มเหลวยังได้ความรู้เล็กน้อย (ลองใหม่ได้ในเรื่องถัดไปของหมวด) · lore = ของที่โลกนี้จะจำถ้าชื่อเสียงถึง · loreOf = โลกจำแล้ว เรื่องนี้ไม่มาอีก
  // adult = ความรู้อันตราย เปิดเฉพาะวัยผู้ใหญ่ขึ้นไป · เล่าเป็นผล ไม่มีวิธีทำ
  { id: 'k_food1', ch: [1, 2, 3], know: { cat: 'food', min: 0 }, title: 'ซุปจืดของโรงเตี๊ยม',
    text: 'ซุปที่โรงเตี๊ยมจืดจนต้องเติมเกลือเอง คุณนึกถึงน้ำซุปกระดูกหมูที่แม่เคี่ยวทั้งคืน แต่จำไม่ได้ว่าแม่ใส่อะไรบ้าง',
    choices: [
      { t: 'นั่งนึกว่าแม่ใส่อะไรลงหม้อ', know: 'food', tag: 'cook', dc: 8,
        win: { fx: { know: 15, cha: 1 }, text: 'รากผักชี กระเทียม พริกไทยเม็ด ค่อย ๆ กลับมาทีละอย่าง คุณจดใส่ผ้าเช็ดหน้าไว้ก่อนจะลืม' },
        lose: { fx: { know: 5 }, text: 'นึกออกแค่กลิ่นหอม ๆ ที่เหลือว่างเปล่า อย่างน้อยก็รู้ว่าต้องเริ่มจากกระดูก' } },
      { t: 'เติมเกลือแล้วกินให้หมด', fx: { hp: 5 }, text: 'อิ่มท้องดี วันนี้ไม่ต้องคิดอะไรมาก' },
    ] },
  { id: 'k_food2', ch: [2, 3], know: { cat: 'food', min: 10 }, title: 'แผงลอยหน้าประตูเมือง',
    text: 'หน้าประตูเมืองมีแต่แผงขายขนมปังแข็ง คนเดินทางหิวกันทั้งวัน คุณมีเงินพอเช่าแผงได้หนึ่งเดือน',
    choices: [
      { t: 'ขายข้าวผัดกะเพราเท่าที่จำได้', know: 'food', tag: 'cook', dc: 18,
        win: { fx: { gold: 200, fame: 6, know: 10 }, next: 'k_food3', text: 'ใบไม้ที่นี่ไม่ใช่กะเพรา แต่หอมคล้ายกัน คิวยาวถึงสะพาน คนขายขนมปังข้าง ๆ มองตาขวาง' },
        lose: { fx: { gold: -80, know: 6 }, text: 'พริกที่นี่เผ็ดกว่าที่บ้านสิบเท่า ลูกค้าคนแรกวิ่งหาน้ำ ทั้งเดือนขายไม่ออก แต่ตอนนี้รู้แล้วว่าต้องลดพริก' } },
      { t: 'ต้มซุปแจกคนเดินทางที่ไม่มีเงิน', fx: { gold: -50, cha: 2, fame: 3 }, text: 'ได้คำขอบคุณมาเต็มกระเป๋า เงินหายไปนิดหน่อย' },
      { t: 'ขายขนมปังแข็งเหมือนคนอื่น', fx: { gold: 60 }, text: 'ขายได้พอค่าแผง ไม่มีใครจำหน้าคุณได้' },
    ] },
  { id: 'k_food3', ch: [2, 3], know: { cat: 'food', min: 25 }, loreOf: 'fishsauce', title: 'สมาคมพ่อค้าขอซื้อสูตร',
    text: 'สมาคมพ่อค้าอาหารวางถุงทองตรงหน้า ขอซื้อสูตรน้ำปลากับวิธีผัดของคุณ แลกกับห้ามคนอื่นทำขาย',
    choices: [
      { t: 'สอนให้ทุกคนในเมืองทำเป็น', know: 'food', tag: 'cook', dc: 26,
        win: { fx: { fame: 15, cha: 3, know: 5 }, lore: 'fishsauce', text: 'สามปีต่อมา ทุกบ้านมีโอ่งหมักน้ำปลาไว้หลังบ้าน เด็ก ๆ เรียกมันว่าน้ำของคนต่างโลก' },
        lose: { fx: { fame: 3, know: 5 }, text: 'หลายบ้านหมักแล้วเน่า เลิกกันไปทีละบ้าน เหลือยายข้างบ้านคนเดียวที่ยังทำต่อ' } },
      { t: 'ขายสูตรให้สมาคม', fx: { gold: 800 }, text: 'ได้ทองเยอะจนต้องจ้างคนแบก สมาคมขึ้นราคาน้ำปลาสามเท่า คนจนไม่มีปัญญาซื้อ' },
      { t: 'ไม่ขายไม่สอน ทำขายเองคนเดียว', fx: { gold: 300, fame: -3 }, text: 'ร้านคุณขายดี ร้านรอบข้างปิดไปสองร้าน' },
    ] },
  { id: 'k_farm1', ch: [1, 2, 3], know: { cat: 'farm', min: 0 }, title: 'นาที่ข้าวไม่ขึ้น',
    text: 'ชาวนาแถวนี้ปลูกพืชเดิมที่เดิมทุกปี ดินจืดลงเรื่อย ๆ ปีนี้ข้าวสาลีออกรวงไม่ถึงครึ่ง คุณจำได้ลาง ๆ ว่าครูวิทย์เคยพูดเรื่องนี้',
    choices: [
      { t: 'นึกถึงบทเรียนเรื่องปลูกพืชหมุนเวียน', know: 'farm', dc: 8,
        win: { fx: { know: 15 }, text: 'ถั่วกับข้าวผลัดกันปลูก ถั่วคืนปุ๋ยให้ดิน คุณจำได้กระทั่งหน้าครูตอนพูด' },
        lose: { fx: { know: 5 }, text: 'จำได้แค่ว่าต้องสลับอะไรสักอย่าง แต่สลับอะไรกับอะไรนึกไม่ออก' } },
      { t: 'ช่วยชาวนาเกี่ยวข้าวเท่าที่มี', fx: { str: 1, hp: -5, cha: 1 }, text: 'ปวดหลังไปสามวัน ได้ขนมปังมาหนึ่งก้อน' },
    ] },
  { id: 'k_farm2', ch: [2, 3], know: { cat: 'farm', min: 10 }, title: 'แปลงทดลองหัวไร่',
    text: 'ผู้ใหญ่บ้านยอมให้ยืมที่ดินหัวไร่หนึ่งแปลง "ถ้าไม่ได้ผล ปีหน้าเอาคืน"',
    choices: [
      { t: 'ปลูกถั่วสลับข้าว ทำปุ๋ยหมักจากเศษผัก', know: 'farm', dc: 18,
        win: { fx: { gold: 150, fame: 6, know: 10 }, next: 'k_farm3', text: 'ปีที่สองแปลงคุณเขียวกว่าแปลงอื่นจนมองเห็นจากเนิน ชาวนามายืนดูกันทุกเช้า' },
        lose: { fx: { gold: -30, know: 6 }, text: 'กองปุ๋ยหมักแฉะจนเน่า หนูมาทำรังทั้งกอง คราวหน้าต้องกลับกองบ่อยกว่านี้' } },
      { t: 'ปลูกพริกกับตะไคร้ไว้กินเอง', fx: { hp: 8, gold: 30 }, text: 'ได้กินต้มยำครั้งแรกในโลกนี้ เกือบร้องไห้' },
    ] },
  { id: 'k_farm3', ch: [2, 3], know: { cat: 'farm', min: 25 }, loreOf: 'rotation', title: 'ปีแล้ง',
    text: 'ฝนไม่ตกมาสองเดือน แปลงเดียวในหมู่บ้านที่ยังเขียวคือแปลงของคุณ เจ้าที่ดินส่งคนมาถามว่าทำอย่างไร',
    choices: [
      { t: 'สอนทุกครอบครัวในหมู่บ้าน', know: 'farm', dc: 26,
        win: { fx: { fame: 15, cha: 3, know: 5 }, lore: 'rotation', text: 'ปีถัดมาไม่มีใครอดตาย หมู่บ้านเรียกวิธีนี้ว่านาสลับ แล้วสอนลูกหลานต่อ' },
        lose: { fx: { fame: 3, know: 5 }, text: 'ครึ่งหมู่บ้านทำตาม อีกครึ่งบอกว่าคนต่างถิ่นไม่รู้จักดินที่นี่' } },
      { t: 'บอกเฉพาะเจ้าที่ดิน แลกส่วนแบ่ง', fx: { gold: 500 }, text: 'เจ้าที่ดินขึ้นค่าเช่านาทุกแปลงที่ได้ผลดีขึ้น' },
    ] },
  { id: 'k_medic1', ch: [1, 2, 3], know: { cat: 'medic', min: 0 }, title: 'ท้องร่วงทั้งตรอก',
    text: 'คนในตรอกท้องร่วงกันทั้งแถบ หมอประจำเมืองบอกว่าโดนคำสาป คุณเห็นเด็กตักน้ำจากบ่อเดียวกับที่ทิ้งของเสีย',
    choices: [
      { t: 'นึกถึงที่ครูสอนเรื่องเชื้อโรค', know: 'medic', tag: 'appraise', dc: 8,
        win: { fx: { know: 15 }, text: 'ต้มน้ำก่อนดื่ม ล้างมือด้วยสบู่ แยกบ่อน้ำออกจากที่ทิ้งของเสีย ครูให้คัดเรื่องนี้สิบจบตอน ป.4' },
        lose: { fx: { know: 5 }, text: 'คุณรู้ว่าน้ำมีปัญหา แต่อธิบายไม่ได้ว่าทำไม' } },
      { t: 'ช่วยหมอแบกคนป่วย', fx: { hp: -10, cha: 2, fame: 2 }, text: 'คุณป่วยตามไปอีกสามวัน' },
    ] },
  { id: 'k_medic2', ch: [2, 3], know: { cat: 'medic', min: 10 }, title: 'สบู่ก้อนแรก',
    text: 'คุณนึกออกว่าสบู่ทำจากไขมันกับน้ำขี้เถ้า แต่จำสัดส่วนไม่ได้ ร้านขายเทียนยอมให้ยืมหม้อ',
    choices: [
      { t: 'ลองต้มจนกว่าจะได้', know: 'medic', dc: 18,
        win: { fx: { gold: 120, fame: 5, know: 10 }, next: 'k_medic3', text: 'ก้อนที่ห้าแข็งตัวพอดี ฟองนุ่ม กลิ่นไม่ค่อยหอม แต่คนป่วยในตรอกหายเร็วขึ้นจริง' },
        lose: { fx: { hp: -8, know: 6 }, text: 'ก้อนแรกกัดมือจนแดง ก้อนที่สองเหลวเป็นซุป ยังไม่ได้ แต่ใกล้แล้ว' } },
      { t: 'ทำลูกประคบสมุนไพรแทน', fx: { cha: 2, gold: 60 }, text: 'ประคบร้อนช่วยคนแก่หายปวดเมื่อยได้บ้าง ใครก็ชอบ' },
    ] },
  { id: 'k_medic3', ch: [2, 3], know: { cat: 'medic', min: 25 }, loreOf: 'soap', title: 'หมอประจำเมืองมาหา',
    text: 'หมอที่เคยบอกว่าโรคระบาดเป็นคำสาปมายืนหน้าบ้าน ขอให้คุณสอนเรื่องล้างมือกับต้มน้ำให้ลูกศิษย์ของเขา',
    choices: [
      { t: 'สอนเต็มที่ ไม่คิดเงิน', know: 'medic', tag: 'talk', dc: 26,
        win: { fx: { fame: 15, cha: 3, know: 5 }, lore: 'soap', text: 'ปีต่อมาคนท้องร่วงในเมืองลดลงครึ่งหนึ่ง โรงหมอตั้งอ่างล้างมือไว้หน้าประตู' },
        lose: { fx: { fame: 3, know: 5 }, text: 'ลูกศิษย์ครึ่งหนึ่งเชื่อ อีกครึ่งหาว่าเป็นพิธีแปลก ๆ ของคนต่างโลก' } },
      { t: 'ขายสบู่ให้โรงหมอในราคาสูง', fx: { gold: 600 }, text: 'ได้เงินมาก โรงหมอเล็ก ๆ ซื้อไม่ไหว' },
    ] },
  { id: 'k_trade1', ch: [1, 2, 3], know: { cat: 'trade', min: 0 }, title: 'บัญชีของพ่อค้าผ้า',
    text: 'พ่อค้าผ้าที่คุณไปช่วยงานจดบัญชีเป็นขีดบนแผ่นไม้ ขาดทุนทุกปี แต่ไม่รู้ว่าเงินหายไปไหน',
    choices: [
      { t: 'นึกถึงวิชาบัญชีรายรับรายจ่ายสมัยเรียน', know: 'trade', tag: 'trade', dc: 8,
        win: { fx: { know: 15 }, text: 'ช่องรับ ช่องจ่าย ยอดยกมา คุณตีตารางลงผ้าเก่า พ่อค้ามองเหมือนเห็นเวทมนตร์' },
        lose: { fx: { know: 5 }, text: 'จำได้ว่ามีสองช่อง แต่ลืมว่ายอดยกมาต้องทำอย่างไร' } },
      { t: 'ช่วยนับผ้าในโกดังแทน', fx: { gold: 40 }, text: 'ได้ค่าแรงวันละเหรียญทองแดง พ่อค้ายังขาดทุนเหมือนเดิม' },
    ] },
  { id: 'k_trade2', ch: [2, 3], know: { cat: 'trade', min: 10 }, title: 'หม้อเหล็กผ่อนได้',
    text: 'ชาวบ้านอยากได้หม้อเหล็ก แต่ไม่มีเงินก้อน คุณนึกถึงป้าย "ผ่อน 0% 10 เดือน" หน้าห้างที่บ้าน',
    choices: [
      { t: 'เปิดร้านรับผ่อน คิดดอกต่ำ', know: 'trade', tag: 'trade', dc: 18,
        win: { fx: { gold: 250, fame: 6, know: 10 }, next: 'k_trade3', text: 'ทุกบ้านมีหม้อเหล็ก เกือบทุกคนผ่อนตรงเวลา คนเรียกคุณว่าพ่อค้าใจดี' },
        lose: { fx: { gold: -150, know: 6 }, text: 'ลูกค้าครึ่งหนึ่งย้ายเมืองหนีหนี้ คราวหน้าต้องรู้จักคนที่ให้ผ่อนก่อน' } },
      { t: 'คิดดอกแพง ผิดนัดเมื่อไรยึดของ', fx: { gold: 400, fame: -5 }, text: 'ได้กำไรมาก ร้านเต็มไปด้วยหม้อที่ยึดคืนมา คนแอบเรียกคุณว่าแร้ง' },
    ] },
  { id: 'k_trade3', ch: [2, 3], know: { cat: 'trade', min: 25 }, loreOf: 'ledger', title: 'กิลด์พ่อค้าเชิญไปพูด',
    text: 'กิลด์พ่อค้าได้ยินเรื่องบัญชีสองช่องของคุณ ขอให้ไปสอนในโถงประชุม พ่อค้าใหญ่บางคนไม่ชอบ เพราะบัญชีชัดแล้วโกงยาก',
    choices: [
      { t: 'สอนวิธีจดบัญชีให้ทุกคน', know: 'trade', tag: 'talk', dc: 26,
        win: { fx: { fame: 15, cha: 3, know: 5 }, lore: 'ledger', text: 'กิลด์สั่งให้ทุกร้านจดบัญชีแบบใหม่ เด็กฝึกงานท่องกันทั้งตลาดว่า รับซ้าย จ่ายขวา' },
        lose: { fx: { fame: 3, know: 5 }, text: 'พ่อค้าใหญ่ล้มที่ประชุม เรื่องเงียบไปอีกหลายปี' } },
      { t: 'ช่วยพ่อค้าใหญ่ซ่อนกำไร', fx: { gold: 700 }, text: 'ได้ส่วนแบ่งก้อนโต ภาษีที่ควรเอาไปซ่อมสะพานหายไปเงียบ ๆ' },
    ] },
  { id: 'k_craft1', ch: [1, 2, 3], know: { cat: 'craft', min: 0 }, title: 'ลำธารหลังโรงสี',
    text: 'คนในโรงสีเข็นโม่หินด้วยมือทั้งวัน หลังโรงสีมีลำธารไหลแรงทั้งปี คุณนึกถึงกังหันน้ำในหนังสือเรียน',
    choices: [
      { t: 'วาดกังหันที่จำได้ลงพื้นดิน', know: 'craft', dc: 8,
        win: { fx: { know: 15 }, text: 'ใบพาย เพลา เฟือง คุณวาดได้เกือบครบ ช่างไม้ข้างโรงสีนั่งดูจนลืมกินข้าว' },
        lose: { fx: { know: 5 }, text: 'วาดออกมาเป็นวงกลมมีขีด ๆ คนดูนึกว่าดวงอาทิตย์' } },
      { t: 'ช่วยเข็นโม่', fx: { str: 2, hp: -5 }, text: 'แขนใหญ่ขึ้น โรงสีได้แป้งเพิ่มอีกนิด' },
    ] },
  { id: 'k_craft2', ch: [2, 3], know: { cat: 'craft', min: 10 }, loreOf: 'waterwheel', title: 'สร้างกังหันกับช่างไม้',
    text: 'ช่างไม้ยอมลองสร้างตามรูปของคุณ ถ้าไม่สำเร็จ ค่าไม้ทั้งกองคุณจ่ายเอง',
    choices: [
      { t: 'คุมงานเองทุกขั้น', know: 'craft', dc: 18,
        win: { fx: { gold: 200, fame: 8, know: 10 }, lore: 'waterwheel', text: 'กังหันหมุนครั้งแรก คนทั้งหมู่บ้านวิ่งมาดู โม่หินหมุนเองโดยไม่มีใครเข็น' },
        lose: { fx: { gold: -120, know: 6 }, text: 'เพลาหักตอนน้ำหลาก ไม้ลอยไปครึ่งกอง คราวหน้าเพลาต้องหนากว่านี้' } },
      { t: 'ให้ช่างไม้ทำตามที่เขาเข้าใจ', stat: 'luk', dc: 12,
        win: { fx: { gold: 80 }, text: 'กังหันหน้าตาแปลกไปหน่อย แต่หมุนได้' },
        lose: { fx: { gold: -40 }, text: 'มันหมุนกลับทาง' } },
    ] },
  { id: 'k_craft3', ch: [2, 3], know: { cat: 'craft', min: 20 }, adult: true, title: 'ขุนพลมาที่โรงสี',
    text: 'ขุนพลของเจ้าเมืองเห็นเฟืองไม้ของคุณ อยากได้เครื่องยิงที่ยิงไกลกว่าของข้าศึกสองเท่า สงครามกับเมืองข้างเคียงใกล้เข้ามาแล้ว',
    choices: [
      { t: 'ออกแบบให้', fx: { gold: 600, fame: 8 }, text: 'เครื่องยิงชุดแรกเสร็จในสามเดือน เมืองข้างเคียงยอมแพ้เกือบไม่ต้องสู้ แต่กำแพงที่พังลงมาทับบ้านคนไปหลายหลัง' },
      { t: 'ขอทำแค่กังหันน้ำ ไม่ทำอาวุธ', stat: 'cha', tag: 'talk', dc: 14,
        win: { fx: { fame: 5 }, text: 'ขุนพลหัวเราะว่าหัวดื้อ แต่ก็ซื้อกังหันไปใช้ในค่ายทหาร' },
        lose: { fx: { fame: -5, gold: -100 }, text: 'ขุนพลไม่พอใจ ยึดโรงสีไปครึ่งปี' } },
    ] },
  { id: 'k_print1', ch: [1, 2, 3], know: { cat: 'print', min: 0 }, title: 'หนังสือราคาเท่าบ้าน',
    text: 'ตำราในหอสมุดเขียนด้วยมือ เล่มหนึ่งราคาเท่าบ้านหนึ่งหลัง ทั้งเมืองมีคนอ่านออกไม่ถึงสิบคน',
    choices: [
      { t: 'นึกถึงตอนไปเที่ยวโรงทำกระดาษสา', know: 'print', tag: 'appraise', dc: 8,
        win: { fx: { know: 15 }, text: 'ต้มเปลือกไม้ ทุบ แช่น้ำ ช้อนขึ้นด้วยตะแกรง จำได้เพราะตอนนั้นได้ลองทำพัดกลับบ้าน' },
        lose: { fx: { know: 5 }, text: 'จำได้แค่ว่าใช้เปลือกไม้ ที่เหลือในหัวมีแต่ร้านขายร่ม' } },
      { t: 'ขอให้บรรณารักษ์สอนอ่าน', fx: { mag: 1, cha: 1 }, text: 'อ่านได้ช้า ๆ ทีละคำ บรรณารักษ์ดีใจที่มีคนมาถาม' },
    ] },
  { id: 'k_print2', ch: [2, 3], know: { cat: 'print', min: 10 }, title: 'ตัวอักษรไม้',
    text: 'คุณทำกระดาษได้แล้ว แต่คัดทีละแผ่นช้าเกินไป แล้วก็นึกถึงตรายางที่ไปรษณีย์',
    choices: [
      { t: 'แกะตัวอักษรลงไม้ทีละตัว แล้วเรียงพิมพ์', know: 'print', dc: 18,
        win: { fx: { gold: 150, fame: 6, know: 10 }, next: 'k_print3', text: 'วันเดียวพิมพ์ได้ร้อยแผ่น หมึกเลอะทั้งตัว แต่แผ่นแรกอ่านออกชัด' },
        lose: { fx: { gold: -60, know: 6 }, text: 'ไม้บวมหมึก ตัวอักษรเบี้ยวจนอ่านไม่ออก รอบหน้าจะลองแผ่นทองแดง' } },
      { t: 'หาพ่อค้ามาลงทุนก่อน', stat: 'cha', tag: 'talk', dc: 12,
        win: { fx: { gold: 200 }, text: 'พ่อค้าผ้ายอมลงทุน แลกกับให้พิมพ์ใบโฆษณาร้านเขาก่อน' },
        lose: { fx: { fame: -3 }, text: 'พ่อค้าหัวเราะใส่ "จะพิมพ์ไปให้ใครอ่าน"' } },
    ] },
  { id: 'k_print3', ch: [2, 3], know: { cat: 'print', min: 25 }, loreOf: 'school', title: 'โรงเรียนในโรงนา',
    text: 'คุณพิมพ์หนังสือหัดอ่านได้เป็นกอง เด็กในหมู่บ้านมาขอดูภาพในเล่มทุกวัน แต่ไม่มีใครอ่านออก',
    choices: [
      { t: 'เปิดสอนอ่านฟรีในโรงนา', know: 'print', tag: 'talk', dc: 26,
        win: { fx: { fame: 15, cha: 3, know: 5 }, lore: 'school', text: 'สิบปีต่อมา เด็กทุกคนในหมู่บ้านอ่านออก บางคนได้เป็นเสมียนในเมือง โรงนาหลังนั้นไม่มีวัวอีกเลย' },
        lose: { fx: { fame: 3, know: 5 }, text: 'พ่อแม่ไม่ยอมให้ลูกมา เพราะต้องช่วยงานนา เหลือเด็กสองคนที่เรียนจนจบ' } },
      { t: 'ขายหนังสือให้ขุนนางในราคาแพง', fx: { gold: 500 }, text: 'ห้องสมุดของขุนนางมีหนังสือของคุณเต็มชั้น ชาวบ้านยังอ่านไม่ออกเหมือนเดิม' },
    ] },
  { id: 'k_war1', ch: [2, 3], know: { cat: 'war', min: 0 }, adult: true, title: 'ทัพที่อดข้าว',
    text: 'กองทัพของเจ้าเมืองเดินทัพผ่านหมู่บ้าน ทหารครึ่งหนึ่งป่วยเพราะเสบียงเน่ากลางทาง คุณนึกถึงตอนเกณฑ์ทหารที่บ้าน ทุกคนมีข้าวกล่องกับกระติกน้ำ',
    choices: [
      { t: 'นึกถึงวิธีถนอมอาหารกับจัดเสบียง', know: 'war', dc: 8,
        win: { fx: { know: 15, fame: 3 }, text: 'ตากแห้ง หมักเกลือ แบ่งห่อละมื้อ แม่ทัพจดตามแทบไม่ทัน' },
        lose: { fx: { know: 5 }, text: 'คุณพูดเรื่องอาหารกระป๋องกับตู้เย็น แม่ทัพมองหน้าอย่างสงสาร' } },
      { t: 'ขายเสบียงให้ทัพในราคาสูง', fx: { gold: 250 }, text: 'ได้กำไร ทหารบางคนจำหน้าคุณได้ และไม่ได้จำในทางดี' },
    ] },
  { id: 'k_war2', ch: [2, 3], know: { cat: 'war', min: 10 }, adult: true, loreOf: 'gunpowder', title: 'ผงสีดำของนักเล่นแร่',
    text: 'นักเล่นแร่แปรธาตุในเมืองเผาผงบางอย่างจนห้องทดลองไหม้ คุณรู้ว่าถ้าเขามาถูกทาง ผงนี้จะเปลี่ยนสงครามของโลกนี้ไปตลอด',
    choices: [
      { t: 'ชี้ทางให้เขา', know: 'war', tag: 'appraise', dc: 18,
        win: { fx: { gold: 500, fame: 12, know: 10 }, lore: 'gunpowder', text: 'ปีต่อมาปืนใหญ่กระบอกแรกของโลกนี้ทลายกำแพงเมืองข้าศึก ผู้คนจำชื่อคุณได้ แต่ไม่ได้เรียกด้วยความรัก' },
        lose: { fx: { hp: -25, know: 6 }, text: 'ห้องทดลองระเบิดอีกรอบ คุณรอดมาได้ คิ้วหายไปข้างหนึ่ง' } },
      { t: 'บอกเขาว่ามันอันตรายเกินไป', stat: 'cha', tag: 'talk', dc: 14,
        win: { fx: { fame: 4 }, text: 'เขาเลิกทดลอง หันไปทำดอกไม้ไฟงานเทศกาลแทน เด็ก ๆ ชอบมาก' },
        lose: { fx: { luk: -1 }, text: 'เขาไม่ฟัง ยังเผาต่อทุกคืน' } },
      { t: 'ทำเป็นไม่รู้', fx: { luk: 1 }, text: 'คุณเดินผ่านไป เสียงระเบิดเล็ก ๆ ยังดังจากห้องนั้นทุกคืน' },
    ] },
  { id: 'k_war3', ch: [2, 3], know: { cat: 'war', min: 10 }, adult: true, title: 'คนแปลกหน้าในโรงเตี๊ยม',
    text: 'ชายในเสื้อคลุมรู้ว่าคุณมาจากต่างโลกและรู้เรื่องแปลก ๆ เขาวางถุงทองหนักบนโต๊ะ ขอยาที่กินแล้วหลับไม่ตื่น ไม่บอกว่าจะเอาไปให้ใคร',
    choices: [
      { t: 'รับงาน', fx: { gold: 1000 }, text: 'เดือนต่อมามีข่าวขุนนางคนหนึ่งตายกลางงานเลี้ยง คุณรู้ดีว่ายานั้นมาจากไหน' },
      { t: 'ปฏิเสธแล้วไปแจ้งยาม', stat: 'cha', tag: 'talk', dc: 14,
        win: { fx: { fame: 8 }, text: 'ยามจับเขาได้พร้อมจดหมายจ้างวาน มีคนรอดตายไปหนึ่งคนโดยไม่รู้ว่าเพราะใคร' },
        lose: { fx: { hp: -20 }, text: 'ยามไม่เชื่อ คืนนั้นมีคนลอบทำร้ายคุณในตรอก' } },
      { t: 'ปฏิเสธเงียบ ๆ', fx: { luk: 1 }, text: 'เขายักไหล่แล้วเดินออกไป คืนนั้นคุณนอนไม่หลับ' },
    ] },
  { id: 'k_law1', ch: [2, 3], know: { cat: 'law', min: 0 }, title: 'ศาลกลางลาน',
    text: 'เจ้าเมืองตัดสินคดีขโมยแพะด้วยการให้จำเลยจุ่มมือลงน้ำเดือด ถ้ามือพองแปลว่าผิด คุณนึกถึงละครศาลที่แม่ชอบดู',
    choices: [
      { t: 'นึกถึงหลักที่ว่าทุกคนบริสุทธิ์จนกว่าจะพิสูจน์ได้ว่าผิด', know: 'law', tag: 'appraise', dc: 8,
        win: { fx: { know: 15 }, text: 'พยาน หลักฐาน สิทธิ์แก้ต่าง คุณเรียงลำดับในหัวได้ครบ' },
        lose: { fx: { know: 5 }, text: 'จำได้แค่คำว่า "ศาลขอสั่ง" ซึ่งไม่ช่วยอะไรเลย' } },
      { t: 'ขอไปตามหาแพะตัวที่หาย', stat: 'luk', tag: 'sneak', dc: 12,
        win: { fx: { fame: 5 }, text: 'แพะเดินกลับมาเองกลางการพิจารณาคดี ทั้งลานหัวเราะ จำเลยรอดไป' },
        lose: { fx: { fame: -3 }, text: 'คุณโดนไล่ออกจากลานข้อหาก่อกวน' } },
    ] },
  { id: 'k_law2', ch: [2, 3], know: { cat: 'law', min: 10 }, loreOf: 'court', title: 'เจ้าเมืองขอคำปรึกษา',
    text: 'เจ้าเมืองเบื่อที่คนบ่นว่าศาลไม่ยุติธรรม แต่ก็ไม่อยากเสียอำนาจตัดสินเอง เขาได้ยินว่าคุณพูดเรื่องพยานกับหลักฐาน',
    choices: [
      { t: 'เสนอให้ตั้งคนกลางฟังความทั้งสองฝ่าย', know: 'law', tag: 'talk', dc: 20,
        win: { fx: { fame: 15, cha: 3, know: 10 }, lore: 'court', text: 'ศาลแรกที่มีพยานกับคนแก้ต่างเปิดในเมืองนี้ คดีขโมยแพะครั้งต่อมาใช้พยานสามคนแทนหม้อน้ำเดือด' },
        lose: { fx: { fame: -5, know: 6 }, text: 'เจ้าเมืองหาว่าคุณจะยึดอำนาจ สั่งให้ออกจากเมืองไปสามเดือน' } },
      { t: 'ช่วยเขียนกฎให้เขาตัดสินได้ทุกเรื่อง', fx: { gold: 500, fame: -3 }, text: 'เจ้าเมืองพอใจ ให้รางวัลก้อนโต คดีต่อมาเขาตัดสินตามอารมณ์เหมือนเดิม แต่ตอนนี้ถูกกฎหมาย' },
    ] },
  { id: 'k_fun1', ch: [1, 2, 3], know: { cat: 'fun', min: 0 }, title: 'ฝนตกทั้งเดือน',
    text: 'ฝนตกติดกันสามอาทิตย์ เด็กในหมู่บ้านไม่มีอะไรเล่น นั่งเบื่อกันใต้ชายคา คุณนึกถึงหมากฮอสที่เคยเล่นกับตาหน้าบ้าน',
    choices: [
      { t: 'ขีดกระดานหมากฮอสลงพื้น', know: 'fun', dc: 8,
        win: { fx: { know: 15, cha: 2 }, text: 'ใช้ฝาขวดแทนตัวหมาก เด็ก ๆ เล่นกันจนฝนหยุดแล้วก็ยังไม่เลิก' },
        lose: { fx: { know: 5 }, text: 'จำกติกาปนกับหมากรุก เด็กเถียงกันจนร้องไห้' } },
      { t: 'เล่านิทานผีให้ฟัง', fx: { cha: 2 }, text: 'เด็กครึ่งหนึ่งไม่กล้ากลับบ้าน อีกครึ่งขอฟังอีก' },
    ] },
  { id: 'k_fun2', ch: [2, 3], know: { cat: 'fun', min: 10 }, title: 'งานฉลองเก็บเกี่ยว',
    text: 'เมืองจัดงานฉลองเก็บเกี่ยว มีแต่ดนตรีพิณกับเต้นรำเป็นวง คุณนึกถึงเวทีมวยงานวัดกับซุ้มปาลูกโป่ง',
    choices: [
      { t: 'ตั้งซุ้มเกมแบบงานวัดบ้านเกิด', know: 'fun', tag: 'trade', dc: 18,
        win: { fx: { gold: 200, fame: 8, know: 10 }, next: 'k_fun3', text: 'ซุ้มปาลูกโป่งกับสอยดาวมีคนต่อแถวยาว เจ้าเมืองยังมาลองปาเอง' },
        lose: { fx: { gold: -60, know: 6 }, text: 'ลูกโป่งที่นี่ทำจากกระเพาะหมู ไม่มีใครอยากปา' } },
      { t: 'ขึ้นเวทีเล่าตำนานมวยไทยแล้วต่อยโชว์', stat: 'str', tag: 'fight', dc: 14,
        win: { fx: { fame: 8, str: 2 }, text: 'ท่าไหว้ครูทำให้คนดูเงียบ แล้วเข่าลอยทำให้ทั้งลานลุกขึ้นยืน มีเด็กมาขอเป็นลูกศิษย์สามคน' },
        lose: { fx: { hp: -15 }, text: 'คู่ชกเป็นคนแคระที่แข็งกว่าที่คิดเยอะ' } },
    ] },
  { id: 'k_fun3', ch: [2, 3], know: { cat: 'fun', min: 25 }, loreOf: 'boardgame', title: 'พ่อค้าเกมกระดาน',
    text: 'พ่อค้าเห็นเด็กทั้งเมืองเล่นหมากฮอส อยากให้คุณทำกระดานส่งขายทั่วทวีป',
    choices: [
      { t: 'ทำขายราคาถูก ให้ทุกบ้านมีได้', know: 'fun', tag: 'trade', dc: 26,
        win: { fx: { fame: 15, gold: 200, know: 5 }, lore: 'boardgame', text: 'ทุกโรงเตี๊ยมมีกระดานหมากฮอสวางข้างเคาน์เตอร์ คนแก่นั่งเล่นกันจนร้านปิด' },
        lose: { fx: { gold: -100, know: 5 }, text: 'กระดานล็อตแรกบิดเพราะไม้ยังไม่แห้ง พ่อค้ายกเลิกสัญญา' } },
      { t: 'ตั้งบ่อนเดิมพันหมากฮอส', fx: { gold: 600, fame: -5 }, text: 'ได้เงินจากวงพนันทุกคืน มีคนเสียบ้านไปแล้วสองหลัง' },
    ] },
  // ─── ทางกลับบ้านของคนที่ข้ามมาทั้งตัว (B154) ───
  // trip: 'quest' = มาเมื่อตามหาทางกลับครบปี (ไม่อยู่ในกอง) · 'event' = เข้ากองเฉพาะชาติที่เป็นทริป · home = เลือกแล้วจบทริปแบบกลับบ้าน
  // ไม่มีใน ISEKAI_MERIT — กลับหรือไม่กลับไม่ใช่บุญบาป
  { id: 'trip_quest', trip: 'quest', ch: [1, 2, 3], title: 'ทางกลับบ้าน',
    text: 'บันทึกของนักเดินทางรุ่นก่อน แผนที่ที่ปะติดปะต่อมาหลายปี และหินแกะสลักเก่าในหุบเขา พาคุณมายืนหน้าซุ้มประตูหินที่ลมพัดกลิ่นท่อไอเสียออกมา',
    choices: [
      { t: 'ก้าวผ่านประตูกลับบ้าน', fx: {}, home: true, text: 'คุณหันกลับไปมองเมืองที่อยู่มาหลายปีเป็นครั้งสุดท้าย แล้วก้าวเข้าไป' },
      { t: 'ยังไม่กลับ ขออยู่ต่ออีกสักพัก', fx: {}, text: 'ประตูหินค่อย ๆ ปิดลง ถ้าอยากกลับคงต้องตามหาทางใหม่อีกรอบ' },
    ] },
  { id: 'trip_circle', trip: 'event', ch: [1, 2, 3], title: 'วงเวทกลับด้าน',
    text: 'จอมเวทฝึกหัดในเมืองร่ายเวทอัญเชิญพลาด เส้นวงเวทบนลานหมุนกลับด้าน ตรงกลางเห็นถนนกับป้ายรถเมล์เหมือนบ้านเกิดลาง ๆ',
    choices: [
      { t: 'กระโดดเข้าวงเวทก่อนมันดับ', fx: {}, home: true, text: 'แสงวงเวทกลืนตัวคุณไปทั้งตัว เสียงจอมเวทฝึกหัดร้องตามหลังมาแว่ว ๆ' },
      { t: 'ถอยออกมา ยังไม่พร้อมไป', fx: { mag: 1 }, text: 'วงเวทดับลงต่อหน้า จอมเวทฝึกหัดขอโทษไม่หยุด ส่วนคุณจำลายเส้นของมันไว้ได้นิดหน่อย' },
    ] },
  { id: 'trip_goddess', trip: 'event', ch: [1, 2, 3], bless: true, title: 'เทพธิดามาทวงคืน',
    text: 'คืนหนึ่งเทพธิดาผมสีเงินนั่งรออยู่ปลายเตียง เธอบอกว่าส่งคุณมาผิดคิว ถ้าอยากกลับ เธอส่งกลับให้ได้ตอนนี้เลย',
    choices: [
      { t: 'ขอกลับบ้าน', fx: {}, home: true, text: 'เธอดีดนิ้วหนึ่งที ห้องทั้งห้องกลายเป็นสีขาว' },
      { t: 'ขออยู่ที่นี่ต่อ', fx: { luk: 2 }, text: 'เธอยักไหล่ บอกว่าคิวหน้าไม่รู้เมื่อไร แล้วหายไปพร้อมกลิ่นดอกไม้' },
    ] },
];
const isekaiById = Object.fromEntries(ISEKAI_EVENTS.map((e) => [e.id, e]));
// การ์ดทวีปจาก content/isekai/*.yaml (06c-2) ต่อท้ายกองใน JS — ตัวโหลดฝั่ง node กับหน้าเกม (CONTENT.isekai) เรียกก่อนเล่น
// ต่อท้าย ⇒ ลำดับกองเดิมไม่เลื่อน ชาติเก่าสุ่มได้เท่าเดิม · harness โหลดเนื้อหาหลายรอบ ⇒ id ที่รับจาก yaml แล้วข้าม · ชนการ์ดใน JS = หยุด
// ป้ายบุญบาปอยู่บนตัวเลือกใน yaml (merit) ย้ายเข้า ISEKAI_MERIT ที่แกนกับบอทอ่านตาม id
const ISEKAI_YAML = new Set();
function useIsekaiCards(cards = []) {
  for (const e of cards) {
    if (ISEKAI_YAML.has(e.id)) continue;
    if (isekaiById[e.id]) throw new Error(`การ์ดต่างโลก ${e.id} ใน yaml ซ้ำกับการ์ดใน isekai.mjs`);
    ISEKAI_YAML.add(e.id);
    ISEKAI_EVENTS.push(e);
    isekaiById[e.id] = e;
    const tags = Object.fromEntries(e.choices.flatMap((c, i) => (c.merit ? [[i, c.merit]] : [])));
    if (Object.keys(tags).length) ISEKAI_MERIT[e.id] = tags;
  }
}

// ป้ายบุญบาปต่างโลก (B68c) ตามเจตนาของตัวเลือก ไม่ตามผลทอย · id เหตุการณ์ → ลำดับตัวเลือก → [หมวด, ระดับ]
// ฆ่าเพื่อปกป้องคน = กลาง · ชื่อเสียง (fame) เป็นอีกแกน ไม่ลงบัญชีนี้
const M = (cat, level) => ({ cat, level });
const ISEKAI_MERIT = {
  h2: { 0: [M('help_others', 2)], 1: [M('help_others', 1)], 2: [M('greed_harm', 1)] },
  h3: { 0: [M('neutral')], 1: [M('help_others', 2)], 2: [M('neutral')] },
  h4: { 1: [M('kill_for_gain', 3)] },
  h5: { 2: [M('greed_harm', 2)] },
  h9: { 0: [M('neutral')] },
  n2: { 1: [M('cheat_exploit', 1)] },
  n3: { 0: [M('help_others', 2)], 1: [M('help_others', 1)] },
  n9: { 0: [M('help_others', 2)], 2: [M('help_others', 1)] },
  m1: { 0: [M('help_others', 2)], 1: [M('neutral')] },
  m2: { 0: [M('neutral')], 2: [M('greed_harm', 1)] },
  m9: { 0: [M('help_others', 3)], 1: [M('kill_for_gain', 3)], 2: [M('help_others', 2)] },
  v0: { 1: [M('sila', 1)] },
  v2: { 0: [M('help_others', 1)], 1: [M('help_others', 1)] },
  v5: { 1: [M('dana', 2), M('help_others', 1)] },
  s1: { 0: [M('help_others', 2)], 1: [M('help_others', 1)] },
  s9: { 1: [M('neutral')], 2: [M('help_others', 1)] },
  gb1: { 2: [M('help_others', 1), M('dana', 1)] },
  gb2: { 0: [M('help_others', 1)], 1: [M('cheat_exploit', 1)] },
  gb3: { 0: [M('help_others', 2)], 1: [M('kill_for_gain', 2)], 2: [M('greed_harm', 1)] },
  gb5: { 0: [M('help_others', 2)], 2: [M('neutral')] },
  dk2: { 0: [M('unjust_judgment', 2)], 2: [M('help_others', 2)] },
  dk3: { 2: [M('greed_harm', 2)] },
  dk4: { 0: [M('help_others', 1)], 2: [M('greed_harm', 1)] },
  dk4b: { 0: [M('help_others', 1)] },
  g_goblin: { 0: [M('neutral')], 1: [M('neutral')] },
  g_slave: { 0: [M('help_others', 3), M('dana', 1)], 1: [M('help_others', 2)] },
  g_dragon: { 1: [M('greed_harm', 1)] },
  g_goddess: { 1: [M('care_parents', 1)] },
  g_dungeon: { 0: [M('kill_for_gain', 1)], 2: [M('sila', 1)] },
  g_fairy: { 0: [M('help_others', 1)], 1: [M('greed_harm', 2), M('kill_for_gain', 1)] },
  g_storm: { 1: [M('help_others', 2)] },
  // ตำนานชาติก่อน (B68i): ตัวเลือกที่ได้ชื่อเสียงจากทางบาป = ทางที่ทำให้ชาตินี้ถูกจำเป็นคนร้าย
  lg_heir: { 1: [M('help_others', 1)] },
  lg_fake: { 0: [M('help_others', 1)], 1: [M('cheat_exploit', 2)] },
  lg_fear: { 1: [M('help_others', 1)], 2: [M('greed_harm', 2)] },
  lg_hunter: { 0: [M('neutral')] },
  lg_ruin: { 0: [M('forbidden_knowledge', 1)], 1: [M('neutral')] },
  // ความรู้จากโลกเดิม (B68h): แบ่งให้คนใช้ = บุญ · ผูกขาด/เอาเปรียบคนที่ไม่รู้ = บาป · ความรู้อันตรายลงหมวดของตัวเองไม่ว่าผลทอย
  k_food2: { 1: [M('help_others', 1), M('dana', 1)] },
  k_food3: { 0: [M('help_others', 2)], 1: [M('greed_harm', 1)] },
  k_farm1: { 1: [M('help_others', 1)] },
  k_farm3: { 0: [M('help_others', 2)], 1: [M('greed_harm', 1)] },
  k_medic1: { 1: [M('help_others', 1)] },
  k_medic2: { 1: [M('help_others', 1)] },
  k_medic3: { 0: [M('help_others', 2), M('dana', 1)], 1: [M('greed_harm', 1)] },
  k_trade2: { 1: [M('greed_harm', 2)] },
  k_trade3: { 0: [M('help_others', 1)], 1: [M('greed_harm', 2)] },
  k_craft3: { 0: [M('forbidden_knowledge', 2)], 1: [M('neutral')] },
  k_print3: { 0: [M('help_others', 2), M('dana', 1)] },
  k_war1: { 0: [M('help_others', 1)], 1: [M('greed_harm', 1)] },
  k_war2: { 0: [M('forbidden_knowledge', 3)], 1: [M('help_others', 1)] },
  k_war3: { 0: [M('forbidden_knowledge', 3), M('greed_harm', 1)], 1: [M('help_others', 2)] },
  k_law1: { 1: [M('help_others', 1)] },
  k_law2: { 0: [M('help_others', 2)], 1: [M('unjust_judgment', 2)] },
  k_fun3: { 1: [M('greed_harm', 2)] },
};

const isekaiClamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
function isekaiShuffle(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ทางที่สามของการ์ดทางเกิด: เทพธิดาโผล่เอง (สุ่ม) หรือชีวิตนี้ถูกเรียกข้ามโลกจากการ์ดชวน (ธง isekai_call · ตายหรือหายตัว) = ได้ของแถม · stream แยกจาก af.rng
function isekaiCalled(st) {
  if (st.flags?.isekai_call) return true;
  const p = Math.max(GODDESS.chanceMin, ISEKAI.chance * (1 + (st.ledger ? ledgerLevel(st.ledger) : 0)));
  return makeRng(st.seed ^ ISEKAI_SALT).next() < p;
}

// ทางเข้าจากเหตุการณ์ในชีวิต (B68d · เจ้าของเคาะ): ชีวิตละ 1–3 ครั้งต่างช่วงวัย ปฏิเสธได้ · กดรับ = ชีวิตจบ (ตาย = มีงานศพ · หายตัว = ใบตามหา) แล้ววาร์ปข้ามโลก
// ตารางนัดสุ่มจาก stream แยกตอนเกิด ดึงเลขครบทุกช่วงแม้ไม่ได้นัด ⇒ ชีวิตที่ปฏิเสธเดินเท่าเดิมทุกหลัก
// ช่วงแรกเริ่มวัยรุ่น เพราะงานศพมีตั้งแต่ช่วงวัยรุ่น · gone = หายตัวไปทั้งที่ยังไม่ตาย
const ENTRY = { salt: 0x6a7e5d1, accept: 0, decline: 1, bands: [{ from: 13, to: 18, p: 1 }, { from: 25, to: 45, p: 0.5 }, { from: 50, to: 75, p: 0.5 }] };
const ENTRY_EVENTS = {
  circle: {
    bands: [0, 1, 2], gone: true,
    text: 'เดินกลับบ้านตอนค่ำ จู่ ๆ ใต้เท้าก็มีวงกลมเรืองแสงสีฟ้าขึ้นมา มีเสียงผู้หญิงเรียกชื่อคุณอยู่ในวง',
    choices: ['ก้าวเข้าไปในวง', 'ถอยออกมาแล้วรีบเดินกลับบ้าน'],
  },
  puzzle: {
    bands: [0], gone: true,
    text: 'เกมมือถือที่ไม่เคยโหลดโผล่ขึ้นมาในเครื่อง ด่านสุดท้ายถามว่าถ้าแก้ปริศนาข้อนี้ได้ จะยอมไปช่วยโลกอื่นไหม',
    choices: ['พิมพ์คำตอบแล้วกดยอม', 'ลบแอปทิ้ง'],
  },
  rescue: {
    bands: [0, 1, 2],
    text: 'เด็กคนหนึ่งวิ่งตามลูกบอลลงไปกลางถนน รถกำลังมา ไม่มีใครอยู่ใกล้กว่าคุณ',
    choices: ['วิ่งเข้าไปผลักเด็กออก', 'ตะโกนเรียก เด็กหันมาทันพอดี'],
  },
  overwork: {
    bands: [1],
    text: 'ทำงานติดกันมาเป็นเดือน คืนนี้ง่วงจนตาจะปิด รู้สึกแปลก ๆ ว่าถ้าหลับตอนนี้คงไม่ได้ตื่นที่เดิม',
    choices: ['ปล่อยให้หลับไป', 'ลุกไปล้างหน้า พรุ่งนี้ขอลาพัก'],
  },
  dream: {
    bands: [2],
    text: 'คืนนี้หลับสบายเป็นพิเศษ ในฝันมีประตูไม้บานหนึ่งแง้มอยู่ แสงอุ่น ๆ ลอดออกมา',
    choices: ['เดินเข้าประตู', 'หันหลังกลับ ตื่นมาตอนเช้าตามปกติ'],
  },
  truck: {
    bands: [1, 2],
    text: 'รถบรรทุกคันหนึ่งพุ่งมาทางม้าลาย ในหัวแวบขึ้นมาว่า แบบนี้ในนิยายเขาได้ไปต่างโลกกันนี่นา',
    choices: ['ยืนนิ่ง ลองดูสักตั้ง', 'กระโดดหลบตามสัญชาตญาณ'],
  },
  door: {
    bands: [1, 2], trip: true, gone: true,
    text: 'ประตูห้องเก็บของที่ปิดตายมาหลายปีแง้มออกเอง ข้างในเป็นทุ่งหญ้ากับท้องฟ้าที่มีดวงจันทร์สองดวง ลมพัดกลิ่นดอกไม้แปลก ๆ ออกมา',
    choices: ['ก้าวข้ามธรณีประตูไปดู', 'ปิดประตูแล้วล็อกกุญแจ'],
  },
};

// ไปกลับกลางชีวิต (B68m): ร่างเดิมข้ามไปทั้งตัว ไม่เกิดใหม่ · stream แยกตอนกดรับ ⇒ ชีวิตที่ปฏิเสธเดินเท่าเดิม
// years = ปีที่ต้องตามหาทางกลับก่อนการ์ดทางกลับมา (B154) · thai = น้ำหนักจำนวนปีไทยที่ผ่านไป (ช่องที่ i = i ปี · 0 = ไม่กี่เดือน) · back = โอกาสได้กลับของการ์ดหายตัว
// roles = บทบาทที่เนื้อเรื่องเป็นคนถูกส่งข้ามไป · finale = ฉากสุดท้ายห่างจากวันมาถึงเท่ากับระยะเดิมของบทบาท
// wit/fame/know = ตัวหารแปลงค่าข้ามโลก (ความรู้ไทย→wit · ชื่อเสียง→เครือข่าย · ความรู้โลกเดิม→ความรู้) · ทองกลับมาเป็นเงินผ่านค่าจริง (LINK)
const TRIP = { salt: 0x7219b3, years: [3, 12], thai: [6, 3, 2, 1], back: 0.5, roles: ['hero', 'slowlife'], wit: 10, fame: 5, know: 15, cap: 10 };

// ไปต่างโลกได้ 2 แบบ (เจ้าของเคาะ): ตาย กับหายตัว — ป้ายอายุตอนจบทุกจุดแยกตามแบบ · ไปกลับแล้วตายในต่างโลก = หายตัว
const lifeEndWord = (gone) => (gone ? 'หายตัวไปตอนอายุ' : 'ตายอายุ');
const isGone = (st) => !!ENTRY_EVENTS[st?.isekaiVia]?.gone || !!st?.tripLost;

// หายตัวไม่มีศพ จึงไม่มีงานศพ/คำสั่งเสีย (B137 · เจ้าของเคาะทับ B68d) — แทนด้วยใบคนที่บ้านออกตามหา ให้ผู้เล่นตอบว่ารู้สึกอย่างไร
// ตัวเลือกไม่มีผลกับค่าหรือบัญชี (ชีวิตจบแล้ว) · reply = การ์ดผลใบถัดไป ก่อนมรณบัตร
const GONE_SEARCH = {
  id: 'gone_search',
  text: 'คนที่บ้านติดประกาศคนหายไว้ทั่วตลาด แจ้งความไว้ทุกโรงพัก ไฟหน้าบ้านยังเปิดทิ้งไว้ทุกคืน คุณมองเห็นทุกอย่างจากที่ที่ไกลมาก',
  choices: [
    { text: 'อยากบอกพวกเขาว่าไม่ต้องรอแล้ว', reply: 'เสียงของคุณไปไม่ถึง แต่คืนหนึ่งไฟหน้าบ้านก็ดับลงเอง' },
    { text: 'ดีใจที่ยังมีคนตามหา', reply: 'รูปของคุณบนประกาศซีดลงทุกปี แต่ไม่เคยมีใครดึงออก' },
    { text: 'เสียดายเรื่องที่ยังไม่ได้ทำ', reply: 'เรื่องที่ค้างไว้มีคนในบ้านเก็บไปทำต่อทีละเรื่อง' },
    { text: 'ปล่อยวาง ทุกอย่างผ่านไปแล้ว', reply: 'ภาพบ้านหลังนั้นค่อย ๆ จางลง จนเหลือแค่แสงสีขาว' },
  ],
};

// ทอยตอนกดรับ: ได้ไปกลับไหม · ตามหาทางกลับกี่ปี · กี่ปีไทย — ดึงเลขครบทุกครั้งแม้ไม่ได้กลับ ลำดับจึงไม่ขึ้นกับผล
function tripRoll(seed, id, n = 0) {
  const rng = makeRng(mixSeed(seed ^ TRIP.salt, n));
  const back = rng.next() < TRIP.back;
  const years = rng.int(TRIP.years[0], TRIP.years[1]);
  let x = rng.next() * TRIP.thai.reduce((s, w) => s + w, 0);
  const thai = Math.max(0, TRIP.thai.findIndex((w) => (x -= w) < 0));
  const role = rng.pick(TRIP.roles);
  const e = ENTRY_EVENTS[id];
  return e.trip || (e.gone && back) ? { years, thai, role } : null;
}

// การ์ดที่พากลับ (เควส/อีเวนต์) เล่าทางกลับไปแล้ว — การ์ดจบจึงปิดแค่ชีวิตในโลกนี้
const TRIP_HOME = 'แล้วก็ถึงเวลากลับบ้าน';
// ตามหาทางกลับ (B154): ทุ่มเทได้ทุกช่วงวัยเฉพาะชาติที่เป็นทริป · ครบ trip.years ปี (ปีที่ทอยไว้) = การ์ดทางกลับ
// ไม่มีค่าที่ขึ้น — ปีที่ใช้ตามหาคือปีที่ไม่ได้ฝึกอย่างอื่น
const TRIP_QUEST = { id: 'home', event: 'trip_quest', focus: { name: 'ตามหาทางกลับบ้าน', gain: { joy: -1 },
  lines: ['ตามรอยคนต่างโลกรุ่นก่อนจากบันทึกเก่าในหอสมุด', 'ถามหาประตูหินจากพ่อค้าทุกคาราวานที่ผ่านมา', 'เดินสำรวจซากเมืองโบราณที่คนเล่าว่าเคยมีคนหายตัว'] } };
// ของที่พกกลับบ้านนอกค่าจริงที่สะท้อนกลับ — ความรู้โลกเดิมรวมทุกหมวด · เงินไม่อยู่ที่นี่ (B136 · เจ้าของเคาะ) มาจากค่าจริงทางเดียว ไม่นับซ้ำ
function tripCarry(isk) {
  const know = Object.values(isk.know).reduce((s, v) => s + v, 0);
  return {
    network: Math.min(TRIP.cap, Math.max(0, isk.st.fame) / TRIP.fame),
    knowledge: Math.min(TRIP.cap, know / TRIP.know),
  };
}
// แถวทริปในผังตระกูลของชาติไทย — lore รูปเดียวกับแถวชาติต่างโลก ให้ isekaiWorldLore อ่านได้ทางเดียว
const tripLineage = (isk) => ({ world: isekaiFrame(isk).name, age: isk.trip.from, years: isk.age - isk.trip.from, ending: isk.ending.title, ...(isk.home && { home: true }), ...(isk.lore.length && { lore: { world: isk.world, ids: isk.lore.slice() } }), ...(isk.legend && { legend: { ...isk.legend } }) });

function entryOffers(seed) {
  const rng = makeRng(seed ^ ENTRY.salt);
  const out = [];
  ENTRY.bands.forEach((b, i) => {
    const hit = rng.next() < b.p;
    const age = rng.int(b.from, b.to);
    const id = rng.pick(Object.keys(ENTRY_EVENTS).filter((k) => ENTRY_EVENTS[k].bands.includes(i)));
    if (hit) out.push({ age, id });
  });
  return out;
}

// การ์ดชวนของอายุนี้ (ใบละครั้ง) · ไม่ผ่าน emit ⇒ เลขการ์ดของชีวิตไม่เลื่อน
function entryCard(st, stage) {
  st.isekaiEntry ??= entryOffers(st.seed);
  const o = st.isekaiEntry.find((x) => x.age === st.age && !x.seen);
  if (!o) return null;
  o.seen = true;
  const e = ENTRY_EVENTS[o.id];
  st.pending = { entry: o.id, choices: e.choices.map((text) => ({ text })) };
  return {
    kind: 'event', id: `isekai_${o.id}`, entry: o.id, gone: !!e.gone, ...(e.trip && { trip: true }), type: 'B', national: false, funeral: false,
    age: st.age, stage, title: null, text: e.text, choices: [...e.choices],
    // ปุ่มไม่บอกว่าตาย หายตัว หรือได้กลับ — ผู้เล่นรู้จากเรื่องหลังกดรับ
    fx: ['', ''], locked: [null, null],
  };
}

// karma = ระดับกรรมที่ปรโลก (−1..1) · past = ชื่อชาติไทย · run = รอบที่เท่าไรของการอยู่ต่างโลกติดกัน · memory = ค่าที่ติดตัวมาจากรอบก่อน
// ledger = บัญชีที่ดวงวิญญาณพกมา · ไม่ส่ง (harness ที่เรียกโมดูลตรง) = บัญชีเปล่า
// fated = ชีวิตนี้ถูกเรียกข้ามโลกจากการ์ดชวน (ธง isekai_call · ตายหรือหายตัว) — เทพธิดาโผล่แน่นอนแล้ว ได้โชคเพิ่ม
// real = ค่าโลกจริงตอนข้าม { stats, money, unit (รายได้ครัวเรือนประเทศต่อปี), age } · ไม่ส่ง (harness ที่เรียกโมดูลตรง) = ค่าตั้งต้นของโลกล้วน
// lore = ของที่แต่ละโลกจำได้จากชาติก่อน ๆ ทั้งเซฟ ({ world: [id] } จาก isekaiWorldLore)
// trip = ไปกลับกลางชีวิต (B68m · tripRoll + age/wit จากชีวิตไทย) — ข้ามห้องสีขาว บทบาทมาจากการทอย เริ่มที่อายุไทย เลือกกลับบนการ์ดทางกลับ = จบแบบกลับบ้าน
// legends = คนต่างโลกรุ่นก่อนที่แต่ละโลกจำชื่อได้ ({ world: [{ name, ending, dark }] } จาก isekaiWorldLegends)
// legacy = เริ่มด้วยแฟ้มบทบาท 4 โลกเดิม — เส้นทดสอบของ harness เท่านั้น (ผู้เล่นใหม่เข้าไม่ได้) จนกว่าการ์ด 4 โลกจะถูกลบ (06c)
// carry = สกิลที่พกมาจากชีวิตไทยของดวงวิญญาณนี้ [{ id, lv }] (06s) — ของขวัญของชาติสุ่มจากที่เหลือ
function startIsekai({ seed, karma = 0, past = '', run = 0, memory = null, blessed = false, fated = false, ledger = newLedger(), real = null, lore = {}, legends = {}, trip = null, hints = null, legacy = false, carry = [], overlapStage = 0 }) {
  const rng = makeRng(mixSeed(seed ^ ISEKAI_SALT, run));
  const sk = ISEKAI.skills + (karma >= ISEKAI.karmaSkill ? 1 : 0) - (karma <= -ISEKAI.karmaSkill ? 1 : 0) + (blessed ? 1 : 0);
  const vow = blessed ? GODDESS_VOWS[(seed >>> 0) % GODDESS_VOWS.length].id : null;
  const isk = {
    rng, karma, past, run, memory, blessed, fated, ledger, vow, vowKept: null, vowHit: false,
    real: real && { ...real, stats: { ...real.stats } },
    worldOffers: legacy ? isekaiRoleOffers(rng, karma, ISEKAI.worlds + (blessed ? 1 : 0)) : contOffers(rng, CONT_LIFE.offers + (blessed ? 1 : 0)),
    // สับทั้งรายการก่อนกรองของที่พกมา — เลขสุ่มที่ใช้เท่ากันไม่ว่าพกอะไร
    skillOffers: isekaiShuffle(rng, Object.keys(ISEKAI_SKILLS)).filter((s) => !carry.some((c) => c.id === s)).slice(0, sk),
    role: null, world: null, name: '', skills: carry.map((c) => c.id), st: null, inner: null, flags: {},
    // isk.lv เก็บเฉพาะสกิลที่เกินขั้น 1 — ชาติที่ไม่มีการอัปเกรด state เท่าก่อนมีขั้น (lifehash)
    ...(carry.some((c) => c.lv > 1) && { lv: Object.fromEntries(carry.filter((c) => c.lv > 1).map((c) => [c.id, c.lv])) }),
    ...(carry.some((c) => c.cap > 1) && { cap: Object.fromEntries(carry.filter((c) => c.cap > 1).map((c) => [c.id, c.cap])) }),
    know: null, knowLast: null, loreAll: lore, worldLore: [], lore: [],
    legendAll: legends, worldLegends: [], legend: null, fameDark: 0, potions: [], lifeAdd: 0,
    age: 0, focus: null, focusOffers: [], stageShown: null, due: null, used: [], later: [], finaleDone: false,
    step: 'world', last: null, rbdUsed: false, dead: false, natural: false, ending: null, log: [], chron: [], cards: 0,
    // ทริปศาล (B153): hints = คำใบ้จากเนื้อหา (ผู้เรียกส่ง content.nearHints) · court = ใบศาลที่รอออก visit|summons
    hints, court: null,
    // ขั้นค่าซ้อนทับของตระกูลตอนข้าม (ผู้เรียกคิดจาก overlapStageOf — ค่าไม่ขยับระหว่างอยู่ต่างโลก) · ใส่ช่องเฉพาะเมื่อ > 0 ⇒ ตระกูลค่า 0 สถานะเท่าเดิมทุกไบต์
    ...(overlapStage && { overlapStage }),
  };
  // ขั้วอำนาจ · ข้อพิพาท · ดันเจียนลับของชาตินี้ (stream ของทวีปเอง) — 06c เริ่มใช้
  if (!legacy) isk.nation = contNation(mixSeed(seed, run));
  if (trip) {
    // money0 = เงินจริงตอนข้าม ให้ขากลับคิดส่วนต่างที่เกิดในต่างโลกได้ (B136)
    isk.trip = { ...trip, from: trip.age, ...(isk.real && { money0: isk.real.money }) };
    // ทริปทอยบทบาทไว้ตั้งแต่ก่อนมีทวีป (ลำดับเลขสุ่มของ tripRoll คงเดิม) · ชาติทวีปลงแคว้นสุ่มด้วยเผ่าของทริป
    if (legacy) isekaiStart(isk, trip.role);
    else contStart(isk, contBirth(isk.rng, CONT_LIFE.tripRace));
    isk.age = trip.age;
    isk.inner.wit += trip.wit ?? 0;
    isk.step = 'skill';
  }
  return isk;
}

// แฟ้มเกิด: แคว้น + เผ่าไม่ซ้ำคู่กัน ตามน้ำหนักระดับโอกาสเกิด · กรรมไม่เอียง (ค่าแนะนำ 06b)
function contOffers(rng, n) {
  const out = [];
  for (let i = 0; out.length < n && i < n * 20; i++) {
    const b = contBirth(rng);
    if (!out.some((o) => o.region === b.region && o.race === b.race)) out.push(b);
  }
  return out;
}

// สุ่มบทบาทไม่ซ้ำตามน้ำหนัก · กรรมเอียงน้ำหนักแต่ไม่ตัดบทบาทไหนทิ้ง · ชุดที่ไม่มีคนธรรมดา = แทนใบสุดท้าย
function isekaiRoleOffers(rng, karma, n) {
  const pool = Object.entries(ISEKAI_ROLES).map(([id, r]) => ({ id, w: r.p * Math.max(0.2, 1 + r.lean * karma * ISEKAI.roleLean) }));
  const out = [];
  while (out.length < n && pool.length) {
    let x = rng.next() * pool.reduce((s, r) => s + r.w, 0);
    const i = pool.findIndex((r) => (x -= r.w) < 0);
    out.push(pool.splice(i < 0 ? pool.length - 1 : i, 1)[0].id);
  }
  if (!out.includes('commoner')) out[out.length - 1] = 'commoner';
  return out;
}

const isekaiHas = (isk, s) => isk.skills.includes(s);
// บาปหนักทำให้ทุกด่านยากขึ้น — บุญไม่ทำให้ง่ายลง (บุญได้ทางค่าเริ่มกับสกิลแล้ว)
const isekaiDc = (isk, c) => c.dc + (isk.karma < 0 ? Math.round(-isk.karma * ISEKAI.karmaDc) : 0);

// สกิลที่ตรงสายของตัวเลือก — ป้าย % กับบันทึก "ช่วยไว้" ใช้ชุดเดียวกับที่บวกโอกาสจริง (B107b)
const isekaiAids = (isk, c) => isk.skills.filter((s) => ISEKAI_SKILLS[s].tag && ISEKAI_SKILLS[s].tag === c.tag);

// withSkills = false คือโอกาสถ้าไม่มีสกิล — ใช้เทียบว่าสกิลเพิ่มจริงเท่าไรหลังตัดเพดาน 5–95
// ตัวเลือกความรู้ (c.know = หมวด) ทอยด้วยความรู้หมวดนั้น + ความรู้ทั่วไปส่วนหนึ่ง แทนค่าสถานะ
function isekaiChance(isk, c, withSkills = true) {
  if (!c.stat && !c.know) return null;
  const base = c.know ? isk.know[c.know] + isk.inner.wit * ISEKAI_KNOW_T.wit : isk.st[c.stat];
  let v = 50 + (base - isekaiDc(isk, c)) * 4;
  if (withSkills) for (const s of isekaiAids(isk, c)) v += skillAdd(isk, s);
  for (const b of [c.bonus, c.bonus2]) if (b && isk.flags[b.flag]) v += b.add;
  if (c.stat === 'cha') v += isekaiFameCha(isk);
  return isekaiClamp(Math.round(v), 5, 95);
}

// คนรู้จักมากคุยง่ายขึ้น (มีเพดาน) · โลกที่จำคนต่างโลกเป็นคนร้ายมากกว่าวีรบุรุษ ระแวงคนต่างโลกทุกคน
const isekaiFameCha = (isk) => {
  const F = ISEKAI_FAME;
  const ls = isekaiLegends(isk);
  return Math.min(F.chaCap, Math.floor(Math.max(0, isk.st.fame) / F.chaPer)) - (ls.filter((l) => l.dark).length * 2 > ls.length ? F.dark : 0);
};

const isekaiPace = (isk) => (isk.race ? CONT_RACES[isk.race].pace : ISEKAI_ROLES[isk.role].pace ?? 1);
// กรอบของชาติ: ชาติเก่า = บทบาท · ชาติทวีป = ชื่อแคว้น · ค่าเริ่มเผ่า · ทอง/ชื่อยืมบทบาท like
const isekaiFrame = (isk) => {
  if (isk.role) return roleInfo(isk.role);
  const like = ISEKAI_ROLES[CONT_LIFE.like];
  return { name: `${CONT_LIFE.name} · ${CONT_REGIONS[isk.region].name}`, names: like.names, stat: { ...contRaceStart(isk.race), gold: like.stat.gold }, startAge: 0 };
};
// อายุบนจอ: pace ไม่เต็ม (ชาวสัตว์ 0.9 · ออร์ค 0.8) ทำให้อายุในเกมเป็นทศนิยม — ปัดลงตอนแสดงเท่านั้น (เจ้าของเคาะรอบ 4) · pace เต็มได้ค่าเดิม
const isekaiShownAge = (a) => Math.floor(a + 1e-9);
// ยาต่ออายุ (B68k) เลื่อนจุดที่ร่างกายเริ่มเสื่อมกับเพดานอายุไปพร้อมกัน · ป้ายช่วงวัยไม่เลื่อน · เซฟก่อน B68k ไม่มี lifeAdd
const isekaiOldAge = (isk) => (ISEKAI_STAGES.at(-1).from + (isk.lifeAdd ?? 0)) * isekaiPace(isk);
const isekaiStageOf = (isk) => ISEKAI_STAGES.findLast((s) => isk.age >= s.from * isekaiPace(isk));
// ทางลัดความรู้ใช้ id 'k:<หมวด>' · kc = หมวดที่ทางลัดนี้เติมความรู้และดึงเหตุการณ์
// ตามน้ำ (ui-redo 83): ไม่มีการ์ดหยุดถามแล้ว ช่วงแรกของชาติกับช่วงวัยที่โฟกัสเดิมหลุดจึงเดินโดยไม่ตั้งโฟกัส — ไม่มีผลเพิ่ม ไม่ถ่วงการ์ด
const ISEKAI_FLOW = { name: FOCUS_FLOW_NAME, gain: {}, lines: ['ใช้ชีวิตไปตามจังหวะของโลกนี้ ไม่ได้ทุ่มเทเรื่องไหนเป็นพิเศษ'] };
const isekaiFocusDef = (isk, id) => {
  if (!id || id === FOCUS_FLOW) return ISEKAI_FLOW;
  if (id === 'role') return isekaiFrame(isk).focus;
  if (id?.startsWith('k:')) return { ...ISEKAI_KNOW[id.slice(2)].focus, kc: id.slice(2) };
  if (id === TRIP_QUEST.id) return TRIP_QUEST.focus;
  return ISEKAI_FOCUS[id];
};
// ทางลัดที่ความรู้ถึงเกณฑ์แล้วในช่วงวัยนี้ — ต่อท้ายรายการ ลำดับเดิมไม่เลื่อน
const isekaiKnowOffers = (isk, stage) => Object.keys(ISEKAI_KNOW).filter((k) => isk.know[k] >= ISEKAI_KNOW_T.shortcut && (!ISEKAI_KNOW[k].stages || ISEKAI_KNOW[k].stages.includes(stage.id))).map((k) => `k:${k}`);
// สิ่งที่ทุ่มเทได้ในช่วงวัยนี้ — ของบทบาทอยู่ใบแรกเสมอ
// ตามหาทางกลับต่อท้ายของกลาง เฉพาะทริป ⇒ ชาติที่เกิดในต่างโลกได้รายการเท่าเดิม
const isekaiFocusOffers = (isk, stage) => [...(isk.role ? ['role'] : []), ...Object.keys(ISEKAI_FOCUS).filter((id) => !ISEKAI_FOCUS[id].stages || ISEKAI_FOCUS[id].stages.includes(stage.id)), ...(isk.trip ? [TRIP_QUEST.id] : []), ...isekaiKnowOffers(isk, stage)];
// ป้ายบนปุ่มทุ่มเท: บอกว่าค่าไหนขึ้น ไม่บอกตัวเลข · สุข/รู้/บารมี/เป้าหมายโลกเป็นค่าซ่อน จึงไม่ขึ้นป้าย
const ISEKAI_FOCUS_HIDDEN = new Set(['joy', 'wit', 'know', 'cha', 'goal']);
const isekaiFocusFx = (isk, id) => {
  if (id === TRIP_QUEST.id) return 'ใกล้ทางกลับบ้านขึ้น';
  const f = isekaiFocusDef(isk, id);
  const up = Object.entries(f.gain).filter(([k, v]) => v > 0 && !ISEKAI_FOCUS_HIDDEN.has(k)).map(([k]) => ISEKAI_FX[k]);
  return up.length ? `${up.join(' · ')} ขึ้น` : '';
};

function isekaiStart(isk, rid) {
  const r = roleInfo(rid);
  isk.role = rid;
  isk.world = r.world ?? rid;
  isekaiBegin(isk, r);
}

function contStart(isk, { region, race }) {
  isk.region = region;
  isk.race = race;
  isk.world = CONT_LIFE.world;
  isekaiBegin(isk, isekaiFrame(isk));
}

// ส่วนที่ชาติเก่า/ชาติทวีปเริ่มเหมือนกัน: ชื่อ · ค่าเริ่ม + กรรม · ความทรงจำโลก · อายุเริ่ม
function isekaiBegin(isk, r) {
  isk.name = isk.rng.pick(r.names).replace('{p}', isk.past);
  const shift = Math.round(isk.karma * ISEKAI.karmaStat);
  isk.st = { hp: 100, gold: r.stat.gold, fame: 0, goal: 0 };
  for (const k of Object.keys(ISEKAI_STAT)) isk.st[k] = Math.max(1, r.stat[k] + shift);
  if (isk.memory) isk.st[isk.memory] += ISEKAI.memory;
  if (isk.fated) isk.st.luk += GODDESS.fatedLuck;
  // โชคเทพธิดาที่พกมาได้ผลตั้งแต่เกิดแบบเดียวกับเลือกเป็นของขวัญ (ของขวัญกรองตัวที่พกออกแล้ว ไม่บวกซ้ำ)
  if (isekaiHas(isk, 'luck')) isk.st.luk += 15;
  isk.inner = { joy: ISEKAI_TIME.joy, wit: ISEKAI_TIME.wit };
  isk.know = Object.fromEntries(Object.keys(ISEKAI_KNOW).map((k) => [k, 0]));
  isk.worldLore = isk.loreAll[isk.world] ?? [];
  isk.worldLegends = isk.legendAll[isk.world] ?? [];
  isk.age =(r.startAge ?? 0) * isekaiPace(isk);
  if (isk.real) linkStart(isk, r.stat.gold);
  // เริ่มชาติใต้เกณฑ์เตือนไม่นับว่าตก (เหมือนชีวิตไทยที่เกิดมาใต้เกณฑ์)
  isk.lowWarned = isk.st.hp <= WARN.isekai;
}

function linkStart(isk, gold0) {
  const { stats, money, unit, age } = isk.real;
  const wt = Math.min(1, age / LINK.age);
  for (const [k, r] of Object.entries(ISEKAI_LINK)) isk.st[k] = Math.max(k === 'fame' ? 0 : 1, isk.st[k] + Math.round(isekaiClamp((wt * (stats[r] - 50)) / LINK.div, -LINK.part, LINK.part)));
  isk.st.hp = Math.round(100 - Math.min(LINK.hpCut, wt * Math.max(0, 50 - stats.health)));
  isk.st.gold = isekaiClamp(Math.round(gold0 + (wt * money * LINK.gold) / unit), 0, gold0 * LINK.goldCap);
}

// ส่วนต่างที่เกิดจริงฝั่งต่างโลก (หลังชนเพดานแล้ว) สะท้อนกลับค่าจริง · ค่าจริงชนเพดานก็ตัดส่วนเกิน
function linkBack(isk, k, raw, w = 1) {
  const s = isk.real.stats;
  const d = raw * w;
  if (k === 'hp') s.health = isekaiClamp(s.health + d, 0, 100);
  else if (k === 'gold') isk.real.money += (d * isk.real.unit) / LINK.gold;
  else if (ISEKAI_LINK[k]) s[ISEKAI_LINK[k]] = isekaiClamp(s[ISEKAI_LINK[k]] + d * LINK.div, 0, 100);
}

// โลกจำ (B68h · เจ้าของเคาะ ทั้งเซฟ ต่อโลก): อ่านจากแถวผังตระกูลต่างโลก ซึ่งส่งต่อทุกชาติอยู่แล้ว ⇒ ไม่ต้องมีที่เก็บใหม่ในเซฟ
function isekaiWorldLore(rows = []) {
  const out = {};
  for (const l of rows.flatMap((r) => [r, ...(r.trips ?? [])])) if (l.lore) out[l.lore.world] = [...new Set([...(out[l.lore.world] ?? []), ...l.lore.ids])];
  return out;
}

// ตำนานข้ามชาติ (B68i): อ่านจากแถวผังตระกูลแบบเดียวกับโลกจำ · เรียงตามลำดับแถว คนท้ายสุดคือรุ่นล่าสุด
function isekaiWorldLegends(rows = []) {
  const out = {};
  for (const l of rows.flatMap((r) => [r, ...(r.trips ?? [])])) if (l.legend) (out[l.legend.world] ??= []).push({ name: l.legend.name, ending: l.legend.ending, dark: l.legend.dark });
  return out;
}

// เซฟแบบภาพถ่ายก่อน B68i ไม่มีช่องตำนาน
const isekaiLegends = (isk) => isk.worldLegends ?? [];
const isekaiLegendKind = (l) => (l.dark ? 'dark' : 'hero');
// เหตุการณ์ตำนานเรียกชื่อคนล่าสุดในตำนานแบบเดียวกับเรื่อง
const isekaiLegendFill = (isk, ev, s) => (ev.legend ? s.replaceAll('{legend}', isekaiLegends(isk).findLast((l) => isekaiLegendKind(l) === ev.legend)?.name ?? '') : s);
// ตัวแทนของกองทวีป (06c-2) — มีแค่ชาติทวีป (ตัวกรองกองกันชาติเก่าไว้แล้ว) · ขั้วที่มี 2 แคว้นเรียกแคว้นที่อยู่หรือติดผู้เล่นก่อน
const CONT_FILL = ['land', 'major', 'falling', 'rising', 'dispute'];
const contFill = (isk, s) => {
  const p = isk.nation.powers;
  const power = (kind) => CONT_REGIONS[contPowerAt(isk, kind) ?? (kind === 'major' ? p.major : p[kind][0])].name;
  const val = { land: () => CONT_REGIONS[isk.region].name, major: () => power('major'), falling: () => power('falling'), rising: () => power('rising'), dispute: () => CONT_DISPUTES[isk.nation.dispute].name };
  return CONT_FILL.reduce((t, k) => (t.includes(`{${k}}`) ? t.replaceAll(`{${k}}`, val[k]()) : t), s);
};
const isekaiFill = (isk, ev, s) => (contDeckOf(ev) ? contFill(isk, isekaiLegendFill(isk, ev, s)) : isekaiLegendFill(isk, ev, s));

// ความรู้หมวดเดียว: ยิ่งรู้มากยิ่งโตช้า (สูตรเดียวกับค่าสถานะ) · ลบได้เต็มค่า
function isekaiLearn(isk, cat, v) {
  if (!cat || !v) return;
  const k = v > 0 ? ISEKAI_KNOW_T.gainK / (ISEKAI_KNOW_T.gainK + isk.know[cat]) : 1;
  isk.know[cat] = isekaiClamp(isk.know[cat] + v * k, 0, 100);
}

// คำสัญญาเทพธิดา: ผิดทันทีที่กดตัวเลือกที่มีหมวดต้องห้าม · ข้อที่ต้องทำ ตัดสินตอนจบรอบ
function vowTrack(isk, tags = []) {
  const v = GODDESS_VOWS.find((x) => x.id === isk.vow);
  if (!v || isk.vowKept === false) return;
  if (v.breaks && tags.some((t) => t.cat === v.breaks)) {
    isk.vowKept = false;
    recordMerit(isk.ledger, [{ cat: 'vow_broken' }], 'goddess');
  }
  if (v.needs && tags.some((t) => t.cat === v.needs)) isk.vowHit = true;
}

function vowSettle(isk) {
  const v = GODDESS_VOWS.find((x) => x.id === isk.vow);
  if (!v || isk.vowKept === false) return;
  isk.vowKept = v.needs ? isk.vowHit : true;
  recordMerit(isk.ledger, [isk.vowKept ? { cat: 'keep_goddess_vow', level: GODDESS.vowLevel } : { cat: 'vow_broken' }], 'goddess');
}

function isekaiApply(isk, fx = {}) {
  const out = {};
  for (const [k, raw] of Object.entries(fx)) {
    let v = raw;
    if (isekaiHas(isk, 'exp') && v > 0 && ISEKAI_STAT[k]) v *= 2;
    if (isekaiHas(isk, 'storage') && k === 'gold' && v > 0) v = Math.round(v * 1.5);
    const was = isk.st[k];
    if (k === 'goal' || k === 'hp') isk.st[k] = isekaiClamp(isk.st[k] + v, 0, 100);
    else isk.st[k] = Math.max(0, isk.st[k] + v);
    if (isk.real && isk.st[k] !== was) linkBack(isk, k, isk.st[k] - was);
    if (v) out[k] = v;
  }
  return out;
}

// ผลของการทุ่มเท units ปี (ปีแบบมนุษย์ — เอลฟ์ใช้เวลาจริงนานกว่า แต่โตเท่ากันต่อตา)
// ค่ายิ่งสูงยิ่งขึ้นช้า ⇒ ทุ่มเรื่องเดียวทั้งชีวิตไม่ทะลุจนทุกด่านง่าย · สุขดีฝึกไว · รู้มากฝึกเวทไว
// know = ความรู้ของหมวดทางลัด (kc) หรือหมวดที่แตะล่าสุดเมื่ออ่านตำรา
function isekaiGrow(isk, gain, units, kc = null) {
  const T = ISEKAI_TIME;
  const joyRate = 0.6 + isk.inner.joy / 125;
  const rate = isekaiStageOf(isk).rate;
  for (const [k, per] of Object.entries(gain)) {
    let v = per * units;
    if (k === 'know') {
      isekaiLearn(isk, kc ?? isk.knowLast, v * rate * joyRate);
      continue;
    }
    if (ISEKAI_STAT[k] || k === 'wit') v *= (rate * joyRate * T.gainK) / (T.gainK + (k === 'wit' ? isk.inner.wit : isk.st[k]));
    if (k === 'mag') v *= 1 + isk.inner.wit / 100;
    if (k === 'goal') v *= joyRate;
    if (ISEKAI_STAT[k] && isekaiHas(isk, 'exp')) v *= 2;
    if (k === 'gold' && isekaiHas(isk, 'storage')) v *= 1.5;
    if (k === 'joy' || k === 'wit') isk.inner[k] = isekaiClamp(isk.inner[k] + v, 0, 100);
    else if (k === 'hp' || k === 'goal') isk.st[k] = isekaiClamp(isk.st[k] + v, 0, 100);
    else isk.st[k] = Math.max(0, isk.st[k] + v);
  }
}

// ปีเต็มของโฟกัส (05a): กติกากลางเดียวกับโลกหลัก — ปีที่เปลี่ยนไม่นับ · สะสมไม่ต้องติดกัน · ตาวัยชราเดินทีละหลายปี นับทุกปีของตา
// ช่วงวัย/ทางลัดคุมที่ใบทุ่มเทแล้ว ที่นี่นับปีอย่างเดียว · คืนอาชีพที่ได้ใหม่ในตานี้ (ผลเริ่มตาถัดไป · คิดใน isekaiYear)
function isekaiFocusCount(isk, from, units) {
  const p = isekaiPace(isk);
  // เซฟก่อน 05a ไม่มีอายุที่เปลี่ยน — เริ่มนับจากตานี้
  isk.focusAt ??= from;
  const def = isekaiFocusDef(isk, isk.focus);
  const had = isk.careers ?? [];
  for (let i = 0; i < units; i++) {
    const n = isk.focusYears?.[isk.focus] ?? 0;
    focusYearEnd(isk, { [isk.focus]: {} }, null, () => true, from + i * p);
    if (def.merit && (isk.focusYears?.[isk.focus] ?? 0) > n) recordMerit(isk.ledger, [def.merit], isk.focus);
  }
  const ys = isk.focusYears ?? {};
  const hired = Object.keys(ISEKAI_CAREERS).filter((c) => !had.includes(c) && ISEKAI_CAREERS[c].from.reduce((s, id) => s + (ys[id] ?? 0), 0) >= ISEKAI_CAREER_T.years);
  if (hired.length) isk.careers = [...had, ...hired];
  return hired;
}

// หนึ่งตา: HP ฟื้น (ก่อนชรา) หรือเสื่อมแรงขึ้นทุกปี (หลังชรา) → ทุ่มเท → ใจกลับเข้ากลาง → อายุเดิน
// ฟื้นก่อนทุ่มเท ⇒ สิ่งที่ทุ่มเทที่กิน HP (เดินทางเสี่ยงโชค) ทำให้ตายได้จริง ไม่ถูกฟื้นกลบท้ายตา
// เสื่อมคูณด้วยความสุข: สุขดีแก่ช้า · พ้นวัยชราเกิน cap ปี ร่างหมดแรงแน่ ชีวิตจึงจบเสมอ
function isekaiYear(isk) {
  const T = ISEKAI_TIME;
  const p = isekaiPace(isk), oldAt = isekaiOldAge(isk);
  const units = isk.age >= oldAt ? T.oldStep : T.step;
  const before = isk.real && { ...isk.st };
  if (isk.age < oldAt) isk.st.hp = isekaiClamp(isk.st.hp + T.regen * units, 0, 100);
  else {
    let d = 0;
    for (let i = 0; i < units; i++) d += T.decay + T.decayGrow * ((isk.age - oldAt) / p + i);
    isk.st.hp = isekaiClamp(isk.st.hp - d * (1.3 - isk.inner.joy / 200), 0, 100);
  }
  const fd = isekaiFocusDef(isk, isk.focus);
  isekaiGrow(isk, fd.gain, units, fd.kc);
  // ผลอาชีพ (05a) คิดพร้อมทุ่มเท ก่อนเพดานอายุ — คิดหลังเพดานแล้ว HP บวกชุบร่างที่หมดแรงให้อยู่ไม่จบ
  for (const c of isk.careers ?? []) isekaiGrow(isk, ISEKAI_CAREERS[c].gain, units);
  isk.inner.joy = isekaiClamp(isk.inner.joy + (50 - isk.inner.joy) * Math.min(1, 0.1 * units), 0, 100);
  isk.age += units * p;
  if (isk.age >= oldAt + T.cap * p) isk.st.hp = 0;
  // ปีที่ทุ่มเท (รวม HP ฟื้น/เสื่อม) สะท้อนกลับค่าจริงทางเดียวกับผลการ์ด แต่เบากว่า (B136) — ส่วนต่างหลังชนเพดานแล้วเท่านั้น
  if (before) for (const k of Object.keys(isk.st)) if (isk.st[k] !== before[k]) linkBack(isk, k, isk.st[k] - before[k], LINK.tick);
  // ทริปไม่กลับเองตามเวลาแล้ว (B154) — นับปีที่ตามหาทางกลับ ครบเมื่อไร isekaiDue ยื่นการ์ดทางกลับ
  if (isk.trip && isk.focus === TRIP_QUEST.id) isk.seek = (isk.seek ?? 0) + units * p;
  return units * p;
}

// ดื่มยาต่ออายุ (B68k): ขวดเกิน free ลงบาปฝืนธรรมชาติก่อน แล้วค่อยดูเพดาน — ดื่มตอนชนเพดานแล้วก็ยังเป็นการฝืน
// ข้อความบอกแค่สิ่งที่ร่างกายรู้สึก ไม่บอกบาป (การ์ดไม่เผยบุญบาป)
function isekaiDrink(isk, id) {
  const P = ISEKAI_POTION;
  (isk.potions ??= []).push(id);
  const n = isk.potions.length;
  if (n > P.free) recordMerit(isk.ledger, [M('against_nature', P.level)], id);
  const add = Math.min(P.years, P.cap - (isk.lifeAdd ?? 0));
  isk.lifeAdd = (isk.lifeAdd ?? 0) + add;
  // ดื่มเกินเพดาน = โกงความตาย (B153): ถูกเรียกตัวแล้วจบชาตินี้ตรงนั้น เหมือนโลกปกติ
  if (add <= 0) {
    isk.court = 'summons';
    isk.dead = true;
    return 'ยาไหลลงคอเหมือนน้ำเปล่า ร่างกายนี้ยืดออกไปไม่ได้อีกแล้ว';
  }
  return n > P.free ? 'อายุขัยยืดออกไปอีก แต่คืนนั้นคุณฝันว่ามองกระจกแล้วไม่เห็นหน้าตัวเอง' : 'อายุขัยยืดออกไปอีก ตัวเบาเหมือนอายุน้อยลงหลายปี';
}

// เหตุการณ์ความรู้มาหาเมื่อรู้ถึงขั้นของเรื่อง · ความรู้อันตรายเฉพาะวัยผู้ใหญ่ขึ้นไป · ของที่โลกนี้จำแล้วไม่ต้องคิดค้นซ้ำ
const ISEKAI_ADULT = ['adult', 'middle', 'old'];
const isekaiKnowOpen = (isk, e, stage) => (!e.know || isk.know[e.know.cat] >= e.know.min) && (!e.adult || ISEKAI_ADULT.includes(stage.id)) && (!e.loreOf || !isk.worldLore.includes(e.loreOf)) && (!e.legend || isekaiLegends(isk).some((l) => isekaiLegendKind(l) === e.legend)) && (!e.bless || isk.karma > 0 || isk.blessed) && isekaiOverlapOk(isk, e);
// การ์ดอ่านแค่ขั้นค่าซ้อนทับ [จาก, ถึง] เหมือน when.overlap_stage ฝั่งไทย · กรองในกองเท่านั้น ไม่ดึงเลขสุ่ม
const isekaiOverlapOk = (isk, e) => !e.overlap_stage || ((isk.overlapStage ?? 0) >= e.overlap_stage[0] && (isk.overlapStage ?? 0) <= e.overlap_stage[1]);

// ขั้วอำนาจที่ผู้เล่นอยู่หรืออยู่ติด (ขาลง/มาแรงมีได้ 2 แคว้น) — ไม่มี = null
const contPowerAt = (isk, kind) => {
  const p = isk.nation.powers;
  return (kind === 'major' ? [p.major] : p[kind]).find((id) => id === isk.region || contNeighbors(isk.region).includes(id)) ?? null;
};
// กองการ์ดทวีป (06c-2): การ์ดจาก content/isekai ผูกได้ช่องเดียว · w = น้ำหนักสุ่ม (เทียบ ×2 ของการ์ดผูกโลกเดียว) · fit = เปิดกองให้ชาตินี้ไหม
// เป็นค่าคงที่ export ให้ตัวควบคุมของ harness-test เปิดตัวกรองทิ้งได้
const CONT_DECK = {
  regions: { w: 2, fit: (isk, e) => e.regions.includes(isk.region) },
  dispute: { w: 2, fit: (isk, e) => e.dispute === isk.nation.dispute },
  power: { w: 1, fit: (isk, e) => !!contPowerAt(isk, e.power) },
};
const contDeckOf = (e) => Object.keys(CONT_DECK).find((k) => e[k] !== undefined);

// ชาติเก่า (มีบทบาท) เห็นการ์ดโลกของบทบาท · ชาติทวีปไม่มีโลกของเรื่อง ⇒ เห็นการ์ดทุกโลก + กองทวีปที่เข้ากับแคว้น/ชาติ
const isekaiFits = (isk, e) => {
  const deck = contDeckOf(e);
  if (deck) return !isk.role && !!isk.nation && CONT_DECK[deck].fit(isk, e);
  return !e.worlds || (!!isk.role && (e.worlds.includes(isk.world) || (e.worlds.length > 1 && e.worlds.includes(ISEKAI_ROLES[isk.role].like))));
};
const isekaiDeckW = (e) => {
  const deck = contDeckOf(e);
  return deck ? CONT_DECK[deck].w : e.worlds?.length === 1 ? 2 : 1;
};

// เรื่องที่ต้องตัดสินของตานี้: ฉากสุดท้ายถึงอายุ → เรื่องต่อที่นัดไว้ → สุ่มจากกองของช่วงวัย
// ทุกตาดึงเลขทอย 1 ครั้งก่อนสุ่มกอง (ยกเว้นฉากบังคับ) · ทุ่มเทสายไหนเรื่องสายนั้นโผล่บ่อยขึ้น · เรื่องที่ต้องมีชื่อเสียงรอจนดังพอ
function isekaiDue(isk) {
  const T = ISEKAI_TIME;
  const w = isekaiFrame(isk);
  const take = (id) => (isk.used.push(id), id);
  const finaleAt = isk.trip ? isk.trip.from + w.finaleAge - w.startAge : w.finaleAge * isekaiPace(isk);
  if (w.finale && !isk.finaleDone && isk.age >= finaleAt) return take(w.finale);
  // การ์ดทางกลับไม่ลง used — เลือกอยู่ต่อแล้วตามหาใหม่ครบอีกรอบ ก็มาอีกได้
  if (isk.trip && (isk.seek ?? 0) >= isk.trip.years) return TRIP_QUEST.event;
  // ทางแยกมาก่อนเรื่องที่นัดไว้ (เรื่องนัดรอตาหน้าได้) · แคว้นปลายทางสุ่มตอนนี้ ⇒ เล่นเซฟซ้ำได้ใบเดิม
  if (!isk.role && (isk.focusYears?.[CONT_MOVE.focus] ?? 0) - (isk.roamFrom ?? 0) >= CONT_MOVE.years) {
    const near = contNeighbors(isk.region);
    if (near.length) {
      isk.moveOffers = isekaiShuffle(isk.rng, near).slice(0, CONT_MOVE.offers);
      return CONT_MOVE.event;
    }
  }
  const li = isk.later.findIndex((l) => l.age <= isk.age);
  if (li >= 0) return take(isk.later.splice(li, 1)[0].id);
  const roll = isk.rng.next();
  if (isk.age < T.quiet * isekaiPace(isk) || roll >= T.eventP) return null;
  const stage = isekaiStageOf(isk);
  const ch = stage.ch;
  const { tag, kc } = isekaiFocusDef(isk, isk.focus);
  // อีเวนต์พากลับเปิดเมื่ออยู่ต่างโลกครบปีไทยที่ทอยไว้ ⇒ อายุร่างกายไม่น้อยกว่าอายุไทยหลังกลับ (st.away ไม่ติดลบ)
  const pool = ISEKAI_EVENTS.filter((e) => !e.finale && !e.follow && e.id !== w.intro && (!e.trip || (isk.trip && e.trip === 'event' && isk.age - isk.trip.from >= isk.trip.thai)) && isekaiFits(isk, e) && e.ch.some((c) => ch.includes(c)) && !isk.used.includes(e.id) && isk.st.fame >= (e.minFame ?? 0) && isekaiKnowOpen(isk, e, stage));
  if (!pool.length) return null;
  const K = ISEKAI_KNOW_T;
  const wt = pool.map((e) => isekaiDeckW(e) * (tag && e.choices.some((c) => c.tag === tag) ? 3 : 1) * (e.know ? (e.know.min ? K.w : K.w0) * (kc === e.know.cat ? K.focusW : 1) : 1));
  let x = isk.rng.next() * wt.reduce((s, v) => s + v, 0);
  return take(pool[Math.max(0, wt.findIndex((v) => (x -= v) < 0))].id);
}

function isekaiStatus(isk) {
  if (!isk.st) return null;
  const r = isekaiFrame(isk);
  // ค่าภายในเก็บทศนิยม (ฝึกทีละนิด) — หน้าต่างสถานะเห็นจำนวนเต็ม · HP ปัดขึ้น ยังไม่ตายไม่เห็น 0
  const st = Object.fromEntries(Object.entries(isk.st).map(([k, v]) => [k, k === 'hp' ? Math.ceil(v) : Math.round(v)]));
  return { name: isk.name, world: r.name, goalName: r.goal, ...(isk.race && { race: CONT_RACES[isk.race].name }), ...st, skills: isk.skills.map((s) => ISEKAI_SKILLS[s].name), age: isekaiShownAge(isk.age), stage: isekaiStageOf(isk).name, focus: isk.focus ? isekaiFocusDef(isk, isk.focus).name : null, careers: (isk.careers ?? []).map((c) => ISEKAI_CAREERS[c].name) };
}

const ISEKAI_HIGHLIGHTS = 3;
// เรียงตามเวลาที่เกิด ไม่ใช่ตามน้ำหนัก — อ่านเป็นเรื่องเล่า
const isekaiHighlights = (isk) => (isk.marks ?? []).map((m, i) => ({ ...m, i })).sort((a, b) => b.weight - a.weight || a.i - b.i).slice(0, ISEKAI_HIGHLIGHTS).sort((a, b) => a.i - b.i).map((m) => m.text);

// บทบาทที่มีเนื้อเรื่องตัดสินจากฉากสุดท้าย · บทบาทอื่นตัดสินจากเป้าหมายกับชื่อเสียงตลอดชีวิต
// บทบาทที่เหตุการณ์น้อย (ก็อบลิน ลูกจอมมาร) ดังยาก จึงถึงตอนจบดีสุดได้ด้วยเป้าหมายล้วนเมื่อทุ่มเทกับบทบาทนานพอ
function isekaiEnding(isk) {
  if (isk.dead) return { id: 'death', title: ISEKAI_DEATH[0], text: ISEKAI_DEATH_BY[isk.world] ?? ISEKAI_DEATH[1] };
  if (!isk.role) {
    const job = (isk.careers ?? []).map((c) => ISEKAI_CAREERS[c].name)[0];
    const famed = isk.st.fame >= CONT_LIFE.fame;
    const tier = famed && job ? 'best' : famed || job ? 'good' : 'bad';
    const fill = (s) => s.replaceAll('{job}', job ?? 'คนดัง').replaceAll('{land}', CONT_REGIONS[isk.region].name);
    return { id: tier, title: fill(CONT_END[tier][0]), text: fill(CONT_END[tier][1]) };
  }
  const w = roleInfo(isk.role);
  let tier;
  if (w.special) {
    const won = !!isk.flags.won;
    tier = won && isk.st.goal >= 50 ? 'best' : won || isk.st.goal >= 50 ? 'good' : 'bad';
    // ตอนจบพิเศษต้องชนะฉากสุดท้ายด้วยทางที่ธงปูไว้ · กลืนกินของสไลม์ไม่ดูเกณฑ์ goal เพราะเป็นการเลือกจบ
    const [flag, key] = w.special;
    if (won && isk.flags[flag] && (tier === 'best' || flag === 'devour')) tier = key;
  } else tier = isk.st.goal >= 80 || (isk.st.goal >= 60 && isk.st.fame >= 30) ? 'best' : isk.st.goal >= 40 || isk.st.fame >= 30 ? 'good' : 'bad';
  const [title, text] = w.end[tier];
  return { id: tier, title, text };
}

const isekaiCard = (isk, card) => {
  isk.cards++;
  return { kind: 'isekai', status: isekaiStatus(isk), run: isk.run, ...card, ...(typeof card.age === 'number' && { age: isekaiShownAge(card.age) }) };
};

// ใบศาล (B153) ไม่นับการ์ดของชาติ ไม่ดึงเลขสุ่ม — ชาติหลังฟื้นเดินเหมือนไม่มีใบนี้ · คำใบ้เลือกตามอายุแทนการสุ่ม
const ISEKAI_COURT = {
  visit: { title: 'ห้องโถงที่ไม่ใช่ของโลกนี้', text: 'วินาทีที่ร่างนี้หมดลม คุณยืนอยู่ในห้องโถงยาวที่คนนั่งรอเต็มไปหมด เจ้าหน้าที่เปิดสมุดแล้วส่ายหน้า บอกว่ายังไม่ถึงคิว แล้วเสียงนาฬิกาก็ดึงคุณกลับ' },
  summons: { title: 'คนมารับข้ามโลก', text: 'ยาขวดสุดท้ายยังไม่ทันหายขม คนแต่งกายสีเข้มก็ยืนอยู่ปลายเตียง บอกเรียบ ๆ ว่าร่างนี้ยืดเกินที่ตกลงไว้ อยู่โลกไหนก็หนีบัญชีไม่ได้' },
};
function isekaiCourtCard(isk) {
  const mode = isk.court;
  isk.court = null;
  const lines = mode === 'visit' ? isk.hints?.[hintLevel(isk.ledger)] : null;
  const hint = lines?.length ? ` ${lines[isekaiShownAge(isk.age) % lines.length]}` : '';
  return { kind: 'isekai', status: isekaiStatus(isk), run: isk.run, step: 'result', court: mode, title: ISEKAI_COURT[mode].title, text: ISEKAI_COURT[mode].text + hint, age: isekaiShownAge(isk.age), ok: null, stat: null, deltas: {}, sys: null, choices: [] };
}

// การ์ดถัดไป · ใบที่มีตัวเลือกรอ chooseIsekai · ใบตา (tick) ไม่มีตัวเลือก เรียกซ้ำ = เวลาเดินอีกตา
// ใบตาบอกสิ่งที่ทุ่มเทได้ (focusChoices) — chooseIsekai บนใบตา = เปลี่ยนสิ่งที่ทุ่มเท โดยเวลาไม่หยุด
function nextIsekaiCard(isk) {
  if (isk.step === 'world') {
    return isekaiCard(isk, {
      step: 'world', title: 'ห้องสีขาว',
      text: `เทพธิดาผมสีเงินก้มหัวให้ "${isk.past ? `${isk.past} ` : ''}มาทางนี้ก่อน" แล้ววางแฟ้มชีวิตใหม่ไว้ตรงหน้า ${isk.worldOffers.length} แฟ้ม${isk.blessed ? ' วันนี้เธออารมณ์ดีเป็นพิเศษ เลยหยิบมาเพิ่มให้อีกแฟ้ม' : ''}${isk.vow ? ` ก่อนส่งไปเธอกระซิบว่า "${GODDESS_VOWS.find((v) => v.id === isk.vow).text}"` : ''}${isk.fated ? ' เธอบอกว่าคนที่ข้ามมาแบบในนิยายต่างโลกเป๊ะ ๆ ได้โชคแถมทุกคน' : ''}`,
      // แฟ้มบทบาท (ชาติเก่า/เส้นทดสอบ) เป็น id · แฟ้มเกิดในทวีปเป็น { region, race }
      choices: isk.worldOffers.map((r) => (typeof r === 'string' ? roleInfo(r).name : `${CONT_RACES[r.race].name} · ${CONT_REGIONS[r.region].name}`)),
      desc: isk.worldOffers.map((r) => (typeof r === 'string' ? roleInfo(r).pitch : CONT_REGIONS[r.region].about)),
      fx: isk.worldOffers.map(() => ''),
      // บารมีไม่ขึ้นจอ — ความทรงจำที่ติดมาเป็นบารมีจึงเล่าไม่บอกค่า
      ...(isk.memory && { note: isk.memory === 'cha' ? 'ความทรงจำจากชาติต่างโลกครั้งก่อนยังติดตัวมา' : `ความทรงจำจากชาติต่างโลกครั้งก่อนยังติดตัวมา · ${ISEKAI_STAT[isk.memory]} +${ISEKAI.memory}` }),
    });
  }
  if (isk.step === 'skill') {
    return isekaiCard(isk, {
      step: 'skill', title: 'ของขวัญจากเทพธิดา',
      text: `"เอาไปหนึ่งอย่าง ใช้ให้คุ้มนะ" แผ่นแสง ${isk.skillOffers.length} แผ่นลอยตรงหน้า`,
      choices: isk.skillOffers.map((s) => ISEKAI_SKILLS[s].name),
      desc: isk.skillOffers.map((s) => ISEKAI_SKILLS[s].desc),
      fx: isk.skillOffers.map(() => ''),
    });
  }
  if (isk.step === 'result') {
    const r = isk.last;
    isk.step = isk.up ? 'upgrade' : 'tick';
    return isekaiCard(isk, { step: 'result', title: r.title, text: r.text, age: isk.age, ok: r.ok, stat: r.stat, deltas: r.deltas, sys: r.sys, choices: [] });
  }
  // ค้างที่ step นี้จนเลือก (เซฟกลางการ์ดกลับมาใบเดิม) · ไม่ดึงเลขสุ่ม
  if (isk.step === 'upgrade') {
    return isekaiCard(isk, { step: 'upgrade', title: SKILL_UP.title, text: SKILL_UP.text, age: isk.age, ...upgradeOffer(isk.skills.map((id) => ({ id, lv: skillLv(isk, id), cap: isk.cap?.[id] }))) });
  }
  if (isk.step === 'over') throw new Error('ชาติต่างโลกจบแล้ว — ปรโลกรับช่วงต่อ');
  if (isk.step === 'tick' && isk.court) return isekaiCourtCard(isk);
  // เตือนต่อจากใบตา/ใบผลที่ทำ HP ตกเกณฑ์ ก่อนเหตุการณ์ที่ถึงคิว · ค้างที่ step นี้จนเลือก เซฟกลางการ์ดจึงกลับมาใบเดิม
  if (isk.step === 'tick' && isk.warn) isk.step = 'warn';
  if (isk.step === 'warn') {
    const card = warnCard(isk.age, isekaiStageOf(isk).name, ISEKAI_WARN.text, [ISEKAI_WARN.focus, WARN.ignore]);
    return isekaiCard(isk, { ...card, kind: 'isekai', step: 'warn', title: ISEKAI_WARN.title, fx: [`แนะนำ ${ISEKAI_FOCUS[ISEKAI_WARN.rest].name}`, ''] });
  }
  if (isk.step === 'tick' && isk.due === CONT_MOVE.event) {
    isk.due = null;
    isk.step = 'move';
  }
  if (isk.step === 'move') {
    const here = CONT_REGIONS[isk.region].name;
    return isekaiCard(isk, {
      step: 'move', title: 'ทางแยก', age: isk.age,
      text: `เดินสำรวจมาหลายปี จนรู้ทางออกจาก${here}ทุกเส้น ป้ายไม้ตรงทางแยกชี้ไปหลายแคว้น จะเก็บของย้ายไปตั้งหลักที่ใหม่ หรือกลับไปอยู่ที่เดิม`,
      choices: [...isk.moveOffers.map((r) => CONT_REGIONS[r].name), `อยู่${here}ต่อ`],
      desc: [...isk.moveOffers.map((r) => CONT_REGIONS[r].about), ''],
      fx: [...isk.moveOffers.map(() => ''), ''],
    });
  }
  if (isk.step === 'tick' && isk.due) isk.step = 'event';
  if (isk.step === 'event') return isekaiEventCard(isk, isekaiById[isk.due]);
  if (isk.step === 'tick' && (isk.dead || isk.natural || isk.home)) isk.step = 'end';
  // ตอนจบเป็นใบสุดท้ายของชาติต่างโลก ไม่มีตัวเลือก — กลับหรืออยู่ต่อเลือกที่การ์ดทางเกิดหลังปรโลกตัดสิน
  if (isk.step === 'end') {
    isk.ending = isekaiEnding(isk);
    isk.step = 'over';
    vowSettle(isk);
    // ดังถึงเกณฑ์ = โลกนี้จำชื่อไว้ (B68i) · ชื่อเสียงที่ได้จากทางบาปเกินครึ่ง = ถูกจำเป็นคนร้าย
    if (isk.st.fame >= ISEKAI_FAME.legend) isk.legend = { world: isk.world, name: isk.name, ending: isk.ending.title, dark: (isk.fameDark ?? 0) * 2 > isk.st.fame };
    return isekaiCard(isk, {
      // การ์ดปรโลกใบถัดไปเล่าเรื่องดวงวิญญาณถูกดึงกลับเอง ใบนี้จึงปิดแค่ชีวิตในโลกนี้ · ตอนจบแบบตายเล่าการตายไว้แล้ว
      step: 'end', title: isk.ending.title, text: isk.dead ? isk.ending.text : isk.home ? `${isk.ending.text} ${TRIP_HOME}` : `${isk.ending.text} แล้วจากไปอย่างสงบตอนอายุ ${isekaiShownAge(isk.age)}`, ending: isk.ending.id, age: isk.age,
      ...(isk.home && { home: true }),
      choices: [],
      log: isk.log.slice(),
      // บรรทัดละ { age, until?, stage, kind: tick|event|lore, text, deltas } · เซฟเก่าอาจยังมีบรรทัดสตริงปน
      chronicle: isk.chron.slice(),
      // ผลคำสัญญาขึ้นเป็นแผงบนจอ (เลน C) ไม่ต่อท้าย text
      ...(isk.vow && { vow: { text: GODDESS_VOWS.find((v) => v.id === isk.vow).text, kept: isk.vowKept } }),
      highlights: isekaiHighlights(isk),
      // ใส่ช่องเฉพาะชาติที่สกิลเคยช่วยไว้ — การ์ดจบของชาติอื่นรูปเดิม
      ...(isk.saves && { saves: isk.saves }),
      // ของที่โลกนี้จะจำต่อจากชาตินี้ (B68h) — ช่องเฉพาะชาติที่มี จอเลน C วาดได้
      ...(isk.lore.length && { lore: isk.lore.map((id) => ISEKAI_LORE[id]) }),
      // ชาตินี้จะอยู่ในตำนานของโลกนี้ (B68i) — ช่องเฉพาะชาติที่ดังถึงเกณฑ์
      ...(isk.legend && { legend: { name: isk.legend.name, dark: isk.legend.dark } }),
      // สกิลที่ถือตอนจบให้ผู้เล่นเลือกลงคลัง 1 อย่าง (06s) — UI เรียก skillBookAdd เอง การ์ดไม่เปลี่ยนสถานะเกม
      ...(isk.skills.length && { earn: isk.skills.map((id) => ({ id, name: ISEKAI_SKILLS[id].name, lv: skillLv(isk, id) })) }),
    });
  }
  const stage = isekaiStageOf(isk);
  // เข้าช่วงวัยใหม่ไม่หยุดถามแล้ว (ui-redo 83 · ข้อ 149): รายการทางเลือกเปลี่ยนตามวัย โฟกัสเดิมที่ไม่มีในช่วงนี้กลับตามน้ำ
  // แล้วใบตาแรกของช่วงบอกผู้เล่นแทน · เปลี่ยนโฟกัสได้ทุกเมื่อจากแผงตัวฉัน (setIsekaiFocus)
  // เซฟก่อนใบนี้ที่ค้างอยู่บนใบทุ่มเทเข้าช่วงวัย (ไม่ใช่จากการ์ดเตือน) ไม่มีใบนั้นแล้ว — เดินต่อเป็นใบตา
  if (isk.step === 'focus' && !isk.focusWarn) isk.step = 'tick';
  let entered = null;
  if (isk.step !== 'focus' && isk.stageShown !== stage.id) {
    isk.focusOffers = isekaiFocusOffers(isk, stage);
    const lost = isk.focus && !isk.focusOffers.includes(isk.focus) ? isekaiFocusDef(isk, isk.focus).name : null;
    if (lost) focusSet(isk, FOCUS_FLOW, isk.age);
    // ใบตาแรกของชาติบอกว่าโลกนี้ยังจำอะไรจากคนต่างโลกรุ่นก่อน (เดิมอยู่บนใบทุ่มเทใบแรก)
    const past = !isk.stageShown && isekaiLoreLine(isk);
    entered = { stage: stage.name, ...(lost && { lost }), ...(past && { lore: past }) };
    isk.stageShown = stage.id;
  }
  // การ์ดเตือน (B161) กด "เปลี่ยนโฟกัส" = ใบเลือกโฟกัสกลางช่วงวัย · suggest ชี้ทางฟื้นชีวิต
  if (isk.step === 'focus') {
    isk.focusOffers = isekaiFocusOffers(isk, stage);
    if (!isk.focusOffers.includes(isk.focus)) focusSet(isk, FOCUS_FLOW, isk.age);
    return isekaiCard(isk, {
      step: 'focus', title: stage.name, age: isk.age,
      text: ISEKAI_WARN.ask,
      choices: isk.focusOffers.map((id) => isekaiFocusDef(isk, id).name),
      fx: isk.focusOffers.map((id) => isekaiFocusFx(isk, id)),
      current: isk.focusOffers.indexOf(isk.focus),
      warn: true, suggest: isk.focusOffers.indexOf(ISEKAI_WARN.rest),
    });
  }
  const before = { ...isk.st };
  const from = isk.age;
  const years = isekaiYear(isk);
  const hired = isekaiFocusCount(isk, from, years / isekaiPace(isk));
  let revived = false;
  if (isk.st.hp <= 0) {
    // แก่จนสิ้นอายุไม่ใช่ความตายที่ย้อนเวลาได้
    if (from >= isekaiOldAge(isk)) isk.natural = true;
    else if (isekaiHas(isk, 'rbd') && !isk.rbdUsed) {
      isk.rbdUsed = true;
      isk.st.hp = 40;
      isk.court = 'visit';
      revived = true;
    } else isk.dead = true;
  }
  isekaiWarnCheck(isk);
  if (!isk.dead && !isk.natural && !isk.home) isk.due = isekaiDue(isk);
  // ความรู้ถึงเกณฑ์กลางช่วงวัย: ทางลัดต่อท้ายรายการทันที ไม่ต้องรอช่วงวัยถัดไป (ลำดับเดิมไม่เลื่อน เซฟที่เล่นซ้ำจึงตรง)
  const opened = isekaiKnowOffers(isk, stage).filter((id) => !isk.focusOffers.includes(id));
  isk.focusOffers.push(...opened);
  const f = isekaiFocusDef(isk, isk.focus);
  const said = f.lines ? f.lines[Math.floor(from / isekaiPace(isk)) % f.lines.length] : `ทุ่มเทกับ${f.name}ไปอีกปี`;
  const text = entered?.lost ? `เข้า${entered.stage} ${entered.lost}ไม่เหมาะกับวัยนี้แล้ว ช่วงนี้ใช้ชีวิตตามน้ำไปก่อน · ${said}` : said;
  const deltas = {};
  for (const k of Object.keys(isk.st)) {
    const d = Math.round(isk.st[k]) - Math.round(before[k]);
    if (d) deltas[k] = d;
  }
  const [a0, a1] = [isekaiShownAge(from), isekaiShownAge(isk.age - 1)];
  const title = years > 1 ? `อายุ ${a0}–${a1}` : `อายุ ${a0}`;
  isk.chron.push({ age: a0, ...(years > 1 && { until: a1 }), stage: stage.id, kind: 'tick', text, deltas });
  return isekaiCard(isk, {
    step: 'tick', title, text, age: from, years, stage: stage.name, deltas,
    // ตาแรกของช่วงวัยใหม่: ตัวขับบอทตั้งโฟกัสตรงนี้ (แทนการ์ดทุ่มเทเดิม) · lore = บรรทัดความจำโลก ใบตาแรกของชาติ
    ...(entered && { entered: true }),
    ...(entered?.lore && { lore: entered.lore }),
    ...(revived && { sys: 'เสียงนาฬิกาดังในหัว เวลาย้อนกลับ · ย้อนเวลาเมื่อตาย ใช้ไปแล้ว' }),
    ...(!revived && (opened.length || hired.length) && { sys: [hired.length && `ได้เป็น${hired.map((c) => ISEKAI_CAREERS[c].name).join(' · ')}แล้ว`, opened.length && `ความรู้จากโลกเดิมมากพอแล้ว โฟกัสได้อีกทาง · ${opened.map((id) => isekaiFocusDef(isk, id).name).join(' · ')}`].filter(Boolean).join(' · ') }),
    focus: isk.focusOffers.indexOf(isk.focus),
    focusChoices: isk.focusOffers.map((id) => isekaiFocusDef(isk, id).name),
    focusFx: isk.focusOffers.map((id) => isekaiFocusFx(isk, id)),
    choices: [],
  });
}

// ของที่โลกจำ + คนในตำนาน (B68i) ต่อกันเป็นบรรทัดเดียว · ไม่มีทั้งคู่ = ว่าง
const isekaiLoreLine = (isk) => {
  const names = isk.worldLore.map((id) => ISEKAI_LORE[id]);
  const list = names.length > 1 ? `${names.slice(0, -1).join(' ')} และ${names.at(-1)}` : names[0];
  const legends = isekaiLegends(isk).slice(-ISEKAI_FAME.lines).map((l) => (l.dark
    ? `คนที่นี่ยังเอ่ยชื่อ${l.name}เสียงเบา ๆ คนต่างโลกรุ่นก่อนที่จบแบบ "${l.ending}"`
    : `คนที่นี่ยังเล่าเรื่อง${l.name} คนต่างโลกรุ่นก่อนที่จบแบบ "${l.ending}"`));
  return [names.length && `ที่นี่ยังมี${list}ที่คนจากต่างโลกรุ่นก่อนทิ้งไว้`, ...legends].filter(Boolean).join(' · ');
};

// เช็กหลังทุกจุดที่ HP ขยับ (ใบตา · ผลเหตุการณ์ รวมยา/ฟื้นตัว/ย้อนเวลา) — ชาติที่จบในตานั้นไม่ต้องเตือน
function isekaiWarnCheck(isk) {
  if (crossedLow(isk, isk.st.hp, WARN.isekai) && !isk.dead && !isk.natural && !isk.home) isk.warn = true;
}

// ความรู้เป็นค่าซ่อน ป้ายจึงบอกแค่ว่าทอยด้วยความรู้ ไม่บอกหมวดหรือค่า
const isekaiCheckName = (c) => (c.know ? 'ความรู้โลกเดิม' : ISEKAI_STAT[c.stat]);

function isekaiEventCard(isk, ev) {
  return isekaiCard(isk, {
    step: 'event', id: ev.id, title: isekaiFill(isk, ev, ev.title), text: isekaiFill(isk, ev, ev.text), finale: !!ev.finale, age: isk.age,
    choices: ev.choices.map((c) => isekaiFill(isk, ev, c.t)),
    fx: ev.choices.map((c) => {
      if (c.need && isk.st.gold < c.need.gold) return '';
      const p = isekaiChance(isk, c);
      if (p === null) return c.need ? `ใช้ทอง ${c.need.gold}` : '';
      const aid = p - isekaiChance(isk, c, false);
      const names = isekaiAids(isk, c).map((s) => ISEKAI_SKILLS[s].name).join(' + ');
      // บอกแค่โอกาส ไม่บอกชื่อค่าที่ทอย — บารมีกับความรู้เป็นค่าซ่อน ถ้าบอกเฉพาะค่าที่เห็นก็เดาค่าซ่อนออกจากปุ่มที่ไม่มีชื่อ
      return `${p}%${aid > 0 ? ` · ${names} +${aid}%` : ''}`;
    }),
    locked: ev.choices.map((c) => (c.need && isk.st.gold < c.need.gold ? `ต้องมีทอง ${c.need.gold} · ขาดอีก ${Math.ceil(c.need.gold - isk.st.gold)}` : null)),
  });
}

// เปลี่ยนโฟกัสจากแผงตัวฉัน (ui-redo 83 · แบบ setLifeFocus ชาติไทย): ไม่ใช่ตัวเลือกของการ์ด ไม่ดึงเลขสุ่ม ไม่เดินการ์ด
// ผลไปคิดที่ใบตาถัดไป · เซฟ v2 เป็นภาพถ่ายสถานะ โหลดแล้วได้โฟกัสเดิม · ใบเลือกจากการ์ดเตือนยังเลือกผ่านการ์ด
const isekaiFocusOpen = (isk) => !!isk && ['tick', 'event', 'result', 'move', 'upgrade', 'warn'].includes(isk.step) && !isk.dead && !isk.natural && !isk.home && !!isk.focusOffers?.length;
function setIsekaiFocus(isk, id) {
  if (!isekaiFocusOpen(isk)) throw new Error('ตอนนี้เปลี่ยนโฟกัสไม่ได้');
  if (id !== FOCUS_FLOW && !isk.focusOffers.includes(id)) throw new Error(`โฟกัสนี้เลือกตอนนี้ไม่ได้: ${id}`);
  focusSet(isk, id, isk.age);
}
// ทางเลือกในแผง: ตามน้ำก่อน แล้วตามรายการของช่วงวัยนี้ · ป้ายผลต่อปีแบบเดียวกับใบเลือก
const isekaiFocusList = (isk) => [FOCUS_FLOW, ...isk.focusOffers].map((id) => ({ id, name: isekaiFocusDef(isk, id).name, fx: id === FOCUS_FLOW ? 'ไม่ทุ่มเรื่องไหนเป็นพิเศษ' : isekaiFocusFx(isk, id), on: (isk.focus ?? FOCUS_FLOW) === id }));

// ใบเลือกโฟกัสรูปเดียวกับใบทุ่มเทเดิม ไม่นับการ์ด ไม่ลงสถานะ — บอทตัดสินตอนตาแรกของช่วงวัย (card.entered) แทนใบที่ถอดไป
// คืนเลขตัวเลือกให้ isekaiFocusPick · ผู้เล่นไม่เห็นใบนี้
const isekaiFocusCard = (isk) => ({
  kind: 'isekai', status: isekaiStatus(isk), run: isk.run, step: 'focus', title: isekaiStageOf(isk).name, age: isekaiShownAge(isk.age), text: '',
  choices: isk.focusOffers.map((id) => isekaiFocusDef(isk, id).name),
  fx: isk.focusOffers.map((id) => isekaiFocusFx(isk, id)),
  current: isk.focusOffers.indexOf(isk.focus),
});
// ตาที่ชาติจบในปีนั้น (ตาย · หมดอายุ · กลับบ้าน) ไม่มีแผงให้เปลี่ยนแล้ว — บอทข้ามเหมือนผู้เล่นที่เปิดแผงไม่ได้
const isekaiFocusPick = (isk, idx) => isekaiFocusOpen(isk) && setIsekaiFocus(isk, isk.focusOffers[idx] ?? FOCUS_FLOW);

function chooseIsekai(isk, idx) {
  if (isk.step === 'world') {
    const r = isk.worldOffers[idx];
    if (!r) throw new Error('ตัวเลือกไม่ถูกต้อง');
    if (typeof r === 'string') isekaiStart(isk, r);
    else contStart(isk, r);
    isk.step = 'skill';
    return;
  }
  if (isk.step === 'skill') {
    const s = isk.skillOffers[idx];
    if (!s) throw new Error('ตัวเลือกไม่ถูกต้อง');
    isk.skills.push(s);
    if (s === 'luck') isk.st.luk += 15;
    const past = isekaiLoreLine(isk);
    if (past) isk.chron.push({ age: isk.age, stage: isekaiStageOf(isk).id, kind: 'lore', text: past, deltas: {} });
    // ฉากเปิดของเนื้อเรื่องมาก่อนตาแรก
    const intro = isekaiFrame(isk).intro;
    if (intro) isk.due = (isk.used.push(intro), intro);
    isk.step = 'tick';
    return;
  }
  // ใบตาเลือกผ่าน token ได้คงไว้ให้เซฟ v1 ที่เล่นซ้ำจากลำดับปุ่ม · จอใหม่เปลี่ยนนอก token ด้วย setIsekaiFocus
  if (isk.step === 'focus' || isk.step === 'tick') {
    const f = isk.focusOffers[idx];
    if (!f) throw new Error('ตัวเลือกไม่ถูกต้อง');
    focusSet(isk, f, isk.age);
    if (isk.step === 'focus') {
      isk.stageShown = isekaiStageOf(isk).id;
      isk.focusWarn = false;
    }
    isk.step = 'tick';
    return;
  }
  // การ์ดเตือนไม่ดึงเลขสุ่ม ไม่ลงเส้นทางที่เลือก (ไม่ใช่เหตุการณ์) · เปลี่ยนโฟกัส = ใบทุ่มเทใบถัดไป
  if (isk.step === 'warn') {
    if (idx !== 0 && idx !== 1) throw new Error('ตัวเลือกไม่ถูกต้อง');
    isk.warn = false;
    isk.focusWarn = idx === 0;
    isk.step = idx === 0 ? 'focus' : 'tick';
    return;
  }
  // ทางแยกไม่ดึงเลขสุ่ม ไม่ใช่เหตุการณ์ (ไม่ลง used · มาอีกได้) · ย้ายหรือไม่ ตัวนับก็เริ่มใหม่
  if (isk.step === 'move') {
    const to = isk.moveOffers[idx];
    if (!to && idx !== isk.moveOffers.length) throw new Error('ตัวเลือกไม่ถูกต้อง');
    isk.roamFrom = isk.focusYears?.[CONT_MOVE.focus] ?? 0;
    isk.moveOffers = null;
    if (to) {
      const from = isk.region;
      isk.region = to;
      (isk.moves ??= []).push({ age: isk.age, from, to });
      const text = `ทางแยก · ย้ายจาก${CONT_REGIONS[from].name}ไปตั้งหลักที่${CONT_REGIONS[to].name}`;
      isk.log.push(`อายุ ${isk.age} · ${text}`);
      isk.chron.push({ age: isk.age, stage: isekaiStageOf(isk).id, kind: 'event', text, deltas: {} });
    }
    isk.step = 'tick';
    return;
  }
  // ปุ่มสุดท้าย = ผ่าน · isk.up ลบทิ้งไม่ตั้ง false ให้ state หลังการ์ดเท่ากับชาติที่ไม่เคยได้การ์ดนี้
  if (isk.step === 'upgrade') {
    const id = isk.skills[idx];
    if (!id && idx !== isk.skills.length) throw new Error('ตัวเลือกไม่ถูกต้อง');
    if (id && skillLv(isk, id) >= SKILL.top) throw new Error('ตัวเลือกนี้ล็อกอยู่');
    if (id) (isk.lv ??= {})[id] = skillUp(skillLv(isk, id), isk.cap?.[id]);
    delete isk.up;
    isk.step = 'tick';
    return;
  }
  if (isk.step !== 'event') throw new Error('การ์ดนี้ไม่มีตัวเลือก');
  const ev = isekaiById[isk.due];
  const c = ev.choices[idx];
  if (!c) throw new Error('ตัวเลือกไม่ถูกต้อง');
  if (c.need && isk.st.gold < c.need.gold) throw new Error('ตัวเลือกนี้ล็อกอยู่');
  let ok = true, out = c, aid = null;
  const rolled = !!(c.stat || c.know);
  if (rolled) {
    // ทอยครั้งเดียวเท่าเดิม — สำเร็จแต่ทอยเกินโอกาสแบบไม่มีสกิล = สกิลช่วยไว้ (ไม่ดึงเลขสุ่มเพิ่ม ผลเกมจึงเท่าเดิม)
    const roll = isk.rng.next() * 100;
    ok = roll < isekaiChance(isk, c);
    out = ok ? c.win : c.lose;
    if (ok && roll >= isekaiChance(isk, c, false)) {
      aid = isekaiAids(isk, c).map((s) => ISEKAI_SKILLS[s].name).join(' + ');
      isk.saves = (isk.saves ?? 0) + 1;
    }
  }
  // ความรู้ไม่ขึ้นในผลที่ผู้เล่นเห็น (ค่าซ่อน) · เรื่องของหมวดไหนก็จำว่าแตะหมวดนั้นล่าสุด ให้อ่านตำราเติมต่อ
  const { know: learned, ...fx } = out.fx ?? {};
  const deltas = isekaiApply(isk, fx);
  const tags = ISEKAI_MERIT[ev.id]?.[idx];
  // ชื่อเสียงจากตัวเลือกที่ลงบาป นับแยกไว้ตัดสินว่าโลกจำเป็นคนร้ายไหม (B68i)
  if (deltas.fame > 0 && tags?.some((t) => SIN_CATS.includes(meritId(t.cat)))) isk.fameDark = (isk.fameDark ?? 0) + deltas.fame;
  const said = isekaiFill(isk, ev, out.text);
  const title = isekaiFill(isk, ev, ev.title);
  if (ev.know) {
    isk.knowLast = ev.know.cat;
    isekaiLearn(isk, ev.know.cat, learned);
  }
  let sys = null;
  // โลกจำเฉพาะที่สำเร็จและคนยอมรับ (ชื่อเสียงถึง) — ไม่ถึงก็ยังได้ผลของเรื่องนี้ แค่โลกลืมเมื่อจากไป
  if (out.lore && !isk.lore.includes(out.lore)) {
    if (isk.st.fame >= ISEKAI_KNOW_T.loreFame) {
      isk.lore.push(out.lore);
      sys = `โลกนี้จะจำ${ISEKAI_LORE[out.lore]}ไว้หลังคุณจากไป`;
    } else sys = `คนยังรู้จักคุณน้อยเกินไป ${ISEKAI_LORE[out.lore]}อาจไม่อยู่ถึงรุ่นหลาน`;
  }
  for (const f of [out.flag, out.flag2]) if (f) isk.flags[f] = true;
  // เลือกกลับบ้าน = ทริปจบหลังใบผล (B154) · ปฏิเสธการ์ดทางกลับ = ปีที่ตามหามาเริ่มนับใหม่
  if (out.home) isk.home = true;
  else if (ev.trip === 'quest') isk.seek = 0;
  // ลงบัญชีที่ดวงวิญญาณพกมา (ไม่ดึงเลขสุ่ม ⇒ ลำดับเหตุการณ์เท่าเดิม) · ธงคำบนที่ผิดติดเป็นธงของรอบต่างโลก
  for (const f of recordMerit(isk.ledger, tags, ev.id)) isk.flags[f] = true;
  vowTrack(isk, tags);
  if (out.potion) sys = isekaiDrink(isk, ev.id);
  // เรื่องต่อมาถึงอีกไม่กี่ปีให้หลัง ไม่ดึงเลขสุ่ม
  // เรื่องต่อที่คิดค้นของที่โลกนี้จำอยู่แล้วไม่ต้องนัด (B68h) — นัดข้ามตัวกรองกอง จึงกันที่นี่
  if (out.next && !isk.used.includes(out.next) && !isk.later.some((l) => l.id === out.next) && !isk.worldLore.includes(isekaiById[out.next].loreOf)) isk.later.push({ id: out.next, age: isk.age + ISEKAI_TIME.later * isekaiPace(isk) });
  if (ev.finale) isk.finaleDone = true;
  if (out.skill) {
    const rest = Object.keys(ISEKAI_SKILLS).filter((k) => !isekaiHas(isk, k) && k !== 'luck');
    if (rest.length) {
      const s = isk.rng.pick(rest);
      isk.skills.push(s);
      sys = `ได้รับสกิลใหม่ · ${ISEKAI_SKILLS[s].name}`;
    }
  }
  if (isekaiHas(isk, 'regen') && isk.st.hp > 0) isk.st.hp = isekaiClamp(isk.st.hp + 6, 0, 100);
  if (isk.st.hp <= 0) {
    if (isekaiHas(isk, 'rbd') && !isk.rbdUsed) {
      isk.rbdUsed = true;
      isk.st.hp = 40;
      isk.court = 'visit';
      sys ='เสียงนาฬิกาดังในหัว เวลาย้อนกลับ · ย้อนเวลาเมื่อตาย ใช้ไปแล้ว';
    } else isk.dead = true;
  }
  isekaiWarnCheck(isk);
  // ผลที่ให้อัปเกรด (06s) → การ์ดอัปเกรดต่อจากใบผล · ตายในผลนี้ไม่มีให้ฝึกต่อ
  if (out.upgrade && !isk.dead && isk.skills.length) isk.up = true;
  // ฉากเด่นบนการ์ดจบ: ผลที่ขยับค่ามากสุด · ทองหารห้าสิบให้ชั่งกับค่าอื่นได้ · สกิลช่วยไว้/ตายนับเพิ่ม
  const weight = Object.entries(deltas).reduce((s, [k, v]) => s + Math.abs(k === 'gold' ? v / 50 : v), 0) + (aid ? 10 : 0) + (isk.dead ? 50 : 0);
  (isk.marks ??= []).push({ text: `${title} · ${said}`, weight });
  isk.log.push(`อายุ ${isk.age} · ${title} · ${isekaiFill(isk, ev, c.t)}${rolled ? (ok ? (aid ? ` (สำเร็จ · ${aid}ช่วยไว้)` : ' (สำเร็จ)') : ' (พลาด)') : ''}`);
  isk.chron.push({ age: isk.age, stage: isekaiStageOf(isk).id, kind: 'event', text: `${title} · ${said}`, deltas: { ...deltas } });
  isk.last = { title, text: said, ok: rolled ? ok : null, stat: rolled ? isekaiCheckName(c) : null, deltas, sys };
  isk.due = null;
  isk.step = 'result';
}

// ค่าที่ติดตัวไปชาติต่างโลกถัดไป = ค่าสถานะที่สูงสุดของรอบนี้
const isekaiMemory = (isk) => Object.keys(ISEKAI_STAT).reduce((a, b) => (isk.st[b] > isk.st[a] ? b : a));

// แถวในผังตระกูล — ไม่มีจังหวัด/ฐานะแบบชาติไทย ผู้อ่าน lineage ต้องดู isekai ก่อน · world = ชื่อบทบาท
// lore = ของที่โลกนี้จำจากชาตินี้ (isekaiWorldLore อ่านกลับ) · legend = ชาตินี้ดังพอให้โลกจำชื่อ (isekaiWorldLegends อ่านกลับ) · ใส่เฉพาะชาติที่มี แถวของชาติอื่นรูปเดิม
const isekaiLineage = (isk, gen) => ({ gen, name: isk.name, isekai: true, world: isekaiFrame(isk).name, ending: isk.ending.title, path: 'isekai', realm: 'ต่างโลก', broke: false, ...(isk.lore.length && { lore: { world: isk.world, ids: isk.lore.slice() } }), ...(isk.legend && { legend: { ...isk.legend } }) });

// ช่วงระหว่างชาติ (ใบ 05 · 09) + ส่งต่อรุ่นถัดไป — ลำดับตามใบ 09:
// บันทึกการตาย → ส่วนบุญ/อนุโมทนา → เทวทูต 5 → ปรโลกเปิดบัญชีชี้ปลายทาง → ทางเกิด → ภูมิปลายทาง หรือ ผีบรรพบุรุษ → ส่งต่อ 30–70% → รุ่นถัดไป
// ฉากเป็นเนื้อหา (stage ระหว่างชาติ + scene) ผ่านด่าน build ชุดเดียวกับการ์ดชีวิต · ปรโลก/ทางเกิด/ส่งต่อเป็นการ์ดที่แกนสร้าง
// ใช้ stream สุ่มของตัวเอง — ระหว่างชาติไม่กินเลขสุ่มของโลกของชีวิตใด · ชีวิตที่มี heir ดึงเลขสุ่มของโลกตำแหน่งเดียวกับชีวิตแรก (harness/lineage ตรวจ)












// ระดับกรรมที่ปรโลก (−1..1) = บัญชีสุทธิ ÷ ref · ref แยกจากตัวคูณกรรมระหว่างชีวิต (KARMA.ref) เพราะบัญชีทั้งชีวิตสะสมไกลกว่า
// จุดอิ่มของตัวคูณการตายมาก — ใช้ ref เดียวกันแล้วเกือบทุกคนชนเพดาน ภูมิกับฐานะชาติหน้าจะไม่แยกคน
const VERDICT_REF = 30;
const verdictLevel = (ledger) => Math.max(-1, Math.min(1, netLedger(ledger) / VERDICT_REF));
// ภูมิปลายทาง (lore-afterlife หัวข้อ 2 ชุดที่เกมออกแบบเอง) ชี้จากบัญชีสุทธิ ณ ปรโลก — ฝ่ายใดหนักก็ไปฝ่ายนั้น
// upTo = ขอบบนของระดับกรรม · เกณฑ์เป็นค่าตั้งของเกม ไม่มีคัมภีร์ให้แปลงเป็นตัวเลข · บุญบาปเสมอ (0) ไปเกิดเป็นมนุษย์
// เทวดาตั้งสูงกว่าฝั่งบาป: เนื้อหามีทางบุญมากกว่าทางบาป บอทสุ่มจึงเอียงบวกเอง (สุทธิมัธยฐาน ~+11) — ขอบ 2/3 ให้เทวดาเหลือราวหนึ่งในสิบ
const REALMS = [
  { id: 'hell', name: 'นรก', upTo: -0.5 },
  { id: 'peta', name: 'เปรต', upTo: -0.2 },
  { id: 'beast', name: 'ดิรัจฉาน', upTo: -0.01 },
  { id: 'human', name: 'มนุษย์', upTo: 2 / 3 },
  { id: 'deva', name: 'เทวดา', upTo: Infinity },
];
const realmOf = (x) => REALMS.find((r) => x <= r.upTo);
// ฉากที่เนื้อหาเขียนได้ · realm/ancestor/loop แยกตามภูมิได้ด้วย field realm · loop = การ์ดปีละใบในวงปรโลก
const SCENES = ['transfer', 'devaduta', 'realm', 'ancestor', 'loop'];
const REALM_SCENES = ['realm', 'ancestor', 'loop'];

// วงปรโลก (03a): หลังฉากภูมิปลายทาง อยู่ในภูมิปีละ 1 การ์ด จนครบปีหรือชีวิตทิพย์หมด แล้วไปการ์ดส่งต่อ
// 4 ค่าบนจอใช้คีย์ค่าสถานะเดิม สเกล 0–100 แบบแถบชีวิต — การ์ดวงเขียน effects ชุดเดียวกับฉากอื่นได้ แต่ผลลงค่าวง ไม่ใช่ค่าเริ่มชาติหน้า
// ปีทิพย์ = base + |สุทธิ| ÷ div เพดาน cap · ชีวิตทิพย์ลดเองปีละ drain + ผลการ์ด · ปัญญาธรรม/ความผูกพันเริ่มที่ inherit × ความรู้/ความสัมพันธ์ตอนตาย
// เข้าวงเฉพาะทางเป็นลูก/เกิดใหม่ — คนถูกเรียกตัวและทางต่างโลกไปเล่นชาติต่างโลกแทน
// วงใช้ stream สุ่มของตัวเองและไม่แตะบัญชี/ค่าเริ่มชาติหน้า ⇒ ทายาทเกิดเหมือนก่อนมีวงทุกไบต์
const LOOP = {
  base: 3,
  div: 2,
  cap: 30,
  drain: 2,
  inherit: 0.5,
  start: { hell: { health: 30, happiness: 10 }, peta: { health: 40, happiness: 25 }, beast: { health: 50, happiness: 40 }, human: { health: 60, happiness: 50 }, deva: { health: 100, happiness: 90 } },
  paths: ['child', 'reborn'],
};
const LOOP_LABELS = { health: 'ชีวิตทิพย์', happiness: 'สุข/ทุกข์', knowledge: 'ปัญญาธรรม', relations: 'ความผูกพัน' };
const LOOP_KEYS = Object.keys(LOOP_LABELS);
const loopYears = (net) => Math.min(LOOP.cap, LOOP.base + Math.floor(Math.abs(net) / LOOP.div));

// ส่งต่อข้ามชาติ (ใบ 09): ฝั่งที่ชี้ปลายทางถูกหักไปส่วนหนึ่งก่อน แล้วสุ่มส่งต่อ min–max ของที่เหลือ
const CARRY = { spend: 0.5, min: 0.3, max: 0.7 };
// ผลกรรมต่อชาติหน้า "แรงทุกทาง" (ใบ 05 — ห้ามแก้คืน): ฐานะกับค่าเริ่มคิดจากระดับบัญชีที่ปรโลก
// sd = ความกว้างของฐานะเกิดใหม่รอบจุดกลางตามกรรม · childStep = ฐานะลูกเลื่อนได้สูงสุดกี่ระดับจากกรรม
// stat = ค่าเริ่มเลื่อนสูงสุดเมื่อบัญชีสุดขั้ว · bonusCap = เพดานผลรวมจากฉากระหว่างชาติต่อค่า
// kin = ทางเป็นลูกรับความสัมพันธ์/คอนเน็คชั่นของบ้านต่อ (ใบ 05) เป็นสัดส่วนของส่วนต่างจากค่ากลาง 50 ตอนพ่อแม่ตาย เพดาน bonusCap · หลาน/เหลนคูณ KIN_TIERS.kin
const FATE = { sd: 1.2, childStep: 3, stat: 10, bonusCap: 12, kin: 0.3 };
// ฐานะตอนตายส่งต่อรุ่นถัดไป (B95b · เจ้าของเคาะ 50/50) ทั้งทางเป็นลูกและเกิดใหม่บ้านอื่น — ผสมกับชั้นที่กรรม/สุ่มเดิมให้
// ตายพร้อมหนี้ = ชั้นล่างสุด ⇒ รุ่นถัดไปตกชั้นได้จริง · ไม่ดึงเลขสุ่มเพิ่ม (รุ่นแรกเท่า main)
const STAND_MIX = 0.5;
const deathStanding = (st) => ((st.estate?.money ?? 0) < 0 ? 0 : standingOf(st));
// ชื่อเสียงตระกูล (B95b · เจ้าของเคาะ 4 ขั้น) — แต้มของรุ่นที่เพิ่งจบ บวกกับครึ่งหนึ่งของขั้นเดิม ปัดครึ่งลง (ปัดขึ้นแล้วขั้น 1 ไม่จางเลย) ⇒ ไม่ทำอะไรต่อสองสามรุ่นก็จางเอง
// office = แต้มตามตำแหน่งสูงสุดที่เคยได้ (ผู้ใหญ่บ้าน กำนัน นายก อบต. ส.ส. นายกฯ) · rich = ฐานะตอนตายตั้งแต่ระดับ 8 (index 7) · guests = แขกงานศพที่นับว่างานใหญ่ · network = คอนเน็คชั่นตั้งต้นของทายาทต่อขั้น
const FAME = { names: ['ไร้ชื่อ', 'มีหน้ามีตา', 'ผู้มีบารมีในถิ่น', 'ตระกูลใหญ่'], decay: 0.5, rich: 7, guests: 300, network: 5, office: [0, 0, 1, 2, 3] };
const famePoints = (st, death) => (FAME.office[st.officeTop ?? -1] ?? 0) - (st.flags?.caught_fraud ? 1 : 0) + (death >= FAME.rich ? 1 : 0) + (funeralGuests(st) >= FAME.guests ? 1 : 0) - (st.bankruptcies > 0 ? 1 : 0) - ((st.estate?.money ?? 0) < 0 ? 1 : 0);
const nextFame = (st, death) => Math.max(0, Math.min(FAME.names.length - 1, Math.ceil((st.fame ?? 0) * FAME.decay + famePoints(st, death) - 0.5)));
const mixStanding = (death, fate) => clampIdx(Math.round(STAND_MIX * death + (1 - STAND_MIX) * fate));
// มรดก (ใบ 05 · lore-finance-belief): แบ่งตามจำนวนลูก · ภาษีการรับมรดก 5% ส่วนที่เกิน 100 ล้าน ตั้งแต่ปีที่กฎหมายมีผล
// จำนวนลูกเป็นค่าตั้งของเกม — ธง has_kids ไม่ได้บอกว่ากี่คน
// dispute = ส่วนของมรดกที่เสียไปกับการทะเลาะแบ่งกันเองเมื่อไม่มีพินัยกรรม (B25 · ค่าตั้งของเกม)
const LEGACY = { kids: 2, taxFrom: 100e6, tax: 0.05, taxYear: 2559, richUnits: [10, 40], dispute: 0.1 };
// ทางในตระกูล (B18): เกิดเป็นลูก/หลาน/เหลน ยิ่งห่างสายเลือดยิ่งได้ต่อน้อย — ค่าตั้งของเกม
// w = น้ำหนักสุ่มชั้น · carry คูณสัดส่วนส่งต่อบุญบาป (ลูก 1 = กรอบ CARRY เดิม) · kin คูณความสัมพันธ์/คอนเน็คชั่นของบ้าน
// legacy คูณมรดกต่อหัว: หลานได้ส่วนของพ่อแม่ที่แบ่งต่อให้ลูก LEGACY.kids คนอีกทอด เหลนอีกทอด
const KIN_TIERS = [
  { tier: 1, name: 'ลูก', w: 6, carry: 1, kin: 1, legacy: 1 },
  { tier: 2, name: 'หลาน', w: 3, carry: 0.75, kin: 0.6, legacy: 1 / LEGACY.kids },
  { tier: 3, name: 'เหลน', w: 1, carry: 0.5, kin: 0.3, legacy: 1 / LEGACY.kids ** 2 },
];
const kinTier = (n) => KIN_TIERS[(n ?? 1) - 1];
// ช่วงห่างรุ่น = อายุแม่ตอนคลอดช่วงเดียวกับ newLife
const GEN_GAP = [18, 40];

const clampIdx = (i) => Math.max(0, Math.min(CLASSES.length - 1, i));
const gauss = (rng) => Math.sqrt(-2 * Math.log(1 - rng.next())) * Math.cos(2 * Math.PI * rng.next());

function startAfterlife(st) {
  if (!st.dead) throw new Error('ยังไม่ตาย เข้าระหว่างชาติไม่ได้');
  return {
    st,
    rng: makeRng(st.seed ^ 0x1b873593),
    botRng: makeRng(st.seed ^ 0x2545f491),
    // เซฟก่อนมีวงเก็บ steps ชุดเดิม (ไม่มี loop) ⇒ โหลดแล้วเล่นแบบเดิมจนเกิด
    steps: ['transfer', 'devaduta', 'verdict', 'path', 'scene', 'loop', 'carry'],
    i: 0,
    loop: null,
    queue: [],
    pending: null,
    bonus: {},
    verdict: null,
    path: null,
    heir: null,
    cards: 0,
    // ต่างโลก (B68): ชีวิตที่กำลังเล่น · แถว lineage ของชีวิตต่างโลกที่จบแล้ว · เทพธิดาโผล่เอง/ตายแบบต่างโลก = ได้ของแถม
    isekai: null,
    isekaiLives: [],
    blessed: isekaiCalled(st),
    // ชาติต่างโลกล่าสุดที่จบแล้ว (รอบปรโลกของชาตินั้น) · คำตัดสินของชาติไทย — แถวชาติไทยในผังตระกูลบันทึกภูมิของชาติไทย
    from: null,
    thaiVerdict: null,
  };
}

// ลูกหลานที่ยังอยู่ตอนตาย (B36a) — state ก่อนมีระบบครอบครัว (ไม่มี kin) ใช้ธงเดิม
const livingKin = (st, role) => (st.kin ?? []).filter((m) => m.role === role && m.alive);
const hasKids = (st) => (st.kin ? livingKin(st, 'child').length + livingKin(st, 'grandchild').length > 0 : !!st.flags.has_kids);

// ผู้สืบสายเลือดที่เล่นต่อได้ (B76): ลูก/หลานที่ยังอยู่ อายุจริงปีที่ตายอยู่ในช่วง · หน้าเลือกคนของต่างโลก (isekai ใบ 21) ใช้รายชื่อชุดเดียวกัน
// เรียงตามลำดับในบ้าน (เกิดก่อนก่อน) ไม่ดึงเลขสุ่ม · state ก่อนมีระบบครอบครัว (ไม่มี kin) = ไม่มีรายชื่อ
const HEIR_AGE = [16, 22];
function heirCandidates(st) {
  const year = st.birthYear + st.age;
  return (st.kin ?? [])
    .filter((m) => (m.role === 'child' || m.role === 'grandchild') && m.alive)
    .map((m) => ({ id: m.id, name: m.name, sex: m.sex, role: m.role, age: year - m.born }))
    .filter((m) => m.age >= HEIR_AGE[0] && m.age <= HEIR_AGE[1]);
}

// ฉากของช่วงที่ 7: เนื้อหาที่ตรงเงื่อนไขของผู้ตาย สุ่มตามน้ำหนัก · ด่าน afterlife-coverage รับประกันว่ามีใบไม่มีเงื่อนไขเสมอ
function pickScene(af, scene, rng = af.rng) {
  const realm = af.verdict?.realm.id;
  const pool = af.st.content.events.filter((e) => e.stage === AFTERLIFE_STAGE && e.scene === scene && (!e.realm || e.realm.includes(realm)) && whenOk(af.st, e.when));
  if (!pool.length) throw new Error(`ไม่มีฉาก ${scene} ที่ออกได้ (ภูมิ ${realm})`);
  return weighted(rng, pool, pool.map((e) => (e.weight ?? 1) * poolMultiplier(af.st, e.multipliers)));
}

// ผลของฉากระหว่างชาติต่อค่าสถานะ = ค่าเริ่มของชาติหน้า · บุญบาปไม่ขึ้นป้ายเหมือนการ์ดชีวิต
function afterFx(c) {
  const fx = Object.entries(c.effects ?? {}).filter(([k]) => STAT_KEYS.includes(k));
  const out = fx.map(([k, v]) => `ชาติหน้า ${STAT_LABELS[k]}\u00a0${v > 0 ? '↑' : '↓'}`);
  if (c.outcomes?.length) out.push('?');
  return out.join(' · ');
}

function emitAfter(af, card) {
  af.cards++;
  return { stage: AFTERLIFE_STAGE, ...card };
}

function sceneCard(af, ev) {
  af.pending = ev.choices.length ? ev : null;
  return emitAfter(af, {
    kind: 'scene',
    id: ev.id,
    type: 'B',
    scene: ev.scene,
    title: ev.title ? fill(ev.title, af.st) : null,
    text: fill(ev.text, af.st),
    choices: ev.choices.map((c) => fill(c.text, af.st)),
    ...choiceHints(ev, af.st),
    fx: ev.choices.map(afterFx),
  });
}

// สกิลที่ชีวิตไทยนี้ลงคลังได้ (06s) จากตาราง content.skillMap — อ่านอย่างเดียว ไม่ดึงเลขสุ่ม
// ตารางว่างไม่คำนวณแหล่งเลย ⇒ เนื้อยังไม่จ่ายก็เดินเท่าเดิม · เรียงตามลำดับ ISEKAI_SKILLS ให้การ์ดเหมือนกันทุกเครื่อง
function thaiEarn(st) {
  const map = st.content.skillMap;
  if (!map || Object.values(map).every((m) => !Object.keys(m).length)) return [];
  const t = titlesOf(st);
  const chain = st.content.focus?.chain_years ?? Infinity;
  const src = {
    job: st.occupation ? [st.occupation] : [],
    title: t.titles.map((x) => x.id),
    pattern: t.pattern ? [t.pattern.id] : [],
    cause: isGone(st) || !st.cause ? [] : [st.cause],
    goal: goalsMet(st, (st.estate?.money ?? 0) < 0),
    focus: Object.keys(st.focusYears ?? {}).filter((id) => st.focusYears[id] >= chain),
    lifeGoal: [],
  };
  const got = new Set(Object.entries(src).flatMap(([k, ids]) => ids.flatMap((id) => map[k]?.[id] ?? [])));
  return Object.keys(ISEKAI_SKILLS).filter((id) => got.has(id)).map((id) => ({ id, name: ISEKAI_SKILLS[id].name, lv: 1 }));
}

function verdictCard(af) {
  const ledger = af.st.ledger;
  const x = verdictLevel(ledger);
  const realm = realmOf(x);
  // กำหนดเวลาในภูมิ (ใบ 02: โทษมีกำหนดเวลา) เป็นสีสันของการ์ด — เวลานรกเทียบเวลามนุษย์ไม่ได้ จึงไม่ผูกปีเกิดชาติหน้า
  // รอบที่มีวงต่อ (steps มี loop) กำหนดเท่าปีทิพย์ที่จะเล่นจริง — คำบนการ์ดกับจำนวนปีในวงต้องตรงกัน
  const loops = af.steps.includes('loop') && !af.st.flags?.isekai_call;
  const term = loops ? loopYears(netLedger(ledger)) : realm.id === 'human' ? 0 : Math.max(1, Math.round(Math.abs(netLedger(ledger)) * 10));
  af.verdict = { x, net: netLedger(ledger), realm, term };
  af.thaiVerdict ??= af.verdict;
  const where = loops ? (realm.id === 'human' ? `รอเกิดเป็นมนุษย์อีก ${term} ปีทิพย์` : `ไปภูมิ${realm.name} กำหนด ${term} ปีทิพย์`) : realm.id === 'human' ? 'ไปเกิดเป็นมนุษย์ทันที ไม่ต้องรอ' : `ไปภูมิ${realm.name} กำหนด ${term} ปีของภูมินั้น`;
  const back = af.from ? `ดวงวิญญาณของ${af.from.name}ถูกดึงกลับจากต่างโลกมายืนหน้าปรโลกอีกครั้ง ` : '';
  // ชาติต่างโลกให้สกิลบนการ์ดจบของมันแล้ว — ตอนกลับมาปรโลกจึงไม่ให้ซ้ำจากชีวิตไทยเดิม
  const earn = af.from ? [] : thaiEarn(af.st);
  return emitAfter(af, {
    kind: 'verdict',
    type: 'B',
    realm: realm.name,
    text: `${back}เทวดาผู้ถือบัญชีชักบุญกับบาปมาดูทั้งสองฝ่าย ฝ่ายใดหนักก็ไปฝ่ายนั้น พญายมชี้ว่า${where}`,
    reckoning: reckoning(ledger),
    note: 'กติกาแฟนตาซีของเกม ได้แรงบันดาลใจจากไตรภูมิพระร่วงและคติไทย',
    ...(earn.length && { earn }),
    choices: [],
  });
}

// ทางเกิด (ใบ 05): เป็นลูก (รับมรดกต่อ · ผีบรรพบุรุษเฝ้า) หรือเกิดใหม่ตามกรรม · ไม่มีลูกยังเล่นต่อได้ทางเกิดใหม่
// การ์ดนี้เป็นทางแยกของเกม ไม่ใช่เหตุการณ์ จึงไม่ต้องมี 4 ตัวเลือกตามกติกาเนื้อหา · ทางที่ 3 ต่างโลก (B68) เลือกได้เสมอ
const PATHS = [
  { id: 'child', text: 'เฝ้าลูกหลาน แล้วกลับมาเกิดในตระกูลเดิม เป็นลูก หลาน หรือเหลน' },
  { id: 'reborn', text: 'ไปตามกรรม แล้วเกิดใหม่ที่ไหนก็ได้' },
  { id: 'isekai', text: 'ตามเทพธิดาต่างโลกไปเกิดในโลกแฟนตาซีก่อน' },
  // B76: ต่อท้ายเสมอ ดัชนีทางเดิมจึงไม่ขยับ · ขึ้นเฉพาะเมื่อมีรายชื่อ ไม่มี = การ์ดเท่าเดิมทุกไบต์
  { id: 'blood', text: 'เล่นต่อเป็นผู้สืบสายเลือด' },
];
// กลับจากต่างโลก: ลูกหลานชาติไทยห่างไปหลายรุ่นแล้ว จึงกลับได้ทางตามกรรมเท่านั้น · ทางที่ 3 = อยู่ต่างโลกต่อ ติดเพดานชาติติดกัน
const FROM_ISEKAI_PATHS = {
  child: 'เฝ้าลูกหลานในโลกเดิม',
  reborn: 'กลับโลกเดิม ไปเกิดเป็นคนตามกรรม',
  isekai: 'อยู่ต่างโลกต่อ ให้เทพธิดาส่งไปเกิดอีกรอบ',
};
const pathLocked = (af, id) => {
  if (id === 'child') return af.from ? 'ลูกหลานในโลกเดิมห่างไปหลายรุ่นแล้ว' : hasKids(af.st) ? null : 'ไม่มีลูกหลานให้กลับไปเกิด';
  if (id === 'isekai' && af.from && af.from.run >= ISEKAI.stay) return 'เทพธิดาบอกว่าวิญญาณนี้อยู่ต่างโลกนานพอแล้ว';
  if (id === 'blood' && !pathHeirs(af).length) return 'ไม่มีลูกหลานวัยที่เล่นต่อได้';
  return null;
};
// กลับจากต่างโลก = ลูกหลานห่างไปหลายรุ่นแล้ว ไม่มีรายชื่อ
const pathHeirs = (af) => (af.from ? [] : heirCandidates(af.st));
function pathCard(af) {
  const heirs = pathHeirs(af);
  const paths = PATHS.filter((p) => p.id !== 'blood' || heirs.length);
  af.pending = { path: true, choices: paths.map(() => ({ merit: [] })) };
  const base = af.from
    ? 'เทพธิดาต่างโลกยืนรออยู่ข้างพญายม ถามว่าจะกลับไปเกิดในโลกเดิม หรือจะไปต่างโลกอีกรอบ'
    : hasKids(af.st) ? 'ก่อนไปตามคำตัดสิน ดวงวิญญาณเลือกได้ว่าจะกลับไปใกล้ลูกหลาน หรือปล่อยวางแล้วไปเกิดตามกรรม' : 'ไม่มีลูกหลานให้เฝ้า ดวงวิญญาณไปเกิดตามกรรม';
  return emitAfter(af, {
    kind: 'path',
    type: 'B',
    text: af.blessed && !af.from ? `${base} · มีหญิงผมสีเงินยืนโบกมือรออยู่ข้างทาง บอกว่าเป็นเทพธิดาจากอีกโลกหนึ่ง` : base,
    choices: paths.map((p) => (af.from ? FROM_ISEKAI_PATHS[p.id] : p.text)),
    locked: paths.map((p) => pathLocked(af, p.id)),
    // ปุ่มสายเลือดคนกดได้ บอทไม่กด (openChoices) · หน้าเลือกคนอ่าน heirs แล้วส่ง id กลับทาง chooseAfter
    ...(heirs.length && { manual: paths.map((p) => p.id === 'blood'), heirs }),
  });
}

// การ์ดเปิดชีวิตของรุ่นถัดไปเล่าคำเดียวกัน — ผู้เล่นเห็นสองใบตรงกัน
// คำบอกขนาดบุญ+บาปที่ส่งต่อจริง (B137) ไม่ใช่สัดส่วนที่สุ่ม — สัดส่วนสูงของบัญชีว่างยังเท่ากับไม่มีอะไรติดตัว
// เกณฑ์วางให้ชีวิตทั่วไปตกช่วงกลาง (วัด 300 ชีวิตบอทสุ่ม: p25 ≈ 10 · p50 ≈ 14 · p75 ≈ 18) · เซฟเก่าไม่มี kept ใช้คำตามสัดส่วนแบบเดิม
const CARRY_WORDS = [[1, 'แทบไม่มี'], [8, 'น้อย'], [18, 'พอประมาณ']];
const carryAmount = (h) => (h.kept === undefined ? (h.carried >= 0.55 ? 'มาก' : h.carried >= 0.45 ? 'พอประมาณ' : 'น้อย') : (CARRY_WORDS.find(([cut]) => h.kept < cut)?.[1] ?? 'มาก'));

function carryCard(af) {
  const r = CARRY.min + af.rng.next() * (CARRY.max - CARRY.min);
  af.heir = makeHeir(af, r);
  const h = af.heir;
  const amount = carryAmount(h);
  const who = af.path === 'blood' ? `เล่นต่อเป็น${h.name} ${kinTier(h.tier).name}อายุ ${h.start.age} ปี` : af.path === 'child' ? `กลับมาเกิดเป็น${kinTier(h.tier).name}ของตัวเอง` : af.from ? 'กลับจากต่างโลกมาเกิดใหม่' : 'ไปเกิดใหม่';
  return emitAfter(af, {
    kind: 'carry',
    type: 'B',
    text: `ก่อนดื่มน้ำลืมชาติ พญายมแจ้งว่ากรรมที่ติดตัวไปครั้งนี้${amount} · ${who} เป็น${h.sex} ฐานะ${h.cls}`,
    lineage: lineageText(h.lineage),
    note: 'กติกาแฟนตาซีของเกม ได้แรงบันดาลใจจากไตรภูมิพระร่วงและคติไทย',
    choices: [],
    done: true,
  });
}

// ผังตระกูล (ใบ 05: เลิกเมื่อไรก็ดูได้) — หน้าจอวาดระหว่างชีวิตจาก st.lineage และบนการ์ดส่งต่อ
const lineageText = (lineage) => lineage.map((l) => l.isekai ? `รุ่นที่ ${l.gen} · ${l.name} · ต่างโลก (${l.world}) · ${l.ending}` : `รุ่นที่ ${l.gen} · ${l.name ? `${l.name} · ` : ''}${l.sex} · ${l.province ? `${placeName(l.province)} · ` : ''}ฐานะ${l.cls} · ${lifeEndWord(l.gone)} ${l.age} · ไปภูมิ${l.realm}${l.path === 'child' ? ` · กลับมาเกิดเป็น${kinTier(l.tier).name}` : l.path === 'blood' ? ` · เล่นต่อเป็น${kinTier(l.tier).name}` : ''}${l.trips?.some((t) => t.home) ? ` · เคยไปต่างโลกแล้วกลับมา ${l.trips.filter((t) => t.home).length} ครั้ง` : ''}`);

// ชาติต่างโลกจบ (การ์ดตอนจบออกไปแล้ว): ลงผังตระกูลเป็นรุ่นของตัวเอง แล้วเปิดปรโลกรอบใหม่ให้ชาตินั้น
// ยมทูต/เทวทูตเป็นฉากของชีวิตไทย (เนื้อหาอ่านค่าชาติไทย) จึงเริ่มที่คำตัดสิน
function closeIsekai(af) {
  const isk = af.isekai;
  af.isekaiLives.push(isekaiLineage(isk, (af.st.gen ?? 1) + 1 + af.isekaiLives.length));
  // บัญชีเดียวของดวงวิญญาณ (B26 · B68a-2): ชาติต่างโลกที่จบแล้วเขียนกลับลง af.st.ledger ปรโลกรอบใหม่และบันทึกการกระทำ (noteDeed) จึงอ่านที่เดียวกัน
  af.st.ledger = isk.ledger;
  // ขั้นที่อัปในชาตินี้ติดไปชาติต่างโลกถัดไป (sendToIsekai อ่าน af.st.skills)
  if (af.st.skills) af.st.skills = skillsBack(af.st.skills, isk);
  af.from = { name: isk.name, run: isk.run, memory: isekaiMemory(isk), real: isk.real };
  af.isekai = null;
  af.path = null;
  af.steps = ['verdict', 'path', 'scene', 'carry'];
  af.i = 0;
}

// ส่งดวงวิญญาณไปต่างโลก: กรรมที่ติดตัวไปคิดแบบเดียวกับการเกิดใหม่ (หักฝั่งที่ชี้ปลายทาง แล้วสุ่มสัดส่วน) — ไปต่างโลกไม่ใช่ทางลบบาป
// ถูกเรียกแล้วหายตัวไปทั้งร่าง (B173) ไม่ได้ตายแล้วเกิดใหม่ จึงพกบัญชีไปทั้งก้อนแบบทริป · ยังดึงเลขสุ่มเท่าเดิมให้ทางอื่นเดินตรงกับก่อนแก้
function sendToIsekai(af) {
  const r = CARRY.min + af.rng.next() * (CARRY.max - CARRY.min);
  const prev = af.from;
  // เข้าต่างโลกครั้งแรกของรอบปรโลกนี้ (เกิด/ถูกเรียก) ขณะตระกูลเคยออกจากต่างโลกมาแล้ว = กลับเข้าโลกเดิม · รอบต่อเนื่อง (prev) ยังไม่ได้ออก
  if (!prev && overlapLeftIsekai(af.st)) overlapStep(af.st);
  // ชาติต่างโลกที่จบแล้ว (prev) ตายจริงในโลกนั้น — ธงของชาติไทยยังติดอยู่ จึงต้องกันไว้ ไม่ให้รอบถัดไปพกทั้งก้อนด้วย
  const whole = !prev && !!af.st.flags?.isekai_call && isGone(af.st);
  af.isekai = startIsekai({
    seed: af.st.seed,
    karma: af.verdict.x,
    past: af.st.name,
    ledger: whole ? af.st.ledger : carryLedger(af.st.ledger, af.verdict.net, r),
    blessed: !prev && af.blessed,
    fated: !prev && !!af.st.flags?.isekai_call,
    run: prev ? prev.run + 1 : 0,
    memory: prev?.memory ?? null,
    // ค่าโลกจริงตอนข้าม (B100) — รอบต่างโลกติดกันใช้ค่าจริงที่สะท้อนมาจากรอบก่อน
    real: prev?.real ?? realAt(af.st),
    hints: af.st.content.nearHints,
    // ชุดที่พกตอนเกิดชีวิตไทยนี้ ใช้ต่อทุกชาติต่างโลกที่ตามมาจนเกิดใหม่ (06s)
    carry: af.st.skills ?? [],
    // โลกจำของที่ชาติต่างโลกก่อน ๆ ทั้งเซฟสร้างไว้ (B68h) — รวมชาติที่เพิ่งจบในช่วงนี้ซึ่งยังไม่ลงผังของชาติไทย
    // ทริปไปกลับของชาตินี้ (B68m) ยังไม่ลงผัง — ส่งเป็นแถวชั่วคราว
    lore: isekaiWorldLore([...(af.st.lineage ?? []), { trips: af.st.trips }, ...af.isekaiLives]),
    // คนต่างโลกรุ่นก่อนที่ดังพอให้โลกจำชื่อ (B68i) — อ่านแถวชุดเดียวกับโลกจำ
    legends: isekaiWorldLegends([...(af.st.lineage ?? []), { trips: af.st.trips }, ...af.isekaiLives]),
    overlapStage: overlapStageOf(af.st),
  });
}

const clamp100 = (v) => Math.max(0, Math.min(100, v));

function startLoop(af) {
  const st = af.st;
  const realm = af.verdict.realm.id;
  const half = (k) => Math.round(clamp100(st[k] ?? 50) * LOOP.inherit);
  return { rng: makeRng(st.seed ^ 0x3c6ef372), realm, year: 0, years: loopYears(af.verdict.net), ...LOOP.start[realm], knowledge: half('knowledge'), relations: half('relations'), cards: 0, end: null };
}
const loopOver = (l) => l.year >= l.years || l.health <= 0;

// การ์ดในวงไม่นับใน af.cards (เหมือนการ์ดต่างโลก) — ความยาววงขึ้นกับปีทิพย์ แยกจากด่านความยาวฉากระหว่างชาติ
// ทุกใบพกค่าวงตอนนั้นไปให้จอวาดแถบ · year = ปีของใบนั้น (การ์ดปีใหม่ = ปีที่กำลังเล่น · การ์ดผล/จบวง = ปีที่เพิ่งผ่าน)
function loopEmit(af, card) {
  const l = af.loop;
  l.cards++;
  const { rng, cards, ...view } = l;
  return { stage: AFTERLIFE_STAGE, ...card, loop: { ...view, year: card.kind === 'scene' ? l.year + 1 : l.year } };
}

function loopFx(c) {
  const out = Object.entries(c.effects ?? {}).filter(([k]) => LOOP_KEYS.includes(k)).map(([k, v]) => `${LOOP_LABELS[k]} ${v > 0 ? '↑' : '↓'}`);
  if (c.outcomes?.length) out.push('?');
  return out.join(' · ');
}

function loopCard(af) {
  const ev = pickScene(af, 'loop', af.loop.rng);
  af.pending = ev;
  return loopEmit(af, {
    kind: 'scene',
    id: ev.id,
    type: 'B',
    scene: 'loop',
    title: ev.title ? fill(ev.title, af.st) : null,
    text: fill(ev.text, af.st),
    choices: ev.choices.map((c) => fill(c.text, af.st)),
    ...choiceHints(ev, af.st),
    fx: ev.choices.map(loopFx),
  });
}

function loopEndCard(af) {
  const l = af.loop;
  l.end = l.health <= 0 ? 'spent' : 'served';
  const text = l.end === 'spent'
    ? `ชีวิตทิพย์หมดลงในปีที่ ${l.year} ก่อนครบกำหนด ${l.years} ปี ดวงวิญญาณจึงถูกพาไปรอเกิดเร็วกว่าที่ชี้ไว้`
    : `ครบกำหนด ${l.years} ปีทิพย์ในภูมิ${af.verdict.realm.name} ดวงวิญญาณถูกพาไปรอเกิด`;
  return loopEmit(af, { kind: 'loopEnd', type: 'B', text, choices: [] });
}

function addLoop(l, fx = {}) {
  for (const k of LOOP_KEYS) if (fx[k]) l[k] = clamp100(l[k] + levelValue(fx[k]));
}

// ผลในวงลงค่าวงอย่างเดียว · ป้ายบุญบาปบนการ์ดวงเป็น neutral (ด่าน lint) จึงไม่ลงบัญชี · ปีเดินหลังผลการ์ด
function chooseLoop(af, ev, idx) {
  const c = ev.choices[idx];
  if (!c) throw new Error('ตัวเลือกไม่ถูกต้อง');
  af.pending = null;
  const l = af.loop;
  addLoop(l, c.effects);
  const o = c.outcomes?.length ? weighted(l.rng, c.outcomes, c.outcomes.map((x) => x.weight * poolMultiplier(af.st, x.multipliers))) : null;
  if (o) addLoop(l, o.effects);
  l.health = clamp100(l.health - LOOP.drain);
  l.year++;
  if (o?.text) af.queue.push({ kind: 'result', type: 'B', text: fill(o.text, af.st), choices: [], loop: true, tag: 'afterlife', evId: ev.id });
}

// การ์ดถัดไปของช่วงที่ 7 · การ์ด carry (done) เป็นใบสุดท้าย แล้วผู้เรียกต่อ nextLife
function nextAfterCard(af) {
  if (af.pending) throw new Error('ยังมีการ์ดที่รอเลือก');
  if (af.isekai?.ending) closeIsekai(af);
  // การ์ดต่างโลกไม่นับใน af.cards — ความยาวช่วงที่ 7 (ด่าน lineage) วัดเฉพาะการ์ดระหว่างชาติ
  if (af.isekai) return { stage: AFTERLIFE_STAGE, ...nextIsekaiCard(af.isekai) };
  if (af.queue.length) {
    const q = af.queue.shift();
    return q.loop ? loopEmit(af, q) : emitAfter(af, q);
  }
  const step = af.steps[af.i++];
  if (step === 'loop') {
    if (!LOOP.paths.includes(af.path)) return nextAfterCard(af);
    af.loop ??= startLoop(af);
    if (loopOver(af.loop)) return loopEndCard(af);
    // ค้างที่ขั้นวงจนจบวง — เซฟกลางวงเก็บ i ชี้ขั้นนี้
    af.i--;
    return loopCard(af);
  }
  if (step === 'transfer' || step === 'devaduta') return sceneCard(af, pickScene(af, step));
  if (step === 'verdict') return verdictCard(af);
  // กดรับการ์ดชวนในชีวิต (B68d) = ถูกเรียกไปแล้ว ไม่มีการ์ดเลือกทางเกิด
  if (step === 'path' && af.st.flags?.isekai_call && !af.from) {
    af.path = 'isekai';
    sendToIsekai(af);
    return nextAfterCard(af);
  }
  if (step === 'path') return pathCard(af);
  if (step === 'scene') return sceneCard(af, pickScene(af, af.path === 'child' ? 'ancestor' : 'realm'));
  if (step === 'carry') return carryCard(af);
  throw new Error('ระหว่างชาติจบแล้ว — ต่อด้วย nextLife');
}

function addBonus(af, fx = {}) {
  for (const k of STAT_KEYS) if (fx[k]) af.bonus[k] = Math.max(-FATE.bonusCap, Math.min(FATE.bonusCap, (af.bonus[k] ?? 0) + levelValue(fx[k])));
}

// heirId = คนที่เลือกจากรายชื่อ card.heirs (เฉพาะปุ่มสายเลือด)
function chooseAfter(af, idx, heirId = null) {
  if (af.isekai) return chooseIsekai(af.isekai, idx);
  const p = af.pending;
  if (p?.path) {
    const path = idx < p.choices.length ? PATHS[idx] : null;
    if (!path || pathLocked(af, path.id)) throw new Error('ตัวเลือกไม่ถูกต้อง');
    if (path.id === 'blood') {
      if (!pathHeirs(af).some((m) => m.id === heirId)) throw new Error('ต้องเลือกคนจากรายชื่อผู้สืบสายเลือด');
      af.blood = heirId;
    }
    af.pending = null;
    af.path = path.id;
    if (path.id === 'isekai') sendToIsekai(af);
    return;
  }
  if (p?.scene === 'loop') return chooseLoop(af, p, idx);
  const c = p?.choices[idx];
  if (!c) throw new Error('ตัวเลือกไม่ถูกต้อง');
  af.pending = null;
  // บุญบาปในช่วงที่ 7 เข้าบัญชีเดิม: ก่อนปรโลก = เปลี่ยนคำตัดสิน · หลังปรโลก = เปลี่ยนส่วนที่ส่งต่อ (ใบ 09 แก้เพิ่ม)
  // อายุ null = ทำหลังตาย หน้าจอเรียกตามนั้น
  const text = fill(c.text, af.st);
  noteDeed(af.st, text, () => recordMerit(af.st.ledger, c.merit, p.id), null);
  addBonus(af, c.effects);
  if (!c.outcomes?.length) return;
  const o = weighted(af.rng, c.outcomes, c.outcomes.map((x) => x.weight * poolMultiplier(af.st, x.multipliers)));
  noteDeed(af.st, text, () => recordMerit(af.st.ledger, o.merit, p.id), null);
  addBonus(af, o.effects);
  if (o.text) af.queue.push({ kind: 'result', type: 'B', text: fill(o.text, af.st), choices: [], tag: 'afterlife', evId: p.id });
}

// ส่งต่อบัญชี: ฝั่งที่ชี้ปลายทางถูกหัก spend × |สุทธิที่ปรโลก| (ไม่ติดลบ) แล้วคูณ r ทั้งสองฝั่งและทุกหมวด
// คำบนที่ผิด (broken) ไม่ส่งต่อ — ผูกกับชีวิตที่บน
// หมวดใน FULL_CARRY ไม่คูณ r — บาปสัญญากับมาร (B156) ต้องตามทุกชาติจนชดใช้ จางได้ทางส่วน spend เท่านั้น
const FULL_CARRY = ['mara_pact'];
function carryLedger(ledger, net, r) {
  const keep = { merit: ledger.merit, sin: ledger.sin };
  const side = net >= 0 ? 'merit' : 'sin';
  keep[side] = Math.max(0, keep[side] - Math.abs(net) * CARRY.spend);
  const out = newLedger();
  out.merit = keep.merit * r;
  out.sin = keep.sin * r;
  for (const [id, v] of Object.entries(ledger.byCat)) {
    const s = SIN_CATS.includes(id) ? 'sin' : 'merit';
    const f = ledger[s] ? keep[s] / ledger[s] : 0;
    const full = FULL_CARRY.includes(id);
    if (v * f * (full ? 1 : r)) out.byCat[id] = v * f * (full ? 1 : r);
    if (full) out[s] += v * f * (1 - r);
  }
  return out;
}

// มรดกต่อลูกหนึ่งคน เป็นจำนวนเท่าของรายได้ครัวเรือนทั้งปีของทั้งประเทศตอนตาย — ชีวิตลูกเดินเงินเฟ้อคนละชุด (seed ต่างกัน)
// จึงส่งต่อเป็นสัดส่วนของรายได้ แล้วแปลงกลับเป็นบาทในปีที่ลูกได้รับ · ทรัพย์สุทธิติดลบ = หนี้ไม่ตกถึงลูก (ป.พ.พ. ม.1601)
// kids = จำนวนลูกที่ยังอยู่จริง (B36a) · ไม่รู้จำนวน (harness/state เก่า) ใช้ LEGACY.kids
function legacyUnits(st, kids = LEGACY.kids) {
  const e = st.estate;
  if (!e || e.money <= 0) return 0;
  let share = e.money / Math.max(1, kids);
  // ผ่านฉากงานศพแล้วไม่ได้ทำพินัยกรรม และมีลูกพอจะแบ่งกันเอง — ตายตอนเด็ก/ลูกคนเดียวไม่หัก
  if (st.funeral && !st.flags?.wish_will && disputes(st)) share *= 1 - LEGACY.dispute;
  if (e.year >= LEGACY.taxYear && share > LEGACY.taxFrom) share -= (share - LEGACY.taxFrom) * LEGACY.tax;
  return share / (nationalIncome(st.content.era, st.seed, e.year) * 12);
}

// อายุตอนมีลูกคนแรก: อายุที่ธง has_kids ติด · ไม่มีบันทึก (เนื้อหาเก่า) ใช้ 28 ตามค่ากลางที่เกมตั้ง
const KID_AGE_DEFAULT = 28;

const otherSex = (sex) => (sex === 'ชาย' ? 'หญิง' : 'ชาย');
// คู่ของพ่อ/แม่สายเลือด: ฝ่ายชายแก่กว่าได้ถึง 8 ปี (แบบพ่อแม่ใน newLife)
const spouseAge = (rng, sex, age) => (sex === 'หญิง' ? age + rng.int(0, 8) : Math.max(18, age - rng.int(0, 8)));
// รุ่นก่อนในฐานะญาติของผู้เล่นใหม่ — หลานเรียกตามฝั่งของพ่อแม่ที่เป็นสายเลือด
const elderWord = (tier, linkSex, sex) => (tier === 3 ? 'ทวด' : tier === 1 ? (sex === 'หญิง' ? 'แม่' : 'พ่อ') : linkSex === 'หญิง' ? (sex === 'หญิง' ? 'ยาย' : 'ตา') : sex === 'หญิง' ? 'ย่า' : 'ปู่');

// พ่อ/แม่ของรุ่นถัดไปที่ชะตารู้แล้ว (diesAt) พาสาเหตุไปด้วย (B110 ชิ้น 2) — ลูกได้ประวัติครอบครัวและการ์ดรู้ว่าป่วยปีเดียวกับที่ชาติก่อนรู้
// ผู้เล่นรุ่นก่อนหายไปต่างโลก = ไม่มีศพ ไม่มีสาเหตุ · เซฟเก่าไม่มีอายุที่รู้ ใช้ปีก่อนตาย
const illOf = (cause, age, from) => (CHRONIC.includes(cause) ? { ill: { cause, age, from } } : {});
const deathOf = (st) => (isGone(st) ? { gone: true } : { cause: st.cause ?? 'other', ...illOf(st.cause, st.age, st.terminal?.cause === st.cause ? (st.terminal.toldAge ?? st.age - 1) : st.age) });
const kinDeathOf = (m) => (m.cause ? { cause: m.cause, ...illOf(m.cause, m.diedAge, m.ill?.cause === m.cause ? (m.ill.toldAt ?? m.diedAge - 1) : m.diedAge) } : {});

// ธงที่ทายาททางสายเลือดได้รู้จากรุ่นก่อน — allow-list ตามหมวด heir: ของทะเบียน (ธงอื่นเป็นเรื่องส่วนตัวของรุ่นก่อน) · เพดานชั้นต่อธง
// ไม่ดึงเลขสุ่ม: ไม่มีการ์ดอ่าน parent_flags = เล่นเท่าเดิมทุกไบต์ · เก็บแยกจาก st.flags ของทายาท (ธงตัวตนของเขาเอง)
const heirFlags = (st, tier) => Object.fromEntries(Object.entries(st.content.heir ?? {}).filter(([f, h]) => st.flags[f] && tier <= h.tier).map(([f]) => [f, tier]));

function makeHeir(af, r) {
  const st = af.st;
  const era = st.content.era;
  const { x, net } = af.verdict;
  const rng = af.rng;
  const lastBirth = era.births.from + era.births.w.length - 1;
  let sex = rng.next() < 0.5 ? 'ชาย' : 'หญิง', name = null;
  let cls, region, birthYear, parents = null, legacy = null, tier = null, occupation = null, province = null, parentFlags = {}, letter = null;
  const death = deathStanding(st);
  // เป้าตระกูลที่เพิ่งสำเร็จรุ่นนี้ ได้ชื่อเสียง +1 ต่อข้อ (ครั้งเดียวต่อตระกูล)
  const goals = goalsMet(st, (st.estate?.money ?? 0) < 0);
  const fame = Math.min(FAME.names.length - 1, nextFame(st, death) + goals.length);
  // ทางสายเลือด (B76) = คนที่ผู้เล่นเลือก ชั้นตามบทบาท ไม่สุ่มชั้น/คน · ที่เหลือคิดแบบทางเป็นลูก (พ่อแม่ มรดก ธงรุ่นก่อน)
  const blood = af.path === 'blood' ? st.kin.find((m) => m.id === af.blood) : null;
  if (af.path === 'child' || blood) {
    // บ้านของรุ่นถัดไปคือบ้านของคนในชาติก่อน — อาชีพของครอบครัวจึงเป็นงานสุดท้ายของเขา ไม่สุ่มใหม่
    occupation = st.occupation;
    tier = blood ? KIN_TIERS[blood.role === 'child' ? 0 : 1] : weighted(rng, KIN_TIERS, KIN_TIERS.map((t) => t.w));
    // ลูก/หลานที่ยังอยู่จริง (B36a): เกิดเป็นคนหนึ่งในนั้น · ไม่มีลูกเหลือแต่มีหลาน = ชั้นลูกเลื่อนเป็นหลาน · สุ่มเลือกคนจาก kinRng ของชีวิตก่อน
    const kids = livingKin(st, 'child'), grand = livingKin(st, 'grandchild');
    if (st.kin && tier.tier === 1 && !kids.length) tier = KIN_TIERS[1];
    const pickOne = (list) => (list.length ? list[st.kinRng.int(0, list.length - 1)] : null);
    const me = blood ?? (st.kin ? (tier.tier === 1 ? pickOne(kids) : tier.tier === 2 ? pickOne(grand) : null) : null);
    const link = me?.role === 'grandchild' ? st.kin.find((m) => m.id === me.of) ?? null : tier.tier > 1 ? pickOne(kids) : null;
    const spouse = (st.kin ?? []).filter((m) => m.role === 'spouse').at(-1) ?? null;
    if (me) ({ sex, name } = me);
    parentFlags = heirFlags(st, tier.tier);
    const kidAge = me?.role === 'child' ? me.born - st.birthYear : link ? link.born - st.birthYear : Math.min(st.age, st.flagAge?.has_kids ?? KID_AGE_DEFAULT);
    region = { name: st.region, ses: st.ses };
    province = st.province;
    // ชั้นลูกหารด้วยลูกที่ยังอยู่จริง · หลานจริงหารต่อด้วยพี่น้องของเขา · ชั้นที่ไม่มีคนจริงใช้ตัวคูณเดิมของชั้น
    const sibs = me?.role === 'grandchild' ? grand.filter((g) => g.of === me.of).length : 0;
    const units = st.kin ? legacyUnits(st, kids.length) * (tier.tier === 1 ? 1 : sibs ? 1 / sibs : tier.legacy) : legacyUnits(st) * tier.legacy;
    const rich = LEGACY.richUnits.filter((u) => units >= u).length;
    const wealth = st.estate?.money < 0 ? -1 : rich;
    cls = CLASSES[mixStanding(death, clampIdx(CLASSES.indexOf(st.cls) + wealth + Math.round(x * FATE.childStep)))];
    const debt = st.estate?.money < 0;
    let year = st.birthYear + kidAge;
    if (tier.tier === 1) {
      // ผู้เล่นรุ่นก่อนตายตามชะตาเดิมของตัวเอง (diesAt) · อีกคนแก่และตายตามตารางชีพแบบพ่อแม่ทั่วไป
      // คู่ครองจริงเป็นพ่อ/แม่อีกคน: อายุตอนลูกเกิดจากปีเกิดจริง · ตายไปแล้วตอนเราตาย = ตายที่อายุนั้น · ไม่มีคู่จริง = สร้างแบบเดิม
      const year0 = st.birthYear + kidAge;
      parents = [
        { sex: st.sex, age: kidAge, alive: true, diesAt: st.age, ancestor: true, name: st.name, ...deathOf(st) },
        spouse && spouse.born <= year0
          ? { sex: spouse.sex, age: year0 - spouse.born, alive: spouse.diedAge === null || spouse.diedAge > year0 - spouse.born, ...(spouse.diedAge !== null && { diesAt: spouse.diedAge, ...kinDeathOf(spouse) }), name: spouse.name }
          : { sex: otherSex(st.sex), age: spouseAge(rng, st.sex, kidAge), alive: true },
      ];
      legacy = { age: st.age - kidAge, units, debt, from: elderWord(1, null, st.sex) };
    } else {
      // รุ่นคั่นกลางเกิดห่างกันตามช่วงอายุแม่ตอนคลอด · พ่อ/แม่ของผู้เล่นใหม่เป็นลูก (หรือหลาน) ของรุ่นก่อน แก่และตายตามตารางชีพ
      // หลานจริง = เกิดปีของเขา พ่อ/แม่สายเลือดคือลูกจริงที่ให้กำเนิด · ไม่มีคนจริง = ห่างรุ่นสุ่มแบบเดิม (เริ่มจากปีเกิดลูกจริงถ้ามี)
      let gap = 0;
      if (me) {
        gap = me.born - (link?.born ?? year);
        year = me.born;
      } else {
        for (let i = 1; i < tier.tier; i++) {
          gap = rng.int(...GEN_GAP);
          year += gap;
        }
      }
      const linkSex = link?.sex ?? (rng.next() < 0.5 ? 'หญิง' : 'ชาย');
      // ลูกจริงเป็นพ่อ/แม่ได้ตรง ๆ เฉพาะชั้นหลาน · เหลนมีรุ่นคั่นที่ยังไม่มีตัวตน
      const direct = link && tier.tier === 2;
      parents = [
        direct ? { sex: link.sex, age: gap, alive: link.diedAge === null || link.diedAge > gap, ...(link.diedAge !== null && { diesAt: link.diedAge, ...kinDeathOf(link) }), name: link.name } : { sex: linkSex, age: gap, alive: true },
        { sex: otherSex(linkSex), age: spouseAge(rng, linkSex, gap), alive: true },
      ];
      // รุ่นก่อนไม่อยู่ในพ่อแม่ — มรดกตกทอดปีที่รุ่นก่อนตาย ตายก่อนเกิดก็ได้รับตอนแรกเกิด
      legacy = { age: Math.max(0, st.birthYear + st.age - year), units, debt, from: elderWord(tier.tier, linkSex, st.sex) };
    }
    // จดหมายคำฝาก (afterfall-3): ถึงมือปีที่ผู้ฝากตายในชีวิตทายาท ไม่ก่อนอายุที่ทะเบียน heir: ยอมให้เล่า
    // ผู้รับเป็นคนอื่น = คนนั้นยื่นซอง · ผู้รับคือทายาทเอง/ไม่มีชื่อ = คนในบ้าน (ช่อง {ผู้ยื่นซอง})
    const sent = Object.keys(parentFlags).find((f) => f.startsWith('wish_letter_'));
    if (sent) {
      const to = letterTo(st);
      letter = { age: Math.max(legacy.age, st.content.heir[sent].from_age ?? 0), from: `${legacy.from} ${st.name}`, cause: causeWords(st.cause ?? 'other', st.age), by: to && to.id !== me?.id ? to.name ?? null : null };
    }
    // ปีเกมไม่เกินปีเกิดสุดท้ายในข้อมูล — เนื้อหา/ข้อมูลยุคครอบถึงช่วงนั้น · หน้าจอไม่แสดงปีอยู่แล้ว
    // สายเลือดเกิดจริงแล้ว — ตัดปีเกิดทำให้อายุตอนเริ่มเพี้ยนจากอายุจริง
    birthYear = blood ? blood.born : Math.min(lastBirth, year);
  } else {
    birthYear = pickBirthYear(rng, era);
    region = pickRegion(rng, era.birth);
    cls = CLASSES[mixStanding(death, clampIdx(Math.round(4.5 + 4.5 * x + gauss(rng) * FATE.sd)))];
  }
  const kin = (k) => (tier && (k === 'relations' || k === 'network') ? Math.max(-FATE.bonusCap, Math.min(FATE.bonusCap, (st[k] - 50) * FATE.kin * tier.kin)) : 0);
  const bonus = Object.fromEntries(STAT_KEYS.map((k) => [k, x * FATE.stat + (af.bonus[k] ?? 0) + kin(k) + (k === 'network' ? fame * FAME.network : 0)]));
  const gen = st.gen ?? 1;
  // broke = จากไปพร้อมหนี้ — ฉายาตระกูล (titles.mjs) นับรุ่นติดกัน · tier = กลับมาเกิดเป็นชั้นไหนของตัวเอง (ทางเป็นลูก)
  // ชีวิตต่างโลกต่อท้ายเป็นรุ่นของตัวเอง (B68) — แถวชาติไทยบันทึกทางว่าไปต่างโลกกับภูมิที่ปรโลกชี้ให้ชาติไทย แม้ขากลับจะเกิดใหม่ตามกรรมของชาติต่างโลก
  const thai = af.thaiVerdict ?? af.verdict;
  const lineage = [...(st.lineage ?? []), { gen, name: st.name, sex: st.sex, province: st.province, cls: st.cls, age: st.age, ...(isGone(st) ? { gone: true } : { cause: st.cause ?? 'other' }), realm: thai.realm.name, path: af.isekaiLives.length ? 'isekai' : af.path, ...(tier && { tier: tier.tier }), broke: (st.estate?.money ?? 0) < 0, standing: [...(st.standing ?? []), { age: st.age, cls: death }], fame, ...(goals.length && { goals }), ...(st.officeTop >= 0 && { office: st.officeTop }), ...(ladderOf(st)?.pension && { service: true }), ...(st.trips?.length && { trips: st.trips }) }, ...af.isekaiLives];
  const carried = r * (tier?.carry ?? 1);
  const ledger = carryLedger(af.st.ledger, net, carried);
  // ทายาทเกิดในโลกปกติเสมอ — รอบนี้มีชาติต่างโลกคั่น = กลับเข้าโลกที่เคยออกไป +1 (ชาติต่างโลกติดกันหลายรอบก็กลับครั้งเดียว) · ปรโลกคั่นชาติไม่นับ
  const overlap = overlapOf(st) + (af.isekaiLives.length ? 1 : 0);
  return {
    seed: mixSeed(st.seed, 0x5eed + gen),
    gen: gen + 1 + af.isekaiLives.length,
    sex,
    name,
    cls,
    region,
    province,
    birthYear,
    parents,
    legacy,
    occupation,
    bonus,
    ledger,
    carried,
    kept: ledger.merit + ledger.sin,
    tier: tier?.tier ?? null,
    parentFlags,
    letter,
    // ส่วนที่บ้านส่งต่อ แยกจาก bonus (ซึ่งรวมผลกรรม) ให้การ์ดเปิดชีวิตเล่าทิศได้โดยไม่เผยบัญชี
    kin: { relations: kin('relations'), network: kin('network') },
    lineage,
    pets: heirPets(st, birthYear, tier),
    // เกิดในตระกูล = รับหมวดโฟกัสหลักของรุ่นก่อนเป็นตัวเด็ก · เกิดที่อื่น/ไม่เคยโฟกัส = ตามน้ำ (ไม่มีฟิลด์ heir จึงเท่าเดิม)
    ...(tier && lifeFocusKid(st) && { focus: lifeFocusKid(st) }),
    // ประตูเข้าสายที่รุ่นก่อนเปิดไว้ ส่งต่อเฉพาะทายาทในตระกูล
    ...(tier && lifeGatesOpen(st).length && { gates: lifeGatesOpen(st) }),
    // เริ่มกลางวัย (B76): อายุจริงปีที่รุ่นก่อนตาย · newLife อ่านแล้วข้ามวัยเด็ก
    ...(blood && { start: { age: st.birthYear + st.age - blood.born, kinId: blood.id } }),
    fame,
    ...(overlap && { overlap }),
    // ความจำข้ามชาติไปกับทุกทางเกิด · ภูมิ = ภูมิที่ปรโลกชี้ให้ชาติไทย (แบบแถวผังตระกูล)
    past: pastOf(st, thai.realm.id, isGone(st)),
  };
}

// รุ่นถัดไป: ชีวิตใหม่จาก heir ที่การ์ดส่งต่อสร้างไว้ · carry = id สกิลที่ผู้เล่นเลือกพกจากคลัง (06s · bookCarryOffers) · book = คลังของผู้เล่น ให้การ์ดอัปเกรดรู้ขั้นคลัง
// offered = การ์ดเลือกสกิลขึ้นจริง (สมุดไม่ว่าง) — ผู้เรียกบอก ไม่เดาจาก carry ว่าง ⇒ บอท/harness ที่เรียก nextLife(af) เดินเท่าเดิม
function nextLife(af, carry = [], book = {}, offered = false) {
  if (!af.heir) throw new Error('ยังไม่ถึงการ์ดส่งต่อ');
  const heir = { ...af.heir, skills: carryPick(carry, book) };
  const spare = offered ? SKILL.carry - carry.length : 0;
  if (!spare) return newLife(heir.seed, af.st.content, heir);
  // ค่าเข้าเกณฑ์ดูจากค่าเริ่มสุดท้ายของชีวิตเดียวกันที่ยังไม่ได้ค่าเพิ่ม (ฐาน+jitter+bonus หลัง clamp)
  // ได้ 0 ค่ายังส่ง spare: [] ไป — การ์ดเกิดขึ้นบรรทัดสำรองแทน (decisions 360)
  const keys = spareKeys(newLife(heir.seed, af.st.content, heir), spare, heir.seed);
  const bonus = { ...heir.bonus };
  for (const k of keys) bonus[k] = (bonus[k] ?? 0) + SPARE_STAT;
  return newLife(heir.seed, af.st.content, { ...heir, bonus, spare: keys });
}

// ช่องพกที่ไม่ใช้แลกเป็นค่าเริ่ม (decisions 355–359): ช่องละ 1 ค่าสุ่มไม่ซ้ำ +SPARE_STAT · ไม่อยู่ใต้ FATE.bonusCap (ของแลก ไม่ใช่ผลกรรม)
// สุ่มเฉพาะค่าที่บวกได้เต็ม (≤ SPARE_MAX) · เข้าเกณฑ์น้อยกว่าช่องว่าง = ได้เท่าที่มี
// stream แยกจาก seed ของ heir — ไม่กินเลขสุ่มของโลก ชีวิตใหม่ต่างจากพกเต็มเฉพาะผลของค่าเริ่ม
// filter = false ใช้เป็นตัวควบคุมของด่านเท่านั้น (ต้องเห็นค่าชน 100)
const SPARE_STAT = 10;
const SPARE_MAX = 100 - SPARE_STAT;
function spareKeys(base, spare, seed, filter = true) {
  const rng = makeRng(seed ^ 0x2b7e1516);
  const pool = STAT_KEYS.filter((k) => !filter || base[k] <= SPARE_MAX);
  const out = [];
  while (out.length < spare && pool.length) out.push(...pool.splice(rng.int(0, pool.length - 1), 1));
  return out;
}

// harness/หน้าเว็บเดินช่วงที่ 7 ด้วยฟังก์ชันชุดเดียวกัน · บอทได้ af (มี pending.choices ให้อ่านป้ายบุญบาปแบบเดียวกับการ์ดชีวิต)
function playAfterlife(st, pickChoice, onCard) {
  const af = startAfterlife(st);
  for (;;) {
    const card = nextAfterCard(af);
    onCard?.(card, af);
    if (card.choices?.length) chooseAfter(af, warnPick(card) >= 0 ? warnPick(card) : pickChoice(card, af.botRng, af));
    // ชาติต่างโลกไม่มีใบทุ่มเทเข้าช่วงวัยแล้ว (ui-redo 83) — บอทตั้งโฟกัสตาแรกของช่วงจากใบเลือกรูปเดิม
    else if (card.entered && af.isekai) isekaiFocusPick(af.isekai, pickChoice({ stage: card.stage, ...isekaiFocusCard(af.isekai) }, af.botRng, af));
    if (card.done) return af;
  }
}

// การ์ดเปิดชีวิต (B16) + บรรทัดเล่าของการ์ดบ้านเมือง — อ่าน state ล้วน ไม่ดึงเลขสุ่มของโลก ลำดับสุ่มของชีวิตจึงเหมือนก่อนมีการ์ดนี้
// ไม่มีค่าบัญชีบุญบาป: กรรมที่ติดมาเล่าเป็นปริมาณคำเดียวกับการ์ดส่งต่อ ฐานะ/ญาติบอกแค่ทิศ ↑/↓




// สัดส่วนจำนวนเกิดปีนั้นเทียบปีที่เกิดมากที่สุดในข้อมูล — แบ่งบรรยากาศรุ่นเป็น 3 ขั้น (ค่าตั้งของเกม)
const COHORT = [
  [0.9, 'เกิดในยุคที่เด็กเกิดปีละมากที่สุดยุคหนึ่ง ห้องเรียนแน่น เพื่อนร่วมรุ่นเต็มไปหมด'],
  [0.7, 'เด็กยังเกิดกันมาก แต่น้อยกว่ายุคก่อน ครอบครัวเริ่มมีลูกน้อยลง'],
  [0, 'เด็กเกิดน้อยลงทุกปี บ้านส่วนใหญ่มีลูกแค่คนหรือสองคน'],
];
// ส่วนต่างจากบ้าน (FATE.kin) ที่ถือว่าเห็นทิศ — เล็กกว่านี้เล่าว่าเฉย ๆ ไม่ได้ความ จึงไม่เล่า
const KIN_SHOWN = 1.5;

const sexWord = (sex) => (sex === 'หญิง' ? 'สาว' : 'ชาย');
const parentWord = (p) => (p.sex === 'หญิง' ? 'แม่' : 'พ่อ');

function cohortText(era, year) {
  const w = era.births.w;
  const r = w[Math.max(0, Math.min(w.length - 1, year - era.births.from))] / Math.max(...w);
  return COHORT.find(([min]) => r >= min)[1];
}

function familyText(st) {
  const [mom, dad] = [st.parents.find((p) => p.sex === 'หญิง'), st.parents.find((p) => p.sex === 'ชาย')];
  // ชื่ออาชีพที่มีคำว่าอาชีพในตัว ("วิชาชีพ") ต่อกับ "ทำอาชีพ" แล้วซ้ำคำ
  const occ = st.occupationName.includes('ชีพ') ? `ทำงาน${st.occupationName}` : `ทำอาชีพ${st.occupationName}`;
  // เริ่มกลางวัย (B76): พ่อ/แม่ที่ตายไปแล้วเก็บอายุตอนตาย ไม่ใช่อายุวันนี้ · รุ่นก่อน (ancestor) ตายปีที่เริ่ม
  // แต่ยัง alive ตอนการ์ดนี้เกิด (ตายตอนรับมรดกหลังการ์ด) จึงดูจากอายุตายแทน
  const gone = (p) => !p.alive || (p.ancestor && p.age >= p.diesAt);
  const say = (p, w) => (st.age > 0 && gone(p) ? `${w}จากไปแล้ว` : `${w}อายุ ${p.age}`);
  return `ครอบครัวฐานะ${st.cls} ${say(mom, 'แม่')} ${say(dad, 'พ่อ')} ทางบ้าน${occ}`;
}

// อัตราตายทารกอ่านปีต้นแบบเดียวกับบันทึกตายตอนเด็ก — โลกของชีวิตนี้ยืมสถิติปีนั้นทั้งชุด
function eraText(st) {
  // เริ่มกลางวัย (B76) พ้นขวบปีแรกมาแล้ว — อัตราตายทารกไม่ใช่เรื่องของคนนี้ เหลือแค่บรรยากาศรุ่นที่เกิด
  if (st.age > 0) return cohortText(st.content.era, st.birthYear);
  const imr = infantMortality(st.content.era, st.sex, protoYear(st.content.era, st.seed, st.birthYear));
  return `${cohortText(st.content.era, st.birthYear)} · ยุคนั้นทารก${st.sex}ไทยราว ${Math.round(imr)} คนในทุก 1,000 คน ไม่รอดถึงขวบปีแรก`;
}

function legacyText(legacy, who) {
  if (legacy.units > 0) {
    const size = legacy.units >= LEGACY.richUnits[1] ? 'ก้อนมหาศาล' : legacy.units >= LEGACY.richUnits[0] ? 'ก้อนใหญ่' : legacy.units >= 1 ? 'พอประมาณ' : 'ก้อนเล็ก';
    return `มรดก — เมื่อ${who}จากไป ส่วนของคุณเป็นทรัพย์${size}`;
  }
  if (legacy.debt) return `หนี้ — ${who}มีหนี้ติดตัว แต่ทายาทรับผิดไม่เกินมรดก หนี้จึงไม่ตกถึงคุณ`;
  return `มรดก — ${who}ไม่มีทรัพย์เหลือให้`;
}

function kinText(k, v, who) {
  if (Math.abs(v) < KIN_SHOWN) return null;
  const up = v > 0;
  const why = k === 'relations'
    ? (up ? 'บ้านนี้ญาติมิตรใกล้ชิดกัน' : 'บ้านนี้ญาติห่างเหินกัน')
    : (up ? `คนรู้จักของ${who}เปิดทางให้` : `${who}แทบไม่มีคนรู้จักให้พึ่ง`);
  return `${STAT_LABELS[k]} ${up ? '↑' : '↓'} — ${why}`;
}

// สิ่งที่สืบทอด (รุ่นที่ 2 ขึ้นไป) อ่านจาก heir ที่การ์ดส่งต่อสร้าง — เลือกช่องเองทีละช่อง ไม่ส่ง heir ทั้งก้อน (มีบัญชีที่ส่งต่อ)
function inheritText(st, heir) {
  // ฐานะเทียบกับชาติไทยล่าสุด — แถวต่างโลก (B68) ไม่มีฐานะ
  const prev = st.lineage.findLast((l) => !l.isekai);
  const away = st.lineage.slice(st.lineage.indexOf(prev) + 1);
  const out = [];
  const ancestor = st.parents.find((p) => p.ancestor);
  // เซฟก่อน B18 ไม่มี legacy.from — ทางเป็นลูกชั้นเดียวยังมีพ่อ/แม่ที่เป็นชาติก่อนให้เรียก
  const who = heir.legacy?.from ?? (ancestor ? parentWord(ancestor) : null);
  if (prev.path === 'blood' && who) out.push(`รุ่นก่อนจากไปแล้ว คุณเล่นต่อเป็น${kinTier(prev.tier).name}ที่ยังอยู่ — ${who}ของคุณคือคุณในรุ่นก่อน`);
  else if (prev.path === 'child' && who) out.push(`ชาติก่อนเฝ้าลูกหลานไว้ แล้วกลับมาเกิดเป็น${kinTier(prev.tier).name}ของตัวเอง — ${who}ของคุณคือคุณในชาติก่อน`);
  else if (away.length) out.push(`ชาติก่อนตามเทพธิดาไปต่างโลก ${away.length} ชาติ (ล่าสุด: ${away.at(-1).name} · ${away.at(-1).ending}) แล้วกลับมาเกิดใหม่ในบ้านที่ไม่เกี่ยวกับตระกูลเดิม`);
  else out.push('ชาติก่อนไปตามกรรม แล้วมาเกิดใหม่ในบ้านที่ไม่เกี่ยวกับตระกูลเดิม');
  out.push(`กรรมที่ติดตัวมาจากชาติก่อน${carryAmount(heir)}`);
  const d = CLASSES.indexOf(st.cls) - CLASSES.indexOf(prev.cls);
  // ทางสายเลือดอยู่บ้านเดิม ไม่ได้เกิดใหม่ — บอกฐานะบ้านตอนนี้เทียบฐานะที่รุ่นก่อนเกิดมา
  if (prev.path === 'blood') out.push(`ฐานะ${d ? ` ${d > 0 ? '↑' : '↓'}` : ''} — ฐานะบ้านตอนนี้${st.cls} (รุ่นก่อนเกิดมาฐานะ${prev.cls})`);
  else out.push(d ? `ฐานะ ${d > 0 ? '↑' : '↓'} — เกิดในบ้านที่ฐานะ${d > 0 ? 'ดีกว่า' : 'ด้อยกว่า'}ชาติก่อน (ชาติก่อนฐานะ${prev.cls})` : `ฐานะ — ใกล้เคียงชาติก่อน (ฐานะ${prev.cls})`);
  if (who && heir.legacy) {
    out.push(legacyText(heir.legacy, who));
    for (const k of ['relations', 'network']) {
      const line = kinText(k, heir.kin?.[k] ?? 0, who);
      if (line) out.push(line);
    }
  } else out.push('ไม่ได้รับมรดกหรือคนรู้จักจากบ้านเก่า มีแต่กรรมที่ติดมา');
  return out;
}

// ผังตระกูลย่อบนการ์ดเปิดชีวิต: รุ่นใกล้สุดก่อนเท่านี้ ที่เหลือดูได้ในผังพับบนหัวการ์ด
const LINEAGE_BRIEF = 3;
function lineageBrief(lineage) {
  const lines = lineageText(lineage.slice(-LINEAGE_BRIEF));
  if (lineage.length > LINEAGE_BRIEF) lines.unshift(`… ก่อนหน้านี้อีก ${lineage.length - LINEAGE_BRIEF} รุ่น`);
  return lines;
}

// การ์ดใบแรกของทุกชีวิต — เล่าเรื่อง ไม่มีตัวเลือก (หน้าจอให้ปุ่ม "ต่อไป")
// ค่าเริ่มที่แลกจากช่องพกสกิลที่ไม่ใช้ (ใบ 201 · decisions 359): บอกเป็นคำว่าค่าไหนเด่น ไม่มีตัวเลข · เส้นสายเป็นค่าซ่อน จึงเล่าเป็นคำคนพูด
const SPARE_WORDS = { health: 'ร่างกายแข็งแรงกว่าเด็กรุ่นเดียวกัน', happiness: 'อารมณ์ดี เลี้ยงง่าย', knowledge: 'หัวไว เรียนรู้เร็ว', relations: 'เป็นที่รักของคนรอบตัว', network: 'มีผู้ใหญ่เอ็นดูคอยช่วยเหลือ' };
// ได้ 0 ค่า (ทุกค่าเด่นเกินเกณฑ์อยู่แล้ว) — บรรทัดสำรอง ไม่สัญญาจำนวน ไม่ผัดไปชาติหน้า
const SPARE_NONE = 'ติดตัวมาแต่เกิด: เด็กคนนี้โดดเด่นรอบด้านอยู่แล้ว ช่องที่เว้นไว้จึงไม่มีอะไรเติมได้อีก';
const spareText = (keys) => (keys.length ? `ติดตัวมาแต่เกิด: ${keys.map((k) => SPARE_WORDS[k]).join(' · ')}` : SPARE_NONE);

function introCard(st, heir) {
  return {
    kind: 'intro',
    age: st.age,
    stage: stageOf(st.age),
    gen: st.gen,
    // ผู้สืบสายเลือด (B76) เริ่มกลางวัย — ไม่ได้เกิดใหม่ เล่าเป็นการรับช่วงชีวิตคนที่โตแล้ว
    text: st.age > 0
      ? `คุณเล่นต่อเป็น “${st.name}” วัย ${st.age} ปี ที่${provinceLabel(st)} ชื่อจริงว่า “${st.realName}”`
      : `คุณลืมตาดูโลกเป็นลูก${sexWord(st.sex)}ที่${provinceLabel(st)} ได้ชื่อจริงว่า “${st.realName}” ชื่อเล่นว่า “${st.name}”`,
    story: [familyText(st), eraText(st), ...(st.spare ? [spareText(st.spare)] : [])],
    // heir ที่ไม่มีรุ่นก่อน (harness สร้างทับค่าเกิดเฉย ๆ) ไม่มีอะไรให้สืบทอด
    inherit: heir && st.lineage.length ? inheritText(st, heir) : [],
    lineage: lineageBrief(st.lineage),
    choices: [],
  };
}

// ดวงไทยบรรทัดเดียวบนการ์ดเกิด (B55) — สีสันล้วน ไม่มีผลต่อเกม · หน้าจอเรียกตอนวาด ไม่ใส่ในการ์ด
// การ์ดจึงเหมือนก่อนมีดวงทุกช่อง · วันเกิดสุ่มจาก stream แยกของ seed ชีวิตนั้น ไม่กินเลขสุ่มของโลก
// ปีนักษัตรนับตามปีปฏิทิน ไม่ตัดที่สงกรานต์/ตรุษจีน — เกมไม่มีเดือนเกิดให้ตัดอยู่แล้ว
const WEEKDAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const ZODIAC = ['ชวด', 'ฉลู', 'ขาล', 'เถาะ', 'มะโรง', 'มะเส็ง', 'มะเมีย', 'มะแม', 'วอก', 'ระกา', 'จอ', 'กุน'];
function horoscope(st) {
  const ce = st.birthYear - 543;
  const jan1 = Date.UTC(ce, 0, 1);
  const days = (Date.UTC(ce + 1, 0, 1) - jan1) / 86400000;
  const day = makeRng(st.seed ^ 0x9b05688c).int(0, days - 1);
  const weekday = new Date(jan1 + day * 86400000).getUTCDay();
  return `เกิดวัน${WEEKDAYS[weekday]} ปี${ZODIAC[(((ce - 4) % 12) + 12) % 12]}`;
}

const placeLabel = (name) => (name.startsWith('กรุงเทพ') ? name : `ภาค${name}`);

// บรรทัดเล่าใต้หัวข้อการ์ดบ้านเมือง — เศรษฐกิจ/ภัยพิบัติเท่านั้น (MAP ไม่แตะการเมือง) · ภัยที่มีภาคเล่าต่างกันตามที่ผู้เล่นอยู่
function eraStory(st, e) {
  if (e.kind === 'economy') return 'เศรษฐกิจทั้งประเทศสะดุด ข้าวของแพง งานหายาก หลายบ้านต้องรัดเข็มขัด เงินเก็บและการลงทุนปีนี้ได้รับผลไปด้วย';
  if (!e.regions?.length) return 'ข่าวนี้อยู่ในความสนใจของคนทั้งประเทศ หลายบ้านต้องระวังตัวและปรับชีวิตตาม';
  if (e.regions.includes(st.region)) return `${areaLabel(st)}ที่คุณอยู่เป็นพื้นที่ที่โดนหนัก บ้านเรือนและการทำมาหากินของคนแถวนี้เสียหาย`;
  return `เหตุหนักอยู่ที่${e.regions.map(placeLabel).join(' ')} ข่าวความเสียหายไปถึงทั่วประเทศ`;
}

// ชีวิตแบบ… + ฉายาตามเงื่อนไข + ฉายาตระกูล (ใบ 04 · B10)
// คิดย้อนหลังตอนตายจากสิ่งที่ชีวิตนั้นเลือกจริง (st.log) + สถานะท้ายชีวิต — ไม่เก็บอะไรเพิ่มระหว่างเล่น ไม่ดึงเลขสุ่ม
// ห้ามอ่านยอดบัญชีบุญบาป (ledger) — แบบชีวิต/ฉายาขึ้นบนการ์ดตายก่อนปรโลกเฉลยบัญชี · อ่านได้เฉพาะป้ายของตัวเลือกที่ผู้เล่นกดเอง
// (การกระทำนั้นผู้เล่นเห็นในข้อความอยู่แล้ว) ไม่รวมยอด ไม่หักกลบ ไม่บอกฝั่งที่หนักกว่า






// ใบ 04: แบบชีวิตคิดจากเหตุการณ์ที่เกิดจริงหลังอายุ 18
const PATTERN_FROM = 18;
// ตัวเลือกหลัง 18 น้อยกว่านี้ = ข้อมูลไม่พอให้เห็นแบบชีวิต (ตายตอนเด็ก/วัยรุ่น)
const PATTERN_MIN_PICKS = 3;

const lv = (v) => (v ? Math.sign(v) * LEVELS[Math.abs(v)] / LEVELS[1] : 0);
const tags = (c) => (c?.merit ?? []).map((t) => ({ id: meritId(t.cat), level: t.level ?? 1 }));
const flagsOf = (c) => c?.sets_flags ?? [];

// ข้อความตัวเลือกที่ผู้เล่นเห็น — แกนบ้านเกิด↔ไปไกล ไม่มีกลไกย้ายถิ่นในแกนเกม จึงอ่านจากเรื่องที่เลือกเอง
const AWAY = /ย้าย|เข้ากรุง|ต่างประเทศ|เมืองนอก|ต่างจังหวัด|ลาออก|เปลี่ยนงาน|สมัครงาน|ไปเรียน|เรียนต่อ|ไปทำงาน|ไปลอง/;
const HOME = /กลับบ้าน|บ้านเกิด|อยู่กับพ่อ|อยู่กับแม่|ดูแลพ่อ|ดูแลแม่|พ่อแม่|ที่บ้าน|ช่วยงานบ้าน|สืบต่อ|ไม่ไปไหน|อยู่ที่เดิม/;

const indexCache = new WeakMap();
function eventIndex(content) {
  let m = indexCache.get(content);
  if (!m) indexCache.set(content, (m = new Map(content.events.map((e) => [e.id, e]))));
  return m;
}

// ตัวเลือกที่เลือกจริงตั้งแต่อายุ from · การ์ดจัดสรรเงินสร้างตัวเลือกตามปี จึงสร้างซ้ำจากปีนั้น
// การ์ดที่แกนสร้างเอง (หางาน · เรียนต่อ) ไม่อยู่ในเนื้อหา — งาน/วุฒิอ่านจากสถานะท้ายชีวิตแทน
function picksAfter(st, from = PATTERN_FROM) {
  const idx = eventIndex(st.content);
  const out = [];
  for (const l of st.log) {
    if (l.age < from) continue;
    if (l.id === 'alloc') {
      const o = allocOptions(st.content.era, st.birthYear + l.age)[l.choice];
      out.push({ age: l.age, alloc: o?.alloc ?? null, text: l.text });
      continue;
    }
    const ev = idx.get(l.id);
    // ใบลางภัยยุคเป็นเสียงเตือนที่ทุกคนได้ยิน (ออกตั้งแต่อายุ 6) ไม่ใช่ทางชีวิต — นับแล้วแกนเสี่ยง/บ้านเกิดของเด็กเอียงจนแบบชีวิตสั้นหาย
    // การ์ดบรรยากาศ (ambient · เทศกาล) ทุกคนเจอตามปฏิทิน ไม่ได้บอกทางชีวิต — ข้ามด้วยเหตุผลเดียวกับใบลาง
    if (ev?.herald_of || ev?.ambient) continue;
    const c = ev?.choices[l.choice];
    if (c) out.push({ age: l.age, ev, c, text: l.text });
  }
  return out;
}

// คะแนนดิบ 4 แกน (ใบ 04) บวก = ขั้วหลัง · แต่ละแกนคิดจากสิ่งที่ต่างกัน ไม่ใช้ตัวเดียวกันซ้ำสองแกนเท่าที่ทำได้
// ① ครอบครัว(−) ↔ งาน(+) · ② บ้านเกิด(−) ↔ ไปไกล(+) · ③ มั่นคง(−) ↔ เสี่ยง(+) · ④ ทางโลก(−) ↔ ทางธรรม(+)
// แยกส่วนที่ไม่อ่านป้ายบุญบาปออกมา ให้สรุปช่วงวัย (stageSummary) ใช้ได้โดยไม่เผยบัญชี · คืน false = การ์ดจัดสรรเงิน (ไม่มีตัวเลือกเนื้อหา)
// ลำดับการบวกต้องเหมือนเดิม — axisRaw ผลต่างแม้ทศนิยมท้าย ๆ ทำให้ชีวิตที่อยู่ขอบแกนเปลี่ยนแบบชีวิต
function pickBase(a, p) {
  if (p.alloc !== undefined) {
    // คงแบบเดิม (null) ไม่นับ · ส่วนที่ไม่อยู่ในเงินฝาก/เงินสด = ส่วนที่เสี่ยง
    if (!p.alloc) return false;
    const safe = (p.alloc.deposit ?? 0) + (p.alloc.cash ?? 0);
    a.risk += safe >= 1 ? -1 : 2 * (1 - safe);
    return false;
  }
  const c = p.c;
  const fx = c.effects ?? {};
  a.work += lv(fx.network) + 0.5 * lv(fx.knowledge) - lv(fx.relations);
  if (fx.income_mult) a.work += fx.income_mult > 1 ? 1.5 : -0.5;
  if (fx.job) a.work += 1;
  if (AWAY.test(p.text)) a.away += 1.5;
  if (HOME.test(p.text)) a.away -= 1.5;
  if (c.outcomes?.length) a.risk += { เสี่ยงต่ำ: 0.5, เสี่ยงกลาง: 1, เสี่ยงสูง: 2 }[riskLabel(c.outcomes)] * (c.outcomes.some((o) => o.ok) ? 0.5 : 1);
  else a.risk -= 0.4;
  if (fx.invest) a.risk += 2 * fx.invest.share;
  if (fx.debt) a.risk += 1;
  if (fx.settle) a.risk -= 1;
  const m = fx.money;
  if (m && (typeof m === 'number' ? m : m.amount) > 0) a.dhamma -= 0.5;
  return true;
}
function pickFlags(a, c) {
  for (const f of flagsOf(c)) {
    if (f === 'has_kids' || f === 'married' || f === 'raised_grandkids') a.work -= 2;
    if (f === 'own_business' || f === 'online_seller') a.work += 1;
    if (f === 'own_business' || f === 'guarantor' || f === 'loan_shark') a.risk += 1;
    if (f === 'lottery_habit') { a.risk += 2; a.dhamma -= 1; }
    if (f === 'has_insurance') a.risk -= 2;
    if (f === 'home_owner') { a.risk -= 1; a.away -= 1; }
    if (f === 'took_bribe' || f === 'embezzler') a.dhamma -= 2;
  }
}

function axisRaw(st) {
  const picks = picksAfter(st);
  const a = { work: 0, away: 0, risk: 0, dhamma: 0 };
  for (const p of picks) {
    if (!pickBase(a, p)) continue;
    const c = p.c;
    for (const t of tags(c)) {
      if (t.id === 'dana' || t.id === 'sila' || t.id === 'bhavana') a.dhamma += t.level;
      else if (t.id === 'care_parents') {
        a.dhamma += 0.5 * t.level;
        a.work -= t.level;
        a.away -= t.level;
      } else if (t.id === 'help_others') a.dhamma += 0.5 * t.level;
      else if (SIN_CATS.includes(t.id) && t.id !== 'vow_broken') a.dhamma -= t.level;
    }
    pickFlags(a, c);
  }
  // งานที่ทำ: ทิ้งอาชีพของครอบครัว = ไปไกล · สืบอาชีพครอบครัว = อยู่บ้านเกิด · เรียนจบสูง = ออกจากบ้านไปเรียน
  if (st.workFrom !== null) a.away += st.occupation === st.familyOcc ? -2 : 2;
  if (st.edu === 'อุดมศึกษา') a.away += 1;
  return { ...a, picks: picks.length };
}

// ค่ากลาง/ช่วงของแต่ละแกนหลังหารด้วย √จำนวนตัวเลือก — ชีวิตยาวเลือกมากกว่า คะแนนดิบจึงกว้างกว่าโดยไม่ได้เอียงกว่า
// ค่าตั้งจาก harness (npm run titles พิมพ์ค่าที่ควรเป็นทุกรอบ) · cut = มัธยฐาน แบบชีวิต 16 แบบจึงกระจายใกล้กัน · scale = ครึ่ง IQR
const AXES = [
  { id: 'work', cut: -0.633, scale: 0.751 },
  { id: 'away', cut: 0.186, scale: 0.386 },
  { id: 'risk', cut: 1.401, scale: 0.528 },
  { id: 'dhamma', cut: 0.316, scale: 0.371 },
];
// "ครึ่ง ๆ" (ใบ 04): แกนที่ |z| ต่ำกว่า NEAR นับว่าใกล้ศูนย์ · ใกล้ศูนย์ตั้งแต่ HALF_AXES แกนขึ้นไป = ครึ่ง ๆ
const NEAR = 0.3;
const HALF_AXES = 3;

const axisZ = (raw) => AXES.map((a) => (raw[a.id] / Math.sqrt(raw.picks) - a.cut) / a.scale);

// สรุปภาพรวมสิ่งที่เลือกในช่วงวัย (B21) บนการ์ดเปลี่ยนช่วง — ใช้แค่ 3 แกนที่ไม่แตะป้ายบุญบาป
// แกนทางโลก/ทางธรรมคิดจากป้ายบุญบาป ใช้ไม่ได้ (เผยบัญชีก่อนปรโลก) · care_parents ก็เป็นป้ายบุญ จึงไม่นับในแกนครอบครัว
// เด็กยังไม่ทำงาน ขั้วงานของแกนแรกจึงเล่าเป็นเรื่องเรียน/เพื่อนแทน
const KID_STAGES = ['เด็ก', 'วัยรุ่น'];
// [มัธยฐาน, ครึ่ง IQR] ของคะแนน ÷ √จำนวนตัวเลือก ต่อช่วงวัย จากบอทสุ่ม — AXES ตั้งจากทั้งชีวิต (รวมงาน/วุฒิท้ายชีวิต)
// ใช้กับช่วงเดียวแล้วเอียงทั้งก้อน · LEAN 1 = นอกครึ่งกลางของบอทสุ่ม จึงขึ้นราวครึ่งหนึ่งของการ์ดต่อแกน
// แกนบ้านเกิด/ไปไกลอ่านจากคำในข้อความ หลายช่วงไม่มีเลยจน IQR = 0 — พื้น SCALE_MIN กันหารศูนย์ และให้เอ่ยเมื่อเลือกเรื่องนั้นชัด ๆ
const STAGE_AXES = {
  เด็ก: { work: [-0.177, 0.677], away: [0, 0.556], risk: [-0.133, 0.321] },
  วัยรุ่น: { work: [0.612, 0.486], away: [0, 0], risk: [-0.189, 0.313] },
  หนุ่มสาว: { work: [-0.433, 0.69], away: [0, 0.226], risk: [0.633, 0.486] },
  ทำงาน: { work: [0.151, 0.472], away: [0, 0.217], risk: [0.529, 0.55] },
  กลางคน: { work: [0, 0.634], away: [0, 0], risk: [0.35, 0.5] },
  ชรา: { work: [-0.874, 0.613], away: [0, 0.194], risk: [0.635, 0.495] },
};
const SCALE_MIN = 0.3;
const LEAN = 1;
const SUMMARY_AXES = [
  { id: 'work', pos: 'ทุ่มให้งานมากกว่าครอบครัว', neg: 'ให้เวลาครอบครัวมากกว่างาน', kidPos: 'ใส่ใจเรื่องเรียนและเพื่อนมากกว่าเรื่องในบ้าน', kidNeg: 'อยู่ใกล้คนในบ้านมากกว่าออกไปหาเพื่อน' },
  { id: 'away', pos: 'ออกไปไกลจากบ้านเกิด', neg: 'อยู่ใกล้บ้านเกิด' },
  { id: 'risk', pos: 'เลือกทางเสี่ยงมากกว่ามั่นคง', neg: 'เลือกทางมั่นคงมากกว่าเสี่ยง' },
];
// เรื่องเด่น = ตัวเลือกที่ผลบนการ์ดแรงที่สุด (ป้ายที่ผู้เล่นเห็น) · ต่ำกว่า HIGHLIGHT_MIN ไม่นับว่าเด่น
const HIGHLIGHT_MIN = 3;
const HIGHLIGHTS = 3;
function pickWeight(c) {
  const fx = c.effects ?? {};
  let s = 0;
  for (const k of ['health', 'happiness', 'knowledge', 'relations', 'network']) s += Math.abs(fx[k] ?? 0);
  for (const v of Object.values(fx.chronic ?? {})) s += Math.abs(v);
  if (fx.money) s += 2;
  if (fx.income_mult) s += 2;
  if (fx.invest || fx.debt || fx.settle) s += 2;
  if (fx.job) s += 1;
  s += 1.5 * flagsOf(c).length;
  if (c.outcomes?.length && riskLabel(c.outcomes) === 'เสี่ยงสูง') s += 2;
  return s;
}

function stageSummary(st, stage, fromAge, toAge) {
  const picks = picksAfter(st, fromAge).filter((p) => p.age <= toAge);
  const a = { work: 0, away: 0, risk: 0, dhamma: 0 };
  const scored = [];
  for (const p of picks) {
    if (!pickBase(a, p)) continue;
    pickFlags(a, p.c);
    scored.push({ age: p.age, text: p.text, w: pickWeight(p.c) });
  }
  const kid = KID_STAGES.includes(stage);
  const lines = [];
  const norm = {};
  for (const ax of SUMMARY_AXES) norm[ax.id] = picks.length ? a[ax.id] / Math.sqrt(picks.length) : 0;
  const ref = STAGE_AXES[stage];
  if (picks.length && ref) {
    for (const ax of SUMMARY_AXES) {
      const z = (norm[ax.id] - ref[ax.id][0]) / Math.max(SCALE_MIN, ref[ax.id][1]);
      if (Math.abs(z) < LEAN) continue;
      lines.push(z > 0 ? (kid && ax.kidPos) || ax.pos : (kid && ax.kidNeg) || ax.neg);
    }
    if (!lines.length) lines.push('เลือกแบบพอดี ๆ ไม่เอียงไปทางไหนชัด');
  }
  // เสมอกันเอาเรื่องหลัง — ใกล้ตอนเปลี่ยนช่วงกว่า ผู้เล่นจำได้
  const highlights = scored
    .filter((x) => x.w >= HIGHLIGHT_MIN)
    .sort((x, y) => y.w - x.w || y.age - x.age)
    .slice(0, HIGHLIGHTS)
    .sort((x, y) => x.age - y.age)
    .map(({ age, text }) => ({ age, text }));
  return { lines, highlights, norm };
}

// 16 แบบ: id = ขั้วของแกน ①②③④ ตามลำดับ (F ครอบครัว/W งาน · H บ้านเกิด/A ไปไกล · S มั่นคง/R เสี่ยง · L ทางโลก/D ทางธรรม)
// ชื่อเป็นภาพไทย (ใบ 04: ต้นไม้ · แม่น้ำ · วัด · ตลาด) · ไม่มีแบบไหนดีกว่าแบบอื่น — คำใบ้เล่าทาง ไม่ตัดสิน
const PATTERNS = [
  { id: 'FHSL', name: 'ต้นมะม่วงหน้าบ้าน', hint: 'อยู่ใกล้คนในบ้าน ปลูกอะไรไว้ให้ลูกหลานเก็บกินได้นาน' },
  { id: 'FHSD', name: 'ต้นโพธิ์ลานวัด', hint: 'ร่มเงาของหมู่บ้าน ไม่ไปไหน และเป็นที่พักใจของคนรอบตัว' },
  { id: 'FHRL', name: 'แผงตลาดนัดหน้าบ้าน', hint: 'ลุ้นทุกวันเพื่อคนในบ้าน ไม่ทิ้งถิ่น' },
  { id: 'FHRD', name: 'เรือจ้างข้ามฟาก', hint: 'พายฝ่าน้ำเชี่ยวไปกลับฝั่งเดิม ส่งคนอื่นถึงที่หมาย' },
  { id: 'FASL', name: 'คลองส่งน้ำ', hint: 'ไหลไปไกลจากต้นทาง แต่ทุกหยดกลับไปเลี้ยงคนที่บ้าน' },
  { id: 'FASD', name: 'ระฆังวัดต่างถิ่น', hint: 'ไปอยู่ไกล แต่เสียงยังเรียกคนในครอบครัวให้ใจสงบ' },
  { id: 'FARL', name: 'รถทัวร์สายเหนือ-ใต้', hint: 'ออกไปเสี่ยงไกลบ้าน เพื่อส่งเงินกลับไปหาคนที่รัก' },
  { id: 'FARD', name: 'เรือกอและกลางทะเล', hint: 'ออกไกลฝ่าคลื่น เชื่อในสิ่งที่มองไม่เห็น เพื่อคนบนฝั่ง' },
  { id: 'WHSL', name: 'ร้านโชห่วยหัวมุม', hint: 'ทำงานหนักอยู่ที่เดิมทุกวัน ไม่รีบ ไม่เสี่ยง' },
  { id: 'WHSD', name: 'หอระฆังไม้สัก', hint: 'ทำหน้าที่ของตัวเองอยู่ที่เดิมอย่างเที่ยงตรง' },
  { id: 'WHRL', name: 'สนามไก่ชนท้ายหมู่บ้าน', hint: 'ไม่ไปไหน แต่ไม่เคยหยุดลุ้น' },
  { id: 'WHRD', name: 'ตะเกียงเจ้าพายุ', hint: 'สว่างแรงที่บ้านเกิด กล้าเสี่ยงแต่ไม่ทิ้งหลักใจ' },
  { id: 'WASL', name: 'รางรถไฟสายใต้', hint: 'วิ่งไกลบนทางที่วางไว้แล้ว มั่นคงทีละสถานี' },
  { id: 'WASD', name: 'ธุดงค์ในเมืองหลวง', hint: 'ไปไกลเพื่องาน แต่เดินทางของตัวเองอย่างสงบ' },
  { id: 'WARL', name: 'เจ้าพระยาหน้าน้ำ', hint: 'ไหลแรง ไปไกล เสี่ยงล้นตลิ่ง แต่พาของไปได้มาก' },
  { id: 'WARD', name: 'ว่าวจุฬากลางสนามหลวง', hint: 'ทะยานสูงไกลบ้าน กล้าเสี่ยง และยังมีสายผูกใจไว้' },
];
const HALF = { id: 'HALF', name: 'น้ำครึ่งแก้ว', hint: 'ไม่สุดทางไหนเลย ทุกทางพอดี ๆ' };
// ชีวิตสั้น: ตายหรือหายตัวก่อนมีตัวเลือกหลังอายุ 18 พอให้เห็นแบบชีวิตผู้ใหญ่ — ผู้เล่นยังควรได้ชื่อชีวิตจริงแทน "ยังบอกไม่ได้"
// อ่านตัวเลือกตั้งแต่เกิดด้วย 2 แกนที่ไม่แตะป้ายบุญบาป เทียบค่ากลางวัยเด็ก/วัยรุ่นของบอทสุ่ม (STAGE_AXES)
// ① ใกล้คนในบ้าน(H) ↔ ออกไปหาเรื่องเรียน/เพื่อน(O) · ② มั่นคง(S) ↔ เสี่ยง(R) · ไม่ทันมีตัวเลือกเลยได้แบบของตัวเอง
// หายตัวก่อนมีตัวเลือกหลัง 18 พอ ไม่เกิดในบอททุกสาย จึงไม่มีแบบแยก (ของสะสมที่ไม่มีใครได้)
// ชื่อเป็นภาพไทยแบบเดียวกับแบบผู้ใหญ่ · เล่าทาง ไม่สงสารหรือตัดสิน
const SHORT_PATTERNS = [
  { id: 'K0', name: 'เทียนเล่มเล็ก', hint: 'จุดได้ไม่นาน แต่คนข้างตัวยังจำแสงนั้นได้' },
  { id: 'KHS', name: 'ดอกมะลิริมรั้ว', hint: 'อยู่ใกล้คนในบ้าน เรียบง่าย หอมอ่อน ๆ' },
  { id: 'KHR', name: 'ลูกนกหัดบิน', hint: 'กล้าลองทั้งที่ยังอยู่ใกล้รัง' },
  { id: 'KOS', name: 'สมุดปกแข็ง', hint: 'ตั้งใจเรียน เดินตามที่วางไว้ทีละหน้า' },
  { id: 'KOR', name: 'ลูกโป่งงานวัด', hint: 'ลอยไปหาเรื่องสนุกก่อนใคร ไม่กลัวลม' },
];
const ALL_PATTERNS = [...PATTERNS, HALF, ...SHORT_PATTERNS];
const POLES = [['F', 'W'], ['H', 'A'], ['S', 'R'], ['L', 'D']];

function shortPattern(st) {
  const find = (id) => SHORT_PATTERNS.find((p) => p.id === id);
  const picks = picksAfter(st, 0).filter((p) => p.age < PATTERN_FROM);
  const a = { work: 0, away: 0, risk: 0, dhamma: 0 };
  let n = 0;
  for (const p of picks) {
    if (!pickBase(a, p)) continue;
    pickFlags(a, p.c);
    n++;
  }
  if (!n) return find('K0');
  const ref = STAGE_AXES[KID_STAGES.includes(stageOf(st.age)) ? stageOf(st.age) : KID_STAGES.at(-1)];
  const z = (k) => (a[k] / Math.sqrt(n) - ref[k][0]) / Math.max(SCALE_MIN, ref[k][1]);
  return find(`K${z('work') > 0 ? 'O' : 'H'}${z('risk') > 0 ? 'R' : 'S'}`);
}

// ชีวิตแบบไหน · ตัวเลือกหลังอายุ 18 ไม่พอ = แบบชีวิตสั้น
function patternOf(st, raw = axisRaw(st)) {
  if (raw.picks < PATTERN_MIN_PICKS) return shortPattern(st);
  const z = axisZ(raw);
  if (z.filter((v) => Math.abs(v) < NEAR).length >= HALF_AXES) return HALF;
  const id = z.map((v, i) => POLES[i][v > 0 ? 1 : 0]).join('');
  return PATTERNS.find((p) => p.id === id);
}

// ระดับเรียงหายากก่อน — บันทึกการตายโชว์ 3 ตัวแรก · ภาพแชร์ใช้ตัวแรก
const TIERS = ['ตำนาน', 'หายาก', 'ทั่วไป'];

// อาชีพครอบครัวที่ไม่ต้องใช้ปริญญา — ลูกจบมหาวิทยาลัย = คนแรกของบ้าน
const LOW_FAMILY_OCC = ['farmer', 'labor', 'factory', 'craft'];
// ข้อเท็จจริงท้ายชีวิตที่ฉายาทุกตัวอ่าน — คิดครั้งเดียว · ไม่มียอดบัญชีบุญบาป
function lifeFacts(st) {
  const era = st.content.era;
  const picks = picksAfter(st, 0);
  const tagCount = {};
  let sinPicks = 0, declined = 0;
  for (const p of picks) {
    if (!p.c) continue;
    const ids = tags(p.c).map((t) => t.id);
    for (const id of ids) tagCount[id] = (tagCount[id] ?? 0) + 1;
    if (ids.some((id) => SIN_CATS.includes(id))) sinPicks++;
    // มีทางผิดให้เลือกแต่ไม่เลือก
    else if (p.ev.choices.some((c) => tags(c).some((t) => SIN_CATS.includes(t.id)))) declined++;
  }
  // เหตุบ้านเมืองที่ทันตอนเป็นผู้ใหญ่ นับเฉพาะกลุ่มที่ขึ้นการ์ดให้เห็น — ปีที่กลุ่มเหตุถูกซ่อน (ออกแล้ว/เว้นช่วง) ผู้เล่นไม่รู้ว่ารอดอะไรมา
  const crises = new Set(), disasters = new Set();
  for (const { e, age } of erasShown(st, st.age)) if (age >= 20) (e.kind === 'economy' ? crises : disasters).add(e.id);
  const worth = netWorth(st);
  return {
    st,
    age: st.age,
    clsIdx: CLASSES.indexOf(st.cls),
    flags: st.flags,
    tagCount,
    sinPicks,
    declined,
    crises: crises.size,
    disasters: disasters.size,
    worth,
    debt: totalDebt(st),
    // ทรัพย์สุทธิเป็นจำนวนเท่าของรายได้ครัวเรือนทั้งปีของประเทศ — เทียบข้ามยุคได้
    wealth: worth / (nationalIncome(era, st.seed, st.birthYear + st.age) * 12),
    workYears: st.workFrom === null ? 0 : Math.max(0, Math.min(st.age, RETIRE_AGE) - st.workFrom),
    expected: expectedDeathAge(era, st.sex, st.birthYear, st.seed),
  };
}

const has = (f, ...k) => k.some((x) => f.flags[x]);
// ฉายาตามเงื่อนไข (ใบ 04) — ทุกตัวตรวจแยกกัน ได้หลายตัวพร้อมกัน ไม่มีลำดับ · ด้านลบใช้คำเห็นใจ ไม่ตำหนิ
// harness ต้องพิสูจน์ทุกตัว ≥0.1% · ระดับตั้งจากอัตราที่วัดได้ (ทั่วไป >10% · หายาก 1.5–10% · ตำนาน <1.5% รวมทุกบุคลิก) ไม่ใช่ความยากที่คิดเอา
const TITLES = [
  { id: 'hard_worker', tier: 'ทั่วไป', name: 'มือไม่เคยว่าง', hint: 'ทำงานยาวนานหลายสิบปี', test: (f) => f.workYears >= 40 },
  { id: 'boss', tier: 'ทั่วไป', name: 'เถ้าแก่ตัวเล็ก', hint: 'เคยเปิดกิจการของตัวเอง', test: (f) => has(f, 'own_business') },
  { id: 'vendor', tier: 'ทั่วไป', name: 'คนค้าขายหัวใจสู้', hint: 'หาเลี้ยงชีพด้วยการค้าขายรายวัน', test: (f) => has(f, 'street_vendor', 'online_seller') },
  { id: 'grateful', tier: 'ทั่วไป', name: 'ลูกกตัญญู', hint: 'เลือกดูแลพ่อแม่ซ้ำแล้วซ้ำอีก', test: (f) => (f.tagCount.care_parents ?? 0) >= 2 },
  { id: 'giver', tier: 'ทั่วไป', name: 'มือที่ไม่เคยหุบ', hint: 'ให้ทานบ่อยจนเป็นนิสัย', test: (f) => (f.tagCount.dana ?? 0) >= 3 },
  { id: 'parent', tier: 'ทั่วไป', name: 'พ่อแม่ของใครสักคน', hint: 'มีลูกให้ห่วง', test: (f) => has(f, 'has_kids') },
  { id: 'storm', tier: 'ทั่วไป', name: 'ผ่านมรสุมเศรษฐกิจ', hint: 'เป็นผู้ใหญ่ทันวิกฤตเศรษฐกิจหลายครั้ง', test: (f) => f.crises >= 2 },
  { id: 'homeowner', tier: 'ทั่วไป', name: 'มีบ้านเป็นของตัวเอง', hint: 'ได้บ้านมาด้วยน้ำพักน้ำแรง', test: (f) => has(f, 'home_owner') },
  { id: 'runner', tier: 'ทั่วไป', name: 'นักวิ่งตอนเช้า', hint: 'ดูแลร่างกายเป็นกิจวัตร', test: (f) => has(f, 'sporty') },
  { id: 'first_grad', tier: 'หายาก', name: 'บัณฑิตคนแรกของบ้าน', hint: 'เรียนจบสูงกว่าที่บ้านเคยมีใครได้', test: (f) => f.st.edu === 'อุดมศึกษา' && LOW_FAMILY_OCC.includes(f.st.familyOcc) },
  { id: 'debt_bearer', tier: 'ทั่วไป', name: 'ผู้แบกหนี้จนวันสุดท้าย', hint: 'ยังผ่อนไม่หมดจนวันที่จากไป', test: (f) => f.debt > 0 || f.worth < 0 },
  { id: 'scarred', tier: 'หายาก', name: 'แผลในใจที่ผ่านมาได้', hint: 'เคยถูกรังแก แต่จากไปอย่างมีความสุข', test: (f) => has(f, 'bullied') && f.st.happiness >= 75 },
  { id: 'kind_fooled', tier: 'ทั่วไป', name: 'ใจดีจนโดนหลอก', hint: 'ไว้ใจคนผิดเรื่องเงิน', test: (f) => has(f, 'ponzi_victim') },
  // caught_fraud = ทุจริตเองแล้วถูกจับ/ไล่ออก — แยกจากฉายาเหยื่อ ใช้คำเห็นใจแบบเดียวกับด้านลบตัวอื่น
  { id: 'stumbled', tier: 'หายาก', name: 'ผู้เคยก้าวพลาด', hint: 'เคยถูกจับได้เพราะเลือกทางลัด', test: (f) => has(f, 'caught_fraud') },
  { id: 'guarantor', tier: 'หายาก', name: 'ผู้แบกหนี้แทนคนอื่น', hint: 'เซ็นค้ำให้คนที่ไว้ใจ', test: (f) => has(f, 'guarantor') },
  { id: 'lone_walker', tier: 'หายาก', name: 'ผู้เดินทางคนเดียว', hint: 'อยู่จนแก่โดยไม่มีครอบครัวของตัวเอง', test: (f) => f.age >= 70 && !has(f, 'has_kids', 'married') && f.st.relations < 20 },
  { id: 'comeback', tier: 'ตำนาน', name: 'ล้มแล้วลุก', hint: 'ล้มละลายแล้วกลับมามีเงินเหลือ', test: (f) => f.st.bankruptcies >= 1 && f.debt <= 0 && f.worth >= 0 },
  { id: 'quiet_rich', tier: 'หายาก', name: 'เศรษฐีเงียบ', hint: 'เกิดไม่สูง แต่จากไปพร้อมทรัพย์ก้อนใหญ่', test: (f) => f.clsIdx <= 4 && f.wealth >= 10 },
  { id: 'folk_sage', tier: 'หายาก', name: 'ปราชญ์ชาวบ้าน', hint: 'รู้มากโดยไม่ต้องมีปริญญา', test: (f) => f.st.knowledge >= 95 && (!f.st.edu || f.st.edu === 'ประถม') },
  { id: 'outlived', tier: 'หายาก', name: 'อายุยืนเกินคาด', hint: 'อยู่นานกว่าคนรุ่นเดียวกันมาก', test: (f) => f.age >= f.expected + 25 },
  { id: 'clean_hands', tier: 'หายาก', name: 'มือสะอาดในที่สกปรก', hint: 'เจอทางลัดหลายครั้งแต่ไม่เคยเลือก', test: (f) => f.declined >= 10 && f.sinPicks === 0 },
  { id: 'survivor', tier: 'ทั่วไป', name: 'รอดมาได้ทุกภัย', hint: 'ผ่านภัยพิบัติใหญ่มาหลายครั้ง', test: (f) => f.disasters >= 3 },
  { id: 'lucky_number', tier: 'ทั่วไป', name: 'ผู้รอเลขเด็ด', hint: 'ซื้อหวยจนเป็นนิสัย', test: (f) => has(f, 'lottery_habit') },
  { id: 'grandparent', tier: 'หายาก', name: 'ผู้เลี้ยงหลานแทนพ่อแม่', hint: 'รับหลานมาเลี้ยงเอง', test: (f) => has(f, 'raised_grandkids') },
  { id: 'centenarian', tier: 'ตำนาน', name: 'ร้อยปีไม่สาย', hint: 'อยู่ถึงร้อยปี', test: (f) => f.age >= 100 },
  { id: 'rags_riches', tier: 'ตำนาน', name: 'จากศูนย์สู่เศรษฐี', hint: 'เกิดลำบากที่สุด จากไปพร้อมทรัพย์มหาศาล', test: (f) => f.clsIdx <= 2 && f.wealth >= 20 },
  { id: 'never_dark', tier: 'หายาก', name: 'ผู้ไม่เคยเลือกทางมืด', hint: 'ทั้งชีวิตไม่เคยเลือกทางผิดเลยสักครั้ง', test: (f) => f.age >= 60 && f.sinPicks === 0 && f.declined >= 11 },
  { id: 'peaceful', tier: 'ตำนาน', name: 'จากไปอย่างสงบ', hint: 'แก่เฒ่า ไม่มีหนี้ มีคนรักรายล้อม และมีความสุข', test: (f) => f.age >= 80 && f.debt <= 0 && f.worth >= 0 && f.st.relations >= 70 && f.st.happiness >= 70 && has(f, 'has_kids') },
];

// ฉายาตระกูล (ใบ 04) — ข้ามรุ่น · ch = ผังตระกูลรุ่นก่อน + ชีวิตนี้ · lin = รุ่นก่อนเท่านั้น
// ภูมิ/ทางเกิดของชีวิตนี้ยังไม่รู้ตอนตาย จึงนับจากรุ่นก่อน
const CLIMB = { from: 2, to: 6 };
const climb = (ch) => {
  const lo = ch.findIndex((l) => CLASSES.indexOf(l.cls) <= CLIMB.from);
  return lo >= 0 && ch.slice(lo + 1).some((l) => CLASSES.indexOf(l.cls) >= CLIMB.to);
};
const lastN = (xs, n, ok) => xs.length >= n && xs.slice(-n).every(ok);
// เป้าตระกูล (B95b · เจ้าของเคาะ) — ได้ฉายาทุกรุ่นที่ยังเข้าเงื่อนไข · ชื่อเสียง +1 ครั้งเดียวต่อตระกูล (afterlife.mjs นับจาก lineage[].goals)
// ฐานะตอนตายอ่านจากจุดท้ายของ standing · rags = เกิดชั้น 1–2 แล้วภายในสามรุ่น (นับรุ่นนั้นด้วย) มีคนตายในฐานะ 9–10
const deathCls = (l) => l.standing?.at(-1)?.cls ?? CLASSES.indexOf(l.cls);
// service = รับราชการสายที่มีบำนาญ (พลเรือน ทหาร ตำรวจ) · office 2 = นายก อบต.
const RAGS = { from: 1, to: 8, within: 3 };
const runOf = (ch, n, ok) => ch.some((_, i) => i + n <= ch.length && ch.slice(i, i + n).every(ok));
const rags = (ch) => ch.some((l, i) => CLASSES.indexOf(l.cls) <= RAGS.from && ch.slice(i, i + RAGS.within).some((m) => deathCls(m) >= RAGS.to));
const FAMILY_GOALS = [
  { id: 'goal_rags', name: 'จากยากไร้สู่มั่งคั่ง', hint: 'รุ่นที่เกิดมายากไร้ ภายในสามรุ่นมีคนจากไปอย่างมั่งคั่ง', test: (ch) => rags(ch) },
  { id: 'goal_service', name: 'สามรุ่นรับราชการ', hint: 'สามรุ่นติดกันรับราชการจนมีบำนาญ', test: (ch) => runOf(ch, 3, (l) => l.service) },
  { id: 'goal_politics', name: 'ตระกูลการเมือง', hint: 'สองรุ่นได้ตำแหน่งตั้งแต่นายก อบต. ขึ้นไป', test: (ch) => ch.filter((l) => (l.office ?? -1) >= 2).length >= 2 },
  { id: 'goal_great', name: 'ตระกูลใหญ่', hint: 'ชื่อเสียงตระกูลขึ้นถึงขั้นสูงสุด', test: (ch) => ch.some((l) => (l.fame ?? 0) >= 3) },
];
// ผังตระกูลรวมชีวิตนี้ตอนตาย — แถวท้ายมีฐานะตอนตาย (ตายพร้อมหนี้ = 0) กับชื่อเสียงที่รับมา
const familyChain = (st, broke) => [...st.lineage.filter((l) => !l.isekai), { gen: st.gen, sex: st.sex, cls: st.cls, age: st.age, broke, fame: st.fame ?? 0, standing: [{ age: st.age, cls: broke ? 0 : standingOf(st) }], ...(st.officeTop >= 0 && { office: st.officeTop }), ...(ladderOf(st)?.pension && { service: true }) }];
const goalsMet = (st, broke) => {
  const ch = familyChain(st, broke);
  const had = new Set(st.lineage.flatMap((l) => l.goals ?? []));
  return FAMILY_GOALS.filter((g) => !had.has(g.id) && g.test(ch)).map((g) => g.id);
};
const FAMILY_TITLES = [
  { id: 'fam_climb', name: 'ตระกูลไต่บันได', hint: 'จากรุ่นที่ลำบาก ลูกหลานไต่ขึ้นไปถึงชนชั้นกลางบน', test: (ch) => climb(ch) },
  { id: 'fam_no_hell', name: 'บรรพบุรุษไม่เคยตกนรก', hint: 'สองรุ่นก่อนหน้าไม่มีใครไปภูมินรก', test: (ch, lin) => lastN(lin, 2, (l) => l.realm !== 'นรก') },
  { id: 'fam_debt', name: 'หนี้ที่ส่งต่อกันมาสามรุ่น', hint: 'สามรุ่นติดกันจากไปพร้อมหนี้', test: (ch) => lastN(ch, 3, (l) => l.broke) },
  { id: 'fam_long', name: 'ตระกูลอายุยืน', hint: 'สามรุ่นติดกันอยู่ถึงแปดสิบ', test: (ch) => lastN(ch, 3, (l) => l.age >= 80) },
  { id: 'fam_guardian', name: 'ผีบรรพบุรุษเฝ้าบ้าน', hint: 'รุ่นก่อนกลับมาเกิดเป็นลูกหลานของตัวเอง', test: (ch, lin) => lastN(lin, 1, (l) => l.path === 'child') },
  { id: 'fam_wander', name: 'ดวงวิญญาณพเนจร', hint: 'สองรุ่นติดกันไปเกิดใหม่ที่อื่น', test: (ch, lin) => lastN(lin, 2, (l) => l.path === 'reborn') },
  { id: 'fam_deva', name: 'ตระกูลมีเทวดา', hint: 'มีบรรพบุรุษไปเกิดเป็นเทวดาอย่างน้อยสองรุ่น', test: (ch, lin) => lin.filter((l) => l.realm === 'เทวดา').length >= 2 },
];

// ผลรวมของชีวิตนี้ที่การ์ดตาย/สมุดฉายาใช้ · titles เรียงหายากก่อน (ลำดับใน TITLES ภายในระดับเดียวกัน)
function titlesOf(st) {
  const raw = axisRaw(st);
  const pattern = patternOf(st, raw);
  const f = lifeFacts(st);
  const pick = ({ id, name, tier, hint }) => ({ id, name, tier, hint });
  const titles = TITLES.filter((t) => t.test(f)).sort((a, b) => TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier)).map(pick);
  // แถวต่างโลก (B68) ไม่มีฐานะ/อายุ/ภูมิแบบชาติไทย — ฉายาตระกูลนับเฉพาะชาติไทย
  const thai = st.lineage.filter((l) => !l.isekai);
  const chain = familyChain(st, f.worth < 0);
  const family = [...FAMILY_TITLES, ...FAMILY_GOALS].filter((t) => t.test(chain, thai)).map(({ id, name, hint }) => ({ id, name, tier: 'ตระกูล', hint }));
  return { pattern: pattern && { id: pattern.id, name: pattern.name, hint: pattern.hint }, titles, family };
}

// เซฟแบบภาพถ่ายสถานะ (B128): เก็บสถานะชีวิตจริงแทน seed + ลำดับปุ่ม — อัปเดตเนื้อหาแล้วชีวิตที่ค้างยังเล่นต่อได้
// เดินทั้งก้อนครั้งเดียว: เนื้อหาเกมไม่เก็บ (ผูกกลับตอนโหลด) · การ์ดเนื้อหาเก็บแค่ id · ตัวสุ่มเก็บสถานะภายใน
// object ที่ถูกอ้างหลายที่ (af.st = st · kinLoss ชี้คนใน kin · thaiVerdict) เก็บครั้งเดียวแล้วอ้างด้วยเลข — ต่อกลับเป็นตัวเดียวกัน




const SNAP_V = 1;
const isRng = (v) => typeof v.next === 'function' && typeof v.int === 'function';

function snapshot(root, content) {
  const events = new Set(content.events);
  const seen = new Map();
  const count = (v) => {
    if (v === null || typeof v !== 'object' || v === content || events.has(v) || isRng(v)) return;
    const n = seen.get(v) ?? 0;
    seen.set(v, n + 1);
    if (n) return;
    for (const x of Array.isArray(v) ? v : Object.values(v)) count(x);
  };
  count(root);
  const ids = new Map();
  const enc = (v) => {
    if (v === null || typeof v !== 'object') return v;
    if (v === content) return { $c: 1 };
    if (events.has(v)) return { $ev: v.id };
    if (isRng(v)) return { $rng: v.state };
    if (ids.has(v)) return { $ref: ids.get(v) };
    const shared = seen.get(v) > 1;
    if (shared) ids.set(v, ids.size);
    const body = Array.isArray(v) ? v.map(enc) : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, enc(x)]));
    return shared ? { $id: ids.get(v), $v: body } : body;
  };
  return JSON.stringify({ v: SNAP_V, root: enc(root) });
}

// การ์ดเนื้อหาที่ id หายจากเนื้อหาใหม่ = null (ผู้เรียกทิ้งแล้วจั่วใหม่) · ตัวสุ่มคืนเป็นตัวใหม่ที่เดินต่อจากเลขเดิม
function restore(text, content) {
  const snap = JSON.parse(text);
  if (snap?.v !== SNAP_V) throw new Error('เซฟรูปแบบอื่น');
  const byId = new Map(content.events.map((e) => [e.id, e]));
  const table = [];
  const dec = (v) => {
    if (v === null || typeof v !== 'object') return v;
    if (Array.isArray(v)) return v.map(dec);
    if (v.$c) return content;
    if ('$ev' in v) return byId.get(v.$ev) ?? null;
    if ('$rng' in v) return makeRng(v.$rng);
    if ('$ref' in v) return table[v.$ref];
    if ('$id' in v) {
      // จองช่องก่อนถอดตัวใน — ลูกที่อ้างกลับมาหาพ่อ (วน) ได้ตัวเดียวกัน
      const out = Array.isArray(v.$v) ? [] : {};
      table[v.$id] = out;
      if (Array.isArray(out)) out.push(...v.$v.map(dec));
      else for (const [k, x] of Object.entries(v.$v)) out[k] = dec(x);
      return out;
    }
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, dec(x)]));
  };
  return dec(snap.root);
}

// ซ่อมสถานะชีวิตหลังโหลดบนเนื้อหาใหม่: ของที่อ้าง id แล้ว id หาย ให้ทางปลอดภัยแทนการพัง
// card = การ์ดที่ค้างบนจอตอนเซฟ · คืน true = การ์ดนั้นใช้ไม่ได้แล้ว (การ์ดเนื้อหาหาย/จำนวนตัวเลือกเปลี่ยน) ผู้เรียกจั่วใบถัดไปใหม่
function repairLife(st, card) {
  const ev = st.pending && !st.pending.alloc ? st.pending : null;
  // การ์ดทริปต่างโลก (B68m) ไม่ผ่าน st.pending — สถานะทั้งชาติอยู่ใน st.trip ที่ภาพถ่ายเก็บไว้แล้ว จั่วใหม่ = นับใบซ้ำ + ดึงเลขสุ่มเกิน
  // ทริปศาล (B153) เหมือนกัน: ใบที่รอเลือกอยู่ใน st.court
  const stale = !st.trip && !st.court &&!!card?.choices?.length && (!st.pending || (ev && ev.choices.length !== card.choices.length));
  if (stale) st.pending = null;
  const q = st.queue ?? [];
  st.queue = q.filter((c) => !('ev' in c) || c.ev);
  // เซฟก่อนมีชื่อจริง (names-fun) — สุ่มจาก seed เดิม โหลดกี่ครั้งก็ได้ชื่อเดียวกัน
  st.realName ??= pickRealName(st.seed, st.sex, st.birthYear, st.content.era.names);
  const occ = st.content.era.finance.occupations;
  if (st.occupation && !occ.some((o) => o.id === st.occupation)) st.occupation = occ[0].id;
  const ladders = st.content.era.careers?.ladders;
  if (st.ladder && ladders && !ladders[st.ladder.id]) st.ladder = null;
  // เซฟก่อนมีสาเหตุตาย (B110) — เริ่ม stream ใหม่จาก seed เหมือนชีวิตที่เกิดใหม่
  st.causeRng ??= makeRng(st.seed ^ 0x9b05688c);
  st.terminal ??= null;
  // เซฟก่อนญาติมีสาเหตุ (B110 ชิ้น 2) — ญาติที่จากไปแล้วไม่มีสาเหตุย้อนหลัง · คนที่ยังอยู่เริ่มนับจากนี้
  st.kinCauseRng ??= makeRng(st.seed ^ 0xc1059ed8);
  st.heredity ??= [];
  // เซฟก่อนมีความจำข้ามชาติ (ใบ 159) — รุ่นที่มีผังตระกูลได้ความจำจากแถวท้าย ไม่มีอาชีพ จึงไม่มีพรสวรรค์ · ชีวิตแรกไม่มีช่องเหมือนเดิม
  if (!('past' in st)) {
    const past = pastFromLineage(st.lineage, (name) => REALMS.find((r) => r.name === name)?.id ?? null);
    if (past) st.past = past;
  }
  return stale;
}

// ภาพประกอบวาดด้วยโค้ด (B56): ข้อมูลรูปทรงล้วน ไม่แตะ DOM — จอวาดเป็น SVG ภาพแชร์วาดด้วย Path2D จากชุดเดียวกัน
// ทุกชิ้นเป็น path สตริงเดียวต่อชิ้น { d, fill, stroke, w } เพราะ Path2D รับสตริง path ของ SVG ได้ตรง ๆ
// สีตายตัวทุกธีม (เจ้าของเคาะ): แผ่นรักดำ+ทอง · ธีมสว่างก็เป็นแผ่นเข้มเหมือนกรอบภาพบนพื้นขาว
// ชื่อระดับบนสุดขึ้นต้น ART/art ทั้งหมด — build ต่อทุกโมดูลเป็นสคริปต์เดียว ชื่อซ้ำกับแกนหรือ app.mjs จะพังทั้งหน้า

const ART_INK = { lacquer: '#17110D', lacquer2: '#221912', gold: '#D9B45A', gold2: '#F0D78C', cream: '#EFE3C2', bronze2: '#8A6D3B' };
const ART_LINE = { stroke: ART_INK.gold, w: 1.6 };

const artCirc = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
// คลื่นต่อเนื่องจาก x0 ถึง x1 — ใช้ทั้งน้ำท่วม คลื่นยักษ์ และพายุ
const artWave = (x0, x1, y, step, amp) => {
  let d = `M${x0} ${y}q${step / 2} ${-amp} ${step} 0`;
  for (let x = x0 + step; x + step <= x1; x += step) d += `t${step} 0`;
  return d;
};
const artLine = (d, extra) => ({ d, ...ART_LINE, ...extra });
const artFill = (d, fill = ART_INK.gold2) => ({ d, fill });

// กรอบแผ่นภาพยุค: ขอบทองคู่ + ลายกนกม้วนที่มุม (ลายไทยทองบนพื้นเข้ม)
const ERA_ART_W = 200, ERA_ART_H = 80;
const ERA_FRAME = [
  { d: `M0 0h${ERA_ART_W}v${ERA_ART_H}h-${ERA_ART_W}z`, fill: ART_INK.lacquer2 },
  artLine(`M4 4h${ERA_ART_W - 8}v${ERA_ART_H - 8}h-${ERA_ART_W - 8}z`, { w: 1.2 }),
  artLine(`M7 7h${ERA_ART_W - 14}v${ERA_ART_H - 14}h-${ERA_ART_W - 14}z`, { stroke: ART_INK.bronze2, w: 0.6 }),
  artLine('M10 22q0-12 12-12q-6 3-6 8q0 4 4 4q3 0 3-3', { w: 1 }),
  artLine(`M${ERA_ART_W - 10} 22q0-12-12-12q6 3 6 8q0 4-4 4q-3 0-3-3`, { w: 1 }),
  artLine(`M10 ${ERA_ART_H - 22}q0 12 12 12q-6-3-6-8q0-4 4-4q3 0 3 3`, { w: 1 }),
  artLine(`M${ERA_ART_W - 10} ${ERA_ART_H - 22}q0 12-12 12q6-3 6-8q0-4-4-4q-3 0-3 3`, { w: 1 }),
];
const ART_GROUND = artLine('M26 66H174', { stroke: ART_INK.bronze2, w: 1 });
const artBarrel = (x, y) => artLine(`M${x} ${y}h18v28h-18zM${x} ${y + 8}h18M${x} ${y + 20}h18`);
const artCar = (x) => [artLine(`M${x} 60h28v-7l-6-6h-15l-7 6zM${x + 9} 47v6`), artLine(artCirc(x + 7, 61, 3), { w: 1.2 }), artLine(artCirc(x + 21, 61, 3), { w: 1.2 })];
const artUp = (x) => artLine(`M${x} 60V24M${x - 7} 31l7-7l7 7`, { stroke: ART_INK.cream });
const artVirus = (cx, cy, r) => {
  const spikes = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4, x1 = cx + Math.cos(a) * r, y1 = cy + Math.sin(a) * r, x2 = cx + Math.cos(a) * (r + 6), y2 = cy + Math.sin(a) * (r + 6);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }).join('');
  const knobs = Array.from({ length: 8 }, (_, i) => artCirc(+(cx + Math.cos((i * Math.PI) / 4) * (r + 7)).toFixed(1), +(cy + Math.sin((i * Math.PI) / 4) * (r + 7)).toFixed(1), 1.6)).join('');
  return [artLine(artCirc(cx, cy, r)), artLine(spikes, { w: 1.2 }), artFill(knobs), artFill(artCirc(cx - 3, cy - 2, 1.6) + artCirc(cx + 4, cy + 3, 1.3), ART_INK.gold)];
};
const artHouse = (x, base, s = 1) => artLine(`M${x} ${base}v${-14 * s}l${12 * s} ${-10 * s}l${12 * s} ${10 * s}v${14 * s}zM${x + 9 * s} ${base}v${-7 * s}h${6 * s}v${7 * s}`);

// ยุคละภาพเดียว ใช้กับทุกการ์ดของยุคนั้น — คีย์ตาม id เหตุการณ์ใน data/era-events.json
const ERA_SCENES = {
  oil_crisis_1: [ART_GROUND, artBarrel(56, 38), artBarrel(78, 38), artBarrel(67, 10), artFill('M128 18c0 0-11 15-11 24a11 11 0 0 0 22 0c0-9-11-24-11-24z'), artUp(158)],
  oil_crisis_2: [ART_GROUND, artLine('M56 66V26h24v40zM61 32h14v10h-14zM80 36h6v20q0 5-4 5'), artLine('M82 60h-6', { w: 1.2 }), ...artCar(104), ...artCar(140), artUp(36)],
  typhoon_gay: [
    artLine('M100 38m-3 0a3 3 0 1 1 6 0a7 7 0 1 1-14 0a11 11 0 1 1 22 0a15 15 0 1 1-30 0'),
    artLine('M28 24h26M34 32h22M140 22l-6 10M152 22l-6 10M164 22l-6 10M146 36l-6 10M158 36l-6 10', { stroke: ART_INK.cream, w: 1.2 }),
    artLine(artWave(24, 176, 64, 16, 7)),
  ],
  tom_yum_kung: [
    artLine('M30 16V64H112', { stroke: ART_INK.bronze2, w: 1 }),
    artLine('M34 24l14 6l12-4l14 20l12-3l16 16M96 52l6 7l-9 1', { stroke: ART_INK.cream }),
    artLine(artCirc(148, 38, 15)),
    artLine(artCirc(148, 38, 11), { w: 0.8 }),
    artLine('M145 30v16M145 30h4a4 4 0 0 1 0 8h-4m4 0a4 4 0 0 1 0 8h-4M147 27v22', { w: 1.3 }),
    artLine(artCirc(124, 22, 4) + artCirc(172, 58, 4), { w: 1.2 }),
    artLine('M124 12v4M172 48v4', { stroke: ART_INK.cream, w: 1 }),
  ],
  sars: [
    artLine(artCirc(76, 38, 17)),
    { d: 'M62 38q14 8 28 0v9q-14 9-28 0z', fill: ART_INK.cream },
    artLine('M62 40l-5-6M90 40l5-6', { w: 1 }),
    artFill(artCirc(70, 32, 1.6) + artCirc(82, 32, 1.6), ART_INK.gold2),
    artLine('M136 16v32', { w: 4 }),
    artFill(artCirc(136, 54, 6)),
    artLine('M142 22h4M142 30h4M142 38h4', { stroke: ART_INK.cream, w: 1 }),
    ...artVirus(166, 26, 5),
  ],
  tsunami: [
    artLine('M24 66C46 66 52 22 92 18C122 15 130 40 114 46C104 50 98 40 106 36'),
    artLine('M40 66C58 64 66 34 92 30M58 66C70 62 78 44 96 42', { stroke: ART_INK.cream, w: 1.1 }),
    artLine('M160 66q-5-20 2-38', { w: 2 }),
    artLine('M162 28q-14-4-20 6M162 28q14-6 22 4M162 28q-6-12-16-12M162 28q8-12 18-10'),
    artLine(artWave(122, 180, 66, 12, 4), { stroke: ART_INK.bronze2, w: 1 }),
  ],
  global_financial_crisis: [
    ART_GROUND,
    artLine('M34 66V40h16v26M54 66V28h18v38M76 66V46h14v20M118 66V32h16v34M138 66V44h20v22'),
    artFill('M58 34h3v3h-3zM65 34h3v3h-3zM58 42h3v3h-3zM122 38h3v3h-3zM128 38h3v3h-3zM122 46h3v3h-3z', ART_INK.gold),
    artLine('M26 18l30 10l20-6l30 22l24-4l34 18M164 52l2 7l-8 1', { stroke: ART_INK.cream }),
  ],
  great_flood: [
    artHouse(46, 54, 1.1),
    artHouse(108, 54),
    artLine('M150 50h26l-4 6h-18zM162 50v-10M159 44h6', { w: 1.3 }),
    artFill(artCirc(162, 37, 2.5)),
    artLine(artWave(24, 176, 56, 12, 4), { stroke: ART_INK.cream, w: 1.2 }),
    artLine(artWave(24, 176, 64, 12, 4)),
  ],
  covid19: [
    ART_GROUND,
    ...artVirus(70, 36, 13),
    artLine('M120 66V42l20-16l20 16v24zM133 66V52h14v14'),
    artLine('M128 46h6v-6M152 46h-6v-6', { stroke: ART_INK.cream, w: 1 }),
    artFill(artCirc(140, 40, 2.2)),
  ],
};

function eraArt(id) {
  const scene = ERA_SCENES[id];
  return scene ? [...ERA_FRAME, ...scene] : null;
}

const artPerson = (x, base, s = 1) => [
  artLine(artCirc(x, base - 16 * s, 3 * s), { w: 1.2 }),
  artLine(`M${x} ${base - 13 * s}v${7 * s}l${-3 * s} ${6 * s}M${x} ${base - 6 * s}l${3 * s} ${6 * s}M${x - 4 * s} ${base - 10 * s}h${8 * s}`, { w: 1.2 }),
];
const artFlame = (x, y) => artFill(`M${x} ${y}c3 4 4 7 0 9c-4-2-3-5 0-9z`);
const artBox = (x, y, w, h) => artLine(`M${x} ${y}h${w}v${h}h${-w}zM${x + w / 2} ${y}v${h * 0.4}`, { w: 1.2 });
const artBag = (x, y) => artLine(`M${x} ${y}h12q2 0 2 3t-2 3h-12q-2 0-2-3t2-3z`, { w: 1 });
const artFish = (x, y) => [artFill(`M${x} ${y}q8-6 16 0q-8 6-16 0zM${x} ${y}l-5-4v8z`), artFill(artCirc(x + 12, y - 1, 0.9), ART_INK.lacquer2)];
const artPlane = (x, y) => artLine(`M${x} ${y}h26q6 0 8 3q-2 3-8 3h-26zM${x + 4} ${y}l-4-8h4l6 8M${x + 12} ${y + 3}l6 8h4l-2-8`, { w: 1.2 });
const artPalm = (x, base) => [artLine(`M${x} ${base}q-2-18 8-32`, { w: 2 }), artLine(`M${x + 8} ${base - 32}q-12-4-18 6M${x + 8} ${base - 32}q12-6 18 4M${x + 8} ${base - 32}q-4-10-14-10`)];
const artStilt = (x) => artLine(`M${x - 2} 40l14-12l14 12zM${x} 40v12h24v-12M${x + 2} 52v10M${x + 22} 52v10M${x + 9} 52v-7h6v7`, { w: 1.2 });
const artWheel = (cx, cy, r) => artLine(artCirc(cx, cy, r), { w: 1.2 });

// สมุดภาพบ้านเมือง (B130): ภาพละช่อง ปลดตามวัยที่เจอการ์ดของเหตุการณ์ หรือการ์ดตามมา (sp) · กรอบเดียวกับภาพยุค
// [ช่อง, ป้ายช่อง, คำบรรยายภาพ, รูปทรง] · ภาพหลักของเหตุการณ์คือภาพยุคเดิม ไม่อยู่ในรายการนี้
const ERA_PICS = {
  oil_crisis_2: [
    ['kid', 'วัยเด็ก', 'ตะเกียงบนโต๊ะกินข้าว ไฟดับทั้งซอย', [
      artLine('M40 52h70M46 52v14M104 52v14'),
      artLine('M48 52q5 5 10 0M92 52q5 5 10 0', { w: 1.2 }),
      artLine('M68 52h14l-2-4h-10zM70 48q-3-8 2-14h6q5 6 2 14zM70 34q5-8 10 0', { w: 1.2 }),
      artFlame(75, 37),
      artLine('M60 32l-5-3M90 32l5-3M75 26v-5', { stroke: ART_INK.cream, w: 1 }),
      artHouse(130, 66), artHouse(156, 66, 0.8),
      artFill('M168 14a7 7 0 1 0 6 11a6 6 0 1 1-6-11z', ART_INK.cream),
    ]],
    ['adult', 'วัยทำงาน', 'ประตูโรงงานติดป้ายลดกะ', [
      ART_GROUND,
      artLine('M30 66V40l14-10v10l14-10v10l14-10v10l14-10V66M92 66V20h8v46'),
      artLine('M110 66V44h56v22M118 44v22M126 44v22M134 44v22M142 44v22M150 44v22M158 44v22', { w: 1.2 }),
      { d: 'M118 28h40v13h-40z', fill: ART_INK.cream },
      { d: 'M122 32h32M122 37h20', stroke: ART_INK.lacquer2, w: 1.4 },
    ]],
    ['old', 'วัยชรา', 'บิลค่าไฟกับเทียนบนหิ้ง', [
      artLine('M36 38h86M44 38v6M114 38v6', { stroke: ART_INK.bronze2 }),
      artLine('M54 38v-14h6v14z', { w: 1.2 }), artFlame(57, 15),
      { d: 'M78 38l4-22h24l-4 22z', fill: ART_INK.cream },
      { d: 'M85 22h15M84 27h13M83 32h8', stroke: ART_INK.lacquer2, w: 1.2 },
      artFill('M152 16l-12 22h10l-6 22l16-28h-10l6-16z'),
      ART_GROUND,
      artLine('M58 66v-12h20v12M58 62h20M58 58h20', { w: 1.2 }),
    ]],
    ['sp', 'พิเศษ · นาผืนเก่า', 'ทุ่งนากับควาย คนกลับบ้านทำนา', [
      ART_GROUND,
      artLine([30, 42, 54, 66, 78].map((x) => `M${x} 66v-8M${x} 61l-4-4M${x} 61l4-4`).join(''), { w: 1 }),
      ...artPerson(98, 66), artFill('M91 50l7-5l7 5z'),
      artLine('M122 44h30q6 0 6 6v4q0 4-4 4h-32q-4 0-4-4v-4q0-6 4-6zM126 58v8M134 58v8M146 58v8M154 58v8M152 44l10-2q4 4 0 10h-6M160 42q6-6 12-2M122 46q-4 4-2 10'),
      artFill(artCirc(40, 22, 6), ART_INK.gold),
    ]],
  ],
  typhoon_gay: [
    ['kid', 'วัยเด็ก', 'หลังคาสังกะสีปลิวกลางลม', [
      ART_GROUND,
      artLine('M40 66V42h36v24M52 66V54h10v12'),
      artLine('M88 30l30-10l4 8l-30 10z'),
      artLine('M94 28l3 7M101 26l3 7M108 23l3 7M115 21l3 7', { w: 0.8 }),
      artLine('M130 30q16-4 30 2M126 42q20-4 42 2M134 54q14-2 28 2', { stroke: ART_INK.cream, w: 1.2 }),
    ]],
    ['adult', 'วัยทำงาน', 'เรือประมงคว่ำบนหาด', [
      artLine('M24 60q70-8 152 2', { stroke: ART_INK.bronze2, w: 1 }),
      artLine(artWave(24, 72, 66, 12, 4), { stroke: ART_INK.cream, w: 1.2 }),
      artLine('M68 56q30-22 62 0zM99 45v-6M130 56l6-3'),
      ...artPalm(154, 62),
      artLine('M30 22h24M36 30h20', { stroke: ART_INK.cream, w: 1.2 }),
    ]],
  ],
  tom_yum_kung: [
    ['kid', 'วัยเด็ก', 'กล่องย้ายบ้านหน้าห้องแถว', [
      ART_GROUND,
      artLine('M30 66V26h90v40M60 26v40M90 26v40'),
      artLine('M34 46h22M34 51h22M34 56h22M34 61h22M64 46h22M64 51h22M64 56h22M64 61h22', { stroke: ART_INK.bronze2, w: 0.8 }),
      artLine('M34 30h22v8h-22zM64 30h22v8h-22zM94 30h22v8h-22z', { w: 1 }),
      artBox(128, 50, 20, 16), artBox(150, 50, 20, 16), artBox(139, 34, 20, 16),
    ]],
    ['adult', 'วัยทำงาน', 'เปิดท้ายขายของมือสอง', [
      ART_GROUND,
      artLine('M36 60V48h40v12M76 60V40h14l10 10v10zM36 60l-10 4'),
      artWheel(48, 61, 4), artWheel(90, 61, 4),
      artLine('M42 48v-8h12v8M56 48v-6h14v6', { w: 1 }),
      artLine('M120 66v-14M114 52h12l-3-7h-6zM134 66v-4h-2v-14h22v14h-2v4zM134 52h14v8h-14z', { w: 1.2 }),
      { d: 'M158 40l8-8h8v8l-8 8z', fill: ART_INK.cream },
      artFill(artCirc(170, 36, 1.4), ART_INK.lacquer2),
    ]],
    ['old', 'วัยชรา', 'สร้อยทองบนตาชั่งร้านทอง', [
      artLine('M24 66h152', { stroke: ART_INK.bronze2, w: 1 }),
      artLine('M100 64V22M86 64h28M70 26h60M72 26l-6 18M72 26l6 18M128 26l-6 18M128 26l6 18M62 44q10 6 20 0zM118 44q10 6 20 0z'),
      artFill(artCirc(100, 22, 2.2)),
      artFill([66, 70, 74, 78, 68, 76].map((x, i) => artCirc(x, i < 4 ? 42 : 39, 1.8)).join('')),
      artFill('M124 42h6v-4h-6zM131 42h5v-3h-5z', ART_INK.gold),
    ]],
  ],
  sars: [
    ['kid', 'วัยเด็ก', 'ปรอทวัดไข้กับหน้ากาก', [
      artLine('M60 56l38-28', { w: 4 }),
      artFill(artCirc(57, 58, 5)),
      artLine('M72 42l3 3M80 36l3 3M88 30l3 3', { stroke: ART_INK.cream, w: 1 }),
      { d: 'M112 34q20-8 40 0v14q-20 10-40 0z', fill: ART_INK.cream },
      { d: 'M114 39q18-6 36 0M114 45q18-6 36 0', stroke: ART_INK.lacquer2, w: 1 },
      artLine('M112 36q-8 5 0 12M152 36q8 5 0 12', { w: 1.2 }),
    ]],
    ['adult', 'หนุ่มสาว', 'สนามบินว่าง เครื่องบินจอดเรียง', [
      ART_GROUND,
      artPlane(28, 52), artPlane(68, 52), artPlane(108, 52),
      artLine('M158 66V32h-4l4-10h12l4 10h-4v34', { w: 1.2 }),
      artLine('M40 22q4-6 10-2q6-4 10 2z', { stroke: ART_INK.cream, w: 1 }),
    ]],
  ],
  tsunami: [
    ['kid', 'วัยเด็ก', 'ทะเลถอย ปลาดิ้นบนทราย', [
      artLine(artWave(24, 176, 24, 12, 3), { stroke: ART_INK.cream, w: 1.2 }),
      artLine('M24 38q76-6 152 0', { stroke: ART_INK.bronze2, w: 1 }),
      ...artFish(44, 52), ...artFish(84, 60), ...artFish(118, 48), ...artFish(146, 60),
      artLine('M66 46q3-3 6 0M104 62q3-3 6 0', { w: 1 }),
    ]],
    ['adult', 'วัยทำงาน', 'ป้ายเส้นทางหนีคลื่น', [
      ART_GROUND,
      artLine('M70 66V36'),
      { d: 'M44 16h52v20h-52z', fill: ART_INK.cream },
      { d: 'M50 30q4-6 8 0t8 0M72 32l12-8M78 24h6v6', stroke: ART_INK.lacquer2, w: 1.4 },
      artLine('M96 60l24-12M114 46l6 2l-2 6', { stroke: ART_INK.cream }),
      artLine('M120 66q20-36 56-40'),
    ]],
    ['sp', 'พิเศษ · นายหน้าเคาะประตู', 'บังกะโลริมหาดสร้างใหม่', [
      artLine(artWave(24, 176, 66, 12, 3), { stroke: ART_INK.bronze2, w: 1 }),
      artStilt(36), artStilt(74),
      artLine('M118 62V30h24v32M118 40h24M118 50h24M118 30l24 10M118 40l24 10', { w: 1 }),
      ...artPalm(160, 62),
    ]],
  ],
  global_financial_crisis: [
    ['kid', 'วัยเด็ก', 'ขนมทำเองในกล่องส่งของ', [
      ART_GROUND,
      artFill(artCirc(70, 44, 5) + artCirc(84, 42, 5) + artCirc(98, 44, 5), ART_INK.gold),
      artLine('M60 46h50v20h-50zM60 46l-8-10M110 46l8-10M85 46v20'),
      artLine('M134 22h22v40h-22zM142 58h6', { w: 1.2 }),
      artFill('M139 30h12v7h-8l-4 3z'),
    ]],
    ['adult', 'วัยทำงาน', 'กล่องของบนโต๊ะทำงานว่าง', [
      ART_GROUND,
      artLine('M36 54h94M42 54v12M124 54v12'),
      artLine('M58 54V40h34v14zM58 40l6-6h22l6 6', { w: 1.2 }),
      artLine('M72 34q-2-10 6-14M78 34q4-8 10-8', { stroke: ART_INK.cream, w: 1 }),
      artLine('M144 50h18M144 50V30M146 50v16M160 50v16', { w: 1.2 }),
    ]],
    ['old', 'วัยชรา', 'ศาลาวัดกับหลานตัวเล็ก', [
      ART_GROUND,
      artLine('M36 36l40-22l40 22zM48 36l28-14l28 14M36 36q-4-6 0-10M116 36q4-6 0-10M46 36v30M106 36v30M76 36v30'),
      ...artPerson(144, 66, 1.1), artLine('M149 54l4 12', { w: 1.2 }),
      ...artPerson(162, 66, 0.7),
    ]],
    ['sp', 'พิเศษ · กาแฟแก้วนี้ขายได้', 'รถเข็นกาแฟหน้าตึก', [
      ART_GROUND,
      artLine('M112 66V14h50v52', { stroke: ART_INK.bronze2, w: 1 }),
      artFill('M120 22h4v4h-4zM132 22h4v4h-4zM144 22h4v4h-4zM120 34h4v4h-4zM144 34h4v4h-4zM132 46h4v4h-4z', ART_INK.bronze2),
      artLine('M40 50h50v12h-50zM38 30q27-18 54 0zM65 30v20'),
      artWheel(48, 63, 3), artWheel(82, 63, 3),
      artLine('M70 44h8l-1 6h-6z', { w: 1.2 }),
      artLine('M72 42q-2-3 0-6M76 42q2-3 0-6', { stroke: ART_INK.cream, w: 1 }),
    ]],
  ],
  great_flood: [
    ['kid', 'วัยเด็ก', 'กะละมังลอยในบ้าน', [
      artLine('M120 18h30v20h-30zM135 18v20M120 28h30', { w: 1.2 }),
      artLine('M50 46h40l-6 10h-28z'),
      ...artPerson(70, 48, 0.6),
      artLine(artWave(24, 176, 52, 12, 3), { stroke: ART_INK.cream, w: 1.2 }),
      artLine(artWave(24, 176, 62, 12, 3)),
      artLine('M110 50h10q2 0 2 2h-12z', { w: 1 }),
    ]],
    ['adult', 'วัยทำงาน', 'กำแพงถุงทรายหน้าบ้าน', [
      artHouse(118, 66, 1.3),
      ...[[62, 60], [76, 60], [90, 60], [69, 54], [83, 54], [76, 48]].map(([x, y]) => artBag(x, y)),
      artLine(artWave(24, 56, 60, 8, 3), { stroke: ART_INK.cream, w: 1.2 }),
      artLine(artWave(24, 56, 66, 8, 3)),
      ART_GROUND,
    ]],
  ],
  covid19: [
    ['kid', 'วัยเด็ก', 'แท็บเล็ตเรียนออนไลน์บนโต๊ะ', [
      artLine('M36 62h128'),
      artLine('M68 22h64v36h-64zM96 58l-6 4M104 58l6 4', { w: 1.2 }),
      artFill([0, 1, 2].flatMap((i) => [0, 1].map((j) => artCirc(80 + i * 20, 30 + j * 15, 2.6))).join('')),
      artLine([0, 1, 2].flatMap((i) => [0, 1].map((j) => `M${75 + i * 20} ${38 + j * 15}q5-4 10 0`)).join(''), { w: 1 }),
      artLine('M144 62v-10h8v10', { w: 1.2 }),
    ]],
    ['adult', 'วัยทำงาน', 'ไรเดอร์บนถนนว่าง', [
      ART_GROUND,
      artLine('M30 66h10M56 66h10M134 66h10M160 66h10', { stroke: ART_INK.cream, w: 1.4 }),
      artLine('M28 50V24h20v26M152 50V28h22v22', { stroke: ART_INK.bronze2, w: 1 }),
      artWheel(78, 58, 5), artWheel(106, 58, 5),
      artLine('M78 58l10-10h12l6 10M96 48l-4-8l-6 6', { w: 1.2 }),
      artFill('M70 34h14v12h-14z'),
      artLine(artCirc(94, 34, 3), { w: 1.2 }),
    ]],
    ['sp', 'พิเศษ · ออเดอร์ล้นห้อง', 'กล่องพัสดุกองล้นห้อง', [
      ART_GROUND,
      artLine('M150 66V24h22v42M166 46h2', { w: 1.2 }),
      ...[[30, 52], [52, 52], [74, 52], [96, 52], [118, 52], [41, 38], [63, 38], [85, 38], [107, 38], [52, 24], [74, 24], [96, 24]].map(([x, y]) => artBox(x, y, 20, 14)),
    ]],
  ],
};

function eraPicArt(id, slot) {
  const pic = ERA_PICS[id]?.find(([k]) => k === slot);
  return pic ? [...ERA_FRAME, ...pic[3]] : null;
}

// ภาพฉากสำคัญของชีวิต (ui-redo 31): เกิด · แต่ง · มีลูก · เกษียณ · ตาย — กรอบ สี และขนาดเดียวกับภาพยุค · ฉากละ 1–3 ภาพ
// [ป้ายบรรยายภาพ, รูปทรง] · ผู้เรียกเลือกฉากจากการ์ด (app.mjs SCENE_OF) — ไฟล์นี้ไม่รู้จัก id การ์ด
const artCradle = (x, y) => [artLine(`M${x} ${y}q22 16 44 0`, { w: 1.6 }), artFill(artCirc(x + 22, y + 4, 4), ART_INK.cream), artLine(`M${x + 14} ${y + 6}q8 6 16 0`, { stroke: ART_INK.bronze2, w: 1 })];
const artCrib = (x, y, w = 50) => [
  artLine(`M${x} ${y}h${w}M${x} ${y + 18}h${w}M${x} ${y - 4}v28M${x + w} ${y - 4}v28`, { w: 1.4 }),
  artLine(Array.from({ length: Math.floor(w / 8) - 1 }, (_, i) => `M${x + 8 * (i + 1)} ${y}v18`).join(''), { w: 0.8 }),
  artFill(artCirc(x + w / 2, y + 8, 4), ART_INK.cream),
];
const artStar = (x, y) => artLine(`M${x} ${y - 3}v6M${x - 3} ${y}h6`, { stroke: ART_INK.cream, w: 1 });
const artGift = (x, y) => [artBox(x, y, 14, 12), artLine(`M${x + 3} ${y}q4-5 4 0q0-5 4 0`, { w: 1 })];
const artRing = (x, y) => [artLine(artCirc(x, y, 6), { w: 1.6 }), artFill(`M${x - 3} ${y - 6}l3-5l3 5z`, ART_INK.cream)];
const artCandle = (x) => [artLine(`M${x} 66V40h6v26`, { w: 1.2 }), artFlame(x + 3, 30)];
const artLotus = (x, y) => [artFill(`M${x} ${y}q-6-10 0-18q6 8 0 18z`), artFill(`M${x} ${y}q-12-4-14-12q10 0 14 12z`, ART_INK.bronze2), artFill(`M${x} ${y}q12-4 14-12q-10 0-14 12z`, ART_INK.bronze2)];
const ART_SCENES = {
  birth_poor: ['บ้านใต้ถุนสูง เปลผ้าแขวนรอบเด็กแรกเกิด', [ART_GROUND, artStilt(28), artLine('M100 18h60M108 18v20M152 18v20', { w: 1.2 }), ...artCradle(108, 38), artLine('M162 66V20', { stroke: ART_INK.bronze2, w: 2 }), artStar(76, 18), artStar(180, 30)]],
  birth_mid: ['บ้านในเมือง เตียงเด็กข้างหน้าต่าง', [ART_GROUND, artHouse(28, 66, 1.6), ...artCrib(104, 40), artLine('M129 14v10M119 24h20M121 24v6M137 24v6', { stroke: ART_INK.cream, w: 1 }), artStar(172, 22)]],
  birth_rich: ['เตียงเด็กมีมุ้งครอบ กล่องของขวัญรอบห้อง', [ART_GROUND, artLine('M96 22q34-16 68 0v40M96 22v40', { stroke: ART_INK.cream, w: 1 }), ...artCrib(104, 38), ...artGift(40, 54), ...artGift(58, 54), ...artGift(49, 42), artLine('M176 66V36M170 40q6-10 12 0', { w: 1.2 }), artFlame(176, 26)]],
  wed_ask: ['ขอแต่งงานข้างเตาหมูกระทะ', [ART_GROUND, artLine('M60 54h80M68 54v12M132 54v12', { w: 1.2 }), artLine('M84 54q16-16 32 0M80 54h40', { w: 1.6 }), artLine('M92 40q2-6 0-10M100 38q2-6 0-10M108 40q2-6 0-10', { stroke: ART_INK.cream, w: 1 }), ...artPerson(44, 66, 1.4), ...artPerson(156, 66, 1.4), ...artRing(100, 20)]],
  wed_rite: ['รดน้ำสังข์ มงคลแฝดคล้องคู่บ่าวสาว', [ART_GROUND, ...artPerson(80, 66, 1.6), ...artPerson(120, 66, 1.6), artLine('M70 30q10-10 20 0M110 30q10-10 20 0M90 26q10-6 20 0', { stroke: ART_INK.cream, w: 1.2 }), artLine('M150 30q10-6 18 0l-4 6h-10z', { w: 1.2 }), artLine('M150 36q-4 6-8 8', { stroke: ART_INK.cream, w: 1, }), ...artLotus(40, 64), ...artLotus(166, 64)]],
  baby_news: ['ที่ตรวจขึ้นสองขีด', [artLine('M64 46h72v12h-72zM82 46v12M90 46v12', { w: 1.6 }), artLine('M110 49h14v6h-14z', { stroke: ART_INK.bronze2, w: 1 }), artFill('M100 30c-4-6-12-2-8 4l8 8l8-8c4-6-4-10-8-4z'), artStar(62, 26), artStar(140, 24)]],
  baby_home: ['บ้านหลังแรก รถเข็นเด็กหน้าบ้าน', [ART_GROUND, artHouse(36, 66, 1.8), artLine('M128 50h30q0 10-10 10h-14zM128 50q-2-10 8-14', { w: 1.4 }), artWheel(134, 63, 3), artWheel(152, 63, 3), artLine('M158 50l8-8', { w: 1.4 }), artStar(110, 20)]],
  retire_home: ['เปลญวนใต้ต้นไม้ แดดเย็นวันเกษียณ', [ART_GROUND, ...artPalm(40, 66), artLine('M48 40q40 22 80 0', { w: 1.6 }), artLine('M128 40l8-14M128 40v26', { stroke: ART_INK.bronze2, w: 2 }), artLine(artCirc(160, 30, 9), { stroke: ART_INK.cream, w: 1.2 }), artLine('M146 46h28M150 52h20', { stroke: ART_INK.cream, w: 1 })]],
  retire_early: ['ถือกล่องของออกจากที่ทำงาน', [ART_GROUND, artLine('M120 66V18h48v48M128 26h8v8h-8zM144 26h8v8h-8zM128 42h8v8h-8zM144 42h8v8h-8zM138 66v-10h12v10', { w: 1.2 }), ...artPerson(70, 66, 1.6), artBox(76, 42, 16, 10), artLine('M30 30q10-8 20 0', { stroke: ART_INK.cream, w: 1 })]],
  death: ['เทียนคู่ ธูป และดอกบัว', [ART_GROUND, ...artCandle(64), ...artCandle(130), artLine('M100 66V52M96 52h8', { w: 1.2 }), artLine('M97 52l-3-22M100 52v-24M103 52l3-22', { stroke: ART_INK.bronze2, w: 1 }), artFill(artCirc(94, 30, 1.2), ART_INK.cream), artFill(artCirc(100, 28, 1.2), ART_INK.cream), artFill(artCirc(106, 30, 1.2), ART_INK.cream), ...artLotus(40, 64), ...artLotus(160, 64)]],
  // ปรโลก (ui-redo 15): ศาล · สวรรค์ · นรก — ไม่วาดพระหรือพระพุทธรูป · นรกภาพเดียวก่อน (ขุมนรกยังไม่เคาะ)
  after_court: ['ศาลาตัดสิน โต๊ะวางบัญชีบุญบาป ตะเกียงสองข้าง', [
    ART_GROUND,
    artLine('M64 32L100 12L136 32M74 32L100 18L126 32M100 12V6M64 32q-6 0-6-6M136 32q6 0 6-6'),
    artLine('M70 32V66M130 32V66', { w: 1.4 }),
    artLine('M84 66V50h32v16M80 50h40', { w: 1.2 }),
    artLine('M89 49q5.5-5 11 0q5.5-5 11 0', { stroke: ART_INK.cream, w: 1.2 }),
    artLine('M44 66h8M48 66V48M156 66h-8M152 66V48', { stroke: ART_INK.bronze2, w: 1.2 }),
    artFlame(48, 38), artFlame(152, 38),
  ]],
  after_heaven: ['วิมานบนหมู่เมฆ ดาวรอบฟ้า', [
    artLine(`M28 66${'a8 8 0 0 1 16 0'.repeat(9)}`, { stroke: ART_INK.cream }),
    artLine('M76 56h48M82 56V40h36v16M96 56v-9h8v9', { w: 1.2 }),
    artLine('M78 40L100 26L122 40M88 30L100 20L112 30M100 20V10M78 40q-5 0-5-5M122 40q5 0 5-5'),
    artStar(40, 20), artStar(160, 18), artStar(148, 34), artStar(54, 32),
    artFill(artCirc(30, 36, 1.2) + artCirc(172, 40, 1.2), ART_INK.cream),
  ]],
  after_hell: ['กระทะทองแดงบนกองไฟ ภูเขาหนามสองข้าง', [
    ART_GROUND,
    artLine('M30 66L40 42L46 52L54 34L64 66M136 66L146 34L154 52L160 42L170 66', { stroke: ART_INK.bronze2, w: 1 }),
    artLine('M66 40h68M70 40l6 18h48l6-18M82 58v8M118 58v8', { w: 1.4 }),
    artLine('M88 32q2-4 0-8M100 30q2-4 0-8M112 32q2-4 0-8', { stroke: ART_INK.cream, w: 1 }),
    artFlame(90, 57), artFlame(100, 56), artFlame(110, 57),
  ]],
  gone: ['ทางที่ไม่มีใครเห็นปลาย โคมแขวนรอ', [artLine('M30 66l60-40M170 66l-60-40', { stroke: ART_INK.bronze2, w: 1 }), artLine('M88 28h24', { stroke: ART_INK.bronze2, w: 0.8 }), artLine('M150 66V22h14', { w: 1.4 }), artLine('M160 22v6M154 28h12v12h-12z', { w: 1.2 }), artFlame(160, 30), artLine('M92 60l2-4M100 52l2-4M106 44l2-4', { stroke: ART_INK.cream, w: 1 })]],
};
const ART_SCENE_IDS = Object.keys(ART_SCENES);
function sceneArt(id) {
  const s = ART_SCENES[id];
  return s ? { label: s[0], parts: [...ERA_FRAME, ...s[1]] } : null;
}

// ฐานะ 10 ระดับของ standingOf → จน/กลาง/รวย ตามชื่อระดับ (ยากไร้–ค่อนข้างจน · ชนชั้นกลางล่าง–กลางบน · มีอันจะกิน–มั่งคั่ง)
const artTier = (level) => (level <= 3 ? 0 : level <= 6 ? 1 : 2);

// รูปตัวละคร 40×40 — ช่วงวัยตามลำดับ STAGES (เด็ก วัยรุ่น หนุ่มสาว ทำงาน กลางคน ชรา) × เพศ × ฐานะ 3 ขั้น
// สัดส่วนหัวต่อตัวเล็กลงตามวัย · ผมหงอกจากกลางคน · ชราใส่แว่น · ฐานะบอกด้วยสีเสื้อและเครื่องประดับ ไม่ใช่ตัวเลข
const AVATAR_SIZE = 40;
const AV_BODY = [
  { cx: 20, cy: 17, r: 8.5, sy: 29, w: 9 },
  { cx: 20, cy: 15, r: 7.5, sy: 26, w: 10 },
  { cx: 20, cy: 14, r: 7, sy: 25, w: 11 },
  { cx: 20, cy: 14, r: 7, sy: 25, w: 12 },
  { cx: 20, cy: 14.5, r: 7.2, sy: 25.5, w: 13 },
  { cx: 20, cy: 15, r: 7, sy: 26, w: 12 },
];
const AV_HAIR = ['#1F1A17', '#1F1A17', '#1F1A17', '#2A2420', '#6A635C', '#D8D4CC'];
const AV_SHIRT = ['#7A5C3A', '#3A5F8F', '#6B1F1A'];
const AV_SKIN = '#E0B48A';
const AV_DARK = '#1F1A17';

function avatarArt(stage, sex, tier) {
  const { cx, cy, r, sy, w } = AV_BODY[stage];
  const girl = sex === 'หญิง';
  const hair = AV_HAIR[stage];
  // วัยรุ่นใส่ชุดนักเรียนเสื้อขาว ฐานะย้ายไปอยู่ที่เนกไท/โบ
  const shirt = stage === 1 ? '#EDEDED' : AV_SHIRT[tier];
  const parts = [{ d: artCirc(20, 20, 20), fill: ART_INK.lacquer2 }];
  if (girl && stage === 0) parts.push({ d: artCirc(cx - r - 1, cy - 1, 3) + artCirc(cx + r + 1, cy - 1, 3), fill: hair });
  parts.push({ d: `M${20 - w} 40v-${40 - sy - 3}q0-3 3-3h${2 * w - 6}q3 0 3 3v${40 - sy - 3}z`, fill: shirt });
  // ผมยาวปรกบ่า วาดทับเสื้อ — วาดไว้หลังเสื้อจะโดนบังจนหญิงกับชายวัยเดียวกันหน้าตาเหมือนกัน
  if (girl && stage >= 2 && stage <= 4) parts.push({ d: `M${cx - r - 1.5} ${cy}h${2 * r + 3}v${stage === 4 ? r + 2 : r + 7}h-${2 * r + 3}z`, fill: hair });
  parts.push({ d: `M18 ${cy + r - 1.5}h4v${sy - cy - r + 2}h-4z`, fill: AV_SKIN });
  // ชายชราหัวล้าน เหลือผมข้างหู · หญิงชรามวยผม
  if (stage === 5 && !girl) parts.push({ d: artCirc(cx - r + 0.5, cy - 1, 2.6) + artCirc(cx + r - 0.5, cy - 1, 2.6), fill: hair });
  else parts.push({ d: artCirc(cx, cy - 1.1, r + 0.7), fill: hair });
  if (girl && stage === 5) parts.push({ d: artCirc(cx, cy - r - 1.5, 3), fill: hair });
  if (girl && stage === 1) parts.push({ d: `M${cx - r - 0.7} ${cy - 1}h${2 * r + 1.4}v${r - 1}h-${2 * r + 1.4}z`, fill: hair });
  parts.push({ d: artCirc(cx, cy + 0.8, r - 0.6), fill: AV_SKIN });
  // หน้าม้า/ไรผมทับหน้าผาก — ไม่งั้นหน้ากลมเต็มดูเหมือนหัวล้านทุกวัย
  if (!(stage === 5 && !girl)) parts.push({ d: `M${cx - r + 0.6} ${cy - 0.8}q${r - 0.6} ${-r * 0.9} ${2 * r - 1.2} 0q${-(r - 0.6)} ${-r * 0.35} ${-(2 * r - 1.2)} 0z`, fill: hair });
  parts.push({ d: artCirc(cx - 2.6, cy + 1.2, 0.9) + artCirc(cx + 2.6, cy + 1.2, 0.9), fill: AV_DARK });
  parts.push({ d: `M${cx - 1.8} ${cy + 3.8}q1.8 1.4 3.6 0`, stroke: '#8A4B3A', w: 0.7 });
  if (stage === 5) parts.push({ d: artCirc(cx - 2.6, cy + 1.2, 1.9) + artCirc(cx + 2.6, cy + 1.2, 1.9) + `M${cx - 0.7} ${cy + 1.2}h1.4`, stroke: ART_INK.gold, w: 0.6 });
  // ฐานะ: จน = เสื้อปะ · กลาง = ปกเสื้อ (ผู้ใหญ่ชายผูกไท) · รวย = สร้อยทอง+เข็มกลัด
  const top = sy;
  if (stage === 1) {
    const tie = AV_SHIRT[tier];
    parts.push(girl ? { d: `M17 ${top + 1}l3 2l3-2v4l-3-2l-3 2z`, fill: tie } : { d: `M19 ${top}h2l1 8l-2 2l-2-2z`, fill: tie });
    if (tier === 2) parts.push({ d: artCirc(20 + w - 4, top + 5, 1.3), fill: ART_INK.gold2 });
  } else if (tier === 0) {
    parts.push({ d: `M${20 + w - 6} ${top + 5}h3.5v3.5h-3.5z`, fill: '#5A4630' });
  } else if (tier === 1) {
    parts.push({ d: `M17 ${top}l3 4l3-4`, stroke: ART_INK.cream, w: 0.9 });
    if (stage >= 3 && !girl) parts.push({ d: `M19.2 ${top + 3.5}h1.6l0.8 7l-1.6 1.5l-1.6-1.5z`, fill: '#1F2430' });
  } else {
    parts.push({ d: `M16 ${top + 0.5}q4 5 8 0`, stroke: ART_INK.gold, w: 0.9 });
    parts.push({ d: artCirc(20, top + 4.6, 1.3), fill: ART_INK.gold2 });
    if (stage >= 3) parts.push({ d: `M${20 - w + 2} 40v-${40 - top - 4}M${20 + w - 2} 40v-${40 - top - 4}`, stroke: ART_INK.gold, w: 0.6 });
  }
  parts.push({ d: artCirc(20, 20, 19.4), stroke: ART_INK.gold, w: 1.2 });
  return parts;
}

// ภาพรวมบนหัวแท็บชั้นสมุด (B176): วาด canvas จากของที่ผู้เล่นสะสม ไม่ใช่ภาพวาดมือ · เปิดแท็บ = วาดใหม่
// แกนวาด (noise · แบ่งเขตจากจุดตั้ง) ยกแบบย่อจากหน้าแผนที่ต้นแบบของเจ้าของ (maps/core.js) — ที่นั่นเป็น
// classic script ใช้ผ่าน window จึง import ไม่ได้ · build ต่อทุกไฟล์เป็น scope เดียว ชื่อระดับบนสุดจึงขึ้นต้น sa กันชน

// ---- สุ่มคงที่: ตำแหน่ง/ลายมาจาก id ของข้อมูล เปิดซ้ำได้ภาพเดิม ของใหม่เพิ่มแล้วของเดิมไม่ขยับ ----
function saHash(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function saNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const s = (t) => t * t * (3 - 2 * t);
  const a = saHash(xi, yi), b = saHash(xi + 1, yi), c = saHash(xi, yi + 1), d = saHash(xi + 1, yi + 1);
  return a + (b - a) * s(xf) + (c - a) * s(yf) + (a - b - c + d) * s(xf) * s(yf);
}
const saFbm = (x, y) => 0.55 * saNoise(x, y) + 0.3 * saNoise(x * 2.1 + 5, y * 2.1 + 9) + 0.15 * saNoise(x * 4.3 + 11, y * 4.3 + 2);
const saStr = (s, k = 0) => {
  let x = 2166136261 ^ k;
  for (const c of s) x = Math.imul(x ^ c.codePointAt(0), 16777619);
  return saHash(x, k * 31 + 7);
};
const saRgb = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
const SA_FONT = (s, bold) => `${bold ? 'bold ' : ''}${s}px Sarabun, "Leelawadee UI", sans-serif`;
const SA_MUTED = '#8a7a5a';

// canvas กว้างเท่ากล่อง · วาดที่ความละเอียดจอ · คืน null เมื่อเบราว์เซอร์ไม่มี 2d (หน้ายังใช้รายการข้อความได้)
function saCanvas(host, H, label) {
  const cv = document.createElement('canvas');
  cv.className = 'shelf-art';
  cv.setAttribute('role', 'img');
  cv.setAttribute('aria-label', label);
  host.append(cv);
  const c = cv.getContext?.('2d');
  if (!c) return null;
  // offsetWidth ไม่โดน transform — ระหว่างการ์ดพลิก rect หดเหลือเสี้ยวเดียว
  const W = Math.max(280, Math.round(cv.offsetWidth || host.clientWidth || 340));
  const dpr = window.devicePixelRatio || 1;
  cv.width = W * dpr;
  cv.height = H * dpr;
  cv.style.height = `${H}px`;
  c.scale(dpr, dpr);
  return { cv, c, W, H };
}
function saBg(c, W, H, top = ART_INK.lacquer2, bot = ART_INK.lacquer) {
  const g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(1, bot);
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
}
// ของใหม่ที่ยังไม่เปิดดู = จุดเรือง ตรงกับป้าย "ใหม่" ในรายการ
function saGlow(c, x, y, r = 7) {
  const g = c.createRadialGradient(x, y, 0, x, y, r * 2.2);
  g.addColorStop(0, 'rgba(239,227,194,.95)');
  g.addColorStop(1, 'rgba(239,227,194,0)');
  c.fillStyle = g;
  c.beginPath();
  c.arc(x, y, r * 2.2, 0, Math.PI * 2);
  c.fill();
}
function saText(c, s, x, y, { size = 12, color = ART_INK.cream, align = 'left', bold = false } = {}) {
  c.font = SA_FONT(size, bold);
  c.fillStyle = color;
  c.textAlign = align;
  c.fillText(s, x, y);
}
function saNote(c, x, y, w, s) {
  c.fillStyle = 'rgba(23,17,13,.72)';
  c.fillRect(x - w / 2, y - 18, w, 28);
  saText(c, s, x, y + 1, { size: 13, align: 'center', color: ART_INK.gold2, bold: true });
}
// ---- อนุสรณ์: แผนที่ภาค ----
// รูปประเทศหยาบในกรอบ 64×100 · วาดใหญ่นอกจอครั้งเดียวต่อหน้า (noise ของเส้นแดนตั้งไว้ที่หลักร้อย px) แล้วย่อลง
const SA_THAI = [[10, 6], [20, 0], [32, 3], [38, 10], [46, 13], [56, 12], [63, 20], [64, 30], [58, 37], [50, 40], [50, 47], [46, 52], [40, 48], [36, 46], [34, 50], [35, 58], [37, 68], [40, 78], [44, 88], [46, 96], [42, 98], [36, 92], [32, 82], [30, 72], [30, 62], [30, 54], [28, 46], [24, 40], [18, 30], [14, 22], [8, 14]];
const SA_REGION = {
  เหนือ: { seeds: [[20, 14]], col: '#6f5a33', short: 'เหนือ' },
  ตะวันออกเฉียงเหนือ: { seeds: [[52, 24]], col: '#7d6436', short: 'อีสาน' },
  กลาง: { seeds: [[34, 32]], col: '#8a7240', short: 'กลาง' },
  ตะวันตก: { seeds: [[25, 40]], col: '#735e36', short: 'ตะวันตก' },
  'กรุงเทพฯ และปริมณฑล': { seeds: [[36, 44]], col: '#9a7d42', short: 'กรุงเทพฯ+' },
  ตะวันออก: { seeds: [[46, 46]], col: '#7a6538', short: 'ตะวันออก' },
  ใต้: { seeds: [[38, 80], [33, 62]], col: '#665330', short: 'ใต้' },
};
let saMapCache;
function saThaiMap() {
  if (saMapCache) return saMapCache;
  const S = 5, STEP = 4, MW = 64 * S + 20, MH = 100 * S + 20;
  const pts = SA_THAI.map(([x, y]) => [x * S + 10, y * S + 10]);
  const inside = (x, y) => {
    let o = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) o = !o;
    }
    return o;
  };
  const names = Object.keys(SA_REGION);
  const gw = Math.ceil(MW / STEP), gh = Math.ceil(MH / STEP);
  const grid = new Int16Array(gw * gh).fill(-1);
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
    const x = i * STEP + 1, y = j * STEP + 1;
    if (!inside(x, y)) continue;
    let best = -1, bd = Infinity;
    names.forEach((n, k) => {
      for (const [sx, sy] of SA_REGION[n].seeds) {
        const d = Math.hypot(x - (sx * S + 10), y - (sy * S + 10)) + 60 * (saFbm(x / 70 + k * 3.1, y / 70 + k * 1.7) - 0.5);
        if (d < bd) { bd = d; best = k; }
      }
    });
    grid[j * gw + i] = best;
  }
  const at = (i, j) => (i < 0 || j < 0 || i >= gw || j >= gh ? -1 : grid[j * gw + i]);
  const off = document.createElement('canvas');
  off.width = MW;
  off.height = MH;
  const b = off.getContext('2d');
  b.fillStyle = ART_INK.lacquer;
  b.fillRect(0, 0, MW, MH);
  const img = b.getImageData(0, 0, MW, MH);
  const px = img.data;
  const cols = names.map((n) => saRgb(SA_REGION[n].col));
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
    const v = at(Math.floor(x / STEP), Math.floor(y / STEP));
    const o = (y * MW + x) * 4;
    if (v < 0) { px[o + 3] = 0; continue; }
    const sh = 0.82 + 0.3 * saFbm(x / 40, y / 40);
    px[o] = cols[v][0] * sh; px[o + 1] = cols[v][1] * sh; px[o + 2] = cols[v][2] * sh; px[o + 3] = 255;
  }
  b.putImageData(img, 0, 0);
  // ชายฝั่งเส้นเข้ม · เส้นแดนภาคเส้นจาง
  b.lineCap = 'round';
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
    const v = at(i, j);
    if (v < 0) continue;
    const x = i * STEP, y = j * STEP;
    for (const [di, dj, x1, y1, x2, y2] of [[1, 0, STEP, 0, STEP, STEP], [0, 1, 0, STEP, STEP, STEP], [-1, 0, 0, 0, 0, STEP], [0, -1, 0, 0, STEP, 0]]) {
      const u = at(i + di, j + dj);
      if (u === v || (u >= 0 && (di < 0 || dj < 0))) continue;
      b.strokeStyle = u < 0 ? '#3b2a1a' : 'rgba(80,45,25,.55)';
      b.lineWidth = u < 0 ? 2.2 : 1.4;
      b.beginPath(); b.moveTo(x + x1, y + y1); b.lineTo(x + x2, y + y2); b.stroke();
    }
  }
  const cells = Object.fromEntries(names.map((n) => [n, []]));
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { const v = at(i, j); if (v >= 0) cells[names[v]].push([i * STEP + 2, j * STEP + 2]); }
  return (saMapCache = { off, MW, MH, cells });
}
// lives = แถวสมุดอนุสรณ์ {k "seed:gen", g, p จังหวัด, t ฉายาเด่น} · fresh = k ที่ยังไม่เปิดดู · regions = ภาค→จังหวัดของข้อมูลจุดเกิด
// ชีวิตที่ไม่มีจังหวัด (ต่างโลก) ปักเกาะลอยข้างแผนที่ (เจ้าของเคาะ)
function shelfMemoArt(host, lives, fresh, regions) {
  const regionOf = (p) => { const name = (p ?? '').replace(/^จ\./, ''); return regions.find((r) => r.provinces.some((x) => x.name === name))?.name; };
  const fams = new Map();
  for (const l of lives) { const f = l.k.split(':')[0]; fams.set(f, [...(fams.get(f) ?? []), l]); }
  const gone = lives.filter((l) => !SA_REGION[regionOf(l.p)]);
  const cnt = Object.fromEntries(regions.map((r) => [r.name, lives.filter((l) => regionOf(l.p) === r.name).length]));
  const k = saCanvas(host, 200, lives.length ? `แผนที่ภาคที่เกิด ชีวิตที่จบแล้ว ${lives.length} ชีวิต ${fams.size} ตระกูล` : 'แผนที่ภาคที่เกิด ยังไม่มีชีวิตที่จบลงสมุด');
  if (!k) return null;
  const { c, W, H } = k;
  saBg(c, W, H);
  const M = saThaiMap();
  const sc = (H - 16) / M.MH, ox = 12, oy = 8, mw = M.MW * sc;
  c.drawImage(M.off, ox, oy, mw, M.MH * sc);
  const isle = [ox + mw + 38, 40];
  const at = (l) => {
    const r = regionOf(l.p);
    if (!SA_REGION[r]) return [isle[0] - 12 + saStr(l.k, 4) * 24, isle[1] - 6 + saStr(l.k, 5) * 12];
    const cs = M.cells[r];
    const [x, y] = cs[Math.floor(saStr(l.k, 6) * cs.length)];
    return [ox + x * sc, oy + y * sc];
  };
  if (gone.length) {
    c.fillStyle = '#3a2c1c';
    c.beginPath(); c.ellipse(isle[0], isle[1], 26, 14, 0, 0, Math.PI * 2); c.fill();
    saText(c, 'ต่างโลก', isle[0], isle[1] + 26, { size: 10, align: 'center', color: ART_INK.gold });
  }
  // เส้นทองต่อรุ่นในตระกูลเดียวกัน
  c.strokeStyle = 'rgba(217,180,90,.55)';
  c.lineWidth = 1.2;
  for (const xs of fams.values()) {
    c.beginPath();
    [...xs].sort((a, b) => a.g - b.g).forEach((l, i) => { const [x, y] = at(l); if (i) c.lineTo(x, y); else c.moveTo(x, y); });
    c.stroke();
  }
  for (const l of lives) {
    const [x, y] = at(l);
    if (fresh.includes(l.k)) saGlow(c, x, y, 5);
    c.fillStyle = l.t ? ART_INK.gold2 : ART_INK.cream;
    c.strokeStyle = ART_INK.lacquer;
    c.lineWidth = 1;
    c.beginPath(); c.arc(x, y, 3.4, 0, Math.PI * 2); c.fill(); c.stroke();
  }
  // ขวา: นับต่อภาค · จอแคบหัวแยก 2 บรรทัดและใช้ชื่อย่อ ไม่งั้นล้นขอบ
  const lx = ox + mw + (gone.length ? 80 : 24);
  const narrow = W - lx < 170, top = narrow ? 14 : 0, rowH = narrow ? 17 : 19;
  if (narrow) {
    saText(c, `ชีวิตที่จบแล้ว ${lives.length}`, lx, 20, { size: 12, color: ART_INK.gold2, bold: true });
    saText(c, `${fams.size} ตระกูล`, lx, 34, { size: 12, color: ART_INK.gold2, bold: true });
  } else saText(c, `ชีวิตที่จบแล้ว ${lives.length} · ${fams.size} ตระกูล`, lx, 24, { size: 13, color: ART_INK.gold2, bold: true });
  regions.forEach((r, i) => {
    c.fillStyle = SA_REGION[r.name]?.col ?? SA_MUTED;
    c.fillRect(lx, top + 38 + i * rowH, 10, 10);
    saText(c, `${narrow ? SA_REGION[r.name]?.short ?? r.name : r.name} ${cnt[r.name]}`, lx + 16, top + 47 + i * rowH, { size: 11, color: cnt[r.name] ? ART_INK.cream : SA_MUTED });
  });
  if (gone.length) saText(c, `ต่างโลก ${gone.length}`, lx + 16, top + 47 + regions.length * rowH, { size: 11 });
  // ว่าง: ป้ายวางบนแผนที่ ไม่ทับรายการภาค
  if (!lives.length) saNote(c, ox + mw / 2 + 6, H / 2, Math.min(mw + 40, 170), 'ยังไม่มีชีวิตจบ');
  k.cv.dataset.count = JSON.stringify({ lives: lives.length, fams: fams.size, gone: gone.length, byRegion: cnt });
  return k.cv;
}

// ---- ฉายา: ชั้นหนังสือ ----
// shelves = [{label, groups: [{key, name, items [{id}], got [id], gold2?}]}] ชั้นละแถว · กลุ่มในชั้นเดียวคั่นด้วยที่กั้น
// fresh = "กลุ่ม:id" ที่ยังไม่เปิดดู
function shelfTitleArt(host, shelves, fresh, got, all) {
  const k = saCanvas(host, 200, `ชั้นหนังสือฉายา เปิดแล้ว ${got} จาก ${all}`);
  if (!k) return null;
  const { c, W, H } = k;
  saBg(c, W, H, '#2a1d12', '#1a130d');
  saText(c, `ฉายาที่เปิดแล้ว ${got}/${all}`, 8, 20, { size: 13, color: ART_INK.gold2, bold: true });
  const top = 30, sh = (H - top - 6) / shelves.length;
  const counts = [];
  shelves.forEach((row, r) => {
    const base = top + sh * (r + 1) - 6;
    const n = row.groups.reduce((s, g) => s + g.items.length, 0);
    const sw = Math.min(16, (W - 100) / (n + row.groups.length - 1));
    let x = 96;
    let lit = 0;
    saText(c, row.label, 8, base - sh / 2 + 6, { size: 11, color: ART_INK.gold });
    row.groups.forEach((g, gi) => {
      if (gi) { c.fillStyle = ART_INK.bronze2; c.fillRect(x + sw * 0.4, base - sh + 14, 2, sh - 14); x += sw; }
      for (const it of g.items) {
        const on = g.got.includes(it.id);
        const hh = (sh - 16) * (0.7 + 0.3 * saStr(it.id, 2));
        if (on) lit++;
        if (fresh.includes(`${g.key}:${it.id}`)) saGlow(c, x + sw / 2, base - hh / 2, 6);
        c.fillStyle = on ? (g.gold2 ? ART_INK.gold2 : ART_INK.gold) : '#2e2216';
        c.strokeStyle = on ? '#5a4322' : '#4a3a26';
        c.lineWidth = 1;
        c.fillRect(x + 1, base - hh, sw - 2, hh);
        c.strokeRect(x + 1, base - hh, sw - 2, hh);
        if (on) { c.fillStyle = ART_INK.lacquer2; c.fillRect(x + 2, base - hh + 4, sw - 4, 1.5); c.fillRect(x + 2, base - 6, sw - 4, 1.5); }
        x += sw;
      }
    });
    c.fillStyle = '#5a4322';
    c.fillRect(90, base, W - 96, 4);
    saText(c, `${lit}/${n}`, 8, base - sh / 2 + 20, { size: 10, color: SA_MUTED });
    counts.push(lit);
  });
  k.cv.dataset.count = JSON.stringify({ got, all, shelves: counts });
  return k.cv;
}

// ---- ผังตระกูล: วงต่อรุ่นเรียงซ้าย→ขวา จบที่ "คุณ" · ชาติต่างโลกลอยแถวบน ----
// rows = แถว lineage ที่จะโชว์ (เรียงรุ่น) · more = รุ่นที่ย่อไว้ก่อนหน้า · now = ฐานะตอนนี้ของผู้เล่น · classes = ลำดับฐานะต่ำ→สูง
// prev = ชาติไทยล่าสุดของทั้งผัง — แถวที่โชว์อาจเป็นต่างโลกล้วน แต่ทางที่มา/ทิศฐานะยังเทียบกับชาติไทย
const SA_PATH = { child: 'กลับมาเป็นลูกหลาน', blood: 'เล่นต่อเป็นลูกหลาน', isekai: 'กลับจากต่างโลก' };
const SA_REALM_COL = { นรก: '#b0412e', เปรต: '#8a5a8a', ดิรัจฉาน: '#6f7d3a', มนุษย์: '#c9b27a', เทวดา: '#f0d78c', ต่างโลก: '#7aa2c8' };
const saMix = (a, b, t) => `rgb(${saRgb(a).map((v, i) => Math.round(v + (saRgb(b)[i] - v) * t)).join(',')})`;
function shelfLineageArt(host, rows, more, now, classes, youWord = 'คุณ', prev = rows.findLast((l) => !l.isekai)) {
  const home = rows.filter((l) => !l.isekai), away = rows.filter((l) => l.isekai);
  const k = saCanvas(host, 160, `ผังตระกูล ${rows.length + more} รุ่นก่อนถึง${youWord}${away.length ? ` มีชาติต่างโลก ${away.length} ชาติ` : ''}`);
  if (!k) return null;
  const { c, W, H } = k;
  saBg(c, W, H);
  const clsCol = (cls) => saMix('#5a4322', ART_INK.gold2, Math.max(0, classes.indexOf(cls)) / (classes.length - 1));
  const left = more ? 44 : 24, slots = rows.length + 1;
  const gap = Math.min(96, (W - left - 26) / Math.max(1, slots - 1));
  const yHome = H * 0.5, yAway = H * 0.2, r = Math.min(13, gap * 0.32);
  // หลายรุ่นบนจอแคบ: ตัดป้ายรองที่จะทับกัน (อายุ/ภูมิยังมีในข้อความใต้ภาพ) เหลือเลขรุ่น + จุดสีภูมิ
  const dense = gap < 52, named = gap >= 60;
  const pts = rows.map((l, i) => [left + i * gap, l.isekai ? yAway : yHome]);
  const you = [left + rows.length * gap, yHome];
  if (more) saText(c, `…${more}`, 8, yHome + 4, { size: 11, color: SA_MUTED, bold: true });
  // เส้นต่อรุ่น: ทองทึบระหว่างชาติไทย · ประเส้นเมื่อแตะชาติต่างโลก
  const seq = [...pts, you];
  for (let i = 1; i < seq.length; i++) {
    const dashed = rows[i - 1]?.isekai || rows[i]?.isekai;
    c.setLineDash(dashed ? [4, 4] : []);
    c.strokeStyle = dashed ? 'rgba(122,162,200,.7)' : 'rgba(217,180,90,.7)';
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(...seq[i - 1]); c.lineTo(...seq[i]); c.stroke();
  }
  c.setLineDash([]);
  rows.forEach((l, i) => {
    const [x, y] = pts[i];
    c.fillStyle = l.isekai ? '#2c3e52' : clsCol(l.cls);
    c.strokeStyle = l.isekai ? '#7aa2c8' : ART_INK.lacquer;
    c.lineWidth = 1.5;
    c.setLineDash(l.gone ? [3, 2] : []);
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.stroke();
    c.setLineDash([]);
    if (l.broke) { c.strokeStyle = '#d0533c'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - r * 0.7, y + r * 0.7); c.lineTo(x + r * 0.7, y - r * 0.7); c.stroke(); }
    saText(c, `${l.gen}`, x, y + 4, { size: 11, align: 'center', color: l.isekai ? '#cfe0f0' : ART_INK.lacquer, bold: true });
    if (l.isekai) { if (named) saText(c, (l.world ?? '').slice(0, 8), x, y - r - 4, { size: 9, align: 'center', color: '#a9c4dc' }); }
    else if (dense) {
      saText(c, `${l.age}`, x, y + r + 12, { size: 9, align: 'center' });
      c.fillStyle = SA_REALM_COL[l.realm] ?? SA_MUTED;
      c.beginPath(); c.arc(x, y + r + 20, 3, 0, Math.PI * 2); c.fill();
    } else {
      saText(c, `${l.gone ? 'หาย' : 'อายุ'} ${l.age}`, x, y + r + 13, { size: 10, align: 'center' });
      c.fillStyle = SA_REALM_COL[l.realm] ?? SA_MUTED;
      c.beginPath(); c.arc(x - 12, y + r + 24, 3, 0, Math.PI * 2); c.fill();
      saText(c, l.realm ?? '', x - 6, y + r + 27, { size: 9, color: SA_REALM_COL[l.realm] ?? SA_MUTED });
    }
  });
  // ปลายแถว (คุณ · รุ่นถัดไป): ฐานะ + ทิศเทียบชาติไทยก่อนหน้า + ทางที่มา
  c.fillStyle = clsCol(now);
  c.strokeStyle = ART_INK.cream;
  c.lineWidth = 2;
  c.beginPath(); c.arc(you[0], you[1], r + 2, 0, Math.PI * 2); c.fill(); c.stroke();
  // คำยาวกว่า "คุณ" ไม่พอในวง — ย้ายลงใต้วง
  const inside = youWord.length <= 3;
  saText(c, inside ? youWord : '★', you[0], you[1] + 4, { size: 10, align: 'center', color: ART_INK.lacquer, bold: true });
  if (!inside) saText(c, youWord, Math.min(W - 6, you[0] + 20), you[1] + r + 15, { size: 10, align: 'right', color: ART_INK.cream, bold: true });
  const d = prev ? classes.indexOf(now) - classes.indexOf(prev.cls) : 0;
  if (d) saText(c, `ฐานะ ${d > 0 ? '↑' : '↓'}`, Math.min(W - 6, you[0] + 20), you[1] - r - 6, { size: 10, align: 'right', color: d > 0 ? ART_INK.gold2 : '#d0533c', bold: true });
  if (prev) {
    const via = rows.at(-1)?.isekai ? SA_PATH.isekai : SA_PATH[prev.path] ?? 'เกิดใหม่ตามกรรม';
    saText(c, via, Math.min(W - 6, you[0] + r + 4), H - 8, { size: 10, align: 'right', color: ART_INK.gold });
  }
  k.cv.dataset.count = JSON.stringify({ home: home.length, away: away.length, more, slots });
  return k.cv;
}

// ค่ากลางของป้ายบนจอ (B121) — เกมกับหน้าคู่มือ (src/site/guide.mjs) อ่านที่เดียวกัน แก้ป้ายที่นี่แล้วคู่มือตามเอง
// build.mjs ต่อไฟล์นี้ก่อน app.mjs ในสคริปต์เดียว · ห้ามอ้าง document/window เพราะ Node import ตอนสร้างหน้าเว็บ

// ไอคอนบรรทัดผลย้อนบนการ์ด ("มาจากที่คุณเลือกตอนอายุ N") — คู่มือวาดไอคอนชุดเดียวกับในเกม
const FOLLOW_ICON = {
  later: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2h8M4 14h8M5 2c0 4 6 4 6 6s-6 2-6 6M11 2c0 4-6 4-6 6s6 2 6 6"/></svg>',
};
const FOLLOW_WORD = { later: 'มีผลภายหลัง' };
// หัวใจข้างอายุบนแถบสถานะตอนชีวิตใกล้หมด — ตัวห่อมี aria-label "ใกล้ตาย" ไอคอนจึงซ่อนจากโปรแกรมอ่านจอ
const HEART_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14S1.5 9.8 1.5 5.6A3.4 3.4 0 0 1 8 4a3.4 3.4 0 0 1 6.5 1.6C14.5 9.8 8 14 8 14z"/></svg>';

// ไอคอนแถบเมนู (ui-redo 50 ตาม JSON 47): เส้นบางชุดเดียวของเมนู แยกจากไอคอนค่าในป้ายผล — "ตัวฉัน" เป็นคนเดียว ไม่ใช่สองคนแบบค่าความสัมพันธ์ ตาจึงไม่สับสนเมนูกับค่า
const MENU_ICON = {
  past: '<path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v4h4"/><path d="M12 8v4l3 2"/>',
  me: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/>',
  focus: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.8"/>',
  family: '<circle cx="8" cy="8" r="2.8"/><circle cx="16.5" cy="9" r="2.3"/><path d="M3 19c.8-3.4 3-5 5-5s4.2 1.6 5 5M13.5 19c.5-2.4 1.6-3.8 3-3.8s2.6 1.4 3.2 3.8"/>',
  money: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/>',
  shelf: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
  more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
};
const menuIcon = (id) => (MENU_ICON[id] ? `<svg viewBox="0 0 24 24" aria-hidden="true">${MENU_ICON[id]}</svg>` : '');

// ป้ายผลบนปุ่มตัวเลือก (ui-redo 54 ตาม JSON ที่เจ้าของเลือก): ไอคอนเส้นต่อค่า + ลูกศร + ชิปสีตามทิศ · คู่มือวาดด้วยฟังก์ชันเดียวกัน
// ป้ายอ่านจากข้อความที่แกนส่งมา ไม่ใช่จากผลดิบ — ค่าที่แกนซ่อนเป็น ? อยู่แล้วจึงไม่มีทางได้ไอคอนเฉพาะตัว · ค่าที่ไม่มีไอคอน (บารมี เงินเทา ชาติหน้า …) คงเป็นคำ
const FX_ICON_PATH = {
  heart: 'M8 13.5S2 10 2 5.8A3 3 0 0 1 8 4.5a3 3 0 0 1 6 1.3C14 10 8 13.5 8 13.5z',
  smile: 'M8 14A6 6 0 1 1 8 2a6 6 0 0 1 0 12zM5.5 9.5q2.5 2.5 5 0M6 6.5h0M10 6.5h0',
  book: 'M2 3.5h4.5Q8 3.5 8 5v8.5q0-1.5-1.5-1.5H2zM14 3.5H9.5Q8 3.5 8 5v8.5q0-1.5 1.5-1.5H14z',
  people: 'M5.5 7.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4zM1.5 13.5q0-4 4-4t4 4M11 7a1.8 1.8 0 1 0 0-3.6M11.5 9.5q3 .5 3 4',
  coin: 'M8 14A6 6 0 1 1 8 2a6 6 0 0 1 0 12zM8 4.5v7M10 6.2Q9.5 5.5 8 5.5T6 6.7Q6 8 8 8t2 1.3T8 10.5 6 9.8',
  case: 'M2 5.5h12v8H2zM5.5 5.5V3.5h5v2M2 9h12',
  link: 'M6.5 9.5l3-3M7 4.5l1.2-1.2a2.6 2.6 0 0 1 3.7 3.7L10.7 8.2M9 11.5l-1.2 1.2a2.6 2.6 0 0 1-3.7-3.7L5.3 7.8',
  bolt: 'M9 1.5L3.5 9H8l-1 5.5L12.5 7H8z',
  spark: 'M8 1.5v4M8 10.5v4M1.5 8h4M10.5 8h4M3.5 3.5l2 2M10.5 10.5l2 2M12.5 3.5l-2 2M5.5 10.5l-2 2',
  clover: 'M8 8C5 8 3 6 4.5 4.2S8 4 8 8zm0 0c0-3 2-5 3.8-3.5S12 8 8 8zm0 0c3 0 5 2 3.5 3.8S8 12 8 8zm0 0c0 3-2 5-3.8 3.5S4 8 8 8zm0 0l2.5 6',
  star: 'M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2 .7-4.3-3.1-3 4.3-.6z',
  ask: 'M8 14A6 6 0 1 1 8 2a6 6 0 0 1 0 12zM6.2 6.2Q6.4 4.6 8 4.6t1.8 1.5Q9.8 7.2 8 7.8v1.4M8 11.2h0',
};
const FX_ICON_OF = { ชีวิต: 'heart', ความสุข: 'smile', ความรู้: 'book', ความสัมพันธ์: 'people', เงิน: 'coin', รายได้: 'case', เส้นสาย: 'link', พลัง: 'bolt', เวท: 'spark', โชค: 'clover', ทอง: 'coin', ชื่อเสียง: 'star' };
const fxIcon = (name) => `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${FX_ICON_PATH[name]}"/></svg>`;
// ไอคอนหน้าชื่อค่าบนแถบสถานะ/แผงตัวฉัน (ui-redo 80 · ข้อ 140–141): ชุดเดียวกับป้ายผล ผู้เล่นจับคู่ป้ายบนปุ่มกับค่าบนแถบได้
// อ่านตาม key ค่า ไม่ใช่ชื่อไทย — วงปรโลกใช้ key ชาติไทยแต่ชื่อต่าง (ชีวิตทิพย์ ปัญญาธรรม …) · ค่าที่ไม่มีในตาราง = ไม่มีไอคอน
const STAT_ICON_OF = { health: 'heart', happiness: 'smile', knowledge: 'book', relations: 'people', hp: 'heart', str: 'bolt', mag: 'spark', luk: 'clover', gold: 'coin' };
const statIcon = (key) => (STAT_ICON_OF[key] ? fxIcon(STAT_ICON_OF[key]) : '');
const fxEscHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const FX_ARROW_SAID = { '↑': 'เพิ่ม', '↓': 'ลด' };
// ชิ้นที่ตาเห็นต่างจากคำที่ควรอ่าน: ซ่อนชิ้นที่เห็นจากโปรแกรมอ่านจอ แล้วอ่านคำเต็มแทน
const fxSr = (cls, vis, said) => `<span class="${cls}"><span aria-hidden="true">${vis}</span><span class="sr">${fxEscHtml(said)}</span></span>`;
function fxPiece(text) {
  const stat = text.match(/^(.+?)[\s ]([↑↓])(?:[\s ](ระยะยาว))?$/);
  if (stat) {
    const [, name, arrow, long] = stat;
    const face = FX_ICON_OF[name] ? fxIcon(FX_ICON_OF[name]) : fxEscHtml(name);
    return fxSr(`fxp ${arrow === '↑' ? 'up' : 'dn'}`, `${face}<b>${arrow}</b>${long ? `<small>${long}</small>` : ''}`, `${name}${FX_ARROW_SAID[arrow]}${long ? ` ${long}` : ''}`);
  }
  // ป้าย ? ไอคอนกลางตัวเดียวทุกค่า — ไอคอนต่อค่าจะบอกว่าค่าไหนถูกซ่อน
  if (text === '?') return fxSr('fxp', fxIcon('ask'), 'ไม่รู้ผล');
  const pct = text.match(/^สำเร็จ ~(\d+)%$/);
  if (pct) return fxSr('fxp', fxEscHtml(text), `สำเร็จราว ${pct[1]}%`);
  if (text === 'สำเร็จ ?') return fxSr('fxp', fxEscHtml(text), 'สำเร็จ ไม่รู้โอกาส');
  if (/^\d+%$/.test(text)) return fxSr('fxp', fxEscHtml(text), `โอกาส ${text}`);
  // ลูกศรที่หลงอยู่กลางคำอื่นยังอ่านเป็นคำ — โปรแกรมอ่านจออ่าน ↑ ว่า "upwards arrow"
  return `<span>${text.split(/([↑↓])/).map((b) => (FX_ARROW_SAID[b] ? `<span aria-hidden="true">${b}</span><span class="sr">${FX_ARROW_SAID[b]}</span>` : fxEscHtml(b))).join('')}</span>`;
}
// ป้ายแต่ละค่าเป็นก้อนเดียว ตัดบรรทัดได้แค่ระหว่างก้อน — ไม่งั้นคำไทยหักกลางคำ
const fxHtml = (fx) => fx.split(' · ').map(fxPiece).join(' · ');
// ตารางไอคอนในคู่มือ: เฉพาะค่าที่มีไอคอนจริง ตามลำดับที่ส่งมา
const fxIconRow = (names) => names.filter((n) => FX_ICON_OF[n]).map((n) => `<span class="fxk">${fxIcon(FX_ICON_OF[n])}${fxEscHtml(n)}</span>`).join(' ');

// ป้ายปุ่มเดินเรื่องที่คู่มืออธิบาย — ปุ่มที่ผูกกับสถานการณ์เฉพาะ (ลบสมุด · ยกเลิก) ยังเขียนตรงในหน้าจอ
const BTN = {
  next: 'ต่อไป',
  reroll: 'ขอเกิดใหม่',
  toAfter: 'ไปช่วงระหว่างชาติ',
  rebirth: 'ไปเกิด',
  newFamily: 'เริ่มตระกูลใหม่',
  resume: 'เล่นต่อ',
  shelf: 'ชั้นสมุด',
  copy: 'คัดลอกสรุป',
  share: 'แชร์ชีวิตนี้',
};

// ช่วยจริง (B145): ลงเฉพาะหน่วยที่อ่านเบอร์จากเว็บของหน่วยงานเองแล้ว · หน้าจบเกมขึ้นตามเรื่องที่ชีวิตนั้นเจอ คู่มือรวมทุกหน่วย
// tel ใส่ , = รอแล้วกดต่อ (เบอร์ที่ต้องกดเลขเมนู)
const HELP = [
  { id: 'mind', label: 'อยากมีคนคุยด้วย', call: 'โทร 1323', tel: '1323', org: 'สายด่วนสุขภาพจิต กรมสุขภาพจิต · ฟรี 24 ชม.', web: 'https://www.dmh.go.th/' },
  { id: 'drink', label: 'อยากเลิกเหล้า', call: 'โทร 1413', tel: '1413', org: 'ศูนย์ปรึกษาเพื่อการเลิกสุราและการเสพติด', web: 'https://www.1413.in.th/' },
  { id: 'scam', label: 'โดนหลอกออนไลน์', call: 'โทร 1441', tel: '1441', org: 'กองบัญชาการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี · 24 ชม.', web: 'https://www.ccib.go.th/' },
  { id: 'bankrupt', label: 'เรื่องล้มละลาย/บังคับคดี', call: '1111 กด 79', tel: '1111,79', org: 'กรมบังคับคดี', web: 'https://www.led.go.th/th' },
];
// คำเตือนเนื้อหา (ui-redo 25): หน้าแรกเว็บ (data-fact warnWords) กับการ์ดแรกเกิด/หน้าเล่นต่อในเกมอ่านชุดนี้ชุดเดียว
// เติมคำเฉพาะเรื่องที่มีการ์ดจริงในเกมแล้ว (การนอกใจรอการ์ดนอกใจเข้าเกม)
const WARN_WORDS = ['ความตาย', 'หนี้', 'การสูญเสีย', 'ความรุนแรง'];
const warnWords = (w = WARN_WORDS) => `${w.slice(0, -1).join(' ')} และ${w.at(-1)}`;
const HELP_NOTE = 'เกมนี้ไม่รับเงินจากลิงก์เหล่านี้ และไม่รับบริจาค · ข้อมูลตรวจเมื่อ ตุลาคม 2569';

// ค่าบนจอ 4 ตัวทุกโลก (B162) — "ชีวิต" ช่องแรกเสมอเพราะเป็นค่าที่หมดแล้วตาย · ค่าที่ไม่อยู่ในรายการยังอยู่ในแกนเกมและมีผลเท่าเดิม แค่ไม่ขึ้นจอ
const SHOWN_STATS = ['health', 'happiness', 'knowledge', 'relations'];
const ISEKAI_SHOWN = ['str', 'mag', 'luk'];
const ISEKAI_HP = 'ชีวิต';

// คำอธิบายค่าสถานะ: บอกแค่ทิศว่าค่านั้นไปมีผลกับอะไร — ห้ามตัวเลข เกณฑ์ สูตร และไม่พูดถึงบุญบาป
// ทุกบรรทัดต้องตรงกับที่แกนเกมอ่านจริง (แก้แกนแล้วทิศเปลี่ยน ต้องแก้ที่นี่ด้วย)
const STAT_HELP = [
  ['ชีวิต', 'ลดลงเองตามวัย · ยิ่งทรุดกว่าที่ร่างกายควรเป็นตามวัยยิ่งเสี่ยงตายในปีนั้น ดูแลจนดีกว่านั้นยิ่งอยู่ยืน · หมดแถบคือตาย'],
  ['ความสุข', 'ค่อย ๆ กลับสู่ระดับเดิมของตัวเองทุกปี ช่วงสุขหรือทุกข์จึงไม่ค้างนาน · ล้มละลายทำให้ลดลง'],
  ['ความรู้', 'เพิ่มขึ้นเองทีละน้อยตามวัย · ใช้สอบเข้าเรียนต่อ และช่วยให้ทางที่ต้องใช้หัวสำเร็จง่ายขึ้น'],
  ['ความสัมพันธ์', 'จางลงเองทีละน้อยถ้าไม่ดูแล · ล้มละลายทำให้ลดลง · ถ้าไปเกิดเป็นลูกหลานในบ้านเดิม ติดตัวไปส่วนหนึ่ง'],
  ['เงิน · หนี้', 'เงินเก็บโตหรือหดตามที่เลือกลงทุน · เงินติดตัวติดลบโดนดอกเบี้ยทบ · เงินกู้หักค่างวดทุกปี · หนี้ท่วมรายได้นานหลายปีจะล้มละลาย ทรัพย์เหลือศูนย์'],
  ['ทุกค่า', 'บางทางเลือกต้องมีค่าถึงก่อนจึงกดได้ (ปุ่มบอกเหตุผล) · ค่าที่สูงหรือต่ำมากทำให้ผลบางเรื่องเอียงดีหรือร้าย และเปลี่ยนเรื่องที่จะเจอ'],
];





// APP_VERSION · APP_BUILD มาจาก src/version.json — build.mjs ประกาศไว้หัวสคริปต์ ไม่เขียนเลขในไฟล์นี้
// ชื่อไทยของเกม (B86) — คำว่า "ชาติหน้า" ที่เหลือในเกมเป็นเนื้อเรื่อง ไม่ใช่ชื่อเกม
const GAME_NAME = 'เกิดใหม่ทั้งที ชาตินี้ขอชิงมาเกิด';

const root = document.getElementById('app');
const appVer = document.getElementById('appVer');
appVer.textContent = `${APP_VERSION} · ${APP_BUILD}`;
// เลขรุ่นพาไปแพตช์โน้ตของรุ่นนั้น (B121) — หน้า whatsnew ไม่มี id ต่อรุ่น จึงเลื่อนด้วย text fragment ซึ่งตกไปหัวหน้าเองถ้าเบราว์เซอร์ไม่รองรับ
appVer.href = `whatsnew.html#:~:text=${APP_VERSION}`;

let st;
// ระหว่างชาติของชีวิตที่เพิ่งจบ (null = ยังมีชีวิต)
let af = null;
// อายุของการ์ดใบก่อนในชีวิตนี้ — ปีหนึ่งมีหลายใบได้ (B37a) หัวการ์ดจึงต้องบอกว่ายังเป็นปีเดิม
let prevAge = null;

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

const SVG = 'http://www.w3.org/2000/svg';
const baht = (v) => `${Math.round(v).toLocaleString('en-US')} บาท`;

// ชีวิต (สุขภาพ) ถึง 0 = ตาย ผู้เล่นต้องเห็นก่อนถึงจุดนั้น · ค่าอื่นต่ำไม่ทำให้ตายจึงไม่เตือน
const HEALTH_WARN = 20;

// ลูกศรปีนี้บนแถบค่า: เทียบกับค่าตอนการ์ดใบแรกของปี · ใบแรกของปีใหม่ยังเทียบกับต้นปีก่อน ผลสิ้นปีจึงไม่หายก่อนผู้เล่นเห็น
// อยู่ในหน่วยความจำของหน้า ไม่ลงเซฟ ⇒ ผลเกมไม่ขยับ · ชีวิตใหม่หรือโหลดเซฟ การ์ดแรกไม่มีลูกศร
let yearMark = null;
// ค่าที่เหตุการณ์ซ่อนไว้ (hidden ของเหตุการณ์/ตัวเลือก = ป้ายผล ?) ห้ามเผยผ่านลูกศรในปีที่เลือกทางนั้น — key = อายุ
const veiled = new Map();
function yearDelta(age, s) {
  if (yearMark?.st !== st) {
    yearMark = { st, age, base: s };
    veiled.clear();
    return null;
  }
  const from = yearMark;
  if (age !== from.age) yearMark = { st, age, base: s };
  const hide = new Set([...(veiled.get(from.age) ?? []), ...(veiled.get(age) ?? [])]);
  return Object.fromEntries(SHOWN_STATS.filter((k) => !hide.has(k)).map((k) => [k, Math.round(s[k]) - Math.round(from.base[k])]));
}
// อ่านเหตุการณ์ดิบจาก st.pending (ตัวที่การ์ดนี้ตั้งไว้) · ไม่มีเหตุการณ์ดิบแต่ป้ายผลขึ้น ? = ซ่อนทั้งแถบ ดีกว่าเผยค่าที่ซ่อน
function veil(card, i) {
  const ev = card.kind === 'event' && card.id && st.pending?.id === card.id ? st.pending : null;
  const keys = ev ? [...(ev.hidden ?? []), ...(ev.choices?.[i]?.hidden ?? [])] : card.fx?.[i]?.split(' · ').includes('?') ? SHOWN_STATS : [];
  if (keys.length) veiled.set(card.age, [...(veiled.get(card.age) ?? []), ...keys]);
}

// ป้ายเตือนพัก (ui-redo 24 · เจ้าของเคาะ): นับเวลาเฉพาะตอนแท็บเห็นอยู่ ครบ REST.at → บรรทัดจังหวัดบนแถบสถานะกลายเป็นป้ายพัก REST.show แล้วคืนบรรทัดเดิมและเริ่มนับใหม่
// ไม่มีแผ่น ไม่หยุดเกม · ซ่อนแท็บนานถึง REST.reset = ถือว่าพักแล้ว เริ่มนับใหม่ · ปรโลกไม่มีแถบสถานะจึงไม่มีป้าย
// ทางทดสอบ: play.html?rest=<วินาที> ย่นทั้งชุดเป็นวินาทีเท่านั้น (ป้ายขึ้นที่วินาทีนั้น · ขึ้นค้างเท่ากัน · ซ่อนครึ่งหนึ่งนับเป็นพัก)
// เวลาอยู่ในหน่วยความจำ ไม่เก็บลงเซฟ ⇒ ผลเกม/บอทไม่ขยับ · รีโหลดเริ่มนับใหม่
const REST_TEST = Number(new URLSearchParams(location.search).get('rest')) || 0;
const REST = REST_TEST > 0 ? { at: REST_TEST * 1000, show: REST_TEST * 1000, reset: REST_TEST * 500, tick: 250 } : { at: 2 * 3600e3, show: 10 * 60e3, reset: 5 * 60e3, tick: 30e3 };
const REST_TEXT = 'เล่นมา 2 ชม. แล้ว พักสายตาหน่อย';
let restMs = 0;
let restLast = document.hidden ? null : performance.now();
let restHidden = null;
const restOn = () => restMs >= REST.at;
// แถบที่วาดอยู่แล้วสลับข้อความเองโดยไม่วาดการ์ดใหม่ — data-where เก็บบรรทัดเดิมไว้คืน
function restPaint() {
  for (const small of document.querySelectorAll('.sb-who small[data-where]')) {
    small.textContent = restOn() ? REST_TEXT : small.dataset.where;
    small.classList.toggle('rest', restOn());
  }
}
function restStep() {
  const now = performance.now();
  if (restLast !== null) restMs += now - restLast;
  restLast = document.hidden ? null : now;
  if (restMs >= REST.at + REST.show) restMs = 0;
  restPaint();
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    restStep();
    restHidden = performance.now();
  } else {
    if (restHidden !== null && performance.now() - restHidden >= REST.reset) restMs = 0;
    restHidden = null;
    restLast = performance.now();
    restPaint();
  }
});
setInterval(restStep, REST.tick);
const whereLine = (text) => {
  const small = el('small', restOn() ? 'rest' : null, restOn() ? REST_TEXT : text);
  small.dataset.where = text;
  return small;
};

// แถบสถานะสองแถว (ui-redo ใบ 03): แถวบน อวตาร · ชื่อ+ที่ · อายุ · แถวล่าง ค่า 4 ตัว ชื่อ ตัวเลข ลูกศรปีนี้ แล้วแถบเส้น
// ใกล้ตาย = หัวใจข้างอายุ + ขอบจอแดง (CSS จับ .sb.dying) · โปรแกรมอ่านจออ่าน "ใกล้ตาย" จากหัวใจ ไม่พึ่งสี
function statusBar(card, s) {
  const bar = el('header', 'sb');
  const r1 = el('div', 'sb-r1');
  const who = el('span', 'sb-who');
  who.append(el('b', null, `${genLabel()}${st.name}`), whereLine(`${provinceLabel(st)} · ช่วง${card.stage}`), headJob(lifeJob(card.age)));
  const age = el('span', 'sb-age');
  age.append(el('b', null, card.funeral ? `จากไปอายุ ${card.age}` : String(card.age)));
  if (!card.funeral) age.append(el('small', null, ' ปี'));
  // การ์ดผลเป็นผลของใบก่อนอยู่แล้ว ป้ายซ้ำไม่บอกอะไรเพิ่ม · งานศพเกิดหลังตายจึงไม่ใช่ "ปีเดียวกัน" ของชีวิต
  if (card.kind !== 'result' && !card.funeral && card.age === prevAge) age.append(el('span', 'same', 'ปีเดียวกัน'));
  const hp = Math.round(s.health);
  if (!st.dead && hp <= HEALTH_WARN) {
    bar.classList.add('dying');
    const heart = el('span', 'sb-heart');
    heart.insertAdjacentHTML('beforeend', HEART_ICON);
    heart.setAttribute('role', 'img');
    heart.setAttribute('aria-label', 'ใกล้ตาย');
    age.append(heart);
  }
  r1.append(avatar(card.age), who, sbRight(age, lifeMoneyRow(s)));
  const delta = st.dead ? null : yearDelta(card.age, s);
  const ul = el('ul', 'sb-m');
  for (const k of SHOWN_STATS) {
    const v = Math.round(s[k]);
    const li = meterLi(STAT_LABELS[k], v, k === 'health' && v <= HEALTH_WARN, String(v), k);
    const d = delta?.[k];
    if (d) {
      const em = el('em', d < 0 ? 'dn' : null);
      const sign = el('span', null, d > 0 ? '▲' : '▼');
      sign.setAttribute('aria-hidden', 'true');
      em.append(sign, el('span', 'sr', d > 0 ? 'ปีนี้เพิ่ม ' : 'ปีนี้ลด '), String(Math.abs(d)));
      li.firstChild.append(em);
    }
    ul.append(li);
  }
  bar.append(r1, ul);
  return bar;
}
// คอลัมน์ขวาของแถวบน (ui-redo 109 · ข้อ 233): อายุ แล้วฐานะ + เงินสด (ต่างโลก "ทอง") ใต้อายุ — แถบเหลือสองส่วน ไม่มีแถวเงินแยก
function sbRight(age, money) {
  const right = el('span', 'sb-right');
  right.append(age, money);
  return right;
}
// หัวการ์ด (ui-redo ข้อ 161–162): แถวใต้ชื่อมีแค่คำ ไม่มีเกจ — ตัวเต็ม (เงินกู้ · รายได้ · ตำแหน่ง) อยู่แผงตัวฉัน (ข้อ 61 · เงินรวมเข้าแผงตัวฉันแล้ว ui-redo 131)
// อาชีพเป็นบรรทัดแยกจากบรรทัดจังหวัด ป้ายพักทับแค่บรรทัดจังหวัด (data-where) อาชีพจึงยังอยู่
const headJob = (text) => el('small', 'hd-job', text);
// เกษียณบนหัวการ์ดเหลือคำเดียว — "เคยเป็น…" ยาวจนตกบรรทัดที่ 390 และแผงตัวฉันบอกครบอยู่แล้ว
const lifeJob = (age) => {
  const t = jobText(st, age);
  return t.startsWith('เกษียณ (') ? 'เกษียณ' : t;
};
function headCash(label, value, warn = null) {
  const cash = el('span', warn ? 'hd-cash red' : 'hd-cash');
  cash.append(el('span', 'mk', label), el('b', null, value));
  // แดงต้องมีคำกำกับ ไม่พึ่งสีอย่างเดียว
  if (warn) cash.append(el('span', 'lw', warn));
  return cash;
}
function lifeMoneyRow(s) {
  const row = el('div', 'hd-row');
  // เงินกู้เป็นยอดค้างของสัญญา ไม่หักจากเงินสด (เหมือนช่องเงินในแผงตัวฉัน) — มีกู้ชนะติดลบเมื่อเป็นทั้งคู่ เพราะเป็นเหตุที่ผู้เล่นต้องทำอะไรต่อ
  const warn = totalDebt(st) > 0 ? 'มีกู้' : s.money < 0 ? 'ติดลบ' : null;
  row.append(el('span', 'mk', 'ฐานะ'), el('span', 'hd-word', classNow(st)), headCash('เงินสด', shortBaht(Math.round(s.money)), warn));
  return row;
}
// ช่องค่าหนึ่งช่อง: ป้าย ตัวเลข แถบเส้น — แถบสถานะกับแผงตัวฉันของทั้งสองโลกใช้ตัวเดียวกัน หน้าตาจึงไม่แยกกันเพี้ยน
// shown = ตัวเลขบนป้ายเมื่อไม่ใช่ค่าเดียวกับความยาวแถบ (เกจทองต่างโลก: แถบเป็น % ของสเกล ป้ายเป็นทองจริง)
// icon = key ค่าสำหรับไอคอนหน้าชื่อ · ไอคอน aria-hidden ชื่อค่ายังเป็นข้อความเดิม โปรแกรมอ่านจออ่านเท่าเดิม
function meterLi(label, v, low, shown = String(v), icon = null) {
  const li = el('li', low ? 'low' : null);
  const head = el('span', 'mh');
  const mk = el('span', 'mk', label);
  const svg = icon && statIcon(icon);
  if (svg) mk.insertAdjacentHTML('afterbegin', svg);
  head.append(mk, el('b', 'num', shown));
  const track = el('span', 'br');
  const fill = el('i');
  fill.style.width = `${v}%`;
  track.append(fill);
  li.append(head, track);
  return li;
}

// แท็บโฟกัสชาติไทย (ui-redo 50 · ข้อ 65 68 69 · JSON 47 แบบ ก รายการเดียว): ตอนนี้ · เปลี่ยนเป็น · ปณิธาน
// ไม่ใช่ตัวเลือกของการ์ด (ไม่มีเลขปุ่มลัด) · เปลี่ยนแล้วเซฟทันที ผลไปคิดตอนสิ้นปี
const focusName = (id) => (id === FOCUS_FLOW ? FOCUS_FLOW_NAME : lifeFocusDefs(st)[id].name);
const focusFx = (id) => (id === FOCUS_FLOW ? 'ไม่ทุ่มเรื่องไหนเป็นพิเศษ' : focusWords(lifeFocusDefs(st)[id], STAT_LABELS));
// ปีสะสมเป็นคำ ไม่บอกเลขเกณฑ์ (ข้อ 68) · ชำนาญแล้ว = ครบปีที่ต่อสายได้ ตัวเดียวกับที่แกนใช้เปิดปลายสาย
function focusWord(id) {
  const n = st.focusYears?.[id] ?? 0;
  if (!n) return null;
  return n >= st.content.focus.chain_years ? el('span', 'ft-word full', 'ชำนาญแล้ว') : el('span', 'ft-word', 'เริ่มชำนาญ');
}
const stageIdx = (name) => STAGES.findIndex((s) => s.name === name);
// ปณิธาน = สายต้น → ปลาย (after ในทะเบียน) ที่ยังมีความหมายตอนนี้: เลือกได้อยู่ · เคยทุ่มต้นสายแล้ว · หรือยังทันช่วงวัยของปลายสาย
// สถานะอ่านจาก focusMet ตัวเดียวกับที่แกนเปิดปลายสาย — ครบในช่วงวัยไหนเปิดตั้งแต่ช่วงถัดไป
function focusGoals(offers) {
  const defs = lifeFocusDefs(st);
  const stage = stageOf(st.age);
  const now = stageIdx(stage);
  const later = (d) => !d.stages || d.stages.some((s) => stageIdx(s) > now);
  const rows = [];
  for (const [id, d] of Object.entries(defs)) {
    if (!d.after) continue;
    const from = d.after;
    const met = st.focusMet?.[from];
    const tried = (st.focusYears?.[from] ?? 0) > 0;
    let cls = '', text;
    if (offers.includes(id)) [cls, text] = ['open', `${focusName(from)}ชำนาญแล้ว · เลือกได้ในช่วงนี้`];
    else if (met === stage) text = `${focusName(from)}ชำนาญแล้ว · เลือกได้ตั้งแต่ช่วงวัยถัดไป`;
    else if (met !== undefined) [cls, text] = later(d) || d.stages?.includes(stage) ? ['', `${focusName(from)}ชำนาญแล้ว · ยังไม่เข้าเงื่อนไขตอนนี้`] : ['gone', `${focusName(from)}ชำนาญแล้ว · ช่วงวัยที่เลือกได้ผ่านไปแล้ว`];
    else if (!later(d)) continue;
    else if (tried) text = `${focusName(from)}เริ่มชำนาญ · ทุ่มต่ออีกหน่อยจะเปิด`;
    else if (offers.includes(from)) text = 'ยังไม่ได้ทุ่ม';
    else continue;
    const li = el('li', cls || null);
    li.append(el('b', null, `${focusName(from)} → ${d.name}`), el('span', 'st', text));
    rows.push(li);
  }
  return rows;
}
function focusPanel(card) {
  const wrap = el('div', 'ft');
  if (st.dead || card.kind === 'death') {
    wrap.append(...focusSummary());
    return wrap;
  }
  const cur = st.focus ?? FOCUS_FLOW;
  const defs = lifeFocusDefs(st);
  const nowBox = el('div', 'ft-now');
  nowBox.append(el('b', null, focusName(cur)), ...[focusWord(cur)].filter(Boolean), el('span', 'ft-fx', focusFx(cur)));
  const offers = lifeFocusOffers(st);
  const ul = el('ul', 'ft-list');
  for (const id of offers) {
    const b = el('button', id === cur ? 'on' : null);
    b.type = 'button';
    b.dataset.focus = id;
    b.setAttribute('aria-pressed', String(id === cur));
    b.append(el('b', null, focusName(id)), ...[focusWord(id)].filter(Boolean));
    if (defs[id]?.after) b.append(el('span', 'ft-new', 'ปลายสาย'));
    b.append(el('span', 'ft-fx', focusFx(id)));
    b.onclick = () => {
      setLifeFocus(st, id);
      saveWrite(card);
      const next = focusPanel(card);
      wrap.replaceWith(next);
      next.querySelector(`[data-focus="${id}"]`)?.focus();
    };
    const li = el('li');
    li.append(b);
    ul.append(li);
  }
  const goals = focusGoals(offers);
  const chain = el('ul', 'ft-chain');
  chain.append(...goals);
  wrap.append(el('h3', null, 'ตอนนี้'), nowBox, el('h3', null, 'เปลี่ยนเป็น'), ul, el('h3', null, 'ปณิธาน'), goals.length ? chain : el('p', 'ft-note', 'ช่วงวัยนี้ไม่มีสายที่ต่อได้'));
  return wrap;
}
// ตอนตาย/ปรโลก (ข้อ 69): เรื่องที่ทุ่มมากสุด = focusMain ตัวเดียวกับที่ทายาทรับ · เรื่องอื่นเรียงตามปีที่ทุ่ม ไม่บอกตัวเลข
function focusSummary() {
  const defs = lifeFocusDefs(st);
  const main = focusMain(st, defs);
  const head = el('h3', null, af ? 'ชาติที่แล้วทุ่มเทมากสุด' : 'ชาตินี้ทุ่มเทมากสุด');
  if (!main) return [head, el('p', 'ft-note', `${FOCUS_FLOW_NAME} ไม่ได้ทุ่มเรื่องไหนเต็มปี`)];
  const box = el('div', 'ft-now');
  box.append(el('b', null, focusName(main)), ...[focusWord(main)].filter(Boolean));
  const kid = defs[main].kid;
  if (kid && defs[kid]) box.append(el('span', 'ft-fx', `ทายาทในตระกูลเริ่มชาติด้วย${defs[kid].name}`));
  const ys = st.focusYears ?? {};
  const rest = Object.keys(defs).filter((id) => id !== main && ys[id] > 0).sort((a, b) => ys[b] - ys[a]);
  if (!rest.length) return [head, box];
  const ul = el('ul', 'ft-ro ft-list');
  for (const id of rest) {
    const li = el('li', null, `${focusName(id)} `);
    const w = focusWord(id);
    if (w) li.append(w);
    ul.append(li);
  }
  return [head, box, el('h3', null, 'เรื่องอื่นที่เคยทุ่ม'), ul];
}

// แถบเมนูล่าง (ui-redo ใบ 04): ทางเข้าระบบที่เดียว ค้างทุกฉากของชาติไทยและต่างโลก · กดแล้วแผงขึ้นทับการ์ด ไม่วาดการ์ดใหม่ ปิดแล้วการ์ดเดิมรออยู่
// ไม่ใช่ตัวเลือกของเกม — ไม่มีเลขปุ่มลัด ไม่ลงเซฟ
// โฟกัสแยกแท็บระหว่างตัวฉัน–ครอบครัว (ui-redo 50) · ชาติไทยกับปรโลกมีไอคอนคู่ป้าย ต่างโลกยังเป็นป้ายอย่างเดียวจนใบ 51
// เงินไม่มีปุ่มของตัวเอง อยู่ในแผงตัวฉัน (ui-redo 131 · ข้อ 229)
const LIFE_MENU = [['me', 'ตัวฉัน'], ['focus', 'โฟกัส'], ['family', 'ครอบครัว'], ['shelf', 'สมุด'], ['more', 'เพิ่มเติม']];
// ต่างโลกไม่มีครอบครัวกับเงินบาทให้ดู — ทอง ชื่อเสียง อาชีพอยู่ในแผงตัวฉันของร่างนี้ (ui-redo ใบ 13)
// สกิลแยกปุ่มเพราะสมุดสกิล (06s-3) จะมาต่อที่แผงนี้ · ไม่มีปุ่มความเร็ว: ใบตาไม่เดินเอง ผู้เล่นกด "ต่อ" เองแบบชาติไทย (ui-redo 81)
const ISEKAI_MENU = [['me', 'ตัวฉัน'], ['skill', 'สกิล'], ['shelf', 'สมุด'], ['more', 'เพิ่มเติม']];
// ปรโลก (ui-redo ใบ 15 · ชุด A ของใบ 02): ชีวิตจบแล้ว ไม่มีเงินให้ดู — ตัวฉันกลายเป็นชีวิตที่แล้ว · ครอบครัวกลายเป็นตระกูล · โฟกัสเป็นสรุปชาติที่แล้ว เปลี่ยนไม่ได้
const AFTER_MENU = [['past', 'ชีวิตที่แล้ว'], ['focus', 'โฟกัส'], ['family', 'ตระกูล'], ['shelf', 'สมุด'], ['more', 'เพิ่มเติม']];
function lifeMenu(card, box, after = false) {
  // การ์ดใหม่วาดทับทั้ง root แผงเดิมหายไปด้วยแล้ว
  sheetClose = null;
  const nav = el('nav', 'mnav');
  nav.setAttribute('aria-label', 'เมนู');
  const isk = card.kind === 'isekai';
  const sheets = { me: () => (isk ? isekaiMePanel(card.status, card) : mePanel(card)), focus: () => focusPanel(card), skill: () => isekaiSkillPanel(card.status), family: after ? clanPanel : familyPanel, more: morePanel, past: pastPanel };
  // ชั้นสมุดมีแท็บ ปุ่มลบ และหน้ายืนยันของตัวเอง จึงเปิดเต็มหน้าแบบทางเข้าอื่น ไม่ยัดลงแผง · กลับแล้วคืนการ์ดเดิมทั้งก้อน
  const views = { shelf: () => openShelf() };
  // ต่างโลกช่วงยังไม่มีร่าง (ไม่มีหน้าต่างสถานะ) ไม่มีอะไรให้แผงตัวฉันกับสกิลโชว์
  const items = after ? AFTER_MENU : isk ? ISEKAI_MENU.filter(([id]) => (id !== 'me' && id !== 'skill') || card.status) : LIFE_MENU;
  for (const [id, label] of items) {
    const b = el('button', null);
    b.type = 'button';
    b.dataset.menu = id;
    if (!isk) b.insertAdjacentHTML('beforeend', menuIcon(id));
    b.append(el('span', null, label));
    if (sheets[id]) {
      b.setAttribute('aria-expanded', 'false');
      b.onclick = () => {
        const cur = root.querySelector('.sheet');
        // แผงค้าง: ปุ่มอื่นสลับแผง · ปุ่มเดิมซ้ำ = ซ่อนแผงจนกดเมนูใหม่ · ลิ้นชัก: กดปุ่มใดก็ปิด
        if (cur && (!cur.classList.contains('pin') || cur.dataset.menu === id)) {
          if (cur.classList.contains('pin')) pinId = null;
          return closeSheet();
        }
        if (pinned()) pinId = id;
        openSheet(label, sheets[id](), box, b, id);
      };
    } else {
      b.onclick = () => {
        // ปิดลิ้นชักก่อน ไม่งั้นการ์ดที่เก็บไว้คืนตอนกลับยัง inert อยู่ · แผงค้างไม่ inert เก็บไปพร้อมการ์ด กลับมาแผงเดิมยังอยู่
        unblockSheet();
        views[id]();
      };
    }
    nav.append(b);
  }
  // แผงเปิดค้างตามที่เลือกไว้ทุกการ์ด — การ์ดใหม่วาด root ใหม่ทั้งก้อน · รอ render ต่อเมนูเข้า root ก่อนค่อยเปิด
  // ต่างโลกไม่มีครอบครัว/เงิน ชีวิตไทยไม่มีสกิล ⇒ แผงที่เลือกไว้ไม่มีในเมนูนี้ เปิดตัวฉันแทน (ปรโลกเปิดชีวิตที่แล้ว)
  pinMenu = () => {
    if (!box.isConnected) return;
    const it = items.find(([id]) => id === pinId && sheets[id]) ?? items.find(([id]) => id === (after ? 'past' : 'me'));
    const b = it && nav.querySelector(`[data-menu="${it[0]}"]`);
    if (b) openSheet(it[1], sheets[it[0]](), box, b, it[0]);
  };
  queueMicrotask(pinAgain);
  return nav;
}
// แผงค้าง (ui-redo ใบ 67): จอคอมกว้างพอให้การ์ดช่องกลางไม่แคบกว่า 560 (ราว 220 + แผง 420 + ขอบการ์ด 64) แผงเปิดข้างการ์ดตั้งแต่เข้าเกม
// ไม่บัง ไม่ inert ไม่ดักโฟกัส การ์ดเล่นต่อได้ · จอแคบกว่านั้นเป็นลิ้นชักทับการ์ดแบบเดิม · จอเตี้ยใช้ราวแคบของมือถือแนวนอน ไม่ค้าง
const PIN_MQ = window.matchMedia?.('(min-width: 1264px) and (min-height: 541px)');
const pinned = () => !!PIN_MQ?.matches;
let pinId = 'me';
let pinMenu = null;
const pinAgain = () => {
  if (pinned() && pinId && !root.querySelector('.sheet')) pinMenu?.();
};
// ข้ามเส้นกว้าง/แคบ: ลิ้นชักที่เปิดอยู่กลายเป็นแผงค้าง · แผงค้างหายเมื่อจอแคบลง (ลิ้นชักไม่เปิดเอง)
PIN_MQ?.addEventListener?.('change', () => {
  closeSheet(true);
  pinAgain();
});
const unblockSheet = () => {
  if (!root.querySelector('.sheet.pin')) closeSheet();
};
// ลิ้นชัก: การ์ดใต้แผงเป็น inert — แตะหรือปุ่มลัดตัวเลขไม่ไปเลือกตัวเลือกที่ถูกบังอยู่ · Esc หรือกดปุ่มเมนูเดิมซ้ำ = ปิด
// from ว่าง = แผงที่เกมเปิดเอง (แจ้งอัปเดต) — ปิดแล้วโฟกัสกลับปุ่มแรกของจอใต้แผง · keep = ปิดเพื่อเปิดแผงอื่นต่อ ไม่ย้ายโฟกัส
let sheetClose = null;
function openSheet(title, content, box, from, id) {
  closeSheet(true);
  const pin = pinned();
  const sheet = el('section', pin ? 'sheet pin' : 'sheet');
  if (!pin) {
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
  }
  sheet.setAttribute('aria-label', title);
  if (id) sheet.dataset.menu = id;
  const head = el('div', 'sheet-h');
  const shut = el('button', 'sheet-x', 'กลับไปการ์ด');
  shut.type = 'button';
  head.append(el('h2', null, title), shut);
  sheet.append(head, content);
  sheetClose = (keep) => {
    sheet.remove();
    box.inert = false;
    from?.setAttribute('aria-expanded', 'false');
    sheetClose = null;
    if (!keep) (from ?? box.querySelector('button, a'))?.focus();
  };
  // แผงค้างของเมนู: ซ่อนจนกดเมนูใหม่ · แผงที่เกมเปิดเอง (แจ้งอัปเดต) ปิดแล้วแผงที่เลือกไว้กลับมา
  shut.onclick = () => {
    if (pin && id) pinId = null;
    closeSheet();
    pinAgain();
  };
  from?.setAttribute('aria-expanded', 'true');
  root.append(sheet);
  if (pin) return;
  box.inert = true;
  shut.focus();
}
const closeSheet = (keep) => sheetClose?.(keep);

// แผงตัวฉัน: ค่าเต็มคู่คำอธิบาย · เงิน · ฐานะและงาน (ย้ายมาจากใต้แถบสถานะของการ์ด) · ไม่มีลูกศรปีนี้ —
// โฟกัสย้ายไปแท็บของตัวเองแล้ว (ui-redo 50) · การ์ดตายเปิดได้เหมือนกัน เห็นค่าตอนจากไป
// คำอธิบาย "เงิน · หนี้" อยู่ใต้เงินที่เดียว (ui-redo 131 · ข้อ 229) · ประวัติงานท้ายฐานะและงาน
function mePanel(card) {
  const s = statsOf(st);
  const help = new Map(STAT_HELP);
  const wrap = el('div', 'me');
  // คำอธิบายทุกชิ้นพับด้วยปุ่มเดียว (ข้อ 230) — เกจกับยอดเงินไม่พับ
  const hp = [];
  const ul = el('ul', 'me-m');
  for (const k of SHOWN_STATS) {
    const v = Math.round(s[k]);
    const li = meterLi(STAT_LABELS[k], v, k === 'health' && v <= HEALTH_WARN && !st.dead, String(v), k);
    if (help.has(STAT_LABELS[k])) li.append(hp[hp.push(el('p', null, help.get(STAT_LABELS[k]))) - 1]);
    ul.append(li);
  }
  const shown = new Set([...SHOWN_STATS.map((k) => STAT_LABELS[k]), MONEY_HELP]);
  const dl = el('dl');
  for (const [k, v] of STAT_HELP) if (!shown.has(k)) dl.append(el('dt', null, k), el('dd', null, v));
  hp.push(dl);
  const hh = el('div', 'me-hh');
  const fold = el('button', 'me-fold');
  fold.type = 'button';
  const setOpen = (open) => {
    for (const e of hp) e.hidden = !open;
    fold.setAttribute('aria-expanded', String(open));
    fold.textContent = open ? 'ซ่อนคำอธิบาย' : 'ดูคำอธิบาย';
  };
  fold.onclick = () => {
    const open = fold.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
    meHelpSave(open);
  };
  hh.append(el('h3', null, 'ค่าสถานะ'), fold);
  wrap.append(hh, ul, dl, el('h3', null, 'เงิน'), moneyBox(card, hp));
  const meta = el('p', 'meta');
  metaLine(meta, standParts(card));
  wrap.append(el('h3', null, 'ฐานะและงาน'), meta);
  const wh = workHistory();
  if (wh) wrap.append(el('h3', null, 'งานที่เคยทำ'), wh);
  if (itemsVisible(st)) wrap.append(el('h3', null, 'ของติดตัว'), kitList());
  setOpen(meHelpOpen());
  return wrap;
}
const MONEY_HELP = 'เงิน · หนี้';
// พับ/กางคำอธิบายจำในเครื่อง ไม่ลงเซฟเกม (ข้อ 230) · ไม่เคยกด = พับ · storage ปิด = พับทุกครั้ง ไม่พัง
const ME_HELP_KEY = 'next-life-me-help-v1';
function meHelpOpen() {
  try {
    return localStorage.getItem(ME_HELP_KEY) === 'open';
  } catch {
    return false;
  }
}
function meHelpSave(open) {
  try {
    localStorage.setItem(ME_HELP_KEY, open ? 'open' : 'closed');
  } catch {
    // ไม่มี storage: ค่าพับอยู่แค่แผงนี้
  }
}
// ประวัติงานเรียงช่วงอายุจาก st.workSpans (ข้อ 231) · ปีที่ทำก่อนมีช่องนี้ (เซฟเก่า) ขึ้นเป็นปีรวมต่ออาชีพไว้ก่อน ไม่มีอายุ
// เพราะไม่รู้ว่าทำช่วงไหน — เจ้าของเคาะไม่เดาอายุย้อนหลัง · ยังไม่เคยทำงาน = ไม่มีหัวนี้
function workHistory() {
  const occs = st.content.era.finance.occupations;
  const name = (id) => occs.find((o) => o.id === id)?.name ?? id;
  const spans = st.workSpans ?? [];
  const inSpans = {};
  for (const x of spans) inSpans[x.occ] = (inSpans[x.occ] ?? 0) + x.to - x.from + 1;
  const ul = el('ul', 'wh wh-me');
  for (const [id, n] of Object.entries(st.workYears ?? {})) {
    const left = n - (inSpans[id] ?? 0);
    if (left <= 0) continue;
    const li = el('li');
    li.append(el('span', null, name(id)), el('b', 'num', `${left} ปี`));
    ul.append(li);
  }
  const last = spans.at(-1);
  // ปีนี้ยังไม่ถูกนับ (นับตอนขึ้นปี) — ช่วงที่จบปีที่แล้วด้วยอาชีพเดิมและยังทำอยู่คือช่วงปัจจุบัน
  const now = !st.dead && isWorking(st) && last?.occ === st.occupation && last.to === st.age - 1;
  for (const x of spans) {
    const li = el('li');
    const to = x === last && now ? 'ตอนนี้' : x.to === x.from ? '' : x.to;
    li.append(el('span', 'wh-age', `อายุ ${x.from}${to === '' ? '' : `–${to}`}`), el('span', null, name(x.occ)));
    ul.append(li);
  }
  return ul.childElementCount ? ul : null;
}
// ของติดตัว (B78): ช่องสวมใส่ตามทะเบียน + กระเป๋า n/cap · ไม่มีปุ่มใส่/ถอด — ของลงช่องเองตอนได้ เป้เต็มขายเอง
// ช่องว่างเขียนว่า "ว่าง" ให้เห็นว่ามีช่องรออยู่ (หัวนี้โชว์เฉพาะเมื่อ itemsVisible)
function kitList() {
  const it = itemsOf(st);
  const reg = st.content.items;
  const name = (id) => reg.list[id].name;
  const dl = el('dl', 'kit');
  for (const [k, label] of Object.entries(reg.slots)) dl.append(el('dt', null, label), el('dd', null, it.wear[k] ? name(it.wear[k]) : 'ว่าง'));
  dl.append(el('dt', null, `กระเป๋า ${it.bag.length}/${it.cap}`), el('dd', null, it.bag.map(name).join(' · ') || 'ว่าง'));
  return dl;
}
// ช่วงเรียน ป้ายเรียนแทนช่อง "กำลังเรียน…" ที่บอกเรื่องเดียวกัน · เป้าหมายอื่นต่อท้ายบรรทัดฐานะ
// ฐานะ ณ ปีนี้ (ตัวเดียวกับที่การ์ดเช็กชนชั้น) ไม่ใช่ชนชั้นตอนเกิด — ฐานะตอนเกิดยังดูได้ที่กราฟฐานะตระกูล
function standParts(card) {
  if (card.kind === 'death') return [`ฐานะ${classNow(st)}`, card.job, st.edu && `วุฒิ${st.edu}`].filter(Boolean);
  const goal = nextGoal(st);
  const school = goal && schoolOf(st) !== 'none';
  return [`ฐานะ${classNow(st)}`, school ? goal : jobText(st, card.age), goal && !school && goal].filter(Boolean);
}
// จอแคบให้ตัดบรรทัดได้แค่ที่ตัวคั่น — เบราว์เซอร์ตัดคำไทยกลาง "ราย|ได้" ได้แม้เว้นวรรคแบบไม่ตัด จึงต้องห่อ span
const metaLine = (row, parts) => parts.forEach((t, i) => row.append(...(i ? [' · '] : []), el('span', null, t)));

// ป้ายแกนเงินสั้นพอวางข้างกราฟ เป็นคำไทย: 1.5 หมื่น · 1.2 ล้าน (ผู้เล่นไม่คุ้น "k")
function shortBaht(v) {
  const a = Math.abs(v), sign = v < 0 ? '−' : '';
  const num = (x) => String(Number(x.toFixed(x < 10 ? 1 : 0)));
  if (a >= 1e6) return `${sign}${num(a / 1e6)} ล้าน`;
  if (a >= 1e5) return `${sign}${num(a / 1e5)} แสน`;
  if (a >= 1e4) return `${sign}${num(a / 1e4)} หมื่น`;
  if (a >= 1e3) return `${sign}${num(a / 1e3)} พัน`;
  return `${sign}${Math.round(a)}`;
}

// ขั้นแกนตั้งเลขกลม (1 · 2 · 2.5 · 5 × 10^n) ให้ได้ราว 2 ช่อง
function niceStep(span) {
  const raw = span / 2, p = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= raw);
}

const svgEl = (tag, attrs, text) => {
  const n = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
};

// แถบช่วงวัยเป็นพื้นหลังกราฟ (B38a) — x(age) ของกราฟนั้นเอง กราฟค่าสถานะกับกราฟเงินจึงแบ่งช่วงตรงกัน
function stageBands(svg, ageX, fromAge, toAge, top, bottom, labels) {
  STAGES.forEach((s, i) => {
    const a = Math.max(s.from, fromAge), b = Math.min(STAGES[i + 1]?.from ?? Infinity, toAge);
    if (b <= a) return;
    svg.append(svgEl('rect', { class: `band band${i % 2}`, x: ageX(a), y: top, width: ageX(b) - ageX(a), height: bottom - top }));
    // ช่วงแคบเกินป้ายจะทับกัน — ชื่อช่วงยังอ่านได้จากแถบสลับสีกับแกนอายุ
    if (labels && ageX(b) - ageX(a) >= 34) svg.append(svgEl('text', { class: 'tb', x: (ageX(a) + ageX(b)) / 2, y: top - 4, 'text-anchor': 'middle' }, s.name));
  });
}

// กราฟเงินของช่วงที่ผ่านไป — แกนตั้งรวมศูนย์เสมอ ส่วนต่างเล็กจึงดูเล็ก · viewBox คงสัดส่วนให้ตัวหนังสือไม่บิด
// จุดเดียวไม่มีเส้นให้วาด · bands = แถบช่วงวัยพื้นหลัง (กราฟทั้งชีวิต)
function sparkline(series, fromAge, toAge, bands = false) {
  if (series.length < 2) return null;
  const nom = series.map((p) => p.money);
  let lo = Math.min(0, ...nom), hi = Math.max(0, ...nom);
  if (hi === lo) hi = 1;
  const step = niceStep(hi - lo);
  lo = Math.floor(lo / step) * step;
  hi = Math.ceil(hi / step) * step;
  const W = 320, H = 118, L = 46, R = 8, T = 6, B = 20;
  const x = (i) => L + (i / (series.length - 1)) * (W - L - R);
  const y = (v) => T + ((hi - v) / (hi - lo)) * (H - T - B);
  const svg = svgEl('svg', { class: 'spark', viewBox: `0 0 ${W} ${H}`, role: 'img',
    'aria-label': `เงินติดตัว ${baht(nom[0])} → ${baht(nom.at(-1))}` });
  // จุดสุดท้ายคือเงินตอนสิ้นอายุ toAge — ป้ายจึงยึดช่วงอายุเดียวกับหัวกล่อง ไม่นับจากจำนวนจุด
  const ageX = (a) => L + ((a - fromAge) / Math.max(toAge - fromAge, 1)) * (W - L - R);
  if (bands) stageBands(svg, ageX, fromAge, toAge, T, H - B, false);
  if (lo < 0) svg.append(svgEl('rect', { class: 'neg', x: L, y: y(0), width: W - L - R, height: y(lo) - y(0) }));
  for (let v = lo; v <= hi + step / 2; v += step) {
    svg.append(svgEl('line', { class: v === 0 ? 'zero' : 'grid', x1: L, x2: W - R, y1: y(v), y2: y(v) }));
    svg.append(svgEl('text', { class: 'ty', x: L - 4, y: y(v) + 3.5 }, v === 0 ? '0' : shortBaht(v)));
  }
  const ages = toAge - fromAge >= 10 ? [fromAge, Math.round((fromAge + toAge) / 2), toAge] : [fromAge, toAge];
  const anchor = (a) => (a === fromAge ? 'start' : a === toAge ? 'end' : 'middle');
  for (const a of ages) svg.append(svgEl('text', { class: 'tx', x: ageX(a), y: H - 6, 'text-anchor': anchor(a) }, `อายุ ${a}`));
  const path = (vals, cls) => svgEl('polyline', { class: cls, points: vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ') });
  svg.append(path(nom, 'nom'));
  for (const i of [0, series.length - 1]) svg.append(svgEl('circle', { class: 'dot', cx: x(i), cy: y(nom[i]), r: 3 }));
  return svg;
}

// กราฟทั้งชีวิตบนบันทึกการตาย (B38a): ค่าสถานะ 5 เส้นสเกลเดียวกัน + เงินแยกใต้ แกนอายุเดียวกัน
// เส้นแยกด้วยสีและลายเส้น (ไม่พึ่งสีอย่างเดียว) · แกนตั้งเป็นตัวเลข 0–100 สเกลเดียวกับแถบค่าสถานะ
const LINE_DASH = ['', '7 3', '2 3', '9 3 2 3', '4 2'];
function legendItem(i, label) {
  const key = svgEl('svg', { class: 'key', viewBox: '0 0 24 8', 'aria-hidden': 'true' });
  key.append(svgEl('line', { class: `ln ln${i}`, x1: 0, x2: 24, y1: 4, y2: 4, 'stroke-dasharray': LINE_DASH[i] }));
  const li = el('li');
  li.append(key, label);
  return li;
}
// หมุดบนกราฟ: ชี้/แตะ/โฟกัสแล้วบรรทัดใต้กราฟบอกเรื่อง — มือถือไม่มี hover <title> อย่างเดียวไม่พอ
function markDot(svg, cap, cx, cy, r, text, cls) {
  markShapes(svg, cap, text, cls, svgEl('circle', { cx, cy, r }));
}
function markShapes(svg, cap, text, cls, ...shapes) {
  const g = svgEl('g', { class: `mk ${cls}`, tabindex: 0, role: 'button', 'aria-label': text });
  g.append(svgEl('title', {}, text), ...shapes);
  const show = () => (cap.textContent = text);
  g.addEventListener('click', show);
  g.addEventListener('focus', show);
  g.addEventListener('mouseenter', show);
  svg.append(g);
}
// เรื่องเด่นทั้งชีวิต = เรื่องเด่นของแต่ละช่วงวัยชุดเดียวกับการ์ดเปลี่ยนช่วง (ผู้เล่นเคยเห็นแล้ว ไม่มีของใหม่ให้รั่ว)
function lifeMarks(deathAge) {
  return STAGES.flatMap((s, i) => (s.from > deathAge ? [] : stageSummary(st, s.name, s.from, Math.min((STAGES[i + 1]?.from ?? Infinity) - 1, deathAge)).highlights));
}
// สาเหตุการตาย (B110): ตารางอยู่ engine (causeWords) ให้จดหมายคำฝากใช้ข้อยกเว้นชุดเดียวกัน · หายไปต่างโลกไม่ใช่การตาย
const causeOf = (cause, age) => (isGone(st) ? null : causeWords(cause, age));
// เหตุและผล (gameslash-4): นัดที่ยิงแล้ว คู่ที่ห่างที่สุดไม่เกิน ECHO_MAX · แถบแยกใต้กราฟ — เส้นโค้งทับเส้นค่าสถานะแล้วอ่านไม่ออก
// เล่าแค่ตัวเลือกกับชื่อการ์ดที่ผู้เล่นเห็นมาแล้ว ไม่มีสี/คำบอกดีร้าย · missed = นัดที่สุ่มไม่ผ่าน ไม่มีผลให้โยง
const ECHO_MAX = 5;
function echoBand(x, W, deathAge, cap) {
  const pairs = (st.echoes ?? []).filter((e) => !e.missed && e.age <= deathAge).map((e, i) => ({ ...e, i }));
  if (!pairs.length) return null;
  const top = pairs.sort((a, b) => b.age - b.from - (a.age - a.from) || a.i - b.i).slice(0, ECHO_MAX).sort((a, b) => a.from - b.from || a.age - b.age);
  const H = 40, base = H - 6, far = Math.max(...top.map((e) => e.age - e.from));
  const svg = svgEl('svg', { class: 'spark echo', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `เหตุและผล ${top.length} เรื่อง` });
  const list = el('ol', 'echo-list');
  for (const e of top) {
    const text = `อายุ ${e.from} · ${e.pick} → อายุ ${e.age}${e.title ? ` · ${e.title}` : ''}`;
    const x1 = x(e.from), x2 = x(e.age), lift = 2 * (8 + 22 * ((e.age - e.from) / far));
    const d = `M${x1.toFixed(1)},${base} Q${((x1 + x2) / 2).toFixed(1)},${(base - lift).toFixed(1)} ${x2.toFixed(1)},${base}`;
    // เส้นหนาโปร่งใสรับนิ้ว — เส้นจริงบางเกินจะแตะโดนบนมือถือ
    markShapes(svg, cap, text, 'arc', svgEl('path', { class: 'hit', d }), svgEl('path', { d }), svgEl('circle', { cx: x1, cy: base, r: 2.5 }), svgEl('circle', { cx: x2, cy: base, r: 2.5 }));
    list.append(el('li', null, text));
  }
  return [svg, list];
}
function lifeChart(life, deathAge, cause) {
  if (life.stats.length < 2) return null;
  const box = el('div', 'lifechart');
  const W = 320, H = 158, L = 46, R = 8, T = 18, B = 20;
  const x = (a) => L + (a / Math.max(deathAge, 1)) * (W - L - R);
  const y = (v) => T + ((100 - v) / 100) * (H - T - B);
  const svg = svgEl('svg', { class: 'spark life', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `ค่าสถานะตลอดชีวิต อายุ 0 ถึง ${deathAge}` });
  stageBands(svg, x, 0, deathAge, T, H - B, true);
  for (const [v, t] of [[100, '100'], [50, '50'], [0, '0']]) {
    svg.append(svgEl('line', { class: 'grid', x1: L, x2: W - R, y1: y(v), y2: y(v) }));
    if (t) svg.append(svgEl('text', { class: 'ty', x: L - 4, y: y(v) + 3.5 }, t));
  }
  const ages = deathAge >= 10 ? [0, Math.round(deathAge / 2), deathAge] : [0, deathAge];
  for (const a of ages) svg.append(svgEl('text', { class: 'tx', x: x(a), y: H - 6, 'text-anchor': a === 0 ? 'start' : a === deathAge ? 'end' : 'middle' }, `อายุ ${a}`));
  // คำอธิบายเส้นบอกค่าปลายเส้น (ตอนจากไป) — ตัวเลขเดียวกับแถบบนการ์ดใบสุดท้าย
  const legend = el('ul', 'legend');
  legend.append(el('li', null, 'ตอนจากไป'));
  const end = life.stats.at(-1);
  SHOWN_STATS.forEach((k, i) => {
    const pts = life.stats.map((p) => `${x(p.age).toFixed(1)},${y(p[k]).toFixed(1)}`).join(' ');
    svg.append(svgEl('polyline', { class: `ln ln${i}`, points: pts, 'stroke-dasharray': LINE_DASH[i] }));
    legend.append(legendItem(i, `${STAT_LABELS[k]} ${Math.round(end[k])}`));
  });
  // จุดเรื่องเด่น + จุดตาย (B38)
  const cap = el('p', 'mk-cap', 'แตะจุดบนกราฟเพื่อดูเรื่องในปีนั้น');
  cap.setAttribute('aria-live', 'polite');
  const mark = (a, text, cls) => markDot(svg, cap, x(a), H - B - 5, 4, text, cls);
  for (const m of lifeMarks(deathAge)) mark(m.age, `อายุ ${m.age} · ${m.text}`, 'ev');
  const why = causeOf(cause, deathAge);
  mark(deathAge, `${lifeEndWord(isGone(st))} ${deathAge}${why ? ` · ${why[1]}` : ''}`, 'death');
  box.append(svg, legend, cap);
  const echoes = echoBand(x, W, deathAge, cap);
  if (echoes) box.append(el('div', 'h', 'เหตุและผล'), ...echoes);
  const arcs = arcSummary(st);
  if (arcs.length) {
    const list = el('ol', 'echo-list');
    for (const a of arcs) list.append(el('li', null, `${a.name} · ${a.n} ตอน · ${a.end ? 'จบเรื่องแล้ว' : 'ยังค้างอยู่'}`));
    box.append(el('div', 'h', 'เรื่องต่อเนื่อง'), list);
  }
  const money = sparkline(life.money, 0, deathAge, true);
  if (money) box.append(el('div', 'h', 'เงินติดตัว'), money);
  return fold(box, `ทั้งชีวิต · อายุ 0–${deathAge}`);
}
// แผงย่อยบนมรณบัตรพับไว้ก่อน หัวข้อยังเห็น แตะเพื่อเปิด — การ์ดยาวจนปุ่มไปต่อจมใต้จอ
// เนื้อในห่อ div แยก: details ตั้ง display:flex ไม่ได้ทุกเบราว์เซอร์ ระยะห่างแบบ flex ของแผงจึงอยู่ที่ตัวห่อ
// fresh = ป้ายอ่านจอของจุดแดง "ใหม่" บนหัวแผง · เปิดแผงแล้วจุดหายและเรียก onOpen ครั้งเดียว
function fold(box, label, fresh = null, onOpen = null) {
  const d = el('details', 'fold');
  const inner = el('div', 'fold-in');
  inner.append(...box.childNodes);
  const sum = el('summary', null, label);
  if (fresh) {
    sum.append(newDot(fresh));
    d.addEventListener('toggle', () => {
      if (!d.open || !sum.lastChild?.classList?.contains('new-dot')) return;
      sum.lastChild.remove();
      onOpen?.();
    });
  }
  d.append(sum, inner);
  box.replaceChildren(d);
  return box;
}

// กราฟฐานะตระกูล (B95): ฐานะ 10 ระดับต้นทุกช่วงวัยทุกรุ่นต่อกันเป็นเส้นเดียว รุ่นละช่องกว้างเท่ากัน 10+ รุ่นก็ไม่ล้น
// เส้นข้ามรุ่น = ฐานะตอนตาย → ฐานะบ้านที่รุ่นถัดไปเกิด · ขาลงแยกสีและลายเส้น (ไม่พึ่งสีอย่างเดียว) ให้เห็นการตกชั้นชัด
// ใช้แค่ฐานะ อายุ ชื่อ และการตายพร้อมหนี้ — ไม่มีบัญชีบุญบาป
function standingGens(lineage, life = null) {
  // รุ่นต่างโลก (B68a) ไม่มีฐานะไทยให้วาด — ข้ามไป เส้นต่อจากชาติไทยก่อนหน้าไปรุ่นไทยถัดไป
  const gens = lineage.filter((l) => !l.isekai).map((l) => ({ gen: l.gen, name: l.name, age: l.age, gone: l.gone, broke: l.broke, pts: l.standing ?? [{ age: 0, cls: CLASSES.indexOf(l.cls) }] }));
  return life ? [...gens, life] : gens;
}
// ชีวิตนี้: จุดต้นช่วงวัยที่แกนจดไว้ + ฐานะ ณ ตอนนี้ (หรือตอนตาย) เป็นจุดท้าย
function standingNow(dead) {
  const pts = [...st.standing.filter((p) => p.age < st.age), { age: st.age, cls: standingOf(st) }];
  return { gen: st.gen, name: st.name, age: st.age, live: !dead, pts };
}
// ช่องรุ่นถัดไปมีจุดเดียว จึงแคบกว่าช่องรุ่นปกติ
const NEXT_GEN_W = 0.3;
function standingLayout(gens, next) {
  const units = gens.length + (next != null ? NEXT_GEN_W : 0);
  const pts = gens.flatMap((g, i) => g.pts.map((p) => ({ u: i + 0.06 + (p.age / Math.max(g.age, 1)) * 0.88, cls: p.cls, g, end: p === g.pts.at(-1) })));
  if (next != null) pts.push({ u: gens.length + NEXT_GEN_W / 2, cls: next, next: true });
  return { units, pts };
}
const standingWord = (p) => (p.next ? `รุ่นถัดไปเกิดฐานะ${CLASSES[p.cls]}` : p.g.live ? `${genWord(p.g.gen)}ตอนนี้ อายุ ${p.g.age} · ฐานะ${CLASSES[p.cls]}`
  : `${genWord(p.g.gen)}${p.g.name ? `${p.g.name} · ` : ''}${lifeEndWord(p.g.gone)} ${p.g.age} · ฐานะตอน${p.g.gone ? 'หายตัว' : 'ตาย'}${CLASSES[p.cls]}${p.g.broke ? ' · จากไปพร้อมหนี้' : ''}`);
const genWord = (g) => `รุ่นที่ ${g} · `;
function standingChart(gens, next = null, head = true) {
  const { units, pts } = standingLayout(gens, next);
  if (pts.length < 2) return null;
  const box = el('div', 'lifechart stand');
  if (head) box.append(el('div', 'h', gens.length > 1 ? `ฐานะตระกูล · ${gens.length} รุ่น` : 'ฐานะตระกูล'));
  const W = 320, H = 132, L = 50, R = 8, T = 8, B = 22;
  const x = (u) => L + (u / units) * (W - L - R);
  const y = (c) => T + ((CLASSES.length - 1 - c) / (CLASSES.length - 1)) * (H - T - B);
  const first = pts[0].cls, last = pts.at(-1).cls, peak = Math.max(...pts.map((p) => p.cls));
  const svg = svgEl('svg', { class: 'spark stand', viewBox: `0 0 ${W} ${H}`, role: 'img',
    'aria-label': `ฐานะตระกูล ${gens.length} รุ่น · เริ่ม${CLASSES[first]} · สูงสุด${CLASSES[peak]} · ล่าสุด${CLASSES[last]}` });
  gens.forEach((g, i) => {
    svg.append(svgEl('rect', { class: `band band${i % 2}`, x: x(i), y: T, width: x(i + 1) - x(i), height: H - T - B }));
    const w = x(i + 1) - x(i);
    // ช่องแคบเหลือแค่เลขรุ่น · แคบกว่านั้นติดป้ายเฉพาะรุ่นแรกกับรุ่นท้าย
    const label = w >= 34 ? `รุ่น ${g.gen}` : w >= 12 || i === 0 || i === gens.length - 1 ? `${g.gen}` : null;
    if (label) svg.append(svgEl('text', { class: 'tx', x: (x(i) + x(i + 1)) / 2, y: H - 6, 'text-anchor': 'middle' }, label));
  });
  // ช่องรุ่นถัดไปแคบเมื่อรุ่นเยอะ ป้ายจะทับเลขรุ่นท้าย — จุดนั้นยังแตะดูได้
  if (next != null && x(units) - x(gens.length) >= 26) svg.append(svgEl('text', { class: 'tx', x: W - R, y: H - 6, 'text-anchor': 'end' }, 'ถัดไป'));
  for (const [c, t] of [[CLASSES.length - 1, CLASSES.at(-1)], [5, 'ชั้นกลาง'], [0, CLASSES[0]]]) {
    svg.append(svgEl('line', { class: 'grid', x1: L, x2: W - R, y1: y(c), y2: y(c) }));
    svg.append(svgEl('text', { class: 'ty', x: L - 4, y: y(c) + 3.5 }, t));
  }
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const dir = b.cls > a.cls ? 'su' : b.cls < a.cls ? 'sd' : 'se';
    svg.append(svgEl('line', { class: `sg ${dir}`, x1: x(a.u).toFixed(1), y1: y(a.cls).toFixed(1), x2: x(b.u).toFixed(1), y2: y(b.cls).toFixed(1) }));
  }
  // จุดท้ายของแต่ละรุ่น (ตาย/ตอนนี้) + จุดรุ่นถัดไป แตะดูได้ — มือถือไม่มี hover จึงบอกในบรรทัดใต้กราฟ
  const cap = el('p', 'mk-cap', 'แตะจุดบนกราฟเพื่อดูฐานะแต่ละรุ่น');
  cap.setAttribute('aria-live', 'polite');
  for (const p of pts.filter((q) => q.end || q.next)) {
    const text = standingWord(p);
    const g = svgEl('g', { class: `mk ${p.next ? 'nx' : p.g.broke ? 'broke' : 'ev'}`, tabindex: 0, role: 'button', 'aria-label': text });
    g.append(svgEl('title', {}, text), svgEl(p.g?.broke ? 'rect' : 'circle', p.g?.broke
      ? { x: x(p.u) - 3.5, y: y(p.cls) - 3.5, width: 7, height: 7 } : { cx: x(p.u), cy: y(p.cls), r: 3.5 }));
    const show = () => (cap.textContent = text);
    g.addEventListener('click', show);
    g.addEventListener('focus', show);
    g.addEventListener('mouseenter', show);
    svg.append(g);
  }
  const legend = el('ul', 'legend');
  for (const [cls, label] of [['su', 'ไต่ขึ้น'], ['sd', 'ตกชั้น']]) {
    const key = svgEl('svg', { class: 'key', viewBox: '0 0 24 8', 'aria-hidden': 'true' });
    key.append(svgEl('line', { class: `sg ${cls}`, x1: 0, x2: 24, y1: 4, y2: 4 }));
    const li = el('li');
    li.append(key, label);
    legend.append(li);
  }
  if (gens.some((g) => g.broke)) {
    const key = svgEl('svg', { class: 'key', viewBox: '0 0 24 8', 'aria-hidden': 'true' });
    const g = svgEl('g', { class: 'mk broke' });
    g.append(svgEl('rect', { x: 8.5, y: 0.5, width: 7, height: 7 }));
    key.append(g);
    const li = el('li');
    li.append(key, 'จากไปพร้อมหนี้');
    legend.append(li);
  }
  box.append(svg, legend, cap);
  return box;
}

function list(items, cls = 'items') {
  const ul = el('ul', cls);
  for (const it of items) ul.append(el('li', null, it));
  return ul;
}

// ผังตระกูลที่มีชาติต่างโลกแยกสองกลุ่ม โลกเดิม | ต่างโลก (B68h) — ไม่มีชาติต่างโลกหน้าตาเดิม
// ของที่แต่ละโลกจำนับจากทั้งเซฟ ไม่ใช่แค่แถวที่ย่อโชว์ · บทบาทที่ไม่มีโลกของตัวเองใช้ชื่อบทบาทจากแถวผังแทน
function lineageList(all, brief = all.length) {
  const shown = all.slice(-brief);
  const more = all.length > shown.length ? [`… ก่อนหน้านี้อีก ${all.length - shown.length} รุ่น`] : [];
  const lore = Object.entries(isekaiWorldLore(all));
  const away = shown.filter((l) => l.isekai);
  if (!away.length && !lore.length) return list([...more, ...lineageText(shown)], 'picks');
  const box = el('div', 'lineage');
  const home = shown.filter((l) => !l.isekai);
  if (home.length || more.length) box.append(el('div', 'lh', 'ตระกูลโลกเดิม'), list([...more, ...lineageText(home)], 'picks'));
  box.append(el('div', 'lh', 'ตระกูลต่างโลก'));
  if (away.length) box.append(list(lineageText(away), 'picks'));
  for (const [w, ids] of lore) box.append(el('p', 'llore', `โลก (${ISEKAI_WORLDS[w]?.name ?? all.find((l) => l.lore?.world === w)?.world ?? w}) ยังจำ: ${ids.map((id) => ISEKAI_LORE[id]).join(' · ')}`));
  return box;
}

// ผังตระกูลเป็นภาพ (เจ้าของสั่ง) · ข้อความเดิมพับไว้ใต้ภาพ — ชื่อ จังหวัด ฉายา และ screen reader ยังอ่านได้
function lineageView(all, now, brief = all.length, youWord) {
  const box = el('div', 'lineage-view');
  const shown = all.slice(-brief);
  const draw = () => shelfLineageArt(box, shown, all.length - shown.length, now, CLASSES, youWord, all.findLast((l) => !l.isekai));
  let cv = draw();
  const d = el('details', 'lineage-text');
  d.append(el('summary', null, 'อ่านเป็นข้อความ'), lineageList(all, brief));
  box.append(d);
  // การ์ดสร้างก่อนติดหน้า (และจอหมุน/ย่อได้ภายหลัง) ภาพที่วาดไว้ถูก CSS ยืดจนวงกลมเป็นวงรี — วาดใหม่ทุกครั้งที่ความกว้างจริงเปลี่ยน
  if (cv && typeof ResizeObserver === 'function') {
    let shown = false;
    const ro = new ResizeObserver(() => {
      // ยังไม่ติดหน้า = รอ (ครั้งแรกยิงได้ก่อนการ์ดถูกแปะ) · เคยติดแล้วหลุด = การ์ดถูกทิ้ง เลิกสังเกต
      if (!cv.isConnected) return shown ? ro.disconnect() : undefined;
      shown = true;
      // ซ่อนอยู่ (กว้าง 0) ยังวัดไม่ได้ — รอให้โผล่ก่อน ไม่งั้นวาดซ้ำวน
      if (!cv.offsetWidth) return;
      // ภาพกว้างขั้นต่ำ 280 (saCanvas) — เทียบกับความกว้างที่วาดได้จริง ไม่งั้นจอแคบวาดซ้ำไม่จบ
      const want = Math.max(280, cv.offsetWidth);
      if (Math.abs(want - cv.width / (window.devicePixelRatio || 1)) < 2) return;
      ro.unobserve(cv);
      cv.remove();
      cv = draw();
      if (!cv) return ro.disconnect();
      box.prepend(cv);
      ro.observe(cv);
    });
    ro.observe(cv);
  }
  return box;
}

// สรุปช่วงวัยที่ผ่านมา: แถบตอนนี้ + ขีดตำแหน่งต้นช่วง + ตัวเลขต้นช่วง → ตอนนี้ คู่ลูกศรทิศ
function recap(r) {
  const box = el('div', 'recap');
  box.append(el('div', 'h', `ช่วง${r.stage} · อายุ ${r.fromAge}–${r.toAge}`));
  const grid = el('div', 'delta');
  for (const s of r.stats.filter((x) => SHOWN_STATS.includes(x.key))) {
    const row = el('div');
    const dir = s.to - s.from;
    const head = el('span', null, `${s.label} ${Math.abs(dir) < 1 ? '·' : dir > 0 ? '↑' : '↓'} `);
    head.append(el('span', 'num', `${Math.round(s.from)} → ${Math.round(s.to)}`));
    row.append(head);
    const track = el('div', 'bar');
    const now = el('i');
    now.style.width = `${Math.round(s.to)}%`;
    const was = el('b');
    was.style.left = `${Math.round(s.from)}%`;
    track.append(now, was);
    row.append(track);
    grid.append(row);
  }
  box.append(grid);
  const m = r.money;
  box.append(el('p', 'sub', `เงิน ${baht(m.from)} → ${baht(m.to)}`));
  const chart = sparkline(r.moneySeries, r.fromAge, r.toAge);
  if (chart) box.append(chart);
  if (r.items.length) box.append(list(r.items));
  if (r.disclaimer) box.append(el('p', 'note', r.disclaimer));
  if (r.picks.length) {
    // ภาพรวมเล่าเป็นทิศ ไม่มีตัวเลข · รายการเต็มยังเปิดดูได้ — คนที่อยากไล่ย้อนทีละข้อไม่เสียข้อมูล
    const sum = stageSummary(st, r.stage, r.fromAge, r.toAge);
    box.append(el('div', 'h', 'ภาพรวมสิ่งที่เลือก'));
    box.append(list(sum.lines, 'items lean'));
    if (sum.highlights.length) {
      box.append(el('div', 'h', 'เรื่องที่โดดเด่น'));
      box.append(list(sum.highlights.map((p) => `อายุ ${p.age} · ${p.text}`), 'picks'));
    }
    const all = el('details', 'all-picks');
    all.append(el('summary', null, `ดูทุกสิ่งที่เลือก (${r.picks.length} เรื่อง)`));
    all.append(list(r.picks.map((p) => `อายุ ${p.age} · ${p.text}`), 'picks'));
    box.append(all);
  } else box.append(el('p', 'sub', 'ช่วงนี้ไม่มีเรื่องให้ตัดสินใจ'));
  return box;
}

// เฉลยบัญชีบุญบาปที่ปรโลก (ใบ 09) — ระหว่างชีวิตผู้เล่นไม่เคยเห็นตัวเลขนี้
// วางเป็นตาชั่งสองฝั่ง (ต้นแบบการ์ดปรโลก) — ฝั่งที่หนักกว่าได้ขอบทอง ผู้เล่นเห็นทิศก่อนอ่านตัวเลข
function reckoningBox(r, deeds) {
  const box = el('div', 'recap');
  box.append(el('div', 'h', 'บัญชีบุญบาป เฉลยที่ปรโลก'));
  const scale = el('div', 'scale');
  for (const [side, total, bad] of [['บุญ', r.good, false], ['บาป', r.bad, true]]) {
    const pan = el('div', r.lean === side ? 'heavy' : null);
    pan.append(el('b', null, side), el('span', 'sum', String(total)));
    const cats = r.top.filter((t) => t.bad === bad);
    for (const t of cats) pan.append(el('span', null, `${t.name} ${t.weight}`));
    if (!cats.length) pan.append(el('span', 'sub', '—'));
    scale.append(pan);
  }
  box.append(scale);
  box.append(el('p', 'sub', r.lean === 'เสมอ' ? 'บุญบาปพอ ๆ กัน' : `หนักไปทาง${r.lean}`));
  if (!r.top.length) box.append(el('p', 'sub', 'ชีวิตนี้ไม่ได้ทำบุญหรือบาปที่นับได้'));
  if (deeds.length) box.append(deedsPart(deeds));
  return box;
}

// ไทม์ไลน์กรรม (B26) — บอกเป็นระดับ ไม่บอกแต้มต่อเรื่อง · เกณฑ์ตรงกับน้ำหนักระดับ 2 และ 3 ของป้ายในเนื้อหา
const deedLevel = (d) => (d.weight >= MERIT_LEVELS[3] ? (d.bad ? 'หนัก' : 'ใหญ่') : d.weight >= MERIT_LEVELS[2] ? 'กลาง' : d.bad ? 'เบา' : 'เล็ก');
const deedLine = (d) => `${d.age === null ? 'หลังตาย' : `อายุ ${d.age}`} · ${d.text}`;
function deedsPart(deeds) {
  const part = el('div', 'deeds');
  part.append(el('div', 'h', 'เรื่องที่ชั่งไว้'));
  // เท่ากันเอาเรื่องที่ทำก่อน — ไม่ขึ้นกับลำดับ sort ของเบราว์เซอร์
  const top = (bad) => deeds.filter((d) => d.bad === bad).reduce((a, d) => (a && a.weight >= d.weight ? a : d), null);
  for (const [bad, label] of [[false, 'บุญใหญ่สุด'], [true, 'บาปหนักสุด']]) {
    const d = top(bad);
    const row = el('p', bad ? 'deed bad' : 'deed');
    row.append(el('b', null, label), el('span', null, d ? `${deedLine(d)} (${deedLevel(d)})` : 'ไม่มี'));
    part.append(row);
  }
  const all = el('details', 'all-picks');
  all.append(el('summary', null, `ดูทั้งหมดตามอายุ (${deeds.length} เรื่อง)`));
  all.append(list(deeds.map((d) => `${deedLine(d)} · ${d.bad ? 'บาป' : 'บุญ'}${deedLevel(d)}`), 'picks'));
  part.append(all);
  return part;
}

// แบบชีวิต/ฉายาคิดครั้งเดียวต่อการ์ดตาย แล้วลงสมุดฉายา — กดย้อน/วาดซ้ำไม่นับซ้ำ
function lifeTitles(card) {
  if (!card.lifeTitles) {
    const t = titlesOf(st);
    card.lifeTitles = { ...t };
    titleBookAdd(t);
    card.lifeTitles.clue = titleClue(`${st.seed}:${st.gen}`, t);
    picsAdd();
    deathAdd(card);
    card.memo = memoAdd(t);
    // สมุดเต็ม: ผู้เล่นลบแถวแล้วกดกลับ หน้าเดิมถูกคืนทั้งก้อน ไม่วาดใหม่ — ต้องลองลงซ้ำเองตอนกลับ
    if (card.memo === 'full') card.memoRetry = () => (card.memo = memoAdd(t));
  }
  return card.lifeTitles;
}
const TITLES_SHOWN = 3;

// ฉายาบนใบมรณะ (ui-redo 57 · แบบ line ของหนังสืองานศพ): ฉายาเด่นของชีวิตนี้เท่าที่แผงฉายาโชว์ เรียงในบรรทัดเดียว ที่เหลือบอกเป็นจำนวน
// ไม่มีฉายา = ไม่มีบรรทัด (แผงฉายาด้านล่างบอก "ยังไม่ได้ฉายา" อยู่แล้ว)
function titleLine(card) {
  const { titles } = lifeTitles(card);
  if (!titles.length) return null;
  const p = el('p', 'd-tl');
  p.append(el('span', 'k', 'ฉายา'), ` ${titles.slice(0, TITLES_SHOWN).map((t) => t.name).join(' · ')}`);
  if (titles.length > TITLES_SHOWN) p.append(' · ', el('span', 'more-n', `อีก ${titles.length - TITLES_SHOWN} ฉายา`));
  return p;
}

// บันทึกการตาย (ใบ 04): แบบชีวิต 1 + ฉายาเด่น 3 + ปุ่มดูทั้งหมด · ฉายาตระกูลแยกหัวข้อ
// แผงนี้มีแต่ของชีวิตนี้ (B130) — ของสะสมทุกชีวิตอยู่ในชั้นสมุด หัวข้อจึงย้ำ "ชีวิตนี้" ไม่ให้ปนกับสมุด
function titlesBox(card) {
  const { pattern, titles, family } = lifeTitles(card);
  // ของชีวิตนี้ที่เพิ่งเปิดครั้งแรกในสมุด — อ่านจากที่เก็บ ไม่ใช่ตอนลงสมุด รีโหลดที่มรณบัตรจึงยังเห็นจุด
  const unseen = bookRead().n;
  const mine = [pattern.id && newKey('p', pattern.id), ...titles.map((t) => newKey('t', t.id)), ...family.map((t) => newKey('f', t.id))].filter((k) => k && unseen.includes(k));
  const isNew = (k) => mine.includes(k);
  const box = el('div', 'recap titles');
  box.append(el('div', 'h', 'แบบชีวิตนี้'));
  const pat = el('p', 'pattern', pattern.name);
  if (pattern.id && isNew(newKey('p', pattern.id))) pat.append(newTag());
  box.append(pat);
  if (pattern.hint) box.append(el('p', 'note', pattern.hint));
  box.append(el('div', 'h', 'ฉายาที่ได้ชีวิตนี้'));
  if (!titles.length) box.append(el('p', 'sub', 'ชีวิตนี้ยังไม่ได้ฉายา'));
  const ul = el('ul', 'picks');
  const rows = titles.map((t) => {
    const li = el('li', null, `${t.name} · ${t.tier}`);
    if (isNew(newKey('t', t.id))) li.append(newTag());
    return li;
  });
  rows.forEach((li, i) => {
    li.hidden = i >= TITLES_SHOWN;
    ul.append(li);
  });
  box.append(ul);
  if (titles.length > TITLES_SHOWN) {
    const more = el('button', 'more', `ดูฉายาทั้งหมด (${titles.length})`);
    more.onclick = () => {
      rows.forEach((li) => (li.hidden = false));
      more.remove();
    };
    box.append(more);
  }
  if (family.length) {
    box.append(el('div', 'h', 'ฉายาตระกูลที่ได้ชีวิตนี้'));
    const fl = el('ul', 'picks');
    for (const t of family) {
      const li = el('li', null, t.name);
      if (isNew(newKey('f', t.id))) li.append(newTag());
      fl.append(li);
    }
    box.append(fl);
  }
  clueRow(box, lifeTitles(card).clue, 'คำใบ้ฉายาที่ยังไม่เคยได้');
  const b = bookRead();
  box.append(shelfButton(`เปิดชั้นสมุด · ฉายา ${b.p.length + b.t.length + b.f.length}/${BOOK_ALL}`, 't'));
  // เปิดแผงแล้วนับว่าเห็นของชีวิตนี้ · ของชีวิตก่อนที่ยังไม่ได้ดูยังติดจุดที่ชั้นสมุด
  return fold(box, 'ฉายาชีวิตนี้', mine.length ? `ได้ฉายาใหม่ ${mine.length}` : null, () => {
    bookSeen(mine);
    shelfDot();
  });
}

// เบาะแสฉายาที่ยังไม่เคยได้ 1 อัน (B108) — คำใบ้ชุดเดียวกับ ??? ในสมุด จึงไม่บอกมากกว่าที่สมุดบอกอยู่แล้ว
// ระดับง่ายก่อน (ชาติหน้าไปถึงได้จริง) · ในระดับเดียวกันเลือกด้วย hash ของชีวิต ไม่ใช้ rng ของเกม
// ⇒ ผลเกมไม่ขยับ และรีโหลดเซฟได้ตัวเดิม · ตัดฉายาที่ชีวิตนี้เพิ่งได้เอง เผื่อ storage ปิดจนสมุดไม่จำ
function titleClue(key, got = { titles: [], family: [] }) {
  const b = bookRead();
  const seen = new Set([...b.t, ...b.f, ...got.titles.map((x) => x.id), ...got.family.map((x) => x.id)]);
  let pool = TITLES.filter((x) => !seen.has(x.id));
  if (pool.length) {
    // TIERS เรียงหายากก่อน — ระดับง่ายสุดคือ index มากสุด
    const top = Math.max(...pool.map((x) => TIERS.indexOf(x.tier)));
    pool = pool.filter((x) => TIERS.indexOf(x.tier) === top);
  } else pool = FAMILY_TITLES.filter((x) => !seen.has(x.id));
  if (!pool.length) return null;
  const x = pool[fnv(key) % pool.length];
  return { hint: x.hint, tier: x.tier ?? null };
}
function clueRow(box, clue, head = 'คำใบ้ฉายา') {
  if (!clue) return;
  box.append(el('div', 'h', head));
  box.append(el('p', 'note clue', `??? ${clue.tier ? `· ${clue.tier} ` : ''}— ${clue.hint}`));
}

// สมุดฉายา (ใบ 04): เก็บในเครื่องผู้เล่น · ตัวที่ยังไม่เคยได้เป็น ??? พร้อมคำใบ้
// อ่าน/เขียนพังได้ (โหมดส่วนตัว · ปิด storage) — หน้ายังเล่นได้ สมุดแค่ไม่จำ
const BOOK_KEY = 'next-life-book-v1';
function bookRead() {
  try {
    const b = JSON.parse(localStorage.getItem(BOOK_KEY) ?? '{}');
    return { p: b.p ?? [], t: b.t ?? [], f: b.f ?? [], n: Array.isArray(b.n) ? b.n : [] };
  } catch {
    return { p: [], t: [], f: [], n: [] };
  }
}
function bookWrite(b) {
  try {
    localStorage.setItem(BOOK_KEY, JSON.stringify(b));
  } catch {
    // ไม่มีที่เก็บ — สมุดเห็นแค่ชีวิตนี้
  }
}
// n = รายการที่เพิ่งเปิดแต่ผู้เล่นยังไม่ได้ดู (จุดแดง B116) · id ฉายากับชีวิตแบบคนละกลุ่มกัน จึงติดหัวกลุ่มกันชนชื่อ
const newKey = (group, id) => `${group}:${id}`;
function titleBookAdd(t) {
  const b = bookRead();
  const add = (group, xs, id) => {
    if (xs.includes(id)) return xs;
    b.n.push(newKey(group, id));
    return [...xs, id];
  };
  if (t.pattern) b.p = add('p', b.p, t.pattern.id);
  for (const x of t.titles) b.t = add('t', b.t, x.id);
  for (const x of t.family) b.f = add('f', b.f, x.id);
  bookWrite(b);
}
function bookSeen(keys = null) {
  const b = bookRead();
  b.n = keys ? b.n.filter((k) => !keys.includes(k)) : [];
  bookWrite(b);
}
function newDot(label) {
  const d = el('span', 'new-dot');
  d.append(el('span', 'sr', label));
  return d;
}
const newTag = () => el('span', 'new-tag', 'ใหม่');
const BOOK_ALL = ALL_PATTERNS.length + TITLES.length + FAMILY_TITLES.length;
const bookGot = (b) => b.p.length + b.t.length + b.f.length;

// แถบความคืบหน้าในชั้นสมุด — ตัวเลข x/y อยู่ในหัวข้อแล้ว แถบจึงซ่อนจากโปรแกรมอ่านจอ
function shelfBar(got, all) {
  const b = el('div', 'bk-bar');
  b.setAttribute('aria-hidden', 'true');
  const i = el('i');
  i.style.width = `${all ? Math.round((got / all) * 100) : 0}%`;
  b.append(i);
  return b;
}
function shelfSec(title, got, all, intro) {
  const s = el('section', 'bk-sec');
  const h = el('div', 'h', title);
  h.append(el('small', null, `${got}/${all}`));
  s.append(h, shelfBar(got, all));
  if (intro) s.append(el('p', 'bk-intro', intro));
  return s;
}

// แท็บฉายาของชั้นสมุด (B130): สะสมทุกชีวิต · ตัวที่ยังไม่เคยได้เป็น ??? พร้อมคำใบ้ · ป้าย "ใหม่" อ่านจากภาพตอนเปิดชั้น
function titleShelf(body, fresh) {
  const b = bookRead();
  body.append(el('p', 'bk-intro', `สะสมจากทุกชีวิตที่เคยเล่น · เปิดแล้ว ${bookGot(b)}/${BOOK_ALL} · ตัวที่ยังไม่ได้เป็น ??? พร้อมคำใบ้`));
  shelfTitleArt(body, [
    { label: 'แบบชีวิต', groups: [{ key: 'p', items: ALL_PATTERNS, got: b.p }] },
    { label: 'ฉายาประจำตัว', groups: TIERS.map((tier, i) => ({ key: 't', items: TITLES.filter((x) => x.tier === tier), got: b.t, gold2: i === 0 })) },
    { label: 'ฉายาตระกูล', groups: [{ key: 'f', items: FAMILY_TITLES, got: b.f }] },
  ], fresh, bookGot(b), BOOK_ALL);
  const rows = (group, items, got) => {
    const ul = el('ul', 'bk-list');
    for (const x of items) {
      const li = el('li', got.includes(x.id) ? 'got' : 'lock');
      if (got.includes(x.id)) li.textContent = x.name;
      else li.append(el('b', null, '???'), x.hint);
      if (fresh.includes(newKey(group, x.id))) li.append(newTag());
      ul.append(li);
    }
    return ul;
  };
  const s1 = shelfSec('แบบชีวิต', b.p.length, ALL_PATTERNS.length, 'ทางที่ชีวิตหนึ่งเดินจนจบ — ชีวิตละ 1 แบบ');
  s1.append(rows('p', ALL_PATTERNS, b.p));
  const s2 = shelfSec('ฉายาประจำตัว', b.t.length, TITLES.length, 'ได้จากสิ่งที่ทำในชีวิตเดียว — ชีวิตหนึ่งได้หลายฉายา');
  for (const tier of TIERS) {
    const xs = TITLES.filter((x) => x.tier === tier);
    s2.append(el('div', 'bk-tier', `${tier} · ${xs.filter((x) => b.t.includes(x.id)).length}/${xs.length}`), rows('t', xs, b.t));
  }
  const s3 = shelfSec('ฉายาตระกูล', b.f.length, FAMILY_TITLES.length, 'ได้จากหลายรุ่นต่อกันในตระกูลเดียว');
  s3.append(rows('f', FAMILY_TITLES, b.f));
  body.append(s1, s2, s3);
  bookSeen();
}

// สมุดอนุสรณ์ (B51): สรุปชีวิตที่จบแล้วข้ามการเล่น · key แยกจากเซฟ ล้างตระกูลแล้วยังอยู่
// ไม่จำกัดจำนวน (คำตัดสินเจ้าของ) จึงเก็บแค่สรุปสั้น · ที่เก็บเต็มต้องบอกผู้เล่นให้ลบเอง ห้ามลบเงียบ
const MEMO_KEY = 'next-life-memorial-v1';
const ERA_EVENTS = CONTENT.era.events;
// การ์ดทวีป (06c-2) มากับเนื้อหา ไม่อยู่ในแกน — ต่อเข้ากองก่อนเริ่ม/โหลดเซฟชาติต่างโลก
useIsekaiCards(CONTENT.isekai);
// การ์ดรับมือที่รวมข่าวบ้านเมือง (B58) ไม่มีการ์ดบ้านเมืองแยก — หาเหตุการณ์จากการ์ดเนื้อหาที่ผูกไว้
const ERA_OF = new Map(CONTENT.events.filter((c) => c.era).map((c) => [c.id, c.era]));
// ภาพฉากสำคัญ (ui-redo 31): การ์ดจริงที่ผูกภาพ — แต่งงาน = การ์ดที่ตั้งธง married · มีลูก = การ์ดที่ตั้งธง has_kids · เกษียณ = การ์ดอายุ 60 + โครงการเกษียณก่อนกำหนด
// แรกเกิดเลือกตามฐานะบ้าน (ชุดเดียวกับรูปตัวละคร) · การ์ดตาย/หายตัวผูกในหน้าการ์ดตาย · การ์ดอื่นไม่มีภาพ หน้าตาเดิม
const SCENE_OF = new Map([['young_wedding_01', 'wed_ask'], ['remarry_wedding_work_01', 'wed_rite'], ['remarry_wedding_mid_01', 'wed_rite'], ['remarry_wedding_old_01', 'wed_rite'], ['young_baby_01', 'baby_news'], ['work_house_01', 'baby_home'], ['retirement', 'retire_home'], ['early_retire', 'retire_early']]);
const BIRTH_SCENE = ['birth_poor', 'birth_mid', 'birth_rich'];
// ภาพเล็ก (sm) บนการ์ดแรกเกิด/การ์ดตาย: ปุ่มไปต่อยังอยู่จอแรก 390 · data-scene ให้ด่านจอหาเจอ
function sceneSvg(id, sm) {
  const s = sceneArt(id);
  if (!s) return null;
  const svg = artSvg(`era-art scene-art${sm ? ' scene-sm' : ''}`, ERA_ART_W, ERA_ART_H, s.parts);
  svg.dataset.scene = id;
  return svg;
}
// ภาพฉากใบมรณะเป็นพื้นหลังจางทั้งใบ (ui-redo 57): รูปทรงเดิมตัดกรอบแผ่นออก สีเส้นมาจาก CSS — แผ่นทึบกับกรอบทองจะกลายเป็นแถบเทาทับข้อความ
function sceneBg(id) {
  const s = sceneArt(id);
  if (!s) return null;
  const wrap = el('div', 'd-bg');
  wrap.setAttribute('aria-hidden', 'true');
  const svg = artSvg('scene-art', ERA_ART_W, ERA_ART_H, s.parts.slice(ERA_FRAME.length));
  svg.dataset.scene = id;
  wrap.append(svg);
  return wrap;
}
const eraName = (id) => ERA_EVENTS.find((e) => e.id === id)?.name ?? id;
function memoRead() {
  try {
    const m = JSON.parse(localStorage.getItem(MEMO_KEY) ?? '{}');
    return { l: Array.isArray(m.l) ? m.l : [], e: Array.isArray(m.e) ? m.e : [] };
  } catch {
    return { l: [], e: [] };
  }
}
// 'ok' · 'full' (ที่เก็บเต็ม ผู้เล่นต้องรู้) · 'off' (ไม่มีที่เก็บ เกมเล่นต่อได้เงียบ ๆ)
function memoWrite(m) {
  try {
    localStorage.setItem(MEMO_KEY, JSON.stringify(m));
    return 'ok';
  } catch (e) {
    return e?.name === 'QuotaExceededError' || e?.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e?.code === 22 ? 'full' : 'off';
  }
}
// เรียกครั้งเดียวต่อการ์ดตาย · รีโหลดที่มรณบัตรแล้ววาดซ้ำ — key ตระกูล:รุ่น กันชีวิตเดียวลงสองแถว
function memoAdd(t) {
  const m = memoRead();
  const k = `${save.seed}:${st.gen}`;
  if (m.l.some((x) => x.k === k)) return 'ok';
  m.l.push({ k, n: st.name, r: fullName(), g: st.gen, a: st.age, p: provinceLabel(st), s: t.pattern?.name ?? '', t: t.titles[0]?.name ?? '' });
  for (const x of eraSeen) if (!m.e.includes(x.id)) m.e.push(x.id);
  const r = memoWrite(m);
  shelfDot();
  return r;
}
// แถวสมุดอนุสรณ์ที่ผู้เล่นเปิดดูแล้ว (จุดแดงที่ลิงก์ท้ายหน้า B116) — key แยก รูปเก็บของสมุดเดิมไม่เปลี่ยน
const MEMO_SEEN_KEY = 'next-life-memorial-seen-v1';
function memoSeenRead() {
  try {
    const s = JSON.parse(localStorage.getItem(MEMO_SEEN_KEY));
    return Array.isArray(s) ? s : null;
  } catch {
    return null;
  }
}
function memoSeenWrite(ks) {
  try {
    localStorage.setItem(MEMO_SEEN_KEY, JSON.stringify(ks));
  } catch {
    // ไม่มีที่เก็บ — ไม่มีจุดแดง
  }
}
function memoUnseen() {
  const ks = memoRead().l.map((x) => x.k);
  let seen = memoSeenRead();
  // ผู้เล่นที่มีสมุดอยู่ก่อนมีจุดแดง: ของเดิมถือว่าเห็นแล้ว ไม่งั้นจุดขึ้นทั้งที่ไม่มีอะไรใหม่
  if (!seen) memoSeenWrite((seen = ks));
  return ks.filter((k) => !seen.includes(k));
}
// สมุดภาพบ้านเมือง (B130): ภาพหลักของเหตุการณ์ (e) + ภาพตามวัย/ตามมา (s = "เหตุการณ์:ช่อง") สะสมข้ามชีวิต
// key แยกจากสมุดอนุสรณ์ เพราะ "ลบสมุดอนุสรณ์ทั้งเล่ม" ล้างเหตุการณ์ที่เคยเห็นด้วย · อ่านครั้งแรกสำเนาเหตุการณ์จากสมุดอนุสรณ์
// ผู้เล่นเดิมจึงได้ภาพหลักย้อนหลัง · n = ภาพที่เพิ่งได้แต่ยังไม่เปิดดู (จุดแดงแบบสมุดฉายา)
const PICS_KEY = 'next-life-pics-v1';
// วิกฤตน้ำมันครั้งแรกเกิดก่อนปีเกิดแรกสุดของเกม ไม่มีชีวิตไหนทันเห็น — ไม่ตั้งช่องที่ปลดไม่ได้ตลอดกาล
const PIC_EVENTS = ERA_EVENTS.filter((e) => ERA_PICS[e.id]);
const PIC_ALL = PIC_EVENTS.reduce((n, e) => n + 1 + ERA_PICS[e.id].length, 0);
// การ์ดตามมาของเหตุการณ์ไม่มีช่อง era ในเนื้อหา จึงผูกด้วย id การ์ด · การ์ดยุคใช้ช่วงวัยของการ์ดเป็นช่อง
const PIC_FOLLOW = { era_econ_oil2_farm_01: 'oil_crisis_2', era_dis_tsunami_land_offer_01: 'tsunami', era_econ_gfc_cafe_01: 'global_financial_crisis', era_dis_covid_shop_boom_01: 'covid19' };
const PIC_STAGE = { เด็ก: 'kid', ชรา: 'old' };
const PIC_OF = new Map(
  CONTENT.events
    .map((c) => [c.id, c.era ? `${c.era}:${PIC_STAGE[c.stage] ?? 'adult'}` : PIC_FOLLOW[c.id] && `${PIC_FOLLOW[c.id]}:sp`])
    .filter(([, k]) => k && ERA_PICS[k.split(':')[0]]?.some(([s]) => s === k.split(':')[1])),
);
function picsRead() {
  try {
    const raw = localStorage.getItem(PICS_KEY);
    if (raw === null) {
      const p = { e: memoRead().e.filter((id) => ERA_PICS[id]), s: [], n: [] };
      picsWrite(p);
      return p;
    }
    const p = JSON.parse(raw) ?? {};
    return { e: Array.isArray(p.e) ? p.e : [], s: Array.isArray(p.s) ? p.s : [], n: Array.isArray(p.n) ? p.n : [] };
  } catch {
    return { e: [], s: [], n: [] };
  }
}
function picsWrite(p) {
  try {
    localStorage.setItem(PICS_KEY, JSON.stringify(p));
  } catch {
    // ไม่มีที่เก็บ — สมุดภาพเห็นแค่ชีวิตนี้
  }
}
const picsGot = (p) => PIC_EVENTS.reduce((n, e) => n + (p.e.includes(e.id) ? 1 : 0) + ERA_PICS[e.id].filter(([k]) => p.s.includes(`${e.id}:${k}`)).length, 0);
// เรียกครั้งเดียวต่อการ์ดตาย (lifeTitles) · ภาพที่ชีวิตนี้เพิ่งได้ = ป้าย "ใหม่" ในแผงเหตุการณ์ของการ์ดตาย
function picsAdd() {
  const p = picsRead();
  for (const k of picSeen) {
    const [kind, id] = [k.slice(0, 1), k.slice(2)];
    const xs = kind === 'e' ? p.e : p.s;
    if (xs.includes(id)) continue;
    xs.push(id);
    p.n.push(k);
  }
  picsWrite(p);
}
function picsSeen() {
  const p = picsRead();
  p.n = [];
  picsWrite(p);
}

// สมุดสกิล (06s): สกิลที่ดวงวิญญาณเคยได้ สะสมข้ามชีวิตแบบสมุดฉายา · ไม่อยู่ในเซฟ (ล้างตระกูลแล้วยังอยู่)
// s = { id: ขั้นสูงสุดที่เคยถึง } คำนวณด้วย skillBookAdd ของแกน · e = การ์ดที่ลงสมุดไปแล้ว — รีโหลดกลับมาที่การ์ดเดิม ลงซ้ำ = ขั้นขึ้นฟรี
// n = สกิลที่เพิ่งลงแต่ยังไม่เปิดดู (จุดแดงแบบสมุดฉายา)
const SKILLS_KEY = 'next-life-skills-v1';
const SKILL_IDS = Object.keys(ISEKAI_SKILLS);
const SKILLS_EARN_MAX = 200;
function skillsRead() {
  try {
    const k = JSON.parse(localStorage.getItem(SKILLS_KEY) ?? '{}') ?? {};
    const s = Object.fromEntries(Object.entries(k.s ?? {}).filter(([id, lv]) => ISEKAI_SKILLS[id] && Number.isInteger(lv) && lv > 0).map(([id, lv]) => [id, Math.min(SKILL.top, lv)]));
    return { s, e: Array.isArray(k.e) ? k.e : [], n: Array.isArray(k.n) ? k.n.filter((id) => s[id]) : [] };
  } catch {
    return { s: {}, e: [], n: [] };
  }
}
function skillsWrite(k) {
  try {
    localStorage.setItem(SKILLS_KEY, JSON.stringify(k));
  } catch {
    // ไม่มีที่เก็บ — สมุดสกิลไม่จำ ชาติหน้าจึงไม่มีอะไรให้พก
  }
}
// ลงสมุด 1 อย่างต่อการ์ด · การ์ดนี้ลงไปแล้ว = null
function skillsEarn(key, id, lv) {
  const k = skillsRead();
  if (k.e.includes(key)) return null;
  const was = k.s[id] ?? 0;
  k.s = skillBookAdd(k.s, id, lv).book;
  k.e = [...k.e, key].slice(-SKILLS_EARN_MAX);
  if (!k.n.includes(id)) k.n.push(id);
  skillsWrite(k);
  shelfDot();
  return { was, lv: k.s[id] };
}
function skillsSeen() {
  const k = skillsRead();
  k.n = [];
  skillsWrite(k);
}
const skillsGot = (k) => Object.keys(k.s).length;
// คำใบ้ของ ??? บอกชนิดแหล่งที่ได้ ไม่บอกชื่อ — ชี้ทางแบบคำใบ้ฉายา · ทุกสกิลเป็นของขวัญเทพธิดาในต่างโลกได้
const SKILL_SRC = { job: 'อาชีพ', title: 'ฉายา', pattern: 'แบบชีวิต', cause: 'วิธีจากไป', goal: 'เป้าตระกูล', focus: 'โฟกัส', lifeGoal: 'เป้าชีวิต' };
function skillHint(id) {
  const kinds = Object.entries(CONTENT.skillMap ?? {}).filter(([, m]) => Object.values(m).some((xs) => xs.includes(id))).map(([k]) => SKILL_SRC[k]).filter(Boolean);
  return kinds.length ? `ของขวัญเทพธิดาในต่างโลก หรือชีวิตไทยที่มี${kinds.join('/')}ที่ใช่` : 'ของขวัญเทพธิดาในต่างโลก';
}

// หน้า "เคยจากไปแบบนี้" (doom-1): สาเหตุตายที่เคยเจอ สะสมข้ามชีวิต · key ใหม่เพราะสมุดอนุสรณ์ไม่เคยเก็บสาเหตุ ⇒ นับจากชีวิตหลังอัปเดต
// ไม่ชวนตามหาทางตาย: ไม่มีช่อง ??? ไม่มีจำนวนเต็ม ไม่มีจุดแดง · ลงเฉพาะสาเหตุที่การ์ดตายบอกผู้เล่น
// (หายตัว · ไม่ทราบเหตุก่อนชรา ไม่บอก) และทำร้ายตัวเองไม่ลงแม้วันหนึ่งการ์ดจะบอก
const DEATH_KEY = 'next-life-deaths-v1';
const DEATH_GROUPS = [
  ['ร่างกาย', ['newborn', 'infection', 'pneumonia', 'heart', 'stroke', 'cancer', 'diabetes_kidney', 'liver', 'chronic_resp']],
  ['อุบัติเหตุ', ['road', 'accident']],
  ['อื่น ๆ', null],
];
function deathRead() {
  try {
    const d = JSON.parse(localStorage.getItem(DEATH_KEY) ?? '{}') ?? {};
    return { c: Array.isArray(d.c) ? d.c.filter((k) => typeof k === 'string') : [] };
  } catch {
    return { c: [] };
  }
}
function deathWrite(d) {
  try {
    localStorage.setItem(DEATH_KEY, JSON.stringify(d));
  } catch {
    // ไม่มีที่เก็บ — หน้านี้ว่าง เกมเล่นต่อได้
  }
}
// เรียกครั้งเดียวต่อการ์ดตาย (lifeTitles) · สาเหตุซ้ำไม่เพิ่มแถว
function deathAdd(card) {
  if (card.cause === 'self_harm' || !causeOf(card.cause, card.age)) return;
  const d = deathRead();
  if (d.c.includes(card.cause)) return;
  d.c.push(card.cause);
  deathWrite(d);
}

// จุดแดงที่ทางเข้าชั้นสมุด (B116 → B130): ชีวิตใหม่ในสมุดอนุสรณ์ · ฉายาใหม่ · ภาพใหม่ ที่ยังไม่เปิดดู
// ลิงก์ท้ายหน้าซ่อนในฉากที่มีเมนู แต่ยังเป็นทางเข้าของต่างโลก/ปรโลก ⇒ ติดจุดทั้งสองที่ · หน้าเคยจากไปไม่มีจุด (d ว่างเสมอ)
const shelfFresh = () => ({ m: memoUnseen(), t: bookRead().n, p: picsRead().n, k: skillsRead().n, d: [] });
function shelfDot() {
  const f = shelfFresh();
  const n = f.m.length + f.t.length + f.p.length + f.k.length + f.d.length;
  for (const a of document.querySelectorAll('#shelfLink, .mnav [data-menu="shelf"]')) {
    a.querySelector('.new-dot')?.remove();
    if (n) a.append(newDot(`มีของใหม่ในชั้นสมุด ${n}`));
  }
}
// ปุ่มเปิดชั้นสมุดจากการ์ดตาย — กลับมาแล้วคืนการ์ดเดิมทั้งก้อน
function shelfButton(label, tab, onBack) {
  const b = el('button', 'more', label);
  b.onclick = () => openShelf(tab, undefined, onBack);
  return b;
}
function eraBox() {
  const box = el('div', 'recap eras');
  box.append(eraSeen.length ? list(eraSeen.map((x) => `อายุ ${x.a} · ${eraName(x.id)}`), 'picks') : el('p', 'sub', 'ชีวิตนี้ไม่ทันเห็นเหตุการณ์ใหญ่ของบ้านเมือง'));
  // ภาพที่ชีวิตนี้เพิ่งได้ อ่านจากที่เก็บ (แบบจุดฉายา) รีโหลดที่มรณบัตรจึงยังบอกได้
  const fresh = picsRead().n.filter((k) => picSeen.includes(k)).length;
  if (fresh) box.append(el('p', 'note', `ได้ภาพใหม่ในสมุดภาพบ้านเมือง ${fresh} ภาพ`));
  return fold(box, `เหตุการณ์ในแผ่นดินที่ได้เห็น (${eraSeen.length})`, fresh ? `ได้ภาพใหม่ ${fresh}` : null);
}
function memoFull(card) {
  const box = el('div', 'recap warn');
  box.append(el('p', 'sub', 'สมุดอนุสรณ์เต็ม ชีวิตนี้ยังไม่ได้ลงสมุด — ลบชีวิตเก่าในสมุดออกบ้างแล้วกลับมาที่หน้านี้อีกครั้ง'));
  box.append(shelfButton('เปิดสมุดอนุสรณ์', 'm', () => {
    if (card.memo === 'full') card.memoRetry?.();
    if (card.memo !== 'full') box.remove();
  }));
  return box;
}

// ชั้นสมุด (B130): เล่มเดียว 4 แท็บ อนุสรณ์ · ฉายา · ภาพบ้านเมือง · เคยจากไป · เปิดทับหน้าที่อยู่ แล้วคืนหน้าเดิมทั้งก้อนตอนกลับ — ไม่แตะ st ไม่ลงเซฟ
// fresh = ของใหม่ตอนเปิดชั้นครั้งแรก — เปิดแท็บแล้วล้างจุดในที่เก็บ แต่ป้าย "ใหม่" ยังอยู่จนออกจากชั้น สลับแท็บไปมาก็ยังหาเจอ
const SHELF_TABS = [['m', 'อนุสรณ์'], ['t', 'ฉายา'], ['k', 'สกิล'], ['p', 'ภาพบ้านเมือง'], ['d', 'เคยจากไป']];
const SHELF_ICON = {
  m: '<path d="M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2z"/><path d="M6 17a2 2 0 0 1 2-2h10"/><path d="M10 8h5"/>',
  t: '<circle cx="12" cy="9" r="5"/><path d="M9 13.5 7.5 21l4.5-2.5 4.5 2.5-1.5-7.5"/>',
  k: '<path d="M12 3l2.6 5.5 6 .8-4.4 4.1 1.1 6L12 16.6 6.7 19.4l1.1-6L3.4 9.3l6-.8z"/>',
  p: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="16" cy="9" r="1.5"/>',
  d: '<path d="M12 21v-7"/><path d="M12 14c-4 0-6-3-6-6 3 0 5 1 6 3 1-2 3-3 6-3 0 3-2 6-6 6z"/><path d="M9 21h6"/>',
};
function openShelf(tab, prev = [...root.childNodes], onBack, fresh = shelfFresh()) {
  // เปิดจากเมนู/ท้ายหน้า/หน้าเล่นต่อ: ไปแท็บที่มีของใหม่ก่อน
  tab ??= SHELF_TABS.find(([k]) => fresh[k].length)?.[0] ?? 'm';
  const again = (t = tab) => openShelf(t, prev, onBack, fresh);
  const back = () => {
    root.replaceChildren(...prev);
    // จุดบนปุ่มเมนูที่คืนมายังเป็นของตอนก่อนเปิด
    shelfDot();
    onBack?.();
  };
  const choices = homeCard('ชั้นสมุด', ['ชั้นสมุด']);
  root.firstChild.classList.add('shelf-view');
  const body = root.querySelector('.body');
  const tabs = el('div', 'bk-tabs');
  tabs.setAttribute('role', 'group');
  tabs.setAttribute('aria-label', 'เล่มในชั้นสมุด');
  for (const [k, label] of SHELF_TABS) {
    const x = el('button');
    x.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${SHELF_ICON[k]}</svg>`;
    x.append(el('span', null, label));
    x.setAttribute('aria-pressed', String(k === tab));
    // จุดบนแท็บอื่นที่ยังไม่ได้เปิด — แท็บที่เปิดอยู่ล้างจุดแล้ว
    if (k !== tab && shelfFresh()[k].length) x.append(newDot('มีของใหม่'));
    x.onclick = () => again(k);
    tabs.append(x);
  }
  body.append(tabs);
  if (tab === 't') titleShelf(body, fresh.t);
  else if (tab === 'p') picShelf(body, fresh.p);
  else if (tab === 'k') skillShelf(body, fresh.k);
  else if (tab === 'd') deathShelf(body);
  else memoShelf(body, choices, fresh.m, again);
  shelfDot();
  choices.prepend(enter(button('กลับ', null, back)));
}
// แท็บอนุสรณ์: รายชื่อชีวิตที่จบแล้ว ใหม่สุดก่อน · เหตุการณ์ที่เคยเห็นย้ายไปอยู่สมุดภาพแล้ว
function memoShelf(body, choices, fresh, again) {
  const m = memoRead();
  memoSeenWrite(m.l.map((x) => x.k));
  body.append(el('p', 'bk-intro', `ชีวิตที่จบแล้ว ${m.l.length} ชีวิต`));
  shelfMemoArt(body, m.l, fresh, CONTENT.era.birth.regions);
  const ul = el('ul', 'memo');
  // ลบทีละแถวได้ทันที (สรุปสั้น ไม่ใช่เซฟ ไม่ต้องถามซ้ำ)
  for (const x of [...m.l].reverse()) {
    const li = el('li');
    const txt = el('span', null, [`${x.g > 1 ? `รุ่นที่ ${x.g} · ` : ''}${x.r || x.n}`, `อายุ ${x.a} ปี`, x.p, x.s && `ชีวิตแบบ${x.s}`, x.t && `ฉายา ${x.t}`].filter(Boolean).join(' · '));
    if (fresh.includes(x.k)) txt.append(newTag());
    li.append(txt);
    const del = el('button', 'more', 'ลบ');
    del.setAttribute('aria-label', `ลบ ${x.r || x.n} ออกจากสมุด`);
    del.onclick = () => {
      const now = memoRead();
      now.l = now.l.filter((y) => y.k !== x.k);
      memoWrite(now);
      again('m');
    };
    li.append(del);
    ul.append(li);
  }
  body.append(m.l.length ? ul : el('p', 'sub', 'ยังไม่มีชีวิตที่จบลงสมุด'));
  if (!m.l.length && !m.e.length) return;
  choices.append(button('ลบสมุดอนุสรณ์ทั้งเล่ม', null, () => {
    const c = homeCard('ชั้นสมุด', ['ลบสมุดอนุสรณ์ทั้งเล่ม?', 'ชีวิตที่จบแล้วจะหายทั้งหมด กู้คืนไม่ได้ · ฉายา ภาพบ้านเมือง และชีวิตที่เล่นค้างไว้ไม่หาย']);
    root.firstChild.classList.add('shelf-view');
    c.append(button('ลบทั้งเล่ม', null, () => {
      memoWrite({ l: [], e: [] });
      again('m');
    }), enter(button('ยกเลิก', null, () => again('m'))));
  }));
}
// หัวแท็บภาพบ้านเมือง (ui-redo ใบ 41 · แบบ ข ต้นแบบ B176): ภาพย่อต่อเหตุการณ์เรียงตามปี ใช้ภาพเหตุการณ์ตัวเดียวกับรายการข้างล่าง
// เป็น DOM ไม่ใช่ canvas — ช่องตัดแถวเองตามความกว้าง ความสูงตามเนื้อ จอแคบไม่เหลือที่ว่างค้าง · events = ชุดเดียวกับที่ส่งให้ภาพหัวแท็บเดิม
function picStrip(events, got, all) {
  const box = el('div', 'pic-strip');
  box.setAttribute('role', 'img');
  box.setAttribute('aria-label', `ภาพย่อเหตุการณ์บ้านเมืองเรียงตามปี ได้ภาพแล้ว ${got} จาก ${all}`);
  box.dataset.count = JSON.stringify({ got, all, met: events.filter((e) => e.met).length, events: events.length });
  box.append(el('div', 'h', `ภาพบ้านเมืองที่ได้ ${got}/${all}`));
  const row = el('div', 'pic-row');
  for (const ev of [...events].sort((a, b) => a.from - b.from)) {
    const th = el('div', `pic-th${ev.met ? '' : ' lock'}${ev.fresh ? ' fresh' : ''}`);
    const pic = el('div', 'pic');
    if (ev.met) {
      const svg = artSvg('era-art', ERA_ART_W, ERA_ART_H, eraArt(ev.id));
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      pic.append(svg);
    } else pic.append(el('b', null, '???'));
    th.append(pic, el('span', 'n', `${ev.n}/${ev.all}`), el('i', 'dot'), el('span', 'yr', `${ev.from}`));
    row.append(th);
  }
  box.append(row);
  return box;
}

// แท็บภาพบ้านเมือง: เหตุการณ์ละแผ่น ภาพหลักเต็มแถว ภาพตามวัย/ตามมาเป็นช่องเล็ก · ยังไม่เจอ = ??? + ทางปลด
function picShelf(body, fresh) {
  const p = picsRead();
  body.append(el('p', 'bk-intro', `ภาพเหตุการณ์ภัยพิบัติและเศรษฐกิจที่เคยผ่าน สะสมข้ามชีวิต · ได้แล้ว ${picsGot(p)}/${PIC_ALL} ภาพ`), shelfBar(picsGot(p), PIC_ALL));
  body.append(picStrip(PIC_EVENTS.map((e) => {
    const slots = ERA_PICS[e.id];
    const met = p.e.includes(e.id);
    return { id: e.id, name: e.name, kind: e.kind, from: e.from, to: e.to, met, all: 1 + slots.length, n: (met ? 1 : 0) + slots.filter(([k]) => p.s.includes(`${e.id}:${k}`)).length, fresh: fresh.some((k) => k === `e:${e.id}` || k.startsWith(`s:${e.id}:`)) };
  }), picsGot(p), PIC_ALL));
  for (const e of PIC_EVENTS) {
    const s = el('section', 'pic-ev');
    const met = p.e.includes(e.id);
    const slots = ERA_PICS[e.id];
    const n = (met ? 1 : 0) + slots.filter(([k]) => p.s.includes(`${e.id}:${k}`)).length;
    const h = el('div', 'h', met ? e.name : '???');
    if (met && fresh.includes(`e:${e.id}`)) h.firstChild.after(newTag());
    h.append(el('small', null, `${n}/${1 + slots.length}`));
    s.append(h, el('div', 'yr', `${e.kind === 'economy' ? 'เศรษฐกิจ' : 'ภัยพิบัติ'} · พ.ศ. ${e.from}${e.to !== e.from ? `–${e.to}` : ''}`));
    const grid = el('div', 'pic-slots');
    const main = el('div', `pic-slot main${met ? '' : ' lock'}`);
    if (met) main.append(artSvg('era-art', ERA_ART_W, ERA_ART_H, eraArt(e.id)));
    else main.append(el('b', null, '???'), el('span', null, 'ยังไม่เคยมีชีวิตไหนทันเห็น'));
    grid.append(main);
    for (const [k, label, cap] of slots) {
      const key = `${e.id}:${k}`;
      const ok = p.s.includes(key);
      const slot = el('figure', `pic-slot${ok ? '' : ' lock'}`);
      if (ok) {
        const svg = artSvg('era-art', ERA_ART_W, ERA_ART_H, eraPicArt(e.id, k));
        svg.removeAttribute('aria-hidden');
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', cap);
        slot.append(svg);
        const fc = el('figcaption', null, `${label} · ${cap}`);
        if (fresh.includes(`s:${key}`)) fc.append(newTag());
        slot.append(fc);
      } else {
        slot.append(el('b', null, '???'), el('span', null, k === 'sp' ? 'เจอเรื่องพิเศษของเหตุการณ์นี้' : `เจอเหตุการณ์นี้ตอน${label}`));
      }
      grid.append(slot);
    }
    s.append(grid);
    body.append(s);
  }
  picsSeen();
}
// แท็บสมุดสกิล (06s): ขั้นในสมุด = ขั้นสูงสุดที่เคยถึง · ยังไม่เคยได้ = ??? + คำใบ้แหล่ง
function skillShelf(body, fresh) {
  const k = skillsRead();
  body.append(el('p', 'bk-intro', `สกิลที่ดวงวิญญาณนี้เคยได้ สะสมข้ามชีวิต · ได้แล้ว ${skillsGot(k)}/${SKILL_IDS.length} · ก่อนไปเกิดเลือกพกได้ ${SKILL.carry} อย่าง ทุกอย่างเริ่มขั้น 1 แต่ฝึกถึงขั้นในสมุดได้เร็วกว่าครั้งแรก`), shelfBar(skillsGot(k), SKILL_IDS.length));
  const ul = el('ul', 'bk-list');
  for (const id of SKILL_IDS) {
    const x = ISEKAI_SKILLS[id];
    const lv = k.s[id];
    const li = el('li', lv ? 'got' : 'lock');
    if (lv) li.append(el('b', null, `${x.name} · ขั้น ${lv}`), ` — ${x.desc}`);
    else li.append(el('b', null, '???'), skillHint(id));
    if (fresh.includes(id)) li.append(newTag());
    ul.append(li);
  }
  body.append(ul);
  skillsSeen();
}

// แท็บเคยจากไป: หมวดละกล่อง เฉพาะสาเหตุที่เคยเจอ · หมวดที่ยังไม่เจอไม่ขึ้น · วัยชรา (other) ได้ป้ายจากอายุสุดท้ายของตาราง
function deathShelf(body) {
  const { c } = deathRead();
  body.append(el('p', 'bk-intro', 'ทางที่ชีวิตก่อน ๆ ในเครื่องนี้เคยจากไป สะสมข้ามชีวิต · สาเหตุเดิมไม่ลงซ้ำ'));
  const known = DEATH_GROUPS.flatMap(([, ks]) => ks ?? []);
  let shown = 0;
  for (const [name, keys] of DEATH_GROUPS) {
    const words = (keys ?? c.filter((k) => !known.includes(k))).filter((k) => c.includes(k)).map((k) => causeWords(k, MAX_AGE)).filter(Boolean);
    if (!words.length) continue;
    const s = el('section', 'bk-sec');
    s.append(el('div', 'h', name));
    const ul = el('ul', 'bk-list');
    for (const w of words) ul.append(el('li', 'got', `จากไป${w.join('')}`));
    s.append(ul);
    body.append(s);
    shown += words.length;
  }
  if (!shown) body.append(el('p', 'sub', 'ยังไม่มีชีวิตที่จากไปลงหน้านี้'));
}

// ภาพแชร์รับเฉพาะช่องที่ไล่ชื่อไว้ตรงนี้ — บัญชีบุญบาปบนการ์ดตายหลุดลงภาพไม่ได้ แม้แกนเกมจะเติมช่องใหม่ให้การ์ด
function shareFacts(card) {
  const { pattern, titles } = lifeTitles(card);
  return {
    age: card.age,
    name: st.name,
    who: `${st.sex} · ${provinceLabel(st)} · ฐานะ${classNow(st)}`,
    job: `${card.job}${st.edu ? ` · วุฒิ${st.edu}` : ''}`,
    pattern: { name: pattern.name, hint: pattern.hint ?? '' },
    title: titles[0] ? { name: titles[0].name, tier: titles[0].tier } : null,
    avatar: avatarParts(card.age),
    // ชาติประจำวันกำหนดแค่ชีวิตแรก · ลิงก์เพื่อนไม่ใส่ป้ายบนภาพ (การ์ดตายบอกอยู่แล้ว)
    day: st.gen === 1 && save.from?.day ? save.from.day : null,
  };
}

// สรุปเป็นข้อความ (B38) — การ์ดตายยังไม่รู้ภพ (รู้ = เผยทิศบัญชีก่อนปรโลก) · การ์ดปรโลกส่ง realm มาเพิ่มบรรทัด
function summaryText(age, realm = null) {
  const t = titlesOf(st);
  return [
    `${GAME_NAME} · ${st.name}`,
    `เกิดปี ${st.birthYear} · ${provinceLabel(st)}`,
    `${lifeEndWord(isGone(st))} ${age}`,
    `ชีวิตแบบ${t.pattern.name}`,
    t.titles[0] ? `ฉายา ${t.titles[0].name} (${t.titles[0].tier})` : 'ยังไม่ได้ฉายา',
    realm && `ไปภูมิ${realm}`,
    `https://${SHARE_URL}`,
  ].filter(Boolean).join('\n');
}

// clipboard API ใช้ไม่ได้บนไฟล์ในเครื่อง/เบราว์เซอร์เก่า — ถอยไปเลือกข้อความใน textarea แล้วสั่งคัดลอก
async function copyText(s) {
  try {
    await navigator.clipboard.writeText(s);
    return true;
  } catch {
    const ta = el('textarea');
    ta.value = s;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.append(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}
function inviteButton() {
  const b = button('ชวนเพื่อนเกิดชีวิตเดียวกัน', null, async () => {
    b.firstChild.textContent = (await copyText(inviteUrl())) ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกไม่ได้';
  });
  return b;
}
function copyButton(text) {
  const b = button(BTN.copy, null, async () => {
    b.firstChild.textContent = (await copyText(text())) ? 'คัดลอกแล้ว' : 'คัดลอกไม่ได้';
  });
  return b;
}

// URL คงที่ ไม่ใช้ location.href — เปิดจากไฟล์ในเครื่องแล้ว path ในเครื่องจะติดไปกับภาพ
const SHARE_URL = 'dmo-hub.github.io/next-life';
// 9:16 (สตอรี่)
const SHARE_W = 1080, SHARE_H = 1920;
// ช่วงที่ก้อนข้อความจัดกลาง: ใต้กรอบบน ถึงเหนือบรรทัด URL ท้ายภาพ
const SHARE_TOP = 80, SHARE_BOTTOM = SHARE_H - 140;
const SHARE_FONTS = ['700 110px Srisakdi', '400 40px Sarabun', '600 30px Sarabun'];
const FONT_WAIT_MS = 3000;

// ไทยไม่เว้นวรรคระหว่างคำ ตัดบรรทัดตามขอบเขตคำจาก Intl.Segmenter · เบราว์เซอร์ที่ไม่มีตัดรายพยัญชนะ
// โดยพาสระตาม (ะ า อำ) สระบน/ล่าง/วรรณยุกต์ และสระหน้า (เ แ โ ใ ไ) ติดพยัญชนะ — ตัดรายตัวอักษรตรง ๆ ได้สระลอยต้นบรรทัด
const THAI_CLUSTER = /[\u0E40-\u0E44]?.[\u0E30-\u0E3A\u0E45\u0E47-\u0E4E]*/gsu;
function wrapThai(ctx, text, maxW) {
  const parts = typeof Intl.Segmenter === 'function'
    ? [...new Intl.Segmenter('th', { granularity: 'word' }).segment(text)].map((s) => s.segment)
    : text.match(THAI_CLUSTER) ?? [];
  const lines = [];
  let line = '';
  for (const p of parts) {
    if (line && ctx.measureText(line + p).width > maxW) {
      lines.push(line.trimEnd());
      line = p.trimStart();
    } else line += p;
  }
  if (line) lines.push(line);
  return lines;
}

async function shareBlob(facts) {
  // ฟอนต์เว็บต้องโหลดก่อนวาด ไม่งั้น canvas ใช้ฟอนต์สำรอง · เน็ตช้าเกินรอวาดด้วยฟอนต์สำรองไปเลย
  // ข้อความตัวอย่างต้องครอบทั้ง subset ไทยและละติน — load() โหลดเฉพาะ subset ที่ตัวอย่างใช้ ตัวเลข/อังกฤษจะตกฟอนต์สำรอง
  if (document.fonts) {
    await Promise.race([
      Promise.all(SHARE_FONTS.map((f) => document.fonts.load(f, `${GAME_NAME} NEXT LIFE 0123456789?`))),
      new Promise((r) => setTimeout(r, FONT_WAIT_MS)),
    ]).catch(() => {});
  }
  const cv = document.createElement('canvas');
  cv.width = SHARE_W;
  cv.height = SHARE_H;
  const ctx = cv.getContext('2d');
  const css = getComputedStyle(document.documentElement);
  const c = (k) => css.getPropertyValue(`--${k}`).trim();
  const cx = SHARE_W / 2, maxW = SHARE_W - 200;

  ctx.fillStyle = c('lacquer');
  ctx.fillRect(0, 0, SHARE_W, SHARE_H);
  ctx.strokeStyle = c('gold');
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, SHARE_W - 80, SHARE_H - 80);
  ctx.strokeStyle = c('bronze2');
  ctx.lineWidth = 1.5;
  ctx.strokeRect(56, 56, SHARE_W - 112, SHARE_H - 112);
  ctx.fillStyle = c('gold');
  for (const [x, y] of [[40, 40], [SHARE_W - 40, 40], [40, SHARE_H - 40], [SHARE_W - 40, SHARE_H - 40]]) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-11, -11, 22, 22);
    ctx.restore();
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  let y = 0;
  // วางสองรอบ: รอบแรกไม่วาด แค่วัดความสูงทั้งก้อน แล้ววาดจริงให้ก้อนอยู่กลางแนวตั้ง — ชีวิตที่ไม่มีฉายาจะได้ไม่เหลือที่ว่างกองอยู่ล่างภาพ
  let draw = false;
  // ข้อความยาวกว่ากรอบ (ชื่อ/ฉายายาว · คำเดียวยาวเกินบรรทัด) ย่อฟอนต์ลงทีละขั้นจนได้ไม่เกิน maxLines และไม่มีบรรทัดล้น
  // ถึงขั้นต่ำแล้วยังไม่พอก็วาดที่ขั้นต่ำ — ดีกว่าตัดข้อความทิ้ง
  const text = (s, font, color, lineH, gap = 0, maxLines = 2) => {
    const px = Number(font.match(/(\d+)px/)[1]);
    let k = 1, lines;
    for (;; k -= 0.05) {
      ctx.font = font.replace(/\d+px/, `${Math.round(px * k)}px`);
      lines = wrapThai(ctx, s, maxW);
      if (k <= 0.6 || (lines.length <= maxLines && lines.every((l) => ctx.measureText(l).width <= maxW))) break;
    }
    ctx.fillStyle = color;
    for (const line of lines) {
      y += lineH * k;
      if (draw) ctx.fillText(line, cx, y);
    }
    y += gap;
  };
  const rule = (gap) => {
    y += gap;
    if (!draw) return void (y += gap);
    ctx.strokeStyle = c('bronze');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 180, y);
    ctx.lineTo(cx + 180, y);
    ctx.stroke();
    y += gap;
  };

  const layout = () => {
    // ชื่อยาวแตกสองบรรทัดตรงช่องว่าง — ให้ย่อบรรทัดเดียวจะเล็กจนอ่านยากบนภาพแนวตั้ง
    for (const part of GAME_NAME.split(' ')) text(part, '700 84px Srisakdi, serif', c('gold'), 96, 0, 1);
    text('NEXT LIFE', '600 28px Sarabun, sans-serif', c('sand'), 44, 0, 1);
    // ใต้ชื่อเกม = เห็นก่อนเนื้อชีวิต คนที่เห็นภาพรู้ว่าเกิดชีวิตเดียวกันได้วันนี้
    if (facts.day) {
      y += 18;
      text(`ชาติประจำวัน ${facts.day}`, '600 46px Sarabun, sans-serif', c('gold2'), 60, 28, 1);
    }
    // รูปวัยสุดท้ายนั่งกลางเส้นคั่นแรก (B56) — ไม่กินที่เพิ่ม
    rule(44);
    if (draw) {
      ctx.fillStyle = c('lacquer');
      ctx.fillRect(cx - 54, y - 44 - 6, 108, 12);
      artDraw(ctx, facts.avatar, cx - 42, y - 44 - 42, 84);
    }
    text(facts.name, '700 72px Srisakdi, serif', c('cream'), 84, 4, 1);
    text(`${lifeEndWord(isGone(st))} ${facts.age}`, '700 96px Srisakdi, serif', c('gold2'), 110, 16, 1);
    text(facts.who, '400 40px Sarabun, sans-serif', c('cream'), 58);
    text(facts.job, '400 36px Sarabun, sans-serif', c('sand'), 52);
    rule(44);
    text('ชีวิตแบบ', '600 30px Sarabun, sans-serif', c('gold'), 44, 0, 1);
    text(facts.pattern.name, '700 76px Srisakdi, serif', c('gold2'), 92, 0, 1);
    if (facts.pattern.hint) text(facts.pattern.hint, '400 32px Sarabun, sans-serif', c('sand'), 48, 0, 3);
    if (facts.title) {
      y += 36;
      text('ฉายาหายากที่สุด', '600 30px Sarabun, sans-serif', c('gold'), 44, 0, 1);
      text(facts.title.name, '700 68px Srisakdi, serif', c('gold2'), 84, 0, 1);
      text(facts.title.tier, '400 32px Sarabun, sans-serif', c('sand'), 48, 0, 1);
    }
  };
  layout();
  y = SHARE_TOP + Math.max(0, (SHARE_BOTTOM - SHARE_TOP - y) / 2);
  draw = true;
  layout();
  ctx.font = '400 30px Sarabun, sans-serif';
  ctx.fillStyle = c('sand');
  ctx.fillText(SHARE_URL, cx, SHARE_H - 72);

  return new Promise((ok, fail) => cv.toBlob((b) => (b ? ok(b) : fail(new Error('canvas toBlob ว่าง'))), 'image/png'));
}

function downloadBlob(blob, name) {
  const a = el('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}

function openOrDownload(blob, name) {
  const url = URL.createObjectURL(blob);
  if (window.open(url, '_blank')) setTimeout(() => URL.revokeObjectURL(url), 60000);
  else {
    URL.revokeObjectURL(url);
    downloadBlob(blob, name);
  }
}

// ตรวจด้วยไฟล์เปล่า: เดสก์ท็อปหลายตัวมี navigator.share แต่ส่งไฟล์ไม่ได้
const canShareFiles = () => {
  try {
    return !!navigator.canShare?.({ files: [new File([''], 'x.png', { type: 'image/png' })] });
  } catch {
    return false;
  }
};

// วาดภาพไว้ก่อนตั้งแต่เปิดการ์ดตาย — Safari ให้เรียก share ได้เฉพาะช่วงสั้น ๆ หลังกด รอวาดตอนกดอาจหลุดสิทธิ์
// ปุ่มบันทึกมีเสมอ: Chrome บนคอมก็แชร์ไฟล์ได้ แต่หน้าแชร์ของระบบไม่ได้ให้ไฟล์เก็บไว้
function shareButtons(card) {
  // วาดล้มแล้วล้าง promise ทิ้ง ไม่งั้นกดซ้ำจะได้ promise ที่ reject ค้างไว้ทุกครั้ง
  let ready = null;
  const blob = () => (ready ??= shareBlob(shareFacts(card)).catch((e) => { ready = null; throw e; }));
  blob().catch(() => {});
  const name = `next-life-age-${card.age}.png`;
  const act = (label, fn) => {
    const b = button(label, null, async () => {
      b.disabled = true;
      b.firstChild.textContent = label;
      try {
        await fn(await blob());
      } catch {
        b.firstChild.textContent = 'สร้างภาพไม่สำเร็จ';
      } finally {
        b.disabled = false;
      }
    });
    return b;
  };
  const save = act('บันทึกภาพการ์ด', (blob) => downloadBlob(blob, name));
  if (!canShareFiles()) return [save];
  const share = act('แชร์ภาพการ์ด', async (blob) => {
    const file = new File([blob], name, { type: 'image/png' });
    try {
      await navigator.share({ files: [file], title: `${GAME_NAME} · Next Life`, text: `${GAME_NAME} · ${st.name} ${lifeEndWord(isGone(st))} ${card.age} — ${SHARE_URL}` });
    } catch (e) {
      // ผู้เล่นปิดหน้าแชร์เอง = จบ · แชร์พังด้วยเหตุอื่น เปิดภาพในแท็บใหม่ให้กดค้างบันทึก (มือถือที่โหลดไฟล์ไม่ได้) · แท็บโดนบล็อกจึงโหลดไฟล์
      if (e?.name !== 'AbortError') openOrDownload(blob, name);
    }
  });
  return [share, save];
}

// เหตุผลล็อก + ยอดเงินที่ขาด (B107) · ท่อนตั้งต้น "เงินไม่พอ" กลายเป็นยอด · reason ของเนื้อหา
// พูดเรื่องเงินอยู่แล้ว (เช่น "เงินไม่พอจ่ายแป๊ะเจี๊ยะ") จึงต่อท้ายแค่ยอด ไม่แทนกลางประโยค
function lockText(card, i) {
  const why = card.locked?.[i];
  const gap = card.moneyGap?.[i];
  if (!why || !gap) return why;
  const parts = why.split(' · ');
  const at = parts.indexOf('เงินไม่พอ');
  if (at < 0) return `${why} · ขาดอีก ${baht(gap)}`;
  parts[at] = `ขาดเงินอีก ${baht(gap)}`;
  return parts.join(' · ');
}

// กู้มาจ่าย (B111 เจ้าของเคาะ): ปุ่มละแหล่งใต้ตัวเลือกที่ขาดแค่เงิน บอกดอก + ยอดจ่ายต่อปี + ระยะ
// นอกระบบไม่มีระยะ — จ่ายแต่ดอก ต้นค้าง ต้องบอกตรง ๆ ไม่งั้นอ่านเหมือนผ่อนหมดได้
// ป้ายบอกชื่อตัวเลือกที่จ่าย: สองข้อขาดเงินพร้อมกันได้ ปุ่มกู้แหล่งเดียวกันหน้าตาเหมือนกันจนแยกไม่ออกว่าจ่ายข้อไหน
// ตัดท้ายด้วย CSS (.of) ไม่ใช่นับตัวอักษร — ความกว้างที่เหลือขึ้นกับจอและป้ายผล และตัดกลางสระไทยไม่ได้
const pct = (r) => `${+(r * 100).toFixed(1)}%`;
function loanButtons(card, i) {
  return (card.loans?.[i] ?? []).map((o) => {
    // ระยะเป็นก้อนแยก — ป้ายผลไม่ตัดกลางก้อน ก้อนยาวรวดเดียวล้นปุ่มจอมือถือ
    const pay = o.years ? `ผ่อนปีละ ${baht(o.yearly)} · นาน ${o.years} ปี` : `จ่ายดอกปีละ ${baht(o.yearly)} · ต้นค้าง`;
    const b = button(`กู้${o.name}มาจ่าย: `, `ดอก ${pct(o.rate)} · ${pay}`, () => (veil(card, i), play(loanPick(i, o.kind))));
    b.firstChild.append(el('span', 'of', card.choices[i]));
    b.classList.add('loan');
    return b;
  });
}

// ไอคอนบรรทัดผลย้อนบนการ์ด · ป้ายล่วงหน้าบนปุ่มตัวเลือกเจ้าของสั่งซ่อน — ผู้เล่นไม่รู้ล่วงหน้าว่าทางไหนมีเรื่องตามมา
const followIcon = (k) => {
  const s = el('span');
  s.insertAdjacentHTML('beforeend', FOLLOW_ICON[k]);
  return s;
};

function button(label, fx, onclick, hint = null) {
  const b = el('button', 'choice');
  const main = el('span', null, label);
  // อยู่ในก้อนเดียวกับข้อความตัวเลือก ป้ายผลด้านขวาจึงยังชิดขวาเหมือนการ์ดที่ไม่มีบรรทัดรอง
  if (hint) main.append(el('small', 'hint', hint));
  b.append(main);
  if (fx) {
    const tag = el('span', 'fx');
    tag.innerHTML = fxHtml(fx);
    b.append(tag);
  }
  b.onclick = onclick;
  return b;
}

// ปุ่มลัด: Enter กดปุ่มเดินเรื่องปุ่มเดียวของการ์ด
const enter = (b) => {
  b.dataset.enter = '';
  return b;
};
// ปุ่มลัดตัวเลข: เลขบนปุ่มคือคีย์ที่กด · นับเฉพาะตัวเลือกที่เห็น (ประตูที่ยังไม่เปิดไม่กินเลข) · ปุ่มกู้ไม่มีเลข เป็นทางของปุ่มบน
// คีย์มีแค่ 1–9 — การ์ดที่ตัวเลือกเกิน 9 ปุ่มที่เหลือไม่ขึ้นเลข ไม่งั้นเลข 10 บอกคีย์ที่กดไม่ได้
const numbered = (b, n) => {
  if (n > 9) return b;
  b.dataset.key = String(n);
  const k = el('kbd', null, String(n));
  k.setAttribute('aria-hidden', 'true');
  b.prepend(k);
  return b;
};
document.addEventListener('keydown', (e) => {
  // กดค้าง = repeat — ไม่นับ ไม่งั้นเลือกรัวข้ามการ์ด
  if (e.repeat || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  const t = e.target;
  if (t.closest?.('input, textarea, select, [contenteditable]')) return;
  let b;
  if (e.key === 'Escape' && sheetClose && !root.querySelector('.sheet.pin')) {
    e.preventDefault();
    return closeSheet();
  }
  const book = root.querySelector('.lifebook');
  if (book && (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
    // Space บนปุ่มที่โฟกัสอยู่ให้ปุ่มนั้นทำงานเอง ไม่งั้นกดทีเดียวพลิกสองครั้ง
    if (e.key === ' ' && t.closest?.('button, summary, a')) return;
    b = book.querySelector(e.key === 'ArrowLeft' ? '.choices [data-prev]' : '.choices [data-enter]');
  } else if (e.key === 'Enter') {
    // โฟกัสอยู่ที่ปุ่ม/หัวข้อพับ ให้ Enter ทำงานของตัวนั้น (แชร์ภาพ · สมุดฉายา · ผังตระกูล)
    if (t.closest?.('button, summary, a')) return;
    b = root.querySelector('.choices [data-enter]');
  } else if (/^[1-9]$/.test(e.key)) {
    b = root.querySelector(`.choices [data-key="${e.key}"]`);
  }
  // การ์ดที่พับไว้ (B117) ปุ่มยังอยู่ใน DOM แค่ซ่อน — ปุ่มลัดต้องไม่กดปุ่มที่มองไม่เห็น · การ์ดใต้แผงเมนู (inert) ก็เช่นกัน
  if (!b || b.disabled || b.closest('[hidden], [inert]')) return;
  e.preventDefault();
  b.click();
});

// แนวการ์ดของโลกนี้ทางเดียว (ทาง A กระดาษเก่า) — โลกละธีม: ลางกับเหตุการณ์ความเชื่อไม่แยกเป็นแสงเทียนแล้ว
// สีมืดทองเป็นของปรโลกที่เดียว (renderAfter) · ต่างโลกมีธีมของตัวเอง · มรณบัตร = หนังสืองานศพบนฐานทาง A
const styleOf = (card) => (card.kind === 'death' ? 'a mem' : 'a yc');

// ภาพจาก art.mjs (B56) วาดเป็น SVG — ชุดรูปทรงเดียวกับที่ภาพแชร์วาดลง canvas
function artSvg(cls, w, h, parts) {
  const svg = svgEl('svg', { class: cls, viewBox: `0 0 ${w} ${h}`, 'aria-hidden': 'true' });
  for (const p of parts) svg.append(svgEl('path', { d: p.d, fill: p.fill ?? 'none', ...(p.stroke && { stroke: p.stroke, 'stroke-width': p.w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }) }));
  return svg;
}
function artDraw(ctx, parts, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / AVATAR_SIZE, size / AVATAR_SIZE);
  ctx.beginPath();
  ctx.arc(AVATAR_SIZE / 2, AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.lineCap = ctx.lineJoin = 'round';
  for (const p of parts) {
    const path = new Path2D(p.d);
    if (p.fill) {
      ctx.fillStyle = p.fill;
      ctx.fill(path);
    }
    if (p.stroke) {
      ctx.strokeStyle = p.stroke;
      ctx.lineWidth = p.w;
      ctx.stroke(path);
    }
  }
  ctx.restore();
}
// รูปตัวละครอ่านฐานะ ณ ตอนนี้ (standingOf ตัวเดียวกับกราฟฐานะ) — อ่านอย่างเดียว ไม่แตะเซฟ
const avatarParts = (age) => avatarArt(Math.max(0, STAGES.findLastIndex((s) => age >= s.from)), st.sex, artTier(standingOf(st)));
const avatar = (age) => artSvg('av', AVATAR_SIZE, AVATAR_SIZE, avatarParts(age));
// ชราไม่ได้ "เติบโต" แล้ว แต่คงรูปประโยคเดียวกันให้ป้ายทุกช่วงอ่านเป็นชุด
const growLabel = (stage) => `เติบโตเป็น${stage === 'หนุ่มสาว' ? (st.sex === 'หญิง' ? 'สาว' : 'หนุ่ม') : stage === 'ชรา' ? 'ผู้สูงวัย' : stage === 'วัยรุ่น' ? 'วัยรุ่น' : `วัย${stage}`}`;
// รูปบนป้ายคนหาย/หนังสืองานศพ = ตัวละครเองตอนอายุนั้น ชุดเดียวกับภาพแชร์ — หุ่นเทาตายตัวเดิมไม่บอกว่าเป็นใคร
const portrait = (age) => artSvg('por', AVATAR_SIZE, AVATAR_SIZE, avatarParts(age));

const KICKER = { intro: 'เปิดชีวิต', stage: 'เปลี่ยนช่วงชีวิต', era: 'บ้านเมือง', omen: 'ลาง', alloc: 'เงินเก็บ', result: 'ผลที่ตามมา', warn: 'ใกล้ตาย', memory: 'ความทรงจำ', upgrade: 'สกิลที่พกมา · เลือกฝึก' };
// ป้ายคนหาย (B139) — ถ้อยคำของคนที่บ้านที่ยังรอ: ไม่อาลัย ไม่บอกเหตุ (B110) · will[0] ไม่มีพินัยกรรม · will[1] มี
const LOST = {
  head: 'ประกาศตามหาคนหาย',
  money: 'ทรัพย์ที่ทิ้งไว้',
  debt: 'หนี้ที่ทิ้งไว้',
  will: ['ไม่ได้สั่งเรื่องทรัพย์ไว้ คนที่บ้านแบ่งกันเองจนผิดใจกัน', 'คนที่บ้านพบพินัยกรรมที่เขียนไว้ จึงแบ่งทรัพย์ตามนั้น'],
  call: 'ใครพบเห็น โปรดแจ้งคนที่บ้าน ทุกคนยังรออยู่',
};

// คนรุ่นเดียวกันที่อยู่เลยอายุนี้ (B142) — ตารางชีพเดียวกับที่ชีวิตนี้ทอยตาย (ปีต้นแบบของ seed นี้) ไม่ใช่สถิติผู้เล่น
// lifeQx อ่าน hash ไม่ดึงเลขสุ่ม ผลเกมจึงไม่ขยับ · ตายอายุ N = ไม่ถึงวันเกิดปีที่ N+1 ⇒ นับคนที่รอดถึง N+1
function outliveLine(age) {
  let alive = 1;
  for (let a = 0; a <= age && a < MAX_AGE; a++) alive *= 1 - lifeQx(st.content.era, st.seed, st.sex, st.birthYear + a, a);
  const pct = alive * 100;
  const shown = pct < 1 ? 'ไม่ถึง 1%' : pct > 99 ? 'กว่า 99%' : `${Math.round(pct)}%`;
  return `${st.sex}ไทยที่เกิดปีเดียวกัน ${shown} อยู่ได้นานกว่าคุณ`;
}

// โอกาสเกิดแบบนี้ (B141) — คูณตามลำดับที่ newLife สุ่มจริง: ภาค×จังหวัดตามประชากร แล้วฐานะตามรายได้ของภาคนั้นในปีเกิด
// อ่านตารางอย่างเดียว ไม่แตะ rng · เซฟเก่าที่ไม่มีจังหวัดไม่แสดง
const oneIn = (n) => (n < 100 ? `${Math.round(n)}` : n < 1e6 ? Number(n.toPrecision(2)).toLocaleString('en-US') : `${Number((n / 1e6).toPrecision(2))} ล้าน`);
function birthOddsLine() {
  const birth = st.content.era.birth;
  const region = birth.regions.find((r) => r.name === st.region);
  const prov = region?.provinces.find((p) => p.name === st.province);
  const cls = CLASSES.indexOf(st.cls);
  if (!prov || cls < 0) return null;
  const total = birth.regions.reduce((s, r) => s + r.w, 0);
  const p = (prov.w / total) * classOdds(birth, regionRatio(birth, region.ses, st.birthYear))[cls].p;
  return p > 0 ? `เด็กไทยที่เกิดปีเดียวกัน ราว 1 ใน ${oneIn(1 / p)} คน เกิดแบบคุณ (${provinceLabel(st)} · ฐานะ${st.cls})` : null;
}

// ป้ายที่มาตัวเลข (B140): 📎 อ่านจากข้อมูลจริง · 🎲 ค่าประมาณของเกม (ปีที่ใช้ไม่มีข้อมูลจริง เกมยืมค่าปีที่ใกล้สุด)
// บอกช่วงปีของชุดข้อมูล ไม่บอกปีของแถวที่ใช้ — ปีแถวคือปีเกิดของชีวิตที่อยู่ในช่วงข้อมูลจริง ปีเกมจะหลุดขึ้นจอ (B14 ข้อ 12)
// มือถือไม่มี hover จึงเป็นปุ่มแตะเปิด/ปิด ไม่ใช่ title
const yearsOf = (s) => (s.from === s.to ? `${s.from}` : `${s.from}–${s.to}`);
const srcText = (what, s) => `${what} (${s.by.join(' · ')} ${yearsOf(s)})`;
const inData = (s, ys) => ys.every((y) => y >= s.from && y <= s.to);
const MORT_WHAT = 'อายุคาดเฉลี่ยและอัตราตายทารก';
const NO_MORT = 'บางปีที่ใช้ยังไม่มีข้อมูลการตาย เกมใช้ค่าปีที่ใกล้ที่สุดแทน';
function srcTag([real, text]) {
  const tag = el('span', 'src');
  const b = el('button', null, real ? '📎' : '🎲');
  b.type = 'button';
  b.setAttribute('aria-label', real ? 'ข้อมูลจริง แตะดูที่มา' : 'ค่าประมาณของเกม แตะดูเหตุผล');
  b.setAttribute('aria-expanded', 'false');
  const d = el('span', 'src-d', real ? text : `ค่าประมาณของเกม — ${text}`);
  d.hidden = true;
  b.onclick = () => {
    d.hidden = !d.hidden;
    b.setAttribute('aria-expanded', String(!d.hidden));
  };
  tag.append(b, d);
  return tag;
}
const sourced = (node, src) => (node.append(' ', srcTag(src)), node);

// ปีเกมทุกปีอ่านค่าของปีต้นแบบ (lifeQx · inflationRate) จึงตรวจที่ปีต้นแบบ ไม่ใช่ปีเกม
function outliveSrc(age) {
  const era = st.content.era;
  const ys = [];
  for (let a = 0; a <= age && a < MAX_AGE; a++) ys.push(protoYear(era, st.seed, st.birthYear + a));
  return inData(era.src.mort, ys) ? [true, `คำนวณจาก${srcText(MORT_WHAT, era.src.mort)}`] : [false, NO_MORT];
}

// แยกทารก/เด็กโตตามเกณฑ์เดียวกับที่ engine เขียน card.note (ทารกอ่านอัตราตายทารกตรง · เด็กโตคำนวณ qx จากตารางชีพ)
function childNoteSrc(age) {
  const era = st.content.era;
  const infant = age < 5;
  const y = protoYear(era, st.seed, infant ? st.birthYear : st.birthYear + age);
  if (!inData(era.src.mort, [y])) return [false, NO_MORT];
  return [true, infant ? srcText('อัตราตายทารก', era.src.mort) : `คำนวณจาก${srcText(MORT_WHAT, era.src.mort)}`];
}

// ภาค×จังหวัดอ่านประชากรปีเดียว · ฐานะอ่านรายได้รายภาคของปีเกิดจริง (ไม่ผ่านปีต้นแบบ) — นอกช่วงตารางรายได้ = ค่ายืม
function birthOddsSrc() {
  const src = st.content.era.src;
  if (!inData(src.income, [st.birthYear])) return [false, `ปีเกิดนี้อยู่นอกช่วงข้อมูลรายได้รายภาค (${yearsOf(src.income)}) เกมใช้ค่าปีที่ใกล้ที่สุดแทน`];
  return [true, `คำนวณจาก${srcText('ประชากรรายจังหวัด', src.pop)} · ${srcText('รายได้ครัวเรือนรายภาค', src.income)} · ${srcText('ส่วนแบ่งรายได้', src.share)}`];
}

// บรรทัด "ของแพงขึ้น" ของการ์ดทบทวนเงินเก็บมาจาก engine เป็นข้อความ — จับที่คำนำ · ทุกปีอยู่ในช่วงปีต้นแบบ era.future
const PRICE_ITEM = 'ของแพงขึ้น ';
function priceSrc() {
  const era = st.content.era;
  return inData(era.src.cpi, [era.future.from, era.future.to]) ? [true, `คำนวณจาก${srcText('เงินเฟ้อรายปี', era.src.cpi)}`] : [false, 'บางปีที่ใช้ยังไม่มีข้อมูลเงินเฟ้อ เกมใช้ค่าประมาณแทน'];
}

// เอฟเฟกต์ 3 จังหวะ (B-fx · เจ้าของเลือกแบบ A ทั้งสาม): พลิกการ์ดใหม่ทุกใบ · ตะเกียงดับตอนตาย · ตราเหรียญเมื่อได้ฉายาหายาก/ตำนาน (ข้อ 160 แทนแถบผ้าคลี่)
// frame(parts, t) ขึ้นกับ t 0..1 อย่างเดียว ⇒ ข้าม = frame(1) · สีชุด ART_INK ไม่รับค่าบุญบาป — ตายแบบเดียวทุกกรรม ห้ามเผยกรรมผ่านเอฟเฟกต์
const fxClamp = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const fxSpan = (t, a, b) => fxClamp((t - a) / (b - a));
const fxOut = (x) => 1 - (1 - x) ** 3;
const fxIn = (x) => x * x * x;
const fxBack = (x) => 1 + 2.2 * (x - 1) ** 3 + 1.2 * (x - 1) ** 2;
const fxSvg = (w, h, inner, cls = '') => `<svg class="${cls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${inner}</svg>`;
const FX_INK = ART_INK;
// ค่าเจ้าของเคาะ (ui-redo ข้อ 160 · 242–244) · หายาก = เงิน ตำนาน = ทอง โลหะคนละชนิด
const FX_TITLE = { rare: '#C9CDD3', leg: ART_INK.gold, legInk: ART_INK.lacquer, frameW: 1.6, glow: 46, fs: 18, subFs: 12, nameW: 200, durRare: 900, durLeg: 1400 };
// ฉากซ้อนเต็มจอของตาย/ฉายา — จบเองค่อยจางออก · ถูกข้ามหายทันที
const fxOv = () => document.body.appendChild(el('div', 'fx-ov'));
function fxOvEnd(ov, natural) {
  if (!natural) return ov.remove();
  ov.classList.add('fx-out');
  setTimeout(() => ov.remove(), 260);
}

const FX = {
  // เส้นทองวิ่งรอบกรอบการ์ด แล้วเนื้อการ์ดค่อยขึ้น (ui-redo ใบ 37 · แบบ B ของต้นแบบ fx-proto) · ขนาดเส้นวัดจากการ์ดจริงตอนเริ่ม
  // reduced-motion ไม่วาดเส้น — fxPlay จางทั้งใบให้เอง
  // block 0: คลิกแรกระหว่างพลิกข้ามภาพแล้วปุ่มทำงานทันที — ผู้เล่นไม่ต้องรอภาพก่อนกด
  flipB: { dur: 520, block: 0,
    build: (card) => {
      const kids = [...card.children];
      if (fxReduced()) return { kids, line: null, svg: null };
      const r = card.getBoundingClientRect();
      const rx = parseFloat(getComputedStyle(card).borderTopLeftRadius) || 0;
      card.classList.add('fx-trace-on');
      card.insertAdjacentHTML('beforeend', fxSvg(r.width, r.height, `<rect x="1" y="1" width="${Math.max(0, r.width - 2)}" height="${Math.max(0, r.height - 2)}" rx="${rx}" fill="none" stroke="${FX_INK.gold}" stroke-width="2" pathLength="100" stroke-dasharray="100"/>`, 'fx-trace'));
      const svg = card.lastElementChild;
      return { card, kids, svg, line: svg.querySelector('rect') };
    },
    frame: (p, t) => {
      if (p.line) {
        p.line.style.strokeDashoffset = 100 * (1 - fxOut(fxSpan(t, 0, 0.55)));
        p.line.style.opacity = 1 - 0.6 * fxSpan(t, 0.75, 1);
      }
      const c = fxOut(fxSpan(t, 0.35, 1));
      for (const k of p.kids) {
        k.style.opacity = c === 1 ? '' : c;
        k.style.transform = c === 1 ? '' : `translateY(${8 * (1 - c)}px)`;
      }
    },
    end: (p) => {
      for (const k of p.kids) k.style.opacity = k.style.transform = '';
      p.svg?.remove();
      p.card?.classList.remove('fx-trace-on');
    } },
  // ตะเกียงดับ: เปลวสั่นแล้วหด · ควันเส้นเดียวลอยขึ้นจาง · จอหรี่เป็นรัก · คำบรรยายค่อยขึ้น
  deathA: { dur: 1600, block: 300,
    build: (ov, o) => {
      ov.innerHTML = `<div class="fx-veil"></div>${fxSvg(120, 120, `<path class="fx-smoke" d="M60 44c-6-8 6-14 0-22s6-14 0-20" fill="none" stroke="${FX_INK.cream}" stroke-width="1.4" stroke-linecap="round" pathLength="100" stroke-dasharray="100"/><g class="fx-flame" style="transform-origin:60px 58px"><path d="M60 34c7 9 9 15 6 20q-2 4-6 4t-6-4c-3-5-1-11 6-20z" fill="${FX_INK.gold2}"/><path d="M60 44c3 4 4 7 2 10q-1 2-2 2t-2-2c-2-3-1-6 2-10z" fill="${FX_INK.cream}"/></g><path d="M36 64h48q-4 18-24 18t-24-18z" fill="${FX_INK.bronze2}" stroke="${FX_INK.gold}" stroke-width="1.4"/><path d="M58 64v-6h4v6" fill="${FX_INK.lacquer2}"/><path d="M44 90h32" stroke="${FX_INK.gold}" stroke-width="1.4"/>`, 'fx-lamp')}<div class="fx-cap"></div>`;
      const cap = ov.querySelector('.fx-cap');
      cap.append(o.head, el('small', null, o.sub));
      return { ov, flame: ov.querySelector('.fx-flame'), smoke: ov.querySelector('.fx-smoke'), veil: ov.firstChild, cap };
    },
    frame: (p, t) => {
      const f = fxSpan(t, 0, 0.38);
      const flick = 1 + 0.08 * Math.sin(t * 60) * (1 - f);
      p.flame.style.transform = `scale(${(1 - fxIn(f)) * flick},${(1 - f) * flick})`;
      p.flame.style.opacity = 1 - fxSpan(t, 0.3, 0.38);
      const s = fxSpan(t, 0.32, 0.9);
      p.smoke.style.strokeDashoffset = 100 * (1 - fxOut(s));
      p.smoke.style.opacity = s > 0 ? 0.7 * (1 - fxSpan(t, 0.7, 1)) : 0;
      p.veil.style.opacity = 0.82 * fxOut(fxSpan(t, 0.15, 0.85));
      p.cap.style.opacity = fxOut(fxSpan(t, 0.55, 1));
      p.cap.style.transform = `translateY(${6 * (1 - fxSpan(t, 0.55, 1))}px)`;
    },
    end: (p, natural) => fxOvEnd(p.ov, natural) },
  // ตราแปดเหลี่ยม (ui-redo ข้อ 160 · 242) — ภาพนิ่งหายาก/ตำนานต้องแยกด้วยตา (ข้อ 39)
  // หายาก = ตรารักขอบเงิน เส้นในจาง ดาวดวงเดียว ขีดเส้นเดียว · ตำนาน = ตราทองล้อมกลีบบัว 12 กลีบ วงจุดทอง ดาว 3 ดวง ชื่อทองขีดสองเส้น
  title: {
    build: (ov, o) => {
      const leg = o.tier === 'legend';
      const id = `fx${++fxUid}`;
      const T = FX_TITLE, w = T.frameW;
      const star = (x, y, r, f) => `<path d="M${x} ${y - r}L${x + r * 0.3} ${y - r * 0.3}L${x + r} ${y}L${x + r * 0.3} ${y + r * 0.3}L${x} ${y + r}L${x - r * 0.3} ${y + r * 0.3}L${x - r} ${y}L${x - r * 0.3} ${y - r * 0.3}z" fill="${f}"/>`;
      const oct = (r) => Array.from({ length: 8 }, (_, i) => { const a = Math.PI / 8 + i * Math.PI / 4; return `${(150 + r * Math.cos(a)).toFixed(2)},${(48 + r * Math.sin(a)).toFixed(2)}`; }).join(' ');
      const name = (fill) => `<text class="fx-name" x="150" y="110" text-anchor="middle" font-size="${T.fs}" fill="${fill}"></text>`;
      const sub = (fill) => `<text class="fx-sub" x="150" y="160" text-anchor="middle" font-size="${T.subFs}" fill="${fill}">${leg ? 'ฉายาระดับตำนาน' : 'ฉายาระดับหายาก'}</text>`;
      // ม่าน 0.6 ยังเห็นตัวหนังสือการ์ดสว่างทะลุ ⇒ ชื่อ+ป้ายต้องมีพื้นทึบรองของตัวเอง (ui-redo ข้อ 183) · กว้างพอชื่อที่ถูกบีบเต็ม nameW
      const plate = (stroke) => `<rect class="fx-plate" x="${150 - T.nameW / 2 - 12}" y="86" width="${T.nameW + 24}" height="84" rx="8" fill="${FX_INK.lacquer2}" stroke="${stroke}" stroke-width="0.8" stroke-opacity="0.5"/>`;
      let inner;
      if (!leg) {
        inner = `${plate(T.rare)}<g class="fx-medal" style="transform-origin:150px 48px"><polygon points="${oct(30)}" fill="${FX_INK.lacquer2}" stroke="${T.rare}" stroke-width="${w}"/><polygon points="${oct(25)}" fill="none" stroke="${T.rare}" stroke-width="0.7" stroke-opacity="0.7"/>${star(150, 48, 12, T.rare)}</g>${name(FX_INK.cream)}<path class="fx-line" d="M70 120h160" stroke="${T.rare}" stroke-width="${w}" pathLength="100" stroke-dasharray="100"/>${sub(T.rare)}`;
      } else {
        const petals = Array.from({ length: 12 }, (_, i) => `<path class="fx-petal" d="M150 48q-9 -20.8 0 -40q9 19.2 0 40z" transform="rotate(${i * 30} 150 48)" fill="url(#${id}g)" stroke="${FX_INK.gold2}" stroke-width="0.6"/>`).join('');
        const R = 30 + T.glow * 0.5;
        const dots = Array.from({ length: 16 }, (_, i) => `<circle class="fx-dot" cx="${150 + R * Math.cos(i * Math.PI / 8)}" cy="${48 + R * Math.sin(i * Math.PI / 8)}" r="1.8" fill="${FX_INK.gold2}"/>`).join('');
        inner = `<defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${FX_INK.gold2}"/><stop offset=".55" stop-color="${T.leg}"/><stop offset="1" stop-color="${FX_INK.bronze2}"/></linearGradient></defs>${plate(T.leg)}<g>${dots}</g><g>${petals}</g><g class="fx-medal" style="transform-origin:150px 48px"><polygon points="${oct(27)}" fill="url(#${id}g)" stroke="${FX_INK.gold2}" stroke-width="${w}"/><polygon points="${oct(22)}" fill="none" stroke="${T.legInk}" stroke-width="0.8"/>${star(150, 42, 9, T.legInk)}${star(139, 56, 5, T.legInk)}${star(161, 56, 5, T.legInk)}</g>${name(FX_INK.gold2)}<path class="fx-line" d="M70 119h160M90 124h120" stroke="${T.leg}" stroke-width="${w}" pathLength="100" stroke-dasharray="100"/>${sub(FX_INK.gold2)}`;
      }
      ov.innerHTML = `<div class="fx-veil"></div><div class="fx-title">${fxSvg(300, 170, inner)}</div>`;
      const q = (s) => ov.querySelector(s);
      const nm = q('.fx-name');
      nm.textContent = o.name;
      // ตราเดียวกันใช้กับสกิลที่ลงสมุด/ขึ้นขั้น (06s) — ป้ายใต้ชื่อบอกว่าเป็นอะไร
      if (o.sub) q('.fx-sub').textContent = o.sub;
      // ชื่อยาวเกินเส้นใต้ชื่อ ⇒ บีบให้พอดี ไม่ล้นจอ 390
      if (nm.getComputedTextLength() > T.nameW) {
        nm.setAttribute('textLength', T.nameW);
        nm.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      }
      return { ov, leg, veil: ov.firstChild, plate: q('.fx-plate'), medal: q('.fx-medal'), name: nm, line: q('.fx-line'), sub: q('.fx-sub'), petals: [...ov.querySelectorAll('.fx-petal')], dots: [...ov.querySelectorAll('.fx-dot')] };
    },
    dur: (o) => (o.tier === 'legend' ? FX_TITLE.durLeg : FX_TITLE.durRare), block: 300,
    frame: (p, t) => {
      p.veil.style.opacity = 0.6 * fxOut(fxSpan(t, 0, 0.2));
      // พื้นรองขึ้นเต็มก่อนชื่อเริ่มโผล่ (0.3) — ชื่อไม่เคยซ้อนตัวหนังสือการ์ดแม้เฟรมเดียว
      p.plate.style.opacity = fxSpan(t, 0.15, 0.3);
      p.medal.style.transform = `scale(${1.7 - 0.7 * fxOut(fxSpan(t, 0, 0.3))})`;
      p.medal.style.opacity = fxSpan(t, 0, 0.12);
      p.name.style.opacity = fxSpan(t, 0.3, 0.55);
      p.line.style.strokeDashoffset = 100 * (1 - fxOut(fxSpan(t, 0.4, 0.7)));
      p.sub.style.opacity = fxSpan(t, 0.55, 0.8);
      p.petals.forEach((x, i) => { x.style.opacity = fxSpan(t, 0.25 + i * 0.025, 0.35 + i * 0.025); });
      p.dots.forEach((x, i) => { x.style.opacity = fxSpan(t, 0.6 + i * 0.012, 0.66 + i * 0.012); });
    },
    end: (p, natural) => fxOvEnd(p.ov, natural) },
};

// reduced-motion: พลิกเหลือ fade 150ms · ฉากตาย/ฉายาไม่เล่นเลย (การ์ดบอกเรื่องเดียวกันอยู่แล้ว)
const FX_RM = 150;
const fxReduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
let fxCur = null;
let fxSeen = null;
let fxUid = 0;
// บล็อกคลิกได้ไม่เกิน block ms · หลังจากนั้นคลิกแรกข้ามไปภาพจบแล้วปุ่มทำงานต่อทันที · then = จังหวะถัดไป เล่นต่อเมื่อจบเองเท่านั้น
function fxPlay(stage, name, o = {}, then = null) {
  const fx = FX[name];
  const parts = fx.build(stage, o);
  const rm = fxReduced();
  const total = rm ? FX_RM : typeof fx.dur === 'function' ? fx.dur(o) : fx.dur;
  const t0 = performance.now();
  let raf = 0;
  let done = false;
  const fin = (natural) => {
    cancelAnimationFrame(raf);
    // ภาพจบเองก่อนครบเวลากัน = ตัวกันยังอยู่ (ตัวเดิม) · คลิกหลังครบเวลาแค่ปลดตัวกัน
    if (fxCur === me && !(natural && performance.now() < me.until)) fxCur = null;
    if (done) return;
    done = true;
    fx.frame(parts, 1);
    stage.style.opacity = '';
    fx.end(parts, natural);
    if (natural) then?.();
  };
  const me = { until: t0 + Math.min(fx.block, total), skip: () => fin(false) };
  const tick = (now) => {
    const t = fxClamp((now - t0) / total);
    if (rm) stage.style.opacity = t;
    else fx.frame(parts, t);
    if (t < 1) raf = requestAnimationFrame(tick);
    else fin(true);
  };
  if (rm) {
    fx.frame(parts, 1);
    stage.style.opacity = 0;
  } else fx.frame(parts, 0);
  raf = requestAnimationFrame(tick);
  fxCur = me;
}
const FX_TIER = { ตำนาน: 'legend', หายาก: 'rare' };
// เรียกท้ายทุกตัววาดการ์ด: การ์ดใหม่ = พลิก · การ์ดตาย = ตะเกียงดับ แล้วต่อตราเหรียญถ้าฉายาเด่นเป็นหายาก/ตำนาน
// วาดซ้ำการ์ดเดิม (สลับแท็บ) ไม่เล่นซ้ำ
function fxCard(box, card) {
  fxCur?.skip();
  if (fxSeen === card) return;
  fxSeen = card;
  if (card.kind !== 'death') return fxPlay(box, 'flipB');
  if (fxReduced()) return;
  const top = lifeTitles(card).titles[0];
  const tier = top && FX_TIER[top.tier];
  const gone = isGone(st);
  fxPlay(fxOv(), 'deathA', { head: gone ? 'หายไปจากบ้าน' : 'จากไปอย่างสงบ', sub: `${genLabel()}${lifeEndWord(gone)} ${card.age}` }, tier && (() => fxPlay(fxOv(), 'title', { tier, name: top.name })));
}
const fxGate = (e) => {
  if (!fxCur) return;
  if (performance.now() < fxCur.until) {
    e.preventDefault();
    e.stopImmediatePropagation();
  } else fxCur.skip();
};
window.addEventListener('click', fxGate, true);
window.addEventListener('keydown', (e) => [' ', 'Enter', 'ArrowRight', 'ArrowLeft'].includes(e.key) && fxGate(e), true);

function render(card) {
  // ไปกลับกลางชีวิต (B68m): ทริปยังเป็นชีวิตนี้ ปุ่มจึงเดินผ่านปุ่มชีวิต — จอเต็มของทริปเป็นงานเลน C
  if (card.kind === 'isekai') return renderIsekai(card);
  root.replaceChildren();
  const s = statsOf(st);
  const box = el('article', `card ${styleOf(card)}`);
  const top = el('div', 'top');
  const body = el('div', 'body');
  const choices = el('div', 'choices');
  // ชิ้นที่ต่อท้ายปุ่ม (การ์ดตาย) — การ์ดอื่นปุ่มอยู่ท้ายสุดเสมอ
  const after = [];
  const next = () => play(T.next);

  if (card.kind === 'death') {
    // หายตัวไม่มีศพ (B137) จึงไม่มีหนังสืองานศพ — คนที่บ้านยังเชื่อว่ามีชีวิตอยู่ ใบนี้เป็นป้ายตามหาคนหาย ไม่มีคำอาลัย (B139)
    const gone = isGone(st);
    if (gone) box.classList.add('lost');
    top.append(el('b', null, gone ? LOST.head : 'ด้วยรักและอาลัย'));
    box.append(top);
    // ตราไม่มีชื่อผู้ตาย: เขียนชื่อด้วยหมึกแดงถือเป็นการแช่ง (ข้อ 154) · คนหายไม่มีตรา ยังไม่มีใครถือว่าจากไป (B139)
    if (!gone) {
      const seal = el('span', 'd-seal', 'อาลัย');
      seal.setAttribute('aria-hidden', 'true');
      box.append(seal);
    }
    const bg = sceneBg(gone ? 'gone' : 'death');
    if (bg) box.append(bg);
    // หนังสืองานศพ (ui-redo 57): รูป ชื่อ อายุ สาเหตุ เป็นหัวกลางใบไม่มีกรอบ · ข้อมูลเป็นตารางสองคอลัมน์ · ปุ่มไปต่อท้ายข้อมูล
    // หนังสืองานศพบอกอายุ ไม่บอกปี พ.ศ. — ปีเกมไม่ขึ้นจอ (B14 ข้อ 12)
    const head = el('div', 'd-head');
    head.append(portrait(card.age), el('h3', null, fullName()), el('p', 'dates', `${genLabel()}${gone ? `หายตัวเมื่ออายุ ${card.age} ปี` : `สิริอายุ ${card.age} ปี`}`));
    const why = causeOf(card.cause, card.age);
    if (why) head.append(el('p', 'sub', `จากไป${why.join('')}`));
    body.append(head);
    if (gone) body.append(el('p', 'call', LOST.call));
    const tl = titleLine(card);
    if (tl) body.append(tl);
    const facts = el('dl', 'd-facts');
    const fact = (k, v, cls) => facts.append(el('dt', null, k), el('dd', cls, v));
    fact('เพศ', st.sex);
    fact('จังหวัด', provinceLabel(st));
    fact('ฐานะ', classNow(st));
    fact('งาน', card.job);
    if (st.edu) fact('วุฒิ', st.edu);
    const net = gone ? (card.summary.money < 0 ? LOST.debt : LOST.money) : card.summary.money < 0 ? 'ตายพร้อมหนี้' : 'ทรัพย์สุทธิ';
    fact(net, baht(card.summary.money), card.summary.money < 0 ? 'neg' : undefined);
    body.append(facts);
    // ใบมรณะย่อ (ui-redo ใบ 10): ด้านบนพอดีจอแรกแล้วตามด้วยปุ่มไปต่อทันที — รายละเอียดอยู่ในแท็บใต้ปุ่ม (ใบ 11)
    // ชิ้นใต้ปุ่มมีคลาส body ⇒ จอแนวนอนเตี้ย panels() ยังวางไว้คอลัมน์กลางต่อจากปุ่ม
    const rest = el('div', 'body d-rest');
    after.push(rest);
    const sum = [];
    // คนหายไม่รู้อายุตาย จึงเทียบรุ่นไม่ได้ (B142)
    if (!gone) sum.push(sourced(el('p', 'sub', outliveLine(card.age)), outliveSrc(card.age)));
    if (card.summary.debt) sum.push(el('p', 'sub', `หนี้ผ่อนค้าง ${baht(card.summary.debt)}`));
    if (card.summary.bankruptcies) sum.push(el('p', 'sub', `เคยล้มละลาย ${card.summary.bankruptcies} ครั้ง`));
    if (card.summary.grey) sum.push(el('p', 'sub', `เงินเทาที่หายไปกับตัว ${baht(card.summary.grey)}`));
    // บันทึกเด็กเป็นสถิติการตายของยุค — ไม่ใช่เรื่องของคนหาย
    if (card.note && !gone) sum.push(sourced(el('p', 'sub', card.note), childNoteSrc(card.age)));
    if (card.will !== undefined) sum.push(el('p', 'sub', gone ? LOST.will[card.will ? 1 : 0] : card.will ? 'มีพินัยกรรม ทายาทแบ่งทรัพย์ตามที่สั่งไว้' : 'ไม่มีพินัยกรรม ทายาทแบ่งทรัพย์กันเองจนผิดใจกัน'));
    if (card.letter) sum.push(el('p', 'sub', card.letter));
    const from = st.gen === 1 && save.from;
    if (from) sum.push(el('p', 'sub', from.day ? `ชาติประจำวัน ${from.day} · ทุกคนที่เล่นวันนั้นเกิดแบบเดียวกันนี้ ทางที่เลือกต่างกันได้` : 'ชีวิตจากลิงก์เพื่อน · เกิดแบบเดียวกับเพื่อนทุกอย่าง ทางที่เลือกต่างกันได้'));
    // สมุดเต็มต้องให้ผู้เล่นลงมือเอง จึงอยู่แท็บที่เปิดอยู่แล้ว ไม่ซ่อนไว้แท็บอนุสรณ์
    if (card.memo === 'full') sum.push(memoFull(card));
    sum.push(helpBox());
    // บัญชีบุญบาปเฉลยที่ปรโลกในระหว่างชาติ ไม่ใช่การ์ดตาย · กราฟทั้งชีวิตแทนสรุปช่วงวัยสุดท้าย (B38a) ชีวิตสั้นก็มีกราฟ
    const chart = card.life && lifeChart(card.life, card.age, card.cause);
    const kin = familyOf(st);
    const fam = el('div', 'fam');
    fam.append(...kinParts(kin.filter((m) => !ANIMAL_ROLES.includes(m.role))), ...kinParts(kin.filter((m) => ANIMAL_ROLES.includes(m.role)), true));
    if (card.pets) fam.append(el('p', 'sub', card.pets));
    if (!fam.childElementCount) fam.append(el('p', 'sub', 'ไม่มีใครในบ้านตอนจากไป'));
    const clan = el('div', 'fam');
    clan.append(...clanParts());
    const memo = [];
    if (card.funeral) memo.push(el('p', 'sub', `งานศพ: ${card.funeral.text} · แขกมาส่งราว ${card.funeral.guests.toLocaleString('en-US')} คน${card.funeral.cost ? ` · ค่าใช้จ่าย ${baht(card.funeral.cost)}` : ''}`));
    if (card.funeral?.who) memo.push(el('p', 'sub', card.funeral.who));
    if (card.lastImage) memo.push(el('p', 'sub', `ภาพสุดท้ายที่นึกถึง: ${card.lastImage}`));
    // คนหายไม่มีศพ (B137) — แท็บนี้จึงอาจไม่มีงานศพ แต่ชีวิตนี้ยังลงสมุดอนุสรณ์
    if (!card.funeral) memo.push(el('p', 'sub', gone ? 'ยังไม่มีงานศพ คนที่บ้านยังรอข่าวอยู่' : 'ไม่มีบันทึกงานศพ'));
    if (card.memo !== 'full') memo.push(shelfButton('เปิดสมุดอนุสรณ์', 'm'));
    rest.append(deathTabs(card, [sum, [chart, eraBox()].filter(Boolean), [fam], [clan], [titlesBox(card)], memo]));
    // ปุ่มหลักมีปุ่มเดียว · บันทึกภาพ/แชร์/คัดลอก/ชวนเพื่อนพับรวมในเมนูแชร์ท้ายการ์ด ไม่แย่งที่ปุ่มไปต่อ
    choices.append(enter(button(BTN.toAfter, null, () => openBook(card))));
    const share = el('details', 'd-share');
    const menu = el('div', 'd-share-in');
    menu.append(...shareButtons(card), copyButton(() => summaryText(card.age)));
    if (st.gen === 1) menu.append(inviteButton());
    share.append(el('summary', null, BTN.share), menu);
    rest.append(share);
  } else {
    // ฐานะ/งาน/เงินอยู่แผงตัวฉัน (ui-redo ใบ 04 · 131) — ใต้แถบสถานะเหลือแค่เนื้อการ์ด
    box.append(statusBar(card, s));
    // ตัวคูณนิสัย (B41) มีผลกับตัวเลือกก่อนหน้า — บอกบนใบถัดไปแทนการ์ดผลเพิ่ม
    if (card.because) body.append(el('p', 'note', card.because));
    const kicker = card.kind === 'event' ? (card.funeral ? 'งานศพ' : card.national ? KICKER.era : `ช่วง${card.stage}`) : KICKER[card.kind];
    // ภาพยุค (B56): การ์ดบ้านเมือง + การ์ดรับมือที่ผูกยุคไว้ (B58) ได้ภาพของยุคนั้น · ยุคที่ไม่มีภาพ = หน้าตาเดิม
    const eraPic = eraArt(card.kind === 'era' ? card.id : card.kind === 'event' ? ERA_OF.get(card.id) : null);
    if (eraPic) body.append(artSvg('era-art', ERA_ART_W, ERA_ART_H, eraPic));
    else {
      const scene = card.kind === 'intro' ? sceneSvg(BIRTH_SCENE[artTier(standingOf(st))], true) : SCENE_OF.has(card.id) && sceneSvg(SCENE_OF.get(card.id), false);
      if (scene) body.append(scene);
    }
    // ข่าวบ้านเมืองที่รวมกับการ์ดรับมือ (B58): ชื่อเหตุการณ์ต่อท้ายป้าย · เรื่องข่าวเป็นบรรทัดนำก่อนเรื่องของเรา
    body.append(el('span', 'kicker', card.news ? `${kicker} · ${card.news.text}` : kicker));
    if (card.news?.story) body.append(el('p', 'news', card.news.story));
    // ผลย้อน: บอกที่มาก่อนอ่านเรื่อง · อายุ 0 เป็นค่าจริง ห้ามเช็ก truthy
    if (card.kind === 'event' && card.echoFrom !== undefined) {
      const ef = followIcon('later');
      ef.className = 'ef';
      ef.append(`มาจากที่คุณเลือกตอนอายุ ${card.echoFrom}`);
      body.append(ef);
    }
    // สายเรื่องรายคน (krung-1): ตอนแรกไม่มีระยะห่างให้บอก
    if (card.kind === 'event' && card.arc) body.append(el('span', 'ef', `เรื่องต่อเนื่อง ตอนที่ ${card.arc.n}${card.arc.gap ? ` · ผ่านมา ${card.arc.gap} ปีจากตอนก่อน` : ''}`));

    if (card.kind === 'intro') {
      // ผู้สืบสายเลือด (B76) เริ่มกลางวัย ไม่ได้เกิดใหม่
      body.append(el('span', 'stamp', card.age > 0 ? 'รับช่วงชีวิต' : 'แรกเกิด'));
      body.append(el('h3', 'lead', card.text));
      body.append(el('p', 'horo', horoscope(st)));
      // การ์ดแรกเกิดของตระกูลใหม่ = จุดเริ่มเกมของคนไม่มีเซฟ (คนมีเซฟเห็นที่หน้าเล่นต่อ)
      if (st.gen === 1 && card.age === 0) body.append(warnLine());
      const odds = birthOddsLine();
      if (odds) body.append(sourced(el('p', 'sub', odds), birthOddsSrc()));
      // บรรทัดแรกเป็นเรื่องของบ้าน · ที่เหลือเป็นบรรยากาศยุค ตัวรอง
      card.story.forEach((p, i) => body.append(el('p', i ? 'sub' : null, p)));
      if (card.inherit.length) {
        const box = el('div', 'recap');
        box.append(el('div', 'h', card.age > 0 ? 'สิ่งที่สืบทอดจากรุ่นก่อน' : 'สิ่งที่สืบทอดจากชาติก่อน'), list(card.inherit, 'picks'));
        // เจ้าของสั่งไม่ย่อรุ่นต้นทางซ้าย — ผังบนการ์ดแรกเกิดโชว์ครบทุกรุ่น (ภาพบีบป้ายเองเมื่อรุ่นถี่)
        if (card.lineage.length) box.append(el('div', 'h', 'ผังตระกูล'), lineageView(st.lineage, st.cls));
        body.append(box);
      }
      // ใบสืบทอดยาว/จอเตี้ยดันปุ่มหลุดใต้เมนูล่าง — ปุ่มติดจอแทนการพับเนื้อ (เจ้าของสั่งผังตระกูลครบทุกรุ่น)
      choices.classList.add('pin');
      choices.append(enter(button(BTN.next, null, next)));
      if (canReroll()) choices.append(button(BTN.reroll, 'ได้ครั้งเดียว', reroll));
    } else if (card.kind === 'stage') {
      body.append(el('span', 'stamp', card.text));
      const grow = el('p', 'grow');
      grow.append(avatar(card.age), el('span', null, growLabel(card.stage)));
      body.append(grow, recap(card.recap));
      choices.append(enter(button(BTN.next, null, next)));
    } else if (digestRest(card).length) {
      const rest = digestRest(card);
      body.append(el('h3', null, 'เรื่องใหญ่ของปีนี้'), list([card, ...rest].map((x) => x.text)));
      choices.append(enter(button(BTN.next, null, () => play(T.next, rest.length + 1))));
    } else if (card.kind === 'era' || card.kind === 'omen' || card.kind === 'result') {
      body.append(el('h3', null, card.text));
      if (card.story) body.append(el('p', null, card.story));
      // ตรวจเจอโรค (B110): บอกเวลาที่เหลือให้เตรียมใจ (เจ้าของเคาะ) · left = ปีก่อนถึงนัด 0 = ปีนี้
      if (card.illness) body.append(el('p', 'sub', card.illness.left ? `หมอว่าเหลือเวลาราว ${card.illness.left} ปี` : 'หมอว่านี่อาจเป็นปีสุดท้าย'));
      choices.append(enter(button(BTN.next, null, next)));
    } else if (card.entry) {
      entryOffer(card, body, choices);
    } else {
      if (card.title) body.append(el('h3', null, card.title));
      body.append(el(card.title ? 'p' : 'h3', card.title ? null : 'lead', card.text));
      if (card.items?.length) {
        const ul = list(card.items);
        const price = card.kind === 'alloc' && [...ul.children].find((li) => li.textContent.startsWith(PRICE_ITEM));
        if (price) sourced(price, priceSrc());
        body.append(ul);
      }
      if (card.disclaimer) body.append(el('p', 'note', card.disclaimer));
      let n = 0;
      card.choices.forEach((c, i) => {
        // ตัวเลือกประตูเข้าสายที่ยังไม่เปิด (โฟกัสใบ 04) ไม่บอกว่ามีอยู่ — ต่างจากตัวที่ล็อกด้วยเงิน/ค่าสถานะ
        if (card.hidden?.[i]) return;
        const why = lockText(card, i);
        // ตัวเลือกที่ล็อกยังแสดงให้เห็นทางที่พลาด · ป้ายผลแทนด้วยเหตุผลที่กดไม่ได้
        const fx = why ?? card.fx?.[i];
        const b = numbered(button(c, fx, () => {
          veil(card, i);
          play(lifePick(i));
          if (card.kind === 'upgrade') upgradeFx(card, i);
        }, card.hints?.[i]), ++n);
        if (card.kind === 'upgrade' && card.desc?.[i]) b.firstChild.append(el('small', 'idesc', card.desc[i]));
        if (why) b.disabled = true;
        choices.append(b, ...loanButtons(card, i));
      });
      // การ์ดเล่าเรื่อง (choices: []) ไม่มีปุ่มให้เลือก — ต้องมีทางไปใบถัดไป
      if (!card.choices.length) choices.append(enter(button(BTN.next, null, next)));
      const tip = whisperFor(card);
      if (tip) body.append(tip);
      if (card.choices.length > 1) choices.append(foldLater(box, body, choices, card));
    }
  }
  box.append(body, choices, ...after);
  root.append(panels(box, false), lifeMenu(card, box));
  shelfDot();
  fxCard(box, card);
}

// กล่องกระซิบ (B117): สอนระบบที่เพิ่งโผล่ครั้งแรกตามวัย ในเสียงยาย · บอกแค่ทิศ ไม่บอกตัวเลข/สูตร/บัญชีบุญบาป (กติกาเดียวกับ B31)
// ค่าสถานะแต่ละตัวอธิบายอยู่ที่ "ค่าสถานะเหล่านี้หมายถึงอะไร?" แล้ว (B31) — ที่นี่สอนเฉพาะกลไกบนการ์ด
// อ่านการ์ดอย่างเดียว ไม่มี token ในเซฟ ⇒ ผลเกม/บอทไม่ขยับ
const WHISPER_KEY = 'next-life-whisper-v1';
const WHISPERS = [
  ['locked', (c) => c.locked?.some(Boolean), 'ปุ่มจาง ๆ คือทางที่ตอนนี้ยังไปไม่ได้ เหตุผลเขียนไว้บนปุ่ม บางทางแค่รอโตอีกหน่อยหรือมีเงินพอ'],
  ['chance', (c) => c.fx?.some((f) => /สำเร็จ|เสี่ยง/.test(f ?? '')), 'ทางที่บอกโอกาสสำเร็จหรือความเสี่ยงไว้ ผลยังไม่แน่นอน ค่าสถานะตอนนี้ช่วยเอียงผลได้บ้าง'],
  ['school', (c) => c.id?.startsWith('school_gate_'), 'เรียนจบชั้นหนึ่งแล้วจะเรียนต่อหรือออกมาทำงานก็ได้ ความรู้ช่วยสอบเข้าที่ดี ส่วนเงินที่บ้านตัดสินว่าที่ไหนส่งไหว'],
  ['job', (c) => c.id === 'first_job', 'งานแรกขึ้นกับวุฒิที่มี คนรู้จักเยอะยิ่งเจองานค่าแรงดี รายได้ต่อเดือนดูได้ที่ปุ่ม เงิน ในเมนูท้ายจอ'],
  ['alloc', (c) => c.kind === 'alloc', 'ทุกช่วงได้ทบทวนเงินเก็บ ตัวเลขที่เห็นเป็นผลของช่วงที่ผ่านมา ไม่ได้บอกช่วงหน้า และของแพงขึ้นทุกปี เงินที่เก็บเฉย ๆ จึงซื้อของได้น้อยลง'],
  ['debt', (c) => c.fx?.some((f) => /กู้/.test(f ?? '')), 'กู้มาแล้วต้องผ่อนทุกปี หนี้ที่ท่วมรายได้อยู่นาน ๆ พาไปถึงล้มละลายได้'],
];
function whisperRead() {
  try {
    const w = JSON.parse(localStorage.getItem(WHISPER_KEY) ?? '{}');
    return { seen: Array.isArray(w.seen) ? w.seen : [], off: Array.isArray(w.off) ? w.off : [] };
  } catch {
    return { seen: [], off: [] };
  }
}
function whisperWrite(w) {
  try {
    localStorage.setItem(WHISPER_KEY, JSON.stringify(w));
  } catch {
    // ไม่มีที่เก็บ — กระซิบซ้ำได้ทุกครั้งที่เจอ ดีกว่าไม่สอนเลย
  }
}
// เรื่องที่เคยกระซิบแล้วไม่กระซิบซ้ำทุกชาติ (เห็นครั้งเดียวต่อเครื่อง) · ปุ่มปิดมีผลแค่ชาตินี้ ชาติหน้าเรื่องที่ยังไม่เคยเห็นกลับมาสอนต่อ
// เก็บชาติที่ปิดไว้แค่ไม่กี่ชาติล่าสุด — ชาติเก่ากว่านั้นไม่มีทางกลับไปเล่นแล้ว
const WHISPER_OFF_KEEP = 8;
const lifeKey = () => `${save?.seed}:${st.gen}`;
function whisperFor(card) {
  const w = whisperRead();
  if (w.off.includes(lifeKey())) return null;
  const hit = WHISPERS.find(([id, when]) => !w.seen.includes(id) && when(card));
  if (!hit) return null;
  // นับว่าเห็นตั้งแต่ขึ้นจอ: กดตัวเลือกไปเลยโดยไม่ปิดกล่องก็ไม่กระซิบเรื่องเดิมซ้ำ
  w.seen.push(hit[0]);
  whisperWrite(w);
  const box = el('aside', 'whisper');
  box.setAttribute('aria-label', 'ยายกระซิบ');
  box.append(el('div', 'h', 'ยายกระซิบ'), el('p', null, hit[2]));
  const row = el('div', 'whisper-row');
  const ok = el('button', 'more', 'รู้แล้ว');
  ok.onclick = () => box.remove();
  const mute = el('button', 'more', 'ชาตินี้ไม่ต้องแนะนำแล้ว');
  mute.onclick = () => {
    const now = whisperRead();
    now.off = [...now.off.filter((k) => k !== lifeKey()), lifeKey()].slice(-WHISPER_OFF_KEEP);
    whisperWrite(now);
    box.remove();
  };
  row.append(ok, mute);
  box.append(row);
  return box;
}

// ปุ่ม "พับไว้ก่อน" (B117): ซ่อนเรื่องกับตัวเลือก กางแผงสถานะทั้งหมดให้ดูรวดเดียว แล้วกลับมาเลือกที่การ์ดเดิม
// ไม่ใช่ตัวเลือกของเกม — ไม่มีเลขปุ่มลัด ไม่ลงเซฟ · ตอนกลับคืนแผงที่กางไว้ให้เป็นอย่างเดิม
function foldLater(box, body, choices, card) {
  const later = el('button', 'more later', 'พับไว้ก่อน ไปดูสถานะ');
  later.onclick = () => {
    const folds = [...box.querySelectorAll(':scope > .p-left > details')];
    const was = folds.map((d) => d.open);
    folds.forEach((d) => (d.open = true));
    body.hidden = choices.hidden = true;
    const bar = el('div', 'choices folded');
    bar.append(el('p', 'note', `การ์ดรอให้เลือกอยู่ · ${clip(card.title ?? card.text, 48)}`));
    const back = enter(button('กลับมาเลือก', null, () => {
      folds.forEach((d, i) => (d.open = was[i]));
      bar.remove();
      body.hidden = choices.hidden = false;
      choices.querySelector('button.choice:not(:disabled)')?.focus();
    }));
    bar.append(back);
    // ต่อท้ายพาแนลกลาง (ที่เดียวกับปุ่มเดิม) — ต่อท้ายการ์ดตรง ๆ จอแนวนอนจะไปตกช่องกริดที่ไม่ได้จองไว้
    body.parentElement.append(bar);
    scrollTo(0, 0);
    back.focus({ preventScroll: true });
  };
  return later;
}

// จอแนวนอนเตี้ย (B131 แบบ C2): ห่อลูกการ์ดเป็นพาแนลซ้าย (หัว ค่าสถานะ แผง) · กลาง (เรื่องต่อด้วยปุ่ม) · ขวา (สมุด · ฉายา)
// จอตั้งตัวห่อเป็น display:contents และพาแนลขวาซ่อน ⇒ หน้าตาเดิม · ห่อทุกขนาดจอ หมุนจอกลางเกมจึงไม่ต้องวาดการ์ดใหม่
// กริดวางหลายลูกต่อกันในคอลัมน์เดียวโดยแถวไม่สูงตามคอลัมน์ข้าง ๆ ไม่ได้ จึงต้องมีตัวห่อ
// side = false: ฉากที่มีเมนูล่าง เข้าสมุดจากเมนูแล้ว พาแนลขวาจะซ้ำ จึงเหลือสองคอลัมน์
function panels(box, side = true) {
  const left = el('div', 'p-left');
  const mid = el('div', 'p-mid');
  for (const k of [...box.children]) (k.classList.contains('body') || k.classList.contains('choices') ? mid : left).append(k);
  box.classList.add('pn');
  box.append(left, mid);
  if (side) box.append(sidePanel());
  else box.classList.add('pn2');
  return box;
}
// พาแนลขวา (ฉากที่ยังไม่มีเมนูล่าง): ทางเข้าชั้นสมุด + ความคืบหน้าสมุดฉายา + ของติดตัว (หัวเดียวกับแผงตัวฉัน เมื่อ itemsVisible)
// ปุ่มเป็นลิงก์ ไม่ใช่ตัวเลือกของเกม — ไม่มีเลขปุ่มลัด เปิดชั้นสมุดแล้วกลับมาการ์ดเดิม
function sidePanel() {
  const side = el('aside', 'p-side');
  const kit = itemsVisible(st);
  side.setAttribute('aria-label', kit ? 'สมุด ฉายา และของติดตัว' : 'สมุดและฉายา');
  const b = bookRead();
  const p = picsRead();
  side.append(el('div', 'h', 'สมุด'), el('p', 'note', `อนุสรณ์ ${memoRead().l.length} ชีวิต · ภาพบ้านเมือง ${picsGot(p)}/${PIC_ALL}`), shelfButton('เปิดชั้นสมุด'));
  side.append(el('div', 'h', 'ฉายา'), el('p', 'note', `สะสมแล้ว ${bookGot(b)}/${BOOK_ALL}`), shelfBar(bookGot(b), BOOK_ALL), shelfButton('ดูสมุดฉายา', 't'));
  if (kit) side.append(el('div', 'h', 'ของติดตัว'), kitList());
  return side;
}

const genLabel = () => (st.gen > 1 ? `รุ่นที่ ${st.gen} · ` : '');
// ฉากจริงจังใช้ชื่อจริง ที่เหลือคงชื่อเล่นให้ขำ · เซฟค้างระหว่างชาติจาก build เก่าไม่มี realName จึงตกไปชื่อเล่นล้วน ไม่มีวงเล็บว่าง
const realName = () => st.realName ?? st.name;
const fullName = () => (st.realName && st.realName !== st.name ? `${st.realName} (${st.name})` : st.name);

// การ์ดชวนไปต่างโลก (B68d): กรอบสีต่างโลกโผล่กลางการ์ดชีวิต · กดรับแล้วย้อนไม่ได้ จึงถามซ้ำก่อนส่งให้เอนจิน
// การถามซ้ำอยู่ที่จอล้วน ไม่ลงเซฟ — เซฟเก็บเฉพาะปุ่มที่ไปถึงเอนจิน · ปฏิเสธกดทีเดียวพอ
// จอไม่บอกว่ารับแล้วตาย หายตัว หรือได้กลับ — คำถามยืนยันจึงใช้ประโยคเดียวทุกใบ ผู้เล่นรู้จากเรื่องหลังกดรับ
function entryOffer(card, body, choices) {
  const gate = el('div', 'ix');
  // ข้อความในกรอบเป็น div ไม่ใช่ h3/p — กฎสีของแนวการ์ดไทยจับ .body h3/.body p แล้วจะทับสีต่างโลก
  gate.append(el('span', 'ix-k', 'เสียงเรียกจากต่างโลก'), el('div', 'ix-t', card.text));
  body.append(gate);
  const offer = () => choices.replaceChildren(...card.choices.map((c, i) => numbered(button(c, card.fx?.[i], () => (i === ENTRY.accept ? ask() : play(lifePick(i)))), i + 1)));
  const ask = () => {
    choices.replaceChildren(
      el('p', 'ix-ask', 'แน่ใจนะ ก้าวไปแล้วย้อนกลับมาเลือกใหม่ไม่ได้'),
      button('ยืนยัน ไปต่างโลก', null, () => play(lifePick(ENTRY.accept))),
      button('ยังก่อน', null, () => {
        offer();
        choices.querySelector('button').focus();
      }),
    );
    choices.querySelector('button').focus();
  };
  offer();
}

// ช่วยจริง (B145): สายด่วนสุขภาพจิตขึ้นทุกหน้าจบ — ขึ้นเฉพาะชีวิตที่ตายแบบหนึ่ง = ผู้เล่นอ่านสาเหตุที่ซ่อนไว้ออกจากปุ่ม (B110)
// ที่เหลือขึ้นตามเรื่องที่ชีวิตนี้เจอ · ไม่ลงภาพแชร์ · ลิงก์ออกนอกเกมเปิดแท็บใหม่ เกมที่ค้างอยู่ไม่หาย
const HELP_BY = { mind: () => true, drink: () => !!st.flags?.heavy_drinker, bankrupt: () => !!st.flags?.bankrupt || st.bankruptcies > 0 };
const HELP_MAX = 3;
function helpBox() {
  const box = el('div', 'recap help');
  box.append(el('div', 'h', 'ถ้าเรื่องในเกมใกล้ตัวคุณ'), el('p', 'sub', 'เรื่องในเกมจบแล้ว แต่ในชีวิตจริงมีคนรับฟังและช่วยได้ฟรี'));
  for (const h of HELP.filter((x) => HELP_BY[x.id]?.()).slice(0, HELP_MAX)) box.append(helpRow(h));
  const all = el('a', null, 'ดูทั้งหมด');
  Object.assign(all, { href: 'guide.html#help', target: '_blank', rel: 'noopener' });
  box.append(all, el('p', 'note', HELP_NOTE));
  return box;
}
// บรรทัดเตือนเนื้อหาชุดเดียวกับหน้าแรกเว็บ + สายด่วนสุขภาพจิต · ไม่ต้องกดรับ
function warnLine() {
  const mind = HELP.find((h) => h.id === 'mind');
  const p = el('p', 'warn-line', `ผู้เล่นวัยรุ่นขึ้นไป · เรื่องจริงบางเรื่องหนัก: ${warnWords()} · ถ้าเล่นแล้วไม่สบายใจ `);
  const call = el('a', null, `โทร ${mind.tel}`);
  call.href = `tel:${mind.tel}`;
  p.append(call, ' ได้ตลอด 24 ชม.');
  return p;
}
function helpRow(h) {
  const row = el('div', 'help-row');
  const call = el('a', 'help-call', `${h.label} · ${h.call}`);
  call.href = `tel:${h.tel}`;
  const web = el('a', null, 'เว็บทางการ');
  Object.assign(web, { href: h.web, target: '_blank', rel: 'noopener' });
  const org = el('small', null, `${h.org} · `);
  org.append(web);
  row.append(call, org);
  return row;
}

// แผงครอบครัว (B36c): คนรอบตัวตอนนี้ แยกจากผังตระกูลที่เล่ารุ่นก่อน · อ่านอย่างเดียว ไม่มี token ในเซฟ
// ใช้เฉพาะช่องที่ไล่ชื่อไว้ข้างล่าง — แกนเติมช่องใหม่ในสมาชิกก็ไม่หลุดขึ้นจอ · bond บอกเป็นป้ายคำ ไม่ใช่ตัวเลข
const FAMILY_ORDER = ['parent', 'spouse', 'child', 'grandchild', 'pet', 'herd', 'peer'];
const ANIMAL_ROLES = ['pet', 'herd'];
const kinWord = (m) => {
  const male = m.sex === 'ชาย';
  if (m.role === 'parent') return male ? 'พ่อ' : 'แม่';
  if (m.role === 'spouse') return m.left ? 'อดีตคู่' : male ? 'สามี' : 'ภรรยา';
  if (m.role === 'child') return male ? 'ลูกชาย' : 'ลูกสาว';
  if (m.role === 'grandchild') return male ? 'หลานชาย' : 'หลานสาว';
  if (m.role === 'pet') return m.kind ?? 'สัตว์เลี้ยง';
  if (m.role === 'herd') return `ฝูง${m.kind ?? 'สัตว์'}`;
  return 'เพื่อนรุ่น';
};
// แผงครอบครัว (ui-redo ใบ 06): คนในบ้าน · ผังตระกูล · กราฟฐานะตระกูล ย้ายจากแถบแท็บใต้หัวการ์ด · สัตว์อยู่ท้ายแผง แถวละตัว
// วาดตอนกดเปิดเท่านั้น — กราฟฐานะตระกูลแพง การ์ดส่วนใหญ่ผ่านไปโดยไม่มีใครเปิด
function familyPanel() {
  const all = familyOf(st);
  // แผงอยู่นอกการ์ด สีกราฟฐานะตระกูลผูกกับชุดสีการ์ด (.a) — ไม่ใส่ กราฟเป็นก้อนดำ
  const wrap = el('div', 'fam a');
  wrap.append(...kinParts(all.filter((m) => !ANIMAL_ROLES.includes(m.role))), ...clanParts(), ...kinParts(all.filter((m) => ANIMAL_ROLES.includes(m.role)), true));
  return wrap;
}
// แผงปรโลก (ui-redo ใบ 15): st ยังเป็นคนที่เพิ่งตายจนกว่าจะไปเกิด — แผงจึงอ่านชีวิตที่จบแล้วจากตัวเดียวกับการ์ดตาย
function pastPanel() {
  const why = causeOf(st.cause ?? 'other', st.age);
  const head = el('p', 'meta');
  metaLine(head, [fullName(), `${lifeEndWord(isGone(st))} ${st.age}`, why && `จากไป${why.join('')}`].filter(Boolean));
  const wrap = mePanel({ kind: 'death', job: jobText(st) });
  const kin = familyOf(st);
  const fam = el('div', 'fam');
  fam.append(...kinParts(kin.filter((m) => !ANIMAL_ROLES.includes(m.role))), ...kinParts(kin.filter((m) => ANIMAL_ROLES.includes(m.role)), true));
  wrap.prepend(head);
  if (fam.childElementCount) wrap.append(fam);
  return wrap;
}
// กราฟฐานะตระกูลผูกสีกับชุดการ์ด — ปรโลกใช้ชุดลายรดน้ำ (.b) ชุดกระดาษ (.a) ปนตัวแปรหน้าดำทองแล้วกราฟเป็นก้อนเทา
function clanPanel() {
  const wrap = el('div', 'fam b');
  wrap.append(...clanParts());
  return wrap;
}
// ชิ้นของแผงครอบครัวที่การ์ดตายแยกไปลงแท็บ ครอบครัว · ตระกูล (ui-redo ใบ 11)
// หัวนับเฉพาะคน — สัตว์นับแยกที่หัวของมันเอง ไม่งั้น "ยังอยู่ 3 คน" รวมหมากับฝูงไก่
function kinParts(members, animals = false) {
  if (!members.length) return [];
  if (animals) {
    const here = members.filter((m) => m.alive && !m.left).length;
    return [el('h3', null, here ? `สัตว์เลี้ยง · ยังอยู่ ${here}` : 'สัตว์เลี้ยง'), kinList(members)];
  }
  const alive = members.filter((m) => m.alive).length;
  return [el('h3', null, `คนในบ้าน · ยังอยู่ ${alive} ${alive === members.length ? 'คน' : `จาก ${members.length} คน`}`), kinList(members)];
}
// ผังตระกูลมีเมื่อเป็นรุ่นที่ 2 ขึ้นไป
function clanParts() {
  const out = [];
  if (st.lineage.length) out.push(el('h3', null, `ผังตระกูล · ${st.lineage.length} รุ่นก่อน`), lineageView(st.lineage, st.cls));
  out.push(
    el('h3', null, st.lineage.length ? `กราฟฐานะตระกูล · ${st.lineage.length + 1} รุ่น` : 'กราฟฐานะตระกูล'),
    standingChart(standingGens(st.lineage, standingNow(!!st.dead)), null, false) ?? el('p', 'sub', 'ยังมีจุดเดียว — กราฟขึ้นเมื่อถึงช่วงวัยถัดไป'),
  );
  return out;
}

// แท็บรายละเอียดการ์ดตาย (ui-redo ใบ 11 · ชุดแท็บที่เจ้าของเลือกในใบ 02) — วาดทุกแผงครั้งเดียว สลับด้วย hidden
// แท็บที่เปิดค้างจำต่อการ์ด: กลับจากชั้นสมุด/วาดซ้ำยังอยู่แท็บเดิม · ชีวิตถัดไปเริ่มที่สรุป
const DEATH_TABS = ['สรุป', 'ชีวิตนี้', 'ครอบครัว', 'ตระกูล', 'ฉายา', 'อนุสรณ์'];
const deathTabOf = new WeakMap();
function deathTabs(card, parts) {
  const wrap = el('div', 'd-tabs');
  const bar = el('div', 'd-tab-bar');
  bar.setAttribute('role', 'tablist');
  bar.setAttribute('aria-label', 'รายละเอียดชีวิตนี้');
  const tabs = DEATH_TABS.map((label, i) => {
    const b = el('button', null, label);
    b.type = 'button';
    b.id = `d-tab-${i}`;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', `d-pane-${i}`);
    b.onclick = () => pick(i);
    const pane = el('div', 'd-pane');
    pane.id = `d-pane-${i}`;
    pane.setAttribute('role', 'tabpanel');
    pane.setAttribute('aria-labelledby', b.id);
    pane.append(...parts[i]);
    return { b, pane };
  });
  const pick = (i, focus) => {
    deathTabOf.set(card, i);
    tabs.forEach(({ b, pane }, j) => {
      b.setAttribute('aria-selected', String(i === j));
      b.tabIndex = i === j ? 0 : -1;
      pane.hidden = i !== j;
    });
    // กล่องพับ (กราฟ · ยุค · ฉายา) มีแท็บของตัวเองแล้ว เปิดแท็บครั้งแรกคลี่ให้เลย — คลี่ตอนเปิดจริง จุดใหม่จึงหายเมื่อผู้เล่นได้เห็น
    // ครั้งเดียวต่อแผง ผู้เล่นพับเองแล้วสลับกลับมาไม่คลี่ซ้ำ
    const p = tabs[i].pane;
    if (!p.dataset.opened) {
      p.dataset.opened = '1';
      for (const d of p.querySelectorAll(':scope > * > details.fold')) d.open = true;
    }
    if (focus) tabs[i].b.focus();
  };
  // ลูกศรตามแบบ tablist — โฟกัสอยู่ในแถบ คีย์ลัดทั้งหน้าไม่ได้ใช้ลูกศรบนการ์ดตาย
  bar.onkeydown = (e) => {
    const at = tabs.findIndex(({ b }) => b === e.target);
    const n = tabs.length;
    const to = { ArrowRight: at + 1, ArrowLeft: at - 1 + n, Home: 0, End: n - 1 }[e.key];
    if (at < 0 || to === undefined) return;
    e.preventDefault();
    pick(to % n, true);
  };
  bar.append(...tabs.map((t) => t.b));
  wrap.append(bar, ...tabs.map((t) => t.pane));
  pick(deathTabOf.get(card) ?? 0);
  return wrap;
}
// ช่องเงินในแผงตัวฉัน (ui-redo ใบ 07 → 131): ย้ายบรรทัดเงินใต้แถบสถานะมาเป็นช่องละแถว · ค่าชุดเดียวกับที่การ์ดเคยบอก ไม่เปิดตัวเลขที่เกมซ่อน
// ปุ่มกู้ยังอยู่บนการ์ดเพราะเป็นทางเลือกของการ์ดนั้น ไม่ใช่ข้อมูล · คำอธิบายใต้ยอดเข้ากลุ่มพับของแผงตัวฉัน (hp)
function moneyBox(card, hp) {
  const s = statsOf(st);
  // คนตายไม่มีรายได้ต่อ — การ์ดตายเห็นแค่ที่ทิ้งไว้
  const working = !st.dead && isWorking(st, card.age);
  // เงินกู้เป็นยอดค้างของสัญญา ไม่ใช่เงินติดตัวติดลบ จึงแยกช่อง ไม่หักรวมกัน
  const debt = Math.round(totalDebt(st));
  const rows = [
    ['เงินติดตัว', baht(s.money), s.money < 0],
    // ปีเกมใช้ภายในเท่านั้น หน้าจอบอกแค่อายุ (B14 ข้อ 12)
    !st.dead && ['รายได้', working ? `${baht(monthlyIncome(st, st.birthYear + card.age))}/เดือน` : 'ยังไม่มีงานทำ'],
    ['เงินกู้', debt > 0 ? baht(debt) : 'ไม่มี'],
    // เงินเทาแยกถุง ใช้จ่ายไม่ได้จนกว่าฟอก · ไม่เคยมีก็ไม่บอกว่ามีถุงนี้
    st.grey > 0 && ['เงินเทา', baht(st.grey)],
  ].filter(Boolean);
  const wrap = el('div', 'mo');
  const dl = el('dl');
  for (const [k, v, neg] of rows) dl.append(el('dt', null, k), el('dd', neg ? 'num neg' : 'num', v));
  const note = el('p', null, new Map(STAT_HELP).get(MONEY_HELP));
  hp.push(note);
  wrap.append(dl, note);
  return wrap;
}
// แผงเพิ่มเติม: ลิงก์ท้ายหน้าเดิมทั้งชุด — ฉากที่มีเมนูซ่อนท้ายหน้า ที่นี่จึงเป็นทางเข้าเดียว · ไม่มีหน้าตั้งค่า (ui-redo ข้อ 10)
function morePanel() {
  const ul = el('ul', 'mr');
  const day = el('button', null, 'ชาติประจำวัน');
  day.type = 'button';
  // ปิดลิ้นชักก่อน หน้าถามยืนยันจะได้เก็บการ์ดที่ไม่ inert ไว้คืนตอนยกเลิก · แผงค้างไม่ inert เก็บไปด้วยได้
  day.onclick = () => {
    unblockSheet();
    dayNew();
  };
  const link = (text, href) => Object.assign(el('a', null, text), { href });
  // อัปเดตล่าสุด: เปลี่ยนเนื้อแผงเดิมเป็นรายการรุ่นนี้ ปุ่มกลับไปการ์ดยังใช้ปิดได้เหมือนเดิม
  const news = el('button', null, NOTES_TITLE);
  news.type = 'button';
  news.onclick = () => {
    const sheet = wrap.closest('.sheet');
    sheet?.setAttribute('aria-label', NOTES_TITLE);
    const h = sheet?.querySelector('.sheet-h h2');
    if (h) h.textContent = NOTES_TITLE;
    wrap.replaceWith(notesPanel());
    notesMark();
    sheet?.querySelector('.sheet-x')?.focus();
  };
  for (const x of [day, news, link('คู่มือ', 'guide.html'), link('กลไกในเกม', 'about.html'), link('หน้าแรก', 'index.html')]) {
    const li = el('li');
    li.append(x);
    ul.append(li);
  }
  const wrap = el('div', 'mr-w');
  wrap.append(ul, el('p', null, 'เกม ไม่ใช่คำแนะนำการลงทุน'));
  return wrap;
}

// แจ้งอัปเดตในเกม (ui-redo 22 · เจ้าของเคาะ): มีรุ่นที่มีโน้ตซึ่งเบราว์เซอร์นี้ยังไม่เห็น (รวมคนเปิดครั้งแรก) → แผ่นทับจอแรกก่อนกดอะไร วันละไม่เกินครั้ง
// RELEASE_NOTES = รุ่นที่มีโน้ตใหม่สุดก่อน (build ดึงจากแพตช์โน้ต) · แผ่นรวมข้อของทุกรุ่นที่ยังไม่เห็น ไม่เกิน NOTES_MAX ข้อ · เปิดครั้งแรกเห็นแค่รุ่นล่าสุด
// key เก็บ { v: รุ่นล่าสุดที่มีโน้ตตอนปิดแผ่น, day: วันที่แผ่นขึ้นเองครั้งล่าสุด } · localStorage ใช้ไม่ได้ = ขึ้นทุกครั้งที่เปิดแต่ปิดได้ เกมเล่นต่อตามเดิม
// จอแรกของเซฟกลางชีวิตคือหน้า "เล่นต่อ" ไม่ใช่การ์ดที่ค้าง ⇒ แผ่นไม่แทรกกลางการ์ด · หน้า "เกมอัปเดตแล้ว" ของเซฟเก่ามีเรื่องให้อ่านอยู่แล้ว ไม่ซ้อน
const NOTES_KEY = 'next-life-notes-seen-v1';
const NOTES_TITLE = 'อัปเดตล่าสุด';
const NOTES_MAX = 5;
let notesSkip = false;
const notesDay = () => new Date().toLocaleDateString('en-CA');
function notesRead() {
  try {
    const s = JSON.parse(localStorage.getItem(NOTES_KEY) ?? 'null');
    return s && typeof s === 'object' ? s : {};
  } catch {
    return {};
  }
}
function notesWrite(patch) {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify({ ...notesRead(), ...patch }));
  } catch {}
}
const notesMark = () => notesWrite({ v: RELEASE_NOTES[0]?.v });
// รุ่นที่ยังไม่เห็น: ใหม่กว่ารุ่นที่จำไว้ · ไม่เคยจำ = รุ่นล่าสุดรุ่นเดียว · รุ่นที่จำหลุดจากชุดที่ฝัง = ทั้งชุด (ถูกตัดที่ NOTES_MAX อยู่แล้ว)
function notesUnseen() {
  const { v } = notesRead();
  if (!v) return RELEASE_NOTES.slice(0, 1);
  const i = RELEASE_NOTES.findIndex((r) => r.v === v);
  return i < 0 ? RELEASE_NOTES : RELEASE_NOTES.slice(0, i);
}
function notesPanel(log = RELEASE_NOTES.slice(0, 1)) {
  const wrap = el('div', 'nt');
  const vs = log.map((r) => r.v);
  wrap.append(el('p', 'nt-v', vs.length > 1 ? `เวอร์ชัน ${vs.at(-1)} ถึง ${vs[0]}` : `เวอร์ชัน ${vs[0] ?? APP_VERSION}`));
  const items = log.flatMap((r) => r.items);
  const ul = el('ul', 'nt-l');
  for (const t of items.slice(0, NOTES_MAX)) ul.append(el('li', null, t));
  const all = Object.assign(el('a', null, items.length > NOTES_MAX ? `ดูทั้งหมด ${items.length} ข้อในแพตช์โน้ต` : 'อ่านแพตช์โน้ตทุกเวอร์ชัน'), { href: vs[0] ? `whatsnew.html#:~:text=${vs[0]}` : 'whatsnew.html' });
  wrap.append(ul, all);
  return wrap;
}
function notesBoot() {
  if (notesSkip || notesRead().day === notesDay()) return;
  const log = notesUnseen();
  const box = root.firstElementChild;
  if (!log.length || !box) return;
  notesWrite({ day: notesDay() });
  openSheet(NOTES_TITLE, notesPanel(log), box, null);
  const shut = sheetClose;
  sheetClose = () => {
    notesMark();
    shut();
  };
}
function kinList(members) {
  const rank = (m) => FAMILY_ORDER.indexOf(m.role) * 2 + (m.alive ? 0 : 1);
  const ul = el('ul', 'picks');
  members
    .map((m, i) => ({ m, i }))
    .sort((a, b) => rank(a.m) - rank(b.m) || (a.m.order ?? 0) - (b.m.order ?? 0) || a.i - b.i)
    .forEach(({ m }) => {
      const who = m.name ? `${kinWord(m)} · ${m.name}` : kinWord(m);
      const row = (text, gone) => ul.append(el('li', gone ? 'gone' : null, text));
      // ฝูงเป็นทรัพย์สิน นับเป็นหน่วยเดียว — ไม่มีอายุรายตัวหรือความผูกพันให้บอก
      if (m.role === 'herd') return row(m.alive && !m.left ? `${who} · เลี้ยงไว้` : `${who} · หมดไปแล้ว`, !m.alive || !!m.left);
      // ยกให้คนอื่น/หายไป ≠ ตาย — จางไม่ขีด (ตัวที่ยกให้แล้วตายภายหลังก็ยังเป็นตัวที่ยกให้)
      if (m.role === 'pet' && m.left) return row(`${who} · ไม่ได้อยู่กับเราแล้ว`, true);
      // ตาย (ui-redo ใบ 28): ขีดเฉพาะชื่อ แถวไม่จาง อายุที่จากไปอ่านง่าย
      if (!m.alive) {
        const li = el('li', 'dead');
        li.append(el('s', null, who), ` · ${m.diedAge != null ? `จากไปตอนอายุ ${m.diedAge}` : 'จากไปแล้ว'}`);
        return ul.append(li);
      }
      row([who, m.age != null && `อายุ ${m.age}`, m.left ? 'แยกทางแล้ว' : m.bondLevel].filter(Boolean).join(' · '), false);
    });
  return ul;
}

// คู่ใจที่ตายก่อนเรามารอเดินไปปรโลกด้วย (B44) — เฉพาะตัวที่ดูแลดี (ป้าย "สนิท" ขึ้นไปในแผงครอบครัว)
// ไม่มีผลต่อคำตัดสิน · ไม่ใช่การ์ดใหม่ จึงไม่มี token ในเซฟ · ตัวที่ยกให้คนอื่น/หายไปไม่นับ
const PET_WAIT_BOND = 60;
const PET_WAIT_MAX = 3;
function petsWaiting(s) {
  const pets = (s.kin ?? []).filter((m) => m.role === 'pet' && !m.alive && !m.left && (m.bond ?? 0) >= PET_WAIT_BOND);
  if (!pets.length) return null;
  const call = (m) => (m.name ? `เจ้า${m.name} ${m.kind ?? 'สัตว์'}ที่เคยเลี้ยง` : `${m.kind ?? 'สัตว์'}ที่เคยเลี้ยง`);
  const shown = pets.slice(-PET_WAIT_MAX).map(call);
  const more = pets.length - shown.length;
  const who = more ? `${shown.join(' ')} และอีก ${more} ตัว` : shown.length > 1 ? `${shown.slice(0, -1).join(' ')} กับ${shown.at(-1)}` : shown[0];
  return `ระหว่างทาง ${who} นั่งรออยู่ข้างทาง แล้วเดินตามไปด้วยจนถึงหน้าปรโลก`;
}

const clip = (t, n) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);

// เลือกสกิลลงสมุด 1 อย่าง (06s) บนการ์ดจบต่างโลก/การ์ดปรโลก — นอกลำดับปุ่มเซฟ แกนไม่เปลี่ยนสถานะ ไม่กดก็ไปต่อได้
// key = การ์ดใบนี้ของชีวิตนี้ · รีโหลดกลับมาที่ใบเดิมเห็นว่าลงไปแล้ว
function earnBox(earn, key) {
  const box = el('div', 'recap earn');
  const done = (line) => box.replaceChildren(el('div', 'h', 'ลงสมุดสกิลแล้ว'), ...(line ? [el('p', 'sub', line)] : []), shelfButton(`เปิดชั้นสมุด · สกิล ${skillsGot(skillsRead())}/${SKILL_IDS.length}`, 'k'));
  if (skillsRead().e.includes(key)) {
    done(null);
    return box;
  }
  box.append(el('div', 'h', 'เลือกสกิล 1 อย่างลงสมุด'), el('p', 'sub', 'สกิลในสมุดเลือกพกไปชาติหน้าได้ · ได้ซ้ำ = ขั้นในสมุดขึ้น'));
  const book = skillsRead().s;
  for (const x of earn) {
    const was = book[x.id] ?? 0;
    const to = skillBookAdd(book, x.id, x.lv).book[x.id];
    const tag = !was ? `ใหม่ · ขั้น ${to}` : to > was ? `ขั้น ${was} → ${to}` : 'ขั้นสูงสุดแล้ว';
    const b = button(x.name, tag, () => {
      const r = skillsEarn(key, x.id, x.lv);
      if (!r) return done(null);
      done(r.was ? (r.lv > r.was ? `${x.name} ขึ้นเป็นขั้น ${r.lv}` : `${x.name} ขั้นสูงสุดอยู่แล้ว`) : `${x.name} · ขั้น ${r.lv}`);
      if (!fxReduced() && r.lv > r.was) fxPlay(fxOv(), 'title', { tier: r.lv >= SKILL.top ? 'legend' : 'rare', name: x.name, sub: r.was ? `สกิลขึ้นขั้น ${r.lv}` : 'สกิลใหม่ลงสมุด' });
    });
    b.firstChild.append(el('small', 'idesc', ISEKAI_SKILLS[x.id].desc));
    // ขั้นสูงสุดแล้ว ลงซ้ำไม่ได้อะไร — กันเสียสิทธิ์เลือกของการ์ดใบนี้
    if (to === was) b.disabled = true;
    box.append(b);
  }
  return box;
}

// การ์ดฝึกสกิล (06s): ตราชื่อสกิลหลังกด · ปุ่มท้าย (ยังไม่ฝึก) ไม่มีเอฟเฟกต์ · ขั้นใหม่อ่านจากป้ายปุ่มที่แกนเขียน
function upgradeFx(card, i) {
  if (i >= card.choices.length - 1 || fxReduced()) return;
  const [name] = card.choices[i].split(' · ');
  const lv = /→ (\d+)$/.exec(card.choices[i])?.[1];
  fxPlay(fxOv(), 'title', { tier: +lv >= SKILL.top ? 'legend' : 'rare', name, sub: lv ? `สกิลขึ้นขั้น ${lv}` : 'สกิลขึ้นขั้น' });
}

// เลือกพกก่อนไปเกิด (06s): จากสมุดสกิล ≤ SKILL.carry แล้วไปเกิดด้วยปุ่มเซฟเดิม — ชุดที่พกอยู่ในสถานะชีวิตใหม่ ภาพถ่ายเซฟเก็บไปเอง
// สมุดว่าง = ไปเกิดทันทีเหมือนก่อนมีสกิลข้ามชาติ · บรรทัดตามไป/ไม่ตามไป (dsd-2) ไม่บอกตัวเลข
// carryOffered = การ์ดเลือกขึ้นจริง ⇒ ช่องที่ไม่พกแลกเป็นค่าเริ่ม (decisions 355) · สมุดว่างไปเกิดทันที ไม่ได้
let carryNext = [];
let carryOffered = false;
function rebirth() {
  const offers = bookCarryOffers(skillsRead().s);
  if (!offers.length) return play(T.rebirth);
  const prev = [...root.childNodes];
  const pick = [];
  const draw = () => {
    const choices = homeCard('ก่อนไปเกิด', ['เลือกสกิลที่จะพกไปชาติหน้า', `พกได้ ${SKILL.carry} อย่าง ใช้ทั้งชีวิตไทยและชาติต่างโลกที่ตามมา · ทุกอย่างเริ่มขั้น 1 แต่ฝึกถึงขั้นในสมุดได้เร็วกว่าครั้งแรก`, 'ช่องที่ไม่พก ชาติหน้าได้พื้นฐานดีขึ้นแทน']);
    const body = root.querySelector('.body');
    const name = (id) => ISEKAI_SKILLS[id].name;
    const left = offers.filter((o) => !pick.includes(o.id));
    body.append(el('p', 'sub', pick.length ? `ตามไป: ${pick.map(name).join(' · ')}` : 'ตามไป: ไม่มีสกิลใดตามไป'));
    if (left.length) body.append(el('p', 'sub', `ไม่ตามไป: ${left.map((o) => o.name).join(' · ')} — ยังอยู่ในสมุด`));
    for (const o of offers) {
      const on = pick.includes(o.id);
      const full = !on && pick.length >= SKILL.carry;
      const b = button(o.name, full ? `พกครบ ${SKILL.carry} แล้ว` : on ? 'พกไป' : `ขั้น ${o.lv} ในสมุด`, () => {
        if (on) pick.splice(pick.indexOf(o.id), 1);
        else pick.push(o.id);
        draw();
        root.querySelector(`[data-skill="${o.id}"]`)?.focus();
      });
      b.dataset.skill = o.id;
      b.setAttribute('aria-pressed', String(on));
      b.firstChild.append(el('small', 'idesc', o.desc));
      if (full) b.disabled = true;
      choices.append(b);
    }
    choices.append(enter(button(pick.length ? 'ไปเกิดพร้อมสกิลที่พก' : 'ไปเกิดโดยไม่พกสกิล', null, () => {
      carryNext = [...pick];
      carryOffered = true;
      play(T.rebirth);
    })), button('กลับ', null, () => root.replaceChildren(...prev)));
  };
  draw();
}

// ช่วงที่ 7 (ใบ 05 · 09): การ์ดลายรดน้ำทุกใบ · ไม่มีแถบค่าสถานะชีวิต — ชีวิตจบแล้ว (วงปรโลกมีแถบ 4 ค่าของตัวเอง)
const AFTER_KICKER = { transfer: 'ส่วนบุญจากคนข้างหลัง', devaduta: 'ปรโลก', realm: 'ภูมิปลายทาง', ancestor: 'ผีบรรพบุรุษ', loop: 'ปีทิพย์' };
const AFTER_TOP = { verdict: 'ปรโลก', path: 'ทางเกิด', carry: 'ส่งไปเกิด', result: 'ผลที่ตามมา', loopEnd: 'ครบวง' };
const AFTER_REALM_ART = { deva: 'after_heaven', hell: 'after_hell' };
// วงปรโลก (03a): แถว 4 ค่าแบบแถบสถานะ ใต้หัวการ์ด · ชีวิตทิพย์ต่ำ = สีเตือนแบบชีวิต
function loopBar(l) {
  const ul = el('ul', 'sb-m');
  for (const k of LOOP_KEYS) ul.append(meterLi(LOOP_LABELS[k], Math.round(l[k]), k === 'health' && l[k] <= HEALTH_WARN, undefined, k));
  // กรอบ .sb ให้ระยะขอบเท่าแถบสถานะชีวิต
  const bar = el('div', 'sb');
  bar.append(ul);
  return bar;
}
function renderAfter(card) {
  if (card.kind === 'isekai') return renderIsekai(card);
  root.replaceChildren();
  const box = el('article', 'card b af');
  const top = el('div', 'top');
  // หัวแถบเป็นชื่อเกมเหมือนหน้าเปิด (ui-redo 66 · เจ้าของ) · ฉากที่อยู่บอกด้วยป้ายบนการ์ดแทน
  top.append(el('b', null, GAME_NAME), el('small', null, card.loop ? `${genLabel()}${st.name} · ภูมิ${af.verdict.realm.name} · ปีที่ ${card.loop.year}/${card.loop.years}` : `${genLabel()}${st.name} · ${lifeEndWord(isGone(st))} ${st.age}`));
  const body = el('div', 'body');
  const choices = el('div', 'choices');
  const next = () => play(T.afterNext);
  const court = card.kind === 'verdict' || card.scene === 'devaduta';
  // ภาพปรโลก (ui-redo 15): ศาลบนการ์ดตัดสิน · สวรรค์/นรกเฉพาะการ์ดที่อยู่ในภูมินั้นแล้ว (ภูมิปลายทาง · วงปี) — ภูมิอื่นยังไม่มีภาพ
  const realm = (card.loop || card.scene === 'realm') && af.verdict?.realm?.id;
  const pic = court ? 'after_court' : AFTER_REALM_ART[realm];
  if (pic) body.append(sceneSvg(pic, false));
  body.append(el('span', 'kicker', card.kind === 'scene' ? AFTER_KICKER[card.scene] : AFTER_TOP[card.kind]));
  if (card.title) body.append(el('h3', null, card.title));
  if (card.scene === 'devaduta') {
    const wait = petsWaiting(af.st);
    if (wait) body.append(el('p', 'sub', wait));
  }
  if (card.kind === 'verdict') body.append(el('h3', null, `ภูมิ${card.realm}`));
  body.append(el(card.title || card.kind === 'verdict' ? 'p' : 'h3', card.title || card.kind === 'verdict' ? null : 'lead', card.text));
  if (card.reckoning) body.append(reckoningBox(card.reckoning, af.st.deeds));
  if (card.earn) body.append(earnBox(card.earn, `${save.seed}:${st.gen}:v`));
  if (card.lineage) {
    body.append(el('div', 'kicker', 'ผังตระกูล'));
    body.append(af.heir ? lineageView(af.heir.lineage, af.heir.cls, af.heir.lineage.length, 'รุ่นถัดไป') : list(card.lineage, 'picks'));
    // การ์ดส่งต่อ (B95): ผังตระกูลรวมชีวิตที่เพิ่งจบแล้ว + จุดฐานะบ้านที่รุ่นถัดไปจะเกิด
    const chart = af.heir && standingChart(standingGens(af.heir.lineage), CLASSES.indexOf(af.heir.cls));
    if (chart) body.append(chart);
  }
  if (card.note) body.append(el('p', 'note', card.note));
  if (card.done) {
    choices.append(enter(button(BTN.rebirth, null, rebirth)));
    choices.append(button(BTN.newFamily, null, start));
  } else if (card.choices.length) {
    const offer = () => choices.replaceChildren(...card.choices.map((c, i) => {
      const why = lockText(card, i);
      const b = button(c, why ?? card.fx?.[i], () => (card.manual?.[i] ? heirPick(card, i, choices, offer) : play(afterPick(i))), card.hints?.[i]);
      if (why) b.disabled = true;
      return b;
    }));
    offer();
  } else choices.append(enter(button(BTN.next, null, next)));
  if (card.kind === 'verdict') choices.append(copyButton(() => summaryText(st.age, card.realm)));
  box.append(top);
  if (card.loop) box.append(loopBar(card.loop));
  box.append(body, choices);
  root.append(panels(box, false), lifeMenu(card, box, true));
  fxCard(box, card);
}

// หน้าเลือกผู้สืบสายเลือด (B76): แทนแถวปุ่มบนการ์ดทางใบเดิม · เลือกคนแล้วจึงลงเซฟ ถอยกลับไม่ลงเซฟ
// ลำดับตามรายชื่อของเอนจิน (card.heirs) ไม่เรียงใหม่ — ลำดับนี้คือเลขในเซฟ
function heirPick(card, i, choices, back) {
  const again = button('กลับไปเลือกทาง', null, () => {
    back();
    choices.querySelector('button.choice:not(:disabled)')?.focus();
  });
  again.dataset.prev = '';
  choices.replaceChildren(
    el('p', 'ix-ask', 'เลือกคนที่จะเล่นต่อ — เริ่มที่อายุจริงของเขาวันนี้ ไม่ย้อนไปวัยเด็ก'),
    ...card.heirs.map((h, k) => numbered(button(h.name, null, () => play(bloodPick(i, k)), `${kinWord(h)} · อายุ ${h.age} ปี`), k + 1)),
    again,
  );
  choices.querySelector('button').focus();
}

// ต่างโลก (B68): การ์ดแนวหน้าต่างสถานะของเกม · ปุ่มเดินผ่าน afterPick/afterNext ชุดเดียวกับระหว่างชาติ เซฟจึงเล่นซ้ำได้
const ISEKAI_KICKER = { world: 'ห้องสีขาว · เลือกชีวิตใหม่', skill: 'ของขวัญจากเทพธิดา · เลือกสกิล', focus: 'ใกล้ตาย · เลือกโฟกัส', tick: 'จดหมายเหตุ', event: 'เหตุการณ์', result: 'ผลลัพธ์', end: 'ตอนจบในต่างโลก', warn: 'ใกล้ตาย', move: 'ทางแยก · เลือกแคว้น', upgrade: 'สกิลที่ติดตัว · เลือกฝึก' };
// จดหมายเหตุบนการ์ดจบ (B68b ชิ้น 3): แบ่งตามช่วงวัย เก่าอยู่บน ช่วงสุดท้ายเปิดค้าง (เจ้าของเคาะ)
// บรรทัดรับได้ทั้งสตริง "อายุ N · …" ของเซฟเก่า และ { age, until?, stage, kind, text, deltas } ของ engine — มี deltas ถึงขึ้น chip
// ตาหลายปีของ engine บอกปลายช่วงเป็น until · จอใช้ชื่อ to ชุดเดียวกับที่แยกจากสตริง
const CHRON_AGE = /^อายุ (\d+)(?:–(\d+))? · (.*)$/;
function chronEntry(x) {
  if (typeof x !== 'string') return { ...x, to: x.until ?? null };
  const m = CHRON_AGE.exec(x);
  // บรรทัดเหตุการณ์มีหัวเรื่องคั่น · ส่วนบรรทัดทุ่มเทเป็นประโยคเดียว · ไม่มีอายุ = บรรทัดระบบตอนเข้าโลก
  if (!m) return { age: null, kind: 'lore', text: x };
  return { age: Number(m[1]), kind: m[3].includes(' · ') ? 'event' : 'tick', text: m[3], to: m[2] ? Number(m[2]) : null };
}
function chronicleBox(lines, s) {
  const role = Object.keys(ISEKAI_ROLES).find((id) => roleInfo(id).name === s?.world);
  const pace = ISEKAI_ROLES[role]?.pace ?? 1;
  const stageOf = (e) => (e.stage && ISEKAI_STAGES.find((g) => g.id === e.stage)) || ISEKAI_STAGES.findLast((g) => (e.age ?? 0) >= g.from * pace);
  const label = isekaiLabels();
  const groups = [];
  for (const e of lines.map(chronEntry)) {
    const g = stageOf(e);
    if (groups.at(-1)?.g !== g) groups.push({ g, rows: [] });
    // ปีทุ่มเทที่ข้อความเดียวกันต่อกันรวมเป็นบรรทัดเดียว (เจ้าของเคาะ ~20 บรรทัด/ชีวิต) · เหตุการณ์คงแยก · ไม่ข้ามหัวช่วงวัยเพราะรวมในกลุ่มเดียวกันเท่านั้น
    const prev = groups.at(-1).rows.at(-1);
    if (e.kind === 'tick' && prev?.kind === 'tick' && prev.text === e.text && (prev.to ?? prev.age) + 1 === e.age) {
      const deltas = { ...prev.deltas };
      for (const [k, v] of Object.entries(e.deltas ?? {})) deltas[k] = (deltas[k] ?? 0) + v;
      groups.at(-1).rows[groups.at(-1).rows.length - 1] = { ...prev, to: e.to ?? e.age, deltas };
    } else groups.at(-1).rows.push(e);
  }
  const d = el('details', 'tree ichron');
  d.append(el('summary', null, `จดหมายเหตุทั้งชีวิต ${groups.reduce((n, x) => n + x.rows.length, 0)} บรรทัด`));
  groups.forEach(({ g, rows }, i) => {
    const aged = rows.filter((e) => e.age !== null);
    const from = aged[0]?.age;
    const to = aged.length ? Math.max(...aged.map((e) => e.to ?? e.age)) : null;
    const sec = el('details', 'istage');
    sec.open = i === groups.length - 1;
    sec.append(el('summary', null, `${g.name}${from === undefined ? '' : ` · อายุ ${from === to ? from : `${from}–${to}`}`} · ${rows.length} บรรทัด`));
    const ol = el('ol', 'ilog');
    for (const e of rows) {
      const li = el('li', e.kind);
      // บรรทัดเข้าโลกมีอายุไว้จัดช่วงวัย แต่เป็นเรื่องของโลก ไม่ใช่ปีของตัวละคร — ไม่ขึ้นเลขอายุ
      if (e.age !== null && e.kind !== 'lore') li.append(el('b', null, e.to ? `${e.age}–${e.to}` : String(e.age)));
      li.append(el('span', null, e.text));
      for (const [k, v] of Object.entries(e.deltas ?? {})) if (label[k] && v) li.append(el('small', v > 0 ? 'up' : 'down', `${label[k]} ${v > 0 ? '+' : ''}${v}`));
      ol.append(li);
    }
    sec.append(ol);
    d.append(sec);
  });
  return d;
}
// ป้ายค่าต่างโลกบนจอ — บารมีกับความคืบหน้าเป้าหมายยังคิดในแกนเกม แต่ไม่ขึ้นจอ (B162) ผลการ์ดที่แตะแค่สองค่านี้จึงไม่มีบรรทัดตัวเลข
function isekaiLabels() {
  const out = { hp: ISEKAI_HP, gold: 'ทอง', fame: 'ชื่อเสียง' };
  for (const k of ISEKAI_SHOWN) out[k] = ISEKAI_STAT[k];
  return out;
}
// แถบสถานะต่างโลก (ui-redo ใบ 13): โครง statusBar ค่าคนละชุด · ชีวิตต่างโลกถึง 0 ก็ตาย จึงเตือนที่เกณฑ์เดียวกับโลกนี้
// รูปตัวละครโลกนี้ไม่ใช่ร่างนี้ — วงกลมอักษรแรกของชื่อแทน · ไม่มีลูกศรปีนี้ เพราะการ์ดผลบอกตัวเลขที่ขยับอยู่แล้ว
function isekaiBar(card, s, where) {
  const bar = el('header', 'sb');
  const r1 = el('div', 'sb-r1');
  const ini = el('span', 'av ini', [...s.name][0]);
  ini.setAttribute('aria-hidden', 'true');
  const who = el('span', 'sb-who');
  // ช่องอาชีพต่างโลก = บทบาท/ชีวิตบนทวีป (ข้อ 60) · ทองไม่มีหลอดบนหัวการ์ด หลอดอยู่แผงตัวฉัน (ข้อ 162)
  who.append(el('b', null, s.name), whereLine(`${genLabel()}${st.name} · ${where}`), headJob(s.world));
  const age = el('span', 'sb-age');
  age.append(el('b', null, String(s.age)), el('small', null, ' ปี'));
  if (card.step !== 'end' && s.hp <= HEALTH_WARN) {
    bar.classList.add('dying');
    const heart = el('span', 'sb-heart');
    heart.insertAdjacentHTML('beforeend', HEART_ICON);
    heart.setAttribute('role', 'img');
    heart.setAttribute('aria-label', 'ใกล้ตาย');
    age.append(heart);
  }
  const row = el('div', 'hd-row');
  row.append(headCash('ทอง', s.gold.toLocaleString('en-US')));
  r1.append(ini, who, sbRight(age, row));
  const ul = el('ul', 'sb-m');
  ul.append(meterLi(ISEKAI_HP, s.hp, s.hp <= HEALTH_WARN, undefined, 'hp'), ...ISEKAI_SHOWN.map((k) => meterLi(ISEKAI_STAT[k], s[k], false, undefined, k)));
  bar.append(r1, ul);
  return bar;
}
// เกจทองต่างโลก: หลอดเต็ม = ทองตั้งต้นของร่าง + ISEKAI_GOLD_SPAN · ทองที่หาได้ทั้งชาติแทบไม่ขึ้นกับทองตั้งต้น
// จึงบวกช่วงคงที่แทนการคูณ (ร่างเริ่ม 0 คูณแล้วเต็มตั้งแต่ทองก้อนแรก)
// ทองตั้งต้นอ่านจากตารางร่าง ไม่ใช่ทองหลังพกเงินโลกเดิมมา (ค่านั้นไม่ได้เก็บ) — ชาติที่พกมาหลอดเริ่มสูงกว่าได้
const ISEKAI_GOLD_SPAN = 3000;
const isekaiGoldStart = (k) => (k.role ? roleInfo(k.role) : ISEKAI_ROLES[CONT_LIFE.like]).stat.gold;
// 0–1 · null = ยังไม่มีร่าง (ปีแรกก่อนได้บทบาท/เผ่า) ไม่แสดงเกจ
function isekaiGoldFill(k, gold) {
  if (!k?.role && !k?.race) return null;
  return Math.min(1, Math.max(0, gold / (isekaiGoldStart(k) + ISEKAI_GOLD_SPAN)));
}
// แผงตัวฉันต่างโลก: ของที่เคยอัดในหน้าต่างสถานะบนการ์ด — ค่าเต็ม · ทอง ชื่อเสียง เผ่า · อาชีพ (สกิลอยู่แผงของมันเอง)
function isekaiMePanel(s, card) {
  const wrap = el('div', 'me');
  const ul = el('ul', 'me-m');
  ul.append(meterLi(ISEKAI_HP, s.hp, s.hp <= HEALTH_WARN, undefined, 'hp'), ...ISEKAI_SHOWN.map((k) => meterLi(ISEKAI_STAT[k], s[k], false, undefined, k)));
  // ชาติต่างโลกหลังตายอยู่ใน af.isekai · ทริประหว่างชาติไทยอยู่ใน st.trip
  const k = af?.isekai ?? st?.trip;
  const gold = isekaiGoldFill(k, s.gold);
  if (gold !== null) {
    const li = meterLi('ทอง', Math.round(gold * 1000) / 10, false, s.gold.toLocaleString('en-US'), 'gold');
    li.classList.add('gold');
    // ขีด = ทองตั้งต้นของร่างจากตาราง (ไม่ใช่ทองหลังพกมา) · ร่างเริ่ม 0 ขีดชิดซ้ายมองไม่เห็น จึงไม่วาด
    const start = isekaiGoldFill(k, isekaiGoldStart(k));
    if (start > 0) {
      const tick = el('span', 'tick');
      tick.style.left = `${Math.round(start * 1000) / 10}%`;
      tick.title = 'ขีด = ทองตอนเริ่มชาติ';
      li.querySelector('.br').append(tick);
      li.append(el('span', 'sr', 'ขีดบนหลอดคือทองตอนเริ่มชาติ'));
    }
    ul.append(li);
  }
  const dl = el('dl');
  dl.append(el('dt', null, 'ทอง'), el('dd', null, s.gold.toLocaleString('en-US')), el('dt', null, 'ชื่อเสียง'), el('dd', null, String(s.fame)));
  const who = el('p', 'meta');
  // โฟกัสมีหัวของตัวเองแล้ว ไม่ซ้ำในบรรทัดตัวตน (status ของใบเป็นค่าก่อนกดเปลี่ยน)
  metaLine(who, [s.race, s.world, `อายุ ${s.age}`, s.stage].filter(Boolean));
  wrap.append(el('h3', null, 'ค่าสถานะ'), ul, dl, ...isekaiFocusSlot(card), el('h3', null, 'ตัวตน'), who);
  // อาชีพตามโฟกัส (05a) — เซฟก่อนมีอาชีพไม่มีช่องนี้
  if (s.careers?.length) {
    const job = el('p', 'meta');
    metaLine(job, s.careers);
    wrap.append(el('h3', null, 'อาชีพ'), job);
  }
  return wrap;
}
function isekaiSkillPanel(s) {
  const wrap = el('div', 'me');
  if (!s.skills.length) {
    wrap.append(el('p', 'meta', 'ร่างนี้ยังไม่มีสกิล'));
    return wrap;
  }
  const chips = el('div', 'ichips');
  for (const name of s.skills) chips.append(el('span', 'ichip', name));
  wrap.append(chips);
  return wrap;
}
// โฟกัสต่างโลก (ui-redo 83 · แบบชาติไทย): เปลี่ยนนอกการ์ดผ่าน setIsekaiFocus ไม่ใช่ token — ใบตาไม่มีแถบโฟกัสแล้ว
// ส่วนนี้คืนหัว+ปุ่มเป็นก้อนเดียว วางแผงไหนก็ได้ (ใบ 51 ย้ายไปแท็บโฟกัสต่างโลก) · ช่วงที่เปลี่ยนไม่ได้ (ใบเลือกจากการ์ดเตือน · ตอนจบ) ไม่โชว์
function isekaiFocusSlot(card) {
  const isk = af?.isekai ?? st?.trip;
  if (!isekaiFocusOpen(isk)) return [];
  return [el('h3', null, 'โฟกัส'), isekaiFocusBar(card, isk)];
}
// กดเลือกแล้วเซฟทันที ผลไปคิดที่ใบตาถัดไป · วาดใหม่ทั้งก้อนเพราะป้ายบนปุ่มหลักกับตัวที่ทำอยู่เปลี่ยนพร้อมกัน
function isekaiFocusBar(card, isk, open = false) {
  const list = isekaiFocusList(isk);
  const cur = list.find((f) => f.on) ?? list[0];
  const wrap = el('div', 'focus');
  const redraw = (next) => {
    const bar = isekaiFocusBar(card, isk, next);
    wrap.replaceWith(bar);
    bar.querySelector('.focus-btn').focus();
  };
  const btn = el('button', 'focus-btn');
  btn.type = 'button';
  btn.setAttribute('aria-expanded', String(open));
  btn.append(el('span', 'focus-k', 'โฟกัส'), el('b', null, cur.name), el('span', 'focus-fx', cur.fx), el('span', 'focus-go', open ? 'ปิด' : 'เปลี่ยน'));
  btn.onclick = () => redraw(!open);
  const pick = el('div', 'focus-pick');
  pick.hidden = !open;
  for (const f of list) {
    const b = el('button', f.on ? 'on' : null);
    b.type = 'button';
    b.setAttribute('aria-pressed', String(f.on));
    b.append(el('b', null, f.name), el('span', 'focus-fx', f.fx));
    b.onclick = () => {
      setIsekaiFocus(isk, f.id);
      saveWrite(card);
      redraw(false);
    };
    pick.append(b);
  }
  wrap.append(btn, pick);
  return wrap;
}
// ผลทุ่มเทจากแกนเป็นคำรวม "พลัง · เวท ขึ้น" — แตกเป็นชิ้นละค่า ป้ายจึงได้ไอคอน+ลูกศรแบบเดียวกับการ์ดเหตุการณ์
const focusUp = (fx) => (fx?.endsWith(' ขึ้น') ? fx.slice(0, -' ขึ้น'.length).split(' · ').map((k) => `${k} ↑`).join(' · ') : fx);
function renderIsekai(card) {
  root.replaceChildren();
  const box = el('article', 'card i');
  const s = card.status;
  const pick = card.trip ? lifePick : afterPick;
  const where = card.trip ? `ข้ามมาตอนอายุ ${card.life}` : `ชาติต่างโลกที่ ${card.run + 1}`;
  // ยังไม่มีร่างต่างโลก (ไม่มีค่าให้แถบ) — หัวการ์ดบรรทัดเดียวแบบเดิม
  let head = s && isekaiBar(card, s, where);
  if (!head) {
    head = el('div', 'top');
    head.append(el('b', null, 'ต่างโลก'), el('small', null, `${genLabel()}${st.name} · ${lifeEndWord(isGone(st))} ${st.age}`));
  }
  const body = el('div', 'body');
  const choices = el('div', 'choices');
  body.append(el('span', 'kicker', card.step === 'event' ? `${card.finale ? 'เหตุการณ์สุดท้าย' : 'เหตุการณ์'} · อายุ ${card.age}` : card.warn ? ISEKAI_KICKER.focus : ISEKAI_KICKER[card.step]));
  body.append(el('h3', null, card.title), el('p', null, card.text));
  if (card.step === 'result' && card.ok !== null) body.append(el('p', card.ok ? 'iok' : 'ibad', card.ok ? 'สำเร็จ' : 'พลาด'));
  const deltas = Object.entries(card.deltas ?? {});
  if (deltas.length) {
    const label = isekaiLabels();
    const shown = deltas.filter(([k]) => label[k]);
    if (shown.length) body.append(el('p', 'note', shown.map(([k, v]) => `${label[k]} ${v > 0 ? '+' : ''}${v}`).join(' · ')));
  }
  if (card.sys) body.append(el('p', 'isys', card.sys));
  if (card.note) body.append(el('p', 'isys', card.note));
  if (card.saves) body.append(el('p', 'isys', `สกิลช่วยไว้ ${card.saves} ครั้งในชาตินี้`));
  // คำสัญญาที่เทพธิดาฝากไว้ (B68e) — บอกแค่รักษาได้หรือไม่ บุญบาปของมันไปเฉลยที่ปรโลก
  if (card.step === 'end' && card.vow) {
    const v = el('div', `ivow ${card.vow.kept ? 'kept' : 'broke'}`);
    v.append(el('span', 'h', 'คำสัญญากับเทพธิดา'), el('blockquote', null, card.vow.text), el('b', null, card.vow.kept ? 'รักษาไว้ได้' : 'ผิดคำสัญญา'));
    body.append(v);
  }
  // ใบตาแรกของชาติ: lore เป็นประโยคความจำของโลกจากคนต่างโลกรุ่นก่อน (เดิมต่อท้ายใบทุ่มเทใบแรก) · ใบจบ: รายการที่โลกจะจำ
  if (typeof card.lore === 'string') body.append(el('p', 'isys', card.lore));
  else if (card.lore?.length) body.append(el('p', 'isys', `โลกนี้จะจำ${card.lore.length > 1 ? `${card.lore.slice(0, -1).join(' ')} และ${card.lore.at(-1)}` : card.lore[0]}ไว้หลังคุณจากไป`));
  // ต่างโลกไม่มีฉายาของตัวเอง — เบาะแสชี้ฉายาของโลกเดิมที่ชาติหน้ายังไปเก็บได้ (B108 ใช้สองโลก)
  if (card.step === 'end' && !card.trip) clueRow(body, (card.clue ??= titleClue(`${st.seed}:${st.gen}:i${card.run}`)));
  if (card.step === 'end' && card.earn) body.append(earnBox(card.earn, `${save.seed}:${st.gen}:${card.trip ? `t${card.life}` : `i${card.run}`}`));
  if (card.highlights?.length) body.append(el('p', 'isys', 'ฉากที่จำได้ไม่ลืม'), list(card.highlights, 'picks'));
  if (card.log?.length) {
    const d = el('details', 'tree');
    d.append(el('summary', null, `เส้นทางที่เลือก ${card.log.length} เหตุการณ์`), list(card.log, 'picks'));
    body.append(d);
  }
  if (card.chronicle?.length) body.append(chronicleBox(card.chronicle, s));
  if (card.choices.length) {
    card.choices.forEach((c, i) => {
      const why = card.locked?.[i];
      // ใบทุ่มเทจากการ์ดเตือน (B161) ติดป้าย "ฟื้นชีวิต" ที่ทางที่ engine ชี้
      const tags = [focusUp(card.fx?.[i]), card.step === 'focus' && i === card.current && 'ทำอยู่', card.step === 'focus' && i === card.suggest && 'แนะนำ · ฟื้นชีวิต'].filter(Boolean).join(' · ');
      const b = button(c, why ?? (card.step === 'focus' ? tags : card.fx?.[i]), () => {
        play(pick(i));
        if (card.step === 'upgrade') upgradeFx(card, i);
      });
      if (card.desc?.[i]) b.firstChild.append(el('small', 'idesc', card.desc[i]));
      if (why) b.disabled = true;
      choices.append(b);
    });
  }
  const nextTok = card.trip ? T.next : T.afterNext;
  if (!card.choices.length) choices.append(enter(button(BTN.next, null, () => play(nextTok))));
  box.append(head, body, choices);
  root.append(panels(box, false), lifeMenu(card, box));
  shelfDot();
  fxCard(box, card);
}

// เซฟรุ่นเก่า (v1) = seed ต้นตระกูล + ลำดับปุ่มที่กด แล้วเล่นซ้ำตอนโหลด — เนื้อหาเปลี่ยนแล้วเล่นซ้ำได้คนละชีวิต
// เซฟรุ่นใหม่ (v2 · B128) = ภาพถ่ายสถานะจริง (engine snapshot) + สถานะหน้าจอ — อัปเดตเกมแล้วชีวิตที่ค้างยังเล่นต่อได้
// v1 ยังอ่านได้: เล่นซ้ำตรงการ์ดเดิม = เล่นต่อแล้วเขียนทับเป็น v2 ทันที
const SAVE_KEY = 'next-life-save-v1';
const SNAP_KEY = 'next-life-save-v2';
// ภาพถ่ายมีบัญชีบุญบาปข้างใน — xor รหัสตัวอักษรกับกุญแจคงที่ (7 บิตล่าง ไม่ข้ามช่วงอักษร ขนาดเท่าเดิม) กันเปิดดูใน storage เฉย ๆ
// เจ้าของเคาะ · ไม่ได้กันคนตั้งใจแกะ · base64 ทำให้เซฟโตสองเท่า (ไทย 3 ไบต์ต่อตัว) จึงไม่ใช้
const SNAP_XOR = [0x6e, 0x6c, 0x69, 0x66, 0x65, 0x32, 0x38];
const snapXor = (t) => {
  let out = '';
  for (let i = 0; i < t.length; i++) out += String.fromCharCode(t.charCodeAt(i) ^ SNAP_XOR[i % SNAP_XOR.length]);
  return out;
};
const snapHide = snapXor;
const snapShow = snapXor;
// ปุ่มละตัวอักษร: เลือกในชีวิต = 0-9a-z · เลือกระหว่างชาติ = A-Z · ที่เหลือเป็นเครื่องหมาย
const T = { next: '.', afterlife: '>', afterNext: ',', rebirth: '+' };
const lifePick = (i) => i.toString(36);
const afterPick = (i) => String.fromCharCode(65 + i);
// กู้มาจ่าย = token 3 ตัว "~<แหล่ง><ตัวเลือก>" · log เก่าไม่มี "~" จึงตัดทีละตัวอักษรได้เหมือนเดิม
const loanPick = (i, kind) => `~${LOAN_KINDS.indexOf(kind)}${i.toString(36)}`;
const LOAN_TOK = /^~([0-9])([0-9a-z])$/;
// เล่นต่อเป็นผู้สืบสายเลือด (B76) = "@<ทาง A-Z><ลำดับในรายชื่อ>" · รายชื่ออ่านจากสถานะที่เล่นซ้ำมาถึงจุดเดียวกัน ลำดับจึงตรงกันทุกครั้ง
const bloodPick = (i, k) => `@${afterPick(i)}${k.toString(36)}`;
const BLOOD_TOK = /^@([A-Z])([0-9a-z])$/;
const tokens = (log) => log.match(/[~@]..|[^]/g) ?? [];
let save = null;

// อายุของการ์ดชีวิตใบก่อน/ใบนี้ — จำใน apply ไม่ใช่ตอนวาด เพราะเล่นซ้ำจากเซฟไม่ได้วาดทุกใบ
let curAge = null;
function track(card) {
  // อายุบนการ์ดทริปเป็นอายุร่างกายในต่างโลก ไม่ใช่อายุชีวิตไทย
  if (af || card.kind === 'isekai') return card;
  prevAge = curAge;
  curAge = card.age;
  bookNote(card);
  return card;
}

// สมุดชีวิต (B48): จดตอนการ์ดผ่าน track — เล่นซ้ำจากเซฟก็ผ่านครบทุกใบ แกนเกมจึงไม่ต้องเก็บประวัติเพิ่ม
// เหตุการณ์บ้านเมืองที่ชีวิตนี้เห็น (B51) — จดตอนการ์ดผ่าน track เหมือนสมุดชีวิต เล่นซ้ำจากเซฟก็ได้ครบ
let eraSeen = [];
// ภาพในสมุดภาพบ้านเมืองที่ชีวิตนี้ปลด (B130): "e:<เหตุการณ์>" ภาพหลัก · "s:<เหตุการณ์>:<ช่อง>" ภาพตามวัย/ตามมา
// ลงสมุดตอนการ์ดตาย (picsAdd) — ชีวิตที่ยังไม่จบยังไม่นับ แบบเดียวกับสมุดฉายา
let picSeen = [];
let bookIntro = null;
function bookNote(card) {
  if (card.kind === 'intro') bookIntro = card;
  const era = card.kind === 'era' ? card.id : card.news && ERA_OF.get(card.id);
  if (era) eraSeen.push({ id: era, a: card.age });
  // ภาพหลักนับทุกการ์ดของเหตุการณ์ ไม่ใช่แค่ใบที่มีข่าวนำ — ผู้เล่นเห็นภาพยุคบนการ์ดใบนั้นแล้ว
  const pe = card.kind === 'era' ? card.id : ERA_OF.get(card.id);
  const ps = card.kind === 'event' && PIC_OF.get(card.id);
  for (const k of [pe && ERA_PICS[pe] && `e:${pe}`, ps && `s:${ps}`]) if (k && !picSeen.includes(k)) picSeen.push(k);
}
const bookReset = () => {
  eraSeen = [];
  picSeen = [];
  bookIntro = null;
};

// ปก → ฐานะตระกูล → หน้าสุดท้าย · ไม่มีหน้าเล่าเรื่องรายปี
function bookPages(death) {
  return [{ draw: (b) => coverPage(b, death) }, { draw: standPage }, { draw: (b) => endPage(b, death) }];
}

// หน้าฐานะตระกูล (B95) ก่อนหน้าสุดท้าย — รุ่นก่อนทั้งหมด + ชีวิตนี้ถึงวันตาย
function standPage(body) {
  body.append(el('span', 'kicker', 'ฐานะตระกูล'), el('h3', null, st.lineage.length ? `ตระกูลนี้ ${st.lineage.length + 1} รุ่น` : 'ฐานะตลอดชีวิตนี้'));
  const chart = standingChart(standingGens(st.lineage, standingNow(true)), null, false);
  if (chart) body.append(chart);
}

function coverPage(body, death) {
  body.append(el('span', 'kicker', 'สมุดชีวิต'), el('h3', null, fullName()), el('p', 'dates', `${genLabel()}อายุ 0–${death.age} ปี · ${provinceLabel(st)}`));
  if (bookIntro) body.append(el('p', 'sub', bookIntro.text));
}
function endPage(body, death) {
  body.append(el('span', 'kicker', `อายุ ${death.age}`), el('h3', 'lead', `${realName()} จากไปด้วยวัย ${death.age} ปี`));
  if (death.note) body.append(el('p', 'sub', death.note));
  if (death.funeral) body.append(el('p', 'sub', `งานศพ: ${death.funeral.text}`));
  if (death.funeral?.who) body.append(el('p', 'sub', death.funeral.who));
}

// พลิกเองทีละหน้า (คำตัดสินเจ้าของ) · เปิดหน้าไหนก็ไม่แตะ st และไม่ลงเซฟ — รีโหลดกลางสมุดกลับไปที่มรณบัตร
function openBook(death) {
  const pages = bookPages(death);
  const done = () => play(T.afterlife);
  const show = (i) => {
    root.replaceChildren();
    const box = el('article', 'card a lifebook');
    const top = el('div', 'top');
    top.append(el('b', null, 'สมุดชีวิต'), el('small', null, `หน้า ${i + 1}/${pages.length}`));
    const body = el('div', 'body');
    pages[i].draw(body);
    const choices = el('div', 'choices');
    const last = i === pages.length - 1;
    choices.append(enter(button(last ? BTN.toAfter : 'พลิกหน้าถัดไป', null, last ? done : () => show(i + 1))));
    const row = el('div', 'row');
    const back = button('หน้าก่อน', null, () => show(i - 1));
    back.dataset.prev = '';
    back.disabled = i === 0;
    row.append(back);
    if (!last) row.append(button('ข้ามสมุด', null, done));
    choices.append(row);
    box.append(top, body, choices);
    root.append(panels(box));
    fxCard(box, pages[i]);
  };
  show(0);
}

// ทุกปุ่มที่เดินเกมผ่านตรงนี้ทางเดียว — ตอนเล่นจริงกับตอนเล่นซ้ำจากเซฟจึงเดินเหมือนกันทุกก้าว
const apply = (tok) => track(step(tok));
function step(tok) {
  if (tok === T.next) return nextCard(st);
  if (tok === T.afterlife) {
    af = startAfterlife(st);
    return nextAfterCard(af);
  }
  if (tok === T.afterNext) return nextAfterCard(af);
  if (tok === T.rebirth) {
    st = nextLife(af, carryNext, carryNext.length ? skillsRead().s : {}, carryOffered);
    carryNext = [];
    carryOffered = false;
    af = null;
    curAge = null;
    bookReset();
    return nextCard(st);
  }
  if (/^[A-Z]$/.test(tok)) {
    chooseAfter(af, tok.charCodeAt(0) - 65);
    return nextAfterCard(af);
  }
  const blood = BLOOD_TOK.exec(tok);
  if (blood) {
    const heir = heirCandidates(af.st)[parseInt(blood[2], 36)];
    if (!heir) throw new Error(`ปุ่มในเซฟไม่รู้จัก: ${tok}`);
    chooseAfter(af, blood[1].charCodeAt(0) - 65, heir.id);
    return nextAfterCard(af);
  }
  const loan = LOAN_TOK.exec(tok);
  if (loan) {
    const kind = LOAN_KINDS[+loan[1]];
    if (!kind) throw new Error(`ปุ่มในเซฟไม่รู้จัก: ${tok}`);
    choose(st, parseInt(loan[2], 36), kind);
    return nextCard(st);
  }
  if (!/^[0-9a-z]$/.test(tok)) throw new Error(`ปุ่มในเซฟไม่รู้จัก: ${tok}`);
  choose(st, parseInt(tok, 36));
  return nextCard(st);
}

function fnv(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

// ลายนิ้วมือของการ์ดที่ค้างอยู่ — เนื้อเรื่องเปลี่ยนแล้วเล่นซ้ำได้การ์ดคนละใบ ต้องจับได้ ไม่ใช่พาไปโผล่ชีวิตอื่นเงียบ ๆ
function fingerprint(card) {
  return fnv(JSON.stringify([st.gen, card.kind, card.age ?? st.age, card.title, card.text, card.choices])).toString(36);
}

// storage พังได้ (โหมดส่วนตัว · เต็ม · ปิด) — เกมยังเล่นได้ แค่ไม่จำ · ป้ายหัวเว็บบอกผู้เล่นว่าจำอยู่หรือไม่ (B77)
// v = เวอร์ชันที่เขียน — ไว้ดูตอนไล่เซฟที่เล่นซ้ำไม่ตรง
// สถานะหน้าจอที่การ์ดถัดไปอ่านต่อ (อายุใบก่อน · บันทึกชีวิต · สมุดชีวิต) — เดิมได้จากการเล่นซ้ำ ตอนนี้เก็บไปกับภาพถ่าย
const uiState = () => ({ save, prevAge, curAge, eraSeen, picSeen, bookIntro });
function saveWrite(card) {
  try {
    localStorage.setItem(SNAP_KEY, snapHide(JSON.stringify({ v: APP_VERSION, snap: snapshot({ st, af, card, ui: uiState() }, CONTENT) })));
    localStorage.removeItem(SAVE_KEY);
    savedMark(true);
  } catch {
    // เขียนไม่ลงแต่เซฟเก่ายังอยู่ = รีเฟรชแล้วย้อนไปจุดเก่าโดยไม่รู้ตัว — ลบทิ้งดีกว่า
    saveClear();
    savedMark(false);
  }
}
function savedMark(ok) {
  const m = document.getElementById('saved');
  if (!m) return;
  m.textContent = ok ? 'บันทึกแล้ว' : 'ไม่ได้บันทึก';
  m.title = ok ? 'ปิดเกมแล้วกลับมาเล่นต่อจากตรงนี้ได้' : 'เครื่องนี้ไม่ให้เก็บข้อมูล (โหมดส่วนตัวหรือที่เก็บเต็ม) ปิดเกมแล้วชีวิตนี้จะหาย';
  m.classList.toggle('off', !ok);
}
function saveRead() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    return Number.isInteger(s?.seed) && typeof s.log === 'string' && typeof s.fp === 'string' ? s : null;
  } catch {
    return null;
  }
}
const snapExists = () => {
  try {
    return !!localStorage.getItem(SNAP_KEY);
  } catch {
    return false;
  }
};
// ภาพถ่าย v2 → คืนสถานะทั้งเกมบนเนื้อหาปัจจุบัน · การ์ดที่ค้างใช้ไม่ได้แล้ว (เนื้อหาเปลี่ยน) = จั่วใบถัดไป · อ่านไม่ได้ = null
function snapRead() {
  try {
    const raw = localStorage.getItem(SNAP_KEY);
    if (!raw) return null;
    const root = restore(JSON.parse(snapShow(raw)).snap, CONTENT);
    ({ st, af } = root);
    ({ save, prevAge, curAge, eraSeen, bookIntro } = root.ui);
    // ภาพถ่ายก่อนมีสมุดภาพ (B130) ไม่มีช่องนี้ — ภาพของการ์ดก่อนอัปเดตจึงไม่ถูกนับ
    picSeen = root.ui.picSeen ?? [];
    let card = root.card;
    if (!af && repairLife(st, card)) card = track(nextCard(st));
    // ชาติต่างโลกในปรโลกไม่ใช้ af.pending — การ์ดที่ค้างยังใช้ได้ จั่วใหม่ = นับใบซ้ำ + ดึงเลขสุ่มเกิน
    else if (af && !af.isekai && card.choices?.length && !af.pending) card = nextAfterCard(af);
    return card;
  } catch {
    return null;
  }
}
function saveClear() {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(SNAP_KEY);
  } catch {
    // ไม่มีที่เก็บ ก็ไม่มีเซฟให้ลบ
  }
}

const show = (card) => (af ? renderAfter(card) : render(card));

function play(tok, times = 1) {
  let card;
  for (let i = 0; i < times; i++) {
    card = apply(tok);
    save.log += tok;
  }
  saveWrite(card);
  show(card);
}

// ข่าวญาติ/สัตว์ที่ต่อคิวติดกันในปีเดียวกัน (ui-redo ใบ 27) — จอรวมเป็นใบเดียว กดครั้งเดียวเดิน T.next ครบทุกใบ
// อ่านคิวอย่างเดียว ผลเกม/เซฟเท่ากดทีละใบ · โหลดเซฟกลางชุดก็ได้ใบรวมของที่เหลือเพราะอ่านคิวตอนวาด
function digestRest(card) {
  if (af || card.kind !== 'result' || !card.digest) return [];
  const rest = [];
  for (const x of st.queue) {
    if (x.kind !== 'result' || !x.digest) break;
    rest.push(x);
  }
  return rest;
}

function begin(seed) {
  st = newLife(seed, CONTENT);
  af = null;
  save = { seed, log: '' };
  curAge = null;
  bookReset();
  return track(nextCard(st));
}

// seed จากเวลาเฉพาะฝั่งหน้าเว็บ แกนเกมเองไม่แตะนาฬิกา
const freshSeed = () => (Date.now() ^ (performance.now() * 1000)) >>> 0;

// ลิงก์ชวนเพื่อน (B144): ไม่มี server จึงฝัง seed ต้นตระกูลใน URL · engine รับ uint32 ค่าผิดรูป = ไม่สนลิงก์ เกิดสุ่มตามปกติ
const SEED_PARAM = 'seed';
function linkSeed() {
  try {
    const v = new URLSearchParams(location.search).get(SEED_PARAM);
    return v && /^\d{1,10}$/.test(v) && +v <= 0xffffffff ? +v : null;
  } catch {
    return null;
  }
}
// อ่านแล้วลบออกจากแถบที่อยู่ — ไม่งั้นรีโหลดกลางชีวิตจะถามซ้ำ หรือเริ่มชีวิตจากลิงก์ทับชีวิตที่เล่นไปแล้ว
function dropLinkSeed() {
  try {
    const u = new URL(location.href);
    if (!u.searchParams.has(SEED_PARAM)) return;
    u.searchParams.delete(SEED_PARAM);
    history.replaceState(history.state, '', u);
  } catch {
    // แก้แถบที่อยู่ไม่ได้ ก็แค่ถามซ้ำตอนรีโหลด
  }
}
// ชาติแรกเท่านั้นที่ seed กำหนดชีวิตทั้งหมด รุ่นถัดไปขึ้นกับทางที่เลือก ลิงก์จึงชวนได้แค่ชีวิตแรกของตระกูล
const inviteUrl = () => `https://${SHARE_URL}/play.html?${SEED_PARAM}=${save.seed}`;
// ชาติประจำวัน: seed จากวันที่ตามเวลาไทย ไม่ใช่เวลาของเครื่อง — ทั้งประเทศได้ชีวิตเดียวกันในวันนั้น
function thaiDay() {
  const d = new Date(Date.now() + 7 * 3600e3);
  const dd = (n) => String(n).padStart(2, '0');
  return { seed: fnv(`day:${d.toISOString().slice(0, 10)}`), label: `${dd(d.getUTCDate())}/${dd(d.getUTCMonth() + 1)}` };
}

// from อยู่ในเซฟ หน้าจบจึงบอกได้ว่าเกิดจากลิงก์/ชาติประจำวัน แม้รีโหลดกลางชีวิต · ไม่ใช่ token ใน log ผลเกมจึงเท่าเดิม
function start(seed = freshSeed(), from = null) {
  const card = begin(seed);
  if (from) save.from = from;
  saveWrite(card);
  render(card);
}
const startLink = (seed) => start(seed, { link: 1 });
function startDay() {
  const d = thaiDay();
  start(d.seed, { day: d.label });
}

// ขอเกิดใหม่ (B55): เฉพาะชีวิตแรกของตระกูล ก่อนกดอะไร และได้ครั้งเดียว — รุ่นถัดไปเกิดตามกรรม ต้องรับ
// เปลี่ยนแค่ seed ของเซฟ ไม่เป็น token ใน log · rr จำไว้ในเซฟ รีโหลดแล้วปุ่มจึงไม่กลับมา
const canReroll = () => st.gen === 1 && !af && save.log === '' && !save.rr;
function reroll() {
  if (!canReroll()) return;
  const card = begin(freshSeed());
  save.rr = 1;
  saveWrite(card);
  render(card);
}

// เล่นซ้ำทั้งตระกูลจากเซฟ · ไม่ตรงการ์ดเดิม = null
function resume(s) {
  try {
    let card = begin(s.seed);
    if (s.rr) save.rr = 1;
    for (const tok of tokens(s.log)) card = apply(tok);
    save.log = s.log;
    return fingerprint(card) === s.fp ? card : null;
  } catch {
    return null;
  }
}

function homeCard(title, lines) {
  root.replaceChildren();
  const box = el('article', 'card a');
  const top = el('div', 'top');
  top.append(el('b', null, GAME_NAME), el('small', null, title));
  const body = el('div', 'body');
  lines.forEach((t, i) => body.append(el(i ? 'p' : 'h3', i ? 'sub' : 'lead', t)));
  const choices = el('div', 'choices');
  box.append(top, body, choices);
  root.append(box);
  return choices;
}

// ล้างเซฟ = ลบทั้งตระกูล จึงถามซ้ำก่อน · สมุดทุกเล่มในชั้นสมุดแยก key ไม่โดนล้าง
function confirmNew(back, go = () => start(), title = 'เริ่มตระกูลใหม่', yes = 'ลบแล้วเริ่มตระกูลใหม่') {
  const choices = homeCard(title, ['ลบชีวิตที่ค้างไว้ทั้งตระกูล?', 'ผังตระกูลและสิ่งที่สืบทอดจะหายทั้งหมด กู้คืนไม่ได้ · สมุดในชั้นสมุดยังอยู่ครบ']);
  choices.append(button(yes, null, go), button('ยกเลิก', null, back));
}

// เปิดลิงก์เพื่อนตอนมีตระกูลค้าง: ถามก่อนทับ · Enter = เล่นต่อของเดิม กดพลาดจะได้ไม่เสียตระกูล
function linkAsk(card, seed) {
  const choices = homeCard('ลิงก์จากเพื่อน', ['เพื่อนชวนเกิดชีวิตเดียวกัน', `มีชีวิตที่เล่นค้างไว้ (${genLabel()}${st.name}) · เกิดตามลิงก์ = ลบตระกูลนี้ทั้งหมด สมุดในชั้นสมุดยังอยู่ครบ`]);
  choices.append(enter(button(BTN.resume, null, () => home(card))), button('ลบแล้วเกิดตามลิงก์', null, () => startLink(seed)));
}

function home(card) {
  const where = af ? `ระหว่างชาติ หลัง${lifeEndWord(isGone(st))} ${st.age}` : `อายุ ${st.age} · ${provinceLabel(st)}`;
  const choices = homeCard('เล่นต่อ', ['มีชีวิตที่เล่นค้างไว้', `${genLabel()}${st.name} · ${where}`]);
  // ใส่ใน .body ให้ได้ขอบซ้ายขวาเดียวกับหัวการ์ด
  choices.previousElementSibling.append(warnLine());
  choices.append(enter(button(BTN.resume, null, () => show(card))), button(BTN.newFamily, null, () => confirmNew(() => home(card))), button(BTN.shelf, null, () => openShelf()));
}

// เซฟจากเวอร์ชันที่เนื้อหาต่างกัน (B122): เซฟคือ seed + ลำดับปุ่ม เล่นซ้ำบนเนื้อหาใหม่ไม่ได้ชีวิตเดิม จึงเริ่มชีวิตใหม่
// สมุดทุกเล่มในชั้นสมุดและบันทึกชีวิตแยก key ไว้ ไม่โดนล้าง
function staleSave(seed) {
  notesSkip = true;
  const choices = homeCard('เกมอัปเดตแล้ว', ['ชีวิตที่ค้างไว้เล่นต่อไม่ได้', 'เนื้อเรื่องเปลี่ยนตั้งแต่เล่นครั้งก่อน เริ่มชีวิตใหม่ในเวอร์ชันนี้ได้เลย · สมุดในชั้นสมุดยังอยู่ครบ']);
  choices.append(enter(button(seed === null ? 'เริ่มชีวิตใหม่' : 'เกิดตามลิงก์เพื่อน', null, () => (seed === null ? start() : startLink(seed)))), button(BTN.shelf, null, () => openShelf()));
}

// ลิงก์ท้ายหน้าเปิดชั้นสมุดได้ทุกหน้าที่ยังไม่มีเมนูล่าง (หน้า "เล่นต่อ" ขึ้นเฉพาะตอนมีเซฟ) · เปิดซ้อนตัวเองไม่ได้ ไม่งั้นปุ่มกลับพากลับมาที่ชั้นสมุด
document.getElementById('shelfLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (!root.querySelector('.shelf-view')) openShelf();
});
// ชีวิตแรกที่ยังไม่ได้กดอะไรไม่มีอะไรให้เสีย เปลี่ยนได้เลย · นอกนั้นถามก่อนลบตระกูล · ยกเลิกคืนจอเดิมทั้งชุด
function dayNew() {
  if (st.gen === 1 && !af && save.log === '') return startDay();
  const prev = [...root.childNodes];
  confirmNew(() => root.replaceChildren(...prev), startDay, 'ชาติประจำวัน', 'ลบแล้วเกิดชาติประจำวัน');
}
document.getElementById('dayLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  dayNew();
});
shelfDot();
// เพดานความสูงการ์ด (B116) หักหัวเว็บ — ชื่อเกมตัดสองบรรทัดบนจอแคบ หัวจึงสูงไม่ตายตัว วัดจริงแทนเดาค่าเดียว · 20 = ระยะบนของ #app
const chromeH = () => document.documentElement.style.setProperty('--chrome', `${(document.querySelector('.logo')?.offsetHeight ?? 116) + 20}px`);
chromeH();
addEventListener('resize', chromeH);
document.fonts?.ready.then(chromeH);
// ราว/แผงบนคอมเริ่มใต้หัวเว็บ (ui-redo ใบ 67): ขอบล่างหัวจริงขณะเลื่อน — เลื่อนพ้นหัวแล้วชิดบน · หัวสูงเปลี่ยนตามธีมต่างโลกกับฟอนต์ที่โหลดทีหลัง
const logoEl = document.querySelector('.logo');
const headEdge = () => logoEl && document.documentElement.style.setProperty('--hd', `${Math.max(0, Math.round(logoEl.getBoundingClientRect().bottom))}px`);
headEdge();
addEventListener('scroll', headEdge, { passive: true });
addEventListener('resize', headEdge);
if (logoEl && window.ResizeObserver) new ResizeObserver(headEdge).observe(logoEl);

// ภาพถ่าย v2 ก่อน · ไม่มีจึงลองเซฟ v1 (เล่นซ้ำตรงการ์ดเดิม = เขียนทับเป็น v2 ทันที) · v1 ไม่ตรง/เซฟเสีย = หน้าเกมอัปเดต
function boot() {
  // ล้างโครงหน้าเปิดที่มากับ HTML (template.html) — ทุกทางข้างล่างวาดจอใหม่ลง root
  root.replaceChildren();
  const seed = linkSeed();
  dropLinkSeed();
  let card = snapRead();
  if (!card) {
    const s = saveRead();
    if (!s && !snapExists()) return seed === null ? start() : startLink(seed);
    card = s && resume(s);
    if (!card) return staleSave(seed);
    saveWrite(card);
  }
  savedMark(true);
  if (seed === null) home(card);
  else linkAsk(card, seed);
}

boot();
notesBoot();

})();
