// การ์ดเปิดชีวิต (B16) + บรรทัดเล่าของการ์ดบ้านเมือง — อ่าน state ล้วน ไม่ดึงเลขสุ่มของโลก ลำดับสุ่มของชีวิตจึงเหมือนก่อนมีการ์ดนี้
// ไม่มีค่าบัญชีบุญบาป: กรรมที่ติดมาเล่าเป็นปริมาณคำเดียวกับการ์ดส่งต่อ ฐานะ/ญาติบอกแค่ทิศ ↑/↓
import { infantMortality, protoYear } from './era.mjs';
import { makeRng } from './rng.mjs';
import { CLASSES, STAT_LABELS, provinceLabel, areaLabel, stageOf } from './life.mjs';
import { LEGACY, lineageText, carryAmount, kinTier, HEIR_AGE } from './afterlife.mjs';

// สัดส่วนจำนวนเกิดปีนั้นเทียบปีที่เกิดมากที่สุดในข้อมูล — แบ่งบรรยากาศรุ่นเป็น 3 ขั้น (ค่าตั้งของเกม)
const COHORT = [
  [0.9, 'เกิดในยุคที่เด็กเกิดปีละมากที่สุดยุคหนึ่ง ห้องเรียนแน่น เพื่อนร่วมรุ่นเต็มไปหมด'],
  [0.7, 'เด็กยังเกิดกันมาก แต่น้อยกว่ายุคก่อน ครอบครัวเริ่มมีลูกน้อยลง'],
  [0, 'เด็กเกิดน้อยลงทุกปี บ้านส่วนใหญ่มีลูกแค่คนหรือสองคน'],
];
// ส่วนต่างจากบ้าน (FATE.kin) ที่ถือว่าเห็นทิศ — เล็กกว่านี้เล่าว่าเฉย ๆ ไม่ได้ความ จึงไม่เล่า
const KIN_SHOWN = 1.5;

const sexWord = (sex) => (sex === 'หญิง' ? 'สาว' : 'ชาย');
const parentWord = (p) => (p.sex === 'หญิง' ? 'แม่' : 'พ่อ');

function cohortText(era, year) {
  const w = era.births.w;
  const r = w[Math.max(0, Math.min(w.length - 1, year - era.births.from))] / Math.max(...w);
  return COHORT.find(([min]) => r >= min)[1];
}

function familyText(st) {
  const [mom, dad] = [st.parents.find((p) => p.sex === 'หญิง'), st.parents.find((p) => p.sex === 'ชาย')];
  // ชื่ออาชีพที่มีคำว่าอาชีพในตัว ("วิชาชีพ") ต่อกับ "ทำอาชีพ" แล้วซ้ำคำ
  const occ = st.occupationName.includes('ชีพ') ? `ทำงาน${st.occupationName}` : `ทำอาชีพ${st.occupationName}`;
  // เริ่มกลางวัย (B76): พ่อ/แม่ที่ตายไปแล้วเก็บอายุตอนตาย ไม่ใช่อายุวันนี้ · รุ่นก่อน (ancestor) ตายปีที่เริ่ม
  // แต่ยัง alive ตอนการ์ดนี้เกิด (ตายตอนรับมรดกหลังการ์ด) จึงดูจากอายุตายแทน
  const gone = (p) => !p.alive || (p.ancestor && p.age >= p.diesAt);
  const say = (p, w) => (st.age > 0 && gone(p) ? `${w}จากไปแล้ว` : `${w}อายุ ${p.age}`);
  return `ครอบครัวฐานะ${st.cls} ${say(mom, 'แม่')} ${say(dad, 'พ่อ')} ทางบ้าน${occ}`;
}

// อัตราตายทารกอ่านปีต้นแบบเดียวกับบันทึกตายตอนเด็ก — โลกของชีวิตนี้ยืมสถิติปีนั้นทั้งชุด
function eraText(st) {
  // เริ่มกลางวัย (B76) พ้นขวบปีแรกมาแล้ว — อัตราตายทารกไม่ใช่เรื่องของคนนี้ เหลือแค่บรรยากาศรุ่นที่เกิด
  if (st.age > 0) return cohortText(st.content.era, st.birthYear);
  const imr = infantMortality(st.content.era, st.sex, protoYear(st.content.era, st.seed, st.birthYear));
  return `${cohortText(st.content.era, st.birthYear)} · ยุคนั้นทารก${st.sex}ไทยราว ${Math.round(imr)} คนในทุก 1,000 คน ไม่รอดถึงขวบปีแรก`;
}

