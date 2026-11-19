# Sistema de Matrícula - I.E. José Carlos Mariátegui

## Elevator Pitch
¿Sabías que en el colegio José Carlos Mariátegui las matrículas se hacen de forma manual? Este proyecto es un prototipo web que automatiza el registro de estudiantes, aplicando principios de accesibilidad universal (WCAG) y contribuyendo al ODS 10 al llevar tecnología a zonas rurales para un proceso más justo y rápido.

## Tecnologías
* HTML5, CSS3, JavaScript  

## Estructura para el equipo

Todo el HTML vive en `index.html`. **No se crean archivos HTML por módulo** mientras se trabaja en equipo; cada bloque está delimitado con un comentario `<!-- ===== NOMBRE ===== -->`.

| Bloque | Vista (`id`) | Opción del menú (`data-vista`) | Dónde codificar |
|---|---|---|---|
| Login | `login-section` | — | `index.html` + `js/main.js` → `// --- LOGIN ---` |
| Menú principal | `main-section` | — | `index.html` (sidebar y cabecera) |
| Inicio | `view-inicio` | `inicio` | `index.html` (carrusel) + `js/main.js` → `// --- CARRUSEL ---` |
| Matrícula | `view-matricula` | `matricula` | `js/main.js` → `// --- MATRÍCULA ---` |
| Docentes | `view-docentes` | `docentes` | `js/main.js` → `// --- DOCENTES ---` (placeholder) |
| Reportes | `view-reportes` | `reportes` | `js/main.js` → `// --- REPORTES ---` |

Reglas:

- El login y el logout envían a `inicio`; `view-inicio` es la única vista visible por defecto.
- Vista nueva: `<section id="view-<nombre>" class="view oculto">` dentro de `.content-body`.
- Botón del sidebar: `data-vista="<nombre>"` y `aria-controls="view-<nombre>"`.
- No hay que registrar la vista en JS: `mostrarPantalla()` ya recorre `.view` y el botón Volver usa el historial automáticamente.
- CSS solo en `css/` en orden `reset → variables → components → responsive`. JS solo en `js/main.js` con `defer`.
- Cuando un módulo crezca, mover su bloque a `js/components/<modulo>.js` y cargarlo con `<script defer>` en `index.html`.

> Nota: hoy **Asistencia docente** está dentro de Reportes. Si se muda al módulo Docentes, avisar para ajustar `configReportes.asistencia` y `renderizar("asistencia", …)`.