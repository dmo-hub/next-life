// ช่วงระหว่างชาติ (ใบ 05 · 09) + ส่งต่อรุ่นถัดไป — ลำดับตามใบ 09:
// บันทึกการตาย → ส่วนบุญ/อนุโมทนา → เทวทูต 5 → ศาลพญายมเปิดบัญชีชี้ปลายทาง → ทางเกิด → ภูมิปลายทาง หรือ ผีบรรพบุรุษ → ส่งต่อ 30–70% → รุ่นถัดไป
// ฉากเป็นเนื้อหา (stage ระหว่างชาติ + scene) ผ่านด่าน build ชุดเดียวกับการ์ดชีวิต · ศาล/ทางเกิด/ส่งต่อเป็นการ์ดที่แกนสร้าง
// ใช้ stream สุ่มของตัวเอง — ระหว่างชาติไม่กินเลขสุ่มของโลกของชีวิตใด · ชีวิตที่มี heir ดึงเลขสุ่มของโลกตำแหน่งเดียวกับชีวิตแรก (harness/lineage ตรวจ)
import { makeRng, mixSeed } from './rng.mjs';
import { pickBirthYear } from './era.mjs';
import { pickRegion, nationalIncome } from './birth.mjs';
import { newLedger, recordMerit, netLedger, SIN_CATS } from './merit.mjs';
import { newLife, CLASSES, STAT_KEYS, STAT_LABELS, levelValue, whenOk, poolMultiplier, fill, reckoning, weighted, AFTERLIFE_STAGE } from './life.mjs';

// ระดับกรรมที่ศาล (−1..1) = บัญชีสุทธิ ÷ ref · ref แยกจากตัวคูณกรรมระหว่างชีวิต (KARMA.ref) เพราะบัญชีทั้งชีวิตสะสมไกลกว่า
// จุดอิ่มของตัวคูณการตายมาก — ใช้ ref เดียวกันแล้วเกือบทุกคนชนเพดาน ภูมิกับฐานะชาติหน้าจะไม่แยกคน
export const VERDICT_REF = 30;
export const verdictLevel = (ledger) => Math.max(-1, Math.min(1, netLedger(ledger) / VERDICT_REF));
// ภูมิปลายทาง (lore-afterlife หัวข้อ 2 ชุดที่เกมออกแบบเอง) ชี้จากบัญชีสุทธิ ณ ศาล — ฝ่ายใดหนักก็ไปฝ่ายนั้น
// upTo = ขอบบนของระดับกรรม · เกณฑ์เป็นค่าตั้งของเกม ไม่มีคัมภีร์ให้แปลงเป็นตัวเลข · บุญบาปเสมอ (0) ไปเกิดเป็นมนุษย์
// เทวดาตั้งสูงกว่าฝั่งบาป: เนื้อหามีทางบุญมากกว่าทางบาป บอทสุ่มจึงเอียงบวกเอง (สุทธิมัธยฐาน ~+11) — ขอบ 2/3 ให้เทวดาเหลือราวหนึ่งในสิบ
export const REALMS = [
  { id: 'hell', name: 'นรก', upTo: -0.5 },
  { id: 'peta', name: 'เปรต', upTo: -0.2 },
  { id: 'beast', name: 'ดิรัจฉาน', upTo: -0.01 },
  { id: 'human', name: 'มนุษย์', upTo: 2 / 3 },
  { id: 'deva', name: 'เทวดา', upTo: Infinity },
];
export const realmOf = (x) => REALMS.find((r) => x <= r.upTo);
// ฉากที่เนื้อหาเขียนได้ · realm/ancestor แยกตามภูมิได้ด้วย field realm
export const SCENES = ['transfer', 'devaduta', 'realm', 'ancestor'];
export const REALM_SCENES = ['realm', 'ancestor'];

