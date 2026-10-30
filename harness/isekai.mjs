// harness ต่างโลก (B68a): เรียก isekai.mjs ตรง ไม่ผ่านปรโลก · บอท 6 บุคลิกชุดเดียวกับ bots.mjs
// ด่าน: seed เดิมผลเดิม (รวดเดียว + เซฟ/โหลดกลางทาง) · จบได้ทุกชีวิตภายในเพดานการ์ด · ตอนจบ/บทบาท/สกิล/เหตุการณ์มีบอทถึง
// · ค่าอยู่ในช่วง · การ์ดไม่เผยบุญบาป · ทางเลือกหลังจบ (กลับโลกเดิม/อยู่ต่อ) กับเพดานชาติติดกันผ่านปรโลกจริง
// ใบต่างโลกถัดไปเติมด่านลงไฟล์นี้ (SPEC หัว Testing)
import { startIsekai, nextIsekaiCard, chooseIsekai, ISEKAI, ISEKAI_ROLES, ISEKAI_SKILLS, ISEKAI_EVENTS, ISEKAI_STAT, ISEKAI_STAGES, ENTRY, roleInfo, ISEKAI_KNOW, ISEKAI_KNOW_T, ISEKAI_LORE, ISEKAI_FAME, ISEKAI_POTION, ISEKAI_TIME, ISEKAI_LINK, LINK, tripCarry, tripSettle, isekaiLineage, isekaiWorldLore, isekaiWorldLegends, isekaiChance, ENTRY_EVENTS, TRIP, TRIP_QUEST, tripRoll, GONE_SEARCH, carryAmount, CARRY_WORDS, playLife, startAfterlife, nextAfterCard, chooseAfter, openChoices, makeRng, mixSeed } from '../src/engine/index.mjs';
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
// ชาติต่างโลกเวลาเดินเอง (B68b): ใบตาละปีถึงวัยชรา + ตาละ 5 ปีหลังชรา + เหตุการณ์ × (การ์ด + ผล) + ทุ่มเทต่อช่วงวัย ≈ 100 ใบ
// เอลฟ์แก่ช้าแต่ตาละ 3 ปี จำนวนตาเท่ามนุษย์ — เพดานเผื่อเท่าตัว
const CARD_CAP = 240;

