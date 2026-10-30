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
import { PLACEHOLDERS, MAX_LEN } from './lint/vocab.mjs';
import { NEAR_HINT_LEVELS } from '../engine/court.mjs';

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

// ที่มาของชุดข้อมูลให้ UI ทำป้าย 📎/🎲 (B140) — นับเฉพาะแถวที่มี source และไม่ใช่ assumption
// ชื่อแหล่งอ่านจาก host ของ URL · host ที่ยังไม่มีชื่อให้หยุด build ไม่งั้นป้ายขึ้นแหล่งว่างเงียบ
const SOURCE_HOSTS = { 'api.worldbank.org': 'World Bank', 'www.nso.go.th': 'สสช.', 'openjicareport.jica.go.jp': 'JICA' };
function sourceOf(rows, y) {
  const real = rows.filter((x) => x.source && !x.assumption);
  if (!real.length) throw new Error('ชุดข้อมูลไม่มีแถวที่มี source');
  const by = [...new Set(real.map((x) => {
    const host = new URL(x.source).host;
    if (!SOURCE_HOSTS[host]) throw new Error(`ยังไม่ได้ตั้งชื่อแหล่ง ${host} ใน SOURCE_HOSTS`);
    return SOURCE_HOSTS[host];
  }))];
  const ys = y === undefined ? real.map((x) => x.y) : [y];
  return { by, from: Math.min(...ys), to: Math.max(...ys) };
}

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
    regions: b.population.regions.map(({ name, ses, v, provinces }) => ({ name, ses, w: v, provinces: provinces.map((p) => ({ name: p.name, w: p.v })) })),
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
  return { era, real, sampleFrom: rules.future.sampleFrom, futureFrom: rules.future.futureFrom };
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
      ...(k.complaint_rate !== undefined && { complaint_rate: num(k.complaint_rate, `${id}.complaint_rate`) }),
      ...(k.cap && { cap: { from: num(k.cap.from, `${id}.cap.from`), v: num(k.cap.v, `${id}.cap.v`) } }),
      ...(k.limit !== undefined && { limit: num(k.limit, `${id}.limit`) }),
      ...(k.from !== undefined && { from: num(k.from, `${id}.from`) }),
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

