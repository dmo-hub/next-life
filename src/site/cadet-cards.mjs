// หมวดสายเตรียมทหารในหน้ารวมการ์ด (ui-redo 136): อ่านจาก content/rules/cadet.yaml ตรง ๆ ทุกครั้งที่ build — ฉากใหม่ขึ้นหน้าเองเหมือนหมวดอื่น
// ด้านหน้า = ข้อความกับป้ายตัวเลือกที่ผู้เล่นเห็น · คำใบ้ ผล โอกาส ค่าที่ขยับ อยู่ใน <template> หลังปุ่ม "ดูผล"
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { STAT_LABELS } from '../engine/index.mjs';
import { esc, text, spoilSlot } from './catalog.mjs';
import { sinceTag } from './card-since.mjs';

export const CADET_STAGE = 'สายเตรียมทหาร';
// ขั้นสอบเป็นขั้นตอนของระบบ ไม่ใช่การ์ดตัวเลือก — เล่าไว้ที่หัวหมวดแทน (การ์ดจริงของขั้นสมัครคือใบสมัคร)
const LEAD = 'เส้นทางสายเตรียมทหารของผู้ชาย: ยื่นใบสมัครเลือกเหล่า → สอบข้อเขียน → สอบร่างกาย ว่ายน้ำ ตรวจสุขภาพ → สัมภาษณ์ → ประกาศผล → เลือกเหล่าที่จะเข้า → ถ้าติดเข้าเรียนเตรียมทหาร 2 ปี · ขั้นสอบแต่ละด่านเกมเล่าเป็นฉากสั้นอัตโนมัติ ไม่มีการ์ดให้เลือก จึงไม่ขึ้นเป็นใบ';

export const readCadet = (root = new URL('../../', import.meta.url)) => parse(readFileSync(new URL('content/rules/cadet.yaml', root), 'utf8'));

const sgn = (n) => (n > 0 ? `+${n}` : String(n).replace('-', '−'));
const fxLine = (fx) => {
  const out = Object.entries(fx ?? {})
    .filter(([k, v]) => v && STAT_LABELS[k])
    .map(([k, v]) => `${STAT_LABELS[k]} ${sgn(v)}`);
  return out.length ? `<p class="fx">${out.map(esc).join(' · ')}</p>` : '';
};

// ตัวเลือกในไฟล์มี 2 รูป: label/result (ฉากโรงเรียน) กับ label/hint/outcomes (ใบสมัคร ฉากคั่น ผลสอบ)
function optionBack(o) {
  const outs = o.outcomes ?? [];
  const sum = outs.reduce((s, x) => s + (x.p ?? 0), 0) || 1;
  return [
    `<li><p class="ch">${text(o.label)}</p>`,
    o.hint ? `<p class="ex">คำใบ้บนปุ่ม: ${text(o.hint)}</p>` : '',
    o.note ? `<p class="ex">${text(o.note)}</p>` : '',
    fxLine(o.fx),
    o.result ? `<p>${text(o.result)}</p>` : '',
    outs.length ? `<ol class="out">${outs.map((x) => `<li><p><b class="pct">${((x.p / sum) * 100).toFixed(2)}%</b> ${text(x.result ?? '')}</p>${fxLine(x.fx)}</li>`).join('')}</ol>` : '',
    '</li>',
  ].join('');
}

// ปุ่มที่โผล่เฉพาะบางชีวิต (มาคนเดียว) ติดป้ายไว้ที่ด้านหน้าด้วย ไม่งั้นอ่านแล้วเห็นตัวเลือกซ้ำกัน
const gated = (o) => o.show_if || o.hide_if;
const frontOpts = (opts) => (opts.length ? `<ul>${opts.map((o) => `<li>${text(o.label)}${gated(o) ? ' <small>(เฉพาะบางชีวิต)</small>' : ''}</li>`).join('')}</ul>` : '<p class="none">การ์ดเล่าเรื่อง ไม่มีตัวเลือก</p>');

function card(c) {
  const alts = (c.textBy ?? []).map((x) => `<p class="when">ข้อความอีกแบบ: ${text(x.text)}</p>`).join('');
  const back = `${alts}${c.back ?? ''}${c.options.length ? `<ol class="chs">${c.options.map(optionBack).join('')}</ol>` : ''}`;
  return [
    `<article class="k c" id="${esc(c.id)}">`,
    `<h4>${text(c.title)}</h4>`,
    sinceTag(c.id),
    '<div class="sp-front">',
    c.tag ? `<p class="tags"><span>${esc(c.tag)}</span></p>` : '',
    `<p>${text(c.text)}</p>`,
    frontOpts(c.options),
    '</div>',
    spoilSlot(c.id, back || '<p class="none">ไม่มีผลเพิ่ม</p>'),
    '</article>',
  ].join('');
}

