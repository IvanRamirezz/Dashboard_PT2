// src/data/repositories/resultadoRepository.ts
import { supabaseAdmin } from "../client/supabaseAdmin";

export async function findResultadosByAlumnos(alumnoIds: number[]) {
  if (!alumnoIds.length) return [];

  const { data } = await supabaseAdmin
    .from("resultados")
    .select("alumno_id, practica_id, calificacion, respuestas_json")
    .in("alumno_id", alumnoIds);

  return data ?? [];
}

export async function findResultado(alumnoId: number, practicaId: number) {
  const { data } = await supabaseAdmin
    .from("resultados")
    .select("alumno_id, practica_id")
    .eq("alumno_id",   alumnoId)
    .eq("practica_id", practicaId)
    .single();

  return data ?? null;
}

export async function updateResultado(
  alumnoId:     number,
  practicaId:   number,
  calificacion: number,
  respuestasJson: Record<string, unknown>
) {
  const { data, error } = await supabaseAdmin
    .from("resultados")
    .update({ calificacion, respuestas_json: respuestasJson })
    .eq("alumno_id",   alumnoId)
    .eq("practica_id", practicaId)
    .select();

  if (error) throw error;
  return data;
}