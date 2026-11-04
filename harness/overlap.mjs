// ด่านค่าซ้อนทับ (โลกซ้อนทับ ใบ 08): บอททุกบุคลิกเล่นต่อกันหลายรุ่นแบบข้ามโลก แล้วรายงานค่าซ้อนทับของตระกูลรายรุ่น
// ฝั่งข้ามโลก: กดรับการ์ดชวนทุกใบ (ทริปไปกลับ/ถูกเรียก) · ทางเกิดจากชาติไทยเลือกต่างโลกเสมอ · จากต่างโลกกลับโลกเดิม หรืออยู่ต่ออีกรอบตามสุ่ม
// ตัวควบคุม: บุคลิกเดียวกันที่ไม่ข้ามโลกเลย (ปฏิเสธการ์ดชวน · ทางเกิดไม่เลือกต่างโลก) ค่าต้องเป็น 0 ทุกรุ่น
// ด่าน (ตก = exit 1):
//   (1) บัญชีเหยียบซ้ำ — ด่านจำเองว่าตระกูลเคยออกจากต่างโลกหรือยัง (ทริปกลับบ้าน · เกิดกลับหลังชาติต่างโลก) ไม่อ่านตัวตัดสินของ engine:
//       ค่าที่ขึ้นระหว่างชีวิต = ทริปกลับบ้าน + ทริปที่เริ่มตอนตระกูลเคยออกแล้ว (เข้าซ้ำ)
//       ค่าที่ขึ้นตอนเกิดใหม่ = 1 เมื่อรอบปรโลกมีชาติต่างโลกคั่น (เกิดกลับ) + 1 เมื่อชาติต่างโลกแรกของรอบเริ่มตอนตระกูลเคยออกแล้ว (เข้าซ้ำ)
//       ⇒ ทริปหลงไม่นับว่ากลับ · เกิดในโลกปกติต่อกัน · ปรโลกคั่นชาติ ไม่เพิ่ม · ชาติต่างโลกติดกันหลายรอบกลับครั้งเดียว +1
//   (2) ฝั่งข้ามโลกมีตระกูลที่ค่า > 0 · มีตัวอย่างเกิดกลับ · ทริปกลับบ้าน · เข้าต่างโลกซ้ำ ทั้งทางทริปและทางเกิด — ไม่มี = ตัววัดไม่ได้วัดอะไร
//   (3) ตัวควบคุมไม่ข้ามโลก = 0 ทุกรุ่น
//   (4) ค่าไม่ลดระหว่างรุ่นในทุกบอท
//   (5) เริ่มตระกูลใหม่ (newLife ไม่มี heir) = 0 แม้ตระกูลก่อนหน้าค่าสูง
//   (6) การ์ดข่าวลือขั้น 1 (ใบ 09): ฝั่งข้ามโลกออก > 0 · ตัวควบคุมไม่ข้ามโลกออก 0 — นับจากบันทึกการ์ดที่ออกของแต่ละชีวิต
//   (7) ขั้นที่ชาติต่างโลกเห็น (ใบ 15): ทุกชาติ (ทริป · เกิด · ถูกเรียก) เห็นขั้นเท่าขั้นของตระกูลตอนข้าม · การ์ดต่างโลกขั้น ≥ 1 ออก > 0 และไม่ออกในชาติขั้น 0
//   (10) สายนักล่า (ใบ 19): ขั้น 3 เข้าสายผ่านการ์ดรับสมัคร ชื่องานเป็นขั้นนักล่า เลื่อนขั้นได้ · ขั้น 0–1 เข้าสาย 0 · ปฏิเสธการ์ดแล้วทำงานบริการไม่ถูกจับเข้าสาย
//   (11) ดันเจียนไทย (ใบ 21): ขั้น 3 รอบละ 2–3 ใบ · คนถูกดึงตายในดันเจียน 0 · นักล่าตายด้วย accident/assault · ค่าซ้อนไม่ขยับ · ขั้น 0–1 ไม่เจอ
//        โรคที่ถึงคิวกลางรอบตายท้ายรอบ 0 ตัดกลางทาง (ชุดบังคับสุขภาพ 0 ก่อนใบเข้า) · ห้องบอสทางไม่ตายลงโรค ไม่ใช่บาดแผล
import { playLife, playAfterlife, nextLife, newLife, mixSeed, overlapOf, overlapStageOf, overlapPlan, PATHS, ENTRY } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 200);
const gens = opt('gens', 4);
const seed = opt('seed', 1);
const content = loadContent();
const RUMOR = 'overlap_rumor_';
const rumorsOf = (state) => Object.entries(state.fired ?? {}).reduce((s, [id, f]) => s + (id.startsWith(RUMOR) ? f.n : 0), 0);
// (8) ตารางนัดการ์ดซ้อนทับ (ใบ 14): โควตาต่อชีวิตตามขั้นเขียนจากสเปก (decisions 34 · 41) ไม่อ่านค่าคงที่ของ engine
const PLAN_PREFIX = 'overlap_';
const PLAN_QUOTA = [[0, 0], [1, 1], [1, 2], [2, 4], [2, 4]];
const PLAN_AGES = [15, 60];
const overlapCards = (state) => Object.entries(state.fired ?? {}).reduce((s, [id, f]) => s + (id.startsWith(PLAN_PREFIX) ? f.n : 0), 0);
const ISK_CARD = 'cp_overlap_';
// ค่าตระกูลไม่ขยับระหว่างที่ชาติต่างโลกยังเล่นอยู่ (ทริปเหยียบตอนกลับ · ปรโลกเหยียบก่อนส่ง) ⇒ ขั้นของตระกูล ณ การ์ดแรกของชาติ = ขั้นตอนข้าม
// ค่าตระกูลเองตรวจแยกแล้วที่ด่าน (1) จึงเทียบกับ overlapStageOf ของตระกูลได้ตรง ๆ
const watchIsekai = (r) => {
  const seen = new WeakSet();
  return (card, isk, family) => {
    if (!isk) return;
    const got = isk.overlapStage ?? 0;
    if (!seen.has(isk)) {
      seen.add(isk);
      r.iskLives++;
      r.iskStage[got] = (r.iskStage[got] ?? 0) + 1;
      if (got !== overlapStageOf(family)) r.iskBad++;
    }
    if (card.id?.startsWith(ISK_CARD)) {
      r.iskCard++;
      if (got < 1) r.iskCardBad++;
    }
  };
};

const P_ISEKAI = PATHS.findIndex((p) => p.id === 'isekai');
const P_REBORN = PATHS.findIndex((p) => p.id === 'reborn');
// จากต่างโลกอยู่ต่ออีกรอบ — ให้มีตัวอย่างชาติต่างโลกติดกัน (ต้องได้ +1 ครั้งเดียวตอนกลับ)
const STAY = 0.3;
const open = (card, k) => k >= 0 && k < card.choices.length && !card.locked?.[k];
const randomOpen = (card, rng) => {
  const ks = card.choices.map((_, k) => k).filter((k) => open(card, k));
  return ks[Math.floor(rng.next() * ks.length)];
};

