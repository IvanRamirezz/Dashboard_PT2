// src/pages/api/profesor/actualizar-fecha-practica.ts
import type { APIContext } from "astro";
import { apiRedirect } from "../../../utils/apiResponse";
import { updateAssignmentDeadline } from "../../../business/profesor/asignacionService";

const BASE = "/dashboard/profesor/calificar";

export async function POST({ request, locals }: APIContext) {
  const { roleData } = locals;

  const form       = await request.formData();
  const grupoId    = Number(form.get("grupo_id"));
  const practicaId = Number(form.get("practica_id"));
  const fechaFin   = form.get("fecha_fin")?.toString();

  const redirectUrl = new URL(BASE, request.url);
  if (grupoId)    redirectUrl.searchParams.set("grupo", String(grupoId));
  if (practicaId) redirectUrl.searchParams.set("practica", String(practicaId));

  if (!grupoId || !practicaId || !fechaFin) {
    redirectUrl.searchParams.set("error", "fecha");
    return apiRedirect(redirectUrl);
  }

  try {
    await updateAssignmentDeadline(roleData.usuarioId, grupoId, practicaId, fechaFin);
  } catch (e) {
    console.error("[actualizar-fecha-practica]", e);
    redirectUrl.searchParams.set("error", "fecha");
    return apiRedirect(redirectUrl);
  }

  redirectUrl.searchParams.set("success", "fecha");
  return apiRedirect(redirectUrl);
}
