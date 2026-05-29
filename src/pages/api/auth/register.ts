// src/pages/api/auth/register.ts
import type { APIContext } from "astro";
import { validateRegister } from "../../../business/auth/authValidator";
import { registerUser, type RegisterPayload } from "../../../business/auth/authService";

export async function POST({ request, redirect }: APIContext) {
  let role: string | undefined;

  try {
    const formData = await request.formData();

    const data: RegisterPayload = {
      nombre:          formData.get("nombre")?.toString() ?? "",
      apellidoPaterno: formData.get("apellidoPaterno")?.toString() ?? "",
      apellidoMaterno: formData.get("apellidoMaterno")?.toString() ?? "",
      email:           formData.get("email")?.toString() ?? "",
      password:        formData.get("password")?.toString() ?? "",
      passwordConfirm: formData.get("passwordConfirm")?.toString() ?? "",
      role:            (formData.get("role")?.toString() ?? "student") as "student" | "teacher",
      boleta:          formData.get("boleta")?.toString() ?? undefined,
      matricula:       formData.get("matricula")?.toString() ?? undefined,
      baseUrl:         new URL(request.url).origin,
    };

    role = data.role;

    validateRegister(data);
    await registerUser(data);

    return redirect(`/register/success?type=${data.role}`);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";

    if (message === "EMAIL_EXISTS")  return redirect(`/register/error?reason=email&type=${role}`);
    if (message === "DATA_EXISTS")   return redirect(`/register/error?reason=duplicate&type=${role}`);

    console.error(err);
    return redirect(`/register/error?reason=unknown&type=${role}`);
  }
}