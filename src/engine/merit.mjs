// บัญชีบุญบาปซ่อน (ใบ 09) — ผู้เล่นไม่เห็นค่าใด ๆ ระหว่างชีวิต เห็นแค่ลางดี/ลางร้ายเป็นครั้งคราว · เฉลยที่ปรโลก (B06)
// ตารางกลางทั้งหมดอยู่ไฟล์นี้ ปรับสมดุลที่จุดเดียว · ทุกตัวเลขเป็นค่าตั้งของเกม ไม่มีคัมภีร์ให้แปลงเป็นตัวเลข harness เป็นคนปรับ

// น้ำหนักต่อระดับ 1–3 ไม่เป็นเส้นตรง ให้ป้ายระดับ 3 เป็นเรื่องใหญ่จริง แบบเดียวกับ LEVELS ของค่าสถานะ
export const MERIT_LEVELS = { 1: 1, 2: 2.5, 3: 4 };
// น้ำหนักต่อหมวด: คติไม่ได้จัดลำดับความหนักของบาป 8 หมวด จึงเท่ากันหมด · vow_broken เป็นธงไม่มีระดับ น้ำหนักทั้งก้อน
// หมวดที่เป็นกลไกเกมตั้งเอง (GAME_CATS) ต้องเบากว่าระดับ 1 ของหมวดตามคติทุกหมวด (ใบ 09/12 — ห้ามหนักเท่าบาปตามคติ)
// สามหมวดท้ายเป็นของต่างโลก (B68c) · ฆ่าเพื่อแต้มเป็นปาณาติบาตตามคติ จึงหนักเท่าหมวดเดิม
export const MERIT_WEIGHTS = {
  greed_harm: 1,
  disturb_monk: 1,
  abuse_elders: 1,
  unjust_judgment: 1,
  adultery: 1,
  love_charm: 1,
  oppress_subjects: 1,
  intoxicants: 1,
  vow_broken: 0.5,
  dana: 1,
  sila: 1,
  bhavana: 1,
  care_parents: 1,
  help_others: 1,
  kill_for_gain: 1,
  cheat_exploit: 0.5,
  keep_goddess_vow: 0.5,
};
export const SIN_CATS = ['greed_harm', 'disturb_monk', 'abuse_elders', 'unjust_judgment', 'adultery', 'love_charm', 'oppress_subjects', 'intoxicants', 'vow_broken', 'kill_for_gain', 'cheat_exploit'];
export const FLAG_CATS = ['vow_broken'];
export const GAME_CATS = ['vow_broken', 'cheat_exploit', 'keep_goddess_vow'];
// หมวดที่ใช้เฉพาะต่างโลก — ไม่นับเป็นบาปตามคติพระมาลัยที่หน้าเว็บอ้าง
export const ISEKAI_CATS = ['kill_for_gain', 'cheat_exploit', 'keep_goddess_vow'];
// ชื่อไทยที่เนื้อหาใช้แทน id ได้ (ใบ 12 เขียนหมวดเป็นไทย) — ต้องตรงกับ vocab ของด่าน build
const TH = {
  โลภจนเบียดเบียน: 'greed_harm', รบกวนนักบวช: 'disturb_monk', ด่าตีพ่อแม่ผู้ใหญ่: 'abuse_elders', ตัดสินไม่เป็นธรรม: 'unjust_judgment',
  ผิดเมียผู้อื่น: 'adultery', เสน่ห์ยาแฝด: 'love_charm', กดขี่ผู้ใต้ปกครอง: 'oppress_subjects', ดื่มสุรา: 'intoxicants', บนแล้วไม่แก้: 'vow_broken',
  ทาน: 'dana', ศีล: 'sila', ภาวนา: 'bhavana', ดูแลพ่อแม่: 'care_parents', ช่วยคน: 'help_others', กลาง: 'neutral',
  ฆ่าเพื่อแต้ม: 'kill_for_gain', ใช้สกิลโกงเอาเปรียบ: 'cheat_exploit', รักษาสัญญาเทพธิดา: 'keep_goddess_vow',
};
export const meritId = (cat) => TH[cat] ?? cat;
const TH_BY_ID = Object.fromEntries(Object.entries(TH).map(([th, id]) => [id, th]));
export const meritName = (id) => TH_BY_ID[id] ?? id;

