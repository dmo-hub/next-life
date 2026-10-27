// หน้าเว็บนอกตัวเกม (B65): ฉีดตัวเลขลงหน้าที่เขียนมือ + สร้างหน้ารวมการ์ดและหน้าเฉลยจากแม่แบบ · เรียกจาก build.mjs ทุกครั้ง
import { readFileSync, writeFileSync } from 'node:fs';
import { siteFacts, injectFacts } from './facts.mjs';
import { catalogHtml } from './catalog.mjs';
import { spoilersHtml } from './spoilers.mjs';
import { specHtml } from './spec.mjs';

// หน้าที่เขียนมือแต่มีตัวเลขจาก data — play.html (build สร้าง) · isekai.html (ตัวเกมเลน D) · whatsnew.html (ผู้รวมงานเขียน) ไม่อยู่ในนี้
export const FACT_PAGES = ['index', 'about', 'overview', 'otherworld'];
// หน้าที่ build สร้างทั้งหน้าจากแม่แบบ src/site/<ชื่อ>.html — หน้าเฉลย (B88) แยกจากหน้ารวมการ์ดเพราะหน้ารวมการ์ดห้ามเผยผล/บุญบาป
export const GEN_PAGES = [
  ['catalog', '<!--__CATALOG__-->', catalogHtml],
  ['spoilers', '<!--__SPOILERS__-->', spoilersHtml],
  // หน้าสเปก (B115) แปลงจาก docs/spec/*.md — แทนลิงก์ไปหน้า tree บน GitHub
  ['spec', '<!--__SPEC__-->', specHtml],
];

export function buildSite(content, root = new URL('../../', import.meta.url), facts = siteFacts(content)) {
  const at = (p) => new URL(p, root);
  const out = [];
  for (const name of FACT_PAGES) {
    const file = at(`docs/${name}.html`);
    const html = readFileSync(file, 'utf8');
    const next = injectFacts(html, facts, `docs/${name}.html`);
    if (next !== html) writeFileSync(file, next);
    out.push(name);
  }
  for (const [name, slot, html] of GEN_PAGES) {
    const page = injectFacts(readFileSync(at(`src/site/${name}.html`), 'utf8'), facts, `src/site/${name}.html`).replace(slot, () => html(content));
    writeFileSync(at(`docs/${name}.html`), page);
    out.push(name);
  }
  return { facts, pages: out };
}
