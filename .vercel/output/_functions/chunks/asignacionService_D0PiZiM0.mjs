import { c as createSupabaseServerClient } from './supabase_BobEUS0I.mjs';
import { g as getGroupsByTeacher } from './grupoService_NNlHUbJ0.mjs';
import { s as supabaseAdmin } from './supabaseAdmin_Bl60ioa3.mjs';

async function getPractices() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("practicas").select(`
      practica_id,
      titulo,
      descripcion
    `).eq("activo", true).order("titulo");
  if (error) throw error;
  return data ?? [];
}

async function getAssignmentFormData(usuarioId) {
  const [practicas, grupos] = await Promise.all([
    getPractices(),
    getGroupsByTeacher(usuarioId)
  ]);
  return {
    practicas,
    grupos
  };
}
async function getAssignedPracticesByGroup(usuarioId, grupoId) {
  const { data: grupo } = await supabaseAdmin.from("grupos").select("grupo_id").eq("grupo_id", grupoId).eq("profesor_id", usuarioId).eq("activo", true).maybeSingle();
  if (!grupo) {
    return [];
  }
  const { data, error } = await supabaseAdmin.from("practicas_grupo").select(`
      practica_id,
      practicas (
        practica_id,
        titulo
      )
    `).eq("grupo_id", grupoId).eq("activo", true);
  if (error) throw error;
  const practicas = (data ?? []).map((row) => row.practicas).filter(Boolean);
  return [
    ...new Map(
      practicas.map((practica) => [
        practica.practica_id,
        {
          practica_id: practica.practica_id,
          titulo: practica.titulo
        }
      ])
    ).values()
  ];
}
async function assignPracticeToGroup(usuarioId, practicaId, grupoId) {
  const { data: grupo } = await supabaseAdmin.from("grupos").select("grupo_id").eq("grupo_id", grupoId).eq("profesor_id", usuarioId).eq("activo", true).maybeSingle();
  if (!grupo) {
    throw new Error("Grupo no autorizado");
  }
  const hoy = /* @__PURE__ */ new Date();
  const manana = /* @__PURE__ */ new Date();
  manana.setDate(
    hoy.getDate() + 1
  );
  const { error } = await supabaseAdmin.from("practicas_grupo").insert({
    practica_id: practicaId,
    grupo_id: grupoId,
    fecha_inicio: hoy.toISOString(),
    fecha_fin: manana.toISOString(),
    activo: true
  });
  if (error) throw error;
}

export { assignPracticeToGroup as a, getAssignedPracticesByGroup as b, getAssignmentFormData as g };
