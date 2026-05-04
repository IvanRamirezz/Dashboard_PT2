import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './entrypoint_ChOhswpG.mjs';
import 'clsx';

const $$InputField = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$InputField;
  const {
    label,
    name,
    type = "text",
    required = false,
    placeholder = "",
    span = false,
    minlength
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`field ${span ? "span-2" : ""}`, "class")}> <label${addAttribute(name, "for")}> ${label} ${required && renderTemplate`<span class="req">*</span>`} </label> <input${addAttribute(name, "id")}${addAttribute(name, "name")}${addAttribute(type, "type")}${addAttribute(placeholder, "placeholder")}${addAttribute(required, "required")}${addAttribute(minlength, "minlength")}> </div>`;
}, "/Users/ivanramirez/Dashboard-Web-/src/components/ui/InputField.astro", void 0);

export { $$InputField as $ };
