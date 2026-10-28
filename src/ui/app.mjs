import { newLife, nextCard, choose, statsOf, provinceLabel, STAT_LABELS, STAT_KEYS, STAGES, isWorking, monthlyIncome, jobText, promoText, moodMul, totalDebt, startAfterlife, nextAfterCard, chooseAfter, nextLife, lineageText, titlesOf, stageSummary, ALL_PATTERNS, TITLES, FAMILY_TITLES, TIERS, horoscope, familyOf, MERIT_LEVELS, CLASSES, standingOf, ISEKAI_STAT, snapshot, restore, repairLife, nextGoal, schoolOf, lifeEndWord, isGone } from '../engine/index.mjs';
import { eraArt, avatarArt, artTier, ERA_ART_W, ERA_ART_H, AVATAR_SIZE } from './art.mjs';
import { BTN, STAT_HELP } from './labels.mjs';

// เลขเวอร์ชันเดโม — เขียนทับโดย `npm run bump` (patch +1 · `npm run bump -- minor` = minor +1 patch 00) ห้ามแก้รูปแบบบรรทัด
const APP_VERSION = 'v0.2.80';
const APP_BUILD = '2026-10-28';
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
function legendItem(i, label) {
  const key = svgEl('svg', { class: 'key', viewBox: '0 0 24 8', 'aria-hidden': 'true' });
  key.append(svgEl('line', { class: `ln ln${i}`, x1: 0, x2: 24, y1: 4, y2: 4, 'stroke-dasharray': LINE_DASH[i] }));
  const li = el('li');
  li.append(key, label);
  return li;
}
// หมุดบนกราฟ: ชี้/แตะ/โฟกัสแล้วบรรทัดใต้กราฟบอกเรื่อง — มือถือไม่มี hover <title> อย่างเดียวไม่พอ
function markDot(svg, cap, cx, cy, r, text, cls) {
  const g = svgEl('g', { class: `mk ${cls}`, tabindex: 0, role: 'button', 'aria-label': text });
  g.append(svgEl('title', {}, text), svgEl('circle', { cx, cy, r }));
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
function lifeChart(life, deathAge) {
  if (life.stats.length < 2) return null;
  const box = el('div', 'lifechart');
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
    legend.append(legendItem(i, STAT_LABELS[k]));
  });
  // จุดเรื่องเด่น + จุดตาย (B38)
  const cap = el('p', 'mk-cap', 'แตะจุดบนกราฟเพื่อดูเรื่องในปีนั้น');
  cap.setAttribute('aria-live', 'polite');
  const mark = (a, text, cls) => markDot(svg, cap, x(a), H - B - 5, 4, text, cls);
  for (const m of lifeMarks(deathAge)) mark(m.age, `อายุ ${m.age} · ${m.text}`, 'ev');
  mark(deathAge, `${lifeEndWord(isGone(st))} ${deathAge}`, 'death');
  box.append(svg, legend, cap);
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
    card.lifeTitles.clue = titleClue(`${st.seed}:${st.gen}`, t);
    card.memo = memoAdd(t);
    // สมุดเต็ม: ผู้เล่นลบแถวแล้วกดกลับ หน้าเดิมถูกคืนทั้งก้อน ไม่วาดใหม่ — ต้องลองลงซ้ำเองตอนกลับ
    if (card.memo === 'full') card.memoRetry = () => (card.memo = memoAdd(t));
  }
  return card.lifeTitles;
}
const TITLES_SHOWN = 3;

