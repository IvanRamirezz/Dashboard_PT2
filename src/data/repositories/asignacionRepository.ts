// src/data/repositories/asignacionRepository.ts
import { supabaseAdmin } from "../client/supabaseAdmin";

export async function findAsignacionesByGrupo(grupoId: number) {
  const { data, error } = await supabaseAdmin
    .from("practicas_grupo")
    .select(`
      asignacion_id,
      practica_id,
      fecha_inicio,
      fecha_fin,
      practicas (
        practica_id,
        titulo
      )
    `)
    .eq("grupo_id", grupoId)
    .order("fecha_fin");

  if (error) throw error;
  return data ?? [];
}

export async function insertAsignacion(datos: {
  practica_id:  number;
  grupo_id:     number;
  fecha_inicio: string;
  fecha_fin:    string;
}) {
  const { error } = await supabaseAdmin
    .from("practicas_grupo")
    .insert(datos);
  if (error) throw error;
}