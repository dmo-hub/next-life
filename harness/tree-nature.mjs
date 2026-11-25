// นิสัยวัยเด็กเป็นโหนดในต้นไม้ (ใบ ft07 · ข้อ 16 17 19 51 52): นับนิสัยต่อชีวิต · นิสัยเด่น · ข้อความอายุ 12 ในบันทึกชีวิตบอท
// บอทต่อโปรไฟล์แขนง (จุดเกิด + ทุกแขนง) เพราะโหนดนิสัยกระจายอยู่ 5 แขนง · กติกาจริง (ต้องตอบการ์ดหมวดตรง) ไม่ผ่อน
import { loadContent } from '../src/node/load.mjs';
import { playLife, mixSeed, treeCtl, treeOffersNow, treeInvestNode } from '../src/engine/index.mjs';
import { random, withTree, withGate } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 60), seed = arg('--seed', 1);
const content = loadContent();
const defs = content.tree.nodes;
const nat = content.nature.natures;
const AGE = content.nature.nature_age;
const owner = {};
for (const [id, d] of Object.entries(nat)) for (const t of d.nodes ?? []) owner[t] = id;
Object.assign(treeCtl, { cards: true, anyCat: false, cardsFree: false, passive: true });

const fails = [];
const check = (ok, msg) => { console.log(`  ${ok ? '✓' : '✗'} ${msg}`); if (!ok) fails.push(msg); };

const mains = Object.keys(content.tree.start.class.low);
// kid = ไล่ทุ่มโหนดเด็กที่ผูกนิสัยตามลำดับ (ผู้เล่นเปลี่ยนโหนดเองได้ไม่เสียปี ข้อ 43) · calm = เฉพาะโหนดสายสงบใจ
// บอทกลางเลือกโหนดที่มีลูกหลานมากสุด จึงค้างที่ o1 (ต้องการ์ด belief เด็กที่ main ยังไม่มี) ไม่ถึง o9
const KID = { kid: Object.keys(owner), calm: nat.calm?.nodes ?? [] };
const kidBot = (ids) => Object.assign((...a) => withGate(random)(...a), random, {
  tree: (st) => {
    // โหนดที่ปีครบแล้วยังรอการ์ดหมวดตรงเกิน 2 ปี = ข้ามไปโหนดอื่น (ผู้เล่นเปลี่ยนเองได้ ข้อ 43)
    const stuck = (id) => (st.tree?.yrs?.[id] ?? 0) >= defs[id].years + 2;
    const open = treeOffersNow(st).filter((id) => ids.includes(id) && !stuck(id));
    if (st.tree?.cur && open.includes(st.tree.cur)) return;
    if (open.length) treeInvestNode(st, open[0]);
  },
});
const profiles = ['start', ...mains, ...Object.keys(KID)];
const rows = [];
for (const tgt of profiles) {
  const bot = KID[tgt] ? kidBot(KID[tgt]) : withTree(withGate(random), tgt);
  for (let i = 0; i < n; i++) {
    let text = null;
    const { state: st } = playLife(mixSeed(seed, i), content, bot, (card) => { if (card.tag === 'nature') text = card.text; });
    // นิสัยที่มีโหนดปลดถึงอายุล็อก (นับจากทะเบียนต้นไม้เอง ไม่ใช่จากสถานะที่แกนจด)
    const early = [...new Set(Object.entries(st.tree?.done ?? {}).filter(([id, a]) => owner[id] && a <= AGE).map(([id]) => owner[id]))];
    const late = Object.entries(st.tree?.done ?? {}).filter(([id, a]) => owner[id] && a > AGE).map(([id]) => id);
    rows.push({ tgt, nature: st.nature ?? null, also: st.natureAlso ?? [], early, late, text });
  }
}
const total = rows.length;
const withNode = rows.filter((r) => r.early.length);
console.log(`นิสัยจากโหนดวัยเด็ก · ${profiles.length} โปรไฟล์ × ${n} ชีวิต = ${total} ชีวิต · ล็อกที่อายุ ${AGE}`);
const byNat = {};
for (const r of rows) if (r.nature) byNat[r.nature] = (byNat[r.nature] ?? 0) + 1;
console.log(`  นิสัยเด่น: ${Object.keys(nat).map((k) => `${k} ${byNat[k] ?? 0}`).join(' · ')} · ไม่มี ${rows.filter((r) => !r.nature).length}`);
console.log(`  ชีวิตที่มีโหนดนิสัยปลดถึงอายุ ${AGE}: ${withNode.length}/${total} · ปลด ≥2 นิสัย: ${withNode.filter((r) => r.early.length >= 2).length}`);
console.log(`  โหนดนิสัยที่ปลดหลังอายุ ${AGE} (ไม่ให้แต้ม): ${rows.reduce((a, r) => a + r.late.length, 0)} ครั้ง`);

// ด่านตามเกณฑ์ใบ
check(rows.every((r) => r.also.every((k) => r.early.includes(k))), `นิสัยรองทุกตัวมีโหนดปลดถึงอายุ ${AGE} จริง (0 นิสัยจากโหนดที่ปลดหลังอายุ ${AGE})`);
check(rows.every((r) => !r.also.length || r.nature), 'ทุกชีวิตที่มีนิสัยรองมีนิสัยเด่นตัวเดียว');
check(rows.every((r) => !r.also.includes(r.nature)), 'นิสัยรองไม่ซ้ำนิสัยเด่น');
check(withNode.some((r) => r.early.length >= 2), 'มีชีวิตที่ปลด ≥2 นิสัย');
check(rows.some((r) => r.nature === 'calm' || r.also.includes('calm')), 'นิสัยสงบใจถูกปลด ≥1 ครั้งในบอท');
const calmNodes = rows.filter((r) => r.early.includes('calm')).length;
console.log(`    (ชีวิตที่มีโหนดสายสงบใจปลดถึงอายุ ${AGE}: ${calmNodes})`);
const domText = rows.filter((r) => r.nature);
check(domText.length > 0 && domText.every((r) => r.text === `คุณโตมาเป็นคน${nat[r.nature].name}`), `ข้อความอายุ ${AGE} ของนิสัยเด่นขึ้นในบันทึกชีวิตบอททุกชีวิตที่มีนิสัยเด่น (${domText.length} ชีวิต)`);
const sample = domText.find((r) => r.nature === 'calm') ?? domText[0];
if (sample) console.log(`    ตัวอย่าง: "${sample.text}"`);

console.log(fails.length ? `\nไม่ผ่าน ${fails.length} ข้อ` : '\nผ่านทั้งหมด');
process.exitCode = fails.length ? 1 : 0;
