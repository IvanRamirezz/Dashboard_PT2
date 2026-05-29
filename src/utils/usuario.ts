// src/utils/usuario.ts

interface NombreFields {
  nombre:           string;
  apellido_paterno: string;
  apellido_materno: string;
}

export function buildNombreCompleto(usuario?: NombreFields): string {
  if (!usuario) return "Sin nombre";
  return [usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno]
    .filter(Boolean)
    .join(" ");
}