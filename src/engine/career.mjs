// การเรียนต่อเนื่อง + งานแรก (B15): การ์ดที่แกนสร้างเป็น event object รูปเดียวกับเนื้อหา — วิ่งผ่าน eventCard/choose
// ได้ล็อก · ผลสุ่ม · ป้ายบุญบาป · ป้าย % ชุดเดียวกับการ์ดเนื้อหา · ฟังก์ชันล้วน อ่าน state ไม่แก้
import { makeRng } from './rng.mjs';
import { pickName } from './birth.mjs';

// วุฒิเรียงต่ำไปสูง ตรงกับ edu ของอาชีพใน data/finance.json — อาชีพที่วุฒิสูงกว่าที่มีล็อก
export const EDU = ['ประถม', 'มัธยม', 'อาชีวะ', 'อุดมศึกษา'];
export const eduRank = (e) => EDU.indexOf(e) + 1;

// ช่วงเรียน: จบที่อายุ until แล้วได้วุฒิ edu · ช่วงที่มี gate = จบแล้วมีด่านเลือกเรียนต่อ ไม่มี = หางานทันที
// exam = ชื่อด่านสอบที่การ์ดนำ (prelude.before) ผูกได้ — การ์ดนำเข้าคิวก่อนด่านปีเดียวกัน
export const TRACKS = {
  primary: { name: 'ประถม', until: 12, edu: 'ประถม', gate: true },
  lower: { name: 'มัธยมต้น', until: 15, edu: 'มัธยม', gate: true },
  upper: { name: 'มัธยมปลาย', until: 18, edu: 'มัธยม', gate: true, exam: 'uni_exam' },
  voc: { name: 'ปวช.', until: 18, edu: 'อาชีวะ', gate: true, exam: 'uni_exam' },
  hvoc: { name: 'ปวส.', until: 20, edu: 'อาชีวะ' },
  uni: { name: 'มหาวิทยาลัย', until: 22, edu: 'อุดมศึกษา' },
  // จบแล้วติดยศเข้าสายทันที ไม่ต้องหางาน (B40)
  cadet: { name: 'โรงเรียนนายร้อย', until: 22, edu: 'อุดมศึกษา', ladder: 'army' },
  police_cadet: { name: 'โรงเรียนนายร้อยตำรวจ', until: 22, edu: 'อุดมศึกษา', ladder: 'police' },
};
export const EXAMS = [...new Set(Object.values(TRACKS).map((t) => t.exam).filter(Boolean))];
// ธงที่แกนตั้งเมื่อสอบเข้ามหาวิทยาลัยติด (ทุกทางที่มีการสอบ) — การ์ดแก้บนตอนสอบเข้าอ่านธงนี้ ไม่ติด/ไม่ได้สอบ = ไม่ทวง
export const EXAM_PASS = 'exam_pass:uni';
// สอบเข้าโรงเรียนนายร้อยต้องผ่านทั้งข้อเขียนและร่างกาย · สอบ ก.พ. ต้องจบปริญญา (B40)
const CADET_NEED = { stats: { knowledge: { min: 45 }, health: { min: 50 } }, reason: 'ความรู้หรือสุขภาพยังไม่ถึงเกณฑ์สอบ' };
export const SCHOOL_FROM = 6;
// ทุนสอบชิงมีภาระใช้ทุน (B118): ธงค้างจนการ์ดชดใช้ทุนเคลียร์ · การ์ดอยู่ใน content/scholarship_bond.yaml
export const BOND_FLAG = 'scholar_bond';
export const BOND_EVENT = 'scholar_bond_due';
const UNI_YEARS = TRACKS.uni.until - TRACKS.upper.until;

const cash = (amount) => ({ unit: 'income_x', amount });
const pay = (amount) => ({ money: cash(-amount) });
const SIN_LIGHT = [{ cat: 'greed_harm', level: 1 }];
// ทางขอพร: น้ำหนักทางสำเร็จเอียงตามบัญชีบุญบาปแบบต่อเนื่อง (บุญน้อย = เอียงน้อย) — หน้าจอโชว์ ? ไม่โชว์ %
const WISH = 3;

