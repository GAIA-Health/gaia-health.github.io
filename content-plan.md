# Go Go Gaia - Content Gap & Keyword Integration Plan

## Date: February 16, 2026

---

## Progress Summary (Updated Feb 24, 2026)

| Area | Status | Details |
|---|---|---|
| **Quick Fixes** | 2/3 done | FAQPage schema + pricing done. AggregateRating still TODO. |
| **Homepage SEO** | DONE | Title, meta, OG tags, pricing FAQ, 8 new FAQ items w/ show-more UI |
| **Comparison Article** | DONE | Major overhaul — expanded table, verified competitor facts, added fertility/PCOS/IVF/perimenopause, Quick Answer box, TOC, 2026 freshness |
| **Blog Title/Meta Fixes** | 8/21 done | Comparison article + fitness tracker + 6 other posts updated |
| **Blog FAQ Schemas** | DONE | 55+ FAQ schema questions added across 14 blog posts. All posts now have FAQ schemas. |
| **New Articles (11)** | 0/11 started | Publishing schedule not yet begun. Article 5.5 (PCOS infertility/ovulation) added to plan. |
| **Internal Cross-Links** | NOT STARTED | Planned for between-article weeks |
| **AggregateRating Schema** | NOT STARTED | Need real App Store rating data |
| **Content Research Docs** | DONE | `search-questions-content-plan.md` created with 70+ questions across 9 clusters |

> **See `seo-session.md` Section 8** for a detailed change log with before/after for every edit.

---

## Quick Fixes (Do Before Writing Any New Content)

### 1. ~~Add FAQPage Schema to index.html~~ — DONE (Feb 16)

~~You have the FAQ *content* on the homepage already. What's missing is the **JSON-LD schema markup** in the `<head>` that tells Google "this page has FAQ content -- show it as rich results."~~

**Completed:** Added FAQPage JSON-LD schema to `index.html` `<head>` covering all visible FAQ items. Also added 8 new FAQ items behind a "Show More" collapse UI (Bootstrap 5) to increase rich result eligibility.

### 2. Add AggregateRating to Existing MobileApplication Schema — TODO

Your MobileApplication schema is solid but missing `aggregateRating`. Merge it into the existing block in `index.html`. Need actual App Store rating/review count to populate.

### 3. ~~Update Pricing in FAQ~~ — DONE (Feb 16)

~~Add a FAQ item or update the existing "Is there a cost?" answer with specific pricing.~~

**Completed:** Updated the "Is there a cost?" FAQ answer with specific pricing (~$12/month premium). Also added pricing to the comparison article and comparison table.

---

## Current Blog Inventory (21 posts across 5 categories)

| Category | Posts | Count |
|---|---|---|
| **Cycle Tracking** | period-tracking-guide, cycle-syncing-guide, cycle-syncing-app-guide, what-is-luteal-phase, understanding-pms-guide, how-to-tell-if-youre-ovulating, fitness-tracker-cycle-tracking | 7 |
| **Pregnancy & Fertility** | am-i-pregnant-guide, pregnancy-tracking-guide, pregnancy-wellness-tips, postpartum-recovery-guide | 4 |
| **Choosing Tools** | how-to-choose-period-tracker-app, cycle-syncing-app-guide (cross-listed) | 2 |
| **Life Stages** | perimenopause-guide, menopause-guide, complete-guide-to-pcos | 3 |
| **Wellness** | mood-tracking-benefits, habit-tracking-success, new-year-health-resolutions-2026, how-to-track-health-goals-2026, womens-health-habits-january-2026 | 5 |

### What's Missing (Content Gaps)

| Gap | Competitor Coverage | Our Coverage |
|---|---|---|
| Birth control / contraception | Clue: 15+ articles. Flo: full section. | **ZERO** |
| Endometriosis | Clue: 6+ articles. Flo: 6+ articles. | **ZERO** |
| Cycle-phase nutrition (food by phase) | Nobody does it well, but search volume is huge | **ZERO** (cycle syncing mentions food but no dedicated guide) |
| Stopping birth control / post-pill | Flo: 1 article. Clue: nothing. | **ZERO** |
| Hormonal acne / cycle skincare | Flo: basic articles. | **ZERO** |
| Sexual health | Clue: full category. | **ZERO** |
| Hormonal imbalance (general) | Flo: comprehensive. | **ZERO** |
| ADHD + menstrual cycle | Nobody. | **ZERO** (true blue ocean) |

---

## New Content Plan: 10 Articles (Prioritized)

Each article includes: target keywords, blog category, internal links, and CTA strategy.

---

### PRIORITY 1: Biggest Gaps + Highest Volume

#### Article 1: The Complete Guide to Birth Control

