# DESIGN.md, Claude Code, and the agent-native design system stack in 2026

**Bottom line:** Google Labs shipped DESIGN.md on **April 21, 2026** as an alpha, Apache-2.0 spec that pairs a typed YAML token block with prose rationale in a single markdown file an agent reads at repo root. It is genuinely useful, but it is **four weeks old, alpha, and has no auto-loading agent integration yet** — its value today is as a disciplined, lintable, DTCG-exportable design source-of-truth, not a turnkey ecosystem. For your goal (Claude Code, web-first, then Flutter/Compose/SwiftUI), the simplest viable stack is **DESIGN.md + Claude Code (with worktree subagents) + shadcn CLI 3.0 + Tailwind v4 + Playwright MCP + Style Dictionary v4** — five tools, all file-and-CLI-driven, no GUI canvas required. A graphical canvas (Penpot, tldraw, Storybook) adds value only if you need a designer-shareable artifact or component manifest; for a solo indie, the headless-browser-as-canvas approach wins on agent-drivability by a clear margin.

---

## Part 1 — The DESIGN.md spec, dissected

### What it actually is

DESIGN.md is a **single plain-text file at repo root** (parallel to `README.md` / `AGENTS.md`) with two layers:

1. **YAML front matter** between `---` fences — the *normative* machine-readable design tokens.
2. **Markdown body** — human/LLM-readable rationale organized into a fixed set of `##` sections.

The spec explicitly says: *"The tokens are the normative values. The prose provides context for how to apply them."* This dual nature is the whole point — agents get typed, lintable values; humans (and LLMs in zero-shot mode) get the *why*.

### The exact schema

Front-matter shape, verbatim from the spec:

```yaml
version: <string>          # optional, current: "alpha"
name: <string>
description: <string>      # optional
colors:
  <token-name>: <Color>            # #RRGGBB sRGB hex
typography:
  <token-name>:
    fontFamily: <string>
    fontSize: <Dimension>          # 1rem, 48px, etc.
    fontWeight: <number|string>
    lineHeight: <Dimension|number> # unitless = multiplier
    letterSpacing: <Dimension>
    fontFeature: <string>          # → CSS font-feature-settings
    fontVariation: <string>        # → CSS font-variation-settings
rounded:
  <scale>: <Dimension>             # none|sm|md|lg|xl|full
spacing:
  <scale>: <Dimension|number>
components:
  <component-name>:
    backgroundColor: <string|{ref}>
    textColor: <string|{ref}>
    typography: <{ref}>           # composite ref allowed here
    rounded: <{ref}>
    padding: <Dimension>
    size|height|width: <Dimension>
```

Token references use **`{path.to.token}`** (DTCG-inspired). Variants (hover/active/pressed) are *separate component entries* using a hyphenated key like `button-primary-hover` — there is no nested state syntax.

The eight allowed `##` markdown sections, in canonical order, are: **Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts**. Unknown sections are preserved (warning only); duplicate section headings reject the file outright.

The CLI ships **seven-to-eight lint rules** (the README and prose disagree — a documentation drift bug in alpha): `broken-ref`, `missing-primary`, `contrast-ratio` (WCAG AA 4.5:1 on every component bg/text pair), `orphaned-tokens`, `token-summary`, `missing-sections`, `missing-typography`, `section-order`.

### Origin, authorship, motivation

- **Publisher:** Google Labs, via the `google-labs-code` GitHub org (same org that ships Stitch, Jules, and Gemini CLI).
- **Release:** v0.1.0 tagged **April 21, 2026**; v0.1.1 patch the same day (CLI command rename).
- **Lead author:** **David East** (`@_davideast`, ex-Firebase DevRel), whose X bio explicitly reads "DESIGN.md core team." He signed the release commits and recorded the announcement video.
- **Pre-history:** The format originated inside Google Stitch as an internal export convention; **Stitch 2.0 (March 19, 2026)** introduced DESIGN.md as a portable design-system file. The April release open-sourced the draft spec, detaching it from Stitch.
- **Stated motivation** (blog.google): *"AI agents can know exactly what a color is for, and can validate their choices against WCAG accessibility rules"* — i.e., reduce stylistic drift in LLM-generated UI by giving the model a typed, lintable, semantic spec instead of vibes.

### How it relates to the other "drop a markdown file at repo root" conventions

