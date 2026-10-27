// หน้าสเปกและรีเสิร์ช (B115): แปลง docs/spec/*.md เป็นหน้าเดียวตอน build — ไม่พาผู้อ่านออกไป GitHub
// ไม่มี dependency markdown: รองรับเฉพาะไวยากรณ์ที่ไฟล์ใน docs/spec ใช้จริง (หัวข้อ · รายการซ้อน · ตาราง · โค้ดบล็อก · ตัวหนา · โค้ด · ลิงก์)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { esc } from './catalog.mjs';

export const SPEC_DIR = new URL('../../docs/spec/', import.meta.url);
// ลำดับบนหน้า: แผนที่โปรเจกต์ → แผ่นรีเสิร์ช → ใบงาน 01–14 · ไฟล์ .md ใหม่ใน docs/spec ขึ้นหน้าเองท้ายกลุ่มของมัน
const GROUPS = [
  ['ภาพรวม', (f) => f === 'MAP.md'],
  ['แผ่นรีเสิร์ช', (f) => !f.includes('/') && f !== 'MAP.md'],
  ['ใบงานช่วงสเปก', (f) => f.startsWith('tickets/')],
];

export function specFiles(dir = SPEC_DIR) {
  const top = readdirSync(dir).filter((n) => n.endsWith('.md'));
  const tickets = existsSync(new URL('tickets/', dir)) ? readdirSync(new URL('tickets/', dir)).filter((n) => n.endsWith('.md')).map((n) => `tickets/${n}`) : [];
  return [...top, ...tickets].sort((a, b) => (a === 'MAP.md' ? -1 : b === 'MAP.md' ? 1 : a.localeCompare(b)));
}

export const docId = (f) => `d-${f.replace(/\.md$/, '').replace(/[^A-Za-z0-9]+/g, '-')}`;

