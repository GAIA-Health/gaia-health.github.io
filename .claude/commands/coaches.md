---
description: Load B2B coach-channel context for Go Go Gaia — the pro/coach SEO cluster, the /for-professionals/ funnel, web-app pro signup/onboarding facts, and measurement wiring — so a new thread can pick up coach-acquisition work immediately.
---

# Coaches / B2B Channel Loader

Read these, then report current status + what's next:

1. `docs/SEO-PRO-CLUSTER.md` — the strategy + enumerated build list (what's shipped, what's queued).
2. `for-professionals/index.html` — the pillar page (pitch, FAQ, schema, blog strip). Source of truth for all public claims about the coach portal — never claim beyond it without verifying in the web-app repo.
3. The repo TODO file's In flight entry for "Pro/coach SEO cluster".

## Standing facts (verified 2026-08-25 — re-verify in code before repeating publicly)

**The funnel:** `/for-professionals/` (pillar) → `https://app.go-go-gaia.com/pro/signup` (UTM'd per page). Web app repo: `~/Desktop/abby/webdev/gaia-web-app`.

**Pro signup is a dedicated flow** (`src/app/pro/signup/page.tsx`): two-step wizard (professional type, display name, specialty, HIPAA/BAA consent → email/Google SSO), skips consumer onboarding, lands at `/coaching`. Empty-state dashboard (`GettingStartedCard`) shows the coach's `PRO-XXXXXX` invite code + email/SMS/WhatsApp share links; clients join via `/join/<code>`.

**Pricing/caps:** free tier = 3 clients (enforced: `maxClients` default 3, cap banners, join-side limit error). Paid Pro tier = 20 clients via Stripe checkout — BUT `NEXT_PUBLIC_FEATURE_PRO_BILLING` defaults OFF, so capped coaches currently see a warning with no upgrade CTA. Clinic tier = mailto, deliberately not self-serve. No public pricing page for paid tiers yet.

**Measurement:** GA4 events `pro_page_view` + `pro_cta_click` (fired by `analytics-events.js` on `a.pro-cta-link`); signup attribution via UTMs (`utm_campaign=for-professionals`, `utm_source=<page slug>`). LinkedIn DM link: `https://www.go-go-gaia.com/for-professionals/?utm_source=linkedin&utm_medium=dm`. Baseline before the cluster: 6 sessions/60d, 1 CTA click.

**Shipped content (waves 1-2, Aug 25 2026, commits 76b8596 + 8f8caf9):**
- `blog/coaching-clients-around-their-cycle.html` (trainer wedge)
- `blog/can-my-trainer-see-my-cycle-data.html` (client-side Q&A, answer-first)
- `blog/truecoach-vs-trainerize.html` (third-party vs-page)
- `blog/trainerize-alternatives.html` (alternatives page, methodology block)
- `blog/best-client-tracking-apps-for-coaches.html` (listicle, methodology + disclosure)
- Pillar upgrades: FAQ + FAQPage/SoftwareApplication schema + blog strip.

**Queued articles** (outlines in the plan doc): client-check-ins-without-spreadsheets, how-coaches-use-wearable-data, health-coach-client-tracking.

## Product-truth gaps (verified in gaia-web-app code 2026-08-25 — recheck before repeating marketing claims)

The coach data views are REAL and cloud-fed (iOS/HealthKit → backend → consent-gated portal: cycle, sleep, workouts, habits, vitals, nutrition, symptoms, meds, coach notes/flags, per-client readiness scores on the roster). Status of the three gaps found 2026-08-25:
1. **Labs**: FIXED in NutriEase_BackEnd (uncommitted as of Aug 25) — real cause was missing testResults keys in `HEALTH_METRICS_CATEGORIES` of `_create_professional_shares`, not the frontend-suggested SIMPLE_MAPPING line (already present, ineffective). Ships with tests + a dry-run backfill script for pre-existing grants. Labs claims are honest once deployed + backfilled.
2. **Program creation**: FIXED in gaia-web-app (uncommitted) — `CreateProgramModal` wired to `createClientProgram`; coaches can now assign a new program a client sees. Coaches still cannot EDIT inside an existing program (PrescriptionBuilder stays deliberately disabled) — copy says "assign her next block", never "edit/swap her program".
3. **Compliance**: still not real (`ComplianceDashboard` mock-only; no missed-check-in or compliance-dip flags anywhere; auto symptom-spike flags exist only on the client detail page, not roster/dashboard). Marketing copy softened accordingly in 2eb219b — never write compliance/missed-check-in flag claims. Honest roster hooks: readiness scores + coach-raised flags.
4. **Fertility/phase (added Aug 25, uncommitted both repos)**: coach phase display had been dead in prod forever (shared cycle-records endpoint sent no phase). Now: backend sends `current_phase` (5-value)/`current_phase_classic`/`is_fertile_window` on shared cycle-records + new pro `GET /users/{u}/fertility-window` route (cycle-grant-gated, detailed-only); webapp has `FertilitySectionCard` (BBT trend, OPK, cervical mucus, confirmed ovulation, prediction block) + 5-phase CycleCard with fertile-window badge. "Fertile" is a window OVERLAY, not a phase enum (backend `phase_model=6` is opt-in, unused by web). Once deployed, the hormone/fertility-coach pitch is fully honest.
Adjacent known backend bug (unfixed): `share_all` shortcut in `update_connection_sharing` omits `lab_results` and `conditions`.

## Rules for this channel

- Comparison content stays generous to TrueCoach/Trainerize/Everfit/PT Distinction — scope difference does the selling; competitor facts get verified against official sites with an as-of date, every wave.
- No superlatives, no medical advice, no head-term listicles; niche listicles must carry How-We-Picked + ownership-disclosure blocks.
- Blog CTAs on coach content = ONE `pro-cta-link` closing anchor to pro signup; never App Store CTAs.
- New coach pages get: sitemap + blog index + llms.txt entries, pillar blog-strip consideration, 3+ internal links, bidirectional backlinks, blog-review before commit.