// ด่านเรียนต่อตอนจบช่วงเรียน · ทุกด่านมีทาง "ออกไปทำงาน" ที่ไม่ล็อก การ์ดจึงไม่ค้าง
export function schoolGate(st) {
  const t = TRACKS[st.school];
  const id = `school_gate_${st.school}`;
  const base = { id, type: 'A', text: `อายุ ${st.age} ปี เรียนจบ${t.name}แล้ว จะเอายังไงต่อ` };
  if (st.school === 'primary') {
    return {
      ...base,
      choices: [
        { text: 'เรียนต่อ ม.ต้นใกล้บ้าน', effects: { school: 'lower', knowledge: 1 } },
        {
          text: 'สอบเข้า ม.ต้นโรงเรียนดังในเมือง',
          requires: { money: cash(0.3), reason: 'ค่าเทอมค่ารถไม่พอ' },
          outcomes: [
            { weight: 1, ok: true, multipliers: { stats: { knowledge: 2 } }, text: 'สอบติดโรงเรียนดัง เพื่อนใหม่มาจากทั่วเมือง', effects: { school: 'lower', network: 2, ...pay(0.3) } },
            { weight: 1, text: 'สอบไม่ติด กลับมาเรียนโรงเรียนใกล้บ้าน', effects: { school: 'lower', happiness: -1 } },
          ],
        },
        {
          text: 'จ่ายแป๊ะเจี๊ยะเข้าโรงเรียนดัง',
          requires: { money: cash(1), reason: 'เงินไม่พอจ่ายแป๊ะเจี๊ยะ' },
          effects: pay(1),
          merit: SIN_LIGHT,
          outcomes: [
            { weight: 4, ok: true, text: 'ได้ที่นั่งในโรงเรียนดังโดยไม่ต้องสอบ', effects: { school: 'lower', network: 2 } },
            { weight: 1, text: 'เรื่องเงินใต้โต๊ะเป็นข่าว ต้องย้ายกลับโรงเรียนเดิม', effects: { school: 'lower', happiness: -1, relations: -1 } },
          ],
        },
        {
          text: 'ขอพรหลวงพ่อก่อนสอบโรงเรียนดัง',
          requires: { money: cash(0.3), reason: 'ค่าเทอมค่ารถไม่พอ' },
          outcomes: [
            { weight: 1, ok: true, multipliers: { wish: WISH, stats: { knowledge: 2 } }, text: 'สอบติดโรงเรียนดัง เพื่อนใหม่มาจากทั่วเมือง', effects: { school: 'lower', network: 2, ...pay(0.3) } },
            { weight: 1, text: 'สอบไม่ติด กลับมาเรียนโรงเรียนใกล้บ้าน', effects: { school: 'lower', happiness: -1 } },
          ],
        },
        // บวชเณรได้เฉพาะชาย — ตัวเลือกที่เหลือยังครบขั้นต่ำ 4 ทางสำหรับหญิง
        ...(st.sex === 'ชาย' ? [{ text: 'บวชเณรเรียนที่วัด', effects: { school: 'lower', relations: -1, network: 1 }, merit: [{ cat: 'sila', level: 1 }] }] : []),
        { text: 'ออกมาช่วยทำงานหาเงิน', effects: { school: 'none', happiness: -1 } },
      ],
    };
  }
  if (st.school === 'lower') {
    return {
      ...base,
      choices: [
        { text: 'เรียนต่อ ม.ปลาย', requires: { money: cash(0.1), reason: 'ค่าเทอมไม่พอ' }, effects: { school: 'upper', knowledge: 1, ...pay(0.1) } },
        { text: 'เรียนสายอาชีพ ปวช.', requires: { money: cash(0.1), reason: 'ค่าเทอมไม่พอ' }, effects: { school: 'voc', network: 1, ...pay(0.1) } },
        {
          text: 'สอบเข้า ม.ปลายโรงเรียนดัง',
          requires: { money: cash(0.3), stats: { knowledge: { min: 55 } }, reason: 'คะแนนหรือค่าเทอมยังไม่ถึง' },
          outcomes: [
            { weight: 1, ok: true, multipliers: { stats: { knowledge: 2 } }, text: 'สอบติด ม.ปลายโรงเรียนดัง', effects: { school: 'upper', network: 2, ...pay(0.3) } },
            { weight: 1, text: 'สอบไม่ติด เรียน ม.ปลายโรงเรียนเดิม', effects: { school: 'upper', happiness: -1 } },
          ],
        },
        {
          text: 'ลอกข้อสอบเพื่อนในห้องสอบ',
          requires: { money: cash(0.3), reason: 'ค่าเทอมไม่พอ' },
          merit: SIN_LIGHT,
          outcomes: [
            { weight: 3, ok: true, text: 'ลอกทันเวลา สอบติดโรงเรียนดัง', effects: { school: 'upper', network: 2, ...pay(0.3) } },
            { weight: 1, text: 'กรรมการจับได้ ถูกตัดสิทธิ์ ต้องเรียนโรงเรียนเดิม', effects: { school: 'upper', happiness: -2, relations: -1 } },
          ],
        },
        {
          text: 'ขอพรก่อนสอบโรงเรียนดัง',
          requires: { money: cash(0.3), stats: { knowledge: { min: 55 } }, reason: 'คะแนนหรือค่าเทอมยังไม่ถึง' },
          outcomes: [
            { weight: 1, ok: true, multipliers: { wish: WISH, stats: { knowledge: 2 } }, text: 'สอบติด ม.ปลายโรงเรียนดัง', effects: { school: 'upper', network: 2, ...pay(0.3) } },
            { weight: 1, text: 'สอบไม่ติด เรียน ม.ปลายโรงเรียนเดิม', effects: { school: 'upper', happiness: -1 } },
          ],
        },
        { text: 'ออกไปทำงานเลย', effects: { school: 'none' } },
      ],
    };
  }
  // จบ ม.ปลาย หรือ ปวช. — ด่านสุดท้ายก่อนมหาวิทยาลัย
  const exam = (multipliers) => [
    { weight: 1, ok: true, multipliers, text: 'สอบติดมหาวิทยาลัยรัฐ', sets_flags: [EXAM_PASS], effects: { school: 'uni', network: 2, ...pay(0.5) } },
    { weight: 1, text: 'สอบไม่ติด ต้องออกหางานทำ', effects: { school: 'none', happiness: -1 } },
  ];
  const uniLock = { money: cash(0.5), reason: 'ค่าเทอมมหาวิทยาลัยไม่พอ' };
  // hint แยกรายการค่าเรียน (B118) — บอกว่าเงินก้อนนี้ไปกับอะไรบ้าง ยอดรวมเท่าเดิม
  const uniHint = 'ค่าเทอม · ค่าสมัครสอบ · หอพักถ้าติดไกลบ้าน';
  return {
    ...base,
    choices: [
      { text: 'สอบเข้ามหาวิทยาลัยรัฐ', hint: uniHint, requires: uniLock, outcomes: exam({ stats: { knowledge: 3, network: 1.5 } }) },
      { text: 'เข้ามหาวิทยาลัยเอกชน', hint: 'ค่าเทอมแพง · หอพัก · ค่ารถ', requires: { money: cash(2), reason: 'ค่าเทอมเอกชนไม่พอ' }, effects: { school: 'uni', network: 1, ...pay(2) } },
      { text: 'เรียนมหาวิทยาลัยเปิด', hint: 'ค่าลงทะเบียน · ค่าตำรา · อ่านเองที่บ้านไม่ต้องเช่าหอ', requires: { money: cash(0.15), reason: 'ค่าลงทะเบียนไม่พอ' }, effects: { school: 'uni', knowledge: 1, ...pay(0.15) } },
      { text: 'เรียนต่อ ปวส.', hint: 'ค่าเทอม · ค่าอุปกรณ์ฝึกงาน · ค่ารถไปกลับ', requires: { money: cash(0.3), reason: 'ค่าเทอมไม่พอ' }, effects: { school: 'hvoc', network: 1, ...pay(0.3) } },
      {
        text: 'สอบชิงทุนเรียนมหาวิทยาลัย',
        hint: 'ไม่เสียค่าเทอม แต่เรียนจบต้องใช้ทุน',
        requires: { stats: { knowledge: { min: 70 } }, reason: 'คะแนนยังไม่ถึงเกณฑ์ทุน' },
        outcomes: [
          // ทุนรัฐมีสัญญาใช้ทุน — การ์ดชดใช้ทุนออกปีที่เรียนจบ (TRACKS.uni.until)
          { weight: 1, ok: true, multipliers: { stats: { knowledge: 2 } }, text: 'ได้ทุนเรียนฟรีจนจบ แลกกับสัญญาใช้ทุนหลังเรียนจบ', sets_flags: [EXAM_PASS, BOND_FLAG], schedules: [{ event: BOND_EVENT, after_years: [UNI_YEARS, UNI_YEARS] }], effects: { school: 'uni', network: 3 } },
          { weight: 2, text: 'พลาดทุน ต้องออกหางานทำ', effects: { school: 'none', happiness: -1 } },
        ],
      },
      { text: 'ใช้ทุนที่ได้ไว้เรียนต่อ', hint: 'ทุนจ่ายค่าเทอมให้', requires: { flags: { has: ['scholarship'] }, reason: 'ยังไม่มีทุน' }, clears_flags: ['scholarship'], effects: { school: 'uni', network: 2 } },
      {
        text: 'จ้างคนเข้าห้องสอบแทน',
        requires: { money: cash(1.5), reason: 'เงินไม่พอจ้างมือปืนรับจ้างสอบ' },
        effects: pay(1),
        merit: [{ cat: 'greed_harm', level: 2 }],
        outcomes: [
          { weight: 3, ok: true, text: 'คนสอบแทนทำคะแนนให้จนติด', sets_flags: [EXAM_PASS], effects: { school: 'uni', network: 1, ...pay(0.5) } },
          { weight: 1, text: 'กรรมการตรวจบัตรจับได้ ถูกตัดสิทธิ์สอบ', effects: { school: 'none', happiness: -2, relations: -1 } },
        ],
      },
      { text: 'ขอพรก่อนสอบมหาวิทยาลัยรัฐ', hint: uniHint, requires: uniLock, outcomes: exam({ wish: WISH, stats: { knowledge: 3, network: 1.5 } }) },
      ...[['cadet', 'สอบเข้าโรงเรียนนายร้อย'], ['police_cadet', 'สอบเข้าโรงเรียนนายร้อยตำรวจ']].map(([school, text]) => ({
        text,
        requires: CADET_NEED,
        outcomes: [
          { weight: 1, ok: true, multipliers: { stats: { knowledge: 2, health: 1.5 } }, text: `สอบติด ได้เข้า${TRACKS[school].name}`, effects: { school, network: 1 } },
          { weight: 1.2, text: 'สอบไม่ติด ต้องออกหางานทำ', effects: { school: 'none', happiness: -1 } },
        ],
      })),
      { text: 'ออกไปหางานทำ', effects: { school: 'none' } },
    ],
  };
}

