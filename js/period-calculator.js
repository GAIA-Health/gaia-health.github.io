/* Period calculator page logic. Engine: ./cycle-predict.js. Brand strings: ./brand.js. */
import { predict, parseISO, toISO } from './cycle-predict.js';
import { BRAND, APP_STORE_URL, WEB_APP_URL } from './brand.js';

const TOOL = document.body.dataset.mode === 'late' ? 'late-period-calculator' : 'period-calculator';
const MAX_EXTRA_DATES = 6;
// URL state lives in the query string (?lmp=…). Flip to true to keep dates in the
// #fragment instead, which keeps them out of analytics page_location and server logs.
const STATE_IN_HASH = true;

const $ = id => document.getElementById(id);
// Late-period landing page (tools/late-period-calculator.html) sets data-mode="late" on <body>.
// Same engine and math; only the framing differs. Absent on period-calculator.html.
const LATE_MODE = document.body.dataset.mode === 'late';
const form = $('periodForm');
const results = $('results');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const parts = iso => iso.split('-').map(Number);
const fmt = iso => { const [, m, d] = parts(iso); return `${MONTHS[m - 1]} ${d}`; };
const fmtFull = iso => { const [y, m, d] = parts(iso); return `${MONTHS_FULL[m - 1]} ${d}, ${y}`; };
const fmtRange = (a, b) => {
  const [, ma] = parts(a), [, mb] = parts(b);
  return ma === mb ? `${fmt(a)}–${parts(b)[2]}` : `${fmt(a)} – ${fmt(b)}`;
};
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const todayISO = () => toISO(parseISO(new Date()));

function gtagSafe(name, params) {
  if (typeof window.gtag === 'function') window.gtag('event', name, Object.assign({ page_path: location.pathname }, params));
}

/* ── brand strings in static copy ── */
document.querySelectorAll('[data-brand]').forEach(el => { el.textContent = BRAND; });
document.querySelectorAll('a[data-appstore]').forEach(a => { a.href = APP_STORE_URL; });

/* ── extra date inputs ── */
const extraWrap = $('extraDates');
const extraInputs = () => Array.from(extraWrap.querySelectorAll('input[type="date"]'));
const today = todayISO();
$('lmpDate').max = today;
extraInputs().forEach(i => { i.max = today; });

/* ── read inputs ── */
function readForm() {
  const lmp = $('lmpDate').value;
  const len = parseInt($('cycleLength').value, 10) || 28;
  const plenRaw = parseInt($('periodLength').value, 10);
  const plen = plenRaw >= 2 && plenRaw <= 10 ? plenRaw : 5;
  const extra = extraInputs().map(i => i.value).filter(Boolean);
  const bc = $('onBirthControl').checked;
  return { lmp, len, plen, plenSet: !isNaN(plenRaw), extra, bc };
}

/* Check the extra dates; return the ones the engine should use plus a message. */
function vetDates(lmp, extra) {
  const msgs = [];
  const lmpDay = parseISO(lmp);
  const todayDay = parseISO(today);
  let days = extra.map(parseISO).filter(d => d != null);
  if (days.some(d => d > todayDay)) msgs.push('Dates in the future were left out.');
  days = days.filter(d => d <= todayDay && d !== lmpDay);
  if (days.some(d => d > lmpDay)) msgs.push('One of your earlier dates is after your last period, so we used the most recent date as your last period.');
  const all = [...new Set([lmpDay, ...days])].sort((a, b) => b - a);
  const kept = [all[0]];
  let close = false;
  for (let i = 1; i < all.length; i++) {
    if (kept[kept.length - 1] - all[i] < 15) { close = true; continue; }
    kept.push(all[i]);
  }
  if (close) msgs.push('Two dates were under 15 days apart, which usually means the same period or spotting, so we left one out.');
  for (let i = 1; i < kept.length; i++) {
    if (kept[i - 1] - kept[i] > 90) { msgs.push('There is a gap of more than 90 days in your dates. If you missed noting a period in between, the range will be wider than it should be.'); break; }
  }
  return { starts: kept.map(toISO), message: msgs.join(' ') };
}

