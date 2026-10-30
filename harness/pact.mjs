// harness สัญญากับมาร (B156): เนื้อหาจริง + content-fixtures/harness/pact/ (ใบเสนอสัญญาอายุ 20 · ใบวัดโชคอายุ 25/35)
// ด่าน: บาป mara_pact ข้ามชาติไม่คูณ r — จางได้แค่ส่วนชดใช้ (spend เมื่อสุทธิที่ปรโลกเป็นบาป) · ไม่ชดใช้ = ยอดเท่าเดิม
// · ยืมโชค: ใบวัดในช่วงสัญญาสำเร็จบ่อยกว่าชีวิตที่ไม่เซ็น · พ้นช่วงแล้วเท่ากัน
// · รอดตาย ≤1 ครั้งต่อชีวิต · ชีวิตที่ใช้สิทธิ์ตายทีหลังอายุที่ใช้ · การ์ดไม่เผยบัญชี
// --ctl-no-full = ตัวควบคุม: ปิด FULL_CARRY ⇒ mara_pact จางตาม r ด่านข้ามชาติต้องตก
import { playLife, playAfterlife, nextLife, newLife, openChoices, mixSeed, CARRY, FULL_CARRY, PACT } from '../src/engine/index.mjs';
import { loadContent, loadEvents } from '../src/node/load.mjs';
import { random } from './bots.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 2000);
const seed = opt('seed', 1);
const GENS = opt('gens', 5);
const ctl = args.includes('--ctl-no-full');
if (ctl) FULL_CARRY.length = 0;

const content = loadContent();
content.events = [...content.events, ...loadEvents('content-fixtures/harness/pact/')];
const OFFER = 'tm_pact_offer', PROBE_IN = 'tm_pact_probe_in', PROBE_OUT = 'tm_pact_probe_out';
// ตัวเลือกของใบเสนอ: 0 โชค · 1 รอดตาย · 2 เงิน (บาปล้วน ไม่มี pact) · 3 ปฏิเสธ
const OFFER_PICK = { luck: 0, survive: 1, money: 2, decline: 3 };

// บอทสุ่มทุกใบ ยกเว้นใบเสนอ (เลือกตามบุคลิก) กับใบวัด (กดลองเสมอ ให้ทุกชีวิตที่ถึงอายุได้ผลสุ่มเท่ากัน)
const botOf = (offer) => (card, rng, h) => {
  const id = h.pending?.id;
  if (id === OFFER) return OFFER_PICK[offer];
  if (id === PROBE_IN || id === PROBE_OUT) return 0;
  return random(card, rng);
};
const OK_TEXT = 'งานออกมาดีเกินคาด', FAIL_TEXT = 'งานไม่เป็นอย่างที่หวัง';

const LEAK = /ledger|merit|sin|karma|byCat|broken|omenTone|omenAge|pact/i;
const LEAK_TEXT = /(บุญ|บาป)\s*[+\-−]?\s*\d/;
function* keys(v) {
  if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) {
    if (!Array.isArray(v)) yield k;
    yield* keys(x);
  }
}
function* strings(v) {
  if (typeof v === 'string') yield v;
  else if (v && typeof v === 'object') for (const x of Object.values(v)) yield* strings(x);
}
// เฉลยบัญชีบนการ์ดปรโลก (reckoning) เป็นข้อยกเว้นเดียวตามด่าน merit
const leakOf = (card) => {
  const { reckoning, ...rest } = card;
  return [...keys(rest)].filter((k) => LEAK.test(k)).length + [...strings(rest)].filter((s) => LEAK_TEXT.test(s)).length;
};

let leaks = 0;
// ชีวิตเดียว: นับผลใบวัด · รอดตาย · อายุตาย
function life(s, offer, st) {
  const probe = { in: [0, 0], out: [0, 0] };
  let at = null, survived = 0, used = null;
  const r = playLife(s, content, botOf(offer), (card, x) => {
    leaks += leakOf(card);
    if (card.kind === 'result' && card.text === PACT.surviveText) { survived++; used ??= card.age; }
    if (card.kind === 'result' && at) {
      if (card.text === OK_TEXT) probe[at][0]++;
      else if (card.text === FAIL_TEXT) probe[at][1]++;
      at = null;
    }
    if (x.pending?.id === PROBE_IN) at = 'in';
    if (x.pending?.id === PROBE_OUT) at = 'out';
  }, st);
  return { ...r, probe, survived, used };
}

// 1) โชค + รอดตาย: ชีวิตชุดเดียวกัน 4 บุคลิกของใบเสนอ
const lives = {};
for (const offer of Object.keys(OFFER_PICK)) {
  const o = { probe: { in: [0, 0], out: [0, 0] }, survivedLives: 0, twice: 0, diedAtUse: 0, signedAge: 0 };
  for (let i = 0; i < n; i++) {
    const r = life(mixSeed(seed, i), offer);
    for (const k of ['in', 'out']) for (const j of [0, 1]) o.probe[k][j] += r.probe[k][j];
    if (r.survived) o.survivedLives++;
    if (r.survived > 1) o.twice++;
    if (r.used !== null && r.age <= r.used) o.diedAtUse++;
    if (r.state.pact?.luck) o.signedAge++;
  }
  lives[offer] = o;
}

