// เซฟภาพถ่ายสถานะ (B128): เล่นถึงกลางทาง → snapshot → restore → เล่นต่อด้วยปุ่มเดิม ต้องได้รอยการเล่นเท่าเล่นรวด
// ทุกบอท · ทั้งชีวิตและระหว่างชาติ · ตัวควบคุม: restore แล้วเลื่อนตัวสุ่ม 1 ครั้ง ต้องจับได้ว่าไม่เท่า
import { createHash } from 'node:crypto';
import { newLife, nextCard, choose, startAfterlife, nextAfterCard, chooseAfter, mixSeed, makeRng, snapshot, restore, repairLife } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 120), seed = arg('--seed', 1);
const content = loadContent();

// เล่นทั้งชีวิตต่อด้วยระหว่างชาติ · cut = ลำดับการ์ดที่จะ snapshot/restore ก่อนกด · nudge = ตัวควบคุมเลื่อนตัวสุ่มหลัง restore
function run(s, bot, cut = -1, nudge = false, sizes = null) {
  const h = createHash('sha256');
  const bRng = makeRng(s ^ 0x5bd1e995);
  let root = { st: newLife(s, content), af: null };
  let i = 0;
  const hop = (card) => {
    if (i++ !== cut) return card;
    const text = snapshot({ ...root, card }, content);
    sizes?.push(text.length);
    const back = restore(text, content);
    if (!back.af) repairLife(back.st, back.card);
    if (nudge) (back.af ? back.af.rng : back.st.rng).next();
    root = { st: back.st, af: back.af };
    return back.card;
  };
  for (;;) {
    const card = hop(nextCard(root.st));
    h.update(JSON.stringify(card) + root.st.money.toFixed(6));
    if (card.kind === 'death') break;
    if (card.choices?.length) choose(root.st, bot(card, bRng, root.st));
  }
  root.af = startAfterlife(root.st);
  for (let g = 0; g < 400; g++) {
    const card = hop(nextAfterCard(root.af));
    h.update(JSON.stringify(card));
    if (card.choices?.length) chooseAfter(root.af, bot(card, root.af.botRng, root.af));
    if (card.done) break;
  }
  return { hash: h.digest('hex'), cards: i };
}

const fail = [];
const sizes = [];
let pairs = 0, ctlCaught = 0, ctlRuns = 0;
for (const [name, bot] of Object.entries(BOTS)) {
  for (let k = 0; k < n / Object.keys(BOTS).length; k++) {
    const s = mixSeed(seed, k);
    const base = run(s, bot);
    // จุดตัด 3 จุด: ต้นชีวิต · กลาง · ช่วงระหว่างชาติ (การ์ดท้าย ๆ)
    for (const cut of [5, Math.floor(base.cards / 2), base.cards - 3]) {
      const got = run(s, bot, cut, false, sizes);
      pairs++;
      if (got.hash !== base.hash) fail.push(`${name} seed ${s} ตัดที่การ์ด ${cut}/${base.cards}`);
    }
    if (k < 3) {
      ctlRuns++;
      if (run(s, bot, Math.floor(base.cards / 2), true).hash !== base.hash) ctlCaught++;
    }
  }
}
// เนื้อหาเปลี่ยนระหว่างเซฟกับโหลด (จำลอง bump): ตัดการ์ดที่ค้างอยู่ออกจากเนื้อหา + ตัวเลือกการ์ดอื่นถูกลบหนึ่งทาง → ต้องเล่นต่อจนตายได้ ไม่พัง
let bumped = 0, bumpFail = 0, hadPending = 0;
for (let k = 0; k < 30; k++) {
  const st0 = newLife(mixSeed(seed + 7, k), content);
  const bRng = makeRng(k);
  let card = nextCard(st0);
  for (let t = 0; t < 40 && card.kind !== 'death'; t++) {
    if (card.choices?.length) choose(st0, BOTS.สุ่ม(card, bRng, st0));
    card = nextCard(st0);
  }
  const text = snapshot({ st: st0, af: null, card }, content);
  const gone = st0.pending?.id;
  if (gone) hadPending++;
  const next = { ...content, events: content.events.filter((e) => e.id !== gone) };
  try {
    const back = restore(text, next);
    let c = repairLife(back.st, back.card) ? nextCard(back.st) : back.card;
    for (let t = 0; t < 2000 && c.kind !== 'death'; t++) {
      if (c.choices?.length) choose(back.st, BOTS.สุ่ม(c, bRng, back.st));
      c = nextCard(back.st);
    }
    if (c.kind !== 'death') throw new Error('ไม่ถึงการ์ดตาย');
    bumped++;
  } catch (e) {
    bumpFail++;
    if (bumpFail <= 3) console.log('bump:', gone, e.message);
  }
}
console.log(`เนื้อหาเปลี่ยนแล้วโหลด (การ์ดที่ค้างถูกลบ) เล่นต่อจนตาย ${bumped}/${bumped + bumpFail} (มีการ์ดค้างที่ถูกลบ ${hadPending})`);
if (bumpFail) fail.push('bump');
sizes.sort((a, b) => a - b);
const kb = (x) => (x / 1024).toFixed(1);
console.log(`เซฟกลางทางแล้วเล่นต่อ ${pairs} คู่ · ไม่เท่าเล่นรวด ${fail.length}${fail.length ? ' · ' + fail.slice(0, 5).join(' · ') : ''}`);
console.log(`ขนาดเซฟ มัธยฐาน ${kb(sizes[Math.floor(sizes.length / 2)])} KB · p95 ${kb(sizes[Math.floor(sizes.length * 0.95)])} KB · สูงสุด ${kb(sizes.at(-1))} KB`);
console.log(`ตัวควบคุม (เลื่อนตัวสุ่มหลังโหลด) จับได้ ${ctlCaught}/${ctlRuns}`);
const ok = !fail.length && ctlCaught === ctlRuns;
console.log(ok ? 'ผ่าน' : 'ตก');
process.exit(ok ? 0 : 1);
