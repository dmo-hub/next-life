// ภาพรวมบนหัวแท็บชั้นสมุด (B176): วาด canvas จากของที่ผู้เล่นสะสม ไม่ใช่ภาพวาดมือ · เปิดแท็บ = วาดใหม่
// แกนวาด (noise · แบ่งเขตจากจุดตั้ง · ไอคอน · ป้าย) ยกแบบย่อจากหน้าแผนที่ต้นแบบของเจ้าของ (maps/core.js) — ที่นั่นเป็น
// classic script ใช้ผ่าน window จึง import ไม่ได้ · build ต่อทุกไฟล์เป็น scope เดียว ชื่อระดับบนสุดจึงขึ้นต้น sa กันชน
import { ART_INK } from './art.mjs';

// ---- สุ่มคงที่: ตำแหน่ง/ลายมาจาก id ของข้อมูล เปิดซ้ำได้ภาพเดิม ของใหม่เพิ่มแล้วของเดิมไม่ขยับ ----
function saHash(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function saNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const s = (t) => t * t * (3 - 2 * t);
  const a = saHash(xi, yi), b = saHash(xi + 1, yi), c = saHash(xi, yi + 1), d = saHash(xi + 1, yi + 1);
  return a + (b - a) * s(xf) + (c - a) * s(yf) + (a - b - c + d) * s(xf) * s(yf);
}
const saFbm = (x, y) => 0.55 * saNoise(x, y) + 0.3 * saNoise(x * 2.1 + 5, y * 2.1 + 9) + 0.15 * saNoise(x * 4.3 + 11, y * 4.3 + 2);
const saStr = (s, k = 0) => {
  let x = 2166136261 ^ k;
  for (const c of s) x = Math.imul(x ^ c.codePointAt(0), 16777619);
  return saHash(x, k * 31 + 7);
};
const saRgb = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
const SA_FONT = (s, bold) => `${bold ? 'bold ' : ''}${s}px Sarabun, "Leelawadee UI", sans-serif`;
const SA_MUTED = '#8a7a5a';

