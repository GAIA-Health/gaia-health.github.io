---
description: Write a new blog post for the Go Go Gaia website following all established guidelines
---

# Write Blog Post for Go Go Gaia

You are writing a blog post for the Go Go Gaia website (www.go-go-gaia.com). The topic is: **$ARGUMENTS**

Before writing, read these files for context:
1. The existing blog index to see current posts and avoid duplication: `/Users/abbyholland/Desktop/abby/webdev/gaia-health.github.io/blog/index.html`
2. The comparison post plan (if this is a comparison post): `/Users/abbyholland/Desktop/abby/webdev/gaia-health.github.io/docs/COMPARISON-POSTS-PLAN.md`
3. The reusable image library: `/Users/abbyholland/Desktop/abby/webdev/gaia-health.github.io/docs/REUSABLE-IMAGE-LIBRARY.md`
4. The image usage tracker: `/Users/abbyholland/Desktop/abby/webdev/gaia-health.github.io/docs/IMAGE-USAGE-TRACKER.md`
5. The HTML template from an existing comparison post: `/Users/abbyholland/Desktop/abby/webdev/gaia-health.github.io/blog/how-to-choose-period-tracker-app.html`
6. The sitemap: `/Users/abbyholland/Desktop/abby/webdev/gaia-health.github.io/sitemap.xml`
7. The PCOS comparison post (best current example of the comparison format): `/Users/abbyholland/Desktop/abby/webdev/gaia-health.github.io/blog/best-pcos-tracking-app.html`

Also read 1-2 existing blog posts that are closest to the requested topic so you match their HTML structure exactly.

---

## TONE OF VOICE RULES (NON-NEGOTIABLE)

### Write Like You're Talking to a Smart Friend
- Direct, conversational, honest, specific
- Use contractions: "you're" not "you are", "it's" not "it is"
- Active voice: "Research shows" not "It has been shown by research"
- Varied sentence length. Mix short and medium. Not all long.
- Start with action: "Track your period" not "You can track your period"
- Break "rules" naturally. Start with "And" or "But" if it flows.
- Address the reader as "you"
- 8th grade reading level

### NEVER Use These Words
- finally
- seamlessly
- revolutionary
- transform / transformation
- journey (as in "health journey" or "wellness journey")
- empower / empowering
- game-changer
- unlock (as in "unlock insights")
- elevate
- holistic approach (say "all-in-one" or be specific instead)
- cutting-edge
- comprehensive solution (be specific instead)
- innovative

### NEVER Use These Patterns
- "Whether you're X or Y, Z" (too formulaic)
- "In today's fast-paced world" (corporate cliche)
- "X is not just Y, it's Z" (AI pattern)
- "I'm [adjective] to [verb]..." (AI pattern)
- "At the end of the day..." (filler)
- "The fact of the matter is..." (filler)
- "Sound familiar? You're not [negative]. You're not [negative]. You're [positive]." (preachy script)
- "We're excited to..." (corporate)
- "Our mission is to empower..." (corporate)
- "It's never been easier to..." (cliche)
- "Take control of your health journey" (forbidden word + cliche)
- "Designed with you in mind" (meaningless)

### Formatting Rules
- NO em-dashes (use periods, commas, or colons instead)
- NO semicolons (use periods instead)
- Short paragraphs (2-3 sentences max)
- Break up text with subheadings every 150-300 words
- Use specific examples with real numbers, not vague claims

### The Read-Aloud Test
Before finalizing any section, ask: "Would I actually say this to a friend?" If no, rewrite it.

---

## BLOG POST TYPES

Determine which type of post the topic requires:

### Standard Blog Post (educational, how-to, listicle, guide)
- 1000-4000 words depending on depth
- Opening hook (relatable scenario, surprising stat, or question)
- Medical disclaimer if health-related
- 3-7 major H2 sections
- Actionable takeaways
- "How Go Go Gaia Helps" section (natural, not salesy)
- CTA at the end
- Related articles section

### Comparison Post (app comparison / "best X app")
- Follow the EXACT structure from `blog/how-to-choose-period-tracker-app.html`
- See the full comparison post rules below

---

## HTML STRUCTURE (ALL POSTS)

