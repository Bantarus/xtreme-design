# Storybook — future chapter

Storybook is intentionally not configured in dsx. The current iteration template is about **palette and prose** — DESIGN.md drives the gallery; the gallery is the canvas. Adding Storybook would shift the focus toward **page composition**, which is a different product.

When the time comes, the integration should be opinionated:

## TODO

- [ ] Storybook 8.x with the Vite builder (faster cold-start than Webpack).
- [ ] One story per component variant. Drive the variant matrix from `apps/gallery/lib/components-manifest.ts` instead of duplicating it.
- [ ] Use [Chromatic](https://www.chromatic.com/) or self-hosted visual-regression on top of Playwright. The gallery's own `pnpm test:visual` already covers the same surface — Storybook should not duplicate it.
- [ ] Stories live in `apps/gallery/components/ui/*.stories.tsx` so the components remain co-located.
- [ ] No agent involvement. Stories are static, hand-authored by the human, and DESIGN.md is still the only thing the agent edits.

## What this chapter is NOT

- A canvas for AI-driven layout composition. That's a separate product.
- A replacement for `/components/[slug]` routes. Those continue to render the gallery's authoritative previews.
- A reason to add a build step to the agent loop. Storybook would run in a separate dev session.

## When to start

Suggested triggers:
1. The team grows past one person and needs a shared component reference.
2. There's a need to test variant × prop combinations that the gallery's static preview cannot express (controlled state matrices, focus traps, RTL, etc.).
3. A client requests deliverable component docs as a hand-off artifact.

Until then, the gallery is enough.
