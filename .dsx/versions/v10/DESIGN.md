---
version: alpha
name: Frutiger Aero Cloud
description: Bright blue skies, frosted glass orbs, tropical-fish optimism of Windows Vista.
colors:
  primary: "#0689e4"
  primary-hover: "#0567b3"
  on-primary: "#ffffff"
  surface: "#eaf6fd"
  surface-muted: "#cfe7f7"
  text: "#0b2a3f"
  text-muted: "#446b85"
  border: "#a6d2ec"
  border-strong: "#5fa6cf"
  success: "#71ab23"
  danger: "#e63a3a"
  warning: "#fbb905"
  info: "#0032db"
  focus-ring: "#0032db"
typography:
  display:
    fontFamily: Nunito
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Nunito
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Nunito
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.005em
  title-md:
    fontFamily: Nunito
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0em
  body-lg:
    fontFamily: Nunito
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: Nunito
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Nunito
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: Nunito
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Nunito
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0.08em
  mono-sm:
    fontFamily: Roboto Mono
    fontSize: 13px
    fontWeight: 400
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

# Frutiger Aero Cloud

## Overview

Bright blue skies, frosted glass orbs, tropical-fish optimism of Windows Vista. Inspired by Windows Vista / Sony Walkman 2007 / Frutiger Aero. This is one of 54 curated showcase variations spanning two decades of web/UI design vocabulary.

## Colors

- **Primary (#0689e4):** The single decisive interaction color per view.
- **Primary Hover (#0567b3):** Pressed/hover state for primary.
- **On Primary (#ffffff):** Foreground on primary fills.
- **Surface (#eaf6fd):** Default page and card background.
- **Surface Muted (#cfe7f7):** Section bands and code blocks.
- **Text (#0b2a3f):** Body and heading copy.
- **Text Muted (#446b85):** Captions and metadata.
- **Border (#a6d2ec):** Hairline between cards, inputs, rows.
- **Border Strong (#5fa6cf):** Reinforced border on muted surfaces.
- **Success (#71ab23):** Confirmation and completion states.
- **Danger (#e63a3a):** Destructive actions and validation errors.
- **Warning (#fbb905):** Non-blocking cautions.
- **Info (#0032db):** Neutral informational states.
- **Focus Ring (#0032db):** Keyboard focus indicator at 2px outer offset.

## Typography

Two families plus a monospace: **Nunito** for display, headlines, and titles; **Nunito** for body copy and labels; **Roboto Mono** for inline code, IDs, and tabular numerics. Display weight 700; body weight 400.

## Layout

Spacing follows a airy rhythm. Page gutter is 32px, page margin 40px. Vertical rhythm steps from xs (6px) through 3xl (88px). Body line length tops out at 72 characters.

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