// ห่อบุคลิกเดิม: การ์ดอื่นทุกใบเลือกตามบุคลิก (ส่ง .focus ต่อ) · ต่างกันแค่การ์ดชวน การ์ดทริป และการ์ดทางเกิด
const crosser = (bot) => Object.assign((card, rng, h) => {
  if (card.entry) return ENTRY.accept;
  if (card.kind === 'path') {
    if (h?.from && open(card, P_ISEKAI) && rng.next() < STAY) return P_ISEKAI;
    const want = h?.from ? P_REBORN : P_ISEKAI;
    return open(card, want) ? want : randomOpen(card, rng);
  }
  return bot(card, rng, h);
}, bot, { isekai: true, trip: randomOpen });
const stayer = (bot) => Object.assign((card, rng, h) => {
  if (card.kind === 'path') {
    const k = bot(card, rng, h);
    return k !== P_ISEKAI && open(card, k) ? k : card.choices.map((_, j) => j).find((j) => j !== P_ISEKAI && open(card, j));
  }
  return bot(card, rng, h);
}, bot);

const started = Date.now();
const rows = [];
const fails = [];
const fail = (msg) => fails.push(msg);
let resetChecked = 0;
for (const [name, base] of Object.entries(BOTS)) {
  for (const [mode, bot] of [['ข้าม', crosser(base)], ['ไม่ข้าม', stayer(base)]]) {
    const r = { name, mode, byGen: Array.from({ length: gens }, () => []), born: 0, trip: 0, lost: 0, reTrip: 0, reBorn: 0, chain: 0, rumor: 0, bad: 0, drop: 0, families: 0, top: 0, iskLives: 0, iskStage: {}, iskBad: 0, iskCard: 0, iskCardBad: 0, plan: {}, planBad: 0, replan: 0, replanDiff: 0, replanSame: 0, replanSameDiff: 0, replanShow: '' };
    rows.push(r);
    const watch = watchIsekai(r);
    for (let i = 0; i < n; i++) {
      let st = null;
      let prev = 0;
      let left = false;
      for (let g = 0; g < gens; g++) {
        const start = overlapOf(st);
        // ตารางนัดซ้อนทับที่ชีวิตเห็นก่อน/หลังทริปกลับบ้าน — จดจากการ์ดแรกของชีวิตและการ์ดแรกหลังจำนวนทริปกลับบ้านขยับ
        const plans = [];
        let homes = -1;
        const planOf = (s) => JSON.stringify((s.scheduled ?? []).filter((x) => x.overlap).map((x) => [x.event, x.age]));
        const { state } = playLife(mixSeed(seed, i * 7919 + g), content, bot, (card, s) => {
          watch(card, s.trip, s);
          if (s.trip) return;
          const h = (s.trips ?? []).filter((t) => t.home).length;
          if (h !== homes) {
            homes = h;
            plans.push({ stage: overlapStageOf(s), plan: planOf(s) });
          }
        }, st ?? undefined);
        const home = (state.trips ?? []).filter((t) => t.home).length;
        const oc = overlapCards(state);
        // ค่าตระกูลเหยียบตอนตาย/ข้ามโลก ⇒ ขั้นตอนจบชีวิตไม่ใช่ขั้นที่ตารางใช้ · แยกตามขั้นตอนเกิด (ตารางแรกของชีวิต)
        const born = plans[0] ?? { stage: overlapStageOf(state), plan: '[]' };
        const q = PLAN_QUOTA[born.stage];
        const p = (r.plan[born.stage] ??= { lives: 0, cards: {}, full: 0, fullOk: 0 });
        p.lives++;
        p.cards[oc] = (p.cards[oc] ?? 0) + 1;
        const noTrip = !(state.trips ?? []).length;
        if (!born.stage && noTrip && oc) r.planBad++;
        if (noTrip && oc > q[1]) r.planBad++;
        // ไม่มีทริปและอยู่เลยอายุนัดสุดท้ายของตารางตัวเอง = ทุกนัดถึงกำหนดแล้ว ต้องออกครบตาราง และตารางต้องไม่ต่ำกว่าโควตาล่าง
        const due = JSON.parse(born.plan);
        if (noTrip && born.stage && state.age > Math.max(PLAN_AGES[0], ...due.map(([, a]) => a))) {
          p.full++;
          if (oc === due.length && oc >= q[0]) p.fullOk++;
          else r.planBad++;
        }
        for (let k = 1; k < plans.length; k++) {
          r.replan++;
          if (plans[k].plan !== plans[k - 1].plan) r.replanDiff++;
          if (plans[k - 1].stage && plans[k].stage) {
            r.replanSame++;
            if (plans[k].plan !== plans[k - 1].plan) r.replanSameDiff++;
            if (!r.replanShow) r.replanShow = `${plans[k - 1].plan} → ${plans[k].plan}`;
          }
        }
        let reTrip = 0;
        for (const t of state.trips ?? []) {
          if (left) reTrip++;
          if (t.home) left = true;
        }
        r.trip += home;
        r.rumor += rumorsOf(state);
        r.reTrip += reTrip;
        if (state.tripLost) r.lost++;
        if (overlapOf(state) - start !== home + reTrip) r.bad++;
        const v = overlapOf(state);
        if (v < prev) r.drop++;
        prev = v;
        r.byGen[g].push(v);
        if (g === gens - 1) break;
        const af = playAfterlife(state, bot, (card, a) => watch(card, a.isekai, a.st));
        const back = af.isekaiLives.length ? 1 : 0;
        const reBorn = back && left ? 1 : 0;
        if (back) left = true;
        r.born += back;
        r.reBorn += reBorn;
        if (af.isekaiLives.length > 1) r.chain++;
        if (overlapOf(af.heir) - v !== back + reBorn) r.bad++;
        st = nextLife(af);
        if (overlapOf(st) !== overlapOf(af.heir)) r.bad++;
      }
      if (prev > 0) {
        r.families++;
        r.top = Math.max(r.top, prev);
        // เริ่มตระกูลใหม่หลังตระกูลที่ค่าสูง — ไม่มี heir จึงต้องเป็น 0 และไม่มีช่อง overlap ในสถานะ
        const fresh = newLife(mixSeed(seed ^ 0x0e1a9, i), content);
        resetChecked++;
        if (overlapOf(fresh) !== 0 || 'overlap' in fresh) fail(`${name}: เริ่มตระกูลใหม่ได้ค่า ${overlapOf(fresh)}`);
      }
    }
    if (r.bad) fail(`${name} ${mode}: บัญชีเหยียบซ้ำไม่ตรง ${r.bad} จุด`);
    if (r.drop) fail(`${name} ${mode}: ค่าลดระหว่างรุ่น ${r.drop} ตระกูล`);
    if (mode === 'ไม่ข้าม' && r.byGen.some((vs) => vs.some((v) => v !== 0))) fail(`${name} ไม่ข้าม: ค่าไม่เป็น 0`);
    if (mode === 'ไม่ข้าม' && r.rumor) fail(`${name} ไม่ข้าม: การ์ดข่าวลือออก ${r.rumor} ครั้ง`);
    if (r.iskBad) fail(`${name} ${mode}: ชาติต่างโลกเห็นขั้นไม่ตรงขั้นตระกูลตอนข้าม ${r.iskBad} ชาติ`);
    if (r.iskCardBad) fail(`${name} ${mode}: การ์ด ${ISK_CARD}* ออกในชาติต่างโลกขั้น 0 ${r.iskCardBad} ครั้ง`);
    if (mode === 'ไม่ข้าม' && r.iskCard) fail(`${name} ไม่ข้าม: การ์ด ${ISK_CARD}* ออก ${r.iskCard} ครั้ง`);
    if (r.planBad) fail(`${name} ${mode}: การ์ด ${PLAN_PREFIX}* ต่อชีวิตนอกโควตาของขั้น ${r.planBad} ชีวิต`);
  }
}