// บันทึกการตาย (ใบ 04): แบบชีวิต 1 + ฉายาเด่น 3 + ปุ่มดูทั้งหมด · ฉายาตระกูลแยกหัวข้อ
function titlesBox(card) {
  const { pattern, titles, family } = lifeTitles(card);
  // ของชีวิตนี้ที่เพิ่งเปิดครั้งแรกในสมุด — อ่านจากที่เก็บ ไม่ใช่ตอนลงสมุด รีโหลดที่มรณบัตรจึงยังเห็นจุด
  const unseen = bookRead().n;
  const mine = [pattern.id && newKey('p', pattern.id), ...titles.map((t) => newKey('t', t.id)), ...family.map((t) => newKey('f', t.id))].filter((k) => k && unseen.includes(k));
  const isNew = (k) => mine.includes(k);
  const box = el('div', 'recap titles');
  box.append(el('div', 'h', 'ชีวิตแบบ'));
  const pat = el('p', 'pattern', pattern.name);
  if (pattern.id && isNew(newKey('p', pattern.id))) pat.append(newTag());
  box.append(pat);
  if (pattern.hint) box.append(el('p', 'note', pattern.hint));
  box.append(el('div', 'h', 'ฉายาเด่น'));
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
    box.append(el('div', 'h', 'ฉายาตระกูล'));
    const fl = el('ul', 'picks');
    for (const t of family) {
      const li = el('li', null, t.name);
      if (isNew(newKey('f', t.id))) li.append(newTag());
      fl.append(li);
    }
    box.append(fl);
  }
  clueRow(box, lifeTitles(card).clue);
  box.append(bookBox());
  // เปิดแผงแล้วนับว่าเห็นของชีวิตนี้ · จุดบนสมุดฉายาข้างในยังอยู่ถ้ามีของชีวิตก่อนที่ยังไม่ได้ดู
  return fold(box, 'ชีวิตแบบและฉายา', mine.length ? `ได้ฉายาใหม่ ${mine.length}` : null, () => {
    bookSeen(mine);
    if (!bookRead().n.length) box.querySelector('.book summary .new-dot')?.remove();
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
function clueRow(box, clue) {
  if (!clue) return;
  box.append(el('div', 'h', 'คำใบ้ฉายา'));
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
function bookAdd(t) {
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
function bookBox() {
  const b = bookRead();
  const d = el('details', 'book');
  const all = ALL_PATTERNS.length + TITLES.length + FAMILY_TITLES.length;
  const sum = el('summary', null, `สมุดฉายา · เปิดแล้ว ${b.p.length + b.t.length + b.f.length}/${all}`);
  if (b.n.length) sum.append(newDot(`มีรายการใหม่ ${b.n.length}`));
  d.append(sum);
  // เปิดดูแล้ว = เห็นครบ ล้างจุดในที่เก็บ · ป้าย "ใหม่" ในแถวคงไว้จนการ์ดเปลี่ยน ให้ยังหาเจอว่าตัวไหน
  d.addEventListener('toggle', () => {
    if (!d.open) return;
    bookSeen();
    sum.querySelector('.new-dot')?.remove();
  });
  const section = (head, group, items, got, tierOf) => {
    d.append(el('div', 'h', head));
    const ul = el('ul', 'picks');
    for (const x of items) {
      const tier = tierOf ? ` · ${tierOf(x)}` : '';
      const li = el('li', null, got.includes(x.id) ? `${x.name}${tier}` : `???${tier} — ${x.hint}`);
      if (b.n.includes(newKey(group, x.id))) li.append(newTag());
      ul.append(li);
    }
    d.append(ul);
  };
  section('ชีวิตแบบที่เคยได้', 'p', ALL_PATTERNS, b.p);
  section('ฉายา', 't', [...TITLES].sort((x, y) => TIERS.indexOf(x.tier) - TIERS.indexOf(y.tier)), b.t, (x) => x.tier);
  section('ฉายาตระกูล', 'f', FAMILY_TITLES, b.f);
  return d;
}

// สมุดอนุสรณ์ (B51): สรุปชีวิตที่จบแล้วข้ามการเล่น · key แยกจากเซฟ ล้างตระกูลแล้วยังอยู่
// ไม่จำกัดจำนวน (คำตัดสินเจ้าของ) จึงเก็บแค่สรุปสั้น · ที่เก็บเต็มต้องบอกผู้เล่นให้ลบเอง ห้ามลบเงียบ
const MEMO_KEY = 'next-life-memorial-v1';
const ERA_EVENTS = CONTENT.era.events;
// การ์ดรับมือที่รวมข่าวบ้านเมือง (B58) ไม่มีการ์ดบ้านเมืองแยก — หาเหตุการณ์จากการ์ดเนื้อหาที่ผูกไว้
const ERA_OF = new Map(CONTENT.events.filter((c) => c.era).map((c) => [c.id, c.era]));
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
  m.l.push({ k, n: st.name, g: st.gen, a: st.age, p: provinceLabel(st), s: t.pattern?.name ?? '', t: t.titles[0]?.name ?? '' });
  for (const x of eraSeen) if (!m.e.includes(x.id)) m.e.push(x.id);
  const r = memoWrite(m);
  memoDot();
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
function memoDot() {
  const a = document.getElementById('memoLink');
  if (!a) return;
  const fresh = memoUnseen().length;
  a.querySelector('.new-dot')?.remove();
  if (fresh) a.append(newDot(`มีชีวิตใหม่ในสมุด ${fresh}`));
}
function eraBox() {
  const box = el('div', 'recap eras');
  box.append(eraSeen.length ? list(eraSeen.map((x) => `อายุ ${x.a} · ${eraName(x.id)}`), 'picks') : el('p', 'sub', 'ชีวิตนี้ไม่ทันเห็นเหตุการณ์ใหญ่ของบ้านเมือง'));
  return fold(box, `เหตุการณ์ในแผ่นดินที่ได้เห็น (${eraSeen.length})`);
}
function memoFull(card) {
  const box = el('div', 'recap warn');
  box.append(el('p', 'sub', 'สมุดอนุสรณ์เต็ม ชีวิตนี้ยังไม่ได้ลงสมุด — ลบชีวิตเก่าในสมุดออกบ้างแล้วกลับมาที่หน้านี้อีกครั้ง'));
  const b = el('button', 'more', 'เปิดสมุดอนุสรณ์');
  b.onclick = () =>
    openMemo(undefined, () => {
      if (card.memo === 'full') card.memoRetry?.();
      if (card.memo !== 'full') box.remove();
    });
  box.append(b);
  return box;
}

// เปิดทับหน้าที่อยู่ แล้วคืนหน้าเดิมทั้งก้อนตอนกลับ — ไม่แตะ st ไม่ลงเซฟ
function openMemo(prev = [...root.childNodes], onBack, fresh = memoUnseen()) {
  const m = memoRead();
  memoSeenWrite(m.l.map((x) => x.k));
  memoDot();
  const back = () => {
    root.replaceChildren(...prev);
    onBack?.();
  };
  const choices = homeCard('สมุดอนุสรณ์', ['สมุดอนุสรณ์', `ชีวิตที่จบแล้ว ${m.l.length} ชีวิต · เหตุการณ์ในแผ่นดินที่เคยเห็น ${m.e.filter((id) => ERA_EVENTS.some((e) => e.id === id)).length}/${ERA_EVENTS.length}`]);
  root.firstChild.classList.add('memo-view');
  const body = root.querySelector('.body');
  if (m.e.length) body.append(list(ERA_EVENTS.filter((e) => m.e.includes(e.id)).map((e) => e.name), 'picks'));
  const ul = el('ul', 'memo');
  // ใหม่สุดก่อน · ลบทีละแถวได้ทันที (สรุปสั้น ไม่ใช่เซฟ ไม่ต้องถามซ้ำ)
  for (const x of [...m.l].reverse()) {
    const li = el('li');
    const txt = el('span', null, [`${x.g > 1 ? `รุ่นที่ ${x.g} · ` : ''}${x.n}`, `อายุ ${x.a} ปี`, x.p, x.s && `ชีวิตแบบ${x.s}`, x.t && `ฉายา ${x.t}`].filter(Boolean).join(' · '));
    if (fresh.includes(x.k)) txt.append(newTag());
    li.append(txt);
    const del = el('button', 'more', 'ลบ');
    del.setAttribute('aria-label', `ลบ ${x.n} ออกจากสมุด`);
    del.onclick = () => {
      const now = memoRead();
      now.l = now.l.filter((y) => y.k !== x.k);
      memoWrite(now);
      openMemo(prev, onBack, fresh);
    };
    li.append(del);
    ul.append(li);
  }
  body.append(m.l.length ? ul : el('p', 'sub', 'ยังไม่มีชีวิตที่จบลงสมุด'));
  choices.append(enter(button('กลับ', null, back)));
  if (m.l.length || m.e.length) {
    choices.append(button('ลบสมุดทั้งเล่ม', null, () => {
      const c = homeCard('สมุดอนุสรณ์', ['ลบสมุดอนุสรณ์ทั้งเล่ม?', 'ชีวิตที่จบแล้วและเหตุการณ์ที่เคยเห็นจะหายทั้งหมด กู้คืนไม่ได้ · ชีวิตที่เล่นค้างไว้ไม่หาย']);
      root.firstChild.classList.add('memo-view');
      c.append(button('ลบทั้งเล่ม', null, () => {
        memoWrite({ l: [], e: [] });
        openMemo(prev, onBack, fresh);
      }), enter(button('ยกเลิก', null, () => openMemo(prev, onBack, fresh))));
    }));
  }
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
    note: ((n) => n && { age: n.a, text: n.t })(notePick(st.gen)),
    avatar: avatarParts(card.age),
  };
}

// สรุปเป็นข้อความ (B38) — การ์ดตายยังไม่รู้ภพ (รู้ = เผยทิศบัญชีก่อนปรโลก) · การ์ดปรโลกส่ง realm มาเพิ่มบรรทัด
function summaryText(age, realm = null) {
  const t = titlesOf(st);
  return [
    `${GAME_NAME} · ${st.name}`,
    `เกิดปี ${st.birthYear} · ${provinceLabel(st)}`,
    `${lifeEndWord(isGone(st))} ${age}`,
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
  const b = button(BTN.copy, null, async () => {
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
  // ชื่อยาวแตกสองบรรทัดตรงช่องว่าง — ให้ย่อบรรทัดเดียวจะเล็กจนอ่านยากบนภาพแนวตั้ง
  for (const part of GAME_NAME.split(' ')) text(part, '700 84px Srisakdi, serif', c('gold'), 96, 0, 1);
  text('NEXT LIFE', '600 28px Sarabun, sans-serif', c('sand'), 44, 0, 1);
  // รูปวัยสุดท้ายนั่งกลางเส้นคั่นแรก (B56) — ไม่กินที่เพิ่ม ข้อความข้างล่างจึงไม่ไหลเข้าหากราฟ
  rule(44);
  ctx.fillStyle = c('lacquer');
  ctx.fillRect(cx - 54, y - 44 - 6, 108, 12);
  artDraw(ctx, facts.avatar, cx - 42, y - 44 - 42, 84);
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
  if (facts.note) shareNote(ctx, c, facts.note, cx, maxW, y, SHARE_H - SHARE_CHART_TOP);
  // กราฟอยู่ล่างสุด ยึดจากขอบล่าง — ข้อความข้างบนยาวแค่ไหนก็ไม่ทับกัน (ข้อความถูกจำกัดบรรทัดไว้แล้ว)
  if (facts.stats.length >= 2) shareChart(ctx, c, facts, 120, SHARE_H - SHARE_CHART_TOP, SHARE_W - 240, 240);
  ctx.font = '400 30px Sarabun, sans-serif';
  ctx.fillStyle = c('sand');
  ctx.fillText(SHARE_URL, cx, SHARE_H - 72);

  return new Promise((ok, fail) => cv.toBlob((b) => (b ? ok(b) : fail(new Error('canvas toBlob ว่าง'))), 'image/png'));
}

const SHARE_CHART_TOP = 440;
// หัวกราฟวาดเหนือกรอบกราฟ 56px — บันทึกต้องจบก่อนหัวนั้นพอให้เว้นช่อง
const NOTE_CLEAR = 100;
// บันทึกชีวิตบนภาพ (B39): ข้อความผู้เล่นยาวไม่แน่นอน แต่ที่ว่างเหนือกราฟขึ้นกับข้อความข้างบน
// จึงนับบรรทัดที่ลงได้จริง เกินตัดท้ายด้วย … · ลงไม่ได้สักบรรทัดก็ไม่วาด (ภาพไม่ทับกราฟ)
function shareNote(ctx, c, note, cx, maxW, y, chartY) {
  const LABEL = 44, LINE = 50;
  const max = Math.min(3, Math.floor((chartY - NOTE_CLEAR - (y + 36 + LABEL)) / LINE));
  if (max < 1) return;
  ctx.font = '400 34px Sarabun, sans-serif';
  let lines = wrapThai(ctx, `“${note.text}”`, maxW);
  if (lines.length > max) {
    lines = lines.slice(0, max);
    let last = lines[max - 1];
    while (last && ctx.measureText(`${last}…”`).width > maxW) last = [...last].slice(0, -1).join('');
    lines[max - 1] = `${last.trimEnd()}…”`;
  }
  y += 36 + LABEL;
  ctx.font = '600 30px Sarabun, sans-serif';
  ctx.fillStyle = c('gold');
  ctx.fillText(`บันทึกเมื่ออายุ ${note.age}`, cx, y);
  ctx.font = '400 34px Sarabun, sans-serif';
  ctx.fillStyle = c('cream');
  for (const l of lines) ctx.fillText(l, cx, (y += LINE));
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

// ลูกศรบนป้ายผลโปรแกรมอ่านจออ่านเป็น "upwards arrow" — ซ่อนลูกศรแล้วอ่านเป็นคำแทน ตาเห็นเหมือนเดิม
const ARROW_WORD = { '↑': 'เพิ่ม', '↓': 'ลด' };
function fxPart(text) {
  const s = el('span');
  for (const bit of text.split(/([↑↓])/)) {
    if (!ARROW_WORD[bit]) {
      if (bit) s.append(bit);
      continue;
    }
    const a = el('span', null, bit);
    a.setAttribute('aria-hidden', 'true');
    s.append(a, el('span', 'sr', ARROW_WORD[bit]));
  }
  return s;
}

// ป้าย "ฟรี" (B116): ทางที่ไม่แตะเงินเลยทุกผลลัพธ์ บนการ์ดที่มีทางอื่นต้องจ่าย · การ์ดที่ไม่มีใครจ่ายไม่ติด ไม่งั้นทุกปุ่มขึ้น "ฟรี" จนไม่บอกอะไร
// อ่านเหตุการณ์ดิบจาก st.pending (ตัวที่การ์ดนี้ตั้งไว้) อย่างเดียว · เงินที่เหตุการณ์ซ่อน (?) นับว่าอาจจ่าย — ห้ามติดฟรีแล้วเฉลยค่าที่ซ่อน
const moneySign = (m) => Math.sign(typeof m === 'object' ? m.amount : m);
// กู้ = จ่ายคืนทีหลัง · ปิดหนี้ = จ่ายก้อน — ทั้งคู่ไม่ใช่ "ฟรี" แม้ช่องเงินจะไม่ติดลบ
const paysOut = (fx) => !!fx && ((fx.money !== undefined && moneySign(fx.money) < 0) || !!fx.invest || !!fx.debt || !!fx.settle);
function freeChoices(card) {
  // การ์ดจัดสรรเงิน/ต่างโลกเข้า branch เดียวกันแต่ไม่มี id — id ว่างเท่ากันได้ จึงเช็กชนิดก่อน
  const ev = card.kind === 'event' && card.id && st.pending?.id === card.id ? st.pending : null;
  if (!Array.isArray(ev?.choices)) return null;
  const hidden = (c) => [...(ev.hidden ?? []), ...(c.hidden ?? [])].includes('money');
  const pays = ev.choices.map((c) => hidden(c) || !!c.requires?.money || paysOut(c.effects) || (c.outcomes ?? []).some((o) => paysOut(o.effects)));
  if (!pays.some(Boolean)) return null;
  return pays.map((p) => !p);
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
    fx.split(' · ').forEach((part, i) => tag.append(...(i ? [' · '] : []), fxPart(part)));
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
  // Esc ปิดแผ่นบันทึกชีวิตได้แม้กำลังพิมพ์อยู่
  const skip = e.key === 'Escape' && root.querySelector('.note-sheet [data-skip]');
  if (skip) {
    e.preventDefault();
    skip.click();
    return;
  }
  if (t.closest?.('input, textarea, select, [contenteditable]')) return;
  let b;
  const book = root.querySelector('.lifebook');
  if (book && (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
    // Space บนปุ่มที่โฟกัสอยู่ให้ปุ่มนั้นทำงานเอง ไม่งั้นกดทีเดียวพลิกสองครั้ง
    if (e.key === ' ' && t.closest?.('button, summary, a')) return;
    b = book.querySelector(e.key === 'ArrowLeft' ? '.choices [data-prev]' : '.choices [data-enter]');
  } else if (e.key === 'Enter') {
    // โฟกัสอยู่ที่ปุ่ม/หัวข้อพับ ให้ Enter ทำงานของตัวนั้น (แชร์ภาพ · สมุดฉายา · ผังตระกูล)
    if (t.closest?.('button, summary, a')) return;
    b = root.querySelector('.choices [data-enter]');
  } else {
    // อ่านตำแหน่งปุ่ม ไม่ใช่ตัวอักษร — แป้นไทยแถวเลขพิมพ์ ๅ / - ภ ถ ไม่ใช่ 1–5
    const m = /^(?:Digit|Numpad)([1-9])$/.exec(e.code);
    if (m) b = root.querySelector(`.choices button[data-key="${m[1]}"]`);
  }
  // การ์ดที่พับไว้ (B117) ปุ่มยังอยู่ใน DOM แค่ซ่อน — เลขลัดต้องไม่กดตัวเลือกที่มองไม่เห็น
  if (!b || b.disabled || b.closest('[hidden]')) return;
  e.preventDefault();
  b.click();
});

// แนวการ์ดของโลกนี้ทางเดียว (ทาง A กระดาษเก่า) — โลกละธีม: ลางกับเหตุการณ์ความเชื่อไม่แยกเป็นแสงเทียนแล้ว
// สีมืดทองเป็นของปรโลกที่เดียว (renderAfter) · ต่างโลกมีธีมของตัวเอง · มรณบัตร = หนังสืองานศพบนฐานทาง A
const styleOf = (card) => (card.kind === 'death' ? 'a mem' : 'a');

// ภาพพิกเซลเล็กบนการ์ด — [x, y, กว้าง, สูง, สี] ต่อสี่เหลี่ยม · ภาพประกอบล้วน ซ่อนจากโปรแกรมอ่านจอ
function pixels(cls, w, h, rects) {
  const svg = svgEl('svg', { class: cls, viewBox: `0 0 ${w} ${h}`, 'aria-hidden': 'true' });
  for (const [x, y, rw, rh, fill] of rects) svg.append(svgEl('rect', { x, y, width: rw, height: rh, fill }));
  return svg;
}
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
const portrait = () => pixels('por', 20, 24, [[0, 0, 20, 24, '#E8E8E8'], [7, 2, 6, 6, '#B8B8B8'], [7, 1, 6, 2, '#1F1F1F'], [5, 8, 10, 8, '#5A5A5A'], [6, 16, 3, 6, '#1F1F1F'], [11, 16, 3, 6, '#1F1F1F']]);

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
    top.append(el('b', null, 'ด้วยรักและอาลัย'));
    box.append(top);
    // หนังสืองานศพบอกอายุ ไม่บอกปี พ.ศ. — ปีเกมไม่ขึ้นจอ (B14 ข้อ 12)
    body.append(portrait(), el('h3', null, st.name), el('p', 'dates', `${genLabel()}สิริอายุ ${card.age} ปี`));
    body.append(el('p', null, `${st.sex} · ${provinceLabel(st)} · ฐานะ${st.cls} · ${card.job}${st.edu ? ` · วุฒิ${st.edu}` : ''}`));
    const net = card.summary.money < 0 ? 'ตายพร้อมหนี้' : 'ทรัพย์สุทธิ';
    body.append(el('p', 'sub', `${net} ${baht(card.summary.money)}`));
    if (card.summary.debt) body.append(el('p', 'sub', `หนี้ผ่อนค้าง ${baht(card.summary.debt)}`));
    if (card.summary.bankruptcies) body.append(el('p', 'sub', `เคยล้มละลาย ${card.summary.bankruptcies} ครั้ง`));
    if (card.note) body.append(el('p', 'sub', card.note));
    if (card.funeral) body.append(el('p', 'sub', `งานศพ: ${card.funeral.text} · แขกมาส่งราว ${card.funeral.guests.toLocaleString('en-US')} คน${card.funeral.cost ? ` · ค่าใช้จ่าย ${baht(card.funeral.cost)}` : ''}`));
    if (card.will !== undefined) body.append(el('p', 'sub', card.will ? 'มีพินัยกรรม ทายาทแบ่งทรัพย์ตามที่สั่งไว้' : 'ไม่มีพินัยกรรม ทายาทแบ่งทรัพย์กันเองจนผิดใจกัน'));
    const note = notePick(st.gen);
    if (note) body.append(noteQuote(`บันทึกเมื่ออายุ ${note.a}`, note.t));
    if (card.pets) body.append(el('p', 'sub', card.pets));
    body.append(titlesBox(card));
    if (card.memo === 'full') body.append(memoFull(card));
    body.append(eraBox());
    const tree = familyTree();
    if (tree) body.append(tree);
    // บัญชีบุญบาปเฉลยที่ปรโลกในระหว่างชาติ ไม่ใช่การ์ดตาย · กราฟทั้งชีวิตแทนสรุปช่วงวัยสุดท้าย (B38a) ชีวิตสั้นก็มีกราฟ
    const chart = card.life && lifeChart(card.life, card.age);
    if (chart) body.append(chart);
    choices.append(enter(button(BTN.toAfter, null, () => openBook(card))), ...shareButtons(card), copyButton(() => summaryText(card.age)));
  } else {
    const head = el('b', null, card.funeral ? `จากไปอายุ ${card.age}` : `อายุ ${card.age} · ช่วง${card.stage}`);
    // การ์ดผลเป็นผลของใบก่อนอยู่แล้ว ป้ายซ้ำไม่บอกอะไรเพิ่ม · งานศพเกิดหลังตายจึงไม่ใช่ "ปีเดียวกัน" ของชีวิต
    if (card.kind !== 'result' && !card.funeral && card.age === prevAge) head.append(el('span', 'same', 'ปีเดียวกัน'));
    top.append(avatar(card.age), head, el('small', null, `${genLabel()}${st.name} · ${provinceLabel(st)}`));
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
    // ช่วงเรียน ป้ายเรียนแทนช่อง "กำลังเรียน…" ที่บอกเรื่องเดียวกัน — ต่อท้ายแยกแล้วแถบตกบรรทัดบนจอแคบ
    const goal = nextGoal(st);
    const school = goal && schoolOf(st) !== 'none';
    if (goal && !school) purse.push(goal);
    const meta = el('div', 'meta', `ฐานะ${st.cls} · ${school ? goal : jobText(st, card.age)}`);
    // จอแคบให้ตัดบรรทัดได้แค่ที่ตัวคั่น — เบราว์เซอร์ตัดคำไทยกลาง "ราย|ได้" ได้แม้เว้นวรรคแบบไม่ตัด จึงต้องห่อ span
    for (const t of purse) meta.append(' · ', el('span', null, t));
    box.append(meta);
    const strip = lifeStrip();
    if (strip) box.append(strip);
    const fam = familyPanel();
    if (fam) box.append(fam);
    const tree = familyTree();
    if (tree) box.append(tree);
    const stand = standingPanel();
    if (stand) box.append(stand);
    const kicker = card.kind === 'event' ? (card.funeral ? 'งานศพ' : card.national ? KICKER.era : `ช่วง${card.stage}`) : KICKER[card.kind];
    // ภาพยุค (B56): การ์ดบ้านเมือง + การ์ดรับมือที่ผูกยุคไว้ (B58) ได้ภาพของยุคนั้น · ยุคที่ไม่มีภาพ = หน้าตาเดิม
    const eraPic = eraArt(card.kind === 'era' ? card.id : card.kind === 'event' ? ERA_OF.get(card.id) : null);
    if (eraPic) body.append(artSvg('era-art', ERA_ART_W, ERA_ART_H, eraPic));
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
        // บันทึกของชาติก่อนตามมาเฉพาะทางที่กลับมาเกิดในตระกูลเดิม · ใบเดียวกับที่ขึ้นบนมรณบัตรของชาตินั้น
        const prev = st.lineage.at(-1);
        const note = prev.path === 'child' && notePick(prev.gen);
        if (note) box.append(noteQuote(`บันทึกของบรรพบุรุษ · ${prev.name ? `${prev.name} ` : ''}เมื่ออายุ ${note.a}`, note.t));
        if (card.lineage.length) box.append(el('div', 'h', 'ผังตระกูล'), list(card.lineage, 'picks'));
        body.append(box);
      }
      choices.append(enter(button(BTN.next, null, next)));
      if (canReroll()) choices.append(button(BTN.reroll, 'ได้ครั้งเดียว', reroll));
    } else if (card.kind === 'stage') {
      body.append(el('span', 'stamp', card.text));
      const grow = el('p', 'grow');
      grow.append(avatar(card.age), el('span', null, growLabel(card.stage)));
      body.append(grow, recap(card.recap));
      const go = () => choices.replaceChildren(enter(button(BTN.next, null, next)));
      // ต้องตอบหรือข้ามก่อนเดินต่อ — ปุ่มต่อไปขึ้นหลังปิดแผ่นคำถาม
      if (noteAsk && !noteOf(noteAsk)) choices.append(noteSheet(noteAsk, () => {
        go();
        choices.firstChild.focus();
      }));
      else go();
    } else if (card.kind === 'era' || card.kind === 'omen' || card.kind === 'result') {
      body.append(el('h3', null, card.text));
      if (card.story) body.append(el('p', null, card.story));
      choices.append(enter(button(BTN.next, null, next)));
    } else {
      if (card.title) body.append(el('h3', null, card.title));
      body.append(el(card.title ? 'p' : 'h3', card.title ? null : 'lead', card.text));
      if (card.items?.length) body.append(list(card.items));
      if (card.disclaimer) body.append(el('p', 'note', card.disclaimer));
      const free = freeChoices(card);
      card.choices.forEach((c, i) => {
        const why = lockText(card, i);
        // ตัวเลือกที่ล็อกยังแสดงให้เห็นทางที่พลาด · ป้ายผลแทนด้วยเหตุผลที่กดไม่ได้
        const fx = why ?? (free?.[i] ? [card.fx?.[i], 'ฟรี'].filter(Boolean).join(' · ') : card.fx?.[i]);
        const b = keyed(button(c, fx, () => play(lifePick(i)), card.hints?.[i]), i);
        if (why) b.disabled = true;
        choices.append(b);
      });
      // การ์ดเล่าเรื่อง (choices: []) ไม่มีปุ่มให้เลือก — ต้องมีทางไปใบถัดไป
      if (!card.choices.length) choices.append(enter(button(BTN.next, null, next)));
      const tip = whisperFor(card, free);
      if (tip) body.append(tip);
      if (card.choices.length > 1) choices.append(foldLater(box, body, choices, card));
    }
  }
  box.append(body, choices);
  root.append(box);
}

// กล่องกระซิบ (B117): สอนระบบที่เพิ่งโผล่ครั้งแรกตามวัย ในเสียงยาย · บอกแค่ทิศ ไม่บอกตัวเลข/สูตร/บัญชีบุญบาป (กติกาเดียวกับ B31)
// ค่าสถานะแต่ละตัวอธิบายอยู่ที่ "ค่าสถานะเหล่านี้หมายถึงอะไร?" แล้ว (B31) — ที่นี่สอนเฉพาะกลไกบนการ์ด
// อ่านการ์ดอย่างเดียว ไม่มี token ในเซฟ ⇒ ผลเกม/บอทไม่ขยับ
const WHISPER_KEY = 'next-life-whisper-v1';
const WHISPERS = [
  ['locked', (c) => c.locked?.some(Boolean), 'ปุ่มจาง ๆ คือทางที่ตอนนี้ยังไปไม่ได้ เหตุผลเขียนไว้บนปุ่ม บางทางแค่รอโตอีกหน่อยหรือมีเงินพอ'],
  ['chance', (c) => c.fx?.some((f) => /สำเร็จ|เสี่ยง/.test(f ?? '')), 'ทางที่บอกโอกาสสำเร็จหรือความเสี่ยงไว้ ผลยังไม่แน่นอน ค่าสถานะตอนนี้ช่วยเอียงผลได้บ้าง'],
  ['free', (c, free) => free?.some(Boolean), 'ป้าย "ฟรี" คือทางที่ไม่ต้องควักเงินเลย ไม่ว่าผลจะออกมาทางไหน'],
  ['school', (c) => c.id?.startsWith('school_gate_'), 'เรียนจบชั้นหนึ่งแล้วจะเรียนต่อหรือออกมาทำงานก็ได้ ความรู้ช่วยสอบเข้าที่ดี ส่วนเงินที่บ้านตัดสินว่าที่ไหนส่งไหว'],
  ['job', (c) => c.id === 'first_job', 'งานแรกขึ้นกับวุฒิที่มี คนรู้จักเยอะยิ่งเจองานค่าแรงดี รายได้ต่อเดือนจะขึ้นใต้แถบค่าสถานะ'],
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
function whisperFor(card, free) {
  const w = whisperRead();
  if (w.off.includes(lifeKey())) return null;
  const hit = WHISPERS.find(([id, when]) => !w.seen.includes(id) && when(card, free));
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
    const panels = [...box.querySelectorAll(':scope > details')];
    const was = panels.map((d) => d.open);
    panels.forEach((d) => (d.open = true));
    body.hidden = choices.hidden = true;
    const bar = el('div', 'choices folded');
    bar.append(el('p', 'note', `การ์ดรอให้เลือกอยู่ · ${clip(card.title ?? card.text, 48)}`));
    const back = enter(button('กลับมาเลือก', null, () => {
      panels.forEach((d, i) => (d.open = was[i]));
      bar.remove();
      body.hidden = choices.hidden = false;
      choices.querySelector('button.choice:not(:disabled)')?.focus();
    }));
    bar.append(back);
    box.append(bar);
    scrollTo(0, 0);
    back.focus({ preventScroll: true });
  };
  return later;
}

const genLabel = () => (st.gen > 1 ? `รุ่นที่ ${st.gen} · ` : '');

// แผ่นคำถามบันทึกชีวิต: บันทึกกับข้ามขนาดเท่ากัน · Enter ในช่องพิมพ์ = บันทึก · Enter นอกช่อง/Esc = ข้าม
// ข้ามกดง่ายเท่ากดต่อไป คนที่เล่นรวดด้วยแป้นจึงไม่ติด
function noteSheet(ask, done) {
  const f = el('form', 'note-sheet');
  const id = `note-${ask.g}-${ask.a}`;
  const q = el('label', 'q', ask.q);
  q.htmlFor = id;
  const inp = el('input');
  Object.assign(inp, { id, type: 'text', maxLength: NOTE_MAX, autocomplete: 'off', placeholder: `พิมพ์สั้น ๆ ไม่เกิน ${NOTE_MAX} ตัวอักษร` });
  const keep = button('บันทึก', null, null);
  keep.type = 'submit';
  const skip = enter(button(BTN.skip, null, () => {
    notePut(ask, '');
    done();
  }));
  skip.type = 'button';
  skip.dataset.skip = '';
  f.onsubmit = (e) => {
    e.preventDefault();
    notePut(ask, inp.value);
    done();
  };
  const row = el('div', 'row');
  row.append(keep, skip);
  f.append(el('div', 'h', `บันทึกถึงตัวเอง · อายุ ${ask.a}`), q, inp, row);
  return f;
}

// ข้อความที่ผู้เล่นพิมพ์เป็นข้อความดิบ — ใส่ด้วย textContent (el) เท่านั้น
function noteQuote(label, text) {
  const q = el('blockquote', 'life-note');
  q.append(el('small', null, label), el('p', null, `“${text}”`));
  return q;
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
      // ฝูงเป็นทรัพย์สิน นับเป็นหน่วยเดียว — ไม่มีอายุรายตัวหรือความผูกพันให้บอก
      if (m.role === 'herd') return { text: m.alive && !m.left ? `${who} · เลี้ยงไว้` : `${who} · หมดไปแล้ว`, gone: !m.alive || !!m.left };
      if (!m.alive) return { text: `${who} · ${m.diedAge != null ? `จากไปตอนอายุ ${m.diedAge}` : 'จากไปแล้ว'}`, gone: true };
      if (m.role === 'pet' && m.left) return { text: `${who} · ไม่ได้อยู่กับเราแล้ว`, gone: true };
      const parts = [who, m.age != null && `อายุ ${m.age}`, m.left ? 'แยกทางแล้ว' : m.bondLevel].filter(Boolean);
      return { text: parts.join(' · '), gone: false };
    });
  // หัวแผงนับเฉพาะคน — สัตว์บอกแยก ไม่งั้น "ยังอยู่ 3 คน" รวมหมากับฝูงไก่
  const people = all.filter((m) => !ANIMAL_ROLES.includes(m.role));
  const alive = people.filter((m) => m.alive).length;
  const animals = all.filter((m) => ANIMAL_ROLES.includes(m.role) && m.alive && !m.left).length;
  const d = el('details', 'family');
  d.open = familyOpen;
  d.addEventListener('toggle', () => (familyOpen = d.open));
  const ul = el('ul', 'picks');
  for (const r of rows) ul.append(el('li', r.gone ? 'gone' : null, r.text));
  d.append(el('summary', null, `ครอบครัว · ยังอยู่ ${alive} ${alive === people.length ? 'คน' : `จาก ${people.length} คน`}${animals ? ` · สัตว์ ${animals}` : ''}`), ul);
  return d;
}

// ผังตระกูลพับได้ (ใบ 05 เลิกเมื่อไรก็ดูได้) — มีเมื่อเป็นรุ่นที่ 2 ขึ้นไป
function familyTree() {
  if (!st.lineage.length) return null;
  const d = el('details', 'tree');
  d.append(el('summary', null, `ผังตระกูล · ${st.lineage.length} รุ่นก่อน`), list(lineageText(st.lineage), 'picks'));
  return d;
}

// กราฟฐานะตระกูลพับได้ระหว่างเล่น (B95) — วาดตอนกางเท่านั้น การ์ดส่วนใหญ่ผ่านไปโดยไม่มีใครกาง · พับ/กางค้างข้ามการ์ดแบบแผงครอบครัว
let standOpen = false;
function standingPanel() {
  const d = el('details', 'tree stand-d');
  const fill = () => {
    if (!d.open || d.querySelector('.stand')) return;
    const chart = standingChart(standingGens(st.lineage, standingNow(false)), null, false);
    d.append(chart ?? el('p', 'sub', 'ยังมีจุดเดียว — กราฟขึ้นเมื่อถึงช่วงวัยถัดไป'));
  };
  d.open = standOpen;
  d.addEventListener('toggle', () => {
    standOpen = d.open;
    fill();
  });
  d.append(el('summary', null, st.lineage.length ? `กราฟฐานะตระกูล · ${st.lineage.length + 1} รุ่น` : 'กราฟฐานะตระกูล'));
  fill();
  return d;
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

// แถบชีวิตสดระหว่างเล่น (B53): เงิน · สุขภาพ · ความสุข ตั้งแต่เกิดถึงตอนนี้ + หมุดเรื่องที่ผ่านมา
// อ่านจุดรายปีที่แกนจดไว้แล้วชุดเดียวกับกราฟการ์ดตาย — โหลดเซฟเล่นซ้ำได้รูปเดิม ไม่เก็บอะไรเพิ่ม
// ระหว่างชีวิตห้ามบอกค่าเป็นตัวเลข: ไม่มีแกนตั้ง เงินวัดเทียบกับต่ำสุด–สูงสุดของชีวิตนี้เอง
const STRIP_LINES = [['money', 2], ['health', 0], ['happiness', 1]];
let stripOpen = true;
function stripPoints() {
  const stats = st.statTrail.filter((p) => p.age < st.age);
  stats.push({ age: st.age, ...Object.fromEntries(STAT_KEYS.map((k) => [k, Math.round(st[k])])) });
  const money = st.trail.map((p) => ({ age: p.year - st.birthYear, money: p.money })).filter((p) => p.age < st.age);
  money.push({ age: st.age, money: Math.round(st.money) });
  return { stats, money };
}
const clip = (t, n) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);
// หมุดที่ใกล้กันกว่านี้ (หน่วย viewBox ≈ px ที่จอ 390) รวมเป็นหมุดเดียว — ชีวิตยาวมีเรื่องหลายสิบเรื่อง นิ้วแตะแยกไม่ได้
const STRIP_GAP = 10;
function stripMarks(x) {
  const ms = [];
  for (const p of bookCards) {
    // หมุดเอาแค่เรื่องบ้านเมืองกับงาน/ครอบครัว — เรื่องจิปาถะทุกปีทำให้หมุดแน่นเกิน
    if (p.w < BOOK_W.near) continue;
    const c = p.card;
    const t = clip(c.news?.text ?? c.title ?? c.text, 60);
    const last = ms.at(-1);
    if (last && x(c.age) - x(last.from) < STRIP_GAP) {
      last.to = c.age;
      last.ts.push(t);
    } else ms.push({ from: c.age, to: c.age, ts: [t] });
  }
  return ms.map((m) => ({
    age: m.from,
    text: `อายุ ${m.from === m.to ? m.from : `${m.from}–${m.to}`} · ${m.ts.slice(0, 2).join(' / ')}${m.ts.length > 2 ? ` และอีก ${m.ts.length - 2} เรื่อง` : ''}`,
  }));
}
function lifeStrip() {
  const { stats, money } = stripPoints();
  if (stats.length < 2) return null;
  // ขอบซ้ายขวาเผื่อรัศมีหมุด — หมุดปีปัจจุบันอยู่ชิดขวาสุดเสมอ
  const W = 320, H = 46, T = 3, B = 8, L = 4, R = 4;
  const x = (a) => L + (a / Math.max(st.age, 1)) * (W - L - R);
  const y = (f) => T + (1 - f) * (H - T - B);
  const svg = svgEl('svg', { class: 'spark strip', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `เงิน สุขภาพ และความสุข อายุ 0 ถึง ${st.age}` });
  stageBands(svg, x, 0, st.age, T, H - B, false);
  const nom = money.map((p) => p.money);
  let lo = Math.min(...nom), hi = Math.max(...nom);
  if (hi === lo) hi = lo + 1;
  const frac = { money: (v) => (v - lo) / (hi - lo), health: (v) => v / 100, happiness: (v) => v / 100 };
  if (lo < 0 && hi > 0) svg.append(svgEl('line', { class: 'zero', x1: L, x2: W - R, y1: y(frac.money(0)), y2: y(frac.money(0)) }));
  const legend = el('ul', 'legend');
  for (const [k, i] of STRIP_LINES) {
    const pts = (k === 'money' ? money : stats).map((p) => `${x(p.age).toFixed(1)},${y(frac[k](p[k])).toFixed(1)}`).join(' ');
    svg.append(svgEl('polyline', { class: `ln ln${i}`, points: pts, 'stroke-dasharray': LINE_DASH[i] }));
    legend.append(legendItem(i, STAT_LABELS[k]));
  }
  // บรรทัดเรื่องว่างไว้จนแตะหมุด แถบจึงเตี้ยพอบนจอแคบ
  const cap = el('p', 'mk-cap');
  cap.setAttribute('aria-live', 'polite');
  for (const m of stripMarks(x)) markDot(svg, cap, x(m.age), H - B / 2, 3, m.text, 'ev');
  const d = el('details', 'tree strip-d');
  d.open = stripOpen;
  d.addEventListener('toggle', () => (stripOpen = d.open));
  // ป้ายเส้นอยู่บรรทัดเดียวกับหัวแผง ไม่กินอีกบรรทัด
  const sum = el('summary', null, 'ชีวิตนี้');
  sum.append(legend);
  d.append(sum, svg, cap);
  return d;
}

// ช่วงที่ 7 (ใบ 05 · 09): การ์ดลายรดน้ำทุกใบ · ไม่มีแถบค่าสถานะ — ชีวิตจบแล้ว
const AFTER_KICKER = { transfer: 'ส่วนบุญจากคนข้างหลัง', devaduta: 'ปรโลก', realm: 'ภูมิปลายทาง', ancestor: 'ผีบรรพบุรุษ' };
const AFTER_TOP = { verdict: 'ปรโลก', path: 'ทางเกิด', carry: 'ส่งไปเกิด', result: 'ผลที่ตามมา' };
function renderAfter(card) {
  if (card.kind === 'isekai') return renderIsekai(card);
  root.replaceChildren();
  const box = el('article', 'card b af');
  const top = el('div', 'top');
  top.append(el('b', null, 'ระหว่างชาติ'), el('small', null, `${genLabel()}${st.name} · ${lifeEndWord(isGone(st))} ${st.age}`));
  const body = el('div', 'body');
  const choices = el('div', 'choices');
  const next = () => play(T.afterNext);
  const court = card.kind === 'verdict' || card.scene === 'devaduta';
  body.append(el('span', 'kicker', card.kind === 'scene' ? AFTER_KICKER[card.scene] : AFTER_TOP[card.kind]));
  if (card.title) body.append(el('h3', null, card.title));
  if (card.scene === 'devaduta') {
    const wait = petsWaiting(af.st);
    if (wait) body.append(el('p', 'sub', wait));
  }
  if (card.kind === 'verdict') body.append(el('h3', null, `ภูมิ${card.realm}`));
  body.append(el(card.title || card.kind === 'verdict' ? 'p' : 'h3', card.title || card.kind === 'verdict' ? null : 'lead', card.text));
  if (card.reckoning) body.append(reckoningBox(card.reckoning, af.st.deeds));
  if (card.lineage) {
    body.append(el('div', 'kicker', 'ผังตระกูล'));
    body.append(list(card.lineage, 'picks'));
    // การ์ดส่งต่อ (B95): ผังตระกูลรวมชีวิตที่เพิ่งจบแล้ว + จุดฐานะบ้านที่รุ่นถัดไปจะเกิด
    const chart = af.heir && standingChart(standingGens(af.heir.lineage), CLASSES.indexOf(af.heir.cls));
    if (chart) body.append(chart);
  }
  if (card.note) body.append(el('p', 'note', card.note));
  if (card.done) {
    choices.append(enter(button(BTN.rebirth, null, () => play(T.rebirth))));
    choices.append(button(BTN.newFamily, null, start));
  } else if (card.choices.length) {
    card.choices.forEach((c, i) => {
      const why = lockText(card, i);
      const b = keyed(button(c, why ?? card.fx?.[i], () => play(afterPick(i)), card.hints?.[i]), i);
      if (why) b.disabled = true;
      choices.append(b);
    });
  } else choices.append(enter(button(BTN.next, null, next)));
  if (card.kind === 'verdict') choices.append(copyButton(() => summaryText(st.age, card.realm)));
  box.append(top);
  if (court) box.append(courtScene());
  box.append(body, choices);
  root.append(box);
}

// ต่างโลก (B68): การ์ดแนวหน้าต่างสถานะของเกม · ปุ่มเดินผ่าน afterPick/afterNext ชุดเดียวกับระหว่างชาติ เซฟจึงเล่นซ้ำได้
const ISEKAI_KICKER = { world: 'ห้องสีขาว · เลือกโลก', skill: 'ของขวัญจากเทพธิดา · เลือกสกิล', event: 'เหตุการณ์', result: 'ผลลัพธ์', end: 'ตอนจบในต่างโลก' };
function isekaiMeter(label, v, cls) {
  const m = el('div', 'imeter');
  const row = el('div', 'irow');
  row.append(el('span', null, label), el('span', null, `${v}/100`));
  const bar = el('div', `ibar ${cls}`);
  const fill = el('i');
  fill.style.width = `${v}%`;
  bar.append(fill);
  m.append(row, bar);
  return m;
}
function isekaiStatusBox(s) {
  const box = el('div', 'iwin');
  box.append(isekaiMeter('HP', s.hp, 'hp'), isekaiMeter(s.goalName, s.goal, 'goal'));
  const grid = el('div', 'istats');
  for (const [k, label] of Object.entries(ISEKAI_STAT)) {
    const d = el('div');
    d.append(el('span', null, label), el('b', null, String(s[k])));
    grid.append(d);
  }
  box.append(grid, el('div', null, `ทอง ${s.gold.toLocaleString('en-US')} · ชื่อเสียง ${s.fame} · ${s.world}`));
  if (s.skills.length) {
    const chips = el('div', 'ichips');
    for (const name of s.skills) chips.append(el('span', 'ichip', name));
    box.append(chips);
  }
  return box;
}
function renderIsekai(card) {
  root.replaceChildren();
  const box = el('article', 'card i');
  const top = el('div', 'top');
  const s = card.status;
  top.append(el('b', null, 'ต่างโลก'), el('small', null, s ? `${genLabel()}${st.name} · ชาติต่างโลกที่ ${card.run + 1} · ${s.name}` : `${genLabel()}${st.name} · ${lifeEndWord(isGone(st))} ${st.age}`));
  const body = el('div', 'body');
  const choices = el('div', 'choices');
  body.append(el('span', 'kicker', card.step === 'event' ? `${card.finale ? 'เหตุการณ์สุดท้าย' : 'เหตุการณ์'} ${card.index}/${card.total}` : ISEKAI_KICKER[card.step]));
  body.append(el('h3', null, card.title), el('p', null, card.text));
  if (card.step === 'result' && card.ok !== null) body.append(el('p', card.ok ? 'iok' : 'ibad', `${card.ok ? 'สำเร็จ' : 'พลาด'} · ${card.stat}`));
  const deltas = Object.entries(card.deltas ?? {});
  if (deltas.length) {
    const label = { hp: 'HP', gold: 'ทอง', fame: 'ชื่อเสียง', goal: s.goalName, ...ISEKAI_STAT };
    body.append(el('p', 'note', deltas.map(([k, v]) => `${label[k]} ${v > 0 ? '+' : ''}${v}`).join(' · ')));
  }
  if (card.sys) body.append(el('p', 'isys', card.sys));
  if (card.note) body.append(el('p', 'isys', card.note));
  if (card.saves) body.append(el('p', 'isys', `สกิลช่วยไว้ ${card.saves} ครั้งในชาตินี้`));
  // ต่างโลกไม่มีฉายาของตัวเอง — เบาะแสชี้ฉายาของโลกเดิมที่ชาติหน้ายังไปเก็บได้ (B108 ใช้สองโลก)
  if (card.step === 'end') clueRow(body, (card.clue ??= titleClue(`${st.seed}:${st.gen}:i${card.run}`)));
  if (card.highlights?.length) body.append(el('p', 'isys', 'ฉากที่จำได้ไม่ลืม'), list(card.highlights, 'picks'));
  if (card.log?.length) {
    const d = el('details', 'tree');
    d.append(el('summary', null, `เส้นทางที่เลือก ${card.log.length} เหตุการณ์`), list(card.log, 'picks'));
    body.append(d);
  }
  if (card.choices.length) {
    card.choices.forEach((c, i) => {
      const why = card.locked?.[i];
      const b = keyed(button(c, why ?? card.fx?.[i], () => play(afterPick(i))), i);
      if (card.desc?.[i]) b.firstChild.append(el('small', 'idesc', card.desc[i]));
      if (why) b.disabled = true;
      choices.append(b);
    });
  } else choices.append(enter(button(BTN.next, null, () => play(T.afterNext))));
  box.append(top);
  if (s) box.append(isekaiStatusBox(s));
  box.append(body, choices);
  root.append(box);
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
let save = null;

// อายุของการ์ดชีวิตใบก่อน/ใบนี้ — จำใน apply ไม่ใช่ตอนวาด เพราะเล่นซ้ำจากเซฟไม่ได้วาดทุกใบ
let curAge = null;
function track(card) {
  if (af) return card;
  prevAge = curAge;
  curAge = card.age;
  bookNote(card);
  if (card.kind === 'stage') {
    noteAsk = askFor(card.recap, card.age, lifeMark);
    lifeMark = markLife();
  }
  return card;
}

// บันทึกชีวิต (B39): ถามบนการ์ดเปลี่ยนช่วงวัย ผู้เล่นพิมพ์ตอบหรือข้าม · ข้อความดิบไม่อยู่ในเซฟ (เซฟเล่นซ้ำจาก seed กับปุ่มเท่านั้น)
// จึงเก็บแยก key ผูก seed ต้นตระกูล — ตระกูลใหม่ไม่เห็นของเก่า · ตอบหรือข้ามไม่แตะ st ผลเกมจึงเท่าเดิม
const NOTES_KEY = 'next-life-notes-v1';
const NOTE_MAX = 160;
let notes = { seed: null, n: [] };
function notesLoad(seed) {
  notes = { seed, n: [] };
  try {
    const v = JSON.parse(localStorage.getItem(NOTES_KEY));
    if (v?.seed === seed && Array.isArray(v.n)) notes.n = v.n.filter((x) => Number.isInteger(x?.g) && Number.isInteger(x?.a) && typeof x.t === 'string');
  } catch {
    // ไม่มีที่เก็บ/ข้อมูลเสีย — เริ่มสมุดเปล่า
  }
}
// ข้าม = เก็บข้อความว่าง การ์ดเดิมที่เปิดซ้ำ (รีโหลด/เล่นต่อ) จึงไม่ถามซ้ำ
function notePut(ask, text) {
  notes.n = [...notes.n.filter((x) => !(x.g === ask.g && x.a === ask.a)), { g: ask.g, a: ask.a, q: ask.q, t: text.trim().slice(0, NOTE_MAX) }];
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {
    // เก็บไม่ได้ยังจำในหน้านี้จนปิด
  }
}
const noteOf = (ask) => notes.n.find((x) => x.g === ask.g && x.a === ask.a);
// สุ่ม 1 บันทึกของรุ่นนั้นจาก seed — เปิดการ์ดตายซ้ำหรือรุ่นถัดไปเห็นบันทึกเดียวกัน ไม่กินเลขสุ่มของเกม
function notePick(g) {
  const xs = notes.n.filter((x) => x.g === g && x.t).sort((x, y) => x.a - y.a);
  return xs.length ? xs[fnv(`${notes.seed}:${g}`) % xs.length] : null;
}

// คำถามตามสิ่งที่เกิดในช่วงที่เพิ่งจบ: เทียบคนในบ้าน/การล้มละลาย ต้นช่วงกับตอนนี้
// จดตอนผ่านการ์ด (track) ซึ่งเล่นซ้ำจากเซฟก็ผ่านครบทุกใบ — ไม่ต้องเพิ่มช่องในแกนเกม
let lifeMark = null;
let noteAsk = null;
const markLife = () => ({
  parents: st.parents.map((p) => p.alive),
  kin: Object.fromEntries((st.kin ?? []).filter((m) => m.role !== 'pet' && m.role !== 'peer').map((m) => [m.id, { role: m.role, alive: m.alive, left: !!m.left }])),
  broke: st.bankruptcies,
});
const STAGE_ASK = {
  'เด็ก': 'วัยเด็กจบแล้ว โตขึ้นอยากเป็นอะไร',
  'วัยรุ่น': 'พ้นวัยรุ่นแล้ว มีอะไรอยากบอกตัวเองตอนเด็กไหม',
  'หนุ่มสาว': 'ผ่านวัยหนุ่มสาวมาแล้ว ตอนนี้อะไรสำคัญกับคุณที่สุด',
  'ทำงาน': 'ทำงานมาหลายปี ที่ผ่านมาคุ้มไหม',
  'กลางคน': 'ใกล้วัยชราแล้ว อยากใช้เวลาที่เหลืออย่างไร',
};
// อายุของบันทึก = อายุบนหัวการ์ดที่ถาม (ต้นช่วงใหม่) ไม่ใช่ปลายช่วงที่เพิ่งจบ — ผู้เล่นเห็นเลขเดียวกันทั้งแผ่นและหัวการ์ด
function askFor(r, age, was) {
  const now = markLife();
  const kinNow = Object.entries(now.kin);
  const lost = (role) => was && kinNow.some(([id, m]) => m.role === role && !m.alive && was.kin[id]?.alive);
  const got = (role) => was && kinNow.some(([id, m]) => m.role === role && m.alive && !m.left && !was.kin[id]);
  const parent = was ? now.parents.findIndex((alive, i) => !alive && was.parents[i]) : -1;
  let q;
  if (parent >= 0) q = `${st.parents[parent].sex === 'ชาย' ? 'พ่อ' : 'แม่'}จากไปแล้ว ถ้าได้บอกอะไรอีกสักประโยค จะบอกว่าอะไร`;
  else if (lost('spouse')) q = 'คู่ชีวิตจากไปแล้ว อยากบอกอะไรเขาเป็นครั้งสุดท้าย';
  else if (lost('child')) q = 'ลูกจากไปก่อน มีอะไรค้างในใจที่อยากเขียนไว้ไหม';
  else if (got('child')) q = 'เพิ่งมีลูก อยากให้ลูกรู้อะไรตอนเขาโตขึ้น';
  else if (got('spouse')) q = 'เพิ่งได้คู่ชีวิต อยากจำช่วงนี้ไว้ว่าอย่างไร';
  else if (was && now.broke > was.broke) q = 'เพิ่งล้มละลาย อยากบอกอะไรกับตัวเองที่ต้องเริ่มใหม่';
  else {
    // เรื่องเด่นชุดเดียวกับบนการ์ดนี้ — ผู้เล่นเพิ่งเห็น ไม่มีอะไรใหม่ให้รั่ว
    const h = stageSummary(st, r.stage, r.fromAge, r.toAge).highlights.at(-1);
    q = h ? `ตอนอายุ ${h.age} คุณเลือก “${h.text}” ถ้าย้อนไปได้ จะบอกตัวเองตอนนั้นว่าอะไร` : STAGE_ASK[r.stage];
  }
  return q ? { g: st.gen, a: age, q } : null;
}

// สมุดชีวิต (B48): จดการ์ดตอนผ่าน track — เล่นซ้ำจากเซฟก็ผ่านครบทุกใบ แกนเกมจึงไม่ต้องเก็บประวัติเพิ่ม
// ตัวเลือกที่กดยังไม่รู้ตอนการ์ดออก จำตำแหน่งใน st.log ไว้อ่านตอนเปิดสมุด
// น้ำหนัก: ผลที่ตามมา > บ้านเมือง > งาน/ครอบครัว > ที่เหลือ · ลาง เงินเก็บ เปลี่ยนช่วงวัย ไม่ขึ้นหน้า (มีสรุปของตัวเองแล้ว)
const BOOK_W = { result: 5, era: 4, near: 3, other: 1 };
const BOOK_NEAR = /^(career|work|biz|pet|herd|school|retirement|milestone|child|old)_/;
const BOOK_STORIES = 8;
const BOOK_PER_STAGE = 2;
const BOOK_NOTES = 2;
let bookCards = [];
// เหตุการณ์บ้านเมืองที่ชีวิตนี้เห็น (B51) — จดตอนการ์ดผ่าน track เหมือนสมุดชีวิต เล่นซ้ำจากเซฟก็ได้ครบ
let eraSeen = [];
let bookIntro = null;
// ลำดับการ์ดที่ผ่านมา — ใช้ดูว่าการ์ดผลตามหลังการ์ดเลือกทันทีหรือไม่
let bookSeq = 0;
function bookNote(card) {
  if (card.kind === 'intro') bookIntro = card;
  const last = bookCards.at(-1);
  // ผลของตัวเลือกเล่าต่อในหน้าเดียวกับการ์ดที่เลือก ผู้อ่านเห็นเหตุกับผลคู่กัน
  if (card.kind === 'result' && last?.card.kind === 'event' && last.card.age === card.age && !last.result && last.next === bookSeq) {
    last.result = card.text;
    last.w = BOOK_W.result;
  } else {
    const w = card.kind === 'result' ? BOOK_W.result
      : card.kind === 'era' || card.national || card.news ? BOOK_W.era
      : card.kind === 'event' && !card.funeral ? (BOOK_NEAR.test(card.id) ? BOOK_W.near : BOOK_W.other)
      : 0;
    if (w) bookCards.push({ card, w, at: st.log.length, next: bookSeq + 1 });
  }
  const era = card.kind === 'era' ? card.id : card.news && ERA_OF.get(card.id);
  if (era) eraSeen.push({ id: era, a: card.age });
  bookSeq++;
}
const bookReset = () => {
  bookCards = [];
  eraSeen = [];
  bookIntro = null;
  bookSeq = 0;
};

// คัดหน้าจากน้ำหนัก เสมอกันใช้เลขจาก seed — เปิดซ้ำได้หน้าเดิม ไม่กินเลขสุ่มของเกม
// รอบแรกช่วงวัยละไม่เกิน BOOK_PER_STAGE หน้า สมุดจึงเล่าทั้งชีวิต ไม่กองอยู่ช่วงที่การ์ดถี่
function bookPicks(n) {
  const key = `${save.seed}:${st.gen}`;
  const ranked = bookCards.map((p, i) => ({ ...p, i, r: fnv(`${key}:${i}`) })).sort((a, b) => b.w - a.w || a.r - b.r);
  const per = {};
  const pick = [];
  for (const p of ranked) {
    if (pick.length >= n) break;
    if ((per[p.card.stage] ?? 0) >= BOOK_PER_STAGE) continue;
    per[p.card.stage] = (per[p.card.stage] ?? 0) + 1;
    pick.push(p);
  }
  for (const p of ranked) if (pick.length < n && !pick.includes(p)) pick.push(p);
  return pick.sort((a, b) => a.i - b.i);
}

function bookPages(death) {
  const said = notes.n.filter((x) => x.g === st.gen && x.t).sort((x, y) => x.a - y.a);
  const keep = said.length <= BOOK_NOTES ? said : [...said].sort((x, y) => fnv(`${notes.seed}:${x.a}`) - fnv(`${notes.seed}:${y.a}`)).slice(0, BOOK_NOTES).sort((x, y) => x.a - y.a);
  // บันทึกถามตอนต้นช่วงใหม่ จึงวางหลังเรื่องที่อายุเท่ากัน
  const mid = [...bookPicks(BOOK_STORIES - keep.length).map((p) => ({ age: p.card.age, o: 0, draw: (b) => storyPage(b, p) })), ...keep.map((x) => ({ age: x.a, o: 1, draw: (b) => notePage(b, x) }))].sort((a, b) => a.age - b.age || a.o - b.o);
  return [{ draw: (b) => coverPage(b, death) }, ...mid, { draw: standPage }, { draw: (b) => endPage(b, death) }];
}

// หน้าฐานะตระกูล (B95) ก่อนหน้าสุดท้าย — รุ่นก่อนทั้งหมด + ชีวิตนี้ถึงวันตาย
function standPage(body) {
  body.append(el('span', 'kicker', 'ฐานะตระกูล'), el('h3', null, st.lineage.length ? `ตระกูลนี้ ${st.lineage.length + 1} รุ่น` : 'ฐานะตลอดชีวิตนี้'));
  const chart = standingChart(standingGens(st.lineage, standingNow(true)), null, false);
  if (chart) body.append(chart);
}

function coverPage(body, death) {
  body.append(el('span', 'kicker', 'สมุดชีวิต'), el('h3', null, st.name), el('p', 'dates', `${genLabel()}อายุ 0–${death.age} ปี · ${provinceLabel(st)}`));
  if (bookIntro) body.append(el('p', 'sub', bookIntro.text));
}
function storyPage(body, p) {
  const c = p.card;
  const kicker = c.kind === 'result' ? KICKER.result : c.kind === 'era' || c.national ? KICKER.era : `ช่วง${c.stage}`;
  body.append(el('span', 'kicker', `อายุ ${c.age} · ${c.news ? `${kicker} · ${c.news.text}` : kicker}`));
  if (c.kind === 'event') {
    if (c.title) body.append(el('h3', null, c.title));
    body.append(el(c.title ? 'p' : 'h3', c.title ? null : 'lead', c.text));
    // จับคู่ด้วย id กับอายุ — การ์ดเล่าเรื่องไม่มีตัวเลือก ตำแหน่งเดิมใน log จึงอาจเป็นของใบถัดไป
    const pick = st.log[p.at];
    if (pick && pick.id === c.id && pick.age === c.age) body.append(el('p', 'pick', `เลือก “${pick.text}”`));
    if (p.result) body.append(el('p', 'sub', p.result));
  } else {
    body.append(el('h3', c.kind === 'era' ? null : 'lead', c.text));
    if (c.story) body.append(el('p', null, c.story));
  }
}
function notePage(body, x) {
  body.append(el('span', 'kicker', `อายุ ${x.a} · บันทึกถึงตัวเอง`), el('p', 'sub', x.q), noteQuote(`บันทึกเมื่ออายุ ${x.a}`, x.t));
}
function endPage(body, death) {
  body.append(el('span', 'kicker', `อายุ ${death.age}`), el('h3', 'lead', `${st.name} จากไปด้วยวัย ${death.age} ปี`));
  if (death.note) body.append(el('p', 'sub', death.note));
  if (death.funeral) body.append(el('p', 'sub', `งานศพ: ${death.funeral.text}`));
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
    root.append(box);
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
    st = nextLife(af);
    af = null;
    curAge = null;
    lifeMark = markLife();
    bookReset();
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
const uiState = () => ({ save, prevAge, curAge, lifeMark, noteAsk, bookCards, eraSeen, bookIntro, bookSeq });
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
    ({ save, prevAge, curAge, lifeMark, noteAsk, bookCards, eraSeen, bookIntro, bookSeq } = root.ui);
    notesLoad(save.seed);
    let card = root.card;
    if (!af && repairLife(st, card)) card = track(nextCard(st));
    else if (af && card.choices?.length && !af.pending) card = nextAfterCard(af);
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
  lifeMark = markLife();
  bookReset();
  notesLoad(seed);
  return track(nextCard(st));
}

// seed จากเวลาเฉพาะฝั่งหน้าเว็บ แกนเกมเองไม่แตะนาฬิกา
const freshSeed = () => (Date.now() ^ (performance.now() * 1000)) >>> 0;

function start() {
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
  top.append(el('b', null, GAME_NAME), el('small', null, title));
  const body = el('div', 'body');
  lines.forEach((t, i) => body.append(el(i ? 'p' : 'h3', i ? 'sub' : 'lead', t)));
  const choices = el('div', 'choices');
  box.append(top, body, choices);
  root.append(box);
  return choices;
}

// ล้างเซฟ = ลบทั้งตระกูล จึงถามซ้ำก่อน · สมุดฉายา/สมุดอนุสรณ์แยก key ไม่โดนล้าง
function confirmNew(back) {
  const choices = homeCard('เริ่มตระกูลใหม่', ['ลบชีวิตที่ค้างไว้ทั้งตระกูล?', 'ผังตระกูลและสิ่งที่สืบทอดจะหายทั้งหมด กู้คืนไม่ได้ · สมุดฉายาและสมุดอนุสรณ์ยังอยู่']);
  choices.append(button('ลบแล้วเริ่มตระกูลใหม่', null, start), button('ยกเลิก', null, back));
}

function home(card) {
  const where = af ? `ระหว่างชาติ หลัง${lifeEndWord(isGone(st))} ${st.age}` : `อายุ ${st.age} · ${provinceLabel(st)}`;
  const choices = homeCard('เล่นต่อ', ['มีชีวิตที่เล่นค้างไว้', `${genLabel()}${st.name} · ${where}`]);
  choices.append(enter(button(BTN.resume, null, () => show(card))), button(BTN.newFamily, null, () => confirmNew(() => home(card))), button(BTN.memorial, null, () => openMemo()));
}

// เซฟจากเวอร์ชันที่เนื้อหาต่างกัน (B122): เซฟคือ seed + ลำดับปุ่ม เล่นซ้ำบนเนื้อหาใหม่ไม่ได้ชีวิตเดิม จึงเริ่มชีวิตใหม่
// สมุดฉายา สมุดอนุสรณ์ และบันทึกชีวิตแยก key ไว้ ไม่โดนล้าง
function staleSave() {
  const choices = homeCard('เกมอัปเดตแล้ว', ['ชีวิตที่ค้างไว้เล่นต่อไม่ได้', 'เนื้อเรื่องเปลี่ยนตั้งแต่เล่นครั้งก่อน เริ่มชีวิตใหม่ในเวอร์ชันนี้ได้เลย · สมุดฉายาและสมุดอนุสรณ์ยังอยู่']);
  choices.append(enter(button('เริ่มชีวิตใหม่', null, start)), button(BTN.memorial, null, () => openMemo()));
}

// ลิงก์ท้ายหน้าเปิดสมุดได้ทุกหน้า (หน้า "เล่นต่อ" ขึ้นเฉพาะตอนมีเซฟ) · เปิดซ้อนตัวเองไม่ได้ ไม่งั้นปุ่มกลับพากลับมาที่สมุด
document.getElementById('memoLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (!root.querySelector('.memo-view')) openMemo();
});
memoDot();
// เพดานความสูงการ์ด (B116) หักหัวเว็บ — ชื่อเกมตัดสองบรรทัดบนจอแคบ หัวจึงสูงไม่ตายตัว วัดจริงแทนเดาค่าเดียว · 20 = ระยะบนของ #app
const chromeH = () => document.documentElement.style.setProperty('--chrome', `${(document.querySelector('.logo')?.offsetHeight ?? 116) + 20}px`);
chromeH();
addEventListener('resize', chromeH);
document.fonts?.ready.then(chromeH);

// ภาพถ่าย v2 ก่อน · ไม่มีจึงลองเซฟ v1 (เล่นซ้ำตรงการ์ดเดิม = เขียนทับเป็น v2 ทันที) · v1 ไม่ตรง/เซฟเสีย = หน้าเกมอัปเดต
function boot() {
  let card = snapRead();
  if (!card) {
    const s = saveRead();
    if (!s && !snapExists()) return start();
    card = s && resume(s);
    if (!card) return staleSave();
    saveWrite(card);
  }
  savedMark(true);
  home(card);
}

boot();
