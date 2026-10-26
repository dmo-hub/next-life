// สายยศ/ตำแหน่ง (B40): ขั้นในสายอาชีพเลื่อนตามปีในขั้น + ค่าที่เกี่ยว ผ่านการ์ดเลื่อนขั้นที่แกนสร้าง (วิ่งผ่าน eventCard/choose เหมือนการ์ดเนื้อหา)
// ตำแหน่งการเมือง (office) แยกจากสายอาชีพ: ขั้นท้องถิ่นทำควบงานเดิม ขั้นระดับชาติเป็นงานเต็มเวลา — B79 อ่าน st.office ต่อ
// เวลาที่การ์ดโผล่สุ่มจาก stream แยก (rankRng) · ผลสุ่มในการ์ดใช้ rng ของโลกเพราะเป็นผลของการเลือก
import { makeRng } from './rng.mjs';
import { minWage, monthlyWage } from './finance.mjs';

const rankCash = (amount) => ({ unit: 'income_x', amount });
const RANK_WISH = 3;
const BRIBE = [{ cat: 'greed_harm', level: 1 }];
const VOTE_BUY = [{ cat: 'greed_harm', level: 2 }];

// ค่าตั้งของเกม (เจ้าของเคาะเป้าความหายากของยอดแต่ละสาย จูนด้วย build/b40-check.mjs):
// years = ปีขั้นต่ำในขั้นก่อนมีการ์ดเลื่อน · need = ค่าที่ต้องถึงถึงจะกดทางทำผลงาน · odds = น้ำหนักทางสำเร็จพื้น (ทางล้มเหลวหนัก 1)
export const PROMO = {
  gov: [
    { years: 4, need: { knowledge: 50 }, odds: 3 },
    { years: 5, need: { knowledge: 60, network: 45 }, odds: 1.5 },
    { years: 5, need: { network: 60 }, odds: 0.8 },
    { years: 3, need: { network: 70 }, odds: 0.6 },
  ],
  army: [
    { years: 5, need: { health: 50 }, odds: 3 },
    { years: 6, need: { knowledge: 55, health: 50 }, odds: 2 },
    { years: 5, need: { network: 55 }, odds: 3 },
    { years: 3, need: { network: 60 }, odds: 3 },
  ],
  private: [
    { years: 3, need: { knowledge: 45 }, odds: 3 },
    { years: 4, need: { knowledge: 55, network: 45 }, odds: 2 },
    { years: 5, need: { network: 55 }, odds: 2 },
    { years: 4, need: { network: 65, knowledge: 60 }, odds: 1.6 },
  ],
  trade: [
    { years: 5, need: { knowledge: 35 }, odds: 2 },
    { years: 7, need: { relations: 50 }, odds: 1 },
  ],
};
// ตำรวจไต่ช้ากว่าทหาร — คนเข้าสายตำรวจมากกว่า (เปิดรับกลางทาง) ยอดสองสายจึงหายากใกล้กัน
PROMO.police = [
  { years: 5, need: { health: 50 }, odds: 3 },
  { years: 6, need: { knowledge: 55, health: 50 }, odds: 1.5 },
  { years: 5, need: { network: 60 }, odds: 0.8 },
  { years: 3, need: { network: 70 }, odds: 0.6 },
];
// การเมือง: ทุก term ปีมีการ์ดเลือกตั้ง · entry = โอกาสต่อปีที่ชาวบ้านชวนลงสมัครครั้งแรก (คอนเน็คชั่นถึง minNet)
// odds[r] = น้ำหนักชนะตอนชิงขั้น r · ขั้นที่ full = งานเต็มเวลา รายได้ตำแหน่งแทนงานเดิม และไม่เกษียณตามอายุ
// ผู้ใหญ่บ้าน/กำนันอยู่ได้ถึงอายุ 60 ตามกฎหมาย — ชวนลงสมัครครั้งแรกจึงหยุดก่อนนั้น (ซ้ำค่า RETIRE_AGE ของ life.mjs เพื่อไม่ import วน)
const RETIRE_AT = 60;
// net = ส่วนของค่าตอบแทนท้องถิ่นที่เหลือจริง — ผู้ใหญ่บ้าน/กำนันต้องช่วยงานบวช งานศพ ค่าน้ำมันวิ่งงานชาวบ้าน (ค่าตั้ง)
// campaign = ค่าหาเสียงต่อการลงสมัคร เป็นเท่าของเงินเก็บต่อปี × (ขั้น+1)
export const OFFICE = { net: 0.25, campaign: 0.3, term: 4, entry: 0.2, minNet: 45, ageFrom: 25, ageTo: RETIRE_AT - 1, keep: 2.5, odds: [2, 1.2, 0.8, 0.5, 0.03] };

