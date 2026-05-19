---
version: alpha
name: Cottagecore Mauve
description: Pressed-flower mauve and sage, hand-lettered headings, cottage-windowsill-at-dusk.
colors:
  primary: "#a36d6d"
  primary-hover: "#7e4c4c"
  on-primary: "#fbf7f1"
  surface: "#fbf7f1"
  surface-muted: "#ede4d3"
  text: "#3a2a2a"
  text-muted: "#7a6863"
  border: "#d8c6b8"
  border-strong: "#a36d6d"
  success: "#7a8f6a"
  danger: "#a8473a"
  warning: "#c98a4a"
  info: "#6a8a9a"
  focus-ring: "#a36d6d"
typography:
  display:
    fontFamily: Cormorant Garamond
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Cormorant Garamond
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Cormorant Garamond
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.005em
  title-md:
    fontFamily: Cormorant Garamond
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0em
  body-lg:
    fontFamily: Lora
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: Lora
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Lora
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: Lora
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Lora
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: 0.08em
  mono-sm:
    fontFamily: Cutive Mono
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
  xs: 6px
  sm: 10px
  md: 20px
  lg: 32px
  xl: 48px
  2xl: 64px
  3xl: 88px
  gutter: 32px
  margin: 40px
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

# Cottagecore Mauve

## Overview

Pressed-flower mauve and sage, hand-lettered headings, cottage-windowsill-at-dusk. Inspired by Cottagecore TikTok aesthetic / Beatrix Potter. This is one of 54 curated showcase variations spanning two decades of web/UI design vocabulary.

## Colors

- **Primary (#a36d6d):** The single decisive interaction color per view.
- **Primary Hover (#7e4c4c):** Pressed/hover state for primary.
- **On Primary (#fbf7f1):** Foreground on primary fills.
- **Surface (#fbf7f1):** Default page and card background.
- **Surface Muted (#ede4d3):** Section bands and code blocks.
- **Text (#3a2a2a):** Body and heading copy.
- **Text Muted (#7a6863):** Captions and metadata.
- **Border (#d8c6b8):** Hairline between cards, inputs, rows.
- **Border Strong (#a36d6d):** Reinforced border on muted surfaces.
- **Success (#7a8f6a):** Confirmation and completion states.
- **Danger (#a8473a):** Destructive actions and validation errors.
- **Warning (#c98a4a):** Non-blocking cautions.
- **Info (#6a8a9a):** Neutral informational states.
- **Focus Ring (#a36d6d):** Keyboard focus indicator at 2px outer offset.

## Typography

Two families plus a monospace: **Cormorant Garamond** for display, headlines, and titles; **Lora** for body copy and labels; **Cutive Mono** for inline code, IDs, and tabular numerics. Display weight 500; body weight 400.

## Layout

Spacing follows a airy rhythm. Page gutter is 32px, page margin 40px. Vertical rhythm steps from xs (6px) through 3xl (88px). Body line length tops out at 72 characters.

## Elevation & Depth

Flat by default. Hierarchy comes from tonal layering (surface-muted behind surface), 1px borders, and the focus ring. Prefer whitespace before a border, and a border before a shadow.

## Shapes

Corners follow a soft scale: md (8px) for buttons and inputs, lg (12px) for cards, full (9999px) for pills and avatars. Never mix radii within a composite component.

## Components

- **button-primary:** The single decisive action per view. Fill `primary`, text `on-primary`, radius `md`.
- **button-primary-hover:** Internal token. Visual state of primary on pointer hover or active press.
- **button-secondary:** Companion to primary. Fill `surface`, text `text`, 1px `border` outline.
- **button-ghost:** Tertiary navigation actions. No fill, no border.
- **input:** Fill `surface`, 1px `border` outline, height 40px.
- **card:** Fill `surface`, radius `lg`, 1px `border` outline.
- **badge:** Fill `surface-muted`, radius `full`, height 20px. Uppercase label.
- **badge-success / badge-danger / badge-warning / badge-info:** Status-colored tags.
- **caption:** Helper text and metadata rendered in `text-muted`.

## Do's and Don'ts

- **Do** use exactly one `primary` button per view.
- **Don't** introduce a second accent color to differentiate destructive from primary — use `danger`.
- **Do** prefer one tonal step (`surface-muted` band) over a shadow when separating regions.
- **Don't** use `text-muted` for a headline.
- **Do** wrap interactive elements in the `focus-ring` outline on keyboard focus.
- **Don't** mix radii within a composite component.
