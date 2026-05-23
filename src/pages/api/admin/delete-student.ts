// src/pages/api/admin/delete-student.ts
import type { APIContext } from "astro";
import { getValidatedSession } from "../../../business/auth/sessionService";
import { getUserRole } from "../../../business/auth/userRoleService";
import { getSafeRedirectPath } from "../../../business/auth/redirects";
import { deleteStudentById } from "../../../business/admin/adminService";

export async function POST({ request, cookies }: APIContext) {
  const user = await getValidatedSession(cookies);
  if (!user) return new Response("No autorizado", { status: 401 });

  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return new Response("Sin permisos", { status: 403 });

  const formData    = await request.formData();
  const alumno_id   = Number(formData.get("alumno_id"));
  const redirectPath = getSafeRedirectPath(
    formData.get("redirect")?.toString(),
    "/dashboard/admin/alumnos"
  );

  try {
    await deleteStudentById(alumno_id);
  } catch (e: any) {
    console.error(e);
    return new Response(e.message ?? "Error inesperado", { status: 500 });
  }

  return Response.redirect(
  new URL("/dashboard/admin/alumnos?deleted=1", request.url), 303
  );
}