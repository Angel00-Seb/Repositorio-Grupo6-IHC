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
| Matrícula | `view-matricula` | `matricula` | `index.html` (formularios, listados y asociaciones) + `js/main.js` → `// --- REGISTRO Y ASOCIACIÓN DE MATRÍCULA ---` |
| Docentes | `view-docentes` | `docentes` | `index.html` (matriz, pestañas, tablas y diálogos) + `js/main.js` → `// --- CONTROL DE ASISTENCIA DOCENTE ---` |
| Reportes | `view-reportes` | `reportes` | `index.html` (reportes y dashboard) + `js/main.js` → `// --- REPORTES: búsqueda y registros ---` |

Reglas:

- El login y el logout envían a `inicio`; `view-inicio` es la única vista visible por defecto.
- Vista nueva: `<section id="view-<nombre>" class="view oculto">` dentro de `.content-body`.
- Botón del sidebar: `data-vista="<nombre>"` y `aria-controls="view-<nombre>"`.
- No hay que registrar la vista en JS: `mostrarPantalla()` ya recorre `.view`. Para cambiar de módulo se usa el menú lateral o inferior y las tarjetas de Inicio; no existe botón Volver.
- CSS solo en `css/` en orden `reset → variables → components → responsive`. JS solo en `js/main.js` con `defer`.
- Cuando un módulo crezca, mover su bloque a `js/components/<modulo>.js` y cargarlo con `<script defer>` en `index.html`.

> Nota: el registro de asistencia docente está en Docentes; el reporte de Reportes se calcula desde esos mismos registros. Mantiene las columnas ID, Docente, Lunes a Viernes y Asistencia total: cada registro se ubica en el día de la semana que corresponde a su fecha, usando la última semana con registros del mes seleccionado.

El resumen de Reportes y el dashboard se calculan desde una fuente común de matrículas: se inician con seis estudiantes de demostración; Matrícula también incluye seis apoderados y cuatro asociaciones de ejemplo. Los nuevos ID usan secuencias `E0001` y `P0001`, y cada matrícula nueva se agrega a la fuente común (bloqueando DNI repetidos). La vista Matrícula incluye formularios independientes para estudiantes y apoderados, filtros, acciones de consulta/edición/eliminación y asociaciones con parentesco, fecha y observaciones. Las búsquedas RENIEC y los envíos SIAGIE son simulaciones locales con datos de prueba; no consultan servicios externos ni persisten registros al recargar la página. El aforo de 30 estudiantes sigue siendo una referencia visual y aún no bloquea nuevas matrículas. El reporte Consolidado muestra Género en lugar de promedio, asistencia y conducta. El módulo Docentes empieza con el contenedor de pestañas; debajo va el separador con el título «Consultar Horario Semanal» y una línea verde alineada a la misma altura del texto; luego el contenedor con la búsqueda mitad y mitad, la tarjeta del docente y la matriz semanal (columnas Lunes a Viernes, filas de 07:30 a 13:00 en bloques horarios, con receso vacío de 10:30 a 11:00) sobre tabla blanca con solo los encabezados en verde claro, celdas pastel por aula y espacios vacíos; el buscador volvió al formato anterior, a la izquierda de una división mitad y mitad: esquinas ovaladas, misma familia y tamaño (`--font-body`, 16 px) en el input y en el botón verde, texto del input en peso normal, altura de 40 px en ambos y separación de ~4 px (el recuadro casi llega al botón), con coincidencias en vivo; el panel naranja claro queda a la derecha y muestra el icono de usuario, nombre completo, DNI y especialidad. Ese primer contenedor tiene **dos pestañas** en la parte superior, en la misma línea: «Registrar Docente» y «Registrar Asistencia». Solo la pestaña activa está en negrita. Al hacer clic se muestra solo el panel correspondiente, con el título a la izquierda y el botón que abre su diálogo nativo (`data-bs-toggle="dialog"`) a la derecha, sobre su tabla (catálogo de docentes y asistencias registradas), sin tarjeta intermedia. El área de paneles mantiene una **altura fija de 220 px** con desplazamiento vertical e horizontal interno, de modo que al crecer los registros no se mueve el resto de la interfaz. Los tokens de la paleta (`--color-marfil-tarjeta`, `--color-tabla-claro`, `--color-aula-1` a `--color-aula-6`) están en `css/variables.css`. Los formularios se movieron dentro de los diálogos; Bootstrap 5.3.8 aún no trae el plugin de `<dialog>`, así que la apertura/cierre se implementa en `js/main.js`. El módulo se inicia con cuatro docentes y sus asistencias de demostración, ubicadas en la última semana del mes actual (lunes a viernes). El reporte de asistencia se genera desde esos registros: el selector de mes incluye los meses con asistencias y el mes actual, y conserva las columnas Lunes a Viernes y Asistencia total. En Diario cada celda muestra el estado del último registro de ese día en la semana más reciente con datos; en Semanal muestra el porcentaje acumulado del día en todo el mes. Las celdas sin registro muestran «—».
