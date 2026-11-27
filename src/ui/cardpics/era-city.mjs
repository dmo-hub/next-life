// ภาพการ์ดหมวด era_city_* (เมืองเปลี่ยนตามยุค: มือถือ · อินเทอร์เน็ต · รถไฟฟ้า · สนามบินใหม่) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// จุดเด่นแดงหนึ่งจุดต่อภาพ = สิ่งที่การ์ดถามผู้เล่น
import { gl, s, a, al, k, l, f, n, circ, rect, GROUND } from './parts.mjs';

const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const body = (x, top, foot, w) => circ(x, top - 9, 8) + torso(x, top, foot, w);
const kidBody = (x, top, foot = 108) => circ(x, top - 6, 6) + torso(x, top, foot, 7);
const person = (x, top = 66, foot = 108, w = 12, dark = false) => [(dark ? n : s)(body(x, top, foot, w))];
const elder = (x, top = 70) => [s(circ(x + 3, top - 8, 8) + torso(x, top, 108, 11)), f(`M${x + 16} ${top + 10}V108`, 2)];
const table = (x, w, y = 84) => [s(rect(x, y, w, 5)), f(`M${x + 4} ${y + 5}V108M${x + w - 4} ${y + 5}V108`, 2)];
const tv = (x, y, w = 44, h = 30) => [s(rect(x, y, w, h)), k(rect(x + 3, y + 3, w - 6, h - 6)), f(`M${x + w / 2} ${y + h}V108M${x + w / 2 - 10} 108h20`, 1.6)];
// จอคอมพิวเตอร์ตู้บนโต๊ะ · x ซ้าย · y บน
const crt = (x, y, w = 40, h = 30) => [s(rect(x, y, w, h) + rect(x + w / 2 - 6, y + h, 12, 6)), k(rect(x + 4, y + 4, w - 8, h - 8))];
// เครื่องบินมองข้าง · x จมูก · y แนวลำตัว · หันขวา
const plane = (x, y) => `M${x} ${y}q-4-4-12-4h-46l-8-12h-6l4 12h-4v8h60q8 0 12-4zM${x - 34} ${y + 2}l-10 14h8l16-14z`;

export default {
  era_city_mobile_adult_01: [
    GROUND,
    ...table(20, 110, 80),
    n(body(40, 58, 80, 11) + body(110, 58, 80, 11)),
    s(body(158, 64, 108, 12)),
    a(rect(168, 40, 10, 22) + rect(172, 30, 3, 10)),
    gl('M184 36q4 4 0 8M188 32q8 8 0 16', 1.2),
  ],
  era_city_mobile_old_01: [
    GROUND,
    ...elder(70, 70),
    a(rect(52, 66, 10, 18)),
    k(rect(54, 68, 6, 5)),
    s(kidBody(124, 84)),
    f('M118 94l-14-10', 2),
  ],
  era_city_net_adult_01: [
    GROUND,
    ...table(20, 90, 76),
    ...crt(36, 36, 50, 34),
    a(rect(40, 40, 42, 12)),
    s(rect(92, 66, 14, 10)),
    gl('M110 62q4 4 0 8M114 58q8 8 0 16', 1),
    n(body(140, 66, 108, 11) + body(170, 70, 108, 10)),
  ],
  era_city_net_kid_01: [
    GROUND,
    ...table(14, 74, 78),
    ...crt(22, 40, 40, 30),
    a('M70 72q0-6 5-6t5 6v4h-10z'),
    f('M75 66q0-6 6-8', 1.2),
    s(kidBody(110, 82) + kidBody(134, 82) + kidBody(158, 82) + kidBody(182, 82)),
  ],
  era_city_bts_adult_01: [
    GROUND,
    s(rect(12, 50, 176, 6)),
    s(rect(40, 56, 8, 52) + rect(150, 56, 8, 52)),
    a('M40 50V32q0-6 6-6h100q10 0 14 10l4 14z'),
    k(rect(52, 32, 14, 10) + rect(76, 32, 14, 10) + rect(100, 32, 14, 10) + rect(124, 32, 14, 10)),
    n(rect(60, 92, 26, 12) + rect(96, 92, 26, 12) + rect(160, 92, 26, 12)),
  ],
  era_city_bts_old_01: [
    GROUND,
    s('M12 108h20v-10h16v-10h16v-10h16v-10h16v-10h16v-10h16v60z'),
    a(rect(120, 20, 68, 18)),
    k(rect(128, 24, 12, 8) + rect(150, 24, 12, 8) + rect(172, 24, 12, 8)),
    s(circ(59, 70, 7) + torso(56, 78, 98, 8)),
    f('M70 82v16', 2),
    n(circ(104, 40, 5) + torso(104, 46, 68, 6)),
  ],
  era_city_airport_adult_01: [
    GROUND,
    ...tv(20, 26, 80, 50),
    gl('M28 66q36-24 64 0', 1),
    a(plane(94, 46)),
    n(body(130, 70, 108, 11) + body(160, 66, 108, 12)),
  ],
  era_city_airport_old_01: [
    GROUND,
    gl('M12 96H188', 1),
    a('M168 26q-4-4-12-2l-44 14l-10-10l-6 2l4 14l-4 2l4 6l58-18q8-2 10-8zM132 34l-4 18l8-2l10-20z'),
    ...elder(48, 70),
    s(kidBody(84, 86)),
  ],
};
