// ร่างหมวดการ์ดผล (ui-redo 58 ข้อ 84 90 92): นับการ์ดผลต่อหมวดจากชีวิตบอท + เก็บข้อความจริงให้หน้า tweak ภาพบนการ์ด
// หมวดจับจากข้อมูลที่การ์ดมี (ข้อ 83) ไม่อ่านคำในข้อความ · ทิศผลนับเฉพาะค่าที่ไม่ซ่อน แบบเดียวกับลูกศรบนแถบค่า (ข้อ 90)
// ป้ายหมวดจริงเป็นงาน engine ใบ 60 — ไฟล์นี้เป็นร่างตารางให้เจ้าของเลือก แหล่งที่การ์ดไม่มีฟิลด์บอก (มรดก เกษียณ ล้มละลาย รอดตาย) ตกหมวดกลางจนใบ 60 แนบป้าย
// --write เขียนผลลง src/site/card-art-tweak.json (build ฉีดเข้าหน้า tweak) · ไม่ใส่ = พิมพ์ตารางอย่างเดียว
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { playLife, playAfterlife, nextLife, mixSeed, horoscope, standingOf } from '../src/engine/index.mjs';
import { SHOWN_STATS } from '../src/ui/labels.mjs';
import { artTier } from '../src/ui/art.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS, random, isekaiBot } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 300), seed = arg('--seed', 1);
const WRITE = process.argv.includes('--write');
export const RESULT_CATS_FILE = new URL('../src/site/card-art-tweak.json', import.meta.url);

