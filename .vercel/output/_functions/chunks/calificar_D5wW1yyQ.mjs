import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { r as renderTemplate, l as renderComponent, m as maybeRenderHead, h as addAttribute } from './entrypoint_ChOhswpG.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_D4M1pcOC.mjs';
import { $ as $$GrupoSelector } from './GrupoSelector_BKgopKbw.mjs';
import { g as getGroupsByTeacher, $ as $$TeacherSection } from './grupoService_NNlHUbJ0.mjs';
import { r as requireProfesor } from './profesor_BQVgECzC.mjs';
import { s as supabaseAdmin } from './supabaseAdmin_Bl60ioa3.mjs';
import { b as getAssignedPracticesByGroup } from './asignacionService_D0PiZiM0.mjs';

async function getStudentsByTeacher(profesorId, grupoId) {
  const grupoValido = await verificarGrupo(profesorId, grupoId);
  if (!grupoValido) return [];
  const alumnos = await fetchAlumnos(grupoId);
  if (!alumnos.length) return [];
  const alumnoIds = alumnos.map((a) => a.alumno_id);
  const [usuarios, resultados] = await Promise.all([
    fetchUsuarios(alumnoIds),
    fetchResultados(alumnoIds)
  ]);
  const practicaIds = resultados.map((r) => r.practica_id);
  const practicas = await fetchPracticas(practicaIds);
  return construirLista(alumnos, usuarios, resultados, practicas);
}
async function verificarGrupo(profesorId, grupoId) {
  const { data } = await supabaseAdmin.from("grupos").select("grupo_id").eq("grupo_id", grupoId).eq("profesor_id", profesorId).single();
  return !!data;
}
async function fetchAlumnos(grupoId) {
  const { data, error } = await supabaseAdmin.from("alumnos").select("alumno_id, boleta").eq("grupo_id", grupoId);
  if (error) throw error;
  return data ?? [];
}
async function fetchUsuarios(alumnoIds) {
  const { data } = await supabaseAdmin.from("usuarios").select("usuario_id, nombre, apellido_paterno, apellido_materno").in("usuario_id", alumnoIds);
  return data ?? [];
}
async function fetchResultados(alumnoIds) {
  const { data } = await supabaseAdmin.from("resultados").select("alumno_id, practica_id, calificacion, respuestas_json").in("alumno_id", alumnoIds);
  return data ?? [];
}
async function fetchPracticas(practicaIds) {
  const { data } = await supabaseAdmin.from("practicas").select("practica_id, titulo").in("practica_id", practicaIds);
  return data ?? [];
}
function construirNombre(usuario) {
  if (!usuario) return "Sin nombre";
  return `${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`;
}
function construirLista(alumnos, usuarios, resultados, practicas) {
  const lista = [];
  for (const alumno of alumnos) {
    const usuario = usuarios.find((u) => u.usuario_id === alumno.alumno_id);
    const nombre = construirNombre(usuario);
    const resultadosAlumno = resultados.filter((r) => r.alumno_id === alumno.alumno_id);
    if (resultadosAlumno.length === 0) {
      continue;
    }
    for (const r of resultadosAlumno) {
      const practica = practicas.find((p) => p.practica_id === r.practica_id);
      lista.push({
        alumno_id: alumno.alumno_id,
        nombre,
        boleta: alumno.boleta,
        practica: practica?.titulo ?? "Sin práctica",
        practica_id: r.practica_id,
        calificacion: r.calificacion,
        respuestas_json: r.respuestas_json
      });
    }
  }
  return lista;
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Calificar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Calificar;
  const auth = await requireProfesor(Astro2.cookies);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, roleData } = auth;
  const grupos = await getGroupsByTeacher(roleData.usuarioId);
  const grupoId = Number(Astro2.url.searchParams.get("grupo")) || grupos?.[0]?.grupo_id;
  const practicaId = Astro2.url.searchParams.get("practica");
  let alumnos = await getStudentsByTeacher(roleData.usuarioId, grupoId);
  const practicas = await getAssignedPracticesByGroup(roleData.usuarioId, grupoId);
  if (practicaId) {
    alumnos = alumnos.filter((a) => String(a.practica_id) === practicaId);
  }
  return renderTemplate(_a || (_a = __template(["", ' <script src="/scripts/calificarModal.js"><\/script>'])), renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Calificaciones de alumnos", "role": "profesor", "userEmail": user.email }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "TeacherSection", $$TeacherSection, { "title": "Calificaciones de alumnos" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "GrupoSelector", $$GrupoSelector, { "grupos": grupos, "grupoId": grupoId })} ${maybeRenderHead()}<label class="teacher-label">Práctica</label> <select class="teacher-select" onchange="
      const params = new URLSearchParams(location.search);
      const grupo = params.get('grupo');
      if (grupo) params.set('grupo', grupo);
      params.set('practica', this.value);
      location.search = params.toString();
    "> <option value="">Todas</option> ${practicas.map((p) => renderTemplate`<option${addAttribute(p.practica_id, "value")}${addAttribute(String(p.practica_id) === practicaId, "selected")}> ${p.titulo} </option>`)} </select> <table class="teacher-table"> <thead> <tr> <th>Alumno</th> <th>Boleta</th> <th>Práctica</th> <th>Calificación</th> </tr> </thead> <tbody> ${alumnos.length === 0 ? renderTemplate`<tr> <td colspan="4">No hay practicas respondidas o resultados para mostrar</td> </tr>` : alumnos.map((a) => renderTemplate`<tr> <td>${a.nombre}</td> <td>${a.boleta}</td> <td>${a.practica}</td> <td> ${a.calificacion !== null ? renderTemplate`<div class="calificacion-cell"> <span class="calificacion-num"> ${a.calificacion.toFixed(2)} </span> <button class="teacher-btn-sm btn-calificar" data-mode="edit"${addAttribute(a.alumno_id, "data-alumno")}${addAttribute(a.practica_id, "data-practica")}${addAttribute(JSON.stringify(a.respuestas_json ?? {}), "data-json")}>
Editar
</button> </div>` : renderTemplate`<button class="teacher-btn-sm btn-calificar" data-mode="new"${addAttribute(a.alumno_id, "data-alumno")}${addAttribute(a.practica_id, "data-practica")}${addAttribute(JSON.stringify(a.respuestas_json ?? {}), "data-json")}>
Calificar
</button>`} </td> </tr>`)} </tbody> </table>  <div id="modalCalificar" class="modal"> <div class="modal-content"> <h3 id="modalTitulo">Calificar práctica</h3> <p class="calificacion-info">
Califica cada pregunta de <strong>0 a 1</strong> (se permiten decimales).
</p> <form id="formCalificacion"> <div id="preguntasContainer"></div> <div class="resultado-preview">
Calificación final:
<strong id="previewCalificacion">0</strong> </div> <div class="teacher-actions"> <button type="submit" class="teacher-btn">
Guardar calificación
</button> </div> </form> </div> </div> ` })} ` }));
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/profesor/calificar.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/profesor/calificar.astro";
const $$url = "/dashboard/profesor/calificar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Calificar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