// กติกาเดียวกับ harness/merit.mjs: key ของบัญชีห้ามออกไปกับการ์ด · เพิ่มฝั่งข้อความ = คำบุญ/บาปติดตัวเลข
// สุข/รู้ของต่างโลก (joy · wit · inner) เป็นค่าซ่อน (เจ้าของเคาะ) — ห้ามออกไปกับการ์ดเหมือนบัญชี
// ความรู้โลกเดิม (B68h · know · knowLast) เป็นค่าซ่อนเหมือนกัน
const LEAK = /ledger|merit|sin|karma|byCat|broken|omenTone|omenAge|^joy$|^wit$|^inner$|^know$|^knowLast$/i;
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
// ตำนานชาติก่อน (B68i): บางชาติเกิดในโลกที่จำวีรบุรุษ บางชาติจำคนร้ายมากกว่า ให้เหตุการณ์ตำนานมีบอทถึง
const MEM = Object.keys(ISEKAI_STAT);
const WORLDS = [...new Set(Object.keys(ISEKAI_ROLES).map((r) => roleInfo(r).world ?? r))];
const HERO = { name: 'ท่านสมปอง', ending: 'ผู้กล้าผู้กอบกู้โลก', dark: false };
const DARK = { name: 'จอมเวทวิเชียร', ending: 'ตายอีกครั้งในต่างโลก', dark: true };
const legendsOf = (ls) => Object.fromEntries(WORLDS.map((w) => [w, ls]));
const LEG_HERO = legendsOf([HERO]);
const LEG_DARK = legendsOf([HERO, DARK, DARK]);
const setup = (i) => ({
  seed: mixSeed(seed, i),
  karma: ((i % 21) - 10) / 10,
  past: 'สมชาย',
  run: i % (ISEKAI.stay + 1),
  memory: i % 4 === 0 ? null : MEM[i % MEM.length],
  blessed: i % 5 === 0,
  ...(i % 7 === 3 && { legends: LEG_HERO }),
  ...(i % 7 === 5 && { legends: LEG_DARK }),
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
    card.pick = k;
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

const seen = { end: new Set(), role: new Set(), skill: new Set(), event: new Set(), choice: new Set(), shortcut: new Set() };
let mismatch = 0, resumeBad = 0, stuck = 0, leaks = 0, rangeBad = 0, cardsSeen = 0;
const EVENT = Object.fromEntries(ISEKAI_EVENTS.map((e) => [e.id, e]));
const ADULT_NAMES = ISEKAI_STAGES.filter((s) => ['adult', 'middle', 'old'].includes(s.id)).map((s) => s.name);
const SHORTCUT = Object.fromEntries(Object.entries(ISEKAI_KNOW).map(([k, v]) => [v.focus.name, k]));
let knowAdultBad = 0, loreSys = 0, loreBad = 0, loreGot = 0;
// ตำนาน (B68i): เหตุการณ์ตำนานมาเฉพาะโลกที่จำแบบนั้น เรียกชื่อถูก ไม่เหลือ {legend} · การ์ดจบมีช่องตำนานตรงเกณฑ์
let legendEvBad = 0, legendTextBad = 0, legendEndBad = 0, legendGot = 0, legendDark = 0;
let potionBad = 0, potionOver = 0, courtBad = 0, courtOver = 0, courtVisit = 0;
const potionFrom = [], potionAdd = {};
// เวลาเดินเอง (B68b): ใบตาไม่มีตัวเลือก แต่บอกสิ่งที่ทุ่มเทได้ · การ์ดบทบาทมีคนธรรมดาเสมอ · สิ้นอายุเฉพาะหลังวัยชรา
let tickBad = 0, roleBad = 0, oldBad = 0;
// ทางกลับบ้าน (B154): ชาติที่เกิดในต่างโลกไม่เห็นเควส/อีเวนต์ทริป
let tripEvBad = 0;
const lens = [], clicks = [], humanAges = [];
const commonerName = roleInfo('commoner').name;
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
    clicks.push(a.picks.length);
    for (const card of a.cards) {
      cardsSeen++;
      leaks += leakOf(card);
      rangeBad += rangeOf(card.status);
      if (card.step === 'event') {
        seen.event.add(card.id);
        seen.choice.add(`${card.id}#${card.pick}`);
        if (EVENT[card.id].trip) tripEvBad++;
      }
      for (const name of card.step === 'focus' ? card.choices : card.step === 'tick' ? card.focusChoices : []) if (name === TRIP_QUEST.focus.name) tripEvBad++;
      if (card.step === 'tick' && (card.choices.length || card.focusChoices.length < 2 || !(card.focus >= 0))) tickBad++;
      // ความรู้โลกเดิม (B68h): เรื่องอันตรายเฉพาะวัยผู้ใหญ่ขึ้นไป · โลกจำเฉพาะตอนชื่อเสียงถึง · ทางลัดที่เปิดได้
      if (card.step === 'event' && EVENT[card.id].adult && !ADULT_NAMES.includes(card.status.stage)) knowAdultBad++;
      if (card.step === 'result' && card.sys?.startsWith('โลกนี้จะจำ')) {
        loreSys++;
        if (card.status.fame < ISEKAI_KNOW_T.loreFame) loreBad++;
      }
      for (const name of card.step === 'focus' ? card.choices : card.step === 'tick' ? card.focusChoices : []) if (SHORTCUT[name]) seen.shortcut.add(SHORTCUT[name]);
      if (card.step === 'event' && EVENT[card.id].legend) {
        const ls = cfg.legends?.[a.isk.world] ?? [];
        const want = ls.findLast((l) => (l.dark ? 'dark' : 'hero') === EVENT[card.id].legend);
        if (!want) legendEvBad++;
        else if (EVENT[card.id].text.includes('{legend}') && !card.text.includes(want.name)) legendTextBad++;
      }
      if ([...strings(card)].some((s) => s.includes('{legend}'))) legendTextBad++;
    }
    const end = a.cards.at(-1);
    const famous = a.isk.st.fame >= ISEKAI_FAME.legend;
    if (famous !== !!end.legend || (end.legend && end.legend.dark !== a.isk.fameDark * 2 > a.isk.st.fame)) legendEndBad++;
    if (end.legend) {
      legendGot++;
      if (end.legend.dark) legendDark++;
    }
    if (a.isk.log.some((s) => s.includes('{legend}')) || a.isk.chron.some((l) => l.text.includes('{legend}'))) legendTextBad++;
    loreGot += a.isk.lore.length;
    if (!a.cards[0].choices.includes(commonerName)) roleBad++;
    const { isk } = a;
    const pace = ISEKAI_ROLES[isk.role].pace ?? 1;
    if (isk.natural && isk.age < ISEKAI_STAGES.at(-1).from * pace) oldBad++;
    if (isk.natural && pace === 1) humanAges.push(isk.age);
    seen.end.add(`${isk.role}:${isk.ending.id}`);
    seen.role.add(isk.role);
    for (const s of isk.skills) seen.skill.add(s);
    // ยาต่ออายุ (B68k): อายุที่ต่อตรงกับจำนวนขวดแต่ไม่เกินเพดาน · บาปฝืนธรรมชาติเฉพาะขวดที่เกิน free · ตายจากความแก่ไม่เกินเพดานใหม่
    const P = ISEKAI_POTION;
    const drunk = isk.potions.length;
    if (isk.lifeAdd !== Math.min(P.cap, drunk * P.years) || (isk.ledger.byCat.against_nature ?? 0) !== Math.max(0, drunk - P.free) * 0.5 * P.level) potionBad++;
    if (isk.age > (ISEKAI_STAGES.at(-1).from + isk.lifeAdd + ISEKAI_TIME.cap + ISEKAI_TIME.oldStep) * pace) potionBad++;
    for (const id of isk.potions) (potionFrom[b] ??= new Set()).add(id);
    if (drunk) {
      const g = isk.potions.every((id) => id === 'pt_shop') ? 'shop' : isk.potions.includes('pt_shop') ? 'mix' : 'other';
      (potionAdd[g] ??= []).push(isk.lifeAdd);
    }
    if (drunk > P.free) potionOver++;
    // ศาล (B153): ดื่มเกินเพดาน = ถูกเรียกตัวแล้วจบชาติอายุนั้น · ย้อนเวลาเมื่อตายใช้แล้ว = ใบเยือนหนึ่งใบ · นอกนั้นไม่มีใบศาล
    const summons = a.cards.filter((c) => c.court === 'summons');
    const visits = a.cards.filter((c) => c.court === 'visit').length;
    if (drunk * P.years > P.cap) {
      courtOver++;
      if (summons.length !== 1 || !isk.dead || summons[0].age !== end.age) courtBad++;
    } else if (summons.length) courtBad++;
    if (visits !== (isk.rbdUsed ? 1 : 0)) courtBad++;
    courtVisit += visits;
  }
});
check('ศาล: ดื่มเกินเพดานถูกเรียกตัวแล้วตายอายุนั้นทุกชาติ · ย้อนเวลาเมื่อตาย = ใบเยือน 1 ใบ', courtBad + (courtOver && courtVisit ? 0 : 1), `ดื่มเกินเพดาน ${courtOver} ชาติ · ใบเยือน ${courtVisit}`);