Every blog post is a full HTML page. Use this exact structure:

### Head Section
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>[Under 60 chars, front-load keyword] | Go Go Gaia Blog</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="[Under 160 chars, include CTA or question, include primary keyword]">
    <meta name="keywords" content="[6-10 relevant keywords]">

    <!-- Canonical URL -->
    <link rel="canonical" href="https://www.go-go-gaia.com/blog/[slug].html">

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="[Same as title tag]">
    <meta property="og:description" content="[Same as meta description]">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://www.go-go-gaia.com/blog/[slug].html">
    <meta property="og:image" content="https://www.go-go-gaia.com/images/[image-path]">
    <meta property="og:site_name" content="Go Go Gaia">
    <meta property="article:published_time" content="[YYYY-MM-DD]">
    <meta property="article:author" content="Holland Neurotech Inc.">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@holland_neuro">
    <meta name="twitter:title" content="[Same as title tag]">
    <meta name="twitter:description" content="[Same as meta description]">
    <meta name="twitter:image" content="https://www.go-go-gaia.com/images/[image-path]">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="../Logo1.png">

    <!-- Stylesheets -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="../styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- BlogPosting Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "[Post Title]",
      "description": "[Meta description]",
      "author": { "@type": "Organization", "name": "Holland Neurotech Inc." },
      "publisher": {
        "@type": "Organization",
        "name": "Holland Neurotech Inc.",
        "logo": { "@type": "ImageObject", "url": "https://www.go-go-gaia.com/Logo1.png" }
      },
      "datePublished": "[YYYY-MM-DD]",
      "dateModified": "[YYYY-MM-DD]",
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.go-go-gaia.com/blog/[slug].html" },
      "image": [{ "@type": "ImageObject", "url": "https://www.go-go-gaia.com/images/[image]", "width": 1200, "height": 800 }],
      "keywords": "[keywords]"
    }
    </script>

    <!-- FAQPage Schema (if post has FAQ section) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "[Question]",
          "acceptedAnswer": { "@type": "Answer", "text": "[Answer]" }
        }
      ]
    }
    </script>
</head>
```

### Body Structure
```html
<body>
    <!-- NAVBAR: Copy exactly from how-to-choose-period-tracker-app.html -->
    <header class="sticky-top">
        <nav class="navbar navbar-expand-lg custom-navbar-bg">
            <!-- Copy full nav from template -->
        </nav>
    </header>

    <!-- SOCIAL SHARE BUTTONS (TOP) -->
    <div class="share-buttons-top d-flex justify-content-center gap-2 my-3 pb-3 border-bottom">
        <!-- Share buttons: Twitter/X, Facebook, Pinterest, LinkedIn, Email, Copy Link -->
    </div>

    <main class="container py-5">
        <div class="row">
            <div class="col-12 col-lg-8 mx-auto">

                <!-- BREADCRUMBS -->
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="../index.html">Home</a></li>
                        <li class="breadcrumb-item"><a href="index.html">Blog</a></li>
                        <li class="breadcrumb-item active">[Short Post Title]</li>
                    </ol>
                </nav>

                <article>
                    <!-- ARTICLE HEADER -->
                    <header class="mb-5">
                        <h1 class="display-4 fw-bold mb-3">[Full Post Title]</h1>
                        <img src="../images/[image]" alt="[descriptive alt text]" class="img-fluid rounded mb-4" loading="eager">
                        <p class="lead">[Compelling hook / lead paragraph]</p>
                        <div class="d-flex align-items-center text-muted">
                            <small>By Go Go Gaia Team</small>
                            <span class="mx-2">&bull;</span>
                            <small>Published [Month DD, YYYY]</small>
                            <span class="mx-2">&bull;</span>
                            <small>[X] min read</small>
                            <span class="mx-2">&bull;</span>
                            <span class="badge bg-info">[Category Badge]</span>
                        </div>
                    </header>

                    <div class="blog-content">
                        <!-- BLOG BODY CONTENT HERE -->
                    </div>
                </article>

                <!-- SOCIAL SHARE BUTTONS (BOTTOM) -->

                <!-- RELATED ARTICLES SECTION -->
                <section class="related-articles mt-5 pt-4 border-top">
                    <h2 class="h4 mb-4">Related Articles</h2>
                    <div class="row g-4">
                        <!-- 2-3 related article cards -->
                    </div>
                </section>

                <!-- CTA BOX -->
                <div class="text-center mt-5 p-4 bg-light rounded">
                    <h2 class="h4 mb-3">[CTA headline relevant to post topic]</h2>
                    <p>[1-2 sentence value prop]</p>
                    <a href="https://apps.apple.com/app/apple-store/id6608432371?pt=127249655&ct=gogogaia.com&mt=8" target="_blank" class="btn btn-primary btn-lg">Download Go Go Gaia Free</a>
                </div>
            </div>
        </div>
    </main>

    <!-- FOOTER: Copy exactly from template -->

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Copy Link script -->
    <script>
    function copyToClipboard(text, btn) {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check2"></i>';
            setTimeout(() => btn.innerHTML = originalHTML, 2000);
        });
    }
    </script>
