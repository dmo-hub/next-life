// เลย์เอาต์เว็บเอกสาร (ui-redo 32 · ข้อ 246–249): ขอบเขตหน้า + CSS กลางที่ build ฉีดทุกหน้า
// รายการหน้าคิดจากโฟลเดอร์ docs/ ทุก build ⇒ หน้าใหม่เข้ารายการเอง ไม่มีรายการมือให้ลืม
import { readFileSync, readdirSync } from 'node:fs';
import { MOVED_MARK } from './nav.mjs';

// นอกขอบเขต (ข้อ 25 33): ตัวเกม · หน้าส่งต่อ (เนื้ออยู่ปลายทาง)
const OUT = (f, html) => f === 'play.html' || html.includes(MOVED_MARK);

// กลุ่มในตัวเลือกหน้า + ชนิดความกว้าง: อ่าน = หน้าข้อความยาว · กว้าง = ตาราง/การ์ด · แผนที่ = dev/maps (พื้นมืดตามโลก ข้อ 28)
const READ = ['index.html', 'guide.html', 'whatsnew.html', 'about.html', 'worlds.html', 'otherworld.html', 'spec/lore-finance-series.html'];
export function pageKind(f) {
  if (f.startsWith('dev/maps/')) return 'map';
  return READ.includes(f) ? 'read' : 'wide';
}
export function pageGroup(f) {
  if (!f.startsWith('dev/')) return 'เอกสารผู้เล่น';
  return /^dev\/(design|ui)[^/]*\.html$/.test(f) ? 'การออกแบบ' : 'ห้องผู้พัฒนา';
}

// → [{f, t, g, k}] เรียงตามกลุ่มแล้วตาม path
export function docsScope(docs) {
  const out = [];
  const walk = (dir) => {
    for (const d of readdirSync(new URL(dir, docs), { withFileTypes: true })) {
      const p = `${dir}${d.name}`;
      if (d.isDirectory()) walk(`${p}/`);
      else if (p.endsWith('.html')) {
        const html = readFileSync(new URL(p, docs), 'utf8');
        if (!OUT(p, html)) out.push({ f: p, t: html.match(/<title>([^<]*)<\/title>/)?.[1]?.split(' · ')[0].trim() || p, g: pageGroup(p), k: pageKind(p) });
      }
    }
  };
  walk('');
  const order = ['เอกสารผู้เล่น', 'การออกแบบ', 'ห้องผู้พัฒนา'];
  return out.sort((a, b) => order.indexOf(a.g) - order.indexOf(b.g) || a.f.localeCompare(b.f));
}

// เลย์เอาต์หน้าเอกสาร (ui-redo ข้อ 246–249): build เติม <style> ท้าย <head> ทุกหน้าในขอบเขต ไม่แตะ markup ⇒ data-fact กับ markup ที่สคริปต์หาอยู่ครบ
// แต่ละหน้าเขียน CSS ของตัวเอง ⇒ ค่ากลางต้องมาทีหลังถึงชนะ · ค่าที่เจ้าของให้ตามหน้าเดิม (ระยะบรรทัด · ย่อหน้า · ระยะในช่อง · เส้นกับมุมกล่อง) ไม่เขียนในนี้
export const DOCS_LAYOUT_START = '<!--DOCS-LAYOUT:START-->';
export const DOCS_LAYOUT_END = '<!--DOCS-LAYOUT:END-->';
const LAYOUT_W = { read: 960, wide: 1280, map: 1800 };
// ไม่ทับ: ตัวอย่างการ์ด (.opts) · แถบบน · แถบห้องผู้พัฒนา · กล่องรหัส
const X = ':not(:is(.opts, .nl-nav, nav.top, #nl-gate) *)';
// กล่องมืด (section.dark) มีชุดสีของตัวเอง
const ND = ':not(:is(.dark,.dark *))';
// tokens = หน้าประกาศชุดสีกลาง · dev/maps กับคลังต้นแบบไม่มี ⇒ var(--surface) เสียแล้วล้างพื้น/เส้นเดิมทิ้ง จึงรับแค่ความกว้างกับขอบ
export function docsLayoutCss(kind, tokens = true) {
  const w = LAYOUT_W[kind];
  if (!w) throw new Error(`docsLayoutCss: ไม่รู้จักชนิดหน้า ${kind}`);
  const T = `main table${X}`;
  const B = `main :is(section,.box,.panel,.world,a.card,.card,.tcard)${X}`;
  // แผงข้างของ dev/maps กว้างคงที่ ขอบ 24 จึงดันล้นจอแคบ
  const frame = kind === 'map'
      ? `.wrap{max-width:${w}px;margin-left:auto;margin-right:auto;padding-left:24px;padding-right:24px}.wrap>*{max-width:100%}`
      : `.w${X}{max-width:${w}px!important}body>main:not(:has(.w)):not(#app){max-width:${w}px;margin-left:auto;margin-right:auto}:is(body>main,body>header,body>footer){padding-left:24px;padding-right:24px}`;
  if (!tokens) return frame;
  return [
    frame,
    `main h2${X}:not(:first-child){margin-top:28px}main :is(section,.box)${X}{margin-bottom:17px}`,
    // ตารางกว้างเลื่อนในตัวเองแทนดันทั้งหน้า · ป้าย .st ไม่ตัดบรรทัดเลยดันหน้าล้นเมื่อคอลัมน์เปลี่ยน
    `main${X}{overflow-wrap:anywhere}main .st${X}{white-space:normal;max-width:100%}@media (max-width:640px){main table${X}{display:block;max-width:100%;overflow-x:auto}}`,
    `${T} :is(th,td)${ND}{border:1px solid var(--line)}${T} th${ND}{background:var(--bg);color:var(--ink)}`,
    `${B}{padding:20px 24px;box-shadow:none}${B}:not(.dark){background:var(--surface)}`,
    `main :is(.warn,blockquote,.callout)${X}{border:1px solid var(--line-strong);background:var(--surface);color:var(--ink);border-radius:var(--r)}`,
    `.tag${X}{border-radius:0}`,
  ].join('\n');
}
const hasTokens = (html) => /--surface\s*:/.test(html);
const docsLayoutBlock = (kind, tokens) => `${DOCS_LAYOUT_START}<style>\n${docsLayoutCss(kind, tokens)}\n</style>${DOCS_LAYOUT_END}`;
export function injectDocsLayout(html, kind, where) {
  const a = html.indexOf(DOCS_LAYOUT_START);
  const block = docsLayoutBlock(kind, hasTokens(html));
  if (a >= 0) {
    const b = html.indexOf(DOCS_LAYOUT_END, a);
    if (b < 0) throw new Error(`${where}: ${DOCS_LAYOUT_START} ไม่มีตัวปิด`);
    return html.slice(0, a) + block + html.slice(b + DOCS_LAYOUT_END.length);
  }
  const h = html.indexOf('</head>');
  if (h < 0) throw new Error(`${where}: ไม่มี </head>`);
  return `${html.slice(0, h)}${block}\n${html.slice(h)}`;
}