const total = n * Object.keys(BOTS).length;
for (const xs of [lens, clicks, humanAges]) xs.sort((x, y) => x - y);
const p50 = (xs) => xs[xs.length >> 1];
console.log(`ชาติต่างโลก ${n} ต่อบอท × ${Object.keys(BOTS).length} บอท · seed ${seed} · การ์ด min/p50/max ${lens[0]}/${p50(lens)}/${lens.at(-1)} · กดต่อชาติ p50 ${p50(clicks)} · สิ้นอายุ (มนุษย์) p50 ${p50(humanAges)}`);
check('seed เดิมผลเดิม (รวดเดียว)', mismatch, `${total} ชาติ`);
check('เซฟ/โหลดกลางทางได้การ์ดเดิม', resumeBad);
check(`จบได้ทุกชีวิต ภายใน ${CARD_CAP} การ์ด`, stuck);
check('การ์ดไม่เผยบุญบาป', leaks, `${cardsSeen.toLocaleString('en-US')} การ์ด`);
check('ค่าบนหน้าต่างสถานะอยู่ในช่วง', rangeBad);
check('ใบตาเวลาเดินเอง ไม่มีตัวเลือก แต่เปลี่ยนสิ่งที่ทุ่มเทได้', tickBad);
check('เทพธิดายื่นบทบาทคนธรรมดามีอาชีพทุกครั้ง', roleBad);
check('สิ้นอายุเฉพาะหลังวัยชรา', oldBad);
// กดน้อยกว่าชาติไทยชัดเจน (เจ้าของเคาะ) · อายุขัยแบบมนุษย์ ไม่สั้นจนวัยชราหาย ไม่ยาวจนวัยชราน่าเบื่อ
check('กดต่อชาติ p50 ไม่เกิน 40', p50(clicks) > 40 ? 1 : 0, `p50 ${p50(clicks)}`);
check('สิ้นอายุ (มนุษย์) p50 อยู่ในช่วง 65–95', p50(humanAges) < 65 || p50(humanAges) > 95 ? 1 : 0, `p50 ${p50(humanAges)}`);
check('ความรู้อันตรายเฉพาะวัยผู้ใหญ่ขึ้นไป', knowAdultBad);
// ทุกครั้งที่บอกว่าโลกจะจำ ต้องลงรายการจริง และชื่อเสียงถึงเกณฑ์ (สำเร็จ + คนยอมรับ)
check('โลกจำเฉพาะที่ชื่อเสียงถึง', loreBad + (loreSys !== loreGot ? 1 : 0), `${loreGot} รายการ`);
check('เหตุการณ์ตำนานมาเฉพาะโลกที่จำแบบนั้น + เรียกชื่อคนในตำนาน', legendEvBad + legendTextBad);
// ยาต่ออายุ (B68k): ทุกบอทได้ยาครบทุกทาง · ต้องมีชาติที่ดื่มเกิน free ให้ด่านบาปได้ตรวจจริง
// ซื้อร้านอย่างเดียวไม่ได้อายุเกินทางอื่นมาก (เฉลี่ยไม่เกิน 1.5 เท่า)
const POTION_SRC = ISEKAI_EVENTS.filter((e) => e.choices.some((c) => c.potion || c.win?.potion)).map((e) => e.id);
const potionMiss = Object.keys(BOTS).flatMap((name, b) => POTION_SRC.filter((id) => !potionFrom[b]?.has(id)).map((id) => `${name}:${id}`));
const avg = (xs = []) => (xs.length ? xs.reduce((s, v) => s + v, 0) / xs.length : 0);
const shopAvg = avg(potionAdd.shop), otherAvg = avg(potionAdd.other);
check('ยาต่ออายุ: อายุที่ต่อไม่เกินเพดาน · บาปเฉพาะขวดที่เกิน · ทุกบอทได้ทุกทาง', potionBad + potionMiss.length + (potionOver ? 0 : 1), `${POTION_SRC.length} ทาง · ดื่มเกิน ${ISEKAI_POTION.free} ขวด ${potionOver} ชาติ${potionMiss.length ? ` · ขาด ${potionMiss.slice(0, 6).join(' ')}` : ''}`);
check('ซื้อร้านอย่างเดียวไม่ชนะขาด', !otherAvg || shopAvg > otherAvg * 1.5 ? 1 : 0, `ต่อเฉลี่ย ร้าน ${shopAvg.toFixed(1)} · ทางอื่น ${otherAvg.toFixed(1)} · ปน ${avg(potionAdd.mix).toFixed(1)} ปี`);
// ทางคนร้ายหายากกว่าวีรบุรุษ — ต้องเจอทั้งสองแบบ ไม่งั้นด่านผ่านทั้งที่ไม่ได้ตรวจ
check(`ดังถึง ${ISEKAI_FAME.legend} = โลกจำชื่อ · คนร้ายตามชื่อเสียงจากทางบาป`, legendEndBad + (legendGot - legendDark ? 0 : 1) + (legendDark ? 0 : 1), `${legendGot} ชาติ · คนร้าย ${legendDark}`);

