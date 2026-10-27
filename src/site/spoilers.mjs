// หน้าเฉลยการ์ด (B88): สร้างจาก content ทุกครั้งที่ build — ทุกตัวเลือก ทุกผลสุ่ม ค่าที่ขยับ เงิน บุญบาป และเงื่อนไขที่การ์ดออก
// ข้อยกเว้นกติกา "ไม่เผยบุญบาป" เจ้าของเคาะเฉพาะหน้านี้ — ในเกมยังห้ามเหมือนเดิม และหน้ารวมการ์ด (catalog.mjs) ยังไม่เฉลย
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { STAGES, STAT_LABELS, MERIT_LEVELS, MERIT_WEIGHTS, SIN_CATS, FLAG_CATS, TRACKS, REALMS, FAMILY_ROLE_NAMES, meritId, meritName, debtName, assetName, EXAM_PASS } from '../engine/index.mjs';
import { AFTER, CATEGORY, esc, text, choiceText } from './catalog.mjs';
import { isekaiSpoilersHtml, isekaiNav } from './otherworld.mjs';

const YEAR_ALL = [2400, 2700];
const sgn = (n) => (n > 0 ? `+${n}` : String(n).replace('-', '−'));
const num = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });
const list = (xs) => xs.join(', ');
// ค่าใดค่าหนึ่งก็ผ่าน — คั่นด้วย "หรือ" ไม่ให้ปนกับ · ที่คั่นเงื่อนไขซึ่งต้องผ่านทุกข้อ
const any = (xs) => xs.join(' หรือ ');
const range = ([a, b], unit = '') => (a === b ? `${a}${unit}` : `${a}–${b}${unit}`);

// ชื่อธงอ่านจากทะเบียนธงชุดเดียวกับด่าน lint · ธงมีพารามิเตอร์ (vow_open:xxx) ใช้คำอธิบายของชื่อหน้า
export function flagNames(root = new URL('../../', import.meta.url)) {
  const doc = parse(readFileSync(new URL('content/rules/flags.yaml', root), 'utf8'));
  return { ...doc.flags, ...Object.fromEntries(Object.entries(doc.prefixes ?? {}).map(([k, v]) => [`${k}:`, v])) };
}

// ชื่อระบบอยู่ในไฟล์ข้อมูลแต่ loader ไม่ส่งต่อให้แกน (แกนใช้แค่ปีเริ่ม) — อ่านไฟล์เดียวกันตรง ๆ
export function systemNames(root = new URL('../../', import.meta.url)) {
  return Object.fromEntries(JSON.parse(readFileSync(new URL('data/system-starts.json', root), 'utf8')).systems.map((s) => [s.id, s.name]));
}

// ธงที่แกนตั้งเองไม่อยู่ในทะเบียนธงของเนื้อหา
const ENGINE_FLAGS = { [EXAM_PASS]: `สอบติด${TRACKS.uni.name}` };
// ค่า redeem ตาม REDEEM ของด่าน lint · light = แก้ตามกำลัง (ด่านบังคับให้ทุกการ์ดแก้บนมี)
const REDEEM_TH = { full: 'แก้ครบตามที่บน', light: 'แก้ตามกำลัง', defer: 'ผัดไว้ก่อน', none: 'ไม่แก้' };

function labels(content, flags, systems) {
  const occ = Object.fromEntries(content.era.finance.occupations.map((o) => [o.id, o.name]));
  const era = Object.fromEntries(content.era.events.map((e) => [e.id, e.name]));
  const from = Object.fromEntries(content.era.systems.map((s) => [s.id, s.from]));
  // id หลัง : แยกบนบาน/เครื่องรางแต่ละเรื่อง ผู้อ่านไม่ต้องรู้ — เก็บไว้ใน title ให้ชี้ตัวได้
  const flag = (f) => {
    const [head, id] = f.split(':');
    const name = ENGINE_FLAGS[f] ?? (id ? flags[`${head}:`] : flags[f]);
    return `<span class="fl" title="${esc(f)}">${esc(name ?? f)}</span>`;
  };
  const sys = (id) => `${esc(systems[id] ?? id)}${from[id] ? ` (พ.ศ. ${from[id]})` : ''}`;
  return { occ: (id) => occ[id] ?? id, era: (id) => era[id] ?? id, sys, flag };
}

