import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './entrypoint_ChOhswpG.mjs';
import 'clsx';

const $$GrupoSelector = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$GrupoSelector;
  const { grupos, grupoId, extraParams = {} } = Astro2.props;
  const extraParamsJson = JSON.stringify(extraParams);
  return renderTemplate`${maybeRenderHead()}<label class="teacher-label">Grupo</label> <select class="teacher-select"${addAttribute(`
    const params = new URLSearchParams(location.search);
    params.set('grupo', this.value);

    const extra = ${extraParamsJson};
    Object.entries(extra).forEach(([k, v]) => params.set(k, v));

    location.search = params.toString();
  `, "onchange")}> ${grupos.map((g) => renderTemplate`<option${addAttribute(g.grupo_id, "value")}${addAttribute(g.grupo_id === grupoId, "selected")}> ${g.nombre} </option>`)} </select>`;
}, "/Users/ivanramirez/Dashboard-Web-/src/components/profesor/GrupoSelector.astro", void 0);

export { $$GrupoSelector as $ };
