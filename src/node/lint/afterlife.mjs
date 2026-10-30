// กติกาฉากช่วงที่ 7 (B06): ฉากระหว่างชาติอ่านโดย afterlife.mjs ไม่ใช่ลูปชีวิต — ฟิลด์ที่ลูปชีวิตใช้จึงไม่มีผลที่นี่
import { AFTERLIFE_STAGE, STAT_KEYS } from './vocab.mjs';
import { SCENES, REALM_SCENES, REALMS } from '../../engine/afterlife.mjs';
import { COURT_SCENES, NEAR_DEATH } from '../../engine/court.mjs';
import { meritId } from '../../engine/merit.mjs';
import { isObj, list, choicesOf, effectSites } from './util.mjs';

const REALM_IDS = REALMS.map((r) => r.id);
// คนตายไม่มีเงิน/งาน/ธงให้เปลี่ยน · ไม่มีปีให้นัด — ผลมีแค่ป้ายบุญบาปกับค่าเริ่มชาติหน้า
const DEAD_EVENT_KEYS = ['at_age', 'era', 'repeat', 'systems', 'belief'];
const DEAD_NODE_KEYS = ['requires', 'cost', 'sets_flags', 'clears_flags', 'schedules', 'next'];

export const rules = [
  {
    id: 'afterlife-shape',
    desc: `ฉากระหว่างชาติ: stage ${AFTERLIFE_STAGE} ⇔ มี scene (${SCENES.join('|')}) · type B · realm (${REALM_IDS.join('|')}) ใช้ได้เฉพาะ scene ${REALM_SCENES.join('|')} · ไม่มี ${DEAD_EVENT_KEYS.join(' ')} · ผลมีแค่ค่าสถานะ (ค่าเริ่มชาติหน้า) ไม่มี ${DEAD_NODE_KEYS.join(' ')}`,
    event(e, ctx, r) {
      const after = e.stage === AFTERLIFE_STAGE;
      if (!after) {
        for (const k of ['scene', 'realm']) if (e[k] !== undefined) r(`.${k}`, `${k} ใช้ได้เฉพาะ stage ${AFTERLIFE_STAGE}`);
        return;
      }
      if (!SCENES.includes(e.scene) && !COURT_SCENES.includes(e.scene)) r('.scene', `scene ต้องเป็น ${[...SCENES, ...COURT_SCENES].join('|')} ได้ ${JSON.stringify(e.scene)}`);
      if (e.type !== 'B') r('.type', 'ฉากระหว่างชาติเป็นการ์ดลายรดน้ำ type B (ใบ 06)');
      if (e.realm !== undefined) {
        if (!REALM_SCENES.includes(e.scene)) r('.realm', `realm ใช้ได้เฉพาะ scene ${REALM_SCENES.join('|')} — ก่อนปรโลกยังไม่รู้ภูมิ`);
        if (!(Array.isArray(e.realm) && e.realm.length && e.realm.every((x) => REALM_IDS.includes(x)))) r('.realm', `realm ต้องเป็นรายการจาก ${REALM_IDS.join(' ')}`);
      }
      for (const k of DEAD_EVENT_KEYS) if (e[k] !== undefined) r(`.${k}`, `ฉากระหว่างชาติไม่มี ${k}`);
      for (const { node, path } of [...choicesOf(e).map(({ c, path }) => ({ node: c, path })), ...effectSites(e).filter((x) => x.path.includes('outcomes'))]) {
        for (const k of DEAD_NODE_KEYS) if (node[k] !== undefined) r(`${path}.${k}`, `ฉากระหว่างชาติไม่มี ${k}`);
        const fx = isObj(node.effects) ? Object.keys(node.effects) : [];
        for (const k of fx) if (!STAT_KEYS.includes(k)) r(`${path}.effects.${k}`, `ผลในระหว่างชาติมีแค่ค่าสถานะ (${STAT_KEYS.join(' ')}) = ค่าเริ่มชาติหน้า`);
      }
    },
  },
  {
    id: 'afterlife-coverage',
    desc: 'ทุก scene ที่มีเนื้อหาต้องมีใบที่ไม่มี when (ออกได้ทุกคน) · scene ที่แยกภูมิต้องมีใบแบบนั้นครบทุกภูมิ — ไม่งั้นบางคนตายแล้วไม่มีการ์ด',
    all(events, ctx, r) {
      const after = events.filter((x) => x.e.stage === AFTERLIFE_STAGE && SCENES.includes(x.e.scene));
      for (const scene of SCENES) {
        const xs = after.filter((x) => x.e.scene === scene);
        if (!xs.length) continue;
        const open = xs.filter((x) => x.e.when === undefined);
        const need = REALM_SCENES.includes(scene) && xs.some((x) => x.e.realm !== undefined) ? REALM_IDS : [null];
        for (const realm of need) {
          const ok = open.some((x) => realm === null || x.e.realm === undefined || list(x.e.realm).includes(realm));
          if (!ok) r(xs[0], '', `scene ${scene}${realm ? ` ภูมิ ${realm}` : ''} ไม่มีใบที่ไม่มี when`);
        }
      }
    },
  },
  {
    id: 'court-shape',
    desc: `ทริปศาลขณะยังมีชีวิต (scene ${COURT_SCENES.join('|')}): ไม่มี when/weight/realm · ตัวเลือกไม่มี effects (ค่าสถานะเข้าสูตรชีวิต อายุตายจะเลื่อน) · near/visit ป้ายบุญบาปเป็น neutral ล้วน · near: ${NEAR_DEATH.causes.join('|')} มีเฉพาะ scene near และไม่มีตัวเลือก`,
    event(e, ctx, r) {
      const court = e.stage === AFTERLIFE_STAGE && COURT_SCENES.includes(e.scene);
      if (e.near !== undefined && !(court && e.scene === 'near')) r('.near', 'near ใช้ได้เฉพาะ scene near');
      if (!court) return;
      for (const k of ['when', 'weight', 'realm', 'multipliers']) if (e[k] !== undefined) r(`.${k}`, `ฉากศาลไม่มี ${k} — แกนเลือกใบเอง`);
      if (e.scene === 'near') {
        if (!NEAR_DEATH.causes.includes(e.near)) r('.near', `scene near ต้องมี near: ${NEAR_DEATH.causes.join('|')}`);
        if (Array.isArray(e.choices) && e.choices.length) r('.choices', 'ใบเกือบตายเป็นการ์ดเล่าเรื่อง choices: []');
      }
      for (const { c, path } of choicesOf(e)) {
        if (c.effects !== undefined) r(`${path}.effects`, 'ฉากศาลไม่มีผลต่อค่าสถานะ');
        if (c.outcomes !== undefined) r(`${path}.outcomes`, 'ฉากศาลไม่มีผลสุ่ม');
        if (e.scene !== 'summons' && list(c.merit).some((t) => !isObj(t) || meritId(t.cat) !== 'neutral')) r(`${path}.merit`, 'ฉากเยือนศาลลงบัญชีไม่ได้ — ป้ายต้องเป็น neutral ล้วน');
      }
    },
  },
];
