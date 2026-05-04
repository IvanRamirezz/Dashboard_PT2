import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_ChOhswpG.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_D4M1pcOC.mjs';
import { $ as $$GrupoSelector } from './GrupoSelector_BKgopKbw.mjs';
import { g as getGroupsByTeacher, $ as $$TeacherSection } from './grupoService_NNlHUbJ0.mjs';
import { r as requireProfesor } from './profesor_BQVgECzC.mjs';
import { s as supabaseAdmin } from './supabaseAdmin_Bl60ioa3.mjs';

async function getStudentListByGroup(profesorId, grupoId) {
  const { data: grupo } = await supabaseAdmin.from("grupos").select("grupo_id").eq("grupo_id", grupoId).eq("profesor_id", profesorId).single();
  if (!grupo)
    return [];
  const { data: alumnos } = await supabaseAdmin.from("alumnos").select(`
alumno_id,
boleta
`).eq("grupo_id", grupoId);
  if (!alumnos?.length)
    return [];
  const alumnoIds = alumnos.map((a) => a.alumno_id);
  const { data: usuarios } = await supabaseAdmin.from("usuarios").select(`
usuario_id,
nombre,
apellido_paterno,
apellido_materno
`).in("usuario_id", alumnoIds);
  return alumnos.map((a) => {
    const usuario = usuarios?.find(
      (u) => u.usuario_id === a.alumno_id
    );
    return {
      alumno_id: a.alumno_id,
      nombre: usuario ? `${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}` : "Sin nombre",
      boleta: a.boleta
    };
  });
}

const $$Alumnos = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Alumnos;
  const auth = await requireProfesor(Astro2.cookies);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, roleData } = auth;
  const grupos = await getGroupsByTeacher(roleData.usuarioId);
  const grupoId = Number(Astro2.url.searchParams.get("grupo")) || grupos?.[0]?.grupo_id;
  const alumnos = await getStudentListByGroup(roleData.usuarioId, grupoId);
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Alumnos", "role": "profesor", "userEmail": user.email }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "TeacherSection", $$TeacherSection, { "title": "Lista de alumnos", "description": "Selecciona un grupo para consultar sus integrantes y su información académica." }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "GrupoSelector", $$GrupoSelector, { "grupos": grupos, "grupoId": grupoId })} ${maybeRenderHead()}<table class="teacher-table"> <thead> <tr> <th>Nombre</th> <th>Boleta</th> </tr> </thead> <tbody> ${alumnos.length === 0 ? renderTemplate`<tr> <td colspan="2">No hay alumnos en este grupo</td> </tr>` : alumnos.map((a) => renderTemplate`<tr> <td>${a.nombre}</td> <td>${a.boleta}</td> </tr>`)} </tbody> </table> ` })} ` })}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/profesor/alumnos.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/profesor/alumnos.astro";
const $$url = "/dashboard/profesor/alumnos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Alumnos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
