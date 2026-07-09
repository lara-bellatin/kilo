# Kilo — Design System

Spec para dirigir el frontend. Todo componente nuevo debe derivarse de estos tokens; si algo no está definido aquí, se decide una vez y se agrega al documento.

## Dirección

Dark y light, técnico, de precisión. Kilo es una app de medición — el diseño trata los números como protagonistas. El ámbar tiene significado semántico (marca lo que **el plan** dice), no es decoración.

Ambos temas son ciudadanos de primera clase. La app respeta `prefers-color-scheme` y expone un toggle manual (persistido en `localStorage`).

## Cómo se implementa (single source of truth)

Todo token vive como CSS variable en `src/app/globals.css`. Se declara dos veces: en `:root` (light) y en `.dark`. Los componentes **nunca** usan colores hardcoded — siempre `bg-surface`, `text-muted`, `border-border`, etc. (Tailwind mapea a las variables via `@theme`).

Cambiar el acento, la tipografía o cualquier token = editar un solo lugar (`globals.css`) y toda la app se actualiza.

Reglas:
- Los componentes reusables viven en `src/components/ui/` — Button, Input, Card, Checkbox, Stepper, TabBar, etc.
- Cada componente acepta variantes (`variant`, `size`) via `cva`, nunca props sueltos de estilo.
- Un cambio de look pasa por el componente base, jamás por `className` inline en pantallas.

## Color

Los valores están tuneados para que ambos temas tengan sensación de "instrumento de medición". Cifras derivadas (progresos, deltas) usan los semánticos; el ámbar SOLO marca lo prescrito por el plan.

```css
/* light — cream mate sobre carbón */
:root {
  --bg:            #FAF7F2;
  --surface:       #FFFFFF;
  --surface-2:     #F2EFEA;
  --border:        #E5DED3;

  --text:          #131110;
  --text-muted:    #6B655C;
  --text-faint:    #A39D94;

  --accent:        #B8801A;   /* ámbar más profundo para contraste sobre cream */
  --accent-dim:    #D9A34A;

  --done:          #3E7F45;
  --warn:          #A9762B;
  --over:          #B24236;
  --info:          #3E6FA5;
}

/* dark — carbón cálido, no negro puro */
.dark {
  --bg:            #131110;
  --surface:       #1C1917;
  --surface-2:     #26221F;
  --border:        #332E29;

  --text:          #F2EFEA;
  --text-muted:    #A39D94;
  --text-faint:    #6B655C;

  --accent:        #E5A73B;
  --accent-dim:    #8A6420;

  --done:          #7BC47F;
  --warn:          #E5C07B;
  --over:          #E06C60;
  --info:          #7AA5D6;
}
```

**Regla de oro del ámbar**: `--accent` marca lo que el plan *prescribe* (metas de kcal, pick counts, targets). El progreso del usuario usa los semánticos. Así el ojo aprende: ámbar = objetivo, verde = lo logré. Nunca usar ámbar como decoración genérica.

## Tipografía

Tres roles, tres fuentes (cargadas una vez via `next/font/google` y expuestas como CSS vars):

| Rol | Fuente | Variable | Uso |
|---|---|---|---|
| Display | **Archivo** (800–900) | `--font-display` | Nombre del usuario, títulos de página. Máximo 1 por vista |
| Body | **Instrument Sans** (400/500/600) | `--font-body` | Todo el texto de UI |
| Data | **JetBrains Mono** (400/600) | `--font-mono` | TODO número: kcal, gramos, mediciones, fechas, eyebrows |

**Regla**: si es un dato medible, va en mono. Las unidades (`kcal`, `g`, `cm`) van en mono 400, `--text-muted`, tamaño un paso menor que la cifra.

Escala (mobile-first):

```
display:  clamp(2rem, 8vw, 3rem)  / Archivo 900, tracking -0.02em, uppercase
h1:       1.5rem   / Archivo 800
h2:       1.125rem / Instrument Sans 600
body:     1rem     / Instrument Sans 400, line-height 1.5
small:    0.875rem
eyebrow:  0.6875rem / JetBrains Mono 600, uppercase, tracking 0.12em, --text-muted
data-lg:  1.75rem  / JetBrains Mono 600 (kcal del día, peso actual)
data:     1rem     / JetBrains Mono 400
```

