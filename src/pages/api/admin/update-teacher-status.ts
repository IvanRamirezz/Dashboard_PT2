// src/pages/api/admin/update-teacher-status.ts
import type { APIContext } from "astro";
import { getValidatedSession } from "../../../business/auth/sessionService";
import { getUserRole } from "../../../business/auth/userRoleService";
import { updateTeacherStatus } from "../../../business/admin/adminService";

export async function POST({ request, cookies }: APIContext) {
  const user = await getValidatedSession(cookies);
  if (!user) return new Response("No autorizado", { status: 401 });

  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return new Response("Sin permisos", { status: 403 });

  const formData   = await request.formData();
  const profesor_id = Number(formData.get("profesor_id"));
  const estado      = formData.get("estado")?.toString();

  if (!profesor_id || !estado) {
    return new Response("Datos incompletos", { status: 400 });
  }

  try {
    await updateTeacherStatus(profesor_id, estado as "pendiente" | "aprobado" | "rechazado");
  } catch (e) {
    console.error(e);
    return new Response("Error al actualizar", { status: 500 });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: "/dashboard/admin" },
  });
}