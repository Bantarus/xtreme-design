---
name: storybook-core
description: >
  Orchestrator for Storybook — the frontend workshop for building, testing, and
  documenting UI components in isolation. Covers Storybook's mental model
  (manager + preview iframe, `.storybook/` config directory, story discovery),
  the install and bootstrap flow (`npm create storybook@latest`, `storybook init`,
  `--features docs test a11y`, `--type` per-framework, package-manager auto-
  detection), the CLI surface (`dev`, `build`, `init`, `add`, `remove`, `upgrade`,
  `migrate`, `automigrate`, `doctor`, `sandbox`, `index`, `info`, `ai setup`),
  the version landscape (Storybook 8.x vs 9.x vs 10.x — ESM-only main config,
  CSF Next preview, Node 20.19+/22.12+ requirement), environment variables
  (`STORYBOOK_*`, `import.meta.env` vs `process.env`, `.env` files, `BROWSER=`),
  telemetry (opt-out via `disableTelemetry`, `--disable-telemetry`,
  `STORYBOOK_DISABLE_TELEMETRY`), supported package manager / Node / browser
  versions, and routes to specialized sibling skills. Use whenever the user
  mentions Storybook, `storybook.js`, "stories", "story file", `.stories.tsx`,
  `.stories.mdx`, `.storybook/main.ts`, `.storybook/preview.ts`,
  `.storybook/manager.ts`, `npx storybook`, `npm create storybook`, the
  Storybook sidebar / canvas / docs page, "component workshop", "isolated
  component development", an `@storybook/*` package, a `@chromatic-com/*`
  package, or any task involving building a component library, design system,
  or UI documentation in isolation. Even if the user just says "Storybook"
  with no other context, load this skill first to understand the architecture
  and pick the right sibling. For writing stories (CSF 3, CSF Next, args,
  argTypes, parameters, decorators, loaders, play, tags, naming, TypeScript,
  mocking), see `storybook-stories`. For `.storybook/main.ts` / `preview.ts`
  / `manager.ts` configuration, story loading, story rendering, layout,
  styling, theming, sidebar, change detection, see `storybook-config`. For
  built-in essential addons (Actions, Backgrounds, Controls, Viewport,
  Themes, Measure & Outline, Toolbars & Globals, Highlight), see
  `storybook-essentials`. For Vite vs Webpack5 builder configuration,
  `viteFinal` / `webpackFinal`, SWC/Babel compilers, builder API, see
  `storybook-builders`. For framework-specific setup (React Vite,
  React Webpack5, Next.js, Next.js Vite, Vue3, Angular, Svelte, SvelteKit,
  Web Components, Preact, React Native Web, TanStack React, Ember, HTML),
  see `storybook-frameworks`. For testing (Vitest addon, test-runner,
  interaction tests, accessibility, visual via Chromatic, snapshot,
  coverage, in-CI, portable stories, mocking modules / network / providers
  via MSW), see `storybook-testing`. For documentation (Autodocs, MDX 3,
  all doc blocks, Code panel, build/publish docs), see `storybook-docs`.
  For installing, configuring, and writing addons (panels, toolbars, tabs,
  presets, `useGlobals`, `useChannel`, `useParameter`), see
  `storybook-addons`. For publishing (Chromatic, GitHub Pages, Netlify),
  composition, package composition, embedding, design integrations (Figma,
  Zeplin, UXPin), CPP, see `storybook-sharing`. For Storybook's agentic
  features (`storybook ai setup`, manifests, MCP server, AI best
  practices), see `storybook-ai`. For upgrading between Storybook majors,
  CSF 2→3→Next migration, test-runner→vitest-addon migration, MDX migration,
  doctor, codemods, breaking changes, see `storybook-migration`.
---

# Storybook Core

Storybook is a **frontend workshop** for building UI components and pages in
isolation. It is a development-only application that runs alongside your real
app, presents an iframe-based canvas to render a single component at a time,
and surrounds that canvas with a UI for browsing, editing args, running
tests, and viewing auto-generated docs.

