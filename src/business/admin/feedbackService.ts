// src/business/admin/feedbackService.ts
import { findAllEncuestas, type EncuestaRow } from "../../data/repositories/feedbackRepository";

export type EscalaStats = {
  promedio: number;
  distribucion: { 1: number; 2: number; 3: number; 4: number; 5: number };
};

export type RitmoStats = {
  muy_lento: number;
  adecuado: number;
  muy_rapido: number;
};

export type FeedbackStats = {
  total: number;
  navegacion: EscalaStats;
  instrucciones: EscalaStats;
  claridad_tema: EscalaStats;
  ritmo: RitmoStats;
  recomendaria: { si: number; no: number; porcentajeSi: number };
};

function isEscalaValida(valor: unknown): valor is 1 | 2 | 3 | 4 | 5 {
  return typeof valor === "number" && Number.isInteger(valor) && valor >= 1 && valor <= 5;
}

function computeEscalaStats(rows: EncuestaRow[], key: string): EscalaStats {
  const distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as EscalaStats["distribucion"];
  let suma = 0;
  let count = 0;

  for (const fila of rows) {
    const valor = fila.respuestas_json?.[key];
    if (!isEscalaValida(valor)) continue;
    distribucion[valor]++;
    suma += valor;
    count++;
  }

  return { promedio: count ? suma / count : 0, distribucion };
}

function computeRitmoStats(rows: EncuestaRow[]): RitmoStats {
  const stats: RitmoStats = { muy_lento: 0, adecuado: 0, muy_rapido: 0 };

  for (const fila of rows) {
    const valor = fila.respuestas_json?.["ritmo"];
    if (valor === "muy_lento" || valor === "adecuado" || valor === "muy_rapido") {
      stats[valor]++;
    }
  }

  return stats;
}

function computeRecomendariaStats(rows: EncuestaRow[]) {
  let si = 0;
  let no = 0;

  for (const fila of rows) {
    const valor = fila.respuestas_json?.["recomendaria"];
    if (valor === true) si++;
    else if (valor === false) no++;
  }

  const total = si + no;
  return { si, no, porcentajeSi: total ? Math.round((si / total) * 100) : 0 };
}

export function computeFeedbackStats(rows: EncuestaRow[]): FeedbackStats {
  return {
    total: rows.length,
    navegacion: computeEscalaStats(rows, "navegacion"),
    instrucciones: computeEscalaStats(rows, "instrucciones"),
    claridad_tema: computeEscalaStats(rows, "claridad_tema"),
    ritmo: computeRitmoStats(rows),
    recomendaria: computeRecomendariaStats(rows),
  };
}

export async function getFeedbackStats(): Promise<FeedbackStats> {
  const rows = await findAllEncuestas();
  return computeFeedbackStats(rows);
}
