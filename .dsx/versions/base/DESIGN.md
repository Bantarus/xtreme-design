---
version: alpha
name: Helios
description: Helios is a warm, content-forward design system. Quiet surfaces, dense type, one decisive amber accent. Place-holder brand for the dsx scaffold — rename to your real brand before shipping.
colors:
  primary: "#7A3E0C"
  primary-hover: "#5E2F08"
  on-primary: "#FFFFFF"
  surface: "#FAF8F3"
  surface-muted: "#EFEBE2"
  text: "#161311"
  text-muted: "#57524A"
  border: "#D8D2C5"
  border-strong: "#B0A89A"
  success: "#2F6D3A"
  danger: "#B23A2A"
  warning: "#8C5A00"
  info: "#1E5A8C"
  focus-ring: "#D89B5E"
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.005em
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: 0.08em
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0em
rounded:
  xs: 2px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  gutter: 24px
  margin: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: 40px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: 40px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: 40px
  button-ghost:
    textColor: "{colors.text}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: 40px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
    height: 40px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  badge:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.text}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    height: 20px
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    height: 20px
  badge-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    height: 20px
  badge-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    height: 20px
  badge-info:
    backgroundColor: "{colors.info}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    height: 20px
  caption:
    textColor: "{colors.text-muted}"
    typography: "{typography.body-sm}"
---

# Helios

## Overview

Helios is the design vocabulary for a small, content-forward product. The product is read more than it is clicked, so the system rewards stillness: a warm off-white page, near-black ink, and exactly one accent — a deep sienna amber — that names the single most important action on any given view. Visual hierarchy comes from type weight, density, and tonal contrast, not from chrome, gradients, or shadows.

The target user is a focused adult, often on a laptop, sometimes on a phone in good light. The emotional response we want is "calm and credible," not "fun and bouncy." Density should feel editorial, like a well-set magazine column, not enterprise-dense. When in doubt, give an element more space, not more decoration.

## Colors