// รายชื่อเล่น (B27): ทุกปีเกิดของเกมต้องมียุค ทุกยุคมีชื่อทั้งสองเพศ · ชื่อในรายการ avoid (คนดัง/ความหมายลบ) ห้ามหลุดเข้ารายการ
// ยาวเกินค่าของช่อง {ชื่อ} ไม่ได้ — ด่านความยาวของการ์ดวัดด้วยค่านั้น ชื่อที่ยาวกว่าจะดันการ์ดล้นโดยด่านไม่เห็น
export function checkNames(names, from, to) {
  const out = [];
  const avoid = new Set((names.avoid ?? []).map((a) => a.name));
  let next = from;
  for (const e of names.eras ?? []) {
    if (e.from !== next) out.push(`ยุค ${e.from}–${e.to} ต้องเริ่มปี ${next} (ห้ามมีรู/ซ้อน)`);
    next = e.to + 1;
    // ชื่อจริง (names-fun) ขึ้นแทนชื่อเล่นในฉากจริงจัง — กติกาเดียวกับชื่อเล่น
    for (const [kind, sex, xs] of SEXES.flatMap((sex) => [['ชื่อ', sex, e[sex]], ['ชื่อจริง', sex, e.จริง?.[sex]]])) {
      if (!Array.isArray(xs) || !xs.length) {
        out.push(`ยุค ${e.from} ไม่มี${kind}${sex}`);
        continue;
      }
      if (new Set(xs).size !== xs.length) out.push(`ยุค ${e.from} ${kind}${sex}ซ้ำในรายการ`);
      for (const n of xs) {
        if (typeof n !== 'string' || !n.trim() || /[{}\s]/.test(n)) out.push(`ยุค ${e.from} ${kind}${sex} "${n}" ต้องเป็นคำเดียว`);
        else if (n.length > PLACEHOLDERS.ชื่อ.length) out.push(`ยุค ${e.from} ${kind} "${n}" ยาวเกิน ${PLACEHOLDERS.ชื่อ.length}`);
        if (avoid.has(n)) out.push(`ยุค ${e.from} ${kind} "${n}" อยู่ในรายการ avoid`);
      }
    }
  }
  if (next !== to + 1) out.push(`ยุคชื่อจบปี ${next - 1} แต่ปีเกิดของเกมถึง ${to}`);
  for (const a of names.avoid ?? []) if (!a.name || !a.why) out.push('avoid ทุกแถวต้องมี name + why');
  return out;
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
  const future = { from: finance.sampleFrom, recent: finance.futureFrom, to: Math.min(lastOf(cpi), ...finance.real.map(lastOf)) };
  if (future.from < cpi.from + 1 || future.from >= future.to) throw new Error(`ช่วงปีต้นแบบอนาคตใช้ไม่ได้ ${future.from}–${future.to}`);
  if (!(future.recent >= future.from && future.recent < future.to)) throw new Error(`futureFrom ใช้ไม่ได้ ${future.recent}`);
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

  // สาเหตุการตาย (B110): v[ปี][กลุ่ม][ช่วงอายุ] เรียงตาม keys · ปีต้องต่อเนื่อง เพราะแกนอ่านด้วยดัชนีปี
  const dc = json('data/death-causes.json');
  const causeKeys = Object.keys(dc.groups);
  const causes = { keys: causeKeys, ages: dc.ages, from: dc.ชาย[0].y, norm: Object.fromEntries(SEXES.map((s) => [s, dc.norm?.[s] ?? {}])) };
  for (const s of SEXES) {
    causes[s] = dc[s].map((row, i) => {
      if (row.y !== causes.from + i) throw new Error(`death-causes ${s} ปี ${row.y} ไม่ต่อเนื่อง`);
      return causeKeys.map((k) => {
        const v = row.shares[k];
        if (!v || v.length !== dc.ages.length) throw new Error(`death-causes ${s} ${row.y} กลุ่ม ${k} ช่วงอายุไม่ครบ`);
        return v;
      });
    });
  }

  const events = json('data/era-events.json').events.map(({ id, from, to, name, kind, regions }) => ({ id, from, to, name, kind, regions }));

  const names = json('data/names.json');
  const nameProblems = checkNames(names, births.cbr.rows[0].y, births.cbr.rows[0].y + w.length - 1);
  if (nameProblems.length) throw new Error(`data/names.json ไม่ผ่าน ${nameProblems.length} ข้อ\n${nameProblems.join('\n')}`);

  return {
    births: { from: births.cbr.rows[0].y, w },
    names: { eras: names.eras.map(({ from, to, ชาย, หญิง, จริง }) => ({ from, to, ชาย, หญิง, จริง: { ชาย: จริง.ชาย, หญิง: จริง.หญิง } })) },
    cpi,
    future,
    finance: { ...finance.era, debt: loadDebt() },
    careers: loadCareers(finance.era),
    systems: json('data/system-starts.json').systems.map(({ id, status, from, to }) => ({ id, status, from, to })),
    mort: {
      from: m.e0.ชาย[0].y,
      std,
      fit: fitBy,
      e0: Object.fromEntries(SEXES.map((s) => [s, series(m.e0[s])])),
      imr: Object.fromEntries(SEXES.map((s) => [s, series(m.imr[s])])),
    },
    habits,
    causes,
    events,
    birth: loadBirth(),
    src: loadSources(infl, m),
  };
}

function loadSources(infl, m) {
  const b = json('data/birthplace.json');
  return {
    cpi: sourceOf(infl.rows),
    mort: sourceOf(SEXES.flatMap((s) => [...m.e0[s], ...m.imr[s]])),
    pop: sourceOf([b.population], b.population.y),
    income: sourceOf(b.household_income.rows),
    share: sourceOf([...b.income_share.q, b.income_share.top10], b.income_share.y),
  };
}