// ลำดับ = ลำดับตัดสิน: ข้อแรกที่ตรงได้หมวดนั้น · mid รับที่เหลือทุกใบ (ข้อ 84)
export const RESULT_CATS = [
  ['after', 'ปรโลก', 'การ์ดผลในฉากระหว่างชาติ (afterlife.mjs)'],
  ['far', 'กลับจากต่างโลก', 'card.trip'],
  ['loss', 'คนในบ้านจากไป', "digest 'kin_loss'"],
  ['ill', 'ป่วยไข้', "digest 'kin_ill' · card.illness (ตรวจเจอโรค)"],
  ['pet', 'สัตว์เลี้ยง', "digest 'pet'"],
  ['self', 'นิสัย·ทางที่ทุ่ม', 'card.nature · card.focusRisk'],
  ['luck', 'เสี่ยงโชค', 'ต่อจากการ์ดสายมู (ev.belief)'],
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

// ctx: delta = ค่าที่เห็นขยับจากตอนกดตัวเลือกล่าสุด (null = ไม่ได้ต่อจากการกด) · hide = ค่าที่ห้ามเผย · ev = เหตุการณ์ของใบที่กด
export function resultCat(card, ctx) {
  if (ctx.after) return 'after';
  if (card.trip) return 'far';
  if (card.digest === 'kin_loss') return 'loss';
  if (card.digest === 'kin_ill' || card.illness) return 'ill';
  if (card.digest === 'pet') return 'pet';
  if ('nature' in card || card.focusRisk) return 'self';
  if (ctx.ev?.belief) return 'luck';
  if (!ctx.delta) return 'mid';
  const ds = SHOWN_STATS.filter((k) => !ctx.hide.has(k)).map((k) => ctx.delta[k]);
  const up = ds.some((d) => d > 0), down = ds.some((d) => d < 0);
  return up && !down ? 'good' : down && !up ? 'bad' : 'mid';
}

const count = Object.fromEntries(RESULT_CATS.map(([k]) => [k, 0]));
const samples = Object.fromEntries(RESULT_CATS.map(([k]) => [k, []]));
const intro = { 0: [], 1: [], 2: [], heir: [] };
let total = 0, skipped = 0, veiledN = 0, veiledMid = 0;
const take = (k, card) => {
  const xs = samples[k];
  if (xs.length < SAMPLES && !xs.some((x) => x.t === card.text)) xs.push({ t: card.text, ...(card.story && { s: card.story }), ...(card.illness && { left: card.illness.left }), ...(card.age !== undefined && { age: card.age, stage: card.stage }) });
};
const introOf = (card, st) => ({ age: card.age, text: card.text, story: card.story, horo: horoscope(st), inherit: card.inherit });

function onLife() {
  let prev = null, snap = null, ev = null;
  return (card, st) => {
    if (card.kind === 'intro') {
      const xs = card.age > 0 ? intro.heir : intro[artTier(standingOf(st))];
      if (xs.length < 3) xs.push(introOf(card, st));
    }
    if (card.kind === 'result' && !card.isekai) {
      total++;
      if (hasScene(prev)) skipped++;
      else {
        // ตัวเลือกที่เพิ่งกดอยู่ท้าย st.log แล้วตอนการ์ดผลมาถึง · ค่าซ่อนตาม veil ใน app.mjs: ฟิลด์ hidden ของเหตุการณ์/ตัวเลือก หรือป้ายผลมี ? = ซ่อนทั้งแถบ
        const last = ev && st.log.at(-1);
        const i = ev && last?.id === ev.id ? last.choice : -1;
        const hide = new Set([...(ev?.hidden ?? []), ...(ev?.choices?.[i]?.hidden ?? []), ...(prev?.fx?.[i]?.split(' · ').includes('?') ? SHOWN_STATS : [])]);
        const delta = snap && Object.fromEntries(SHOWN_STATS.map((k) => [k, Math.round(st[k]) - Math.round(snap[k])]));
        const k = resultCat(card, { delta, hide, ev });
        if (hide.size && delta) {
          veiledN++;
          if (k === 'mid' && resultCat(card, { delta, hide: new Set(), ev }) !== 'mid') veiledMid++;
        }
        count[k]++;
        take(k, card);
      }
    } else {
      // ใบที่ไม่มีตัวเลือก (บ้านเมือง เปลี่ยนช่วง) ล้างทิ้ง — การ์ดผลระบบหลังใบพวกนี้ไม่ใช่ผลของการกด
      ev = card.choices?.length && card.id ? byId[card.id] ?? null : null;
      snap = ev ? Object.fromEntries(SHOWN_STATS.map((k) => [k, st[k]])) : null;
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
// ตัวควบคุมตัวกรองค่าซ่อน: ใบสังเคราะห์ค่าขึ้นอย่างเดียว ไม่ซ่อน = เรื่องดี · ซ่อนทั้งแถบ = หมวดกลาง — ไม่ย้ายหมวด = ตัวกรองไม่ได้ต่อสาย
const up = { health: 0, happiness: 5, knowledge: 0, relations: 0 };
const ctlOk = resultCat({}, { delta: up, hide: new Set(), ev: {} }) === 'good' && resultCat({}, { delta: up, hide: new Set(SHOWN_STATS), ev: {} }) === 'mid';
console.log(`  ตัวควบคุมตัวกรอง: ใบค่าขึ้น ไม่ซ่อน→เรื่องดี · ซ่อน→หมวดกลาง → ${ctlOk ? 'ผ่าน' : 'ตก'}`);
console.log(`หมวดกลาง ≤ ครึ่ง (ข้อ 92) → ${midOk ? 'ผ่าน' : 'ตก'} ${pct(count.mid)}`);
console.log(`  ตัวกรองค่าซ่อน (ข้อ 90): การ์ดผลที่ตัวเลือกซ่อนค่า ${veiledN} ใบ (ตกหมวดกลางเพราะซ่อน ${veiledMid})`);
if (WRITE) {
  const out = { seed, n, bots: Object.keys(RUN), total, skipped, cats: RESULT_CATS.map(([k, name, rule]) => ({ k, name, rule, n: count[k], samples: samples[k] })), intro };
  writeFileSync(RESULT_CATS_FILE, `${JSON.stringify(out, null, 1)}\n`);
  console.log(`เขียน ${fileURLToPath(RESULT_CATS_FILE)}`);
}
if (!midOk || !ctlOk) process.exitCode = 1;