/* ── URL state ── */
function readState() {
  const raw = STATE_IN_HASH && location.hash.length > 1 ? location.hash.slice(1) : location.search.slice(1);
  const p = new URLSearchParams(raw || location.hash.slice(1));
  const lmp = p.get('lmp');
  if (!lmp || parseISO(lmp) == null) return null;
  const dates = [];
  (p.get('dates') || '').split(',').concat(p.getAll('d')).forEach(d => { if (d && parseISO(d) != null) dates.push(d); });
  return { lmp, len: parseInt(p.get('len'), 10), plen: parseInt(p.get('plen'), 10), dates: dates.slice(0, MAX_EXTRA_DATES), bc: p.get('bc') === '1' };
}
function applyState(s) {
  $('lmpDate').value = s.lmp;
  const sel = $('cycleLength');
  if (s.len && sel.querySelector(`option[value="${s.len}"]`)) sel.value = String(s.len);
  if (s.plen >= 2 && s.plen <= 10) $('periodLength').value = String(s.plen);
  extraInputs().forEach((inp, i) => { inp.value = s.dates[i] || ''; });
  if (s.dates.length) $('moreDates').open = true;
  $('onBirthControl').checked = !!s.bc;
}
function stateQuery(f) {
  const p = new URLSearchParams();
  p.set('lmp', f.lmp);
  p.set('len', String(f.len));
  if (f.plenSet) p.set('plen', String(f.plen));
  if (f.extra.length) p.set('dates', f.extra.join(','));
  if (f.bc) p.set('bc', '1');
  return p.toString();
}
function shareUrl(f) {
  const base = location.origin + location.pathname;
  return STATE_IN_HASH ? `${base}#${stateQuery(f)}` : `${base}?${stateQuery(f)}`;
}
/* Save-my-dates link: web-app signup, dates carried in the hash only (never the query string). */
function saveHref(f) {
  const starts = vetDates(f.lmp, f.extra).starts.slice(0, 7);
  const payload = { v: 1, src: TOOL, starts, cl: f.len || null, pl: f.plenSet ? f.plen : null, bc: f.bc ? 1 : 0 };
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let bin = '';
  bytes.forEach(b => { bin += String.fromCharCode(b); });
  const b64 = btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const q = `mode=signup&utm_source=website&utm_medium=tool_result&utm_campaign=${encodeURIComponent(TOOL)}`;
  return `${WEB_APP_URL}/login?${q}#calc=${b64}`;
}
function saveLink(f, cls) {
  const a = document.createElement('a');
  a.className = cls;
  a.id = 'saveDatesLink';
  a.href = saveHref(f);
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = 'Save my dates and keep tracking';
  return a;
}
const SAVE_NOTE = "Free. Your dates come with you, so you don't have to enter them again.";
let writeTimer = null;
function writeState(f) {
  clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    try { history.replaceState(null, '', shareUrl(f)); } catch (e) { /* file:// or sandboxed */ }
  }, 800);
}

/* ── rendering ── */
function confidenceLine(r) {
  const s = r.cycleStats;
  if (r.engine === 'typical') {
    return `This uses the ${r.cycleLength}-day cycle you picked. Cycles often drift a few days, so the range runs ${plural(r.nextPeriod.marginDays, 'day')} either side. Add earlier period dates to make it yours.`;
  }
  const span = s.shortest === s.longest ? `${s.shortest} days` : `${s.shortest}–${s.longest} days`;
  const which = s.n === 1 ? 'Your last cycle ran' : `Your last ${s.n} cycles ran`;
  if (r.confidence === 'wide_range') {
    return `${which} ${span}, so the range is wider: it reflects how much your own cycles moved, not a verdict on them. More dates help it settle.`;
  }
  return `${which} ${span}, so your range is ${plural(r.nextPeriod.marginDays, 'day')} either side of the most likely date.`;
}

