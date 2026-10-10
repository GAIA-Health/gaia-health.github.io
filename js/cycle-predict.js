/**
 * cycle-predict.js: the calendar layer of the app's cycle prediction, ported
 * for the website's cycle tools. Dependency-free. Loads three ways:
 *   - ES module:  import { predict } from '/js/cycle-predict.js'
 *   - classic <script>: window.CyclePredict.predict(...)
 *   - Node:       node js/cycle-predict.js --test   (runs the tests at the bottom)
 *
 * SOURCE OF TRUTH: NutriEase_BackEnd (read-only port, Oct 9 2026)
 *   app/cycleAlgos.py    CycleCalculator.calculate_cycle_stats, _weighted_average_with_decay,
 *                        _median, find_unmeasured_cycle_gaps (length-only branch)
 *   app/fertilityAlgos.py FertilityCalculator.predict_fertile_window_4level (levels 3-4 and
 *                        the pre-ovulation prediction_window), analyze_luteal_phase
 *                        (calendar branch), compute_prediction_bias, v2_default_luteal,
 *                        _resolve_priors / _apply_typical_cl_override (default prior)
 *   iOS CycleCalculator.swift predictNextPeriodDate: the single date the app shows
 *                        (last start + average cycle length, rolled forward past today)
 *
 * What is ported faithfully:
 *   - Cycle length = recency-weighted mean (105-day half-life). Cycles under 15 days are
 *     dropped; values beyond 2 SD of the rough mean (3+ cycles) keep 25% weight. Only
 *     cycles that started in the last 1095 days count. Python round() is half-to-even and
 *     is reproduced (pyRound).
 *   - Coverage-gap exclusion, length-only branch (6+ completed cycles, cycle >= 2x median).
 *     The source-change branch needs import metadata the web never has.
 *   - Luteal length by cycle length (V2 table: <=25 -> 11, <=30 -> 13, <=35 -> 14, else 15),
 *     averaged per cycle as analyze_luteal_phase does, with the 60/40 blend at 2 cycles.
 *   - Ovulation day: cold start (<3 cycles) uses the default prior (typical length - 13,
 *     min day 6); cycles averaging over 35 days use proportional ovulation (x0.58);
 *     3+ cycles use the historical branch, including the irregular (SD > 5) trimmed-mean /
 *     median and trend nudge. Fertile window = ovulation -5 to +1, capped at cycle length.
 *   - Prediction window margin = round(weighted SD) with 3+ cycles, plus the backend's
 *     running-average bias correction when it is "applicable".
 *
 * Deliberate web differences (each one also listed in DIFFERENCES below):
 *   - The "most likely" date is the iOS headline (start + average). The backend window's
 *     "expected" is one day earlier (start + average - 1); the web centres on the iOS date.
 *   - The app shows one date and only computes a window with 3+ cycles. The web always
 *     shows a range: +/-3 days from one date, +/-2 or half the spread from 2-3 dates, and the
 *     app's margin (minimum 1) from 4+ dates. Ranges for later cycles widen by sqrt(k).
 *   - With no completed cycle the backend falls back to 28 days for the period date; the web
 *     uses the length she typed (the app gets that from onboarding instead).
 *   - Next-period roll-forward follows iOS (repeat until on/after today), not the backend's
 *     single re-anchor step.
 *
 * What the web deliberately does NOT do (reasons to use the app):
 *   temperature (BBT, wrist, ring) fusion, LH or cervical-mucus detection, confirmed
 *   ovulation, labs, flow-pattern adjustment, measured personal luteal length, condition
 *   priors (PCOS threshold 32, perimenopause), age priors, anything stored server-side.
 *   It never makes a "safe days" or contraception statement and never gives a regularity
 *   verdict. On hormonal birth control it never calls a bleed late (context: 'hormonal_bc').
 */

