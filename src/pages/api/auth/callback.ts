// src/pages/api/auth/callback.ts
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../data/client/supabase";
import { getSafeRedirectPath } from "../../../business/auth/redirects";

export const GET: APIRoute = async ({ request }) => {
  const url      = new URL(request.url);
  const authCode = url.searchParams.get("code");
  const nextRaw  = url.searchParams.get("next") ?? "/";

  // validar que next sea una ruta interna
  const next = getSafeRedirectPath(nextRaw, "/");

  if (!authCode) {
    return new Response(null, {
      status: 302,
      headers: { location: "/auth/forgot-password?error=link_invalido" },
    });
  }

  // pasar las cookies del request para que PKCE pueda leer el code_verifier
  const requestHeaders  = new Headers({ cookie: request.headers.get("cookie") ?? "" });
  const responseHeaders = new Headers();

  const supabase = createSupabaseServerClient(requestHeaders, responseHeaders);
  const { error } = await supabase.auth.exchangeCodeForSession(authCode);

  if (error) {
    const isExpired = error.message.toLowerCase().includes("expired");
    const param     = isExpired ? "error=link_expirado" : "error=link_invalido";

    // copiar cookies de respuesta aunque haya error (limpia el code_verifier)
    const finalHeaders = new Headers(responseHeaders);
    finalHeaders.set("location", `/auth/forgot-password?${param}`);
    return new Response(null, { status: 302, headers: finalHeaders });
  }

  // propagar la sesión establecida por exchangeCodeForSession
  const finalHeaders = new Headers(responseHeaders);
  finalHeaders.set("location", next);
  return new Response(null, { status: 302, headers: finalHeaders });
};