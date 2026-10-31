// ทวีปเอเธอร์การ์ด (06a): ข้อมูลแคว้น/เผ่า/แผนที่ + ตัวสุ่มต่อชาติ — ยังไม่ต่อเข้าเกม (06b ต่อ)
// บริสุทธิ์: รับ seed/rng คืนค่า ไม่แตะสถานะเกม · ตัวสุ่มต่อชาติใช้ stream ของตัวเอง (CONT_SALT) ไม่กินเลขสุ่มของชาติ
// ชื่อระดับบนสุดขึ้นต้น CONT_/cont ทุกตัว — build.mjs รวมทุกโมดูลเป็นสโคปเดียว
// ค่าที่ยังรอเจ้าของเคาะ (06a-ticket หัว "ให้เจ้าของเคาะ") ใช้ค่าแนะนำในใบ: ค่าเริ่มเผ่า · น้ำหนักโอกาสเกิด · เผ่าแบ่งเท่า · ขาลง/มาแรง 50/50 · ข้อพิพาทเท่ากัน
import { makeRng, mixSeed } from './rng.mjs';

export const CONT_SALT = 0xc0a7;
// ระดับโอกาสเกิด → น้ำหนักแคว้น (ร่าง)
export const CONT_TIER = { very: 8, often: 5, mid: 3, few: 2, rare: 1 };
export const CONT_RACES = {
  human: { name: 'มนุษย์', start: { cha: 2 }, pace: 1 },
  elf: { name: 'เอลฟ์', start: { mag: 2, str: -2 }, pace: 3 },
  dwarf: { name: 'คนแคระ', start: { str: 2, cha: -2 }, pace: 2 },
  beastkin: { name: 'ชาวสัตว์', start: { str: 2, luk: 2, mag: -2 }, pace: 0.9 },
  halfling: { name: 'ฮาล์ฟลิง', start: { luk: 2, str: -2 }, pace: 1.3 },
  orc: { name: 'ออร์ค', start: { str: 4, mag: -2, cha: -2 }, pace: 0.8 },
  demon: { name: 'ปีศาจ', start: { mag: 2, str: 2, cha: -2, luk: -2 }, pace: 2.5 },
  dragonkin: { name: 'เชื้อมังกร', start: { str: 2, mag: 2, luk: -2 }, pace: 3 },
};
const ALL_RACES = Object.keys(CONT_RACES);
// ruler null = ไม่มีผู้ปกครอง (ไม่เข้าสุ่มขั้วอำนาจ) · danger = ดันเจียนลับออกถี่กว่า (รอบ 22: ไม่มีผู้ปกครองทั้ง 4 + ปากเหว · คาร์กัล · โอรัน)
export const CONT_REGIONS = {
  helvard: { name: 'เฮลวาร์ด', ruler: 'กษัตริย์', races: ['human', 'beastkin'], tier: 'very' },
  verdani: { name: 'เวอร์ดานี', ruler: 'ดยุก', races: ['human', 'beastkin'], tier: 'often' },
  marishaven: { name: 'มาริสฮาเวน', ruler: 'สภาพ่อค้า', races: ['human', 'halfling'], tier: 'often' },
  lioselle: { name: 'เลียวเซล', ruler: 'สภาอาวุโส', races: ['elf'], tier: 'mid' },
  gromdal: { name: 'กรอมดาล', ruler: 'สภากิลด์', races: ['dwarf'], tier: 'mid' },
  karghal: { name: 'ทุ่งเถ้าคาร์กัล', ruler: 'สภาเผ่า', races: ['demon', 'orc'], tier: 'mid', danger: true },
  nameless_wood: { name: 'พนาไร้ชื่อ', ruler: null, races: ['orc', 'beastkin'], tier: 'mid', danger: true },
  northvale: { name: 'นอร์ธเวล', ruler: 'หัวหน้าเผ่า', races: ['human'], tier: 'few' },
  windcliff: { name: 'ผาวายุ', ruler: 'ผู้เฒ่า', races: ['dragonkin'], tier: 'rare' },
  cloud_isles: { name: 'หมู่เกาะเมฆา', ruler: null, races: ['halfling'], tier: 'rare', danger: true },
  red_sands: { name: 'ผืนทรายชาด', ruler: 'สภาคลัง', races: ['human', 'orc'], tier: 'mid' },
  lexaria: { name: 'เล็กซาเรีย', ruler: 'สภารับรอง', races: ['human', 'dwarf'], tier: 'few' },
  aurelia: { name: 'ออเรเลีย', ruler: 'ประมุข', races: ['human'], tier: 'few' },
  zeron: { name: 'ซีรอน', ruler: 'อธิการ', races: ['elf', 'human'], tier: 'few' },
  weir_marsh: { name: 'บึงพันฝาย', ruler: 'ผู้แทน', races: ['halfling'], tier: 'mid' },
  abyss_mouth: { name: 'ปากเหวพันชั้น', ruler: 'ผู้แทนเขต', races: ALL_RACES, tier: 'few', danger: true },
  coralis: { name: 'โคราลิส', ruler: 'กัปตัน', races: ['human', 'beastkin'], tier: 'few' },
  poison_range: { name: 'เทือกพิษ', ruler: null, races: ['demon'], tier: 'rare', danger: true },
  oran: { name: 'โอรัน', ruler: 'ผู้สำเร็จราชการ', races: ['human'], tier: 'few', danger: true },
  singing_steppe: { name: 'ทุ่งหญ้าเสียง', ruler: null, races: ['beastkin', 'orc'], tier: 'mid', danger: true },
};
// แผนที่ติดกัน (รอบ 21) เก็บเป็นคู่ครั้งเดียว สร้างสองทิศตอนโหลด ⇒ สมมาตรเสมอ
export const CONT_ROADS = [
  ['northvale', 'windcliff'], ['northvale', 'gromdal'], ['northvale', 'singing_steppe'],
  ['windcliff', 'gromdal'], ['windcliff', 'cloud_isles'],
  ['gromdal', 'helvard'], ['gromdal', 'abyss_mouth'],
  ['helvard', 'oran'], ['helvard', 'aurelia'], ['helvard', 'lexaria'], ['helvard', 'red_sands'],
  ['oran', 'abyss_mouth'], ['oran', 'karghal'],
  ['abyss_mouth', 'poison_range'],
  ['aurelia', 'zeron'], ['aurelia', 'verdani'],
  ['zeron', 'lexaria'], ['zeron', 'lioselle'],
  ['lexaria', 'marishaven'], ['lexaria', 'singing_steppe'],
  ['lioselle', 'nameless_wood'], ['lioselle', 'singing_steppe'],
  ['nameless_wood', 'weir_marsh'],
  ['poison_range', 'karghal'],
  ['karghal', 'red_sands'],
  ['red_sands', 'verdani'],
  ['verdani', 'weir_marsh'], ['verdani', 'marishaven'],
  ['weir_marsh', 'marishaven'],
  ['marishaven', 'coralis'], ['marishaven', 'cloud_isles'],
];
// เครือข่ายทางลับ 6 เส้น (รอบ 22) — คู่ที่ไม่ติดกันตรง
export const CONT_SECRET = [
  ['poison_range', 'nameless_wood'], ['abyss_mouth', 'zeron'], ['oran', 'verdani'],
  ['northvale', 'lioselle'], ['karghal', 'weir_marsh'], ['windcliff', 'red_sands'],
];
export const CONT_DISPUTES = {
  throne_war: { name: 'สงครามชิงบัลลังก์', w: 1 },
  trade_route: { name: 'แย่งเส้นทางการค้า', w: 1 },
  witch_hunt: { name: 'ศาสนจักรล่าแม่มด', w: 1 },
  plague: { name: 'โรคระบาด', w: 1 },
  dungeon_surge: { name: 'ดันเจี้ยนทะลัก', w: 1 },
  demon_lord: { name: 'จอมมารฟื้น', w: 1 },
  peasant_revolt: { name: 'กบฏชาวนา', w: 1 },
  frost_exodus: { name: 'เผ่าอพยพหนีหนาว', w: 1 },
};
// ขาลง/มาแรง: 2 แคว้นด้วยโอกาส two · ดันเจียน 3 หรือ 4 จุด (four) · แคว้นอันตรายน้ำหนัก ×danger
export const CONT_T = { two: 0.5, four: 0.5, danger: 3, base: 10 };

