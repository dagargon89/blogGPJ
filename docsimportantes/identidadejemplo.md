# Estándar de interfaz — Hub de Conocimiento (blog interno)

Documento de referencia para el desarrollo UI del **blog organizacional** en este repositorio: **Laravel + Inertia + React 19 + Tailwind CSS v4**. Las fuentes de verdad en código son:

- [resources/css/app.css](../resources/css/app.css) — tokens de tema (`@theme`, `:root`, `.dark`), radios base y mapeo a utilidades Tailwind.
- [resources/js/hooks/use-appearance.tsx](../resources/js/hooks/use-appearance.tsx) — persistencia del tema (claro / oscuro / sistema) y aplicación de la clase `dark` en `<html>`.
- [resources/js/components/ui/](../resources/js/components/ui/) — componentes reutilizables (patrón tipo shadcn/Radix).

El nombre visible en UI debe alinearse con `APP_NAME` en `.env` (por defecto puede ser “Laravel” hasta definir marca final). Este documento describe la **identidad visual objetivo** (acento índigo/violeta, opción “glass” suave) y cómo mapearla a esos tokens. **Hasta que `app.css` se ajuste a la tabla de marca**, los valores concretos en el código pueden seguir siendo neutros (grises oklch del starter); en ese caso, la implementación debe actualizar variables en `app.css` para coincidir con la guía, no al revés.

---

## 1. Identidad de producto

| Aspecto | Valor |
|--------|--------|
| **Nombre en UI** | Definido por `APP_NAME` / producto (Hub de Conocimiento Organizacional). |
| **Propósito** | Blog interno: publicación y consumo de artículos, vídeos, infografías y documentos. |
| **Tono visual** | Profesional, lectura cómoda, acento **índigo/violeta** (gradiente de referencia `#6384ff` → `#5a6fff`). Opcional: paneles con sensación “glass” (`backdrop-blur`, fondos semitransparentes) en cabecera, sidebar o tarjetas del admin. |
| **Monograma / logo** | Si se usa marca en header: letra o icono en contenedor con `rounded-lg` o `rounded-xl`, gradiente de acento coherente con `--primary` (ver §3). |

---

## 2. Tipografía

### 2.1 Estado actual en el repositorio

En `app.css`, la familia principal del `@theme` es **Instrument Sans** (stack sans del starter Laravel).

### 2.2 Objetivo de marca (opcional)

Si el equipo decide alinearse con una jerarquía “dato vs. interfaz” más marcada:

| Uso | Familia sugerida |
|-----|------------------|
| Interfaz general | **DM Sans** (cargar vía `@font-face` o proveedor acordado). |
| Datos tabulares, métricas, badges técnicos | **JetBrains Mono** |

Cualquier cambio de fuente debe hacerse **solo** en `app.css` (`--font-sans` y, si aplica, una variable extra para mono en `@theme`), no duplicando familias en cada componente.

### 2.3 Pesos y escala

- Títulos de página: semibold o bold (`font-semibold` / `font-bold`).
- Cuerpo: `text-sm` o `text-base` según densidad (listados admin vs. lectura de artículo).
- Meta (fechas, categorías): `text-muted-foreground` + `text-xs` o `text-sm`.
- Tablas admin: cabeceras en mayúsculas opcional con `tracking-wide` y `text-muted-foreground`.

---

## 3. Paleta y roles de color (objetivo de marca)

Los colores semánticos del proyecto se consumen vía variables CSS mapeadas en `@theme` de Tailwind v4 (`bg-primary`, `text-primary`, `border-border`, etc.). La tabla siguiente es la **referencia de marca**; conviene reflejarla en `:root` y `.dark` dentro de [resources/css/app.css](../resources/css/app.css) usando **oklch** o **hex** de forma consistente.

### 3.1 Acento de marca

