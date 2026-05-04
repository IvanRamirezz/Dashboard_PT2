import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_ChOhswpG.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_D4M1pcOC.mjs';
import { r as requireProfesor } from './profesor_BQVgECzC.mjs';
import { s as supabaseAdmin } from './supabaseAdmin_Bl60ioa3.mjs';

async function getTeacherStats(usuarioId) {
  const { count: grupos } = await supabaseAdmin.from("grupos").select("*", { count: "exact", head: true }).eq("profesor_id", usuarioId).eq("activo", true);
  const { count: practicas } = await supabaseAdmin.from("practicas").select("*", { count: "exact", head: true }).eq("activo", true);
  const { data: gruposProfesor } = await supabaseAdmin.from("grupos").select("grupo_id").eq("profesor_id", usuarioId).eq("activo", true);
  const gruposIds = gruposProfesor?.map((g) => g.grupo_id) ?? [];
  let alumnos = 0;
  if (gruposIds.length > 0) {
    const { count } = await supabaseAdmin.from("alumnos").select("*", { count: "exact", head: true }).in("grupo_id", gruposIds);
    alumnos = count ?? 0;
  }
  return {
    grupos: grupos ?? 0,
    practicas: practicas ?? 0,
    alumnos
  };
}

const $$Profesor = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Profesor;
  const auth = await requireProfesor(Astro2.cookies);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, roleData } = auth;
  const stats = await getTeacherStats(roleData.usuarioId);
  const nombre = roleData.nombre ?? user.email;
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Dashboard profesor", "role": "profesor", "userEmail": user.email }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="teacher-dashboard"> <h1 class="teacher-title">
Bienvenido, Profesor ${nombre} </h1> <div class="teacher-stats"> <div class="teacher-card"> <span>Grupos registrados</span> <strong>${stats?.grupos ?? 0}</strong> </div> <div class="teacher-card"> <span>Prácticas activas</span> <strong>${stats?.practicas ?? 0}</strong> </div> <div class="teacher-card"> <span>Alumnos registrados</span> <strong>${stats?.alumnos ?? 0}</strong> </div> </div> <div class="teacher-menu"> <a href="../dashboard/profesor/gestionar-grupos" class="teacher-item"> <span>📤 Crear grupo</span> <span class="teacher-arrow">›</span> </a> <a href="../dashboard/profesor/asignar" class="teacher-item"> <span>🧪 Asignar práctica</span> <span class="teacher-arrow">›</span> </a> </div> </section> ` })}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/profesor.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/profesor.astro";
const $$url = "/dashboard/profesor";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profesor,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
