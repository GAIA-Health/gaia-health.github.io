#!/usr/bin/env node
// App Store Connect — Sales & Trends puller: SUBSCRIPTION / SUBSCRIPTION_EVENT / SALES.
// Read-only. Pulls gzipped TSV reports from GET /v1/salesReports.
//
// ROLE NOTE: reading Sales/Subscription reports needs a key with Finance, Sales,
// or Admin role. The key at ASC_KEY_PATH is Admin (per scripts/asc/.env), so it
// should have access.
//
// Env: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH, ASC_VENDOR_NUMBER
//   source scripts/asc/.env
//
// Usage:
//   node scripts/asc/asc-subscriptions.mjs subscription <YYYY-MM-DD> [outDir]
//   node scripts/asc/asc-subscriptions.mjs event <YYYY-MM-DD> [outDir]
//   node scripts/asc/asc-subscriptions.mjs sales-monthly <YYYY-MM> [outDir]
//   node scripts/asc/asc-subscriptions.mjs sweep <outDir>
//
// "sweep" pulls: SUBSCRIPTION + SUBSCRIPTION_EVENT daily reports for the last
// available day of each month Jan..Sep 2026 (walking backward from month-end
// if a given day 404s, since these reports lag ~1-2 days), the single latest
// available day overall, and SALES SUMMARY MONTHLY reports for Jan..Aug 2026.
// Writes raw TSVs + a JSON index to outDir; prints a summary to stdout.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const BASE = 'https://api.appstoreconnect.apple.com';

function need(name) {
  const v = process.env[name];
  if (!v) { console.error(`Missing env var: ${name}. Run: source scripts/asc/.env`); process.exit(1); }
  return v;
}
function b64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function token() {
  const keyId = need('ASC_KEY_ID'), issuer = need('ASC_ISSUER_ID');
  const pem = fs.readFileSync(need('ASC_KEY_PATH'), 'utf8');
  const now = Math.floor(Date.now() / 1000);
  const head = { alg: 'ES256', kid: keyId, typ: 'JWT' };
  const payload = { iss: issuer, iat: now, exp: now + 900, aud: 'appstoreconnect-v1' };
  const si = `${b64url(JSON.stringify(head))}.${b64url(JSON.stringify(payload))}`;
  const sig = crypto.sign('sha256', Buffer.from(si), { key: pem, dsaEncoding: 'ieee-p1363' });
  return `${si}.${b64url(sig)}`;
}

