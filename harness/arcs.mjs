// ตัวคุมสายเรื่องรายคน (krung-1): เนื้อจริง + สายตัวอย่าง 2 สายใน content-fixtures/harness/arcs/ · บอททุกบุคลิกเล่นชีวิตชุดเดียวกัน
// ด่าน: ตอนของทุกสายรวมกันปีละ ≤1 · ตอนติดกันห่าง ≥ ARC.gap · คนเดิมห่าง ≥ ARC.same · เลขตอน/ระยะบนการ์ดตรงที่เกิดจริง
// · หน้าจบ (arcSummary) มีทุกสายที่เปิด เลขตอนตรง · นัดของสายไม่หาย (ออก หรือยังรออยู่ตอนตาย) · กองไม่หยิบสายที่ปิดแล้ว
// · ชีวิตไม่ยาวขึ้น: การ์ดต่อชีวิตเทียบเนื้อจริงอย่างเดียว ชุด seed เดียวกัน
// เรื่องต่อสายเดียวกันปีเดียวกันเป็นตอนเดียวกัน (การ์ด 2 ใบ ตอนเดียว) — นับปีละตอน ไม่ใช่ปีละใบ
import { playLife, newLife, mixSeed, arcSummary, ARC } from '../src/engine/index.mjs';
import { loadContent, loadEvents, loadArcs } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 300), seed = arg('--seed', 1);
// การ์ดต่อชีวิตเพิ่มได้ไม่เกินนี้ (สัดส่วน) — เรื่องต่อสายเดียวกันเป็นใบเพิ่มที่หักโควตาแล้ว ส่วนต่างเหลือแค่ปีที่จั่วไม่ได้อีก
const MAX_LONGER = 0.01;
const real = loadContent();
const fx = loadEvents('content-fixtures/harness/arcs/');
const content = { ...real, events: [...real.events, ...fx], arcs: { ...real.arcs, ...loadArcs(fx, 'content-fixtures/harness/arcs/rules/arcs.yaml') } };
const POOL = new Set(fx.filter((e) => e.weight).map((e) => e.id));

// filter() ของ Array subclass คืน subclass (Symbol.species) ⇒ แกนกรองนัดทิ้งแล้วยังจับ push ต่อได้ทั้งชีวิต · เก็บตัวนัดเอง แกนเลื่อนอายุที่ตัวนี้
const booked = [];
class Rec extends Array { push(...xs) { for (const x of xs) if (byArc(x.event)) booked.push({ ref: x, event: x.event, age0: x.age }); return super.push(...xs); } }
const fails = [];
const bad = (k, msg) => { const o = fails.find((f) => f.k === k) ?? (fails.push({ k, n: 0, ex: msg }), fails.at(-1)); o.n++; };
const S = { done: 0, lives: 0, eps: 0, cards: 0, both: 0, deferred: 0, booked: 0, fired: 0, waiting: 0, lost: 0, ended: 0, cardsReal: 0, cardsFx: 0 };
const perKey = {};
for (const [name, bot] of Object.entries(BOTS)) {
  for (let i = 0; i < n; i++) {
    const s = mixSeed(seed, i);
    S.cardsReal += playLife(s, real, bot).cards;
    const st0 = newLife(s, content);
    booked.length = 0;
    st0.scheduled = new Rec();
    const eps = [];
    const endAge = {};
    const seen = new Map();
    const life = playLife(s, content, bot, (card, st) => {
      if (card.kind !== 'event' || !card.arc) return;
      (seen.get(card.id) ?? seen.set(card.id, []).get(card.id)).push(st.age);
      S.cards++;
      const { key, n: k, gap } = card.arc;
      const prev = eps.findLast((e) => e.key === key);
      if (prev?.age === st.age) {
        if (prev.n !== k) bad('same-age', `${name}#${i} ${key} อายุ ${st.age} ตอน ${prev.n} → ${k}`);
        return;
      }
      const last = eps.at(-1);
      if (last && st.age - last.age < ARC.gap) bad('gap', `${name}#${i} ${last.key}@${last.age} → ${key}@${st.age}`);
      if (prev && st.age - prev.age < ARC.same) bad('same', `${name}#${i} ${key} ${prev.age} → ${st.age}`);
      if (k !== (prev?.n ?? 0) + 1) bad('n', `${name}#${i} ${key} ตอน ${k} หลังตอน ${prev?.n ?? 0}`);
      if (prev ? gap !== st.age - prev.age : gap !== undefined) bad('label-gap', `${name}#${i} ${key} gap ${gap}`);
      if (endAge[key] !== undefined && POOL.has(card.id)) bad('pool-after-end', `${name}#${i} ${card.id} อายุ ${st.age} หลังปิด ${endAge[key]}`);
      eps.push({ key, n: k, age: st.age });
      if (st.arcs[key].end) endAge[key] ??= st.age;
    }, st0);
    const st = life.state;
    for (const [key, a] of Object.entries(st.arcs ?? {})) if (a.end) endAge[key] ??= -1;
    const sum = arcSummary(st);
    const keys = [...new Set(eps.map((e) => e.key))];
    if (sum.length !== keys.length || keys.some((k) => sum.find((x) => x.key === k)?.n !== eps.filter((e) => e.key === k).length)) bad('summary', `${name}#${i} ${JSON.stringify(sum)}`);
    for (const x of sum) if (!x.name || x.name === x.key) bad('summary-name', `${name}#${i} ${x.key}`);
    S.ended += sum.filter((x) => x.end).length;
    for (const b of booked) {
      S.booked++;
      if (b.ref.age !== b.age0) S.deferred++;
      const ages = seen.get(b.event) ?? [];
      if (ages.includes(b.ref.age)) S.fired++;
      // ปีที่ตาย (ตายตอนขึ้นปี/กลางปี) การ์ดของปีนั้นไม่ได้ออกทุกใบ = ตายก่อนนัด ไม่ใช่หาย
      else if (b.ref.age >= st.age) S.waiting++;
      // ปลายทางไม่มี repeat ออกไปแล้วก่อนถึงนัด = แกนทิ้งนัดซ้ำตามเดิม (repeat.mjs นับ "ออกไปก่อนนัดแล้ว") ไม่ใช่ตัวคุมทำหาย
      else if (ages.some((a) => a < b.ref.age)) S.done++;
      else { S.lost++; bad('lost', `${name}#${i} ${b.event} นัด ${b.age0} → ${b.ref.age} ตาย ${st.age}`); }
    }
    S.lives++;
    S.eps += eps.length;
    S.cardsFx += life.cards;
    if (keys.length === 2) S.both++;
    for (const k of keys) perKey[k] = (perKey[k] ?? 0) + 1;
  }
}
function byArc(id) { return content.events.find((e) => e.id === id)?.arc; }

