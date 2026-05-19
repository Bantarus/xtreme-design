---
version: alpha
name: Brutalist Concrete
description: Béton-brut London council estate — raw concrete gray, single orange caution stripe.
colors:
  primary: "#d35400"
  primary-hover: "#a8430a"
  on-primary: "#f5f3ee"
  surface: "#bdb8af"
  surface-muted: "#a59f94"
  text: "#1a1815"
  text-muted: "#4d4a44"
  border: "#86807a"
  border-strong: "#1a1815"
  success: "#5a7a3a"
  danger: "#a83a2a"
  warning: "#d35400"
  info: "#3a5a6a"
  focus-ring: "#d35400"
typography:
  display:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Anton
    fontSize: 24px
    fontWeight: 900
    lineHeight: 1.25
    letterSpacing: -0.005em
  title-md:
    fontFamily: Anton
    fontSize: 20px
    fontWeight: 900
    lineHeight: 1.3
    letterSpacing: 0em
  body-lg:
    fontFamily: Barlow
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: Barlow
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Barlow
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: Barlow
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Barlow
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0.08em
  mono-sm:
    fontFamily: Roboto Mono
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

# Brutalist Concrete

## Overview

Béton-brut London council estate — raw concrete gray, single orange caution stripe. Inspired by Le Corbusier / Trellick Tower / Barbican. This is one of 54 curated showcase variations spanning two decades of web/UI design vocabulary.

## Colors

- **Primary (#d35400):** The single decisive interaction color per view.
- **Primary Hover (#a8430a):** Pressed/hover state for primary.
- **On Primary (#f5f3ee):** Foreground on primary fills.
- **Surface (#bdb8af):** Default page and card background.
- **Surface Muted (#a59f94):** Section bands and code blocks.
- **Text (#1a1815):** Body and heading copy.
- **Text Muted (#4d4a44):** Captions and metadata.
- **Border (#86807a):** Hairline between cards, inputs, rows.
- **Border Strong (#1a1815):** Reinforced border on muted surfaces.
- **Success (#5a7a3a):** Confirmation and completion states.
- **Danger (#a83a2a):** Destructive actions and validation errors.
- **Warning (#d35400):** Non-blocking cautions.
- **Info (#3a5a6a):** Neutral informational states.
- **Focus Ring (#d35400):** Keyboard focus indicator at 2px outer offset.

## Typography

Two families plus a monospace: **Anton** for display, headlines, and titles; **Barlow** for body copy and labels; **Roboto Mono** for inline code, IDs, and tabular numerics. Display weight 900; body weight 400.

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
