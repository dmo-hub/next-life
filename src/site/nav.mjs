// แถบบนชิ้นเดียวของทุกหน้าเว็บ (ยกเว้น play.html · archive/*) — build ฉีดระหว่าง marker · หน้าเขียนมือวาง marker ไว้ครั้งเดียว ส่วนนอก marker build ไม่แตะ
// แบบ ก ที่เจ้าของเคาะ: ชื่อเกมซ้าย = หน้าแรก · ลิงก์กลางเลื่อนข้างได้ · ปุ่ม "เล่นเกม" ขวา · หน้าปัจจุบัน = ทอง + ตัวหนา
export const NAV_START = '<!--NAV:START-->';
export const NAV_END = '<!--NAV:END-->';
export const NAV_CSS_START = '/*NAV-CSS:START*/';
export const NAV_CSS_END = '/*NAV-CSS:END*/';

export const NAV_MENU = [
  ['guide.html', 'วิธีเล่น'],
  ['whatsnew.html', 'แพตช์โน้ต'],
  ['about.html', 'กลไกในเกม'],
  ['worlds.html', 'ชาตินี้ · ปรโลก · ต่างโลก'],
  ['otherworld.html', 'ต่างโลก', 'dark'],
  ['catalog.html', 'การ์ดทั้งหมด'],
  ['gdd.html', 'เอกสารออกแบบเกม (GDD)'],
  ['design.html', 'การออกแบบ'],
];

// เส้นใต้เหลือไว้ให้ hover/focus — หน้าปัจจุบันแยกด้วยสีกับน้ำหนัก (ต่างโลกทองอยู่แล้ว จึงต่างกันที่ตัวหนา)
// 390: ลิงก์กลางล้นแถบ ⇒ เงาจางขอบขวาบอกว่าเลื่อนได้ · nav.top a รีเซ็ตกล่องเอง เพราะบางหน้ามีกฎ a.<ชื่อ> ของตัวเอง (otherworld: a.play)
export const NAV_CSS = `
  nav.top { display: flex; align-items: center; gap: 4px; background: #17110D; border-bottom: 1px solid #5A4630; padding: 0 12px; font-family: Sarabun, sans-serif; line-height: normal; }
  nav.top a { display: inline-block; color: #E3DDD0; text-decoration: none; padding: 0 10px; line-height: 44px; font-size: 14px; font-weight: 400; font-family: inherit; margin: 0; min-height: 0; border: 0; border-radius: 0; background: none; }
  nav.top a.dark { color: #F0D78C; }
  nav.top a[aria-current] { color: #F0D78C; font-weight: 700; }
  nav.top a:hover, nav.top a:focus-visible { text-decoration: underline; text-underline-offset: 4px; outline: none; }
  nav.top .brand { font-weight: 700; color: #F4EFE3; padding-left: 0; white-space: nowrap; }
  nav.top .links { flex: 1; min-width: 0; overflow-x: auto; white-space: nowrap; }
  nav.top a.play { background: #F0D78C; color: #17110D; border-radius: 6px; line-height: 32px; padding: 0 12px; font-weight: 700; white-space: nowrap; }
  @media (max-width: 760px) { nav.top .links { -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent); mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent); } }
`;

// 390: ลิงก์หน้าปัจจุบันอาจอยู่นอกส่วนที่เห็นของแถบที่ล้น ⇒ ตั้ง scrollLeft ของแถบเอง (scrollIntoView เลื่อนทั้งหน้าแนวตั้งด้วย) · ไม่มี JS แถบยังใช้ได้เหมือนเดิม
// คำนวณซ้ำหลังฟอนต์โหลด เพราะความกว้างลิงก์เปลี่ยนเมื่อ Sarabun มาแทนฟอนต์สำรอง
const NAV_SCRIPT = `<script>(()=>{const l=document.querySelector('nav.top .links'),c=l&&l.querySelector('[aria-current]');if(!c)return;const f=()=>{if(l.scrollWidth>l.clientWidth)l.scrollLeft+=c.getBoundingClientRect().left-l.getBoundingClientRect().left-(l.clientWidth-c.offsetWidth)/2};f();document.fonts&&document.fonts.ready.then(f)})()</script>`;

// file = path ใต้ docs/ เช่น gdd.html · design-lore.html · spec/lore-finance-series.html
// หน้า design-<เรื่อง> อยู่ใต้เมนู "การออกแบบ" ⇒ ลิงก์นั้นได้ aria-current="true" (ไม่ใช่ page เพราะไม่ใช่หน้านั้นเอง)
export function navHtml(file) {
  const up = '../'.repeat(file.split('/').length - 1);
  const cur = (href) => (href === file ? ' aria-current="page"' : href === 'design.html' && /^design-.+\.html$/.test(file) ? ' aria-current="true"' : '');
  const a = (href, text, cls) => `<a${cls ? ` class="${cls}"` : ''} href="${up}${href}"${cur(href)}>${text}</a>`;
  const links = NAV_MENU.map(([h, t, c]) => a(h, t, c)).join('');
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
