import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_ChOhswpG.mjs';
import { $ as $$AuthLayout, a as $$Alert } from './Alert_D0rU51W_.mjs';
import { $ as $$InputField } from './InputField_Bnnujr2b.mjs';

const $$ForgotPassword = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ForgotPassword;
  const { url } = Astro2;
  const message = url.searchParams.get("message");
  const error = url.searchParams.get("error");
  return renderTemplate`${renderComponent($$result, "AuthLayout", $$AuthLayout, { "title": "Recuperar contraseña" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="title">
Restablecer contraseña
</h1> <p class="subtitle">
Te enviaremos un link para restablecer tu contraseña
</p> <form method="post" action="/api/auth/reset-password"> ${message && renderTemplate`${renderComponent($$result2, "Alert", $$Alert, { "type": "success", "message": "Revisa tu correo 📩" })}`} ${error && renderTemplate`${renderComponent($$result2, "Alert", $$Alert, { "type": "error", "message": "Ocurrió un error" })}`} ${renderComponent($$result2, "InputField", $$InputField, { "label": "Email", "name": "email", "type": "email", "placeholder": "correo@ejemplo.com" })} <button class="btn">
Enviar link
</button> </form> ` })}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/auth/forgot-password.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/auth/forgot-password.astro";
const $$url = "/auth/forgot-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ForgotPassword,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
