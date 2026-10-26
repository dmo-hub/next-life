// ด่านหน้าเว็บ (B65): ตัวเลขบนหน้าเท่าค่าจริง · build ใหม่แล้วเลขเปลี่ยนตามข้อมูล (ตัวควบคุม) · ลิงก์ในเว็บไม่ตาย
// · หน้ารวมการ์ดไม่มีผล/บุญบาป/น้ำหนัก · ทุกการ์ดใน content อยู่บนหน้ารวมการ์ด
// · หน้าเฉลย (B88) ครบทุกการ์ด/ตัวเลือก/ผลสุ่ม และเฉลยจริง — กฎ "ไม่หลุดบุญบาป" ของหน้ารวมการ์ดไม่ใช้กับหน้านี้
import { readFileSync, existsSync } from 'node:fs';
import { loadContent } from '../src/node/load.mjs';
import { siteFacts, injectFacts } from '../src/site/facts.mjs';
import { catalogHtml } from '../src/site/catalog.mjs';
import { FACT_PAGES, GEN_PAGES } from '../src/site/build.mjs';
import { meritName, meritId, MERIT_WEIGHTS } from '../src/engine/index.mjs';

const docs = new URL('../docs/', import.meta.url);
const read = (p) => readFileSync(new URL(p, docs), 'utf8');
const content = loadContent();
const facts = siteFacts(content);
let fail = 0;
const check = (name, bad, extra = '') => {
  console.log(`${name}${extra} → ${bad ? 'ตก' : 'ผ่าน'}`);
  if (bad) fail++;
};

// 1) ตัวเลขบนหน้า = ค่าที่คิดจากข้อมูลตอนนี้ (หน้าที่ยังไม่ได้ build ใหม่หลังแก้ข้อมูล = ตก)
const pages = [...FACT_PAGES, ...GEN_PAGES.map(([name]) => name)];
let seen = 0;
const wrong = [];
for (const p of pages) {
  for (const [, key, val] of read(`${p}.html`).matchAll(/data-fact="([^"]+)"[^>]*>([^<]*)</g)) {
    seen++;
    if (facts[key] !== val) wrong.push(`${p}.html ${key}: หน้า "${val}" ค่าจริง "${facts[key]}"`);
  }
}
check('ตัวเลขบนหน้าเท่าค่าจริง', wrong.length || !seen, ` ${seen} จุด ใน ${pages.length} หน้า${wrong.length ? ` · ผิด ${wrong.length}: ${wrong.slice(0, 5).join(' | ')}` : ''}`);

// 2) ตัวควบคุม: ข้อมูลเปลี่ยน (ตัดการ์ดออก 1 ใบ · ฉายาหาย 1 ตัว) ⇒ เลขที่ฉีดต้องเปลี่ยนตาม — ไม่งั้นข้อ 1 ผ่านเพราะเขียนเลขมือตรงกันพอดี
const less = { ...content, events: content.events.slice(1) };
const f2 = { ...siteFacts(less), titles: String(Number(facts.titles) - 1) };
const probe = injectFacts(read('index.html'), f2);
const moved = ['cards', 'titles'].every((k) => probe.includes(`data-fact="${k}">${f2[k]}<`) && f2[k] !== facts[k]);
check('ตัวควบคุม: ข้อมูลเปลี่ยนแล้วเลขบนหน้าเปลี่ยนตาม', !moved, ` (การ์ด ${facts.cards} → ${f2.cards} · ฉายา ${facts.titles} → ${f2.titles})`);