function legacyText(legacy, who) {
  if (legacy.units > 0) {
    const size = legacy.units >= LEGACY.richUnits[1] ? 'ก้อนมหาศาล' : legacy.units >= LEGACY.richUnits[0] ? 'ก้อนใหญ่' : legacy.units >= 1 ? 'พอประมาณ' : 'ก้อนเล็ก';
    return `มรดก — เมื่อ${who}จากไป ส่วนของคุณเป็นทรัพย์${size}`;
  }
  if (legacy.debt) return `หนี้ — ${who}มีหนี้ติดตัว แต่ทายาทรับผิดไม่เกินมรดก หนี้จึงไม่ตกถึงคุณ`;
  return `มรดก — ${who}ไม่มีทรัพย์เหลือให้`;
}

function kinText(k, v, who) {
  if (Math.abs(v) < KIN_SHOWN) return null;
  const up = v > 0;
  const why = k === 'relations'
    ? (up ? 'บ้านนี้ญาติมิตรใกล้ชิดกัน' : 'บ้านนี้ญาติห่างเหินกัน')
    : (up ? `คนรู้จักของ${who}เปิดทางให้` : `${who}แทบไม่มีคนรู้จักให้พึ่ง`);
  return `${STAT_LABELS[k]} ${up ? '↑' : '↓'} — ${why}`;
}

// สิ่งที่สืบทอด (รุ่นที่ 2 ขึ้นไป) อ่านจาก heir ที่การ์ดส่งต่อสร้าง — เลือกช่องเองทีละช่อง ไม่ส่ง heir ทั้งก้อน (มีบัญชีที่ส่งต่อ)
function inheritText(st, heir) {
  // ฐานะเทียบกับชาติไทยล่าสุด — แถวต่างโลก (B68) ไม่มีฐานะ
  const prev = st.lineage.findLast((l) => !l.isekai);
  const away = st.lineage.slice(st.lineage.indexOf(prev) + 1);
  const out = [];
  const ancestor = st.parents.find((p) => p.ancestor);
  // เซฟก่อน B18 ไม่มี legacy.from — ทางเป็นลูกชั้นเดียวยังมีพ่อ/แม่ที่เป็นชาติก่อนให้เรียก
  const who = heir.legacy?.from ?? (ancestor ? parentWord(ancestor) : null);
  if (prev.path === 'blood' && who) out.push(`รุ่นก่อนจากไปแล้ว คุณเล่นต่อเป็น${kinTier(prev.tier).name}ที่ยังอยู่ — ${who}ของคุณคือคุณในรุ่นก่อน`);
  else if (prev.path === 'child' && who) out.push(`ชาติก่อนเฝ้าลูกหลานไว้ แล้วกลับมาเกิดเป็น${kinTier(prev.tier).name}ของตัวเอง — ${who}ของคุณคือคุณในชาติก่อน`);
  else if (away.length) out.push(`ชาติก่อนตามเทพธิดาไปต่างโลก ${away.length} ชาติ (ล่าสุด: ${away.at(-1).name} · ${away.at(-1).ending}) แล้วกลับมาเกิดใหม่ในบ้านที่ไม่เกี่ยวกับตระกูลเดิม`);
  else out.push('ชาติก่อนไปตามกรรม แล้วมาเกิดใหม่ในบ้านที่ไม่เกี่ยวกับตระกูลเดิม');
  out.push(`กรรมที่ติดตัวมาจากชาติก่อน${carryAmount(heir)}`);
  const d = CLASSES.indexOf(st.cls) - CLASSES.indexOf(prev.cls);
  // ทางสายเลือดอยู่บ้านเดิม ไม่ได้เกิดใหม่ — บอกฐานะบ้านตอนนี้เทียบฐานะที่รุ่นก่อนเกิดมา
  if (prev.path === 'blood') out.push(`ฐานะ${d ? ` ${d > 0 ? '↑' : '↓'}` : ''} — ฐานะบ้านตอนนี้${st.cls} (รุ่นก่อนเกิดมาฐานะ${prev.cls})`);
  else out.push(d ? `ฐานะ ${d > 0 ? '↑' : '↓'} — เกิดในบ้านที่ฐานะ${d > 0 ? 'ดีกว่า' : 'ด้อยกว่า'}ชาติก่อน (ชาติก่อนฐานะ${prev.cls})` : `ฐานะ — ใกล้เคียงชาติก่อน (ฐานะ${prev.cls})`);
  if (who && heir.legacy) {
    out.push(legacyText(heir.legacy, who));
    for (const k of ['relations', 'network']) {
      const line = kinText(k, heir.kin?.[k] ?? 0, who);
      if (line) out.push(line);
    }
  } else out.push('ไม่ได้รับมรดกหรือคนรู้จักจากบ้านเก่า มีแต่กรรมที่ติดมา');
  return out;
}

