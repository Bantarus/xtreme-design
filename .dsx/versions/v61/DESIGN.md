---
version: alpha
name: Japanese Minimal Ink
description: Muji-coded sumi-e — single vermilion seal on washi paper, generous negative space.
colors:
  primary: "#c1272d"
  primary-hover: "#931d22"
  on-primary: "#fbfaf6"
  surface: "#fbfaf6"
  surface-muted: "#efece2"
  text: "#1a1a1a"
  text-muted: "#6a6a6a"
  border: "#d6d2c4"
  border-strong: "#1a1a1a"
  success: "#3a6a3a"
  danger: "#c1272d"
  warning: "#c98a1c"
  info: "#2a4a6a"
  focus-ring: "#c1272d"
typography:
  display:
    fontFamily: Shippori Mincho
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Shippori Mincho
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Shippori Mincho
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.005em
  title-md:
    fontFamily: Shippori Mincho
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0em
  body-lg:
    fontFamily: Noto Sans JP
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Noto Sans JP
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: Noto Sans JP
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Noto Sans JP
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
  xs: 0px
  sm: 0px
  md: 2px
  lg: 4px
  xl: 6px
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

# Japanese Minimal Ink

## Overview

Muji-coded sumi-e — single vermilion seal on washi paper, generous negative space. Inspired by Muji / Kenya Hara / sumi-e ink wash. This is one of 54 curated showcase variations spanning two decades of web/UI design vocabulary.

## Colors

- **Primary (#c1272d):** The single decisive interaction color per view.
- **Primary Hover (#931d22):** Pressed/hover state for primary.
- **On Primary (#fbfaf6):** Foreground on primary fills.
- **Surface (#fbfaf6):** Default page and card background.
- **Surface Muted (#efece2):** Section bands and code blocks.
- **Text (#1a1a1a):** Body and heading copy.
- **Text Muted (#6a6a6a):** Captions and metadata.
- **Border (#d6d2c4):** Hairline between cards, inputs, rows.
- **Border Strong (#1a1a1a):** Reinforced border on muted surfaces.
- **Success (#3a6a3a):** Confirmation and completion states.
- **Danger (#c1272d):** Destructive actions and validation errors.
- **Warning (#c98a1c):** Non-blocking cautions.
- **Info (#2a4a6a):** Neutral informational states.
- **Focus Ring (#c1272d):** Keyboard focus indicator at 2px outer offset.

## Typography

Two families plus a monospace: **Shippori Mincho** for display, headlines, and titles; **Noto Sans JP** for body copy and labels; **JetBrains Mono** for inline code, IDs, and tabular numerics. Display weight 500; body weight 400.

## Layout

Spacing follows a airy rhythm. Page gutter is 32px, page margin 40px. Vertical rhythm steps from xs (6px) through 3xl (88px). Body line length tops out at 72 characters.

## Elevation & Depth

Flat by default. Hierarchy comes from tonal layering (surface-muted behind surface), 1px borders, and the focus ring. Prefer whitespace before a border, and a border before a shadow.

## Shapes

Corners follow a sharp scale: md (2px) for buttons and inputs, lg (4px) for cards, full (9999px) for pills and avatars. Never mix radii within a composite component.

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
