// Conexión a Firebase (no necesitas editar este archivo)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

export const configurado = !String(firebaseConfig.apiKey).includes("PEGA_AQUI");
export const app = configurado ? initializeApp(firebaseConfig) : null;
export const db = configurado ? getFirestore(app) : null;
export const auth = configurado ? getAuth(app) : null;

// Utilidades compartidas
export const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

export function esMesDeCumple(cumple) {
  if (!cumple) return false;
  const mes = Number(cumple.split("-")[0]);
  return mes === new Date().getMonth() + 1;
}

export function cumpleBonito(cumple) {
  if (!cumple) return "";
  const [m, d] = cumple.split("-").map(Number);
  return `${d} de ${MESES[m - 1]}`;
}

export function escapar(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

// Versión corta del premio para que quepa dentro del círculo: "Facial gratis" → "FACIAL\nGRATIS", "50% de descuento…" → "50%\nDESC."
export function premioCorto(texto) {
  const t = String(texto || "").trim();
  const pct = t.match(/(\d+)\s*%/);
  if (pct) return `${pct[1]}%\nDESC.`;
  const palabras = t.split(/\s+/).filter((w) => !/^(de|en|el|la|los|las|tu|tus|un|una|y|con|al|del|para)$/i.test(w));
  return palabras.slice(0, 2).join("\n").toUpperCase();
}

// Dibuja la cuadrícula de sellos dentro de `el`
export function pintarSellos(el, sellos, NEGOCIO) {
  el.innerHTML = "";
  for (let i = 1; i <= NEGOCIO.sellosPorTarjeta; i++) {
    const s = document.createElement("div");
    const premio = i === NEGOCIO.premioMitad.en ? NEGOCIO.premioMitad.texto : i === NEGOCIO.premioFinal.en ? NEGOCIO.premioFinal.texto : "";
    s.className = "sello" + (i <= sellos ? " lleno" : "") + (premio ? " premio" : "") + (premio && i > sellos ? " con-texto" : "");
    s.textContent = i <= sellos ? "✓" : (premio ? premioCorto(premio) : i);
    if (premio) s.title = premio;
    s.setAttribute("aria-label", `Sello ${i}${i <= sellos ? ", obtenido" : ""}${premio ? ", premio: " + premio : ""}`);
    el.appendChild(s);
  }
}
