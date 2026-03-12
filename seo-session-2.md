# Go Go Gaia - SEO Session 2: GSC Analysis & Meta Tag Optimization

## Session Date: March 11, 2026

**Data source:** Google Search Console export (last 3 months: Dec 10, 2025 – Mar 9, 2026)
**Export location:** `/Users/abbyholland/Downloads/go-go-gaia.com-Performance-on-Search-2026-03-11/`

---

## 0. Google Search Console Analysis (Last 3 Months)

### The Big Picture (vs. Session 1)

| Metric | Session 1 (Feb 16) | Session 2 (Mar 11) | Change |
|---|---|---|---|
| Total clicks | 177 | 283 | +60% |
| Total impressions | 48,539 | ~89,500 | +84% |
| Average CTR | 0.36% | 0.32% | -0.04pp (more impressions diluting CTR) |
| Average position | 9.7 | ~8 | Improved ~1.7 positions |

**Impressions are growing fast:** ~100/day in Dec → ~2,500/day in early March.
**CTR is still the #1 problem.** We're showing up but not getting clicked.

### Traffic Trend (Daily)

| Period | Avg Daily Impressions | Avg Daily Clicks |
|---|---|---|
| Dec 10-31 | ~175 | ~1.1 |
| Jan 1-31 | ~770 | ~2.5 |
| Feb 1-28 | ~1,170 | ~3.8 |
| Mar 1-9 | ~2,300 | ~5.4 |

Impressions are accelerating — nearly doubled each month. Clicks are growing too but CTR hasn't kept pace.

---

## 1. Top Pages Performance

| Page | Clicks | Impressions | CTR | Avg Position |
|---|---|---|---|---|
| how-to-choose-period-tracker-app.html | 124 | 73,692 | 0.17% | 7.2 |
| Homepage (/) | 88 | 3,243 | 2.71% | 9.4 |
| complete-guide-to-pcos.html | 27 | 2,183 | 1.24% | 7.6 |
| how-to-tell-if-youre-ovulating.html | 8 | 1,984 | 0.40% | 44.2 |
| habit-tracking-success.html | 15 | 1,821 | 0.82% | 10.4 |
| cycle-syncing-guide.html | 3 | 1,353 | 0.22% | 11.8 |
| perimenopause-guide.html | 5 | 1,171 | 0.43% | 8.4 |
| wrapped.html | 7 | 799 | 0.88% | 6.9 |
| pregnancy-tracking-guide.html | 1 | 771 | 0.13% | 9.3 |
| fitness-tracker-cycle-tracking.html | 1 | 718 | 0.14% | 8.5 |
| what-is-luteal-phase.html | 1 | 691 | 0.14% | 29.8 |
| new-year-health-resolutions-2026.html | 1 | 590 | 0.17% | 14.2 |

### Key Observations

**Comparison post still dominates:** 73,692 impressions (82% of total), up from 37,567 in Session 1. Nearly doubled. Position improved from 8.19 to 7.2. But CTR is still terrible at 0.17% (was 0.15%).

**Homepage performing well:** 2.71% CTR is healthy for position 9.4.

**PCOS guide emerging:** 2,183 impressions, 1.24% CTR, position 7.6 — this is getting real traction.

**Ovulation guide problem:** 1,984 impressions but position 44.2 — needs content depth work, not meta fixes.

**4 underperforming pages (low CTR relative to position):**
- cycle-syncing-guide: pos 11.8, 0.22% CTR
- perimenopause-guide: pos 8.4, 0.43% CTR
- fitness-tracker-cycle-tracking: pos 8.5, 0.14% CTR (1 click from 718 impressions!)
- pregnancy-tracking-guide: pos 9.3, 0.13% CTR (1 click from 771 impressions!)

---

## 2. Top Queries

### Branded Queries

| Query | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| go go gaia | 37 | 72 | 51.39% | 1 |
| go gaia | 0 | 295 | 0% | 8.82 |
| go/gaia | 0 | 282 | 0% | 6.84 |
| gogaia | 0 | 150 | 0% | 8.21 |

**Problem:** "go go gaia" (exact brand) works great at 51% CTR. But "go gaia" (295 impressions) and "gogaia" (150 impressions) get **zero clicks** at positions 7-9. These are likely hitting other brands or confusing results.

### Comparison Queries (High Impressions)

