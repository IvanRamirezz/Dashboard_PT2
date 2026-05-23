import { supabaseAdmin as supabase } from "../../data/client/supabaseAdmin";

export async function getPractices(){

  const { data, error } = await supabase
    .from("practicas")
    .select(`
      practica_id,
      titulo,
      descripcion
    `)
    .eq("activo", true)
    .order("titulo");


  if(error) throw error;

  return data ?? [];

}
