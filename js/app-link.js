/* One place to change where the web app lives.
   Cutover = edit WOVE_APP_ORIGIN below (no trailing slash). Every
   <a data-app-link> keeps its path, query and UTM and gets this origin.
   <a data-app-link data-app-link-text> also swaps the app host shown in its text.
   The static href in each page is the no-JS fallback. */
window.WOVE_APP_ORIGIN = 'https://app.myveya.com';

(function () {
  function apply() {
    var origin = window.WOVE_APP_ORIGIN;
    var host = origin.replace(/^https?:\/\//, '');
    var links = document.querySelectorAll('a[data-app-link]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href') || '';
      var rest = href.replace(/^https?:\/\/[^\/?#]+/, '');
      a.setAttribute('href', origin + rest);
      if (a.hasAttribute('data-app-link-text')) a.textContent = a.textContent.replace(/app\.(?:myveya\.com|go-go-gaia\.com|wove\.care)/g, host);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
