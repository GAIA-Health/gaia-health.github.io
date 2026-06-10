---
description: Load Google-organic SEO strategy context for Go Go Gaia — reads the SEO strategy doc, scenario model, and growth model, optionally pulls live organic numbers from GA4, and reports strategy + current status so a new thread can pick up SEO work immediately.
---

# SEO Strategy Context Loader for Go Go Gaia

You are starting (or continuing) Google organic / blue-link SEO work. Load the standing strategy, context, and current status, then give the user a tight briefing. Do NOT ship page changes unless the user explicitly asks.

## 1. Read the reference docs (in this order)

1. `docs/SEO.md` — the primary SEO strategy: the two-SERP-regime finding, benchmark + goals, vs-content gap analysis (build targets), CTR benchmarks, playbook, guardrails, and the dated Research Log. This is the source of truth.
2. `docs/SEO-SCENARIO-MODEL.md` — floor/mid/ceiling math for the download_click goal.
3. `docs/GROWTH-MODEL.md` — how SEO ladders into the master 5k MAU model.
4. `docs/DIFFERENTIATION-AND-CPP-COPY.md` — source of truth for app claims used in content.
5. Skim `docs/AIO.md` — the sibling channel. Head-term visibility is won via AI citation, not CTR; vs-content built for SEO doubles as AIO citation fuel.

If any are missing, say so and continue with what's available.

## 2. Know the tooling

- **GA4** (property 443880004, credentials `.ga-credentials.json` in repo root, gitignored): pull organic users + `download_click` events. Always filter `platform=web` — the property mixes iOS app and web streams. Pattern:
  `npx --yes google-analytics-cli report --property 443880004 --credentials .ga-credentials.json --dimensions "sessionSource" --metrics "totalUsers,sessions" --date-ranges '[{"startDate":"30daysAgo","endDate":"today"}]' --dimension-filter '{"filter":{"fieldName":"platform","stringFilter":{"value":"web"}}}'`
  Custom events: `download_click`, `login_click`, `scroll_depth`, `engaged_reader` (all carry `page_path`).
- **GSC** is under a different email — ask the user for CSV exports; don't try to pull it.
- For focused analysis work, the `/seo` skill (full audits, page analysis, schema) and the project `/seo-audit` and `/blog-review` commands already exist — this command loads strategy context, those do the work.

## 3. Optionally pull live state (read-only, only if it helps)

If the user wants current numbers, run the GA4 organic pull above and compare against the benchmark table in `docs/SEO.md` (baseline Jun 2026: ~357 organic users / 44 download_clicks per month).

## 4. Report (keep it tight)

Give the user:
1. **Strategy spine** in one line: head terms are zero-click (AI Overviews + app-pack eat them — don't chase CTR there); brand "X vs Y" comparison queries still click at 1–3% — that's where SEO effort pays.
2. **Benchmark vs goals** — current organic users + download_clicks against the Aug 2026 stretch exit-rate (1,000 users / 150 download_clicks per month). Note anything newer from the Research Log.
3. **Build targets** — the vs-content gap table from SEO.md (3-way clue/flo/natural-cycles, flo vs ovia, glow vs ovia vs clue, reversed-order fix) with whatever has shipped since.
4. **Playbook reminders** — freshness hygiene (`dateModified`, visible dates, sitemap `lastmod`), meta descriptions as citation cards, schema validity, anchored internal-link counting.
5. **Guardrails** — don't rewrite load-bearing titles (period-tracker-comparison especially), no superlatives, no medical advice, no blanket App Store CTAs on blog guides, keep the generic ASC UTM (`ct=gogogaia.com`), be generous to competitors in self-comparisons.

## 5. Then ask what they want to do

Common next steps: build one of the gap vs-pages, fix the reversed-query capture on `flo-vs-natural-cycles`, run a freshness/schema sweep, re-pull the monthly GA4 benchmark, or review new GSC exports against the two-regime tables.

After any session that produces findings, append a dated entry to the **Research Log** in `docs/SEO.md`; when a finding changes strategy, also update the section above it. Keep the Benchmark and Goals tables current as new GA4/GSC data comes in.
