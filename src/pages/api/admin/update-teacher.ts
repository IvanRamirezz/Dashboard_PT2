// src/pages/api/admin/update-teacher.ts
import type { APIContext } from "astro";
import { getValidatedSession } from "../../../business/auth/sessionService";
import { getUserRole } from "../../../business/auth/userRoleService";
import { getSafeRedirectPath } from "../../../business/auth/redirects";
import { updateTeacherData } from "../../../business/admin/adminService";

export async function POST({ request, cookies }: APIContext) {
  const user = await getValidatedSession(cookies);
  if (!user) return new Response("No autorizado", { status: 401 });

  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return new Response("Sin permisos", { status: 403 });

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

  if (!profesor_id || profesor_id <= 0) {
    return new Response("ID de profesor inválido", { status: 400 });
  }

  if (!nombre || !apellido_paterno || !apellido_materno || !matricula_trabajador) {
  // construir URL limpia sin parámetros previos
  const errorUrl = new URL("/dashboard/admin/profesores", request.url);
  if (matricula_trabajador) errorUrl.searchParams.set("matricula", matricula_trabajador);
  errorUrl.searchParams.set("error", "campos_vacios");
  return Response.redirect(errorUrl, 303);
}

  try {
    await updateTeacherData(profesor_id, {
      nombre,
      apellido_paterno,
      apellido_materno,
      matricula_trabajador,
    });
  } catch (e) {
    console.error(e);
    return new Response("Error al actualizar", { status: 500 });
  }

  return Response.redirect(new URL(redirectPath, request.url), 303);
}