# Manual

Comprehensive reference for Xtreme Design. New here? Read the [Quickstart](Quickstart) first.

This page is a scaffold — section headings + short prose + TODO markers where deep coverage is warranted. Grow it over time via PRs to the staging area in [`docs/wiki/`](https://github.com/Bantarus/xtreme-design/tree/main/docs/wiki) (mirrored to this wiki).

## Table of contents

1. [Architecture: the two surfaces](#architecture-the-two-surfaces)
2. [Slash commands](#slash-commands)
3. [`DESIGN.md` schema](#designmd-schema)
4. [The reference corpus](#the-reference-corpus)
5. [Story composition (Chapter 2)](#story-composition-chapter-2)
6. [The version picker and CSS-cascade swaps](#the-version-picker-and-css-cascade-swaps)
7. [Pipeline internals](#pipeline-internals)
8. [APM agent harness](#apm-agent-harness)
9. [Hooks: PreToolUse, PostToolUse, Stop](#hooks-pretooluse-posttooluse-stop)
10. [Troubleshooting](#troubleshooting)
11. [Tooling reference](#tooling-reference)

---

## Architecture: the two surfaces

Two writable paths, no more:

1. **`DESIGN.md`** (chapter 1) — the active design system. `/design` and `/tweak` write here; the pipeline regenerates every visual artifact from this one file.
2. **`apps/storybook/src/**/*.stories.{ts,tsx}`** (chapter 2) — page and section compositions. `/page`, `/section`, `/refine` write here; Storybook hot-reloads them in place. Every story inherits the active palette through the version-aware decorator.

If a task requires touching anything else — a bug in the gallery, a script update, a config change — the agent stops and asks the human. The `scripts/agent-surface-fence.mjs` PreToolUse hook enforces this mechanically; Write/Edit on any other path exits 2.

> TODO: expand on _why_ the constraint exists — link the AGENTS.md narrative and the design-md.dev manifesto.

## Slash commands

Seven commands, deployed to every AI client by `apm install`:

```
# Chapter 1 — DESIGN.md
/design "<brief>"            generate a fresh DESIGN.md from the nearest reference
/tweak "<adjustment>"        surgically edit the active DESIGN.md
/snapshot "<name>"           rename the most recent auto-version slot
/restore <id-or-name>        load a saved version's DESIGN.md back into the active surface

# Chapter 2 — Storybook
/page "<brief>"              compose a full-page story from the nearest page reference
/section "<brief>"           compose a single-section story (hero, pricing block, CTA, …)
/refine <slug> "<adjustment>"   surgical edit of an existing story
```

Each command's prompt body lives in `.apm/prompts/*.prompt.md`. APM translates them into your client's native format (`.claude/commands/*.md`, `.cursor/commands/*.md`, `.codex/agents/*.toml`, etc.) on `apm install`.

> TODO: per-command deep-dive sections with example briefs and expected outputs.

## `DESIGN.md` schema

A `DESIGN.md` is YAML frontmatter + Markdown prose. The pipeline parses the frontmatter; humans read the prose; `design-md lint` validates both.

```yaml
---
version: alpha
name: <human-readable system name>
description: <one-sentence pitch>
colors:
  primary: "#..."
  primary-hover: "#..."
  on-primary: "#..."
  surface: "#..."
  surface-muted: "#..."
  text: "#..."
  text-muted: "#..."
  border: "#..."
  border-strong: "#..."
  success: "#..."
  danger: "#..."
  warning: "#..."
  info: "#..."
  focus-ring: "#..."
typography:
  display:
    fontFamily: ...
    fontSize: ...
    fontWeight: ...
    lineHeight: ...
    letterSpacing: ...
  # … headline-lg, headline-md, title-md, body-lg, body-md, body-sm,
  # … label-md, label-sm, mono-sm
rounded:
  xs: 2px; sm: 4px; md: 8px; lg: 12px; xl: 16px; full: 9999px
spacing:
  xs / sm / md / lg / xl / 2xl / 3xl / gutter / margin (px)
components:
  button-primary / button-primary-hover / button-secondary / button-ghost /
  input / card / badge / badge-success / badge-danger / badge-warning /
  badge-info / caption
---
```

**Contract:** the active `DESIGN.md` must define **every** color and component name that `base.DESIGN.md` defines. Adding new names is fine — the pipeline propagates them. Dropping a base name will fail `scripts/design-md-sync.mjs`. The gallery imports those token names directly, so removing one breaks the build.

The prose body has a fixed structure that `design-md lint` checks for: `## Overview`, `## Colors`, `## Typography`, `## Layout`, `## Elevation & Depth`, `## Shapes`, `## Components`, `## Do's and Don'ts`.

> TODO: per-section authoring guidelines + examples.

## The reference corpus

`.dsx/references/` (chapter 1) and `.dsx/page-references/` (chapter 2) hold the corpora that `/design` and `/page` score against. Each reference has YAML frontmatter with a `keywords:` array; `scripts/find-reference.mjs` and `scripts/find-page-reference.mjs` tokenize a brief, score every reference by keyword overlap, and return the top match.

If the top score is 0, the agent falls back to a neutral default (`editorial-heritage.md` for chapter 1; the smallest landing for chapter 2).

> TODO: list bundled references with one-line each. Document how to add a new reference.

## Story composition (Chapter 2)

Stories are CSF3 (`Meta`, `StoryObj`, `satisfies` operator) and live under `apps/storybook/src/{pages,sections}/`. The template `.storybook/preview.tsx` registers a version-aware decorator that injects the active palette's `tokens.css` into the Storybook iframe — so every story re-paints when you change the toolbar paintbrush.

Pages use `parameters: { layout: 'fullscreen' }`. Sections typically don't.

> TODO: composition-patterns deep-dive (shadcn import patterns, Tailwind v4 + @theme inline, etc.). Reference the `storybook-csf3` skill.

## The version picker and CSS-cascade swaps

The gallery's version picker (sticky at top of `:3000`) and Storybook's toolbar paintbrush both do the same thing: inject a `<link rel="stylesheet" href="/api/versions/<id>/tokens.css">` at the end of `<head>`, where it wins the cascade over the build-time `tokens.active.css`. The browser re-resolves `:root { --color-* }` in ~50 ms.

Implementation:
- Gallery: [`apps/gallery/components/ActiveStylesheet.tsx`](https://github.com/Bantarus/xtreme-design/blob/main/apps/gallery/components/ActiveStylesheet.tsx) — atomic swap (loads new sheet before removing old, so the cascade never falls back to baseline mid-transition).
- Storybook: [`apps/storybook/.storybook/decorators/ActiveStylesheet.tsx`](https://github.com/Bantarus/xtreme-design/blob/main/apps/storybook/.storybook/decorators/ActiveStylesheet.tsx) — same idea, ~30 lines.

URL parameter `?v=<id-or-name>` pins the gallery to a specific version. The picker also supports search filtering and hover-prefetch (each chip preloads its tokens.css on hover so the click is sub-frame).

> TODO: document the side-by-side compare view at `/compare?a=<id>&b=<id>`.

## Pipeline internals

`scripts/pipeline.mjs` runs after every assistant turn (Stop hook) and on every `DESIGN.md` save via `scripts/watch.mjs`. Each step must exit 0 or the pipeline stops:

1. `design-md lint DESIGN.md` — structural validation via `@google/design.md`.
2. `node scripts/design-md-to-css.mjs DESIGN.md > apps/gallery/app/tokens.active.css` — YAML → CSS variables.
3. `pnpm tokens` — Style Dictionary multi-platform fan-out (CSS, Tailwind theme snippet, Flutter, Compose, iOS).
4. `node scripts/snapshot.mjs --auto` — saves a new auto-version under `.dsx/versions/v<N>/`. Idempotent: skips creation if the most-recent auto version's `DESIGN.md` is byte-identical to the current active.
5. `node scripts/mirror-storybook-versions.mjs` — copies the latest `.dsx/versions/_index.json` and all `tokens.css` files into Storybook's `public/versions/` so the toolbar picker finds them.

> TODO: per-step deep-dive. Document the dedupe sha256 contract and the `--brief` flag.

## APM agent harness

The agent harness lives **once** at `.apm/`:

```
.apm/
├── agents/         subagents (*.agent.md) — token-guardian, screenshot-critic, port-flutter, port-compose
├── prompts/        slash commands (*.prompt.md) — the seven commands above
├── skills/         24 reference skills (apm-*, storybook-*, dsx-specific)
├── hooks/          PreToolUse (fence), PostToolUse (biome), Stop (pipeline)
└── instructions/   reserved for AGENTS.md compilation
```

`apm install` reads `apm.yml`, translates each primitive to the native format of every locally-installed AI client, and writes the output to `.claude/`, `.cursor/`, `.codex/`, `.github/`, `.opencode/` — whichever clients are present. All those output directories are gitignored.

**Never edit `.claude/` (or any other generated directory) directly.** APM regenerates them. Edit `.apm/` and re-run `apm install`.

See the [`apm-cli`, `apm-packaging`, `apm-distribution` skills](https://github.com/Bantarus/xtreme-design/tree/main/.apm/skills) for the full reference.

> TODO: per-client gotchas. Document the Codex TOML translation. Cross-link the apm-spike.

## Hooks: PreToolUse, PostToolUse, Stop

- **PreToolUse** runs `scripts/agent-surface-fence.mjs` — rejects Write/Edit on any path outside the two writable surfaces, exit 2 with a verbose error pointing the agent at the pipeline. (Currently **disabled** during active template development. Enable when shipping to end-users.)
- **PostToolUse** runs `biome format --write` on every file the agent writes or edits. Keeps the working tree free of style noise.
- **Stop** runs `scripts/pipeline.mjs` after every assistant turn. This is what makes the gallery and Storybook hot-reload in response to a slash command — without the human running anything.

> TODO: document how each client wires these hooks. Some clients have richer hook surfaces than others.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Slash commands missing | `apm install` not run, or output got cleaned | Re-run `apm install` from the repo root |
| Gallery picker says "Loading versions…" forever | `.dsx/versions/_index.json` missing | `pnpm pipeline` once |
| Storybook toolbar has no versions | Mirror not run | `node scripts/mirror-storybook-versions.mjs` |
| Pipeline fails on `design-md lint` | Frontmatter dropped a required key | Compare against `base.DESIGN.md`; restore the missing key |
| Gallery shows wrong palette after `/restore` | Browser cached the old stylesheet | Hard-refresh (Cmd-Shift-R / Ctrl-Shift-R) |
| Visual tests fail with 3-8% pixel diff | Baseline is pinned to `base`; you're on a different surface | Either `/restore base`, or accept that drift is expected during iteration |
| `.claude/settings.json` rejected by Claude Code | Schema drift in the hook config | See the open KNOWN-ISSUES entries |
| Fence blocks edits I want to make to the template | Fence is on; you're editing template code | Disable PreToolUse in `.claude/settings.json` while doing template work; re-enable for end-user runs |

> TODO: grow this table with every recurring "huh, why did this happen?" moment.

## Tooling reference

| Tool | What it's for | Docs |
|---|---|---|
| **Next.js 15** (App Router) | Gallery app | <https://nextjs.org/docs> |
| **Tailwind v4** (with `@theme inline`) | Token-driven styling in the gallery | <https://tailwindcss.com/blog/tailwindcss-v4> |
| **shadcn 4.7** | Component primitives in the gallery | <https://ui.shadcn.com> |
| **Storybook 10** + Vite | Chapter-2 canvas | <https://storybook.js.org> |
| **Style Dictionary 4** | Token fan-out (CSS, Tailwind, Flutter, Compose, iOS) | <https://styledictionary.com> |
| **Biome** | Formatter + linter for JS/TS/JSON | <https://biomejs.dev> |
| **Playwright** | Visual regression tests on the gallery | <https://playwright.dev> |
| **`@google/design.md`** | `DESIGN.md` linter | npm registry |
| **APM** | Agent Package Manager | The `apm-cli` skill in `.apm/skills/` |

---

> This manual is a living scaffold. Edit the staging copy at [`docs/wiki/Manual.md`](https://github.com/Bantarus/xtreme-design/blob/main/docs/wiki/Manual.md) and push the wiki repo (see the [staging README](https://github.com/Bantarus/xtreme-design/blob/main/docs/wiki/README.md) for the workflow).
