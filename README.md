# dsx — agent-native design system

A web-first monorepo for an agent-native design system. DESIGN.md is the prose source of truth; DTCG tokens in `tokens/` fan out to CSS, Tailwind, Flutter, Compose, and SwiftUI via Style Dictionary.

## Stack

- **pnpm** workspaces + **Turborepo**
- **Next.js 15.5.16** (App Router, RSC) + **Tailwind v4** + **shadcn CLI 3.0**
- **DESIGN.md** (Google Labs) as prose source of truth
- **Style Dictionary v4** with DTCG 2025.10 tokens for multi-platform fan-out
- **Playwright MCP** for visual regression + screenshot critique
- **Biome** for lint/format

## First-run setup

```bash
pnpm install
pnpm tokens                       # Style Dictionary multi-platform build
pnpm --filter gallery dev         # http://localhost:3000
```

### Install MCP servers (one-time, user-scoped)

These are not pinned in this repo — install them once per machine:

```bash
# Browser automation for visual regression + screenshot critique
claude mcp add playwright -- npx -y @playwright/mcp@latest

# shadcn registry-aware install/upgrade
claude mcp add shadcn -- npx -y shadcn@latest mcp

# Optional, recommended: live debugging
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest

# Optional: install Google's design-md skill globally
npx -y skills add google-labs-code/stitch-skills --skill design-md --global
```

## Workflow

1. Edit `DESIGN.md` for brand/prose; edit `tokens/` for DTCG values.
2. `pnpm tokens` rebuilds CSS/Tailwind/Dart/Kotlin/Swift outputs in `build/`.
3. `pnpm design:lint` validates DESIGN.md.
4. `pnpm design:sync` checks DESIGN.md and `tokens/` for drift.
5. `pnpm test:visual` runs Playwright snapshots at 360/768/1280.

## Subagents and slash commands

See `.claude/agents/` and `.claude/commands/`. The full reference-driven loop (`/design`, `/tweak`, `/snapshot`, `/restore`) is wired up in Phase 5. Today the utilities are:

- `/tokens-build` — rebuild Style Dictionary outputs and report diff.
- `/design-lint` — run DESIGN.md lint.
- `/screenshot <url>` — capture 360/768/1280 screenshots via Playwright MCP.

## Storybook

Not configured yet — stub will be enabled once component count > 10. See [TODO in Phase 4 docs].

## Layout

```
.
├── DESIGN.md                  prose source of truth
├── tokens/                    DTCG 2025.10 JSON (parallel source of truth)
├── style-dictionary.config.mjs
├── build/                     Style Dictionary outputs (gitignored)
├── apps/gallery/              Next.js 15.5.16 + Tailwind v4 + shadcn (the canvas)
├── apps/mobile-{flutter,compose,swiftui}/   placeholders
├── registry/                  custom shadcn registry (@dsx)
├── .claude/                   agents, commands, skills, hooks
├── scripts/                   policy scripts (hex blocker, token rebuild, sync)
└── tests/visual/              Playwright baselines
```
