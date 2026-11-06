// ด่านกันงานผู้ร่วมทำ: ไฟล์ที่ห้ามเข้า PR + เนื้อ PR ที่ไม่ได้กรอก
// CI รันตัวจาก branch ฐาน ไม่ใช่ตัวใน PR — ไม่งั้น PR แก้สคริปต์นี้แล้วด่านขึ้นเขียวเอง
//
// ใช้: node scripts/pr-guard.mjs --base <rev> --head <rev> [--body-file <ไฟล์>]
// ไม่มี --body-file: อ่านเนื้อจาก $GITHUB_EVENT_PATH · ไม่มีทั้งคู่ = ตรวจแค่ไฟล์ และบอกว่าไม่ได้ตรวจเนื้อ
// exit 0 ผ่าน · 1 ตก · 2 ใช้ผิด/git ล้ม
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const die = (msg) => { console.error(`pr-guard: ${msg}`); process.exit(2); };
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 1 << 28 });

const base = opt('--base');
const head = opt('--head');
if (!base || !head) die('ต้องระบุ --base และ --head');

const EXACT = {
  'src/version.json': 'เลขเวอร์ชัน ผู้รวมงานทำตอนปล่อย',
  'docs/whatsnew.html': 'whatsnew ผู้รวมงานทำตอนปล่อย ร่างโน้ตใส่ในเนื้อ PR',
  'harness/keep-ids.json': 'keep --save ผู้รวมงานทำตอนปล่อย',
  'harness/fixtures/keep-snaps.json': 'keep --save ผู้รวมงานทำตอนปล่อย',
  'scripts/pr-guard.mjs': 'ด่านนี้แก้ใน PR ไม่ได้',
  '.github/workflows/pr-guard.yml': 'ด่านนี้แก้ใน PR ไม่ได้',
};

// นับเป็นโฟลเดอร์ ไม่ใช่รายไฟล์ — เติมไฟล์ในสกิลเดิมได้ เปิดสกิลใหม่ไม่ได้
function trackedSkills(rev) {
  const out = git('ls-tree', '-r', '--name-only', rev, '--', '.claude/skills/');
  return new Set(out.split('\n').filter(Boolean).map((p) => p.split('/')[2]));
}

function fileReason(file, skills) {
  if (EXACT[file]) return EXACT[file];
  if (file.startsWith('.vscode/')) return 'ตั้งค่าเครื่องส่วนตัว';
  if (/\.(rar|zip)$/i.test(file)) return 'ไฟล์บีบอัด';
  if (file.startsWith('.claude/')) {
    const [, dir, skill] = file.split('/');
    if (dir === 'skills' && skills.has(skill)) return null;
    return 'ของใน .claude/ นอกสกิลที่ repo เก็บไว้';
  }
  return null;
}

function bodyFailures(body) {
  const fails = [];
  if (!/\bcloses\s+#\d+/i.test(body)) fails.push('เนื้อ PR ไม่มี "Closes #<เลข issue>"');
  const lines = body.split(/\r?\n/);
  const at = lines.findIndex((l) => /^#{1,6}\s*ทำอะไร\s*$/.test(l.trim()));
  if (at < 0) fails.push('เนื้อ PR ไม่มีหัว "ทำอะไร"');
  else {
    const end = lines.findIndex((l, i) => i > at && /^#{1,6}\s/.test(l.trim()));
    const text = lines.slice(at + 1, end < 0 ? undefined : end).join('\n').replace(/<!--[\s\S]*?-->/g, '');
    if (!text.replace(/^\s*[-*]\s*$/gm, '').trim()) fails.push('หัว "ทำอะไร" ในเนื้อ PR ยังว่าง');
  }
  return fails;
}

function readBody() {
  const file = opt('--body-file');
  if (file) return readFileSync(file, 'utf8');
  const event = process.env.GITHUB_EVENT_PATH;
  if (!event) return null;
  const pr = JSON.parse(readFileSync(event, 'utf8')).pull_request;
  if (!pr) die('event นี้ไม่มี pull_request');
  return pr.body ?? '';
}

let files;
let skills;
try {
  const mb = git('merge-base', base, head).trim();
  files = git('diff', '--name-only', '--no-renames', '-z', mb, head).split('\0').filter(Boolean);
  skills = trackedSkills(base);
} catch (e) {
  die(`git ล้ม: ${e.message}`);
}

const bad = files.map((f) => [f, fileReason(f, skills)]).filter(([, why]) => why);
for (const [f, why] of bad) console.log(`ตก ${f} — ${why}`);

const body = readBody();
const bodyBad = body === null ? [] : bodyFailures(body);
for (const msg of bodyBad) console.log(`ตก ${msg}`);
if (body === null) console.log('ไม่ได้ตรวจเนื้อ PR (ไม่มี --body-file และไม่ได้รันใน CI)');

const total = bad.length + bodyBad.length;
console.log(total ? `pr-guard ตก ${total} ข้อ จาก ${files.length} ไฟล์ที่เปลี่ยน` : `pr-guard ผ่าน ${files.length} ไฟล์ที่เปลี่ยน`);
process.exit(total ? 1 : 0);
