---
version: alpha
name: ecommerce-shipping
description: Outdoorsy / logistics-flavored ecommerce DESIGN.md. Trusted, weatherproof, "this gets to you tomorrow" energy. Honest sans-serif type, kraft-paper canvas, dependable navy primary with a single safety-orange accent for tracking states. Use when the brief mentions shipping, outdoor gear, sporting goods, hardware, tools, or logistics-heavy commerce.
keywords:
  - ecommerce
  - shipping
  - outdoorsy
  - rugged
  - trustworthy
  - logistics
  - storefront
  - cart
  - delivery
  - camping
  - hardware
  - dependable
  - safety-orange
  - kraft
colors:
  primary: "#1b3a4b"
  primary-hover: "#122735"
  on-primary: "#FFFFFF"
  surface: "#f7f1e7"
  surface-muted: "#ece4d3"
  text: "#1a1815"
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
  headline-md:
    fontFamily: Source Sans 3
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.3
  title-md:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
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
  md: 6px
  lg: 10px
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
---

# ecommerce-shipping

## Overview

A working storefront for an outdoorsy or logistics-heavy brand. The product moves physical things: tents, climbing gear, hand tools, replacement parts. Trust, clarity, and shipping legibility outrank novelty. Surfaces feel like kraft paper. CTAs feel like a stamped barcode label — short, blunt, accountable.

## Colors

- **Primary (#1b3a4b, "Workshop Navy"):** Header, primary CTAs, link emphasis. The "we are open" sign.
- **Surface (#f7f1e7, "Kraft"):** The page background. Warmer than white; cheaper than cream.
- **Focus Ring (#f08a3e, "Safety Orange"):** Tracking states, in-transit badges, focus rings. Never decorative.

## Typography

Source Sans 3 across the board. Bold for navigation and prices; regular for everything else. Tabular figures on prices and tracking numbers. IBM Plex Mono for SKU codes and order IDs.

## Layout

8-pt grid, page max-width 1200px, gutter 24px. Product grids prefer 4 columns at desktop. Cart drawer is a right-attached sheet, not a modal.

## Elevation & Depth

Mostly flat. A whispered shadow on the sticky add-to-cart bar. Cards lean on the kraft-vs-card tonal step, not depth.

## Shapes

6–10px radii. Tight enough to feel manufactured; not pillowed.

## Components

- **button-primary:** Workshop Navy fill, white text, 6px radius, 44px height. One per view.
- **button-secondary:** Surface fill, navy text, 1px navy border.
- **badge-tracking:** Safety Orange fill, white text, full-pill — only for in-transit / delayed.
- **card:** Surface fill, 10px radius, hairline border. No shadow.

## Do's and Don'ts

- **Do** make the price the loudest element on the product card.
- **Don't** use Safety Orange anywhere except tracking and focus states.
- **Do** keep shipping copy honest: "Ships within 24 hours" beats "Free shipping on most items".
- **Don't** add decorative illustrations to a hardware brand.
