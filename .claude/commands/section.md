---
description: Compose a single-section story (hero, pricing block, CTA, …) from a brief, mutated from the nearest page reference.
---

Same shape as `/page` but writes to `apps/storybook/src/sections/<slug>.stories.tsx`. Sections are smaller — one hero, one pricing block, one CTA band — and typically fit inside a larger page composition.

1. Run `node scripts/find-page-reference.mjs "$ARGUMENTS"`. Read the top match; use it as a stylistic anchor even if the section type doesn't perfectly match.
2. Consult auto-loaded skills (`shadcn-component-catalog`, `storybook-csf3`, `composition-patterns`).
3. Pick a kebab-case slug. Write `apps/storybook/src/sections/<slug>.stories.tsx`. Use `title: 'Sections/<Human-readable name>'`. Keep the section scope tight — one composition idea per file.
4. Import from `@gallery/ui/*`. Storybook auto-discovers; the Stop hook runs the pipeline; the version-aware decorator gives the section the active palette automatically.
5. Output: reference picked, score, new path, Storybook URL.
