---
name: storybook-config
description: >
  Configuring Storybook — the `.storybook/` directory, the `main.{js,ts}` /
  `preview.{js,ts}` / `manager.{js,ts}` triad, and every knob inside them.
  Covers `main.ts` full schema (`framework`, `stories` globs + object form +
  custom indexers, `addons`, `core` with `builder`/`disableTelemetry`/
  `allowedHosts`/`crossOriginIsolated`/`channelOptions`, `docs`,
  `features` flag table — `actions`/`backgrounds`/`changeDetection`/
  `componentsManifest`/`controls`/`developmentModeForBuild`/
  `experimentalCodeExamples`/`experimentalTestSyntax`/`highlight`/
  `interactions`/`legacyDecoratorFileOrder`/`measure`/`outline`/
  `sidebarOnboardingChecklist`/`toolbars`/`viewport`/`angularFilterNonInputControls`,
  `build.test` perf optimization — `disableBlocks`/`disabledAddons`/
  `disableMDXEntries`/`disableAutoDocs`/`disableDocgen`/`disableSourcemaps`/
  `disableTreeShaking`, `env`, `logLevel`, `managerHead`, `previewHead`,
  `previewBody`, `previewAnnotations`, `refs` for Composition, `staticDirs`,
  `tags` defaults, `typescript` — `check`/`checkOptions`/`reactDocgen`/
  `reactDocgenTypescriptOptions`/`skipCompiler`, `babel`/`babelDefault`,
  `swc`, `viteFinal`, `webpackFinal`, ESM-only requirement in SB 10),
  `preview.ts` full schema (`decorators`, `parameters`, `globalTypes`,
  `initialGlobals`, `args`, `argTypes`, `loaders`, `beforeAll`, `beforeEach`,
  `afterEach`, `tags`), `manager.ts` full schema (`addons.setConfig(...)`
  with `navSize`/`bottomPanelHeight`/`rightPanelWidth`/`panelPosition`/
  `enableShortcuts`/`showToolbar`/`theme`/`selectedPanel`/`initialActive`/
  `sidebar.showRoots`/`sidebar.collapsedRoots`/`sidebar.renderLabel`/
  `toolbar.{id}.hidden`/`layoutCustomisations.showSidebar`/`showPanel`/
  `showToolbar`), preview-head.html / preview-body.html / manager-head.html
  raw injection, story loading (default glob, configuration object form,
  directory form, custom logic form, on-demand limitations), story
  rendering (initializing libraries, head/body injection), story layout
  (`centered`/`fullscreen`/`padded` at project/component/story levels),
  styling and CSS (importing CSS in preview.ts, CSS modules in Vite vs
  Webpack, PostCSS, Sass/Less/Stylus, CSS-in-JS, webfonts, Angular global
  styles in `angular.json`), environment variables (`STORYBOOK_*` prefix,
  `import.meta.env` vs `process.env`, `.env`/`.env.development`/
  `.env.production`, `BROWSER` selector, `env` config function), TypeScript
  integration (`tsconfig` aliases, `check`/`checkOptions` for Webpack,
  `reactDocgen` vs `reactDocgen-typescript`, `skipCompiler`,
  `tsconfig-paths-webpack-plugin` workaround), compiler support (SWC zero-
  config for Vite/Webpack, Babel config-files lookup, BABEL_SHOW_CONFIG_FOR
  debugging), images and assets (importing local assets, CDN, static dirs,
  fonts in preview-head.html), ESLint plugin (`eslint-plugin-storybook`,
  flat config style, ESLint v8/v9 compatibility, `csf`/`csf-strict`/
  `recommended`/`addon-interactions` rulesets, full rule table — `await-
  interactions`/`context-in-play-function`/`csf-component`/`default-
  exports`/`hierarchy-separator`/`meta-inline-properties`/`meta-satisfies-
  type`/`no-redundant-story-name`/`no-renderer-packages`/`no-stories-of`/
  `no-title-property-in-meta`/`no-uninstalled-addons`/`prefer-pascal-case`/
  `story-exports`/`use-storybook-expect`/`use-storybook-testing-library`),
  sidebar and URL hierarchy (auto-titles with `titlePrefix`, redundant
  filename collapsing, `showRoots`, `renderLabel`, `id` permalinks,
  custom story indexers for non-CSF stories), features and behavior
  (panel position, toolbar visibility, conditional sidebar via
  `layoutCustomisations.showSidebar`/`showPanel`/`showToolbar` functions
  with `path`/`viewMode`/`singleStory`/`storyId`/`index`/`layout`),
  theming (built-in light/dark/normal, `create()` from `storybook/theming`,
  brand image / brand title, separate docs theme via
  `parameters.docs.theme`, CSS class escape hatches in manager-head.html,
  emotion-based addon styling), change detection (preview feature flagged
  via `features.changeDetection`, dev-only, git + builder module-graph
  based, "new"/"modified"/"related" status icons, sidebar Review button,
  filtering, debugging via `STORYBOOK_CHANGE_DETECTION_DEBUG`, barrel-
  file caveats in monorepos, root-tsconfig path mappings as fallback).
  Use whenever the user mentions `.storybook/main.ts`, `.storybook/preview.ts`,
  `.storybook/manager.ts`, `main.js|ts` Storybook config, "main config",
  `preview-head.html`, `preview-body.html`, `manager-head.html`, configuring
  Storybook, story loading globs, `stories: [{ directory, titlePrefix }]`,
  `addons.setConfig`, `addon-essentials` or essentials disabling,
  `staticDirs`, `refs` for composition, `webpackFinal`, `viteFinal`,
  Storybook env vars, `disableTelemetry`, `experimentalRSC`,
  `experimentalTestSyntax`, `developmentModeForBuild`, change detection,
  Storybook theme, sidebar configuration, single-story hoisting,
  `showRoots`, `renderLabel`, story sort, `storySort`, panel position,
  ESLint plugin Storybook, `plugin:storybook/recommended`, importing
  global CSS, Tailwind/Sass/Less in Storybook, fontsource in preview,
  preview iframe vs manager UI confusion.
