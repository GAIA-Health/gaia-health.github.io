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
- [ ] og:image is set to a relevant image (NOT missing)
- [ ] og:type is "article"
- [ ] twitter:card is "summary_large_image"
- [ ] twitter:image is set (NOT missing)
- [ ] All social tags consistent across og/twitter

### Schema Markup
- [ ] BlogPosting or Article schema present
- [ ] Schema headline matches title tag EXACTLY
- [ ] Schema description matches meta description
- [ ] Schema `image` array is present (NOT missing)
- [ ] datePublished is set
- [ ] dateModified is set to today's date
- [ ] author and publisher are set
- [ ] mainEntityOfPage with correct URL
- [ ] If post has FAQ section, FAQPage schema is included
- [ ] BreadcrumbList schema included (Home > Blog > Post)

### Images
- [ ] Featured image present in article body after H1 with `loading="eager"`
- [ ] Featured image has descriptive alt text (under 125 chars, includes keyword naturally)
- [ ] Below-fold images use `loading="lazy"`
- [ ] og:image and twitter:image point to an actual file that exists
- [ ] BlogPosting schema includes image array

### Forbidden Words (CRITICAL)
Grep the file for ALL of these. Any match is a fail:
- [ ] "finally" (not as in "finally, the last section" navigation)
- [ ] "seamlessly"
- [ ] "revolutionary"
- [ ] "transform" / "transformation"
- [ ] "journey" (as in "health journey" or "wellness journey")
- [ ] "empower" / "empowering"
- [ ] "game-changer"
- [ ] "unlock" (as in "unlock insights")
- [ ] "elevate"
- [ ] "holistic approach"
- [ ] "cutting-edge"
- [ ] "comprehensive solution"
- [ ] "innovative"

### Forbidden Patterns
Scan for these AI-sounding constructs:
- [ ] "Whether you're X or Y, Z"
- [ ] "In today's fast-paced world"
- [ ] "X is not just Y, it's Z"
- [ ] "I'm [adjective] to [verb]..."
- [ ] "At the end of the day..."
- [ ] "Sound familiar? You're not X. You're not Y. You're Z."
- [ ] "We're excited to..."
- [ ] "Our mission is to empower..."
- [ ] "It's never been easier to..."
- [ ] "Take control of your health journey"
- [ ] "Designed with you in mind"

### Formatting Rules
- [ ] NO em-dashes (`&mdash;` or `—`) anywhere in content, meta tags, or schema text. Grep for both `&mdash;` and the literal `—` character. Replace with periods, commas, or colons.
- [ ] NO semicolons in content (OK in HTML/CSS/JS syntax, not in prose)
- [ ] Short paragraphs (2-3 sentences max)
- [ ] Subheadings every 150-300 words

### Tone of Voice
- [ ] FAQ answers do NOT start with "Yes," or "No," — they jump straight in
- [ ] No hedging words: "significantly", "typically", "however", "particularly"
- [ ] No hedging phrases: "it's important to note", "while individual experiences may vary"
- [ ] No generic endings: "consult your healthcare provider" (as throwaway line)
- [ ] Voice sounds like a knowledgeable friend, not a medical textbook
- [ ] Uses "YOUR body", "YOUR cycle" — personalizes advice
- [ ] Meta description has warmth, not clinical listing of keywords
- [ ] Contractions used naturally ("you're" not "you are")
- [ ] Active voice throughout

### Content Structure
- [ ] Single H1 tag (the main headline)
- [ ] Proper heading hierarchy (H1 > H2 > H3, no skips)
- [ ] Internal links to at least 3 other blog posts with natural anchor text
- [ ] Related articles section at the bottom (2-3 cards)
- [ ] Breadcrumb navigation present
- [ ] Medical disclaimer present (if health-related post)
- [ ] Sources cited with superscript links for medical/scientific claims
- [ ] References section if 3+ sources cited

### Cross-Linking (Bidirectional)
- [ ] New post links TO 2-4 related existing posts
- [ ] 2-3 existing related posts link BACK to the new post
- [ ] All internal link targets actually exist (glob check)
- [ ] Internal links do NOT use `target="_blank"`

### CTA Quality (CRITICAL — high bounce-rate impact)
- [ ] **CTA headline grounded in a clinical standard or the article's own advice** (e.g., "Your doctor can now diagnose endo from your symptoms" not "Track Your Symptoms Effortlessly")
- [ ] CTA headline cites a guideline, study, or recommendation from the article itself
- [ ] **Button text is a concrete, achievable goal** (e.g., "Start a 3-Month Symptom Log" not "Download Go Go Gaia Free")
- [ ] **Subtext is encouraging + specific** (e.g., "Most people spot their first pattern within 2 weeks" not "Join thousands of women...")
- [ ] Bottom CTA (after FAQ/related articles) is low-pressure: "Still deciding? Just try one." or "Track it for 2 cycles. See what you find."
- [ ] CTA mid-content or after providing value
- [ ] Apple smart app banner meta tag: `<meta name="apple-itunes-app" content="app-id=6608432371">`
- [ ] App Store link uses UTM parameters: `?pt=127249655&ct=gogogaia.com&mt=8`
- [ ] Social sharing buttons present (top and bottom)

### De-Branding
- [ ] No section headings contain "Go Go Gaia" (frame around reader's goal, not the product)
- [ ] Go Go Gaia mentioned naturally 1-2 times in tracking/app section, not as the section frame
- [ ] Tracking section heading is reader-goal-focused: "What to Track for Your Doctor" not "What to Track in Go Go Gaia"
- [ ] For comparison posts: Go Go Gaia is NOT first in Quick Answer list, and transparency disclosure is present

### Above-the-Fold
- [ ] H1 + lead paragraph + Quick Answer box visible without scrolling (no large image pushing them down)
- [ ] Lead paragraph is concrete about what the guide covers (lists specific topics, not vague "gives you the tools")
- [ ] If a featured image exists, it's placed BELOW the Table of Contents with `loading="lazy"`

### Sitemap & Blog Index
- [ ] Post is listed in sitemap.xml
- [ ] lastmod date is current
- [ ] Priority is appropriate (0.7-0.9)
- [ ] Post card added to blog/index.html in appropriate category section

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
