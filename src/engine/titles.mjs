// ฉายาตามเงื่อนไข + ฉายาตระกูล (ใบ 04 · B10)
// คิดย้อนหลังตอนตายจากสิ่งที่ชีวิตนั้นเลือกจริง (st.log) + สถานะท้ายชีวิต — ไม่เก็บอะไรเพิ่มระหว่างเล่น ไม่ดึงเลขสุ่ม
// ห้ามอ่านยอดบัญชีบุญบาป (ledger) — ฉายาขึ้นบนการ์ดตายก่อนปรโลกเฉลยบัญชี · อ่านได้เฉพาะป้ายของตัวเลือกที่ผู้เล่นกดเอง
// (การกระทำนั้นผู้เล่นเห็นในข้อความอยู่แล้ว) ไม่รวมยอด ไม่หักกลบ ไม่บอกฝั่งที่หนักกว่า
import { allocOptions } from './finance.mjs';
import { meritId, SIN_CATS } from './merit.mjs';
import { CLASSES, LEVELS, RETIRE_AGE, riskLabel, netWorth, totalDebt, standingOf, stageOf, erasShown } from './life.mjs';
import { expectedDeathAge } from './era.mjs';
import { nationalIncome } from './birth.mjs';
import { ladderOf } from './rank.mjs';

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
export function picksAfter(st, from) {
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
    // ใบลางภัยยุคเป็นเสียงเตือนที่ทุกคนได้ยิน (ออกตั้งแต่อายุ 6) ไม่ใช่ทางชีวิต — นับแล้วแกนเสี่ยง/บ้านเกิดของเด็กเอียงจนสรุปช่วงวัยเพี้ยน
    // การ์ดบรรยากาศ (ambient · เทศกาล) ทุกคนเจอตามปฏิทิน ไม่ได้บอกทางชีวิต — ข้ามด้วยเหตุผลเดียวกับใบลาง
    if (ev?.herald_of || ev?.ambient) continue;
    const c = ev?.choices[l.choice];
    if (c) out.push({ age: l.age, ev, c, text: l.text });
  }
  return out;
}

