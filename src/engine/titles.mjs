// ลวดลายชีวิต + ฉายาตามเงื่อนไข + ฉายาตระกูล (ใบ 04 · B10)
// คิดย้อนหลังตอนตายจากสิ่งที่ชีวิตนั้นเลือกจริง (st.log) + สถานะท้ายชีวิต — ไม่เก็บอะไรเพิ่มระหว่างเล่น ไม่ดึงเลขสุ่ม
// ห้ามอ่านยอดบัญชีบุญบาป (ledger) — ลวดลาย/ฉายาขึ้นบนการ์ดตายก่อนศาลเฉลยบัญชี · อ่านได้เฉพาะป้ายของตัวเลือกที่ผู้เล่นกดเอง
// (การกระทำนั้นผู้เล่นเห็นในข้อความอยู่แล้ว) ไม่รวมยอด ไม่หักกลบ ไม่บอกฝั่งที่หนักกว่า
import { allocOptions } from './finance.mjs';
import { meritId, SIN_CATS } from './merit.mjs';
import { CLASSES, LEVELS, RETIRE_AGE, riskLabel, netWorth, totalDebt } from './life.mjs';
import { expectedDeathAge, eraEventsAt, protoYear } from './era.mjs';
import { nationalIncome } from './birth.mjs';

// ใบ 04: ลวดลายคิดจากเหตุการณ์ที่เกิดจริงหลังอายุ 18
export const PATTERN_FROM = 18;
// ตัวเลือกหลัง 18 น้อยกว่านี้ = ข้อมูลไม่พอให้เห็นลวดลาย (ตายตอนเด็ก/วัยรุ่น)
export const PATTERN_MIN_PICKS = 3;

const lv = (v) => (v ? Math.sign(v) * LEVELS[Math.abs(v)] / LEVELS[1] : 0);
const tags = (c) => (c?.merit ?? []).map((t) => ({ id: meritId(t.cat), level: t.level ?? 1 }));
const flagsOf = (c) => c?.sets_flags ?? [];

// ข้อความตัวเลือกที่ผู้เล่นเห็น — แกนบ้านเกิด↔ไปไกล ไม่มีกลไกย้ายถิ่นในแกนเกม จึงอ่านจากเรื่องที่เลือกเอง
const AWAY = /ย้าย|เข้ากรุง|ต่างประเทศ|เมืองนอก|ต่างจังหวัด|ลาออก|เปลี่ยนงาน|สมัครงาน|ไปเรียน|เรียนต่อ|ไปทำงาน|ไปลอง/;
const HOME = /กลับบ้าน|บ้านเกิด|อยู่กับพ่อ|อยู่กับแม่|ดูแลพ่อ|ดูแลแม่|พ่อแม่|ที่บ้าน|ช่วยงานบ้าน|สืบต่อ|ไม่ไปไหน|อยู่ที่เดิม/;

const indexCache = new WeakMap();
function eventIndex(content) {
  let m = indexCache.get(content);
  if (!m) indexCache.set(content, (m = new Map(content.events.map((e) => [e.id, e]))));
  return m;
}

// ตัวเลือกที่เลือกจริงตั้งแต่อายุ from · การ์ดจัดสรรเงินสร้างตัวเลือกตามปี จึงสร้างซ้ำจากปีนั้น
// การ์ดที่แกนสร้างเอง (หางาน · เรียนต่อ) ไม่อยู่ในเนื้อหา — งาน/วุฒิอ่านจากสถานะท้ายชีวิตแทน
export function picksAfter(st, from = PATTERN_FROM) {
  const idx = eventIndex(st.content);
  const out = [];
  for (const l of st.log) {
    if (l.age < from) continue;
    if (l.id === 'alloc') {
      const o = allocOptions(st.content.era, st.birthYear + l.age)[l.choice];
      out.push({ age: l.age, alloc: o?.alloc ?? null, text: l.text });
      continue;
    }
    const ev = idx.get(l.id);
    const c = ev?.choices[l.choice];
    if (c) out.push({ age: l.age, ev, c, text: l.text });
  }
  return out;
}

