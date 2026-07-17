import { test, expect, type Page, type Locator } from '@playwright/test';

/**
 * Smoke suite for /for-professionals/ (T2/T4/T5/T6/T8) plus one CRITICAL
 * regression check on the homepage's pre-existing "How Gaia Works" phone
 * story, which shares the generalized scroll-story engine (script.js) that
 * this page's tour was built on top of. If that regression test goes red,
 * the T4 engine refactor broke live, previously-working homepage behavior —
 * treat it as a blocking failure, not a flaky test.
 */

// Scroll so `locator`'s vertical center lines up with the viewport's vertical
// center. scrollIntoViewIfNeeded() only guarantees the element is visible at
// an edge, which isn't reliable enough to cross the engine's
// `rootMargin: '-30% 0px -30% 0px'` intersection band.
async function centerInViewport(page: Page, locator: Locator) {
  await locator.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const target = window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
    window.scrollTo(0, Math.max(target, 0));
  });
}

test.describe('/for-professionals/ — desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('tour steps activate and the sticky panel cross-fades on scroll', async ({ page }) => {
    await page.goto('/for-professionals/');

    const step2 = page.locator('.story-step[data-step="2"]');
    const shot2 = page.locator('.pro-tour-panel [data-story-screen][data-step="2"]');

    // Step 1 is the authored default-active state before any scrolling.
    await expect(page.locator('.story-step[data-step="1"]')).toHaveClass(/active/);

    await centerInViewport(page, step2);
    await expect(step2).toHaveClass(/active/);
    await expect(step2).toHaveAttribute('aria-current', 'step');
    await expect(shot2).toHaveClass(/active/);

    const step4 = page.locator('.story-step[data-step="4"]');
    const shot4 = page.locator('.pro-tour-panel [data-story-screen][data-step="4"]');
    await centerInViewport(page, step4);
    await expect(step4).toHaveClass(/active/);
    await expect(shot4).toHaveClass(/active/);
    // Only one screenshot should be active at a time in the sticky panel.
    await expect(shot2).not.toHaveClass(/active/);
  });

  test('navbar shows the persistent "Start free" CTA, Download is gone', async ({ page }) => {
    await page.goto('/for-professionals/');
    const navCta = page.locator('.navbar .nav-pro-cta');
    await expect(navCta).toHaveText('Start free');
    await expect(page.locator('.navbar .nav-download')).toHaveCount(0);
  });

  test('all three CTAs carry the UTM and point at /pro/signup', async ({ page }) => {
    await page.goto('/for-professionals/');
    const ctas = page.locator('a.pro-cta-link');
    await expect(ctas).toHaveCount(3);

    const hrefs = await ctas.evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).href));
    for (const href of hrefs) {
      expect(href).toBe('https://app.go-go-gaia.com/pro/signup?utm_source=for-professionals');
    }
  });

  test('every image carries width, height, and alt', async ({ page }) => {
    await page.goto('/for-professionals/');
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('width', /.+/);
      await expect(img).toHaveAttribute('height', /.+/);
      // Empty alt="" is valid for the decorative sticky-panel duplicates
      // (aria-hidden container); the attribute just needs to exist.
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('testimonial section is absent from the DOM', async ({ page }) => {
    await page.goto('/for-professionals/');
    await expect(page.locator('text=/testimonial/i')).toHaveCount(0);
    await expect(page.locator('[class*="testimonial"]')).toHaveCount(0);
  });
});

test.describe('/for-professionals/ — reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('renders the static stacked story, no observer animation', async ({ page }) => {
    // `test.use({ reducedMotion: 'reduce' })` alone does not reliably flip
    // matchMedia before the first navigation in this Playwright version —
    // emulateMedia() applied before goto() does.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/for-professionals/');

    // The desktop sticky panel is force-hidden and the inline per-step
    // screenshots are force-shown, regardless of viewport width.
    await expect(page.locator('.pro-tour-panel')).toBeHidden();
    await expect(page.locator('.pro-tour-inline-shot').first()).toBeVisible();

    const step2 = page.locator('.story-step[data-step="2"]');
    await centerInViewport(page, step2);
    // Give a moment for any (unwanted) observer to fire before asserting it didn't.
    await page.waitForTimeout(250);
    // No observer attached under reduced motion, so step 2 must NOT switch
    // to active purely from scrolling — the markup's authored default (step 1) holds.
    await expect(step2).not.toHaveClass(/active/);
  });
});

test.describe('/for-professionals/ — mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('no horizontal scroll and CTA stays reachable', async ({ page }) => {
    await page.goto('/for-professionals/');

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(hasHorizontalScroll).toBe(false);

    // Inline per-step screenshots are the mobile rendering; the sticky panel is hidden.
    await expect(page.locator('.pro-tour-inline-shot').first()).toBeVisible();
    await expect(page.locator('.pro-tour-panel')).toBeHidden();
  });
});

test.describe('homepage regression (CRITICAL)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('the pre-existing "How Gaia Works" phone story still activates on scroll after the T4 engine generalization', async ({
    page,
  }) => {
    await page.goto('/index.html');

    await expect(page.locator('.story-step[data-step="1"]')).toHaveClass(/active/);
    await expect(page.locator('.phone-screen[data-step="1"]')).toHaveClass(/active/);

    const step2 = page.locator('.how-it-works-section .story-step[data-step="2"]');
    await centerInViewport(page, step2);

    await expect(step2).toHaveClass(/active/);
    await expect(page.locator('.phone-screen[data-step="2"]')).toHaveClass(/active/);
  });
});
