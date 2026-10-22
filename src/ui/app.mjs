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

function render(card) {
  root.replaceChildren();
  const s = statsOf(st);
  const head = el('div', 'head');
  head.append(el('div', 'profile', profileText(st)));
  head.append(bar('สุขภาพ', s.health), bar('ความสุข', s.happiness), bar('ความรู้', s.knowledge), bar('ความสัมพันธ์', s.relations));
  head.append(el('div', 'money', `เงิน ${Math.round(s.money).toLocaleString('en-US')} บาท`));
  root.append(head);

  const box = el('div', 'card');
  box.append(el('p', card.kind === 'death' ? 'text death' : 'text', card.text));
  if (card.kind === 'event') {
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
    box.append(el('p', 'sub', `≈ ${card.summary.moneyAtBirth.toLocaleString('en-US')} บาท ค่าเงินปีเกิด`));
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
