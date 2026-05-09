# Comparison Page Conversion Study
**Last updated:** 2026-05-09
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

## Future content backlog

### Training app comparison pages (women-focused, cycle-aware framing)

A new content cluster targeting athletic-training searchers. Most popular running and triathlon training apps don't account for menstrual cycle phases when prescribing training intensity, recovery, or nutrition. That's the gap to wedge into.

**Pages to build:**
- `best-marathon-training-app.html` — compare Garmin Connect, Nike Run Club, Strava, Runna, Adidas Running, Hal Higdon, plus Go Go Gaia. Frame: most apps prescribe training plans without cycle awareness — Go Go Gaia adapts to your phase + integrates wearable data + tracks fueling/sleep/mood.
- `best-cycling-training-app.html` (sport cycling, not menstrual cycle) — compare Strava, TrainerRoad, Zwift, Wahoo SYSTM, Rouvy, plus Go Go Gaia.
- `best-triathlon-training-app.html` — compare TrainingPeaks, TriDot, MyTriathlonTraining, plus Go Go Gaia. Niche audience but high-intent.
- Possible additions: `best-half-marathon-training-app.html`, `best-strength-training-app-women.html`, `best-running-app-for-women.html`.

**Before writing, do this research pass:**
1. **Audit nutriease iOS app repo** for what's actually built around training functionality. Check `/docs` and the codebase. We need to be specific about what Go Go Gaia *does* with training data (Apple Watch / Garmin sync, workout phase recommendations, recovery flags, fueling tied to phase) and what it *doesn't* do (no built-in training plans yet, etc.). Don't overpromise features that aren't shipped.
2. **Research the popular training apps** — Strava (massive social/segments), Garmin Connect (deep wearable integration), Runna (AI coaching, growing fast), TrainingPeaks (gold standard for serious endurance), Zwift (indoor cycling). Focus on what their cycle-awareness story is (mostly: nothing), what their data privacy looks like, and which features women athletes specifically miss.
3. **Framing for Go Go Gaia in these comparisons:**
   - "Best for women athletes who want training that adapts to their cycle"
   - "Best comprehensive solution" — not just training, but training + cycle + nutrition + sleep + mood + symptoms in one place
   - Lean into the gap: most training apps treat women athletes as small men. The cycle phase changes performance, recovery needs, and injury risk. Few apps acknowledge this.
4. **Avoid the trap** of positioning Go Go Gaia as a *replacement* for Strava/Garmin. They have things we don't (advanced training plans, social leaderboards, structured workouts). Position as complementary: keep using your training app for plans + segments, use Go Go Gaia for the female-physiology layer they're missing.

**SEO opportunity sizing:** "marathon training app" head term is competitive but has clear runner-up positions. "Marathon training app for women" is a wide-open long-tail with no major dedicated player.

**When this gets built**, log a changelog entry below per page (same format as zombie revival), and update the playbook in this doc if anything new about training-niche conversion patterns emerges.

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

### 2026-05-05 — Zombie comparison pages revived
**Commits:** `614a041`, `702df8a`, `fc33254`, `312c8e9`, `4d649cb`, `b81a172`

**The zombie audit found:** 4 pages (best-ivf, best-symptom-tracker, best-pcos, best-fertility) had been live since 2026-03-12 with effectively 0 impressions. Diagnosis: a mix of Go-Go-Gaia-first ordering (same anti-pattern as the period page) AND weak inline body linking from authoritative guide pages. Most existing internal links were in footer "Related" cards, which Google weights lower than contextual body links.

**Changes shipped to 5 comparison pages:**
- **`best-pcos-tracking-app.html`** — Quick Answer + detail sections reordered: Clue → Flo → AskPCOS → **Go Go Gaia (4th)** → Bearable → PCOS Tracker → Cysterhood. Was Go Go Gaia 1st of 7. dateModified bumped to 2026-05-05. Last Updated label added.
- **`best-perimenopause-tracking-app.html`** — Reordered: Balance → Health & Her → Clue → **Go Go Gaia (4th)** → Caria → Flo → Midday → Perry. Was Go Go Gaia 1st of 8. Same date refresh.
- **`best-fertility-tracking-app.html`** — Quick Answer reordered to match detail (which already had GGG mid-list); slight detail nudge from 3rd to 4th. New order: Natural Cycles → Fertility Friend → Premom → **Go Go Gaia (4th)** → Clue → Glow → Flo → Ovia. Same date refresh.
- **`best-symptom-tracker-app-women.html`** — Reordered: Bearable → Clue → **Go Go Gaia (3rd of 5)** → Embody → Flo. Was Go Go Gaia 1st in Quick Answer / 2nd in detail. Same date refresh.
- **`best-ivf-tracking-app.html`** — Already had Go Go Gaia at 5th of 6 (good order). Just dateModified refresh.

