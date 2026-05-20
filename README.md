<p align="center">
  <img src="assets/x3-quadrant-stripe-stack-dark.svg" alt="Xtreme Design" width="320" />
</p>

# Xtreme Design

**Fastest, easiest and cheapest ai driven iterative design workflow with DESIGN.md as a scoped probabilistic surface.**

The agent has zero write access outside two narrow surfaces. Everything visible — the gallery, the components, the Storybook config, the build outputs, the version snapshots — is rendered deterministically from those surfaces by `scripts/pipeline.mjs` and Storybook's dev server. You iterate by writing prose and CSF3; the pipeline does the rest.

## Two surfaces

| Chapter | Writable surface | Canvas | Slash commands |
|---|---|---|---|
| 1 — Design system | `DESIGN.md` (root) | Gallery (Next.js, :3000) | `/design`, `/tweak`, `/snapshot`, `/restore` |
| 2 — Page composition | `apps/storybook/src/**/*.stories.{ts,tsx}` | Storybook (Vite, :6006) | `/page`, `/section`, `/refine` |

## The story × design matrix

Every Storybook page or section you author instantly re-paints under any saved palette — no rebuild, no recompile, no React re-render. The Storybook toolbar paintbrush and the gallery's `?v=<id>` URL parameter both do **CSS-cascade swaps**: a custom decorator injects `<link rel="stylesheet" href="/versions/<id>/tokens.css">` at the end of `<head>`; the browser re-resolves `:root { --color-* }` in ~50 ms.

What this buys you:
- **One palette × N stories** — test the camping-gear palette on a SaaS landing, a dashboard, a settings screen, and a 404, in five clicks. No story re-authoring.
- **N palettes × one story** — review a hand-authored hero across every palette you've ever saved. No rebuild loop.
- **Side-by-side A/B** — `http://localhost:3000/compare?a=base&b=camping-v1` renders the gallery in both palettes in two iframes. Same trick works for ad-hoc design reviews.
- **Live tracking** — the `active` toolbar choice keeps the story bound to live `DESIGN.md`; iterating with `/tweak` shows up in every open story tab within ~50 ms of save.

The story stays yours; the design iterates independently. ([apps/storybook/.storybook/decorators/ActiveStylesheet.tsx](apps/storybook/.storybook/decorators/ActiveStylesheet.tsx) is the 30-line decorator; native Storybook plumbing — `globalTypes.designVersion.toolbar` — drives it.)

## The seven commands

```
# Chapter 1 — DESIGN.md
/design "<brief>"            generate a fresh DESIGN.md from the nearest reference
/tweak "<adjustment>"        surgically edit the active DESIGN.md
/snapshot "<name>"           rename the most recent auto-version slot
/restore <id-or-name>        load a saved version's DESIGN.md back into the active surface

# Chapter 2 — Storybook
/page "<brief>"              compose a full-page story from the nearest page reference
/section "<brief>"           compose a single-section story (hero, pricing block, CTA, …)
/refine <slug> "<adj>"       surgical edit of an existing story
```

Behind these: `scripts/pipeline.mjs` runs after every assistant turn (Stop hook), lint-checks DESIGN.md, exports `apps/gallery/app/tokens.active.css`, rebuilds Style Dictionary outputs, auto-snapshots a new version (dedupes via tokens.css sha256), and mirrors the version store into Storybook's `public/versions/` so the toolbar picker (see above) finds it.

## Quickstart

```bash
pnpm install                                          # one-time setup
apm install                                           # deploy the agent harness to your client(s)
pnpm exec playwright install chromium                 # one-time, optional
pnpm pipeline                                         # one-time seed (writes mirror outputs)
pnpm dev                                              # watcher + gallery :3000 + storybook :6006
```

`apm install` is what makes dsx multi-client. The agent harness (slash commands, subagents, skills, hooks) lives once under [.apm/](.apm/) and is deployed to every locally-installed AI coding tool's native config root:

| Client | Deploys to | Native primitives that work |
|---|---|---|
| **Claude Code** | `.claude/` | agents, commands, skills, hooks |
| **Codex CLI** | `.codex/`, `.agents/` | agents (TOML), skills, hooks |
| **Cursor** | `.cursor/` | agents, commands, skills (.mdc rules), hooks |
| **GitHub Copilot CLI** | `.github/` | prompts, agents, instructions, skills, hooks |
| **OpenCode** | `.opencode/` | agents, commands, skills |

APM handles per-target translation automatically (Codex agents become TOML, Cursor rules become `.mdc`, Claude hooks merge into `settings.json`, etc.). Don't edit anything under `.claude/`, `.cursor/`, etc. — those are regenerated outputs. The canonical source is `.apm/`.

If you don't have `apm` installed: `curl -sSL https://aka.ms/apm-unix | sh` (Linux/macOS) or `irm https://aka.ms/apm-windows | iex` (Windows). See [docs/apm-spike.md](docs/apm-spike.md) for the migration history.

That's it. Open `http://localhost:3000` for the component gallery, `http://localhost:6006` for the composition canvas, and run a slash command in your preferred client. Both canvases hot-reload.

See [STORYBOOK.md](STORYBOOK.md) for the chapter-2 walkthrough, [SKILLS.md](SKILLS.md) for the user-authored skill slots, and [KNOWN-ISSUES.md](KNOWN-ISSUES.md) for documented deviations.

## Install MCP servers (one-time, user-scoped)

```bash
claude mcp add playwright -- npx -y @playwright/mcp@latest
claude mcp add shadcn -- npx -y shadcn@latest mcp
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
```

## Layout

```
.
├── DESIGN.md                          chapter-1 surface
├── base.DESIGN.md                     immutable reference (never overwritten)
├── tokens/                            DTCG token sources (multi-platform fan-out)
├── style-dictionary.config.mjs
├── build/                             SD outputs (gitignored except .gitkeep)
├── apps/
│   ├── gallery/                       Next.js 15 + Tailwind v4 + shadcn 4.7 (chapter-1 canvas)
│   └── storybook/                     Storybook 10 + Vite + Tailwind v4 (chapter-2 canvas)
│       └── src/{pages,sections}/      chapter-2 surface (.stories.tsx)
├── .dsx/
│   ├── references/                    chapter-1 corpus (8 DESIGN.md files, keyword-scored)
│   ├── page-references/               chapter-2 corpus (10 .stories.tsx files, keyword-scored)
│   └── versions/                      snapshot store ({id}/DESIGN.md, tokens.css, meta.json)
├── .apm/                              CANONICAL agent harness (skills, prompts, agents, hooks)
│   ├── agents/                        subagents (*.agent.md)
│   ├── prompts/                       slash commands (*.prompt.md)
│   ├── skills/                        24 reference skills (apm-*, storybook-*, dsx-specific)
│   ├── hooks/                         pipeline + biome + (disabled) fence
│   └── instructions/                  reserved for AGENTS.md compilation (empty today)
├── apm.yml, apm.lock.yaml             APM manifest + lockfile
├── .claude/, .cursor/, .codex/, …    GENERATED by `apm install` (gitignored)
├── scripts/                           pipeline, watcher, snapshot, restore, mirror, fence
└── tests/visual/                      Playwright baselines (gallery only)
```

## The constraint

`scripts/agent-surface-fence.mjs` is a PreToolUse hook. It rejects Write/Edit on every path except `DESIGN.md` and `apps/storybook/src/**/*.stories.{ts,tsx}`, exit code 2, with a verbose message pointing the agent at the pipeline. If the fence ever feels wrong, **that** is the bug — the template assumes the agent never edits gallery, components, scripts, or config. See [AGENTS.md](AGENTS.md).
