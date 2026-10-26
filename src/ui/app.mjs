import { newLife, nextCard, choose, statsOf, provinceLabel, STAT_LABELS, STAT_KEYS, STAGES, isWorking, monthlyIncome, jobText, totalDebt, startAfterlife, nextAfterCard, chooseAfter, nextLife, lineageText, titlesOf, stageSummary, ALL_PATTERNS, TITLES, FAMILY_TITLES, TIERS, horoscope, familyOf, MERIT_LEVELS } from '../engine/index.mjs';

// เลขเวอร์ชันเดโม — เขียนทับโดย `npm run bump` (patch +1 · `npm run bump -- minor` = minor +1 patch 00) ห้ามแก้รูปแบบบรรทัด
const APP_VERSION = 'v0.2.43';
const APP_BUILD = '2026-10-26';

const root = document.getElementById('app');
document.getElementById('appVer').textContent = `${APP_VERSION} · ${APP_BUILD}`;
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

// แถบค่าสถานะไม่มีตัวเลข (ใบ 06) — ผู้เล่นอ่านจากความยาวแถบเท่านั้น
function stats(s) {
  const box = el('div', 'stats');
  for (const k of STAT_KEYS) {
    const col = el('div');
    col.append(el('span', null, STAT_LABELS[k]));
    const track = el('div', 'bar');
    const fill = el('i');
    fill.style.width = `${Math.round(s[k])}%`;
    track.append(fill);
    col.append(track);
    box.append(col);
  }
  return box;
}

// คำอธิบายค่าสถานะ: บอกแค่ทิศว่าค่านั้นไปมีผลกับอะไร — ห้ามตัวเลข เกณฑ์ สูตร และไม่พูดถึงบุญบาป
// ทุกบรรทัดต้องตรงกับที่แกนเกมอ่านจริง (แก้แกนแล้วทิศเปลี่ยน ต้องแก้ที่นี่ด้วย)
const STAT_HELP = [
  ['สุขภาพ', 'ลดลงเองตามวัย · ยิ่งทรุดกว่าที่ร่างกายควรเป็นตามวัยยิ่งเสี่ยงตายในปีนั้น ดูแลจนดีกว่านั้นยิ่งอยู่ยืน · หมดแถบคือตาย'],
  ['ความสุข', 'ค่อย ๆ กลับสู่ระดับเดิมของตัวเองทุกปี ช่วงสุขหรือทุกข์จึงไม่ค้างนาน · ล้มละลายทำให้ลดลง'],
  ['ความรู้', 'เพิ่มขึ้นเองทีละน้อยตามวัย · ใช้สอบเข้าเรียนต่อ และช่วยให้ทางที่ต้องใช้หัวสำเร็จง่ายขึ้น'],
  ['ความสัมพันธ์', 'จางลงเองทีละน้อยถ้าไม่ดูแล · ล้มละลายทำให้ลดลง · ถ้าไปเกิดเป็นลูกหลานในบ้านเดิม ติดตัวไปส่วนหนึ่ง'],
  ['คอนเน็คชั่น', 'ยิ่งสูงตอนหางาน ยิ่งเจองานค่าแรงดี และสูงพอได้ข้อเสนองานเพิ่ม · ไปเกิดเป็นลูกหลานในบ้านเดิมได้ติดตัวไปส่วนหนึ่ง'],
  ['เงิน · หนี้', 'เงินเก็บโตหรือหดตามที่เลือกลงทุน · เงินติดตัวติดลบโดนดอกเบี้ยทบ · เงินกู้หักค่างวดทุกปี · หนี้ท่วมรายได้นานหลายปีจะล้มละลาย ทรัพย์เหลือศูนย์'],
  ['ทุกค่า', 'บางทางเลือกต้องมีค่าถึงก่อนจึงกดได้ (ปุ่มบอกเหตุผล) · ค่าที่สูงหรือต่ำมากทำให้ผลบางเรื่องเอียงดีหรือร้าย และเปลี่ยนเรื่องที่จะเจอ'],
];
function statHelp() {
  const d = el('details', 'stat-help');
  d.append(el('summary', null, 'ค่าสถานะเหล่านี้หมายถึงอะไร?'));
  const dl = el('dl');
  for (const [k, v] of STAT_HELP) dl.append(el('dt', null, k), el('dd', null, v));
  d.append(dl);
  return d;
}

