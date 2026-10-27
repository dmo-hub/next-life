// harness ต่างโลก (B68a): เรียก isekai.mjs ตรง ไม่ผ่านปรโลก · บอท 6 บุคลิกชุดเดียวกับ bots.mjs
// ด่าน: seed เดิมผลเดิม (รวดเดียว + เซฟ/โหลดกลางทาง) · จบได้ทุกชีวิตภายในเพดานการ์ด · ตอนจบ/โลก/สกิล/เหตุการณ์มีบอทถึง
// · ค่าอยู่ในช่วง · การ์ดไม่เผยบุญบาป · ทางเลือกหลังจบ (กลับโลกเดิม/อยู่ต่อ) กับเพดานชาติติดกันผ่านปรโลกจริง
// ใบต่างโลกถัดไปเติมด่านลงไฟล์นี้ (SPEC หัว Testing)
import { startIsekai, nextIsekaiCard, chooseIsekai, ISEKAI, ISEKAI_WORLDS, ISEKAI_SKILLS, ISEKAI_EVENTS, ISEKAI_STAT, ENTRY, playLife, startAfterlife, nextAfterCard, chooseAfter, openChoices, makeRng, mixSeed } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS, isekaiBot } from './bots.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 2000);
const seed = opt('seed', 1);
const lives = opt('lives', 40);
// ชาติต่างโลกเต็มคิวมี 9 เหตุการณ์ × (การ์ด + ผล) + โลก + สกิล + ตอนจบ = 21 ใบ — เพดานเผื่อเท่าตัว
const CARD_CAP = 42;

// กติกาเดียวกับ harness/merit.mjs: key ของบัญชีห้ามออกไปกับการ์ด · เพิ่มฝั่งข้อความ = คำบุญ/บาปติดตัวเลข
const LEAK = /ledger|merit|sin|karma|byCat|broken|omenTone|omenAge/i;
const LEAK_TEXT = /(บุญ|บาป)\s*[+\-−]?\s*\d/;
function* keys(v) {
  if (Array.isArray(v)) for (const x of v) yield* keys(x);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { yield k; yield* keys(x); }
}
function* strings(v) {
  if (typeof v === 'string') yield v;
  else if (Array.isArray(v)) for (const x of v) yield* strings(x);
  else if (v && typeof v === 'object') for (const x of Object.values(v)) yield* strings(x);
}
const leakOf = (card) => [...keys(card)].filter((k) => LEAK.test(k)).length + [...strings(card)].filter((s) => LEAK_TEXT.test(s)).length;

// ช่วงของค่าบนหน้าต่างสถานะ: HP/เป้าหมาย 0–100 · ค่าอื่นไม่ติดลบ
const RANGE = { hp: [0, 100], goal: [0, 100] };
const rangeOf = (s) => {
  if (!s) return 0;
  let bad = 0;
  for (const k of ['hp', 'goal', 'gold', 'fame', ...Object.keys(ISEKAI_STAT)]) {
    const [lo, hi] = RANGE[k] ?? [0, Infinity];
    if (!Number.isFinite(s[k]) || s[k] < lo || s[k] > hi) bad++;
  }
  return bad;
};

// ตั้งต้นของชาติที่ i — กระจายกรรม −1..1 · รอบติดกัน · ความทรงจำ · เทพธิดาอารมณ์ดี ให้ครอบทุกทางเข้าของ startIsekai
const MEM = Object.keys(ISEKAI_STAT);
const setup = (i) => ({
  seed: mixSeed(seed, i),
  karma: ((i % 21) - 10) / 10,
  past: 'สมชาย',
  run: i % (ISEKAI.stay + 1),
  memory: i % 4 === 0 ? null : MEM[i % MEM.length],
  blessed: i % 5 === 0,
});

// เล่นหนึ่งชาติ: picks ที่ส่งมา = เล่นซ้ำตามนั้น (โหลดเซฟ) · หมด picks แล้วให้บอทเลือกต่อ
function play(cfg, bot, botRng, picks = []) {
  const isk = startIsekai(cfg);
  const trace = [], cards = [], used = [];
  for (let guard = 0; guard < CARD_CAP; guard++) {
    const card = nextIsekaiCard(isk);
    cards.push(card);
    trace.push(JSON.stringify(card));
    if (card.step === 'end') return { isk, trace, cards, picks: used, ended: true };
    if (!card.choices.length) continue;
    const k = used.length < picks.length ? picks[used.length] : bot(card, botRng, {});
    used.push(k);
    chooseIsekai(isk, k);
  }
  return { isk, trace, cards, picks: used, ended: false };
}

const fail = [];
const rows = [];
const check = (label, bad, detail = '') => {
  rows.push(`${label}: ${bad ? `ตก ${bad}` : 'ผ่าน'}${detail ? ` · ${detail}` : ''}`);
  if (bad) fail.push(label);
};

