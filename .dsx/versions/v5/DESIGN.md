---
version: alpha
name: Backcountry
description: A rugged-but-inviting storefront for an outdoor camping gear brand. Dark forest greens, parchment off-white cards, ember-orange focus. Honest sans-serif type, weatherproof restraint, no decorative noise.
colors:
  primary: "#2c4332"
  primary-hover: "#1b2c20"
  on-primary: "#f5f0e6"
  surface: "#f5f0e6"
  surface-muted: "#e6dec9"
  text: "#1c1814"
  text-muted: "#56514a"
  border: "#cdc4b0"
  border-strong: "#a89880"
  success: "#3f6b3a"
  danger: "#a83b1e"
  warning: "#c9651a"
  info: "#3a5a73"
  focus-ring: "#e07a2e"
typography:
  display:
    fontFamily: Source Sans 3
    fontSize: 44px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Source Sans 3
    fontSize: 30px
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
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 18px
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

# Backcountry

## Overview

A working storefront for an outdoor camping gear brand. The product moves physical things into the woods: tents, packs, sleeping bags, hard-anodized cookware, repair patches. Trust, weather-readiness, and honest specs outrank novelty. Surfaces feel like map paper and bone-cotton; CTAs feel like a stitched canvas label — short, blunt, accountable. Dark forest pine for the brand chrome, ember orange reserved for tracking and focus only.

## Colors

