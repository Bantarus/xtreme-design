---
version: alpha
name: Brutalist Web Mono
description: Default-browser ugly on purpose — Times serif, lime link, no styles, all caps menus.
colors:
  primary: "#0000ee"
  primary-hover: "#551a8b"
  on-primary: "#ffffff"
  surface: "#ffffff"
  surface-muted: "#f0f0f0"
  text: "#000000"
  text-muted: "#333333"
  border: "#000000"
  border-strong: "#000000"
  success: "#00aa00"
  danger: "#ee0000"
  warning: "#ee9900"
  info: "#0000ee"
  focus-ring: "#ccff00"
typography:
  display:
    fontFamily: Times New Roman
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Times New Roman
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Times New Roman
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.005em
  title-md:
    fontFamily: Times New Roman
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0em
  body-lg:
    fontFamily: Times New Roman
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: Times New Roman
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Times New Roman
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: Times New Roman
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Times New Roman
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0.08em
  mono-sm:
    fontFamily: Courier Prime
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

# Brutalist Web Mono

## Overview

Default-browser ugly on purpose — Times serif, lime link, no styles, all caps menus. Inspired by Brutalist Websites 2016 / Bloomberg Businessweek 2017. This is one of 54 curated showcase variations spanning two decades of web/UI design vocabulary.

## Colors

- **Primary (#0000ee):** The single decisive interaction color per view.
- **Primary Hover (#551a8b):** Pressed/hover state for primary.
- **On Primary (#ffffff):** Foreground on primary fills.
- **Surface (#ffffff):** Default page and card background.
- **Surface Muted (#f0f0f0):** Section bands and code blocks.
- **Text (#000000):** Body and heading copy.
- **Text Muted (#333333):** Captions and metadata.
- **Border (#000000):** Hairline between cards, inputs, rows.
- **Border Strong (#000000):** Reinforced border on muted surfaces.
- **Success (#00aa00):** Confirmation and completion states.
- **Danger (#ee0000):** Destructive actions and validation errors.
- **Warning (#ee9900):** Non-blocking cautions.
- **Info (#0000ee):** Neutral informational states.
- **Focus Ring (#ccff00):** Keyboard focus indicator at 2px outer offset.

## Typography

Two families plus a monospace: **Times New Roman** for display, headlines, and titles; **Times New Roman** for body copy and labels; **Courier Prime** for inline code, IDs, and tabular numerics. Display weight 700; body weight 400.

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
