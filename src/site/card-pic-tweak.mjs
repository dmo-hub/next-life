// หน้า tweak ภาพประจำการ์ด (thai-life-deep 209 · ข้อ 403 404): ตัวอย่าง 8 ใบจากหลายหมวด ให้เจ้าของเลือกตำแหน่ง ขนาด สไตล์เส้น ก่อนวาดจริงใบ 210
// ทุกภาพวาดด้วยโค้ด ไม่ลอกภาพใคร · ชิ้นบอก "บทบาท" ไม่บอกสี ⇒ รูปทรงชุดเดียวสลับสไตล์สดได้ และสีตามตัวแปรธีมของโลกนั้น
// บทบาท: g พื้นหลังทึบ · gl เส้นพื้นหลัง · s ทรงหลัก · a จุดเด่น · al เส้นจุดเด่น · k ช่องเจาะ (สีพื้นการ์ด) · l เส้นบนทรง (สไตล์ตัดทึบเป็นสีพื้น) · f เส้นนอกทรง (สีหมึกทุกสไตล์ ไม่งั้นหายบนพื้นการ์ด) · n ทรงเข้ม (ผม กระโปรง ประตู ที่ต้องเข้มกว่าทรงหลัก)
import { gzipSync } from 'node:zlib';
import { loadContent } from '../node/load.mjs';

export const CARD_PIC_PAGE = 'dev/tweak/card-pic-tweak.html';
export const CARD_PIC_START = '/*CARD-PIC:START*/';
export const CARD_PIC_END = '/*CARD-PIC:END*/';
export const CARD_PIC_W = 200, CARD_PIC_H = 125;

const g = (d) => ({ r: 'g', d });
const gl = (d, w = 1) => ({ r: 'gl', d, w });
const s = (d) => ({ r: 's', d });
const a = (d) => ({ r: 'a', d });
const al = (d, w = 2) => ({ r: 'al', d, w });
const k = (d) => ({ r: 'k', d });
const l = (d, w = 1.2) => ({ r: 'l', d, w });
const f = (d, w = 1.2) => ({ r: 'f', d, w });
const n = (d) => ({ r: 'n', d });
const circ = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
const GROUND = gl('M12 108H188', 1.2);