---

# Storybook Configuration

Storybook's behavior is driven by three configuration files inside the
`.storybook/` directory (plus optional raw-HTML siblings). Each file
runs in a different context — getting code on the right side of the
manager/preview/Node boundary is the single biggest source of bugs in
configuring Storybook.

```
.storybook/
├── main.{js,ts}            ← runs in NODE (build server)
├── preview.{js,jsx,ts,tsx} ← runs in the BROWSER (preview iframe)
├── manager.{js,ts}         ← runs in the BROWSER (manager UI)
├── preview-head.html       ← raw <head> tags injected into preview iframe
├── preview-body.html       ← raw <body> tags injected into preview iframe
├── manager-head.html       ← raw <head> tags injected into manager UI
└── vitest.setup.ts         ← (optional) project annotations for Vitest addon
```

> Change the directory with `storybook dev|build -c .my-storybook` (or
> `--config-dir`). The Vitest addon picks it up automatically.

## `main.ts` — the project config

Runs in Node. Reads your `stories` globs, wires up the framework + addons,
and is the place to enable feature flags and customize the builder.

### ESM-only in Storybook 10

Since Storybook 10, **`main.{js,ts}` must be valid ESM**. No `require()`,
no `__dirname`, no `__filename`. Use `import` + `import.meta.url`. The
upgrade automigration rewrites most cases for you.

### Minimal config (CSF 3 style)

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
};
export default config;
```

### Minimal config (CSF Next factory style — preview)

```ts
// .storybook/main.ts
import { defineMain } from '@storybook/react-vite/node';

