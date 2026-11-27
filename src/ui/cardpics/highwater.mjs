// ภาพการ์ดหมวด highwater_* (หน้าน้ำหน้าแล้ง: น้ำท่วม น้ำลด ภัยแล้ง ไฟดับ สัตว์มีพิษ) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// จุดเด่นแดงหนึ่งจุดต่อภาพ = สิ่งที่การ์ดถามผู้เล่น
import { gl, s, a, al, k, l, f, n, circ, rect, GROUND } from './parts.mjs';

const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const body = (x, top, foot, w) => circ(x, top - 9, 8) + torso(x, top, foot, w);
const kidBody = (x, top, foot = 108) => circ(x, top - 6, 6) + torso(x, top, foot, 7);
const elder = (x, top = 70) => [s(circ(x + 3, top - 8, 8) + torso(x, top, 108, 11)), f(`M${x + 16} ${top + 10}V108`, 2)];
const house = (x, w, top) => `M${x} 108V${top}h${w}V108M${x - 4} ${top}l${w / 2 + 4}-${w / 3}l${w / 2 + 4} ${w / 3}`;
// น้ำเจิ่งพื้น: คลื่นสองแถว
const water = (y = 100) => gl(`M12 ${y}q8-4 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0M12 ${y + 6}q8-4 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0`, 1);
// กะละมังทรงชาม · x ซ้าย · w กว้าง
const basin = (x, w, foot = 108) => `M${x} ${foot - 12}h${w}l-4 12h${-(w - 8)}z`;
// แคร่ไม้ไผ่ · x ซ้าย · w กว้าง · y พื้นแคร่
const bench = (x, w, y = 90) => [s(rect(x, y, w, 5)), l(`M${x} ${y + 2}h${w}`, 0.8), f(`M${x + 4} ${y + 5}V108M${x + w - 4} ${y + 5}V108`, 2)];
// กระสอบทรายมองข้าง · (x, y) มุมบนซ้าย ยาว 24 สูง 10
const sandbag = (x, y) => `M${x + 2} ${y}h20q2 0 2 5t-2 5h-20q-2 0-2-5t2-5z`;

