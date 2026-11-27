// ภาพการ์ดหมวด era_sport_* (กีฬาตามยุค: เอเชียนเกมส์ที่กรุงเทพฯ) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// จุดเด่นแดงหนึ่งจุดต่อภาพ = สิ่งที่การ์ดถามผู้เล่น
import { gl, s, a, f, n, k, circ, rect, GROUND } from './parts.mjs';

const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const body = (x, top, foot, w) => circ(x, top - 9, 8) + torso(x, top, foot, w);
const kidBody = (x, top, foot = 108) => circ(x, top - 6, 6) + torso(x, top, foot, 7);
const tv = (x, y, w = 44, h = 30) => [s(rect(x, y, w, h)), k(rect(x + 3, y + 3, w - 6, h - 6)), f(`M${x + w / 2} ${y + h}V108M${x + w / 2 - 10} 108h20`, 1.6)];

export default {
  era_sport_asiad_kid_01: [
    GROUND,
    ...tv(70, 26, 60, 40),
    gl('M80 56l8-12l8 6l10-14l10 20', 1),
    n(body(22, 70, 108, 11) + body(170, 70, 108, 11) + body(150, 76, 108, 9)),
    s(kidBody(48, 84)),
    f('M57 92V54', 1.6),
    a('M57 54l-16 4l16 6z'),
  ],
  era_sport_asiad_adult_01: [
    GROUND,
    gl('M12 30q44 16 88 0t88 0', 1),
    gl('M30 34l4 8l4-8zM66 40l4 8l4-8zM126 34l4 8l4-8zM162 40l4 8l4-8z', 1),
    s('M76 108V70h48V108zM84 70l16-14l16 14'),
    s(rect(96, 40, 8, 16)),
    a('M100 40q-8-8 0-20q8 12 0 20z'),
    n(body(36, 72, 108, 11) + body(160, 70, 108, 11)),
    s(body(184, 80, 108, 8)),
  ],
};
