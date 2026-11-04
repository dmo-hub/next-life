// แผนงานบนหน้าแรก (ui-redo 23): ชื่อหมวดของหัว "กำลังทำ" ใน whatsnew (เจ้าของเคาะ: ไม่มีตัวเลขจำนวน) — build ดึงจาก whatsnew ทุกครั้ง ผู้รวมงานเขียนที่เดียว
// ลิงก์ไปหัวหมวดด้วย id ที่ build เติมให้ <h3> ในหัวนั้นเอง — text fragment ใช้ไม่ได้ เพราะชื่อหมวดอย่าง "ต่างโลก" เจอในแถบบนก่อนหัวหมวด
export const ROAD_START = '<!--ROADMAP:START-->';
export const ROAD_END = '<!--ROADMAP:END-->';

const soonPart = (html) => {
  const a = html.indexOf('<h2>กำลังทำ</h2>');
  const b = a < 0 ? -1 : html.indexOf('<h2>', a + 1);
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

export const roadmapHtml = (cats) => `<ul class="road-l">${cats.map((c) => `<li><a href="whatsnew.html#${c.id}">${c.name}</a></li>`).join('')}</ul>`;

export function injectRoadmap(html, cats, where) {
  const a = html.indexOf(ROAD_START);
  const b = html.indexOf(ROAD_END);
  if (a < 0 || b < a) throw new Error(`${where}: ต้องมี ${ROAD_START} … ${ROAD_END}`);
  return html.slice(0, a + ROAD_START.length) + roadmapHtml(cats) + html.slice(b);
}
