// ตัวเร่ง/ชะลอการปลดต้นไม้โฟกัส (ใบ 08 · ข้อ 24 57): บอทเล่นต้นไม้ตลอดชีวิตชุดเดียวกัน วัดความเร็วปลดเมื่อเปิดตัวเร่งทีละตัว/ทั้งหมด เทียบตัวควบคุม (ปิดหมด)
// ด่านกติกา: ปิดทุกตัวเร่ง = เท่ากับไม่มีค่า pace เป๊ะทุกชีวิต · ชีวิตที่ไม่มีครู/ไม่ใช่ใฝ่รู้ ต้องเดินเท่าตัวควบคุมเป๊ะเมื่อเปิดเฉพาะตัวนั้น (ปิดตัวเร่งนั้นแล้วต่าง = 0)
// เกณฑ์ต้นทุนข้อ 57 พิมพ์เป็นตัวเลขส่งเจ้าของเคาะ ไม่ใช่ด่านผ่าน/ตก — ห้ามผ่อนค่าใน tree-pace.yaml เองเพื่อให้ตัวเลขสวย
import { playLife, mixSeed, treeCtl, treePaceCtl } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { random, withTree } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 300), seed = arg('--seed', 1);
// ตัวเร่งแตะแค่จำนวนปี ไม่แตะการนับการ์ด → วัดแบบปีอย่างเดียว (cardsFree) เป็นค่าตั้งต้น ไม่ผูกกับจำนวนการ์ดความเชื่อที่ใบอื่นเติม · --cards 1 = นับการ์ดจริง
const CARDS_FREE = arg('--cards', 0) !== 1;
const TARGET = 'occ';
const content = loadContent();
const noPace = { ...content, tree: { ...content.tree, pace: null } };
const bot = withTree(random, TARGET);
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : '-');
const f2 = (x) => (Number.isFinite(x) ? x.toFixed(2) : '-');

const OFF = { teacher: false, cls: false, learn: false, age: false };
// สรุปชีวิตเป็นก้อนเล็ก (ไม่เก็บ st ทั้งก้อน): ปลดอะไรอายุเท่าไร · จำนวนปีที่ทุ่มจริงต่อโหนด · ครู/นิสัย/ฐานะ
function lives(paceCtl, c = content) {
  Object.assign(treeCtl, { cards: true, anyCat: false, cardsFree: CARDS_FREE, passive: true });
  Object.assign(treePaceCtl, OFF, paceCtl);
  const out = [];
  for (let i = 0; i < n; i++) {
    const { state: st, age } = playLife(mixSeed(seed, i), c, bot);
    const ticks = {};
    for (const [, id] of st.tree?.hist ?? []) ticks[id] = (ticks[id] ?? 0) + 1;
    out.push({ age, done: { ...(st.tree?.done ?? {}) }, yrs: { ...(st.tree?.yrs ?? {}) }, ticks, teacher: !!st.flags.tree_teacher, nature: st.nature ?? null, cls: st.standing?.[0]?.cls ?? null });
  }
  return out;
}
const sig = (l) => JSON.stringify([l.done, l.ticks, l.age]);
// ปีสะสมต่อโหนด (รวมเศษ) — ตัวเร่งเล็กที่ยังไม่พอข้ามปีเต็มจะต่างที่นี่ก่อนที่อายุตอนปลดจะต่าง
const sigY = (l) => JSON.stringify([sig(l), l.yrs]);
const nodes = (l) => Object.keys(l.done).length;
const unlockAges = (rs) => rs.flatMap((l) => Object.values(l.done));
const ticksPerNode = (rs) => mean(rs.flatMap((l) => Object.keys(l.done).map((id) => l.ticks[id] ?? 0)));

const fails = [];
console.log(`ตัวเร่ง/ชะลอการปลด · บอทเล่นแขนง ${TARGET} · ${n} ชีวิต · seed ${seed} · ${CARDS_FREE ? 'วัดปีอย่างเดียว (ไม่นับการ์ด)' : 'นับการ์ดจริง'}`);

const ctl = lives(OFF);
const ctlNoPace = lives(OFF, noPace);
const ctlBad = ctl.filter((l, i) => sig(l) !== sig(ctlNoPace[i])).length;
console.log(`ตัวควบคุม: ปิดตัวเร่งทุกตัว เทียบไม่มีค่า pace ต่าง ${ctlBad}/${n} ชีวิต`);
if (ctlBad) fails.push(`ตัวควบคุม: ปิดตัวเร่งทุกตัวแล้วยังต่างจากไม่มีค่า pace ${ctlBad} ชีวิต`);

