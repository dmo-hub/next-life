// ด่านการ์ดทวีป content/isekai/*.yaml (06c-2) — รูปเดียวกับการ์ดต่างโลกใน isekai.mjs (t/fx/stat/dc/win/lose) ไม่ใช่รูป events ของโลกหลัก
// ผิดรูปแล้วแกนอ่านค่าครึ่ง ๆ เงียบ (undefined บนปุ่ม · ทอยกับ dc ว่าง · กองไม่เปิดให้ใคร) จึงหยุด build ตั้งแต่โหลด
import { ISEKAI_EVENTS, ISEKAI_YAML, ISEKAI_STAT, ISEKAI_FX, ISEKAI_FOCUS, ISEKAI_STAGES, CONT_DECK, CONT_FILL } from '../../engine/isekai.mjs';
import { CONT_REGIONS, CONT_DISPUTES } from '../../engine/continent.mjs';
import { MERIT_LEVELS } from '../../engine/merit.mjs';
import { OVERLAP_STAGE_MIN } from '../../engine/life.mjs';
import { MERIT_CATS } from './vocab.mjs';
import { isObj, isInt, isRange } from './util.mjs';

export const ISEKAI_RULES = [
  { id: 'isekai-shape', desc: 'ไฟล์เป็น {cards: [...]} · ช่องของการ์ด/ตัวเลือก/ผลอยู่ในรายการ · ch เป็นชั้นของช่วงวัย · ตัวเลือก 2–3 ข้อ' },
  { id: 'isekai-id', desc: 'id ตัวพิมพ์เล็ก/ตัวเลข/_ · ไม่ซ้ำกันและไม่ชนการ์ดใน isekai.mjs' },
  { id: 'isekai-deck', desc: 'ผูกกองได้ช่องเดียว: regions (แคว้นที่มีจริง) · dispute (ข้อพิพาทที่มีจริง) · power (major/falling/rising)' },
  { id: 'isekai-roll', desc: 'ตัวเลือกทอย = stat + dc + win + lose · ไม่ทอย = text · tag เป็นแท็กของโฟกัส · ผลแตะได้แค่ค่าต่างโลก · upgrade = true อยู่ที่ผล (ทอยแล้วอยู่ใน win/lose)' },
  { id: 'isekai-fill', desc: 'ตัวแทนในข้อความมีแค่ {land} {major} {falling} {rising} {dispute}' },
  { id: 'isekai-merit', desc: 'merit = รายการ {cat, level} หมวดที่มีจริง · หมวดกลาง/ธงไม่มี level · หมวดอื่น level 1–3' },
  { id: 'isekai-next', desc: 'next ชี้การ์ด follow ใน yaml · การ์ด follow ต้องมีใครชี้มา (ไม่งั้นไม่มีทางถึง)' },
  { id: 'isekai-overlap', desc: `overlap_stage = [จาก, ถึง] ขั้นค่าซ้อนทับ 0–${OVERLAP_STAGE_MIN.length - 1} จำนวนเต็ม (รูปเดียวกับ when.overlap_stage ฝั่งไทย)` },
];

const CARD_KEYS = ['id', 'ch', 'title', 'text', 'choices', 'minFame', 'adult', 'follow', 'overlap_stage', ...Object.keys(CONT_DECK)];
const CHOICE_KEYS = ['t', 'fx', 'text', 'stat', 'dc', 'tag', 'win', 'lose', 'flag', 'next', 'need', 'merit', 'upgrade'];
const OUT_KEYS = ['fx', 'text', 'flag', 'next', 'upgrade'];
const POWERS = ['major', 'falling', 'rising'];
const CH = new Set(ISEKAI_STAGES.flatMap((s) => s.ch));
const TAGS = new Set(Object.values(ISEKAI_FOCUS).map((f) => f.tag).filter(Boolean));
const ID = /^[a-z][a-z0-9_]*$/;
const FLAG = /^[a-z][a-z0-9_]*$/;
const str = (v) => typeof v === 'string' && v.trim() !== '';