const DAY_MS = 86400000;
const DECAY_HALF_LIFE_DAYS = 105;
const MIN_VALID_CYCLE_LENGTH = 15;
const STATS_LOOKBACK_DAYS = 1095;
const FERTILE_DAYS_BEFORE = 5;
const FERTILE_DAYS_AFTER = 1;
const V2_LUTEAL_DEFAULTS = [[25, 11], [30, 13], [35, 14], [999, 15]];
const PRIOR_DEFAULT = { cycleLength: 28, lutealLength: 13, ovulationDay: 15 };
const PROPORTIONAL_THRESHOLD = 35; // backend uses 32 for PCOS; the web has no condition input
const GAP_RATIO_WITHOUT_SOURCE = 2.0;
const GAP_MIN_HISTORY_FOR_MEDIAN = 3;
const GAP_MIN_OTHERS_FOR_UNCONDITIONAL = 5;

/* Web-only range rules (see header). */
const WEB_MARGIN_ONE_DATE = 3;
const WEB_MARGIN_FEW_DATES_MIN = 2;
const WEB_MARGIN_MIN = 1;
const WIDE_RANGE_SD = 5; // same SD the backend uses to switch to its irregular branch

export const DIFFERENCES = [
  'most_likely_is_ios_date',
  'always_a_range',
  'typed_length_when_no_history',
  'ios_roll_forward',
];

/* ── dates as integer day numbers (UTC, so DST never shifts a day) ── */
export function parseISO(s) {
  if (s instanceof Date) return Math.floor(Date.UTC(s.getFullYear(), s.getMonth(), s.getDate()) / DAY_MS);
  if (typeof s === 'number') return s;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim());
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  const t = Date.UTC(y, mo - 1, d);
  const back = new Date(t);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return null;
  return Math.floor(t / DAY_MS);
}
export function toISO(day) {
  return new Date(day * DAY_MS).toISOString().slice(0, 10);
}

/* ── Python-compatible helpers ── */
export function pyRound(x) { // round-half-to-even, like Python 3 round(x)
  const f = Math.floor(x), d = x - f;
  if (d > 0.5) return f + 1;
  if (d < 0.5) return f;
  return f % 2 === 0 ? f : f + 1;
}
function round1(x) { return pyRound(x * 10) / 10; }
function medianRaw(values) {
  const s = values.slice().sort((a, b) => a - b), n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}

/** v2_default_luteal: luteal length by cycle length. */
export function lutealForCycleLength(cl) {
  for (const [threshold, luteal] of V2_LUTEAL_DEFAULTS) if (cl <= threshold) return luteal;
  return 15;
}

/**
 * _weighted_average_with_decay.
 * @param {Array<[number, number]>} pairs  [cycleLength, ageInDays]
 * @returns {{avg:number, std:number|null, n:number}} avg rounded (half-even), std to 0.1
 */
export function weightedAverageWithDecay(pairs) {
  if (!pairs.length) return { avg: 28, std: null, n: 0 };
  const values = pairs.map(p => p[0]);
  const n = values.length;
  const roughMean = values.reduce((a, b) => a + b, 0) / n;
  const roughStd = n >= 3 ? Math.sqrt(values.reduce((a, v) => a + (v - roughMean) ** 2, 0) / n) : 0;
  const threshold = roughStd > 0 ? 2 * roughStd : Infinity;
  const weightOf = (v, age) => {
    let w = Math.pow(0.5, age / DECAY_HALF_LIFE_DAYS);
    if (threshold < Infinity && Math.abs(v - roughMean) > threshold) w *= 0.25;
    return w;
  };
  let ws = 0, wt = 0;
  for (const [v, age] of pairs) { const w = weightOf(v, age); ws += v * w; wt += w; }
  if (wt === 0) return { avg: 28, std: null, n: 0 };
  const avg = ws / wt;
  let std = null;
  if (n >= 2) {
    let vs = 0, wt2 = 0;
    for (const [v, age] of pairs) { const w = weightOf(v, age); vs += w * (v - avg) ** 2; wt2 += w; }
    std = wt2 > 0 ? round1(Math.sqrt(vs / wt2)) : null;
  }
  return { avg: pyRound(avg), std, n };
}

