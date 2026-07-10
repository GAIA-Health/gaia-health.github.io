#!/usr/bin/env node
// App Store Connect — INDEXED METADATA stager for the next (editable) version.
// Applies subtitle (appInfoLocalizations) + keywords/description (appStoreVersionLocalizations)
// from a JSON config, creating missing locale localizations as needed.
// NOTHING goes live until the version is submitted + released — this only stages.
//
// Usage:
//   node scripts/asc/asc-metadata.mjs audit                       # editable version + appInfo state per locale
//   node scripts/asc/asc-metadata.mjs apply metadata-jun16.json   # dry run (shows every change)
//   node scripts/asc/asc-metadata.mjs apply metadata-jun16.json --apply
//
// Config shape (paths relative to scripts/asc/):
//   { "descriptionFile": "metadata/description-en-US.txt",
//     "descriptionLocales": ["en-US", ...],          // locales that get the description
//     "subtitle": { "en-US": "..." },                 // ≤30 chars each
//     "keywords": { "en-US": "..." } }                // ≤100 chars each; missing locales are created
//
// Env (scripts/asc/.env): ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH, ASC_APP_ID.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = 'https://api.appstoreconnect.apple.com';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const EDITABLE = ['PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED', 'REJECTED', 'METADATA_REJECTED', 'INVALID_BINARY'];

