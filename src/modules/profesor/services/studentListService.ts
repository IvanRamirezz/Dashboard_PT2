import { supabase }
from "../../../lib/supabase";


export async function getStudentListByGroup(

profesorId:number,
grupoId:number

){

/*
verificar grupo pertenece al profesor
*/
const { data: grupo } =
await supabase
.from("grupos")
.select("grupo_id")
.eq("grupo_id", grupoId)
.eq("profesor_id", profesorId)
.single();

if(!grupo)
return [];


/*
alumnos del grupo
*/
const { data: alumnos } =
await supabase
.from("alumnos")
.select(`
alumno_id,
boleta
`)
.eq("grupo_id", grupoId);

if(!alumnos?.length)
return [];


/*
datos de usuario
*/
const alumnoIds =
alumnos.map(a => a.alumno_id);


const { data: usuarios } =
await supabase
.from("usuarios")
.select(`
usuario_id,
nombre,
apellido_paterno,
apellido_materno
`)
.in("usuario_id", alumnoIds);


/*
unir info
*/
return alumnos.map(a => {

const usuario =
usuarios?.find(u =>
u.usuario_id === a.alumno_id
);

return {

alumno_id:
a.alumno_id,

nombre:
usuario
? `${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`
: "Sin nombre",

boleta:
a.boleta

};

});

}