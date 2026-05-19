---
name: storybook-migration
description: >
  Upgrading Storybook and migrating between formats / addons. Covers
  the `storybook upgrade` command (one major at a time — 8→9→10, with
  the 6→8 exception, monorepo `STORYBOOK_PROJECT_ROOT` env var, the
  full flag set: `--dry-run`/`-n`, `-c`/`--config-dir`, `--force`/`-f`,
  `--skip-check`/`-s`, `--package-manager`, `--logfile`/`--loglevel`,
  prereleases via `storybook@next upgrade`, `storybook@8.0.0-beta.1 upgrade`,
  automatic health check via `storybook doctor` post-upgrade, error
  handling with `debug-storybook.log`), the `storybook automigrate`
  script (standalone config-checks even without upgrading, fix list via
  `--list`, applies migrations like `csf-factories`,
  `nextjs-to-nextjs-vite`, `react-vite-to-tanstack-react`,
  `addon-essentials-removal`, framework migrations from
  `react-webpack5` → `react-vite`, addon de-duplication), the
  `storybook migrate` codemod runner (`storybook migrate csf-2-to-3`,
  `mdx-to-csf`, `stories-of-to-csf`, `--glob`/`-g`,
  `--rename '.js:.ts'`/`-r`, `--parser tsx`/`-p`, `--dry-run`), the
  `storybook doctor` command (duplicate dependencies, incompatible
  addons, version mismatches, runs after `upgrade`), Storybook 10 major
  breaking changes (ESM-only `main.{js,ts}` — no `require`,
  `__dirname`, `__filename`; Node 20.19+ or 22.12+; CSF Next preview
  promoted; `tags` filter improvements), Storybook 9 changes (Storysource
  addon removed — use `parameters.docs.codePanel: true` instead, import
  path `@storybook/test` → `storybook/test`, Storybook Test
  (`addon-vitest`) goes GA), Storybook 8 changes (Storyshots removed
  entirely — use Portable Stories API with `composeStories`, `-s`
  static-dir CLI flag removed — use `staticDirs` config, `nextjs-vite`
  framework introduced, Webpack 4 builder removed), CSF 2 → CSF 3
  migration (`storybook migrate csf-2-to-3` codemod, the named-export-
  to-object transformation, `bind({})` → direct spread, `render`
  function default behavior, auto-titles), CSF 3 → CSF Next migration
  (`storybook automigrate csf-factories` for fully-automated, manual
  steps for `definePreview`/`preview.meta`/`meta.story` plus the
  `.composed.args` property name change), `@storybook/test-runner` →
  `@storybook/addon-vitest` migration (remove test-runner + addon-
  coverage deps, delete `test-runner-jest.config.js` + `.storybook/
  test-runner.ts`, swap CI workflow from concurrently-with-http-server
  to a single vitest command, image snapshot replacements via the
  Visual Tests addon or `storybook-addon-vis`), MDX migration
  (`npx @hipster/mdx2-issue-checker`, `remark-gfm` for tables, MDX 3
  changes including component sandboxing — `code: MyCode` only applies
  to triple-backtick markdown not raw `<code>`), Svelte CSF v4 → v5
  migration (`<Meta>` / named `meta` export → `defineMeta`, `<Template>`
  → `template` snippet or `legacyTemplate: true`, slot-to-snippet
  migration, `autodocs` → `tags`), TanStack Router migration via
  `react-vite-to-tanstack-react` (replaces framework package, scans
  for manual router decorators and offers an AI prompt to remove them),
  Next.js Webpack → Vite migration via `nextjs-to-nextjs-vite` codemod,
  React Native Web addon → framework migration, Vue 2 EOL — Storybook
  8+ dropped Vue 2 support (pin to Storybook 7), Yarn PnP issues
  during migration, and the official MIGRATION.md as the canonical
  reference for every breaking change. Use whenever the user mentions
  upgrading Storybook, `storybook upgrade`, `storybook@latest upgrade`,
  Storybook 10 migration, Storybook 9 migration, Storybook 8 migration,
  ESM main config requirement, `automigrate`, `storybook doctor`,
  `storybook migrate`, codemods, CSF 2 to 3 migration, MDX migration,
  test-runner to vitest addon migration, Svelte CSF v5 upgrade,
  upgrading from Storybook 6/7, removing test-runner, removing
  Storyshots, removing Storysource, switching from `@storybook/test` to
  `storybook/test` import path, `nextjs-to-nextjs-vite`,
  `react-vite-to-tanstack-react`, `csf-factories` automigration, going
  from CSF 3 to CSF Next, upgrade health check, debugging upgrade
  failures, prerelease versions, semver bridging.
