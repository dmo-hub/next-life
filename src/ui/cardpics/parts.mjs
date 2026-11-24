// ชิ้นภาพประจำการ์ด (ใบ 210 · ข้อ 404 410 492): ทุกภาพวาดด้วยโค้ดบนผืน CARD_PIC_W×CARD_PIC_H · ไฟล์นี้ใช้ตอน build เท่านั้น ไม่ต่อเข้า play.js
// ชิ้น = [บทบาท, path, ความหนาเส้น?] · บทบาทบอกหน้าที่ ไม่บอกสี — สีมาจาก CSS ของหน้าเล่น (.cp .r-<บทบาท>) ตามสไตล์ wash จุดเด่นแดง (ข้อ 410)
// g พื้นหลังทึบ · gl เส้นพื้นหลัง · s ทรงหลัก · a จุดเด่น · al เส้นจุดเด่น · k ช่องเจาะ (สีพื้นการ์ด) · l เส้นบนทรง · f เส้นนอกทรง · n ทรงเข้ม
export const CARD_PIC_W = 200, CARD_PIC_H = 125;
export const CARD_PIC_ROLES = ['g', 'gl', 's', 'a', 'al', 'k', 'l', 'f', 'n'];

const part = (r, d, w) => (w === undefined ? [r, d] : [r, d, w]);
export const g = (d) => part('g', d);
export const gl = (d, w = 1) => part('gl', d, w);
export const s = (d) => part('s', d);
export const a = (d) => part('a', d);
export const al = (d, w = 2) => part('al', d, w);
export const k = (d) => part('k', d);
export const l = (d, w = 1.2) => part('l', d, w);
export const f = (d, w = 1.2) => part('f', d, w);
export const n = (d) => part('n', d);

export const circ = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
export const rect = (x, y, w, h) => `M${x} ${y}h${w}v${h}h${-w}z`;
export const GROUND = gl('M12 108H188', 1.2);
// คนเส้นเดียว: หัวกลม + ตัว + แขน + ขา · (x, เท้า) · h = สูงทั้งตัว
export const stick = (x, foot, h) => {
  const r = h * 0.12, neck = foot - h + 2 * r, hip = foot - h * 0.42;
  return `${circ(x, foot - h + r, r)}M${x} ${neck}V${hip}M${x} ${neck + h * 0.1}l${-h * 0.2} ${h * 0.2}M${x} ${neck + h * 0.1}l${h * 0.2} ${h * 0.2}M${x} ${hip}l${-h * 0.14} ${foot - hip}M${x} ${hip}l${h * 0.14} ${foot - hip}`;
};
