# CLAUDE.md — dsx (design system iteration template)

**Two writable surfaces, no more.** Everything visible — the gallery, the components, the Storybook config, the build outputs, the version snapshots — is rendered deterministically from these two surfaces:

1. **`DESIGN.md`** (chapter 1) — the active design system. `/design` and `/tweak` write here; the pipeline regenerates every visual artifact from this one file.
2. **`apps/storybook/src/**/*.stories.{ts,tsx}`** (chapter 2) — page and section compositions. `/page`, `/section`, and `/refine` write here; Storybook hot-reloads them in place. Every story inherits the active palette through the version-aware decorator.

If a task requires touching anything else (a bug in the gallery, a script update, a config change), **stop and explain to the user**; they will handle it manually. The `scripts/agent-surface-fence.mjs` PreToolUse hook enforces this mechanically — Write/Edit on any other path exits 2.

## Read first

The full set of rules lives in [AGENTS.md](AGENTS.md). **Read it before doing anything.** This file just layers Claude-specific shortcuts on top.

## Where the harness lives

dsx ships its agent harness (slash commands, subagents, skills, hooks) under [.apm/](.apm/) and lets `apm install` deploy it to every locally-installed client. Under Claude Code that lands in `.claude/`:

- **Slash commands** (sourced from `.apm/prompts/`, deployed to `.claude/commands/`):
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
- **Subagents** (sourced from `.apm/agents/`, deployed to `.claude/agents/`): `token-guardian`, `screenshot-critic`, `port-flutter`, `port-compose`.
- **Hooks** (sourced from `.apm/hooks/`, deployed to `.claude/settings.json`):
  - **PreToolUse** runs `agent-surface-fence.mjs` (currently disabled via `.apm/hooks/dsx-fence.json.disabled` during active dev — rename to enable).
  - **PostToolUse** runs Biome format.
  - **Stop** runs `scripts/pipeline.mjs` — lint, export, Style Dictionary build, auto-snapshot.
- **Skills** (sourced from `.apm/skills/<name>/SKILL.md`, deployed to `.claude/skills/<name>/`):
  - dsx-specific: `tailwind-v4-shadcn`, `design-tokens-dtcg`, `flutter-port`, `shadcn-component-catalog`, `storybook-csf3`, `composition-patterns`.
  - Storybook 10 reference: `storybook-*` (12 skills, auto-loaded when relevant).
  - APM reference: `apm-cli`, `apm-packaging`, `apm-distribution` (load when working on the harness itself).

**Don't edit anything under `.claude/`** — it's a generated output. Edit `.apm/<...>` and ask the human to run `apm install`. (And editing `.apm/` itself is still outside the two writable surfaces; surface a change request.)

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
