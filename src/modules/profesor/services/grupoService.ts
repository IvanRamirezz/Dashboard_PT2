import { supabase } from "../../../lib/supabase";


/* obtener grupos del profesor */
export async function getGroupsByTeacher(
  usuarioId: number
){

  const { data, error } = await supabase
    .from("grupos")
    .select(`
      grupo_id,
      nombre,
      codigo_acceso,
      ciclo_escolar
    `)
    .eq("profesor_id", usuarioId)
    .eq("activo", true)
    .order("nombre");


  if(error) throw error;

  return data ?? [];

}



/* generar codigo acceso */
function generarCodigo(longitud = 5){

  const caracteres =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let codigo = "";

  for(let i=0;i<longitud;i++){

    codigo += caracteres.charAt(

      Math.floor(
        Math.random()*caracteres.length
      )

    );

  }

  return codigo;

}



/* crear grupo */
export async function createGroup(
  usuarioId:number,
  nombre:string
){

  const codigo = generarCodigo();

  const ciclo =
    new Date().getFullYear() + "-2";


  const { data, error } = await supabase
    .from("grupos")
    .insert({

      nombre,
      codigo_acceso: codigo,
      ciclo_escolar: ciclo,
      profesor_id: usuarioId,
      activo: true

    })
    .select()
    .single();


  if(error) throw error;

  return data;

}



/* dar de baja grupo */
export async function deactivateGroup(
  usuarioId:number,
  grupoId:number
){

  const { error } = await supabase
    .from("grupos")
    .update({

      activo:false

    })
    .eq("grupo_id", grupoId)
    .eq("profesor_id", usuarioId);


  if(error) throw error;

}