// ทางกลับบ้าน (B154): ทริปไม่กลับเองตามเวลา · การ์ดทางกลับมาเมื่อตามหาครบปีที่ทอย (นับใหม่เมื่อปฏิเสธ) · กลับบ้านได้ทางเดียวคือเลือกตัวเลือก home
// ทริปที่ไม่ได้กลับจบด้วยตาย/สิ้นอายุเท่านั้น · การ์ดทริปเข้า seen ให้ด่านมีบอทถึงข้างล่างนับด้วย
let questEarly = 0, homeBad = 0, questGot = 0, eventHome = 0, tripRuns = 0;
Object.values(BOTS).forEach((bot, b) => {
  for (let i = 0; i < n >> 2; i++) {
    const trip = { ...tripRoll(mixSeed(seed, 0xb154 + i), 'door'), age: 18 + (i % 25), wit: 0 };
    const a = play({ ...setup(i), trip }, bot, makeRng(mixSeed(seed ^ 0xb154, b * n + i)));
    if (!a.ended) { stuck++; continue; }
    tripRuns++;
    let sought = 0, homePick = false;
    for (const card of a.cards) {
      if (card.step === 'tick' && card.focusChoices[card.focus] === TRIP_QUEST.focus.name) sought += card.years;
      if (card.step !== 'event') continue;
      seen.event.add(card.id);
      seen.choice.add(`${card.id}#${card.pick}`);
      const c = EVENT[card.id].choices[card.pick];
      if (card.id === TRIP_QUEST.event) {
        questGot++;
        if (sought < trip.years) questEarly++;
        if (!c.home) sought = 0;
      }
      if (c.home) {
        homePick = true;
        if (card.id !== TRIP_QUEST.event) eventHome++;
        // กลับก่อนครบปีไทยที่ทอย = อายุร่างกายน้อยกว่าอายุไทย
        if (card.age - trip.age < trip.thai) questEarly++;
      }
    }
    const end = a.cards.at(-1);
    if (!!end.home !== homePick || !!end.home !== !!a.isk.home || (!end.home && !a.isk.dead && !a.isk.natural)) homeBad++;
  }
});
check('ทางกลับบ้าน: เควสครบปีที่ทอย · กลับเฉพาะเมื่อเลือก · ไม่กลับเองตามเวลา', questEarly + homeBad + (questGot && eventHome ? 0 : 1), `${tripRuns} ทริป · การ์ดทางกลับ ${questGot} · กลับด้วยอีเวนต์ ${eventHome}`);
check('ชาติที่เกิดในต่างโลกไม่เห็นเควส/อีเวนต์ทริป', tripEvBad);

// ทางแยกที่ต้องมีบอทถึง: ตอนจบทุกแบบของทุกบทบาท (+ ตายกลางทาง) · ทุกบทบาท · ทุกสกิล · ทุกเหตุการณ์ · ทุกตัวเลือก
const missing = (want, got) => want.filter((x) => !got.has(x));
const wantEnd = Object.keys(ISEKAI_ROLES).flatMap((r) => Object.keys(roleInfo(r).end).map((t) => `${r}:${t}`).concat(`${r}:death`));
const reach = {
  ตอนจบ: missing(wantEnd, seen.end),
  บทบาท: missing(Object.keys(ISEKAI_ROLES), seen.role),
  สกิล: missing(Object.keys(ISEKAI_SKILLS), seen.skill),
  เหตุการณ์: missing(ISEKAI_EVENTS.map((e) => e.id), seen.event),
  ตัวเลือก: missing(ISEKAI_EVENTS.flatMap((e) => e.choices.map((_, j) => `${e.id}#${j}`)), seen.choice),
  ทางลัดความรู้: missing(Object.keys(ISEKAI_KNOW), seen.shortcut),
};
for (const [k, m] of Object.entries(reach)) check(`${k}มีบอทถึง`, m.length, m.length ? m.slice(0, 8).join(' ') : '');

