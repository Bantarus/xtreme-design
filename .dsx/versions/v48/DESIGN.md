---
version: alpha
name: Valorant Tactical
description: Spike-plant red on charcoal, sharp angled chamfers, esports HUD authority.
colors:
  primary: "#ff4655"
  primary-hover: "#d6303f"
  on-primary: "#ece8e1"
  surface: "#0f1923"
  surface-muted: "#1a2734"
  text: "#ece8e1"
  text-muted: "#8b9099"
  border: "#283b4f"
  border-strong: "#ff4655"
  success: "#7be59c"
  danger: "#ff4655"
  warning: "#ffcc4d"
  info: "#5cc8e8"
  focus-ring: "#ff4655"
typography:
  display:
    fontFamily: Tungsten
    fontSize: 48px
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Tungsten
    fontSize: 32px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Tungsten
    fontSize: 24px
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: -0.005em
  title-md:
    fontFamily: Tungsten
    fontSize: 20px
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: 0em
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.01em
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0.08em
  mono-sm:
    fontFamily: Share Tech Mono
    fontSize: 13px
    fontWeight: 500
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

# Valorant Tactical

## Overview

Spike-plant red on charcoal, sharp angled chamfers, esports HUD authority. Inspired by Riot VALORANT UI / Steam Big Picture. This is one of 54 curated showcase variations spanning two decades of web/UI design vocabulary.

## Colors

- **Primary (#ff4655):** The single decisive interaction color per view.
- **Primary Hover (#d6303f):** Pressed/hover state for primary.
- **On Primary (#ece8e1):** Foreground on primary fills.
- **Surface (#0f1923):** Default page and card background.
- **Surface Muted (#1a2734):** Section bands and code blocks.
- **Text (#ece8e1):** Body and heading copy.
- **Text Muted (#8b9099):** Captions and metadata.
- **Border (#283b4f):** Hairline between cards, inputs, rows.
- **Border Strong (#ff4655):** Reinforced border on muted surfaces.
- **Success (#7be59c):** Confirmation and completion states.
- **Danger (#ff4655):** Destructive actions and validation errors.
- **Warning (#ffcc4d):** Non-blocking cautions.
- **Info (#5cc8e8):** Neutral informational states.
- **Focus Ring (#ff4655):** Keyboard focus indicator at 2px outer offset.

## Typography

Two families plus a monospace: **Tungsten** for display, headlines, and titles; **DM Sans** for body copy and labels; **Share Tech Mono** for inline code, IDs, and tabular numerics. Display weight 800; body weight 500.

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
