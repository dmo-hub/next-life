// harness ของบัญชีบุญบาป (B05): เนื้อหาจริง + เนื้อหาทดสอบใน content-fixtures/harness/ · บอท 3 บุคลิกเล่นชีวิตชุดเดียวกัน
// ด่าน: บอทสายบุญกับสายบาปได้บัญชีแยกกันชัด · ธง vow_broken ตั้งได้จริง (ด่าน 5 ใบ 12) · การ์ด/ค่าที่หน้าจอใช้ไม่มีค่าบัญชี
// --no-karma = ตัวควบคุม: ปิดตัวคูณกรรม ส่วนต่างอายุระหว่างบอทต้องหดเหลือแค่ผลจากค่าสถานะ
import { playLife, playAfterlife, openChoices, mixSeed, expectedDeathAge, statsOf, netLedger, karmaMultiplier, meritId, MERIT_WEIGHTS, MERIT_LEVELS, SIN_CATS, FLAG_CATS, KARMA } from '../src/engine/index.mjs';
import { loadContent, loadEvents } from '../src/node/load.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 20000);
const seed = opt('seed', 1);
if (args.includes('--no-karma')) Object.assign(KARMA, { sinMax: 1, meritMin: 1 });

const content = loadContent();
content.events = [...content.events, ...loadEvents('content-fixtures/harness/')];

// คะแนนของตัวเลือกจากป้าย (บุญบวก บาปลบ) — บอทสายบุญ/บาปเลือกสุดทางของตัวเอง เสมอกันสุ่มจาก stream ของบอท
const score = (c) =>
  (c.merit ?? []).reduce((s, t) => {
    const id = meritId(t.cat);
    if (id === 'neutral') return s;
    const v = MERIT_WEIGHTS[id] * (FLAG_CATS.includes(id) ? 1 : MERIT_LEVELS[t.level]);
    return s + (SIN_CATS.includes(id) ? -v : v);
  }, 0);
const extreme = (sign) => (card, rng, st) => {
  // การ์ดจัดสรรเงินไม่มีป้ายบุญบาป — เลือกตัวแรกโดยไม่ดึงเลขสุ่ม ลำดับการเลือกของบอทจึงเหมือนก่อนมีการ์ดนี้
  if (st.pending?.alloc) return 0;
  // ตัวเลือกที่ล็อกอยู่ผู้เล่นกดไม่ได้ บอทก็ห้ามเลือก
  const open = openChoices(card);
  // การ์ดต่างโลก (B68) ไม่มีป้ายบุญบาป — สุ่มแบบบอทสุ่ม
  if (!st.pending) return open[rng.int(0, open.length - 1)];
  const s = open.map((i) => sign * score(st.pending.choices[i]));
  const best = Math.max(...s);
  const ties = open.filter((_, j) => s[j] === best);
  return ties[rng.int(0, ties.length - 1)];
};
const BOTS = {
  สุ่ม: (card, rng) => {
    const open = openChoices(card);
    return open[rng.int(0, open.length - 1)];
  },
  สายบุญ: extreme(1),
  สายบาป: extreme(-1),
};

// ค่าบัญชีห้ามออกไปกับการ์ดหรือค่าที่หน้าจอวาด — ตรวจทุก key ทุกชั้น
const LEAK = /ledger|merit|sin|karma|byCat|broken|omenTone|omenAge/i;
const STAT_SHOWN = ['health', 'happiness', 'knowledge', 'relations', 'network', 'money'];
// ข้อยกเว้นช่องเดียว: เฉลยบัญชีบนการ์ดปรโลกในระหว่างชาติ (ใบ 09) · โผล่บนการ์ดอื่นรวมการ์ดตาย = รั่ว
const REVEAL = 'reckoning';
function* keys(v) {
  if (Array.isArray(v)) for (const x of v) yield* keys(x);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { yield k; yield* keys(x); }
}

