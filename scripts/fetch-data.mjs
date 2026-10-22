// ดึงข้อมูลยุคจาก World Bank / WHO GHO แล้วเขียน data/*.json (snapshot ตามวันที่ดึง เพราะต้นทางปรับย้อนหลังได้ทุกรอบ)
// รันเฉพาะตอนอยากอัปเดตข้อมูล: node scripts/fetch-data.mjs · build/harness อ่านไฟล์ที่ commit ไว้ ไม่ต่อเน็ต
import { writeFileSync } from 'node:fs';

const BE = 543;
const FIRST = 2500;
const LAST = 2569;
const today = new Date().toISOString().slice(0, 10);

const wbUrl = (code) => `https://api.worldbank.org/v2/country/THA/indicator/${code}?format=json&date=1960:2025&per_page=100`;

async function wb(code) {
  const res = await fetch(wbUrl(code));
  if (!res.ok) throw new Error(`${code}: HTTP ${res.status}`);
  const [, rows] = await res.json();
  const out = new Map();
  for (const r of rows ?? []) if (r.value !== null) out.set(Number(r.date) + BE, r.value);
  if (!out.size) throw new Error(`${code}: ไม่มีข้อมูล`);
  return out;
}

const round = (v, d = 4) => Number(v.toFixed(d));

// แถวปี FIRST..LAST: ปีที่มีข้อมูลใส่ source · ปีที่ขาดใช้ค่าปีที่ใกล้ที่สุด ติด assumption
function yearly(map, code, from = FIRST, to = LAST, note) {
  const src = wbUrl(code);
  const years = [...map.keys()].sort((a, b) => a - b);
  const rows = [];
  for (let y = from; y <= to; y++) {
    if (map.has(y)) {
      rows.push({ y, v: round(map.get(y)), source: src });
      continue;
    }
    const near = y < years[0] ? years[0] : years.filter((k) => k < y).at(-1);
    rows.push({ y, v: round(map.get(near)), assumption: true, note: note?.(y, near) ?? `ไม่มีข้อมูลปี ${y} ใช้ค่าปี ${near}` });
  }
  return rows;
}

const write = (name, obj) => {
  writeFileSync(new URL(`../data/${name}`, import.meta.url), JSON.stringify(obj, null, 1) + '\n');
  console.log(`data/${name}`);
};

// --- จำนวนเกิด: น้ำหนักปีเกิด = CBR/1000 × ประชากร (lore-era-data หัวข้อ 1)
const [cbr, pop] = await Promise.all([wb('SP.DYN.CBRT.IN'), wb('SP.POP.TOTL')]);
const birthNote = (y, near) =>
  y < 2503 ? `ไม่มีข้อมูลก่อน 2503 ใช้ค่าปี ${near} (ใบ B02)` : y === LAST ? `ปี ${LAST} ยังไม่มีข้อมูล ใช้ค่าปี ${near} (เจ้าของตัดสิน)` : `ต้นทางยังไม่มีค่าปี ${y} ใช้ค่าปี ${near}`;
write('births.json', {
  title: 'น้ำหนักปีเกิด = อัตราเกิดหยาบ × ประชากร',
  retrieved: today,
  cbr: { unit: 'ต่อ 1,000 คน', rows: yearly(cbr, 'SP.DYN.CBRT.IN', FIRST, LAST, birthNote) },
  population: { unit: 'คน', rows: yearly(pop, 'SP.POP.TOTL', FIRST, LAST, birthNote) },
});

// --- เงินเฟ้อ CPI % ต่อปี
const cpi = await wb('FP.CPI.TOTL.ZG');
const cpiRows = yearly(cpi, 'FP.CPI.TOTL.ZG', 2503, Math.max(...cpi.keys()));
for (let y = 2502; y >= FIRST; y--) cpiRows.unshift({ y, v: 0, assumption: true, note: 'ไม่มีข้อมูลก่อน 2503 ใช้ 0% (lore-era-data หัวข้อ 6)' });
write('inflation.json', {
  title: 'เงินเฟ้อรายปี (CPI, % ต่อปี)',
  retrieved: today,
  unit: '% ต่อปี',
  rows: cpiRows,
  rules: {
    future: {
      method: 'sample_history',
      assumption: true,
      note: 'ปีหลังข้อมูลล่าสุด สุ่มจากค่าจริงปี 2503 ขึ้นไป ต่อชีวิตต่อปี (ใบ 03: สุ่มจากการกระจายของสถิติย้อนหลัง)',
    },
  },
});

// --- อายุคาด + อัตราตายทารก แยกเพศ
const [e0m, e0f, imrm, imrf] = await Promise.all(
  ['SP.DYN.LE00.MA.IN', 'SP.DYN.LE00.FE.IN', 'SP.DYN.IMRT.MA.IN', 'SP.DYN.IMRT.FE.IN'].map(wb),
);
const lastMort = Math.max(...e0m.keys());
const mortNote = (y, near) => `ไม่มีข้อมูลก่อน 2503 ใช้ค่าปี ${near} (lore-era-data หัวข้อ 6)`;

