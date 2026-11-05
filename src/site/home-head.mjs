// หัวหน้าแรกสำหรับหน้า tweak T3 (ui-redo 104): build เอา CSS + เนื้อ body ของ docs/index.html (หลังฉีดเลขและแถบบนแล้ว) ใส่ระหว่าง marker ใน <template> ของหน้า tweak
// หน้าไม่ลอกหัวเอง ⇒ preset 0 = หน้าแรกบนเว็บตอนนี้เสมอ · ไม่ใช้ fetch เพราะ file:// เปิดไม่ได้
export const HOME_HEAD_PAGE = 'dev/tweak/t3-home-head-tweak.html';
export const HOME_CSS = ['/*HOME-CSS:START*/', '/*HOME-CSS:END*/'];
export const HOME_BODY = ['<!--HOME-BODY:START-->', '<!--HOME-BODY:END-->'];

// marker ของแถบบน (NAV) และสคริปต์เลื่อนแถบถูกตัด — ในหน้า tweak เป็นแค่ตัวอย่าง ไม่ใช่แถบของหน้า · ลิงก์ในกรอบไม่พาไปไหน
export function homeHead(index) {
  const css = index.match(/<style>([\s\S]*?)<\/style>/)?.[1];
  const body = index.match(/<body>([\s\S]*?)<\/body>/)?.[1];
  if (css == null || body == null) throw new Error('docs/index.html: ไม่เจอ <style> หรือ <body>');
  return {
    css: css.replace(/\/\*NAV-CSS:(START|END)\*\//g, '').replace(/<\/(template|style)/gi, '<\\/$1'),
    body: body.replace(/<!--NAV:(START|END)-->/g, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/href="[^"]*"/g, 'href="#"').trim(),
  };
}

const between = (html, [s, e], where, put) => {
  const a = html.indexOf(s);
  const b = html.indexOf(e);
  if (a < 0 || b < a || html.indexOf(s, a + 1) >= 0) {
    if (put === undefined) return null;
    throw new Error(`${where}: ต้องมี ${s} … ${e} ชุดเดียว`);
  }
  return put === undefined ? html.slice(a + s.length, b) : html.slice(0, a + s.length) + put + html.slice(b);
};

export function injectHomeHead(html, index, where) {
  const { css, body } = homeHead(index);
  return between(between(html, HOME_CSS, where, css), HOME_BODY, where, body);
}

// ส่วนระหว่าง marker — ด่านเทียบกับหน้าแรกตอนนี้ · null = ไม่มี marker
export const homeHeadBlock = (html) => ({ css: between(html, HOME_CSS), body: between(html, HOME_BODY) });
