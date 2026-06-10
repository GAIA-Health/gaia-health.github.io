---
description: Load App Store Optimization (ASO) context for Go Go Gaia — reads the ASO reference, marketing highlights, and Custom Product Page drafts, optionally pulls live App Store state via the API, and reports strategy + current status so a new thread can pick up ASO work immediately.
---

# ASO Context Loader for Go Go Gaia

You are starting (or continuing) App Store Optimization work. Load the standing strategy, context, and current status, then give the user a tight briefing. Do NOT make changes to the live App Store listing unless the user explicitly asks.

## 1. Read the reference docs (in this order)

1. `docs-private/ASO.md` — the primary ASO reference: how App Store fields work (indexed vs conversion-only), current copy state, findings, proposed changes, measurement/A-B approach, tools, status checklist, and guardrails. This is the source of truth.
2. `docs-private/ASO-STRATEGY.md` — the 3k/mo playbook: lever stack (L1-L11 + S1-S5 spike portfolio), sprint plans, 12-week roadmap, measurement framework, execution briefs.
3. `docs-private/ASO-RESEARCH.md` — the evidence base: conversion/ranking benchmarks, ranking mechanics (caption indexing, 10-locale stacking, IAP-name indexing, CPP keyword associations, iOS 26 Tags), featuring/event data, organic channel evidence, all with sources.
4. `docs-private/ASO-COMPETITORS.md` — live competitor metadata, our keyword rank baseline (top-100 for zero non-branded terms as of 2026-06-10), per-term winnability, metadata Option A/B.
5. `docs-private/ASO-PLAYBOOK-ORGANIC.md` — enumerated free-channel action lists (one-day wins, review responses, founder video hooks, listicle outreach, gifting, communities).
6. `docs-private/ANALYTICS.md` — the data map: every source + how to pull it, current numbers, install history, the acquisition funnel, the ASO-share + 3k-scenario analysis.
7. `docs/MARKETING-HIGHLIGHTS.md` — killer features + per-audience marketing points.
8. `docs/DIFFERENTIATION-AND-CPP-COPY.md` — the positioning spine ("See how it all connects") and the per-vertical Custom Product Page (CPP) copy.

When WRITING any store copy, also read `docs-private/APP-STORE-VOICE.md` (per-field rules, char limits, indexing truth table) — it extends `TONE-OF-VOICE-GUIDE.md` for store surfaces. Pending copy drafts awaiting review live in `docs-private/ASO.md` §4 and `docs-private/ASO-DESCRIPTION-DRAFT.md`.

If any are missing, say so and continue with what's available.

## 2. Know the tooling (in `scripts/asc/`)

- `asc-cpp.mjs` — Custom Product Page automation (`audit` read-only / `sync <config> [--apply]`). The App Manager key works for this.
- `asc-analytics.mjs` — downloads by app version via the Sales API (needs a Finance/Sales/Admin key + `ASC_VENDOR_NUMBER`).
- Credentials live in `scripts/asc/.env` (gitignored): `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_PATH`, `ASC_APP_ID` (6608432371). Never commit `*.p8` or `.env`.

## 3. Optionally pull live state (read-only, only if it helps)

If the user wants the current listing, run the read-only audit:
`set -a && . scripts/asc/.env && set +a && node scripts/asc/asc-cpp.mjs audit`
You can also fetch app-level name/subtitle/keywords/description/promo text via the App Store Connect API (mint an ES256 JWT from the .env values — see the token snippet pattern used in `asc-analytics.mjs`). Read-only GETs only.

## 4. Report (keep it tight)

Give the user:
1. **Strategy spine** in one line (the connection/differentiation positioning).
2. **Current ASO state** — name, subtitle, keywords (note the 100-char usage), description posture, promo text.
3. **CPP status** — the 5 vertical drafts in `scripts/asc/verticals.json`, approved but NOT applied (gate: screenshots).
4. **Open actions / blockers** — pull from ASO.md §7, including any access blockers (e.g. the analytics key needs a Finance/Sales/Admin role + vendor number; the App Manager key 403s on Sales + App Analytics).
5. **Guardrails** — only name/subtitle/keywords are indexed (touch surgically); description + promo text are conversion-only (safe). Follow `TONE-OF-VOICE-GUIDE.md` (no em-dashes, no "free" as a lead, no superlatives, no medical claims).

## 5. Then ask what they want to do

Common next steps: apply the CPP drafts (`--apply`, needs screenshots first), ship a promo-text update (no new version needed), prep keyword/subtitle v2 for the next release, or wire up the analytics pull once a reports-capable key + vendor number exist.

After any change, update the status checklist in `docs-private/ASO.md` so it stays the source of truth.
