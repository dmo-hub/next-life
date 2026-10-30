// การ์ดซ้ำ + ผลย้อนถึงจริง ต่อชีวิต (ไอเดีย bitlife-8): คำบ่นหลักของเกมแนวนี้คือ "ใบเดิมอีกแล้ว" กับ "เลือกไปไม่มีผล"
// ข้อ 1 ใบเนื้อหาที่ออกเกินมา (ครั้งที่ 2+ ของ id เดียว) ต่อชีวิต p95 ≤ MAX_EXTRA
// ข้อ 2/3 นัดผลย้อนที่แกนใส่จริง (st.scheduled.push) นอกสายมู: ถึงตรงอายุนัด ≥ MIN_HIT · ยังมีชีวิตแต่ไม่ออก (ค้าง) ≤ MAX_STUCK
// continuity ตรวจว่าผลย้อนออกตรงปีและตาม when — ด่านนี้วัดว่านัดที่ใส่ไปถึงผู้เล่นกี่ส่วน และแยกค้างออกจากตายก่อนนัด
// สายมูไม่นับข้อ 2/3: ระบบความเชื่อปล่อย/ล้างธงที่ when อ่านเอง (ตรวจที่ npm run belief)
import { playLife, newLife, mixSeed, whenOk } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 2000), seed = arg('--seed', 1);
const REPEAT = { maxExtra: 4, minHit: 0.7, maxStuck: 0.12 };
// ไม่นับเป็นการ์ดซ้ำ: promo_/office_ แกนสร้างตามขั้นบันไดอาชีพ (ไม่มีใน content) · funeral_ คำสั่งเสียวนในงานศพตามแบบ
const SKIP = ['promo_', 'office_', 'funeral_'];
const content = loadContent();
const byId = Object.fromEntries(content.events.map((e) => [e.id, e]));
const q = (xs, p) => [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(p * xs.length))];
const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(1)}%` : '-');

// สายมูดูทั้งสาย (ต้นทาง + ปลายทางทุกชั้น) แบบ continuity — ปลายทางที่ไม่ได้ขึ้นต้น bel_ แต่อยู่ในสายความเชื่อก็นับเป็นมู
const up = new Map(), down = new Map();
const link = (from, to) => { for (const [m, a, b] of [[up, to, from], [down, from, to]]) (m.get(a) ?? m.set(a, new Set()).get(a)).add(b); };
for (const e of content.events) for (const c of e.choices ?? []) {
  for (const s of c.schedules ?? []) link(e.id, s.event);
  for (const o of c.outcomes ?? []) {
    if (o.next) link(e.id, o.next);
    for (const s of o.schedules ?? []) link(e.id, s.event);
  }
}
const walk = (id, m) => { const seen = new Set([id]); for (const x of seen) for (const y of m.get(x) ?? []) seen.add(y); return seen; };
const beliefCache = new Map();
const belief = (id) => {
  if (!beliefCache.has(id)) beliefCache.set(id, [...walk(id, up), ...walk(id, down)].some((x) => x.startsWith('bel_') || byId[x]?.category === 'belief'));
  return beliefCache.get(id);
};

// filter() ของ Array subclass คืน subclass (Symbol.species) ⇒ แกนกรองนัดทิ้งแล้วยังจับ push ต่อได้ทั้งชีวิต
const booked = [];
class Rec extends Array { push(...xs) { booked.push(...xs); return super.push(...xs); } }

let fail = 0;
const check = (label, bad, extra = '') => {
  console.log(`${label}${extra} → ${bad ? `ตก ${bad}` : 'ผ่าน'}`);
  if (bad) fail++;
};
console.log(`การ์ดซ้ำ + ผลย้อนถึงจริง · ${Object.keys(BOTS).length} บอท × ${n} ชีวิต · seed ${seed}`);
const extras = [], dupIdsLife = [], dupIds = new Map(), skipped = Object.fromEntries(SKIP.map((p) => [p, 0]));
let engineOnly = 0;
const E = { n: 0, hit: 0, dead: 0, done: 0, stuck: 0 };
const stuckIds = new Map();
for (const [name, bot] of Object.entries(BOTS)) {
  for (let i = 0; i < n; i++) {
    booked.length = 0;
    const st0 = newLife(mixSeed(seed, i), content);
    st0.scheduled = new Rec();
    const fired = new Map();
    const life = playLife(st0.seed, content, bot, (card, st) => {
      if (card.kind !== 'event' || !card.id) return;
      (fired.get(card.id) ?? fired.set(card.id, []).get(card.id)).push(st.age);
      // เหตุที่ค้าง: ปีนัดมีการ์ดอื่นออก ⇒ ตรวจ when ของปลายทาง ณ ตอนนั้น · ไม่มีการ์ดในปีนัด = ตรวจที่การ์ดแรกของปีถัดไป
      for (const b of booked) if (b.age === st.age && card.id !== b.event) { b.checked = true; if (!whenOk(st, byId[b.event]?.when)) b.whenFail = true; }
      for (const b of booked) if (!b.checked && b.next === undefined && st.age > b.age) b.next = whenOk(st, byId[b.event]?.when);
    }, st0);
    let extra = 0, ids = 0;
    for (const [id, ages] of fired) {
      if (ages.length < 2) continue;
      const p = SKIP.find((x) => id.startsWith(x));
      if (p) { skipped[p] += ages.length - 1; continue; }
      if (!byId[id]) { engineOnly += ages.length - 1; continue; }
      extra += ages.length - 1;
      ids++;
      dupIds.set(id, (dupIds.get(id) ?? 0) + 1);
    }
    extras.push(extra);
    dupIdsLife.push(ids);
    const end = life.state.age;
    for (const b of booked) {
      if (belief(b.event)) continue;
      const ages = fired.get(b.event) ?? [];
      const why = ages.includes(b.age) ? 'hit' : b.age > end ? 'dead' : ages.some((a) => a < b.age) ? 'done' : 'stuck';
      E.n++;
      E[why]++;
      if (why === 'stuck') {
        const r = b.whenFail ? 'when ตกในปีนัด' : b.checked ? 'when ผ่านแต่ไม่ออก' : b.next === false ? 'ปีนัดไม่มีการ์ด · ปีถัดไป when ตก' : b.next === true ? 'ปีนัดไม่มีการ์ด · ปีถัดไป when ผ่าน' : 'ปีนัดไม่มีการ์ด · ไม่มีปีถัดไป';
        const o = stuckIds.get(b.event) ?? stuckIds.set(b.event, { n: 0 }).get(b.event);
        o.n++;
        o[r] = (o[r] ?? 0) + 1;
      }
    }
  }
}
const lives = extras.length;
console.log(`\nใบเนื้อหาที่ออกเกินมาต่อชีวิต: p50 ${q(extras, 0.5)} · p95 ${q(extras, 0.95)} · สูงสุด ${Math.max(...extras)} · id ซ้ำต่อชีวิต p95 ${q(dupIdsLife, 0.95)} · ชีวิตที่มี ≥1 ${pct(extras.filter((x) => x).length, lives)}`);
console.log(`  ตัดออก (ครั้งที่ 2+): ${SKIP.map((p) => `${p}* ${skipped[p]}`).join(' · ')} · แกนสร้างอื่นที่ไม่มีใน content ${engineOnly}`);
console.log(`  id ซ้ำบ่อยสุด (สัดส่วนชีวิต): ${[...dupIds].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([id, v]) => `${id} ${pct(v, lives)}`).join(' · ')}`);
console.log(`\nนัดผลย้อนนอกสายมู ${E.n} นัด (${(E.n / lives).toFixed(2)}/ชีวิต): ถึงตรงนัด ${pct(E.hit, E.n)} · ตายก่อนนัด ${pct(E.dead, E.n)} · ออกไปก่อนนัดแล้ว ${pct(E.done, E.n)} · ค้าง ${pct(E.stuck, E.n)}`);
console.log('  ค้างแยกเหตุ (ให้เลน A ดูเงื่อนไขปลายทาง):');
for (const [id, o] of [...stuckIds].sort((a, b) => b[1].n - a[1].n).slice(0, 15)) {
  const { n: k, ...why } = o;
  console.log(`    ${id} ${k} · ${Object.entries(why).map(([r, v]) => `${r} ${v}`).join(' · ')} · when ${JSON.stringify(byId[id]?.when ?? null)}`);
}
console.log('');
check(`ใบเนื้อหาที่ออกเกินมาต่อชีวิต p95 ≤ ${REPEAT.maxExtra}`, q(extras, 0.95) > REPEAT.maxExtra ? 1 : 0, ` · ${q(extras, 0.95)}`);
check(`ผลย้อนนอกสายมูถึงตรงนัด ≥ ${REPEAT.minHit * 100}%`, E.hit < REPEAT.minHit * E.n ? 1 : 0, ` · ${pct(E.hit, E.n)}`);
check(`ผลย้อนนอกสายมูค้าง ≤ ${REPEAT.maxStuck * 100}%`, E.stuck > REPEAT.maxStuck * E.n ? 1 : 0, ` · ${pct(E.stuck, E.n)}`);
console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
if (fail) process.exitCode = 1;
