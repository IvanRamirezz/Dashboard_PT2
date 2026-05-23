// src/pages/api/auth/callback.ts
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../data/client/supabase";

export const GET: APIRoute = async ({ request }) => {
  const url      = new URL(request.url);
  const authCode = url.searchParams.get("code");
  const next     = url.searchParams.get("next") ?? "/";

  if (!authCode) {
    return new Response(null, {
      status: 302,
      headers: { location: "/auth/forgot-password?error=link_invalido" },
    });
  }

  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(request.headers, responseHeaders);

  const { error } = await supabase.auth.exchangeCodeForSession(authCode);

  if (error) {
    // no exponer el mensaje interno — redirigir con error genérico
    const isExpired = error.message.toLowerCase().includes("expired");
    const param     = isExpired ? "error=link_expirado" : "error=link_invalido";
    responseHeaders.set("location", `/auth/forgot-password?${param}`);
    return new Response(null, { status: 302, headers: responseHeaders });
  }

  responseHeaders.set("location", next);
  return new Response(null, { status: 302, headers: responseHeaders });
};