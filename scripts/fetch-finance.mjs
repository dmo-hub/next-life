// ดึงชุดข้อมูลการเงิน (B08 · ใบ 10 · 14 · lore-finance-series) แล้วเขียน data/finance.json ไฟล์เดียว
// แยกจาก fetch-data.mjs เพราะตัวนั้นเขียน data/ ทับทั้งชุด · รัน: node scripts/fetch-finance.mjs (ต้องต่อเน็ต)
// ชุดที่ไม่มี API (ปันผล · ค่าแรงขั้นต่ำ) พิมพ์จากแหล่งที่อ่านแล้วใน lore (5c) พร้อม URL ต่อค่า
import { writeFileSync } from 'node:fs';

const BE = 543;
const FIRST = 2500;
const today = new Date().toISOString().slice(0, 10);
const round = (v, d = 4) => Number(v.toFixed(d));

async function get(url, kind = 'text') {
  // sdmx.ilo.org ตอบ 500 กับ Accept-Language: * ที่ fetch ของ Node ใส่ให้เอง
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return kind === 'json' ? res.json() : res.text();
}

const wbUrl = (code) => `https://api.worldbank.org/v2/country/THA/indicator/${code}?format=json&date=1960:2025&per_page=100`;
async function wb(code) {
  const [, rows] = await get(wbUrl(code), 'json');
  const out = new Map();
  for (const r of rows ?? []) if (r.value !== null) out.set(Number(r.date) + BE, r.value);
  if (!out.size) throw new Error(`${code}: ไม่มีข้อมูล`);
  return out;
}

// แถวปีต่อเนื่อง from..to: ปีที่มีค่าใส่ source · ปีที่ขาดให้ fill(y) คืน {v, note} ติด assumption
function rows(map, source, from, to, fill) {
  const out = [];
  for (let y = from; y <= to; y++) {
    if (map.has(y)) out.push({ y, v: round(map.get(y)), source });
    else {
      const f = fill(y);
      out.push({ y, v: round(f.v), assumption: true, note: f.note });
    }
  }
  return out;
}

// ปีที่ขาดกลางชุดเติมเส้นตรงจากปีข้าง ๆ ที่มีค่า
function linear(map, y) {
  const ks = [...map.keys()].sort((a, b) => a - b);
  const lo = ks.filter((k) => k < y).at(-1);
  const hi = ks.find((k) => k > y);
  return map.get(lo) + ((map.get(hi) - map.get(lo)) * (y - lo)) / (hi - lo);
}
const lastOf = (map) => Math.max(...map.keys());

// --- ดอกเบี้ยเงินฝาก / เงินกู้ (World Bank · IMF IFS)
const [dep, lend, fx] = await Promise.all([wb('FR.INR.DPST'), wb('FR.INR.LEND'), wb('PA.NUS.FCRF')]);
const deposit = rows(dep, wbUrl('FR.INR.DPST'), FIRST, lastOf(dep), (y) =>
  y < 2520 ? { v: 8, note: 'ก่อน 2520 ไม่มีข้อมูล ใช้ 8.00% ของปี 2520 คงที่ (lore-finance-series (7))' } : { v: linear(dep, y), note: `ต้นทางไม่มีปี ${y} เส้นตรงจากปีข้าง ๆ (lore-finance-series (7))` },
);
const lending = rows(lend, wbUrl('FR.INR.LEND'), FIRST, lastOf(lend), (y) =>
  y < 2519 ? { v: 15, note: 'ก่อน 2519 ไม่มีข้อมูล ใช้เพดานตามกฎหมาย 15.00% (lore-finance-series (5c))' } : { v: linear(lend, y), note: `ต้นทางไม่มีปี ${y} เส้นตรงจากปีข้าง ๆ (lore-finance-series (7))` },
);
const fxFirst = Math.min(...fx.keys());
const exchange = rows(fx, wbUrl('PA.NUS.FCRF'), FIRST, lastOf(fx), () => ({ v: fx.get(fxFirst), note: `ก่อน ${fxFirst} ไม่มีข้อมูล ใช้ค่าปี ${fxFirst}` }));

// --- ทองโลก USD/ออนซ์ ราคาเดือน ธ.ค. (World Bank Pink Sheet ผ่าน datahub)
const GOLD_URL = 'https://raw.githubusercontent.com/datasets/gold-prices/main/data/monthly.csv';
const goldMap = new Map();
for (const line of (await get(GOLD_URL)).trim().split(/\r?\n/).slice(1)) {
  const [d, p] = line.split(',');
  if (d.endsWith('-12')) goldMap.set(Number(d.slice(0, 4)) + BE, Number(p));
}
const gold = rows(goldMap, GOLD_URL, FIRST, lastOf(goldMap), () => {
  throw new Error('ทองขาดปี');
});