</body>
</html>
```

---

## COMPARISON POST SPECIFIC RULES

If the topic is a comparison post (e.g., "best X app", "X vs Y"), follow ALL of these rules:

### Required Sections (in this order)
1. **H1 Title** (include year and app names for SEO)
2. **Full Transparency disclaimer** in a `blog-info-box` div:
   > "This guide is published by Holland Neurotech Inc., the company behind Go Go Gaia. We've worked to provide balanced, fair information about all apps mentioned."
3. **Quick Answer box** (`alert alert-light border`) with 1-line picks per category
4. **Table of Contents** (`bg-light rounded` nav) with anchor links
5. **Medical disclaimer** (if health-related) using `alert alert-warning border-warning`
6. **Step 1: Identify What Matters Most to You** (self-assessment questions)
7. **Step 2: Understanding Your Options** (app profiles)
8. **Feature Comparison Table** (emoji-based: checkmarks, warnings, locks, X marks)
9. **Step 3: Making Your Decision** (decision matrix boxes)
10. **Privacy Considerations** section
11. **Tips for Getting Started**
12. **FAQ section** (5-7 questions) with FAQPage JSON-LD schema
13. **Final Thoughts + CTA**
14. **Related Articles**

### App Profile Format (for each app)
```html
<h3 id="[app-id]">For [User Type]: [App Name]</h3>
<p><strong>Best if you want:</strong> [primary value prop]</p>

<h4>Key Features</h4>
<ul><!-- bullet list --></ul>

<h4>Strengths</h4>
<ul><!-- bullet list --></ul>

<h4>Limitations</h4>
<ul><!-- bullet list, genuinely honest --></ul>

<h4>Who Should Choose This</h4>
<ul><!-- bullet list --></ul>