// canvas กว้างเท่ากล่อง · วาดที่ความละเอียดจอ · คืน null เมื่อเบราว์เซอร์ไม่มี 2d (หน้ายังใช้รายการข้อความได้)
function saCanvas(host, H, label) {
  const cv = document.createElement('canvas');
  cv.className = 'shelf-art';
  cv.setAttribute('role', 'img');
  cv.setAttribute('aria-label', label);
  host.append(cv);
  const c = cv.getContext?.('2d');
  if (!c) return null;
  const W = Math.max(280, Math.round(cv.getBoundingClientRect().width || host.clientWidth || 340));
  const dpr = window.devicePixelRatio || 1;
  cv.width = W * dpr;
  cv.height = H * dpr;
  cv.style.height = `${H}px`;
  c.scale(dpr, dpr);
  return { cv, c, W, H };
}
function saBg(c, W, H, top = ART_INK.lacquer2, bot = ART_INK.lacquer) {
  const g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(1, bot);
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
}
// ของใหม่ที่ยังไม่เปิดดู = จุดเรือง ตรงกับป้าย "ใหม่" ในรายการ
function saGlow(c, x, y, r = 7) {
  const g = c.createRadialGradient(x, y, 0, x, y, r * 2.2);
  g.addColorStop(0, 'rgba(239,227,194,.95)');
  g.addColorStop(1, 'rgba(239,227,194,0)');
  c.fillStyle = g;
  c.beginPath();
  c.arc(x, y, r * 2.2, 0, Math.PI * 2);
  c.fill();
}
function saText(c, s, x, y, { size = 12, color = ART_INK.cream, align = 'left', bold = false } = {}) {
  c.font = SA_FONT(size, bold);
  c.fillStyle = color;
  c.textAlign = align;
  c.fillText(s, x, y);
}
function saNote(c, x, y, w, s) {
  c.fillStyle = 'rgba(23,17,13,.72)';
  c.fillRect(x - w / 2, y - 18, w, 28);
  saText(c, s, x, y + 1, { size: 13, align: 'center', color: ART_INK.gold2, bold: true });
}
// ป้ายชื่อมีขอบกระดาษ (แบบหมุดบนแผนที่ต้นแบบ)
function saLabel(c, s, x, y, size = 10) {
  c.save();
  c.font = SA_FONT(size, true);
  c.textAlign = 'center';
  c.lineWidth = 4;
  c.strokeStyle = 'rgba(245,236,210,.95)';
  c.lineJoin = 'round';
  c.strokeText(s, x, y);
  c.fillStyle = '#2e1e10';
  c.fillText(s, x, y);
  c.restore();
}
// ไอคอนวงกลม 2 แบบที่ใช้: เมือง (เศรษฐกิจ) · ซากตึก (ภัยพิบัติ)
function saIcon(c, kind, x, y) {
  c.save();
  c.translate(x, y);
  c.fillStyle = ART_INK.cream;
  c.strokeStyle = '#3b2a1a';
  c.lineWidth = 1.5;
  c.beginPath();
  c.arc(0, 0, 11, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.fillStyle = '#c8961e';
  if (kind === 'economy') {
    c.fillRect(-6, -2, 12, 7);
    for (const dx of [-6, -1, 4]) c.fillRect(dx, -6, 2.5, 4);
  } else {
    c.fillRect(-6, 0, 3, 5);
    c.fillRect(-1, -4, 3, 9);
    c.fillRect(4, 2, 3, 3);
  }
  c.restore();
}

// ---- อนุสรณ์: แผนที่ภาค ----
// รูปประเทศหยาบในกรอบ 64×100 · วาดใหญ่นอกจอครั้งเดียวต่อหน้า (noise ของเส้นแดนตั้งไว้ที่หลักร้อย px) แล้วย่อลง
const SA_THAI = [[10, 6], [20, 0], [32, 3], [38, 10], [46, 13], [56, 12], [63, 20], [64, 30], [58, 37], [50, 40], [50, 47], [46, 52], [40, 48], [36, 46], [34, 50], [35, 58], [37, 68], [40, 78], [44, 88], [46, 96], [42, 98], [36, 92], [32, 82], [30, 72], [30, 62], [30, 54], [28, 46], [24, 40], [18, 30], [14, 22], [8, 14]];
const SA_REGION = {
  เหนือ: { seeds: [[20, 14]], col: '#6f5a33', short: 'เหนือ' },
  ตะวันออกเฉียงเหนือ: { seeds: [[52, 24]], col: '#7d6436', short: 'อีสาน' },
  กลาง: { seeds: [[34, 32]], col: '#8a7240', short: 'กลาง' },
  ตะวันตก: { seeds: [[25, 40]], col: '#735e36', short: 'ตะวันตก' },
  'กรุงเทพฯ และปริมณฑล': { seeds: [[36, 44]], col: '#9a7d42', short: 'กรุงเทพฯ+' },
  ตะวันออก: { seeds: [[46, 46]], col: '#7a6538', short: 'ตะวันออก' },
  ใต้: { seeds: [[38, 80], [33, 62]], col: '#665330', short: 'ใต้' },
};
let saMapCache;
function saThaiMap() {
  if (saMapCache) return saMapCache;
  const S = 5, STEP = 4, MW = 64 * S + 20, MH = 100 * S + 20;
  const pts = SA_THAI.map(([x, y]) => [x * S + 10, y * S + 10]);
  const inside = (x, y) => {
    let o = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) o = !o;
    }
    return o;
  };
  const names = Object.keys(SA_REGION);
  const gw = Math.ceil(MW / STEP), gh = Math.ceil(MH / STEP);
  const grid = new Int16Array(gw * gh).fill(-1);
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
    const x = i * STEP + 1, y = j * STEP + 1;
    if (!inside(x, y)) continue;
    let best = -1, bd = Infinity;
    names.forEach((n, k) => {
      for (const [sx, sy] of SA_REGION[n].seeds) {
        const d = Math.hypot(x - (sx * S + 10), y - (sy * S + 10)) + 60 * (saFbm(x / 70 + k * 3.1, y / 70 + k * 1.7) - 0.5);
        if (d < bd) { bd = d; best = k; }
      }
    });
    grid[j * gw + i] = best;
  }
  const at = (i, j) => (i < 0 || j < 0 || i >= gw || j >= gh ? -1 : grid[j * gw + i]);
  const off = document.createElement('canvas');
  off.width = MW;
  off.height = MH;
  const b = off.getContext('2d');
  b.fillStyle = ART_INK.lacquer;
  b.fillRect(0, 0, MW, MH);
  const img = b.getImageData(0, 0, MW, MH);
  const px = img.data;
  const cols = names.map((n) => saRgb(SA_REGION[n].col));
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
    const v = at(Math.floor(x / STEP), Math.floor(y / STEP));
    const o = (y * MW + x) * 4;
    if (v < 0) { px[o + 3] = 0; continue; }
    const sh = 0.82 + 0.3 * saFbm(x / 40, y / 40);
    px[o] = cols[v][0] * sh; px[o + 1] = cols[v][1] * sh; px[o + 2] = cols[v][2] * sh; px[o + 3] = 255;
  }
  b.putImageData(img, 0, 0);
  // ชายฝั่งเส้นเข้ม · เส้นแดนภาคเส้นจาง
  b.lineCap = 'round';
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
    const v = at(i, j);
    if (v < 0) continue;
    const x = i * STEP, y = j * STEP;
    for (const [di, dj, x1, y1, x2, y2] of [[1, 0, STEP, 0, STEP, STEP], [0, 1, 0, STEP, STEP, STEP], [-1, 0, 0, 0, 0, STEP], [0, -1, 0, 0, STEP, 0]]) {
      const u = at(i + di, j + dj);
      if (u === v || (u >= 0 && (di < 0 || dj < 0))) continue;
      b.strokeStyle = u < 0 ? '#3b2a1a' : 'rgba(80,45,25,.55)';
      b.lineWidth = u < 0 ? 2.2 : 1.4;
      b.beginPath(); b.moveTo(x + x1, y + y1); b.lineTo(x + x2, y + y2); b.stroke();
    }
  }
  const cells = Object.fromEntries(names.map((n) => [n, []]));
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { const v = at(i, j); if (v >= 0) cells[names[v]].push([i * STEP + 2, j * STEP + 2]); }
  return (saMapCache = { off, MW, MH, cells });
}
// lives = แถวสมุดอนุสรณ์ {k "seed:gen", g, p จังหวัด, t ฉายาเด่น} · fresh = k ที่ยังไม่เปิดดู · regions = ภาค→จังหวัดของข้อมูลจุดเกิด
// ชีวิตที่ไม่มีจังหวัด (ต่างโลก) ปักเกาะลอยข้างแผนที่ (เจ้าของเคาะ)
export function shelfMemoArt(host, lives, fresh, regions) {
  const regionOf = (p) => { const name = (p ?? '').replace(/^จ\./, ''); return regions.find((r) => r.provinces.some((x) => x.name === name))?.name; };
  const fams = new Map();
  for (const l of lives) { const f = l.k.split(':')[0]; fams.set(f, [...(fams.get(f) ?? []), l]); }
  const gone = lives.filter((l) => !SA_REGION[regionOf(l.p)]);
  const cnt = Object.fromEntries(regions.map((r) => [r.name, lives.filter((l) => regionOf(l.p) === r.name).length]));
  const k = saCanvas(host, 200, lives.length ? `แผนที่ภาคที่เกิด ชีวิตที่จบแล้ว ${lives.length} ชีวิต ${fams.size} ตระกูล` : 'แผนที่ภาคที่เกิด ยังไม่มีชีวิตที่จบลงสมุด');
  if (!k) return null;
  const { c, W, H } = k;
  saBg(c, W, H);
  const M = saThaiMap();
  const sc = (H - 16) / M.MH, ox = 12, oy = 8, mw = M.MW * sc;
  c.drawImage(M.off, ox, oy, mw, M.MH * sc);
  const isle = [ox + mw + 38, 40];
  const at = (l) => {
    const r = regionOf(l.p);
    if (!SA_REGION[r]) return [isle[0] - 12 + saStr(l.k, 4) * 24, isle[1] - 6 + saStr(l.k, 5) * 12];
    const cs = M.cells[r];
    const [x, y] = cs[Math.floor(saStr(l.k, 6) * cs.length)];
    return [ox + x * sc, oy + y * sc];
  };
  if (gone.length) {
    c.fillStyle = '#3a2c1c';
    c.beginPath(); c.ellipse(isle[0], isle[1], 26, 14, 0, 0, Math.PI * 2); c.fill();
    saText(c, 'ต่างโลก', isle[0], isle[1] + 26, { size: 10, align: 'center', color: ART_INK.gold });
  }
  // เส้นทองต่อรุ่นในตระกูลเดียวกัน
  c.strokeStyle = 'rgba(217,180,90,.55)';
  c.lineWidth = 1.2;
  for (const xs of fams.values()) {
    c.beginPath();
    [...xs].sort((a, b) => a.g - b.g).forEach((l, i) => { const [x, y] = at(l); if (i) c.lineTo(x, y); else c.moveTo(x, y); });
    c.stroke();
  }
  for (const l of lives) {
    const [x, y] = at(l);
    if (fresh.includes(l.k)) saGlow(c, x, y, 5);
    c.fillStyle = l.t ? ART_INK.gold2 : ART_INK.cream;
    c.strokeStyle = ART_INK.lacquer;
    c.lineWidth = 1;
    c.beginPath(); c.arc(x, y, 3.4, 0, Math.PI * 2); c.fill(); c.stroke();
  }
  // ขวา: นับต่อภาค · จอแคบหัวแยก 2 บรรทัดและใช้ชื่อย่อ ไม่งั้นล้นขอบ
  const lx = ox + mw + (gone.length ? 80 : 24);
  const narrow = W - lx < 170, top = narrow ? 14 : 0, rowH = narrow ? 17 : 19;
  if (narrow) {
    saText(c, `ชีวิตที่จบแล้ว ${lives.length}`, lx, 20, { size: 12, color: ART_INK.gold2, bold: true });
    saText(c, `${fams.size} ตระกูล`, lx, 34, { size: 12, color: ART_INK.gold2, bold: true });
  } else saText(c, `ชีวิตที่จบแล้ว ${lives.length} · ${fams.size} ตระกูล`, lx, 24, { size: 13, color: ART_INK.gold2, bold: true });
  regions.forEach((r, i) => {
    c.fillStyle = SA_REGION[r.name]?.col ?? SA_MUTED;
    c.fillRect(lx, top + 38 + i * rowH, 10, 10);
    saText(c, `${narrow ? SA_REGION[r.name]?.short ?? r.name : r.name} ${cnt[r.name]}`, lx + 16, top + 47 + i * rowH, { size: 11, color: cnt[r.name] ? ART_INK.cream : SA_MUTED });
  });
  if (gone.length) saText(c, `ต่างโลก ${gone.length}`, lx + 16, top + 47 + regions.length * rowH, { size: 11 });
  // ว่าง: ป้ายวางบนแผนที่ ไม่ทับรายการภาค
  if (!lives.length) saNote(c, ox + mw / 2 + 6, H / 2, Math.min(mw + 40, 170), 'ยังไม่มีชีวิตจบ');
  k.cv.dataset.count = JSON.stringify({ lives: lives.length, fams: fams.size, gone: gone.length, byRegion: cnt });
  return k.cv;
}

