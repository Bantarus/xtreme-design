# Scaffold prompt — agent-native design system

Drop this whole message into a fresh Claude Code session at the empty directory where you want the project to live. The first line ("ROLE") is what turns it from a "do these tasks" message into a kickoff brief.

---

ROLE: You are scaffolding an agent-native design system monorepo for a solo indie developer (Bantarus). Stack is locked: pnpm + Turborepo + Next.js 15 (App Router) + Tailwind v4 + shadcn CLI 3.0 + DESIGN.md (Google Labs) + Style Dictionary v4 (DTCG 2025.10) + Playwright MCP. Web-first, with placeholder apps prepared for Flutter, Compose, and SwiftUI ports. Work step by step, commit after each phase with conventional-commit messages, and stop to ask only if a decision cannot be deferred to a sensible default.

CONTEXT YOU MUST READ FIRST
1. Fetch and read the DESIGN.md spec: `https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md`. The spec is normative.
2. Fetch one canonical example to internalize the shape: `https://raw.githubusercontent.com/google-labs-code/design.md/main/examples/heritage.md`.
3. Print the installed CLI's view of the spec to confirm version alignment: `npx -y @google/design.md@latest spec --format markdown | head -200`. If the front-matter keys differ from what the docs/spec.md showed, the CLI wins — adjust the template accordingly.
4. Read the Tailwind v4 `@theme` docs section at `https://tailwindcss.com/docs/theme` to confirm the `@theme inline` pattern.
5. Read `https://ui.shadcn.com/docs/registry/getting-started` so the custom registry structure is current.

DEFAULTS (do not ask; apply silently)
- Package manager: pnpm 9. Node: 20 LTS.
- Monorepo: Turborepo with pnpm workspaces.
- Web app: Next.js 15 App Router, TypeScript strict, React 19.
- Styling: Tailwind v4 with @theme inline semantic variables. shadcn "new-york" style, base color slate, CSS variables ON.
- Tokens: DTCG 2025.10 JSON in `tokens/`, built by Style Dictionary v4 into `build/{css,flutter,compose,ios}/`. DESIGN.md exports CSS variables; Style Dictionary owns the multi-platform fan-out. Both must end up consistent — DESIGN.md is the prose+lint source-of-truth, the DTCG JSON in `tokens/` is the build-pipeline source-of-truth. If they drift, the lint hook fails the build.
- Lint/format: Biome (one tool, fastest). ESLint only if a dep requires it.
- Visual regression: Playwright with `toHaveScreenshot` and `maxDiffPixelRatio: 0.01`. Three viewports: 360, 768, 1280.
- Storybook: install but do not configure beyond stub stories — leave a TODO in the README. The user will enable it once component count > 10.
- Git: initialize, conventional commits, sensible `.gitignore` including `.claude/worktrees/`, `build/`, `.next/`, `node_modules/`, `playwright-report/`, `test-results/`, `**/*-snapshots/__diff_output__/`.
- License: MIT, author "Bantarus".
- Do not push anywhere. Do not run `gh`. Local only.

PROJECT NAME
Use `dsx` as the workspace name unless I gave you another name in this conversation. Pick a brand name placeholder "Helios" for DESIGN.md content so it has something real to lint against — I will rename later.

PHASE 1 — REPO SKELETON
Create the directory layout exactly:

```
dsx/
├── CLAUDE.md
├── AGENTS.md
├── DESIGN.md
├── README.md
├── LICENSE
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── biome.json
├── .gitignore
├── .editorconfig
├── .nvmrc
├── .claude/
│   ├── settings.json
│   ├── agents/
│   │   ├── variant-generator.md
│   │   ├── token-guardian.md
│   │   ├── screenshot-critic.md
│   │   ├── port-flutter.md
│   │   └── port-compose.md
│   ├── commands/
│   │   ├── variant.md
│   │   ├── tokens-build.md
│   │   ├── design-lint.md
│   │   └── screenshot.md
│   └── skills/
│       ├── tailwind-v4-shadcn/SKILL.md
│       ├── design-tokens-dtcg/SKILL.md
│       └── flutter-port/SKILL.md
├── scripts/
│   ├── block-raw-hex.mjs
│   ├── rebuild-tokens-if-needed.mjs
│   └── design-md-sync.mjs
├── tokens/
│   ├── core.tokens.json
│   ├── semantic.tokens.json
│   └── themes/
│       ├── light.tokens.json
│       └── dark.tokens.json
├── style-dictionary.config.mjs
├── apps/
│   ├── web/                # Next.js 15
│   ├── mobile-flutter/     # placeholder README only
│   ├── mobile-compose/     # placeholder README only
│   └── mobile-swiftui/     # placeholder README only
├── registry/
│   ├── registry.json
│   └── components/
│       └── .gitkeep
└── tests/
    └── visual/
        └── smoke.spec.ts
```

