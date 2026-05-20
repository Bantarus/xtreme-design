---
version: alpha
name: Blackletter Manuscript
description: Illuminated codex — sepia ink on parchment, rubric scarlet for primary, gold leaf accents. Unmistakably 14th-century.
colors:
  primary: "#8b1a1a"
  primary-hover: "#6b0f0f"
  on-primary: "#f6efd9"
  surface: "#f6efd9"
  surface-muted: "#e9dec1"
  text: "#1f1810"
  text-muted: "#5e503e"
  border: "#c9b890"
  border-strong: "#1f1810"
  success: "#3d5a2c"
  danger: "#8b1a1a"
  warning: "#b89238"
  info: "#3a5172"
  focus-ring: "#b89238"
typography:
  display:
    fontFamily: UnifrakturCook
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0em
  headline-lg:
    fontFamily: UnifrakturCook
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: 0em
  headline-md:
    fontFamily: UnifrakturCook
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0em
  title-md:
    fontFamily: UnifrakturCook
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0em
  body-lg:
    fontFamily: IM Fell DW Pica
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: IM Fell DW Pica
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: IM Fell DW Pica
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: IM Fell DW Pica
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: 0.02em
  label-sm:
    fontFamily: IM Fell DW Pica
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0.1em
  mono-sm:
    fontFamily: Special Elite
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
rounded:
  xs: 0px
  sm: 0px
  md: 0px
  lg: 0px
  xl: 0px
  full: 9999px
spacing:
  xs: 6px
  sm: 12px
  md: 20px
  lg: 32px
  xl: 48px
  2xl: 72px
  3xl: 96px
  gutter: 32px
  margin: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: 44px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: 44px
  button-ghost:
    textColor: "{colors.text}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: 44px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
    height: 44px
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
    height: 22px
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    height: 22px
  badge-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    height: 22px
  badge-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.text}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    height: 22px
  badge-info:
    backgroundColor: "{colors.info}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    height: 22px
  caption:
    textColor: "{colors.text-muted}"
    typography: "{typography.body-sm}"
---

# Blackletter Manuscript

## Overview

Illuminated codex — sepia ink on parchment, rubric scarlet for primary actions, gold leaf for emphasis. Every label is hand-lettered in a 14th-century Gothic textura. Designed as a recognition target: when this variant is active, you should feel it immediately.

## Colors

- **Primary (#8b1a1a):** Rubric scarlet — the historical color for chapter headings and primary actions.
- **Primary Hover (#6b0f0f):** Dried-blood, the pressed state of a rubric.
- **On Primary (#f6efd9):** Parchment cream, the foreground on filled rubric backgrounds.
- **Surface (#f6efd9):** Parchment cream, the default page and card background.
- **Surface Muted (#e9dec1):** Aged parchment, for section bands and code blocks.
- **Text (#1f1810):** Sepia ink, body and heading copy.
- **Text Muted (#5e503e):** Faded ink, captions and metadata.
- **Border (#c9b890):** Vellum hairline.
- **Border Strong (#1f1810):** Sepia ink at full strength, used for emphasis lines.
- **Success (#3d5a2c):** Forest green — same green that decorated medieval marginalia.
- **Danger (#8b1a1a):** Rubric scarlet, doubled with primary by design.
- **Warning (#b89238):** Gold leaf, the illuminator's accent.
- **Info (#3a5172):** Cathedral blue from a Book of Hours.
- **Focus Ring (#b89238):** Gold leaf, 2px outer offset.

## Typography

Three families. **UnifrakturCook** for display, headlines, and titles — a sharpened blackletter that stays legible at 22-56px. **IM Fell DW Pica** for body and labels — a 17th-century roman cut by John Fell, with period character and warm rough edges. **Special Elite** for monospaced numerics and code — a typewriter face with weight and grit.

## Layout

Generous airy rhythm. Page gutter 32px, page margin 48px. Vertical rhythm steps from xs (6px) through 3xl (96px). Body line length tops out at 64 characters because blackletter and period roman benefit from shorter measure.

## Elevation & Depth

Flat. Hierarchy comes from tonal layering (surface-muted band behind surface), 1px borders, and the rubric color. No shadows — the manuscript is on a flat desk.

## Shapes

All radii are 0px except `full` (which stays 9999px for badges and avatars). The medieval grid is hard-edged. Pills exist only for status badges.

## Components

- **button-primary:** The single rubric action per view. Fill `primary`, text `on-primary`, sharp corners.
- **button-primary-hover:** Visual state of primary on pointer hover or active press.
- **button-secondary:** Companion to primary. Fill `surface`, text `text`, 1px `border` outline.
- **button-ghost:** Tertiary navigation actions. No fill, no border.
- **input:** Fill `surface`, 1px `border` outline, height 44px.
- **card:** Fill `surface`, sharp corners, 1px `border` outline.
- **badge:** Fill `surface-muted`, radius `full`, height 22px.
- **badge-success / badge-danger / badge-warning / badge-info:** Status-colored tags. Warning uses dark text on gold leaf for legibility.
- **caption:** Helper text and metadata rendered in `text-muted`.

## Do's and Don'ts

- **Do** use exactly one rubric (`primary`) button per view.
- **Don't** mix rubric and danger — they're the same hue and that's the point.
- **Do** prefer one tonal step (`surface-muted` band) over a shadow when separating regions.
- **Don't** use `text-muted` for a headline; sepia ink needs full strength to read at scale.
- **Do** wrap interactive elements in the `focus-ring` outline on keyboard focus.
- **Don't** round corners. The manuscript grid is hard-edged.
