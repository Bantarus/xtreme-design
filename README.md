# dsx

**Fastest iterative design workflow with a scoped probabilistic surface — DESIGN.md is the only thing the agent edits.**

The agent has zero write access outside `DESIGN.md`. Everything else — the gallery, the components, the build outputs, the version snapshots — is rendered deterministically from `DESIGN.md` by `scripts/pipeline.mjs`. You iterate by writing prose; the pipeline does the rest.

## The four commands

```
/design "<brief>"            generate a fresh DESIGN.md from the best-matching reference
/tweak "<adjustment>"        surgically edit the active DESIGN.md
/snapshot "<name>"           rename the most recent auto-version slot
/restore <id-or-name>        load a saved version's DESIGN.md back into the active surface
```

Behind these: `scripts/pipeline.mjs` runs after every assistant turn (Stop hook), lint-checks DESIGN.md, exports `apps/gallery/app/tokens.active.css`, rebuilds Style Dictionary outputs, and auto-snapshots a new version slot. The `?v=<id>` URL parameter does instant CSS-swap on the gallery without a Next.js rebuild. `/compare?a=<id>&b=<id>` renders two iframes side-by-side.

## Quickstart

```bash
pnpm install                                          # one-time setup
pnpm exec playwright install chromium                 # one-time, optional
pnpm dev                                              # watcher + gallery on :3000
```

That's it. Open `http://localhost:3000`, run a slash command in Claude Code, watch the gallery hot-reload.

See [KNOWN-ISSUES.md](KNOWN-ISSUES.md) for documented deviations.

## Install MCP servers (one-time, user-scoped)

```bash
claude mcp add playwright -- npx -y @playwright/mcp@latest
claude mcp add shadcn -- npx -y shadcn@latest mcp
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
```

## Layout

```
.
├── DESIGN.md                          the agent's only surface
├── base.DESIGN.md                     immutable reference (never overwritten)
├── tokens/                            DTCG token sources (multi-platform fan-out)
├── style-dictionary.config.mjs
├── build/                             SD outputs (gitignored except .gitkeep)
├── apps/gallery/                      Next.js 15 + Tailwind v4 + shadcn 4.7
├── .dsx/
│   ├── references/                    bundled reference corpus (8 files, keyword-scored)
│   └── versions/                      snapshot store ({id}/DESIGN.md, tokens.css, …)
├── .claude/                           agents, commands, skills, hooks
├── scripts/                           pipeline, watcher, snapshot, restore, fence
└── tests/visual/                      Playwright baselines
```

## The constraint

`scripts/agent-surface-fence.mjs` is a PreToolUse hook. It rejects Write/Edit on every path except `DESIGN.md`, exit code 2, with a verbose message pointing the agent at the pipeline. If the fence ever feels wrong, **that** is the bug — the template assumes the agent never edits gallery, scripts, or config. See [docs/agent-rules.md](docs/agent-rules.md).

## Storybook

Deferred. See [STORYBOOK.md](STORYBOOK.md).