export default defineMain({
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
});
```

### Full field reference

| Field | Type | Notes |
| --- | --- | --- |
| `framework` (Required) | `FrameworkName \| { name: FrameworkName; options?: object }` | Framework package, e.g. `'@storybook/react-vite'`, `'@storybook/nextjs-vite'`. Sets builder + renderer for you. |
| `stories` (Required) | `(string \| StoriesSpecifier)[] \| async fn` | Where to find stories. See [Story loading](#story-loading-globs--specifiers). |
| `addons` | `string[] \| { name: string; options?: any }[]` | Each is the package name. Order matters for panel order. |
| `core` | object | See [`core`](#core). |
| `docs` | `{ defaultName?: string; docsMode?: boolean }` | Autodocs page name + docs-only mode. |
| `features` | object | See [Feature flags](#feature-flags). |
| `build` | `{ test?: TestBuildFlags }` | See [`build.test`](#buildtest---perf-optimized-builds). |
| `staticDirs` | `(string \| { from: string; to: string })[]` | Folders served as static files. |
| `refs` | `Record<string, Ref \| (config) => Ref \| { disable: true }>` | Storybook Composition. |
| `tags` | `Record<string, { defaultFilterSelection?: 'include' \| 'exclude' }>` | Customize tag filter defaults. |
| `typescript` | object | See [TypeScript](#typescript). |
| `babel` / `babelDefault` | `(config) => Promise<Config> \| Config` | Customize Babel for stories / for addons. |
| `swc` | `(config, options) => Config` | Customize SWC. |
| `viteFinal` | `(config, options) => Promise<InlineConfig>` | Mutate Vite config. See `storybook-builders`. |
| `webpackFinal` | `(config, options) => Promise<Config>` | Mutate Webpack config. See `storybook-builders`. |
| `env` | `(config) => Record<string, string>` | Inject env vars into the preview bundle. |
| `logLevel` | `'trace' \| 'debug' \| 'info' \| 'warn' \| 'error' \| 'silent'` | CLI log verbosity. |
| `managerHead` | `(head, options) => string` | Mutate the manager's `<head>` HTML. |
| `previewHead` | `(head, options) => string` | Mutate the preview iframe's `<head>` HTML. |
| `previewBody` | `(body, options) => string` | Mutate the preview iframe's `<body>` HTML. |
| `previewAnnotations` | `string[]` | Extra modules to evaluate in the preview, in addition to `.storybook/preview.{ts,tsx}`. |
| `indexers` (experimental) | `(existing) => Promise<Indexer[]>` | Custom file → story indexers. See [Custom indexers](#custom-indexers-experimental). |

### `core`

```ts
core: {
  builder: '@storybook/builder-vite',        // or '@storybook/builder-webpack5'
  disableTelemetry: true,
  enableCrashReports: false,
  disableWhatsNewNotifications: false,
  disableProjectJson: false,
  disableWebpackDefaults: false,
  crossOriginIsolated: false,                // enable COOP/COEP headers for SharedArrayBuffer
  allowedHosts: ['my.proxy.example'],         // for dev-server Host header validation
  channelOptions: {
    maxDepth: 3,                              // serialization depth for manager↔preview
    allowDate: true, allowRegExp: false, allowSymbol: false, allowUndefined: true,
  },
},
```

> When using the new framework packages (`@storybook/react-vite`,
> `@storybook/nextjs-vite`, …), prefer `framework.options.builder` over
> `core.builder` — the framework knows which builder it ships with.

### Feature flags

All default to `true` unless noted. Toggle to opt-out or to enable
experimental features.

```ts
features: {
  actions: true,           // built-in Actions addon
  backgrounds: true,       // built-in Backgrounds addon
  controls: true,          // built-in Controls addon
  highlight: true,         // built-in Highlight feature
  interactions: true,      // built-in Interactions panel
  measure: true,           // built-in Measure tool
  outline: true,           // built-in Outline tool
  toolbars: true,          // toolbar globals
  viewport: true,          // built-in Viewport addon
  sidebarOnboardingChecklist: true,
  changeDetection: true,                       // [Preview] git+builder change detection in sidebar
  argTypeTargetsV7: true,                       // [Experimental] filter args with `target` from render
  developmentModeForBuild: false,               // set NODE_ENV=development in built Storybook (fixes a11y false negatives w/ async React)
  legacyDecoratorFileOrder: false,              // apply preview.ts decorators BEFORE addon/framework decorators
  experimentalCodeExamples: false,              // [React only] new code-example renderer in autodocs
  experimentalTestSyntax: false,                // [React/Vue/Angular/Web Components] enable CSF Next .test method
  componentsManifest: false,                    // [React only] generate AI MCP manifest
  angularFilterNonInputControls: false,         // [Angular only]
},
```

### `build.test` — perf-optimized builds

Activated by `storybook build --test`. Strips heavy features so the
built Storybook starts faster (used for visual testing & test-runner
in CI):

```ts
build: {
  test: {
    disableBlocks: true,              // exclude addon-docs/blocks
    disabledAddons: ['@storybook/addon-coverage'],
    disableMDXEntries: true,          // exclude user MDX files
    disableAutoDocs: true,            // exclude autodocs pages
    disableDocgen: true,              // skip react-docgen / vue-docgen / compodoc
    disableSourcemaps: true,
    disableTreeShaking: true,
  },
},
```

You normally don't write this block manually — the `--test` flag enables
all of them. Override here only when you need to keep one feature on
during a perf build (e.g. keep `disableDocgen: false` because your
visual tests need the ArgTypes table to render).

### TypeScript

```ts
typescript: {
  // Common
  skipCompiler: false,         // skip TS compilation step (Webpack only)
  // Webpack-only
  check: false,                // enable fork-ts-checker-webpack-plugin
  checkOptions: {},            // its options
  // React-only
  reactDocgen: 'react-docgen', // or 'react-docgen-typescript' (slower, more accurate) or false
  reactDocgenTypescriptOptions: {
    tsconfigPath: './tsconfig.app.json',
    include: ['**/*.tsx', '../../packages/ui/src/**/*.tsx'],  // monorepo fix
    propFilter: (prop) => !prop.parent?.fileName?.includes('node_modules'),
  },
},
```

Use `react-docgen-typescript` when:
- you use TS enums and Storybook isn't picking them up
- you use `React.forwardRef` and props aren't inferred
- inherited props from other packages are missing (use `include`)

Trade-off: it spins up the TS compiler, which can add 5–30s to startup
on large projects.

### Custom indexers (experimental)

Indexers tell Storybook how to crawl files for stories. By default it
looks for `*.stories.@(js|jsx|mjs|ts|tsx)`. Add a custom indexer to
support other file formats:

```ts
// .storybook/main.ts
const config: StorybookConfig = {
  experimental_indexers: async (existing) => [
    {
      test: /\.url\.js$/,
      createIndex: async (fileName, { makeTitle }) => {
        const data = await import(fileName);
        return Object.keys(data)
          .filter((k) => k !== 'default')
          .map((name) => ({
            type: 'docs',
            exportName: name,
            importPath: fileName,
            title: makeTitle(name),
          }));
      },
    },
    ...existing,
  ],
};
```

The `importPath` must point at a CSF file at runtime, so you usually
pair an indexer with a builder plugin that transpiles your custom format
into CSF on the fly. See
`sources/storybook/docs/api/main-config/main-config-indexers.mdx` for
the full architecture diagram and Vite/Webpack plugin examples.

> Custom `importPath` (different from the indexed file) is **only
> supported in Vite-based projects**. Webpack indexers must leave
> `importPath` empty so the original file is used.

## Story loading: globs + specifiers

### Default glob

```ts
stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)']
```

### Array of globs (controls sidebar order)

```ts
stories: [
  '../src/intro.stories.mdx',
  '../src/components/**/*.stories.@(ts|tsx)',
  '../src/pages/**/*.stories.@(ts|tsx)',
]
```

### Configuration object

```ts
stories: [{
  directory: '../packages/components',
  files: '**/*.stories.@(ts|tsx)',       // default: '**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))'
  titlePrefix: 'Design System',           // auto-title prefix
}]
```

`files` is **relative to `directory`** and must not start with `./`.

### Custom logic function

```ts
stories: async (list) => [
  ...list,
  ...(await fg('packages/*/src/**/*.stories.{ts,tsx}')),
],
```

Note: custom functions de-optimize static analysis — only use when you
have a dynamic monorepo layout that globs can't express.

### Auto-title (CSF 3)

When a story file's meta has no `title`, Storybook derives one from the
file path:

- `components/Forms/Button.stories.tsx` → `Components/Forms/Button` (if
  the `stories` entry uses `directory: '../components'`).
- Redundant names collapse: `components/MyComponent/MyComponent.stories.tsx`
  → `Components/MyComponent` (not `Components/MyComponent/MyComponent`).
- `index.stories.ts` is dropped (same as the directory name).
- Casing is preserved (no `startCase`) since Storybook 6.5.

Restore the old startCase behavior in `.storybook/manager.ts`:

```ts
addons.setConfig({ sidebar: { renderLabel: (item) => _.startCase(item.name) } });
```

### Story Indexers

The default indexer matches `*.stories.@(js|jsx|mjs|ts|tsx)`. To support
extra naming conventions, use a custom indexer (see above).

## `preview.ts` — what runs in every story

Runs in the **preview iframe** (browser). Use it to:
- import global CSS / fonts / polyfills
- declare global decorators (theme providers, mock routers)
- set global parameters (controls config, docs theme, layout)
- declare `globalTypes` for toolbar items
- set `initialGlobals` defaults
- run lifecycle hooks (`beforeAll`, `beforeEach`, `afterEach`)
- (for CSF Next) use `definePreview({ addons: [...] })` to get
  type-safe addon parameter autocompletion

```ts
// .storybook/preview.tsx
import type { Preview } from '@storybook/react-vite';
import '../src/styles/globals.css';
import { ThemeProvider } from '../src/theme';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/ },
      sort: 'requiredFirst',
    },
    backgrounds: {
      options: {
        light: { name: 'Light', value: '#fff' },
        dark:  { name: 'Dark',  value: '#000' },
      },
    },
    docs: { toc: { title: 'On this page' } },
  },
  initialGlobals: {
    backgrounds: { value: 'light' },
    theme: 'light',
  },
  globalTypes: {
    theme: {
      description: 'Global theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, { globals: { theme } }) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
  loaders: [async () => ({ currentUser: { name: 'Storybook user' } })],
  beforeAll: async () => {
    // runs ONCE before any test
  },
  beforeEach: async () => {
    // runs before every story
  },
  afterEach: async ({ canvas }) => {
    // runs after every story + play
  },
  tags: ['autodocs'],   // apply to every story project-wide
};
export default preview;
```

### Initializing libraries in `preview.ts`

```ts
import { setupCharts } from 'my-charts-lib';
setupCharts({ apiKey: 'sb' });
```

### `preview-head.html` / `preview-body.html`

For things that must appear as raw HTML inside the preview iframe:
font links, analytics tags, CSS resets you can't import as JS.

```html
<!-- .storybook/preview-head.html -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
<style>body { font-family: Inter, system-ui, sans-serif; }</style>
```

```html
<!-- .storybook/preview-body.html -->
<div id="modal-root"></div>
<style>html { font-size: 14px; }</style>
```

> These files are injected into the **preview iframe**, not the manager.
> Storybook UI styling lives in `manager-head.html`.

### Programmatic head/body injection from `main.ts`

If you need to compute the head HTML dynamically (e.g., based on env):

```ts
previewHead: (head) => `${head}<meta name="version" content="${process.env.npm_package_version}" />`,
previewBody: (body) => `${body}<div id="portal-root"></div>`,
```

## `manager.ts` — the Storybook UI

Runs in the **manager** (the app surrounding the preview iframe). The
*only* mechanism is `addons.setConfig({...})`.

```ts
// .storybook/manager.ts
import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';
import { YourTheme } from './YourTheme';

addons.setConfig({
  // Layout
  navSize: 300,
  bottomPanelHeight: 200,
  rightPanelWidth: 320,
  panelPosition: 'right',          // 'bottom' | 'right'
  enableShortcuts: true,
  showToolbar: true,
  initialActive: 'sidebar',         // 'sidebar' | 'canvas' | 'addons' (mobile)
  selectedPanel: 'storybook/actions/panel',

  // Theme — see "Theming"
  theme: YourTheme || themes.dark,

  // Sidebar
  sidebar: {
    showRoots: true,
    collapsedRoots: ['misc'],
    renderLabel: (item, api) => item.name,
  },

  // Toolbar — id-based hiding
  toolbar: {
    fullscreen: { hidden: false },
    title: { hidden: false },
    zoom: { hidden: true },
  },

  // Layout customisations (functions get story context)
  layoutCustomisations: {
    showSidebar: ({ viewMode }, defaultValue) =>
      viewMode === 'docs' ? false : defaultValue,
    showPanel:   ({ storyId }, defaultValue) =>
      storyId === 'showcase--all' ? false : defaultValue,
    showToolbar: ({ viewMode }, defaultValue) =>
      viewMode === 'docs' ? false : defaultValue,
  },
});
```

`layoutCustomisations` functions receive `({ path, viewMode,
singleStory, storyId, index, layout: { isFullscreen, panelPosition,
showNav, showPanel, showToolbar } })` and the user's current default
value — return `true`/`false` or the default to keep user preference.

> **Warning**: hiding the sidebar removes Storybook's primary navigation
> — if you do this on a non-landing page, give users another way to
> reach other stories.

### URL parameter overrides

Users can override layout settings via query string:

| Setting | Query param | Values |
| --- | --- | --- |
| Shortcuts | `shortcuts` | `false` |
| Fullscreen | `full` | `true \| false` |
| Sidebar | `nav` | `true \| false` |
| Panel | `panel` | `false \| 'right' \| 'bottom'` |
| Selected panel | `addonPanel` | any panel ID |
| Tabs | `tabs` | `true` |
| Instrument hooks | `instrument` | `true \| false` |
| Statuses | `statuses` | semicolon-list of `new`/`modified`/`related` (prefix `!` to exclude) |

## Story rendering

The preview iframe is where your story actually mounts. Use these
patterns to customize what surrounds your component:

### Import global CSS / theme tokens

```ts
// .storybook/preview.ts
import '../src/styles/globals.css';
import '../src/styles/tokens.css';
```

These imports are HMR'd — edits reflect immediately without restarting.

### Provide context via decorators

```tsx
// .storybook/preview.tsx
const preview: Preview = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={lightTheme}>
          <Story />
        </ThemeProvider>
      </QueryClientProvider>
    ),
  ],
};
```

### Run framework-specific init

Vue:

```ts
// .storybook/preview.ts (Vue 3 + Vite)
import { setup } from '@storybook/vue3-vite';
import MyPlugin from 'my-plugin';