// ทางเลือกหลังจบผ่านปรโลกจริง: บอทอยู่ต่างโลกต่อทุกครั้งที่เปิด แล้วกลับโลกเดิมเมื่อทางนั้นล็อก
// ต้องได้ชาติต่างโลกติดกัน = stay + 1 พอดี · ปรโลกตัดสินทุกชาติ · ผังตระกูลต่อแถวต่างโลกครบ · ขากลับเกิดเป็นคน
const content = loadContent();
const PATH_ISEKAI = 2, PATH_REBORN = 1;
let stayBad = 0, backBad = 0, loreCarryBad = 0, legendCarryBad = 0, legendRows = 0, stayMax = 0;
// เพดานการ์ดของลูปอยู่ต่อ: ทุกชาติติดกันจบในเพดานของชาติเดียว + การ์ดปรโลกรอบละไม่ถึงร้อย — ชนเพดาน = บอทวนไม่จบ
const STAY_GUARD = (ISEKAI.stay + 1) * (CARD_CAP + 100);
const stayPick = (card, rng, af) => (af.pending?.path ? (card.locked?.[PATH_ISEKAI] ? PATH_REBORN : PATH_ISEKAI) : BOTS.สุ่ม(card, rng));
const backPick = (card, rng, af) => (af.pending?.path ? (af.from ? PATH_REBORN : PATH_ISEKAI) : BOTS.สุ่ม(card, rng));
for (let i = 0; i < lives; i++) {
  for (const [pick, want] of [[stayPick, ISEKAI.stay + 1], [backPick, 1]]) {
    const { state } = playLife(mixSeed(seed, 9000 + i), content, BOTS.สุ่ม);
    const af = startAfterlife(state);
    let verdicts = 0, locked = 0, lastIsk = null, guard = 0;
    for (; guard < STAY_GUARD; guard++) {
      // ชาติต่างโลกที่เพิ่งเริ่มต้องรู้ของที่โลกจำจากทุกชาติก่อนหน้า (ผังตระกูล + ชาติต่างโลกที่จบในช่วงนี้)
      if (af.isekai && af.isekai !== lastIsk) {
        lastIsk = af.isekai;
        if (JSON.stringify(af.isekai.loreAll) !== JSON.stringify(isekaiWorldLore([...(state.lineage ?? []), ...af.isekaiLives]))) loreCarryBad++;
        if (JSON.stringify(af.isekai.legendAll) !== JSON.stringify(isekaiWorldLegends([...(state.lineage ?? []), ...af.isekaiLives]))) legendCarryBad++;
        legendRows += af.isekaiLives.filter((r) => r.legend).length;
      }
      const card = nextAfterCard(af);
      if (card.kind === 'verdict') verdicts++;
      if (card.kind === 'path' && af.from && card.locked?.[PATH_ISEKAI]) locked++;
      if (card.choices?.length) chooseAfter(af, pick(card, af.botRng, af));
      if (card.done) break;
    }
    stayMax = Math.max(stayMax, guard + 1);
    const got = af.isekaiLives.length;
    if (got !== want || verdicts !== 1 + got || !af.heir) stayBad++;
    // เพดานต้องล็อกพอดีตอนชาติสุดท้าย — ทางอยู่ต่อที่ไม่ล็อก = บอทวนไม่จบ
    if (pick === stayPick && locked !== 1) stayBad++;
    const rows = af.heir?.lineage ?? [];
    if (rows.filter((r) => r.isekai).length !== got || af.heir?.gen !== (state.gen ?? 1) + 1 + got) backBad++;
  }
}
check(`อยู่ต่อติดเพดาน ${ISEKAI.stay + 1} ชาติ แล้วปรโลกตัดสินทุกชาติ`, stayBad, `${lives} ชีวิต × 2 แบบ · การ์ดมากสุด ${stayMax}/${STAY_GUARD}`);
check('กลับโลกเดิมลงผังตระกูลครบ', backBad);
check('ชาติต่างโลกถัดไปได้ของที่โลกจำจากผังตระกูล', loreCarryBad);
check('ชาติต่างโลกถัดไปได้ตำนานชาติก่อนจากผังตระกูล', legendCarryBad + (legendRows ? 0 : 1), `แถวตำนานที่ส่งต่อ ${legendRows}`);

// โลกจำ (B68h): ทุกโลกจำครบทุกอย่างแล้ว ⇒ เรื่องคิดค้นของที่มีอยู่แล้วไม่มาอีก · ใบทุ่มเทแรกบอกว่าโลกยังจำอะไร
// แถวผังตระกูลพกรายการไปกลับได้ · ชาติที่ไม่มีของให้จำ แถวผังรูปเดิม
const ALL_LORE = Object.fromEntries([...new Set(Object.keys(ISEKAI_ROLES).map((r) => roleInfo(r).world ?? r))].map((w) => [w, Object.keys(ISEKAI_LORE)]));
let loreSkipBad = 0, loreLineBad = 0;
for (let i = 0; i < lives * 5; i++) {
  const a = play({ ...setup(i), lore: ALL_LORE }, BOTS.สุ่ม, makeRng(mixSeed(seed ^ 0x10e, i)));
  if (a.cards.some((c) => c.step === 'event' && EVENT[c.id].loreOf)) loreSkipBad++;
  if (!a.cards.find((c) => c.step === 'focus')?.text.includes('ที่นี่ยังมี')) loreLineBad++;
}
const row = (lore) => isekaiLineage({ name: 'ก', role: 'commoner', world: 'commoner', ending: { title: 'จบ' }, lore }, 2);
const trip = isekaiWorldLore([row(['soap']), row([]), row(['soap', 'ledger'])]);
const tripBad = (JSON.stringify(trip) !== JSON.stringify({ commoner: ['soap', 'ledger'] }) ? 1 : 0) + ('lore' in row([]) ? 1 : 0);
check('โลกที่จำแล้วไม่ต้องคิดค้นซ้ำ + บอกในใบทุ่มเทแรก', loreSkipBad + loreLineBad + tripBad, `${lives * 5} ชาติ`);

