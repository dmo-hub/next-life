// ภาพการ์ดหมวด era_econ_* (เศรษฐกิจตามยุค: น้ำมันแพงรอบสอง · ต้มยำกุ้ง · วิกฤตการเงินโลก) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// จุดเด่นแดงหนึ่งจุดต่อภาพ = สิ่งที่การ์ดถามผู้เล่น
import { gl, s, a, al, k, l, f, n, circ, rect, GROUND } from './parts.mjs';

// คน: หัว + ตัวทรงโค้ง · x กลางตัว · top = ไหล่ · foot = พื้น · w = ครึ่งความกว้างตัว
const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const body = (x, top, foot, w) => circ(x, top - 9, 8) + torso(x, top, foot, w);
const kidBody = (x, top, foot = 108) => circ(x, top - 6, 6) + torso(x, top, foot, 7);
const person = (x, top = 66, foot = 108, w = 12, dark = false) => [(dark ? n : s)(body(x, top, foot, w))];
// คนแก่: หลังค่อมเล็กน้อย + ไม้เท้า
const elder = (x, top = 70) => [s(circ(x + 3, top - 8, 8) + torso(x, top, 108, 11)), f(`M${x + 16} ${top + 10}V108`, 2)];
// โรงงานหลังคาฟันเลื่อย · x ซ้าย · w กว้าง
const factory = (x, w, top = 54) => `M${x} 108V${top}` + Array.from({ length: Math.round(w / 18) }, () => 'l18-12v12').join('') + `V108M${x + w - 14} ${top - 12}V${top - 30}h8V${top - 6}`;
const table = (x, w, y = 84) => [s(rect(x, y, w, 5)), f(`M${x + 4} ${y + 5}V108M${x + w - 4} ${y + 5}V108`, 2)];
const tv = (x, y, w = 44, h = 30) => [s(rect(x, y, w, h)), k(rect(x + 3, y + 3, w - 6, h - 6)), f(`M${x + w / 2} ${y + h}V108M${x + w / 2 - 10} 108h20`, 1.6)];
const bank = (x, w) => `M${x} 108V52h${w}V108M${x - 4} 52l${w / 2 + 4}-16l${w / 2 + 4} 16M${x + 8} 58v40M${x + w / 2} 58v40M${x + w - 8} 58v40`;