// ส่งต่อข้ามชาติ (ใบ 09): ฝั่งที่ชี้ปลายทางถูกหักไปส่วนหนึ่งก่อน แล้วสุ่มส่งต่อ min–max ของที่เหลือ
export const CARRY = { spend: 0.5, min: 0.3, max: 0.7 };
// ผลกรรมต่อชาติหน้า "แรงทุกทาง" (ใบ 05 — ห้ามแก้คืน): ฐานะกับค่าเริ่มคิดจากระดับบัญชีที่ศาล
// sd = ความกว้างของฐานะเกิดใหม่รอบจุดกลางตามกรรม · childStep = ฐานะลูกเลื่อนได้สูงสุดกี่ระดับจากกรรม
// stat = ค่าเริ่มเลื่อนสูงสุดเมื่อบัญชีสุดขั้ว · bonusCap = เพดานผลรวมจากฉากระหว่างชาติต่อค่า
// kin = ทางเป็นลูกรับความสัมพันธ์/คอนเน็คชั่นของบ้านต่อ (ใบ 05) เป็นสัดส่วนของส่วนต่างจากค่ากลาง 50 ตอนพ่อแม่ตาย เพดาน bonusCap
export const FATE = { sd: 1.2, childStep: 3, stat: 10, bonusCap: 12, kin: 0.3 };
// มรดก (ใบ 05 · lore-finance-belief): แบ่งตามจำนวนลูก · ภาษีการรับมรดก 5% ส่วนที่เกิน 100 ล้าน ตั้งแต่ปีที่กฎหมายมีผล
// จำนวนลูกเป็นค่าตั้งของเกม — ธง has_kids ไม่ได้บอกว่ากี่คน
export const LEGACY = { kids: 2, taxFrom: 100e6, tax: 0.05, taxYear: 2559, richUnits: [10, 40] };

const clampIdx = (i) => Math.max(0, Math.min(CLASSES.length - 1, i));
const gauss = (rng) => Math.sqrt(-2 * Math.log(1 - rng.next())) * Math.cos(2 * Math.PI * rng.next());

export function startAfterlife(st) {
  if (!st.dead) throw new Error('ยังไม่ตาย เข้าระหว่างชาติไม่ได้');
  return {
    st,
    rng: makeRng(st.seed ^ 0x1b873593),
    botRng: makeRng(st.seed ^ 0x2545f491),
    steps: ['transfer', 'devaduta', 'verdict', 'path', 'scene', 'carry'],
    i: 0,
    queue: [],
    pending: null,
    bonus: {},
    verdict: null,
    path: null,
    heir: null,
    cards: 0,
  };
}

const hasKids = (st) => !!st.flags.has_kids;

// ฉากของช่วงที่ 7: เนื้อหาที่ตรงเงื่อนไขของผู้ตาย สุ่มตามน้ำหนัก · ด่าน afterlife-coverage รับประกันว่ามีใบไม่มีเงื่อนไขเสมอ
function pickScene(af, scene) {
  const realm = af.verdict?.realm.id;
  const pool = af.st.content.events.filter((e) => e.stage === AFTERLIFE_STAGE && e.scene === scene && (!e.realm || e.realm.includes(realm)) && whenOk(af.st, e.when));
  if (!pool.length) throw new Error(`ไม่มีฉาก ${scene} ที่ออกได้ (ภูมิ ${realm})`);
  return weighted(af.rng, pool, pool.map((e) => (e.weight ?? 1) * poolMultiplier(af.st, e.multipliers)));
}

// ผลของฉากระหว่างชาติต่อค่าสถานะ = ค่าเริ่มของชาติหน้า · บุญบาปไม่ขึ้นป้ายเหมือนการ์ดชีวิต
function afterFx(c) {
  const fx = Object.entries(c.effects ?? {}).filter(([k]) => STAT_KEYS.includes(k));
  const out = fx.map(([k, v]) => `ชาติหน้า ${STAT_LABELS[k]}\u00a0${v > 0 ? '↑' : '↓'}`);
  if (c.outcomes?.length) out.push('?');
  return out.join(' · ');
}

function emitAfter(af, card) {
  af.cards++;
  return { stage: AFTERLIFE_STAGE, ...card };
}

function sceneCard(af, ev) {
  af.pending = ev.choices.length ? ev : null;
  return emitAfter(af, {
    kind: 'scene',
    id: ev.id,
    type: 'B',
    scene: ev.scene,
    title: ev.title ? fill(ev.title, af.st) : null,
    text: fill(ev.text, af.st),
    choices: ev.choices.map((c) => fill(c.text, af.st)),
    fx: ev.choices.map(afterFx),
  });
}

