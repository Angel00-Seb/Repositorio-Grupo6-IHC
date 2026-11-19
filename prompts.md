# Documentación de Prompts (Copilot)

## Prompt 1
**Instrucción a Copilot:** "Genera un formulario HTML para matrícula con validación de DNI y un login básico."

## Prompt 2
**Instrucción a Copilot:** "Ayúdame a hacer un carrusel de imágenes con JavaScript para el panel principal."

## Prompt 3 — Codex: dashboard de reportes

**Instrucción consolidada dada a Codex el 19/11/2026:** "Crea un dashboard sencillo dentro de Reportes. Muestra la cantidad de matrículas de ejemplo, las combinaciones de grado y sección con registros y la ocupación respecto a un aforo de referencia de 30 estudiantes por sección. Calcula las cifras desde los datos que ya existen en `js/main.js` y no escribas los totales a mano ni los presentes como datos reales. Sigue los skills de `skills/reglas` para paleta, tipografía y accesibilidad. Haz que funcione en PC y celular, muestra las cantidades también en texto, verifica el resultado y toma capturas de la pantalla y del código."

**Archivos:** `index.html`, `js/main.js`, `css/components.css` y `css/responsive.css`. Los reportes siguen usando datos de demostración y el formulario de matrícula todavía no actualiza estas cifras.

## Prompt 4 — Codex: página principal

**Instrucción consolidada dada a Codex el 19/11/2026:** "Haz la página principal del prototipo tomando como referencia los mockups existentes. Agrega accesos claros a Matrícula, Docentes y Reportes que abran sus vistas actuales. Respeta la paleta, la tipografía y el diseño adaptable definidos en `skills/reglas`. Conserva el login, el carrusel que ya existe en la página principal y el dashboard de Reportes. Guarda el prompt y verifica la navegación en computadora y celular."

**Archivos:** `index.html`, `js/main.js`, `css/components.css` y `css/responsive.css`. Los accesos usan las vistas ya implementadas; no se modifica el inicio de sesión ni se crea otro carrusel.