After creating the skeleton, commit: `chore: scaffold monorepo skeleton`.

PHASE 2 — DESIGN.md SOURCE OF TRUTH
Generate a complete, lint-clean DESIGN.md for the placeholder brand "Helios". It must:
- Use the front-matter keys exactly as the installed CLI's `spec` command reports them.
- Include `colors`, `typography`, `rounded`, `spacing`, `components` sections.
- Define at least: `primary`, `surface`, `surface-muted`, `text`, `text-muted`, `border`, `success`, `danger`, `warning`, `info`, `focus-ring`.
- Define button-primary, button-primary-hover, button-secondary, button-ghost, input, card, badge as component entries — use `{ref}` references everywhere a token value would otherwise repeat.
- Pass `contrast-ratio` lint (WCAG AA 4.5:1) on every component bg/text pair. If you have to nudge a color, prefer adjusting the surface, not the brand color.
- Include all eight markdown sections in canonical order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.
- Prose must be concrete and prescriptive ("Use primary for one CTA per view") not vague ("modern and friendly").

After writing, run `npx @google/design.md lint DESIGN.md` and fix until clean. Then run `npx @google/design.md export --format dtcg DESIGN.md > tokens/from-design-md.tokens.json` and verify it parses. Commit: `feat(design): add lint-clean DESIGN.md for Helios placeholder`.

PHASE 3 — DTCG TOKENS + STYLE DICTIONARY
Hand-author the DTCG token files in `tokens/` (do not auto-derive from DESIGN.md — they are a parallel source for multi-platform fan-out, kept in sync by `scripts/design-md-sync.mjs` which we write but do not auto-run):
- `core.tokens.json`: raw scale tokens (color ramps, spacing scale, type scale, radii). Group with `$type` headers per DTCG.
- `semantic.tokens.json`: aliases that reference core, matching DESIGN.md component slot names (`color.surface`, `color.text`, `color.primary`, etc.).
- `themes/light.tokens.json` and `themes/dark.tokens.json`: override the semantic layer.

Write `style-dictionary.config.mjs` with five platforms: `css` (CSS variables in OKLCH where sensible), `tailwind` (a `@theme` block snippet for `apps/web/app/tokens.css`), `flutter` (Dart class), `compose` (Kotlin object), `ios` (SwiftUI extension). Use built-in transforms: `compose/object`, `ios-swift/class.swift`, `flutter/class.dart`. Run once and commit the generated `build/` output (gitignored generally, but commit on first build so diffs are visible going forward — actually, keep `build/` gitignored; add a `build/.gitkeep` so the dir exists).

Add a top-level `pnpm tokens` script that runs `style-dictionary build`. Commit: `feat(tokens): DTCG core/semantic/themes + Style Dictionary multi-platform build`.

PHASE 4 — NEXT.JS WEB APP
Inside `apps/web/`:
- Bootstrap Next.js 15 with `pnpm create next-app` (TypeScript, Tailwind, App Router, src dir no, import alias `@/*`).
- Upgrade Tailwind to v4 stable.
- Replace the default `globals.css` with one that:
  - `@import "tailwindcss"`;
  - `@import "../../build/css/tokens.css"` (the Style Dictionary output);
  - declares `:root` and `.dark` semantic vars sourced from those tokens;
  - exposes them to Tailwind with `@theme inline { --color-background: var(--color-surface); --color-foreground: var(--color-text); --radius: var(--rounded-md); ... }`.
- Run `pnpm dlx shadcn@latest init` — accept `new-york`, slate, CSS variables. Then add an initial set: `button card input label badge dialog dropdown-menu form sonner`. Verify they pick up the semantic vars from `globals.css`, not their own defaults.
- Build a single page at `app/page.tsx` that renders a "Design system smoke test" — one of each installed component, on a page that uses surface/text/border tokens directly. This is what visual-regression will lock in.
- Add a `/tokens` page that introspects `getComputedStyle(document.documentElement)` and lists every `--color-*`, `--space-*`, `--radius-*` var with a swatch.

