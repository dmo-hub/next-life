// แถบกรองหน้ารวมการ์ด แบบ A ชิปติดหัว (ui-redo 136): ว่างและซ่อนไว้ในหน้า · สคริปต์สร้างชิปจากการ์ดที่อยู่ในหน้าจริง จึงไม่มี JS = เห็นการ์ดครบเหมือนเดิม
import { matchItem, recentVersions } from './catalog-filter.mjs';

export const FILTER_CATS = ['ครอบครัว', 'การเรียน', 'งานและเงิน', 'สุขภาพ', 'สังคม', 'ความเชื่อ', 'บ้านเมือง'];
// เส้นทางงานไม่ใช่การ์ด ไม่มี <details data-st> — สคริปต์นับ <section class="more"> เป็นช่วงนี้
export const CAREER_STAGE = 'สายอาชีพ';

export const filterUi = () => `<div class="fil" id="fil" role="group" aria-label="ตัวกรองการ์ด" hidden></div>
<p class="fstat" id="fstat" role="status" hidden></p>
<p class="fnone" id="fnone" hidden>ไม่มีการ์ดที่ตรงกับตัวกรอง · <button type="button" class="clear" data-clear>ล้างตัวกรอง</button></p>
<script>
(() => {
  const matchItem = ${matchItem.toString()};
  const recentVersions = ${recentVersions.toString()};
  const CATS = ${JSON.stringify(FILTER_CATS)};
  const CAREER = ${JSON.stringify(CAREER_STAGE)};
  const SINCE = [['latest', 'ล่าสุด'], ['recent5', '5 รุ่นล่าสุด'], ['all', 'ทั้งหมด']];
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let sel = { cat: [], st: [], since: 'all', vers: [] };
  const init = () => {
    const bar = document.getElementById('fil');
    const stat = document.getElementById('fstat');
    const none = document.getElementById('fnone');
    const more = document.querySelector('section.more');
    const items = $$('article.c').map((el) => ({
      el,
      cats: $$(':scope > .sp-front > .tags span', el).map((s) => s.textContent),
      st: el.closest('details[data-st]')?.dataset.st ?? '',
      v: (el.querySelector(':scope > .ver a')?.textContent.match(/v\\d[\\d.]*/) ?? [''])[0],
    }));
    // ป้ายชิปใช้คำเดียวกับหัวกลุ่มที่ผู้อ่านเห็น (ช่วงเด็ก · ปรโลก) ไม่ใช่ชื่อช่วงดิบ
    const stageLabel = (d) => d.querySelector(':scope > summary').childNodes[0].textContent.replace(/\\s*\\(.*\\)\\s*$/, '').trim();
    const labels = Object.fromEntries($$('details[data-st]').map((d) => [d.dataset.st, stageLabel(d)]));
    const stages = [...Object.keys(labels), ...(more ? [CAREER] : [])];
    const allV = items.map((i) => i.v);
    const latest = recentVersions(allV, 1)[0] ?? '';
    const sections = $$('details[data-st]').map((d) => ({ d, small: d.querySelector(':scope > summary small'), n0: d.querySelector(':scope > summary small')?.textContent ?? '', toc: $$('.toc a').find((a) => a.getAttribute('href') === '\x23' + d.id)?.querySelector('small') }));
    sections.forEach((s) => { s.t0 = s.toc?.textContent ?? ''; });
    const chip = (g, v, label, n) => '<button type="button" class="chip" data-g="' + g + '" data-v="' + v + '" aria-pressed="' + (g === 'since' ? sel.since === v : sel[g].includes(v)) + '">' + label + (n == null ? '' : ' <small>' + n + '</small>') + '</button>';
    const drawBar = () => {
      const cnt = (f) => items.filter(f).length;
      bar.innerHTML =
        '<div class="grp"><span>หมวดการ์ด</span>' + CATS.map((c) => chip('cat', c, c, cnt((i) => i.cats.includes(c)))).join('') + '</div>' +
        '<div class="grp"><span>ช่วงวัย/โลก</span>' + stages.map((s) => chip('st', s, labels[s] ?? s, s === CAREER ? null : cnt((i) => i.st === s))).join('') + '</div>' +
        '<div class="grp"><span>รุ่นที่เพิ่ม</span>' + SINCE.map(([v, l]) => chip('since', v, v === 'latest' && latest ? l + ' ' + latest : l)).join('') + '</div>';
    };
    const active = () => sel.cat.length || sel.st.length || sel.since !== 'all';
    const apply = () => {
      sel.vers = sel.since === 'all' ? [] : recentVersions(allV, sel.since === 'latest' ? 1 : 5);
      items.forEach((i) => { i.el.hidden = !matchItem(i, sel); });
      $$('.grid').forEach((g) => {
        const none0 = !g.querySelector('article.c:not([hidden])');
        g.hidden = none0;
        const h = g.previousElementSibling;
        if (h && h.tagName === 'H3') h.hidden = none0;
      });
      const on = active();
      $$('.try').forEach((t) => { t.hidden = on; });
      let shown = 0;
      sections.forEach((s) => {
        const n = s.d.querySelectorAll('article.c:not([hidden])').length;
        shown += n;
        s.d.hidden = on && n === 0;
        if (on && n > 0) s.d.open = true;
        if (s.small) s.small.textContent = on ? n + ' ใบ' : s.n0;
        if (s.toc) s.toc.textContent = on ? String(n) : s.t0;
        const link = s.toc?.closest('a');
        if (link) link.hidden = on && n === 0;
      });
      const moreOn = !more || matchItem({ cats: [], st: CAREER, v: '' }, sel);
      if (more) more.hidden = !moreOn;
      stat.hidden = !on;
      stat.innerHTML = 'แสดง ' + shown + ' จาก ' + items.length + ' ใบ <button type="button" class="clear" data-clear>ล้างตัวกรอง</button>';
      none.hidden = !(on && shown === 0 && !moreOn);
      drawBar();
    };
    window.addEventListener('hashchange', () => {
      const to = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (to && to.closest('[hidden]')) { sel = { cat: [], st: [], since: 'all', vers: [] }; apply(); }
    });
    document.addEventListener('click', (e) => {
      const b = e.target.closest('.chip, .clear');
      if (!b || !b.closest('#fil, #fstat, #fnone')) return;
      let focus = null;
      if (b.dataset.clear !== undefined) sel = { cat: [], st: [], since: 'all', vers: [] };
      else {
        const { g, v } = b.dataset;
        if (g === 'since') sel.since = v;
        else sel[g] = sel[g].includes(v) ? sel[g].filter((x) => x !== v) : [...sel[g], v];
        focus = '.chip[data-g="' + g + '"][data-v="' + v + '"]';
      }
      apply();
      if (focus) bar.querySelector(focus)?.focus();
    });
    bar.hidden = false;
    apply();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
</script>`;