// 2) ข้ามชาติ: เซ็นชาติแรก (ใบเสนอเงิน = บาปล้วน) แล้วชาติถัดไปปฏิเสธ · เทียบยอดเกิดชาติถัดไปกับสูตรที่คิดแยกจาก carryLedger
// สายหนีศาล = เซ็นทุกชาติ รายงานยอดสูงสุด (บาปสะสมไม่มีเพดาน — ticket 07)
const cats = (st) => st.ledger.byCat.mara_pact ?? 0;
let checks = 0, wrong = 0, paid = 0, unpaid = 0, unpaidMoved = 0, skippedIsekai = 0, lifeMoved = 0, maxEvery = 0;
const EPS = 1e-9;
for (const every of [false, true]) {
  for (let i = 0; i < n; i++) {
    let st = newLife(mixSeed(seed, 0x9a37 + i), content);
    for (let g = 0; g < GENS; g++) {
      const born = cats(st);
      const r = life(st.seed, every || g === 0 ? 'money' : 'decline', st);
      const dead = cats(r.state);
      if (!every && g > 0 && Math.abs(dead - born) > EPS) lifeMoved++;
      const af = playAfterlife(r.state, random);
      if (every) maxEvery = Math.max(maxEvery, cats(af.st));
      if (g === GENS - 1) break;
      const next = nextLife(af);
      // ชาติต่างโลกส่งบัญชีผ่าน carryLedger หลายรอบ — สูตรชั้นเดียวด้านล่างใช้ไม่ได้
      if (af.isekaiLives.length) { skippedIsekai++; st = next; continue; }
      const L = af.st.ledger, net = af.verdict.net;
      const f = net < 0 && L.sin ? Math.max(0, L.sin - Math.abs(net) * CARRY.spend) / L.sin : 1;
      const want = (L.byCat.mara_pact ?? 0) * f;
      if (!every && want > 0) {
        checks++;
        if (Math.abs(cats(next) - want) > EPS * Math.max(1, want)) wrong++;
        if (f < 1) paid++;
        else { unpaid++; if (Math.abs(cats(next) - (L.byCat.mara_pact ?? 0)) > EPS) unpaidMoved++; }
      }
      st = next;
    }
  }
}

const pct = (a, b) => (100 * a) / Math.max(1, b);
const rate = (p) => pct(p[0], p[0] + p[1]);
let fail = 0;
const check = (name, ok, detail) => {
  if (!ok) fail++;
  console.log(`${ok ? 'ผ่าน' : 'ตก  '} ${name} · ${detail}`);
};
console.log(`[pact] n ${n} seed ${seed} · ${GENS} ชาติ · PACT luck ×${PACT.luck} ≤${PACT.maxYears} ปี · FULL_CARRY [${FULL_CARRY.join(' ')}]${ctl ? ' (ตัวควบคุม: ปิด)' : ''}`);
for (const [k, o] of Object.entries(lives)) console.log(`  ${k.padEnd(8)} ใบวัดในช่วง ${rate(o.probe.in).toFixed(1)}% (${o.probe.in.join('/')}) · พ้นช่วง ${rate(o.probe.out).toFixed(1)}% (${o.probe.out.join('/')}) · รอดตาย ${o.survivedLives} ชีวิต`);
const L = lives.luck, D = lives.decline;
check('ยืมโชค: ใบวัดในช่วงสัญญาสำเร็จบ่อยกว่าไม่เซ็น', rate(L.probe.in) - rate(D.probe.in) >= 5, `${rate(L.probe.in).toFixed(1)}% vs ${rate(D.probe.in).toFixed(1)}%`);
check('ยืมโชค: พ้นช่วงแล้วไม่ต่าง (≤3 จุด)', Math.abs(rate(L.probe.out) - rate(D.probe.out)) <= 3, `${rate(L.probe.out).toFixed(1)}% vs ${rate(D.probe.out).toFixed(1)}%`);
const S = lives.survive;
check('รอดตาย: ใช้สิทธิ์ได้จริง', S.survivedLives > 0, `${S.survivedLives}/${n} ชีวิต`);
check('รอดตาย ≤1 ครั้งต่อชีวิต', Object.values(lives).every((o) => o.twice === 0), `เกิน ${Object.values(lives).reduce((a, o) => a + o.twice, 0)}`);
check('รอดตาย: ตายทีหลังอายุที่ใช้สิทธิ์', S.diedAtUse === 0, `ตายปีเดียวกัน/ก่อน ${S.diedAtUse}`);
check('ไม่เซ็นรอดตาย = ไม่มีใบรอดตาย', ['luck', 'money', 'decline'].every((k) => lives[k].survivedLives === 0), ['luck', 'money', 'decline'].map((k) => `${k} ${lives[k].survivedLives}`).join(' · '));
check('mara_pact ข้ามชาติ = ยอดตาย × ส่วนหลังชดใช้ (ไม่คูณ r)', checks > 0 && wrong === 0, `ผิด ${wrong}/${checks} รอยต่อ · ชดใช้ ${paid} · ไม่ชดใช้ ${unpaid} (ยอดขยับ ${unpaidMoved}) · ข้ามชาติต่างโลก ${skippedIsekai}`);
check('ชาติที่ไม่เซ็น ยอด mara_pact ไม่ขยับระหว่างชีวิต', lifeMoved === 0, `ขยับ ${lifeMoved}`);
check('การ์ดไม่เผยบัญชี', leaks === 0, `${leaks} จุด`);
console.log(`สายหนีศาล (เซ็นทุกชาติ ${GENS} ชาติ) ยอด mara_pact สูงสุด ${maxEvery.toFixed(2)}`);
if (ctl) {
  // ตัวควบคุมต้องตกที่ด่านข้ามชาติ ไม่งั้นด่านจับการคูณ r ไม่ได้
  const caught = wrong > 0;
  console.log(`ตัวควบคุม: ด่านข้ามชาติ ${caught ? 'จับได้' : 'จับไม่ได้'} (ผิด ${wrong}/${checks})`);
  process.exit(caught ? 0 : 1);
}
console.log(fail ? `ตก ${fail} ข้อ` : 'ผ่านทั้งหมด');
process.exit(fail ? 1 : 0);
