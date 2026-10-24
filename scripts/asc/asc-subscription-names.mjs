#!/usr/bin/env node
// App Store Connect — subscription group / subscription display names + descriptions.
//
// Usage (env: source scripts/asc/.env):
//   node scripts/asc/asc-subscription-names.mjs list
//   node scripts/asc/asc-subscription-names.mjs apply <config.json>            # DRY RUN (prints requests)
//   node scripts/asc/asc-subscription-names.mjs apply <config.json> --apply    # sends requests
//
// Config shape: see scripts/asc/subscriptions-oct08-rename.json. For each locale:
// existing localization -> PATCH name/(customAppName|description); missing -> POST.
// Group localization attrs: name. Subscription localization attrs: name, description.
// Limits enforced here: names <= 30 chars, descriptions <= 45 chars.
import crypto from 'node:crypto';
import fs from 'node:fs';

const BASE = 'https://api.appstoreconnect.apple.com';
const need = (n) => { const v = process.env[n]; if (!v) { console.error(`Missing ${n}. Run: set -a; . scripts/asc/.env; set +a`); process.exit(1); } return v; };
const b64url = (i) => Buffer.from(i).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
function token() {
  const pem = fs.readFileSync(need('ASC_KEY_PATH'), 'utf8');
  const now = Math.floor(Date.now() / 1000);
  const si = `${b64url(JSON.stringify({ alg: 'ES256', kid: need('ASC_KEY_ID'), typ: 'JWT' }))}.${b64url(JSON.stringify({ iss: need('ASC_ISSUER_ID'), iat: now, exp: now + 900, aud: 'appstoreconnect-v1' }))}`;
  return `${si}.${b64url(crypto.sign('sha256', Buffer.from(si), { key: pem, dsaEncoding: 'ieee-p1363' }))}`;
}
async function api(method, p, body) {
  const r = await fetch(p.startsWith('http') ? p : BASE + p, { method, headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text();
  let j; try { j = t ? JSON.parse(t) : {}; } catch { j = { raw: t }; }
  if (!r.ok) throw new Error(`${method} ${p} -> ${r.status} ${t.slice(0, 600)}`);
  return j;
}
const data = async (p) => (await api('GET', p)).data || [];

async function snapshot() {
  const appId = need('ASC_APP_ID');
  const groups = await data(`/v1/apps/${appId}/subscriptionGroups?limit=50`);
  const out = [];
  for (const g of groups) {
    const gl = await data(`/v1/subscriptionGroups/${g.id}/subscriptionGroupLocalizations?limit=50`);
    const subs = await data(`/v1/subscriptionGroups/${g.id}/subscriptions?limit=50`);
    const sl = {};
    for (const s of subs) sl[s.id] = await data(`/v1/subscriptions/${s.id}/subscriptionLocalizations?limit=50`);
    out.push({ g, gl, subs, sl });
  }
  let promoted = [];
  try { promoted = await data(`/v1/apps/${appId}/promotedPurchases?limit=50`); } catch (e) { promoted = [`ERR ${e.message}`]; }
  return { out, promoted };
}

async function cmdList() {
  const { out, promoted } = await snapshot();
  for (const { g, gl, subs, sl } of out) {
    console.log(`GROUP ${g.id} ref="${g.attributes.referenceName}"`);
    for (const l of gl) console.log(`  gloc ${l.id} ${l.attributes.locale} name="${l.attributes.name}" customAppName="${l.attributes.customAppName ?? ''}" state=${l.attributes.state ?? ''}`);
    for (const s of subs) {
      console.log(`  SUB ${s.id} productId=${s.attributes.productId} ref="${s.attributes.name}" period=${s.attributes.subscriptionPeriod} state=${s.attributes.state}`);
      for (const l of sl[s.id]) console.log(`    sloc ${l.id} ${l.attributes.locale} name="${l.attributes.name}" desc="${l.attributes.description}" state=${l.attributes.state ?? ''}`);
    }
  }
  console.log('PROMOTED', JSON.stringify(promoted.map((p) => p.id ? { id: p.id, ...p.attributes } : p)));
}

async function cmdApply(cfgPath, doApply) {
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  for (const [what, o] of [['group', cfg.group], ...cfg.subscriptions.map((s) => [s.productId, s])]) {
    for (const [loc, v] of Object.entries(o.locales)) {
      if (v.name.length > 30) throw new Error(`${what}/${loc} name ${v.name.length}>30`);
      if (v.description && v.description.length > 45) throw new Error(`${what}/${loc} desc ${v.description.length}>45`);
    }
  }
  const { out } = await snapshot();
  const reqs = [];
  const group = out.find((x) => x.g.attributes.referenceName === cfg.group.referenceName) || out[0];
  for (const [locale, v] of Object.entries(cfg.group.locales)) {
    const ex = group.gl.find((l) => l.attributes.locale === locale);
    if (ex) reqs.push(['PATCH', `/v1/subscriptionGroupLocalizations/${ex.id}`, { data: { type: 'subscriptionGroupLocalizations', id: ex.id, attributes: { name: v.name } } }]);
    else reqs.push(['POST', '/v1/subscriptionGroupLocalizations', { data: { type: 'subscriptionGroupLocalizations', attributes: { locale, name: v.name }, relationships: { subscriptionGroup: { data: { type: 'subscriptionGroups', id: group.g.id } } } } }]);
  }
  for (const sc of cfg.subscriptions) {
    const sub = group.subs.find((s) => s.attributes.productId === sc.productId);
    if (!sub) throw new Error(`No subscription with productId ${sc.productId}`);
    for (const [locale, v] of Object.entries(sc.locales)) {
      const ex = group.sl[sub.id].find((l) => l.attributes.locale === locale);
      if (ex) reqs.push(['PATCH', `/v1/subscriptionLocalizations/${ex.id}`, { data: { type: 'subscriptionLocalizations', id: ex.id, attributes: { name: v.name, description: v.description } } }]);
      else reqs.push(['POST', '/v1/subscriptionLocalizations', { data: { type: 'subscriptionLocalizations', attributes: { locale, name: v.name, description: v.description }, relationships: { subscription: { data: { type: 'subscriptions', id: sub.id } } } } }]);
    }
  }
  // --post-only: skip PATCHes. Apple returns 409 UNMODIFIABLE for ACTIVE (approved) localizations,
  // so existing-locale renames must go through the ASC UI; new locales can still be POSTed.
  const postOnly = process.argv.includes('--post-only');
  for (const [m, p, b] of reqs) {
    if (postOnly && m !== 'POST') { console.log(`SKIP ${m} ${p} (--post-only)`); continue; }
    console.log(`${doApply ? 'SEND' : 'DRY '} ${m} ${p}\n${JSON.stringify(b)}\n`);
    if (doApply) { const r = await api(m, p, b); console.log('  ->', r.data?.id, r.data?.attributes?.state ?? ''); }
  }
  if (!doApply) console.log('Dry run only. Add --apply to send.');
}

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith('--'));
const [cmd, cfg] = args.filter((a) => !a.startsWith('--'));
try {
  if (cmd === 'list') await cmdList();
  else if (cmd === 'apply' && cfg) await cmdApply(cfg, flags.includes('--apply'));
  else { console.error('Usage: asc-subscription-names.mjs list | apply <config.json> [--apply]'); process.exit(1); }
} catch (e) { console.error(e.message); process.exit(1); }
