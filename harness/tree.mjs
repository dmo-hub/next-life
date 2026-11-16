// ต้นไม้โฟกัส (ใบ 03 tracer): บอทเล่นต้นไม้ทุกปีตลอดชีวิต (ข้อ 85) แล้ววัด — ปีที่ทุ่ม · โหนดที่ปลด · อายุตอนปลด
// ด่านกติกา: ทุกปีที่ทุ่มเข้าหลอดโหนดเดียว · 0 ครั้งที่ทุ่มโหนดที่ปลดแล้ว · ปลดแล้วโหนดถัดไปนับปีถัดไปทันที (ไม่เสียปี) · ตัวควบคุมปิดนับการ์ด = ปลด 0
// ด่านเกณฑ์ผ่านของเจ้าของ (ข้อ 84 · 86): บอทปลดแขนงลึกลับครบในชีวิตเดียว (o ที่เห็นทั้งหมด + โหนดกลางที่มี o เป็นต้นทาง · o6 ซ่อนไม่นับ)
// ไม่ครบ = ตก พิมพ์โหนดแรกที่ค้างกับอายุตอนตาย แล้วส่งเจ้าของเคาะ — ห้ามผ่อนเกณฑ์เองในไฟล์นี้
import { playLife, mixSeed, treeInvestNode, treeCtl, snapshot, restore, successP, treeRollLevel, treeRollMul, treeCardMul, choiceHidden } from '../src/engine/index.mjs';
import { treeBudgetSpent } from '../src/node/lint/tree.mjs';
import { loadContent } from '../src/node/load.mjs';
import { random, withTree, botTree, withGate } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 500), seed = arg('--seed', 1);
const TARGET = 'occ';
const content = loadContent();
const defs = content.tree.nodes;

