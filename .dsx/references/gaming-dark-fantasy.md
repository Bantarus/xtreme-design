---
version: alpha
name: gaming-dark-fantasy
description: Gaming / dark-fantasy DESIGN.md. Charcoal-to-black canvas, blood-iron primary, ember-gold accent for legendary states. Heavy display serif over thick condensed sans. Use when the brief mentions games, lore, fantasy, RPG, dungeon-crawler, esports, or any community-first product where the palette is part of the world-building.
keywords:
  - gaming
  - games
  - dark
  - fantasy
  - rpg
  - lore
  - dungeon
  - esports
  - heavy
  - dramatic
  - ember
  - blood
  - charcoal
  - community
  - mythic
  - cinematic
colors:
  primary: "#9b1b1b"
  primary-hover: "#6e1212"
  on-primary: "#f5e7c4"
  surface: "#16110d"
  surface-muted: "#231a13"
  text: "#f0e6d2"
  text-muted: "#a0907a"
  border: "#3b2c1f"
  border-strong: "#6e5436"
  success: "#5b8a3a"
  danger: "#c43a1a"
  warning: "#d29a2a"
  info: "#3a6080"
  focus-ring: "#d29a2a"
typography:
  display:
    fontFamily: Cinzel
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Cinzel
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Cinzel
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.02em
  title-md:
    fontFamily: Barlow Condensed
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.04em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: Barlow Condensed
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.12em
  label-sm:
    fontFamily: Barlow Condensed
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0.16em
rounded:
  xs: 1px
  sm: 2px
  md: 3px
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
---

# gaming-dark-fantasy

## Overview

A product whose customer wants to feel something. Music swells; type carries weight. Surfaces are deep and warm, never pure black. The accent is ember-gold and shows up only on legendary states — rare items, achievements, the final boss. Everything else is iron, soot, parchment.

## Colors

- **Primary (#9b1b1b, "Blood Iron"):** Primary CTAs, danger states. The color of consequence.
- **Surface (#16110d, "Pitch"):** Page background. Warm-black so type stays legible.
- **Focus Ring (#d29a2a, "Ember Gold"):** Legendary highlights, focus rings, the +1 sword in the inventory.
- **On Primary (#f5e7c4, "Parchment"):** Text on Blood Iron. Cream, not white — keeps the world consistent.

## Typography

**Cinzel** for headlines, all 600+ weight, 0.02em tracking — it carries Roman / engraved character without being illegible. **Barlow Condensed** for labels and chips, heavy weight with wide tracking. **Inter** for prose because gamers still read patch notes.

## Layout

Dense. Tight gutters (16px). Inventory grids dominate. Cards stack on cards. The page rarely whitespaces — it composes.

## Elevation & Depth

Borders and tonal layers, never glow. The surface-muted band reads as "alcove." Hairline borders are pale brown, not gray.

## Shapes

Tight radii (1–4px). Pills only for chips. Sharp corners on cards read as "etched stone."

## Components

- **button-primary:** Blood Iron fill, Parchment text, 3px radius, 44px tall. Label tracked at 0.12em uppercase.
- **button-ghost:** Transparent, parchment text, hover reveals a Surface-Muted fill.
- **badge-legendary:** Ember Gold fill, Pitch text. Reserved for tier-5 items, max-level achievements.
- **card:** Surface-Muted fill, hairline brown border, 4px radius.

## Do's and Don'ts

- **Do** reserve Ember Gold for rarities + focus. Never use it as a brand banner.
- **Don't** introduce neon. This palette is candle-lit.
- **Do** use display serif for in-world content; reserve Inter for systems prose (settings, billing, ToS).
- **Don't** make borders darker than `surface`. They become invisible on charcoal.