// คะแนนดิบ 4 แกน (ใบ 04) บวก = ขั้วหลัง · แต่ละแกนคิดจากสิ่งที่ต่างกัน ไม่ใช้ตัวเดียวกันซ้ำสองแกนเท่าที่ทำได้
// ① ครอบครัว(−) ↔ งาน(+) · ② บ้านเกิด(−) ↔ ไปไกล(+) · ③ มั่นคง(−) ↔ เสี่ยง(+) · ④ ทางโลก(−) ↔ ทางธรรม(+)
// แยกส่วนที่ไม่อ่านป้ายบุญบาปออกมา ให้สรุปช่วงวัย (stageSummary) ใช้ได้โดยไม่เผยบัญชี · คืน false = การ์ดจัดสรรเงิน (ไม่มีตัวเลือกเนื้อหา)
// ลำดับการบวกต้องเหมือนเดิม — stageSummary ผลต่างแม้ทศนิยมท้าย ๆ ทำให้ชีวิตที่อยู่ขอบแกนเปลี่ยนบรรทัดสรุป
function pickBase(a, p) {
  if (p.alloc !== undefined) {
    // คงแบบเดิม (null) ไม่นับ · ส่วนที่ไม่อยู่ในเงินฝาก/เงินสด = ส่วนที่เสี่ยง
    if (!p.alloc) return false;
    const safe = (p.alloc.deposit ?? 0) + (p.alloc.cash ?? 0);
    a.risk += safe >= 1 ? -1 : 2 * (1 - safe);
    return false;
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
  return true;
}
function pickFlags(a, c) {
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

// สรุปภาพรวมสิ่งที่เลือกในช่วงวัย (B21) บนการ์ดเปลี่ยนช่วง — ใช้แค่ 3 แกนที่ไม่แตะป้ายบุญบาป
// แกนทางโลก/ทางธรรมคิดจากป้ายบุญบาป ใช้ไม่ได้ (เผยบัญชีก่อนปรโลก) · care_parents ก็เป็นป้ายบุญ จึงไม่นับในแกนครอบครัว
// เด็กยังไม่ทำงาน ขั้วงานของแกนแรกจึงเล่าเป็นเรื่องเรียน/เพื่อนแทน
const KID_STAGES = ['เด็ก', 'วัยรุ่น'];
// [มัธยฐาน, ครึ่ง IQR] ของคะแนน ÷ √จำนวนตัวเลือก ต่อช่วงวัย จากบอทสุ่ม — ตั้งแยกต่อช่วงวัย ไม่รวมงาน/วุฒิท้ายชีวิต
// ใช้กับช่วงเดียวแล้วเอียงทั้งก้อน · LEAN 1 = นอกครึ่งกลางของบอทสุ่ม จึงขึ้นราวครึ่งหนึ่งของการ์ดต่อแกน
// แกนบ้านเกิด/ไปไกลอ่านจากคำในข้อความ หลายช่วงไม่มีเลยจน IQR = 0 — พื้น SCALE_MIN กันหารศูนย์ และให้เอ่ยเมื่อเลือกเรื่องนั้นชัด ๆ
const STAGE_AXES = {
  เด็ก: { work: [-0.177, 0.677], away: [0, 0.556], risk: [-0.133, 0.321] },
  วัยรุ่น: { work: [0.612, 0.486], away: [0, 0], risk: [-0.189, 0.313] },
  หนุ่มสาว: { work: [-0.433, 0.69], away: [0, 0.226], risk: [0.633, 0.486] },
  ทำงาน: { work: [0.151, 0.472], away: [0, 0.217], risk: [0.529, 0.55] },
  กลางคน: { work: [0, 0.634], away: [0, 0], risk: [0.35, 0.5] },
  ชรา: { work: [-0.874, 0.613], away: [0, 0.194], risk: [0.635, 0.495] },
};
const SCALE_MIN = 0.3;
const LEAN = 1;
const SUMMARY_AXES = [
  { id: 'work', pos: 'ทุ่มให้งานมากกว่าครอบครัว', neg: 'ให้เวลาครอบครัวมากกว่างาน', kidPos: 'ใส่ใจเรื่องเรียนและเพื่อนมากกว่าเรื่องในบ้าน', kidNeg: 'อยู่ใกล้คนในบ้านมากกว่าออกไปหาเพื่อน' },
  { id: 'away', pos: 'ออกไปไกลจากบ้านเกิด', neg: 'อยู่ใกล้บ้านเกิด' },
  { id: 'risk', pos: 'เลือกทางเสี่ยงมากกว่ามั่นคง', neg: 'เลือกทางมั่นคงมากกว่าเสี่ยง' },
];
// เรื่องเด่น = ตัวเลือกที่ผลบนการ์ดแรงที่สุด (ป้ายที่ผู้เล่นเห็น) · ต่ำกว่า HIGHLIGHT_MIN ไม่นับว่าเด่น
const HIGHLIGHT_MIN = 3;
const HIGHLIGHTS = 3;
function pickWeight(c) {
  const fx = c.effects ?? {};
  let s = 0;
  for (const k of ['health', 'happiness', 'knowledge', 'relations', 'network']) s += Math.abs(fx[k] ?? 0);
  for (const v of Object.values(fx.chronic ?? {})) s += Math.abs(v);
  if (fx.money) s += 2;
  if (fx.income_mult) s += 2;
  if (fx.invest || fx.debt || fx.settle) s += 2;
  if (fx.job) s += 1;
  s += 1.5 * flagsOf(c).length;
  if (c.outcomes?.length && riskLabel(c.outcomes) === 'เสี่ยงสูง') s += 2;
  return s;
}

export function stageSummary(st, stage, fromAge, toAge) {
  const picks = picksAfter(st, fromAge).filter((p) => p.age <= toAge);
  const a = { work: 0, away: 0, risk: 0, dhamma: 0 };
  const scored = [];
  for (const p of picks) {
    if (!pickBase(a, p)) continue;
    pickFlags(a, p.c);
    scored.push({ age: p.age, text: p.text, w: pickWeight(p.c) });
  }
  const kid = KID_STAGES.includes(stage);
  const lines = [];
  const norm = {};
  for (const ax of SUMMARY_AXES) norm[ax.id] = picks.length ? a[ax.id] / Math.sqrt(picks.length) : 0;
  const ref = STAGE_AXES[stage];
  if (picks.length && ref) {
    for (const ax of SUMMARY_AXES) {
      const z = (norm[ax.id] - ref[ax.id][0]) / Math.max(SCALE_MIN, ref[ax.id][1]);
      if (Math.abs(z) < LEAN) continue;
      lines.push(z > 0 ? (kid && ax.kidPos) || ax.pos : (kid && ax.kidNeg) || ax.neg);
    }
    if (!lines.length) lines.push('เลือกแบบพอดี ๆ ไม่เอียงไปทางไหนชัด');
  }
  // เสมอกันเอาเรื่องหลัง — ใกล้ตอนเปลี่ยนช่วงกว่า ผู้เล่นจำได้
  const highlights = scored
    .filter((x) => x.w >= HIGHLIGHT_MIN)
    .sort((x, y) => y.w - x.w || y.age - x.age)
    .slice(0, HIGHLIGHTS)
    .sort((x, y) => x.age - y.age)
    .map(({ age, text }) => ({ age, text }));
  return { lines, highlights, norm };
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
  // เหตุบ้านเมืองที่ทันตอนเป็นผู้ใหญ่ นับเฉพาะกลุ่มที่ขึ้นการ์ดให้เห็น — ปีที่กลุ่มเหตุถูกซ่อน (ออกแล้ว/เว้นช่วง) ผู้เล่นไม่รู้ว่ารอดอะไรมา
  const crises = new Set(), disasters = new Set();
  for (const { e, age } of erasShown(st, st.age)) if (age >= 20) (e.kind === 'economy' ? crises : disasters).add(e.id);
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
  { id: 'storm', tier: 'ทั่วไป', name: 'ผ่านมรสุมเศรษฐกิจ', hint: 'เป็นผู้ใหญ่ทันวิกฤตเศรษฐกิจหลายครั้ง', test: (f) => f.crises >= 2 },
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
  { id: 'survivor', tier: 'ทั่วไป', name: 'รอดมาได้ทุกภัย', hint: 'ผ่านภัยพิบัติใหญ่มาหลายครั้ง', test: (f) => f.disasters >= 3 },
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
// เป้าตระกูล (B95b · เจ้าของเคาะ) — ได้ฉายาทุกรุ่นที่ยังเข้าเงื่อนไข · ชื่อเสียง +1 ครั้งเดียวต่อตระกูล (afterlife.mjs นับจาก lineage[].goals)
// ฐานะตอนตายอ่านจากจุดท้ายของ standing · rags = เกิดชั้น 1–2 แล้วภายในสามรุ่น (นับรุ่นนั้นด้วย) มีคนตายในฐานะ 9–10
const deathCls = (l) => l.standing?.at(-1)?.cls ?? CLASSES.indexOf(l.cls);
// service = รับราชการสายที่มีบำนาญ (พลเรือน ทหาร ตำรวจ) · office 2 = นายก อบต.
const RAGS = { from: 1, to: 8, within: 3 };
const runOf = (ch, n, ok) => ch.some((_, i) => i + n <= ch.length && ch.slice(i, i + n).every(ok));
const rags = (ch) => ch.some((l, i) => CLASSES.indexOf(l.cls) <= RAGS.from && ch.slice(i, i + RAGS.within).some((m) => deathCls(m) >= RAGS.to));
export const FAMILY_GOALS = [
  { id: 'goal_rags', name: 'จากยากไร้สู่มั่งคั่ง', hint: 'รุ่นที่เกิดมายากไร้ ภายในสามรุ่นมีคนจากไปอย่างมั่งคั่ง', test: (ch) => rags(ch) },
  { id: 'goal_service', name: 'สามรุ่นรับราชการ', hint: 'สามรุ่นติดกันรับราชการจนมีบำนาญ', test: (ch) => runOf(ch, 3, (l) => l.service) },
  { id: 'goal_politics', name: 'ตระกูลการเมือง', hint: 'สองรุ่นได้ตำแหน่งตั้งแต่นายก อบต. ขึ้นไป', test: (ch) => ch.filter((l) => (l.office ?? -1) >= 2).length >= 2 },
  { id: 'goal_great', name: 'ตระกูลใหญ่', hint: 'ชื่อเสียงตระกูลขึ้นถึงขั้นสูงสุด', test: (ch) => ch.some((l) => (l.fame ?? 0) >= 3) },
];
// ผังตระกูลรวมชีวิตนี้ตอนตาย — แถวท้ายมีฐานะตอนตาย (ตายพร้อมหนี้ = 0) กับชื่อเสียงที่รับมา
export const familyChain = (st, broke) => [...st.lineage.filter((l) => !l.isekai), { gen: st.gen, sex: st.sex, cls: st.cls, age: st.age, broke, fame: st.fame ?? 0, standing: [{ age: st.age, cls: broke ? 0 : standingOf(st) }], ...(st.officeTop >= 0 && { office: st.officeTop }), ...(ladderOf(st)?.pension && { service: true }) }];
export const goalsMet = (st, broke) => {
  const ch = familyChain(st, broke);
  const had = new Set(st.lineage.flatMap((l) => l.goals ?? []));
  return FAMILY_GOALS.filter((g) => !had.has(g.id) && g.test(ch)).map((g) => g.id);
};
export const FAMILY_TITLES = [
  { id: 'fam_climb', name: 'ตระกูลไต่บันได', hint: 'จากรุ่นที่ลำบาก ลูกหลานไต่ขึ้นไปถึงชนชั้นกลางบน', test: (ch) => climb(ch) },
  { id: 'fam_no_hell', name: 'บรรพบุรุษไม่เคยตกนรก', hint: 'สองรุ่นก่อนหน้าไม่มีใครไปภูมินรก', test: (ch, lin) => lastN(lin, 2, (l) => l.realm !== 'นรก') },
  { id: 'fam_debt', name: 'หนี้ที่ส่งต่อกันมาสามรุ่น', hint: 'สามรุ่นติดกันจากไปพร้อมหนี้', test: (ch) => lastN(ch, 3, (l) => l.broke) },
  { id: 'fam_long', name: 'ตระกูลอายุยืน', hint: 'สามรุ่นติดกันอยู่ถึงแปดสิบ', test: (ch) => lastN(ch, 3, (l) => l.age >= 80) },
  { id: 'fam_guardian', name: 'ผีบรรพบุรุษเฝ้าบ้าน', hint: 'รุ่นก่อนกลับมาเกิดเป็นลูกหลานของตัวเอง', test: (ch, lin) => lastN(lin, 1, (l) => l.path === 'child') },
  { id: 'fam_wander', name: 'ดวงวิญญาณพเนจร', hint: 'สองรุ่นติดกันไปเกิดใหม่ที่อื่น', test: (ch, lin) => lastN(lin, 2, (l) => l.path === 'reborn') },
  { id: 'fam_deva', name: 'ตระกูลมีเทวดา', hint: 'มีบรรพบุรุษไปเกิดเป็นเทวดาอย่างน้อยสองรุ่น', test: (ch, lin) => lin.filter((l) => l.realm === 'เทวดา').length >= 2 },
];

// ผลรวมของชีวิตนี้ที่การ์ดตาย/สมุดฉายาใช้ · titles เรียงหายากก่อน (ลำดับใน TITLES ภายในระดับเดียวกัน)
export function titlesOf(st) {
  const f = lifeFacts(st);
  const pick = ({ id, name, tier, hint }) => ({ id, name, tier, hint });
  const titles = TITLES.filter((t) => t.test(f)).sort((a, b) => TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier)).map(pick);
  // แถวต่างโลก (B68) ไม่มีฐานะ/อายุ/ภูมิแบบชาติไทย — ฉายาตระกูลนับเฉพาะชาติไทย
  const thai = st.lineage.filter((l) => !l.isekai);
  const chain = familyChain(st, f.worth < 0);
  const family = [...FAMILY_TITLES, ...FAMILY_GOALS].filter((t) => t.test(chain, thai)).map(({ id, name, hint }) => ({ id, name, tier: 'ตระกูล', hint }));
  return { titles, family };
}
