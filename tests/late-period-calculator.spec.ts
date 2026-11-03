import { test, expect } from '@playwright/test';

/** Smoke test for tools/late-period-calculator.html. "Today" pinned to 2026-10-09. */
const URL = '/tools/late-period-calculator.html';

test('late period calculator: renders and flags a late period', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route(/googletagmanager|google-analytics/, r => r.abort());
  await page.clock.setFixedTime(new Date('2026-10-09T12:00:00'));
  await page.goto(URL);
  await expect(page.locator('h1')).toHaveText('Is My Period Late? Late Period Calculator');
  for (const b of await page.locator('script[type="application/ld+json"]').allTextContents()) {
    expect(() => JSON.parse(b)).not.toThrow();
  }
  // 40 days before 2026-10-09, 28-day cycle (default) -> 12 days late
  await page.fill('#lmpDate', '2026-08-30');
  await expect(page.locator('.late-note').first()).toContainText('12 days late');
  await expect(page.locator('#results a[href*="apps.apple.com"]')).toHaveCount(0);
  // save link: compact, hash-only dates, newest first
  await page.click('#moreDates summary');
  const inputs = page.locator('#extraDates input');
  await inputs.nth(0).fill('2026-08-02');
  await inputs.nth(1).fill('2026-07-05');
  const link = page.locator('#lateSave a#saveDatesLink');
  await expect(link).toHaveText('Save my dates and keep tracking');
  const href = (await link.getAttribute('href'))!;
  expect(href).toContain('mode=signup');
  expect(new globalThis.URL(href).search).not.toMatch(/2026/);
  const payload = JSON.parse(Buffer.from(new globalThis.URL(href).hash.slice(6).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  expect(payload.src).toBe('late-period-calculator');
  expect(payload.starts).toEqual(['2026-08-30', '2026-08-02', '2026-07-05']);
  expect(errors).toEqual([]);
});
