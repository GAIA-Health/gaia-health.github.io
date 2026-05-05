# Comparison Page Conversion Study
**Last updated:** 2026-05-05
**Scope:** All "best X tracking app" comparison pages and period tracker comparison
**Purpose:** Track which structural patterns drive impressions vs conversions, so we can apply what's working to the pages that aren't.

---

## TL;DR

Across our 8 comparison pages, the pregnancy comparison converts ~6× better than the period tracker comparison. The data points to two specific differences as the likely cause: the pregnancy page features Go Go Gaia in its Quick Answer box, and opens with a pain-point hook. The period page does neither.

We have a clear playbook from the pages that work. The next step is applying it to the period page first (highest traffic, lowest conversion), then propagating to the niche comparison pages that are barely getting impressions.

---

## Goals (locked 2026-05-05)

**Deadline: 2026-08-31** (end of Q3 2026)

| Metric | Current (last 30d) | Target (per month) | Gap |
|---|---|---|---|
| GSC impressions | 66,820 | **100,000** | +49% |
| GSC clicks | 166 | **1,000** | +500% |
| CTA events (download + login) | 61 | **100** | +64% |

**Rationale:** We went from effectively 0 impressions in November 2025 to 67k in May 2026 (~6 months). Hitting 100k in another 3 months is +50% on top of an already-growing baseline. The 1k clicks target is the stretch — needs CTR to lift from 0.25% to ~0.5–1%, which depends on (a) the conversion playbook lifting CTR on existing rankers and (b) zombie comparison pages actually waking up and contributing. Path to 100 CTAs/month runs through the period page conversion fix shipped 2026-05-05 plus zombie page revival.

**Why these are stretch but defensible:**
- Impression growth has compounded ~14% MoM in the most recent cycle. Holding that pace gets us to 100k in 3 months naturally.
- 4 zombie comparison pages (PCOS, fertility, IVF, symptom tracker) currently contribute ~0 impressions despite being live since 2026-03-12. Reviving any one of them adds 5k–20k/month based on the perimenopause page (5k impressions on similar topic).
- CTA growth is the most direct path: each comparison page conversion fix adds 5–10 CTAs/month. 4 zombie page fixes + period page lift = +30–50 CTAs/month possible.

**Stop and reassess if:** by 2026-06-19 (6 weeks) we're not on track for at least 2 of the 3 metrics.

---

## Performance snapshot (last 30 days, web only)

| Page | Sessions | Downloads | Logins | Conv rate | GSC clicks (3mo) | GSC impressions (3mo) | Avg position |
|---|---|---|---|---|---|---|---|
| best-pregnancy-tracking-app | 183 | 9 | 0 | **4.9%** | 14 | 10,778 | 6.4 |
| how-to-choose-period-tracker-app | 242 | 2 | 0 | **0.8%** | 224 | 132,032 | 5.9 |
| best-perimenopause-tracking-app | 31 | 1 | 0 | 3.2% | 7 | 5,045 | 5.6 |
| clue-vs-flo | 16 | 1 | 0 | 6.3% | (low) | (low) | n/a |
| best-pcos-tracking-app | 11 | 0 | 0 | 0% | 0 | (low) | n/a |
| best-fertility-tracking-app | 3 | 0 | 0 | 0% | 0 | (low) | n/a |
| best-ivf-tracking-app | 2 | 0 | 0 | 0% | 0 | (low) | n/a |
| best-symptom-tracker-app-women | 2 | 0 | 0 | 0% | 0 | (low) | n/a |

**Site-wide GSC trend (last 30d vs prior 30d):**
- Clicks: 141 → 166 (+18%)
- Impressions: 58.5k → 66.8k (+14%)
- Avg position: 8.6 → 7.3 (gained ~1.3 spots)
- CTR: ~0.25% (flat)

**The earlier "5× organic growth" reading was misleading.** GA4 organic search jumped 46 → 229 sessions because GA4 tracking was added to 38 previously-untracked pages on 2026-04-06 (`ad9da04`). A meaningful chunk of that jump is instrumentation gain, not real traffic gain. GSC is the truth: clicks +18%, position +1.3.

---

## What changed and when (Feb–May 2026)

