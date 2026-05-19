# APM spike — one-pager (2026-05-19, revised)

> Goal: figure out whether [microsoft/apm](https://github.com/microsoft/apm) can be the substrate for making dsx model/agent-agnostic. Author primitives once, deploy per target (`claude`, `cursor`, `codex`, `copilot`, `opencode`, …), `apm install bantarus/dsx` from any client.

## TL;DR

**Yes — APM is ready today.** A first pass of this spike got the wrong answer because I ran `apm compile` (which only emits AGENTS.md / CLAUDE.md from instruction primitives) and concluded skills / agents / commands / hooks weren't supported. They are — by `apm install`, not `apm compile`. With correctly-named primitives and `targets:` declared, a single `apm install` deploys **17 files across 5 client roots** (`.claude/`, `.github/`, `.cursor/`, `.codex/`, `.opencode/`) and translates each to its target idiom (TOML for codex agents, `.mdc` for cursor rules, `settings.json` merge for claude hooks). **Recommendation flipped: migrate dsx to be APM-native as chapter 3.**

> An earlier revision of this document concluded "not yet." That conclusion was wrong; it came from testing the wrong command. The findings below override it.

## What I tested (corrected)

1. `apm init dsx-plugin --plugin --yes` in `/tmp/dsx-apm-spike/`.
2. Authored five primitives under `.apm/` with the spec-mandated filename suffixes:
   - `.apm/skills/composition-patterns/SKILL.md` (copied verbatim from `.claude/skills/composition-patterns/SKILL.md`)
   - `.apm/agents/token-guardian.agent.md` (copied + renamed from `.claude/agents/token-guardian.md`)
   - `.apm/prompts/page.prompt.md` (copied + renamed from `.claude/commands/page.md`)
   - `.apm/instructions/dsx-guard.instructions.md` (fixture; needs `applyTo:` frontmatter)
   - `.apm/hooks/pipeline.json` (dsx's existing Stop + PostToolUse hooks in APM's JSON shape)
3. Declared `targets: [claude, copilot, cursor, codex, opencode]` in `apm.yml`.
4. Pre-created the five target deploy roots so APM detects each. Ran `apm install --verbose`.

## What `apm install` actually emits

One install. 17 files. Per-target translation handled automatically.

```
.claude/agents/token-guardian.md            ← from .apm/agents/token-guardian.agent.md
.claude/commands/page.md                    ← from .apm/prompts/page.prompt.md
.claude/rules/dsx-guard.md                  ← from .apm/instructions/dsx-guard.instructions.md
.claude/skills/composition-patterns/SKILL.md ← copied
.claude/settings.json                       ← from .apm/hooks/pipeline.json (merged)
.claude/apm-hooks.json                      ← extra copy (provenance)

.github/agents/token-guardian.agent.md      ← keeps APM-native suffix
.github/instructions/dsx-guard.instructions.md
.github/prompts/page.prompt.md              ← keeps .prompt.md (Copilot native)
.github/hooks/dsx-plugin-pipeline.json

.cursor/agents/token-guardian.md
.cursor/commands/page.md
.cursor/rules/dsx-guard.mdc                 ← renamed to .mdc + frontmatter rewrite
.cursor/hooks.json

.codex/agents/token-guardian.toml           ← translated to TOML format!
.codex/hooks.json

.opencode/agents/token-guardian.md
.opencode/commands/page.md
.agents/skills/composition-patterns/SKILL.md  ← codex skills go here per spec
```

Notable translations:

- **Codex agents** are rewritten from frontmatter+markdown to a `.toml` document with `name`, `description`, `developer_instructions` fields — APM owns the format conversion.
- **Cursor rules** rename `applyTo:` → `globs:` and the file extension to `.mdc`.
- **Claude hooks** merge into `settings.json`; **Cursor hooks** get their own `hooks.json`; **Codex** gets `.codex/hooks.json`. APM honors each target's hook idiom.
- **OpenCode skips hooks** (no support, per the spec matrix) — silently, no error.

## What was wrong with the first attempt

| Mistake | What I did | What I should have done |
|---|---|---|
| Used the wrong command | `apm compile --target claude` | `apm install --target claude` |
| Conflated APM's two phases | Treated compile as "the deploy step" | `compile` is for AGENTS.md/CLAUDE.md generation only; `install` is what deploys primitives to client roots |
| Missed file suffix requirements | Named files `test.skill.md`, `test.agent.md` | Skills must be `SKILL.md` inside a `<slug>/` dir; agents need `*.agent.md` (or `*.chatmode.md`); prompts need `*.prompt.md`; instructions need `*.instructions.md` |
| Didn't declare `targets:` | Left it auto-detected (which chose only one target) | Explicit `targets: [claude, copilot, cursor, codex, opencode]` in apm.yml unlocks multi-target deploy |

The apm-cli / apm-packaging / apm-distribution skills the user added to this repo would have prevented all four mistakes if I'd loaded them before testing.

## What this means for dsx — the actual migration

The migration is **mostly file moves and renames**, plus an `apm.yml`. No CLI scripting on our side.

### Move map

| From | To | Note |
|---|---|---|
| `.claude/agents/<n>.md` | `.apm/agents/<n>.agent.md` | rename suffix |
| `.claude/commands/<n>.md` | `.apm/prompts/<n>.prompt.md` | rename suffix; "command" → "prompt" in APM vocab |
| `.claude/skills/<n>/SKILL.md` | `.apm/skills/<n>/SKILL.md` | structure-identical; just move dir |
| `.claude/settings.json` hooks | `.apm/hooks/dsx-pipeline.json` | extract the hook block (lose PreToolUse fence — see below) |

### Stays where it is

- `scripts/*.mjs` — APM doesn't manage scripts. Hooks reference `node scripts/<x>.mjs`; the scripts must exist at the project root. This is fine: dsx is a TEMPLATE you clone, not a library you depend on.
- `apps/gallery/`, `apps/storybook/`, `tokens/`, `DESIGN.md`, `base.DESIGN.md`, `style-dictionary.config.mjs`, `tests/visual/`, `.dsx/` — everything domain-specific to dsx stays as-is. APM only manages the agent layer.
- `AGENTS.md` — stays hand-authored. APM CAN generate it via `apm compile`, but we already have a curated one. Use `apm compile --target all` only if/when we want to distribute instructions across nested directories.

### Generated (gitignore)

- `.claude/`, `.cursor/`, `.codex/`, `.github/copilot-instructions.md`, `.opencode/`, `.agents/` — emitted by `apm install`. Gitignore them and rely on `apm install` as a setup step.
- `apm_modules/` — APM cache for external dependencies (we have none today; future-proof).
- `apm.lock.yaml` — COMMIT this. It's the lockfile.

### New top-level files

- `apm.yml` — manifest declaring name, version, `targets: [claude, copilot, cursor, codex, opencode]`, no dependencies (dsx is self-contained for now).
- `plugin.json` — optional, only if we eventually ship dsx as a distributable plugin via `apm pack --format plugin`. Defer.

### One real loss

**The fence (`scripts/agent-surface-fence.mjs`)** currently reads Claude Code's PreToolUse hook payload (stdin JSON with `tool_name` and `tool_input.file_path`). APM ships the hook config to every target's idiom — but the fence SCRIPT's payload parsing is Claude-specific. On Codex / Cursor / Copilot, the hook would fire but the script wouldn't understand the input.

Two ways to handle:

1. **Keep the fence Claude-only, document the gap.** The AGENTS.md prose already names the two surfaces; non-Claude tools rely on prose enforcement. The script becomes "Claude Code accelerator," not "universal enforcement." Cost: zero, just docs.
2. **Generalize the fence.** Detect payload shape at runtime — sniff for `tool_name` + `tool_input.file_path` (Claude) vs whatever Codex/Cursor send. Adds ~30 lines to the script. Worth doing once we test under another client; not blocking.

Either way, the user already disabled the PreToolUse fence during active dev. Even on Claude this isn't on right now.

## Recommended chapter 3 plan

Three phases. Each independently revertable. Targeting ~2–3 hours of focused work plus testing under each available client.

### Phase 1 — restructure the agent layer (1 hour)

1. Write `apm.yml` declaring all five targets.
2. Move `.claude/agents/*.md` → `.apm/agents/*.agent.md`.
3. Move `.claude/commands/*.md` → `.apm/prompts/*.prompt.md`.
4. Move `.claude/skills/<n>/SKILL.md` → `.apm/skills/<n>/SKILL.md` (just `git mv` the dirs).
5. Extract hook block from `.claude/settings.json` → `.apm/hooks/dsx-pipeline.json`.
6. Run `apm install` once. Verify the regenerated `.claude/` matches the old shape (byte-equal where possible, modulo APM's structured-matcher object form for hooks).
7. Add `.claude/ .cursor/ .codex/ .github/copilot-instructions.md .opencode/ .agents/ apm_modules/` to `.gitignore`. Commit `.apm/`, `apm.yml`, `apm.lock.yaml`.

### Phase 2 — verify each target (variable, depends on what's installed)

Whichever clients are available locally:

1. **Claude Code**: should be byte-identical behavior to chapter 2. Smoke `/page "a brief"` end-to-end.
2. **Codex** (if installed): smoke the same brief in chat form. Skills/agents auto-discovered from `.codex/` + `.agents/`. Confirm hook fires (`.codex/hooks.json`).
3. **Cursor** (if installed): same.
4. **Copilot** (gh copilot, gh-copilot-cli): same.

For each: document the UX delta in `KNOWN-ISSUES.md`. Codex has no slash-command equivalent, so `/page` becomes "prose with the keyword 'page' which the prompt's content guides the model toward."

### Phase 3 — docs + onboarding (30 min)

1. Replace `README.md`'s "First-run setup" with `pnpm install && apm install && pnpm dev`.
2. Update `STORYBOOK.md` + `AGENTS.md` to mention multi-client support.
3. Add a "supported clients" line to README — "any client APM supports: Claude Code, Codex, Cursor, Copilot CLI, OpenCode."
4. Decide whether to publish `dsx` itself as an APM package on a marketplace (defer to chapter 4 if so — gets us `apm install bantarus/dsx` as a one-liner for new projects).

## Open questions for chapter 3

1. **Should the fence be generalized or stay Claude-only?** My take: stay Claude-only for now, document the gap. Revisit after we have a non-Claude user reporting they want it enforced.
2. **Hook matcher shape.** APM emits the structured form (`"matcher": { "tool_name": "..." }`). Claude Code's existing settings.json uses the string form. Both work in Claude 2.x but worth verifying with a quick smoke test before phase 1 ends.
3. **The `.claude/apm-hooks.json` artifact.** APM writes a separate file alongside `.claude/settings.json` as provenance. Harmless but adds one new tracked-or-ignored file. Probably gitignore alongside the rest of `.claude/`.
4. **Storybook reference skills (12 of them).** They live under `.claude/skills/storybook-*/`. If we want them deployed to ALL clients too, move them under `.apm/skills/`. If they're Claude-only reference material, leave them where they are (the fence has them ignored already). My recommendation: move them — there's no reason a Cursor user shouldn't get the same reference docs auto-loaded.

## Cleanup

Spike scratch is at `/tmp/dsx-apm-spike/`. Nothing in the dsx repo has changed.