setup((app) => {
  app.use(MyPlugin);
  app.component('FontAwesomeIcon', FontAwesomeIcon);
});
```

Angular: import polyfills in your `polyfills.ts` (Angular's standard
location); they'll be picked up by the Angular builder.

## Story layout

The `layout` parameter controls how the canvas frames your component:

| Value | Behavior |
| --- | --- |
| `'padded'` *(default)* | Inset the story with padding. |
| `'centered'` | Center vertically + horizontally. |
| `'fullscreen'` | Stretch to the canvas edges (great for pages). |

```ts
// Project (preview.ts)
parameters: { layout: 'centered' }

// Component (meta)
const meta = { parameters: { layout: 'fullscreen' } };

// Story
export const HeroBanner: Story = { parameters: { layout: 'fullscreen' } };
```

## Styling and CSS

Storybook is intentionally CSS-agnostic; whatever your app does works.

### Importing bundled CSS (recommended)

```ts
// .storybook/preview.ts
import '../src/styles/globals.css';
import 'tailwindcss/tailwind.css';
```

HMR-friendly. Works with any framework.

### Including static CSS via `preview-head.html`

```html
<link rel="stylesheet" href="/static/external.css" />
```

NOT HMR-friendly (Storybook will need a restart to pick up changes to
the linked file).

### CSS Modules

- **Vite**: works out of the box (extends your `vite.config.ts` setting).
- **Webpack**: install `@storybook/addon-styling-webpack` to wire up
  `style-loader` + `css-loader` + `postcss-loader` correctly. Next.js
  framework handles CSS modules automatically (no addon needed).

### Sass / Less / Stylus

- **Vite**: native (just install `sass` / `less` / `stylus`).
- **Webpack**: install `@storybook/addon-styling-webpack`, which adds
  the appropriate loader.
- **Next.js (Webpack or Vite)**: native, reuses your `next.config.js`
  Sass config.

### PostCSS / Tailwind

- **Vite**: reads `postcss.config.{js,ts}` automatically.
- **Webpack**: use `@storybook/addon-styling-webpack`.
- **Next.js framework**: PostCSS / Tailwind config is auto-detected.
  Just import your Tailwind CSS in `preview.ts`.

### CSS-in-JS (styled-components, Emotion)

Usually works without config. For libraries that require a `ThemeProvider`
context, wrap stories with `@storybook/addon-themes`'s
`withThemeFromJSXProvider` decorator (see `storybook-essentials`).

### Webfonts

Two options:

1. Add `<link>` to `.storybook/preview-head.html` (won't HMR).
2. Use [`fontsource`](https://fontsource.org/) and import the CSS in
   `preview.ts`:

   ```ts
   import '@fontsource/inter/400.css';
   import '@fontsource/inter/700.css';
   ```

### Angular global styles

Angular doesn't use `preview.ts` for global CSS; it reads from
`angular.json`:

```jsonc
{
  "projects": {
    "your-project": {
      "architect": {
        "storybook":       { "options": { "styles": ["src/styles.scss"] } },
        "build-storybook": { "options": { "styles": ["src/styles.scss"] } },
      }
    }
  }
}
```

(Apply the change to **both** `storybook` and `build-storybook` targets.)

## Environment variables

Storybook only exposes vars starting with `STORYBOOK_`:

```bash
STORYBOOK_THEME=red STORYBOOK_DATA_KEY=12345 npm run storybook
```

Read them:
- **Vite**: `import.meta.env.STORYBOOK_DATA_KEY`
- **Webpack**: `process.env.STORYBOOK_DATA_KEY`
- **HTML**: `%STORYBOOK_THEME%` (string substitution in
  `preview-head.html` / `preview-body.html` / `manager-head.html`)

Or define them in `main.ts`:

```ts
env: (config) => ({ ...config, EXAMPLE_VAR: 'from-main-config' }),
```

### `.env` files

`.env`, `.env.development`, `.env.production` are all loaded
automatically. **Never store secrets** — they get baked into the
built JS.

### Non-`STORYBOOK_` prefixed vars

For Vite's `VITE_*` vars or other framework-prefixed vars, add to
`vite.config.ts`:

```ts
export default defineConfig({ envPrefix: ['VITE_', 'STORYBOOK_'] });
```

### Choose a browser to open

```bash
BROWSER=chromium npm run storybook    # or safari, firefox
```

### Disable telemetry

```bash
STORYBOOK_DISABLE_TELEMETRY=1 npm run storybook
# Or in main.ts:  core: { disableTelemetry: true }
```

## Sidebar and URLs

The sidebar is hierarchical: **Root → Folder → Component → Story/Docs**.
The hierarchy comes from the story's `title` (e.g., `'Components/Forms/Button'`).

### Customize the root display

```ts
// .storybook/manager.ts
addons.setConfig({ sidebar: { showRoots: false } });
```

### Permalinks (`id`)

Storybook generates story IDs like `components-button--primary`. To
preserve a URL through a rename, set `meta.id` and per-story IDs are
auto-derived.

### Sorting

```ts
// .storybook/preview.ts
parameters: {
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['Intro', 'Pages', ['Home', 'Login', '*'], 'Components', '*', 'WIP'],
    },
  },
},
```

`storySort` also accepts a function: `(a, b) => number`.

## UI features and behavior

### Adjusting addon-panel position

```ts
addons.setConfig({ panelPosition: 'right', rightPanelWidth: 320 });
```

### Hiding toolbar items

```ts
addons.setConfig({ toolbar: { zoom: { hidden: true } } });
```

Find the toolbar item ID by inspecting the rendered button's
`data-action` attribute or by looking at the addon's source.

### Conditional UI visibility

`layoutCustomisations` lets you hide parts of the UI based on context:

```ts
addons.setConfig({
  layoutCustomisations: {
    showSidebar: ({ storyId }, def) =>
      storyId === 'landing--page' ? false : def,
    showPanel: ({ viewMode }, def) =>
      viewMode === 'docs' ? false : def,
    showToolbar: ({ viewMode }, def) =>
      viewMode === 'docs' ? false : def,
  },
});
```

## Theming

Storybook UI is themed independently from your component preview.

### Built-in themes

```ts
// .storybook/manager.ts
import { themes } from 'storybook/theming';
addons.setConfig({ theme: themes.dark });
// 'light' | 'dark' | 'normal' (matches OS preference)
```

### Custom theme

```ts
// .storybook/YourTheme.ts
import { create } from 'storybook/theming';