// กรรมตามทัน (ใบ 09): ตัวคูณโอกาสตายจากบัญชีสุทธิ อิ่มตัวที่ ±ref · บาปเพิ่มเสี่ยงแรงกว่าบุญลด (ทรงเดียวกับตัวคูณสุขภาพ)
// เจ้าของเคาะค่าเริ่ม บาปสุด ×2.0 · บุญสุด ×0.75
export const KARMA = { ref: 10, sinMax: 2, meritMin: 0.75 };
// สเกลอ้างอิงที่เนื้อหาชี้ด้วย ref_scale: table.<ชื่อ> (ใบ 12 หวยสายมู) — บัญชีสุทธิเท่านี้ขึ้นไป = บุญเต็ม
// ค่าเริ่มเท่า KARMA.ref ให้ "บุญเต็ม" ของหวยกับของกรรมตามทันเป็นจุดเดียวกัน
export const REF_TABLE = { merit_ref: 10 };

// ลาง (ใบ 09): ออกเมื่อบัญชีข้ามเกณฑ์ ห่างกันอย่างน้อย gap ปี · ไม่ดึงเลขสุ่มของโลก ชะตาจึงเหมือนเดิมถึงจะไม่มีลาง
export const OMEN = { at: 0.5, gap: 5 };
// ข้อความห้ามบอกตัวเลข ห้ามบอกเหตุ (ไม่พูดว่าเพราะทำบุญ/ทำบาป) — เป็นแค่บรรยากาศ
export const OMEN_TEXT = {
  good: [
    'คืนนี้ฝันเห็นดอกบัวบานเต็มสระ ตื่นมาใจโปร่งอย่างบอกไม่ถูก',
    'นกเขาร้องรับแต่เช้า คนแถวบ้านทักว่าหน้าตาดูสดใส',
    'เดินผ่านวัดได้ยินเสียงระฆัง รู้สึกเบาใจไปทั้งวัน',
  ],
  bad: [
    'ฝันว่าฟันหลุด ตื่นมาใจคอไม่ดีทั้งวัน',
    'จิ้งจกทักตอนกำลังจะออกจากบ้าน ใจหวิว ๆ ไม่รู้เพราะอะไร',
    'นอนไม่ค่อยหลับหลายคืนติด รู้สึกเหมือนมีอะไรค้างคาใจ',
  ],
};

export function newLedger() {
  return { merit: 0, sin: 0, byCat: {}, broken: {} };
}

// บันทึกป้ายของตัวเลือกที่เลือก · key = คำบนที่ผิด (vow_broken ติดครั้งเดียวต่อคำบน ไม่ทบ — ใบ 09)
// คืนรายการหมวดธงที่เพิ่งติด ให้แกนตั้งธงตาม
export function recordMerit(ledger, tags = [], key = '') {
  const flags = [];
  for (const t of tags) {
    const id = meritId(t.cat);
    if (id === 'neutral') continue;
    const w = MERIT_WEIGHTS[id];
    if (w === undefined) throw new Error(`หมวดบุญบาปไม่รู้จัก: ${t.cat}`);
    let v;
    if (FLAG_CATS.includes(id)) {
      const k = `${id}:${key}`;
      if (ledger.broken[k]) continue;
      ledger.broken[k] = true;
      flags.push(id);
      v = w;
    } else {
      const lv = MERIT_LEVELS[t.level];
      if (lv === undefined) throw new Error(`ระดับบุญบาปต้องเป็น 1–3 ได้ ${t.level}`);
      v = w * lv;
    }
    ledger.byCat[id] = (ledger.byCat[id] ?? 0) + v;
    if (SIN_CATS.includes(id)) ledger.sin += v;
    else ledger.merit += v;
  }
  return flags;
}

