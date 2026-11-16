// ร่างหมวดการ์ดผล (ui-redo 58 ข้อ 84 90 92): นับการ์ดผลต่อหมวดจากชีวิตบอท + เก็บข้อความจริงให้หน้า tweak ภาพบนการ์ด
// หมวดจับจากข้อมูลที่การ์ดมี (ข้อ 83) ไม่อ่านคำในข้อความ · ทิศผลนับเฉพาะค่าที่ไม่ซ่อน แบบเดียวกับลูกศรบนแถบค่า (ข้อ 90)
// ป้ายหมวดจริงเป็นงาน engine ใบ 60 — ไฟล์นี้เป็นร่างตารางให้เจ้าของเลือก แหล่งที่การ์ดไม่มีฟิลด์บอก (มรดก เกษียณ ล้มละลาย รอดตาย) ตกหมวดกลางจนใบ 60 แนบป้าย
// พิมพ์ตารางอย่างเดียว · --write <ไฟล์> เขียน JSON ไว้ทำหน้า tweak ในเครื่อง (หน้า tweak ใช้แล้วทิ้ง ไม่ commit)
import { readFileSync, writeFileSync } from 'node:fs';
import { playLife, playAfterlife, nextLife, mixSeed, horoscope, standingOf } from '../src/engine/index.mjs';
import { artTier, resultArtCat } from '../src/ui/art.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS, random, isekaiBot } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 300), seed = arg('--seed', 1);
const wi = process.argv.indexOf('--write');
const WRITE = wi > 0 ? process.argv[wi + 1] : null;

