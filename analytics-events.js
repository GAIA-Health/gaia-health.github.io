/**
 * Go Go Gaia — CTA Event Tracking
 * Tracks download (App Store) and login button clicks via GA4.
 * Uses event delegation so it works for every button pattern on the site.
 */
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
