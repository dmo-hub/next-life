// จอต้นไม้โฟกัส (ใบ 12 · แบบ 4 กลุ่มดาว): ผังกับตัววาด SVG ล้วน ไม่แตะ DOM/สถานะเกม — แอปกับหน้าเว็บโฟกัสใช้ชุดเดียวกัน
// ชื่อระดับบนสุดขึ้นต้น tv/TREE_VIEW ทั้งหมด — build ต่อทุกโมดูลเป็นสคริปต์เดียว ชื่อซ้ำกับโมดูลอื่นไม่ได้

// แขนงที่ตั้งชื่อ/สีไว้ · แขนงใหม่ในทะเบียน (content/rules/tree.yaml) ที่ไม่อยู่ที่นี่ = หน้าเว็บหยุด build (site focus.mjs) แทนวาดแขนงไร้ชื่อ
export const TREE_VIEW_BRANCH = { money: { name: 'เงิน', color: '#C77A1E' }, rel: { name: 'ความสัมพันธ์', color: '#D0457A' }, know: { name: 'ความรู้', color: '#3F73D6' }, skill: { name: 'ทักษะ', color: '#1F9A72' }, occ: { name: 'ลึกลับ', color: '#B0509A' }, mid: { name: 'โหนดกลาง', color: '#64748B' } };

const TV_GAP_X = 118;
const TV_GAP_Y = 76;
// กันป้ายชื่อโหนดล้นขอบ: ขอบ viewBox = ขอบของโหนดนอกสุด + ครึ่งความกว้างป้ายที่ยาวสุด (ข้อ 88 ภาพเจ้าของป้ายกลุ่มขวาโดนตัด)
const TV_PAD_X = 84;
const TV_PAD_TOP = 30;
const TV_PAD_BOTTOM = 52;
const TV_R = 14;

// ป้ายชื่อโหนดไม่ทับเส้น/โหนด/ป้ายอื่น/ป้ายแขนง: ลองวางล่าง บน ขวา ซ้ายตามลำดับ เอาที่แรกที่ไม่ชน (ต้นไม้แตกลงล่างเสมอ ป้ายใต้โหนดจึงถูกเส้นลูกตัด)
// ความกว้างป้ายประมาณจากจำนวนตัวอักษร (ไม่นับสระ/วรรณยุกต์ลอย) เพราะผังคำนวณก่อนมีฟอนต์
// ต้นเต็มมีเส้นข้ามแขนงหนาแน่น 4 ทิศไม่พอ: ต่อด้วยป้ายเยื้องมุมและระยะไกลขึ้น (ลองตามลำดับ เอาที่ไม่ชนที่แรก)
const TV_POS = ['below', 'above', 'right', 'left', 'belowR', 'belowL', 'aboveR', 'aboveL', 'below2', 'above2', 'right2', 'left2',
  ...[30, 44, 60, 78, 100, 124].flatMap((r) => Array.from({ length: 16 }, (_, i) => `p:${i * 22.5}:${r}`))];
