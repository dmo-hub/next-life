// สวิตช์ DLC 4 ก้อน — ซ่อนของที่อยู่ในเกมแล้วหลังสวิตช์ โค้ดคงอยู่ · เงื่อนไขปลดอยู่ท้ายไฟล์ (dlcEarn)
// st.dlc ใส่ช่องเฉพาะเมื่อมีก้อนล็อก ⇒ ชีวิตที่ปลดครบ (ค่าเริ่มของด่าน · เซฟเก่า) ได้สถานะเท่าเดิมทุกไบต์
export const DLC_KEYS = ['afterlife', 'isekai', 'overlap', 'dungeon'];
export const DLC_OPEN = Object.freeze(Object.fromEntries(DLC_KEYS.map((k) => [k, true])));
export const DLC_LOCKED = Object.freeze(Object.fromEntries(DLC_KEYS.map((k) => [k, false])));

// ค่าที่ชีวิตใหม่ที่ไม่มีทายาทใช้ตอนเกิด · ด่านค่าเริ่ม = ปลดหมด · UI ตั้งจากสมุดระดับเครื่องก่อนเริ่มตระกูล
let dlcDefault = DLC_OPEN;
export const setDlcDefault = (dlc) => {
  dlcDefault = { ...DLC_OPEN, ...dlc };
};
export const getDlcDefault = () => dlcDefault;

// ชีวิตที่ไม่มีช่อง dlc = เกิดตอนปลดครบ (เซฟเก่า ทายาทของตระกูลเก่า) — ล็อกทีหลังไม่ดึงของที่เคยเล่นกลับ
export const dlcOpen = (st, key) => (st?.dlc ? st.dlc[key] === true : true);

// ช่องที่เก็บลง st · ปลดครบ = undefined ให้ผู้เรียกไม่ใส่ช่อง
export const dlcStamp = (dlc) => (dlc && DLC_KEYS.some((k) => dlc[k] === false) ? { ...DLC_OPEN, ...dlc } : undefined);

// ด่านตายตัว (NL_DLC=locked): ล็อกแล้วไม่ปลดเอง ไม่งั้นชุดล็อกของใบ 02 กลายเป็นชุดที่ปลดไปเรื่อย ๆ
let dlcFrozen = false;
export const setDlcFrozen = (on) => {
  dlcFrozen = !!on;
};

// เงื่อนไขปลด: ก้อน N ปลดได้เมื่อก้อน N-1 ปลดแล้ว ตั้งแต่ต้นชีวิตนี้ (ได้ระหว่างชีวิต/ปรโลก = จดไว้ มีผลรอบหน้า ไม่แตะชีวิตที่กำลังเล่น)
// คืน true เมื่อเพิ่งได้ใหม่ · ผู้เรียกแจ้งผู้เล่นและเขียนค่าเครื่อง
export function dlcEarn(st, key) {
  const i = DLC_KEYS.indexOf(key);
  if (dlcFrozen || i < 0 || dlcOpen(st, key) || st.dlcEarned?.includes(key)) return false;
  if (i > 0 && !dlcOpen(st, DLC_KEYS[i - 1])) return false;
  (st.dlcEarned ??= []).push(key);
  return true;
}

// สถานะที่ชีวิตถัดไปรับ: ของชีวิตนี้ + ที่เพิ่งได้ + ค่าเครื่อง (ปลดจากตระกูลอื่นในเครื่องเดียวกันแล้ว ตระกูลนี้ได้ด้วย)
export const dlcNext = (st) => Object.fromEntries(DLC_KEYS.map((k) => [k, dlcOpen(st, k) || !!st.dlcEarned?.includes(k) || dlcDefault[k] === true]));
