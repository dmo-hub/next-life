// จอต้นไม้โฟกัส (ใบ 12 · แบบ 4 กลุ่มดาว): ผังกับตัววาด SVG ล้วน ไม่แตะ DOM/สถานะเกม — แอปกับหน้าเว็บโฟกัสใช้ชุดเดียวกัน
// ชื่อระดับบนสุดขึ้นต้น tv/TREE_VIEW ทั้งหมด — build ต่อทุกโมดูลเป็นสคริปต์เดียว ชื่อซ้ำกับโมดูลอื่นไม่ได้

// แขนงที่ตั้งชื่อ/สีไว้ · แขนงใหม่ในทะเบียน (content/rules/tree.yaml) ที่ไม่อยู่ที่นี่ = หน้าเว็บหยุด build (site focus.mjs) แทนวาดแขนงไร้ชื่อ
export const TREE_VIEW_BRANCH = { occ: { name: 'ลึกลับ', color: '#B0509A' } };

const TV_GAP_X = 118;
const TV_GAP_Y = 76;
// กันป้ายชื่อโหนดล้นขอบ: ขอบ viewBox = ขอบของโหนดนอกสุด + ครึ่งความกว้างป้ายที่ยาวสุด (ข้อ 88 ภาพเจ้าของป้ายกลุ่มขวาโดนตัด)
const TV_PAD_X = 84;
const TV_PAD_TOP = 30;
const TV_PAD_BOTTOM = 52;
const TV_R = 14;

const tvEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tvPolar = (deg, r, cx, cy) => ({ x: cx + r * Math.cos((deg * Math.PI) / 180), y: cy + r * Math.sin((deg * Math.PI) / 180) });

// โหนดกลาง (and) อยู่ระหว่างแขนงของต้นทาง ไม่นับเป็นสมาชิกกลุ่มไหน
export const treeViewBranches = (defs) => [...new Set(Object.values(defs).filter((d) => !d.and).map((d) => d.branch))];

// ผัง: กลุ่มของแต่ละแขนงรวมเป็นก้อนเดียว วางรอบวง (แขนงเดียว = กลางจอ) · ลึกในกลุ่ม = ห่างจากรากของแขนงตามขอบ pre ที่อยู่แขนงเดียวกัน
// คืน { W, H, P:{id:{x,y}}, pills:{branch:{x,y}}, boxes:{branch:{x0,y0,x1,y1}} } พิกัดเลื่อนให้มุมซ้ายบนเป็น 0,0
export function treeViewLayout(defs) {
  const ids = Object.keys(defs);
  const branches = treeViewBranches(defs);
  const depth = {};
  const depthOf = (id) => {
    if (depth[id] !== undefined) return depth[id];
    depth[id] = 0;
    const same = (defs[id].pre ?? []).filter((p) => defs[p] && defs[p].branch === defs[id].branch && !defs[p].and);
    depth[id] = same.length ? 1 + Math.max(...same.map(depthOf)) : 0;
    return depth[id];
  };
  const local = {};
  const size = {};
  for (const b of branches) {
    const mine = ids.filter((id) => !defs[id].and && defs[id].branch === b);
    const rows = [];
    for (const id of mine) (rows[depthOf(id)] ??= []).push(id);
    rows.forEach((row, r) => row?.forEach((id, i) => { local[id] = { x: (i - (row.length - 1) / 2) * TV_GAP_X, y: r * TV_GAP_Y }; }));
    size[b] = { w: Math.max(0, ...rows.map((r) => ((r?.length ?? 1) - 1) * TV_GAP_X)), h: (rows.length - 1) * TV_GAP_Y };
  }
  const ring = branches.length > 1 ? 150 + 70 * branches.length : 0;
  const P = {};
  const pills = {};
  branches.forEach((b, i) => {
    const c = ring ? tvPolar(-90 + (i * 360) / branches.length, ring, 0, 0) : { x: 0, y: 0 };
    for (const id of ids) if (local[id] && !defs[id].and && defs[id].branch === b) P[id] = { x: c.x + local[id].x, y: c.y + local[id].y - size[b].h / 2 };
    pills[b] = { x: c.x, y: c.y - size[b].h / 2 - 44 };
  });
  for (const id of ids) if (defs[id].and) {
    const ps = (defs[id].pre ?? []).map((p) => P[p]).filter(Boolean);
    P[id] = { x: ps.reduce((s, p) => s + p.x, 0) / (ps.length || 1), y: ps.reduce((s, p) => s + p.y, 0) / (ps.length || 1) };
  }
  const all = Object.values(P);
  const px = Object.values(pills);
  const x0 = Math.min(...all.map((p) => p.x), ...px.map((p) => p.x - 50)) - TV_PAD_X;
  const x1 = Math.max(...all.map((p) => p.x), ...px.map((p) => p.x + 50)) + TV_PAD_X;
  const y0 = Math.min(...all.map((p) => p.y - TV_PAD_TOP), ...px.map((p) => p.y - 16));
  const y1 = Math.max(...all.map((p) => p.y)) + TV_PAD_BOTTOM;
  for (const p of all) { p.x -= x0; p.y -= y0; }
  for (const p of px) { p.x -= x0; p.y -= y0; }
  const boxes = {};
  for (const b of branches) {
    const mine = ids.filter((id) => P[id] && !defs[id].and && defs[id].branch === b).map((id) => P[id]);
    boxes[b] = {
      x0: Math.max(0, Math.min(...mine.map((p) => p.x), pills[b].x - 50) - TV_PAD_X),
      x1: Math.min(x1 - x0, Math.max(...mine.map((p) => p.x), pills[b].x + 50) + TV_PAD_X),
      y0: Math.max(0, pills[b].y - 22),
      y1: Math.min(y1 - y0, Math.max(...mine.map((p) => p.y)) + TV_PAD_BOTTOM),
    };
  }
  return { W: x1 - x0, H: y1 - y0, P, pills, boxes };
}

