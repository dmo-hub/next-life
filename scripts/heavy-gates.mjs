// Dispatch .github/workflows/heavy-gates.yml and collect its logs.
//   node scripts/heavy-gates.mjs run <ref> [gates] [seed2]
//   node scripts/heavy-gates.mjs status [runId]
//   node scripts/heavy-gates.mjs fetch <runId> [outDir]
// Takes the token from GITHUB_TOKEN or `gh auth token` at run time, so it never lands in a file.
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const REPO = 'dmo-hub/next-life';
const API = `https://api.github.com/repos/${REPO}`;
const WORKFLOW = 'heavy-gates.yml';
const token = process.env.GITHUB_TOKEN || ghToken();

function ghToken() {
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

const headers = () => ({
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

async function api(path, init) {
  const res = await fetch(`${API}${path}`, { ...init, headers: { ...headers(), ...init?.headers } });
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

function requireToken() {
  if (!token) throw new Error('no token: run gh auth login, or set GITHUB_TOKEN');
}

async function dispatch([ref, gates, seed2]) {
  requireToken();
  if (!ref) throw new Error('usage: run <ref> [gates] [seed2]');
  const inputs = { ref, ...(gates ? { gates } : {}), ...(seed2 ? { seed2 } : {}) };
  await api(`/actions/workflows/${WORKFLOW}/dispatches`, { method: 'POST', body: JSON.stringify({ ref: 'main', inputs }) });
  console.log(`dispatched ${JSON.stringify(inputs)} · node scripts/heavy-gates.mjs status`);
}

async function status([runId]) {
  if (!runId) {
    const { workflow_runs: runs } = await api(`/actions/workflows/${WORKFLOW}/runs?per_page=8`);
    for (const r of runs) console.log(`${r.id} ${r.status}/${r.conclusion ?? '-'} ${r.event} ${r.head_sha.slice(0, 8)} ${r.created_at}`);
    return;
  }
  const { jobs } = await api(`/actions/runs/${runId}/jobs?per_page=100`);
  for (const j of jobs) {
    const minutes = j.completed_at ? ((Date.parse(j.completed_at) - Date.parse(j.started_at)) / 60000).toFixed(1) : '-';
    console.log(`${j.status}/${j.conclusion ?? '-'} ${minutes} min ${j.name}`);
  }
}

async function collect([runId, outDir = `heavy-gates-${runId}`]) {
  requireToken();
  if (!runId) throw new Error('usage: fetch <runId> [outDir]');
  const { artifacts } = await api(`/actions/runs/${runId}/artifacts?per_page=100`);
  mkdirSync(outDir, { recursive: true });
  for (const a of artifacts) {
    const res = await fetch(a.archive_download_url, { headers: headers() });
    if (!res.ok) throw new Error(`download ${a.name} -> ${res.status}`);
    const zip = join(outDir, `${a.name}.zip`);
    const dir = join(outDir, a.name);
    writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
    mkdirSync(dir, { recursive: true });
    execFileSync('tar', ['-xf', zip, '-C', dir]);
    rmSync(zip);
    console.log(join(dir, 'gate.log'));
  }
}

const [cmd, ...rest] = process.argv.slice(2);
const commands = { run: dispatch, status, fetch: collect };
if (!Object.hasOwn(commands, cmd ?? '')) {
  console.error('usage: heavy-gates.mjs run|status|fetch');
  process.exit(2);
}
await commands[cmd](rest);
