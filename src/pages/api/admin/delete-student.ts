// src/pages/api/admin/delete-student.ts
import type { APIContext } from "astro";
import { getValidatedSession } from "../../../business/auth/sessionService";
import { getUserRole } from "../../../business/auth/userRoleService";
import { getSafeRedirectPath } from "../../../business/auth/redirects";
import { deleteStudentById } from "../../../business/admin/adminService";
import { apiError, apiRedirect } from "../../../utils/apiResponse";

export async function POST({ request, cookies }: APIContext) {
  const user = await getValidatedSession(cookies);
  if (!user) return apiError("No autorizado", 401);

  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return apiError("Sin permisos", 403);

  const formData  = await request.formData();
  const alumno_id = Number(formData.get("alumno_id"));
  const redirectPath = getSafeRedirectPath(
    formData.get("redirect")?.toString(),
    "/dashboard/admin/alumnos"
  );

  if (!alumno_id || alumno_id <= 0) return apiError("ID de alumno inválido", 400);

  try {
    await deleteStudentById(alumno_id);
  } catch (e) {
    console.error("[delete-student]", e);
    return apiError("Error al eliminar el alumno", 500);
  }

  return apiRedirect(new URL(redirectPath + "?deleted=1", request.url));
}