function need(name) {
  const v = process.env[name];
  if (!v) { console.error(`Missing env var: ${name}.`); process.exit(1); }
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
async function api(method, p, body) {
  const r = await fetch(BASE + p, {
    method,
    headers: { Authorization: `Bearer ${token()}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`${method} ${p} -> ${r.status}: ${t.slice(0, 400)}`);
  return t ? JSON.parse(t) : null;
}

async function editableVersion() {
  const appId = need('ASC_APP_ID');
  const vers = (await api('GET', `/v1/apps/${appId}/appStoreVersions?filter[platform]=IOS&limit=10`)).data;
  const v = vers.find((x) => EDITABLE.includes(x.attributes.appStoreState || x.attributes.appVersionState));
  if (!v) throw new Error(`No editable version found. States: ${vers.map((x) => `${x.attributes.versionString}=${x.attributes.appStoreState || x.attributes.appVersionState}`).join(', ')}`);
  return v;
}
async function editableAppInfo() {
  const appId = need('ASC_APP_ID');
  const infos = (await api('GET', `/v1/apps/${appId}/appInfos?limit=5`)).data;
  const i = infos.find((x) => EDITABLE.includes(x.attributes.appStoreState || x.attributes.state));
  if (!i) throw new Error('No editable appInfo found (subtitle/name not stageable yet).');
  return i;
}
const versionLocs = async (vId) => (await api('GET', `/v1/appStoreVersions/${vId}/appStoreVersionLocalizations?limit=50`)).data;
const infoLocs = async (iId) => (await api('GET', `/v1/appInfos/${iId}/appInfoLocalizations?limit=50`)).data;

async function cmdAudit() {
  const v = await editableVersion();
  console.log(`Editable version: ${v.attributes.versionString} (state ${v.attributes.appStoreState || v.attributes.appVersionState})\n`);
  const vls = await versionLocs(v.id);
  let ils = [];
  try { ils = await infoLocs((await editableAppInfo()).id); } catch (e) { console.log(`(appInfo: ${e.message})`); }
  const locales = [...new Set([...vls.map((l) => l.attributes.locale), ...ils.map((l) => l.attributes.locale)])].sort();
  for (const loc of locales) {
    const vl = vls.find((l) => l.attributes.locale === loc)?.attributes || {};
    const il = ils.find((l) => l.attributes.locale === loc)?.attributes || {};
    console.log(`[${loc}]`);
    console.log(`  name:     ${il.name || '(n/a)'}`);
    console.log(`  subtitle: ${il.subtitle || '(none)'} (${(il.subtitle || '').length}/30)`);
    console.log(`  keywords: ${vl.keywords || '(none)'} (${(vl.keywords || '').length}/100)`);
    console.log(`  desc:     ${(vl.description || '').length}/4000 chars · promo: ${(vl.promotionalText || '').length}/170\n`);
  }
}

async function cmdApply(configFile, apply) {
  const cfg = JSON.parse(fs.readFileSync(path.resolve(HERE, configFile), 'utf8'));
  const description = cfg.descriptionFile
    ? fs.readFileSync(path.resolve(HERE, cfg.descriptionFile), 'utf8').replace(/\n$/, '')
    : null;
  if (description && description.length > 4000) throw new Error(`Description ${description.length} > 4000`);
  if (cfg.promotionalText && cfg.promotionalText.length > 170) throw new Error(`Promo ${cfg.promotionalText.length} > 170`);
  for (const [loc, s] of Object.entries(cfg.subtitle || {})) if (s.length > 30) throw new Error(`Subtitle ${loc} ${s.length} > 30`);
  for (const [loc, k] of Object.entries(cfg.keywords || {})) if (k.length > 100) throw new Error(`Keywords ${loc} ${k.length} > 100`);

  const v = await editableVersion();
  const info = await editableAppInfo();
  const vls = await versionLocs(v.id);
  const ils = await infoLocs(info.id);
  const enUSvl = vls.find((l) => l.attributes.locale === 'en-US')?.attributes || {};
  const enUSil = ils.find((l) => l.attributes.locale === 'en-US')?.attributes || {};
  console.log(`Editable version ${v.attributes.versionString}${apply ? '' : ' [DRY RUN]'}\n`);
  if (description) console.log(`Description: ${description.length}/4000 chars → locales: ${(cfg.descriptionLocales || []).join(', ')}\n`);

  const targetLocales = [...new Set([...Object.keys(cfg.keywords || {}), ...Object.keys(cfg.subtitle || {}), ...(cfg.descriptionLocales || []), ...(cfg.promoLocales || [])])];
  for (const loc of targetLocales) {
    const wantDesc = description && (cfg.descriptionLocales || []).includes(loc);
    const wantPromo = cfg.promotionalText && (cfg.promoLocales || []).includes(loc);
    const kw = cfg.keywords?.[loc];
    const sub = cfg.subtitle?.[loc];

    // --- version localization (keywords + description + promo) ---
    let vl = vls.find((l) => l.attributes.locale === loc);
    if (kw || wantDesc || wantPromo) {
      const attrs = {};
      if (kw && kw !== vl?.attributes.keywords) attrs.keywords = kw;
      if (wantDesc && description !== vl?.attributes.description) attrs.description = description;
      if (wantPromo && cfg.promotionalText !== vl?.attributes.promotionalText) attrs.promotionalText = cfg.promotionalText;
      if (!vl) {
        // new locale: copy en-US conversion fields so the localization is submission-complete
        Object.assign(attrs, {
          description: wantDesc ? description : enUSvl.description,
          promotionalText: wantPromo ? cfg.promotionalText : enUSvl.promotionalText,
          supportUrl: enUSvl.supportUrl, marketingUrl: enUSvl.marketingUrl,
        });
        console.log(`[${loc}] CREATE version localization (keywords ${kw ? kw.length : 0}/100, desc ${(attrs.description || '').length}/4000)`);
        if (apply) await api('POST', '/v1/appStoreVersionLocalizations', {
          data: { type: 'appStoreVersionLocalizations', attributes: { locale: loc, ...attrs },
            relationships: { appStoreVersion: { data: { type: 'appStoreVersions', id: v.id } } } },
        });
      } else if (Object.keys(attrs).length) {
        console.log(`[${loc}] UPDATE version localization: ${Object.keys(attrs).join(' + ')}${attrs.keywords ? `\n    keywords: ${attrs.keywords}` : ''}`);
        if (apply) await api('PATCH', `/v1/appStoreVersionLocalizations/${vl.id}`, {
          data: { type: 'appStoreVersionLocalizations', id: vl.id, attributes: attrs },
        });
      } else console.log(`[${loc}] version localization unchanged`);
    }

    // --- app info localization (subtitle; name copied for new locales) ---
    // NOTE: creating an appStoreVersionLocalization makes ASC auto-create the matching
    // appInfoLocalization, so a POST here can 409 — fall back to PATCHing the auto-created one.
    if (sub) {
      const il = ils.find((l) => l.attributes.locale === loc);
      if (!il) {
        console.log(`[${loc}] CREATE app info localization (name "${enUSil.name}", subtitle "${sub}")`);
        if (apply) {
          try {
            await api('POST', '/v1/appInfoLocalizations', {
              data: { type: 'appInfoLocalizations',
                attributes: { locale: loc, name: enUSil.name, subtitle: sub, privacyPolicyUrl: enUSil.privacyPolicyUrl },
                relationships: { appInfo: { data: { type: 'appInfos', id: info.id } } } },
            });
          } catch (e) {
            if (!/DUPLICATE/.test(e.message)) throw e;
            const fresh = await infoLocs(info.id);
            const auto = fresh.find((l) => l.attributes.locale === loc);
            if (!auto) throw e;
            const attrs = { subtitle: sub };
            if (!auto.attributes.name) attrs.name = enUSil.name;
            await api('PATCH', `/v1/appInfoLocalizations/${auto.id}`, {
              data: { type: 'appInfoLocalizations', id: auto.id, attributes: attrs },
            });
            console.log(`[${loc}]   (auto-created by ASC — PATCHed it instead)`);
          }
        }
      } else if (il.attributes.subtitle !== sub) {
        console.log(`[${loc}] UPDATE subtitle: "${il.attributes.subtitle}" → "${sub}"`);
        if (apply) await api('PATCH', `/v1/appInfoLocalizations/${il.id}`, {
          data: { type: 'appInfoLocalizations', id: il.id, attributes: { subtitle: sub } },
        });
      } else console.log(`[${loc}] subtitle unchanged`);
    }
  }
  console.log(apply ? '\nStaged ✓ — review in App Store Connect; goes live only when the version is submitted + released.' : '\nDry run only. Re-run with --apply to stage.');
}

const argv = process.argv.slice(2);
const apply = argv.includes('--apply');
const [cmd, a] = argv.filter((x) => x !== '--apply');
try {
  if (cmd === 'audit') await cmdAudit();
  else if (cmd === 'apply' && a) await cmdApply(a, apply);
  else { console.log('Usage:\n  node scripts/asc/asc-metadata.mjs audit\n  node scripts/asc/asc-metadata.mjs apply <config.json> [--apply]'); process.exit(1); }
} catch (e) {
  console.error('\nError:', e.message);
  process.exit(1);
}
