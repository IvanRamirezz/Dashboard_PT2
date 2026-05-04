import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, r as renderTemplate, l as renderComponent } from './entrypoint_ChOhswpG.mjs';
import { r as renderScript } from './script_BB9pTlk3.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_D4M1pcOC.mjs';
import 'clsx';
import { g as getValidatedSession } from './sessionService_EQ2ZgrkK.mjs';
import { g as getUserRole } from './userRoleService_bp0Wj9x4.mjs';
import { g as getPendingTeachers } from './adminService_DlOO2I4x.mjs';

const $$ApproveTeacherModal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ApproveTeacherModal;
  const {
    id,
    action
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(id, "id")} class="modal-overlay hidden"> <div class="modal"> <h3>
Confirmar aprobación
</h3> <p>
¿Deseas dar de alta a este profesor?
</p> <form method="POST"${addAttribute(action, "action")}> <input type="hidden" name="profesor_id" id="approve-profesor-id"> <input type="hidden" name="estado" value="aprobado"> <button class="btn primary">
Sí, aprobar
</button> <button type="button" class="btn"${addAttribute(`closeModal('${id}')`, "onclick")}>
Cancelar
</button> </form> </div> </div>`;
}, "/Users/ivanramirez/Dashboard-Web-/src/components/ui/modals/ApproveTeacherModal.astro", void 0);

const $$RejectTeacherModal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$RejectTeacherModal;
  const {
    id,
    action
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(id, "id")} class="modal-overlay hidden"> <div class="modal"> <h3>
Confirmar rechazo
</h3> <p>
¿Deseas rechazar este profesor?
</p> <form method="POST"${addAttribute(action, "action")}> <input type="hidden" name="profesor_id" id="reject-profesor-id"> <input type="hidden" name="estado" value="rechazado"> <button class="btn danger">
Sí, rechazar
</button> <button type="button" class="btn"${addAttribute(`closeModal('${id}')`, "onclick")}>
Cancelar
</button> </form> </div> </div>`;
}, "/Users/ivanramirez/Dashboard-Web-/src/components/ui/modals/RejectTeacherModal.astro", void 0);

const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Admin;
  const user = await getValidatedSession(Astro2.cookies);
  if (!user) return Astro2.redirect("/");
  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return Astro2.redirect("/");
  const pendingTeachers = await getPendingTeachers();
  const email = user.email;
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Panel administrador", "role": "admin", "userEmail": email }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>Solicitudes recientes para dar de alta</h1> <table class="table"> <thead> <tr> <th>Nombre completo</th> <th>Número de trabajador</th> <th>Estado</th> <th>Acciones</th> </tr> </thead> <tbody> ${pendingTeachers.map((t) => renderTemplate`<tr> <td> ${t.usuarios.nombre} ${t.usuarios.apellido_paterno} ${t.usuarios.apellido_materno} </td> <td> ${t.matricula_trabajador} </td> <td> <span class="badge warning">
Pendiente de Alta
</span> </td> <td class="actions"> <button class="btn primary open-approve-modal"${addAttribute(t.profesor_id, "data-id")}>
Dar de Alta
</button> <button class="btn danger open-reject-modal"${addAttribute(t.profesor_id, "data-id")}>
Rechazar
</button> </td> </tr>`)} </tbody> </table> ` })} ${renderComponent($$result, "ApproveTeacherModal", $$ApproveTeacherModal, { "id": "approveModal", "action": "/api/admin/update-teacher-status" })} ${renderComponent($$result, "RejectTeacherModal", $$RejectTeacherModal, { "id": "rejectModal", "action": "/api/admin/update-teacher-status" })} ${renderScript($$result, "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/admin.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/admin.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/dashboard/admin.astro";
const $$url = "/dashboard/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Admin,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
