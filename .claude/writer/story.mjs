#!/usr/bin/env node
// next-life story writer ledger: tracks content added by the next-life-writer agent
// and removes it cleanly without ever touching content that existed at the base commit.
//
// Ownership is marked inside the YAML itself, so the ledger can never drift from the files:
//   # >>> nl-writer <batch> <kind> <name>
//   ...lines owned by the writer...
//   # <<< nl-writer <batch> <kind> <name>
// kind = evt (event / isekai card) · flag (registry line in content/rules/*.yaml)
// A file whose first line is `# nl-writer file <batch>` was created by the writer and is
// deleted when its last owned block is removed.
//
// Usage (run from repo root):
//   node .claude/writer/story.mjs new-batch --topic "<text>" [--brief .claude/research/x.md]
//   node .claude/writer/story.mjs status
//   node .claude/writer/story.mjs check
//   node .claude/writer/story.mjs remove <selector> [--cascade] [--yes]
//     selectors: --id a,b · --batch b001[,b002] · --last · --all · --stage <ชื่อช่วงวัย>
//                --years 2530-2550 (overlap) · --file content/x.yaml
//     without --yes it is a dry run that only prints the plan.

import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const LEDGER = join(ROOT, '.claude', 'writer', 'manifest.json');
const SCAN_DIRS = ['content', 'content/isekai', 'content/rules'];
const OPEN = /^\s*# >>> nl-writer (b\d{3,}) (evt|flag) (\S+)\s*$/;
const CLOSE = /^\s*# <<< nl-writer (b\d{3,}) (evt|flag) (\S+)\s*$/;
const FILE_HDR = /^# nl-writer file (b\d{3,})\s*$/;

const rel = (p) => p.replace(ROOT, '').replace(/^[\\/]/, '').replace(/\\/g, '/');
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const die = (m) => { console.error(`ERROR: ${m}`); process.exit(1); };

function loadLedger() {
  if (!existsSync(LEDGER)) return { batches: [] };
  return JSON.parse(readFileSync(LEDGER, 'utf8'));
}
function saveLedger(l) {
  mkdirSync(dirname(LEDGER), { recursive: true });
  writeFileSync(LEDGER, JSON.stringify(l, null, 2) + '\n');
}

