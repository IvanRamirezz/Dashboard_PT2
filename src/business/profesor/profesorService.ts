// src/business/profesor/profesorService.ts
import { supabaseAdmin } from "../../data/client/supabaseAdmin";
import { calcularCicloEscolar } from "./grupoService";

export async function getTeacherStats(usuarioId: number) {
  const ciclo = calcularCicloEscolar();

  // queries independientes en paralelo
  const [{ count: grupos }, { count: practicas }, { data: gruposProfesor }] =
    await Promise.all([
      supabaseAdmin
        .from("grupos")
        .select("*", { count: "exact", head: true })
        .eq("profesor_id", usuarioId)
        .eq("activo", true)
        .eq("ciclo_escolar", ciclo),

      supabaseAdmin
        .from("practicas")
        .select("*", { count: "exact", head: true })
        .eq("activo", true),

      supabaseAdmin
        .from("grupos")
        .select("grupo_id")
        .eq("profesor_id", usuarioId)
        .eq("activo", true)
        .eq("ciclo_escolar", ciclo),
    ]);

  const gruposIds = gruposProfesor?.map((g) => g.grupo_id) ?? [];

  let alumnos = 0;
  if (gruposIds.length > 0) {
    const { count } = await supabaseAdmin
      .from("alumnos")
      .select("*", { count: "exact", head: true })
      .in("grupo_id", gruposIds);

    alumnos = count ?? 0;
  }

  return {
    grupos:    grupos    ?? 0,
    practicas: practicas ?? 0,
    alumnos,
  };
}