// คะแนนดิบ 4 แกน (ใบ 04) บวก = ขั้วหลัง · แต่ละแกนคิดจากสิ่งที่ต่างกัน ไม่ใช้ตัวเดียวกันซ้ำสองแกนเท่าที่ทำได้
// ① ครอบครัว(−) ↔ งาน(+) · ② บ้านเกิด(−) ↔ ไปไกล(+) · ③ มั่นคง(−) ↔ เสี่ยง(+) · ④ ทางโลก(−) ↔ ทางธรรม(+)
export function axisRaw(st) {
  const picks = picksAfter(st);
  const a = { work: 0, away: 0, risk: 0, dhamma: 0 };
  for (const p of picks) {
    if (p.alloc !== undefined) {
      // คงแบบเดิม (null) ไม่นับ · ส่วนที่ไม่อยู่ในเงินฝาก/เงินสด = ส่วนที่เสี่ยง
      if (!p.alloc) continue;
      const safe = (p.alloc.deposit ?? 0) + (p.alloc.cash ?? 0);
      a.risk += safe >= 1 ? -1 : 2 * (1 - safe);
      continue;
    }
    const c = p.c;
    const fx = c.effects ?? {};
    a.work += lv(fx.network) + 0.5 * lv(fx.knowledge) - lv(fx.relations);
    if (fx.income_mult) a.work += fx.income_mult > 1 ? 1.5 : -0.5;
    if (fx.job) a.work += 1;
    if (AWAY.test(p.text)) a.away += 1.5;
    if (HOME.test(p.text)) a.away -= 1.5;
    if (c.outcomes?.length) a.risk += { เสี่ยงต่ำ: 0.5, เสี่ยงกลาง: 1, เสี่ยงสูง: 2 }[riskLabel(c.outcomes)] * (c.outcomes.some((o) => o.ok) ? 0.5 : 1);
    else a.risk -= 0.4;
    if (fx.invest) a.risk += 2 * fx.invest.share;
    if (fx.debt) a.risk += 1;
    if (fx.settle) a.risk -= 1;
    const m = fx.money;
    if (m && (typeof m === 'number' ? m : m.amount) > 0) a.dhamma -= 0.5;
    for (const t of tags(c)) {
      if (t.id === 'dana' || t.id === 'sila' || t.id === 'bhavana') a.dhamma += t.level;
      else if (t.id === 'care_parents') {
        a.dhamma += 0.5 * t.level;
        a.work -= t.level;
        a.away -= t.level;
      } else if (t.id === 'help_others') a.dhamma += 0.5 * t.level;
      else if (SIN_CATS.includes(t.id) && t.id !== 'vow_broken') a.dhamma -= t.level;
    }
    for (const f of flagsOf(c)) {
      if (f === 'has_kids' || f === 'married' || f === 'raised_grandkids') a.work -= 2;
      if (f === 'own_business' || f === 'online_seller') a.work += 1;
      if (f === 'own_business' || f === 'guarantor' || f === 'loan_shark') a.risk += 1;
      if (f === 'lottery_habit') { a.risk += 2; a.dhamma -= 1; }
      if (f === 'has_insurance') a.risk -= 2;
      if (f === 'home_owner') { a.risk -= 1; a.away -= 1; }
      if (f === 'took_bribe' || f === 'embezzler') a.dhamma -= 2;
    }
  }
  // งานที่ทำ: ทิ้งอาชีพของครอบครัว = ไปไกล · สืบอาชีพครอบครัว = อยู่บ้านเกิด · เรียนจบสูง = ออกจากบ้านไปเรียน
  if (st.workFrom !== null) a.away += st.occupation === st.familyOcc ? -2 : 2;
  if (st.edu === 'อุดมศึกษา') a.away += 1;
  return { ...a, picks: picks.length };
}