const cross = rows.filter((r) => r.mode === 'ข้าม');
const sum = (k) => cross.reduce((s, r) => s + r[k], 0);
if (!sum('families')) fail('ฝั่งข้ามโลกไม่มีตระกูลไหนค่า > 0');
if (!sum('born')) fail('ไม่มีตัวอย่างเกิดกลับโลกปกติหลังชาติต่างโลก');
if (!sum('trip')) fail('ไม่มีตัวอย่างทริปกลับบ้าน');
if (!sum('reTrip')) fail('ไม่มีตัวอย่างเข้าต่างโลกซ้ำทางทริป');
if (!sum('reBorn')) fail('ไม่มีตัวอย่างเข้าต่างโลกซ้ำทางเกิด/ถูกเรียก');
if (!resetChecked) fail('ไม่ได้ตรวจเริ่มตระกูลใหม่สักครั้ง');
if (!sum('rumor')) fail('ฝั่งข้ามโลกไม่มีการ์ดข่าวลือออกเลย');
const iskStage = {};
for (const r of cross) for (const [k, v] of Object.entries(r.iskStage)) iskStage[k] = (iskStage[k] ?? 0) + v;
if (!iskStage[1]) fail('ไม่มีชาติต่างโลกที่เห็นขั้น ≥ 1 — ตัววัดขั้นฝั่งต่างโลกไม่ได้วัดอะไร');
if (!sum('iskCard')) fail(`ฝั่งข้ามโลกไม่มีการ์ด ${ISK_CARD}* ออกเลย`);

// (8) ต่อขั้นจากชีวิตจริง + ตารางก่อน/หลังทริป
const planBy = {};
for (const r of rows) for (const [k, p] of Object.entries(r.plan)) {
  const t = (planBy[k] ??= { lives: 0, cards: {}, full: 0, fullOk: 0 });
  t.lives += p.lives;
  t.full += p.full;
  t.fullOk += p.fullOk;
  for (const [c, v] of Object.entries(p.cards)) t.cards[c] = (t.cards[c] ?? 0) + v;
}
// ฝั่งข้ามรับชวนทริปทุกครั้ง ⇒ ชีวิตขั้น ≥ 1 ที่ไม่มีทริปไม่เกิดในตารางหลัก · รุ่นที่ข้ามจนตระกูลถึงขั้น 1 แล้ว ส่งทายาทให้บุคลิกไม่ข้ามเล่นต่อ
for (const [name, base] of Object.entries(BOTS)) {
  const cross = crosser(base);
  for (let i = 0; i < n; i++) {
    let st;
    for (let g = 0; g < gens - 1 && !(st && overlapStageOf(st)); g++) {
      const { state } = playLife(mixSeed(seed ^ 0x7a11, i * 7919 + g), content, cross, undefined, st ?? undefined);
      st = nextLife(playAfterlife(state, cross));
    }
    const stage = st ? overlapStageOf(st) : 0;
    if (!stage) continue;
    const due = st.scheduled.filter((x) => x.overlap);
    const { state } = playLife(mixSeed(seed ^ 0x7a11, i * 7919 + gens), content, stayer(base), undefined, st);
    const oc = overlapCards(state);
    const t = (planBy[stage] ??= { lives: 0, cards: {}, full: 0, fullOk: 0 });
    t.lives++;
    t.cards[oc] = (t.cards[oc] ?? 0) + 1;
    if ((state.trips ?? []).length) fail(`${name}: ทายาทบุคลิกไม่ข้ามมีทริป`);
    else if (oc > PLAN_QUOTA[stage][1]) fail(`${name}: ทายาทขั้น ${stage} ไม่มีทริปได้การ์ด ${oc} ใบ เกินโควตา`);
    if (!(state.trips ?? []).length && state.age > Math.max(PLAN_AGES[0], ...due.map((x) => x.age))) {
      t.full++;
      if (oc === due.length && oc >= PLAN_QUOTA[stage][0]) t.fullOk++;
      else fail(`${name}: ทายาทขั้น ${stage} อยู่เลยนัดสุดท้าย ได้ ${oc} ใบ จากนัด ${due.length}`);
    }
  }
}
if (!planBy[1]?.full) fail('ไม่มีชีวิตขั้น 1 ที่ไม่มีทริปและอยู่เลยนัดสุดท้าย — ตัววัดโควตาล่างไม่ได้วัดอะไร');
if (!sum('replanSame')) fail('ไม่มีชีวิตที่ทริปกลับบ้านตอนขั้น ≥ 1 แล้ว — ตัววัดสุ่มตารางใหม่ไม่ได้วัดอะไร');
else if (!sum('replanSameDiff')) fail(`ทริปกลับบ้าน ${sum('replanSame')} ครั้งตารางไม่เปลี่ยนเลย`);
// ขั้น 2–4 ตระกูลจริงยังไปไม่ถึง (ไม่มีเลขเกณฑ์) ⇒ เรียกแกนตรงด้วยขั้นที่ส่งเอง บนการ์ดโพรบ 6 ใบ ให้โควตาบนไม่ติดจำนวนการ์ด
// ตัวควบคุม: การ์ดโพรบที่ when ไม่ครอบขั้นนั้นต้องไม่ถูกนัดเลย
const probe = { ...content, events: [...content.events.filter((e) => !e.id.startsWith(PLAN_PREFIX)), ...Array.from({ length: 6 }, (_, k) => ({ id: `${PLAN_PREFIX}probe_${k}`, when: { overlap_stage: [1, 4] } })), { id: `${PLAN_PREFIX}probe_off`, when: { overlap_stage: [9, 9] } }] };
const synth = [];
for (let stage = 0; stage < PLAN_QUOTA.length; stage++) {
  const seen = new Map();
  let bad = 0;
  for (let t = 0; t < 400; t++) {
    const s = newLife(mixSeed(seed ^ 0x51ab, t), probe);
    overlapPlan(s, t, stage);
    const got = s.scheduled.filter((x) => x.overlap);
    seen.set(got.length, (seen.get(got.length) ?? 0) + 1);
    if (got.length < PLAN_QUOTA[stage][0] || got.length > PLAN_QUOTA[stage][1]) bad++;
    if (got.some((x) => x.age < PLAN_AGES[0] || x.age > PLAN_AGES[1] || x.event.endsWith('_off'))) bad++;
    if (new Set(got.map((x) => x.event)).size !== got.length) bad++;
  }
  // ช่วงโควตาต้องสุ่มได้ทั้งปลายล่างและปลายบน ไม่ใช่ค่าเดียวตลอด
  const ends = [...new Set(PLAN_QUOTA[stage])].every((v) => seen.has(v));
  if (bad || !ends) fail(`แกนนัดขั้น ${stage} (การ์ดโพรบ): นอกโควตา/อายุ/ซ้ำ ${bad} · ได้ครบปลายช่วง ${ends ? 'ใช่' : 'ไม่'}`);
  synth.push(`ขั้น ${stage} [${PLAN_QUOTA[stage].join('–')}]: ${[...seen.keys()].sort().map((k) => `${k} ใบ ${seen.get(k)}`).join(' · ')}`);
}

