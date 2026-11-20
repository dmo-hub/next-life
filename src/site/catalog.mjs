// ด้านหน้าการ์ดบนหน้ารวมการ์ด (B65): แสดงแค่สิ่งที่ผู้เล่นเห็นบนจอ (ชื่อ ข้อความ ตัวเลือก) — ผลลัพธ์ ผลต่อค่า เงิน น้ำหนัก ป้ายบุญบาป อยู่ใน <template> เท่านั้น (กติกา merit ใบ 12)
// ทั้งหน้าประกอบใน spoilers.mjs (catalogHtml)

export const CATEGORY = { family: 'ครอบครัว', study: 'การเรียน', work_money: 'งานและเงิน', health: 'สุขภาพ', society: 'สังคม', belief: 'ความเชื่อ' };
import { readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { sinceTag } from './card-since.mjs';

export const AFTER = 'ระหว่างชาติ';

// ตารางการ์ดแต่ละหมวดบนหน้ารวมการ์ด: ไฟล์ content → หมวด ที่เดียว · ชื่อไฟล์ลงท้าย * = ขึ้นต้นด้วยคำนั้น
// ไฟล์ที่ไม่ตรงหมวดไหนเลยทำ build และ site:check ตก (ไฟล์ใหม่ต้องเลือกหมวดก่อนถึงขึ้นตาราง) · ตรงหลายหมวด = หมวดแรกในลิสต์
export const CARD_GROUPS = [
  { name: 'สุขภาพ', files: ['*_health', 'stats_extremes'] },
  { name: 'อาชีพเฉพาะทาง', files: ['job_*', '*_career', 'singer', 'boxer', 'pageant'] },
  { name: 'งานและเงิน', files: ['work_*', 'business', 'debt*', 'corruption', 'lottery', 'grey_money', 'career_first', 'crop_rural', 'labor_abroad'] },
  { name: 'สายเตรียมทหาร', files: ['cadet_*'] },
  { name: 'ครอบครัว', files: ['child_family', 'child_far', 'old_family', 'echoes_family', 'life_divorce', 'pets', 'remarry', 'heir', 'grief', 'funeral'] },
  { name: 'ชีวิตประจำวัน', files: ['daily_*', 'life_*', 'street_*', 'tour_local'] },
  { name: 'คนรอบตัว', files: ['people_*', 'nbr_home'] },
  { name: 'วัฒนธรรม', files: ['culture_*', 'meme', 'festivals'] },
  { name: 'ด่านชีวิต', files: ['ordeal_*', 'dilemmas', 'risky_cases', 'court', 'dungeon', 'overlap'] },
  { name: 'สังคม', files: ['era_*', 'echoes', 'echoes_debt', 'sex_roles'] },
  { name: 'ช่วงวัยและก้าวสำคัญ', files: ['young', 'mid', 'milestones*', 'time_capsule', 'prepared', 'drift', 'childhood_echoes'] },
  { name: 'ความเชื่อ', files: ['belief'] },
  { name: 'การเรียน', files: ['teen', 'scholarship_bond', 'pali_monk'] },
  { name: AFTER, files: ['afterlife'] },
];
const fileHits = (pat, name) => (pat.endsWith('*') ? name.startsWith(pat.slice(0, -1)) : pat.startsWith('*') ? name.endsWith(pat.slice(1)) : name === pat);

// นับการ์ดต่อหมวดจากไฟล์ content จริง · unmapped = ไฟล์ที่ไม่อยู่ในหมวดไหน
export function cardGroupCounts(groups = CARD_GROUPS, dir = new URL('../../content/', import.meta.url)) {
  const counts = groups.map((g) => ({ ...g, n: 0, hit: [] }));
  const unmapped = [];
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.yaml')).sort()) {
    const name = f.replace(/\.yaml$/, '');
    const g = counts.find((c) => c.files.some((p) => fileHits(p, name)));
    if (!g) {
      unmapped.push(name);
      continue;
    }
    g.n += parse(readFileSync(new URL(f, dir), 'utf8')).events.length;
    g.hit.push(name);
  }
  return { rows: counts, unmapped, total: counts.reduce((s, g) => s + g.n, 0) };
}

export function cardGroupRows(groups, dir) {
  const { rows, unmapped } = cardGroupCounts(groups, dir);
  if (unmapped.length) throw new Error(`ไฟล์ content ไม่อยู่ในหมวดการ์ดบนหน้ารวมการ์ด (CARD_GROUPS ใน src/site/catalog.mjs): ${unmapped.join(', ')}`);
  return rows.map((g) => `<tr><td>${esc(g.name)}</td><td>${g.n.toLocaleString('en-US')}</td><td>${esc(g.files.join(', '))}</td></tr>`).join('\n      ');
}

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// ช่องแทนค่าเหลือเป็นคำในวงเล็บ ผู้อ่านรู้ว่าตรงนี้เกมเติมชื่อ/อายุของชีวิตนั้น
export const text = (s) => esc(s).replace(/\{([^{}]*)\}/g, (m, k) => `<i class="ph">${esc(k)}</i>`);
export const choiceText = (c) => c.text ?? c.label ?? '';

// เนื้อเฉลยอยู่ใน <template> ⇒ ไม่อยู่ใน DOM ไม่ถูก Ctrl+F เจอจนกด "ดูผล" (ข้อ 187) · <details>/hidden="until-found" ใช้ไม่ได้ เบราว์เซอร์ค้นเจอแล้วกางให้เอง
export const spoilSlot = (id, back) => `<template data-spoil="${esc(id)}">${back}</template><p class="sp-ft"><button type="button" class="sp-btn" aria-expanded="false">ดูผล</button></p>`;
// ด่านอ่านหน้าเป็นสองส่วน: visible = ที่อยู่ใน DOM ก่อนกด · spoilOnly = เนื้อเฉลยทุก template ต่อกัน
const SPOIL_RE = /<template data-spoil="[^"]*">([\s\S]*?)<\/template>/g;
export const visible = (html) => html.replace(SPOIL_RE, '');
export const spoilOnly = (html) => [...html.matchAll(SPOIL_RE)].map((m) => m[1]).join('\n');

// ด้านหน้าอยู่ใน .sp-front ⇒ กดดูผลแล้วซ่อนทั้งก้อน เหลือชื่อการ์ดกับกล่องเฉลย (พลิกหลังการ์ด ข้อ 237)
export function catalogCard(e, back) {
  const tags = [e.era ? 'บ้านเมือง' : CATEGORY[e.category], e.belief ? 'ความเชื่อ' : null].filter((t, i, a) => t && a.indexOf(t) === i);
  const choices = (e.choices ?? []).filter((c) => !c.hidden).map((c) => `<li>${text(choiceText(c))}</li>`).join('');
  return [
    `<article class="c a" id="${esc(e.id)}">`,
    `<h4>${text(e.title ?? 'ไม่มีชื่อการ์ด')}</h4>`,
    sinceTag(e.id),
    '<div class="sp-front">',
    tags.length ? `<p class="tags">${tags.map((t) => `<span>${esc(t)}</span>`).join('')}</p>` : '',
    `<p>${text(e.text)}</p>`,
    choices ? `<ul>${choices}</ul>` : '<p class="none">การ์ดเล่าเรื่อง ไม่มีตัวเลือก</p>',
    '</div>',
    spoilSlot(e.id, back),
    '</article>',
  ].join('');
}
