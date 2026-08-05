#!/usr/bin/env node
// App Store Connect — main-listing (non-CPP) screenshot automation for a
// specific pending appStoreVersion's localizations.
//
// Same mechanics as scripts/asc/asc-cpp.mjs's `screenshots` command (reserve
// -> upload-bytes -> commit -> poll, via the shared appScreenshots /
// appScreenshotSets resources), but the parent is an
// appStoreVersionLocalization instead of an appCustomProductPageLocalization.
// See asc-cpp.mjs's header for the JWT/env-var setup — identical here.
//
// SAFETY: this script only ever touches appScreenshotSets/appScreenshots
// under a localization id YOU pass explicitly. It never looks up "the live
// version" and never calls any submit/review endpoint. Always pass the
// PENDING version's localization id, confirmed via `locales`.
//
// Commands:
//   node scripts/asc/asc-version-screenshots.mjs locales <versionId>
//       Read-only. Lists every appStoreVersionLocalization on this version
//       (locale + id), and whether each already has its own APP_IPHONE_67
//       screenshot set (and how many screenshots in it).
//
//   node scripts/asc/asc-version-screenshots.mjs screenshots <localizationId> <folder> [--apply] [--replace]
//       Uploads the PNGs in <folder> (named "01-foo.png", "02-bar.png", ... —
//       the leading number sets upload/display order) to that localization's
//       APP_IPHONE_67 screenshot set (creating the set if it doesn't exist).
//       Without --apply it's a DRY RUN. If the set already has screenshots,
//       it SKIPS unless --replace is also given (deletes existing first,
//       only under --apply).

import crypto from 'node:crypto';
import fs from 'node:fs';

const BASE = 'https://api.appstoreconnect.apple.com';
const APPLY = process.argv.includes('--apply');
const REPLACE = process.argv.includes('--replace');

function need(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name}. See scripts/asc/asc-cpp.mjs header for setup.`);
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

function token() {
  const keyId = need('ASC_KEY_ID');
  const issuer = need('ASC_ISSUER_ID');
  const pem = fs.readFileSync(need('ASC_KEY_PATH'), 'utf8');
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'ES256', kid: keyId, typ: 'JWT' };
  const payload = { iss: issuer, iat: now, exp: now + 60 * 15, aud: 'appstoreconnect-v1' };
  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
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

const IPHONE_67_DISPLAY_TYPE = 'APP_IPHONE_67';

// ---- read helpers -------------------------------------------------------

async function listVersionLocalizations(versionId) {
  const { data } = await api(
    `/v1/appStoreVersions/${versionId}/appStoreVersionLocalizations?limit=200` +
    `&fields[appStoreVersionLocalizations]=locale`
  );
  return data;
}

async function listScreenshotSets(localizationId) {
  const { data } = await api(
    `/v1/appStoreVersionLocalizations/${localizationId}/appScreenshotSets?limit=50` +
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

async function createScreenshotSet(localizationId, displayType) {
  const { data } = await api('/v1/appScreenshotSets', {
    method: 'POST',
    body: {
      data: {
        type: 'appScreenshotSets',
        attributes: { screenshotDisplayType: displayType },
        relationships: {
          appStoreVersionLocalization: {
            data: { type: 'appStoreVersionLocalizations', id: localizationId },
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

async function reorderScreenshotSet(setId, orderedIds) {
  await api(`/v1/appScreenshotSets/${setId}/relationships/appScreenshots`, {
    method: 'PATCH',
    body: { data: orderedIds.map((id) => ({ type: 'appScreenshots', id })) },
  });
}

function loadOrderedScreenshots(folder) {
  const files = fs.readdirSync(folder).filter((f) => /^\d+[-_].*\.png$/i.test(f));
  if (files.length === 0) {
    throw new Error(`No numbered PNGs (e.g. "01-foo.png") found in ${folder}`);
  }
  return files
    .map((f) => ({ file: f, order: parseInt(f.match(/^(\d+)[-_]/)[1], 10), path: `${folder}/${f}` }))
    .sort((a, b) => a.order - b.order);
}

// ---- commands -------------------------------------------------------------

async function cmdLocales(versionId) {
  if (!versionId) throw new Error('Usage: locales <versionId>');
  const locs = await listVersionLocalizations(versionId);
  console.log(`${locs.length} localization(s) on version ${versionId}:\n`);
  for (const l of locs) {
    const locale = l.attributes.locale;
    let sets = [];
    try {
      sets = await listScreenshotSets(l.id);
    } catch (e) {
      console.log(`  • ${locale}  (id ${l.id})  -- error listing sets: ${e.message}`);
      continue;
    }
    const set67 = sets.find((s) => s.attributes.screenshotDisplayType === IPHONE_67_DISPLAY_TYPE);
    if (!set67) {
      console.log(`  • ${locale}  (id ${l.id})  -- no ${IPHONE_67_DISPLAY_TYPE} set`);
      continue;
    }
    const shots = await listScreenshots(set67.id);
    console.log(`  • ${locale}  (id ${l.id})  -- ${IPHONE_67_DISPLAY_TYPE} set ${set67.id}: ${shots.length} screenshot(s)`);
  }
}

async function cmdScreenshots(localizationId, folder) {
  if (!localizationId || !folder) {
    throw new Error('Usage: screenshots <localizationId> <folder> [--apply] [--replace]');
  }
  const shots = loadOrderedScreenshots(folder);
  console.log(`${APPLY ? 'APPLYING' : 'DRY RUN'} — ${shots.length} screenshot(s) in ${folder}:`);
  for (const s of shots) console.log(`  ${s.order}. ${s.file}  (${fs.statSync(s.path).size} bytes)`);
  console.log();

  let set = (await listScreenshotSets(localizationId)).find(
    (s) => s.attributes.screenshotDisplayType === IPHONE_67_DISPLAY_TYPE
  );
  if (set) {
    console.log(`Screenshot set (${IPHONE_67_DISPLAY_TYPE}) -> id ${set.id} (exists).`);
  } else if (APPLY) {
    set = await createScreenshotSet(localizationId, IPHONE_67_DISPLAY_TYPE);
    console.log(`Screenshot set (${IPHONE_67_DISPLAY_TYPE}) did not exist — created id ${set.id}.`);
  } else {
    console.log(`Screenshot set (${IPHONE_67_DISPLAY_TYPE}) does not exist yet — would CREATE it.`);
  }

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

  console.log(`\n${APPLY ? 'Uploading' : 'Would upload'} ${shots.length} screenshot(s) to localization ${localizationId} / ${IPHONE_67_DISPLAY_TYPE} in this order:`);
  for (const s of shots) console.log(`  ${s.order}. ${s.file}`);

  if (!APPLY) {
    console.log('\nDry run only. Re-run with --apply to upload.');
    return;
  }

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
  console.log('\nDone. Verify in the ASC UI.');
}

// ---- entry --------------------------------------------------------------

const positional = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const [cmd, ...rest] = positional;
try {
  if (cmd === 'locales') await cmdLocales(rest[0]);
  else if (cmd === 'screenshots') await cmdScreenshots(rest[0], rest[1]);
  else {
    console.log(
      'Commands:\n' +
      '  locales <versionId>\n' +
      '  screenshots <localizationId> <folder> [--apply] [--replace]\n' +
      'See header of this file for env setup.'
    );
    process.exit(1);
  }
} catch (e) {
  console.error('\nError:', e.message);
  process.exit(1);
}
