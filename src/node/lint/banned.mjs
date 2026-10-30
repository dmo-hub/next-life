// กติกาคำต้องห้าม (content/rules/banned.yaml) + ห้ามให้รางวัลกับการกล่าวหาว่าเป็นผีปอบ/ผีกะ
import { STAT_KEYS } from './vocab.mjs';
import { isObj, list, textsOf, effectSites } from './util.mjs';

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
];

export function compileBanned(doc, file) {
  return list(doc?.banned).map((b) => {
    if (!b?.id || !b.why || !b.pattern) throw new Error(`${file}: คำต้องห้ามต้องมี id why pattern`);
    return { ...b, re: new RegExp(b.pattern, 'u') };
  });
}
