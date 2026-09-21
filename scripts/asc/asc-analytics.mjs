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

// ---- App Analytics reports (impressions / page views / downloads BY SOURCE) ----
// Pulls from the request in ASC_ANALYTICS_REQUEST (currently the ONGOING one --
// the one-time snapshot was deleted 2026-07-27 and never recreated, so only
// ~37 days of history exist; use `sales` for anything longer).
//
// Report picking matters: "App Downloads" is the ONLY download-attribution
// report (Download Type x Source Type). "Discovery and Engagement" has
// Impression/Page view/Tap and NO downloads -- its Tap rows only ever carry
// search/browse, which is not evidence that web referrals do not convert.
// The Detailed variants are volume-suppressed to a fraction of reality and
// their Campaign/Source Info columns are blank at our volume.

async function apiGet(path) {
  const r = await fetch(BASE + path, { headers: { Authorization: `Bearer ${token()}` } });
  const t = await r.text();
  if (!r.ok) throw new Error(`${path} -> ${r.status}: ${t.slice(0, 200)}`);
  return JSON.parse(t);
}

async function cmdReport(nameSub, gran = 'WEEKLY') {
  const req = need('ASC_ANALYTICS_REQUEST');
  const reports = (await apiGet(`/v1/analyticsReportRequests/${req}/reports?limit=200`)).data;
  if (!nameSub) {
    console.log('Available reports (pass a name substring + granularity):');
    for (const r of reports) console.log(`  [${r.attributes.category}] ${r.attributes.name}`);
    return;
  }
  const rep = reports.find((r) => r.attributes.name.toLowerCase().includes(nameSub.toLowerCase()));
  if (!rep) throw new Error(`No report matching "${nameSub}". Run \`report\` with no args to list.`);
  console.log(`Report: ${rep.attributes.name} [${rep.attributes.category}] granularity=${gran}\n`);
  const insts = (await apiGet(`/v1/analyticsReports/${rep.id}/instances?filter[granularity]=${gran}&limit=200`)).data;
  if (!insts.length) { console.log('No instances yet — snapshot still generating (~24-48h). Re-run later.'); return; }
  // ── Fetch every instance's rows, tagged with the instance processingDate ──
  // ONGOING instances RESTATE prior days: each daily Discovery-and-Engagement
  // instance carries a ~3-day window, and App Downloads re-emits earlier dates.
  // Concatenating them blindly inflates every total ~3x, so we dedup below.
  let header = null;
  const perInstance = [];
  for (const inst of insts) {
    const pd = inst.attributes.processingDate || inst.id;
    const rows = [];
    const segs = (await apiGet(`/v1/analyticsReportInstances/${inst.id}/segments?limit=100`)).data;
    for (const s of segs) {
      const buf = Buffer.from(await (await fetch(s.attributes.url)).arrayBuffer());
      const txt = zlib.gunzipSync(buf).toString('utf8');
      const lines = txt.trim().split('\n');
      const delim = lines[0].includes('\t') ? '\t' : ',';
      const h = lines[0].split(delim);
      if (!header) header = h;
      else if (h.join('|') !== header.join('|')) {
        console.warn(`  ! column layout differs in instance ${pd}; skipping that segment`);
        continue;
      }
      for (const l of lines.slice(1)) rows.push(l.split(delim));
    }
    perInstance.push({ pd, rows });
  }

  // ── Dedup: for each Date, keep only rows from the LATEST instance holding it ──
  const iDate = header ? header.findIndex((h) => /^date$/i.test(h)) : -1;
  let rows = [];
  if (iDate >= 0) {
    const bestPd = new Map();
    for (const { pd, rows: rs } of perInstance) {
      for (const r of rs) {
        const d = r[iDate];
        if (!bestPd.has(d) || pd > bestPd.get(d)) bestPd.set(d, pd);
      }
    }
    for (const { pd, rows: rs } of perInstance) {
      for (const r of rs) if (bestPd.get(r[iDate]) === pd) rows.push(r);
    }
    const dropped = perInstance.reduce((n, i) => n + i.rows.length, 0) - rows.length;
    console.log(`Instances: ${perInstance.length}  dates: ${bestPd.size}  restated rows dropped: ${dropped}`);
  } else {
    rows = perInstance.flatMap((i) => i.rows);
    console.warn('! No "Date" column — cannot dedup restated rows; totals may be inflated.');
  }

  console.log(`Columns: ${header.join(' | ')}`);
  console.log(`Rows: ${rows.length}`);

  // Aggregate by "Source Type", split by the row-kind column so we never add
  // together things that are not the same thing. "App Downloads" mixes
  // First-time download / Redownload / Auto-update; "Discovery and Engagement"
  // mixes Impression / Page view / Tap. Summing across those is meaningless.
  const iSrc = header.findIndex((h) => /source type/i.test(h));
  const iCnt = header.findIndex((h) => /^(counts|impressions|unique devices|product page views|downloads)$/i.test(h));
  const iKind = header.findIndex((h) => /^(download type|event)$/i.test(h));
  if (iSrc >= 0 && iCnt >= 0) {
    const byKind = {};
    for (const r of rows) {
      const kind = iKind >= 0 ? (r[iKind] || '(blank)') : 'All rows';
      const src = r[iSrc] || '(none)';
      byKind[kind] = byKind[kind] || {};
      byKind[kind][src] = (byKind[kind][src] || 0) + (parseInt(r[iCnt], 10) || 0);
    }
    const kinds = Object.entries(byKind)
      .map(([k, agg]) => [k, agg, Object.values(agg).reduce((a, b) => a + b, 0)])
      .sort((a, b) => b[2] - a[2]);
    for (const [kind, agg, total] of kinds) {
      console.log(`\n${kind} — by ${header[iSrc]} (sum of ${header[iCnt]}), total ${total}:`);
      for (const [k, v] of Object.entries(agg).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${k.padEnd(28)} ${String(v).padStart(8)}  (${(v / (total || 1) * 100).toFixed(1)}%)`);
      }
    }
    if (iKind < 0) console.warn('\n! No Download Type/Event column found — rows may mix event kinds.');
  } else {
    console.log('\nFirst 10 rows:'); for (const r of rows.slice(0, 10)) console.log('  ' + r.join(' | '));
  }
}

const [cmd, a, b] = process.argv.slice(2).filter((x) => !x.startsWith('--'));
try {
  if (cmd === 'sales' && a) await cmdSales(a, b);
  else if (cmd === 'report') await cmdReport(a, b);
  else {
    console.log('Usage:\n  node scripts/asc/asc-analytics.mjs sales <YYYY-MM-DD> [end]\n  node scripts/asc/asc-analytics.mjs report ["name substring"] [DAILY|WEEKLY|MONTHLY]');
    process.exit(1);
  }
} catch (e) {
  console.error('\nError:', e.message);
  process.exit(1);
}
