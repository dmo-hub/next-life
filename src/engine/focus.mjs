// โฟกัสชีวิต (สิ่งที่ทุ่มเท · แบบอสงไขย · B163): กติกากลางตัวเดียวที่ทุกโลกเรียก — เนื้อ (รายการ · ผล · ป้ายหมวดการ์ด) ต่างตามโลก
// h = ผู้ถือสถานะของโลกนั้น (โลกหลัก = st) เก็บ focus · focusAt · focusYears ไว้บนตัว ภาพถ่ายเซฟจึงพาไปด้วยเอง
// ไม่ตั้ง = ตามน้ำ: ไม่มีผล ไม่ดึงเลขสุ่ม ไม่ถ่วงการ์ด — ชีวิตที่ไม่แตะปุ่มเดินเหมือนก่อนมีระบบทุกหลัก
export const FOCUS_FLOW = 'flow';
export const FOCUS_FLOW_NAME = 'ใช้ชีวิตตามน้ำ';

// เลือกได้ตอนนี้: ช่วงวัยตรง + เงื่อนไขสถานะผ่าน · ok = ตัวตรวจ when ของโลกนั้น
export const focusOpen = (def, stage, ok) => !!def && (!def.stages || def.stages.includes(stage)) && ok(def.when);
export const focusOffers = (defs, stage, ok) => Object.keys(defs).filter((id) => focusOpen(defs[id], stage, ok));

// เปลี่ยนแล้วจดอายุไว้ — ปีที่เปลี่ยนไม่นับเป็นปีเต็มของโฟกัสใด (กดซ้ำตัวเดิมไม่ใช่การเปลี่ยน)
export function focusSet(h, id, age) {
  const next = id === FOCUS_FLOW ? null : id;
  if ((h.focus ?? null) === next) return;
  h.focus = next;
  h.focusAt = age;
}

// ปิดปีที่อายุ age: ผลทั้งปีคิดตามโฟกัสตอนสิ้นปีตัวเดียว คืน id นั้น · หลุดช่วงวัย/เงื่อนไขแล้วกลับเป็นตามน้ำ คืน null
// ตัวนับสะสม (ประตูเข้าสาย · ต่อสาย) นับเฉพาะปีที่ไม่ได้เปลี่ยนระหว่างปี
export function focusYearEnd(h, defs, stage, ok, age) {
  if (!h.focus) return null;
  if (!focusOpen(defs[h.focus], stage, ok)) {
    focusSet(h, FOCUS_FLOW, age);
    return null;
  }
  if (h.focusAt < age) (h.focusYears ??= {})[h.focus] = (h.focusYears[h.focus] ?? 0) + 1;
  return h.focus;
}

// ตัวคูณน้ำหนักการ์ดกองสุ่ม: ป้ายหมวดของการ์ดตรงหมวดที่โฟกัสถ่วง = mul · ไม่ตรง/ไม่มีโฟกัส = 1 (คูณ 1 ไม่ขยับลำดับสุ่ม)
export const focusCardMul = (def, tags, mul) => (def && def.cards.some((t) => tags.includes(t)) ? mul : 1);

// ทิศผลบนปุ่มเป็นคำ ไม่มีตัวเลข: ขึ้น/ลงตามเครื่องหมาย · ระดับ 2 ขึ้นไป = "มาก" · ค่าที่ไม่มีป้าย (บัญชีซ่อน) ไม่ขึ้นปุ่ม
const focusLevel = (v) => (typeof v === 'number' ? v : Math.sign(v.amount));
export function focusWords(def, labels) {
  const parts = Object.entries(def.fx)
    .filter(([k]) => labels[k])
    .map(([k, v]) => [labels[k], focusLevel(v)])
    .filter(([, lv]) => lv);
  const up = parts.filter(([, lv]) => lv > 0).map(([n, lv]) => `${n}ขึ้น${lv >= 2 ? 'มาก' : ''}`);
  const down = parts.filter(([, lv]) => lv < 0).map(([n, lv]) => `${n}ลด${lv <= -2 ? 'มาก' : ''}`);
  return [...up, ...down].join(' · ');
}