| Standard | Relationship to DESIGN.md |
|---|---|
| **AGENTS.md** | **Coexists.** AGENTS.md = how to build/test/operate; DESIGN.md = how things should look. Same root-level drop-in convention. |
| **CLAUDE.md** | **Coexists.** Recommended practice is to add a line like *"Always read DESIGN.md before generating UI; run `npx @google/design.md lint` before finishing"* to CLAUDE.md. |
| **Anthropic Skills / SKILL.md** | **Complementary.** Google ships `google-labs-code/stitch-skills` containing a `design-md` skill that packages the format for Claude Code, Cursor, Antigravity, and Gemini CLI. SKILL.md is generic capability packaging; DESIGN.md is a domain schema. The skill can *generate* a DESIGN.md from a URL. |
| **llms.txt** | **Adjacent.** Both are convention-based files for AI consumption; llms.txt lives on a website indexing docs, DESIGN.md lives in source control prescribing UI generation. |
| **W3C DTCG tokens** | **Inspired by but distinct.** The spec says it *"adopts the concept of typed token groups and the `{path.to.token}` reference syntax."* DTCG is pure JSON; DESIGN.md adds prose, sections, and a focused subset of token types. **The CLI ships `export --format dtcg` so DESIGN.md is a strict superset for the tokens it covers** — you don't have to choose. |
| **Style Dictionary** | **Overlaps in output.** The CLI's `export --format tailwind` / `css-tailwind` / `json-tailwind` covers ~80% of what most teams do with Style Dictionary for web. For multi-platform (Flutter/Compose/SwiftUI), you still want Style Dictionary downstream. |
| **ADR** | Different genres. ADRs are append-only history of past decisions; DESIGN.md is a single living source of truth for the *current* visual system. |

### Tooling that exists today (May 17, 2026)

**First-party (Google):**
- `@google/design.md` npm CLI (Apache-2.0, TypeScript 95.5%), aliased `designmd` for Windows users. Commands: `lint`, `diff` (regression-aware), `export` (`tailwind` / `css-tailwind` / `json-tailwind` / `dtcg`), `spec` (prints the spec itself — intended for piping into agent system prompts).
- Programmatic API: `import { lint } from '@google/design.md/linter'` returns `{ findings, summary, designSystem }`.
- **Stitch** generates DESIGN.md natively; **Stitch's MCP server** lets agents extract a DESIGN.md from any URL.
- `google-labs-code/stitch-skills/skills/design-md` — installable via `npx skills add google-labs-code/stitch-skills --skill design-md --global`. Workflow: Retrieval (Stitch MCP) → Extraction → CSS-to-semantic translation → 9-section synthesis.
- **No VS Code extension, no Jules auto-load, no Gemini Code Assist-specific integration** as of this writing.

**Community:**
- `VoltAgent/awesome-design-md` — collection of brand DESIGN.md files (Stripe, Spotify, Apple, Vercel, etc.).
- `VoltAgent/awesome-claude-design` — 68 DESIGN.md files curated for Claude.
- `getdesign.md` (necatiozmen) — web directory.
- Chrome extensions: `bergside/design-md-chrome` and the "DESIGN.md Style Extractor" + "DESIGN.md Generator" on the Web Store extract CSS from any tab into DESIGN.md.
- Figma Community plugin "DESIGN.md Generator" exports style guidelines.

### How agents consume it today

- **No auto-load.** Unlike AGENTS.md (auto-loaded by Codex), DESIGN.md is not yet read by convention in any major agent. Adoption is **manual reference** from CLAUDE.md / AGENTS.md / `.cursor/rules`.
- The canonical agent instruction (seen across multiple guides): *"Before writing UI code, read @DESIGN.md. Use the token values and semantic descriptions for all design decisions. Run `npx @google/design.md lint DESIGN.md` and fix errors before shipping."*
- For deep agents, pipe the spec itself in: `npx @google/design.md spec --format markdown` — this is the explicitly designed use of the `spec` subcommand.

### Reception and honest critiques