| Date | Commit | Change |
|---|---|---|
| 2026-02-11 | 9fa6dd0 | Unified navbar across all pages; scroll-linked How It Works redesign |
| 2026-02-16 | f725cc7 | Added ~50 internal cross-links across 20 blog posts |
| 2026-02-16 | e326b5f | Homepage SEO meta + FAQPage schema |
| 2026-02-24 | b018af0 | Homepage redesign (5 structural changes) |
| 2026-02-24 | 8943e94 | Typography system + visual polish |
| 2026-02-24 | 621f085 | Blog template + FAQ schema updates |
| 2026-03-11 | 8ff7941 | SEO overhaul + calculator cross-links across all blog posts |
| 2026-03-11 | 98224cf | Launched PCOS and perimenopause comparison posts |
| 2026-03-12 | d0eaec7 | Launched 4 new comparison posts (fertility, IVF, symptom, pregnancy) |
| 2026-04-06 | ad9da04 | GA4 tracking on 38 pages + CTA event tracking + CTR-optimized meta tags |
| 2026-04-07 | 9e05aa1 | Removed self-promotion bias from 6 blog posts |
| 2026-04-15 | 1004b80 | Stripped above-the-fold chrome from blog pages; launched endometriosis guide |
| 2026-04-16 | 78de73e | Rewrote opening paragraphs for featured-snippet CTR (ovulation + luteal) |
| 2026-04-23 | 0a35731 | SEO titles + metas rewrite + internal link boost on 5 underperforming pages |
| 2026-04-23 | 02b11a0 | Rescued ovulation + PMS guides with authority links and freshness |

The cluster of work in late Feb (homepage redesign + typography), mid-March (comparison posts launch + SEO overhaul), and early-to-mid April (analytics, CTR meta, above-the-fold cleanup) is what most likely drove the +18% click lift and +1.3 position gain.

---

## Why pregnancy converts ~6× better than period

Confirmed structural differences after reading both pages side by side:

### 1. Quick Answer box features Go Go Gaia
The pregnancy page's Quick Answer lists 6 apps with Go Go Gaia as one of them ("Best for complete pregnancy health tracking"). The period page's Quick Answer lists 5 apps and **omits Go Go Gaia entirely**. It's the only one of our 8 comparison pages that does this. Readers who scan the Quick Answer and bounce never see us.

### 2. Pain-point hero hook vs feature-y hero
- Pregnancy: *"You just found out you're pregnant and now your phone is recommending 47 pregnancy apps. Which ones are actually worth downloading?"*
- Period: *"We downloaded all 6 of these apps and used them for real."*

Every other comparison page on our site uses the pain-point pattern. The period page is the only one that opens with what we did instead of where the reader is.

### 3. App ordering in detail section
- Pregnancy introduces Go Go Gaia 4th, after What to Expect, Pregnancy+, and BabyCenter. Reader trust is built before we appear.
- Period puts Go Go Gaia 1st, which can read as "this is an ad" to a skeptical reader and trigger them to scroll past.
- Note: perimenopause and PCOS also put Go Go Gaia 1st and convert at 3.2% / 0% (tiny sample). So order alone isn't fatal, but it's not helping either.

### 4. Prominent transparency callout
The pregnancy page has a "Full Transparency" info box up top that explicitly names Go Go Gaia's gaps ("doesn't have 3D baby development visuals or editorial content"). Counterintuitively, naming the bias makes us more trustworthy. The period page has the same kind of disclosure but as small inline text, easy to miss.

### 5. Per-app Download lines
Pregnancy: 6 explicit "Download:" lines (one per app section). Period: 1.

### 6. Other secondary differences
- Pregnancy "Step 1" gives concrete categories (Content / Community / Health Tracking / Practical Tools) that frame the rest of the page. Period "Step 1" asks the reader abstract self-reflection questions.
- Pregnancy is dated 2026-03-11 (fresh). Period shows "Published Nov 2 2025 / Updated Feb 16 2026" (visibly older).