const TV_COMB = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g;
const tvLabelW = (name) => 7 * String(name).replace(TV_COMB, '').length;
const tvLabelAt = (pos, x, y, w) => {
  const gap = TV_R + 8;
  const o = TV_R + 6;
  // p:องศา:ระยะ = ป้ายวางกึ่งกลางที่ระยะนั้นรอบโหนด (เหลือทางเลือกสุดท้ายเมื่อ 12 ทิศข้างบนชนเส้นหมด) · ต้องพ้นวงโหนดตัวเอง
  if (pos.startsWith('p:')) {
    const [, deg, rad] = pos.split(':').map(Number);
    const cx = x + rad * Math.cos((deg * Math.PI) / 180), cy = y + rad * Math.sin((deg * Math.PI) / 180);
    const box = { x0: cx - w / 2, x1: cx + w / 2, y0: cy - 8, y1: cy + 8 };
    const own = !(box.x0 > x + TV_R + 2 || box.x1 < x - TV_R - 2 || box.y0 > y + TV_R + 2 || box.y1 < y - TV_R - 2);
    return { dx: cx - x, dy: cy - y + 4, anchor: 'middle', box, own };
  }
  if (pos === 'belowR') return { dx: 6, dy: TV_R + 17, anchor: 'start', box: { x0: x + 6, x1: x + 6 + w, y0: y + o, y1: y + o + 15 } };
  if (pos === 'belowL') return { dx: -6, dy: TV_R + 17, anchor: 'end', box: { x0: x - 6 - w, x1: x - 6, y0: y + o, y1: y + o + 15 } };
  if (pos === 'aboveR') return { dx: 6, dy: -(TV_R + 9), anchor: 'start', box: { x0: x + 6, x1: x + 6 + w, y0: y - TV_R - 20, y1: y - TV_R - 5 } };
  if (pos === 'aboveL') return { dx: -6, dy: -(TV_R + 9), anchor: 'end', box: { x0: x - 6 - w, x1: x - 6, y0: y - TV_R - 20, y1: y - TV_R - 5 } };
  if (pos === 'below2') return { dx: 0, dy: TV_R + 33, anchor: 'middle', box: { x0: x - w / 2, x1: x + w / 2, y0: y + TV_R + 22, y1: y + TV_R + 37 } };
  if (pos === 'above2') return { dx: 0, dy: -(TV_R + 25), anchor: 'middle', box: { x0: x - w / 2, x1: x + w / 2, y0: y - TV_R - 36, y1: y - TV_R - 21 } };
  if (pos === 'right2') return { dx: gap + 14, dy: 4, anchor: 'start', box: { x0: x + gap + 14, x1: x + gap + 14 + w, y0: y - 7, y1: y + 8 } };
  if (pos === 'left2') return { dx: -gap - 14, dy: 4, anchor: 'end', box: { x0: x - gap - 14 - w, x1: x - gap - 14, y0: y - 7, y1: y + 8 } };
  if (pos === 'above') return { dx: 0, dy: -(TV_R + 9), anchor: 'middle', box: { x0: x - w / 2, x1: x + w / 2, y0: y - TV_R - 20, y1: y - TV_R - 5 } };
  if (pos === 'right') return { dx: gap, dy: 4, anchor: 'start', box: { x0: x + gap, x1: x + gap + w, y0: y - 7, y1: y + 8 } };
  if (pos === 'left') return { dx: -gap, dy: 4, anchor: 'end', box: { x0: x - gap - w, x1: x - gap, y0: y - 7, y1: y + 8 } };
  return { dx: 0, dy: TV_R + 17, anchor: 'middle', box: { x0: x - w / 2, x1: x + w / 2, y0: y + TV_R + 6, y1: y + TV_R + 21 } };
};
const tvHit = (a, b, pad) => a.x0 - pad < b.x1 && b.x0 - pad < a.x1 && a.y0 - pad < b.y1 && b.y0 - pad < a.y1;
// เส้นโค้งเดียวกับ tvEdge แต่เป็นจุดถี่ ๆ ไว้เช็กชน
const tvEdgePts = (a, b) => {
  const cx = (a.x + b.x) / 2 - (b.y - a.y) * 0.12, cy = (a.y + b.y) / 2 + (b.x - a.x) * 0.12;
  return Array.from({ length: 25 }, (_, i) => { const t = i / 24, u = 1 - t; return { x: u * u * a.x + 2 * u * t * cx + t * t * b.x, y: u * u * a.y + 2 * u * t * cy + t * t * b.y }; });
};

const tvEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tvPolar = (deg, r, cx, cy) => ({ x: cx + r * Math.cos((deg * Math.PI) / 180), y: cy + r * Math.sin((deg * Math.PI) / 180) });

// โหนดกลาง (and) อยู่ระหว่างแขนงของต้นทาง ไม่นับเป็นสมาชิกกลุ่มไหน
export const treeViewBranches = (defs) => [...new Set(Object.values(defs).filter((d) => !d.and).map((d) => d.branch))];

