// src/business/profesor/studentListService.ts
import { findGroupByIdAndTeacher } from "../../data/repositories/grupoRepository";
import { findAlumnosByGrupo } from "../../data/repositories/alumnoRepository";
import { findUsuariosByIds } from "../../data/repositories/userRepository";
import { buildNombreCompleto } from "../../utils/usuario";

export async function getStudentListByGroup(
  profesorId: number,
  grupoId:    number,
) {
  const grupo = await findGroupByIdAndTeacher(grupoId, profesorId);
  if (!grupo) return [];

  const alumnos = await findAlumnosByGrupo(grupoId);
  if (!alumnos.length) return [];

  const alumnoIds = alumnos.map((a) => a.alumno_id);
  const usuarios  = await findUsuariosByIds(alumnoIds);

  return alumnos.map((a) => ({
    alumno_id: a.alumno_id,
    nombre:    buildNombreCompleto(usuarios.find((u) => u.usuario_id === a.alumno_id)),
    boleta:    a.boleta,
  }));
}