### Hypothesis (with caveats)
Pregnancy intent is also genuinely higher: it's a deadline-driven decision, ~9 months of usage commitment, often a first health app for the user. Even with identical pages, pregnancy would probably convert better than period. But a 6× gap is too big to chalk up to intent alone, especially when perimenopause (also high-intent, also a "I need help with this specific life stage" search) converts at 3.2% with the same template. We think most of the gap is page execution, not topic intent.

---

## Why period gets way more impressions

Period tracker comparison pulls **132k impressions in 3 months** vs 10.8k for pregnancy. That's a 12× impression gap going the other direction.

### Hypotheses

1. **Search volume is bigger.** "Period tracker" / "best period tracker app" gets searched far more than pregnancy app queries. Pregnancy is a temporary state, period tracking is a recurring need across the user's reproductive life.
2. **The page ranks for many adjacent queries.** Position 5.93 on a high-volume head term means the page also shows up for "Clue vs Flo," "best free period tracker," "is Flo private," etc. A lot of long-tail impressions stack up.
3. **CTR is low (0.17%) which means impressions inflate** — Google shows the result, users scan and pick a different one, but the impression still counts. So "high impressions" isn't a pure good signal here.
4. **The November 2025 publish date is older**, so it's accumulated more index time and more backlinks/citations than the March 2026 pregnancy page.

The takeaway: the period page is doing its impression job well. The conversion job is what's broken.

---

## The playbook (transferable patterns)

These are the patterns the well-converting pages share and the period page lacks. Each is independently testable.

1. **Quick Answer box must include Go Go Gaia** with a specific superlative ("Best for X"). Never let scanners miss us.
2. **Hero opens with the user's situation, not what we did.** Concrete scenarios, real numbers, the actual question they typed into Google.
3. **Position Go Go Gaia 3rd–5th in the detail section, not 1st.** Build trust with established competitors first.
4. **Use-case ordering, not ranked.** Every section is "For [user need]: [app name]." No app is called "best overall."
5. **Prominent transparency callout** that names Go Go Gaia's gaps. Specific honesty beats vague disclosure.
6. **Per-app Download line in every section** (6 chances to convert vs 1).
7. **Refresh dateModified on update.** Don't show "Published X / Updated Y months later" — readers see staleness.
8. **Step 1 frames the comparison categorically**, not with abstract self-reflection questions. Give the reader the lens before showing them the apps.
9. **Tone:** pain-point opener, contractions, specific numbers, no "finally / seamlessly / journey / transform," no em-dashes, conversational. (Per `TONE-OF-VOICE-GUIDE.md`.)

---

## Will updating the period page hurt impressions?

Likely no, if we're surgical. The page sits at position 5.93 on a high-volume head term, so any change carries some risk of re-evaluation by Google.

