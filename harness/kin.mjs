// ข้อความที่เอ่ยถึงคนในบ้าน ↔ เงื่อนไขครอบครัวของการ์ด (B138): การ์ด/ตัวเลือกที่พูดถึงแม่ พ่อ คู่ ลูก สัตว์เลี้ยง
// ต้องมี when.family (ทั้งใบ) หรือ requires.family (ตัวเลือก) ที่บังคับให้คนนั้นยังอยู่ ไม่งั้นขึ้นทั้งที่เขาตายไปแล้ว
// หลานไม่ตรวจ — คำว่าหลานในเนื้อหาหมายถึงหลานลุงป้าด้วย ไม่ได้ผูกกับหลานจริงในบ้าน
import { MIN_CHOICES, AFTERLIFE_STAGE } from '../src/node/lint/vocab.mjs';

// ญาติของคนอื่น: "พ่อของพลทหาร" "แม่เพื่อน" — "ของคุณ" ยังเป็นญาติเรา
const OTHERS = '(?!\\s*ของ(?!คุณ))(?!\\s*(?:เพื่อน|แฟน|เขา|เธอ|เด็ก|ลูกศิษย์|คนไข้|ลูกค้า|ลูกน้อง|เจ้านาย|ครู|ข้างบ้าน|ใคร|ผู้บริจาค|พลทหาร))';
// คำซ้อนที่ขึ้นต้นด้วยพ่อ/แม่แต่ไม่ใช่พ่อแม่ของเรา (แม่ค้า · พ่อบ้าน · แม่น้ำ · พ่อแม่ทูนหัว)
const PARENT_TAIL = '(?!ค้า|ครัว|บ้าน|มด|หม้าย|ม่าย|น้ำ|ทัพ|ชี|พิมพ์|เหล็ก|แบบ|ไม้|ลาย|ข่าย|ทีม|นม|นยำ|น[^ั่]|สื่อ|ตา|ยาย|เลี้ยง|ผัว|ปู่|เฒ่า|หมอ|เล้า|พระ|ศรี|กอง|งาน|เจ้า|ใหญ่|หลวง|ลูก|ยก|ค้ำ|บุญธรรม|ขุน|เหย้า|เรือน|มือใหม่|ทูนหัว|แม่ทูนหัว|คนใหม่)';
// คนที่เป็นพ่อ/แม่เอง หรือพ่อแม่ที่ไม่ใช่ของเรา (บริษัทแม่ · บางคนแม่มา · ลูกเพื่อนที่แม่ป่วย · เป็นแม่คน)
// สูตร/ฝีมือของแม่เป็นความทรงจำ เอ่ยได้แม้แม่ไม่อยู่แล้ว
const PARENT_HEAD = '(?<!ไ|ลูก|คุณ|เป็น|ได้เป็น|ฐานะ|เหมือน|ไม่มี|กำพร้า|เลี้ยง|บุญธรรม|เจ้า|บริษัท|บางคน|บางบ้าน|เพื่อนที่|(?:สูตร|ฝีมือ)\\S{0,10})';
export const KIN_WORDS = {
  mother: new RegExp(`${PARENT_HEAD}(?<!พ่อ|พ่อกับ|พ่อและ)แม่${PARENT_TAIL}${OTHERS}`),
  father: new RegExp(`${PARENT_HEAD}พ่อ(?!แม่|กับแม่|และแม่)${PARENT_TAIL}${OTHERS}`),
  parents: new RegExp(`${PARENT_HEAD}(?:พ่อแม่|พ่อกับแม่|พ่อและแม่)(?!ทูนหัว)${OTHERS}`),
  spouse: /(?<!ว่าที่|อดีต|เป็น|หา|นาย)(?:สามี|ภรรยา|ภริยา|เมีย(?!น้อย)|ผัว|คู่ชีวิต|คู่ครอง)(?!\s*(?:ของ|เพื่อน|คนอื่น|เขา|เธอ|ใหม่|นาย))/,
  // "มีลูก" ส่วนใหญ่เป็นเรื่องสมมุติหรือลูกคนอื่น (จะมีลูกเมื่อไหร่ · เขามีลูกเล็กสามคน) · ญาติคนอื่นเช็กหลังคำขยาย (ลูกชายเขา)
  child: /(?<!ป|ลูกพี่|เป็น|มี|เด็ก|รุ่น|หันมามอง)ลูก(?!(?:ชาย|สาว|คนโต|คนเล็ก|เล็ก|น้อย)?\s*(?:ของ(?!คุณ)|เพื่อน|คนอื่น|เขา|เธอ|ข้างบ้าน|ชาวบ้าน|ใคร|ร้าน|นาย|ป้า|ลุง|น้า|อา|ยาย|ผู้))(?!ค้า|น้อง|จ้าง|หนี้|ศิษย์|เสือ|อม|ชิ้น|บอล|เต๋า|หมา|แมว|ไก่|วัว|ควาย|ปลา|หลาน|พี่|ทีม|บ้าน|กตัญญู|ผู้|เล่น|ตา|กุญแจ|ปืน|โป่ง|บาศก์|ทุ่ง|ครึ่ง|เขย|สะใภ้|หาบ|ไม้|ข่าง|เดียว|สมุน|กรุง|หม้อ|เจี๊ยบ|ประคำ|โซ่|ยาง|มะ|ชุบ|ตุ้ม|คลื่น|ไฟ|เห็บ|ข้าว|หิน|เห็ด|ปัด|ลอย|รัก|อ่อน|น้ำ|เปตอง|ใหญ่|แหง่|ห้าตัว|ได้ทุกปี)(?!\S{0,8}พ่อแม่)/,
  pet: /(?:หมา|แมว|นก|สุนัข)(?:ที่|ของ)(?:บ้าน|เลี้ยง|คุณ)|สัตว์เลี้ยง/,
};
// บทบาทที่ต้องยังอยู่ · sex = ต้องเป็นคนเพศนั้น
const NEED = {
  mother: { role: 'parent', sex: 'หญิง' },
  father: { role: 'parent', sex: 'ชาย' },
  parents: { role: 'parent' },
  spouse: { role: 'spouse', flag: 'married' },
  child: { role: 'child', flag: 'has_kids' },
  pet: { role: 'pet' },
};
// วัยที่ผู้เล่นยังมีลูก/คู่เองไม่ได้ — "ลูก" ในการ์ดเด็กคือตัวผู้เล่นหรือลูกบ้านอื่น
const YOUNG_STAGES = ['เด็ก', 'วัยรุ่น'];
const youngCard = (e) => YOUNG_STAGES.includes(e.stage) || (e.when?.age && e.when.age[1] < 18);