// docs = [{file, doc}] · คืน [{file, id, rule, msg}]
export function lintIsekai(docs) {
  const out = [];
  const jsIds = new Set(ISEKAI_EVENTS.filter((e) => !ISEKAI_YAML.has(e.id)).map((e) => e.id));
  const seen = new Map();
  const cards = [];
  for (const { file, doc } of docs) {
    const bad = (id, rule, msg) => out.push({ file, id, rule, msg });
    if (!isObj(doc) || !Array.isArray(doc.cards) || Object.keys(doc).some((k) => k !== 'cards')) {
      bad('-', 'isekai-shape', 'ไฟล์ต้องเป็น {cards: [...]} ไม่มี key อื่น');
      continue;
    }
    for (const e of doc.cards) {
      const id = isObj(e) && typeof e.id === 'string' ? e.id : '?';
      if (!isObj(e)) { bad(id, 'isekai-shape', 'การ์ดต้องเป็น object'); continue; }
      cards.push({ file, e });
      if (!ID.test(id)) bad(id, 'isekai-id', 'id ต้องเป็นตัวพิมพ์เล็ก/ตัวเลข/_ ขึ้นต้นด้วยตัวอักษร');
      else if (jsIds.has(id)) bad(id, 'isekai-id', 'ชนการ์ดใน isekai.mjs');
      else if (seen.has(id)) bad(id, 'isekai-id', `ซ้ำกับ ${seen.get(id)}`);
      seen.set(id, file);
      for (const k of Object.keys(e)) if (!CARD_KEYS.includes(k)) bad(id, 'isekai-shape', `ช่อง ${k} ไม่อยู่ในรายการ (${CARD_KEYS.join(' ')})`);
      if (!str(e.title) || !str(e.text)) bad(id, 'isekai-shape', 'ต้องมี title และ text');
      if (!Array.isArray(e.ch) || !e.ch.length || !e.ch.every((c) => CH.has(c))) bad(id, 'isekai-shape', `ch ต้องเป็นรายการชั้นของช่วงวัย (${[...CH].join(' ')})`);
      if (e.minFame !== undefined && !(isInt(e.minFame) && e.minFame > 0)) bad(id, 'isekai-shape', 'minFame ต้องเป็นจำนวนเต็มบวก');
      if (e.overlap_stage !== undefined && !isRange(e.overlap_stage, 0, OVERLAP_STAGE_MIN.length - 1)) bad(id, 'isekai-overlap', `overlap_stage ต้องเป็น [จาก, ถึง] ขั้น 0–${OVERLAP_STAGE_MIN.length - 1} จำนวนเต็ม ได้ ${JSON.stringify(e.overlap_stage)}`);
      for (const k of ['adult', 'follow']) if (e[k] !== undefined && e[k] !== true) bad(id, 'isekai-shape', `${k} ใส่ได้แค่ true`);
      if (!Array.isArray(e.choices) || e.choices.length < 2 || e.choices.length > 3) bad(id, 'isekai-shape', 'ตัวเลือก 2–3 ข้อ');

      const decks = Object.keys(CONT_DECK).filter((k) => e[k] !== undefined);
      if (decks.length !== 1) bad(id, 'isekai-deck', `ต้องผูกกองช่องเดียว ได้ ${decks.length} (${Object.keys(CONT_DECK).join(' / ')})`);
      if (e.regions !== undefined && (!Array.isArray(e.regions) || !e.regions.length || !e.regions.every((r) => CONT_REGIONS[r]))) bad(id, 'isekai-deck', `regions ต้องเป็นรายการแคว้นที่มีจริง ได้ ${JSON.stringify(e.regions)}`);
      if (e.dispute !== undefined && !CONT_DISPUTES[e.dispute]) bad(id, 'isekai-deck', `ไม่มีข้อพิพาท ${e.dispute}`);
      if (e.power !== undefined && !POWERS.includes(e.power)) bad(id, 'isekai-deck', `power ต้องเป็น ${POWERS.join('/')}`);

      const texts = [e.title, e.text];
      (Array.isArray(e.choices) ? e.choices : []).forEach((c, i) => {
        const at = `#${i}`;
        if (!isObj(c)) return bad(id, 'isekai-shape', `${at} ต้องเป็น object`);
        for (const k of Object.keys(c)) if (!CHOICE_KEYS.includes(k)) bad(id, 'isekai-shape', `${at} ช่อง ${k} ไม่อยู่ในรายการ`);
        if (!str(c.t)) bad(id, 'isekai-shape', `${at} ต้องมี t (ข้อความบนปุ่ม)`);
        texts.push(c.t);
        const outs = [];
        if (c.stat !== undefined || c.win !== undefined || c.lose !== undefined || c.dc !== undefined) {
          if (!ISEKAI_STAT[c.stat]) bad(id, 'isekai-roll', `${at} stat ต้องเป็น ${Object.keys(ISEKAI_STAT).join('/')}`);
          if (!(isInt(c.dc) && c.dc > 0 && c.dc <= 40)) bad(id, 'isekai-roll', `${at} dc ต้องเป็นจำนวนเต็ม 1–40`);
          if (!isObj(c.win) || !isObj(c.lose)) bad(id, 'isekai-roll', `${at} ทอยต้องมีทั้ง win และ lose`);
          if (c.text !== undefined || c.fx !== undefined || c.flag !== undefined || c.upgrade !== undefined) bad(id, 'isekai-roll', `${at} ทอยแล้วผลอยู่ใน win/lose ไม่ใช่ที่ตัวเลือก`);
          for (const k of ['win', 'lose']) if (isObj(c[k])) outs.push([`${at}.${k}`, c[k]]);
        } else outs.push([at, c]);
        if (c.tag !== undefined && !TAGS.has(c.tag)) bad(id, 'isekai-roll', `${at} tag ${c.tag} ไม่ใช่แท็กโฟกัส (${[...TAGS].join(' ')})`);
        if (c.need !== undefined && !(isObj(c.need) && Object.keys(c.need).join() === 'gold' && isInt(c.need.gold) && c.need.gold > 0)) bad(id, 'isekai-roll', `${at} need ต้องเป็น {gold: จำนวนเต็มบวก}`);
        for (const [p, o] of outs) {
          if (o !== c) for (const k of Object.keys(o)) if (!OUT_KEYS.includes(k)) bad(id, 'isekai-shape', `${p} ช่อง ${k} ไม่อยู่ในรายการ`);
          if (!str(o.text)) bad(id, 'isekai-roll', `${p} ต้องมี text (ผลที่ผู้เล่นเห็น)`);
          texts.push(o.text);
          if (o.fx !== undefined && (!isObj(o.fx) || Object.entries(o.fx).some(([k, v]) => !ISEKAI_FX[k] || typeof v !== 'number' || !Number.isFinite(v)))) bad(id, 'isekai-roll', `${p} fx แตะได้แค่ ${Object.keys(ISEKAI_FX).join(' ')} เป็นตัวเลข`);
          if (o.flag !== undefined && !(typeof o.flag === 'string' && FLAG.test(o.flag))) bad(id, 'isekai-shape', `${p} flag ต้องเป็นตัวพิมพ์เล็ก/_`);
          if (o.upgrade !== undefined && o.upgrade !== true) bad(id, 'isekai-roll', `${p} upgrade ใช้ได้แค่ true`);
          if (o.next !== undefined) cards.at(-1).next = [...(cards.at(-1).next ?? []), [p, o.next]];
        }
        if (c.merit !== undefined) {
          if (!Array.isArray(c.merit) || !c.merit.length) bad(id, 'isekai-merit', `${at} merit ต้องเป็นรายการ`);
          for (const t of Array.isArray(c.merit) ? c.merit : []) {
            const cat = isObj(t) ? MERIT_CATS.find((m) => m.id === t.cat) : null;
            if (!cat) bad(id, 'isekai-merit', `${at} หมวดไม่รู้จัก ${JSON.stringify(t)}`);
            else if (cat.kind === 'neutral' || cat.flag ? t.level !== undefined : !MERIT_LEVELS[t.level]) bad(id, 'isekai-merit', `${at} ระดับ ${t.level} ไม่เข้ากับหมวด ${t.cat}`);
          }
        }
      });
      for (const s of texts) for (const [, k] of (typeof s === 'string' ? s : '').matchAll(/\{([^}]*)\}/g)) if (!CONT_FILL.includes(k)) bad(id, 'isekai-fill', `ตัวแทน {${k}} ไม่มีในกองทวีป`);
    }
  }
  // การ์ดต่อเรื่อง: นัดผ่าน next เท่านั้น (ตัวกรองกองข้าม follow) ⇒ ชี้ผิด = นัดการ์ดที่ไม่มี · follow ไม่มีใครชี้ = ไม่มีทางถึง
  const follow = new Map(cards.filter(({ e }) => e.follow).map(({ file, e }) => [e.id, file]));
  const pointed = new Set();
  for (const { file, e, next = [] } of cards) for (const [p, to] of next) {
    if (!follow.has(to)) out.push({ file, id: e.id, rule: 'isekai-next', msg: `${p} next ${to} ไม่ใช่การ์ด follow ใน yaml` });
    pointed.add(to);
  }
  for (const [id, file] of follow) if (!pointed.has(id)) out.push({ file, id, rule: 'isekai-next', msg: 'การ์ด follow ไม่มี next ชี้มา' });
  return out;
}

export const formatIsekaiProblem = (p) => `${p.file} · ${p.id} · ${p.rule}: ${p.msg}`;
