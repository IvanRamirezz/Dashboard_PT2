import { getPractices } from "./practicaService";
import { getGroupsByTeacher } from "./grupoService";
import { supabaseAdmin } from "../../data/client/supabaseAdmin";


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

export async function getAssignedPracticesByGroup(
  usuarioId: number,
  grupoId: number,
) {
  const { data: grupo } = await supabaseAdmin
    .from("grupos")
    .select("grupo_id")
    .eq("grupo_id", grupoId)
    .eq("profesor_id", usuarioId)
    .eq("activo", true)
    .maybeSingle();

  if (!grupo) {
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from("practicas_grupo")
    .select(`
      practica_id,
      practicas (
        practica_id,
        titulo
      )
    `)
    .eq("grupo_id", grupoId)
    .eq("activo", true);

  if (error) throw error;

  const practicas = (data ?? [])
    .map((row: any) => row.practicas)
    .filter(Boolean);

  return [
    ...new Map(
      practicas.map((practica: any) => [
        practica.practica_id,
        {
          practica_id: practica.practica_id,
          titulo: practica.titulo,
        },
      ])
    ).values(),
  ];
}



export async function assignPracticeToGroup(

  usuarioId:number,

  practicaId:number,

  grupoId:number

){
  const { data: grupo } = await supabaseAdmin
    .from("grupos")
    .select("grupo_id")
    .eq("grupo_id", grupoId)
    .eq("profesor_id", usuarioId)
    .eq("activo", true)
    .maybeSingle();

  if (!grupo) {
    throw new Error("Grupo no autorizado");
  }

  const hoy = new Date();

  const manana = new Date();

  manana.setDate(
    hoy.getDate() + 1
  );


  const { error } = await supabaseAdmin
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