- **Primary (#2c4332, "Pine"):** Header, primary CTAs, link emphasis. The "stamp on the back of every label" color.
- **Primary Hover (#1b2c20, "Deep Pine"):** Pressed state for `primary`. Never used as a fill on its own.
- **On Primary (#f5f0e6, "Bone"):** Text and icon color on `primary` or `primary-hover`. Never used on `surface`.
- **Surface (#f5f0e6, "Bone"):** The page background and the card fill. Off-white with a warm cotton cast — never pure white.
- **Surface Muted (#e6dec9, "Canvas"):** Section bands, drawer headers, inline code blocks. One muted band per view.
- **Text (#1c1814, "Bark"):** All body and heading copy on `surface`. Reserved for foreground.
- **Text Muted (#56514a, "Lichen"):** Captions, shipping copy, secondary metadata. Passes WCAG AA on `surface`. Never the primary headline.
- **Border (#cdc4b0, "Twine"):** The default hairline between cards, inputs, and table rows.
- **Border Strong (#a89880, "Bark Edge"):** Only when the default border vanishes against `surface-muted`.
- **Success (#3f6b3a, "Moss"):** "In stock," "delivered," confirmation. Distinct from `primary` — brighter and yellower.
- **Danger (#a83b1e, "Clay"):** Destructive actions, sold-out states, validation errors.
- **Warning (#c9651a, "Rust"):** Non-blocking cautions — "low stock," "backordered."
- **Info (#3a5a73, "Dusk"):** Neutral informational states, shipping notices that aren't urgent.
- **Focus Ring (#e07a2e, "Ember"):** Tracking states, in-transit badges, the 2px keyboard focus ring. Never decorative.

Every text-over-background pair clears WCAG AA 4.5:1: `text` on `surface` is ~16:1, `text-muted` on `surface` ~6.4:1, `on-primary` on `primary` ~9:1, status fills with `on-primary` text all clear 4.5:1.

## Typography

Source Sans 3 across the board — an honest, weatherproof sans with strong bold cuts. Bold for navigation, prices, and product names; regular for everything else. Tabular figures on prices, weights, and tracking numbers. IBM Plex Mono for SKU codes, order IDs, and trail-spec rows.

- **display (44px / 700):** Reserved for the single hero phrase on a landing or category page. One per page.
- **headline-lg (30px / 700):** Top-of-page titles inside the storefront (PDP, cart, account).
- **headline-md (22px / 600):** Section titles within a page ("Related gear," "Care instructions").
- **title-md (18px / 600):** Card titles, dialog titles, product names on the grid.
- **body-lg (18px / 400):** Long-form reading copy — field guides, care articles. Inside a column ≤ 72ch.
- **body-md (16px / 400):** Default for UI prose, form helper text, product descriptions.
- **body-sm (14px / 400):** Table cells, spec sheets, dense list rows.
- **label-md (14px / 600):** Button labels, form labels.
- **label-sm (12px / 600, +0.08em tracking):** Small caps for badges and eyebrow labels. Author lowercase; uppercase at the component layer.
- **mono-sm (13px / 400):** SKU codes, order IDs, weight/dimension specs.

## Layout

8-pt grid, page max-width 1200px, gutter 24px, margin 32px from `md` up. Product grids prefer 4 columns at desktop, 2 on tablet, 1 on mobile. Cart drawer is a right-attached sheet, not a modal. PDP image gallery sits left, spec column right; on mobile, gallery on top, sticky add-to-cart bar at the bottom.

- Below 640px: single column, page padding 16px, vertical rhythm 16px.
- 640–1024px: two-column where applicable, gutter 24px.
- 1024px and up: 12-column grid, 24px gutter, 32px page margin, centered at 1200px.

## Elevation & Depth

Mostly flat. A whispered shadow on the sticky add-to-cart bar and on the cart drawer's leading edge — nowhere else. Cards lean on the canvas-vs-bone tonal step, not depth. The 2px `focus-ring` outline at 2px offset is the only explicit depth signal for keyboard focus.

## Shapes

Tight, manufactured radii. Tents and hardware aren't pillowy — neither are the components.

- **xs (2px):** Inline chips inside text.
- **sm (4px):** Inputs nested inside another rounded surface.
- **md (6px):** Buttons, inputs, badges in the default flow.
- **lg (10px):** Cards, dialogs, popovers.
- **xl (14px):** The single hero card on a landing or category page.
- **full (9999px):** Pills, avatars, count badges.

Never mix radii within a composite component. A card uses `lg`, the buttons inside it use `md`.

## Components

- **button-primary:** Pine fill, bone text, 6px radius, 44px height. The single decisive action per view ("Add to cart," "Checkout"). On hover apply `button-primary-hover`. On focus, render a 2px `focus-ring` outline at 2px offset.
- **button-primary-hover:** Internal token; the visual state of `button-primary` on pointer hover or active press. Deep Pine fill, bone text.
- **button-secondary:** Bone fill, bark text, 1px twine border. The companion to `button-primary` ("Save for later," "Cancel").
- **button-ghost:** Tertiary nav actions inside dense rows (filter bars, account menus). No fill, no border, bark text. Underline on hover at 1px from baseline.
- **input:** Bone fill, bark text, 6px radius, 1px twine border, 44px height. Placeholder color is lichen. On focus, the border becomes `primary` and the `focus-ring` outline appears.
- **card:** Bone fill, 10px radius, 1px twine border, padding `lg`. Cards never have shadows on the page grid. A "raised" feel comes from a canvas (`surface-muted`) section band behind a row of bone cards.
- **badge:** Canvas fill, bark text, full-pill, height 20px. Use `label-sm` typography uppercased — "NEW," "FIELD-TESTED."
- **badge-success / badge-danger / badge-warning / badge-info:** Status-colored badges using their named fill with bone text. `badge-success` for "IN STOCK," `badge-warning` for "LOW STOCK," `badge-danger` for "SOLD OUT," `badge-info` for neutral shipping notices.
- **caption:** Lichen ink at `body-sm`. Shipping estimates, weight/dimension sublines, image attribution. Never carries a primary action.

## Do's and Don'ts

- **Do** make the price the loudest element on the product card.
- **Don't** use Ember (`focus-ring`) anywhere except tracking states and keyboard focus.
- **Do** keep shipping copy honest: "Ships within 24 hours" beats "Free shipping on most items."
- **Don't** add decorative illustrations to a gear brand — let the product photography do the work.
- **Do** use exactly one `primary` button per view.
- **Don't** introduce a second accent to differentiate destructive from primary — use `danger` only.
- **Do** prefer a Canvas (`surface-muted`) band over a shadow to separate page regions.
- **Don't** use `text-muted` for a headline; muted text belongs to captions and shipping copy.
- **Do** set spec rows in `mono-sm` so weights and dimensions align.
- **Don't** mix radii within a composite component. A card is `lg`, its inner buttons are `md`.
