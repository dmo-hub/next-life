// หน้าคำตัดสินเกม: แปลง design/*.md (สำเนาคำตัดสินของเจ้าของเกม) เป็นหน้าเว็บ · ใช้ตัวแปลงเดียวกับภาคผนวก GDD
// แยกหน้าตามเรื่อง — รวมทุกไฟล์หน้าเดียวยาวเกินอ่านบนมือถือ · สารบัญ = design.html · ทุกหน้าอยู่ใต้ DESIGN_AT ในห้องผู้พัฒนา
// ชื่อไฟล์ (designPage) ไม่มีโฟลเดอร์ ลิงก์ข้ามหน้าในชุดจึงเป็นชื่อเปล่า · URL เดิมใต้ docs/ เป็นหน้าส่งต่อ (build)
import { readFileSync, readdirSync } from 'node:fs';
import { esc } from './catalog.mjs';
import { renderDoc, docId, SPEC_OPEN } from './spec.mjs';
import { devNavHtml } from './nav.mjs';

export const DESIGN_DIR = new URL('../../design/', import.meta.url);
export const DESIGN_AT = 'dev/';
export const LORE = 'lore';
const LORE_TITLE = 'ข้อมูลอ้างอิง (lore)';
// ในหน้าเรื่อง แผนที่ใบงานขึ้นก่อนคำตัดสิน · ไฟล์อื่นต่อท้ายเรียงชื่อ
const RANK = (f) => (f.endsWith('/MAP.md') ? 0 : f.endsWith('/decisions.md') ? 1 : 2);

export function designFiles(dir = DESIGN_DIR) {
  return readdirSync(dir, { recursive: true })
    .map((f) => f.replace(/\\/g, '/'))
    .filter((f) => f.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b));
}

// เรื่องที่เนื้อน้อยจนหน้าแยกแทบว่าง — ขึ้นท้ายหน้าเรื่องแม่ (MAP ของ three-worlds รวมสองเรื่องนี้ไว้แล้ว)
export const DESIGN_MERGE = { isekai: 'three-worlds', 'life-goal': 'three-worlds' };
// ต้นฉบับบางไฟล์ยังอ้างชื่อไฟล์ก่อนย้ายเข้าโฟลเดอร์ (path นับจากราก design/) → ชื่อปัจจุบัน
export const DESIGN_RENAMED = {
  'lore-afterlife.md': 'lore/afterlife.md',
  'lore-era-data.md': 'lore/era-data.md',
  'lore-finance-belief.md': 'lore/finance-belief.md',
  'ui-redo-decisions.md': 'ui-redo/decisions.md',
};
const dirOf = (f) => (f.includes('/') ? f.split('/')[0] : '');

// ไฟล์ชั้นบนสุด → design.html · lore/ → design-lore.html · <เรื่อง>/ → design-<เรื่อง>.html (เรื่องใน DESIGN_MERGE ไปหน้าเรื่องแม่)
export const designPage = (f) => (f.includes('/') ? `design-${DESIGN_MERGE[dirOf(f)] ?? dirOf(f)}.html` : 'design.html');

export function designDocs(dir = DESIGN_DIR) {
  const files = designFiles(dir);
  const known = new Set(files);
  return files.map((f) => {
    const page = designPage(f);
    // ลิงก์ไปไฟล์นอก design/ (โค้ด · ใบงานนอก repo) ไม่มีหน้าให้ไป ⇒ เป็นข้อความ
    const link = { doc: (p) => (designPage(p) === page ? '' : designPage(p)) + `#${docId(p)}`, asset: () => null, alias: DESIGN_RENAMED };
    return { ...renderDoc(f, readFileSync(new URL(f, dir), 'utf8'), known, link), page };
  });
}

const titleOf = (d) => d.title.replace(/^(MAP|decisions):\s*/i, '').replace(/\s*—\s*decisions$/i, '');
const subToc = (d) => d.heads.filter((x) => x.level === 2).map((x) => `<a href="#${x.id}">${esc(x.text)}</a>`).join('');
const docBlock = (d, open) =>
  `<details class="doc" id="${d.id}"${open ? ' open' : ''}><summary>${esc(d.title)}</summary><p class="src">ไฟล์ต้นฉบับ design/${esc(d.file)} · <a href="#design-toc">กลับสารบัญ</a></p>\n${d.html}\n</details>`;

