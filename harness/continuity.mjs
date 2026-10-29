// เรื่องต่อ + ผลย้อน (เฟส 1): ผู้เล่นเจอผลของการเลือกตามมาจริงไหม — บอททุกสายเล่นเนื้อหาจริง
// เรื่องต่อ = การ์ดปลายทาง next ของผลสุ่ม (ออกปีเดียวกัน) · ผลย้อน = การ์ดที่ schedules นัดไว้ปีหลัง
// ปลายทางทั้งสองแบบไม่อยู่ในกองสุ่ม/หลักไมล์ (ด่านตรวจข้างล่าง) การ์ดที่เห็นจึงนับเป็นผลของการเลือกได้ตรง ๆ
// ด่าน: ผลย้อนออกตรงปีที่นัด · ออกเมื่อ when ของมันผ่านเท่านั้น — เว้นการ์ดสายมู (category belief) ที่ระบบความเชื่อปล่อยเอง
// และล้างธงที่ when อ่านไปพร้อมกับการ์ด (ตรวจที่ npm run belief) · --min-next / --min-echo = เป้าสัดส่วนชีวิต (ไม่ใส่ = รายงานอย่างเดียว)
// รายชื่อปลายทางที่ไม่เคยออกให้เลน A ดูว่าเนื้อหาใหม่ถึงผู้เล่นจริง · ตารางแยกหมวดให้แต่ละเลนวัดก้อนของตัวเอง
import { playLife, mixSeed, whenOk } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 4000), seed = arg('--seed', 1);
const minNext = arg('--min-next', null), minEcho = arg('--min-echo', null);
// ชีวิตยาว = อยู่ถึงอายุนี้ — ผลย้อนนัดหลายปี ชีวิตสั้นไม่มีเวลาให้ทวง
const LONG_AGE = 50;
const content = loadContent();
const byId = Object.fromEntries(content.events.map((e) => [e.id, e]));
const NEXT = new Set(), ECHO = new Set();
for (const e of content.events) for (const c of e.choices ?? []) {
  for (const s of c.schedules ?? []) ECHO.add(s.event);
  for (const o of c.outcomes ?? []) {
    if (o.next) NEXT.add(o.next);
    for (const s of o.schedules ?? []) ECHO.add(s.event);
  }
}
const fail = [];
const drawn = [...NEXT, ...ECHO].filter((id) => byId[id] && (byId[id].weight || byId[id].age !== undefined));
if (drawn.length) fail.push(`ปลายทางที่อยู่ในกองสุ่ม/หลักไมล์ด้วย นับแยกไม่ได้: ${drawn.join(' ')}`);

// หมวดของสาย — จับจากเนื้อของการ์ด ไม่ใช่ชื่อไฟล์: สายหนี้/โกงหลายสายอยู่ในไฟล์ช่วงวัย (young · mid · old) ไม่ใช่ debt/corruption.yaml
// ดูทั้งสายของปลายทาง (ต้นทางทุกชั้น + ปลายทางถัดไปทุกชั้น) ไม่ใช่ใบต้นทางใบเดียว · ใบหนึ่งแตะได้หลายหมวด จึงไล่ตามลำดับ CATS หมวดแรกที่ตรงชนะ
const TARGET = new Set([...NEXT, ...ECHO]);
const DEBT_FLAGS = ['in_debt', 'loan_shark', 'guarantor'];
const FRAUD_FLAGS = ['embezzler', 'took_bribe', 'caught_fraud'];
const parts = (e) => (e?.choices ?? []).flatMap((c) => [c, ...(c.outcomes ?? [])]);
const anyPart = (id, test) => parts(byId[id]).some(test);
const up = new Map(), down = new Map();
const link = (from, to) => {
  for (const [m, a, b] of [[up, to, from], [down, from, to]]) (m.get(a) ?? m.set(a, new Set()).get(a)).add(b);
};
for (const e of content.events) for (const c of e.choices ?? []) {
  for (const s of c.schedules ?? []) link(e.id, s.event);
  for (const o of c.outcomes ?? []) {
    if (o.next) link(e.id, o.next);
    for (const s of o.schedules ?? []) link(e.id, s.event);
  }
}
const walk = (id, m) => {
  const seen = new Set([id]);
  for (const x of seen) for (const y of m.get(x) ?? []) seen.add(y);
  return seen;
};
const CATS = [
  // สายมูปล่อย/ล้างธงเอง (ระบบความเชื่อ) — แยกก่อน ไม่ให้ไปปนหมวดเรื่องที่บนบานถึง
  ['มู', (id) => id.startsWith('bel_') || byId[id]?.category === 'belief'],
  ['ทุจริต', (id) => anyPart(id, (w) => (w.merit ?? []).some((m) => m.cat === 'greed_harm' && (m.level ?? 1) >= 2) || (w.sets_flags ?? []).some((f) => FRAUD_FLAGS.includes(f)))],
  ['หนี้', (id) => anyPart(id, (w) => w.effects?.debt || (w.sets_flags ?? []).some((f) => DEBT_FLAGS.includes(f)))],
  ['สุขภาพ', (id) => byId[id]?.category === 'health'],
  ['ครอบครัว', (id) => byId[id]?.category === 'family'],
  ['งาน/เงิน', () => true],
];
const catOf = new Map();
const cat = Object.fromEntries(CATS.map(([k]) => [k, { roots: new Set(), targets: 0, withNext: 0, nextCards: 0, longEcho: 0 }]));
for (const id of TARGET) {
  const line = new Set([...walk(id, up), ...walk(id, down)]);
  const k = CATS.find(([, hit]) => [...line].some(hit))[0];
  catOf.set(id, k);
  cat[k].targets++;
  // สาย = การ์ดต้นทางรากที่ไม่ใช่ปลายทางของใครเอง
  for (const x of walk(id, up)) if (!TARGET.has(x)) cat[k].roots.add(x);
}