function verdictCard(af) {
  const st = af.st;
  const x = verdictLevel(st.ledger);
  const realm = realmOf(x);
  // กำหนดเวลาในภูมิ (ใบ 02: โทษมีกำหนดเวลา) เป็นสีสันของการ์ด — เวลานรกเทียบเวลามนุษย์ไม่ได้ จึงไม่ผูกปีเกิดชาติหน้า
  const term = realm.id === 'human' ? 0 : Math.max(1, Math.round(Math.abs(netLedger(st.ledger)) * 10));
  af.verdict = { x, net: netLedger(st.ledger), realm, term };
  const where = realm.id === 'human' ? 'ไปเกิดเป็นมนุษย์ทันที ไม่ต้องรอ' : `ไปภูมิ${realm.name} กำหนด ${term} ปีของภูมินั้น`;
  return emitAfter(af, {
    kind: 'verdict',
    type: 'B',
    realm: realm.name,
    text: `เทวดาผู้ถือบัญชีชักบุญกับบาปมาดูทั้งสองฝ่าย ฝ่ายใดหนักก็ไปฝ่ายนั้น พญายมชี้ว่า${where}`,
    reckoning: reckoning(st.ledger),
    note: 'กติกาแฟนตาซีของเกม ได้แรงบันดาลใจจากไตรภูมิพระร่วงและคติไทย',
    choices: [],
  });
}

// ทางเกิด (ใบ 05): เป็นลูก (รับมรดกต่อ · ผีบรรพบุรุษเฝ้า) หรือเกิดใหม่ตามกรรม · ไม่มีลูกยังเล่นต่อได้ทางเกิดใหม่
// การ์ดนี้เป็นทางแยกของเกม ไม่ใช่เหตุการณ์ จึงมีแค่สองทาง (ยกเว้นกติกา ≥4 ตัวเลือกของเนื้อหา)
export const PATHS = [
  { id: 'child', text: 'เฝ้าลูกหลาน แล้วเกิดเป็นลูกของตัวเอง' },
  { id: 'reborn', text: 'ไปตามกรรม แล้วเกิดใหม่ที่ไหนก็ได้' },
];
function pathCard(af) {
  af.pending = { path: true, choices: PATHS.map(() => ({ merit: [] })) };
  return emitAfter(af, {
    kind: 'path',
    type: 'B',
    text: hasKids(af.st) ? 'ก่อนไปตามคำตัดสิน ดวงวิญญาณเลือกได้ว่าจะกลับไปใกล้ลูกหลาน หรือปล่อยวางแล้วไปเกิดตามกรรม' : 'ไม่มีลูกหลานให้เฝ้า ดวงวิญญาณไปเกิดตามกรรม',
    choices: PATHS.map((p) => p.text),
    locked: PATHS.map((p) => (p.id === 'child' && !hasKids(af.st) ? 'ไม่มีลูกหลานให้กลับไปเกิด' : null)),
  });
}

function carryCard(af) {
  const r = CARRY.min + af.rng.next() * (CARRY.max - CARRY.min);
  af.heir = makeHeir(af, r);
  const amount = r >= 0.55 ? 'มาก' : r >= 0.45 ? 'พอประมาณ' : 'น้อย';
  const h = af.heir;
  const who = af.path === 'child' ? 'กลับมาเกิดเป็นลูกของตัวเอง' : 'ไปเกิดใหม่';
  return emitAfter(af, {
    kind: 'carry',
    type: 'B',
    text: `ก่อนดื่มน้ำลืมชาติ พญายมแจ้งว่ากรรมที่ติดตัวไปครั้งนี้${amount} · ${who} เป็น${h.sex} ฐานะ${h.cls}`,
    lineage: lineageText(h.lineage),
    note: 'กติกาแฟนตาซีของเกม ได้แรงบันดาลใจจากไตรภูมิพระร่วงและคติไทย',
    choices: [],
    done: true,
  });
}

// ผังตระกูล (ใบ 05: เลิกเมื่อไรก็ดูได้) — หน้าจอวาดระหว่างชีวิตจาก st.lineage และบนการ์ดส่งต่อ
export const lineageText = (lineage) => lineage.map((l) => `รุ่นที่ ${l.gen} · ${l.sex} · ฐานะ${l.cls} · ตายอายุ ${l.age} · ไปภูมิ${l.realm}`);

