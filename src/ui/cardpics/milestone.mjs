// ภาพการ์ดหมวด milestone_* (หลักไมล์ตามอายุ: ทางแยกวัยรุ่น · เบญจเพส · ร่างกายส่งสัญญาณ · ครบสี่รอบ) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// จุดเด่นแดงหนึ่งจุดต่อภาพ = สิ่งที่การ์ดถามผู้เล่น
import { gl, s, a, al, k, l, f, n, circ, rect, GROUND } from './parts.mjs';

const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const body = (x, top, foot, w) => circ(x, top - 9, 8) + torso(x, top, foot, w);
const table = (x, w, y = 84) => [s(rect(x, y, w, 5)), f(`M${x + 4} ${y + 5}V108M${x + w - 4} ${y + 5}V108`, 2)];

export default {
  milestone_teen_crossroad: [
    GROUND,
    gl('M100 108L40 60M100 108L100 56M100 108L160 60', 1),
    f('M100 108V40', 2),
    s('M100 42h30l6 5l-6 5h-30zM100 56h-30l-6 5l6 5h30z'),
    s(body(62, 86, 108, 8)),
    al('M70 52q0-8 7-8t7 8q0 5-7 8v4M77 68v2', 1.8),
    n(body(150, 80, 108, 10) + body(176, 82, 108, 9)),
  ],
  milestone_benchapet: [
    GROUND,
    gl('M30 108V54h80V108M24 54l46-30l46 30M58 40l12-10l12 10', 1),
    ...table(54, 34, 88),
    f('M64 88v-10M78 88v-10', 1.4),
    a('M64 78q-4-6 0-10q4 4 0 10zM78 78q-4-6 0-10q4 4 0 10z'),
    s(body(146, 70, 108, 11)),
    n(body(176, 74, 108, 10)),
  ],
  milestone_body_signal: [
    GROUND,
    s(circ(72, 56, 8) + 'M80 62q20-2 30 14l-6 6q-10-10-22-8zM104 82L96 108h8l8-24zM112 82l8 26h8l-8-28z'),
    f('M84 66l-6 20', 2),
    al('M112 60l6-4l-2 6l6-4l-2 6', 1.6),
    n(body(160, 70, 108, 10)),
    gl(circ(40, 30, 10), 1),
  ],
  milestone_fourth_cycle: [
    GROUND,
    ...table(60, 80, 86),
    s('M76 86V66h48V86zM82 66V58h36V66'),
    l('M76 74h48', 1),
    f('M88 58v-8M96 58v-8M104 58v-8M112 58v-8', 1.4),
    a('M88 50q-3-5 0-8q3 3 0 8zM96 50q-3-5 0-8q3 3 0 8zM104 50q-3-5 0-8q3 3 0 8zM112 50q-3-5 0-8q3 3 0 8z'),
    n(body(34, 70, 108, 11) + body(166, 70, 108, 11)),
  ],
};
