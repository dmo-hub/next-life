// ภาพการ์ดหมวด era_herald_* (ลางบอกเหตุก่อนภัยตามยุค: ไต้ฝุ่น · ซาร์ส · สึนามิ · น้ำท่วม · โควิด · น้ำมัน · ต้มยำกุ้ง · การเงินโลก) — ใบ 210 ขั้น ② · ผืน 200×125 พื้น y=108 · บทบาทชิ้นดู parts.mjs
// จุดเด่นแดงหนึ่งจุดต่อภาพ = สิ่งที่การ์ดถามผู้เล่น · ภาพยังสงบ เพราะภัยยังไม่มา
import { gl, s, a, al, k, l, f, n, circ, rect, GROUND } from './parts.mjs';

const torso = (x, top, foot, w) => `M${x - w} ${foot}V${top + w}q0-${w} ${w}-${w}t${w} ${w}V${foot}z`;
const body = (x, top, foot, w) => circ(x, top - 9, 8) + torso(x, top, foot, w);
const elder = (x, top = 70) => [s(circ(x + 3, top - 8, 8) + torso(x, top, 108, 11)), f(`M${x + 16} ${top + 10}V108`, 2)];
const table = (x, w, y = 84) => [s(rect(x, y, w, 5)), f(`M${x + 4} ${y + 5}V108M${x + w - 4} ${y + 5}V108`, 2)];
const house = (x, w, top) => `M${x} 108V${top}h${w}V108M${x - 4} ${top}l${w / 2 + 4}-${w / 3}l${w / 2 + 4} ${w / 3}`;
const factory = (x, w, top = 54) => `M${x} 108V${top}` + Array.from({ length: Math.round(w / 18) }, () => 'l18-12v12').join('') + `V108M${x + w - 14} ${top - 12}V${top - 30}h8V${top - 6}`;
const bank = (x, w) => `M${x} 108V52h${w}V108M${x - 4} 52l${w / 2 + 4}-16l${w / 2 + 4} 16M${x + 8} 58v40M${x + w / 2} 58v40M${x + w - 8} 58v40`;

export default {
  era_herald_typhoon_01: [
    GROUND,
    gl('M120 100h68M128 94h52', 1),
    s(house(24, 70, 60)),
    al('M34 54q26 22 52 0M50 46v14M70 46v14', 1.8),
    ...elder(120, 72),
  ],
  era_herald_sars_01: [
    GROUND,
    s(rect(20, 74, 70, 34)),
    f('M40 74v-18h20v6', 2),
    a('M60 66q-3 4 0 6q3-2 0-6zM60 76q-3 4 0 6q3-2 0-6z'),
    s(body(120, 66, 108, 12)),
    gl(rect(150, 30, 34, 48) + 'M150 46h34M150 62h34', 1),
  ],
  era_herald_tsunami_01: [
    GROUND,
    ...table(20, 80, 82),
    a(rect(38, 60, 40, 22) + 'M44 60l18-12'),
    k(circ(52, 71, 6)),
    gl('M84 58q6 6 0 14M90 52q12 12 0 26', 1.2),
    n(body(130, 68, 108, 11) + body(162, 70, 108, 10)),
  ],
  era_herald_flood_01: [
    GROUND,
    s('M12 108V64h40v44zM148 108V64h40v44z'),
    gl('M52 72q12-3 24 0t24 0t24 0t24 0', 1),
    s(rect(98, 40, 4, 68)),
    l('M98 52h6M98 64h6M98 76h6M98 88h6', 1),
    al('M90 70h20', 2.4),
    s(body(168, 50, 64, 9)),
  ],
  era_herald_covid_01: [
    GROUND,
    s(rect(20, 72, 100, 36)),
    gl(rect(30, 24, 80, 34), 1),
    l('M40 34v10M52 34v10M64 34v10M76 34v10M88 34v10M100 34v10', 1.4),
    a(rect(132, 34, 44, 26)),
    k(rect(138, 40, 32, 6)),
    s(body(154, 80, 108, 10)),
  ],
  era_herald_oil2_01: [
    GROUND,
    s(rect(30, 46, 32, 62)),
    a(rect(34, 52, 24, 14)),
    k(rect(34, 72, 24, 18)),
    f('M62 64h8v26h6', 2),
    s('M100 108V62q0-6 6-6h72q6 0 6 6v46z'),
    k(rect(108, 64, 14, 12) + rect(130, 64, 14, 12) + rect(152, 64, 14, 12)),
    n(circ(118, 108, 6) + circ(166, 108, 6)),
  ],
  era_herald_tyk_01: [
    GROUND,
    gl('M20 108V20h40V108M20 40h40M20 60h40M20 80h40M40 20V108', 1),
    s(bank(80, 56)),
    s(body(166, 70, 108, 11)),
    a('M136 94q-6-14 6-18h-6l2-6h12l2 6h-6q12 4 6 18z'),
  ],
  era_herald_gfc_01: [
    GROUND,
    gl(factory(16, 72, 60), 1),
    s(rect(100, 86, 22, 22) + rect(124, 86, 22, 22) + rect(112, 64, 22, 22)),
    a(rect(152, 34, 32, 30)),
    k(rect(156, 44, 24, 16)),
    l('M160 30v8M176 30v8', 1.6),
    n(body(168, 80, 108, 9)),
  ],
};
