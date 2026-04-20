import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function findStudentByBoleta(boleta:string) {

  const { data, error } = await supabaseAdmin
    .from("alumnos")
    .select(`
      alumno_id,
      boleta,
      usuarios (
        nombre,
        apellido_paterno,
        apellido_materno
      )
    `)
    .eq("boleta", boleta)
    .single();

  if (error) return null;

  return data;

}