**Safe to change** (below-the-fold-of-the-SERP, doesn't affect ranking signals):
- Lead paragraph rewrite
- Quick Answer box content
- App section ordering
- Adding Download lines
- Internal links

**Don't touch** (load-bearing for ranking):
- `<title>` tag (per memory note: it's known to be load-bearing despite truncating)
- `<h1>`
- `<meta description>`
- URL slug

**Likely positive:** bumping `dateModified` to a recent date is a freshness signal Google rewards.

**Realistic worst case:** ±10% impressions for 1–2 weeks while Google re-crawls and re-evaluates, then back to baseline or better. Worth the trade if conversion lifts even to 2%.

**Mitigation:** ship as separate small commits so any one change can be rolled back without unwinding the whole batch.

---

## What we don't know yet

- **Per-page improvement attribution.** We have current totals but no before/after diff at the page level. Need a second GSC export from a prior date range (e.g., Nov 5 – Feb 5) to do a real winners-and-losers comparison.
- **Why PCOS / fertility / IVF / symptom-tracker comparison pages have ~zero impressions.** They've been live since 2026-03-12 (~7 weeks). They have the right structure (pain-point hero, Go Go Gaia in Quick Answer). The problem is search visibility, not conversion. Likely candidates: title not matching head queries, weak internal linking, content depth, indexation.
- **Whether reordering Go Go Gaia from 1st to 4th actually helps.** Counterintuitive. Want to test on the period page first before applying to perimenopause and PCOS.
- **Whether the 4.9% pregnancy rate holds at higher traffic volumes.** Currently based on 183 sessions. Could move once volume scales.
- **Mobile vs desktop conversion split.** Not yet pulled.

---

## Next steps

1. ~~**Apply playbook to period tracker comparison page.**~~ ✅ Shipped 2026-05-05 — see Changelog below.
2. **Diagnose the zombie comparison pages.** Read PCOS / fertility / IVF / symptom-tracker pages in detail. Identify SEO-visibility gaps separately from conversion gaps.
3. **Export comparison-window GSC CSV** (e.g., Nov 5–Feb 5 vs Feb 5–May 5) for real per-page improvement attribution.
4. **Track conversion rate weekly per page** in this doc to see if the playbook actually moves numbers.

---

## Changelog

### 2026-05-05 — Period tracker comparison playbook applied
**Commits:** `1624236`, `c04e6ab`, `ec7d86b`, `63b68b2`, `faa8019`

**Changes shipped to `/blog/how-to-choose-period-tracker-app.html`:**
1. Lead paragraph rewritten with pain-point opener (App Store has 30+ apps, varying prices, which is worth using). Mirrors pregnancy voice.
2. Quick Answer box now includes Go Go Gaia at position 4 of 6 ("Best all-in-one"). Previously omitted us entirely.
3. App detail sections reordered: Clue → Flo → Ovia → Go Go Gaia (4th) → Natural Cycles → Period Tracker. Previously Go Go Gaia was 1st. TOC updated to match.
4. Inline disclosure replaced with prominent Full Transparency callout box, positioned right before Step 1. Names specific Go Go Gaia gaps (iOS only, smaller community than Flo/Clue, not FDA-cleared as contraceptive).
5. Per-app Download links added to all 5 competitor sections (Clue, Flo, Ovia, Natural Cycles, Period Tracker). All competitor URLs verified with HTTP 200. Period Tracker by Simple Design uses non-linked text (couldn't verify URL).
6. `dateModified` schema field bumped from 2026-02-24 to 2026-05-05. Visible "Last Updated" label updated to match.

**Did NOT change** (load-bearing for ranking, per memory note): `<title>`, `<h1>`, `<meta description>`, URL slug, hero image.

**Baseline (last 30d ending 2026-05-04, web only):**
- Sessions: 242
- Downloads: 2 → conv rate 0.8%
- Logins: 0
- GSC clicks (3-mo total): 224
- GSC impressions (3-mo total): 132,032
- GSC avg position: 5.93
- GSC CTR: 0.17%

**Hypothesis:** conversion rate climbs to 2–5% over 30 days (matching perimenopause/pregnancy template performance). Impressions hold ±10% during Google re-evaluation, then return to baseline or improve from `dateModified` freshness signal.

**Watching:**
- GSC daily clicks on the page — should hold steady or grow
- GSC avg position — small dip possible during re-crawl, then recovery
- GA4 download_click events filtered to `/blog/how-to-choose-period-tracker-app.html`
- Sessions to the page should stay 200+/30d

**Next data check:** 2026-05-19 (2 weeks out).

---

## Appendix: page-by-page structural inventory

| Page | Pain-point hero | GGG in Quick Answer | First app section | App count | Conv rate |
|---|---|---|---|---|---|
| best-pregnancy-tracking-app | ✅ | ✅ | What to Expect (3rd-party first) | 6 | 4.9% |
| best-perimenopause-tracking-app | ✅ | ✅ | Go Go Gaia (1st) | 8 | 3.2% |
| best-pcos-tracking-app | ✅ | ✅ | Go Go Gaia (1st) | 7 | 0% (n=11) |
| best-fertility-tracking-app | ✅ | ✅ | Natural Cycles (3rd-party first) | 8 | n/a (n=3) |
| best-ivf-tracking-app | ✅ | ✅ | Embie (3rd-party first) | 6 | n/a (n=2) |
| best-symptom-tracker-app-women | ✅ | ✅ | Bearable (3rd-party first) | 5 | n/a (n=2) |
| clue-vs-flo | ✅ | ✅ | n/a (vs format) | 2 | 6.3% |
| how-to-choose-period-tracker-app | ❌ | ❌ | Go Go Gaia (1st) | 6 | 0.8% |
