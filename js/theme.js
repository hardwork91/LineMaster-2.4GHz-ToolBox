// Light/dark theme for the whole site. Dark is the default; the choice
// persists in localStorage under "lm-theme". Load this synchronously in
// <head> (after the CSS links) so data-theme is set before first paint
// and the page never flashes the wrong theme.
(function () {
  var stored = null;
  try { stored = localStorage.getItem("lm-theme"); } catch (e) {}
  var theme = stored === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme);

  function wire() {
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        try { localStorage.setItem("lm-theme", next); } catch (e) {}
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