// ค่ากลาง/ช่วงของแต่ละแกนหลังหารด้วย √จำนวนตัวเลือก — ชีวิตยาวเลือกมากกว่า คะแนนดิบจึงกว้างกว่าโดยไม่ได้เอียงกว่า
// ค่าตั้งจาก harness (npm run titles พิมพ์ค่าที่ควรเป็นทุกรอบ) · cut = มัธยฐาน ลวดลาย 16 แบบจึงกระจายใกล้กัน · scale = ครึ่ง IQR
export const AXES = [
  { id: 'work', cut: -0.633, scale: 0.751 },
  { id: 'away', cut: 0.186, scale: 0.386 },
  { id: 'risk', cut: 1.401, scale: 0.528 },
  { id: 'dhamma', cut: 0.316, scale: 0.371 },
];
// "ครึ่ง ๆ" (ใบ 04): แกนที่ |z| ต่ำกว่า NEAR นับว่าใกล้ศูนย์ · ใกล้ศูนย์ตั้งแต่ HALF_AXES แกนขึ้นไป = ครึ่ง ๆ
export const NEAR = 0.3;
export const HALF_AXES = 3;

export const axisZ = (raw) => AXES.map((a) => (raw[a.id] / Math.sqrt(raw.picks) - a.cut) / a.scale);

// 16 แบบ: id = ขั้วของแกน ①②③④ ตามลำดับ (F ครอบครัว/W งาน · H บ้านเกิด/A ไปไกล · S มั่นคง/R เสี่ยง · L ทางโลก/D ทางธรรม)
// ชื่อเป็นภาพไทย (ใบ 04: ต้นไม้ · แม่น้ำ · วัด · ตลาด) · ไม่มีแบบไหนดีกว่าแบบอื่น — คำใบ้เล่าทาง ไม่ตัดสิน
export const PATTERNS = [
  { id: 'FHSL', name: 'ต้นมะม่วงหน้าบ้าน', hint: 'อยู่ใกล้คนในบ้าน ปลูกอะไรไว้ให้ลูกหลานเก็บกินได้นาน' },
  { id: 'FHSD', name: 'ต้นโพธิ์ลานวัด', hint: 'ร่มเงาของหมู่บ้าน ไม่ไปไหน และเป็นที่พักใจของคนรอบตัว' },
  { id: 'FHRL', name: 'แผงตลาดนัดหน้าบ้าน', hint: 'ลุ้นทุกวันเพื่อคนในบ้าน ไม่ทิ้งถิ่น' },
  { id: 'FHRD', name: 'เรือจ้างข้ามฟาก', hint: 'พายฝ่าน้ำเชี่ยวไปกลับฝั่งเดิม ส่งคนอื่นถึงที่หมาย' },
  { id: 'FASL', name: 'คลองส่งน้ำ', hint: 'ไหลไปไกลจากต้นทาง แต่ทุกหยดกลับไปเลี้ยงคนที่บ้าน' },
  { id: 'FASD', name: 'ระฆังวัดต่างถิ่น', hint: 'ไปอยู่ไกล แต่เสียงยังเรียกคนในครอบครัวให้ใจสงบ' },
  { id: 'FARL', name: 'รถทัวร์สายเหนือ-ใต้', hint: 'ออกไปเสี่ยงไกลบ้าน เพื่อส่งเงินกลับไปหาคนที่รัก' },
  { id: 'FARD', name: 'เรือกอและกลางทะเล', hint: 'ออกไกลฝ่าคลื่น เชื่อในสิ่งที่มองไม่เห็น เพื่อคนบนฝั่ง' },
  { id: 'WHSL', name: 'ร้านโชห่วยหัวมุม', hint: 'ทำงานหนักอยู่ที่เดิมทุกวัน ไม่รีบ ไม่เสี่ยง' },
  { id: 'WHSD', name: 'หอระฆังไม้สัก', hint: 'ทำหน้าที่ของตัวเองอยู่ที่เดิมอย่างเที่ยงตรง' },
  { id: 'WHRL', name: 'สนามไก่ชนท้ายหมู่บ้าน', hint: 'ไม่ไปไหน แต่ไม่เคยหยุดลุ้น' },
  { id: 'WHRD', name: 'ตะเกียงเจ้าพายุ', hint: 'สว่างแรงที่บ้านเกิด กล้าเสี่ยงแต่ไม่ทิ้งหลักใจ' },
  { id: 'WASL', name: 'รางรถไฟสายใต้', hint: 'วิ่งไกลบนทางที่วางไว้แล้ว มั่นคงทีละสถานี' },
  { id: 'WASD', name: 'ธุดงค์ในเมืองหลวง', hint: 'ไปไกลเพื่องาน แต่เดินทางของตัวเองอย่างสงบ' },
  { id: 'WARL', name: 'เจ้าพระยาหน้าน้ำ', hint: 'ไหลแรง ไปไกล เสี่ยงล้นตลิ่ง แต่พาของไปได้มาก' },
  { id: 'WARD', name: 'ว่าวจุฬากลางสนามหลวง', hint: 'ทะยานสูงไกลบ้าน กล้าเสี่ยง และยังมีสายผูกใจไว้' },
];
export const HALF = { id: 'HALF', name: 'น้ำครึ่งแก้ว', hint: 'ไม่สุดทางไหนเลย ทุกทางพอดี ๆ' };
export const ALL_PATTERNS = [...PATTERNS, HALF];
const POLES = [['F', 'W'], ['H', 'A'], ['S', 'R'], ['L', 'D']];

