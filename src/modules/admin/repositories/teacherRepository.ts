import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function findTeacherByMatricula(matricula:string) {

  const { data, error } = await supabaseAdmin
    .from("profesores")
    .select(`
      profesor_id,
      matricula_trabajador,
      usuarios (
        nombre,
        apellido_paterno,
        apellido_materno
      )
    `)
    .eq("matricula_trabajador", matricula)
    .single();

  if (error) return null;

  return data;

}


export async function updateTeacher(data:any) {

  const { error } = await supabaseAdmin
    .from("usuarios")
    .update({
      nombre: data.nombre,
      apellido_paterno: data.apellido_paterno,
      apellido_materno: data.apellido_materno
    })
    .eq("usuario_id", data.profesor_id);

  if (error) throw error;

}