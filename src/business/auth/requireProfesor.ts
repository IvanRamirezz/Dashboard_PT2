import { getValidatedSession } from "./sessionService";
import { getUserRole } from "../auth/userRoleService";
import type { AstroCookies } from "astro";

export async function requireProfesor(cookies: AstroCookies) {

  const user = await getValidatedSession(cookies);
  if (!user) return { redirect: "/" };

  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "profesor") return { redirect: "/" };
  if (roleData.estado !== "aprobado") return { redirect: "/?error=pendiente" };

  return { user, roleData };

}