| Query | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| clue vs flo | 8 | 588 | 1.36% | 6.81 |
| flo vs clue | 4 | 547 | 0.73% | 8.24 |
| best period tracking apps 2026 | 0 | 398 | 0% | 6.48 |
| clue vs flo app | 5 | 277 | 1.81% | 5.79 |
| best period tracking apps features comparison | 0 | 211 | 0% | 7.75 |
| best fertility tracking apps 2026 | 0 | 188 | 0% | 6.24 |
| best period tracker apps 2026 | 0 | 136 | 0% | 6.73 |
| is clue or flo better | 1 | 120 | 0.83% | 3.93 |
| is flo or clue better | 2 | 115 | 1.74% | 2.49 |

**Notable:** "best period tracking apps 2026" — 398 impressions, position 6.48, ZERO clicks. And "best fertility tracking apps 2026" — 188 impressions, position 6.24, ZERO clicks (no dedicated fertility comparison page exists).

### Condition-Specific Queries

| Query | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| ha recovery | 0 | 92 | 0% | 1 |
| perimenopause | 1 | 16 | 6.25% | 3.75 |
| best femtech app for perimenopause symptoms: clue vs flo | 0 | 105 | 0% | 4.82 |
| best period tracker for perimenopause hot flash tracking | 0 | 91 | 0% | 1.71 |

**50+ perimenopause/menopause comparison queries** with zero clicks — clear signal we need a dedicated perimenopause app comparison page.

---

## 3. Fragment URL Investigation

Google Search Console reported fragment URLs for the comparison post with separate impression counts:

| Fragment URL | Impressions | Clicks | Position |
|---|---|---|---|
| #step-2 | 1,385 | 0 | 4.78 |
| #comparison-table | 1,367 | 0 | 4.76 |
| #step-3 | 1,361 | 0 | 4.76 |
| #step-1 | 891 | 0 | 4.62 |

**Investigation result:** Fragments are NOT in the sitemap and no internal links point to them. This is normal GSC reporting behavior — Google is breaking out sitelink-level data from the main result. These fragments are likely auto-generated sitelinks that Google shows below the main search result. The 0 clicks is expected (users click the main result, not sitelinks). **No fix needed.**

---

## 4. Device Breakdown

| Device | Clicks | Impressions | CTR |
|---|---|---|---|
| Mobile | 181 | 32,486 | 0.56% |
| Desktop | 101 | 54,145 | 0.19% |
| Tablet | 1 | 2,921 | 0.03% |

**Mobile gets 3x the CTR of desktop** (0.56% vs 0.19%). Makes sense for an iOS app. Desktop has far more impressions but much lower CTR — people browsing on desktop are less likely to click through to an app download page.

---

## 5. Geographic Breakdown (Top 10)

| Country | Clicks | Impressions | CTR |
|---|---|---|---|
| United States | 75 | 31,200 | 0.24% |
| United Kingdom | 23 | 8,096 | 0.28% |
| Canada | 18 | 1,950 | 0.92% |
| India | 15 | 3,388 | 0.44% |
| Mexico | 8 | 1,354 | 0.59% |
| Australia | 8 | 1,062 | 0.75% |
| New Zealand | 8 | 323 | 2.48% |
| Philippines | 7 | 1,067 | 0.66% |
| Spain | 6 | 1,672 | 0.36% |
| South Africa | 6 | 800 | 0.75% |

**US still dominates** (75 clicks, 31K impressions) but CTR is low at 0.24%. Canada and New Zealand show much higher CTR — smaller markets but more engaged.

**Translated results:** 29 clicks, 567 impressions, 5.11% CTR — translated content is converting well.

---

## 6. Changes Since Session 1 (Feb 16 – Mar 11)

### Changes Made Between Sessions (by other commits)

| Date | Commit | What Changed |
|---|---|---|
| Feb 16 | e326b5f | Homepage SEO meta tags, FAQPage schema, expanded FAQ section |
| Feb 16 | f725cc7 | ~50 internal cross-links across 20 blog posts |
| Feb 16 | 862c424 | Birth control guide added |
| Feb 24 | 0f60de8 | Meta tag repairs on 6 de-indexed blog pages, sitemap update |
| Feb 24 | ce81c4c | Homepage design, hero highlight, tone of voice copy |
| Feb 24 | 621f085 | Blog templates and FAQ schemas updated |
| Feb 24 | Multiple | Homepage redesign (typography, visual polish, layout) |
| Mar 9 | a198cec | App screenshots replaced with current UI |

