/**
 * Go Go Gaia — Cookie consent gate for GA4
 *
 * Strict opt-in: gtag.js is never requested from Google until the visitor
 * clicks "Allow analytics". Until then window.gtag is a safe no-op so any
 * script that calls gtag(...) (analytics-events.js, script.js) never throws
 * and never queues events for a later replay — a call made before consent
 * is simply dropped, not retroactively reported after a later grant.
 */
(function () {
  'use strict';

  var GA_ID = 'G-ZEM6KB1QWF';
  var CONSENT_KEY = 'analytics-consent';

  // Safe no-op so gtag(...) is always callable, everywhere, before consent.
  window.gtag = window.gtag || function () {};

  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);
  }

  function setConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {
      /* localStorage unavailable (private mode, etc.) — banner will just reappear next visit */
    }
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

  function showBanner() {
    injectStyle();

    var banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');

    var text = document.createElement('p');
    text.textContent = 'We use optional analytics cookies to understand how people use the site. Nothing runs until you choose. ';
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
      loadGA();
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

  function removeBanner() {
    var banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.parentNode.removeChild(banner);
  }

  function init() {
    var consent;
    try {
      consent = localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      consent = null;
    }

    if (consent === 'granted') {
      loadGA();
    } else if (consent === null) {
      if (document.body) {
        showBanner();
      } else {
        document.addEventListener('DOMContentLoaded', showBanner);
      }
    }
    // consent === 'denied' -> do nothing, gtag stays the safe no-op
  }

  init();
})();
