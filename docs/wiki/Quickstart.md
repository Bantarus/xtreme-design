# Quickstart

A fresh-clone-to-first-iteration walkthrough. Target time: ~10 minutes.

## Prerequisites

- **Node.js 20+** (the repo uses Next.js 15 + Vite + Storybook 10)
- **pnpm 9+** — `npm i -g pnpm`
- **An AI coding client** — at least one of Claude Code, Codex CLI, Cursor, GitHub Copilot CLI, or OpenCode
- **APM** (Agent Package Manager) — installs the agent harness for every client
  - Linux/macOS: `curl -sSL https://aka.ms/apm-unix | sh`
  - Windows: `irm https://aka.ms/apm-windows | iex`

## 1. Clone

```bash
git clone https://github.com/Bantarus/xtreme-design.git
cd xtreme-design
```

## 2. Install

```bash
pnpm install                                  # node deps
apm install                                   # deploy agent harness to your client(s)
pnpm exec playwright install chromium         # optional, for visual tests + screenshot agents
pnpm pipeline                                 # one-time seed (writes tokens.active.css + storybook mirror)
```

`apm install` is what makes Xtreme Design **multi-client**. The agent harness (slash commands, subagents, skills, hooks) lives once under `.apm/` and is translated to each AI client's native config:

| Client | Deploys to |
|---|---|
| **Claude Code** | `.claude/` |
| **Codex CLI** | `.codex/`, `.agents/` |
| **Cursor** | `.cursor/` |
| **GitHub Copilot CLI** | `.github/` |
| **OpenCode** | `.opencode/` |

Don't edit anything under those generated directories — APM regenerates them. The canonical source is `.apm/`.

## 3. Run the dev environment

```bash
pnpm dev
```

This starts three processes in parallel:

- **Gallery** at <http://localhost:3000> — Next.js, renders every component in the active palette
- **Storybook** at <http://localhost:6006> — Vite, hand-authored page and section compositions
- **Watcher** — reruns the pipeline whenever `DESIGN.md` changes

Open both URLs. The gallery shows the live Helios design system (the immutable base reference). The Storybook canvas shows whatever pages and sections live under `apps/storybook/src/`.

## 4. Your first design iteration

In your AI client, run:

```
/design "minimal SaaS dashboard, deep navy primary, off-white cards, generous whitespace"
```

What happens behind the scenes:

1. `find-reference.mjs` scores `.dsx/references/*.md` against your brief and picks the closest match.
2. The agent reads the reference, then writes a fresh `DESIGN.md` mutating it toward your brief (palette shifted, typography kept compatible, spacing/radii adjusted).
3. The **Stop hook** runs `scripts/pipeline.mjs`:
   - `design-md lint DESIGN.md` (validates structure)
   - `design-md-to-css.mjs` → `apps/gallery/app/tokens.active.css`
   - `pnpm tokens` (Style Dictionary multi-platform fan-out)
   - `snapshot.mjs --auto` (saves a new version, deduped by tokens.css sha256)
   - `mirror-storybook-versions.mjs` (publishes the version into Storybook's toolbar picker)
4. The gallery hot-reloads in ~50 ms. Every saved palette is visible in the version picker at the top.

## 5. Iterate

Don't like the result? Surgical tweak:

```
/tweak "darker primary, tighten spacing by 20%, soften corner radii"
```

`/tweak` makes small, targeted edits — it never rewrites the whole file. The Stop hook re-runs the pipeline and the gallery updates.

## 6. Save a name

```
/snapshot "indie-saas-v1"
```

This renames the most recent auto-snapshot from `vN` to `indie-saas-v1`, so you can find it again later by name.

## 7. Switch versions

Click any chip in the gallery's version picker at <http://localhost:3000>. Or visit a deep link:

```
http://localhost:3000/?v=indie-saas-v1
http://localhost:3000/components/button?v=indie-saas-v1
http://localhost:3000/tokens?v=indie-saas-v1
```

The version picker injects the matching `<link rel="stylesheet">` at the end of `<head>`. CSS variables re-resolve; the page re-paints; **no rebuild, no React re-render**.

## 8. Compose a page

Switch to chapter 2:

```
/page "pricing page with three tiers and a monthly/annual toggle"
```

`find-page-reference.mjs` scores `.dsx/page-references/*.stories.tsx`, picks the closest, and writes a new story file at `apps/storybook/src/pages/<slug>.stories.tsx`. Storybook hot-reloads. The story inherits the active palette automatically via the version-aware decorator.

Switch palettes in Storybook's toolbar paintbrush. Same story, different palette, no story re-authoring.

## Where to go next

- **[Manual](Manual)** — comprehensive reference for everything.
- **AGENTS.md** in the repo — the contract that every AI client follows.
- **`.dsx/references/`** in the repo — read the bundled corpus to understand what `/design` is anchoring against.
- **`base.DESIGN.md`** in the repo root — the immutable Helios reference. Read it once; it defines the schema every direction must satisfy.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `apm: command not found` | Install APM via the curl/iwr script above. |
| Gallery shows "Loading versions…" forever | Run `pnpm pipeline` once to seed `.dsx/versions/_index.json`. |
| Storybook toolbar picker has no versions | Run `node scripts/mirror-storybook-versions.mjs`. |
| Slash commands missing in your client | Re-run `apm install`. Confirm `.claude/` (or your client's directory) was regenerated. |
| Visual tests fail with diff | Expected during `/design`/`/tweak` — the baseline is pinned to `base`. Run `pnpm test:visual --update-snapshots` only when `base` itself moves. |

See the [Manual](Manual) for the deeper troubleshooting section.
