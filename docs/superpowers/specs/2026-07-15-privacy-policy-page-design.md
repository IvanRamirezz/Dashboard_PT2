# Diseño: Página de Política de Privacidad

**Fecha:** 2026-07-15
**Estado:** Aprobado

## Contexto

FiberLab VR necesita una página pública y dedicada con su Política de Privacidad,
redactada por el equipo (contenido final, no placeholder). Se requiere una URL
compartible de forma independiente (ej. requisito de tiendas de apps / VR store)
y enlaces discretos desde login y registro.

## Alcance

- Una página estática nueva, sin lógica de negocio ni acceso a datos.
- Enlaces desde las páginas de login y registro.
- Fuera de alcance: términos de servicio, banner de cookies, selector de idioma,
  versionado histórico de la política.

## Arquitectura

### Ruta

`src/pages/legal/privacidad.astro` → URL pública `/legal/privacidad`.

Usa `Layout.astro` (el layout base, no `AuthLayout`) porque es un documento de
lectura, no una pantalla de formulario tipo tarjeta.

### Estilos

Nuevo archivo `src/presentation/styles/legal.css`, importado únicamente por
`privacidad.astro`, siguiendo el patrón existente de CSS por página/sección
(`auth.css`, `register.css`, `dashboard.css`, `profesor.css`).

Layout: columna única, `max-width` ~700px, centrada. Usa los tokens de diseño
existentes en `variables.css` (`--bg-main`, `--text-main`, `--text-muted`,
`--primary` para encabezados de sección, `--font-*`, `--sp-*`) — sin colores
nuevos. Incluye el logo de FiberLab y un enlace "← Volver" hacia `/` en la parte
superior.

### Contenido

Texto transcrito verbatim de las 11 secciones proporcionadas por el usuario:

- Título: "Política de Privacidad de FiberLab VR"
- "Última actualización: 15 de julio de 2026"
- 1. Introducción
- 2. Información que recopilamos
- 3. Uso de la información
- 4. Almacenamiento de la información
- 5. Compartición de la información
- 6. Conservación de los datos
- 7. Derechos del usuario
- 8. Seguridad
- 9. Menores de edad
- 10. Cambios a esta Política
- 11. Contacto (correo: rmzivan510@gmail.com)

Contenido estático, hardcodeado en el `.astro` (no viene de CMS ni base de datos).

### Enlaces desde el sitio

- `src/pages/index.astro` (login): enlace pequeño cerca de "¿Olvidaste tu
  contraseña?", apuntando a `/legal/privacidad`.
- `src/presentation/components/auth/RegisterForm.astro` (compartido por
  `/auth/register` y `/auth/register-teacher`): enlace pequeño debajo del botón
  "Crear cuenta →", ya que este componente sirve ambos flujos de registro.

## Manejo de errores

No aplica — página estática sin formularios, fetch ni parámetros dinámicos.

## Pruebas

No se requieren pruebas unitarias ni e2e nuevas: es contenido estático sin
lógica. Verificación manual: cargar `/legal/privacidad` en dev y confirmar que
los enlaces desde login y registro navegan correctamente.
