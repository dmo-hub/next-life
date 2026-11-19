// การ์ดวัยทำงานไม่ตรงสาย (#10 · ข้อ 296/313/314): คนสายราชการ/ทหาร/ตำรวจ/ค้าขาย ไม่ควรเจอเรื่องออฟฟิศบริษัทบ่อย
// [เงื่อนไข] การ์ดมี when.occupation / when.ladder แต่ออกให้คนนอกรายการ — ต้อง = 0 (engine ตรวจ whenOk ทุกจุดที่การ์ดโผล่ · ≠ 0 = ช่องโหว่)
// [ข้อความ] การ์ดช่วงทำงาน/กลางคนที่ข้อความมีคำออฟฟิศชัด ออกให้คนนอกสาย OFFICE_OK — เฉลี่ยต่อชีวิตต้อง ≤ MAX_TEXT ทุกสาย
// คำกำกวม (ประชุม เจ้านาย ที่ทำงาน) ทหาร/ราชการ/ร้านก็มี → รายงานแยก ไม่ใช้ตัดสิน
// สาย = st.ladder.id (ตัวเดียวกับที่ when.ladder อ่าน) · นับเฉพาะตอนมีงาน (workFrom ≠ null แบบ when.occupation)
// การ์ดที่ออฟฟิศเป็นแก่นเรื่อง → ใส่ when.ladder/occupation · ออฟฟิศเป็นแค่ฉากหลัง → ตัดคำออกจากข้อความ (คำเคาะ #10 ทาง ข)
import { playLife, mixSeed } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 500), seed = arg('--seed', 1), top = arg('--top', 20);
const MAX_TEXT = 0.5;
// สายที่ชีวิตน้อยกว่านี้ ค่าเฉลี่ยแกว่งเกินจะตัดสิน — รายงานแต่ไม่ตัดสิน (army ที่ n 500 ได้ ~56 ชีวิต ยังตัดสิน)
const MIN_LIVES = 50;
const OFFICE_WORDS = ['ออฟฟิศ', 'อีเมล', 'สลิปเงินเดือน', 'โบนัส', 'ห้องประชุม', 'สำนักงาน', 'โต๊ะทำงาน', 'บริษัท'];
const AMBIG_WORDS = ['ประชุม', 'เจ้านาย', 'ที่ทำงาน'];
const OFFICE_OK = new Set(['private', 'none']);
const WORK_STAGES = new Set(['ทำงาน', 'กลางคน']);
const LANES = ['gov', 'army', 'police', 'private', 'trade', 'hunter', 'none'];

const content = loadContent();
const byId = new Map(content.events.map((e) => [e.id, e]));
// ข้อความที่เห็นก่อนเลือก (หัว · เรื่อง · ตัวเลือก) — นิยามเดียวกับผลวัดที่เจ้าของใช้ตั้งเป้า ≤ 0.5 · ผลลัพธ์หลังเลือกไม่นับ
const textOf = (e) => [e.title, e.text, ...(e.choices ?? []).map((c) => c.text)].filter(Boolean).join(' ');
const hitsOf = new Map(content.events.map((e) => { const t = textOf(e); return [e.id, OFFICE_WORDS.filter((w) => t.includes(w))]; }));
const ambigOf = new Map(content.events.map((e) => { const t = textOf(e); return [e.id, AMBIG_WORDS.filter((w) => t.includes(w))]; }));

const lane = Object.fromEntries(LANES.map((l) => [l, { lives: 0, cards: 0, cond: 0, text: 0, per: [] }]));
const cardMis = new Map();
const wordN = new Map();
const ambigN = new Map();
let ownBiz = 0, ownBizOffice = 0;
for (const bot of Object.values(BOTS)) {
  for (let i = 0; i < n; i++) {
    const life = new Map();
    playLife(mixSeed(seed, i), content, bot, (card, st) => {
      if (card.kind !== 'event' || !WORK_STAGES.has(card.stage) || st.workFrom === null) return;
      const e = byId.get(card.id);
      if (!e) return;
      const L = st.ladder?.id ?? 'none';
      const g = life.get(L) ?? life.set(L, { cards: 0, cond: 0, text: 0 }).get(L);
      g.cards++;
      const w = e.when ?? {};
      if ((w.occupation && !w.occupation.includes(st.occupation)) || (w.ladder && !w.ladder.includes(L))) g.cond++;
      const hits = hitsOf.get(card.id);
      if (st.flags.own_business && hits.length) ownBizOffice++;
      if (st.flags.own_business) ownBiz++;
      if (!hits.length || OFFICE_OK.has(L)) return;
      g.text++;
      for (const h of hits) wordN.set(h, (wordN.get(h) ?? 0) + 1);
      for (const h of ambigOf.get(card.id)) ambigN.set(h, (ambigN.get(h) ?? 0) + 1);
      const c = cardMis.get(card.id) ?? cardMis.set(card.id, { n: 0, by: new Map() }).get(card.id);
      c.n++;
      c.by.set(L, (c.by.get(L) ?? 0) + 1);
    });
    for (const [L, g] of life) {
      const t = lane[L] ?? (lane[L] = { lives: 0, cards: 0, cond: 0, text: 0, per: [] });
      t.lives++; t.cards += g.cards; t.cond += g.cond; t.text += g.text; t.per.push(g.text);
    }
  }
}

