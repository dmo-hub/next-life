// กติกาโครงข้อมูล: ฟิลด์บังคับ · ชนิด · key นอกรายการ · ระดับผล · หน่วยเงิน · ช่องแทนค่า
import {
  STAT_KEYS, EFFECT_KEYS, CLASSES, SEXES, STAGE_AGES, STAGE_NAMES, CATEGORIES, PLACEHOLDERS,
  ID_RE, YEAR_MIN, YEAR_MAX, FAMILY_ROLES, MIN_CHOICES,
} from './vocab.mjs';
import { ASSETS } from '../../engine/finance.mjs';
import { isObj, isInt, isRange, list, choicesOf, effectSites, textsOf, placeholdersIn, isLedgerPlaceholder, isMoney } from './util.mjs';

const KEYS = {
  event: ['id', 'type', 'stage', 'years', 'at_age', 'category', 'title', 'text', 'choices', 'when', 'weight', 'multipliers', 'hidden', 'lore_ref', 'fact', 'systems', 'belief'],
  choice: ['id', 'text', 'label', 'effects', 'cost', 'outcomes', 'merit', 'sets_flags', 'clears_flags', 'schedules', 'hidden', 'pair_id', 'intent', 'redeem'],
  outcome: ['weight', 'text', 'effects', 'merit', 'sets_flags', 'schedules'],
  effects: [...EFFECT_KEYS, 'invest'],
  invest: ['asset', 'share'],
  money: ['unit', 'amount', 'ref_year'],
  merit: ['cat', 'level'],
  schedule: ['event', 'after_years'],
  when: ['age', 'year', 'class', 'region', 'sex', 'stats', 'flags', 'family'],
  bound: ['min', 'max'],
  whenFlags: ['has', 'not'],
  family: ['role', 'age', 'alive', 'health', 'relations'],
  multipliers: ['class', 'stats', 'karma', 'family_fame'],
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
  for (const { c, path } of choicesOf(e)) yield ['choice', c, path];
  for (const { node, path } of effectSites(e)) {
    if (path.includes('outcomes')) yield ['outcome', node, path];
    if (isObj(node.effects)) {
      yield ['effects', node.effects, `${path}.effects`];
      if (isObj(node.effects.money)) yield ['money', node.effects.money, `${path}.effects.money`];
      if (isObj(node.effects.invest)) yield ['invest', node.effects.invest, `${path}.effects.invest`];
    }
    if (isObj(node.cost)) yield ['money', node.cost, `${path}.cost`];
    for (const [i, m] of list(node.merit).entries()) if (isObj(m)) yield ['merit', m, `${path}.merit[${i}]`];
    for (const [i, s] of list(node.schedules).entries()) if (isObj(s)) yield ['schedule', s, `${path}.schedules[${i}]`];
  }
}

const bound = (b) => isObj(b) && ['min', 'max'].every((k) => b[k] === undefined || (typeof b[k] === 'number' && b[k] >= 0 && b[k] <= 100)) && !(b.min > b.max);
const nonEmptySubset = (v, of) => Array.isArray(v) && v.length > 0 && v.every((x) => of.includes(x));
const positive = (v) => typeof v === 'number' && Number.isFinite(v) && v > 0;

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
          for (const k of ['health', 'relations']) if (f[k] !== undefined && !bound(f[k])) r(`${p}.${k}`, 'ต้องเป็น {min, max} 0–100');
        });
      }
    },
  },
  {
    id: 'weight-shape',
    desc: 'weight เป็นเลขบวก · multipliers (ฐานะ · ค่าสถานะ · กรรม · ชื่อเสียงตระกูล) เป็นเลขบวก',
    event(e, ctx, r) {
      if (e.weight !== undefined && !positive(e.weight)) r('.weight', 'weight ต้องเป็นเลขบวก');
      const m = e.multipliers;
      if (m === undefined) return;
      if (!isObj(m)) return r('.multipliers', 'multipliers ต้องเป็น object');
      for (const [k, of] of [['class', CLASSES], ['stats', STAT_KEYS]]) {
        if (m[k] === undefined) continue;
        if (!isObj(m[k]) || Object.entries(m[k]).some(([kk, v]) => !of.includes(kk) || !positive(v))) r(`.multipliers.${k}`, `ต้องเป็น {${of.join('|')}: เลขบวก}`);
      }
      for (const k of ['karma', 'family_fame']) if (m[k] !== undefined && !positive(m[k])) r(`.multipliers.${k}`, 'ต้องเป็นเลขบวก');
    },
  },
  {
    id: 'effect-level',
    desc: 'ผลต่อค่าสถานะเป็นระดับจำนวนเต็ม ±1..±3 (ตารางกลางแปลงเป็นตัวเลข) ไม่ใช่ตัวเลขดิบ',
    event(e, ctx, r) {
      for (const { node, path } of effectSites(e)) {
        if (node.effects === undefined) continue;
        if (!isObj(node.effects)) { r(`${path}.effects`, 'effects ต้องเป็น object'); continue; }
        for (const k of STAT_KEYS) {
          const v = node.effects[k];
          if (v !== undefined && !(isInt(v) && v !== 0 && Math.abs(v) <= 3)) r(`${path}.effects.${k}`, `ระดับต้องเป็น ±1..±3 ได้ ${v}`);
        }
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
  },
];
