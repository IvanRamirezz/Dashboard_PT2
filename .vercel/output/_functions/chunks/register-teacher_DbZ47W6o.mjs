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
const $$RegisterTeacher = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Registro profesor" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", ' <script type="module" src="/scripts/register-form.js">\n<\/script> '])), renderComponent($$result2, "RegisterForm", $$RegisterForm, { "userType": "teacher" })) })}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/pages/auth/register-teacher.astro", void 0);

const $$file = "/Users/ivanramirez/Dashboard-Web-/src/pages/auth/register-teacher.astro";
const $$url = "/auth/register-teacher";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$RegisterTeacher,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