| Rol | Referencia visual | Tokens del proyecto |
|-----|-------------------|---------------------|
| Gradiente primario (botones, links fuertes, highlights) | `linear-gradient(135deg, #6384ff, #5a6fff)` | Implementar como `bg-gradient-to-br` con stops basados en `--primary` o variables dedicadas (`--primary-from` / `--primary-to`) si hace falta. |
| Acento sólido / anillos | `rgba(99, 132, 255, …)` | `--primary`, `--ring`, `ring-primary` en foco. |
| Enlaces | Claro: ~`#365be8`; oscuro: ~`#8193ff` | `--color-primary` o variable `--link` si se añade en `app.css`. |

### 3.2 Semántica (éxito, advertencia, error)

Alinear con utilidades existentes y `destructive`:

| Semántica | Uso en UI del blog |
|-----------|-------------------|
| Éxito | Estados publicados, confirmaciones (badges `outline` o variante `default` con color verde si se extiende el tema). |
| Advertencia | Borradores pendientes de revisión. |
| Error / destructivo | Eliminar, errores de formulario — `destructive` en [Button](../resources/js/components/ui/button.tsx), [Alert](../resources/js/components/ui/alert.tsx), etc. |

Los valores exactos pueden apoyarse en `--chart-*` ya definidos en `app.css` o en nuevas variables si el diseño lo requiere.

### 3.3 Texto sobre primario

Etiquetas sobre botón primario: usar siempre `text-primary-foreground` (o equivalente definido en tema) para contraste adecuado.

---

## 4. Variables CSS y Tailwind (`resources/css/app.css`)

El archivo define:

- `@theme { ... }` — mapeo de `--color-primary`, `--color-background`, `--color-sidebar-*`, radios derivados de `--radius`, etc.
- `:root { ... }` — valores modo claro.
- `.dark { ... }` — valores modo oscuro.

**Regla:** nuevos colores de marca deben entrar aquí y exponerse vía `@theme` para poder usar `bg-background`, `text-foreground`, `border-border`, `bg-primary`, etc., sin hex sueltos en JSX.

---

## 5. Modo claro y modo oscuro

| Aspecto | Implementación |
|---------|----------------|
| **Estado** | `light`, `dark` o `system` (hook `use-appearance`). |
| **DOM** | Clase `dark` en `document.documentElement` cuando corresponde; `color-scheme` light/dark. |
| **Persistencia** | `localStorage` clave `appearance` y cookie `appearance` (sincronización con backend si el proyecto ya lo usa). |
| **UI** | Pestaña Ajustes / apariencia: [resources/js/pages/settings/appearance.tsx](../resources/js/pages/settings/appearance.tsx) y componentes asociados. |

**Regla para nuevos componentes:** usar clases semánticas (`bg-background`, `text-muted-foreground`, `border-border`) en lugar de colores fijos que solo funcionen en un modo.

---

## 6. Formas, radios y layout

### 6.1 Radio base del proyecto

En `app.css`, `--radius: 0.625rem` (~10px) es la base. Tailwind expone:

- `rounded-lg` → `var(--radius)`
- `rounded-md` → `calc(var(--radius) - 2px)`
- `rounded-sm` → `calc(var(--radius) - 4px)`

### 6.2 Escala recomendada (alineada al producto)

| Uso | Clase / valor |
|-----|----------------|
| Inputs, botones estándar | `rounded-md` o `rounded-lg` según componente UI. |
| Tarjetas de blog, paneles admin | `rounded-xl` o `rounded-lg` + `border` + `shadow-sm`. |
| Modales, sheets | Radios del [Dialog](../resources/js/components/ui/dialog.tsx) / [Sheet](../resources/js/components/ui/sheet.tsx) del kit (no redefinir sin actualizar el tema). |
| Badges / pills | `rounded-full` para etiquetas de categoría o estado. |

### 6.3 Sombras y “glass”

| Patrón | Sugerencia |
|--------|------------|
| Tarjetas | `shadow-sm`, hover `shadow-md` + transición breve. |
| Header / sidebar flotante | `backdrop-blur` + fondo `bg-background/80` o `bg-card/80` (modo claro/oscuro coherente). |
| Enfoque accesible | `ring-2 ring-ring` o `focus-visible:ring-*` según componentes Radix. |

