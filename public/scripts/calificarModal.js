// ─── Estado del módulo ───────────────────────────────────────────────────────
let alumnoActual  = null;
let practicaActual = null;

// ─── Apertura del modal ──────────────────────────────────────────────────────
document.addEventListener("click", e => {
  if (!e.target.classList.contains("btn-calificar")) return;

  const btn = e.target;

  alumnoActual  = btn.dataset.alumno;
  practicaActual = btn.dataset.practica;

  const respuestas = JSON.parse(btn.dataset.json || "{}");
  const valores    = Object.values(respuestas);
  const esEdicion  = valores.length > 0 && typeof valores[0] === "object";

  document.getElementById("modalTitulo").textContent =
    esEdicion ? "Editar calificación" : "Calificar práctica";

  crearPreguntas(respuestas, esEdicion);
  abrirModal();
});

// ─── Cálculo en tiempo real ──────────────────────────────────────────────────
document.addEventListener("input", e => {
  if (e.target.classList.contains("input-calificacion")) {
    recalcularTotal(); // antes estaba duplicado aquí, ahora reutiliza la función
  }
});

// ─── Guardado ────────────────────────────────────────────────────────────────
document.addEventListener("submit", async e => {
  if (e.target.id !== "formCalificacion") return;
  e.preventDefault();

  const inputs = document.querySelectorAll(".input-calificacion");
  const { total, respuestasJson } = construirResultado(inputs);

  await fetch("/api/profesor/calificar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      alumno_id:      alumnoActual,
      practica_id:    practicaActual,
      calificacion:   total,
      respuestas_json: respuestasJson,
    }),
  });

  cerrarModal();
  location.reload();
});

// ─── Cierre con clic en overlay ──────────────────────────────────────────────
window.addEventListener("click", e => {
  const modal = document.getElementById("modalCalificar");
  if (e.target === modal) cerrarModal();
});

// ─── Funciones ───────────────────────────────────────────────────────────────
function abrirModal() {
  document.getElementById("modalCalificar").style.display = "flex";
}

function cerrarModal() {
  document.getElementById("modalCalificar").style.display = "none";
}

function recalcularTotal() {
  const inputs = document.querySelectorAll(".input-calificacion");
  const total  = calcularPromedio(inputs);
  document.getElementById("previewCalificacion").textContent = total.toFixed(2);
}

// Separar el cálculo puro de la manipulación del DOM hace la lógica testeable
function calcularPromedio(inputs) {
  if (!inputs.length) return 0;
  let suma = 0;
  inputs.forEach(i => {
    const val = Number(i.value);
    if (!isNaN(val)) suma += val;
  });
  return (suma / inputs.length) * 10;
}

function construirResultado(inputs) {
  let suma = 0;
  const respuestasJson = {};

  inputs.forEach(input => {
    const calificacion   = Number(input.value) || 0;
    const respuestaTexto = input.parentElement.querySelector(".respuesta-texto").innerText;

    respuestasJson[input.dataset.pregunta] = {
      respuesta:   respuestaTexto,
      calificacion,
    };

    suma += calificacion;
  });

  return {
    total:         (suma / inputs.length) * 10,
    respuestasJson,
  };
}

function crearPreguntas(respuestas, esEdicion) {
  const container = document.getElementById("preguntasContainer");
  container.innerHTML = "";

  if (!respuestas || Object.keys(respuestas).length === 0) {
    container.innerHTML = "<p>No hay respuestas disponibles</p>";
    return;
  }

  Object.entries(respuestas).forEach(([pregunta, valor], index) => {
    const respuestaTexto = esEdicion ? valor.respuesta  : valor;
    const calificacion   = esEdicion ? (valor.calificacion ?? "") : "";

    const div = document.createElement("div");
    div.className = "pregunta-box";
    div.innerHTML = `
      <label>${index + 1}. ${pregunta}</label>
      <p class="respuesta-texto">${respuestaTexto}</p>
      <input
        type="number" min="0" max="1" step="0.01"
        value="${calificacion}"
        class="input-calificacion"
        data-pregunta="${pregunta}"
        required
      >
    `;
    container.appendChild(div);
  });

  recalcularTotal();
}