// Pulls one report. Returns { tsv, meta } on success, null on a clean 404
// (no report for this date/params — try a different date). Throws on any
// other non-2xx (403, 409, etc.) with the response body attached.
async function pullReport({ reportType, frequency, reportDate, version, reportSubType, vendor }) {
  vendor = vendor || need('ASC_VENDOR_NUMBER');
  const qs = new URLSearchParams({
    'filter[frequency]': frequency,
    'filter[reportType]': reportType,
    'filter[vendorNumber]': vendor,
    'filter[reportDate]': reportDate,
    'filter[version]': version,
  });
  if (reportSubType) qs.set('filter[reportSubType]', reportSubType);
  const url = `${BASE}/v1/salesReports?${qs}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token()}`, Accept: 'application/a-gzip' },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`${reportType} ${frequency} ${reportDate} v${version} -> ${res.status}: ${body.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const tsv = zlib.gunzipSync(buf).toString('utf8');
  return { tsv, meta: { reportType, frequency, reportDate, version, reportSubType, url: url.toString() } };
}

// Try a list of versions in order, return first that succeeds (non-null),
// collecting attempt errors/statuses along the way for reporting. A clean
// 404 on the first version means "no data for this date" and is NOT
// retried on other versions (saves a request on sparse-data days); a
// 409/400 (likely a version/reportSubType mismatch) DOES fall through to
// the next version. Any other error throws immediately.
async function pullWithVersions(base, versions, attempts) {
  for (const version of versions) {
    try {
      const r = await pullReport({ ...base, version });
      attempts.push({ ...base, version, status: 'OK' });
      if (r) return r;
      attempts[attempts.length - 1].status = '404';
      return null;
    } catch (e) {
      attempts.push({ ...base, version, status: e.status || 'ERROR', error: e.message });
      if (e.status && e.status !== 409 && e.status !== 400) throw e;
      // else: fall through and try next version
    }
  }
  return null;
}

function isoDaysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

function lastDayOfMonth(year, month1to12) {
  // month1to12: 1-12. Returns YYYY-MM-DD for the last calendar day of that month.
  const d = new Date(Date.UTC(year, month1to12, 0));
  return d.toISOString().slice(0, 10);
}

function addDaysStr(dateStr, delta) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

function ym(dateStr) { return dateStr.slice(0, 7); }

async function saveRaw(outDir, filename, tsv, meta) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, filename), tsv, 'utf8');
  return meta;
}

// ---- individual pull commands (also used by sweep) ----

async function cmdSubscription(dateStr, outDir, attempts = []) {
  const r = await pullWithVersions(
    { reportType: 'SUBSCRIPTION', frequency: 'DAILY', reportDate: dateStr, reportSubType: 'SUMMARY' },
    ['1_4', '1_3'],
    attempts,
  );
  if (r && outDir) await saveRaw(outDir, `subscription_${dateStr}.tsv`, r.tsv, r.meta);
  return r;
}

async function cmdEvent(dateStr, outDir, attempts = []) {
  const r = await pullWithVersions(
    { reportType: 'SUBSCRIPTION_EVENT', frequency: 'DAILY', reportDate: dateStr, reportSubType: 'SUMMARY' },
    ['1_4', '1_3'],
    attempts,
  );
  if (r && outDir) await saveRaw(outDir, `subscription_event_${dateStr}.tsv`, r.tsv, r.meta);
  return r;
}

async function cmdSalesMonthly(yyyyMm, outDir, attempts = []) {
  const r = await pullWithVersions(
    { reportType: 'SALES', frequency: 'MONTHLY', reportDate: yyyyMm, reportSubType: 'SUMMARY' },
    ['1_0'],
    attempts,
  );
  if (r && outDir) await saveRaw(outDir, `sales_monthly_${yyyyMm}.tsv`, r.tsv, r.meta);
  return r;
}

// Walk backward from a target date (up to `maxBack` days) trying `puller`
// until one succeeds. Returns { dateUsed, result } or { dateUsed: null }.
async function findLatestAvailable(puller, targetDate, maxBack, outDir, attemptsAll) {
  for (let i = 0; i <= maxBack; i++) {
    const d = addDaysStr(targetDate, -i);
    const attempts = [];
    const r = await puller(d, outDir, attempts);
    attemptsAll.push(...attempts.map((a) => ({ ...a, dateTried: d })));
    if (r) return { dateUsed: d, result: r };
  }
  return { dateUsed: null, result: null };
}

async function cmdSweep(outDir) {
  outDir = outDir || 'asc-subscriptions-out';
  const rawDir = path.join(outDir, 'raw');
  fs.mkdirSync(rawDir, { recursive: true });

  const attemptsAll = [];
  const index = { subscription: {}, event: { byDay: {} }, salesMonthly: {}, latest: {} };

  const now = new Date();
  const monthsThisYear = []; // [year, month1-12] for Jan..Sep 2026 (or up to current month if earlier)
  for (let m = 1; m <= 9; m++) monthsThisYear.push([2026, m]);

  console.log('== SUBSCRIPTION (month-end snapshots, Jan-Sep 2026) ==');
  for (const [y, m] of monthsThisYear) {
    const target = lastDayOfMonth(y, m);
    // Don't try dates in the future.
    if (new Date(target + 'T00:00:00Z') > now) { console.log(`${ym(target)}: skipped (future month)`); continue; }
    const { dateUsed } = await findLatestAvailable(cmdSubscription, target, 6, rawDir, attemptsAll);
    index.subscription[ym(target)] = dateUsed ? { dateUsed, file: `subscription_${dateUsed}.tsv` } : null;
    console.log(`${ym(target)}: ${dateUsed ? `OK -> ${dateUsed}` : 'NO DATA (tried ' + target + ' back 6 days)'}`);
  }

  console.log('\n== SUBSCRIPTION_EVENT (DAILY scan, every day Jan 1 - latest available, to catch sparse events) ==');
  // Events only exist on days something actually happened (404 otherwise), so
  // a month-end snapshot would miss almost everything. Walk every day.
  {
    const start = '2026-01-01';
    const end = isoDaysAgo(1); // reports lag ~1-2 days; don't bother with "today"
    let d = start;
    let daysWithData = 0, daysChecked = 0;
    while (d <= end) {
      daysChecked++;
      const attempts = [];
      const r = await cmdEvent(d, rawDir, attempts);
      attemptsAll.push(...attempts.map((a) => ({ ...a, dateTried: d })));
      if (r) { index.event.byDay[d] = `subscription_event_${d}.tsv`; daysWithData++; }
      d = addDaysStr(d, 1);
    }
    console.log(`Checked ${daysChecked} days, found event data on ${daysWithData} of them.`);
  }

  console.log('\n== Latest available day overall (SUBSCRIPTION) ==');
  {
    const target = isoDaysAgo(1);
    const subLatest = await findLatestAvailable(cmdSubscription, target, 10, rawDir, attemptsAll);
    index.latest.subscription = subLatest.dateUsed ? { dateUsed: subLatest.dateUsed, file: `subscription_${subLatest.dateUsed}.tsv` } : null;
    console.log(`SUBSCRIPTION latest: ${subLatest.dateUsed || 'NONE FOUND'}`);
    const eventDays = Object.keys(index.event.byDay).sort();
    index.latest.event = eventDays.length ? { dateUsed: eventDays[eventDays.length - 1], file: index.event.byDay[eventDays[eventDays.length - 1]] } : null;
    console.log(`SUBSCRIPTION_EVENT latest (from daily scan): ${index.latest.event ? index.latest.event.dateUsed : 'NONE FOUND'}`);
  }

  console.log('\n== SALES SUMMARY MONTHLY (Jan-Aug 2026) ==');
  for (let m = 1; m <= 8; m++) {
    const yyyyMm = `2026-${String(m).padStart(2, '0')}`;
    if (new Date(`${yyyyMm}-01T00:00:00Z`) > now) { console.log(`${yyyyMm}: skipped (future month)`); continue; }
    const attempts = [];
    const r = await cmdSalesMonthly(yyyyMm, rawDir, attempts);
    attemptsAll.push(...attempts.map((a) => ({ ...a, dateTried: yyyyMm })));
    index.salesMonthly[yyyyMm] = r ? { file: `sales_monthly_${yyyyMm}.tsv` } : null;
    console.log(`${yyyyMm}: ${r ? 'OK' : 'NO DATA'}`);
  }

  fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 2));
  fs.writeFileSync(path.join(outDir, 'attempts.json'), JSON.stringify(attemptsAll, null, 2));
  console.log(`\nWrote index.json + attempts.json + raw/ to ${outDir}`);
}

const [cmd, a, b] = process.argv.slice(2).filter((x) => !x.startsWith('--'));
try {
  if (cmd === 'subscription' && a) {
    const attempts = [];
    const r = await cmdSubscription(a, b, attempts);
    console.log(r ? r.tsv : `No SUBSCRIPTION report for ${a}.`);
    console.error('\nAttempts:', JSON.stringify(attempts, null, 2));
  } else if (cmd === 'event' && a) {
    const attempts = [];
    const r = await cmdEvent(a, b, attempts);
    console.log(r ? r.tsv : `No SUBSCRIPTION_EVENT report for ${a}.`);
    console.error('\nAttempts:', JSON.stringify(attempts, null, 2));
  } else if (cmd === 'sales-monthly' && a) {
    const attempts = [];
    const r = await cmdSalesMonthly(a, b, attempts);
    console.log(r ? r.tsv : `No SALES SUMMARY MONTHLY report for ${a}.`);
    console.error('\nAttempts:', JSON.stringify(attempts, null, 2));
  } else if (cmd === 'sweep') {
    await cmdSweep(a);
  } else {
    console.log([
      'Usage:',
      '  node scripts/asc/asc-subscriptions.mjs subscription <YYYY-MM-DD> [outDir]',
      '  node scripts/asc/asc-subscriptions.mjs event <YYYY-MM-DD> [outDir]',
      '  node scripts/asc/asc-subscriptions.mjs sales-monthly <YYYY-MM> [outDir]',
      '  node scripts/asc/asc-subscriptions.mjs sweep <outDir>',
    ].join('\n'));
    process.exit(1);
  }
} catch (e) {
  console.error('\nError:', e.message);
  process.exit(1);
}