export const ladderOf = (st) => st.ladder && st.content.era.careers.ladders[st.ladder.id];
const stepOf = (st) => ladderOf(st).steps[st.ladder.rank];
export const officeStep = (st) => st.office && st.content.era.careers.office.steps[st.office.rank];
export const officeFull = (st) => !!officeStep(st)?.full;

// ค่าจ้างตามบัญชีเงินเดือน (บาท/เดือน ของปีอ้างอิงค่าจ้าง) ปรับตามดัชนีค่าแรงขั้นต่ำแบบเดียวกับอาชีพ — บัญชีเป็นของทั้งประเทศ จึงไม่คูณสัดส่วนภาค
const scaled = (st, baht, year) => baht * (minWage(st.content.era, st.seed, year) / minWage(st.content.era, st.seed, st.content.era.finance.refYear));

// ค่าจ้าง/เดือนจากงาน (ก่อนตัวคูณรายได้ถาวร): ขั้นที่มีบัญชีเงินเดือนใช้บัญชี · ขั้นเอกชน = ค่าจ้างอาชีพ × ตัวคูณขั้น ไม่ต่ำกว่าเพดานล่างของขั้น
export function jobWage(st, year) {
  const base = monthlyWage(st.content.era, st.seed, st.occupation, st.ses, year);
  if (!st.ladder) return base;
  const s = stepOf(st);
  if (s.pay !== undefined && s.mul === undefined) return scaled(st, s.pay, year);
  return Math.max(base * (s.mul ?? 1), s.pay ? scaled(st, s.pay, year) : 0);
}

// ค่าตอบแทนตำแหน่งการเมือง/เดือน: ขั้นท้องถิ่นบวกเพิ่มจากงาน · ขั้นเต็มเวลาผู้เรียกใช้แทนงาน
export const officePay = (st, year) => (st.office ? scaled(st, officeStep(st).pay, year) * (officeFull(st) ? 1 : OFFICE.net) : 0);

// ชื่อขั้น: ขั้นที่มีชื่อแทนชื่ออาชีพ · ขั้นไม่มีชื่อ = ชื่ออาชีพ (+คำต่อท้ายของสายอาชีพ)
const stepName = (st, rank) => {
  const s = ladderOf(st).steps[rank];
  return s.name ?? `${st.occupationName}${s.suffix ?? ''}`;
};

// ชื่อบนจอ: ขั้นในสาย · ตำแหน่งการเมืองต่อท้าย
export function rankName(st) {
  const job = st.ladder ? stepName(st, st.ladder.rank) : st.occupationName;
  if (!st.office) return job;
  return officeFull(st) ? officeStep(st).name : `${job} · ${officeStep(st).name}`;
}

// เข้าสายตามงานที่ได้ (effects.job): อาชีพที่มีสายเอกชน/สายอาชีพสั้นเริ่มขั้นของอาชีพนั้น · งานอื่นออกจากสายเดิม
export function enterByJob(st, occ) {
  const L = st.content.era.careers.ladders;
  const id = Object.keys(L).find((k) => L[k].occs?.includes(occ));
  st.ladder = id ? { id, rank: L[id].start?.[occ] ?? 0, since: st.age, prog: 0 } : null;
}

