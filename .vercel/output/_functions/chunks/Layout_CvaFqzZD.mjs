import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { q as renderHead, p as renderSlot, r as renderTemplate } from './entrypoint_ChOhswpG.mjs';
import 'clsx';

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "FiberLab" } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="icon" href="/LogoFiberLabvr.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">${renderHead()}</head> <body> <main> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "/Users/ivanramirez/Dashboard-Web-/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
