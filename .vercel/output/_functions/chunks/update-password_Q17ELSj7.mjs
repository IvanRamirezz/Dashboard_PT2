import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead, n as Fragment } from './entrypoint_ChOhswpG.mjs';
import { $ as $$AuthLayout, a as $$Alert } from './Alert_D0rU51W_.mjs';
import { $ as $$PasswordField } from './PasswordField_BEp84Xcx.mjs';

const $$UpdatePassword = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$UpdatePassword;
  const { url } = Astro2;
  const error = url.searchParams.get("error");
  const success = url.searchParams.get("success");
  return renderTemplate`${renderComponent($$result, "AuthLayout", $$AuthLayout, { "title": "Nueva contraseña" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="title"> ${success ? "Contraseña actualizada" : "Nueva contraseña"} </h1> <p class="subtitle"> ${success ? "Tu contraseña se cambió correctamente. Ya puedes iniciar sesión." : "Escribe tu nueva contraseña."} </p> <form method="post" action="/api/auth/update-password"> ${success && renderTemplate`${renderComponent($$result2, "Alert", $$Alert, { "type": "success", "message": "Contraseña actualizada correctamente" })}`} ${error && renderTemplate`${renderComponent($$result2, "Alert", $$Alert, { "type": "error", "message": "Error al actualizar contraseña" })}`} ${!success && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "PasswordField", $$PasswordField, { "label": "Nueva contraseña", "name": "password" })} <button class="btn">
Actualizar contraseña
</button> ` })}`} </form> ` })}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/auth/update-password.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/auth/update-password.astro";
const $$url = "/auth/update-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$UpdatePassword,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
