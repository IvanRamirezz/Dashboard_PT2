import { s as supabaseAdmin } from './supabaseAdmin_Bl60ioa3.mjs';

async function getPendingTeachers() {
  const { data, error } = await supabaseAdmin.from("profesores").select(`
    profesor_id,
    matricula_trabajador,
    estado,
    usuarios (
      nombre,
      apellido_paterno,
      apellido_materno
    )
  `).eq("estado", "pendiente");
  if (error) throw new Error(error.message);
  return data;
}
async function updateTeacherData(profesor_id, datos) {
  const { error: userError } = await supabaseAdmin.from("usuarios").update({
    nombre: datos.nombre,
    apellido_paterno: datos.apellido_paterno,
    apellido_materno: datos.apellido_materno
  }).eq("usuario_id", profesor_id);
  if (userError) throw new Error(userError.message);
  const { error: profesorError } = await supabaseAdmin.from("profesores").update({
    matricula_trabajador: datos.matricula_trabajador
  }).eq("profesor_id", profesor_id);
  if (profesorError) throw new Error(profesorError.message);
}

export { getPendingTeachers as g, updateTeacherData as u };