export const YourTheme = create({
  base: 'light',                              // REQUIRED — extends light or dark
  brandTitle: 'My Design System',
  brandUrl: 'https://example.com',
  brandImage: 'https://example.com/logo.svg',
  brandTarget: '_self',                        // or '_blank'

  // Color palette (optional — many vars available)
  colorPrimary: '#FF4785',
  colorSecondary: '#1EA7FD',
  appBg: '#F6F9FC',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  textColor: '#10162F',
  fontBase: '"Inter", sans-serif',
});
```

```ts
// .storybook/manager.ts
import { addons } from 'storybook/manager-api';
import { YourTheme } from './YourTheme';
addons.setConfig({ theme: YourTheme });
```

### Theme the Docs UI separately

```ts
// .storybook/preview.ts
import { themes } from 'storybook/theming';
const preview: Preview = {
  parameters: {
    docs: { theme: themes.dark },
  },
};
```

The Docs theme defaults to `light` regardless of the manager theme — set
this explicitly to match.

### CSS escape hatches (advanced)

Storybook's UI elements have class names that you can target from
`.storybook/manager-head.html` (manager UI) or
`.storybook/preview-head.html` (docs). Fragile across releases — use
sparingly.

### MDX `components` override

In `preview.ts`, you can override how MDX elements render in docs:

```tsx
const preview = {
  parameters: {
    docs: {
      components: {
        code: ({ children }) => <MyCodeBlock>{children}</MyCodeBlock>,
        Canvas: MyCustomCanvas,
      },
    },
  },
};
```

> MDX 3 "sandboxes" components — passing `h1` replaces `# heading` but
> NOT raw `<h1>` tags. This is an MDX limitation, not Storybook's.