---

# Storybook Migration

Storybook follows [semver](https://semver.org). Patch and minor
releases are continuous; major releases happen roughly yearly and
include breaking changes. This skill covers everything in
`releases/` and the migration codemods in `api/`.

## The upgrade command — start here

The canonical way to upgrade:

```bash
npx storybook@latest upgrade
```

What it does:
1. Detects all `.storybook/` directories in your repo (including
   monorepos).
2. For each project:
   - Updates `storybook`, framework, and `@storybook/*` package
     versions in `package.json`.
   - Reinstalls deps.
   - Runs `storybook automigrate` to apply codemods and config fixes.
   - Runs `storybook doctor` to verify the upgrade.

### Critical rule: one major at a time

| OK | Not OK |
| --- | --- |
| Storybook 9 → `storybook@10 upgrade` | Storybook 7 → `storybook@10 upgrade` |
| Storybook 8 → `storybook@9 upgrade` → `storybook@10 upgrade` (two steps) | |

**Exception**: Storybook 6 → 8 works directly (`storybook@8 upgrade`).
Storybook 7 → 9 / 10 does NOT — go 7 → 8 → 9 → 10.

### Specifying a version

```bash
# Latest stable:
storybook@latest upgrade

# Specific patch:
storybook@8.6.1 upgrade

# Latest of a major (e.g., latest 9.x):
storybook@9 upgrade

# Pre-release (next major):
storybook@next upgrade

# Specific beta:
storybook@10.0.0-beta.1 upgrade
```

### Monorepo support

```bash
# Auto-detects all .storybook/ dirs and upgrades them in lockstep.
npx storybook@latest upgrade

# Limit to a subdirectory:
STORYBOOK_PROJECT_ROOT=./packages/frontend npx storybook@latest upgrade
```

If each project has its own independent Storybook deps in its own
`package.json`, you can pick which to upgrade. If they share deps,
they all upgrade together.

### Flags

| Flag | Notes |
| --- | --- |
| `-n`, `--dry-run` | Check for available upgrades without applying. |
| `-c, --config-dir <dirs>` | Explicit configs to upgrade (space-separated, e.g., `--config-dir .storybook .storybook-ui`). |
| `-y`, `--yes` | Skip all confirmation prompts. |
| `-f`, `--force` | Skip auto-blocker checks. |
| `-s`, `--skip-check` | Skip post-install version checks and automigration. |
| `--package-manager <name>` | `npm`/`pnpm`/`yarn1`/`yarn2`/`bun`. |
| `--logfile <path>` | Write debug logs (default: `debug-storybook.log`). |
| `--loglevel <level>` | `trace`/`debug`/`info`/`silent`/`trace`/`warn`. |
| `--disable-telemetry` | |

### Error handling

When upgrade fails:
1. Check `debug-storybook.log` (in repo root) for full diagnostics.
2. For more verbose logs: `--loglevel debug --logfile debug.log`.
3. Open a GitHub issue with the log attached.

## Major version migrations

### Storybook 10 (latest)

Breaking changes:

- **`main.{js,ts}` must be valid ESM.** No `require()`, no
  `__dirname`, no `__filename`. Use `import` and `import.meta.url`.
  Codemod handles most cases.
- **Node.js 20.19+ or 22.12+ required.**
- CSF Next promoted to preview (still opt-in).
- Improved tags-based filtering in the sidebar.

```diff
- // .storybook/main.js (Storybook 9)
- const path = require('path');
- module.exports = {
-   framework: '@storybook/react-vite',
-   stories: [path.resolve(__dirname, '../src/**/*.stories.tsx')],
- };

+ // .storybook/main.ts (Storybook 10)
+ import { fileURLToPath } from 'node:url';
+ import { dirname, resolve } from 'node:path';
+ const __dirname = dirname(fileURLToPath(import.meta.url));
+
+ import type { StorybookConfig } from '@storybook/react-vite';
+ const config: StorybookConfig = {
+   framework: '@storybook/react-vite',
+   stories: [resolve(__dirname, '../src/**/*.stories.tsx')],
+ };
+ export default config;
```

Or just use a glob (no `__dirname` needed):

```ts
stories: ['../src/**/*.stories.tsx']
```

Migrate:

```bash
storybook@10 upgrade
# Or, to also adopt CSF Next:
storybook@10 upgrade
npx storybook automigrate csf-factories
```

### Storybook 9

Highlights:
- **Storybook Test (Vitest addon) goes GA** — fully stable.
- **`@storybook/test` → `storybook/test`**. The import path moved:
  ```diff
  - import { fn, expect, userEvent } from '@storybook/test';
  + import { fn, expect, userEvent } from 'storybook/test';
  ```
  Automigration handles this.
- **Storysource addon removed.** Replace with the Code panel
  (`parameters.docs.codePanel: true`).
- **`@storybook/addon-essentials` deprecated.** Essentials are now
  built-in features (see `storybook-essentials`). The addon entry
  can be removed from `addons`.
- **`@storybook/addon-interactions` deprecated.** Replaced by the
  Vitest addon + built-in Interactions panel.

### Storybook 8

Highlights:
- **Renderer/builder/framework split landed.** New `*-vite` and
  `*-webpack5` framework packages.
- **`@storybook/test-runner` → `@storybook/addon-vitest` recommended**
  for Vite-based frameworks.
- **Storyshots removed entirely.** Use Portable Stories API:
  ```ts
  import { composeStories } from '@storybook/react-vite';
  const { Primary } = composeStories(stories);
  // expect(render(<Primary />).container).toMatchSnapshot();
  ```
  See the [Storyshots migration guide](https://storybook.js.org/docs/8/writing-tests/snapshot-testing/storyshots-migration-guide)
  (still archived at `release-8-6/`).
- **`-s` static-dir CLI flag removed.** Use `staticDirs` in `main.ts`.
- **Webpack 4 builder removed.** Upgrade your app to Webpack 5.
- **`nextjs-vite` framework introduced** as the recommended choice for
  Next.js projects.

### Storybook 7

(Already out of mainstream support but you may encounter projects
here.)
- CSF 3 became the recommended format.
- `storiesOf` API removed.
- New `framework` field replacing `framework` addons.
- Many addons folded into the core.
- For 7→9 path, you must go through 8 first.

## `storybook automigrate`

Runs config checks even without upgrading. Useful when you change
something in your project that affects Storybook (e.g., upgraded a
framework dependency, switched bundlers).

```bash
# Show what would be checked:
npx storybook automigrate --list

# Dry run:
npx storybook automigrate --dry-run

# Apply automatically without prompts:
npx storybook automigrate --yes

# Run a specific fix:
npx storybook automigrate csf-factories
npx storybook automigrate nextjs-to-nextjs-vite
npx storybook automigrate react-vite-to-tanstack-react
```

### Common fixes the automigration runs

| Fix ID | What it does |
| --- | --- |
| `csf-factories` | CSF 3 → CSF Next migration |
| `nextjs-to-nextjs-vite` | Swap `@storybook/nextjs` → `@storybook/nextjs-vite` |
| `react-vite-to-tanstack-react` | Swap `@storybook/react-vite` → `@storybook/tanstack-react`; detects manual router decorators |
| `react-webpack5-to-react-vite` | Migrate Webpack-based React framework to Vite |
| `addon-essentials-removal` | Remove deprecated `addon-essentials` registration |
| `package-deduplication` | Detect & resolve duplicate `@storybook/*` versions |
| `vite-config-typescript` | Convert `main.js` to `main.ts` for type safety |
| (many more — see `storybook automigrate --list` for the current set) | |

### `--renderer` for monorepos

When multiple Storybook configs target different frameworks:

```bash
npx storybook automigrate --renderer vue --config-dir packages/vue-app/.storybook
```

## `storybook migrate` — codemods

Codemods are AST transformations applied to your source files. Run with
`storybook migrate <id>` and provide a glob:

```bash
# List available codemods:
npx storybook migrate --list

# Run csf-2-to-3 on all React story files:
npx storybook migrate csf-2-to-3 --glob 'src/**/*.stories.tsx' --parser tsx

# Dry run:
npx storybook migrate csf-2-to-3 --glob '...' --dry-run

# Rename .js → .ts after migration:
npx storybook migrate csf-2-to-3 --glob '...' --rename '.js:.ts' --parser ts
```

### Common codemods

| Codemod | Purpose |
| --- | --- |
| `csf-2-to-3` | Convert CSF 2 (`Template.bind({})`) to CSF 3 (object syntax). |
| `csf-factories` | Convert CSF 3 to CSF Next factory format. |
| `mdx-to-csf` | Convert older `*.stories.mdx` (with embedded stories) into a `*.stories.tsx` + `*.mdx` pair. |
| `stories-of-to-csf` | Convert deprecated `storiesOf('...').add(...)` API to CSF 3. |

Flags:

| Flag | Purpose |
| --- | --- |
| `-g`, `--glob <pattern>` | Files to transform. |
| `-p`, `--parser <name>` | jscodeshift parser: `babel`/`babylon`/`flow`/`ts`/`tsx`. |
| `-n`, `--dry-run` | Print changes without writing. |
| `-r`, `--rename <from:to>` | Rename files (e.g., `'.js:.ts'`). |
| `-l`, `--list` | List available codemods. |
| `-c, --config-dir <dir>` | |

## `storybook doctor`

Health check — finds common upgrade issues:

```bash
npx storybook doctor
```

Reports on:
- Duplicate `@storybook/*` dependencies (different versions in
  `node_modules`)
- Incompatible addons (addon version doesn't match Storybook major)
- Mismatched framework + builder packages
- Missing required peer deps

Runs automatically at the end of `storybook upgrade`. Run manually
when something feels broken.

## Migration playbooks

### CSF 2 → CSF 3

CSF 2:
```ts
import Button from './Button';
export default { title: 'Button', component: Button };
const Template = (args) => <Button {...args} />;
export const Primary = Template.bind({});
Primary.args = { primary: true };
```

CSF 3:
```ts
import Button from './Button';
const meta = { component: Button };
export default meta;
export const Primary = { args: { primary: true } };
```

Automated:
```bash
npx storybook migrate csf-2-to-3 --glob 'src/**/*.stories.tsx' --parser tsx
```

Key changes:
- Named exports are **objects**, not functions.
- `bind({})` + `Primary.args = {...}` → direct `{ args: {...} }`.
- `render` becomes optional (Storybook uses a default render that
  spreads args onto `component`).
- Auto-titles work — you can omit `title` and Storybook derives it
  from the file path.

See `storybook-stories` → "Upgrading from CSF 2 to CSF 3" for the
full transformation reference.

### CSF 3 → CSF Next

```bash
npx storybook automigrate csf-factories
# Monorepo:
npx storybook automigrate csf-factories --config-dir packages/ui/.storybook
```

This runs through the manual steps documented in `storybook-stories`
→ "CSF Next (preview)". Briefly:

1. Update `main.ts` to use `defineMain`.
2. Update `preview.ts(x)` to use `definePreview({ addons: [addonA11y()] })`.
3. Update story files:
   - Import `preview` from your preview file.
   - Replace `const meta = {...} satisfies Meta<...>` with
     `const meta = preview.meta({...})`.
   - Replace `export const Primary: Story = {...}` with
     `export const Primary = meta.story({...})`.
   - For story-to-story args spreading, change `...Primary.args` to
     `...Primary.composed.args`.

If you cannot fully migrate all files, CSF 3 and CSF Next can
coexist in the same project (but not in the same file).

### `@storybook/test-runner` → `@storybook/addon-vitest`

Eligible: React, Preact, Vue, Svelte, Web Components projects on
Vite (or Next.js Vite). Stay on test-runner for Angular, Webpack,
Ember, Qwik, Solid.

```bash
# 1. Remove the old:
npm uninstall @storybook/test-runner @storybook/addon-coverage
rm -f test-runner-jest.config.js .storybook/test-runner.ts

# 2. Install the new:
npx storybook add @storybook/addon-vitest
```

Update `package.json` script:

```diff
- "test-storybook": "test-storybook"
+ "test-storybook": "vitest --project=storybook"
```

Update CI workflow:

```diff
-      - name: Build Storybook
-        run: npm run build-storybook --quiet
-      - name: Serve Storybook and run tests
-        run: |
-          npx concurrently -k -s first -n "SB,TEST" \
-            "npx http-server storybook-static --port 6006 --silent" \
-            "npx wait-on tcp:127.0.0.1:6006 && npm run test-storybook --coverage"
+      - name: Run storybook tests
+        run: npm run test-storybook
```

Plus the Playwright Docker image — see `storybook-testing` →
"In CI" for the full workflow examples.

### Image snapshot replacement

If you used `jest-image-snapshot` in `.storybook/test-runner.ts`, switch
to:
- [`@chromatic-com/storybook`](https://www.chromatic.com/storybook/) for cloud-based visual tests
- [`storybook-addon-vis`](https://github.com/repobuddy/visual-testing) for local snapshots

### Next.js Webpack → Vite

```bash
npx storybook automigrate nextjs-to-nextjs-vite
```

Automated changes:
1. `@storybook/nextjs` → `@storybook/nextjs-vite` in `package.json`.
2. `.storybook/main.ts` framework property updated.
3. Story file imports updated.

If you had `webpackFinal` callbacks, you'll need to manually port them
to `viteFinal`. See `storybook-builders` → "Migrating a Webpack project
to Vite".

### `@storybook/react-vite` → `@storybook/tanstack-react`

```bash
npx storybook automigrate react-vite-to-tanstack-react
```

Automated changes:
1. `@storybook/react-vite` → `@storybook/tanstack-react` in `package.json`.
2. `.storybook/main.ts` framework property updated.
3. Story file imports updated.
4. **Detects manual TanStack Router decorators** in `.storybook/preview.*`
   and individual story files, and offers a clipboard-ready AI prompt
   to walk an AI assistant through removing them (the framework
   provides a router automatically).

After migration, manually remove any `RouterProvider` / `createRouter` /
`createMemoryHistory` / `createRootRoute` decorators from
`preview.tsx`. For stories that need a specific route, use
`parameters.tanstack.router` instead.

### MDX migration

Storybook now uses MDX 3. Common issues:

```bash
# Find problematic files:
npx @hipster/mdx2-issue-checker
```

Manual fixes for common issues:

- **GitHub Flavored Markdown tables don't render.** Install `remark-gfm`:
  ```bash
  npm i -D remark-gfm
  ```
  ```ts
  addons: [{
    name: '@storybook/addon-docs',
    options: {
      mdxPluginOptions: {
        mdxCompileOptions: { remarkPlugins: [(await import('remark-gfm')).default] },
      },
    },
  }],
  ```
- **Components MDX 3 changes:** `code: MyCode` only applies to
  triple-backtick markdown blocks, not raw `<code>` JSX. This is an
  MDX upstream change, not a Storybook bug.
- **VSCode**: install [the MDX extension](https://marketplace.visualstudio.com/items?itemName=unifiedjs.vscode-mdx)
  and add `{ "mdx.server.enable": true }` to settings.

### Svelte CSF v4 → v5 (Svelte 5 ready)

Required when you upgrade to Svelte 5. Automigrate covers most of it:

```bash
storybook upgrade
# In a Svelte project, this will offer to run the Svelte CSF migration.
```

Manual changes if needed:

1. **`<Meta />` / named `meta` export → `defineMeta(...)`**:
   ```diff
   - import { Meta } from '@storybook/addon-svelte-csf';
   + import { defineMeta } from '@storybook/addon-svelte-csf';
   - <Meta title="Button" component={Button} />
   + const { Story } = defineMeta({ title: 'Button', component: Button });
   ```

2. **`<Template>` → `{#snippet template(args)}`**:
   ```diff
   - <Template let:args>
   -   <Button {...args} />
   - </Template>
   - <Story name="Primary" args={{ primary: true }} />
   + <Story name="Primary" args={{ primary: true }}>
   +   {#snippet template(args)}
   +     <Button {...args} />
   +   {/snippet}
   + </Story>
   ```
   Or temporarily: `legacyTemplate: true` in addon options.

3. **`<Story autodocs />` → `<Story tags={['autodocs']} />`**.

4. **Slots → snippets** in Svelte 5 stories (Svelte upstream change).

See `storybook-frameworks/references/svelte.md` for the full guide.

### React Native Web addon → framework

If you were using `@storybook/addon-react-native-web` (Webpack-based),
upgrade to `@storybook/react-native-web-vite` (Vite-based):

```bash
storybook upgrade            # to 8.5+
npm i -D @storybook/react-native-web-vite
```

Update `.storybook/main.ts`:

```diff
- framework: '@storybook/react-webpack5',
+ framework: '@storybook/react-native-web-vite',
- addons: [..., '@storybook/addon-react-native-web'],
+ addons: [/* same minus the rnw addon */],
```

Uninstall the old:

```bash
npm uninstall @storybook/react-webpack5 @storybook/addon-react-native-web
```

See `storybook-frameworks/references/react-native.md` for details.

### Vue 2 → Vue 3 (with Storybook)

Vue 2 entered EOL on Dec 31, 2023. Storybook 8+ dropped Vue 2 support.
Options:

1. **Migrate your app to Vue 3** (recommended). Then upgrade Storybook
   to latest.
2. **Stay on Storybook 7.x** if you can't migrate. Install with:
   ```bash
   npx storybook@7 init
   # Or upgrade-pin:
   npx storybook@latest@7 upgrade
   ```

## Prereleases

For testing upcoming Storybook majors:

```bash
# Newest pre-release:
storybook@next upgrade

# Specific beta:
storybook@10.0.0-beta.42 upgrade

# Newest within a major:
storybook@10 upgrade
```

To downgrade after a pre-release: manually edit version numbers in
`package.json` and reinstall.

## Common pitfalls

1. **"Cannot find module 'X'" after upgrade.** Run `storybook doctor`.
   Most often a duplicate-version issue. Delete `node_modules` and
   `package-lock.json` / `pnpm-lock.yaml` / `yarn.lock`, reinstall.
2. **`automigrate` says "everything's fine" but tests fail.** The
   automigration only updates `.storybook/` configs and story/MDX
   files. Hand-written code that uses Storybook APIs needs manual
   updates. Check `MIGRATION.md` for the list.
3. **`require()` in `main.js` breaks after upgrading to 10.** Convert
   to ESM (see [Storybook 10](#storybook-10-latest) above).
4. **`@storybook/test` doesn't exist anymore.** The 9 → 10 import
   move: `import { fn } from 'storybook/test'`. Automigration fixes
   this.
5. **CI workflows that ran `test-storybook` fail after migration.**
   Update the script to `vitest --project=storybook`. See
   `storybook-testing` → "In CI".
6. **TanStack story works after migration but the router context is
   doubled.** You forgot to remove the manual `RouterProvider`
   decorator. The framework now provides one automatically.
7. **Big monorepo, automigrate is slow.** Use `STORYBOOK_PROJECT_ROOT`
   to limit scope.
8. **Storybook crashes on startup post-upgrade.** Run with
   `--loglevel debug --logfile sb-debug.log` and grep the log for
   stack traces. Common culprits: an addon that needs its own upgrade,
   stale cache (`rm -rf node_modules/.cache/storybook`).
9. **Yarn PnP breaks during upgrade.** Switch `nodeLinker: node-modules`
   in `.yarnrc.yml` temporarily. PnP support has improved but isn't
   guaranteed for upgrade workflows.
10. **Storybook 10's ESM main breaks `jest.setup.ts` or other Jest
    files that read `.storybook/main.ts`.** Use `import('./main.ts')`
    dynamic import (ESM compatible). Or use the Vitest addon (which
    has its own setup).

## The canonical migration reference

For every breaking change in every version, the source of truth is the
[`MIGRATION.md` file](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md)
in the main repo. The automigration script reads from this list, but
when something automigrate doesn't handle, that's where to look.

## See also

- `storybook-core` — install + version landscape
- `storybook-config` — `main.ts` schema (what's allowed in each version)
- `storybook-stories` — CSF 3 / CSF Next / Svelte CSF format reference
- `storybook-testing` — Vitest addon vs test-runner migration
- `storybook-frameworks` — per-framework migrations (`nextjs-vite`, `tanstack-react`, RN Web)
- `storybook-docs` — MDX migration with `@hipster/mdx2-issue-checker`
- `storybook-builders` — Webpack → Vite migration recipes
