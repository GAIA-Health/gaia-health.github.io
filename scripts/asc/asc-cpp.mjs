#!/usr/bin/env node
// App Store Connect — Custom Product Page (CPP) automation
// Zero external dependencies (Node 18+: global fetch + ES256 JWT via crypto dsaEncoding).
//
// Secrets come ONLY from environment variables. Nothing is hardcoded or committed.
//   ASC_KEY_ID     Key ID, e.g. 9XR2W9PT44 (it's the suffix of AuthKey_<KEY_ID>.p8)
//   ASC_ISSUER_ID  Issuer ID (UUID) from App Store Connect > Users & Access >
//                  Integrations > App Store Connect API. The key must have the
//                  Admin or App Manager role for CPP writes.
//   ASC_KEY_PATH   Absolute path to the AuthKey_<KEY_ID>.p8 file.
//   ASC_APP_ID     (optional) numeric app RESOURCE id — discovered by `audit`.
//                  Note: this is the API resource id, NOT the 6608432371 store id.
//
// Commands:
//   node scripts/asc/asc-cpp.mjs audit
//       Read-only. Verifies auth, lists your apps, and lists existing CPPs + states.
//       Run this FIRST to confirm credentials work without touching the listing.
//
//   node scripts/asc/asc-cpp.mjs sync scripts/asc/verticals.json [--apply]
//       Reconciles CPPs from config: creates any missing page (shell + version),
//       and sets promotional text per locale. Without --apply it's a DRY RUN that
//       prints what it WOULD do. Screenshots are NOT handled here (see README).
//
// A CPP cannot go live without screenshots — this tool builds the text/shell;
// screenshots are an asset step done in the ASC UI or via a separate media upload.

import crypto from 'node:crypto';
import fs from 'node:fs';

const BASE = 'https://api.appstoreconnect.apple.com';
const APPLY = process.argv.includes('--apply');

