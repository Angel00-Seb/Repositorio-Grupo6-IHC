# Sistema de Matrícula - I.E. José Carlos Mariátegui

## Elevator Pitch
¿Sabías que en el colegio José Carlos Mariátegui las matrículas se hacen de forma manual? Este proyecto es un prototipo web que automatiza el registro de estudiantes, aplicando principios de accesibilidad universal (WCAG) y contribuyendo al ODS 10 al llevar tecnología a zonas rurales para un proceso más justo y rápido.

## Tecnologías
* HTML5, CSS3, JavaScript y Bootstrap 5.3.8 (CDN).

## Estructura para el equipo

Todo el HTML vive en `index.html`. **No se crean archivos HTML por módulo** mientras se trabaja en equipo; cada bloque está delimitado con un comentario `<!-- ===== NOMBRE ===== -->`.

| Bloque | Vista (`id`) | Opción del menú (`data-vista`) | Dónde codificar |
|---|---|---|---|
| Login | `login-section` | — | `index.html` + `js/main.js` → `// --- LOGIN ---` |
| Menú principal | `main-section` | — | `index.html` (sidebar y cabecera) |
| Inicio | `view-inicio` | `inicio` | `index.html` (carrusel y accesos) + `js/main.js` → `// --- CARRUSEL ---` y navegación entre vistas |
| Matrícula | `view-matricula` | `matricula` | `index.html` (formulario) + `js/main.js` → `// --- LÓGICA FINAL DE MATRÍCULA Y APODERADOS ---` |
| Docentes | `view-docentes` | `docentes` | `index.html` (formularios y tablas) + `js/main.js` → `// --- CONTROL DE ASISTENCIA DOCENTE ---` |
| Reportes | `view-reportes` | `reportes` | `index.html` (reportes y dashboard) + `js/main.js` → `// --- REPORTES: búsqueda y registros ---` |

Reglas:

- El login y el logout envían a `inicio`; `view-inicio` es la única vista visible por defecto.
- Vista nueva: `<section id="view-<nombre>" class="view oculto">` dentro de `.content-body`.
- Botón del sidebar: `data-vista="<nombre>"` y `aria-controls="view-<nombre>"`.
- No hay que registrar la vista en JS: `mostrarPantalla()` ya recorre `.view`. Para cambiar de módulo se usa el menú lateral o inferior y las tarjetas de Inicio; no existe botón Volver.
- CSS solo en `css/` en orden `reset → variables → components → responsive`. JS solo en `js/main.js` con `defer`.
- Cuando un módulo crezca, mover su bloque a `js/components/<modulo>.js` y cargarlo con `<script defer>` en `index.html`.

> Nota: el registro de asistencia docente está en Docentes; la consulta del reporte de asistencia está en Reportes y usa datos de demostración independientes del registro.

El resumen de Reportes usa seis matrículas de demostración y muestra el aforo de 30 estudiantes como referencia visual. El formulario de matrícula aún no incorpora sus registros a los reportes ni bloquea el aforo. La validación del DNI del estudiante comprueba la longitud, pero todavía debe restringir la entrada a ocho dígitos numéricos.
