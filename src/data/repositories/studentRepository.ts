// src/data/repositories/studentRepository.ts
import { supabaseAdmin } from "../../data/client/supabaseAdmin";

export async function findAllCiclosEscolares(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("grupos")
    .select("ciclo_escolar")
    .eq("activo", true)
    .order("ciclo_escolar", { ascending: false });

  if (error) throw error;
  const all = (data ?? []).map((g) => g.ciclo_escolar as string);
  return [...new Set(all)];
}

export async function findAllGruposByCiclo(cicloEscolar: string) {
  const { data, error } = await supabaseAdmin
    .from("grupos")
    .select("grupo_id, nombre")
    .eq("ciclo_escolar", cicloEscolar)
    .eq("activo", true)
    .order("nombre");

  if (error) throw error;
  return data ?? [];
}

export async function findStudentsByGrupoAdmin(
  grupoId: number,
  page: number,
  limit: number,
  boleta?: string
) {
  let query = supabaseAdmin
    .from("alumnos")
    .select(
      `alumno_id, boleta, usuarios ( nombre, apellido_paterno, apellido_materno )`,
      { count: "exact" }
    )
    .eq("grupo_id", grupoId);

  if (boleta) query = query.eq("boleta", boleta);

  const from = (page - 1) * limit;
  const { data, count, error } = await query
    .order("boleta")
    .range(from, from + limit - 1);

  if (error) throw error;
  return { data: data ?? [], total: count ?? 0 };
}

export async function findStudentByBoleta(boleta: string) {
  const { data, error } = await supabaseAdmin
    .from("alumnos")
    .select(`
      alumno_id,
      boleta,
      usuarios (
        nombre,
        apellido_paterno,
        apellido_materno
      )
    `)
    .eq("boleta", boleta)
    .single();

  if (error) return null;
  return data;
}

export async function deleteStudentByUsuarioId(usuarioId: number): Promise<void> {
  const { error } = await supabaseAdmin
    .from("usuarios")
    .delete()
    .eq("usuario_id", usuarioId);

  if (error) throw new Error(error.message);
}

export async function updateStudentByUsuarioId(
  usuarioId: number,
  datos: {
    nombre:           string;
    apellido_paterno: string;
    apellido_materno: string;
    boleta:           string;
  }
): Promise<void> {
  const [{ error: userError }, { error: alumnoError }] = await Promise.all([
    supabaseAdmin
      .from("usuarios")
      .update({
        nombre:           datos.nombre,
        apellido_paterno: datos.apellido_paterno,
        apellido_materno: datos.apellido_materno,
      })
      .eq("usuario_id", usuarioId),

    supabaseAdmin
      .from("alumnos")
      .update({ boleta: datos.boleta })
      .eq("alumno_id", usuarioId),
  ]);

  if (userError)  throw new Error(userError.message);
  if (alumnoError) throw new Error(alumnoError.message);
}