// เลื่อนเลขเวอร์ชันเดโมใน src/ui/app.mjs ก่อน commit ที่จะขึ้น Pages: "vX.Y.NN" patch 2 หลัก
// node scripts/bump-version.mjs        → patch +1
// node scripts/bump-version.mjs minor  → minor +1 · patch 00 (เปลี่ยนใหญ่: ระบบใหม่ · รื้อหน้าจอ)
import { readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../src/ui/app.mjs', import.meta.url);
const src = readFileSync(file, 'utf8');
const VER = /const APP_VERSION = 'v(\d+)\.(\d+)\.(\d+)';/;
const BUILD = /const APP_BUILD = '\d{4}-\d{2}-\d{2}';/;
const m = src.match(VER);
if (!m || !BUILD.test(src)) throw new Error('ไม่พบบรรทัด APP_VERSION/APP_BUILD ใน src/ui/app.mjs');
const [major, minor, patch] = m.slice(1).map(Number);
const next = process.argv[2] === 'minor' ? `v${major}.${minor + 1}.00` : `v${major}.${minor}.${String(patch + 1).padStart(2, '0')}`;
// วันที่ตามเครื่องคนรัน ไม่ใช่ UTC — รันช่วงเช้ามืดเวลาไทยแล้ววันจะไม่ถอยไปเมื่อวาน
const d = new Date();
const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
writeFileSync(file, src.replace(VER, `const APP_VERSION = '${next}';`).replace(BUILD, `const APP_BUILD = '${today}';`));
console.log(`version: v${m.slice(1).join('.')} → ${next} · build ${today}`);
// build ต่อทันที — เลขใน play.html ต้องตรงกับซอร์ส ไม่งั้น Pages โชว์เลขเก่า
await import('../build.mjs');
