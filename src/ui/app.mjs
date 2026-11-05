import { newLife, nextCard, causeWords, choose, statsOf, provinceLabel, STAT_LABELS, STAT_KEYS, STAGES, isWorking, monthlyIncome, jobText, promoText, moodMul, totalDebt, startAfterlife, nextAfterCard, chooseAfter, nextLife, lineageText, titlesOf, stageSummary, ALL_PATTERNS, TITLES, heirCandidates, FAMILY_TITLES, TIERS, horoscope, familyOf, MERIT_LEVELS, CLASSES, standingOf, classNow, ISEKAI_STAT, ISEKAI_STAGES, ISEKAI_ROLES, roleInfo, snapshot, restore, repairLife, nextGoal, schoolOf, lifeEndWord, isGone, ENTRY, ISEKAI_LORE, ISEKAI_WORLDS, isekaiWorldLore, LINEAGE_BRIEF, LOAN_KINDS, lifeQx, MAX_AGE, classOdds, regionRatio, protoYear, lifeFocusOffers, lifeFocusDefs, setLifeFocus, focusWords, FOCUS_FLOW, FOCUS_FLOW_NAME, useIsekaiCards, itemsOf, itemsVisible, ISEKAI_SKILLS, SKILL, skillBookAdd, bookCarryOffers, LOOP_KEYS, LOOP_LABELS, CONT_LIFE, arcSummary } from '../engine/index.mjs';
import { eraArt, eraPicArt, ERA_PICS, avatarArt, artTier, ERA_ART_W, ERA_ART_H, AVATAR_SIZE, ART_INK, sceneArt, ERA_FRAME } from './art.mjs';
import { shelfMemoArt, shelfTitleArt, shelfLineageArt } from './shelfart.mjs';
import { BTN, STAT_HELP, HELP, HELP_NOTE, warnWords, FOLLOW_ICON, SHOWN_STATS, ISEKAI_SHOWN, ISEKAI_HP, HEART_ICON } from './labels.mjs';

// APP_VERSION · APP_BUILD มาจาก src/version.json — build.mjs ประกาศไว้หัวสคริปต์ ไม่เขียนเลขในไฟล์นี้
// ชื่อไทยของเกม (B86) — คำว่า "ชาติหน้า" ที่เหลือในเกมเป็นเนื้อเรื่อง ไม่ใช่ชื่อเกม
const GAME_NAME = 'เกิดใหม่ทั้งที ชาตินี้ขอชิงมาเกิด';

const root = document.getElementById('app');
const appVer = document.getElementById('appVer');
appVer.textContent = `${APP_VERSION} · ${APP_BUILD}`;
// เลขรุ่นพาไปแพตช์โน้ตของรุ่นนั้น (B121) — หน้า whatsnew ไม่มี id ต่อรุ่น จึงเลื่อนด้วย text fragment ซึ่งตกไปหัวหน้าเองถ้าเบราว์เซอร์ไม่รองรับ
appVer.href = `whatsnew.html#:~:text=${APP_VERSION}`;

let st;
// ระหว่างชาติของชีวิตที่เพิ่งจบ (null = ยังมีชีวิต)
let af = null;
// อายุของการ์ดใบก่อนในชีวิตนี้ — ปีหนึ่งมีหลายใบได้ (B37a) หัวการ์ดจึงต้องบอกว่ายังเป็นปีเดิม
let prevAge = null;

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

const SVG = 'http://www.w3.org/2000/svg';
const baht = (v) => `${Math.round(v).toLocaleString('en-US')} บาท`;

// ชีวิต (สุขภาพ) ถึง 0 = ตาย ผู้เล่นต้องเห็นก่อนถึงจุดนั้น · ค่าอื่นต่ำไม่ทำให้ตายจึงไม่เตือน
const HEALTH_WARN = 20;

// ลูกศรปีนี้บนแถบค่า: เทียบกับค่าตอนการ์ดใบแรกของปี · ใบแรกของปีใหม่ยังเทียบกับต้นปีก่อน ผลสิ้นปีจึงไม่หายก่อนผู้เล่นเห็น
// อยู่ในหน่วยความจำของหน้า ไม่ลงเซฟ ⇒ ผลเกมไม่ขยับ · ชีวิตใหม่หรือโหลดเซฟ การ์ดแรกไม่มีลูกศร
let yearMark = null;
// ค่าที่เหตุการณ์ซ่อนไว้ (hidden ของเหตุการณ์/ตัวเลือก = ป้ายผล ?) ห้ามเผยผ่านลูกศรในปีที่เลือกทางนั้น — key = อายุ
const veiled = new Map();
function yearDelta(age, s) {
  if (yearMark?.st !== st) {
    yearMark = { st, age, base: s };
    veiled.clear();
    return null;
  }
  const from = yearMark;
  if (age !== from.age) yearMark = { st, age, base: s };
  const hide = new Set([...(veiled.get(from.age) ?? []), ...(veiled.get(age) ?? [])]);
  return Object.fromEntries(SHOWN_STATS.filter((k) => !hide.has(k)).map((k) => [k, Math.round(s[k]) - Math.round(from.base[k])]));
}
// อ่านเหตุการณ์ดิบจาก st.pending (ตัวที่การ์ดนี้ตั้งไว้) · ไม่มีเหตุการณ์ดิบแต่ป้ายผลขึ้น ? = ซ่อนทั้งแถบ ดีกว่าเผยค่าที่ซ่อน
function veil(card, i) {
  const ev = card.kind === 'event' && card.id && st.pending?.id === card.id ? st.pending : null;
  const keys = ev ? [...(ev.hidden ?? []), ...(ev.choices?.[i]?.hidden ?? [])] : card.fx?.[i]?.split(' · ').includes('?') ? SHOWN_STATS : [];
  if (keys.length) veiled.set(card.age, [...(veiled.get(card.age) ?? []), ...keys]);
}

// ป้ายเตือนพัก (ui-redo 24 · เจ้าของเคาะ): นับเวลาเฉพาะตอนแท็บเห็นอยู่ ครบ REST.at → บรรทัดจังหวัดบนแถบสถานะกลายเป็นป้ายพัก REST.show แล้วคืนบรรทัดเดิมและเริ่มนับใหม่
// ไม่มีแผ่น ไม่หยุดเกม · ซ่อนแท็บนานถึง REST.reset = ถือว่าพักแล้ว เริ่มนับใหม่ · ปรโลกไม่มีแถบสถานะจึงไม่มีป้าย
// ทางทดสอบ: play.html?rest=<วินาที> ย่นทั้งชุดเป็นวินาทีเท่านั้น (ป้ายขึ้นที่วินาทีนั้น · ขึ้นค้างเท่ากัน · ซ่อนครึ่งหนึ่งนับเป็นพัก)
// เวลาอยู่ในหน่วยความจำ ไม่เก็บลงเซฟ ⇒ ผลเกม/บอทไม่ขยับ · รีโหลดเริ่มนับใหม่
const REST_TEST = Number(new URLSearchParams(location.search).get('rest')) || 0;
const REST = REST_TEST > 0 ? { at: REST_TEST * 1000, show: REST_TEST * 1000, reset: REST_TEST * 500, tick: 250 } : { at: 2 * 3600e3, show: 10 * 60e3, reset: 5 * 60e3, tick: 30e3 };
const REST_TEXT = 'เล่นมา 2 ชม. แล้ว พักสายตาหน่อย';
let restMs = 0;
let restLast = document.hidden ? null : performance.now();
let restHidden = null;
const restOn = () => restMs >= REST.at;
// แถบที่วาดอยู่แล้วสลับข้อความเองโดยไม่วาดการ์ดใหม่ — data-where เก็บบรรทัดเดิมไว้คืน
function restPaint() {
  for (const small of document.querySelectorAll('.sb-who small[data-where]')) {
    small.textContent = restOn() ? REST_TEXT : small.dataset.where;
    small.classList.toggle('rest', restOn());
  }
}
function restStep() {
  const now = performance.now();
  if (restLast !== null) restMs += now - restLast;
  restLast = document.hidden ? null : now;
  if (restMs >= REST.at + REST.show) restMs = 0;
  restPaint();
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    restStep();
    restHidden = performance.now();
  } else {
    if (restHidden !== null && performance.now() - restHidden >= REST.reset) restMs = 0;
    restHidden = null;
    restLast = performance.now();
    restPaint();
  }
});
setInterval(restStep, REST.tick);
const whereLine = (text) => {
  const small = el('small', restOn() ? 'rest' : null, restOn() ? REST_TEXT : text);
  small.dataset.where = text;
  return small;
};

// แถบสถานะสองแถว (ui-redo ใบ 03): แถวบน อวตาร · ชื่อ+ที่ · อายุ · แถวล่าง ค่า 4 ตัว ชื่อ ตัวเลข ลูกศรปีนี้ แล้วแถบเส้น
// ใกล้ตาย = หัวใจข้างอายุ + ขอบจอแดง (CSS จับ .sb.dying) · โปรแกรมอ่านจออ่าน "ใกล้ตาย" จากหัวใจ ไม่พึ่งสี
function statusBar(card, s) {
  const bar = el('header', 'sb');
  const r1 = el('div', 'sb-r1');
  const who = el('span', 'sb-who');
  who.append(el('b', null, `${genLabel()}${st.name}`), whereLine(`${provinceLabel(st)} · ช่วง${card.stage}`), headJob(lifeJob(card.age)));
  const age = el('span', 'sb-age');
  age.append(el('b', null, card.funeral ? `จากไปอายุ ${card.age}` : String(card.age)));
  if (!card.funeral) age.append(el('small', null, ' ปี'));
  // การ์ดผลเป็นผลของใบก่อนอยู่แล้ว ป้ายซ้ำไม่บอกอะไรเพิ่ม · งานศพเกิดหลังตายจึงไม่ใช่ "ปีเดียวกัน" ของชีวิต
  if (card.kind !== 'result' && !card.funeral && card.age === prevAge) age.append(el('span', 'same', 'ปีเดียวกัน'));
  const hp = Math.round(s.health);
  if (!st.dead && hp <= HEALTH_WARN) {
    bar.classList.add('dying');
    const heart = el('span', 'sb-heart');
    heart.insertAdjacentHTML('beforeend', HEART_ICON);
    heart.setAttribute('role', 'img');
    heart.setAttribute('aria-label', 'ใกล้ตาย');
    age.append(heart);
  }
  r1.append(avatar(card.age), who, age);
  const delta = st.dead ? null : yearDelta(card.age, s);
  const ul = el('ul', 'sb-m');
  for (const k of SHOWN_STATS) {
    const v = Math.round(s[k]);
    const li = meterLi(STAT_LABELS[k], v, k === 'health' && v <= HEALTH_WARN);
    const d = delta?.[k];
    if (d) {
      const em = el('em', d < 0 ? 'dn' : null);
      const sign = el('span', null, d > 0 ? '▲' : '▼');
      sign.setAttribute('aria-hidden', 'true');
      em.append(sign, el('span', 'sr', d > 0 ? 'ปีนี้เพิ่ม ' : 'ปีนี้ลด '), String(Math.abs(d)));
      li.firstChild.append(em);
    }
    ul.append(li);
  }
  bar.append(r1, lifeMoneyRow(s), ul);
  return bar;
}
// หัวการ์ด (ui-redo ข้อ 161–162): แถวใต้ชื่อมีแค่คำ ไม่มีเกจ — ตัวเต็ม (เงินกู้ · รายได้ · ตำแหน่ง) อยู่แผงตัวฉัน/แผงเงิน (ข้อ 61)
// อาชีพเป็นบรรทัดแยกจากบรรทัดจังหวัด ป้ายพักทับแค่บรรทัดจังหวัด (data-where) อาชีพจึงยังอยู่
const headJob = (text) => el('small', 'hd-job', text);
// เกษียณบนหัวการ์ดเหลือคำเดียว — "เคยเป็น…" ยาวจนตกบรรทัดที่ 390 และแผงตัวฉันบอกครบอยู่แล้ว
const lifeJob = (age) => {
  const t = jobText(st, age);
  return t.startsWith('เกษียณ (') ? 'เกษียณ' : t;
};
function headCash(label, value, warn = null) {
  const cash = el('span', warn ? 'hd-cash red' : 'hd-cash');
  cash.append(el('span', 'mk', label), el('b', null, value));
  // แดงต้องมีคำกำกับ ไม่พึ่งสีอย่างเดียว
  if (warn) cash.append(el('span', 'lw', warn));
  return cash;
}
function lifeMoneyRow(s) {
  const row = el('div', 'hd-row');
  // เงินกู้เป็นยอดค้างของสัญญา ไม่หักจากเงินสด (เหมือนแผงเงิน) — มีกู้ชนะติดลบเมื่อเป็นทั้งคู่ เพราะเป็นเหตุที่ผู้เล่นต้องทำอะไรต่อ
  const warn = totalDebt(st) > 0 ? 'มีกู้' : s.money < 0 ? 'ติดลบ' : null;
  row.append(el('span', 'mk', 'ฐานะ'), el('span', 'hd-word', classNow(st)), headCash('เงินสด', shortBaht(Math.round(s.money)), warn));
  return row;
}
// ช่องค่าหนึ่งช่อง: ป้าย ตัวเลข แถบเส้น — แถบสถานะกับแผงตัวฉันของทั้งสองโลกใช้ตัวเดียวกัน หน้าตาจึงไม่แยกกันเพี้ยน
// shown = ตัวเลขบนป้ายเมื่อไม่ใช่ค่าเดียวกับความยาวแถบ (เกจทองต่างโลก: แถบเป็น % ของสเกล ป้ายเป็นทองจริง)
function meterLi(label, v, low, shown = String(v)) {
  const li = el('li', low ? 'low' : null);
  const head = el('span', 'mh');
  head.append(el('span', 'mk', label), el('b', 'num', shown));
  const track = el('span', 'br');
  const fill = el('i');
  fill.style.width = `${v}%`;
  track.append(fill);
  li.append(head, track);
  return li;
}

// ปุ่มโฟกัสชีวิต (B163): แถบเต็มใต้ค่าสถานะ — การ์ดกว้างไม่เกิน 460 ทุกจอ ข้างค่าสถานะไม่มีที่พอ
// ไม่ใช่ตัวเลือกของการ์ด (อยู่นอก .choices · ไม่มีเลขปุ่มลัด) · เปลี่ยนแล้วเซฟทันที ผลไปคิดตอนสิ้นปี
const focusName = (id) => (id === FOCUS_FLOW ? FOCUS_FLOW_NAME : lifeFocusDefs(st)[id].name);
const focusFx = (id) => (id === FOCUS_FLOW ? 'ไม่ทุ่มเรื่องไหนเป็นพิเศษ' : focusWords(lifeFocusDefs(st)[id], STAT_LABELS));
function focusBar(card, open = false) {
  const cur = st.focus ?? FOCUS_FLOW;
  const wrap = el('div', 'focus');
  const btn = el('button', 'focus-btn');
  btn.type = 'button';
  btn.setAttribute('aria-expanded', String(open));
  const fx = focusFx(cur);
  btn.append(el('span', 'focus-k', 'โฟกัส'), el('b', null, focusName(cur)), el('span', 'focus-fx', fx), el('span', 'focus-go', open ? 'ปิด' : 'เปลี่ยน'));
  const pick = el('div', 'focus-pick');
  pick.hidden = !open;
  for (const id of lifeFocusOffers(st)) {
    const b = el('button', id === cur ? 'on' : null);
    b.type = 'button';
    b.setAttribute('aria-pressed', String(id === cur));
    b.append(el('b', null, focusName(id)), el('span', 'focus-fx', focusFx(id)));
    b.onclick = () => {
      setLifeFocus(st, id);
      saveWrite(card);
      const next = focusBar(card);
      wrap.replaceWith(next);
      next.querySelector('.focus-btn').focus();
    };
    pick.append(b);
  }
  btn.onclick = () => {
    const next = focusBar(card, pick.hidden);
    wrap.replaceWith(next);
    next.querySelector('.focus-btn').focus();
  };
  wrap.append(btn, pick);
  return wrap;
}

// แถบเมนูล่าง (ui-redo ใบ 04): ทางเข้าระบบที่เดียว ค้างทุกฉากของชาติไทยและต่างโลก · กดแล้วแผงขึ้นทับการ์ด ไม่วาดการ์ดใหม่ ปิดแล้วการ์ดเดิมรออยู่
// ไม่ใช่ตัวเลือกของเกม — ไม่มีเลขปุ่มลัด ไม่ลงเซฟ
const LIFE_MENU = [['me', 'ตัวฉัน'], ['family', 'ครอบครัว'], ['money', 'เงิน'], ['shelf', 'สมุด'], ['more', 'เพิ่มเติม']];
// ต่างโลกไม่มีครอบครัวกับเงินบาทให้ดู — ทอง ชื่อเสียง อาชีพอยู่ในแผงตัวฉันของร่างนี้ (ui-redo ใบ 13)
// สกิลแยกปุ่มเพราะสมุดสกิล (06s-3) จะมาต่อที่แผงนี้ · ความเร็วย้ายจากการ์ดมาที่เมนู (ใบ 14)
const ISEKAI_MENU = [['me', 'ตัวฉัน'], ['skill', 'สกิล'], ['speed', 'ความเร็ว'], ['shelf', 'สมุด'], ['more', 'เพิ่มเติม']];
// ปรโลก (ui-redo ใบ 15 · ชุด A ของใบ 02): ชีวิตจบแล้ว ไม่มีเงินหรือโฟกัสให้ดู — ตัวฉันกลายเป็นชีวิตที่แล้ว · ครอบครัวกลายเป็นตระกูล
const AFTER_MENU = [['past', 'ชีวิตที่แล้ว'], ['family', 'ตระกูล'], ['shelf', 'สมุด'], ['more', 'เพิ่มเติม']];
function lifeMenu(card, box, after = false) {
  // การ์ดใหม่วาดทับทั้ง root แผงเดิมหายไปด้วยแล้ว
  sheetClose = null;
  const nav = el('nav', 'mnav');
  nav.setAttribute('aria-label', 'เมนู');
  const isk = card.kind === 'isekai';
  const sheets = { me: () => (isk ? isekaiMePanel(card.status) : mePanel(card)), skill: () => isekaiSkillPanel(card.status), speed: speedPanel, family: after ? clanPanel : familyPanel, money: () => moneyPanel(card), more: morePanel, past: pastPanel };
  // ชั้นสมุดมีแท็บ ปุ่มลบ และหน้ายืนยันของตัวเอง จึงเปิดเต็มหน้าแบบทางเข้าอื่น ไม่ยัดลงแผง · กลับแล้วคืนการ์ดเดิมทั้งก้อน
  const views = { shelf: () => openShelf() };
  // ต่างโลกช่วงยังไม่มีร่าง (ไม่มีหน้าต่างสถานะ) ไม่มีอะไรให้แผงตัวฉันกับสกิลโชว์
  const items = after ? AFTER_MENU : isk ? ISEKAI_MENU.filter(([id]) => (id !== 'me' && id !== 'skill') || card.status) : LIFE_MENU;
  for (const [id, label] of items) {
    const b = el('button', null);
    b.type = 'button';
    b.dataset.menu = id;
    b.append(el('span', null, label));
    if (sheets[id]) {
      b.setAttribute('aria-expanded', 'false');
      b.onclick = () => {
        const cur = root.querySelector('.sheet');
        // แผงค้าง: ปุ่มอื่นสลับแผง · ปุ่มเดิมซ้ำ = ซ่อนแผงจนกดเมนูใหม่ · ลิ้นชัก: กดปุ่มใดก็ปิด
        if (cur && (!cur.classList.contains('pin') || cur.dataset.menu === id)) {
          if (cur.classList.contains('pin')) pinId = null;
          return closeSheet();
        }
        if (pinned()) pinId = id;
        openSheet(label, sheets[id](), box, b, id);
      };
    } else {
      b.onclick = () => {
        // ปิดลิ้นชักก่อน ไม่งั้นการ์ดที่เก็บไว้คืนตอนกลับยัง inert อยู่ · แผงค้างไม่ inert เก็บไปพร้อมการ์ด กลับมาแผงเดิมยังอยู่
        unblockSheet();
        views[id]();
      };
    }
    nav.append(b);
  }
  // แผงเปิดค้างตามที่เลือกไว้ทุกการ์ด — การ์ดใหม่วาด root ใหม่ทั้งก้อน · รอ render ต่อเมนูเข้า root ก่อนค่อยเปิด
  // ต่างโลกไม่มีครอบครัว/เงิน ชีวิตไทยไม่มีสกิล/ความเร็ว ⇒ แผงที่เลือกไว้ไม่มีในเมนูนี้ เปิดตัวฉันแทน (ปรโลกเปิดชีวิตที่แล้ว)
  pinMenu = () => {
    if (!box.isConnected) return;
    const it = items.find(([id]) => id === pinId && sheets[id]) ?? items.find(([id]) => id === (after ? 'past' : 'me'));
    const b = it && nav.querySelector(`[data-menu="${it[0]}"]`);
    if (b) openSheet(it[1], sheets[it[0]](), box, b, it[0]);
  };
  queueMicrotask(pinAgain);
  return nav;
}
// แผงค้าง (ui-redo ใบ 67): จอคอมกว้างพอให้การ์ดช่องกลางไม่แคบกว่า 560 (ราว 220 + แผง 420 + ขอบการ์ด 64) แผงเปิดข้างการ์ดตั้งแต่เข้าเกม
// ไม่บัง ไม่ inert ไม่ดักโฟกัส การ์ดเล่นต่อได้ · จอแคบกว่านั้นเป็นลิ้นชักทับการ์ดแบบเดิม · จอเตี้ยใช้ราวแคบของมือถือแนวนอน ไม่ค้าง
const PIN_MQ = window.matchMedia?.('(min-width: 1264px) and (min-height: 541px)');
const pinned = () => !!PIN_MQ?.matches;
let pinId = 'me';
let pinMenu = null;
const pinAgain = () => {
  if (pinned() && pinId && !root.querySelector('.sheet')) pinMenu?.();
};
// ข้ามเส้นกว้าง/แคบ: ลิ้นชักที่เปิดอยู่กลายเป็นแผงค้าง · แผงค้างหายเมื่อจอแคบลง (ลิ้นชักไม่เปิดเอง)
PIN_MQ?.addEventListener?.('change', () => {
  closeSheet(true);
  pinAgain();
});
const unblockSheet = () => {
  if (!root.querySelector('.sheet.pin')) closeSheet();
};
// ลิ้นชัก: การ์ดใต้แผงเป็น inert — แตะหรือปุ่มลัดตัวเลขไม่ไปเลือกตัวเลือกที่ถูกบังอยู่ · Esc หรือกดปุ่มเมนูเดิมซ้ำ = ปิด
// from ว่าง = แผงที่เกมเปิดเอง (แจ้งอัปเดต) — ปิดแล้วโฟกัสกลับปุ่มแรกของจอใต้แผง · keep = ปิดเพื่อเปิดแผงอื่นต่อ ไม่ย้ายโฟกัส
let sheetClose = null;
function openSheet(title, content, box, from, id) {
  closeSheet(true);
  const pin = pinned();
  const sheet = el('section', pin ? 'sheet pin' : 'sheet');
  if (!pin) {
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
  }
  sheet.setAttribute('aria-label', title);
  if (id) sheet.dataset.menu = id;
  const head = el('div', 'sheet-h');
  const shut = el('button', 'sheet-x', 'กลับไปการ์ด');
  shut.type = 'button';
  head.append(el('h2', null, title), shut);
  sheet.append(head, content);
  sheetClose = (keep) => {
    sheet.remove();
    box.inert = false;
    from?.setAttribute('aria-expanded', 'false');
    sheetClose = null;
    if (!keep) (from ?? box.querySelector('button, a'))?.focus();
  };
  // แผงค้างของเมนู: ซ่อนจนกดเมนูใหม่ · แผงที่เกมเปิดเอง (แจ้งอัปเดต) ปิดแล้วแผงที่เลือกไว้กลับมา
  shut.onclick = () => {
    if (pin && id) pinId = null;
    closeSheet();
    pinAgain();
  };
  from?.setAttribute('aria-expanded', 'true');
  root.append(sheet);
  if (pin) return;
  box.inert = true;
  shut.focus();
}
const closeSheet = (keep) => sheetClose?.(keep);

// แผงตัวฉัน: ค่าเต็มคู่คำอธิบาย · โฟกัส · ฐานะและงาน (ย้ายมาจากใต้แถบสถานะของการ์ด) · ไม่มีลูกศรปีนี้ — ลูกศรอยู่บนแถบสถานะที่เดียว
// การ์ดตายเปิดได้เหมือนกัน เห็นค่าตอนจากไป แต่ไม่มีโฟกัส (ชีวิตจบแล้ว)
function mePanel(card) {
  const s = statsOf(st);
  const help = new Map(STAT_HELP);
  const wrap = el('div', 'me');
  const ul = el('ul', 'me-m');
  for (const k of SHOWN_STATS) {
    const v = Math.round(s[k]);
    const li = meterLi(STAT_LABELS[k], v, k === 'health' && v <= HEALTH_WARN && !st.dead);
    if (help.has(STAT_LABELS[k])) li.append(el('p', null, help.get(STAT_LABELS[k])));
    ul.append(li);
  }
  const shown = new Set(SHOWN_STATS.map((k) => STAT_LABELS[k]));
  const dl = el('dl');
  for (const [k, v] of STAT_HELP) if (!shown.has(k)) dl.append(el('dt', null, k), el('dd', null, v));
  wrap.append(el('h3', null, 'ค่าสถานะ'), ul, dl);
  if (!st.dead && card.kind !== 'death') wrap.append(el('h3', null, 'โฟกัส'), focusBar(card));
  const meta = el('p', 'meta');
  metaLine(meta, standParts(card));
  wrap.append(el('h3', null, 'ฐานะและงาน'), meta);
  if (itemsVisible(st)) wrap.append(el('h3', null, 'ของติดตัว'), kitList());
  return wrap;
}
// ของติดตัว (B78): ช่องสวมใส่ตามทะเบียน + กระเป๋า n/cap · ไม่มีปุ่มใส่/ถอด — ของลงช่องเองตอนได้ เป้เต็มขายเอง
// ช่องว่างเขียนว่า "ว่าง" ให้เห็นว่ามีช่องรออยู่ (หัวนี้โชว์เฉพาะเมื่อ itemsVisible)
function kitList() {
  const it = itemsOf(st);
  const reg = st.content.items;
  const name = (id) => reg.list[id].name;
  const dl = el('dl', 'kit');
  for (const [k, label] of Object.entries(reg.slots)) dl.append(el('dt', null, label), el('dd', null, it.wear[k] ? name(it.wear[k]) : 'ว่าง'));
  dl.append(el('dt', null, `กระเป๋า ${it.bag.length}/${it.cap}`), el('dd', null, it.bag.map(name).join(' · ') || 'ว่าง'));
  return dl;
}
// ช่วงเรียน ป้ายเรียนแทนช่อง "กำลังเรียน…" ที่บอกเรื่องเดียวกัน · เป้าหมายอื่นต่อท้ายบรรทัดฐานะ
// ฐานะ ณ ปีนี้ (ตัวเดียวกับที่การ์ดเช็กชนชั้น) ไม่ใช่ชนชั้นตอนเกิด — ฐานะตอนเกิดยังดูได้ที่กราฟฐานะตระกูล
function standParts(card) {
  if (card.kind === 'death') return [`ฐานะ${classNow(st)}`, card.job, st.edu && `วุฒิ${st.edu}`].filter(Boolean);
  const goal = nextGoal(st);
  const school = goal && schoolOf(st) !== 'none';
  return [`ฐานะ${classNow(st)}`, school ? goal : jobText(st, card.age), goal && !school && goal].filter(Boolean);
}
// จอแคบให้ตัดบรรทัดได้แค่ที่ตัวคั่น — เบราว์เซอร์ตัดคำไทยกลาง "ราย|ได้" ได้แม้เว้นวรรคแบบไม่ตัด จึงต้องห่อ span
const metaLine = (row, parts) => parts.forEach((t, i) => row.append(...(i ? [' · '] : []), el('span', null, t)));

// ป้ายแกนเงินสั้นพอวางข้างกราฟ เป็นคำไทย: 1.5 หมื่น · 1.2 ล้าน (ผู้เล่นไม่คุ้น "k")
function shortBaht(v) {
  const a = Math.abs(v), sign = v < 0 ? '−' : '';
  const num = (x) => String(Number(x.toFixed(x < 10 ? 1 : 0)));
  if (a >= 1e6) return `${sign}${num(a / 1e6)} ล้าน`;
  if (a >= 1e5) return `${sign}${num(a / 1e5)} แสน`;
  if (a >= 1e4) return `${sign}${num(a / 1e4)} หมื่น`;
  if (a >= 1e3) return `${sign}${num(a / 1e3)} พัน`;
  return `${sign}${Math.round(a)}`;
}

// ขั้นแกนตั้งเลขกลม (1 · 2 · 2.5 · 5 × 10^n) ให้ได้ราว 2 ช่อง
function niceStep(span) {
  const raw = span / 2, p = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= raw);
}

const svgEl = (tag, attrs, text) => {
  const n = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
};

// แถบช่วงวัยเป็นพื้นหลังกราฟ (B38a) — x(age) ของกราฟนั้นเอง กราฟค่าสถานะกับกราฟเงินจึงแบ่งช่วงตรงกัน
function stageBands(svg, ageX, fromAge, toAge, top, bottom, labels) {
  STAGES.forEach((s, i) => {
    const a = Math.max(s.from, fromAge), b = Math.min(STAGES[i + 1]?.from ?? Infinity, toAge);
    if (b <= a) return;
    svg.append(svgEl('rect', { class: `band band${i % 2}`, x: ageX(a), y: top, width: ageX(b) - ageX(a), height: bottom - top }));
    // ช่วงแคบเกินป้ายจะทับกัน — ชื่อช่วงยังอ่านได้จากแถบสลับสีกับแกนอายุ
    if (labels && ageX(b) - ageX(a) >= 34) svg.append(svgEl('text', { class: 'tb', x: (ageX(a) + ageX(b)) / 2, y: top - 4, 'text-anchor': 'middle' }, s.name));
  });
}