// ---- ฉายา: ชั้นหนังสือ ----
// shelves = [{label, groups: [{key, name, items [{id}], got [id], gold2?}]}] ชั้นละแถว · กลุ่มในชั้นเดียวคั่นด้วยที่กั้น
// fresh = "กลุ่ม:id" ที่ยังไม่เปิดดู
export function shelfTitleArt(host, shelves, fresh, got, all) {
  const k = saCanvas(host, 200, `ชั้นหนังสือฉายา เปิดแล้ว ${got} จาก ${all}`);
  if (!k) return null;
  const { c, W, H } = k;
  saBg(c, W, H, '#2a1d12', '#1a130d');
  saText(c, `ฉายาที่เปิดแล้ว ${got}/${all}`, 8, 20, { size: 13, color: ART_INK.gold2, bold: true });
  const top = 30, sh = (H - top - 6) / shelves.length;
  const counts = [];
  shelves.forEach((row, r) => {
    const base = top + sh * (r + 1) - 6;
    const n = row.groups.reduce((s, g) => s + g.items.length, 0);
    const sw = Math.min(16, (W - 100) / (n + row.groups.length - 1));
    let x = 96;
    let lit = 0;
    saText(c, row.label, 8, base - sh / 2 + 6, { size: 11, color: ART_INK.gold });
    row.groups.forEach((g, gi) => {
      if (gi) { c.fillStyle = ART_INK.bronze2; c.fillRect(x + sw * 0.4, base - sh + 14, 2, sh - 14); x += sw; }
      for (const it of g.items) {
        const on = g.got.includes(it.id);
        const hh = (sh - 16) * (0.7 + 0.3 * saStr(it.id, 2));
        if (on) lit++;
        if (fresh.includes(`${g.key}:${it.id}`)) saGlow(c, x + sw / 2, base - hh / 2, 6);
        c.fillStyle = on ? (g.gold2 ? ART_INK.gold2 : ART_INK.gold) : '#2e2216';
        c.strokeStyle = on ? '#5a4322' : '#4a3a26';
        c.lineWidth = 1;
        c.fillRect(x + 1, base - hh, sw - 2, hh);
        c.strokeRect(x + 1, base - hh, sw - 2, hh);
        if (on) { c.fillStyle = ART_INK.lacquer2; c.fillRect(x + 2, base - hh + 4, sw - 4, 1.5); c.fillRect(x + 2, base - 6, sw - 4, 1.5); }
        x += sw;
      }
    });
    c.fillStyle = '#5a4322';
    c.fillRect(90, base, W - 96, 4);
    saText(c, `${lit}/${n}`, 8, base - sh / 2 + 20, { size: 10, color: SA_MUTED });
    counts.push(lit);
  });
  k.cv.dataset.count = JSON.stringify({ got, all, shelves: counts });
  return k.cv;
}

