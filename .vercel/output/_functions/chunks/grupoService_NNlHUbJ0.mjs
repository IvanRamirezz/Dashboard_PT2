import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { m as maybeRenderHead, r as renderTemplate, p as renderSlot } from './entrypoint_ChOhswpG.mjs';
import 'clsx';
import { s as supabaseAdmin } from './supabaseAdmin_Bl60ioa3.mjs';

const $$TeacherSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$TeacherSection;
  const { title, description } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="teacher-dashboard"> <h2 class="teacher-section-title">${title}</h2> ${description && renderTemplate`<p class="teacher-section-description">${description}</p>`} <div class="teacher-box"> ${renderSlot($$result, $$slots["default"])} </div> </section>`;
}, "/Users/ivanramirez/Dashboard-Web-/src/components/profesor/TeacherSection.astro", void 0);

function generarCodigo(longitud = 5) {
  const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let codigo = "";
  for (let i = 0; i < longitud; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}
function calcularCicloEscolar() {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const periodo = now.getMonth() < 6 ? "2" : "1";
  return `${year}-${periodo}`;
}
async function getGroupsByTeacher(usuarioId) {
  const { data, error } = await supabaseAdmin.from("grupos").select("grupo_id, nombre, codigo_acceso, ciclo_escolar").eq("profesor_id", usuarioId).eq("activo", true).order("nombre");
  if (error) throw error;
  return data ?? [];
}
async function createGroup(usuarioId, nombre) {
  const ciclo = calcularCicloEscolar();
  const { data: existente } = await supabaseAdmin.from("grupos").select("grupo_id, activo").eq("profesor_id", usuarioId).eq("nombre", nombre).eq("ciclo_escolar", ciclo).maybeSingle();
  if (existente && !existente.activo) {
    const { error: error2 } = await supabaseAdmin.from("grupos").update({ activo: true }).eq("grupo_id", existente.grupo_id);
    if (error2) throw error2;
    return { reactivated: true };
  }
  if (existente?.activo) {
    return { error: "existe" };
  }
  const { data, error } = await supabaseAdmin.from("grupos").insert({
    nombre,
    codigo_acceso: generarCodigo(),
    ciclo_escolar: ciclo,
    profesor_id: usuarioId,
    activo: true
  }).select().single();
  if (error) throw error;
  return { data };
}
async function deactivateGroupByName(usuarioId, nombre) {
  const { data: grupo } = await supabaseAdmin.from("grupos").select("grupo_id").eq("profesor_id", usuarioId).eq("nombre", nombre).eq("activo", true).maybeSingle();
  if (!grupo) return { error: "no_existe" };
  const { error } = await supabaseAdmin.from("grupos").update({ activo: false }).eq("grupo_id", grupo.grupo_id);
  if (error) throw error;
  return { success: true };
}

export { $$TeacherSection as $, createGroup as c, deactivateGroupByName as d, getGroupsByTeacher as g };