const seen = { end: new Set(), world: new Set(), skill: new Set(), event: new Set(), choice: new Set() };
let mismatch = 0, resumeBad = 0, stuck = 0, leaks = 0, rangeBad = 0, cardsSeen = 0;
const lens = [];
Object.values(BOTS).forEach((bot, b) => {
  for (let i = 0; i < n; i++) {
    const cfg = setup(i);
    const rngSeed = mixSeed(seed ^ 0x15e4, b * n + i);
    const a = play(cfg, bot, makeRng(rngSeed));
    if (!a.ended) { stuck++; continue; }
    const again = play(cfg, bot, makeRng(rngSeed));
    if (again.trace.join('\n') !== a.trace.join('\n')) mismatch++;
    // เซฟของหน้าเว็บ = ตั้งต้น + ลำดับปุ่มที่กด → ผ่าน JSON แล้วเล่นซ้ำกลางทาง ต้องได้การ์ดเดิมทุกใบ
    const cut = a.picks.length >> 1;
    const saved = JSON.parse(JSON.stringify({ cfg, picks: a.picks.slice(0, cut) }));
    const resumed = play(saved.cfg, () => { throw new Error('เซฟสั้นกว่าที่เล่น'); }, null, [...saved.picks, ...a.picks.slice(cut)]);
    if (resumed.trace.join('\n') !== a.trace.join('\n')) resumeBad++;

    lens.push(a.cards.length);
    for (const card of a.cards) {
      cardsSeen++;
      leaks += leakOf(card);
      rangeBad += rangeOf(card.status);
      if (card.step === 'event') seen.event.add(card.id);
    }
    const { isk } = a;
    seen.end.add(`${isk.world}:${isk.ending.id}`);
    seen.world.add(isk.world);
    for (const s of isk.skills) seen.skill.add(s);
    let e = 0;
    for (const card of a.cards) if (card.step === 'event') seen.choice.add(`${card.id}#${a.picks[2 + e++]}`);
  }
});

const total = n * Object.keys(BOTS).length;
lens.sort((x, y) => x - y);
console.log(`ชาติต่างโลก ${n} ต่อบอท × ${Object.keys(BOTS).length} บอท · seed ${seed} · การ์ด min/p50/max ${lens[0]}/${lens[lens.length >> 1]}/${lens.at(-1)}`);
check('seed เดิมผลเดิม (รวดเดียว)', mismatch, `${total} ชาติ`);
check('เซฟ/โหลดกลางทางได้การ์ดเดิม', resumeBad);
check(`จบได้ทุกชีวิต ภายใน ${CARD_CAP} การ์ด`, stuck);
check('การ์ดไม่เผยบุญบาป', leaks, `${cardsSeen.toLocaleString('en-US')} การ์ด`);
check('ค่าบนหน้าต่างสถานะอยู่ในช่วง', rangeBad);

// ทางแยกที่ต้องมีบอทถึง: ตอนจบทุกแบบของทุกโลก (+ ตายกลางทาง) · ทุกโลก · ทุกสกิล · ทุกเหตุการณ์ · ทุกตัวเลือก
const missing = (want, got) => want.filter((x) => !got.has(x));
const wantEnd = Object.entries(ISEKAI_WORLDS).flatMap(([w, d]) => Object.keys(d.end).map((t) => `${w}:${t}`).concat(`${w}:death`));
const reach = {
  ตอนจบ: missing(wantEnd, seen.end),
  โลก: missing(Object.keys(ISEKAI_WORLDS), seen.world),
  สกิล: missing(Object.keys(ISEKAI_SKILLS), seen.skill),
  เหตุการณ์: missing(ISEKAI_EVENTS.map((e) => e.id), seen.event),
  ตัวเลือก: missing(ISEKAI_EVENTS.flatMap((e) => e.choices.map((_, j) => `${e.id}#${j}`)), seen.choice),
};
for (const [k, m] of Object.entries(reach)) check(`${k}มีบอทถึง`, m.length, m.length ? m.slice(0, 8).join(' ') : '');

