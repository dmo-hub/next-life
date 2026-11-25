// คำเตือน B64 (ไม่ตก): การ์ดที่ยังไม่มีตัวเลือกปั่น (silly: true) และไม่ติดป้ายเรื่องเศร้า
// ใบ 158 เปลี่ยนเป็นตก · ที่นี่แค่นับให้เห็นงานค้าง
import { isObj, choicesOf } from './util.mjs';

export function sillyGaps(docs) {
  const missing = [];
  let total = 0;
  for (const { file, doc } of docs) {
    if (!isObj(doc) || !Array.isArray(doc.events)) continue;
    for (const e of doc.events) {
      if (!isObj(e) || !Array.isArray(e.choices) || !e.choices.length) continue;
      total++;
      if (Array.isArray(e.heavy) && e.heavy.includes('sad')) continue;
      if (!choicesOf(e).some(({ c }) => c?.silly === true)) missing.push({ file, id: e.id });
    }
  }
  return { total, missing };
}