// เข้าสายราชการ/ทหาร/ตำรวจ (effects.ladder): อาชีพเปลี่ยนตามขั้น ให้การ์ดเนื้อหาที่กรองด้วยอาชีพยังเจอคนในสายนี้
export function enterLadder(st, id) {
  st.ladder = { id, rank: 0, since: st.age, prog: 0, from: st.age };
  syncOcc(st);
}
function syncOcc(st) {
  const occ = stepOf(st).occ;
  if (!occ) return;
  const o = st.content.era.finance.occupations.find((x) => x.id === occ);
  st.occupation = o.id;
  st.occupationName = o.name;
}

// ผลของการ์ดเลื่อนขั้น: +1 = ได้เลื่อน · 0 = ไม่ได้ รอบหน้านับปีครึ่งหนึ่ง
export function promote(st, n) {
  if (n > 0) {
    st.ladder.rank += 1;
    st.ladder.since = st.age;
    st.ladder.prog = 0;
    syncOcc(st);
  } else st.ladder.prog /= 2;
}

// ผลของการ์ดเลือกตั้ง: เลขขั้นที่ได้ · -1 = หลุดจากตำแหน่ง
export function setOffice(st, rank) {
  st.office = rank < 0 ? null : { rank, since: st.age, next: st.age + OFFICE.term };
}

// สุขต่ำทำให้ปีในขั้นนับช้าลง (ตัวคูณเดียวกับการเรียน) — ผู้เรียกส่งตัวคูณเข้ามา
export function ageRank(st, mood) {
  if (st.ladder && PROMO[st.ladder.id]?.[st.ladder.rank]) st.ladder.prog += mood;
}

// ปีนี้ถึงคิวการ์ดเลื่อนขั้นไหม (ไม่ดึงเลขสุ่ม)
export const promoDue = (st) => {
  const p = st.ladder && PROMO[st.ladder.id]?.[st.ladder.rank];
  return !!p && st.ladder.prog >= p.years;
};

// "อีกราว N ปีจะเลื่อนขั้น" — บอกทิศ ไม่บอกสูตร · ค่าไม่ถึง = บอกว่าต้องเก่งขึ้นก่อน
export function promoText(st, mood) {
  const p = st.ladder && PROMO[st.ladder.id]?.[st.ladder.rank];
  if (!p) return null;
  const short = Object.entries(p.need).some(([k, v]) => st[k] < v);
  const n = Math.max(1, Math.ceil((p.years - st.ladder.prog) / mood));
  return short ? `ต้องเก่งขึ้นอีกหน่อยถึงจะมีลุ้นเลื่อนขั้น` : `อีกราว ${n} ปีมีลุ้นเลื่อนขั้น`;
}

const STAT_TH = { health: 'สุขภาพ', knowledge: 'ความรู้', relations: 'ความสัมพันธ์', network: 'คอนเน็คชั่น' };
const needText = (need) => `${Object.keys(need).map((k) => STAT_TH[k]).join('/')}ยังไม่ถึง`;