// ทางเลือกหลังจบผ่านปรโลกจริง: บอทอยู่ต่างโลกต่อทุกครั้งที่เปิด แล้วกลับโลกเดิมเมื่อทางนั้นล็อก
// ต้องได้ชาติต่างโลกติดกัน = stay + 1 พอดี · ปรโลกตัดสินทุกชาติ · ผังตระกูลต่อแถวต่างโลกครบ · ขากลับเกิดเป็นคน
const content = loadContent();
const PATH_ISEKAI = 2, PATH_REBORN = 1;
let stayBad = 0, backBad = 0;
const stayPick = (card, rng, af) => (af.pending?.path ? (card.locked?.[PATH_ISEKAI] ? PATH_REBORN : PATH_ISEKAI) : BOTS.สุ่ม(card, rng));
const backPick = (card, rng, af) => (af.pending?.path ? (af.from ? PATH_REBORN : PATH_ISEKAI) : BOTS.สุ่ม(card, rng));
for (let i = 0; i < lives; i++) {
  for (const [pick, want] of [[stayPick, ISEKAI.stay + 1], [backPick, 1]]) {
    const { state } = playLife(mixSeed(seed, 9000 + i), content, BOTS.สุ่ม);
    const af = startAfterlife(state);
    let verdicts = 0, locked = 0;
    for (let guard = 0; guard < 400; guard++) {
      const card = nextAfterCard(af);
      if (card.kind === 'verdict') verdicts++;
      if (card.kind === 'path' && af.from && card.locked?.[PATH_ISEKAI]) locked++;
      if (card.choices?.length) chooseAfter(af, pick(card, af.botRng, af));
      if (card.done) break;
    }
    const got = af.isekaiLives.length;
    if (got !== want || verdicts !== 1 + got || !af.heir) stayBad++;
    // เพดานต้องล็อกพอดีตอนชาติสุดท้าย — ทางอยู่ต่อที่ไม่ล็อก = บอทวนไม่จบ
    if (pick === stayPick && locked !== 1) stayBad++;
    const rows = af.heir?.lineage ?? [];
    if (rows.filter((r) => r.isekai).length !== got || af.heir?.gen !== (state.gen ?? 1) + 1 + got) backBad++;
  }
}
check(`อยู่ต่อติดเพดาน ${ISEKAI.stay + 1} ชาติ แล้วปรโลกตัดสินทุกชาติ`, stayBad, `${lives} ชีวิต × 2 แบบ`);
check('กลับโลกเดิมลงผังตระกูลครบ', backBad);

// ทางเข้าจากเหตุการณ์ในชีวิต (B68d): บอทสายต่างโลกกดรับการ์ดชวนใบแรก
// อยู่ถึงอายุนัดแรก = เจอการ์ดชวน · กดรับแล้วมีงานศพ · ปรโลกไม่มีการ์ดทางเกิด · เข้าต่างโลกแบบ fated · บอทสุ่มไม่เคยกดรับ
let entryBad = 0, entryLives = 0, declineBad = 0;
for (let i = 0; i < lives; i++) {
  let offers = 0, funeral = false;
  const r = playLife(mixSeed(seed, 9500 + i), content, isekaiBot, (c) => {
    if (c.entry) offers++;
    if (c.funeral) funeral = true;
  });
  if (r.age < (r.state.isekaiEntry?.[0]?.age ?? Infinity)) continue;
  entryLives++;
  if (offers !== 1 || !r.state.flags.isekai_call || !funeral) {
    entryBad++;
    continue;
  }
  const af = startAfterlife(r.state);
  let paths = 0;
  for (let guard = 0; guard < 50 && !af.isekai; guard++) {
    const card = nextAfterCard(af);
    if (card.kind === 'path') paths++;
    if (card.choices?.length) chooseAfter(af, BOTS.สุ่ม(card, af.botRng, af));
  }
  if (paths || !af.isekai?.fated) entryBad++;
  if (playLife(mixSeed(seed, 9500 + i), content, BOTS.สุ่ม).state.flags.isekai_call) declineBad++;
}
check('การ์ดชวนในชีวิต กดรับแล้วงานศพ + วาร์ปข้ามโลก', entryBad, `${entryLives} ชีวิต · นัด ${ENTRY.bands.length} ช่วงวัย`);
check('บอทที่ไม่ประกาศ isekai ไม่เคยกดรับ', declineBad);

// ตัวควบคุม: ตัววัดต้องจับของเสียที่ปลูกไว้ได้ — ไม่งั้นด่านผ่านเพราะวัดไม่เป็น
const ctl = [
  ['รั่วจาก key', leakOf({ text: 'ก', status: { karma: 0.3 } }) > 0],
  ['รั่วจากข้อความ', leakOf({ text: 'ได้บุญ +5' }) > 0],
  ['ข้อความทำบุญปกติไม่นับรั่ว', leakOf({ text: 'คนที่บ้านทำบุญให้คุณทุกวันพระ' }) === 0],
  ['HP ทะลุเพดาน', rangeOf({ hp: 101, goal: 0, gold: 0, fame: 0, str: 1, mag: 1, cha: 1, luk: 1 }) > 0],
  ['ทองติดลบ', rangeOf({ hp: 50, goal: 0, gold: -1, fame: 0, str: 1, mag: 1, cha: 1, luk: 1 }) > 0],
];
check('ตัวควบคุม', ctl.filter(([, ok]) => !ok).length, ctl.filter(([, ok]) => !ok).map(([k]) => k).join(' '));

for (const r of rows) console.log(r);
console.log(fail.length ? `\nตก ${fail.length} ด่าน` : '\nผ่านทุกด่าน');
process.exit(fail.length ? 1 : 0);
