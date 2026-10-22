// กติกาส่วนต่อ belief ของใบ 12 ด่าน build ข้อ (ก)–(ช) · (ช) คำต้องห้ามอยู่ใน banned.yaml
import { BELIEF_KINDS, TRADITIONS, OUTSIDE_CANON, INTENTS, REDEEM, BELIEF_EFFECTS, LOTTERY, VOW_LIGHT_MAX, YEAR_MIN, YEAR_MAX, meritCat } from './vocab.mjs';
import { isObj, isInt, isRange, list, choicesOf, effectSites, textsOf, placeholdersIn, isLedgerPlaceholder, same, strings } from './util.mjs';

const beliefOf = (e) => (isObj(e.belief) ? e.belief : null);
const kindOf = (e) => beliefOf(e)?.kind;
const lottery = (e) => kindOf(e) === 'lottery_numen';
const odds = (e) => (isObj(e.belief?.odds_modifier) ? e.belief.odds_modifier : {});
const lotteryRule = (id, desc, check) => ({ id, desc, event(e, ctx, r) { if (lottery(e)) check(e, r); } });

// กลไกนอกคัมภีร์ที่เหตุการณ์นี้ใช้จริง — ต้องประกาศใน outside_canon
function mechanisms(e) {
  const need = new Set();
  if (lottery(e)) need.add('odds_by_merit');
  if (kindOf(e) === 'vow' || effectSites(e).some(({ node }) => list(node.merit).some((m) => meritCat(m?.cat)?.id === 'vow_broken'))) need.add('vow_broken');
  if (choicesOf(e).some(({ c }) => c.intent === 'wish_for_gain')) need.add('intent_merit');
  return need;
}

