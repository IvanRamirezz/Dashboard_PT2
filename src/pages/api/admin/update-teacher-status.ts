// src/pages/api/admin/update-teacher-status.ts
import type { APIContext } from "astro";
import { getValidatedSession } from "../../../business/auth/sessionService";
import { getUserRole } from "../../../business/auth/userRoleService";
import { updateTeacherStatus } from "../../../business/admin/adminService";

const ESTADOS_VALIDOS = ["pendiente", "aprobado", "rechazado"] as const;
type EstadoValido = typeof ESTADOS_VALIDOS[number];

export async function POST({ request, cookies }: APIContext) {
  const user = await getValidatedSession(cookies);
  if (!user) return new Response("No autorizado", { status: 401 });

  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return new Response("Sin permisos", { status: 403 });

  const formData    = await request.formData();
  const profesor_id = Number(formData.get("profesor_id"));
  const estado      = formData.get("estado")?.toString();

  if (!profesor_id || profesor_id <= 0) {
    return new Response("ID de profesor inválido", { status: 400 });
  }

  if (!estado || !ESTADOS_VALIDOS.includes(estado as EstadoValido)) {
    return new Response("Estado inválido", { status: 400 });
  }

  try {
    await updateTeacherStatus(profesor_id, estado as EstadoValido);
  } catch (e) {
    console.error(e);
    return new Response("Error al actualizar", { status: 500 });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: "/dashboard/admin" },
  });
}