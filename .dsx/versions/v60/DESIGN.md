---
version: alpha
name: Crayon Storybook
description: Eric Carle hungry-caterpillar crayon — primary sun-yellow on construction-paper cream.
colors:
  primary: "#ff9f1c"
  primary-hover: "#d97a0a"
  on-primary: "#2a1a08"
  surface: "#fdf4d5"
  surface-muted: "#f4e5b0"
  text: "#2a1a08"
  text-muted: "#6a4e2a"
  border: "#e6c870"
  border-strong: "#2a1a08"
  success: "#2ec4b6"
  danger: "#e71d36"
  warning: "#ff9f1c"
  info: "#5b8def"
  focus-ring: "#e71d36"
typography:
  display:
    fontFamily: Caveat Brush
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Caveat Brush
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Caveat Brush
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.005em
  title-md:
    fontFamily: Caveat Brush
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0em
  body-lg:
    fontFamily: Quicksand
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Quicksand
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: Quicksand
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Quicksand
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0.08em
  mono-sm:
    fontFamily: Cutive Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: 0em
rounded:
  xs: 4px
  sm: 8px
  md: 14px
  lg: 20px
  xl: 28px
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

# Crayon Storybook

## Overview

Eric Carle hungry-caterpillar crayon — primary sun-yellow on construction-paper cream. Inspired by Eric Carle / Sesame Street / children's picture books. This is one of 54 curated showcase variations spanning two decades of web/UI design vocabulary.

## Colors

- **Primary (#ff9f1c):** The single decisive interaction color per view.
- **Primary Hover (#d97a0a):** Pressed/hover state for primary.
- **On Primary (#2a1a08):** Foreground on primary fills.
- **Surface (#fdf4d5):** Default page and card background.
- **Surface Muted (#f4e5b0):** Section bands and code blocks.
- **Text (#2a1a08):** Body and heading copy.
- **Text Muted (#6a4e2a):** Captions and metadata.
- **Border (#e6c870):** Hairline between cards, inputs, rows.
- **Border Strong (#2a1a08):** Reinforced border on muted surfaces.
- **Success (#2ec4b6):** Confirmation and completion states.
- **Danger (#e71d36):** Destructive actions and validation errors.
- **Warning (#ff9f1c):** Non-blocking cautions.
- **Info (#5b8def):** Neutral informational states.
- **Focus Ring (#e71d36):** Keyboard focus indicator at 2px outer offset.

## Typography

Two families plus a monospace: **Caveat Brush** for display, headlines, and titles; **Quicksand** for body copy and labels; **Cutive Mono** for inline code, IDs, and tabular numerics. Display weight 700; body weight 500.

## Layout

Spacing follows a comfortable rhythm. Page gutter is 24px, page margin 32px. Vertical rhythm steps from xs (4px) through 3xl (64px). Body line length tops out at 72 characters.

## Elevation & Depth

Flat by default. Hierarchy comes from tonal layering (surface-muted behind surface), 1px borders, and the focus ring. Prefer whitespace before a border, and a border before a shadow.

## Shapes

Corners follow a pillowy scale: md (14px) for buttons and inputs, lg (20px) for cards, full (9999px) for pills and avatars. Never mix radii within a composite component.

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
