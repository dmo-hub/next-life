import { newLife, nextCard, choose, profileText, statsOf } from '../engine/index.mjs';

const root = document.getElementById('app');
let st;

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function bar(label, v) {
  const row = el('div', 'bar');
  row.append(el('span', 'lbl', label));
  const track = el('div', 'track');
  const fill = el('div', 'fill');
  fill.style.width = `${Math.round(v)}%`;
  track.append(fill);
  row.append(track);
  return row;
}

const SVG = 'http://www.w3.org/2000/svg';
const baht = (v) => `${Math.round(v).toLocaleString('en-US')} บาท`;

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

function render(card) {
  root.replaceChildren();
  const s = statsOf(st);
  const head = el('div', 'head');
  head.append(el('div', 'profile', profileText(st)));
  head.append(bar('สุขภาพ', s.health), bar('ความสุข', s.happiness), bar('ความรู้', s.knowledge), bar('ความสัมพันธ์', s.relations));
  head.append(el('div', 'money', `เงิน ${baht(s.money)}`));
  root.append(head);

  const box = el('div', 'card');
  box.append(el('p', card.kind === 'death' ? 'text death' : 'text', card.text));
  if (card.stage) box.prepend(el('div', 'stage', `ช่วง${card.stage}`));
  if (card.kind === 'summary') {
    if (card.items.length) {
      const ul = el('ul', 'items');
      for (const it of card.items) ul.append(el('li', null, it));
      box.append(ul);
    }
    const chart = sparkline(card.moneySeries);
    if (chart) box.append(chart);
    box.append(el('p', 'sub', `เงิน ${baht(card.money)} ≈ ${baht(card.moneyAtBirth)} ค่าเงินปีเกิด`));
    const b = el('button', 'choice', 'ต่อไป');
    b.onclick = () => render(nextCard(st));
    box.append(b);
  } else if (card.kind === 'stage' || card.kind === 'era') {
    const b = el('button', 'choice', 'ต่อไป');
    b.onclick = () => render(nextCard(st));
    box.append(b);
  } else if (card.kind === 'event') {
    card.choices.forEach((c, i) => {
      const b = el('button', 'choice', c);
      b.onclick = () => {
        choose(st, i);
        render(nextCard(st));
      };
      box.append(b);
    });
  } else {
    box.append(el('p', 'sub', `ปี ${card.summary.year} · เงินคงเหลือ ${card.summary.money.toLocaleString('en-US')} บาท`));
    const sim = card.summary.simulatedFrom ? ` (เงินเฟ้อตั้งแต่ปี ${card.summary.simulatedFrom} เป็นอนาคตจำลอง)` : '';
    box.append(el('p', 'sub', `≈ ${card.summary.moneyAtBirth.toLocaleString('en-US')} บาท ค่าเงินปีเกิด${sim}`));
    if (card.note) box.append(el('p', 'sub', card.note));
    const b = el('button', 'choice', 'เกิดใหม่');
    b.onclick = start;
    box.append(b);
  }
  root.append(box);
}

function start() {
  // seed จากเวลาเฉพาะฝั่งหน้าเว็บ แกนเกมเองไม่แตะนาฬิกา
  st = newLife((Date.now() ^ (performance.now() * 1000)) >>> 0, CONTENT);
  render(nextCard(st));
}

start();
