// หน้าเว็บนอกตัวเกม (B65): ฉีดตัวเลขลงหน้าที่เขียนมือ + สร้างหน้ารวมการ์ดจากแม่แบบ · เรียกจาก build.mjs ทุกครั้ง
import { readFileSync, writeFileSync } from 'node:fs';
import { siteFacts, injectFacts } from './facts.mjs';
import { catalogHtml } from './catalog.mjs';

// หน้าที่เขียนมือแต่มีตัวเลขจาก data — play.html (build สร้าง) · isekai.html (ตัวเกมเลน D) · whatsnew.html (ผู้รวมงานเขียน) ไม่อยู่ในนี้
export const FACT_PAGES = ['index', 'about', 'overview', 'otherworld'];

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
  const cards = injectFacts(readFileSync(at('src/site/cards.html'), 'utf8'), facts, 'src/site/cards.html').replace('<!--__CATALOG__-->', () => catalogHtml(content));
  writeFileSync(at('docs/cards.html'), cards);
  out.push('cards');
  return { facts, pages: out };
}
