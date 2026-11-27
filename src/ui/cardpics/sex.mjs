// ภาพการ์ดหมวด sex_* (เพศกับสิ่งที่สังคมคาดหวัง) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// จุดเด่นแดงหนึ่งจุดต่อภาพ = สิ่งที่การ์ดถามผู้เล่น · ตัวละครข้ามเพศวาดเป็นคนธรรมดาในฉาก ไม่ทำท่าล้อ
import { gl, s, a, al, k, l, f, n, circ, rect, GROUND } from './parts.mjs';

// คน: หัว + ตัวทรงโค้ง · x กลางตัว · top = ไหล่ · foot = พื้น · w = ครึ่งความกว้างตัว
const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const person = (x, top = 66, foot = 108, w = 12, dark = false) => [(dark ? n : s)(circ(x, top - 9, 8) + torso(x, top, foot, w))];
const desk = (x, w, y = 78) => [s(rect(x, y, w, 6)), f(`M${x + 4} ${y + 6}V108M${x + w - 4} ${y + 6}V108`, 2)];
// คนนั่งพับเพียบ · หัวสูงจากพื้น 24
const sit = (x, r = 5, foot = 108) => `${circ(x, foot - 24, r)}M${x - r - 2} ${foot}V${foot - 12}q0-${r} ${r + 2}-${r}t${r + 2} ${r}V${foot}z`;
// ผมยาวประบ่า ครอบหัวของ person(x, top)
const longHair = (x, top) => `M${x - 9} ${top - 6}q0-13 9-13t9 13v10h-3v-12q-6-6-12 0v12h-3z`;
// แถวผู้ชายยืนต่อคิว
const queue = (x0, step, cnt, h = 34) => Array.from({ length: cnt }, (_, i) => circ(x0 + i * step, 108 - h - 5, 5) + torso(x0 + i * step, 108 - h + 3, 108, 7)).join('');

export default {
  sex_lottery_01: [
    GROUND,
    gl('M12 108V34h96V108M8 34l52-18l52 18M24 46h72', 1),
    s(queue(22, 18, 5)),
    gl('M150 108V70M162 108V70M174 108V70M186 108V70M146 76h44', 1),
    n(circ(170, 80, 5) + torso(170, 88, 108, 7)),
    ...desk(110, 34, 86),
    a(rect(116, 70, 22, 16)),
    k(rect(122, 70, 10, 3)),
  ],
  sex_ordain_01: [
    GROUND,
    gl(rect(130, 20, 30, 24) + 'M145 20v24M130 32h30', 1),
    s(sit(40, 6)),
    gl('M52 70l6-4M52 78h8', 1),
    ...person(80, 66, 108, 11, true),
    f('M90 74l12 6', 2),
    s('M104 102h44l-4 6h-36z'),
    f('M126 102V96', 2),
    a(rect(110, 86, 32, 10)),
    k(rect(110, 90, 32, 1.4)),
    ...person(170, 66),
  ],
  sex_daughter_care_01: [
    GROUND,
    n(rect(14, 64, 6, 44)),
    s(rect(20, 82, 64, 10)),
    s(circ(30, 76, 6)),
    f('M24 92V108M80 92V108', 2),
    n(sit(104, 5) + sit(124, 5)),
    ...person(146, 68, 108, 11, true),
    f('M156 76l10 6', 2),
    a(circ(178, 60, 7) + torso(178, 68, 108, 9)),
  ],
  sex_menopause_01: [
    GROUND,
    gl('M30 14a10 10 0 1 0 10 14a8 8 0 1 1-10-14z', 1),
    gl(circ(160, 28, 10) + 'M160 22v6l4 3', 1),
    n(rect(36, 60, 8, 48)),
    s(rect(44, 84, 120, 10)),
    n(rect(44, 94, 120, 5)),
    f('M48 99V108M160 99V108', 2),
    s(circ(84, 52, 8) + 'M72 84V70q0-10 12-10t12 10V84z'),
    s(rect(100, 76, 60, 8)),
    al('M78 46q-4-6 0-12t0-12M90 46q-4-6 0-12t0-12', 2),
  ],
  sex_pay_gap_01: [
    GROUND,
    ...person(40, 66),
    ...desk(64, 90, 84),
    s(rect(76, 64, 30, 20)),
    l('M76 64l15 10l15-10', 1),
    a(rect(118, 46, 30, 38)),
    k(rect(124, 52, 18, 3) + rect(124, 60, 18, 3) + rect(124, 68, 18, 3) + rect(124, 76, 18, 3)),
    gl('M164 108V40h24V108M170 52h12', 1),
  ],
  sex_identity_found_01: [
    GROUND,
    gl(rect(14, 20, 40, 46) + circ(14, 20, 2) + circ(54, 20, 2) + circ(14, 66, 2) + circ(54, 66, 2), 1),
    s(rect(18, 66, 32, 6)),
    ...person(76, 66),
    n(longHair(76, 66)),
    f('M88 76l12 2', 2),
    a('M104 54h16l-2 12h-12zM106 66h12l8 42h-28z'),
    ...person(150, 66),
    gl('M168 108q10-12 20 0M172 102l6-10l6 10', 1),
  ],
  sex_identity_family_old_01: [
    GROUND,
    s(rect(130, 26, 46, 32)),
    k(rect(134, 30, 38, 24)),
    gl(circ(146, 40, 4) + 'M156 46q4-6 10 0', 1),
    f('M144 58l-4 8M162 58l4 8', 1.6),
    n(sit(30, 6) + sit(58, 6)),
    ...desk(76, 50, 84),
    s(rect(82, 66, 26, 18)),
    a('M96 70h18l6 14h-30z'),
    ...person(170, 72, 108, 10),
  ],
  sex_identity_family_new_01: [
    GROUND,
    ...person(30, 64, 108, 12, true),
    ...person(64, 66),
    f('M74 74l6-4', 2),
    a('M80 44h14q3 0 3 3v24q0 3-3 3h-14q-3 0-3-3V47q0-3 3-3z'),
    k(rect(81, 49, 12, 18)),
    ...desk(14, 150, 84),
    s(rect(140, 78, 22, 6)),
    ...person(120, 70, 108, 11),
    n(longHair(120, 70)),
    ...person(176, 74, 108, 9),
  ],
  sex_lottery_trans_old_01: [
    GROUND,
    ...person(40, 64, 108, 12, true),
    ...person(70, 64, 108, 12, true),
    ...desk(22, 70, 84),
    ...person(140, 66),
    n(longHair(140, 66)),
    f('M128 78l-10 0', 2),
    a(rect(100, 64, 18, 24)),
    k(rect(103, 68, 12, 2) + rect(103, 74, 8, 2) + rect(103, 80, 12, 2)),
  ],
  sex_lottery_trans_new_01: [
    GROUND,
    gl('M150 108V30h36V108M162 42h12M168 36v12', 1.2),
    s(queue(18, 18, 4)),
    ...person(104, 66),
    n(longHair(104, 66)),
    f('M116 78l8 2', 2),
    a(rect(122, 66, 22, 28)),
    k(rect(126, 72, 14, 2) + rect(126, 78, 10, 2) + rect(126, 84, 14, 2)),
  ],
};
