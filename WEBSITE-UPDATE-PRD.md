# Website Update PRD - February 2026

## Context
The Go Go Gaia marketing website (gaia-health.github.io) was written when the product was an iOS period tracker. The app has since grown into a full platform with a web app, professional platform, sport dashboard, AI assistant (Gaia), lab results, goals, medications, social wellness, and 5-language i18n. The website copy needs to catch up.

## Source Files
- Main page: `index.html`
- Styles: `styles.css`
- Scripts: `script.js`
- Tone guide: `TONE-OF-VOICE-GUIDE.md`
- Brand assessment: `BRAND-ASSESSMENT-2025.md`
- Web app login copy (reference): `gaia-web-app/messages/en.json` (Login section)

## Web App Login Page Copy (for alignment)
- Hero: "Holistic health. Built by women, for women."
- Sub: "Your period, mood, sleep, fitness, and nutrition - all connected. See the patterns that explain what's going on with your body."
- Features: "Answers, Not Just Data" / "Every Life Stage" / "Everything Connected" / "Ask Gaia"
- Testimonial: Sarah K., 32 (luteal phase sleep insight)

---

## 1. Quick Tone Fixes (em dashes + AI giveaway words) - DONE

### Em dashes removed
- [x] How It Works #2: "sleep schedule—whatever matters to you" → "sleep schedule, whatever matters to you"
- [x] How It Works #5: "—no more trying to remember everything" → ". No more trying to remember everything."
- [x] FAQ #1: "one thing — your period, your workouts, or your food" → "one thing: your period, your workouts, or your food"
- [x] Trust #1: "health data—we earn" → "health data. We earn"
- [x] Trust #2: "stays private—only you" → "stays private. Only you"
- [x] Personas - Cycle: "cycle syncing—aligning" → "cycle syncing: aligning"

### AI giveaway words replaced
- [x] Personas - Fertility: "whether you're just starting your fertility journey" → "whether you're just starting out"
- [x] Personas - General Wellness: "Perfect for anyone taking a holistic approach to their health" → "Perfect for anyone who wants to understand their health and mental wellness better"
- [x] FAQ #6 (PCOS): "empowering you to better manage your condition" → "helping you better manage your condition"
- [x] FAQ #7 (Pregnancy): "pregnancy companion" → "pregnancy tracker"
- [x] FAQ #7 (Pregnancy): "pregnancy journey" → "pregnancy"
- [x] Personas - Pregnancy: heading "Pregnancy Journey" → "Pregnancy Tracking"
- [x] SEO page title: removed "Journey" → "Go Go Gaia: All-in-One Women's Health App | Track Your Wellness"
- [x] SEO meta description: removed "journey" → "Get personalized insights based on your data."
- [x] OG + Twitter titles: removed "Journey"
- [x] Structured data (WebSite schema): "wellness journey" → "Track and understand your health with GO GO GAIA."
- [x] Footer tagline: "Your all-in-one women's health companion" → "Your health, connected. Built by women, for women."

---

## 2. Add Web App CTAs - DONE

- [x] Hero CTA: Added "Try the Web App" button (btn-outline-primary) linking to `https://app.go-go-gaia.com`
- [x] Bottom CTA section: Added "Try the Web App" button (btn-outline-light) next to App Store button
- [x] Updated bottom CTA subheadline: "Download the app or try the web version. Start tracking your patterns in minutes."
- [x] Added sticky mobile CTA bar at bottom of screen on mobile (appears after scrolling past hero)

**Note:** Web app URL is currently `https://app.go-go-gaia.com` - update if different.

---

## 3. Align Hero Messaging with Login Page - DONE

Chose **Option A**: Keep website hero ("Stop wondering why. Start understanding.") and add trust signal.

- [x] Added "BUILT BY WOMEN, FOR WOMEN" as a styled trust badge above the hero headline (pink, uppercase, letter-spaced)
- [x] Kept "Stop wondering why. Start understanding." as main headline

---

## 4. Name the AI - "Ask Gaia" - DONE

- [x] Changed step 5 title from "Ask Your Questions" → "Ask Gaia"
- [x] Updated step 5 description: "Ask Gaia 'Why am I so tired this week?'..."

---

## 5. Update FAQ #8 (Reframe from "We're New") - DONE

- [x] Reframed Q: "What can I actually do with Go Go Gaia?"
- [x] New answer: 16+ pages, AI assistant (Gaia), professional platform, 22+ sport types, iOS + web app, 5 languages, weekly updates. Confident tone.

---

## 6. Add Professional Section - DONE