// เงินในผล: ตัวเลขเปล่า = บาทของปีนั้น · income_x = เท่าของเงินเก็บต่อปี · fixed_baht = บาทของปีอ้างอิง ปรับตามเงินเฟ้อ (moneyValue ในแกน)
function money(m) {
  if (typeof m === 'number') return `เงิน ${sgn(num(m))} บาท`;
  if (m.unit === 'income_x') return `เงิน ${sgn(num(m.amount))} เท่าของเงินเก็บต่อปี`;
  if (m.unit === 'fixed_baht') return `เงิน ${sgn(num(m.amount))} บาท (ค่าเงินปี ${m.ref_year} ปรับตามเงินเฟ้อ)`;
  return `เงิน ${esc(JSON.stringify(m))}`;
}
const moneyAmount = (m) => (typeof m === 'number' ? `${num(m)} บาท` : m.unit === 'income_x' ? `${num(m.amount)} เท่าของเงินเก็บต่อปี` : `${num(m.amount)} บาท (ค่าเงินปี ${m.ref_year})`);

function family(f, L) {
  const who = FAMILY_ROLE_NAMES[f.add ?? f.bond ?? f.die ?? f.leave] ?? f.add ?? f.bond ?? f.die ?? f.leave;
  if (f.add) return f.n ? `มี${who}เพิ่ม ${f.n} คน` : `ได้${who}: ${esc(f.kind ?? '')}${f.life ? ` (อายุขัย ${range(f.life, ' ปี')})` : ''}`;
  if (f.bond) return `ความผูกพันกับ${who} ${sgn(f.d)}`;
  if (f.die) return `${who}ตาย`;
  if (f.leave) return `${who}จากไป`;
  return esc(JSON.stringify(f));
}

function effects(fx, L) {
  if (!fx) return [];
  const out = [];
  for (const k of Object.keys(STAT_LABELS)) if (k !== 'money' && fx[k] !== undefined) out.push(`${STAT_LABELS[k]} ${sgn(fx[k])}`);
  if (fx.money !== undefined) out.push(money(fx.money));
  if (fx.income_mult) out.push(`รายได้ ×${fx.income_mult}`);
  for (const [k, v] of Object.entries(fx.chronic ?? {})) out.push(`${STAT_LABELS[k]} ${sgn(v)} ระยะยาว`);
  if (fx.job) out.push(`ได้งาน${L.occ(fx.job)}`);
  if (fx.debt) out.push(`กู้${debtName(fx.debt.kind)} ${moneyAmount(fx.debt.amount)}`);
  if (fx.settle) out.push(`ปิด${debtName(fx.settle)}`);
  if (fx.invest) out.push(`ลงทุน${assetName(fx.invest.asset)} ${Math.round(fx.invest.share * 100)}% ของเงินเก็บ`);
  if (fx.complain) out.push('ร้องเรียนดอกโหด');
  return out.map(esc);
}

// บุญบาปเป็นแต้มที่ลงบัญชีจริง = น้ำหนักหมวด × น้ำหนักระดับ (merit.mjs) · หมวดที่เป็นธง (บนแล้วไม่แก้) ไม่มีระดับ ลงทั้งก้อนครั้งเดียว
function merit(tags) {
  return (tags ?? [])
    .map((t) => ({ id: meritId(t.cat), level: t.level }))
    .filter((t) => t.id !== 'neutral')
    .map(({ id, level }) => {
      const bad = SIN_CATS.includes(id);
      const pts = FLAG_CATS.includes(id) ? MERIT_WEIGHTS[id] : MERIT_WEIGHTS[id] * MERIT_LEVELS[level];
      return `<span class="m ${bad ? 'sin' : 'good'}">${bad ? 'บาป' : 'บุญ'} ${esc(meritName(id))}${FLAG_CATS.includes(id) ? '' : ` ระดับ ${level}`} (${bad ? '−' : '+'}${num(pts)})</span>`;
    });
}

function flagsLine(node, L) {
  const out = [];
  if (node.sets_flags?.length) out.push(`ติดตัว: ${list(node.sets_flags.map(L.flag))}`);
  if (node.clears_flags?.length) out.push(`หายไป: ${list(node.clears_flags.map(L.flag))}`);
  return out;
}

function mults(m, L) {
  if (!m) return [];
  const out = [];
  for (const [f, v] of Object.entries(m.flags ?? {})) out.push(`×${v} ถ้า${L.flag(f)}`);
  for (const [k, v] of Object.entries(m.stats ?? {})) out.push(`×${v} เมื่อ${STAT_LABELS[k]}สูง (÷${v} เมื่อต่ำ)`);
  for (const [o, v] of Object.entries(m.occupation ?? {})) out.push(`×${v} ถ้าทำงาน${esc(L.occ(o))}`);
  for (const [c, v] of Object.entries(m.class ?? {})) out.push(`×${v} ถ้าฐานะ${esc(c)}`);
  if (m.karma) out.push(`×${m.karma} เมื่อบุญมากกว่าบาป (÷${m.karma} เมื่อบาปมากกว่า)`);
  if (m.wish) out.push(`ยกกำลังตามระดับบัญชีบุญบาป (ฐาน ${m.wish})`);
  return out;
}