---

## 7. Componentes obligatorios (patrones)

Priorizar composición con primitivas en `resources/js/components/ui/`:

| Necesidad | Componentes |
|-----------|----------------|
| Acciones | `Button`, `DropdownMenu` |
| Formularios admin | `Input`, `Label`, `Select`, `Checkbox`, `Textarea` (si existe o se añade) |
| Contenedores | `Card`, `Separator` |
| Navegación | `Sidebar` del layout de aplicación, `Breadcrumb`, `NavigationMenu` según caso |
| Retroalimentación | `Alert`, `Sonner` (toasts), `Dialog` |
| Datos | Tablas HTML semánticas con clases Tailwind o componente tabla del kit si se estandariza |

Layouts de referencia: [resources/js/layouts/app-layout.tsx](../resources/js/layouts/app-layout.tsx), sidebar y header en [resources/js/components/](../resources/js/components/).

**Blog público:** layout propio (navbar, footer) reutilizando los mismos tokens CSS; no introducir un segundo sistema de diseño sin documentarlo aquí.

---

## 8. Pantallas especiales

- **Login / registro / Fortify:** páginas en `resources/js/pages/auth/`; deben usar `bg-background`, `text-foreground` y componentes UI para coherencia con el resto de la app.
- **Dashboard / admin:** mismo sistema de tokens; distinguir secciones con `Card`, títulos con `Heading` o tipografía del layout existente.
- **Lectura de post:** ancho máximo legible (`max-w-prose` o similar), contraste de texto sobre fondo `background`.

---

## 9. Motion

| Uso | Valor orientativo |
|-----|-------------------|
| Transiciones hover | `duration-200` |
| Apertura de diálogos / sheets | Animaciones ya definidas en los componentes UI; no duplicar keyframes globales salvo necesidad. |

Evitar animaciones largas en interacciones frecuentes.

---

## 10. Accesibilidad

- Contraste de texto y bordes en modo claro y oscuro; probar badges y estados “muted”.
- Controles interactivos: `:focus-visible` con anillo visible (`ring-2 ring-ring`).
- Iconos decorativos: `aria-hidden`; botones solo icono: `aria-label`.
- Formularios: asociar `Label` con `id`/`htmlFor`; errores con [InputError](../resources/js/components/input-error.tsx) o equivalente.

---

## 11. Antipatrones (no hacer)

1. Esparcir **hexadecimales sueltos** en TSX cuando ya existe token en `app.css` / `@theme`.
2. Ignorar la clase **`dark`**: colores fijos que solo funcionen en un modo rompen la apariencia.
3. Introducir **otro framework CSS global** en paralelo sin convención y sin actualizar este documento.
4. Duplicar la definición de **tipografía** en cada página en lugar de ajustar `--font-sans` en `app.css`.
5. Sustituir el gradiente o color de marca sin actualizar **sombras, hovers y `ring`** asociados para mantener coherencia.

---

## 12. Resumen ejecutivo

- **Producto:** blog interno (Hub de Conocimiento); UI en **React + Inertia + Tailwind v4**.
- **Marca visual objetivo:** acento **índigo** `#6384ff` / `#5a6fff`, UI limpia con opción glass mediante `backdrop-blur` y fondos semitransparentes.
- **Tokens:** centralizados en **`resources/css/app.css`**; consumo vía utilidades Tailwind y variables semánticas.
- **Tema:** clase **`dark`** en `<html>`, hook **`use-appearance`**, persistencia en `localStorage` / cookie.
- **Componentes:** **`resources/js/components/ui/*`** como base; layouts en `resources/js/layouts/`.

Cualquier cambio relevante a este estándar debe reflejarse en este documento y, preferentemente, consolidarse en `app.css` antes de propagar valores a componentes sueltos.
