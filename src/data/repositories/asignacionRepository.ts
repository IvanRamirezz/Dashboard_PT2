// src/data/repositories/asignacionRepository.ts
import { supabaseAdmin } from "../client/supabaseAdmin";

export async function findAsignacionesByGrupo(grupoId: number) {
  const { data, error } = await supabaseAdmin
    .from("practicas_grupo")
    .select(`
      practica_id,
      practicas (
        practica_id,
        titulo
      )
    `)
    .eq("grupo_id", grupoId)
    .eq("activo", true);

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
    .insert({ ...datos, activo: true });

  if (error) throw error;
}