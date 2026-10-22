// โหลด content/*.yaml + data/*.json เป็นก้อนเดียวที่แกนเกมใช้ — build กับ harness เรียกตัวเดียวกัน ข้อมูลจึงไม่แตกเป็นสองชุด
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { brassLx, e0FromLx, stdFor, MAX_AGE } from '../engine/era.mjs';

const root = new URL('../../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const json = (p) => JSON.parse(read(p));
const SEXES = ['ชาย', 'หญิง'];
const r = (v, d) => Number(v.toFixed(d));

export function loadEvents() {
  const events = [];
  for (const f of readdirSync(new URL('content/', root)).filter((n) => n.endsWith('.yaml')).sort()) {
    const doc = parse(read(`content/${f}`));
    for (const e of doc.events ?? []) {
      if (!e.id || typeof e.age !== 'number' || !Array.isArray(e.choices) || !e.choices.length) {
        throw new Error(`${f}: เหตุการณ์ ${e.id ?? '?'} ขาดฟิลด์บังคับ (id/age/choices)`);
      }
      events.push(e);
    }
  }
  const ids = new Set();
  for (const e of events) {
    if (ids.has(e.id)) throw new Error(`id ซ้ำ: ${e.id}`);
    ids.add(e.id);
  }
  return events;
}

// แถวต้องเรียงปีติดกันไม่มีรู ไม่งั้นการเปิดดูด้วย index ปีผิดเงียบ
function series(rows) {
  rows.forEach((row, i) => {
    if (row.y !== rows[0].y + i) throw new Error(`ปีไม่ต่อเนื่องที่ ${row.y}`);
    // ค่าหายแล้วปล่อยผ่าน = bisection เทียบกับ undefined แล้วได้ fit มั่วเงียบ ๆ
    if (typeof row.v !== 'number' || !Number.isFinite(row.v)) throw new Error(`ค่า v ไม่ใช่ตัวเลขที่ปี ${row.y}`);
  });
  return { from: rows[0].y, v: rows.map((x) => x.v) };
}

// ตารางมาตรฐานรายอายุ 0..MAX_AGE จาก nqx กลุ่มอายุ (hazard คงที่ในกลุ่ม) + หาง Gompertz หลัง 85
function standardLx({ nqx, m85 }, slope) {
  const lx = [1];
  for (let g = 0; g < nqx.length; g++) {
    const start = nqx[g].age;
    const end = g + 1 < nqx.length ? nqx[g + 1].age : 85;
    const mu = -Math.log(1 - nqx[g].v) / (end - start);
    for (let x = start; x < end; x++) lx[x + 1] = lx[x] * Math.exp(-mu);
  }
  // หา hazard เริ่มที่อายุ 85 ให้อายุคาดที่ 85 = 1/m85 (ความหมายของ nMx กลุ่มเปิด)
  const tail = (c) => {
    const out = [1];
    for (let x = 85; x < MAX_AGE; x++) out.push(out.at(-1) * Math.exp(-c * Math.exp(slope * (x - 85))));
    return out;
  };
  const e85 = (t) => t.slice(0, -1).reduce((s, l, i) => s + (l + t[i + 1]) / 2, 0);
  let lo = 1e-4, hi = 2;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (e85(tail(mid)) > 1 / m85.v) lo = mid;
    else hi = mid;
  }
  const t = tail(lo);
  for (let x = 86; x <= MAX_AGE; x++) lx[x] = lx[85] * t[x - 85];
  lx[MAX_AGE] = 0;
  return lx;
}

// alpha ตรึงอัตราตายทารก แล้วหา beta ให้ e0 ตรง (e0 ลดลงเมื่อ beta เพิ่ม)
function fit(stdLx, e0, imr) {
  const logit = (l) => 0.5 * Math.log((1 - l) / l);
  const y1 = logit(1 - imr / 1000);
  const ys1 = logit(stdLx[1]);
  const e0At = (b) => e0FromLx(brassLx(stdLx, y1 - b * ys1, b));
  let lo = 0.05, hi = 4;
  if (e0At(lo) < e0 || e0At(hi) > e0) throw new Error(`fit ไม่ได้: e0 ${e0} IMR ${imr}`);
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (e0At(mid) > e0) lo = mid;
    else hi = mid;
  }
  return { a: y1 - lo * ys1, b: lo };
}

const points = (rows) => rows.map((x) => [x.y, x.v]);

export function loadEra() {
  const births = json('data/births.json');
  const pop = new Map(births.population.rows.map((x) => [x.y, x.v]));
  const w = births.cbr.rows.map((x) => {
    if (!pop.has(x.y)) throw new Error(`ไม่มีประชากรปี ${x.y}`);
    return Math.round((x.v / 1000) * pop.get(x.y));
  });

  const infl = json('data/inflation.json');
  const firstReal = infl.rows.find((x) => !x.assumption).y;

  const m = json('data/mortality.json');
  const std = {};
  const fitBy = {};
  for (const s of SEXES) {
    const tables = m.standard[s];
    tables.forEach((t, i) => {
      if (i && t.y <= tables[i - 1].y) throw new Error(`ตารางมาตรฐานต้องเรียงปีไม่ซ้ำ (${t.y})`);
    });
    // ปัดก่อน fit เพื่อให้ค่าที่ฝังในเกมคือค่าที่ใช้ fit จริง · ปัดตามเลขนัยสำคัญ ไม่ใช่ทศนิยม ไม่งั้นหางอายุ 110+ กลายเป็น 0 (ตายแน่นอนก่อน 120)
    const lxs = tables.map((t) => standardLx(t, m.rules.tail.slope).map((l, x) => (x === MAX_AGE ? 0 : Number(l.toPrecision(6)))));
    std[s] = { ys: tables.map((t) => t.y), lx: lxs };
    const e0 = series(m.e0[s]);
    const imr = series(m.imr[s]);
    if (e0.from !== imr.from || e0.v.length !== imr.v.length) throw new Error('ช่วงปี e0 กับ IMR ไม่ตรงกัน');
    const fits = e0.v.map((v, i) => fit(stdFor(std[s], e0.from + i), v, imr.v[i]));
    fitBy[s] = { a: fits.map((f) => r(f.a, 6)), b: fits.map((f) => r(f.b, 6)) };
  }

  const h = json('data/habits.json');
  const hs = json('data/habits-survey.json');
  const habits = {
    smoking: { ชาย: points(h.smoking.ชาย), หญิง: points(h.smoking.หญิง) },
    alcohol_litres: { all: points(h.alcohol_litres.all) },
    drinkers: { ชาย: points(hs.drinkers.ชาย), หญิง: points(hs.drinkers.หญิง) },
    drinkers_11plus: { ชาย: points(hs.drinkers_11plus.ชาย), หญิง: points(hs.drinkers_11plus.หญิง) },
    exercise: { ชาย: points(hs.exercise.ชาย), หญิง: points(hs.exercise.หญิง) },
  };

  const events = json('data/era-events.json').events.map(({ id, from, to, name, kind, regions }) => ({ id, from, to, name, kind, regions }));

  return {
    births: { from: births.cbr.rows[0].y, w },
    cpi: { ...series(infl.rows), sampleFrom: firstReal },
    mort: {
      from: m.e0.ชาย[0].y,
      std,
      fit: fitBy,
      e0: Object.fromEntries(SEXES.map((s) => [s, series(m.e0[s])])),
      imr: Object.fromEntries(SEXES.map((s) => [s, series(m.imr[s])])),
    },
    habits,
    events,
  };
}

export const loadContent = () => ({ events: loadEvents(), era: loadEra() });