// ป้ายแกนเงินสั้นพอวางข้างกราฟ: 15k · 1.2 ล้าน
function shortBaht(v) {
  const a = Math.abs(v), sign = v < 0 ? '−' : '';
  const num = (x) => String(Number(x.toFixed(x < 10 ? 1 : 0)));
  if (a >= 1e6) return `${sign}${num(a / 1e6)} ล้าน`;
  if (a >= 1e3) return `${sign}${num(a / 1e3)}k`;
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
// เส้นแยกด้วยสีและลายเส้น (ไม่พึ่งสีอย่างเดียว) · ค่าสถานะไม่มีตัวเลขบนจอ (บอกแค่ทิศ) แกนตั้งจึงเป็นคำ
const LINE_DASH = ['', '7 3', '2 3', '9 3 2 3', '4 2'];
// เรื่องเด่นทั้งชีวิต = เรื่องเด่นของแต่ละช่วงวัยชุดเดียวกับการ์ดเปลี่ยนช่วง (ผู้เล่นเคยเห็นแล้ว ไม่มีของใหม่ให้รั่ว)
function lifeMarks(deathAge) {
  return STAGES.flatMap((s, i) => (s.from > deathAge ? [] : stageSummary(st, s.name, s.from, Math.min((STAGES[i + 1]?.from ?? Infinity) - 1, deathAge)).highlights));
}
function lifeChart(life, deathAge) {
  if (life.stats.length < 2) return null;
  const box = el('div', 'lifechart');
  box.append(el('div', 'h', `ทั้งชีวิต · อายุ 0–${deathAge}`));
  const W = 320, H = 158, L = 46, R = 8, T = 18, B = 20;
  const x = (a) => L + (a / Math.max(deathAge, 1)) * (W - L - R);
  const y = (v) => T + ((100 - v) / 100) * (H - T - B);
  const svg = svgEl('svg', { class: 'spark life', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `ค่าสถานะตลอดชีวิต อายุ 0 ถึง ${deathAge}` });
  stageBands(svg, x, 0, deathAge, T, H - B, true);
  for (const [v, t] of [[100, 'สูง'], [50, ''], [0, 'ต่ำ']]) {
    svg.append(svgEl('line', { class: 'grid', x1: L, x2: W - R, y1: y(v), y2: y(v) }));
    if (t) svg.append(svgEl('text', { class: 'ty', x: L - 4, y: y(v) + 3.5 }, t));
  }
  const ages = deathAge >= 10 ? [0, Math.round(deathAge / 2), deathAge] : [0, deathAge];
  for (const a of ages) svg.append(svgEl('text', { class: 'tx', x: x(a), y: H - 6, 'text-anchor': a === 0 ? 'start' : a === deathAge ? 'end' : 'middle' }, `อายุ ${a}`));
  const legend = el('ul', 'legend');
  STAT_KEYS.forEach((k, i) => {
    const pts = life.stats.map((p) => `${x(p.age).toFixed(1)},${y(p[k]).toFixed(1)}`).join(' ');
    svg.append(svgEl('polyline', { class: `ln ln${i}`, points: pts, 'stroke-dasharray': LINE_DASH[i] }));
    const key = svgEl('svg', { class: 'key', viewBox: '0 0 24 8', 'aria-hidden': 'true' });
    key.append(svgEl('line', { class: `ln ln${i}`, x1: 0, x2: 24, y1: 4, y2: 4, 'stroke-dasharray': LINE_DASH[i] }));
    const li = el('li');
    li.append(key, STAT_LABELS[k]);
    legend.append(li);
  });
  // จุดเรื่องเด่น + จุดตาย (B38): ชี้/แตะ/โฟกัสแล้วบรรทัดใต้กราฟบอกเรื่อง — มือถือไม่มี hover <title> อย่างเดียวไม่พอ
  const cap = el('p', 'mk-cap', 'แตะจุดบนกราฟเพื่อดูเรื่องในปีนั้น');
  cap.setAttribute('aria-live', 'polite');
  const mark = (a, text, cls) => {
    const g = svgEl('g', { class: `mk ${cls}`, tabindex: 0, role: 'button', 'aria-label': text });
    g.append(svgEl('title', {}, text), svgEl('circle', { cx: x(a), cy: H - B - 5, r: 4 }));
    const show = () => (cap.textContent = text);
    g.addEventListener('click', show);
    g.addEventListener('focus', show);
    g.addEventListener('mouseenter', show);
    svg.append(g);
  };
  for (const m of lifeMarks(deathAge)) mark(m.age, `อายุ ${m.age} · ${m.text}`, 'ev');
  mark(deathAge, `ตายอายุ ${deathAge}`, 'death');
  box.append(svg, legend, cap);
  const money = sparkline(life.money, 0, deathAge, true);
  if (money) box.append(el('div', 'h', 'เงินติดตัว'), money);
  return box;
}

function list(items, cls = 'items') {
  const ul = el('ul', cls);
  for (const it of items) ul.append(el('li', null, it));
  return ul;
}

// สรุปช่วงวัยที่ผ่านมา: แถบตอนนี้ + ขีดตำแหน่งต้นช่วง — บอกว่าเปลี่ยนไปมากน้อยโดยไม่มีตัวเลข
function recap(r) {
  const box = el('div', 'recap');
  box.append(el('div', 'h', `ช่วง${r.stage} · อายุ ${r.fromAge}–${r.toAge}`));
  const grid = el('div', 'delta');
  for (const s of r.stats) {
    const row = el('div');
    const dir = s.to - s.from;
    row.append(el('span', null, `${s.label} ${Math.abs(dir) < 1 ? '·' : dir > 0 ? '↑' : '↓'}`));
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

// แถบภาพพิกเซลปรโลก (ต้นแบบการ์ด B2) — ทำเครื่องหมายฉากปรโลกให้ต่างจากการ์ดระหว่างชาติใบอื่น
const COURT_PX = [
  [0, 25, 76, 5, '#3A2C1F'], [30, 6, 16, 19, '#5A1A14'], [28, 4, 20, 3, '#D9B45A'], [34, 1, 8, 3, '#F0D78C'],
  [36, 10, 4, 4, '#C98A5A'], [35, 14, 6, 7, '#2F2A6B'], [36, 9, 4, 1, '#F0D78C'],
  [12, 17, 3, 3, '#C98A5A'], [11, 20, 5, 5, '#EFE3C2'],
  [4, 3, 1, 1, '#F0D78C'], [68, 5, 1, 1, '#F0D78C'], [60, 2, 1, 1, '#F0D78C'], [18, 6, 1, 1, '#F0D78C'],
];
function courtScene() {
  const wrap = el('div', 'scene');
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 76 30');
  svg.setAttribute('preserveAspectRatio', 'xMidYMax meet');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  for (const [x, y, w, h, fill] of COURT_PX) {
    const r = document.createElementNS(SVG, 'rect');
    for (const [k, v] of Object.entries({ x, y, width: w, height: h, fill })) r.setAttribute(k, v);
    svg.append(r);
  }
  wrap.append(svg);
  return wrap;
}

// ตายก่อนมีตัวเลือกหลังอายุ 18 พอ = ไม่มีแบบชีวิต (titles.mjs) — บอกเหตุแทนช่องว่าง
const NO_PATTERN = { name: 'ยังบอกไม่ได้', hint: 'ชีวิตนี้สั้นเกินกว่าจะเห็นว่าเดินทางไหน' };
// แบบชีวิต/ฉายาคิดครั้งเดียวต่อการ์ดตาย แล้วลงสมุดฉายา — กดย้อน/วาดซ้ำไม่นับซ้ำ
function lifeTitles(card) {
  if (!card.lifeTitles) {
    const t = titlesOf(st);
    card.lifeTitles = { ...t, pattern: t.pattern ?? NO_PATTERN };
    bookAdd(t);
  }
  return card.lifeTitles;
}
const TITLES_SHOWN = 3;

// บันทึกการตาย (ใบ 04): แบบชีวิต 1 + ฉายาเด่น 3 + ปุ่มดูทั้งหมด · ฉายาตระกูลแยกหัวข้อ
function titlesBox(card) {
  const { pattern, titles, family } = lifeTitles(card);
  const box = el('div', 'recap titles');
  box.append(el('div', 'h', 'ชีวิตแบบ'));
  box.append(el('p', 'pattern', pattern.name));
  if (pattern.hint) box.append(el('p', 'note', pattern.hint));
  box.append(el('div', 'h', 'ฉายาเด่น'));
  if (!titles.length) box.append(el('p', 'sub', 'ชีวิตนี้ยังไม่ได้ฉายา'));
  const ul = el('ul', 'picks');
  const rows = titles.map((t) => el('li', null, `${t.name} · ${t.tier}`));
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
    box.append(el('div', 'h', 'ฉายาตระกูล'));
    box.append(list(family.map((t) => t.name), 'picks'));
  }
  box.append(bookBox());
  return box;
}

// สมุดฉายา (ใบ 04): เก็บในเครื่องผู้เล่น · ตัวที่ยังไม่เคยได้เป็น ??? พร้อมคำใบ้
// อ่าน/เขียนพังได้ (โหมดส่วนตัว · ปิด storage) — หน้ายังเล่นได้ สมุดแค่ไม่จำ
const BOOK_KEY = 'next-life-book-v1';
function bookRead() {
  try {
    const b = JSON.parse(localStorage.getItem(BOOK_KEY) ?? '{}');
    return { p: b.p ?? [], t: b.t ?? [], f: b.f ?? [] };
  } catch {
    return { p: [], t: [], f: [] };
  }
}
function bookAdd(t) {
  const b = bookRead();
  const add = (xs, id) => (xs.includes(id) ? xs : [...xs, id]);
  if (t.pattern) b.p = add(b.p, t.pattern.id);
  for (const x of t.titles) b.t = add(b.t, x.id);
  for (const x of t.family) b.f = add(b.f, x.id);
  try {
    localStorage.setItem(BOOK_KEY, JSON.stringify(b));
  } catch {
    // ไม่มีที่เก็บ — สมุดเห็นแค่ชีวิตนี้
  }
}
function bookBox() {
  const b = bookRead();
  const d = el('details', 'book');
  const all = ALL_PATTERNS.length + TITLES.length + FAMILY_TITLES.length;
  d.append(el('summary', null, `สมุดฉายา · เปิดแล้ว ${b.p.length + b.t.length + b.f.length}/${all}`));
  const section = (head, items, got, tierOf) => {
    d.append(el('div', 'h', head));
    d.append(list(items.map((x) => {
      const tier = tierOf ? ` · ${tierOf(x)}` : '';
      return got.includes(x.id) ? `${x.name}${tier}` : `???${tier} — ${x.hint}`;
    }), 'picks'));
  };
  section('ชีวิตแบบที่เคยได้', ALL_PATTERNS, b.p);
  section('ฉายา', [...TITLES].sort((x, y) => TIERS.indexOf(x.tier) - TIERS.indexOf(y.tier)), b.t, (x) => x.tier);
  section('ฉายาตระกูล', FAMILY_TITLES, b.f);
  return d;
}

// ภาพแชร์รับเฉพาะช่องที่ไล่ชื่อไว้ตรงนี้ — บัญชีบุญบาปบนการ์ดตายหลุดลงภาพไม่ได้ แม้แกนเกมจะเติมช่องใหม่ให้การ์ด
function shareFacts(card) {
  const { pattern, titles } = lifeTitles(card);
  return {
    age: card.age,
    name: st.name,
    who: `${st.sex} · ${provinceLabel(st)} · ฐานะ${st.cls}`,
    job: `${card.job}${st.edu ? ` · วุฒิ${st.edu}` : ''}`,
    pattern: { name: pattern.name, hint: pattern.hint ?? '' },
    title: titles[0] ? { name: titles[0].name, tier: titles[0].tier } : null,
    // กราฟบนภาพใช้แค่ค่าสถานะรายปี (ค่าที่จอเห็นอยู่แล้ว) ไล่ช่องเอง ไม่ส่งก้อน card.life ทั้งก้อน
    stats: (card.life?.stats ?? []).map((p) => Object.fromEntries([['age', p.age], ...STAT_KEYS.map((k) => [k, p[k]])])),
    marks: lifeMarks(card.age).map((m) => m.age),
  };
}

// สรุปเป็นข้อความ (B38) — การ์ดตายยังไม่รู้ภพ (รู้ = เผยทิศบัญชีก่อนปรโลก) · การ์ดปรโลกส่ง realm มาเพิ่มบรรทัด
function summaryText(age, realm = null) {
  const t = titlesOf(st);
  return [
    `ชาติหน้า · ${st.name}`,
    `เกิดปี ${st.birthYear} · ${provinceLabel(st)}`,
    `ตายอายุ ${age}`,
    `ชีวิตแบบ${(t.pattern ?? NO_PATTERN).name}`,
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
function copyButton(text) {
  const b = button('คัดลอกสรุป', null, async () => {
    b.firstChild.textContent = (await copyText(text())) ? 'คัดลอกแล้ว' : 'คัดลอกไม่ได้';
  });
  return b;
}

// URL คงที่ ไม่ใช้ location.href — เปิดจากไฟล์ในเครื่องแล้ว path ในเครื่องจะติดไปกับภาพ
const SHARE_URL = 'dmo-hub.github.io/next-life';
// 9:16 (สตอรี่) — 4:5 เดิมไม่มีที่ให้กราฟ
const SHARE_W = 1080, SHARE_H = 1920;
// สีเส้นชุดเดียวกับ .b .ln0–4 ใน template — canvas อ่าน class ไม่ได้
const SHARE_LINES = ['#E07A5F', '#D9B45A', '#8FB3E0', '#7FC4B8', '#EFE3C2'];
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
      Promise.all(SHARE_FONTS.map((f) => document.fonts.load(f, 'ชาติหน้า NEXT LIFE 0123456789?'))),
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
      ctx.fillText(line, cx, y);
    }
    y += gap;
  };
  const rule = (gap) => {
    y += gap;
    ctx.strokeStyle = c('bronze');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 180, y);
    ctx.lineTo(cx + 180, y);
    ctx.stroke();
    y += gap;
  };

  y = 130;
  text('ชาติหน้า', '700 110px Srisakdi, serif', c('gold'), 120, 0, 1);
  text('NEXT LIFE', '600 28px Sarabun, sans-serif', c('sand'), 44, 0, 1);
  rule(44);
  text(facts.name, '700 72px Srisakdi, serif', c('cream'), 84, 4, 1);
  text(`ตายอายุ ${facts.age}`, '700 96px Srisakdi, serif', c('gold2'), 110, 16, 1);
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
  // กราฟอยู่ล่างสุด ยึดจากขอบล่าง — ข้อความข้างบนยาวแค่ไหนก็ไม่ทับกัน (ข้อความถูกจำกัดบรรทัดไว้แล้ว)
  if (facts.stats.length >= 2) shareChart(ctx, c, facts, 120, SHARE_H - 440, SHARE_W - 240, 240);
  ctx.font = '400 30px Sarabun, sans-serif';
  ctx.fillStyle = c('sand');
  ctx.fillText(SHARE_URL, cx, SHARE_H - 72);

  return new Promise((ok, fail) => cv.toBlob((b) => (b ? ok(b) : fail(new Error('canvas toBlob ว่าง'))), 'image/png'));
}

// กราฟทั้งชีวิตบนภาพ (B38) — แบบเดียวกับ lifeChart บนจอ: แถบช่วงวัย · 5 เส้นสี+ลายเส้น · จุดเรื่องเด่น · จุดตาย · ไม่มีตัวเลขค่าสถานะ
function shareChart(ctx, c, facts, x0, y0, w, h) {
  const end = Math.max(facts.age, 1);
  const x = (a) => x0 + (a / end) * w;
  const y = (v) => y0 + ((100 - v) / 100) * h;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '600 28px Sarabun, sans-serif';
  ctx.fillStyle = c('gold');
  ctx.fillText(`ทั้งชีวิต · อายุ 0–${facts.age}`, x0 + w / 2, y0 - 56);
  ctx.font = '400 22px Sarabun, sans-serif';
  STAGES.forEach((s, i) => {
    const a = s.from, b = Math.min(STAGES[i + 1]?.from ?? Infinity, facts.age);
    if (b <= a) return;
    if (i % 2 === 0) {
      ctx.fillStyle = 'rgba(90, 70, 48, 0.35)';
      ctx.fillRect(x(a), y0, x(b) - x(a), h);
    }
    if (x(b) - x(a) >= 90) {
      ctx.fillStyle = c('sand');
      ctx.fillText(s.name, (x(a) + x(b)) / 2, y0 - 12);
    }
  });
  ctx.strokeStyle = c('bronze2');
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  for (const v of [0, 50, 100]) {
    ctx.beginPath();
    ctx.moveTo(x0, y(v));
    ctx.lineTo(x0 + w, y(v));
    ctx.stroke();
  }
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  STAT_KEYS.forEach((k, i) => {
    ctx.strokeStyle = SHARE_LINES[i];
    ctx.setLineDash(LINE_DASH[i] ? LINE_DASH[i].split(' ').map((n) => Number(n) * 2.5) : []);
    ctx.beginPath();
    facts.stats.forEach((p, j) => (j ? ctx.lineTo(x(p.age), y(p[k])) : ctx.moveTo(x(p.age), y(p[k]))));
    ctx.stroke();
  });
  ctx.setLineDash([]);
  ctx.fillStyle = c('gold2');
  for (const a of facts.marks) {
    ctx.beginPath();
    ctx.arc(x(a), y0 + h - 12, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#E07A5F';
  ctx.beginPath();
  ctx.arc(x(facts.age), y0 + h - 12, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = c('sand');
  for (const [a, al] of [[0, 'left'], [facts.age, 'right']]) {
    ctx.textAlign = al;
    ctx.fillText(`อายุ ${a}`, x(a), y0 + h + 34);
  }
  // คำอธิบายเส้นแถวเดียว จัดกลาง — ความกว้างวัดจริง ฟอนต์สำรองกว้างต่างกัน
  ctx.font = '400 24px Sarabun, sans-serif';
  const items = STAT_KEYS.map((k, i) => ({ i, label: STAT_LABELS[k], w: 44 + ctx.measureText(STAT_LABELS[k]).width + 28 }));
  let lx = x0 + w / 2 - items.reduce((s, it) => s + it.w, 0) / 2;
  const ly = y0 + h + 76;
  ctx.textAlign = 'left';
  ctx.lineWidth = 4;
  for (const it of items) {
    ctx.strokeStyle = SHARE_LINES[it.i];
    ctx.setLineDash(LINE_DASH[it.i] ? LINE_DASH[it.i].split(' ').map((n) => Number(n) * 1.5) : []);
    ctx.beginPath();
    ctx.moveTo(lx, ly - 8);
    ctx.lineTo(lx + 36, ly - 8);
    ctx.stroke();
    ctx.fillStyle = c('cream');
    ctx.fillText(it.label, lx + 44, ly);
    lx += it.w;
  }
  ctx.restore();
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
      await navigator.share({ files: [file], title: 'ชาติหน้า · Next Life', text: `ชาติหน้า · ${st.name} ตายอายุ ${card.age} — ${SHARE_URL}` });
    } catch (e) {
      // ผู้เล่นปิดหน้าแชร์เอง = จบ · แชร์พังด้วยเหตุอื่น เปิดภาพในแท็บใหม่ให้กดค้างบันทึก (มือถือที่โหลดไฟล์ไม่ได้) · แท็บโดนบล็อกจึงโหลดไฟล์
      if (e?.name !== 'AbortError') openOrDownload(blob, name);
    }
  });
  return [share, save];
}