/** compute_prediction_bias. cycles: oldest first. */
export function predictionBias(lengthsOldestFirst) {
  const valid = lengthsOldestFirst.filter(l => l > 0);
  if (valid.length < 4) return { biasDays: null, sampleSize: 0, applicable: false };
  const errors = [];
  for (let i = 3; i < valid.length; i++) {
    const prior = valid.slice(0, i);
    errors.push(valid[i] - prior.reduce((a, b) => a + b, 0) / prior.length);
  }
  const mean = errors.reduce((a, b) => a + b, 0) / errors.length;
  let consistent = false;
  if (errors.length >= 2) {
    const std = Math.sqrt(errors.reduce((a, e) => a + (e - mean) ** 2, 0) / errors.length);
    consistent = Math.abs(mean) > 0.5 ? std < Math.abs(mean) * 2 : false;
  }
  return { biasDays: round1(mean), sampleSize: errors.length, applicable: Math.abs(mean) >= 0.5 && consistent };
}

/** find_unmeasured_cycle_gaps, length-only branch. Returns a Set of indexes into `lengths`. */
export function coverageGaps(lengths) {
  const gaps = new Set();
  const real = lengths.filter(Boolean);
  if (real.length < GAP_MIN_HISTORY_FOR_MEDIAN + 1) return gaps;
  const med = medianRaw(real);
  if (med <= 0) return gaps;
  if (real.length - 1 < GAP_MIN_OTHERS_FOR_UNCONDITIONAL) return gaps;
  lengths.forEach((l, i) => { if (l && l / med >= GAP_RATIO_WITHOUT_SOURCE) gaps.add(i); });
  return gaps;
}

/**
 * predict(input)
 * @param {object} input
 * @param {Array<string|Date|number>} input.periodStarts  1-12 period start dates (any order;
 *        'YYYY-MM-DD', Date, or day number). Future dates and duplicates are ignored.
 * @param {number} [input.typicalLength=28]  the cycle length she typed (used until her dates
 *        give at least one completed cycle, and for the cold-start ovulation prior)
 * @param {number} [input.periodLength=5]
 * @param {'none'|'hormonal_bc'} [input.context='none']
 * @param {string|Date|number} [input.today]  defaults to the local date
 * @param {number} [input.upcomingCount=3]
 * @returns {object|null}  null when no usable start date. Dates are 'YYYY-MM-DD'.
 *   { nextPeriod:{date,earliest,latest,marginDays,appMarginDays},
 *     ovulation:{date,cycleDay,method}, fertileWindow:{start,end} (next one not yet over;
 *     null on hormonal BC), currentCycleWindow:{start,end,ovulation} (backend parity),
 *     cycleDay, daysPastDue, anchor, cycleLength, periodLength, lutealLength,
 *     cycleStats:{mean,weightedSd,median,shortest,longest,n,completed},
 *     confidence:'typical'|'from_your_dates'|'wide_range', engine:'typical'|'data',
 *     bias:{days,applied}, upcoming:[{date,earliest,latest,fertileStart,fertileEnd,ovulation}],
 *     notes:[copy keys] }
 */
