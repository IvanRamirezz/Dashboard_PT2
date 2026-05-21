// Con `output: 'static'` configurado:
// export const prerender = false;
import type { APIRoute } from "astro";
import { clearSessionCookies } from "../../../business/auth/sessionCookies";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  clearSessionCookies(cookies);
  return redirect("/");
};
