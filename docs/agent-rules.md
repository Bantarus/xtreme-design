# Agent rules for dsx

Shared between CLAUDE.md and AGENTS.md. If you are an AI coding assistant working in this repo (Claude Code, Codex, Cursor, Aider, etc.), these rules apply to you.

## What dsx is

A web-first agent-native design system monorepo. `DESIGN.md` is the prose source of truth. DTCG 2025.10 JSON in `tokens/` is the build-pipeline source of truth. Style Dictionary fans the tokens out to CSS, Tailwind, Dart, Kotlin, Swift. The web target is Next.js 15.5.16 + Tailwind v4 + shadcn 4.7. Brand name "Helios" is a placeholder.

## Core invariants (do not violate)

1. **Read DESIGN.md before generating UI.** The Components section is the per-component rule book. The Do's and Don'ts is the visual policy. Cite section + line when explaining a choice.
2. **No raw color literals.** Never write `#rrggbb`, `rgb()`, `rgba()`, `hsl()`, `oklch()`, etc. in `.ts`/`.tsx`/`.css` files outside the four exceptions (`DESIGN.md`, `tokens/`, `build/`, `apps/web/app/globals.css`, the Style Dictionary config, `scripts/`). The `block-raw-hex` PreToolUse hook rejects violations.
3. **Use dsx tokens, not invented names.** If a token doesn't exist in `tokens/semantic.tokens.json`, ADD it there (and the corresponding entry in DESIGN.md) before referencing it from a component.
4. **DESIGN.md ↔ tokens parity.** Whenever you add or remove a color in DESIGN.md front-matter, mirror the change in `tokens/semantic.tokens.json`. `node scripts/design-md-sync.mjs` must exit 0 before you declare a task done.
5. **Run `pnpm tokens && pnpm design:lint` before declaring done.** If either fails, fix the cause — never silence the diagnostic.
6. **shadcn 4.7 uses `render`, not `asChild`.** The primitives come from `@base-ui/react`. Pattern: `<DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>`.
7. **The `.dark` class on `<html>` is the only dark-mode switch.** Tailwind utilities, dsx tokens, and shadcn theme tokens all resolve through it via `var(--color-*)`.
8. **Never modify Playwright snapshots.** They are committed regression baselines. To intentionally update them, the human runs `pnpm test:visual:update`.

## Quick reference

### Where things live

| Concern                       | Path                                           |
|-------------------------------|------------------------------------------------|
| Prose source of truth         | `DESIGN.md`                                     |
| DTCG tokens (build-pipeline)  | `tokens/core.tokens.json`, `tokens/semantic.tokens.json`, `tokens/themes/{light,dark}.tokens.json` |
| Style Dictionary config       | `style-dictionary.config.mjs`                   |
| Generated CSS                 | `build/css/tokens.css`, `build/css/tokens.dark.css` |
| Generated Tailwind snippet    | `build/tailwind/theme.css`                      |
| Generated mobile tokens       | `build/{flutter,compose,ios}/`                  |
| Web app                       | `apps/web/`                                     |
| Web globals (token ↔ TW bridge) | `apps/web/app/globals.css`                    |
| shadcn components             | `apps/web/components/ui/`                       |
| Custom registry               | `registry/` → `apps/web/public/r/`              |
| Policy scripts                | `scripts/`                                      |
| Visual regression             | `tests/visual/`, `playwright.config.ts`        |
| Agent config                  | `.claude/`                                      |

### Token → Tailwind class glossary

| dsx semantic token  | CSS variable           | Tailwind utility        |
|---------------------|------------------------|-------------------------|
| primary             | `--color-primary`      | `bg-primary`, `text-primary` |
| on-primary          | `--color-on-primary`   | `text-primary-foreground` |
| surface             | `--color-surface`      | `bg-background`         |
| surface-muted       | `--color-surface-muted`| `bg-muted`              |
| text                | `--color-text`         | `text-foreground`       |
| text-muted          | `--color-text-muted`   | `text-muted-foreground` |
| border              | `--color-border`       | `border-border`         |
| danger              | `--color-danger`       | `bg-destructive`        |
| focus-ring          | `--color-focus-ring`   | `ring-ring`             |
| radius.md           | `--radius-md`          | `rounded-md`            |
| spacing.md          | `--spacing-md`         | (use Tailwind's own `--spacing`) |

### Commands you will use

| Command                          | Purpose                                              |
|----------------------------------|------------------------------------------------------|
| `pnpm install`                   | Install workspaces.                                  |
| `pnpm tokens`                    | Rebuild Style Dictionary outputs.                    |
| `pnpm design:lint`               | Validate DESIGN.md (errors must be 0).               |
| `pnpm design:sync`               | Check DESIGN.md ↔ semantic.tokens.json name parity.  |
| `pnpm --filter web dev`          | Run the Next.js dev server on :3000.                 |
| `pnpm --filter web build`        | Type-check + production build.                       |
| `pnpm registry:build`            | Compile `@dsx` registry → `apps/web/public/r/`.      |
| `pnpm test:visual`               | Run Playwright visual regression.                    |
| `pnpm test:visual:update`        | Regenerate Playwright baselines (human-triggered).   |

### Subagent index (Claude-specific; non-Claude tools should ignore)

| Subagent              | What it does                                                      |
|-----------------------|-------------------------------------------------------------------|
| `variant-generator`   | Worktree-isolated UI exploration; never touches tokens.           |
| `token-guardian`      | Validates token diffs against schema + WCAG + name parity.        |
| `screenshot-critic`   | Playwright MCP screenshot + DESIGN.md prose enforcement.          |
| `port-flutter`        | Checklist-only stub for the Flutter port.                         |
| `port-compose`        | Checklist-only stub for the Compose port.                         |

### Slash commands (Claude-specific)

- `/variant <component-path> "<brief>" [N]`
- `/tokens-build`
- `/design-lint`
- `/screenshot <url>`

## Workflow

1. **Inspect.** Read `DESIGN.md` and `tokens/semantic.tokens.json` for context before any UI work.
2. **Edit.** Make the minimal change. If you need a new token, add it in both DESIGN.md and `tokens/semantic.tokens.json`.
3. **Rebuild.** `pnpm tokens` (or rely on the PostToolUse hook if running under Claude Code).
4. **Validate.** `pnpm design:lint`, `pnpm design:sync`, `pnpm --filter web build`.
5. **Snapshot (when shipping a visible change).** Decide whether to run `pnpm test:visual:update`. Diff the new PNGs before committing.
6. **Commit.** Conventional commits: `feat(scope): summary`, `fix(scope): summary`, `chore: ...`.

## When something fails

- DESIGN.md lint error → fix the front-matter, never the linter.
- DESIGN.md ↔ semantic drift → reconcile names; do not delete a public token without a migration note in `KNOWN-ISSUES.md`.
- Tailwind class doesn't render → check `apps/web/app/globals.css` `@theme inline` mapping; the underlying `--color-*` may need adding to `tokens/semantic.tokens.json`.
- shadcn `asChild` not recognized → migrate to `render={<Component />}` (KNOWN-ISSUES.md).
- Style Dictionary "TypeError on extend" → run via `node style-dictionary.config.mjs` (the `pnpm tokens` script does this).

## Out of scope (do not attempt without explicit request)

- Generating `.dart`, `.kt`, or `.swift` source files. The mobile targets are placeholder until the human flips the switch.
- Adding Storybook beyond the stub config. The trigger is "component count > 10".
- Modifying `playwright.config.ts` or committed snapshot PNGs without an explicit "update baselines" instruction.
