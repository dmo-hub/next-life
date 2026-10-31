// บอท 6 บุคลิก (ใบ 07): สุ่มล้วน · สายบุญ · สายบาป · สายเงิน/เสี่ยง · สายครอบครัว · สายสุขภาพ
// ทุกตัวเลือกจากตัวเลือกที่กดได้ (openChoices) · ตัดสินจากป้ายบนการ์ด (card.fx) ที่ผู้เล่นเห็นเท่านั้น
// ข้อยกเว้นเดียว: สายบุญ/บาปอ่านป้ายบุญบาปของตัวเลือก (holder.pending · ต่างโลกอ่าน ISEKAI_MERIT ของการ์ด) แทนการอ่านความหมายของข้อความแบบที่คนทำ — ไม่อ่านบัญชี
// เสมอกันสุ่มจาก stream ของบอท · holder = st (การ์ดชีวิต) หรือ af (การ์ดระหว่างชาติ)
import { openChoices, meritId, MERIT_WEIGHTS, MERIT_LEVELS, SIN_CATS, FLAG_CATS, STAT_LABELS, STAT_KEYS, makeRng, mixSeed, stageOf, lifeFocusOffers, lifeFocusDefs, setLifeFocus, FOCUS_FLOW, ISEKAI_FX, ISEKAI_LINK, ISEKAI_MERIT } from '../src/engine/index.mjs';

export const random = (card, rng) => {
  const open = openChoices(card);
  return open[rng.int(0, open.length - 1)];
};

// เลือกตัวที่คะแนนสูงสุด เสมอกันสุ่ม
const best = (card, rng, score) => {
  const open = openChoices(card);
  const s = open.map(score);
  const top = Math.max(...s);
  const ties = open.filter((_, j) => s[j] === top);
  return ties[rng.int(0, ties.length - 1)];
};

const meritScore = (c) =>
  (c.merit ?? []).reduce((s, t) => {
    const id = meritId(t.cat);
    if (id === 'neutral') return s;
    const v = MERIT_WEIGHTS[id] * (FLAG_CATS.includes(id) ? 1 : MERIT_LEVELS[t.level]);
    return s + (SIN_CATS.includes(id) ? -v : v);
  }, 0);
const extreme = (sign) => (card, rng, h) => {
  if (card.kind === 'isekai') {
    const m = ISEKAI_MERIT[card.id];
    return m ? best(card, rng, (i) => sign * meritScore({ merit: m[i] ?? [] })) : random(card, rng);
  }
  // การ์ดจัดสรรเงิน/เลือกทางเกิดไม่มีป้ายบุญบาป
  if (!h.pending?.choices) return random(card, rng);
  return best(card, rng, (i) => sign * meritScore(h.pending.choices[i]));
};

// ป้ายที่ผู้เล่นเห็นแตกเป็นชิ้นตาม " · " — ชิ้นค่าสถานะคือ "<ชื่อค่า> ↑/↓" ต่อท้าย "ระยะยาว" ได้ · การ์ดระหว่างชาติขึ้นต้น "ชาติหน้า"
const NAME = Object.fromEntries(Object.entries(STAT_LABELS).map(([k, v]) => [v, k]));
export function readFx(fx) {
  const out = { stat: {}, tags: [] };
  for (const part of (fx ?? '').split(' · ').filter(Boolean)) {
    const m = part.match(/(\S+) (↑|↓)/);
    const key = m && (NAME[m[1]] ?? (m[1] === 'รายได้' ? 'income' : null));
    if (key) out.stat[key] = (out.stat[key] ?? 0) + (m[2] === '↑' ? 1 : -1) * (part.includes('ระยะยาว') ? 2 : 1);
    else out.tags.push(part);
  }
  return out;
}

