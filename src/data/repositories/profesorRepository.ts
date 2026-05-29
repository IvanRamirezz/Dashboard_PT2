// src/data/repositories/profesorRepository.ts
import { supabaseAdmin } from "../client/supabaseAdmin";

export type TeacherRow = {
  profesor_id:          number;
  matricula_trabajador: string;
  estado:               "pendiente" | "aprobado" | "rechazado";
  usuarios: {
    nombre:           string;
    apellido_paterno: string;
    apellido_materno: string;
  };
};

const SELECT_TEACHER = `
  profesor_id,
  matricula_trabajador,
  estado,
  usuarios (
    nombre,
    apellido_paterno,
    apellido_materno
  )
`;

export async function findPendingTeachers(): Promise<TeacherRow[]> {
  const { data, error } = await supabaseAdmin
    .from("profesores")
    .select(SELECT_TEACHER)
    .eq("estado", "pendiente");

  if (error) throw new Error(error.message);
  return data as unknown as TeacherRow[];
}

export async function findTeacherByMatricula(matricula: string): Promise<TeacherRow | null> {
  const { data } = await supabaseAdmin
    .from("profesores")
    .select(SELECT_TEACHER)
    .eq("matricula_trabajador", matricula)
    .single();

  return data as unknown as TeacherRow | null;
}

export async function updateTeacherUsuario(
  profesorId: number,
  datos: { nombre: string; apellido_paterno: string; apellido_materno: string; matricula_trabajador: string }
) {
  const [{ error: userError }, { error: profError }] = await Promise.all([
    supabaseAdmin
      .from("usuarios")
      .update({ nombre: datos.nombre, apellido_paterno: datos.apellido_paterno, apellido_materno: datos.apellido_materno })
      .eq("usuario_id", profesorId),

    supabaseAdmin
      .from("profesores")
      .update({ matricula_trabajador: datos.matricula_trabajador })
      .eq("profesor_id", profesorId),
  ]);

  if (userError) throw new Error(userError.message);
  if (profError) throw new Error(profError.message);
}

export async function updateTeacherEstado(
  profesorId: number,
  estado: "pendiente" | "aprobado" | "rechazado"
) {
  const { error } = await supabaseAdmin
    .from("profesores")
    .update({ estado })
    .eq("profesor_id", profesorId);

  if (error) throw new Error(error.message);
}

export async function deleteProfesorById(profesorId: number) {
  const { error } = await supabaseAdmin
    .from("usuarios")
    .delete()
    .eq("usuario_id", profesorId);

  if (error) throw new Error(error.message);
}