// การ์ดเลื่อนขั้น: รอตามคิว (ไม่ล็อก การ์ดจึงไม่ค้าง) · ทำผลงาน (ค่าถึงเกณฑ์) · วิ่งเต้น (บาป) · ขอพร
export function promoCard(st) {
  const p = PROMO[st.ladder.id][st.ladder.rank];
  const next = stepName(st, st.ladder.rank + 1);
  const lift = { stats: Object.fromEntries(Object.keys(p.need).map((k) => [k, 1.5])) };
  const win = (w, multipliers = lift) => ({ weight: w, ok: true, multipliers, text: `ได้เลื่อนเป็น${next}`, effects: { promote: 1, happiness: 1 } });
  const miss = (text, fx = {}) => ({ weight: 1, text, effects: { promote: 0, ...fx } });
  const k = 0.5 + st.ladder.rank * 0.5;
  return {
    id: `promo_${st.ladder.id}_${st.ladder.rank}`,
    category: 'work_money',
    type: 'A',
    text: `อายุ ${st.age} ปี ทำงานเป็น${stepName(st, st.ladder.rank)}มา ${st.age - st.ladder.since} ปี รอบประเมินเลื่อนเป็น${next}มาถึงแล้ว`,
    choices: [
      { text: 'ตั้งใจทำงาน รอผลประเมินตามคิว', outcomes: [win(p.odds * 0.6), miss('รอบนี้ยังไม่ถึงคิว ต้องรอรอบหน้า')] },
      {
        text: 'รับงานยากมาโชว์ฝีมือ',
        requires: { stats: Object.fromEntries(Object.entries(p.need).map(([s, v]) => [s, { min: v }])), reason: needText(p.need) },
        effects: { health: -1 },
        outcomes: [win(p.odds * 1.5), miss('งานยากล่มกลางทาง ผู้ใหญ่จำชื่อไปผิดทาง', { happiness: -1 })],
      },
      {
        text: 'วิ่งเต้น ฝากซองผู้ใหญ่',
        requires: { money: rankCash(k), reason: 'เงินไม่พอใส่ซอง' },
        effects: { money: rankCash(-k) },
        merit: BRIBE,
        outcomes: [
          win(p.odds * 2.5, null),
          { ...miss('ซองไปผิดคน เรื่องรั่วถึงหู ถูกย้ายไปนั่งตำแหน่งลอย', { happiness: -2, relations: -1 }), weight: 0.7 },
          { weight: 0.3, text: 'ถูกสอบวินัยเรื่องรับส่งซอง ถูกไล่ออกพร้อมเสียค่าทนาย', effects: { job: 'labor', money: rankCash(-1), happiness: -3, relations: -2 }, sets_flags: ['caught_fraud'] },
        ],
      },
      { text: 'ไหว้ขอพรก่อนประเมิน', outcomes: [win(p.odds * 0.6, { ...lift, wish: RANK_WISH }), miss('รอบนี้ยังไม่ถึงคิว ต้องรอรอบหน้า')] },
    ],
  };
}

// คิวการ์ดการเมืองปีนี้: มีตำแหน่ง = ครบวาระ · ยังไม่มี = สุ่มจาก rankRng ว่าชาวบ้านมาชวนไหม (เฉพาะคนถึงเกณฑ์ ชีวิตอื่นไม่ดึงเลขนี้)
export function officeDue(st) {
  if (st.office) return st.age >= st.office.next;
  // เคยโดนใบแดง/คดีทุจริต = ถูกตัดสิทธิ์ ไม่มีใครมาชวนอีก
  if (st.flags.caught_fraud || st.workFrom === null || st.age < OFFICE.ageFrom || st.age > OFFICE.ageTo || st.network < OFFICE.minNet) return false;
  st.rankRng ??= makeRng((st.seed ^ 0x1f83d9ab ^ 0x5be0cd19) >>> 0);
  return st.rankRng.next() < OFFICE.entry;
}

