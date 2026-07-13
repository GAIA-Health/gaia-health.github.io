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
//       prints what it WOULD do.
//
//   node scripts/asc/asc-cpp.mjs screenshots <CPP-NAME> <folder> [--apply] [--replace]
//       Uploads the PNGs in <folder> (named "1_foo.png", "2_bar.png", ... — the
//       leading number sets upload/display order) to the CPP's default-locale
//       (en-US) screenshot set, via the reserve -> upload-bytes -> commit ->
//       poll flow, then reorders to match the numeric prefixes. Without --apply
//       it's a DRY RUN that prints exactly what it would do. If the set already
//       has screenshots, it SKIPS (no duplicate upload) unless --replace is also
//       given, which deletes the existing screenshots first (only under --apply).
//       Display type is APP_IPHONE_67, confirmed by reading the live app-level
//       6.9"/6.7" en-US screenshot set (1290x2796 shots are tagged APP_IPHONE_67,
//       not e.g. APP_IPHONE_65) — don't assume, re-verify if Apple ever changes this.
//
// A CPP cannot go live without screenshots. `sync` builds the text/shell;
// `screenshots` handles the asset upload end-to-end (no more dragging into the ASC UI).

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function md5(buf) {
  return crypto.createHash('md5').update(buf).digest('hex');
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

async function findCppByName(appId, name) {
  const cpps = await listCpps(appId);
  return cpps.find((c) => c.attributes.name.toLowerCase() === name.toLowerCase());
}

// Versions for one CPP, with state so we can pick the editable one.
// NB: the attribute is just "state" (confirmed against the live API — NOT
// "appCustomProductPageVersionState", despite that being the more Apple-ish guess).
async function listCppVersions(cppId) {
  const { data } = await api(
    `/v1/appCustomProductPages/${cppId}/appCustomProductPageVersions?limit=50` +
    `&fields[appCustomProductPageVersions]=version,state`
  );
  return data;
}

async function listLocalizations(versionId) {
  const { data } = await api(
    `/v1/appCustomProductPageVersions/${versionId}/appCustomProductPageLocalizations?limit=50` +
    `&fields[appCustomProductPageLocalizations]=locale`
  );
  return data;
}

async function listScreenshotSets(localizationId) {
  const { data } = await api(
    `/v1/appCustomProductPageLocalizations/${localizationId}/appScreenshotSets?limit=50` +
    `&fields[appScreenshotSets]=screenshotDisplayType`
  );
  return data;
}

async function listScreenshots(setId) {
  const { data } = await api(
    `/v1/appScreenshotSets/${setId}/appScreenshots?limit=50` +
    `&fields[appScreenshots]=fileName,fileSize,assetDeliveryState,sourceFileChecksum`
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

async function createScreenshotSet(localizationId, displayType) {
  const { data } = await api('/v1/appScreenshotSets', {
    method: 'POST',
    body: {
      data: {
        type: 'appScreenshotSets',
        attributes: { screenshotDisplayType: displayType },
        relationships: {
          appCustomProductPageLocalization: {
            data: { type: 'appCustomProductPageLocalizations', id: localizationId },
          },
        },
      },
    },
  });
  return data;
}

async function deleteScreenshot(id) {
  await api(`/v1/appScreenshots/${id}`, { method: 'DELETE' });
}

// Reserve an upload slot for one file. Returns the appScreenshot resource,
// whose attributes.uploadOperations describes the byte-range PUT(s) to do.
async function reserveScreenshot(setId, fileName, fileSize) {
  const { data } = await api('/v1/appScreenshots', {
    method: 'POST',
    body: {
      data: {
        type: 'appScreenshots',
        attributes: { fileName, fileSize },
        relationships: { appScreenshotSet: { data: { type: 'appScreenshotSets', id: setId } } },
      },
    },
  });
  return data;
}

// Execute every uploadOperation against the raw file bytes at its offset/length.
async function uploadScreenshotBytes(uploadOperations, fileBuffer) {
  for (const op of uploadOperations) {
    const chunk = fileBuffer.subarray(op.offset, op.offset + op.length);
    const headers = {};
    for (const h of op.requestHeaders || []) headers[h.name] = h.value;
    const res = await fetch(op.url, { method: op.method, headers, body: chunk });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Upload PUT -> ${res.status} ${res.statusText}\n${text}`);
    }
  }
}

async function commitScreenshot(id, checksum) {
  const { data } = await api(`/v1/appScreenshots/${id}`, {
    method: 'PATCH',
    body: {
      data: {
        type: 'appScreenshots',
        id,
        attributes: { uploaded: true, sourceFileChecksum: checksum },
      },
    },
  });
  return data;
}

// Poll until the asset leaves the transitional upload/processing states.
// Returns the final assetDeliveryState; throws only on network error (a
// FAILED state is returned, not thrown, so the caller can report Apple's detail).
async function pollScreenshotState(id, { timeoutMs = 120_000, intervalMs = 3000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const { data } = await api(`/v1/appScreenshots/${id}?fields[appScreenshots]=assetDeliveryState`);
    const state = data.attributes.assetDeliveryState;
    const phase = state?.state;
    if (phase && phase !== 'AWAITING_UPLOAD' && phase !== 'UPLOAD_COMPLETE') return state;
    if (Date.now() > deadline) return state || { state: 'TIMEOUT' };
    await sleep(intervalMs);
  }
}

// Reorder a set's screenshots to match `orderedIds` (Apple orders by the
// position of each id in this relationship's data array).
async function reorderScreenshotSet(setId, orderedIds) {
  await api(`/v1/appScreenshotSets/${setId}/relationships/appScreenshots`, {
    method: 'PATCH',
    body: { data: orderedIds.map((id) => ({ type: 'appScreenshots', id })) },
  });
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

// Display type confirmed empirically against the live app-level en-US 6.9"/6.7"
// screenshot set (1290x2796 shots are tagged APP_IPHONE_67) — see header comment.
const IPHONE_67_DISPLAY_TYPE = 'APP_IPHONE_67';

function loadOrderedScreenshots(folder) {
  const files = fs.readdirSync(folder).filter((f) => /^\d+_.*\.png$/i.test(f));
  if (files.length === 0) {
    throw new Error(`No numbered PNGs (e.g. "1_foo.png") found in ${folder}`);
  }
  return files
    .map((f) => ({ file: f, order: parseInt(f.match(/^(\d+)_/)[1], 10), path: `${folder}/${f}` }))
    .sort((a, b) => a.order - b.order);
}

async function cmdScreenshots(cppName, folder) {
  if (!cppName || !folder) {
    throw new Error('Usage: screenshots <CPP-NAME> <folder> [--apply] [--replace]');
  }
  const REPLACE = process.argv.includes('--replace');
  const appId = need('ASC_APP_ID');
  const locale = 'en-US';

  const shots = loadOrderedScreenshots(folder);
  console.log(`${APPLY ? 'APPLYING' : 'DRY RUN'} — ${shots.length} screenshot(s) in ${folder}:`);
  for (const s of shots) console.log(`  ${s.order}. ${s.file}  (${fs.statSync(s.path).size} bytes)`);
  console.log();

  const cpp = await findCppByName(appId, cppName);
  if (!cpp) {
    throw new Error(
      `No CPP named "${cppName}" found for app ${appId}. Run \`sync --apply\` first, or \`audit\` to list existing CPPs.`
    );
  }
  console.log(`CPP "${cppName}" -> id ${cpp.id}`);

  const versions = await listCppVersions(cpp.id);
  if (versions.length === 0) {
    throw new Error(`CPP "${cppName}" has no versions — run \`sync --apply\` first to create one.`);
  }
  let version = versions[0];
  if (versions.length > 1) {
    console.log(`  ⚠ CPP has ${versions.length} versions:`);
    for (const v of versions) console.log(`      ${v.id}  state=${v.attributes.state}`);
    const notReplaced = versions.find((v) => v.attributes.state !== 'REPLACED');
    version = notReplaced || versions[versions.length - 1];
    console.log(`    Using ${version.id} (state=${version.attributes.state}).`);
  } else {
    console.log(`  Version ${version.id} (state=${version.attributes.state}).`);
  }

  // ---- localization: get or create --------------------------------------
  let localization = (await listLocalizations(version.id)).find((l) => l.attributes.locale === locale);
  if (localization) {
    console.log(`Localization ${locale} -> id ${localization.id} (exists).`);
  } else if (APPLY) {
    localization = await setLocalization(version.id, locale, undefined);
    console.log(`Localization ${locale} did not exist — created id ${localization.id}.`);
  } else {
    console.log(`Localization ${locale} does not exist yet — would CREATE it.`);
  }

  // ---- screenshot set: get or create -------------------------------------
  let set;
  if (localization) {
    set = (await listScreenshotSets(localization.id)).find(
      (s) => s.attributes.screenshotDisplayType === IPHONE_67_DISPLAY_TYPE
    );
    if (set) {
      console.log(`Screenshot set (${IPHONE_67_DISPLAY_TYPE}) -> id ${set.id} (exists).`);
    } else if (APPLY) {
      set = await createScreenshotSet(localization.id, IPHONE_67_DISPLAY_TYPE);
      console.log(`Screenshot set (${IPHONE_67_DISPLAY_TYPE}) did not exist — created id ${set.id}.`);
    } else {
      console.log(`Screenshot set (${IPHONE_67_DISPLAY_TYPE}) does not exist yet — would CREATE it.`);
    }
  }

  // ---- idempotency check --------------------------------------------------
  let existing = [];
  if (set) {
    existing = await listScreenshots(set.id);
    if (existing.length > 0) {
      console.log(`\nSet already has ${existing.length} screenshot(s):`);
      for (const e of existing) console.log(`  - ${e.attributes.fileName} (id ${e.id})`);
      if (!REPLACE) {
        console.log(
          `\nSKIPPING upload — set is non-empty and --replace was not given (no duplicate upload).` +
          `\nRe-run with --replace${APPLY ? '' : ' --apply'} to delete these and upload the new set.`
        );
        return;
      }
      console.log(
        `\n--replace given: ${APPLY ? 'will DELETE these first, then upload.' : 'would DELETE these first, then upload (dry run — nothing deleted).'}`
      );
    }
  }

  console.log(`\n${APPLY ? 'Uploading' : 'Would upload'} ${shots.length} screenshot(s) to ${locale} / ${IPHONE_67_DISPLAY_TYPE} in this order:`);
  for (const s of shots) console.log(`  ${s.order}. ${s.file}`);

  if (!APPLY) {
    console.log('\nDry run only. Re-run with --apply to upload.');
    return;
  }

  // ---- apply: delete-if-replace, then reserve -> upload -> commit -> poll --
  if (REPLACE && existing.length > 0) {
    for (const e of existing) {
      await deleteScreenshot(e.id);
      console.log(`  - Deleted existing ${e.attributes.fileName} (${e.id})`);
    }
  }

  const uploadedIds = [];
  for (const s of shots) {
    const buf = fs.readFileSync(s.path);
    const reserved = await reserveScreenshot(set.id, s.file, buf.length);
    console.log(`\n[${s.order}] ${s.file} — reserved (id ${reserved.id}), uploading ${buf.length} bytes...`);
    await uploadScreenshotBytes(reserved.attributes.uploadOperations || [], buf);
    const checksum = md5(buf);
    await commitScreenshot(reserved.id, checksum);
    console.log(`    committed (checksum ${checksum}), polling for processing...`);
    const state = await pollScreenshotState(reserved.id);
    if (state.state === 'FAILED') {
      const detail = (state.errors || []).map((e) => e.description || e.detail || JSON.stringify(e)).join('; ');
      console.log(`    ✗ FAILED: ${detail || 'no error detail from Apple'}`);
    } else {
      console.log(`    -> ${state.state}`);
    }
    uploadedIds.push(reserved.id);
  }

  console.log('\nReordering set to match filename order...');
  await reorderScreenshotSet(set.id, uploadedIds);
  console.log('\nDone. Verify in the ASC UI before making the CPP visible.');
}

// ---- entry --------------------------------------------------------------

const positional = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const [cmd, ...rest] = positional;
try {
  if (cmd === 'audit') await cmdAudit();
  else if (cmd === 'sync') await cmdSync(rest[0] || 'scripts/asc/verticals.json');
  else if (cmd === 'screenshots') await cmdScreenshots(rest[0], rest[1]);
  else {
    console.log(
      'Commands:\n' +
      '  audit\n' +
      '  sync <config.json> [--apply]\n' +
      '  screenshots <CPP-NAME> <folder> [--apply] [--replace]\n' +
      'See header of this file for env setup.'
    );
    process.exit(1);
  }
} catch (e) {
  console.error('\nError:', e.message);
  process.exit(1);
}
