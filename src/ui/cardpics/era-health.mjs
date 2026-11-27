// ภาพการ์ดหมวด era_health_* (โรคตามยุค: เอดส์ · ไข้หวัดนก · ฝุ่นละเอียด) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// จุดเด่นแดงหนึ่งจุดต่อภาพ = สิ่งที่การ์ดถามผู้เล่น
import { gl, s, a, al, k, l, f, n, circ, rect, GROUND } from './parts.mjs';

const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const body = (x, top, foot, w) => circ(x, top - 9, 8) + torso(x, top, foot, w);
const kidBody = (x, top, foot = 108) => circ(x, top - 6, 6) + torso(x, top, foot, 7);
const elder = (x, top = 70) => [s(circ(x + 3, top - 8, 8) + torso(x, top, 108, 11)), f(`M${x + 16} ${top + 10}V108`, 2)];
const table = (x, w, y = 84) => [s(rect(x, y, w, 5)), f(`M${x + 4} ${y + 5}V108M${x + w - 4} ${y + 5}V108`, 2)];
const house = (x, w, top) => `M${x} 108V${top}h${w}V108M${x - 4} ${top}l${w / 2 + 4}-${w / 3}l${w / 2 + 4} ${w / 3}`;
// โบว์รณรงค์ไขว้ · cx กลาง · y ยอดห่วง · h สูง
const ribbon = (cx, y, h) => `M${cx} ${y + h * 0.35}q-${h * 0.3}-${h * 0.35} 0-${h * 0.35}t0 ${h * 0.35}l-${h * 0.28} ${h * 0.65}h${h * 0.14}l${h * 0.14}-${h * 0.32}l${h * 0.14} ${h * 0.32}h${h * 0.14}z`;
// ไก่มองข้าง หันซ้าย · x หัว · foot พื้น
const hen = (x, foot) => `M${x} ${foot - 20}a5 5 0 1 1 6 4q14-4 20 6q2 8-8 10h-14q-8-4-6-14zM${x + 10} ${foot - 4}v4M${x + 16} ${foot - 4}v4`;
// เล้าไก่: กรอบ + ซี่ตั้ง
const coop = (x, w, top) => `M${x} 108V${top}h${w}V108` + Array.from({ length: Math.round(w / 10) - 1 }, (_, i) => `M${x + 10 * (i + 1)} ${top}V108`).join('');

export default {
  era_health_aids_first_01: [
    GROUND,
    ...table(30, 110, 82),
    s(body(56, 60, 82, 11)),
    s(rect(72, 38, 40, 40)),
    l('M76 68h32M76 73h24', 1),
    a(ribbon(92, 42, 22)),
    n(body(136, 62, 82, 11) + body(164, 66, 82, 10)),
  ],
  era_health_aids_idu_01: [
    GROUND,
    gl(house(20, 70, 56), 1),
    gl(rect(46, 76, 18, 32), 1),
    n(body(130, 70, 108, 11) + body(168, 70, 108, 11)),
    al('M140 52q4-4 8 0t8 0', 1.6),
  ],
  era_health_aids_campaign_01: [
    GROUND,
    s(rect(20, 20, 96, 52)),
    k(rect(24, 24, 88, 44)),
    f('M40 72V108M96 72V108', 2),
    a(ribbon(52, 30, 34)),
    l('M76 40h28M76 48h22M76 56h26', 1.2),
    s(body(156, 66, 108, 12)),
  ],
  era_health_avian_kid_01: [
    GROUND,
    gl(coop(20, 80, 60), 1),
    gl('M16 60l44-14l44 14', 1),
    a('M60 104q8-10 20-8q-6 6-20 8zM62 104l14-6', 1),
    s(kidBody(140, 84)),
  ],
  era_health_avian_adult_01: [
    GROUND,
    s(rect(20, 76, 90, 32)),
    gl('M16 40h98M24 40V76M106 40V76', 1),
    f('M64 40v10', 1.2),
    a('M58 50h12q6 4 2 14q-4 6-8 6t-8-6q-4-10 2-14z'),
    k(rect(30, 84, 30, 8)),
    n(body(160, 68, 108, 11)),
  ],
  era_health_avian_old_01: [
    GROUND,
    gl(coop(110, 70, 62), 1),
    gl('M106 62l39-14l39 14', 1),
    s(hen(130, 108)),
    f('M20 108V20', 1.6),
    s('M20 22l16-6v16l-16-6z'),
    ...elder(70, 72),
    a(hen(28, 92)),
  ],
  era_health_pm25_kid_01: [
    GROUND,
    s(rect(20, 20, 90, 60)),
    k(rect(24, 24, 82, 52)),
    a(circ(66, 46, 10)),
    gl('M28 40h74M28 52h74M28 64h74', 1),
    ...table(120, 60, 82),
    s(kidBody(150, 70, 82)),
  ],
  era_health_pm25_adult_01: [
    GROUND,
    s(rect(30, 24, 40, 70)),
    k(rect(34, 30, 32, 52)),
    a(circ(50, 52, 12)),
    k(circ(50, 52, 6)),
    s(body(130, 66, 108, 12)),
    gl('M146 52q6-2 8 2M146 58q8 0 10 6', 1.2),
  ],
};
