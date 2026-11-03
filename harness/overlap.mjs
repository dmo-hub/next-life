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
//   (8) คนตายที่ตระกูลจำ (ใบ 13): ทายาทค่า > 0 = รายชื่อเดิม + คนตายของชาตินี้ที่ด่านนับเอง (พ่อแม่ที่ไม่ใช่ผู้เล่นรุ่นก่อน · คนใน kin ยกเว้นฝูงสัตว์)
//       ทายาทค่า 0 ไม่มีช่อง · ฟิลด์ครบชุด ไม่มีปีตาย/ภูมิ · รายชื่อติดถึงชีวิตถัดไป · ฝั่งข้ามโลกมีรายชื่อ > 0 · ตัวควบคุมไม่มีเลย
//       พิมพ์จำนวนเฉลี่ยต่อรุ่น + ขนาดเซฟรุ่นสุดท้าย (วัดเพดาน localStorage ที่ --gens สูง)
//   (9) ผีทั่วไป (ใบ 25): ฝั่งข้ามโลกออก > 0 · ไม่ออกในชีวิตขั้น 0 · ตัวควบคุมออก 0 · ตัวเลือกทานดันบัญชีทานขึ้นอย่างน้อยระดับ 1 ก่อนการ์ดถัดไป
//       ต้องมีคนเลือกทานจริง > 0 ครั้ง ไม่งั้นตัววัดบัญชีไม่ได้วัดอะไร
import { playLife, playAfterlife, nextLife, newLife, mixSeed, overlapOf, overlapStageOf, snapshot, PATHS, ENTRY } from '../src/engine/index.mjs';
import { MERIT_LEVELS, meritId } from '../src/engine/merit.mjs';
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

const GHOST = 'overlap_ghost_';
const danaPicks = new Map(content.events.filter((e) => e.id.startsWith(GHOST)).map((e) => [e.id, new Set(e.choices.flatMap((c, k) => (c.merit.some((m) => meritId(m.cat) === 'dana') ? [k] : [])))]));
// บัญชีทานอ่านก่อนการ์ดผีแล้วเทียบตอนการ์ดถัดไป (ตัวเลือกลงบัญชีระหว่างสองจังหวะนี้) — ตัวเลือกอื่นไม่ตรวจ เพราะทานจากที่อื่นขึ้นช่วงเดียวกันได้
const watchGhost = (r) => {
  let wait = null;
  return (card, st) => {
    if (wait) {
      const pick = st.log.slice(wait.at).find((e) => e.id === wait.id);
      if (pick && danaPicks.get(wait.id).has(pick.choice)) {
        r.ghostDana++;
        if ((st.ledger.byCat.dana ?? 0) - wait.dana < MERIT_LEVELS[1]) r.ghostDanaBad++;
      }
      wait = null;
    }
    if (!card.id?.startsWith(GHOST)) return;
    r.ghost++;
    if (overlapStageOf(st) < 1) r.ghostBad++;
    wait = { id: card.id, at: st.log.length, dana: st.ledger.byCat.dana ?? 0 };
  };
};

