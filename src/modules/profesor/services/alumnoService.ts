import { supabase }
from "../../../lib/supabase";


export async function getStudentsByTeacher(
profesorId:number,
grupoId:number
){

/*
verificar grupo pertenece al profesor
*/
const { data: grupo, error: errorGrupo } =
await supabase
.from("grupos")
.select("grupo_id")
.eq("grupo_id", grupoId)
.eq("profesor_id", profesorId)
.single();

if(errorGrupo || !grupo)
return [];


/*
obtener alumnos del grupo
*/
const { data: alumnos, error: errorAlumnos } =
await supabase
.from("alumnos")
.select(`
  alumno_id,
  boleta
`)
.eq("grupo_id", grupoId);

if(errorAlumnos)
throw errorAlumnos;

if(!alumnos?.length)
return [];


/*
ids alumnos
*/
const alumnoIds =
alumnos.map(a => a.alumno_id);


/*
usuarios (nombre alumno)
*/
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
resultados (aquí están respuestas_json)
*/
const { data: resultados } =
await supabase
.from("resultados")
.select(`
  alumno_id,
  practica_id,
  calificacion,
  respuestas_json
`)
.in("alumno_id", alumnoIds);


/*
ids prácticas
*/
const practicaIds =
resultados?.map(r => r.practica_id) ?? [];


/*
info prácticas
*/
const { data: practicas } =
await supabase
.from("practicas")
.select(`
  practica_id,
  titulo
`)
.in("practica_id", practicaIds);



/*
armar lista
*/
let lista:any[] = [];

for(const alumno of alumnos){

const usuario =
usuarios?.find(u =>
u.usuario_id === alumno.alumno_id
);

const nombreCompleto =
usuario
? `${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`
: "Sin nombre";


const resultadosAlumno =
resultados?.filter(r =>
r.alumno_id === alumno.alumno_id
) ?? [];


/*
si no ha respondido nada
*/
if(resultadosAlumno.length === 0){

lista.push({

alumno_id: alumno.alumno_id,
nombre: nombreCompleto,
boleta: alumno.boleta,
practica: "Sin práctica",
calificacion: null,
respuestas_json: null,
practica_id: null

});

continue;

}


/*
si tiene resultados
*/
for(const r of resultadosAlumno){

const practica =
practicas?.find(p =>
p.practica_id === r.practica_id
);

lista.push({

alumno_id: alumno.alumno_id,
nombre: nombreCompleto,
boleta: alumno.boleta,
practica: practica?.titulo ?? "Sin práctica",
calificacion: r.calificacion,
respuestas_json: r.respuestas_json,
practica_id: r.practica_id

});

}

}

return lista;

}