export default {
  era_econ_oil2_kid_01: [
    GROUND,
    s(rect(140, 50, 26, 58)),
    k(rect(145, 56, 16, 12)),
    f('M166 62h8v30h6', 2),
    a(rect(144, 34, 18, 12)),
    ...table(24, 80),
    n(body(40, 62, 84, 11) + body(88, 62, 84, 11)),
    s(kidBody(118, 84)),
  ],
  era_econ_oil2_small_01: [
    GROUND,
    gl('M150 20h20M160 20v16', 1),
    gl(circ(160, 42, 6), 1),
    ...table(40, 110),
    s(rect(91, 70, 8, 14)),
    a('M95 56q6 8 0 14q-6-6 0-14z'),
    n(body(56, 62, 84, 11) + body(134, 62, 84, 11)),
    s(kidBody(176, 84)),
  ],
  era_econ_oil2_farmer_01: [
    GROUND,
    s(circ(42, 96, 12) + circ(84, 100, 8) + 'M30 84V66h26l6 14h30v12H30z'),
    k(rect(34, 70, 16, 10)),
    a('M100 72h16v20h-16zM104 72v-6h8v6'),
    gl('M130 108V64h56V108M126 64l32-16l32 16', 1),
    n(body(146, 80, 108, 8) + body(170, 80, 108, 8)),
  ],
  era_econ_oil2_adult_01: [
    GROUND,
    gl(factory(12, 90), 1),
    gl('M110 108V60M110 60h24v12h-24', 1),
    a(rect(112, 62, 20, 8)),
    n(body(142, 76, 108, 9) + body(162, 78, 108, 9) + body(182, 76, 108, 8)),
  ],
  era_econ_tyk_kid_01: [
    GROUND,
    ...tv(20, 26, 66, 44),
    al('M30 38l14 6l10-2l20 20', 2),
    k('M68 62l6 0l0-6z'),
    n(body(120, 72, 108, 12)),
    s(kidBody(162, 84)),
  ],
  era_econ_tyk_office_01: [
    GROUND,
    gl('M120 108V24h64V108', 1),
    gl(rect(140, 64, 24, 44), 1),
    n(body(176, 66, 108, 9)),
    ...person(70, 64),
    a('M50 74h40v22h-40z'),
    l('M50 80h40', 1),
    s(circ(32, 72, 6) + 'M24 108V86q2-6 8-6q6 0 8 6v22z'),
    f('M38 76l6-10h6', 1.6),
  ],
  era_econ_tyk_adult_01: [
    GROUND,
    s(rect(20, 40, 70, 68) + rect(110, 40, 70, 68)),
    l('M20 50h70M20 60h70M20 70h70M20 80h70M20 90h70M20 100h70M110 50h70M110 60h70M110 70h70M110 80h70M110 90h70M110 100h70', 1),
    gl('M90 88h20', 1),
    al('M40 86q6-6 12 0q6 6 12 0q6-6 12 0', 2.4),
    k(rect(150, 82, 10, 10)),
  ],
  era_econ_tyk_old_01: [
    GROUND,
    gl(bank(110, 76), 1),
    a(rect(132, 64, 32, 10)),
    ...elder(30),
    n(body(66, 72, 108, 9) + body(88, 72, 108, 9)),
  ],
  era_econ_gfc_kid_01: [
    GROUND,
    gl(bank(16, 60), 1),
    al('M44 36l-6 12l8 6l-6 12l10 8l-4 10', 2.4),
    k(rect(14, 98, 66, 10)),
    ...table(100, 76),
    s(rect(122, 64, 30, 20)),
    k(rect(125, 67, 24, 14)),
    n(body(112, 66, 84, 10)),
    s(kidBody(176, 84)),
  ],
  era_econ_gfc_small_01: [
    GROUND,
    gl('M12 108V30h176V108', 0.8),
    ...table(110, 74),
    s(rect(130, 62, 34, 22)),
    a(rect(134, 66, 26, 14)),
    k(rect(138, 70, 18, 2) + rect(138, 75, 12, 2)),
    n(body(48, 66, 108, 12)),
    s(kidBody(80, 82)),
    l('M76 72q4 4 8 0', 1),
  ],
  era_econ_gfc_factory_01: [
    GROUND,
    gl(factory(12, 90), 1),
    s(rect(116, 36, 64, 44)),
    k(rect(120, 44, 56, 32)),
    gl('M120 52h56M120 60h56M120 68h56M134 44v32M148 44v32M162 44v32', 0.8),
    a('M164 46l10 4M174 46l-10 4M164 62l10 4M174 62l-10 4', 2),
    n(body(140, 96, 108, 7) + body(158, 96, 108, 7)),
  ],
  era_econ_gfc_adult_01: [
    GROUND,
    ...table(20, 120),
    s(rect(36, 76, 22, 8)),
    l('M38 80h18', 1),
    a('M90 84q-10-2-10-12q0-10 10-12l-4-6h12l-4 6q10 2 10 12q0 10-10 12z'),
    k('M88 70h4v10h-4z'),
    n(body(40, 62, 84, 11)),
    ...person(162, 66),
  ],
  era_econ_oil2_old_01: [
    GROUND,
    gl('M12 108V30h90V108', 1),
    a(rect(74, 40, 20, 26)),
    k(circ(84, 50, 6)),
    l('M84 50l3-4', 1),
    ...elder(40),
    s(body(140, 72, 108, 9)),
    s(rect(152, 86, 14, 12)),
    n(body(176, 76, 108, 8)),
  ],
  era_econ_gfc_old_01: [
    GROUND,
    ...tv(16, 36, 54, 36),
    gl('M24 46h38M24 54h28', 1),
    ...table(90, 54),
    a('M110 66h14v18h-14zM112 62h10v4h-10z'),
    k(rect(112, 72, 10, 6)),
    ...elder(164, 74),
  ],
  era_econ_oil2_farm_01: [
    GROUND,
    gl('M12 96h86M12 88h86M12 80h86', 1),
    gl('M20 80v-8M34 80v-8M48 80v-8M62 80v-8M76 80v-8M90 80v-8', 1),
    s(body(54, 70, 108, 11)),
    l('M44 54h20l-10-8z', 1),
    ...person(140, 66),
    a('M152 70h24v16h-24zM152 70l12 9l12-9'),
  ],
  era_econ_gfc_cafe_01: [
    GROUND,
    s(rect(12, 76, 110, 32)),
    gl('M12 76h110', 1),
    ...person(48, 54, 76, 11),
    a('M84 60h16v14h-16zM100 63q6 0 6 4t-6 4'),
    gl('M88 54q2-4 0-8M96 54q2-4 0-8', 1),
    n(body(152, 66, 108, 11)),
    n(body(178, 70, 108, 9)),
  ],
};
