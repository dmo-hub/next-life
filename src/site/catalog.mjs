// หน้ารวมการ์ด (B65): สร้างจาก content ทุกครั้งที่ build — การ์ดใหม่ขึ้นหน้าเว็บเองไม่ต้องเขียนมือ
// แสดงแค่สิ่งที่ผู้เล่นเห็นบนจอ (ชื่อ ข้อความ ตัวเลือก) — ไม่มีผลลัพธ์ ผลต่อค่า เงิน น้ำหนัก หรือป้ายบุญบาป (กติกา merit ใบ 12)
import { STAGES } from '../engine/index.mjs';

export const CATEGORY = { family: 'ครอบครัว', study: 'การเรียน', work_money: 'งานและเงิน', health: 'สุขภาพ', society: 'สังคม', belief: 'ความเชื่อ' };
export const AFTER = 'ระหว่างชาติ';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// ช่องแทนค่าเหลือเป็นคำในวงเล็บ ผู้อ่านรู้ว่าตรงนี้เกมเติมชื่อ/อายุของชีวิตนั้น
export const text = (s) => esc(s).replace(/\{([^{}]*)\}/g, (m, k) => `<i class="ph">${esc(k)}</i>`);
export const choiceText = (c) => c.text ?? c.label ?? '';

function card(e) {
  const tags = [e.era ? 'บ้านเมือง' : CATEGORY[e.category], e.belief ? 'ความเชื่อ' : null].filter((t, i, a) => t && a.indexOf(t) === i);
  const choices = (e.choices ?? []).filter((c) => !c.hidden).map((c) => `<li>${text(choiceText(c))}</li>`).join('');
  return [
    `<article class="c ${e.type === 'B' ? 'b' : 'a'}">`,
    `<h4>${text(e.title ?? 'ไม่มีชื่อการ์ด')}</h4>`,
    tags.length ? `<p class="tags">${tags.map((t) => `<span>${esc(t)}</span>`).join('')}</p>` : '',
    `<p>${text(e.text)}</p>`,
    choices ? `<ul>${choices}</ul>` : '<p class="none">การ์ดเล่าเรื่อง ไม่มีตัวเลือก</p>',
    '</article>',
  ].join('');
}

export function catalogHtml(content) {
  const groups = [...STAGES.map((s) => s.name), AFTER].map((stage) => ({ stage, events: content.events.filter((e) => e.stage === stage) })).filter((g) => g.events.length);
  const nav = groups.map((g, i) => `<a href="#s${i}">${esc(g.stage)} <small>${g.events.length}</small></a>`).join('');
  const body = groups
    .map((g, i) => `<details id="s${i}"${i === 0 ? ' open' : ''}><summary>${esc(g.stage === AFTER ? 'ปรโลก (ระหว่างชาติ)' : `ช่วง${g.stage}`)} <small>${g.events.length} ใบ</small></summary><div class="grid">${g.events.map(card).join('')}</div></details>`)
    .join('\n');
  return `<nav class="toc">${nav}</nav>\n${body}`;
}