// กราฟเงินของช่วงที่ผ่านไป — แกนตั้งรวมศูนย์เสมอ ส่วนต่างเล็กจึงดูเล็ก · viewBox คงสัดส่วนให้ตัวหนังสือไม่บิด
// จุดเดียวไม่มีเส้นให้วาด · bands = แถบช่วงวัยพื้นหลัง (กราฟทั้งชีวิต)
function sparkline(series, fromAge, toAge, bands = false) {
  if (series.length < 2) return null;
  const nom = series.map((p) => p.money);
  let lo = Math.min(0, ...nom), hi = Math.max(0, ...nom);
  if (hi === lo) hi = 1;
  const step = niceStep(hi - lo);
  lo = Math.floor(lo / step) * step;
  hi = Math.ceil(hi / step) * step;
  const W = 320, H = 118, L = 46, R = 8, T = 6, B = 20;
  const x = (i) => L + (i / (series.length - 1)) * (W - L - R);
  const y = (v) => T + ((hi - v) / (hi - lo)) * (H - T - B);
  const svg = svgEl('svg', { class: 'spark', viewBox: `0 0 ${W} ${H}`, role: 'img',
    'aria-label': `เงินติดตัว ${baht(nom[0])} → ${baht(nom.at(-1))}` });
  // จุดสุดท้ายคือเงินตอนสิ้นอายุ toAge — ป้ายจึงยึดช่วงอายุเดียวกับหัวกล่อง ไม่นับจากจำนวนจุด
  const ageX = (a) => L + ((a - fromAge) / Math.max(toAge - fromAge, 1)) * (W - L - R);
  if (bands) stageBands(svg, ageX, fromAge, toAge, T, H - B, false);
  if (lo < 0) svg.append(svgEl('rect', { class: 'neg', x: L, y: y(0), width: W - L - R, height: y(lo) - y(0) }));
  for (let v = lo; v <= hi + step / 2; v += step) {
    svg.append(svgEl('line', { class: v === 0 ? 'zero' : 'grid', x1: L, x2: W - R, y1: y(v), y2: y(v) }));
    svg.append(svgEl('text', { class: 'ty', x: L - 4, y: y(v) + 3.5 }, v === 0 ? '0' : shortBaht(v)));
  }
  const ages = toAge - fromAge >= 10 ? [fromAge, Math.round((fromAge + toAge) / 2), toAge] : [fromAge, toAge];
  const anchor = (a) => (a === fromAge ? 'start' : a === toAge ? 'end' : 'middle');
  for (const a of ages) svg.append(svgEl('text', { class: 'tx', x: ageX(a), y: H - 6, 'text-anchor': anchor(a) }, `อายุ ${a}`));
  const path = (vals, cls) => svgEl('polyline', { class: cls, points: vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ') });
  svg.append(path(nom, 'nom'));
  for (const i of [0, series.length - 1]) svg.append(svgEl('circle', { class: 'dot', cx: x(i), cy: y(nom[i]), r: 3 }));
  return svg;
}

// กราฟทั้งชีวิตบนบันทึกการตาย (B38a): ค่าสถานะ 5 เส้นสเกลเดียวกัน + เงินแยกใต้ แกนอายุเดียวกัน
// เส้นแยกด้วยสีและลายเส้น (ไม่พึ่งสีอย่างเดียว) · แกนตั้งเป็นตัวเลข 0–100 สเกลเดียวกับแถบค่าสถานะ
const LINE_DASH = ['', '7 3', '2 3', '9 3 2 3', '4 2'];
function legendItem(i, label) {
  const key = svgEl('svg', { class: 'key', viewBox: '0 0 24 8', 'aria-hidden': 'true' });
  key.append(svgEl('line', { class: `ln ln${i}`, x1: 0, x2: 24, y1: 4, y2: 4, 'stroke-dasharray': LINE_DASH[i] }));
  const li = el('li');
  li.append(key, label);
  return li;
}
// หมุดบนกราฟ: ชี้/แตะ/โฟกัสแล้วบรรทัดใต้กราฟบอกเรื่อง — มือถือไม่มี hover <title> อย่างเดียวไม่พอ
function markDot(svg, cap, cx, cy, r, text, cls) {
  markShapes(svg, cap, text, cls, svgEl('circle', { cx, cy, r }));
}
function markShapes(svg, cap, text, cls, ...shapes) {
  const g = svgEl('g', { class: `mk ${cls}`, tabindex: 0, role: 'button', 'aria-label': text });
  g.append(svgEl('title', {}, text), ...shapes);
  const show = () => (cap.textContent = text);
  g.addEventListener('click', show);
  g.addEventListener('focus', show);
  g.addEventListener('mouseenter', show);
  svg.append(g);
}
// เรื่องเด่นทั้งชีวิต = เรื่องเด่นของแต่ละช่วงวัยชุดเดียวกับการ์ดเปลี่ยนช่วง (ผู้เล่นเคยเห็นแล้ว ไม่มีของใหม่ให้รั่ว)
function lifeMarks(deathAge) {
  return STAGES.flatMap((s, i) => (s.from > deathAge ? [] : stageSummary(st, s.name, s.from, Math.min((STAGES[i + 1]?.from ?? Infinity) - 1, deathAge)).highlights));
}
// สาเหตุการตาย (B110): ตารางอยู่ engine (causeWords) ให้จดหมายคำฝากใช้ข้อยกเว้นชุดเดียวกัน · หายไปต่างโลกไม่ใช่การตาย
const causeOf = (cause, age) => (isGone(st) ? null : causeWords(cause, age));
// เหตุและผล (gameslash-4): นัดที่ยิงแล้ว คู่ที่ห่างที่สุดไม่เกิน ECHO_MAX · แถบแยกใต้กราฟ — เส้นโค้งทับเส้นค่าสถานะแล้วอ่านไม่ออก
// เล่าแค่ตัวเลือกกับชื่อการ์ดที่ผู้เล่นเห็นมาแล้ว ไม่มีสี/คำบอกดีร้าย · missed = นัดที่สุ่มไม่ผ่าน ไม่มีผลให้โยง
const ECHO_MAX = 5;
function echoBand(x, W, deathAge, cap) {
  const pairs = (st.echoes ?? []).filter((e) => !e.missed && e.age <= deathAge).map((e, i) => ({ ...e, i }));
  if (!pairs.length) return null;
  const top = pairs.sort((a, b) => b.age - b.from - (a.age - a.from) || a.i - b.i).slice(0, ECHO_MAX).sort((a, b) => a.from - b.from || a.age - b.age);
  const H = 40, base = H - 6, far = Math.max(...top.map((e) => e.age - e.from));
  const svg = svgEl('svg', { class: 'spark echo', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `เหตุและผล ${top.length} เรื่อง` });
  const list = el('ol', 'echo-list');
  for (const e of top) {
    const text = `อายุ ${e.from} · ${e.pick} → อายุ ${e.age}${e.title ? ` · ${e.title}` : ''}`;
    const x1 = x(e.from), x2 = x(e.age), lift = 2 * (8 + 22 * ((e.age - e.from) / far));
    const d = `M${x1.toFixed(1)},${base} Q${((x1 + x2) / 2).toFixed(1)},${(base - lift).toFixed(1)} ${x2.toFixed(1)},${base}`;
    // เส้นหนาโปร่งใสรับนิ้ว — เส้นจริงบางเกินจะแตะโดนบนมือถือ
    markShapes(svg, cap, text, 'arc', svgEl('path', { class: 'hit', d }), svgEl('path', { d }), svgEl('circle', { cx: x1, cy: base, r: 2.5 }), svgEl('circle', { cx: x2, cy: base, r: 2.5 }));
    list.append(el('li', null, text));
  }
  return [svg, list];
}
function lifeChart(life, deathAge, cause) {
  if (life.stats.length < 2) return null;
  const box = el('div', 'lifechart');
  const W = 320, H = 158, L = 46, R = 8, T = 18, B = 20;
  const x = (a) => L + (a / Math.max(deathAge, 1)) * (W - L - R);
  const y = (v) => T + ((100 - v) / 100) * (H - T - B);
  const svg = svgEl('svg', { class: 'spark life', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `ค่าสถานะตลอดชีวิต อายุ 0 ถึง ${deathAge}` });
  stageBands(svg, x, 0, deathAge, T, H - B, true);
  for (const [v, t] of [[100, '100'], [50, '50'], [0, '0']]) {
    svg.append(svgEl('line', { class: 'grid', x1: L, x2: W - R, y1: y(v), y2: y(v) }));
    if (t) svg.append(svgEl('text', { class: 'ty', x: L - 4, y: y(v) + 3.5 }, t));
  }
  const ages = deathAge >= 10 ? [0, Math.round(deathAge / 2), deathAge] : [0, deathAge];
  for (const a of ages) svg.append(svgEl('text', { class: 'tx', x: x(a), y: H - 6, 'text-anchor': a === 0 ? 'start' : a === deathAge ? 'end' : 'middle' }, `อายุ ${a}`));
  // คำอธิบายเส้นบอกค่าปลายเส้น (ตอนจากไป) — ตัวเลขเดียวกับแถบบนการ์ดใบสุดท้าย
  const legend = el('ul', 'legend');
  legend.append(el('li', null, 'ตอนจากไป'));
  const end = life.stats.at(-1);
  SHOWN_STATS.forEach((k, i) => {
    const pts = life.stats.map((p) => `${x(p.age).toFixed(1)},${y(p[k]).toFixed(1)}`).join(' ');
    svg.append(svgEl('polyline', { class: `ln ln${i}`, points: pts, 'stroke-dasharray': LINE_DASH[i] }));
    legend.append(legendItem(i, `${STAT_LABELS[k]} ${Math.round(end[k])}`));
  });
  // จุดเรื่องเด่น + จุดตาย (B38)
  const cap = el('p', 'mk-cap', 'แตะจุดบนกราฟเพื่อดูเรื่องในปีนั้น');
  cap.setAttribute('aria-live', 'polite');
  const mark = (a, text, cls) => markDot(svg, cap, x(a), H - B - 5, 4, text, cls);
  for (const m of lifeMarks(deathAge)) mark(m.age, `อายุ ${m.age} · ${m.text}`, 'ev');
  const why = causeOf(cause, deathAge);
  mark(deathAge, `${lifeEndWord(isGone(st))} ${deathAge}${why ? ` · ${why[1]}` : ''}`, 'death');
  box.append(svg, legend, cap);
  const echoes = echoBand(x, W, deathAge, cap);
  if (echoes) box.append(el('div', 'h', 'เหตุและผล'), ...echoes);
  const arcs = arcSummary(st);
  if (arcs.length) {
    const list = el('ol', 'echo-list');
    for (const a of arcs) list.append(el('li', null, `${a.name} · ${a.n} ตอน · ${a.end ? 'จบเรื่องแล้ว' : 'ยังค้างอยู่'}`));
    box.append(el('div', 'h', 'เรื่องต่อเนื่อง'), list);
  }
  const money = sparkline(life.money, 0, deathAge, true);
  if (money) box.append(el('div', 'h', 'เงินติดตัว'), money);
  return fold(box, `ทั้งชีวิต · อายุ 0–${deathAge}`);
}
// แผงย่อยบนมรณบัตรพับไว้ก่อน หัวข้อยังเห็น แตะเพื่อเปิด — การ์ดยาวจนปุ่มไปต่อจมใต้จอ
// เนื้อในห่อ div แยก: details ตั้ง display:flex ไม่ได้ทุกเบราว์เซอร์ ระยะห่างแบบ flex ของแผงจึงอยู่ที่ตัวห่อ
// fresh = ป้ายอ่านจอของจุดแดง "ใหม่" บนหัวแผง · เปิดแผงแล้วจุดหายและเรียก onOpen ครั้งเดียว
function fold(box, label, fresh = null, onOpen = null) {
  const d = el('details', 'fold');
  const inner = el('div', 'fold-in');
  inner.append(...box.childNodes);
  const sum = el('summary', null, label);
  if (fresh) {
    sum.append(newDot(fresh));
    d.addEventListener('toggle', () => {
      if (!d.open || !sum.lastChild?.classList?.contains('new-dot')) return;
      sum.lastChild.remove();
      onOpen?.();
    });
  }
  d.append(sum, inner);
  box.replaceChildren(d);
  return box;
}

// กราฟฐานะตระกูล (B95): ฐานะ 10 ระดับต้นทุกช่วงวัยทุกรุ่นต่อกันเป็นเส้นเดียว รุ่นละช่องกว้างเท่ากัน 10+ รุ่นก็ไม่ล้น
// เส้นข้ามรุ่น = ฐานะตอนตาย → ฐานะบ้านที่รุ่นถัดไปเกิด · ขาลงแยกสีและลายเส้น (ไม่พึ่งสีอย่างเดียว) ให้เห็นการตกชั้นชัด
// ใช้แค่ฐานะ อายุ ชื่อ และการตายพร้อมหนี้ — ไม่มีบัญชีบุญบาป
function standingGens(lineage, life = null) {
  // รุ่นต่างโลก (B68a) ไม่มีฐานะไทยให้วาด — ข้ามไป เส้นต่อจากชาติไทยก่อนหน้าไปรุ่นไทยถัดไป
  const gens = lineage.filter((l) => !l.isekai).map((l) => ({ gen: l.gen, name: l.name, age: l.age, gone: l.gone, broke: l.broke, pts: l.standing ?? [{ age: 0, cls: CLASSES.indexOf(l.cls) }] }));
  return life ? [...gens, life] : gens;
}
// ชีวิตนี้: จุดต้นช่วงวัยที่แกนจดไว้ + ฐานะ ณ ตอนนี้ (หรือตอนตาย) เป็นจุดท้าย
function standingNow(dead) {
  const pts = [...st.standing.filter((p) => p.age < st.age), { age: st.age, cls: standingOf(st) }];
  return { gen: st.gen, name: st.name, age: st.age, live: !dead, pts };
}
// ช่องรุ่นถัดไปมีจุดเดียว จึงแคบกว่าช่องรุ่นปกติ
const NEXT_GEN_W = 0.3;
function standingLayout(gens, next) {
  const units = gens.length + (next != null ? NEXT_GEN_W : 0);
  const pts = gens.flatMap((g, i) => g.pts.map((p) => ({ u: i + 0.06 + (p.age / Math.max(g.age, 1)) * 0.88, cls: p.cls, g, end: p === g.pts.at(-1) })));
  if (next != null) pts.push({ u: gens.length + NEXT_GEN_W / 2, cls: next, next: true });
  return { units, pts };
}
const standingWord = (p) => (p.next ? `รุ่นถัดไปเกิดฐานะ${CLASSES[p.cls]}` : p.g.live ? `${genWord(p.g.gen)}ตอนนี้ อายุ ${p.g.age} · ฐานะ${CLASSES[p.cls]}`
  : `${genWord(p.g.gen)}${p.g.name ? `${p.g.name} · ` : ''}${lifeEndWord(p.g.gone)} ${p.g.age} · ฐานะตอน${p.g.gone ? 'หายตัว' : 'ตาย'}${CLASSES[p.cls]}${p.g.broke ? ' · จากไปพร้อมหนี้' : ''}`);
const genWord = (g) => `รุ่นที่ ${g} · `;
function standingChart(gens, next = null, head = true) {
  const { units, pts } = standingLayout(gens, next);
  if (pts.length < 2) return null;
  const box = el('div', 'lifechart stand');
  if (head) box.append(el('div', 'h', gens.length > 1 ? `ฐานะตระกูล · ${gens.length} รุ่น` : 'ฐานะตระกูล'));
  const W = 320, H = 132, L = 50, R = 8, T = 8, B = 22;
  const x = (u) => L + (u / units) * (W - L - R);
  const y = (c) => T + ((CLASSES.length - 1 - c) / (CLASSES.length - 1)) * (H - T - B);
  const first = pts[0].cls, last = pts.at(-1).cls, peak = Math.max(...pts.map((p) => p.cls));
  const svg = svgEl('svg', { class: 'spark stand', viewBox: `0 0 ${W} ${H}`, role: 'img',
    'aria-label': `ฐานะตระกูล ${gens.length} รุ่น · เริ่ม${CLASSES[first]} · สูงสุด${CLASSES[peak]} · ล่าสุด${CLASSES[last]}` });
  gens.forEach((g, i) => {
    svg.append(svgEl('rect', { class: `band band${i % 2}`, x: x(i), y: T, width: x(i + 1) - x(i), height: H - T - B }));
    const w = x(i + 1) - x(i);
    // ช่องแคบเหลือแค่เลขรุ่น · แคบกว่านั้นติดป้ายเฉพาะรุ่นแรกกับรุ่นท้าย
    const label = w >= 34 ? `รุ่น ${g.gen}` : w >= 12 || i === 0 || i === gens.length - 1 ? `${g.gen}` : null;
    if (label) svg.append(svgEl('text', { class: 'tx', x: (x(i) + x(i + 1)) / 2, y: H - 6, 'text-anchor': 'middle' }, label));
  });
  // ช่องรุ่นถัดไปแคบเมื่อรุ่นเยอะ ป้ายจะทับเลขรุ่นท้าย — จุดนั้นยังแตะดูได้
  if (next != null && x(units) - x(gens.length) >= 26) svg.append(svgEl('text', { class: 'tx', x: W - R, y: H - 6, 'text-anchor': 'end' }, 'ถัดไป'));
  for (const [c, t] of [[CLASSES.length - 1, CLASSES.at(-1)], [5, 'ชั้นกลาง'], [0, CLASSES[0]]]) {
    svg.append(svgEl('line', { class: 'grid', x1: L, x2: W - R, y1: y(c), y2: y(c) }));
    svg.append(svgEl('text', { class: 'ty', x: L - 4, y: y(c) + 3.5 }, t));
  }
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const dir = b.cls > a.cls ? 'su' : b.cls < a.cls ? 'sd' : 'se';
    svg.append(svgEl('line', { class: `sg ${dir}`, x1: x(a.u).toFixed(1), y1: y(a.cls).toFixed(1), x2: x(b.u).toFixed(1), y2: y(b.cls).toFixed(1) }));
  }
  // จุดท้ายของแต่ละรุ่น (ตาย/ตอนนี้) + จุดรุ่นถัดไป แตะดูได้ — มือถือไม่มี hover จึงบอกในบรรทัดใต้กราฟ
  const cap = el('p', 'mk-cap', 'แตะจุดบนกราฟเพื่อดูฐานะแต่ละรุ่น');
  cap.setAttribute('aria-live', 'polite');
  for (const p of pts.filter((q) => q.end || q.next)) {
    const text = standingWord(p);
    const g = svgEl('g', { class: `mk ${p.next ? 'nx' : p.g.broke ? 'broke' : 'ev'}`, tabindex: 0, role: 'button', 'aria-label': text });
    g.append(svgEl('title', {}, text), svgEl(p.g?.broke ? 'rect' : 'circle', p.g?.broke
      ? { x: x(p.u) - 3.5, y: y(p.cls) - 3.5, width: 7, height: 7 } : { cx: x(p.u), cy: y(p.cls), r: 3.5 }));
    const show = () => (cap.textContent = text);
    g.addEventListener('click', show);
    g.addEventListener('focus', show);
    g.addEventListener('mouseenter', show);
    svg.append(g);
  }
  const legend = el('ul', 'legend');
  for (const [cls, label] of [['su', 'ไต่ขึ้น'], ['sd', 'ตกชั้น']]) {
    const key = svgEl('svg', { class: 'key', viewBox: '0 0 24 8', 'aria-hidden': 'true' });
    key.append(svgEl('line', { class: `sg ${cls}`, x1: 0, x2: 24, y1: 4, y2: 4 }));
    const li = el('li');
    li.append(key, label);
    legend.append(li);
  }
  if (gens.some((g) => g.broke)) {
    const key = svgEl('svg', { class: 'key', viewBox: '0 0 24 8', 'aria-hidden': 'true' });
    const g = svgEl('g', { class: 'mk broke' });
    g.append(svgEl('rect', { x: 8.5, y: 0.5, width: 7, height: 7 }));
    key.append(g);
    const li = el('li');
    li.append(key, 'จากไปพร้อมหนี้');
    legend.append(li);
  }
  box.append(svg, legend, cap);
  return box;
}

function list(items, cls = 'items') {
  const ul = el('ul', cls);
  for (const it of items) ul.append(el('li', null, it));
  return ul;
}

// ผังตระกูลที่มีชาติต่างโลกแยกสองกลุ่ม โลกเดิม | ต่างโลก (B68h) — ไม่มีชาติต่างโลกหน้าตาเดิม
// ของที่แต่ละโลกจำนับจากทั้งเซฟ ไม่ใช่แค่แถวที่ย่อโชว์ · บทบาทที่ไม่มีโลกของตัวเองใช้ชื่อบทบาทจากแถวผังแทน
function lineageList(all, brief = all.length) {
  const shown = all.slice(-brief);
  const more = all.length > shown.length ? [`… ก่อนหน้านี้อีก ${all.length - shown.length} รุ่น`] : [];
  const lore = Object.entries(isekaiWorldLore(all));
  const away = shown.filter((l) => l.isekai);
  if (!away.length && !lore.length) return list([...more, ...lineageText(shown)], 'picks');
  const box = el('div', 'lineage');
  const home = shown.filter((l) => !l.isekai);
  if (home.length || more.length) box.append(el('div', 'lh', 'ตระกูลโลกเดิม'), list([...more, ...lineageText(home)], 'picks'));
  box.append(el('div', 'lh', 'ตระกูลต่างโลก'));
  if (away.length) box.append(list(lineageText(away), 'picks'));
  for (const [w, ids] of lore) box.append(el('p', 'llore', `โลก (${ISEKAI_WORLDS[w]?.name ?? all.find((l) => l.lore?.world === w)?.world ?? w}) ยังจำ: ${ids.map((id) => ISEKAI_LORE[id]).join(' · ')}`));
  return box;
}

// ผังตระกูลเป็นภาพ (เจ้าของสั่ง) · ข้อความเดิมพับไว้ใต้ภาพ — ชื่อ จังหวัด ฉายา และ screen reader ยังอ่านได้
function lineageView(all, now, brief = all.length, youWord) {
  const box = el('div', 'lineage-view');
  const shown = all.slice(-brief);
  const draw = () => shelfLineageArt(box, shown, all.length - shown.length, now, CLASSES, youWord, all.findLast((l) => !l.isekai));
  let cv = draw();
  const d = el('details', 'lineage-text');
  d.append(el('summary', null, 'อ่านเป็นข้อความ'), lineageList(all, brief));
  box.append(d);
  // การ์ดสร้างก่อนติดหน้า (และจอหมุน/ย่อได้ภายหลัง) ภาพที่วาดไว้ถูก CSS ยืดจนวงกลมเป็นวงรี — วาดใหม่ทุกครั้งที่ความกว้างจริงเปลี่ยน
  if (cv && typeof ResizeObserver === 'function') {
    let shown = false;
    const ro = new ResizeObserver(() => {
      // ยังไม่ติดหน้า = รอ (ครั้งแรกยิงได้ก่อนการ์ดถูกแปะ) · เคยติดแล้วหลุด = การ์ดถูกทิ้ง เลิกสังเกต
      if (!cv.isConnected) return shown ? ro.disconnect() : undefined;
      shown = true;
      // ซ่อนอยู่ (กว้าง 0) ยังวัดไม่ได้ — รอให้โผล่ก่อน ไม่งั้นวาดซ้ำวน
      if (!cv.offsetWidth) return;
      // ภาพกว้างขั้นต่ำ 280 (saCanvas) — เทียบกับความกว้างที่วาดได้จริง ไม่งั้นจอแคบวาดซ้ำไม่จบ
      const want = Math.max(280, cv.offsetWidth);
      if (Math.abs(want - cv.width / (window.devicePixelRatio || 1)) < 2) return;
      ro.unobserve(cv);
      cv.remove();
      cv = draw();
      if (!cv) return ro.disconnect();
      box.prepend(cv);
      ro.observe(cv);
    });
    ro.observe(cv);
  }
  return box;
}

// สรุปช่วงวัยที่ผ่านมา: แถบตอนนี้ + ขีดตำแหน่งต้นช่วง + ตัวเลขต้นช่วง → ตอนนี้ คู่ลูกศรทิศ
function recap(r) {
  const box = el('div', 'recap');
  box.append(el('div', 'h', `ช่วง${r.stage} · อายุ ${r.fromAge}–${r.toAge}`));
  const grid = el('div', 'delta');
  for (const s of r.stats.filter((x) => SHOWN_STATS.includes(x.key))) {
    const row = el('div');
    const dir = s.to - s.from;
    const head = el('span', null, `${s.label} ${Math.abs(dir) < 1 ? '·' : dir > 0 ? '↑' : '↓'} `);
    head.append(el('span', 'num', `${Math.round(s.from)} → ${Math.round(s.to)}`));
    row.append(head);
    const track = el('div', 'bar');
    const now = el('i');
    now.style.width = `${Math.round(s.to)}%`;
    const was = el('b');
    was.style.left = `${Math.round(s.from)}%`;
    track.append(now, was);
    row.append(track);
    grid.append(row);
  }
  box.append(grid);
  const m = r.money;
  box.append(el('p', 'sub', `เงิน ${baht(m.from)} → ${baht(m.to)}`));
  const chart = sparkline(r.moneySeries, r.fromAge, r.toAge);
  if (chart) box.append(chart);
  if (r.items.length) box.append(list(r.items));
  if (r.disclaimer) box.append(el('p', 'note', r.disclaimer));
  if (r.picks.length) {
    // ภาพรวมเล่าเป็นทิศ ไม่มีตัวเลข · รายการเต็มยังเปิดดูได้ — คนที่อยากไล่ย้อนทีละข้อไม่เสียข้อมูล
    const sum = stageSummary(st, r.stage, r.fromAge, r.toAge);
    box.append(el('div', 'h', 'ภาพรวมสิ่งที่เลือก'));
    box.append(list(sum.lines, 'items lean'));
    if (sum.highlights.length) {
      box.append(el('div', 'h', 'เรื่องที่โดดเด่น'));
      box.append(list(sum.highlights.map((p) => `อายุ ${p.age} · ${p.text}`), 'picks'));
    }
    const all = el('details', 'all-picks');
    all.append(el('summary', null, `ดูทุกสิ่งที่เลือก (${r.picks.length} เรื่อง)`));
    all.append(list(r.picks.map((p) => `อายุ ${p.age} · ${p.text}`), 'picks'));
    box.append(all);
  } else box.append(el('p', 'sub', 'ช่วงนี้ไม่มีเรื่องให้ตัดสินใจ'));
  return box;
}

// เฉลยบัญชีบุญบาปที่ปรโลก (ใบ 09) — ระหว่างชีวิตผู้เล่นไม่เคยเห็นตัวเลขนี้
// วางเป็นตาชั่งสองฝั่ง (ต้นแบบการ์ดปรโลก) — ฝั่งที่หนักกว่าได้ขอบทอง ผู้เล่นเห็นทิศก่อนอ่านตัวเลข
function reckoningBox(r, deeds) {
  const box = el('div', 'recap');
  box.append(el('div', 'h', 'บัญชีบุญบาป เฉลยที่ปรโลก'));
  const scale = el('div', 'scale');
  for (const [side, total, bad] of [['บุญ', r.good, false], ['บาป', r.bad, true]]) {
    const pan = el('div', r.lean === side ? 'heavy' : null);
    pan.append(el('b', null, side), el('span', 'sum', String(total)));
    const cats = r.top.filter((t) => t.bad === bad);
    for (const t of cats) pan.append(el('span', null, `${t.name} ${t.weight}`));
    if (!cats.length) pan.append(el('span', 'sub', '—'));
    scale.append(pan);
  }
  box.append(scale);
  box.append(el('p', 'sub', r.lean === 'เสมอ' ? 'บุญบาปพอ ๆ กัน' : `หนักไปทาง${r.lean}`));
  if (!r.top.length) box.append(el('p', 'sub', 'ชีวิตนี้ไม่ได้ทำบุญหรือบาปที่นับได้'));
  if (deeds.length) box.append(deedsPart(deeds));
  return box;
}

// ไทม์ไลน์กรรม (B26) — บอกเป็นระดับ ไม่บอกแต้มต่อเรื่อง · เกณฑ์ตรงกับน้ำหนักระดับ 2 และ 3 ของป้ายในเนื้อหา
const deedLevel = (d) => (d.weight >= MERIT_LEVELS[3] ? (d.bad ? 'หนัก' : 'ใหญ่') : d.weight >= MERIT_LEVELS[2] ? 'กลาง' : d.bad ? 'เบา' : 'เล็ก');
const deedLine = (d) => `${d.age === null ? 'หลังตาย' : `อายุ ${d.age}`} · ${d.text}`;
function deedsPart(deeds) {
  const part = el('div', 'deeds');
  part.append(el('div', 'h', 'เรื่องที่ชั่งไว้'));
  // เท่ากันเอาเรื่องที่ทำก่อน — ไม่ขึ้นกับลำดับ sort ของเบราว์เซอร์
  const top = (bad) => deeds.filter((d) => d.bad === bad).reduce((a, d) => (a && a.weight >= d.weight ? a : d), null);
  for (const [bad, label] of [[false, 'บุญใหญ่สุด'], [true, 'บาปหนักสุด']]) {
    const d = top(bad);
    const row = el('p', bad ? 'deed bad' : 'deed');
    row.append(el('b', null, label), el('span', null, d ? `${deedLine(d)} (${deedLevel(d)})` : 'ไม่มี'));
    part.append(row);
  }
  const all = el('details', 'all-picks');
  all.append(el('summary', null, `ดูทั้งหมดตามอายุ (${deeds.length} เรื่อง)`));
  all.append(list(deeds.map((d) => `${deedLine(d)} · ${d.bad ? 'บาป' : 'บุญ'}${deedLevel(d)}`), 'picks'));
  part.append(all);
  return part;
}

// แบบชีวิต/ฉายาคิดครั้งเดียวต่อการ์ดตาย แล้วลงสมุดฉายา — กดย้อน/วาดซ้ำไม่นับซ้ำ
function lifeTitles(card) {
  if (!card.lifeTitles) {
    const t = titlesOf(st);
    card.lifeTitles = { ...t };
    titleBookAdd(t);
    card.lifeTitles.clue = titleClue(`${st.seed}:${st.gen}`, t);
    picsAdd();
    deathAdd(card);
    card.memo = memoAdd(t);
    // สมุดเต็ม: ผู้เล่นลบแถวแล้วกดกลับ หน้าเดิมถูกคืนทั้งก้อน ไม่วาดใหม่ — ต้องลองลงซ้ำเองตอนกลับ
    if (card.memo === 'full') card.memoRetry = () => (card.memo = memoAdd(t));
  }
  return card.lifeTitles;
}
const TITLES_SHOWN = 3;

// ฉายาบนใบมรณะ (ui-redo 57 · แบบ line ของหนังสืองานศพ): ฉายาเด่นของชีวิตนี้เท่าที่แผงฉายาโชว์ เรียงในบรรทัดเดียว ที่เหลือบอกเป็นจำนวน
// ไม่มีฉายา = ไม่มีบรรทัด (แผงฉายาด้านล่างบอก "ยังไม่ได้ฉายา" อยู่แล้ว)
function titleLine(card) {
  const { titles } = lifeTitles(card);
  if (!titles.length) return null;
  const p = el('p', 'd-tl');
  p.append(el('span', 'k', 'ฉายา'), ` ${titles.slice(0, TITLES_SHOWN).map((t) => t.name).join(' · ')}`);
  if (titles.length > TITLES_SHOWN) p.append(' · ', el('span', 'more-n', `อีก ${titles.length - TITLES_SHOWN} ฉายา`));
  return p;
}

// บันทึกการตาย (ใบ 04): แบบชีวิต 1 + ฉายาเด่น 3 + ปุ่มดูทั้งหมด · ฉายาตระกูลแยกหัวข้อ
// แผงนี้มีแต่ของชีวิตนี้ (B130) — ของสะสมทุกชีวิตอยู่ในชั้นสมุด หัวข้อจึงย้ำ "ชีวิตนี้" ไม่ให้ปนกับสมุด
function titlesBox(card) {
  const { pattern, titles, family } = lifeTitles(card);
  // ของชีวิตนี้ที่เพิ่งเปิดครั้งแรกในสมุด — อ่านจากที่เก็บ ไม่ใช่ตอนลงสมุด รีโหลดที่มรณบัตรจึงยังเห็นจุด
  const unseen = bookRead().n;
  const mine = [pattern.id && newKey('p', pattern.id), ...titles.map((t) => newKey('t', t.id)), ...family.map((t) => newKey('f', t.id))].filter((k) => k && unseen.includes(k));
  const isNew = (k) => mine.includes(k);
  const box = el('div', 'recap titles');
  box.append(el('div', 'h', 'แบบชีวิตนี้'));
  const pat = el('p', 'pattern', pattern.name);
  if (pattern.id && isNew(newKey('p', pattern.id))) pat.append(newTag());
  box.append(pat);
  if (pattern.hint) box.append(el('p', 'note', pattern.hint));
  box.append(el('div', 'h', 'ฉายาที่ได้ชีวิตนี้'));
  if (!titles.length) box.append(el('p', 'sub', 'ชีวิตนี้ยังไม่ได้ฉายา'));
  const ul = el('ul', 'picks');
  const rows = titles.map((t) => {
    const li = el('li', null, `${t.name} · ${t.tier}`);
    if (isNew(newKey('t', t.id))) li.append(newTag());
    return li;
  });
  rows.forEach((li, i) => {
    li.hidden = i >= TITLES_SHOWN;
    ul.append(li);
  });
  box.append(ul);
  if (titles.length > TITLES_SHOWN) {
    const more = el('button', 'more', `ดูฉายาทั้งหมด (${titles.length})`);
    more.onclick = () => {
      rows.forEach((li) => (li.hidden = false));
      more.remove();
    };
    box.append(more);
  }
  if (family.length) {
    box.append(el('div', 'h', 'ฉายาตระกูลที่ได้ชีวิตนี้'));
    const fl = el('ul', 'picks');
    for (const t of family) {
      const li = el('li', null, t.name);
      if (isNew(newKey('f', t.id))) li.append(newTag());
      fl.append(li);
    }
    box.append(fl);
  }
  clueRow(box, lifeTitles(card).clue, 'คำใบ้ฉายาที่ยังไม่เคยได้');
  const b = bookRead();
  box.append(shelfButton(`เปิดชั้นสมุด · ฉายา ${b.p.length + b.t.length + b.f.length}/${BOOK_ALL}`, 't'));
  // เปิดแผงแล้วนับว่าเห็นของชีวิตนี้ · ของชีวิตก่อนที่ยังไม่ได้ดูยังติดจุดที่ชั้นสมุด
  return fold(box, 'ฉายาชีวิตนี้', mine.length ? `ได้ฉายาใหม่ ${mine.length}` : null, () => {
    bookSeen(mine);
    shelfDot();
  });
}

// เบาะแสฉายาที่ยังไม่เคยได้ 1 อัน (B108) — คำใบ้ชุดเดียวกับ ??? ในสมุด จึงไม่บอกมากกว่าที่สมุดบอกอยู่แล้ว
// ระดับง่ายก่อน (ชาติหน้าไปถึงได้จริง) · ในระดับเดียวกันเลือกด้วย hash ของชีวิต ไม่ใช้ rng ของเกม
// ⇒ ผลเกมไม่ขยับ และรีโหลดเซฟได้ตัวเดิม · ตัดฉายาที่ชีวิตนี้เพิ่งได้เอง เผื่อ storage ปิดจนสมุดไม่จำ
function titleClue(key, got = { titles: [], family: [] }) {
  const b = bookRead();
  const seen = new Set([...b.t, ...b.f, ...got.titles.map((x) => x.id), ...got.family.map((x) => x.id)]);
  let pool = TITLES.filter((x) => !seen.has(x.id));
  if (pool.length) {
    // TIERS เรียงหายากก่อน — ระดับง่ายสุดคือ index มากสุด
    const top = Math.max(...pool.map((x) => TIERS.indexOf(x.tier)));
    pool = pool.filter((x) => TIERS.indexOf(x.tier) === top);
  } else pool = FAMILY_TITLES.filter((x) => !seen.has(x.id));
  if (!pool.length) return null;
  const x = pool[fnv(key) % pool.length];
  return { hint: x.hint, tier: x.tier ?? null };
}
function clueRow(box, clue, head = 'คำใบ้ฉายา') {
  if (!clue) return;
  box.append(el('div', 'h', head));
  box.append(el('p', 'note clue', `??? ${clue.tier ? `· ${clue.tier} ` : ''}— ${clue.hint}`));
}

// สมุดฉายา (ใบ 04): เก็บในเครื่องผู้เล่น · ตัวที่ยังไม่เคยได้เป็น ??? พร้อมคำใบ้
// อ่าน/เขียนพังได้ (โหมดส่วนตัว · ปิด storage) — หน้ายังเล่นได้ สมุดแค่ไม่จำ
const BOOK_KEY = 'next-life-book-v1';
function bookRead() {
  try {
    const b = JSON.parse(localStorage.getItem(BOOK_KEY) ?? '{}');
    return { p: b.p ?? [], t: b.t ?? [], f: b.f ?? [], n: Array.isArray(b.n) ? b.n : [] };
  } catch {
    return { p: [], t: [], f: [], n: [] };
  }
}
function bookWrite(b) {
  try {
    localStorage.setItem(BOOK_KEY, JSON.stringify(b));
  } catch {
    // ไม่มีที่เก็บ — สมุดเห็นแค่ชีวิตนี้
  }
}
// n = รายการที่เพิ่งเปิดแต่ผู้เล่นยังไม่ได้ดู (จุดแดง B116) · id ฉายากับชีวิตแบบคนละกลุ่มกัน จึงติดหัวกลุ่มกันชนชื่อ
const newKey = (group, id) => `${group}:${id}`;
function titleBookAdd(t) {
  const b = bookRead();
  const add = (group, xs, id) => {
    if (xs.includes(id)) return xs;
    b.n.push(newKey(group, id));
    return [...xs, id];
  };
  if (t.pattern) b.p = add('p', b.p, t.pattern.id);
  for (const x of t.titles) b.t = add('t', b.t, x.id);
  for (const x of t.family) b.f = add('f', b.f, x.id);
  bookWrite(b);
}
function bookSeen(keys = null) {
  const b = bookRead();
  b.n = keys ? b.n.filter((k) => !keys.includes(k)) : [];
  bookWrite(b);
}
function newDot(label) {
  const d = el('span', 'new-dot');
  d.append(el('span', 'sr', label));
  return d;
}
const newTag = () => el('span', 'new-tag', 'ใหม่');
const BOOK_ALL = ALL_PATTERNS.length + TITLES.length + FAMILY_TITLES.length;
const bookGot = (b) => b.p.length + b.t.length + b.f.length;

// แถบความคืบหน้าในชั้นสมุด — ตัวเลข x/y อยู่ในหัวข้อแล้ว แถบจึงซ่อนจากโปรแกรมอ่านจอ
function shelfBar(got, all) {
  const b = el('div', 'bk-bar');
  b.setAttribute('aria-hidden', 'true');
  const i = el('i');
  i.style.width = `${all ? Math.round((got / all) * 100) : 0}%`;
  b.append(i);
  return b;
}
function shelfSec(title, got, all, intro) {
  const s = el('section', 'bk-sec');
  const h = el('div', 'h', title);
  h.append(el('small', null, `${got}/${all}`));
  s.append(h, shelfBar(got, all));
  if (intro) s.append(el('p', 'bk-intro', intro));
  return s;
}

// แท็บฉายาของชั้นสมุด (B130): สะสมทุกชีวิต · ตัวที่ยังไม่เคยได้เป็น ??? พร้อมคำใบ้ · ป้าย "ใหม่" อ่านจากภาพตอนเปิดชั้น
function titleShelf(body, fresh) {
  const b = bookRead();
  body.append(el('p', 'bk-intro', `สะสมจากทุกชีวิตที่เคยเล่น · เปิดแล้ว ${bookGot(b)}/${BOOK_ALL} · ตัวที่ยังไม่ได้เป็น ??? พร้อมคำใบ้`));
  shelfTitleArt(body, [
    { label: 'แบบชีวิต', groups: [{ key: 'p', items: ALL_PATTERNS, got: b.p }] },
    { label: 'ฉายาประจำตัว', groups: TIERS.map((tier, i) => ({ key: 't', items: TITLES.filter((x) => x.tier === tier), got: b.t, gold2: i === 0 })) },
    { label: 'ฉายาตระกูล', groups: [{ key: 'f', items: FAMILY_TITLES, got: b.f }] },
  ], fresh, bookGot(b), BOOK_ALL);
  const rows = (group, items, got) => {
    const ul = el('ul', 'bk-list');
    for (const x of items) {
      const li = el('li', got.includes(x.id) ? 'got' : 'lock');
      if (got.includes(x.id)) li.textContent = x.name;
      else li.append(el('b', null, '???'), x.hint);
      if (fresh.includes(newKey(group, x.id))) li.append(newTag());
      ul.append(li);
    }
    return ul;
  };
  const s1 = shelfSec('แบบชีวิต', b.p.length, ALL_PATTERNS.length, 'ทางที่ชีวิตหนึ่งเดินจนจบ — ชีวิตละ 1 แบบ');
  s1.append(rows('p', ALL_PATTERNS, b.p));
  const s2 = shelfSec('ฉายาประจำตัว', b.t.length, TITLES.length, 'ได้จากสิ่งที่ทำในชีวิตเดียว — ชีวิตหนึ่งได้หลายฉายา');
  for (const tier of TIERS) {
    const xs = TITLES.filter((x) => x.tier === tier);
    s2.append(el('div', 'bk-tier', `${tier} · ${xs.filter((x) => b.t.includes(x.id)).length}/${xs.length}`), rows('t', xs, b.t));
  }
  const s3 = shelfSec('ฉายาตระกูล', b.f.length, FAMILY_TITLES.length, 'ได้จากหลายรุ่นต่อกันในตระกูลเดียว');
  s3.append(rows('f', FAMILY_TITLES, b.f));
  body.append(s1, s2, s3);
  bookSeen();
}

// สมุดอนุสรณ์ (B51): สรุปชีวิตที่จบแล้วข้ามการเล่น · key แยกจากเซฟ ล้างตระกูลแล้วยังอยู่
// ไม่จำกัดจำนวน (คำตัดสินเจ้าของ) จึงเก็บแค่สรุปสั้น · ที่เก็บเต็มต้องบอกผู้เล่นให้ลบเอง ห้ามลบเงียบ
const MEMO_KEY = 'next-life-memorial-v1';
const ERA_EVENTS = CONTENT.era.events;
// การ์ดทวีป (06c-2) มากับเนื้อหา ไม่อยู่ในแกน — ต่อเข้ากองก่อนเริ่ม/โหลดเซฟชาติต่างโลก
useIsekaiCards(CONTENT.isekai);
// การ์ดรับมือที่รวมข่าวบ้านเมือง (B58) ไม่มีการ์ดบ้านเมืองแยก — หาเหตุการณ์จากการ์ดเนื้อหาที่ผูกไว้
const ERA_OF = new Map(CONTENT.events.filter((c) => c.era).map((c) => [c.id, c.era]));
// ภาพฉากสำคัญ (ui-redo 31): การ์ดจริงที่ผูกภาพ — แต่งงาน = การ์ดที่ตั้งธง married · มีลูก = การ์ดที่ตั้งธง has_kids · เกษียณ = การ์ดอายุ 60 + โครงการเกษียณก่อนกำหนด
// แรกเกิดเลือกตามฐานะบ้าน (ชุดเดียวกับรูปตัวละคร) · การ์ดตาย/หายตัวผูกในหน้าการ์ดตาย · การ์ดอื่นไม่มีภาพ หน้าตาเดิม
const SCENE_OF = new Map([['young_wedding_01', 'wed_ask'], ['remarry_wedding_work_01', 'wed_rite'], ['remarry_wedding_mid_01', 'wed_rite'], ['remarry_wedding_old_01', 'wed_rite'], ['young_baby_01', 'baby_news'], ['work_house_01', 'baby_home'], ['retirement', 'retire_home'], ['early_retire', 'retire_early']]);
const BIRTH_SCENE = ['birth_poor', 'birth_mid', 'birth_rich'];
// ภาพเล็ก (sm) บนการ์ดแรกเกิด/การ์ดตาย: ปุ่มไปต่อยังอยู่จอแรก 390 · data-scene ให้ด่านจอหาเจอ
function sceneSvg(id, sm) {
  const s = sceneArt(id);
  if (!s) return null;
  const svg = artSvg(`era-art scene-art${sm ? ' scene-sm' : ''}`, ERA_ART_W, ERA_ART_H, s.parts);
  svg.dataset.scene = id;
  return svg;
}
// ภาพฉากใบมรณะเป็นพื้นหลังจางทั้งใบ (ui-redo 57): รูปทรงเดิมตัดกรอบแผ่นออก สีเส้นมาจาก CSS — แผ่นทึบกับกรอบทองจะกลายเป็นแถบเทาทับข้อความ
function sceneBg(id) {
  const s = sceneArt(id);
  if (!s) return null;
  const wrap = el('div', 'd-bg');
  wrap.setAttribute('aria-hidden', 'true');
  const svg = artSvg('scene-art', ERA_ART_W, ERA_ART_H, s.parts.slice(ERA_FRAME.length));
  svg.dataset.scene = id;
  wrap.append(svg);
  return wrap;
}
const eraName = (id) => ERA_EVENTS.find((e) => e.id === id)?.name ?? id;
function memoRead() {
  try {
    const m = JSON.parse(localStorage.getItem(MEMO_KEY) ?? '{}');
    return { l: Array.isArray(m.l) ? m.l : [], e: Array.isArray(m.e) ? m.e : [] };
  } catch {
    return { l: [], e: [] };
  }
}
// 'ok' · 'full' (ที่เก็บเต็ม ผู้เล่นต้องรู้) · 'off' (ไม่มีที่เก็บ เกมเล่นต่อได้เงียบ ๆ)
function memoWrite(m) {
  try {
    localStorage.setItem(MEMO_KEY, JSON.stringify(m));
    return 'ok';
  } catch (e) {
    return e?.name === 'QuotaExceededError' || e?.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e?.code === 22 ? 'full' : 'off';
  }
}
// เรียกครั้งเดียวต่อการ์ดตาย · รีโหลดที่มรณบัตรแล้ววาดซ้ำ — key ตระกูล:รุ่น กันชีวิตเดียวลงสองแถว
function memoAdd(t) {
  const m = memoRead();
  const k = `${save.seed}:${st.gen}`;
  if (m.l.some((x) => x.k === k)) return 'ok';
  m.l.push({ k, n: st.name, r: fullName(), g: st.gen, a: st.age, p: provinceLabel(st), s: t.pattern?.name ?? '', t: t.titles[0]?.name ?? '' });
  for (const x of eraSeen) if (!m.e.includes(x.id)) m.e.push(x.id);
  const r = memoWrite(m);
  shelfDot();
  return r;
}
// แถวสมุดอนุสรณ์ที่ผู้เล่นเปิดดูแล้ว (จุดแดงที่ลิงก์ท้ายหน้า B116) — key แยก รูปเก็บของสมุดเดิมไม่เปลี่ยน
const MEMO_SEEN_KEY = 'next-life-memorial-seen-v1';
function memoSeenRead() {
  try {
    const s = JSON.parse(localStorage.getItem(MEMO_SEEN_KEY));
    return Array.isArray(s) ? s : null;
  } catch {
    return null;
  }
}
function memoSeenWrite(ks) {
  try {
    localStorage.setItem(MEMO_SEEN_KEY, JSON.stringify(ks));
  } catch {
    // ไม่มีที่เก็บ — ไม่มีจุดแดง
  }
}
function memoUnseen() {
  const ks = memoRead().l.map((x) => x.k);
  let seen = memoSeenRead();
  // ผู้เล่นที่มีสมุดอยู่ก่อนมีจุดแดง: ของเดิมถือว่าเห็นแล้ว ไม่งั้นจุดขึ้นทั้งที่ไม่มีอะไรใหม่
  if (!seen) memoSeenWrite((seen = ks));
  return ks.filter((k) => !seen.includes(k));
}
// สมุดภาพบ้านเมือง (B130): ภาพหลักของเหตุการณ์ (e) + ภาพตามวัย/ตามมา (s = "เหตุการณ์:ช่อง") สะสมข้ามชีวิต
// key แยกจากสมุดอนุสรณ์ เพราะ "ลบสมุดอนุสรณ์ทั้งเล่ม" ล้างเหตุการณ์ที่เคยเห็นด้วย · อ่านครั้งแรกสำเนาเหตุการณ์จากสมุดอนุสรณ์
// ผู้เล่นเดิมจึงได้ภาพหลักย้อนหลัง · n = ภาพที่เพิ่งได้แต่ยังไม่เปิดดู (จุดแดงแบบสมุดฉายา)
const PICS_KEY = 'next-life-pics-v1';
// วิกฤตน้ำมันครั้งแรกเกิดก่อนปีเกิดแรกสุดของเกม ไม่มีชีวิตไหนทันเห็น — ไม่ตั้งช่องที่ปลดไม่ได้ตลอดกาล
const PIC_EVENTS = ERA_EVENTS.filter((e) => ERA_PICS[e.id]);
const PIC_ALL = PIC_EVENTS.reduce((n, e) => n + 1 + ERA_PICS[e.id].length, 0);
// การ์ดตามมาของเหตุการณ์ไม่มีช่อง era ในเนื้อหา จึงผูกด้วย id การ์ด · การ์ดยุคใช้ช่วงวัยของการ์ดเป็นช่อง
const PIC_FOLLOW = { era_econ_oil2_farm_01: 'oil_crisis_2', era_dis_tsunami_land_offer_01: 'tsunami', era_econ_gfc_cafe_01: 'global_financial_crisis', era_dis_covid_shop_boom_01: 'covid19' };
const PIC_STAGE = { เด็ก: 'kid', ชรา: 'old' };
const PIC_OF = new Map(
  CONTENT.events
    .map((c) => [c.id, c.era ? `${c.era}:${PIC_STAGE[c.stage] ?? 'adult'}` : PIC_FOLLOW[c.id] && `${PIC_FOLLOW[c.id]}:sp`])
    .filter(([, k]) => k && ERA_PICS[k.split(':')[0]]?.some(([s]) => s === k.split(':')[1])),
);
function picsRead() {
  try {
    const raw = localStorage.getItem(PICS_KEY);
    if (raw === null) {
      const p = { e: memoRead().e.filter((id) => ERA_PICS[id]), s: [], n: [] };
      picsWrite(p);
      return p;
    }
    const p = JSON.parse(raw) ?? {};
    return { e: Array.isArray(p.e) ? p.e : [], s: Array.isArray(p.s) ? p.s : [], n: Array.isArray(p.n) ? p.n : [] };
  } catch {
    return { e: [], s: [], n: [] };
  }
}
function picsWrite(p) {
  try {
    localStorage.setItem(PICS_KEY, JSON.stringify(p));
  } catch {
    // ไม่มีที่เก็บ — สมุดภาพเห็นแค่ชีวิตนี้
  }
}
const picsGot = (p) => PIC_EVENTS.reduce((n, e) => n + (p.e.includes(e.id) ? 1 : 0) + ERA_PICS[e.id].filter(([k]) => p.s.includes(`${e.id}:${k}`)).length, 0);
// เรียกครั้งเดียวต่อการ์ดตาย (lifeTitles) · ภาพที่ชีวิตนี้เพิ่งได้ = ป้าย "ใหม่" ในแผงเหตุการณ์ของการ์ดตาย
function picsAdd() {
  const p = picsRead();
  for (const k of picSeen) {
    const [kind, id] = [k.slice(0, 1), k.slice(2)];
    const xs = kind === 'e' ? p.e : p.s;
    if (xs.includes(id)) continue;
    xs.push(id);
    p.n.push(k);
  }
  picsWrite(p);
}
function picsSeen() {
  const p = picsRead();
  p.n = [];
  picsWrite(p);
}

// สมุดสกิล (06s): สกิลที่ดวงวิญญาณเคยได้ สะสมข้ามชีวิตแบบสมุดฉายา · ไม่อยู่ในเซฟ (ล้างตระกูลแล้วยังอยู่)
// s = { id: ขั้นสูงสุดที่เคยถึง } คำนวณด้วย skillBookAdd ของแกน · e = การ์ดที่ลงสมุดไปแล้ว — รีโหลดกลับมาที่การ์ดเดิม ลงซ้ำ = ขั้นขึ้นฟรี
// n = สกิลที่เพิ่งลงแต่ยังไม่เปิดดู (จุดแดงแบบสมุดฉายา)
const SKILLS_KEY = 'next-life-skills-v1';
const SKILL_IDS = Object.keys(ISEKAI_SKILLS);
const SKILLS_EARN_MAX = 200;
function skillsRead() {
  try {
    const k = JSON.parse(localStorage.getItem(SKILLS_KEY) ?? '{}') ?? {};
    const s = Object.fromEntries(Object.entries(k.s ?? {}).filter(([id, lv]) => ISEKAI_SKILLS[id] && Number.isInteger(lv) && lv > 0).map(([id, lv]) => [id, Math.min(SKILL.top, lv)]));
    return { s, e: Array.isArray(k.e) ? k.e : [], n: Array.isArray(k.n) ? k.n.filter((id) => s[id]) : [] };
  } catch {
    return { s: {}, e: [], n: [] };
  }
}
function skillsWrite(k) {
  try {
    localStorage.setItem(SKILLS_KEY, JSON.stringify(k));
  } catch {
    // ไม่มีที่เก็บ — สมุดสกิลไม่จำ ชาติหน้าจึงไม่มีอะไรให้พก
  }
}
// ลงสมุด 1 อย่างต่อการ์ด · การ์ดนี้ลงไปแล้ว = null
function skillsEarn(key, id, lv) {
  const k = skillsRead();
  if (k.e.includes(key)) return null;
  const was = k.s[id] ?? 0;
  k.s = skillBookAdd(k.s, id, lv).book;
  k.e = [...k.e, key].slice(-SKILLS_EARN_MAX);
  if (!k.n.includes(id)) k.n.push(id);
  skillsWrite(k);
  shelfDot();
  return { was, lv: k.s[id] };
}
function skillsSeen() {
  const k = skillsRead();
  k.n = [];
  skillsWrite(k);
}
const skillsGot = (k) => Object.keys(k.s).length;
// คำใบ้ของ ??? บอกชนิดแหล่งที่ได้ ไม่บอกชื่อ — ชี้ทางแบบคำใบ้ฉายา · ทุกสกิลเป็นของขวัญเทพธิดาในต่างโลกได้
const SKILL_SRC = { job: 'อาชีพ', title: 'ฉายา', pattern: 'แบบชีวิต', cause: 'วิธีจากไป', goal: 'เป้าตระกูล', focus: 'สิ่งที่ทุ่มเท', lifeGoal: 'เป้าชีวิต' };
function skillHint(id) {
  const kinds = Object.entries(CONTENT.skillMap ?? {}).filter(([, m]) => Object.values(m).some((xs) => xs.includes(id))).map(([k]) => SKILL_SRC[k]).filter(Boolean);
  return kinds.length ? `ของขวัญเทพธิดาในต่างโลก หรือชีวิตไทยที่มี${kinds.join('/')}ที่ใช่` : 'ของขวัญเทพธิดาในต่างโลก';
}

// หน้า "เคยจากไปแบบนี้" (doom-1): สาเหตุตายที่เคยเจอ สะสมข้ามชีวิต · key ใหม่เพราะสมุดอนุสรณ์ไม่เคยเก็บสาเหตุ ⇒ นับจากชีวิตหลังอัปเดต
// ไม่ชวนตามหาทางตาย: ไม่มีช่อง ??? ไม่มีจำนวนเต็ม ไม่มีจุดแดง · ลงเฉพาะสาเหตุที่การ์ดตายบอกผู้เล่น
// (หายตัว · ไม่ทราบเหตุก่อนชรา ไม่บอก) และทำร้ายตัวเองไม่ลงแม้วันหนึ่งการ์ดจะบอก
const DEATH_KEY = 'next-life-deaths-v1';
const DEATH_GROUPS = [
  ['ร่างกาย', ['newborn', 'infection', 'pneumonia', 'heart', 'stroke', 'cancer', 'diabetes_kidney', 'liver', 'chronic_resp']],
  ['อุบัติเหตุ', ['road', 'accident']],
  ['อื่น ๆ', null],
];
function deathRead() {
  try {
    const d = JSON.parse(localStorage.getItem(DEATH_KEY) ?? '{}') ?? {};
    return { c: Array.isArray(d.c) ? d.c.filter((k) => typeof k === 'string') : [] };
  } catch {
    return { c: [] };
  }
}
function deathWrite(d) {
  try {
    localStorage.setItem(DEATH_KEY, JSON.stringify(d));
  } catch {
    // ไม่มีที่เก็บ — หน้านี้ว่าง เกมเล่นต่อได้
  }
}
// เรียกครั้งเดียวต่อการ์ดตาย (lifeTitles) · สาเหตุซ้ำไม่เพิ่มแถว
function deathAdd(card) {
  if (card.cause === 'self_harm' || !causeOf(card.cause, card.age)) return;
  const d = deathRead();
  if (d.c.includes(card.cause)) return;
  d.c.push(card.cause);
  deathWrite(d);
}

// จุดแดงที่ทางเข้าชั้นสมุด (B116 → B130): ชีวิตใหม่ในสมุดอนุสรณ์ · ฉายาใหม่ · ภาพใหม่ ที่ยังไม่เปิดดู
// ลิงก์ท้ายหน้าซ่อนในฉากที่มีเมนู แต่ยังเป็นทางเข้าของต่างโลก/ปรโลก ⇒ ติดจุดทั้งสองที่ · หน้าเคยจากไปไม่มีจุด (d ว่างเสมอ)
const shelfFresh = () => ({ m: memoUnseen(), t: bookRead().n, p: picsRead().n, k: skillsRead().n, d: [] });
function shelfDot() {
  const f = shelfFresh();
  const n = f.m.length + f.t.length + f.p.length + f.k.length + f.d.length;
  for (const a of document.querySelectorAll('#shelfLink, .mnav [data-menu="shelf"]')) {
    a.querySelector('.new-dot')?.remove();
    if (n) a.append(newDot(`มีของใหม่ในชั้นสมุด ${n}`));
  }
}
// ปุ่มเปิดชั้นสมุดจากการ์ดตาย — กลับมาแล้วคืนการ์ดเดิมทั้งก้อน
function shelfButton(label, tab, onBack) {
  const b = el('button', 'more', label);
  b.onclick = () => openShelf(tab, undefined, onBack);
  return b;
}
function eraBox() {
  const box = el('div', 'recap eras');
  box.append(eraSeen.length ? list(eraSeen.map((x) => `อายุ ${x.a} · ${eraName(x.id)}`), 'picks') : el('p', 'sub', 'ชีวิตนี้ไม่ทันเห็นเหตุการณ์ใหญ่ของบ้านเมือง'));
  // ภาพที่ชีวิตนี้เพิ่งได้ อ่านจากที่เก็บ (แบบจุดฉายา) รีโหลดที่มรณบัตรจึงยังบอกได้
  const fresh = picsRead().n.filter((k) => picSeen.includes(k)).length;
  if (fresh) box.append(el('p', 'note', `ได้ภาพใหม่ในสมุดภาพบ้านเมือง ${fresh} ภาพ`));
  return fold(box, `เหตุการณ์ในแผ่นดินที่ได้เห็น (${eraSeen.length})`, fresh ? `ได้ภาพใหม่ ${fresh}` : null);
}
function memoFull(card) {
  const box = el('div', 'recap warn');
  box.append(el('p', 'sub', 'สมุดอนุสรณ์เต็ม ชีวิตนี้ยังไม่ได้ลงสมุด — ลบชีวิตเก่าในสมุดออกบ้างแล้วกลับมาที่หน้านี้อีกครั้ง'));
  box.append(shelfButton('เปิดสมุดอนุสรณ์', 'm', () => {
    if (card.memo === 'full') card.memoRetry?.();
    if (card.memo !== 'full') box.remove();
  }));
  return box;
}

// ชั้นสมุด (B130): เล่มเดียว 4 แท็บ อนุสรณ์ · ฉายา · ภาพบ้านเมือง · เคยจากไป · เปิดทับหน้าที่อยู่ แล้วคืนหน้าเดิมทั้งก้อนตอนกลับ — ไม่แตะ st ไม่ลงเซฟ
// fresh = ของใหม่ตอนเปิดชั้นครั้งแรก — เปิดแท็บแล้วล้างจุดในที่เก็บ แต่ป้าย "ใหม่" ยังอยู่จนออกจากชั้น สลับแท็บไปมาก็ยังหาเจอ
const SHELF_TABS = [['m', 'อนุสรณ์'], ['t', 'ฉายา'], ['k', 'สกิล'], ['p', 'ภาพบ้านเมือง'], ['d', 'เคยจากไป']];
function openShelf(tab, prev = [...root.childNodes], onBack, fresh = shelfFresh()) {
  // เปิดจากเมนู/ท้ายหน้า/หน้าเล่นต่อ: ไปแท็บที่มีของใหม่ก่อน
  tab ??= SHELF_TABS.find(([k]) => fresh[k].length)?.[0] ?? 'm';
  const again = (t = tab) => openShelf(t, prev, onBack, fresh);
  const back = () => {
    root.replaceChildren(...prev);
    // จุดบนปุ่มเมนูที่คืนมายังเป็นของตอนก่อนเปิด
    shelfDot();
    onBack?.();
  };
  const m = memoRead();
  const b = bookRead();
  const p = picsRead();
  const count = { m: `${m.l.length}`, t: `${bookGot(b)}/${BOOK_ALL}`, p: `${picsGot(p)}/${PIC_ALL}`, k: `${skillsGot(skillsRead())}/${SKILL_IDS.length}`, d: `${deathRead().c.length}` };
  const choices = homeCard('ชั้นสมุด', ['ชั้นสมุด']);
  root.firstChild.classList.add('shelf-view');
  const body = root.querySelector('.body');
  const tabs = el('div', 'bk-tabs');
  tabs.setAttribute('role', 'group');
  tabs.setAttribute('aria-label', 'เล่มในชั้นสมุด');
  for (const [k, label] of SHELF_TABS) {
    const x = el('button', null, `${label} ${count[k]}`);
    x.setAttribute('aria-pressed', String(k === tab));
    // จุดบนแท็บอื่นที่ยังไม่ได้เปิด — แท็บที่เปิดอยู่ล้างจุดแล้ว
    if (k !== tab && shelfFresh()[k].length) x.append(newDot('มีของใหม่'));
    x.onclick = () => again(k);
    tabs.append(x);
  }
  body.append(tabs);
  if (tab === 't') titleShelf(body, fresh.t);
  else if (tab === 'p') picShelf(body, fresh.p);
  else if (tab === 'k') skillShelf(body, fresh.k);
  else if (tab === 'd') deathShelf(body);
  else memoShelf(body, choices, fresh.m, again);
  shelfDot();
  choices.prepend(enter(button('กลับ', null, back)));
}
// แท็บอนุสรณ์: รายชื่อชีวิตที่จบแล้ว ใหม่สุดก่อน · เหตุการณ์ที่เคยเห็นย้ายไปอยู่สมุดภาพแล้ว
function memoShelf(body, choices, fresh, again) {
  const m = memoRead();
  memoSeenWrite(m.l.map((x) => x.k));
  body.append(el('p', 'bk-intro', `ชีวิตที่จบแล้ว ${m.l.length} ชีวิต`));
  shelfMemoArt(body, m.l, fresh, CONTENT.era.birth.regions);
  const ul = el('ul', 'memo');
  // ลบทีละแถวได้ทันที (สรุปสั้น ไม่ใช่เซฟ ไม่ต้องถามซ้ำ)
  for (const x of [...m.l].reverse()) {
    const li = el('li');
    const txt = el('span', null, [`${x.g > 1 ? `รุ่นที่ ${x.g} · ` : ''}${x.r || x.n}`, `อายุ ${x.a} ปี`, x.p, x.s && `ชีวิตแบบ${x.s}`, x.t && `ฉายา ${x.t}`].filter(Boolean).join(' · '));
    if (fresh.includes(x.k)) txt.append(newTag());
    li.append(txt);
    const del = el('button', 'more', 'ลบ');
    del.setAttribute('aria-label', `ลบ ${x.r || x.n} ออกจากสมุด`);
    del.onclick = () => {
      const now = memoRead();
      now.l = now.l.filter((y) => y.k !== x.k);
      memoWrite(now);
      again('m');
    };
    li.append(del);
    ul.append(li);
  }
  body.append(m.l.length ? ul : el('p', 'sub', 'ยังไม่มีชีวิตที่จบลงสมุด'));
  if (!m.l.length && !m.e.length) return;
  choices.append(button('ลบสมุดอนุสรณ์ทั้งเล่ม', null, () => {
    const c = homeCard('ชั้นสมุด', ['ลบสมุดอนุสรณ์ทั้งเล่ม?', 'ชีวิตที่จบแล้วจะหายทั้งหมด กู้คืนไม่ได้ · ฉายา ภาพบ้านเมือง และชีวิตที่เล่นค้างไว้ไม่หาย']);
    root.firstChild.classList.add('shelf-view');
    c.append(button('ลบทั้งเล่ม', null, () => {
      memoWrite({ l: [], e: [] });
      again('m');
    }), enter(button('ยกเลิก', null, () => again('m'))));
  }));
}
// หัวแท็บภาพบ้านเมือง (ui-redo ใบ 41 · แบบ ข ต้นแบบ B176): ภาพย่อต่อเหตุการณ์เรียงตามปี ใช้ภาพเหตุการณ์ตัวเดียวกับรายการข้างล่าง
// เป็น DOM ไม่ใช่ canvas — ช่องตัดแถวเองตามความกว้าง ความสูงตามเนื้อ จอแคบไม่เหลือที่ว่างค้าง · events = ชุดเดียวกับที่ส่งให้ภาพหัวแท็บเดิม
function picStrip(events, got, all) {
  const box = el('div', 'pic-strip');
  box.setAttribute('role', 'img');
  box.setAttribute('aria-label', `ภาพย่อเหตุการณ์บ้านเมืองเรียงตามปี ได้ภาพแล้ว ${got} จาก ${all}`);
  box.dataset.count = JSON.stringify({ got, all, met: events.filter((e) => e.met).length, events: events.length });
  box.append(el('div', 'h', `ภาพบ้านเมืองที่ได้ ${got}/${all}`));
  const row = el('div', 'pic-row');
  for (const ev of [...events].sort((a, b) => a.from - b.from)) {
    const th = el('div', `pic-th${ev.met ? '' : ' lock'}${ev.fresh ? ' fresh' : ''}`);
    const pic = el('div', 'pic');
    if (ev.met) {
      const svg = artSvg('era-art', ERA_ART_W, ERA_ART_H, eraArt(ev.id));
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      pic.append(svg);
    } else pic.append(el('b', null, '???'));
    th.append(pic, el('span', 'n', `${ev.n}/${ev.all}`), el('i', 'dot'), el('span', 'yr', `${ev.from}`));
    row.append(th);
  }
  box.append(row);
  return box;
}

// แท็บภาพบ้านเมือง: เหตุการณ์ละแผ่น ภาพหลักเต็มแถว ภาพตามวัย/ตามมาเป็นช่องเล็ก · ยังไม่เจอ = ??? + ทางปลด
function picShelf(body, fresh) {
  const p = picsRead();
  body.append(el('p', 'bk-intro', `ภาพเหตุการณ์ภัยพิบัติและเศรษฐกิจที่เคยผ่าน สะสมข้ามชีวิต · ได้แล้ว ${picsGot(p)}/${PIC_ALL} ภาพ`), shelfBar(picsGot(p), PIC_ALL));
  body.append(picStrip(PIC_EVENTS.map((e) => {
    const slots = ERA_PICS[e.id];
    const met = p.e.includes(e.id);
    return { id: e.id, name: e.name, kind: e.kind, from: e.from, to: e.to, met, all: 1 + slots.length, n: (met ? 1 : 0) + slots.filter(([k]) => p.s.includes(`${e.id}:${k}`)).length, fresh: fresh.some((k) => k === `e:${e.id}` || k.startsWith(`s:${e.id}:`)) };
  }), picsGot(p), PIC_ALL));
  for (const e of PIC_EVENTS) {
    const s = el('section', 'pic-ev');
    const met = p.e.includes(e.id);
    const slots = ERA_PICS[e.id];
    const n = (met ? 1 : 0) + slots.filter(([k]) => p.s.includes(`${e.id}:${k}`)).length;
    const h = el('div', 'h', met ? e.name : '???');
    if (met && fresh.includes(`e:${e.id}`)) h.firstChild.after(newTag());
    h.append(el('small', null, `${n}/${1 + slots.length}`));
    s.append(h, el('div', 'yr', `${e.kind === 'economy' ? 'เศรษฐกิจ' : 'ภัยพิบัติ'} · พ.ศ. ${e.from}${e.to !== e.from ? `–${e.to}` : ''}`));
    const grid = el('div', 'pic-slots');
    const main = el('div', `pic-slot main${met ? '' : ' lock'}`);
    if (met) main.append(artSvg('era-art', ERA_ART_W, ERA_ART_H, eraArt(e.id)));
    else main.append(el('b', null, '???'), el('span', null, 'ยังไม่เคยมีชีวิตไหนทันเห็น'));
    grid.append(main);
    for (const [k, label, cap] of slots) {
      const key = `${e.id}:${k}`;
      const ok = p.s.includes(key);
      const slot = el('figure', `pic-slot${ok ? '' : ' lock'}`);
      if (ok) {
        const svg = artSvg('era-art', ERA_ART_W, ERA_ART_H, eraPicArt(e.id, k));
        svg.removeAttribute('aria-hidden');
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', cap);
        slot.append(svg);
        const fc = el('figcaption', null, `${label} · ${cap}`);
        if (fresh.includes(`s:${key}`)) fc.append(newTag());
        slot.append(fc);
      } else {
        slot.append(el('b', null, '???'), el('span', null, k === 'sp' ? 'เจอเรื่องพิเศษของเหตุการณ์นี้' : `เจอเหตุการณ์นี้ตอน${label}`));
      }
      grid.append(slot);
    }
    s.append(grid);
    body.append(s);
  }
  picsSeen();
}
// แท็บสมุดสกิล (06s): ขั้นในสมุด = ขั้นสูงสุดที่เคยถึง · ยังไม่เคยได้ = ??? + คำใบ้แหล่ง
function skillShelf(body, fresh) {
  const k = skillsRead();
  body.append(el('p', 'bk-intro', `สกิลที่ดวงวิญญาณนี้เคยได้ สะสมข้ามชีวิต · ได้แล้ว ${skillsGot(k)}/${SKILL_IDS.length} · ก่อนไปเกิดเลือกพกได้ ${SKILL.carry} อย่าง ทุกอย่างเริ่มขั้น 1 แต่ฝึกถึงขั้นในสมุดได้เร็วกว่าครั้งแรก`), shelfBar(skillsGot(k), SKILL_IDS.length));
  const ul = el('ul', 'bk-list');
  for (const id of SKILL_IDS) {
    const x = ISEKAI_SKILLS[id];
    const lv = k.s[id];
    const li = el('li', lv ? 'got' : 'lock');
    if (lv) li.append(el('b', null, `${x.name} · ขั้น ${lv}`), ` — ${x.desc}`);
    else li.append(el('b', null, '???'), skillHint(id));
    if (fresh.includes(id)) li.append(newTag());
    ul.append(li);
  }
  body.append(ul);
  skillsSeen();
}

// แท็บเคยจากไป: หมวดละกล่อง เฉพาะสาเหตุที่เคยเจอ · หมวดที่ยังไม่เจอไม่ขึ้น · วัยชรา (other) ได้ป้ายจากอายุสุดท้ายของตาราง
function deathShelf(body) {
  const { c } = deathRead();
  body.append(el('p', 'bk-intro', 'ทางที่ชีวิตก่อน ๆ ในเครื่องนี้เคยจากไป สะสมข้ามชีวิต · สาเหตุเดิมไม่ลงซ้ำ'));
  const known = DEATH_GROUPS.flatMap(([, ks]) => ks ?? []);
  let shown = 0;
  for (const [name, keys] of DEATH_GROUPS) {
    const words = (keys ?? c.filter((k) => !known.includes(k))).filter((k) => c.includes(k)).map((k) => causeWords(k, MAX_AGE)).filter(Boolean);
    if (!words.length) continue;
    const s = el('section', 'bk-sec');
    s.append(el('div', 'h', name));
    const ul = el('ul', 'bk-list');
    for (const w of words) ul.append(el('li', 'got', `จากไป${w.join('')}`));
    s.append(ul);
    body.append(s);
    shown += words.length;
  }
  if (!shown) body.append(el('p', 'sub', 'ยังไม่มีชีวิตที่จากไปลงหน้านี้'));
}

// ภาพแชร์รับเฉพาะช่องที่ไล่ชื่อไว้ตรงนี้ — บัญชีบุญบาปบนการ์ดตายหลุดลงภาพไม่ได้ แม้แกนเกมจะเติมช่องใหม่ให้การ์ด
function shareFacts(card) {
  const { pattern, titles } = lifeTitles(card);
  return {
    age: card.age,
    name: st.name,
    who: `${st.sex} · ${provinceLabel(st)} · ฐานะ${classNow(st)}`,
    job: `${card.job}${st.edu ? ` · วุฒิ${st.edu}` : ''}`,
    pattern: { name: pattern.name, hint: pattern.hint ?? '' },
    title: titles[0] ? { name: titles[0].name, tier: titles[0].tier } : null,
    avatar: avatarParts(card.age),
    // ชาติประจำวันกำหนดแค่ชีวิตแรก · ลิงก์เพื่อนไม่ใส่ป้ายบนภาพ (การ์ดตายบอกอยู่แล้ว)
    day: st.gen === 1 && save.from?.day ? save.from.day : null,
  };
}

// สรุปเป็นข้อความ (B38) — การ์ดตายยังไม่รู้ภพ (รู้ = เผยทิศบัญชีก่อนปรโลก) · การ์ดปรโลกส่ง realm มาเพิ่มบรรทัด
function summaryText(age, realm = null) {
  const t = titlesOf(st);
  return [
    `${GAME_NAME} · ${st.name}`,
    `เกิดปี ${st.birthYear} · ${provinceLabel(st)}`,
    `${lifeEndWord(isGone(st))} ${age}`,
    `ชีวิตแบบ${t.pattern.name}`,
    t.titles[0] ? `ฉายา ${t.titles[0].name} (${t.titles[0].tier})` : 'ยังไม่ได้ฉายา',
    realm && `ไปภูมิ${realm}`,
    `https://${SHARE_URL}`,
  ].filter(Boolean).join('\n');
}

// clipboard API ใช้ไม่ได้บนไฟล์ในเครื่อง/เบราว์เซอร์เก่า — ถอยไปเลือกข้อความใน textarea แล้วสั่งคัดลอก
async function copyText(s) {
  try {
    await navigator.clipboard.writeText(s);
    return true;
  } catch {
    const ta = el('textarea');
    ta.value = s;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.append(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}
function inviteButton() {
  const b = button('ชวนเพื่อนเกิดชีวิตเดียวกัน', null, async () => {
    b.firstChild.textContent = (await copyText(inviteUrl())) ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกไม่ได้';
  });
  return b;
}
function copyButton(text) {
  const b = button(BTN.copy, null, async () => {
    b.firstChild.textContent = (await copyText(text())) ? 'คัดลอกแล้ว' : 'คัดลอกไม่ได้';
  });
  return b;
}

// URL คงที่ ไม่ใช้ location.href — เปิดจากไฟล์ในเครื่องแล้ว path ในเครื่องจะติดไปกับภาพ
const SHARE_URL = 'dmo-hub.github.io/next-life';
// 9:16 (สตอรี่)
const SHARE_W = 1080, SHARE_H = 1920;
// ช่วงที่ก้อนข้อความจัดกลาง: ใต้กรอบบน ถึงเหนือบรรทัด URL ท้ายภาพ
const SHARE_TOP = 80, SHARE_BOTTOM = SHARE_H - 140;
const SHARE_FONTS = ['700 110px Srisakdi', '400 40px Sarabun', '600 30px Sarabun'];
const FONT_WAIT_MS = 3000;

// ไทยไม่เว้นวรรคระหว่างคำ ตัดบรรทัดตามขอบเขตคำจาก Intl.Segmenter · เบราว์เซอร์ที่ไม่มีตัดรายพยัญชนะ
// โดยพาสระตาม (ะ า อำ) สระบน/ล่าง/วรรณยุกต์ และสระหน้า (เ แ โ ใ ไ) ติดพยัญชนะ — ตัดรายตัวอักษรตรง ๆ ได้สระลอยต้นบรรทัด
const THAI_CLUSTER = /[\u0E40-\u0E44]?.[\u0E30-\u0E3A\u0E45\u0E47-\u0E4E]*/gsu;
function wrapThai(ctx, text, maxW) {
  const parts = typeof Intl.Segmenter === 'function'
    ? [...new Intl.Segmenter('th', { granularity: 'word' }).segment(text)].map((s) => s.segment)
    : text.match(THAI_CLUSTER) ?? [];
  const lines = [];
  let line = '';
  for (const p of parts) {
    if (line && ctx.measureText(line + p).width > maxW) {
      lines.push(line.trimEnd());
      line = p.trimStart();
    } else line += p;
  }
  if (line) lines.push(line);
  return lines;
}

async function shareBlob(facts) {
  // ฟอนต์เว็บต้องโหลดก่อนวาด ไม่งั้น canvas ใช้ฟอนต์สำรอง · เน็ตช้าเกินรอวาดด้วยฟอนต์สำรองไปเลย
  // ข้อความตัวอย่างต้องครอบทั้ง subset ไทยและละติน — load() โหลดเฉพาะ subset ที่ตัวอย่างใช้ ตัวเลข/อังกฤษจะตกฟอนต์สำรอง
  if (document.fonts) {
    await Promise.race([
      Promise.all(SHARE_FONTS.map((f) => document.fonts.load(f, `${GAME_NAME} NEXT LIFE 0123456789?`))),
      new Promise((r) => setTimeout(r, FONT_WAIT_MS)),
    ]).catch(() => {});
  }
  const cv = document.createElement('canvas');
  cv.width = SHARE_W;
  cv.height = SHARE_H;
  const ctx = cv.getContext('2d');
  const css = getComputedStyle(document.documentElement);
  const c = (k) => css.getPropertyValue(`--${k}`).trim();
  const cx = SHARE_W / 2, maxW = SHARE_W - 200;

  ctx.fillStyle = c('lacquer');
  ctx.fillRect(0, 0, SHARE_W, SHARE_H);
  ctx.strokeStyle = c('gold');
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, SHARE_W - 80, SHARE_H - 80);
  ctx.strokeStyle = c('bronze2');
  ctx.lineWidth = 1.5;
  ctx.strokeRect(56, 56, SHARE_W - 112, SHARE_H - 112);
  ctx.fillStyle = c('gold');
  for (const [x, y] of [[40, 40], [SHARE_W - 40, 40], [40, SHARE_H - 40], [SHARE_W - 40, SHARE_H - 40]]) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-11, -11, 22, 22);
    ctx.restore();
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  let y = 0;
  // วางสองรอบ: รอบแรกไม่วาด แค่วัดความสูงทั้งก้อน แล้ววาดจริงให้ก้อนอยู่กลางแนวตั้ง — ชีวิตที่ไม่มีฉายาจะได้ไม่เหลือที่ว่างกองอยู่ล่างภาพ
  let draw = false;
  // ข้อความยาวกว่ากรอบ (ชื่อ/ฉายายาว · คำเดียวยาวเกินบรรทัด) ย่อฟอนต์ลงทีละขั้นจนได้ไม่เกิน maxLines และไม่มีบรรทัดล้น
  // ถึงขั้นต่ำแล้วยังไม่พอก็วาดที่ขั้นต่ำ — ดีกว่าตัดข้อความทิ้ง
  const text = (s, font, color, lineH, gap = 0, maxLines = 2) => {
    const px = Number(font.match(/(\d+)px/)[1]);
    let k = 1, lines;
    for (;; k -= 0.05) {
      ctx.font = font.replace(/\d+px/, `${Math.round(px * k)}px`);
      lines = wrapThai(ctx, s, maxW);
      if (k <= 0.6 || (lines.length <= maxLines && lines.every((l) => ctx.measureText(l).width <= maxW))) break;
    }
    ctx.fillStyle = color;
    for (const line of lines) {
      y += lineH * k;
      if (draw) ctx.fillText(line, cx, y);
    }
    y += gap;
  };
  const rule = (gap) => {
    y += gap;
    if (!draw) return void (y += gap);
    ctx.strokeStyle = c('bronze');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 180, y);
    ctx.lineTo(cx + 180, y);
    ctx.stroke();
    y += gap;
  };

  const layout = () => {
    // ชื่อยาวแตกสองบรรทัดตรงช่องว่าง — ให้ย่อบรรทัดเดียวจะเล็กจนอ่านยากบนภาพแนวตั้ง
    for (const part of GAME_NAME.split(' ')) text(part, '700 84px Srisakdi, serif', c('gold'), 96, 0, 1);
    text('NEXT LIFE', '600 28px Sarabun, sans-serif', c('sand'), 44, 0, 1);
    // ใต้ชื่อเกม = เห็นก่อนเนื้อชีวิต คนที่เห็นภาพรู้ว่าเกิดชีวิตเดียวกันได้วันนี้
    if (facts.day) {
      y += 18;
      text(`ชาติประจำวัน ${facts.day}`, '600 46px Sarabun, sans-serif', c('gold2'), 60, 28, 1);
    }
    // รูปวัยสุดท้ายนั่งกลางเส้นคั่นแรก (B56) — ไม่กินที่เพิ่ม
    rule(44);
    if (draw) {
      ctx.fillStyle = c('lacquer');
      ctx.fillRect(cx - 54, y - 44 - 6, 108, 12);
      artDraw(ctx, facts.avatar, cx - 42, y - 44 - 42, 84);
    }
    text(facts.name, '700 72px Srisakdi, serif', c('cream'), 84, 4, 1);
    text(`${lifeEndWord(isGone(st))} ${facts.age}`, '700 96px Srisakdi, serif', c('gold2'), 110, 16, 1);
    text(facts.who, '400 40px Sarabun, sans-serif', c('cream'), 58);
    text(facts.job, '400 36px Sarabun, sans-serif', c('sand'), 52);
    rule(44);
    text('ชีวิตแบบ', '600 30px Sarabun, sans-serif', c('gold'), 44, 0, 1);
    text(facts.pattern.name, '700 76px Srisakdi, serif', c('gold2'), 92, 0, 1);
    if (facts.pattern.hint) text(facts.pattern.hint, '400 32px Sarabun, sans-serif', c('sand'), 48, 0, 3);
    if (facts.title) {
      y += 36;
      text('ฉายาหายากที่สุด', '600 30px Sarabun, sans-serif', c('gold'), 44, 0, 1);
      text(facts.title.name, '700 68px Srisakdi, serif', c('gold2'), 84, 0, 1);
      text(facts.title.tier, '400 32px Sarabun, sans-serif', c('sand'), 48, 0, 1);
    }
  };
  layout();
  y = SHARE_TOP + Math.max(0, (SHARE_BOTTOM - SHARE_TOP - y) / 2);
  draw = true;
  layout();
  ctx.font = '400 30px Sarabun, sans-serif';
  ctx.fillStyle = c('sand');
  ctx.fillText(SHARE_URL, cx, SHARE_H - 72);

  return new Promise((ok, fail) => cv.toBlob((b) => (b ? ok(b) : fail(new Error('canvas toBlob ว่าง'))), 'image/png'));
}

