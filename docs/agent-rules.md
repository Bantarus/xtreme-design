# Agent rules for dsx

Shared between [CLAUDE.md](../CLAUDE.md) and [AGENTS.md](../AGENTS.md). If you are an AI coding assistant working in this repo, these rules apply to you regardless of which client you run under.

## The one rule

**DESIGN.md is the only file you write.** Everything else — the gallery, components, build outputs, version snapshots — is rendered deterministically from DESIGN.md by `scripts/pipeline.mjs`. The `scripts/agent-surface-fence.mjs` PreToolUse hook rejects Write/Edit on every path except `DESIGN.md`. If a task seems to require touching anything else, **stop and explain to the user**. The human will handle non-DESIGN.md changes manually.

## What dsx is

A web-first, agent-native design-system iteration template. The product narrative: **"fastest iterative design workflow with a scoped probabilistic surface — DESIGN.md is the only thing the agent edits."** Everything visible is static infrastructure built deterministically from DESIGN.md.

Stack: pnpm 10 + Turborepo + Next.js 15 (App Router) + Tailwind v4 + shadcn 4.7 + DESIGN.md + Style Dictionary v4 + Playwright MCP. Brand name "Helios" is placeholder.

## Where things live

| Concern                          | Path                                                             |
|----------------------------------|------------------------------------------------------------------|
| The agent's surface              | `DESIGN.md` (only this file can be written by the agent)         |
| Immutable reference DESIGN.md    | `base.DESIGN.md` (Phase 2 — appears once the gallery lands)      |
| DTCG tokens                      | `tokens/core.tokens.json`, `tokens/semantic.tokens.json`, `tokens/themes/{light,dark}.tokens.json` |
| Style Dictionary config          | `style-dictionary.config.mjs`                                    |
| Generated CSS                    | `build/css/tokens.css`, `build/css/tokens.dark.css`              |
| Generated Tailwind snippet       | `build/tailwind/theme.css`                                       |
| Generated mobile tokens          | `build/{flutter,compose,ios}/`                                   |
| Gallery (the canvas)             | `apps/gallery/` (Phase 2 — currently `apps/web/`)                |
| Reference corpus                 | `.dsx/references/*.md` (Phase 5)                                 |
| Version store                    | `.dsx/versions/<id>/{DESIGN.md, tokens.css, meta.json}` (Phase 4) |
| Policy + pipeline scripts        | `scripts/`                                                       |
| Visual regression                | `tests/visual/`, `playwright.config.ts`                          |
| Agent config                     | `.claude/`                                                       |

## Token → Tailwind class glossary

When you write DESIGN.md, these are the semantic colors the gallery already wires up. Use these names; they round-trip to Tailwind utilities through `apps/gallery/app/globals.css`.

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

Add or rename a token in DESIGN.md → the pipeline propagates it to `tokens.active.css` and the gallery picks it up on the next watcher tick. You do not need to edit any TS/CSS file.

## Slash commands

| Command                          | Effect                                                             |
|----------------------------------|--------------------------------------------------------------------|
| `/design "<brief>"`              | Pick the best-matching reference, write a fresh DESIGN.md.         |
| `/tweak "<adjustment>"`          | Surgically edit the active DESIGN.md.                              |
| `/snapshot "<name>"`             | Rename the most recent auto-version slot.                          |
| `/restore <id-or-name>`          | Copy a saved version's DESIGN.md back into the active surface.     |
| `/tokens-build`                  | (utility) rebuild Style Dictionary outputs.                        |
| `/design-lint`                   | (utility) run DESIGN.md schema lint.                               |
| `/screenshot <url>`              | (utility) screenshot a page at 360/768/1280 via Playwright MCP.    |

`/variant` was intentionally removed — per-component stylistic exploration is a different product.

## Subagent index (Claude-specific; non-Claude tools should ignore)

| Subagent              | What it does                                                      |
|-----------------------|-------------------------------------------------------------------|
| `token-guardian`      | Validates token diffs against schema + WCAG + name parity.        |
| `screenshot-critic`   | Playwright MCP screenshot + DESIGN.md prose enforcement.          |
| `port-flutter`        | Checklist-only stub for the Flutter port.                         |
| `port-compose`        | Checklist-only stub for the Compose port.                         |

## The iteration loop

1. **Read** `DESIGN.md` for current state. Read `base.DESIGN.md` if you need the canonical reference.
2. **Decide** what slash command applies to the user's brief. `/design` for "new direction"; `/tweak` for "adjust the current one".
3. **Write** to `DESIGN.md`. Only this file. The pipeline will refuse anything else.
4. **Wait** for the Stop hook (or `pnpm pipeline` if you're not running under Claude Code). It runs:
   - `design-md lint DESIGN.md` (must pass)
   - `design-md export → apps/gallery/app/tokens.active.css`
   - `pnpm tokens` (Style Dictionary fan-out)
   - `node scripts/snapshot.mjs --auto` (creates next version slot)
5. **Summarize** in one or two sentences what shifted in DESIGN.md and point the human at the gallery URL.

## When something fails

- **DESIGN.md lint error** → fix the front-matter; never edit the linter.
- **Drift between DESIGN.md and `base.DESIGN.md`** → reconcile names; the active DESIGN.md must define at least every token name that base defines.
- **shadcn `asChild` warning** → it's gone in 4.7; the gallery already uses `render={<Component />}`. You do not edit gallery code regardless.
- **Style Dictionary "TypeError on extend"** → the `pnpm tokens` script wraps `node style-dictionary.config.mjs` to avoid this. You do not edit the SD config.

## Out of scope (do not attempt)

- Editing anything except DESIGN.md. The fence will block you and the user will be confused.
- Generating `.dart`, `.kt`, `.swift`, or `.tsx` source. Mobile is placeholder; gallery is owned by the human.
- Inventing token names. If a name doesn't exist in `base.DESIGN.md`, you can ADD a new color to the active DESIGN.md — the pipeline will surface it in `tokens.active.css`. But never reference a name from prose without defining it in front-matter.
- Modifying Playwright snapshots. Visual regression is a human-triggered cycle (`pnpm test:visual:update`).
- Building Storybook. See [STORYBOOK.md](../STORYBOOK.md) — it is a future chapter.