export default {
  highwater_centipede_01: [
    GROUND,
    gl(house(16, 80, 48), 1),
    a('M70 104q10-6 20 0t20 0' + Array.from({ length: 8 }, (_, i) => `M${74 + 5 * i} ${i % 2 ? 103 : 101}l-2 5M${74 + 5 * i} ${i % 2 ? 103 : 101}l2-5`).join('')),
    s(kidBody(140, 84)),
    n(body(176, 70, 108, 11)),
  ],
  highwater_basin_count_01: [
    GROUND,
    s('M120 108V60h50v20h16v28z'),
    k(rect(174, 84, 9, 10)),
    n(circ(134, 106, 6) + circ(176, 106, 6)),
    f('M120 70q-20 0-24 26', 1.8),
    n(basin(16, 26) + basin(48, 26)),
    a(basin(80, 26)),
    s(kidBody(40, 70, 94)),
  ],
  highwater_water_week_01: [
    GROUND,
    gl('M20 108l10-6h140l10 6', 1),
    n(body(40, 80, 104, 10) + body(160, 80, 104, 10) + body(132, 84, 104, 9)),
    s(body(68, 80, 104, 10)),
    s('M88 104V86h22v18z'),
    a('M96 80a5 5 0 1 0 10 0zM106 80h10', ),
    l('M88 90h22', 1),
  ],
  highwater_blackout_stars_01: [
    GROUND,
    n(house(14, 50, 64) + house(140, 48, 66)),
    gl('M30 20l2 4M80 14l2 4M130 24l2 4M170 16l2 4M60 36l2 4M110 40l2 4', 1.4),
    a('M100 12l3 7l7 1l-5 5l1 7l-6-4l-6 4l1-7l-5-5l7-1z'),
    gl('M70 108l6-6h48l6 6', 1),
    s(body(84, 88, 106, 8) + body(116, 88, 106, 8)),
  ],
  highwater_toilet_lid_01: [
    GROUND,
    water(102),
    s('M90 108V86h40v10q0 12-20 12z'),
    s(rect(124, 52, 14, 34)),
    k('M96 90h28v4h-28z'),
    a('M104 90q0-10 6-10q6 0 6 6l-3 4z'),
    s(body(52, 66, 108, 11)),
    f('M62 78l16 6', 2),
    l('M78 84l14 4M78 84l12 8', 1),
  ],
  highwater_musty_01: [
    GROUND,
    gl(rect(16, 36, 70, 72) + rect(114, 36, 70, 72), 1),
    gl(rect(30, 50, 20, 16) + rect(150, 50, 20, 16), 1),
    s(body(100, 66, 108, 11)),
    al('M112 52q6-4 10 0t10 0M114 60q6-4 10 0t10 0', 1.6),
  ],
  highwater_shoe_knock_01: [
    GROUND,
    gl(house(130, 56, 56), 1),
    n('M140 108v-6h12q4 0 4 6zM160 108v-6h12q4 0 4 6z'),
    s(body(80, 66, 108, 11)),
    f('M90 76l12-12', 2),
    a('M98 46l14 4v8l-4 6h-6l-6-12z'),
    gl('M118 44l4-2M118 52h5M116 60l4 2', 1.4),
  ],
  highwater_mud_first_01: [
    GROUND,
    gl('M12 104q20-6 40-2t40 0t40-2t56 2', 1.2),
    s(body(60, 66, 108, 11)),
    f('M70 76l26 20', 2),
    a('M94 92l12 4l-4 12l-12-4z'),
    n(body(150, 68, 108, 11)),
    f('M138 80q-20 10-10 26q10 4 20 0', 1.6),
  ],
  highwater_radio_sun_01: [
    GROUND,
    gl(circ(170, 24, 10) + 'M170 8v4M170 36v4M154 24h4M182 24h4', 1),
    s(rect(20, 84, 34, 24)),
    k(circ(30, 96, 6)),
    l('M42 90h8M42 96h8M42 102h8', 1),
    s(circ(84, 80, 14) + 'M82 94h4v14h-4z'),
    l('M84 66v28M70 80h28', 1),
    s('M112 108l6-14h26q4 0 4 4v10z'),
    f('M54 100q12 6 10-6', 1.4),
    a('M64 88h8v6h-8zM66 88v-4M70 88v-4'),
    s(kidBody(170, 84)),
  ],
  highwater_old_wok_01: [
    GROUND,
    s(body(70, 64, 108, 12)),
    a('M78 84q14 12 36 0zM114 84h12'),
    l('M88 88h2M96 90h2M104 88h2', 1.6),
    n(body(150, 68, 108, 11)),
    s('M170 108V96h14v12z'),
  ],
  highwater_sandbag_01: [
    GROUND,
    water(102),
    s(sandbag(20, 98) + sandbag(44, 98) + sandbag(68, 98) + sandbag(32, 88) + sandbag(56, 88) + sandbag(44, 78)),
    n(body(110, 70, 108, 10)),
    s(body(160, 70, 108, 10)),
    a(sandbag(140, 62)),
  ],
  highwater_one_boots_01: [
    GROUND,
    water(102),
    gl(rect(20, 36, 50, 72), 1.2),
    n(body(96, 70, 108, 10) + body(124, 72, 108, 10) + body(152, 70, 108, 10) + body(178, 74, 108, 9)),
    a('M38 108V86h8v16h8v6zM52 108V86h8v16h8v6z'),
  ],
  highwater_clutter_gift_01: [
    GROUND,
    gl('M140 108q-10-30 14-34q4-14 18-8q14 2 10 20q4 16-4 22', 1.2),
    n('M20 108v-14h20v14zM24 94v-10h16v10zM44 108v-10h18v10z'),
    s(body(90, 66, 108, 11)),
    a('M100 74h20v16h-20z'),
    l('M110 74v16M100 80h20', 1),
  ],
  highwater_foot_wipe_01: [
    GROUND,
    ...bench(30, 140, 88),
    n(body(50, 64, 88, 10) + body(150, 64, 88, 10)),
    s(body(100, 64, 88, 10)),
    f('M96 88v16M104 88v16', 2),
    a('M88 100h24v6h-24z'),
  ],
  highwater_under_house_01: [
    water(100),
    s('M30 60h120v8h-120zM24 60l66-30l66 30'),
    f('M38 68V108M90 68V108M142 68V108', 2.4),
    n('M56 82h22v8h-22z'),
    a('M110 96a4 4 0 1 1 5 3q10-3 14 4q1 5-5 5h-10q-6-3-4-12z'),
    ...elder(170, 60),
  ],
};
