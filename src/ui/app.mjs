import { newLife, nextCard, choose, statsOf, regionLabel, STAT_LABELS, STAT_KEYS, isWorking, monthlyIncome, jobText } from '../engine/index.mjs';

const root = document.getElementById('app');
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

const KICKER = { summary: 'สรุปปี', stage: 'เปลี่ยนช่วงชีวิต', era: 'บ้านเมือง', omen: 'ลาง', alloc: 'เงินเก็บ', result: 'ผลที่ตามมา' };

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
    body.append(el('p', 'sub', `เงินคงเหลือ ${baht(card.summary.money)} ≈ ${baht(card.summary.moneyAtBirth)} ค่าเงินปีเกิด`));
    if (card.note) body.append(el('p', 'sub', card.note));
    body.append(reckoningBox(card.reckoning));
    if (card.recap) body.append(recap(card.recap));
    choices.append(button('เกิดใหม่', null, start));
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
    } else if (card.kind === 'summary') {
      body.append(el('h3', null, card.text));
      if (card.items.length) body.append(list(card.items));
      const chart = sparkline(card.moneySeries);
      if (chart) body.append(chart);
      body.append(el('p', 'sub', `เงิน ${baht(card.money)} ≈ ${baht(card.moneyAtBirth)} ค่าเงินปีเกิด`));
      if (card.disclaimer) body.append(el('p', 'note', card.disclaimer));
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
