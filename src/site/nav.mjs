// แถบบนชิ้นเดียวของทุกหน้าเว็บ (ยกเว้น play.html · archive/*) — build ฉีดระหว่าง marker · หน้าเขียนมือวาง marker ไว้ครั้งเดียว ส่วนนอก marker build ไม่แตะ
// แบบ ก ที่เจ้าของเคาะ: ชื่อเกมซ้าย = หน้าแรก · ลิงก์กลางเลื่อนข้างได้ · ปุ่ม "เล่นเกม" ขวา · หน้าปัจจุบัน = ทอง + ตัวหนา
import { SITE_ROOT, SITE_BAR } from './tokens.mjs';
export const NAV_START = '<!--NAV:START-->';
export const NAV_END = '<!--NAV:END-->';
export const NAV_CSS_START = '/*NAV-CSS:START*/';
export const NAV_CSS_END = '/*NAV-CSS:END*/';

export const NAV_MENU = [
  // หน้าโฟกัสไม่มีป้ายของตัวเอง (เจ้าของเคาะ) เข้าจากลิงก์ในหน้าวิธีเล่น
  ['guide.html', 'วิธีเล่น', null, ['focus.html']],
  ['whatsnew.html', 'แพตช์โน้ต'],
  ['about.html', 'กลไกในเกม'],
  // เจ้าของรวมสองหน้าเป็นหัวเดียว "โลก" · หน้าต่างโลกยังอยู่ (ลิงก์จากหน้าโลก) และนับเป็นหัวนี้ตอนเปิดอยู่
  ['worlds.html', 'โลก', null, ['otherworld.html']],
  ['catalog.html', 'การ์ดทั้งหมด'],
  ['dev/index.html', 'ห้องผู้พัฒนา'],
];

// เส้นใต้เหลือไว้ให้ hover/focus — หน้าปัจจุบันแยกด้วยสีกับน้ำหนัก
// 390: ลิงก์กลางล้นแถบ ⇒ เงาจางขอบขวาบอกว่าเลื่อนได้ · nav.top a รีเซ็ตกล่องเอง เพราะบางหน้ามีกฎ a.<ชื่อ> ของตัวเอง (otherworld: a.play)
// T2 (ui-redo 105 · ข้อ 218): แถบกับหัวหน้า (header ชื่อหน้า + คำโปรย) เป็นก้อนครามเดียว เตี้ย ไม่มีลาย — header แบบเดียวทุกหน้า หน้าแรกใช้ header.home ของตัวเอง
// ลิงก์ในเนื้อขีดเส้นใต้เสมอ (คราม = ตัวหนังสือ แยกด้วยสีไม่ได้) · ลิงก์ที่มี class เป็นปุ่ม/เมนูของหน้า ดูแลกรอบเอง
// ตัวแถบแยกจากกฎของหน้า ⇒ ห้องผู้พัฒนาหยิบแถบไปใช้ได้โดย header กับลิงก์ในเนื้อของหน้านั้นคงเดิม
const NAV_BAR_CSS = `  nav.top { display: flex; align-items: center; gap: 4px; background: var(--head); border-bottom: 0; padding: 0 12px; font-family: var(--fb); line-height: normal; }
  nav.top a { display: inline-block; color: var(--on-head); text-decoration: none; padding: 0 10px; line-height: 40px; font-size: 14px; font-weight: 400; font-family: inherit; margin: 0; min-height: 0; border: 0; border-radius: 0; background: none; }
  nav.top a.dark { color: var(--headink); }
  nav.top a[aria-current] { color: var(--headink); font-weight: 600; }
  nav.top a:hover, nav.top a:focus-visible { text-decoration: underline; text-underline-offset: 4px; outline: none; }
  nav.top .brand { font-weight: 600; color: var(--headink); padding-left: 0; white-space: nowrap; }
  nav.top .links { flex: 1; min-width: 0; overflow-x: auto; white-space: nowrap; }
  nav.top a.play { background: var(--gold); color: var(--head); border-radius: var(--r); line-height: 28px; padding: 0 12px; font-weight: 600; white-space: nowrap; }
  nav.top a.play:focus-visible { outline: 2px solid var(--headink); outline-offset: 2px; }
`;
const NAV_BAR_MASK = `  @media (max-width: 760px) { nav.top .links { -webkit-mask-image: linear-gradient(to right, black calc(100% - 28px), transparent); mask-image: linear-gradient(to right, black calc(100% - 28px), transparent); } }
`;
export const NAV_CSS = `
  ${SITE_ROOT}
${NAV_BAR_CSS}  body > header:not(.home) { background: var(--head); color: var(--title); padding: 16px 16px 18px; }
  body > header:not(.home) h1 { font-family: var(--fh); font-weight: 600; color: var(--title); }
  body > header:not(.home) p { color: var(--on-head2); }
  body > header:not(.home) a { color: var(--headink); text-decoration: underline; text-underline-offset: 3px; }
  main :is(p, li, td, dd, figcaption, blockquote) a:not([class]) { color: inherit; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--accent2); }
${NAV_BAR_MASK}`;