// ป้ายต่างโลก (เจ้าของเคาะทาง 1 · 2026-10-31): ใบทุ่มเทเขียน "<ชื่อค่าต่างโลก> · … ขึ้น/ลด" — แปลงเป็นค่าโลกหลักตาม ISEKAI_LINK
// ที่แกนใช้สะท้อนผลกลับอยู่แล้ว (ชีวิต→สุขภาพ · ทอง→เงิน) ให้น้ำหนักบุคลิกชุดเดิมใช้ได้ · ใบเหตุการณ์บอกแค่โอกาส "70%" → ป้ายเสี่ยงชุดเดิม
const ISK_NAME = Object.fromEntries(Object.entries(ISEKAI_FX).map(([k, v]) => [v, k]));
const ISK_KEY = { ...ISEKAI_LINK, hp: 'health', gold: 'money' };
export function readIsekaiFx(fx) {
  const out = { stat: {}, tags: [] };
  const text = fx ?? '';
  const m = text.match(/^(.+) (ขึ้น|ลด)$/);
  if (m) for (const n of m[1].split(' · ')) {
    const key = ISK_KEY[ISK_NAME[n]];
    if (key) out.stat[key] = (out.stat[key] ?? 0) + (m[2] === 'ขึ้น' ? 1 : -1);
  }
  const pc = text.match(/^([0-9]+)%/);
  if (pc) out.tags.push(Number(pc[1]) < 50 ? 'เสี่ยงสูง' : Number(pc[1]) < 80 ? 'เสี่ยงกลาง' : 'สำเร็จ ?');
  return out;
}

// คะแนนจากน้ำหนักต่อค่าสถานะ + ป้ายคำ (ลงทุน · กู้ · เสี่ยง · สำเร็จ ?) · ป้าย "?" ล้วน = ไม่รู้ผล ได้ 0
const byLabel = (w, tag = () => 0) => (card) => (i) => {
  const { stat, tags } = card.kind === 'isekai' ? readIsekaiFx(card.fx?.[i]) : readFx(card.fx?.[i]);
  let s = 0;
  for (const [k, v] of Object.entries(stat)) s += (w[k] ?? 0) * v;
  for (const t of tags) s += tag(t);
  return s;
};

const RISK_TAG = { เสี่ยงสูง: 2, เสี่ยงกลาง: 1, ลงทุน: 2, 'สำเร็จ ?': 1 };
// การ์ดจัดสรรเงินมีแต่ชื่อทางเลือก — สายเสี่ยงจัดลำดับจากชื่อที่เห็น หุ้นก่อนที่ดินก่อนทอง
const ALLOC_RANK = ['หุ้น', 'ที่ดิน', 'ทอง', 'แบ่งเท่า'];
const allocScore = (card) => (i) => {
  const r = ALLOC_RANK.findIndex((w) => card.choices[i].includes(w));
  return r < 0 ? 0 : ALLOC_RANK.length - r;
};
const money = (card, rng, h) => {
  if (h.pending?.alloc) return best(card, rng, allocScore(card));
  return best(card, rng, byLabel({ money: 2, income: 3 }, (t) => RISK_TAG[t] ?? (t.startsWith('กู้') ? 1 : 0))(card));
};

const labelBot = (w) => (card, rng, h) => (h.pending?.alloc ? random(card, rng) : best(card, rng, byLabel(w)(card)));

// สายต่างโลก (B68d): กดรับการ์ดชวนไปต่างโลกใบแรก การ์ดอื่นสุ่ม · ประกาศ isekai ให้ playLife ส่งการ์ดชวนมาให้เลือก
// บอทใน BOTS ไม่ประกาศ ⇒ ปฏิเสธทุกใบโดยไม่ดึงเลขสุ่ม ชีวิตจึงเดินเท่าเดิม
export const isekaiBot = Object.assign((card, rng, h) => (card.entry ? 0 : random(card, rng, h)), { isekai: true });