// ลวดลายของชีวิต · null = ตัวเลือกหลังอายุ 18 ไม่พอให้เห็นลวดลาย
export function patternOf(st, raw = axisRaw(st)) {
  if (raw.picks < PATTERN_MIN_PICKS) return null;
  const z = axisZ(raw);
  if (z.filter((v) => Math.abs(v) < NEAR).length >= HALF_AXES) return HALF;
  const id = z.map((v, i) => POLES[i][v > 0 ? 1 : 0]).join('');
  return PATTERNS.find((p) => p.id === id);
}

// ระดับเรียงหายากก่อน — บันทึกการตายโชว์ 3 ตัวแรก · ภาพแชร์ใช้ตัวแรก
export const TIERS = ['ตำนาน', 'หายาก', 'ทั่วไป'];

// อาชีพครอบครัวที่ไม่ต้องใช้ปริญญา — ลูกจบมหาวิทยาลัย = คนแรกของบ้าน
const LOW_FAMILY_OCC = ['farmer', 'labor', 'factory', 'craft'];
// ข้อเท็จจริงท้ายชีวิตที่ฉายาทุกตัวอ่าน — คิดครั้งเดียว · ไม่มียอดบัญชีบุญบาป
export function lifeFacts(st) {
  const era = st.content.era;
  const picks = picksAfter(st, 0);
  const tagCount = {};
  let sinPicks = 0, declined = 0;
  for (const p of picks) {
    if (!p.c) continue;
    const ids = tags(p.c).map((t) => t.id);
    for (const id of ids) tagCount[id] = (tagCount[id] ?? 0) + 1;
    if (ids.some((id) => SIN_CATS.includes(id))) sinPicks++;
    // มีทางผิดให้เลือกแต่ไม่เลือก
    else if (p.ev.choices.some((c) => tags(c).some((t) => SIN_CATS.includes(t.id)))) declined++;
  }
  // เหตุการณ์บ้านเมืองที่ทันตอนเป็นผู้ใหญ่ · ปีอนาคตวนปีต้นแบบ เหตุการณ์ชื่อเดียวกันจึงนับแยกตามปีที่เกิด
  const crises = new Set(), disasters = new Set();
  for (let a = 20; a <= st.age; a++) {
    const y = st.birthYear + a;
    for (const e of eraEventsAt(era, st.seed, y)) (e.kind === 'economy' ? crises : disasters).add(`${e.id}@${y - (protoYear(era, st.seed, y) - e.from)}`);
  }
  const worth = netWorth(st);
  return {
    st,
    age: st.age,
    clsIdx: CLASSES.indexOf(st.cls),
    flags: st.flags,
    tagCount,
    sinPicks,
    declined,
    crises: crises.size,
    disasters: disasters.size,
    worth,
    debt: totalDebt(st),
    // ทรัพย์สุทธิเป็นจำนวนเท่าของรายได้ครัวเรือนทั้งปีของประเทศ — เทียบข้ามยุคได้
    wealth: worth / (nationalIncome(era, st.seed, st.birthYear + st.age) * 12),
    workYears: st.workFrom === null ? 0 : Math.max(0, Math.min(st.age, RETIRE_AGE) - st.workFrom),
    expected: expectedDeathAge(era, st.sex, st.birthYear, st.seed),
  };
}