// 390: ลิงก์หน้าปัจจุบันอาจอยู่นอกส่วนที่เห็นของแถบที่ล้น ⇒ ตั้ง scrollLeft ของแถบเอง (scrollIntoView เลื่อนทั้งหน้าแนวตั้งด้วย) · ไม่มี JS แถบยังใช้ได้เหมือนเดิม
// คำนวณซ้ำหลังฟอนต์โหลด เพราะความกว้างลิงก์เปลี่ยนเมื่อ Sarabun มาแทนฟอนต์สำรอง
const NAV_SCRIPT = `<script>(()=>{const l=document.querySelector('nav.top .links'),c=l&&l.querySelector('[aria-current]');if(!c)return;const f=()=>{if(l.scrollWidth>l.clientWidth)l.scrollLeft+=c.getBoundingClientRect().left-l.getBoundingClientRect().left-(l.clientWidth-c.offsetWidth)/2};f();document.fonts&&document.fonts.ready.then(f)})()</script>`;

// file = path ใต้ docs/ เช่น about.html · spec/lore-finance-series.html
export function navHtml(file) {
  const up = '../'.repeat(file.split('/').length - 1);
  // หน้าใต้ห้องผู้พัฒนานับเป็นหัวนี้ แต่ไม่ใช่หน้านั้นเอง ⇒ "true" ไม่ใช่ "page"
  const cur = (href, also = []) => (href === file || also.includes(file) ? ' aria-current="page"' : href === 'dev/index.html' && file.startsWith('dev/') ? ' aria-current="true"' : '');
  const a = (href, text, cls, also) => `<a${cls ? ` class="${cls}"` : ''} href="${up}${href}"${cur(href, also)}>${text}</a>`;
  const links = NAV_MENU.map(([h, t, c, also]) => a(h, t, c, also)).join('');
  return `<nav class="top" aria-label="หน้าอื่น">${a('index.html', 'NEXT LIFE', 'brand')}<div class="links">${links}</div>${a('play.html', 'เล่นเกม', 'play')}</nav>${NAV_SCRIPT}`;
}

const swap = (html, start, end, body, where) => {
  const a = html.indexOf(start);
  const b = html.indexOf(end);
  if (a < 0 || b < a || html.indexOf(start, a + 1) >= 0) throw new Error(`${where}: ต้องมี ${start} … ${end} ชุดเดียว`);
  return html.slice(0, a + start.length) + body + html.slice(b);
};

export function injectNav(html, file) {
  return swap(swap(html, NAV_CSS_START, NAV_CSS_END, NAV_CSS, `docs/${file}`), NAV_START, NAV_END, navHtml(file), `docs/${file}`);
}

