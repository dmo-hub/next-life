// harness เฉียดตาย + โกงความตายถูกเรียกตัว (B153): บอทสุ่มเล่นเนื้อหาจริง
// ด่าน: เฉียดตาย ≤1 ครั้งต่อชีวิต · สัดส่วนชีวิตที่ถึง 30 แล้วเคยเฉียดตายอยู่ในกรอบ · ทริปออกการ์ดครบลำดับ near → visit → คำใบ้
// · ถือธง cheat_death ตั้งแต่เกิด ⇒ ถูกเรียกตัวทุกชีวิต และตายอายุเดียว สาเหตุเดียวกับชีวิตเดียวกันที่ไม่ถือธง
// · การ์ดศาลไม่เผยบัญชี (ชุดเดียวกับ harness/isekai)
// อายุตาย/ทางเดินชีวิตเท่าฐานรายชีวิตตรวจด้วย life-hash เทียบต้นไม้ฐาน — ที่นี่ตรวจได้แค่ภายในต้นไม้เดียว
// ตัวควบคุม: --ctl-flag-age ⇒ ธงติดตอน 30 แทนแรกเกิด ชีวิตที่ตายก่อน 30 ต้องไม่ถูกเรียกตัว (ตัวนับ summons ต้องลดลง)
import { playLife, newLife, mixSeed, NEAR_DEATH, hintLevel } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { random } from './bots.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 20000);
const seed = opt('seed', 1);
// เป้าสัดส่วนชีวิตที่ถึง 30 แล้วเคยเฉียดตาย (ค่าตั้งของเกม)
const TARGET = [0.03, 0.08];
const content = loadContent();

const LEAK = /ledger|merit|sin|karma|byCat|broken|omenTone|omenAge|^joy$|^wit$|^inner$|^know$|^knowLast$/i;
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
const leakOf = (card) => [...keys(card)].filter((k) => LEAK.test(k)).length + [...strings(card)].filter((s) => LEAK_TEXT.test(s)).length;

let reach30 = 0, near30 = 0, nearLives = 0, twice = 0, badOrder = 0, leaks = 0, courtCards = 0, wrongCause = 0;
const levels = {};
const base = [];
for (let i = 0; i < n; i++) {
  let near = 0;
  const seq = [];
  const r = playLife(mixSeed(seed, i), content, random, (card, st) => {
    if (card.kind === 'death') return;
    if (card.court) {
      courtCards++;
      leaks += leakOf(card);
      seq.push(card.id === 'court_hint' ? 'hint' : card.id.startsWith('near_') ? 'near' : 'visit');
      if (card.id.startsWith('near_')) {
        near++;
        const ev = content.events.find((e) => e.id === card.id);
        if (ev.near !== st.court.near) wrongCause++;
      }
      if (card.id === 'court_hint') levels[hintLevel(st.ledger)] = (levels[hintLevel(st.ledger)] ?? 0) + 1;
    }
  });
  const st = r.state;
  if (near > 1) twice++;
  if (st.nearDeath != null) {
    nearLives++;
    if (seq.join(' ') !== 'near visit hint') badOrder++;
  } else if (seq.length) badOrder++;
  if (r.age >= 30) {
    reach30++;
    if (st.nearDeath != null) near30++;
  }
  base.push({ age: r.age, cause: st.cause });
}

const flagAge = args.includes('--ctl-flag-age') ? 30 : 0;
let summoned = 0, summonsMiss = 0, ageMoved = 0, summonsLeak = 0;
for (let i = 0; i < n; i++) {
  const s = mixSeed(seed, i);
  const st = newLife(s, content);
  if (!flagAge) st.flags.cheat_death = true;
  let seen = false;
  const r = playLife(s, content, random, (card, x) => {
    if (flagAge && x.age >= flagAge) x.flags.cheat_death = true;
    if (card.court === 'summons') {
      seen = true;
      summonsLeak += leakOf(card);
    }
  }, st);
  if (seen) summoned++;
  else summonsMiss++;
  if (r.age !== base[i].age || r.state.cause !== base[i].cause) ageMoved++;
}

const pct = (a, b) => `${((100 * a) / Math.max(1, b)).toFixed(2)}%`;
const share = near30 / Math.max(1, reach30);
let fail = 0;
const check = (name, ok, detail) => {
  if (!ok) fail++;
  console.log(`${ok ? 'ผ่าน' : 'ตก  '} ${name} · ${detail}`);
};
console.log(`[near-death] n ${n} seed ${seed} · band ${NEAR_DEATH.band} · minAge ${NEAR_DEATH.minAge}`);
check('เฉียดตาย ≤1 ครั้งต่อชีวิต', twice === 0, `เกิน 1 ครั้ง ${twice} ชีวิต · เคยเฉียดตาย ${nearLives} ชีวิต`);
check(`สัดส่วนเฉียดตายในชีวิตที่ถึง 30 อยู่ในกรอบ ${TARGET.map((x) => `${x * 100}%`).join('–')}`, share >= TARGET[0] && share <= TARGET[1], `${near30}/${reach30} = ${pct(near30, reach30)}`);
check('ทริปเฉียดตายออกครบลำดับ near → visit → คำใบ้', badOrder === 0, `ผิดลำดับ ${badOrder} · ใบ near สาเหตุไม่ตรง ${wrongCause} · ระดับคำใบ้ ${JSON.stringify(levels)}`);
check('การ์ดศาลไม่เผยบัญชี', leaks + summonsLeak === 0, `${leaks + summonsLeak} จุด · การ์ดศาล ${courtCards}`);
if (flagAge) {
  console.log(`ตัวควบคุม: ธงติดตอน ${flagAge} · ถูกเรียกตัว ${summoned}/${n} (ต้องน้อยกว่า n) · ตายต่างจากไม่ถือธง ${ageMoved}`);
  check('ตัวควบคุมจับได้', summoned < n, `ไม่ถูกเรียกตัว ${summonsMiss}`);
} else {
  check('ถือธง cheat_death ⇒ ถูกเรียกตัวทุกชีวิต', summonsMiss === 0, `${summoned}/${n}`);
  check('ถูกเรียกตัวแล้วตายอายุ+สาเหตุเดิม', ageMoved === 0, `ต่างจากชีวิตเดียวกันที่ไม่ถือธง ${ageMoved}`);
}
console.log(fail ? `ตก ${fail} ข้อ` : 'ผ่านทั้งหมด');
process.exit(fail ? 1 : 0);
