// เลื่อนเลขเวอร์ชันเดโมใน src/version.json ก่อน commit ที่จะขึ้น Pages: "vX.Y.NN" patch 2 หลัก
// node scripts/bump-version.mjs        → patch +1
// node scripts/bump-version.mjs minor  → minor +1 · patch 00 (เปลี่ยนใหญ่: ระบบใหม่ · รื้อหน้าจอ)
// แก้ซอร์สไฟล์เดียว (src/version.json) — ไฟล์อื่นที่เปลี่ยนตามเป็นผล build ทั้งหมด
import { writeFileSync } from 'node:fs';
import { VERSION_FILE, readVersion } from '../src/site/facts.mjs';

const cur = readVersion();
const m = cur.version?.match(/^v(\d+)\.(\d+)\.(\d+)$/);
if (!m || !/^\d{4}-\d{2}-\d{2}$/.test(cur.build ?? '')) throw new Error(`src/version.json ไม่ใช่ {"version": "vX.Y.NN", "build": "YYYY-MM-DD"}: ${JSON.stringify(cur)}`);
const [major, minor, patch] = m.slice(1).map(Number);
const next = process.argv[2] === 'minor' ? `v${major}.${minor + 1}.00` : `v${major}.${minor}.${String(patch + 1).padStart(2, '0')}`;
// วันที่ตามเครื่องคนรัน ไม่ใช่ UTC — รันช่วงเช้ามืดเวลาไทยแล้ววันจะไม่ถอยไปเมื่อวาน
const d = new Date();
const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
writeFileSync(VERSION_FILE, `${JSON.stringify({ version: next, build: today }, null, 2)}\n`);
console.log(`version: ${cur.version} → ${next} · build ${today}`);
// build ต่อทันที — เลขใน play.html/หน้าเว็บต้องตรงกับซอร์ส ไม่งั้น Pages โชว์เลขเก่า
await import('../build.mjs');
