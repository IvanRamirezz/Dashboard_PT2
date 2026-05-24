// src/pages/api/admin/delete-teacher.ts
import type { APIContext } from "astro";
import { getValidatedSession } from "../../../business/auth/sessionService";
import { getUserRole } from "../../../business/auth/userRoleService";
import { getSafeRedirectPath } from "../../../business/auth/redirects";
import { deleteTeacherById } from "../../../business/admin/adminService";

export async function POST({ request, cookies }: APIContext) {
  const user = await getValidatedSession(cookies);
  if (!user) return new Response("No autorizado", { status: 401 });

  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return new Response("Sin permisos", { status: 403 });

  const formData    = await request.formData();
  const profesor_id = Number(formData.get("profesor_id"));
  const redirectPath = getSafeRedirectPath(
    formData.get("redirect")?.toString(),
    "/dashboard/admin/profesores"
  );

  if (!profesor_id || profesor_id <= 0) {
    return new Response("ID inválido", { status: 400 });
  }

  try {
    await deleteTeacherById(profesor_id);
  } catch (e: any) {
    console.error(e);
    return new Response(e.message ?? "Error inesperado", { status: 500 });
  }

  return Response.redirect(
    new URL(redirectPath + "?deleted=1", request.url), 303
  );
}