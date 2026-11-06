// ตัวเลขบนหน้าเว็บ (B65) — คิดจากข้อมูล/โค้ดชุดเดียวกับเกมทุกครั้งที่ build หน้าเว็บจึงไม่ค้างเลขเก่าเมื่อระบบเปลี่ยน
// หน้า docs อ้างด้วย <span data-fact="ชื่อ">…</span> · ห้ามมีค่าบัญชีบุญบาปรายชีวิต มีแต่กติกาที่ผู้เล่นอ่านได้อยู่แล้ว
import { readFileSync } from 'node:fs';
import { ALL_PATTERNS, TITLES, FAMILY_TITLES, FAMILY_GOALS, FAME, STAND_MIX, REALMS, CARRY, KARMA, KIN_TIERS, TRACKS, CLASSES, SIN_CATS, FLAG_CATS, ISEKAI_CATS, LEGACY, PATTERN_FROM, ENTRY, ENTRY_EVENTS, GODDESS, GODDESS_VOWS, COURT_SCENES, CONT_LIFE, CONT_REGIONS, CONT_RACES, ISEKAI_CAREERS, ISEKAI_CAREER_T, PATHS, HEIR_AGE, ISEKAI_SKILLS, SKILL } from '../engine/index.mjs';
import { isekaiCardCount } from './otherworld.mjs';

const th = (n) => n.toLocaleString('en-US');

// เลขเวอร์ชันอยู่ไฟล์นี้ไฟล์เดียว: bump แก้แค่ไฟล์นี้ · build ฉีดเข้าเกม (versionLines) และหน้าเว็บ (data-fact) ⇒ ไม่มีซอร์สอื่นถือเลขให้ชนกันตอน merge
export const VERSION_FILE = new URL('../version.json', import.meta.url);
export const readVersion = () => JSON.parse(readFileSync(VERSION_FILE, 'utf8'));
export const versionLines = ({ version, build }) => `const APP_VERSION = ${JSON.stringify(version)};\nconst APP_BUILD = ${JSON.stringify(build)};\n`;