const mean = (vs) => (vs.length ? vs.reduce((s, v) => s + v, 0) / vs.length : 0);
const pct = (c, t) => `${t ? ((c / t) * 100).toFixed(1) : '0.0'}%`;
console.log(`ด่านค่าซ้อนทับ · ${Object.keys(BOTS).join(' · ')} × ${n} ตระกูล × ${gens} รุ่น × (ข้าม + ไม่ข้าม) · seed ${seed} · ${((Date.now() - started) / 1000).toFixed(0)} วิ\n`);
const genHead = Array.from({ length: gens }, (_, g) => `รุ่น ${g + 1}`.padStart(13)).join('');
console.log(`${'บอท'.padEnd(14)}${'แบบ'.padEnd(9)}${genHead}  เกิดกลับ  ทริปกลับ  เข้าซ้ำทริป  เข้าซ้ำเกิด  ทริปหลง  ต่างโลกติดกัน  ข่าวลือ  ตระกูล>0  สูงสุด`);
for (const r of rows) {
  const cells = r.byGen.map((vs) => `${mean(vs).toFixed(2)}/${pct(vs.filter((v) => v > 0).length, vs.length)}`.padStart(13)).join('');
  console.log(`${r.name.padEnd(14)}${r.mode.padEnd(9)}${cells}  ${String(r.born).padStart(8)}  ${String(r.trip).padStart(8)}  ${String(r.reTrip).padStart(10)}  ${String(r.reBorn).padStart(9)}  ${String(r.lost).padStart(7)}  ${String(r.chain).padStart(13)}  ${String(r.rumor).padStart(6)}  ${pct(r.families, n).padStart(8)}  ${String(r.top).padStart(6)}`);
}
console.log('  (ช่องรุ่น = ค่าเฉลี่ยตอนจบชีวิต / สัดส่วนตระกูลที่ค่า > 0)');

// กระจายค่าตอนจบรุ่นสุดท้ายของฝั่งข้ามโลก — ใบขั้นของค่าซ้อนทับใช้ตั้งเกณฑ์
const last = cross.flatMap((r) => r.byGen[gens - 1]);
const dist = new Map();
for (const v of last) dist.set(Math.min(v, 10), (dist.get(Math.min(v, 10)) ?? 0) + 1);
console.log(`\nค่าตอนจบรุ่น ${gens} (ฝั่งข้ามโลก ${last.length} ตระกูล): ${[...dist.keys()].sort((a, b) => a - b).map((k) => `${k === 10 ? '10+' : k} = ${pct(dist.get(k), last.length)}`).join(' · ')}`);

console.log(`\nตัวควบคุมไม่ข้ามโลก: ${rows.filter((r) => r.mode === 'ไม่ข้าม').every((r) => r.byGen.every((vs) => vs.every((v) => v === 0))) ? '0 ทุกรุ่นทุกบอท ผ่าน' : 'มีค่า > 0 ตก'}`);
console.log(`เริ่มตระกูลใหม่ตรวจ ${resetChecked} ครั้ง`);
console.log(`การ์ดข่าวลือ (${RUMOR}*): ข้าม ${sum('rumor')} ครั้ง · ไม่ข้าม ${rows.filter((r) => r.mode === 'ไม่ข้าม').reduce((s, r) => s + r.rumor, 0)} ครั้ง`);
console.log(`ขั้นที่ชาติต่างโลกเห็น (ฝั่งข้ามโลก ${sum('iskLives')} ชาติ): ${Object.keys(iskStage).sort().map((k) => `ขั้น ${k} = ${iskStage[k]}`).join(' · ')} · ไม่ตรงขั้นตระกูลตอนข้าม ${rows.reduce((s, r) => s + r.iskBad, 0)}`);
console.log(`การ์ดต่างโลก (${ISK_CARD}*): ข้าม ${sum('iskCard')} ครั้ง · ออกในชาติขั้น 0 ${rows.reduce((s, r) => s + r.iskCardBad, 0)} · ไม่ข้าม ${rows.filter((r) => r.mode === 'ไม่ข้าม').reduce((s, r) => s + r.iskCard, 0)}`);
console.log(`\nตารางนัดการ์ดซ้อนทับ (${PLAN_PREFIX}*) ต่อชีวิตตามขั้นตอนเกิด (ทุกบอท ทั้งสองแบบ):`);
for (const k of Object.keys(planBy).sort()) {
  const p = planBy[k];
  console.log(`  ขั้น ${k} [${PLAN_QUOTA[k].join('–')}]: ${p.lives} ชีวิต · ${Object.keys(p.cards).sort().map((c) => `${c} ใบ ${pct(p.cards[c], p.lives)}`).join(' · ')} · ไม่มีทริปและอยู่เลยนัดสุดท้าย: ${p.fullOk}/${p.full} ออกครบตาราง`);
}
console.log(`  ทริปกลับบ้านแล้วตารางเปลี่ยน: ${sum('replanDiff')}/${sum('replan')} ครั้ง · เฉพาะขั้น ≥ 1 ทั้งก่อนและหลัง ${sum('replanSameDiff')}/${sum('replanSame')} · ตัวอย่าง ${cross.find((r) => r.replanShow)?.replanShow ?? '-'}`);
console.log(`  แกนนัดบนการ์ดโพรบ 6 ใบ × 400: ${synth.join(' | ')}`);
if (fails.length) {
  for (const f of fails) console.log(`✗ ${f}`);
  console.log(`ด่านค่าซ้อนทับตก ${fails.length} ข้อ`);
  process.exitCode = 1;
} else {
  console.log(`ด่านค่าซ้อนทับผ่าน: บัญชีเหยียบซ้ำตรงทุกชีวิต · เกิดกลับ ${sum('born')} · ทริปกลับบ้าน ${sum('trip')} · เข้าซ้ำ ทริป ${sum('reTrip')} เกิด ${sum('reBorn')} · ทริปหลงไม่นับ ${sum('lost')} · ข่าวลือออก ${sum('rumor')} · ชาติต่างโลกเห็นขั้นตรง ${sum('iskLives')} ชาติ · การ์ดต่างโลกขั้น ≥ 1 ออก ${sum('iskCard')} · ค่าไม่ลด · ตัวควบคุม = 0`);
}

