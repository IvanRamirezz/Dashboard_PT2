import { supabase } from "../../../lib/supabase";

export async function getTeacherStats(usuarioId: number) {

  /* grupos del profesor */
  const { count: grupos } = await supabase
    .from("grupos")
    .select("*", { count: "exact", head: true })
    .eq("profesor_id", usuarioId)
    .eq("activo", true); 


  /* total practicas activas del sistema */
  const { count: practicas } = await supabase
    .from("practicas")
    .select("*", { count: "exact", head: true })
    .eq("activo", true);


  /* alumnos en los grupos del profesor */
  const { data: gruposProfesor } = await supabase
    .from("grupos")
    .select("grupo_id")
    .eq("profesor_id", usuarioId)
    .eq("activo", true);;

  const gruposIds = gruposProfesor?.map(g => g.grupo_id) ?? [];

  let alumnos = 0;

  if (gruposIds.length > 0) {

    const { count } = await supabase
      .from("alumnos")
      .select("*", { count: "exact", head: true })
      .in("grupo_id", gruposIds);

    alumnos = count ?? 0;
  }

  return {
    grupos: grupos ?? 0,
    practicas: practicas ?? 0,
    alumnos
  };

}