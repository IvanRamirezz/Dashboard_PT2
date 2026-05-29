// src/pages/api/admin/update-student.ts
import type { APIContext } from "astro";
import { getValidatedSession } from "../../../business/auth/sessionService";
import { getUserRole } from "../../../business/auth/userRoleService";
import { getSafeRedirectPath } from "../../../business/auth/redirects";
import { updateStudentData } from "../../../business/admin/adminService";
import { apiError, apiRedirect } from "../../../utils/apiResponse";

export async function POST({ request, cookies }: APIContext) {
  const user = await getValidatedSession(cookies);
  if (!user) return apiError("No autorizado", 401);

  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return apiError("Sin permisos", 403);

  const formData = await request.formData();

  const alumno_id        = Number(formData.get("alumno_id"));
  const nombre           = formData.get("nombre")?.toString().trim();
  const apellido_paterno = formData.get("apellido_paterno")?.toString().trim();
  const apellido_materno = formData.get("apellido_materno")?.toString().trim();
  const boleta           = formData.get("boleta")?.toString().trim();
  const redirectPath = getSafeRedirectPath(
    formData.get("redirect")?.toString(),
    "/dashboard/admin/alumnos"
  );

  if (!alumno_id || alumno_id <= 0) return apiError("ID de alumno inválido", 400);

  if (!nombre || !apellido_paterno || !apellido_materno || !boleta) {
    const errorUrl = new URL("/dashboard/admin/alumnos", request.url);
    if (boleta) errorUrl.searchParams.set("boleta", boleta);
    errorUrl.searchParams.set("error", "campos_vacios");
    return apiRedirect(errorUrl);
  }

  try {
    await updateStudentData(alumno_id, {
      nombre,
      apellido_paterno,
      apellido_materno,
      boleta,
    });
  } catch (e) {
    console.error("[update-student]", e);
    return apiError("Error al actualizar el alumno", 500);
  }

  return apiRedirect(new URL(redirectPath, request.url));
}