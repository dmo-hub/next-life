// สวิตช์ DLC 4 ก้อน — ซ่อนของที่อยู่ในเกมแล้วหลังสวิตช์ โค้ดคงอยู่ · ปลดจริงเป็นงานใบ 03
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
