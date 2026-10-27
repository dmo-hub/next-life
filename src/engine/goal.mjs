// ป้ายเป้าหมายถัดไป (B89): บรรทัดเดียวบนหัวการ์ด บอกขั้นถัดไปของสายที่อยู่ + ค่าที่ยังขาด
// อ่านอย่างเดียว ไม่ดึงเลขสุ่ม ไม่เขียน state — ชีวิตเดินเหมือนไม่มีป้าย
// บอกทิศ ไม่บอกเลขเกณฑ์ ไม่บอกโอกาส · ด่านที่ตัดสินด้วยน้ำหนัก (สอบมหาวิทยาลัย เลือกตั้ง) ไม่บอกเงื่อนไข · บุญบาปไม่ขึ้นป้าย
import { TRACKS, CADET_NEED } from './career.mjs';
import { PROMO, OFFICE, officeFull, stepName } from './rank.mjs';
import { isWorking, moodMul, schoolOf } from './life.mjs';

// สุขภาพพูดว่า "แข็งแรง" อ่านเป็นภาษาคนกว่า "มีสุขภาพมากกว่านี้"
const SHORT_TH = { knowledge: 'ความรู้', relations: 'ความสัมพันธ์', network: 'คอนเน็คชั่น' };
function shortText(st, need) {
  const keys = Object.keys(need).filter((k) => st[k] < need[k]);
  if (!keys.length) return null;
  const has = keys.filter((k) => k !== 'health').map((k) => SHORT_TH[k]);
  const fit = keys.includes('health');
  if (!has.length) return 'ต้องแข็งแรงกว่านี้';
  return `ต้องมี${has.join('และ')}มากกว่านี้${fit ? 'และแข็งแรงกว่านี้' : ''}`;
}
const minOf = (req) => Object.fromEntries(Object.entries(req.stats).map(([k, v]) => [k, v.min]));

// จบช่วงเรียนนี้อีกกี่ปี · ช่วงที่ปลายทางมีด่านนายร้อย (เกณฑ์ตายตัว) ต่อท้ายค่าที่ยังไม่ถึง
function schoolGoal(st) {
  const id = schoolOf(st);
  const t = TRACKS[id];
  if (!t || t.until <= st.age) return null;
  const line = `เรียนจบ${t.name}อีก ${t.until - st.age} ปี`;
  const cadet = t.exam && shortText(st, minOf(CADET_NEED));
  return cadet ? `${line} · นายร้อย${cadet}` : line;
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
function ladderGoal(st) {
  const p = PROMO[st.ladder.id]?.[st.ladder.rank];
  if (!p) return null;
  const next = `ถัดไป ${stepName(st, st.ladder.rank + 1)}`;
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
