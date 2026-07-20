// src/data/repositories/feedbackRepository.ts
import { supabaseAdmin } from "../client/supabaseAdmin";

export type EncuestaRow = {
  respuestas_json: Record<string, unknown>;
};

export async function findAllEncuestas(): Promise<EncuestaRow[]> {
  const { data, error } = await supabaseAdmin
    .from("encuestas_satisfaccion")
    .select("respuestas_json");

  if (error) throw error;
  return data ?? [];
}