function lateNote(r, bc) {
  if (r.daysPastDue <= 0) return '';
  const due = toISO(parseISO(r.anchor) + r.cycleLength);
  if (bc) {
    return `<div class="late-note"><i class="bi bi-info-circle" aria-hidden="true"></i>It's been ${plural(r.cycleDay - 1, 'day')} since the first day of your last bleed. On hormonal birth control, bleeding usually follows your method's schedule rather than ovulation, so we don't call a bleed late. <a href="../blog/why-is-my-period-late.html">Why cycles shift</a></div>`;
  }
  const inside = r.notes.includes('inside_range');
  return `<div class="late-note"><i class="bi bi-calendar-x" aria-hidden="true"></i>From your dates, your period was most likely due on ${fmtFull(due)}, which makes it <strong>${plural(r.daysPastDue, 'day')} late</strong> as of today. ${inside ? "That's still inside the range your dates give." : 'That is past the range your dates give.'} <a href="../blog/why-is-my-period-late.html">Common reasons a cycle shifts</a></div>`;
}

// Late mode only: say plainly when the period is not (yet) late, so the answer comes first either way.
function notLateNote(r, bc) {
  if (r.daysPastDue > 0 || bc) return '';
  const until = parseISO(r.nextPeriod.date) - parseISO(today);
  const when = until === 0 ? 'today' : until === 1 ? 'tomorrow' : until > 0 ? `in ${until} days` : 'on its expected date';
  return `<div class="late-note late-note-ok"><i class="bi bi-calendar-check" aria-hidden="true"></i>From your dates, your period isn't late. It's most likely due <strong>${fmtFull(r.nextPeriod.date)}</strong> (${when}), and the range runs ${fmtRange(r.nextPeriod.earliest, r.nextPeriod.latest)}.</div>`;
}

function calendarHtml(r) {
  // Current cycle: from the cycle start that precedes the next predicted period.
  const next = parseISO(r.nextPeriod.date);
  const start = next - r.cycleLength;
  const earliest = parseISO(r.nextPeriod.earliest), latest = parseISO(r.nextPeriod.latest);
  const fwS = r.fertileWindow ? parseISO(r.fertileWindow.start) : null;
  const fwE = r.fertileWindow ? parseISO(r.fertileWindow.end) : null;
  const ov = r.fertileWindow ? parseISO(r.ovulation.date) : null;
  const t = parseISO(today);
  const end = latest;
  let html = DOW.map(d => `<div class="day-header" aria-hidden="true">${d}</div>`).join('');
  const dow = new Date(start * 86400000).getUTCDay();
  for (let i = 0; i < dow; i++) html += '<div class="day empty" aria-hidden="true"></div>';
  for (let d = start; d <= end; d++) {
    let cls = 'day', label = '';
    if (d - start < r.periodLength) { cls += ' period'; label = 'period'; }
    else if (d === next) { cls += ' period next-likely'; label = 'next period, most likely'; }
    else if (d >= earliest && d <= latest) { cls += ' range'; label = 'possible start of next period'; }
    else if (ov != null && d === ov) { cls += ' ovulation'; label = 'estimated ovulation'; }
    else if (fwS != null && d >= fwS && d <= fwE) { cls += ' fertile'; label = 'fertile window'; }
    if (d === t) { cls += ' today-marker'; label = label ? `today, ${label}` : 'today'; }
    const iso = toISO(d);
    html += `<div class="${cls}" role="listitem" aria-label="${fmtFull(iso)}${label ? ': ' + label : ''}"><span class="day-num">${parts(iso)[2]}</span></div>`;
  }
  return html;
}

