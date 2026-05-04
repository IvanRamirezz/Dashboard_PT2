import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate } from './entrypoint_ChOhswpG.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_D4M1pcOC.mjs';
import { $ as $$UserEditor } from './UserEditor_9bOxISjp.mjs';
import { g as getValidatedSession } from './sessionService_EQ2ZgrkK.mjs';
import { g as getUserRole } from './userRoleService_bp0Wj9x4.mjs';
import { s as supabaseAdmin } from './supabaseAdmin_Bl60ioa3.mjs';

async function findTeacherByMatricula(matricula) {
  const { data, error } = await supabaseAdmin.from("profesores").select(`
      profesor_id,
      matricula_trabajador,
      usuarios (
        nombre,
        apellido_paterno,
        apellido_materno
      )
    `).eq("matricula_trabajador", matricula).single();
  if (error) return null;
  return data;
}

async function getTeacherByMatricula(matricula) {
  if (!matricula) {
    throw new Error("Matricula requerida");
  }
  return await findTeacherByMatricula(matricula);
}

const $$Profesores = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Profesores;
  const user = await getValidatedSession(Astro2.cookies);
  if (!user) return Astro2.redirect("/");
  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return Astro2.redirect("/");
  const matricula = Astro2.url.searchParams.get("matricula");
  const updated = Astro2.url.searchParams.get("updated");
  let teacher = null;
  if (matricula) {
    teacher = await getTeacherByMatricula(matricula);
  }
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Gestión de profesor", "role": "admin", "userEmail": user.email }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "UserEditor", $$UserEditor, { "title": "Gestión de profesor", "description": "Gestiona la información de los profesores registrados. Busca por matrícula, actualiza sus datos o da de baja su registro en el sistema.", "searchName": "matricula", "searchLabel": "Matrícula", "idField": "profesor_id", "identifierField": "matricula_trabajador", "identifierValue": matricula ?? void 0, "updateAction": "/api/admin/update-teacher", "deleteAction": "/api/admin/delete-teacher", "user": teacher, "updated": updated ?? void 0 })} ` })}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/admin/profesores.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/admin/profesores.astro";
const $$url = "/dashboard/admin/profesores";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profesores,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
