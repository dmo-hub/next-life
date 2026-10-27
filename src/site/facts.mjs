// ตัวเลขบนหน้าเว็บ (B65) — คิดจากข้อมูล/โค้ดชุดเดียวกับเกมทุกครั้งที่ build หน้าเว็บจึงไม่ค้างเลขเก่าเมื่อระบบเปลี่ยน
// หน้า docs อ้างด้วย <span data-fact="ชื่อ">…</span> · ห้ามมีค่าบัญชีบุญบาปรายชีวิต มีแต่กติกาที่ผู้เล่นอ่านได้อยู่แล้ว
import { readFileSync } from 'node:fs';
import { ALL_PATTERNS, TITLES, FAMILY_TITLES, REALMS, CARRY, KARMA, KIN_TIERS, TRACKS, CLASSES, SIN_CATS, FLAG_CATS, LEGACY, PATTERN_FROM } from '../engine/index.mjs';
import { isekaiCardCount } from './otherworld.mjs';

const th = (n) => n.toLocaleString('en-US');

export function siteFacts(content, appSrc = readFileSync(new URL('../ui/app.mjs', import.meta.url), 'utf8')) {
  const pick = (re) => appSrc.match(re)?.[1] ?? '';
  const era = content.era;
  const life = content.events.filter((e) => e.stage !== 'ระหว่างชาติ');
  const regions = era.birth.regions;
  const lottery = content.events.filter((e) => e.belief?.kind === 'lottery_numen').map((e) => e.belief);
  return {
    version: pick(/APP_VERSION = '([^']+)'/),
    build: pick(/APP_BUILD = '([^']+)'/),
    yearFrom: String(era.births.from),
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
    familyTitles: String(FAMILY_TITLES.length),
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
    sinCanon: String(SIN_CATS.filter((c) => !FLAG_CATS.includes(c)).length),
    sinAll: String(SIN_CATS.length),
    lotteryMult: String(Math.max(...lottery.map((b) => b.odds_modifier.max_mult))),
    lotteryCap: String(Math.min(...lottery.map((b) => b.cap_per_life))),
    patternFrom: String(PATTERN_FROM),
    disputePct: String(Math.round(LEGACY.dispute * 100)),
    taxPct: String(Math.round(LEGACY.tax * 100)),
    taxFrom: th(LEGACY.taxFrom / 1e6),
    taxYear: String(LEGACY.taxYear),
  };
}

// แทนค่าในทุก data-fact ที่รู้จัก · ชื่อที่ไม่รู้จัก = build ล้ม (กันหน้าอ้างตัวเลขที่ไม่มีใครคิดให้)
export function injectFacts(html, facts, file = '') {
  return html.replace(/(<(\w+)[^>]*\sdata-fact="([^"]+)"[^>]*>)[^<]*(<\/\2>)/g, (m, open, tag, key, close) => {
    if (!(key in facts)) throw new Error(`${file}: data-fact "${key}" ไม่มีใน siteFacts`);
    return open + facts[key] + close;
  });
}
