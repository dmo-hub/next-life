// คำเตือน (ไม่ตก): การ์ดวัยทำงานที่มีคำออฟฟิศแต่ไม่ได้กรองอาชีพ/สาย และไม่ใช้คำแทน {ที่ทำงาน} {คนคุมงาน}
// รายการคำเป็นของเลนนี้เอง ไม่ใช่ป้ายสายของ harness/work-lane.mjs · ที่นี่จับจากคำในข้อความ ไม่ใช่จากป้าย
// สลับเป็นตกหลังกวาดการ์ดค้างครบ (ใบ 184) · การ์ดที่คำออฟฟิศถูกต้องอยู่แล้ว (ที่ประชุมหมู่บ้าน) ใส่ office_ok พร้อมเหตุผล
import { isObj, textsOf } from './util.mjs';

export const OFFICE_STAGES = ['หนุ่มสาว', 'ทำงาน', 'กลางคน'];
export const OFFICE_WORDS = ['ออฟฟิศ', 'ประชุม', 'เงินเดือน', 'โบนัส', 'บริษัท', 'แผนก', 'ใบลาออก', 'ลาพักร้อน', 'หัวหน้างาน'];
// อาชีพ/สายที่คำออฟฟิศอ่านถูก · technician อยู่ด้วยเพราะการ์ดไฟมอดกลางประชุมกรองไว้แล้ว
export const OFFICE_OCC = ['clerk', 'professional', 'manager', 'technician', 'officer', 'senior_officer'];
export const OFFICE_LADDER = ['gov', 'private'];
const PLACEHOLDER = /\{(ที่ทำงาน|คนคุมงาน)\}/;
const EXEMPT_MIN = 6;

const subsetOf = (v, ok) => Array.isArray(v) && v.length > 0 && v.every((x) => ok.includes(x));

function officeHits(e) {
  const hits = new Set();
  for (const { s } of textsOf(e)) for (const w of OFFICE_WORDS) if (s.includes(w)) hits.add(w);
  return [...hits];
}

// กรองอาชีพได้แค่กลุ่มออฟฟิศ หรือกรองสายได้แค่ gov/private ถึงจะอ่านคำออฟฟิศถูกกับทุกคนที่เจอใบนี้
export function officeFiltered(e) {
  const w = isObj(e.when) ? e.when : {};
  if (w.occupation !== undefined) return subsetOf(w.occupation, OFFICE_OCC) && !(Array.isArray(w.ladder) && w.ladder.includes('trade'));
  return subsetOf(w.ladder, OFFICE_LADDER);
}

export function officeGaps(docs) {
  const missing = [];
  let total = 0;
  let exempt = 0;
  for (const { file, doc } of docs) {
    if (!isObj(doc) || !Array.isArray(doc.events)) continue;
    for (const e of doc.events) {
      if (!isObj(e) || !OFFICE_STAGES.includes(e.stage)) continue;
      const words = officeHits(e);
      if (!words.length) continue;
      total++;
      if (e.office_ok !== undefined) { exempt++; continue; }
      if (PLACEHOLDER.test(JSON.stringify(e)) || officeFiltered(e)) continue;
      missing.push({ file, id: e.id, words });
    }
  }
  return { total, exempt, missing };
}

export const rules = [
  {
    id: 'office-exempt',
    desc: `office_ok = เหตุผลที่การ์ดนี้ใช้คำออฟฟิศได้โดยไม่กรองอาชีพ (ข้อความอย่างน้อย ${EXEMPT_MIN} ตัวอักษร เช่น "ที่ประชุมหมู่บ้าน") · ใส่บนการ์ดช่วงหนุ่มสาว/ทำงาน/กลางคนที่มีคำออฟฟิศเท่านั้น`,
    event(e, ctx, r) {
      if (e.office_ok === undefined) return;
      if (typeof e.office_ok !== 'string' || e.office_ok.trim().length < EXEMPT_MIN) { r('.office_ok', `ต้องเขียนเหตุผลอย่างน้อย ${EXEMPT_MIN} ตัวอักษร (ได้ ${JSON.stringify(e.office_ok)})`); return; }
      if (!OFFICE_STAGES.includes(e.stage)) r('.office_ok', `ใช้ได้เฉพาะการ์ดช่วง ${OFFICE_STAGES.join(' ')} (ใบนี้ ${e.stage})`);
      else if (!officeHits(e).length) r('.office_ok', 'การ์ดไม่มีคำออฟฟิศ ลบป้ายยกเว้นออก');
    },
  },
];
