import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_ChOhswpG.mjs';
import { $ as $$Layout } from './Layout_CvaFqzZD.mjs';
/* empty css                   */

const $$Error = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Error;
  const url = new URL(Astro2.request.url);
  const reason = url.searchParams.get("reason");
  const type = url.searchParams.get("type");
  let message = "";
  let backUrl = "";
  if (reason === "email") {
    message = "Este correo ya está registrado.";
  }
  if (reason === "duplicate") {
    message = type === "teacher" ? "El número de profesor ya está registrado." : "La boleta ya está registrada.";
  }
  if (type === "teacher") {
    backUrl = "/auth/register-teacher";
  } else {
    backUrl = "/auth/register";
  }
  if (!message) {
    message = "Ocurrio un problema al completar el registro.";
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Error de registro" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="auth"> <div class="card register-feedback-card"> <div class="feedback-icon error">
!
</div> <h1 class="feedback-title">
No se pudo completar el registro
</h1> <p class="feedback-message"> ${message} </p> <a${addAttribute(backUrl, "href")} class="feedback-link">
Volver al registro
</a> </div> </section> ` })}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/register/error.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/register/error.astro";
const $$url = "/register/error";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Error,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
