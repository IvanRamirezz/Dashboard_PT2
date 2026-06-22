import {
  findStudentByBoleta,
  findAllCiclosEscolares,
  findAllGruposByCiclo,
  findStudentsByGrupoAdmin,
} from "../../data/repositories/studentRepository";

const PAGE_SIZE = 5;

export async function getStudentByBoleta(boleta: string) {
  if (!boleta) throw new Error("Boleta requerida");
  return await findStudentByBoleta(boleta);
}

export async function getCiclosEscolares() {
  return await findAllCiclosEscolares();
}

export async function getGruposByCiclo(ciclo: string) {
  return await findAllGruposByCiclo(ciclo);
}

export async function getStudentListAdmin(
  grupoId: number,
  page: number,
  boleta?: string
) {
  return await findStudentsByGrupoAdmin(grupoId, page, PAGE_SIZE, boleta);
}

export { PAGE_SIZE };
