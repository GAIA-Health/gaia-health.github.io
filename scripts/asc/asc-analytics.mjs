#!/usr/bin/env node
// App Store Connect — Sales & Trends puller: DOWNLOADS BY APP VERSION.
// Use this to compare the impact of different version builds (a rough A/B across releases).
//
// ROLE NOTE: reading Sales reports needs a key with the Finance, Sales, or Admin role.
// The CPP automation key is App Manager and will likely get 403 here — issue a separate
// Finance/Sales key (or temporarily use Admin) and point ASC_KEY_ID/ASC_KEY_PATH at it.
//
// Also requires the VENDOR NUMBER (App Store Connect > Payments and Financial Reports,
// or Sales and Trends > top-left). Sales data lags ~1-2 days; very recent dates return 404.
//
// Env: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH, ASC_VENDOR_NUMBER
//
// Usage:
//   node scripts/asc/asc-analytics.mjs sales 2026-06-08                 # one day
//   node scripts/asc/asc-analytics.mjs sales 2026-06-01 2026-06-08      # inclusive range
//
// Output: units grouped by app Version, split into new downloads / redownloads / updates.
//
// NOT covered here (documented in docs-private/ASO.md):
//   - Impressions, product-page views, and conversion rate -> App Analytics Reports API
//     (analyticsReportRequests flow; generates async, downloads gzipped CSV segments).
//   - True store-page A/B testing -> Product Page Optimization (mostly a UI feature).

import crypto from 'node:crypto';
import fs from 'node:fs';
import zlib from 'node:zlib';

const BASE = 'https://api.appstoreconnect.apple.com';

function need(name) {
  const v = process.env[name];
  if (!v) { console.error(`Missing env var: ${name}. See header of this file.`); process.exit(1); }
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

function classify(productType) {
  // Apple product type identifiers: "1*" first-time download, "3" redownload, "7*" update.
  if (/^1/.test(productType)) return 'newDownloads';
  if (/^3/.test(productType)) return 'redownloads';
  if (/^7/.test(productType)) return 'updates';
  return 'other';
}

async function salesForDate(dateStr) {
  const vendor = need('ASC_VENDOR_NUMBER');
  const qs = new URLSearchParams({
    'filter[frequency]': 'DAILY',
    'filter[reportType]': 'SALES',
    'filter[reportSubType]': 'SUMMARY',
    'filter[vendorNumber]': vendor,
    'filter[reportDate]': dateStr,
    'filter[version]': '1_0',
  });
  const res = await fetch(`${BASE}/v1/salesReports?${qs}`, {
    headers: { Authorization: `Bearer ${token()}`, Accept: 'application/a-gzip' },
  });
  if (res.status === 404) return null; // no data yet for this date
  if (res.status === 403) throw new Error('403 Forbidden — this key lacks Sales access. Use a Finance/Sales/Admin key.');
  if (!res.ok) throw new Error(`salesReports ${dateStr} -> ${res.status}: ${await res.text()}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const tsv = zlib.gunzipSync(buf).toString('utf8');
  return tsv;
}

function aggregate(tsv, acc) {
  const lines = tsv.trim().split('\n');
  const header = lines[0].split('\t');
  const iUnits = header.indexOf('Units');
  const iVer = header.indexOf('Version');
  const iType = header.indexOf('Product Type Identifier');
  for (const line of lines.slice(1)) {
    const c = line.split('\t');
    if (!c[iUnits]) continue;
    const ver = c[iVer] || '(unknown)';
    const bucket = classify(c[iType] || '');
    acc[ver] = acc[ver] || { newDownloads: 0, redownloads: 0, updates: 0, other: 0 };
    acc[ver][bucket] += parseInt(c[iUnits], 10) || 0;
  }
}

function* dateRange(start, end) {
  const d = new Date(start + 'T00:00:00Z');
  const last = new Date(end + 'T00:00:00Z');
  while (d <= last) {
    yield d.toISOString().slice(0, 10);
    d.setUTCDate(d.getUTCDate() + 1);
  }
}

async function cmdSales(start, end) {
  end = end || start;
  const acc = {};
  let missing = 0;
  for (const day of dateRange(start, end)) {
    const tsv = await salesForDate(day);
    if (tsv === null) { missing++; continue; }
    aggregate(tsv, acc);
  }
  const versions = Object.keys(acc).sort();
  if (!versions.length) {
    console.log(`No sales data for ${start}..${end} (${missing} day(s) had no report yet — data lags ~1-2 days).`);
    return;
  }
  console.log(`Downloads by version, ${start}..${end}${missing ? ` (${missing} day(s) not yet available)` : ''}:\n`);
  console.log('Version        New    Redl   Updates');
  let tNew = 0, tRe = 0, tUp = 0;
  for (const v of versions) {
    const a = acc[v];
    tNew += a.newDownloads; tRe += a.redownloads; tUp += a.updates;
    console.log(`${v.padEnd(13)} ${String(a.newDownloads).padStart(5)} ${String(a.redownloads).padStart(6)} ${String(a.updates).padStart(8)}`);
  }
  console.log(`${'TOTAL'.padEnd(13)} ${String(tNew).padStart(5)} ${String(tRe).padStart(6)} ${String(tUp).padStart(8)}`);
}

const [cmd, a, b] = process.argv.slice(2).filter((x) => !x.startsWith('--'));
try {
  if (cmd === 'sales' && a) await cmdSales(a, b);
  else { console.log('Usage: node scripts/asc/asc-analytics.mjs sales <YYYY-MM-DD> [end YYYY-MM-DD]'); process.exit(1); }
} catch (e) {
  console.error('\nError:', e.message);
  process.exit(1);
}