const RUNS = [
  ['ปิดหมด (ตัวควบคุม)', OFF, ctl],
  ['เฉพาะครู', { teacher: true }],
  ['เฉพาะฐานะ', { cls: true }],
  ['เฉพาะใฝ่รู้', { learn: true }],
  ['เฉพาะอายุ (ยิ่งแก่ยิ่งช้า)', { age: true }],
  ['เปิดทั้งหมด', { teacher: true, cls: true, learn: true, age: true }],
].map(([label, ctlOpts, done]) => ({ label, ctlOpts, rs: done ?? lives(ctlOpts) }));

console.log('\nความเร็วปลด (บอทเดียวกัน seed เดียวกัน)');
console.log('ตัวเร่ง                       โหนดปลด/ชีวิต   อายุตอนปลดเฉลี่ย   ปีที่ทุ่มต่อโหนดที่ปลด   ต่างจากตัวควบคุม(โหนด)');
const base = RUNS[0].rs;
for (const { label, rs } of RUNS) {
  const diff = rs.filter((l, i) => sig(l) !== sig(base[i])).length;
  console.log(`${label.padEnd(30)}${f2(mean(rs.map(nodes))).padStart(8)}${f1(mean(unlockAges(rs))).padStart(16)}${f2(ticksPerNode(rs)).padStart(20)}${String(diff).padStart(18)}/${n}`);
}

// ปิดตัวเร่งนั้นแล้วต่าง = 0: ชีวิตที่ไม่มีตัวเร่งนั้น เปิดเฉพาะตัวนั้นแล้วต้องเดินเท่าตัวควบคุมเป๊ะ
console.log('\nตัวควบคุมรายตัว (ชีวิตที่ไม่มีตัวเร่งนั้น ต้องต่างจากปิดหมด 0)');
for (const [label, pick, key] of [['ครู', (l) => !l.teacher, 'เฉพาะครู'], ['ใฝ่รู้', (l) => l.nature !== 'learn', 'เฉพาะใฝ่รู้']]) {
  const rs = RUNS.find((r) => r.label === key).rs;
  const idx = rs.map((l, i) => i).filter((i) => pick(rs[i]));
  const bad = idx.filter((i) => sig(rs[i]) !== sig(base[i])).length;
  console.log(`  ${label}: ชีวิตที่ไม่มี${label} ${idx.length}/${n} · ต่างจากตัวควบคุม ${bad}`);
  if (bad) fails.push(`ตัวควบคุม: ชีวิตที่ไม่มี${label}ต่างจากปิดหมด ${bad} ชีวิต`);
}
// ครู/ใฝ่รู้ vs ไม่มี: ปีที่ทุ่มต่อโหนด ในรอบที่เปิดเฉพาะตัวนั้น (ชีวิตที่มี vs ไม่มี) — ต้องมีที่ต่างจากตัวควบคุม > 0
for (const [label, pick, key] of [['ครู', (l) => l.teacher, 'เฉพาะครู'], ['ใฝ่รู้', (l) => l.nature === 'learn', 'เฉพาะใฝ่รู้']]) {
  const rs = RUNS.find((r) => r.label === key).rs;
  const has = rs.map((l, i) => i).filter((i) => pick(rs[i]));
  const diffN = has.filter((i) => sig(rs[i]) !== sig(base[i])).length;
  const diffY = has.filter((i) => sigY(rs[i]) !== sigY(base[i])).length;
  console.log(`  ${label}: มี ${has.length} ชีวิต · ปี/โหนด ${f2(ticksPerNode(has.map((i) => rs[i])))} (ตัวควบคุมชีวิตเดียวกัน ${f2(ticksPerNode(has.map((i) => base[i])))}) · อายุตอนปลดเฉลี่ย ${f1(mean(unlockAges(has.map((i) => rs[i]))))} (${f1(mean(unlockAges(has.map((i) => base[i]))))}) · ปีปลดต่าง ${diffN}/${has.length} · ปีสะสมต่าง ${diffY}/${has.length}`);
  // ครูต้องเปลี่ยนปีที่ปลดจริง (ด่านกติกา) · ใฝ่รู้แค่ต้องต่างที่ปีสะสม — ปีที่ปลดต่างเมื่อมีโหนดหลังอายุ 12 มากพอ (ตอนนี้ occ มี 2 โหนดหลังนิสัยล็อก)
  if (key === 'เฉพาะครู' && has.length && !diffN) fails.push(`ตัวเร่ง${label}ไม่ทำให้ปีที่ปลดของชีวิตที่มีต่างจากตัวควบคุมเลย`);
  if (has.length && !diffY) fails.push(`ตัวเร่ง${label}ไม่ทำให้ปีสะสมต่างจากตัวควบคุมเลย`);
}
const on = RUNS.at(-1).rs;
console.log(`  ชีวิตที่ได้ครู ${on.filter((l) => l.teacher).length}/${n} · ใฝ่รู้ ${on.filter((l) => l.nature === 'learn').length}/${n}`);

