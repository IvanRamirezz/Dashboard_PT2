import { supabaseAdmin } from "../../../lib/supabaseAdmin";

/*
crear usuario base
*/
export async function createUsuario(
  authUid: string,
  nombre: string,
  apellidoPaterno: string,
  apellidoMaterno: string
) {
  const { data, error } = await supabaseAdmin
    .from("usuarios")
    .insert({
      auth_uid: authUid,
      nombre,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error("Error creando usuario");
  }

  return data;
}


/*
crear alumno
*/
export async function createAlumno(
  usuarioId: number,
  boleta: string
) {
  const { error } = await supabaseAdmin
    .from("alumnos")
    .insert({
      alumno_id: usuarioId,
      boleta,
    });

  if (error) {
    throw new Error(error.message);
  }
}


/*
crear profesor pendiente
*/
export async function createProfesor(
  usuarioId: number,
  matricula: string
) {
  const { error } = await supabaseAdmin
    .from("profesores")
    .insert({
      profesor_id: usuarioId,
      matricula_trabajador: matricula,
      estado: "pendiente",
    });

  if (error) {
    throw new Error(error.message);
  }
}