- **Repo metrics (May 17, 2026):** ~13.6k stars, 1.3k forks, 27 commits on main, 2 releases. Reported growth from ~5.2k stars at 72 hours to 13.6k in three weeks suggests real traction but also classic launch-spike dynamics.
- **HN thread (item 47887123):** Muted — 37 points, 4 comments. The most pointed critique (brendanmc6): *"everything I see defined here in DESIGN.md is already codified in my actual themes configs, or component files… trying to codify design rigidly and prescriptively in docs is going to slow you down."* Another commenter (gavmor) pressed: how does this differ from AGENTS.md beyond deterministic validation? Answer: scope (visual identity vs. general agent guidance).
- **Substantive critiques** (pasqualepillitteri.it citing DesignWhine): governance is Google-controlled despite Apache-2.0 (no independent committee yet); no team features beyond Git; **LLMs apply the file probabilistically, not deterministically** — so "DESIGN.md guides but doesn't guarantee compliance the way compiled CSS would." The last critique is the most important one to internalize.
- **License & contribution:** Apache-2.0, Google CLA required (cla.developers.google.com). No competing-spec forks have emerged; community work has focused on *content* (curated brand files) and *tooling* (extractors), not schema alternatives.

### Honest gaps

DESIGN.md is **alpha**. Spec may break. There is no VS Code extension, no Jules auto-load, no dominant "AI validates token changes" tool. The CLI's Tailwind v3 vs v4 split is recent (`tailwind` → `export` rename happened in 0.1.1). For your purposes the format is stable enough to adopt now — but **commit to running `npx @google/design.md lint` in a hook**, not to trusting LLMs to honor it by reading alone.

---

## Part 2 — AI-driven component generation pipelines

### The agent-drivability ranking

| Tool | Agent-drivable? | OSS | Stars (May 2026) | Output | Verdict for Claude Code |
|---|---|---|---|---|---|
| **shadcn CLI 3.0 + MCP** | **Yes (CLI + MCP + JSON registry)** | MIT | ~115k | React + Tailwind v4 | **Foundational.** Everything else orbits this. |
| **v0 by Vercel** | **Yes (Platform API + `v0-sdk` + MCP)** | SDK MIT | thousands | Next.js + shadcn | The only hosted player with a real programmatic API. |
| **21st.dev Magic MCP** | **Yes (native MCP, `/ui` slash)** | MCP OSS | — | React + shadcn-style | Multi-variant generation built in. |
| **Subframe (`@subframe/cli sync` + MCP)** | **Yes** | No (CLI public) | — | Deterministic React + Tailwind | Best designer-visual + agent-pull tool. Deterministic codegen. |
| **Builder.io Visual Copilot CLI** | Yes (CLI from Figma plugin) | No (Mitosis OSS) | — | React/Vue/Svelte/Flutter/Kotlin | Only useful if you already live in Figma. |
| **Magic Patterns** | Yes (REST API + community MCP) | No | — | React/HTML/shadcn/Chakra | Underrated. Sonnet-backed REST. |
| **Onlook** | Partially (edits your local files; no formal CLI) | MIT | ~22k | Next.js + Tailwind | "Cursor for designers." Can coexist with Claude Code via worktrees. |
| **Google Stitch** | Partially (MCP server + DESIGN.md export) | No | — | HTML/CSS + DESIGN.md | Useful as a *prompt → DESIGN.md* front door. |
| **Bolt.new** | No (browser-bound, no API) | OSS repo exists | ~14k | Vite/Next.js | One-shot scaffolder only. |
| **Lovable.dev** | No ("API" is just a deep link) | No | — | React + Supabase | One-shot scaffolder; rely on GitHub sync for handoff. |
| **Tempo Labs, UX Pilot, Galileo** | No (GUI-first) | No | — | varies | Skip for an agent workflow. |

### The shadcn registry standard is the center of gravity

The August 2025 shadcn CLI 3.0 release fundamentally changed the AI-component story. Custom registries are **JSON over HTTP with content negotiation** (HTML, JSON, or Markdown via `Accept` header). Components install via namespaced syntax: `npx shadcn@latest add @v0/chart`, `@acme/data-table`, `@private/admin` (with Bearer-token auth). The CLI ships its own MCP server (`pnpm dlx shadcn@latest mcp init`), so Claude Code can `init_project`, `get_items`, `add_item`, `get_blocks` against any registry. **Every modern component library — MagicUI, Aceternity, Origin UI, Park UI, HeroUI, ReUI, Skiper, shadcn.io, Tailark — installs through this same CLI.** This is the single most important agent-friendly building block in 2026.

The Vercel `shadcn-ui-registry-starter` template exposes `/r/*.json` and is the reference path if you want **your own private component library that v0, Claude Code, Cursor, and Windsurf can all install from**.

