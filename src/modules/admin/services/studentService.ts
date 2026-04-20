import { findStudentByBoleta } from "../repositories/studentRepository";

export async function getStudentByBoleta(boleta:string) {

  if (!boleta) {
    throw new Error("Boleta requerida");
  }

  return await findStudentByBoleta(boleta);

}