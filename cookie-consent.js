/**
 * Go Go Gaia — GA4 Consent Mode v2, geo-scoped
 *
 * Google Consent Mode v2, not a hard load-gate. gtag.js loads on every page.
 * What differs by region is the DEFAULT consent state:
 *
 *   EU / EEA / UK / CH  -> analytics_storage denied by default + consent banner.
 *                          GA still sends a cookieless ping, so the visit is
 *                          counted, but no cookie or identifier is stored until
 *                          the visitor clicks "Allow analytics".
 *   Everywhere else     -> analytics_storage granted by default, no banner.
 *                          Full cookie-based measurement, which is what makes
 *                          users / sessions / returning-visitor data accurate.
 *
 * Why the split: cookieless pings keep you counted but not identified, and this
 * property is far below Google's behavioural-modelling volume threshold
 * (~1,000 events/day), so denied-state numbers are directional rather than
 * precise. ~81% of traffic is outside the EU/UK and has no opt-in requirement,
 * so granting there recovers full-fidelity data for most of the site.
 *
 * The previous implementation was a hard load-gate that made gtag a no-op until
 * a click, so ~94% of all traffic went uncounted — visitors read and leave
 * without ever touching a banner, and the pageview was dropped before they
 * could consent. See docs: GA4 consent gap, 2026-07-13 -> 2026-07-24.
 *
 * Region comes from the IANA timezone (Intl), not an IP lookup: no third-party
 * request, no latency, nothing to block. It over-includes rather than under-
 * includes (Europe/Moscow, Europe/Istanbul and friends get the strict path even
 * though they are not GDPR territories) and any detection failure falls back to
 * strict, so the error direction is always toward more privacy, never less.
 */
(function () {
  'use strict';

  var GA_ID = 'G-ZEM6KB1QWF';
  var CONSENT_KEY = 'analytics-consent';

  // EEA/UK/CH outliers that do not live under the Europe/* prefix.
  var STRICT_ZONES = [
    'Atlantic/Reykjavik',  // Iceland (EEA)
    'Atlantic/Faroe',      // Faroe Islands (DK)
    'Atlantic/Azores',     // Portugal
    'Atlantic/Madeira',    // Portugal
    'Atlantic/Canary'      // Spain
  ];

  /** True for EU/EEA/UK/CH visitors, and for anyone we cannot place. */
  function needsOptIn() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!tz) return true; // unknown -> strict
      if (tz.indexOf('Europe/') === 0) return true;
      return STRICT_ZONES.indexOf(tz) !== -1;
    } catch (e) {
      return true; // no Intl support -> strict
    }
  }

  // gtag must be callable synchronously, before gtag.js arrives, so that
  // analytics-events.js and script.js never throw. Commands queue in dataLayer
  // and replay once the library loads.
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  function storedConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null; // private mode etc. — treat as undecided
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {
      /* localStorage unavailable — banner will just reappear next visit */
    }
  }

  var consent = storedConsent();
  var strict = needsOptIn();

  // An explicit stored choice always wins over geo. Otherwise EU/UK starts
  // denied and everyone else starts granted.
  var analyticsDefault = consent === 'granted' ? 'granted'
    : consent === 'denied' ? 'denied'
    : strict ? 'denied' : 'granted';

  // Defaults MUST be set before the config command, or the first hit races the
  // consent state and can be sent under the wrong assumption.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: analyticsDefault,
    wait_for_update: 500
  });

  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(script);

  function grant() {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }

  function injectStyle() {
    if (document.getElementById('cookie-consent-style')) return;
    var style = document.createElement('style');
    style.id = 'cookie-consent-style';
    style.textContent =
      '#cookie-consent-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;' +
      'display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:16px;' +
      'padding:16px 20px;background:#2c2440;color:#fff;' +
      'font-family:\'Quicksand\',-apple-system,BlinkMacSystemFont,sans-serif;font-size:14px;' +
      'box-shadow:0 -2px 16px rgba(0,0,0,0.15);}' +
      '#cookie-consent-banner p{margin:0;max-width:520px;line-height:1.5;}' +
      '#cookie-consent-banner a{color:#c9b3ff;text-decoration:underline;}' +
      '#cookie-consent-banner .cc-actions{display:flex;gap:10px;flex-wrap:wrap;}' +
      '#cookie-consent-banner button{font-family:inherit;font-size:14px;font-weight:600;' +
      'border-radius:999px;padding:10px 20px;cursor:pointer;border:2px solid transparent;' +
      'transition:transform 0.15s ease;}' +
      '#cookie-consent-banner button:hover{transform:translateY(-1px);}' +
      '#cookie-consent-banner button:focus-visible{outline:3px solid #E84393;outline-offset:2px;}' +
      '#cc-allow{background:#8259DC;color:#fff;}' +
      '#cc-allow:hover{background:#5B23C6;}' +
      '#cc-deny{background:transparent;color:#fff;border-color:rgba(255,255,255,0.5);}' +
      '#cc-deny:hover{border-color:#fff;}';
    document.head.appendChild(style);
  }

  function removeBanner() {
    var banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.parentNode.removeChild(banner);
  }

  function showBanner() {
    injectStyle();

    var banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');

    var text = document.createElement('p');
    text.textContent = 'We use optional analytics cookies to understand how people use the site. Nothing is stored until you choose. ';
    var link = document.createElement('a');
    link.href = '/privacy-policy.html';
    link.textContent = 'Privacy policy';
    text.appendChild(link);

    var actions = document.createElement('div');
    actions.className = 'cc-actions';

    var allowBtn = document.createElement('button');
    allowBtn.id = 'cc-allow';
    allowBtn.type = 'button';
    allowBtn.textContent = 'Allow analytics';
    allowBtn.addEventListener('click', function () {
      setConsent('granted');
      grant();
      removeBanner();
    });

    var denyBtn = document.createElement('button');
    denyBtn.id = 'cc-deny';
    denyBtn.type = 'button';
    denyBtn.textContent = 'Only necessary';
    denyBtn.addEventListener('click', function () {
      setConsent('denied');
      removeBanner();
    });

    actions.appendChild(allowBtn);
    actions.appendChild(denyBtn);
    banner.appendChild(text);
    banner.appendChild(actions);
    document.body.appendChild(banner);
  }

  // Banner is only for undecided visitors on the strict path. Outside the
  // EU/UK the default is already granted, so there is nothing to ask.
  if (consent === null && strict) {
    if (document.body) {
      showBanner();
    } else {
      document.addEventListener('DOMContentLoaded', showBanner);
    }
  }
  // 'granted' -> already applied in the default above; 'denied' -> stays cookieless.
})();