const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(1)}%` : '-');
const longer = S.cardsFx / S.cardsReal - 1;
console.log(`สายเรื่องรายคน · ${Object.keys(BOTS).length} บอท × ${n} ชีวิต · seed ${seed} · gap ${ARC.gap} · same ${ARC.same}`);
console.log(`ตอน ${S.eps} (${(S.eps / S.lives).toFixed(2)}/ชีวิต) · การ์ดสาย ${S.cards} · ชีวิตที่เปิดครบ 2 สาย ${pct(S.both, S.lives)} · ${Object.entries(perKey).map(([k, v]) => `${k} ${pct(v, S.lives)}`).join(' · ')} · ปิดสาย ${S.ended}`);
console.log(`นัดของสาย ${S.booked}: ออก ${S.fired} · เลื่อน ${S.deferred} · ตายก่อนนัด ${S.waiting} · ปลายทางออกไปก่อนนัด ${S.done} · หาย ${S.lost}`);
console.log(`การ์ดต่อชีวิต: เนื้อจริง ${(S.cardsReal / S.lives).toFixed(2)} · +สายตัวอย่าง ${(S.cardsFx / S.lives).toFixed(2)} (${(100 * longer).toFixed(2)}%)`);
// ตัวควบคุม: ตัวคุมต้องได้กั้นจริง ไม่งั้นด่านข้างบนผ่านเพราะไม่มีอะไรให้วัด
if (S.both < S.lives * 0.3) fails.push({ k: 'control-both', n: 1, ex: `เปิดครบ 2 สายแค่ ${pct(S.both, S.lives)}` });
if (!S.deferred) fails.push({ k: 'control-defer', n: 1, ex: 'ไม่มีนัดถูกเลื่อน — ทางนัดชนปีเว้นไม่ได้วัด' });
if (!S.ended) fails.push({ k: 'control-end', n: 1, ex: 'ไม่มีสายถูกปิด' });
if (longer > MAX_LONGER) fails.push({ k: 'longer', n: 1, ex: `การ์ดต่อชีวิตเพิ่ม ${(100 * longer).toFixed(2)}% เกิน ${100 * MAX_LONGER}%` });
for (const f of fails) console.log(`  ✗ ${f.k} ${f.n} ครั้ง · เช่น ${f.ex}`);
console.log(fails.length ? `ไม่ผ่าน ${fails.length} ข้อ` : 'ผ่านทั้งหมด');
if (fails.length) process.exitCode = 1;
