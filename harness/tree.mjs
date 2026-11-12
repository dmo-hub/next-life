// ต้นไม้โฟกัส (ใบ 03 tracer): บอทเล่นต้นไม้ทุกปีตลอดชีวิต (ข้อ 85) แล้ววัด — ปีที่ทุ่ม · โหนดที่ปลด · อายุตอนปลด
// ด่านกติกา: ทุกปีที่ทุ่มเข้าหลอดโหนดเดียว · 0 ครั้งที่ทุ่มโหนดที่ปลดแล้ว · ปลดแล้วโหนดถัดไปนับปีถัดไปทันที (ไม่เสียปี) · ตัวควบคุมปิดนับการ์ด = ปลด 0
// ด่านเกณฑ์ผ่านของเจ้าของ (ข้อ 84 · 86): บอทปลดแขนงลึกลับครบในชีวิตเดียว (o ที่เห็นทั้งหมด + โหนดกลางที่มี o เป็นต้นทาง · o6 ซ่อนไม่นับ)
// ไม่ครบ = ตก พิมพ์โหนดแรกที่ค้างกับอายุตอนตาย แล้วส่งเจ้าของเคาะ — ห้ามผ่อนเกณฑ์เองในไฟล์นี้
import { playLife, mixSeed, treeCtl, snapshot, restore } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { random, withTree, botTree } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 500), seed = arg('--seed', 1);
const TARGET = 'occ';
const content = loadContent();
const defs = content.tree.nodes;

const bot = withTree(random, TARGET);
const lives = (ctl = {}) => {
  Object.assign(treeCtl, { cards: true, anyCat: false, cardsFree: false }, ctl);
  const out = [];
  for (let i = 0; i < n; i++) {
    // ต่อปีที่เริ่ม: จดว่าบอทมีโหนดให้ทุ่มแต่ไม่ได้ทุ่มหรือไม่ (เสียปี) ก่อนการ์ดแรกของปีนั้น
    const idle = [];
    const seen = new Set();
    const tree = Object.assign((st) => {
      botTree(st, TARGET);
      if (seen.has(st.age)) return;
      seen.add(st.age);
      const open = Object.keys(defs).filter((id) => defs[id].branch === TARGET && !defs[id].hidden && st.tree?.done?.[id] === undefined && defs[id].stages.includes(stageName(st.age)) && reach(st, id));
      if (open.length && !st.tree?.cur) idle.push(st.age);
    });
    const b = Object.assign((...a) => bot(...a), { tree });
    const { state: st, age } = playLife(mixSeed(seed, i), content, b);
    out.push({ st, age, idle });
  }
  return out;
};
import { stageOf } from '../src/engine/index.mjs';
const stageName = stageOf;
const reach = (st, id) => { const p = defs[id].pre ?? []; return !p.length || p.some((x) => st.tree?.done?.[x] !== undefined); };

const fails = [];
function beliefByStage(c) {
  const by = {};
  for (const e of c.events) if (e.category === 'belief') by[e.stage] = (by[e.stage] ?? 0) + 1;
  return Object.entries(by).map(([k, v]) => `${k} ${v}`).join(' · ') + ' (เด็ก 0)';
}
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : '-');

const real = lives();
console.log(`ต้นไม้โฟกัส · บอทเล่นแขนง ${TARGET} · ${n} ชีวิต · seed ${seed}`);

// กติกาการทุ่ม
let multi = 0, onDone = 0, idleYears = 0, investYears = 0;
for (const { st, idle } of real) {
  const hist = st.tree?.hist ?? [];
  const ages = new Set();
  for (const [age, id] of hist) {
    if (ages.has(age)) multi++;
    ages.add(age);
    if (st.tree.done[id] !== undefined && st.tree.done[id] < age) onDone++;
  }
  investYears += hist.length;
  idleYears += idle.length;
}
console.log(`ปีที่ทุ่ม ${investYears} · ปีที่ทุ่มเกิน 1 โหนด ${multi} · ครั้งที่ทุ่มโหนดที่ปลดแล้ว ${onDone} · ปีที่มีโหนดให้ทุ่มแต่ไม่ได้ทุ่ม ${idleYears}`);
if (multi) fails.push(`ทุ่มเกิน 1 โหนดในปีเดียว ${multi} ปี`);
if (onDone) fails.push(`ทุ่มโหนดที่ปลดแล้ว ${onDone} ครั้ง`);
if (idleYears) fails.push(`มีโหนดให้ทุ่มแต่ไม่ได้ทุ่ม (เสียปี) ${idleYears} ปี`);

