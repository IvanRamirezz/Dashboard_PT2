// src/pages/api/admin/update-teacher-status.ts
import type { APIContext } from "astro";
import { getValidatedSession } from "../../../business/auth/sessionService";
import { getUserRole } from "../../../business/auth/userRoleService";
import { updateTeacherStatus } from "../../../business/admin/adminService";
import { apiError, apiRedirect } from "../../../utils/apiResponse";

const ESTADOS_VALIDOS = ["pendiente", "aprobado", "rechazado"] as const;
type EstadoValido = typeof ESTADOS_VALIDOS[number];

export async function POST({ request, cookies }: APIContext) {
  const user = await getValidatedSession(cookies);
  if (!user) return apiError("No autorizado", 401);

  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return apiError("Sin permisos", 403);

  const formData    = await request.formData();
  const profesor_id = Number(formData.get("profesor_id"));
  const estado      = formData.get("estado")?.toString();

  if (!profesor_id || profesor_id <= 0) return apiError("ID de profesor inválido", 400);

  if (!estado || !ESTADOS_VALIDOS.includes(estado as EstadoValido)) {
    return apiError("Estado inválido", 400);
  }

  try {
    await updateTeacherStatus(profesor_id, estado as EstadoValido);
  } catch (e) {
    console.error("[update-teacher-status]", e);
    return apiError("Error al actualizar el estado", 500);
  }

  return apiRedirect(new URL("/dashboard/admin", request.url));
}