// การ์ดถัดไปของช่วงที่ 7 · การ์ด carry (done) เป็นใบสุดท้าย แล้วผู้เรียกต่อ nextLife
export function nextAfterCard(af) {
  if (af.pending) throw new Error('ยังมีการ์ดที่รอเลือก');
  if (af.queue.length) return emitAfter(af, af.queue.shift());
  const step = af.steps[af.i++];
  if (step === 'transfer' || step === 'devaduta') return sceneCard(af, pickScene(af, step));
  if (step === 'verdict') return verdictCard(af);
  if (step === 'path') return pathCard(af);
  if (step === 'scene') return sceneCard(af, pickScene(af, af.path === 'child' ? 'ancestor' : 'realm'));
  if (step === 'carry') return carryCard(af);
  throw new Error('ระหว่างชาติจบแล้ว — ต่อด้วย nextLife');
}

function addBonus(af, fx = {}) {
  for (const k of STAT_KEYS) if (fx[k]) af.bonus[k] = Math.max(-FATE.bonusCap, Math.min(FATE.bonusCap, (af.bonus[k] ?? 0) + levelValue(fx[k])));
}

export function chooseAfter(af, idx) {
  const p = af.pending;
  if (p?.path) {
    const path = PATHS[idx];
    if (!path || (path.id === 'child' && !hasKids(af.st))) throw new Error('ตัวเลือกไม่ถูกต้อง');
    af.pending = null;
    af.path = path.id;
    return;
  }
  const c = p?.choices[idx];
  if (!c) throw new Error('ตัวเลือกไม่ถูกต้อง');
  af.pending = null;
  // บุญบาปในช่วงที่ 7 เข้าบัญชีเดิม: ก่อนศาล = เปลี่ยนคำตัดสิน · หลังศาล = เปลี่ยนส่วนที่ส่งต่อ (ใบ 09 แก้เพิ่ม)
  recordMerit(af.st.ledger, c.merit, p.id);
  addBonus(af, c.effects);
  if (!c.outcomes?.length) return;
  const o = weighted(af.rng, c.outcomes, c.outcomes.map((x) => x.weight * poolMultiplier(af.st, x.multipliers)));
  recordMerit(af.st.ledger, o.merit, p.id);
  addBonus(af, o.effects);
  if (o.text) af.queue.push({ kind: 'result', type: 'B', text: fill(o.text, af.st), choices: [] });
}

// ส่งต่อบัญชี: ฝั่งที่ชี้ปลายทางถูกหัก spend × |สุทธิที่ศาล| (ไม่ติดลบ) แล้วคูณ r ทั้งสองฝั่งและทุกหมวด
// คำบนที่ผิด (broken) ไม่ส่งต่อ — ผูกกับชีวิตที่บน
export function carryLedger(ledger, net, r) {
  const keep = { merit: ledger.merit, sin: ledger.sin };
  const side = net >= 0 ? 'merit' : 'sin';
  keep[side] = Math.max(0, keep[side] - Math.abs(net) * CARRY.spend);
  const out = newLedger();
  for (const [id, v] of Object.entries(ledger.byCat)) {
    const s = SIN_CATS.includes(id) ? 'sin' : 'merit';
    const f = ledger[s] ? keep[s] / ledger[s] : 0;
    if (v * f * r) out.byCat[id] = v * f * r;
  }
  out.merit = keep.merit * r;
  out.sin = keep.sin * r;
  return out;
}

// มรดกต่อลูกหนึ่งคน เป็นจำนวนเท่าของรายได้ครัวเรือนทั้งปีของทั้งประเทศตอนตาย — ชีวิตลูกเดินเงินเฟ้อคนละชุด (seed ต่างกัน)
// จึงส่งต่อเป็นสัดส่วนของรายได้ แล้วแปลงกลับเป็นบาทในปีที่ลูกได้รับ · ทรัพย์สุทธิติดลบ = หนี้ไม่ตกถึงลูก (ป.พ.พ. ม.1601)
export function legacyUnits(st) {
  const e = st.estate;
  if (!e || e.money <= 0) return 0;
  let share = e.money / LEGACY.kids;
  if (e.year >= LEGACY.taxYear && share > LEGACY.taxFrom) share -= (share - LEGACY.taxFrom) * LEGACY.tax;
  return share / (nationalIncome(st.content.era, st.seed, e.year) * 12);
}

