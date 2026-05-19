# APM spike — one-pager (2026-05-19)

> Goal: figure out whether [microsoft/apm](https://github.com/microsoft/apm) can be the substrate for making dsx model/agent-agnostic. Author primitives once, compile per target (`claude`, `cursor`, `codex`, `copilot`, …), `apm install bantarus/dsx` from any client.

## TL;DR

**Not yet.** The APM **spec** describes what we want (one source for skills, agents, commands, hooks, MCP — translated into seven client deploy roots). The APM **CLI** at the current release (`v0.14.0` tag, internal version `0.8.11`) implements only **one primitive type — `instructions`** — and emits only `AGENTS.md` / `CLAUDE.md` / `.github/copilot-instructions.md`. Skills, agents, commands, and hooks are documented but not yet compiled. dsx adopting APM today buys us nothing we don't already have (AGENTS.md is already the cross-tool contract). **Recommendation: don't migrate yet. Reassess at APM 1.0.**

## What I tested

1. Installed `apm` (already in `~/.local/bin`, version `0.8.11`). Confirmed: this *is* the latest release; Microsoft ships CLI 0.8.11 under the `v0.14.0` repo tag.
2. `apm init dsx-plugin --plugin --yes` → produces `apm.yml` + `plugin.json` (≈10 lines each). Clean, minimal.
3. Dropped four primitives into `.apm/`:
   - `.apm/instructions/page.instructions.md`
   - `.apm/agents/test.agent.md`
   - `.apm/skills/test.skill.md`
   - `.apm/commands/test.command.md`
   - `.apm/hooks/test.hook.md`
4. Ran `apm compile --target claude --verbose`.

## What apm actually emitted

| Primitive | What CLI did |
|---|---|
| `.apm/instructions/*.instructions.md` | ✅ Inlined into a generated `CLAUDE.md` at the project root |
| `.apm/agents/*.agent.md` | ⚠️ Validated frontmatter (warned about missing `description`); did **not** emit `.claude/agents/<n>.md` |
| `.apm/skills/*.skill.md` | ❌ Silently ignored — no warning, no output |
| `.apm/commands/*.command.md` | ❌ Silently ignored |
| `.apm/hooks/*.hook.md` | ❌ Silently ignored |

After compile: `dsx-plugin/AGENTS.md` and `dsx-plugin/CLAUDE.md` were both generated stub files referencing the instruction content. No `.claude/agents/`, `.claude/skills/`, `.claude/commands/` directories were created.

The targets matrix I cited earlier ([reference/targets-matrix.md](https://github.com/microsoft/apm/blob/main/docs/src/content/docs/reference/targets-matrix.md)) describes seven targets with per-primitive support boxes — but the CLI's `--target` flag only accepts `copilot | claude | cursor | opencode | codex | vscode | agents | all`. No `gemini`, no `windsurf`. The matrix is **forward-looking documentation**, not the current CLI surface.

## What this means for dsx

### What APM would actually do for us today

The single working primitive is `instructions`, which APM distributes into root `AGENTS.md` / `CLAUDE.md`. **We already do this:** AGENTS.md is the canonical contract; CLAUDE.md is a thin pointer to it (refactored yesterday). Adopting APM right now would only replace our hand-authored `AGENTS.md` with one generated from `.apm/instructions/*.instructions.md` fragments — same content, more indirection.

### What APM would NOT do for us today

- **Skills**: `.claude/skills/<n>/SKILL.md` doesn't get generated. The 16 skills we ship (3 user-authored + 12 storybook reference + 1 dsx-local) stay Claude-only.
- **Subagents**: `.claude/agents/*.md` doesn't get generated.
- **Slash commands**: `.claude/commands/*.md` doesn't get generated. `/page`, `/section`, `/refine`, `/design`, `/tweak`, `/snapshot`, `/restore` stay Claude-only.
- **Hooks**: `.claude/settings.json` hooks aren't synthesized. The fence (`scripts/agent-surface-fence.mjs`) and pipeline trigger (`scripts/pipeline.mjs` via Stop hook) stay Claude-only.

### The three independent problems

The user's original ask bundles three concerns. Untangling them:

1. **AGENTS.md as cross-tool rules** — **already solved.** We refactored yesterday. Every supported tool (25+ per agents.md) reads it.
2. **Slash commands / skills / subagents portable across tools** — **blocked on APM CLI feature completeness.** Spec is right; implementation isn't there. Realistic timeline: 6–18 months based on the gap between the documented matrix and what the CLI actually emits.
3. **Pipeline trigger that isn't Claude's Stop hook** — **solvable today, independently of APM.** `scripts/watch.mjs` (chokidar, already exists) watches `DESIGN.md`. We can promote it from "nice-to-have during `pnpm dev`" to "the canonical trigger; the Claude Stop hook is one of several optional kickers." Any tool — Claude, Codex, Cursor — that edits `DESIGN.md` triggers the watcher; the watcher runs the pipeline. The fence (`agent-surface-fence.mjs`) stays Claude-specific but becomes a soft-constraint everywhere else (AGENTS.md prose still says it).

## Recommended path forward

Three options, ordered by ambition:

### Option A — Decouple the trigger; defer APM (minimal, recommended)

Do problem (3) only. Make `scripts/watch.mjs` the **canonical** pipeline trigger, with the Claude `Stop` hook documented as one of several optional accelerators. Update `AGENTS.md` to say "the watcher runs after every save regardless of which agent edited the file." Effective result: dsx works under Codex / Cursor / Copilot today, with degraded UX (no slash commands, no skills auto-loading) but the loop is intact.

**Cost:** 1–2 hours. Mostly a docs change + a tiny `scripts/watch.mjs` polish + `package.json` script tweak.

**Buys us:** Codex / Cursor users can already iterate on `DESIGN.md` and see the gallery + Storybook update. They don't have `/design` / `/tweak` slash commands — they ask the agent in prose — but the deterministic loop still works.

### Option B — Adopt APM for AGENTS.md distribution only

Add `apm.yml` + `.apm/instructions/`, generate AGENTS.md from those fragments. **Cost:** half a day. **Buys us:** alignment with a Microsoft-backed convention, easier to plug in third-party APM packages later. **Downsides:** AGENTS.md becomes a generated artifact (commit-noise on every primitive edit), and we get nothing for skills/commands/hooks.

### Option C — Build our own cross-tool compiler

Write `scripts/compile-harness.mjs` that reads canonical primitives from a `harness/` directory and emits `.claude/`, `.cursor/`, `.codex/`, etc. trees. This is APM-the-spec but implemented for dsx specifically. **Cost:** 2–3 days. **Buys us:** what the user actually wanted. **Downsides:** we're rolling our own mini-APM, with all the maintenance that implies. We'd want to throw it away once APM CLI catches up.

## My recommendation

**Option A** for chapter 3. It's small, fully reversible, and gets non-Claude clients into the dsx loop today (in a degraded but functional way). It also makes the eventual APM migration trivial because we'll have already decoupled the trigger from any particular agent's hook semantics.

Defer Option B until APM CLI reaches v1.0 or until it ships a `skills` / `commands` / `hooks` compiler that actually emits `.claude/skills/` etc. We can revisit by re-running this spike on a future apm release; the four `apm compile` calls above are the entire test rig.

Skip Option C unless cross-tool slash commands become urgent enough to justify a custom solution that we'll then deprecate when APM catches up.

## Loose ends

- The `chokidar` watcher already exists but isn't part of the canonical loop description in `AGENTS.md` (we describe the Stop hook). Option A's main work is promoting it.
- The fence is the one Claude-specific primitive with no clean cross-tool story. Even APM's `hooks` primitive (when it ships) will struggle here because each tool has different hook-payload shapes. Option A simply leaves the fence as "Claude only; other tools rely on the AGENTS.md prose."
- If we want shareable dsx skills regardless of the tool (e.g., publish `composition-patterns` as a standalone package any project can `apm install`), we'd want `apm.yml` + `.apm/skills/` ready for the day APM ships the skill compiler. That's cheap insurance — could fold into Option A as "stage the skeleton, don't migrate."
