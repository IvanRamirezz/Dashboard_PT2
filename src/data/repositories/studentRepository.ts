// src/data/repositories/studentRepository.ts
import { supabaseAdmin } from "../../data/client/supabaseAdmin";

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