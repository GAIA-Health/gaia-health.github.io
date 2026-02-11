# How It Works Section Redesign - February 2026

## Current State
- 6 zigzag rows (image left/right alternating) with identical layout
- Predictable pattern, long scroll, no visual hierarchy
- All images same size iPhone screenshots
- Generic "How It Works" title

## New Design: 4-Step Scroll-Linked Storytelling

### Concept: Sticky Phone + Sliding Content Cards

The centerpiece is a **phone mockup that stays pinned** (CSS `position: sticky`) in the center/left of the viewport while **4 content cards scroll past it on the right**. As each card enters the viewport, the phone screenshot crossfades to match that step. This creates the "the page is moving but it isn't" feeling.

On mobile, it falls back to a simpler stacked layout with scroll-triggered reveals (no sticky phone, since the screen is too narrow).

### Visual Layout (Desktop)

```
┌──────────────────────────────────────────────┐
│                                              │
│   ┌─────────┐     ┌──────────────────────┐   │
│   │         │     │  1. TRACK            │   │
│   │  Phone  │     │  Log everything...   │   │
│   │  img 1  │     │                      │   │
│   │ (sticky)│     └──────────────────────┘   │
│   │         │                                │
│   │         │     ┌──────────────────────┐   │
│   │  fades  │     │  2. DISCOVER         │   │
│   │  to     │     │  See patterns...     │   │
│   │  img 2  │     │                      │   │
│   │         │     └──────────────────────┘   │
│   │         │                                │
│   │  fades  │     ┌──────────────────────┐   │
│   │  to     │     │  3. ACT              │   │
│   │  img 3  │     │  Adapt to your...    │   │
│   │         │     └──────────────────────┘   │
│   │         │                                │
│   │  fades  │     ┌──────────────────────┐   │
│   │  to     │     │  4. SHARE            │   │
│   │  img 4  │     │  Export reports...   │   │
│   └─────────┘     └──────────────────────┘   │
│                                              │
└──────────────────────────────────────────────┘
```

### The 4 Steps

#### Step 1: Track
- **Title:** "Track"
- **Icon:** `bi-plus-circle` or `bi-journal-plus`
- **Screenshot:** images/1.png (dashboard) or images/6.png (habit tracking)
- **Copy:** "Log your period, mood, sleep, symptoms, nutrition, and fitness in one place. Connect Apple Watch, Oura Ring, Garmin, or MyFitnessPal. Tap, voice, or detailed entry. 200+ metrics, one app."
- **Key idea:** Everything in one place

#### Step 2: Discover
- **Title:** "Discover"
- **Icon:** `bi-lightbulb` or `bi-search`
- **Screenshot:** images/4.png (cycle patterns/correlations) or images/5.png (sleep analysis)
- **Copy:** "See how your cycle affects your energy, what triggers your headaches, which habits actually help your sleep. Ask Gaia any question about your data and get answers, not generic advice. Compare this cycle to your last three. Know what's normal for you."
- **Key idea:** Patterns + AI + context

#### Step 3: Act
- **Title:** "Act"
- **Icon:** `bi-lightning-charge` or `bi-arrow-right-circle`
- **Screenshot:** images/2.png (data visualization/trends) or images/3.png (insights)
- **Copy:** "Plan around your cycle, not against it. Time workouts for when you're strongest. Adjust sleep during your luteal phase. Track pregnancy week by week. Navigate perimenopause transitions. Your patterns become your playbook."
- **Key idea:** Use insights to change behavior

#### Step 4: Share
- **Title:** "Share"
- **Icon:** `bi-share` or `bi-people`
- **Screenshot:** images/7.png (calendar) or images/3.png (reports)
- **Copy:** "Export detailed health reports to bring real data to doctor appointments. Connect with your healthcare provider, coach, or nutritionist through the professional platform. Share what you choose, keep the rest private."
- **Key idea:** Take it beyond the app

### Section Title Options
- "How Gaia Works" (names the product, simple)
- "Four Steps to Understanding Your Health"
- "From Data to Decisions" (punchy, describes the arc)

**Recommendation:** "How Gaia Works" - short, clear, branded.

---

## Technical Implementation

### HTML Structure

```html
<section id="how-it-works" class="how-it-works-section">
    <div class="container">
        <h2 class="text-center reveal">How Gaia Works</h2>
        <p class="text-center lead mb-5 reveal">From tracking to action in four steps</p>

        <div class="scroll-story">
            <!-- Sticky phone on the left -->
            <div class="scroll-story-phone">
                <div class="phone-frame">
                    <img src="images/1.png" class="phone-screen active" data-step="1" alt="Track your health">
                    <img src="images/4.png" class="phone-screen" data-step="2" alt="Discover patterns">
                    <img src="images/2.png" class="phone-screen" data-step="3" alt="Act on insights">
                    <img src="images/7.png" class="phone-screen" data-step="4" alt="Share with your team">
                </div>
            </div>

            <!-- Scrolling content cards on the right -->
            <div class="scroll-story-content">
                <div class="story-step" data-step="1">
                    <div class="step-number">01</div>
                    <h3>Track</h3>
                    <p>Log your period, mood, sleep, symptoms, nutrition, and fitness in one place. Connect Apple Watch, Oura Ring, Garmin, or MyFitnessPal. Tap, voice, or detailed entry. 200+ metrics, one app.</p>
                </div>

                <div class="story-step" data-step="2">
                    <div class="step-number">02</div>
                    <h3>Discover</h3>
                    <p>See how your cycle affects your energy, what triggers your headaches, which habits help your sleep. Ask Gaia any question about your data. Compare this cycle to your last three. Know what's normal for you.</p>
                </div>

                <div class="story-step" data-step="3">
                    <div class="step-number">03</div>
                    <h3>Act</h3>
                    <p>Plan around your cycle, not against it. Time workouts for when you're strongest. Adjust sleep during your luteal phase. Track pregnancy week by week. Navigate perimenopause. Your patterns become your playbook.</p>
                </div>

                <div class="story-step" data-step="4">
                    <div class="step-number">04</div>
                    <h3>Share</h3>
                    <p>Export detailed health reports for doctor appointments. Connect with your healthcare provider or coach through the professional platform. Share what you choose, keep the rest private.</p>
                </div>
            </div>
        </div>
    </div>
</section>
```

