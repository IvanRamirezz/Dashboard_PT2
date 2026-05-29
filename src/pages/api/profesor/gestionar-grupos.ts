// src/pages/api/profesor/gestionar-grupos.ts
import type { APIContext } from "astro";
import { apiRedirect } from "../../../utils/apiResponse";
import {
  createGroup,
  deactivateGroupByName,
} from "../../../business/profesor/grupoService";

const BASE = "/dashboard/profesor/gestionar-grupos";

export async function POST({ request, locals }: APIContext) {
  const { roleData } = locals;

  const form   = await request.formData();
  const action = form.get("action")?.toString();
  const nombre = form.get("grupo")?.toString().toUpperCase().trim();

  if (!nombre) return apiRedirect(new URL(BASE, request.url));

  try {
    if (action === "alta") {
      const result = await createGroup(roleData.usuarioId, nombre);
      if (result?.error === "existe")  return apiRedirect(new URL(`${BASE}?success=alta_existe`, request.url));
      if (result?.reactivated)         return apiRedirect(new URL(`${BASE}?success=reactivado`,  request.url));
      return apiRedirect(new URL(`${BASE}?success=alta`, request.url));
    }

    if (action === "baja") {
      const result = await deactivateGroupByName(roleData.usuarioId, nombre);
      if (result?.error === "no_existe") return apiRedirect(new URL(`${BASE}?success=baja_error`, request.url));
      return apiRedirect(new URL(`${BASE}?success=baja`, request.url));
    }

  } catch (e) {
    console.error("[gestionar-grupos]", e);
    return apiRedirect(new URL(`${BASE}?success=baja_error`, request.url));
  }

  return apiRedirect(new URL(BASE, request.url));
}