const f = (v, d = 2) => v.toFixed(d);
const q = (xs, p) => xs[Math.min(xs.length - 1, Math.floor(p * xs.length))];
const out = {};
let leaks = 0, cardsSeen = 0, reveals = 0, verdicts = 0;
for (const [name, pick] of Object.entries(BOTS)) {
  const r = { nets: [], ageDiff: 0, age: 0, vow: 0, omen: { good: 0, bad: 0 }, omenLives: 0, mult: 0 };
  for (let i = 0; i < n; i++) {
    let omens = 0;
    const onCard = (card, st) => {
      cardsSeen++;
      const { [REVEAL]: reveal, ...rest } = card;
      for (const k of keys(rest)) if (LEAK.test(k)) leaks++;
      if (card.kind === 'verdict') {
        verdicts++;
        reveals += reveal ? 1 : 0;
      }
      else if (reveal !== undefined) leaks++;
      const shown = Object.keys(statsOf(st));
      if (shown.length !== STAT_SHOWN.length || shown.some((k) => !STAT_SHOWN.includes(k))) leaks++;
      if (card.kind === 'omen') {
        omens++;
        r.omen[card.tone]++;
      }
    };
    const { age, state } = playLife(mixSeed(seed, i), content, pick, onCard);
    // อายุ/บัญชีวัดตอนตาย (ก่อนฉากระหว่างชาติปรับบัญชี) · ระหว่างชาติเล่นต่อเพื่อตรวจรั่ว/เฉลย
    const nets = netLedger(state.ledger), mult = karmaMultiplier(state.ledger);
    // การ์ดระหว่างชาติวาดบนชีวิตที่เพิ่งจบ — ตรวจค่าที่หน้าจอใช้กับ state ของชีวิตนั้น ไม่ใช่ af
    playAfterlife(state, pick, (card) => onCard(card, state));
    r.nets.push(nets);
    r.mult += mult;
    r.age += age;
    r.ageDiff += age - expectedDeathAge(content.era, state.sex, state.birthYear, state.seed);
    if (state.flags.vow_broken) r.vow++;
    if (omens) r.omenLives++;
  }
  r.nets.sort((a, b) => a - b);
  out[name] = r;
}

console.log(`ชีวิต ${n} ต่อบอท · seed ${seed}${args.includes('--no-karma') ? ' · ปิดตัวคูณกรรม (ตัวควบคุม)' : ''} · เหตุการณ์ ${content.events.length}`);
console.log('บอท     บัญชีสุทธิ p10   p50    p90  ตัวคูณเฉลี่ย  อายุเฉลี่ย  ต่างจากข้อมูลคาด  vow_broken  ชีวิตที่เห็นลาง (ดี/ร้าย)');
for (const [name, r] of Object.entries(out)) {
  console.log(
    `${name.padEnd(6)} ${f(q(r.nets, 0.1), 1).padStart(14)} ${f(q(r.nets, 0.5), 1).padStart(6)} ${f(q(r.nets, 0.9), 1).padStart(6)} ${f(r.mult / n, 3).padStart(12)} ${f(r.age / n).padStart(10)} ${((r.ageDiff >= 0 ? '+' : '') + f(r.ageDiff / n)).padStart(16)} ${String(r.vow).padStart(11)}  ${r.omenLives} (${r.omen.good}/${r.omen.bad})`,
  );
}

let fail = 0;
const good = out['สายบุญ'], bad = out['สายบาป'];
const apart = q(bad.nets, 0.9) < q(good.nets, 0.1);
console.log(`\nบัญชีแยกกัน: p90 สายบาป ${f(q(bad.nets, 0.9), 1)} < p10 สายบุญ ${f(q(good.nets, 0.1), 1)} → ${apart ? 'ผ่าน' : 'ตก'}`);
if (!apart) fail++;
const vowSet = Object.values(out).reduce((s, r) => s + r.vow, 0);
console.log(`ด่าน 5: vow_broken ตั้งได้จริง ${vowSet} ชีวิต (สุ่ม ${out['สุ่ม'].vow}) → ${out['สุ่ม'].vow > 0 ? 'ผ่าน' : 'ตก'}`);
if (!(out['สุ่ม'].vow > 0)) fail++;
console.log(`ค่าบัญชีไม่ออกไปกับการ์ด/ค่าที่หน้าจอวาด: ตรวจ ${cardsSeen.toLocaleString('en-US')} การ์ด รั่ว ${leaks} → ${leaks ? 'ตก' : 'ผ่าน'}`);
if (leaks) fail++;
// ข้อยกเว้นต้องไม่ว่าง — ทุกชีวิตต้องมีเฉลยที่ปรโลก ไม่งั้นด่านรั่วผ่านเพราะไม่มีอะไรให้ยกเว้น
// ทุกชีวิตผ่านปรโลกอย่างน้อยครั้งเดียว · ชาติต่างโลก (B68) ได้การ์ดปรโลกเพิ่ม ทุกใบต้องเฉลย
const lives = n * Object.keys(BOTS).length;
const revealOk = reveals === verdicts && verdicts >= lives;
console.log(`เฉลยบัญชีบนการ์ดปรโลก: ${reveals.toLocaleString('en-US')} จาก ${verdicts.toLocaleString('en-US')} ใบ (${lives.toLocaleString('en-US')} ชีวิต) → ${revealOk ? 'ผ่าน' : 'ตก'}`);
if (!revealOk) fail++;
if (fail) process.exitCode = 1;
