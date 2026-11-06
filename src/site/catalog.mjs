// ด้านหน้าการ์ดบนหน้ารวมการ์ด (B65): แสดงแค่สิ่งที่ผู้เล่นเห็นบนจอ (ชื่อ ข้อความ ตัวเลือก) — ผลลัพธ์ ผลต่อค่า เงิน น้ำหนัก ป้ายบุญบาป อยู่ใน <template> เท่านั้น (กติกา merit ใบ 12)
// ทั้งหน้าประกอบใน spoilers.mjs (catalogHtml)

export const CATEGORY = { family: 'ครอบครัว', study: 'การเรียน', work_money: 'งานและเงิน', health: 'สุขภาพ', society: 'สังคม', belief: 'ความเชื่อ' };
export const AFTER = 'ระหว่างชาติ';

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
    '<div class="sp-front">',
    tags.length ? `<p class="tags">${tags.map((t) => `<span>${esc(t)}</span>`).join('')}</p>` : '',
    `<p>${text(e.text)}</p>`,
    choices ? `<ul>${choices}</ul>` : '<p class="none">การ์ดเล่าเรื่อง ไม่มีตัวเลือก</p>',
    '</div>',
    spoilSlot(e.id, back),
    '</article>',
  ].join('');
}
