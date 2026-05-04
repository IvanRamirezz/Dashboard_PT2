import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { r as renderTemplate, h as addAttribute, m as maybeRenderHead } from './entrypoint_ChOhswpG.mjs';
import 'clsx';

const ojo = new Proxy({"src":"/_astro/ojo.rfQMTrdo.png","width":64,"height":64,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/ivanramirez/Dashboard-Web-/src/assets/ojo.png";
							}
							
							return target[name];
						}
					});

const ojoOcultar = new Proxy({"src":"/_astro/ojo-ocultar.B7Y60vaj.png","width":64,"height":64,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/ivanramirez/Dashboard-Web-/src/assets/ojo-ocultar.png";
							}
							
							return target[name];
						}
					});

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$PasswordField = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PasswordField;
  const {
    label = "Contraseña",
    name = "password",
    placeholder = "••••••••",
    required = true
  } = Astro2.props;
  const inputId = `password-${Math.random().toString(36).slice(2)}`;
  return renderTemplate(_a || (_a = __template(["", '<div class="field"> <label', "> ", ' </label> <div class="password-container"> <input', "", ' type="password"', "", '> <button type="button" class="toggle-password"', "> <img", ' alt="Mostrar contraseña"> </button> </div> </div> <script', "", '>\n\nconst eye = document.currentScript.dataset.eye;\nconst eyeOff = document.currentScript.dataset.eyeOff;\n\ndocument.querySelectorAll(".toggle-password").forEach(btn => {\n\n  btn.addEventListener("click", () => {\n\n    const targetId = btn.getAttribute("data-target");\n\n    const input = document.getElementById(targetId);\n\n    const icon = btn.querySelector("img");\n\n    if (!input || !icon) return;\n\n    const isHidden = input.type === "password";\n\n    input.type = isHidden ? "text" : "password";\n\n    icon.src = isHidden ? eyeOff : eye;\n\n  });\n\n});\n\n<\/script>'])), maybeRenderHead(), addAttribute(inputId, "for"), label, addAttribute(inputId, "id"), addAttribute(name, "name"), addAttribute(placeholder, "placeholder"), addAttribute(required, "required"), addAttribute(inputId, "data-target"), addAttribute(ojo.src, "src"), addAttribute(ojo.src, "data-eye"), addAttribute(ojoOcultar.src, "data-eye-off"));
}, "/Users/ivanramirez/Dashboard-Web-/src/components/ui/PasswordField.astro", void 0);

export { $$PasswordField as $ };
