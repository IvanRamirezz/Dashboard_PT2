import { supabase } from "../../../lib/supabase";

// Tipado explícito elimina el any[] y sirve de documentación implícita
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

  const grupoValido = await verificarGrupo(profesorId, grupoId);
  if (!grupoValido) return [];

  const alumnos = await fetchAlumnos(grupoId);
  if (!alumnos.length) return [];

  const alumnoIds = alumnos.map(a => a.alumno_id);

  const [usuarios, resultados] = await Promise.all([
    fetchUsuarios(alumnoIds),
    fetchResultados(alumnoIds),
  ]);

  const practicaIds = resultados.map(r => r.practica_id);
  const practicas   = await fetchPracticas(practicaIds);

  return construirLista(alumnos, usuarios, resultados, practicas);
}

// ─── Queries individuales (SRP: cada función hace exactamente una consulta) ──

async function verificarGrupo(profesorId: number, grupoId: number) {
  const { data } = await supabase
    .from("grupos")
    .select("grupo_id")
    .eq("grupo_id",    grupoId)
    .eq("profesor_id", profesorId)
    .single();
  return !!data;
}

async function fetchAlumnos(grupoId: number) {
  const { data, error } = await supabase
    .from("alumnos")
    .select("alumno_id, boleta")
    .eq("grupo_id", grupoId);

  if (error) throw error;
  return data ?? [];
}

async function fetchUsuarios(alumnoIds: number[]) {
  const { data } = await supabase
    .from("usuarios")
    .select("usuario_id, nombre, apellido_paterno, apellido_materno")
    .in("usuario_id", alumnoIds);
  return data ?? [];
}

async function fetchResultados(alumnoIds: number[]) {
  const { data } = await supabase
    .from("resultados")
    .select("alumno_id, practica_id, calificacion, respuestas_json")
    .in("alumno_id", alumnoIds);
  return data ?? [];
}

async function fetchPracticas(practicaIds: number[]) {
  const { data } = await supabase
    .from("practicas")
    .select("practica_id, titulo")
    .in("practica_id", practicaIds);
  return data ?? [];
}

// ─── Construcción del resultado en memoria ───────────────────────────────────

function construirNombre(usuario?: { nombre: string; apellido_paterno: string; apellido_materno: string }) {
  if (!usuario) return "Sin nombre";
  return `${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`;
}

function filaVacia(alumno: { alumno_id: number; boleta: string }, nombre: string): ResultadoAlumno {
  return {
    alumno_id:       alumno.alumno_id,
    nombre,
    boleta:          alumno.boleta,
    practica:        "Sin práctica",
    practica_id:     null,
    calificacion:    null,
    respuestas_json: null,
  };
}

function construirLista(alumnos: any[], usuarios: any[], resultados: any[], practicas: any[]): ResultadoAlumno[] {
  const lista: ResultadoAlumno[] = [];

  for (const alumno of alumnos) {
    const usuario = usuarios.find(u => u.usuario_id === alumno.alumno_id);
    const nombre  = construirNombre(usuario);
    const resultadosAlumno = resultados.filter(r => r.alumno_id === alumno.alumno_id);

    if (resultadosAlumno.length === 0) {
      lista.push(filaVacia(alumno, nombre));
      continue;
    }

    for (const r of resultadosAlumno) {
      const practica = practicas.find(p => p.practica_id === r.practica_id);
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