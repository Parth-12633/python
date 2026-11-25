// Sizes the 430-unit design for desktop widths before first paint (no layout jump).
(function () {
  try {
    var w = document.documentElement.clientWidth;
    if (!w || window.matchMedia("(max-width: 767.98px)").matches) return;
    if (document.getElementById("inv-presize")) return;
    var B = [768, 834, 960, 1280, 1515, 1920], b = B[0];
    for (var i = 0; i < B.length; i++) { if (B[i] <= w) b = B[i]; }
    var s = document.createElement("style");
    s.id = "inv-presize";
    s.textContent = "[data-invitation-layout] > [data-invitation-content]{width:" + b + "px;min-width:" + b + "px;max-width:" + b + "px;zoom:" + (w / b) + "}";
    document.head.appendChild(s);
  } catch (e) {}
})();
