(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  function isLight() {
    return root.getAttribute("data-theme") === "light";
  }

  function render() {
    btn.textContent = isLight() ? "🌙" : "☀️";
  }

  render();

  btn.addEventListener("click", function () {
    if (isLight()) {
      root.removeAttribute("data-theme");
      try { localStorage.setItem("lantera-theme", "dark"); } catch (e) {}
    } else {
      root.setAttribute("data-theme", "light");
      try { localStorage.setItem("lantera-theme", "light"); } catch (e) {}
    }
    render();
  });
})();
