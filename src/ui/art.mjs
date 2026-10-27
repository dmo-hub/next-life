// ภาพประกอบวาดด้วยโค้ด (B56): ข้อมูลรูปทรงล้วน ไม่แตะ DOM — จอวาดเป็น SVG ภาพแชร์วาดด้วย Path2D จากชุดเดียวกัน
// ทุกชิ้นเป็น path สตริงเดียวต่อชิ้น { d, fill, stroke, w } เพราะ Path2D รับสตริง path ของ SVG ได้ตรง ๆ
// สีตายตัวทุกธีม (เจ้าของเคาะ): แผ่นรักดำ+ทอง · ธีมสว่างก็เป็นแผ่นเข้มเหมือนกรอบภาพบนพื้นขาว
// ชื่อระดับบนสุดขึ้นต้น ART/art ทั้งหมด — build ต่อทุกโมดูลเป็นสคริปต์เดียว ชื่อซ้ำกับแกนหรือ app.mjs จะพังทั้งหน้า

export const ART_INK = { lacquer: '#17110D', lacquer2: '#221912', gold: '#D9B45A', gold2: '#F0D78C', cream: '#EFE3C2', bronze2: '#8A6D3B' };
const ART_LINE = { stroke: ART_INK.gold, w: 1.6 };

const artCirc = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
// คลื่นต่อเนื่องจาก x0 ถึง x1 — ใช้ทั้งน้ำท่วม คลื่นยักษ์ และพายุ
const artWave = (x0, x1, y, step, amp) => {
  let d = `M${x0} ${y}q${step / 2} ${-amp} ${step} 0`;
  for (let x = x0 + step; x + step <= x1; x += step) d += `t${step} 0`;
  return d;
};
const artLine = (d, extra) => ({ d, ...ART_LINE, ...extra });
const artFill = (d, fill = ART_INK.gold2) => ({ d, fill });

// กรอบแผ่นภาพยุค: ขอบทองคู่ + ลายกนกม้วนที่มุม (ลายไทยทองบนพื้นเข้ม)
export const ERA_ART_W = 200, ERA_ART_H = 80;
const ERA_FRAME = [
  { d: `M0 0h${ERA_ART_W}v${ERA_ART_H}h-${ERA_ART_W}z`, fill: ART_INK.lacquer2 },
  artLine(`M4 4h${ERA_ART_W - 8}v${ERA_ART_H - 8}h-${ERA_ART_W - 8}z`, { w: 1.2 }),
  artLine(`M7 7h${ERA_ART_W - 14}v${ERA_ART_H - 14}h-${ERA_ART_W - 14}z`, { stroke: ART_INK.bronze2, w: 0.6 }),
  artLine('M10 22q0-12 12-12q-6 3-6 8q0 4 4 4q3 0 3-3', { w: 1 }),
  artLine(`M${ERA_ART_W - 10} 22q0-12-12-12q6 3 6 8q0 4-4 4q-3 0-3-3`, { w: 1 }),
  artLine(`M10 ${ERA_ART_H - 22}q0 12 12 12q-6-3-6-8q0-4 4-4q3 0 3 3`, { w: 1 }),
  artLine(`M${ERA_ART_W - 10} ${ERA_ART_H - 22}q0 12-12 12q6-3 6-8q0-4-4-4q-3 0-3 3`, { w: 1 }),
];
const ART_GROUND = artLine('M26 66H174', { stroke: ART_INK.bronze2, w: 1 });
const artBarrel = (x, y) => artLine(`M${x} ${y}h18v28h-18zM${x} ${y + 8}h18M${x} ${y + 20}h18`);
const artCar = (x) => [artLine(`M${x} 60h28v-7l-6-6h-15l-7 6zM${x + 9} 47v6`), artLine(artCirc(x + 7, 61, 3), { w: 1.2 }), artLine(artCirc(x + 21, 61, 3), { w: 1.2 })];
const artUp = (x) => artLine(`M${x} 60V24M${x - 7} 31l7-7l7 7`, { stroke: ART_INK.cream });
const artVirus = (cx, cy, r) => {
  const spikes = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4, x1 = cx + Math.cos(a) * r, y1 = cy + Math.sin(a) * r, x2 = cx + Math.cos(a) * (r + 6), y2 = cy + Math.sin(a) * (r + 6);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }).join('');
  const knobs = Array.from({ length: 8 }, (_, i) => artCirc(+(cx + Math.cos((i * Math.PI) / 4) * (r + 7)).toFixed(1), +(cy + Math.sin((i * Math.PI) / 4) * (r + 7)).toFixed(1), 1.6)).join('');
  return [artLine(artCirc(cx, cy, r)), artLine(spikes, { w: 1.2 }), artFill(knobs), artFill(artCirc(cx - 3, cy - 2, 1.6) + artCirc(cx + 4, cy + 3, 1.3), ART_INK.gold)];
};
const artHouse = (x, base, s = 1) => artLine(`M${x} ${base}v${-14 * s}l${12 * s} ${-10 * s}l${12 * s} ${10 * s}v${14 * s}zM${x + 9 * s} ${base}v${-7 * s}h${6 * s}v${7 * s}`);

