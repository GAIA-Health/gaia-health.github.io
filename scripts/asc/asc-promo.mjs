#!/usr/bin/env node
// App Store Connect — app-level PROMOTIONAL TEXT (170 chars, NOT search-indexed).
// Promo text is editable on the LIVE version without a new release or review.
//
// Usage:
//   node scripts/asc/asc-promo.mjs audit                          # show current promo per locale (read-only)
//   node scripts/asc/asc-promo.mjs set "New text" en-US,en-GB     # dry-run for those locales
//   node scripts/asc/asc-promo.mjs set "New text" en-US,en-GB --apply
//
// Env (scripts/asc/.env): ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH, ASC_APP_ID.
// App Manager or Admin key both work (this is App Metadata scope).

import crypto from 'node:crypto';
import fs from 'node:fs';

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

async function api(method, path, body) {
  const r = await fetch(BASE + path, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`${method} ${path} -> ${r.status}: ${t.slice(0, 300)}`);
  return t ? JSON.parse(t) : null;
}

async function liveVersionLocalizations() {
  const appId = need('ASC_APP_ID');
  const vers = await api('GET', `/v1/apps/${appId}/appStoreVersions?filter[appVersionState]=READY_FOR_DISTRIBUTION&filter[platform]=IOS&limit=1`)
    .catch(() => api('GET', `/v1/apps/${appId}/appStoreVersions?filter[appStoreState]=READY_FOR_SALE&filter[platform]=IOS&limit=1`));
  const v = vers.data[0];
  if (!v) throw new Error('No live (READY_FOR_SALE) version found.');
  const locs = await api('GET', `/v1/appStoreVersions/${v.id}/appStoreVersionLocalizations?limit=50`);
  return { version: v, locs: locs.data };
}

async function cmdAudit() {
  const { version, locs } = await liveVersionLocalizations();
  console.log(`Live version ${version.attributes.versionString} (${version.id})\n`);
  for (const l of locs.sort((a, b) => a.attributes.locale.localeCompare(b.attributes.locale))) {
    const p = l.attributes.promotionalText || '(empty)';
    console.log(`[${l.attributes.locale}] (${(l.attributes.promotionalText || '').length}/170)\n  ${p}\n`);
  }
}

async function cmdSet(text, localeCsv, apply) {
  if (!text) throw new Error('Usage: set "<text>" <locale,locale,...> [--apply]');
  if (text.length > 170) throw new Error(`Text is ${text.length} chars (max 170).`);
  const targets = (localeCsv || 'en-US').split(',').map((s) => s.trim());
  const { version, locs } = await liveVersionLocalizations();
  console.log(`Live version ${version.attributes.versionString} — setting promo text (${text.length}/170) for: ${targets.join(', ')}${apply ? '' : ' [DRY RUN]'}\n`);
  for (const locale of targets) {
    const l = locs.find((x) => x.attributes.locale === locale);
    if (!l) { console.log(`[${locale}] SKIP — no localization on the live version`); continue; }
    const current = l.attributes.promotionalText || '(empty)';
    if (!apply) { console.log(`[${locale}] would replace:\n  OLD: ${current}\n  NEW: ${text}\n`); continue; }
    await api('PATCH', `/v1/appStoreVersionLocalizations/${l.id}`, {
      data: { type: 'appStoreVersionLocalizations', id: l.id, attributes: { promotionalText: text } },
    });
    console.log(`[${locale}] UPDATED ✓`);
  }
  if (!apply) console.log('Dry run only. Re-run with --apply to ship.');
}

const argv = process.argv.slice(2);
const apply = argv.includes('--apply');
const [cmd, a, b] = argv.filter((x) => x !== '--apply');
try {
  if (cmd === 'audit') await cmdAudit();
  else if (cmd === 'set') await cmdSet(a, b, apply);
  else {
    console.log('Usage:\n  node scripts/asc/asc-promo.mjs audit\n  node scripts/asc/asc-promo.mjs set "<text>" <locale,locale,...> [--apply]');
    process.exit(1);
  }
} catch (e) {
  console.error('\nError:', e.message);
  process.exit(1);
}
