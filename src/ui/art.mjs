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

const artPerson = (x, base, s = 1) => [
  artLine(artCirc(x, base - 16 * s, 3 * s), { w: 1.2 }),
  artLine(`M${x} ${base - 13 * s}v${7 * s}l${-3 * s} ${6 * s}M${x} ${base - 6 * s}l${3 * s} ${6 * s}M${x - 4 * s} ${base - 10 * s}h${8 * s}`, { w: 1.2 }),
];
const artFlame = (x, y) => artFill(`M${x} ${y}c3 4 4 7 0 9c-4-2-3-5 0-9z`);
const artBox = (x, y, w, h) => artLine(`M${x} ${y}h${w}v${h}h${-w}zM${x + w / 2} ${y}v${h * 0.4}`, { w: 1.2 });
const artBag = (x, y) => artLine(`M${x} ${y}h12q2 0 2 3t-2 3h-12q-2 0-2-3t2-3z`, { w: 1 });
const artFish = (x, y) => [artFill(`M${x} ${y}q8-6 16 0q-8 6-16 0zM${x} ${y}l-5-4v8z`), artFill(artCirc(x + 12, y - 1, 0.9), ART_INK.lacquer2)];
const artPlane = (x, y) => artLine(`M${x} ${y}h26q6 0 8 3q-2 3-8 3h-26zM${x + 4} ${y}l-4-8h4l6 8M${x + 12} ${y + 3}l6 8h4l-2-8`, { w: 1.2 });
const artPalm = (x, base) => [artLine(`M${x} ${base}q-2-18 8-32`, { w: 2 }), artLine(`M${x + 8} ${base - 32}q-12-4-18 6M${x + 8} ${base - 32}q12-6 18 4M${x + 8} ${base - 32}q-4-10-14-10`)];
const artStilt = (x) => artLine(`M${x - 2} 40l14-12l14 12zM${x} 40v12h24v-12M${x + 2} 52v10M${x + 22} 52v10M${x + 9} 52v-7h6v7`, { w: 1.2 });
const artWheel = (cx, cy, r) => artLine(artCirc(cx, cy, r), { w: 1.2 });