// ── เกณฑ์ต้นทุนข้อ 57 (พิมพ์ส่งเจ้าของเคาะ) ──
console.log('\nเกณฑ์ข้อ 57 (วัดแล้วยื่น ไม่ใช่ด่านผ่าน/ตก)');
// (1) ฐานะซ้อนข้อ 39: ฐานะเป็นตัวกำหนดแขนงเริ่มอยู่แล้ว ถ้ายังเร่งความเร็วอีกชั้น คนฐานะสูงได้เปรียบสองต่อ
const bands = [['ฐานะ 0–3 (จนถึงค่อนข้างจน)', (c) => c <= 3], ['ฐานะ 4–6 (กลาง)', (c) => c >= 4 && c <= 6], ['ฐานะ 7–9 (มีอันจะกินขึ้นไป)', (c) => c >= 7]];
console.log('  (1) ฐานะซ้อนจุดเกิด — เปิดทั้งหมด แยกตามฐานะตอนเกิด · เทียบปิดหมด');
for (const [label, f] of bands) {
  const ix = on.map((l, i) => i).filter((i) => on[i].cls !== null && f(on[i].cls));
  const a = ix.map((i) => on[i]), b = ix.map((i) => base[i]);
  console.log(`      ${label.padEnd(30)}${String(ix.length).padStart(4)} ชีวิต · โหนดปลด ${f2(mean(a.map(nodes)))} (ปิดหมด ${f2(mean(b.map(nodes)))})`);
}
// (2) ใฝ่รู้ชนะนิสัยอื่น (ข้อ 51): ส่วนแบ่งนิสัยเด่นที่เป็นใฝ่รู้ + โหนดที่ปลดเทียบนิสัยอื่น
const natured = on.filter((l) => l.nature);
console.log(`  (2) ส่วนแบ่งนิสัยเด่นที่เป็นใฝ่รู้ ${natured.filter((l) => l.nature === 'learn').length}/${natured.length} ชีวิตที่มีนิสัยเด่น (${f1(100 * natured.filter((l) => l.nature === 'learn').length / Math.max(1, natured.length))}%)`);
for (const nat of ['learn', 'social', 'duty', 'bold']) {
  const ix = on.map((l, i) => i).filter((i) => on[i].nature === nat);
  console.log(`      นิสัย ${nat.padEnd(7)}${String(ix.length).padStart(4)} ชีวิต · โหนดปลด ${f2(mean(ix.map((i) => nodes(on[i]))))} (ปิดหมด ${f2(mean(ix.map((i) => nodes(base[i]))))})`);
}
// (3) แก่แล้วช้า → ได้ผลเต็มรายปีนานขึ้น: ปีที่ทุ่มต่อโหนด แยกตามช่วงอายุตอนปลด
console.log('  (3) ปีผลเต็มต่อโหนดตามอายุ — ปีที่ทุ่มต่อโหนดที่ปลด แยกตามอายุตอนปลด (เปิดทั้งหมด · ปิดหมด)');
for (const [label, lo, hi] of [['อายุ <12', 0, 11], ['อายุ 12–29', 12, 29], ['อายุ 30–59', 30, 59], ['อายุ 60+', 60, 200]]) {
  const per = (rs) => rs.flatMap((l) => Object.keys(l.done).filter((id) => l.done[id] >= lo && l.done[id] <= hi).map((id) => l.ticks[id] ?? 0));
  const a = per(on), b = per(base);
  console.log(`      ${label.padEnd(12)}${String(a.length).padStart(5)} โหนด · ${f2(mean(a))} ปี/โหนด (ปิดหมด ${String(b.length).padStart(4)} โหนด ${f2(mean(b))})`);
}

Object.assign(treeCtl, { cards: true, anyCat: false, cardsFree: false, passive: true });
Object.assign(treePaceCtl, { teacher: true, cls: true, learn: true, age: true });
if (fails.length) {
  console.log('\nตก:');
  for (const f of fails) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log('\nผ่านด่านกติกา');