### Extended theme variables for addons

Some addons (notably `addon-actions` via `react-inspector`) accept
extra theme variables — set them on the same theme object:

```ts
addons.setConfig({
  theme: {
    ...YourTheme,
    appBorderRadius: 4,
    // react-inspector specific:
    BASE_FONT_FAMILY: 'Inter, sans-serif',
    BASE_FONT_SIZE: 12,
  },
});
```

## ESLint plugin

`eslint-plugin-storybook` catches common mistakes in story files and
`.storybook/main.{js,ts}`.

```bash
npm i -D eslint eslint-plugin-storybook
```

### Legacy `.eslintrc` config

```json
// .eslintrc
{ "extends": ["plugin:storybook/recommended"] }
```

Add to `.eslintignore` so the plugin still lints `.storybook/`:

```
!.storybook
```

### Flat config (ESLint 8.57+ / ESLint 9)

```js
// eslint.config.js
import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['!.storybook'], 'Include Storybook directory'),
  ...storybook.configs['flat/recommended'],
]);
```

### Available configs

`csf`, `csf-strict`, `addon-interactions`, `recommended` (and the
matching `flat/*` versions).

### Full rule table

| Rule | Description | In configs |
| --- | --- | --- |
| `storybook/await-interactions` | userEvent/expect must be awaited | recommended, addon-interactions |
| `storybook/context-in-play-function` | Pass context when invoking another story's play | recommended, addon-interactions |
| `storybook/csf-component` | Meta should set `component` | csf, csf-strict |
| `storybook/default-exports` | Story files must have a default export | csf, csf-strict, recommended |
| `storybook/hierarchy-separator` | Deprecated `|` separator in title | all |
| `storybook/meta-inline-properties` | Meta should only have inline properties | (none — opt-in) |
| `storybook/meta-satisfies-type` | Meta should use `satisfies Meta` | (opt-in, auto-fixable) |
| `storybook/no-redundant-story-name` | A story's `name` shouldn't match its export name | all |
| `storybook/no-renderer-packages` | Don't import renderer packages in stories | recommended |
| `storybook/no-stories-of` | `storiesOf` is removed | csf-strict |
| `storybook/no-title-property-in-meta` | Don't set `title` (use auto-titles) | csf-strict |
| `storybook/no-uninstalled-addons` | Detect typos in addon names | recommended |
| `storybook/prefer-pascal-case` | Story exports in PascalCase | recommended |
| `storybook/story-exports` | A story file must have at least one story | all |
| `storybook/use-storybook-expect` | Use `expect` from `storybook/test` | recommended, addon-interactions |
| `storybook/use-storybook-testing-library` | Don't import `@testing-library/*` in stories | recommended, addon-interactions |

