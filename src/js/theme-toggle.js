// Light is the default (no attribute). The icons swap purely in CSS,
// based on data-theme, so this only has to flip and remember the choice.
(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  btn.addEventListener("click", function () {
    var dark = root.getAttribute("data-theme") === "dark";
    if (dark) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", "dark");
    }
    try { localStorage.setItem("lantera-theme", dark ? "light" : "dark"); } catch (e) {}
  });
})();
