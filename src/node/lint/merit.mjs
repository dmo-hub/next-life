// กติกาป้ายบุญบาป (ใบ 07 + 09): ทุกตัวเลือกติดป้าย · ไม่เกี่ยวต้องเขียน neutral ชัด ๆ · หมวด 9 เป็นธงไม่มีระดับ
import { meritCat, MERIT_CATS } from './vocab.mjs';
import { isObj, isInt, list, choicesOf, effectSites } from './util.mjs';

const meritItems = (e) =>
  effectSites(e).flatMap(({ node, path }) => list(node.merit).map((m, i) => ({ m: isObj(m) ? m : {}, path: `${path}.merit[${i}]` })));

export const rules = [
  {
    id: 'merit-missing',
    desc: 'ทุกตัวเลือกต้องมี merit ไม่ว่าง (ตัวเลือกที่ไม่เกี่ยวเขียน {cat: neutral})',
    event(e, ctx, r) {
      for (const { c, path } of choicesOf(e)) if (!Array.isArray(c.merit) || !c.merit.length) r(path, 'ไม่มีป้ายบุญบาป (merit)');
    },
  },
  {
    id: 'merit-category',
    desc: `หมวดบุญบาปอยู่ในรายการ: ${MERIT_CATS.map((c) => `${c.id}/${c.th}`).join(' · ')}`,
    event(e, ctx, r) {
      for (const { m, path } of meritItems(e)) if (m.cat !== undefined && !meritCat(m.cat)) r(path, `หมวด "${m.cat}" ไม่อยู่ในรายการ`);
    },
  },
  {
    id: 'merit-level',
    desc: 'level 1–3 · vow_broken ใช้ level: flag · neutral ไม่มี level',
    event(e, ctx, r) {
      for (const { m, path } of meritItems(e)) {
        const c = meritCat(m.cat);
        if (!c) continue;
        if (c.flag) { if (m.level !== 'flag') r(path, `${c.id} ต้องใช้ level: flag`); }
        else if (c.kind === 'neutral') { if (m.level !== undefined) r(path, 'neutral ไม่มี level'); }
        else if (!(isInt(m.level) && m.level >= 1 && m.level <= 3)) r(path, `${c.id} ต้องมี level 1–3 ได้ ${m.level}`);
      }
    },
  },
  {
    id: 'merit-neutral-alone',
    desc: 'neutral อยู่ร่วมกับหมวดอื่นในตัวเลือกเดียวกันไม่ได้',
    event(e, ctx, r) {
      for (const { node, path } of effectSites(e)) {
        const cats = list(node.merit).map((m) => meritCat(m?.cat)?.kind);
        if (cats.includes('neutral') && cats.length > 1) r(`${path}.merit`, 'neutral ต้องอยู่ตัวเดียว');
      }
    },
  },
];
