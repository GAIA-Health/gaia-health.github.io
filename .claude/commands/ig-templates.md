# IG / TikTok Multi-Account Template System Loader

You are working on the Instagram/TikTok carousel system: templates, the three account-vibe families, account definitions, and rendering. Load the system, then build or edit specs and render. Do NOT schedule or publish anything without Abby's explicit go (system-wide rule).

## 1. Read, in this order

1. `scripts/pinterest/templates/slide.html` — the one template file: all slide layouts + skins (`default` veya clean, `skin-soft` house IG look, `skin-notes` raw, `skin-bold` anti-pastel, `skin-photo` photo-background) as CSS. The wordmark is a `{{WM}}` slot (see §3).
2. `scripts/pinterest/render-slides.mjs` — spec format (header comment) + slide types: `hook`, `point`, `mythfact`, `pov`, `list`, `grid` (2x2 photo collage), `shot` (framed app screenshot), `cta`. Optional per-slide fields: `source` (citation line), `photo` / `photo_note`. Optional per-spec: `wordmark` (default "veya", empty string hides it).
3. The spec files (each entry's `template_note` labels its vibe + skeleton):
   - `scripts/pinterest/specs/slides-ig-templates.json` — the original Aug 2026 set (V-A/T numbering).
   - `scripts/pinterest/specs/slides-ig-vibes.json` — the 3-vibe seed batch (persona, decoded 02-03, bold).
   - `scripts/pinterest/specs/slides-vibe-persona.json`, `slides-vibe-house.json`, `slides-vibe-bold.json` — the Aug 25 expansion to ~10 per vibe.
4. `TONE-OF-VOICE-GUIDE.md` (repo root) — mandatory before writing any string.
5. `docs/INSTAGRAM.md` §2-3 — format specs (4:5, 1015px safe zone, ≤10 slides via Post Bridge), archetypes, hook rules.
6. If choosing formats or questioning whether a skeleton works: `docs/inspiration/2026-08-25-ig-format-vetting/NOTES.md` — the live-wall vetting (getyourglowww = the proven model wall for the persona play; explore placement ≠ proof).

## 2. The three vibe families (each = a candidate account)

| Vibe | Skin | Posture | Skeletons |
|---|---|---|---|
| **Persona / journey girl** | `skin-photo` | first-person lowercase confession hooks, app as ONE mid-list tip, lifestyle photos carry the vibe | wish-i-knew listicle, pov, photo-dump grid, cover+screenshot |
| **Veya house science** | `skin-soft` | the cited "decoded" series (numbered, fixed 7-slide skeleton, next-in-series CTA), phasemap explainers | decoded no. 01-09 exist (HRV, RHR, sleep, temp, cycle length, glucose, energy, mood, desire) |
| **Bold anti-pastel** | `skin-bold` | punchy receipts/myth-busting, mistake-prevention hooks ("before you blame…"), sources on every fact | mythfact, "receipts" phasemap |

Account identities live in `scripts/pinterest/accounts/<slug>.json` — created via the interactive worksheet:

```
node scripts/pinterest/define-account.mjs            # new account
node scripts/pinterest/define-account.mjs <slug>     # edit existing
```

It captures handle ideas, bio, wordmark, CTA pill, content mix, cadence, disclosure notes. When writing specs for a defined account, match its `skin`, `wordmark`, and `cta_pill`. A persona account that isn't Veya-branded sets `"wordmark": ""` (or its own name) in each spec.

## 3. Commands

```
node scripts/pinterest/render-slides.mjs scripts/pinterest/specs/<spec>.json --format ig            # 1080x1350 -> out/slides/<id>/
node scripts/pinterest/render-slides.mjs scripts/pinterest/specs/<spec>.json --format tt            # 1080x1920 -> out/slides-tt/<id>/
node scripts/pinterest/render-slides.mjs scripts/pinterest/specs/<spec>.json --format ig --only <id>
node scripts/pinterest/build-review.mjs scripts/pinterest/specs/<spec1>.json <spec2>.json ...       # -> out/review.html, carousels grouped by vibe
```

After any batch render, rebuild the review board with ALL current spec files and point Abby at `scripts/pinterest/out/review.html`.

Photos come from `scripts/pinterest/photos/persona/library/` (sourcing rules + shot list: `scripts/pinterest/photos/persona/SHOT-LIST.md`; visual grade + 36 vetted Pinterest reference pins: `photos/persona/MOODBOARD.md`). Until the library is filled, photo slides render a labeled warm placeholder — that's expected.

## 4. House rules for template copy (apply without being asked)

- Tone guide on every string. Hooks are mistake/confession/discovery framed, 5-8 words, biggest text on the slide. Persona vibe: all lowercase, first person.
- **Cite real numbers.** Stats come from the encyclopedia's citation-verified entries (`encyclopedia/*.html`, "What the Research Shows" sections) and go on the slide with a `source` line ("Author et al., Journal, Year · sample"). Never invent or round beyond the source. The cited-descriptive posture IS the differentiation — nobody else in the niche puts sources on-slide.
- No medical advice: descriptive patterns/prevalence only, no thresholds/triage/treatment. Fertility content states plainly it's awareness, not contraception. PMDD appears as a prevalence number only. No superlatives about us. Never mention Embie.
- The app plug is ONE mid-list tip (persona) — but a CTA end slide (save/share + link-in-bio pill) is mandatory on every carousel (Ona-vs-Musa lesson).
- One idea per slide, big type, everything inside the 1015px safe zone. ≤10 slides (Post Bridge cap).
- Format maxxing: repeat a proven skeleton with swapped topics (decoded series = the model) over inventing layouts. New decoded posts continue the numbering and name the next one in the CTA.
- Real photos only (Pexels/Unsplash/Abby's roll). No AI humans. A face never sits on a slide whose text names a condition. (Photoreal-AI policy is an open Abby decision; in-niche precedent noted in the vetting doc.)
- Never fabricated personal medical stories — persona first-person stays lifestyle (logging, planning, cozy), never diagnoses or symptom-cure claims.

## 5. Definition of done for a batch

Specs valid JSON + strings tone-checked + rendered PNGs eyeballed at thumbnail size (no overflow/clipping, placeholder labels sensible) + `ig.caption` (keyword-led first line, Google-indexed) and per-slide `alt` filled + review board rebuilt + presented to Abby with the board path. Scheduling waits for her go.

ARGUMENTS:
