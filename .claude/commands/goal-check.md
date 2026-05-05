---
description: Check current performance against the Q3 2026 goals (100k impressions, 1k clicks, 100 CTAs/month) defined in the conversion study doc. Pulls GA4 data automatically and surfaces what to export from GSC.
---

# Goal Check for Go Go Gaia

You are checking the website's progress against the Q3 2026 goals locked in `comparison-page-conversion-study.md`. The deadline is **2026-08-31**. Run all the steps below and produce one consolidated progress report.

## 1. Read the locked goals

Read `comparison-page-conversion-study.md` and locate the "## Goals (locked ...)" section. Extract:
- The deadline (currently 2026-08-31)
- The three target metrics with their numerical goals
- The "Stop and reassess if" checkpoint date

If the deadline has passed or is within 2 weeks, flag that prominently in the report.

## 2. Compute weeks remaining

Today's date is in the runtime context. Compute weeks-to-deadline. This sets the urgency frame for everything else.

## 3. Pull current GA4 metrics

Run these commands (web platform only — `platform=web` filter is mandatory because the GA4 property mixes iOS app data with website data):

**Last 30 days organic + total sessions, broken down by channel:**
```bash
npx --yes google-analytics-cli report --property 443880004 --credentials .ga-credentials.json \
  --dimensions "sessionDefaultChannelGroup" \
  --metrics "sessions,totalUsers,engagedSessions" \
  --date-ranges '[{"startDate":"30daysAgo","endDate":"today"}]' \
  --dimension-filter '{"filter":{"fieldName":"platform","stringFilter":{"value":"web"}}}'
```

**Last 30 days CTA events (downloads + logins), totals:**
```bash
npx --yes google-analytics-cli report --property 443880004 --credentials .ga-credentials.json \
  --dimensions "eventName" \
  --metrics "eventCount" \
  --date-ranges '[{"startDate":"30daysAgo","endDate":"today"}]' \
  --dimension-filter '{"andGroup":{"expressions":[{"filter":{"fieldName":"platform","stringFilter":{"value":"web"}}},{"filter":{"fieldName":"eventName","inListFilter":{"values":["download_click","login_click"]}}}]}}'
```

**Last 30d vs prior 30d trend on key channels:**
```bash
npx --yes google-analytics-cli report --property 443880004 --credentials .ga-credentials.json \
  --dimensions "sessionDefaultChannelGroup" \
  --metrics "sessions" \
  --date-ranges '[{"startDate":"30daysAgo","endDate":"today"},{"startDate":"60daysAgo","endDate":"31daysAgo"}]' \
  --dimension-filter '{"filter":{"fieldName":"platform","stringFilter":{"value":"web"}}}'
```

Parse the JSON output with Python and extract the numbers cleanly. GA4's CLI returns deeply nested JSON.

## 4. Check for fresh GSC data

GSC is on a different account and can't be queried automatically. Look in `~/Downloads/` for the most recent export folder matching the pattern `go-go-gaia.com-Performance-on-Search-*`:

```bash
ls -lt ~/Downloads/ | grep -i "go-go-gaia.*Performance" | head -3
```

If a folder exists from within the last 7 days, parse its `Chart.csv` to compute last-30d impressions and clicks. If not, mark GSC numbers as "STALE" or "MISSING" in the report and tell the user how to refresh: open Google Search Console for go-go-gaia.com, click Performance → set date range to "Last 28 days" → Export → Download CSV → save to Downloads. Don't fabricate GSC numbers.

## 5. Compare to goals and compute trajectory

For each of the three metrics, compute:

| Metric | Current 30d | Target | Gap | On track? | Implied path |
|---|---|---|---|---|---|

**On track?** logic:
- If current ≥ target: "✅ Already hitting goal"
- If current trend (vs prior 30d) projects to hit target by deadline: "✅ On pace"
- If current trend projects to miss target by ≤25%: "⚠️ Slightly off pace"
- If current trend projects to miss by >25%: "❌ Off pace, needs intervention"

**Implied path:** state what monthly growth rate would close the gap by deadline (e.g., "needs +15% MoM for 4 months").

For impressions: project (current × 1.14^N) where N = months remaining and 14% is recent MoM. If that projection ≥ target, mark on pace.

## 6. Per-comparison-page check

The comparison pages are the main lever for hitting goals. Pull current 30d session counts for each:

```bash
npx --yes google-analytics-cli report --property 443880004 --credentials .ga-credentials.json \
  --dimensions "pagePath" \
  --metrics "sessions" \
  --date-ranges '[{"startDate":"30daysAgo","endDate":"today"}]' \
  --dimension-filter '{"andGroup":{"expressions":[{"filter":{"fieldName":"platform","stringFilter":{"value":"web"}}},{"filter":{"fieldName":"pagePath","inListFilter":{"values":["/blog/best-pregnancy-tracking-app.html","/blog/how-to-choose-period-tracker-app.html","/blog/best-perimenopause-tracking-app.html","/blog/best-pcos-tracking-app.html","/blog/best-fertility-tracking-app.html","/blog/best-ivf-tracking-app.html","/blog/best-symptom-tracker-app-women.html","/blog/clue-vs-flo.html"]}}}]}}'
```

Compare against baselines in the conversion study doc's Changelog. Specifically watch:
- Period tracker comparison: did conversion rate move from 0.8% baseline?
- Zombie pages (PCOS, fertility, IVF, symptom tracker): did any of them break out of single-digit sessions?
- Perimenopause: still tracking at ~3% conversion?

## 7. Flag anything surprising

A few specific things to look for and call out:
- Any zombie page that suddenly has >10× its baseline sessions (indicates a query took off)
- Any well-converting page whose sessions dropped significantly (regression check)
- "Unassigned" channel growing fast (typically indicates tagging gaps)
- CTA event count moving without corresponding session growth (interesting — means conversion rate moved)

## 8. Report format

Output as a single concise report (under 400 words) with:

1. **Headline** (one sentence): on pace / off pace, with weeks remaining
2. **Goal scoreboard** (the table from step 5)
3. **What moved this period** (1-3 bullet points on biggest changes vs prior 30d)
4. **Per-comparison-page snapshot** (small table, 8 rows)
5. **GSC status** (fresh / stale / missing — and instructions if missing)
6. **Recommendation** (1 paragraph): if off pace, what's the highest-leverage move to make next? If on pace, what could accelerate?

Do NOT write a generic "great progress!" report. If the numbers are bad, say so. The goal of this command is to surface reality, not cheerlead.

## 9. Optional: append a snapshot

If the user passes `--log` or asks for it, append a dated snapshot to the conversion study doc's Changelog so we have a longitudinal record.

---

**Important caveats to keep in mind:**
- GA4 vs GSC reconciliation: GA4 organic search sessions ≠ GSC clicks. They count differently. GSC is the authority on impressions/clicks. GA4 is the authority on sessions and CTA events.
- The Apr 6 GA4 tracking rollout (`ad9da04`) added events to 38 previously-untracked pages. Comparisons spanning that date are partially measuring instrumentation gain, not real growth. Be honest about this.
- Per memory: the period tracker comparison `<title>` is load-bearing. If you ever recommend rewriting it, check the memory note first.