// สมุดภาพบ้านเมือง (B130): ภาพละช่อง ปลดตามวัยที่เจอการ์ดของเหตุการณ์ หรือการ์ดตามมา (sp) · กรอบเดียวกับภาพยุค
// [ช่อง, ป้ายช่อง, คำบรรยายภาพ, รูปทรง] · ภาพหลักของเหตุการณ์คือภาพยุคเดิม ไม่อยู่ในรายการนี้
export const ERA_PICS = {
  oil_crisis_2: [
    ['kid', 'วัยเด็ก', 'ตะเกียงบนโต๊ะกินข้าว ไฟดับทั้งซอย', [
      artLine('M40 52h70M46 52v14M104 52v14'),
      artLine('M48 52q5 5 10 0M92 52q5 5 10 0', { w: 1.2 }),
      artLine('M68 52h14l-2-4h-10zM70 48q-3-8 2-14h6q5 6 2 14zM70 34q5-8 10 0', { w: 1.2 }),
      artFlame(75, 37),
      artLine('M60 32l-5-3M90 32l5-3M75 26v-5', { stroke: ART_INK.cream, w: 1 }),
      artHouse(130, 66), artHouse(156, 66, 0.8),
      artFill('M168 14a7 7 0 1 0 6 11a6 6 0 1 1-6-11z', ART_INK.cream),
    ]],
    ['adult', 'วัยทำงาน', 'ประตูโรงงานติดป้ายลดกะ', [
      ART_GROUND,
      artLine('M30 66V40l14-10v10l14-10v10l14-10v10l14-10V66M92 66V20h8v46'),
      artLine('M110 66V44h56v22M118 44v22M126 44v22M134 44v22M142 44v22M150 44v22M158 44v22', { w: 1.2 }),
      { d: 'M118 28h40v13h-40z', fill: ART_INK.cream },
      { d: 'M122 32h32M122 37h20', stroke: ART_INK.lacquer2, w: 1.4 },
    ]],
    ['old', 'วัยชรา', 'บิลค่าไฟกับเทียนบนหิ้ง', [
      artLine('M36 38h86M44 38v6M114 38v6', { stroke: ART_INK.bronze2 }),
      artLine('M54 38v-14h6v14z', { w: 1.2 }), artFlame(57, 15),
      { d: 'M78 38l4-22h24l-4 22z', fill: ART_INK.cream },
      { d: 'M85 22h15M84 27h13M83 32h8', stroke: ART_INK.lacquer2, w: 1.2 },
      artFill('M152 16l-12 22h10l-6 22l16-28h-10l6-16z'),
      ART_GROUND,
      artLine('M58 66v-12h20v12M58 62h20M58 58h20', { w: 1.2 }),
    ]],
    ['sp', 'พิเศษ · นาผืนเก่า', 'ทุ่งนากับควาย คนกลับบ้านทำนา', [
      ART_GROUND,
      artLine([30, 42, 54, 66, 78].map((x) => `M${x} 66v-8M${x} 61l-4-4M${x} 61l4-4`).join(''), { w: 1 }),
      ...artPerson(98, 66), artFill('M91 50l7-5l7 5z'),
      artLine('M122 44h30q6 0 6 6v4q0 4-4 4h-32q-4 0-4-4v-4q0-6 4-6zM126 58v8M134 58v8M146 58v8M154 58v8M152 44l10-2q4 4 0 10h-6M160 42q6-6 12-2M122 46q-4 4-2 10'),
      artFill(artCirc(40, 22, 6), ART_INK.gold),
    ]],
  ],
  typhoon_gay: [
    ['kid', 'วัยเด็ก', 'หลังคาสังกะสีปลิวกลางลม', [
      ART_GROUND,
      artLine('M40 66V42h36v24M52 66V54h10v12'),
      artLine('M88 30l30-10l4 8l-30 10z'),
      artLine('M94 28l3 7M101 26l3 7M108 23l3 7M115 21l3 7', { w: 0.8 }),
      artLine('M130 30q16-4 30 2M126 42q20-4 42 2M134 54q14-2 28 2', { stroke: ART_INK.cream, w: 1.2 }),
    ]],
    ['adult', 'วัยทำงาน', 'เรือประมงคว่ำบนหาด', [
      artLine('M24 60q70-8 152 2', { stroke: ART_INK.bronze2, w: 1 }),
      artLine(artWave(24, 72, 66, 12, 4), { stroke: ART_INK.cream, w: 1.2 }),
      artLine('M68 56q30-22 62 0zM99 45v-6M130 56l6-3'),
      ...artPalm(154, 62),
      artLine('M30 22h24M36 30h20', { stroke: ART_INK.cream, w: 1.2 }),
    ]],
  ],
  tom_yum_kung: [
    ['kid', 'วัยเด็ก', 'กล่องย้ายบ้านหน้าห้องแถว', [
      ART_GROUND,
      artLine('M30 66V26h90v40M60 26v40M90 26v40'),
      artLine('M34 46h22M34 51h22M34 56h22M34 61h22M64 46h22M64 51h22M64 56h22M64 61h22', { stroke: ART_INK.bronze2, w: 0.8 }),
      artLine('M34 30h22v8h-22zM64 30h22v8h-22zM94 30h22v8h-22z', { w: 1 }),
      artBox(128, 50, 20, 16), artBox(150, 50, 20, 16), artBox(139, 34, 20, 16),
    ]],
    ['adult', 'วัยทำงาน', 'เปิดท้ายขายของมือสอง', [
      ART_GROUND,
      artLine('M36 60V48h40v12M76 60V40h14l10 10v10zM36 60l-10 4'),
      artWheel(48, 61, 4), artWheel(90, 61, 4),
      artLine('M42 48v-8h12v8M56 48v-6h14v6', { w: 1 }),
      artLine('M120 66v-14M114 52h12l-3-7h-6zM134 66v-4h-2v-14h22v14h-2v4zM134 52h14v8h-14z', { w: 1.2 }),
      { d: 'M158 40l8-8h8v8l-8 8z', fill: ART_INK.cream },
      artFill(artCirc(170, 36, 1.4), ART_INK.lacquer2),
    ]],
    ['old', 'วัยชรา', 'สร้อยทองบนตาชั่งร้านทอง', [
      artLine('M24 66h152', { stroke: ART_INK.bronze2, w: 1 }),
      artLine('M100 64V22M86 64h28M70 26h60M72 26l-6 18M72 26l6 18M128 26l-6 18M128 26l6 18M62 44q10 6 20 0zM118 44q10 6 20 0z'),
      artFill(artCirc(100, 22, 2.2)),
      artFill([66, 70, 74, 78, 68, 76].map((x, i) => artCirc(x, i < 4 ? 42 : 39, 1.8)).join('')),
      artFill('M124 42h6v-4h-6zM131 42h5v-3h-5z', ART_INK.gold),
    ]],
  ],
  sars: [
    ['kid', 'วัยเด็ก', 'ปรอทวัดไข้กับหน้ากาก', [
      artLine('M60 56l38-28', { w: 4 }),
      artFill(artCirc(57, 58, 5)),
      artLine('M72 42l3 3M80 36l3 3M88 30l3 3', { stroke: ART_INK.cream, w: 1 }),
      { d: 'M112 34q20-8 40 0v14q-20 10-40 0z', fill: ART_INK.cream },
      { d: 'M114 39q18-6 36 0M114 45q18-6 36 0', stroke: ART_INK.lacquer2, w: 1 },
      artLine('M112 36q-8 5 0 12M152 36q8 5 0 12', { w: 1.2 }),
    ]],
    ['adult', 'หนุ่มสาว', 'สนามบินว่าง เครื่องบินจอดเรียง', [
      ART_GROUND,
      artPlane(28, 52), artPlane(68, 52), artPlane(108, 52),
      artLine('M158 66V32h-4l4-10h12l4 10h-4v34', { w: 1.2 }),
      artLine('M40 22q4-6 10-2q6-4 10 2z', { stroke: ART_INK.cream, w: 1 }),
    ]],
  ],
  tsunami: [
    ['kid', 'วัยเด็ก', 'ทะเลถอย ปลาดิ้นบนทราย', [
      artLine(artWave(24, 176, 24, 12, 3), { stroke: ART_INK.cream, w: 1.2 }),
      artLine('M24 38q76-6 152 0', { stroke: ART_INK.bronze2, w: 1 }),
      ...artFish(44, 52), ...artFish(84, 60), ...artFish(118, 48), ...artFish(146, 60),
      artLine('M66 46q3-3 6 0M104 62q3-3 6 0', { w: 1 }),
    ]],
    ['adult', 'วัยทำงาน', 'ป้ายเส้นทางหนีคลื่น', [
      ART_GROUND,
      artLine('M70 66V36'),
      { d: 'M44 16h52v20h-52z', fill: ART_INK.cream },
      { d: 'M50 30q4-6 8 0t8 0M72 32l12-8M78 24h6v6', stroke: ART_INK.lacquer2, w: 1.4 },
      artLine('M96 60l24-12M114 46l6 2l-2 6', { stroke: ART_INK.cream }),
      artLine('M120 66q20-36 56-40'),
    ]],
    ['sp', 'พิเศษ · นายหน้าเคาะประตู', 'บังกะโลริมหาดสร้างใหม่', [
      artLine(artWave(24, 176, 66, 12, 3), { stroke: ART_INK.bronze2, w: 1 }),
      artStilt(36), artStilt(74),
      artLine('M118 62V30h24v32M118 40h24M118 50h24M118 30l24 10M118 40l24 10', { w: 1 }),
      ...artPalm(160, 62),
    ]],
  ],
  global_financial_crisis: [
    ['kid', 'วัยเด็ก', 'ขนมทำเองในกล่องส่งของ', [
      ART_GROUND,
      artFill(artCirc(70, 44, 5) + artCirc(84, 42, 5) + artCirc(98, 44, 5), ART_INK.gold),
      artLine('M60 46h50v20h-50zM60 46l-8-10M110 46l8-10M85 46v20'),
      artLine('M134 22h22v40h-22zM142 58h6', { w: 1.2 }),
      artFill('M139 30h12v7h-8l-4 3z'),
    ]],
    ['adult', 'วัยทำงาน', 'กล่องของบนโต๊ะทำงานว่าง', [
      ART_GROUND,
      artLine('M36 54h94M42 54v12M124 54v12'),
      artLine('M58 54V40h34v14zM58 40l6-6h22l6 6', { w: 1.2 }),
      artLine('M72 34q-2-10 6-14M78 34q4-8 10-8', { stroke: ART_INK.cream, w: 1 }),
      artLine('M144 50h18M144 50V30M146 50v16M160 50v16', { w: 1.2 }),
    ]],
    ['old', 'วัยชรา', 'ศาลาวัดกับหลานตัวเล็ก', [
      ART_GROUND,
      artLine('M36 36l40-22l40 22zM48 36l28-14l28 14M36 36q-4-6 0-10M116 36q4-6 0-10M46 36v30M106 36v30M76 36v30'),
      ...artPerson(144, 66, 1.1), artLine('M149 54l4 12', { w: 1.2 }),
      ...artPerson(162, 66, 0.7),
    ]],
    ['sp', 'พิเศษ · กาแฟแก้วนี้ขายได้', 'รถเข็นกาแฟหน้าตึก', [
      ART_GROUND,
      artLine('M112 66V14h50v52', { stroke: ART_INK.bronze2, w: 1 }),
      artFill('M120 22h4v4h-4zM132 22h4v4h-4zM144 22h4v4h-4zM120 34h4v4h-4zM144 34h4v4h-4zM132 46h4v4h-4z', ART_INK.bronze2),
      artLine('M40 50h50v12h-50zM38 30q27-18 54 0zM65 30v20'),
      artWheel(48, 63, 3), artWheel(82, 63, 3),
      artLine('M70 44h8l-1 6h-6z', { w: 1.2 }),
      artLine('M72 42q-2-3 0-6M76 42q2-3 0-6', { stroke: ART_INK.cream, w: 1 }),
    ]],
  ],
  great_flood: [
    ['kid', 'วัยเด็ก', 'กะละมังลอยในบ้าน', [
      artLine('M120 18h30v20h-30zM135 18v20M120 28h30', { w: 1.2 }),
      artLine('M50 46h40l-6 10h-28z'),
      ...artPerson(70, 48, 0.6),
      artLine(artWave(24, 176, 52, 12, 3), { stroke: ART_INK.cream, w: 1.2 }),
      artLine(artWave(24, 176, 62, 12, 3)),
      artLine('M110 50h10q2 0 2 2h-12z', { w: 1 }),
    ]],
    ['adult', 'วัยทำงาน', 'กำแพงถุงทรายหน้าบ้าน', [
      artHouse(118, 66, 1.3),
      ...[[62, 60], [76, 60], [90, 60], [69, 54], [83, 54], [76, 48]].map(([x, y]) => artBag(x, y)),
      artLine(artWave(24, 56, 60, 8, 3), { stroke: ART_INK.cream, w: 1.2 }),
      artLine(artWave(24, 56, 66, 8, 3)),
      ART_GROUND,
    ]],
  ],
  covid19: [
    ['kid', 'วัยเด็ก', 'แท็บเล็ตเรียนออนไลน์บนโต๊ะ', [
      artLine('M36 62h128'),
      artLine('M68 22h64v36h-64zM96 58l-6 4M104 58l6 4', { w: 1.2 }),
      artFill([0, 1, 2].flatMap((i) => [0, 1].map((j) => artCirc(80 + i * 20, 30 + j * 15, 2.6))).join('')),
      artLine([0, 1, 2].flatMap((i) => [0, 1].map((j) => `M${75 + i * 20} ${38 + j * 15}q5-4 10 0`)).join(''), { w: 1 }),
      artLine('M144 62v-10h8v10', { w: 1.2 }),
    ]],
    ['adult', 'วัยทำงาน', 'ไรเดอร์บนถนนว่าง', [
      ART_GROUND,
      artLine('M30 66h10M56 66h10M134 66h10M160 66h10', { stroke: ART_INK.cream, w: 1.4 }),
      artLine('M28 50V24h20v26M152 50V28h22v22', { stroke: ART_INK.bronze2, w: 1 }),
      artWheel(78, 58, 5), artWheel(106, 58, 5),
      artLine('M78 58l10-10h12l6 10M96 48l-4-8l-6 6', { w: 1.2 }),
      artFill('M70 34h14v12h-14z'),
      artLine(artCirc(94, 34, 3), { w: 1.2 }),
    ]],
    ['sp', 'พิเศษ · ออเดอร์ล้นห้อง', 'กล่องพัสดุกองล้นห้อง', [
      ART_GROUND,
      artLine('M150 66V24h22v42M166 46h2', { w: 1.2 }),
      ...[[30, 52], [52, 52], [74, 52], [96, 52], [118, 52], [41, 38], [63, 38], [85, 38], [107, 38], [52, 24], [74, 24], [96, 24]].map(([x, y]) => artBox(x, y, 20, 14)),
    ]],
  ],
};

export function eraPicArt(id, slot) {
  const pic = ERA_PICS[id]?.find(([k]) => k === slot);
  return pic ? [...ERA_FRAME, ...pic[3]] : null;
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
