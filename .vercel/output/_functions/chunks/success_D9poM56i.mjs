import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_ChOhswpG.mjs';
import { $ as $$Layout } from './Layout_CvaFqzZD.mjs';
/* empty css                   */

const $$Success = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Success;
  const url = new URL(Astro2.request.url);
  const type = url.searchParams.get("type");
  const loginUrl = "/";
  const backUrl = type === "teacher" ? "/auth/register-teacher" : "/auth/register";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Registro exitoso" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="auth"> <div class="card register-feedback-card"> <div class="feedback-icon success">
✓
</div> <h1 class="feedback-title">
Registro exitoso
</h1> <p class="feedback-message">
Tu cuenta fue creada correctamente.
</p> <p class="feedback-subtext">
Revisa tu correo electrónico para validar tu cuenta antes de iniciar sesión.
</p> <div class="feedback-actions"> <a${addAttribute(loginUrl, "href")} class="feedback-link solid">
Ir al login
</a> <a${addAttribute(backUrl, "href")} class="feedback-link">
Volver al registro
</a> </div> </div> </section> ` })}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/register/success.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/register/success.astro";
const $$url = "/register/success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Success,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
