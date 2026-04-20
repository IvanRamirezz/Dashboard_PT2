import { supabaseAdmin } from "../../../lib/supabaseAdmin";


/* =====================
TIPO
===================== */

export type Teacher = {

  profesor_id: number;

  matricula_trabajador: string;

  estado: "pendiente" | "aprobado" | "rechazado";

  usuarios: {

    nombre: string;

    apellido_paterno: string;

    apellido_materno: string;

  };

};



/* =====================
PROFESORES PENDIENTES
===================== */

export async function getPendingTeachers(): Promise<Teacher[]> {

  const { data, error } = await supabaseAdmin
  .from("profesores")
  .select(`
    profesor_id,
    matricula_trabajador,
    estado,
    usuarios (
      nombre,
      apellido_paterno,
      apellido_materno
    )
  `)
  .eq("estado","pendiente");


  if(error) throw new Error(error.message);

  return data as unknown as Teacher[];

}



/* =====================
BUSCAR PROFESOR
===================== */

export async function getTeacherByMatricula(
  matricula:string
): Promise<Teacher | null> {

  const { data, error } = await supabaseAdmin
  .from("profesores")
  .select(`
    profesor_id,
    matricula_trabajador,
    estado,
    usuarios (
      nombre,
      apellido_paterno,
      apellido_materno
    )
  `)
  .eq("matricula_trabajador", matricula)
  .single();


  if(error) return null;

  return data as unknown as Teacher;

}



/* =====================
ACTUALIZAR DATOS
===================== */

export async function updateTeacherData(

  profesor_id:number,

  datos:{

    nombre:string;

    apellido_paterno:string;

    apellido_materno:string;

    matricula_trabajador:string;

  }

){

  /* tabla usuarios */

  const { error: userError } = await supabaseAdmin
  .from("usuarios")
  .update({

    nombre: datos.nombre,

    apellido_paterno: datos.apellido_paterno,

    apellido_materno: datos.apellido_materno

  })
  .eq("usuario_id", profesor_id);


  if(userError) throw new Error(userError.message);



  /* tabla profesores */

  const { error: profesorError } = await supabaseAdmin
  .from("profesores")
  .update({

    matricula_trabajador: datos.matricula_trabajador

  })
  .eq("profesor_id", profesor_id);


  if(profesorError) throw new Error(profesorError.message);

}



/* =====================
CAMBIAR ESTADO
===================== */

export async function updateTeacherStatus(

  profesor_id:number,

  estado:"pendiente" | "aprobado" | "rechazado"

){

  const { error } = await supabaseAdmin
  .from("profesores")
  .update({ estado })
  .eq("profesor_id", profesor_id);


  if(error) throw new Error(error.message);

}



/* =====================
ELIMINAR PROFESOR
(borra tambien usuarios por cascade)
===================== */

export async function deleteTeacher(

  profesor_id:number

){

  const { error } = await supabaseAdmin
  .from("usuarios")
  .delete()
  .eq("usuario_id", profesor_id);


  if(error) throw new Error(error.message);

}