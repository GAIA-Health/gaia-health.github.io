import { test, expect, type Page } from '@playwright/test';

/**
 * Smoke suite for tools/period-calculator.html (Calculator Hub Phase A).
 * "Today" is pinned to 2026-10-09 so the numbers match the module's own tests
 * (node js/cycle-predict.js --test): S1 = H1, S2 = P2, S3 = P1.
 */
const URL = '/tools/period-calculator.html';
const APP = '#results a[href*="apps.apple.com"]';
const SHOTS = process.env.PC_SHOTS_DIR;

async function setup(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  // Third-party hosts (GA, fonts, CDN) are irrelevant to this test and may be offline.
  await page.route(/googletagmanager|google-analytics/, r => r.abort());
  await page.clock.setFixedTime(new Date('2026-10-09T12:00:00'));
  return errors;
}
const firstParty = (errs: string[]) => errs.filter(e => !/net::ERR|Failed to load resource/.test(e));

test.describe('period calculator', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('page basics: one title, JSON-LD parses, no App Store link in results before a result', async ({ page }) => {
    const errors = await setup(page);
    await page.goto(URL);
    expect(await page.locator('title').count()).toBe(1);
    await expect(page).toHaveTitle('Period Calculator: Next Period & How Late Am I?');
    await expect(page.locator('h1')).toHaveText('Period Calculator');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const b of blocks) expect(() => JSON.parse(b)).not.toThrow();
    expect(await page.locator(APP).count()).toBe(0);
    expect(firstParty(errors)).toEqual([]);
  });

  test('S1 regular 28-day cycle, one date: instant result, range +/-3', async ({ page }) => {
    const errors = await setup(page);
    await page.goto(URL);
    await page.fill('#lmpDate', '2026-09-25');
    await expect(page.locator('.pc-range')).toHaveText('Oct 20–26');
    await expect(page.locator('.pc-likely')).toContainText('October 23, 2026');
    await expect(page.locator('.pc-details .key-date-box').first()).toContainText('Oct 4–10');
    expect(await page.locator(APP).count()).toBe(1);
    await expect(page.locator(`${APP}[data-cta-placement="tool_result"]`)).toHaveCount(1);
    await expect(page.locator('#appHandoff h3')).toContainText('most likely Oct 23');
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/s1-desktop.png`, fullPage: false });
    expect(firstParty(errors)).toEqual([]);
  });

  test('S2 irregular, 6 extra dates: data engine, wide range', async ({ page }) => {
    const errors = await setup(page);
    await page.goto(URL);
    await page.fill('#lmpDate', '2026-09-28');
    await page.selectOption('#cycleLength', '30');
    await page.fill('#periodLength', '5');
    await page.click('#moreDates summary');
    const extra = ['2026-08-19', '2026-07-23', '2026-06-17', '2026-05-17', '2026-04-22', '2026-03-31'];
    const inputs = page.locator('#extraDates input');
    for (let i = 0; i < extra.length; i++) await inputs.nth(i).fill(extra[i]);
    await expect(page.locator('.pc-range')).toHaveText('Oct 30 – Nov 12');
    await expect(page.locator('.pc-likely')).toContainText('October 30, 2026');
    await expect(page.locator('.pc-confidence').first()).toContainText('Your last 6 cycles ran 22–40 days');
    await expect(page.locator('.pc-details .key-date-box').first()).toContainText('Oct 8–14');
    expect(await page.locator(APP).count()).toBe(1);
    await page.waitForTimeout(900); // URL state is written after an 800ms pause
    expect(page.url()).toContain('dates=2026-08-19');
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/s2-desktop.png`, fullPage: false });
    expect(firstParty(errors)).toEqual([]);
  });

  test('S3 URL state load: 5 regular dates tighten the range to +/-1', async ({ page }) => {
    const errors = await setup(page);
    await page.goto(`${URL}?lmp=2026-09-20&len=28&plen=5&dates=2026-08-22,2026-07-25,2026-06-26,2026-05-27`);
    await expect(page.locator('#lmpDate')).toHaveValue('2026-09-20');
    await expect(page.locator('.pc-range')).toHaveText('Oct 18–20');
    await expect(page.locator('.pc-likely')).toContainText('October 19, 2026');
    await expect(page.locator('.pc-details .key-date-box').first()).toContainText('Oct 29 – Nov 4');
    expect(await page.locator(APP).count()).toBe(1);
    expect(firstParty(errors)).toEqual([]);
  });

  test('birth control: never "late", fertile window hidden', async ({ page }) => {
    await setup(page);
    await page.goto(`${URL}?lmp=2026-09-01&len=28&bc=1`);
    await expect(page.locator('.late-note')).toContainText("we don't call a bleed late");
    await expect(page.locator('#results')).not.toContainText('days late');
    await expect(page.locator('#results')).not.toContainText('fertile window after it');
  });
});

test.describe('period calculator, mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('mobile result renders with one App Store link', async ({ page }) => {
    const errors = await setup(page);
    await page.goto(`${URL}?lmp=2026-09-25&len=28`);
    await expect(page.locator('.pc-range')).toHaveText('Oct 20–26');
    expect(await page.locator(APP).count()).toBe(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    if (SHOTS) { await page.locator('#results').scrollIntoViewIfNeeded(); await page.screenshot({ path: `${SHOTS}/s1-mobile.png` }); }
    expect(firstParty(errors)).toEqual([]);
  });
});
