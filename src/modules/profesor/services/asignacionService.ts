import { getPractices } from "./practicaService";
import { getGroupsByTeacher } from "./grupoService";
import { supabase } from "../../../lib/supabase";


export async function getAssignmentFormData(
  usuarioId:number
){

  const [practicas, grupos] =
    await Promise.all([

      getPractices(),

      getGroupsByTeacher(usuarioId)

    ]);


  return {

    practicas,

    grupos

  };

}



export async function assignPracticeToGroup(

  practicaId:number,

  grupoId:number

){

  const hoy = new Date();

  const manana = new Date();

  manana.setDate(
    hoy.getDate() + 1
  );


  const { error } = await supabase
    .from("practicas_grupo")
    .insert({

      practica_id: practicaId,

      grupo_id: grupoId,

      fecha_inicio:
        hoy.toISOString(),

      fecha_fin:
        manana.toISOString(),

      activo: true

    });


  if(error) throw error;

}