function renderResult(r, f, message) {
  const np = r.nextPeriod;
  const t = parseISO(today);
  const until = parseISO(np.date) - t;
  const untilText = until === 0 ? 'today' : until === 1 ? 'tomorrow' : `in ${until} days`;
  const range = fmtRange(np.earliest, np.latest);
  const fw = r.fertileWindow;

  const upcoming = r.upcoming.map((u, i) => `
      <li class="next-cycle-row">
        <div class="next-cycle-label">${i === 0 ? 'next period' : i === 1 ? 'the one after' : 'and then'}</div>
        <div class="next-cycle-dates"><span class="period-date">${fmtRange(u.earliest, u.latest)}</span> <span class="pc-muted">most likely ${fmt(u.date)}</span>
        ${f.bc ? '' : `<br><span class="pc-muted">fertile window after it: <span class="fertile-date">${fmtRange(u.fertileStart, u.fertileEnd)}</span></span>`}</div>
      </li>`).join('');

  const refineCta = r.engine === 'typical'
    ? `<p class="pc-refine-cta"><button type="button" class="pc-link-btn" id="openMoreDates">Add more period dates</button> to turn this into your own range.</p>`
    : `<p class="pc-refine-cta pc-muted">Using ${plural(r.cycleStats.n, 'cycle')} from your dates instead of the ${f.len}-day setting.</p>`;

  const s = r.cycleStats;
  const irregularAnswer = r.engine === 'typical'
    ? `If your cycles move around, one date can't show that. Add your last few period start dates above and the range will stretch or shrink to match what your cycles actually do.`
    : `Your dates span ${s.shortest === s.longest ? s.shortest + ' days' : s.shortest + '–' + s.longest + ' days'}, and the range above already reflects that spread. Cycles that vary are common, especially in the first years after periods start, after stopping birth control and in the years before menopause.`;

  results.innerHTML = `
    <div class="result-card pc-headline">
      ${message ? `<div class="refine-message" role="status">${esc(message)}</div>` : ''}
      ${lateNote(r, f.bc)}${LATE_MODE ? notLateNote(r, f.bc) : ''}
      <h2 class="pc-kicker">your next period</h2>
      <div class="pc-range">${range}</div>
      <div class="pc-likely">most likely <strong>${fmtFull(np.date)}</strong> &middot; ${untilText}</div>
      <p class="pc-confidence">${esc(confidenceLine(r))}</p>
      ${f.bc ? `<p class="pc-confidence"><i class="bi bi-capsule" aria-hidden="true"></i> On hormonal birth control, bleeding usually follows your method rather than ovulation, so treat these dates loosely. We never call a bleed late, and fertile-window estimates are hidden because they assume a natural cycle.</p>` : ''}
    </div>
    <div class="pc-details">
      <div class="key-dates">
        <div class="key-date-box period-box">
          <div class="date-label">${fw ? 'fertile window' : 'cycle day'}</div>
          <div class="date-value">${fw ? fmtRange(fw.start, fw.end) : 'Day ' + r.cycleDay}</div>
          <div class="date-label">${fw ? 'ovulation estimate ' + fmt(r.ovulation.date) : 'of about ' + r.cycleLength}</div>
        </div>
        <div class="key-date-box phase-box">
          <div class="date-label">${fw ? 'today is cycle day' : 'cycle length used'}</div>
          <div class="date-value">${fw ? r.cycleDay : r.cycleLength + ' days'}</div>
          <div class="date-label">${fw ? 'cycle length used: ' + r.cycleLength + ' days' : r.engine === 'data' ? 'from your dates' : 'from your setting'}</div>
        </div>
      </div>
      ${refineCta}

      <h3 class="pc-h3">next 3 cycles</h3>
      <ul class="next-cycles">${upcoming}</ul>

      <h3 class="pc-h3">this cycle at a glance</h3>
      <div class="cycle-calendar" role="list" aria-label="Calendar of your current cycle">${calendarHtml(r)}</div>
      <div class="legend">
        <div class="legend-item"><div class="legend-dot period"></div> period</div>
        <div class="legend-item"><div class="legend-dot range"></div> next period range</div>
        ${fw ? '<div class="legend-item"><div class="legend-dot fertile"></div> fertile window</div><div class="legend-item"><div class="legend-dot ovulation"></div> ovulation estimate</div>' : ''}
        <div class="legend-item"><div class="legend-dot today"></div> today</div>
      </div>

      <div class="pc-followups">
        <h3 class="pc-h3">what if my cycles are irregular?</h3>
        <p>${irregularAnswer} More on <a href="../encyclopedia/irregular-periods.html">irregular periods</a>, or check your pattern with the <a href="cycle-length-calculator.html">cycle length calculator</a>.</p>
        <h3 class="pc-h3">when could I take a pregnancy test?</h3>
        <p>Most home pregnancy tests are designed to be used from the day your period is due, <a href="https://www.nhs.uk/conditions/pregnancy-and-baby/pregnancy-test/" target="_blank" rel="noopener">according to the NHS</a>. From your dates that's around ${fmtFull(np.date)}${np.latest !== np.date ? `, and ${fmtFull(np.latest)} is the end of your range` : ''}. See <a href="../blog/why-is-my-period-late.html">why a period can be late</a> and <a href="../blog/implantation-bleeding-vs-period.html">implantation bleeding vs a period</a>.</p>
        <h3 class="pc-h3">what does the luteal phase mean here?</h3>
        <p>The luteal phase is the stretch between ovulation and your next period. For a ${r.cycleLength}-day cycle this calculator assumes about ${r.lutealLength} days, which is how it places your fertile window, rather than assuming 14 for everyone. Read <a href="../blog/what-is-luteal-phase.html">what the luteal phase is</a> or try the <a href="ovulation-calculator.html">ovulation calculator</a>.</p>
      </div>

      <div class="pc-share">
        <button type="button" class="pc-share-btn" id="copyLink"><i class="bi bi-link-45deg" aria-hidden="true"></i> copy link to this result</button>
        <span class="pc-share-status" id="copyStatus" role="status" aria-live="polite"></span>
      </div>
    </div>`;
  if (LATE_MODE) showLateSave(f);
  else showAppHandoff(`Your next period looks like ${range}, most likely ${fmt(np.date)}.`, r, f);
}