const meets = (fs = [], flags = [], need) =>
  fs.some((f) => f.role === need.role && f.alive !== false && !(f.count && f.count[1] === 0) && (!need.sex || f.sex === need.sex)) ||
  (need.flag && flags.includes(need.flag));

// จุดข้อความของการ์ดที่เอ่ยถึงคนในบ้าน → [at, who, need, ข้อความ, ดัชนีที่เจอ, requires ของตัวเลือก]
// at = 'text' (ชื่อ+เนื้อการ์ด) หรือ '#i' (ตัวเลือก+ผลของมัน)
// การ์ดสูญเสีย (when.loss) เล่าถึงคนที่จากไปได้ · การ์ดที่ให้กำเนิดคนนั้นเอง (ตั้งครรภ์) พูดถึงเขาได้ก่อนเขามา
function* kinSpots(e) {
  const w = e.when ?? {};
  const skip = new Set(w.loss ? (w.loss.roles ?? Object.values(NEED).map((n) => n.role)) : []);
  for (const o of (e.choices ?? []).flatMap((c) => [c, ...(c.outcomes ?? [])])) for (const op of o.family ?? []) if (op.add) skip.add(op.add);
  const spots = [['text', `${e.title ?? ''} ${e.text ?? ''}`, null]];
  // ฉากระหว่างชาติไม่มีระบบล็อกตัวเลือก — requires ไม่นับ
  (e.choices ?? []).forEach((c, i) => spots.push([`#${i}`, [c.text, c.result, ...(c.outcomes ?? []).map((o) => o.text)].filter(Boolean).join(' | '), e.stage === AFTERLIFE_STAGE ? null : c.requires]));
  for (const [at, text, q] of spots) {
    for (const [who, re] of Object.entries(KIN_WORDS)) {
      const need = NEED[who];
      if (skip.has(need.role) || ((who === 'child' || who === 'spouse') && youngCard(e))) continue;
      const m = text.match(re);
      if (m) yield [at, who, need, text, m.index, q];
    }
  }
}
const around = (text, i) => text.slice(Math.max(0, i - 20), i + 30).replace(/\s+/g, ' ');

// จุดที่เอ่ยถึงคนในบ้านแต่ไม่มีเงื่อนไขกั้น → [{id, at, who, text}]
export function kinGaps(events) {
  const out = [];
  for (const e of events) {
    for (const [at, who, need, text, i, q] of kinSpots(e)) {
      if (meets(e.when?.family, e.when?.flags?.has, need) || meets(q?.family, q?.flags?.has, need)) continue;
      out.push({ id: e.id, at, who, text: around(text, i) });
    }
  }
  return out;
}

// ตอนการ์ดขึ้นจริง: จุดที่ยังเปิดอยู่ (เนื้อการ์ด หรือตัวเลือกที่ไม่ล็อก) แต่คนที่เอ่ยถึงไม่มีชีวิตแล้ว
const hasLiving = (st, need) => need.role === 'parent'
  ? st.parents.some((p) => p.alive && (!need.sex || p.sex === need.sex))
  : (st.kin ?? []).some((m) => m.role === need.role && m.alive && !m.left);
export function kinDeadRefs(card, ev, st) {
  const out = [];
  for (const [at, who, need] of kinSpots(ev)) {
    if (at !== 'text' && card.locked?.[Number(at.slice(1))]) continue;
    if (!hasLiving(st, need)) out.push(`${ev.id} ${at} ${who}`);
  }
  return out;
}

// การ์ดที่ล็อกตัวเลือกด้วยครอบครัวจนเหลือตัวกดได้น้อยกว่า min ตอนคนนั้นไม่อยู่ — ข้อความพูดถึงเขาหลายตัวเลือกแบบนี้
// ควรกั้นทั้งใบด้วย when.family แทน · ล็อกได้ 1 ตัวในการ์ด 4 ตัวเลือก (แบบที่ตัวเลือกพึ่งพ่อแม่ทำมาแต่แรก)
export const FAMILY_OPEN_MIN = MIN_CHOICES - 1;
export function familyLockShort(events, min = FAMILY_OPEN_MIN) {
  const out = [];
  for (const e of events) {
    const cs = e.choices ?? [];
    // เงื่อนไขเดียวกับที่การ์ดกั้นทั้งใบไว้แล้ว ล็อกไม่ได้จริง
    const locked = cs.filter((c) => c.requires?.family && !c.requires.family.every((f) => meets(e.when?.family, [], { role: f.role, sex: f.sex }))).length;
    if (locked && cs.length - locked < min) out.push({ id: e.id, open: cs.length - locked, of: cs.length });
  }
  return out;
}
