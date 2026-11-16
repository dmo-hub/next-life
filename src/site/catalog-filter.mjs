// ตัวกรองหน้ารวมการ์ด (ui-redo 136): สองฟังก์ชันนี้เป็นตรรกะเดียวที่หน้าเว็บใช้ — build ฝังซอร์สลงหน้า ด่าน site:check เรียกตัวเดียวกันตรวจ
// ต้องไม่อ้างตัวแปรนอกฟังก์ชัน เพราะถูกส่งเป็นข้อความไปรันในเบราว์เซอร์

// ในกลุ่มเดียวกัน = หรือ · ข้ามกลุ่ม = และ · กลุ่มที่ไม่ได้เลือก = ไม่กรอง
// it = { cats: ป้ายหมวดบนการ์ด, st: ช่วงวัย/โลก, v: เวอร์ชันที่เพิ่ม ('' = ไม่มีป้าย) } · sel = { cat, st, since, vers }
export const matchItem = (it, sel) =>
  (!sel.cat.length || it.cats.some((c) => sel.cat.includes(c))) &&
  (!sel.st.length || sel.st.includes(it.st)) &&
  (sel.since === 'all' || sel.vers.includes(it.v));

// n รุ่นล่าสุดจากรายการเวอร์ชันที่มีบนหน้า (เรียงตามตัวเลขไม่ใช่ตัวอักษร: v0.6.13 มาก่อน v0.6.104)
export const recentVersions = (all, n) =>
  [...new Set(all.filter(Boolean))]
    .sort((a, b) => {
      const x = a.match(/\d+/g).map(Number);
      const y = b.match(/\d+/g).map(Number);
      for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (y[i] ?? 0) - (x[i] ?? 0);
      return 0;
    })
    .slice(0, n);