export const rules = [
  {
    id: 'belief-shape',
    desc: `(ก) belief ต้องมี kind (${BELIEF_KINDS.join(' ')}) และ tradition (${TRADITIONS.join(' ')})`,
    event(e, ctx, r) {
      if (e.belief === undefined) return;
      const b = beliefOf(e);
      if (!b) return r('.belief', 'belief ต้องเป็น object');
      if (!BELIEF_KINDS.includes(b.kind)) r('.belief.kind', `kind ต้องเป็นหนึ่งใน ${BELIEF_KINDS.join(' ')}`);
      if (!TRADITIONS.includes(b.tradition)) r('.belief.tradition', `tradition ต้องเป็นหนึ่งใน ${TRADITIONS.join(' ')}`);
    },
  },
  {
    id: 'belief-category',
    desc: 'มี belief ⇔ category: belief',
    event(e, ctx, r) {
      if ((e.belief !== undefined) !== (e.category === 'belief')) r('.category', 'เหตุการณ์ที่มี belief ต้องเป็น category: belief และกลับกัน');
    },
  },
  {
    id: 'outside-canon',
    desc: `(ก) ใช้กลไกนอกคัมภีร์ต้องประกาศใน belief.outside_canon (${OUTSIDE_CANON.join(' ')}) · ห้ามประกาศค่านอกรายการ`,
    event(e, ctx, r) {
      const need = mechanisms(e);
      const b = beliefOf(e);
      if (!b) {
        for (const m of need) r('', `ใช้กลไกนอกคัมภีร์ ${m} แต่ไม่มี belief.outside_canon กำกับ`);
        return;
      }
      const have = list(b.outside_canon);
      for (const m of have) if (!OUTSIDE_CANON.includes(m)) r('.belief.outside_canon', `ไม่รู้จักกลไก "${m}"`);
      for (const m of need) if (!have.includes(m)) r('.belief.outside_canon', `ใช้กลไก ${m} แต่ไม่ได้ประกาศ`);
    },
  },
  {
    id: 'belief-effects',
    desc: '(ข) สายมู (ยกเว้น lottery_numen) ให้ผลได้แค่ ความสุข · ความสัมพันธ์ · เงินจ่ายออก · ธง · ป้ายบุญ — ห้ามแตะสุขภาพ ความรู้ หรือได้เงินเข้า',
    event(e, ctx, r) {
      if (!beliefOf(e) || lottery(e)) return;
      for (const { node, path } of effectSites(e)) {
        if (!isObj(node.effects)) continue;
        for (const k of Object.keys(node.effects)) if (!BELIEF_EFFECTS.includes(k)) r(`${path}.effects.${k}`, `สายมูห้ามมีผลต่อ ${k}`);
        if (node.effects.money?.amount > 0) r(`${path}.effects.money`, 'สายมูห้ามมีเงินเข้า (จ่ายออกเท่านั้น)');
      }
    },
  },
  lotteryRule('lottery-trigger', '(ค) หวยสายมูเกิดเฉพาะตอนเงินตึง: trigger.money_state = tight', (e, r) => {
    if (e.belief.trigger?.money_state !== 'tight') r('.belief.trigger', 'ต้องเป็น {money_state: tight}');
  }),
  lotteryRule('lottery-cap', `(ค) cap_per_life เป็นจำนวนเต็ม 1–${LOTTERY.cap}`, (e, r) => {
    const c = e.belief.cap_per_life;
    if (!(isInt(c) && c >= 1 && c <= LOTTERY.cap)) r('.belief.cap_per_life', `ต้องเป็น 1–${LOTTERY.cap} ได้ ${c}`);
  }),
  lotteryRule('lottery-prize-table', `(ค) prize_table ชี้ตารางใบ 11 (${LOTTERY.prizeTable}) ห้ามสร้างตารางใหม่ · ต้องมี stake`, (e, r) => {
    if (e.belief.prize_table !== LOTTERY.prizeTable) r('.belief.prize_table', `ต้องเป็น ${LOTTERY.prizeTable}`);
    if (e.belief.stake === undefined) r('.belief', 'ขาด stake (ราคาใบ)');
  }),
  lotteryRule('lottery-max-mult', `(ค) odds_modifier.max_mult เป็นตัวเลข 1–${LOTTERY.maxMult}`, (e, r) => {
    const m = odds(e).max_mult;
    if (!(typeof m === 'number' && m >= 1 && m <= LOTTERY.maxMult)) r('.belief.odds_modifier.max_mult', `ต้องไม่เกิน ${LOTTERY.maxMult} ได้ ${m}`);
  }),
  lotteryRule('lottery-scope', '(ค) prize_scope = small เท่านั้น (ห้ามคูณรางวัลที่ 1/ข้างเคียง/ที่ 2–5)', (e, r) => {
    if (odds(e).prize_scope !== 'small') r('.belief.odds_modifier.prize_scope', 'ต้องเป็น small');
  }),
  lotteryRule('lottery-direction', '(ค) direction = up_only และ formula = mult_up_only (ห้าม m < 1)', (e, r) => {
    if (odds(e).direction !== 'up_only' || odds(e).formula !== 'mult_up_only') r('.belief.odds_modifier', 'ต้องเป็น direction: up_only · formula: mult_up_only');
  }),
  lotteryRule('lottery-odds', '(ค) odds_modifier อ่าน merit_ledger.net และมี ref_scale', (e, r) => {
    const o = odds(e);
    if (o.source !== 'merit_ledger.net' || typeof o.ref_scale !== 'string') r('.belief.odds_modifier', 'ต้องมี source: merit_ledger.net และ ref_scale');
  }),
  {
    id: 'ledger-read',
    desc: '(ค) เฉพาะ lottery_numen อ่านบัญชีบุญบาป (merit_ledger / odds_modifier / prize_table) ได้',
    event(e, ctx, r) {
      if (lottery(e)) return;
      const b = beliefOf(e) ?? {};
      for (const k of ['odds_modifier', 'prize_table', 'cap_per_life', 'stake', 'trigger']) if (b[k] !== undefined) r(`.belief.${k}`, `${k} ใช้ได้เฉพาะ lottery_numen`);
      for (const { path, s } of strings(e)) if (/merit_ledger/.test(s)) r(path, 'อ่าน merit_ledger ได้เฉพาะ lottery_numen');
    },
  },
  {
    id: 'ledger-text',
    desc: '(ฉ) ข้อความห้ามมีช่องที่อ่านบัญชีบุญบาป/ตัวคูณ (เช่น {บุญ} {บัญชี} {m})',
    event(e, ctx, r) {
      for (const { path, s } of textsOf(e)) for (const k of placeholdersIn(s)) if (isLedgerPlaceholder(k)) r(path, `ช่อง {${k}} อ่านค่าบัญชีที่ต้องซ่อน`);
    },
  },
  lotteryRule('lottery-prize-text', `(ค) หวยสายมูที่เกิดได้ก่อนปี ${LOTTERY.prizeTextBefore} ห้ามระบุมูลค่ารางวัลเป็นตัวเลข`, (e, r) => {
    if (!isRange(e.years, YEAR_MIN, YEAR_MAX) || e.years[0] >= LOTTERY.prizeTextBefore) return;
    for (const { path, s } of textsOf(e)) if (/[0-9๐-๙][0-9๐-๙,]*\s*(บาท|ล้าน|แสน|หมื่น)/.test(s)) r(path, 'มีมูลค่าเป็นตัวเลขในเหตุการณ์ที่เกิดได้ก่อนปี 2560');
  }),
  {
    id: 'pair-match',
    desc: '(ง) คู่ pair_id: 2 ตัวเลือก intent sincere + wish_for_gain · ต้นทุนเท่ากัน · ป้ายที่เห็นเหมือนกัน · ทาน wish = max(1, sincere − 1)',
    event(e, ctx, r) {
      const pairs = new Map();
      for (const { c, path } of choicesOf(e)) {
        if (c.intent !== undefined && (!INTENTS.includes(c.intent) || c.pair_id === undefined)) r(`${path}.intent`, 'intent ต้องเป็น sincere/wish_for_gain และมี pair_id');
        if (c.pair_id !== undefined) pairs.set(c.pair_id, [...(pairs.get(c.pair_id) ?? []), { c, path }]);
      }
      for (const [id, xs] of pairs) {
        const s = xs.find((x) => x.c.intent === 'sincere'), w = xs.find((x) => x.c.intent === 'wish_for_gain');
        if (xs.length !== 2 || !s || !w) { r(xs[0].path, `คู่ ${id} ต้องมี 2 ตัวเลือก sincere + wish_for_gain`); continue; }
        if (!same(s.c.cost, w.c.cost) || !same(s.c.effects?.money, w.c.effects?.money)) r(w.path, `คู่ ${id} ต้นทุนไม่เท่ากัน`);
        const visible = (c) => ({ effects: c.effects ?? {}, hidden: c.hidden ?? [], random: c.outcomes !== undefined });
        if (!same(visible(s.c), visible(w.c))) r(w.path, `คู่ ${id} ป้ายที่ผู้เล่นเห็นไม่เหมือนกัน`);
        const lv = (c) => list(c.merit).find((m) => meritCat(m?.cat)?.id === 'dana')?.level;
        if (lv(s.c) !== undefined && lv(w.c) !== Math.max(1, lv(s.c) - 1)) r(`${w.path}.merit`, `คู่ ${id} ทานของ wish ต้องเป็น ${Math.max(1, lv(s.c) - 1)}`);
      }
    },
  },
  {
    id: 'vow-light',
    desc: `(จ) บนบานต้องมี belief.vow · redeem_light_cost เป็น income_x ≤ ${VOW_LIGHT_MAX} · due_event มีจริงและมีตัวเลือก redeem: light ต้นทุนตรงกัน · ทุกการ์ดที่มี redeem ต้องมีแบบ light`,
    all(events, ctx, r) {
      const byId = new Map(events.map((x) => [x.e.id, x]));
      for (const x of events) {
        const { e } = x;
        const redeems = choicesOf(e).filter(({ c }) => c.redeem !== undefined);
        for (const { c, path } of redeems) if (!REDEEM.includes(c.redeem)) r(x, `${path}.redeem`, `redeem ต้องเป็น ${REDEEM.join(' ')}`);
        if (redeems.length && !redeems.some(({ c }) => c.redeem === 'light')) r(x, '', 'การ์ดแก้บนต้องมีตัวเลือก redeem: light (แก้ตามกำลัง)');
        if (kindOf(e) !== 'vow' || redeems.length) continue;
        const v = beliefOf(e).vow;
        if (!isObj(v)) { r(x, '.belief', 'บนบานต้องมี belief.vow'); continue; }
        const light = v.redeem_light_cost;
        if (!(light?.unit === 'income_x' && light.amount > 0 && light.amount <= VOW_LIGHT_MAX)) r(x, '.belief.vow.redeem_light_cost', `ต้องเป็น {unit: income_x, amount ≤ ${VOW_LIGHT_MAX}}`);
        if (!isRange(v.deadline_years, 1, 100)) r(x, '.belief.vow.deadline_years', 'ต้องเป็น [จาก, ถึง] 1–100');
        const due = byId.get(v.due_event);
        if (!due) { r(x, '.belief.vow.due_event', `ไม่มีเหตุการณ์ "${v.due_event}"`); continue; }
        const lc = choicesOf(due.e).find(({ c }) => c.redeem === 'light');
        if (lc && !same(lc.c.cost, light)) r(due, `${lc.path}.cost`, `ต้นทุนแก้ตามกำลังต้องตรงกับ ${e.id}.belief.vow.redeem_light_cost`);
      }
    },
  },
];
