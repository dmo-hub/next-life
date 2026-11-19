// ใบที่เคลมว่า "ไม่เปลี่ยนพฤติกรรม" (refactor · ย้ายโค้ด · รวม helper · ทำให้เร็วขึ้น) ต้องได้ชีวิตเดิมทุกไบต์เทียบฐาน
// ไม่เข้า trainN — ใบส่วนใหญ่ตั้งใจเปลี่ยนผล · เลนรันเองแล้วแปะผลในข้อความพร้อมตรวจ
// hash ต่อชีวิต = การ์ดทุกใบ (JSON ไม่รวม content) + ค่าที่บอทคืน + อายุ/จำนวนการ์ด/state ตอนตาย
// ฐาน = git archive <sha> แตกใต้ .cache/ ของ repo (Node หา node_modules ของ repo แม่เอง) · ฝั่งใหม่ = working tree ไม่ใช่ HEAD (รันก่อน commit ได้)
// สองฝั่งรันคนละ process — import engine สองชุดใน process เดียวแคชโมดูลปนกันได้
// ตัวควบคุม (เปิดเสมอ): ฝั่งใหม่อีกรอบที่บอทกดตัวเลือกอื่นครั้งเดียว ต้องต่างเกือบทุกชีวิต ไม่งั้นตัววัดไม่ไวพอจะเชื่อผล 0
// --world life (ค่าตั้งต้น) ชีวิตเดียว · isekai ชาติต่างโลกที่เริ่มตรงแบบ harness/isekai · chain สามรุ่นต่อกันผ่านปรโลก+ทายาท (ครอบชาติต่างโลกที่เข้าจากปรโลก)
// ไม่ครอบ: จอ · build
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const SELF = fileURLToPath(import.meta.url);
const REPO = path.resolve(path.dirname(SELF), '..');
// LIFEHASH_DROP=k1,k2: คีย์ที่ใบตั้งใจเพิ่มบนการ์ดให้จออ่าน (ไม่ใช่ผลเกม) กรองออกก่อน hash ทั้งสองฝั่ง — env ส่งถึง worker ลูกเอง
// ใช้คู่กับรอบไม่กรองเป็นตัวควบคุม: ไม่กรองต้องต่าง ไม่งั้นคีย์นั้นไม่ได้อยู่บนการ์ดจริง
const DROP = new Set((process.env.LIFEHASH_DROP ?? '').split(',').filter(Boolean));
// บอทตัดสินครั้งที่เท่านี้ของชีวิตถูกบังคับให้กดตัวเลือกเปิดอื่น — ช้าพอให้พ้นการ์ดเปิดชีวิต เร็วพอให้ผลลามทั้งชีวิต
const CTL_AT = 10;
const CTL_MIN = { life: 0.9, isekai: 0.9, chain: 0.9 };
const CHAIN_GENS = 3;
// stream ของบอทในชาติต่างโลกแยกจาก seed ชาติ — ค่าใดก็ได้ที่คงที่ทั้งสองฝั่ง
const ISEKAI_BOT_SALT = 0x15e4a1;
// เพดานการ์ดต่อชาติต่างโลก (เท่า harness/isekai) — ชาติที่ไม่จบถูก hash ตามที่เดินถึง ทั้งสองฝั่งตัดที่เดียวกัน
const ISEKAI_CAP = 240;

if (args[0] === '--worker') {
  const [, root, n, seed, ctl, world, only] = args;
  console.log(JSON.stringify(await hashLives(root, Number(n), Number(seed), ctl === '1', world, only)));
} else {
  process.exit(await main());
}