// ค่าที่แกนคิดเองไม่ผ่านระดับ 1–3 ของเนื้อหา (เช่น บุญจากแขกงานศพ B25b) · เพดานเป็นหน้าที่ของผู้เรียก
export function addMerit(ledger, cat, v) {
  const id = meritId(cat);
  if (!(v > 0) || id === 'neutral') return;
  if (MERIT_WEIGHTS[id] === undefined || FLAG_CATS.includes(id)) throw new Error(`หมวดบุญบาปใช้กับค่าที่แกนคิดไม่ได้: ${cat}`);
  ledger.byCat[id] = (ledger.byCat[id] ?? 0) + v;
  if (SIN_CATS.includes(id)) ledger.sin += v;
  else ledger.merit += v;
}

export const netLedger = (ledger) => ledger.merit - ledger.sin;
export const ledgerLevel = (ledger) => Math.max(-1, Math.min(1, netLedger(ledger) / KARMA.ref));

export function karmaMultiplier(ledger) {
  const x = ledgerLevel(ledger);
  return x < 0 ? 1 - (KARMA.sinMax - 1) * x : 1 - (1 - KARMA.meritMin) * x;
}

// โทนลางตอนนี้: good · bad · null (กลาง)
export function omenTone(ledger) {
  const x = ledgerLevel(ledger);
  return x >= OMEN.at ? 'good' : x <= -OMEN.at ? 'bad' : null;
}

export function omenText(tone, seed, age) {
  const pool = OMEN_TEXT[tone];
  let h = Math.imul((seed ^ Math.imul(age + 1, 0x27d4eb2f)) >>> 0, 0x165667b1) >>> 0;
  // ^ คืนค่า int32 มีเครื่องหมาย — ไม่ดันกลับเป็น unsigned แล้ว index ติดลบ ได้ undefined ขึ้นการ์ด
  h = (h ^ (h >>> 15)) >>> 0;
  return pool[h % pool.length];
}

// ด่านตารางกลาง: หมวดครบตามรายการ · vow_broken ต้องเบากว่าระดับ 1 ของทุกหมวดเดิม · ตัวคูณกรรมอยู่ข้างที่ถูก
// cats = รายการหมวดของด่าน build [{id, th, kind}] — ตารางนี้กับด่านต้องรู้จักหมวดชุดเดียวกัน ชื่อไทยแปลงได้ตรงกัน
export function checkMeritTable(cats, weights = MERIT_WEIGHTS, levels = MERIT_LEVELS, karma = KARMA, game = GAME_CATS) {
  const out = [];
  for (const c of cats) {
    if (c.kind !== 'neutral' && !(weights[c.id] > 0)) out.push(`หมวด ${c.id} ไม่มีน้ำหนักบวกในตารางกลาง`);
    if (meritId(c.th) !== c.id) out.push(`ชื่อไทย ${c.th} แปลงเป็น ${meritId(c.th)} ไม่ใช่ ${c.id}`);
    if ((c.kind === 'sin') !== SIN_CATS.includes(c.id)) out.push(`หมวด ${c.id} ฝั่งบุญ/บาปไม่ตรงกับด่าน`);
    if (!!c.flag !== FLAG_CATS.includes(c.id)) out.push(`หมวด ${c.id} เป็นธงในด่านกับในแกนไม่ตรงกัน`);
  }
  for (const c of Object.keys(weights)) if (!cats.some((x) => x.id === c)) out.push(`ตารางกลางมีหมวด ${c} ที่ไม่อยู่ในรายการของด่าน`);
  if (!(levels[1] > 0 && levels[1] < levels[2] && levels[2] < levels[3])) out.push('น้ำหนักระดับต้องเป็นบวกและเรียง 1 < 2 < 3');
  // เทียบกับหมวดตามคติเท่านั้น — หมวดกลไกเกมด้วยกันหนักเท่ากันได้
  const min1 = Math.min(...Object.keys(weights).filter((c) => !game.includes(c)).map((c) => weights[c] * levels[1]));
  for (const c of game) if (!(weights[c] < min1)) out.push(`${c} (${weights[c]}) ต้องเบากว่าระดับ 1 ของทุกหมวดตามคติ (${min1})`);
  if (!(karma.sinMax >= 1 && karma.meritMin > 0 && karma.meritMin <= 1 && karma.ref > 0)) out.push('ตัวคูณกรรม: sinMax ≥ 1 · 0 < meritMin ≤ 1 · ref > 0');
  return out;
}