const bot = withTree(random, TARGET);
const lives = (ctl = {}) => {
  Object.assign(treeCtl, { cards: true, anyCat: false, cardsFree: false, passive: true }, ctl);
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
Object.assign(treeCtl, { cards: true, anyCat: false, cardsFree: false, passive: true });

// ── ผลติดตัว + งบข้อ 42 (ใบ 04) ──
console.log('\nผลติดตัว (ใบ 04)');
const T = content.tree;
// ผู้ปลดจริงของด่านนี้: ที่นับการ์ดทุกหมวด (ตัวเลือกเสนอเจ้าของข้างบน) — ด่านเกณฑ์เจ้าของข้อ 84/86 ตกอยู่ก่อนแล้วจึงไม่มีชีวิตที่ปลดอะไรเลยในกลุ่มหลัก · ผลติดตัววัดกับกลุ่มที่ปลดได้ ไม่ผ่อนเกณฑ์เจ้าของ
treeCtl.anyCat = true;
const pop = lives({ anyCat: true });
treeCtl.anyCat = false;

// 1) งบ (ข้อ 93): ผลเบาถาวรรวมทั้งต้น/ปี ≤ เพดานในทะเบียน · แสดงเทียบโฟกัสเดิมตัวแรงสุดเพื่อประกอบการเคาะ
const spent = treeBudgetSpent(T);
const focusMax = Object.values(content.focus.focuses).map((f) => Object.entries(f.fx ?? {}).filter(([k]) => k !== 'money').map(([, v]) => Math.abs(v))).map((a) => ({ sum: a.reduce((x, y) => x + y, 0) * content.focus.year_scale, one: Math.max(0, ...a) * content.focus.year_scale }));
console.log(`งบผลเบาถาวรรวม ${spent.toFixed(3)} / เพดาน ${T.budget} (ระดับการ์ด/ปี · ข้อ 93) · เทียบโฟกัสเดิมตัวแรงสุด: รวมทุกค่า ${Math.max(...focusMax.map((x) => x.sum)).toFixed(2)} · ค่าเดียว ${Math.max(...focusMax.map((x) => x.one)).toFixed(2)}`);
if (spent > T.budget) fails.push(`งบผลเบารวม ${spent.toFixed(3)} เกินเพดาน ${T.budget}`);

// ตัวควบคุมงบ: ปิดผลติดตัว (passive) → ทุกชีวิตที่มีโหนดปลด ตัวคูณทอย/ถ่วงการ์ดต้องเป็น 1 พอดี (ต่างจากฐาน 0) · เปิด → ต้องมีชีวิตที่ต่างจาก 1
const cats = [...new Set(Object.values(defs).flatMap((d) => d.cat))];
const dev = (rs) => rs.reduce((s, { st }) => s + cats.reduce((a, c) => a + Math.abs(treeRollMul(st, defs, T.roll_k, c) - 1) + Math.abs(treeCardMul(st, defs, T.card_mul, c) - 1), 0), 0);
const devOn = dev(pop);
treeCtl.passive = false;
const devOff = dev(pop);
treeCtl.passive = true;
console.log(`ตัวควบคุมงบ: ผลต่างจากฐาน (ทอย + ถ่วงการ์ด) เปิด ${devOn.toFixed(2)} · ปิดผลติดตัว ${devOff.toFixed(2)}`);
if (!(devOn > 0)) fails.push('ผลติดตัวเปิดแล้วทอย/ถ่วงการ์ดไม่ต่างจากฐานเลย (ไม่มีผล)');
if (devOff !== 0) fails.push(`ตัวควบคุม: ปิดผลติดตัวแล้วยังต่างจากฐาน ${devOff}`);

// 2) ถ่วงการ์ดเฉพาะแขนงที่ปลดมากสุด (ข้อ 42) — นิยามสังเคราะห์ 2 แขนง (ทะเบียนจริงมีแขนงเดียว)
{
  const mk = (branch, cat, extra = {}) => ({ branch, cat: [cat], roll: 1, ...extra });
  const syn = { a1: mk('A', 'belief'), a2: mk('A', 'belief'), b1: mk('B', 'family') };
  const w = (done, cat) => treeCardMul({ tree: { done } }, syn, 1.25, cat);
  const rows = [
    ['แขนง A ปลดมากสุด → ถ่วงหมวด A', w({ a1: 5, a2: 6, b1: 7 }, 'belief'), 1.25],
    ['แขนง B ไม่ใช่แขนงมากสุด → 1', w({ a1: 5, a2: 6, b1: 7 }, 'family'), 1],
    ['เสมอกัน → ไม่ถ่วงใคร (A)', w({ a1: 5, b1: 7 }, 'belief'), 1],
    ['เสมอกัน → ไม่ถ่วงใคร (B)', w({ a1: 5, b1: 7 }, 'family'), 1],
    ['ไม่ได้ปลดอะไร → 1', w({}, 'belief'), 1],
    ['หมวดนอกแขนง → 1', w({ a1: 5, a2: 6 }, 'study'), 1],
  ];
  const bad = rows.filter(([, got, want]) => got !== want);
  console.log(`ถ่วงการ์ดเฉพาะแขนงปลดมากสุด: ${rows.length - bad.length}/${rows.length} เคส${bad.length ? ' · ตก: ' + bad.map(([n, g, wn]) => `${n} ได้ ${g} ต้อง ${wn}`).join(' | ') : ''}`);
  for (const [n, g, wn] of bad) fails.push(`ถ่วงการ์ด "${n}" ได้ ${g} ต้อง ${wn}`);
}

// 3) เกณฑ์ข้อ 58: โหนดเดียวเอียงต่ำกว่าขั้นป้าย 5% · ทุกโอกาสสำเร็จ ≤ 0.95 แม้ปลดครบทั้งทะเบียน
{
  const okCards = content.events.filter((e) => e.category === 'belief' && e.choices?.some((c) => c.outcomes?.some((o) => o.ok)));
  const all = Object.fromEntries(Object.keys(defs).map((id) => [id, 1]));
  let belowStep = 0, lives = 0, maxP = 0, maxOne = 0, hits = 0;
  for (const { st } of pop.slice(0, 100)) {
    lives++;
    const base = { ...st, tree: undefined };
    let worst = 0;
    for (const ev of okCards) for (const c of ev.choices) {
      if (!c.outcomes?.some((o) => o.ok)) continue;
      const p0 = successP(base, c, ev);
      for (const id of Object.keys(defs)) {
        if (!defs[id].cat.includes(ev.category)) continue;
        worst = Math.max(worst, Math.abs(successP({ ...st, tree: { done: { [id]: 1 } } }, c, ev) - p0));
      }
      maxP = Math.max(maxP, successP({ ...st, tree: { done: all } }, c, ev));
      hits++;
    }
    maxOne = Math.max(maxOne, worst);
    if (worst < 0.05) belowStep++;
  }
  console.log(`ข้อ 58: ชีวิตที่โหนดเดียวเอียงต่ำกว่าขั้น 5% ${belowStep}/${lives} (เอียงสูงสุด ${(maxOne * 100).toFixed(1)} จุด) · โอกาสสำเร็จสูงสุดเมื่อปลดครบ ${maxP.toFixed(3)} (เพดาน 0.95) · ${hits} คู่ ชีวิต×ตัวเลือก`);
  if (belowStep < lives) fails.push(`ข้อ 58: ชีวิต ${lives - belowStep}/${lives} ที่โหนดเดียวเอียงถึงขั้นป้าย 5% (เอียงสูงสุด ${(maxOne * 100).toFixed(1)} จุด)`);
  if (maxP > 0.95 + 1e-9) fails.push(`ข้อ 58: โอกาสสำเร็จ ${maxP.toFixed(3)} เกินเพดาน 0.95`);
  if (!hits) fails.push('ข้อ 58: ไม่มีตัวเลือกหมวดความเชื่อที่มีทางสำเร็จให้วัด');
}

// 4) อาชีพตรงชั้นเดียว (ข้อ 17 50 53) — นิยามสังเคราะห์ (แขนงงานยังไม่ลงทะเบียน)
{
  const syn = {
    w1: { branch: 'W', cat: ['work_money'], roll: 1, jobs: ['clerk'], job_roll: 1 },
    w2: { branch: 'W', cat: ['work_money'], roll: 1, jobs: ['clerk', 'officer'], job_roll: 2 },
  };
  const h = { tree: { done: { w1: 5, w2: 6 } } };
  const rows = [
    ['อาชีพตรง 2 โหนดซ้อนกัน = ทอยปกติ 2 + โบนัสชั้นเดียว (สูงสุด 2) = 4', treeRollLevel(h, syn, 'work_money', 'clerk'), 4],
    ['อาชีพไม่ตรง = ทอยปกติ 2 ไม่มีโบนัส', treeRollLevel(h, syn, 'work_money', 'farmer'), 2],
    ['ไม่มีงาน (occ ว่าง) = ทอยปกติ 2', treeRollLevel(h, syn, 'work_money', null), 2],
    ['อาชีพตรงเฉพาะโหนดเดียว = ทอย 2 + โบนัส 1', treeRollLevel({ tree: { done: { w1: 5, w2: 6 } } }, { ...syn, w2: { ...syn.w2, jobs: ['officer'] } }, 'work_money', 'clerk'), 3],
  ];
  const bad = rows.filter(([, got, want]) => got !== want);
  console.log(`โบนัสอาชีพตรงชั้นเดียว: ${rows.length - bad.length}/${rows.length} เคส${bad.length ? ' · ตก: ' + bad.map(([n, g, wn]) => `${n} ได้ ${g} ต้อง ${wn}`).join(' | ') : ''}`);
  for (const [n, g, wn] of bad) fails.push(`อาชีพตรง "${n}" ได้ ${g} ต้อง ${wn}`);
}

// 5) ตัวเลือกใหม่บนการ์ดเดิม: show_if: {tree: [โหนด]} ซ่อนจนปลดครบทุกโหนดที่ระบุ — ไม่มีป้ายใหม่ (กลไกเดียวกับ show_if อื่น)
{
  const c = { show_if: { tree: ['o1', 'o2'] } };
  const rows = [
    ['ไม่เคยทุ่ม → ซ่อน', choiceHidden({ tree: undefined, flags: {} }, c), true],
    ['ปลดไม่ครบ → ซ่อน', choiceHidden({ tree: { done: { o1: 3 } }, flags: {} }, c), true],
    ['ปลดครบ → โชว์', choiceHidden({ tree: { done: { o1: 3, o2: 8 } }, flags: {} }, c), false],
  ];
  const bad = rows.filter(([, got, want]) => got !== want);
  console.log(`ตัวเลือกใหม่ show_if tree: ${rows.length - bad.length}/${rows.length} เคส${bad.length ? ' · ตก: ' + bad.map(([n]) => n).join(' | ') : ''}`);
  for (const [n] of bad) fails.push(`show_if tree "${n}"`);
}

// 6) การ์ดด่านโหนดใหญ่ + keystone (ใบ 05): ใช้โหนดสังเคราะห์ zb (ใหญ่ ผล 3 ทาง) · zk (keystone) แยกแขนง zz ไม่แตะทะเบียนจริง
// o5/o8 จริงรอเจ้าของเคาะเนื้อ — ด่านนี้พิสูจน์กลไก: การ์ดด่านโผล่ · ผลทุกทางถูกเลือก · ไม่เลื่อนเข้า keystone เอง · ล้างไม่ได้ · ต้อง ack ก่อนทุ่ม
{
  const ALL = ['เด็ก', 'วัยรุ่น', 'หนุ่มสาว', 'ทำงาน', 'กลางคน', 'ชรา'];
  const zb = { name: 'โหนดใหญ่ทดสอบ', branch: 'zz', size: 'b', stages: ALL, pre: [], years: 2, cards: 0, cat: ['belief'], fx: { happiness: 1 }, light: { happiness: 1 }, roll: 1,
    gate: { title: 'ด่านทดสอบ', text: 'ถึงด่านของโหนดใหญ่ทดสอบ', results: [{ text: 'ทางหนึ่ง', fx: { happiness: 1 } }, { text: 'ทางสอง', fx: { knowledge: 1 } }, { text: 'ทางสาม', fx: { relations: 1 } }] } };
  const zk = { name: 'ยอดทดสอบ', branch: 'zz', size: 'k', stages: ALL, pre: ['zb'], years: 2, cards: 0, cat: ['belief'], fx: { happiness: 2 }, light: { happiness: 1 }, roll: 1, keystone: true, warn: 'ได้แรงแต่เสียถาวร', cost: { health: -1 } };
  const synth = { ...content, tree: { ...content.tree, nodes: { zb, zk, ...defs } } };
  const m = Math.min(n, 300);
  const run = (takeKey) => {
    const res = [];
    for (let i = 0; i < m; i++) {
      Object.assign(treeCtl, { cards: true, anyCat: false, cardsFree: false, passive: true });
      const tree = (st) => {
        if (st.tree?.cur) return;
        if (st.tree?.done?.zb === undefined) { if (stageOf(st.age) === 'เด็ก') treeInvestNode(st, 'zb'); }
        else if (takeKey && st.tree.done.zk === undefined && !st.tree.pend) { try { treeInvestNode(st, 'zk', true); } catch { /* ช่วงวัยยังไม่ถึง */ } }
      };
      let gates = 0, doneSeen = false, lostKey = false;
      const onCard = (card, st) => {
        if (card.id === 'tree_gate_zb') gates++;
        if (st.tree?.done?.zk !== undefined) doneSeen = true;
        else if (doneSeen) lostKey = true;
      };
      const b = Object.assign(withGate(random), { tree });
      const { state: st } = playLife(mixSeed(seed, i), synth, b, onCard);
      res.push({ st, gates, lostKey });
    }
    return res;
  };
  const taken = run(true);
  const idle = run(false);
  const gateCards = taken.reduce((s, r) => s + r.gates, 0);
  const picked = [0, 0, 0];
  for (const { st } of taken) if (st.tree?.gate?.zb !== undefined) picked[st.tree.gate.zb]++;
  const gotKey = taken.filter(({ st }) => st.tree?.done?.zk !== undefined).length;
  const auto = idle.filter(({ st }) => st.tree?.done?.zk !== undefined || st.tree?.hist?.some(([, id]) => id === 'zk')).length;
  const lost = taken.filter((r) => r.lostKey).length;
  // keystone ต้องอยู่ก่อนโหนดอื่นในทะเบียน (zb zk นำหน้า) ไม่งั้นการเลื่อนเลือกโหนดจริงก่อนและด่านไม่เคยแตะ guard · keystone ไม่ผ่าน ack ต้องทุ่มไม่ได้ — ลองจนเจอชีวิตที่ถึงขั้นทุ่มจริง (tried) · ไม่เคยถึง = ตก ไม่ใช่ผ่านเงียบ
  let tried = false, blocked = false;
  for (let i = 0; i < 20 && !tried; i++) {
    playLife(mixSeed(seed, i), synth, Object.assign(withGate(random), { tree: (s) => {
      if (s.tree?.cur || tried) return;
      if (s.tree?.done?.zb === undefined) { if (stageOf(s.age) === 'เด็ก') treeInvestNode(s, 'zb'); return; }
      tried = true;
      try { treeInvestNode(s, 'zk'); } catch { blocked = true; }
    } }));
  }
  const noAck = tried && blocked;
  console.log(`การ์ดด่าน zb: ${gateCards} ใบใน ${m} ชีวิต · ผลทั้ง 3 ทางถูกเลือก ${picked.join('/')} · ได้ keystone ${gotKey}/${m} · เลื่อนเข้า keystone เอง ${auto}/${m} · keystone หายหลังได้ ${lost} · ทุ่มโดยไม่ ack ${noAck ? 'ถูกกัน' : 'หลุด'}`);
  if (!gateCards) fails.push('การ์ดด่านโหนดใหญ่ไม่โผล่เลยแม้ปีครบ');
  picked.forEach((c, k) => { if (!c) fails.push(`ผลทางที่ ${k + 1} ของการ์ดด่านไม่เคยถูกเลือก`); });
  if (!gotKey) fails.push('ไม่มีชีวิตไหนได้ keystone (บอทตั้งใจทุ่ม)');
  if (auto) fails.push(`เลื่อนเข้า keystone เอง ${auto} ชีวิต (ต้อง 0)`);
  if (lost) fails.push(`keystone หายหลังปลด ${lost} ชีวิต (ล้างไม่ได้)`);
  if (!noAck) fails.push('ทุ่ม keystone โดยไม่ผ่าน ack ได้');
}

console.log(fails.length ? `\nไม่ผ่าน ${fails.length} ข้อ\n${fails.map((f) => `  ✗ ${f}`).join('\n')}` : '\nผ่านทั้งหมด');
process.exitCode = fails.length ? 1 : 0;