// only = "บอท:i" รันชีวิตเดียวนั้นแล้วคืนรายการการ์ด (รุ่น·ช่วง·อายุ·id) แทน hash — เรียกเฉพาะตอนต่างแล้ว รอบปกติไม่เก็บ trace
async function hashLives(root, n, seed, ctl, world, only) {
  const [onlyBot, onlyIdx] = only ? [only.slice(0, only.lastIndexOf(':')), Number(only.slice(only.lastIndexOf(':') + 1))] : [];
  const imp = (p) => import(pathToFileURL(path.join(root, p)).href);
  process.chdir(root);
  const E = await imp('src/engine/index.mjs');
  const { loadContent } = await imp('src/node/load.mjs');
  const { BOTS } = await imp('harness/bots.mjs');
  const content = loadContent();
  const skip = (k, v) => (k === 'content' || DROP.has(k) ? undefined : v);
  const out = {};
  for (const [name, bot] of Object.entries(BOTS)) {
    out[name] = [];
    if (only && name !== onlyBot) continue;
    for (let i = 0; i < n; i++) {
      if (only && i !== onlyIdx) continue;
      const h = createHash('sha256');
      const trace = [];
      let tag = '';
      const see = (card, s) => {
        const json = JSON.stringify(card, skip);
        h.update(json);
        // digest สั้น: การ์ด id เดิมแต่เนื้อ/ตัวเลือกเปลี่ยน (ใบที่แก้การ์ดเดิม) ต้องชี้ใบนั้นได้ ไม่ใช่เห็นแค่ id เท่ากัน
        if (only) trace.push([`${tag} · อายุ ${s?.age ?? '-'} · ${card.id ?? card.kind ?? card.step}`, createHash('sha256').update(json).digest('hex').slice(0, 6)]);
      };
      let calls = 0;
      // ห่อด้วย Object.assign ให้ .focus ของบอทติดไป — ห่อเปล่าแล้วบอทไม่โฟกัส ชีวิตไม่ตรงที่ด่านจริงเล่น
      const pick = Object.assign((card, rng, x) => {
        let k = bot(card, rng, x);
        if (ctl && ++calls === CTL_AT) {
          const at = typeof k === 'object' ? k.i : k;
          const alt = E.openChoices(card).find((j) => j !== at);
          if (alt !== undefined) k = typeof k === 'object' ? { ...k, i: alt } : alt;
        }
        h.update(`>${JSON.stringify(k)}`);
        return k;
      }, bot);
      if (world === 'isekai') {
        const isk = E.startIsekai({ seed: E.mixSeed(seed, i), karma: ((i % 21) - 10) / 10 });
        const rng = E.makeRng(E.mixSeed(seed ^ ISEKAI_BOT_SALT, i));
        for (let g = 0; g < ISEKAI_CAP; g++) {
          const card = E.nextIsekaiCard(isk);
          see(card);
          if (card.step === 'end') break;
          if (card.choices.length) E.chooseIsekai(isk, pick(card, rng, {}));
          else if (card.entered && E.isekaiFocusPick) E.isekaiFocusPick(isk, pick(E.isekaiFocusCard(isk), rng, {}));
        }
        h.update(`|${JSON.stringify(isk, skip)}`);
      } else if (world === 'chain') {
        let st = E.newLife(E.mixSeed(seed, i), content);
        for (let g = 0; g < CHAIN_GENS; g++) {
          tag = `รุ่น ${g + 1} ชีวิต`;
          const { state, age, cards } = E.playLife(st.seed, content, pick, see, st);
          h.update(`|${g}|${age}|${cards}|${JSON.stringify(state, skip)}`);
          tag = `รุ่น ${g + 1} ปรโลก`;
          if (g < CHAIN_GENS - 1) st = E.nextLife(E.playAfterlife(state, pick, see));
        }
      } else {
        const { state, age, cards } = E.playLife(E.mixSeed(seed, i), content, pick, see);
        h.update(`|${age}|${cards}|${JSON.stringify(state, skip)}`);
      }
      out[name].push(only ? trace : h.digest('hex').slice(0, 16));
    }
  }
  return out;
}

