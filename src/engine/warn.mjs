// การ์ดเตือนชีวิตใกล้หมด (B160 · B161): ตกจากเหนือเกณฑ์ลงถึงเกณฑ์ = 1 ใบ · ขึ้นเหนือเกณฑ์แล้วตกใหม่ = เตือนใหม่
// การ์ดระบบ ไม่หักโควตากองสุ่ม · มนุษย์มีแค่ "ช่างมัน" จนร้าน/โฟกัสโลกหลักเข้า · ต่างโลกส่งตัวเลือกของตัวเองได้
// แยกจาก life.mjs เพราะ isekai.mjs ใช้ด้วย และ life.mjs import isekai.mjs อยู่แล้ว (import วน)
export const WARN = {
  human: 20,
  isekai: 25,
  ignore: 'ช่างมัน',
  text: 'ร่างกายทรุดลงจนรู้สึกได้ทุกเช้า ถ้ายังใช้ชีวิตแบบนี้ต่อไป อีกไม่นานร่างกายคงไม่ไหว',
};
// เซฟก่อนมีช่องนี้ไม่มี lowWarned = ถือว่ายังไม่เคยเตือน
export function crossedLow(holder, value, line) {
  const low = value <= line;
  const was = holder.lowWarned ?? false;
  holder.lowWarned = low;
  return low && !was;
}
export const warnCard = (age, stage, text, choices = [WARN.ignore]) => ({ kind: 'warn', age, stage, text, choices, fx: choices.map(() => ''), locked: choices.map(() => null) });
// บอทกด "ช่างมัน" บนการ์ดเตือนทุกโลกโดยไม่ดึงเลขสุ่ม ⇒ ทางเลือกหลังการ์ดเตือนเท่าเดิม · −1 = ไม่ใช่การ์ดเตือน
export const warnPick = (card) => (card.kind === 'warn' || card.step === 'warn' ? card.choices.indexOf(WARN.ignore) : -1);
