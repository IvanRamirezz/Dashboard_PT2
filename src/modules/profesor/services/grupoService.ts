import { supabase } from "../../../lib/supabase";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generarCodigo(longitud = 5): string {
  const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let codigo = "";
  for (let i = 0; i < longitud; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

// Extraída del inline de createGroup; función pura y testeable
function calcularCicloEscolar(): string {
  const now    = new Date();
  const year   = now.getFullYear();
  const periodo = now.getMonth() < 6 ? "2" : "1"; // <6 = semestre par
  return `${year}-${periodo}`;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function getGroupsByTeacher(usuarioId: number) {
  const { data, error } = await supabase
    .from("grupos")
    .select("grupo_id, nombre, codigo_acceso, ciclo_escolar")
    .eq("profesor_id", usuarioId)
    .eq("activo", true)
    .order("nombre");

  if (error) throw error;
  return data ?? [];
}

export async function createGroup(usuarioId: number, nombre: string) {
  const ciclo = calcularCicloEscolar();

  const { data: existente } = await supabase
    .from("grupos")
    .select("grupo_id, activo")
    .eq("profesor_id",   usuarioId)
    .eq("nombre",        nombre)
    .eq("ciclo_escolar", ciclo)
    .maybeSingle();

  if (existente && !existente.activo) {
    const { error } = await supabase
      .from("grupos")
      .update({ activo: true })
      .eq("grupo_id", existente.grupo_id);

    if (error) throw error;
    return { reactivated: true };
  }

  if (existente?.activo) {
    return { error: "existe" };
  }

  const { data, error } = await supabase
    .from("grupos")
    .insert({
      nombre,
      codigo_acceso: generarCodigo(),
      ciclo_escolar: ciclo,
      profesor_id:   usuarioId,
      activo:        true,
    })
    .select()
    .single();

  if (error) throw error;
  return { data };
}

export async function deactivateGroupByName(usuarioId: number, nombre: string) {
  const { data: grupo } = await supabase
    .from("grupos")
    .select("grupo_id")
    .eq("profesor_id", usuarioId)
    .eq("nombre",      nombre)
    .eq("activo",      true)
    .maybeSingle();

  if (!grupo) return { error: "no_existe" };

  const { error } = await supabase
    .from("grupos")
    .update({ activo: false })
    .eq("grupo_id", grupo.grupo_id);

  if (error) throw error;
  return { success: true };
}