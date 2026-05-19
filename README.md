# dsx

**Fastest iterative design workflow with a scoped probabilistic surface.**

The agent has zero write access outside two narrow surfaces. Everything visible — the gallery, the components, the Storybook config, the build outputs, the version snapshots — is rendered deterministically from those surfaces by `scripts/pipeline.mjs` and Storybook's dev server. You iterate by writing prose and CSF3; the pipeline does the rest.

## Two surfaces

| Chapter | Writable surface | Canvas | Slash commands |
|---|---|---|---|
| 1 — Design system | `DESIGN.md` (root) | Gallery (Next.js, :3000) | `/design`, `/tweak`, `/snapshot`, `/restore` |
| 2 — Page composition | `apps/storybook/src/**/*.stories.{ts,tsx}` | Storybook (Vite, :6006) | `/page`, `/section`, `/refine` |

The two chapters share one design system. Editing `DESIGN.md` re-themes everything in the gallery AND every story in Storybook. The version-aware decorator lets you A/B any story across every saved palette without rebuilding.

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

Behind these: `scripts/pipeline.mjs` runs after every assistant turn (Stop hook), lint-checks DESIGN.md, exports `apps/gallery/app/tokens.active.css`, rebuilds Style Dictionary outputs, auto-snapshots a new version (dedupes via tokens.css sha256), and mirrors the version store into Storybook's `public/versions/`. The `?v=<id>` URL parameter does instant CSS-swap on the gallery without a Next.js rebuild; the Storybook toolbar paintbrush does the same for every story without restarting Storybook. `/compare?a=<id>&b=<id>` renders two gallery iframes side-by-side.

## Quickstart

```bash
pnpm install                                          # one-time setup
pnpm exec playwright install chromium                 # one-time, optional
pnpm pipeline                                         # one-time seed (writes mirror outputs)
pnpm dev                                              # watcher + gallery :3000 + storybook :6006
```

That's it. Open `http://localhost:3000` for the component gallery, `http://localhost:6006` for the composition canvas, and run a slash command in Claude Code. Both canvases hot-reload.

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
├── .claude/                           agents, commands, skills, hooks
├── scripts/                           pipeline, watcher, snapshot, restore, mirror, fence
└── tests/visual/                      Playwright baselines (gallery only)
```

## The constraint

`scripts/agent-surface-fence.mjs` is a PreToolUse hook. It rejects Write/Edit on every path except `DESIGN.md` and `apps/storybook/src/**/*.stories.{ts,tsx}`, exit code 2, with a verbose message pointing the agent at the pipeline. If the fence ever feels wrong, **that** is the bug — the template assumes the agent never edits gallery, components, scripts, or config. See [AGENTS.md](AGENTS.md).
