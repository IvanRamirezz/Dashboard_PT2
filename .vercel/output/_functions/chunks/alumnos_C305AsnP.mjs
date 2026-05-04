import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate } from './entrypoint_ChOhswpG.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_D4M1pcOC.mjs';
import { $ as $$UserEditor } from './UserEditor_9bOxISjp.mjs';
import { g as getValidatedSession } from './sessionService_EQ2ZgrkK.mjs';
import { g as getUserRole } from './userRoleService_bp0Wj9x4.mjs';
import { s as supabaseAdmin } from './supabaseAdmin_Bl60ioa3.mjs';

async function findStudentByBoleta(boleta) {
  const { data, error } = await supabaseAdmin.from("alumnos").select(`
      alumno_id,
      boleta,
      usuarios (
        nombre,
        apellido_paterno,
        apellido_materno
      )
    `).eq("boleta", boleta).single();
  if (error) return null;
  return data;
}

async function getStudentByBoleta(boleta) {
  if (!boleta) {
    throw new Error("Boleta requerida");
  }
  return await findStudentByBoleta(boleta);
}

const $$Alumnos = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Alumnos;
  const user = await getValidatedSession(Astro2.cookies);
  if (!user) return Astro2.redirect("/");
  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin")
    return Astro2.redirect("/");
  const boleta = Astro2.url.searchParams.get("boleta");
  const updated = Astro2.url.searchParams.get("updated");
  let student = null;
  if (boleta) {
    student = await getStudentByBoleta(boleta);
  }
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Gestión de alumno", "role": "admin", "userEmail": user.email }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "UserEditor", $$UserEditor, { "title": "Gestión de alumno", "description": "Gestiona la información de los alumnos registrados. Busca por matrícula, actualiza sus datos o da de baja su registro en el sistema.", "searchName": "boleta", "searchLabel": "Número de boleta", "idField": "alumno_id", "identifierField": "boleta", "identifierValue": boleta ?? void 0, "updateAction": "/api/admin/update-student", "deleteAction": "/api/admin/delete-student", "user": student, "updated": updated })} ` })}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/admin/alumnos.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/admin/alumnos.astro";
const $$url = "/dashboard/admin/alumnos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Alumnos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