### Storybook 9+ versions

| ESLint version | Plugin version |
| --- | --- |
| 9.x | `^9.0.0` or `^0.10.0` |
| 8.57+ | `^9.0.0` or `^0.10.0` |
| 7.x | `~0.9.0` |

> MDX files are **not** linted by this plugin.

## Composition — `refs`

Compose other published Storybooks into your local one:

```ts
// .storybook/main.ts
refs: {
  design: { title: 'Design System', url: 'https://design.example.com', expanded: false },
  legacy: { title: 'Legacy v6', url: 'https://legacy.example.com', expanded: false, sourceUrl: 'https://github.com/x/legacy' },
},
```

Function form (compose conditionally):

```ts
refs: (config) => {
  if (config.configType === 'DEVELOPMENT') {
    return { local: { title: 'Local', url: 'http://localhost:6007' } };
  }
  return { prod: { title: 'Prod', url: 'https://design.example.com' } };
},
```

Disable an automatically-composed package ref:

```ts
refs: { 'my-design-system': { disable: true } },
```

See `storybook-sharing` for the full Composition guide (publishing,
package composition, CPP levels).

## Static dirs

```ts
staticDirs: [
  '../public',
  { from: '../assets/fonts', to: '/fonts' },
]
```

Static files are copied/served at the root of the iframe URL by default,
or at `to` when using the object form. Combine with absolute imports in
your code:

