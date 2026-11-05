// ฟอนต์ของทั้งเว็บเป็นไฟล์ในเว็บเอง (ui-redo 96 · ข้อ 205): ต้นฉบับ src/ui/fonts/*.woff2 · build คัดลอกไป docs/fonts/ + เขียน docs/fonts/fonts.css
// ทุกหน้าลิงก์ fonts.css ไฟล์เดียว · หน้าเล่นฝัง @font-face ชุดของตัวเองใน <style> (ไม่ต้องรอ CSS อีกไฟล์ก่อนวาด) แต่ชี้ไฟล์ woff2 ชุดเดียวกัน
// เบราว์เซอร์โหลดเฉพาะแบบที่หน้าใช้จริง ⇒ รวมทุกตระกูลไว้ใน fonts.css ไม่ทำให้หน้าไหนหนักขึ้น
// [ตระกูล, น้ำหนัก, ไฟล์, ตัวเอียง]
export const FONTS = [
  ['Noto Sans Thai', 400, 'NotoSansThai-Regular'],
  ['Noto Sans Thai', 600, 'NotoSansThai-SemiBold'],
  ['Noto Sans Thai', 700, 'NotoSansThai-Bold'],
  ['Sarabun', 400, 'Sarabun-Regular'],
  ['Sarabun', 600, 'Sarabun-SemiBold'],
  ['Sarabun', 600, 'Sarabun-SemiBoldItalic', true],
  ['Sarabun', 700, 'Sarabun-Bold'],
  ['Srisakdi', 400, 'Srisakdi-Regular'],
  ['Srisakdi', 700, 'Srisakdi-Bold'],
  ['Pridi', 400, 'Pridi-Regular'],
  ['Pridi', 600, 'Pridi-SemiBold'],
  ['Mitr', 400, 'Mitr-Regular'],
  ['Mitr', 500, 'Mitr-Medium'],
  ['Mitr', 600, 'Mitr-SemiBold'],
  // Maitree เตรียมให้ทิศ 1 (T1) — ยังไม่มีหน้าไหนใช้จนกว่าใบ token ลง
  ['Maitree', 400, 'Maitree-Regular'],
  ['Maitree', 500, 'Maitree-Medium'],
  ['Maitree', 600, 'Maitree-SemiBold'],
  ['Mali', 500, 'Mali-Medium'],
  ['Mali', 600, 'Mali-SemiBold'],
  ['IBM Plex Sans Thai', 500, 'IBMPlexSansThai-Medium'],
  ['IBM Plex Sans Thai', 600, 'IBMPlexSansThai-SemiBold'],
  ['Noto Serif Thai', 400, 'NotoSerifThai-Regular'],
  ['Noto Serif Thai', 600, 'NotoSerifThai-SemiBold'],
];
// หน้าเล่น: Noto Sans Thai = หัวและเนื้อ · Sarabun = ภาพแชร์และภาพชั้นสมุด (canvas) · Srisakdi มีแค่ 700 ที่ใช้ (ทุกจุดเป็นตัวหนา)
export const PLAY_FACES = ['Noto Sans Thai 400', 'Noto Sans Thai 600', 'Sarabun 400', 'Sarabun 600', 'Srisakdi 700'];
export const FONT_DIR = 'fonts/';
export const FONT_CSS = `${FONT_DIR}fonts.css`;

const face = ([family, weight, file, italic], base) =>
  `@font-face { font-family:"${family}"; font-weight:${weight}; font-style:${italic ? 'italic' : 'normal'}; font-display:swap; src:url(${base}${file}.woff2) format('woff2'); }`;
// base = ที่อยู่โฟลเดอร์ฟอนต์เทียบกับไฟล์ที่ใส่ CSS นี้
export const fontsCss = (list = FONTS, base = '') => `${list.map((f) => face(f, base)).join('\n')}\n`;
export const playFonts = () => FONTS.filter(([family, weight, , italic]) => !italic && PLAY_FACES.includes(`${family} ${weight}`));
