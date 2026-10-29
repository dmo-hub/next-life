// สายมู (ใบ 12): ส่วนที่แกนต้องทำเองนอกเหนือผลตัวเลือกปกติ — หวยสายมู · ทำบุญหวังผลที่ตามมาทวง · ตัวนับกิจกรรมสายมู
// กิจกรรมอื่น (ดูดวง ฤกษ์ บนบาน เครื่องราง) เป็นเนื้อหาล้วน ผลอยู่ในตัวเลือก ด่าน build กั้นให้แตะได้แค่ความสุข/ความสัมพันธ์/เงินจ่ายออก/ธง/ป้ายบุญ
// ไฟล์นี้อ่านบัญชีบุญบาปได้ที่เดียวคือโอกาสรางวัลเล็กของหวยสายมู — ค่าบัญชี/ตัวคูณห้ามออกไปกับการ์ด
import { PRIZE_TABLES } from './finance.mjs';
import { netLedger, REF_TABLE } from './merit.mjs';
import { LEVELS, netWorth, monthlyIncome, isWorking, moneyValue, stageOf } from './life.mjs';

// เงินตึง = ทรัพย์สุทธิต่ำกว่ารายได้กี่เดือน · ยังไม่เคยมีรายได้ของตัวเอง (เรียนอยู่) ไม่นับว่าตึง เพราะไม่มีฐานวัด
export const TIGHT = { months: 3 };
// ความสุขตอนประกาศผลหวยสายมู (ระดับตาม LEVELS) · ไม่ถูก = 0 ไม่ซ้ำเติม
const PRIZE_JOY = { small: 1, big: 2, first: 3 };
// ทำบุญหวังผลแล้วเงินไม่ดีขึ้น (ใบ 12): ความสุข −1 ระดับ
const HOPE_UNMET = -1;
const HOPE = 'hope_set:';

// draws = รางวัลที่จับได้รายใบ (null = ไม่ถูก) ให้ harness ตรวจอัตรา · ไม่เก็บตัวคูณ ค่าที่อ่านจากบัญชีจึงไม่ค้างใน state
const stateOf = (st) => (st.belief ??= { lottery: 0, tickets: 0, draws: [], acts: 0, hope: {} });
const kind = (e) => e.belief?.kind;
// การ์ดตามทวงของทำบุญหวังผล = เหตุการณ์ที่รอธง hope_set:<id>
const hopeFlag = (e) => (e.when?.flags?.has ?? []).find((f) => f.startsWith(HOPE));

// รายได้ต่อเดือนที่ใช้วัดเงินตึง: ทำงาน = รายได้ปีนี้ · เกษียณ = รายได้ปีสุดท้ายปรับเงินเฟ้อ
function monthlyBase(st) {
  if (isWorking(st)) return monthlyIncome(st);
  return st.retireBase === null ? null : (st.retireBase * st.price) / 12;
}
export function moneyTight(st) {
  const base = monthlyBase(st);
  return base !== null && netWorth(st) < TIGHT.months * base;
}

// เงินทรัพย์สุทธิเป็นบาทปีเกิด — เทียบข้ามปีได้โดยเงินเฟ้อไม่ทำให้ดูเหมือนรวยขึ้น
const realWorth = (st) => netWorth(st) / st.price;

// เหตุการณ์นี้เกิดได้ตอนนี้ไหม (เสริม when): หวยสายมูต้องเงินตึงและยังไม่ชนเพดาน · การ์ดตามทวงทำบุญหวังผลออกเมื่อเงินไม่ดีขึ้นเท่านั้น
export function beliefOk(st, e) {
  if (kind(e) === 'lottery_numen') return stateOf(st).lottery < e.belief.cap_per_life && moneyTight(st);
  const hope = hopeFlag(e);
  if (hope) return realWorth(st) <= (stateOf(st).hope[hope] ?? -Infinity);
  return true;
}

// เหตุการณ์ถูกจับออกแล้ว: นับเพดานหวยสายมู · การ์ดตามทวงลดความสุขแล้วปิดธงหวังผล
export function beliefFired(st, e) {
  const b = stateOf(st);
  if (kind(e) === 'lottery_numen') b.lottery++;
  const hope = hopeFlag(e);
  if (hope) {
    st.happiness = Math.max(0, st.happiness + Math.sign(HOPE_UNMET) * LEVELS[Math.abs(HOPE_UNMET)]);
    delete st.flags[hope];
    delete b.hope[hope];
  }
}

// ตัวคูณรางวัลเล็ก m = 1 + (max_mult − 1) × clamp(บัญชีสุทธิ / ref_scale, 0, 1) — ขึ้นอย่างเดียว บาปมากได้ฐานจริง
export function smallPrizeMult(ledger, odds) {
  const ref = REF_TABLE[String(odds.ref_scale).replace(/^table\./, '')];
  if (!(ref > 0)) throw new Error(`ไม่รู้จัก ref_scale: ${odds.ref_scale}`);
  return 1 + (odds.max_mult - 1) * Math.max(0, Math.min(1, netLedger(ledger) / ref));
}

