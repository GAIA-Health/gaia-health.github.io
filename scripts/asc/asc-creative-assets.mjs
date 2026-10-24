#!/usr/bin/env node
// App Store Connect — Creative Assets (Asset Library) : product page header + search result image.
// Zero deps (Node 18+). Auth/JWT pattern copied from asc-cpp.mjs. Needs ASC_KEY_ID, ASC_ISSUER_ID,
// ASC_KEY_PATH, ASC_APP_ID (source scripts/asc/.env). API surface verified against OpenAPI 4.5.1
// (appAssetLibraries / appAssetLibraryImages / appAssetLibraryPlacements / appAssetLibraryRefData).
//
//   node scripts/asc/asc-creative-assets.mjs audit
//       GET-only. Lists ref-data specs, the app's asset library images (+placements),
//       and the editable version's localizations.
//   node scripts/asc/asc-creative-assets.mjs upload <header|search> <file> [--locale en-US] [--version <id>] [--apply]
//       header -> PRODUCT_PAGE_HEADER_ASSET, search -> APP_STORE_SEARCH_RESULTS_ASSET.
//       Flow: POST appAssetLibraryImages (category CREATIVE_ASSETS) -> PUT bytes -> PATCH uploaded:true
//       -> poll state -> POST appAssetLibraryPlacements linking image to the version localization.
//       Without --apply: prints the requests only (no network writes; only GETs to resolve ids).

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://api.appstoreconnect.apple.com';
const APPLY = process.argv.includes('--apply');
const DEFAULT_VERSION_ID = 'ce34d045-058b-4b1e-b459-bb2fa105d979'; // editable 1.87.98
const PLACEMENT = { header: 'PRODUCT_PAGE_HEADER_ASSET', search: 'APP_STORE_SEARCH_RESULTS_ASSET' };

function need(n) { const v = process.env[n]; if (!v) { console.error(`Missing env var ${n} (source scripts/asc/.env)`); process.exit(1); } return v; }
const b64url = (i) => Buffer.from(i).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function flag(name, def) { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : def; }

function token() {
  const now = Math.floor(Date.now() / 1000);
  const h = { alg: 'ES256', kid: need('ASC_KEY_ID'), typ: 'JWT' };
  const p = { iss: need('ASC_ISSUER_ID'), iat: now, exp: now + 900, aud: 'appstoreconnect-v1' };
  const input = `${b64url(JSON.stringify(h))}.${b64url(JSON.stringify(p))}`;
  const sig = crypto.sign('sha256', Buffer.from(input), { key: fs.readFileSync(need('ASC_KEY_PATH'), 'utf8'), dsaEncoding: 'ieee-p1363' });
  return `${input}.${b64url(sig)}`;
}

async function api(p, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + p, {
    method, headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`ASC ${method} ${p} -> ${res.status}\n${JSON.stringify(json.errors || json, null, 2)}`);
  return json;
}

async function getLibrary(appId) {
  const { data } = await api(`/v1/apps/${appId}/assetLibrary`);
  return data;
}

async function audit() {
  const appId = need('ASC_APP_ID');
  const versionId = flag('--version', DEFAULT_VERSION_ID);
  console.log(`App ${appId}, version ${versionId}`);

  const ref = await api(`/v1/appAssetLibraryRefData?filter[placementTypes]=${Object.values(PLACEMENT).join(',')}&fields[appAssetLibraryRefData]=imageSpecs,placementTypes`);
  for (const r of ref.data || []) {
    for (const s of r.attributes?.imageSpecs || []) {
      console.log(`  spec ${s.specId} "${s.shortName}" ${JSON.stringify(s.dimensions)} ratio=${s.aspectRatio} alpha=${s.alphaAllowed} ext=${(s.fileExtensions || []).join('/')} max=${s.maxFileSize} placements=${(s.compatiblePlacementTypes || []).join(',')}`);
    }
  }

  const lib = await getLibrary(appId);
  console.log(`Asset library: ${lib.id}`);
  const imgs = await api(`/v1/appAssetLibraries/${lib.id}/images?limit=200&include=placements&limit[placements]=50`);
  const all = imgs.data || [];
  const creative = all.filter((i) => i.attributes.category === 'CREATIVE_ASSETS');
  console.log(`Library images: ${all.length} total (${all.length - creative.length} screenshots/previews, not listed); CREATIVE_ASSETS: ${creative.length}`);
  const byId = new Map((imgs.included || []).filter((x) => x.type === 'appAssetLibraryPlacements').map((x) => [x.id, x]));
  for (const i of creative) {
    const a = i.attributes;
    console.log(`  ${i.id} ${a.state} ${a.fileName} ${a.imageAsset?.width}x${a.imageAsset?.height} spec=${a.specId}`);
    for (const r of i.relationships?.placements?.data || []) { const pl = byId.get(r.id); console.log(`    placement ${r.id} ${pl?.attributes.placementType} ${pl?.attributes.state}`); }
  }

  const locs = await api(`/v1/appStoreVersions/${versionId}/appStoreVersionLocalizations?limit=50&fields[appStoreVersionLocalizations]=locale`);
  console.log(`Version localizations: ${(locs.data || []).map((l) => `${l.attributes.locale}=${l.id}`).join(', ')}`);
}

