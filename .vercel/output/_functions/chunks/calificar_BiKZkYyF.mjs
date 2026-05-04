import { s as supabaseAdmin } from './supabaseAdmin_Bl60ioa3.mjs';
import { g as getValidatedSession } from './sessionService_EQ2ZgrkK.mjs';
import { g as getUserRole } from './userRoleService_bp0Wj9x4.mjs';

function parseBody(body) {
  if (!body || typeof body !== "object") return null;
  const { alumno_id, practica_id, calificacion, respuestas_json } = body;
  if (!alumno_id || !practica_id) return null;
  if (typeof calificacion !== "number") return null;
  if (!Number.isFinite(calificacion)) return null;
  if (calificacion < 0 || calificacion > 10) return null;
  if (respuestas_json !== void 0 && (typeof respuestas_json !== "object" || respuestas_json === null || Array.isArray(respuestas_json))) {
    return null;
  }
  return { alumno_id: Number(alumno_id), practica_id: Number(practica_id), calificacion, respuestas_json: respuestas_json ?? {} };
}
function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
const POST = async ({ request, cookies }) => {
  try {
    const user = await getValidatedSession(cookies);
    if (!user) {
      return jsonResponse({ error: "No autorizado" }, 401);
    }
    const roleData = await getUserRole(user.id);
    if (roleData?.role !== "profesor" || roleData.estado !== "aprobado") {
      return jsonResponse({ error: "Sin permisos" }, 403);
    }
    const body = await request.json();
    const payload = parseBody(body);
    if (!payload) {
      return jsonResponse({ error: "Datos inválidos o incompletos" }, 400);
    }
    const { alumno_id, practica_id, calificacion, respuestas_json } = payload;
    const ownsResult = await teacherOwnsResult(roleData.usuarioId, alumno_id, practica_id);
    if (!ownsResult) {
      return jsonResponse({ error: "Sin permisos para calificar este registro" }, 403);
    }
    const { data, error } = await supabaseAdmin.from("resultados").update({ calificacion, respuestas_json }).eq("alumno_id", alumno_id).eq("practica_id", practica_id).select();
    if (error) {
      return jsonResponse({ error: error.message }, 500);
    }
    if (!data || data.length === 0) {
      return jsonResponse({ error: "No se encontró el registro a actualizar" }, 404);
    }
    return jsonResponse({ ok: true, data }, 200);
  } catch {
    return jsonResponse({ error: "Error interno del servidor" }, 500);
  }
};
async function teacherOwnsResult(profesorId, alumnoId, practicaId) {
  const { data: alumno, error: alumnoError } = await supabaseAdmin.from("alumnos").select("grupo_id").eq("alumno_id", alumnoId).single();
  if (alumnoError || !alumno?.grupo_id) {
    return false;
  }
  const [{ data: grupo, error: grupoError }, { data: resultado, error: resultadoError }] = await Promise.all([
    supabaseAdmin.from("grupos").select("grupo_id").eq("grupo_id", alumno.grupo_id).eq("profesor_id", profesorId).eq("activo", true).single(),
    supabaseAdmin.from("resultados").select("alumno_id, practica_id").eq("alumno_id", alumnoId).eq("practica_id", practicaId).single()
  ]);
  if (grupoError || resultadoError) {
    return false;
  }
  return !!grupo && !!resultado;
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