### CSS

```css
/* =============================================
   SCROLL-LINKED STORY SECTION
   ============================================= */

.how-it-works-section {
    background-color: white;
    padding: 6rem 0;
    position: relative;
    overflow: hidden;
}

.how-it-works-section h2 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 2.5rem;
    color: var(--primary);
}

/* Two-column scroll layout */
.scroll-story {
    display: flex;
    gap: 4rem;
    align-items: flex-start;
    max-width: 1000px;
    margin: 0 auto;
}

/* Left column: sticky phone */
.scroll-story-phone {
    flex: 0 0 280px;
    position: sticky;
    top: 120px; /* below navbar */
    align-self: flex-start;
}

.phone-frame {
    position: relative;
    width: 250px;
    margin: 0 auto;
}

.phone-screen {
    width: 100%;
    border-radius: 25px;
    box-shadow: 0 15px 40px rgba(130, 89, 220, 0.25);
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.phone-screen.active {
    opacity: 1;
    position: relative; /* first one takes space */
}

/* Right column: scrolling content */
.scroll-story-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0; /* steps are tall enough to create scroll distance */
}

.story-step {
    min-height: 70vh; /* enough height so each step gets scroll time */
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem 0;
    opacity: 0.3;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.story-step.active {
    opacity: 1;
    transform: translateY(0);
}

.step-number {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 4rem;
    color: var(--primary-medium);
    line-height: 1;
    margin-bottom: 0.5rem;
}

.story-step h3 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 2rem;
    color: var(--primary);
    margin-bottom: 1rem;
}

.story-step p {
    font-size: 1.15rem;
    color: var(--text-dark);
    line-height: 1.7;
    max-width: 500px;
}

/* =============================================
   MOBILE FALLBACK (no sticky, stacked layout)
   ============================================= */

@media (max-width: 768px) {
    .scroll-story {
        flex-direction: column;
        gap: 0;
    }

    .scroll-story-phone {
        display: none; /* hide sticky phone on mobile */
    }

    .story-step {
        min-height: auto;
        padding: 3rem 0;
        opacity: 1;
        transform: none;
        border-bottom: 1px solid rgba(130, 89, 220, 0.1);
    }

    .story-step:last-child {
        border-bottom: none;
    }

    .step-number {
        font-size: 2.5rem;
    }

    .story-step h3 {
        font-size: 1.5rem;
    }

    /* Show phone image inline on mobile */
    .story-step::after {
        content: '';
        /* Could add inline images via background-image per step */
    }
}
```

### JavaScript (Scroll-Linked Logic)

```javascript
// =========================================
// SCROLL-LINKED STORY (How It Works)
// =========================================
const scrollStory = document.querySelector('.scroll-story');
if (scrollStory) {
    const steps = scrollStory.querySelectorAll('.story-step');
    const screens = scrollStory.querySelectorAll('.phone-screen');

    // Use Intersection Observer to detect which step is in the center of viewport
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepNum = entry.target.getAttribute('data-step');

                // Activate the content card
                steps.forEach(s => s.classList.remove('active'));
                entry.target.classList.add('active');

                // Crossfade to the matching phone screenshot
                screens.forEach(s => {
                    s.classList.remove('active');
                    // Reset position so inactive ones don't take space
                    s.style.position = 'absolute';
                });
                const activeScreen = scrollStory.querySelector(
                    `.phone-screen[data-step="${stepNum}"]`
                );
                if (activeScreen) {
                    activeScreen.classList.add('active');
                    activeScreen.style.position = 'relative';
                }
            }
        });
    }, {
        // Trigger when step is in the middle 40% of viewport
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0.1
    });

    steps.forEach(step => stepObserver.observe(step));
}
```

---

## Mobile Alternative

On mobile (< 768px), the sticky phone is hidden and the steps stack vertically with the existing `.reveal` scroll animation system. Each step could optionally show a small inline screenshot above the text.

A more advanced mobile approach: use a horizontal swipe carousel for the 4 steps (swipe left/right between Track → Discover → Act → Share), with a progress bar at the top showing 1/4, 2/4, etc. This is a common modern mobile pattern.

---

## Interaction Reference

The effect we're going for is similar to:
- **Apple product pages** (iPhone stays centered, features scroll past)
- **Stripe's homepage** (code editor stays pinned, content slides)
- **Linear.app** (features with sticky visual + scrolling text)

The key CSS property is `position: sticky` on the phone column. The JS uses Intersection Observer (same system we already have) to detect which step is centered and crossfades the phone screenshot. No external libraries needed.

---

## Files to Modify
1. `index.html` - Replace the 6 zigzag rows in #how-it-works with new scroll-story markup
2. `styles.css` - Add .how-it-works-section, .scroll-story, .story-step, .phone-frame styles
3. `script.js` - Add scroll-linked step observer logic

## Section Order After Implementation
Hero → **How Gaia Works (scroll story)** → Integrations Bar → Stats → Personas → Testimonials → Trust → Professionals → CTA → FAQ