```html
<img src="/logo.png" />
```

## Change detection (preview feature)

Storybook can highlight which stories are new/modified/related to your
current git diff. Requirements:

- Git repository
- Vite or Webpack5 builder
- `storybook dev` (does NOT work with `storybook build`)

Default is **on** (`features.changeDetection: true`). Status icons:

- ✦ Sparkle → **new** (untracked or new in git)
- ● Filled circle → **modified** (story file or direct import changed)
- (none) → **related** (transitive dependency changed)

The sidebar gets a **Review** button when modifications exist, which
toggles the new+modified filter.

Disable per project:

```ts
features: { changeDetection: false },
```

### Monorepo gotcha

Workspace siblings (`"workspace:*"` packages) may not be tracked because
their `exports` point to built `dist/` output that's `.gitignore`d. The
fix is to add `paths` mappings in the **root** `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": { "@myorg/*": ["./packages/@myorg/*/src"] }
  }
}
```

Per-package `tsconfig.json` files can block this if they don't extend
the root.

### Barrel-file behavior

Storybook does **barrel-aware named-import resolution**: `import { Button }
from '@myorg/ui'` traces through a barrel `index.ts` to find
`Button.tsx` and only marks stories that actually import `Button` as
related. Supported barrel patterns:

- `export { Button } from './Button'`
- `export * from './Button'`

Unsupported (falls back to tracking the barrel):
- `import { Button } from './Button'; export { Button }` (two-step)
- `export * as components from './components'` (namespace)

Workaround: import from the source path directly
(`import { Button } from '@myorg/ui/Button'`) when precision matters.

### Debugging

```bash
STORYBOOK_CHANGE_DETECTION_DEBUG=1 npm run storybook
# Writes storybook-graph-debug.json with all story↔file edges + barrel resolution
```

## Common pitfalls

1. **Imported CSS from `main.ts` doesn't apply.** `main.ts` runs in Node
   — its imports never reach the browser. Import CSS from `preview.ts`.
2. **`process.env.X` is undefined in a Vite-based Storybook.** Vite
   doesn't expose `process.env`. Use `import.meta.env.X` and make sure
   `X` starts with `STORYBOOK_`.
3. **`module.exports = ...` in `main.js` breaks under Storybook 10.**
   ESM required since v10. Replace with `export default ...` and run
   `storybook automigrate`.
4. **Custom theme reverts to default.** Ensure `base: 'light'` (or
   `'dark'`) is set in `create({...})` — it's required.
5. **Decorators run in unexpected order after upgrading.** Decorator
   order changed: by default addons/framework decorators run BEFORE
   preview.ts decorators since SB 7.6. Set
   `features.legacyDecoratorFileOrder: true` to opt back into the old
   behavior.
6. **`webpackFinal` isn't merging cleanly.** You're responsible for
   merging — Storybook does NOT auto-merge what you return.
   Spread the incoming `config.module.rules`, append new plugins (don't
   replace `config.plugins` because it contains `HtmlWebpackPlugin`).
7. **Story titles all start with "Src"** because your `stories` glob
   begins with `'../src/**'`. Use the object form with `titlePrefix`
   instead, or set explicit `title` on each meta.
8. **MDX docs render but Tailwind utilities are missing.** Tailwind has
   to be processed by PostCSS *in the preview iframe* — import your
   Tailwind CSS from `preview.ts`, not from a story file.
9. **The "What's new" notification keeps reappearing.** Set
   `core.disableWhatsNewNotifications: true`.
10. **Static `assets/` files 404 in the built Storybook.** Add to
    `staticDirs` AND use absolute paths (`/assets/logo.png`) in your
    components. Relative paths break when Storybook is published to a
    subpath like `https://example.com/storybook/`.

## See also

- `storybook-core` — install, CLI, version landscape
- `storybook-stories` — CSF schema, args/argTypes/parameters/decorators/loaders
- `storybook-essentials` — Actions, Backgrounds, Controls, Viewport, Themes, etc.
- `storybook-builders` — Vite vs Webpack config, `viteFinal`/`webpackFinal`, compilers
- `storybook-frameworks` — per-framework `main.ts` recipes
- `storybook-sharing` — `refs` composition, publishing, package composition
- `storybook-testing` — `addon-vitest` config, `parameters.test.*`
- `storybook-ai` — `addon-mcp` config, manifest curation via tags
