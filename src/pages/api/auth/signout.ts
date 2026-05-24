// src/pages/api/auth/signout.ts
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../data/client/supabase";
import { clearSessionCookies } from "../../../business/auth/sessionCookies";

export const POST: APIRoute = async ({ request, cookies }) => {
  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(request.headers, responseHeaders);

  // invalida el token en Supabase Auth — deja de ser válido inmediatamente
  await supabase.auth.signOut();

  clearSessionCookies(cookies);

  responseHeaders.set("location", "/");
  return new Response(null, { status: 302, headers: responseHeaders });
};