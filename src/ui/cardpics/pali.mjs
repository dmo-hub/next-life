// ภาพการ์ดหมวด pali_* (บวชเรียนบาลี) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// จุดเด่นแดงหนึ่งจุดต่อภาพ = สิ่งที่การ์ดถามผู้เล่น
import { gl, s, a, al, k, l, f, n, circ, rect, GROUND } from './parts.mjs';

// คน: หัว + ตัวทรงโค้ง · x กลางตัว · top = ไหล่ · foot = พื้น · w = ครึ่งความกว้างตัว
const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const person = (x, top = 66, foot = 108, w = 12, dark = false) => [(dark ? n : s)(circ(x, top - 9, 8) + torso(x, top, foot, w))];
const desk = (x, w, y = 78) => [s(rect(x, y, w, 6)), f(`M${x + 4} ${y + 6}V108M${x + w - 4} ${y + 6}V108`, 2)];
// พระ/เณร = ทรงเข้ม · ฆราวาส = ทรงหลัก
const monk = (x, top = 66, foot = 108, w = 12) => [n(circ(x, top - 9, 8) + torso(x, top, foot, w))];
// คนนั่งพับเพียบ · หัวสูงจากพื้น 24 · ทรงตามบทบาทที่ส่งมา
const sit = (x, r = 5, foot = 108) => `${circ(x, foot - 24, r)}M${x - r - 2} ${foot}V${foot - 12}q0-${r} ${r + 2}-${r}t${r + 2} ${r}V${foot}z`;
const seatedMonk = (x, foot = 108) => [n(circ(x, foot - 42, 8) + `M${x - 13} ${foot}V${foot - 22}q0-10 13-10t13 10V${foot}z`)];
// หนังสือกางบนโต๊ะ · x ซ้าย · y สันบน · hw ครึ่งความกว้าง · h สูง
const book = (x, y, hw, h) => `M${x} ${y}q${hw / 2}-5 ${hw} 0q${hw / 2}-5 ${hw} 0v${h}q-${hw / 2}-5-${hw} 0q-${hw / 2}-5-${hw} 0z`;
// บาตรมีฝา วางบนพื้นราบ y
const alms = (x, y, r = 12) => `M${x - r} ${y}q0-${r * 1.4} ${r}-${r * 1.4}t${r} ${r * 1.4}z`;
// โบสถ์ทรงไทย · x ซ้าย · w กว้าง · top = ยอดหลังคา
const templeRoof = (x, w, top) => `M${x} ${top + 24}l${w / 2}-24l${w / 2} 24zM${x - 2} ${top + 24}l-4-6M${x + w + 2} ${top + 24}l4-6`;
const heads = (x0, y, step, cnt, r = 5) => Array.from({ length: cnt }, (_, i) => circ(x0 + i * step, y, r)).join('');
const templeBody = (x, w, top) => rect(x + 6, top + 24, w - 12, 84 - top);

