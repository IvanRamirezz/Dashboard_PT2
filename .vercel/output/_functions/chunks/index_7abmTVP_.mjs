import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_ChOhswpG.mjs';
import { $ as $$AuthLayout, a as $$Alert } from './Alert_D0rU51W_.mjs';
import { $ as $$InputField } from './InputField_Bnnujr2b.mjs';
import { $ as $$PasswordField } from './PasswordField_BEp84Xcx.mjs';
import { g as getValidatedSession } from './sessionService_EQ2ZgrkK.mjs';
import { g as getUserRole } from './userRoleService_bp0Wj9x4.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const { url, redirect, cookies } = Astro2;
  const error = url.searchParams.get("error");
  const user = await getValidatedSession(cookies);
  if (user) {
    const roleData = await getUserRole(user.id);
    if (roleData?.role === "admin") {
      return redirect("/dashboard/admin");
    }
    if (roleData?.role === "profesor") {
      if (roleData.estado === "aprobado") {
        return redirect("/dashboard/profesor");
      }
    }
  }
  return renderTemplate`${renderComponent($$result, "AuthLayout", $$AuthLayout, { "title": "Sign in" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="title">
Sign in
</h1> <p class="subtitle">
Ingresa con tus credenciales para acceder a la plataforma.
</p> <form action="/api/auth/signin" method="post"> ${error === "credenciales" && renderTemplate`${renderComponent($$result2, "Alert", $$Alert, { "type": "error", "message": "Credenciales incorrectas" })}`} ${error === "no_access" && renderTemplate`${renderComponent($$result2, "Alert", $$Alert, { "type": "error", "message": "Los alumnos no tienen acceso al dashboard web" })}`} ${error === "pendiente" && renderTemplate`${renderComponent($$result2, "Alert", $$Alert, { "type": "error", "message": "Tu cuenta de profesor aún no ha sido aprobada" })}`} ${error === "rechazado" && renderTemplate`${renderComponent($$result2, "Alert", $$Alert, { "type": "error", "message": "Tu solicitud fue rechazada. Contacta con el administrador." })}`} ${renderComponent($$result2, "InputField", $$InputField, { "label": "Email", "name": "email", "type": "email", "placeholder": "correo@ejemplo.com" })} ${renderComponent($$result2, "PasswordField", $$PasswordField, { "label": "Password", "name": "password" })} <button class="btn" type="submit">
Login
</button> <p class="register-link">
¿No tienes credenciales?
</p> <a href="/auth/register-teacher" class="btn-outline">
Crear cuenta
</a> <p class="forgot-link"> <a href="/auth/forgot-password">
¿Olvidaste tu contraseña?
</a> </p> </form> ` })}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/index.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