// ยุคละภาพเดียว ใช้กับทุกการ์ดของยุคนั้น — คีย์ตาม id เหตุการณ์ใน data/era-events.json
const ERA_SCENES = {
  oil_crisis_1: [ART_GROUND, artBarrel(56, 38), artBarrel(78, 38), artBarrel(67, 10), artFill('M128 18c0 0-11 15-11 24a11 11 0 0 0 22 0c0-9-11-24-11-24z'), artUp(158)],
  oil_crisis_2: [ART_GROUND, artLine('M56 66V26h24v40zM61 32h14v10h-14zM80 36h6v20q0 5-4 5'), artLine('M82 60h-6', { w: 1.2 }), ...artCar(104), ...artCar(140), artUp(36)],
  typhoon_gay: [
    artLine('M100 38m-3 0a3 3 0 1 1 6 0a7 7 0 1 1-14 0a11 11 0 1 1 22 0a15 15 0 1 1-30 0'),
    artLine('M28 24h26M34 32h22M140 22l-6 10M152 22l-6 10M164 22l-6 10M146 36l-6 10M158 36l-6 10', { stroke: ART_INK.cream, w: 1.2 }),
    artLine(artWave(24, 176, 64, 16, 7)),
  ],
  tom_yum_kung: [
    artLine('M30 16V64H112', { stroke: ART_INK.bronze2, w: 1 }),
    artLine('M34 24l14 6l12-4l14 20l12-3l16 16M96 52l6 7l-9 1', { stroke: ART_INK.cream }),
    artLine(artCirc(148, 38, 15)),
    artLine(artCirc(148, 38, 11), { w: 0.8 }),
    artLine('M145 30v16M145 30h4a4 4 0 0 1 0 8h-4m4 0a4 4 0 0 1 0 8h-4M147 27v22', { w: 1.3 }),
    artLine(artCirc(124, 22, 4) + artCirc(172, 58, 4), { w: 1.2 }),
    artLine('M124 12v4M172 48v4', { stroke: ART_INK.cream, w: 1 }),
  ],
  sars: [
    artLine(artCirc(76, 38, 17)),
    { d: 'M62 38q14 8 28 0v9q-14 9-28 0z', fill: ART_INK.cream },
    artLine('M62 40l-5-6M90 40l5-6', { w: 1 }),
    artFill(artCirc(70, 32, 1.6) + artCirc(82, 32, 1.6), ART_INK.gold2),
    artLine('M136 16v32', { w: 4 }),
    artFill(artCirc(136, 54, 6)),
    artLine('M142 22h4M142 30h4M142 38h4', { stroke: ART_INK.cream, w: 1 }),
    ...artVirus(166, 26, 5),
  ],
  tsunami: [
    artLine('M24 66C46 66 52 22 92 18C122 15 130 40 114 46C104 50 98 40 106 36'),
    artLine('M40 66C58 64 66 34 92 30M58 66C70 62 78 44 96 42', { stroke: ART_INK.cream, w: 1.1 }),
    artLine('M160 66q-5-20 2-38', { w: 2 }),
    artLine('M162 28q-14-4-20 6M162 28q14-6 22 4M162 28q-6-12-16-12M162 28q8-12 18-10'),
    artLine(artWave(122, 180, 66, 12, 4), { stroke: ART_INK.bronze2, w: 1 }),
  ],
  global_financial_crisis: [
    ART_GROUND,
    artLine('M34 66V40h16v26M54 66V28h18v38M76 66V46h14v20M118 66V32h16v34M138 66V44h20v22'),
    artFill('M58 34h3v3h-3zM65 34h3v3h-3zM58 42h3v3h-3zM122 38h3v3h-3zM128 38h3v3h-3zM122 46h3v3h-3z', ART_INK.gold),
    artLine('M26 18l30 10l20-6l30 22l24-4l34 18M164 52l2 7l-8 1', { stroke: ART_INK.cream }),
  ],
  great_flood: [
    artHouse(46, 54, 1.1),
    artHouse(108, 54),
    artLine('M150 50h26l-4 6h-18zM162 50v-10M159 44h6', { w: 1.3 }),
    artFill(artCirc(162, 37, 2.5)),
    artLine(artWave(24, 176, 56, 12, 4), { stroke: ART_INK.cream, w: 1.2 }),
    artLine(artWave(24, 176, 64, 12, 4)),
  ],
  covid19: [
    ART_GROUND,
    ...artVirus(70, 36, 13),
    artLine('M120 66V42l20-16l20 16v24zM133 66V52h14v14'),
    artLine('M128 46h6v-6M152 46h-6v-6', { stroke: ART_INK.cream, w: 1 }),
    artFill(artCirc(140, 40, 2.2)),
  ],
};