This skill establishes the **mental model**, the **install flow**, the
**CLI surface**, the **version landscape**, and the **bootstrap conventions**
that every other `storybook-*` skill assumes.

## Quick orientation

- **Repository**: `https://github.com/storybookjs/storybook` (the docs
  archived here are from the `next` branch as of mid-2026)
- **Current latest line**: Storybook **10.x** (ESM-only main config, CSF
  Next in preview). 9.x and 8.x are still actively supported in the field.
- **Node**: 20.19+ or 22.12+ required by Storybook 10. 8.x and earlier
  accepted Node 18+.
- **Package managers**: npm 10+, pnpm 9+, yarn 4+.
- **Browsers (for the manager UI)**: Chrome 131+, Edge 134+, Firefox 136+,
  Safari 18.3+. Older browsers require [preview-only builds](#preview-only-mode).
- **Mental model**: Storybook is *two apps in one iframe pair*. The outer
  app is the **manager** (sidebar, toolbar, addon panel). The inner iframe
  is the **preview** (the actual rendering of your component, isolated
  from the manager's React tree). They communicate over a channel. Almost
  every confusion in Storybook ultimately traces back to "I put that code
  on the wrong side of the iframe boundary."

## Architecture: manager + preview

```
+---------------------------------------------------------------+
|                  Storybook (browser)                          |
|                                                                |
|  +-----------------------------+    +----------------------+  |
|  |  Manager                    |    |  Preview (iframe)    |  |
|  |  ----------------           |    |  -----------------    |  |
|  |  - Sidebar (story tree)     |<-->|  - Renders ONE story  |  |
|  |  - Toolbar (globals, zoom)  |    |  - Decorators run     |  |
|  |  - Addon panels (Controls,  |    |  - Play fn runs       |  |
|  |    Actions, Interactions,   |    |  - Loaders run        |  |
|  |    A11y, Visual Tests, etc.)|    |  - Your CSS lives here|  |
|  |  - .storybook/manager.ts    |    |  - .storybook/preview.|  |
|  +-----------------------------+    +----------------------+  |
|                                                                |
+---------------------------------------------------------------+
                          ^
                          |  built by a Storybook framework
                          |  (e.g. @storybook/react-vite) which
                          |  picks a builder (Vite or Webpack5)
                          v
+---------------------------------------------------------------+
|  Node process (storybook dev / storybook build)                |
|  - Reads .storybook/main.ts (must be valid ESM in SB 10+)      |
|  - Resolves the `stories` globs                                |
|  - Boots the chosen builder, emits the manager + preview       |
|  - Watches files in dev; produces /storybook-static in build   |
+---------------------------------------------------------------+
```

Three layers, three config files:

| File | Runs in | Purpose |
| --- | --- | --- |
| `.storybook/main.{js,ts}` | **Node** | Wires up `framework`, `stories` globs, `addons`, builder options, features. ESM only since SB 10. |
| `.storybook/preview.{js,jsx,ts,tsx}` | **Preview iframe** (browser) | Global decorators, parameters, globalTypes, loaders, beforeAll/beforeEach, project annotations applied to *every story*. |
| `.storybook/manager.{js,ts}` | **Manager** (browser) | UI options via `addons.setConfig(...)` — theme, sidebar layout, panel position. Most projects never need this. |

Optional siblings: `preview-head.html`, `preview-body.html`,
`manager-head.html` — raw HTML appended to the corresponding iframe's
`<head>` / `<body>`. Use these for font links, analytics tags, and CSS
escape hatches. See `storybook-config` for the full schema.

## The story file — anatomy

A story file lives **next to the component it documents** and exports a
**default export** (the *meta*) plus **named exports** (the *stories*).

```ts
// Button.stories.ts
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

const meta = {
  component: Button,
  args: { onClick: fn() },        // spy for the Actions panel
  parameters: { layout: 'centered' },
  tags: ['autodocs'],             // generates a Docs page
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { primary: true, label: 'Click me' } };
export const Disabled: Story = { args: { ...Primary.args, disabled: true } };
```

The default export's `component` is required for automatic argType inference
(react-docgen, vue-component-meta, compodoc, custom-elements-manifest).
Stories *without* a meta `component` still render but get no auto Controls.

> Full story-authoring details (CSF 3 vs CSF Next, render functions, args
> composition, decorators, loaders, play, tags, naming, TypeScript) live in
> **`storybook-stories`**.

## Install

The canonical install command for Storybook 8.3+ and all of 9.x / 10.x:

```bash
npm create storybook@latest
# or:  pnpm create storybook@latest
# or:  yarn create storybook
```

This runs `create-storybook`, which:

1. Detects your framework (React, Vue, Angular, Svelte, Web Components, …)
   and your builder (Vite vs Webpack5) from your `package.json`.
2. Installs the matching `@storybook/<framework>` package plus the core
   `storybook` CLI.
3. Asks if you are new to Storybook (if yes, generates example stories +
   an onboarding tour).
4. Asks **what configuration to install** — `Recommended` (component
   dev + docs + test + a11y) or `Minimal` (just dev). You can skip the
   prompt with `--features docs test a11y`.
5. Writes `.storybook/main.ts` and `.storybook/preview.ts`, adds
   `"storybook"` and `"build-storybook"` scripts to `package.json`,
   and (optionally) launches `storybook dev`.

### Versioned and manual installs

```bash
# Newest 8.x line:
npm create storybook@8 --features docs test a11y

# A specific patch:
npm create storybook@8.6 --features docs test a11y

# Pre-release line (use for testing 10.x betas):
npm create storybook@next

# Force a specific framework when auto-detection fails:
npm create storybook@latest -- --type react_vite
npm create storybook@latest -- --type nextjs_vite     # recommended over `nextjs`
npm create storybook@latest -- --type vue3
npm create storybook@latest -- --type angular
npm create storybook@latest -- --type svelte_vite
npm create storybook@latest -- --type sveltekit
npm create storybook@latest -- --type web_components
npm create storybook@latest -- --type preact
npm create storybook@latest -- --type html
npm create storybook@latest -- --type ember
npm create storybook@latest -- --type react_native_web
npm create storybook@latest -- --type react_native    # on-device, separate runtime
```

For pre-8.3, you use `storybook@<version> init` instead. The full
`--type` table is in
[get-started/install.mdx](../../sources/storybook/docs/get-started/install.mdx)
in the archived sources.

> See `storybook-frameworks` for the per-framework deep dive (Vite vs
> Webpack5 picker, Next.js mocking, Compodoc setup, Svelte CSF, TanStack
> Router, RN vs RNW).

## CLI surface

All commands run via the bundled `storybook` bin (after install) or via
the standalone `npm create storybook@latest` / `npx storybook@latest <cmd>`
runners.

| Command | Purpose | Most-used flags |
| --- | --- | --- |
| `storybook dev` | Start dev server with HMR | `-p 6006`, `--exact-port`, `-h`, `--https`, `--ci`, `--no-open`, `--quiet`, `--docs`, `--initial-path /docs/x--y`, `--preview-only`, `--disable-telemetry`, `--debug-webpack`, `--stats-json` |
| `storybook build` | Produce static build (default `./storybook-static`) | `-o <dir>`, `--quiet`, `--docs`, `--test` (perf-optimized), `--preview-only`, `--debug-webpack`, `--stats-json` |
| `storybook init` | Install Storybook (legacy; prefer `create storybook`) | `-t <type>`, `-b webpack5\|vite`, `--features docs test a11y`, `-y`, `--skip-install`, `--no-dev`, `--package-manager npm\|pnpm\|yarn` |
| `storybook add <addon>` | Install + register an addon | `--config-dir .storybook`, `--skip-postinstall`, `--package-manager pnpm` |
| `storybook remove <addon>` | Uninstall + unregister an addon | `--package-manager`, `--disable-telemetry` |
| `storybook upgrade` | Upgrade Storybook + run automigrations | `--dry-run`, `--skip-check`, `-y`, `-f`, `--config-dir .storybook .storybook-ui`, `--logfile sb.log` |
| `storybook migrate <codemod>` | Run a specific codemod (e.g. `csf-2-to-3`, `mdx-to-csf`) | `-l` (list), `-g 'src/**/*.stories.tsx'`, `-n` (dry-run), `-r '.js:.ts'` (rename), `-p ts\|tsx\|babel` |
| `storybook automigrate [fixId]` | Run all standard config checks (auto-fix) | `-l`, `-n`, `-y`, `--renderer vue`, `--package-manager` |
| `storybook doctor` | Health check — duplicate deps, incompatible addons, version mismatch | `--config-dir`, `--package-manager` |
| `storybook sandbox [framework]` | Generate a throwaway reproduction project | `-o <dir>`, `--no-init`, `@next` for prereleases |
| `storybook index` | Emit `index.json` (all stories + docs entries) | `-o stories.json`, `-c .storybook`, `--quiet` |
| `storybook info` | Dump system + dependency info (paste into issues) | _none_ |
| `storybook ai setup` | (React+Vite only, preview) Emit an agent-ready setup prompt | `-o storybook-setup.md`, `-c .storybook` |

> CLI flag note for npm users: when running through `npm run storybook
> build`, you must pass flags after `--`: `npm run storybook build -- -o
> ./out --quiet`. With yarn/pnpm the `--` is unnecessary.

## Project requirements (Storybook 10)

| Tool | Required version |
| --- | --- |
| Node.js | **20.19+ or 22.12+** |
| npm / pnpm / yarn | 10+ / 9+ / 4+ |
| TypeScript (if used) | 4.9+ |
| Angular | 18+ |
| Lit / Web Components | 3+ |
| Next.js | 14.1+ |
| Preact | 8+ (Vite framework targets 10) |
| React Native | 0.72+ |
| React Native Web | 0.19+ |
| Svelte | 5+ |
| SvelteKit | 1+ |
| Vite | 5+ (TanStack-React framework wants 7+) |
| Vitest | 3+ (for the recommended Vitest addon) |
| Vue | 3+ (Vue 2 is end-of-life; use Storybook 7 if you must) |
| Webpack | 5+ (Webpack 4 was removed in Storybook 8) |
| Yarn | 4+ (Yarn 1.x still works but is unmaintained upstream) |

## Version landscape

| Version | Headline | Key shifts | Status |
| --- | --- | --- | --- |
| **10.x** | ESM-only, smaller install | `main.{js,ts}` must be valid ESM (no `require`, no `__dirname`); Node 20.19+/22.12+; CSF Next promoted to preview; `tags` filter improvements | Latest |
| **9.x** | Storybook Test (Vitest addon) goes GA; Storysource addon removed (use `codePanel` parameter); CSF 3 stable | `@storybook/test` → `storybook/test` import path; framework packages no longer require `@storybook/addon-essentials` separately | Maintained |
| **8.x** | Renderer/builder/framework split landed; `addon-vitest` released as the successor to `@storybook/test-runner`; Storyshots removed | `-s` static-dir CLI flag removed (use `staticDirs`); `nextjs-vite` framework introduced; `addon-themes`/`addon-a11y`/`addon-docs` are still separate addons | Maintained for older projects |

> When the user is on Storybook 7.x or earlier, always recommend
> `storybook@8 upgrade` first, then `storybook@9 upgrade`, then
> `storybook@10 upgrade`. `upgrade` only spans one major at a time
> (the exception is 6→8). See `storybook-migration`.

## Configuration files at a glance

```
.storybook/
├── main.ts             ← required: framework, stories, addons, features
├── preview.ts(x)       ← global decorators/parameters/globalTypes
├── manager.ts          ← optional: UI theme, sidebar/panel layout
├── preview-head.html   ← optional: <head> tags in the preview iframe
├── preview-body.html   ← optional: <body> tags in the preview iframe
├── manager-head.html   ← optional: <head> tags in the manager
└── vitest.setup.ts     ← optional: project annotations for the Vitest addon
```

Minimal `main.ts` (Storybook 10, CSF Next factory style):

```ts
// .storybook/main.ts
import { defineMain } from '@storybook/react-vite/node';

export default defineMain({
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
});
```

Equivalent CSF 3 / pre-10 style (still supported):

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
};
export default config;
```

Minimal `preview.ts`:

```ts
// .storybook/preview.ts
import type { Preview } from '@storybook/react-vite';
import '../src/index.css';   // import global app CSS here

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },
};
export default preview;
```

> The full schema for every `main.ts` field (`stories`, `addons`,
> `framework`, `core`, `features`, `build`, `typescript`, `swc`, `babel`,
> `viteFinal`, `webpackFinal`, `previewAnnotations`, `previewHead`,
> `previewBody`, `managerHead`, `refs`, `staticDirs`, `tags`, `indexers`,
> `env`, `logLevel`) lives in `storybook-config`.

## Where stories go (`stories` globs)

Default glob covers the entire `src/` tree:

```ts
stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)']
```

Supported alternatives:

- **Array of globs** (controls sidebar order — stories load top-down):
  ```ts
  stories: [
    '../src/intro.stories.mdx',
    '../src/components/**/*.stories.@(js|ts|tsx)',
    '../src/pages/**/*.stories.@(js|ts|tsx)',
  ]
  ```
- **Configuration object** with `directory`, `files`, `titlePrefix`:
  ```ts
  stories: [{
    directory: '../packages/components',
    files: '**/*.stories.@(ts|tsx)',
    titlePrefix: 'Design System',
  }]
  ```
- **Async function** that returns globs/specifiers — useful for monorepos
  where the set of packages is dynamic. (Note: custom loading functions
  may de-optimize Storybook's static analysis.)

The default file pattern is `**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))`.

## Environment variables

Storybook only exposes env vars that start with `STORYBOOK_`. Anything
else is stripped from the build for security.

```bash
# Set inline:
STORYBOOK_THEME=red STORYBOOK_DATA_KEY=12345 npm run storybook