// เส้นโค้งเบาๆ ให้เส้นข้ามกลุ่มไม่ทับกันเป็นเส้นตรงเดียว (แบบ 4)
const tvR = Math.round;
const tvEdge = (a, b) => {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y;
  return `M${tvR(a.x)} ${tvR(a.y)}Q${tvR(mx - dy * 0.12)} ${tvR(my + dx * 0.12)} ${tvR(b.x)} ${tvR(b.y)}`;
};

// info(id) → { st: 'done'|'act'|'open'|'wait'|'lock'|'hid'|'plain', g: 0..1 } · ไม่ส่ง = ทุกโหนด plain (หน้าเว็บ)
// st 'hid' = ช่อง "?" ของโหนดซ่อน (ไม่บอกชื่อ · ข้อ 61) · g = ความเต็มของหลอดรอบโหนดที่ทุ่มอยู่ ไม่มีตัวเลข (ข้อ 46)
export function treeViewSvg(defs, { info = () => ({ st: 'plain', g: 0 }), only = null, sel = null, interactive = true } = {}) {
  const L = treeViewLayout(defs);
  const box = only ? L.boxes[only] : { x0: 0, y0: 0, x1: L.W, y1: L.H };
  const color = (id) => TREE_VIEW_BRANCH[defs[id].branch]?.color ?? '#8a8a8a';
  let s = '';
  for (const id of Object.keys(defs)) for (const p of defs[id].pre ?? []) if (L.P[p]) {
    const cross = !defs[id].and && defs[p].branch !== defs[id].branch;
    s += `<path class="tv-e${cross ? ' x' : ''}" d="${tvEdge(L.P[p], L.P[id])}" style="--tvc:${color(id)}"/>`;
  }
  for (const [id, d] of Object.entries(defs)) {
    const q = L.P[id], i = info(id);
    const hid = i.st === 'hid';
    const shape = d.keystone ? `<rect class="tv-n k" x="-12" y="-12" width="24" height="24" transform="rotate(45)"/>` : `<circle class="tv-n" r="${TV_R}"/>`;
    const ring = i.st === 'act' || i.st === 'wait' ? `<circle class="tv-ring" r="${TV_R + 5}" transform="rotate(-90)" stroke-dasharray="${tvR(Math.min(1, i.g) * 2 * Math.PI * (TV_R + 5))} 999"/>` : '';
    const mark = hid ? '<text class="tv-q" y="4" text-anchor="middle">?</text>' : '';
    const pick = sel === id ? `<circle class="tv-pick" r="${TV_R + 10}"/>` : '';
    const label = hid ? '' : `<text class="tv-l" y="${TV_R + 17}" text-anchor="middle">${tvEsc(d.name)}</text>`;
    const attrs = interactive ? ` tabindex="0" role="button" data-tv="${tvEsc(id)}" aria-label="${tvEsc(hid ? 'ช่องที่ยังซ่อนอยู่' : d.name)}"` : '';
    s += `<g class="tv-g s-${i.st}${d.size === 'b' ? ' big' : ''}"${attrs} style="--tvc:${color(id)}" transform="translate(${tvR(q.x)} ${tvR(q.y)})">${pick}${shape}${ring}${mark}${label}</g>`;
  }
  for (const [b, p] of Object.entries(L.pills)) {
    const name = TREE_VIEW_BRANCH[b]?.name ?? b;
    s += `<g class="tv-pill" transform="translate(${tvR(p.x)} ${tvR(p.y)})" style="--tvc:${TREE_VIEW_BRANCH[b]?.color ?? '#8a8a8a'}"><rect x="-44" y="-12" width="88" height="24" rx="12"/><text y="4" text-anchor="middle">${tvEsc(name)}</text></g>`;
  }
  const vb = `${tvR(box.x0)} ${tvR(box.y0)} ${tvR(box.x1 - box.x0)} ${tvR(box.y1 - box.y0)}`;
  return { svg: `<svg class="tv-svg" viewBox="${vb}" role="group" aria-label="ต้นไม้โฟกัส">${s}</svg>`, w: tvR(box.x1 - box.x0), h: tvR(box.y1 - box.y0) };
}