// การ์ดงานแรก: สุ่มอาชีพที่เปิดรับจากน้ำหนักตามฐานะ เอียงขึ้นตามคอนเน็คชั่น ด้วย stream แยก (ไม่กินเลขสุ่มของโลก)
// อาชีพที่วุฒิเกินยังโชว์เป็นทางล็อก · ทางสมัครมีผลได้/ไม่ได้ · ไม่ได้ = รับจ้างทั่วไป
export const JOB_OFFERS = 4;
export const JOB_EXTRA_AT = 70;
export const JOB_OPEN_MIN = 2;
export function jobCard(st) {
  const f = st.content.era.finance;
  const occs = f.occupations;
  const top = occs.length - 1;
  const rank = new Map([...occs].sort((a, b) => a.wage - b.wage).map((o, r) => [o.id, r]));
  const tilt = (st.network - 50) / 50;
  const w = f.occByClass[st.cls].map((x, i) => x * Math.exp(tilt * (rank.get(occs[i].id) / top)));
  const rng = makeRng((st.seed ^ 0x1f83d9ab ^ Math.imul(st.age + 1, 0x9e3779b1)) >>> 0);
  const tooLow = (o) => eduRank(o.edu) > eduRank(st.edu);
  const pool = occs.map((o, i) => ({ o, w: w[i] })).filter((x) => x.o.id !== 'labor' && x.o.id !== st.familyOcc);
  const n = JOB_OFFERS + (st.network >= JOB_EXTRA_AT ? 1 : 0);
  const picked = [];
  const draw = (ok) => {
    const from = pool.filter((x) => ok(x.o));
    if (!from.length) return false;
    let r = rng.next() * from.reduce((s, x) => s + x.w, 0);
    let i = 0;
    for (; i < from.length - 1; i++) if ((r -= from[i].w) < 0) break;
    picked.push(from[i].o);
    pool.splice(pool.indexOf(from[i]), 1);
    return true;
  };
  // งานที่วุฒิถึงได้ที่ก่อน JOB_OPEN_MIN ใบ — สุ่มล้วนแล้ววุฒิต่ำเจอแต่ทางล็อก การ์ดไม่เหลือทางให้เลือก
  for (let k = 0; k < JOB_OPEN_MIN && draw((o) => !tooLow(o)); k++);
  while (picked.length < n && draw(() => true));
  picked.sort((a, b) => a.wage - b.wage);
  const okWeight = (o) => 3 - (2 * rank.get(o.id)) / top;
  const lock = (o) => (tooLow(o) ? { edu: o.edu, reason: `ต้องจบ${o.edu}` } : undefined);
  const apply = (o, ok, multipliers) => [
    { weight: ok, ok: true, multipliers, text: `ได้งาน${o.name}`, effects: { job: o.id } },
    { weight: 1, text: `ไม่ได้งาน${o.name} ต้องรับจ้างทั่วไปไปก่อน`, effects: { job: 'labor', happiness: -1 } },
  ];
  const choices = picked.map((o) => ({ text: `สมัครงาน${o.name}`, requires: lock(o), outcomes: apply(o, okWeight(o), { stats: { network: 1.6, knowledge: 1.4 } }) }));
  const fam = occs.find((o) => o.id === st.familyOcc);
  if (fam.id !== 'labor') choices.push({ text: `สืบต่องานบ้าน ${fam.name}`, effects: { job: fam.id, relations: 1 } });
  choices.push({ text: 'รับจ้างทั่วไปไปก่อน', effects: { job: 'labor' } });
  if (eduRank(st.edu) >= eduRank('อุดมศึกษา')) {
    choices.push({
      text: 'สอบ ก.พ. เข้ารับราชการ',
      outcomes: [
        { weight: 1.5, ok: true, multipliers: { stats: { knowledge: 1.6 } }, text: 'สอบผ่าน ได้บรรจุเป็นข้าราชการ', effects: { ladder: 'gov' } },
        { weight: 1, text: 'สอบไม่ผ่าน ต้องรับจ้างทั่วไปไปก่อน', effects: { job: 'labor', happiness: -1 } },
      ],
    });
  }
  // ทางพิเศษเล็งงานที่ดีที่สุดที่วุฒิถึง · ไม่มีงานไหนวุฒิถึงเลย = ไม่มีทางพิเศษ
  const target = picked.filter((o) => !tooLow(o)).at(-1);
  if (target) {
    const k = okWeight(target);
    choices.push(
      { text: `ทุ่มเงินติวสมัคร${target.name}`, requires: { money: cash(0.5), reason: 'เงินไม่พอค่าติว' }, effects: pay(0.5), outcomes: apply(target, k * 2.5, { stats: { network: 1.6, knowledge: 1.4 } }) },
      {
        text: `ฝากเส้นเข้า${target.name}`,
        requires: { stats: { network: { min: 50 } }, reason: 'ไม่มีคนรู้จักให้ฝาก' },
        merit: SIN_LIGHT,
        outcomes: [
          { weight: k * 4, ok: true, text: `ได้งาน${target.name}ตามที่ฝากไว้`, effects: { job: target.id } },
          { weight: 1, text: 'เรื่องฝากงานรู้ถึงหูหัวหน้า ถูกเลิกจ้างก่อนเริ่มงาน', effects: { job: 'labor', happiness: -1, relations: -1 } },
        ],
      },
      { text: `ขอพรก่อนไปสมัคร${target.name}`, outcomes: apply(target, k, { wish: WISH, stats: { network: 1.6, knowledge: 1.4 } }) },
    );
  }
  return {
    id: 'first_job',
    type: 'A',
    text: `อายุ ${st.age} ปี ${st.edu ? `วุฒิ${st.edu}` : 'ไม่มีวุฒิ'} ถึงเวลาหางานทำ เงินติดตัว {เงิน} บาท`,
    choices,
  };
}