// เซฟพาสถานะต้นไม้ไปเอง (ข้อ 40): snapshot → restore แล้วต้องได้ st.tree เดิม
let saveBad = 0, saveSeen = 0;
for (const { st } of real.slice(0, 40)) {
  if (!st.tree) continue;
  saveSeen++;
  if (JSON.stringify(restore(snapshot({ st, af: null, card: null }, content), content).st.tree) !== JSON.stringify(st.tree)) saveBad++;
}
console.log(`เซฟ→โหลด สถานะต้นไม้ตรงเดิม ${saveSeen - saveBad}/${saveSeen}`);
if (saveBad || !saveSeen) fails.push(`เซฟ→โหลดต้นไม้ไม่ตรง ${saveBad}/${saveSeen}`);

// ผลปลดรายโหนด
const ids = Object.keys(defs);
console.log('\nโหนด            ปลด/ชีวิต   อายุตอนปลด(เฉลี่ย)  ปีที่ทุ่มก่อนปลด(เฉลี่ย)');
for (const id of ids) {
  const done = real.filter(({ st }) => st.tree?.done?.[id] !== undefined);
  const hid = defs[id].hidden ? ' (ซ่อน บอทไม่แตะ)' : '';
  console.log(`${(id + ' ' + defs[id].name).padEnd(22)}${String(done.length).padStart(5)}/${n}   ${f1(mean(done.map(({ st }) => st.tree.done[id]))).padStart(8)}   ${f1(mean(done.map(({ st }) => st.tree.yrs[id]))).padStart(8)}${hid}`);
}
const belief = real.map(({ st }) => Object.values(st.tree?.cards ?? {}).reduce((a, b) => a + b, 0));
console.log(`การ์ดหมวดที่นับได้ต่อชีวิต (เฉลี่ย) ${f1(mean(belief))}`);

// ตัวควบคุม: ปิดการนับการ์ด → ต้องปลด 0
const ctl = lives({ cards: false });
const ctlDone = ctl.reduce((s, { st }) => s + Object.keys(st.tree?.done ?? {}).length, 0);
console.log(`\nตัวควบคุม (ปิดนับการ์ดหมวด) ปลดได้ ${ctlDone} โหนด`);
if (ctlDone) fails.push(`ตัวควบคุม: ปิดนับการ์ดแล้วยังปลดได้ ${ctlDone} โหนด`);

