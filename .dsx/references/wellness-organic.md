---
version: alpha
name: wellness-organic
description: Wellness / organic-natural DESIGN.md. Pale moss canvas, deep-sage primary, terracotta accent. Soft humanist type, generous whitespace, hairline borders. Use when the brief mentions wellness, mindfulness, organic, sustainable, yoga, supplements, slow-food, or any "calm-and-credible" lifestyle product.
keywords:
  - wellness
  - organic
  - natural
  - calm
  - sustainable
  - yoga
  - mindfulness
  - holistic
  - earthy
  - moss
  - sage
  - terracotta
  - botanical
  - soft
  - slow
  - lifestyle
colors:
  primary: "#3f5e3f"
  primary-hover: "#2a4128"
  on-primary: "#f5f1e6"
  surface: "#f1efe6"
  surface-muted: "#e6e1d2"
  text: "#1f2419"
  text-muted: "#5a5e4d"
  border: "#cfc8b3"
  border-strong: "#a89f85"
  success: "#3f5e3f"
  danger: "#a14829"
  warning: "#b88636"
  info: "#3f5e6e"
  focus-ring: "#b88636"
typography:
  display:
    fontFamily: Fraunces
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Fraunces
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.15
  headline-md:
    fontFamily: Fraunces
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.2
  title-md:
    fontFamily: Fraunces
    fontSize: 19px
    fontWeight: 500
    lineHeight: 1.3
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: 0.06em
rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 18px
  xl: 24px
  full: 9999px
spacing:
  xs: 6px
  sm: 12px
  md: 20px
  lg: 32px
  xl: 48px
  2xl: 72px
  3xl: 96px
---

# wellness-organic

## Overview

A product about slowing down. The customer is reading, not clicking. Pages are spacious. Colors are derived from things you'd put in tea: moss, oat, terracotta. Type leads with a friendly serif. Imagery is botanical but not stock-photo cliché.

## Colors

- **Primary (#3f5e3f, "Deep Sage"):** CTAs, navigation accents. Calm authority.
- **Surface (#f1efe6, "Oat"):** Page background. Off-white, warm.
- **Focus Ring (#b88636, "Terracotta"):** The single accent. Used for focus, in-progress states, "limited supply" indicators.

## Typography

**Fraunces** (variable serif) for headlines, weight 500. **Inter** for body — but at a relaxed line-height (1.65+). The page should look like a wellness magazine spread, not a SaaS dashboard.

## Layout

Generous spacing (`md = 20px`, `lg = 32px`, `xl = 48px`). Content columns max 64ch. Sections separate via whitespace rather than dividers wherever possible.

## Elevation & Depth

Flat. One subtle tonal step (Surface vs Surface-Muted) to mark sections. Cards have a 1px hairline border in pale stone; no shadows.

## Shapes

Soft rounded geometry. 12–18px radii on cards. Buttons are 8–12px. Pills for chips.

## Components

- **button-primary:** Deep Sage fill, Oat-Cream text, 12px radius, 44px tall, label-md slightly tracked.
- **button-secondary:** Surface fill, Deep Sage text, hairline border in Border-Strong.
- **card:** Surface fill, 18px radius, hairline border. No shadow.
- **badge-supply:** Terracotta fill, Oat-Cream text, full-pill — only for limited-supply messaging.

## Do's and Don'ts

- **Do** lead with prose. The customer is reading a story about a product.
- **Don't** use the success green for non-confirmation surfaces; it conflicts with the primary.
- **Do** keep terracotta rare. It is the season's accent, not the system.
- **Don't** crowd the page. Whitespace is the brand voice.