- [x] Added 3-card section: Manage Clients, Prep for Sessions, Track Progress
- [x] Placed between Trust and CTA sections (after testimonials and trust, before final CTA)
- [x] Distinct lavender background to differentiate from Trust section
- [x] Added "For Pros" nav link

---

## 7. Misc Updates - DONE

- [x] Added "5 Languages" as 4th benefit in bottom CTA summary (with translate icon, 4-column grid)
- [x] Updated footer tagline: "Your health, connected. Built by women, for women."
- [x] Updated structured data: description mentions web app + 5 languages, added 4 new features to featureList (Ask Gaia AI Assistant, Lab Results Analysis, Professional Platform, 5 Language Support)
- [ ] FAQ #3 (cycle predictions): could still mention actual algorithm improvements if accuracy data becomes available
- [ ] FAQ #4 (pricing): verify this still reflects current pricing model
- [ ] Consider adding web app screenshots alongside iOS screenshots if available

---

## 8. Design & UX Modernization - DONE (added Feb 11 2026)

### Section Reorder (better storytelling arc)
- [x] Before: Hero → How It Works → Trust → Personas → Testimonials → Professionals → CTA → FAQ
- [x] After: Hero → How It Works → **Integrations Bar** → **Stats** → Personas → **Testimonials** → **Trust** → Professionals → CTA → FAQ
- [x] Trust now comes after testimonials (social proof before trust ask)
- [x] Added Integrations Bar between How It Works and Stats
- [x] Added Stats section between Integrations and Personas

### Replaced animate.css with Intersection Observer
- [x] Removed animate.css library dependency (~50KB saved)
- [x] Custom `.reveal` CSS classes with `IntersectionObserver` in script.js
- [x] Staggered card entrances: `.stagger-1` through `.stagger-4` (150ms delays)
- [x] Directional entrances: `.reveal-left` and `.reveal-right`
- [x] Hero animates on load via CSS keyframes (no scroll trigger needed)
- [x] Modern `cubic-bezier(0.16, 1, 0.3, 1)` easing (Apple-style spring)

### New: Stats Section
- [x] Purple gradient background with animated counters
- [x] 200+ Metrics, 16+ Pages, 22+ Sports, 5 Languages
- [x] Numbers animate from 0 using `requestAnimationFrame` with ease-out cubic
- [x] Responsive: smaller text on mobile

### New: Integrations Bar
- [x] "Connects with your favorite tools" strip
- [x] Apple Watch, Oura Ring, Garmin, MyFitnessPal, Apple Health
- [x] Subtle lavender background, hover to highlight

### Sticky Mobile CTA
- [x] Fixed bottom bar on mobile with "Get the App" + "Web App" buttons
- [x] Appears after scrolling past hero section
- [x] Hidden on desktop (`d-md-none`)
- [x] Footer padding adjusted to prevent content overlap

### Testimonials Tightened
- [x] Added 5-star ratings to each testimonial
- [x] Shortened testimonial text for punchier reading

### FAQ Animation
- [x] Smooth accordion height transition with modern easing
- [x] Smoother chevron rotation

### Professionals Section Styling
- [x] Distinct lavender background (`var(--secondary)`) to differentiate from Trust

---

## Web App Theme Default Change (Feb 11 2026)

Alongside the website updates, the web app's default theme was changed from dark to light mode for visual continuity when users navigate from the marketing site to the app.

### Files changed:
- `gaia-web-app/src/app/layout.tsx` - HTML `data-theme` attribute default: `dark` → `light`, inline script catch fallback: `dark` → `light`
- `gaia-web-app/src/contexts/ThemeContext.tsx` - `getInitialTheme()` fallback: `dark` → `light`

Existing users keep their saved preference (localStorage `gaia-theme` is still respected). Only affects new users and fallback scenarios.

---

## Remaining Items
- [ ] FAQ #3: Mention algorithm accuracy data when available
- [ ] FAQ #4: Verify pricing still reflects current model
- [ ] Add web app screenshots alongside iOS screenshots when available
- [ ] Confirm web app URL (`https://app.go-go-gaia.com`) is correct and update if needed
- [ ] Test all changes on mobile devices
- [ ] Consider adding a video or animated demo to hero section in future

---

## Notes
- All changes follow TONE-OF-VOICE-GUIDE.md
- Zero em dashes remain in index.html (verified via grep)
- Zero AI giveaway words (journey, empower, companion, holistic approach) remain
- animate.css dependency removed, replaced with custom Intersection Observer system
- Web app default theme changed to light mode for brand continuity
