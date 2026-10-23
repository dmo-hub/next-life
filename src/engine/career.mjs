// การเรียนต่อเนื่อง + งานแรก (B15): การ์ดที่แกนสร้างเป็น event object รูปเดียวกับเนื้อหา — วิ่งผ่าน eventCard/choose
// ได้ล็อก · ผลสุ่ม · ป้ายบุญบาป · ป้าย % ชุดเดียวกับการ์ดเนื้อหา · ฟังก์ชันล้วน อ่าน state ไม่แก้
import { makeRng } from './rng.mjs';

// วุฒิเรียงต่ำไปสูง ตรงกับ edu ของอาชีพใน data/finance.json — อาชีพที่วุฒิสูงกว่าที่มีล็อก
export const EDU = ['ประถม', 'มัธยม', 'อาชีวะ', 'อุดมศึกษา'];
export const eduRank = (e) => EDU.indexOf(e) + 1;

// ช่วงเรียน: จบที่อายุ until แล้วได้วุฒิ edu · ช่วงที่มี gate = จบแล้วมีด่านเลือกเรียนต่อ ไม่มี = หางานทันที
export const TRACKS = {
  primary: { name: 'ประถม', until: 12, edu: 'ประถม', gate: true },
  lower: { name: 'มัธยมต้น', until: 15, edu: 'มัธยม', gate: true },
  upper: { name: 'มัธยมปลาย', until: 18, edu: 'มัธยม', gate: true },
  voc: { name: 'ปวช.', until: 18, edu: 'อาชีวะ', gate: true },
  hvoc: { name: 'ปวส.', until: 20, edu: 'อาชีวะ' },
  uni: { name: 'มหาวิทยาลัย', until: 22, edu: 'อุดมศึกษา' },
};
export const SCHOOL_FROM = 6;

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
    { weight: 1, ok: true, multipliers, text: 'สอบติดมหาวิทยาลัยรัฐ', effects: { school: 'uni', network: 2, ...pay(0.5) } },
    { weight: 1, text: 'สอบไม่ติด ต้องออกหางานทำ', effects: { school: 'none', happiness: -1 } },
  ];
  const uniLock = { money: cash(0.5), reason: 'ค่าเทอมมหาวิทยาลัยไม่พอ' };
  return {
    ...base,
    choices: [
      { text: 'สอบเข้ามหาวิทยาลัยรัฐ', requires: uniLock, outcomes: exam({ stats: { knowledge: 3, network: 1.5 } }) },
      { text: 'เข้ามหาวิทยาลัยเอกชน', requires: { money: cash(2), reason: 'ค่าเทอมเอกชนไม่พอ' }, effects: { school: 'uni', network: 1, ...pay(2) } },
      { text: 'เรียนมหาวิทยาลัยเปิด', requires: { money: cash(0.15), reason: 'ค่าลงทะเบียนไม่พอ' }, effects: { school: 'uni', knowledge: 1, ...pay(0.15) } },
      { text: 'เรียนต่อ ปวส.', requires: { money: cash(0.3), reason: 'ค่าเทอมไม่พอ' }, effects: { school: 'hvoc', network: 1, ...pay(0.3) } },
      {
        text: 'สอบชิงทุนเรียนมหาวิทยาลัย',
        requires: { stats: { knowledge: { min: 70 } }, reason: 'คะแนนยังไม่ถึงเกณฑ์ทุน' },
        outcomes: [
          { weight: 1, ok: true, multipliers: { stats: { knowledge: 2 } }, text: 'ได้ทุนเรียนฟรีจนจบ', effects: { school: 'uni', network: 3 } },
          { weight: 2, text: 'พลาดทุน ต้องออกหางานทำ', effects: { school: 'none', happiness: -1 } },
        ],
      },
      { text: 'ใช้ทุนที่ได้ไว้เรียนต่อ', requires: { flags: { has: ['scholarship'] }, reason: 'ยังไม่มีทุน' }, clears_flags: ['scholarship'], effects: { school: 'uni', network: 2 } },
      {
        text: 'จ้างคนเข้าห้องสอบแทน',
        requires: { money: cash(1.5), reason: 'เงินไม่พอจ้างมือปืนรับจ้างสอบ' },
        effects: pay(1),
        merit: [{ cat: 'greed_harm', level: 2 }],
        outcomes: [
          { weight: 3, ok: true, text: 'คนสอบแทนทำคะแนนให้จนติด', effects: { school: 'uni', network: 1, ...pay(0.5) } },
          { weight: 1, text: 'กรรมการตรวจบัตรจับได้ ถูกตัดสิทธิ์สอบ', effects: { school: 'none', happiness: -2, relations: -1 } },
        ],
      },
      { text: 'ขอพรก่อนสอบมหาวิทยาลัยรัฐ', requires: uniLock, outcomes: exam({ wish: WISH, stats: { knowledge: 3, network: 1.5 } }) },
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
