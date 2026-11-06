// หน้า tweak เว็บเอกสาร (ui-redo 32): หน้าเดียวสลับดูหน้าจริงทุกหน้าในขอบเขต ปรับค่ากลางชุดเดียว
// รายการหน้าคิดจากโฟลเดอร์ docs/ ทุก build ⇒ หน้าใหม่เข้ารายการเอง ไม่มีรายการมือให้ลืม · build ฉีดรายการ + ตัวแปร :root ของหน้าเล่นระหว่าง marker
// หน้าตัวอย่างเปิดหน้าจริงใน iframe แล้วเติม CSS ทับตอนเปิด (ต้นทางเดียวกัน) — เนื้อจาก build ล่าสุดเสมอ ไม่วาดใหม่
import { readFileSync, readdirSync } from 'node:fs';
import { MOVED_MARK } from './nav.mjs';
import { cssVars } from './ui.mjs';

export const DOCS_TWEAK_PAGE = 'dev/tweak/docs-tweak.html';
// หน้า tweak T12 (ui-redo 122) ใช้รายการหน้าชุดเดียวกัน ⇒ ขอบเขตสองหน้าไม่แยกกัน
export const T12_DOCS_PAGE = 'dev/tweak/t12-docs-tweak.html';
export const DOCS_TWEAK_PAGES = [DOCS_TWEAK_PAGE, T12_DOCS_PAGE];
export const DOCS_TWEAK_START = '/*DOCS-TWEAK:START*/';
export const DOCS_TWEAK_END = '/*DOCS-TWEAK:END*/';

// นอกขอบเขต (ข้อ 25 33): ตัวเกม · คลังเก่าของเว็บ · หน้า tweak ทุกหน้า (บางหน้าใน dev/ui-redo/ ชื่อไม่มีคำ tweak) · หน้าส่งต่อ (เนื้ออยู่ปลายทาง)
const OUT = (f, html) => f === 'play.html' || f.startsWith('archive/') || f.startsWith('dev/ui-redo/') || f.startsWith('dev/tweak/') || /tweak[^/]*\.html$/.test(f) || html.includes(MOVED_MARK);

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

// ฐานสี/ฟอนต์/มุม = ตัวแปร :root ตัวแรกของหน้าเล่น (ข้อ 26 32) ไม่คัดลอกค่า
export function playRootVars(tpl) {
  const g = cssVars(tpl.match(/<style>([\s\S]*?)<\/style>/)[1]).find((x) => x.sel === ':root');
  if (!g) throw new Error('src/ui/template.html: ไม่มี :root ที่มีแต่ตัวแปร');
  return Object.fromEntries(g.vars);
}

export const docsTweakData = (docs, tpl) => ({ pages: docsScope(docs), vars: playRootVars(tpl) });

export function injectDocsTweak(html, data, where) {
  const a = html.indexOf(DOCS_TWEAK_START);
  const b = html.indexOf(DOCS_TWEAK_END);
  if (a < 0 || b < a || html.indexOf(DOCS_TWEAK_START, a + 1) >= 0) throw new Error(`${where}: ต้องมี ${DOCS_TWEAK_START} … ${DOCS_TWEAK_END} ชุดเดียว`);
  return html.slice(0, a + DOCS_TWEAK_START.length) + JSON.stringify(data).replace(/</g, '\\u003c') + html.slice(b);
}

// ส่วนระหว่าง marker — ด่านเทียบกับขอบเขตตอนนี้ · null = ไม่มี/อ่านไม่ได้
export function docsTweakBlock(html) {
  const a = html.indexOf(DOCS_TWEAK_START);
  const b = html.indexOf(DOCS_TWEAK_END);
  if (a < 0 || b < a) return null;
  try {
    return JSON.parse(html.slice(a + DOCS_TWEAK_START.length, b));
  } catch {
    return null;
  }
}
