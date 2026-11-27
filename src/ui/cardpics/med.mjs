// ภาพการ์ดหมวด med_* (สายหมอ เด็กเล่นชุดหมอ → เกษียณ) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// จุดเด่นแดงหนึ่งจุดต่อภาพ = สิ่งที่การ์ดถามผู้เล่น
import { gl, s, a, al, k, l, f, n, circ, rect, GROUND } from './parts.mjs';

// คน: หัว + ตัวทรงโค้ง · x กลางตัว · top = ไหล่ · foot = พื้น · w = ครึ่งความกว้างตัว
const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const person = (x, top = 66, foot = 108, w = 12, dark = false) => [(dark ? n : s)(circ(x, top - 9, 8) + torso(x, top, foot, w))];
// หมอใส่เสื้อกาวน์: ตัวทรงหลัก + สาบเสื้อกลางตัว · กาวน์ไม่เต็มตัว = นักศึกษา
const doctor = (x, top = 66, foot = 108, w = 12) => [s(circ(x, top - 9, 8) + torso(x, top, foot, w)), l(`M${x} ${top + 2}V${foot}M${x - 6} ${top + 2}l6 10l6-10`, 1.2)];
// เตียงคนไข้ · x ซ้าย · w ยาว
const bed = (x, w, y = 84) => [s(rect(x, y, w, 8)), f(`M${x + 4} ${y + 8}V108M${x + w - 4} ${y + 8}V108M${x} ${y}v-14`, 2)];
const sheet = (x, y, w, h, lines) => [s(rect(x, y, w, h)), k(Array.from({ length: lines }, (_, i) => rect(x + 4, y + 6 + i * 7, w - 8, 2)).join(''))];
const hospital = (x, w) => `M${x} 108V40h${w}V108M${x + w / 2 - 6} 52h12M${x + w / 2} 46v12M${x + 8} 70h12v10h-12zM${x + w - 20} 70h12v10h-12z`;

