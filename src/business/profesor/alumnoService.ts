// src/business/profesor/alumnoService.ts
import { findGroupByIdAndTeacher } from "../../data/repositories/grupoRepository";
import { findAlumnosByGrupo } from "../../data/repositories/alumnoRepository";
import { findResultadosByAlumnos } from "../../data/repositories/resultadoRepository";
import { findPracticasByIds } from "../../data/repositories/practicaRepository";
import { findUsuariosByIds, type UsuarioRow } from "../../data/repositories/userRepository";
import { buildNombreCompleto } from "../../utils/usuario";

interface ResultadoAlumno {
  alumno_id:       number;
  nombre:          string;
  boleta:          string;
  practica:        string;
  practica_id:     number | null;
  calificacion:    number | null;
  respuestas_json: Record<string, unknown> | null;
}

export async function getStudentsByTeacher(
  profesorId: number,
  grupoId:    number,
): Promise<ResultadoAlumno[]> {

  const grupo = await findGroupByIdAndTeacher(grupoId, profesorId);
  if (!grupo) return [];

  const alumnos = await findAlumnosByGrupo(grupoId);
  if (!alumnos.length) return [];

  const alumnoIds = alumnos.map((a) => a.alumno_id);

  const [usuarios, resultados] = await Promise.all([
    findUsuariosByIds(alumnoIds),
    findResultadosByAlumnos(alumnoIds),
  ]);

  const practicaIds = resultados.map((r) => r.practica_id);
  const practicas   = await findPracticasByIds(practicaIds);

  return construirLista(alumnos, usuarios, resultados, practicas);
}

function construirLista(
  alumnos:    { alumno_id: number; boleta: string }[],
  usuarios:   UsuarioRow[],
  resultados: { alumno_id: number; practica_id: number; calificacion: number | null; respuestas_json: Record<string, unknown> | null }[],
  practicas:  { practica_id: number; titulo: string }[]
): ResultadoAlumno[] {
  const lista: ResultadoAlumno[] = [];

  for (const alumno of alumnos) {
    const usuario          = usuarios.find((u) => u.usuario_id === alumno.alumno_id);
    const nombre           = buildNombreCompleto(usuario);
    const resultadosAlumno = resultados.filter((r) => r.alumno_id === alumno.alumno_id);

    if (!resultadosAlumno.length) continue;

    for (const r of resultadosAlumno) {
      const practica = practicas.find((p) => p.practica_id === r.practica_id);
      lista.push({
        alumno_id:       alumno.alumno_id,
        nombre,
        boleta:          alumno.boleta,
        practica:        practica?.titulo ?? "Sin práctica",
        practica_id:     r.practica_id,
        calificacion:    r.calificacion,
        respuestas_json: r.respuestas_json,
      });
    }
  }

  return lista;
}