import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function getUserRole(authUid: string) {

  /*
  obtener datos del usuario base
  */
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

  /*
  consultar admin y profesor en paralelo
  */
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


  /*
  construir nombre completo
  */
  const nombreCompleto = [
    usuario.nombre,
    usuario.apellido_paterno,
    usuario.apellido_materno
  ]
    .filter(Boolean)
    .join(" ");


  if (admin) return {
    role: "admin",
    usuarioId,
    nombre: nombreCompleto
  };

  if (profesor) return {
    role: "profesor",
    estado: profesor.estado,
    usuarioId,
    nombre: nombreCompleto
  };

  return null;
}