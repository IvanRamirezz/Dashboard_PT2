// src/pages/api/admin/update-teacher.ts
import type { APIContext } from "astro";
import { getValidatedSession } from "../../../business/auth/sessionService";
import { getUserRole } from "../../../business/auth/userRoleService";
import { getSafeRedirectPath } from "../../../business/auth/redirects";
import { updateTeacherData } from "../../../business/admin/adminService";
import { apiError, apiRedirect } from "../../../utils/apiResponse";

export async function POST({ request, cookies }: APIContext) {
  const user = await getValidatedSession(cookies);
  if (!user) return apiError("No autorizado", 401);

  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return apiError("Sin permisos", 403);

  const formData = await request.formData();

  const profesor_id          = Number(formData.get("profesor_id"));
  const nombre               = formData.get("nombre")?.toString().trim();
  const apellido_paterno     = formData.get("apellido_paterno")?.toString().trim();
  const apellido_materno     = formData.get("apellido_materno")?.toString().trim();
  const matricula_trabajador = formData.get("matricula_trabajador")?.toString().trim();
  const redirectPath = getSafeRedirectPath(
    formData.get("redirect")?.toString(),
    "/dashboard/admin/profesores"
  );

  if (!profesor_id || profesor_id <= 0) return apiError("ID de profesor inválido", 400);

  if (!nombre || !apellido_paterno || !apellido_materno || !matricula_trabajador) {
    const errorUrl = new URL("/dashboard/admin/profesores", request.url);
    if (matricula_trabajador) errorUrl.searchParams.set("matricula", matricula_trabajador);
    errorUrl.searchParams.set("error", "campos_vacios");
    return apiRedirect(errorUrl);
  }

  try {
    await updateTeacherData(profesor_id, {
      nombre,
      apellido_paterno,
      apellido_materno,
      matricula_trabajador,
    });
  } catch (e) {
    console.error("[update-teacher]", e);
    return apiError("Error al actualizar el profesor", 500);
  }

  return apiRedirect(new URL(redirectPath, request.url));
}