import type { APIContext } from "astro";
import { supabaseAdmin } from "../../../data/client/supabaseAdmin";
import { getValidatedSession } from "../../../business/auth/sessionService";
import { getUserRole } from "../../../business/auth/userRoleService";
import { getSafeRedirectPath } from "../../../business/auth/redirects";

export async function POST({ request, cookies }: APIContext) {

  /*
  validar sesión y rol
  */
  const user = await getValidatedSession(cookies);
  if (!user) return new Response("No autorizado", { status: 401 });

  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return new Response("Sin permisos", { status: 403 });

  /*
  obtener datos del form
  */
  const formData = await request.formData();

  const alumno_id = Number(formData.get("alumno_id"));
  const redirectPath = getSafeRedirectPath(
    formData.get("redirect")?.toString(),
    "/dashboard/admin/alumnos"
  );

  try {

    /*
    obtener auth_uid
    */
    const { data: usuario, error: userError } = await supabaseAdmin
      .from("usuarios")
      .select("auth_uid")
      .eq("usuario_id", alumno_id)
      .single();

    if (userError || !usuario) {
      console.error(userError);
      return new Response("Usuario no encontrado", { status: 404 });
    }

    /*
    eliminar usuario de auth
    */
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      usuario.auth_uid
    );

    if (authError) {
      console.error(authError);
      return new Response("Error eliminando auth user", { status: 500 });
    }

    /*
    eliminar registro en usuarios
    cascade eliminará alumno y resultados
    */
    const { error: dbError } = await supabaseAdmin
      .from("usuarios")
      .delete()
      .eq("usuario_id", alumno_id);

    if (dbError) {
      console.error(dbError);
      return new Response("Error eliminando usuario", { status: 500 });
    }

  } catch (e) {
    console.error(e);
    return new Response("Error inesperado", { status: 500 });
  }

  return Response.redirect(new URL(redirectPath, request.url), 303);

}