function downloadBlob(blob, name) {
  const a = el('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}

function openOrDownload(blob, name) {
  const url = URL.createObjectURL(blob);
  if (window.open(url, '_blank')) setTimeout(() => URL.revokeObjectURL(url), 60000);
  else {
    URL.revokeObjectURL(url);
    downloadBlob(blob, name);
  }
}

// ตรวจด้วยไฟล์เปล่า: เดสก์ท็อปหลายตัวมี navigator.share แต่ส่งไฟล์ไม่ได้
const canShareFiles = () => {
  try {
    return !!navigator.canShare?.({ files: [new File([''], 'x.png', { type: 'image/png' })] });
  } catch {
    return false;
  }
};

// วาดภาพไว้ก่อนตั้งแต่เปิดการ์ดตาย — Safari ให้เรียก share ได้เฉพาะช่วงสั้น ๆ หลังกด รอวาดตอนกดอาจหลุดสิทธิ์
// ปุ่มบันทึกมีเสมอ: Chrome บนคอมก็แชร์ไฟล์ได้ แต่หน้าแชร์ของระบบไม่ได้ให้ไฟล์เก็บไว้
function shareButtons(card) {
  // วาดล้มแล้วล้าง promise ทิ้ง ไม่งั้นกดซ้ำจะได้ promise ที่ reject ค้างไว้ทุกครั้ง
  let ready = null;
  const blob = () => (ready ??= shareBlob(shareFacts(card)).catch((e) => { ready = null; throw e; }));
  blob().catch(() => {});
  const name = `next-life-age-${card.age}.png`;
  const act = (label, fn) => {
    const b = button(label, null, async () => {
      b.disabled = true;
      b.firstChild.textContent = label;
      try {
        await fn(await blob());
      } catch {
        b.firstChild.textContent = 'สร้างภาพไม่สำเร็จ';
      } finally {
        b.disabled = false;
      }
    });
    return b;
  };
  const save = act('บันทึกภาพการ์ด', (blob) => downloadBlob(blob, name));
  if (!canShareFiles()) return [save];
  const share = act('แชร์ภาพการ์ด', async (blob) => {
    const file = new File([blob], name, { type: 'image/png' });
    try {
      await navigator.share({ files: [file], title: `${GAME_NAME} · Next Life`, text: `${GAME_NAME} · ${st.name} ${lifeEndWord(isGone(st))} ${card.age} — ${SHARE_URL}` });
    } catch (e) {
      // ผู้เล่นปิดหน้าแชร์เอง = จบ · แชร์พังด้วยเหตุอื่น เปิดภาพในแท็บใหม่ให้กดค้างบันทึก (มือถือที่โหลดไฟล์ไม่ได้) · แท็บโดนบล็อกจึงโหลดไฟล์
      if (e?.name !== 'AbortError') openOrDownload(blob, name);
    }
  });
  return [share, save];
}

// เหตุผลล็อก + ยอดเงินที่ขาด (B107) · ท่อนตั้งต้น "เงินไม่พอ" กลายเป็นยอด · reason ของเนื้อหา
// พูดเรื่องเงินอยู่แล้ว (เช่น "เงินไม่พอจ่ายแป๊ะเจี๊ยะ") จึงต่อท้ายแค่ยอด ไม่แทนกลางประโยค
function lockText(card, i) {
  const why = card.locked?.[i];
  const gap = card.moneyGap?.[i];
  if (!why || !gap) return why;
  const parts = why.split(' · ');
  const at = parts.indexOf('เงินไม่พอ');
  if (at < 0) return `${why} · ขาดอีก ${baht(gap)}`;
  parts[at] = `ขาดเงินอีก ${baht(gap)}`;
  return parts.join(' · ');
}

// กู้มาจ่าย (B111 เจ้าของเคาะ): ปุ่มละแหล่งใต้ตัวเลือกที่ขาดแค่เงิน บอกดอก + ยอดจ่ายต่อปี + ระยะ
// นอกระบบไม่มีระยะ — จ่ายแต่ดอก ต้นค้าง ต้องบอกตรง ๆ ไม่งั้นอ่านเหมือนผ่อนหมดได้
// ป้ายบอกชื่อตัวเลือกที่จ่าย: สองข้อขาดเงินพร้อมกันได้ ปุ่มกู้แหล่งเดียวกันหน้าตาเหมือนกันจนแยกไม่ออกว่าจ่ายข้อไหน
// ตัดท้ายด้วย CSS (.of) ไม่ใช่นับตัวอักษร — ความกว้างที่เหลือขึ้นกับจอและป้ายผล และตัดกลางสระไทยไม่ได้
const pct = (r) => `${+(r * 100).toFixed(1)}%`;
function loanButtons(card, i) {
  return (card.loans?.[i] ?? []).map((o) => {
    // ระยะเป็นก้อนแยก — ป้ายผลไม่ตัดกลางก้อน ก้อนยาวรวดเดียวล้นปุ่มจอมือถือ
    const pay = o.years ? `ผ่อนปีละ ${baht(o.yearly)} · นาน ${o.years} ปี` : `จ่ายดอกปีละ ${baht(o.yearly)} · ต้นค้าง`;
    const b = button(`กู้${o.name}มาจ่าย: `, `ดอก ${pct(o.rate)} · ${pay}`, () => (veil(card, i), play(loanPick(i, o.kind))));
    b.firstChild.append(el('span', 'of', card.choices[i]));
    b.classList.add('loan');
    return b;
  });
}

// ไอคอนบรรทัดผลย้อนบนการ์ด · ป้ายล่วงหน้าบนปุ่มตัวเลือกเจ้าของสั่งซ่อน — ผู้เล่นไม่รู้ล่วงหน้าว่าทางไหนมีเรื่องตามมา
const followIcon = (k) => {
  const s = el('span');
  s.insertAdjacentHTML('beforeend', FOLLOW_ICON[k]);
  return s;
};

function button(label, fx, onclick, hint = null) {
  const b = el('button', 'choice');
  const main = el('span', null, label);
  // อยู่ในก้อนเดียวกับข้อความตัวเลือก ป้ายผลด้านขวาจึงยังชิดขวาเหมือนการ์ดที่ไม่มีบรรทัดรอง
  if (hint) main.append(el('small', 'hint', hint));
  b.append(main);
  if (fx) {
    const tag = el('span', 'fx');
    tag.innerHTML = fxHtml(fx);
    b.append(tag);
  }
  b.onclick = onclick;
  return b;
}

// ปุ่มลัด: Enter กดปุ่มเดินเรื่องปุ่มเดียวของการ์ด
const enter = (b) => {
  b.dataset.enter = '';
  return b;
};
// ปุ่มลัดตัวเลข: เลขบนปุ่มคือคีย์ที่กด · นับเฉพาะตัวเลือกที่เห็น (ประตูที่ยังไม่เปิดไม่กินเลข) · ปุ่มกู้ไม่มีเลข เป็นทางของปุ่มบน
// คีย์มีแค่ 1–9 — การ์ดที่ตัวเลือกเกิน 9 ปุ่มที่เหลือไม่ขึ้นเลข ไม่งั้นเลข 10 บอกคีย์ที่กดไม่ได้
const numbered = (b, n) => {
  if (n > 9) return b;
  b.dataset.key = String(n);
  const k = el('kbd', null, String(n));
  k.setAttribute('aria-hidden', 'true');
  b.prepend(k);
  return b;
};
document.addEventListener('keydown', (e) => {
  // กดค้าง = repeat — ไม่นับ ไม่งั้นเลือกรัวข้ามการ์ด
  if (e.repeat || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  const t = e.target;
  if (t.closest?.('input, textarea, select, [contenteditable]')) return;
  let b;
  if (e.key === 'Escape' && sheetClose && !root.querySelector('.sheet.pin')) {
    e.preventDefault();
    return closeSheet();
  }
  const book = root.querySelector('.lifebook');
  if (book && (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
    // Space บนปุ่มที่โฟกัสอยู่ให้ปุ่มนั้นทำงานเอง ไม่งั้นกดทีเดียวพลิกสองครั้ง
    if (e.key === ' ' && t.closest?.('button, summary, a')) return;
    b = book.querySelector(e.key === 'ArrowLeft' ? '.choices [data-prev]' : '.choices [data-enter]');
  } else if (e.key === 'Enter') {
    // โฟกัสอยู่ที่ปุ่ม/หัวข้อพับ ให้ Enter ทำงานของตัวนั้น (แชร์ภาพ · สมุดฉายา · ผังตระกูล)
    if (t.closest?.('button, summary, a')) return;
    b = root.querySelector('.choices [data-enter]');
  } else if (/^[1-9]$/.test(e.key)) {
    b = root.querySelector(`.choices [data-key="${e.key}"]`);
  }
  // การ์ดที่พับไว้ (B117) ปุ่มยังอยู่ใน DOM แค่ซ่อน — ปุ่มลัดต้องไม่กดปุ่มที่มองไม่เห็น · การ์ดใต้แผงเมนู (inert) ก็เช่นกัน
  if (!b || b.disabled || b.closest('[hidden], [inert]')) return;
  e.preventDefault();
  b.click();
});

// แนวการ์ดของโลกนี้ทางเดียว (ทาง A กระดาษเก่า) — โลกละธีม: ลางกับเหตุการณ์ความเชื่อไม่แยกเป็นแสงเทียนแล้ว
// สีมืดทองเป็นของปรโลกที่เดียว (renderAfter) · ต่างโลกมีธีมของตัวเอง · มรณบัตร = หนังสืองานศพบนฐานทาง A
const styleOf = (card) => (card.kind === 'death' ? 'a mem' : 'a');

// ภาพจาก art.mjs (B56) วาดเป็น SVG — ชุดรูปทรงเดียวกับที่ภาพแชร์วาดลง canvas
function artSvg(cls, w, h, parts) {
  const svg = svgEl('svg', { class: cls, viewBox: `0 0 ${w} ${h}`, 'aria-hidden': 'true' });
  for (const p of parts) svg.append(svgEl('path', { d: p.d, fill: p.fill ?? 'none', ...(p.stroke && { stroke: p.stroke, 'stroke-width': p.w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }) }));
  return svg;
}
function artDraw(ctx, parts, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / AVATAR_SIZE, size / AVATAR_SIZE);
  ctx.beginPath();
  ctx.arc(AVATAR_SIZE / 2, AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.lineCap = ctx.lineJoin = 'round';
  for (const p of parts) {
    const path = new Path2D(p.d);
    if (p.fill) {
      ctx.fillStyle = p.fill;
      ctx.fill(path);
    }
    if (p.stroke) {
      ctx.strokeStyle = p.stroke;
      ctx.lineWidth = p.w;
      ctx.stroke(path);
    }
  }
  ctx.restore();
}
// รูปตัวละครอ่านฐานะ ณ ตอนนี้ (standingOf ตัวเดียวกับกราฟฐานะ) — อ่านอย่างเดียว ไม่แตะเซฟ
const avatarParts = (age) => avatarArt(Math.max(0, STAGES.findLastIndex((s) => age >= s.from)), st.sex, artTier(standingOf(st)));
const avatar = (age) => artSvg('av', AVATAR_SIZE, AVATAR_SIZE, avatarParts(age));
// ชราไม่ได้ "เติบโต" แล้ว แต่คงรูปประโยคเดียวกันให้ป้ายทุกช่วงอ่านเป็นชุด
const growLabel = (stage) => `เติบโตเป็น${stage === 'หนุ่มสาว' ? (st.sex === 'หญิง' ? 'สาว' : 'หนุ่ม') : stage === 'ชรา' ? 'ผู้สูงวัย' : stage === 'วัยรุ่น' ? 'วัยรุ่น' : `วัย${stage}`}`;
// รูปบนป้ายคนหาย/หนังสืองานศพ = ตัวละครเองตอนอายุนั้น ชุดเดียวกับภาพแชร์ — หุ่นเทาตายตัวเดิมไม่บอกว่าเป็นใคร
const portrait = (age) => artSvg('por', AVATAR_SIZE, AVATAR_SIZE, avatarParts(age));

const KICKER = { intro: 'เปิดชีวิต', stage: 'เปลี่ยนช่วงชีวิต', era: 'บ้านเมือง', omen: 'ลาง', alloc: 'เงินเก็บ', result: 'ผลที่ตามมา', warn: 'ใกล้ตาย', memory: 'ความทรงจำ', upgrade: 'สกิลที่พกมา · เลือกฝึก' };
// ป้ายคนหาย (B139) — ถ้อยคำของคนที่บ้านที่ยังรอ: ไม่อาลัย ไม่บอกเหตุ (B110) · will[0] ไม่มีพินัยกรรม · will[1] มี
const LOST = {
  head: 'ประกาศตามหาคนหาย',
  money: 'ทรัพย์ที่ทิ้งไว้',
  debt: 'หนี้ที่ทิ้งไว้',
  will: ['ไม่ได้สั่งเรื่องทรัพย์ไว้ คนที่บ้านแบ่งกันเองจนผิดใจกัน', 'คนที่บ้านพบพินัยกรรมที่เขียนไว้ จึงแบ่งทรัพย์ตามนั้น'],
  call: 'ใครพบเห็น โปรดแจ้งคนที่บ้าน ทุกคนยังรออยู่',
};

// คนรุ่นเดียวกันที่อยู่เลยอายุนี้ (B142) — ตารางชีพเดียวกับที่ชีวิตนี้ทอยตาย (ปีต้นแบบของ seed นี้) ไม่ใช่สถิติผู้เล่น
// lifeQx อ่าน hash ไม่ดึงเลขสุ่ม ผลเกมจึงไม่ขยับ · ตายอายุ N = ไม่ถึงวันเกิดปีที่ N+1 ⇒ นับคนที่รอดถึง N+1
function outliveLine(age) {
  let alive = 1;
  for (let a = 0; a <= age && a < MAX_AGE; a++) alive *= 1 - lifeQx(st.content.era, st.seed, st.sex, st.birthYear + a, a);
  const pct = alive * 100;
  const shown = pct < 1 ? 'ไม่ถึง 1%' : pct > 99 ? 'กว่า 99%' : `${Math.round(pct)}%`;
  return `${st.sex}ไทยที่เกิดปีเดียวกัน ${shown} อยู่ได้นานกว่าคุณ`;
}

// โอกาสเกิดแบบนี้ (B141) — คูณตามลำดับที่ newLife สุ่มจริง: ภาค×จังหวัดตามประชากร แล้วฐานะตามรายได้ของภาคนั้นในปีเกิด
// อ่านตารางอย่างเดียว ไม่แตะ rng · เซฟเก่าที่ไม่มีจังหวัดไม่แสดง
const oneIn = (n) => (n < 100 ? `${Math.round(n)}` : n < 1e6 ? Number(n.toPrecision(2)).toLocaleString('en-US') : `${Number((n / 1e6).toPrecision(2))} ล้าน`);
function birthOddsLine() {
  const birth = st.content.era.birth;
  const region = birth.regions.find((r) => r.name === st.region);
  const prov = region?.provinces.find((p) => p.name === st.province);
  const cls = CLASSES.indexOf(st.cls);
  if (!prov || cls < 0) return null;
  const total = birth.regions.reduce((s, r) => s + r.w, 0);
  const p = (prov.w / total) * classOdds(birth, regionRatio(birth, region.ses, st.birthYear))[cls].p;
  return p > 0 ? `เด็กไทยที่เกิดปีเดียวกัน ราว 1 ใน ${oneIn(1 / p)} คน เกิดแบบคุณ (${provinceLabel(st)} · ฐานะ${st.cls})` : null;
}

// ป้ายที่มาตัวเลข (B140): 📎 อ่านจากข้อมูลจริง · 🎲 ค่าประมาณของเกม (ปีที่ใช้ไม่มีข้อมูลจริง เกมยืมค่าปีที่ใกล้สุด)
// บอกช่วงปีของชุดข้อมูล ไม่บอกปีของแถวที่ใช้ — ปีแถวคือปีเกิดของชีวิตที่อยู่ในช่วงข้อมูลจริง ปีเกมจะหลุดขึ้นจอ (B14 ข้อ 12)
// มือถือไม่มี hover จึงเป็นปุ่มแตะเปิด/ปิด ไม่ใช่ title
const yearsOf = (s) => (s.from === s.to ? `${s.from}` : `${s.from}–${s.to}`);
const srcText = (what, s) => `${what} (${s.by.join(' · ')} ${yearsOf(s)})`;
const inData = (s, ys) => ys.every((y) => y >= s.from && y <= s.to);
const MORT_WHAT = 'อายุคาดเฉลี่ยและอัตราตายทารก';
const NO_MORT = 'บางปีที่ใช้ยังไม่มีข้อมูลการตาย เกมใช้ค่าปีที่ใกล้ที่สุดแทน';
function srcTag([real, text]) {
  const tag = el('span', 'src');
  const b = el('button', null, real ? '📎' : '🎲');
  b.type = 'button';
  b.setAttribute('aria-label', real ? 'ข้อมูลจริง แตะดูที่มา' : 'ค่าประมาณของเกม แตะดูเหตุผล');
  b.setAttribute('aria-expanded', 'false');
  const d = el('span', 'src-d', real ? text : `ค่าประมาณของเกม — ${text}`);
  d.hidden = true;
  b.onclick = () => {
    d.hidden = !d.hidden;
    b.setAttribute('aria-expanded', String(!d.hidden));
  };
  tag.append(b, d);
  return tag;
}
const sourced = (node, src) => (node.append(' ', srcTag(src)), node);

// ปีเกมทุกปีอ่านค่าของปีต้นแบบ (lifeQx · inflationRate) จึงตรวจที่ปีต้นแบบ ไม่ใช่ปีเกม
function outliveSrc(age) {
  const era = st.content.era;
  const ys = [];
  for (let a = 0; a <= age && a < MAX_AGE; a++) ys.push(protoYear(era, st.seed, st.birthYear + a));
  return inData(era.src.mort, ys) ? [true, `คำนวณจาก${srcText(MORT_WHAT, era.src.mort)}`] : [false, NO_MORT];
}

// แยกทารก/เด็กโตตามเกณฑ์เดียวกับที่ engine เขียน card.note (ทารกอ่านอัตราตายทารกตรง · เด็กโตคำนวณ qx จากตารางชีพ)
function childNoteSrc(age) {
  const era = st.content.era;
  const infant = age < 5;
  const y = protoYear(era, st.seed, infant ? st.birthYear : st.birthYear + age);
  if (!inData(era.src.mort, [y])) return [false, NO_MORT];
  return [true, infant ? srcText('อัตราตายทารก', era.src.mort) : `คำนวณจาก${srcText(MORT_WHAT, era.src.mort)}`];
}

// ภาค×จังหวัดอ่านประชากรปีเดียว · ฐานะอ่านรายได้รายภาคของปีเกิดจริง (ไม่ผ่านปีต้นแบบ) — นอกช่วงตารางรายได้ = ค่ายืม
function birthOddsSrc() {
  const src = st.content.era.src;
  if (!inData(src.income, [st.birthYear])) return [false, `ปีเกิดนี้อยู่นอกช่วงข้อมูลรายได้รายภาค (${yearsOf(src.income)}) เกมใช้ค่าปีที่ใกล้ที่สุดแทน`];
  return [true, `คำนวณจาก${srcText('ประชากรรายจังหวัด', src.pop)} · ${srcText('รายได้ครัวเรือนรายภาค', src.income)} · ${srcText('ส่วนแบ่งรายได้', src.share)}`];
}

// บรรทัด "ของแพงขึ้น" ของการ์ดทบทวนเงินเก็บมาจาก engine เป็นข้อความ — จับที่คำนำ · ทุกปีอยู่ในช่วงปีต้นแบบ era.future
const PRICE_ITEM = 'ของแพงขึ้น ';
function priceSrc() {
  const era = st.content.era;
  return inData(era.src.cpi, [era.future.from, era.future.to]) ? [true, `คำนวณจาก${srcText('เงินเฟ้อรายปี', era.src.cpi)}`] : [false, 'บางปีที่ใช้ยังไม่มีข้อมูลเงินเฟ้อ เกมใช้ค่าประมาณแทน'];
}

// เอฟเฟกต์ 3 จังหวะ (B-fx · เจ้าของเลือกแบบ A ทั้งสาม): พลิกการ์ดใหม่ทุกใบ · ตะเกียงดับตอนตาย · ตราเหรียญเมื่อได้ฉายาหายาก/ตำนาน (ข้อ 160 แทนแถบผ้าคลี่)
// frame(parts, t) ขึ้นกับ t 0..1 อย่างเดียว ⇒ ข้าม = frame(1) · สีชุด ART_INK ไม่รับค่าบุญบาป — ตายแบบเดียวทุกกรรม ห้ามเผยกรรมผ่านเอฟเฟกต์
const fxClamp = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const fxSpan = (t, a, b) => fxClamp((t - a) / (b - a));
const fxOut = (x) => 1 - (1 - x) ** 3;
const fxIn = (x) => x * x * x;
const fxBack = (x) => 1 + 2.2 * (x - 1) ** 3 + 1.2 * (x - 1) ** 2;
const fxSvg = (w, h, inner, cls = '') => `<svg class="${cls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${inner}</svg>`;
const FX_INK = ART_INK;
// ค่าเจ้าของเคาะ (ui-redo ข้อ 160) = DEF ของหน้า tweak title-fx · หายาก = เงิน ตำนาน = ทอง โลหะคนละชนิด
const FX_TITLE = { rare: '#C9CDD3', leg: ART_INK.gold, legInk: ART_INK.lacquer, frameW: 1.6, glow: 46, fs: 17, nameW: 200, durRare: 900, durLeg: 1400 };
// ฉากซ้อนเต็มจอของตาย/ฉายา — จบเองค่อยจางออก · ถูกข้ามหายทันที
const fxOv = () => document.body.appendChild(el('div', 'fx-ov'));
function fxOvEnd(ov, natural) {
  if (!natural) return ov.remove();
  ov.classList.add('fx-out');
  setTimeout(() => ov.remove(), 260);
}

const FX = {
  // เส้นทองวิ่งรอบกรอบการ์ด แล้วเนื้อการ์ดค่อยขึ้น (ui-redo ใบ 37 · แบบ B ของต้นแบบ fx-proto) · ขนาดเส้นวัดจากการ์ดจริงตอนเริ่ม
  // reduced-motion ไม่วาดเส้น — fxPlay จางทั้งใบให้เอง
  // block 0: คลิกแรกระหว่างพลิกข้ามภาพแล้วปุ่มทำงานทันที — ผู้เล่นไม่ต้องรอภาพก่อนกด
  flipB: { dur: 520, block: 0,
    build: (card) => {
      const kids = [...card.children];
      if (fxReduced()) return { kids, line: null, svg: null };
      const r = card.getBoundingClientRect();
      const rx = parseFloat(getComputedStyle(card).borderTopLeftRadius) || 0;
      card.classList.add('fx-trace-on');
      card.insertAdjacentHTML('beforeend', fxSvg(r.width, r.height, `<rect x="1" y="1" width="${Math.max(0, r.width - 2)}" height="${Math.max(0, r.height - 2)}" rx="${rx}" fill="none" stroke="${FX_INK.gold}" stroke-width="2" pathLength="100" stroke-dasharray="100"/>`, 'fx-trace'));
      const svg = card.lastElementChild;
      return { card, kids, svg, line: svg.querySelector('rect') };
    },
    frame: (p, t) => {
      if (p.line) {
        p.line.style.strokeDashoffset = 100 * (1 - fxOut(fxSpan(t, 0, 0.55)));
        p.line.style.opacity = 1 - 0.6 * fxSpan(t, 0.75, 1);
      }
      const c = fxOut(fxSpan(t, 0.35, 1));
      for (const k of p.kids) {
        k.style.opacity = c === 1 ? '' : c;
        k.style.transform = c === 1 ? '' : `translateY(${8 * (1 - c)}px)`;
      }
    },
    end: (p) => {
      for (const k of p.kids) k.style.opacity = k.style.transform = '';
      p.svg?.remove();
      p.card?.classList.remove('fx-trace-on');
    } },
  // ตะเกียงดับ: เปลวสั่นแล้วหด · ควันเส้นเดียวลอยขึ้นจาง · จอหรี่เป็นรัก · คำบรรยายค่อยขึ้น
  deathA: { dur: 1600, block: 300,
    build: (ov, o) => {
      ov.innerHTML = `<div class="fx-veil"></div>${fxSvg(120, 120, `<path class="fx-smoke" d="M60 44c-6-8 6-14 0-22s6-14 0-20" fill="none" stroke="${FX_INK.cream}" stroke-width="1.4" stroke-linecap="round" pathLength="100" stroke-dasharray="100"/><g class="fx-flame" style="transform-origin:60px 58px"><path d="M60 34c7 9 9 15 6 20q-2 4-6 4t-6-4c-3-5-1-11 6-20z" fill="${FX_INK.gold2}"/><path d="M60 44c3 4 4 7 2 10q-1 2-2 2t-2-2c-2-3-1-6 2-10z" fill="${FX_INK.cream}"/></g><path d="M36 64h48q-4 18-24 18t-24-18z" fill="${FX_INK.bronze2}" stroke="${FX_INK.gold}" stroke-width="1.4"/><path d="M58 64v-6h4v6" fill="${FX_INK.lacquer2}"/><path d="M44 90h32" stroke="${FX_INK.gold}" stroke-width="1.4"/>`, 'fx-lamp')}<div class="fx-cap"></div>`;
      const cap = ov.querySelector('.fx-cap');
      cap.append(o.head, el('small', null, o.sub));
      return { ov, flame: ov.querySelector('.fx-flame'), smoke: ov.querySelector('.fx-smoke'), veil: ov.firstChild, cap };
    },
    frame: (p, t) => {
      const f = fxSpan(t, 0, 0.38);
      const flick = 1 + 0.08 * Math.sin(t * 60) * (1 - f);
      p.flame.style.transform = `scale(${(1 - fxIn(f)) * flick},${(1 - f) * flick})`;
      p.flame.style.opacity = 1 - fxSpan(t, 0.3, 0.38);
      const s = fxSpan(t, 0.32, 0.9);
      p.smoke.style.strokeDashoffset = 100 * (1 - fxOut(s));
      p.smoke.style.opacity = s > 0 ? 0.7 * (1 - fxSpan(t, 0.7, 1)) : 0;
      p.veil.style.opacity = 0.82 * fxOut(fxSpan(t, 0.15, 0.85));
      p.cap.style.opacity = fxOut(fxSpan(t, 0.55, 1));
      p.cap.style.transform = `translateY(${6 * (1 - fxSpan(t, 0.55, 1))}px)`;
    },
    end: (p, natural) => fxOvEnd(p.ov, natural) },
  // ตราเหรียญ (ui-redo ข้อ 160 · แบบ medal ของหน้า tweak title-fx) — ภาพนิ่งหายาก/ตำนานต้องแยกด้วยตา (ข้อ 39)
  // หายาก = เหรียญรักขอบเงิน ดาวดวงเดียว ขีดเส้นเดียว · ตำนาน = เหรียญทองล้อมกลีบบัว 12 กลีบ วงจุดทอง ดาว 3 ดวง ชื่อทองขีดสองเส้น
  title: {
    build: (ov, o) => {
      const leg = o.tier === 'legend';
      const id = `fx${++fxUid}`;
      const T = FX_TITLE, w = T.frameW;
      const star = (x, y, r, f) => `<path d="M${x} ${y - r}L${x + r * 0.3} ${y - r * 0.3}L${x + r} ${y}L${x + r * 0.3} ${y + r * 0.3}L${x} ${y + r}L${x - r * 0.3} ${y + r * 0.3}L${x - r} ${y}L${x - r * 0.3} ${y - r * 0.3}z" fill="${f}"/>`;
      const name = (fill) => `<text class="fx-name" x="150" y="110" text-anchor="middle" font-size="${T.fs}" fill="${fill}"></text>`;
      const sub = (fill) => `<text class="fx-sub" x="150" y="160" text-anchor="middle" font-size="11" fill="${fill}">${leg ? 'ฉายาระดับตำนาน' : 'ฉายาระดับหายาก'}</text>`;
      let inner;
      if (!leg) {
        inner = `<g class="fx-medal" style="transform-origin:150px 48px"><circle cx="150" cy="48" r="30" fill="${FX_INK.lacquer2}" stroke="${T.rare}" stroke-width="${w}"/>${star(150, 48, 13, T.rare)}</g>${name(FX_INK.cream)}<path class="fx-line" d="M70 120h160" stroke="${T.rare}" stroke-width="${w}" pathLength="100" stroke-dasharray="100"/>${sub(T.rare)}`;
      } else {
        const petals = Array.from({ length: 12 }, (_, i) => `<path class="fx-petal" d="M150 48q-9 -22 0 -42q9 20 0 42z" transform="rotate(${i * 30} 150 48)" fill="url(#${id}g)" stroke="${FX_INK.gold2}" stroke-width="0.6"/>`).join('');
        const R = 30 + T.glow * 0.5;
        const dots = Array.from({ length: 16 }, (_, i) => `<circle class="fx-dot" cx="${150 + R * Math.cos(i * Math.PI / 8)}" cy="${48 + R * Math.sin(i * Math.PI / 8)}" r="1.8" fill="${FX_INK.gold2}"/>`).join('');
        inner = `<defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${FX_INK.gold2}"/><stop offset=".55" stop-color="${T.leg}"/><stop offset="1" stop-color="${FX_INK.bronze2}"/></linearGradient></defs><g>${dots}</g><g>${petals}</g><g class="fx-medal" style="transform-origin:150px 48px"><circle cx="150" cy="48" r="26" fill="url(#${id}g)" stroke="${FX_INK.gold2}" stroke-width="${w}"/><circle cx="150" cy="48" r="21" fill="none" stroke="${T.legInk}" stroke-width="0.8"/>${star(150, 42, 9, T.legInk)}${star(139, 56, 5, T.legInk)}${star(161, 56, 5, T.legInk)}</g>${name(FX_INK.gold2)}<path class="fx-line" d="M70 119h160M90 124h120" stroke="${T.leg}" stroke-width="${w}" pathLength="100" stroke-dasharray="100"/>${sub(FX_INK.gold2)}`;
      }
      ov.innerHTML = `<div class="fx-veil"></div><div class="fx-title">${fxSvg(300, 170, inner)}</div>`;
      const q = (s) => ov.querySelector(s);
      const nm = q('.fx-name');
      nm.textContent = o.name;
      // ตราเดียวกันใช้กับสกิลที่ลงสมุด/ขึ้นขั้น (06s) — ป้ายใต้ชื่อบอกว่าเป็นอะไร
      if (o.sub) q('.fx-sub').textContent = o.sub;
      // ชื่อยาวเกินเส้นใต้ชื่อ ⇒ บีบให้พอดี ไม่ล้นจอ 390
      if (nm.getComputedTextLength() > T.nameW) {
        nm.setAttribute('textLength', T.nameW);
        nm.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      }
      return { ov, leg, veil: ov.firstChild, medal: q('.fx-medal'), name: nm, line: q('.fx-line'), sub: q('.fx-sub'), petals: [...ov.querySelectorAll('.fx-petal')], dots: [...ov.querySelectorAll('.fx-dot')] };
    },
    dur: (o) => (o.tier === 'legend' ? FX_TITLE.durLeg : FX_TITLE.durRare), block: 300,
    frame: (p, t) => {
      p.veil.style.opacity = 0.6 * fxOut(fxSpan(t, 0, 0.2));
      p.medal.style.transform = `scale(${1.7 - 0.7 * fxOut(fxSpan(t, 0, 0.3))})`;
      p.medal.style.opacity = fxSpan(t, 0, 0.12);
      p.name.style.opacity = fxSpan(t, 0.3, 0.55);
      p.line.style.strokeDashoffset = 100 * (1 - fxOut(fxSpan(t, 0.4, 0.7)));
      p.sub.style.opacity = fxSpan(t, 0.55, 0.8);
      p.petals.forEach((x, i) => { x.style.opacity = fxSpan(t, 0.25 + i * 0.025, 0.35 + i * 0.025); });
      p.dots.forEach((x, i) => { x.style.opacity = fxSpan(t, 0.6 + i * 0.012, 0.66 + i * 0.012); });
    },
    end: (p, natural) => fxOvEnd(p.ov, natural) },
};

// reduced-motion: พลิกเหลือ fade 150ms · ฉากตาย/ฉายาไม่เล่นเลย (การ์ดบอกเรื่องเดียวกันอยู่แล้ว)
const FX_RM = 150;
const fxReduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
let fxCur = null;
let fxSeen = null;
let fxUid = 0;
// บล็อกคลิกได้ไม่เกิน block ms · หลังจากนั้นคลิกแรกข้ามไปภาพจบแล้วปุ่มทำงานต่อทันที · then = จังหวะถัดไป เล่นต่อเมื่อจบเองเท่านั้น
function fxPlay(stage, name, o = {}, then = null) {
  const fx = FX[name];
  const parts = fx.build(stage, o);
  const rm = fxReduced();
  const total = rm ? FX_RM : typeof fx.dur === 'function' ? fx.dur(o) : fx.dur;
  const t0 = performance.now();
  let raf = 0;
  let done = false;
  const fin = (natural) => {
    cancelAnimationFrame(raf);
    // ภาพจบเองก่อนครบเวลากัน = ตัวกันยังอยู่ (ตัวเดิม) · คลิกหลังครบเวลาแค่ปลดตัวกัน
    if (fxCur === me && !(natural && performance.now() < me.until)) fxCur = null;
    if (done) return;
    done = true;
    fx.frame(parts, 1);
    stage.style.opacity = '';
    fx.end(parts, natural);
    if (natural) then?.();
  };
  const me = { until: t0 + Math.min(fx.block, total), skip: () => fin(false) };
  const tick = (now) => {
    const t = fxClamp((now - t0) / total);
    if (rm) stage.style.opacity = t;
    else fx.frame(parts, t);
    if (t < 1) raf = requestAnimationFrame(tick);
    else fin(true);
  };
  if (rm) {
    fx.frame(parts, 1);
    stage.style.opacity = 0;
  } else fx.frame(parts, 0);
  raf = requestAnimationFrame(tick);
  fxCur = me;
}
const FX_TIER = { ตำนาน: 'legend', หายาก: 'rare' };
// เรียกท้ายทุกตัววาดการ์ด: การ์ดใหม่ = พลิก · การ์ดตาย = ตะเกียงดับ แล้วต่อตราเหรียญถ้าฉายาเด่นเป็นหายาก/ตำนาน
// วาดซ้ำการ์ดเดิม (สลับแท็บ) ไม่เล่นซ้ำ
function fxCard(box, card) {
  fxCur?.skip();
  if (fxSeen === card) return;
  fxSeen = card;
  if (card.kind !== 'death') return fxPlay(box, 'flipB');
  if (fxReduced()) return;
  const top = lifeTitles(card).titles[0];
  const tier = top && FX_TIER[top.tier];
  const gone = isGone(st);
  fxPlay(fxOv(), 'deathA', { head: gone ? 'หายไปจากบ้าน' : 'จากไปอย่างสงบ', sub: `${genLabel()}${lifeEndWord(gone)} ${card.age}` }, tier && (() => fxPlay(fxOv(), 'title', { tier, name: top.name })));
}
const fxGate = (e) => {
  if (!fxCur) return;
  if (performance.now() < fxCur.until) {
    e.preventDefault();
    e.stopImmediatePropagation();
  } else fxCur.skip();
};
window.addEventListener('click', fxGate, true);
window.addEventListener('keydown', (e) => [' ', 'Enter', 'ArrowRight', 'ArrowLeft'].includes(e.key) && fxGate(e), true);

function render(card) {
  // ไปกลับกลางชีวิต (B68m): ทริปยังเป็นชีวิตนี้ ปุ่มจึงเดินผ่านปุ่มชีวิต — จอเต็มของทริปเป็นงานเลน C
  if (card.kind === 'isekai') return renderIsekai(card);
  root.replaceChildren();
  const s = statsOf(st);
  const box = el('article', `card ${styleOf(card)}`);
  const top = el('div', 'top');
  const body = el('div', 'body');
  const choices = el('div', 'choices');
  // ชิ้นที่ต่อท้ายปุ่ม (การ์ดตาย) — การ์ดอื่นปุ่มอยู่ท้ายสุดเสมอ
  const after = [];
  const next = () => play(T.next);

  if (card.kind === 'death') {
    // หายตัวไม่มีศพ (B137) จึงไม่มีหนังสืองานศพ — คนที่บ้านยังเชื่อว่ามีชีวิตอยู่ ใบนี้เป็นป้ายตามหาคนหาย ไม่มีคำอาลัย (B139)
    const gone = isGone(st);
    if (gone) box.classList.add('lost');
    top.append(el('b', null, gone ? LOST.head : 'ด้วยรักและอาลัย'));
    box.append(top);
    const bg = sceneBg(gone ? 'gone' : 'death');
    if (bg) box.append(bg);
    // หนังสืองานศพ (ui-redo 57): รูป ชื่อ อายุ สาเหตุ เป็นหัวกลางใบไม่มีกรอบ · ข้อมูลเป็นตารางสองคอลัมน์ · ปุ่มไปต่อท้ายข้อมูล
    // หนังสืองานศพบอกอายุ ไม่บอกปี พ.ศ. — ปีเกมไม่ขึ้นจอ (B14 ข้อ 12)
    const head = el('div', 'd-head');
    head.append(portrait(card.age), el('h3', null, fullName()), el('p', 'dates', `${genLabel()}${gone ? `หายตัวเมื่ออายุ ${card.age} ปี` : `สิริอายุ ${card.age} ปี`}`));
    const why = causeOf(card.cause, card.age);
    if (why) head.append(el('p', 'sub', `จากไป${why.join('')}`));
    body.append(head);
    if (gone) body.append(el('p', 'call', LOST.call));
    const tl = titleLine(card);
    if (tl) body.append(tl);
    const facts = el('dl', 'd-facts');
    const fact = (k, v, cls) => facts.append(el('dt', null, k), el('dd', cls, v));
    fact('เพศ', st.sex);
    fact('จังหวัด', provinceLabel(st));
    fact('ฐานะ', classNow(st));
    fact('งาน', card.job);
    if (st.edu) fact('วุฒิ', st.edu);
    const net = gone ? (card.summary.money < 0 ? LOST.debt : LOST.money) : card.summary.money < 0 ? 'ตายพร้อมหนี้' : 'ทรัพย์สุทธิ';
    fact(net, baht(card.summary.money), card.summary.money < 0 ? 'neg' : undefined);
    body.append(facts);
    // ใบมรณะย่อ (ui-redo ใบ 10): ด้านบนพอดีจอแรกแล้วตามด้วยปุ่มไปต่อทันที — รายละเอียดอยู่ในแท็บใต้ปุ่ม (ใบ 11)
    // ชิ้นใต้ปุ่มมีคลาส body ⇒ จอแนวนอนเตี้ย panels() ยังวางไว้คอลัมน์กลางต่อจากปุ่ม
    const rest = el('div', 'body d-rest');
    after.push(rest);
    const sum = [];
    // คนหายไม่รู้อายุตาย จึงเทียบรุ่นไม่ได้ (B142)
    if (!gone) sum.push(sourced(el('p', 'sub', outliveLine(card.age)), outliveSrc(card.age)));
    if (card.summary.debt) sum.push(el('p', 'sub', `หนี้ผ่อนค้าง ${baht(card.summary.debt)}`));
    if (card.summary.bankruptcies) sum.push(el('p', 'sub', `เคยล้มละลาย ${card.summary.bankruptcies} ครั้ง`));
    if (card.summary.grey) sum.push(el('p', 'sub', `เงินเทาที่หายไปกับตัว ${baht(card.summary.grey)}`));
    // บันทึกเด็กเป็นสถิติการตายของยุค — ไม่ใช่เรื่องของคนหาย
    if (card.note && !gone) sum.push(sourced(el('p', 'sub', card.note), childNoteSrc(card.age)));
    if (card.will !== undefined) sum.push(el('p', 'sub', gone ? LOST.will[card.will ? 1 : 0] : card.will ? 'มีพินัยกรรม ทายาทแบ่งทรัพย์ตามที่สั่งไว้' : 'ไม่มีพินัยกรรม ทายาทแบ่งทรัพย์กันเองจนผิดใจกัน'));
    if (card.letter) sum.push(el('p', 'sub', card.letter));
    const from = st.gen === 1 && save.from;
    if (from) sum.push(el('p', 'sub', from.day ? `ชาติประจำวัน ${from.day} · ทุกคนที่เล่นวันนั้นเกิดแบบเดียวกันนี้ ทางที่เลือกต่างกันได้` : 'ชีวิตจากลิงก์เพื่อน · เกิดแบบเดียวกับเพื่อนทุกอย่าง ทางที่เลือกต่างกันได้'));
    // สมุดเต็มต้องให้ผู้เล่นลงมือเอง จึงอยู่แท็บที่เปิดอยู่แล้ว ไม่ซ่อนไว้แท็บอนุสรณ์
    if (card.memo === 'full') sum.push(memoFull(card));
    sum.push(helpBox());
    // บัญชีบุญบาปเฉลยที่ปรโลกในระหว่างชาติ ไม่ใช่การ์ดตาย · กราฟทั้งชีวิตแทนสรุปช่วงวัยสุดท้าย (B38a) ชีวิตสั้นก็มีกราฟ
    const chart = card.life && lifeChart(card.life, card.age, card.cause);
    const kin = familyOf(st);
    const fam = el('div', 'fam');
    fam.append(...kinParts(kin.filter((m) => !ANIMAL_ROLES.includes(m.role))), ...kinParts(kin.filter((m) => ANIMAL_ROLES.includes(m.role)), true));
    if (card.pets) fam.append(el('p', 'sub', card.pets));
    if (!fam.childElementCount) fam.append(el('p', 'sub', 'ไม่มีใครในบ้านตอนจากไป'));
    const clan = el('div', 'fam');
    clan.append(...clanParts());
    const memo = [];
    if (card.funeral) memo.push(el('p', 'sub', `งานศพ: ${card.funeral.text} · แขกมาส่งราว ${card.funeral.guests.toLocaleString('en-US')} คน${card.funeral.cost ? ` · ค่าใช้จ่าย ${baht(card.funeral.cost)}` : ''}`));
    if (card.funeral?.who) memo.push(el('p', 'sub', card.funeral.who));
    if (card.lastImage) memo.push(el('p', 'sub', `ภาพสุดท้ายที่นึกถึง: ${card.lastImage}`));
    // คนหายไม่มีศพ (B137) — แท็บนี้จึงอาจไม่มีงานศพ แต่ชีวิตนี้ยังลงสมุดอนุสรณ์
    if (!card.funeral) memo.push(el('p', 'sub', gone ? 'ยังไม่มีงานศพ คนที่บ้านยังรอข่าวอยู่' : 'ไม่มีบันทึกงานศพ'));
    if (card.memo !== 'full') memo.push(shelfButton('เปิดสมุดอนุสรณ์', 'm'));
    rest.append(deathTabs(card, [sum, [chart, eraBox()].filter(Boolean), [fam], [clan], [titlesBox(card)], memo]));
    // ปุ่มหลักมีปุ่มเดียว · บันทึกภาพ/แชร์/คัดลอก/ชวนเพื่อนพับรวมในเมนูแชร์ท้ายการ์ด ไม่แย่งที่ปุ่มไปต่อ
    choices.append(enter(button(BTN.toAfter, null, () => openBook(card))));
    const share = el('details', 'd-share');
    const menu = el('div', 'd-share-in');
    menu.append(...shareButtons(card), copyButton(() => summaryText(card.age)));
    if (st.gen === 1) menu.append(inviteButton());
    share.append(el('summary', null, BTN.share), menu);
    rest.append(share);
  } else {
    // ฐานะ/งานอยู่แผงตัวฉัน (ui-redo ใบ 04) · เงินอยู่แผงเงิน (ใบ 07) — ใต้แถบสถานะเหลือแค่เนื้อการ์ด
    box.append(statusBar(card, s));
    // ตัวคูณนิสัย (B41) มีผลกับตัวเลือกก่อนหน้า — บอกบนใบถัดไปแทนการ์ดผลเพิ่ม
    if (card.because) body.append(el('p', 'note', card.because));
    const kicker = card.kind === 'event' ? (card.funeral ? 'งานศพ' : card.national ? KICKER.era : `ช่วง${card.stage}`) : KICKER[card.kind];
    // ภาพยุค (B56): การ์ดบ้านเมือง + การ์ดรับมือที่ผูกยุคไว้ (B58) ได้ภาพของยุคนั้น · ยุคที่ไม่มีภาพ = หน้าตาเดิม
    const eraPic = eraArt(card.kind === 'era' ? card.id : card.kind === 'event' ? ERA_OF.get(card.id) : null);
    if (eraPic) body.append(artSvg('era-art', ERA_ART_W, ERA_ART_H, eraPic));
    else {
      const scene = card.kind === 'intro' ? sceneSvg(BIRTH_SCENE[artTier(standingOf(st))], true) : SCENE_OF.has(card.id) && sceneSvg(SCENE_OF.get(card.id), false);
      if (scene) body.append(scene);
    }
    // ข่าวบ้านเมืองที่รวมกับการ์ดรับมือ (B58): ชื่อเหตุการณ์ต่อท้ายป้าย · เรื่องข่าวเป็นบรรทัดนำก่อนเรื่องของเรา
    body.append(el('span', 'kicker', card.news ? `${kicker} · ${card.news.text}` : kicker));
    if (card.news?.story) body.append(el('p', 'news', card.news.story));
    // ผลย้อน: บอกที่มาก่อนอ่านเรื่อง · อายุ 0 เป็นค่าจริง ห้ามเช็ก truthy
    if (card.kind === 'event' && card.echoFrom !== undefined) {
      const ef = followIcon('later');
      ef.className = 'ef';
      ef.append(`มาจากที่คุณเลือกตอนอายุ ${card.echoFrom}`);
      body.append(ef);
    }
    // สายเรื่องรายคน (krung-1): ตอนแรกไม่มีระยะห่างให้บอก
    if (card.kind === 'event' && card.arc) body.append(el('span', 'ef', `เรื่องต่อเนื่อง ตอนที่ ${card.arc.n}${card.arc.gap ? ` · ผ่านมา ${card.arc.gap} ปีจากตอนก่อน` : ''}`));

    if (card.kind === 'intro') {
      // ผู้สืบสายเลือด (B76) เริ่มกลางวัย ไม่ได้เกิดใหม่
      body.append(el('span', 'stamp', card.age > 0 ? 'รับช่วงชีวิต' : 'แรกเกิด'));
      body.append(el('h3', 'lead', card.text));
      body.append(el('p', 'horo', horoscope(st)));
      // การ์ดแรกเกิดของตระกูลใหม่ = จุดเริ่มเกมของคนไม่มีเซฟ (คนมีเซฟเห็นที่หน้าเล่นต่อ)
      if (st.gen === 1 && card.age === 0) body.append(warnLine());
      const odds = birthOddsLine();
      if (odds) body.append(sourced(el('p', 'sub', odds), birthOddsSrc()));
      // บรรทัดแรกเป็นเรื่องของบ้าน · ที่เหลือเป็นบรรยากาศยุค ตัวรอง
      card.story.forEach((p, i) => body.append(el('p', i ? 'sub' : null, p)));
      if (card.inherit.length) {
        const box = el('div', 'recap');
        box.append(el('div', 'h', card.age > 0 ? 'สิ่งที่สืบทอดจากรุ่นก่อน' : 'สิ่งที่สืบทอดจากชาติก่อน'), list(card.inherit, 'picks'));
        // เจ้าของสั่งไม่ย่อรุ่นต้นทางซ้าย — ผังบนการ์ดแรกเกิดโชว์ครบทุกรุ่น (ภาพบีบป้ายเองเมื่อรุ่นถี่)
        if (card.lineage.length) box.append(el('div', 'h', 'ผังตระกูล'), lineageView(st.lineage, st.cls));
        body.append(box);
      }
      // ใบสืบทอดยาว/จอเตี้ยดันปุ่มหลุดใต้เมนูล่าง — ปุ่มติดจอแทนการพับเนื้อ (เจ้าของสั่งผังตระกูลครบทุกรุ่น)
      choices.classList.add('pin');
      choices.append(enter(button(BTN.next, null, next)));
      if (canReroll()) choices.append(button(BTN.reroll, 'ได้ครั้งเดียว', reroll));
    } else if (card.kind === 'stage') {
      body.append(el('span', 'stamp', card.text));
      const grow = el('p', 'grow');
      grow.append(avatar(card.age), el('span', null, growLabel(card.stage)));
      body.append(grow, recap(card.recap));
      choices.append(enter(button(BTN.next, null, next)));
    } else if (digestRest(card).length) {
      const rest = digestRest(card);
      body.append(el('h3', null, 'เรื่องใหญ่ของปีนี้'), list([card, ...rest].map((x) => x.text)));
      choices.append(enter(button(BTN.next, null, () => play(T.next, rest.length + 1))));
    } else if (card.kind === 'era' || card.kind === 'omen' || card.kind === 'result') {
      body.append(el('h3', null, card.text));
      if (card.story) body.append(el('p', null, card.story));
      // ตรวจเจอโรค (B110): บอกเวลาที่เหลือให้เตรียมใจ (เจ้าของเคาะ) · left = ปีก่อนถึงนัด 0 = ปีนี้
      if (card.illness) body.append(el('p', 'sub', card.illness.left ? `หมอว่าเหลือเวลาราว ${card.illness.left} ปี` : 'หมอว่านี่อาจเป็นปีสุดท้าย'));
      choices.append(enter(button(BTN.next, null, next)));
    } else if (card.entry) {
      entryOffer(card, body, choices);
    } else {
      if (card.title) body.append(el('h3', null, card.title));
      body.append(el(card.title ? 'p' : 'h3', card.title ? null : 'lead', card.text));
      if (card.items?.length) {
        const ul = list(card.items);
        const price = card.kind === 'alloc' && [...ul.children].find((li) => li.textContent.startsWith(PRICE_ITEM));
        if (price) sourced(price, priceSrc());
        body.append(ul);
      }
      if (card.disclaimer) body.append(el('p', 'note', card.disclaimer));
      let n = 0;
      card.choices.forEach((c, i) => {
        // ตัวเลือกประตูเข้าสายที่ยังไม่เปิด (โฟกัสใบ 04) ไม่บอกว่ามีอยู่ — ต่างจากตัวที่ล็อกด้วยเงิน/ค่าสถานะ
        if (card.hidden?.[i]) return;
        const why = lockText(card, i);
        // ตัวเลือกที่ล็อกยังแสดงให้เห็นทางที่พลาด · ป้ายผลแทนด้วยเหตุผลที่กดไม่ได้
        const fx = why ?? card.fx?.[i];
        const b = numbered(button(c, fx, () => {
          veil(card, i);
          play(lifePick(i));
          if (card.kind === 'upgrade') upgradeFx(card, i);
        }, card.hints?.[i]), ++n);
        if (card.kind === 'upgrade' && card.desc?.[i]) b.firstChild.append(el('small', 'idesc', card.desc[i]));
        if (why) b.disabled = true;
        choices.append(b, ...loanButtons(card, i));
      });
      // การ์ดเล่าเรื่อง (choices: []) ไม่มีปุ่มให้เลือก — ต้องมีทางไปใบถัดไป
      if (!card.choices.length) choices.append(enter(button(BTN.next, null, next)));
      const tip = whisperFor(card);
      if (tip) body.append(tip);
      if (card.choices.length > 1) choices.append(foldLater(box, body, choices, card));
    }
  }
  box.append(body, choices, ...after);
  root.append(panels(box, false), lifeMenu(card, box));
  shelfDot();
  fxCard(box, card);
}

// กล่องกระซิบ (B117): สอนระบบที่เพิ่งโผล่ครั้งแรกตามวัย ในเสียงยาย · บอกแค่ทิศ ไม่บอกตัวเลข/สูตร/บัญชีบุญบาป (กติกาเดียวกับ B31)
// ค่าสถานะแต่ละตัวอธิบายอยู่ที่ "ค่าสถานะเหล่านี้หมายถึงอะไร?" แล้ว (B31) — ที่นี่สอนเฉพาะกลไกบนการ์ด
// อ่านการ์ดอย่างเดียว ไม่มี token ในเซฟ ⇒ ผลเกม/บอทไม่ขยับ
const WHISPER_KEY = 'next-life-whisper-v1';
const WHISPERS = [
  ['locked', (c) => c.locked?.some(Boolean), 'ปุ่มจาง ๆ คือทางที่ตอนนี้ยังไปไม่ได้ เหตุผลเขียนไว้บนปุ่ม บางทางแค่รอโตอีกหน่อยหรือมีเงินพอ'],
  ['chance', (c) => c.fx?.some((f) => /สำเร็จ|เสี่ยง/.test(f ?? '')), 'ทางที่บอกโอกาสสำเร็จหรือความเสี่ยงไว้ ผลยังไม่แน่นอน ค่าสถานะตอนนี้ช่วยเอียงผลได้บ้าง'],
  ['school', (c) => c.id?.startsWith('school_gate_'), 'เรียนจบชั้นหนึ่งแล้วจะเรียนต่อหรือออกมาทำงานก็ได้ ความรู้ช่วยสอบเข้าที่ดี ส่วนเงินที่บ้านตัดสินว่าที่ไหนส่งไหว'],
  ['job', (c) => c.id === 'first_job', 'งานแรกขึ้นกับวุฒิที่มี คนรู้จักเยอะยิ่งเจองานค่าแรงดี รายได้ต่อเดือนดูได้ที่ปุ่ม เงิน ในเมนูท้ายจอ'],
  ['alloc', (c) => c.kind === 'alloc', 'ทุกช่วงได้ทบทวนเงินเก็บ ตัวเลขที่เห็นเป็นผลของช่วงที่ผ่านมา ไม่ได้บอกช่วงหน้า และของแพงขึ้นทุกปี เงินที่เก็บเฉย ๆ จึงซื้อของได้น้อยลง'],
  ['debt', (c) => c.fx?.some((f) => /กู้/.test(f ?? '')), 'กู้มาแล้วต้องผ่อนทุกปี หนี้ที่ท่วมรายได้อยู่นาน ๆ พาไปถึงล้มละลายได้'],
];
function whisperRead() {
  try {
    const w = JSON.parse(localStorage.getItem(WHISPER_KEY) ?? '{}');
    return { seen: Array.isArray(w.seen) ? w.seen : [], off: Array.isArray(w.off) ? w.off : [] };
  } catch {
    return { seen: [], off: [] };
  }
}
function whisperWrite(w) {
  try {
    localStorage.setItem(WHISPER_KEY, JSON.stringify(w));
  } catch {
    // ไม่มีที่เก็บ — กระซิบซ้ำได้ทุกครั้งที่เจอ ดีกว่าไม่สอนเลย
  }
}
// เรื่องที่เคยกระซิบแล้วไม่กระซิบซ้ำทุกชาติ (เห็นครั้งเดียวต่อเครื่อง) · ปุ่มปิดมีผลแค่ชาตินี้ ชาติหน้าเรื่องที่ยังไม่เคยเห็นกลับมาสอนต่อ
// เก็บชาติที่ปิดไว้แค่ไม่กี่ชาติล่าสุด — ชาติเก่ากว่านั้นไม่มีทางกลับไปเล่นแล้ว
const WHISPER_OFF_KEEP = 8;
const lifeKey = () => `${save?.seed}:${st.gen}`;
function whisperFor(card) {
  const w = whisperRead();
  if (w.off.includes(lifeKey())) return null;
  const hit = WHISPERS.find(([id, when]) => !w.seen.includes(id) && when(card));
  if (!hit) return null;
  // นับว่าเห็นตั้งแต่ขึ้นจอ: กดตัวเลือกไปเลยโดยไม่ปิดกล่องก็ไม่กระซิบเรื่องเดิมซ้ำ
  w.seen.push(hit[0]);
  whisperWrite(w);
  const box = el('aside', 'whisper');
  box.setAttribute('aria-label', 'ยายกระซิบ');
  box.append(el('div', 'h', 'ยายกระซิบ'), el('p', null, hit[2]));
  const row = el('div', 'whisper-row');
  const ok = el('button', 'more', 'รู้แล้ว');
  ok.onclick = () => box.remove();
  const mute = el('button', 'more', 'ชาตินี้ไม่ต้องแนะนำแล้ว');
  mute.onclick = () => {
    const now = whisperRead();
    now.off = [...now.off.filter((k) => k !== lifeKey()), lifeKey()].slice(-WHISPER_OFF_KEEP);
    whisperWrite(now);
    box.remove();
  };
  row.append(ok, mute);
  box.append(row);
  return box;
}

// ปุ่ม "พับไว้ก่อน" (B117): ซ่อนเรื่องกับตัวเลือก กางแผงสถานะทั้งหมดให้ดูรวดเดียว แล้วกลับมาเลือกที่การ์ดเดิม
// ไม่ใช่ตัวเลือกของเกม — ไม่มีเลขปุ่มลัด ไม่ลงเซฟ · ตอนกลับคืนแผงที่กางไว้ให้เป็นอย่างเดิม
function foldLater(box, body, choices, card) {
  const later = el('button', 'more later', 'พับไว้ก่อน ไปดูสถานะ');
  later.onclick = () => {
    const folds = [...box.querySelectorAll(':scope > .p-left > details')];
    const was = folds.map((d) => d.open);
    folds.forEach((d) => (d.open = true));
    body.hidden = choices.hidden = true;
    const bar = el('div', 'choices folded');
    bar.append(el('p', 'note', `การ์ดรอให้เลือกอยู่ · ${clip(card.title ?? card.text, 48)}`));
    const back = enter(button('กลับมาเลือก', null, () => {
      folds.forEach((d, i) => (d.open = was[i]));
      bar.remove();
      body.hidden = choices.hidden = false;
      choices.querySelector('button.choice:not(:disabled)')?.focus();
    }));
    bar.append(back);
    // ต่อท้ายพาแนลกลาง (ที่เดียวกับปุ่มเดิม) — ต่อท้ายการ์ดตรง ๆ จอแนวนอนจะไปตกช่องกริดที่ไม่ได้จองไว้
    body.parentElement.append(bar);
    scrollTo(0, 0);
    back.focus({ preventScroll: true });
  };
  return later;
}

// จอแนวนอนเตี้ย (B131 แบบ C2): ห่อลูกการ์ดเป็นพาแนลซ้าย (หัว ค่าสถานะ แผง) · กลาง (เรื่องต่อด้วยปุ่ม) · ขวา (สมุด · ฉายา)
// จอตั้งตัวห่อเป็น display:contents และพาแนลขวาซ่อน ⇒ หน้าตาเดิม · ห่อทุกขนาดจอ หมุนจอกลางเกมจึงไม่ต้องวาดการ์ดใหม่
// กริดวางหลายลูกต่อกันในคอลัมน์เดียวโดยแถวไม่สูงตามคอลัมน์ข้าง ๆ ไม่ได้ จึงต้องมีตัวห่อ
// side = false: ฉากที่มีเมนูล่าง เข้าสมุดจากเมนูแล้ว พาแนลขวาจะซ้ำ จึงเหลือสองคอลัมน์
function panels(box, side = true) {
  const left = el('div', 'p-left');
  const mid = el('div', 'p-mid');
  for (const k of [...box.children]) (k.classList.contains('body') || k.classList.contains('choices') ? mid : left).append(k);
  box.classList.add('pn');
  box.append(left, mid);
  if (side) box.append(sidePanel());
  else box.classList.add('pn2');
  return box;
}
// พาแนลขวา (ฉากที่ยังไม่มีเมนูล่าง): ทางเข้าชั้นสมุด + ความคืบหน้าสมุดฉายา + ของติดตัว (หัวเดียวกับแผงตัวฉัน เมื่อ itemsVisible)
// ปุ่มเป็นลิงก์ ไม่ใช่ตัวเลือกของเกม — ไม่มีเลขปุ่มลัด เปิดชั้นสมุดแล้วกลับมาการ์ดเดิม
function sidePanel() {
  const side = el('aside', 'p-side');
  const kit = itemsVisible(st);
  side.setAttribute('aria-label', kit ? 'สมุด ฉายา และของติดตัว' : 'สมุดและฉายา');
  const b = bookRead();
  const p = picsRead();
  side.append(el('div', 'h', 'สมุด'), el('p', 'note', `อนุสรณ์ ${memoRead().l.length} ชีวิต · ภาพบ้านเมือง ${picsGot(p)}/${PIC_ALL}`), shelfButton('เปิดชั้นสมุด'));
  side.append(el('div', 'h', 'ฉายา'), el('p', 'note', `สะสมแล้ว ${bookGot(b)}/${BOOK_ALL}`), shelfBar(bookGot(b), BOOK_ALL), shelfButton('ดูสมุดฉายา', 't'));
  if (kit) side.append(el('div', 'h', 'ของติดตัว'), kitList());
  return side;
}

const genLabel = () => (st.gen > 1 ? `รุ่นที่ ${st.gen} · ` : '');
// ฉากจริงจังใช้ชื่อจริง ที่เหลือคงชื่อเล่นให้ขำ · เซฟค้างระหว่างชาติจาก build เก่าไม่มี realName จึงตกไปชื่อเล่นล้วน ไม่มีวงเล็บว่าง
const realName = () => st.realName ?? st.name;
const fullName = () => (st.realName && st.realName !== st.name ? `${st.realName} (${st.name})` : st.name);

// การ์ดชวนไปต่างโลก (B68d): กรอบสีต่างโลกโผล่กลางการ์ดชีวิต · กดรับแล้วย้อนไม่ได้ จึงถามซ้ำก่อนส่งให้เอนจิน
// การถามซ้ำอยู่ที่จอล้วน ไม่ลงเซฟ — เซฟเก็บเฉพาะปุ่มที่ไปถึงเอนจิน · ปฏิเสธกดทีเดียวพอ
// จอไม่บอกว่ารับแล้วตาย หายตัว หรือได้กลับ — คำถามยืนยันจึงใช้ประโยคเดียวทุกใบ ผู้เล่นรู้จากเรื่องหลังกดรับ
function entryOffer(card, body, choices) {
  const gate = el('div', 'ix');
  // ข้อความในกรอบเป็น div ไม่ใช่ h3/p — กฎสีของแนวการ์ดไทยจับ .body h3/.body p แล้วจะทับสีต่างโลก
  gate.append(el('span', 'ix-k', 'เสียงเรียกจากต่างโลก'), el('div', 'ix-t', card.text));
  body.append(gate);
  const offer = () => choices.replaceChildren(...card.choices.map((c, i) => numbered(button(c, card.fx?.[i], () => (i === ENTRY.accept ? ask() : play(lifePick(i)))), i + 1)));
  const ask = () => {
    choices.replaceChildren(
      el('p', 'ix-ask', 'แน่ใจนะ ก้าวไปแล้วย้อนกลับมาเลือกใหม่ไม่ได้'),
      button('ยืนยัน ไปต่างโลก', null, () => play(lifePick(ENTRY.accept))),
      button('ยังก่อน', null, () => {
        offer();
        choices.querySelector('button').focus();
      }),
    );
    choices.querySelector('button').focus();
  };
  offer();
}

// ช่วยจริง (B145): สายด่วนสุขภาพจิตขึ้นทุกหน้าจบ — ขึ้นเฉพาะชีวิตที่ตายแบบหนึ่ง = ผู้เล่นอ่านสาเหตุที่ซ่อนไว้ออกจากปุ่ม (B110)
// ที่เหลือขึ้นตามเรื่องที่ชีวิตนี้เจอ · ไม่ลงภาพแชร์ · ลิงก์ออกนอกเกมเปิดแท็บใหม่ เกมที่ค้างอยู่ไม่หาย
const HELP_BY = { mind: () => true, drink: () => !!st.flags?.heavy_drinker, bankrupt: () => !!st.flags?.bankrupt || st.bankruptcies > 0 };
const HELP_MAX = 3;
function helpBox() {
  const box = el('div', 'recap help');
  box.append(el('div', 'h', 'ถ้าเรื่องในเกมใกล้ตัวคุณ'), el('p', 'sub', 'เรื่องในเกมจบแล้ว แต่ในชีวิตจริงมีคนรับฟังและช่วยได้ฟรี'));
  for (const h of HELP.filter((x) => HELP_BY[x.id]?.()).slice(0, HELP_MAX)) box.append(helpRow(h));
  const all = el('a', null, 'ดูทั้งหมด');
  Object.assign(all, { href: 'guide.html#help', target: '_blank', rel: 'noopener' });
  box.append(all, el('p', 'note', HELP_NOTE));
  return box;
}
// บรรทัดเตือนเนื้อหาชุดเดียวกับหน้าแรกเว็บ + สายด่วนสุขภาพจิต · ไม่ต้องกดรับ
function warnLine() {
  const mind = HELP.find((h) => h.id === 'mind');
  const p = el('p', 'warn-line', `ผู้เล่นวัยรุ่นขึ้นไป · เรื่องจริงบางเรื่องหนัก: ${warnWords()} · ถ้าเล่นแล้วไม่สบายใจ `);
  const call = el('a', null, `โทร ${mind.tel}`);
  call.href = `tel:${mind.tel}`;
  p.append(call, ' ได้ตลอด 24 ชม.');
  return p;
}
function helpRow(h) {
  const row = el('div', 'help-row');
  const call = el('a', 'help-call', `${h.label} · ${h.call}`);
  call.href = `tel:${h.tel}`;
  const web = el('a', null, 'เว็บทางการ');
  Object.assign(web, { href: h.web, target: '_blank', rel: 'noopener' });
  const org = el('small', null, `${h.org} · `);
  org.append(web);
  row.append(call, org);
  return row;
}

// แผงครอบครัว (B36c): คนรอบตัวตอนนี้ แยกจากผังตระกูลที่เล่ารุ่นก่อน · อ่านอย่างเดียว ไม่มี token ในเซฟ
// ใช้เฉพาะช่องที่ไล่ชื่อไว้ข้างล่าง — แกนเติมช่องใหม่ในสมาชิกก็ไม่หลุดขึ้นจอ · bond บอกเป็นป้ายคำ ไม่ใช่ตัวเลข
const FAMILY_ORDER = ['parent', 'spouse', 'child', 'grandchild', 'pet', 'herd', 'peer'];
const ANIMAL_ROLES = ['pet', 'herd'];
const kinWord = (m) => {
  const male = m.sex === 'ชาย';
  if (m.role === 'parent') return male ? 'พ่อ' : 'แม่';
  if (m.role === 'spouse') return m.left ? 'อดีตคู่' : male ? 'สามี' : 'ภรรยา';
  if (m.role === 'child') return male ? 'ลูกชาย' : 'ลูกสาว';
  if (m.role === 'grandchild') return male ? 'หลานชาย' : 'หลานสาว';
  if (m.role === 'pet') return m.kind ?? 'สัตว์เลี้ยง';
  if (m.role === 'herd') return `ฝูง${m.kind ?? 'สัตว์'}`;
  return 'เพื่อนรุ่น';
};
// แผงครอบครัว (ui-redo ใบ 06): คนในบ้าน · ผังตระกูล · กราฟฐานะตระกูล ย้ายจากแถบแท็บใต้หัวการ์ด · สัตว์อยู่ท้ายแผง แถวละตัว
// วาดตอนกดเปิดเท่านั้น — กราฟฐานะตระกูลแพง การ์ดส่วนใหญ่ผ่านไปโดยไม่มีใครเปิด
function familyPanel() {
  const all = familyOf(st);
  // แผงอยู่นอกการ์ด สีกราฟฐานะตระกูลผูกกับชุดสีการ์ด (.a) — ไม่ใส่ กราฟเป็นก้อนดำ
  const wrap = el('div', 'fam a');
  wrap.append(...kinParts(all.filter((m) => !ANIMAL_ROLES.includes(m.role))), ...clanParts(), ...kinParts(all.filter((m) => ANIMAL_ROLES.includes(m.role)), true));
  return wrap;
}
// แผงปรโลก (ui-redo ใบ 15): st ยังเป็นคนที่เพิ่งตายจนกว่าจะไปเกิด — แผงจึงอ่านชีวิตที่จบแล้วจากตัวเดียวกับการ์ดตาย
function pastPanel() {
  const why = causeOf(st.cause ?? 'other', st.age);
  const head = el('p', 'meta');
  metaLine(head, [fullName(), `${lifeEndWord(isGone(st))} ${st.age}`, why && `จากไป${why.join('')}`].filter(Boolean));
  const wrap = mePanel({ kind: 'death', job: jobText(st) });
  const kin = familyOf(st);
  const fam = el('div', 'fam');
  fam.append(...kinParts(kin.filter((m) => !ANIMAL_ROLES.includes(m.role))), ...kinParts(kin.filter((m) => ANIMAL_ROLES.includes(m.role)), true));
  wrap.prepend(head);
  if (fam.childElementCount) wrap.append(fam);
  return wrap;
}
// กราฟฐานะตระกูลผูกสีกับชุดการ์ด — ปรโลกใช้ชุดลายรดน้ำ (.b) ชุดกระดาษ (.a) ปนตัวแปรหน้าดำทองแล้วกราฟเป็นก้อนเทา
function clanPanel() {
  const wrap = el('div', 'fam b');
  wrap.append(...clanParts());
  return wrap;
}
// ชิ้นของแผงครอบครัวที่การ์ดตายแยกไปลงแท็บ ครอบครัว · ตระกูล (ui-redo ใบ 11)
// หัวนับเฉพาะคน — สัตว์นับแยกที่หัวของมันเอง ไม่งั้น "ยังอยู่ 3 คน" รวมหมากับฝูงไก่
function kinParts(members, animals = false) {
  if (!members.length) return [];
  if (animals) {
    const here = members.filter((m) => m.alive && !m.left).length;
    return [el('h3', null, here ? `สัตว์เลี้ยง · ยังอยู่ ${here}` : 'สัตว์เลี้ยง'), kinList(members)];
  }
  const alive = members.filter((m) => m.alive).length;
  return [el('h3', null, `คนในบ้าน · ยังอยู่ ${alive} ${alive === members.length ? 'คน' : `จาก ${members.length} คน`}`), kinList(members)];
}
// ผังตระกูลมีเมื่อเป็นรุ่นที่ 2 ขึ้นไป
function clanParts() {
  const out = [];
  if (st.lineage.length) out.push(el('h3', null, `ผังตระกูล · ${st.lineage.length} รุ่นก่อน`), lineageView(st.lineage, st.cls));
  out.push(
    el('h3', null, st.lineage.length ? `กราฟฐานะตระกูล · ${st.lineage.length + 1} รุ่น` : 'กราฟฐานะตระกูล'),
    standingChart(standingGens(st.lineage, standingNow(!!st.dead)), null, false) ?? el('p', 'sub', 'ยังมีจุดเดียว — กราฟขึ้นเมื่อถึงช่วงวัยถัดไป'),
  );
  return out;
}

// แท็บรายละเอียดการ์ดตาย (ui-redo ใบ 11 · ชุดแท็บที่เจ้าของเลือกในใบ 02) — วาดทุกแผงครั้งเดียว สลับด้วย hidden
// แท็บที่เปิดค้างจำต่อการ์ด: กลับจากชั้นสมุด/วาดซ้ำยังอยู่แท็บเดิม · ชีวิตถัดไปเริ่มที่สรุป
const DEATH_TABS = ['สรุป', 'ชีวิตนี้', 'ครอบครัว', 'ตระกูล', 'ฉายา', 'อนุสรณ์'];
const deathTabOf = new WeakMap();
function deathTabs(card, parts) {
  const wrap = el('div', 'd-tabs');
  const bar = el('div', 'd-tab-bar');
  bar.setAttribute('role', 'tablist');
  bar.setAttribute('aria-label', 'รายละเอียดชีวิตนี้');
  const tabs = DEATH_TABS.map((label, i) => {
    const b = el('button', null, label);
    b.type = 'button';
    b.id = `d-tab-${i}`;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', `d-pane-${i}`);
    b.onclick = () => pick(i);
    const pane = el('div', 'd-pane');
    pane.id = `d-pane-${i}`;
    pane.setAttribute('role', 'tabpanel');
    pane.setAttribute('aria-labelledby', b.id);
    pane.append(...parts[i]);
    return { b, pane };
  });
  const pick = (i, focus) => {
    deathTabOf.set(card, i);
    tabs.forEach(({ b, pane }, j) => {
      b.setAttribute('aria-selected', String(i === j));
      b.tabIndex = i === j ? 0 : -1;
      pane.hidden = i !== j;
    });
    // กล่องพับ (กราฟ · ยุค · ฉายา) มีแท็บของตัวเองแล้ว เปิดแท็บครั้งแรกคลี่ให้เลย — คลี่ตอนเปิดจริง จุดใหม่จึงหายเมื่อผู้เล่นได้เห็น
    // ครั้งเดียวต่อแผง ผู้เล่นพับเองแล้วสลับกลับมาไม่คลี่ซ้ำ
    const p = tabs[i].pane;
    if (!p.dataset.opened) {
      p.dataset.opened = '1';
      for (const d of p.querySelectorAll(':scope > * > details.fold')) d.open = true;
    }
    if (focus) tabs[i].b.focus();
  };
  // ลูกศรตามแบบ tablist — โฟกัสอยู่ในแถบ คีย์ลัดทั้งหน้าไม่ได้ใช้ลูกศรบนการ์ดตาย
  bar.onkeydown = (e) => {
    const at = tabs.findIndex(({ b }) => b === e.target);
    const n = tabs.length;
    const to = { ArrowRight: at + 1, ArrowLeft: at - 1 + n, Home: 0, End: n - 1 }[e.key];
    if (at < 0 || to === undefined) return;
    e.preventDefault();
    pick(to % n, true);
  };
  bar.append(...tabs.map((t) => t.b));
  wrap.append(bar, ...tabs.map((t) => t.pane));
  pick(deathTabOf.get(card) ?? 0);
  return wrap;
}
// แผงเงิน (ui-redo ใบ 07): ย้ายบรรทัดเงินใต้แถบสถานะมาเป็นช่องละแถว · ค่าชุดเดียวกับที่การ์ดเคยบอก ไม่เปิดตัวเลขที่เกมซ่อน
// ปุ่มกู้ยังอยู่บนการ์ดเพราะเป็นทางเลือกของการ์ดนั้น ไม่ใช่ข้อมูล
function moneyPanel(card) {
  const s = statsOf(st);
  // คนตายไม่มีรายได้ต่อ — การ์ดตายเห็นแค่ที่ทิ้งไว้
  const working = !st.dead && isWorking(st, card.age);
  // เงินกู้เป็นยอดค้างของสัญญา ไม่ใช่เงินติดตัวติดลบ จึงแยกช่อง ไม่หักรวมกัน
  const debt = Math.round(totalDebt(st));
  const rows = [
    ['เงินติดตัว', baht(s.money), s.money < 0],
    // ปีเกมใช้ภายในเท่านั้น หน้าจอบอกแค่อายุ (B14 ข้อ 12)
    !st.dead && ['รายได้', working ? `${baht(monthlyIncome(st, st.birthYear + card.age))}/เดือน` : 'ยังไม่มีงานทำ'],
    ['เงินกู้', debt > 0 ? baht(debt) : 'ไม่มี'],
    // เงินเทาแยกถุง ใช้จ่ายไม่ได้จนกว่าฟอก · ไม่เคยมีก็ไม่บอกว่ามีถุงนี้
    st.grey > 0 && ['เงินเทา', baht(st.grey)],
  ].filter(Boolean);
  const wrap = el('div', 'mo');
  const dl = el('dl');
  for (const [k, v, neg] of rows) dl.append(el('dt', null, k), el('dd', neg ? 'num neg' : 'num', v));
  wrap.append(dl, el('p', null, new Map(STAT_HELP).get('เงิน · หนี้')));
  return wrap;
}
// แผงเพิ่มเติม: ลิงก์ท้ายหน้าเดิมทั้งชุด — ฉากที่มีเมนูซ่อนท้ายหน้า ที่นี่จึงเป็นทางเข้าเดียว · ไม่มีหน้าตั้งค่า (ui-redo ข้อ 10)
function morePanel() {
  const ul = el('ul', 'mr');
  const day = el('button', null, 'ชาติประจำวัน');
  day.type = 'button';
  // ปิดลิ้นชักก่อน หน้าถามยืนยันจะได้เก็บการ์ดที่ไม่ inert ไว้คืนตอนยกเลิก · แผงค้างไม่ inert เก็บไปด้วยได้
  day.onclick = () => {
    unblockSheet();
    dayNew();
  };
  const link = (text, href) => Object.assign(el('a', null, text), { href });
  // อัปเดตล่าสุด: เปลี่ยนเนื้อแผงเดิมเป็นรายการรุ่นนี้ ปุ่มกลับไปการ์ดยังใช้ปิดได้เหมือนเดิม
  const news = el('button', null, NOTES_TITLE);
  news.type = 'button';
  news.onclick = () => {
    const sheet = wrap.closest('.sheet');
    sheet?.setAttribute('aria-label', NOTES_TITLE);
    const h = sheet?.querySelector('.sheet-h h2');
    if (h) h.textContent = NOTES_TITLE;
    wrap.replaceWith(notesPanel());
    notesMark();
    sheet?.querySelector('.sheet-x')?.focus();
  };
  for (const x of [day, news, link('คู่มือ', 'guide.html'), link('กลไกในเกม', 'about.html'), link('หน้าแรก', 'index.html')]) {
    const li = el('li');
    li.append(x);
    ul.append(li);
  }
  const wrap = el('div', 'mr-w');
  wrap.append(ul, el('p', null, 'เกม ไม่ใช่คำแนะนำการลงทุน'));
  return wrap;
}

// แจ้งอัปเดตในเกม (ui-redo 22 · เจ้าของเคาะ): มีรุ่นที่มีโน้ตซึ่งเบราว์เซอร์นี้ยังไม่เห็น (รวมคนเปิดครั้งแรก) → แผ่นทับจอแรกก่อนกดอะไร วันละไม่เกินครั้ง
// RELEASE_NOTES = รุ่นที่มีโน้ตใหม่สุดก่อน (build ดึงจากแพตช์โน้ต) · แผ่นรวมข้อของทุกรุ่นที่ยังไม่เห็น ไม่เกิน NOTES_MAX ข้อ · เปิดครั้งแรกเห็นแค่รุ่นล่าสุด
// key เก็บ { v: รุ่นล่าสุดที่มีโน้ตตอนปิดแผ่น, day: วันที่แผ่นขึ้นเองครั้งล่าสุด } · localStorage ใช้ไม่ได้ = ขึ้นทุกครั้งที่เปิดแต่ปิดได้ เกมเล่นต่อตามเดิม
// จอแรกของเซฟกลางชีวิตคือหน้า "เล่นต่อ" ไม่ใช่การ์ดที่ค้าง ⇒ แผ่นไม่แทรกกลางการ์ด · หน้า "เกมอัปเดตแล้ว" ของเซฟเก่ามีเรื่องให้อ่านอยู่แล้ว ไม่ซ้อน
const NOTES_KEY = 'next-life-notes-seen-v1';
const NOTES_TITLE = 'อัปเดตล่าสุด';
const NOTES_MAX = 5;
let notesSkip = false;
const notesDay = () => new Date().toLocaleDateString('en-CA');
function notesRead() {
  try {
    const s = JSON.parse(localStorage.getItem(NOTES_KEY) ?? 'null');
    return s && typeof s === 'object' ? s : {};
  } catch {
    return {};
  }
}
function notesWrite(patch) {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify({ ...notesRead(), ...patch }));
  } catch {}
}
const notesMark = () => notesWrite({ v: RELEASE_NOTES[0]?.v });
// รุ่นที่ยังไม่เห็น: ใหม่กว่ารุ่นที่จำไว้ · ไม่เคยจำ = รุ่นล่าสุดรุ่นเดียว · รุ่นที่จำหลุดจากชุดที่ฝัง = ทั้งชุด (ถูกตัดที่ NOTES_MAX อยู่แล้ว)
function notesUnseen() {
  const { v } = notesRead();
  if (!v) return RELEASE_NOTES.slice(0, 1);
  const i = RELEASE_NOTES.findIndex((r) => r.v === v);
  return i < 0 ? RELEASE_NOTES : RELEASE_NOTES.slice(0, i);
}
function notesPanel(log = RELEASE_NOTES.slice(0, 1)) {
  const wrap = el('div', 'nt');
  const vs = log.map((r) => r.v);
  wrap.append(el('p', 'nt-v', vs.length > 1 ? `เวอร์ชัน ${vs.at(-1)} ถึง ${vs[0]}` : `เวอร์ชัน ${vs[0] ?? APP_VERSION}`));
  const items = log.flatMap((r) => r.items);
  const ul = el('ul', 'nt-l');
  for (const t of items.slice(0, NOTES_MAX)) ul.append(el('li', null, t));
  const all = Object.assign(el('a', null, items.length > NOTES_MAX ? `ดูทั้งหมด ${items.length} ข้อในแพตช์โน้ต` : 'อ่านแพตช์โน้ตทุกเวอร์ชัน'), { href: vs[0] ? `whatsnew.html#:~:text=${vs[0]}` : 'whatsnew.html' });
  wrap.append(ul, all);
  return wrap;
}
function notesBoot() {
  if (notesSkip || notesRead().day === notesDay()) return;
  const log = notesUnseen();
  const box = root.firstElementChild;
  if (!log.length || !box) return;
  notesWrite({ day: notesDay() });
  openSheet(NOTES_TITLE, notesPanel(log), box, null);
  const shut = sheetClose;
  sheetClose = () => {
    notesMark();
    shut();
  };
}
function kinList(members) {
  const rank = (m) => FAMILY_ORDER.indexOf(m.role) * 2 + (m.alive ? 0 : 1);
  const ul = el('ul', 'picks');
  members
    .map((m, i) => ({ m, i }))
    .sort((a, b) => rank(a.m) - rank(b.m) || (a.m.order ?? 0) - (b.m.order ?? 0) || a.i - b.i)
    .forEach(({ m }) => {
      const who = m.name ? `${kinWord(m)} · ${m.name}` : kinWord(m);
      const row = (text, gone) => ul.append(el('li', gone ? 'gone' : null, text));
      // ฝูงเป็นทรัพย์สิน นับเป็นหน่วยเดียว — ไม่มีอายุรายตัวหรือความผูกพันให้บอก
      if (m.role === 'herd') return row(m.alive && !m.left ? `${who} · เลี้ยงไว้` : `${who} · หมดไปแล้ว`, !m.alive || !!m.left);
      // ยกให้คนอื่น/หายไป ≠ ตาย — จางไม่ขีด (ตัวที่ยกให้แล้วตายภายหลังก็ยังเป็นตัวที่ยกให้)
      if (m.role === 'pet' && m.left) return row(`${who} · ไม่ได้อยู่กับเราแล้ว`, true);
      // ตาย (ui-redo ใบ 28): ขีดเฉพาะชื่อ แถวไม่จาง อายุที่จากไปอ่านง่าย
      if (!m.alive) {
        const li = el('li', 'dead');
        li.append(el('s', null, who), ` · ${m.diedAge != null ? `จากไปตอนอายุ ${m.diedAge}` : 'จากไปแล้ว'}`);
        return ul.append(li);
      }
      row([who, m.age != null && `อายุ ${m.age}`, m.left ? 'แยกทางแล้ว' : m.bondLevel].filter(Boolean).join(' · '), false);
    });
  return ul;
}

// คู่ใจที่ตายก่อนเรามารอเดินไปปรโลกด้วย (B44) — เฉพาะตัวที่ดูแลดี (ป้าย "สนิท" ขึ้นไปในแผงครอบครัว)
// ไม่มีผลต่อคำตัดสิน · ไม่ใช่การ์ดใหม่ จึงไม่มี token ในเซฟ · ตัวที่ยกให้คนอื่น/หายไปไม่นับ
const PET_WAIT_BOND = 60;
const PET_WAIT_MAX = 3;
function petsWaiting(s) {
  const pets = (s.kin ?? []).filter((m) => m.role === 'pet' && !m.alive && !m.left && (m.bond ?? 0) >= PET_WAIT_BOND);
  if (!pets.length) return null;
  const call = (m) => (m.name ? `เจ้า${m.name} ${m.kind ?? 'สัตว์'}ที่เคยเลี้ยง` : `${m.kind ?? 'สัตว์'}ที่เคยเลี้ยง`);
  const shown = pets.slice(-PET_WAIT_MAX).map(call);
  const more = pets.length - shown.length;
  const who = more ? `${shown.join(' ')} และอีก ${more} ตัว` : shown.length > 1 ? `${shown.slice(0, -1).join(' ')} กับ${shown.at(-1)}` : shown[0];
  return `ระหว่างทาง ${who} นั่งรออยู่ข้างทาง แล้วเดินตามไปด้วยจนถึงหน้าปรโลก`;
}

const clip = (t, n) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);

// เลือกสกิลลงสมุด 1 อย่าง (06s) บนการ์ดจบต่างโลก/การ์ดปรโลก — นอกลำดับปุ่มเซฟ แกนไม่เปลี่ยนสถานะ ไม่กดก็ไปต่อได้
// key = การ์ดใบนี้ของชีวิตนี้ · รีโหลดกลับมาที่ใบเดิมเห็นว่าลงไปแล้ว
function earnBox(earn, key) {
  const box = el('div', 'recap earn');
  const done = (line) => box.replaceChildren(el('div', 'h', 'ลงสมุดสกิลแล้ว'), ...(line ? [el('p', 'sub', line)] : []), shelfButton(`เปิดชั้นสมุด · สกิล ${skillsGot(skillsRead())}/${SKILL_IDS.length}`, 'k'));
  if (skillsRead().e.includes(key)) {
    done(null);
    return box;
  }
  box.append(el('div', 'h', 'เลือกสกิล 1 อย่างลงสมุด'), el('p', 'sub', 'สกิลในสมุดเลือกพกไปชาติหน้าได้ · ได้ซ้ำ = ขั้นในสมุดขึ้น'));
  const book = skillsRead().s;
  for (const x of earn) {
    const was = book[x.id] ?? 0;
    const to = skillBookAdd(book, x.id, x.lv).book[x.id];
    const tag = !was ? `ใหม่ · ขั้น ${to}` : to > was ? `ขั้น ${was} → ${to}` : 'ขั้นสูงสุดแล้ว';
    const b = button(x.name, tag, () => {
      const r = skillsEarn(key, x.id, x.lv);
      if (!r) return done(null);
      done(r.was ? (r.lv > r.was ? `${x.name} ขึ้นเป็นขั้น ${r.lv}` : `${x.name} ขั้นสูงสุดอยู่แล้ว`) : `${x.name} · ขั้น ${r.lv}`);
      if (!fxReduced() && r.lv > r.was) fxPlay(fxOv(), 'title', { tier: r.lv >= SKILL.top ? 'legend' : 'rare', name: x.name, sub: r.was ? `สกิลขึ้นขั้น ${r.lv}` : 'สกิลใหม่ลงสมุด' });
    });
    b.firstChild.append(el('small', 'idesc', ISEKAI_SKILLS[x.id].desc));
    // ขั้นสูงสุดแล้ว ลงซ้ำไม่ได้อะไร — กันเสียสิทธิ์เลือกของการ์ดใบนี้
    if (to === was) b.disabled = true;
    box.append(b);
  }
  return box;
}

// การ์ดฝึกสกิล (06s): ตราเหรียญชื่อสกิลหลังกด · ปุ่มท้าย (ยังไม่ฝึก) ไม่มีเอฟเฟกต์ · ขั้นใหม่อ่านจากป้ายปุ่มที่แกนเขียน
function upgradeFx(card, i) {
  if (i >= card.choices.length - 1 || fxReduced()) return;
  const [name] = card.choices[i].split(' · ');
  const lv = /→ (\d+)$/.exec(card.choices[i])?.[1];
  fxPlay(fxOv(), 'title', { tier: +lv >= SKILL.top ? 'legend' : 'rare', name, sub: lv ? `สกิลขึ้นขั้น ${lv}` : 'สกิลขึ้นขั้น' });
}

// เลือกพกก่อนไปเกิด (06s): จากสมุดสกิล ≤ SKILL.carry แล้วไปเกิดด้วยปุ่มเซฟเดิม — ชุดที่พกอยู่ในสถานะชีวิตใหม่ ภาพถ่ายเซฟเก็บไปเอง
// สมุดว่าง = ไปเกิดทันทีเหมือนก่อนมีสกิลข้ามชาติ · บรรทัดตามไป/ไม่ตามไป (dsd-2) ไม่บอกตัวเลข
// carryOffered = การ์ดเลือกขึ้นจริง ⇒ ช่องที่ไม่พกแลกเป็นค่าเริ่ม (decisions 355) · สมุดว่างไปเกิดทันที ไม่ได้
let carryNext = [];
let carryOffered = false;
function rebirth() {
  const offers = bookCarryOffers(skillsRead().s);
  if (!offers.length) return play(T.rebirth);
  const prev = [...root.childNodes];
  const pick = [];
  const draw = () => {
    const choices = homeCard('ก่อนไปเกิด', ['เลือกสกิลที่จะพกไปชาติหน้า', `พกได้ ${SKILL.carry} อย่าง ใช้ทั้งชีวิตไทยและชาติต่างโลกที่ตามมา · ทุกอย่างเริ่มขั้น 1 แต่ฝึกถึงขั้นในสมุดได้เร็วกว่าครั้งแรก`, 'ช่องที่ไม่พก ชาติหน้าได้พื้นฐานดีขึ้นแทน']);
    const body = root.querySelector('.body');
    const name = (id) => ISEKAI_SKILLS[id].name;
    const left = offers.filter((o) => !pick.includes(o.id));
    body.append(el('p', 'sub', pick.length ? `ตามไป: ${pick.map(name).join(' · ')}` : 'ตามไป: ไม่มีสกิลใดตามไป'));
    if (left.length) body.append(el('p', 'sub', `ไม่ตามไป: ${left.map((o) => o.name).join(' · ')} — ยังอยู่ในสมุด`));
    for (const o of offers) {
      const on = pick.includes(o.id);
      const full = !on && pick.length >= SKILL.carry;
      const b = button(o.name, full ? `พกครบ ${SKILL.carry} แล้ว` : on ? 'พกไป' : `ขั้น ${o.lv} ในสมุด`, () => {
        if (on) pick.splice(pick.indexOf(o.id), 1);
        else pick.push(o.id);
        draw();
        root.querySelector(`[data-skill="${o.id}"]`)?.focus();
      });
      b.dataset.skill = o.id;
      b.setAttribute('aria-pressed', String(on));
      b.firstChild.append(el('small', 'idesc', o.desc));
      if (full) b.disabled = true;
      choices.append(b);
    }
    choices.append(enter(button(pick.length ? 'ไปเกิดพร้อมสกิลที่พก' : 'ไปเกิดโดยไม่พกสกิล', null, () => {
      carryNext = [...pick];
      carryOffered = true;
      play(T.rebirth);
    })), button('กลับ', null, () => root.replaceChildren(...prev)));
  };
  draw();
}

// ช่วงที่ 7 (ใบ 05 · 09): การ์ดลายรดน้ำทุกใบ · ไม่มีแถบค่าสถานะชีวิต — ชีวิตจบแล้ว (วงปรโลกมีแถบ 4 ค่าของตัวเอง)
const AFTER_KICKER = { transfer: 'ส่วนบุญจากคนข้างหลัง', devaduta: 'ปรโลก', realm: 'ภูมิปลายทาง', ancestor: 'ผีบรรพบุรุษ', loop: 'ปีทิพย์' };
const AFTER_TOP = { verdict: 'ปรโลก', path: 'ทางเกิด', carry: 'ส่งไปเกิด', result: 'ผลที่ตามมา', loopEnd: 'ครบวง' };
const AFTER_REALM_ART = { deva: 'after_heaven', hell: 'after_hell' };
// วงปรโลก (03a): แถว 4 ค่าแบบแถบสถานะ ใต้หัวการ์ด · ชีวิตทิพย์ต่ำ = สีเตือนแบบชีวิต
function loopBar(l) {
  const ul = el('ul', 'sb-m');
  for (const k of LOOP_KEYS) ul.append(meterLi(LOOP_LABELS[k], Math.round(l[k]), k === 'health' && l[k] <= HEALTH_WARN));
  // กรอบ .sb ให้ระยะขอบเท่าแถบสถานะชีวิต
  const bar = el('div', 'sb');
  bar.append(ul);
  return bar;
}
function renderAfter(card) {
  if (card.kind === 'isekai') return renderIsekai(card);
  root.replaceChildren();
  const box = el('article', 'card b af');
  const top = el('div', 'top');
  // หัวแถบเป็นชื่อเกมเหมือนหน้าเปิด (ui-redo 66 · เจ้าของ) · ฉากที่อยู่บอกด้วยป้ายบนการ์ดแทน
  top.append(el('b', null, GAME_NAME), el('small', null, card.loop ? `${genLabel()}${st.name} · ภูมิ${af.verdict.realm.name} · ปีที่ ${card.loop.year}/${card.loop.years}` : `${genLabel()}${st.name} · ${lifeEndWord(isGone(st))} ${st.age}`));
  const body = el('div', 'body');
  const choices = el('div', 'choices');
  const next = () => play(T.afterNext);
  const court = card.kind === 'verdict' || card.scene === 'devaduta';
  // ภาพปรโลก (ui-redo 15): ศาลบนการ์ดตัดสิน · สวรรค์/นรกเฉพาะการ์ดที่อยู่ในภูมินั้นแล้ว (ภูมิปลายทาง · วงปี) — ภูมิอื่นยังไม่มีภาพ
  const realm = (card.loop || card.scene === 'realm') && af.verdict?.realm?.id;
  const pic = court ? 'after_court' : AFTER_REALM_ART[realm];
  if (pic) body.append(sceneSvg(pic, false));
  body.append(el('span', 'kicker', card.kind === 'scene' ? AFTER_KICKER[card.scene] : AFTER_TOP[card.kind]));
  if (card.title) body.append(el('h3', null, card.title));
  if (card.scene === 'devaduta') {
    const wait = petsWaiting(af.st);
    if (wait) body.append(el('p', 'sub', wait));
  }
  if (card.kind === 'verdict') body.append(el('h3', null, `ภูมิ${card.realm}`));
  body.append(el(card.title || card.kind === 'verdict' ? 'p' : 'h3', card.title || card.kind === 'verdict' ? null : 'lead', card.text));
  if (card.reckoning) body.append(reckoningBox(card.reckoning, af.st.deeds));
  if (card.earn) body.append(earnBox(card.earn, `${save.seed}:${st.gen}:v`));
  if (card.lineage) {
    body.append(el('div', 'kicker', 'ผังตระกูล'));
    body.append(af.heir ? lineageView(af.heir.lineage, af.heir.cls, af.heir.lineage.length, 'รุ่นถัดไป') : list(card.lineage, 'picks'));
    // การ์ดส่งต่อ (B95): ผังตระกูลรวมชีวิตที่เพิ่งจบแล้ว + จุดฐานะบ้านที่รุ่นถัดไปจะเกิด
    const chart = af.heir && standingChart(standingGens(af.heir.lineage), CLASSES.indexOf(af.heir.cls));
    if (chart) body.append(chart);
  }
  if (card.note) body.append(el('p', 'note', card.note));
  if (card.done) {
    choices.append(enter(button(BTN.rebirth, null, rebirth)));
    choices.append(button(BTN.newFamily, null, start));
  } else if (card.choices.length) {
    const offer = () => choices.replaceChildren(...card.choices.map((c, i) => {
      const why = lockText(card, i);
      const b = button(c, why ?? card.fx?.[i], () => (card.manual?.[i] ? heirPick(card, i, choices, offer) : play(afterPick(i))), card.hints?.[i]);
      if (why) b.disabled = true;
      return b;
    }));
    offer();
  } else choices.append(enter(button(BTN.next, null, next)));
  if (card.kind === 'verdict') choices.append(copyButton(() => summaryText(st.age, card.realm)));
  box.append(top);
  if (card.loop) box.append(loopBar(card.loop));
  box.append(body, choices);
  root.append(panels(box, false), lifeMenu(card, box, true));
  fxCard(box, card);
}

// หน้าเลือกผู้สืบสายเลือด (B76): แทนแถวปุ่มบนการ์ดทางใบเดิม · เลือกคนแล้วจึงลงเซฟ ถอยกลับไม่ลงเซฟ
// ลำดับตามรายชื่อของเอนจิน (card.heirs) ไม่เรียงใหม่ — ลำดับนี้คือเลขในเซฟ
function heirPick(card, i, choices, back) {
  const again = button('กลับไปเลือกทาง', null, () => {
    back();
    choices.querySelector('button.choice:not(:disabled)')?.focus();
  });
  again.dataset.prev = '';
  choices.replaceChildren(
    el('p', 'ix-ask', 'เลือกคนที่จะเล่นต่อ — เริ่มที่อายุจริงของเขาวันนี้ ไม่ย้อนไปวัยเด็ก'),
    ...card.heirs.map((h, k) => numbered(button(h.name, null, () => play(bloodPick(i, k)), `${kinWord(h)} · อายุ ${h.age} ปี`), k + 1)),
    again,
  );
  choices.querySelector('button').focus();
}

// ต่างโลก (B68): การ์ดแนวหน้าต่างสถานะของเกม · ปุ่มเดินผ่าน afterPick/afterNext ชุดเดียวกับระหว่างชาติ เซฟจึงเล่นซ้ำได้
const ISEKAI_KICKER = { world: 'ห้องสีขาว · เลือกชีวิตใหม่', skill: 'ของขวัญจากเทพธิดา · เลือกสกิล', focus: 'ช่วงวัยใหม่ · เลือกสิ่งที่ทุ่มเท', tick: 'จดหมายเหตุ', event: 'เหตุการณ์', result: 'ผลลัพธ์', end: 'ตอนจบในต่างโลก', warn: 'ใกล้ตาย', move: 'ทางแยก · เลือกแคว้น', upgrade: 'สกิลที่ติดตัว · เลือกฝึก' };
// จดหมายเหตุบนการ์ดจบ (B68b ชิ้น 3): แบ่งตามช่วงวัย เก่าอยู่บน ช่วงสุดท้ายเปิดค้าง (เจ้าของเคาะ)
// บรรทัดรับได้ทั้งสตริง "อายุ N · …" ของเซฟเก่า และ { age, until?, stage, kind, text, deltas } ของ engine — มี deltas ถึงขึ้น chip
// ตาหลายปีของ engine บอกปลายช่วงเป็น until · จอใช้ชื่อ to ชุดเดียวกับที่แยกจากสตริง
const CHRON_AGE = /^อายุ (\d+)(?:–(\d+))? · (.*)$/;
function chronEntry(x) {
  if (typeof x !== 'string') return { ...x, to: x.until ?? null };
  const m = CHRON_AGE.exec(x);
  // บรรทัดเหตุการณ์มีหัวเรื่องคั่น · ส่วนบรรทัดทุ่มเทเป็นประโยคเดียว · ไม่มีอายุ = บรรทัดระบบตอนเข้าโลก
  if (!m) return { age: null, kind: 'lore', text: x };
  return { age: Number(m[1]), kind: m[3].includes(' · ') ? 'event' : 'tick', text: m[3], to: m[2] ? Number(m[2]) : null };
}
function chronicleBox(lines, s) {
  const role = Object.keys(ISEKAI_ROLES).find((id) => roleInfo(id).name === s?.world);
  const pace = ISEKAI_ROLES[role]?.pace ?? 1;
  const stageOf = (e) => (e.stage && ISEKAI_STAGES.find((g) => g.id === e.stage)) || ISEKAI_STAGES.findLast((g) => (e.age ?? 0) >= g.from * pace);
  const label = isekaiLabels();
  const groups = [];
  for (const e of lines.map(chronEntry)) {
    const g = stageOf(e);
    if (groups.at(-1)?.g !== g) groups.push({ g, rows: [] });
    // ปีทุ่มเทที่ข้อความเดียวกันต่อกันรวมเป็นบรรทัดเดียว (เจ้าของเคาะ ~20 บรรทัด/ชีวิต) · เหตุการณ์คงแยก · ไม่ข้ามหัวช่วงวัยเพราะรวมในกลุ่มเดียวกันเท่านั้น
    const prev = groups.at(-1).rows.at(-1);
    if (e.kind === 'tick' && prev?.kind === 'tick' && prev.text === e.text && (prev.to ?? prev.age) + 1 === e.age) {
      const deltas = { ...prev.deltas };
      for (const [k, v] of Object.entries(e.deltas ?? {})) deltas[k] = (deltas[k] ?? 0) + v;
      groups.at(-1).rows[groups.at(-1).rows.length - 1] = { ...prev, to: e.to ?? e.age, deltas };
    } else groups.at(-1).rows.push(e);
  }
  const d = el('details', 'tree ichron');
  d.append(el('summary', null, `จดหมายเหตุทั้งชีวิต ${groups.reduce((n, x) => n + x.rows.length, 0)} บรรทัด`));
  groups.forEach(({ g, rows }, i) => {
    const aged = rows.filter((e) => e.age !== null);
    const from = aged[0]?.age;
    const to = aged.length ? Math.max(...aged.map((e) => e.to ?? e.age)) : null;
    const sec = el('details', 'istage');
    sec.open = i === groups.length - 1;
    sec.append(el('summary', null, `${g.name}${from === undefined ? '' : ` · อายุ ${from === to ? from : `${from}–${to}`}`} · ${rows.length} บรรทัด`));
    const ol = el('ol', 'ilog');
    for (const e of rows) {
      const li = el('li', e.kind);
      // บรรทัดเข้าโลกมีอายุไว้จัดช่วงวัย แต่เป็นเรื่องของโลก ไม่ใช่ปีของตัวละคร — ไม่ขึ้นเลขอายุ
      if (e.age !== null && e.kind !== 'lore') li.append(el('b', null, e.to ? `${e.age}–${e.to}` : String(e.age)));
      li.append(el('span', null, e.text));
      for (const [k, v] of Object.entries(e.deltas ?? {})) if (label[k] && v) li.append(el('small', v > 0 ? 'up' : 'down', `${label[k]} ${v > 0 ? '+' : ''}${v}`));
      ol.append(li);
    }
    sec.append(ol);
    d.append(sec);
  });
  return d;
}
// ป้ายค่าต่างโลกบนจอ — บารมีกับความคืบหน้าเป้าหมายยังคิดในแกนเกม แต่ไม่ขึ้นจอ (B162) ผลการ์ดที่แตะแค่สองค่านี้จึงไม่มีบรรทัดตัวเลข
function isekaiLabels() {
  const out = { hp: ISEKAI_HP, gold: 'ทอง', fame: 'ชื่อเสียง' };
  for (const k of ISEKAI_SHOWN) out[k] = ISEKAI_STAT[k];
  return out;
}
// แถบสถานะต่างโลก (ui-redo ใบ 13): โครง statusBar ค่าคนละชุด · ชีวิตต่างโลกถึง 0 ก็ตาย จึงเตือนที่เกณฑ์เดียวกับโลกนี้
// รูปตัวละครโลกนี้ไม่ใช่ร่างนี้ — วงกลมอักษรแรกของชื่อแทน · ไม่มีลูกศรปีนี้ เพราะการ์ดผลบอกตัวเลขที่ขยับอยู่แล้ว
function isekaiBar(card, s, where) {
  const bar = el('header', 'sb');
  const r1 = el('div', 'sb-r1');
  const ini = el('span', 'av ini', [...s.name][0]);
  ini.setAttribute('aria-hidden', 'true');
  const who = el('span', 'sb-who');
  // ช่องอาชีพต่างโลก = บทบาท/ชีวิตบนทวีป (ข้อ 60) · ทองไม่มีหลอดบนหัวการ์ด หลอดอยู่แผงตัวฉัน (ข้อ 162)
  who.append(el('b', null, s.name), whereLine(`${genLabel()}${st.name} · ${where}`), headJob(s.world));
  const age = el('span', 'sb-age');
  age.append(el('b', null, String(s.age)), el('small', null, ' ปี'));
  if (card.step !== 'end' && s.hp <= HEALTH_WARN) {
    bar.classList.add('dying');
    const heart = el('span', 'sb-heart');
    heart.insertAdjacentHTML('beforeend', HEART_ICON);
    heart.setAttribute('role', 'img');
    heart.setAttribute('aria-label', 'ใกล้ตาย');
    age.append(heart);
  }
  r1.append(ini, who, age);
  const ul = el('ul', 'sb-m');
  ul.append(meterLi(ISEKAI_HP, s.hp, s.hp <= HEALTH_WARN), ...ISEKAI_SHOWN.map((k) => meterLi(ISEKAI_STAT[k], s[k], false)));
  const row = el('div', 'hd-row');
  row.append(headCash('ทอง', s.gold.toLocaleString('en-US')));
  bar.append(r1, row, ul);
  return bar;
}
// เกจทองต่างโลก: หลอดเต็ม = ทองตั้งต้นของร่าง + ISEKAI_GOLD_SPAN · ทองที่หาได้ทั้งชาติแทบไม่ขึ้นกับทองตั้งต้น
// จึงบวกช่วงคงที่แทนการคูณ (ร่างเริ่ม 0 คูณแล้วเต็มตั้งแต่ทองก้อนแรก)
// ทองตั้งต้นอ่านจากตารางร่าง ไม่ใช่ทองหลังพกเงินโลกเดิมมา (ค่านั้นไม่ได้เก็บ) — ชาติที่พกมาหลอดเริ่มสูงกว่าได้
const ISEKAI_GOLD_SPAN = 3000;
const isekaiGoldStart = (k) => (k.role ? roleInfo(k.role) : ISEKAI_ROLES[CONT_LIFE.like]).stat.gold;
// 0–1 · null = ยังไม่มีร่าง (ปีแรกก่อนได้บทบาท/เผ่า) ไม่แสดงเกจ
function isekaiGoldFill(k, gold) {
  if (!k?.role && !k?.race) return null;
  return Math.min(1, Math.max(0, gold / (isekaiGoldStart(k) + ISEKAI_GOLD_SPAN)));
}
// แผงตัวฉันต่างโลก: ของที่เคยอัดในหน้าต่างสถานะบนการ์ด — ค่าเต็ม · ทอง ชื่อเสียง เผ่า · อาชีพ (สกิลอยู่แผงของมันเอง)
function isekaiMePanel(s) {
  const wrap = el('div', 'me');
  const ul = el('ul', 'me-m');
  ul.append(meterLi(ISEKAI_HP, s.hp, s.hp <= HEALTH_WARN), ...ISEKAI_SHOWN.map((k) => meterLi(ISEKAI_STAT[k], s[k], false)));
  // ชาติต่างโลกหลังตายอยู่ใน af.isekai · ทริประหว่างชาติไทยอยู่ใน st.trip
  const k = af?.isekai ?? st?.trip;
  const gold = isekaiGoldFill(k, s.gold);
  if (gold !== null) {
    const li = meterLi('ทอง', Math.round(gold * 1000) / 10, false, s.gold.toLocaleString('en-US'));
    li.classList.add('gold');
    // ขีด = ทองตั้งต้นของร่างจากตาราง (ไม่ใช่ทองหลังพกมา) · ร่างเริ่ม 0 ขีดชิดซ้ายมองไม่เห็น จึงไม่วาด
    const start = isekaiGoldFill(k, isekaiGoldStart(k));
    if (start > 0) {
      const tick = el('span', 'tick');
      tick.style.left = `${Math.round(start * 1000) / 10}%`;
      tick.title = 'ขีด = ทองตอนเริ่มชาติ';
      li.querySelector('.br').append(tick);
      li.append(el('span', 'sr', 'ขีดบนหลอดคือทองตอนเริ่มชาติ'));
    }
    ul.append(li);
  }
  const dl = el('dl');
  dl.append(el('dt', null, 'ทอง'), el('dd', null, s.gold.toLocaleString('en-US')), el('dt', null, 'ชื่อเสียง'), el('dd', null, String(s.fame)));
  const who = el('p', 'meta');
  metaLine(who, [s.race, s.world, `อายุ ${s.age}`, s.stage, s.focus && `ทุ่มเทกับ${s.focus}`].filter(Boolean));
  wrap.append(el('h3', null, 'ค่าสถานะ'), ul, dl, el('h3', null, 'ตัวตน'), who);
  // อาชีพตามโฟกัส (05a) — เซฟก่อนมีอาชีพไม่มีช่องนี้
  if (s.careers?.length) {
    const job = el('p', 'meta');
    metaLine(job, s.careers);
    wrap.append(el('h3', null, 'อาชีพ'), job);
  }
  return wrap;
}
function isekaiSkillPanel(s) {
  const wrap = el('div', 'me');
  if (!s.skills.length) {
    wrap.append(el('p', 'meta', 'ร่างนี้ยังไม่มีสกิล'));
    return wrap;
  }
  const chips = el('div', 'ichips');
  for (const name of s.skills) chips.append(el('span', 'ichip', name));
  wrap.append(chips);
  return wrap;
}
// เปลี่ยนความเร็วระหว่างแผงเปิด: armTick วนรอแผงปิดด้วยความเร็วใหม่อยู่แล้ว แต่จาก "หยุด" ไม่มีรอบไหนวนอยู่ จึงต้องตั้งใหม่เอง
function speedPanel() {
  const wrap = el('div', 'me');
  wrap.append(speedRow(() => tickAgain?.()), el('p', 'meta', 'ใบผลลัพธ์และใบที่ต้องเลือก หยุดรอเสมอ'));
  return wrap;
}
// แถบโฟกัสต่างโลก: หน้าตา/คลาสเดียวกับ focusBar โลกหลัก · กาง/พับในที่ ไม่สร้างกล่องใหม่ (armTick ถือกล่องนี้ไว้ดูว่าชี้/โฟกัสอยู่ไหม)
function isekaiFocusBar(card, pick) {
  const cur = card.focus;
  const wrap = el('div', 'focus ifocusbar');
  const btn = el('button', 'focus-btn');
  btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');
  const go = el('span', 'focus-go', 'เปลี่ยน');
  btn.append(el('span', 'focus-k', 'โฟกัส'), el('b', null, card.focusChoices[cur] ?? ''), el('span', 'focus-fx', card.focusFx?.[cur] ?? ''), go);
  const list = el('div', 'focus-pick');
  list.hidden = true;
  card.focusChoices.forEach((c, i) => {
    const b = el('button', i === cur ? 'on' : null);
    b.type = 'button';
    b.setAttribute('aria-pressed', String(i === cur));
    b.append(el('b', null, c), el('span', 'focus-fx', card.focusFx?.[i] ?? ''));
    b.onclick = () => (i === cur ? btn.click() : play(pick(i)));
    list.append(b);
  });
  btn.onclick = () => {
    list.hidden = !list.hidden;
    btn.setAttribute('aria-expanded', String(!list.hidden));
    go.textContent = list.hidden ? 'เปลี่ยน' : 'ปิด';
  };
  wrap.append(btn, list);
  return wrap;
}
// ตัวจับเวลา (B68b): ใบตาเดินเองแทนการกด "ต่อ" — ยิง afterNext ตัวเดียวกับปุ่ม เซฟจึงเล่นซ้ำได้เหมือนกดเอง
// ความเร็วจำแยก key ไม่อยู่ในเซฟ เพราะไม่เปลี่ยนผลของชีวิต · ×1 = ตาละ 2 วินาที (เจ้าของเคาะ)
const SPEED_KEY = 'next-life-isekai-speed-v1';
const SPEEDS = [1, 2, 4, 0];
const TICK_MS = 2000;
let speed = speedRead();
let tickTimer = null;
// ตั้งเวลาใบตาที่ค้างอยู่ใหม่ — null เมื่อใบปัจจุบันไม่เดินเอง
let tickAgain = null;
function speedRead() {
  try {
    const v = Number(localStorage.getItem(SPEED_KEY) ?? 1);
    return SPEEDS.includes(v) ? v : 1;
  } catch {
    return 1;
  }
}
function speedWrite(v) {
  speed = v;
  try {
    localStorage.setItem(SPEED_KEY, String(v));
  } catch {
    // ไม่มีที่เก็บ ก็จำแค่ในหน้านี้
  }
}
// พักไว้ระหว่างแท็บถูกซ่อน หรือผู้เล่นชี้/โฟกัสแผงทุ่มเทอยู่ — ไม่ให้ใบเปลี่ยนใต้มือ · ใบหลุดจากจอแล้ว (ไปหน้าอื่น) ไม่กด
// tok = token ของปุ่ม "ต่อ" ใบนั้น — ใบตาทริปกลางชีวิตเดินด้วย token ชีวิต ไม่ใช่ token ระหว่างชาติ
function armTick(box, panel, bar, tok) {
  clearTimeout(tickTimer);
  bar.style.animation = 'none';
  if (!speed) return;
  const ms = TICK_MS / speed;
  void bar.offsetWidth;
  bar.style.animation = `itick ${ms}ms linear forwards`;
  tickTimer = setTimeout(() => {
    if (!box.isConnected) return;
    // แถบโฟกัสกางอยู่ = ผู้เล่นกำลังเลือก เวลารอแม้เมาส์ออกนอกแถบ · ลิ้นชักเปิดอยู่ = การ์ดถูกบัง ใบไม่เปลี่ยนใต้แผง (แผงค้างไม่บัง เวลาเดินต่อ)
    if (panel.matches(':hover, :focus-within') || panel.querySelector('[aria-expanded="true"]') || root.querySelector('.sheet:not(.pin)') || document.hidden) return armTick(box, panel, bar, tok);
    play(tok);
  }, ms);
}
function speedRow(onChange) {
  const row = el('div', 'ispeed');
  row.setAttribute('role', 'group');
  row.setAttribute('aria-label', 'ความเร็วเวลา');
  for (const v of SPEEDS) {
    const b = el('button', null, v ? `×${v}` : 'หยุด');
    b.type = 'button';
    b.setAttribute('aria-pressed', String(v === speed));
    b.addEventListener('click', () => {
      speedWrite(v);
      for (const x of row.children) x.setAttribute('aria-pressed', String(x === b));
      onChange();
    });
    row.append(b);
  }
  return row;
}

// ผลทุ่มเทจากแกนเป็นคำรวม "พลัง · เวท ขึ้น" — แตกเป็นชิ้นละค่า ป้ายจึงได้ไอคอน+ลูกศรแบบเดียวกับการ์ดเหตุการณ์
const focusUp = (fx) => (fx?.endsWith(' ขึ้น') ? fx.slice(0, -' ขึ้น'.length).split(' · ').map((k) => `${k} ↑`).join(' · ') : fx);
function renderIsekai(card) {
  clearTimeout(tickTimer);
  tickAgain = null;
  root.replaceChildren();
  const box = el('article', 'card i');
  const s = card.status;
  const pick = card.trip ? lifePick : afterPick;
  const where = card.trip ? `ข้ามมาตอนอายุ ${card.life}` : `ชาติต่างโลกที่ ${card.run + 1}`;
  // ยังไม่มีร่างต่างโลก (ไม่มีค่าให้แถบ) — หัวการ์ดบรรทัดเดียวแบบเดิม
  let head = s && isekaiBar(card, s, where);
  if (!head) {
    head = el('div', 'top');
    head.append(el('b', null, 'ต่างโลก'), el('small', null, `${genLabel()}${st.name} · ${lifeEndWord(isGone(st))} ${st.age}`));
  }
  const body = el('div', 'body');
  const choices = el('div', 'choices');
  body.append(el('span', 'kicker', card.step === 'event' ? `${card.finale ? 'เหตุการณ์สุดท้าย' : 'เหตุการณ์'} · อายุ ${card.age}` : card.warn ? `${ISEKAI_KICKER.warn} · เลือกสิ่งที่ทุ่มเท` : ISEKAI_KICKER[card.step]));
  body.append(el('h3', null, card.title), el('p', null, card.text));
  if (card.step === 'result' && card.ok !== null) body.append(el('p', card.ok ? 'iok' : 'ibad', card.ok ? 'สำเร็จ' : 'พลาด'));
  const deltas = Object.entries(card.deltas ?? {});
  if (deltas.length) {
    const label = isekaiLabels();
    const shown = deltas.filter(([k]) => label[k]);
    if (shown.length) body.append(el('p', 'note', shown.map(([k, v]) => `${label[k]} ${v > 0 ? '+' : ''}${v}`).join(' · ')));
  }
  if (card.sys) body.append(el('p', 'isys', card.sys));
  if (card.note) body.append(el('p', 'isys', card.note));
  if (card.saves) body.append(el('p', 'isys', `สกิลช่วยไว้ ${card.saves} ครั้งในชาตินี้`));
  // คำสัญญาที่เทพธิดาฝากไว้ (B68e) — บอกแค่รักษาได้หรือไม่ บุญบาปของมันไปเฉลยที่ปรโลก
  if (card.step === 'end' && card.vow) {
    const v = el('div', `ivow ${card.vow.kept ? 'kept' : 'broke'}`);
    v.append(el('span', 'h', 'คำสัญญากับเทพธิดา'), el('blockquote', null, card.vow.text), el('b', null, card.vow.kept ? 'รักษาไว้ได้' : 'ผิดคำสัญญา'));
    body.append(v);
  }
  if (card.lore?.length) body.append(el('p', 'isys', `โลกนี้จะจำ${card.lore.length > 1 ? `${card.lore.slice(0, -1).join(' ')} และ${card.lore.at(-1)}` : card.lore[0]}ไว้หลังคุณจากไป`));
  // ต่างโลกไม่มีฉายาของตัวเอง — เบาะแสชี้ฉายาของโลกเดิมที่ชาติหน้ายังไปเก็บได้ (B108 ใช้สองโลก)
  if (card.step === 'end' && !card.trip) clueRow(body, (card.clue ??= titleClue(`${st.seed}:${st.gen}:i${card.run}`)));
  if (card.step === 'end' && card.earn) body.append(earnBox(card.earn, `${save.seed}:${st.gen}:${card.trip ? `t${card.life}` : `i${card.run}`}`));
  if (card.highlights?.length) body.append(el('p', 'isys', 'ฉากที่จำได้ไม่ลืม'), list(card.highlights, 'picks'));
  if (card.log?.length) {
    const d = el('details', 'tree');
    d.append(el('summary', null, `เส้นทางที่เลือก ${card.log.length} เหตุการณ์`), list(card.log, 'picks'));
    body.append(d);
  }
  if (card.chronicle?.length) body.append(chronicleBox(card.chronicle, s));
  // แถบโฟกัสบนใบตา (05a · ปุ่มเดียวกับโลกหลัก แทนกริดเปิดตลอดของ B68b): กด "เปลี่ยน" กางรายการ · กางอยู่/ชี้อยู่ = เวลาหยุดรอ (armTick)
  // ปุ่มเลือกยังเดินผ่าน pick เซฟจึงเล่นซ้ำได้ (ต่างจากโลกหลักที่เปลี่ยนนอกลำดับปุ่ม) · focusFx = ผลต่อปีของแต่ละทาง
  let panel = null;
  if (card.step === 'tick') panel = isekaiFocusBar(card, pick);
  if (card.choices.length) {
    card.choices.forEach((c, i) => {
      const why = card.locked?.[i];
      // ใบทุ่มเทจากการ์ดเตือน (B161) ติดป้าย "ฟื้นชีวิต" ที่ทางที่ engine ชี้
      const tags = [focusUp(card.fx?.[i]), card.step === 'focus' && i === card.current && 'ทำอยู่', card.step === 'focus' && i === card.suggest && 'แนะนำ · ฟื้นชีวิต'].filter(Boolean).join(' · ');
      const b = button(c, why ?? (card.step === 'focus' ? tags : card.fx?.[i]), () => {
        play(pick(i));
        if (card.step === 'upgrade') upgradeFx(card, i);
      });
      if (card.desc?.[i]) b.firstChild.append(el('small', 'idesc', card.desc[i]));
      if (why) b.disabled = true;
      choices.append(b);
    });
  }
  const nextTok = card.trip ? T.next : T.afterNext;
  if (!card.choices.length) choices.append(enter(button(BTN.next, null, () => play(nextTok))));
  box.append(head);
  if (panel) box.append(panel);
  // ใบผลลัพธ์/ใบเลือกหยุดรอเสมอ (เจ้าของเคาะ) — การ์ดเหลือแค่เส้นเวลาของใบที่เดินเอง ปุ่มความเร็วอยู่ในเมนู (ใบ 14)
  if (s && panel && !card.choices.length) {
    const bar = el('i');
    const t = el('div', 'itimer');
    t.append(bar);
    box.append(t);
    tickAgain = () => armTick(box, panel, bar, nextTok);
    tickAgain();
  }
  box.append(body, choices);
  root.append(panels(box, false), lifeMenu(card, box));
  shelfDot();
  fxCard(box, card);
}

// เซฟรุ่นเก่า (v1) = seed ต้นตระกูล + ลำดับปุ่มที่กด แล้วเล่นซ้ำตอนโหลด — เนื้อหาเปลี่ยนแล้วเล่นซ้ำได้คนละชีวิต
// เซฟรุ่นใหม่ (v2 · B128) = ภาพถ่ายสถานะจริง (engine snapshot) + สถานะหน้าจอ — อัปเดตเกมแล้วชีวิตที่ค้างยังเล่นต่อได้
// v1 ยังอ่านได้: เล่นซ้ำตรงการ์ดเดิม = เล่นต่อแล้วเขียนทับเป็น v2 ทันที
const SAVE_KEY = 'next-life-save-v1';
const SNAP_KEY = 'next-life-save-v2';
// ภาพถ่ายมีบัญชีบุญบาปข้างใน — xor รหัสตัวอักษรกับกุญแจคงที่ (7 บิตล่าง ไม่ข้ามช่วงอักษร ขนาดเท่าเดิม) กันเปิดดูใน storage เฉย ๆ
// เจ้าของเคาะ · ไม่ได้กันคนตั้งใจแกะ · base64 ทำให้เซฟโตสองเท่า (ไทย 3 ไบต์ต่อตัว) จึงไม่ใช้
const SNAP_XOR = [0x6e, 0x6c, 0x69, 0x66, 0x65, 0x32, 0x38];
const snapXor = (t) => {
  let out = '';
  for (let i = 0; i < t.length; i++) out += String.fromCharCode(t.charCodeAt(i) ^ SNAP_XOR[i % SNAP_XOR.length]);
  return out;
};
const snapHide = snapXor;
const snapShow = snapXor;
// ปุ่มละตัวอักษร: เลือกในชีวิต = 0-9a-z · เลือกระหว่างชาติ = A-Z · ที่เหลือเป็นเครื่องหมาย
const T = { next: '.', afterlife: '>', afterNext: ',', rebirth: '+' };
const lifePick = (i) => i.toString(36);
const afterPick = (i) => String.fromCharCode(65 + i);
// กู้มาจ่าย = token 3 ตัว "~<แหล่ง><ตัวเลือก>" · log เก่าไม่มี "~" จึงตัดทีละตัวอักษรได้เหมือนเดิม
const loanPick = (i, kind) => `~${LOAN_KINDS.indexOf(kind)}${i.toString(36)}`;
const LOAN_TOK = /^~([0-9])([0-9a-z])$/;
// เล่นต่อเป็นผู้สืบสายเลือด (B76) = "@<ทาง A-Z><ลำดับในรายชื่อ>" · รายชื่ออ่านจากสถานะที่เล่นซ้ำมาถึงจุดเดียวกัน ลำดับจึงตรงกันทุกครั้ง
const bloodPick = (i, k) => `@${afterPick(i)}${k.toString(36)}`;
const BLOOD_TOK = /^@([A-Z])([0-9a-z])$/;
const tokens = (log) => log.match(/[~@]..|[^]/g) ?? [];
let save = null;

// อายุของการ์ดชีวิตใบก่อน/ใบนี้ — จำใน apply ไม่ใช่ตอนวาด เพราะเล่นซ้ำจากเซฟไม่ได้วาดทุกใบ
let curAge = null;
function track(card) {
  // อายุบนการ์ดทริปเป็นอายุร่างกายในต่างโลก ไม่ใช่อายุชีวิตไทย
  if (af || card.kind === 'isekai') return card;
  prevAge = curAge;
  curAge = card.age;
  bookNote(card);
  return card;
}

// สมุดชีวิต (B48): จดตอนการ์ดผ่าน track — เล่นซ้ำจากเซฟก็ผ่านครบทุกใบ แกนเกมจึงไม่ต้องเก็บประวัติเพิ่ม
// เหตุการณ์บ้านเมืองที่ชีวิตนี้เห็น (B51) — จดตอนการ์ดผ่าน track เหมือนสมุดชีวิต เล่นซ้ำจากเซฟก็ได้ครบ
let eraSeen = [];
// ภาพในสมุดภาพบ้านเมืองที่ชีวิตนี้ปลด (B130): "e:<เหตุการณ์>" ภาพหลัก · "s:<เหตุการณ์>:<ช่อง>" ภาพตามวัย/ตามมา
// ลงสมุดตอนการ์ดตาย (picsAdd) — ชีวิตที่ยังไม่จบยังไม่นับ แบบเดียวกับสมุดฉายา
let picSeen = [];
let bookIntro = null;
function bookNote(card) {
  if (card.kind === 'intro') bookIntro = card;
  const era = card.kind === 'era' ? card.id : card.news && ERA_OF.get(card.id);
  if (era) eraSeen.push({ id: era, a: card.age });
  // ภาพหลักนับทุกการ์ดของเหตุการณ์ ไม่ใช่แค่ใบที่มีข่าวนำ — ผู้เล่นเห็นภาพยุคบนการ์ดใบนั้นแล้ว
  const pe = card.kind === 'era' ? card.id : ERA_OF.get(card.id);
  const ps = card.kind === 'event' && PIC_OF.get(card.id);
  for (const k of [pe && ERA_PICS[pe] && `e:${pe}`, ps && `s:${ps}`]) if (k && !picSeen.includes(k)) picSeen.push(k);
}
const bookReset = () => {
  eraSeen = [];
  picSeen = [];
  bookIntro = null;
};

// ปก → ฐานะตระกูล → หน้าสุดท้าย · ไม่มีหน้าเล่าเรื่องรายปี
function bookPages(death) {
  return [{ draw: (b) => coverPage(b, death) }, { draw: standPage }, { draw: (b) => endPage(b, death) }];
}

// หน้าฐานะตระกูล (B95) ก่อนหน้าสุดท้าย — รุ่นก่อนทั้งหมด + ชีวิตนี้ถึงวันตาย
function standPage(body) {
  body.append(el('span', 'kicker', 'ฐานะตระกูล'), el('h3', null, st.lineage.length ? `ตระกูลนี้ ${st.lineage.length + 1} รุ่น` : 'ฐานะตลอดชีวิตนี้'));
  const chart = standingChart(standingGens(st.lineage, standingNow(true)), null, false);
  if (chart) body.append(chart);
}

function coverPage(body, death) {
  body.append(el('span', 'kicker', 'สมุดชีวิต'), el('h3', null, fullName()), el('p', 'dates', `${genLabel()}อายุ 0–${death.age} ปี · ${provinceLabel(st)}`));
  if (bookIntro) body.append(el('p', 'sub', bookIntro.text));
}
function endPage(body, death) {
  body.append(el('span', 'kicker', `อายุ ${death.age}`), el('h3', 'lead', `${realName()} จากไปด้วยวัย ${death.age} ปี`));
  if (death.note) body.append(el('p', 'sub', death.note));
  if (death.funeral) body.append(el('p', 'sub', `งานศพ: ${death.funeral.text}`));
  if (death.funeral?.who) body.append(el('p', 'sub', death.funeral.who));
}

// พลิกเองทีละหน้า (คำตัดสินเจ้าของ) · เปิดหน้าไหนก็ไม่แตะ st และไม่ลงเซฟ — รีโหลดกลางสมุดกลับไปที่มรณบัตร
function openBook(death) {
  const pages = bookPages(death);
  const done = () => play(T.afterlife);
  const show = (i) => {
    root.replaceChildren();
    const box = el('article', 'card a lifebook');
    const top = el('div', 'top');
    top.append(el('b', null, 'สมุดชีวิต'), el('small', null, `หน้า ${i + 1}/${pages.length}`));
    const body = el('div', 'body');
    pages[i].draw(body);
    const choices = el('div', 'choices');
    const last = i === pages.length - 1;
    choices.append(enter(button(last ? BTN.toAfter : 'พลิกหน้าถัดไป', null, last ? done : () => show(i + 1))));
    const row = el('div', 'row');
    const back = button('หน้าก่อน', null, () => show(i - 1));
    back.dataset.prev = '';
    back.disabled = i === 0;
    row.append(back);
    if (!last) row.append(button('ข้ามสมุด', null, done));
    choices.append(row);
    box.append(top, body, choices);
    root.append(panels(box));
    fxCard(box, pages[i]);
  };
  show(0);
}

// ทุกปุ่มที่เดินเกมผ่านตรงนี้ทางเดียว — ตอนเล่นจริงกับตอนเล่นซ้ำจากเซฟจึงเดินเหมือนกันทุกก้าว
const apply = (tok) => track(step(tok));
function step(tok) {
  if (tok === T.next) return nextCard(st);
  if (tok === T.afterlife) {
    af = startAfterlife(st);
    return nextAfterCard(af);
  }
  if (tok === T.afterNext) return nextAfterCard(af);
  if (tok === T.rebirth) {
    st = nextLife(af, carryNext, carryNext.length ? skillsRead().s : {}, carryOffered);
    carryNext = [];
    carryOffered = false;
    af = null;
    curAge = null;
    bookReset();
    return nextCard(st);
  }
  if (/^[A-Z]$/.test(tok)) {
    chooseAfter(af, tok.charCodeAt(0) - 65);
    return nextAfterCard(af);
  }
  const blood = BLOOD_TOK.exec(tok);
  if (blood) {
    const heir = heirCandidates(af.st)[parseInt(blood[2], 36)];
    if (!heir) throw new Error(`ปุ่มในเซฟไม่รู้จัก: ${tok}`);
    chooseAfter(af, blood[1].charCodeAt(0) - 65, heir.id);
    return nextAfterCard(af);
  }
  const loan = LOAN_TOK.exec(tok);
  if (loan) {
    const kind = LOAN_KINDS[+loan[1]];
    if (!kind) throw new Error(`ปุ่มในเซฟไม่รู้จัก: ${tok}`);
    choose(st, parseInt(loan[2], 36), kind);
    return nextCard(st);
  }
  if (!/^[0-9a-z]$/.test(tok)) throw new Error(`ปุ่มในเซฟไม่รู้จัก: ${tok}`);
  choose(st, parseInt(tok, 36));
  return nextCard(st);
}

function fnv(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

// ลายนิ้วมือของการ์ดที่ค้างอยู่ — เนื้อเรื่องเปลี่ยนแล้วเล่นซ้ำได้การ์ดคนละใบ ต้องจับได้ ไม่ใช่พาไปโผล่ชีวิตอื่นเงียบ ๆ
function fingerprint(card) {
  return fnv(JSON.stringify([st.gen, card.kind, card.age ?? st.age, card.title, card.text, card.choices])).toString(36);
}

// storage พังได้ (โหมดส่วนตัว · เต็ม · ปิด) — เกมยังเล่นได้ แค่ไม่จำ · ป้ายหัวเว็บบอกผู้เล่นว่าจำอยู่หรือไม่ (B77)
// v = เวอร์ชันที่เขียน — ไว้ดูตอนไล่เซฟที่เล่นซ้ำไม่ตรง
// สถานะหน้าจอที่การ์ดถัดไปอ่านต่อ (อายุใบก่อน · บันทึกชีวิต · สมุดชีวิต) — เดิมได้จากการเล่นซ้ำ ตอนนี้เก็บไปกับภาพถ่าย
const uiState = () => ({ save, prevAge, curAge, eraSeen, picSeen, bookIntro });
function saveWrite(card) {
  try {
    localStorage.setItem(SNAP_KEY, snapHide(JSON.stringify({ v: APP_VERSION, snap: snapshot({ st, af, card, ui: uiState() }, CONTENT) })));
    localStorage.removeItem(SAVE_KEY);
    savedMark(true);
  } catch {
    // เขียนไม่ลงแต่เซฟเก่ายังอยู่ = รีเฟรชแล้วย้อนไปจุดเก่าโดยไม่รู้ตัว — ลบทิ้งดีกว่า
    saveClear();
    savedMark(false);
  }
}
function savedMark(ok) {
  const m = document.getElementById('saved');
  if (!m) return;
  m.textContent = ok ? 'บันทึกแล้ว' : 'ไม่ได้บันทึก';
  m.title = ok ? 'ปิดเกมแล้วกลับมาเล่นต่อจากตรงนี้ได้' : 'เครื่องนี้ไม่ให้เก็บข้อมูล (โหมดส่วนตัวหรือที่เก็บเต็ม) ปิดเกมแล้วชีวิตนี้จะหาย';
  m.classList.toggle('off', !ok);
}
function saveRead() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    return Number.isInteger(s?.seed) && typeof s.log === 'string' && typeof s.fp === 'string' ? s : null;
  } catch {
    return null;
  }
}
const snapExists = () => {
  try {
    return !!localStorage.getItem(SNAP_KEY);
  } catch {
    return false;
  }
};
// ภาพถ่าย v2 → คืนสถานะทั้งเกมบนเนื้อหาปัจจุบัน · การ์ดที่ค้างใช้ไม่ได้แล้ว (เนื้อหาเปลี่ยน) = จั่วใบถัดไป · อ่านไม่ได้ = null
function snapRead() {
  try {
    const raw = localStorage.getItem(SNAP_KEY);
    if (!raw) return null;
    const root = restore(JSON.parse(snapShow(raw)).snap, CONTENT);
    ({ st, af } = root);
    ({ save, prevAge, curAge, eraSeen, bookIntro } = root.ui);
    // ภาพถ่ายก่อนมีสมุดภาพ (B130) ไม่มีช่องนี้ — ภาพของการ์ดก่อนอัปเดตจึงไม่ถูกนับ
    picSeen = root.ui.picSeen ?? [];
    let card = root.card;
    if (!af && repairLife(st, card)) card = track(nextCard(st));
    // ชาติต่างโลกในปรโลกไม่ใช้ af.pending — การ์ดที่ค้างยังใช้ได้ จั่วใหม่ = นับใบซ้ำ + ดึงเลขสุ่มเกิน
    else if (af && !af.isekai && card.choices?.length && !af.pending) card = nextAfterCard(af);
    return card;
  } catch {
    return null;
  }
}
function saveClear() {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(SNAP_KEY);
  } catch {
    // ไม่มีที่เก็บ ก็ไม่มีเซฟให้ลบ
  }
}

