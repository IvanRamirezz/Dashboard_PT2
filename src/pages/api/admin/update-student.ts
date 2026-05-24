// src/pages/api/admin/update-student.ts
import type { APIContext } from "astro";
import { getValidatedSession } from "../../../business/auth/sessionService";
import { getUserRole } from "../../../business/auth/userRoleService";
import { getSafeRedirectPath } from "../../../business/auth/redirects";
import { updateStudentData } from "../../../business/admin/adminService";

export async function POST({ request, cookies }: APIContext) {
  const user = await getValidatedSession(cookies);
  if (!user) return new Response("No autorizado", { status: 401 });

  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return new Response("Sin permisos", { status: 403 });

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

  if (!alumno_id || alumno_id <= 0) {
    return new Response("ID de alumno inválido", { status: 400 });
  }

  // redirigir al formulario con error en lugar de pantalla en blanco
  if (!nombre || !apellido_paterno || !apellido_materno || !boleta) {
  const errorUrl = new URL("/dashboard/admin/alumnos", request.url);
  if (boleta) errorUrl.searchParams.set("boleta", boleta);
  errorUrl.searchParams.set("error", "campos_vacios");
  return Response.redirect(errorUrl, 303);
}

  try {
    await updateStudentData(alumno_id, {
      nombre,
      apellido_paterno,
      apellido_materno,
      boleta,
    });
  } catch (e) {
    console.error(e);
    return Response.redirect(
      new URL(`${redirectPath}&error=actualizacion`, request.url), 303
    );
  }

  return Response.redirect(new URL(redirectPath, request.url), 303);
}