# Skill: Landing page responsive y modular

## Objetivo

Crear y mantener una landing page genérica, dinámica, accesible y adaptable a móviles, tabletas y escritorio. La implementación debe separar completamente la estructura, los estilos y el comportamiento.

## Estructura obligatoria

```text
/
├── index.html
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── main.js
│   └── components/
└── assets/
	├── img/
	├── icons/
	└── fonts/
```

- `index.html`: estructura semántica y contenido de la página.
- `css/`: todos los estilos. No se permite CSS inline ni etiquetas `<style>` en HTML.
- `js/`: toda la lógica e interactividad. No se permite JavaScript inline ni atributos `onclick`.
- `assets/`: imágenes, iconos, fuentes y otros recursos estáticos.

## Reglas HTML

1. Usar HTML5 semántico: `header`, `nav`, `main`, `section`, `article`, `aside` y `footer` cuando corresponda.
2. Mantener una jerarquía correcta de encabezados, con un único `h1` principal.
3. Incluir `meta charset="UTF-8"`, viewport responsive y un título descriptivo.
4. Asociar cada `label` con su control de formulario y definir textos alternativos significativos para las imágenes.
5. Usar botones para acciones y enlaces para navegación.
6. Evitar divs innecesarios y contenido duplicado.
7. Cargar las hojas CSS en este orden: `reset.css`, `variables.css`, `components.css`, `responsive.css`.
8. Cargar `js/main.js` con `defer`.

## Reglas CSS

1. Utilizar `box-sizing: border-box` y un reset mínimo coherente.
2. Definir colores, tipografías, espaciados, radios y sombras como custom properties en `variables.css`.
3. Aplicar primero un diseño mobile-first y ampliar mediante media queries.
4. Usar Flexbox y CSS Grid para layouts; evitar posicionamientos absolutos para estructurar contenido.
5. No fijar anchos que provoquen scroll horizontal. Preferir `width: 100%`, `max-width`, `clamp()`, `min()`, `max()` y unidades relativas.
6. Mantener una escala de contenedor consistente, por ejemplo `max-width: 1200px` y espaciado lateral fluido.
7. Utilizar clases reutilizables con nombres claros y consistentes. Evitar selectores excesivamente específicos.
8. Definir estados `:hover`, `:focus-visible`, `:active` y `:disabled` cuando sean aplicables.
9. Respetar `prefers-reduced-motion: reduce` y no depender únicamente del color para transmitir información.
10. Mantener `responsive.css` para ajustes específicos de breakpoint, sin duplicar reglas base.

## Reglas JavaScript

1. Usar JavaScript moderno y módulos cuando la complejidad lo justifique.
2. Esperar al DOM mediante `defer` o inicialización controlada; no usar scripts inline.
3. Seleccionar elementos con atributos `data-*` o clases específicas, evitando acoplar la lógica a la estructura visual.
4. Separar cada comportamiento en una función pequeña: navegación móvil, scroll suave, validación, carruseles o animaciones.
5. Usar delegación de eventos cuando existan elementos dinámicos o listas repetidas.
6. Validar entradas de usuario y proporcionar mensajes de error accesibles.
7. Gestionar el estado de los componentes mediante clases y atributos ARIA, por ejemplo `aria-expanded` y `aria-hidden`.
8. No introducir dependencias externas sin necesidad. Si se añade una, justificarla y cargarla de forma segura.
9. Evitar errores en consola y comprobar que la funcionalidad sigue operativa sin JavaScript cuando sea posible.

## Componentes mínimos de la landing

- Navegación responsive con menú móvil accesible.
- Hero con propuesta de valor y llamada a la acción.
- Sección de beneficios o características.
- Sección de presentación, proceso o testimonios.
- Llamada a la acción final.
- Footer con enlaces y datos de contacto.

## Comportamiento responsive

- **Móvil:** una columna, navegación colapsada, botones táctiles y tipografía fluida.
- **Tableta:** agrupación progresiva de tarjetas y distribución de dos columnas cuando haya espacio.
- **Escritorio:** contenido centrado, varias columnas y aprovechamiento equilibrado del espacio.
- No ocultar información esencial en pantallas pequeñas.
- Probar al menos 320 px, 768 px, 1024 px y 1440 px de ancho.
- Comprobar orientación vertical y horizontal, zoom del navegador y ausencia de scroll horizontal.

## Accesibilidad y calidad

- Mantener contraste suficiente y foco visible.
- Permitir navegación completa con teclado.
- Respetar el orden lógico de lectura.
- Usar atributos ARIA solo cuando el HTML semántico no sea suficiente.
- Optimizar imágenes con formatos modernos y `loading="lazy"` fuera del contenido inicial.
- Usar rutas relativas y nombres de archivos en minúsculas, sin espacios ni caracteres especiales.
- Verificar HTML, CSS y JavaScript antes de entregar.

## Criterios de aceptación

- HTML, CSS y JavaScript están en archivos y carpetas independientes.
- La página funciona sin errores en consola.
- El menú y las interacciones principales funcionan con ratón, teclado y dispositivos táctiles.
- El contenido se adapta sin desbordamientos entre 320 px y 1440 px.
- Los estilos repetidos están centralizados en variables o componentes reutilizables.
- No existen estilos ni scripts inline.
- La estructura es comprensible para otro desarrollador sin depender de documentación adicional.
