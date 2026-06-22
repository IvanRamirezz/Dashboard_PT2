# FiberLab Business Rules

## Usuarios

- Existen tres roles: admin, profesor y alumno.
- Todos los roles derivan de la tabla usuarios.

## Profesores

- Todo profesor inicia con estado pendiente.
- Solo los administradores pueden aprobar o rechazar profesores.
- Un profesor rechazado no puede acceder al dashboard.

## Grupos

- Cada grupo pertenece a un profesor.
- El código de acceso debe ser único.
- Solo los grupos activos aceptan alumnos.

## Alumnos

- Un alumno solo puede pertenecer a un grupo.
- El ingreso a un grupo se realiza mediante codigo_acceso.

## Prácticas

- Las prácticas pueden asignarse a múltiples grupos.
- Solo se muestran prácticas activas.

## Resultados

- Un alumno solo puede tener un resultado por práctica.
- Los profesores pueden consultar únicamente resultados de sus grupos.