#!/usr/bin/env node
// App Store Connect — In-App Events (draft only; this script never submits for review).
// Needs ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH, ASC_APP_ID (source scripts/asc/.env).
//
//   node scripts/asc/asc-events.mjs list
//   node scripts/asc/asc-events.mjs create <config.json> [--apply]
//   node scripts/asc/asc-events.mjs images <eventId> <card.png> <details.png> [--apply]
//       Uploads EVENT_CARD (1920x1080) + EVENT_DETAILS_PAGE (1080x1920) to EVERY localization of the event.
// Dry-run by default. Pattern: reserve -> PUT bytes -> PATCH uploaded=true (as asc-creative-assets.mjs).

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://api.appstoreconnect.apple.com';
const APPLY = process.argv.includes('--apply');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function need(n) { const v = process.env[n]; if (!v) { console.error(`Missing env var ${n} (source scripts/asc/.env)`); process.exit(1); } return v; }
const b64url = (i) => Buffer.from(i).toString('base64url');

function token() {
  const now = Math.floor(Date.now() / 1000);
  const input = `${b64url(JSON.stringify({ alg: 'ES256', kid: need('ASC_KEY_ID'), typ: 'JWT' }))}.${b64url(JSON.stringify({ iss: need('ASC_ISSUER_ID'), iat: now, exp: now + 900, aud: 'appstoreconnect-v1' }))}`;
  const sig = crypto.sign('sha256', Buffer.from(input), { key: fs.readFileSync(need('ASC_KEY_PATH'), 'utf8'), dsaEncoding: 'ieee-p1363' });
  return `${input}.${b64url(sig)}`;
}
async function api(p, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + p, { method, headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`ASC ${method} ${p} -> ${res.status}\n${JSON.stringify(json.errors || json, null, 2)}`);
  return json;
}
async function allTerritories() {
  const ids = []; let next = '/v1/territories?limit=200&fields[territories]=currency';
  while (next) { const j = await api(next.replace(BASE, '')); ids.push(...j.data.map((t) => t.id)); next = j.links?.next; }
  return ids;
}

async function list() {
  const j = await api(`/v1/apps/${need('ASC_APP_ID')}/appEvents?include=localizations&limit=50`);
  if (!j.data.length) console.log('No in-app events on this app.');
  const locs = new Map((j.included || []).map((l) => [l.id, l]));
  for (const e of j.data) {
    const a = e.attributes;
    console.log(`${e.id} ${a.eventState} "${a.referenceName}" badge=${a.badge} purpose=${a.purpose} deepLink=${a.deepLink || '-'}`);
    for (const s of a.territorySchedules || []) console.log(`  schedule ${s.eventStart} -> ${s.eventEnd} publish ${s.publishStart} (${(s.territories || []).length} territories)`);
    for (const r of e.relationships?.localizations?.data || []) { const l = locs.get(r.id)?.attributes; console.log(`  ${l?.locale} ${r.id} "${l?.name}"`); }
  }
}