// ตำนาน (B68i): แถวผังพกตำนานไปกลับได้ · ใบทุ่มเทแรกเล่าชื่อคนในตำนาน · บารมีได้โบนัสตามชื่อเสียง (มีเพดาน) โลกที่จำคนร้ายมากกว่าทำให้ยากขึ้น
const legendRow = (legend) => isekaiLineage({ name: 'ก', role: 'commoner', world: 'commoner', ending: { title: 'จบ' }, lore: [], legend }, 2);
const backL = isekaiWorldLegends([legendRow({ world: 'commoner', name: 'ก', ending: 'จบ', dark: false }), legendRow(null), { trips: [{ legend: { world: 'commoner', name: 'ข', ending: 'หาย', dark: true } }] }]);
let legendUnitBad = (JSON.stringify(backL) !== JSON.stringify({ commoner: [{ name: 'ก', ending: 'จบ', dark: false }, { name: 'ข', ending: 'หาย', dark: true }] }) ? 1 : 0) + ('legend' in legendRow(null) ? 1 : 0);
for (let i = 0; i < lives; i++) {
  const a = play({ ...setup(i), legends: LEG_HERO }, BOTS.สุ่ม, makeRng(mixSeed(seed ^ 0x1e9, i)));
  if (!a.cards.find((c) => c.step === 'focus')?.text.includes(HERO.name)) legendUnitBad++;
}
const fake = (fame, worldLegends) => ({ st: { cha: 10, str: 10, fame }, inner: { wit: 0 }, skills: [], flags: {}, karma: 0, worldLegends });
const C = { stat: 'cha', dc: 10 };
const F = ISEKAI_FAME;
for (const [fame, ls, want] of [[0, [], 50], [F.chaPer * 2, [], 52], [1000, [], 50 + F.chaCap], [1000, [HERO, DARK, DARK], 50 + F.chaCap - F.dark], [1000, [HERO, DARK], 50 + F.chaCap]]) {
  if (isekaiChance(fake(fame, ls), C) !== want) legendUnitBad++;
}
if (isekaiChance(fake(1000, []), { stat: 'str', dc: 10 }) !== 50) legendUnitBad++;
check('ตำนานในแถวผัง + บรรทัดใบทุ่มเทแรก + โบนัสบารมีตามชื่อเสียง', legendUnitBad, `${lives} ชาติ`);

