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
- **Open Graph tags**: Must include og:title, og:description, og:type, og:url, og:image, og:site_name
- **Twitter Card tags**: Must include twitter:card, twitter:site, twitter:title, twitter:description, twitter:image
- **BreadcrumbList schema**: Must be present with Home > Blog > Post structure
- **Apple smart app banner**: `<meta name="apple-itunes-app" content="app-id=6608432371">`

Flag any missing tags, especially og:image and twitter:image which are commonly forgotten.

## 2. Check Schema Markup
For each blog post, verify:
- BlogPosting or Article schema is present
- `headline` matches `<title>` tag
- `description` matches meta description
- `image` array is present (NOT missing)
- `dateModified` is accurate (should reflect last real content change)
- `author` is consistent ("Holland Neurotech Inc." for most, "Go Go Gaia Team" for newer articles)
- FAQPage schema exists if the post has an FAQ section
- BreadcrumbList schema is present

## 3. Tone of Voice Check
### FAQ Schema Review
Review FAQ answers in FAQPage schema for AI-generated language:
- Flag answers starting with "Yes," or "No," followed by textbook explanation
- Flag "significantly", "typically", "however", "particularly", "evidence-based"
- Flag hedging: "it's important to note", "while individual experiences may vary"
- Flag generic endings: "consult your healthcare provider"
- The brand voice is: knowledgeable friend who's done the research — warm, direct, specific, occasionally punchy

### Forbidden Words Scan
Grep each post for these banned words: finally, seamlessly, revolutionary, transform/transformation, journey, empower/empowering, game-changer, unlock, elevate, holistic approach, cutting-edge, comprehensive solution, innovative

### Formatting Violations
- Grep for `&mdash;` and literal `—` (em-dashes are banned, use periods/commas/colons)
- Grep for semicolons in prose content (banned, use periods)
- Check paragraph length (should be 2-3 sentences max)

## 4. Check Images
For each blog post, verify:
- Featured image present in article body with `loading="eager"` and descriptive alt text
- og:image points to a real file that exists
- twitter:image points to a real file that exists
- BlogPosting schema has `image` array
- Below-fold images use `loading="lazy"`
- Alt text is descriptive, includes keywords naturally, under 125 chars

## 5. Check Sitemap
Read `sitemap.xml` and verify:
- All blog posts are listed
- No missing entries
- `lastmod` dates are accurate
- Priority levels make sense (high-traffic pages should be 0.9)

## 6. Check for Search Performance Data
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

## 7. Conversion Optimization Check
For each blog post, verify:
- **Contextual CTAs**: App download CTAs match the blog topic (e.g., pregnancy article > "Track your pregnancy in Go Go Gaia", not generic "Download")
- **Smart app banner**: Check if Apple smart app banner meta tag is present (`<meta name="apple-itunes-app">`)
- **CTA placement**: At least one CTA mid-content, one at end
- **App Store link UTMs**: Links use `?pt=127249655&ct=gogogaia.com&mt=8`
- **Related articles**: Section exists at bottom linking to topically related posts (2-3 cards)
- **Social sharing buttons**: Present top and bottom

## 8. Check Internal Linking (Bidirectional)
- Verify that blog posts link to each other contextually
- Flag any orphan posts (posts not linked to from any other post)
- For each post, check that it links TO 2-4 related posts AND is linked FROM 2-3 related posts
- Verify all internal link targets actually exist
- Internal links should NOT use `target="_blank"`

## 9. Competitive Positioning Check
Review content against competitor strategies:
- Are there free calculator/tool pages (due date, ovulation, period predictor)? Competitors like Flo drive millions of visits from these.
- Are comparison pages targeting specific query pairs (Clue vs Flo, etc.) or bundled into one mega-page?
- Is content covering the full life-stage spectrum (first period > menopause)?
- Is there content targeting AI search optimization (structured for featured snippets, AI Overviews)?

## 10. Output Format
Present findings as:
1. **Critical issues** (broken schema, missing meta tags, title > 60 chars, AI-sounding tone, forbidden words, em-dashes)
2. **Image issues** (missing og:image, twitter:image, featured images, broken image paths)
3. **Cross-linking gaps** (orphan posts, missing bidirectional links)
4. **Conversion gaps** (missing CTAs, no smart banners, generic download buttons)
5. **Opportunities** (CTR improvements, new content ideas from query data, calculator tools to build)
6. **Maintenance items** (sitemap updates, date fixes)

Reference the previous audit at `seo-audit-march-2026.md` for baseline comparison if it exists.