/* App handoff card: the only App Store prompt after a result (download_click, cta_placement=tool_result).
   The lander link is picked from values the engine already computed; wording stays neutral. */
const APP_HANDOFF = {
  tail: 'Log your next one in the app and the range tightens.',
  explain: `${BRAND} learns from the periods you log, so dates and ranges adjust to irregular cycles, and your symptoms and sleep sit alongside your cycle.`,
};
function handoffContext(r, f) {
  const s = r.cycleStats;
  if (r.engine === 'data' && r.confidence === 'wide_range' && s.shortest !== s.longest) {
    return {
      headline: `Your cycles have ranged ${s.shortest}\u2013${s.longest} days, and the range above follows that. ${APP_HANDOFF.tail}`,
      linkPre: 'See how predictions work when ', linkText: 'cycles vary', linkPost: '.',
      href: '../irregular-periods-tracker.html', key: 'irregular-periods-tracker',
    };
  }
  if (f.bc) {
    return {
      headline: null,
      linkPre: 'No regular bleed to anchor to? See ', linkText: 'how to track a cycle without a period', linkPost: '.',
      href: '../iud-cycle-tracking.html', key: 'iud-cycle-tracking',
    };
  }
  if (r.fertileWindow && r.engine === 'data') {
    return {
      headline: null,
      linkPre: "Want the fertile window to use your wearable's temperature too? See the ", linkText: 'fertility tracker', linkPost: '.',
      href: '../fertility-tracker.html', key: 'fertility-tracker',
    };
  }
  return {
    headline: null,
    linkPre: 'Curious how the range is worked out? Read ', linkText: 'how predictions work', linkPost: '.',
    href: '../prediction-accuracy.html', key: 'prediction-accuracy',
  };
}
function showLateSave(f) {
  const old = $('lateSave');
  if (old) old.remove();
  const anchor = results.querySelector('.result-card');
  if (!anchor) return;
  const box = document.createElement('div');
  box.className = 'late-save';
  box.id = 'lateSave';
  const note = document.createElement('p');
  note.className = 'pc-muted mt-2 mb-0';
  note.textContent = SAVE_NOTE;
  box.append(saveLink(f, 'app-handoff-btn'), note);
  anchor.insertAdjacentElement('afterend', box);
}
function showAppHandoff(headline, r, f) {
  const old = $('appHandoff');
  if (old) old.remove();
  const anchor = results.querySelector('.result-card');
  if (!anchor || !headline) return;
  const ctx = handoffContext(r, f);
  const card = document.createElement('div');
  card.className = 'app-handoff';
  card.id = 'appHandoff';
  const h = document.createElement('h3');
  h.textContent = ctx.headline || `${headline} ${APP_HANDOFF.tail}`;
  const p = document.createElement('p');
  p.textContent = APP_HANDOFF.explain;
  const a = document.createElement('a');
  a.className = 'app-handoff-btn';
  a.href = APP_STORE_URL;
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('data-cta-placement', 'tool_result');
  a.innerHTML = '<i class="bi bi-apple me-1" aria-hidden="true"></i>';
  a.appendChild(document.createTextNode(`Get ${BRAND} on the App Store`));
  a.classList.add('app-handoff-btn-secondary');
  const save = saveLink(f, 'app-handoff-btn');
  const saveNote = document.createElement('p');
  saveNote.className = 'pc-muted app-handoff-save-note';
  saveNote.textContent = SAVE_NOTE;
  /* Same-host link: analytics-events.js counts it as blog_internal_click (surface=tools). */
  const lander = document.createElement('p');
  lander.className = 'pc-muted mt-3 mb-0';
  const la = document.createElement('a');
  la.href = ctx.href;
  la.setAttribute('data-handoff-lander', ctx.key);
  la.textContent = ctx.linkText;
  lander.append(document.createTextNode(ctx.linkPre), la, document.createTextNode(ctx.linkPost));
  card.append(h, p, save, saveNote, a, lander);
  anchor.insertAdjacentElement('afterend', card);
}

