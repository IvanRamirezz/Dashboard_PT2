// src/business/profesor/grupoService.ts
import {
  findGroupsByTeacher,
  findGroupByName,
  findGroupByCode,
  findGroupByIdAndTeacher,
  insertGroup,
  updateGroupActivo,
  countGroupsByTeacher,
} from "../../data/repositories/grupoRepository";

function generarCodigo(longitud = 5): string {
  const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let codigo = "";
  for (let i = 0; i < longitud; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

function calcularCicloEscolar(): string {
  const now     = new Date();
  const year    = now.getFullYear();
  const periodo = now.getMonth() < 6 ? "2" : "1";
  return `${year}-${periodo}`;
}

export async function getGroupsByTeacher(usuarioId: number) {
  return findGroupsByTeacher(usuarioId);
}

export async function createGroup(usuarioId: number, nombre: string) {
  const ciclo     = calcularCicloEscolar();
  const existente = await findGroupByName(usuarioId, nombre, ciclo);

  if (existente && !existente.activo) {
    await updateGroupActivo(existente.grupo_id, true);
    return { reactivated: true };
  }

  if (existente?.activo) return { error: "existe" };

  // generar código único con reintentos
  let codigo_acceso = generarCodigo();
  let intentos = 0;

  while (intentos < 5) {
    const existe = await findGroupByCode(codigo_acceso);
    if (!existe) break;
    codigo_acceso = generarCodigo();
    intentos++;
  }

  const data = await insertGroup({
    nombre,
    codigo_acceso,
    ciclo_escolar: ciclo,
    profesor_id:   usuarioId,
  });

  return { data };
}

export async function deactivateGroupByName(usuarioId: number, nombre: string) {
  const ciclo = calcularCicloEscolar();
  const grupo = await findGroupByName(usuarioId, nombre, ciclo);

  if (!grupo || !grupo.activo) return { error: "no_existe" };

  await updateGroupActivo(grupo.grupo_id, false);
  return { success: true };
}

export { countGroupsByTeacher, findGroupsByTeacher, findGroupByIdAndTeacher };