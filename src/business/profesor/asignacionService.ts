// src/business/profesor/asignacionService.ts
import { getPractices } from "./practicaService";
import { getGroupsByTeacher } from "./grupoService";
import { findGroupByIdAndTeacher } from "../../data/repositories/grupoRepository";
import {
  findAsignacionesByGrupo,
  insertAsignacion,
} from "../../data/repositories/asignacionRepository";

export async function getAssignmentFormData(usuarioId: number) {
  const [practicas, grupos] = await Promise.all([
    getPractices(),
    getGroupsByTeacher(usuarioId),
  ]);
  return { practicas, grupos };
}

export async function getAssignedPracticesByGroup(
  usuarioId: number,
  grupoId:   number,
) {
  const grupo = await findGroupByIdAndTeacher(grupoId, usuarioId);
  if (!grupo) return [];

  const asignaciones = await findAsignacionesByGrupo(grupoId);
  const practicas = asignaciones
    .map((row: any) => row.practicas)
    .filter(Boolean);

  return [
    ...new Map(
      practicas.map((p: any) => [p.practica_id, { practica_id: p.practica_id, titulo: p.titulo }])
    ).values(),
  ];
}

export async function assignPracticeToGroup(
  usuarioId:  number,
  practicaId: number,
  grupoId:    number,
  fechaFinStr?: string,
) {
  const grupo = await findGroupByIdAndTeacher(grupoId, usuarioId);
  if (!grupo) throw new Error("Grupo no autorizado");

  const hoy = new Date();

  // fecha de hoy sin hora (solo año/mes/día) para comparar limpio
  const hoyStr = hoy.toISOString().split("T")[0]; // "2026-06-07"

  const fechaFin = fechaFinStr
    ? new Date(fechaFinStr + "T23:59:59")   // ← fin del día elegido, hora local
    : new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

  if (!fechaFinStr || fechaFinStr < hoyStr) {
    throw new Error("Fecha inválida");
  }

  await insertAsignacion({
    practica_id:  practicaId,
    grupo_id:     grupoId,
    fecha_inicio: hoy.toISOString(),
    fecha_fin:    fechaFin.toISOString(),
  });
}