const show = (card) => (af ? renderAfter(card) : render(card));

function play(tok, times = 1) {
  let card;
  for (let i = 0; i < times; i++) {
    card = apply(tok);
    save.log += tok;
  }
  saveWrite(card);
  show(card);
}

// ข่าวญาติ/สัตว์ที่ต่อคิวติดกันในปีเดียวกัน (ui-redo ใบ 27) — จอรวมเป็นใบเดียว กดครั้งเดียวเดิน T.next ครบทุกใบ
// อ่านคิวอย่างเดียว ผลเกม/เซฟเท่ากดทีละใบ · โหลดเซฟกลางชุดก็ได้ใบรวมของที่เหลือเพราะอ่านคิวตอนวาด
function digestRest(card) {
  if (af || card.kind !== 'result' || !card.digest) return [];
  const rest = [];
  for (const x of st.queue) {
    if (x.kind !== 'result' || !x.digest) break;
    rest.push(x);
  }
  return rest;
}

function begin(seed) {
  st = newLife(seed, CONTENT);
  af = null;
  save = { seed, log: '' };
  curAge = null;
  bookReset();
  return track(nextCard(st));
}

// seed จากเวลาเฉพาะฝั่งหน้าเว็บ แกนเกมเองไม่แตะนาฬิกา
const freshSeed = () => (Date.now() ^ (performance.now() * 1000)) >>> 0;

