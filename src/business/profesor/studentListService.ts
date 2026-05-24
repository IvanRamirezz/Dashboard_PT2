// src/business/profesor/studentListService.ts
import { supabaseAdmin } from "../../data/client/supabaseAdmin";

export async function getStudentListByGroup(
  profesorId: number,
  grupoId:    number,
) {
  // verificar que el grupo pertenece al profesor
  const { data: grupo } = await supabaseAdmin
    .from("grupos")
    .select("grupo_id")
    .eq("grupo_id",    grupoId)
    .eq("profesor_id", profesorId)
    .single();

  if (!grupo) return [];

  // alumnos del grupo
  const { data: alumnos } = await supabaseAdmin
    .from("alumnos")
    .select("alumno_id, boleta")
    .eq("grupo_id", grupoId);

  if (!alumnos?.length) return [];

  // datos de usuario en paralelo
  const alumnoIds = alumnos.map((a) => a.alumno_id);

  const { data: usuarios } = await supabaseAdmin
    .from("usuarios")
    .select("usuario_id, nombre, apellido_paterno, apellido_materno")
    .in("usuario_id", alumnoIds);

  // unir info
  return alumnos.map((a) => {
    const usuario = usuarios?.find((u) => u.usuario_id === a.alumno_id);

    return {
      alumno_id: a.alumno_id,
      nombre:    usuario
        ? `${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`
        : "Sin nombre",
      boleta: a.boleta,
    };
  });
}