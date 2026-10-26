import { newLife, nextCard, choose, statsOf, provinceLabel, STAT_LABELS, STAT_KEYS, isWorking, monthlyIncome, jobText, totalDebt, startAfterlife, nextAfterCard, chooseAfter, nextLife, lineageText, titlesOf, stageSummary, ALL_PATTERNS, TITLES, FAMILY_TITLES, TIERS } from '../engine/index.mjs';

// เลขเวอร์ชันเดโม — เขียนทับโดย `npm run bump` (patch +1 · `npm run bump -- minor` = minor +1 patch 00) ห้ามแก้รูปแบบบรรทัด
const APP_VERSION = 'v0.2.29';
const APP_BUILD = '2026-10-26';

const root = document.getElementById('app');
document.getElementById('appVer').textContent = `${APP_VERSION} · ${APP_BUILD}`;
let st;
// ระหว่างชาติของชีวิตที่เพิ่งจบ (null = ยังมีชีวิต)
let af = null;

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

// กราฟเงินของช่วงที่ผ่านไป — แกนตั้งรวมศูนย์เสมอ ส่วนต่างเล็กจึงดูเล็ก · viewBox คงสัดส่วนให้ตัวหนังสือไม่บิด
// จุดเดียวไม่มีเส้นให้วาด
function sparkline(series, fromAge, toAge) {
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
  if (lo < 0) svg.append(svgEl('rect', { class: 'neg', x: L, y: y(0), width: W - L - R, height: y(lo) - y(0) }));
  for (let v = lo; v <= hi + step / 2; v += step) {
    svg.append(svgEl('line', { class: v === 0 ? 'zero' : 'grid', x1: L, x2: W - R, y1: y(v), y2: y(v) }));
    svg.append(svgEl('text', { class: 'ty', x: L - 4, y: y(v) + 3.5 }, v === 0 ? '0' : shortBaht(v)));
  }
  // จุดสุดท้ายคือเงินตอนสิ้นอายุ toAge — ป้ายจึงยึดช่วงอายุเดียวกับหัวกล่อง ไม่นับจากจำนวนจุด
  const ageX = (a) => L + ((a - fromAge) / Math.max(toAge - fromAge, 1)) * (W - L - R);
  const ages = toAge - fromAge >= 10 ? [fromAge, Math.round((fromAge + toAge) / 2), toAge] : [fromAge, toAge];
  const anchor = (a) => (a === fromAge ? 'start' : a === toAge ? 'end' : 'middle');
  for (const a of ages) svg.append(svgEl('text', { class: 'tx', x: ageX(a), y: H - 6, 'text-anchor': anchor(a) }, `อายุ ${a}`));
  const path = (vals, cls) => svgEl('polyline', { class: cls, points: vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ') });
  svg.append(path(nom, 'nom'));
  for (const i of [0, series.length - 1]) svg.append(svgEl('circle', { class: 'dot', cx: x(i), cy: y(nom[i]), r: 3 }));
  return svg;
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

// เฉลยบัญชีบุญบาปที่ศาลพญายม (ใบ 09) — ระหว่างชีวิตผู้เล่นไม่เคยเห็นตัวเลขนี้
// วางเป็นตาชั่งสองฝั่ง (ต้นแบบการ์ดศาล) — ฝั่งที่หนักกว่าได้ขอบทอง ผู้เล่นเห็นทิศก่อนอ่านตัวเลข
function reckoningBox(r) {
  const box = el('div', 'recap');
  box.append(el('div', 'h', 'บัญชีบุญบาป เฉลยที่ศาลพญายม'));
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
  return box;
}

// แถบภาพพิกเซลศาลพญายม (ต้นแบบการ์ด B2) — ทำเครื่องหมายฉากศาลให้ต่างจากการ์ดระหว่างชาติใบอื่น
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

// ตายก่อนมีตัวเลือกหลังอายุ 18 พอ = ไม่มีลวดลาย (titles.mjs) — บอกเหตุแทนช่องว่าง
const NO_PATTERN = { name: 'ยังไม่ทันเห็นลวดลาย', hint: 'ชีวิตนี้สั้นเกินกว่าจะเห็นว่าเดินทางไหน' };
// ลวดลาย/ฉายาคิดครั้งเดียวต่อการ์ดตาย แล้วลงสมุดฉายา — กดย้อน/วาดซ้ำไม่นับซ้ำ
function lifeTitles(card) {
  if (!card.lifeTitles) {
    const t = titlesOf(st);
    card.lifeTitles = { ...t, pattern: t.pattern ?? NO_PATTERN };
    bookAdd(t);
  }
  return card.lifeTitles;
}
const TITLES_SHOWN = 3;

// บันทึกการตาย (ใบ 04): ลวดลาย 1 + ฉายาเด่น 3 + ปุ่มดูทั้งหมด · ฉายาตระกูลแยกหัวข้อ
function titlesBox(card) {
  const { pattern, titles, family } = lifeTitles(card);
  const box = el('div', 'recap titles');
  box.append(el('div', 'h', 'ลวดลายชีวิต'));
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
  section('ลวดลายชีวิต', ALL_PATTERNS, b.p);
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
  };
}

// URL คงที่ ไม่ใช้ location.href — เปิดจากไฟล์ในเครื่องแล้ว path ในเครื่องจะติดไปกับภาพ
const SHARE_URL = 'dmo-hub.github.io/next-life';
const SHARE_W = 1080, SHARE_H = 1350;
const SHARE_FONTS = ['700 110px Srisakdi', '400 40px Sarabun', '600 30px Sarabun'];
const FONT_WAIT_MS = 3000;

// ไทยไม่เว้นวรรคระหว่างคำ ตัดบรรทัดตามขอบเขตคำจาก Intl.Segmenter · เบราว์เซอร์ที่ไม่มีตัดรายตัวอักษร
function wrapThai(ctx, text, maxW) {
  const parts = typeof Intl.Segmenter === 'function'
    ? [...new Intl.Segmenter('th', { granularity: 'word' }).segment(text)].map((s) => s.segment)
    : [...text];
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
  const text = (s, font, color, lineH, gap = 0) => {
    ctx.font = font;
    ctx.fillStyle = color;
    for (const line of wrapThai(ctx, s, maxW)) {
      y += lineH;
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

  y = 110;
  text('ชาติหน้า', '700 110px Srisakdi, serif', c('gold'), 120);
  text('NEXT LIFE', '600 28px Sarabun, sans-serif', c('sand'), 44);
  rule(44);
  text(facts.name, '700 72px Srisakdi, serif', c('cream'), 84, 4);
  text(`ตายอายุ ${facts.age}`, '700 96px Srisakdi, serif', c('gold2'), 110, 16);
  text(facts.who, '400 40px Sarabun, sans-serif', c('cream'), 58);
  text(facts.job, '400 36px Sarabun, sans-serif', c('sand'), 52);
  rule(44);
  text('ลวดลายชีวิต', '600 30px Sarabun, sans-serif', c('gold'), 44);
  text(facts.pattern.name, '700 76px Srisakdi, serif', c('gold2'), 92);
  if (facts.pattern.hint) text(facts.pattern.hint, '400 32px Sarabun, sans-serif', c('sand'), 48);
  if (facts.title) {
    y += 36;
    text('ฉายาหายากที่สุด', '600 30px Sarabun, sans-serif', c('gold'), 44);
    text(facts.title.name, '700 68px Srisakdi, serif', c('gold2'), 84);
    text(facts.title.tier, '400 32px Sarabun, sans-serif', c('sand'), 48);
  }
  ctx.font = '400 30px Sarabun, sans-serif';
  ctx.fillStyle = c('sand');
  ctx.fillText(SHARE_URL, cx, SHARE_H - 96);

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
      // ผู้เล่นปิดหน้าแชร์เอง = จบ · แชร์พังด้วยเหตุอื่นให้ได้ไฟล์แทน
      if (e?.name !== 'AbortError') downloadBlob(blob, name);
    }
  });
  return [share, save];
}

function button(label, fx, onclick) {
  const b = el('button', 'choice');
  b.append(el('span', null, label));
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
    // บัญชีบุญบาปเฉลยที่การ์ดศาลในระหว่างชาติ ไม่ใช่การ์ดตาย · ตายตอนเด็กได้บันทึกสั้น (ใบ 07) — ไม่มีสรุปช่วงวัย
    if (card.recap && !card.short) body.append(recap(card.recap));
    choices.append(enter(button('ไปช่วงระหว่างชาติ', null, () => play(T.afterlife))), ...shareButtons(card));
  } else {
    top.append(el('b', null, card.funeral ? `จากไปอายุ ${card.age}` : `อายุ ${card.age} · ช่วง${card.stage}`), el('small', null, `${genLabel()}${st.name} · ${provinceLabel(st)}`));
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
    const tree = familyTree();
    if (tree) box.append(tree);
    body.append(el('span', 'kicker', card.kind === 'event' ? (card.funeral ? 'งานศพ' : card.national ? KICKER.era : `ช่วง${card.stage}`) : KICKER[card.kind]));

    if (card.kind === 'intro') {
      body.append(el('span', 'stamp', 'แรกเกิด'));
      body.append(el('h3', 'lead', card.text));
      // บรรทัดแรกเป็นเรื่องของบ้าน · ที่เหลือเป็นบรรยากาศยุค ตัวรอง
      card.story.forEach((p, i) => body.append(el('p', i ? 'sub' : null, p)));
      if (card.inherit.length) {
        const box = el('div', 'recap');
        box.append(el('div', 'h', 'สิ่งที่สืบทอดจากชาติก่อน'), list(card.inherit, 'picks'));
        if (card.lineage.length) box.append(el('div', 'h', 'ผังตระกูล'), list(card.lineage, 'picks'));
        body.append(box);
      }
      choices.append(enter(button('ต่อไป', null, next)));
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
        const b = keyed(button(c, why ?? card.fx?.[i], () => play(lifePick(i))), i);
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

// ผังตระกูลพับได้ (ใบ 05 เลิกเมื่อไรก็ดูได้) — มีเมื่อเป็นรุ่นที่ 2 ขึ้นไป
function familyTree() {
  if (!st.lineage.length) return null;
  const d = el('details', 'tree');
  d.append(el('summary', null, `ผังตระกูล · ${st.lineage.length} รุ่นก่อน`), list(lineageText(st.lineage), 'picks'));
  return d;
}

// ช่วงที่ 7 (ใบ 05 · 09): การ์ดลายรดน้ำทุกใบ · ไม่มีแถบค่าสถานะ — ชีวิตจบแล้ว
const AFTER_KICKER = { transfer: 'ส่วนบุญจากคนข้างหลัง', devaduta: 'ศาลพญายม', realm: 'ภูมิปลายทาง', ancestor: 'ผีบรรพบุรุษ' };
const AFTER_TOP = { verdict: 'ศาลพญายม', path: 'ทางเกิด', carry: 'ส่งไปเกิด', result: 'ผลที่ตามมา' };
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
  if (card.reckoning) body.append(reckoningBox(card.reckoning));
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
      const b = keyed(button(c, why ?? card.fx?.[i], () => play(afterPick(i))), i);
      if (why) b.disabled = true;
      choices.append(b);
    });
  } else choices.append(enter(button('ต่อไป', null, next)));
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