- **File:** `blog/birth-control-guide.html`
- **Blog category:** Life Stages & Health Conditions (add new filter pill: "Sexual & Reproductive Health" or keep in Life Stages)
- **Target keywords:**
  - Primary: `birth control options`, `best birth control`, `types of birth control`
  - Secondary: `IUD vs pill`, `birth control side effects`, `hormone-free birth control`, `birth control and period`
  - Long-tail: `birth control that doesn't affect mood`, `best birth control for PCOS`
- **High-intent keyword integration:** Naturally mention that Go Go Gaia tracks how each method affects your cycle, mood, and symptoms -- linking to the app's ability to correlate contraception with side effects
- **Internal links:**
  - Link TO: cycle-syncing-guide, understanding-pms-guide, complete-guide-to-pcos
  - Link FROM (update these existing posts to link to the new article): understanding-pms-guide, complete-guide-to-pcos
- **CTA:** "Track how your birth control affects your cycle, mood, and energy with Go Go Gaia -- free to download"
- **Est. search volume:** 100K+ monthly across the keyword cluster
- **Why:** Single largest content gap. "IUD" alone = 94K/mo. Every user of a period tracker cares about this.

---

#### Article 2: Endometriosis -- Symptoms, Getting Diagnosed, and How to Advocate for Yourself

- **File:** `blog/endometriosis-guide.html`
- **Blog category:** Life Stages & Health Conditions
- **Target keywords:**
  - Primary: `endometriosis symptoms`, `do I have endometriosis`, `endometriosis diagnosis`
  - Secondary: `endometriosis treatment`, `endometriosis pain`, `endometriosis vs PCOS`
  - Long-tail: `how to get diagnosed with endometriosis`, `endometriosis symptom tracker`, `what to tell your doctor about endometriosis`
- **High-intent keyword integration:** Position Go Go Gaia's symptom tracking as the tool for building an evidence-based case for your doctor. Include a "symptom diary checklist" that maps to Go Go Gaia's tracking features.
- **Internal links:**
  - Link TO: complete-guide-to-pcos (endo vs PCOS comparison section), period-tracking-guide, understanding-pms-guide
  - Link FROM: complete-guide-to-pcos (add "Endo vs PCOS" cross-reference)
- **CTA:** "Track your symptoms daily with Go Go Gaia so you can show your doctor patterns, not just memories"
- **Unique angle nobody has:** A practical self-advocacy section -- what to document, what to say to your doctor, when to push for referral. Competitors have clinical overviews. Nobody helps users navigate the average 7-year diagnosis journey.
- **Est. search volume:** 100K+ monthly across cluster

---

#### Article 3: What to Eat in Each Phase of Your Cycle

- **File:** `blog/cycle-phase-nutrition-guide.html`
- **Blog category:** Cycle Tracking & Understanding Your Body
- **Target keywords:**
  - Primary: `cycle syncing diet`, `what to eat during period`, `foods for each cycle phase`
  - Secondary: `luteal phase foods`, `follicular phase diet`, `menstrual phase nutrition`, `ovulation phase foods`
  - Long-tail: `best foods for PMS`, `anti-inflammatory diet menstrual cycle`, `seed cycling for hormones`
- **High-intent keyword integration:** "Use Go Go Gaia's nutrition tracking to log what you eat alongside your cycle phase -- see which foods actually make a difference for YOUR body"
- **Internal links:**
  - Link TO: cycle-syncing-guide, what-is-luteal-phase, understanding-pms-guide, complete-guide-to-pcos
  - Link FROM: cycle-syncing-guide (add "See our complete nutrition-by-phase guide"), what-is-luteal-phase
- **CTA:** "Go Go Gaia is the only app that tracks both your cycle phases AND your nutrition in one place"
- **Content format:** Include a visual phase-by-phase food chart (shareable on Pinterest/Instagram). List specific foods, not just food groups.
- **Est. search volume:** 20-40K/mo, trending up rapidly (doubled since 2022)

---

### PRIORITY 2: Underserved + Differentiating

#### Article 4: What Happens When You Stop Birth Control

- **File:** `blog/stopping-birth-control-guide.html`
- **Blog category:** Life Stages & Health Conditions
- **Target keywords:**
  - Primary: `what happens when you stop birth control`, `stopping the pill side effects`
  - Secondary: `post-birth control syndrome`, `period after stopping birth control`, `how long to get period back after pill`
  - Long-tail: `coming off birth control and trying to conceive`, `acne after stopping birth control`, `mood changes after stopping pill`
- **High-intent keyword integration:** "Use Go Go Gaia to track your body's recovery month by month -- log symptoms, mood changes, cycle irregularity, and skin changes all in one place"
- **Internal links:**
  - Link TO: birth-control-guide, how-to-tell-if-youre-ovulating, am-i-pregnant-guide, period-tracking-guide
  - Link FROM: birth-control-guide (cross-link as companion piece)
- **CTA:** "Starting to track after stopping birth control? Go Go Gaia's correlation insights show you exactly how your body is adjusting"
- **Content format:** Month-by-month timeline (Month 1, Month 2-3, Month 4-6, Month 6-12) with what to expect and what to track at each stage
- **Est. search volume:** 30-50K/mo