**Cross-cutting internal linking commit (`b81a172`):**

Added 6 inline body links from authoritative guide pages to the zombie comparison pages, with descriptive anchor text:
- `am-i-pregnant-guide.html` → `best-fertility-tracking-app.html` (TTC section) + `best-ivf-tracking-app.html` (fertility specialist follow-up)
- `cycle-syncing-guide.html` → `best-symptom-tracker-app-women.html` (irregular cycle symptoms)
- `perimenopause-guide.html` → `best-perimenopause-tracking-app.html` (tracking-app section)
- `complete-guide-to-pcos.html` → `best-pcos-tracking-app.html` (doctor visit prep) + `best-fertility-tracking-app.html` and `best-ivf-tracking-app.html` (PCOS-TTC section)

**Baselines (last 30d ending 2026-05-04):**

| Page | Sessions | Downloads | Conv | GSC clicks (3mo) | GSC impressions (3mo) |
|---|---|---|---|---|---|
| best-perimenopause | 31 | 1 | 3.2% | 7 | 5,045 |
| best-pcos | 11 | 0 | 0% | 0 | (low) |
| best-fertility | 3 | 0 | 0% | 0 | (low) |
| best-ivf | 2 | 0 | 0% | 0 | (low) |
| best-symptom-tracker | 2 | 0 | 0% | 0 | (low) |

**Hypothesis:** within 4-6 weeks, the 4 zombie pages each climb to 1k+ monthly impressions and 50+ sessions/month as Google re-evaluates their authority and they start ranking for niche queries. Perimenopause page could grow faster (already had 5k impressions). Combined uplift target: +20k impressions/month across these 5 pages.

**Watching:**
- GSC impressions and clicks per zombie page weekly
- GA4 sessions per zombie page weekly
- Whether any zombie breaks into the GSC "top pages" list (currently none of the 4 are there)
- Conversion rate on perimenopause and fertility (the two with measurable session counts)

**Next data check:** 2026-05-19 (2 weeks out, same checkpoint as period page).

---

### 2026-05-06 — Site-wide internal-link cleanup + invisible-page title fixes
**Commits:** `b527790`, `80c8238`, `7910c26`, `a39a712`, `74fe0d1`, `174b634`

**Audit findings:**

A comprehensive incoming-link audit across all 28 blog pages found that, after the zombie revival on 2026-05-05, the only pages still missing impressions were two evergreen guides that had **plenty of internal links but invisible search performance** — `birth-control-guide` (10 incoming links, 0 impressions/3mo) and `period-tracking-guide` (20 incoming links, 0 impressions/3mo). Diagnosis was title-vs-query mismatch competing with authority sites, not a linking gap.

Also found 11 evergreen pages with stale `dateModified` (frozen at 2026-02-24 or older) and one missing card on the blog index (clue-vs-flo).

**Changes shipped:**

1. **Surfaced clue-vs-flo on blog index** (`b527790`). It had zero incoming links from anywhere on the site. Also fixed stale "5 Apps Compared" → "7 Apps Compared" on the PCOS card.

2. **"Other App Comparisons" section** added to all 8 comparison pages (`80c8238`). A dedicated cross-linking section right after the existing "Related Articles" section. Each page now links to 4-7 peer comparison pages with descriptive anchor text. Result: every comparison page now has 6+ incoming site-internal links (was 0-22 range; clue-vs-flo specifically went 0→6).

3. **dateModified refreshed to 2026-05-06** on 11 evergreen pages (`7910c26`): am-i-pregnant, birth-control, complete-guide-to-pcos, cycle-syncing-app, cycle-syncing-guide, fitness-tracker-cycle, habit-tracking-success, menopause-guide, mood-tracking-benefits, perimenopause-guide, period-tracking-guide. Skipped 3 seasonal pages (the 2026 New Year and January habits ones — those are dated content). Zero ranking risk, freshness signal Google rewards.

4. **Training-app content backlog added** (`a39a712`) — marathon, cycling, triathlon comparison page ideas with pre-build research checklist (audit nutriease iOS repo for shipped functionality, research what Strava/Garmin/Runna/TrainingPeaks lack around female physiology, position Go Go Gaia as complementary not replacement).