function need(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name}. See the header of this file.`);
    process.exit(1);
  }
  return v;
}

function b64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// Mint a short-lived ES256 JWT for the ASC API.
function token() {
  const keyId = need('ASC_KEY_ID');
  const issuer = need('ASC_ISSUER_ID');
  const pem = fs.readFileSync(need('ASC_KEY_PATH'), 'utf8');
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'ES256', kid: keyId, typ: 'JWT' };
  const payload = { iss: issuer, iat: now, exp: now + 60 * 15, aud: 'appstoreconnect-v1' };
  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  // ASC expects JOSE (raw r||s) signatures, not DER — hence dsaEncoding ieee-p1363.
  const sig = crypto.sign('sha256', Buffer.from(signingInput), { key: pem, dsaEncoding: 'ieee-p1363' });
  return `${signingInput}.${b64url(sig)}`;
}

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(`ASC ${method} ${path} -> ${res.status}\n${JSON.stringify(json.errors || json, null, 2)}`);
  }
  return json;
}

// ---- read helpers -------------------------------------------------------

async function listApps() {
  const { data } = await api('/v1/apps?limit=200&fields[apps]=name,bundleId,sku');
  return data;
}

async function listCpps(appId) {
  const { data } = await api(
    `/v1/apps/${appId}/appCustomProductPages?limit=200&include=appCustomProductPageVersions` +
    `&fields[appCustomProductPages]=name,visible,url,appCustomProductPageVersions`
  );
  return data;
}

// ---- write helpers (only called under --apply) --------------------------

async function createCpp(appId, name) {
  const { data } = await api('/v1/appCustomProductPages', {
    method: 'POST',
    body: {
      data: {
        type: 'appCustomProductPages',
        attributes: { name, visible: false },
        relationships: { app: { data: { type: 'apps', id: appId } } },
      },
    },
  });
  return data;
}

async function createVersion(cppId) {
  const { data } = await api('/v1/appCustomProductPageVersions', {
    method: 'POST',
    body: {
      data: {
        type: 'appCustomProductPageVersions',
        relationships: { appCustomProductPage: { data: { type: 'appCustomProductPages', id: cppId } } },
      },
    },
  });
  return data;
}

async function setLocalization(versionId, locale, promotionalText) {
  const { data } = await api('/v1/appCustomProductPageLocalizations', {
    method: 'POST',
    body: {
      data: {
        type: 'appCustomProductPageLocalizations',
        attributes: { locale, promotionalText },
        relationships: {
          appCustomProductPageVersion: { data: { type: 'appCustomProductPageVersions', id: versionId } },
        },
      },
    },
  });
  return data;
}

// ---- commands -----------------------------------------------------------

async function cmdAudit() {
  console.log('Verifying App Store Connect credentials (read-only)...\n');
  const apps = await listApps();
  console.log(`Authenticated. ${apps.length} app(s) visible:\n`);
  for (const a of apps) {
    console.log(`  • ${a.attributes.name}  (resource id: ${a.id}, bundle: ${a.attributes.bundleId})`);
  }
  const appId = process.env.ASC_APP_ID || (apps.length === 1 ? apps[0].id : null);
  if (!appId) {
    console.log('\nMultiple apps found — set ASC_APP_ID to the resource id above to list its CPPs.');
    return;
  }
  const cpps = await listCpps(appId);
  console.log(`\nCustom Product Pages for app ${appId}: ${cpps.length}`);
  for (const c of cpps) {
    const versions = c.relationships?.appCustomProductPageVersions?.data?.length ?? 0;
    console.log(`  • "${c.attributes.name}"  visible=${c.attributes.visible}  versions=${versions}  ${c.attributes.url || ''}`);
  }
}

async function cmdSync(configPath) {
  const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const appId = cfg.appId || process.env.ASC_APP_ID;
  if (!appId || /REPLACE/.test(appId)) throw new Error('Set "appId" in the config (run `audit` to find it).');
  const locale = cfg.defaultLocale || 'en-US';

  const existing = await listCpps(appId);
  const byName = new Map(existing.map((c) => [c.attributes.name.toLowerCase(), c]));

  console.log(`${APPLY ? 'APPLYING' : 'DRY RUN'} — ${cfg.pages.length} page(s) in config, ${existing.length} already exist.\n`);

  for (const page of cfg.pages) {
    if (page.promotionalText && page.promotionalText.length > 170) {
      console.log(`  ⚠ "${page.name}" promotionalText is ${page.promotionalText.length} chars (max 170) — skipping.`);
      continue;
    }
    const found = byName.get(page.name.toLowerCase());
    if (found) {
      console.log(`  = "${page.name}" exists (id ${found.id}). ${APPLY ? 'Would update promo text on a fresh version.' : 'Would update.'}`);
      // Updating an existing CPP's text means adding/editing a localization on its
      // current editable version. Left as a follow-up once we confirm version state
      // handling on the live account — safer to verify with `audit` first.
      continue;
    }
    if (!APPLY) {
      console.log(`  + "${page.name}" would be CREATED (shell + version + ${locale} promo text).`);
      continue;
    }
    const cpp = await createCpp(appId, page.name);
    const version = await createVersion(cpp.id);
    if (page.promotionalText) await setLocalization(version.id, locale, page.promotionalText);
    console.log(`  + Created "${page.name}" (id ${cpp.id}). NOTE: add screenshots in ASC before making it visible.`);
  }

  if (APPLY) {
    console.log('\nDone. New CPPs are created hidden (visible=false) and need screenshots before going live.');
  } else {
    console.log('\nDry run only. Re-run with --apply to write to App Store Connect.');
  }
}

// ---- entry --------------------------------------------------------------

const [cmd, arg] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
try {
  if (cmd === 'audit') await cmdAudit();
  else if (cmd === 'sync') await cmdSync(arg || 'scripts/asc/verticals.json');
  else {
    console.log('Commands: audit | sync <config.json> [--apply]\nSee header of this file for env setup.');
    process.exit(1);
  }
} catch (e) {
  console.error('\nError:', e.message);
  process.exit(1);
}