function readText(file) {
  const raw = readFileSync(join(ROOT, file), 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  return { raw, eol, lines: raw.split(/\r?\n/) };
}

function yamlFiles() {
  const out = [];
  for (const d of SCAN_DIRS) {
    if (!existsSync(join(ROOT, d))) continue;
    for (const n of readdirSync(join(ROOT, d)).sort()) if (n.endsWith('.yaml')) out.push(`${d}/${n}`);
  }
  return out;
}

// Every owned block in every scanned file.
function scanBlocks() {
  const blocks = [];
  const problems = [];
  const createdFiles = {};
  for (const file of yamlFiles()) {
    const { lines } = readText(file);
    const hdr = lines[0]?.match(FILE_HDR);
    if (hdr) createdFiles[file] = hdr[1];
    let open = null;
    lines.forEach((ln, i) => {
      const o = ln.match(OPEN);
      const c = ln.match(CLOSE);
      if (o) {
        if (open) problems.push(`${file}:${i + 1} opens ${o[3]} before closing ${open.name}`);
        open = { file, batch: o[1], kind: o[2], name: o[3], start: i };
      } else if (c) {
        if (!open || open.batch !== c[1] || open.kind !== c[2] || open.name !== c[3]) {
          problems.push(`${file}:${i + 1} close marker ${c[3]} has no matching open`);
        } else {
          blocks.push({ ...open, end: i, body: lines.slice(open.start + 1, i).join('\n') });
        }
        open = null;
      }
    });
    if (open) problems.push(`${file}:${open.start + 1} block ${open.name} never closed`);
  }
  return { blocks, problems, createdFiles };
}

// Parse the event inside a block to read stage/years for range selectors.
function blockMeta(b) {
  if (b.kind !== 'evt') return {};
  try {
    const body = b.body.split('\n').map((l) => l.replace(/^ {2}/, '')).join('\n');
    const doc = parse(body);
    const ev = Array.isArray(doc) ? doc[0] : doc;
    return { stage: ev?.stage, years: ev?.years };
  } catch { return {}; }
}

// All strings and keys inside a parsed value, for reference scanning.
function tokens(v, acc = new Set()) {
  if (typeof v === 'string') acc.add(v);
  else if (Array.isArray(v)) v.forEach((x) => tokens(x, acc));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { acc.add(k); tokens(x, acc); }
  return acc;
}

// Every card in content (events + isekai cards), with its owner batch if writer-owned.
function allCards(blocks) {
  const owned = new Map(blocks.filter((b) => b.kind === 'evt').map((b) => [b.name, b]));
  const cards = [];
  for (const file of yamlFiles()) {
    if (file.startsWith('content/rules/')) continue;
    let doc;
    try { doc = parse(readText(file).raw); } catch (e) { die(`${file} does not parse: ${e.message}`); }
    for (const ev of [...(doc?.events ?? []), ...(doc?.cards ?? [])]) {
      if (!ev?.id) continue;
      const t = tokens(ev);
      t.delete(ev.id);
      cards.push({ id: ev.id, file, owner: owned.get(ev.id)?.batch ?? null, refs: t });
    }
  }
  return cards;
}

function baseOf(ledger) {
  const shas = ledger.batches.map((b) => b.base).filter(Boolean);
  return shas[0] ?? null;
}

// True if <name> exists in content at the base commit (= old content, never removable).
function existedAtBase(base, name) {
  if (!base) return false;
  try {
    const out = git('grep', '-w', '-l', '-e', name, base, '--', 'content');
    return out.trim().length > 0;
  } catch { return false; }
}

// ---------- commands ----------

function cmdNewBatch(args) {
  const ledger = loadLedger();
  const n = ledger.batches.length + 1;
  const id = `b${String(n).padStart(3, '0')}`;
  const base = ledger.batches[0]?.base ?? git('rev-parse', 'HEAD').trim();
  const branch = git('rev-parse', '--abbrev-ref', 'HEAD').trim();
  ledger.batches.push({
    id, topic: args.topic ?? '', brief: args.brief ?? '', branch, base,
    created: new Date().toISOString(),
  });
  saveLedger(ledger);
  console.log(id);
  console.log(`base ${base.slice(0, 7)} · branch ${branch}`);
}

function cmdStatus() {
  const ledger = loadLedger();
  const { blocks, problems, createdFiles } = scanBlocks();
  if (!ledger.batches.length && !blocks.length) { console.log('ยังไม่มีของที่ writer สร้าง'); return; }
  for (const b of ledger.batches) {
    const mine = blocks.filter((x) => x.batch === b.id);
    console.log(`\n${b.id} · ${b.topic} · ${b.created.slice(0, 10)} · branch ${b.branch}${b.removed ? ' · ลบแล้ว' : ''}`);
    for (const x of mine) {
      const m = blockMeta(x);
      const where = m.stage ? ` · ${m.stage} ${JSON.stringify(m.years)}` : '';
      console.log(`  ${x.kind === 'evt' ? 'การ์ด' : 'ธง  '} ${x.name}${where} · ${x.file}:${x.start + 2}`);
    }
    if (!mine.length) console.log('  (ไม่มีบล็อกเหลือในไฟล์)');
  }
  const files = Object.entries(createdFiles);
  if (files.length) console.log(`\nไฟล์ที่ writer สร้าง: ${files.map(([f, b]) => `${f} (${b})`).join(' · ')}`);
  if (problems.length) { console.log('\nมาร์กเกอร์เสีย:'); problems.forEach((p) => console.log(`  ${p}`)); }
}

// Proves that every change since base in content/ sits inside writer-owned blocks or files.
function cmdCheck({ quiet } = {}) {
  const ledger = loadLedger();
  const base = baseOf(ledger);
  const { blocks, problems, createdFiles } = scanBlocks();
  const issues = [...problems];
  if (!base) { if (!quiet) console.log('ไม่มี batch · ไม่มีอะไรตรวจ'); return issues; }

  // 1. changed lines vs base must be inside owned blocks
  const diff = git('diff', '-U0', '--no-color', base, '--', 'content');
  let file = null; let isNew = false;
  for (const ln of diff.split(/\r?\n/)) {
    if (ln.startsWith('diff --git')) { file = null; isNew = false; continue; }
    if (ln.startsWith('new file mode')) { isNew = true; continue; }
    if (ln.startsWith('+++ ')) { file = ln.slice(4).replace(/^b\//, '').trim(); continue; }
    const h = ln.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    if (!h || !file || file === '/dev/null') continue;
    const delCount = h[2] === undefined ? 1 : Number(h[2]);
    const addStart = Number(h[3]) - 1;
    const addCount = h[4] === undefined ? 1 : Number(h[4]);
    if (isNew) {
      if (!createdFiles[file]) issues.push(`${file}: new file without "# nl-writer file <batch>" header`);
      continue;
    }
    if (delCount > 0) issues.push(`${file}: ${delCount} line(s) of old content changed/removed near new line ${addStart + 1}`);
    const mine = blocks.filter((b) => b.file === file);
    for (let i = addStart; i < addStart + addCount; i++) {
      if (!mine.some((b) => i >= b.start && i <= b.end)) issues.push(`${file}:${i + 1} added line outside nl-writer block`);
    }
  }
  // 1b. untracked files are invisible to git diff — they must carry the writer header
  const untracked = git('ls-files', '--others', '--exclude-standard', '--', 'content').split(/\r?\n/).filter(Boolean);
  for (const f of untracked) if (f.endsWith('.yaml') && !createdFiles[f]) issues.push(`${f}: new file without "# nl-writer file <batch>" header`);
  // 2. no owned name may exist at base (owned = new only)
  for (const b of blocks) if (existedAtBase(base, b.name)) issues.push(`${b.name} (${b.file}) already existed at base ${base.slice(0, 7)} — not writer-owned`);
  // 3. every owned event must parse and be a real card
  const ids = new Set(allCards(blocks).map((c) => c.id));
  for (const b of blocks.filter((x) => x.kind === 'evt')) if (!ids.has(b.name)) issues.push(`block ${b.name} does not contain a card with that id`);

  if (!quiet) {
    if (issues.length) { console.log(`ไม่ผ่าน ${issues.length} ข้อ`); issues.forEach((p) => console.log(`  ${p}`)); }
    else console.log(`ผ่าน · ของเดิมไม่ถูกแตะ · ${blocks.length} บล็อก · เทียบกับ ${base.slice(0, 7)}`);
  }
  return issues;
}

function cmdRemove(args) {
  const ledger = loadLedger();
  const base = baseOf(ledger);
  const { blocks, problems, createdFiles } = scanBlocks();
  if (problems.length) die(`มาร์กเกอร์เสีย แก้ก่อน:\n${problems.join('\n')}`);

  let pick = [];
  const evts = blocks.filter((b) => b.kind === 'evt');
  if (args.all) pick = evts;
  else if (args.last) { const last = ledger.batches.filter((b) => !b.removed).at(-1); if (!last) die('ไม่มี batch'); pick = evts.filter((b) => b.batch === last.id); }
  else if (args.batch) { const s = new Set(args.batch.split(',')); pick = evts.filter((b) => s.has(b.batch)); }
  else if (args.id) { const s = new Set(args.id.split(',')); pick = evts.filter((b) => s.has(b.name)); const miss = [...s].filter((x) => !pick.some((b) => b.name === x)); if (miss.length) die(`ไม่ใช่ของที่ writer สร้าง (หรือไม่มี): ${miss.join(', ')}`); }
  else if (args.file) pick = evts.filter((b) => b.file === args.file);
  else if (args.stage) pick = evts.filter((b) => blockMeta(b).stage === args.stage);
  else if (args.years) {
    const [lo, hi] = args.years.split('-').map(Number);
    if (!lo || !hi) die('--years ต้องเป็น 2530-2550');
    pick = evts.filter((b) => { const y = blockMeta(b).years; return y && y[0] <= hi && y[1] >= lo; });
  } else die('ต้องระบุ --id / --batch / --last / --all / --stage / --years / --file');

  // Cascade: cards that still point at a removed card (next / schedules / follow).
  const cards = allCards(blocks);
  const removeIds = new Set(pick.map((b) => b.name));
  const blockers = [];
  for (let changed = true; changed;) {
    changed = false;
    for (const c of cards) {
      if (removeIds.has(c.id)) continue;
      const hit = [...removeIds].filter((r) => c.refs.has(r));
      if (!hit.length) continue;
      if (!c.owner) { blockers.push(`${c.id} (ของเดิม ${c.file}) อ้าง ${hit.join(', ')}`); continue; }
      if (args.cascade) { removeIds.add(c.id); changed = true; }
      else blockers.push(`${c.id} (${c.owner}) อ้าง ${hit.join(', ')} — ใส่ --cascade เพื่อลบด้วย`);
    }
  }
  for (const id of removeIds) if (existedAtBase(base, id)) blockers.push(`${id} มีอยู่ตั้งแต่ base — ห้ามลบ`);
  if (blockers.length) die(`ลบไม่ได้:\n  ${[...new Set(blockers)].join('\n  ')}`);

  // Flags owned by the writer that no remaining card sets or reads any more.
  const remaining = cards.filter((c) => !removeIds.has(c.id));
  const stillUsed = new Set();
  for (const c of remaining) for (const t of c.refs) stillUsed.add(t.split(':')[0]);
  const flagDrop = blocks.filter((b) => b.kind === 'flag' && !stillUsed.has(b.name) && !existedAtBase(base, b.name));
  const flagKeep = blocks.filter((b) => b.kind === 'flag' && stillUsed.has(b.name) && [...removeIds].some((id) => cards.find((c) => c.id === id)?.refs.has(b.name)));

  const drop = [...blocks.filter((b) => b.kind === 'evt' && removeIds.has(b.name)), ...flagDrop];
  if (!drop.length) { console.log('ไม่มีของตรงเงื่อนไข'); return; }
  console.log(`${args.yes ? 'ลบ' : 'แผนลบ (dry run · ใส่ --yes เพื่อลบจริง)'}:`);
  for (const b of drop) console.log(`  ${b.kind === 'evt' ? 'การ์ด' : 'ธง  '} ${b.name} · ${b.batch} · ${b.file}`);
  for (const b of flagKeep) console.log(`  เก็บธง ${b.name} · การ์ดอื่นของ writer ยังใช้`);
  if (!args.yes) return;

  // Apply: cut whole blocks (markers included) bottom-up so line numbers stay valid.
  const byFile = new Map();
  for (const b of drop) { if (!byFile.has(b.file)) byFile.set(b.file, []); byFile.get(b.file).push(b); }
  const deletedFiles = [];
  for (const [file, list] of byFile) {
    const { lines, eol } = readText(file);
    for (const b of list.sort((a, z) => z.start - a.start)) lines.splice(b.start, b.end - b.start + 1);
    const leftOwned = blocks.some((b) => b.file === file && !drop.includes(b));
    if (createdFiles[file] && !leftOwned) { unlinkSync(join(ROOT, file)); deletedFiles.push(file); continue; }
    writeFileSync(join(ROOT, file), lines.join(eol));
  }

  const left = scanBlocks().blocks;
  for (const b of ledger.batches) if (!left.some((x) => x.batch === b.id)) b.removed = b.removed ?? new Date().toISOString();
  if (!left.length) ledger.batches.forEach((b) => { b.removed = b.removed ?? new Date().toISOString(); });
  saveLedger(ledger);

  console.log(`ลบแล้ว ${drop.length} บล็อก${deletedFiles.length ? ` · ลบไฟล์ ${deletedFiles.join(', ')}` : ''}`);
  const issues = cmdCheck({ quiet: true });
  if (issues.length) { console.log('check หลังลบไม่ผ่าน:'); issues.forEach((p) => console.log(`  ${p}`)); process.exit(1); }
  if (!left.length && base) {
    const d = git('diff', '--stat', base, '--', 'content').trim();
    console.log(d ? `เหลือส่วนต่างใน content เทียบ base (ไม่ใช่ของ writer?):\n${d}` : `content กลับเท่า base ${base.slice(0, 7)} ทุกบรรทัด`);
  }
  console.log('ขั้นต่อ: npm run lint:test && node build.mjs แล้วเปิด docs/play.html');
}

// ---------- cli ----------
const [cmd, ...rest] = process.argv.slice(2);
const args = {};
for (let i = 0; i < rest.length; i++) {
  const k = rest[i];
  if (!k.startsWith('--')) continue;
  const key = k.slice(2);
  const v = rest[i + 1];
  if (v === undefined || v.startsWith('--')) args[key] = true;
  else { args[key] = v; i++; }
}
switch (cmd) {
  case 'new-batch': cmdNewBatch(args); break;
  case 'status': cmdStatus(); break;
  case 'check': process.exit(cmdCheck().length ? 1 : 0); break;
  case 'remove': cmdRemove(args); break;
  default:
    console.log('usage: node .claude/writer/story.mjs new-batch|status|check|remove (see header)');
}
