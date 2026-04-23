import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

interface CalificacionBody {
  alumno_id:       number;
  practica_id:     number;
  calificacion:    number;
  respuestas_json: Record<string, unknown>;
}

// Función pura y testeable; el endpoint queda limpio de lógica de validación
function parseBody(body: unknown): CalificacionBody | null {
  if (!body || typeof body !== "object") return null;

  const { alumno_id, practica_id, calificacion, respuestas_json } =
    body as Record<string, unknown>;

  if (!alumno_id || !practica_id)            return null;
  if (typeof calificacion !== "number")       return null;

  return { alumno_id: Number(alumno_id), practica_id: Number(practica_id), calificacion, respuestas_json: (respuestas_json ?? {}) as Record<string, unknown> };
}

function jsonResponse(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body    = await request.json();
    const payload = parseBody(body);

    if (!payload) {
      return jsonResponse({ error: "Datos inválidos o incompletos" }, 400);
    }

    const { alumno_id, practica_id, calificacion, respuestas_json } = payload;

    const { data, error } = await supabaseAdmin
      .from("resultados")
      .update({ calificacion, respuestas_json })
      .eq("alumno_id",   alumno_id)
      .eq("practica_id", practica_id)
      .select();

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