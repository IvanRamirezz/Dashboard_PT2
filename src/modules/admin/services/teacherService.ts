import {
  findTeacherByMatricula,
  updateTeacher
} from "../repositories/teacherRepository";

export async function getTeacherByMatricula(matricula:string) {

  if (!matricula) {
    throw new Error("Matricula requerida");
  }

  return await findTeacherByMatricula(matricula);

}


export async function updateTeacherData(data:any) {

  if (!data.profesor_id) {
    throw new Error("Profesor inválido");
  }

  return await updateTeacher(data);

}