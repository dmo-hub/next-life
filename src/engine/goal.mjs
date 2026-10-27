// ป้ายเป้าหมายถัดไป (B89): บรรทัดเดียวบนหัวการ์ด บอกขั้นถัดไปของสายที่อยู่ + ค่าที่ยังขาด
// อ่านอย่างเดียว ไม่ดึงเลขสุ่ม ไม่เขียน state — ชีวิตเดินเหมือนไม่มีป้าย
// บอกทิศ ไม่บอกเลขเกณฑ์ ไม่บอกโอกาส · ด่านที่ตัดสินด้วยน้ำหนัก (สอบมหาวิทยาลัย เลือกตั้ง) ไม่บอกเงื่อนไข · บุญบาปไม่ขึ้นป้าย
import { TRACKS } from './career.mjs';
import { PROMO, OFFICE, officeFull, stepName, ladderOf } from './rank.mjs';
import { isWorking, moodMul, schoolOf } from './life.mjs';

// ข้อความสั้นแบบ "ขาด…" — ป้ายต้องไม่ทำให้แถบหัวการ์ดตกบรรทัดเพิ่ม (เจ้าของเคาะ B89 A6)
const SHORT_TH = { knowledge: 'ความรู้', relations: 'ความสัมพันธ์', network: 'คอนเน็คชั่น', health: 'ความแข็งแรง' };
function shortText(st, need) {
  const keys = Object.keys(need).filter((k) => st[k] < need[k]);
  if (!keys.length) return null;
  return `ขาด${keys.map((k) => SHORT_TH[k]).join('และ')}`;
}

// จบช่วงเรียนนี้อีกกี่ปี · ป้ายนี้ขึ้นแทนช่อง "กำลังเรียน…" บนแถบ จึงต้องไม่ยาวกว่าข้อความนั้น
// ไม่ต่อท้ายเกณฑ์นายร้อย — ต่อแล้วแถบตกบรรทัดบนจอแคบทุกครั้ง
function schoolGoal(st) {
  const id = schoolOf(st);
  const t = TRACKS[id];
  if (!t || t.until <= st.age) return null;
  return `จบ${t.name}อีก ${t.until - st.age} ปี`;
}

// ครบวาระเมื่อไร + ขั้นที่ลุ้นต่อ · ยอดสาย = ไม่ขึ้น · ท้องถิ่นที่พ้นตำแหน่งตามอายุก่อนครบวาระ = ไม่ขึ้น
function officeGoal(st) {
  const steps = st.content.era.careers.office.steps;
  const up = steps[st.office.rank + 1];
  if (!up) return null;
  if (!officeFull(st) && st.office.next > OFFICE.ageTo + 1) return null;
  const n = st.office.next - st.age;
  return `${n > 0 ? `ครบวาระอีก ${n} ปี` : 'ครบวาระปีนี้'} · ลุ้น${up.name}`;
}

// ขั้นถัดไปในสายยศ: ค่าไม่ถึงบอกชื่อค่า · ถึงแล้วบอกปีที่เหลือ (ความสุขต่ำนับปีช้าลง จึงหารตัวคูณเดียวกับแกน)
// ขั้นที่ตั้งชื่อจากอาชีพ บอกแค่ส่วนต่อท้าย — ชื่ออาชีพอยู่บนแถบเดียวกันแล้ว ซ้ำแล้วแถบตกบรรทัด
function ladderGoal(st) {
  const p = PROMO[st.ladder.id]?.[st.ladder.rank];
  if (!p) return null;
  const step = ladderOf(st).steps[st.ladder.rank + 1];
  const next = `ขึ้น${step.name ?? step.suffix ?? stepName(st, st.ladder.rank + 1)}`;
  const short = shortText(st, p.need);
  if (short) return `${next} · ${short}`;
  return `${next} · อีกราว ${Math.max(1, Math.ceil((p.years - st.ladder.prog) / moodMul(st)))} ปี`;
}

// ลำดับเมื่อเข้าหลายสาย: เรียน > การเมืองเต็มเวลา > ยศ > การเมืองท้องถิ่น (ทำควบงาน)
export function nextGoal(st) {
  if (schoolOf(st) !== 'none') return schoolGoal(st);
  if (st.office && officeFull(st)) return officeGoal(st);
  const rank = st.ladder && isWorking(st) && ladderGoal(st);
  if (rank) return rank;
  return st.office ? officeGoal(st) : null;
}
