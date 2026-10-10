/**
 * brand.js: the one place tools read the product name and app links from, so the
 * coming rename is a one-file swap. ES module + window.Brand global.
 * Wired so far: tools/period-calculator.html (other tools follow in Phase B).
 *
 * Keep the App Store UTM generic (ct=gogogaia.com): never per-page ct= tokens.
 */
export const BRAND = 'Veya';
export const FORMER_NAME = 'Go Go Gaia';
export const FORMERLY = `${BRAND} (formerly ${FORMER_NAME})`;
export const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6608432371?pt=127249655&ct=gogogaia.com&mt=8';
export const WEB_APP_URL = 'https://app.myveya.com';

/** Web-app sign-up link with the same UTM shape the tool pages already use. */
export function webAppSignupUrl(campaign) {
  return `${WEB_APP_URL}/login?mode=signup&utm_source=website&utm_medium=caption&utm_campaign=${encodeURIComponent(campaign || 'tools')}`;
}

const Brand = { BRAND, FORMER_NAME, FORMERLY, APP_STORE_URL, WEB_APP_URL, webAppSignupUrl };
if (typeof window !== 'undefined') window.Brand = Brand;
export default Brand;
