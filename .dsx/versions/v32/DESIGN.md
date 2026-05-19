---
version: alpha
name: AI Mesh Gradient
description: 2024 AI-tool landing page — soft mesh blur, lavender + peach + cyan haze, OpenAI-meets-Linear.
colors:
  primary: "#a37bff"
  primary-hover: "#7e58e6"
  on-primary: "#ffffff"
  surface: "#fafafd"
  surface-muted: "#f0eef8"
  text: "#0f0e17"
  text-muted: "#5b5870"
  border: "#e6e3f0"
  border-strong: "#b8b0d4"
  success: "#4dd4ac"
  danger: "#ff6b8b"
  warning: "#ffb74a"
  info: "#5cc6e8"
  focus-ring: "#a37bff"
typography:
  display:
    fontFamily: Söhne
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Söhne
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Söhne
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.005em
  title-md:
    fontFamily: Söhne
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: 0.08em
  mono-sm:
    fontFamily: Berkeley Mono
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

# AI Mesh Gradient

## Overview

2024 AI-tool landing page — soft mesh blur, lavender + peach + cyan haze, OpenAI-meets-Linear. Inspired by OpenAI / Anthropic / Perplexity 2024 landings. This is one of 54 curated showcase variations spanning two decades of web/UI design vocabulary.

## Colors

- **Primary (#a37bff):** The single decisive interaction color per view.
- **Primary Hover (#7e58e6):** Pressed/hover state for primary.
- **On Primary (#ffffff):** Foreground on primary fills.
- **Surface (#fafafd):** Default page and card background.
- **Surface Muted (#f0eef8):** Section bands and code blocks.
- **Text (#0f0e17):** Body and heading copy.
- **Text Muted (#5b5870):** Captions and metadata.
- **Border (#e6e3f0):** Hairline between cards, inputs, rows.
- **Border Strong (#b8b0d4):** Reinforced border on muted surfaces.
- **Success (#4dd4ac):** Confirmation and completion states.
- **Danger (#ff6b8b):** Destructive actions and validation errors.
- **Warning (#ffb74a):** Non-blocking cautions.
- **Info (#5cc6e8):** Neutral informational states.
- **Focus Ring (#a37bff):** Keyboard focus indicator at 2px outer offset.

## Typography

Two families plus a monospace: **Söhne** for display, headlines, and titles; **Inter** for body copy and labels; **Berkeley Mono** for inline code, IDs, and tabular numerics. Display weight 500; body weight 400.

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
