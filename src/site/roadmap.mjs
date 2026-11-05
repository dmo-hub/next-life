// แถวหมวดแผนงาน (ui-redo 23 · ย้ายจากหน้าแรกมาใต้หัวกำลังทำใน whatsnew เอง ui-redo 69): ชื่อหมวดของหัว "กำลังทำ" ใน whatsnew (เจ้าของเคาะ: ไม่มีตัวเลขจำนวน) — build ดึงจาก whatsnew ทุกครั้ง ผู้รวมงานเขียนที่เดียว
// ลิงก์ไปหัวหมวดด้วย id ที่ build เติมให้ <h3> ในหัวนั้นเอง — text fragment ใช้ไม่ได้ เพราะชื่อหมวดอย่าง "ต่างโลก" เจอในแถบบนก่อนหัวหมวด
export const ROAD_START = '<!--ROADMAP:START-->';
export const ROAD_END = '<!--ROADMAP:END-->';

const soonPart = (html) => {
  const a = html.indexOf('<h2>กำลังทำ</h2>');
  // หัวถัดไปอาจมี id (แผนข้างหน้า <h2 id="plan">) — หาแค่ '<h2>' จะเลยไปนับข้อแผนเป็นข้อกำลังทำ
  const rest = a < 0 ? -1 : html.slice(a + 1).search(/<h2[\s>]/);
  const b = rest < 0 ? -1 : a + 1 + rest;
  return a < 0 ? null : [a, b < 0 ? html.length : b];
};
export const soonId = (name) => `soon-${name.trim().replace(/\s+/g, '-')}`;

// [{ name, id }] ตามลำดับใน whatsnew
export function soonCats(html) {
  const at = soonPart(html);
  if (!at) return [];
  const part = html.slice(...at);
  return [...part.matchAll(/<h3(?:\s[^>]*)?>([^<]+)<\/h3>/g)].map((m) => ({ name: m[1].trim(), id: soonId(m[1]) }));
}

// เติม id ให้หัวหมวดใน "กำลังทำ" (ทับ id เดิมถ้ามี) · ส่วนอื่นของหน้าไม่แตะ
export function soonIds(html) {
  const at = soonPart(html);
  if (!at) return html;
  const part = html.slice(...at).replace(/<h3(?:\s[^>]*)?>([^<]+)<\/h3>/g, (m, name) => `<h3 id="${soonId(name)}">${name}</h3>`);
  return html.slice(0, at[0]) + part + html.slice(at[1]);
}

// ข้อในกำลังทำผูกกับใบ (ui-redo 128): <li data-tickets="96 B114"> = ข้อนี้ถอดเมื่อปิดครบทุกใบ · <li data-backlog> = เจ้าของเคาะแล้วแต่ยังไม่มีใบ
// เลขอยู่ใน attribute เท่านั้น — ผู้เล่นไม่เห็นบนจอ · ใบที่ปิดแล้วอยู่ใน DONE_FILE (rel.mjs เติมจาก notes.json done ทุกรอบที่ปล่อย)
export const DONE_FILE = 'src/site/tickets-done.json';
// เลขเปล่า = ui-redo · prefix บอกชุดใบ (tld isk wo lg fb B …) — เลขชนกันข้ามชุด · ท้าย -N = ใบย่อย (fb06c-3)
export const TICKET_ID = /^[A-Za-z]*\d+[a-z]?(?:-\d+)?$/;
const attr = (a, k) => a?.match(new RegExp(`\\s${k}(?:="([^"]*)")?(?=[\\s>/]|$)`));
const idsOf = (t) => (t?.[1] ?? '').trim().split(/\s+/).filter(Boolean);
// ข้อของหัวกำลังทำเริ่มหลังแถวลิงก์หมวด — แถวนั้นก็เป็น <li> ถ้าไม่ข้ามจะนับชื่อหมวดเป็นข้อ
const itemPart = (html) => {
  const at = soonPart(html);
  if (!at) return null;
  const e = html.indexOf(ROAD_END, at[0]);
  return [e >= 0 && e < at[1] ? e + ROAD_END.length : at[0], at[1]];
};
const nameOf = (body) => body.match(/<b>([^<]*)<\/b>/)?.[1] ?? body.replace(/<[^>]+>/g, '').trim();

// [{ cat, name, tickets: [], backlog, text }] ตามลำดับในหัวกำลังทำ · text = ข้อความที่ผู้เล่นเห็น
export function soonItems(html) {
  const at = itemPart(html);
  if (!at) return [];
  const out = [];
  let cat = null;
  for (const m of html.slice(...at).matchAll(/<h3(?:\s[^>]*)?>([^<]+)<\/h3>|<li(\s[^>]*)?>([\s\S]*?)<\/li>/g)) {
    if (m[1] !== undefined) {
      cat = m[1].trim();
      continue;
    }
    const t = attr(m[2], 'data-tickets');
    out.push({ cat, name: nameOf(m[3]), tickets: idsOf(t), hasTickets: !!t, backlog: !!attr(m[2], 'data-backlog'), text: m[3].replace(/<[^>]+>/g, '') });
  }
  return out;
}

