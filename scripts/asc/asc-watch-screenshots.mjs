#!/usr/bin/env node
// App Store Connect — Apple Watch screenshot upload for a specific pending
// appStoreVersion's localizations. Sibling of asc-version-screenshots.mjs,
// parameterized for the watch screenshotDisplayType (default APP_WATCH_ULTRA,
// for 410x502 native captures) and taking an EXPLICIT ordered file list
// instead of relying on a "NN-name.png" filename convention.
//
// SAFETY: only ever touches appScreenshotSets/appScreenshots under a
// localization id YOU pass explicitly. Never looks up "the live version",
// never touches any other screenshotDisplayType's set, never submits.
//
// Commands:
//   node scripts/asc/asc-watch-screenshots.mjs locales <versionId>
//       Read-only. Lists every appStoreVersionLocalization on this version
//       (locale + id), and whether each already has a watch screenshot set.
//
//   node scripts/asc/asc-watch-screenshots.mjs screenshots <localizationId> <file1> <file2> ... [--apply] [--replace] [--display-type=APP_WATCH_ULTRA]
//       Uploads the given PNG files (absolute or relative paths), IN THE
//       ORDER GIVEN, to that localization's watch screenshot set (creating
//       the set if it doesn't exist). Without --apply it's a DRY RUN. If the
//       set already has screenshots, it SKIPS unless --replace is also given.
//
//   node scripts/asc/asc-watch-screenshots.mjs verify <localizationId> [--display-type=APP_WATCH_ULTRA]
//       Read-only. Lists screenshots currently in the localization's watch
//       set, in order, with fileName + assetDeliveryState.

import crypto from 'node:crypto';
import fs from 'node:fs';

const BASE = 'https://api.appstoreconnect.apple.com';
const APPLY = process.argv.includes('--apply');
const REPLACE = process.argv.includes('--replace');
const DISPLAY_TYPE_ARG = process.argv.find((a) => a.startsWith('--display-type='));
const DISPLAY_TYPE = DISPLAY_TYPE_ARG ? DISPLAY_TYPE_ARG.split('=')[1] : 'APP_WATCH_ULTRA';

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
    const setW = sets.find((s) => s.attributes.screenshotDisplayType === DISPLAY_TYPE);
    if (!setW) {
      console.log(`  • ${locale}  (id ${l.id})  -- no ${DISPLAY_TYPE} set  [all sets: ${sets.map(s=>s.attributes.screenshotDisplayType).join(', ') || 'none'}]`);
      continue;
    }
    const shots = await listScreenshots(setW.id);
    console.log(`  • ${locale}  (id ${l.id})  -- ${DISPLAY_TYPE} set ${setW.id}: ${shots.length} screenshot(s)`);
  }
}

async function cmdVerify(localizationId) {
  if (!localizationId) throw new Error('Usage: verify <localizationId>');
  const sets = await listScreenshotSets(localizationId);
  const setW = sets.find((s) => s.attributes.screenshotDisplayType === DISPLAY_TYPE);
  if (!setW) {
    console.log(`No ${DISPLAY_TYPE} set on localization ${localizationId}.`);
    return;
  }
  const shots = await listScreenshots(setW.id);
  console.log(`${DISPLAY_TYPE} set ${setW.id} on localization ${localizationId}: ${shots.length} screenshot(s)`);
  shots.forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.attributes.fileName}  (id ${s.id})  state=${s.attributes.assetDeliveryState?.state}`);
  });
}

async function cmdScreenshots(localizationId, files) {
  if (!localizationId || files.length === 0) {
    throw new Error('Usage: screenshots <localizationId> <file1> <file2> ... [--apply] [--replace]');
  }
  const shots = files.map((path, i) => ({ order: i + 1, path, file: path.split('/').pop() }));
  console.log(`${APPLY ? 'APPLYING' : 'DRY RUN'} — display type ${DISPLAY_TYPE} — ${shots.length} screenshot(s):`);
  for (const s of shots) console.log(`  ${s.order}. ${s.file}  (${fs.statSync(s.path).size} bytes)`);
  console.log();

  let set = (await listScreenshotSets(localizationId)).find(
    (s) => s.attributes.screenshotDisplayType === DISPLAY_TYPE
  );
  if (set) {
    console.log(`Screenshot set (${DISPLAY_TYPE}) -> id ${set.id} (exists).`);
  } else if (APPLY) {
    set = await createScreenshotSet(localizationId, DISPLAY_TYPE);
    console.log(`Screenshot set (${DISPLAY_TYPE}) did not exist — created id ${set.id}.`);
  } else {
    console.log(`Screenshot set (${DISPLAY_TYPE}) does not exist yet — would CREATE it.`);
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

  console.log(`\n${APPLY ? 'Uploading' : 'Would upload'} ${shots.length} screenshot(s) to localization ${localizationId} / ${DISPLAY_TYPE} in this order:`);
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

  console.log('\nReordering set to match given order...');
  await reorderScreenshotSet(set.id, uploadedIds);
  console.log('\nDone. Verify with the `verify` command.');
}

// ---- entry --------------------------------------------------------------

const positional = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const [cmd, ...rest] = positional;
try {
  if (cmd === 'locales') await cmdLocales(rest[0]);
  else if (cmd === 'verify') await cmdVerify(rest[0]);
  else if (cmd === 'screenshots') await cmdScreenshots(rest[0], rest.slice(1));
  else {
    console.log(
      'Commands:\n' +
      '  locales <versionId>\n' +
      '  verify <localizationId>\n' +
      '  screenshots <localizationId> <file1> <file2> ... [--apply] [--replace] [--display-type=APP_WATCH_ULTRA]\n' +
      'See header of this file for env setup.'
    );
    process.exit(1);
  }
} catch (e) {
  console.error('\nError:', e.message);
  process.exit(1);
}