---

#### Article 5: Your Skin and Your Cycle -- A Phase-by-Phase Skincare Guide

- **File:** `blog/hormonal-acne-skincare-guide.html`
- **Blog category:** Cycle Tracking & Understanding Your Body
- **Target keywords:**
  - Primary: `hormonal acne`, `period acne`, `hormonal breakouts`
  - Secondary: `skincare routine for hormonal acne`, `cycle phase skincare`, `progesterone acne`
  - Long-tail: `why do I break out before my period`, `best skincare products for luteal phase`, `how to prevent period breakouts`
- **High-intent keyword integration:** "Go Go Gaia tells you what cycle phase you're in -- here's exactly what your skin needs in each one"
- **Internal links:**
  - Link TO: cycle-syncing-guide, what-is-luteal-phase, understanding-pms-guide, complete-guide-to-pcos (PCOS acne section)
  - Link FROM: understanding-pms-guide, complete-guide-to-pcos
- **CTA:** "Track your skin alongside your cycle with Go Go Gaia -- find YOUR breakout triggers"
- **Content format:** Phase-by-phase with specific ingredient recommendations (salicylic acid timing, niacinamide, retinol). Highly shareable on Instagram/TikTok.
- **Est. search volume:** 60K+/mo across cluster

---

### PRIORITY 2.5: Fertility + PCOS Funnel (High Conversion)

#### Article 5.5: PCOS and Infertility — Am I Ovulating? (A Step-by-Step Guide)

- **File:** `blog/pcos-infertility-ovulation-guide.html`
- **Blog category:** Life Stages & Health Conditions (also cross-list in Pregnancy & Fertility)

> **Relationship to existing PCOS guide (`complete-guide-to-pcos.html`):**
> The existing PCOS guide is a **broad overview** — "What is PCOS?" — covering all 4 types, full symptom list, diagnosis criteria, and general management. It mentions fertility in only ~10 lines (3 bullet points under symptoms + 6 lines on fertility meds). **This article is NOT a rewrite.** It's a dedicated deep-dive into one specific journey: "I can't get pregnant — is it PCOS, and am I actually ovulating?" The two pieces serve **different search intents** and **different stages of the user journey:**
>
> | | Existing PCOS Guide | This Article (5.5) |
> |---|---|---|
> | **Search intent** | "What is PCOS?" (informational) | "Why can't I get pregnant?" (diagnostic/problem-solving) |
> | **Fertility coverage** | ~10 lines, one symptom among many | Entire article — the core focus |
> | **Ovulation tracking** | Barely mentioned | Full section: BBT, cervical mucus, OPKs, Gaia automation |
> | **Anovulatory vs ovulatory PCOS** | Not distinguished | Dedicated section explaining the difference |
> | **Treatment for ovulation** | 6 lines listing drug names | Evidence-based walkthrough with tracking guidance |
> | **User journey stage** | Early research ("do I have this?") | Active problem-solving ("what do I do about this?") |
>
> **Writing rule:** Do NOT re-explain "What is PCOS" or re-list all symptoms. Instead, link to the existing guide ("Not sure if you have PCOS? Start with our [Complete Guide to PCOS]"). Focus 100% on the fertility/ovulation funnel.

