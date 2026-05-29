// src/business/auth/userRoleService.ts
import { supabaseAdmin } from "../../data/client/supabaseAdmin";

export type RoleData =
  | { role: "admin";   usuarioId: number; nombre: string; estado?: undefined }
  | { role: "profesor"; usuarioId: number; nombre: string; estado: "pendiente" | "aprobado" | "rechazado" };

export async function getUserRole(authUid: string): Promise<RoleData | null> {

  const { data: usuario } = await supabaseAdmin
    .from("usuarios")
    .select(`
      usuario_id,
      nombre,
      apellido_paterno,
      apellido_materno
    `)
    .eq("auth_uid", authUid)
    .single();

  if (!usuario) return null;

  const usuarioId = usuario.usuario_id;

  const [{ data: admin }, { data: profesor }] = await Promise.all([
    supabaseAdmin
      .from("administrador")
      .select("admin_id")
      .eq("admin_id", usuarioId)
      .single(),

    supabaseAdmin
      .from("profesores")
      .select("estado")
      .eq("profesor_id", usuarioId)
      .single()
  ]);

  const nombreCompleto = [
    usuario.nombre,
    usuario.apellido_paterno,
    usuario.apellido_materno
  ]
    .filter(Boolean)
    .join(" ");

  if (admin) return {
    role:     "admin" as const,
    usuarioId,
    nombre:   nombreCompleto,
  };

  if (profesor) return {
    role:     "profesor" as const,
    estado:   profesor.estado as "pendiente" | "aprobado" | "rechazado",
    usuarioId,
    nombre:   nombreCompleto,
  };

  return null;
}