// การ์ดเลือกตั้ง: ชิงขั้นถัดไป · รักษาตำแหน่งเดิม · ซื้อเสียง (บาปหนัก โดนใบแดงหลุดตำแหน่ง) · ขอพร · วางมือ
// คนกรุงเทพฯ ไม่มีหมู่บ้าน เริ่มที่ขั้นแรกที่เป็นงานเต็มเวลา
export function officeCard(st) {
  const steps = st.content.era.careers.office.steps;
  const first = st.ses === 'bkk' ? steps.findIndex((s) => s.full) : 0;
  const cur = st.office ? st.office.rank : -1;
  const up = cur < 0 ? first : cur + 1;
  const canUp = up < steps.length;
  const odds = (r) => OFFICE.odds[r] ?? OFFICE.odds.at(-1);
  const lift = { stats: { network: 1.6, relations: 1.4 } };
  const run = (r, w, multipliers = lift, text = `ชนะ ได้เป็น${steps[r].name}`) => [
    { weight: w, ok: true, multipliers, text, effects: { office: r, network: 1 } },
    { weight: 1, text: cur < 0 ? 'แพ้เลือกตั้ง คะแนนห่างคนที่ชนะไม่มาก' : `แพ้ หลุดจากตำแหน่ง${steps[cur].name}`, effects: { office: -1, happiness: -1 } },
  ];
  const choices = [];
  if (canUp) {
    const cost = rankCash(OFFICE.campaign * (up + 1));
    choices.push({ text: `ลงสมัคร${steps[up].name} หาเสียงด้วยผลงาน`, requires: { money: cost, reason: 'เงินไม่พอค่าหาเสียง' }, effects: { money: { ...cost, amount: -cost.amount } }, outcomes: run(up, odds(up)) });
    choices.push({
      text: `ลงสมัคร${steps[up].name} แจกเงินซื้อเสียง`,
      requires: { money: rankCash(1 + up), reason: 'เงินไม่พอแจก' },
      effects: { money: rankCash(-(1 + up)) },
      merit: VOTE_BUY,
      outcomes: [
        { weight: odds(up) * 2.5, ok: true, text: `ชนะ ได้เป็น${steps[up].name}`, effects: { office: up } },
        { weight: 1, text: 'กกต. แจกใบแดง ถูกตัดสิทธิ์ลงสมัครไปอีกหลายปี', effects: { office: -1, happiness: -2, relations: -1 }, sets_flags: ['caught_fraud'] },
      ],
    });
    choices.push({ text: `ไหว้ขอพรก่อนลงสมัคร${steps[up].name}`, outcomes: run(up, odds(up), { ...lift, wish: RANK_WISH }) });
  }
  if (cur >= 0) choices.push({ text: `ลงรักษาตำแหน่ง${steps[cur].name}`, outcomes: run(cur, OFFICE.keep, lift, `ชาวบ้านเลือกกลับมาอีกสมัย`) });
  choices.push(cur < 0 ? { text: 'ขอบคุณ แต่ไม่ลงสมัคร', effects: { office: -1 } } : { text: 'วางมือ ไม่ลงอีกแล้ว', effects: { office: -1, happiness: 1 } });
  return {
    id: `office_${up}`,
    category: 'society',
    type: 'A',
    text: cur < 0 ? `อายุ ${st.age} ปี คนในพื้นที่มาชวนให้ลงสมัคร${steps[up].name}` : `อายุ ${st.age} ปี ครบวาระ${steps[cur].name}แล้ว จะเอายังไงต่อ`,
    choices,
  };
}

// ประกาศรับสมัครสอบเข้ารับราชการ (B40) — ทางเข้าราชการ/ตำรวจกลางทางสำหรับคนที่ไม่ได้สอบตอนเรียนจบ
// ถึงเกณฑ์อายุและยังไม่อยู่ในสายที่มีบำนาญ ทอยจาก rankRng ปีละครั้ง · ออกได้ไม่เกิน RECRUIT.max ครั้งต่อชีวิต
export const RECRUIT = { ageFrom: 22, ageTo: 35, chance: 0.07, max: 2, odds: 1.2 };
export function recruitDue(st) {
  if (st.workFrom === null || st.age < RECRUIT.ageFrom || st.age > RECRUIT.ageTo || (st.recruited ?? 0) >= RECRUIT.max) return false;
  if (ladderOf(st)?.pension) return false;
  st.rankRng ??= makeRng((st.seed ^ 0x1f83d9ab ^ 0x5be0cd19) >>> 0);
  if (st.rankRng.next() >= RECRUIT.chance) return false;
  st.recruited = (st.recruited ?? 0) + 1;
  return true;
}
export function recruitCard(st) {
  const join = (id, w, multipliers, text) => [
    { weight: w, ok: true, multipliers, text, effects: { ladder: id, happiness: 1 } },
    { weight: 1, text: 'สอบไม่ติด กลับไปทำงานเดิมต่อ', effects: { happiness: -1 } },
  ];
  const lift = { stats: { knowledge: 1.6 } };
  return {
    id: 'recruit_gov',
    category: 'work_money',
    type: 'A',
    text: `อายุ ${st.age} ปี มีประกาศรับสมัครสอบเข้ารับราชการ`,
    choices: [
      { text: 'สมัครสอบข้าราชการพลเรือน', outcomes: join('gov', RECRUIT.odds, lift, 'สอบผ่าน ได้บรรจุเป็นข้าราชการ') },
      { text: 'สมัครสอบนายทหารจากบุคคลภายนอก', requires: { stats: { health: { min: 55 } }, edu: 'อุดมศึกษา', reason: 'ต้องจบปริญญาและร่างกายผ่านเกณฑ์' }, outcomes: join('army', RECRUIT.odds, { stats: { health: 1.5, knowledge: 1.3 } }, 'ผ่านการคัดเลือก ได้ติดยศนายทหาร') },
      { text: 'สมัครสอบเป็นตำรวจ', requires: { stats: { health: { min: 50 } }, reason: 'สุขภาพยังไม่ถึงเกณฑ์ทดสอบร่างกาย' }, outcomes: join('police', RECRUIT.odds, { stats: { health: 1.5, knowledge: 1.3 } }, 'ผ่านทั้งข้อเขียนและร่างกาย ได้ติดยศตำรวจ') },
      {
        text: 'ฝากเส้นผู้ใหญ่ให้ช่วยดู',
        requires: { stats: { network: { min: 50 } }, reason: 'ไม่มีคนรู้จักให้ฝาก' },
        merit: BRIBE,
        outcomes: [
          { weight: RECRUIT.odds * 3, ok: true, text: 'ชื่อผ่านตามที่ฝากไว้ ได้บรรจุเป็นข้าราชการ', effects: { ladder: 'gov' } },
          { weight: 1, text: 'เรื่องฝากเส้นรั่ว ถูกตัดสิทธิ์สอบ ที่ทำงานเดิมก็รู้กันทั่ว', effects: { happiness: -2, relations: -1 } },
        ],
      },
      { text: 'ไม่สอบ ทำงานเดิมต่อ', effects: {} },
    ],
  };
}

