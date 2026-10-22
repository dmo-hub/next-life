// กติกาคำต้องห้าม (content/rules/banned.yaml) + ห้ามให้รางวัลกับการกล่าวหาว่าเป็นผีปอบ/ผีกะ
import { STAT_KEYS } from './vocab.mjs';
import { isObj, list, textsOf, effectSites } from './util.mjs';

const ACCUSE = /(ไล่|กล่าวหา|ชี้ว่า|ประจาน|บอกทุกคนว่า).{0,20}(ปอบ|ผีกะ|กระสือ)|(ปอบ|ผีกะ|กระสือ).{0,20}(ไล่|กล่าวหา|ประจาน)/;

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
