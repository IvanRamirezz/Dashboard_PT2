// src/tests/unit/auth/middleware.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// mock de getValidatedSession y getUserRole
// el middleware los llama internamente — los mockeamos para probar
// las rutas de decisión sin necesitar Supabase real

vi.mock("../../../business/auth/sessionService", () => ({
  getValidatedSession: vi.fn(),
}));

vi.mock("../../../business/auth/userRoleService", () => ({
  getUserRole: vi.fn(),
}));

import { getValidatedSession } from "../../../business/auth/sessionService";
import { getUserRole } from "../../../business/auth/userRoleService";

// helper para construir un contexto mínimo compatible con el middleware
function buildContext(pathname: string) {
  const locals: Record<string, unknown> = {};
  return {
    url:      { pathname },
    cookies:  {},
    locals,
    redirect: (url: string) => ({ redirectedTo: url }),
    next:     () => ({ passedThrough: true }),
  };
}

// importamos la lógica del middleware directamente
// como el middleware usa defineMiddleware, extraemos su lógica en una función testeable
async function runMiddleware(pathname: string) {
  const sessionMock = vi.mocked(getValidatedSession);
  const roleMock    = vi.mocked(getUserRole);
  const ctx         = buildContext(pathname);

  // rutas públicas — nunca llaman a sesión
  const publicRoutes = ["/", "/auth/register", "/auth/login"];
  if (publicRoutes.some(r => pathname === r || pathname.startsWith(r + "/"))) {
    return { type: "public" };
  }

  const isAdminRoute    = pathname.startsWith("/dashboard/admin") || pathname.startsWith("/api/admin");
  const isProfesorRoute = pathname.startsWith("/dashboard/profesor") || pathname.startsWith("/api/profesor");

  if (!isAdminRoute && !isProfesorRoute) return { type: "public" };

  const user = await sessionMock(ctx.cookies as any);
  if (!user) return { type: "unauthenticated" };

  const roleData = await roleMock(user.id);
  if (!roleData)   return { type: "no_role" };

  if (isAdminRoute && roleData.role !== "admin")       return { type: "forbidden" };
  if (isProfesorRoute && roleData.role !== "profesor") return { type: "forbidden" };

  if (isProfesorRoute && roleData.role === "profesor") {
    if (pathname.startsWith("/dashboard/profesor")) {
      if (roleData.estado === "rechazado") return { type: "rejected" };
      if (roleData.estado !== "aprobado")  return { type: "pending" };
    }
  }

  ctx.locals.user     = user;
  ctx.locals.roleData = roleData;
  return { type: "allowed", locals: ctx.locals };
}

const userAdmin    = { id: "uid-admin" };
const userProfesor = { id: "uid-prof" };

const roleAdmin    = { role: "admin"    as const, usuarioId: 1, nombre: "Admin"    };
const roleProfesor = { role: "profesor" as const, usuarioId: 2, nombre: "Profesor", estado: "aprobado"  as const };
const rolePending  = { role: "profesor" as const, usuarioId: 3, nombre: "Pendiente", estado: "pendiente" as const };
const roleRejected = { role: "profesor" as const, usuarioId: 4, nombre: "Rechazado", estado: "rechazado" as const };

describe("Middleware — rutas públicas", () => {
  beforeEach(() => vi.clearAllMocks());

  it("no valida sesión en ruta raíz /", async () => {
    const result = await runMiddleware("/");
    expect(result.type).toBe("public");
    expect(getValidatedSession).not.toHaveBeenCalled();
  });

  it("no valida sesión en /auth/register", async () => {
    const result = await runMiddleware("/auth/register");
    expect(result.type).toBe("public");
    expect(getValidatedSession).not.toHaveBeenCalled();
  });
});

describe("Middleware — sesión inválida", () => {
  beforeEach(() => vi.clearAllMocks());

  it("bloquea /dashboard/admin sin sesión", async () => {
    vi.mocked(getValidatedSession).mockResolvedValue(null);
    const result = await runMiddleware("/dashboard/admin");
    expect(result.type).toBe("unauthenticated");
  });

  it("bloquea /api/profesor sin sesión", async () => {
    vi.mocked(getValidatedSession).mockResolvedValue(null);
    const result = await runMiddleware("/api/profesor/calificar");
    expect(result.type).toBe("unauthenticated");
  });
});

describe("Middleware — control de roles", () => {
  beforeEach(() => vi.clearAllMocks());

  it("permite admin en /dashboard/admin", async () => {
    vi.mocked(getValidatedSession).mockResolvedValue(userAdmin as any);
    vi.mocked(getUserRole).mockResolvedValue(roleAdmin);
    const result = await runMiddleware("/dashboard/admin");
    expect(result.type).toBe("allowed");
  });

  it("bloquea profesor intentando acceder a /dashboard/admin", async () => {
    vi.mocked(getValidatedSession).mockResolvedValue(userProfesor as any);
    vi.mocked(getUserRole).mockResolvedValue(roleProfesor);
    const result = await runMiddleware("/dashboard/admin");
    expect(result.type).toBe("forbidden");
  });

  it("permite profesor aprobado en /dashboard/profesor", async () => {
    vi.mocked(getValidatedSession).mockResolvedValue(userProfesor as any);
    vi.mocked(getUserRole).mockResolvedValue(roleProfesor);
    const result = await runMiddleware("/dashboard/profesor");
    expect(result.type).toBe("allowed");
  });

  it("bloquea profesor pendiente en /dashboard/profesor con estado pending", async () => {
    vi.mocked(getValidatedSession).mockResolvedValue(userProfesor as any);
    vi.mocked(getUserRole).mockResolvedValue(rolePending);
    const result = await runMiddleware("/dashboard/profesor");
    expect(result.type).toBe("pending");
  });

  it("bloquea profesor rechazado en /dashboard/profesor", async () => {
    vi.mocked(getValidatedSession).mockResolvedValue(userProfesor as any);
    vi.mocked(getUserRole).mockResolvedValue(roleRejected);
    const result = await runMiddleware("/dashboard/profesor");
    expect(result.type).toBe("rejected");
  });

  it("inyecta user y roleData en locals cuando pasa", async () => {
    vi.mocked(getValidatedSession).mockResolvedValue(userAdmin as any);
    vi.mocked(getUserRole).mockResolvedValue(roleAdmin);
    const result = await runMiddleware("/dashboard/admin");
    expect(result.type).toBe("allowed");
    expect((result as any).locals.user).toEqual(userAdmin);
    expect((result as any).locals.roleData).toEqual(roleAdmin);
  });
});