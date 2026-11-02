// เมนูทุกหน้าเว็บมาจากรายการนี้ที่เดียว — build ฉีดระหว่าง NAV_START/NAV_END ทุกครั้ง (ก่อนหน้านี้แต่ละหน้าเขียนเมนูเองแล้วไม่เท่ากัน)
// ผังทางกลาง: เมนูผู้เล่นแถวเดียว + ปุ่มห้องผู้พัฒนา · เอกสารผู้พัฒนาที่มีอยู่เดิม (gdd · spec/ · archive/) อยู่ path เดิม · ของใหม่ลง dev/
// href ทุกตัวนับจาก docs/ — หน้าในโฟลเดอร์ย่อยได้ ../ เติมให้ตามความลึก
export const NAV_START = '<!--nav-->';
export const NAV_END = '<!--/nav-->';

export const PLAYER_NAV = [
  ['index.html', 'หน้าแรก'],
  ['play.html', 'เล่นเกม'],
  ['guide.html', 'วิธีเล่น'],
  ['focus.html', 'โฟกัสชีวิต'],
  ['about.html', 'กลไกในเกม'],
  ['otherworld.html', 'ต่างโลก'],
  ['catalog.html', 'การ์ด', [['catalog.html', 'การ์ดทั้งหมด'], ['spoilers.html', 'เฉลย (สปอยล์)'], ['cards.html', 'ต้นแบบ v2']]],
  ['whatsnew.html', 'แพตช์โน้ต'],
];

export const MAP_TABS = [
  ['dev/maps/continent.html', 'ทวีป'],
  ['dev/maps/afterlife.html', 'ปรโลก'],
  ['dev/maps/dungeon.html', 'ดันเจียน'],
  ['dev/maps/lineage.html', 'ตระกูล'],
  ['dev/maps/milestones.html', 'หลักไมล์'],
  ['dev/maps/politics.html', 'การเมือง'],
];
export const ARCHIVE_TABS = [
  ['archive/cards-v1.html', 'การ์ด v1'],
  ['archive/overview-v1.html', 'ภาพรวม v1'],
  ['dev/archive/isekai-life-v1.html', 'ต่างโลก v1'],
  ['dev/archive/fx-proto.html', 'เอฟเฟกต์การ์ด'],
  ['dev/archive/b176-samples.html', 'สมุด 3 แท็บ'],
];
export const DEV_NAV = [
  ['dev/index.html', 'สารบัญ'],
  ['gdd.html', 'GDD'],
  ['dev/plan.html', 'สเปก/แผน', [['dev/plan.html', 'แผนเฟส + แกนต่อเนื่อง'], ['spec/lore-finance-series.html', 'ข้อมูลการเงินในเกม']]],
  ['dev/maps/continent.html', 'แผนที่', MAP_TABS],
  ['dev/study/games.html', 'งานศึกษา', [['dev/study/games.html', 'ศึกษาเกมอื่น'], ['dev/study/asamkhyeya.html', 'ศึกษาหนึ่งในอสงไขย']]],
  ['dev/archive/index.html', 'คลังเก่า', [['dev/archive/index.html', 'สารบัญคลัง'], ...ARCHIVE_TABS]],
];

// หน้าที่ไม่ใส่เมนูนี้: play = ตัวเกมเต็มจอ (มีปุ่มของตัวเอง) · whatsnew = ผู้รวมงานเขียน ใส่ marker เองเมื่อพร้อม
export const NAV_SKIP = ['play.html', 'whatsnew.html'];

const flat = (list) => list.flatMap(([href, , sub]) => [href, ...(sub ?? []).map(([h]) => h)]);
const pagesOf = (list) => [...new Set(flat(list))].filter((p) => !NAV_SKIP.includes(p));
export const NAV_PAGES = [...pagesOf(PLAYER_NAV), ...pagesOf(DEV_NAV)];
export const isDev = (page) => pagesOf(DEV_NAV).includes(page);

// หัวข้อบนที่หน้านี้สังกัด: ตรงตัว หรืออยู่ในแท็บย่อย
const owner = (list, page) => list.find(([href, , sub]) => href === page) ?? list.find(([, , sub]) => sub?.some(([h]) => h === page));

const row = (list, page, up, cls, label) => {
  const items = list.map(([href, name]) => `<a href="${up}${href}"${href === page ? ' aria-current="page"' : ''}>${name}</a>`).join('');
  return `<div class="${cls}" role="navigation" aria-label="${label}"><div class="nl-in">${items}</div></div>`;
};