export function predict(input) {
  const opts = input || {};
  const today = opts.today != null ? parseISO(opts.today) : parseISO(new Date());
  const typical = Number.isFinite(+opts.typicalLength) && +opts.typicalLength > 0 ? Math.round(+opts.typicalLength) : 28;
  const plen = Number.isFinite(+opts.periodLength) && +opts.periodLength > 0 ? Math.round(+opts.periodLength) : 5;
  const context = opts.context === 'hormonal_bc' ? 'hormonal_bc' : 'none';
  const upcomingCount = opts.upcomingCount || 3;

  const starts = [...new Set((opts.periodStarts || []).map(parseISO).filter(d => d != null && d <= today))]
    .sort((a, b) => b - a).slice(0, 12); // newest first, like CycleRecord.completed_for
  if (!starts.length) return null;
  const anchor = starts[0];

  // Completed cycles, newest first: length = next start - this start.
  const completed = [];
  for (let i = 1; i < starts.length; i++) completed.push({ start: starts[i], length: starts[i - 1] - starts[i] });
  const totalCycles = completed.length;

  // ── calculate_cycle_stats ──
  const inWindow = completed.filter(c => c.start >= today - STATS_LOOKBACK_DAYS);
  const gapIdx = coverageGaps(inWindow.map(c => c.length));
  const valid = inWindow.filter((c, i) => c.length >= MIN_VALID_CYCLE_LENGTH && !gapIdx.has(i));
  let avgCycle, weightedSd = null, median = null;
  if (valid.length) {
    const w = weightedAverageWithDecay(valid.map(c => [c.length, today - c.start]));
    avgCycle = w.avg; weightedSd = w.std;
    median = pyRound(medianRaw(valid.map(c => c.length)));
  } else {
    avgCycle = inWindow.length ? 28 : typical; // web difference: typed length when no history
  }

  // ── analyze_luteal_phase (calendar branch) ──
  const lutealLengths = [];
  for (const c of completed) {
    const ov = Math.max(c.length - lutealForCycleLength(c.length), plen + 1);
    if (c.length - ov > 0) lutealLengths.push(c.length - ov);
  }
  const avgLuteal = lutealLengths.length ? round1(lutealLengths.reduce((a, b) => a + b, 0) / lutealLengths.length) : null;
  let effectiveLuteal;
  if (avgLuteal && lutealLengths.length >= 3) effectiveLuteal = pyRound(avgLuteal);
  else if (avgLuteal && lutealLengths.length >= 2) effectiveLuteal = pyRound(0.6 * avgLuteal + 0.4 * lutealForCycleLength(avgCycle));
  else effectiveLuteal = lutealForCycleLength(avgCycle);

  // ── predict_fertile_window_4level, levels 4 and 3 ──
  const lengthsAll = completed.map(c => c.length); // newest first, as in the backend
  let cycleSdAll = 0;
  if (totalCycles >= 2) {
    const m = lengthsAll.reduce((a, b) => a + b, 0) / totalCycles;
    cycleSdAll = Math.sqrt(lengthsAll.reduce((a, v) => a + (v - m) ** 2, 0) / totalCycles);
  }
  let fallbackOv = null;
  if (totalCycles < 3) {
    fallbackOv = PRIOR_DEFAULT.ovulationDay;
    if (typical >= 20 && typical <= 60) fallbackOv = Math.max(pyRound(typical - PRIOR_DEFAULT.lutealLength), 6);
  }
  let ovDay, method = 'textbook_fallback';
  if (avgCycle > PROPORTIONAL_THRESHOLD) {
    ovDay = Math.max(pyRound(avgCycle * 0.58), plen + 1); method = 'proportional_long_cycle';
  } else if (totalCycles < 3 && fallbackOv) {
    ovDay = Math.max(fallbackOv, plen + 1); method = 'default_prior';
  } else {
    ovDay = Math.max(avgCycle - effectiveLuteal, plen + 1);
  }
  if (totalCycles >= 3) {
    let avgLen = lengthsAll.reduce((a, b) => a + b, 0) / lengthsAll.length;
    if (cycleSdAll > 5) {
      if (lengthsAll.length >= 4) {
        const s = lengthsAll.slice().sort((a, b) => a - b);
        if (cycleSdAll > 8) avgLen = medianRaw(s);
        else {
          const trim = s.length >= 5 ? Math.max(Math.floor(s.length / 5), 1) : 0;
          const mid = trim > 0 ? s.slice(trim, s.length - trim) : s;
          avgLen = mid.reduce((a, b) => a + b, 0) / mid.length;
        }
      }
      if (lengthsAll.length >= 4) {
        // Faithful to the backend: lengths are newest-first there too, so [-3:] is the
        // three OLDEST cycles. Flagged upstream as a likely backend ordering bug.
        const r = lengthsAll.slice(-3);
        if (r[0] < r[1] && r[1] < r[2]) avgLen += Math.min(((r[2] - r[0]) / 3) * 0.3, 3);
        else if (r[0] > r[1] && r[1] > r[2]) avgLen -= Math.min(((r[0] - r[2]) / 3) * 0.3, 3);
      }
      method = 'iqm_trend_irregular';
    } else {
      method = 'historical_cycle_length';
    }
    if (avgLen > PROPORTIONAL_THRESHOLD) ovDay = Math.max(pyRound(avgLen * 0.58), plen + 1);
    else if (cycleSdAll > 5) ovDay = Math.max(pyRound(avgLen) - lutealForCycleLength(avgLen), plen + 1);
    else ovDay = Math.max(pyRound(avgLen) - effectiveLuteal, plen + 1);
  }

  // ── bias + margin ──
  const bias = predictionBias(lengthsAll.slice().reverse());
  const biasDays = bias.applicable ? pyRound(bias.biasDays) : 0;
  const appMargin = (weightedSd && weightedSd > 0 && totalCycles >= 3) ? pyRound(weightedSd) : null;
  const lens = valid.map(c => c.length);
  const shortest = lens.length ? Math.min(...lens) : null;
  const longest = lens.length ? Math.max(...lens) : null;
  let margin;
  if (appMargin != null) margin = Math.max(appMargin, WEB_MARGIN_MIN);
  else if (totalCycles >= 3) margin = WEB_MARGIN_MIN; // app has data but zero spread
  else if (valid.length) margin = Math.max(WEB_MARGIN_FEW_DATES_MIN, Math.ceil((longest - shortest) / 2));
  else margin = WEB_MARGIN_ONE_DATE;

  // ── next period (iOS headline: start + average, rolled forward past today) ──
  let next = anchor + avgCycle;
  while (next < today) next += avgCycle;
  const daysPastDue = today - (anchor + avgCycle);
  const rangeFor = (date, k) => {
    const m = Math.round(margin * Math.sqrt(k + 1));
    const centre = date + biasDays;
    return { earliest: Math.min(date, centre - m), latest: Math.max(date, centre + m), m };
  };
  const r0 = rangeFor(next, 0);

  // Fertile window: the current cycle's, or the next one's if it has passed.
  const fertileEndDay = Math.min(ovDay + FERTILE_DAYS_AFTER, avgCycle);
  const fertileStartDay = Math.max(ovDay - FERTILE_DAYS_BEFORE, 1);
  const windowFrom = cs => ({ start: cs + fertileStartDay - 1, end: cs + fertileEndDay - 1, ovulation: cs + ovDay - 1 });
  // Backend parity: the cycle the app reports on (anchor, re-anchored once if overdue).
  const backendCycleStart = (today - anchor + 1 > avgCycle) ? anchor + avgCycle : anchor;
  const cw = windowFrom(backendCycleStart);
  let fw = windowFrom(next - avgCycle);
  if (fw.end < today) fw = windowFrom(next);

  const upcoming = [];
  for (let k = 0; k < upcomingCount; k++) {
    const d = next + k * avgCycle, r = rangeFor(d, k), w = windowFrom(d);
    upcoming.push({ date: toISO(d), earliest: toISO(r.earliest), latest: toISO(r.latest),
      fertileStart: toISO(w.start), fertileEnd: toISO(w.end), ovulation: toISO(w.ovulation) });
  }

  let confidence = 'typical';
  if (valid.length) {
    const wide = (weightedSd != null && totalCycles >= 3 && weightedSd > WIDE_RANGE_SD) ||
                 (totalCycles < 3 && longest - shortest >= 8) || margin >= 5;
    confidence = wide ? 'wide_range' : 'from_your_dates';
  }
  const notes = [];
  if (context === 'hormonal_bc') notes.push('hormonal_bc_never_late', 'fertile_window_hidden_bc');
  if (confidence === 'typical') notes.push('add_dates_to_personalise');
  if (completed.some(c => c.length < MIN_VALID_CYCLE_LENGTH)) notes.push('short_gap_ignored');
  if (gapIdx.size) notes.push('long_gap_ignored');
  if (daysPastDue > 0 && context !== 'hormonal_bc') notes.push(today > anchor + avgCycle + r0.m ? 'past_range' : 'inside_range');

  return {
    nextPeriod: { date: toISO(next), earliest: toISO(r0.earliest), latest: toISO(r0.latest), marginDays: margin, appMarginDays: appMargin },
    ovulation: { date: toISO(fw.ovulation), cycleDay: ovDay, method },
    fertileWindow: context === 'hormonal_bc' ? null : { start: toISO(fw.start), end: toISO(fw.end) },
    currentCycleWindow: { start: toISO(cw.start), end: toISO(cw.end), ovulation: toISO(cw.ovulation) },
    cycleDay: Math.max(today - anchor + 1, 1),
    daysPastDue,
    anchor: toISO(anchor),
    cycleLength: avgCycle,
    periodLength: plen,
    lutealLength: avgCycle - ovDay,
    cycleStats: { mean: avgCycle, weightedSd, median, shortest, longest, n: valid.length, completed: totalCycles },
    confidence,
    engine: valid.length ? 'data' : 'typical',
    bias: { days: bias.biasDays, applied: bias.applicable },
    upcoming,
    notes,
  };
}