/* ── controller ── */
let used = false, refinedCount = 0, contextLogged = false, lastForm = null;

function update(trigger) {
  const f = readForm();
  if (!f.lmp || parseISO(f.lmp) == null) return;
  if (parseISO(f.lmp) > parseISO(today)) {
    results.innerHTML = '<div class="result-card"><div class="refine-message" role="status">The first day of your last period needs to be today or earlier.</div></div>';
    return;
  }
  const vet = vetDates(f.lmp, f.extra);
  const r = predict({ periodStarts: vet.starts, typicalLength: f.len, periodLength: f.plen, context: f.bc ? 'hormonal_bc' : 'none', today });
  if (!r) return;
  lastForm = f;
  renderResult(r, f, vet.message);
  results.classList.add('show');
  writeState(f);

  if (!used) { used = true; gtagSafe('calculator_use', { calculator: TOOL, form_id: 'periodForm', trigger }); }
  const n = vet.starts.length - 1;
  if (n > 0 && n !== refinedCount) {
    refinedCount = n;
    gtagSafe('calculator_refined', { fields_used: 'multi_date', dates_count: n + 1, variability_days: (r.cycleStats.longest || 0) - (r.cycleStats.shortest || 0) });
  }
  if (f.bc && !contextLogged) { contextLogged = true; gtagSafe('calculator_context', { context: 'bc' }); }
}

let inputTimer = null;
form.addEventListener('input', () => { clearTimeout(inputTimer); inputTimer = setTimeout(() => update('instant'), 150); });
form.addEventListener('change', () => { clearTimeout(inputTimer); update('instant'); });
form.addEventListener('submit', e => {
  e.preventDefault();
  e.stopPropagation(); // calculator_use is fired once per page view by update(), not per submit
  update('button');
  if (window.matchMedia('(max-width: 960px)').matches) results.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* Once per page view: after the first auto-render, when the date field loses focus, bring the result into view.
   Never on keystrokes, so typing does not jump the page. */
let blurScrolled = false;
$('lmpDate').addEventListener('blur', () => {
  if (blurScrolled || !used || !results.classList.contains('show')) return;
  if (!window.matchMedia('(max-width: 960px)').matches) return;
  blurScrolled = true;
  setTimeout(() => results.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
});
form.addEventListener('submit', () => { blurScrolled = true; });

let refineOpenedLogged = false;
$('moreDates').addEventListener('toggle', e => {
  if (e.target.open && !refineOpenedLogged) { refineOpenedLogged = true; gtagSafe('calculator_refine_opened', {}); }
});

results.addEventListener('click', e => {
  if (e.target.closest('#openMoreDates')) {
    const d = $('moreDates');
    d.open = true;
    d.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const first = extraInputs()[0];
    if (first) first.focus({ preventScroll: true });
    return;
  }
  if (e.target.closest('#copyLink') && lastForm) {
    const url = shareUrl(lastForm);
    const status = $('copyStatus');
    const done = ok => { status.textContent = ok ? 'Link copied.' : url; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(() => done(true), () => done(false));
    else done(false);
    gtagSafe('calculator_share', { method: 'link' });
  }
});

const initial = readState();
if (initial) { applyState(initial); update('url_state'); }
