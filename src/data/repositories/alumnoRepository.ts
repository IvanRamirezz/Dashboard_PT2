// src/data/repositories/alumnoRepository.ts
import { supabaseAdmin } from "../client/supabaseAdmin";

export async function findAlumnosByGrupo(grupoId: number) {
  const { data, error } = await supabaseAdmin
    .from("alumnos")
    .select("alumno_id, boleta")
    .eq("grupo_id", grupoId);

  if (error) throw error;
  return data ?? [];
}

export async function findAlumnoGrupo(alumnoId: number) {
  const { data } = await supabaseAdmin
    .from("alumnos")
    .select("grupo_id")
    .eq("alumno_id", alumnoId)
    .single();

  return data ?? null;
}

export async function countAlumnosByGrupos(grupoIds: number[]) {
  if (!grupoIds.length) return 0;

  const { count } = await supabaseAdmin
    .from("alumnos")
    .select("*", { count: "exact", head: true })
    .in("grupo_id", grupoIds);

  return count ?? 0;
}