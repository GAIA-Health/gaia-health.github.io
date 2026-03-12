---
description: Run a full SEO audit on the blog — reviews titles, descriptions, schema, sitemap, search performance, tone, conversion elements, and competitive positioning
---

# SEO Audit for Go Go Gaia Blog

You are auditing the SEO health of the Go Go Gaia blog. Follow these steps:

## 1. Check All Blog Post Meta Tags
For each file in `blog/*.html`, extract and review:
- **Title tag**: Should be under 60 characters, conversational, include primary keyword, no "Guide 2026:" pattern
- **Meta description**: Should be under 160 characters, empathetic/conversational tone, include a hook that starts with a relatable symptom or question
- **Schema headline**: Must match the title tag exactly
- **Canonical URL**: Must be set and correct
- **Open Graph + Twitter tags**: Must match title and description
- **BreadcrumbList schema**: Must be present with Home → Blog → Post structure

Flag any issues found.

## 2. Check Schema Markup
For each blog post, verify:
- BlogPosting or Article schema is present
- `headline` matches `<title>` tag
- `description` matches meta description
- `dateModified` is accurate (should reflect last real content change)
- `author` is consistent ("Holland Neurotech Inc." for most, "Go Go Gaia Team" for newer articles)
- FAQPage schema exists if the post has an FAQ section
- BreadcrumbList schema is present

## 3. Tone of Voice Check
Review FAQ answers in FAQPage schema for AI-generated language:
- Flag answers starting with "Yes," or "No," followed by textbook explanation
- Flag "significantly", "typically", "however", "particularly", "evidence-based"
- Flag hedging: "it's important to note", "while individual experiences may vary"
- Flag generic endings: "consult your healthcare provider"
- The brand voice is: knowledgeable friend who's done the research — warm, direct, specific, occasionally punchy

## 4. Check Sitemap
Read `sitemap.xml` and verify:
- All blog posts are listed
- No missing entries
- `lastmod` dates are accurate
- Priority levels make sense (high-traffic pages should be 0.9)

## 5. Check for Search Performance Data
Look for any Google Search Console export files in:
- `~/Downloads/` (files matching `go-go-gaia*Performance*`)
- Project root (`seo-audit-*.md`)

If found, analyze:
- Which pages have highest impressions but lowest CTR (priority for title/description fixes)
- Which queries have high impressions at position 4-20 (opportunity zone)
- Any new query clusters emerging
- Fragment URL cannibalization issues
- Desktop vs mobile CTR gaps
- International traffic opportunities (check Countries.csv)
- Translated results performance (check Search appearance.csv)

## 6. Conversion Optimization Check
For each blog post, verify:
- **Contextual CTAs**: App download CTAs match the blog topic (e.g., pregnancy article → "Track your pregnancy in Go Go Gaia", not generic "Download")
- **Smart app banner**: Check if Apple smart app banner meta tag is present (`<meta name="apple-itunes-app">`)
- **CTA placement**: At least one CTA above the fold, one mid-content, one at end
- **Related articles**: Section exists at bottom linking to topically related posts
- **Social sharing buttons**: Present and working

## 7. Check Internal Linking
Verify that blog posts link to each other contextually. Flag any orphan posts (posts not linked to from any other post).

## 8. Competitive Positioning Check
Review content against competitor strategies:
- Are there free calculator/tool pages (due date, ovulation, period predictor)? Competitors like Flo drive millions of visits from these.
- Are comparison pages targeting specific query pairs (Clue vs Flo, etc.) or bundled into one mega-page?
- Is content covering the full life-stage spectrum (first period → menopause)?
- Is there content targeting AI search optimization (structured for featured snippets, AI Overviews)?

## 9. Output Format
Present findings as:
1. **Critical issues** (broken schema, missing meta tags, title > 60 chars, AI-sounding tone)
2. **Conversion gaps** (missing CTAs, no smart banners, generic download buttons)
3. **Opportunities** (CTR improvements, new content ideas from query data, calculator tools to build)
4. **Maintenance items** (sitemap updates, date fixes)

Reference the previous audit at `seo-audit-march-2026.md` for baseline comparison if it exists.