function button(label, fx, onclick, hint = null) {
  const b = el('button', 'choice');
  const main = el('span', null, label);
  // อยู่ในก้อนเดียวกับข้อความตัวเลือก ป้ายผลด้านขวาจึงยังชิดขวาเหมือนการ์ดที่ไม่มีบรรทัดรอง
  if (hint) main.append(el('small', 'hint', hint));
  b.append(main);
  if (fx) {
    // ป้ายแต่ละค่าเป็นก้อนเดียว ตัดบรรทัดได้แค่ระหว่างก้อน — ไม่งั้นคำไทยหักกลางคำ
    const tag = el('span', 'fx');
    fx.split(' · ').forEach((part, i) => tag.append(...(i ? [' · '] : []), el('span', null, part)));
    b.append(tag);
  }
  b.onclick = onclick;
  return b;
}

// ปุ่มลัด: ตัวเลือกที่ i ได้เลข i+1 (ถึง 9) · Enter กดปุ่มเดินเรื่องปุ่มเดียวของการ์ด
// เลขต้องติดที่ป้ายด้วย: attr() ใน ::before อ่านจากตัวที่ถือ pseudo (span) ไม่ใช่ปุ่ม
const keyed = (b, i) => {
  if (i < 9) b.dataset.key = b.firstChild.dataset.key = String(i + 1);
  return b;
};
const enter = (b) => {
  b.dataset.enter = '';
  return b;
};
document.addEventListener('keydown', (e) => {
  // กดค้าง = repeat — ไม่นับ ไม่งั้นเลือกรัวข้ามการ์ด
  if (e.repeat || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  const t = e.target;
  if (t.closest?.('input, textarea, select, [contenteditable]')) return;
  let b;
  if (e.key === 'Enter') {
    // โฟกัสอยู่ที่ปุ่ม/หัวข้อพับ ให้ Enter ทำงานของตัวนั้น (แชร์ภาพ · สมุดฉายา · ผังตระกูล)
    if (t.closest?.('button, summary, a')) return;
    b = root.querySelector('.choices [data-enter]');
  } else {
    // อ่านตำแหน่งปุ่ม ไม่ใช่ตัวอักษร — แป้นไทยแถวเลขพิมพ์ ๅ / - ภ ถ ไม่ใช่ 1–5
    const m = /^(?:Digit|Numpad)([1-9])$/.exec(e.code);
    if (m) b = root.querySelector(`.choices button[data-key="${m[1]}"]`);
  }
  if (!b || b.disabled) return;
  e.preventDefault();
  b.click();
});

// แนวการ์ดตามประเภทเหตุการณ์ (ใบ 06): ลางกับเหตุการณ์ความเชื่อเป็นทาง B ที่เหลือเป็นทาง A
const styleOf = (card) => (card.kind === 'omen' || ((card.kind === 'event' || card.kind === 'result') && card.type === 'B') ? 'b' : 'a');

const KICKER = { intro: 'เปิดชีวิต', stage: 'เปลี่ยนช่วงชีวิต', era: 'บ้านเมือง', omen: 'ลาง', alloc: 'เงินเก็บ', result: 'ผลที่ตามมา' };

function render(card) {
  root.replaceChildren();
  const s = statsOf(st);
  // ปีเกมใช้ภายในเท่านั้น หน้าจอบอกแค่อายุ (B14 ข้อ 12)
  const year = st.birthYear + card.age;
  const box = el('article', `card ${styleOf(card)}`);
  const top = el('div', 'top');
  const body = el('div', 'body');
  const choices = el('div', 'choices');
  const next = () => play(T.next);

  if (card.kind === 'death') {
    top.append(el('b', null, 'มรณบัตร'), el('small', null, `${genLabel()}${st.name} · สิริอายุ ${card.age} ปี`));
    box.append(top);
    body.append(el('span', 'stamp', 'ถึงแก่กรรม'));
    body.append(el('h3', null, `${st.name} ตายอายุ ${card.age}`));
    body.append(el('p', null, `${st.sex} · ${provinceLabel(st)} · ฐานะ${st.cls} · ${card.job}${st.edu ? ` · วุฒิ${st.edu}` : ''}`));
    const net = card.summary.money < 0 ? 'ตายพร้อมหนี้' : 'ทรัพย์สุทธิ';
    body.append(el('p', 'sub', `${net} ${baht(card.summary.money)}`));
    if (card.summary.debt) body.append(el('p', 'sub', `หนี้ผ่อนค้าง ${baht(card.summary.debt)}`));
    if (card.summary.bankruptcies) body.append(el('p', 'sub', `เคยล้มละลาย ${card.summary.bankruptcies} ครั้ง`));
    if (card.note) body.append(el('p', 'sub', card.note));
    if (card.funeral) body.append(el('p', 'sub', `งานศพ: ${card.funeral.text} · แขกมาส่งราว ${card.funeral.guests.toLocaleString('en-US')} คน${card.funeral.cost ? ` · ค่าใช้จ่าย ${baht(card.funeral.cost)}` : ''}`));
    if (card.will !== undefined) body.append(el('p', 'sub', card.will ? 'มีพินัยกรรม ทายาทแบ่งทรัพย์ตามที่สั่งไว้' : 'ไม่มีพินัยกรรม ทายาทแบ่งทรัพย์กันเองจนผิดใจกัน'));
    body.append(titlesBox(card));
    const tree = familyTree();
    if (tree) body.append(tree);
    // บัญชีบุญบาปเฉลยที่ปรโลกในระหว่างชาติ ไม่ใช่การ์ดตาย · กราฟทั้งชีวิตแทนสรุปช่วงวัยสุดท้าย (B38a) ชีวิตสั้นก็มีกราฟ
    const chart = card.life && lifeChart(card.life, card.age);
    if (chart) body.append(chart);
    choices.append(enter(button('ไปช่วงระหว่างชาติ', null, () => play(T.afterlife))), ...shareButtons(card), copyButton(() => summaryText(card.age)));
  } else {
    const head = el('b', null, card.funeral ? `จากไปอายุ ${card.age}` : `อายุ ${card.age} · ช่วง${card.stage}`);
    // การ์ดผลเป็นผลของใบก่อนอยู่แล้ว ป้ายซ้ำไม่บอกอะไรเพิ่ม · งานศพเกิดหลังตายจึงไม่ใช่ "ปีเดียวกัน" ของชีวิต
    if (card.kind !== 'result' && !card.funeral && card.age === prevAge) head.append(el('span', 'same', 'ปีเดียวกัน'));
    top.append(head, el('small', null, `${genLabel()}${st.name} · ${provinceLabel(st)}`));
    box.append(top, stats(s), statHelp());
    // ไม่มีรายได้ก็ต้องเห็นเงินติดตัวเสมอแม้ 0 · มีงานทำแล้วซ่อนเงินติดตัวเฉพาะตอนเป็น 0 พอดี ติดลบ (หนี้) ยังต้องเห็น
    // เงินกู้เป็นยอดค้างของสัญญา ไม่ใช่เงินติดตัวติดลบ จึงแยกช่อง ไม่หักรวมกัน
    const working = isWorking(st, card.age);
    const debt = Math.round(totalDebt(st));
    const purse = [
      (!working || s.money !== 0) && `เงินติดตัว ${baht(s.money)}`,
      working && `รายได้ ${baht(monthlyIncome(st, year))}/เดือน`,
      debt > 0 && `เงินกู้ ${baht(debt)}`,
    ].filter(Boolean);
    const meta = el('div', 'meta', `ฐานะ${st.cls} · ${jobText(st, card.age)}`);
    // จอแคบให้ตัดบรรทัดได้แค่ที่ตัวคั่น — เบราว์เซอร์ตัดคำไทยกลาง "ราย|ได้" ได้แม้เว้นวรรคแบบไม่ตัด จึงต้องห่อ span
    for (const t of purse) meta.append(' · ', el('span', null, t));
    box.append(meta);
    const fam = familyPanel();
    if (fam) box.append(fam);
    const tree = familyTree();
    if (tree) box.append(tree);
    const kicker = card.kind === 'event' ? (card.funeral ? 'งานศพ' : card.national ? KICKER.era : `ช่วง${card.stage}`) : KICKER[card.kind];
    // ข่าวบ้านเมืองที่รวมกับการ์ดรับมือ (B58): ชื่อเหตุการณ์ต่อท้ายป้าย · เรื่องข่าวเป็นบรรทัดนำก่อนเรื่องของเรา
    body.append(el('span', 'kicker', card.news ? `${kicker} · ${card.news.text}` : kicker));
    if (card.news?.story) body.append(el('p', 'news', card.news.story));

    if (card.kind === 'intro') {
      body.append(el('span', 'stamp', 'แรกเกิด'));
      body.append(el('h3', 'lead', card.text));
      body.append(el('p', 'horo', horoscope(st)));
      // บรรทัดแรกเป็นเรื่องของบ้าน · ที่เหลือเป็นบรรยากาศยุค ตัวรอง
      card.story.forEach((p, i) => body.append(el('p', i ? 'sub' : null, p)));
      if (card.inherit.length) {
        const box = el('div', 'recap');
        box.append(el('div', 'h', 'สิ่งที่สืบทอดจากชาติก่อน'), list(card.inherit, 'picks'));
        if (card.lineage.length) box.append(el('div', 'h', 'ผังตระกูล'), list(card.lineage, 'picks'));
        body.append(box);
      }
      choices.append(enter(button('ต่อไป', null, next)));
      if (canReroll()) choices.append(button('ขอเกิดใหม่', 'ได้ครั้งเดียว', reroll));
    } else if (card.kind === 'stage') {
      body.append(el('span', 'stamp', card.text));
      body.append(recap(card.recap));
      choices.append(enter(button('ต่อไป', null, next)));
    } else if (card.kind === 'era' || card.kind === 'omen' || card.kind === 'result') {
      body.append(el('h3', null, card.text));
      if (card.story) body.append(el('p', null, card.story));
      choices.append(enter(button('ต่อไป', null, next)));
    } else {
      if (card.title) body.append(el('h3', null, card.title));
      body.append(el(card.title ? 'p' : 'h3', card.title ? null : 'lead', card.text));
      if (card.items?.length) body.append(list(card.items));
      if (card.disclaimer) body.append(el('p', 'note', card.disclaimer));
      card.choices.forEach((c, i) => {
        const why = card.locked?.[i];
        // ตัวเลือกที่ล็อกยังแสดงให้เห็นทางที่พลาด · ป้ายผลแทนด้วยเหตุผลที่กดไม่ได้
        const b = keyed(button(c, why ?? card.fx?.[i], () => play(lifePick(i)), card.hints?.[i]), i);
        if (why) b.disabled = true;
        choices.append(b);
      });
      // การ์ดเล่าเรื่อง (choices: []) ไม่มีปุ่มให้เลือก — ต้องมีทางไปใบถัดไป
      if (!card.choices.length) choices.append(enter(button('ต่อไป', null, next)));
    }
  }
  box.append(body, choices);
  root.append(box);
}

const genLabel = () => (st.gen > 1 ? `รุ่นที่ ${st.gen} · ` : '');

// แผงครอบครัว (B36c): คนรอบตัวตอนนี้ แยกจากผังตระกูลที่เล่ารุ่นก่อน · อ่านอย่างเดียว ไม่มี token ในเซฟ
// ใช้เฉพาะช่องที่ไล่ชื่อไว้ข้างล่าง — แกนเติมช่องใหม่ในสมาชิกก็ไม่หลุดขึ้นจอ · bond บอกเป็นป้ายคำ ไม่ใช่ตัวเลข
const FAMILY_ORDER = ['parent', 'spouse', 'child', 'grandchild', 'pet', 'peer'];
const kinWord = (m) => {
  const male = m.sex === 'ชาย';
  if (m.role === 'parent') return male ? 'พ่อ' : 'แม่';
  if (m.role === 'spouse') return m.left ? 'อดีตคู่' : male ? 'สามี' : 'ภรรยา';
  if (m.role === 'child') return male ? 'ลูกชาย' : 'ลูกสาว';
  if (m.role === 'grandchild') return male ? 'หลานชาย' : 'หลานสาว';
  if (m.role === 'pet') return m.kind ?? 'สัตว์เลี้ยง';
  return 'เพื่อนรุ่น';
};
// พับ/กางค้างไว้ข้ามการ์ด — การ์ดวาดใหม่ทุกใบ ไม่งั้นผู้เล่นต้องกางซ้ำทุกครั้ง (ค่าหน้าจอ ไม่อยู่ในเซฟ)
let familyOpen = false;
function familyPanel() {
  const all = familyOf(st);
  if (!all.length) return null;
  const rank = (m) => FAMILY_ORDER.indexOf(m.role) * 2 + (m.alive ? 0 : 1);
  const rows = all
    .map((m, i) => ({ m, i }))
    .sort((a, b) => rank(a.m) - rank(b.m) || (a.m.order ?? 0) - (b.m.order ?? 0) || a.i - b.i)
    .map(({ m }) => {
      const who = m.name ? `${kinWord(m)} · ${m.name}` : kinWord(m);
      if (!m.alive) return { text: `${who} · ${m.diedAge != null ? `จากไปตอนอายุ ${m.diedAge}` : 'จากไปแล้ว'}`, gone: true };
      const parts = [who, m.age != null && `อายุ ${m.age}`, m.left ? 'แยกทางแล้ว' : m.bondLevel].filter(Boolean);
      return { text: parts.join(' · '), gone: false };
    });
  const alive = all.filter((m) => m.alive).length;
  const d = el('details', 'family');
  d.open = familyOpen;
  d.addEventListener('toggle', () => (familyOpen = d.open));
  const ul = el('ul', 'picks');
  for (const r of rows) ul.append(el('li', r.gone ? 'gone' : null, r.text));
  d.append(el('summary', null, `ครอบครัว · ยังอยู่ ${alive} ${alive === all.length ? 'คน' : `จาก ${all.length} คน`}`), ul);
  return d;
}

// ผังตระกูลพับได้ (ใบ 05 เลิกเมื่อไรก็ดูได้) — มีเมื่อเป็นรุ่นที่ 2 ขึ้นไป
function familyTree() {
  if (!st.lineage.length) return null;
  const d = el('details', 'tree');
  d.append(el('summary', null, `ผังตระกูล · ${st.lineage.length} รุ่นก่อน`), list(lineageText(st.lineage), 'picks'));
  return d;
}

// ช่วงที่ 7 (ใบ 05 · 09): การ์ดลายรดน้ำทุกใบ · ไม่มีแถบค่าสถานะ — ชีวิตจบแล้ว
const AFTER_KICKER = { transfer: 'ส่วนบุญจากคนข้างหลัง', devaduta: 'ปรโลก', realm: 'ภูมิปลายทาง', ancestor: 'ผีบรรพบุรุษ' };
const AFTER_TOP = { verdict: 'ปรโลก', path: 'ทางเกิด', carry: 'ส่งไปเกิด', result: 'ผลที่ตามมา' };
function renderAfter(card) {
  root.replaceChildren();
  const box = el('article', 'card b');
  const top = el('div', 'top');
  top.append(el('b', null, 'ระหว่างชาติ'), el('small', null, `${genLabel()}${st.name} · ตายอายุ ${st.age}`));
  const body = el('div', 'body');
  const choices = el('div', 'choices');
  const next = () => play(T.afterNext);
  const court = card.kind === 'verdict' || card.scene === 'devaduta';
  body.append(el('span', 'kicker', card.kind === 'scene' ? AFTER_KICKER[card.scene] : AFTER_TOP[card.kind]));
  if (card.title) body.append(el('h3', null, card.title));
  if (card.kind === 'verdict') body.append(el('h3', null, `ภูมิ${card.realm}`));
  body.append(el(card.title || card.kind === 'verdict' ? 'p' : 'h3', card.title || card.kind === 'verdict' ? null : 'lead', card.text));
  if (card.reckoning) body.append(reckoningBox(card.reckoning, af.st.deeds));
  if (card.lineage) {
    body.append(el('div', 'kicker', 'ผังตระกูล'));
    body.append(list(card.lineage, 'picks'));
  }
  if (card.note) body.append(el('p', 'note', card.note));
  if (card.done) {
    choices.append(enter(button('ไปเกิด', null, () => play(T.rebirth))));
    choices.append(button('เริ่มตระกูลใหม่', null, start));
  } else if (card.choices.length) {
    card.choices.forEach((c, i) => {
      const why = card.locked?.[i];
      const b = keyed(button(c, why ?? card.fx?.[i], () => play(afterPick(i)), card.hints?.[i]), i);
      if (why) b.disabled = true;
      choices.append(b);
    });
  } else choices.append(enter(button('ต่อไป', null, next)));
  if (card.kind === 'verdict') choices.append(copyButton(() => summaryText(st.age, card.realm)));
  box.append(top);
  if (court) box.append(courtScene());
  box.append(body, choices);
  root.append(box);
}

// เซฟ = seed ต้นตระกูล + ลำดับปุ่มที่กด แล้วเล่นซ้ำตอนโหลด — แกนเกมให้ผลเดิมทุกครั้งเมื่อ seed กับการกดเท่ากัน
// (ทายาทได้ seed จากชาติก่อน) จึงไม่ต้องเก็บ st ที่มี rng ข้างใน และใน storage ไม่มีแต้มบุญบาปให้เปิดอ่าน
const SAVE_KEY = 'next-life-save-v1';
// ปุ่มละตัวอักษร: เลือกในชีวิต = 0-9a-z · เลือกระหว่างชาติ = A-Z · ที่เหลือเป็นเครื่องหมาย
const T = { next: '.', afterlife: '>', afterNext: ',', rebirth: '+' };
const lifePick = (i) => i.toString(36);
const afterPick = (i) => String.fromCharCode(65 + i);
let save = null;

// อายุของการ์ดชีวิตใบก่อน/ใบนี้ — จำใน apply ไม่ใช่ตอนวาด เพราะเล่นซ้ำจากเซฟไม่ได้วาดทุกใบ
let curAge = null;
function track(card) {
  if (af) return card;
  prevAge = curAge;
  curAge = card.age;
  return card;
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
    st = nextLife(af);
    af = null;
    curAge = null;
    return nextCard(st);
  }
  if (/^[A-Z]$/.test(tok)) {
    chooseAfter(af, tok.charCodeAt(0) - 65);
    return nextAfterCard(af);
  }
  if (!/^[0-9a-z]$/.test(tok)) throw new Error(`ปุ่มในเซฟไม่รู้จัก: ${tok}`);
  choose(st, parseInt(tok, 36));
  return nextCard(st);
}

