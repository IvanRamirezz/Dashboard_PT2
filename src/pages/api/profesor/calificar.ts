// src/pages/api/profesor/calificar.ts
import type { APIRoute } from "astro";
import { getValidatedSession } from "../../../business/auth/sessionService";
import { getUserRole } from "../../../business/auth/userRoleService";
import { findAlumnoGrupo } from "../../../data/repositories/alumnoRepository";
import { findGroupByIdAndTeacher } from "../../../data/repositories/grupoRepository";
import { findResultado, updateResultado } from "../../../data/repositories/resultadoRepository";

interface CalificacionBody {
  alumno_id:       number;
  practica_id:     number;
  calificacion:    number;
  respuestas_json: Record<string, unknown>;
}

function parseBody(body: unknown): CalificacionBody | null {
  if (!body || typeof body !== "object") return null;

  const { alumno_id, practica_id, calificacion, respuestas_json } =
    body as Record<string, unknown>;

  if (!alumno_id || !practica_id)            return null;
  if (typeof calificacion !== "number")       return null;
  if (!Number.isFinite(calificacion))         return null;
  if (calificacion < 0 || calificacion > 10) return null;
  if (
    respuestas_json !== undefined &&
    (typeof respuestas_json !== "object" || respuestas_json === null || Array.isArray(respuestas_json))
  ) {
    return null;
  }

  return {
    alumno_id:       Number(alumno_id),
    practica_id:     Number(practica_id),
    calificacion,
    respuestas_json: (respuestas_json ?? {}) as Record<string, unknown>,
  };
}

function jsonResponse(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const user = await getValidatedSession(cookies);
    if (!user) return jsonResponse({ error: "No autorizado" }, 401);

    const roleData = await getUserRole(user.id);
    if (roleData?.role !== "profesor" || roleData.estado !== "aprobado") {
      return jsonResponse({ error: "Sin permisos" }, 403);
    }

    const body    = await request.json();
    const payload = parseBody(body);

    if (!payload) return jsonResponse({ error: "Datos inválidos o incompletos" }, 400);

    const { alumno_id, practica_id, calificacion, respuestas_json } = payload;

    const ownsResult = await teacherOwnsResult(roleData.usuarioId, alumno_id, practica_id);
    if (!ownsResult) return jsonResponse({ error: "Sin permisos para calificar este registro" }, 403);

    const data = await updateResultado(alumno_id, practica_id, calificacion, respuestas_json);

    if (!data || data.length === 0) {
      return jsonResponse({ error: "No se encontró el registro a actualizar" }, 404);
    }

    return jsonResponse({ ok: true, data }, 200);

  } catch {
    return jsonResponse({ error: "Error interno del servidor" }, 500);
  }
};

async function teacherOwnsResult(
  profesorId: number,
  alumnoId:   number,
  practicaId: number,
) {
  const alumno = await findAlumnoGrupo(alumnoId);
  if (!alumno?.grupo_id) return false;

  const [grupo, resultado] = await Promise.all([
    findGroupByIdAndTeacher(alumno.grupo_id, profesorId),
    findResultado(alumnoId, practicaId),
  ]);

  return !!grupo && !!resultado;
}