async function upload() {
  const [, , , kind, file] = process.argv;
  if (!PLACEMENT[kind] || !file) { console.error('usage: upload <header|search> <file> [--locale en-US] [--version id] [--apply]'); process.exit(1); }
  const locale = flag('--locale', 'en-US');
  const versionId = flag('--version', DEFAULT_VERSION_ID);
  const buf = fs.readFileSync(file);
  const fileName = path.basename(file);
  const placementType = PLACEMENT[kind];

  // Reads (safe in dry-run): resolve library + version localization ids.
  const lib = await getLibrary(need('ASC_APP_ID'));
  const locs = await api(`/v1/appStoreVersions/${versionId}/appStoreVersionLocalizations?limit=50&fields[appStoreVersionLocalizations]=locale`);
  const loc = (locs.data || []).find((l) => l.attributes.locale === locale);
  if (!loc) { console.error(`No ${locale} localization on version ${versionId}`); process.exit(1); }

  const reqCreate = { method: 'POST', path: '/v1/appAssetLibraryImages', body: { data: { type: 'appAssetLibraryImages',
    attributes: { category: 'CREATIVE_ASSETS', fileName, fileSize: buf.length, referenceName: fileName },
    relationships: { assetLibrary: { data: { type: 'appAssetLibraries', id: lib.id } } } } } };
  const reqCommit = (id) => ({ method: 'PATCH', path: `/v1/appAssetLibraryImages/${id}`, body: { data: { type: 'appAssetLibraryImages', id, attributes: { uploaded: true } } } });
  const reqPlace = (id) => ({ method: 'POST', path: '/v1/appAssetLibraryPlacements', body: { data: { type: 'appAssetLibraryPlacements',
    attributes: { placementType },
    relationships: { image: { data: { type: 'appAssetLibraryImages', id } }, appStoreVersionLocalization: { data: { type: 'appStoreVersionLocalizations', id: loc.id } } } } } });

  if (!APPLY) {
    console.log(`DRY RUN — ${kind} (${placementType}) ${fileName} ${buf.length} bytes -> version ${versionId} locale ${locale} (loc ${loc.id}), library ${lib.id}`);
    console.log('1.', JSON.stringify(reqCreate, null, 2));
    console.log('2. PUT each uploadOperations[] item from the response (url/method/requestHeaders, bytes offset..offset+length)');
    console.log('3.', JSON.stringify(reqCommit('<imageId>'), null, 2));
    console.log('4. poll GET /v1/appAssetLibraryImages/<imageId> until state != AWAITING_UPLOAD/UPLOAD_COMPLETE (fail on FAILED)');
    console.log('5.', JSON.stringify(reqPlace('<imageId>'), null, 2));
    console.log('Nothing written. Re-run with --apply to execute.');
    return;
  }

  const { data: img } = await api(reqCreate.path, { method: 'POST', body: reqCreate.body });
  console.log(`reserved ${img.id}`);
  for (const op of img.attributes.uploadOperations || []) {
    const headers = {}; for (const h of op.requestHeaders || []) headers[h.name] = h.value;
    const r = await fetch(op.url, { method: op.method, headers, body: buf.subarray(op.offset, op.offset + op.length) });
    if (!r.ok) throw new Error(`Upload PUT -> ${r.status} ${await r.text().catch(() => '')}`);
  }
  const c = reqCommit(img.id); await api(c.path, { method: 'PATCH', body: c.body });
  let state;
  for (let i = 0; i < 40; i++) {
    const { data } = await api(`/v1/appAssetLibraryImages/${img.id}?fields[appAssetLibraryImages]=state,stateDetails`);
    state = data.attributes.state; console.log(`state ${state}`);
    if (state === 'FAILED') throw new Error(JSON.stringify(data.attributes.stateDetails));
    if (!['AWAITING_UPLOAD', 'UPLOAD_COMPLETE'].includes(state)) break;
    await sleep(3000);
  }
  const pl = reqPlace(img.id); const out = await api(pl.path, { method: 'POST', body: pl.body });
  console.log(`placement ${out.data.id} created (${placementType})`);
}

// place: attach an ALREADY-uploaded library image to another locale of the version (no re-upload).
async function place() {
  const [, , , kind, imageId] = process.argv;
  if (!PLACEMENT[kind] || !imageId) { console.error('usage: place <header|search> <imageId> [--locale en-GB] [--version id] [--apply]'); process.exit(1); }
  const locale = flag('--locale', 'en-GB');
  const versionId = flag('--version', DEFAULT_VERSION_ID);
  const placementType = PLACEMENT[kind];
  const locs = await api(`/v1/appStoreVersions/${versionId}/appStoreVersionLocalizations?limit=50&fields[appStoreVersionLocalizations]=locale`);
  const loc = (locs.data || []).find((l) => l.attributes.locale === locale);
  if (!loc) { console.error(`No ${locale} localization on version ${versionId}`); process.exit(1); }
  const body = { data: { type: 'appAssetLibraryPlacements', attributes: { placementType },
    relationships: { image: { data: { type: 'appAssetLibraryImages', id: imageId } }, appStoreVersionLocalization: { data: { type: 'appStoreVersionLocalizations', id: loc.id } } } } };
  if (!APPLY) { console.log(`DRY RUN — place ${placementType} image ${imageId} -> ${locale} (loc ${loc.id})`); console.log(JSON.stringify(body, null, 2)); return; }
  const out = await api('/v1/appAssetLibraryPlacements', { method: 'POST', body });
  console.log(`placement ${out.data.id} created (${placementType}) for ${locale}`);
}

const cmd = process.argv[2];
try {
  if (cmd === 'audit') await audit();
  else if (cmd === 'upload') await upload();
  else if (cmd === 'place') await place();
  else { console.error('usage: audit | upload <header|search> <file> [--locale en-US] [--apply] | place <header|search> <imageId> [--locale en-GB] [--apply]'); process.exit(1); }
} catch (e) { console.error(e.message); process.exit(1); }
