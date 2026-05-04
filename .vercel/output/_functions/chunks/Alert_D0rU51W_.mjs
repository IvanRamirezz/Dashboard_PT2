import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead, p as renderSlot, h as addAttribute } from './entrypoint_ChOhswpG.mjs';
import { $ as $$Layout } from './Layout_CvaFqzZD.mjs';
import 'clsx';

const $$AuthLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AuthLayout;
  const { title } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="auth-container"> <div class="auth-card"> ${renderSlot($$result2, $$slots["default"])} </div> </section> ` })}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/layouts/AuthLayout.astro", void 0);

const $$Alert = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Alert;
  const { type, message } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`alert alert-${type}`, "class")}> ${message} </div>`;
}, "/Users/ivanramirez/Dashboard-Web-/src/components/ui/Alert.astro", void 0);

export { $$AuthLayout as $, $$Alert as a };
