import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate } from './entrypoint_ChOhswpG.mjs';
import { $ as $$Layout } from './Layout_CvaFqzZD.mjs';
import { $ as $$RegisterForm } from './RegisterForm_eEHsNVr3.mjs';
/* empty css                   */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Register = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Registro alumno" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", ' <script type="module" src="../scripts/register-form.js"><\/script> '])), renderComponent($$result2, "RegisterForm", $$RegisterForm, { "userType": "student" })) })}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/auth/register.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/auth/register.astro";
const $$url = "/auth/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
