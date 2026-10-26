// เก็บ play.html ของแต่ละเวอร์ชันไว้ที่ docs/v/<เวอร์ชัน>.html (B77) — เซฟคือ seed + ลำดับปุ่ม เล่นซ้ำได้เฉพาะบนเนื้อหาเดิม
// เนื้อหาเปลี่ยนแล้วเซฟเก่าต้องกลับไปเล่นต่อในหน้าเวอร์ชันที่สร้างมันได้ ไม่งั้นหายทั้งตระกูล
// node scripts/archive-version.mjs                 → เก็บ docs/play.html ปัจจุบัน (bump เรียกเอง)
// node scripts/archive-version.mjs v0.2.30 v0.2.31 → เก็บย้อนหลังจาก tag
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const docs = new URL('../docs/', import.meta.url);
const dir = new URL('v/', docs);
const VER = /const APP_VERSION = '(v\d+\.\d+\.\d+)';/;

// หน้าเก็บอยู่ลึกลงไปหนึ่งชั้น — ลิงก์ไปหน้าอื่นของเว็บต้องถอยขึ้นมา
const relink = (html) => html.replace(/href="(index|about|play|cards|overview|isekai)\.html"/g, 'href="../$1.html"');

export function archive(html) {
  const ver = html.match(VER)?.[1];
  if (!ver) throw new Error('ไม่พบ APP_VERSION ใน play.html');
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL(`${ver}.html`, dir), relink(html));
  // รายการเวอร์ชันใหม่ → เก่า ให้หน้าล่าสุดหาเวอร์ชันที่เซฟเก่า (ไม่มีเลขเวอร์ชัน) มาจาก
  const idx = new URL('index.json', dir);
  const list = existsSync(idx) ? JSON.parse(readFileSync(idx, 'utf8')) : [];
  const key = (v) => v.slice(1).split('.').map(Number);
  const all = [...new Set([...list, ver])].sort((a, b) => {
    const [x, y] = [key(a), key(b)];
    return y[0] - x[0] || y[1] - x[1] || y[2] - x[2];
  });
  writeFileSync(idx, JSON.stringify(all, null, 1) + '\n');
  return ver;
}

// รันตรงเท่านั้น — bump import ไปเรียก archive() เอง
if (process.argv[1]?.endsWith('archive-version.mjs')) {
  const tags = process.argv.slice(2);
  const pages = tags.length
    ? tags.map((t) => execFileSync('git', ['show', `${t}:docs/play.html`], { encoding: 'utf8', maxBuffer: 1 << 26 }))
    : [readFileSync(new URL('play.html', docs), 'utf8')];
  for (const html of pages) console.log(`archived ${archive(html)}`);
}