// ผัง: กลุ่มของแต่ละแขนงรวมเป็นก้อนเดียว วางรอบวง (แขนงเดียว = กลางจอ) · ลึกในกลุ่ม = ห่างจากรากของแขนงตามขอบ pre ที่อยู่แขนงเดียวกัน
// คืน { W, H, P:{id:{x,y}}, pills:{branch:{x,y}}, boxes:{branch:{x0,y0,x1,y1}} } พิกัดเลื่อนให้มุมซ้ายบนเป็น 0,0
// labelPos = บังคับตำแหน่งป้ายทุกโหนด (ไว้ให้ด่านใน site-check ทำตัวควบคุม) · ไม่ส่ง = เลือกเองที่ไม่ชน
// overlaps = [{ id, kind: 'edge'|'node'|'label'|'pill', with }] ของป้ายที่ยังชนหลังเลือกแล้ว (ผังจริงต้องว่าง)
export function treeViewLayout(defs, { labelPos = null } = {}) {
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
  const edges = [];
  for (const id of ids) for (const p of defs[id].pre ?? []) if (P[p]) edges.push({ id, pts: tvEdgePts(P[p], P[id]) });
  const pillBox = (p) => ({ x0: p.x - 44, x1: p.x + 44, y0: p.y - 12, y1: p.y + 12 });
  const labels = {};
  const overlaps = [];
  for (const id of ids) if (P[id]) {
    const w = tvLabelW(defs[id].name);
    const tries = (labelPos ? [labelPos] : TV_POS).map((pos) => {
      const L = { pos, ...tvLabelAt(pos, P[id].x, P[id].y, w) };
      const hit = [];
      if (L.own) hit.push({ id, kind: 'node', with: id });
      for (const e of edges) if (e.pts.some((q) => tvHit({ x0: q.x, x1: q.x, y0: q.y, y1: q.y }, L.box, 2))) hit.push({ id, kind: 'edge', with: e.id });
      for (const o of ids) if (o !== id && P[o] && tvHit({ x0: P[o].x - TV_R - 2, x1: P[o].x + TV_R + 2, y0: P[o].y - TV_R - 2, y1: P[o].y + TV_R + 2 }, L.box, 0)) hit.push({ id, kind: 'node', with: o });
      for (const [o, l] of Object.entries(labels)) if (tvHit(l.box, L.box, 3)) hit.push({ id, kind: 'label', with: o });
      for (const [b, p] of Object.entries(pills)) if (tvHit(pillBox(p), L.box, 3)) hit.push({ id, kind: 'pill', with: b });
      return { L, hit };
    });
    const best = tries.find((t) => !t.hit.length) ?? tries.reduce((a, t) => (t.hit.length < a.hit.length ? t : a));
    labels[id] = best.L;
    overlaps.push(...best.hit);
  }
  const all = Object.values(P);
  const px = Object.values(pills);
  const lb = Object.values(labels).map((l) => l.box);
  const x0 = Math.min(Math.min(...all.map((p) => p.x), ...px.map((p) => p.x - 50)) - TV_PAD_X, ...lb.map((b) => b.x0 - 6));
  const x1 = Math.max(Math.max(...all.map((p) => p.x), ...px.map((p) => p.x + 50)) + TV_PAD_X, ...lb.map((b) => b.x1 + 6));
  const y0 = Math.min(...all.map((p) => p.y - TV_PAD_TOP), ...px.map((p) => p.y - 16), ...lb.map((b) => b.y0 - 4));
  const y1 = Math.max(Math.max(...all.map((p) => p.y)) + TV_PAD_BOTTOM, ...lb.map((b) => b.y1 + 4));
  for (const p of all) { p.x -= x0; p.y -= y0; }
  for (const p of px) { p.x -= x0; p.y -= y0; }
  for (const b of lb) { b.x0 -= x0; b.x1 -= x0; b.y0 -= y0; b.y1 -= y0; }
  const boxes = {};
  for (const b of branches) {
    const mineIds = ids.filter((id) => P[id] && !defs[id].and && defs[id].branch === b);
    const mine = mineIds.map((id) => P[id]);
    const mlb = mineIds.map((id) => labels[id].box);
    boxes[b] = {
      x0: Math.max(0, Math.min(Math.min(...mine.map((p) => p.x), pills[b].x - 50) - TV_PAD_X, ...mlb.map((l) => l.x0 - 6))),
      x1: Math.min(x1 - x0, Math.max(Math.max(...mine.map((p) => p.x), pills[b].x + 50) + TV_PAD_X, ...mlb.map((l) => l.x1 + 6))),
      y0: Math.max(0, pills[b].y - 22),
      y1: Math.min(y1 - y0, Math.max(Math.max(...mine.map((p) => p.y)) + TV_PAD_BOTTOM, ...mlb.map((l) => l.y1 + 4))),
    };
  }
  return { W: x1 - x0, H: y1 - y0, P, pills, boxes, labels, overlaps };
}

// โหนดล็อกเพราะต้นทางยังไม่ปลด: คำบอกชื่อต้นทางที่ยังขาด · คืน { names, joint } หรือ null (บอกชื่อไม่ได้ ให้ใช้คำกลาง ๆ เดิม)
// reach(id) = ต้นทางของโหนดนั้นผ่านแล้วหรือยัง (กติกาอยู่ที่แกน treeReach) · done = { id: อายุที่ปลด }
// โหนดกลาง (and) ต้องครบทุกตัว ใช้ "และ" · นอกนั้นตัวใดตัวหนึ่งก็พอ ใช้ "หรือ" — ตรงกับ treeReach
// ต้นทางที่ตัวเองยังซ่อนอยู่ (hidden และยังไม่ถึง) ห้ามเผยชื่อ ข้อ 29/61 · มีตัวเดียวก็ไม่ได้ ⇒ null ทั้งชุด
export function treeViewNeed(defs, id, done, reach) {
  const d = defs[id];
  const unmet = (d?.pre ?? []).filter((p) => defs[p] && done?.[p] === undefined);
  if (!unmet.length) return null;
  if (unmet.some((p) => defs[p].hidden && !reach(p))) return null;
  return { names: unmet.map((p) => defs[p].name), joint: d.and ? 'และ' : 'หรือ' };
}
export const treeViewNeedText = (need, tail) => `${tail === 'ก่อน' ? 'ต้องปลด' : 'ปลด'} ${need.names.map((n) => `"${n}"`).join(` ${need.joint} `)} ${tail === 'ก่อน' ? 'ก่อน' : 'แล้วจะเห็น'}`;

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
    const lp = L.labels[id];
    const label = hid ? '' : `<text class="tv-l"${lp.dx ? ` x="${tvR(lp.dx)}"` : ''} y="${tvR(lp.dy)}" text-anchor="${lp.anchor}">${tvEsc(d.name)}</text>`;
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