// --- SET Index ปิดสิ้นปี (Wikipedia อ้าง SET Market Statistics · ไม่รวมปันผล)
const SET_URL = 'https://en.wikipedia.org/w/index.php?title=SET_Index&action=raw';
const SET_PAGE = 'https://en.wikipedia.org/wiki/SET_Index';
const wiki = await get(SET_URL);
const setMap = new Map();
// ตารางมีสองรูป: "| 1975 || 84.08 || ..." กับแถวละเซลล์ "|2013\n|1,298.71"
for (const m of wiki.matchAll(/^\|\s*(19[7-9]\d|20[0-4]\d)\s*(?:\|\||\n\|)\s*([\d,]+\.\d+)/gm)) setMap.set(Number(m[1]) + BE, Number(m[2].replaceAll(',', '')));
for (let y = 2518; y <= lastOf(setMap); y++) if (!setMap.has(y)) throw new Error(`SET ขาดปี ${y}`);
const setClose = [...setMap.keys()].sort((a, b) => a - b).map((y) => ({ y, v: setMap.get(y), source: SET_PAGE }));

// --- อัตราปันผลตอบแทน SET สิ้นปี (รายงานประจำปี SET อ้าง Bloomberg · lore (5c))
const SET_AR = 'https://media.set.or.th/set/Documents/2022/May/AW-SET_ar11_en_lowres_update.pdf';
const SET_AR15 = 'https://www.set.or.th/annualreport/en/2015/files/assets/basic-html/page-18.html';
const SET_AR23 = 'https://media.set.or.th/set/Documents/2024/May/SET_Annual_Report_2023_ENG.pdf';
const DIV = { 2553: 3.56, 2554: 4.03, 2555: 3.19, 2556: 3.42, 2557: 3.05, 2558: 3.58, 2559: 3.16, 2560: 2.81, 2561: 3.35, 2562: 3.26, 2563: 2.75, 2564: 2.65, 2565: 2.76, 2566: 3.21, 2568: 4.04 };
const divSrc = (y) => (y <= 2555 ? SET_AR : y <= 2558 ? SET_AR15 : SET_AR23);
const dividend = [];
for (let y = 2518; y <= lastOf(setMap); y++) {
  if (DIV[y] !== undefined) dividend.push({ y, v: DIV[y], source: divSrc(y) });
  else if (y === 2567) dividend.push({ y, v: 3.63, assumption: true, note: 'ยังไม่ได้ค่าปี 2567 ใช้เฉลี่ย 2566 กับ 2568 (lore (5c))' });
  else dividend.push({ y, v: 3, assumption: true, note: 'ไม่มีอัตราปันผลรายปีก่อน 2553 ใช้ 3.00% คงที่ ในกรอบจริง 1.88–7.25% (lore (5c))' });
}

// --- ราคาที่อยู่อาศัย กทม. (BIS ผ่าน FRED · รายไตรมาส ใช้ไตรมาส 4 เป็นค่าสิ้นปี)
const BIS_URL = 'https://fred.stlouisfed.org/graph/fredgraph.csv?id=QTHN628BIS';
const bisMap = new Map();
for (const line of (await get(BIS_URL)).trim().split(/\r?\n/).slice(1)) {
  const [d, v] = line.split(',');
  if (d.slice(5, 7) === '10' && v !== '.') bisMap.set(Number(d.slice(0, 4)) + BE, Number(v));
}
const house = [...bisMap.keys()].sort((a, b) => a - b).map((y) => ({ y, v: round(bisMap.get(y)), source: BIS_URL }));

