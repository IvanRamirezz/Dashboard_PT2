import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, l as renderComponent, r as renderTemplate } from './entrypoint_ChOhswpG.mjs';
import { $ as $$InputField } from './InputField_Bnnujr2b.mjs';

const $$RegisterForm = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$RegisterForm;
  const { userType = "student" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="auth"> <div class="card"> <header class="header"> <h1>Registro</h1> <p>
Llena los siguientes campos para darte de alta y comenzar a usar la app de realidad virtual.
</p> </header> <div class="divider"></div> <form action="/api/auth/register" method="post" id="registerForm"> <input type="hidden" name="role"${addAttribute(userType, "value")}> <div class="grid"> ${renderComponent($$result, "InputField", $$InputField, { "label": "Nombre(s)", "name": "nombre", "required": true, "placeholder": "Ingresa tu nombre" })} ${renderComponent($$result, "InputField", $$InputField, { "label": "Apellido paterno", "name": "apellidoPaterno", "required": true, "placeholder": "Ingresa tu apellido paterno" })} ${renderComponent($$result, "InputField", $$InputField, { "label": "Apellido materno", "name": "apellidoMaterno", "required": true, "placeholder": "Ingresa tu apellido materno" })} ${userType === "student" && renderTemplate`${renderComponent($$result, "InputField", $$InputField, { "label": "Boleta", "name": "boleta", "required": true, "placeholder": "Ingresa tu boleta" })}`} ${userType === "teacher" && renderTemplate`${renderComponent($$result, "InputField", $$InputField, { "label": "Número de profesor", "name": "matricula", "required": true, "placeholder": "Ingresa tu número de profesor" })}`} ${renderComponent($$result, "InputField", $$InputField, { "label": "Correo electrónico", "name": "email", "type": "email", "required": true, "span": true, "placeholder": "Ingresa tu correo" })} ${renderComponent($$result, "InputField", $$InputField, { "label": "Contraseña", "name": "password", "type": "password", "minlength": "8", "required": true, "span": true, "placeholder": "Crea una contraseña" })} ${renderComponent($$result, "InputField", $$InputField, { "label": "Confirmar contraseña", "name": "passwordConfirm", "type": "password", "minlength": "8", "required": true, "span": true, "placeholder": "Confirma tu contraseña" })} </div> <button class="btn">
Crear cuenta →
</button> </form> </div> </section>`;
}, "/Users/ivanramirez/Dashboard-Web-/src/components/auth/RegisterForm.astro", void 0);

export { $$RegisterForm as $ };
