<p align="center">
  <img src="https://raw.githubusercontent.com/Bantarus/xtreme-design/main/assets/x3-quadrant-stripe-stack-dark.svg" alt="Xtreme Design" width="320" />
</p>

# Xtreme Design — Wiki

**Fastest, easiest and cheapest AI-driven iterative design workflow with `DESIGN.md` as a scoped probabilistic surface.**

The agent has zero write access outside two narrow surfaces. Everything visible — the gallery, the components, the Storybook config, the build outputs, the version snapshots — is rendered deterministically from those surfaces by `scripts/pipeline.mjs` and Storybook's dev server. You iterate by writing prose and CSF3; the pipeline does the rest.

---

## Start here

- **[Quickstart](Quickstart)** — install, first iteration, hello-world walkthrough. ~10 minutes.
- **[Manual](Manual)** — comprehensive reference: surfaces, slash commands, schema, version picker, pipeline internals, APM harness, troubleshooting.

## The two surfaces

| Chapter | Writable surface | Canvas | Slash commands |
|---|---|---|---|
| 1 — Design system | `DESIGN.md` (root) | Gallery (Next.js, :3000) | `/design`, `/tweak`, `/snapshot`, `/restore` |
| 2 — Page composition | `apps/storybook/src/**/*.stories.{ts,tsx}` | Storybook (Vite, :6006) | `/page`, `/section`, `/refine` |

If a task would write outside those paths, the harness either rejects it (via `scripts/agent-surface-fence.mjs`) or the agent escalates to the human. The constraint is the workflow.

## What lives where

| Surface | What it does |
|---|---|
| `DESIGN.md` | YAML frontmatter (colors, typography, spacing, radii, components) + prose. The single source of truth for the design system. |
| `apps/storybook/src/{pages,sections}/*.stories.tsx` | Hand-authored CSF3 compositions. Re-paint instantly under any saved palette via the version-aware decorator. |
| `.dsx/versions/<id>/` | Auto-snapshotted version store. Each entry has its own `DESIGN.md`, `tokens.css`, `tokens/`, and `meta.json`. |
| `.dsx/references/`, `.dsx/page-references/` | Reference corpora used by `/design` and `/page` to anchor a brief on a similar past design. |
| `.apm/` | Canonical agent harness — slash commands, subagents, skills, hooks. `apm install` deploys it to every locally-installed AI client (Claude, Codex, Cursor, Copilot, OpenCode). |

## Related

- **[GitHub repository](https://github.com/Bantarus/xtreme-design)** — code, issues, releases.
- **[README](https://github.com/Bantarus/xtreme-design/blob/main/README.md)** — elevator pitch.
- **[AGENTS.md](https://github.com/Bantarus/xtreme-design/blob/main/AGENTS.md)** — the agent contract (read before contributing).
