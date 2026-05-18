---
name: design-tokens-dtcg
description: DTCG 2025.10 token shape used by dsx, Style Dictionary v4 transform map, and the multi-source layering (core → semantic → themes/light, themes/dark).
---

# DTCG tokens in dsx

dsx uses the [Design Token Community Group spec, 2025.10](https://schemas.designtokens.org/2025.10/format.json) for token JSON in `tokens/`. Style Dictionary v4 reads these and emits per-platform outputs to `build/`.

## $type cheatsheet

Every leaf token has `$value`. The `$type` is declared at the leaf OR inherited from the nearest ancestor group's `$type`. dsx prefers ancestor-level for compactness:

```json
"color": {
  "$type": "color",
  "scale": {
    "amber": {
      "500": { "$value": "#B85C00" }
    }
  }
}
```

Supported `$type`s used in dsx:
- `color` — value is a hex string starting with `#` in SRGB space.
- `dimension` — value is a string with a `px` / `em` / `rem` suffix.
- `number` — bare numeric (used for `lineHeight`).
- `fontFamily` — array of strings (`["Inter", "system-ui", "sans-serif"]`).
- `fontWeight` — bare numeric (`400`, `500`, `600`).

`typography` (composite) is intentionally NOT used at the token layer in dsx because Style Dictionary's built-in transforms don't fan it out cleanly to Dart/Kotlin/Swift. Typography is decomposed into `font.size.*`, `font.weight.*`, `font.family.*`, etc.

## Alias syntax

A reference is wrapped in curly braces and points at a path in the merged token tree:

```json
"primary": { "$value": "{color.scale.amber.700}" }
```

References must point to **primitives** (a leaf with `$value`), not groups. Within DESIGN.md's `components` map, composite refs are permitted (e.g., `{typography.label-md}`).

## Layered sources

dsx splits tokens into three layers:

1. **core** (`tokens/core.tokens.json`) — raw scale: color ramps, spacing, radii, font sizes/weights.
2. **semantic** (`tokens/semantic.tokens.json`) — flat aliases at `color.<name>` that reference `color.scale.*`. Names match DESIGN.md slot names (primary, surface, text, focus-ring, etc.).
3. **themes** (`tokens/themes/light.tokens.json`, `tokens/themes/dark.tokens.json`) — same shape as semantic, but with theme-specific values. Built into a separate `:root` vs `.dark` CSS file.

## Style Dictionary transform map (dsx-specific)

| Platform | transformGroup     | Output                       | Notes                                                                 |
|----------|--------------------|------------------------------|-----------------------------------------------------------------------|
| css      | `css`              | `build/css/tokens.css`       | `:root { --color-*, --spacing-*, --radius-*, --font-* }`              |
| cssDark  | `css`              | `build/css/tokens.dark.css`  | `.dark { --color-* }` from `tokens/themes/dark.tokens.json`           |
| tailwind | `css` + custom fmt | `build/tailwind/theme.css`   | `@theme inline {}` block; custom format `tailwind/theme-inline`        |
| flutter  | `flutter`          | `build/flutter/Tokens.dart`  | filtered to color/spacing/radius only — see KNOWN-ISSUES               |
| compose  | `compose`          | `build/compose/Tokens.kt`    | filtered, package `com.helios.tokens`                                 |
| ios      | `ios-swift`        | `build/ios/Tokens.swift`     | filtered, class `HeliosTokens`                                        |

## Workflow

1. Edit `tokens/`.
2. `pnpm tokens` rebuilds `build/`.
3. `node scripts/design-md-sync.mjs` checks that color names align between DESIGN.md and `semantic.tokens.json`.
4. `pnpm design:lint` validates DESIGN.md against the spec.
5. The `rebuild-tokens-if-needed.mjs` PostToolUse hook runs steps 2 and 4 automatically when DESIGN.md or `tokens/**` is edited.
