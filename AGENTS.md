# AGENTS.md — dsx (design system iteration template)

**Two writable surfaces, no more.** Everything visible — the gallery, the components, the Storybook config, the build outputs, the version snapshots — is rendered deterministically from these two surfaces:

1. **`DESIGN.md`** (chapter 1) — the active design system. The pipeline regenerates every visual artifact from this file.
2. **`apps/storybook/src/**/*.stories.{ts,tsx}`** (chapter 2) — page and section compositions; Storybook hot-reloads them in place.

If a task requires touching anything else, **stop and explain to the user**; they will handle it manually. When Claude Code is running in parallel, the `scripts/agent-surface-fence.mjs` PreToolUse hook mechanically rejects Write/Edit on every other path — your output will be blocked the same way.

This file is for non-Claude tools (Codex, Cursor, Aider, Continue, etc.). Claude Code uses the equivalent [CLAUDE.md](CLAUDE.md).

## Read first

The full set of rules lives in [docs/agent-rules.md](docs/agent-rules.md). **Read it before doing anything.**

## Non-Claude-specific notes

- The `.claude/` directory exists for Claude Code's hooks, subagents, slash commands, and skills. Ignore those features; you do not invoke them. The policy is universal because it lives in `scripts/` (which runs from the human's terminal as well as from Claude's hooks).
- Scripts that may execute around your edits:
  - `scripts/agent-surface-fence.mjs` — rejects writes outside the two allowed surfaces.
  - `scripts/pipeline.mjs` — runs after every assistant turn (Stop hook in Claude; manual via `pnpm pipeline` otherwise). Lint, export, rebuild, snapshot.
  - `scripts/design-md-sync.mjs` — sanity-check between `DESIGN.md` and `base.DESIGN.md` token coverage.

## The shortest path through a brief

1. Read the active surface for the brief's chapter (`DESIGN.md` for system briefs; the target story for composition briefs).
2. Mutate that file surgically. Don't rewrite unless the brief says "from scratch".
3. Run `pnpm pipeline` (the equivalent of Claude Code's Stop hook). It lints, exports, builds, and snapshots. For chapter-2 work, Storybook's dev server hot-reloads on its own.
4. Tell the human what shifted and where to look.

## When you disagree with the brief

Surface the disagreement; do not silently subvert the user's instruction by editing the surface to your own preference.

## When you finish

One or two sentence summary. No commit (the human commits). The pipeline output is your handoff.
