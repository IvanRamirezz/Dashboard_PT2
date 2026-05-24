// src/business/profesor/studentListService.ts
import { findGroupByIdAndTeacher } from "../../data/repositories/grupoRepository";
import { findAlumnosByGrupo } from "../../data/repositories/alumnoRepository";
import { supabaseAdmin } from "../../data/client/supabaseAdmin";

export async function getStudentListByGroup(
  profesorId: number,
  grupoId:    number,
) {
  const grupo = await findGroupByIdAndTeacher(grupoId, profesorId);
  if (!grupo) return [];

  const alumnos = await findAlumnosByGrupo(grupoId);
  if (!alumnos.length) return [];

  const alumnoIds = alumnos.map((a) => a.alumno_id);

  const { data: usuarios } = await supabaseAdmin
    .from("usuarios")
    .select("usuario_id, nombre, apellido_paterno, apellido_materno")
    .in("usuario_id", alumnoIds);

  return alumnos.map((a) => {
    const usuario = usuarios?.find((u) => u.usuario_id === a.alumno_id);
    return {
      alumno_id: a.alumno_id,
      nombre: usuario
        ? `${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`
        : "Sin nombre",
      boleta: a.boleta,
    };
  });
}