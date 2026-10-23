import { newLife, nextCard, choose, statsOf, regionLabel, STAT_LABELS, STAT_KEYS, isWorking, monthlyIncome, jobText, startAfterlife, nextAfterCard, chooseAfter, nextLife, lineageText, titlesOf, ALL_PATTERNS, TITLES, FAMILY_TITLES, TIERS } from '../engine/index.mjs';

// เลขเวอร์ชันเดโม — เขียนทับโดย `npm run bump` (patch +1 · `npm run bump -- minor` = minor +1 patch 00) ห้ามแก้รูปแบบบรรทัด
const APP_VERSION = 'v0.2.10';
const APP_BUILD = '2026-10-24';

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

// กราฟเงินของช่วงที่ผ่านไป — จุดเดียวไม่มีเส้นให้วาด
function sparkline(series) {
  if (series.length < 2) return null;
  const vals = series.map((p) => p.money);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'spark');
  svg.setAttribute('viewBox', '0 0 100 40');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `เงิน ${baht(vals[0])} → ${baht(vals.at(-1))}`);
  const line = document.createElementNS(SVG, 'polyline');
  line.setAttribute('points', vals.map((v, i) => `${(i / (vals.length - 1)) * 100},${hi === lo ? 20 : 38 - ((v - lo) / (hi - lo)) * 36}`).join(' '));
  svg.append(line);
  return svg;
}

function list(items, cls = 'items') {
  const ul = el('ul', cls);
  for (const it of items) ul.append(el('li', null, it));
  return ul;
}

