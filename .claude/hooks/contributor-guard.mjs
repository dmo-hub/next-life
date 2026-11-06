// ตาข่ายกันพลาดบนเครื่องผู้ร่วมทำ ไม่ใช่ด่านความปลอดภัย: ของที่หลุดไป pr-guard ใน CI จับต่อ
// exit 2 = บล็อกคำสั่ง · อ่าน stdin ไม่ได้ = ปล่อยผ่าน เพื่อไม่ให้ hook พังแล้วทำงานไม่ได้เลย
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

// สัญญาณเดียวกับ CLAUDE.md: เครื่องที่มีโฟลเดอร์นี้คือเครื่องเจ้าของ
if (existsSync(path.join(homedir(), '.claude', 'work', 'thai-life-sim'))) process.exit(0);

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}
const command = input?.tool_input?.command;
if (typeof command !== 'string') process.exit(0);
const cwd = input.cwd || process.cwd();

// ตัดคำแบบ shell พอใช้: เคารพ quote เพื่อไม่ให้ข้อความ commit ที่มีคำว่า "git add ." โดนบล็อก
function segments(text) {
  const out = [[]];
  let word = '';
  let inWord = false;
  let quote = '';
  const flush = () => { if (inWord) out.at(-1).push(word); word = ''; inWord = false; };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === quote) quote = '';
      // ใน " " backslash หนีได้แค่ตัวเหล่านี้ ที่เหลือคือ path Windows
      else if (c === '\\' && quote === '"' && /["\\$`]/.test(text[i + 1] ?? '')) word += text[++i];
      else word += c;
    } else if (c === '"' || c === "'") { quote = c; inWord = true; }
    // หน้าตัวอื่นคง backslash ไว้ PowerShell ใช้ scripts\rel.mjs เป็น path
    else if (c === '\\' && /["' \\]/.test(text[i + 1] ?? '')) { word += text[++i]; inWord = true; }
    else if (/[;&|\n()]/.test(c)) { flush(); out.push([]); }
    else if (/\s/.test(c)) flush();
    else { word += c; inWord = true; }
  }
  flush();
  return out.filter((s) => s.length);
}

function currentBranch(dir) {
  try {
    return execFileSync('git', ['branch', '--show-current'], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function checkGit(tokens) {
  let i = 1;
  let dir = cwd;
  while (i < tokens.length && tokens[i].startsWith('-')) {
    const flag = tokens[i];
    if (flag === '-C') { dir = path.resolve(dir, tokens[i + 1] ?? '.'); i += 2; }
    else if (flag === '-c' || flag === '--git-dir' || flag === '--work-tree') i += 2;
    else i += 1;
  }
  const sub = tokens[i];
  const rest = tokens.slice(i + 1);
  const shortFlag = (ch) => rest.some((t) => /^-[a-zA-Z]+$/.test(t) && t.includes(ch));

  if (sub === 'add') {
    if (rest.some((t) => ['.', './', ':/', '--all'].includes(t)) || shortFlag('A')) {
      return 'ห้าม git add ทั้งก้อน ใช้ git add <path> ทีละไฟล์ เพื่อไม่ให้ของนอกใบปนเข้า PR';
    }
  }
  if (sub === 'commit') {
    if (rest.includes('--all') || shortFlag('a')) return 'ห้าม git commit -a ใช้ git add <path> ทีละไฟล์ก่อน commit';
    if (currentBranch(dir) === 'main') return 'ห้าม commit บน main สร้าง branch lane-<ชื่อคุณ>/<ชื่อใบ> ก่อน';
  }
  if (sub === 'push') {
    if (currentBranch(dir) === 'main') return 'ห้าม push จาก main ส่งงานผ่าน branch และ PR';
    const refs = rest.filter((t) => !t.startsWith('-')).slice(1);
    if (refs.some((r) => /^\+?(?:[^:]*:)?(?:refs\/heads\/)?main$/.test(r))) return 'ห้าม push เข้า main ส่งงานผ่าน branch และ PR';
  }
  return null;
}

const RELEASE = 'ผู้รวมงานทำตอนปล่อย ใน PR ห้ามทำ';

function checkNpm(tokens) {
  const at = tokens.findIndex((t) => t === 'run' || t === 'run-script');
  if (at < 0) return null;
  const script = tokens[at + 1];
  if (script === 'bump' || script === 'rel') return `npm run ${script}: ${RELEASE}`;
  if (script === 'keep' && tokens.includes('--save')) return `keep --save: ${RELEASE}`;
  return null;
}

function checkNode(tokens) {
  const file = (tokens[1] ?? '').replace(/\\/g, '/').replace(/^\.\//, '');
  if (file === 'scripts/rel.mjs' || file === 'scripts/bump-version.mjs') return `${file}: ${RELEASE}`;
  if (file === 'harness/keep.mjs' && tokens.includes('--save')) return `keep --save: ${RELEASE}`;
  return null;
}

for (const raw of segments(command)) {
  const tokens = raw.slice(raw.findIndex((t) => !/^[A-Za-z_][A-Za-z0-9_]*=/.test(t)));
  const tool = path.basename(tokens[0] ?? '').replace(/\.exe$/i, '');
  const why = tool === 'git' ? checkGit(tokens) : tool === 'npm' ? checkNpm(tokens) : tool === 'node' ? checkNode(tokens) : null;
  if (why) {
    console.error(`contributor-guard: ${why}`);
    process.exit(2);
  }
}
process.exit(0);