// ลิงก์ชวนเพื่อน (B144): ไม่มี server จึงฝัง seed ต้นตระกูลใน URL · engine รับ uint32 ค่าผิดรูป = ไม่สนลิงก์ เกิดสุ่มตามปกติ
const SEED_PARAM = 'seed';
function linkSeed() {
  try {
    const v = new URLSearchParams(location.search).get(SEED_PARAM);
    return v && /^\d{1,10}$/.test(v) && +v <= 0xffffffff ? +v : null;
  } catch {
    return null;
  }
}
// อ่านแล้วลบออกจากแถบที่อยู่ — ไม่งั้นรีโหลดกลางชีวิตจะถามซ้ำ หรือเริ่มชีวิตจากลิงก์ทับชีวิตที่เล่นไปแล้ว
function dropLinkSeed() {
  try {
    const u = new URL(location.href);
    if (!u.searchParams.has(SEED_PARAM)) return;
    u.searchParams.delete(SEED_PARAM);
    history.replaceState(history.state, '', u);
  } catch {
    // แก้แถบที่อยู่ไม่ได้ ก็แค่ถามซ้ำตอนรีโหลด
  }
}
// ชาติแรกเท่านั้นที่ seed กำหนดชีวิตทั้งหมด รุ่นถัดไปขึ้นกับทางที่เลือก ลิงก์จึงชวนได้แค่ชีวิตแรกของตระกูล
const inviteUrl = () => `https://${SHARE_URL}/play.html?${SEED_PARAM}=${save.seed}`;
// ชาติประจำวัน: seed จากวันที่ตามเวลาไทย ไม่ใช่เวลาของเครื่อง — ทั้งประเทศได้ชีวิตเดียวกันในวันนั้น
function thaiDay() {
  const d = new Date(Date.now() + 7 * 3600e3);
  const dd = (n) => String(n).padStart(2, '0');
  return { seed: fnv(`day:${d.toISOString().slice(0, 10)}`), label: `${dd(d.getUTCDate())}/${dd(d.getUTCMonth() + 1)}` };
}