Verify `pnpm --filter web dev` runs and the smoke page looks coherent. Commit: `feat(web): Next.js 15 + Tailwind v4 + shadcn smoke page`.

PHASE 5 — CUSTOM SHADCN REGISTRY
In `registry/`:
- Write `registry.json` declaring the registry name `@dsx` and one initial item `@dsx/heliosbutton` — a wrapped shadcn `Button` with one extra "glow" variant that uses the `focus-ring` token.
- Run `pnpm dlx shadcn@latest registry:build` so `public/r/heliosbutton.json` is emitted under `apps/web/public/r/`.
- Verify an external project could install it with `pnpm dlx shadcn@latest add http://localhost:3000/r/heliosbutton.json`.

Commit: `feat(registry): @dsx custom shadcn registry + heliosbutton`.

PHASE 6 — CLAUDE CODE WIRING
Write the `.claude/` content:

`.claude/settings.json`:
```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Write|Edit",
        "hooks": [{ "type": "command", "command": "node scripts/block-raw-hex.mjs" }] }
    ],
    "PostToolUse": [
      { "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "pnpm exec biome format --write \"$CLAUDE_FILE_PATHS\" 2>/dev/null || true" },
          { "type": "command", "command": "node scripts/rebuild-tokens-if-needed.mjs \"$CLAUDE_FILE_PATHS\"" }
        ] }
    ],
    "Stop": [
      { "hooks": [
        { "type": "command", "command": "npx @google/design.md lint DESIGN.md" }
      ] }
    ]
  }
}
```

`scripts/block-raw-hex.mjs`: read `$CLAUDE_FILE_PATHS` (newline-separated), for any `.tsx`/`.ts`/`.css` file (excluding `tokens/`, `build/`, `node_modules/`), reject if the diff contains a raw `#RRGGBB`, `rgb(`, `rgba(`, `hsl(`, `oklch(` literal. Exit 2 on rejection with a clear message naming the file and the offending value. Allow hex inside DESIGN.md, tokens JSON, and Style Dictionary config.

`scripts/rebuild-tokens-if-needed.mjs`: if any changed path matches `tokens/**/*.tokens.json` or `style-dictionary.config.mjs` or `DESIGN.md`, run `pnpm tokens` then `npx @google/design.md export --format css-tailwind DESIGN.md > apps/web/app/_design-md-tokens.css`. Silent on success.

`scripts/design-md-sync.mjs`: compare token names between DESIGN.md front-matter and `tokens/semantic.tokens.json`. Report drift; exit non-zero if names diverge. Run manually, not in a hook.

Subagents (`.claude/agents/*.md`) — each has YAML frontmatter with `name`, `description`, `tools`, `model: sonnet`, and `isolation: worktree`:

- `variant-generator.md`: Takes a component path, a variant brief (string), and N (default 3). Spawns N worktree-isolated runs that each copy the component to `registry/variants/<name>-vN.tsx`, edit only className strings + CVA variants + motion props, write a `stories/<name>-vN.stories.tsx`, run Playwright screenshots at 360/768/1280, and output a markdown summary table to stdout. Never touches token files. Never invents token names.
- `token-guardian.md`: Watches diffs to `tokens/**` and DESIGN.md. Validates DTCG `$type`/`$value` shape, ensures every semantic alias resolves to a core token, runs `npx @google/design.md lint`, and checks contrast ratios via the CLI. Refuses to approve a change that drops a public token name without a migration note.
- `screenshot-critic.md`: Given a URL and a section of DESIGN.md (Components or Do's and Don'ts), uses Playwright MCP to screenshot the page, then critiques against the prose. Outputs a bulleted list of violations with file:line references where possible. Tools: Read, Bash, mcp__playwright__*. This is the agent to route to a local Qwen2.5-VL via Router later — leave a TODO comment in the frontmatter explaining how.
- `port-flutter.md` and `port-compose.md`: Stubs. Each reads `build/flutter/Tokens.dart` or `build/compose/Tokens.kt`, scans the corresponding `apps/mobile-*` README, and outputs a 5-step porting checklist for one named component. Do not generate platform code yet.

