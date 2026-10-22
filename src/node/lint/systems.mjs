// กติกาปีสินทรัพย์/ระบบ: เหตุการณ์ที่อ้างระบบต้องประกาศใน systems และช่วงปีต้องไม่ก่อนระบบมีจริง (data/system-starts.json)
import { isRange, list, textsOf } from './util.mjs';
import { YEAR_MIN, YEAR_MAX } from './vocab.mjs';

const declared = (e, ctx) => list(e.systems).map((id) => ({ id, sys: ctx.systems.get(id) }));
const years = (e) => (isRange(e.years, YEAR_MIN, YEAR_MAX) ? e.years : null);

export const rules = [
  {
    id: 'system-unknown',
    desc: 'systems อ้าง id ที่มีใน data/system-starts.json',
    event(e, ctx, r) {
      if (e.systems !== undefined && !Array.isArray(e.systems)) return r('.systems', 'systems ต้องเป็นรายการ');
      for (const { id } of declared(e, ctx)) if (!ctx.systems.has(id)) r('.systems', `ไม่รู้จักระบบ "${id}"`);
    },
  },
  {
    id: 'system-closed',
    desc: 'ระบบที่ปีเริ่มยังไม่ยืนยันปิดไว้ — เหตุการณ์อ้างไม่ได้จนกว่าจะได้แหล่ง',
    event(e, ctx, r) {
      for (const { id, sys } of declared(e, ctx)) if (sys?.status === 'closed') r('.systems', `${sys.name} (${id}) ปิดอยู่: ${sys.note}`);
    },
  },
  {
    id: 'system-before-start',
    desc: 'ปีแรกใน years ต้องไม่ก่อนปีที่ระบบเริ่ม',
    event(e, ctx, r) {
      const y = years(e);
      for (const { id, sys } of declared(e, ctx)) if (y && sys?.status === 'open' && y[0] < sys.from) r('.years', `${sys.name} (${id}) เริ่มปี ${sys.from} แต่ years เริ่ม ${y[0]}`);
    },
  },
  {
    id: 'system-after-end',
    desc: 'ปีสุดท้ายใน years ต้องไม่เลยปีที่ระบบสิ้นสุด',
    event(e, ctx, r) {
      const y = years(e);
      for (const { id, sys } of declared(e, ctx)) if (y && sys?.to !== undefined && y[1] > sys.to) r('.years', `${sys.name} (${id}) สิ้นสุดปี ${sys.to} แต่ years ถึง ${y[1]}`);
    },
  },
  {
    id: 'system-undeclared',
    desc: 'ข้อความที่มีคำของระบบ (keywords) ต้องประกาศระบบนั้นใน systems — กันลืมประกาศแล้วด่านปีไม่ทำงาน',
    event(e, ctx, r) {
      const have = new Set(list(e.systems));
      for (const { path, s } of textsOf(e)) {
        for (const sys of ctx.systems.values()) {
          const kw = sys.keywords.find((k) => s.includes(k));
          if (kw && !have.has(sys.id)) r(path, `มีคำ "${kw}" แต่ไม่ได้ประกาศ systems: [${sys.id}]`);
        }
      }
    },
  },
];
