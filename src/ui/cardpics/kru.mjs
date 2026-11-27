// ภาพการ์ดหมวด kru_* (สายครู) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// จุดเด่นแดงหนึ่งจุดต่อภาพ = สิ่งที่การ์ดถามผู้เล่น
import { gl, s, a, al, k, l, f, n, circ, rect, GROUND } from './parts.mjs';

// คน: หัว + ตัวทรงโค้ง · x กลางตัว · top = ไหล่ · foot = พื้น · w = ครึ่งความกว้างตัว
const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const person = (x, top = 66, foot = 108, w = 12, dark = false) => [(dark ? n : s)(circ(x, top - 9, 8) + torso(x, top, foot, w))];
const desk = (x, w, y = 78) => [s(rect(x, y, w, 6)), f(`M${x + 4} ${y + 6}V108M${x + w - 4} ${y + 6}V108`, 2)];
// คนนั่งพับเพียบ · หัวสูงจากพื้น 24
const sit = (x, r = 5, foot = 108) => `${circ(x, foot - 24, r)}M${x - r - 2} ${foot}V${foot - 12}q0-${r} ${r + 2}-${r}t${r + 2} ${r}V${foot}z`;
// กระดานดำบนผนัง · k ด้านในเป็นพื้นกระดาน
const board = (x, y, w, h) => [s(rect(x, y, w, h)), k(rect(x + 4, y + 4, w - 8, h - 8))];
// นักเรียนนั่งโต๊ะหันหลังให้คนดู · แถวละ cnt คน
const pupils = (x0, step, cnt, foot = 108) => Array.from({ length: cnt }, (_, i) => sit(x0 + i * step, 5, foot)).join('');
const school = (x, w) => `M${x} 108V60h${w}V108M${x - 4} 60l${w / 2 + 4}-16l${w / 2 + 4} 16M${x + 8} 72h12v10h-12zM${x + w - 20} 72h12v10h-12z`;

