---
description: Load Veya's fundraising CRM — the Notion Investor Pipeline + Contacts CRM — to find who needs a follow-up, who can intro whom, and to add or update investors and connectors. Use when working on fundraising, investors, warm intros, connectors, or "who do I need to get back to".
---

# Fundraising CRM for Veya

You're helping Abby (founder) run her raise. Veya = women's hormonal health, but pitched as a **data/AI company first**: an AI physiology foundation model + a proprietary longitudinal dataset. Fundraising and product-roadmap details live in memory, not in this public repo.

**Never send, draft, react to, or mark-read anything** in Beeper, Gmail, or LinkedIn unless Abby explicitly asks for that specific message. Reading is fine. When she asks "who do I owe", you report; she sends.

## 1. The two databases (Notion → GO GO GAIA / SF 2026 / Fundraising / Pipeline & CRM)

**Investor Pipeline**: data source `collection://56998a45-864b-40a1-96cd-1bed60bf1836`. One row per fund or angel (~675 rows). Title = "Investor / Fund".
- Ours (Abby's calls; only change when she asks): Status, Priority, Connectors, Next Step, Notes, Target $, Committed $, Wired $, Follow-up Date, Pass Reason, Deck Link, Last Contact, Warm Intro Path.
- Research (fill when empty; **never overwrite** a non-empty value): Thesis Fit, Past Investments, Outreach Angle, Contact, Lead / Follow, Check Size, Usual Raise Size, Stage Focus, Location, Reputation, Latest Fund Info/Date, Email (only if publicly listed on the fund's own site), Field Portfolio, Competitor Conflict (Direct / Adjacent / None known).
- Relation **Intro Via** ← Contacts CRM (who can intro us).
- Views: "SF / Bay Area" (use it first for in-person meetings).

**Contacts CRM**: page `d226b1da8bd048fbaaba0c3429124534`. One row per person (connectors, founders, advisors, and investors-who-also-connect).
- Key fields: Type, Company, Role / Title, How You Know Them, Relationship Strength (Close/Warm/New/Cold), Last Contact, Next Step, Channels, Intros Offered, Source, Notes.
- **Intro Targets** → Investor Pipeline (two-way; the reverse is Intro Via). "Can Intro To" is the old free-text field, so keep it but prefer the relation.
- Views: "Super-connectors" (sorted by Intro Count), "SF / Bay Area", "Intro Sources".
- **Wave = who we WANT, not who we can reach** (Abby, Oct 1 2026): Wave 1 = Fit Evidence Strong or **Abby's Pick** (Top choice = wanted lead: Halogen, Pivotal, Serena; Must meet). Wave 2 = Moderate; Wave 3 = brand-only. Reachability lives in **Hops** (1 = knows them, 2 = a Close/Warm contact or co-investor path, blank = needs a path). **Score** ranks within waves. Simon Bachmann (IDUN) = use-sparingly connector.
- **One row per person, never both** (Abby's rule, Oct 1 2026). Anyone who writes checks (angel, or a fund where we know the partner) lives only in the Pipeline, titled like "Panache Ventures (Sarah)"; everyone else lives only in Contacts, with **Firm** → their pipeline firm (reverse: **People**). Who-they-are context goes in the Pipeline's **How You Know Them** field, not Notes.

Notion's SQL query mode can hit a usage cap. If it does, fall back to the views, `notion-search`, and `notion-fetch`.

## 2. Default run ("/crm" with no args): the follow-up queue

Pull and report, shortest-first:
1. **We owe a reply**: rows (either DB) whose Next Step says reply/follow up/send deck, or Follow-up Date ≤ today. If Beeper/Gmail are connected, check the last message in the thread to confirm who spoke last.
2. **They owe us / gone quiet**: Status in Intro requested / Met / In diligence with Last Contact > 14 days ago.
3. **Warm intros ready to ask for**: Tier 1 rows with a non-empty Intro Via, and Status still Not started or Researching. Group by connector, so Abby can make one ask per connector.
4. **In SF this week**: Tier 1–2 in the SF / Bay Area view with no meeting yet.

Keep it to a short list: name, one line on why, and the one action. No dumps.

## 3. Adding or updating

- **New investor**: dedup first. Search the title for the fund name, the partner name, and variants like "Fund (Partner)", "Partner (Fund)", and suffix changes. Then create with Status "Not started", Priority with the reason in Notes, and sourced research fields only.
- **Priority rubric**: Tier 1 = led, co-led, or repeat-backed a pre-seed/seed/A in at-home hormone testing, women's health, or health/bio foundation models in the last ~24 months, and invests at seed. Tier 2 = participated, older lead, or strong thesis. Tier 3 = no sourced deal, or growth-stage only. **Connector rule (Abby, Oct 1 2026): Tier 1 also = strong connectors.** Promote a Tier 2/3 to Tier 1 when Co-invested With links it to ≥4 Tier 1 targets across ≥2 distinct shared deals (not one syndicate round); note it in Notes. **SF/Bay Area = +1 tier**, but never promote growth-only funds (CapitalG, IVP, NEA, etc.) to Tier 1.
- **Competitor backers**: Direct = backed an at-home hormone, urine, saliva, or wearable-hormone tester (Hormona, Inito, Oova, Mira, Proov, Vivoo, Eli Health, Clair, Level Zero, Evvy). Treat these as a conflict to flag **and** as a thesis signal, not an automatic pass.
- **Canada-mandate funds** (BDC, MaRS IAF, Anges Québec, etc.): note "check eligibility post-US incorporation".
- **New connector**: Contacts CRM row + Intro Targets links. Set Relationship Strength only from evidence.
- **Research rule**: every Past Investments claim needs a real source (fund site, press release, TechCrunch/Fierce/etc.). If you can't verify it, leave it blank. Label anything that came from Abby as "per Abby".

## 4. Finding warm paths

- **Beeper** (LinkedIn DMs, WhatsApp, iMessage, X) + **Gmail**: search the fund name, the partner name, and portfolio founders' names. Needs Beeper Desktop open; ECONNREFUSED means it's closed, so tell Abby.
- **LinkedIn**: a full-archive export was requested Sep 28 2026 (arrives by email, and includes Connections.csv). Match connections' companies against the pipeline. Never bulk-scrape LinkedIn pages; viewing a single profile Abby names is fine.
- Log each path as an append to Warm Intro Path ("[date] via <person> — <evidence>") plus the Intro Targets relation.

## 5. Delegation

Row-level research and bulk writes go to Sonnet subagents in batches of about 25, each verified by re-fetch. Parallel agents share one WebSearch budget (~200/session), so prefer WebFetch on round announcements and portfolio pages, and run big research passes one at a time.