// คีย์ = id การ์ดจริงใน content/ · [หมวดที่ตัวอย่างนี้เป็นตัวแทน, โลกของการ์ด, ป้ายบรรยายภาพ, รูปทรง]
export const CARD_PICS = {
  kid_move_01: ['เด็ก · ครอบครัว', 'a', 'รถกระบะบรรทุกของ ยายยืนหน้าบ้าน', [
    gl('M12 108H188M14 66l14-11l14 11M18 66v42M38 66v42M24 108V86h9v22', 1.2),
    f(`${circ(50, 84, 3.5)}M50 88v12M50 92l-6-7M50 100l-3 8M50 100l3 8`, 1.3),
    s('M66 98V76h62V54h26q6 0 9 6l9 17q2 3 2 6v15z'),
    k('M136 60h17q3 0 4 3l6 13h-27z'),
    a('M70 76V56h22v20z'), a('M94 76V62h20v14z'), a('M75 56V44h15v12z'),
    l('M70 66h22M81 56v20M94 69h20M104 62v14M82 44v12'),
    l('M66 88h62M128 76v22'),
    s(circ(90, 99, 10)), s(circ(152, 99, 10)),
    k(circ(90, 99, 4)), k(circ(152, 99, 4)),
  ]],
  teen_first_love_01: ['วัยรุ่น · ความรัก', 'a', 'จดหมายเหน็บใต้โต๊ะเรียน', [
    g('M126 14h54v44h-54z'),
    gl('M126 14h54v44h-54zM153 14v44M126 36h54', 1),
    GROUND,
    s('M36 60h128v8H36z'),
    s('M46 68h108v16H46z'),
    f('M54 84l-8 24M146 84l8 24', 3),
    k('M54 72h92v8H54z'),
    a('M92 76l34-4l6 22l-36 6z'),
    l('M92 76l19 12l21-16'),
    k('M118 89q-3-4-6-1q-3-3-5 1q0 3 6 7q5-4 5-7z'),
    s('M52 48h40v12H52z'),
    k('M56 52h32v2H56z'),
    s('M58 38h32v10H58z'),
    al('M100 57h34', 2.4),
    f('M134 57h6'),
  ]],
  pet_kitten_gift_01: ['หนุ่มสาว · สัตว์เลี้ยง', 'a', 'ลูกแมวในกล่องกระดาษ', [
    GROUND,
    gl('M134 18h44q6 0 6 6v18q0 6-6 6h-28l-10 10v-10h-6q-6 0-6-6V24q0-6 6-6z', 1.2),
    gl('M156 38q-10-7-8-12q3-4 8 0q5-4 8 0q2 5-8 12z', 1.2),
    a('M64 76q-6-24 6-36l-4-20l16 11q10-3 20 0l16-11l-4 20q12 12 6 36z'),
    k('M78 50a4 5 0 1 0 8 0a4 5 0 1 0-8 0zM104 50a4 5 0 1 0 8 0a4 5 0 1 0-8 0z'),
    l('M92 58l3 3l3-3M95 61v4M95 65q-4 3-8 0M95 65q4 3 8 0', 1.3),
    f('M64 60l-16-3M64 66l-15 2M126 60l16-3M126 66l15 2', 1),
    a('M70 80q0-8 9-8t9 8zM102 80q0-8 9-8t9 8z'),
    s('M44 80h102v28H44z'),
    s('M44 80L30 68l18-6l14 18zM146 80l14-12l-18-6l-14 18z'),
    l('M44 94h102M96 80v14', 1),
  ]],
  fraud_sign_bribe_01: ['ทำงาน · ทุจริต', 'a', 'ซองหนาวางข้างแฟ้ม บนโต๊ะทำงาน', [
    gl('M12 106H188', 1.4),
    g('M12 106h176v7H12z'),
    s('M22 102V46h24l7 8h49v48z'),
    k('M30 62h62v4H30z'),
    l('M30 74h52M30 82h60M30 90h40', 1),
    s('M90 99l5-46l86 8l-5 46z'),
    a('M86 102l5-46l86 8l-5 46z'),
    l('M91 56l45 30l41-22'),
    s(circ(133, 87, 6)),
    al('M34 96l42-18', 2.6),
    l('M76 78l6-3M34 96l-5 2'),
  ]],
  debt_shark_collect_mid_01: ['กลางคน · หนี้', 'a', 'คนทวงหนี้ชูกระดาษยาวหน้าแผงตลาด', [
    GROUND,
    s('M18 34h164l10 20H8z'),
    k('M38 34l-6 20h16l4-20zM80 34l-3 20h16l1-20zM122 34l2 20h16l-3-20zM164 34l7 20h14l-7-20z'),
    gl('M18 54v54M182 54v54', 2),
    g('M112 84h66v24h-66z'),
    gl('M112 84h66v24h-66z', 1),
    f('M120 84q2-10 12-10t12 10M150 84q2-8 10-8t10 8', 1.2),
    s(circ(50, 66, 8)),
    s('M36 108V90q0-12 14-12t14 12v18z'),
    al('M62 86l18-8', 3.4),
    a('M78 60h26v44l-14-3l-12 3z'),
    l('M83 68h16M83 76h16M83 84h16M83 92h10', 1),
    f('M38 60l-8-4M36 68h-9M38 76l-8 3', 1.4),
  ]],
  oldh_dementia_01: ['ชรา · สุขภาพ', 'a', 'กาต้มน้ำไหม้ควันขึ้นบนเตาแก๊ส', [
    gl('M12 112H188', 1.2),
    s('M36 98h128v14H36z'),
    k(circ(54, 105, 3) + circ(146, 105, 3)),
    s('M62 90h76v8H62z'),
    a('M72 90q-6-9 2-16q1 7 5 5q5 6 0 11zM93 90q-7-11 3-20q1 8 6 6q6 7 0 14zM118 90q-6-9 2-16q1 7 5 5q5 6 0 11z'),
    s('M68 72q-6-30 32-34q38 4 32 34z'),
    s('M128 50l26-15l5 7l-27 20z'),
    k('M78 66q2-10 10-14l3 3q-6 4-7 12z'),
    f('M84 42q16-30 32 0', 3),
    s(circ(100, 33, 3)),
    f('M160 30q-6-6 0-12q6-6 0-12M172 34q-6-6 0-12q6-6 0-12M148 26q-5-5 0-10', 1.6),
    l('M72 72h56', 1),
  ]],
  after_transfer_any_01: ['ระหว่างชาติ · ปรโลก', 'af', 'คนโทรินน้ำกรวด เสียงสวดแผ่เป็นวง', [
    gl('M20 40q-12 0-12-9t13-9q4-10 16-8q8-8 18-3q12-3 15 8q11 0 11 11t-11 10z', 1),
    gl('M146 34q-10 0-10-8t11-8q4-8 13-6q7-6 15-2q10-2 12 6q9 0 9 9t-9 9z', 1),
    gl('M56 90q44-52 88 0M42 98q58-70 116 0M28 106q72-88 144 0', 0.8),
    s('M104 16q6-5 12-3l10 8q7 6 1 18q-4 9-16 13q-12 2-19-5q-4-5-3-10l-12-6l2-5l12 3q2-6 13-13z'),
    s('M112 10l10 8l5-5l-9-8z'),
    al('M76 42q-4 20-3 52', 2.6),
    s('M46 92h56q-2 18-18 20H64q-16-2-18-20z'),
    k('M50 92q24 7 48 0q-24-7-48 0z'),
    f('M60 88q-6-3-10-1M88 88q6-3 10-1', 1),
    a('M140 112q-16-2-22-20q16 2 22 20zM140 112q16-2 22-20q-16 2-22 20z'),
    a('M140 112q-11-14 0-34q11 20 0 34z'),
    gl('M112 112h56', 1),
  ]],
  cr_helvard_window: ['ต่างโลก · เมือง', 'i', 'บ้านเจ็ดหน้าต่าง ก่ออิฐปิดไปครึ่งหลัง', [
    GROUND,
    gl('M176 15a13 13 0 1 0 0 22a10 10 0 1 1 0-22z', 1),
    s('M134 34v-18h12v26z'),
    s('M40 108V52l60-36l60 36v56z'),
    k('M90 108V84q0-10 10-10t10 10v24z'),
    l('M100 74v34', 1),
    k('M92 34h16v14H92z'), l('M100 34v14M92 41h16', 1),
    k('M54 58h16v15H54z'), l('M62 58v15M54 65h16', 1),
    k('M54 84h16v15H54z'), l('M62 84v15M54 91h16', 1),
    a('M92 54h16v14H92z'), l('M92 59h16M92 64h16M98 54v5M103 59v5M98 64v4', 0.8),
    a('M130 58h16v15h-16z'), l('M130 63h16M130 68h16M136 58v5M141 63v5M136 68v5', 0.8),
    a('M130 84h16v15h-16z'), l('M130 89h16M130 94h16M136 84v5M141 89v5M136 94v5', 0.8),
    a('M114 84h12v15h-12z'), l('M114 89h12M114 94h12M120 84v5', 0.8),
  ]],
};