export default {
  kru_kid_01: [
    GROUND,
    ...board(14, 20, 70, 40),
    l('M24 32h30M24 42h44', 1),
    s(circ(100, 64, 6) + torso(100, 72, 108, 8)),
    a('M108 74q6-4 12 0q6-4 12 0v14q-6-4-12 0q-6-4-12 0z'),
    k('M119 75h2v12h-2z'),
    n(pupils(148, 18, 3)),
  ],
  kru_teen_01: [
    GROUND,
    ...person(30, 66, 108, 11, true),
    ...person(58, 64, 108, 12, true),
    f('M68 74l14-4', 2),
    ...person(104, 66),
    a(rect(116, 62, 22, 28)),
    k(rect(120, 68, 6, 4) + rect(120, 76, 6, 4) + rect(120, 84, 6, 4)),
    gl(rect(152, 30, 34, 22) + 'M158 38h22M158 44h14', 1),
    s(circ(168, 72, 6) + torso(168, 80, 108, 8)),
  ],
  kru_local_01: [
    GROUND,
    gl(school(130, 54), 1),
    ...person(44, 64, 108, 12, true),
    f('M56 74l14-2', 2),
    a(rect(68, 58, 26, 32)),
    k(rect(72, 64, 18, 3) + rect(72, 70, 14, 3) + rect(72, 76, 18, 3)),
    s(circ(110, 72, 6) + torso(110, 80, 108, 8)),
  ],
  kru_admit_01: [
    GROUND,
    ...board(14, 18, 90, 44),
    l('M24 30h40M24 40h30', 1),
    ...person(70, 66),
    f('M80 72l8-24', 2),
    n(pupils(112, 16, 3)),
    ...person(182, 66, 108, 11, true),
    a(circ(162, 66, 8)),
    k(circ(162, 66, 5)),
    f('M162 66l3-4M159 56h6', 1.4),
  ],
  kru_admit_local_01: [
    GROUND,
    gl('M14 108V30h44V108M14 54h44M14 78h44', 1),
    ...person(84, 66),
    f('M96 74l10 2', 2),
    a(rect(104, 56, 26, 34)),
    k(rect(108, 62, 18, 3) + rect(108, 68, 14, 3) + rect(108, 74, 18, 3) + rect(108, 82, 10, 2)),
    gl('M140 66h20M152 60l8 6l-8 6', 1.4),
    gl(school(166, 26), 1),
  ],
  kru_practicum_01: [
    GROUND,
    ...person(30, 64, 108, 12, true),
    f('M42 76l10 2', 2),
    a(rect(52, 66, 30, 22)),
    k(rect(52, 72, 30, 1.4) + rect(52, 78, 30, 1.4)),
    n(rect(52, 86, 30, 4)),
    gl('M96 70h92M96 70V60M188 70V60', 1),
    s(pupils(104, 20, 5)),
    gl(rect(110, 90, 6, 9) + rect(150, 90, 6, 9) + rect(190, 90, 6, 9), 1),
  ],
  kru_exam_01: [
    GROUND,
    ...board(20, 18, 60, 50),
    a(rect(30, 28, 10, 10) + rect(46, 28, 10, 10) + rect(62, 28, 10, 10)),
    k(rect(30, 44, 10, 10) + rect(46, 44, 10, 10) + rect(62, 44, 10, 10)),
    f('M34 68V108M66 68V108', 2),
    s(Array.from({ length: 9 }, (_, i) => circ(98 + i * 10, 76 - (i % 2) * 6, 5)).join('')),
    s('M92 108V88h98V108z'),
  ],
  kru_temp_01: [
    GROUND,
    ...board(14, 20, 54, 34),
    ...person(84, 66),
    ...desk(100, 80, 84),
    a(rect(110, 52, 30, 32)),
    k(rect(110, 60, 30, 1.4) + rect(110, 68, 30, 1.4) + rect(110, 76, 30, 1.4)),
    s(rect(146, 62, 26, 22)),
    l('M146 72h26', 1),
    gl(rect(150, 22, 30, 26) + 'M150 30h30', 1),
  ],
  kru_small_01: [
    GROUND,
    ...board(10, 20, 60, 34),
    ...board(130, 20, 60, 34),
    a(circ(100, 57, 8) + torso(100, 66, 108, 11)),
    s(pupils(22, 16, 3)),
    n(pupils(146, 16, 3)),
    gl('M100 20V40', 1),
  ],
  kru_loan_01: [
    GROUND,
    gl('M12 108V42h70V108M6 42l41-18l41 18M30 108V80h22V108', 1),
    ...person(104, 66),
    f('M116 76l8 0', 2),
    a(rect(122, 60, 26, 32)),
    k(rect(126, 66, 18, 3) + rect(126, 72, 18, 3) + rect(126, 80, 10, 3)),
    gl('M160 92h26l-4-10h-18zM164 92v6M182 92v6M160 64l13-10l13 10v14h-26z', 1),
  ],
  kru_loan_02: [
    GROUND,
    ...person(36, 66),
    s(rect(66, 16, 64, 88)),
    k(rect(72, 24, 36, 3) + rect(72, 34, 46, 3) + rect(72, 42, 40, 3) + rect(72, 50, 46, 3) + rect(72, 58, 42, 3)),
    l('M72 70h52', 1),
    a(rect(110, 78, 14, 8)),
    gl('M150 108V60h34V108M156 70h22M156 80h22', 1),
  ],
  kru_old_01: [
    GROUND,
    s(circ(40, 60, 8) + 'M28 108V82q0-12 12-12t12 12V108z'),
    l('M34 56h12', 1.4),
    s(rect(58, 72, 30, 22)),
    l('M64 80h18M64 86h12', 1),
    al('M70 76q4 4 10-6', 2),
    n(sit(132, 6) + sit(154, 6) + sit(176, 6)),
    ...person(104, 66, 108, 11, true),
    f('M93 78l-5 0', 2),
  ],
};
