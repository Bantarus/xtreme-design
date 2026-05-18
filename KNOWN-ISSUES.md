# Known Issues

Tracked deviations from the scaffold prompt and upstream spec, with rationale.

## Toolchain versions

- Node 24.14.1 is installed locally; prompt specified Node 20 LTS. Repo is pinned via `.nvmrc` to `20` for portability. Local dev on Node 24 has been observed working; CI should pin 20.
- pnpm 10.12.1 is installed locally; prompt specified pnpm 9. Newer pnpm is backwards-compatible with the prompt's `workspaces` layout, so we adopt 10.

## DESIGN.md spec deviations

- The DESIGN.md spec (v `alpha`) does **not** define a `borderColor` slot for components. Supported slot fields are: `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`. Border-color values are exposed as top-level `colors.*` tokens (e.g., `border`, `border-strong`) and used in prose and downstream Tailwind/CSS; they are not assignable as a component slot in the front-matter.
- The spec mentions WCAG AA contrast (4.5:1) as guidance but the CLI does not (at time of writing) enforce a contrast-ratio lint. We have authored DESIGN.md with WCAG-passing pairs by construction; if the CLI gains contrast enforcement, the scaffold should pass without changes. If it ever flags a pair, prefer adjusting the surface, not the brand color.

## Next.js pin

- Next.js is pinned to `15.5.16` due to a reported vulnerability in earlier 15.x releases. Do not bump within 15.x without confirming the advisory has been re-checked.

## Tailwind v4 stable

- We target Tailwind v4 stable. If installation resolves to a beta, record the exact version here and proceed; do not silently downgrade.
