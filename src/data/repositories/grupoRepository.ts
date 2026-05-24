// src/data/repositories/grupoRepository.ts
import { supabaseAdmin } from "../client/supabaseAdmin";

export async function findGroupsByTeacher(profesorId: number) {
  const { data, error } = await supabaseAdmin
    .from("grupos")
    .select("grupo_id, nombre, codigo_acceso, ciclo_escolar")
    .eq("profesor_id", profesorId)
    .eq("activo", true)
    .order("nombre");

  if (error) throw error;
  return data ?? [];
}

export async function findGroupByName(
  profesorId: number,
  nombre: string,
  cicloEscolar: string
) {
  const { data } = await supabaseAdmin
    .from("grupos")
    .select("grupo_id, activo")
    .eq("profesor_id",   profesorId)
    .eq("nombre",        nombre)
    .eq("ciclo_escolar", cicloEscolar)
    .maybeSingle();

  return data ?? null;
}

export async function findGroupByCode(codigoAcceso: string) {
  const { data } = await supabaseAdmin
    .from("grupos")
    .select("grupo_id")
    .eq("codigo_acceso", codigoAcceso)
    .maybeSingle();

  return data ?? null;
}

export async function findGroupByIdAndTeacher(
  grupoId: number,
  profesorId: number
) {
  const { data } = await supabaseAdmin
    .from("grupos")
    .select("grupo_id")
    .eq("grupo_id",    grupoId)
    .eq("profesor_id", profesorId)
    .eq("activo",      true)
    .maybeSingle();

  return data ?? null;
}

export async function findGroupIdsByTeacher(profesorId: number) {
  const { data } = await supabaseAdmin
    .from("grupos")
    .select("grupo_id")
    .eq("profesor_id", profesorId)
    .eq("activo", true);

  return data ?? [];
}

export async function insertGroup(datos: {
  nombre:        string;
  codigo_acceso: string;
  ciclo_escolar: string;
  profesor_id:   number;
}) {
  const { data, error } = await supabaseAdmin
    .from("grupos")
    .insert({ ...datos, activo: true })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGroupActivo(grupoId: number, activo: boolean) {
  const { error } = await supabaseAdmin
    .from("grupos")
    .update({ activo })
    .eq("grupo_id", grupoId);

  if (error) throw error;
}

export async function countGroupsByTeacher(profesorId: number) {
  const { count } = await supabaseAdmin
    .from("grupos")
    .select("*", { count: "exact", head: true })
    .eq("profesor_id", profesorId)
    .eq("activo", true);

  return count ?? 0;
}