<h4>Pricing</h4>
<p>[Pricing details + download link]</p>
```

### Decision Matrix Format
Use `alert alert-secondary` for ALL apps (including Go Go Gaia). Do NOT use `alert-primary` for Go Go Gaia and `alert-secondary` for others. Keep the styling consistent to avoid looking biased.

### BIAS RULES (CRITICAL)
- Do NOT lead with Go Go Gaia in every section
- Do NOT use superlatives like "most comprehensive" or "no other app"
- Do NOT name-drop Go Go Gaia excessively in FAQ answers
- Position Go Go Gaia as a strong all-in-one option without making other apps look bad
- Include genuine, honest limitations for Go Go Gaia (e.g., iOS-only, newer app, smaller community)
- Give genuine praise to competitors where deserved
- Do NOT stack superlatives for Go Go Gaia ("most comprehensive," "no other app," "unique" back to back reads like a sales pitch)
- State Go Go Gaia's advantages as facts, not claims. "Tracks symptoms, nutrition, fitness, mood, sleep, and cycle in one free app" is better than "The most comprehensive free feature set"
- In FAQ answers, don't always lead with Go Go Gaia. Mention it naturally where relevant, but some answers shouldn't name any specific app.
- The Final Thoughts section should NOT lead with Go Go Gaia. Lead with general advice or list apps by use case, with Go Go Gaia mentioned naturally (not first).
- Use the word "comprehensive" sparingly and never as "comprehensive solution." Say "all-in-one" or just list what it tracks.

### COMPETITOR RESPECT RULES (CRITICAL)
Our unique selling point is that we're all-in-one. We don't need to take competitors down to win. Lead with what Go Go Gaia offers, not what others lack.

- State facts without editorializing. "No nutrition tracking" is fine. "Lacks even basic nutrition tracking" is not.
- Frame limitations as what the user experiences, not what the competitor is doing wrong. "Free users see regular prompts to upgrade" not "Increasingly aggressive upselling."
- Use neutral language: "some users note," "some reviews mention." Never "users complain" or "users criticize."
- Don't use loaded adjectives about competitors: "aggressive," "cluttered," "bloated," "outdated." Use neutral descriptions instead.
- Don't use snarky or editorial asides (e.g., "which is ironic for a PCOS app"). Just state the fact.
- Cite sources for serious claims (privacy issues, legal settlements) with year and specifics. Don't just say "privacy concerns."
- Acknowledge when a competitor is genuinely the best at something. Clue IS the privacy leader. Flo DOES have the biggest community. Bearable IS the most customizable. Say so.
- When discussing privacy settlements (FTC, class actions), state the facts and note what the company has done since (e.g., Flo added Anonymous Mode). Don't use a "gotcha" tone.
- Don't stack limitations. If a competitor has 6 limitations, pick the 3-4 most relevant ones. A long list of negatives reads like an attack.

### Comparison Table Format
Use emoji indicators for quick scanning:
- Full support: checkmark emoji
- Partial/limited: warning emoji
- Premium only: lock emoji
- Not available: X emoji

For comparison posts, the table will typically have 7-9 columns (Feature + 6-8 apps). Keep cell text short and rely on emoji indicators for scannability. Long text in narrow columns breaks on mobile.

---

## MEDICAL DISCLAIMER

Include this at the top of any post discussing health, hormones, symptoms, nutrition, or medical topics:

```html
<div class="alert alert-warning border-warning">
    <h4><i class="bi bi-info-circle me-2"></i>Medical Disclaimer</h4>
    <p class="mb-0"><strong>This article is for educational and informational purposes only and does not constitute medical advice.</strong> The information provided is based on general wellness principles and should not replace consultation with qualified healthcare professionals. Always consult your doctor, gynecologist, or healthcare provider before making significant changes to your diet, exercise routine, or lifestyle, especially if you have underlying health conditions, irregular cycles, PCOS, endometriosis, or other medical concerns. If you experience severe menstrual symptoms, please seek medical attention. Individual results may vary, and what works for one person may not work for another.</p>
</div>
```

Customize for pregnancy posts (add OB-GYN note), mental health posts (add 988 crisis line), and nutrition posts (add dietitian note).

### Medical Language Rules
- Use "may help" not "will cure"
- Use "research suggests" not "studies prove"
- Use "some women find" not "you should"
- Use "consult your doctor about" not "take X dosage"
- Always include "consult healthcare provider" when discussing symptoms, treatments, or supplements

---

## SEO REQUIREMENTS

1. **Title tag**: Under 60 characters, front-load keyword, include year for comparison posts
2. **Meta description**: Under 160 characters, include primary keyword, include CTA or question
3. **H1**: Include primary keyword naturally
4. **H2/H3 headings**: Include secondary keywords naturally (not stuffed)
5. **URL slug**: Short, keyword-rich (e.g., `best-pcos-tracking-app.html`)
6. **First paragraph**: Include primary keyword
7. **Internal links**: Link to 2-4 related blog posts with natural anchor text
8. **External links**: Open in new tab with `target="_blank" rel="noopener"`
9. **Image alt text**: Descriptive, includes keywords naturally, under 125 chars
10. **BlogPosting JSON-LD schema**: Required for all posts
11. **FAQPage JSON-LD schema**: Required for posts with FAQ sections

---

## CONTENT QUALITY CHECKLIST

- [ ] Opens with a relatable scenario, stat, or question (not a definition)
- [ ] Addresses reader as "you" throughout
- [ ] Specific examples with real numbers (not vague claims)
- [ ] Actionable takeaways the reader can implement
- [ ] Sources cited for medical/scientific claims (use in-text superscript links)
- [ ] No forbidden words (finally, seamlessly, revolutionary, transform, journey, empower, game-changer, unlock, elevate, holistic approach, cutting-edge, comprehensive solution, innovative)
- [ ] No em-dashes anywhere in the content
- [ ] No semicolons anywhere in the content
- [ ] Contractions used naturally throughout
- [ ] Active voice throughout
- [ ] Short paragraphs (2-3 sentences)
- [ ] Subheadings every 150-300 words
- [ ] Medical disclaimer included (if health-related)
- [ ] CTA that relates to the post topic (not generic)

---

## POST-WRITING TASKS

After writing the blog post HTML file, do ALL of the following:

### 1. Add to blog/index.html
Add a card for the new post in the appropriate category section. Match the card format of existing posts. Include the publish date in format "MMM D, YYYY" and estimated read time.

### 2. Add to sitemap.xml
Add a `<url>` entry:
```xml
<url>
    <loc>https://www.go-go-gaia.com/blog/[slug].html</loc>
    <lastmod>[YYYY-MM-DD]</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
