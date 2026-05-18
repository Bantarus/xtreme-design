# CLAUDE.md — dsx (design system iteration template)

**Two writable surfaces, no more.** Everything visible — the gallery, the components, the Storybook config, the build outputs, the version snapshots — is rendered deterministically from these two surfaces:

1. **`DESIGN.md`** (chapter 1) — the active design system. `/design` and `/tweak` write here; the pipeline regenerates every visual artifact from this one file.
2. **`apps/storybook/src/**/*.stories.{ts,tsx}`** (chapter 2) — page and section compositions. `/page`, `/section`, and `/refine` write here; Storybook hot-reloads them in place. Every story inherits the active palette through the version-aware decorator.

If a task requires touching anything else (a bug in the gallery, a script update, a config change), **stop and explain to the user**; they will handle it manually. The `scripts/agent-surface-fence.mjs` PreToolUse hook enforces this mechanically — Write/Edit on any other path exits 2.

## Read first

The full set of rules lives in [docs/agent-rules.md](docs/agent-rules.md). **Read it before doing anything.** Non-Claude agents read the same rules via [AGENTS.md](AGENTS.md).

## Claude-specific shortcuts

- **Slash commands** under `.claude/commands/`:
  - Chapter 1 — DESIGN.md surface:
    - `/design "<brief>"` — generate a fresh DESIGN.md from a reference + brief.
    - `/tweak "<adjustment>"` — surgically edit the active DESIGN.md.
    - `/snapshot "<name>"` — rename the most recent version slot.
    - `/restore <id-or-name>` — load a saved version's DESIGN.md back into the active surface.
  - Chapter 2 — Storybook surface:
    - `/page "<brief>"` — compose a full-page story from a brief, mutated from the nearest reference.
    - `/section "<brief>"` — compose a smaller, single-section story.
    - `/refine <path-or-slug> "<adjustment>"` — surgical edit of an existing story.
  - Utilities: `/tokens-build`, `/design-lint`, `/screenshot <url>`.
- **Subagents** under `.claude/agents/`: `token-guardian`, `screenshot-critic`, `port-flutter`, `port-compose`.
- **Hooks** in `.claude/settings.json`:
  - **PreToolUse** runs `agent-surface-fence.mjs` on Write/Edit/MultiEdit/NotebookEdit — rejects every path except `DESIGN.md` and `apps/storybook/src/**/*.stories.{ts,tsx}`.
  - **PostToolUse** runs Biome format.
  - **Stop** runs `scripts/pipeline.mjs` — lint, export, Style Dictionary build, auto-snapshot.
- **Skills** under `.claude/skills/`:
  - `tailwind-v4-shadcn`, `design-tokens-dtcg`, `flutter-port` (chapter 1).
  - `shadcn-component-catalog`, `storybook-csf3`, `composition-patterns` (chapter 2 — user-authored).
  - `storybook-*` (Storybook 10 reference; loaded automatically when relevant).

## The shortest path through a brief

1. Read the active surface for the brief's chapter (`DESIGN.md` for system briefs; the target story for composition briefs).
2. Pick the right slash command (`/design` or `/tweak` for chapter 1; `/page`, `/section`, or `/refine` for chapter 2).
3. Mutate the file surgically. Don't rewrite unless the brief says "from scratch".
4. Let the Stop hook run the pipeline. For chapter-2 work, Storybook hot-reloads on its own.
5. Output a one- or two-sentence summary: what shifted, and where the human should look.

## When you disagree with the brief

Surface the disagreement in your reply. Do not silently subvert the user's instruction. If the brief is ambiguous, ask one clarifying question before writing.

## When you finish

One or two sentences. No commit (the human commits). The Stop hook prints the pipeline result; cite it.
