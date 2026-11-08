# Skill: Guía de estilos visuales

## Objetivo

Aplicar de forma consistente la paleta, tipografía, jerarquía y criterios de accesibilidad definidos aquí en toda interfaz, documento, gráfico o pieza visual. Esta guía es obligatoria: no inventar colores ni tipografías.

## Colores permitidos

Usar únicamente estos colores. Los nombres son descriptivos; los valores HEX son la referencia exacta.

### Principales

| Nombre | HEX |
|---|---|
| Naranja | `#E8A317` |
| Verde limón pálido | `#EDF2C8` |
| Verde oscuro | `#1E5A3C` |
| Gris | `#5A5A52` |
| Ámbar oscuro | `#8A5A00` |
| Verde pino | `#123D27` |

### Secundarios

| Nombre | HEX |
|---|---|
| Naranja claro | `#FBF0D2` |
| Underwall | `#1B211D` |
| Marfil | `#F6F4EE` |
| Menta pálido | `#E3EFE7` |
| Arena pálido | `#DAD7CC` |

### Estados

| Estado | Color | HEX |
|---|---|---|
| Correcto, éxito, asistencia | Turquesa oscuro | `#00765A` |
| Advertencia, pendiente, tardanza | Ámbar oscuro | `#8A5A00` |
| Incorrecto, error, falta injustificada | Rojo terracota | `#B03F00` |
| Información, falta justificada | Celeste vívido | `#0B5C99` |

Para variantes más suaves de un estado, conservar el mismo tono y reducir su opacidad progresivamente; no sustituirlo por otro tono.

### Gráficos

Usar las series en este orden, sin saltarse primero los colores principales:

1. Principales: azul océano `#007ACC`, amarillo `#FAB426`.
2. Secundarios: turquesa vívido `#009E73`, magenta `#CC79A7`.
3. Complementarios: bermellón `#D55E00`, púrpura ciruelo `#3B1C47`.

## Aplicación por elemento

- **Fondo claro:** arena pálido `#DAD7CC`.
- **Fondo oscuro:** Underwall `#1B211D`.
- **Títulos:** verde oscuro `#1E5A3C` como principal; también se permite naranja `#E8A317` o Underwall `#1B211D`.
- **Botones:** verde oscuro `#1E5A3C` o naranja `#E8A317`.
- **Texto:** Underwall `#1B211D`, marfil `#F6F4EE`, gris `#5A5A52`, ámbar oscuro `#8A5A00` o verde pino `#123D27`.
- **Cuadros de texto:** marfil `#F6F4EE`.
- **Encabezados de tabla:** menta pálido `#E3EFE7`.
- **Advertencias:** ámbar oscuro `#8A5A00`.
- **Resaltados:** verde limón pálido `#EDF2C8`.

Mantener un estilo sobrio y legible, con fondos arena pálido o Underwall y acentos verdes y naranjas.

## Tipografía

Usar Open Sans para títulos y Atkinson para textos. Respetar tamaños, pesos, interlineados y colores:

### Títulos (Open Sans)

| Nivel | Estilo | Tamaño/interlineado | Color |
|---|---|---|---|
| Título | Bold | 42/48 px | `#1E5A3C` |
| Header 1 | Bold | 32/36 px | `#E8A317` |
| Header 2 | Regular | 28/30 px | `#1E5A3C` |
| Header 3 | Regular | 22/26 px | `#1B211D` |

### Textos (Atkinson)

| Uso | Tamaño | Color |
|---|---|---|
| Texto principal | 22 px | `#1B211D` |
| Texto secundario | 20 px | `#123D27` |
| Texto de advertencia o énfasis | 18 px | `#8A5A00` |
| Texto mínimo recomendado | 16 px | `#5A5A52` |
| Notas sobre fondo oscuro, únicamente | 14 px | `#F6F4EE` |

La jerarquía debe ser: Título > Header 1 > Header 2 > Header 3 > texto. No usar texto menor de 16 px, excepto notas de 14 px sobre fondo oscuro.

## Accesibilidad obligatoria

1. Nunca transmitir información solo mediante color. Añadir texto, iconos, patrones u otra señal accesible.
2. No usar rojo y verde juntos como único diferenciador.
3. Mantener el contraste: texto claro `#F6F4EE` sobre fondos oscuros `#1B211D` o `#123D27`; texto oscuro `#1B211D` sobre fondos claros `#DAD7CC` o `#F6F4EE`.
4. No asumir que una combinación es accesible por pertenecer a la paleta: comprobar contraste en el contexto final y ajustar la combinación utilizando únicamente colores permitidos.
5. Acompañar estados, errores y gráficos con etiquetas o leyendas comprensibles sin depender de la percepción del color.

## Reglas de uso

1. Antes de diseñar, identificar el tipo de pieza, tema (claro u oscuro), jerarquía de contenido y estados o datos que deban comunicarse.
2. Aplicar los colores permitidos según su función; no crear tonos nuevos, gradientes con colores ajenos a la guía ni colores de marca adicionales.
3. Si una petición requiere un color no definido, escoger el color permitido más cercano según su función y comunicar explícitamente esa sustitución.
4. No introducir tipografías distintas de Open Sans y Atkinson. Usar los pesos especificados; cuando no se indique un peso, usar el estilo regular.
5. Antes de entregar, verificar los valores HEX, la jerarquía tipográfica, el tamaño mínimo, el contraste y que la información no dependa únicamente del color.

## Lista de verificación

- [ ] Todos los colores corresponden a valores HEX de esta guía.
- [ ] La asignación de colores coincide con el tipo de elemento y el tema.
- [ ] Se usan Open Sans y Atkinson con tamaños, pesos y jerarquía correctos.
- [ ] El texto tiene al menos 16 px, salvo notas de 14 px sobre fondo oscuro.
- [ ] Contraste y lectura se comprobaron en el contexto final.
- [ ] Estados y datos tienen etiquetas, iconos, patrones o señales además del color.
- [ ] Si se sustituyó un color solicitado, se informó cuál fue el más cercano elegido.
