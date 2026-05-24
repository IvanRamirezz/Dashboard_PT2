// src/business/profesor/practicaService.ts
import {
  findActivePracticas,
  countActivePracticas,
} from "../../data/repositories/practicaRepository";

export async function getPractices() {
  return findActivePracticas();
}

export { countActivePracticas };