// ผังตระกูลย่อบนการ์ดเปิดชีวิต: รุ่นใกล้สุดก่อนเท่านี้ ที่เหลือดูได้ในผังพับบนหัวการ์ด
export const LINEAGE_BRIEF = 3;
function lineageBrief(lineage) {
  const lines = lineageText(lineage.slice(-LINEAGE_BRIEF));
  if (lineage.length > LINEAGE_BRIEF) lines.unshift(`… ก่อนหน้านี้อีก ${lineage.length - LINEAGE_BRIEF} รุ่น`);
  return lines;
}

// การ์ดใบแรกของทุกชีวิต — เล่าเรื่อง ไม่มีตัวเลือก (หน้าจอให้ปุ่ม "ต่อไป")
// ค่าเริ่มที่แลกจากช่องพกสกิลที่ไม่ใช้ (ใบ 201 · decisions 359): บอกเป็นคำว่าค่าไหนเด่น ไม่มีตัวเลข · เส้นสายเป็นค่าซ่อน จึงเล่าเป็นคำคนพูด
const SPARE_WORDS = { health: 'ร่างกายแข็งแรงกว่าเด็กรุ่นเดียวกัน', happiness: 'อารมณ์ดี เลี้ยงง่าย', knowledge: 'หัวไว เรียนรู้เร็ว', relations: 'เป็นที่รักของคนรอบตัว', network: 'มีผู้ใหญ่เอ็นดูคอยช่วยเหลือ' };
// ได้ 0 ค่า (ทุกค่าเด่นเกินเกณฑ์อยู่แล้ว) — บรรทัดสำรอง ไม่สัญญาจำนวน ไม่ผัดไปชาติหน้า
const SPARE_NONE = 'ติดตัวมาแต่เกิด: เด็กคนนี้โดดเด่นรอบด้านอยู่แล้ว ช่องที่เว้นไว้จึงไม่มีอะไรเติมได้อีก';
const spareText = (keys) => (keys.length ? `ติดตัวมาแต่เกิด: ${keys.map((k) => SPARE_WORDS[k]).join(' · ')}` : SPARE_NONE);

// ธงบ้านเกิด (ใบ 105): บรรทัดเดียวต่อธงตามลำดับทะเบียน · ไม่มีธง/เซฟเก่า = ไม่มีบรรทัด · ข้อความอยู่ content/rules/flags.yaml home:
const homeLines = (st) => Object.entries(st.content?.home ?? {}).filter(([f]) => st.homeFlags?.[f]).map(([, h]) => h.tell);