// --- ค่าแรงขั้นต่ำกรุงเทพฯ บาท/วัน (lore (5) · (5c))
const EULER = 'https://eulerpool.com/en/macro/thailand/minimum-wages';
const KHAOSOD = 'https://today.line.me/th/v3/article/XY6gMWw';
const WAGE_EULER = [12, 20, 25, 25, 28, 35, 45, 54, 61, 64, 66, 66, 70, 70, 73, 73, 78, 90, 100, 115, 125, 135, 145, 157, 157, 162, 162, 162, 165, 162, 169, 170, 181, 184, 191, 203, 203, 206, 215];
const minWage = WAGE_EULER.map((v, i) => ({ y: 2516 + i, v, source: EULER }));
const later = [
  { y: 2555, v: 300, source: KHAOSOD },
  { y: 2556, v: 300, source: KHAOSOD },
  { y: 2557, v: 300, assumption: true, note: 'ไม่มีประกาศใหม่ปี 2557–2559 ใช้ 300 บาทของปี 2556' },
  { y: 2558, v: 300, assumption: true, note: 'ไม่มีประกาศใหม่ปี 2557–2559 ใช้ 300 บาทของปี 2556' },
  { y: 2559, v: 300, assumption: true, note: 'ไม่มีประกาศใหม่ปี 2557–2559 ใช้ 300 บาทของปี 2556' },
  { y: 2560, v: 310, source: 'https://www.bangkokbiznews.com/social/935583' },
  { y: 2561, v: 325, source: 'https://www.bangkokbiznews.com/social/935583' },
  { y: 2562, v: 325, assumption: true, note: 'ไม่มีค่าปี 2562 ใช้ค่าปี 2561' },
  { y: 2563, v: 331, source: 'https://www.bangkokbiznews.com/social/935583' },
  { y: 2564, v: 331, assumption: true, note: 'ไม่มีค่าปี 2564 ใช้ค่าปี 2563' },
  { y: 2565, v: 353, source: 'https://www.finnomena.com/?p=221675' },
  { y: 2566, v: 353, assumption: true, note: 'ปี 2566 ยังเป็นฉบับ 1 ต.ค. 2565 (lore ที่หักล้างแล้ว)' },
  { y: 2567, v: 363, source: 'https://www.thansettakij.com/business/economy/583033' },
  // ปี 2568 มีสองฉบับ (372 ม.ค. · 400 ก.ค.) — ตั้งแต่ 2555 ใช้ค่าสูงสุดของปีแบบเดียวกับชุดข่าวสด
  { y: 2568, v: 400, source: 'https://www.thansettakij.com/economy/631531' },
  { y: 2569, v: 400, assumption: true, note: 'ปี 2569 ยังไม่มีประกาศใหม่ ใช้ฉบับ 1 ก.ค. 2568' },
];
minWage.push(...later);

// --- ค่าจ้างเฉลี่ยลูกจ้างตามอาชีพ ISCO-08 ปี 2561 (ILOSTAT · LFS · บาท/เดือน)
const ILO_URL = 'https://sdmx.ilo.org/rest/data/ILO,DF_EAR_EMTA_SEX_OCU_CUR_NB,1.0/THA.A.......?format=csv&startPeriod=1950';
const ilo = (await get(ILO_URL)).split(/\r?\n/);
const iscoWage = (g) => {
  const line = ilo.find((l) => l.includes(`,SEX_T,OCU_ISCO08_${g},CUR_TYPE_LCU,2018,`));
  if (!line) throw new Error(`ILOSTAT ขาด ISCO ${g} ปี 2018`);
  return round(Number(line.split(',')[8]), 2);
};
const OCC = [
  { id: 'farmer', name: 'เกษตรกร', isco: 6, edu: 'ประถม' },
  { id: 'labor', name: 'รับจ้างทั่วไป', isco: 9, edu: 'ประถม' },
  { id: 'factory', name: 'พนักงานโรงงาน', isco: 8, edu: 'มัธยม' },
  { id: 'craft', name: 'ช่างฝีมือ', isco: 7, edu: 'มัธยม' },
  { id: 'service', name: 'ค้าขายและบริการ', isco: 5, edu: 'มัธยม' },
  { id: 'clerk', name: 'พนักงานสำนักงาน', isco: 4, edu: 'อาชีวะ' },
  { id: 'technician', name: 'ช่างเทคนิค', isco: 3, edu: 'อาชีวะ' },
  { id: 'professional', name: 'วิชาชีพ', isco: 2, edu: 'อุดมศึกษา' },
  { id: 'manager', name: 'ผู้บริหาร', isco: 1, edu: 'อุดมศึกษา' },
];
// รหัสหมวดเก็บเป็นป้าย ไม่ใช่ตัวเลข — check-data จะถือว่าเป็นค่าที่ต้องมีที่มา
const occupations = OCC.map((o) => ({ ...o, isco: `ISCO-08 หมวด ${o.isco}`, wage: { v: iscoWage(o.isco), source: ILO_URL } }));

