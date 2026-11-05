// หน้า tweak T14 หน้าการ์ดรวม (ui-redo 126 · ข้อ 177 187 199 201): ปุ่มดูผลบนการ์ด + กล่องเฉลยที่กางออก
// build ฉีด CSS ของหน้ารวมการ์ด/หน้าเฉลย (แม่แบบ src/site/*.html) + token เว็บ + การ์ดจริงทั้งสองแบบระหว่าง marker ทุกรอบ ⇒ ต้นแบบไม่ลอก CSS เอง แก้หน้าจริงแล้วตามทันที
// ข้อมูลอยู่ใน <script type="application/json"> — Ctrl+F ไม่ค้นเนื้อสคริปต์ เฉลยจึงไม่โผล่จนกดปุ่ม (ข้อ 187)
import { readFileSync } from 'node:fs';
import { SITE_ROOT } from './tokens.mjs';
import { catalogCard } from './catalog.mjs';
import { spoilerCards } from './spoilers.mjs';
import { NAV_CSS_START, NAV_CSS_END } from './nav.mjs';

export const CARD_SPOIL_PAGE = 'dev/tweak/card-spoil-tweak.html';
export const CARD_SPOIL_START = '/*CARD-SPOIL:START*/';
export const CARD_SPOIL_END = '/*CARD-SPOIL:END*/';
// การ์ดตัวอย่าง: ผลสุ่มหลายทาง + บุญบาป · ทางล็อกด้วยเงื่อนไข · การ์ดสั้นสองตัวเลือก — id หายจาก content = build ล้ม
export const CARD_SPOIL_IDS = ['teen_first_smoke_01', 'career_transfer_01', 'pet_lost_01'];

const styleOf = (file) => {
  const m = readFileSync(file, 'utf8').replace(/\r\n/g, '\n').match(/<style>([\s\S]*?)<\/style>/);
  if (!m) throw new Error(`${file}: ไม่เจอ <style>`);
  return m[1].replace(`${NAV_CSS_START}${NAV_CSS_END}`, '').trim();
};

export function cardSpoilData(content, root = new URL('../../', import.meta.url)) {
  const byId = new Map(content.events.map((e) => [e.id, e]));
  const miss = CARD_SPOIL_IDS.filter((id) => !byId.has(id));
  if (miss.length) throw new Error(`${CARD_SPOIL_PAGE}: ไม่มีการ์ด ${miss.join(' ')}`);
  const spoil = spoilerCards(content, CARD_SPOIL_IDS);
  return {
    css: { root: SITE_ROOT, catalog: styleOf(new URL('src/site/catalog.html', root)), spoilers: styleOf(new URL('src/site/spoilers.html', root)) },
    cards: CARD_SPOIL_IDS.map((id, i) => ({ id, stage: byId.get(id).stage, catalog: catalogCard(byId.get(id)), spoil: spoil[i] })),
  };
}

// < เป็น < ⇒ </script> ในเนื้อการ์ดไม่ปิดแท็กก่อนเวลา · JSON.parse อ่านกลับได้ตรง
const pack = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

export function injectCardSpoil(html, data, where) {
  const a = html.indexOf(CARD_SPOIL_START);
  const b = html.indexOf(CARD_SPOIL_END);
  if (a < 0 || b < a || html.indexOf(CARD_SPOIL_START, a + 1) >= 0) throw new Error(`${where}: ต้องมี ${CARD_SPOIL_START} … ${CARD_SPOIL_END} ชุดเดียว`);
  return html.slice(0, a + CARD_SPOIL_START.length) + pack(data) + html.slice(b);
}

// ส่วนระหว่าง marker แปลงกลับเป็นข้อมูล — ด่านเทียบกับของที่ build ตอนนี้ · null = ไม่มี marker/อ่านไม่ออก
export function cardSpoilBlock(html) {
  const a = html.indexOf(CARD_SPOIL_START);
  const b = html.indexOf(CARD_SPOIL_END);
  if (a < 0 || b < a) return null;
  try {
    return JSON.parse(html.slice(a + CARD_SPOIL_START.length, b));
  } catch {
    return null;
  }
}