// คนรู้จักช่วยรับวิกฤต (B40): คอนเน็คชั่นตั้งแต่ from โอกาส (คอนเน็คชั่น − base) / span · ช่วยแล้วผลร้ายเหลือครึ่งแบบญาติช่วย
// วิกฤต = การ์ดรับมือเหตุบ้านเมือง · การ์ดสุขภาพ · ผลที่ทำให้คนมีงานตกไปรับจ้างทั่วไป · ทอยด้วย stream แยก เฉพาะตอนเข้าเกณฑ์
export const NET_AID = { from: 60, base: 50, span: 120 };
const NET_WHO = { health: 'หมอรุ่นพี่ที่รู้จักกัน', job: 'อดีตหัวหน้าเก่า', era: 'เพื่อนเก่าที่ทำงาน' };
export function netAid(st, ev, o) {
  // คนรู้จักในที่นี้มาจากที่ทำงาน — ยังไม่เคยทำงานไม่มีใครให้พึ่ง
  if (st.network < NET_AID.from || st.workFrom === null) return null;
  const kind = o.effects?.job === 'labor' && st.workFrom !== null && st.occupation !== 'labor' ? 'job' : ev.category === 'health' ? 'health' : ev.era ? 'era' : null;
  if (!kind) return null;
  st.netRng ??= makeRng((st.seed ^ 0x9b05688c) >>> 0);
  if (st.netRng.next() >= (st.network - NET_AID.base) / NET_AID.span) return null;
  const sex = st.netRng.next() < 0.5 ? 'ชาย' : 'หญิง';
  const taken = [st.name, ...(st.kin ?? []).map((m) => m.name)];
  return { who: NET_WHO[kind], name: pickName(st.netRng.int(1, 0x7fffffff), sex, st.birthYear, st.content.era.names, taken) };
}
