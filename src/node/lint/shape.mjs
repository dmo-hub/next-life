// กติกาโครงข้อมูล: ฟิลด์บังคับ · ชนิด · key นอกรายการ · ระดับผล · หน่วยเงิน · ช่องแทนค่า
import {
  STAT_KEYS, EFFECT_KEYS, CLASSES, SEXES, STAGE_AGES, STAGE_NAMES, CATEGORIES, PLACEHOLDERS,
  ID_RE, YEAR_MIN, YEAR_MAX, FAMILY_ROLES, MIN_CHOICES, FLAG_RE, EDU, SCHOOL_VALUES,
} from './vocab.mjs';
import { INCOME_MULT } from '../../engine/life.mjs';
import { ASSETS, DEBTS } from '../../engine/finance.mjs';
import { EXAMS, TRACKS } from '../../engine/career.mjs';
import { isObj, isInt, isRange, list, choicesOf, effectSites, textsOf, placeholdersIn, isLedgerPlaceholder, isMoney } from './util.mjs';

const KEYS = {
  event: ['id', 'type', 'stage', 'years', 'at_age', 'category', 'title', 'text', 'choices', 'when', 'weight', 'multipliers', 'hidden', 'lore_ref', 'fact', 'systems', 'belief', 'era', 'repeat', 'scene', 'realm', 'prelude'],
  choice: ['id', 'text', 'label', 'effects', 'cost', 'outcomes', 'merit', 'sets_flags', 'clears_flags', 'schedules', 'hidden', 'pair_id', 'intent', 'redeem', 'requires', 'ticket', 'family', 'hint'],
  outcome: ['weight', 'ok', 'text', 'effects', 'merit', 'sets_flags', 'schedules', 'multipliers', 'next', 'family'],
  familyOp: ['add', 'n', 'leave', 'die', 'bond', 'd', 'kind', 'life', 'name'],
  effects: [...EFFECT_KEYS, 'invest', 'income_mult', 'chronic', 'job', 'school', 'debt', 'settle', 'complain'],
  chronic: STAT_KEYS,
  invest: ['asset', 'share'],
  debt: ['kind', 'amount'],
  money: ['unit', 'amount', 'ref_year'],
  merit: ['cat', 'level'],
  schedule: ['event', 'after_years'],
  when: ['age', 'year', 'class', 'region', 'sex', 'stats', 'flags', 'family', 'occupation', 'loss', 'school'],
  bound: ['min', 'max'],
  whenFlags: ['has', 'not'],
  family: ['role', 'age', 'alive', 'count', 'health', 'relations'],
  multipliers: ['class', 'stats', 'karma', 'family_fame', 'flags', 'occupation', 'wish'],
  repeat: ['gap', 'max'],
  prelude: ['before', 'chance'],
  requires: ['money', 'stats', 'flags', 'edu', 'family', 'age', 'reason'],
  belief: ['kind', 'tradition', 'outside_canon', 'vow', 'trigger', 'cap_per_life', 'prize_table', 'stake', 'odds_modifier'],
  vow: ['deadline_years', 'due_event', 'redeem_full_cost', 'redeem_light_cost', 'defer_once'],
  trigger: ['money_state'],
  odds: ['source', 'formula', 'max_mult', 'prize_scope', 'direction', 'ref_scale'],
};