// from อยู่ในเซฟ หน้าจบจึงบอกได้ว่าเกิดจากลิงก์/ชาติประจำวัน แม้รีโหลดกลางชีวิต · ไม่ใช่ token ใน log ผลเกมจึงเท่าเดิม
function start(seed = freshSeed(), from = null) {
  const card = begin(seed);
  if (from) save.from = from;
  saveWrite(card);
  render(card);
}
const startLink = (seed) => start(seed, { link: 1 });
function startDay() {
  const d = thaiDay();
  start(d.seed, { day: d.label });
}

// ขอเกิดใหม่ (B55): เฉพาะชีวิตแรกของตระกูล ก่อนกดอะไร และได้ครั้งเดียว — รุ่นถัดไปเกิดตามกรรม ต้องรับ
// เปลี่ยนแค่ seed ของเซฟ ไม่เป็น token ใน log · rr จำไว้ในเซฟ รีโหลดแล้วปุ่มจึงไม่กลับมา
const canReroll = () => st.gen === 1 && !af && save.log === '' && !save.rr;
function reroll() {
  if (!canReroll()) return;
  const card = begin(freshSeed());
  save.rr = 1;
  saveWrite(card);
  render(card);
}

// เล่นซ้ำทั้งตระกูลจากเซฟ · ไม่ตรงการ์ดเดิม = null
function resume(s) {
  try {
    let card = begin(s.seed);
    if (s.rr) save.rr = 1;
    for (const tok of tokens(s.log)) card = apply(tok);
    save.log = s.log;
    return fingerprint(card) === s.fp ? card : null;
  } catch {
    return null;
  }
}