// (10) สายนักล่า (ใบ 19): ขั้น 3 เข้าสายผ่านการ์ดรับสมัคร ชื่องานเป็นขั้นนักล่า เลื่อนขั้นได้ · ขั้น 0–1 เข้าสาย 0 · คนทำงานบริการไม่ถูกจับเข้าสายเอง
// ชื่อขั้นเขียนจากสเปกที่ผู้รวมงานเคาะ ไม่อ่าน careers.json · บล็อกแยกท้ายไฟล์ ไม่แตะผลรวม fails ข้างบน (ใบพี่น้องแก้ช่วงนั้น)
// ขั้น 3 ตระกูลจริงยังไปไม่ถึง ⇒ ยืมเกณฑ์ขั้น 2–3 = ค่า 2–3 เฉพาะช่วงนัดและเล่นชีวิตนั้น แล้วคืนค่าเดิม
{
  const { OVERLAP_STAGE_MIN, rankName, officeFull } = await import('../src/engine/index.mjs');
  const RECRUIT = 'overlap_hunter_recruit_01';
  const FIRST = 'first_hunter_01';
  const NAMES = ['นักล่าฝึกหัด', 'นักล่าเกต', 'หัวหน้าทีมล่า', 'ผู้บัญชาการกิลด์นักล่า'];
  const hunterFails = [];
  // บอทที่สมัครเสมอเมื่อเจอการ์ดรับสมัคร (ตัวเลือกแรก) · ตัวควบคุมไม่สมัครเลย — การ์ดอื่นเลือกตามบุคลิก
  const applier = (bot) => Object.assign((card, rng, h) => (card.id === RECRUIT && open(card, 0) ? 0 : bot(card, rng, h)), bot);
  const decliner = (bot) => Object.assign((card, rng, h) => (card.id === RECRUIT ? card.choices.length - 1 : bot(card, rng, h)), bot);
  const hunt = { low: 0, lowLives: 0, lowRecruit: 0, lowService: 0, lives: 0, recruit: 0, entered: 0, first: 0, promoted: 0, top: 0, badName: 0, show: '', ctlLives: 0, ctlService: 0, ctlHunter: 0 };
  const watch = (life, ctl) => (card, s) => {
    if (card.id === RECRUIT) life.recruit = true;
    if (card.id === FIRST) life.first++;
    if (s.occupation === 'service') life.service = true;
    if (s.ladder?.id !== 'hunter') return;
    life.hunter = true;
    life.rank = Math.max(life.rank, s.ladder.rank);
    // ตำแหน่งการเมืองเต็มเวลาแทนชื่องานทุกสาย (rankName) — ไม่ใช่ชื่อขั้นที่ใบนี้วัด
    if (officeFull(s)) return;
    const shown = rankName(s);
    if (!NAMES.some((nm) => shown.startsWith(nm))) hunt.badName++;
    else if (!ctl && s.ladder.rank > 0 && !hunt.show) hunt.show = shown;
  };
  const playStage3 = (k, bot, ctl) => {
    const life = { recruit: false, first: 0, service: false, hunter: false, rank: 0 };
    const keep = [OVERLAP_STAGE_MIN[2], OVERLAP_STAGE_MIN[3]];
    OVERLAP_STAGE_MIN[2] = 2;
    OVERLAP_STAGE_MIN[3] = 3;
    try {
      const s = newLife(mixSeed(seed ^ 0x4e19, k), content);
      s.overlap = 3;
      if (overlapStageOf(s) !== 3) {
        hunterFails.push(`ยืมเกณฑ์แล้วค่า 3 ไม่ได้ขั้น 3`);
        return life;
      }
      overlapPlan(s, 0);
      playLife(mixSeed(seed ^ 0x4e19, k), content, bot, watch(life, ctl), s);
    } finally {
      [OVERLAP_STAGE_MIN[2], OVERLAP_STAGE_MIN[3]] = keep;
    }
    return life;
  };
  let k = 0;
  for (const [name, base] of Object.entries(BOTS)) {
    // ขั้นจริง 0–1: ตระกูลข้ามโลกหลายรุ่น การ์ดรับสมัครกับสายนักล่าต้องไม่โผล่
    for (let i = 0; i < n; i++) {
      let st;
      for (let g = 0; g < gens; g++) {
        const life = { recruit: false, first: 0, service: false, hunter: false, rank: 0 };
        const { state } = playLife(mixSeed(seed ^ 0x4e1a, i * 7919 + g), content, applier(crosser(base)), watch(life, true), st ?? undefined);
        hunt.lowLives++;
        if (life.recruit) hunt.lowRecruit++;
        if (life.hunter || life.first) hunt.low++;
        if (life.service && overlapOf(state) === 0) hunt.lowService++;
        st = nextLife(playAfterlife(state, crosser(base)));
      }
    }
    for (let i = 0; i < n; i++) {
      const life = playStage3(k++, applier(stayer(base)), false);
      hunt.lives++;
      if (life.recruit) hunt.recruit++;
      if (life.hunter) hunt.entered++;
      hunt.first += life.first;
      if (life.rank > 0) hunt.promoted++;
      hunt.top = Math.max(hunt.top, life.rank);
      if (life.hunter !== (life.first === 1)) hunterFails.push(`${name}: เข้าสาย ${life.hunter} แต่การ์ดทางแรกออก ${life.first} ใบ`);
      // ตัวควบคุม: ชีวิตเดียวกันที่ปฏิเสธการ์ดรับสมัคร — ทำงานบริการแล้วต้องไม่ถูกจับเข้าสาย
      const ctl = playStage3(k - 1, decliner(stayer(base)), true);
      hunt.ctlLives++;
      if (ctl.service) hunt.ctlService++;
      if (ctl.hunter || ctl.first) hunt.ctlHunter++;
    }
  }
  if (hunt.low || hunt.lowRecruit) hunterFails.push(`ชีวิตขั้น 0–1 เข้าสายนักล่า ${hunt.low} · เจอการ์ดรับสมัคร ${hunt.lowRecruit}`);
  if (!hunt.lowService) hunterFails.push('ไม่มีชีวิตค่า 0 ที่ทำงานบริการ — ตัววัด "ไม่ถูกจับเข้าสาย" ไม่ได้วัดอะไร');
  if (!hunt.entered) hunterFails.push('ชีวิตขั้น 3 ไม่มีใครเข้าสายนักล่า');
  if (!hunt.promoted) hunterFails.push('ชีวิตขั้น 3 ในสายนักล่าไม่มีใครเลื่อนขั้น');
  if (hunt.badName) hunterFails.push(`ชื่องานบนจอของคนในสายนักล่าไม่ใช่ขั้นนักล่า ${hunt.badName} ครั้ง`);
  if (hunt.ctlHunter) hunterFails.push(`ตัวควบคุมปฏิเสธการ์ดรับสมัครแต่เข้าสายนักล่า ${hunt.ctlHunter} ชีวิต`);
  if (!hunt.ctlService) hunterFails.push('ตัวควบคุมขั้น 3 ไม่มีชีวิตทำงานบริการ — ตัววัดไม่ได้วัดอะไร');
  console.log(`\nสายนักล่า (ใบ 19): ขั้น 0–1 ${hunt.lowLives} ชีวิต เข้าสาย ${hunt.low} การ์ดรับสมัคร ${hunt.lowRecruit} · ค่า 0 ทำงานบริการ ${hunt.lowService} ชีวิต`);
  console.log(`  ขั้น 3 (ยืมเกณฑ์) ${hunt.lives} ชีวิต: เจอการ์ดรับสมัคร ${pct(hunt.recruit, hunt.lives)} · เข้าสาย ${hunt.entered} · ทางแรก ${hunt.first} ใบ · เลื่อนขั้น ${hunt.promoted} · ขั้นสูงสุด ${hunt.top} · ชื่อผิด ${hunt.badName} · ตัวอย่าง ${hunt.show || '-'}`);
  console.log(`  ตัวควบคุมปฏิเสธ ${hunt.ctlLives} ชีวิต: ทำงานบริการ ${hunt.ctlService} · เข้าสาย ${hunt.ctlHunter}`);
  if (hunterFails.length) {
    for (const f of hunterFails) console.log(`✗ ${f}`);
    console.log(`ด่านสายนักล่าตก ${hunterFails.length} ข้อ`);
    process.exitCode = 1;
  } else console.log('ด่านสายนักล่าผ่าน');
}

