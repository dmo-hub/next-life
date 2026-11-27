// ภาพการ์ดหมวด risky_* (ทางลัดที่ตามมาทวง) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// คู่ caught/quiet ต่อเรื่อง: ใบ caught จุดเด่นแดง = หลักฐานที่ยังค้าง · ใบ quiet จุดเด่นแดง = หลักฐานที่หายไป
import { gl, s, a, al, k, l, f, n, circ, rect, GROUND } from './parts.mjs';

// คน: หัว + ตัวทรงโค้ง · x กลางตัว · top = ไหล่ · foot = พื้น · w = ครึ่งความกว้างตัว
const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const person = (x, top = 66, foot = 108, w = 12, dark = false) => [(dark ? n : s)(circ(x, top - 9, 8) + torso(x, top, foot, w))];
const desk = (x, w, y = 78) => [s(rect(x, y, w, 6)), f(`M${x + 4} ${y + 6}V108M${x + w - 4} ${y + 6}V108`, 2)];

export default {
  risky_answers_caught_01: [
    GROUND,
    ...person(34, 66),
    s(rect(70, 40, 54, 44)),
    l('M76 50h40M76 58h36M76 74h40', 1),
    a(rect(76, 63, 34, 6)),
    ...desk(60, 84, 84),
    ...person(166, 62, 108, 12, true),
    f('M154 74l-24-8', 2),
  ],
  risky_answers_quiet_01: [
    GROUND,
    gl(rect(150, 36, 32, 72) + rect(156, 26, 20, 6) + circ(176, 74, 2), 1),
    s(rect(40, 48, 40, 38) + rect(80, 48, 6, 38)),
    l('M46 58h28M46 66h24M46 74h28', 1),
    f('M80 48V86', 1.4),
    al('M86 48l5 5l-5 5l5 5l-5 5l5 5l-5 5l5 5l-5 3', 1.8),
    ...desk(30, 70, 86),
    ...person(124, 68),
  ],
  risky_cert_caught_01: [
    GROUND,
    ...person(30, 66),
    a('M72 84l6-32h30l-6 32z'),
    l('M82 60h18M80 68h18M78 76h10', 1),
    s(rect(118, 74, 24, 10)),
    gl('M130 74q-6-16 20-24', 1),
    ...desk(56, 134, 84),
    ...person(166, 64, 108, 12, true),
    f('M158 72l-6-14', 2),
    n(rect(150, 46, 6, 16)),
    gl('M178 40l8-6M180 48h10M178 56l8 6', 1),
  ],
  risky_cert_quiet_01: [
    GROUND,
    gl('M14 108V36h96V108M10 36l8-12h88l8 12', 1),
    s(rect(24, 70, 40, 38)),
    n(rect(28, 64, 32, 6)),
    k(rect(28, 76, 32, 6)),
    n(rect(72, 96, 34, 12)),
    a('M78 96q-6-10 2-18q0 8 6 8q-2-10 6-16q2 12 8 14q4-6 2-12q10 10 4 24z'),
    ...person(160, 66),
  ],
  risky_string_caught_01: [
    GROUND,
    ...person(50, 62, 108, 12, true),
    ...person(86, 62, 108, 12, true),
    ...desk(28, 102, 84),
    s(rect(38, 78, 30, 6)),
    a('M100 22h48q4 0 4 4v20q0 4-4 4h-32l-8 8v-8h-8q-4 0-4-4V26q0-4 4-4z'),
    k(rect(106, 30, 36, 2) + rect(106, 38, 26, 2)),
    ...person(172, 64),
  ],
  risky_string_quiet_01: [
    GROUND,
    gl(rect(138, 26, 44, 82), 1),
    n(rect(30, 50, 8, 58)),
    n(rect(30, 84, 42, 5)),
    f('M68 89V108', 2),
    s(circ(56, 60, 8) + 'M44 84V78q0-8 12-8t12 8V84z'),
    f('M66 86h12v22', 3),
    a(circ(160, 57, 8) + torso(160, 66, 108, 11)),
    s(rect(144, 72, 30, 18)),
    l('M144 78h30', 1),
  ],
};
