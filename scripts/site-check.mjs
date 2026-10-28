// ด่านหน้าเว็บ (B65): ตัวเลขบนหน้าเท่าค่าจริง · build ใหม่แล้วเลขเปลี่ยนตามข้อมูล (ตัวควบคุม) · ลิงก์ในเว็บไม่ตาย
// · หน้ารวมการ์ดไม่มีผล/บุญบาป/น้ำหนัก · ทุกการ์ดใน content อยู่บนหน้ารวมการ์ด
// · ส่วนต่างโลก (B88b) ทั้งสองหน้าครบทุกการ์ด · หน้ารวมการ์ดไม่มีผลสำเร็จ/พลาด ความยาก หรือตอนจบ
// · หน้าเฉลย (B88) ครบทุกการ์ด/ตัวเลือก/ผลสุ่ม และเฉลยจริง — กฎ "ไม่หลุดบุญบาป" ของหน้ารวมการ์ดไม่ใช้กับหน้านี้
import { readFileSync, existsSync } from 'node:fs';
import { loadContent } from '../src/node/load.mjs';
import { siteFacts, injectFacts } from '../src/site/facts.mjs';
import { catalogHtml } from '../src/site/catalog.mjs';
import { FACT_PAGES, GEN_PAGES } from '../src/site/build.mjs';
import { meritName, meritId, MERIT_WEIGHTS, ISEKAI_EVENTS, ISEKAI_WORLDS, ISEKAI_SKILLS } from '../src/engine/index.mjs';
import { isekaiCardCount, ISEKAI_SECTION } from '../src/site/otherworld.mjs';
import { specFiles, specHtmlFiles, bareUrls, docId, SPEC_DIR } from '../src/site/spec.mjs';
import { BTN } from '../src/ui/labels.mjs';
import { BTN_HELP } from '../src/site/guide.mjs';
import { injectDemo, DEMO_START, DEMO_END } from '../src/site/demo.mjs';

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
// ส่วนต่างโลกต่อท้ายหน้า (otherworld.mjs) — แยกนับที่หัวข้อนั้น ไม่ให้เลขการ์ดชาติไทยปนการ์ดต่างโลก
const cut = (html) => {
  const i = html.indexOf(`<summary>${ISEKAI_SECTION} `);
  return i < 0 ? [html, ''] : [html.slice(0, i), html.slice(i)];
};
const escHtml = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cards = read('catalog.html');
const [cardsTh, cardsIsk] = cut(cards);
const shown = (cardsTh.match(/<article class="c /g) ?? []).length;
check('หน้ารวมการ์ดมีครบทุกใบ', shown !== content.events.length, ` ${shown}/${content.events.length}`);
const cats = Object.keys(MERIT_WEIGHTS).flatMap((id) => [id, meritName(id)]).filter((s) => s && s !== 'neutral' && s.length > 1);
const leak = [/"weight"|multipliers|"merit"|outcomes/, /บัญชีบุญบาป\s*[-+]?\d/, /[+-]\d+\s*(?:สุขภาพ|ความสุข|ความรู้|ความสัมพันธ์|คอนเน็คชั่น)/];
const leaks = leak.filter((re) => re.test(catalogHtml(content))).map(String);
// ชื่อหมวดบุญบาปภาษาไทยอาจเป็นคำธรรมดาในข้อความการ์ด — นับเฉพาะ id อังกฤษของหมวด
const ids = cats.filter((s) => /^[a-z_]+$/.test(s) && new RegExp(`\\b${s}\\b`).test(cards));
check('หน้ารวมการ์ดไม่มีผล/น้ำหนัก/ป้ายบุญบาป', leaks.length || ids.length, leaks.length || ids.length ? ` · เจอ ${[...leaks, ...ids].join(' ')}` : '');

// 5) หน้าเฉลย: นับชิ้นบนหน้าเทียบ content ตรง ๆ — ตัวสร้างทำตกหล่นสักทาง (ตัวเลือกซ่อน · ผลสุ่ม · ป้ายบุญบาป) เลขจะไม่เท่า
const spoil = read('spoilers.html');
const [spoilTh, spoilIsk] = cut(spoil);
const nodes = content.events.flatMap((e) => e.choices.flatMap((c) => [c, ...(c.outcomes ?? [])]));
const want = {
  การ์ด: content.events.length,
  ตัวเลือก: content.events.reduce((s, e) => s + e.choices.length, 0),
  ผลสุ่ม: nodes.filter((n) => n.weight !== undefined).length,
  ป้ายบุญบาป: nodes.flatMap((n) => n.merit ?? []).filter((t) => meritId(t.cat) !== 'neutral').length,
};
const got = {
  การ์ด: (spoilTh.match(/<article class="c /g) ?? []).length,
  ตัวเลือก: (spoilTh.match(/<p class="ch">/g) ?? []).length,
  ผลสุ่ม: (spoilTh.match(/<b class="pct">/g) ?? []).length,
  ป้ายบุญบาป: (spoilTh.match(/<span class="m (?:good|sin)">/g) ?? []).length,
};
const off = Object.keys(want).filter((k) => want[k] !== got[k] || !want[k]);
check('หน้าเฉลยครบทุกการ์ด ตัวเลือก ผลสุ่ม ป้ายบุญบาป', off.length, ` ${Object.keys(want).map((k) => `${k} ${got[k]}/${want[k]}`).join(' · ')}`);
// 6) ส่วนต่างโลก: นับเทียบโมดูลในเอนจินตรง ๆ · หน้ารวมการ์ดห้ามมีข้อความผลสำเร็จ/พลาด ชื่อตอนจบ หรือความยาก
const iskWant = {
  การ์ด: isekaiCardCount(),
  ตัวเลือก: ISEKAI_EVENTS.reduce((s, e) => s + e.choices.length, 0),
  ผล: ISEKAI_EVENTS.reduce((s, e) => s + e.choices.reduce((n, c) => n + (c.stat ? 2 : 1), 0), 0),
  ตอนจบ: Object.values(ISEKAI_WORLDS).reduce((s, w) => s + new Set(['best', 'good', 'bad', w.special[1]]).size, 0),
  โลก: Object.keys(ISEKAI_WORLDS).length,
  สกิล: Object.keys(ISEKAI_SKILLS).length,
};
const iskGot = {
  การ์ด: (spoilIsk.match(/<article class="c x"/g) ?? []).length,
  ตัวเลือก: (spoilIsk.match(/<p class="ch">/g) ?? []).length,
  ผล: (spoilIsk.match(/<b class="rk">/g) ?? []).length,
  ตอนจบ: (spoilIsk.match(/<li class="end">/g) ?? []).length,
  โลก: Object.values(ISEKAI_WORLDS).filter((w) => spoilIsk.includes(`<b>${escHtml(w.name)}</b>`)).length,
  สกิล: Object.values(ISEKAI_SKILLS).filter((x) => spoilIsk.includes(`<b>${escHtml(x.name)}</b>`)).length,
};
const iskOff = Object.keys(iskWant).filter((k) => iskWant[k] !== iskGot[k] || !iskWant[k]);
check('หน้าเฉลยส่วนต่างโลกครบ', iskOff.length, ` ${Object.keys(iskWant).map((k) => `${k} ${iskGot[k]}/${iskWant[k]}`).join(' · ')}`);
const catIsk = (cardsIsk.match(/<article class="c x"/g) ?? []).length;
const catFull = ISEKAI_EVENTS.filter((e) => cardsIsk.includes(`<h4>${escHtml(e.title)}</h4>`) && e.choices.every((c) => cardsIsk.includes(`<li>${escHtml(c.t)}</li>`))).length;
check('หน้ารวมการ์ดมีส่วนต่างโลกครบ', catIsk !== isekaiCardCount() || catFull !== ISEKAI_EVENTS.length, ` การ์ด ${catIsk}/${isekaiCardCount()} · เหตุการณ์ที่ชื่อและตัวเลือกครบ ${catFull}/${ISEKAI_EVENTS.length}`);
const hidden = [
  ...ISEKAI_EVENTS.flatMap((e) => e.choices.flatMap((c) => (c.stat ? [c.win.text, c.lose.text] : [c.text]))),
  ...Object.values(ISEKAI_WORLDS).flatMap((w) => Object.values(w.end).map(([title]) => title)),
];
const iskLeak = hidden.filter((t) => cards.includes(escHtml(t)));
if (/ความยาก|class="rk"/.test(cardsIsk)) iskLeak.push('ความยาก/ผล');
check('หน้ารวมการ์ดส่วนต่างโลกไม่เฉลยผลหรือตอนจบ', iskLeak.length || !cardsIsk, iskLeak.length ? ` · เจอ ${iskLeak.slice(0, 3).join(' | ')}` : ` (ตรวจ ${hidden.length} ข้อความ)`);
check('หน้ารวมการ์ดลิงก์ไปหน้าเฉลย และหน้าเฉลยมีป้ายเตือนสปอยล์', !cards.includes('href="spoilers.html"') || !spoil.includes('class="warn"'));

// 7) หน้าสเปก (B115): ทุกไฟล์ .md ใน docs/spec มีหัวข้อบนหน้า · URL อ้างอิงทุกตัวในต้นฉบับกดได้ · หน้าเว็บไม่พาไปหน้า tree/blob บน GitHub อีก
const spec = read('spec.html');
const specHref = new Set([...spec.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&')));
const urlsIn = (hrefs) => specFiles().flatMap((f) => bareUrls(readFileSync(new URL(f, SPEC_DIR), 'utf8')).filter((u) => !hrefs.has(u)).map((u) => `${f} ${u}`));
const noDoc = specFiles().filter((f) => !spec.includes(`<article class="doc" id="${docId(f)}">`));
const noHtml = specHtmlFiles().filter((f) => !specHref.has(`spec/${f}`));
const unlinked = urlsIn(specHref);
// ตัวควบคุม: ตัด URL อ้างอิงตัวแรกออกจากชุด href แล้วด่านต้องจับได้ — กันด่านที่ผ่านเพราะนับไม่เจออะไรเลย
const firstUrl = specFiles().flatMap((f) => bareUrls(readFileSync(new URL(f, SPEC_DIR), 'utf8')))[0];
const caught = firstUrl && urlsIn(new Set([...specHref].filter((h) => h !== firstUrl))).length > 0;
check('หน้าสเปกครบทุกไฟล์และลิงก์อ้างอิงกดได้', noDoc.length || noHtml.length || unlinked.length || !caught, ` ไฟล์ ${specFiles().length - noDoc.length}/${specFiles().length} · URL ไม่เป็นลิงก์ ${unlinked.length}${unlinked.length ? `: ${unlinked.slice(0, 3).join(' | ')}` : ''}${noHtml.length ? ` · ไม่มีลิงก์ ${noHtml.join(' ')}` : ''} · ตัวควบคุม${caught ? 'จับได้' : 'จับไม่ได้'}`);
const gh = all.flatMap((p) => [...read(`${p}.html`).matchAll(/https?:\/\/github\.com\/[^"\s]*\/(?:tree|blob)\/[^"\s]*/g)].map((m) => `${p}.html → ${m[0]}`));
check('หน้าเว็บไม่ลิงก์ไปหน้า tree/blob บน GitHub', gh.length, ` ${all.length} หน้า${gh.length ? ` · เจอ ${gh.slice(0, 3).join(' | ')}` : ''}`);

// 8) คู่มือ (B121): ป้ายปุ่มทุกตัวในค่ากลางขึ้นคู่มือพร้อมคำอธิบาย · หน้าจอเกมไม่เขียนป้ายเหล่านั้นตรงซ้ำ (ไม่งั้นแก้ค่ากลางแล้วเกมไม่ตาม)
const guide = read('guide.html');
const appSrc = readFileSync(new URL('../src/ui/app.mjs', import.meta.url), 'utf8');
const literal = (src) => Object.values(BTN).filter((v) => src.includes(`button('${v}'`));
const noGuide = Object.entries(BTN).filter(([k, v]) => !guide.includes(`<b class="btn">${v}</b>`) || !BTN_HELP[k]);
// ตัวควบคุม: ซอร์สที่เขียนป้ายตรงต้องถูกจับ
const litCaught = literal(`button('${BTN.next}', null, f)`).length === 1;
check('คู่มือมีป้ายปุ่มจากค่ากลางครบ และเกมไม่เขียนป้ายซ้ำ', noGuide.length || literal(appSrc).length || !litCaught, ` ปุ่ม ${Object.keys(BTN).length - noGuide.length}/${Object.keys(BTN).length}${literal(appSrc).length ? ` · เขียนตรง: ${literal(appSrc).join(' ')}` : ''} · ตัวควบคุม${litCaught ? 'จับได้' : 'จับไม่ได้'}`);

// 9) เลขรุ่นในเกมลิงก์แพตช์โน้ต (B121): text fragment เลื่อนไปที่คำแรกที่ตรง ⇒ เลขรุ่นแต่ละตัวต้องโผล่ครั้งแรกที่หัวข้อของรุ่นนั้น
const play = read('play.html');
const notes = read('whatsnew.html');
const vers = [...notes.matchAll(/<h3>(v\d+\.\d+\.\d+)/g)].map((m) => [m[1], m.index + 4]);
const early = vers.filter(([v, at]) => notes.search(new RegExp(`${v.replace(/\./g, '\\.')}(?!\\d)`)) !== at).map(([v]) => v);
check('เลขรุ่นในเกมเป็นลิงก์แพตช์โน้ต และหัวข้อแต่ละรุ่นเป็นจุดแรกที่เลขนั้นโผล่', !play.includes('whatsnew.html#:~:text=') || !play.includes('<a id="appVer"') || !vers.length || early.length, ` ${vers.length} รุ่น${early.length ? ` · โผล่ก่อนหัวข้อ: ${early.slice(0, 5).join(' ')}` : ''}`);

// 10) เดโมการ์ดหน้าแรก (B121): ทุกทางมีผลให้อ่าน มีข้อความผลจริงอย่างน้อยหนึ่งทาง ไม่แตะ storage/network · build ซ้ำได้หน้าเดิม
const index = read('index.html');
const demo = index.slice(index.indexOf(DEMO_START), index.indexOf(DEMO_END));
const res = [...demo.matchAll(/data-res="([^"]*)"/g)].map((m) => m[1]);
const real = res.filter((r) => !r.startsWith('ผลลงที่ค่าสถานะ')).length;
const touches = /localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest/.test(demo);
const same = injectDemo(index, content) === index;
// B133 สายเรื่องต่อ: ทุกขั้นมีทางที่กดได้และทุกทางมีผล · ปลายทางของทุกปุ่มมีขั้นนั้นจริง · ทุกขั้นที่ซ่อนมีปุ่มพาไปถึง · มีเรื่องต่ออย่างน้อยหนึ่งทาง
const steps = [...demo.matchAll(/<div class="tstep" data-step="(\d+)"[^>]*>([\s\S]*?)<p class="tres"/g)].map((m) => ({ id: m[1], btns: [...m[2].matchAll(/<button [^>]*>/g)].map((b) => b[0]) }));
const live = (s) => s.btns.filter((b) => !b.includes('data-lock'));
const gos = steps.flatMap((s) => live(s).map((b) => b.match(/data-go="(\d+)"/)?.[1]).filter(Boolean));
const stepIds = new Set(steps.map((s) => s.id));
const broken = [
  ...steps.filter((s) => !live(s).length || live(s).some((b) => !/data-res="[^"]+"/.test(b))).map((s) => `ขั้น ${s.id} มีทางไม่มีผล`),
  ...gos.filter((g) => !stepIds.has(g)).map((g) => `ชี้ขั้น ${g} ที่ไม่มี`),
  ...steps.slice(1).filter((s) => !gos.includes(s.id)).map((s) => `ขั้น ${s.id} ไปไม่ถึง`),
];
check('เดโมการ์ดหน้าแรกกดได้ครบทุกทาง ไม่แตะเซฟ', res.length < 3 || res.some((r) => !r) || !real || touches || !same || !steps.length || live(steps[0]).length < 3, ` ทาง ${res.length} · ข้อความผลจริง ${real}${touches ? ' · แตะ storage/network' : ''}${same ? '' : ' · build ใหม่แล้วหน้าเปลี่ยน (ยังไม่ได้ build?)'}`);
check('เดโมการ์ดหน้าแรกมีเรื่องต่อ และกดไปได้ถึงทุกขั้น', !gos.length || broken.length, ` ขั้น ${steps.length} · ทางที่มีเรื่องต่อ ${gos.length}${broken.length ? ` · ${broken.slice(0, 3).join(' · ')}` : ''}`);

console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
process.exit(fail ? 1 : 0);