5. **Title rewrites for the two invisible high-link pages:**

   **birth-control-guide** (`74fe0d1`):
   - Title: "Birth Control Guide 2026: Every Method Compared (Chart Included)" → "How to Choose Birth Control: 12 Methods Compared (2026)"
   - H1: aligned to "How to Choose Birth Control: A Side-by-Side Comparison of 12 Methods"
   - Meta description sharpened to specific methods + comparison framing
   - Targets "how to choose birth control" decision-aid query instead of "birth control guide" head term competing with Planned Parenthood/Mayo/NHS

   **period-tracking-guide** (`174b634`):
   - Title: "Period Tracking: What to Track Beyond Just Your Dates" → "How to Track Your Period: A Beginner's Checklist"
   - H1 left as-is (already keyword-rich)
   - Targets "how to track your period," "period tracking for beginners" direct-intent queries

   URLs unchanged on both — all 10/20 incoming internal links still resolve.

**Baselines (all four invisible-page diagnostics, last 30d ending 2026-05-04):**

| Page | Sessions | GSC clicks (3mo) | GSC impressions (3mo) | Incoming links |
|---|---|---|---|---|
| birth-control-guide | (low) | 0 | 0 | 10 |
| period-tracking-guide | (low) | 0 | 0 | 20 |

**Hypothesis:** Both pages start showing GSC impressions within 4-6 weeks as Google re-crawls and the new titles align with searcher intent. Realistic 30-day target: 100+ impressions each. If still zero by 2026-06-19, the content itself may need restructuring (not just titles) — those queries may demand different page formats than what we have.

**Watching:**
- GSC impressions per page (currently 0)
- Whether either page starts ranking for "how to choose birth control" / "how to track your period" / "period tracking for beginners"
- No regression on the 11 evergreen pages whose dateModified was bumped (these are already ranking — freshness signal should help, not hurt)

**Next data check:** 2026-05-19 (same checkpoint).

---

### 2026-05-07 — Cycle-syncing cluster split + app-guide revival
**Commit:** `802189a`

**Audit findings:**

GA4 review of the cycle-syncing cluster found two pages cleanly split by intent but cannibalizing each other in metadata:

- `cycle-syncing-guide.html` (informational, "what to do by phase"): 5 views / 60% bounce over 90 days
- `cycle-syncing-app-guide.html` (commercial, "which app to use"): 1 view / 100% bounce over 90 days — fully zombie

Both titles led with "What to Eat, How to Train" so Google had no reason to rank both. Twitter title on the app-guide didn't match its main title either. App-guide had only 6 inbound internal links vs. 23 for the guide, so it was also half-orphaned. Body of app-guide buried its actual angle (apps vs manual + criteria) ~1,000 words deep, behind a feature-y lead.

**Changes shipped (all to `cycle-syncing-app-guide.html` unless noted):**

1. **De-cannibalization.** Title/meta/OG/Twitter/schema headline + description + articleBody all retargeted to "Best Cycle Syncing Apps for 2026: What to Look For" (buyer intent). The guide page kept its "What to Eat, How to Train & When to Rest (By Phase)" title (informational intent). The two pages now target distinct query clusters.

2. **Playbook applied to page body** (per the 9 patterns above):
   - Quick Answer box at top featuring Go Go Gaia with "best for cycle syncing specifically" superlative, plus Clue/Flo named as alternatives, plus bridge anchor to the guide
   - 5-point "What to Look For" criteria callout immediately after (was buried 1,000+ words deep)
   - Pain-point hero replacing feature-y lead ("It's week 3 of your cycle syncing experiment. You can't remember if you're on Day 19 or Day 21..." vs. previous "Ready to start cycle syncing but overwhelmed... Here's exactly how to use Go Go Gaia...")
   - Transparency callout disclosing iOS-only and newer-product gaps
   - Renamed deeper section "What Makes an Effective Cycle Syncing App" → "How These Capabilities Work in Practice" to avoid H2 dup with new top-of-page criteria
   - Em-dashes scrubbed from new copy per `TONE-OF-VOICE-GUIDE.md`

3. **Bridge anchors both directions with keyword-rich text:**
   - `cycle-syncing-guide.html` → `cycle-syncing-app-guide.html`: bottom CTA anchor changed from "cycle syncing app guide" to "best cycle syncing apps and what to look for in one"
   - `cycle-syncing-app-guide.html` → `cycle-syncing-guide.html`: linked 3× from the new top section ("phase-by-phase cycle syncing guide" anchor)

