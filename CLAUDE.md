# CLAUDE.md — dsx (design system iteration template)

**DESIGN.md is the only file you write.** Everything else — the gallery, the components, the build outputs, the version snapshots — is rendered deterministically from DESIGN.md by the pipeline. If a task requires touching anything else (a bug in the gallery, a script update, a config change), **stop and explain to the user**; they will handle it manually. The Phase 1 fence (`scripts/agent-surface-fence.mjs`) enforces this mechanically — Write/Edit on any path other than `DESIGN.md` exits 2.

## Read first

The full set of rules lives in [docs/agent-rules.md](docs/agent-rules.md). **Read it before doing anything.** Non-Claude agents read the same rules via [AGENTS.md](AGENTS.md).

## Claude-specific shortcuts

- **Slash commands** under `.claude/commands/`:
  - `/design "<brief>"` — generate a fresh DESIGN.md from a reference + brief.
  - `/tweak "<adjustment>"` — surgically edit the active DESIGN.md.
  - `/snapshot "<name>"` — rename the most recent version slot.
  - `/restore <id-or-name>` — load a saved version's DESIGN.md back into the active surface.
  - `/tokens-build`, `/design-lint`, `/screenshot <url>` — utilities.
- **Subagents** under `.claude/agents/`: `token-guardian`, `screenshot-critic`, `port-flutter`, `port-compose`. (No `/variant` — per-component stylistic exploration is a different product.)
- **Hooks** in `.claude/settings.json`:
  - **PreToolUse** runs `agent-surface-fence.mjs` on Write/Edit/MultiEdit — rejects every path except `DESIGN.md`.
  - **PostToolUse** runs Biome format (no-op outside DESIGN.md).
  - **Stop** runs `scripts/pipeline.mjs` — lint, export, Style Dictionary build, auto-snapshot.
- **Skills** under `.claude/skills/`: `tailwind-v4-shadcn`, `design-tokens-dtcg`, `flutter-port`.

## The shortest path through a brief

1. Read `DESIGN.md` so you know what's currently active.
2. Pick the right slash command (`/design` for a new direction, `/tweak` for a refinement).
3. Edit `DESIGN.md` only. Mutate tokens and prose surgically; don't rewrite the whole file unless `/design` says so.
4. Let the Stop hook run the pipeline. It lints, exports, rebuilds, snapshots, and tells you the URL to view.
5. Output a one or two sentence summary: what shifted in DESIGN.md and what the human should look at in the gallery.

## When you disagree with the brief

Surface the disagreement in your reply. Do not silently subvert the user's instruction by editing DESIGN.md to your own preference. If the brief is ambiguous, ask one clarifying question before writing.

## When you finish

One or two sentence summary. No commit (the human commits). The Stop hook prints the pipeline result; cite it.