// จดหมายเหตุย้อนหลังของทายาทสายเลือด (ใบ 22 · B76 ข้อ 5): รับช่วงกลางวัยแล้วไม่โหวง — อดีตสุ่ม + ฉากกับรุ่นก่อน/ครู 3 ฉาก + ญาติที่จากไปก่อน
// อดีตเป็นสีสันล้วน ไม่อ้างระดับชั้น ผลการเรียน งาน ศาสนา ที่อยู่ พี่น้อง หรือสุขภาพ (ค่าพวกนั้นมีระบบของมันเอง) · สุ่มจาก stream แยก ไม่กินเลขสุ่มของโลก
// จำนวนบรรทัดอดีตโตตามอายุที่รับช่วง: อายุต่ำสุดของปุ่ม = 2 บรรทัด ปีละ 1 บรรทัด ไม่เกิน 10
export const CHRONICLE_PAST = [
  'ตอนเด็กเคยหลงทางในตลาด กว่าจะมีคนพากลับถึงบ้านก็มืดแล้ว',
  'เคยตกจากที่สูงจนแขนหัก ต้องใส่เฝือกอยู่เดือนกว่า',
  'ตอนเด็กเคยได้รางวัลเรียงความ ใบประกาศยังเก็บอยู่ในลิ้นชัก',
  'เพื่อนสนิทคนแรกย้ายบ้านไปตอนคุณสิบขวบ แล้วก็ไม่ได้ข่าวกันอีกเลย',
  'ตอนเด็กกลัวความมืดมาก ต้องเปิดไฟนอนอยู่หลายปี',
  'เคยแอบเก็บค่าขนมอยู่หลายเดือนเพื่อซื้อของเล่นชิ้นเดียว',
  'ตอนวัยรุ่นเคยโดดเรียนไปกับเพื่อน แล้วโดนจับได้ทั้งกลุ่ม',
  'เคยทะเลาะกับเพื่อนจนไม่พูดกันทั้งเทอม แล้วกลับมาดีกันเพราะต้องทำงานกลุ่มด้วยกัน',
  'ตอนเด็กชอบนั่งดูผู้ใหญ่ทำงานจนเลยเวลานอน',
  'เคยเกือบจมน้ำตอนเด็ก ตั้งแต่นั้นก็ไม่ค่อยกล้าลงน้ำลึก',
  'เคยวิ่งล้มกลางสนามวันกีฬาสีต่อหน้าคนทั้งโรงเรียน',
  'ช่วงวัยรุ่นเคยแอบชอบคนในห้องอยู่ปีกว่า ไม่เคยกล้าบอก',
  'เคยหนีออกจากบ้านไปค้างบ้านเพื่อนคืนหนึ่ง กลับมาโดนดุยกใหญ่',
  'ตอนสิบสองขวบได้ค่าขนมเพิ่มจากการช่วยงานบ้านเป็นครั้งแรก',
];
// {e} = รุ่นก่อนตามที่ทายาทเรียก + ชื่อ ("พ่อสมชาย" · "ปู่สมชาย")
export const CHRONICLE_ELDER = [
  '{e}เคยพาคุณไปเที่ยวไกลบ้าน คุณหลับตลอดทางทั้งขาไปและขากลับ',
  '{e}สอนคุณขี่จักรยาน ปล่อยมือไปตอนไหนคุณก็ไม่รู้ตัว',
  'คืนหนึ่งคุณไข้ขึ้นสูง {e}นั่งเช็ดตัวให้จนเช้า',
  '{e}เคยตีคุณครั้งเดียว เพราะคุณโกหกเรื่องเงิน',
  'วันรับใบประกาศ {e}มาสายแต่ก็มาจนได้ ยังใส่ชุดทำงานอยู่เลย',
  '{e}ชอบเล่าเรื่องสมัยตัวเองยังหนุ่มยังสาวให้ฟังก่อนนอน',
];
export const CHRONICLE_TEACHER = [
  'ครูคนหนึ่งตอนเด็กเคยเรียกคุณไปคุยหลังเลิกเรียน บอกว่าคุณทำได้ดีกว่าที่ตัวเองคิด',
  'ครูคนหนึ่งเคยให้คุณยืมหนังสือ ป่านนี้คุณยังไม่ได้เอาไปคืน',
  'ครูพละเคยสั่งให้คุณวิ่งรอบสนามจนหมดคาบ เพราะมาสาย',
];
export const CHRONICLE_ELDER_SCENES = 2;
export const CHRONICLE_PAST_MAX = 10;
const pickSome = (rng, xs, n) => {
  const left = [...xs];
  return Array.from({ length: Math.min(n, left.length) }, () => left.splice(rng.int(0, left.length - 1), 1)[0]);
};
const goneAt = (at) => (at < 0 ? 'ก่อนคุณเกิด' : at === 0 ? 'ปีที่คุณเกิด' : `ตอนคุณอายุ ${at}`);
function chronicleLines(st, heir) {
  const rng = makeRng(st.seed ^ 0x22c4b76d);
  const elder = `${heir.legacy.from}${st.lineage.findLast((l) => !l.isekai).name ?? ''}`;
  const past = pickSome(rng, CHRONICLE_PAST, Math.min(CHRONICLE_PAST_MAX, 2 + st.age - HEIR_AGE[0]));
  const scenes = [...pickSome(rng, CHRONICLE_ELDER, CHRONICLE_ELDER_SCENES).map((s) => s.replace('{e}', elder)), ...pickSome(rng, CHRONICLE_TEACHER, 1)];
  const gone = heir.kinGone?.length ? [`ญาติที่จากไปก่อน: ${heir.kinGone.map((g) => `${g.word}${g.name} (${goneAt(g.at)})`).join(' · ')}`] : [];
  return [...past, ...scenes, ...gone];
}