// ---- ภาพบ้านเมือง: แม่น้ำเวลา ----
// events = [{id, name, kind, from, to, n ภาพที่ได้, all ภาพทั้งหมด, met ได้ภาพหลักแล้ว, fresh}]
export function shelfPicArt(host, events, got, all) {
  const k = saCanvas(host, 200, `แม่น้ำเวลาเหตุการณ์บ้านเมือง ได้ภาพแล้ว ${got} จาก ${all}`);
  if (!k) return null;
  const { c, W, H } = k;
  saBg(c, W, H, '#2a2014', '#1a130d');
  saText(c, `ภาพบ้านเมืองที่ได้ ${got}/${all}`, 8, 20, { size: 13, color: ART_INK.gold2, bold: true });
  const y0 = Math.floor((Math.min(...events.map((e) => e.from)) - 2) / 10) * 10;
  const y1 = Math.ceil((Math.max(...events.map((e) => e.to)) + 4) / 10) * 10;
  const X = (y) => 20 + ((y - y0) / (y1 - y0)) * (W - 40);
  const RY = (x) => H * 0.56 + Math.sin(x / 55) * 14 + (saFbm(x / 80, 3) - 0.5) * 18;
  c.strokeStyle = '#3d5560';
  c.lineWidth = 9;
  c.lineCap = 'round';
  c.beginPath();
  for (let x = 10; x <= W - 10; x += 4) { if (x === 10) c.moveTo(x, RY(x)); else c.lineTo(x, RY(x)); }
  c.stroke();
  c.strokeStyle = 'rgba(150,200,210,.35)';
  c.lineWidth = 2;
  c.stroke();
  for (let y = y0; y <= y1; y += 10) saText(c, `${y}`, X(y), H - 6, { size: 10, align: 'center', color: SA_MUTED });
  // จอแคบซ่อนชื่อเหตุการณ์ (เหลือไอคอน + ช่องภาพ) ไม่งั้นป้ายทับกัน
  const named = W > 500;
  events.forEach((ev, i) => {
    const x = X(ev.from), up = i % 2 === 0, y = RY(x) + (up ? -34 : 34);
    c.strokeStyle = 'rgba(138,109,59,.7)';
    c.lineWidth = 1;
    c.beginPath(); c.moveTo(x, RY(x)); c.lineTo(x, y); c.stroke();
    if (ev.fresh) saGlow(c, x, y, 9);
    if (ev.met) saIcon(c, ev.kind, x, y);
    else {
      c.fillStyle = '#3a2c1c';
      c.strokeStyle = ART_INK.bronze2;
      c.beginPath(); c.arc(x, y, 11, 0, Math.PI * 2); c.fill(); c.stroke();
      saText(c, '?', x, y + 4, { size: 12, align: 'center', color: ART_INK.bronze2, bold: true });
    }
    for (let s = 0; s < ev.all; s++) {
      c.fillStyle = s < ev.n ? ART_INK.gold2 : '#4a3a26';
      c.fillRect(x - ev.all * 3 + s * 6, y + (up ? -20 : 15), 4, 4);
    }
    if (ev.met && named) saLabel(c, ev.name.length > 14 ? `${ev.name.slice(0, 13)}…` : ev.name, x, y + (up ? -26 : 32));
  });
  k.cv.dataset.count = JSON.stringify({ got, all, met: events.filter((e) => e.met).length, events: events.length });
  return k.cv;
}

