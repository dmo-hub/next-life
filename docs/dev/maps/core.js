// ส่วนกลางของหน้าแผนที่/แผนผังในห้องผู้พัฒนา — canvas ล้วน ไม่มีไลบรารี
// โหลดแบบ <script src> ธรรมดา (ES module โหลดจาก file:// ไม่ได้) แล้วใช้ผ่าน window.MapCore
(function () {
  // ---- สุ่มแบบกำหนดได้ + noise ----
  function hash(x, y) {
    let h = (x * 374761393 + y * 668265263) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function noise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const s = (t) => t * t * (3 - 2 * t);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * s(xf) + (c - a) * s(yf) + (a - b - c + d) * s(xf) * s(yf);
  }
  const fbm = (x, y) => 0.55 * noise(x, y) + 0.3 * noise(x * 2.1 + 5, y * 2.1 + 9) + 0.15 * noise(x * 4.3 + 11, y * 4.3 + 2);
  const rnd = (a, b) => hash(Math.floor(a * 13.7), Math.floor(b * 7.3));
  const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
  const pairKey = (a, b) => [a, b].sort().join('|');

  // ---- แบ่งเขตจากจุดตั้ง: ช่องกริดเป็นของเขตที่จุดตั้งใกล้สุด (บวก noise ให้เส้นแดนคด) ----
  // allow(x, y, name) = เขตนี้ลงช่องนี้ได้มั้ย (เช่น เกาะแยกจากแผ่นดินใหญ่)
  function buildGrid({ w, h, step, seeds, isLand, allow }) {
    const gw = Math.ceil(w / step), gh = Math.ceil(h / step);
    const names = Object.keys(seeds);
    const grid = new Int16Array(gw * gh).fill(-1);
    for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
      const x = i * step + 1, y = j * step + 1;
      if (!isLand(x, y)) continue;
      let best = -1, bd = Infinity;
      names.forEach((n, k) => {
        if (allow && !allow(x, y, n)) return;
        for (const [sx, sy] of seeds[n]) {
          const d = Math.hypot(x - sx, y - sy) + 60 * (fbm(x / 70 + k * 3.1, y / 70 + k * 1.7) - 0.5);
          if (d < bd) { bd = d; best = k; }
        }
      });
      grid[j * gw + i] = best;
    }
    const at = (i, j) => (i < 0 || j < 0 || i >= gw || j >= gh ? -1 : grid[j * gw + i]);
    return { grid, gw, gh, names, step, w, h, at };
  }
  // จุดกลางช่องของแต่ละเขต + จุดบนเส้นแดนที่ isOpen(a, b) บอกว่าไม่มีทาง (ไว้วาดแนวเขากั้น)
  function regions(G, isOpen) {
    const cells = Object.fromEntries(G.names.map((n) => [n, []]));
    const ridge = [];
    for (let j = 0; j < G.gh; j++) for (let i = 0; i < G.gw; i++) {
      const v = G.at(i, j);
      if (v < 0) continue;
      cells[G.names[v]].push([i * G.step + 1, j * G.step + 1]);
      if (!isOpen) continue;
      for (const [di, dj] of [[1, 0], [0, 1]]) {
        const u = G.at(i + di, j + dj);
        if (u >= 0 && u !== v && !isOpen(G.names[v], G.names[u])) ridge.push([i * G.step + 1, j * G.step + 1]);
      }
    }
    return { cells, ridge };
  }

  // ---- พื้น: ทะเลไล่สี + น้ำตื้นรอบฝั่ง + คลื่น + สีแผ่นดินต่อเขต ----
  function paintLand(b, G, landColor, sea = {}) {
    const { w: W, h: H, step: STEP, at } = G;
    // shore = สีที่ผสม 30% ลงขอบรอบแผ่นดิน · waves = ลายคลื่น (ปิดได้สำหรับพื้นที่ไม่ใช่ทะเล เช่น หินในถ้ำ)
    const { cx = W / 2, cy = H / 2, r0 = 200, r1 = 900, inner = '#5f97b3', outer = '#2f5d7c', shore = [150, 200, 210], waves = true } = sea;
    const g = b.createRadialGradient(cx, cy, r0, cx, cy, r1);
    g.addColorStop(0, inner); g.addColorStop(1, outer);
    b.fillStyle = g; b.fillRect(0, 0, W, H);
    const img = b.getImageData(0, 0, W, H);
    const px = img.data;
    const cols = G.names.map((n) => hex(landColor(n)));
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = Math.floor(x / STEP), j = Math.floor(y / STEP);
      const v = at(i, j);
      const o = (y * W + x) * 4;
      if (v < 0) {
        let near = 0;
        for (const [di, dj] of [[3, 0], [-3, 0], [0, 3], [0, -3], [5, 5], [-5, -5], [5, -5], [-5, 5]]) if (at(i + di, j + dj) >= 0) near++;
        if (near) { px[o] = px[o] * 0.7 + shore[0] * 0.3; px[o + 1] = px[o + 1] * 0.7 + shore[1] * 0.3; px[o + 2] = px[o + 2] * 0.7 + shore[2] * 0.3; }
        if (waves && Math.sin(y * 0.18 + fbm(x / 60, y / 60) * 12) > 0.97) { px[o] += 18; px[o + 1] += 22; px[o + 2] += 22; }
        continue;
      }
      const [r, gg, bb] = cols[v];
      const sh = 0.82 + 0.3 * fbm(x / 40, y / 40);
      px[o] = r * sh; px[o + 1] = gg * sh; px[o + 2] = bb * sh; px[o + 3] = 255;
    }
    b.putImageData(img, 0, 0);
  }
  // ชายฝั่ง (เส้นเข้ม) + เส้นแดนระหว่างเขต (เส้นจาง)
  function drawBorders(b, G) {
    const { step: STEP, at } = G;
    b.lineCap = 'round';
    for (let j = 0; j < G.gh; j++) for (let i = 0; i < G.gw; i++) {
      const v = at(i, j);
      if (v < 0) continue;
      const x = i * STEP, y = j * STEP;
      for (const [di, dj, x1, y1, x2, y2] of [[1, 0, STEP, 0, STEP, STEP], [0, 1, 0, STEP, STEP, STEP], [-1, 0, 0, 0, 0, STEP], [0, -1, 0, 0, STEP, 0]]) {
        const u = at(i + di, j + dj);
        if (u === v) continue;
        if (u < 0) { b.strokeStyle = '#3b2a1a'; b.lineWidth = 2.2; }
        else if (di < 0 || dj < 0) continue;
        else { b.strokeStyle = 'rgba(80,45,25,.55)'; b.lineWidth = 1.4; }
        b.beginPath(); b.moveTo(x + x1, y + y1); b.lineTo(x + x2, y + y2); b.stroke();
      }
    }
  }
  // ขอบกระดาษเข้มรอบนอก
  function vignette(b, W, H) {
    const vg = b.createRadialGradient(W / 2, H / 2, 380, W / 2, H / 2, 780);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(40,25,10,.45)');
    b.fillStyle = vg; b.fillRect(0, 0, W, H);
  }

  // ---- สัญลักษณ์ภูมิประเทศ ----
  function mountain(b, x, y, s, col, snow) {
    b.beginPath(); b.moveTo(x - s, y + s * 0.6); b.lineTo(x, y - s); b.lineTo(x + s, y + s * 0.6); b.closePath();
    b.fillStyle = col; b.fill();
    b.beginPath(); b.moveTo(x, y - s); b.lineTo(x + s, y + s * 0.6); b.lineTo(x + s * 0.2, y + s * 0.6); b.closePath();
    b.fillStyle = 'rgba(0,0,0,.25)'; b.fill();
    if (snow) { b.beginPath(); b.moveTo(x - s * 0.35, y - s * 0.3); b.lineTo(x, y - s); b.lineTo(x + s * 0.35, y - s * 0.3); b.closePath(); b.fillStyle = '#fff'; b.fill(); }
    b.strokeStyle = 'rgba(40,30,20,.6)'; b.lineWidth = 1;
    b.beginPath(); b.moveTo(x - s, y + s * 0.6); b.lineTo(x, y - s); b.lineTo(x + s, y + s * 0.6); b.stroke();
  }
  function tree(b, x, y, s, col) {
    b.fillStyle = '#4a3523'; b.fillRect(x - 1, y, 2, s * 0.6);
    b.beginPath(); b.arc(x, y - s * 0.2, s * 0.7, 0, Math.PI * 2); b.fillStyle = col; b.fill();
    b.beginPath(); b.arc(x - s * 0.2, y - s * 0.4, s * 0.3, 0, Math.PI * 2); b.fillStyle = 'rgba(255,255,255,.15)'; b.fill();
  }
  // โรยสัญลักษณ์ตามชนิดพื้นที่ · เว้นรัศมี 34 รอบจุดเมือง
  function decorate(b, pts, towns, kind) {
    if (!kind) return;
    const clear = ([x, y]) => towns.every(([tx, ty]) => Math.hypot(x - tx, y - ty) > 34);
    const pick = (every) => pts.filter(([x, y]) => clear([x, y]) && rnd(x, y) < 1 / every);
    if (kind === 'mountain') pick(28).forEach(([x, y]) => mountain(b, x, y, 9, '#8d8273', false));
    if (kind === 'peak') pick(22).forEach(([x, y]) => mountain(b, x, y, 12, '#9c9182', true));
    if (kind === 'snow') pick(45).forEach(([x, y]) => (rnd(y, x) < 0.5 ? mountain(b, x, y, 8, '#c9d3d9', true) : tree(b, x, y, 5, '#3f6a5a')));
    if (kind === 'forest') pick(14).forEach(([x, y]) => tree(b, x, y, 6, '#2f6a35'));
    if (kind === 'darkforest') pick(11).forEach(([x, y]) => tree(b, x, y, 6, '#1f4425'));
    if (kind === 'poison') pick(16).forEach(([x, y]) => (rnd(y, x) < 0.4 ? mountain(b, x, y, 9, '#4d4458', false) : tree(b, x, y, 5, '#47355a')));
    if (kind === 'dune') pick(30).forEach(([x, y]) => { b.strokeStyle = 'rgba(140,80,30,.6)'; b.lineWidth = 1.5; b.beginPath(); b.arc(x, y + 6, 9, Math.PI * 1.15, Math.PI * 1.85); b.stroke(); });
    if (kind === 'ash') pick(30).forEach(([x, y]) => { b.strokeStyle = '#3a2f2c'; b.lineWidth = 1.5; b.beginPath(); b.moveTo(x, y + 6); b.lineTo(x, y - 5); b.moveTo(x, y - 1); b.lineTo(x + 4, y - 5); b.moveTo(x, y + 1); b.lineTo(x - 4, y - 3); b.stroke(); });
    if (kind === 'grass') pick(30).forEach(([x, y]) => { b.strokeStyle = 'rgba(70,100,30,.7)'; b.lineWidth = 1; b.beginPath(); for (const k of [-3, 0, 3]) { b.moveTo(x + k, y + 3); b.lineTo(x + k * 1.5, y - 4); } b.stroke(); });
    if (kind === 'marsh') pick(24).forEach(([x, y]) => { b.fillStyle = 'rgba(60,110,130,.55)'; b.beginPath(); b.ellipse(x, y + 3, 7, 2.5, 0, 0, Math.PI * 2); b.fill(); b.strokeStyle = '#4c6a32'; b.beginPath(); b.moveTo(x - 2, y + 2); b.lineTo(x - 3, y - 4); b.moveTo(x + 2, y + 2); b.lineTo(x + 3, y - 4); b.stroke(); });
    if (kind === 'hill') pick(32).forEach(([x, y]) => { b.strokeStyle = 'rgba(70,55,35,.7)'; b.lineWidth = 1.5; b.beginPath(); b.arc(x, y + 5, 8, Math.PI * 1.1, Math.PI * 1.9); b.stroke(); });
    if (kind === 'flame') pick(20).forEach(([x, y]) => { b.fillStyle = 'rgba(230,110,30,.75)'; b.beginPath(); b.moveTo(x - 5, y + 5); b.quadraticCurveTo(x - 6, y - 3, x, y - 9); b.quadraticCurveTo(x + 6, y - 3, x + 5, y + 5); b.closePath(); b.fill(); b.fillStyle = 'rgba(255,210,80,.8)'; b.beginPath(); b.moveTo(x - 2, y + 5); b.quadraticCurveTo(x - 2, y, x, y - 3); b.quadraticCurveTo(x + 2, y, x + 2, y + 5); b.closePath(); b.fill(); });
    if (kind === 'cloud') pick(26).forEach(([x, y]) => { b.fillStyle = 'rgba(255,255,255,.55)'; for (const [dx, dy, r] of [[0, 0, 7], [6, 1, 5], [-6, 1.5, 5]]) { b.beginPath(); b.arc(x + dx, y + dy, r, 0, Math.PI * 2); b.fill(); } });
    if (kind === 'paddy') pick(26).forEach(([x, y]) => { b.strokeStyle = 'rgba(60,120,40,.6)'; b.lineWidth = 1; b.strokeRect(x - 5, y - 3, 10, 6); b.beginPath(); b.moveTo(x, y - 3); b.lineTo(x, y + 3); b.stroke(); });
  }

  // ---- เครื่องประดับแผนที่ ----
  function compass(b, x, y) {
    b.save(); b.translate(x, y);
    b.fillStyle = 'rgba(239,227,194,.9)'; b.beginPath(); b.arc(0, 0, 30, 0, Math.PI * 2); b.fill();
    b.strokeStyle = '#3b2a1a'; b.lineWidth = 1.5; b.stroke();
    for (let k = 0; k < 4; k++) { b.rotate(Math.PI / 2); b.beginPath(); b.moveTo(0, -26); b.lineTo(6, 0); b.lineTo(-6, 0); b.closePath(); b.fillStyle = k === 3 ? '#8a3b12' : '#3b2a1a'; b.fill(); }
    b.restore();
    b.fillStyle = '#3b2a1a'; b.font = 'bold 13px Sarabun, sans-serif'; b.textAlign = 'center'; b.fillText('เหนือ', x, y - 34);
  }
  // กรอบชื่อแผนที่มุมซ้ายบน
  function cartouche(b, title, sub, { x = 20, y = 18, w = 300 } = {}) {
    b.save();
    b.fillStyle = 'rgba(239,227,194,.92)'; b.strokeStyle = '#3b2a1a'; b.lineWidth = 2;
    b.beginPath(); b.roundRect(x, y, w, 58, 8); b.fill(); b.stroke();
    b.fillStyle = '#3b2a1a'; b.textAlign = 'left';
    b.font = 'bold 24px Sarabun, "Leelawadee UI", serif'; b.fillText(title, x + 14, y + 29);
    b.font = '13px Sarabun, sans-serif'; b.fillText(sub, x + 14, y + 48);
    b.restore();
  }

  // ---- ชุดไอคอนในวงกลมกระดาษ (r 11) ----
  // ICONS = ชื่อที่วาดได้ · ชื่ออื่นตกไปเป็นเต็นท์สามเหลี่ยม
  const ICONS = ['castle', 'city', 'temple', 'church', 'tower', 'port', 'ruin', 'cave', 'mine', 'skull', 'dragon', 'flag', 'tent', 'tree', 'chest', 'trap', 'claw', 'door', 'camp'];
  function icon(ctx, t, x, y, { gold = false } = {}) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = '#efe3c2'; ctx.strokeStyle = '#3b2a1a'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = gold ? '#c8961e' : '#3b2a1a';
    if (t === 'castle' || t === 'city') { ctx.fillRect(-6, -2, 12, 7); for (const dx of [-6, -1, 4]) ctx.fillRect(dx, -6, 2.5, 4); if (t === 'castle') ctx.fillRect(-1, -9, 2, 4); }
    else if (t === 'temple') { ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(4, 0); ctx.lineTo(7, 0); ctx.lineTo(7, 5); ctx.lineTo(-7, 5); ctx.lineTo(-7, 0); ctx.lineTo(-4, 0); ctx.closePath(); ctx.fill(); }
    else if (t === 'church') { ctx.fillRect(-4, -2, 8, 7); ctx.fillRect(-1, -9, 2, 7); ctx.fillRect(-3, -7, 6, 2); }
    else if (t === 'tower') { ctx.fillRect(-3, -6, 6, 11); ctx.beginPath(); ctx.moveTo(-5, -6); ctx.lineTo(0, -11); ctx.lineTo(5, -6); ctx.fill(); }
    else if (t === 'port') { ctx.lineWidth = 2; ctx.strokeStyle = ctx.fillStyle; ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(0, 6); ctx.moveTo(-4, -4); ctx.lineTo(4, -4); ctx.arc(0, 1, 6, 0.2, Math.PI - 0.2); ctx.stroke(); }
    else if (t === 'ruin') { ctx.fillRect(-6, 0, 3, 5); ctx.fillRect(-1, -4, 3, 9); ctx.fillRect(4, 2, 3, 3); }
    else if (t === 'cave') { ctx.beginPath(); ctx.arc(0, 4, 7, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#efe3c2'; ctx.beginPath(); ctx.arc(0, 4, 3.5, Math.PI, 0); ctx.fill(); }
    else if (t === 'mine') { ctx.lineWidth = 2; ctx.strokeStyle = ctx.fillStyle; ctx.beginPath(); ctx.moveTo(-6, 6); ctx.lineTo(6, -6); ctx.moveTo(6, 6); ctx.lineTo(-6, -6); ctx.stroke(); }
    else if (t === 'skull') { ctx.beginPath(); ctx.arc(0, -1, 6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#efe3c2'; ctx.fillRect(-3.5, -2, 2.5, 2.5); ctx.fillRect(1, -2, 2.5, 2.5); }
    else if (t === 'dragon') { ctx.beginPath(); ctx.moveTo(-8, 4); ctx.quadraticCurveTo(0, -12, 8, 4); ctx.quadraticCurveTo(0, -2, -8, 4); ctx.fill(); }
    else if (t === 'flag') { ctx.fillRect(-4, -8, 2, 15); ctx.fillRect(-2, -8, 8, 6); }
    else if (t === 'tent') { ctx.beginPath(); ctx.moveTo(-7, 6); ctx.lineTo(0, -7); ctx.lineTo(7, 6); ctx.fill(); }
    else if (t === 'tree') { ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(6, 4); ctx.lineTo(-6, 4); ctx.fill(); ctx.fillRect(-1, 4, 2, 3); }
    else if (t === 'chest') { ctx.fillRect(-7, -2, 14, 8); ctx.beginPath(); ctx.ellipse(0, -2, 7, 5, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#efe3c2'; ctx.fillRect(-7, -2.5, 14, 1.5); ctx.fillRect(-1.5, -1, 3, 3); }
    else if (t === 'trap') { ctx.beginPath(); for (const dx of [-6, -2, 2]) { ctx.moveTo(dx, 6); ctx.lineTo(dx + 2, -7); ctx.lineTo(dx + 4, 6); } ctx.fill(); ctx.fillRect(-7, 5, 14, 2); }
    else if (t === 'claw') { ctx.lineWidth = 2.2; ctx.strokeStyle = ctx.fillStyle; ctx.beginPath(); for (const dx of [-5, 0, 5]) { ctx.moveTo(dx - 2, -7); ctx.quadraticCurveTo(dx + 3, -1, dx - 1, 7); } ctx.stroke(); }
    else if (t === 'door') { ctx.beginPath(); ctx.moveTo(-6, 7); ctx.lineTo(-6, -2); ctx.arc(0, -2, 6, Math.PI, 0); ctx.lineTo(6, 7); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#efe3c2'; ctx.fillRect(2, 1, 2, 2); }
    else { ctx.beginPath(); ctx.moveTo(-6, 5); ctx.lineTo(0, -5); ctx.lineTo(6, 5); ctx.fill(); }
    ctx.restore();
  }
  // ป้ายชื่อมีขอบกระดาษ · จุดยึด = กึ่งกลางเส้นฐานตัวอักษร
  function label(ctx, text, x, y, { italic = false, color = '#2e1e10', size = 15 } = {}) {
    ctx.save();
    ctx.font = `${italic ? 'italic ' : ''}bold ${size}px Sarabun, "Leelawadee UI", sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(245,236,210,.95)'; ctx.lineJoin = 'round';
    ctx.strokeText(text, x, y); ctx.fillStyle = color; ctx.fillText(text, x, y);
    ctx.restore();
  }
  // หมุด "อยู่ที่" — ปลายแหลมชี้ที่ (x, y - 14)
  function pin(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = '#d62f12'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.arc(x, y - 28, 10, Math.PI * 0.75, Math.PI * 2.25); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y - 28, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // วงกลมสถานะเล็ก (ปักดันเจียน · ติ๊กหลักไมล์) มีอักษรกลางวง
  function badge(ctx, x, y, glyph, fill, r = 10) {
    ctx.save();
    ctx.fillStyle = fill; ctx.strokeStyle = '#f5ecd2'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px Sarabun, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(glyph, x, y + 1);
    ctx.restore();
  }

  // ---- ปักหมุด/สถานะเก็บ localStorage ----
  // อ่านค่าเดิมที่เก็บเป็นสตริงดิบ (ก่อนมี core) ได้ด้วย: JSON ไม่ผ่าน = คืนสตริงตรง ๆ
  function load(k, def) {
    const s = localStorage.getItem(k);
    if (s == null) return def;
    try { return JSON.parse(s); } catch { return s; }
  }
  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  // พิกัดคลิกบนจอ → พิกัดในภาพ canvas (canvas ถูกย่อตามกว้างจอ)
  function canvasPoint(cv, e) {
    const r = cv.getBoundingClientRect();
    return [(e.clientX - r.left) * (cv.width / r.width), (e.clientY - r.top) * (cv.height / r.height)];
  }

  window.MapCore = {
    hash, noise, fbm, rnd, hex, pairKey,
    buildGrid, regions, paintLand, drawBorders, vignette,
    mountain, tree, decorate, compass, cartouche,
    ICONS, icon, label, pin, badge,
    load, save, canvasPoint,
  };
})();