The palette is grounded in a warm neutral spine. The page sits on a soft limestone (`surface`, #FAF8F3), text is a near-black ink (`text`, #161311) chosen for warmth rather than pure neutrality, and a single deep sienna (`primary`, #7A3E0C) drives interaction.

- **Primary (#7A3E0C, "Sienna"):** Reserved for the single most important action on any view — submits, confirms, the active step in a flow. Never use two `primary` buttons on the same screen.
- **Primary Hover (#5E2F08):** The darker pressed/hover state for `primary`. Do not use as a fill on its own.
- **On Primary (#FFFFFF):** Text and icon color when rendered on `primary` or `primary-hover`. Never use on `surface`.
- **Surface (#FAF8F3, "Limestone"):** The default page and card background. Warm, not white.
- **Surface Muted (#EFEBE2):** Section dividers, code blocks, badge backgrounds. Use sparingly — one muted band per view.
- **Text (#161311, "Ink"):** All body and heading copy on `surface`. Reserved for foreground.
- **Text Muted (#57524A):** Captions, metadata, helper text. Passes WCAG AA on `surface`. Never use for the primary headline of a view.
- **Border (#D8D2C5):** The default hairline between cards, inputs, and table rows.
- **Border Strong (#B0A89A):** Use only when the default border vanishes against `surface-muted`.
- **Success (#2F6D3A):** Confirmation, completion, "saved." Pair with `on-primary` for filled states.
- **Danger (#B23A2A):** Destructive actions and validation errors. Pair with `on-primary` on fills.
- **Warning (#8C5A00):** Non-blocking cautions ("unsaved changes"). Pair with `on-primary` on fills.
- **Info (#1E5A8C):** Neutral informational states. Pair with `on-primary` on fills.
- **Focus Ring (#D89B5E):** A 2px outer ring on any keyboard-focused element. Never used as a fill.

Every text-over-background pair in this list meets WCAG AA 4.5:1 contrast: `text` on `surface` is ~17:1, `text-muted` on `surface` is ~6.8:1, `on-primary` on `primary` is ~6.5:1, `on-primary` on `success`/`danger`/`warning`/`info` all clear 4.5:1.

## Typography

Two families: **Inter** for the entire system, and **JetBrains Mono** for code, timestamps, and inline metadata. The hierarchy is built on weight contrast, not size explosion: only `display` and `headline-lg` are large.

- **display (48px / 600):** Reserved for the single hero phrase on a landing or empty-state view. One per page, maximum.
- **headline-lg (32px / 600):** Top-of-page titles inside the app.
- **headline-md (24px / 600):** Section titles within a page.
- **title-md (20px / 500):** Card titles, dialog titles.
- **body-lg (18px / 400):** Long-form reading copy. Use only inside a content column ≤ 72ch.
- **body-md (16px / 400):** The default for all UI prose, including form helper text.
- **body-sm (14px / 400):** Table cells, dense list rows.
- **label-md (14px / 500):** Button labels, form labels.
- **label-sm (12px / 500, +0.08em tracking):** Small caps for badges, tag chips, eyebrow labels. Author the text in lowercase and apply `text-transform: uppercase` at the component layer.
- **mono-sm (13px / 400):** Inline code, IDs, timestamps, monospace tabular numbers.

Body line length tops out at 72 characters. Never set `body-lg` outside a content column.

## Layout

Helios uses an **8px spacing grid with a 4px half-step** (`xs`) for icon-text alignment. Page gutters are 24px on small viewports and 32px from `md` up. The content column is `min(100% - 2*margin, 72ch)` for prose, and a 12-column grid with a 24px gutter for app layouts.

- Below 640px: single column, page padding 16px, vertical rhythm 16px between blocks.
- 640–1024px: two-column where applicable, gutter 24px.
- 1024px and up: 12-column grid, 24px gutter, 32px page margin, content centered with `max-width: 1200px`.

Components compose into "stacks" (vertical) and "rows" (horizontal). Inside any stack, vertical spacing is one of `sm`/`md`/`lg` only. Resist `xl` and above except between major sections.

## Elevation & Depth

Helios is a **flat** system. There are no shadows. Visual hierarchy is achieved by:

1. **Tonal layering:** `surface-muted` sits behind `surface` cards. The card "lifts" because it is brighter, not because it casts a shadow.
2. **Hairline borders:** `border` at 1px around cards, inputs, and table cells. `border-strong` only when the default disappears against `surface-muted`.
3. **Focus ring:** The 2px `focus-ring` outline at 2px offset is the *only* explicit depth signal we use; reserve it for keyboard focus.

If a designer is reaching for a shadow to separate two elements, the answer is: more whitespace, or one tonal step.

## Shapes

Corners are gently rounded. The scale is geometric, not playful:

- **xs (2px):** Inline chips inside text.
- **sm (4px):** Inputs nested inside another rounded surface.
- **md (8px):** Buttons, inputs, badges in the default flow.
- **lg (12px):** Cards, dialogs, popovers.
- **xl (16px):** The single hero card on a landing view.
- **full (9999px):** Pills, avatars, badges that wrap a numeric count.

Never mix radii within a composite component. A card uses `lg`, the buttons inside it use `md`.

## Components

Each component lists its slot values in the YAML front-matter. The prose below explains intent and the rules the front-matter cannot capture (especially borders, focus, and motion).

- **button-primary:** The single decisive action per view. Fill `primary`, text `on-primary`, radius `md`, height 40px. On hover apply `button-primary-hover`. On focus, render a 2px `focus-ring` outline at 2px offset. Never place two on the same view.
- **button-primary-hover:** Internal token; not a component you author directly. The visual state of `button-primary` on pointer hover or active press.
- **button-secondary:** The fallback companion to `button-primary` (e.g., "Cancel"). Fill `surface`, text `text`, radius `md`, 1px `border` outline.
- **button-ghost:** Tertiary navigation actions. No fill, no border, text `text`. Underline on hover at 1px from baseline. Use only inside dense rows (toolbars, table action menus).
- **input:** Fill `surface`, text `text`, radius `md`, 1px `border` outline, height 40px. Placeholder color is `text-muted`. On focus, the border becomes `primary` and the `focus-ring` outline appears.
- **card:** Fill `surface`, radius `lg`, 1px `border` outline, padding `lg`. Cards never have shadows. A "raised" card uses the `surface-muted` page band described in Elevation.
- **badge:** Fill `surface-muted`, text `text`, radius `full`, height 20px, padding `xs` (2px vertical, 6px horizontal). Use `label-sm` typography with uppercase.
- **badge-success / badge-danger / badge-warning / badge-info:** Status-colored badges. Each uses its named status fill (`success`, `danger`, `warning`, `info`) with `on-primary` text. Use sparingly — only when the status is the point of the row.
- **caption:** Helper text under a form field, image attribution, table footer notes. `text-muted` ink at `body-sm` size. Caption text never carries a primary action.

## Do's and Don'ts

- **Do** use exactly one `primary` button per view.
- **Don't** introduce a second accent color to differentiate destructive from primary — use `danger` only.
- **Do** prefer one tonal step (`surface-muted` band) over a shadow when separating regions.
- **Don't** use `text-muted` for a headline; muted text belongs to captions and metadata.
- **Do** wrap interactive elements in the 2px `focus-ring` outline on keyboard focus.
- **Don't** mix radii within a composite component. A card is `lg`, its inner buttons are `md`.
- **Do** set body copy at `body-md` and reserve `body-lg` for prose columns ≤ 72ch.
- **Don't** use `mono-sm` for prose. It is reserved for code, IDs, and tabular numerics.
- **Do** prefer whitespace over decoration. If two elements need separation, give them spacing first, a border second, and a shadow never.
- **Don't** apply `primary` to large background fills. It is an interaction color, not a brand banner.
