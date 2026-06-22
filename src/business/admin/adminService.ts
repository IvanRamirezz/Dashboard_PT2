// src/business/admin/adminService.ts
import {
  findPendingTeachers,
  findTeacherByMatricula,
  findProfesoresByNombre,
  updateTeacherUsuario,
  updateTeacherEstado,
  deleteProfesorById,
  type TeacherRow,
} from "../../data/repositories/profesorRepository";

import {
  deleteStudentByUsuarioId,
  updateStudentByUsuarioId,
} from "../../data/repositories/studentRepository";

export type Teacher = TeacherRow;

const TEACHER_PAGE_SIZE = 5;

export async function getPendingTeachers(): Promise<Teacher[]> {
  return findPendingTeachers();
}

export async function getProfesorListAdmin(page: number, nombre?: string) {
  return findProfesoresByNombre(page, TEACHER_PAGE_SIZE, nombre);
}

export { TEACHER_PAGE_SIZE };

export async function getTeacherByMatricula(matricula: string): Promise<Teacher | null> {
  return findTeacherByMatricula(matricula);
}

export async function updateTeacherData(
  profesor_id: number,
  datos: {
    nombre:               string;
    apellido_paterno:     string;
    apellido_materno:     string;
    matricula_trabajador: string;
  }
) {
  return updateTeacherUsuario(profesor_id, datos);
}

export async function updateTeacherStatus(
  profesor_id: number,
  estado: "pendiente" | "aprobado" | "rechazado"
) {
  return updateTeacherEstado(profesor_id, estado);
}

export async function deleteTeacherById(profesor_id: number) {
  return deleteProfesorById(profesor_id);
}

export async function deleteStudentById(alumno_id: number) {
  return deleteStudentByUsuarioId(alumno_id);
}

export async function updateStudentData(
  alumno_id: number,
  datos: {
    nombre:           string;
    apellido_paterno: string;
    apellido_materno: string;
    boleta:           string;
  }
) {
  return updateStudentByUsuarioId(alumno_id, datos);
}