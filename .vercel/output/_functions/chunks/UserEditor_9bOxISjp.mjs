import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, r as renderTemplate, l as renderComponent } from './entrypoint_ChOhswpG.mjs';
import 'clsx';

const $$ConfirmDeleteModal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ConfirmDeleteModal;
  const {
    id,
    action,
    idField,
    value,
    message
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(id, "id")} class="modal-overlay hidden"> <div class="modal"> <h3>
Confirmar eliminación
</h3> <p> ${message ?? "¿Seguro que deseas eliminar este registro?"} </p> <form method="POST"${addAttribute(action, "action")}> <input type="hidden"${addAttribute(idField, "name")}${addAttribute(value, "value")}> <input type="hidden" name="redirect"${addAttribute(Astro2.url.pathname, "value")}> <button class="btn danger">
Sí, eliminar
</button> <button type="button" class="btn"${addAttribute(`closeModal('${id}')`, "onclick")}>
Cancelar
</button> </form> </div> </div>`;
}, "/Users/ivanramirez/Dashboard-Web-/src/components/ui/modals/ConfirmDeleteModal.astro", void 0);

const $$SuccessModal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SuccessModal;
  const {
    id,
    title,
    message,
    show
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(id, "id")}${addAttribute(`modal-overlay ${show ? "" : "hidden"}`, "class")}> <div class="modal"> <h3> ${title ?? "Operación exitosa"} </h3> <p> ${message ?? "Los cambios se guardaron correctamente."} </p> <button class="btn primary"${addAttribute(`closeModal('${id}')`, "onclick")}>
Cerrar
</button> </div> </div>`;
}, "/Users/ivanramirez/Dashboard-Web-/src/components/ui/modals/SuccessModal.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$UserEditor = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$UserEditor;
  const {
    title,
    description,
    searchName,
    searchLabel,
    idField,
    identifierField,
    identifierValue,
    updateAction,
    deleteAction,
    user,
    updated
  } = Astro2.props;
  const userId = user?.[idField] ?? user?.usuarios?.[idField];
  return renderTemplate(_a || (_a = __template(["", '<div class="module"> <h2>', "</h2> ", ' <form method="GET" class="search-box"> <label>', "</label> <input", "", '> <button class="btn primary">Buscar</button> </form> ', " </div> ", " ", ' <script type="module">\n  import { openModal, closeModal } from "../../../src/script/modal";\n  window.openModal = openModal;\n  window.closeModal = closeModal;\n<\/script>'])), maybeRenderHead(), title, description && renderTemplate`<p class="module-description">${description}</p>`, searchLabel, addAttribute(searchName, "name"), addAttribute(identifierValue ?? "", "value"), user && renderTemplate`<form method="POST"${addAttribute(updateAction, "action")}> <input type="hidden"${addAttribute(idField, "name")}${addAttribute(userId, "value")}> <input type="hidden" name="redirect"${addAttribute(`${Astro2.url.pathname}?${searchName}=${user[identifierField]}&updated=1`, "value")}> <div class="teacher-form"> <div class="form-group"> <label>Nombre</label> <input name="nombre"${addAttribute(user.usuarios.nombre, "value")}> </div> <div class="form-group"> <label>Apellido paterno</label> <input name="apellido_paterno"${addAttribute(user.usuarios.apellido_paterno, "value")}> </div> <div class="form-group"> <label>Apellido materno</label> <input name="apellido_materno"${addAttribute(user.usuarios.apellido_materno, "value")}> </div> <div class="form-group"> <label>${searchLabel}</label> <input${addAttribute(identifierField, "name")}${addAttribute(user[identifierField], "value")}> </div> <div class="form-actions"> <button class="btn primary">Guardar cambios</button> <button type="button" class="btn danger" onclick="openModal('deleteModal')">
Dar de baja
</button> </div> </div> </form>`, renderComponent($$result, "SuccessModal", $$SuccessModal, { "id": "successModal", "show": !!updated, "title": "Cambios guardados", "message": "La información se actualizó correctamente." }), renderComponent($$result, "ConfirmDeleteModal", $$ConfirmDeleteModal, { "id": "deleteModal", "action": deleteAction, "idField": idField, "value": userId, "message": "¿Seguro que deseas eliminar este registro?" }));
}, "/Users/ivanramirez/Dashboard-Web-/src/components/admin/UserEditor.astro", void 0);

export { $$UserEditor as $ };