// ฉากยาก: หัวข้อที่รูปทรงเรขาคณิตเล่ายากสุด ลองก่อนวาดทั้งเกมว่า SVG ด้วยโค้ดเอาอยู่ไหม
export const CARD_PIC_HARD = {
  teen_entrance_exam_01: ['ฉากยาก · ชุดนักเรียน', 'a', 'นักเรียนหญิงชุดขาวกระโปรงกรม หน้าประตูโรงเรียน', [
    GROUND,
    g('M60 18h80v22H60z'),
    gl('M60 18h80v22H60zM20 108V30h16v78M164 108V30h16v78M36 40h24M140 40h24', 1.2),
    n('M83 36q-3-22 17-22t17 22l-2 16h-7V36q-8 2-16 0v16h-7z'),
    k('M92 34q8 3 16 0v8q-1 11-8 11t-8-11z'),
    f('M92 34q8 3 16 0v8q-1 11-8 11t-8-11zM96 41h1M103 41h1M98 47q2 1 4 0', 1),
    k('M80 62q9-7 20-7t20 7l7 17l-8 3l-3-6v18H84V76l-3 6l-8-3z'),
    f('M80 62q9-7 20-7t20 7l7 17l-8 3l-3-6v18H84V76l-3 6l-8-3zM92 56l8 8l8-8M105 74h8v7h-8z', 1.2),
    a('M95 64l5 3l5-3l-2 7l-3-2l-3 2z'),
    n('M84 94h32l5 11H79z'),
    l('M92 94l-3 11M100 94v11M108 94l3 11', 0.8),
    f('M91 105v3M109 105v3', 3),
    s('M126 80h15v20h-15z'),
    f('M118 60l10 20', 1.6),
  ]],
  bel_merit_wish_robe: ['ฉากยาก · วัด', 'a', 'โบสถ์หลังคาซ้อนช่อฟ้า ต้นผ้าป่าข้างบันได', [
    GROUND,
    s('M34 108V98h124v10z'),
    s('M48 98V66h96v32z'),
    k('M60 74h12v16H60zM120 74h12v16h-12z'),
    a('M84 98V80q12-12 24 0v18z'),
    l('M96 72v26', 1),
    s('M38 66l18-16h80l18 16z'),
    a('M54 50l42-34l42 34z'),
    l(`M72 50l24-20l24 20z${circ(96, 41, 3)}`, 1),
    f('M96 16q-1-8 5-10M54 50q-6 0-8-6M138 50q6 0 8-6M38 66q-6 0-8-6M154 66q6 0 8-6', 1.6),
    f('M176 108V62M176 90l-11-8M176 82l11-8M176 74l-9-8', 1.2),
    a('M160 76h8v5h-8zM184 68h8v5h-8zM163 60h8v5h-8zM173 54h8v5h-8z'),
  ]],
  after_ancestor_watch_01: ['ฉากยาก · ผี', 'af', 'ผีเรือนโปร่งแสงโน้มตัวเฝ้าเปลเด็ก', [
    gl('M12 20h176M12 112h176', 1.2),
    gl('M160 34a12 12 0 1 0 12 18a9 9 0 1 1-12-18z', 1),
    g('M34 104q-7-46 6-62q11-12 23-2q11 12 7 44q-2 8 6 20q-10 2-14-6q-4 8-12 8q-6-8-16-2z'),
    gl('M34 104q-7-46 6-62q11-12 23-2q11 12 7 44q-2 8 6 20q-10 2-14-6q-4 8-12 8q-6-8-16-2z', 1.1),
    gl('M68 62q12 0 24 14', 1.1),
    f('M46 54h3M58 54h3M49 64q4 3 8 0', 1.1),
    f('M84 84L112 20M140 84L112 20', 1.2),
    s('M78 84h68q0 24-34 24t-34-24z'),
    k(circ(110, 79, 8)),
    f('M106 79h1M113 79h1M108 83q2 1 4 0', 1),
    a('M92 88q20-14 40 0z'),
    gl('M26 30l2 5l5 2l-5 2l-2 5l-2-5l-5-2l5-2zM84 36l1 3l3 1l-3 1l-1 3l-1-3l-3-1l3-1z', 0.8),
  ]],
  after_realm_hell_01: ['ฉากยาก · นรก', 'af', 'ประตูนรกบานใหญ่ ยมบาลพาวิญญาณมาหยุดหน้าประตู', [
    GROUND,
    s('M36 108V26h22v82zM142 108V26h22v82z'),
    s('M26 26h148l-10-14H36z'),
    n('M58 108V38h84v70z'),
    l('M100 38v70M66 46v54M134 46v54', 1),
    a(`${circ(92, 70, 3)}${circ(108, 70, 3)}`),
    l('M42 40h10M42 56h10M42 72h10M42 88h10M148 40h10M148 56h10M148 72h10M148 88h10', 1),
    a('M6 108q-6-14 4-24q0 8 6 6q2-10 10-14q-2 12 6 18q4 8-2 14z'),
    a('M168 108q-6-6-2-14q8-6 6-18q8 4 10 14q6 2 6-6q10 10 4 24z'),
    k(circ(78, 76, 6)),
    k('M68 108V94q0-10 10-10t10 10v14z'),
    f(`${circ(78, 76, 6)}M68 108V94q0-10 10-10t10 10v14z`, 1.2),
    k('M73 72l-5-10l8 6zM83 72l5-10l-8 6zM91 108V64h3v44z'),
    k(circ(118, 90, 4)),
    k('M112 108q0-13 6-13t6 13z'),
    f(`${circ(118, 90, 4)}M112 108q0-13 6-13t6 13z`, 1),
    gl('M16 66l1 3M186 62l-1 3M30 58l1 3M172 54l-1 3', 1.2),
  ]],
  cp_major_envoy: ['ฉากยาก · isekai', 'i', 'ทูตขี่ม้าถือธง เมืองกำแพงอยู่ไกล', [
    GROUND,
    gl('M12 108V70h10v6h7v-6h10v6h7v-6h10v38M20 70V54l7-8l7 8v16', 1),
    gl('M120 108l24-44l18 26l10-14l16 32', 1),
    s('M66 78q0-12 14-12h36q5-16 16-20l4-7l3 9q8 4 11 13l-4 4l-10-3q-2 8-7 14q3 14-1 32h-6l-3-23H82l-6 23h-6q-4-16-2-26q-6 4-8 10q-4-6 0-14z'),
    f('M143 58h1', 1.6),
    a('M84 66h28v13H84z'),
    s('M90 66q-2-20 8-24q10 4 8 24z'),
    k(circ(98, 34, 6)),
    f(circ(98, 34, 6), 1.2),
    a('M91 31q7-11 14 0zM98 22q5-8 11-6q-3 5-8 8z'),
    f('M116 66V8', 1.8),
    a('M117 10h34l-8 8l8 8h-34z'),
    l(circ(128, 18, 3), 1),
    f('M104 52l12-2', 2),
  ]],
};