function flagCond(f, L) {
  const out = [];
  for (const x of f?.has ?? []) out.push(`มี ${L.flag(x)}`);
  for (const x of f?.not ?? []) out.push(`ไม่มี ${L.flag(x)}`);
  return out;
}

function famCond(f) {
  const who = FAMILY_ROLE_NAMES[f.role] ?? f.role;
  const alive = f.alive === undefined ? '' : f.alive ? 'ที่ยังอยู่' : 'ที่จากไปแล้ว';
  if (f.count) return f.count[1] === 0 ? `ไม่มี${who}${alive}` : `มี${who}${alive} ${range(f.count, ' คน')}`;
  return `มี${who}${alive}`;
}

function bound(k, b) {
  const name = STAT_LABELS[k] ?? k;
  return [b.min !== undefined ? `${name} ≥ ${b.min}` : '', b.max !== undefined ? `${name} ≤ ${b.max}` : ''].filter(Boolean).join(' และ ');
}

function conditions(e, L) {
  const w = e.when ?? {};
  const out = [];
  if (e.age !== undefined) out.push(`เมื่ออายุ ${e.age} ปี`);
  if (w.age) out.push(`อายุ ${range(w.age, ' ปี')}`);
  if (e.years && (e.years[0] !== YEAR_ALL[0] || e.years[1] !== YEAR_ALL[1])) out.push(`พ.ศ. ${range(e.years)}`);
  if (w.year) out.push(`พ.ศ. ${range(w.year)}`);
  if (e.era) out.push(`ช่วง${esc(L.era(e.era))}`);
  for (const s of e.systems ?? []) out.push(`หลังมี${L.sys(s)}`);
  if (w.region) out.push(`ภาค${any(w.region.map(esc))}`);
  if (w.sex) out.push(`เพศ${any(w.sex.map(esc))}`);
  if (w.class) out.push(`ฐานะ${any(w.class.map(esc))}`);
  if (w.occupation) out.push(`ทำงาน${any(w.occupation.map((o) => esc(L.occ(o))))}`);
  if (w.school) out.push(`เรียน${any(w.school.map((s) => esc(TRACKS[s]?.name ?? (s === 'none' ? 'ไม่ได้เรียน' : s))))}`);
  for (const [k, b] of Object.entries(w.stats ?? {})) out.push(bound(k, b));
  for (const f of w.family ?? []) out.push(famCond(f));
  if (w.loss) out.push(`เพิ่งเสีย${any(w.loss.roles.map((r) => FAMILY_ROLE_NAMES[r] ?? r))}${w.loss.within ? ` ภายใน ${w.loss.within} ปี` : 'ปีนี้'}`);
  out.push(...flagCond(w.flags, L));
  if (e.realm) out.push(`ไป${any(e.realm.map((r) => REALMS.find((x) => x.id === r)?.name ?? r))}`);
  if (e.repeat) out.push(`ออกซ้ำได้ ${e.repeat.max} ครั้ง เว้น ${e.repeat.gap} ปี`);
  if (e.weight !== undefined) out.push(`น้ำหนักในกองสุ่ม ${e.weight}`);
  return out;
}

function locks(q, L) {
  if (!q) return [];
  const out = [];
  if (q.money) out.push(`ต้องมีเงิน ${moneyAmount(q.money)}`);
  for (const [k, b] of Object.entries(q.stats ?? {})) out.push(bound(k, b));
  if (q.age) out.push(`อายุ${q.age.min !== undefined ? ` ≥ ${q.age.min}` : ''}${q.age.max !== undefined ? ` ≤ ${q.age.max}` : ''}`);
  if (q.edu) out.push(`จบ${esc(Array.isArray(q.edu) ? q.edu.join(' หรือ ') : q.edu)}`);
  for (const f of q.family ?? []) out.push(famCond(f));
  out.push(...flagCond(q.flags, L));
  return [`เลือกได้เมื่อ ${out.join(' · ')}${q.reason ? ` · ไม่ผ่านจอบอก "${esc(q.reason)}"` : ''}`];
}

