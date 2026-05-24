// src/business/auth/authService.ts
import { supabaseAdmin } from "../../data/client/supabaseAdmin";
import { createClient } from "@supabase/supabase-js";
import {
  createUsuario,
  createAlumno,
  createProfesor
} from "../../data/repositories/userRepository";

const supabasePublic = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function registerUser(data: any) {
  const {
    email,
    password,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    role,
    boleta,
    matricula,
    baseUrl,
  } = data;

  // verificar duplicados ANTES de llamar a signUp — una sola llamada a listUsers
  await ensureUniqueSubtypeData(role, boleta, matricula, email);

  let authUid:   string | null = null;
  let usuarioId: number | null = null;

  try {
    // 1 — signUp envía correo de confirmación automáticamente
    const { data: signUpData, error: signUpError } = await supabasePublic.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${baseUrl}/auth/confirm`,
      },
    });

    if (signUpError) {
      const message = signUpError.message.toLowerCase();
      if (
        message.includes("already") ||
        message.includes("exists") ||
        message.includes("registered") ||
        message.includes("duplicate")
      ) {
        throw new Error("EMAIL_EXISTS");
      }
      throw new Error(signUpError.message);
    }

    // 2 — obtener uid del signUp
    // con SMTP + confirmación activa Supabase devuelve user: null
    // en ese caso buscar por email via admin (el email ya fue validado como único arriba)
    authUid = signUpData?.user?.id ?? signUpData?.session?.user?.id ?? null;

    if (!authUid) {
      const { data: listData, error: listError } =
        await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });

      if (listError) throw new Error(listError.message);

      const found = listData.users.find((u) => u.email === email);
      if (!found) throw new Error("AUTH_UID_MISSING");

      authUid = found.id;
    }

    // 3 — crear registro en tabla usuarios
    const usuario = await createUsuario(
      authUid,
      nombre,
      apellidoPaterno,
      apellidoMaterno
    );

    usuarioId = usuario.usuario_id;

    // 4 — crear subtipo según rol
    if (role === "student") await createAlumno(usuario.usuario_id, boleta);
    if (role === "teacher") await createProfesor(usuario.usuario_id, matricula);

    return signUpData?.user ?? { id: authUid, email };

  } catch (error: any) {
    await rollbackFailedRegistration(authUid, usuarioId);

    const message = error.message?.toLowerCase?.() || "";

    if (
      message.includes("duplicate") ||
      message.includes("unique") ||
      error.message === "DATA_EXISTS"
    ) {
      throw new Error("DATA_EXISTS");
    }

    if (error.message === "AUTH_UID_MISSING") throw new Error("UNKNOWN_ERROR");

    throw error;
  }
}

async function ensureUniqueSubtypeData(
  role: string,
  boleta?: string,
  matricula?: string,
  email?: string,
) {
  if (email) {
    const { data: listData } = await supabaseAdmin.auth.admin
      .listUsers({ page: 1, perPage: 1000 });

    const existing = listData?.users.find((u) => u.email === email);
    if (existing) throw new Error("EMAIL_EXISTS");
  }

  if (role === "student" && boleta) {
    const { data } = await supabaseAdmin
      .from("alumnos")
      .select("alumno_id")
      .eq("boleta", boleta)
      .maybeSingle();
    if (data) throw new Error("DATA_EXISTS");
  }

  if (role === "teacher" && matricula) {
    const { data } = await supabaseAdmin
      .from("profesores")
      .select("profesor_id")
      .eq("matricula_trabajador", matricula)
      .maybeSingle();
    if (data) throw new Error("DATA_EXISTS");
  }
}

async function rollbackFailedRegistration(
  authUid:   string | null,
  usuarioId: number | null,
) {
  if (usuarioId) {
    await supabaseAdmin
      .from("usuarios")
      .delete()
      .eq("usuario_id", usuarioId);
  }

  if (authUid) {
    await supabaseAdmin.auth.admin.deleteUser(authUid);
  }
}