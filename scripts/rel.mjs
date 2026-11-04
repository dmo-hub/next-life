// ปล่อยเวอร์ชัน: เขียนโน้ตลง docs/whatsnew.html → bump เลข → เลื่อนฐานด่าน keep → commit (ไม่ push ไม่ tag)
// npm run rel -- <notes.json> [worktree]   (ไม่ส่ง worktree = โฟลเดอร์ปัจจุบัน)
//   notes.json = {"tag": "...", "shas": ["abc1234"], "note": ["ข้อความข้อละบรรทัด ไม่ต้องใส่ <li> (ตัวนี้ครอบให้ · ใส่เองได้ <li> ซ้อน)"], "soon": ["..."]?, "minor": true?}
//   tag = ชื่อขบวน (ขึ้นใน commit) · shas = commit ที่ปล่อยรอบนี้ (cherry-pick ให้ · ใช้ NOPICK=1 ถ้า merge ไว้แล้ว)
//   หัว "กำลังทำ" ใน whatsnew แบ่งหมวดด้วย <h3> — แก้มือในหมวดที่ตรง และลบข้อที่ปล่อยแล้วออก · ห้ามส่ง soon (ตัวนี้ปฏิเสธ)
// env: NOPICK=1 ข้าม cherry-pick (merge --no-ff ไว้แล้ว · shas เก็บเป็นหลักฐาน)
//      DRY=1 พิมพ์เวอร์ชันใหม่ + บล็อก whatsnew ไม่เขียนไฟล์ ไม่ pick ไม่ bump ไม่ commit
//        BASE=<rev> (DRY เท่านั้น) อ่าน app.mjs/whatsnew.html จาก rev แทนดิสก์ — เทียบกับขบวนที่ปล่อยไปแล้วได้โดยไม่ต้องมี worktree ชั่วคราว
//        DATE="2 พ.ย. 2569" ทับวันที่ · DRY_OUT=<ไฟล์> เขียน whatsnew ที่จะได้ลงไฟล์นั้น (นอก worktree) ไว้ diff
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [notesFile, wt = process.cwd()] = process.argv.slice(2);
if (!notesFile) throw new Error('ใช้: npm run rel -- <notes.json> [worktree]');
const DRY = !!process.env.DRY;
const BASE = process.env.BASE;
if (BASE && !DRY) throw new Error('BASE ใช้ได้กับ DRY=1 เท่านั้น');
const git = (...a) => execFileSync('git', ['-C', wt, ...a], { encoding: 'utf8' }).trim();
const BUILD = new Set(['docs/play.html', 'docs/catalog.html', 'docs/spoilers.html', 'docs/spec.html', 'docs/guide.html', 'docs/otherworld.html', 'docs/worlds.html', 'docs/dev/spec.html', 'docs/index.html', 'docs/about.html']);

const g = JSON.parse(fs.readFileSync(notesFile, 'utf8'));
const strs = (v) => Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === 'string' && s.trim());
if (typeof g.tag !== 'string' || !g.tag.trim() || g.tag.startsWith('TODO')) throw new Error('notes.json: tag ว่าง/TODO');
if (!strs(g.shas)) throw new Error('notes.json: shas ต้องเป็นรายการ sha ไม่ว่าง');
if (!strs(g.note)) throw new Error('notes.json: note ต้องเป็นรายการข้อความไม่ว่าง');
if (g.soon !== undefined && !strs(g.soon)) throw new Error('notes.json: soon ถ้าส่งต้องเป็นรายการไม่ว่าง (ไม่ส่ง = คงของเดิม)');

// อ่านจาก rev ใน DRY+BASE · ที่เหลืออ่านดิสก์ — BASE ทำให้ dry-run ย้อนเทียบขบวนเก่าได้
// cat-file ไม่ใช่ git() — git() trim ท้ายไฟล์ทิ้ง EOL สุดท้าย whatsnew ที่ได้จะไม่ตรงไบต์
const read = (rel) => (BASE ? execFileSync('git', ['-C', wt, 'cat-file', 'blob', `${BASE}:${rel}`], { encoding: 'utf8' }) : fs.readFileSync(path.join(wt, rel), 'utf8'));

function pick(sha) {
  try {
    git('cherry-pick', sha);
    return;
  } catch {
    const un = git('diff', '--name-only', '--diff-filter=U').split('\n').filter(Boolean);
    const other = un.filter((f) => !BUILD.has(f));
    if (other.length) throw new Error(`ชนไฟล์ต้นฉบับที่ ${sha}: ${other.join(' ')}`);
    // ไฟล์ build เอา HEAD — bump ท้ายขบวน build ใหม่ทั้งหมดอยู่แล้ว
    for (const f of un) git('checkout', '--ours', '--', f), git('add', '--', f);
    execFileSync('git', ['-C', wt, '-c', 'core.editor=true', 'cherry-pick', '--continue'], { stdio: 'ignore' });
    console.log(`  ${sha} ชน build ${un.join(' ')} → HEAD`);
  }
}

// วันที่ตายตัวพาไปผิดเมื่อสคริปต์ข้ามวัน — คิดจากเวลาไทยตอนรัน
const today = process.env.DATE ?? new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());