// การ์ดที่ถูกนัด/ต่อเรื่องบางใบไม่มีชื่อ — ใช้ต้นข้อความแทน และลิงก์ไปการ์ดนั้นบนหน้าเดียวกัน
function cardRef(id, byId) {
  const e = byId.get(id);
  const name = e?.title ?? (e ? `${[...e.text].slice(0, 24).join('')}…` : id);
  return e ? `<a href="#${esc(id)}">${text(name)}</a>` : esc(name);
}

function extras(node, L, byId) {
  const out = [...flagsLine(node, L)];
  for (const f of node.family ?? []) out.push(family(f, L));
  for (const s of node.schedules ?? []) out.push(`นัดการ์ด ${cardRef(s.event, byId)} อีก ${range(s.after_years, ' ปี')}`);
  if (node.next) out.push(`ต่อด้วยการ์ด ${cardRef(node.next, byId)}`);
  if (node.redeem) out.push(`แก้บน: ${REDEEM_TH[node.redeem] ?? esc(node.redeem)}`);
  if (node.intent) out.push(`เจตนา: ${node.intent === 'sincere' ? 'ทำด้วยใจ' : 'หวังผลตอบแทน'}`);
  return out;
}

const line = (cls, xs) => (xs.length ? `<p class="${cls}">${xs.join(' · ')}</p>` : '');

function outcomesHtml(c, L, byId) {
  const os = c.outcomes ?? [];
  if (!os.length) return '';
  const sum = os.reduce((s, o) => s + o.weight, 0);
  return `<ol class="out">${os
    .map((o) => {
      const pct = ((o.weight / sum) * 100).toFixed(2);
      return [
        `<li><p><b class="pct">${pct}%</b>${o.ok ? ' <span class="ok">สำเร็จ</span>' : ''} ${text(o.text)}</p>`,
        line('fx', [...effects(o.effects, L), ...merit(o.merit)]),
        line('mul', mults(o.multipliers, L)),
        line('ex', extras(o, L, byId)),
        '</li>',
      ].join('');
    })
    .join('')}</ol>`;
}

function card(e, L, byId) {
  const tags = [e.era ? 'บ้านเมือง' : CATEGORY[e.category], e.belief ? 'ความเชื่อ' : null].filter((t, i, a) => t && a.indexOf(t) === i);
  const choices = e.choices
    .map((c) => {
      const all = merit(c.merit);
      return [
        `<li><p class="ch">${text(choiceText(c))}${c.hidden ? ' <small>(ซ่อนบนจอ)</small>' : ''}</p>`,
        line('lock', locks(c.requires, L)),
        line('fx', [...effects(c.effects, L), ...all]),
        !all.length && !(c.outcomes ?? []).some((o) => merit(o.merit).length) ? '<p class="nm">ไม่มีบุญบาป ไม่ว่าผลออกทางไหน</p>' : '',
        line('ex', extras(c, L, byId)),
        outcomesHtml(c, L, byId),
        '</li>',
      ].join('');
    })
    .join('');
  const cond = conditions(e, L);
  return [
    `<article class="c a" id="${esc(e.id)}">`,
    `<h4>${text(e.title ?? 'ไม่มีชื่อการ์ด')}</h4>`,
    tags.length ? `<p class="tags">${tags.map((t) => `<span>${esc(t)}</span>`).join('')}</p>` : '',
    cond.length ? `<p class="when">ออกเมื่อ: ${cond.join(' · ')}</p>` : '',
    `<p>${text(e.text)}</p>`,
    choices ? `<ol class="chs">${choices}</ol>` : '<p class="none">การ์ดเล่าเรื่อง ไม่มีตัวเลือก</p>',
    '</article>',
  ].join('');
}

export function spoilersHtml(content, flags = flagNames(), systems = systemNames()) {
  const L = labels(content, flags, systems);
  const byId = new Map(content.events.map((e) => [e.id, e]));
  const groups = [...STAGES.map((s) => s.name), AFTER].map((stage) => ({ stage, events: content.events.filter((e) => e.stage === stage) })).filter((g) => g.events.length);
  const nav = groups.map((g, i) => `<a href="#s${i}">${esc(g.stage)} <small>${g.events.length}</small></a>`).join('');
  const body = groups
    .map((g, i) => `<details id="s${i}"><summary>${esc(g.stage === AFTER ? 'ปรโลก (ระหว่างชาติ)' : `ช่วง${g.stage}`)} <small>${g.events.length} ใบ</small></summary><div class="grid">${g.events.map((e) => card(e, L, byId)).join('')}</div></details>`)
    .join('\n');
  return `<nav class="toc">${nav}${isekaiNav(groups.length)}</nav>\n${body}\n${isekaiSpoilersHtml(groups.length, merit)}`;
}
