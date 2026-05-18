# Agent rules for dsx

Shared between [CLAUDE.md](../CLAUDE.md) and [AGENTS.md](../AGENTS.md). If you are an AI coding assistant working in this repo, these rules apply to you regardless of which client you run under.

## The two-surface rule

You may only Write or Edit files matching one of these two patterns:

| Surface | Path | Chapter | Slash commands |
|---|---|---|---|
| Active design system | `DESIGN.md` | 1 | `/design`, `/tweak` |
| Page and section compositions | `apps/storybook/src/**/*.stories.{ts,tsx}` | 2 | `/page`, `/section`, `/refine` |

Everything else — the gallery, components, Storybook config, build outputs, version snapshots, scripts, settings, docs — is rendered deterministically from those two surfaces by `scripts/pipeline.mjs` and Storybook's dev server. The `scripts/agent-surface-fence.mjs` PreToolUse hook rejects Write/Edit on every other path. If a task seems to require touching anything else, **stop and explain to the user**. The human will make non-surface changes manually.

## What dsx is

A web-first, agent-native design-system iteration template. The product narrative: **"fastest iterative design workflow with a scoped probabilistic surface."** Two chapters, two surfaces, one deterministic pipeline.

Stack: pnpm 10 + Turborepo + Next.js 15 (App Router, gallery) + Storybook 10 + Vite (composition canvas) + Tailwind v4 + shadcn 4.7 + DESIGN.md + Style Dictionary v4 + Playwright MCP. Brand name "Helios" is placeholder.

## Where things live