// 3) ลิงก์ภายในเว็บไม่ตาย (ไฟล์ · รูป · ที่มาจากหน้าใน docs/ และ docs/spec/ ที่หน้าเว็บลิงก์ถึง)
const all = [...pages, 'cards', 'whatsnew', 'archive/cards-v1', 'archive/overview-v1'];
const dead = [];
for (const p of all) {
  const html = read(`${p}.html`);
  const base = new URL(`${p}.html`, docs);
  for (const [, ref] of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    if (/^(https?:|mailto:|data:|javascript:)/.test(ref)) continue;
    if (!existsSync(new URL(ref, base))) dead.push(`${p}.html → ${ref}`);
  }
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) if (!html.includes(`id="${id}"`)) dead.push(`${p}.html → #${id}`);
}
check('ลิงก์ภายในไม่ตาย', dead.length, ` ${all.length} หน้า${dead.length ? ` · ตาย ${dead.length}: ${dead.slice(0, 6).join(' | ')}` : ''}`);

// 4) หน้ารวมการ์ด: ครบทุกใบ และไม่มีค่าที่ผู้เล่นไม่เห็นบนจอ
const cards = read('catalog.html');
const shown = (cards.match(/<article class="c /g) ?? []).length;
check('หน้ารวมการ์ดมีครบทุกใบ', shown !== content.events.length, ` ${shown}/${content.events.length}`);
const cats = Object.keys(MERIT_WEIGHTS).flatMap((id) => [id, meritName(id)]).filter((s) => s && s !== 'neutral' && s.length > 1);
const leak = [/"weight"|multipliers|"merit"|outcomes/, /บัญชีบุญบาป\s*[-+]?\d/, /[+-]\d+\s*(?:สุขภาพ|ความสุข|ความรู้|ความสัมพันธ์|คอนเน็คชั่น)/];
const leaks = leak.filter((re) => re.test(catalogHtml(content))).map(String);
// ชื่อหมวดบุญบาปภาษาไทยอาจเป็นคำธรรมดาในข้อความการ์ด — นับเฉพาะ id อังกฤษของหมวด
const ids = cats.filter((s) => /^[a-z_]+$/.test(s) && new RegExp(`\\b${s}\\b`).test(cards));
check('หน้ารวมการ์ดไม่มีผล/น้ำหนัก/ป้ายบุญบาป', leaks.length || ids.length, leaks.length || ids.length ? ` · เจอ ${[...leaks, ...ids].join(' ')}` : '');

// 5) หน้าเฉลย: นับชิ้นบนหน้าเทียบ content ตรง ๆ — ตัวสร้างทำตกหล่นสักทาง (ตัวเลือกซ่อน · ผลสุ่ม · ป้ายบุญบาป) เลขจะไม่เท่า
const spoil = read('spoilers.html');
const nodes = content.events.flatMap((e) => e.choices.flatMap((c) => [c, ...(c.outcomes ?? [])]));
const want = {
  การ์ด: content.events.length,
  ตัวเลือก: content.events.reduce((s, e) => s + e.choices.length, 0),
  ผลสุ่ม: nodes.filter((n) => n.weight !== undefined).length,
  ป้ายบุญบาป: nodes.flatMap((n) => n.merit ?? []).filter((t) => meritId(t.cat) !== 'neutral').length,
};
const got = {
  การ์ด: (spoil.match(/<article class="c /g) ?? []).length,
  ตัวเลือก: (spoil.match(/<p class="ch">/g) ?? []).length,
  ผลสุ่ม: (spoil.match(/<b class="pct">/g) ?? []).length,
  ป้ายบุญบาป: (spoil.match(/<span class="m (?:good|sin)">/g) ?? []).length,
};
const off = Object.keys(want).filter((k) => want[k] !== got[k] || !want[k]);
check('หน้าเฉลยครบทุกการ์ด ตัวเลือก ผลสุ่ม ป้ายบุญบาป', off.length, ` ${Object.keys(want).map((k) => `${k} ${got[k]}/${want[k]}`).join(' · ')}`);
check('หน้ารวมการ์ดลิงก์ไปหน้าเฉลย และหน้าเฉลยมีป้ายเตือนสปอยล์', !cards.includes('href="spoilers.html"') || !spoil.includes('class="warn"'));

console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
process.exit(fail ? 1 : 0);
