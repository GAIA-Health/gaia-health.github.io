---
description: Load AI-search (AIO/GEO) strategy context for Go Go Gaia — reads the AIO strategy doc, the May 2026 ChatGPT cliff incident doc, and the scenario model, optionally pulls live AI-traffic numbers from GA4, and reports strategy + current status so a new thread can pick up AIO/GEO work immediately.
---

# AIO / GEO Context Loader for Go Go Gaia

You are starting (or continuing) AI-search optimization work (ChatGPT, Google AI Overviews, Perplexity, Gemini, Copilot). Load the standing strategy, context, and current status, then give the user a tight briefing. Do NOT ship content or strategy changes unless the user explicitly asks.

## 1. Read the reference docs (in this order)

1. `docs/AIO.md` — the primary AIO/GEO strategy: current state, ranked levers, goals, the core citation principle, the playbook, measurement approach, guardrails, backlog, and the dated Research Log. This is the source of truth.
2. `docs/AIO-CLIFF-MAY2026.md` — the May 21 2026 ChatGPT cliff incident: root cause (GPT-5.5 rollout, industry-wide, not us) + per-platform breakdown.
3. `docs/AIO-SCENARIO-MODEL.md` — floor/base/ceiling math + the TAM check (3k/mo is citation-share/CTR-bound, not TAM-bound).
4. `docs/GROWTH-MODEL.md` — how AIO ladders into the master 5k MAU model.
5. `docs/DIFFERENTIATION-AND-CPP-COPY.md` — source of truth for app claims; every liftable differentiator must match it.
6. Skim `docs/SEO.md` — the sibling channel. Google AI Overview wins surface partly through Google ranking, so the two strategies interlock.

If any are missing, say so and continue with what's available.

## 2. Know the tooling

- **GA4** (property 443880004, credentials `.ga-credentials.json` in repo root, gitignored): pull AI traffic by source. Always filter `platform=web` — the property mixes iOS app and web streams. Pattern:
  `npx --yes google-analytics-cli report --property 443880004 --credentials .ga-credentials.json --dimensions "sessionSource" --metrics "totalUsers,sessions" --date-ranges '[{"startDate":"30daysAgo","endDate":"today"}]' --dimension-filter '{"filter":{"fieldName":"platform","stringFilter":{"value":"web"}}}'`
- **Measurement trap:** Google AI Overview citations mostly land in `google / organic`, NOT a separate AI source. Only Gemini chat referrals (`gemini.google.com`) break out cleanly. Never conclude AIO is failing from the AI-source number alone.
- **GSC** is under a different email — ask the user for CSV exports; don't try to pull it.
- **Manual prompt audits** (monthly): run "best pregnancy app 2026" / "best period tracker app" in ChatGPT, Google AI Mode, Perplexity, Gemini; record if we're named, how described, and who gets cited instead.
- For focused page-level analysis, the `/seo-geo` skill covers crawler access, llms.txt, citability scoring, and platform-specific checks.

## 3. Optionally pull live state (read-only, only if it helps)

If the user wants current numbers, run the GA4 AI-source pull above and compare against the per-platform baseline in the cliff doc (post-cliff corrected baseline: ~110 AI users/mo).

## 4. Report (keep it tight)

Give the user:
1. **Strategy spine** in one line: specific, verifiable facts win AI citations — self-praise does not; lean weight toward Google AIO/Gemini + Perplexity (controllable, insulated) while attempting ChatGPT recovery as upside.
2. **Current state** — post-cliff baseline (~110/mo), base case (~600–800/mo by Aug 2026), 3k = ceiling/north-star not the plan. Note anything newer from the Research Log.
3. **Ranked levers** — from AIO.md (Google AIO/Gemini first, ChatGPT re-citation, Perplexity, off-site authority, content surface area).
4. **Open backlog** — pull from AIO.md's "Open questions / backlog" checklist.
5. **Guardrails** — no superlatives (they also lose citations), no medical/efficacy claims, every feature claim verified against the differentiation doc, "free" is a fact not the lead, be generous to competitors.

## 5. Then ask what they want to do

Common next steps: run the monthly prompt audit across all 4 engines, audit verdict-block coverage on comparison pages, ship a vs-content gap page (doubles as citation fuel — see `docs/SEO.md`), work the off-site authority backlog (Wikipedia, Reddit), or re-pull the GA4 per-platform numbers.

After any session that produces findings, append a dated entry to the **Research Log** in `docs/AIO.md`; when a finding changes strategy, also update the section above it so the doc stays the source of truth.