### Multi-variant generation: worktrees are the canonical pattern

Claude Code v2.1.50+ (November 2025) ships native worktree support. The pattern that has emerged for component variant exploration:

1. Define a subagent (e.g., `variant-generator.md`) with `isolation: worktree` in its YAML frontmatter.
2. Issue one prompt with N stylistic directions ("brutalist, glass, neumorphic").
3. Claude Code spawns N subagent invocations in parallel, each in its own auto-created git worktree under `.claude/worktrees/`.
4. Each subagent edits the same component path with a different style direction.
5. The orchestrator reviews diffs and merges the winner.

Community blueprint: `SpillwaveSolutions/parallel-worktrees` ships `spawn-parallel.sh`, `cleanup-worktrees.sh`, and a status-JSON coordination protocol. For team-style orchestration, **Conductor.build** (free Mac app) and **Nimbalyst** (the replacement for Crystal as of Feb 2026) provide kanban UIs over multiple parallel Claude Code sessions.

### The vision-model feedback loop

The mainstream 2026 recipe is: **Claude edits component → Playwright MCP screenshots in 3 viewports → Claude (or a dedicated vision subagent) critiques against DESIGN.md → iterates in the worktree → Stop hook runs Playwright visual-regression with `maxDiffPixelRatio: 0.01`.**

The two MCP servers worth installing:

- **Playwright MCP** (`@playwright/mcp`, Microsoft, ~32.6k stars, Apache-2.0) — the #1 MCP server overall. Use `browser_snapshot` (ARIA tree) for token-cheap inspection and `browser_take_screenshot` only when visual critique is genuinely required.
- **Chrome DevTools MCP** (official Google, ~30k stars) — distinct purpose: live debugging with sourcemapped console errors, Lighthouse traces, network inspection. Install both; they do not overlap.

Higher-level alternatives exist (`browser-use` at ~94k stars, Stagehand from Browserbase) but for a Claude-Code-orchestrated indie workflow, Playwright + Chrome DevTools MCPs are sufficient.

### DTCG tokens are now stable

The W3C Design Tokens Community Group **reached its first stable spec version on October 28, 2025** (the "2025.10" format module), with Adobe, Google, Microsoft, Meta, Figma, Sketch, Salesforce, Shopify, and Penpot all signed on. **Style Dictionary v4** has first-class DTCG support (`$value`/`$type`/`$description`), is co-maintained by Tokens Studio, and is ESM/async/browser-runnable. v5.0.0-rc.0 chases full 2025.10 parity. Built-in transforms cover Compose (`compose/object`), SwiftUI (`ios-swift/class.swift`), Flutter (`flutter/class.dart`), CSS variables with OKLCH preservation, and JS modules. **For your "Flutter via FlutterGen, Compose, SwiftUI" goal, this pipeline is mature and fully agent-drivable** — Claude Code edits `tokens/*.tokens.json`, a PostToolUse hook runs Style Dictionary, per-platform files regenerate automatically.

### Tailwind v4 changes the game for AI

Tailwind v4 killed `tailwind.config.ts`. Configure with `@theme { --color-*: ... }` directly in CSS. Tokens automatically generate utilities (`--color-primary` → `bg-primary`, `text-primary`). The shadcn pattern is to keep semantic vars in `:root` and `.dark` blocks, then re-expose to Tailwind with `@theme inline { --color-background: var(--background); ... }`. **This is dramatically more agent-friendly than v3** because there is exactly one source of truth (CSS) and no TypeScript config compilation step to coordinate. Combined with DESIGN.md's `export --format css-tailwind` CLI, the flow becomes one-command.

---

## Part 3 — Canvas options ranked by agent-drivability