export function eraArt(id) {
  const scene = ERA_SCENES[id];
  return scene ? [...ERA_FRAME, ...scene] : null;
}

// ฐานะ 10 ระดับของ standingOf → จน/กลาง/รวย ตามชื่อระดับ (ยากไร้–ค่อนข้างจน · ชนชั้นกลางล่าง–กลางบน · มีอันจะกิน–มั่งคั่ง)
export const artTier = (level) => (level <= 3 ? 0 : level <= 6 ? 1 : 2);

// รูปตัวละคร 40×40 — ช่วงวัยตามลำดับ STAGES (เด็ก วัยรุ่น หนุ่มสาว ทำงาน กลางคน ชรา) × เพศ × ฐานะ 3 ขั้น
// สัดส่วนหัวต่อตัวเล็กลงตามวัย · ผมหงอกจากกลางคน · ชราใส่แว่น · ฐานะบอกด้วยสีเสื้อและเครื่องประดับ ไม่ใช่ตัวเลข
export const AVATAR_SIZE = 40;
const AV_BODY = [
  { cx: 20, cy: 17, r: 8.5, sy: 29, w: 9 },
  { cx: 20, cy: 15, r: 7.5, sy: 26, w: 10 },
  { cx: 20, cy: 14, r: 7, sy: 25, w: 11 },
  { cx: 20, cy: 14, r: 7, sy: 25, w: 12 },
  { cx: 20, cy: 14.5, r: 7.2, sy: 25.5, w: 13 },
  { cx: 20, cy: 15, r: 7, sy: 26, w: 12 },
];
const AV_HAIR = ['#1F1A17', '#1F1A17', '#1F1A17', '#2A2420', '#6A635C', '#D8D4CC'];
const AV_SHIRT = ['#7A5C3A', '#3A5F8F', '#6B1F1A'];
const AV_SKIN = '#E0B48A';
const AV_DARK = '#1F1A17';