Slash commands (`.claude/commands/*.md`) are thin orchestrators:
- `/variant <component> "<brief>" [N]` → invokes variant-generator subagent.
- `/tokens-build` → runs `pnpm tokens` and reports diff.
- `/design-lint` → runs `npx @google/design.md lint DESIGN.md` and prints findings.
- `/screenshot <url>` → uses Playwright MCP to screenshot at 3 viewports and save to `screenshots/`.

Skills (`.claude/skills/*/SKILL.md`) follow Anthropic's progressive-disclosure pattern (≤500 char description, 1–2 page body, link to deeper docs). Three skills:
- `tailwind-v4-shadcn`: when to use `@theme inline`, the semantic-var pattern, common pitfalls (Tailwind v3 holdovers).
- `design-tokens-dtcg`: DTCG `$type` reference, alias syntax, Style Dictionary transform map for this repo.
- `flutter-port`: how `Tokens.dart` is generated, how to consume it via theme extensions, what to skip until Phase N.

Commit: `feat(claude): subagents, hooks, slash commands, skills`.

PHASE 7 — MCP SERVERS
Append the install commands to `README.md` under a "First-run setup" section (do not run them — they are user-scoped):

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

PHASE 8 — VISUAL REGRESSION
- Install Playwright in the root: `pnpm add -Dw @playwright/test`. `pnpm exec playwright install --with-deps chromium`.
- `playwright.config.ts` at root with three projects (360, 768, 1280), `expect.toHaveScreenshot.maxDiffPixelRatio: 0.01`, `webServer` starts `pnpm --filter web dev` on `http://localhost:3000`.
- `tests/visual/smoke.spec.ts` snapshots `/` and `/tokens`. Run once to generate baselines.
- Wire `pnpm test:visual` at root running the suite.

Commit: `test(visual): Playwright baselines for / and /tokens at three viewports`.

PHASE 9 — CLAUDE.md AND AGENTS.md
`CLAUDE.md` (≤200 lines): tech stack one-pager, "always read DESIGN.md before generating UI", "never write raw hex; use tokens", "run `pnpm tokens && pnpm exec @google/design.md lint DESIGN.md` before declaring done", subagent index, slash-command index, glossary mapping DESIGN.md token names to Tailwind class names.

`AGENTS.md`: same content reframed for Codex/Cursor/Aider — these agents read AGENTS.md but not CLAUDE.md. Reference DESIGN.md and the same lint commands. Keep the two files in sync by having `CLAUDE.md` say "for non-Claude agents see AGENTS.md" and vice versa; do not duplicate the whole content — split the rules into a shared `docs/agent-rules.md` and have both files reference it.

Commit: `docs: CLAUDE.md, AGENTS.md, shared agent-rules`.

PHASE 10 — SMOKE TEST + HANDOFF
Run the full chain:
```
pnpm install
pnpm tokens
pnpm --filter web build
pnpm --filter web dev &
sleep 5
pnpm test:visual
npx @google/design.md lint DESIGN.md
node scripts/design-md-sync.mjs
```

Print a final report: each command's exit code, repo tree (`git ls-files | head -80`), and a checklist of what the user does next:
1. Rename "Helios" to the real brand.
2. Replace placeholder tokens with brand values.
3. Run `/variant button "brutalist; glass; neumorphic" 3` as the first real exploration.
4. Install MCP servers (see README).
5. When component count > 10, enable Storybook (the stub config is in place).

Commit: `chore: initial smoke test passes`.

CONSTRAINTS
- Do not silently swap pinned versions for "latest" if a peer requirement breaks. Tell me which version was incompatible and which one you chose.
- If `@google/design.md lint` reports a schema mismatch with the spec.md you read in step 1, trust the CLI and adjust the DESIGN.md, not the CLI. Note the discrepancy in a `KNOWN-ISSUES.md`.
- If Tailwind v4 stable is not yet on npm at runtime (it should be), use the latest beta and write a one-line `KNOWN-ISSUES.md` entry.
- Never put raw hex in any `.tsx` or `.css` file outside `globals.css` and the Style Dictionary output.
- If a phase fails, stop, summarize what failed, and ask. Do not skip ahead.

START
Begin with PHASE 1. Print the planned directory tree before creating files, wait three seconds for me to interrupt, then proceed.
