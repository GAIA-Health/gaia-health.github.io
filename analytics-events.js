/**
 * Go Go Gaia — Analytics Event Tracking
 * 1. CTA clicks (download + login)
 * 2. Scroll depth (25%, 50%, 75%, 100%)
 * 3. Engaged reader (30s+ on page)
 * 4. CTA visibility (IntersectionObserver on .blog-cta-box)
 * 5. Blog internal navigation clicks
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

/* ── CTA box visibility tracking ── */
(function () {
  if (typeof gtag !== 'function' || typeof IntersectionObserver === 'undefined') return;
  var boxes = document.querySelectorAll('.blog-cta-box');
  if (!boxes.length) return;

  var observer = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        var box = entries[i].target;
        var heading = box.querySelector('h3, h4, h5');
        gtag('event', 'cta_visible', {
          cta_text: heading ? heading.textContent.trim().substring(0, 60) : 'unknown',
          page_path: window.location.pathname
        });
        observer.unobserve(box);
      }
    }
  }, { threshold: 0.5 });

  for (var i = 0; i < boxes.length; i++) {
    observer.observe(boxes[i]);
  }
})();

/* ── Blog internal navigation clicks ── */
document.addEventListener('click', function (e) {
  var link = e.target.closest('a');
  if (!link || typeof gtag !== 'function') return;
  if (link.hostname !== window.location.hostname) return;
  if (link.pathname === window.location.pathname) return;
  if (!window.location.pathname.match(/^\/blog\//)) return;

  gtag('event', 'blog_internal_click', {
    from_page: window.location.pathname,
    to_page: link.pathname,
    link_text: link.textContent.trim().substring(0, 60)
  });
});