| Tool | License | File openness | CLI/headless | MCP | DTCG tokens | Round-trip | Stars | Rank |
|---|---|---|---|---|---|---|---|---|
| **Headless browser + HTML/Tailwind** | n/a | Source = code | Playwright/Puppeteer | Playwright MCP | Native via Tailwind/SD | Trivial | n/a | **5/5** |
| **Storybook 10.3 + Chromatic** | MIT | `.stories.tsx` plain code | `storybook build`, test-runner | **Official `@storybook/addon-mcp`** | Via tokens-in-repo | Trivial | ~89.9k | **5/5** |
| **Penpot** | MPL-2.0 | `.penpot` = ZIP of JSON+SVG | Self-host Docker | **Official Penpot MCP** (Feb 2026) | **Native DTCG** | Yes (via plugin bridge) | ~47.7k (May 14, 2026) | **4/5** |
| **tldraw** | tldraw license | `.tldr` JSON | SDK + `@tldraw/driver` 5.0 | **Official tldraw MCP App** | No | Yes | ~46k | **4/5** |
| **Excalidraw** | MIT | Plain JSON | `@excalidraw/utils` | **Official `excalidraw-mcp`** | No | Yes | ~123k | **4/5** |
| **Inkscape** | GPL | SVG | Excellent CLI | None needed | No | Yes (via SVG XML) | n/a | **4/5** (icons only) |
| **Rive** | MIT runtimes / closed editor | Binary `.riv` | Runtime APIs only | None | No | **No** — read-only at runtime | n/a | **2/5** |
| **Graphite** | Apache-2.0 | JSON | None | None | No | Partial | ~10k | **2/5** (too alpha) |
| Figma / Sketch / Framer / XD | Closed | Closed | n/a | Figma Dev Mode MCP (paid) | varies | Read-mostly | n/a | **1/5** |

### Why "no canvas" is the strongest option

The headless-browser-as-canvas approach has the unique property that **the design artifact and the production artifact are the same file**. There is no format gap to bridge, no plugin protocol to satisfy, no MCP write-path to debug. Claude Code edits `.tsx`/`.css`, Vite hot-reloads, Playwright MCP screenshots, agent critiques. Pros: trivial git workflow, real PR diffs, real interaction tests, Tailwind variables conform to DTCG mentally. Cons: no infinite canvas for side-by-side variant exploration (Storybook partially fills this), animation authoring is harder than Rive (so keep Rive for animations).

### When to add a graphical canvas