export default {
  med_kid_01: [
    GROUND,
    s(circ(60, 66, 6) + torso(60, 74, 108, 8)),
    al('M54 76q-8 10 2 18h8q10-8 2-18M60 94v4', 2),
    s(rect(76, 92, 20, 16)),
    l('M80 98h12', 1),
    n(circ(130, 62, 7) + torso(130, 70, 108, 10) + circ(156, 62, 7) + torso(156, 70, 108, 10) + circ(182, 64, 7) + torso(182, 72, 108, 9)),
  ],
  med_tutor_01: [
    GROUND,
    gl('M12 30h70M12 30V60', 1),
    a(rect(20, 64, 30, 44)),
    k(rect(20, 72, 30, 1.6) + rect(20, 80, 30, 1.6) + rect(20, 88, 30, 1.6) + rect(20, 96, 30, 1.6)),
    ...person(76, 66),
    s(rect(110, 76, 76, 6)),
    f('M114 82V108M182 82V108', 2),
    n(circ(126, 64, 6) + circ(148, 64, 6) + circ(170, 64, 6)),
  ],
  med_rural_01: [
    GROUND,
    gl(hospital(130, 54), 1),
    ...person(40, 66, 108, 12, true),
    f('M52 74l12-6', 2),
    ...sheet(64, 46, 34, 40, 4),
    al(circ(81, 63, 10), 1.6),
  ],
  med_result_01: [
    GROUND,
    gl('M150 40h36v6h-36zM160 46v14M176 46v14', 1),
    gl('M168 30v-12M166 26q2-4 4 0', 1),
    s(rect(60, 28, 56, 40)),
    k(rect(64, 32, 48, 32)),
    a(rect(70, 40, 36, 6)),
    s('M82 68h12l4 10h-20z'),
    n(circ(50, 84, 7) + torso(50, 92, 108, 10) + circ(88, 82, 7) + torso(88, 90, 108, 10) + circ(126, 84, 7) + torso(126, 92, 108, 10)),
  ],
  med_ward_01: [
    GROUND,
    ...bed(16, 70),
    s(circ(30, 78, 6)),
    gl('M100 108V30M96 30h8M100 44q-8 10 0 20', 1),
    ...doctor(130, 64),
    a(rect(132, 72, 7, 5)),
    ...person(172, 66, 108, 11, true),
    f('M162 74l-12 0', 2),
  ],
  med_license_01: [
    GROUND,
    gl('M12 108V24h64V108M44 24V108M120 108V24h64V108M152 24V108', 1),
    ...doctor(98, 64),
    a('M88 22h20l-4-12h-12z'),
    k(circ(98, 24, 2.4)),
    s(circ(28, 70, 6) + torso(28, 78, 108, 8)),
    n(circ(168, 70, 6) + torso(168, 78, 108, 8)),
  ],
  med_intern_01: [
    GROUND,
    al(circ(30, 30, 14) + 'M30 30V20M30 30l-8 4', 1.6),
    ...bed(56, 60),
    s(circ(70, 78, 6)),
    ...doctor(140, 64),
    n(circ(166, 76, 6) + torso(166, 84, 108, 8) + circ(184, 76, 6) + torso(184, 84, 108, 8)),
  ],
  med_community_01: [
    GROUND,
    gl(hospital(16, 64), 1),
    ...doctor(108, 64),
    f('M120 76l10 0', 2),
    a('M130 70h16l-2 16h-12z'),
    s(rect(150, 80, 38, 6)),
    f('M154 86V108M184 86V108', 2),
    n(circ(170, 64, 7) + torso(170, 72, 80, 10)),
  ],
  med_offer_01: [
    GROUND,
    gl('M12 108V30h56V108M18 40h44M18 52h44M18 64h44M18 76h44', 1),
    ...doctor(100, 64),
    ...person(150, 64, 108, 12, true),
    f('M138 76l-12 2', 2),
    a(rect(112, 66, 18, 14)),
    k(rect(115, 70, 12, 2) + rect(115, 75, 8, 2)),
    gl('M180 30v-8M176 26h8', 1),
  ],
  med_burnout_01: [
    GROUND,
    s('M30 108V84l14-16h70l18 16V108z'),
    k('M50 72h28v12H44zM84 72h24l10 12H84z'),
    s(circ(64, 76, 5)),
    f(circ(52, 102, 7) + circ(118, 102, 7), 2),
    a(rect(150, 44, 26, 34)),
    k(rect(154, 50, 18, 2) + rect(154, 56, 14, 2) + rect(154, 62, 18, 2)),
    gl('M156 84q8 4 14 0', 1),
  ],
  med_resident_01: [
    GROUND,
    s(rect(20, 20, 90, 54)),
    k(rect(26, 26, 78, 42)),
    a(rect(32, 34, 20, 10)),
    s(rect(58, 34, 20, 10) + rect(84, 34, 14, 10) + rect(32, 52, 20, 10) + rect(58, 52, 20, 10)),
    ...doctor(140, 64),
    f('M128 74l-16-20', 2),
    n(circ(176, 80, 7) + torso(176, 88, 108, 9)),
  ],
  med_complaint_01: [
    GROUND,
    ...doctor(40, 64),
    ...person(92, 66, 108, 12, true),
    a(rect(110, 54, 16, 26)),
    k(rect(113, 58, 10, 14)),
    gl('M134 60q6 6 0 12M142 54q10 12 0 24', 1.4),
    gl(rect(160, 28, 28, 36) + 'M164 36h20M164 44h14', 1),
  ],
  med_clinic_01: [
    GROUND,
    gl('M14 108V36h70V108M14 50h70', 1),
    gl('M100 108V36h70V108', 1),
    a(rect(104, 38, 62, 12)),
    k('M132 40h6v8h-6zM129 43h12v2h-12z'),
    s(rect(110, 60, 48, 48)),
    l('M134 60V108', 1),
    ...person(186, 70, 108, 9, true),
  ],
  med_old_01: [
    GROUND,
    s(circ(40, 62, 8) + 'M28 108V84q0-12 12-12t12 12V108z'),
    l('M34 58h12', 1.4),
    s(rect(64, 80, 70, 6)),
    f('M70 86V108M128 86V108', 2),
    ...person(150, 62, 108, 12, true),
    f('M142 50l6-6l6 6', 1.6),
    a(circ(176, 82, 6) + torso(176, 90, 108, 7)),
  ],
};
