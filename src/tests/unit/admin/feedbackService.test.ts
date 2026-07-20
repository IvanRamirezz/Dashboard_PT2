// src/tests/unit/admin/feedbackService.test.ts
import { describe, it, expect, vi } from "vitest";

// computeFeedbackStats is pure, but it lives in the same module as
// getFeedbackStats, which imports the repository — mock it so importing
// the service doesn't transitively construct the real Supabase client.
vi.mock("../../../data/repositories/feedbackRepository", () => ({
  findAllEncuestas: vi.fn(),
}));

import { computeFeedbackStats } from "../../../business/admin/feedbackService";
import type { EncuestaRow } from "../../../data/repositories/feedbackRepository";

function row(respuestas: Record<string, unknown>): EncuestaRow {
  return { respuestas_json: respuestas };
}

describe("computeFeedbackStats", () => {
  it("retorna ceros cuando no hay respuestas", () => {
    const stats = computeFeedbackStats([]);

    expect(stats.total).toBe(0);
    expect(stats.navegacion).toEqual({
      promedio: 0,
      distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    });
    expect(stats.ritmo).toEqual({ muy_lento: 0, adecuado: 0, muy_rapido: 0 });
    expect(stats.recomendaria).toEqual({ si: 0, no: 0, porcentajeSi: 0 });
  });

  it("calcula promedio y distribución de una pregunta de escala 1-5", () => {
    const rows = [row({ navegacion: 4 }), row({ navegacion: 5 }), row({ navegacion: 4 })];

    const stats = computeFeedbackStats(rows);

    expect(stats.navegacion.promedio).toBeCloseTo(4.33, 2);
    expect(stats.navegacion.distribucion).toEqual({ 1: 0, 2: 0, 3: 0, 4: 2, 5: 1 });
  });

  it("cuenta las categorías de ritmo", () => {
    const rows = [row({ ritmo: "adecuado" }), row({ ritmo: "muy_lento" }), row({ ritmo: "adecuado" })];

    const stats = computeFeedbackStats(rows);

    expect(stats.ritmo).toEqual({ muy_lento: 1, adecuado: 2, muy_rapido: 0 });
  });

  it("calcula el porcentaje de recomendación redondeado", () => {
    const rows = [row({ recomendaria: true }), row({ recomendaria: true }), row({ recomendaria: false })];

    const stats = computeFeedbackStats(rows);

    expect(stats.recomendaria).toEqual({ si: 2, no: 1, porcentajeSi: 67 });
  });

  it("ignora una respuesta fuera de rango o corrupta solo en la pregunta afectada", () => {
    const rows = [
      row({ navegacion: 99, instrucciones: 5, ritmo: "adecuado", recomendaria: true }),
      row({ navegacion: 3, instrucciones: "no_valido", ritmo: "no_valido", recomendaria: "si" }),
    ];

    const stats = computeFeedbackStats(rows);

    expect(stats.navegacion.promedio).toBe(3);
    expect(stats.navegacion.distribucion[3]).toBe(1);
    expect(stats.instrucciones.promedio).toBe(5);
    expect(stats.ritmo).toEqual({ muy_lento: 0, adecuado: 1, muy_rapido: 0 });
    expect(stats.recomendaria).toEqual({ si: 1, no: 0, porcentajeSi: 100 });
    expect(stats.total).toBe(2);
  });
});
