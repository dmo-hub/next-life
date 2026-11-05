// ชุดสีกลางของหน้าเว็บ (ui-redo 105 · T1 ข้อ 209–211 · T2 ข้อ 218) — ค่าชุดเดียวกับ :root ของหน้าเล่น (src/ui/template.html)
// หน้าเอกสารไม่ฝัง hex เอง: build ฉีด SITE_ROOT ผ่านแถบบน (NAV_CSS) ⇒ ทุกหน้าที่มีแถบบนได้ชุดเดียวกัน แก้สีที่นี่ที่เดียว
// คราม = หมึก = ปุ่มหลัก = หัวเว็บ ⇒ แยกลิงก์ในเนื้อจากตัวหนังสือด้วยสีไม่ได้ ลิงก์ในเนื้อจึงต้องขีดเส้นใต้
export const T1 = {
  bg: '#F4ECDC', surface: '#FBF6EA', ink: '#1B2A4A', muted: '#5B5648', accent: '#1B2A4A', head: '#1B2A4A', headink: '#E8CF8A',
  accent2: '#7A5C12', gold: '#D9B45A', seal: '#A62B1F', good: '#2F6B4F', bad: '#B3261E', line: '#C9B98F', 'line-strong': '#8C7A52',
};
// ตัวหนังสือรองบนพื้นคราม (ค่าจากหน้า tweak T2/T3 ที่เคาะ) · ห้องผู้พัฒนาใช้ตัวเดียวกัน
const ON_HEAD = { 'on-head': '#E7E2D4', 'on-head2': '#D8D2C2', 'on-head3': '#BFB49A', title: '#F4ECDC' };
// กล่องมืดในหน้าเอกสาร (ปรโลก/ระหว่างชาติ) = พื้นดำรักชุดเดียวกับการ์ด B ในเกม (ข้อ 222)
const LACQUER = { lacquer: '#17110D', lacquer2: 'color-mix(in srgb, #17110D 88%, #E8CF8A)', bronze: 'color-mix(in srgb, #D9B45A 35%, #17110D)' };

// --fh/--fb = หัว Maitree เนื้อ Sarabun (ข้อ 210 216) · --r มุมปุ่ม/ช่อง · --rk มุมการ์ด · หน้าเอกสารไม่มีเงา (ข้อ 217)
export const SITE_ROOT = `:root { ${Object.entries({ ...T1, ...ON_HEAD, ...LACQUER }).map(([k, v]) => `--${k}:${v};`).join(' ')} --fh:Maitree,serif; --fb:Sarabun,system-ui,sans-serif; --r:6px; --rk:8px; }`;
