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
//     "name": { "en-US": "..." },                     // app name (appInfoLocalizations), ≤30 chars each
//     "descriptions": { "en-US": "..." },             // per-locale description (≤4000), alongside/instead of descriptionFile
//     "subtitle": { "en-US": "..." },                 // ≤30 chars each
//     "whatsNew": { "en-US": "..." },                 // per-locale release notes (≤4000)
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
  const problems = [];
  for (const [loc, n] of Object.entries(cfg.name || {})) if (!n || n.length > 30) problems.push(`Name ${loc} ${n ? n.length : 0} (must be 1-30)`);
  for (const [loc, d] of Object.entries(cfg.descriptions || {})) if (!d || d.length > 4000) problems.push(`Description ${loc} ${d ? d.length : 0} (must be 1-4000)`);
  if (problems.length) throw new Error(`Validation failed:\n  ${problems.join('\n  ')}`);
  for (const [loc, w] of Object.entries(cfg.whatsNew || {})) if (w.length > 4000) throw new Error(`whatsNew ${loc} ${w.length} > 4000`);
  for (const [loc, k] of Object.entries(cfg.keywords || {})) if (k.length > 100) throw new Error(`Keywords ${loc} ${k.length} > 100`);

  const v = await editableVersion();
  const info = await editableAppInfo();
  const vls = await versionLocs(v.id);
  const ils = await infoLocs(info.id);
  const enUSvl = vls.find((l) => l.attributes.locale === 'en-US')?.attributes || {};
  const enUSil = ils.find((l) => l.attributes.locale === 'en-US')?.attributes || {};
  console.log(`Editable version ${v.attributes.versionString}${apply ? '' : ' [DRY RUN]'}\n`);
  if (description) console.log(`Description: ${description.length}/4000 chars → locales: ${(cfg.descriptionLocales || []).join(', ')}\n`);

  const targetLocales = [...new Set([...Object.keys(cfg.keywords || {}), ...Object.keys(cfg.subtitle || {}), ...(cfg.descriptionLocales || []), ...Object.keys(cfg.name || {}), ...Object.keys(cfg.descriptions || {}), ...(cfg.promoLocales || []), ...Object.keys(cfg.whatsNew || {})])];
  for (const loc of targetLocales) {
    const locDesc = cfg.descriptions?.[loc] ?? (description && (cfg.descriptionLocales || []).includes(loc) ? description : null);
    const wantDesc = !!locDesc;
    const nm = cfg.name?.[loc];
    const wantPromo = cfg.promotionalText && (cfg.promoLocales || []).includes(loc);
    const kw = cfg.keywords?.[loc];
    const wn = cfg.whatsNew?.[loc];
    const sub = cfg.subtitle?.[loc];

    // --- version localization (keywords + description + promo) ---
    let vl = vls.find((l) => l.attributes.locale === loc);
    if (kw || wantDesc || wantPromo || wn) {
      const attrs = {};
      if (kw && kw !== vl?.attributes.keywords) attrs.keywords = kw;
      if (wantDesc && locDesc !== vl?.attributes.description) attrs.description = locDesc;
      if (wantPromo && cfg.promotionalText !== vl?.attributes.promotionalText) attrs.promotionalText = cfg.promotionalText;
      if (wn && wn !== vl?.attributes.whatsNew) attrs.whatsNew = wn;
      if (!vl) {
        // new locale: copy en-US conversion fields so the localization is submission-complete
        Object.assign(attrs, {
          description: wantDesc ? locDesc : enUSvl.description,
          promotionalText: wantPromo ? cfg.promotionalText : enUSvl.promotionalText,
          whatsNew: wn, supportUrl: enUSvl.supportUrl, marketingUrl: enUSvl.marketingUrl,
        });
        console.log(`[${loc}] CREATE version localization (keywords ${kw ? kw.length : 0}/100, desc ${(attrs.description || '').length}/4000)`);
        if (apply) await api('POST', '/v1/appStoreVersionLocalizations', {
          data: { type: 'appStoreVersionLocalizations', attributes: { locale: loc, ...attrs },
            relationships: { appStoreVersion: { data: { type: 'appStoreVersions', id: v.id } } } },
        });
      } else if (Object.keys(attrs).length) {
        console.log(`[${loc}] UPDATE version localization: ${Object.keys(attrs).join(' + ')}${attrs.keywords ? `\n    keywords: ${attrs.keywords}` : ''}${attrs.description ? `\n    description: ${(vl.attributes.description || '').length} → ${attrs.description.length} chars\n      was: ${(vl.attributes.description || '').slice(0, 70).replace(/\n/g, ' ')}…\n      now: ${attrs.description.slice(0, 70).replace(/\n/g, ' ')}…` : ''}`);
        if (apply) await api('PATCH', `/v1/appStoreVersionLocalizations/${vl.id}`, {
          data: { type: 'appStoreVersionLocalizations', id: vl.id, attributes: attrs },
        });
      } else console.log(`[${loc}] version localization unchanged`);
    }

    // --- app info localization (subtitle; name copied for new locales) ---
    // NOTE: creating an appStoreVersionLocalization makes ASC auto-create the matching
    // appInfoLocalization, so a POST here can 409 — fall back to PATCHing the auto-created one.
    if (sub || nm) {
      const il = ils.find((l) => l.attributes.locale === loc);
      if (!il) {
        console.log(`[${loc}] CREATE app info localization (name "${nm || enUSil.name}", subtitle "${sub || ''}")`);
        if (apply) {
          try {
            await api('POST', '/v1/appInfoLocalizations', {
              data: { type: 'appInfoLocalizations',
                attributes: { locale: loc, name: nm || enUSil.name, ...(sub ? { subtitle: sub } : {}), privacyPolicyUrl: enUSil.privacyPolicyUrl },
                relationships: { appInfo: { data: { type: 'appInfos', id: info.id } } } },
            });
          } catch (e) {
            if (!/DUPLICATE/.test(e.message)) throw e;
            const fresh = await infoLocs(info.id);
            const auto = fresh.find((l) => l.attributes.locale === loc);
            if (!auto) throw e;
            const attrs = {};
            if (sub) attrs.subtitle = sub;
            if (nm) attrs.name = nm; else if (!auto.attributes.name) attrs.name = enUSil.name;
            await api('PATCH', `/v1/appInfoLocalizations/${auto.id}`, {
              data: { type: 'appInfoLocalizations', id: auto.id, attributes: attrs },
            });
            console.log(`[${loc}]   (auto-created by ASC — PATCHed it instead)`);
          }
        }
      } else {
        const attrs = {};
        if (sub && il.attributes.subtitle !== sub) attrs.subtitle = sub;
        if (nm && il.attributes.name !== nm) attrs.name = nm;
        if (Object.keys(attrs).length) {
          const nameLine = attrs.name ? `\n    name: "${il.attributes.name}" → "${attrs.name}"` : '';
          const subLine = attrs.subtitle ? `\n    subtitle: "${il.attributes.subtitle}" → "${attrs.subtitle}"` : '';
          console.log(`[${loc}] UPDATE app info localization: ${Object.keys(attrs).join(' + ')}${nameLine}${subLine}`);
          if (apply) await api('PATCH', `/v1/appInfoLocalizations/${il.id}`, {
            data: { type: 'appInfoLocalizations', id: il.id, attributes: attrs },
          });
        } else console.log(`[${loc}] app info (name/subtitle) unchanged`);
      }
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
