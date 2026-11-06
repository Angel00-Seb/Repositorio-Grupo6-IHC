# Skill: Uso de Bootstrap 5.3.8 sin instalación

## Objetivo

Construir y mantener interfaces con Bootstrap **exactamente en la versión 5.3.8**, sin instalar paquetes ni añadir dependencias al proyecto. Bootstrap se carga desde su CDN mediante referencias HTML y los cambios del proyecto se realizan desde la línea de comandos (CMD) o editando los archivos existentes.

## Reglas obligatorias

1. Usar exclusivamente Bootstrap **5.3.8**. Fijar `@5.3.8` en cada URL; no usar `latest`, rangos de versión ni una versión diferente.
2. No instalar Bootstrap ni herramientas adicionales. No ejecutar `npm install`, `yarn add`, `pnpm add`, `npx` ni gestores equivalentes para incorporar el framework.
3. Cargar Bootstrap desde jsDelivr por HTTPS:
   - CSS: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css`
   - JavaScript con Popper incluido: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js`
4. No descargar ni copiar Bootstrap al repositorio, salvo que el usuario solicite explícitamente cambiar el método CDN.
5. Mantener el código propio en los archivos existentes de `css/` y `js/`. No agregar estilos ni scripts inline.
6. Seguir también las skills de estructura del proyecto y la guía de estilos visuales. Si hubiera conflicto, mantener Bootstrap como dependencia visual y sobrescribir sus estilos de forma local para respetar la guía.

## Integración en HTML

Añadir el CSS de Bootstrap en el `<head>` antes de las hojas locales. Mantener el orden de las hojas locales definido por el proyecto:

```html
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>
<link rel="stylesheet" href="css/reset.css" />
<link rel="stylesheet" href="css/variables.css" />
<link rel="stylesheet" href="css/components.css" />
<link rel="stylesheet" href="css/responsive.css" />
```

Incluir el bundle una sola vez, al final del `<body>` o con `defer`. No cargar por separado Popper ni duplicar el bundle:

```html
<script
  src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
  defer
></script>
<script src="js/main.js" defer></script>
```

Si el CDN publica valores SRI para esa versión, usar los valores exactos de la documentación oficial. Nunca inventar ni reutilizar hashes de otra versión.

## Uso desde CMD

Trabajar desde la carpeta raíz del proyecto. Se pueden usar comandos CMD estándar para inspeccionar o crear directorios y archivos; no usar comandos de instalación:

```cmd
cd ruta\al\proyecto
dir
mkdir css
mkdir js
```

Antes de crear una carpeta, comprobar con `dir` que no exista ya. Editar `index.html` y las hojas locales existentes con el editor disponible o con herramientas de CMD, evitando sobrescribir contenido que ya tenga trabajo del proyecto.

## Componentes y JavaScript

- Preferir componentes y utilidades nativas de Bootstrap antes de escribir estilos o comportamientos duplicados.
- Para componentes interactivos, usar atributos `data-bs-*` documentados y comprobar que el bundle 5.3.8 esté cargado.
- Usar el bundle (`bootstrap.bundle.min.js`), que ya incluye Popper para dropdowns, tooltips y popovers.
- No añadir jQuery: Bootstrap 5 no lo requiere.
- No cargar dos veces Bootstrap, Popper o el mismo componente.
- Mantener cualquier lógica propia en `js/main.js`; no usar atributos `onclick` ni scripts inline.
- Inicializar tooltips y popovers mediante JavaScript local cuando sean necesarios; no asumir que se activan automáticamente.

## Estilos, paleta y accesibilidad

- Bootstrap no reemplaza la guía visual del proyecto. Mapear o sobrescribir los colores y tipografías de los componentes usados mediante variables CSS y reglas en los archivos locales.
- No dejar colores predeterminados de Bootstrap visibles si no están permitidos por la guía de estilos visuales.
- No crear colores nuevos para estados; usar los colores de estado autorizados y acompañarlos de texto, iconos o patrones.
- Mantener Open Sans para títulos y Atkinson para textos, así como la jerarquía y tamaños mínimos establecidos en la guía.
- Verificar contraste, foco visible, navegación con teclado, etiquetas accesibles y comportamiento responsive.
- Preferir HTML semántico y clases Bootstrap; agregar roles ARIA solo cuando sean necesarios y no estén cubiertos por el elemento o componente.

## Verificación antes de entregar

1. Confirmar que todas las URL de Bootstrap contengan exactamente `@5.3.8`.
2. Confirmar que no se añadieron dependencias ni comandos de instalación.
3. Revisar que los enlaces CDN estén en `index.html`, el CSS antes de los estilos locales y el bundle cargado una sola vez.
4. Comprobar que todas las rutas locales referenciadas existan y que no haya estilos o scripts inline.
5. Probar los componentes interactivos, teclado y vistas de móvil y escritorio con conexión disponible al CDN.
6. Verificar que la interfaz final conserve los colores, tipografías y requisitos de accesibilidad de la guía visual.
