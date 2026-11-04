// ตั้งรหัสหน้าเว็บที่ติดรหัส (ui-redo 72): npm run site:password → พิมพ์รหัส 2 รอบ (ไม่ขึ้นจอ) → เขียน SHA-256 ลง src/site/gate.json แล้ว build
// รับรหัสทาง stdin เท่านั้น ไม่รับเป็นอาร์กิวเมนต์ — อาร์กิวเมนต์ค้างใน history ของ shell · ส่งต่อผ่าน pipe ได้ (บรรทัดแรก = รหัส · บรรทัดสอง = ยืนยัน)
// ไฟล์ที่ commit มีแค่ hash · รหัสจริงห้ามลง repo/commit/ใบงาน/แชท
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { GATE_CONFIG } from '../src/site/gate.mjs';

const tty = process.stdin.isTTY;
const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: tty });
// โหมด terminal: กลบตัวอักษรที่พิมพ์ · โหมด pipe ไม่มีอะไรขึ้นจออยู่แล้ว
if (tty) rl._writeToOutput = (s) => rl.output.write(/[\r\n]/.test(s) ? '\n' : '*'.repeat(s.length));
const lines = rl[Symbol.asyncIterator]();
const ask = async (q) => {
  process.stdout.write(q);
  const { value, done } = await lines.next();
  return done ? null : value;
};

const pw = await ask('รหัสใหม่: ');
const again = await ask('ยืนยันรหัส: ');
rl.close();
if (!pw) {
  console.error('ไม่ได้ตั้ง: รหัสว่าง');
  process.exit(1);
}
if (pw !== again) {
  console.error('ไม่ได้ตั้ง: สองรอบไม่ตรงกัน');
  process.exit(1);
}
writeFileSync(GATE_CONFIG, `${JSON.stringify({ sha256: createHash('sha256').update(pw, 'utf8').digest('hex') }, null, 2)}\n`);
console.log('ตั้งรหัสแล้ว (เก็บแค่ hash ใน src/site/gate.json) · กำลัง build ให้หน้าเว็บใช้รหัสใหม่');
await import('../build.mjs');