// คืน [[ชื่อไฟล์, { title, lead, body }]] ต่อหน้า — แม่แบบ src/site/design.html ห่อหัว/ท้าย
export function designPages(dir = DESIGN_DIR) {
  const docs = designDocs(dir);
  const byPage = new Map();
  for (const d of docs) byPage.set(d.page, [...(byPage.get(d.page) ?? []), d]);
  const topics = [...byPage.keys()].filter((p) => p !== 'design.html' && p !== `design-${LORE}.html`).sort();
  const topicOf = (p) => p.slice(7, -5);
  // เรื่องแม่ขึ้นก่อน เรื่องที่รวมเข้ามาต่อท้ายเรียงชื่อ · ในเรื่องเดียวกัน MAP → decisions → ที่เหลือ
  const sorted = (p) =>
    [...byPage.get(p)].sort(
      (a, b) => (dirOf(a.file) !== topicOf(p)) - (dirOf(b.file) !== topicOf(p)) || dirOf(a.file).localeCompare(dirOf(b.file)) || RANK(a.file) - RANK(b.file) || a.file.localeCompare(b.file),
    );
  const merged = (p) => [...new Set(byPage.get(p).map((d) => dirOf(d.file)))].filter((x) => x !== topicOf(p)).sort();
  const fileLabel = (p, d) => (dirOf(d.file) === topicOf(p) ? '' : `${dirOf(d.file)}/`) + d.file.split('/').at(-1).replace(/\.md$/, '');
  const pageTitle = (p) => (p === `design-${LORE}.html` ? LORE_TITLE : titleOf(sorted(p)[0]));
  const card = (p, note) => `<li><a href="${p}">${esc(pageTitle(p))}</a> <small>${note}</small></li>`;

  const out = [];
  const top = byPage.get('design.html') ?? [];
  const index = [
    `<nav class="spec-toc" id="design-toc" aria-label="สารบัญคำตัดสินเกม">`,
    `<div><h3>เรื่องที่ออกแบบ</h3><ol>${topics.map((p) => card(p, sorted(p).map((d) => esc(fileLabel(p, d))).join(' · '))).join('')}</ol></div>`,
    byPage.has(`design-${LORE}.html`) ? `<div><h3>ข้อมูลอ้างอิง</h3><ol>${card(`design-${LORE}.html`, `${byPage.get(`design-${LORE}.html`).length} ไฟล์`)}</ol></div>` : '',
    `<div><h3>ในหน้านี้</h3><ol>${top.map((d) => `<li><a href="#${d.id}">${esc(d.title)}</a></li>`).join('')}</ol></div>`,
    `</nav>`,
  ].join('');
  out.push(['design.html', { title: 'คำตัดสินเกม', lead: 'คำตัดสินของเจ้าของเกมแยกตามเรื่อง ตามสำเนาใน design/ ของ repo · อ่านอย่างเดียว', body: `${index}\n${top.map((d) => docBlock(d, true)).join('\n')}` }]);

  for (const p of [...topics, `design-${LORE}.html`].filter((x) => byPage.has(x))) {
    const ds = sorted(p);
    const lore = p === `design-${LORE}.html`;
    const also = merged(p);
    const toc = `<nav class="spec-toc" id="design-toc" aria-label="สารบัญหน้านี้"><div><h3>ในหน้านี้</h3><ol>${ds
      .map((d) => {
        const sub = lore ? '' : subToc(d);
        return `<li><a href="#${d.id}">${esc(d.title)}</a>${sub ? `<div class="sub">${sub}</div>` : ''}</li>`;
      })
      .join('')}</ol></div></nav>`;
    // lore ยาวรวมกันหลายเท่าของหน้าเรื่อง — พับรายไฟล์ ลิงก์จากสารบัญกางให้เอง · หน้าเรื่องมี 1–2 ไฟล์ กางไว้เลย
    out.push([p, { title: pageTitle(p), lead: lore ? 'ข้อมูลที่ใช้ตอนเขียนเนื้อหาและตัวเลข แหล่งที่มาอยู่ในแต่ละไฟล์' : `เรื่อง ${topicOf(p)}${also.length ? ` (รวม ${also.join(' · ')})` : ''} · แผนที่ใบงานและคำตัดสิน`, body: `${toc}\n${ds.map((d) => docBlock(d, !lore)).join('\n')}\n${SPEC_OPEN}` }]);
  }
  return out;
}

// file = ชื่อหน้า (design-lore.html) — แถบห้องผู้พัฒนารู้ว่าหน้าไหนเป็นหน้าปัจจุบัน
export function designHtml(tpl, page, file) {
  return tpl
    .replace(/<!--__TITLE__-->/g, () => esc(page.title))
    .replace('<!--__LEAD__-->', () => esc(page.lead))
    .replace('<!--__DEVNAV__-->', () => devNavHtml(DESIGN_AT + file))
    .replace('<!--__DESIGN__-->', () => page.body);
}