const CyclePredict = { predict, parseISO, toISO, pyRound, lutealForCycleLength, weightedAverageWithDecay, predictionBias, coverageGaps, DIFFERENCES };
if (typeof window !== 'undefined') window.CyclePredict = CyclePredict;
export default CyclePredict;

/* ── Tests: node js/cycle-predict.js --test ─────────────────────────────────────────
 * H1-H5 are hand-computed (working in comments). P1-P3 are the REAL backend
 * (predict_fertile_window_4level + calculate_cycle_stats) run on the same inputs via a
 * harness that stubs only the database (pinned: today = 2026-10-09, no biomarkers, no
 * condition, no age). Expected = backend ovulation/fertile dates, average, SD, margin;
 * nextPeriod.date = backend window "expected" + 1 day (the iOS headline, see header).
 */
async function runTests() {
  const T = '2026-10-09';
  const cases = [
    { name: 'H1 one date, 28 days', in: { periodStarts: ['2026-09-25'], typicalLength: 28, today: T },
      // next = 09-25 + 28 = 10-23; ov = max(28-13, 6) = day 15 -> 10-09; window day 10..16;
      // that window (10-04..10-10) still includes today, so it is this cycle's. margin = 3.
      want: { 'nextPeriod.date': '2026-10-23', 'nextPeriod.earliest': '2026-10-20', 'nextPeriod.latest': '2026-10-26',
              'ovulation.cycleDay': 15, 'fertileWindow.start': '2026-10-04', 'fertileWindow.end': '2026-10-10', confidence: 'typical', cycleDay: 15 } },
    { name: 'H2 one date, 24 days (cold-start prior, not the table)', in: { periodStarts: ['2026-09-30'], typicalLength: 24, today: T },
      // ov = max(24-13, 6) = 11 (the table would give 24-11 = 13). next = 10-24.
      want: { 'nextPeriod.date': '2026-10-24', 'ovulation.cycleDay': 11, 'fertileWindow.start': '2026-10-05', 'fertileWindow.end': '2026-10-11' } },
    { name: 'H3 one date, 40 days (proportional)', in: { periodStarts: ['2026-09-20'], typicalLength: 40, today: T },
      // avg 40 > 35 -> ov = round(40*0.58 = 23.2) = 23 -> 10-12; window 10-07..10-13; next 10-30.
      want: { 'nextPeriod.date': '2026-10-30', 'ovulation.cycleDay': 23, 'fertileWindow.start': '2026-10-07', 'ovulation.method': 'proportional_long_cycle' } },
    { name: 'H4 two dates, one completed cycle of 30', in: { periodStarts: ['2026-09-15', '2026-08-16'], typicalLength: 28, today: T },
      // avg = 30 (single cycle), SD null -> web margin max(2, 0) = 2. ov = prior 28-13 = 15.
      want: { 'nextPeriod.date': '2026-10-15', 'nextPeriod.earliest': '2026-10-13', 'nextPeriod.latest': '2026-10-17',
              'ovulation.cycleDay': 15, 'cycleStats.mean': 30, confidence: 'from_your_dates' } },
    { name: 'H5 old date rolls forward (iOS)', in: { periodStarts: ['2026-08-01'], typicalLength: 28, today: T },
      // 08-01 +28 = 08-29, +28 = 09-26, +28 = 10-24 (first on/after today). due date passed by 41 days.
      want: { 'nextPeriod.date': '2026-10-24', daysPastDue: 41 } },
    { name: 'P1 backend: 5 regular dates', in: { periodStarts: ['2026-09-20', '2026-08-22', '2026-07-25', '2026-06-26', '2026-05-27'], typicalLength: 28, periodLength: 5, today: T },
      want: { 'cycleStats.mean': 29, 'cycleStats.weightedSd': 0.7, 'nextPeriod.appMarginDays': 1, 'nextPeriod.date': '2026-10-19',
              'ovulation.cycleDay': 16, 'currentCycleWindow.ovulation': '2026-10-05',
              'currentCycleWindow.start': '2026-09-30', 'currentCycleWindow.end': '2026-10-06',
              // that window is over, so the page shows the next one: 10-19 + 15 days
              'fertileWindow.start': '2026-10-29', 'fertileWindow.end': '2026-11-04' } },
    { name: 'P2 backend: 7 irregular dates (SD>5 trimmed mean, trend, bias)', in: { periodStarts: ['2026-09-28', '2026-08-19', '2026-07-23', '2026-06-17', '2026-05-17', '2026-04-22', '2026-03-31'], typicalLength: 30, periodLength: 5, today: T },
      // backend: avg 32, SD 6.4, margin 6, bias +7, iqm_trend_irregular, ov day 16 = 10-13,
      // window 10-08..10-14, expected 11-05 (= 09-28 + 32 - 1 + 7). Web: most likely 10-30
      // (iOS), range = [min(10-30, 11-06 - 6), max(10-30, 11-06 + 6)].
      want: { 'cycleStats.mean': 32, 'cycleStats.weightedSd': 6.4, 'nextPeriod.appMarginDays': 6, 'bias.applied': true,
              'ovulation.method': 'iqm_trend_irregular', 'ovulation.cycleDay': 16, 'currentCycleWindow.ovulation': '2026-10-13',
              'fertileWindow.start': '2026-10-08', 'fertileWindow.end': '2026-10-14',
              'nextPeriod.date': '2026-10-30', 'nextPeriod.earliest': '2026-10-30', 'nextPeriod.latest': '2026-11-12', confidence: 'wide_range' } },
    { name: 'P3 backend: 3 long dates (proportional, <3 cycles)', in: { periodStarts: ['2026-09-26', '2026-08-18', '2026-07-12'], typicalLength: 38, periodLength: 6, today: T },
      // backend: avg 38, SD 1.0, no window (2 cycles), proportional ov day 22 = 10-17, window 10-12..10-18.
      want: { 'cycleStats.mean': 38, 'cycleStats.weightedSd': 1, 'nextPeriod.appMarginDays': null, 'ovulation.method': 'proportional_long_cycle',
              'ovulation.cycleDay': 22, 'fertileWindow.start': '2026-10-12', 'fertileWindow.end': '2026-10-18',
              'nextPeriod.date': '2026-11-03', 'nextPeriod.earliest': '2026-11-01', 'nextPeriod.latest': '2026-11-05' } },
  ];
  let failed = 0;
  const get = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  for (const c of cases) {
    const out = predict(c.in);
    const bad = Object.entries(c.want).filter(([k, v]) => get(out, k) !== v).map(([k, v]) => `${k}: want ${v}, got ${get(out, k)}`);
    console.log(`${bad.length ? 'FAIL' : 'ok  '} ${c.name}${bad.length ? '\n     ' + bad.join('\n     ') : ''}`);
    if (bad.length) failed++;
  }
  console.log(failed ? `${failed} failing` : `all ${cases.length} passing`);
  if (typeof process !== 'undefined') process.exitCode = failed ? 1 : 0;
}
if (typeof process !== 'undefined' && process.argv && process.argv.includes('--test')) runTests();
