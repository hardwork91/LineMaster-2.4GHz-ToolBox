// Blog visibility control. Loaded by every page of the site.
//
// LM_BLOG_POSTS lists every existing post (filename only); LM_HIDDEN_POSTS
// the ones currently hidden from public view. A hidden post's page redirects
// to the blog index unless the URL includes ?hidden=false, and its card is
// left out of the /blog/ listing. While EVERY post is hidden, the "Blog"
// item is also removed from the site nav.
//
// To publish a post, remove its filename from LM_HIDDEN_POSTS. When adding
// a brand-new post, add it to LM_BLOG_POSTS (and to LM_HIDDEN_POSTS while
// it's still a draft).
window.LM_BLOG_POSTS = [
  "electric-vs-combustion.html",
  "throttle-cut.html",
  "slide-lock-redesign.html"
];

window.LM_HIDDEN_POSTS = [
  "electric-vs-combustion.html",
  "throttle-cut.html",
  "slide-lock-redesign.html"
];

// Hide the "Blog" nav link everywhere while every post is hidden.
// With ?hidden=false in the URL the site enters preview mode instead:
// everything stays visible, and the parameter is carried onto every
// internal link so preview mode follows you as you browse.
(function () {
  var all = window.LM_BLOG_POSTS;
  var hidden = window.LM_HIDDEN_POSTS;
  var allHidden = all.length > 0 && all.every(function (slug) {
    return hidden.indexOf(slug) !== -1;
  });
  var override = new URLSearchParams(location.search).get("hidden") === "false";

  function hideBlogNav() {
    document.querySelectorAll(".nav-links > a").forEach(function (a) {
      if (a.textContent.trim() === "Blog") a.style.display = "none";
    });
  }

  function propagateParam() {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;            // same-page anchor
      if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return;          // mailto:, https:, etc.
      try {
        var u = new URL(href, location.href);
        if (u.origin !== location.origin) return;
        if (u.searchParams.get("hidden") === "false") return;
        u.searchParams.set("hidden", "false");
        a.setAttribute("href", u.pathname + u.search + u.hash);
      } catch (e) {}
    });
  }

  function run() {
    if (override) {
      propagateParam();
    } else if (allHidden) {
      hideBlogNav();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
