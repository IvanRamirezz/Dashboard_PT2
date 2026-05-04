import { g as getValidatedSession } from './sessionService_EQ2ZgrkK.mjs';
import { g as getUserRole } from './userRoleService_bp0Wj9x4.mjs';

async function requireProfesor(cookies) {
  const user = await getValidatedSession(cookies);
  if (!user) return { redirect: "/" };
  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "profesor") return { redirect: "/" };
  if (roleData.estado !== "aprobado") return { redirect: "/?error=pendiente" };
  return { user, roleData };
}

export { requireProfesor as r };