function homeCard(title, lines) {
  root.replaceChildren();
  const box = el('article', 'card a');
  const top = el('div', 'top');
  top.append(el('b', null, GAME_NAME), el('small', null, title));
  const body = el('div', 'body');
  lines.forEach((t, i) => body.append(el(i ? 'p' : 'h3', i ? 'sub' : 'lead', t)));
  const choices = el('div', 'choices');
  box.append(top, body, choices);
  root.append(box);
  return choices;
}

// ล้างเซฟ = ลบทั้งตระกูล จึงถามซ้ำก่อน · สมุดทุกเล่มในชั้นสมุดแยก key ไม่โดนล้าง
function confirmNew(back, go = () => start(), title = 'เริ่มตระกูลใหม่', yes = 'ลบแล้วเริ่มตระกูลใหม่') {
  const choices = homeCard(title, ['ลบชีวิตที่ค้างไว้ทั้งตระกูล?', 'ผังตระกูลและสิ่งที่สืบทอดจะหายทั้งหมด กู้คืนไม่ได้ · สมุดในชั้นสมุดยังอยู่ครบ']);
  choices.append(button(yes, null, go), button('ยกเลิก', null, back));
}

// เปิดลิงก์เพื่อนตอนมีตระกูลค้าง: ถามก่อนทับ · Enter = เล่นต่อของเดิม กดพลาดจะได้ไม่เสียตระกูล
function linkAsk(card, seed) {
  const choices = homeCard('ลิงก์จากเพื่อน', ['เพื่อนชวนเกิดชีวิตเดียวกัน', `มีชีวิตที่เล่นค้างไว้ (${genLabel()}${st.name}) · เกิดตามลิงก์ = ลบตระกูลนี้ทั้งหมด สมุดในชั้นสมุดยังอยู่ครบ`]);
  choices.append(enter(button(BTN.resume, null, () => home(card))), button('ลบแล้วเกิดตามลิงก์', null, () => startLink(seed)));
}