async function create() {
  const cfgPath = process.argv[3];
  if (!cfgPath) { console.error('usage: create <config.json> [--apply]'); process.exit(1); }
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  const locs = { ...cfg.localizations };
  const src = locs[cfg.primaryLocale];
  for (const l of cfg.copyLocalizationsTo || []) locs[l] = { ...src };
  for (const [l, v] of Object.entries(locs)) {
    if (v.name.length > 30 || v.shortDescription.length > 50 || v.longDescription.length > 120) throw new Error(`${l}: copy exceeds Apple limits (30/50/120)`);
    console.log(`${l}: name ${v.name.length}/30, short ${v.shortDescription.length}/50, long ${v.longDescription.length}/120`);
  }
  const territories = cfg.territories === 'ALL' ? await allTerritories() : cfg.territories;
  const eventBody = { data: { type: 'appEvents', attributes: {
    referenceName: cfg.referenceName, badge: cfg.badge, purpose: cfg.purpose, priority: cfg.priority, primaryLocale: cfg.primaryLocale,
    ...(cfg.deepLink ? { deepLink: cfg.deepLink } : {}),
    territorySchedules: [{ territories, ...cfg.schedule }] },
    relationships: { app: { data: { type: 'apps', id: need('ASC_APP_ID') } } } } };
  const locBody = (eventId, locale, v) => ({ data: { type: 'appEventLocalizations', attributes: { locale, ...v },
    relationships: { appEvent: { data: { type: 'appEvents', id: eventId } } } } });
  if (!APPLY) {
    console.log(`DRY RUN (${territories.length} territories)`);
    console.log('POST /v1/appEvents', JSON.stringify({ ...eventBody, data: { ...eventBody.data, attributes: { ...eventBody.data.attributes, territorySchedules: [{ ...cfg.schedule, territories: `[${territories.length} codes]` }] } } }, null, 2));
    for (const [l, v] of Object.entries(locs)) console.log('POST /v1/appEventLocalizations', JSON.stringify(locBody('<eventId>', l, v)));
    console.log('Nothing written. Re-run with --apply. (Event is left in DRAFT; this script never submits.)');
    return;
  }
  const ev = (await api('/v1/appEvents', { method: 'POST', body: eventBody })).data;
  console.log(`event ${ev.id} state ${ev.attributes.eventState}`);
  for (const [l, v] of Object.entries(locs)) { const o = await api('/v1/appEventLocalizations', { method: 'POST', body: locBody(ev.id, l, v) }); console.log(`localization ${l} ${o.data.id}`); }
}

async function uploadShot(locId, type, file) {
  const buf = fs.readFileSync(file);
  const { data: s } = await api('/v1/appEventScreenshots', { method: 'POST', body: { data: { type: 'appEventScreenshots',
    attributes: { fileName: path.basename(file), fileSize: buf.length, appEventAssetType: type },
    relationships: { appEventLocalization: { data: { type: 'appEventLocalizations', id: locId } } } } } });
  for (const op of s.attributes.uploadOperations || []) {
    const headers = {}; for (const h of op.requestHeaders || []) headers[h.name] = h.value;
    const r = await fetch(op.url, { method: op.method, headers, body: buf.subarray(op.offset, op.offset + op.length) });
    if (!r.ok) throw new Error(`Upload PUT -> ${r.status}`);
  }
  await api(`/v1/appEventScreenshots/${s.id}`, { method: 'PATCH', body: { data: { type: 'appEventScreenshots', id: s.id, attributes: { uploaded: true } } } });
  let state;
  for (let i = 0; i < 30; i++) {
    const { data } = await api(`/v1/appEventScreenshots/${s.id}`);
    state = data.attributes.assetDeliveryState?.state; if (state === 'FAILED') throw new Error(JSON.stringify(data.attributes.assetDeliveryState));
    if (state === 'COMPLETE') break; await sleep(2000);
  }
  return { id: s.id, state };
}

async function images() {
  const [, , , eventId, card, details] = process.argv;
  if (!eventId || !card || !details) { console.error('usage: images <eventId> <card.png> <details.png> [--apply]'); process.exit(1); }
  const j = await api(`/v1/appEvents/${eventId}/localizations?limit=50`);
  const plan = [['EVENT_CARD', card], ['EVENT_DETAILS_PAGE', details]];
  for (const l of j.data) for (const [type, file] of plan) {
    if (!APPLY) { console.log(`DRY RUN ${l.attributes.locale} ${l.id}: ${type} <- ${file} (${fs.statSync(file).size} bytes)`); continue; }
    const r = await uploadShot(l.id, type, file); console.log(`${l.attributes.locale} ${type} ${r.id} ${r.state}`);
  }
  if (!APPLY) console.log('Nothing written. Re-run with --apply.');
}

const cmd = process.argv[2];
try {
  if (cmd === 'list') await list();
  else if (cmd === 'create') await create();
  else if (cmd === 'images') await images();
  else { console.error('usage: list | create <config.json> [--apply] | images <eventId> <card.png> <details.png> [--apply]'); process.exit(1); }
} catch (e) { console.error(e.message); process.exit(1); }
