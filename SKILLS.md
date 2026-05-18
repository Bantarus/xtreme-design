# SKILLS.md — user-authored skill slots

Three skill files in `.claude/skills/` have intentionally-empty bodies. Their frontmatter (`name` + `description`) is in place so Claude Code's skill auto-loader picks them up at the right moments, but the content is yours to author.

For background on Claude Code skills, see the [Claude Code skills docs](https://docs.claude.com/en/docs/claude-code/skills) (and `init` / `update-config` slash commands).

## The three slots

### `.claude/skills/shadcn-component-catalog/SKILL.md`

**Trigger description (already set):** "Catalog of available shadcn/ui components in this template, their props, variants, and common composition patterns. Load when composing UI from existing components, writing stories, or deciding which component fits a brief."

**What to put in the body:**
- Quick-lookup table: component slug → default import path → primary use case → variant summary.
- Per-component subsections for the heavily-used ones (Button, Card, Input, Dialog, Tabs, Table, Form fields). Document CVA variants, the base-ui `render` prop pattern (NOT `asChild`), and any project-specific conventions.
- Composition recipes — "form layout", "card + action button", "data table with row actions", cross-referencing the page references in `.dsx/page-references/`.
- Out-of-scope: components NOT installed (e.g. Form is missing in shadcn 4.7 — see KNOWN-ISSUES.md). The agent must NOT invent or install new components.

**Source of truth:** `apps/gallery/components/ui/` (34 components installed from shadcn 4.7's `@shadcn/base-nova` preset) and `apps/gallery/lib/components-manifest.ts` (grouped + described).

### `.claude/skills/storybook-csf3/SKILL.md`

**Trigger description (already set):** "Storybook 10 CSF3 story conventions used in this template — Meta type, StoryObj, args, parameters, decorators, version-aware ActiveStylesheet, fullscreen layout. Load when writing or editing .stories.tsx files."

**What to put in the body:**
- Required story shape: `Meta` + `StoryObj` + `satisfies` operator.
- Project-local layout choices: `fullscreen` for pages, `centered` for sections, default for component smoke tests.
- Title conventions: `Pages/<Name>`, `Sections/<Name>`, `Smoke/<Name>`.
- Import policy: always from `@gallery/ui/<slug>`. Never invent components; surface gaps to the human.
- The version-aware `ActiveStylesheet` decorator (defined in `apps/storybook/.storybook/preview.tsx`). Every story inherits it; the user picks the active palette from the Storybook toolbar.
- When to use args + Controls vs a render function. For pages/sections, a single `Default` story with a render function is the norm. Args are reserved for component-level stories.
- Forbidden patterns: `useState`/`useEffect` in render bodies (use play functions), top-level fetches, side effects on import.

**Source of truth above the project layer:** the auto-loaded `storybook-stories` skill (Storybook 10 conventions). This skill adds the dsx layer.

### `.claude/skills/composition-patterns/SKILL.md`

**Trigger description (already set):** "Common page composition patterns — hero layouts, pricing grids, dashboard regions, form structures, empty-state archetypes — as exemplified by the .dsx/page-references/ corpus. Load when composing a new page or section story, or when a brief mentions a layout idea by name."

**What to put in the body:**
- Pattern catalog cross-referenced to the 10 page references:
  - Hero archetypes: centered + dual-CTA (`landing-saas`), image-led editorial (`landing-product`).
  - Multi-column grids: three-up feature grid, four-up KPI strip (`dashboard-{ops,analytics}`), three-up pricing tiers (`pricing-tiered`).
  - Sidebar + main layouts: fixed sidebar nav (`dashboard-ops`), split-screen (`auth-signin`, editorial split in `landing-product`).
  - Form structures: single-card form (`auth-signin`), multi-section settings (`settings-profile`), multi-step wizard (`wizard-onboarding`).
  - Empty / error / null states: single-CTA empty (`empty-state`), friendly 404 with search recovery (`error-404`).
- Layout "negative space" rules — when to use `layout: 'centered'` vs `layout: 'fullscreen'` on the meta.
- For each pattern, the canonical reference file.

The agent loads this skill plus the matched reference together; the skill explains the pattern abstractly, the reference is the working example.

## How loading works (recap)

Claude Code's auto-loader reads the `description:` field on every skill in `.claude/skills/` and matches against the conversation context. When the user's intent matches multiple skills, all matching skills load. So:

- A `/page` brief about a "modern SaaS landing" → loads `shadcn-component-catalog` (composing UI), `storybook-csf3` (writing a story), `composition-patterns` (layout idea), AND the auto-found `landing-saas.stories.tsx`.
- A `/refine` brief saying "make the hero more compact" → loads `composition-patterns` (the "hero" keyword) and `shadcn-component-catalog` (if a component is mentioned).
- A vanilla "fix this typo" doesn't load any of these.

You don't need to register the skills anywhere — just ensure the frontmatter description is precise enough to match the moments you want.

## Sequencing tip

Author them in this order — each layer builds on the previous:

1. **`shadcn-component-catalog`** — without this, the agent guesses at component APIs or invents missing ones.
2. **`storybook-csf3`** — without this, the agent reaches for CSF2 patterns or skips `satisfies Meta`.
3. **`composition-patterns`** — without this, the agent's compositions feel "first-draft" — technically correct but stylistically anonymous.

Each can be ~150–250 lines. They are reference material the agent loads at need, not a wall of prose it reads start-to-finish.
