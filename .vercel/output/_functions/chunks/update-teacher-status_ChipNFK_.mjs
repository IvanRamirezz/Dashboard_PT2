import { s as supabaseAdmin } from './supabaseAdmin_Bl60ioa3.mjs';
import { g as getValidatedSession } from './sessionService_EQ2ZgrkK.mjs';
import { g as getUserRole } from './userRoleService_bp0Wj9x4.mjs';

async function POST({ request, cookies }) {
  const user = await getValidatedSession(cookies);
  if (!user) return new Response("No autorizado", { status: 401 });
  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return new Response("Sin permisos", { status: 403 });
  const formData = await request.formData();
  const profesor_id = formData.get("profesor_id");
  const estado = formData.get("estado");
  if (!profesor_id || !estado) {
    return new Response("Datos incompletos", { status: 400 });
  }
  try {
    const { error } = await supabaseAdmin.from("profesores").update({ estado }).eq("profesor_id", profesor_id);
    if (error) {
      console.error(error);
      return new Response("Error al actualizar", { status: 500 });
    }
  } catch (e) {
    console.error(e);
    return new Response("Error inesperado", { status: 500 });
  }
  return new Response(null, {
    status: 302,
    headers: { Location: "/dashboard/admin" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
