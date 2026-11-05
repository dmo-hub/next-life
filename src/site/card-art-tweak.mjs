// หน้า tweak ภาพบนการ์ด (ui-redo 58): พื้นหลังแรกเกิด + ภาพหมวดการ์ดผล — build ฉีดรูปทรงภาพ + ตัวเลขหมวดจากด่านระหว่าง marker ทุกรอบ
// ภาพแรกเกิด = รูปทรงเดิมใน art.mjs ตัดกรอบ ERA_FRAME ออก (ข้อ 87) · ภาพหมวดเป็นร่างของเลนให้เจ้าของเลือก ยังไม่เข้าเกม (ใบ 62 ย้ายชุดที่เลือกเข้า art.mjs)
// ตัวเลขหมวด + ข้อความการ์ดจริง: harness/result-cats.mjs --write เขียน card-art-tweak.json — build อ่านไฟล์ ไม่เล่นชีวิตเองทุกรอบ
import { readFileSync } from 'node:fs';
import { ART_INK, ERA_FRAME, sceneArt } from '../ui/art.mjs';

export const CARD_ART_PAGE = 'dev/tweak/card-art-tweak.html';
export const CARD_ART_START = '/*CARD-ART:START*/';
export const CARD_ART_END = '/*CARD-ART:END*/';
export const CARD_ART_COUNTS = new URL('./card-art-tweak.json', import.meta.url);
export const BIRTH_IDS = ['birth_poor', 'birth_mid', 'birth_rich'];

// ชิ้นวาดแบบเดียวกับ art.mjs (path สตริงเดียวต่อชิ้น) — สีชุด ART_INK ภาพจึงเข้ากรอบเดิม
const line = (d, stroke = ART_INK.gold, w = 1.6) => ({ d, stroke, w });
const fill = (d, f = ART_INK.gold2) => ({ d, fill: f });
const circ = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
const GROUND = line('M26 66H174', ART_INK.bronze2, 1);
const drops = (xs, y) => xs.map((x, i) => `M${x} ${y + (i % 2) * 6}l-3 7`).join('');