// ส่วนระหว่าง marker ของหน้า — ใช้ในด่าน · null = ไม่มี marker ครบชุด
export function navBlocks(html) {
  const pick = (s, e) => {
    const a = html.indexOf(s);
    const b = html.indexOf(e);
    return a < 0 || b < a ? null : html.slice(a + s.length, b);
  };
  return { css: pick(NAV_CSS_START, NAV_CSS_END), nav: pick(NAV_START, NAV_END), count: html.split(NAV_START).length - 1 };
}

// แถบห้องผู้พัฒนา = แถบเว็บ nav.top + แท็บ 7 ป้าย (ข้อ 292 293): หน้าที่ build สร้างใต้ dev/ เรียก devNavHtml · หน้าเขียนมือ (DEV_NAV_PAGES) build เขียนทับระหว่าง marker
export const DEV_TABS = [
  ['dev/index.html', 'สารบัญ'],
  ['dev/spec.html', 'ภาคผนวกสเปก'],
  ['dev/plan.html', 'สเปก/แผน'],
  ['dev/design.html', 'คำตัดสินเกม'],
  ['dev/ui.html', 'การออกแบบ'],
  ['dev/maps/continent.html', 'แผนที่'],
  ['dev/archive/index.html', 'คลังเก่า'],
];

// ผังทั้งหกอยู่หน้าเดียว สลับด้วย #<ผัง> (ui-redo 101 · ข้อ 189) · ที่เดิมแต่ละผังเป็นหน้าส่งต่อที่ build เขียนทุกรอบ
// แท็บ "แผนที่" ยังชี้ continent.html — หน้าเขียนมือทุกหน้ามีแท็บนี้ ส่งต่อพาเข้าผังทวีปเองจึงไม่ต้องไล่แก้ทุกหน้า
export const DEV_MAPS_PAGE = 'dev/maps/index.html';
export const DEV_MAPS = [
  ['continent', 'ทวีป', 'แผนที่ทวีปเอเธอร์การ์ด'],
  ['afterlife', 'ปรโลก', 'ผังภูมิ 5 ในปรโลก'],
  ['dungeon', 'ดันเจียน', 'แผนที่ชั้นในดันเจียนลับ'],
  ['lineage', 'ตระกูล', 'ผังตระกูล'],
  ['milestones', 'หลักไมล์', 'หลักไมล์ 8 สาย — โลกหลัก'],
  ['politics', 'การเมือง', 'ผังบันไดการเมือง'],
];
export const mapsMoved = ([id, , title]) => movedHtml(`dev/maps/${id}.html`, `${DEV_MAPS_PAGE}#${id}`, title);
export const DEV_NAV_PAGES = ['dev/index.html', 'dev/plan.html', 'dev/spec.html', DEV_MAPS_PAGE, 'dev/archive/index.html', 'dev/archive/b176-samples.html', 'dev/archive/fx-proto.html', 'dev/archive/isekai-life-v1.html'];
export const DEV_NAV_START = '<!--nav-->';
export const DEV_NAV_END = '<!--/nav-->';
// แผนที่กับคลังเก่าไม่ได้ใช้ชุดสีกลาง และแต่ละหน้ามีตัวแปรชื่อซ้ำของตัวเอง ⇒ ตั้งสีเฉพาะที่แถบ
const devNavCss = (file) => `
${/^dev\/(maps|archive)\//.test(file) ? SITE_BAR : SITE_ROOT}
${NAV_BAR_CSS}${NAV_BAR_MASK}
.nl-nav,.nl-nav *{box-sizing:border-box;margin:0}
.nl-nav{font:15px/1.4 var(--fb);text-align:left}
.nl-nav a{text-decoration:none;color:inherit}
.nl-in{max-width:${file === DEV_MAPS_PAGE ? 1800 : 1280}px;margin:0 auto;padding:0 16px;display:flex;align-items:center;gap:4px}
.nl-tabs{background:var(--bg);color:var(--ink);border-bottom:1px solid var(--line)}
.nl-tabs .nl-in{overflow-x:auto;scrollbar-width:none}
.nl-tabs a{padding:10px 10px 8px;border-bottom:3px solid transparent;white-space:nowrap}
.nl-tabs a[aria-current]{border-bottom-color:var(--accent2);font-weight:600}
.nl-tabs.nl-sub{background:var(--bg);font-size:14px}
`;
// file = path ใต้ docs/ เช่น dev/design-lore.html · หน้าลูกของแท็บ ⇒ aria-current="true" (ไม่ใช่ page เพราะไม่ใช่หน้านั้นเอง) · แท็บแผนที่ชี้หน้าส่งต่อ แต่หน้าจริงคือหน้ารวมผัง
// sub = แถวแท็บรองของหน้า (สเปก/แผน · คลังเก่า)
export function devNavHtml(file, sub = '') {
  const up = '../'.repeat(file.split('/').length - 1);
  const cur = (href) => (href === file || (href === 'dev/maps/continent.html' && file === DEV_MAPS_PAGE) ? ' aria-current="page"' : (href === 'dev/design.html' && /^dev\/design-.+\.html$/.test(file)) || (href === 'dev/archive/index.html' && file.startsWith('dev/archive/')) ? ' aria-current="true"' : '');
  const tabs = DEV_TABS.map(([h, t]) => `<a href="${up}${h}"${cur(h)}>${t}</a>`).join('');
  return `${DEV_NAV_START}<style>${devNavCss(file)}</style>${navHtml(file)}<div class="nl-nav nl-dev"><div class="nl-tabs" role="navigation" aria-label="เอกสารผู้พัฒนา"><div class="nl-in">${tabs}</div></div>${sub}</div>${DEV_NAV_END}`;
}
// แถวแท็บรองเป็นของหน้า ⇒ อ่านจากแถบเดิมแล้วเขียนกลับ
export function injectDevNav(html, file) {
  const a = html.indexOf(DEV_NAV_START);
  const b = html.indexOf(DEV_NAV_END, a);
  if (a < 0 || b < 0) throw new Error(`docs/${file}: ต้องมี ${DEV_NAV_START} … ${DEV_NAV_END}`);
  const sub = html.slice(a, b).match(/<div class="nl-tabs nl-sub"[\s\S]*?<\/div><\/div>/)?.[0];
  return html.slice(0, a) + devNavHtml(file, sub) + html.slice(b + DEV_NAV_END.length);
}

