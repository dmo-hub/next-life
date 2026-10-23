import { newLife, nextCard, choose, statsOf, regionLabel, STAT_LABELS, STAT_KEYS, isWorking, monthlyIncome, jobText } from '../engine/index.mjs';

// เลขเวอร์ชันเดโม — เขียนทับโดย `npm run bump` (patch +1 · `npm run bump -- minor` = minor +1 patch 00) ห้ามแก้รูปแบบบรรทัด
const APP_VERSION = 'v0.1.01';
const APP_BUILD = '2026-10-23';

const root = document.getElementById('app');
document.getElementById('appVer').textContent = `${APP_VERSION} · ${APP_BUILD}`;
let st;

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

// เฉลยบัญชีบุญบาปตอนสิ้นชีวิต (ใบ 09) — ระหว่างชีวิตผู้เล่นไม่เคยเห็นตัวเลขนี้
function reckoningBox(r) {
  const box = el('div', 'recap');
  box.append(el('div', 'h', 'บัญชีบุญบาป เฉลยตอนสิ้นชีวิต'));
  box.append(el('p', null, `บุญ ${r.good} · บาป ${r.bad} · ${r.lean === 'เสมอ' ? 'บุญบาปพอ ๆ กัน' : `หนักไปทาง${r.lean}`}`));
  if (r.top.length) box.append(list(r.top.map((t) => `${t.bad ? 'บาป' : 'บุญ'} · ${t.name} ${t.weight}`), 'picks'));
  else box.append(el('p', 'sub', 'ชีวิตนี้ไม่ได้ทำบุญหรือบาปที่นับได้'));
  return box;
}

// ลวดลาย/ฉายามาจาก B10 (card.pattern · card.titles เรียงหายากก่อน) — ก่อนนั้นใช้ค่าวาง ??? แบบช่องที่ยังไม่เปิดในสมุดฉายา
const TITLE_STUB = {
  pattern: { name: '???', hint: 'ลวดลายชีวิตยังไม่เปิด' },
  titles: [
    { name: '???', tier: 'ตำนาน' },
    { name: '???', tier: 'หายาก' },
    { name: '???', tier: 'หายาก' },
    { name: '???', tier: 'ทั่วไป' },
    { name: '???', tier: 'ทั่วไป' },
  ],
};
const lifeTitles = (card) => ({ pattern: card.pattern ?? TITLE_STUB.pattern, titles: card.titles ?? TITLE_STUB.titles });
const TITLES_SHOWN = 3;

// บันทึกการตาย (ใบ 04): ลวดลาย 1 + ฉายาเด่น 3 + ปุ่มดูทั้งหมด
function titlesBox(card) {
  const { pattern, titles } = lifeTitles(card);
  const box = el('div', 'recap titles');
  box.append(el('div', 'h', 'ลวดลายชีวิต'));
  box.append(el('p', 'pattern', pattern.name));
  if (pattern.hint) box.append(el('p', 'note', pattern.hint));
  box.append(el('div', 'h', 'ฉายาเด่น'));
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
  return box;
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
  if (document.fonts) {
    await Promise.race([
      Promise.all(SHARE_FONTS.map((f) => document.fonts.load(f, 'ชาติหน้า'))),
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
  const ready = shareBlob(shareFacts(card));
  ready.catch(() => {});
  const name = `next-life-age-${card.age}.png`;
  const act = (label, fn) => {
    const b = button(label, null, async () => {
      b.disabled = true;
      try {
        await fn(await ready);
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
    top.append(el('b', null, 'มรณบัตร'), el('small', null, `สิริอายุ ${card.age} ปี`));
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
    body.append(reckoningBox(card.reckoning));
    if (card.recap) body.append(recap(card.recap));
    choices.append(...shareButtons(card), button('เกิดใหม่', null, start));
  } else {
    top.append(el('b', null, `อายุ ${card.age} · ช่วง${card.stage}`), el('small', null, regionLabel(st)));
    box.append(top, stats(s));
    // มีงานทำแล้วบอกรายได้ต่อเดือน ก่อนทำงาน/หลังเกษียณไม่มีรายได้ จึงบอกเงินติดตัวแทน
    const purse = isWorking(st, card.age)
      ? `รายได้ ${baht(monthlyIncome(st, year))}/เดือน`
      : `เงินติดตัว ${baht(s.money)}`;
    box.append(el('div', 'meta', `ฐานะ${st.cls} · ${jobText(st, card.age)} · ${purse}`));
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
    }
  }
  box.append(body, choices);
  root.append(box);
}

function start() {
  // seed จากเวลาเฉพาะฝั่งหน้าเว็บ แกนเกมเองไม่แตะนาฬิกา
  st = newLife((Date.now() ^ (performance.now() * 1000)) >>> 0, CONTENT);
  render(nextCard(st));
}

start();
