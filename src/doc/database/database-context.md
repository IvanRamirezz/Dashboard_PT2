# FiberLab VR — Base de Datos (Contexto para Claude)

## Fuente de verdad

El esquema completo de la base de datos está definido en:

@docs/database/schema.sql

Este archivo contiene:

* Enumeraciones (ENUMS)
* Tablas
* Relaciones
* Restricciones
* Funciones SQL
* Políticas Row Level Security (RLS)

Todas las consultas SQL, repositorios, servicios y endpoints deben respetar este esquema.

No inventar:

* tablas
* columnas
* relaciones
* claves foráneas
* políticas RLS

---

# Arquitectura de datos

FiberLab utiliza Supabase como Backend as a Service (BaaS).

Existen dos niveles de acceso:

## Cliente estándar

Utiliza:

PUBLIC_SUPABASE_ANON_KEY

Características:

* sujeto a Row Level Security (RLS)
* utilizado por alumnos y profesores
* utilizado por el cliente Unity VR
* utilizado por el dashboard web

## Cliente administrativo

Utiliza:

SUPABASE_SERVICE_ROLE_KEY

Características:

* omite RLS
* solo se usa del lado servidor
* utilizado por servicios administrativos
* utilizado para aprobación de profesores
* utilizado para operaciones privilegiadas

Nunca exponer la service_role al navegador o al cliente Unity.

---

# Roles del sistema

Existen tres tipos de usuario:

## alumno

* pertenece a un grupo
* accede a prácticas
* responde cuestionarios
* registra resultados

## profesor

* crea grupos
* asigna prácticas
* consulta resultados
* requiere aprobación administrativa

## administrador

* aprueba profesores
* rechaza profesores
* realiza operaciones privilegiadas

---

# Flujo de aprobación de profesores

1. Profesor realiza registro.
2. Se crea cuenta Auth en Supabase.
3. Se crea registro en usuarios.
4. Se crea registro en profesores.
5. Estado inicial:

pendiente

6. Administrador aprueba o rechaza.

Estados válidos:

* pendiente
* aprobado
* rechazado

Un profesor pendiente o rechazado no puede operar normalmente dentro del sistema.

---

# Tablas principales

## usuarios

Tabla base de identidad.

Contiene:

* nombre
* apellidos
* auth_uid
* active_session_uuid

Todos los roles dependen de esta tabla.

---

## profesores

Extiende usuarios.

Contiene:

* matricula_trabajador
* estado

---

## administrador

Extiende usuarios.

---

## alumnos

Extiende usuarios.

Contiene:

* boleta
* grupo_id

---

## grupos

Contiene:

* nombre
* codigo_acceso
* ciclo_escolar
* profesor_id
* activo

---

## practicas

Catálogo de prácticas disponibles.

---

## practicas_grupo

Relaciona grupos con prácticas.

---

## resultados

Resultados obtenidos por los alumnos.

Restricción importante:

Un alumno solo puede tener un resultado por práctica.

---

# Funciones importantes

## current_usuario_id()

Función central del sistema.

Convierte:

auth.uid()

en:

usuarios.usuario_id

Esta función es utilizada por la mayoría de las políticas RLS.

Debe utilizarse cuando sea necesario identificar al usuario autenticado.

No reimplementar su lógica.

---

## get_auth_uid_by_email(email)

Obtiene el UUID de auth.users a partir de un correo electrónico.

Retorna:

UUID

Utilizar esta función cuando sea necesario relacionar correos electrónicos con registros de autenticación.

No consultar auth.users directamente si ya existe esta función.

---

# Seguridad

Todas las tablas tienen RLS habilitado.

Las políticas determinan:

* qué registros puede ver un alumno
* qué registros puede ver un profesor
* qué registros puede modificar un profesor
* qué resultados puede consultar un profesor
* qué grupos puede administrar un profesor

RLS debe considerarse una segunda capa de seguridad además de las validaciones realizadas por la aplicación.

Nunca asumir permisos fuera de las políticas definidas en schema.sql.

---

# Reglas importantes

* Los profesores comienzan en estado pendiente.
* Solo los administradores aprueban profesores.
* Los alumnos ingresan a grupos mediante codigo_acceso.
* Los grupos pertenecen a un profesor.
* Los resultados son únicos por alumno y práctica.
* El cliente estándar utiliza RLS.
* El cliente administrativo omite RLS mediante service_role.
* current_usuario_id() es la función principal utilizada por las políticas de seguridad.

---

# Instrucciones para generación de código

Al generar:

* consultas SQL
* repositorios
* servicios
* endpoints
* componentes de administración

Claude debe:

1. Respetar schema.sql.
2. Respetar las políticas RLS.
3. Utilizar las funciones SQL existentes.
4. No inventar columnas ni relaciones.
5. Mantener la separación por capas:

   * presentación
   * lógica de negocio
   * datos
6. Utilizar Supabase como única fuente de datos.