### Impact Assessment

The Feb 16 changes (meta tag overhaul, FAQ schema, internal links) have had ~3 weeks to take effect. Results:
- Impressions nearly doubled (48K → 89K)
- Average position improved by ~1.7 positions
- Clicks up 60%
- CTR slightly down (-0.04pp) but this is expected when impressions grow faster than clicks — you're appearing for more queries at lower positions

**The meta tag and schema changes are working.** Google is showing the site for more queries and at better positions. The next lever is CTR — getting more of those impressions to become clicks.

---

## 7. Changes Made in This Session (March 11, 2026)

### Meta Tag Updates: 4 Underperforming Blog Pages

These pages had good positions (page 1 or close) but abnormally low CTR, indicating the SERP snippet wasn't compelling enough.

#### cycle-syncing-guide.html

| Element | Before | After | Why |
|---|---|---|---|
| Title | Cycle Syncing Guide 2026: How to Sync Your Life with Your Hormones | **Cycle Syncing: What to Eat, How to Train & When to Rest (By Phase)** | Dropped generic "Guide 2026" format. New title is action-oriented with specifics — matches what people actually want to know |
| Meta description | Learn cycle syncing: what to eat, how to exercise, and when to schedule tasks for each menstrual phase. Complete guide with tracking tips + app recommendations. | **Your hormones shift every week — your routine should too. Here's exactly what to eat, how to exercise, and when to rest in each phase of your menstrual cycle.** | Starts with a relatable insight instead of "Learn..." — creates a reason to click |
| OG title | (matched old title) | Updated to match new title | Consistency |
| OG description | (matched old desc) | Updated to match new description | Consistency |
| Twitter title | (matched old title) | Updated to match new title | Consistency |
| Twitter description | (matched old desc) | Updated to match new description | Consistency |
| Schema headline | Cycle Syncing Guide 2026: How to Sync Your Life with Your Hormones | Updated to match new title | Consistency |
| Schema description | Learn how to work WITH your menstrual cycle to boost energy, mood, and productivity: with specific meal plans, workouts, and schedules for each phase. | Updated to match new meta description | Consistency |

#### perimenopause-guide.html

| Element | Before | After | Why |
|---|---|---|---|
| Title | Perimenopause Guide 2026: Symptoms, Timeline & What to Expect | **How to Survive Perimenopause: Symptoms, What to Expect & What Actually Helps** | "Survive" is more relatable and emotional — matches how women actually search when they're going through it. Dropped generic "Guide 2026" format |
| Meta description | Perimenopause symptoms: irregular periods, hot flashes, brain fog, mood changes. Learn when it starts, how long it lasts, and science-backed relief strategies. | **Hot flashes, brain fog, irregular periods, mood swings — if this sounds like you, it might be perimenopause. Here's when it starts, what's normal, and what actually helps.** | Opens with validation ("if this sounds like you") instead of a clinical list. Creates connection. |
| OG/Twitter/Schema | (matched old) | All updated to match new title and description | Consistency |

#### fitness-tracker-cycle-tracking.html

| Element | Before | After | Why |
|---|---|---|---|
| Title | Period Tracking with Apple Watch, Oura Ring & Garmin: What Your Data Means | **Apple Watch, Oura Ring & Garmin Cycle Tracking: What Your HRV and Temp Data Mean** | Front-loads device brand names (what people search), adds specific metrics (HRV, Temp) for more precise match |
| Meta description | How to use Apple Watch, Oura Ring, or Garmin for period and cycle tracking. What HRV, temperature, and heart rate changes mean for each cycle phase, and how to train smarter. | **Your wearable already tracks HRV, temperature, and heart rate — but what do those numbers mean for your cycle? How to read your data and train smarter each phase.** | Reframes from instructional ("How to use...") to curiosity ("what do those numbers mean?"). Creates a question the reader wants answered. |
| OG/Twitter/Schema | (matched old) | All updated to match new title and description | Consistency |

#### pregnancy-tracking-guide.html

