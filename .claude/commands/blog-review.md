---
description: Review a blog post for SEO, tone, and conversion best practices before publishing
---

# Blog Post SEO & Conversion Review

You are reviewing a blog post for SEO quality, brand tone, and conversion optimization before it goes live. The user will specify which file to review, or you should check for any recently modified blog files.

## Checklist

### Meta Tags
- [ ] Title tag under 60 characters
- [ ] Title is conversational, includes primary keyword, has emotional hook
- [ ] Meta description under 160 characters
- [ ] Description starts with a relatable hook (symptom, question, or "if this sounds like you" pattern)
- [ ] Keywords meta tag includes 6-10 relevant terms
- [ ] Canonical URL is set correctly

### Social Tags
- [ ] og:title matches title tag
- [ ] og:description matches meta description
- [ ] og:image is set to a relevant image
- [ ] og:type is "article"
- [ ] twitter:card is "summary_large_image"
- [ ] All social tags consistent across og/twitter

### Schema Markup
- [ ] BlogPosting or Article schema present
- [ ] Schema headline matches title tag EXACTLY
- [ ] Schema description matches meta description
- [ ] datePublished is set
- [ ] dateModified is set to today's date
- [ ] author and publisher are set
- [ ] mainEntityOfPage with correct URL
- [ ] If post has FAQ section → FAQPage schema is included
- [ ] BreadcrumbList schema included (Home → Blog → Post)

### Tone of Voice
- [ ] FAQ answers do NOT start with "Yes," or "No," — they jump straight in
- [ ] No "significantly", "typically", "however", "particularly", "evidence-based"
- [ ] No hedging: "it's important to note", "while individual experiences may vary"
- [ ] No generic endings: "consult your healthcare provider"
- [ ] Voice sounds like a knowledgeable friend, not a medical textbook
- [ ] Uses "YOUR body", "YOUR cycle" — personalizes advice
- [ ] Meta description has warmth, not clinical listing of keywords

### Content Structure
- [ ] Single H1 tag (the main headline)
- [ ] Proper heading hierarchy (H1 → H2 → H3, no skips)
- [ ] Internal links to at least 3 other blog posts with natural anchor text
- [ ] Related articles section at the bottom
- [ ] Breadcrumb navigation present

### Conversion Elements
- [ ] **Contextual CTA** that matches blog topic (e.g., "Track your cycle phases in Go Go Gaia" not generic "Download our app")
- [ ] At least one CTA above the fold or early in content
- [ ] At least one CTA mid-content (after providing value)
- [ ] CTA at end of post (after related articles is fine)
- [ ] Apple smart app banner meta tag: `<meta name="apple-itunes-app" content="app-id=YOUR_ID">`
- [ ] App Store link uses UTM parameters for attribution
- [ ] Social sharing buttons present

### Sitemap
- [ ] Post is listed in sitemap.xml
- [ ] lastmod date is current
- [ ] Priority is appropriate (0.7-0.9)

### Query Targeting
Check `seo-audit-march-2026.md` (if it exists) for:
- What queries this topic should target
- What position/impressions existing content has
- Whether this post might cannibalize an existing page
- Whether a dedicated comparison page would serve better than bundling into an existing post

### Competitive Check
- Does this topic overlap with Flo/Clue/Natural Cycles content?
- If so, what angle makes our content different? (privacy-first, correlation insights, all-in-one)
- Could this content support a free calculator/tool page?

Report all issues found and offer to fix them.