- **Content concept:** This article follows a natural diagnostic funnel that maps directly to Gaia's features:

  **The User Journey:**
  1. "I'm struggling with infertility — could PCOS be the cause?"
  2. "Do I have PCOS?" → Signs, risk factors, when to get tested
  3. "If yes — am I actually ovulating?" → Anovulatory PCOS explained (the #1 cause of PCOS-related infertility)
  4. "How do I tell if I'm ovulating?" → Signs to track, and **how Gaia does this for you automatically** (BBT, cervical mucus, LH, symptom patterns, wearable data)
  5. "What can I do to potentially improve ovulation?" → Evidence-based lifestyle interventions, medical options, what to track to see if they're working

- **Target keywords:**
  - Primary: `PCOS infertility`, `anovulatory PCOS`, `PCOS not ovulating`, `can you get pregnant with PCOS`
  - Secondary: `how to ovulate with PCOS`, `PCOS ovulation signs`, `PCOS fertility treatment`, `anovulation treatment`
  - Long-tail: `how to tell if you're ovulating with PCOS`, `PCOS infertility what to do`, `can you ovulate with PCOS naturally`, `signs of anovulation`, `ovulation tracker for PCOS`
- **High-intent keyword integration:** This is where Gaia's ovulation tracking becomes the hero. Position the app as the tool that answers "am I even ovulating?" — with automatic phase detection, BBT correlation from wearables (Apple Watch, Oura), symptom pattern recognition, and exportable data for your fertility specialist.
- **Unique angle:** Most PCOS fertility content is either clinical ("here are your treatment options") or emotional ("my journey"). Nobody walks women through the practical diagnostic steps — "here's how to figure out if you're ovulating, here's what to track, here's what the data means, here's when to escalate to a specialist." Gaia is the tool for every step of that.
- **Content structure:**
  1. **"Could PCOS Be Why I Can't Get Pregnant?"** — Quick overview: PCOS is the #1 cause of anovulatory infertility, affecting 70-80% of women with ovulation-related fertility issues
  2. **"Do I Have PCOS?"** — Brief self-assessment checklist (link to full PCOS guide for deep dive)
  3. **"The Ovulation Question: Anovulatory vs Ovulatory PCOS"** — Explain that not all PCOS is the same; some women with PCOS do ovulate (irregularly); anovulatory PCOS means eggs aren't being released
  4. **"How to Tell If You're Actually Ovulating"** — Concrete tracking methods: BBT, cervical mucus, OPK strips, mid-cycle pain, + how Gaia automates this with cycle phase detection and wearable data
  5. **"What Can Help You Ovulate?"** — Evidence-based interventions: weight management (even 5-10% weight loss can restore ovulation), inositol, metformin, letrozole/clomiphene, lifestyle changes, diet (anti-inflammatory, lower glycemic), exercise (but not too intense), stress reduction
  6. **"Track It: How to Know If It's Working"** — What to log in Gaia month over month, what improvement looks like, when to escalate to a reproductive endocrinologist
- **Internal links:**
  - Link TO: complete-guide-to-pcos, how-to-tell-if-youre-ovulating, am-i-pregnant-guide, birth-control-guide (coming off BC + fertility), fitness-tracker-cycle-tracking (wearable ovulation data)
  - Link FROM: complete-guide-to-pcos (add fertility/ovulation section link), how-to-tell-if-youre-ovulating (add "not ovulating? could be PCOS" link)
- **CTA:** "Go Go Gaia tracks your ovulation signs automatically — cycle phases, BBT from your wearable, symptom patterns — so you can see if you're ovulating and share real data with your fertility specialist"
- **Est. search volume:** 30-50K/mo across the cluster ("PCOS infertility" alone ~15K, "can you get pregnant with PCOS" ~20K)
- **Why now:** This sits at the intersection of Gaia's strongest features (ovulation tracking, PCOS support, wearable integration, provider sharing) and a deeply underserved audience. Women in this situation are highly motivated, willing to pay for premium tools, and likely to share content that helps them. Very high conversion potential.
- **Source material:** Feed medical papers on anovulatory PCOS, ovulation induction, and lifestyle interventions to NotebookLM for accurate, citable content.

---

### PRIORITY 3: Blue Ocean (No Competition)

#### Article 6: ADHD and Your Menstrual Cycle

- **File:** `blog/adhd-menstrual-cycle-guide.html`
- **Blog category:** Life Stages & Health Conditions
- **Target keywords:**
  - Primary: `ADHD and menstrual cycle`, `ADHD period`, `hormones and ADHD`
  - Secondary: `ADHD medication and period`, `ADHD worse before period`, `estrogen and ADHD`
  - Long-tail: `why is my ADHD worse during luteal phase`, `ADHD cycle syncing`, `ADHD medication effectiveness period`
- **High-intent keyword integration:** "Track your focus, energy, and medication effectiveness alongside your cycle phases with Go Go Gaia's correlation insights"
- **CTA:** "Go Go Gaia is the first women's health app that lets you see exactly how your cycle affects your ADHD"
- **Why:** ZERO competitors cover this. Growing awareness of ADHD + hormones intersection. Massive social sharing potential. Niche but highly passionate audience.
- **Est. search volume:** 5-15K/mo, growing fast

---

#### Article 7: Hormonal Imbalance in Women -- Signs, Causes, and What to Track

- **File:** `blog/hormonal-imbalance-guide.html`
- **Blog category:** Life Stages & Health Conditions
- **Target keywords:**
  - Primary: `hormonal imbalance symptoms`, `signs of hormonal imbalance`, `hormonal imbalance in women`
  - Secondary: `how to fix hormonal imbalance naturally`, `hormone test results explained`, `hormonal imbalance and weight gain`
  - Long-tail: `hormonal imbalance tracker app`, `understanding your blood test hormone levels`
- **High-intent keyword integration:** This directly ties to Go Go Gaia's **lab results analysis** feature -- a feature NO competitor has
- **Internal links:**
  - Link TO: complete-guide-to-pcos, perimenopause-guide, menopause-guide, birth-control-guide
  - Link FROM: all of the above
- **CTA:** "Upload your lab results to Go Go Gaia and get plain-language insights about your hormone levels"
- **Est. search volume:** 40-60K/mo

---

### PRIORITY 4: Comparison & Switch Content

#### Article 8: Go Go Gaia vs Flo -- Which Women's Health App Is Right for You?

- **File:** `blog/go-go-gaia-vs-flo.html`
- **Blog category:** Choosing Your Tools
- **Target keywords:**
  - Primary: `Flo app alternative`, `Flo app privacy`, `best Flo alternative`
  - Secondary: `period tracker that doesn't sell data`, `private period tracker app`, `Flo app review`
  - Long-tail: `is Flo app safe`, `does Flo sell my data`, `Flo vs other period trackers`
- **Angle:** Fair comparison, but lean into what Gaia does that Flo doesn't (correlation insights, lab results, all-in-one dashboard, nutrition tracking, provider platform). Mention Flo's 2021 FTC privacy settlement factually.
- **CTA:** "Try Go Go Gaia free -- all core features included, no data selling, ever"
- **Est. search volume:** 5-10K/mo (high conversion rate)

---

#### Article 9: Go Go Gaia vs Clue -- Comparing Women's Health Apps

- **File:** `blog/go-go-gaia-vs-clue.html`
- **Blog category:** Choosing Your Tools
- **Target keywords:**
  - Primary: `Clue app alternative`, `Clue vs other period trackers`
  - Secondary: `best period tracker app 2026`, `period tracker with habit tracking`
  - Long-tail: `Clue app missing features`, `all-in-one period tracker vs Clue`
- **Angle:** Acknowledge Clue's science credibility. Show where Gaia goes broader (fitness, nutrition, habits, labs, AI, provider platform).
- **Est. search volume:** 3-5K/mo

---

#### Article 10: The Best Period Tracker for PCOS (2026 Comparison)

- **File:** `blog/best-pcos-tracking-app.html`
- **Blog category:** Choosing Your Tools
- **Target keywords:**
  - Primary: `best PCOS tracking app`, `PCOS tracker app`, `PCOS management app`
  - Secondary: `period tracker for irregular periods`, `best app for PCOS`
  - Long-tail: `app to track PCOS symptoms and diet`, `PCOS symptom diary app`
- **High-intent keyword integration:** Direct download intent. User has PCOS and wants a tool NOW.
- **Internal links:**
  - Link TO: complete-guide-to-pcos, how-to-choose-period-tracker-app
  - Link FROM: complete-guide-to-pcos (add "Find the best PCOS tracking app" link)
- **CTA:** "Go Go Gaia is built for complexity -- track symptoms, nutrition, medications, labs, and see correlations specific to YOUR PCOS"
- **Est. search volume:** 2-5K/mo (very high conversion)

---

### PRIORITY 5: Athletic Training Niche (added 2026-05-06)

A new content cluster targeting athletic training searchers. Most popular running and triathlon training apps don't account for menstrual cycle phases when prescribing training intensity, recovery, or nutrition. Wide-open long-tail opportunity around "X training app for women" queries — no major dedicated player owns this space.

#### Article 11: Best Marathon Training App for Women (2026)

- **File:** `blog/best-marathon-training-app.html`
- **Blog category:** Choosing Your Tools (Athletic)
- **Compare:** Garmin Connect, Nike Run Club, Strava, Runna, Adidas Running, Hal Higdon Mobile, plus Go Go Gaia
- **Target keywords:** "marathon training app women", "best running app for women", "marathon training cycle aware", "running app for women athletes"
- **Angle:** Most apps prescribe training plans without cycle awareness. Go Go Gaia adapts to your phase + integrates wearable data + tracks fueling/sleep/mood. Position as complementary to Strava/Garmin, not a replacement.
- **Est. search volume:** Long-tail head term competitive, but "for women" qualifier is wide open

#### Article 12: Best Cycling Training App for Women (2026)

- **File:** `blog/best-cycling-training-app.html`
- **Compare:** Strava, TrainerRoad, Zwift, Wahoo SYSTM, Rouvy, plus Go Go Gaia
- **Note:** "Cycling" here = bicycle sport, not menstrual cycle. Title clarification needed in copy.
- **Same angle:** cycle-aware training and recovery for women cyclists

#### Article 13: Best Triathlon Training App for Women (2026)

- **File:** `blog/best-triathlon-training-app.html`
- **Compare:** TrainingPeaks, TriDot, MyTriathlonTraining, plus Go Go Gaia
- **Niche but high-intent.** Triathletes are obsessive trackers and willing to pay for premium tools.

#### Possible additions (Article 14+):

- Best Half-Marathon Training App for Women
- Best Strength Training App for Women
- Best Running App for Women (broader umbrella)

#### Pre-build research checklist (DO BEFORE WRITING):

1. **Audit the nutriease iOS app repo** (`Documents/...` — wherever the iOS app code lives) for what's actually built around training functionality. Check `/docs` and the codebase. We need to be specific about what Go Go Gaia *does* with training data (Apple Watch / Garmin / Oura sync, workout phase recommendations, recovery flags, fueling tied to cycle phase) and what it *doesn't* do (no built-in training plans yet, etc.). Don't overpromise features that aren't shipped — that breaks reader trust and Go Go Gaia conversion.
2. **Research the popular training apps for what they lack around women's physiology:**
   - Strava (massive social/segments, basically zero cycle awareness)
   - Garmin Connect (deep wearable integration, basic women's health module that mostly logs periods)
   - Runna (AI coaching, growing fast, no cycle phase awareness yet)
   - TrainingPeaks (gold standard for serious endurance, blank on women's physiology)
   - Zwift (indoor cycling, social-first, no cycle awareness)
   - Nike Run Club (free, social-light, no cycle awareness)
3. **Framing for Go Go Gaia in these comparisons:**
   - "Best for women athletes who want training that adapts to their cycle"
   - "Best comprehensive solution" — not just training, but training + cycle + nutrition + sleep + mood + symptoms in one place
   - Lean into the gap: most training apps treat women athletes as small men. Cycle phase changes performance, recovery needs, and injury risk. Few apps acknowledge this.
4. **Avoid the trap** of positioning Go Go Gaia as a *replacement* for Strava/Garmin. They have things we don't (advanced training plans, social leaderboards, structured workouts, segment leaderboards). Position as complementary: keep using your training app for plans + segments, use Go Go Gaia for the female-physiology layer they're missing.

#### Why this cluster (rationale):

- "marathon training app" head term is competitive but has clear runner-up positions
- "marathon training app for women" is a wide-open long-tail with no major dedicated player
- Aligns with existing audience (we already have cycle/PCOS/perimenopause content; athletic women are a natural overlap)
- Higher LTV audience than general health-curious users (athletes track religiously, more likely to monetize on premium)
- Internal linking opportunity: cycle-syncing-guide already mentions training phase recommendations — these new pages would deepen that cluster

---

## How to Weave High-Intent Keywords Into EXISTING Content

You don't need to only create new content. Updating existing pages with target keywords is often faster and more effective. Here's what to update:

### Homepage (index.html) — DONE (Feb 16)

All three homepage keyword updates completed:

| Item | Status | What Was Done |
|---|---|---|
| Title tag | DONE | Changed to "Go Go Gaia: All-in-One Women's Health App \| Period, Fertility & PCOS Tracker" |
| Meta description | DONE | Updated to include AI, habit tracking, wearable integration keywords |
| Pricing | DONE | Added specific pricing to FAQ answer (~$12/month premium) |

### Existing Blog Posts to Update

#### how-to-choose-period-tracker-app.html — MAJOR OVERHAUL DONE (Feb 16)

This is the site's most important page (37,567 impressions, 77% of all search traffic). Changes made:
- Title/H1 aligned: "Best Period Tracker App 2026: Clue vs Flo vs Ovia (6 Apps Compared)"
- BlogPosting schema updated (headline 2026, dateModified 2026-02-16)
- Added Quick Answer box targeting featured snippets
- Added Table of Contents with anchor links (for SERP sitelinks)
- All competitor facts verified via web research (pricing, features, privacy issues)
- Comparison table expanded from 8 to 17 rows (added mood, sleep, nutrition, AI, wearables, languages, price, fertility, PCOS/IVF, perimenopause)
- Go Go Gaia features expanded to include fertility, PCOS/IVF, perimenopause, Ask Gaia AI (marked as premium), wearable sync, 5 languages
- Privacy section updated with specific facts (Flo $56M class action 2025, Period Tracker/Privacy International)
- Limitations reframed with user-impact language
- **Still TODO:** Cross-link to new comparison posts (vs Flo, vs Clue, best for PCOS) once those are written

#### complete-guide-to-pcos.html — TODO
- **Add keywords:** `best PCOS tracking app`, `PCOS symptom tracker`, `PCOS management app`
- **Add section:** "PCOS vs Endometriosis" (brief comparison, link to new endo guide)
- **Add section:** "PCOS and Fertility: Are You Ovulating?" — This is a **handoff section**, NOT a deep dive. Keep it to 150-200 words max: briefly introduce anovulatory PCOS as the #1 cause of PCOS-related infertility, then link to the dedicated Article 5.5 (`pcos-infertility-ovulation-guide.html`) for the full diagnostic funnel. The PCOS guide's job is to **acknowledge** fertility as a key impact and **route** the reader to the right resource.
- **Add CTA:** link to new best-pcos-tracking-app.html
- **Cross-link to:** hormonal-imbalance-guide, birth-control-guide, pcos-infertility-ovulation-guide (when created)
- **Do NOT expand** the existing fertility bullet points (under symptoms) into a full section — that's what Article 5.5 is for. Keep the PCOS guide as the broad overview.

#### cycle-syncing-guide.html — TODO
- **Add keywords:** `cycle syncing app`, `cycle syncing diet`
- **Add section:** "Cycle syncing nutrition" (brief, link to the new full nutrition guide)
- **Cross-link to:** cycle-phase-nutrition-guide (when created)

#### perimenopause-guide.html + menopause-guide.html — TODO (title/meta updated, content TODO)
- Title/meta updated for menopause-guide (Feb 16): "Menopause Guide 2026: Symptoms, Stages, Timeline & What to Expect"
- perimenopause-guide.html title/meta reviewed — already good, no changes needed
- **Still TODO:** Add keywords `perimenopause tracking app`, `menopause symptom tracker`
- **Still TODO:** Add CTA: "Track your symptoms with Go Go Gaia's perimenopause mode"

#### fitness-tracker-cycle-tracking.html — TITLE/META DONE (Feb 16)
- Title updated to include Apple Watch, Oura Ring, Garmin brand names explicitly
- **Still TODO:** Add body content keywords for `period tracker with Apple Watch`, `women's health app with wearable integration`, `fertility tracker with Oura Ring`

### Additional Blog Title/Meta Fixes Completed (Feb 16)

These posts had title/meta improvements for SEO (see `seo-session.md` Section 8 for before/after):

| Post | Change |
|---|---|
| cycle-syncing-app-guide.html | "2025" → "2026" (stale year fix) |
| postpartum-recovery-guide.html | Removed "\| Go Go Gaia" suffix, added 2026 + "(Week by Week)" |
| how-to-tell-if-youre-ovulating.html | Removed awkward "in 2026", added "5 Signs" for specificity |
| mood-tracking-benefits.html | Added "for Women" + "(Hormones, Cycles & Patterns)" |
| period-tracking-guide.html | Added "Beyond Just Dates (Beginner's Checklist)" |

### Blog Posts Reviewed — No Changes Needed

These 11 posts were reviewed and their titles/metas are already well-optimized:
perimenopause-guide, cycle-syncing-guide, habit-tracking-success, pregnancy-tracking-guide, pregnancy-wellness-tips, complete-guide-to-pcos, new-year-health-resolutions-2026, how-to-track-health-goals-2026, womens-health-habits-january-2026, understanding-pms-guide, am-i-pregnant-guide

---

## Keyword-to-Content Mapping (All 20 High-Intent Keywords)

Where each high-intent keyword should live:

| # | Keyword | Primary Page | Supporting Page(s) |
|---|---------|-------------|-------------------|
| 1 | best period tracker app | how-to-choose-period-tracker-app | homepage, all comparison posts |
| 2 | best fertility app for trying to conceive | how-to-tell-if-youre-ovulating | am-i-pregnant-guide |
| 3 | best pregnancy tracker app | pregnancy-tracking-guide | homepage |
| 4 | ovulation tracker app download | how-to-tell-if-youre-ovulating | cycle-syncing-app-guide |
| 5 | cycle syncing app | cycle-syncing-app-guide | cycle-syncing-guide |
| 6 | Flo app alternative | **NEW: go-go-gaia-vs-flo** | how-to-choose-period-tracker-app |
| 7 | Flo vs Clue | how-to-choose-period-tracker-app | go-go-gaia-vs-flo, go-go-gaia-vs-clue |
| 8 | period tracker that doesn't sell data | **NEW: go-go-gaia-vs-flo** | how-to-choose-period-tracker-app, homepage |
| 9 | best period tracker for irregular periods | **NEW: best-pcos-tracking-app** | complete-guide-to-pcos |
| 10 | best PCOS tracking app | **NEW: best-pcos-tracking-app** | complete-guide-to-pcos |
| 11 | app to track mood and period together | mood-tracking-benefits | homepage |
| 12 | period tracker with Apple Watch | fitness-tracker-cycle-tracking | homepage meta |
| 13 | women's health app with wearable integration | fitness-tracker-cycle-tracking | homepage |
| 14 | all in one women's health tracker app | homepage | how-to-choose-period-tracker-app |
| 15 | habit tracker app for women | habit-tracking-success | homepage |
| 16 | period tracker app for healthcare providers | **NEW landing page or section on about.html** | homepage (professionals section) |
| 17 | fertility tracker with Oura Ring | fitness-tracker-cycle-tracking | how-to-tell-if-youre-ovulating |
| 18 | pregnancy app with symptom tracking | pregnancy-tracking-guide | am-i-pregnant-guide |
| 19 | AI health assistant app for women | homepage | **consider a dedicated "Ask Gaia" blog post** |
| 20 | sleep and period tracker app | mood-tracking-benefits (expand to include sleep) | homepage |
| 21 | PCOS infertility | **NEW: pcos-infertility-ovulation-guide** | complete-guide-to-pcos |
| 22 | anovulatory PCOS | **NEW: pcos-infertility-ovulation-guide** | complete-guide-to-pcos |
| 23 | can you get pregnant with PCOS | **NEW: pcos-infertility-ovulation-guide** | how-to-tell-if-youre-ovulating |
| 24 | how to ovulate with PCOS | **NEW: pcos-infertility-ovulation-guide** | complete-guide-to-pcos, how-to-tell-if-youre-ovulating |
| 25 | PCOS ovulation tracker | **NEW: pcos-infertility-ovulation-guide** | best-pcos-tracking-app, fitness-tracker-cycle-tracking |

---

## New Blog Categories Needed

Your current filter pills: All, Cycle Tracking, Pregnancy & Fertility, Choosing Tools, Life Stages, Wellness

**Add:**
- **"Sexual & Reproductive Health"** -- for birth control guide, stopping birth control, eventually sexual health content
- Or fold birth control articles into "Life Stages & Health Conditions"

**Update "Choosing Tools" to "Comparisons & Reviews"** -- clearer intent, better for the new vs-Flo and vs-Clue posts

---

## Publishing Schedule (Suggested)

| Week | Article | Why First | Status |
|---|---|---|---|
| **Week 1** | Birth Control Complete Guide | Biggest gap, highest volume | NOT STARTED |
| **Week 2** | Endometriosis Guide | Second biggest gap, unique self-advocacy angle | NOT STARTED |
| **Week 3** | Cycle-Phase Nutrition Guide | Trending topic, highly shareable | NOT STARTED |
| **Week 4** | Go Go Gaia vs Flo | Captures switch intent, privacy angle | NOT STARTED |
| **Week 5** | PCOS & Infertility — Am I Ovulating? (Art. 5.5) | High conversion, complements existing PCOS guide, maps to Gaia's ovulation features | NOT STARTED |
| **Week 6** | Stopping Birth Control Timeline | Companion to birth control guide | NOT STARTED |
| **Week 7** | Hormonal Acne Skincare Guide | Social-shareable, bridges health + lifestyle | NOT STARTED |
| **Week 8** | Best PCOS Tracking App | Direct conversion, builds on existing PCOS post + Article 5.5 | NOT STARTED |
| **Week 9** | Hormonal Imbalance Guide | Ties to unique lab results feature | NOT STARTED |
| **Week 10** | Go Go Gaia vs Clue | Captures comparison searches | NOT STARTED |
| **Week 11** | ADHD + Menstrual Cycle | Blue ocean, zero competition | NOT STARTED |

**Between articles:** Update 2-3 existing posts per week with keyword additions and cross-links (see "How to Weave Keywords Into Existing Content" above). None started yet.

---

## Template Checklist for Every New Blog Post

Based on your PCOS post (good template to follow):

- [ ] `<title>` contains primary keyword + year (2026)
- [ ] Meta description under 160 chars, contains primary + secondary keyword
- [ ] Canonical URL set
- [ ] Open Graph tags (title, description, type=article, image, published_time)
- [ ] Twitter Card tags
- [ ] Pinterest meta tags (if visual content)
- [ ] BlogPosting JSON-LD schema
- [ ] FAQPage JSON-LD schema (add 3-5 FAQs to every post for rich results)
- [ ] Internal links to 2-3 related existing posts
- [ ] Internal links FROM 2-3 existing posts back to new post
- [ ] CTA to download Go Go Gaia (specific to the article topic)
- [ ] "Track this with Go Go Gaia" callout box showing how the app specifically helps with this topic
- [ ] Shareable visual/chart (for Pinterest, Instagram, TikTok)

---

## Pricing Integration Plan — PARTIALLY DONE

**What's been done (Feb 16):**
1. Homepage FAQ answer updated with specific pricing (~$12/month premium) — DONE
2. Comparison article includes Go Go Gaia pricing in table and features section — DONE

**Still TODO:**
1. Add `priceSpecification` to MobileApplication schema `offers` block for premium tier
2. Ensure every future comparison blog post mentions "Go Go Gaia is free with premium at ~$12/mo"

---

## Summary: What This Plan Produces

| Metric | Before (Feb 16 start) | Current (Feb 24) | Target (11 weeks) |
|---|---|---|---|
| Total blog posts | 21 | 21 (no new posts yet) | 32 |
| Content categories covered | 5 | 5 | 6-7 |
| High-intent keywords targeted | ~5 (accidental) | ~17 (via title/meta fixes + comparison article + FAQ schemas) | 25 (intentional) |
| Competitor comparison posts | 1 (generic) | 1 (significantly improved) | 4 (targeted) |
| Health condition guides | 1 (PCOS) | 1 (PCOS) | 5 (PCOS overview, PCOS fertility, endo, hormonal imbalance, ADHD) |
| FAQ schema coverage | Homepage + 2 posts | All 21 blog posts (55+ questions added Feb 24) | All 32 posts |
| Internal cross-links | Sparse | Sparse (not yet addressed) | Dense network |
| Schema coverage | Homepage only | Homepage + all blog posts (FAQPage + BlogPosting) | Full coverage |
| Pricing visibility | Hidden | FAQ + comparison article | FAQ + schema + every comparison post |
| Blog title/meta optimization | Unoptimized | 8/21 posts improved | All 32 posts optimized |
| Comparison article (key page) | Basic, some outdated facts | Fully overhauled, 17-row table, verified facts, featured-snippet-ready | Maintained with fresh data |