| Concern                          | Path                                                             |
|----------------------------------|------------------------------------------------------------------|
| **Active design system**         | `DESIGN.md` (writable surface #1)                                |
| **Page / section compositions**  | `apps/storybook/src/**/*.stories.{ts,tsx}` (writable surface #2) |
| Immutable reference DESIGN.md    | `base.DESIGN.md`                                                 |
| DTCG tokens                      | `tokens/core.tokens.json`, `tokens/semantic.tokens.json`, `tokens/themes/{light,dark}.tokens.json` |
| Style Dictionary config          | `style-dictionary.config.mjs`                                    |
| Generated CSS                    | `build/css/tokens.css`, `build/css/tokens.dark.css`              |
| Generated Tailwind snippet       | `build/tailwind/theme.css`                                       |
| Generated mobile tokens          | `build/{flutter,compose,ios}/`                                   |
| Gallery (component canvas)       | `apps/gallery/`                                                  |
| Storybook (composition canvas)   | `apps/storybook/`                                                |
| DESIGN.md reference corpus       | `.dsx/references/*.md`                                           |
| Page-story reference corpus      | `.dsx/page-references/*.stories.tsx`                             |
| Version store                    | `.dsx/versions/<id>/{DESIGN.md, tokens.css, meta.json}`          |
| Policy + pipeline scripts        | `scripts/`                                                       |
| Visual regression (gallery)      | `tests/visual/`, `playwright.config.ts`                          |
| Agent config                     | `.claude/`                                                       |

## Token → Tailwind class glossary

When you write DESIGN.md, these are the semantic colors the gallery and Storybook both wire up. Use these names; they round-trip to Tailwind utilities through `apps/gallery/app/globals.css` and `apps/storybook/.storybook/preview.css`.

| dsx semantic token  | CSS variable           | Tailwind utility                  |
|---------------------|------------------------|-----------------------------------|
| primary             | `--color-primary`      | `bg-primary`, `text-primary`      |
| on-primary          | `--color-on-primary`   | `text-primary-foreground`         |
| surface             | `--color-surface`      | `bg-background`                   |
| surface-muted       | `--color-surface-muted`| `bg-muted`                        |
| text                | `--color-text`         | `text-foreground`                 |
| text-muted          | `--color-text-muted`   | `text-muted-foreground`           |
| border              | `--color-border`       | `border-border`                   |
| danger              | `--color-danger`       | `bg-destructive`                  |
| success / warning / info | `--color-{success,warning,info}` | (utility-mapped in globals.css) |
| focus-ring          | `--color-focus-ring`   | `ring-ring`                       |
| radius.md           | `--radius-md`          | `rounded-md`                      |

Add or rename a token in DESIGN.md → the pipeline propagates it to `tokens.active.css` and both the gallery and Storybook pick it up on the next watcher tick. You do not need to edit any TS/CSS file.

## Slash commands

| Command                          | Surface | Effect                                                             |
|----------------------------------|---|--------------------------------------------------------------------|
| `/design "<brief>"`              | DESIGN.md | Pick the best-matching reference, write a fresh DESIGN.md.         |
| `/tweak "<adjustment>"`          | DESIGN.md | Surgically edit the active DESIGN.md.                              |
| `/snapshot "<name>"`             | (no write) | Rename the most recent auto-version slot.                          |
| `/restore <id-or-name>`          | DESIGN.md | Copy a saved version's DESIGN.md back into the active surface.     |
| `/page "<brief>"`                | story | Compose a full page from the nearest page reference.               |
| `/section "<brief>"`             | story | Compose a single section (hero, pricing block, CTA, …).             |
| `/refine <path-or-slug> "<adj>"` | story | Surgical edit of an existing story.                                 |
| `/tokens-build`                  | (utility) | Rebuild Style Dictionary outputs.                                   |
| `/design-lint`                   | (utility) | Run DESIGN.md schema lint.                                          |
| `/screenshot <url>`              | (utility) | Screenshot a page at 360/768/1280 via Playwright MCP.               |

`/variant` was intentionally removed — per-component stylistic exploration is a different product.

## Subagent index (Claude-specific; non-Claude tools should ignore)

| Subagent              | What it does                                                      |
|-----------------------|-------------------------------------------------------------------|
| `token-guardian`      | Validates token diffs against schema + WCAG + name parity.        |
| `screenshot-critic`   | Playwright MCP screenshot + DESIGN.md prose enforcement.          |
| `port-flutter`        | Checklist-only stub for the Flutter port.                         |
| `port-compose`        | Checklist-only stub for the Compose port.                         |

## The iteration loop

### Chapter 1 — design system brief
1. **Read** `DESIGN.md` for current state. Read `base.DESIGN.md` if you need the canonical reference.
2. **Decide** which slash command applies. `/design` for "new direction"; `/tweak` for "adjust the current one".
3. **Write** to `DESIGN.md`. Only this file. The fence will refuse anything else.
4. **Wait** for the Stop hook (or `pnpm pipeline` if you're not running under Claude Code). It runs:
   - `design-md lint DESIGN.md` (must pass)
   - `design-md export → apps/gallery/app/tokens.active.css`
   - `pnpm tokens` (Style Dictionary fan-out)
   - `node scripts/snapshot.mjs --auto` (creates next version slot; dedupes via tokens.css sha256)
5. **Summarize** in one or two sentences what shifted in DESIGN.md and point the human at the gallery + Storybook URLs.

### Chapter 2 — composition brief
1. **Read** the closest matching reference in `.dsx/page-references/` (the `/page` and `/section` commands handle this).
2. **Write** to `apps/storybook/src/pages/<slug>.stories.tsx` (or `sections/`). Mutate structure toward the brief; do not copy the reference verbatim.
3. **Storybook** auto-discovers the new file and hot-reloads. The version-aware decorator gives it the active palette automatically; the user can switch palettes from the toolbar without rebuilding.
4. **Summarize** in one or two sentences: which reference was used, the score, the new file path.

## When something fails

- **DESIGN.md lint error** → fix the front-matter; never edit the linter.
- **Drift between DESIGN.md and `base.DESIGN.md`** → reconcile names; the active DESIGN.md must define at least every token name that base defines.
- **shadcn `asChild` warning** → it's gone in 4.7; the gallery and Storybook already use `render={<Component />}`. You do not edit shadcn component code regardless.
- **Style Dictionary "TypeError on extend"** → the `pnpm tokens` script wraps `node style-dictionary.config.mjs` to avoid this. You do not edit the SD config.
- **A page story imports a component that doesn't exist** → fix the import in your story to a real shadcn component. Do not add a new component to `apps/gallery/components/ui/`; surface the gap to the user.

## Out of scope (do not attempt)

- Editing anything except `DESIGN.md` or files matching `apps/storybook/src/**/*.stories.{ts,tsx}`. The fence will block you and the user will be confused.
- Editing `.storybook/` configuration. Config is human-owned.
- Generating `.dart`, `.kt`, `.swift`, or non-story `.tsx` source.
- Inventing token names. If a name doesn't exist in `base.DESIGN.md`, you can ADD a new color to the active DESIGN.md — the pipeline will surface it in `tokens.active.css`. But never reference a name from prose without defining it in front-matter.
- Modifying Playwright snapshots. Visual regression is a human-triggered cycle (`pnpm test:visual:update`). Storybook is not in the visual-regression suite this chapter.