// ฉากโรงเรียนอยู่ปีไหน = ช่องใน school.order/pools ของปีนั้น + ฉากที่ต่อท้ายผ่าน next (SB-N8b · N9-2a ฯลฯ)
export function schoolYears(school) {
  // next · nextCaught — ทุกคีย์ที่ขึ้นต้น next ชี้ฉากถัดไป (ทางถูกจับที่ช่องรั้วมีฉากของตัวเอง)
  const nexts = (x) => Object.entries(x).filter(([k, v]) => k.startsWith('next') && Array.isArray(v)).flatMap(([, v]) => v);
  const nextOf = (s) => [...nexts(s), ...(s.options ?? []).flatMap(nexts)];
  const seed = (order, pools) => [...order.filter((x) => !/^[@#]/.test(x)), ...pools.flatMap((p) => school.pools[p] ?? [])];
  const grow = (ids) => {
    const seen = new Set(ids);
    for (const id of seen) for (const n of nextOf(school.scenes[id] ?? {})) seen.add(n);
    return seen;
  };
  const poolsOf = (order) => order.filter((x) => x.startsWith('@')).map((x) => x.slice(1));
  const y1 = grow(seed(school.order.year1, poolsOf(school.order.year1)));
  const y2 = grow(seed(school.order.year2, poolsOf(school.order.year2)));
  return { y1: Object.keys(school.scenes).filter((id) => y1.has(id)), y2: Object.keys(school.scenes).filter((id) => y2.has(id) && !y1.has(id)) };
}

// กลุ่มเรียงตามลำดับที่ผู้เล่นเจอ · หัวย่อยละกลุ่ม
export function cadetGroups(cadet) {
  const { y1, y2 } = schoolYears(cadet.school);
  const scene = (id) => ({ id, ...cadet.school.scenes[id], options: cadet.school.scenes[id].options ?? [] });
  const plain = (e, tag) => ({ id: e.id, title: e.title ?? e.id, text: e.text, options: e.options ?? (e.toggles ?? []).map((t) => ({ label: t.label, hint: t.hint, fx: t.fx })), tag });
  const iq = cadet.interviewQs.map((q, i) => ({
    id: `IQ${i + 1}`,
    title: `คำถามสัมภาษณ์ข้อ ${i + 1}`,
    text: q.q,
    options: q.a.map(([label, score]) => ({ label, note: `คะแนนกรรมการ ${score} จาก 5` })),
  }));
  const funny = cadet.interviewFunny.map((f, i) => ({
    id: `IQ-funny${i ? i + 1 : ''}`,
    title: 'คำถามสัมภาษณ์ของจ่า',
    text: f.text,
    options: f.a.map(([label, result]) => ({ label, result })),
  }));
  return [
    { key: 'apply', title: 'สมัคร/สอบ', cards: cadet.apply.map((e) => plain(e)) },
    { key: 'interlude', title: 'ฉากคั่นระหว่างสอบ', cards: cadet.interludes.map((e) => plain(e)) },
    { key: 'interview', title: 'สัมภาษณ์', cards: [...iq, ...funny] },
    { key: 'result', title: 'ผลสอบ', cards: [...cadet.passed, ...cadet.failed].map((e) => plain(e)) },
    { key: 'y1', title: 'โรงเรียนปี 1', cards: y1.map(scene) },
    { key: 'y2', title: 'โรงเรียนปี 2', cards: y2.map(scene) },
  ];
}

// รหัสการ์ดทุกใบของหมวดนี้ — ด่านนับจำนวนเทียบไฟล์ · card-since ลงทะเบียนเฉพาะฉากโรงเรียน (SB-/N9-)
export const cadetIds = (cadet) => cadetGroups(cadet).flatMap((g) => g.cards.map((c) => c.id));
export const cadetSchoolIds = (cadet) => Object.keys(cadet.school.scenes);

export function cadetHtml(cadet, id = 'cadet') {
  const groups = cadetGroups(cadet);
  const n = groups.reduce((s, g) => s + g.cards.length, 0);
  const body = groups.map((g) => `<h3>${esc(g.title)} <small>${g.cards.length} ใบ</small></h3><div class="grid">${g.cards.map(card).join('')}</div>`).join('');
  return `<!--cadet:start--><details id="${id}" data-st="${CADET_STAGE}"><summary>${CADET_STAGE} <small>${n} ใบ</small></summary><p class="lead">${esc(LEAD)}</p>${body}</details><!--cadet:end-->`;
}
export const cadetNav = (cadet, id = 'cadet') => `<a href="#${id}">${CADET_STAGE} <small>${cadetIds(cadet).length}</small></a>`;
