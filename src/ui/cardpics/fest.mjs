// ภาพการ์ดหมวด fest_* (เทศกาลประจำปี ใบเด็ก/ใบผู้ใหญ่) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// จุดเด่นแดงหนึ่งจุดต่อภาพ = ของประจำเทศกาลที่การ์ดถามถึง
import { g, gl, s, a, al, k, l, f, n, circ, rect, GROUND } from './parts.mjs';

const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const person = (x, top = 66, foot = 108, w = 12, dark = false) => [(dark ? n : s)(circ(x, top - 9, 8) + torso(x, top, foot, w))];
const water = [gl('M12 84H188', 1.2), g('M12 84h176v24H12z'), gl('M24 94q6-4 12 0t12 0M120 98q6-4 12 0t12 0', 1)];
const moon = (x, y) => gl(`M${x} ${y - 10}a10 10 0 1 0 8 16a8 8 0 1 1-8-16z`, 1);

export default {
  fest_songkran_kid_01: [
    GROUND,
    ...person(56, 56, 108, 13, true),
    ...person(140, 74, 108, 9),
    a('M84 60h28l-4 12h-20z'),
    al('M110 66q10 2 18 10M112 70q8 4 12 12', 1.4),
    k(rect(88, 62, 20, 3)),
  ],
  fest_songkran_adult_01: [
    GROUND,
    s('M20 100V44q0-8 8-8h112q8 0 8 8v56z'),
    k(rect(28, 46, 22, 18) + rect(56, 46, 22, 18) + rect(84, 46, 22, 18) + rect(112, 46, 22, 18)),
    s(circ(46, 102, 8) + circ(122, 102, 8)),
    a('M158 52l26-4l2 14l-26 4z'),
    l('M164 56l14-2', 1),
  ],
  fest_lent_kid_01: [
    GROUND,
    a('M84 108V40h32v68z'),
    al('M84 56h32M84 76h32M84 96h32', 1),
    s('M80 108h40v-4H80z'),
    f('M100 40v-8', 1.4),
    gl('M100 20q-6 6 0 12q6-6 0-12z', 1.2),
    ...person(44, 70, 108, 9),
    ...person(158, 70, 108, 9),
  ],
  fest_lent_adult_01: [
    GROUND,
    s('M20 76l40-24l40 24z'),
    s(rect(28, 76, 64, 32)),
    k(rect(52, 88, 16, 20)),
    a('M134 50h12v8l4 6v36h-20V64l4-6z'),
    al('M120 46l44 58M164 46l-44 58', 2),
  ],
  fest_loykrathong_kid_01: [
    GROUND,
    s(rect(20, 90, 80, 6)),
    f('M26 96v12M94 96v12', 2),
    g('M104 90h84v18h-84z'),
    gl('M112 100q6-4 12 0t12 0M150 102q6-4 12 0t12 0', 1),
    a('M120 90q30 0 40-10H110q0 10 10 10z'),
    al('M120 80l6-14l6 14M136 80l6-14l6 14', 1.4),
    f('M142 62v-8', 1.4),
    s('M34 90l10-10l10 10M56 90l10-10l10 10'),
    ...person(76, 64, 90, 9),
    moon(170, 24),
  ],
  fest_loykrathong_adult_01: [
    ...water,
    a('M86 84q22 0 30-8H78q0 8 8 8z'),
    al('M92 76l5-10l5 10', 1.4),
    n('M140 86q12 0 16-4h-24q0 4 8 4zM40 90q10 0 14-4H32q0 4 8 4z'),
    moon(164, 26),
    ...person(30, 56, 84, 9), ...person(56, 58, 84, 9, true),
  ],
  fest_newyear_kid_01: [
    GROUND,
    a(rect(74, 40, 52, 40)),
    k(rect(80, 46, 40, 28)),
    l('M88 54h6v12h-6zM100 54h6v12h-6z', 1.4),
    s(rect(84, 80, 32, 6)),
    ...person(40, 74, 108, 9), ...person(160, 74, 108, 9, true), ...person(100, 94, 108, 7),
  ],
  fest_newyear_adult_01: [
    GROUND,
    s(rect(20, 80, 160, 6)), f('M28 86v22M172 86v22', 2),
    a('M70 80l-6-26h72l-6 26z'),
    al('M64 54q36-30 72 0', 1.6),
    s(rect(80, 40, 14, 14) + rect(100, 36, 16, 18)),
    l('M87 40v14M100 44h16', 0.8),
    s(rect(36, 64, 18, 16) + rect(146, 66, 16, 14)),
  ],
};
