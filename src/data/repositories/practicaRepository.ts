// src/data/repositories/practicaRepository.ts
import { supabaseAdmin } from "../client/supabaseAdmin";

export async function findActivePracticas() {
  const { data, error } = await supabaseAdmin
    .from("practicas")
    .select("practica_id, titulo, descripcion")
    .eq("activo", true)
    .order("titulo");

  if (error) throw error;
  return data ?? [];
}

export async function findPracticasByIds(practicaIds: number[]) {
  if (!practicaIds.length) return [];

  const { data } = await supabaseAdmin
    .from("practicas")
    .select("practica_id, titulo")
    .in("practica_id", practicaIds);

  return data ?? [];
}

export async function countActivePracticas() {
  const { count } = await supabaseAdmin
    .from("practicas")
    .select("*", { count: "exact", head: true })
    .eq("activo", true);

  return count ?? 0;
}