// หน้าส่งต่อของ URL ที่ย้ายไป (GitHub Pages ไม่มี redirect ฝั่งเซิร์ฟเวอร์) — noindex ไม่ใช้ canonical (คำตัดสินเจ้าของ) · พก #ส่วนในหน้าไปด้วย เว้นปลายทางระบุหัวไว้แล้ว (หน้าที่ย้ายมาเป็นหัวในหน้าอื่น)
// from/to = path ใต้ docs/ · build เขียนทุกรอบ จึงไม่หายเมื่อ build ซ้ำ · MOVED_MARK ให้ build/ด่านแยกหน้าส่งต่อออกจากหน้าค้าง
export const MOVED_MARK = '<meta name="next-life-moved"';
export function movedHtml(from, to, title) {
  const href = '../'.repeat(from.split('/').length - 1) + to;
  title = title.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
${MOVED_MARK} content="${to}">
<meta http-equiv="refresh" content="0; url=${href}">
<title>ย้ายแล้ว · ${title}</title>
<script>location.replace(${JSON.stringify(href)}${to.includes('#') ? '' : ' + location.hash'})</script>
</head>
<body style="font-family:Sarabun,sans-serif;padding:24px">
<p>หน้านี้ย้ายไปแล้ว — <a href="${href}">${title}</a></p>
</body>
</html>
`;
}