// ---- ผังตระกูล: วงต่อรุ่นเรียงซ้าย→ขวา จบที่ "คุณ" · ชาติต่างโลกลอยแถวบน ----
// rows = แถว lineage ที่จะโชว์ (เรียงรุ่น) · more = รุ่นที่ย่อไว้ก่อนหน้า · now = ฐานะตอนนี้ของผู้เล่น · classes = ลำดับฐานะต่ำ→สูง
// prev = ชาติไทยล่าสุดของทั้งผัง — แถวที่โชว์อาจเป็นต่างโลกล้วน แต่ทางที่มา/ทิศฐานะยังเทียบกับชาติไทย
const SA_PATH = { child: 'กลับมาเป็นลูกหลาน', isekai: 'กลับจากต่างโลก' };
const SA_REALM_COL = { นรก: '#b0412e', เปรต: '#8a5a8a', ดิรัจฉาน: '#6f7d3a', มนุษย์: '#c9b27a', เทวดา: '#f0d78c', ต่างโลก: '#7aa2c8' };
const saMix = (a, b, t) => `rgb(${saRgb(a).map((v, i) => Math.round(v + (saRgb(b)[i] - v) * t)).join(',')})`;
export function shelfLineageArt(host, rows, more, now, classes, youWord = 'คุณ', prev = rows.findLast((l) => !l.isekai)) {
  const home = rows.filter((l) => !l.isekai), away = rows.filter((l) => l.isekai);
  const k = saCanvas(host, 160, `ผังตระกูล ${rows.length + more} รุ่นก่อนถึง${youWord}${away.length ? ` มีชาติต่างโลก ${away.length} ชาติ` : ''}`);
  if (!k) return null;
  const { c, W, H } = k;
  saBg(c, W, H);
  const clsCol = (cls) => saMix('#5a4322', ART_INK.gold2, Math.max(0, classes.indexOf(cls)) / (classes.length - 1));
  const left = more ? 44 : 24, slots = rows.length + 1;
  const gap = Math.min(96, (W - left - 26) / Math.max(1, slots - 1));
  const yHome = H * 0.5, yAway = H * 0.2, r = Math.min(13, gap * 0.32);
  // หลายรุ่นบนจอแคบ: ตัดป้ายรองที่จะทับกัน (อายุ/ภูมิยังมีในข้อความใต้ภาพ) เหลือเลขรุ่น + จุดสีภูมิ
  const dense = gap < 52, named = gap >= 60;
  const pts = rows.map((l, i) => [left + i * gap, l.isekai ? yAway : yHome]);
  const you = [left + rows.length * gap, yHome];
  if (more) saText(c, `…${more}`, 8, yHome + 4, { size: 11, color: SA_MUTED, bold: true });
  // เส้นต่อรุ่น: ทองทึบระหว่างชาติไทย · ประเส้นเมื่อแตะชาติต่างโลก
  const seq = [...pts, you];
  for (let i = 1; i < seq.length; i++) {
    const dashed = rows[i - 1]?.isekai || rows[i]?.isekai;
    c.setLineDash(dashed ? [4, 4] : []);
    c.strokeStyle = dashed ? 'rgba(122,162,200,.7)' : 'rgba(217,180,90,.7)';
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(...seq[i - 1]); c.lineTo(...seq[i]); c.stroke();
  }
  c.setLineDash([]);
  rows.forEach((l, i) => {
    const [x, y] = pts[i];
    c.fillStyle = l.isekai ? '#2c3e52' : clsCol(l.cls);
    c.strokeStyle = l.isekai ? '#7aa2c8' : ART_INK.lacquer;
    c.lineWidth = 1.5;
    c.setLineDash(l.gone ? [3, 2] : []);
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.stroke();
    c.setLineDash([]);
    if (l.broke) { c.strokeStyle = '#d0533c'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - r * 0.7, y + r * 0.7); c.lineTo(x + r * 0.7, y - r * 0.7); c.stroke(); }
    saText(c, `${l.gen}`, x, y + 4, { size: 11, align: 'center', color: l.isekai ? '#cfe0f0' : ART_INK.lacquer, bold: true });
    if (l.isekai) { if (named) saText(c, (l.world ?? '').slice(0, 8), x, y - r - 4, { size: 9, align: 'center', color: '#a9c4dc' }); }
    else if (dense) {
      saText(c, `${l.age}`, x, y + r + 12, { size: 9, align: 'center' });
      c.fillStyle = SA_REALM_COL[l.realm] ?? SA_MUTED;
      c.beginPath(); c.arc(x, y + r + 20, 3, 0, Math.PI * 2); c.fill();
    } else {
      saText(c, `${l.gone ? 'หาย' : 'อายุ'} ${l.age}`, x, y + r + 13, { size: 10, align: 'center' });
      c.fillStyle = SA_REALM_COL[l.realm] ?? SA_MUTED;
      c.beginPath(); c.arc(x - 12, y + r + 24, 3, 0, Math.PI * 2); c.fill();
      saText(c, l.realm ?? '', x - 6, y + r + 27, { size: 9, color: SA_REALM_COL[l.realm] ?? SA_MUTED });
    }
  });
  // ปลายแถว (คุณ · รุ่นถัดไป): ฐานะ + ทิศเทียบชาติไทยก่อนหน้า + ทางที่มา
  c.fillStyle = clsCol(now);
  c.strokeStyle = ART_INK.cream;
  c.lineWidth = 2;
  c.beginPath(); c.arc(you[0], you[1], r + 2, 0, Math.PI * 2); c.fill(); c.stroke();
  // คำยาวกว่า "คุณ" ไม่พอในวง — ย้ายลงใต้วง
  const inside = youWord.length <= 3;
  saText(c, inside ? youWord : '★', you[0], you[1] + 4, { size: 10, align: 'center', color: ART_INK.lacquer, bold: true });
  if (!inside) saText(c, youWord, Math.min(W - 6, you[0] + 20), you[1] + r + 15, { size: 10, align: 'right', color: ART_INK.cream, bold: true });
  const d = prev ? classes.indexOf(now) - classes.indexOf(prev.cls) : 0;
  if (d) saText(c, `ฐานะ ${d > 0 ? '↑' : '↓'}`, Math.min(W - 6, you[0] + 20), you[1] - r - 6, { size: 10, align: 'right', color: d > 0 ? ART_INK.gold2 : '#d0533c', bold: true });
  if (prev) {
    const via = rows.at(-1)?.isekai ? SA_PATH.isekai : SA_PATH[prev.path] ?? 'เกิดใหม่ตามกรรม';
    saText(c, via, Math.min(W - 6, you[0] + r + 4), H - 8, { size: 10, align: 'right', color: ART_INK.gold });
  }
  k.cv.dataset.count = JSON.stringify({ home: home.length, away: away.length, more, slots });
  return k.cv;
}