// ลายนิ้วมือของการ์ดที่ค้างอยู่ — เนื้อเรื่องเปลี่ยนแล้วเล่นซ้ำได้การ์ดคนละใบ ต้องจับได้ ไม่ใช่พาไปโผล่ชีวิตอื่นเงียบ ๆ
function fingerprint(card) {
  const s = JSON.stringify([st.gen, card.kind, card.age ?? st.age, card.title, card.text, card.choices]);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(36);
}

// storage พังได้ (โหมดส่วนตัว · เต็ม · ปิด) — เกมยังเล่นได้ แค่ไม่จำ · ป้ายหัวเว็บบอกผู้เล่นว่าจำอยู่หรือไม่ (B77)
// v = เวอร์ชันที่เขียน — เนื้อหาเปลี่ยนแล้วเซฟเล่นซ้ำไม่ตรง ต้องรู้ว่าจะพากลับไปหน้าเวอร์ชันไหน
function saveWrite(card) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ seed: save.seed, log: save.log, fp: fingerprint(card), v: APP_VERSION, ...(save.rr && { rr: 1 }) }));
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
function saveClear() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ไม่มีที่เก็บ ก็ไม่มีเซฟให้ลบ
  }
}

const show = (card) => (af ? renderAfter(card) : render(card));

function play(tok) {
  const card = apply(tok);
  save.log += tok;
  saveWrite(card);
  show(card);
}