// สรุปช่วงวัยที่ผ่านมา: แถบตอนนี้ + ขีดตำแหน่งต้นช่วง — บอกว่าเปลี่ยนไปมากน้อยโดยไม่มีตัวเลข
const RECAP_PICKS = 8;
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
  box.append(el('p', 'note', `เทียบค่าเงินปีเกิด ${baht(m.fromAtBirth)} → ${baht(m.toAtBirth)}`));
  const chart = sparkline(r.moneySeries);
  if (chart) box.append(chart);
  if (r.items.length) box.append(list(r.items));
  if (r.disclaimer) box.append(el('p', 'note', r.disclaimer));
  if (r.picks.length) {
    box.append(el('div', 'h', 'สิ่งที่เลือก'));
    const shown = r.picks.slice(-RECAP_PICKS).map((p) => `อายุ ${p.age} · ${p.text}`);
    if (r.picks.length > RECAP_PICKS) shown.unshift(`… ก่อนหน้านี้อีก ${r.picks.length - RECAP_PICKS} ข้อ`);
    box.append(list(shown, 'picks'));
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
    who: `${st.sex} · ${regionLabel(st)} · ฐานะ${st.cls}`,
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
      await navigator.share({ files: [file], title: 'ชาติหน้า · Next Life', text: `ชาติหน้า · ตายอายุ ${card.age} — ${SHARE_URL}` });
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

// แนวการ์ดตามประเภทเหตุการณ์ (ใบ 06): ลางกับเหตุการณ์ความเชื่อเป็นทาง B ที่เหลือเป็นทาง A
const styleOf = (card) => (card.kind === 'omen' || ((card.kind === 'event' || card.kind === 'result') && card.type === 'B') ? 'b' : 'a');

const KICKER = { stage: 'เปลี่ยนช่วงชีวิต', era: 'บ้านเมือง', omen: 'ลาง', alloc: 'เงินเก็บ', result: 'ผลที่ตามมา' };

function render(card) {
  root.replaceChildren();
  const s = statsOf(st);
  // ปีเกมใช้ภายในเท่านั้น หน้าจอบอกแค่อายุ (B14 ข้อ 12)
  const year = st.birthYear + card.age;
  const box = el('article', `card ${styleOf(card)}`);
  const top = el('div', 'top');
  const body = el('div', 'body');
  const choices = el('div', 'choices');
  const next = () => render(nextCard(st));

  if (card.kind === 'death') {
    top.append(el('b', null, 'มรณบัตร'), el('small', null, `${genLabel()}สิริอายุ ${card.age} ปี`));
    box.append(top);
    body.append(el('span', 'stamp', 'ถึงแก่กรรม'));
    body.append(el('h3', null, `ตายอายุ ${card.age}`));
    body.append(el('p', null, `${st.sex} · ${regionLabel(st)} · ฐานะ${st.cls} · ${card.job}${st.edu ? ` · วุฒิ${st.edu}` : ''}`));
    const net = card.summary.money < 0 ? 'ตายพร้อมหนี้' : 'ทรัพย์สุทธิ';
    body.append(el('p', 'sub', `${net} ${baht(card.summary.money)} ≈ ${baht(card.summary.moneyAtBirth)} ค่าเงินปีเกิด`));
    if (card.summary.debt) body.append(el('p', 'sub', `หนี้ผ่อนค้าง ${baht(card.summary.debt)}`));
    if (card.summary.bankruptcies) body.append(el('p', 'sub', `เคยล้มละลาย ${card.summary.bankruptcies} ครั้ง`));
    if (card.note) body.append(el('p', 'sub', card.note));
    body.append(titlesBox(card));
    const tree = familyTree();
    if (tree) body.append(tree);
    // บัญชีบุญบาปเฉลยที่การ์ดศาลในระหว่างชาติ ไม่ใช่การ์ดตาย · ตายตอนเด็กได้บันทึกสั้น (ใบ 07) — ไม่มีสรุปช่วงวัย
    if (card.recap && !card.short) body.append(recap(card.recap));
    choices.append(button('ไปช่วงระหว่างชาติ', null, () => {
      af = startAfterlife(st);
      renderAfter(nextAfterCard(af));
    }), ...shareButtons(card));
  } else {
    top.append(el('b', null, `อายุ ${card.age} · ช่วง${card.stage}`), el('small', null, `${genLabel()}${regionLabel(st)}`));
    box.append(top, stats(s));
    // มีงานทำแล้วบอกรายได้ต่อเดือน ก่อนทำงาน/หลังเกษียณไม่มีรายได้ จึงบอกเงินติดตัวแทน
    const purse = isWorking(st, card.age)
      ? `รายได้ ${baht(monthlyIncome(st, year))}/เดือน`
      : `เงินติดตัว ${baht(s.money)}`;
    box.append(el('div', 'meta', `ฐานะ${st.cls} · ${jobText(st, card.age)} · ${purse}`));
    const tree = familyTree();
    if (tree) box.append(tree);
    body.append(el('span', 'kicker', card.kind === 'event' ? (card.national ? KICKER.era : `ช่วง${card.stage}`) : KICKER[card.kind]));

    if (card.kind === 'stage') {
      body.append(el('span', 'stamp', card.text));
      body.append(recap(card.recap));
      choices.append(button('ต่อไป', null, next));
    } else if (card.kind === 'era' || card.kind === 'omen' || card.kind === 'result') {
      body.append(el('h3', null, card.text));
      choices.append(button('ต่อไป', null, next));
    } else {
      if (card.title) body.append(el('h3', null, card.title));
      body.append(el(card.title ? 'p' : 'h3', card.title ? null : 'lead', card.text));
      if (card.items?.length) body.append(list(card.items));
      if (card.disclaimer) body.append(el('p', 'note', card.disclaimer));
      card.choices.forEach((c, i) => {
        const why = card.locked?.[i];
        // ตัวเลือกที่ล็อกยังแสดงให้เห็นทางที่พลาด · ป้ายผลแทนด้วยเหตุผลที่กดไม่ได้
        const b = button(c, why ?? card.fx?.[i], () => {
          choose(st, i);
          next();
        });
        if (why) b.disabled = true;
        choices.append(b);
      });
      // การ์ดเล่าเรื่อง (choices: []) ไม่มีปุ่มให้เลือก — ต้องมีทางไปใบถัดไป
      if (!card.choices.length) choices.append(button('ต่อไป', null, next));
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
  top.append(el('b', null, 'ระหว่างชาติ'), el('small', null, `${genLabel()}ตายอายุ ${st.age}`));
  const body = el('div', 'body');
  const choices = el('div', 'choices');
  const next = () => renderAfter(nextAfterCard(af));
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
    choices.append(button('ไปเกิด', null, () => {
      st = nextLife(af);
      af = null;
      render(nextCard(st));
    }));
    choices.append(button('เริ่มตระกูลใหม่', null, start));
  } else if (card.choices.length) {
    card.choices.forEach((c, i) => {
      const why = card.locked?.[i];
      const b = button(c, why ?? card.fx?.[i], () => {
        chooseAfter(af, i);
        next();
      });
      if (why) b.disabled = true;
      choices.append(b);
    });
  } else choices.append(button('ต่อไป', null, next));
  box.append(top);
  if (court) box.append(courtScene());
  box.append(body, choices);
  root.append(box);
}

function start() {
  // seed จากเวลาเฉพาะฝั่งหน้าเว็บ แกนเกมเองไม่แตะนาฬิกา
  st = newLife((Date.now() ^ (performance.now() * 1000)) >>> 0, CONTENT);
  af = null;
  render(nextCard(st));
}

start();