const contLinks = (pairs) => {
  const out = Object.fromEntries(Object.keys(CONT_REGIONS).map((id) => [id, []]));
  for (const [a, b] of pairs) {
    out[a].push(b);
    out[b].push(a);
  }
  return out;
};
const CONT_NEAR = contLinks(CONT_ROADS);
const CONT_HIDDEN = contLinks(CONT_SECRET);
export const contNeighbors = (id) => CONT_NEAR[id] ?? [];
export const contSecret = (id) => CONT_HIDDEN[id] ?? [];

// สุ่มตามน้ำหนัก ดึงเลขสุ่ม 1 ตัว
const contWeighted = (rng, ids, w) => {
  let x = rng.next() * ids.reduce((s, id) => s + w(id), 0);
  return ids.find((id) => (x -= w(id)) < 0) ?? ids.at(-1);
};
// หยิบ n ตัวไม่ซ้ำตามน้ำหนัก
const contDraw = (rng, ids, n, w = () => 1) => {
  const left = ids.slice(), out = [];
  while (out.length < n && left.length) {
    const id = contWeighted(rng, left, w);
    out.push(id);
    left.splice(left.indexOf(id), 1);
  }
  return out;
};

// ต่อชาติ: ขั้วอำนาจจากแคว้นที่มีผู้ปกครอง (ไม่ซ้ำกัน) · ข้อพิพาท 1 ข้อ · ดันเจียนลับ 3–4 จุด แคว้นละไม่เกิน 1
export function contNation(seed) {
  const rng = makeRng(mixSeed(seed ^ CONT_SALT, 0));
  const ruled = Object.keys(CONT_REGIONS).filter((id) => CONT_REGIONS[id].ruler);
  const nf = rng.next() < CONT_T.two ? 2 : 1;
  const nr = rng.next() < CONT_T.two ? 2 : 1;
  const [major, ...rest] = contDraw(rng, ruled, 1 + nf + nr);
  const ds = Object.keys(CONT_DISPUTES);
  const dispute = contWeighted(rng, ds, (id) => CONT_DISPUTES[id].w);
  const nd = rng.next() < CONT_T.four ? 4 : 3;
  const dungeons = contDraw(rng, Object.keys(CONT_REGIONS), nd, (id) => (CONT_REGIONS[id].danger ? CONT_T.danger : 1));
  return { powers: { major, falling: rest.slice(0, nf), rising: rest.slice(nf) }, dispute, dungeons };
}

// เกิด: แคว้นตามน้ำหนักระดับโอกาส (เฉพาะแคว้นที่เผ่านั้นเกิดได้ ถ้าระบุเผ่า) · เผ่าแบ่งเท่าในแคว้น
export function contBirth(rng, race = null) {
  const ids = Object.keys(CONT_REGIONS).filter((id) => !race || CONT_REGIONS[id].races.includes(race));
  const region = contWeighted(rng, ids, (id) => CONT_TIER[CONT_REGIONS[id].tier]);
  return { region, race: race ?? rng.pick(CONT_REGIONS[region].races) };
}

// ค่าเริ่มเผ่า = ฐาน (base · ต่อค่า) + ส่วนเผ่า · ค่าไม่ต่ำกว่า 1
export const contRaceStart = (race, base = CONT_T.base) =>
  Object.fromEntries(['str', 'mag', 'cha', 'luk'].map((k) => [k, Math.max(1, base + (CONT_RACES[race].start[k] ?? 0))]));
export const contLifeMul = (race) => CONT_RACES[race].pace;