function begin(seed) {
  st = newLife(seed, CONTENT);
  af = null;
  save = { seed, log: '' };
  curAge = null;
  return track(nextCard(st));
}

// seed จากเวลาเฉพาะฝั่งหน้าเว็บ แกนเกมเองไม่แตะนาฬิกา
const freshSeed = () => (Date.now() ^ (performance.now() * 1000)) >>> 0;

// หน้าเวอร์ชันเก่า (docs/v/) มีไว้เล่นตระกูลที่ค้างให้จบ — ตระกูลใหม่ต้องเริ่มที่เวอร์ชันล่าสุด
// ไม่งั้นเซฟใหม่ติดเลขเวอร์ชันเก่า หน้าล่าสุดจะส่งกลับมาที่นี่วนไป
const ARCHIVE = /\/v\/v\d+\.\d+\.\d+\.html$/.test(location.pathname);
function start() {
  if (ARCHIVE) {
    saveClear();
    location.href = '../play.html';
    return;
  }
  const card = begin(freshSeed());
  saveWrite(card);
  render(card);
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
    for (const tok of s.log) card = apply(tok);
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
  top.append(el('b', null, 'ชาติหน้า'), el('small', null, title));
  const body = el('div', 'body');
  lines.forEach((t, i) => body.append(el(i ? 'p' : 'h3', i ? 'sub' : 'lead', t)));
  const choices = el('div', 'choices');
  box.append(top, body, choices);
  root.append(box);
  return choices;
}

