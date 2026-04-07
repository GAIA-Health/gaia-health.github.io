/**
 * Go Go Gaia — Analytics Event Tracking
 * 1. CTA clicks (download + login)
 * 2. Scroll depth (25%, 50%, 75%, 100%)
 * 3. Engaged reader (30s+ on page)
 */

/* ── CTA click tracking ── */
document.addEventListener('click', function (e) {
  var link = e.target.closest('a');
  if (!link || typeof gtag !== 'function') return;

  var href = link.href || '';
  var text = link.textContent.trim().substring(0, 50);
  var location = link.closest('nav') ? 'navbar'
    : link.closest('.hero, .hero-section, #hero') ? 'hero'
    : link.closest('footer') ? 'footer'
    : 'page_body';

  if (href.indexOf('apps.apple.com') !== -1) {
    gtag('event', 'download_click', {
      link_text: text,
      link_location: location,
      page_path: window.location.pathname
    });
  }

  if (href.indexOf('app.go-go-gaia.com') !== -1) {
    gtag('event', 'login_click', {
      link_text: text,
      link_location: location,
      page_path: window.location.pathname
    });
  }
});

/* ── Scroll depth tracking ── */
(function () {
  if (typeof gtag !== 'function') return;
  var marks = [25, 50, 75, 100];
  var fired = {};

  function getScrollPercent() {
    var doc = document.documentElement;
    var body = document.body;
    var scrollTop = window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
    var scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight) - window.innerHeight;
    if (scrollHeight <= 0) return 100;
    return Math.round((scrollTop / scrollHeight) * 100);
  }

  window.addEventListener('scroll', function () {
    var pct = getScrollPercent();
    for (var i = 0; i < marks.length; i++) {
      if (pct >= marks[i] && !fired[marks[i]]) {
        fired[marks[i]] = true;
        gtag('event', 'scroll_depth', {
          percent: marks[i],
          page_path: window.location.pathname
        });
      }
    }
  }, { passive: true });
})();

/* ── Engaged reader (30s on page) ── */
(function () {
  if (typeof gtag !== 'function') return;
  setTimeout(function () {
    gtag('event', 'engaged_reader', {
      page_path: window.location.pathname
    });
  }, 30000);
})();