const DEAD_KEYS = 'bond,cause,gen,name,role';
const deadHere = (s) => s.parents.filter((p) => !p.alive && !p.ancestor).length + (s.kin ?? []).filter((m) => !m.alive && m.role !== 'herd').length;
const deadOf = (s) => s?.deadKin?.length ?? 0;
const P_CHILD = PATHS.findIndex((p) => p.id === 'child');
const kidPath = (bot) => (card, rng, h) => (card.kind === 'path' && !card.locked?.[P_CHILD] && P_CHILD < card.choices.length ? P_CHILD : bot(card, rng, h));

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
    const r = { name, mode, byGen: Array.from({ length: gens }, () => []), born: 0, trip: 0, lost: 0, reTrip: 0, reBorn: 0, chain: 0, rumor: 0, bad: 0, drop: 0, families: 0, top: 0, iskLives: 0, iskStage: {}, iskBad: 0, iskCard: 0, iskCardBad: 0, deadByGen: Array.from({ length: gens }, () => []), deadBad: 0, deadMax: 0, kidAncestor: 0, saveBytes: [], deadBytes: [], ghost: 0, ghostBad: 0, ghostDana: 0, ghostDanaBad: 0 };
    rows.push(r);
    const watch = watchIsekai(r);
    const ghost = watchGhost(r);
    for (let i = 0; i < n; i++) {
      let st = null;
      let prev = 0;
      let left = false;
      let last = null;
      for (let g = 0; g < gens; g++) {
        const start = overlapOf(st);
        const { state } = playLife(mixSeed(seed, i * 7919 + g), content, bot, (card, s) => (watch(card, s.trip, s), ghost(card, s)), st ?? undefined);
        const home = (state.trips ?? []).filter((t) => t.home).length;
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
        r.deadByGen[g].push(deadOf(state));
        if (g === gens - 1) {
          last = state;
          if (v > 0) {
            r.saveBytes.push(snapshot(state, content).length);
            r.deadBytes.push(JSON.stringify(state.deadKin ?? []).length);
          }
          break;
        }
        const af = playAfterlife(state, bot, (card, a) => watch(card, a.isekai, a.st));
        const back = af.isekaiLives.length ? 1 : 0;
        const reBorn = back && left ? 1 : 0;
        if (back) left = true;
        r.born += back;
        r.reBorn += reBorn;
        if (af.isekaiLives.length > 1) r.chain++;
        if (overlapOf(af.heir) - v !== back + reBorn) r.bad++;
        const want = overlapOf(af.heir) ? deadOf(state) + deadHere(state) : 0;
        const list = af.heir.deadKin ?? [];
        if (list.length !== want || (!want && 'deadKin' in af.heir)) r.deadBad++;
        if (list.some((d) => Object.keys(d).sort().join() !== DEAD_KEYS)) r.deadBad++;
        r.deadMax = Math.max(r.deadMax, list.length);
        st = nextLife(af);
        if (overlapOf(st) !== overlapOf(af.heir)) r.bad++;
        if (deadOf(st) !== list.length) r.deadBad++;
      }
      if (prev > 0) {
        r.families++;
        r.top = Math.max(r.top, prev);
        // เริ่มตระกูลใหม่หลังตระกูลที่ค่าสูง — ไม่มี heir จึงต้องเป็น 0 และไม่มีช่อง overlap ในสถานะ
        const fresh = newLife(mixSeed(seed ^ 0x0e1a9, i), content);
        resetChecked++;
        if (overlapOf(fresh) !== 0 || 'overlap' in fresh) fail(`${name}: เริ่มตระกูลใหม่ได้ค่า ${overlapOf(fresh)}`);
        // ฝั่งข้ามไม่เคยเลือกทางเป็นลูก ⇒ ต่ออีกไม่เกิน 3 รุ่นทางเป็นลูก ให้มีพ่อ/แม่ที่เป็นผู้เล่นรุ่นก่อนตายอยู่ในชาติที่ค่า > 0 (ต้องไม่ถูกจำ)
        if (mode === 'ข้าม') {
          let s = last;
          for (let k = 0; k < 3; k++) {
            const af = playAfterlife(s, kidPath(base));
            if (s.parents.some((p) => p.ancestor && !p.alive)) r.kidAncestor++;
            if ((af.heir.deadKin?.length ?? 0) !== deadOf(s) + deadHere(s)) r.deadBad++;
            if (af.path !== 'child') break;
            ({ state: s } = playLife(mixSeed(seed, i * 7919 + gens + k), content, base, undefined, nextLife(af)));
          }
        }
      }
    }
    if (r.bad) fail(`${name} ${mode}: บัญชีเหยียบซ้ำไม่ตรง ${r.bad} จุด`);
    if (r.drop) fail(`${name} ${mode}: ค่าลดระหว่างรุ่น ${r.drop} ตระกูล`);
    if (mode === 'ไม่ข้าม' && r.byGen.some((vs) => vs.some((v) => v !== 0))) fail(`${name} ไม่ข้าม: ค่าไม่เป็น 0`);
    if (mode === 'ไม่ข้าม' && r.rumor) fail(`${name} ไม่ข้าม: การ์ดข่าวลือออก ${r.rumor} ครั้ง`);
    if (r.iskBad) fail(`${name} ${mode}: ชาติต่างโลกเห็นขั้นไม่ตรงขั้นตระกูลตอนข้าม ${r.iskBad} ชาติ`);
    if (r.iskCardBad) fail(`${name} ${mode}: การ์ด ${ISK_CARD}* ออกในชาติต่างโลกขั้น 0 ${r.iskCardBad} ครั้ง`);
    if (mode === 'ไม่ข้าม' && r.iskCard) fail(`${name} ไม่ข้าม: การ์ด ${ISK_CARD}* ออก ${r.iskCard} ครั้ง`);
    if (r.deadBad) fail(`${name} ${mode}: รายชื่อคนตายไม่ตรง ${r.deadBad} จุด`);
    if (mode === 'ไม่ข้าม' && r.deadMax) fail(`${name} ไม่ข้าม: มีรายชื่อคนตาย ${r.deadMax} คน`);
    if (r.ghostBad) fail(`${name} ${mode}: การ์ด ${GHOST}* ออกในชีวิตขั้น 0 ${r.ghostBad} ครั้ง`);
    if (mode === 'ไม่ข้าม' && r.ghost) fail(`${name} ไม่ข้าม: การ์ด ${GHOST}* ออก ${r.ghost} ครั้ง`);
    if (r.ghostDanaBad) fail(`${name} ${mode}: เลือกทำบุญให้ผีแล้วบัญชีทานไม่ขึ้นระดับ 1 ${r.ghostDanaBad} ครั้ง`);
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
if (!cross.some((r) => r.deadMax)) fail('ฝั่งข้ามโลกไม่มีตระกูลไหนจำคนตายได้ — ตัววัดรายชื่อไม่ได้วัดอะไร');
if (!sum('ghost')) fail(`ฝั่งข้ามโลกไม่มีการ์ด ${GHOST}* ออกเลย`);
if (!sum('ghostDana')) fail('ไม่มีใครเลือกทำบุญให้ผีทั่วไป — ตัววัดบัญชีทานไม่ได้วัดอะไร');
if (!sum('kidAncestor')) fail('ไม่มีชาติค่า > 0 ที่พ่อ/แม่ผู้เล่นรุ่นก่อนตาย — ตัววัด "ไม่จำชาติก่อนของตัวเอง" ไม่ได้วัดอะไร');

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
const deadGen = Array.from({ length: gens }, (_, g) => {
  const cs = cross.flatMap((r) => r.deadByGen[g]);
  const vs = cross.flatMap((r) => r.byGen[g]);
  const on = cs.filter((_, k) => vs[k] > 0);
  const off = cs.filter((_, k) => vs[k] === 0);
  return `รุ่น ${g + 1} ค่า>0 ${mean(on).toFixed(1)} คน (${on.length} ตระกูล) · ค่า 0 ${mean(off).toFixed(1)}`;
});
console.log(`คนตายที่ตระกูลจำ (ฝั่งข้ามโลก เฉลี่ยตอนจบชีวิต · ตัวควบคุมสูงสุด ${Math.max(...rows.filter((r) => r.mode === 'ไม่ข้าม').map((r) => r.deadMax))} · ต่อทางเป็นลูกที่พ่อ/แม่รุ่นก่อนตาย ${sum('kidAncestor')} ชาติ ไม่ถูกจำ):${deadGen.join(' | ')}`);
console.log(`ผีทั่วไป (${GHOST}*): ข้าม ${sum('ghost')} ครั้ง · ออกในชีวิตขั้น 0 ${rows.reduce((s, r) => s + r.ghostBad, 0)} · ไม่ข้าม ${rows.filter((r) => r.mode === 'ไม่ข้าม').reduce((s, r) => s + r.ghost, 0)} · เลือกทำบุญ ${sum('ghostDana')} ครั้ง ทานไม่ขึ้น ${rows.reduce((s, r) => s + r.ghostDanaBad, 0)}`);
const saves = cross.flatMap((r) => r.saveBytes);
const deads = cross.flatMap((r) => r.deadBytes);
const kb = (b) => `${(b / 1024).toFixed(1)} KB`;
if (saves.length) console.log(`ขนาดเซฟรุ่น ${gens} (ตระกูลค่า > 0 ${saves.length} ตระกูล): เฉลี่ย ${kb(mean(saves))} · สูงสุด ${kb(Math.max(...saves))} · ส่วนรายชื่อคนตาย เฉลี่ย ${kb(mean(deads))} สูงสุด ${kb(Math.max(...deads))} · รายชื่อยาวสุด ${Math.max(...cross.map((r) => r.deadMax))} คน`);
if (fails.length) {
  for (const f of fails) console.log(`✗ ${f}`);
  console.log(`ด่านค่าซ้อนทับตก ${fails.length} ข้อ`);
  process.exitCode = 1;
} else {
  console.log(`ด่านค่าซ้อนทับผ่าน: บัญชีเหยียบซ้ำตรงทุกชีวิต · เกิดกลับ ${sum('born')} · ทริปกลับบ้าน ${sum('trip')} · เข้าซ้ำ ทริป ${sum('reTrip')} เกิด ${sum('reBorn')} · ทริปหลงไม่นับ ${sum('lost')} · ข่าวลือออก ${sum('rumor')} · ชาติต่างโลกเห็นขั้นตรง ${sum('iskLives')} ชาติ · การ์ดต่างโลกขั้น ≥ 1 ออก ${sum('iskCard')} · ผีทั่วไปออก ${sum('ghost')} ทำบุญ ${sum('ghostDana')} · ค่าไม่ลด · ตัวควบคุม = 0`);
}