const finance = {
  title: 'ชุดข้อมูลการเงินรายปี (B08) — ผลตอบแทนสินทรัพย์ · ดอกเบี้ย · ค่าจ้าง',
  retrieved: today,
  deposit: { unit: '% ต่อปี', rows: deposit },
  lending: { unit: '% ต่อปี', rows: lending },
  fx: { unit: 'บาทต่อดอลลาร์ เฉลี่ยทั้งปี', rows: exchange },
  gold_usd: { unit: 'ดอลลาร์ต่อออนซ์ เดือน ธ.ค.', rows: gold },
  set_close: { unit: 'จุด ปิดสิ้นปี', base: { y: 2517, v: 100, source: 'https://en.wikipedia.org/wiki/SET_Index' }, rows: setClose },
  set_dividend: { unit: '% ต่อปี', rows: dividend },
  house_bkk: { unit: 'ดัชนี 2553 = 100 ไตรมาส 4', rows: house },
  min_wage_bkk: { unit: 'บาท/วัน', rows: minWage },
  occupations: { unit: 'บาท/เดือน ปี 2561', ref_year: { y: 2561, source: ILO_URL }, list: occupations },
  rules: {
    future: {
      method: 'shared_proto_year',
      sampleFrom: 2520,
      assumption: true,
      note: 'ปีหลังข้อมูลล่าสุดของแต่ละชุด สุ่มปีต้นแบบปีเดียวต่อปีอนาคตจากปี 2520 ขึ้นไป แล้วใช้ค่าของปีนั้นกับทุกสินทรัพย์และเงินเฟ้อพร้อมกัน (B08-plan ข้อ 1 · เจ้าของเคาะ)',
    },
    stock_total_return: { assumption: true, note: 'ผลตอบแทนหุ้นรวม = % เปลี่ยนแปลง SET Index + อัตราปันผลปีนั้น · ปี 2518 เทียบฐาน 100 จุด ณ 30 เม.ย. 2518 (lore (5c))' },
    gold_baht: { assumption: true, note: 'ทองไทย = ทองโลกเดือน ธ.ค. × ค่าเงินบาทเฉลี่ยทั้งปี — ยังไม่มีชุดทองไทยที่มีที่มา (lore (7))' },
    house_before_bis: {
      premium: 4,
      assumption: true,
      note: 'ก่อนชุด BIS (ไตรมาส 4 ปีแรก) ราคาบ้าน/ที่ดินโต = เงินเฟ้อ + 4.00% ต่อปี (ช่วง 2534–2540 ที่ดินขึ้นราว 9%/ปี ขณะเงินเฟ้อราว 5% · lore (5c)) · ใช้ราคาที่อยู่อาศัย กทม. แทนที่ดินทุกภาค',
    },
    min_wage_before: { assumption: true, note: 'ก่อน 2516 ไม่มีค่าแรงขั้นต่ำ ย้อนจาก 12 บาทปี 2516 ด้วยเงินเฟ้อของเกม · หลังปีล่าสุดโตตามเงินเฟ้อ' },
    days_per_month: { v: 26, assumption: true, note: 'แปลงค่าแรงขั้นต่ำบาท/วันเป็นบาท/เดือนด้วย 26 วัน (เจ้าของเคาะ B08-plan ข้อ 3)' },
    wage: {
      assumption: true,
      note: 'ค่าจ้าง/เดือน = ค่าจ้างตามอาชีพปี 2561 × (ค่าแรงขั้นต่ำปีนั้น ÷ ปี 2561) × สัดส่วนรายได้ภาคต่อทั้งประเทศ (SES) · วุฒิผูกกับอาชีพ ไม่คูณซ้ำ (ค่าจ้างตามอาชีพรวมผลวุฒิไว้แล้ว)',
    },
    occupation_by_class: {
      spread: 2,
      floor: 0.02,
      assumption: true,
      note: 'โอกาสได้อาชีพตามฐานะเกิด 10 ระดับ — เรียงอาชีพตามค่าจ้าง ฐานะระดับ d เล็งอาชีพลำดับ d × 8/9 น้ำหนักลดแบบระฆัง (กว้าง spread ลำดับ) + พื้น floor ทุกอาชีพจึงเกิดได้ทุกฐานะ · ยังไม่มีสถิติให้แปลงตรง (เจ้าของเคาะ: ตั้งตามฐานะเกิด · ให้กระจายทุกอาชีพ)',
    },
    cash: { v: 0, assumption: true, note: 'เงินสดไม่มีผลตอบแทน (เสียค่าเงินตามเงินเฟ้อ)' },
  },
};

writeFileSync(new URL('../data/finance.json', import.meta.url), JSON.stringify(finance, null, 1) + '\n');
console.log(`data/finance.json · SET ${setClose[0].y}–${setClose.at(-1).y} · ทอง ${gold[0].y}–${gold.at(-1).y} · บ้าน ${house[0].y}–${house.at(-1).y} · ฝาก ${deposit.at(-1).y} · กู้ ${lending.at(-1).y}`);
