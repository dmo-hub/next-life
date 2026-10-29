// คนในบ้าน (B138): ข้อความที่เอ่ยถึงแม่ พ่อ คู่ ลูก สัตว์เลี้ยง ต้องมีเงื่อนไขให้คนนั้นยังอยู่ — ตัวจับชุดเดียวกับด่าน family (harness/kin.mjs)
// ด่าน family ต้องเล่นครบหลายสิบนาทีถึงจะรายงาน · lint ตกทันทีตอนเขียนการ์ด
import { kinGaps } from '../../../harness/kin.mjs';

const WHO = { mother: 'แม่', father: 'พ่อ', parents: 'พ่อแม่', spouse: 'คู่', child: 'ลูก', pet: 'สัตว์เลี้ยง' };

export const rules = [
  {
    id: 'kin-unguarded',
    desc: 'ข้อความที่เอ่ยถึงคนในบ้านต้องมี when.family (ทั้งใบ) หรือ requires.family (ตัวเลือก) ให้คนนั้นยังอยู่',
    event(e, ctx, r) {
      for (const g of kinGaps([e])) r(g.at === 'text' ? '.text' : `.choices[${g.at.slice(1)}]`, `เอ่ยถึง${WHO[g.who]}แต่ไม่มีเงื่อนไขให้ยังอยู่: «${g.text}»`);
    },
  },
];