const has = (f, ...k) => k.some((x) => f.flags[x]);
// ฉายาตามเงื่อนไข (ใบ 04) — ทุกตัวตรวจแยกกัน ได้หลายตัวพร้อมกัน ไม่มีลำดับ · ด้านลบใช้คำเห็นใจ ไม่ตำหนิ
// harness ต้องพิสูจน์ทุกตัว ≥0.1% · ระดับตั้งจากอัตราที่วัดได้ (ทั่วไป >10% · หายาก 1.5–10% · ตำนาน <1.5% รวมทุกบุคลิก) ไม่ใช่ความยากที่คิดเอา
export const TITLES = [
  { id: 'hard_worker', tier: 'ทั่วไป', name: 'มือไม่เคยว่าง', hint: 'ทำงานยาวนานหลายสิบปี', test: (f) => f.workYears >= 40 },
  { id: 'boss', tier: 'ทั่วไป', name: 'เถ้าแก่ตัวเล็ก', hint: 'เคยเปิดกิจการของตัวเอง', test: (f) => has(f, 'own_business') },
  { id: 'vendor', tier: 'ทั่วไป', name: 'คนค้าขายหัวใจสู้', hint: 'หาเลี้ยงชีพด้วยการค้าขายรายวัน', test: (f) => has(f, 'street_vendor', 'online_seller') },
  { id: 'grateful', tier: 'ทั่วไป', name: 'ลูกกตัญญู', hint: 'เลือกดูแลพ่อแม่ซ้ำแล้วซ้ำอีก', test: (f) => (f.tagCount.care_parents ?? 0) >= 2 },
  { id: 'giver', tier: 'ทั่วไป', name: 'มือที่ไม่เคยหุบ', hint: 'ให้ทานบ่อยจนเป็นนิสัย', test: (f) => (f.tagCount.dana ?? 0) >= 3 },
  { id: 'parent', tier: 'ทั่วไป', name: 'พ่อแม่ของใครสักคน', hint: 'มีลูกให้ห่วง', test: (f) => has(f, 'has_kids') },
  { id: 'storm', tier: 'ทั่วไป', name: 'ผ่านมรสุมเศรษฐกิจ', hint: 'เป็นผู้ใหญ่ทันวิกฤตเศรษฐกิจหลายครั้ง', test: (f) => f.crises >= 3 },
  { id: 'homeowner', tier: 'ทั่วไป', name: 'มีบ้านเป็นของตัวเอง', hint: 'ได้บ้านมาด้วยน้ำพักน้ำแรง', test: (f) => has(f, 'home_owner') },
  { id: 'runner', tier: 'ทั่วไป', name: 'นักวิ่งตอนเช้า', hint: 'ดูแลร่างกายเป็นกิจวัตร', test: (f) => has(f, 'sporty') },
  { id: 'first_grad', tier: 'หายาก', name: 'บัณฑิตคนแรกของบ้าน', hint: 'เรียนจบสูงกว่าที่บ้านเคยมีใครได้', test: (f) => f.st.edu === 'อุดมศึกษา' && LOW_FAMILY_OCC.includes(f.st.familyOcc) },
  { id: 'debt_bearer', tier: 'ทั่วไป', name: 'ผู้แบกหนี้จนวันสุดท้าย', hint: 'ยังผ่อนไม่หมดจนวันที่จากไป', test: (f) => f.debt > 0 || f.worth < 0 },
  { id: 'scarred', tier: 'หายาก', name: 'แผลในใจที่ผ่านมาได้', hint: 'เคยถูกรังแก แต่จากไปอย่างมีความสุข', test: (f) => has(f, 'bullied') && f.st.happiness >= 75 },
  { id: 'kind_fooled', tier: 'ทั่วไป', name: 'ใจดีจนโดนหลอก', hint: 'ไว้ใจคนผิดเรื่องเงิน', test: (f) => has(f, 'ponzi_victim') },
  // caught_fraud = ทุจริตเองแล้วถูกจับ/ไล่ออก — แยกจากฉายาเหยื่อ ใช้คำเห็นใจแบบเดียวกับด้านลบตัวอื่น
  { id: 'stumbled', tier: 'หายาก', name: 'ผู้เคยก้าวพลาด', hint: 'เคยถูกจับได้เพราะเลือกทางลัด', test: (f) => has(f, 'caught_fraud') },
  { id: 'guarantor', tier: 'หายาก', name: 'ผู้แบกหนี้แทนคนอื่น', hint: 'เซ็นค้ำให้คนที่ไว้ใจ', test: (f) => has(f, 'guarantor') },
  { id: 'lone_walker', tier: 'หายาก', name: 'ผู้เดินทางคนเดียว', hint: 'อยู่จนแก่โดยไม่มีครอบครัวของตัวเอง', test: (f) => f.age >= 70 && !has(f, 'has_kids', 'married') && f.st.relations < 20 },
  { id: 'comeback', tier: 'ตำนาน', name: 'ล้มแล้วลุก', hint: 'ล้มละลายแล้วกลับมามีเงินเหลือ', test: (f) => f.st.bankruptcies >= 1 && f.debt <= 0 && f.worth >= 0 },
  { id: 'quiet_rich', tier: 'หายาก', name: 'เศรษฐีเงียบ', hint: 'เกิดไม่สูง แต่จากไปพร้อมทรัพย์ก้อนใหญ่', test: (f) => f.clsIdx <= 4 && f.wealth >= 10 },
  { id: 'folk_sage', tier: 'หายาก', name: 'ปราชญ์ชาวบ้าน', hint: 'รู้มากโดยไม่ต้องมีปริญญา', test: (f) => f.st.knowledge >= 95 && (!f.st.edu || f.st.edu === 'ประถม') },
  { id: 'outlived', tier: 'หายาก', name: 'อายุยืนเกินคาด', hint: 'อยู่นานกว่าคนรุ่นเดียวกันมาก', test: (f) => f.age >= f.expected + 25 },
  { id: 'clean_hands', tier: 'หายาก', name: 'มือสะอาดในที่สกปรก', hint: 'เจอทางลัดหลายครั้งแต่ไม่เคยเลือก', test: (f) => f.declined >= 10 && f.sinPicks === 0 },
  { id: 'survivor', tier: 'ทั่วไป', name: 'รอดมาได้ทุกภัย', hint: 'ผ่านภัยพิบัติใหญ่มาหลายครั้ง', test: (f) => f.disasters >= 6 },
  { id: 'lucky_number', tier: 'ทั่วไป', name: 'ผู้รอเลขเด็ด', hint: 'ซื้อหวยจนเป็นนิสัย', test: (f) => has(f, 'lottery_habit') },
  { id: 'grandparent', tier: 'หายาก', name: 'ผู้เลี้ยงหลานแทนพ่อแม่', hint: 'รับหลานมาเลี้ยงเอง', test: (f) => has(f, 'raised_grandkids') },
  { id: 'centenarian', tier: 'ตำนาน', name: 'ร้อยปีไม่สาย', hint: 'อยู่ถึงร้อยปี', test: (f) => f.age >= 100 },
  { id: 'rags_riches', tier: 'ตำนาน', name: 'จากศูนย์สู่เศรษฐี', hint: 'เกิดลำบากที่สุด จากไปพร้อมทรัพย์มหาศาล', test: (f) => f.clsIdx <= 2 && f.wealth >= 20 },
  { id: 'never_dark', tier: 'หายาก', name: 'ผู้ไม่เคยเลือกทางมืด', hint: 'ทั้งชีวิตไม่เคยเลือกทางผิดเลยสักครั้ง', test: (f) => f.age >= 60 && f.sinPicks === 0 && f.declined >= 11 },
  { id: 'peaceful', tier: 'ตำนาน', name: 'จากไปอย่างสงบ', hint: 'แก่เฒ่า ไม่มีหนี้ มีคนรักรายล้อม และมีความสุข', test: (f) => f.age >= 80 && f.debt <= 0 && f.worth >= 0 && f.st.relations >= 70 && f.st.happiness >= 70 && has(f, 'has_kids') },
];

