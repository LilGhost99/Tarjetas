// Partes de la página que salen de firebase-config.js (precios, barberos, pago, horario).
// No depende de Firebase: si no hay internet a Google, esto igual se muestra.
import { NEGOCIO } from "./firebase-config.js";

const $ = (id) => document.getElementById(id);
const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pesos = (n) => "$" + Number(n).toLocaleString("es-MX");
const pendiente = (v) => !v || /^\s*\[.*\]\s*$/.test(String(v));   // vacío o [POR LLENAR]
const EXT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
const CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

// ---------- Precios (Servicios) ----------
function pintarPrecios() {
  const el = $("listaPrecios");
  if (!el) return;
  el.innerHTML =
    `<div class="precio-head" aria-hidden="true"><span>Servicio</span><span>Sin cita</span><span>Con cita</span><span></span></div>` +
    NEGOCIO.servicios.map((s) =>
      `<a class="precio-row" href="agendar.html?servicio=${encodeURIComponent(s.id)}" aria-label="${esc(s.nombre)}: ${pesos(s.sinCita)} sin cita, ${pesos(s.conCita)} con cita. Agendar">` +
      `<span class="p-nombre">${esc(s.nombre)}</span><span class="p-sin">${pesos(s.sinCita)}</span>` +
      `<span class="p-con">${pesos(s.conCita)}</span><span class="p-ir" aria-hidden="true">›</span></a>`
    ).join("");
}

function pintarBeneficios() {
  const lista = (arr) => arr.map((b) => `<li>${CHECK}<span>${esc(b)}</span></li>`).join("");
  if ($("benSin")) $("benSin").innerHTML = lista(NEGOCIO.beneficios.sinCita);
  if ($("benCon")) $("benCon").innerHTML = lista(NEGOCIO.beneficios.conCita);
}

