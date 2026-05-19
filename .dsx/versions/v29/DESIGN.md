---
version: alpha
name: Geist Monochrome
description: Vercel Geist — pure-black on pure-white, monospaced numerics, deploy-now restraint.
colors:
  primary: "#000000"
  primary-hover: "#171717"
  on-primary: "#ffffff"
  surface: "#ffffff"
  surface-muted: "#fafafa"
  text: "#0a0a0a"
  text-muted: "#737373"
  border: "#eaeaea"
  border-strong: "#a3a3a3"
  success: "#0070f3"
  danger: "#e00000"
  warning: "#f5a623"
  info: "#0070f3"
  focus-ring: "#0070f3"
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.005em
  title-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: 0.08em
  mono-sm:
    fontFamily: Geist Mono
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

# Geist Monochrome

## Overview

Vercel Geist — pure-black on pure-white, monospaced numerics, deploy-now restraint. Inspired by Vercel Geist. This is one of 54 curated showcase variations spanning two decades of web/UI design vocabulary.

## Colors

- **Primary (#000000):** The single decisive interaction color per view.
- **Primary Hover (#171717):** Pressed/hover state for primary.
- **On Primary (#ffffff):** Foreground on primary fills.
- **Surface (#ffffff):** Default page and card background.
- **Surface Muted (#fafafa):** Section bands and code blocks.
- **Text (#0a0a0a):** Body and heading copy.
- **Text Muted (#737373):** Captions and metadata.
- **Border (#eaeaea):** Hairline between cards, inputs, rows.
- **Border Strong (#a3a3a3):** Reinforced border on muted surfaces.
- **Success (#0070f3):** Confirmation and completion states.
- **Danger (#e00000):** Destructive actions and validation errors.
- **Warning (#f5a623):** Non-blocking cautions.
- **Info (#0070f3):** Neutral informational states.
- **Focus Ring (#0070f3):** Keyboard focus indicator at 2px outer offset.

## Typography

Two families plus a monospace: **Geist** for display, headlines, and titles; **Geist** for body copy and labels; **Geist Mono** for inline code, IDs, and tabular numerics. Display weight 600; body weight 400.

## Layout

Spacing follows a comfortable rhythm. Page gutter is 24px, page margin 32px. Vertical rhythm steps from xs (4px) through 3xl (64px). Body line length tops out at 72 characters.

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
