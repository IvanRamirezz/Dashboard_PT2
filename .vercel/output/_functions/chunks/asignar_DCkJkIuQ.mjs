import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_ChOhswpG.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_D4M1pcOC.mjs';
import { $ as $$TeacherSection } from './grupoService_NNlHUbJ0.mjs';
import { $ as $$Toast } from './Toast_BL0I3Mrl.mjs';
import { r as requireProfesor } from './profesor_BQVgECzC.mjs';
import { a as assignPracticeToGroup, g as getAssignmentFormData } from './asignacionService_D0PiZiM0.mjs';

const $$Asignar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Asignar;
  const auth = await requireProfesor(Astro2.cookies);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, roleData } = auth;
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const practicaId = Number(data.get("practica_id"));
    const grupoId = Number(data.get("grupo_id"));
    if (practicaId && grupoId) {
      await assignPracticeToGroup(roleData.usuarioId, practicaId, grupoId);
      return Astro2.redirect("/dashboard/profesor/asignar?success=asignacion");
    }
    return Astro2.redirect("/dashboard/profesor/asignar");
  }
  const { practicas, grupos } = await getAssignmentFormData(roleData.usuarioId);
  const toastMap = {
    asignacion: { message: "Práctica asignada exitosamente", type: "success" }
  };
  const successKey = Astro2.url.searchParams.get("success") ?? "";
  const toast = toastMap[successKey];
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Asignar práctica", "role": "profesor", "userEmail": user.email }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "TeacherSection", $$TeacherSection, { "title": "Asignar práctica", "description": "Asigna prácticas a tus grupos para que los alumnos puedan realizarlas en el entorno de FiberLab VR. Selecciona una práctica y el grupo correspondiente." }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<form method="POST" class="teacher-form-box"> <label class="teacher-label">
Selecciona la práctica a realizar
</label> <select name="practica_id" class="teacher-select" required> <option value="">Seleccionar práctica</option> ${practicas.map((p) => renderTemplate`<option${addAttribute(p.practica_id, "value")}>${p.titulo}</option>`)} </select> <label class="teacher-label">
Selecciona el grupo al que asignar la práctica
</label> <select name="grupo_id" class="teacher-select" required> <option value="">Seleccionar grupo</option> ${grupos.map((g) => renderTemplate`<option${addAttribute(g.grupo_id, "value")}>${g.nombre}</option>`)} </select> <div class="teacher-actions"> <button class="teacher-btn" type="submit">
Asignar
</button> </div> </form> ` })} ${toast && renderTemplate`${renderComponent($$result2, "Toast", $$Toast, { "message": toast.message, "type": toast.type })}`}` })}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/profesor/asignar.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/profesor/asignar.astro";
const $$url = "/dashboard/profesor/asignar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Asignar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
