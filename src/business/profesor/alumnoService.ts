// src/business/profesor/alumnoService.ts
import { findGroupByIdAndTeacher } from "../../data/repositories/grupoRepository";
import { findAlumnosByGrupo } from "../../data/repositories/alumnoRepository";
import { findResultadosByAlumnos } from "../../data/repositories/resultadoRepository";
import { findPracticasByIds } from "../../data/repositories/practicaRepository";
import { supabaseAdmin } from "../../data/client/supabaseAdmin";

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
    fetchUsuarios(alumnoIds),
    findResultadosByAlumnos(alumnoIds),
  ]);

  const practicaIds = resultados.map((r) => r.practica_id);
  const practicas   = await findPracticasByIds(practicaIds);

  return construirLista(alumnos, usuarios, resultados, practicas);
}

// fetchUsuarios permanece aquí porque consulta usuarios — pertenece a userRepository
// pero para evitar dependencia circular lo mantenemos como helper local
async function fetchUsuarios(alumnoIds: number[]) {
  const { data } = await supabaseAdmin
    .from("usuarios")
    .select("usuario_id, nombre, apellido_paterno, apellido_materno")
    .in("usuario_id", alumnoIds);
  return data ?? [];
}

function construirNombre(usuario?: {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
}) {
  if (!usuario) return "Sin nombre";
  return `${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`;
}

function construirLista(
  alumnos:   any[],
  usuarios:  any[],
  resultados: any[],
  practicas: any[]
): ResultadoAlumno[] {
  const lista: ResultadoAlumno[] = [];

  for (const alumno of alumnos) {
    const usuario          = usuarios.find((u) => u.usuario_id === alumno.alumno_id);
    const nombre           = construirNombre(usuario);
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