function run(root, n, seed, ctl, world, only = '') {
  let text;
  try {
    text = execFileSync(process.execPath, [SELF, '--worker', root, String(n), String(seed), ctl ? '1' : '0', world, ...(only ? [only] : [])], { maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    // worker ล้ม (เช่น node_modules ขาดใน worktree ฐาน) — stderr คือต้นเหตุที่หายไป
    const err = (e.stderr?.toString() ?? '').split('\n').slice(0, 5).join('\n');
    if (err) console.error(`worker ล้ม (exit ${e.status}):\n${err}`);
    process.exit(2);
  }
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
  let diff = 0, total = 0, first = null, at = null;
  for (const name of Object.keys(a)) {
    a[name].forEach((h, i) => {
      total++;
      if (h !== b[name]?.[i]) {
        diff++;
        first ??= `${name} ชีวิตที่ ${i}`;
        at ??= `${name}:${i}`;
      }
    });
  }
  return { diff, total, first, at };
}

// สายต่างที่ hash เดียวบอกแค่ว่าต่าง — รันสายแรกที่ต่างซ้ำทั้งสองฝั่งแล้วชี้การ์ดแรกที่แยกกัน (รุ่น · ช่วง · อายุ · id)
function firstSplit(baseDir, n, seed, world, at) {
  const bot = at.slice(0, at.lastIndexOf(':'));
  const [a] = run(baseDir, n, seed, false, world, at)[bot];
  const [b] = run(REPO, n, seed, false, world, at)[bot];
  let k = 0;
  while (k < a.length && k < b.length && a[k][0] === b[k][0] && a[k][1] === b[k][1]) k++;
  if (k === a.length && k === b.length) return 'ไล่การ์ดซ้ำแล้วเท่ากัน — ต่างที่ค่าท้ายสาย (state/อายุ/จำนวนการ์ด) ไม่ใช่การ์ดใบใด';
  const x = a[k], y = b[k];
  const same = x && y && x[0] === y[0] ? ' (id เดียวกัน เนื้อการ์ด/ตัวเลือกต่าง)' : '';
  return `การ์ดที่ ${k + 1} ของสาย · ฐาน: ${x?.[0] ?? '(จบสาย)'} ⇄ ใหม่: ${y?.[0] ?? '(จบสาย)'}${same}`;
}

async function main() {
  const base = opt('--base');
  const world = opt('--world', 'life');
  if (!base || !(world in CTL_MIN)) {
    console.error('ใช้: npm run lifehash -- --base <sha> [--world life|isekai|chain] [--n 300 · chain 50] [--seeds 1,2,3] [--quick]');
    return 2;
  }
  // สามรุ่นต่อสายช้ากว่าชีวิตเดียวราว 10 เท่า — ค่าตั้งต้นของ chain จึงน้อยกว่า
  const full = { life: 300, isekai: 300, chain: 50 }[world];
  const n = Number(opt('--n', args.includes('--quick') ? Math.round(full / 3) : full));
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
  const unit = { life: 'ชีวิต', isekai: 'ชาติต่างโลก', chain: `สาย ${CHAIN_GENS} รุ่น` }[world];
  console.log(`${unit}เดิมทุกไบต์ · ฐาน ${b.full.slice(0, 7)} vs working tree (HEAD ${head}${dirty ? ' + ไฟล์ยังไม่ commit' : ''}) · ${n} ${unit}/บอท · seed ${seeds.join(' ')}`);
  if (dirty) console.log(dirty.split('\n').map((l) => `  ${l}`).join('\n'));
  let fail = 0;
  for (const s of seeds) {
    const r = compare(run(b.dir, n, s, false, world), run(REPO, n, s, false, world));
    console.log(`  seed ${s}: ต่าง ${r.diff}/${r.total}${r.first ? ` · ตัวแรก ${r.first}` : ''}`);
    if (r.diff && world === 'chain') console.log(`    ${firstSplit(b.dir, n, s, world, r.at)}`);
    if (r.diff) fail++;
  }
  const s0 = seeds[0];
  const c = compare(run(REPO, n, s0, false, world), run(REPO, n, s0, true, world));
  const share = c.diff / c.total;
  const sens = share >= CTL_MIN[world];
  console.log(`ตัวควบคุม: กดตัวเลือกอื่นที่การตัดสินครั้งที่ ${CTL_AT} (seed ${s0}) ต่าง ${c.diff}/${c.total} (${(100 * share).toFixed(1)}%) · ต้อง ≥ ${100 * CTL_MIN[world]}% → ${sens ? 'ไวพอ' : 'ไม่ไวพอ'}`);
  if (!sens) return 2;
  console.log(fail ? `ตก: ${unit}ต่างจากฐาน ${fail}/${seeds.length} seed` : `ผ่าน: ${unit}เดิมทุกไบต์ทุกบอททุก seed`);
  return fail ? 1 : 0;
}
