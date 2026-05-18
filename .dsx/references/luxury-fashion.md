---
version: alpha
name: luxury-fashion
description: High-end fashion DESIGN.md. Ivory canvas, ink-black headlines set in a tight display serif, near-zero chrome, full-bleed editorial photography. Pricing whispers; product names dominate. Use when the brief mentions fashion, jewelry, couture, beauty, perfume, or any boutique luxury context where restraint is the brand.
keywords:
  - luxury
  - fashion
  - editorial
  - couture
  - boutique
  - serif
  - elegant
  - whisper
  - ivory
  - jewelry
  - beauty
  - perfume
  - minimal
  - hushed
  - tasteful
colors:
  primary: "#1a1814"
  primary-hover: "#000000"
  on-primary: "#FFFFFF"
  surface: "#fbf9f4"
  surface-muted: "#f1ede4"
  text: "#1a1814"
  text-muted: "#7a7466"
  border: "#e3ddd0"
  border-strong: "#bfb6a1"
  success: "#3b6b46"
  danger: "#9a2a26"
  warning: "#a07412"
  info: "#3a4d5e"
  focus-ring: "#bfb6a1"
typography:
  display:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.2
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.04em
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 300
    lineHeight: 1.6
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 300
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 300
    lineHeight: 1.55
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0.18em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: 0.2em
rounded:
  xs: 0px
  sm: 0px
  md: 0px
  lg: 2px
  xl: 4px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  2xl: 96px
  3xl: 128px
---

# luxury-fashion

## Overview

A boutique brand. The product is photographed beautifully; the chrome stays out of the way. Type leads. Whitespace is the most generous color in the palette. There is no urgency, no "limited time offer." The customer is already a customer.

## Colors

- **Primary (#1a1814, "Ink"):** All copy, buttons, navigation. Never a bright color anywhere.
- **Surface (#fbf9f4, "Ivory"):** The page. Slightly warmer than white. Bleeds to true white only inside photo crops.
- **Border Strong (#bfb6a1):** The only divider that's visible. Use sparingly between editorial sections.

## Typography

Two families, used with discipline. **Playfair Display** for all headlines, weight 500, tight tracking. **Inter Light (300)** for body — yes, 300 is the point; the page reads as a magazine, not an application. Labels go uppercase with extreme tracking (0.18em).

## Layout

12-column grid; content frequently runs in narrower 6–8 column columns inside huge margins. Sections breathe. Spacing scale is generous (`lg = 32`, `xl = 64`, `2xl = 96`). Hero blocks are full-bleed photography.

## Elevation & Depth

Zero shadows. Photography provides all depth. Borders are present but pale. The customer's eye moves through the page on type weight alone.

## Shapes

Square corners almost everywhere (radius 0–2px). Only labels and avatars become full-pill. The squareness reads as "atelier," not as "draft."

## Components

- **button-primary:** Ink fill, ivory text, 0px radius, 48px tall, label-md tracked at 0.18em uppercase. Reads "ADD TO BAG", not "Buy now".
- **button-secondary:** Surface fill, 1px ink border, ink text.
- **card:** Surface fill, no shadow, 0px radius. Product photography is the only "fill" that matters.
- **price:** body-md weight 400, never sized larger than the product name.

## Do's and Don'ts

- **Do** let product photography occupy 60% of every above-the-fold band.
- **Don't** make price the loudest element. It is informational, not promotional.
- **Do** track all uppercase labels at ≥ 0.18em.
- **Don't** introduce a second display family. Playfair is the brand.