// อายุตอนมีลูกคนแรก: อายุที่ธง has_kids ติด · ไม่มีบันทึก (เนื้อหาเก่า) ใช้ 28 ตามค่ากลางที่เกมตั้ง
const KID_AGE_DEFAULT = 28;

function makeHeir(af, r) {
  const st = af.st;
  const era = st.content.era;
  const { x, net, realm } = af.verdict;
  const rng = af.rng;
  const lastBirth = era.births.from + era.births.w.length - 1;
  const sex = rng.next() < 0.5 ? 'ชาย' : 'หญิง';
  let cls, region, birthYear, parents = null, legacy = null;
  if (af.path === 'child') {
    const kidAge = Math.min(st.age, st.flagAge?.has_kids ?? KID_AGE_DEFAULT);
    // ปีเกมไม่เกินปีเกิดสุดท้ายในข้อมูล — เนื้อหา/ข้อมูลยุคครอบถึงช่วงนั้น · หน้าจอไม่แสดงปีอยู่แล้ว
    birthYear = Math.min(lastBirth, st.birthYear + kidAge);
    region = { name: st.region, ses: st.ses };
    const units = legacyUnits(st);
    const rich = LEGACY.richUnits.filter((u) => units >= u).length;
    const wealth = st.estate?.money < 0 ? -1 : rich;
    cls = CLASSES[clampIdx(CLASSES.indexOf(st.cls) + wealth + Math.round(x * FATE.childStep))];
    const otherAge = st.sex === 'หญิง' ? kidAge + rng.int(0, 8) : Math.max(18, kidAge - rng.int(0, 8));
    // ผู้เล่นรุ่นก่อนตายตามชะตาเดิมของตัวเอง (diesAt) · อีกคนแก่และตายตามตารางชีพแบบพ่อแม่ทั่วไป
    parents = [
      { sex: st.sex, age: kidAge, alive: true, diesAt: st.age, ancestor: true },
      { sex: st.sex === 'ชาย' ? 'หญิง' : 'ชาย', age: otherAge, alive: true },
    ];
    legacy = { age: st.age - kidAge, units, debt: st.estate?.money < 0 };
  } else {
    birthYear = pickBirthYear(rng, era);
    region = pickRegion(rng, era.birth);
    cls = CLASSES[clampIdx(Math.round(4.5 + 4.5 * x + gauss(rng) * FATE.sd))];
  }
  const kin = (k) => (af.path === 'child' && (k === 'relations' || k === 'network') ? Math.max(-FATE.bonusCap, Math.min(FATE.bonusCap, (st[k] - 50) * FATE.kin)) : 0);
  const bonus = Object.fromEntries(STAT_KEYS.map((k) => [k, x * FATE.stat + (af.bonus[k] ?? 0) + kin(k)]));
  const gen = st.gen ?? 1;
  const lineage = [...(st.lineage ?? []), { gen, sex: st.sex, cls: st.cls, age: st.age, realm: realm.name, path: af.path }];
  return {
    seed: mixSeed(st.seed, 0x5eed + gen),
    gen: gen + 1,
    sex,
    cls,
    region,
    birthYear,
    parents,
    legacy,
    bonus,
    ledger: carryLedger(st.ledger, net, r),
    carried: r,
    lineage,
  };
}

// รุ่นถัดไป: ชีวิตใหม่จาก heir ที่การ์ดส่งต่อสร้างไว้
export function nextLife(af) {
  if (!af.heir) throw new Error('ยังไม่ถึงการ์ดส่งต่อ');
  return newLife(af.heir.seed, af.st.content, af.heir);
}

// harness/หน้าเว็บเดินช่วงที่ 7 ด้วยฟังก์ชันชุดเดียวกัน · บอทได้ af (มี pending.choices ให้อ่านป้ายบุญบาปแบบเดียวกับการ์ดชีวิต)
export function playAfterlife(st, pickChoice, onCard) {
  const af = startAfterlife(st);
  for (;;) {
    const card = nextAfterCard(af);
    onCard?.(card, af);
    if (card.choices?.length) chooseAfter(af, pickChoice(card, af.botRng, af));
    if (card.done) return af;
  }
}