const seenTarget = new Map();
// ยอดคาดต่อปลายทาง = ผลรวมสัดส่วน weight ของผลที่ชี้ไปตอนบอทกดตัวเลือกนั้น (ไม่คิดตัวคูณ/when/ปี จึงเป็นเพดานบน)
// ปลายทางที่คาดต่ำกว่า RARE_EXPECT ออก 0 ครั้งได้เพราะ rng ล้วน — แยกจาก "ไม่เคยออก" ไม่ให้เป็นสัญญาณหลอก
const RARE_EXPECT = 3;
const expect = new Map();
const addExpect = (id, v) => expect.set(id, (expect.get(id) ?? 0) + v);
const rows = [];
let offDate = 0, offWhen = 0;
for (const [name, bot] of Object.entries(BOTS)) {
  const r = { name, lives: 0, withNext: 0, nextCards: 0, long: 0, longEcho: 0, booked: 0, echoCards: 0 };
  for (let i = 0; i < n / Object.keys(BOTS).length; i++) {
    let next = 0, echo = 0, age = 0;
    const catNext = {}, catEcho = new Set();
    // ช่วงอายุที่นัดไว้ต่อปลายทาง จดจากตัวเลือกที่บอทกด (ทุกผลสุ่มของตัวเลือกนั้น) — นัดปีเดียวกันถูกใช้ก่อนการ์ดใบถัดไปออก อ่าน st.scheduled ไม่ทัน
    const booked = [];
    let at = 0;
    const pick = (card, rng, x) => {
      const idx = bot(card, rng, x);
      const c = card.kind === 'event' && byId[card.id]?.choices?.[idx];
      for (const w of c ? [c, ...(c.outcomes ?? [])] : []) for (const sc of w.schedules ?? []) booked.push([sc.event, at + sc.after_years[0], at + sc.after_years[1]]);
      if (c) {
        for (const sc of c.schedules ?? []) addExpect(sc.event, 1);
        const total = (c.outcomes ?? []).reduce((a, o) => a + (o.weight ?? 1), 0);
        for (const o of c.outcomes ?? []) {
          const share = (o.weight ?? 1) / total;
          if (o.next) addExpect(o.next, share);
          for (const sc of o.schedules ?? []) addExpect(sc.event, share);
        }
      }
      return idx;
    };
    playLife(mixSeed(seed, i), content, pick, (card, st) => {
      age = at = st.age;
      if (card.kind !== 'event' || !card.id) return;
      if (NEXT.has(card.id)) {
        next++;
        catNext[catOf.get(card.id)] = (catNext[catOf.get(card.id)] ?? 0) + 1;
      }
      if (ECHO.has(card.id)) {
        echo++;
        catEcho.add(catOf.get(card.id));
        if (byId[card.id].category !== 'belief' && !booked.some(([id, lo, hi]) => id === card.id && st.age >= lo && st.age <= hi)) offDate++;
        if (byId[card.id].category !== 'belief' && !whenOk(st, byId[card.id].when)) offWhen++;
      }
      if (NEXT.has(card.id) || ECHO.has(card.id)) seenTarget.set(card.id, (seenTarget.get(card.id) ?? 0) + 1);
    });
    r.lives++;
    r.nextCards += next;
    if (next) r.withNext++;
    r.booked += booked.length;
    r.echoCards += echo;
    for (const [k, v] of Object.entries(catNext)) {
      cat[k].withNext++;
      cat[k].nextCards += v;
    }
    if (age >= LONG_AGE) {
      r.long++;
      if (echo) r.longEcho++;
      for (const k of catEcho) cat[k].longEcho++;
    }
  }
  rows.push(r);
}