Utilidades Tailwind provistas: `font-display`, `font-body`, `font-mono`, `text-eyebrow`, `text-data-lg`, `text-data`.

## Espaciado y layout

- Escala de 4px: `4, 8, 12, 16, 24, 32, 48, 64`. Nada fuera de escala.
- Contenedor único: max-width `960px` centrado, en todas las vistas. La app es una columna — en desktop no se expande a multi-columna, se mantiene consistente.
- Padding de cards: `16px` mobile, `24px` desktop.
- Gap entre secciones de página: `48px`. Entre cards: `12px`.
- **Touch targets mínimo 44×44px**. Los steppers +/− y checkboxes son lo que más se toca; hacerlos generosos (48px).
- Safe areas: `env(safe-area-inset-*)` en nav fija (PWA fullscreen).

## Forma y profundidad

- Radius: `8px` inputs y botones, `12px` cards, `999px` pills/badges. Expuestos como `rounded-input`, `rounded-card`, `rounded-pill`.
- Sin sombras. La profundidad se da por capas de color (`--bg` → `--surface` → `--surface-2`) y bordes de 1px.
- Bordes siempre `1px solid var(--border)`; nunca 2px, nunca sin borde en cards.

## Componentes clave (reglas, no diseño detallado)

- **Button**: variantes `primary` (fondo `--text`, texto `--bg`), `ghost` (transparent + border), `accent` (solo para CTAs relacionados al plan — usar con cuidado). Tamaños `sm|md|lg`.
- **Input**: fondo `--surface-2`, borde `--border`, foco `--accent`. Sufijo de unidad en mono muted (para inputs numéricos).
- **Card**: `--surface` + 1px border + `rounded-card`. Padding responsive.
- **Checkbox de opción**: fila completa tappable, no solo el cuadrito. Estado marcado: check en `--done`, texto normal (no tachar — comió eso, no es un todo).
- **Stepper +/−**: el contador en mono. Al exceder `pick_count` del grupo, el header del grupo muestra badge `--warn` con "N de M" — visible pero no bloquea.
- **Progreso del día**: barra o anillo, kcal consumidas (mono, `--text`) sobre meta (mono, `--accent`).
- **Tab bar**: fija abajo en mobile (safe-area aware), horizontal arriba en desktop. Item activo: ícono + label en `--text`; resto en `--text-muted`.
- **Sheet (bottom sheet)**: `<dialog>` nativo con `showModal()` (focus trap, Esc y top layer gratis). Fijo abajo, `min(100%, 560px)` centrado, radius superior `--radius-card`, `--surface` + borde 1px sin sombra, max-height `85dvh` con body scrolleable y footer sticky (safe-area aware). Slide-up `300ms var(--ease-out)`, backdrop fade 200ms; con `prefers-reduced-motion` aparece sin transform. Cerrar = Esc, tap en backdrop o X (44px). Un formulario por sheet; "Guardar" primary a lo ancho, acción destructiva a la izquierda del footer en `--over`.

## Motion

Mínimo y funcional: `150ms ease-out` en estados interactivos, `200ms` en aparición de badges de alerta. Sin animaciones de entrada de página. Respetar `prefers-reduced-motion`. La app debe sentirse instantánea (optimistic updates), no animada.

## Accesibilidad (piso, no meta)

- Contraste AA mínimo en ambos temas. Verificar cualquier color nuevo con contrast checker.
- Focus visible: `2px` outline `--accent` con `2px` offset.
- Los estados nunca se comunican solo por color: badge de alerta lleva ícono + texto.
- Iconografía: `lucide-react`. Nunca ícono sin `aria-label` o texto adjunto.

## Iconos

`lucide-react` como set. Tamaños estándar: `16` (inline con texto), `20` (botones), `24` (tab bar). Stroke `1.5` para consistencia visual.