4. **Freshness signal:** sitemap lastmod and schema dateModified both bumped to 2026-05-07.

**Note on scope:** This page is a hybrid (criteria guide + app pitch), not a strict ranked comparison. The "position GGG 3rd–5th" and "per-app Download lines" patterns from the playbook don't apply directly because there's no numbered app list — the page links out to `clue-vs-flo.html` and the existing comparison pages instead. If app-guide impressions don't lift in 4-6 weeks, the next move is converting it into a true ranked comparison or redirecting to one.

**Baselines (last 90d ending 2026-05-07, web only):**

| Page | Page views (90d) | Bounce rate | Inbound internal links |
|---|---|---|---|
| cycle-syncing-guide | 5 | 60% | 23 |
| cycle-syncing-app-guide | 1 | 100% | 6 |

**Hypothesis:** within 4-6 weeks, app-guide breaks out of the 1-view-per-90-days zombie zone and starts ranking for "cycle syncing app" / "best cycle syncing app" / "what to look for in a cycle syncing app" buyer-intent queries. Realistic 30-day target: 50+ sessions on the app-guide, with the de-cannibalized guide also gaining (no longer splitting query intent with itself). Combined cluster target: 200+ sessions/month within 60 days.

**Watching:**
- GSC impressions and clicks for "cycle syncing app" cluster queries weekly
- GA4 sessions on both pages weekly
- Bounce rate on app-guide (the 100% baseline is the most telling signal — if the new pain-point hero + Quick Answer don't move it under 70%, the title/intent match isn't strong enough)
- No regression on the guide page during Google re-evaluation

**Next data check:** 2026-05-21 (2 weeks out).

**Possible follow-ups if data warrants:**
- Convert app-guide to a ranked comparison if criteria-guide format underperforms
- Add inbound links from `how-to-choose-period-tracker-app.html` (263 views/30d), `best-pregnancy-tracking-app.html` (220 views/30d), `clue-vs-flo.html` (19 views/30d) to lift app-guide's link equity from 6 → 9+

---

### 2026-05-09 — Two-week data check on revival cohort + period reframe baseline

**No commit (data-only checkpoint).** Comparing L14 (2026-04-26 to 2026-05-08) vs P14 (2026-04-12 to 2026-04-25) at the page level, web only.

**What worked:**

| Page | L14 | P14 | Δ | L14 eng | P14 eng |
|---|---|---|---|---|---|
| best-pregnancy-tracking-app | 152 | 73 | **+79 (2.1x)** | 31% | 34% |
| best-perimenopause-tracking-app | 28 | 14 | **+14 (2x)** | 39% | 43% |
| clue-vs-flo | 14 | 4 | **+10 (3.5x)** | 57% | 100% |
| how-to-choose-period-tracker-app | 122 | 108 | +14 (+13%) | 46% | 55% |

Pregnancy and perimenopause comparison pages are the two biggest revival wins. Period comparison traffic is up but engagement dipped 9pp — the May 7 reframe (commit `e8e4b82`) is the bet to fix that and currently has only ~1.5 days of post-change data in this window.

**What didn't or regressed:**

| Page | L14 | P14 | Δ | L14 eng | P14 eng |
|---|---|---|---|---|---|
| best-pcos-tracking-app | 5 | 8 | **−3** | **20%** | **62%** |
| best-fertility-tracking-app | 3 | 1 | +2 | 67% | — |
| best-ivf-tracking-app | 3 | 1 | +2 | 67% | — |
| best-symptom-tracker-app-women | 1 | 1 | 0 | — | 100% |

best-pcos is the only revival that regressed on both traffic and engagement. The other three moved by 0–2 sessions — the freshness + reorder commits did not unlock anything.

**Diagnosis: title pattern correlates with revival success.**

Looking at title length and specificity across the cohort:

| Page | Title chars | Subtitle content | L14 outcome |
|---|---|---|---|
| best-pregnancy | 63 | "Flo vs Ovia vs What to Expect (Tested)" | +79 |
| best-perimenopause | 60 | "Hot Flash & HRT Trackers Tested" | +14 |
| best-pcos | 76 | "7 Apps Compared for Irregular Cycles & Symptoms" | −3 |
| best-ivf | 67 | "6 Apps Compared for Fertility Treatment" | +2 |
| best-fertility | 57 | "8 Apps Compared for TTC" | +2 |
| best-symptom-tracker | 56 | "5 Apps Compared" | 0 |