export default {
  pali_village_01: [
    GROUND,
    n('M10 40l34-18l34 18z'),
    s(rect(14, 40, 60, 22)),
    k(rect(30, 46, 12, 10)),
    f('M18 62V108M44 62V108M70 62V108', 2),
    s(sit(36, 6)),
    ...monk(112, 66, 108, 11),
    a(rect(122, 74, 20, 9)),
    k(rect(122, 78, 20, 1.2)),
    s(circ(164, 76, 6) + torso(164, 84, 108, 7)),
  ],
  pali_late_01: [
    GROUND,
    gl(rect(14, 50, 14, 58) + rect(32, 34, 16, 74) + rect(52, 60, 12, 48) + 'M36 42h8M36 52h8M36 62h8', 1),
    gl('M70 108L96 92M128 92l12 16', 1),
    ...person(110, 70, 108, 11),
    s(rect(90, 80, 10, 14)),
    a(templeRoof(140, 46, 34)),
    s(templeBody(140, 46, 34)),
    k(rect(157, 82, 12, 26)),
  ],
  pali_first_01: [
    GROUND,
    gl('M176 14a10 10 0 1 0 10 14a8 8 0 1 1-10-14z', 1),
    f('M22 108V36M62 108V36M16 36h52', 2),
    f('M42 36v8', 1.4),
    n('M33 62q0-18 9-18t9 18z'),
    gl('M56 50l8-4M56 58h10M28 50l-8-4M28 58h-10', 1),
    ...seatedMonk(110),
    s(rect(128, 90, 56, 5)),
    f('M132 95V108M180 95V108', 2),
    a(book(134, 80, 22, 10)),
    k('M155 77h2v12h-2z'),
  ],
  pali_homesick_01: [
    GROUND,
    gl('M140 108V60h44V108M132 60l30-22l30 22', 1),
    s(sit(26, 6) + sit(52, 6)),
    ...monk(112, 66, 108, 11),
    f('M100 80l-8 2', 2),
    a('M74 84l12-8l12 8l-12 8z'),
    l('M86 76v16', 1),
    gl('M80 70q2-6 0-10M88 68q2-6 0-10', 1),
  ],
  pali_friend_01: [
    GROUND,
    gl(rect(146, 18, 32, 26) + 'M162 18v26M146 31h32', 1),
    ...person(46, 64),
    n(rect(58, 76, 14, 20)),
    f('M58 78l-6-6', 1.4),
    a(rect(88, 96, 30, 12)),
    k(rect(88, 101, 30, 1.4)),
    ...seatedMonk(150),
  ],
  pali_exam_low_01: [
    GROUND,
    gl('M12 30l88-18l88 18M18 30V108M182 30V108', 1),
    n(heads(24, 70, 16, 6)),
    s(heads(30, 90, 16, 6, 6)),
    f('M18 100h96', 1.4),
    a(rect(122, 54, 52, 42)),
    k(rect(128, 62, 38, 2) + rect(128, 70, 42, 2) + rect(128, 78, 30, 2) + rect(128, 86, 36, 2)),
    f('M168 104l14-16', 2),
  ],
  pali_exam_mid_01: [
    GROUND,
    gl(templeRoof(14, 40, 14) + templeBody(14, 40, 14), 1),
    s(rect(64, 22, 30, 20)),
    l('M64 22l15 11l15-11', 1),
    ...monk(76, 66, 108, 11),
    f('M88 78l8 2', 2),
    a(rect(96, 66, 34, 26)),
    k(rect(102, 72, 22, 2) + rect(102, 78, 16, 2) + circ(122, 85, 3)),
    s('M150 108V78l18-14l18 14V108z'),
    k(rect(162, 90, 12, 18)),
  ],
  pali_fork_01: [
    GROUND,
    gl('M100 108V90M100 90L44 66M100 90L160 66', 1.2),
    n(templeRoof(16, 48, 18)),
    s(rect(22, 42, 36, 24)),
    k(rect(35, 50, 10, 16)),
    n('M134 38l28-16l28 16z'),
    s(rect(138, 38, 48, 28)),
    k(rect(144, 44, 5, 22) + rect(156, 44, 5, 22) + rect(168, 44, 5, 22) + rect(180, 44, 3, 22)),
    a(circ(100, 71, 8) + torso(100, 80, 108, 11)),
    l('M92 84L110 102', 1.2),
  ],
  pali_think_01: [
    GROUND,
    gl('M20 14l-4 10M34 14l-4 10M48 14l-4 10M62 14l-4 10M76 14l-4 10', 1),
    s(rect(46, 90, 84, 5)),
    f('M50 95V108M126 95V108', 2),
    a(alms(68, 90, 12)),
    n(rect(60, 71, 16, 3)),
    s(rect(96, 82, 28, 8) + rect(98, 74, 24, 8)),
    l('M96 86h28M98 78h24', 1),
    ...monk(166, 66, 108, 11),
    s(rect(140, 72, 16, 11)),
    l('M140 72l8 6l8-6', 1),
  ],
  pali_high_01: [
    GROUND,
    gl('M12 26l88-14l88 14M20 26V108M70 26V108M130 26V108M180 26V108', 1),
    n(sit(40, 5) + sit(100, 5) + sit(156, 5)),
    ...seatedMonk(64),
        a(rect(80, 80, 42, 22)),
    k(rect(80, 86, 42, 1.4) + rect(80, 92, 42, 1.4)),
    n(rect(80, 100, 42, 4)),
  ],
  pali_tid_01: [
    GROUND,
    n(sit(18, 5) + sit(36, 5) + sit(54, 5) + sit(72, 5)),
    gl('M84 66l6-4M84 74h8', 1),
    ...person(104, 70, 108, 11),
    f('M94 82l-8-4', 2),
    ...desk(136, 50, 86),
    a(rect(146, 46, 30, 40)),
    k(rect(150, 52, 10, 6) + rect(163, 52, 10, 6) + rect(150, 62, 10, 6) + rect(150, 72, 10, 6) + rect(163, 72, 10, 6)),
    al(rect(163, 62, 10, 6), 1.4),
  ],
  pali_teacher_01: [
    GROUND,
    s(rect(14, 22, 52, 34)),
    k(rect(18, 26, 44, 26)),
    l('M24 34h30M24 42h22', 1),
    ...person(80, 66),
    n(sit(110, 5) + sit(160, 5)),
    al(rect(124, 102, 18, 6) + rect(146, 90, 18, 6) + rect(170, 90, 18, 6) + rect(100, 90, 18, 6) + rect(124, 90, 18, 6) + rect(170, 102, 18, 6), 1.4),
  ],
  pali_old_01: [
    GROUND,
    f('M42 108V64M42 78l-12-10M42 74l12-8', 3),
    s(circ(30, 50, 18) + circ(54, 46, 18) + circ(42, 34, 16)),
    a(circ(28, 62, 4) + circ(50, 60, 4) + circ(40, 50, 4) + circ(60, 54, 4)),
    s(rect(136, 50, 52, 58)),
    n('M132 50h60l-6-10h-48z'),
    k(rect(144, 60, 14, 12) + rect(168, 60, 14, 12) + rect(156, 84, 14, 24)),
    ...person(96, 68, 108, 11),
    f('M106 76l6 32', 2),
    ...seatedMonk(134),
  ],
  pali_sister_01: [
    GROUND,
    gl('M150 108V70h36V108M144 70l24-18l24 18', 1),
    gl('M70 108L130 92', 1),
    n(circ(136, 76, 5) + torso(136, 83, 104, 6)),
    s(circ(50, 58, 8) + 'M50 68l-14 40h28z'),
    n('M41 58q0-12 9-12t9 12l-3-4h-12zM41 56l-3 10h4zM59 56l3 10h-4z'),
    f('M56 76l10 2', 2),
    a(rect(64, 66, 26, 20)),
    k('M75 70h3v12h-3zM73 72l4-2', 1),
  ],
};
