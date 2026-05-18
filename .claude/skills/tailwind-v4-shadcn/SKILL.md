---
name: tailwind-v4-shadcn
description: Tailwind v4 @theme inline patterns for the dsx scaffold (Next.js 15.5 + shadcn 4.7). Covers the semantic-var bridge, the OKLCH-vs-hex choice, and common Tailwind v3 holdovers that break in v4.
---

# Tailwind v4 + shadcn in dsx

The dsx web app uses Tailwind v4 stable with shadcn 4.7 (base-nova preset). The key pattern: dsx tokens live in `build/css/tokens.css` as raw `--color-*` / `--radius-*` / `--text-*` / `--font-*` variables, and `apps/web/app/globals.css` does the Tailwind v4 ↔ shadcn ↔ dsx bridge.

## The @theme inline bridge

`@theme inline` is the v4-only directive for mapping CSS variables onto Tailwind's recognized namespaces. The "inline" form substitutes the value (not the variable name) into generated utility classes, which is what you want for runtime theme switching.

In dsx, the bridge looks like:

```css
@import "tailwindcss";
@import "../../../build/css/tokens.css";
@import "../../../build/css/tokens.dark.css";

@theme inline {
  --color-background: var(--color-surface);
  --color-foreground: var(--color-text);
  --color-primary: var(--color-primary);
  --color-primary-foreground: var(--color-on-primary);
  --color-destructive: var(--color-danger);
  --color-ring: var(--color-focus-ring);
  --radius: var(--radius-md);
}
```

When the `.dark` class is on `<html>`, `tokens.dark.css` redefines the right-hand `--color-*` variables. The Tailwind utility `.bg-primary` outputs `background-color: var(--color-primary)`, so swapping the class swaps every utility's resolved value automatically.

## Recognized Tailwind v4 namespaces

`--color-*`, `--font-*`, `--text-*` (font size), `--font-weight-*`, `--tracking-*` (letter-spacing), `--leading-*` (line-height), `--breakpoint-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, `--blur-*`, `--animate-*`. Anything outside these namespaces won't generate a utility class.

## Common Tailwind v3 → v4 traps

- **No more `tailwind.config.js` is required.** v4 reads `@theme` from CSS. Keep `components.json` pointed at `app/globals.css`.
- **`@apply` still works** but inside `@layer base`/`@layer components`, not at top-level.
- **`@custom-variant`** replaces v3's `addVariant` plugin call. dsx already declares `dark` via `@custom-variant dark (&:is(.dark *));`.
- **shadcn `asChild` is gone in 4.7+.** shadcn 4.7's primitives come from `@base-ui/react`, which uses `render={<Component />}` instead. See `apps/gallery/app/page.tsx` for the working pattern.
- **No `extend`.** v3's `theme: { extend: {...} }` becomes additional `--<namespace>-<name>` declarations inside `@theme`.

## When to use `@theme inline` vs. `@theme`

- Use **`@theme`** when defining a token whose value is a literal (e.g., `--color-mint-500: oklch(0.72 0.11 178);`).
- Use **`@theme inline`** when the value is a `var(...)` reference. Inline substitution prevents cascade-resolution bugs.

dsx always uses inline because every Tailwind theme token is a reference into the dsx token graph.