// จับรางวัลหนึ่งใบด้วยเลขสุ่ม u ∈ [0,1): รางวัลใหญ่ใช้อัตราจริงก่อน แล้วรางวัลเล็กคูณ m · คืน null = ไม่ถูก
export function drawPrize(table, m, u) {
  let at = 0;
  for (const p of table.prizes) {
    at += (p.n / table.per) * (p.small ? m : 1);
    if (u < at) return p;
  }
  return null;
}

const LOSE_TEXT = [
  'ประกาศผลแล้ว ใบที่ซื้อไม่ถูกสักรางวัล พับเก็บไว้แล้วกลับไปคิดเรื่องเงินเดือนหน้าต่อ',
  'นั่งเทียบผลกับสลากอยู่นาน ไม่ถูกสักตัว ถือว่าดวงงวดนี้ยังไม่มา',
  'ฟังวิทยุประกาศผลจนจบ ไม่ถูกอะไรเลย เงินที่ตึงก็ยังตึงเท่าเดิม',
];

// ข้อความผลพูดได้แค่โชค/ดวงกลาง ๆ ไม่โยงกับที่มาของเลข ไม่ชวนซื้อต่อ (ใบ 11/12)
// มูลค่ารางวัลเป็นตัวเลขเฉพาะปีที่ใช้ตารางรางวัลชุดปัจจุบันแล้ว — ตรงกับด่าน build ข้อ (ค) ของเนื้อหา
const PRIZE_TEXT_FROM = 2560;
function prizeText(st, p, baht) {
  const amount = st.birthYear + st.age >= PRIZE_TEXT_FROM ? ` ${Math.round(baht).toLocaleString('en-US')} บาท` : null;
  if (p.id === 'first') return `ตรวจผลซ้ำหลายรอบ ใบที่ซื้อถูก${p.name}จริง ๆ ได้เงิน${amount ?? 'ก้อนใหญ่จนตั้งตัวไม่ถูก'} โชคมาหาแบบไม่ทันตั้งตัว`;
  if (!p.small) return `ใบที่ซื้อถูก${p.name} ได้เงิน${amount ?? 'ก้อนโต'} ดวงงวดนี้เข้าข้างจนตกใจ`;
  return `ใบที่ซื้อถูก${p.name} ได้เงิน${amount ?? 'มาก้อนเล็ก ๆ'} พอให้หายใจคล่องขึ้นอีกนิด`;
}

// ซื้อหวยสายมูหนึ่งใบ: จ่ายราคาใบ แล้วจับรางวัลด้วย rng ของโลก (เป็นผลของการเลือก) · คืนการ์ดผล
function buyTicket(st, ev) {
  const b = ev.belief;
  const table = PRIZE_TABLES[b.prize_table];
  if (!table) throw new Error(`ไม่รู้จักตารางรางวัล: ${b.prize_table}`);
  const stake = moneyValue(st, b.stake, true);
  st.money -= stake;
  stateOf(st).tickets++;
  const p = drawPrize(table, smallPrizeMult(st.ledger, b.odds_modifier), st.rng.next());
  stateOf(st).draws.push(p?.id ?? null);
  let text = LOSE_TEXT[(st.age + stateOf(st).tickets) % LOSE_TEXT.length];
  if (p) {
    // มูลค่ารางวัลต่อราคาใบคงที่ — ราคาใบปรับเงินเฟ้อแล้ว รางวัลจึงเป็นบาทของปีเดียวกัน
    const baht = p.baht * (stake / table.price);
    st.money += baht;
    const joy = PRIZE_JOY[p.id === 'first' ? 'first' : p.small ? 'small' : 'big'];
    st.happiness = Math.min(100, st.happiness + LEVELS[joy]);
    text = prizeText(st, p, baht);
  }
  return { kind: 'result', type: ev.type ?? 'B', age: st.age, stage: stageOf(st.age), text };
}

// กิจกรรมสายมูที่ "ทำ" จริง (ใบ 12 ตัวนับให้ใบ 04): ซื้อใบ · จ่ายเงิน · ตั้งธง (บน/เครื่องราง/หวังผล) · แก้บน
const isAct = (c) => c.ticket || c.effects?.money?.amount < 0 || (c.sets_flags ?? []).length > 0 || c.redeem === 'full' || c.redeem === 'light';

// หลังผลตัวเลือกปกติลงแล้ว: จำเงินตอนตั้งธงหวังผล · นับกิจกรรม · ซื้อใบ · คืนการ์ดที่ตัวเลือกนี้ก่อ
export function beliefChoice(st, ev, c) {
  if (!ev.belief) return [];
  const b = stateOf(st);
  for (const f of c.sets_flags ?? []) if (f.startsWith(HOPE)) b.hope[f] = realWorth(st);
  if (isAct(c)) b.acts++;
  return c.ticket && kind(ev) === 'lottery_numen' ? [buyTicket(st, ev)] : [];
}

// จำนวนครั้งที่เลือกทำกิจกรรมสายมูในชีวิตนี้ — แกน ④ ทางโลก ↔ ทางธรรม ของฉายา (ใบ 04) อ่าน
export const beliefActs = (st) => st.belief?.acts ?? 0;