// เงินชดเชยเลิกจ้าง (พ.ร.บ.คุ้มครองแรงงาน ม.118): จำนวนวันของค่าจ้างสุดท้ายตามอายุงานในที่ทำงานนี้ — ผู้เรียกคูณค่าจ้างรายวัน
export function severanceDays(st) {
  const days = (st.age - (st.jobSince ?? st.workFrom ?? st.age)) * 365;
  return [...st.content.era.careers.severance].reverse().find(([min]) => days >= min)?.[1] ?? 0;
}

// ขั้นยศ + ตำแหน่งการเมืองรวมเป็นระดับเดียว — การ์ดยั่วทุจริตออกถี่ขึ้นตามระดับ (multipliers.rank)
export const rankLevel = (st) => (st.ladder?.rank ?? 0) + (st.office ? st.office.rank + 1 : 0);

// โครงการเกษียณก่อนกำหนด (B40): ลูกจ้างอายุ EARLY.from–EARLY.to ทอยจาก rankRng ครั้งเดียวต่อปี ออกได้ครั้งเดียวในชีวิต
// ราชการ/ทหาร/ตำรวจไม่มีโครงการนี้ · ตำแหน่งการเมืองเต็มเวลาไม่ใช่ลูกจ้าง
export const EARLY = { from: 50, to: 58, chance: 0.06 };
export function earlyDue(st) {
  if (st.earlyOffered || st.age < EARLY.from || st.age > EARLY.to || ladderOf(st)?.pension || officeFull(st) || st.occupation === 'labor' || st.occupation === 'farmer') return false;
  st.rankRng ??= makeRng((st.seed ^ 0x1f83d9ab ^ 0x5be0cd19) >>> 0);
  if (st.rankRng.next() >= EARLY.chance) return false;
  st.earlyOffered = true;
  return true;
}
export function earlyCard(st) {
  return {
    id: 'early_retire',
    category: 'work_money',
    type: 'A',
    text: `อายุ ${st.age} ปี ที่ทำงานเปิดโครงการเกษียณก่อนกำหนด ใครสมัครได้เงินชดเชยก้อนตามอายุงาน`,
    choices: [
      { text: 'รับเงินก้อน เกษียณพักผ่อน', effects: { severance: true, retire: true, happiness: 1, health: 1 } },
      {
        text: 'รับเงินก้อน ไปเปิดกิจการเอง',
        effects: { severance: true },
        outcomes: [
          { weight: 2, ok: true, multipliers: { stats: { network: 1.5, relations: 1.3 } }, text: 'ลูกค้าเก่าตามมาอุดหนุน กิจการเล็กเลี้ยงตัวได้สบาย', effects: { job: 'service', income_mult: 1.3, happiness: 2 }, sets_flags: ['own_business'] },
          { weight: 2, text: 'ทำเลไม่ดี เงินชดเชยละลายไปกับค่าเช่าในสองปี', effects: { job: 'service', money: rankCash(-1.5), happiness: -2 }, sets_flags: ['own_business'] },
        ],
      },
      { text: 'อยู่ต่อจนครบเกษียณ', effects: {} },
      {
        text: 'ต่อรองขอเงินก้อนเพิ่มก่อนเซ็น',
        requires: { stats: { network: { min: 50 } }, reason: 'ไม่มีใครในฝ่ายบุคคลให้คุยด้วย' },
        outcomes: [
          { weight: 1, ok: true, multipliers: { stats: { network: 1.5 } }, text: 'ฝ่ายบุคคลยอมเพิ่มให้อีกครึ่งปี รับเงินแล้วเกษียณสบายใจ', effects: { severance: true, retire: true, money: rankCash(0.5), happiness: 1 } },
          { weight: 1, text: 'ต่อรองจนเขาปิดรับสมัคร ต้องทำงานต่อแบบเสียหน้า', effects: { happiness: -1 } },
        ],
      },
    ],
  };
}