// ฉายาตระกูล (ใบ 04) — ข้ามรุ่น · ch = ผังตระกูลรุ่นก่อน + ชีวิตนี้ · lin = รุ่นก่อนเท่านั้น
// ภูมิ/ทางเกิดของชีวิตนี้ยังไม่รู้ตอนตาย จึงนับจากรุ่นก่อน
const CLIMB = { from: 2, to: 6 };
const climb = (ch) => {
  const lo = ch.findIndex((l) => CLASSES.indexOf(l.cls) <= CLIMB.from);
  return lo >= 0 && ch.slice(lo + 1).some((l) => CLASSES.indexOf(l.cls) >= CLIMB.to);
};
const lastN = (xs, n, ok) => xs.length >= n && xs.slice(-n).every(ok);
export const FAMILY_TITLES = [
  { id: 'fam_climb', name: 'ตระกูลไต่บันได', hint: 'จากรุ่นที่ลำบาก ลูกหลานไต่ขึ้นไปถึงชนชั้นกลางบน', test: (ch) => climb(ch) },
  { id: 'fam_no_hell', name: 'บรรพบุรุษไม่เคยตกนรก', hint: 'สองรุ่นก่อนหน้าไม่มีใครไปภูมินรก', test: (ch, lin) => lastN(lin, 2, (l) => l.realm !== 'นรก') },
  { id: 'fam_debt', name: 'หนี้ที่ส่งต่อกันมาสามรุ่น', hint: 'สามรุ่นติดกันจากไปพร้อมหนี้', test: (ch) => lastN(ch, 3, (l) => l.broke) },
  { id: 'fam_long', name: 'ตระกูลอายุยืน', hint: 'สามรุ่นติดกันอยู่ถึงแปดสิบ', test: (ch) => lastN(ch, 3, (l) => l.age >= 80) },
  { id: 'fam_guardian', name: 'ผีบรรพบุรุษเฝ้าบ้าน', hint: 'รุ่นก่อนกลับมาเกิดเป็นลูกของตัวเอง', test: (ch, lin) => lastN(lin, 1, (l) => l.path === 'child') },
  { id: 'fam_wander', name: 'ดวงวิญญาณพเนจร', hint: 'สองรุ่นติดกันไปเกิดใหม่ที่อื่น', test: (ch, lin) => lastN(lin, 2, (l) => l.path === 'reborn') },
  { id: 'fam_deva', name: 'ตระกูลมีเทวดา', hint: 'มีบรรพบุรุษไปเกิดเป็นเทวดาอย่างน้อยสองรุ่น', test: (ch, lin) => lin.filter((l) => l.realm === 'เทวดา').length >= 2 },
];

// ผลรวมของชีวิตนี้ที่การ์ดตาย/สมุดฉายาใช้ · titles เรียงหายากก่อน (ลำดับใน TITLES ภายในระดับเดียวกัน)
export function titlesOf(st) {
  const raw = axisRaw(st);
  const pattern = patternOf(st, raw);
  const f = lifeFacts(st);
  const pick = ({ id, name, tier, hint }) => ({ id, name, tier, hint });
  const titles = TITLES.filter((t) => t.test(f)).sort((a, b) => TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier)).map(pick);
  const chain = [...st.lineage, { gen: st.gen, sex: st.sex, cls: st.cls, age: st.age, broke: f.worth < 0 }];
  const family = FAMILY_TITLES.filter((t) => t.test(chain, st.lineage)).map(({ id, name, hint }) => ({ id, name, tier: 'ตระกูล', hint }));
  return { pattern: pattern && { id: pattern.id, name: pattern.name, hint: pattern.hint }, titles, family };
}
