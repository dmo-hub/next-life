// กติกาธง + นัดเหตุการณ์ต่อเนื่อง: ธงที่เงื่อนไขขอใช้ต้องมีคนตั้ง · นัดต้องชี้เหตุการณ์ที่มีจริง
import { FLAG_RE, meritCat } from './vocab.mjs';
import { isObj, isRange, list, effectSites, choicesOf } from './util.mjs';

function flagRefs(e) {
  const out = [];
  for (const { node, path } of effectSites(e)) {
    for (const k of ['sets_flags', 'clears_flags']) list(node[k]).forEach((f, i) => out.push({ f, path: `${path}.${k}[${i}]`, set: k === 'sets_flags' }));
  }
  const w = isObj(e.when) && isObj(e.when.flags) ? e.when.flags : {};
  for (const k of ['has', 'not']) list(w[k]).forEach((f, i) => out.push({ f, path: `.when.flags.${k}[${i}]`, need: true }));
  for (const { c, path } of choicesOf(e)) {
    const q = isObj(c.requires) && isObj(c.requires.flags) ? c.requires.flags : {};
    for (const k of ['has', 'not']) list(q[k]).forEach((f, i) => out.push({ f, path: `${path}.requires.flags.${k}[${i}]`, need: true }));
  }
  // ธงที่คูณโอกาสเกิดแต่ไม่มีใครตั้ง = ตัวคูณที่ไม่เคยทำงาน
  if (isObj(e.multipliers) && isObj(e.multipliers.flags)) for (const f of Object.keys(e.multipliers.flags)) out.push({ f, path: `.multipliers.flags.${f}`, need: true });
  return out;
}

// ทะเบียนตรวจเฉพาะจุดที่ตั้ง/ล้างธง: ธงที่ถูกอ้างแต่ไม่มีใครตั้งเป็นเรื่องของ flag-unset · ชื่อผิดรูปเป็นเรื่องของ flag-format
const atSetSite = (f, set) => set !== undefined && typeof f === 'string' && FLAG_RE.test(f);

export const rules = [
  {
    id: 'flag-format',
    desc: 'ชื่อธงเป็น อังกฤษตัวเล็ก_ตัวเลข มีพารามิเตอร์ได้หนึ่งชั้นหลัง : (เช่น vow_open:exam_01)',
    event(e, ctx, r) {
      for (const { f, path } of flagRefs(e)) if (!(typeof f === 'string' && FLAG_RE.test(f))) r(path, `ธง "${f}" ผิดรูป`);
    },
  },
  {
    id: 'flag-unset',
    desc: 'ธงที่ when.flags อ้าง ต้องมีตัวเลือกใดตั้ง (sets_flags) หรือแกนตั้งให้จากป้ายธง (vow_broken)',
    all(events, ctx, r) {
      const set = new Set();
      for (const { e } of events) {
        for (const x of flagRefs(e)) if (x.set) set.add(x.f);
        for (const { node } of effectSites(e)) for (const m of list(node.merit)) if (meritCat(m?.cat)?.flag) set.add(meritCat(m.cat).id);
      }
      for (const x of events) for (const ref of flagRefs(x.e)) if (ref.need && !set.has(ref.f)) r(x, ref.path, `ไม่มีตัวเลือกไหนตั้งธง "${ref.f}"`);
    },
  },
  {
    id: 'flag-registry',
    desc: 'ธงที่ตัวเลือกตั้ง/ล้าง ต้องอยู่ใน content/rules/flags.yaml (flags · ธงมีพารามิเตอร์ดูที่ prefixes) — กันสะกดผิดแล้วกลายเป็นธงใหม่เงียบ ๆ',
    event(e, ctx, r) {
      for (const { f, path, set } of flagRefs(e)) {
        if (!atSetSite(f, set)) continue;
        const [base, param] = f.split(':');
        if (!(param === undefined ? ctx.flags.flags.has(base) : ctx.flags.prefixes.has(base))) r(path, `ธง "${f}" ไม่อยู่ในทะเบียนธง`);
      }
    },
  },
  {
    id: 'schedule-target',
    desc: 'schedules ชี้เหตุการณ์ที่มีอยู่จริง และ after_years เป็น [จาก, ถึง] 1–100',
    all(events, ctx, r) {
      const ids = new Set(events.map((x) => x.e.id));
      for (const x of events) {
        for (const { node, path } of effectSites(x.e)) {
          list(node.schedules).forEach((s, i) => {
            if (!isObj(s)) return;
            const p = `${path}.schedules[${i}]`;
            if (s.event !== undefined && !ids.has(s.event)) r(x, p, `นัดเหตุการณ์ "${s.event}" ที่ไม่มีอยู่`);
            if (s.after_years !== undefined && !isRange(s.after_years, 1, 100)) r(x, p, 'after_years ต้องเป็น [จาก, ถึง] 1–100');
          });
        }
      }
    },
  },
];
