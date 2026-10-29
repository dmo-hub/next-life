// กติกาธง + นัดเหตุการณ์ต่อเนื่อง + เรื่องต่อหลังผล: ธงที่เงื่อนไขขอใช้ต้องมีคนตั้ง · นัด/เรื่องต่อต้องชี้เหตุการณ์ที่มีจริง
import { FLAG_RE, meritCat, STAGE_AGES, AFTERLIFE_STAGE } from './vocab.mjs';
import { EXAM_PASS, BOND_FLAG } from '../../engine/career.mjs';
import { DEBT_FLAGS } from '../../engine/life.mjs';
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

// ผู้อ่านธงพ่อแม่ทุกจุด: when.parent_flags.has/not ของใบ · multipliers.parent_flags ของใบและของผลสุ่ม
const parentMults = (e) => [[e.multipliers, '.multipliers'], ...effectSites(e).filter((x) => x.path.includes('outcomes')).map((x) => [x.node.multipliers, `${x.path}.multipliers`])];
export function parentRefs(e) {
  const out = [];
  const w = isObj(e.when) && isObj(e.when.parent_flags) ? e.when.parent_flags : {};
  for (const k of ['has', 'not']) list(w[k]).forEach((f, i) => out.push({ f, k, path: `.when.parent_flags.${k}[${i}]` }));
  for (const [m, at] of parentMults(e)) if (isObj(m) && isObj(m.parent_flags)) for (const f of Object.keys(m.parent_flags)) out.push({ f, k: 'mult', path: `${at}.parent_flags.${f}` });
  return out;
}
// ธงพ่อแม่ไม่มีพารามิเตอร์ — ทะเบียน heir: มีแต่ชื่อเต็ม
const parentFlagName = (f) => typeof f === 'string' && FLAG_RE.test(f) && !f.includes(':');
const positive = (v) => typeof v === 'number' && Number.isFinite(v) && v > 0;

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
    desc: 'ธงที่ when.flags อ้าง ต้องมีตัวเลือกใดตั้ง (sets_flags) หรือแกนตั้งให้จากป้ายธง (vow_broken) หรือด่านเรียนต่อ (exam_pass:uni · scholar_bond) หรือยอดหนี้ (in_debt · informal_debt)',
    all(events, ctx, r) {
      const set = new Set([EXAM_PASS, BOND_FLAG, ...DEBT_FLAGS]);
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
    desc: 'schedules ชี้เหตุการณ์ที่มีอยู่จริง และ after_years เป็น [จาก, ถึง] 0–100 (0 = ตอนต่อไปออกปีเดียวกัน)',
    all(events, ctx, r) {
      const ids = new Set(events.map((x) => x.e.id));
      for (const x of events) {
        for (const { node, path } of effectSites(x.e)) {
          list(node.schedules).forEach((s, i) => {
            if (!isObj(s)) return;
            const p = `${path}.schedules[${i}]`;
            if (s.event !== undefined && !ids.has(s.event)) r(x, p, `นัดเหตุการณ์ "${s.event}" ที่ไม่มีอยู่`);
            if (s.after_years !== undefined && !isRange(s.after_years, 0, 100)) r(x, p, 'after_years ต้องเป็น [จาก, ถึง] 0–100');
          });
        }
      }
    },
  },
  {
    id: 'next-target',
    desc: 'ผลสุ่มที่มี next ต้องมี text (การ์ดผลมาก่อน) และชี้เหตุการณ์อื่นที่มีจริง ช่วงวัยเดียวกัน ที่ไม่มี at_age/weight/era (ออกได้ทางเรื่องต่อเท่านั้น)',
    all(events, ctx, r) {
      const byId = new Map(events.map((x) => [x.e.id, x.e]));
      for (const x of events) {
        for (const { node, path } of effectSites(x.e)) {
          if (!path.includes('outcomes') || node.next === undefined) continue;
          const p = `${path}.next`;
          const t = byId.get(node.next);
          if (typeof node.text !== 'string') r(x, p, 'ผลที่มีเรื่องต่อต้องมี text — เล่าผลก่อนแล้วค่อยให้เลือกต่อ');
          if (!t || node.next === x.e.id) { r(x, p, `เรื่องต่อ "${node.next}" ไม่มีอยู่ หรือชี้กลับเหตุการณ์ตัวเอง`); continue; }
          if (t.stage !== x.e.stage) r(x, p, `เรื่องต่อ "${node.next}" อยู่ช่วง${t.stage} ไม่ใช่ช่วง${x.e.stage} — ออกอายุเดียวกันกับการ์ดผล`);
          if (t.at_age !== undefined || t.weight !== undefined || t.era !== undefined) r(x, p, `เรื่องต่อ "${node.next}" มี at_age/weight/era — จะออกเองนอกเรื่องต่อ`);
        }
      }
    },
  },
  {
    id: 'next-cycle',
    desc: 'เรื่องต่อห้ามวนกลับใบที่อยู่ในสายเดียวกัน (ก → ข → ก) — การ์ดเรื่องต่อไม่นับ done/repeat และออกอายุเดียวกันทั้งสาย สายวนจึงซ้ำได้ไม่มีเพดานในปีเดียว',
    all(events, ctx, r) {
      const nexts = new Map();
      for (const x of events) {
        const out = [];
        for (const { node, path } of effectSites(x.e)) if (path.includes('outcomes') && typeof node.next === 'string' && node.next !== x.e.id) out.push({ to: node.next, path: `${path}.next` });
        nexts.set(x.e.id, { x, out });
      }
      // เดินลึกจากทุกใบ · สีเทา = อยู่บนทางเดินตอนนี้ เจอซ้ำ = วง · รายงานที่ขอบที่ปิดวงครั้งเดียวต่อขอบ
      const color = new Map();
      const seen = new Set();
      const walk = (id) => {
        color.set(id, 1);
        for (const { to, path } of nexts.get(id)?.out ?? []) {
          if (!nexts.has(to)) continue;
          if (color.get(to) === 1) {
            const k = `${id}>${path}`;
            if (!seen.has(k)) { seen.add(k); r(nexts.get(id).x, path, `เรื่องต่อ "${to}" วนกลับใบที่อยู่ในสายเดียวกัน — ตัดวงหรือจบสายด้วยการ์ดที่ไม่มี next`); }
          } else if (!color.has(to)) walk(to);
        }
        color.set(id, 2);
      };
      for (const id of nexts.keys()) if (!color.has(id)) walk(id);
    },
  },
  {
    id: 'parent-flag-registry',
    desc: 'ธงที่ when.parent_flags / multipliers.parent_flags อ้าง ต้องอยู่ในหมวด heir: ของ content/rules/flags.yaml — ธงนอกหมวดแกนไม่ส่งถึงทายาท การ์ดจะไม่มีวันออก/ตัวคูณไม่เคยทำงาน',
    event(e, ctx, r) {
      // ชื่อผิดรูปเป็นเรื่องของ parent-flag-shape — fixture แต่ละไฟล์จึงตกกติกาเดียว
      for (const { f, path } of parentRefs(e)) if (parentFlagName(f) && !ctx.flags.heir.has(f)) r(path, `ธง "${f}" ไม่อยู่ในหมวด heir: (แกนไม่ส่งธงนี้ถึงทายาท)`);
    },
  },
  {
    id: 'parent-flag-shape',
    desc: 'when.parent_flags = {has: [...], not: [...]} ชื่อธงถูกรูป ไม่ซ้ำระหว่าง has กับ not · multipliers.parent_flags = {ชื่อธง: เลขบวก} · ใช้ไม่ได้ในฉากระหว่างชาติ (ฉากนั้นอ่านชีวิตที่เพิ่งจบ ไม่ใช่ทายาท)',
    event(e, ctx, r) {
      const refs = parentRefs(e);
      if (isObj(e.when) && e.when.parent_flags !== undefined) {
        const w = e.when.parent_flags;
        if (!isObj(w) || ['has', 'not'].some((k) => w[k] !== undefined && !Array.isArray(w[k])) || (w.has === undefined && w.not === undefined)) r('.when.parent_flags', 'parent_flags ต้องเป็น {has: [...], not: [...]} อย่างน้อยหนึ่งอย่าง');
        else for (const f of list(w.has)) if (list(w.not).includes(f)) r('.when.parent_flags', `ธง "${f}" อยู่ทั้ง has และ not — การ์ดไม่มีวันออก`);
      }
      for (const { f, path } of refs) if (!parentFlagName(f)) r(path, `ธง "${f}" ผิดรูป (ธงพ่อแม่ไม่มีพารามิเตอร์)`);
      for (const [m, at] of parentMults(e)) if (isObj(m) && m.parent_flags !== undefined && (!isObj(m.parent_flags) || Object.values(m.parent_flags).some((v) => !positive(v)))) r(`${at}.parent_flags`, 'ต้องเป็น {ชื่อธง: เลขบวก}');
      if (e.stage === AFTERLIFE_STAGE && refs.length) r('.when.parent_flags', 'ฉากระหว่างชาติใช้ parent_flags ไม่ได้');
    },
  },
  {
    id: 'parent-flag-age',
    desc: 'การ์ดที่ when.parent_flags.has ธงที่ทะเบียนตั้ง from_age ต้องออกได้ตั้งแต่อายุนั้นขึ้นไปเท่านั้น (ขอบล่าง when.age หรือต้นช่วง stage) — ธงที่รุ่นก่อนมักติดหลังลูกโตแล้ว การ์ดเด็กจะเล่าเรื่องที่ยังไม่เกิด',
    event(e, ctx, r) {
      // ตัวคูณ/not ไม่ได้เล่าว่าพ่อแม่ทำอะไร — ดูแค่ has
      const has = isObj(e.when) && isObj(e.when.parent_flags) ? list(e.when.parent_flags.has) : [];
      const low = isObj(e.when) && isRange(e.when.age, 0, 120) ? e.when.age[0] : STAGE_AGES[e.stage]?.[0];
      if (low === undefined) return;
      has.forEach((f, i) => {
        const min = ctx.flags.heirFrom.get(f) ?? 0;
        if (low < min) r(`.when.parent_flags.has[${i}]`, `ธง "${f}" เล่าได้ตั้งแต่อายุ ${min} (heir: from_age) แต่การ์ดออกได้ตั้งแต่ ${low} — ตั้ง when.age [${min}, …] หรือย้ายไป stage ที่เริ่มอายุ ${min}+`);
      });
    },
  },
];