// ทุกปุ่มที่เดินเกมผ่านตรงนี้ทางเดียว — ตอนเล่นจริงกับตอนเล่นซ้ำจากเซฟจึงเดินเหมือนกันทุกก้าว
function apply(tok) {
  if (tok === T.next) return nextCard(st);
  if (tok === T.afterlife) {
    af = startAfterlife(st);
    return nextAfterCard(af);
  }
  if (tok === T.afterNext) return nextAfterCard(af);
  if (tok === T.rebirth) {
    st = nextLife(af);
    af = null;
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

// storage พังได้ (โหมดส่วนตัว · เต็ม · ปิด) — เกมยังเล่นได้ แค่ไม่จำ
function saveWrite(card) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ seed: save.seed, log: save.log, fp: fingerprint(card) }));
  } catch {
    // เขียนไม่ลงแต่เซฟเก่ายังอยู่ = รีเฟรชแล้วย้อนไปจุดเก่าโดยไม่รู้ตัว — ลบทิ้งดีกว่า
    saveClear();
  }
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
  return nextCard(st);
}

function start() {
  // seed จากเวลาเฉพาะฝั่งหน้าเว็บ แกนเกมเองไม่แตะนาฬิกา
  const card = begin((Date.now() ^ (performance.now() * 1000)) >>> 0);
  saveWrite(card);
  render(card);
}

// เล่นซ้ำทั้งตระกูลจากเซฟ · ไม่ตรงการ์ดเดิม = null
function resume(s) {
  try {
    let card = begin(s.seed);
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

function boot() {
  const s = saveRead();
  if (!s) return start();
  const card = resume(s);
  if (card) return home(card);
  const choices = homeCard('เซฟเก่า', ['ชีวิตที่ค้างไว้เล่นต่อไม่ได้', 'เกมเปลี่ยนเนื้อเรื่องตั้งแต่เล่นครั้งก่อน ชีวิตเดิมจึงย้อนกลับมาให้ตรงไม่ได้ · สมุดฉายายังอยู่']);
  choices.append(button('เริ่มตระกูลใหม่', null, start));
}

boot();