function home(card) {
  const where = af ? `ระหว่างชาติ หลัง${lifeEndWord(isGone(st))} ${st.age}` : `อายุ ${st.age} · ${provinceLabel(st)}`;
  const choices = homeCard('เล่นต่อ', ['มีชีวิตที่เล่นค้างไว้', `${genLabel()}${st.name} · ${where}`]);
  // ใส่ใน .body ให้ได้ขอบซ้ายขวาเดียวกับหัวการ์ด
  choices.previousElementSibling.append(warnLine());
  choices.append(enter(button(BTN.resume, null, () => show(card))), button(BTN.newFamily, null, () => confirmNew(() => home(card))), button(BTN.shelf, null, () => openShelf()));
}

// เซฟจากเวอร์ชันที่เนื้อหาต่างกัน (B122): เซฟคือ seed + ลำดับปุ่ม เล่นซ้ำบนเนื้อหาใหม่ไม่ได้ชีวิตเดิม จึงเริ่มชีวิตใหม่
// สมุดทุกเล่มในชั้นสมุดและบันทึกชีวิตแยก key ไว้ ไม่โดนล้าง
function staleSave(seed) {
  notesSkip = true;
  const choices = homeCard('เกมอัปเดตแล้ว', ['ชีวิตที่ค้างไว้เล่นต่อไม่ได้', 'เนื้อเรื่องเปลี่ยนตั้งแต่เล่นครั้งก่อน เริ่มชีวิตใหม่ในเวอร์ชันนี้ได้เลย · สมุดในชั้นสมุดยังอยู่ครบ']);
  choices.append(enter(button(seed === null ? 'เริ่มชีวิตใหม่' : 'เกิดตามลิงก์เพื่อน', null, () => (seed === null ? start() : startLink(seed)))), button(BTN.shelf, null, () => openShelf()));
}

// ลิงก์ท้ายหน้าเปิดชั้นสมุดได้ทุกหน้าที่ยังไม่มีเมนูล่าง (หน้า "เล่นต่อ" ขึ้นเฉพาะตอนมีเซฟ) · เปิดซ้อนตัวเองไม่ได้ ไม่งั้นปุ่มกลับพากลับมาที่ชั้นสมุด
document.getElementById('shelfLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (!root.querySelector('.shelf-view')) openShelf();
});
// ชีวิตแรกที่ยังไม่ได้กดอะไรไม่มีอะไรให้เสีย เปลี่ยนได้เลย · นอกนั้นถามก่อนลบตระกูล · ยกเลิกคืนจอเดิมทั้งชุด
function dayNew() {
  if (st.gen === 1 && !af && save.log === '') return startDay();
  const prev = [...root.childNodes];
  confirmNew(() => root.replaceChildren(...prev), startDay, 'ชาติประจำวัน', 'ลบแล้วเกิดชาติประจำวัน');
}
document.getElementById('dayLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  dayNew();
});
shelfDot();
// เพดานความสูงการ์ด (B116) หักหัวเว็บ — ชื่อเกมตัดสองบรรทัดบนจอแคบ หัวจึงสูงไม่ตายตัว วัดจริงแทนเดาค่าเดียว · 20 = ระยะบนของ #app
const chromeH = () => document.documentElement.style.setProperty('--chrome', `${(document.querySelector('.logo')?.offsetHeight ?? 116) + 20}px`);
chromeH();
addEventListener('resize', chromeH);
document.fonts?.ready.then(chromeH);
// ราว/แผงบนคอมเริ่มใต้หัวเว็บ (ui-redo ใบ 67): ขอบล่างหัวจริงขณะเลื่อน — เลื่อนพ้นหัวแล้วชิดบน · หัวสูงเปลี่ยนตามธีมต่างโลกกับฟอนต์ที่โหลดทีหลัง
const logoEl = document.querySelector('.logo');
const headEdge = () => logoEl && document.documentElement.style.setProperty('--hd', `${Math.max(0, Math.round(logoEl.getBoundingClientRect().bottom))}px`);
headEdge();
addEventListener('scroll', headEdge, { passive: true });
addEventListener('resize', headEdge);
if (logoEl && window.ResizeObserver) new ResizeObserver(headEdge).observe(logoEl);

// ภาพถ่าย v2 ก่อน · ไม่มีจึงลองเซฟ v1 (เล่นซ้ำตรงการ์ดเดิม = เขียนทับเป็น v2 ทันที) · v1 ไม่ตรง/เซฟเสีย = หน้าเกมอัปเดต
function boot() {
  const seed = linkSeed();
  dropLinkSeed();
  let card = snapRead();
  if (!card) {
    const s = saveRead();
    if (!s && !snapExists()) return seed === null ? start() : startLink(seed);
    card = s && resume(s);
    if (!card) return staleSave(seed);
    saveWrite(card);
  }
  savedMark(true);
  if (seed === null) home(card);
  else linkAsk(card, seed);
}

boot();
notesBoot();
