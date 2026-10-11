// Datos en vivo desde el panel de admin: promociones, premios y reseñas.
import { db, configurado, escapar, premioCorto } from "./firebase.js";
import { NEGOCIO } from "./firebase-config.js";
import { collection, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = (id) => document.getElementById(id);
const porFecha = (a, b) => (b.creado?.seconds || 0) - (a.creado?.seconds || 0);
const ESTRELLA = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5-4.9-4.6 6.6-.8z"/></svg>';

// Cada promo es un link que abre "Agendar" con esa promo ya elegida
function tarjetaPromo(p) {
  return `<a class="card promo" href="agendar.html?promo=${encodeURIComponent(p.titulo)}">` +
    `<div class="tag">Promo</div>` +
    `<div class="display">${escapar(p.titulo)}</div>` +
    (p.detalle ? `<p>${escapar(p.detalle)}</p>` : "") +
    `<span class="promo-cta">Agendar con esta promo →</span></a>`;
}

function pintarPromos(lista) {
  if ($("promosInicio")) {
    $("promosDestacadas").hidden = !lista.length;
    $("promosInicio").innerHTML = lista.slice(0, 3).map(tarjetaPromo).join("");
  }
  if ($("listaPromosWeb")) {
    $("promociones").hidden = !lista.length;
    $("listaPromosWeb").innerHTML = lista.map(tarjetaPromo).join("");
  }
}

function pintarPremios(cfg = {}) {
  const textos = {
    mitad: cfg.premioMitad || NEGOCIO.premioMitad.texto,
    final: cfg.premioFinal || NEGOCIO.premioFinal.texto,
    cumple: cfg.promoCumple || NEGOCIO.promoCumple
  };
  document.querySelectorAll("[data-premio]").forEach((el) => {
    const t = textos[el.dataset.premio];
    if (t && !/^\s*\[/.test(t)) el.textContent = t.charAt(0).toLowerCase() + t.slice(1);
  });
  document.querySelectorAll("[data-premio-corto]").forEach((el) => {
    const t = textos[el.dataset.premioCorto];
    if (t && !/^\s*\[/.test(t)) { el.textContent = premioCorto(t); el.title = t; }
  });
}

function pintarResenas(lista) {
  const el = $("listaResenas");
  if (!el || !lista.length) return; // sin reseñas en el panel: se quedan los temas destacados
  el.innerHTML = `<div class="review-grid">` + lista.slice(0, 6).map((r) => {
    const n = Math.max(1, Math.min(5, Number(r.estrellas) || 5));
    return `<figure class="review">` +
      `<div class="stars" role="img" aria-label="${n} de 5 estrellas">${ESTRELLA.repeat(n)}</div>` +
      `<blockquote>“${escapar(r.texto)}”</blockquote>` +
      `<figcaption>${escapar(r.nombre)}<span>Reseña de Google</span></figcaption></figure>`;
  }).join("") + `</div>`;
}

pintarPremios();
if (!configurado) pintarPromos(NEGOCIO.promociones);

if (configurado) {
  if ($("promosInicio") || $("listaPromosWeb")) {
    onSnapshot(collection(db, "promos"), (snap) => {
      if (snap.empty) { pintarPromos(NEGOCIO.promociones); return; }
      pintarPromos(snap.docs.map((d) => d.data()).filter((p) => p.activa !== false).sort(porFecha));
    }, (ex) => { console.error(ex); pintarPromos(NEGOCIO.promociones); });
  }

  if (document.querySelector("[data-premio]")) {
    onSnapshot(doc(db, "config", "negocio"), (snap) => pintarPremios(snap.exists() ? snap.data() : {}),
      (ex) => console.error(ex));
  }

  if ($("listaResenas")) {
    onSnapshot(collection(db, "resenas"), (snap) => {
      pintarResenas(snap.docs.map((d) => d.data()).filter((r) => r.activa !== false).sort(porFecha));
    }, (ex) => console.error(ex));
  }
}
