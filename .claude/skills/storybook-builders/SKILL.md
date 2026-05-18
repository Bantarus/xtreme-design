---
name: storybook-builders
description: >
  Storybook builders — Vite and Webpack 5 — the bundlers that compile your
  components and stories into the JavaScript that runs in the preview
  iframe. Covers Vite builder setup (`@storybook/builder-vite`, `framework`
  vs `core.builder` selection, automatic merging with project's
  `vite.config.{js,ts}`, `viteFinal` async customization function with
  `(config, options) => InlineConfig`, environment-based config branching,
  `viteConfigPath` override, disabling auto vite config loading, TypeScript
  vite builder via `import type { StorybookConfig } from
  '@storybook/your-framework'`, server.fs.strict default, ArgType inference
  via `react-docgen` vs `react-docgen-typescript` opt-in, jest-mock
  shim in preview-head for interaction tests, migration from Webpack
  configs with side-by-side `webpack-final-to-vite-final` recipes), Webpack
  builder setup (`@storybook/builder-webpack5` default since v8 — Webpack 4
  removed entirely, default zero-config behavior — static asset imports,
  JSON imports, on-demand architecture, `webpackFinal` customization,
  preserving `entry`/`output`/`HtmlWebpackPlugin` when overriding
  `config.plugins`, importing existing Webpack config with merge,
  `lazyCompilation` experimental feature for faster dev startup, `fsCache`
  for persistent module caching between runs, debug with
  `--debug-webpack` and `--stats-json`, tsconfig path alias resolution
  via `tsconfig-paths-webpack-plugin`, fixing absolute `@/` imports),
  compiler support (SWC zero-config auto-applied to Vite-and-Webpack
  frameworks except Angular/CRA/Ember/Next.js, `@storybook/addon-webpack5-
  compiler-swc` install with `npx storybook add @storybook/addon-webpack5-
  compiler-swc`, customizing SWC via `main-config-swc.mdx`, JSX transform
  fix for React 17+ — `jsc.transform.react.runtime: 'automatic'`, Babel
  with `@storybook/addon-webpack5-compiler-babel`, file-relative
  `.babelrc.json` and project-wide `babel.config.js` lookup, CRA
  `@storybook/preset-create-react-app` integration, debugging via
  `BABEL_SHOW_CONFIG_FOR=.storybook/preview.js`), the Builder API for
  building custom builders (`@storybook/builder-*` package structure,
  the `start`/`build`/`bail` interface, virtual preview entry, MDX support,
  HMR contract, dev-server integration, examples — Vite/Webpack5/Modern
  Web's dev-server-storybook, Rspack/Rsbuild via `storybook-rsbuild`),
  `viteFinal` / `webpackFinal` callbacks with `options.configType
  === 'DEVELOPMENT' | 'PRODUCTION'` branching, common recipes —
  GraphQL loader, image-asset rules, Webpack→Vite migration via
  `webpackPlugin → viteIstanbulPlugin` for coverage, instrumenting code
  with Istanbul for the coverage addon, monorepo Yarn PnP /
  workspaces resolution fixes, alias-based mocking as a fallback when
  automocking and subpath imports don't fit. Use whenever the user
  mentions Vite builder, Webpack builder, `@storybook/builder-vite`,
  `@storybook/builder-webpack5`, `viteFinal`, `webpackFinal`,
  SWC compiler, Babel compiler, `@storybook/addon-webpack5-compiler-swc`,
  `@storybook/addon-webpack5-compiler-babel`, switching builders,
  migrating from Webpack to Vite, `--debug-webpack`, `--stats-json`,
  `lazyCompilation`, `fsCache`, builder options, custom builders,
  HMR in Storybook, module resolution issues, `tsconfig` paths in
  Storybook, builder API, Rspack/Rsbuild for Storybook, builder aliases
  for mocking, configuring the bundler that ships with a framework.
---

# Storybook Builders

A **builder** in Storybook is the bundler that compiles your components,
stories, and addons into the JavaScript that runs in the preview iframe.
It also provides the dev server (with HMR) and the production build
emitter.

Two builders are officially supported:

| Builder | Package | Default for |
| --- | --- | --- |
| **Vite** (recommended) | `@storybook/builder-vite` | All `*-vite` frameworks (React Vite, Vue Vite, Svelte Vite, SvelteKit, Preact Vite, Nextjs Vite, Web Components Vite, HTML Vite, TanStack React) |
| **Webpack 5** | `@storybook/builder-webpack5` | React Webpack5, Angular (Angular CLI under the hood), Next.js (legacy), Ember |

A third option, **Rspack / Rsbuild**, is community-maintained
([`storybook-rsbuild`](https://github.com/rspack-contrib/storybook-rsbuild)).

> Webpack 4 was removed entirely in Storybook 8. If you're on Webpack 4,
> upgrade your app to Webpack 5 first, then run `storybook automigrate`.

## How the builder is selected

You normally don't pick a builder directly — you pick a **framework**,
and the framework ships with one builder pre-wired:

```ts
// .storybook/main.ts
const config: StorybookConfig = {
  framework: '@storybook/react-vite',     // includes builder-vite
};
```

Override the builder only when you genuinely need a non-default
combination (very rare):

```ts
core: {
  builder: { name: '@storybook/builder-webpack5', options: { lazyCompilation: true } },
},
```

Override per-framework option (the preferred shape since SB 8):

```ts
framework: {
  name: '@storybook/react-webpack5',
  options: {
    builder: { lazyCompilation: true, fsCache: true },
  },
},
```

## Vite builder

`@storybook/builder-vite` extends your project's `vite.config.{js,ts}`,
merging Storybook's defaults on top. If you already have a Vite app,
your Vite plugins, aliases, and PostCSS / Sass config carry over for
free.

### Setup (manual)

```bash
npm i -D @storybook/builder-vite vite
```

```ts
// .storybook/main.ts
const config: StorybookConfig = {
  framework: { name: '@storybook/react-vite', options: {} },
  // OR — if not using a Vite framework:
  core: { builder: '@storybook/builder-vite' },
};
```

### `viteFinal` — customize the merged Vite config

```ts
// .storybook/main.ts
import { mergeConfig } from 'vite';
import path from 'node:path';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(js|ts|tsx)'],
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      resolve: {
        alias: { '@': path.resolve(__dirname, '../src') },
      },
      define: {
        __DEV__: configType === 'DEVELOPMENT',
      },
    });
  },
};
```

`viteFinal` receives:
- `config: InlineConfig` — the merged Vite config so far.
- `options: { configType: 'DEVELOPMENT' | 'PRODUCTION', presetsList, ... }`.

Use `mergeConfig` from `vite` — directly mutating `config` can cause
unexpected ordering issues.

### Point at a custom Vite config file

```ts
core: {
  builder: {
    name: '@storybook/builder-vite',
    options: { viteConfigPath: 'configs/storybook-vite.config.ts' },
  },
},
```

Set `viteConfigPath` to a non-existent file to **disable** auto-loading
the project's `vite.config.ts`.

### TypeScript setup

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  // ...
};
export default config;
```

The framework package re-exports the typed `StorybookConfig` so you get
autocomplete on every option, including `viteFinal`'s `config` and
`options.configType`.

### Defaults you get for free

- All of your project's Vite plugins
- All of your `resolve.alias` entries
- PostCSS / Sass / Less / Stylus pre-processors
- CSS Modules
- TypeScript transpilation (via esbuild)
- `import.meta.env.STORYBOOK_*` env vars
- HMR
- `server.fs.strict: true` (sandboxes file system access to Storybook's
  config directory by default — override in `viteFinal` if you need
  cross-directory imports)

### Migrating a Webpack project to Vite

Vite handles more out of the box than Webpack. Start with **no** custom
Vite config and add only what your project actually needs.

Reference recipe — replacing a Webpack rule for `.graphql` files:

```ts
// Before (webpack):
async webpackFinal(config) {
  config.module?.rules?.push({ test: /\.graphql$/, loader: 'graphql-tag/loader' });
  return config;
},

// After (vite, with @rollup/plugin-graphql):
async viteFinal(config) {
  const { default: graphql } = await import('@rollup/plugin-graphql');
  return mergeConfig(config, { plugins: [graphql()] });
},
```

Webpack→Vite migration guide:
`sources/storybook/docs/builders/vite.mdx#migrating-from-webpack`.

### React-specific Vite knob — react-docgen

By default the Vite framework uses `react-docgen` (fast). For projects
that need `react-docgen-typescript` (TS enums, `forwardRef`, complex
inheritance):

```ts
typescript: {
  reactDocgen: 'react-docgen-typescript',
  reactDocgenTypescriptOptions: { /* ... */ },
},
```

### Vite + Vitest interaction-test shim

Some libraries (e.g. tests imported via the Vitest addon) expect a
`window`-shaped `mock` global. If your tests blow up with "window is not
defined", add to `.storybook/preview-head.html`:

```html
<script>
  if (!window.mocked) window.mocked = {};
</script>
```

(Full recipe at
`sources/storybook/docs/_snippets/storybook-vite-builder-jest-mock.md`.)

---

## Webpack 5 builder

Default for Webpack-based frameworks (React Webpack5, Angular, Ember,
legacy Next.js).

### Setup (manual)

```bash
npm i -D @storybook/builder-webpack5
```

```ts
core: { builder: '@storybook/builder-webpack5' },
```

Or via the framework:

```ts
framework: { name: '@storybook/react-webpack5', options: {} },
```

### `webpackFinal` — customize the Webpack config

```ts
// .storybook/main.ts
async webpackFinal(config, { configType }) {
  // Add a custom loader
  config.module?.rules?.push({
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  });

  // Append a plugin (don't replace — HtmlWebpackPlugin must stay):
  config.plugins?.push(new MyPlugin());

  // Branch on environment
  if (configType === 'PRODUCTION') {
    config.optimization = { ...config.optimization, minimize: true };
  }

  // CRITICAL: do NOT overwrite `entry` or `output` — Storybook owns them.
  return config;
},
```

### Built-in defaults

The Webpack builder ships with sensible defaults for:

- Static asset imports (`import logo from './logo.png'`).
- JSON imports.
- ES modules + `.cjs` / `.mjs`.
- `on-demand` story loading (since SB 7) — only the visible story is
  bundled in dev, dramatically reducing memory usage.
- HMR.

### Lazy compilation

```ts
core: {
  builder: { name: '@storybook/builder-webpack5', options: { lazyCompilation: true } },
},
```

Defers compilation of modules until they're requested by the browser.
Speeds up dev startup at the cost of slightly slower in-app navigation.
Dev mode only.

### Filesystem cache

```ts
core: {
  builder: { name: '@storybook/builder-webpack5', options: { fsCache: true } },
},
```

Persists module-compilation cache between runs in `node_modules/.cache/storybook`.
Subsequent startups are much faster.

### Importing an existing Webpack config

```ts
// .storybook/main.ts
import customConfig from '../webpack.config.js';

async webpackFinal(config) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [...(config.module?.rules ?? []), ...customConfig.module.rules],
    },
    resolve: {
      ...config.resolve,
      alias: { ...config.resolve?.alias, ...customConfig.resolve.alias },
    },
  };
},
```

### TypeScript path resolution

Webpack doesn't honor `tsconfig.json` `paths` mappings out of the box.
Use `tsconfig-paths-webpack-plugin`:

```bash
npm i -D tsconfig-paths-webpack-plugin
```

```ts
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

async webpackFinal(config) {
  config.resolve = {
    ...config.resolve,
    plugins: [...(config.resolve?.plugins ?? []), new TsconfigPathsPlugin()],
  };
  return config;
},
```

For simple aliases (no TS), set them directly:

```ts
async webpackFinal(config) {
  config.resolve!.alias = { ...config.resolve!.alias, '@': path.resolve(__dirname, '../src') };
  return config;
},
```

### Debugging the Webpack config

```bash
# Dev:
yarn storybook dev --debug-webpack

# Build:
yarn storybook build --debug-webpack

# Emit a webpack stats.json:
yarn storybook build --stats-json /tmp/sb-stats.json
```

Inspect with `webpack-bundle-analyzer`:

```bash
npx webpack-bundle-analyzer /tmp/sb-stats.json
```

### Webpack-built Storybook with Webpack 4 in the host project

Removed in SB 8. Upgrade your app to Webpack 5, then run:

```bash
npx storybook@latest automigrate
```

### `addon-styling-webpack` for CSS / Sass / Less / Tailwind

Webpack doesn't natively handle CSS modules or pre-processors. Install
the styling addon:

```bash
npx storybook add @storybook/addon-styling-webpack
```

It wires up `css-loader`, `style-loader`, `postcss-loader`, and the
SCSS/Less/Stylus loaders. Auto-detects what's installed.

> Next.js uses its own pipeline (`@storybook/nextjs` or
> `@storybook/nextjs-vite`) and does NOT need this addon — it
> auto-recreates Next.js's Webpack/Vite config.

---

## Compiler support

Storybook is compiler-agnostic. By default it uses **SWC** for Vite and
for most Webpack frameworks (Angular, CRA, Ember, and Webpack-based
Next.js are exceptions and use their native compilers).

### SWC

Already on by default for new projects on Vite or Webpack5. To customize:

```ts
// .storybook/main.ts
swc: () => ({
  jsc: {
    transform: { react: { runtime: 'automatic' } },
    parser: { syntax: 'typescript', tsx: true, decorators: true },
  },
}),
```

#### Common SWC fix — React 17+ JSX transform

If you don't import React explicitly and you see "React is not defined"
errors with the Vite builder using SWC:

```ts
swc: () => ({
  jsc: { transform: { react: { runtime: 'automatic' } } },
}),
```

#### Add SWC to a Webpack project

```bash
npx storybook add @storybook/addon-webpack5-compiler-swc
```

This addon switches Webpack's TS/JS loaders to `swc-loader` (much
faster than `babel-loader`). It reads your project's `.swcrc` if
present.

### Babel

Auto-detected from your project's `babel.config.js` / `.babelrc.json`.

#### Add Babel to a Webpack project (if SWC doesn't fit)

```bash
npx storybook add @storybook/addon-webpack5-compiler-babel
```

This installs `babel-loader` and an appropriate preset chain.

#### CRA integration

If your project is a Create React App, install
`@storybook/preset-create-react-app` (auto-installed by the CLI when
you initialize Storybook in a CRA project). It reuses CRA's Babel and
Webpack config, so Sass/TypeScript/etc. all work without extra setup.

#### Customize Babel

```ts
// .storybook/main.ts
babel: async (config) => ({
  ...config,
  plugins: [...config.plugins, '@babel/plugin-proposal-pipeline-operator'],
}),
```

`babelDefault` is the same but for addon code (rarely needed).

#### Debug Babel config

```bash
BABEL_SHOW_CONFIG_FOR=.storybook/preview.js yarn storybook
```

Prints the effective Babel config for that file (and crashes the build —
that's how it works upstream). Remove the env var and restart afterward.

---

## The Builder API — making a custom builder

For most people, "make a builder" means writing an addon that customizes
the existing Vite/Webpack pipeline. But Storybook does support full
builder swap-outs (Vite, Webpack 5, esbuild are all implemented this way).

### What a builder is

A builder exposes:

```ts
import type { Builder } from '@storybook/types';

const builder: Builder = {
  start: async ({ options, startTime, router, server }) => {
    // Boot dev server, watch files, return a bail function + close handle
    return {
      bail: async () => { /* graceful shutdown */ },
      stats: { toJson: () => ({ /* webpack-stats-shaped */ }) },
      totalTime: process.hrtime(startTime),
    };
  },

  build: async ({ options, startTime }) => {
    // Produce a static build, return stats
  },

  bail: async () => { /* called on Ctrl-C */ },

  getConfig: async (options) => { /* compute final config */ },

  corePresets: ['/path/to/preview-preset'],
  overridePresets: [],
};
```

The full interface lives at
`https://github.com/storybookjs/storybook/blob/next/code/core/src/types/modules/core-common.ts`.

### What a builder must support

To play nicely with all of Storybook's features:

1. **Load stories** from the `stories` globs.
2. **Watch files** for changes (HMR in dev, rebuild in build).
3. **Transform MDX** via Storybook's docs plugin.
4. **Provide source-code snippets** for ArgTypes / Source doc block
   (Webpack does this via loaders; Vite via a plugin).
5. **Serve `iframe.html`** as the preview entry point.
6. **Build static `storybook-static/`** with everything inline-able.

### Reference implementations

- Vite — `https://github.com/storybookjs/storybook/tree/next/code/builders/builder-vite`
- Webpack 5 — `https://github.com/storybookjs/storybook/tree/next/code/builders/builder-webpack5`
- Modern Web — `https://github.com/modernweb-dev/web/blob/master/packages/dev-server-storybook/src/serve/storybookPlugin.ts`
- Rspack / Rsbuild — `https://github.com/rspack-contrib/storybook-rsbuild`

### Registering a custom builder

```ts
// .storybook/main.ts
core: {
  builder: '@your-org/storybook-builder-mybundler',
},
```

Open an [RFC](https://github.com/storybookjs/storybook/discussions/categories/rfc)
on the Storybook repo before publishing a public builder — the API is
under rapid development and the maintainers can help shape it.

---

## Builder aliases — last-resort module mocking

When `sb.mock(...)` automocking and Node subpath imports don't fit
(legacy module structures, vendored libraries, etc.), alias the module
at the builder layer:

### Vite

```ts
async viteFinal(config) {
  return mergeConfig(config, {
    resolve: {
      alias: {
        '../lib/session': path.resolve(__dirname, '../lib/session.mock.ts'),
        'uuid':            path.resolve(__dirname, '../__mocks__/uuid.ts'),
      },
    },
  });
},
```

### Webpack

```ts
async webpackFinal(config) {
  config.resolve!.alias = {
    ...config.resolve!.alias,
    '../lib/session': path.resolve(__dirname, '../lib/session.mock.ts'),
  };
  return config;
},
```

Stories then import normally; the bundler swaps in the mock at compile
time:

```ts
import { getUserFromSession } from '../lib/session';   // → resolves to .mock.ts
```

See `storybook-stories` → "Mocking modules" for the recommended
approach (automocking + `sb.mock`) and the more portable alternative
(subpath imports).

---

## Instrumenting code for coverage

The `@storybook/addon-coverage` addon (used by the test-runner) needs
Istanbul instrumentation:

```ts
// .storybook/main.ts
addons: [
  '@storybook/addon-coverage',   // legacy — test-runner only
],
```

The addon auto-uses:
- `vite-plugin-istanbul` on Vite projects.
- `istanbul-lib-instrument` on Webpack projects.

Vite options:

```ts
addons: [{
  name: '@storybook/addon-coverage',
  options: {
    istanbul: {
      include: ['**/stories/**'],
      exclude: ['**/node_modules/**'],
      checkProd: false,
      requireEnv: false,
    },
  },
}],
```

Webpack options include `autoWrap`, `coverageVariable`, `produceSourceMap`,
`sourceMapUrlCallback` etc. (full schema in
`sources/storybook/docs/writing-tests/integrations/test-runner.mdx`).

> Note: if you're on the Vitest addon (v9+), coverage is **built in**
> via Vitest's native `coverage` config — you don't need
> `addon-coverage`. See `storybook-testing` → "Test coverage".

---

## Yarn PnP support

Storybook works with Yarn 4+, but Yarn 2/3 Plug'n'Play setups need
extra care because some Storybook internals expect a `node_modules`
folder for caching:

- Storybook will create a small `node_modules/.cache/storybook` folder.
  Add to `.gitignore`.
- The test-runner historically had issues with `jest-playwright-preset`
  in PnP. Either switch `nodeLinker` to `node-modules`, or migrate to
  the Vitest addon (recommended).

For new projects on Yarn 4, use `nodeLinker: node-modules` for the
smoothest experience.

---

## Monorepo concerns

### Workspace packages and Vite

If your stories import workspace siblings (`"workspace:*"` deps), Vite
needs to resolve the source files (not the unbuilt `dist/`):

```json
// root tsconfig.json
{
  "compilerOptions": {
    "paths": { "@myorg/*": ["./packages/@myorg/*/src"] }
  }
}
```

Storybook reads root `tsconfig.json` `paths` as a fallback. Per-package
tsconfigs can override and break this — ensure each package's tsconfig
`extends` the root.

### Webpack + `react-docgen-typescript` + monorepos

Add workspace source paths to the docgen `include` list, otherwise
inherited types from sibling packages won't be picked up:

```ts
typescript: {
  reactDocgen: 'react-docgen-typescript',
  reactDocgenTypescriptOptions: {
    include: ['**/*.tsx', '../../packages/ui/src/**/*.tsx'],
  },
},
```

`tsconfigPath` only affects which compiler options are used — it does
NOT change which files are included in the TS program.

### Multiple Storybooks in one repo

Each project has its own `.storybook/` directory. Use Storybook
**Composition** (`refs` in `main.ts`) to combine them at view time:

```ts
refs: {
  designSystem: { title: 'Design System', url: 'http://localhost:6007' },
  apps:         { title: 'Apps',          url: 'http://localhost:6008' },
},
```

See `storybook-sharing` for the full Composition guide.

---

## Common pitfalls

1. **`viteFinal` mutations don't apply.** Always `return` the modified
   config (the function signature is `(config) => InlineConfig`).
   Don't mutate the argument in-place and forget to return.
2. **`webpackFinal` blows up `HtmlWebpackPlugin`.** Don't overwrite
   `config.plugins` — append to it. Don't overwrite `config.entry` or
   `config.output` — Storybook owns them.
3. **Vite is slower than expected.** Pre-bundle commonly-used deps via
   `optimizeDeps.include` in your Vite config, or in `viteFinal`. This
   is the same fix as for "Vitest failed to find the current suite"
   errors in tests.
4. **Webpack lazyCompilation breaks production builds.** It's a dev-only
   feature. Don't enable it for `storybook build`.
5. **Tailwind classes don't appear in stories.** Tailwind needs to scan
   your story files for class usage. Add `"./src/**/*.stories.{js,ts,
   tsx}"` to `tailwind.config.js`'s `content` array. Make sure your
   Tailwind CSS is imported from `.storybook/preview.{ts,tsx}` (not
   from a story).
6. **SWC fails on React without explicit `react` imports.** Set
   `swc.jsc.transform.react.runtime = 'automatic'`. See above.
7. **Storybook can't resolve `~`, `@`, `@/components`.** Aliases must
   be set in BOTH Webpack/Vite config AND `tsconfig.json` `paths`. Use
   `tsconfig-paths-webpack-plugin` for Webpack to read the tsconfig.
8. **Coverage report is empty.** With the Vitest addon, check that
   `vitest --coverage --project=storybook` is the command. With the
   test-runner, install `@storybook/addon-coverage` and ensure
   `coverage/storybook/` exists after the run.
9. **`exports is not defined` when automocking with Webpack.** That
   means the module you're mocking is CommonJS-only. Use a `__mocks__/`
   file instead. See `storybook-stories` → "Mocking modules".
10. **The dev server crashes on macOS with "EMFILE: too many open
    files".** macOS's default file watcher limit is low. Either bump
    `ulimit -n 4096` in your shell profile, or `brew install watchman`
    and Vite/Webpack pick it up automatically.

## See also

- `storybook-core` — install, CLI, version landscape
- `storybook-config` — full `main.ts` schema, `typescript`/`babel`/`swc` config
- `storybook-frameworks` — per-framework builder choice (React Vite vs Webpack, Next.js Vite vs Webpack)
- `storybook-stories` — module mocking via builder aliases
- `storybook-testing` — coverage instrumentation, Vitest addon's reliance on Vite
- `storybook-addons` — writing presets (the way addons customize the builder under the hood)