- **Penpot** if you want a real designer-shareable artifact and **native DTCG tokens** (Penpot was the first OSS design tool to ship them, co-developed with Tokens Studio). The official Penpot MCP server merged into the main repo on **Feb 3, 2026**; install with `claude mcp add penpot -t http http://localhost:4401/mcp`. Caveat: the MCP requires a live Penpot session bridged via a browser plugin, and the typography composite export still lags DTCG 2025.10 (`fontFamilies` arrays vs the new singular shape — open issue #8140).
- **tldraw** for whiteboarding/diagramming where you want an embeddable canvas the agent can steer. `.tldr` is dead-simple JSON. The official tldraw MCP App and `tldraw-desktop`'s Canvas API on `:7236` (action types `create | update | delete | move | label | align | distribute | resize`) make it the cleanest "agent draws on a canvas" option. Watermark on free use.
- **Storybook 10.3 + the official `@storybook/addon-mcp`** is the killer addition. The MCP exposes three toolsets: development (`get-storybook-story-instructions`, `preview-stories` renders live inside the agent chat via MCP Apps), docs (`list-all-documentation`, `get-documentation` — prevents prop hallucination), and testing (`run-story-tests` for interaction + a11y, agent reads failures and self-heals). Chromatic gives you visual regression as a feedback signal. **Currently React-only in preview**; for cross-framework use community Playwright-based Storybook MCPs.

### What to skip

- **Rive** for authoring — `.riv` is a binary proprietary format and the editor is closed-source GUI. Keep Rive for animations and accept that agents can only manipulate text runs, state machine inputs, and view-model bindings *at runtime*, not author files.
- **Graphite** — alpha v0.3, no CLI, no MCP, no headless render path. Revisit late 2026.
- **Figma / Sketch / Framer / Adobe XD** — closed formats or deprecated. Figma's Dev Mode MCP exists but requires a paid Dev seat, is read-mostly, and starves at 6 calls/month on the free Starter plan.

---

## Part 4 — Recommended stack and concrete wiring

### Is DESIGN.md + Claude Code + browser preview + Playwright loop enough?

**For your stated use case: yes, with one caveat.** The minimal four-tool loop will get you generating, screenshotting, and iterating components on Day 1. The one capability it lacks is **a structured component manifest the agent can query without scanning the codebase** — that's what Storybook + `@storybook/addon-mcp` adds, and it's worth installing as soon as you have more than ~10 components, because it prevents prop-hallucination and gives you a free interaction/a11y test surface. **Penpot or tldraw are only worth adding if a non-coder will participate** in your design loop; as a solo indie, you can skip them.

### The simplest viable stack (5 tools)

1. **Claude Code** (Sonnet 4.6 default; Opus 4.6/4.7 for hard architecture turns).
2. **shadcn CLI 3.0 + the shadcn MCP server** (`pnpm dlx shadcn@latest mcp init`).
3. **Tailwind v4** with `@theme inline` semantic variables.
4. **DESIGN.md** as the design source-of-truth, with the `@google/design.md` CLI for lint + DTCG/Tailwind export.
5. **Playwright MCP** (`claude mcp add playwright npx @playwright/mcp@latest`) for screenshot + interaction.

Add **Style Dictionary v4** the moment you start emitting Flutter/Compose/SwiftUI — the DESIGN.md CLI's exports cover web, but Style Dictionary owns the multi-platform fan-out.

### The power-user stack

Add, in roughly this order of return-on-effort:

- **Storybook 10.3 + `@storybook/addon-mcp`** — component manifest, prop docs, self-healing interaction/a11y tests.
- **21st.dev Magic MCP** — `/ui` slash command for fresh-from-prompt variants when shadcn doesn't have what you want.
- **Chrome DevTools MCP** alongside Playwright MCP — live debugging, Lighthouse, console errors.
- **Conductor.build** (Mac) or **Nimbalyst** for kanban-style parallel session orchestration.
- **Penpot self-hosted + Penpot MCP** if you want an OSS Figma replacement and native DTCG.
- **OpenRouter / Claude Code Router** routing a `screenshot-critic` subagent to a **local Qwen2.5-VL-7B** on your RTX 4090 via Ollama. This is the single biggest cost optimization — Qwen2.5-VL-7B is the top-performing open VLM for design critique per 2026 benchmarks, fits comfortably at bf16 (~14-16 GB) or INT8 (~6 GB), and removes vision-token cost from the Claude bill. **Critical caveat: only route specific subagents to local models; never route the main orchestrator session** — smaller models have weaker tool/MCP use and will break your hooks and subagent spawning.

### How to wire DTCG tokens for cross-platform output

```
tokens/*.tokens.json (DTCG 2025.10)
    │
    ├─→ Style Dictionary v4 build (PostToolUse hook)
    │       ├─→ build/css/tokens.css ──┐
    │       │                          │ imported by app/globals.css
    │       │                          │ exposed via @theme inline
    │       ├─→ build/flutter/tokens.dart  → consumed by Flutter app
    │       ├─→ build/compose/Tokens.kt    → consumed by Compose app
    │       └─→ build/ios/Tokens.swift     → consumed by SwiftUI app
    │
    └─→ npx @google/design.md export --format dtcg DESIGN.md
            (the inverse path: regenerate tokens.json from DESIGN.md)
```

The PostToolUse hook on `tokens/**/*.tokens.json` runs `pnpm style-dictionary build`. The PreToolUse hook on `Write` of `.tsx` files runs a regex check rejecting raw `#hex` and `rgb()` literals (forces token use). Stop hook runs Playwright visual-regression.

### Recommended repo layout

```
my-design-system/
├── CLAUDE.md                     # tech stack + lint rules + ≤200 lines
├── AGENTS.md                     # shared with Codex/Cursor
├── DESIGN.md                     # aesthetic + DTCG-compatible tokens
├── .claude/
│   ├── settings.json             # PreToolUse/PostToolUse/Stop hooks
│   ├── agents/
│   │   ├── variant-generator.md      # isolation: worktree
│   │   ├── token-guardian.md
│   │   ├── screenshot-critic.md      # routed to local Qwen2.5-VL via Router
│   │   ├── port-flutter.md
│   │   └── port-compose.md
│   ├── commands/
│   │   ├── variant.md            # /variant button "brutalist" 3
│   │   └── tokens-build.md
│   └── skills/
│       ├── tailwind-v4-shadcn/SKILL.md
│       ├── design-tokens-dtcg/SKILL.md
│       └── flutter-port/SKILL.md
├── tokens/
│   ├── core.tokens.json
│   ├── semantic.tokens.json
│   └── themes/light.tokens.json
├── style-dictionary.config.mjs
├── build/                         # SD output (gitignored or committed)
├── apps/
│   ├── web/                       # Next.js + Tailwind v4 + shadcn
│   ├── mobile-flutter/
│   ├── mobile-compose/
│   └── mobile-swiftui/
├── registry/                      # custom shadcn registry items
│   ├── registry.json
│   └── components/
└── stories/
```

The crucial conventions: **`.claude/skills/` is auto-loaded** even from `--add-dir` directories; nested `CLAUDE.md` files in `apps/*` load when the agent works there; **subagents do not inherit skills automatically** — list them under `skills:` in frontmatter.

### Sample variant-generator subagent

```markdown
---
name: variant-generator
description: Generates N stylistic variants of a single shadcn component. Use proactively when the user asks for "variants", "alternates", or "options".
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
isolation: worktree
skills:
  - tailwind-v4-shadcn
  - design-tokens-dtcg
---
Inputs: target component, tokens path, variant brief, N (default 3).

For each variant i in 1..N:
1. Copy component to registry/variants/<name>-vN.tsx.
2. Edit ONLY className strings, CVA variants, and motion props.
   Never invent token names; use only vars from app/globals.css @theme.
3. Write a story to stories/<name>-vN.stories.tsx.
4. Run `pnpm storybook:build`, screenshot via Playwright MCP at 360, 768, 1280.
5. Output a markdown summary table: variant | tokens-touched | screenshot.
```

### Sample design-system enforcement hooks (`.claude/settings.json`)

```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Write",
        "hooks": [{ "type": "command", "command": "node scripts/block-raw-hex.mjs" }] }
    ],
    "PostToolUse": [
      { "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "pnpm exec biome format --write \"$CLAUDE_FILE_PATHS\"" },
          { "type": "command", "command": "npx @google/design.md lint DESIGN.md" },
          { "type": "command", "command": "node scripts/rebuild-tokens-if-needed.mjs \"$CLAUDE_FILE_PATHS\"" }
        ] }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "pnpm test:visual" }] }
    ]
  }
}
```

### Day-one starter commands

```bash
# 1. Scaffold
pnpm dlx shadcn@latest init -t next --monorepo
cd my-design-system

# 2. DESIGN.md
curl -O https://raw.githubusercontent.com/google-labs-code/design.md/main/examples/heritage.md
mv heritage.md DESIGN.md   # then edit
npx @google/design.md lint DESIGN.md
npx @google/design.md export --format css-tailwind DESIGN.md > apps/web/app/tokens.css

# 3. MCP servers
claude mcp add playwright npx @playwright/mcp@latest
pnpm dlx shadcn@latest mcp init
# optional: claude mcp add chrome-devtools npx chrome-devtools-mcp@latest

# 4. Stitch skills (the closest thing to "official" agent integration)
npx skills add google-labs-code/stitch-skills --skill design-md --global

# 5. First variant run
claude
> /variant button "brutalist; glass; neumorphic" 3
```

---

## What you can ignore for now

- **Galileo / Stitch front-door:** useful for the *first* DESIGN.md if you don't want to write it from scratch, but you can also just clone an entry from `VoltAgent/awesome-design-md` and edit.
- **Bolt.new / Lovable:** one-shot scaffolders, not agent-drivable.
- **Figma / Penpot / tldraw:** add a graphical canvas only when you have a non-coder collaborator.
- **Token Studio:** only needed if you have a Figma workflow; with DESIGN.md as your source, Style Dictionary consumes its DTCG output directly.
- **Onlook:** can coexist with Claude Code via worktrees but represents a parallel paradigm; pick one per branch to avoid edit conflicts.

## Closing read

The most important shift in the 2026 ecosystem is not DESIGN.md itself — it is the **convergence on file-and-CLI-driven primitives that Claude Code can edit natively**: shadcn registries as JSON over HTTP, Tailwind v4's CSS-first config, DTCG 2025.10 as a stable token format, Playwright MCP as the universal browser surface, and Claude Code's native worktree-isolated subagents for parallel exploration. **DESIGN.md slots into this stack as the missing semantic layer — a typed, lintable, agent-readable description of intent** — but its real power is unlocked only when paired with the lint/export/hook discipline that turns "the LLM hopefully reads it" into "the build breaks if it doesn't." Adopt it, but adopt it with hooks. The probabilistic-vs-deterministic critique from DesignWhine is the one to take seriously: a markdown file does not guarantee compliance; a hook that runs `npx @google/design.md lint` does.