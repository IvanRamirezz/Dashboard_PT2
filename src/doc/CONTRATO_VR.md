# Contrato de integración VR ↔ Dashboard

**Versión:** 1.0  
**Última actualización:** 2025  
**Estado:** Vigente

---

## Contexto

La aplicación VR (Unity) escribe resultados de prácticas directamente en Supabase usando el **SDK de Supabase para Unity** con `anon key`. El dashboard web (Astro) lee y califica esos resultados usando `service_role`.
Este contrato define la estructura del campo `respuestas_json` que Unity escribe y el dashboard lee para mostrar y calificar las respuestas del alumno.

---

## Tabla: `resultados`

| Columna | Tipo PostgreSQL | Escribe | Lee |
|---|---|---|---|
| `alumno_id` | `INT` FK → alumnos | Unity | Dashboard |
| `practica_id` | `INT` FK → practicas | Unity | Dashboard |
| `calificacion` | `NUMERIC(4,2)` | — (null al crear) | Dashboard (actualiza) |
| `respuestas_json` | `JSONB` | Unity | Dashboard |
| `tiempo_segundos` | `INT` | Unity | Dashboard |
| `created_at` | `TIMESTAMP` | Auto | — |

**Restricción de unicidad:** `UNIQUE (alumno_id, practica_id)` — un alumno tiene un único resultado por práctica.

---

## Estructura de `respuestas_json`

Unity escribe este objeto al insertar en `resultados`:

```json
{
  "pregunta_1": "El empalme por fusión une las fibras mediante arco eléctrico",
  "pregunta_2": "Se necesita una limpiadora de fibra y una cortadora de precisión",
  "pregunta_3": "La pérdida de inserción máxima permitida es 0.3 dB"
}
```

**Las claves son los identificadores de pregunta, los valores son las respuestas del alumno en texto.**

### Después de que el profesor califica

El dashboard actualiza `respuestas_json` añadiendo la calificación por pregunta:

```json
{
  "pregunta_1": {
    "respuesta": "El empalme por fusión une las fibras mediante arco eléctrico",
    "calificacion": 1
  },
  "pregunta_2": {
    "respuesta": "Se necesita una limpiadora de fibra y una cortadora de precisión",
    "calificacion": 0.8
  },
  "pregunta_3": {
    "respuesta": "La pérdida de inserción máxima permitida es 0.3 dB",
    "calificacion": 0.5
  }
}
```

---

## Estados del campo `calificacion`

| Estado | Valor en BD | Descripción |
|---|---|---|
| Sin calificar | `NULL` | Unity insertó el resultado, profesor aún no calificó |
| Calificado | `0.00` – `10.00` | Profesor asignó calificación desde el dashboard |

---

## Reglas que Unity debe respetar

1. Insertar solo cuando el alumno termina la práctica — no insertar resultados parciales.
2. El campo `respuestas_json` debe ser un objeto JSON plano: claves = nombre de pregunta, valor = texto de la respuesta del alumno.
3. **No incluir** `calificacion` en el insert — ese campo lo asigna el dashboard.
4. El `alumno_id` debe corresponder al usuario autenticado en Supabase (`auth.uid()` → `usuario_id` en tabla `usuarios` → `alumno_id` en tabla `alumnos`).
5. El `practica_id` debe existir en la tabla `practicas` y estar activo (`activo = true`).
6. `tiempo_segundos` es obligatorio — representa la duración total de la práctica en segundos.

---

## Ejemplo de insert desde Unity

```csharp
var resultado = new {
    alumno_id    = alumnoId,
    practica_id  = practicaId,
    respuestas_json = new Dictionary<string, string> {
        { "pregunta_1", respuestaTexto1 },
        { "pregunta_2", respuestaTexto2 },
        { "pregunta_3", respuestaTexto3 },
    },
    tiempo_segundos = tiempoTotal
};

await supabase.From<Resultado>().Insert(resultado);
```

---

## Validaciones RLS activas

Unity usa `anon key` — las políticas RLS garantizan que:

- El alumno solo puede **insertar** su propio resultado (`alumno_id = current_usuario_id()`).
- El alumno puede **ver** sus propios resultados.
- El alumno **no puede** actualizar `calificacion` — solo el dashboard con `service_role` puede hacerlo.
- El profesor puede **ver** resultados de alumnos de sus grupos.
- El profesor **actualiza** `calificacion` y `respuestas_json` vía dashboard con `service_role`.

---

## Reglas de compatibilidad

Cualquier cambio en este contrato requiere actualizar **ambos lados** simultáneamente:

| Cambio | Impacto | Acción requerida |
|---|---|---|
| Agregar nueva pregunta en Unity | Las claves nuevas aparecen en el modal de calificación | Ninguna — el dashboard las lee dinámicamente |
| Renombrar clave de pregunta | El dashboard muestra el nombre nuevo | Verificar que `calificarModal.js` sigue funcionando |
| Cambiar tipo de valor (texto → objeto) | Rompe el modal de calificación | Actualizar `crearPreguntas()` en `calificarModal.js` |
| Cambiar `tiempo_segundos` a opcional | Compatible hacia atrás | Sin acción requerida |

---

## Deuda técnica conocida

- No existe endpoint HTTP entre Unity y el backend — Unity escribe directo a Supabase. Si en el futuro se necesita lógica de validación pre-inserción (límite de intentos, verificar que la práctica está activa para el grupo), habría que crear un endpoint `POST /api/alumno/resultado` que Unity llame en lugar de escribir directo.
- El número de preguntas no está fijo en el esquema — el dashboard las lee dinámicamente del JSONB. Si una práctica tiene 0 preguntas el modal de calificación muestra "No hay respuestas disponibles".