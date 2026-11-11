// ชุดสีกลางของหน้าเว็บ (ui-redo 105 · T1 ข้อ 209–211 · T2 ข้อ 218) — ค่าชุดเดียวกับ :root ของหน้าเล่น (src/ui/template.html)
// หน้าเอกสารไม่ฝัง hex เอง: build ฉีด SITE_ROOT ผ่านแถบบน (NAV_CSS) ⇒ ทุกหน้าที่มีแถบบนได้ชุดเดียวกัน แก้สีที่นี่ที่เดียว
// คราม = หมึก = ปุ่มหลัก = หัวเว็บ ⇒ แยกลิงก์ในเนื้อจากตัวหนังสือด้วยสีไม่ได้ ลิงก์ในเนื้อจึงต้องขีดเส้นใต้
export const T1 = {
  bg: '#F4ECDC', surface: '#FBF6EA', ink: '#1B2A4A', muted: '#5B5648', accent: '#1B2A4A', head: '#1B2A4A', headink: '#E8CF8A',
  accent2: '#7A5C12', gold: '#D9B45A', seal: '#A62B1F', good: '#2F6B4F', bad: '#B3261E', line: '#C9B98F', 'line-strong': '#8C7A52',
};
// ตัวหนังสือรองบนพื้นคราม (ค่าที่เจ้าของเคาะใน T2/T3) · ห้องผู้พัฒนาใช้ตัวเดียวกัน
const ON_HEAD = { 'on-head': '#E7E2D4', 'on-head2': '#D8D2C2', 'on-head3': '#BFB49A', title: '#F4ECDC' };
// กล่องมืดในหน้าเอกสาร (ปรโลก/ระหว่างชาติ) = ดำรักชุดเดิมของการ์ด B ในเกม — สีโลกอื่นคงเดิมจนใบ 121 (ข้อ 228)
const LACQUER = { lacquer: '#17110D', lacquer2: '#221912', bronze: '#5A4630' };

// --fh/--fb = หัว Maitree เนื้อ Sarabun (ข้อ 210 216) · --r มุมปุ่ม/ช่อง · --rk มุมการ์ด · หน้าเอกสารไม่มีเงา (ข้อ 217)
export const SITE_ROOT = `:root { ${Object.entries({ ...T1, ...ON_HEAD, ...LACQUER }).map(([k, v]) => `--${k}:${v};`).join(' ')} --fh:Maitree,serif; --fb:Sarabun,system-ui,sans-serif; --r:6px; --rk:8px; }`;

// แถบบนบนหน้าที่ไม่ได้ประกาศชุดสีกลาง (แผนที่ · คลังเก่า): ตั้งตัวแปรที่ตัวแถบ ไม่ใช่ :root เพราะหน้าพวกนี้มี --ink --paper --gold ของตัวเองที่เนื้อหน้าใช้อยู่
// เอาแค่ตัวที่แถบอ่าน ไม่รวม --surface: เลย์เอาต์เอกสารดูคำนี้ว่าหน้ามีชุดสีกลางไหม ประกาศในแถบแล้วหน้าพวกนี้จะโดนทาพื้นด้วยตัวแปรที่ไม่มี
const BAR_VARS = ['bg', 'ink', 'head', 'headink', 'accent2', 'gold', 'line'];
export const SITE_BAR = `nav.top, .nl-nav { ${BAR_VARS.map((k) => `--${k}:${T1[k]};`).join(' ')} --on-head:${ON_HEAD['on-head']}; --fb:Sarabun,system-ui,sans-serif; --r:6px; }`;
