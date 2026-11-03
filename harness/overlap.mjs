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
