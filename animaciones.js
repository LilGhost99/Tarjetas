// Animaciones de las páginas públicas: aparecer al hacer scroll y contadores.
// El encabezado se esconde al bajar y regresa al subir, para dejar más pantalla libre.
(function () {
  var ultimo = window.scrollY, pendiente = false;
  function revisar() {
    pendiente = false;
    var header = document.querySelector("header");
    if (!header) return;
    var y = window.scrollY;
    if (y > ultimo + 4 && y > 140) header.classList.add("oculto");
    else if (y < ultimo - 4 || y < 140) header.classList.remove("oculto");
    ultimo = y;
  }
  window.addEventListener("scroll", function () {
    if (!pendiente) { pendiente = true; requestAnimationFrame(revisar); }
  }, { passive: true });
  // Si alguien navega con teclado y entra al menú, que se vea
  document.addEventListener("focusin", function (e) {
    var header = document.querySelector("header");
    if (header && header.contains(e.target)) header.classList.remove("oculto");
  });
})();

(function () {
  var reducir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var soporta = "IntersectionObserver" in window;
  if (reducir || !soporta) return; // sin animaciones: todo se ve normal
  document.documentElement.classList.add("anim");

  function contar(el) {
    var meta = parseFloat(el.getAttribute("data-contar"));
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    var inicio = null, dur = 1300;
    function paso(t) {
      if (!inicio) inicio = t;
      var p = Math.min(1, (t - inicio) / dur);
      var suave = 1 - Math.pow(1 - p, 3);
      el.textContent = (meta * suave).toFixed(dec);
      if (p < 1) requestAnimationFrame(paso);
      else el.textContent = meta.toFixed(dec);
    }
    requestAnimationFrame(paso);
  }

  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      e.target.querySelectorAll("[data-contar]").forEach(contar);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  function iniciar() {
    document.querySelectorAll(".reveal").forEach(function (el) { obs.observe(el); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();

// Ver foto en grande al tocarla
(function () {
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".zoom");
    if (!b) return;
    var img = b.querySelector("img");
    var d = document.getElementById("visor");
    if (!d) {
      d = document.createElement("dialog");
      d.id = "visor"; d.className = "visor";
      d.innerHTML = '<img alt=""><p></p><button type="button" class="cerrar" aria-label="Cerrar">×</button>';
      d.addEventListener("click", function (ev) { if (ev.target === d || ev.target.classList.contains("cerrar")) d.close(); });
      document.body.appendChild(d);
    }
    d.querySelector("img").src = img.currentSrc || img.src;
    d.querySelector("img").alt = img.alt;
    d.querySelector("p").textContent = img.alt;
    if (d.showModal) d.showModal(); else window.open(img.src, "_blank");
  });
})();