// ---------- Quién te corta ----------
function pintarBarberos() {
  const el = $("listaBarberos");
  if (!el) return;
  const varios = NEGOCIO.barberos.length > 1;
  el.innerHTML = NEGOCIO.barberos.map((b) => {
    const redes = [["Instagram", b.instagram], ["TikTok", b.tiktok], ["Facebook", b.facebook]]
      .filter(([, u]) => u && /^https?:\/\//.test(u));
    const foto = b.foto
      ? `<img src="${esc(b.foto)}" alt="${esc(b.nombre)}" loading="lazy">`
      : `<div class="b-vacia"><img src="logo.png" alt="" width="900" height="377" style="width:70%;height:auto;opacity:.35"><span>[FOTO]</span></div>`;
    const nombreCorto = pendiente(b.nombre) ? "" : b.nombre.split(" ")[0];
    const agendar = "agendar.html" + (varios && !pendiente(b.nombre) ? "?barbero=" + encodeURIComponent(b.nombre) : "");
    return `<article class="barbero">
      <div class="b-foto">${foto}</div>
      <div class="b-info">
        <div class="b-rol script">${esc(b.rol || "Barbero")}</div>
        <h3 class="display">${esc(b.nombre)}</h3>
        <p>${esc(b.descripcion)}</p>
        ${redes.length ? `<div class="b-redes">${redes.map(([n, u]) => `<a class="btn btn-ghost btn-sm" href="${esc(u)}" target="_blank" rel="noopener">${n} ${EXT}</a>`).join("")}</div>` : ""}
        <a class="btn btn-primary" href="${agendar}">${nombreCorto ? "Agenda con " + esc(nombreCorto) : "Agenda tu cita"}</a>
      </div>
    </article>`;
  }).join("");
}

// ---------- Botones que se despliegan ----------
function prepararVentajas() {
  const botones = [...document.querySelectorAll(".v-btn")];
  if (!botones.length) return;
  const panel = (b) => $(b.getAttribute("aria-controls"));
  botones.forEach((b) => b.addEventListener("click", () => {
    const abrir = b.getAttribute("aria-expanded") !== "true";
    botones.forEach((o) => {
      o.setAttribute("aria-expanded", "false");
      panel(o).classList.remove("abierto");
      panel(o).inert = true;
    });
    if (!abrir) return;
    b.setAttribute("aria-expanded", "true");
    const p = panel(b);
    p.classList.add("abierto");
    p.inert = false;
    setTimeout(() => {
      const r = p.getBoundingClientRect();
      if (r.bottom > window.innerHeight - 16) p.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 420);
  }));
}

// ---------- Datos de transferencia ----------
function prepararPago() {
  const pago = NEGOCIO.pago || {};
  document.querySelectorAll("[data-pago]").forEach((el) => {
    const v = pago[el.dataset.pago];
    el.textContent = v || "—";
  });
  document.querySelectorAll("[data-si]").forEach((el) => {
    if (!pago[el.dataset.si]) el.hidden = true;
  });
  document.querySelectorAll("[data-copiar]").forEach((btn) => {
    const valor = pago[btn.dataset.copiar];
    const etiqueta = btn.querySelector("span");
    if (pendiente(valor)) { btn.disabled = true; etiqueta.textContent = "Pendiente"; return; }
    btn.addEventListener("click", async () => {
      const limpio = String(valor).replace(/\s+/g, "");
      try {
        await navigator.clipboard.writeText(limpio);
        etiqueta.textContent = "¡Copiado!";
        btn.classList.add("copiado");
      } catch {
        window.prompt("Copia este número:", limpio);
      }
      setTimeout(() => { etiqueta.textContent = "Copiar"; btn.classList.remove("copiado"); }, 2200);
    });
  });
}

// ---------- Horario y "abierto ahora" (hora de Pachuca) ----------
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const aMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
const hora12 = (min) => {
  const h = Math.floor(min / 60), m = min % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
};
function ahoraPachuca() {
  const partes = new Intl.DateTimeFormat("en-US", { timeZone: "America/Mexico_City", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(new Date()).reduce((o, p) => (o[p.type] = p.value, o), {});
  const dia = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[partes.weekday];
  return { dia, min: (Number(partes.hour) % 24) * 60 + Number(partes.minute) };
}
function prepararHorario() {
  const h = NEGOCIO.horario, abre = aMin(h.abre), cierra = aMin(h.cierra);
  const { dia, min } = ahoraPachuca();
  const abiertoHoy = h.dias.includes(dia);
  const abierto = abiertoHoy && min >= abre && min < cierra;
  let corto, largo;
  if (abierto) {
    corto = `Abierto ahora · cierra ${hora12(cierra)}`;
    largo = `Abierto ahora · cierra a las ${hora12(cierra)}`;
  } else {
    let d = dia, cuando = "hoy";
    if (!(abiertoHoy && min < abre)) {
      for (let i = 1; i <= 7; i++) { d = (dia + i) % 7; if (h.dias.includes(d)) break; }
      cuando = d === (dia + 1) % 7 ? "mañana" : "el " + DIAS[d].toLowerCase();
    }
    corto = `Cerrado · abre ${cuando} ${hora12(abre)}`;
    largo = `Cerrado ahora · abre ${cuando} a las ${hora12(abre)}`;
  }
  if ($("estadoCorto")) $("estadoCorto").textContent = corto;
  if ($("estadoLargo")) {
    $("estadoLargo").textContent = largo;
    $("estadoLargo").classList.toggle("abierto", abierto);
  }
  const tabla = $("tablaHorario");
  if (tabla) {
    const orden = [1, 2, 3, 4, 5, 6, 0];
    tabla.tBodies[0].innerHTML = orden.map((d) =>
      `<tr${d === dia ? ' class="hoy"' : ""}><td>${DIAS[d]}${d === dia ? " · hoy" : ""}</td>` +
      `<td>${h.dias.includes(d) ? `${hora12(abre)} a ${hora12(cierra)}` : "Cerrado"}</td></tr>`).join("");
  }
}

pintarPrecios();
pintarBeneficios();
pintarBarberos();
prepararVentajas();
prepararPago();
prepararHorario();
setInterval(prepararHorario, 60000);