Both winners stay under Google's ~63-char SERP display limit and name something concrete in the subtitle (competitor brand or specific symptom tested). The four underperformers all use the generic "X Apps Compared for [topic]" pattern and either truncate (PCOS at 76 chars) or fail to differentiate.

The doc's earlier hypothesis (Apr's "playbook" was Quick Answer + pain-point hero + transparency callout) holds, but those structural changes are necessary not sufficient. Page-1-zero-click title rewrites (commit `d972298`, 2026-05-06) appear to be a second mechanism — and the four flat/regressed pages all still have the unrewritten generic titles.

**Title rewrites shipped 2026-05-09** (functionality-not-brands style per founder preference, mirrors perimenopause winner pattern):
- **best-pcos**: "Best PCOS Tracking App 2026: Irregular Cycles & Symptoms" (56 chars)
- **best-fertility**: "Best Fertility App 2026: Ovulation, BBT & Fertile Window" (56 chars; dropped "Tracking" from name to fit)
- **best-ivf**: "Best IVF Tracking App 2026: Medications & Cycle Tracking" (56 chars)
- **best-symptom-tracker**: "Best Symptom Tracker App for Women 2026: Pain, Cycle & Sleep" (60 chars)

H1s left unchanged on all 4 (matches perimenopause pattern: title and H1 decoupled, title for SERP CTR, H1 for on-page expectation-setting). dateModified + sitemap lastmod bumped to 2026-05-09.

**Playbook audit on the 4 rewritten pages** (after title fix):
- ✅ All have: Quick Answer with GGG link, Full Transparency callout, "Other App Comparisons" section, per-app Download lines, healthy inbound link network (8–11 internal pages link to each)
- ❌ None have a hero image (only `best-perimenopause` does — the hormone-levels chart). Adding a topic-relevant chart to each could be the next lever if titles alone don't lift them.

**Hero images shipped 2026-05-09** (mirrors perimenopause winner pattern: chart inserted between H1 and lead paragraph, `class="img-fluid rounded mb-4" loading="eager"`):
- **best-pcos**: `Hormone_Levels_in_PCOS.png` (also replaced og:image and twitter:image, which were a generic journaling stock photo)
- **best-fertility**: `Cycle_Comparison_Ovulatory_vs_Anovulatory.png` (already its og:image)
- **best-symptom-tracker**: `Biometrics_Throughout_Menstrual_Cycle.png` (already its og:image)
- **best-ivf**: deferred — no IVF/fertility-specific stock photo available; needs an Unsplash add before retrying

Stacked with the title rewrites in the same window, so attribution is mixed. Acceptable trade given the underperformer urgency — overall trajectory still tells us if the playbook is working.

**Sample-size caveats:** N is very small (1–8 sessions per page in either window). PCOS regression on n=5 vs n=8 is within statistical noise, and the engagement drop (62% → 20%) is one disengaged session away from looking very different. Treat the title-pattern correlation as directional, not proven — but it is consistent with what already worked on pregnancy and perimenopause.

**Will the wins persist?**
- *Likely persistent*: structural revival changes (perimenopause +14 sessions) that compound from improved rankings, internal links, and freshness signals.
- *Possibly seasonal*: pregnancy's +79-session jump coincides with Mother's Day weekend (May 10–11). Watch for fade in late May.
- *Period comparison engagement*: 9pp drop is the first signal worth watching — if the May 7 reframe does not reverse it by 2026-05-21, the daily-life-connection angle may not be landing.

**Other notable movers:**
- `complete-guide-to-pcos`: 3 → 8 sessions, engagement 33% → 75% (untouched, surprise gainer)
- `what-is-luteal-phase`: 2 → 7 sessions (untouched)
- `pregnancy-wellness-tips`: 4 → 0 sessions (worth a one-off look — was it deindexed?)
- Home + blog index + about all stable or up — no cannibalization detected from comparison page revivals

**Watching:**
- Title-rewrite candidates above — only ship after angle review per page
- Period comparison engagement rate week over week (baseline: 46%)
- best-pcos engagement rate next checkpoint (5-session N too small to act on yet)
- Whether pregnancy comparison fades post-Mother's Day (currently 152 / 14d; pre-revival baseline was ~37 / 14d)
- pregnancy-wellness-tips ranking + indexation status

**Next data check:** 2026-05-21 (2 weeks out — same checkpoint as the cycle-syncing entry).

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