export function avatarArt(stage, sex, tier) {
  const { cx, cy, r, sy, w } = AV_BODY[stage];
  const girl = sex === 'หญิง';
  const hair = AV_HAIR[stage];
  // วัยรุ่นใส่ชุดนักเรียนเสื้อขาว ฐานะย้ายไปอยู่ที่เนกไท/โบ
  const shirt = stage === 1 ? '#EDEDED' : AV_SHIRT[tier];
  const parts = [{ d: artCirc(20, 20, 20), fill: ART_INK.lacquer2 }];
  if (girl && stage === 0) parts.push({ d: artCirc(cx - r - 1, cy - 1, 3) + artCirc(cx + r + 1, cy - 1, 3), fill: hair });
  parts.push({ d: `M${20 - w} 40v-${40 - sy - 3}q0-3 3-3h${2 * w - 6}q3 0 3 3v${40 - sy - 3}z`, fill: shirt });
  // ผมยาวปรกบ่า วาดทับเสื้อ — วาดไว้หลังเสื้อจะโดนบังจนหญิงกับชายวัยเดียวกันหน้าตาเหมือนกัน
  if (girl && stage >= 2 && stage <= 4) parts.push({ d: `M${cx - r - 1.5} ${cy}h${2 * r + 3}v${stage === 4 ? r + 2 : r + 7}h-${2 * r + 3}z`, fill: hair });
  parts.push({ d: `M18 ${cy + r - 1.5}h4v${sy - cy - r + 2}h-4z`, fill: AV_SKIN });
  // ชายชราหัวล้าน เหลือผมข้างหู · หญิงชรามวยผม
  if (stage === 5 && !girl) parts.push({ d: artCirc(cx - r + 0.5, cy - 1, 2.6) + artCirc(cx + r - 0.5, cy - 1, 2.6), fill: hair });
  else parts.push({ d: artCirc(cx, cy - 1.1, r + 0.7), fill: hair });
  if (girl && stage === 5) parts.push({ d: artCirc(cx, cy - r - 1.5, 3), fill: hair });
  if (girl && stage === 1) parts.push({ d: `M${cx - r - 0.7} ${cy - 1}h${2 * r + 1.4}v${r - 1}h-${2 * r + 1.4}z`, fill: hair });
  parts.push({ d: artCirc(cx, cy + 0.8, r - 0.6), fill: AV_SKIN });
  // หน้าม้า/ไรผมทับหน้าผาก — ไม่งั้นหน้ากลมเต็มดูเหมือนหัวล้านทุกวัย
  if (!(stage === 5 && !girl)) parts.push({ d: `M${cx - r + 0.6} ${cy - 0.8}q${r - 0.6} ${-r * 0.9} ${2 * r - 1.2} 0q${-(r - 0.6)} ${-r * 0.35} ${-(2 * r - 1.2)} 0z`, fill: hair });
  parts.push({ d: artCirc(cx - 2.6, cy + 1.2, 0.9) + artCirc(cx + 2.6, cy + 1.2, 0.9), fill: AV_DARK });
  parts.push({ d: `M${cx - 1.8} ${cy + 3.8}q1.8 1.4 3.6 0`, stroke: '#8A4B3A', w: 0.7 });
  if (stage === 5) parts.push({ d: artCirc(cx - 2.6, cy + 1.2, 1.9) + artCirc(cx + 2.6, cy + 1.2, 1.9) + `M${cx - 0.7} ${cy + 1.2}h1.4`, stroke: ART_INK.gold, w: 0.6 });
  // ฐานะ: จน = เสื้อปะ · กลาง = ปกเสื้อ (ผู้ใหญ่ชายผูกไท) · รวย = สร้อยทอง+เข็มกลัด
  const top = sy;
  if (stage === 1) {
    const tie = AV_SHIRT[tier];
    parts.push(girl ? { d: `M17 ${top + 1}l3 2l3-2v4l-3-2l-3 2z`, fill: tie } : { d: `M19 ${top}h2l1 8l-2 2l-2-2z`, fill: tie });
    if (tier === 2) parts.push({ d: artCirc(20 + w - 4, top + 5, 1.3), fill: ART_INK.gold2 });
  } else if (tier === 0) {
    parts.push({ d: `M${20 + w - 6} ${top + 5}h3.5v3.5h-3.5z`, fill: '#5A4630' });
  } else if (tier === 1) {
    parts.push({ d: `M17 ${top}l3 4l3-4`, stroke: ART_INK.cream, w: 0.9 });
    if (stage >= 3 && !girl) parts.push({ d: `M19.2 ${top + 3.5}h1.6l0.8 7l-1.6 1.5l-1.6-1.5z`, fill: '#1F2430' });
  } else {
    parts.push({ d: `M16 ${top + 0.5}q4 5 8 0`, stroke: ART_INK.gold, w: 0.9 });
    parts.push({ d: artCirc(20, top + 4.6, 1.3), fill: ART_INK.gold2 });
    if (stage >= 3) parts.push({ d: `M${20 - w + 2} 40v-${40 - top - 4}M${20 + w - 2} 40v-${40 - top - 4}`, stroke: ART_INK.gold, w: 0.6 });
  }
  parts.push({ d: artCirc(20, 20, 19.4), stroke: ART_INK.gold, w: 1.2 });
  return parts;
}
