---
version: alpha
name: Metro Tile
description: Windows 8 live-tile grid — saturated rectangles, no rounding, Segoe-coded confidence.
colors:
  primary: "#0078d7"
  primary-hover: "#005a9e"
  on-primary: "#ffffff"
  surface: "#ffffff"
  surface-muted: "#f3f2f1"
  text: "#000000"
  text-muted: "#605e5c"
  border: "#edebe9"
  border-strong: "#a19f9d"
  success: "#107c10"
  danger: "#d13438"
  warning: "#ffaa44"
  info: "#0078d7"
  focus-ring: "#0078d7"
typography:
  display:
    fontFamily: Open Sans
    fontSize: 48px
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Open Sans
    fontSize: 32px
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Open Sans
    fontSize: 24px
    fontWeight: 300
    lineHeight: 1.25
    letterSpacing: -0.005em
  title-md:
    fontFamily: Open Sans
    fontSize: 20px
    fontWeight: 300
    lineHeight: 1.3
    letterSpacing: 0em
  body-lg:
    fontFamily: Open Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: Open Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Open Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: Open Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Open Sans
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: 0.08em
  mono-sm:
    fontFamily: Consolas
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
  xs: 4px
  sm: 6px
  md: 12px
  lg: 20px
  xl: 28px
  2xl: 40px
  3xl: 56px
  gutter: 20px
  margin: 24px
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

# Metro Tile

## Overview

Windows 8 live-tile grid — saturated rectangles, no rounding, Segoe-coded confidence. Inspired by Microsoft Metro / Windows Phone 7. This is one of 54 curated showcase variations spanning two decades of web/UI design vocabulary.

## Colors

- **Primary (#0078d7):** The single decisive interaction color per view.
- **Primary Hover (#005a9e):** Pressed/hover state for primary.
- **On Primary (#ffffff):** Foreground on primary fills.
- **Surface (#ffffff):** Default page and card background.
- **Surface Muted (#f3f2f1):** Section bands and code blocks.
- **Text (#000000):** Body and heading copy.
- **Text Muted (#605e5c):** Captions and metadata.
- **Border (#edebe9):** Hairline between cards, inputs, rows.
- **Border Strong (#a19f9d):** Reinforced border on muted surfaces.
- **Success (#107c10):** Confirmation and completion states.
- **Danger (#d13438):** Destructive actions and validation errors.
- **Warning (#ffaa44):** Non-blocking cautions.
- **Info (#0078d7):** Neutral informational states.
- **Focus Ring (#0078d7):** Keyboard focus indicator at 2px outer offset.

## Typography

Two families plus a monospace: **Open Sans** for display, headlines, and titles; **Open Sans** for body copy and labels; **Consolas** for inline code, IDs, and tabular numerics. Display weight 300; body weight 400.

## Layout

Spacing follows a dense rhythm. Page gutter is 20px, page margin 24px. Vertical rhythm steps from xs (4px) through 3xl (56px). Body line length tops out at 72 characters.

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