// (11) ดันเจียนไทย (ใบ 21): ขั้น 3 เจอดันเจียน 2–3 ใบต่อรอบ · คนถูกดึง (ไม่ใช่นักล่า) ตายในดันเจียน 0 · นักล่าตายได้จริงด้วยกลุ่มสาเหตุเดิม · ค่าซ้อนไม่ขยับจากดันเจียน
// id ใบและสาเหตุเขียนจากสเปก (decisions 52 53 79) ไม่อ่านจาก content · บล็อกแยกท้ายไฟล์แบบ (10) · ยืมเกณฑ์ขั้น 2–3 เฉพาะช่วงนัดและเล่นชีวิตนั้น
{
  const { OVERLAP_STAGE_MIN } = await import('../src/engine/index.mjs');
  const RECRUIT = 'overlap_hunter_recruit_01';
  const ENTRIES = ['overlap_dungeon_01', 'overlap_dungeon_02', 'overlap_dungeon_03', 'overlap_dungeon_04'];
  const INNER = ['dungeon_hunt_mid_01', 'dungeon_hunt_boss_01', 'dungeon_pull_mid_01', 'dungeon_pull_out_01'];
  const CAUSES = ['accident', 'assault'];
  const isDungeon = (id) => ENTRIES.includes(id) || INNER.includes(id);
  // ตัวเลือกที่พาไปใบถัดไปของรอบ (สเปกใบ 21 ข้อ 3) — โรคที่ถึงคิวต้องไม่ตัดรอบตรงนี้ · ทางอื่นของใบเหล่านี้คือจบรอบ
  const CONTINUE = { ...Object.fromEntries(ENTRIES.map((id) => [id, ['hunt', 'pulled']])), dungeon_hunt_mid_01: ['push_on', 'leave_behind'], dungeon_pull_mid_01: ['hide', 'help_stranger'] };
  const BOSS = 'dungeon_hunt_boss_01';
  const midRun = (s) => {
    const l = s.log.findLast((x) => isDungeon(x.id));
    const cid = l && content.events.find((e) => e.id === l.id)?.choices[l.choice]?.id;
    return Boolean(l && CONTINUE[l.id]?.includes(cid));
  };
  const dunFails = [];
  // นักล่า: สมัครเสมอ แล้วเลือกนำทีมทุกครั้งที่เปิด (ตัวเลือกแรกของใบเข้า) · ใบกลาง/บอสเลือกตามบุคลิก = นักล่ากลาง
  const hunterBot = (bot) => Object.assign((card, rng, h) => ((card.id === RECRUIT || ENTRIES.includes(card.id)) && open(card, 0) ? 0 : bot(card, rng, h)), bot);
  // คนทั่วไป: ไม่สมัครนักล่าเลย (ตัวเลือกสุดท้ายของใบรับสมัคร) ⇒ ทางเดียวที่เข้าดันเจียนคือถูกดึง
  const civBot = (bot) => Object.assign((card, rng, h) => (card.id === RECRUIT ? card.choices.length - 1 : bot(card, rng, h)), bot);
  const tally = () => ({ lives: 0, withRun: 0, runs: 0, avoided: 0, badLen: 0, lens: [0, 0, 0, 0], deaths: 0, direct: 0, illDuring: 0, illEnd: 0, badCause: 0, ovMoved: 0, ages: [] });
  const hun = tally();
  const civ = tally();
  const low = { lives: 0, cards: 0 };
  const watch = (t, life) => (card, s) => {
    // ผลสั่งตายตั้ง dead ก่อนการ์ดผลของมันขึ้นจอ ⇒ เห็น dead ครั้งแรกบนการ์ดผลขณะรอบยังเปิด = ตายในดันเจียน
    // ตายขอบปีหลังรอบจบ ใบแรกที่เห็นคืองานศพ/มรณบัตร ไม่ใช่การ์ดผล — ไม่นับ
    // สุขภาพหมดอยู่ก่อนเปิดใบ (โรคที่นัดตายไว้) = ไม่ใช่ดันเจียนฆ่า — แยกนับ ไม่เข้าเกณฑ์ "ถูกดึงตาย 0" · ตายบนตัวเลือกที่ยังมีใบต่อ = ตัดรอบกลางทาง (ต้อง 0)
    if (s.dead && !life.deadSeen) {
      life.deadSeen = true;
      if (life.run && card.kind === 'result' && life.hp <= 0) t[midRun(s) ? 'illDuring' : 'illEnd']++;
      else if (life.run && card.kind === 'result') {
        t.deaths++;
        // สุขภาพยังเหลือตอนตาย = ทางตายของการ์ดสั่ง (die) · หมดแล้ว = บาดแผลทางอื่นของตัวเลือกเดียวกัน
        if (s.health > 0) t.direct++;
        if (!CAUSES.includes(s.cause)) t.badCause++;
      }
    }
    if (card.kind === 'result') return;
    if (life.run && !INNER.includes(card.id)) close(t, life, s);
    if (ENTRIES.includes(card.id)) life.run = { len: 1, ov: overlapOf(s) };
    else if (life.run && INNER.includes(card.id)) life.run.len++;
    life.hp = s.health;
  };
  const close = (t, life, s) => {
    if (overlapOf(s) !== life.run.ov) t.ovMoved++;
    // จบที่ใบเข้า = กดส่งต่อ/หลบ ไม่ได้เข้าดันเจียน — ไม่นับเป็นรอบ
    if (life.run.len === 1) t.avoided++;
    else {
      t.runs++;
      t.lens[Math.min(life.run.len, 3)]++;
      if (life.run.len > 3) t.badLen++;
      life.runs++;
    }
    life.run = null;
  };
  const stage3 = (k, salt, bot, hunter, onCard) => {
    const keep = [OVERLAP_STAGE_MIN[2], OVERLAP_STAGE_MIN[3]];
    OVERLAP_STAGE_MIN[2] = 2;
    OVERLAP_STAGE_MIN[3] = 3;
    try {
      const s = newLife(mixSeed(seed ^ salt, k), content);
      s.overlap = 3;
      // การ์ดรับสมัครออกแค่บางชีวิต (กินช่องโควตาเดียวกัน) ⇒ วัดอัตราตายต่อรอบด้วยบัตรนักล่าตั้งแต่เกิด
      if (hunter) s.flags.hunter = true;
      overlapPlan(s, 0);
      return playLife(mixSeed(seed ^ salt, k), content, bot, onCard, s).state;
    } finally {
      [OVERLAP_STAGE_MIN[2], OVERLAP_STAGE_MIN[3]] = keep;
    }
  };
  const playStage3 = (k, bot, t, hunter) => {
    const life = { run: null, deadSeen: false, runs: 0 };
    const state = stage3(k, 0x4e21, bot, hunter, watch(t, life));
    if (life.run) close(t, life, state);
    t.lives++;
    if (life.runs) t.withRun++;
    t.ages.push(state.age);
  };
  // ชุดบังคับ: ฐานธรรมชาติมีโรคถึงคิวกลางรอบแค่หลักหน่วย ⇒ ตั้งสุขภาพ 0 ตอนใบเข้าใบแรกขึ้นจอ (ก่อนกด) ให้ได้เคสพอวัด · อยู่ในด่านเท่านั้น
  // ห้องบอส ตัวเลือกที่มีทางตายแต่ผลออกทางไม่ตาย: แกนทอยสาเหตุจากตารางโรคตามอายุ (บาดเจ็บออกได้ตามสัดส่วนจริง) ⇒ ใช้บาดแผลของตัวเลือกแทน = บาดเจ็บทุกครั้ง
  // ทางถอยไม่มีทางตายให้ยืมบาดแผลอยู่แล้ว — นับรวมจะผ่านแม้แกนยังใช้บาดแผล
  const SICK = { hunter: 3, civ: 1 };
  const sick = { forced: 0, mid: 0, end: 0, preBossInjury: 0, boss: 0, bossIll: 0 };
  const bossChoices = content.events.find((e) => e.id === BOSS).choices;
  const dieTexts = (c) => (c?.outcomes ?? []).filter((o) => o.effects?.die).map((o) => o.text);
  const sickWatch = (life) => (card, s) => {
    if (card.kind !== 'result' && !life.forced && ENTRIES.includes(card.id)) {
      s.health = 0;
      life.forced = true;
      sick.forced++;
    } else if (card.kind === 'event' && life.forced && !s.dead && !isDungeon(card.id)) life.out = true;
    if (!s.dead || life.deadSeen || !life.forced) return;
    life.deadSeen = true;
    // รอดความตายท้ายรอบแล้วไปตายทีหลัง ไม่ใช่เรื่องของรอบนี้ · ตัวเลือกจบรอบที่ไม่มีผลสุ่ม ใบแรกหลังตายคืองานศพ ไม่ใช่การ์ดผล
    if (life.out) return;
    if (midRun(s)) return void sick.mid++;
    sick.end++;
    const l = s.log.findLast((x) => isDungeon(x.id));
    const die = l.id === BOSS ? dieTexts(bossChoices[l.choice]) : [];
    if (l.id !== BOSS) sick.preBossInjury += CAUSES.includes(s.cause) ? 1 : 0;
    else if (die.length && !(card.kind === 'result' && die.some((x) => card.text.includes(x)))) {
      sick.boss++;
      if (!CAUSES.includes(s.cause)) sick.bossIll++;
    }
  };
  let k = 0;
  let ks = 0;
  for (const [name, base] of Object.entries(BOTS)) {
    // ขั้นจริง 0–1: ตระกูลข้ามโลกหลายรุ่น ใบดันเจียนต้องไม่โผล่สักใบ
    for (let i = 0; i < n; i++) {
      let st;
      for (let g = 0; g < gens; g++) {
        const { state } = playLife(mixSeed(seed ^ 0x4e22, i * 7919 + g), content, crosser(base), (card) => isDungeon(card.id) && low.cards++, st ?? undefined);
        low.lives++;
        st = nextLife(playAfterlife(state, crosser(base)));
      }
    }
    for (let i = 0; i < n; i++) {
      playStage3(k, hunterBot(stayer(base)), hun, true);
      playStage3(k++, civBot(stayer(base)), civ, false);
    }
    for (let i = 0; i < SICK.hunter + SICK.civ; i++) {
      const hunter = i < SICK.hunter;
      // นักล่าชุดนี้บุกตรง (ตัวเลือกแรกของใบกลาง/บอส = ไปต่อ · บุกเต็มกำลัง) ให้ถึงห้องบอสบนตัวเลือกที่มีทางตายทุกคน
      const bot = hunter ? Object.assign((card, rng, h) => (INNER.includes(card.id) && open(card, 0) ? 0 : hunterBot(stayer(base))(card, rng, h)), base) : civBot(stayer(base));
      stage3(ks++, 0x4e23, bot, hunter, sickWatch({ forced: false, deadSeen: false, out: false }));
    }
  }
  const p50 = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] ?? '-';
  if (low.cards) dunFails.push(`ชีวิตขั้น 0–1 เจอใบดันเจียน ${low.cards} ใบ`);
  if (!civ.runs || !hun.runs) dunFails.push(`ขั้น 3 ไม่มีรอบดันเจียน (คนทั่วไป ${civ.runs} · นักล่า ${hun.runs})`);
  if (civ.deaths) dunFails.push(`คนถูกดึงตายในดันเจียน ${civ.deaths} ครั้ง — ต้อง 0`);
  // ตัววัดคนตายต้องจับได้จริง: นักล่าที่เข้าห้องบอสหลายร้อยรอบต้องมีคนตาย ไม่งั้น 0 ข้างบนไม่ได้แปลว่าปลอดภัย
  if (!hun.deaths) dunFails.push('นักล่าไม่ตายในดันเจียนเลย — ตัววัดคนตายไม่ได้วัดอะไร');
  if (!hun.direct) dunFails.push(`นักล่าตาย ${hun.deaths} ครั้งแต่ไม่มีจากทางตายของการ์ด (die) เลย — ผลสั่งตายไม่ทำงาน`);
  if (hun.badCause || civ.badCause) dunFails.push(`ตายในดันเจียนด้วยสาเหตุนอก ${CAUSES.join('/')} ${hun.badCause + civ.badCause} ครั้ง`);
  if (hun.badLen || civ.badLen) dunFails.push(`รอบดันเจียนยาวเกิน 3 ใบ: นักล่า ${hun.badLen} · คนทั่วไป ${civ.badLen}`);
  if (!hun.lens[2] || !hun.lens[3]) dunFails.push(`รอบนักล่าไม่ครบทั้งแบบ 2 ใบ (${hun.lens[2]}) และ 3 ใบ (${hun.lens[3]})`);
  if (hun.ovMoved || civ.ovMoved) dunFails.push(`ค่าซ้อนขยับระหว่างรอบดันเจียน ${hun.ovMoved + civ.ovMoved} รอบ`);
  if (hun.illDuring || civ.illDuring || sick.mid) dunFails.push(`โรคถึงคิวตัดรอบกลางทาง: นักล่า ${hun.illDuring} · คนทั่วไป ${civ.illDuring} · ชุดบังคับ ${sick.mid} — ต้องเดินจนจบรอบก่อน`);
  if (!sick.end) dunFails.push(`ชุดบังคับ ${sick.forced} ชีวิตไม่มีใครตายท้ายรอบ — ตัววัดไม่ได้วัดอะไร`);
  if (!sick.boss) dunFails.push('ชุดบังคับไม่มีคนป่วยถึงห้องบอสทางไม่ตาย — วัดสาเหตุใบสุดท้ายไม่ได้');
  else if (!sick.bossIll) dunFails.push(`คนป่วยที่ห้องบอส ${sick.boss} คนตายด้วยบาดเจ็บทุกคน — ใบสุดท้ายต้องลงโรค ไม่ใช่บาดแผลของตัวเลือก`);
  const line = (label, t) => `  ${label} ${t.lives} ชีวิต: มีดันเจียน ${pct(t.withRun, t.lives)} · ${t.runs} รอบ (${(t.runs / (t.lives || 1)).toFixed(2)}/ชีวิต) ยาว 2 ใบ ${t.lens[2]} · 3 ใบ ${t.lens[3]} · หลบ/ส่งต่อ ${t.avoided} · ตายในดันเจียน ${t.deaths} (${pct(t.deaths, t.runs)}/รอบ · ทางตายตรง ${t.direct}) · โรคถึงคิวกลางรอบ ${t.illDuring} · ท้ายรอบ ${t.illEnd} · ค่าซ้อนขยับ ${t.ovMoved} · อายุตาย p50 ${p50(t.ages)}`;
  console.log(`\nดันเจียนไทย (ใบ 21): ขั้น 0–1 ${low.lives} ชีวิต ใบดันเจียน ${low.cards}`);
  console.log(line('นักล่า (ยืมขั้น 3 · บัตรตั้งแต่เกิด)', hun));
  console.log(line('คนทั่วไป (ยืมขั้น 3)', civ));
  console.log(`  ชุดบังคับสุขภาพ 0 ก่อนใบเข้า ${sick.forced} ชีวิต: ตายกลางรอบ ${sick.mid} · ท้ายรอบ ${sick.end} (ก่อนบอสลงบาดเจ็บตามตาราง ${sick.preBossInjury}) · ห้องบอสทางไม่ตาย ${sick.boss} ลงโรค ${sick.bossIll}`);
  if (dunFails.length) {
    for (const f of dunFails) console.log(`✗ ${f}`);
    console.log(`ด่านดันเจียนตก ${dunFails.length} ข้อ`);
    process.exitCode = 1;
  } else console.log('ด่านดันเจียนผ่าน');
}