const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(2)}%` : '—');
console.log(`ปลายทางในเนื้อหา: เรื่องต่อ ${NEXT.size} ใบ · ผลย้อน ${ECHO.size} ใบ · ${n.toLocaleString('en-US')} ชีวิต · seed ${seed}`);
console.log('บอท          ชีวิตที่เจอเรื่องต่อ   เรื่องต่อ/ชีวิต   ชีวิตยาว (≥50) ที่เจอผลย้อน   นัด → ออก');
const all = { lives: 0, withNext: 0, long: 0, longEcho: 0 };
for (const r of rows) {
  for (const k of Object.keys(all)) all[k] += r[k];
  console.log(`${r.name.padEnd(12)} ${pct(r.withNext, r.lives).padStart(10)}            ${(r.nextCards / r.lives).toFixed(2).padStart(5)}          ${pct(r.longEcho, r.long).padStart(8)} (${r.long})            ${r.booked} → ${r.echoCards}`);
}
console.log(`รวม         ${pct(all.withNext, all.lives).padStart(10)}                             ${pct(all.longEcho, all.long).padStart(8)} (${all.long})`);
console.log(`\nแยกหมวดสาย (${CATS.map(([k]) => k).join(' > ')} · หมวดแรกที่สายแตะชนะ)`);
console.log('หมวด       สาย   ปลายทางออก   ชีวิตที่เจอเรื่องต่อ   เรื่องต่อ/ชีวิต   ชีวิตยาวที่เจอผลย้อน');
for (const [k] of CATS) {
  const c = cat[k];
  const shown = [...catOf].filter(([id, x]) => x === k && seenTarget.has(id)).length;
  console.log(`${k.padEnd(9)} ${String(c.roots.size).padStart(4)}   ${`${shown}/${c.targets}`.padStart(10)}   ${pct(c.withNext, all.lives).padStart(14)}   ${(c.nextCards / all.lives).toFixed(2).padStart(14)}   ${pct(c.longEcho, all.long).padStart(18)}`);
}
const unseen = [...NEXT, ...ECHO].filter((id) => !seenTarget.has(id));
const rare = unseen.filter((id) => (expect.get(id) ?? 0) < RARE_EXPECT);
const never = unseen.filter((id) => !rare.includes(id));
console.log(never.length ? `ปลายทางที่ไม่เคยออก ${never.length} ใบ: ${never.map((id) => `${id} (คาด ${(expect.get(id) ?? 0).toFixed(1)})`).join(' ')}` : 'ปลายทางออกครบทุกใบที่คาดว่าควรออก');
if (rare.length) console.log(`  หายาก ไม่ออกรอบนี้ (คาด <${RARE_EXPECT} ครั้ง · rng ล้วน): ${rare.map((id) => `${id} (คาด ${(expect.get(id) ?? 0).toFixed(2)})`).join(' ')}`);

if (offDate) fail.push(`ผลย้อนออกไม่ตรงปีที่นัด ${offDate} ครั้ง`);
if (offWhen) fail.push(`ผลย้อนออกทั้งที่ when ไม่ผ่าน ${offWhen} ครั้ง`);
if (minNext !== null && (100 * all.withNext) / all.lives < minNext) fail.push(`ชีวิตที่เจอเรื่องต่อต่ำกว่าเป้า ${minNext}%`);
if (minEcho !== null && (100 * all.longEcho) / Math.max(1, all.long) < minEcho) fail.push(`ชีวิตยาวที่เจอผลย้อนต่ำกว่าเป้า ${minEcho}%`);
console.log(fail.length ? `\nตก: ${fail.join(' · ')}` : `\nผลย้อนออกตรงนัดและตาม when${minNext === null && minEcho === null ? ' (ไม่มีเป้าสัดส่วน — รายงานอย่างเดียว)' : ' · ถึงเป้าสัดส่วน'} → ผ่าน`);
process.exit(fail.length ? 1 : 0);