# Or via .env / .env.development / .env.production:
echo 'STORYBOOK_DATA_KEY=12345' >> .env
```

How to read them:

- **Vite framework**: `import.meta.env.STORYBOOK_DATA_KEY`
  (Storybook does not expose Node-style `process.env`; for non-prefixed
  Vite vars like `VITE_*`, set
  [`envPrefix`](https://vitejs.dev/config/shared-options.html#envprefix)
  in `vite.config.ts`.)
- **Webpack framework**: `process.env.STORYBOOK_DATA_KEY`
- **HTML substitution**: in `preview-head.html`, write `%STORYBOOK_THEME%`
  and Storybook will interpolate the value.

You can also expose project-specific env vars via `main.ts`:

```ts
export default defineMain({
  // ...
  env: (config) => ({ ...config, EXAMPLE_VAR: 'from-main-config' }),
});
```

Special env var for selecting the dev browser:
`BROWSER="safari" | "firefox" | "chromium"`. Defaults to Chrome.

> **Never store secrets** in `STORYBOOK_*` vars or `.env` — they are
> bundled into the built JS and visible to anyone who loads your
> published Storybook.

## Telemetry

Storybook collects anonymous usage data (Storybook version, framework,
builder, addons list, story counts, command invoked). **No project
contents, no env var values, no source code, no IP** (only a one-way
hash for spam detection). The full payload schema is at
[`configure/telemetry.mdx`](../../sources/storybook/docs/configure/telemetry.mdx).

Opt-out — three equivalent ways:

```ts
// .storybook/main.ts
export default defineMain({
  // ...
  core: { disableTelemetry: true },
});
```

```bash
# Per-invocation:
storybook dev --disable-telemetry
storybook build --disable-telemetry

