// CSS ตัวเกมสำหรับหน้า tweak ใต้ docs/dev/ (thai-life-deep 185 · ui-redo 46 · 52): หน้าเขียนมือวาง marker ไว้ใน <template> แล้ว build เติม CSS จาก template.html ทุกรอบ
// หน้าเอาไปใส่ iframe srcdoc เอง — CSS เกมมีกฎ body/:root ที่จะทับหน้าควบคุมถ้าใส่ตรง · ไม่โหลด play.html เพราะ fetch ใช้กับ file:// ไม่ได้
export const GAME_CSS_START = '/*GAME-CSS:START*/';
export const GAME_CSS_END = '/*GAME-CSS:END*/';
// หน้าใต้ docs/ ที่ใช้ CSS เกม
export const GAME_CSS_PAGES = ['dev/tweak/entry-tweak.html', 'dev/tweak/fx-icons-tweak.html', 'dev/tweak/shelf-tabs-tweak.html', 'dev/tweak/card-art-tweak.html', 'dev/tweak/t1-tokens-tweak.html', 'dev/tweak/t1-worlds-tweak.html'];

// ฟอนต์ฝัง (base64) ของเกมไม่ตามมา — หน้า tweak โหลดฟอนต์ชุดเดียวกันจากเว็บ ไฟล์จึงไม่บวม
export function gameCss(template) {
  const m = template.match(/<style>([\s\S]*?)<\/style>/);
  if (!m) throw new Error('src/ui/template.html: ไม่เจอ <style>');
  return m[1].replace('/*__FONTS__*/', '').replace(/<\/(template|style)/gi, '<\\/$1');
}

export function injectGameCss(html, css, where) {
  const a = html.indexOf(GAME_CSS_START);
  const b = html.indexOf(GAME_CSS_END);
  if (a < 0 || b < a || html.indexOf(GAME_CSS_START, a + 1) >= 0) throw new Error(`${where}: ต้องมี ${GAME_CSS_START} … ${GAME_CSS_END} ชุดเดียว`);
  return html.slice(0, a + GAME_CSS_START.length) + css + html.slice(b);
}

// ส่วนระหว่าง marker — ด่านเทียบกับ CSS ปัจจุบัน · null = ไม่มี marker
export function gameCssBlock(html) {
  const a = html.indexOf(GAME_CSS_START);
  const b = html.indexOf(GAME_CSS_END);
  return a < 0 || b < a ? null : html.slice(a + GAME_CSS_START.length, b);
}