// (12) โซ่ซ้อนทับทุกใบ: full ข้ามโซ่นี้ที่ด่าน 2 (reachChain ใน gates.mjs ตัวเดียวกัน) ⇒ ทุกใบต้องออก ทุกตัวเลือกในโซ่ต้องกดได้จริงที่นี่
// ใบใหม่ที่กั้นด้วยขั้นซ้อนทับเข้าด่านนี้เอง ไม่มีลิสต์มือ · ขั้น 2–4 ยังเป็น ∞ ⇒ ยืมเกณฑ์ขั้น = ค่า แบบ (10)(11) เฉพาะช่วงเล่น
// ชีวิตละขั้นวน 1–4 · บอทกดตัวเลือกในโซ่ที่ยังไม่เคยกดก่อน · ครึ่งหนึ่งไล่ตั้งของโซ่ (สมัครนักล่า) อีกครึ่งเลี่ยง (ทางคนทั่วไปถูกดึง)
{
  const { OVERLAP_STAGE_MIN } = await import('../src/engine/index.mjs');
  const { reachChain, CHAIN_ROOTS } = await import('./gates.mjs');
  const chain = reachChain(content.events, CHAIN_ROOTS.overlap);
  const want = new Set([...chain.events, ...chain.choices]);
  const hit = new Set();
  const setsOwn = (c) => [c, ...[].concat(c.outcomes ?? [])].some((x) => (x?.sets_flags ?? []).some((f) => chain.flags.has(f)));
  const chase = (greedy) => (card, rng, h) => {
    const ev = h.pending;
    if (ev?.id !== card.id || ev.choices?.length !== card.choices.length) return BOTS.สุ่ม(card, rng, h);
    const key = (k) => `${ev.id}#${ev.choices[k].id ?? k}`;
    const ks = card.choices.map((_, k) => k).filter((k) => open(card, k));
    const fresh = ks.filter((k) => chain.choices.has(key(k)) && !hit.has(key(k)));
    const side = ks.filter((k) => setsOwn(ev.choices[k]) === greedy);
    const j = fresh.length ? fresh[rng.int(0, fresh.length - 1)] : side.length && (greedy || chain.events.has(ev.id)) ? side[rng.int(0, side.length - 1)] : BOTS.สุ่ม(card, rng, h);
    if (chain.choices.has(key(j))) hit.add(key(j));
    return j;
  };
  const LIMIT = 400;
  let lives = 0;
  const keep = OVERLAP_STAGE_MIN.slice();
  try {
    for (let k = 2; k < OVERLAP_STAGE_MIN.length; k++) OVERLAP_STAGE_MIN[k] = k;
    for (let i = 0; i < LIMIT && [...want].some((x) => !hit.has(x)); i++) {
      const s = newLife(mixSeed(seed ^ 0x0c12, i), content);
      s.overlap = 1 + (i % 4);
      overlapPlan(s, 0);
      lives++;
      playLife(mixSeed(seed ^ 0x0c12, i), content, chase(((i >> 2) & 1) === 0), (card) => { if (want.has(card.id)) hit.add(card.id); }, s);
    }
  } finally {
    keep.forEach((v, k) => { OVERLAP_STAGE_MIN[k] = v; });
  }
  const miss = [...want].filter((x) => !hit.has(x));
  console.log(`\nโซ่ซ้อนทับ (reachChain · ตัวที่ full ข้าม): ราก ${chain.roots.size} ใบ · ทั้งโซ่ ${chain.events.size} ใบ ${chain.choices.size} ตัวเลือก · ธง ${[...chain.flags].join(' ') || '-'} · ยืมขั้น 1–4 ${lives} ชีวิต · ไม่เคยถึง ${miss.length}${miss.length ? `: ${miss.join(' ')}` : ''}`);
  if (!chain.roots.size) console.log('  (ยังไม่มีใบที่กั้นด้วยขั้นซ้อนทับ)');
  if (miss.length) {
    console.log(`✗ โซ่ซ้อนทับมีของที่ไม่เคยถึง ${miss.length} ตัว`);
    process.exitCode = 1;
  } else console.log('ด่านโซ่ซ้อนทับผ่าน');
}