// ถอดเลขใบที่ปิดแล้วออกจากข้อ · เลขหมด = ถอดทั้งข้อ · หมวดไม่เหลือข้อ = ถอดทั้งหมวด แล้วสร้างแถวหมวด ROADMAP ใหม่ให้ตรง
// unknown = เลขใน done ที่ไม่มีข้อไหนอ้าง — rel.mjs throw กันพิมพ์ผิดแล้วผ่านเงียบ
export function dropDone(html, done) {
  const at = itemPart(html);
  const want = new Set(done);
  const hit = new Set();
  const removed = [];
  const trimmed = [];
  if (!at) return { html, removed, trimmed, unknown: [...want] };
  let part = html.slice(...at).replace(/(\r?\n[ \t]*)?<li(\s[^>]*)?>([\s\S]*?)<\/li>/g, (whole, lead, a, body) => {
    const t = attr(a, 'data-tickets');
    if (!t) return whole;
    const ids = idsOf(t);
    const left = ids.filter((id) => !want.has(id));
    if (left.length === ids.length) return whole;
    ids.filter((id) => want.has(id)).forEach((id) => hit.add(id));
    if (!left.length) {
      removed.push(nameOf(body));
      return '';
    }
    trimmed.push(`${nameOf(body)} (เหลือ ${left.join(' ')})`);
    return whole.replace(t[0], ` data-tickets="${left.join(' ')}"`);
  });
  // หมวดที่ <ul> ว่างแล้ว: ถอด <h3> + <ul> + บรรทัดว่างคั่นที่ตามมา
  part = part.replace(/[ \t]*<h3(?:\s[^>]*)?>[^<]+<\/h3>\r?\n[ \t]*<ul>\s*<\/ul>\r?\n(?:[ \t]*\r?\n)?/g, '');
  let out = html.slice(0, at[0]) + part + html.slice(at[1]);
  if (out.includes(ROAD_START)) out = injectRoadmap(soonIds(out), soonCats(out), 'whatsnew');
  return { html: out, removed, trimmed, unknown: [...want].filter((id) => !hit.has(id)) };
}

// ข้อที่ผิดกติกาผูกใบ: ไม่มีป้าย · มีทั้งสองป้าย · เลขรูปแปลก · ผูกกับใบที่ปิดแล้ว · เลขใบโผล่ในข้อความที่ผู้เล่นเห็น
export function soonTicketProblems(html, done) {
  const closed = new Set(done);
  const bad = [];
  for (const it of soonItems(html)) {
    const tag = `${it.cat ?? '-'} · ${it.name}`;
    if (!it.tickets.length && !it.backlog) bad.push(`ไม่มีเลขใบ/ป้าย backlog: ${tag}`);
    if (it.hasTickets && it.backlog) bad.push(`มีทั้งเลขใบและ backlog: ${tag}`);
    const odd = it.tickets.filter((id) => !TICKET_ID.test(id));
    if (odd.length) bad.push(`เลขใบแปลก ${odd.join(' ')}: ${tag}`);
    const stale = it.tickets.filter((id) => closed.has(id));
    if (stale.length) bad.push(`ใบปิดแล้วยังค้าง ${stale.join(' ')}: ${tag}`);
    const shown = it.tickets.filter((id) => /[A-Za-z]/.test(id) && it.text.includes(id));
    if (shown.length || /ใบ\s*\d|data-tickets/.test(it.text)) bad.push(`เลขใบโผล่บนจอ: ${tag}`);
  }
  return bad;
}

// แผนข้างหน้า (ui-redo 100): แผนเฟสเขียนใหม่เป็นภาษาผู้เล่นในหน้าแพตช์โน้ต — นอกหัวกำลังทำ (แถวหมวดอ่าน <h3> ในหัวนั้น) · dev/plan เป็นหน้าส่งต่อมาที่นี่
// หน้าสาธารณะ ⇒ ห้ามคำของห้องผู้พัฒนาและคำของโลกที่ยังปิดอยู่ ("ใบ" จับ "คำใบ้" ด้วยโดยตั้งใจ — เลี่ยงคำนั้นในส่วนนี้)
export const PLAN_ID = 'plan';
export const PLAN_FROM = 'dev/plan.html';
export const PLAN_BANNED = ['ใบ', 'harness', 'เลน', 'ต่างโลก'];
export function planPart(html) {
  const a = html.indexOf(`<h2 id="${PLAN_ID}">`);
  if (a < 0) return null;
  const b = html.indexOf('<h2', a + 1);
  return [a, b < 0 ? html.length : b];
}
export function planProblems(html) {
  const at = planPart(html);
  if (!at) return ['ไม่มีหัวแผนข้างหน้า'];
  const part = html.slice(...at);
  const bad = [];
  const soon = soonPart(html);
  if (soon && at[0] >= soon[0] && at[0] < soon[1]) bad.push('แผนข้างหน้าอยู่ในหัวกำลังทำ');
  if (/<h3[\s>]/.test(part)) bad.push('แผนข้างหน้ามี <h3> (แถวหมวดจะนับปน)');
  if ((part.match(/<li[\s>]/g) ?? []).length < 3) bad.push('แผนข้างหน้าไม่ถึง 3 ข้อ');
  const text = part.replace(/<[^>]+>/g, ' ').toLowerCase();
  for (const w of PLAN_BANNED) if (text.includes(w)) bad.push(`แผนข้างหน้ามีคำ "${w}"`);
  return bad;
}

// แถวอยู่ในหน้า whatsnew เอง ⇒ ลิงก์ #id ในหน้าเดียวกัน
export const roadmapHtml = (cats) => `<ul class="road-l">${cats.map((c) => `<li><a href="#${c.id}">${c.name}</a></li>`).join('')}</ul>`;

export function injectRoadmap(html, cats, where) {
  const a = html.indexOf(ROAD_START);
  const b = html.indexOf(ROAD_END);
  if (a < 0 || b < a) throw new Error(`${where}: ต้องมี ${ROAD_START} … ${ROAD_END}`);
  return html.slice(0, a + ROAD_START.length) + roadmapHtml(cats) + html.slice(b);
}
