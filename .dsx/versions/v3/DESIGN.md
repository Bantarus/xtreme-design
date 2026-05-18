---
version: alpha
name: Camping-Gear-Co
description: Darker, rugged take on the camping store — Workshop Navy near-black, graphite-cream canvas, tightened corners. Less corporate, more workshop.
colors:
  primary: "#0d1d28"
  primary-hover: "#000000"
  on-primary: "#FFFFFF"
  surface: "#d9d2c1"
  surface-muted: "#b9b1a0"
  text: "#0a0907"
  text-muted: "#5e554a"
  border: "#cdc3ad"
  border-strong: "#a89c80"
  success: "#2e6b40"
  danger: "#a8351e"
  warning: "#c45a14"
  info: "#1b3a4b"
  focus-ring: "#f08a3e"
typography:
  display:
    fontFamily: Source Sans 3
    fontSize: 44px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Source Sans 3
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Source Sans 3
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
  title-md:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: Source Sans 3
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: Source Sans 3
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
  label-sm:
    fontFamily: Source Sans 3
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0.08em
  mono-sm:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  xs: 2px
  sm: 4px
  md: 4px
  lg: 6px
  xl: 14px
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

# Camping Gear Co

## Overview

A working storefront for an outdoorsy brand. The product moves real things — tents, climbing rope, replacement carabiners. Trust and shipping legibility outrank novelty. Surfaces feel like kraft paper.

## Colors

- **Primary (#1b3a4b, "Workshop Navy"):** Header, primary CTAs.
- **Focus Ring (#f08a3e, "Safety Orange"):** Tracking states and focus only.

## Typography

Source Sans 3 across the board.

## Layout

8-pt grid, 24px gutter.

## Elevation & Depth

Flat. One whispered shadow on the sticky add-to-cart bar.

## Shapes

Tight 6–10px radii.

## Components

button-primary is Workshop Navy. badge-warning is the tracking-in-transit chip.

## Do's and Don'ts

- Do make the price loud.
- Don't use Safety Orange anywhere except tracking and focus.
