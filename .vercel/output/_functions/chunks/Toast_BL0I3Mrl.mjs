import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './entrypoint_ChOhswpG.mjs';
import 'clsx';
import { r as renderScript } from './script_BB9pTlk3.mjs';

const $$Toast = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Toast;
  const {
    message,
    type = "success",
    duration = 3e3
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="toast"${addAttribute(`toast toast--${type}`, "class")}${addAttribute(duration, "data-duration")} data-astro-cid-oozri3xh> ${type === "success" && "✅"} ${type === "error" && "❌"} ${type === "info" && "ℹ️"} ${type === "warning" && "⚠️"} ${" "}${message} </div>  ${renderScript($$result, "/Users/ivanramirez/Dashboard-Web-/src/components/ui/Toast.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/ivanramirez/Dashboard-Web-/src/components/ui/Toast.astro", void 0);

export { $$Toast as $ };
