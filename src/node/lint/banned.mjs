// กติกาคำต้องห้าม (content/rules/banned.yaml) + ห้ามให้รางวัลกับการกล่าวหาว่าเป็นผีปอบ/ผีกะ + ทารกไม่พูด
import { STAT_KEYS, STAGE_AGES, AFTERLIFE_STAGE } from './vocab.mjs';
import { isObj, list, textsOf, effectSites, choicesOf } from './util.mjs';

// ทารก (B45): การ์ดที่ออกได้ตอนอายุ ≤ INFANT_MAX ตัวเลือกเป็นปฏิกิริยาเท่านั้น (ร้อง · หลับ · กอด) ไม่มีคำพูด/คำขอ
// "ร้อง" ไม่อยู่ในรายการ — ร้องไห้/ร้องหาเป็นปฏิกิริยาทารก · ขอ ไม่จับ ของ (ขอบคุณ/ขอนั่ง เป็นคำพูดจริง จับด้วย) · สัญญา ไม่จับ สัญญาณ
const INFANT_MAX = 4;
const SPEECH = /พูด|บอก|ถาม|ตะโกน|ชวน|อ้อน|ขอ(?!ง)|เรียก|ปฏิเสธ|สัญญา(?!ณ)|เถียง|ต่อรอง|[“”"]/u;

// อายุต่ำสุดที่การ์ดออกได้ · การ์ดที่ไม่มีช่วงอายุและไม่อยู่กองสุ่ม (ไม่มี weight/era) ออกทาง next/schedules เท่านั้น ⇒ อายุตามการ์ดแม่ + ปีที่เลื่อน
// ระหว่างชาติเป็นวิญญาณในฉากตำนาน ไม่ใช่ร่างทารก (เจ้าของเคาะ) · when.school = วัยเรียนแล้ว
function minAges(events) {
  const parents = new Map();
  const link = (to, from, delay) => typeof to === 'string' && parents.set(to, [...(parents.get(to) ?? []), [from, delay]]);
  for (const { e } of events) {
    for (const { node } of effectSites(e)) {
      link(node.next, e, 0);
      for (const s of list(node.schedules)) if (isObj(s)) link(s.event, e, list(s.after_years)[0] ?? 0);
    }
  }
  const memo = new Map();
  const min = (e, seen) => {
    if (memo.has(e)) return memo.get(e);
    if (seen.has(e)) return Infinity;
    seen.add(e);
    const w = isObj(e.when) ? e.when : {};
    const from = STAGE_AGES[e.stage]?.[0] ?? 0;
    const ps = parents.get(e.id);
    let a;
    if (e.stage === AFTERLIFE_STAGE || w.school) a = Infinity;
    else if (Number.isInteger(e.at_age)) a = e.at_age;
    else if (Array.isArray(w.age) && Number.isInteger(w.age[0])) a = w.age[0];
    else if (e.weight !== undefined || e.era !== undefined || !ps) a = from;
    else a = Math.min(...ps.map(([p, d]) => min(p, seen) + d));
    memo.set(e, a);
    return a;
  };
  return (e) => min(e, new Set());
}

const ACCUSE = /(ไล่|กล่าวหา|ชี้ว่า|ประจาน|บอกทุกคนว่า).{0,20}(ปอบ|ผีกะ|กระสือ)|(ปอบ|ผีกะ|กระสือ).{0,20}(ไล่|กล่าวหา|ประจาน)/;

// ผู้บรรยายเทศน์/ตัดสินผู้เล่น (ไอเดีย alterego-10 — คำบ่นหลักของเกมแนวนี้) · จับไม่ครบโดยตั้งใจ เจ้าของยังต้องอ่านเอง
// ตรวจเฉพาะเสียงผู้บรรยาย (หัว · ข้อความการ์ด · ข้อความผล) — คำเดียวกันบนตัวเลือกคือผู้เล่นพูดเอง ไม่ใช่เกมสั่งสอน
// ไม่มี "บทเรียน" / "ที่แท้": ใช้ในเรื่องตามปกติได้ (ซื้อบทเรียน · หักมุม)
const PREACH = [
  ['ควรจะ', /ควรจะ/u],
  ['คุณควร', /คุณ(?:ก็)?ควร/u],
  ['หวังว่าคุณ', /หวังว่าคุณ/u],
  ['อย่าลืมว่า', /อย่าลืมว่า/u],
  ['จงจำ', /จง(?:จำ|รู้)/u],
  ['สอนให้รู้', /สอนให้(?:รู้|เข้าใจ)/u],
  ['เรียนรู้ว่า', /เรียนรู้ว่า/u],
  ['ชีวิตคือ', /ชีวิต(?:ก็)?คือ/u],
  ['สิ่งสำคัญคือ', /สิ่งที่?สำคัญ(?:ที่สุด)?คือ/u],
  ['ไม่มีอะไรสำคัญเท่า', /ไม่มีอะไรสำคัญเท่า/u],
  ['ทำดีได้ดี', /ทำดีได้ดี|ทำชั่วได้ชั่ว/u],
  ['กรรมตามสนอง', /กรรมตามสนอง/u],
  ['เข้าใจแล้วว่า', /เข้าใจแล้วว่า/u],
];
const NARRATION = ['title', 'text'];

// ผลบวกใด ๆ ของจุดผล (ค่าสถานะ ↑ หรือได้เงิน)
const rewards = (node) => isObj(node.effects) && (STAT_KEYS.some((k) => node.effects[k] > 0) || node.effects.money?.amount > 0);

export const rules = [
  {
    id: 'banned-word',
    desc: 'ข้อความมีคำต้องห้ามตาม content/rules/banned.yaml (การเมือง/สถาบัน · พระเป็นตัวตลก · เพราะเกิดภาค X · แนะนำลงทุน · องค์กรจริงทุจริต · เลขนิมิต/พิธีได้ผล · ยกย่องการไล่ผีปอบ)',
    event(e, ctx, r) {
      for (const { path, s } of textsOf(e)) for (const b of ctx.banned) if (b.re.test(s)) r(path, `คำต้องห้าม ${b.id}: ${b.why}`);
    },
  },
  {
    id: 'preach',
    desc: 'ผู้บรรยายเทศน์ผู้เล่นในหัว/ข้อความการ์ด/ข้อความผล ("ควรจะ" · "อย่าลืมว่า" · "ชีวิตคือ" ฯลฯ) — เล่าสิ่งที่เกิด ให้ผู้เล่นสรุปเอง',
    event(e, ctx, r) {
      for (const { kind, path, s } of textsOf(e)) {
        if (!NARRATION.includes(kind)) continue;
        for (const [k, re] of PREACH) if (re.test(s)) r(path, `คำเทศน์ "${k}" — เล่าสิ่งที่เกิดแทนการสอน`);
      }
    },
  },
  {
    id: 'accuse-no-reward',
    desc: 'ตัวเลือกที่กล่าวหา/ไล่คนว่าเป็นผีปอบ ผีกะ กระสือ ห้ามมีผลบวก (ใบ 08: ต้องเห็นผลเสียของข่าวลือ)',
    event(e, ctx, r) {
      for (const { node, path, choice } of effectSites(e)) {
        const label = choice.text ?? choice.label;
        if (typeof label === 'string' && ACCUSE.test(label) && rewards(node)) r(path, 'ตัวเลือกกล่าวหาว่าเป็นผีแต่ให้ผลบวก');
      }
    },
  },
  {
    id: 'infant-speech',
    desc: `การ์ดที่ออกได้ตอนอายุ ≤${INFANT_MAX} (ช่วงอายุ · ช่วงวัย · หรือการ์ดแม่ที่ next/schedules มา) ตัวเลือกห้ามมีคำพูด/คำขอ — ทารกตอบด้วยปฏิกิริยา (B45)`,
    all(events, ctx, r) {
      const minAge = minAges(events);
      for (const x of events) {
        const a = minAge(x.e);
        if (a > INFANT_MAX) continue;
        for (const { c, path } of choicesOf(x.e)) {
          for (const k of ['text', 'label']) if (typeof c[k] === 'string' && SPEECH.test(c[k])) r(x, `${path}.${k}`, `ออกได้ตั้งแต่อายุ ${a} แต่ตัวเลือกมีคำพูด/คำขอ «${c[k]}» — เขียนเป็นปฏิกิริยาทารก หรือเลื่อนอายุเริ่มเป็น ${INFANT_MAX + 1}`);
        }
      }
    },
  },
];

export function compileBanned(doc, file) {
  return list(doc?.banned).map((b) => {
    if (!b?.id || !b.why || !b.pattern) throw new Error(`${file}: คำต้องห้ามต้องมี id why pattern`);
    return { ...b, re: new RegExp(b.pattern, 'u') };
  });
}