</url>
```

### 3. Add cross-links from related posts
Find 2-3 existing blog posts that relate to this topic and add natural internal links FROM those posts TO the new post. Don't force it. Only add links where they genuinely make sense in context.

### 4. Run tone audit
Search the completed post for:
- Any forbidden words (list above)
- Any em-dashes (the character: \u2014)
- Any semicolons
- Any AI-sounding patterns from the forbidden list
- Any sentences that fail the "would I say this to a friend?" test

Fix any violations found.

### 5. Verify technical elements
- All internal links point to valid files
- JSON-LD schema is valid JSON
- Meta description is under 160 characters
- Title tag is under 60 characters
- All images reference files that exist in the images directory
- Social share button URLs are correctly encoded for the new post

---

## SOURCES AND CITATIONS

- Only use sources from the docs/ directory source documents when available
- For medical/scientific claims, cite PubMed, NIH, ACOG, Mayo Clinic, or Cleveland Clinic
- Format in-text: `<sup><a href="[URL]" target="_blank" rel="noopener">[1]</a></sup>`
- Include a References section at the bottom if citing 3+ sources
- Do NOT make up citations. If you can't verify a claim, soften the language or remove it.
- Do NOT use random blogs or social media as sources

---

## IMAGES

- Check the reusable image library doc for available images before selecting
- Check the image usage tracker to avoid overusing the same image
- Every post needs at least one featured image
- Alt text must be descriptive and include keywords naturally
- Use `loading="lazy"` for below-fold images, `loading="eager"` for the featured image

---

## LESSONS LEARNED FROM PREVIOUS POSTS

These rules were established through the iterative process of writing and reviewing the PCOS comparison post:

1. **Em-dashes are everywhere by default.** Actively watch for them. They sneak into every sentence. Replace with periods, commas, or colons.
2. **"Comprehensive" is a corporate word.** Use "all-in-one" or just list what's included.
3. **Visual styling matters for bias.** All decision matrix boxes must use the same CSS class (alert-secondary). Don't highlight Go Go Gaia differently.
4. **FAQ answers are easy to over-promote in.** Write FAQ answers that genuinely help. Don't name-drop Go Go Gaia in every answer.
5. **Competitor limitations should read like neutral observations, not attacks.** If a sentence would make a competitor's team feel unfairly targeted, soften it.
6. **Our USP sells itself.** We're the all-in-one tracker. We don't need to point out what others lack. Just describe what we do and let readers draw their own conclusions.
7. **Always include a "Worth Noting" callout** for adjacent tools (hardware monitors, complementary apps) that don't warrant full profiles but readers should know about.
8. **Research competitors thoroughly.** Include 6-8 apps, not just 4-5. Missing a notable competitor makes the comparison feel incomplete.

---

## FINAL REMINDER

Write like a knowledgeable friend who did the research, not like a marketer writing copy. If any sentence sounds like it came from a press release, rewrite it. Be honest about Go Go Gaia's limitations. Give competitors genuine credit where they deserve it. Help the reader make the right decision for THEM, even if that means choosing a different app.
