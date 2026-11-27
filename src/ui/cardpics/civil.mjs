// ภาพการ์ดหมวดงานรัฐแรกเข้า scholar_* · kp_* · first_* (ใช้ทุน · สอบ ก.พ. · ธรรมเนียมวันแรกในหน่วยงาน) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// จุดเด่นแดงหนึ่งจุดต่อภาพ = สิ่งที่การ์ดถามผู้เล่น
import { gl, s, a, al, k, l, f, n, circ, rect, GROUND } from './parts.mjs';

const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const body = (x, top, foot, w) => circ(x, top - 9, 8) + torso(x, top, foot, w);
const table = (x, w, y = 84) => [s(rect(x, y, w, 5)), f(`M${x + 4} ${y + 5}V108M${x + w - 4} ${y + 5}V108`, 2)];
const house = (x, w, top) => `M${x} 108V${top}h${w}V108M${x - 4} ${top}l${w / 2 + 4}-${w / 3}l${w / 2 + 4} ${w / 3}`;
// หมวกแก๊ป: ปีกหน้า + ทรงบน · x กลางหัว · y ยอดหัว
const cap = (x, y) => `M${x - 9} ${y + 4}h20l-2-6h-16z`;
// ซองจดหมาย · ฝาเป็นเส้น l แยก
const envelope = (x, y, w, h) => rect(x, y, w, h);
const flap = (x, y, w, h) => `M${x} ${y}l${w / 2} ${h * 0.55}l${w / 2}-${h * 0.55}`;

export default {
  scholar_bond_due: [
    GROUND,
    gl(house(20, 70, 50), 1),
    gl(rect(46, 74, 18, 34), 1),
    s(body(120, 64, 108, 11)),
    n('M106 47l14-7l14 7l-14 6z'),
    f('M134 47v8', 1.2),
    a(envelope(136, 72, 26, 17)),
    l(flap(136, 72, 26, 17), 1),
  ],
  kp_exam_01: [
    GROUND,
    ...table(14, 44, 86),
    ...table(78, 44, 86),
    ...table(142, 44, 86),
    n(body(36, 70, 86, 10) + body(164, 70, 86, 10)),
    s(body(100, 68, 86, 10)),
    a(rect(90, 80, 22, 5)),
    gl(circ(100, 28, 10) + 'M100 28v-6M100 28h5', 1),
  ],
  kp_agency_01: [
    GROUND,
    s(rect(50, 14, 100, 66)),
    k(rect(54, 18, 92, 58)),
    l('M60 26h80M60 34h80M60 42h80M60 58h80M60 66h80', 1),
    a(rect(58, 47, 84, 6)),
    f('M70 80V108M130 80V108', 2),
    s(body(30, 76, 108, 11)),
    n(body(176, 78, 108, 10)),
  ],
  first_police_01: [
    GROUND,
    ...table(56, 92, 80),
    n(body(40, 62, 108, 12)),
    n(cap(40, 45)),
    s(body(166, 64, 108, 11)),
    s(cap(166, 47)),
    a(envelope(92, 70, 24, 10)),
    l(flap(92, 70, 24, 10), 1),
  ],
  first_gov_01: [
    GROUND,
    ...table(40, 120, 84),
    s(rect(70, 30, 60, 52)),
    k(rect(74, 34, 52, 44)),
    l('M78 42h44M78 52h44M78 62h44M78 72h44M98 36v40', 1),
    al('M104 40l3 3l6-6M104 50l3 3l6-6M104 60l3 3l6-6M104 70l3 3l6-6', 1.6),
    n(body(24, 70, 108, 11)),
    s(body(178, 72, 108, 10)),
  ],
  first_army_01: [
    GROUND,
    s('M18 108v-18q0-8 8-10l14-14h40l14 14q10 2 10 10v18z'),
    k('M44 70h16v12h-26zM64 70h14l10 12h-24z'),
    n(circ(36, 104, 7) + circ(92, 104, 7)),
    n(body(130, 78, 108, 9)),
    a('M114 98h12l-2 10h-8z'),
    s(body(172, 64, 108, 11)),
    s(cap(172, 47)),
  ],
  first_hunter_01: [
    GROUND,
    gl(circ(60, 56, 40), 1.2),
    gl('M60 30q16 10 6 26t-18 14', 1),
    n(body(52, 74, 108, 10) + body(80, 72, 108, 10)),
    s(body(150, 70, 108, 10)),
    f('M160 84l12-2', 2),
    l('M172 82l20-8M172 82l20 4', 1),
    a('M128 94l5 7l-5 7l-5-7z'),
  ],
};
