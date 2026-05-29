// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { getValidatedSession } from "./business/auth/sessionService";
import { getUserRole } from "./business/auth/userRoleService";

// rutas de dashboard (páginas)
const RUTAS_ADMIN    = ["/dashboard/admin"];
const RUTAS_PROFESOR = ["/dashboard/profesor"];

// rutas de API protegidas — el middleware también las cubre
const API_ADMIN    = ["/api/admin"];
const API_PROFESOR = ["/api/profesor"];

function startsWith(pathname: string, prefixes: string[]) {
  return prefixes.some(r => pathname === r || pathname.startsWith(r + "/"));
}

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  const esAdmin    = startsWith(pathname, [...RUTAS_ADMIN,    ...API_ADMIN]);
  const esProfesor = startsWith(pathname, [...RUTAS_PROFESOR, ...API_PROFESOR]);

  // ruta pública — pasar sin validar
  if (!esAdmin && !esProfesor) return next();

  // validar sesión
  const user = await getValidatedSession(context.cookies);
  if (!user) {
    // para rutas API devolver 401 JSON; para páginas redirigir
    if (startsWith(pathname, [...API_ADMIN, ...API_PROFESOR])) {
      return new Response(JSON.stringify({ ok: false, error: "No autenticado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return context.redirect("/");
  }

  // obtener rol
  const roleData = await getUserRole(user.id);
  if (!roleData) {
    if (startsWith(pathname, [...API_ADMIN, ...API_PROFESOR])) {
      return new Response(JSON.stringify({ ok: false, error: "No autenticado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return context.redirect("/");
  }

  // verificar rol admin
  if (esAdmin && roleData.role !== "admin") {
    if (startsWith(pathname, API_ADMIN)) {
      return new Response(JSON.stringify({ ok: false, error: "No autenticado" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
    return context.redirect("/");
  }

  // verificar rol profesor
  if (esProfesor) {
    if (roleData.role !== "profesor") {
      if (startsWith(pathname, API_PROFESOR)) {
        return new Response(JSON.stringify({ ok: false, error: "No autenticado" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
      return context.redirect("/");
    }

    if (startsWith(pathname, RUTAS_PROFESOR)) {
      if (roleData.estado === "rechazado") return context.redirect("/?error=rechazado");
      if (roleData.estado !== "aprobado")  return context.redirect("/?error=pendiente");
    }
  }

  // inyectar en locals
  context.locals.user     = user;
  context.locals.roleData = roleData;

  return next();
});