// URL เปล่าในเนื้อความ: ตัดวรรคตอนท้าย และวงเล็บปิดที่ไม่มีคู่ (Yama_(Buddhism) ต้องเก็บวงเล็บไว้)
const URL_RE = /https?:\/\/[^\s<>"'`฀-๿·]+/g;
export function trimUrl(u) {
  for (;;) {
    const last = u.at(-1);
    if (/[.,;:!?'\]}]/.test(last)) u = u.slice(0, -1);
    else if (last === ')' && (u.match(/\(/g) ?? []).length < (u.match(/\)/g) ?? []).length) u = u.slice(0, -1);
    else return u;
  }
}
export const bareUrls = (md) => [...md.replace(/<!--[\s\S]*?-->/g, '').matchAll(URL_RE)].map((m) => trimUrl(m[0]));

function makeInline(file, known) {
  const base = new URL(file, 'spec:/');
  // ลิงก์ภายใน: ชี้ไฟล์ .md ใน docs/spec → หัวข้อบนหน้านี้ · ชี้ไฟล์อื่นที่มีจริงใน docs/spec → ไฟล์นั้น · นอกนั้นไม่ทำลิงก์ (หน้าเว็บไม่มีให้ไป)
  const resolve = (ref) => {
    if (/^https?:\/\//.test(ref)) return ref;
    const u = new URL(ref, base);
    if (u.protocol !== 'spec:') return null;
    const p = u.pathname.replace(/^\//, '');
    if (known.has(p)) return `#${docId(p)}`;
    if (p && !p.endsWith('.md') && existsSync(new URL(p, SPEC_DIR))) return `spec/${p}`;
    return null;
  };
  const a = (href, label) => `<a href="${esc(href)}"${/^https?:/.test(href) ? ' rel="noopener"' : ''}>${label}</a>`;
  return (s) => {
    const keep = [];
    const hold = (h) => `\u0000${keep.push(h) - 1}\u0000`;
    let t = s.replace(/`([^`]+)`/g, (m, code) => {
      const href = /^[\w./-]+\.(md|html)$/.test(code) ? resolve(code) : null;
      return hold(href ? a(href, `<code>${esc(code)}</code>`) : `<code>${esc(code)}</code>`);
    });
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, ref) => {
      const href = resolve(ref);
      return hold(href ? a(href, esc(label)) : esc(label));
    });
    t = t.replace(URL_RE, (m) => {
      const u = trimUrl(m);
      return hold(a(u, esc(u))) + m.slice(u.length);
    });
    t = esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return t.replace(/\u0000(\d+)\u0000/g, (m, i) => keep[i]);
  };
}

const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
const LIST = /^(\s*)([-*]|\d+\.)\s+(.*)$/;

// แปลง markdown หนึ่งไฟล์ → { title, heads, html } · หัวข้อ # เป็นชื่อเอกสาร (h2 บนหน้า) ## ลงมาเลื่อนลงหนึ่งชั้น
export function renderDoc(file, md, known = new Set([file])) {
  const id = docId(file);
  const inline = makeInline(file, known);
  const lines = md.replace(/<!--[\s\S]*?-->/g, '').split(/\r?\n/);
  const out = [];
  const heads = [];
  let title = file;
  let para = [];
  const flush = () => {
    if (para.length) out.push(`<p>${para.map(inline).join('<br>')}</p>`);
    para = [];
  };
  for (let i = 0; i < lines.length; ) {
    const line = lines[i];
    if (/^```/.test(line)) {
      flush();
      const lang = line.slice(3).trim();
      const body = [];
      for (i++; i < lines.length && !/^```/.test(lines[i]); i++) body.push(lines[i]);
      i++;
      out.push(`<pre${lang ? ` data-lang="${esc(lang)}"` : ''}><code>${esc(body.join('\n'))}</code></pre>`);
      continue;
    }
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      flush();
      if (h[1].length === 1 && title === file) {
        title = h[2].trim();
      } else {
        const hid = `${id}-h${heads.length + 1}`;
        heads.push({ id: hid, text: h[2].trim(), level: h[1].length });
        const lv = Math.min(h[1].length + 1, 5);
        out.push(`<h${lv} id="${hid}">${inline(h[2].trim())}</h${lv}>`);
      }
      i++;
      continue;
    }
    if (/^\s*\|/.test(line) && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] ?? '')) {
      flush();
      const head = cells(line);
      const rows = [];
      for (i += 2; i < lines.length && /^\s*\|/.test(lines[i]); i++) rows.push(cells(lines[i]));
      out.push(`<div class="tw"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (LIST.test(line)) {
      flush();
      const items = [];
      for (; i < lines.length; i++) {
        const m = LIST.exec(lines[i]);
        if (m) items.push({ depth: m[1].replace(/\t/g, '  ').length, ordered: /\d/.test(m[2]), text: [m[3]] });
        else if (/^\s+\S/.test(lines[i]) && items.length) items.at(-1).text.push(lines[i].trim());
        else break;
      }
      out.push(listHtml(items, inline));
      continue;
    }
    if (!line.trim()) flush();
    else para.push(line.trim());
    i++;
  }
  flush();
  return { file, id, title, heads, html: out.join('\n') };
}

// รายการซ้อนตามระยะย่อหน้า — ย่อหน้าลึกกว่ารายการก่อนหน้า = รายการลูกของมัน
function listHtml(items, inline) {
  let k = 0;
  const level = (depth) => {
    const ordered = items[k].ordered;
    let html = '';
    while (k < items.length && items[k].depth >= depth) {
      const it = items[k++];
      let li = it.text.map(inline).join('<br>');
      if (k < items.length && items[k].depth > it.depth) li += level(items[k].depth);
      html += `<li>${li}</li>`;
    }
    return ordered ? `<ol>${html}</ol>` : `<ul>${html}</ul>`;
  };
  let html = '';
  while (k < items.length) html += level(items[k].depth);
  return html;
}

export function specDocs(dir = SPEC_DIR) {
  const files = specFiles(dir);
  const known = new Set(files);
  return files.map((f) => renderDoc(f, readFileSync(new URL(f, dir), 'utf8'), known));
}

// ไฟล์ HTML ที่วางไว้ใน docs/spec อยู่แล้ว (เช่นแผ่นชุดข้อมูลการเงิน) — ลิงก์ไปตรง ๆ ไม่แปลงซ้ำ
const htmlTitle = (html) => /<title>([^<]*)<\/title>/.exec(html)?.[1]?.trim();
export const specHtmlFiles = (dir = SPEC_DIR) => readdirSync(dir).filter((n) => n.endsWith('.html'));

export function specHtml(content, dir = SPEC_DIR) {
  const docs = specDocs(dir);
  const extra = specHtmlFiles(dir).map((f) => ({ f, title: htmlTitle(readFileSync(new URL(f, dir), 'utf8')) ?? f }));
  const toc = GROUPS.map(([name, pick]) => {
    const ds = docs.filter((d) => pick(d.file));
    const ex = name === 'แผ่นรีเสิร์ช' ? extra : [];
    if (!ds.length && !ex.length) return '';
    const li = ds.map((d) => {
      // ใบงานมีแค่ Question/Answer — ไม่ลงสารบัญย่อย ให้สารบัญสั้น
      const sub = d.file.startsWith('tickets/') ? '' : d.heads.filter((x) => x.level === 2).map((x) => `<a href="#${x.id}">${esc(x.text)}</a>`).join('');
      return `<li><a href="#${d.id}">${esc(d.title)}</a>${sub ? `<div class="sub">${sub}</div>` : ''}</li>`;
    });
    const exLi = ex.map((x) => `<li><a href="spec/${esc(x.f)}">${esc(x.title)}</a> <small>ตารางเต็ม หน้าแยก</small></li>`);
    return `<section><h2>${esc(name)}</h2><ol>${[...li, ...exLi].join('')}</ol></section>`;
  }).join('');
  const body = docs
    .map((d) => `<article class="doc" id="${d.id}"><h2>${esc(d.title)}</h2><p class="src">ไฟล์ต้นฉบับ docs/spec/${esc(d.file)} · <a href="#toc">กลับสารบัญ</a></p>\n${d.html}\n</article>`)
    .join('\n');
  return `<nav class="toc" id="toc" aria-label="สารบัญ">${toc}</nav>\n${body}`;
}
