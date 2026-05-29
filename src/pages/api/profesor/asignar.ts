// src/pages/api/profesor/asignar.ts
import type { APIContext } from "astro";
import { apiRedirect } from "../../../utils/apiResponse";
import { assignPracticeToGroup } from "../../../business/profesor/asignacionService";

const BASE = "/dashboard/profesor/asignar";

export async function POST({ request, locals }: APIContext) {
  const { roleData } = locals;

  const form       = await request.formData();
  const practicaId = Number(form.get("practica_id"));
  const grupoId    = Number(form.get("grupo_id"));
  const fechaFin   = form.get("fecha_fin")?.toString();

  if (!practicaId || !grupoId) {
    return apiRedirect(new URL(`${BASE}?error=campos`, request.url));
  }

  try {
    await assignPracticeToGroup(roleData.usuarioId, practicaId, grupoId, fechaFin);
  } catch (e) {
    console.error("[asignar]", e);
    return apiRedirect(new URL(`${BASE}?error=1`, request.url));
  }

  return apiRedirect(new URL(`${BASE}?success=asignacion`, request.url));
}