// ล้างเซฟ = ลบทั้งตระกูล จึงถามซ้ำก่อน · สมุดฉายาแยก key ไม่โดนล้าง
function confirmNew(back) {
  const choices = homeCard('เริ่มตระกูลใหม่', ['ลบชีวิตที่ค้างไว้ทั้งตระกูล?', 'ผังตระกูลและสิ่งที่สืบทอดจะหายทั้งหมด กู้คืนไม่ได้ · สมุดฉายายังอยู่']);
  choices.append(button('ลบแล้วเริ่มตระกูลใหม่', null, start), button('ยกเลิก', null, back));
}

function home(card) {
  const where = af ? `ระหว่างชาติ หลังตายอายุ ${st.age}` : `อายุ ${st.age} · ${provinceLabel(st)}`;
  const choices = homeCard('เล่นต่อ', ['มีชีวิตที่เล่นค้างไว้', `${genLabel()}${st.name} · ${where}`]);
  choices.append(enter(button('เล่นต่อ', null, () => show(card))), button('เริ่มตระกูลใหม่', null, () => confirmNew(() => home(card))));
}

// เซฟจากเวอร์ชันที่เนื้อหาต่างกัน (B77): ไม่ทิ้ง — พาไปเล่นต่อในหน้าของเวอร์ชันนั้นที่เก็บไว้ (docs/v/)
// เซฟก่อนมีเลขเวอร์ชัน: ลองเปิดหน้าเก่าทีละเวอร์ชัน (ใหม่ → เก่า) ใน iframe ซ่อน หน้าที่ขึ้น "เล่นต่อ" คือเวอร์ชันของเซฟ
// หน้าเก่าเปิดเซฟที่ไม่ใช่ของตัวเองแล้วแค่วาดการ์ด ไม่เขียนทับ — ลองได้โดยเซฟไม่เสีย
const PROBE_MS = 20000;
async function archiveList() {
  try {
    const r = await fetch('v/index.json', { cache: 'no-store' });
    return r.ok ? await r.json() : [];
  } catch {
    return [];
  }
}
function probe(ver) {
  return new Promise((ok) => {
    const f = el('iframe');
    f.hidden = true;
    f.setAttribute('aria-hidden', 'true');
    const done = (hit) => {
      clearTimeout(t);
      f.remove();
      ok(hit);
    };
    const t = setTimeout(() => done(false), PROBE_MS);
    f.onload = () => {
      let hit = false;
      try {
        hit = f.contentDocument.querySelector('.card .top small')?.textContent === 'เล่นต่อ';
      } catch {
        // เปิดจากไฟล์ในเครื่อง iframe อ่านข้ามกันไม่ได้
      }
      done(hit);
    };
    f.src = `v/${ver}.html`;
    document.body.append(f);
  });
}
async function oldSave(s) {
  const lost = () => {
    const choices = homeCard('เซฟเก่า', ['ชีวิตที่ค้างไว้เล่นต่อไม่ได้', 'หาหน้าเกมเวอร์ชันที่เล่นค้างไว้ไม่เจอ · สมุดฉายายังอยู่']);
    choices.append(button('เริ่มตระกูลใหม่', null, () => confirmNew(() => oldSave(s))));
  };
  if (ARCHIVE) return lost();
  homeCard('เซฟจากเวอร์ชันก่อน', ['กำลังหาชีวิตที่เล่นค้างไว้…', 'เกมอัปเดตเนื้อเรื่องตั้งแต่เล่นครั้งก่อน']);
  const list = (await archiveList()).filter((v) => v !== APP_VERSION);
  let ver = s.v && list.includes(s.v) ? s.v : null;
  if (!ver && !s.v) for (const v of list) if (await probe(v)) { ver = v; break; }
  if (!ver) return lost();
  const choices = homeCard('เซฟจากเวอร์ชันก่อน', ['มีชีวิตที่เล่นค้างไว้', `เกมอัปเดตเนื้อเรื่องแล้ว ชีวิตนี้เล่นต่อได้ในเวอร์ชัน ${ver} จนจบตระกูล แล้วตระกูลใหม่จะกลับมาเวอร์ชันล่าสุด`]);
  choices.append(enter(button(`เล่นต่อในเวอร์ชัน ${ver}`, null, () => (location.href = `v/${ver}.html`))), button('เริ่มตระกูลใหม่', null, () => confirmNew(() => oldSave(s))));
}

function boot() {
  if (ARCHIVE) document.getElementById('appVer')?.append(' · เวอร์ชันเก่า');
  const s = saveRead();
  if (!s) return start();
  const card = resume(s);
  if (card) {
    savedMark(true);
    return home(card);
  }
  oldSave(s);
}

boot();