// บอทเฉย (ไอเดีย 65-15): กดปุ่มที่ป้ายผลขยับน้อยสุด ไม่แตะทางเสี่ยง/ลงทุน/กู้ — ใช้วัดว่าการไม่ทำอะไรไม่ได้ชีวิตดีกว่าคนที่เลือกจริง
// ไม่อยู่ใน BOTS: ด่านที่วนบุคลิกทั้งชุดจะได้ตัวเลขเดิม · harness/passive.mjs เรียกตรง
const PASSIVE_ACT = /เสี่ยง|ลงทุน|กู้|สำเร็จ/;
const stillness = (card) => (i) => {
  const { stat, tags } = readFx(card.fx?.[i]);
  return -(Object.values(stat).reduce((s, v) => s + Math.abs(v), 0) + 2 * tags.filter((t) => PASSIVE_ACT.test(t)).length);
};
export const passive = (card, rng, h) => (h.pending?.alloc || !card.fx ? random(card, rng) : best(card, rng, stillness(card)));


// นโยบายโฟกัสของบอท (โฟกัสใบ 04): ราว 1/3 ใช้ชีวิตตามน้ำทั้งชีวิต · ที่เหลือเลือกโฟกัสที่ดันค่าเด่นของตัวเองขึ้น ทบทวนเมื่อขึ้นช่วงวัยใหม่หรือโฟกัสเดิมปิด
// ไม่มีนโยบายนี้ บอทไม่เคยโฟกัส ⇒ ประตูเข้าสายปิดตลอด ด่านที่วัดสายการเมือง/ธุรกิจ/บวชจะเหลือแค่ชีวิตที่ถูกชวน
// สุ่มจาก stream ของ seed ชีวิต (แยกจากบอทเลือกตัวเลือกและ rng ของโลก) — WeakMap ต่อชีวิต จึงไม่เขียนอะไรลง state
export const FOCUS_FLOW_SHARE = 1 / 3;
const FOCUS_SALT = 0x3c6ef372;
const focusMemo = new WeakMap();
// key = ค่าเด่นที่บอทตัวนั้นดัน (ไม่ส่ง = ค่าสถานะที่สูงสุดตอนนั้น) · บอทสายเงินดันเงิน — ไม่งั้นโฟกัสที่ผลมีแต่เงิน (ทำธุรกิจ · ทางลัด) ไม่มีบอทไหนเลือก
// ประตูธุรกิจ/ทางลัดจึงไม่เคยเปิด ตัวเลือกหลังประตูกับการ์ดตามมาไม่มีใครถึงเลยในด่าน full
export function botFocus(st, key) {
  let m = focusMemo.get(st);
  if (!m) {
    const rng = makeRng(mixSeed(st.seed ^ FOCUS_SALT, st.gen ?? 1));
    m = { rng, flow: rng.next() < FOCUS_FLOW_SHARE, stage: null };
    focusMemo.set(st, m);
  }
  if (m.flow) return;
  const offers = lifeFocusOffers(st).filter((id) => id !== FOCUS_FLOW);
  const s = stageOf(st.age);
  if (s === m.stage && (!st.focus || offers.includes(st.focus))) return;
  m.stage = s;
  if (!offers.length) return;
  const defs = lifeFocusDefs(st);
  const top = key ?? STAT_KEYS.reduce((a, k) => (st[k] > st[a] ? k : a));
  const fit = offers.filter((id) => defs[id].fx?.[top] > 0);
  const from = fit.length ? fit : offers;
  setLifeFocus(st, from[Math.floor(m.rng.next() * from.length)]);
}
export const botFlows = (st) => !!focusMemo.get(st)?.flow;
const withFocus = (bot, key) => Object.assign((...a) => bot(...a), bot, { focus: (st) => botFocus(st, key) });

const RAW_BOTS = {
  สุ่ม: random,
  สายบุญ: extreme(1),
  สายบาป: extreme(-1),
  สายเงิน: money,
  // ครอบครัวรองด้วยความสุข · สุขภาพรองด้วยความสุข — กันเสมอกันทั้งใบจนกลายเป็นบอทสุ่ม
  สายครอบครัว: labelBot({ relations: 3, happiness: 1 }),
  สายสุขภาพ: labelBot({ health: 3, happiness: 1 }),
};
const FOCUS_KEY = { สายเงิน: 'money' };
export const BOTS = Object.fromEntries(Object.entries(RAW_BOTS).map(([k, b]) => [k, withFocus(b, FOCUS_KEY[k])]));