const CSS = `<style>
.nl-nav,.nl-nav *{box-sizing:border-box;margin:0}
.nl-nav{font:15px/1.4 Sarabun,"Noto Sans Thai",system-ui,sans-serif;text-align:left}
.nl-nav a{text-decoration:none;color:inherit}
.nl-in{max-width:1040px;margin:0 auto;padding:0 16px;display:flex;align-items:center;gap:4px}
.nl-top{background:#1F2430;color:#F4EFE3}
.nl-top>.nl-in{min-height:52px;flex-wrap:wrap;column-gap:12px}
.nl-brand{font-weight:700;margin-right:auto;padding:12px 0}
.nl-main{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none}
.nl-main a{padding:13px 8px 11px;border-bottom:3px solid transparent;white-space:nowrap}
.nl-main a[aria-current]{border-bottom-color:#D6A64A;font-weight:600}
.nl-swap{border:1px solid #6B7080;padding:5px 10px;font-size:14px;white-space:nowrap;opacity:.9}
.nl-swap:hover,.nl-main a:hover{opacity:1;color:#fff}
.nl-dev .nl-top{background:#2F3833}
.nl-badge{display:inline-block;margin-left:6px;padding:0 6px;font-size:12px;background:#8A6A2E;color:#F4EFE3;vertical-align:2px}
.nl-tabs{background:#F3EEE2;color:#1F2430;border-bottom:1px solid #D8D0C0}
.nl-tabs .nl-in{overflow-x:auto;scrollbar-width:none}
.nl-tabs a{padding:10px 10px 8px;border-bottom:3px solid transparent;white-space:nowrap}
.nl-tabs a[aria-current]{border-bottom-color:#A23B2C;font-weight:600}
.nl-tabs.nl-sub{background:#EBE4D5;font-size:14px}
@media (max-width:640px){
.nl-top>.nl-in{padding:0}
.nl-brand{padding:12px 16px}
.nl-swap{margin-right:16px}
.nl-main{order:3;width:100%;padding:0 8px;border-top:1px solid #343A48}
}
</style>`;

// page = path จาก docs/ ของหน้าที่จะใส่เมนู
export function navHtml(page) {
  if (!NAV_PAGES.includes(page)) throw new Error(`${page} ไม่อยู่ในผังเมนู (src/site/nav.mjs) — เติมในรายการก่อน`);
  const up = '../'.repeat(page.split('/').length - 1);
  const dev = isDev(page);
  const list = dev ? DEV_NAV : PLAYER_NAV;
  const top = owner(list, page);
  const at = top[0];
  const parts = [];
  if (dev) {
    parts.push(`<div class="nl-top"><div class="nl-in"><a class="nl-brand" href="${up}dev/index.html">ห้องผู้พัฒนา<span class="nl-badge">dev</span></a><a class="nl-swap" href="${up}index.html">← กลับหน้าเกม</a></div></div>`);
    parts.push(row(list, at, up, 'nl-tabs', 'เอกสารผู้พัฒนา'));
  } else {
    const links = list.map(([href, name]) => `<a href="${up}${href}"${href === at ? ' aria-current="page"' : ''}>${name}</a>`).join('');
    parts.push(`<div class="nl-top"><div class="nl-in"><a class="nl-brand" href="${up}index.html">เกิดใหม่ทั้งที</a><div class="nl-main" role="navigation" aria-label="เมนูหลัก">${links}</div><a class="nl-swap" href="${up}dev/index.html">ห้องผู้พัฒนา →</a></div></div>`);
  }
  if (top[2]) parts.push(row(top[2], page, up, `nl-tabs${dev ? ' nl-sub' : ''}`, `หน้าในหมวด${top[1]}`));
  return `${NAV_START}${CSS}<div class="nl-nav${dev ? ' nl-dev' : ''}">${parts.join('')}</div>${NAV_END}`;
}

// แทนส่วนระหว่าง marker — หน้าที่อยู่ในผังแต่ไม่มี marker ให้ build หยุด ไม่ข้ามเงียบ
export function injectNav(html, page) {
  const i = html.indexOf(NAV_START);
  const j = html.indexOf(NAV_END, i);
  if (i < 0 || j < 0) throw new Error(`${page} ไม่มี ${NAV_START}…${NAV_END} — ใส่ marker ต่อจาก <body>`);
  return html.slice(0, i) + navHtml(page) + html.slice(j + NAV_END.length);
}