// สายยศ (B40): เงินเดือนตามบัญชีของปีที่ประกาศ → บาทของปีอ้างอิงค่าจ้าง ด้วยค่าแรงขั้นต่ำจริง (แกนปรับต่อแบบเดียวกับอาชีพ)
// อาชีพที่ขั้นอ้างต้องมีอยู่จริง ไม่งั้นการ์ดที่กรองด้วยอาชีพหาคนในสายไม่เจอเงียบ
export function loadCareers(fin) {
  const c = json('data/careers.json');
  const mw = (y) => {
    const v = fin.minWage.v[y - fin.minWage.from];
    if (v === undefined) throw new Error(`ไม่มีค่าแรงขั้นต่ำปี ${y} ให้ปรับเงินเดือนสายยศ`);
    return v;
  };
  const occIds = new Set(fin.occupations.map((o) => o.id));
  const step = ({ name, occ, mul, suffix, full, pay }) => {
    if (occ && !occIds.has(occ)) throw new Error(`ขั้น ${name} อ้างอาชีพที่ไม่มี: ${occ}`);
    return { name, occ, mul, suffix, full, ...(pay && { pay: pay.v * (mw(fin.refYear) / mw(pay.y)) }) };
  };
  const ladders = Object.fromEntries(Object.entries(c.ladders).map(([id, l]) => {
    for (const o of l.occs ?? []) if (!occIds.has(o)) throw new Error(`สาย ${id} อ้างอาชีพที่ไม่มี: ${o}`);
    return [id, { name: l.name, occs: l.occs, start: l.start, pension: !!l.pension, steps: l.steps.map(step) }];
  }));
  return { ladders, office: { steps: c.office.steps.map(step) }, pension: { div: c.pension.div, cap: c.pension.cap }, severance: c.severance.rows };
}

// หมวด heir: ของทะเบียนธง = ชุดธงที่แกนส่งถึงทายาท — แกนต้องรู้ตอนเล่น ไม่ใช่แค่ lint
const loadHeir = () => parse(read('content/rules/flags.yaml')).heir ?? {};

// คำใบ้ที่ศาลตอนเฉียดตาย (B153) ระดับละหลายข้อความ — ไม่ใช่การ์ด จึงตรวจตอนโหลดแทนด่านเนื้อหา
// ห้ามเลขคู่คำบุญ/บาป (กติกาเดียวกับด่านการ์ดไม่เผยบัญชีของ harness)
export function loadNearHints(p = 'content/rules/near-hints.yaml') {
  const doc = parse(read(p));
  const ids = NEAR_HINT_LEVELS.map((l) => l.id);
  const bad = Object.keys(doc ?? {}).filter((k) => !ids.includes(k)).map((k) => `ระดับ ${k} ไม่มีในแกน (${ids.join(' ')})`);
  for (const id of ids) {
    const xs = doc?.[id];
    if (!Array.isArray(xs) || xs.length < 2) bad.push(`ระดับ ${id} ต้องมีอย่างน้อย 2 ข้อความ`);
    for (const s of Array.isArray(xs) ? xs : []) {
      if (typeof s !== 'string' || !s.trim()) bad.push(`ระดับ ${id} มีข้อความว่าง`);
      else if (s.length > MAX_LEN.text) bad.push(`ระดับ ${id} ยาว ${s.length} เกินเพดาน ${MAX_LEN.text}`);
      else if (/(บุญ|บาป)\s*[+\-−]?\s*\d/.test(s)) bad.push(`ระดับ ${id} เผยตัวเลขบัญชี: ${s}`);
    }
  }
  if (bad.length) throw new Error(`${p} ไม่ผ่านด่าน ${bad.length} ข้อ\n${bad.join('\n')}`);
  return doc;
}

export const loadContent = () => ({ events: loadEvents(), era: loadEra(), heir: loadHeir(), nearHints: loadNearHints() });