// เดินทุก object ที่รู้จักรูปร่าง แล้วส่ง (ชนิด, node, path) ให้ผู้เรียก — กติกา unknown-key ใช้ตัวนี้ตัวเดียว
function* shaped(e) {
  yield ['event', e, ''];
  if (isObj(e.when)) {
    const w = e.when;
    yield ['when', w, '.when'];
    if (isObj(w.stats)) {
      yield ['stats', w.stats, '.when.stats'];
      for (const [k, b] of Object.entries(w.stats)) if (isObj(b)) yield ['bound', b, `.when.stats.${k}`];
    }
    if (isObj(w.flags)) yield ['whenFlags', w.flags, '.when.flags'];
    for (const [i, f] of list(w.family).entries()) {
      if (!isObj(f)) continue;
      yield ['family', f, `.when.family[${i}]`];
      for (const k of ['health', 'relations']) if (isObj(f[k])) yield ['bound', f[k], `.when.family[${i}].${k}`];
    }
  }
  if (isObj(e.multipliers)) yield ['multipliers', e.multipliers, '.multipliers'];
  if (isObj(e.belief)) {
    const b = e.belief;
    yield ['belief', b, '.belief'];
    if (isObj(b.vow)) {
      yield ['vow', b.vow, '.belief.vow'];
      for (const k of ['redeem_full_cost', 'redeem_light_cost']) if (isObj(b.vow[k])) yield ['money', b.vow[k], `.belief.vow.${k}`];
    }
    if (isObj(b.trigger)) yield ['trigger', b.trigger, '.belief.trigger'];
    if (isObj(b.odds_modifier)) yield ['odds', b.odds_modifier, '.belief.odds_modifier'];
    if (isObj(b.stake)) yield ['money', b.stake, '.belief.stake'];
  }
  if (isObj(e.repeat)) yield ['repeat', e.repeat, '.repeat'];
  if (isObj(e.prelude)) yield ['prelude', e.prelude, '.prelude'];
  for (const { c, path } of choicesOf(e)) {
    yield ['choice', c, path];
    const q = c.requires;
    if (!isObj(q)) continue;
    yield ['requires', q, `${path}.requires`];
    if (isObj(q.money)) yield ['money', q.money, `${path}.requires.money`];
    if (isObj(q.flags)) yield ['whenFlags', q.flags, `${path}.requires.flags`];
    for (const [i, f] of list(q.family).entries()) if (isObj(f)) yield ['family', f, `${path}.requires.family[${i}]`];
    if (isObj(q.age)) yield ['bound', q.age, `${path}.requires.age`];
    if (isObj(q.stats)) {
      yield ['stats', q.stats, `${path}.requires.stats`];
      for (const [k, b] of Object.entries(q.stats)) if (isObj(b)) yield ['bound', b, `${path}.requires.stats.${k}`];
    }
  }
  for (const { node, path } of effectSites(e)) {
    if (path.includes('outcomes')) {
      yield ['outcome', node, path];
      if (isObj(node.multipliers)) yield ['multipliers', node.multipliers, `${path}.multipliers`];
    }
    if (isObj(node.effects)) {
      yield ['effects', node.effects, `${path}.effects`];
      if (isObj(node.effects.money)) yield ['money', node.effects.money, `${path}.effects.money`];
      if (isObj(node.effects.invest)) yield ['invest', node.effects.invest, `${path}.effects.invest`];
      if (isObj(node.effects.chronic)) yield ['chronic', node.effects.chronic, `${path}.effects.chronic`];
      if (isObj(node.effects.debt)) {
        yield ['debt', node.effects.debt, `${path}.effects.debt`];
        if (isObj(node.effects.debt.amount)) yield ['money', node.effects.debt.amount, `${path}.effects.debt.amount`];
      }
    }
    if (isObj(node.cost)) yield ['money', node.cost, `${path}.cost`];
    for (const [i, m] of list(node.merit).entries()) if (isObj(m)) yield ['merit', m, `${path}.merit[${i}]`];
    for (const [i, s] of list(node.schedules).entries()) if (isObj(s)) yield ['schedule', s, `${path}.schedules[${i}]`];
    for (const [i, o] of list(node.family).entries()) if (isObj(o)) yield ['familyOp', o, `${path}.family[${i}]`];
  }
}

const bound = (b) => isObj(b) && ['min', 'max'].every((k) => b[k] === undefined || (typeof b[k] === 'number' && b[k] >= 0 && b[k] <= 100)) && !(b.min > b.max);
const nonEmptySubset = (v, of) => Array.isArray(v) && v.length > 0 && v.every((x) => of.includes(x));
const positive = (v) => typeof v === 'number' && Number.isFinite(v) && v > 0;

function checkMultipliers(m, at, r) {
  if (m === undefined) return;
  if (!isObj(m)) return r(at, 'multipliers ต้องเป็น object');
  for (const [k, of] of [['class', CLASSES], ['stats', STAT_KEYS]]) {
    if (m[k] === undefined) continue;
    if (!isObj(m[k]) || Object.entries(m[k]).some(([kk, v]) => !of.includes(kk) || !positive(v))) r(`${at}.${k}`, `ต้องเป็น {${of.join('|')}: เลขบวก}`);
  }
  for (const k of ['karma', 'family_fame', 'wish']) if (m[k] !== undefined && !positive(m[k])) r(`${at}.${k}`, 'ต้องเป็นเลขบวก');
  if (m.flags !== undefined && (!isObj(m.flags) || Object.entries(m.flags).some(([f, v]) => !FLAG_RE.test(f) || !positive(v)))) r(`${at}.flags`, 'ต้องเป็น {ชื่อธง: เลขบวก}');
}