# Globally (CI):
STORYBOOK_DISABLE_TELEMETRY=1
```

Crash reports are **off by default**. You can enable them with
`core.enableCrashReports: true` or `--enable-crash-reports` or
`STORYBOOK_ENABLE_CRASH_REPORTS=1` — they include a sanitized stack
trace (user paths stripped) appended to the regular telemetry event.

> There is a single `boot` telemetry event with no metadata that fires
> *before* `main.ts` is read, used to verify the telemetry pipeline is
> alive. The only way to suppress it is the environment variable
> `STORYBOOK_DISABLE_TELEMETRY=1` — the `disableTelemetry` config field
> cannot reach it.

## Running and building

```bash
# Dev
npm run storybook            # → typically `storybook dev -p 6006`

# Production build
npm run build-storybook      # → typically `storybook build`
# Serves an output bundle under ./storybook-static/

# Preview the static build locally
npx http-server storybook-static -p 6006
```

### Preview-only mode

For older browsers (or as a low-overhead embed target), build without the
manager UI:

```bash
storybook build --preview-only
# Then open: /iframe.html?id=button--primary&navigator=true
```

The `navigator=true` query param renders a basic HTML sidebar inside the
preview so users can still navigate stories. Useful for legacy browser
support or embedding into wikis/docs portals.

### Performance-optimized "test" build

When the only consumer of the built Storybook is a test runner (or a
Chromatic visual-test pipeline), strip everything you don't need:

```bash
storybook build --test
```

This automatically applies the `build.test` config (`disableBlocks`,
`disableAutoDocs`, `disableMDXEntries`, `disableDocgen`,
`disableSourcemaps`, `disableTreeShaking`). Tune individual flags in
`main.ts` under `build.test` if you need partial optimization. See
`storybook-config` for the full schema.

## "How do I…?" cheat sheet

| Goal | Where |
| --- | --- |
| Write a `.stories.ts` file (CSF 3 / CSF Next, args, argTypes, parameters, decorators, loaders, play, tags, naming) | `storybook-stories` |
| Configure `main.ts`, `preview.ts`, `manager.ts`, story loading, layout, styling, theming, sidebar | `storybook-config` |
| Add a color picker / radio Control, customize Actions, switch viewports, theme switcher in the toolbar | `storybook-essentials` |
| Switch from Webpack to Vite (or back), customize `viteFinal` / `webpackFinal`, enable SWC, write a custom builder | `storybook-builders` |
| Set up Next.js Vite, mock `next/router` & `next/navigation`, integrate Compodoc with Angular, use Svelte CSF, configure TanStack Router stories | `storybook-frameworks` |
| Run component tests with the Vitest addon, generate coverage, set up Chromatic visual tests, run accessibility audits, write a play function, mock MSW handlers, use portable stories in Jest/Vitest/Playwright CT | `storybook-testing` |
| Enable Autodocs, write MDX docs, use every doc block (`<Meta>`, `<Canvas>`, `<Controls>`, `<Source>`, `<Stories>`, `<ColorPalette>`, `<Typeset>`, …), enable the Code panel | `storybook-docs` |
| Install/remove an addon, write a Panel/Toolbar/Tab addon, build a preset, publish to NPM, use `useGlobals` / `useChannel` / `useParameter` hooks | `storybook-addons` |
| Publish to Chromatic / Vercel / Netlify / GitHub Pages, set up Composition, embed stories in Notion/Medium, integrate Figma | `storybook-sharing` |
| Set up `storybook ai setup`, install `addon-mcp`, customize the MCP server, write JSDoc for the manifest, share an MCP server | `storybook-ai` |
| Upgrade from 8→9→10, migrate CSF 2→3→Next, migrate from `@storybook/test-runner` to `@storybook/addon-vitest`, upgrade Svelte CSF v5, run `storybook doctor` | `storybook-migration` |

## Common pitfalls (start here when something feels wrong)

1. **"My CSS isn't loading."** Import global stylesheets from
   `.storybook/preview.{ts,tsx}` (not `main.ts`). Anything imported from
   `main.ts` runs in Node, never in the browser. See `storybook-config`
   → "Styling and CSS".
2. **"`process.env.MY_VAR` is undefined in Vite-based Storybook."** Vite
   doesn't expose `process.env`. Use `import.meta.env.STORYBOOK_MY_VAR`,
   and make sure the var starts with `STORYBOOK_`. See [Environment
   variables](#environment-variables).
3. **"My story doesn't appear in the sidebar."** Check that the file
   matches your `stories` glob, that the meta has either a `title` or a
   `component`, and that the named export starts with an uppercase
   letter. Storybook requires statically analyzable titles since 7.x.
4. **"My component's Controls show as plain text inputs instead of a
   radio / select."** Set `argTypes.<name>.control` explicitly, or rely
   on automatic inference by setting `meta.component` and (for Angular,
   Ember, Web Components) wiring up the matching docgen tool (Compodoc,
   ember-cli-storybook, custom-elements.json). See `storybook-stories`.
5. **"Why are my actions being logged twice?"** You probably have both
   `actions: { argTypesRegex: '^on.*' }` *and* an `fn()` arg on the
   same handler. Pick one. The recommended approach is `fn()` from
   `storybook/test`, because spies registered via `argTypesRegex` are
   not available in your play function. See `storybook-essentials`
   → "Actions".
6. **"Storybook can't `require` from `main.ts` in version 10."**
   Storybook 10 requires `main.ts` to be valid ESM. No `require`, no
   `__dirname`, no `__filename`. Replace with `import` and
   `import.meta.url`. See `storybook-migration`.
7. **"My tests pass in the Storybook UI but fail in CI."** Storybook
   Test uses Vitest browser mode (Chromium via Playwright). In CI you
   probably need the Playwright Docker image
   (`mcr.microsoft.com/playwright:vX.Y.Z-noble`) and to publish your
   Storybook so the test runner can link to failing stories via
   `storybookUrl`/`SB_URL`. See `storybook-testing` → "In CI".

## Where to look in the archived docs

The full source MDX lives under
`/home/bantarus/DEV/skills-builder/sources/storybook/docs/`:

- `get-started/` — install, what's a story, browse stories, why storybook
- `writing-stories/` — CSF, args, parameters, decorators, play, tags, mocking
- `writing-tests/` — Vitest addon, test-runner, interactions, a11y, visual, coverage, CI, integrations
- `writing-docs/` — Autodocs, MDX, doc blocks, code panel, build/publish docs
- `configure/` — `.storybook/` directory, integration (compilers, frameworks, TS, assets, ESLint), UI (sidebar, theming, change detection, features)
- `api/` — `main-config/`, CSF, arg-types, parameters, CLI options, doc-blocks, portable-stories
- `builders/` — Vite, Webpack, Builder API
- `essentials/` — actions, backgrounds, controls, highlight, measure-and-outline, themes, toolbars-and-globals, viewport
- `addons/` — install, configure, addon types, addons-api, writing-addons, writing-presets
- `sharing/` — publish-storybook, storybook-composition, package-composition, embed, design-integrations
- `releases/` — features (lifecycle), migration-guide, migration-guide-from-older-version, upgrading, roadmap
- `ai/` — setup, manifests, best-practices, mcp/{overview,api,sharing}
- `_snippets/` — every `<CodeSnippets path="..." />` referenced from the docs, per-framework variants

The snippets directory is huge (~700 files) and is the source of every
code example in this skill bundle. When you need the *exact* code for a
specific framework variant, grep `sources/storybook/docs/_snippets/`.