console.log(`== ${g.tag}${DRY ? ' (DRY)' : ''}`);
if (!DRY && !process.env.NOPICK) for (const s of g.shas) pick(s);
// ตั้งแต่ขบวน 65 เลขอยู่ src/version.json · ขบวนเก่า (DRY+BASE ย้อนเทียบ) ยังอยู่ app.mjs
let verFile = 'src/version.json';
let cur;
try {
  cur = JSON.parse(read(verFile)).version?.match(/^v(\d+)\.(\d+)\.(\d+)$/);
} catch {
  verFile = 'src/ui/app.mjs';
  cur = read(verFile).match(/const APP_VERSION = 'v(\d+)\.(\d+)\.(\d+)';/);
}
if (!cur) throw new Error(`หาเลขเวอร์ชันใน ${verFile} ไม่เจอ`);
const ver = g.minor ? `v${cur[1]}.${Number(cur[2]) + 1}.00` : `v${cur[1]}.${cur[2]}.${String(Number(cur[3]) + 1).padStart(2, '0')}`;
const html = read('docs/whatsnew.html');
const anchor = html.match(/<p class="lead">การเปลี่ยนแปลงทีละเวอร์ชัน[^\n]*\n\r?\n/);
if (!anchor) throw new Error('หาจุดแทรกโน้ตใน whatsnew ไม่เจอ');
const eol = html.includes('\r\n') ? '\r\n' : '\n';
const block = [`  <h3>${ver} <small>${today}</small></h3>`, '  <ul>', ...g.note.map((n) => `    <li>${n}</li>`), '  </ul>', '', ''].join(eol);
let out = html.replace(anchor[0], anchor[0] + block);
// เจ้าของสั่งให้หัวกำลังทำรวมงานค้างทั้งหมดทุกครั้งที่ปล่อย — ส่ง soon = แทนทั้งรายการ ไม่ต่อท้าย กันของที่ปล่อยแล้วค้างอยู่
if (g.soon) {
  // กำลังทำแบ่งหมวดด้วย <h3> แล้ว — regex ข้างล่างแทนแค่ <ul> แรก = ทับหมวดแรก ทิ้งที่เหลือเงียบ
  if (/<h3[\s>]/.test(out.match(/<h2>กำลังทำ<\/h2>([\s\S]*?)<h2>/)?.[1] ?? '')) throw new Error('whatsnew กำลังทำแบ่งหมวดแล้ว — ห้ามส่ง soon · แก้มือในหมวดที่ตรง');
  const soonRe = /(<h2>กำลังทำ<\/h2>[\s\S]*?<ul>)[\s\S]*?(\r?\n  <\/ul>)/;
  if (!soonRe.test(out)) throw new Error('หารายการกำลังทำใน whatsnew ไม่เจอ');
  const items = g.soon.map((s) => `${eol}    <li><span class="tag soon">กำลังทำ</span>${s}</li>`).join('');
  out = out.replace(soonRe, (_, head, tail) => head + items + tail);
}

if (DRY) {
  console.log(`เวอร์ชัน: v${cur[1]}.${cur[2]}.${cur[3]} → ${ver}${BASE ? ` (อ่านจาก ${BASE})` : ''}`);
  console.log('บล็อก whatsnew:');
  console.log(block.replace(/\r/g, '').trimEnd());
  const soonOf = (h) => h.match(/<h2>กำลังทำ<\/h2>[\s\S]*?<\/ul>/)?.[0] ?? '';
  console.log(`กำลังทำ: ${!g.soon ? 'คงเดิม (ไม่ส่ง soon)' : soonOf(out) === soonOf(html) ? 'ส่ง soon แต่ตรงของเดิมทุกไบต์' : `แทนเป็น ${g.soon.length} ข้อ`}`);
  if (process.env.DRY_OUT) {
    fs.writeFileSync(process.env.DRY_OUT, out);
    console.log(`whatsnew ที่จะได้ → ${process.env.DRY_OUT}`);
  }
  process.exit(0);
}

fs.writeFileSync(path.join(wt, 'docs/whatsnew.html'), out);
execFileSync('npm', ['run', '-s', 'bump', ...(g.minor ? ['minor'] : [])], { cwd: wt, stdio: 'ignore', shell: true });
// ด่าน keep เทียบกับเวอร์ชันที่ปล่อยล่าสุด — เลื่อนฐานใน commit bump เดียวกัน ไม่งั้นขบวนถัดไปเทียบกับฐานเก่า
const KEEP = ['harness/keep-ids.json', 'harness/fixtures/keep-snaps.json'];
if (fs.existsSync(path.join(wt, 'harness/keep.mjs'))) execFileSync('npm', ['run', '-s', 'keep', '--', '--save'], { cwd: wt, stdio: 'inherit', shell: true });
// ไฟล์ docs ที่ต่างแค่ CRLF/LF ไม่เข้า commit — build บน Windows ทิ้ง EOL ต่างไว้ใน gdd/spoilers
const docs = git('diff', '--name-only', '--', 'docs').split('\n').filter(Boolean);
const eolOnly = new Set(docs.filter((f) => !git('diff', '--ignore-cr-at-eol', '--name-only', '--', f)));
const addDocs = [...docs.filter((f) => !eolOnly.has(f)), ...git('ls-files', '--others', '--exclude-standard', '--', 'docs').split('\n').filter(Boolean)];
if (eolOnly.size) console.log(`  ข้าม EOL ล้วน: ${[...eolOnly].join(' ')}`);
git('add', '--', verFile, ...addDocs, ...KEEP.filter((f) => fs.existsSync(path.join(wt, f))));
git('commit', '-q', '-m', `chore(ui): bump demo version ${ver} for ${g.tag}`);
console.log(`  ${ver} ${git('rev-parse', '--short', 'HEAD')}`);
