# Documentación de Prompts (Copilot)

## Prompt 1
**Instrucción a Copilot:** "Genera un formulario HTML para matrícula con validación de DNI y un login básico."

## Prompt 2
**Instrucción a Copilot:** "Ayúdame a hacer un carrusel de imágenes con JavaScript para el panel principal."

## Prompt 3 — Codex: dashboard de reportes

**Instrucción consolidada dada a Codex el 19/11/2026:** "Crea un dashboard sencillo dentro de Reportes. Muestra la cantidad de matrículas de ejemplo, las combinaciones de grado y sección con registros y la ocupación respecto a un aforo de referencia de 30 estudiantes por sección. Calcula las cifras desde los datos que ya existen en `js/main.js` y no escribas los totales a mano ni los presentes como datos reales. Sigue los skills de `skills/reglas` para paleta, tipografía y accesibilidad. Haz que funcione en PC y celular, muestra las cantidades también en texto, verifica el resultado y toma capturas de la pantalla y del código."

**Archivos:** `index.html`, `js/main.js`, `css/components.css` y `css/responsive.css`. Los reportes siguen usando datos de demostración y el formulario de matrícula todavía no actualiza estas cifras.

## Prompt 4 — Codex: página principal

**Instrucción consolidada dada a Codex el 19/11/2026:** "Haz la página principal del prototipo tomando como referencia el mockup M03 de Inicio. Muestra el título Página principal, el saludo Bienvenido/a y la indicación para elegir un módulo. Agrega tarjetas con iconos y textos para Matrícula (estudiantes, apoderados y secciones), Docentes (asistencia y horarios) y Reportes (matrícula y asistencia); cada tarjeta debe abrir la vista que ya existe. Según el mockup M38, pide confirmación antes de cerrar sesión y permite cancelar o confirmar. Respeta la paleta, la tipografía, la accesibilidad y el diseño adaptable definidos en `skills/reglas`. Conserva el login, los carruseles existentes y el dashboard de Reportes. Verifica navegación, cancelación y cierre de sesión en computadora y celular y toma capturas de la interfaz y del código."

**Archivos:** `index.html`, `js/main.js`, `css/components.css` y `css/responsive.css`. Los accesos usan las vistas ya implementadas; no se modifica el formulario de inicio de sesión ni se crea otro carrusel.