export const rules = [
  {
    id: 'unknown-key',
    desc: 'key นอกรายการของ schema (กันพิมพ์ผิดแล้วเงื่อนไข/ผลหายเงียบ) · รวมรายการ hidden ที่ไม่ใช่ค่าสถานะ',
    event(e, ctx, r) {
      for (const [kind, node, path] of shaped(e)) {
        const allowed = kind === 'stats' ? STAT_KEYS : KEYS[kind];
        for (const k of Object.keys(node)) if (!allowed.includes(k)) r(path, `key "${k}" ไม่อยู่ในรายการของ ${kind} (${allowed.join(' ')})`);
      }
      for (const [path, h] of [['', e.hidden], ...choicesOf(e).map(({ c, path }) => [path, c.hidden])]) {
        if (h !== undefined && !nonEmptySubset(h, EFFECT_KEYS)) r(`${path}.hidden`, `hidden ต้องเป็นรายการจาก ${EFFECT_KEYS.join(' ')}`);
      }
    },
  },
  {
    id: 'required',
    desc: 'ฟิลด์บังคับ: id type stage years text choices · ตัวเลือกต้องมี text หรือ label อย่างใดอย่างหนึ่ง',
    event(e, ctx, r) {
      for (const k of ['id', 'type', 'stage', 'years', 'text']) if (e[k] === undefined) r('', `ขาดฟิลด์ ${k}`);
      if (!Array.isArray(e.choices)) r('', 'choices ต้องเป็นรายการ (การ์ดเล่าเรื่องใช้ [])');
      if (e.text !== undefined && typeof e.text !== 'string') r('.text', 'text ต้องเป็นข้อความ');
      for (const { c, path } of choicesOf(e)) {
        const n = ['text', 'label'].filter((k) => typeof c[k] === 'string' && c[k].trim()).length;
        if (n !== 1) r(path, 'ตัวเลือกต้องมีข้อความใน text หรือ label อย่างใดอย่างหนึ่ง');
      }
      for (const { node, path } of effectSites(e)) {
        list(node.merit).forEach((m, i) => isObj(m) && m.cat === undefined && r(`${path}.merit[${i}]`, 'ขาด cat'));
        list(node.schedules).forEach((s, i) => isObj(s) && (s.event === undefined || s.after_years === undefined) && r(`${path}.schedules[${i}]`, 'ต้องมี event และ after_years'));
      }
    },
  },
  {
    id: 'choice-count',
    desc: `การ์ดที่มีตัวเลือกต้องมีอย่างน้อย ${MIN_CHOICES} ตัวเลือก · การ์ดเล่าเรื่องใช้ choices: [] ได้`,
    event(e, ctx, r) {
      if (Array.isArray(e.choices) && e.choices.length && e.choices.length < MIN_CHOICES) r('.choices', `มี ${e.choices.length} ตัวเลือก ต้องมีอย่างน้อย ${MIN_CHOICES}`);
    },
  },
  {
    id: 'choice-hint',
    desc: 'hint (บรรทัดรองใต้ตัวเลือก) เป็นข้อความไม่ว่าง บอกข้อแลกเป็นทิศ/ความเสี่ยง — ห้ามตัวเลข ห้ามคำบุญ/บาป/กุศล (ผู้เล่นต้องไม่เห็นค่าหรือบัญชีบุญบาปจากปุ่ม)',
    event(e, ctx, r) {
      for (const { c, path } of choicesOf(e)) {
        if (c.hint === undefined) continue;
        if (typeof c.hint !== 'string' || !c.hint.trim()) { r(`${path}.hint`, 'hint ต้องเป็นข้อความไม่ว่าง'); continue; }
        if (/[0-9๐-๙]/.test(c.hint)) r(`${path}.hint`, 'hint ห้ามมีตัวเลข — บอกเป็นทิศ เช่น "อาจเสียเงินก้อนใหญ่"');
        if (/บุญ|บาป|กุศล/.test(c.hint)) r(`${path}.hint`, 'hint ห้ามบอกบุญบาป');
      }
    },
  },
  {
    id: 'id-format',
    desc: 'id เหตุการณ์/ตัวเลือก/pair_id เป็นอังกฤษตัวเล็ก ตัวเลข _ ขึ้นต้นด้วยตัวอักษร',
    event(e, ctx, r) {
      if (e.id !== undefined && !(typeof e.id === 'string' && ID_RE.test(e.id))) r('.id', `id "${e.id}" ผิดรูป`);
      for (const { c, path } of choicesOf(e)) {
        for (const k of ['id', 'pair_id']) if (c[k] !== undefined && !(typeof c[k] === 'string' && ID_RE.test(c[k]))) r(`${path}.${k}`, `${k} "${c[k]}" ผิดรูป`);
      }
    },
  },
  {
    id: 'id-duplicate',
    desc: 'id เหตุการณ์ซ้ำกันข้ามทุกไฟล์',
    all(events, ctx, r) {
      const seen = new Map();
      for (const x of events) {
        if (typeof x.e.id !== 'string') continue;
        if (seen.has(x.e.id)) r(x, '', `id ซ้ำกับใน ${seen.get(x.e.id)}`);
        else seen.set(x.e.id, x.file);
      }
    },
  },
  {
    id: 'choice-id-duplicate',
    desc: 'id ตัวเลือกซ้ำกันในเหตุการณ์เดียว',
    event(e, ctx, r) {
      const seen = new Set();
      for (const { c, path } of choicesOf(e)) {
        if (c.id === undefined) continue;
        if (seen.has(c.id)) r(`${path}.id`, `id ตัวเลือก "${c.id}" ซ้ำ`);
        seen.add(c.id);
      }
    },
  },
  {
    id: 'type-value',
    desc: 'type = A (ทะเบียนราษฎร์) หรือ B (ลายรดน้ำ) ตามใบ 06 · category อยู่ในรายการหมวดเนื้อหา',
    event(e, ctx, r) {
      if (e.type !== undefined && !['A', 'B'].includes(e.type)) r('.type', `type ต้องเป็น A หรือ B ได้ "${e.type}"`);
      if (e.category !== undefined && !CATEGORIES.includes(e.category)) r('.category', `category ต้องเป็นหนึ่งใน ${CATEGORIES.join(' ')}`);
    },
  },
  {
    id: 'stage-value',
    desc: 'stage เป็นชื่อช่วงวัยที่แกนเกมใช้',
    event(e, ctx, r) {
      if (e.stage !== undefined && !STAGE_NAMES.includes(e.stage)) r('.stage', `stage "${e.stage}" ไม่ใช่ช่วงวัย (${STAGE_NAMES.join(' ')})`);
    },
  },
  {
    id: 'years-range',
    desc: `years = [จาก, ถึง] ปี พ.ศ. จำนวนเต็ม ${YEAR_MIN}–${YEAR_MAX} จาก ≤ ถึง`,
    event(e, ctx, r) {
      if (e.years !== undefined && !isRange(e.years, YEAR_MIN, YEAR_MAX)) r('.years', `years ผิดรูป: ${JSON.stringify(e.years)}`);
    },
  },
  {
    id: 'at-age-stage',
    desc: 'at_age (เหตุการณ์หลักไมล์) เป็นจำนวนเต็มที่อยู่ในช่วงอายุของ stage · ช่วงระหว่างชาติไม่มีอายุ',
    event(e, ctx, r) {
      if (e.at_age === undefined) return;
      const span = STAGE_AGES[e.stage];
      if (!isInt(e.at_age) || !span || e.at_age < span[0] || e.at_age > span[1]) {
        r('.at_age', `at_age ${e.at_age} ไม่อยู่ในช่วง ${e.stage}${span ? ` (${span[0]}–${span[1]})` : ''}`);
      }
    },
  },
  {
    id: 'when-shape',
    desc: 'เงื่อนไขเกิดแบบประกาศ: ช่วงอายุ/ปี · ฐานะ · ภาค · เพศ · ค่าสถานะ min/max · ธง has/not · สมาชิกครอบครัว — ค่าต้องอยู่ในรายการ',
    event(e, ctx, r) {
      const w = e.when;
      if (w === undefined) return;
      if (!isObj(w)) return r('.when', 'when ต้องเป็น object');
      if (w.age !== undefined && !isRange(w.age, 0, 120)) r('.when.age', 'age ต้องเป็น [จาก, ถึง] 0–120');
      if (w.year !== undefined && (!isRange(w.year, YEAR_MIN, YEAR_MAX) || (isRange(e.years, YEAR_MIN, YEAR_MAX) && (w.year[0] > e.years[1] || w.year[1] < e.years[0])))) {
        r('.when.year', 'year ต้องเป็นช่วงปีที่ทับกับ years');
      }
      if (w.class !== undefined && !nonEmptySubset(w.class, CLASSES)) r('.when.class', `class ต้องเป็นรายการจาก ${CLASSES.join(' ')}`);
      if (w.region !== undefined && !nonEmptySubset(w.region, ctx.regions)) r('.when.region', `region ต้องเป็นรายการจาก ${ctx.regions.join(' · ')}`);
      if (w.sex !== undefined && !nonEmptySubset(w.sex, SEXES)) r('.when.sex', `sex ต้องเป็นรายการจาก ${SEXES.join(' ')}`);
      if (w.stats !== undefined) {
        if (!isObj(w.stats)) r('.when.stats', 'stats ต้องเป็น object');
        else for (const [k, b] of Object.entries(w.stats)) if (!bound(b)) r(`.when.stats.${k}`, 'ต้องเป็น {min, max} 0–100 min ≤ max');
      }
      if (w.flags !== undefined) {
        if (!isObj(w.flags) || ['has', 'not'].some((k) => w.flags[k] !== undefined && !Array.isArray(w.flags[k]))) r('.when.flags', 'flags ต้องเป็น {has: [...], not: [...]}');
      }
      if (w.family !== undefined) {
        if (!Array.isArray(w.family)) return r('.when.family', 'family ต้องเป็นรายการ');
        w.family.forEach((f, i) => {
          const p = `.when.family[${i}]`;
          if (!isObj(f) || !FAMILY_ROLES.includes(f.role)) return r(p, `role ต้องเป็น ${FAMILY_ROLES.join(' ')}`);
          if (f.age !== undefined && !isRange(f.age, 0, 120)) r(`${p}.age`, 'age ต้องเป็น [จาก, ถึง] 0–120');
          if (f.alive !== undefined && typeof f.alive !== 'boolean') r(`${p}.alive`, 'alive ต้องเป็น true/false');
          if (f.count !== undefined && !isRange(f.count, 0, 20)) r(`${p}.count`, 'count ต้องเป็น [จาก, ถึง] 0–20');
          for (const k of ['health', 'relations']) if (f[k] !== undefined && !bound(f[k])) r(`${p}.${k}`, 'ต้องเป็น {min, max} 0–100');
        });
      }
    },
  },
  {
    id: 'weight-shape',
    desc: 'weight เป็นเลขบวก · multipliers ของเหตุการณ์และของผลสุ่มแต่ละทาง (ฐานะ · ค่าสถานะ · กรรม · ชื่อเสียงตระกูล · ธง) เป็นเลขบวก',
    event(e, ctx, r) {
      if (e.weight !== undefined && !positive(e.weight)) r('.weight', 'weight ต้องเป็นเลขบวก');
      checkMultipliers(e.multipliers, '.multipliers', r);
      for (const { node, path } of effectSites(e)) if (path.includes('outcomes')) checkMultipliers(node.multipliers, `${path}.multipliers`, r);
    },
  },
  {
    id: 'effect-level',
    desc: 'ผลต่อค่าสถานะ (รวม chronic ที่ไหลทุกปี) เป็นระดับจำนวนเต็ม ±1..±3 ไม่ใช่ตัวเลขดิบ · income_mult อยู่ในเพดาน',
    event(e, ctx, r) {
      for (const { node, path } of effectSites(e)) {
        if (node.effects === undefined) continue;
        if (!isObj(node.effects)) { r(`${path}.effects`, 'effects ต้องเป็น object'); continue; }
        for (const k of STAT_KEYS) {
          const v = node.effects[k];
          if (v !== undefined && !(isInt(v) && v !== 0 && Math.abs(v) <= 3)) r(`${path}.effects.${k}`, `ระดับต้องเป็น ±1..±3 ได้ ${v}`);
        }
        const ch = node.effects.chronic;
        if (ch !== undefined) {
          if (!isObj(ch)) r(`${path}.effects.chronic`, 'chronic ต้องเป็น {ค่าสถานะ: ระดับ}');
          else for (const [k, v] of Object.entries(ch)) if (!(isInt(v) && v !== 0 && Math.abs(v) <= 3)) r(`${path}.effects.chronic.${k}`, `ระดับต้องเป็น ±1..±3 ได้ ${v}`);
        }
        const im = node.effects.income_mult;
        if (im !== undefined && !(typeof im === 'number' && im >= INCOME_MULT[0] && im <= INCOME_MULT[1] && im !== 1)) r(`${path}.effects.income_mult`, `ตัวคูณรายได้ต้องอยู่ ${INCOME_MULT[0]}–${INCOME_MULT[1]} และไม่ใช่ 1 ได้ ${im}`);
      }
    },
  },
  {
    id: 'money-unit',
    desc: 'เงินต้องระบุหน่วย {unit: income_x | fixed_baht, amount, ref_year?} · cost เป็นจำนวนบวก (จ่ายออก) · ห้ามมีทั้ง cost และ effects.money',
    event(e, ctx, r) {
      for (const { node, path } of effectSites(e)) {
        const m = isObj(node.effects) ? node.effects.money : undefined;
        if (m !== undefined && !isMoney(m)) r(`${path}.effects.money`, `เงินต้องเป็น {unit: income_x|fixed_baht, amount} ได้ ${JSON.stringify(m)}`);
        if (node.cost !== undefined && !(isMoney(node.cost) && node.cost.amount > 0)) r(`${path}.cost`, 'cost ต้องเป็นเงินมีหน่วย amount > 0');
        if (node.cost !== undefined && m !== undefined) r(path, 'มีทั้ง cost และ effects.money — เลือกอย่างเดียว');
      }
      const b = isObj(e.belief) ? e.belief : {};
      const v = isObj(b.vow) ? b.vow : {};
      for (const [p, m] of [['.belief.stake', b.stake], ['.belief.vow.redeem_full_cost', v.redeem_full_cost], ['.belief.vow.redeem_light_cost', v.redeem_light_cost]]) {
        if (m !== undefined && !(isMoney(m) && m.amount > 0)) r(p, 'ต้องเป็นเงินมีหน่วย amount > 0');
      }
    },
  },
  {
    id: 'debt-shape',
    desc: `กู้เงิน effects.debt = {kind: ${DEBTS.map((d) => d.id).join('|')}, amount: เงินมีหน่วย amount > 0} · ปิดหนี้ effects.settle = ชนิดหนี้ · ร้องเรียนดอกนอกระบบ effects.complain = true`,
    event(e, ctx, r) {
      for (const { node, path } of effectSites(e)) {
        const v = isObj(node.effects) ? node.effects.debt : undefined;
        if (v === undefined) continue;
        if (!isObj(v) || !DEBTS.some((d) => d.id === v.kind) || !(isMoney(v.amount) && v.amount.amount > 0)) {
          r(`${path}.effects.debt`, `ต้องเป็น {kind: ชนิดหนี้, amount: {unit, amount > 0}} ได้ ${JSON.stringify(v)}`);
        }
      }
      for (const { node, path } of effectSites(e)) {
        const fx = isObj(node.effects) ? node.effects : {};
        if (fx.settle !== undefined && !DEBTS.some((d) => d.id === fx.settle)) r(`${path}.effects.settle`, `ปิดหนี้ต้องเป็นชนิดหนี้ (${DEBTS.map((d) => d.id).join(' ')}) ได้ ${JSON.stringify(fx.settle)}`);
        if (fx.complain !== undefined && fx.complain !== true) r(`${path}.effects.complain`, 'complain ต้องเป็น true เท่านั้น');
      }
    },
  },
  {
    id: 'invest-shape',
    desc: `ย้ายเงินเข้าสินทรัพย์ effects.invest = {asset: ${ASSETS.map((a) => a.id).join('|')}, share: 0 < สัดส่วน ≤ 1}`,
    event(e, ctx, r) {
      for (const { node, path } of effectSites(e)) {
        const v = isObj(node.effects) ? node.effects.invest : undefined;
        if (v === undefined) continue;
        if (!isObj(v) || !ASSETS.some((a) => a.id === v.asset) || !(typeof v.share === 'number' && v.share > 0 && v.share <= 1)) {
          r(`${path}.effects.invest`, `ต้องเป็น {asset: id สินทรัพย์, share: 0–1} ได้ ${JSON.stringify(v)}`);
        }
      }
    },
  },
  {
    id: 'outcomes-shape',
    desc: 'ผลสุ่ม outcomes มีอย่างน้อย 2 ทาง แต่ละทางมี weight เลขบวก',
    event(e, ctx, r) {
      for (const { c, path } of choicesOf(e)) {
        if (c.outcomes === undefined) continue;
        if (!Array.isArray(c.outcomes) || c.outcomes.length < 2) { r(`${path}.outcomes`, 'outcomes ต้องมีอย่างน้อย 2 ทาง'); continue; }
        c.outcomes.forEach((o, j) => !(isObj(o) && positive(o.weight)) && r(`${path}.outcomes[${j}]`, 'ต้องมี weight เลขบวก'));
      }
    },
  },
  {
    id: 'text-placeholder',
    desc: `ช่องแทนค่าในข้อความต้องอยู่ในรายการปิด ${Object.keys(PLACEHOLDERS).map((k) => `{${k}}`).join(' ')}`,
    event(e, ctx, r) {
      for (const { path, s } of textsOf(e)) {
        for (const k of placeholdersIn(s)) if (!(k in PLACEHOLDERS) && !isLedgerPlaceholder(k)) r(path, `ช่องแทนค่า {${k}} ไม่อยู่ในรายการ`);
      }
    },
  },  {
    id: 'era-ref',
    desc: 'era ชี้ id เหตุการณ์บ้านเมืองใน data/era-events.json · การ์ดบ้านเมืองไม่มีอายุตายตัว (ห้ามมี at_age/weight — เกิดเมื่อเหตุการณ์บ้านเมืองมาเท่านั้น)',
    event(e, ctx, r) {
      if (e.era === undefined) return;
      if (typeof e.era !== 'string' || !ctx.eras.has(e.era)) r('.era', `ไม่มีเหตุการณ์บ้านเมือง "${e.era}" (${[...ctx.eras].join(' ')})`);
      if (e.at_age !== undefined || e.weight !== undefined) r('.era', 'การ์ดบ้านเมืองห้ามมี at_age หรือ weight');
    },
  },
  {
    id: 'repeat-shape',
    desc: 'repeat = {gap: เว้นกี่ปี 1–100, max: ออกได้กี่ครั้ง 2–20} · ใช้ได้เฉพาะใบในกองสุ่ม (มี weight ไม่มี at_age ไม่ผูก era)',
    event(e, ctx, r) {
      const p = e.repeat;
      if (p === undefined) return;
      if (!isObj(p) || !(isInt(p.gap) && p.gap >= 1 && p.gap <= 100) || !(isInt(p.max) && p.max >= 2 && p.max <= 20)) r('.repeat', `ต้องเป็น {gap: 1–100, max: 2–20} ได้ ${JSON.stringify(p)}`);
      if (e.weight === undefined || e.at_age !== undefined || e.era !== undefined) r('.repeat', 'repeat ใช้ได้กับใบในกองสุ่มเท่านั้น (มี weight · ไม่มี at_age · ไม่มี era)');
    },
  },
  {
    id: 'prelude-shape',
    desc: `prelude = {before: ด่านสอบ (${EXAMS.join(' ')}), chance: 0–1} · การ์ดนำออกในคิวก่อนด่านปีจบช่วงเรียน — ห้ามมี weight/at_age/era/repeat และ stage ต้องเป็นช่วงวัยของปีด่าน`,
    event(e, ctx, r) {
      const p = e.prelude;
      if (p === undefined) return;
      if (!isObj(p) || !EXAMS.includes(p.before) || !(typeof p.chance === 'number' && p.chance > 0 && p.chance <= 1)) {
        r('.prelude', `ต้องเป็น {before: ${EXAMS.join('|')}, chance: 0–1} ได้ ${JSON.stringify(p)}`);
        return;
      }
      if (e.weight !== undefined || e.at_age !== undefined || e.era !== undefined || e.repeat !== undefined) r('.prelude', 'การ์ดนำห้ามมี weight/at_age/era/repeat — ออกได้ทางเดียวคือก่อนด่าน');
      const ages = Object.values(TRACKS).filter((t) => t.exam === p.before).map((t) => t.until);
      const span = STAGE_AGES[e.stage];
      if (span && !ages.some((a) => a >= span[0] && a <= span[1])) r('.stage', `ด่าน ${p.before} อยู่ที่อายุ ${ages.join('/')} ไม่อยู่ในช่วง ${e.stage}`);
    },
  },
  {
    id: 'choice-lock',
    desc: 'requires = {money?: เงินมีหน่วย amount > 0, stats?: {ค่า: {min, max}}, flags?: {has, not}, edu?: วุฒิขั้นต่ำ, family?: [{role: parent|spouse|child|grandchild, alive?, age?, count?}], age?: {min, max} 0–120 (เหตุผลแกนเขียนเอง), reason?} · ล็อกด้วยธงต้องมี reason · การ์ดต้องมีตัวเลือกไม่ล็อกอย่างน้อย 1 ตัว',
    event(e, ctx, r) {
      const cs = choicesOf(e);
      for (const { c, path } of cs) {
        const q = c.requires;
        if (q === undefined) continue;
        const at = `${path}.requires`;
        if (!isObj(q) || !['money', 'stats', 'flags', 'edu', 'family', 'age'].some((k) => q[k] !== undefined)) { r(at, 'requires ต้องมี money stats flags edu family หรือ age อย่างน้อยหนึ่งอย่าง'); continue; }
        // อายุตามกฎหมาย (เช่น พินัยกรรม 15 ปีขึ้นไป) — แกนเขียนเหตุผล "อายุยังไม่ถึง N ปี" เอง
        if (q.age !== undefined && !(isObj(q.age) && (q.age.min !== undefined || q.age.max !== undefined) && [q.age.min, q.age.max].every((v) => v === undefined || (Number.isInteger(v) && v >= 0 && v <= 120)))) r(`${at}.age`, 'ต้องเป็น {min, max} จำนวนเต็ม 0–120');
        // ตัวเลือกที่พูดถึงคนในบ้านล็อกได้เมื่อไม่มีคนนั้น (เงื่อนไขชุดเดียวกับ when.family)
        if (q.family !== undefined && !(Array.isArray(q.family) && q.family.length && q.family.every((f) => isObj(f) && FAMILY_ROLES.includes(f.role) && (f.alive === undefined || typeof f.alive === 'boolean') && (f.age === undefined || isRange(f.age, 0, 120)) && (f.count === undefined || isRange(f.count, 0, 20)) && f.health === undefined && f.relations === undefined))) r(`${at}.family`, 'ต้องเป็น [{role: parent|spouse|child|grandchild, alive?: true/false, age?: [จาก, ถึง], count?: [จาก, ถึง]}]');
        if (q.money !== undefined && !(isMoney(q.money) && q.money.amount > 0)) r(`${at}.money`, 'ต้องเป็นเงินมีหน่วย amount > 0');
        if (q.stats !== undefined && (!isObj(q.stats) || Object.entries(q.stats).some(([k, b]) => !STAT_KEYS.includes(k) || !bound(b) || (b.min === undefined && b.max === undefined)))) r(`${at}.stats`, 'ต้องเป็น {ค่าสถานะ: {min, max}} 0–100');
        if (q.flags !== undefined && (!isObj(q.flags) || ['has', 'not'].some((k) => q.flags[k] !== undefined && !Array.isArray(q.flags[k])))) r(`${at}.flags`, 'flags ต้องเป็น {has: [...], not: [...]}');
        // ชื่อธงเป็นภาษาโค้ด ผู้เล่นอ่านไม่ออก — ต้องบอกเหตุผลเป็นคำ
        if (q.flags !== undefined && !(typeof q.reason === 'string' && q.reason.trim())) r(`${at}.reason`, 'ล็อกด้วยธงต้องมี reason ที่ผู้เล่นอ่านเข้าใจ');
        if (q.reason !== undefined && !(typeof q.reason === 'string' && q.reason.trim())) r(`${at}.reason`, 'reason ต้องเป็นข้อความ');
      }
      if (cs.length && cs.every(({ c }) => c.requires !== undefined)) r('.choices', 'ทุกตัวเลือกล็อกได้ — ต้องมีตัวเลือกที่ไม่มี requires อย่างน้อย 1 ตัว ไม่งั้นการ์ดค้าง');
    },
  },
  {
    id: 'career-shape',
    desc: `อาชีพ/การเรียน (B15): effects.job = id อาชีพใน data/finance.json · effects.school = ${SCHOOL_VALUES.join('|')} · when.occupation = รายการ id อาชีพ · when.school = รายการช่วงเรียนที่กำลังเรียน (${SCHOOL_VALUES.join('|')} · none = ยังไม่เข้าเรียน/เลิกเรียนแล้ว) · multipliers.occupation = {id อาชีพ: เลขบวก} · requires.edu = ${EDU.join('|')} · outcome ok = true เท่านั้น (ทางสำเร็จที่ใช้คิด %)`,
    event(e, ctx, r) {
      const occ = ctx.occupations;
      const w = isObj(e.when) ? e.when.occupation : undefined;
      if (w !== undefined && !nonEmptySubset(w, occ)) r('.when.occupation', `ต้องเป็นรายการจาก ${occ.join(' ')}`);
      const ws = isObj(e.when) ? e.when.school : undefined;
      if (ws !== undefined && !nonEmptySubset(ws, SCHOOL_VALUES)) r('.when.school', `ต้องเป็นรายการจาก ${SCHOOL_VALUES.join(' ')}`);
      const mults = [[e.multipliers, '.multipliers']];
      for (const { node, path } of effectSites(e)) {
        if (path.includes('outcomes')) {
          mults.push([node.multipliers, `${path}.multipliers`]);
          if (node.ok !== undefined && node.ok !== true) r(`${path}.ok`, 'ok ใช้ได้แค่ true (ทางที่ไม่สำเร็จไม่ต้องใส่)');
        }
        const fx = isObj(node.effects) ? node.effects : {};
        if (fx.job !== undefined && !occ.includes(fx.job)) r(`${path}.effects.job`, `อาชีพ "${fx.job}" ไม่รู้จัก (${occ.join(' ')})`);
        if (fx.school !== undefined && !SCHOOL_VALUES.includes(fx.school)) r(`${path}.effects.school`, `ต้องเป็น ${SCHOOL_VALUES.join(' ')}`);
      }
      for (const [m, at] of mults) {
        const o = isObj(m) ? m.occupation : undefined;
        if (o !== undefined && (!isObj(o) || Object.entries(o).some(([k, v]) => !occ.includes(k) || !positive(v)))) r(`${at}.occupation`, 'ต้องเป็น {id อาชีพ: เลขบวก}');
      }
      for (const { c, path } of choicesOf(e)) {
        const q = isObj(c.requires) ? c.requires : {};
        if (q.edu !== undefined && !EDU.includes(q.edu)) r(`${path}.requires.edu`, `ต้องเป็น ${EDU.join(' ')}`);
      }
      for (const { c, path } of choicesOf(e)) {
        if (Array.isArray(c.outcomes) && c.outcomes.length && c.outcomes.every((o) => isObj(o) && o.ok === true)) r(`${path}.outcomes`, 'ทุกทางเป็น ok — % สำเร็จจะเป็น 100 เสมอ ไม่ต้องเป็นผลสุ่ม');
      }
    },
  },
  {
    // ผลครอบครัวของตัวเลือก/ผลสุ่ม (B36a · B36a2): เพิ่มสมาชิก · คู่แยกทาง · คนในบ้านจากไป · ความผูกพันขึ้นลง — op ละอย่าง
    id: 'family-ops',
    desc: 'family = [{add: spouse|child|grandchild|peer, n?: 1–3} | {add: pet, kind, life: [จาก, ถึง], name?} | {leave: spouse} | {die: role} | {bond: role|all, d: ±1–30}] — op ละอย่าง',
    event(e, ctx, r) {
      for (const { node, path } of effectSites(e)) {
        if (node.family === undefined) continue;
        if (!Array.isArray(node.family) || !node.family.length) { r(`${path}.family`, 'family ต้องเป็นรายการไม่ว่าง'); continue; }
        node.family.forEach((o, i) => {
          const p = `${path}.family[${i}]`;
          const kinds = ['add', 'leave', 'die', 'bond'].filter((k) => isObj(o) && o[k] !== undefined);
          if (kinds.length !== 1) return r(p, 'ต้องมี add leave die หรือ bond อย่างเดียว');
          if (o.add !== undefined && !['spouse', 'child', 'grandchild', 'pet', 'peer'].includes(o.add)) r(`${p}.add`, 'add ต้องเป็น spouse child grandchild pet peer');
          // สัตว์เลี้ยงไม่มีตารางชีพในข้อมูล — อายุขัยของชนิดต้องมาจากเนื้อหา
          if (o.add === 'pet' && (typeof o.kind !== 'string' || !o.kind || !isRange(o.life, 1, 40))) r(`${p}`, 'add: pet ต้องมี kind (ชนิด) และ life: [จาก, ถึง] ปี 1–40');
          if (o.add !== 'pet' && (o.kind !== undefined || o.life !== undefined || o.name !== undefined)) r(`${p}`, 'kind life name ใช้กับ add: pet เท่านั้น');
          if (o.name !== undefined && (typeof o.name !== 'string' || !o.name)) r(`${p}.name`, 'name ต้องเป็นข้อความ');
          if (o.bond !== undefined && ![...FAMILY_ROLES, 'all'].includes(o.bond)) r(`${p}.bond`, `bond ต้องเป็น ${FAMILY_ROLES.join(' ')} all`);
          if (o.bond !== undefined && (!isInt(o.d) || !o.d || Math.abs(o.d) > 30)) r(`${p}.d`, 'd ใช้กับ bond เป็นจำนวนเต็ม ±1–30');
          if (o.bond === undefined && o.d !== undefined) r(`${p}.d`, 'd ใช้กับ bond เท่านั้น');
          if (o.n !== undefined && (o.add === undefined || !isInt(o.n) || o.n < 1 || o.n > 3)) r(`${p}.n`, 'n ใช้กับ add เป็น 1–3');
          if (o.leave !== undefined && o.leave !== 'spouse') r(`${p}.leave`, 'leave ใช้ได้กับ spouse');
          if (o.die !== undefined && !FAMILY_ROLES.includes(o.die)) r(`${p}.die`, `die ต้องเป็น ${FAMILY_ROLES.join(' ')}`);
        });
      }
    },
  },
  {
    id: 'family-system',
    desc: 'when.family ใช้ role กับ age/alive/count — สุขภาพ/ความสัมพันธ์ของสมาชิกยังไม่มีระบบ ใส่ไปแล้วการ์ดไม่เคยออก · when.loss = {roles?: [spouse|child|grandchild|pet], within?: 0–10}',
    event(e, ctx, r) {
      const fam = isObj(e.when) ? e.when.family : undefined;
      list(fam).forEach((f, i) => {
        if (!isObj(f)) return;
        for (const k of ['health', 'relations']) if (f[k] !== undefined) r(`.when.family[${i}].${k}`, `${k} ของสมาชิกครอบครัวยังไม่มีระบบ`);
      });
      // การ์ดสูญเสีย (B36a2): แกนจดเฉพาะคนในบ้านที่จากไปเอง — พ่อแม่/เพื่อนรุ่นไม่มีสัญญาณนี้ ใส่ไปการ์ดไม่เคยออก
      const loss = isObj(e.when) ? e.when.loss : undefined;
      if (loss === undefined) return;
      const LOSS_ROLES = ['spouse', 'child', 'grandchild', 'pet'];
      if (!isObj(loss) || Object.keys(loss).some((k) => k !== 'roles' && k !== 'within')) return r('.when.loss', 'loss ต้องเป็น {roles?, within?}');
      if (loss.roles !== undefined && !(Array.isArray(loss.roles) && loss.roles.length && loss.roles.every((x) => LOSS_ROLES.includes(x)))) r('.when.loss.roles', `roles ต้องเป็นรายการจาก ${LOSS_ROLES.join(' ')}`);
      if (loss.within !== undefined && !(isInt(loss.within) && loss.within >= 0 && loss.within <= 10)) r('.when.loss.within', 'within ต้องเป็นจำนวนปี 0–10');
    },
  },
];
