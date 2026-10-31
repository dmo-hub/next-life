// บอทบุคลิกต้องกดต่างจากบอทสุ่ม — ด่านอื่นวนบอท 6 บุคลิกแล้วอ้างผลต่อบุคลิก ถ้าบอทอ่านป้ายไม่ออกหรือเสียป้ายบุญบาป
// มันกดเหมือนสุ่มเงียบ ๆ ด่านเหล่านั้นยังผ่านแต่ไม่ได้วัดอะไร
// วัด: เดินด้วยบอทสุ่ม · ทุกการ์ดที่บอทของ harness ตัดสินและกดได้ ≥ 2 ทาง ถามบอทบุคลิกกับบอทสุ่มด้วย rng ชุดเดียวกัน
// คะแนนเสมอทุกทาง = กดเหมือนสุ่ม · โลกหลักตัดการ์ดที่ playLife เลือกเอง (ทริป · ศาล · ความทรงจำ · การ์ดชวน)
// ต่างโลกส่ง h = {} แบบ harness/isekai.mjs — รายงาน ไม่ตัดสิน จนกว่าเจ้าของเคาะทางอ่านป้ายต่างโลก
// เกณฑ์รายบอทต่อโลก ไม่ใช่ค่าเฉลี่ย: บอทบุญ/บาปพึ่งป้ายบุญบาป บอทครอบครัว/สุขภาพพึ่งป้ายผล ค่าเฉลี่ยกลบตัวที่หลุด
// ตัวควบคุม: --h0 ส่ง h = {} (บุญ/บาปต้องตก) · --nofx ลบป้ายผล (ครอบครัว/สุขภาพ/เงินต้องตก)
import { playLife, mixSeed, makeRng, openChoices } from '../src/engine/index.mjs';
import { startIsekai, nextIsekaiCard, chooseIsekai } from '../src/engine/isekai.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 200), m = arg('--m', 50), seed = arg('--seed', 1);
const H0 = process.argv.includes('--h0'), NOFX = process.argv.includes('--nofx');
const MIN = 0.1;
const BOT_SALT = 0x7d1f;
const content = loadContent();
const people = Object.keys(BOTS).filter((k) => k !== 'สุ่ม');
const pickOf = (r) => (r && typeof r === 'object' ? r.i : r);

let asked = 0;
const ask = (card, h, diff) => {
  const c = NOFX ? { ...card, fx: [] } : card;
  const hh = H0 ? {} : h;
  const rs = mixSeed(seed ^ BOT_SALT, asked++);
  const base = pickOf(BOTS.สุ่ม(c, makeRng(rs), hh));
  for (const k of people) if (pickOf(BOTS[k](c, makeRng(rs), hh)) !== base) diff[k]++;
};
const zero = () => Object.fromEntries(people.map((k) => [k, 0]));

const main = { cards: 0, diff: zero() };
for (let i = 0; i < n; i++) {
  playLife(mixSeed(seed, i), content, BOTS.สุ่ม, (card, st) => {
    if (card.trip || card.court || card.isekai || card.kind === 'memory' || card.entry) return;
    if (!card.choices?.length || openChoices(card).length < 2) return;
    main.cards++;
    ask(card, st, main.diff);
  });
}

const isk = { cards: 0, diff: zero() };
for (let i = 0; i < m; i++) {
  const s = startIsekai({ seed: mixSeed(seed, i) });
  for (let g = 0; g < 400; g++) {
    const card = nextIsekaiCard(s);
    if (card.step === 'end') break;
    if (!card.choices.length) continue;
    const open = openChoices(card);
    if (open.length >= 2) {
      isk.cards++;
      ask(card, {}, isk.diff);
    }
    chooseIsekai(s, open[0]);
  }
}

const share = (w, k) => (w.cards ? w.diff[k] / w.cards : 0);
const pct = (x) => `${(100 * x).toFixed(1)}%`;
console.log(`บอทบุคลิกกดต่างจากบอทสุ่ม · เกณฑ์ ≥ ${pct(MIN)} ต่อบอทต่อโลก · seed ${seed}${H0 ? ' · ตัวควบคุม h = {}' : ''}${NOFX ? ' · ตัวควบคุมลบป้ายผล' : ''}`);
console.log(`  โลกหลัก ${n} ชีวิต ${main.cards} การ์ด · ต่างโลก ${m} ชาติ ${isk.cards} การ์ด`);
const low = people.filter((k) => share(main, k) < MIN);
for (const k of people) {
  console.log(`  ${k.padEnd(10)} โลกหลัก ${pct(share(main, k)).padStart(6)}${share(main, k) < MIN ? ' ตก' : ''} · ต่างโลก ${pct(share(isk, k)).padStart(6)}${share(isk, k) < MIN ? ' (ต่ำกว่าเกณฑ์)' : ''}`);
}
const iskLow = people.filter((k) => share(isk, k) < MIN);
console.log(`โลกหลัก: ${low.length ? `ตก ${low.length} บอท (${low.join(' ')})` : 'ผ่านทุกบอท'}`);
console.log(`ต่างโลก: รายงาน ไม่ตัดสิน — ต่ำกว่าเกณฑ์ ${iskLow.length}/${people.length} บอท (รอเคาะทางอ่านป้ายต่างโลก)`);
process.exit(low.length ? 1 : 0);
