import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_ChOhswpG.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_D4M1pcOC.mjs';
import { g as getGroupsByTeacher, c as createGroup, d as deactivateGroupByName, $ as $$TeacherSection } from './grupoService_NNlHUbJ0.mjs';
import { $ as $$GrupoSelector } from './GrupoSelector_BKgopKbw.mjs';
import { $ as $$Toast } from './Toast_BL0I3Mrl.mjs';
import { r as requireProfesor } from './profesor_BQVgECzC.mjs';

const $$GestionarGrupos = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$GestionarGrupos;
  const auth = await requireProfesor(Astro2.cookies);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, roleData } = auth;
  const grupos = await getGroupsByTeacher(roleData.usuarioId);
  const grupoId = Number(Astro2.url.searchParams.get("grupo")) || grupos?.[0]?.grupo_id;
  const grupoActual = grupos.find((g) => g.grupo_id == grupoId);
  const toastMap = {
    alta: { message: "Grupo dado de alta exitosamente", type: "success" },
    baja: { message: "Grupo dado de baja exitosamente", type: "warning" },
    alta_existe: { message: "Este grupo ya existe", type: "error" },
    baja_error: { message: "El grupo no existe o ya está dado de baja", type: "error" },
    reactivado: { message: "Grupo reactivado correctamente", type: "info" }
  };
  const successKey = Astro2.url.searchParams.get("success");
  const toast = successKey ? toastMap[successKey] : void 0;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = form.get("action");
    const grupoNombre = form.get("grupo")?.toString().toUpperCase().trim();
    if (action === "alta" && grupoNombre) {
      const result = await createGroup(roleData.usuarioId, grupoNombre);
      if (result?.error === "existe") {
        return Astro2.redirect("/dashboard/profesor/gestionar-grupos?success=alta_existe");
      }
      if (result?.reactivated) {
        return Astro2.redirect("/dashboard/profesor/gestionar-grupos?success=reactivado");
      }
      return Astro2.redirect("/dashboard/profesor/gestionar-grupos?success=alta");
    }
    if (action === "baja" && grupoNombre) {
      const result = await deactivateGroupByName(roleData.usuarioId, grupoNombre);
      if (result?.error === "no_existe") {
        return Astro2.redirect("/dashboard/profesor/gestionar-grupos?success=baja_error");
      }
      return Astro2.redirect("/dashboard/profesor/gestionar-grupos?success=baja");
    }
    return Astro2.redirect("/dashboard/profesor/gestionar-grupos");
  }
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Gestión del grupo", "role": "profesor", "userEmail": user.email }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "TeacherSection", $$TeacherSection, { "title": "Gestión del grupo", "description": "\n    Puedes crear nuevos grupos, seleccionar uno existente para consultar su código de acceso o darlo de baja." }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<form method="POST"> <label class="grupo-label">Grupo</label> <div class="grupo-actions"> <input type="text" name="grupo" placeholder="Ej. 3IM14" required style="text-transform: uppercase;" oninput="this.value = this.value.toUpperCase()"> <button name="action" value="alta" class="btn-primary">
Dar de alta
</button> <button name="action" value="baja" class="btn-danger">
Dar de baja
</button> </div> </form> <div class="grupo-info"> <div> <label>Selecciona el grupo:</label> ${renderComponent($$result3, "GrupoSelector", $$GrupoSelector, { "grupos": grupos, "grupoId": grupoId })} </div> <div> <label>Código del grupo:</label> <div class="codigo-box"> ${grupoActual?.codigo_acceso || "----"} </div> </div> </div> ` })} ${toast && renderTemplate`${renderComponent($$result2, "Toast", $$Toast, { "message": toast.message, "type": toast.type })}`}` })}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/profesor/gestionar-grupos.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/profesor/gestionar-grupos.astro";
const $$url = "/dashboard/profesor/gestionar-grupos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$GestionarGrupos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