| Element | Before | After | Why |
|---|---|---|---|
| Title | Pregnancy Tracking Guide 2026: What to Track Each Trimester | **What to Track During Pregnancy: A Trimester-by-Trimester Checklist** | "Checklist" implies actionable, downloadable value. More specific than "Guide." Drops "2026" (evergreen topic). |
| Meta description | Complete pregnancy tracking guide: symptoms, weight gain, baby kicks, appointments. Week-by-week checklist for each trimester + best pregnancy tracking apps. | **Symptoms, weight, kick counts, appointments — pregnancy tracking feels overwhelming. Here's a simple week-by-week checklist for each trimester, plus the best apps to help.** | Validates the feeling of overwhelm, then offers the solution. More empathetic opening. |
| OG/Twitter/Schema | (matched old) | All updated to match new title and description | Consistency |
| Schema description | Comprehensive guide to tracking your pregnancy—from first trimester symptoms to third trimester kick counts. Learn what to monitor, when to call your doctor, and how tracking can empower your prenatal care. | Updated to match new meta description | Also removed forbidden word "empower" per tone of voice guide |

---

## 8. New Content Planning (Comparison Post Series)

Created comprehensive planning doc at `docs/COMPARISON-POSTS-PLAN.md` covering 5 new comparison blog posts:

| # | Post | File | Target Keywords | Est. Volume | Status |
|---|---|---|---|---|---|
| 1 | Best PCOS Tracking App (2026) | best-pcos-tracking-app.html | best PCOS tracking app, PCOS management app | 2-5K/mo | Planned |
| 2 | Best Perimenopause Tracking App (2026) | best-perimenopause-tracking-app.html | best perimenopause app, menopause tracker app | 1-3K/mo | Planned |
| 3 | Best Fertility & IVF Tracking App (2026) | best-fertility-ivf-tracking-app.html | best fertility tracking app, IVF tracker app | 5-10K/mo | Planned |
| 4 | Best Symptom Tracker for Women (2026) | best-symptom-tracker-app-women.html | best symptom tracker app women, health tracker app women | 3-8K/mo | Planned |
| 5 | Best Pregnancy Tracking App (2026) | best-pregnancy-tracking-app.html | best pregnancy app, pregnancy tracker comparison | 10-20K/mo | Planned |

Each post includes:
- Detailed competitor research (pros/cons from real 2025-2026 reviews)
- Condition-specific comparison table rows
- Balanced Go Go Gaia positioning (honest about limitations)
- Cross-link plans to/from existing content
- Full technical SEO checklist

**Rationale:** The period tracker comparison post (73K impressions) proves the format. Condition-specific comparisons target higher-intent, lower-competition queries. We're already ranking for 50+ perimenopause comparison queries with zero clicks because no dedicated page exists.

---

## 9. What to Watch For

### Next 2-4 weeks (meta tag changes)
- **cycle-syncing-guide.html:** Currently pos 11.8 — watch for movement toward page 1. CTR should improve from 0.22%.
- **perimenopause-guide.html:** Currently pos 8.4 — "survive" framing should improve CTR from 0.43%.
- **fitness-tracker-cycle-tracking.html:** Currently pos 8.5, 0.14% CTR — this has the most room to improve.
- **pregnancy-tracking-guide.html:** Currently pos 9.3, 0.13% CTR — "checklist" framing should attract more clicks.

### Longer term (comparison posts)
- Once published, the perimenopause comparison post should immediately capture the 50+ queries currently landing on the general comparison post with zero clicks.
- The fertility comparison post should capture "best fertility tracking apps 2026" (188 impressions, 0 clicks).
- Each comparison post should cross-link to the existing general comparison post, strengthening its authority.

### Warning signs
- If CTR drops further on any page after title change, the new title may not be matching search intent — revert or iterate.
- Short ranking dips (1-2 weeks) after title changes are normal as Google re-evaluates. Sustained drops beyond 3 weeks warrant investigation.
- Watch for cannibalization between the general comparison post and the new condition-specific posts — they should target different keyword clusters, not compete for the same queries.

---

## 10. Remaining TODO from Session 1

| Item | Status | Notes |
|---|---|---|
| AggregateRating schema | NOT STARTED | Still need real App Store rating data |
| New articles (11 from content plan) | 0/11 started | Birth control guide was added (Feb 16), but 10 remaining |
| Internal cross-links | PARTIALLY DONE | 50 cross-links added Feb 16. More needed as new posts publish. |
| Existing post keyword updates | NOT STARTED | PCOS guide, cycle-syncing guide, perimenopause guide still need body content keyword additions |
| Comparison post series (5 posts) | PLANNED | Planning doc created. Writing not started. |