export function introCard(st, heir) {
  return {
    kind: 'intro',
    age: st.age,
    stage: stageOf(st.age),
    gen: st.gen,
    // ผู้สืบสายเลือด (B76) เริ่มกลางวัย — ไม่ได้เกิดใหม่ เล่าเป็นการรับช่วงชีวิตคนที่โตแล้ว
    text: st.age > 0
      ? `คุณเล่นต่อเป็น “${st.name}” วัย ${st.age} ปี ที่${provinceLabel(st)} ชื่อจริงว่า “${st.realName}”`
      : `คุณลืมตาดูโลกเป็นลูก${sexWord(st.sex)}ที่${provinceLabel(st)} ได้ชื่อจริงว่า “${st.realName}” ชื่อเล่นว่า “${st.name}”`,
    story: [familyText(st), eraText(st), ...homeLines(st), ...(st.spare ? [spareText(st.spare)] : []), ...(heir?.start && heir.legacy && st.lineage?.length ? chronicleLines(st, heir) : [])],
    // heir ที่ไม่มีรุ่นก่อน (harness สร้างทับค่าเกิดเฉย ๆ) ไม่มีอะไรให้สืบทอด
    inherit: heir && st.lineage.length ? inheritText(st, heir) : [],
    lineage: lineageBrief(st.lineage),
    choices: [],
  };
}

// ดวงไทยบรรทัดเดียวบนการ์ดเกิด (B55) — สีสันล้วน ไม่มีผลต่อเกม · หน้าจอเรียกตอนวาด ไม่ใส่ในการ์ด
// การ์ดจึงเหมือนก่อนมีดวงทุกช่อง · วันเกิดสุ่มจาก stream แยกของ seed ชีวิตนั้น ไม่กินเลขสุ่มของโลก
// ปีนักษัตรนับตามปีปฏิทิน ไม่ตัดที่สงกรานต์/ตรุษจีน — เกมไม่มีเดือนเกิดให้ตัดอยู่แล้ว
const WEEKDAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const ZODIAC = ['ชวด', 'ฉลู', 'ขาล', 'เถาะ', 'มะโรง', 'มะเส็ง', 'มะเมีย', 'มะแม', 'วอก', 'ระกา', 'จอ', 'กุน'];
export function horoscope(st) {
  const ce = st.birthYear - 543;
  const jan1 = Date.UTC(ce, 0, 1);
  const days = (Date.UTC(ce + 1, 0, 1) - jan1) / 86400000;
  const day = makeRng(st.seed ^ 0x9b05688c).int(0, days - 1);
  const weekday = new Date(jan1 + day * 86400000).getUTCDay();
  return `เกิดวัน${WEEKDAYS[weekday]} ปี${ZODIAC[(((ce - 4) % 12) + 12) % 12]}`;
}

const placeLabel = (name) => (name.startsWith('กรุงเทพ') ? name : `ภาค${name}`);

// บรรทัดเล่าใต้หัวข้อการ์ดบ้านเมือง — เศรษฐกิจ/ภัยพิบัติ/อุบัติภัย/สุขภาพ/เมือง/กีฬา (MAP ไม่แตะการเมือง) · ภัยที่มีภาคเล่าต่างกันตามที่ผู้เล่นอยู่
// สุขภาพที่มีภาค (ฝุ่น PM2.5) ใช้ข้อความสุขภาพ ไม่เข้ากิ่งภาค — เป็นข่าวถึงทุกบ้าน
export function eraStory(st, e) {
  if (e.kind === 'economy') return 'เศรษฐกิจทั้งประเทศสะดุด ข้าวของแพง งานหายาก หลายบ้านต้องรัดเข็มขัด เงินเก็บและการลงทุนปีนี้ได้รับผลไปด้วย';
  if (e.kind === 'health') return 'ข่าวสุขภาพนี้ถึงทุกบ้าน หลายครอบครัวต้องระวังตัวและปรับชีวิตประจำวันตาม';
  if (e.kind === 'accident') return 'ข่าวอุบัติภัยครั้งใหญ่ทำให้คนทั้งประเทศสะเทือนใจ หลายแห่งเร่งตรวจความปลอดภัยของที่อยู่และที่ทำงานตาม';
  if (e.kind === 'city') return 'เมืองและชีวิตประจำวันของผู้คนเปลี่ยนไปตามเรื่องนี้ แม้บ้านคุณจะอยู่ไกลก็ได้ยินข่าวถึง';
  if (e.kind === 'sport') return 'งานใหญ่ของประเทศที่คนทั้งบ้านทั้งเมืองจับตาดูไปพร้อมกัน';
  if (!e.regions?.length) return 'ข่าวนี้อยู่ในความสนใจของคนทั้งประเทศ หลายบ้านต้องระวังตัวและปรับชีวิตตาม';
  if (e.regions.includes(st.region)) return `${areaLabel(st)}ที่คุณอยู่เป็นพื้นที่ที่โดนหนัก บ้านเรือนและการทำมาหากินของคนแถวนี้เสียหาย`;
  return `เหตุหนักอยู่ที่${e.regions.map(placeLabel).join(' ')} ข่าวความเสียหายไปถึงทั่วประเทศ`;
}