// ทางเข้าจากเหตุการณ์ในชีวิต (B68d): บอทสายต่างโลกกดรับการ์ดชวนใบแรก
// อยู่ถึงอายุนัดแรก = เจอการ์ดชวน · กดรับแบบตายมีงานศพ · แบบหายตัวไม่มีงานศพ มีใบตามหาใบเดียว (B137)
// ปรโลกไม่มีการ์ดทางเกิด · เข้าต่างโลกแบบ fated · บอทสุ่มไม่เคยกดรับ
let entryBad = 0, entryLives = 0, entryGone = 0, declineBad = 0;
for (let i = 0; i < lives; i++) {
  let offers = 0, funeral = false, search = 0;
  const r = playLife(mixSeed(seed, 9500 + i), content, isekaiBot, (c) => {
    if (c.entry) offers++;
    if (c.funeral) funeral = true;
    if (c.id === GONE_SEARCH.id) search++;
  });
  if (r.age < (r.state.isekaiEntry?.[0]?.age ?? Infinity)) continue;
  // ได้ไปกลับ (B68m) ตรวจในด่านทริปข้างล่าง
  if (r.state.trips?.length) continue;
  entryLives++;
  const gone = !!ENTRY_EVENTS[r.state.isekaiVia]?.gone;
  if (gone) entryGone++;
  if (offers !== 1 || !r.state.flags.isekai_call || funeral === gone || search !== (gone ? 1 : 0)) {
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
check('การ์ดชวนในชีวิต กดรับ: ตาย = งานศพ · หายตัว = ใบตามหา + วาร์ปข้ามโลก', entryBad + (entryGone && entryGone < entryLives ? 0 : 1), `${entryLives} ชีวิต · หายตัว ${entryGone} · นัด ${ENTRY.bands.length} ช่วงวัย`);
check('บอทที่ไม่ประกาศ isekai ไม่เคยกดรับ', declineBad);

// ไปกลับกลางชีวิต (B68m): การ์ดประตูได้กลับทุกครั้ง · การ์ดหายตัวได้กลับบางที · การ์ดตายไม่เคย
// ทริปจบแบบกลับบ้าน = ชีวิตไทยเดินต่อ อายุร่างกายนับปีต่างโลก · ตายในต่างโลก = หายตัว ไม่มีงานศพ มีใบตามหา (B137) · เวลาไทยผ่านไปตามที่ทอย
// seed เดิมผลเดิม + เล่นซ้ำจากลำดับปุ่ม (แบบเซฟ) ได้การ์ดเดิม · การ์ดทริปไม่เผยบุญบาป · โลกจำจากทริปลงผังตระกูลชาติไทย
let tripLives = 0, tripHome = 0, tripLost = 0, tripFail = 0, tripReplayBad = 0, tripLeak = 0, tripCards = 0, tripLoreBad = 0;
const rollBad = Object.keys(ENTRY_EVENTS).filter((id) => {
  const e = ENTRY_EVENTS[id];
  const got = Array.from({ length: 200 }, (_, k) => !!tripRoll(mixSeed(seed, k), id));
  return e.trip ? got.includes(false) : e.gone ? !got.includes(true) || !got.includes(false) : got.includes(true);
});
check('ทอยทริป: ประตูกลับเสมอ · หายตัวกลับบางที · ตายไม่กลับ', rollBad.length, rollBad.join(' '));
const tripTrace = (s, picks = null) => {
  const out = [], used = [];
  const replay = (f) => (card, rng, h) => {
    const k = picks ? picks[used.length] : f(card, rng, h);
    used.push(k);
    return k;
  };
  const bot = Object.assign(replay(isekaiBot), { isekai: true, trip: replay((card, rng) => {
    const open = card.choices.map((_, k) => k).filter((k) => !card.locked?.[k]);
    return open[Math.floor(rng.next() * open.length)];
  }) });
  const r = playLife(s, content, bot, (c) => out.push(JSON.stringify(c)));
  return { r, out, used };
};
for (let i = 0; i < lives * 10; i++) {
  const s = mixSeed(seed, 9700 + i);
  const a = tripTrace(s);
  const t = a.r.state.trips ?? [];
  if (!t.length) continue;
  tripLives++;
  const b = tripTrace(s);
  const c = tripTrace(s, a.used);
  if (b.out.join('\n') !== a.out.join('\n') || c.out.join('\n') !== a.out.join('\n')) tripReplayBad++;
  for (const x of a.out) {
    const card = JSON.parse(x);
    if (!card.trip) continue;
    tripCards++;
    tripLeak += leakOf(card);
  }
  const st = a.r.state;
  for (const x of t) {
    // ทริปกลับเมื่อผู้เล่นเลือกบนการ์ดทางกลับ (B154) ไม่มีปีกลับตายตัวให้เทียบ
    if (x.years < 0) tripFail++;
    if (x.home) tripHome++;
  }
  const lost = t.at(-1).home ? 0 : 1;
  tripLost += lost;
  // หายตัวต้องเป็นทริปสุดท้าย · ชีวิตที่กลับบ้านครบอายุร่างกาย ≥ อายุไทย · การ์ดกลับบ้านมีทุกทริปที่กลับ
  if (t.slice(0, -1).some((x) => !x.home) || (lost && !st.tripLost) || (!lost && st.tripLost) || (st.away ?? 0) < 0) tripFail++;
  if (a.out.filter((x) => x.includes('"trip":true') && x.includes('"kind":"result"')).length !== t.filter((x) => x.home).length) tripFail++;
  if (lost && (a.out.some((x) => x.includes('"funeral":true')) || a.out.filter((x) => x.includes(`"id":"${GONE_SEARCH.id}"`)).length !== 1)) tripFail++;
  // แถวทริปที่มีของให้โลกจำ อ่านกลับได้จาก isekaiWorldLore
  const want = t.filter((x) => x.lore);
  const got = isekaiWorldLore([{ trips: t }]);
  if (want.some((x) => !x.lore.ids.every((id) => got[x.lore.world]?.includes(id)))) tripLoreBad++;
}
check('ไปกลับกลางชีวิต: กลับบ้านเดินต่อ · ตายในต่างโลกหายตัว + ใบตามหา ไม่มีงานศพ', tripFail + (tripLives && tripHome ? 0 : 1), `${tripLives} ชีวิต · กลับ ${tripHome} · หายตัว ${tripLost}`);
check('ทริป seed เดิมผลเดิม + เล่นซ้ำจากลำดับปุ่ม', tripReplayBad);
check('การ์ดทริปไม่เผยบุญบาป', tripLeak, `${tripCards.toLocaleString('en-US')} การ์ด`);
check('โลกจำจากทริปอ่านกลับได้', tripLoreBad);

// ค่าจริงสะท้อนกลับ (B136): ปีที่ทุ่มเทสะท้อน LINK.tick ของอัตราผลการ์ด (ค่าที่ไม่ชนเพดาน) · ทริปกลับบ้านเขียนค่าจริงลงชีวิตไทย + เงินทางเดียว
// ทริปตายนับแค่เงิน · ชาติที่ไม่มี real ไม่แตะอะไร
const REAL0 = { stats: { health: 50, happiness: 50, knowledge: 50, relations: 50, network: 50 }, money: 0, unit: 1000, age: 30 };
let linkTickBad = 0, linkTicks = 0;
for (let i = 0; i < lives; i++) {
  const isk = startIsekai({ ...setup(i), real: REAL0 });
  for (let guard = 0; guard < CARD_CAP; guard++) {
    const st0 = { ...(isk.st ?? {}) }, r0 = isk.st && JSON.parse(JSON.stringify(isk.real));
    const card = nextIsekaiCard(isk);
    if (card.step === 'end') break;
    // ตาที่ย้อนเวลาเมื่อตายตั้ง HP หลังปีเดินจบ ไม่ใช่ผลของการทุ่มเท ⇒ ข้าม
    if (card.step === 'tick' && r0 && !card.sys?.includes('ย้อนเวลา')) {
      linkTicks++;
      // HP กับพลังลงสุขภาพทั้งคู่ ตามลำดับคีย์ของ isk.st · ชนเพดาน 0–100 ทีละขั้น
      const c01 = (v) => Math.max(0, Math.min(100, v));
      const want = JSON.parse(JSON.stringify(r0));
      for (const k of Object.keys(isk.st)) {
        const d = (isk.st[k] - st0[k]) * LINK.tick;
        if (k === 'hp') want.stats.health = c01(want.stats.health + d);
        else if (k === 'gold') want.money += (d * want.unit) / LINK.gold;
        else if (ISEKAI_LINK[k]) want.stats[ISEKAI_LINK[k]] = c01(want.stats[ISEKAI_LINK[k]] + d * LINK.div);
      }
      if (Math.abs(isk.real.money - want.money) > 1e-6 || Object.keys(want.stats).some((w) => Math.abs(isk.real.stats[w] - want.stats[w]) > 1e-9)) linkTickBad++;
    }
    if (card.choices.length) chooseIsekai(isk, BOTS.สุ่ม(card, makeRng(mixSeed(seed, i * 977 + guard))));
  }
}
const settle = (home) => {
  const st = { money: 1000, health: 40, happiness: 40, knowledge: 40, relations: 40, network: 40 };
  tripSettle(st, { home, trip: { money0: 500 }, real: { money: 800, stats: { health: 90, happiness: 10, knowledge: 120, relations: 55, network: 60 } } });
  return st;
};
const home = settle(true), lost = settle(false), none = { money: 1000, health: 40 };
tripSettle(none, { home: true, trip: {}, real: null });
const settleBad = (home.money !== 1300 || home.health !== 90 || home.knowledge !== 100 ? 1 : 0) + (lost.money !== 1300 || lost.health !== 40 ? 1 : 0) + (none.money !== 1000 ? 1 : 0) + ('gold' in tripCarry({ st: { fame: 10 }, know: { a: 1 } }) ? 1 : 0);
check('ค่าจริงสะท้อนกลับ: ปีที่ทุ่มเท 1/4 · ทริปกลับเขียนค่าจริง เงินทางเดียว · ทริปตายนับแค่เงิน', linkTickBad + settleBad + (linkTicks ? 0 : 1), `${linkTicks.toLocaleString('en-US')} ตา`);
// ทริปหาย (ตายในต่างโลก) ราว 1 ใน 90 ทริป — ลูปข้างบนอาจไม่เจอสักชีวิต ⇒ ไล่ seed ต่อจนเจอ 5 ชีวิต แล้วตรวจว่าไม่มีงานศพ มีใบตามหาใบเดียว (B137)
let lostSeen = 0, lostBad = 0;
const tripBot = Object.assign((c, r, h) => isekaiBot(c, r, h), { isekai: true, trip: (card, rng) => {
  const open = card.choices.map((_, k) => k).filter((k) => !card.locked?.[k]);
  return open[Math.floor(rng.next() * open.length)];
} });
for (let i = 0; i < lives * 200 && lostSeen < 5; i++) {
  let funeral = 0, search = 0;
  const r = playLife(mixSeed(seed, 9700 + i), content, tripBot, (c) => {
    if (c.funeral) funeral++;
    if (c.id === GONE_SEARCH.id) search++;
  });
  if (!r.state.tripLost) continue;
  lostSeen++;
  if (funeral || search !== 1) lostBad++;
}
check('ทริปหาย: ไม่มีงานศพ · ใบตามหาใบเดียว', lostBad + (lostSeen ? 0 : 1), `${lostSeen} ชีวิต`);

// คำกรรมที่ส่งต่อ (B137): การ์ดส่งต่อบอกคำตามบุญ+บาปที่ติดตัวไปจริง ไม่ใช่สัดส่วนที่สุ่ม · บัญชีว่าง = แทบไม่มี
let carryBad = 0;
const carryWords = new Set();
for (let i = 0; i < lives; i++) {
  const { state } = playLife(mixSeed(seed, 9900 + i), content, BOTS.สุ่ม);
  const af = startAfterlife(state);
  for (let guard = 0; guard < 200; guard++) {
    const card = nextAfterCard(af);
    if (card.kind === 'carry') {
      const l = af.heir.ledger;
      const want = CARRY_WORDS.find(([cut]) => l.merit + l.sin < cut)?.[1] ?? 'มาก';
      carryWords.add(want);
      if (!card.text.includes(`ติดตัวไปครั้งนี้${want} `)) carryBad++;
    }
    if (card.choices?.length) chooseAfter(af, BOTS.สุ่ม(card, af.botRng, af));
    if (card.done) break;
  }
}
const carryCtl = carryAmount({ kept: 0, carried: 0.7 }) === 'แทบไม่มี' && carryAmount({ carried: 0.7 }) === 'มาก' ? 0 : 1;
check('คำกรรมที่ส่งต่ออ่านขนาดกรรมจริง', carryBad + carryCtl, `${lives} ชีวิต · คำที่เจอ ${[...carryWords].join(' ')}`);

// ตัวควบคุม: ตัววัดต้องจับของเสียที่ปลูกไว้ได้ — ไม่งั้นด่านผ่านเพราะวัดไม่เป็น
const ctl = [
  ['รั่วจาก key', leakOf({ text: 'ก', status: { karma: 0.3 } }) > 0],
  ['รั่วจากข้อความ', leakOf({ text: 'ได้บุญ +5' }) > 0],
  ['รั่วความรู้ซ่อน', leakOf({ text: 'ก', know: { food: 10 } }) > 0],
  ['ข้อความทำบุญปกติไม่นับรั่ว', leakOf({ text: 'คนที่บ้านทำบุญให้คุณทุกวันพระ' }) === 0],
  ['HP ทะลุเพดาน', rangeOf({ hp: 101, goal: 0, gold: 0, fame: 0, str: 1, mag: 1, cha: 1, luk: 1 }) > 0],
  ['ทองติดลบ', rangeOf({ hp: 50, goal: 0, gold: -1, fame: 0, str: 1, mag: 1, cha: 1, luk: 1 }) > 0],
];
check('ตัวควบคุม', ctl.filter(([, ok]) => !ok).length, ctl.filter(([, ok]) => !ok).map(([k]) => k).join(' '));

for (const r of rows) console.log(r);
console.log(fail.length ? `\nตก ${fail.length} ด่าน` : '\nผ่านทุกด่าน');
process.exit(fail.length ? 1 : 0);
