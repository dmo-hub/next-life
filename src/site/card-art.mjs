// ภาพประจำการ์ด (ใบ 210 · ข้อ 492): แฟ้มละหมวดใน src/ui/cardpics/ คีย์ = id การ์ด · เนื้อหา content/*.yaml ไม่ถือภาพ
// build ส่งเป็นไฟล์แยก docs/play-art.js โหลดหลังการ์ดแรก — ไม่อยู่ใน play.js และ CORE ของ service worker ⇒ หน้าเล่นเปิดเร็วเท่าเดิม
// ชื่อไฟล์ต่อ ?h=hash เนื้อภาพ: bump รุ่นแต่ภาพไม่เปลี่ยน = แคชภาพเดิมใช้ต่อ ไม่โหลดใหม่ทุกรุ่น
import { readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CARD_PIC_W, CARD_PIC_H, CARD_PIC_ROLES } from '../ui/cardpics/parts.mjs';

const DIR = new URL('../ui/cardpics/', import.meta.url);
export const CARD_PIC_SHARED = 'parts.mjs';
export const cardPicFiles = () => readdirSync(DIR).filter((f) => f.endsWith('.mjs') && f !== CARD_PIC_SHARED).sort();

// id ซ้ำข้ามแฟ้มต้องหยุด: ต่อรวมแล้วแฟ้มหลังทับภาพแฟ้มแรกเงียบ ๆ
export async function loadCardPics() {
  const pics = {};
  const dup = [];
  for (const file of cardPicFiles()) {
    const mod = (await import(new URL(file, DIR))).default ?? {};
    for (const [id, parts] of Object.entries(mod)) {
      if (id in pics) dup.push(`${id} (${file})`);
      pics[id] = parts;
    }
  }
  if (dup.length) throw new Error(`src/ui/cardpics: id ภาพซ้ำข้ามแฟ้ม ${dup.join(', ')}`);
  return pics;
}

export const cardPicText = (pics) => `self.NL_CARD_ART = ${JSON.stringify({ w: CARD_PIC_W, h: CARD_PIC_H, pics }).replace(/</g, '\\u003c')};\n`;
export const cardPicHash = (text) => createHash('sha256').update(text).digest('hex').slice(0, 10);

// ด่าน: ภาพที่ไม่มีการ์ด (id พิมพ์ผิด/การ์ดถูกลบ) · ชิ้นพัง (บทบาทไม่รู้จัก · path ไม่ใช่ข้อความ · ซ้อน array) · การ์ดที่ยังไม่มีภาพ
export function cardPicGaps(pics, cardIds) {
  const ids = new Set(cardIds);
  const orphan = Object.keys(pics).filter((id) => !ids.has(id));
  const broken = Object.entries(pics).filter(([, parts]) => !Array.isArray(parts) || !parts.length || parts.some((p) => !Array.isArray(p) || !CARD_PIC_ROLES.includes(p[0]) || typeof p[1] !== 'string' || !/^M/.test(p[1]) || (p.length > 2 && typeof p[2] !== 'number'))).map(([id]) => id);
  const missing = [...ids].filter((id) => !(id in pics));
  return { orphan, broken, missing };
}