// ตารางมาตรฐานรายปี: WHO nqx รายกลุ่มอายุ ทุกปีที่มี + nMx กลุ่ม 85+ ไว้ต่อหางเส้น
const ghoUrl = (ind) => `https://ghoapi.azureedge.net/api/${ind}?$filter=SpatialDim%20eq%20'THA'`;
async function gho(ind) {
  const res = await fetch(ghoUrl(ind));
  if (!res.ok) throw new Error(`${ind}: HTTP ${res.status}`);
  return (await res.json()).value;
}
const GROUPS = ['AGEGROUP_YEARS00-01', 'AGEGROUP_YEARS01-04'];
for (let a = 5; a < 85; a += 5) GROUPS.push(`AGEGROUP_YEARS${String(a).padStart(2, '0')}-${String(a + 4).padStart(2, '0')}`);
const startOf = (g) => Number(g.slice(14, 16));
const [nqx, nmx] = await Promise.all([gho('LIFE_0000000030'), gho('LIFE_0000000029')]);
const stdYears = [...new Set(nqx.map((x) => x.TimeDim))].sort((a, b) => a - b);
function standard(sexCode, ce) {
  const rows = GROUPS.map((g) => {
    const r = nqx.find((x) => x.TimeDim === ce && x.Dim1 === sexCode && x.Dim2 === g);
    if (!r) throw new Error(`WHO nqx ขาด ${ce} ${sexCode} ${g}`);
    return { age: startOf(g), v: round(r.NumericValue, 6), source: ghoUrl('LIFE_0000000030') };
  });
  const m85 = nmx.find((x) => x.TimeDim === ce && x.Dim1 === sexCode && x.Dim2 === 'AGEGROUP_YEARS85PLUS');
  if (!m85) throw new Error(`WHO nMx ขาด ${ce} ${sexCode} 85+`);
  return { y: ce + BE, nqx: rows, m85: { v: round(m85.NumericValue, 6), source: ghoUrl('LIFE_0000000029') } };
}
for (let i = 1; i < stdYears.length; i++) if (stdYears[i] !== stdYears[i - 1] + 1) throw new Error(`WHO ปีขาดช่วงที่ ${stdYears[i]}`);
const stdFirst = stdYears[0] + BE;
const stdLast = stdYears.at(-1) + BE;

write('mortality.json', {
  title: 'อายุคาดเฉลี่ยและอัตราตายทารก แยกเพศ + ตารางมาตรฐานรูปเส้นการตาย',
  retrieved: today,
  e0: {
    ชาย: yearly(e0m, 'SP.DYN.LE00.MA.IN', FIRST, lastMort, mortNote),
    หญิง: yearly(e0f, 'SP.DYN.LE00.FE.IN', FIRST, lastMort, mortNote),
  },
  imr: {
    unit: 'ต่อ 1,000 เกิดมีชีพ',
    ชาย: yearly(imrm, 'SP.DYN.IMRT.MA.IN', FIRST, lastMort, mortNote),
    หญิง: yearly(imrf, 'SP.DYN.IMRT.FE.IN', FIRST, lastMort, mortNote),
  },
  standard: {
    ชาย: stdYears.map((ce) => standard('SEX_MLE', ce)),
    หญิง: stdYears.map((ce) => standard('SEX_FMLE', ce)),
  },
  rules: {
    shape: {
      method: 'brass_logit',
      assumption: true,
      note: `รูปเส้นตามอายุ: ปี ${stdFirst}–${stdLast} ใช้ตาราง WHO ของปีนั้น (ตาม lore-era-data หัวข้อ 6) · ก่อน ${stdFirst} ใช้ตาราง WHO ปี ${stdFirst} แทนตาราง HLD 1960 ที่ lore เสนอ (ยังไม่ได้ดึง และ lore บอกว่าหน้าเว็บไม่ระบุแยกเพศ) · หลัง ${stdLast} ใช้ปี ${stdLast} · แล้วปรับ 2 ค่า (alpha beta) ให้อัตราตายทารกและ e0 ตรงกับ World Bank รายปี`,
    },
    tail: {
      method: 'gompertz_from_85',
      slope: 0.1,
      assumption: true,
      note: 'อายุ 85 ขึ้นไป อัตราตายโตแบบ Gompertz 10%/ปี เริ่มจาก nMx 85+ ของ WHO · อายุ 120 ตายแน่นอน (เพดานคำนวณ อายุก่อนหน้านั้นยังมีโอกาสรอด)',
    },
    future: {
      method: 'hold_last',
      assumption: true,
      note: `ปีหลัง ${lastMort} ยังไม่มีข้อมูล (UN WPP ต้องมี token) ใช้ค่าปี ${lastMort}`,
    },
  },
});

// --- พฤติกรรมเสี่ยง: ส่วนที่ดึงอัตโนมัติได้ (ค่าที่อ่านจากรายงานอยู่ใน data/habits-survey.json)
const [smm, smf, alc] = await Promise.all(['SH.PRV.SMOK.MA', 'SH.PRV.SMOK.FE', 'SH.ALC.PCAP.LI'].map(wb));
const points = (map, code) => [...map.keys()].sort((a, b) => a - b).map((y) => ({ y, v: round(map.get(y), 2), source: wbUrl(code) }));
write('habits.json', {
  title: 'พฤติกรรมเสี่ยงตามยุค (ค่าจากโมเดลของ WHO ผ่าน World Bank)',
  retrieved: today,
  smoking: { unit: '% ผู้ใหญ่ 15+', ชาย: points(smm, 'SH.PRV.SMOK.MA'), หญิง: points(smf, 'SH.PRV.SMOK.FE') },
  alcohol_litres: { unit: 'ลิตรแอลกอฮอล์บริสุทธิ์/คน/ปี อายุ 15+', all: points(alc, 'SH.ALC.PCAP.LI') },
  rules: {
    between: { method: 'linear', assumption: true, note: 'ปีระหว่างจุดข้อมูลใช้เส้นตรง' },
    outside: { method: 'hold_nearest', assumption: true, note: 'ก่อนจุดแรก/หลังจุดสุดท้ายใช้ค่าจุดที่ใกล้สุด (lore-era-data 4.2: ก่อน 2543 ใช้ค่าปีแรกที่มี)' },
  },
});