// คีย์ตรงกับ RESULT_CATS ใน harness/result-cats.mjs · [ป้ายบรรยายภาพ, รูปทรง]
export const CAT_ART = {
  after: ['ดอกบัวบานบนเมฆ', [
    line('M40 58q10-10 22-4q6-10 18-4q12-2 14 8H40z', ART_INK.cream, 1.2),
    line('M106 58q8-8 18-3q8-9 18-2q10 0 12 5h-48z', ART_INK.cream, 1.2),
    fill('M100 44q-7-12 0-24q7 12 0 24z'),
    fill('M100 44q-14-4-17-16q12 1 17 16z', ART_INK.bronze2),
    fill('M100 44q14-4 17-16q-12 1-17 16z', ART_INK.bronze2),
    line('M82 46q18 6 36 0', ART_INK.gold, 1.4),
    line('M100 14v-4M86 18l-3-3M114 18l3-3', ART_INK.cream, 1),
  ]],
  far: ['ประตูโค้งที่มีแสงลอดออกมา', [
    GROUND,
    line('M78 66V34a22 22 0 0 1 44 0v32'),
    line('M86 66V36a14 14 0 0 1 28 0v30', ART_INK.bronze2, 1),
    line('M72 26l-10-7M128 26l10-7M68 40H54M132 40h14M74 54l-12 4M126 54l12 4', ART_INK.cream, 1),
    fill(circ(100, 48, 3), ART_INK.cream),
  ]],
  loss: ['กระถางธูป ควันลอยขึ้น', [
    GROUND,
    line('M78 66l4-14h36l4 14', ART_INK.gold, 1.6),
    line('M76 52h48', ART_INK.gold, 1.2),
    line('M94 52V30M100 52V28M106 52V30', ART_INK.bronze2, 1),
    fill(circ(94, 30, 1.3) + circ(100, 28, 1.3) + circ(106, 30, 1.3), ART_INK.cream),
    line('M94 26q-4-6 0-10q4-4 0-8M100 24q4-6 0-10q-4-4 0-8M106 26q-4-6 0-10', ART_INK.cream, 1),
  ]],
  ill: ['ขวดยา เม็ดยา และกากบาท', [
    GROUND,
    line('M70 66V36h24v30zM74 36v-6h16v6M70 46h24'),
    line('M112 34h10v-10h8v10h10v8h-10v10h-8v-10h-10z', ART_INK.cream, 1.4),
    fill(circ(146, 58, 4) + circ(158, 60, 4), ART_INK.gold2),
  ]],
  pet: ['แมวนั่งข้างชามข้าว', [
    GROUND,
    line('M86 66q-4-22 8-30l-2-10l8 6h8l8-6l-2 10q12 8 8 30z'),
    line('M122 62q14 2 14-10', ART_INK.gold, 1.4),
    fill(circ(98, 40, 1.5) + circ(110, 40, 1.5), ART_INK.cream),
    line('M140 66q0-8 12-8t12 8z', ART_INK.bronze2, 1.2),
  ]],
  self: ['ทางแยกกับป้ายบอกทาง', [
    line('M56 66l34-14M144 66l-34-14', ART_INK.bronze2, 1),
    line('M100 66V20'),
    line('M100 26h30l6 5l-6 5h-30zM100 40h-28l-6 5l6 5h28z', ART_INK.cream, 1.2),
    GROUND,
  ]],
  luck: ['สลากกับดาวโชค', [
    line('M58 26h64v32h-64zM72 26v32', ART_INK.gold, 1.4),
    line('M80 36h32M80 44h24M80 50h28', ART_INK.cream, 1),
    fill('M146 22l4 9l10 1l-8 6l3 10l-9-6l-9 6l3-10l-8-6l10-1z'),
    line('M38 30v6M35 33h6M168 54v6M165 57h6', ART_INK.cream, 1),
  ]],
  good: ['พระอาทิตย์ขึ้นพ้นขอบฟ้า', [
    GROUND,
    line('M70 66a30 30 0 0 1 60 0'),
    line('M100 28v-12M74 40l-9-8M126 40l9-8M62 56H50M138 56h12', ART_INK.cream, 1.2),
    fill('M84 66a16 16 0 0 1 32 0z', ART_INK.gold2),
  ]],
  bad: ['เมฆฝน ฟ้าแลบ', [
    line('M60 42q-14 0-14-11q0-12 15-11q4-12 18-10q8-10 22-4q14-4 18 9q14 0 14 14t-14 13z', ART_INK.cream, 1.4),
    fill('M104 42l-10 14h8l-6 12l14-18h-8l6-8z'),
    line(drops([66, 78, 128, 140, 152], 48), ART_INK.bronze2, 1.2),
  ]],
  mid: ['สมุดบันทึกเปิดค้างไว้', [
    GROUND,
    line('M100 60V24q-20-8-40-2v38q20-6 40 2q20-8 40-2V22q-20-6-40 2'),
    line('M68 32q12-3 24 0M68 40q12-3 24 0M68 48q12-3 24 0M108 32q12-3 24 0M108 40q12-3 24 0', ART_INK.bronze2, 1),
    line('M142 30l14-12l4 4l-14 12z', ART_INK.cream, 1.2),
  ]],
};

export function birthBgArt(id) {
  const s = sceneArt(id);
  if (!s) throw new Error(`art.mjs: ไม่มีภาพ ${id}`);
  return { label: s.label, parts: s.parts.slice(ERA_FRAME.length) };
}

export function cardArtData(counts = JSON.parse(readFileSync(CARD_ART_COUNTS, 'utf8'))) {
  const missing = counts.cats.map((c) => c.k).filter((k) => !CAT_ART[k]);
  if (missing.length) throw new Error(`src/site/card-art-tweak.mjs: หมวด ${missing.join(' ')} ยังไม่มีภาพใน CAT_ART`);
  return {
    ink: ART_INK,
    frame: ERA_FRAME,
    birth: Object.fromEntries(BIRTH_IDS.map((id) => [id, birthBgArt(id)])),
    cat: Object.fromEntries(Object.entries(CAT_ART).map(([k, [label, parts]]) => [k, { label, parts }])),
    counts,
  };
}

export function injectCardArt(html, data, where) {
  const a = html.indexOf(CARD_ART_START);
  const b = html.indexOf(CARD_ART_END);
  if (a < 0 || b < a || html.indexOf(CARD_ART_START, a + 1) >= 0) throw new Error(`${where}: ต้องมี ${CARD_ART_START} … ${CARD_ART_END} ชุดเดียว`);
  return html.slice(0, a + CARD_ART_START.length) + JSON.stringify(data).replace(/</g, '\\u003c') + html.slice(b);
}

// ส่วนระหว่าง marker — ด่านเทียบกับข้อมูลตอนนี้ · null = ไม่มี/อ่านไม่ได้
export function cardArtBlock(html) {
  const a = html.indexOf(CARD_ART_START);
  const b = html.indexOf(CARD_ART_END);
  if (a < 0 || b < a) return null;
  try {
    return JSON.parse(html.slice(a + CARD_ART_START.length, b));
  } catch {
    return null;
  }
}
