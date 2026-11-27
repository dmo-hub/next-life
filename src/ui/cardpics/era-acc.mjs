// ภาพการ์ดหมวด era_acc_* (อุบัติภัยตามยุค: ดินถล่ม · ไฟไหม้โรงงาน · ตึกถล่ม · ฝุ่นไซต์ก่อสร้าง) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// จุดเด่นแดงหนึ่งจุดต่อภาพ = สิ่งที่การ์ดถามผู้เล่น
import { gl, s, a, al, k, l, f, n, circ, rect, GROUND } from './parts.mjs';

// คน: หัว + ตัวทรงโค้ง · x กลางตัว · top = ไหล่ · foot = พื้น · w = ครึ่งความกว้างตัว
const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const body = (x, top, foot, w) => circ(x, top - 9, 8) + torso(x, top, foot, w);
const kidBody = (x, top, foot = 108) => circ(x, top - 6, 6) + torso(x, top, foot, 7);
const person = (x, top = 66, foot = 108, w = 12, dark = false) => [(dark ? n : s)(body(x, top, foot, w))];
// คนแก่: หลังค่อมเล็กน้อย + ไม้เท้า
const elder = (x, top = 70) => [s(circ(x + 3, top - 8, 8) + torso(x, top, 108, 11)), f(`M${x + 16} ${top + 10}V108`, 2)];
const house = (x, w, top) => `M${x} 108V${top}h${w}V108M${x - 4} ${top}l${w / 2 + 4}-${w / 3}l${w / 2 + 4} ${w / 3}`;
const tv = (x, y, w = 44, h = 30) => [s(rect(x, y, w, h)), k(rect(x + 3, y + 3, w - 6, h - 6)), f(`M${x + w / 2} ${y + h}V108M${x + w / 2 - 10} 108h20`, 1.6)];
const factory = (x, w, top = 54) => `M${x} 108V${top}` + Array.from({ length: Math.round(w / 18) }, () => 'l18-12v12').join('') + `V108M${x + w - 14} ${top - 12}V${top - 30}h8V${top - 6}`;

export default {
  era_acc_landslide_kid_01: [
    GROUND,
    s(rect(16, 18, 84, 58)),
    k(rect(20, 22, 76, 50)),
    l('M50 26q8 2 10 10t-4 12q6 4 2 10t-6 10', 1.4),
    a(circ(52, 66, 4)),
    s(kidBody(124, 84) + kidBody(150, 84) + kidBody(176, 84)),
    n(body(102, 82, 108, 9)),
  ],
  era_acc_landslide_adult_01: [
    GROUND,
    s('M12 108L64 28L120 108z'),
    gl(house(138, 40, 80), 1),
    a('M70 40q16 30 48 48q20 10 48 20H118q-30-24-48-68z'),
    n(body(176, 78, 108, 9)),
    f('M162 70l-12 38', 2),
  ],
  era_acc_landslide_old_01: [
    GROUND,
    gl('M12 108q40-70 90-70t86 70', 1),
    l('M40 74v-8h6v8M64 56v-8h6v8M118 56v-8h6v8M146 72v-8h6v8', 1.2),
    ...elder(84, 74),
    a('M104 84v-14M104 74q-8-2-10-10q8 0 10 10M104 72q8-2 10-10q-8 0-10 10'),
    s(kidBody(140, 86)),
  ],
  era_acc_fire_kid_01: [
    GROUND,
    gl(factory(110, 72, 64), 1),
    gl('M168 30q6-6 0-12M176 32q6-6 0-12', 1),
    s(rect(16, 70, 76, 6)),
    f('M20 76V108M88 76V108', 2),
    a(circ(54, 54, 6) + 'M46 70q0-10 8-10t8 10z'),
    s(kidBody(104, 86)),
  ],
  era_acc_fire_adult_01: [
    GROUND,
    gl('M20 108V20h100V108', 1),
    s(rect(46, 40, 44, 68)),
    k(rect(52, 46, 32, 26)),
    l('M58 54h20M58 62h20', 1),
    f('M84 82h-8', 2),
    a('M76 78v-6a6 6 0 0 1 12 0v6zM74 78h16v12h-16z'),
    n(body(150, 70, 108, 12)),
  ],
  era_acc_fire_old_01: [
    GROUND,
    ...tv(20, 30, 70, 44),
    l('M34 64v-12M46 64v-12M58 64v-12M70 64v-12', 3),
    a('M34 50q-3-4 0-8q3 4 0 8zM46 50q-3-4 0-8q3 4 0 8zM58 50q-3-4 0-8q3 4 0 8zM70 50q-3-4 0-8q3 4 0 8z'),
    s(circ(143, 66, 8) + 'M128 108V86q0-12 12-12h8q10 0 10 12v22z'),
    f('M120 92h44', 2),
  ],
  era_acc_collapse_kid_01: [
    GROUND,
    gl('M12 22H188', 1.2),
    al('M70 22l8 10l-6 6l10 10', 1.8),
    s(kidBody(48, 86) + kidBody(96, 86) + kidBody(144, 86)),
    n(body(176, 70, 108, 10)),
  ],
  era_acc_collapse_adult_01: [
    GROUND,
    s(rect(110, 46, 50, 62)),
    k(rect(118, 54, 10, 10) + rect(142, 54, 10, 10) + rect(118, 76, 10, 10) + rect(142, 76, 10, 10)),
    a(rect(114, 28, 42, 18)),
    n('M20 108l10-18l20 6l14-14l18 10l12 16z'),
    l('M30 96l26 4M52 88l18 8', 1),
    s(body(88, 82, 108, 9)),
  ],
  era_acc_collapse_old_01: [
    GROUND,
    s('M30 70h96v8H30zM24 70l54-24l54 24z'),
    s(rect(36, 78, 6, 30) + rect(74, 78, 6, 30) + rect(112, 78, 6, 30)),
    al('M115 82l3 6l-3 6l3 6', 1.6),
    ...elder(150, 72),
    s(kidBody(176, 88)),
  ],
  era_acc_haze_adult_01: [
    GROUND,
    gl('M110 108V22M110 22h70M110 32l16-10M170 22v28', 1.2),
    s(rect(124, 76, 56, 32)),
    gl(circ(40, 40, 12) + circ(62, 34, 14) + circ(82, 44, 10), 1),
    s(body(56, 74, 108, 12)),
    a(rect(49, 65, 14, 7)),
  ],
};