// แจ้งอัปเดตในเกม (ui-redo 22): รุ่นที่มีโน้ตในแพตช์โน้ตของ whatsnew (ที่ npm run rel เขียน) ใหม่สุดก่อน — ข้อความชุดเดียวกับหน้าเว็บ ไม่มีที่สองให้ลืมแก้
// bump ของเลนไม่เขียนโน้ต ⇒ รุ่นที่ไม่มีข้อถูกข้าม เกมจำ "รุ่นล่าสุดที่มีโน้ต" แทนเลขรุ่นจริง · เก็บ NOTE_KEEP รุ่น พอรวมรุ่นที่ยังไม่เห็นได้โดยไม่ฝังประวัติทั้งหมด
// ข้อความถอดแท็กเหลือข้อความล้วน (ป้ายกติกาเป็นคำนำหน้า) แล้วตัดที่ NOTE_CUT ตัวอักษรตรงช่องว่าง ≈ 2 บรรทัดบนแผ่นที่จอ 390 (วัดใน site:check ไม่ได้ — วัดด้วยเบราว์เซอร์)
const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
export const NOTE_KEEP = 20;
export const NOTE_CUT = 90;
const plain = (li) => li.replace(/<span class="tag rule">([^<]*)<\/span>/g, '$1: ').replace(/<[^>]+>/g, '').replace(/&[#\w]+;/g, (e) => ENT[e] ?? e).replace(/\s+/g, ' ').trim();
export function noteCut(t) {
  if (t.length <= NOTE_CUT) return t;
  const head = t.slice(0, NOTE_CUT - 1);
  const sp = head.lastIndexOf(' ');
  return `${(sp > NOTE_CUT * 0.6 ? head.slice(0, sp) : head).replace(/[\s·:]+$/, '')}…`;
}
export function releaseLog(html, keep = NOTE_KEEP) {
  const part = html.slice(Math.max(0, html.indexOf('<h2>แพตช์โน้ต</h2>')));
  const out = [];
  for (const m of part.matchAll(/<h3>(v[\d.]+) <small>[^<]*<\/small><\/h3>\s*<ul>([\s\S]*?)<\/ul>/g)) {
    const items = [...m[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, li]) => noteCut(plain(li))).filter(Boolean);
    if (items.length) out.push({ v: m[1], items });
    if (out.length >= keep) break;
  }
  return out;
}
export const notesLines = (log) => `const RELEASE_NOTES = ${JSON.stringify(log)};\n`;

export function siteFacts(content, ver = readVersion()) {
  const era = content.era;
  // ใบศาลเฉียดตาย (B153) ใช้ stage ระหว่างชาติแต่ออกกลางชีวิต — นับเป็นการ์ดช่วงมีชีวิต ไม่ใช่ฉากปรโลก
  const life = content.events.filter((e) => e.stage !== 'ระหว่างชาติ' || COURT_SCENES.includes(e.scene));
  const regions = era.birth.regions;
  const lottery = content.events.filter((e) => e.belief?.kind === 'lottery_numen').map((e) => e.belief);
  return {
    version: ver.version,
    build: ver.build,
    yearFrom: String(era.births.from),
    futureFrom: String(era.future.recent),
    yearTo: String(era.births.from + era.births.w.length - 1),
    regions: String(regions.length),
    provinces: String(regions.reduce((s, r) => s + r.provinces.length, 0)),
    cards: th(content.events.length),
    lifeCards: th(life.length),
    eraCards: th(life.filter((e) => e.era).length),
    afterCards: th(content.events.length - life.length),
    isekaiCards: th(isekaiCardCount()),
    eraEvents: th(era.events.length),
    patterns: String(ALL_PATTERNS.length),
    titles: String(TITLES.length),
    familyTitles: String(FAMILY_TITLES.length + FAMILY_GOALS.length),
    standMix: String(Math.round(STAND_MIX * 100)),
    fameLevels: String(FAME.names.length),
    fameNames: FAME.names.join(' · '),
    realms: String(REALMS.length),
    realmNames: REALMS.map((r) => r.name).join(' · '),
    carryMin: String(Math.round(CARRY.min * 100)),
    carryMax: String(Math.round(CARRY.max * 100)),
    sinMax: String(KARMA.sinMax),
    meritMin: String(KARMA.meritMin),
    kinTiers: String(KIN_TIERS.length),
    kinNames: KIN_TIERS.map((k) => k.name).join(' · '),
    tracks: Object.values(TRACKS).map((t) => t.name).join(' · '),
    classes: String(CLASSES.length),
    sinCanon: String(SIN_CATS.filter((c) => !FLAG_CATS.includes(c) && !ISEKAI_CATS.includes(c)).length),
    sinAll: String(SIN_CATS.length),
    lotteryMult: String(Math.max(...lottery.map((b) => b.odds_modifier.max_mult))),
    lotteryCap: String(Math.min(...lottery.map((b) => b.cap_per_life))),
    patternFrom: String(PATTERN_FROM),
    disputePct: String(Math.round(LEGACY.dispute * 100)),
    taxPct: String(Math.round(LEGACY.tax * 100)),
    taxFrom: th(LEGACY.taxFrom / 1e6),
    taxYear: String(LEGACY.taxYear),
    // ทางเข้าต่างโลก (B68d/e) — ช่วงอายุ จำนวนแบบ และของแถมอ่านได้ · ความถี่เทพธิดาตามกรรมเขียนเป็นทิศบนหน้า ไม่ฉีดเลข
    entryFirst: `${ENTRY.bands[0].from}–${ENTRY.bands[0].to}`,
    entryLater: ENTRY.bands.slice(1).map((b) => `${b.from}–${b.to}`).join(' และ '),
    entryLaterPct: String(Math.round(ENTRY.bands[1].p * 100)),
    entryMax: String(ENTRY.bands.length),
    entryKinds: String(Object.keys(ENTRY_EVENTS).length),
    entryGone: String(Object.values(ENTRY_EVENTS).filter((e) => e.gone).length),
    vowCount: String(GODDESS_VOWS.length),
    fatedLuck: String(GODDESS.fatedLuck),
    contOffers: String(CONT_LIFE.offers),
    contRegions: String(Object.keys(CONT_REGIONS).length),
    contRaces: String(Object.keys(CONT_RACES).length),
    contCareers: String(Object.keys(ISEKAI_CAREERS).length),
    contCareerYears: String(ISEKAI_CAREER_T.years),
    contFame: String(CONT_LIFE.fame),
    // ทางเกิดที่ปรโลก (หน้า worlds) — ข้อความเดียวกับปุ่มบนการ์ดทางเกิด
    ...Object.fromEntries(PATHS.map((p) => [`path${p.id[0].toUpperCase()}${p.id.slice(1)}`, p.text])),
    heirAgeFrom: String(HEIR_AGE[0]),
    heirAgeTo: String(HEIR_AGE[1]),
    // สกิลข้ามชาติ (06s): พกได้กี่อย่าง · ขั้นสูงสุด · จำนวนสกิลในสมุด
    skillCarry: String(SKILL.carry),
    skillTop: String(SKILL.top),
    skillAll: String(Object.keys(ISEKAI_SKILLS).length),
  };
}

// แทนค่าในทุก data-fact ที่รู้จัก · ชื่อที่ไม่รู้จัก = build ล้ม (กันหน้าอ้างตัวเลขที่ไม่มีใครคิดให้)
export function injectFacts(html, facts, file = '') {
  return html.replace(/(<(\w+)[^>]*\sdata-fact="([^"]+)"[^>]*>)[^<]*(<\/\2>)/g, (m, open, tag, key, close) => {
    if (!(key in facts)) throw new Error(`${file}: data-fact "${key}" ไม่มีใน siteFacts`);
    return open + facts[key] + close;
  });
}
