// คำศัพท์ปิดของ schema เหตุการณ์ (ใบ 07 + ส่วนต่อ belief ใบ 12) — ทุกกติกาอ่านจากที่นี่ที่เดียว
import { STAGES, AFTERLIFE_STAGE, CLASSES, SEXES } from '../../engine/life.mjs';
import { MAX_AGE } from '../../engine/era.mjs';

export const STAT_KEYS = ['health', 'happiness', 'knowledge', 'relations'];
export const EFFECT_KEYS = [...STAT_KEYS, 'money'];
export { CLASSES, SEXES };

// ช่วงอายุของแต่ละช่วงวัย ใช้ตรวจว่า at_age อยู่ในช่วงที่ประกาศ
export const STAGE_AGES = Object.fromEntries(
  STAGES.map((s, i) => [s.name, [s.from, i + 1 < STAGES.length ? STAGES[i + 1].from - 1 : MAX_AGE]]),
);
export const STAGE_NAMES = [...STAGES.map((s) => s.name), AFTERLIFE_STAGE];
export { AFTERLIFE_STAGE };

// หมวดเนื้อหาตามใบ 07 (ช่วงวัย × หมวด)
export const CATEGORIES = ['study', 'work_money', 'family', 'health', 'belief', 'society'];

// หมวดบุญบาป: บาป 8 หมวดพระมาลัย + หมวด 9 ที่เกมตั้งเอง (ใบ 09/12) · บุญ ทาน/ศีล/ภาวนา + ประจำวัน · กลาง
// ชื่อไทยรับเป็นชื่อแทนได้ ตัวอย่างในใบ 12 เขียนหมวดเป็นไทย
export const MERIT_CATS = [
  { id: 'greed_harm', th: 'โลภจนเบียดเบียน', kind: 'sin' },
  { id: 'disturb_monk', th: 'รบกวนนักบวช', kind: 'sin' },
  { id: 'abuse_elders', th: 'ด่าตีพ่อแม่ผู้ใหญ่', kind: 'sin' },
  { id: 'unjust_judgment', th: 'ตัดสินไม่เป็นธรรม', kind: 'sin' },
  { id: 'adultery', th: 'ผิดเมียผู้อื่น', kind: 'sin' },
  { id: 'love_charm', th: 'เสน่ห์ยาแฝด', kind: 'sin' },
  { id: 'oppress_subjects', th: 'กดขี่ผู้ใต้ปกครอง', kind: 'sin' },
  { id: 'intoxicants', th: 'ดื่มสุรา', kind: 'sin' },
  { id: 'vow_broken', th: 'บนแล้วไม่แก้', kind: 'sin', flag: true },
  { id: 'dana', th: 'ทาน', kind: 'merit' },
  { id: 'sila', th: 'ศีล', kind: 'merit' },
  { id: 'bhavana', th: 'ภาวนา', kind: 'merit' },
  { id: 'care_parents', th: 'ดูแลพ่อแม่', kind: 'merit' },
  { id: 'help_others', th: 'ช่วยคน', kind: 'merit' },
  { id: 'neutral', th: 'กลาง', kind: 'neutral' },
];
const CAT_BY_NAME = new Map(MERIT_CATS.flatMap((c) => [[c.id, c], [c.th, c]]));
export const meritCat = (name) => CAT_BY_NAME.get(name);

// ช่องแทนค่าข้อความ (ใบ 07) กับค่าที่ยาวที่สุดที่เติมได้ — ด่านความยาววัดหลังแทนค่าพวกนี้
// {ครับ} {ผม} เป็นคำพูดที่อ่านจากค่า "คำพูด" ไม่ใช่เพศกำเนิด
export const PLACEHOLDERS = {
  ชื่อ: 'ก'.repeat(20),
  อายุ: '120',
  จังหวัด: 'พระนครศรีอยุธยา',
  ภาค: 'กรุงเทพฯ และปริมณฑล',
  เงิน: '999,999,999',
  ปี: '2650',
  ชื่อลูก: 'ก'.repeat(20),
  ครับ: 'ครับ',
  ผม: 'ผม',
};
// ช่องที่ชื่อบอกว่าอ่านบัญชีบุญบาป/ตัวคูณหวย — ใบ 12 ข้อ (ฉ) แยกเป็นกติกาของตัวเอง
export const LEDGER_PLACEHOLDER = /บุญ|บาป|บัญชี|กรรม|ledger|merit|mult|odds/i;

// เพดานความยาว วัดจาก docs/cards.html (การ์ด 420×780) แล้วเผื่อ — เจ้าของเคาะตัวเลขแล้ว
export const MAX_LEN = { title: 30, text: 240, choice: 32 };
// เจ้าของเคาะ: การ์ดที่ให้เลือกต้องมีอย่างน้อย 4 ทาง ไม่มีเพดาน · การ์ดเล่าเรื่อง (0 ตัวเลือก ใบ 07) ยกเว้น
export const MIN_CHOICES = 4;

export const BELIEF_KINDS = ['fortune', 'auspicious_time', 'lottery_numen', 'vow', 'amulet', 'merit_wish'];
export const TRADITIONS = ['พุทธ', 'ผี', 'พราหมณ์', 'ผสม'];
// กลไกนอกคัมภีร์ที่ต้องประกาศ (ใบ 12 ป้ายที่มา)
export const OUTSIDE_CANON = ['odds_by_merit', 'vow_broken', 'intent_merit'];
export const INTENTS = ['sincere', 'wish_for_gain'];
export const REDEEM = ['full', 'light', 'defer', 'none'];
// ผลที่กิจกรรมสายมูให้ได้ (ใบ 12 ข้อ ข) — เงินต้องเป็นจ่ายออกเท่านั้น
export const BELIEF_EFFECTS = ['happiness', 'relations', 'money'];
export const LOTTERY = { maxMult: 4, cap: 5, prizeTable: 'finance.lottery', prizeTextBefore: 2560 };
export const VOW_LIGHT_MAX = 0.05;

export const FLAG_RE = /^[a-z][a-z0-9_]*(:[a-z0-9_]+)?$/;
export const ID_RE = /^[a-z][a-z0-9_]*$/;
export const YEAR_MIN = 2400;
export const YEAR_MAX = 2700;
export const FAMILY_ROLES = ['parent', 'spouse', 'child'];