// เกณฑ์ผ่านของเจ้าของ: ปลดแขนงลึกลับครบในชีวิตเดียว
// ต้องปลด = o ที่เห็นทั้งหมด (o1–o8 ไม่รวมซ่อน) + โหนดกลางที่มี o เป็นต้นทาง · ใบ 03 นิยามไว้แค่โหนดเล็ก ที่เหลือยังไม่มีในทะเบียน
const WHOLE = [['o1'], ['o2'], ['o3'], ['o4'], ['o5', 'ใหญ่'], ['o7', 'ใหญ่'], ['o8', 'หักเห'], ['m4', 'กลาง'], ['m7', 'กลาง'], ['m9', 'กลาง'], ['m10', 'กลาง'], ['m14', 'กลาง'], ['m17', 'กลาง'], ['m19', 'กลาง'], ['m20', 'กลาง']].map(([id, kind]) => ({ id, kind }));
const full = (st) => WHOLE.every(({ id }) => st.tree?.done?.[id] !== undefined);
const whole = real.filter(({ st }) => full(st)).length;
const smallDone = real.filter(({ st }) => ids.filter((id) => !defs[id].hidden && defs[id].branch === TARGET).every((id) => st.tree?.done?.[id] !== undefined));
console.log(`\nโหนดเล็กที่ใบ 03 นิยามไว้ (o1–o4) ปลดครบ ${smallDone.length}/${n} ชีวิต · อายุตอนปลดครบ ${f1(mean(smallDone.map(({ st }) => Math.max(...ids.filter((id) => !defs[id].hidden).map((id) => st.tree.done[id])))))}`);
console.log(`เกณฑ์เจ้าของ: ปลดแขนงลึกลับครบ (${WHOLE.length} โหนด) ในชีวิตเดียว ${whole}/${n} ชีวิต`);
if (!whole) {
  // โหนดแรกที่ค้างตามลำดับแขนง + อายุตอนตายของชีวิตที่ไปไกลสุด (ปลดได้มากสุด)
  const stuckAt = (st) => WHOLE.find(({ id }) => st.tree?.done?.[id] === undefined);
  const nDone = (r) => Object.keys(r.st.tree?.done ?? {}).length;
  const best = real.reduce((a, b) => (nDone(b) > nDone(a) || (nDone(b) === nDone(a) && b.age > a.age) ? b : a));
  const s = stuckAt(best.st);
  const inDefs = s.id in defs;
  console.log(`โหนดแรกที่ค้าง: ${s.id} (${s.kind ?? 'เล็ก'}) ${inDefs ? 'อยู่ในทะเบียนแต่ปลดไม่ถึง' : 'ยังไม่อยู่ในทะเบียนของใบ 03 (โหนดเล็กเท่านั้น)'} · ชีวิตที่ไปไกลสุดตายอายุ ${best.age} ปลดไป ${Object.keys(best.st.tree?.done ?? {}).join(' ') || '- (ไม่มีชีวิตไหนปลดอะไรได้เลย)'}`);
  console.log(`การ์ดหมวดความเชื่อในเกมต่อช่วงวัย: ${beliefByStage(content)}`);
  console.log(`อายุตอนตาย (เฉลี่ยทุกชีวิต) ${f1(mean(real.map((r) => r.age)))} · ส่งเจ้าของเคาะ: ห้ามผ่อนเกณฑ์เอง`);
  fails.push('เกณฑ์เจ้าของ (ข้อ 84/86): บอทปลดแขนงลึกลับไม่ครบในชีวิตเดียว');
}

// ตารางเสนอเจ้าของ (ไม่ใช่ด่าน ไม่ผ่อนเกณฑ์): ถ้าเปลี่ยนวิธีนับการ์ด บอทเดียวกันปลด o1–o4 ได้แค่ไหน
console.log('\nตัวเลือกเสนอเจ้าของ (วัดประกอบการเคาะ ไม่ใช่ผลด่าน):');
const SMALL = ids.filter((id) => !defs[id].hidden && defs[id].branch === TARGET);
for (const [label, ctl] of [['นับการ์ดทุกหมวด (ข้อไหนก็นับ)', { anyCat: true }], ['ไม่ต้องตอบการ์ดเลย (ปีเต็มอย่างเดียว)', { cardsFree: true }]]) {
  const r = lives(ctl);
  const cols = SMALL.map((id) => {
    const d = r.filter(({ st }) => st.tree?.done?.[id] !== undefined);
    return `${id} ${d.length}/${n} อายุ ${f1(mean(d.map(({ st }) => st.tree.done[id])))}`;
  });
  console.log(`  ${label}: ${cols.join(' · ')}`);
}
Object.assign(treeCtl, { cards: true, anyCat: false, cardsFree: false });

console.log(fails.length ? `\nไม่ผ่าน ${fails.length} ข้อ\n${fails.map((f) => `  ✗ ${f}`).join('\n')}` : '\nผ่านทั้งหมด');
process.exitCode = fails.length ? 1 : 0;