// ค่าจ้างขั้นแรกของสายที่ตัวเลือกพาเข้า (ช่วงรายได้บนตัวเลือกสอบเข้า)
export const ladderStartPay = (st, id, year) => scaled(st, st.content.era.careers.ladders[id].steps[0].pay, year);

// กลางวาระ (B40 · เจ้าของเคาะข้อ 3): งบก้อนใหม่ลงพื้นที่ — ทำเพื่อส่วนรวมได้บุญ · โกงงบบาปหนัก โดนจับหลุดตำแหน่ง · รังแกคนไม่เลือกเรา
// ออกปีที่นั่งตำแหน่งครบครึ่งวาระ ไม่ดึงเลขสุ่ม
export const budgetDue = (st) => !!st.office && st.age === st.office.since + OFFICE.term / 2;
export function budgetCard(st) {
  const name = officeStep(st).name;
  const k = 1 + st.office.rank;
  return {
    id: `office_budget_${st.office.rank}`,
    category: 'society',
    type: 'A',
    text: `อายุ ${st.age} ปี งบพัฒนาก้อนใหม่ลงมาถึงมือ${name}`,
    choices: [
      { text: 'ทำถนนกับประปาให้ชาวบ้านตามที่ขอ', effects: { relations: 1, network: 1, happiness: 1 }, merit: [{ cat: 'help_others', level: 1 }] },
      {
        text: 'ฮั้วประมูล กินหัวคิวผู้รับเหมา',
        merit: [{ cat: 'greed_harm', level: 2 }],
        outcomes: [
          { weight: 3, ok: true, text: 'ถนนเสร็จทันวาระ เงินส่วนต่างเข้ากระเป๋าเงียบ ๆ', effects: { money: rankCash(k) } },
          { weight: 1, text: 'ถนนพังก่อนหน้าฝน ป.ป.ช. มาสอบ ถูกให้พ้นตำแหน่งพร้อมคดีติดตัว', effects: { office: -1, money: rankCash(-2), happiness: -3, relations: -2 }, sets_flags: ['caught_fraud'] },
        ],
      },
      { text: 'แบ่งโครงการให้หัวคะแนนของตัวเอง', effects: { network: 2, relations: -1 }, merit: [{ cat: 'greed_harm', level: 1 }] },
      { text: 'ตัดงบหมู่ที่ไม่เลือกเรา ให้รู้ว่าใครเป็นใหญ่', effects: { network: 1, relations: -2 }, merit: [{ cat: 'oppress_subjects', level: 1 }] },
    ],
  };
}
