// โหลด content/*.yaml + data/*.json เป็นก้อนเดียวที่แกนเกมใช้ — build กับ harness เรียกตัวเดียวกัน ข้อมูลจึงไม่แตกเป็นสองชุด
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { brassLx, e0FromLx, stdFor, MAX_AGE } from '../engine/era.mjs';
import { normCdf } from '../engine/birth.mjs';
import { CLASSES } from '../engine/life.mjs';
import { lintDocs, formatProblem } from './lint/index.mjs';
import { MERIT_CATS } from './lint/vocab.mjs';
import { checkMeritTable } from '../engine/merit.mjs';
import { DEBTS } from '../engine/finance.mjs';

const root = new URL('../../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const json = (p) => JSON.parse(read(p));
const SEXES = ['ชาย', 'หญิง'];

// ค่ารายฐานะเรียงตาม CLASSES ของแกน — จำนวนต้องตรงกับจำนวนฐานะ ไม่งั้นฐานะท้าย ๆ ได้ undefined เงียบ
function classList(xs, what, n) {
  if (n !== CLASSES.length) throw new Error(`เส้นแบ่งฐานะให้ ${n} ระดับ แต่แกนมี ${CLASSES.length} ชื่อ`);
  if (!Array.isArray(xs) || xs.length !== n || !xs.every((x) => x > 0)) throw new Error(`${what} ต้องเป็นเลขบวก ${n} ค่า`);
  return xs;
}
const r = (v, d) => Number(v.toFixed(d));

// แปลงเป็นรูปที่แกนเกมอ่าน: at_age → age (เหตุการณ์หลักไมล์) · label → text · cost → เงินจ่ายออก
// ฟิลด์ที่แกนยังไม่อ่านคงไว้ครบ ใบถัดไปใช้ต่อได้โดยไม่ต้องแก้ loader
function normalize(e) {
  const choices = e.choices.map(({ label, cost, ...c }) => {
    const effects = cost ? { ...c.effects, money: { ...cost, amount: -cost.amount } } : c.effects;
    return { ...c, text: c.text ?? label, ...(effects && { effects }) };
  });
  return { ...e, ...(e.at_age !== undefined && { age: e.at_age }), choices };
}

export function loadEvents(dir = 'content/') {
  const docs = readdirSync(new URL(dir, root))
    .filter((n) => n.endsWith('.yaml'))
    .sort()
    .map((f) => ({ file: `${dir}${f}`, doc: parse(read(`${dir}${f}`)) }));
  const table = checkMeritTable(MERIT_CATS);
  if (table.length) throw new Error(`ตารางบุญบาปไม่ผ่านด่าน ${table.length} ข้อ\n${table.join('\n')}`);
  const problems = lintDocs(docs);
  if (problems.length) throw new Error(`เนื้อหาไม่ผ่านด่าน ${problems.length} ข้อ\n${problems.map(formatProblem).join('\n')}`);
  return docs.flatMap(({ doc }) => doc.events.map(normalize));
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

function normInv(p) {
  let lo = -10, hi = 10;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (normCdf(mid) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const SES_KEYS = ['all', 'bkk', 'central', 'north', 'northeast', 'south'];
export function loadBirth() {
  const b = json('data/birthplace.json');
  const rows = b.household_income.rows;
  rows.forEach((row, i) => {
    if (i && row.y <= rows[i - 1].y) throw new Error(`รายได้รายภาคต้องเรียงปีไม่ซ้ำ (${row.y})`);
    for (const k of SES_KEYS) if (!(row[k] > 0)) throw new Error(`รายได้ ${k} ปี ${row.y} ไม่ใช่ตัวเลขบวก`);
  });
  for (const r of b.population.regions) if (!SES_KEYS.includes(r.ses) || r.ses === 'all') throw new Error(`ภาค ${r.name} อ้าง ses ไม่รู้จัก: ${r.ses}`);
  // ความกว้างของ lognormal ที่ทำให้ส่วนแบ่ง 5 กลุ่มใกล้ข้อมูลที่สุด
  const shares = b.income_share.q.map((x) => x.v / 100);
  if (Math.abs(shares.reduce((s, x) => s + x, 0) - 1) > 0.01) throw new Error('ส่วนแบ่ง 5 กลุ่มรวมไม่ใกล้ 100%');
  const qz = [-Infinity, ...[0.2, 0.4, 0.6, 0.8].map(normInv), Infinity];
  const sse = (sg) => shares.reduce((s, v, k) => s + (normCdf(qz[k + 1] - sg) - normCdf(qz[k] - sg) - v) ** 2, 0);
  let lo = 0.05, hi = 3;
  for (let i = 0; i < 100; i++) {
    const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
    if (sse(m1) < sse(m2)) hi = m2;
    else lo = m1;
  }
  const sigma = r((lo + hi) / 2, 6);
  const rules = b.rules;
  return {
    regions: b.population.regions.map(({ name, ses, v }) => ({ name, ses, w: v })),
    income: rows.map((row) => Object.fromEntries([['y', row.y], ...SES_KEYS.map((k) => [k, row[k]])])),
    sigma,
    cutZ: rules.classes.cuts.map((c) => r(normInv(c), 6)),
    backcastGrowth: rules.before_2524.growth,
    saveRate: rules.save_rate.v,
    startMoney: classList(rules.start_money.by_class, 'เงินติดตัว', rules.classes.cuts.length + 1),
  };
}

// ชุดการเงินในรูปที่แกนเกมอ่าน (B08) · real = ชุดที่ปีสุดท้ายเป็นข้อมูลจริง ใช้กำหนดช่วงปีต้นแบบอนาคต
export function loadFinance() {
  const f = json('data/finance.json');
  const rules = f.rules;
  const set = series([f.set_close.base, ...f.set_close.rows]);
  const div = series(f.set_dividend.rows);
  if (div.from !== set.from + 1 || div.v.length !== set.v.length - 1) throw new Error('ปีปันผลไม่ตรงกับปีดัชนีหุ้น');
  const occupations = f.occupations.list.map(({ id, name, edu, wage }) => ({ id, name, edu, wage: wage.v }));
  // อาชีพเรียงตามค่าจ้าง ฐานะสูงเล็งอาชีพค่าจ้างสูง · พื้น floor ให้ทุกอาชีพเกิดได้ทุกฐานะ
  const { spread, floor } = rules.occupation_by_class;
  const byWage = occupations.map((o, i) => i).sort((a, b) => occupations[a].wage - occupations[b].wage);
  const rank = byWage.reduce((m, oi, r) => ((m[oi] = r), m), []);
  const top = occupations.length - 1;
  const occByClass = {};
  CLASSES.forEach((cls, d) => {
    const aim = (d * top) / (CLASSES.length - 1);
    const w = occupations.map((o, i) => Math.exp(-((rank[i] - aim) ** 2) / (2 * spread ** 2)) + floor);
    const sum = w.reduce((s, x) => s + x, 0);
    occByClass[cls] = w.map((x) => x / sum);
  });
  const era = {
    deposit: series(f.deposit.rows),
    lending: series(f.lending.rows),
    fx: series(f.fx.rows),
    gold: series(f.gold_usd.rows),
    setClose: set,
    setDiv: div,
    house: series(f.house_bkk.rows),
    housePremium: rules.house_before_bis.premium,
    minWage: series(f.min_wage_bkk.rows),
    refYear: f.occupations.ref_year.y,
    daysPerMonth: rules.days_per_month.v,
    occupations,
    occByClass,
  };
  const real = [era.deposit, era.lending, era.fx, era.gold, era.setClose, era.house];
  return { era, real, sampleFrom: rules.future.sampleFrom };
}

// ค่าเลขที่หายจะกลายเป็น NaN ในเงินทุกปีหลังกู้ — ตรวจครบทุกชนิดที่แกนรู้จักตั้งแต่โหลด
export function loadDebt() {
  const d = json('data/debt.json');
  const num = (v, what) => {
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) throw new Error(`data/debt.json ${what} ต้องเป็นตัวเลข ≥ 0 ได้ ${v}`);
    return v;
  };
  const kinds = {};
  for (const { id } of DEBTS) {
    const k = d.kinds[id];
    if (!k) throw new Error(`data/debt.json ไม่มีหนี้ชนิด ${id}`);
    const rate = typeof k.rate === 'object' ? k.rate.v : k.rate;
    kinds[id] = {
      ...(rate !== undefined && { rate: num(rate, `${id}.rate`) }),
      ...(k.premium !== undefined && { premium: num(k.premium, `${id}.premium`) }),
      ...(k.years !== undefined && { years: num(k.years, `${id}.years`) }),
      ...(k.grace !== undefined && { grace: num(k.grace, `${id}.grace`) }),
      ...(k.simple && { simple: true }),
      ...(k.cap && { cap: { from: num(k.cap.from, `${id}.cap.from`), v: num(k.cap.v, `${id}.cap.v`) } }),
    };
    if (kinds[id].rate === undefined && kinds[id].premium === undefined) throw new Error(`data/debt.json ${id} ต้องมี rate หรือ premium`);
    if (!kinds[id].simple && !(kinds[id].years >= 1)) throw new Error(`data/debt.json ${id} ผ่อนแบบมีงวดต้องมี years ≥ 1`);
  }
  return {
    retireSpend: num(d.rules.retire_spend.v, 'retire_spend'),
    retireFloor: num(d.rules.retire_floor.v, 'retire_floor'),
    bankrupt: { k: num(d.rules.bankrupt.k, 'bankrupt.k'), n: num(d.rules.bankrupt.n, 'bankrupt.n') },
    kinds,
  };
}

export function loadEra() {
  const births = json('data/births.json');
  const pop = new Map(births.population.rows.map((x) => [x.y, x.v]));
  const w = births.cbr.rows.map((x) => {
    if (!pop.has(x.y)) throw new Error(`ไม่มีประชากรปี ${x.y}`);
    return Math.round((x.v / 1000) * pop.get(x.y));
  });

  const infl = json('data/inflation.json');
  const cpi = series(infl.rows);
  const finance = loadFinance();
  // ปีต้นแบบของอนาคตต้องมีค่าจริงครบทุกชุด จึงจบที่ชุดที่จบเร็วสุด
  const lastOf = (s) => s.from + s.v.length - 1;
  const future = { from: finance.sampleFrom, to: Math.min(lastOf(cpi), ...finance.real.map(lastOf)) };
  if (future.from < cpi.from + 1 || future.from >= future.to) throw new Error(`ช่วงปีต้นแบบอนาคตใช้ไม่ได้ ${future.from}–${future.to}`);
  // ทุกปีเกมอ่านปีต้นแบบ (B14) — ค่าแรงต้องมีปีก่อนหน้าเพื่อคิดอัตราโต · ปีอ้างอิงต้องอยู่ในข้อมูล
  const mw = finance.era.minWage;
  if (mw.from > future.from - 1 || lastOf(mw) < future.to) throw new Error(`ค่าแรงขั้นต่ำ ${mw.from}–${lastOf(mw)} ไม่ครอบปีต้นแบบ ${future.from - 1}–${future.to}`);
  if (finance.era.refYear < mw.from || finance.era.refYear > lastOf(mw)) throw new Error(`ปีอ้างอิงค่าจ้าง ${finance.era.refYear} อยู่นอกข้อมูลค่าแรง`);

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
    cpi,
    future,
    finance: { ...finance.era, debt: loadDebt() },
    systems: json('data/system-starts.json').systems.map(({ id, status, from, to }) => ({ id, status, from, to })),
    mort: {
      from: m.e0.ชาย[0].y,
      std,
      fit: fitBy,
      e0: Object.fromEntries(SEXES.map((s) => [s, series(m.e0[s])])),
      imr: Object.fromEntries(SEXES.map((s) => [s, series(m.imr[s])])),
    },
    habits,
    events,
    birth: loadBirth(),
  };
}

export const loadContent = () => ({ events: loadEvents(), era: loadEra() });
