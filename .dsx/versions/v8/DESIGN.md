---
version: alpha
name: Web 2.0 Glassy Aqua
description: Bevelled blue gradient buttons, reflective gloss, the optimism of an iMac G5 ad.
colors:
  primary: "#2a7de1"
  primary-hover: "#1a5fb8"
  on-primary: "#ffffff"
  surface: "#f4f8fc"
  surface-muted: "#e1ebf5"
  text: "#0e2233"
  text-muted: "#5a6f82"
  border: "#b9cde0"
  border-strong: "#7c9bba"
  success: "#3aa657"
  danger: "#d23b3b"
  warning: "#f0a23a"
  info: "#2a7de1"
  focus-ring: "#7fbfff"
typography:
  display:
    fontFamily: Source Sans 3
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Source Sans 3
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Source Sans 3
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.005em
  title-md:
    fontFamily: Source Sans 3
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0em
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Source Sans 3
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: Source Sans 3
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Source Sans 3
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0.08em
  mono-sm:
    fontFamily: Source Code Pro
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

# Web 2.0 Glassy Aqua

## Overview

Bevelled blue gradient buttons, reflective gloss, the optimism of an iMac G5 ad. Inspired by Apple Aqua / early Basecamp / 2007 web buttons. This is one of 54 curated showcase variations spanning two decades of web/UI design vocabulary.

## Colors

- **Primary (#2a7de1):** The single decisive interaction color per view.
- **Primary Hover (#1a5fb8):** Pressed/hover state for primary.
- **On Primary (#ffffff):** Foreground on primary fills.
- **Surface (#f4f8fc):** Default page and card background.
- **Surface Muted (#e1ebf5):** Section bands and code blocks.
- **Text (#0e2233):** Body and heading copy.
- **Text Muted (#5a6f82):** Captions and metadata.
- **Border (#b9cde0):** Hairline between cards, inputs, rows.
- **Border Strong (#7c9bba):** Reinforced border on muted surfaces.
- **Success (#3aa657):** Confirmation and completion states.
- **Danger (#d23b3b):** Destructive actions and validation errors.
- **Warning (#f0a23a):** Non-blocking cautions.
- **Info (#2a7de1):** Neutral informational states.
- **Focus Ring (#7fbfff):** Keyboard focus indicator at 2px outer offset.

## Typography

Two families plus a monospace: **Source Sans 3** for display, headlines, and titles; **Source Sans 3** for body copy and labels; **Source Code Pro** for inline code, IDs, and tabular numerics. Display weight 700; body weight 400.

## Layout

Spacing follows a comfortable rhythm. Page gutter is 24px, page margin 32px. Vertical rhythm steps from xs (4px) through 3xl (64px). Body line length tops out at 72 characters.

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
