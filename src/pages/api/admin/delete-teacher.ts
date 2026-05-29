// src/pages/api/admin/delete-teacher.ts
import type { APIContext } from "astro";
import { getValidatedSession } from "../../../business/auth/sessionService";
import { getUserRole } from "../../../business/auth/userRoleService";
import { getSafeRedirectPath } from "../../../business/auth/redirects";
import { deleteTeacherById } from "../../../business/admin/adminService";
import { apiError, apiRedirect } from "../../../utils/apiResponse";

export async function POST({ request, cookies }: APIContext) {
  const user = await getValidatedSession(cookies);
  if (!user) return apiError("No autorizado", 401);

  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return apiError("Sin permisos", 403);

  const formData    = await request.formData();
  const profesor_id = Number(formData.get("profesor_id"));
  const redirectPath = getSafeRedirectPath(
    formData.get("redirect")?.toString(),
    "/dashboard/admin/profesores"
  );

  if (!profesor_id || profesor_id <= 0) return apiError("ID de profesor inválido", 400);

  try {
    await deleteTeacherById(profesor_id);
  } catch (e) {
    console.error("[delete-teacher]", e);
    return apiError("Error al eliminar el profesor", 500);
  }

  return apiRedirect(new URL(redirectPath + "?deleted=1", request.url));
}