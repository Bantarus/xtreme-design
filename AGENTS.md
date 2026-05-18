# AGENTS.md — dsx (design system iteration template)

**DESIGN.md is the only file you write.** Everything else — the gallery, the components, the build outputs, the version snapshots — is rendered deterministically from DESIGN.md by the pipeline. If a task requires touching anything else, **stop and explain to the user**; they will handle it manually. When Claude Code is running in parallel, the `scripts/agent-surface-fence.mjs` PreToolUse hook mechanically rejects Write/Edit on every path other than `DESIGN.md` — your output will be blocked the same way.

This file is for non-Claude tools (Codex, Cursor, Aider, Continue, etc.). Claude Code uses the equivalent [CLAUDE.md](CLAUDE.md).

## Read first

The full set of rules lives in [docs/agent-rules.md](docs/agent-rules.md). **Read it before doing anything.**

## Non-Claude-specific notes

- The `.claude/` directory exists for Claude Code's hooks, subagents, slash commands, and skills. Ignore those features; you do not invoke them. The policy is universal because it lives in `scripts/` (which runs from the human's terminal as well as from Claude's hooks).
- Scripts that may execute around your edits:
  - `scripts/agent-surface-fence.mjs` — rejects writes outside `DESIGN.md`.
  - `scripts/pipeline.mjs` — runs after every assistant turn (Stop hook in Claude; manual via `pnpm pipeline` otherwise). Lint, export, rebuild, snapshot.
  - `scripts/design-md-sync.mjs` — sanity-check between `DESIGN.md` and `base.DESIGN.md` token coverage.

## The shortest path through a brief

1. Read `DESIGN.md` so you know what's currently active.
2. Mutate `DESIGN.md` — tokens, prose, component slots. Surgical edits only; do not rewrite unless the brief is "redesign from scratch".
3. Run `pnpm pipeline` (the equivalent of Claude Code's Stop hook). It lints, exports, builds, and snapshots.
4. Tell the human what shifted in DESIGN.md and what they should inspect in the gallery.

## When you disagree with the brief

Surface the disagreement; do not silently subvert the user's instruction by editing DESIGN.md to your own preference.

## When you finish

One or two sentence summary. No commit (the human commits). The pipeline output is your handoff.