const p90 = (a) => (a.length ? [...a].sort((x, y) => x - y)[Math.min(a.length - 1, Math.ceil(0.9 * a.length) - 1)] : 0);
const total = Object.values(lane).reduce((s, t) => s + t.lives, 0);
console.log(`การ์ดวัยทำงานไม่ตรงสาย · ${Object.keys(BOTS).length} บอท × ${n} ชีวิต · seed ${seed} · คำออฟฟิศชัด: ${OFFICE_WORDS.join(' ')} · สายที่ใช้ได้: ${[...OFFICE_OK].join(' ')}`);
console.log('\nสาย      ชีวิต   การ์ด  [เงื่อนไข]  [ข้อความ]  เฉลี่ย/ชีวิต  p90');
for (const [L, t] of Object.entries(lane)) {
  if (!t.lives) continue;
  console.log(`${L.padEnd(8)}${String(t.lives).padStart(6)}${String(t.cards).padStart(8)}${String(t.cond).padStart(11)}${String(t.text).padStart(11)}${(t.text / t.lives).toFixed(3).padStart(13)}${String(p90(t.per)).padStart(5)}`);
}
console.log(`รวม    ${String(total).padStart(6)} (ชีวิตต่อสาย = ชีวิตที่มีการ์ดวัยทำงาน ≥1 ใบตอนอยู่สายนั้น · ชีวิตเดียวเปลี่ยนสายนับทั้งสองสาย)`);
console.log(`own_business: การ์ดวัยทำงาน ${ownBiz} · มีคำออฟฟิศ ${ownBizOffice}`);
console.log(`\nคำชัดที่ออกให้คนนอกสาย: ${OFFICE_WORDS.map((w) => `${w} ${wordN.get(w) ?? 0}`).join(' · ')}`);
console.log(`คำกำกวมในการ์ดเดียวกัน (ไม่ตัดสิน): ${AMBIG_WORDS.map((w) => `${w} ${ambigN.get(w) ?? 0}`).join(' · ')}`);
console.log(`\nการ์ดที่ออกให้คนนอกสายบ่อยสุด ${top} จาก ${cardMis.size} (id · ครั้ง · สายที่เจอ · คำ):`);
for (const [id, c] of [...cardMis].sort((a, b) => b[1].n - a[1].n).slice(0, top)) {
  console.log(`  ${id} ${c.n} · ${[...c.by].sort((a, b) => b[1] - a[1]).map(([l, k]) => `${l}:${k}`).join(' ')} · ${hitsOf.get(id).join(' ')}`);
}

let fail = 0;
const check = (label, bad, extra = '') => {
  console.log(`${label}${extra} → ${bad ? 'ตก' : 'ผ่าน'}`);
  if (bad) fail++;
};
console.log('');
const condAll = Object.values(lane).reduce((s, t) => s + t.cond, 0);
check('[เงื่อนไข] การ์ดที่กรองสายออกให้คนนอกสาย = 0', condAll > 0, ` · ${condAll}`);
for (const [L, t] of Object.entries(lane)) {
  if (OFFICE_OK.has(L) || !t.lives) continue;
  if (t.lives < MIN_LIVES) { console.log(`[ข้อความ] ${L} ชีวิต ${t.lives} < ${MIN_LIVES} · ไม่ตัดสิน`); continue; }
  check(`[ข้อความ] ${L} เฉลี่ย ≤ ${MAX_TEXT} ใบ/ชีวิต`, t.text / t.lives > MAX_TEXT, ` · ${(t.text / t.lives).toFixed(3)} (${t.text}/${t.lives})`);
}
console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
if (fail) process.exitCode = 1;