// ลำดับ = ลำดับตัดสิน: ข้อแรกที่ตรงได้หมวดนั้น · mid รับที่เหลือทุกใบ (ข้อ 84)
export const RESULT_CATS = [
  ['after', 'ปรโลก', 'การ์ดผลในฉากระหว่างชาติ (afterlife.mjs)'],
  ['far', 'กลับจากต่างโลก', 'card.trip'],
  ['loss', 'คนในบ้านจากไป', "digest 'kin_loss'"],
  ['ill', 'ป่วยไข้', "digest 'kin_ill' · card.illness (ตรวจเจอโรค)"],
  ['pet', 'สัตว์เลี้ยง', "digest 'pet'"],
  ['self', 'นิสัย·ทางที่ทุ่ม', 'card.nature · card.focusRisk'],
  ['luck', 'เสี่ยงโชค', 'ต่อจากการ์ดสายลี้ลับ (ev.belief)'],
  ['good', 'เรื่องดี', 'ผลตัวเลือก: ค่าที่เห็นขึ้นอย่างเดียว'],
  ['bad', 'เรื่องร้าย', 'ผลตัวเลือก: ค่าที่เห็นลงอย่างเดียว'],
  ['mid', 'เรื่องทั่วไป', 'ที่เหลือ: ขึ้นปนลง · ซ่อนหมด · ไม่ขยับ · แหล่งที่ยังไม่มีป้าย'],
];
// การ์ดที่มีภาพฉากอยู่แล้ว — การ์ดผลต่อจากใบนี้ไม่ใส่ภาพหมวด (ข้อ 89) · อ่าน SCENE_OF จาก app.mjs ไม่คัดลอกรายการ (app.mjs เป็นสคริปต์หน้าเว็บ import ไม่ได้)
const SCENE_SRC = readFileSync(new URL('../src/ui/app.mjs', import.meta.url), 'utf8').match(/const SCENE_OF = new Map\((\[[^\n]*\])\);/);
if (!SCENE_SRC) throw new Error('src/ui/app.mjs: ไม่เจอ const SCENE_OF = new Map([...]) — รูปบรรทัดเปลี่ยน แก้ regex ที่นี่');
const SCENE_IDS = JSON.parse(SCENE_SRC[1].replace(/'/g, '"')).map(([id]) => id);
const SAMPLES = 6;

const content = loadContent();
const byId = Object.fromEntries(content.events.map((e) => [e.id, e]));
const hasScene = (c) => c && (c.kind === 'era' || (c.kind === 'event' && (byId[c.id]?.era || SCENE_IDS.includes(c.id))));

const count = Object.fromEntries(RESULT_CATS.map(([k]) => [k, 0]));
const samples = Object.fromEntries(RESULT_CATS.map(([k]) => [k, []]));
const intro = { 0: [], 1: [], 2: [], heir: [] };
let total = 0, skipped = 0;
const take = (k, card) => {
  const xs = samples[k];
  if (xs.length < SAMPLES && !xs.some((x) => x.t === card.text)) xs.push({ t: card.text, ...(card.story && { s: card.story }), ...(card.illness && { left: card.illness.left }), ...(card.age !== undefined && { age: card.age, stage: card.stage }) });
};
const introOf = (card, st) => ({ age: card.age, text: card.text, story: card.story, horo: horoscope(st), inherit: card.inherit });

function onLife() {
  let prev = null;
  return (card, st) => {
    if (card.kind === 'intro') {
      const xs = card.age > 0 ? intro.heir : intro[artTier(standingOf(st))];
      if (xs.length < 3) xs.push(introOf(card, st));
    }
    if (card.kind === 'result' && !card.isekai) {
      total++;
      if (hasScene(prev)) skipped++;
      else {
        const k = resultArtCat(card);
        count[k]++;
        take(k, card);
      }
    } else {
      // การ์ดที่ไม่ใช่การ์ดผลคือต้นทางที่ใช้ดูว่าต่อจากภาพฉากมั้ย (ข้อ 89)
      prev = card;
    }
  };
}

// บอทต่างโลก (รับการ์ดชวน) ให้มีการ์ดกลับบ้าน — บอท 6 บุคลิกปฏิเสธทุกใบ
const RUN = { ...BOTS, ต่างโลก: isekaiBot };
const afterlife = (st) => playAfterlife(st, random, (card) => {
  if (card.kind !== 'result') return;
  total++;
  count.after++;
  take('after', card);
});
for (const [name, bot] of Object.entries(RUN)) {
  for (let i = 0; i < n; i++) {
    const r = playLife(mixSeed(seed, i), content, bot, onLife());
    if (r.state.trip || r.state.isekai) continue;
    // สัตว์เลี้ยงเข้าบ้านเฉพาะชีวิตทายาท (heir.pets) · การ์ดรับช่วงชีวิตก็เป็นของรุ่น 2 ⇒ เล่นต่ออีกรุ่น
    const af = afterlife(r.state);
    if (af.heir) {
      const r2 = playLife(af.heir.seed, content, bot, onLife(), nextLife(af));
      if (!r2.state.trip && !r2.state.isekai) afterlife(r2.state);
    }
  }
}

const counted = total - skipped;
const pct = (x) => `${((100 * x) / counted).toFixed(1)}%`;
console.log(`หมวดการ์ดผล (ร่าง ui-redo 58) · ${Object.keys(RUN).length} บอท × ${n} ชีวิต 2 รุ่น + ปรโลก · seed ${seed}`);
console.log(`การ์ดผล ${total} ใบ · ต่อจากการ์ดมีภาพฉาก (ไม่ใส่ภาพหมวด ข้อ 89) ${skipped} · นับหมวด ${counted}`);
for (const [k, label] of RESULT_CATS) console.log(`  ${label.padEnd(16)} ${String(count[k]).padStart(6)}  ${pct(count[k])}`);
const midOk = count.mid * 2 <= counted;
// ตัวควบคุม: ป้ายขึ้น = เรื่องดี · ไม่มีป้าย (การ์ดค้างในเซฟเก่า) = หมวดกลาง
const ctlOk = resultArtCat({ tag: 'good' }) === 'good' && resultArtCat({}) === 'mid';
console.log(`  ตัวควบคุม: ป้ายขึ้น→เรื่องดี · ไม่มีป้าย→หมวดกลาง → ${ctlOk ? 'ผ่าน' : 'ตก'}`);
console.log(`หมวดกลาง ≤ ครึ่ง (ข้อ 92) → ${midOk ? 'ผ่าน' : 'ตก'} ${pct(count.mid)}`);
if (WRITE) {
  const out = { seed, n, bots: Object.keys(RUN), total, skipped, cats: RESULT_CATS.map(([k, name, rule]) => ({ k, name, rule, n: count[k], samples: samples[k] })), intro };
  writeFileSync(WRITE, `${JSON.stringify(out, null, 1)}\n`);
  console.log(`เขียน ${WRITE}`);
}
if (!midOk || !ctlOk) process.exitCode = 1;
