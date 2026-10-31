// ใบที่เคลมว่า "ไม่เปลี่ยนพฤติกรรม" (refactor · ย้ายโค้ด · รวม helper · ทำให้เร็วขึ้น) ต้องได้ชีวิตเดิมทุกไบต์เทียบฐาน
// ไม่เข้า trainN — ใบส่วนใหญ่ตั้งใจเปลี่ยนผล · เลนรันเองแล้วแปะผลในข้อความพร้อมตรวจ
// hash ต่อชีวิต = การ์ดทุกใบ (JSON ไม่รวม content) + ค่าที่บอทคืน + อายุ/จำนวนการ์ด/state ตอนตาย
// ฐาน = git archive <sha> แตกใต้ .cache/ ของ repo (Node หา node_modules ของ repo แม่เอง) · ฝั่งใหม่ = working tree ไม่ใช่ HEAD (รันก่อน commit ได้)
// สองฝั่งรันคนละ process — import engine สองชุดใน process เดียวแคชโมดูลปนกันได้
// ตัวควบคุม (เปิดเสมอ): ฝั่งใหม่อีกรอบที่บอทกดตัวเลือกอื่นครั้งเดียว ต้องต่างเกือบทุกชีวิต ไม่งั้นตัววัดไม่ไวพอจะเชื่อผล 0
// ไม่ครอบ: ปรโลก/ชาติต่อ · ชาติต่างโลกที่ harness เล่นตรง · จอ · build
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const SELF = fileURLToPath(import.meta.url);
const REPO = path.resolve(path.dirname(SELF), '..');
// บอทตัดสินครั้งที่เท่านี้ของชีวิตถูกบังคับให้กดตัวเลือกเปิดอื่น — ช้าพอให้พ้นการ์ดเปิดชีวิต เร็วพอให้ผลลามทั้งชีวิต
const CTL_AT = 10;
const CTL_MIN = 0.9;

if (args[0] === '--worker') {
  const [, root, n, seed, ctl] = args;
  console.log(JSON.stringify(await hashLives(root, Number(n), Number(seed), ctl === '1')));
} else {
  process.exit(await main());
}

async function hashLives(root, n, seed, ctl) {
  const imp = (p) => import(pathToFileURL(path.join(root, p)).href);
  process.chdir(root);
  const { playLife, mixSeed, openChoices } = await imp('src/engine/index.mjs');
  const { loadContent } = await imp('src/node/load.mjs');
  const { BOTS } = await imp('harness/bots.mjs');
  const content = loadContent();
  const skip = (k, v) => (k === 'content' ? undefined : v);
  const out = {};
  for (const [name, bot] of Object.entries(BOTS)) {
    out[name] = [];
    for (let i = 0; i < n; i++) {
      const h = createHash('sha256');
      let calls = 0;
      // ห่อด้วย Object.assign ให้ .focus ของบอทติดไป — ห่อเปล่าแล้วบอทไม่โฟกัส ชีวิตไม่ตรงที่ด่านจริงเล่น
      const pick = Object.assign((card, rng, x) => {
        let k = bot(card, rng, x);
        if (ctl && ++calls === CTL_AT) {
          const at = typeof k === 'object' ? k.i : k;
          const alt = openChoices(card).find((j) => j !== at);
          if (alt !== undefined) k = typeof k === 'object' ? { ...k, i: alt } : alt;
        }
        h.update(`>${JSON.stringify(k)}`);
        return k;
      }, bot);
      const { state, age, cards } = playLife(mixSeed(seed, i), content, pick, (card) => h.update(JSON.stringify(card, skip)));
      h.update(`|${age}|${cards}|${JSON.stringify(state, skip)}`);
      out[name].push(h.digest('hex').slice(0, 16));
    }
  }
  return out;
}

function run(root, n, seed, ctl) {
  const text = execFileSync(process.execPath, [SELF, '--worker', root, String(n), String(seed), ctl ? '1' : '0'], { maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] });
  return JSON.parse(text);
}

function extract(sha) {
  const git = (...a) => execFileSync('git', ['-C', REPO, ...a], { encoding: 'utf8' }).trim();
  const full = git('rev-parse', '--verify', `${sha}^{commit}`);
  const dir = path.join(REPO, '.cache', 'lifehash', full);
  const done = path.join(dir, '.extracted');
  if (existsSync(done)) return { dir, full };
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  // แตกด้วยชื่อไฟล์เปล่าจาก cwd — tar ของ Git Bash อ่าน "D:" ในพาธเป็นชื่อเครื่องปลายทาง
  const tar = path.join(dir, 'base.tar');
  git('archive', '--format=tar', '-o', tar, full);
  execFileSync('tar', ['-xf', 'base.tar'], { cwd: dir });
  rmSync(tar, { force: true });
  writeFileSync(done, full);
  return { dir, full };
}

function compare(a, b) {
  let diff = 0, total = 0, first = null;
  for (const name of Object.keys(a)) {
    a[name].forEach((h, i) => {
      total++;
      if (h !== b[name]?.[i]) {
        diff++;
        first ??= `${name} ชีวิตที่ ${i}`;
      }
    });
  }
  return { diff, total, first };
}

async function main() {
  const base = opt('--base');
  if (!base) {
    console.error('ใช้: npm run lifehash -- --base <sha> [--n 300] [--seeds 1,2,3] [--quick]');
    return 2;
  }
  const n = Number(opt('--n', args.includes('--quick') ? 100 : 300));
  const seeds = opt('--seeds', '1,2,3').split(',').map(Number);
  let b;
  try {
    b = extract(base);
  } catch (e) {
    console.error(`แตกฐาน ${base} ไม่ได้: ${String(e.message).split('\n')[0]}`);
    return 2;
  }
  const dirty = execFileSync('git', ['-C', REPO, 'status', '--short', '--', 'src', 'harness', 'content', 'data'], { encoding: 'utf8' }).trim();
  const head = execFileSync('git', ['-C', REPO, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
  console.log(`ชีวิตเดิมทุกไบต์ · ฐาน ${b.full.slice(0, 7)} vs working tree (HEAD ${head}${dirty ? ' + ไฟล์ยังไม่ commit' : ''}) · ${n} ชีวิต/บอท · seed ${seeds.join(' ')}`);
  if (dirty) console.log(dirty.split('\n').map((l) => `  ${l}`).join('\n'));
  let fail = 0;
  for (const s of seeds) {
    const r = compare(run(b.dir, n, s, false), run(REPO, n, s, false));
    console.log(`  seed ${s}: ต่าง ${r.diff}/${r.total}${r.first ? ` · ตัวแรก ${r.first}` : ''}`);
    if (r.diff) fail++;
  }
  const s0 = seeds[0];
  const c = compare(run(REPO, n, s0, false), run(REPO, n, s0, true));
  const share = c.diff / c.total;
  const sens = share >= CTL_MIN;
  console.log(`ตัวควบคุม: กดตัวเลือกอื่นที่การตัดสินครั้งที่ ${CTL_AT} (seed ${s0}) ต่าง ${c.diff}/${c.total} (${(100 * share).toFixed(1)}%) · ต้อง ≥ ${100 * CTL_MIN}% → ${sens ? 'ไวพอ' : 'ไม่ไวพอ'}`);
  if (!sens) return 2;
  console.log(fail ? `ตก: ชีวิตต่างจากฐาน ${fail}/${seeds.length} seed` : 'ผ่าน: ชีวิตเดิมทุกไบต์ทุกบอททุก seed');
  return fail ? 1 : 0;
}