// ข้อความจริงจากการ์ด ไม่เขียนซ้ำในไฟล์นี้ — แก้เนื้อหา ตัวอย่างตามเอง · การ์ดต่างโลกใช้ป้าย t (text เป็นข้อความผล)
function sampleCard(id, byId) {
  const e = byId.get(id);
  if (!e) throw new Error(`src/site/card-pic-tweak.mjs: ไม่พบการ์ด ${id} ใน content/`);
  return { id, stage: e.stage ?? '', title: e.title, text: e.text, choices: (e.choices ?? []).map((c) => c.t ?? c.text) };
}

const bytes = (x) => Buffer.byteLength(x, 'utf8');

export function cardPicData(content = loadContent()) {
  const byId = new Map([...content.events, ...content.isekai].map((e) => [e.id, e]));
  const pic = (hard) => ([id, [cat, world, label, parts]]) => ({ ...sampleCard(id, byId), cat, world, label, parts, hard });
  const pics = [...Object.entries(CARD_PICS).map(pic(false)), ...Object.entries(CARD_PIC_HARD).map(pic(true))];
  // ขนาดนับจากข้อมูลที่จะฝังในเกม (บทบาท + path) ไม่ใช่ SVG เต็ม — เกมวาด SVG จากข้อมูลตอนแสดง แบบ artSvg
  const raw = pics.map((p) => bytes(JSON.stringify(p.parts)));
  const sum = raw.reduce((x, y) => x + y, 0);
  // gzip รวมทั้งชุดเพราะเว็บส่งไฟล์เดียว — path ซ้ำรูปแบบกันจึงบีบรวมได้ดีกว่าบีบทีละภาพ
  const gz = gzipSync(JSON.stringify(pics.map((p) => p.parts)), { level: 9 }).length;
  const cards = content.events.length + content.isekai.length;
  const est = (n) => Math.round((n / pics.length) * cards);
  return { w: CARD_PIC_W, h: CARD_PIC_H, pics, size: { raw, sum, gz, cards, estRaw: est(sum), estGz: est(gz) } };
}

export function injectCardPic(html, data, where) {
  const x = html.indexOf(CARD_PIC_START);
  const y = html.indexOf(CARD_PIC_END);
  if (x < 0 || y < x || html.indexOf(CARD_PIC_START, x + 1) >= 0) throw new Error(`${where}: ต้องมี ${CARD_PIC_START} … ${CARD_PIC_END} ชุดเดียว`);
  return html.slice(0, x + CARD_PIC_START.length) + JSON.stringify(data).replace(/</g, '\\u003c') + html.slice(y);
}

// ส่วนระหว่าง marker — ด่านเทียบกับข้อมูลตอนนี้ · null = ไม่มี/อ่านไม่ได้
export function cardPicBlock(html) {
  const x = html.indexOf(CARD_PIC_START);
  const y = html.indexOf(CARD_PIC_END);
  if (x < 0 || y < x) return null;
  try {
    return JSON.parse(html.slice(x + CARD_PIC_START.length, y));
  } catch {
    return null;
  }
}
