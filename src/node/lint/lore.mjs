// กติกาอ้างหัวข้อ lore + ความยาวข้อความพอดีการ์ด
import { MAX_LEN } from './vocab.mjs';
import { list, textsOf, fillLongest } from './util.mjs';

const refs = (e) => (typeof e.lore_ref === 'string' ? [e.lore_ref] : list(e.lore_ref));

export const rules = [
  {
    id: 'lore-required',
    desc: 'เหตุการณ์อิงข้อเท็จจริง (มี systems · belief · หรือประกาศ fact: true) ต้องมี lore_ref',
    event(e, ctx, r) {
      const factual = list(e.systems).length > 0 || e.belief !== undefined || e.fact === true;
      if (factual && !refs(e).length) r('', 'เหตุการณ์อิงข้อเท็จจริงต้องอ้าง lore_ref: <ไฟล์>#<หัวข้อ>');
    },
  },
  {
    id: 'lore-ref',
    desc: 'lore_ref = <ไฟล์ lore ใน docs/spec>#<เลขหัวข้อ> และหัวข้อนั้นมีจริง (เช่น lore-era-data.md#5 · lore-finance-series.html#6)',
    event(e, ctx, r) {
      if (e.lore_ref !== undefined && typeof e.lore_ref !== 'string' && !Array.isArray(e.lore_ref)) return r('.lore_ref', 'lore_ref ต้องเป็นข้อความหรือรายการ');
      for (const ref of refs(e)) {
        const [file, key] = String(ref).split('#');
        const heads = ctx.lore.get(file);
        if (!heads) r('.lore_ref', `ไม่มีไฟล์ lore "${file}" (${[...ctx.lore.keys()].join(' · ')})`);
        else if (!heads.has(key)) r('.lore_ref', `${file} ไม่มีหัวข้อ "${key}" (${[...heads].join(' ')})`);
      }
    },
  },
  {
    id: 'text-length',
    desc: `ความยาวหลังแทนค่าช่องด้วยค่ายาวสุด: หัวเรื่อง ≤${MAX_LEN.title} · ข้อความการ์ด/ผลสุ่ม ≤${MAX_LEN.text} · ตัวเลือก ≤${MAX_LEN.choice} ตัวอักษร`,
    event(e, ctx, r) {
      for (const { kind, path, s } of textsOf(e)) {
        const n = fillLongest(s).length;
        if (n > MAX_LEN[kind]) r(path, `ยาว ${n} ตัวอักษร เกินเพดาน ${MAX_LEN[kind]}`);
      }
    },
  },
];

// หัวข้อของไฟล์ lore: md ใช้คำแรกของหัวข้อ (## 5. … → 5 · ### 4.1 … → 4.1 · ## A. … → A) · html ใช้ <h2>(5b) …
export function loreHeadings(name, src) {
  const keys = new Set();
  if (name.endsWith('.md')) for (const m of src.matchAll(/^#{2,4}\s+([^\s]+?)\.?\s/gm)) keys.add(m[1]);
  else for (const m of src.matchAll(/<h2>\(([0-9a-z]+)\)/g)) keys.add(m[1]);
  return keys;
}
