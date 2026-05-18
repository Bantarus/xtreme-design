---
name: storybook-addons
description: >
  Installing, configuring, and writing Storybook addons. Covers addon
  installation (`storybook add <name>` automatic vs manual editing of
  `.storybook/main.ts` `addons` array, removal via `storybook remove`),
  addon types (UI-based addons that contribute Panels / Toolbars / Tabs,
  Preset addons that modify the builder/Babel/Webpack config without
  exposing UI, official `@storybook/*` addons vs community `storybook-
  addon-*` packages in the integration catalog), the manager/preview
  split (manager renders the surrounding UI; preview is the iframe
  rendering stories; they communicate over a channel), the addon
  configuration mechanisms (presets for Node-level config,
  `parameters` for browser-level config, channel events for two-way
  manager↔preview communication), the full addons-api hook surface
  (`useStorybookApi`/`useStorybookState`/`useGlobals`/`useParameter`/
  `useChannel`/`useArgs`/`useAddonState`/`useArgs` from
  `storybook/manager-api` and `storybook/preview-api`), writing a UI
  addon end-to-end with the Addon Kit (clone the template, addon
  anatomy via `Tool.tsx`/`Panel.tsx`/`Tab.tsx`/`manager.ts`/`preview.ts`/
  `withGlobals.ts`, conditional rendering via the `match` function
  reading `tabId`/`viewMode`, `addons.register` /
  `addons.add('panel-id', { type: types.PANEL, render })`, building with
  `tsup` and the addon-kit's pre-configured config, styling addons —
  CSS-in-JS via `emotion` because Storybook uses it internally,
  injecting/removing stylesheets to/from the preview iframe), writing
  Presets (`babel`/`babelDefault`/`webpackFinal`/`viteFinal`/`managerEntries`/
  `previewAnnotations`/`previewHead`/`previewBody`/`managerHead`
  preset exports, local presets within a project, root presets for
  framework integration, `addons` array entry that points at a preset
  package), publishing to NPM (package.json `exports` / `bundler` /
  `storybook` metadata fields, `keywords: ['storybook-addon']` for
  catalog discoverability, `unsupportedFrameworks` to opt-out, GitHub
  Actions release workflow via `auto`, the published addon catalog),
  and the integration catalog (registration rules, addon tagging,
  ranking criteria). Use whenever the user mentions Storybook addon,
  `@storybook/addon-*`, installing a Storybook addon, removing an addon,
  writing an addon, the addon kit, addons-api, `useStorybookApi`,
  `useChannel`, `useGlobals` from manager-api, `useParameter`,
  `useAddonState`, manager UI customization, addon panel,
  toolbar addon, tab addon, preset addon, `addons.setConfig`,
  `addons.register`, `addons.add`, `babelDefault`, `previewAnnotations`,
  `managerEntries`, addon channel events, Storybook integration catalog,
  publishing an addon to NPM, `storybook-addon` keyword.
---

# Storybook Addons

Storybook is built on a small core and a large addon ecosystem. Most
features you use day-to-day — Controls, Docs, Actions, Backgrounds,
Themes, A11y, Vitest, Chromatic — are addons. The addon API lets you
extend Storybook in three ways:

1. **UI** — add Panels, Toolbar items, Tabs to the Storybook UI.
2. **Preview** — inject decorators or wrap stories.
3. **Build** — adjust the builder/Babel/Vite/Webpack config (Presets).

This skill covers using addons (install/configure/remove) and writing
your own (UI addons via the Addon Kit, plus Presets).

## Installing addons

### Automatic install

```bash
npx storybook add @storybook/addon-a11y
npx storybook add @chromatic-com/storybook
npx storybook add @storybook/addon-vitest
```

This installs the package, registers it in `.storybook/main.ts`'s
`addons` array, and runs any post-install configuration the addon
provides.

> Known limitation: only the first addon in a multi-addon command gets
> installed. Run one at a time.

### Manual install

```bash
npm i -D @storybook/addon-a11y
```

```ts
// .storybook/main.ts
const config: StorybookConfig = {
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-vitest',          // object form for per-addon options
      options: { /* ... */ },
    },
  ],
};
```

### Removing addons

```bash
npx storybook remove @storybook/addon-a11y
```

Or manually: remove from the `addons` array and `npm uninstall`.

## Addon categories

| Category | Examples | What it does |
| --- | --- | --- |
| **Core (essential)** | `addon-docs`, `addon-a11y`, `addon-vitest`, `@chromatic-com/storybook` | Built-in or first-party; maintained by the Storybook team |
| **Built-in features** | Actions, Backgrounds, Controls, Highlight, Measure, Outline, Toolbars/Globals, Viewport | Live inside the Storybook core; toggle via `features.<name>` (see `storybook-essentials`) |
| **Community** | `msw-storybook-addon`, `storybook-addon-pseudo-states`, `addon-designs`, `addon-themes`, hundreds more | Maintained by the community; browse the [integration catalog](https://storybook.js.org/integrations) |
| **Presets** | `@storybook/preset-create-react-app`, `@storybook/addon-webpack5-compiler-swc` | No UI — just bundler/Babel config |

## Addon anatomy

Every addon is an npm package. UI addons typically expose three entry
points:

```
my-addon/
├── package.json
├── src/
│   ├── manager.ts        ← registers UI elements (Panel/Toolbar/Tab)
│   ├── preview.ts        ← decorators, parameters, globals
│   ├── Tool.tsx          ← Toolbar component
│   ├── Panel.tsx         ← Panel component
│   ├── Tab.tsx           ← Tab component
│   └── preset.ts         ← (preset addons) build-level configuration
└── dist/                 ← built output (tsup)
```

The `package.json` `bundler` field tells the addon-kit what to compile:

```json
{
  "bundler": {
    "exportEntries": ["src/index.ts"],
    "managerEntries": ["src/manager.ts"],
    "previewEntries": ["src/preview.ts"]
  }
}
```

The Storybook core then loads the right bundle in the right context —
`manager.js` runs in the manager iframe, `preview.js` runs in the
preview iframe.

## The manager / preview split (essential mental model)

The Storybook UI is split into two browser frames:

```
┌────────────────────────────────────────────────────────┐
│ MANAGER (top-level iframe)                              │
│  - Sidebar, toolbar, addon panels                        │
│  - Code from `manager.{ts,tsx}` in addons runs HERE     │
│  - React 18+; uses Emotion for styling                   │
│  - Has access to `storybook/manager-api` and             │
│    `storybook/internal/components`                       │
└────────────────────────────────────────────────────────┘
                       ↕ channel
┌────────────────────────────────────────────────────────┐
│ PREVIEW (nested iframe)                                  │
│  - Renders stories                                       │
│  - Code from `preview.{ts,tsx}` in addons runs HERE     │
│  - Whatever React/Vue/Svelte/etc. version stories use   │
│  - Has access to `storybook/preview-api`                 │
└────────────────────────────────────────────────────────┘
```

Implications:
- **Story-side code** (decorators, parameters, loaders) → `preview.ts`.
- **UI components** (Panel, Tab, Toolbar item) → `manager.ts`.
- **Two-way communication** → channel events (`emit`/`on`).

> If you're writing a UI addon that should look like Storybook,
> your UI components must use **the same React version as Storybook
> ships with** (currently React 18 in the manager). Use the addon-kit
> to keep this straight automatically.

## Three configuration mechanisms

When designing an addon, choose how users should configure it:

### 1. Presets — Node-level (the build server)

For pre-configuring babel, webpack, vite, or registering managers/
preview annotations on behalf of the user. Defined in `preset.ts`:

```ts
// src/preset.ts
export const managerEntries = (entries = []) => [...entries, require.resolve('./manager')];
export const previewAnnotations = (annotations = []) => [...annotations, require.resolve('./preview')];

export const webpackFinal = async (config) => {
  // mutate config
  return config;
};

export const viteFinal = async (config) => {
  // mutate config
  return config;
};

export const babelDefault = async (config) => {
  // mutate Babel config used by Storybook (not user's app)
  return config;
};
```

Users register a preset just like any other addon:

```ts
addons: ['my-storybook-addon'],
// or with options:
addons: [{ name: 'my-storybook-addon', options: { color: 'red' } }],
```

Preset options are passed to every exported function as the second
argument.

### 2. Parameters — browser-level (per-story)

For toggling addon behavior per project/component/story. Defined under
your addon's namespace:

```ts
// In a story:
parameters: {
  'my-addon': { enabled: true, color: 'red' },
},
```

Read in the addon UI:

```tsx
import { useParameter } from 'storybook/manager-api';

const MyPanel = () => {
  const config = useParameter<{ enabled: boolean; color: string }>('my-addon', {});
  return <div style={{ color: config.color }}>{config.enabled ? '✓' : '✗'}</div>;
};
```

### 3. Channels — runtime events (two-way)

For pushing real-time data between manager and preview:

```ts
// In a decorator (preview):
import { useChannel } from 'storybook/preview-api';

const decorator = (Story, context) => {
  const emit = useChannel({});
  emit('MY_EVENT', { context: context.id, timestamp: Date.now() });
  return <Story />;
};
```

```tsx
// In the manager (Panel):
import { useChannel } from 'storybook/manager-api';

const MyPanel = () => {
  const [items, setItems] = useState([]);
  useChannel({
    MY_EVENT: (payload) => setItems((prev) => [...prev, payload]),
  });
  return <ul>{items.map(...)}</ul>;
};
```

## addons-api hooks reference

### From `storybook/manager-api`

| Hook | Purpose |
| --- | --- |
| `useStorybookApi()` | Access full Storybook API (selectStory, setQueryParams, etc.) |
| `useStorybookState()` | Subscribe to global Storybook state (current story, view mode, etc.) |
| `useGlobals()` | `[globals, updateGlobals]` — read/write toolbar globals |
| `useParameter(namespace, defaultValue?)` | Read the addon's `parameters.<namespace>` for the current story |
| `useChannel(eventMap)` | Subscribe to channel events; returns an `emit` function |
| `useAddonState(addonId, initialState?)` | Persistent state scoped to your addon (survives story changes) |
| `useArgs()` | `[args, updateArgs, resetArgs]` — read/write current story's args |

### From `storybook/preview-api`

| Hook | Purpose |
| --- | --- |
| `useArgs()` | Same shape as manager — for decorators |
| `useGlobals()` | Read globals from inside a decorator |
| `useParameter(namespace, defaultValue?)` | Read parameters from a decorator |
| `useChannel(eventMap)` | Subscribe to channel events from a decorator |
| `useState` / `useEffect` / `useRef` / `useMemo` / `useCallback` | Storybook hook equivalents — for use in render functions; don't mix with React's own hooks |
| `useEffect(fn, deps)` | Same as React |

### Other useful APIs

```ts
import { addons } from 'storybook/manager-api';
addons.setConfig({ /* manager UI config */ });        // theme, sidebar layout
addons.register('my-addon', (api) => {                 // register addon (manager.ts)
  addons.add('my-addon/panel', {
    type: types.PANEL,
    title: 'My Panel',
    render: ({ active }) => active ? <MyPanel /> : null,
  });
});
addons.getChannel();                                    // direct channel access
addons.add('my-addon/tool', {
  type: types.TOOL,
  title: 'My tool',
  match: ({ viewMode, tabId }) => viewMode === 'story' && !tabId,
  render: () => <MyToolbarItem />,
});
```

`types.PANEL`, `types.TOOL`, `types.TAB`, `types.PREVIEW`, `types.NOTES_ELEMENT`
(see [`storybook/manager-api`](https://github.com/storybookjs/storybook/blob/next/code/core/src/manager-api/index.ts)).

## Writing a UI addon — Tool (toolbar) example

The [Storybook Addon Kit](https://github.com/storybookjs/addon-kit) is
the recommended template. Click "Use this template" on GitHub, clone
the new repo, run `npm install`, answer the prompts, then
`npm run start` to launch a dev Storybook that loads your addon in
watch mode.

### Anatomy

| File | Purpose |
| --- | --- |
| `src/manager.ts` | Register the addon with `addons.register(...)` and `addons.add(...)` |
| `src/Tool.tsx` | React component for a toolbar item |
| `src/Panel.tsx` | React component for an addon panel |
| `src/Tab.tsx` | React component for an addon tab |
| `src/preview.ts` | Decorators / parameters / globals applied to every story |
| `src/withGlobals.ts` | Reusable decorator using `useGlobals()` |
| `src/preset.ts` | (Optional) preset exports — managerEntries, previewAnnotations, etc. |
| `tsup.config.ts` | Build config (manager + preview as separate bundles) |
| `package.json` | NPM metadata + `bundler` config + `storybook` catalog metadata |

### Build system: `tsup`

The Addon Kit ships with a pre-configured [tsup](https://tsup.egoist.dev/)
setup that produces three bundle outputs (one per runtime: Node preset,
manager browser, preview browser). Different runtimes need different
external dependencies — the addon-kit's tsup config handles this for
you. See `https://github.com/storybookjs/addon-kit/blob/main/tsup.config.ts`
for the full configuration.

### Example: a Toolbar addon

```tsx
// src/Tool.tsx
import { memo, useCallback, useEffect } from 'react';
import { useGlobals, useStorybookApi } from 'storybook/manager-api';
import { Button } from 'storybook/internal/components';
import { LightningIcon } from '@storybook/icons';
import { ADDON_ID, TOOL_ID, PARAM_KEY } from './constants';

export const Tool = memo(function MyAddonSelector() {
  const [globals, updateGlobals] = useGlobals();
  const api = useStorybookApi();

  const isActive = [true, 'true'].includes(globals[PARAM_KEY]);

  const toggleMyTool = useCallback(() => {
    updateGlobals({ [PARAM_KEY]: !isActive });
  }, [isActive, updateGlobals]);

  useEffect(() => {
    api.setAddonShortcut(ADDON_ID, {
      label: 'Toggle Addon [8]',
      defaultShortcut: ['8'],
      actionName: 'myaddon',
      showInMenu: false,
      action: toggleMyTool,
    });
  }, [toggleMyTool, api]);

  return (
    <Button
      padding="small"
      variant="ghost"
      key={TOOL_ID}
      active={isActive}
      ariaLabel="Enable my addon"
      onClick={toggleMyTool}
    >
      <LightningIcon />
    </Button>
  );
});
```

```ts
// src/manager.ts
import { addons, types } from 'storybook/manager-api';
import { ADDON_ID, TOOL_ID } from './constants';
import { Tool } from './Tool';

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'My addon',
    match: ({ viewMode, tabId }) => viewMode === 'story' && !tabId,
    render: () => <Tool />,
  });
});
```

```ts
// src/constants.ts
export const ADDON_ID = 'my-addon';
export const TOOL_ID = `${ADDON_ID}/tool`;
export const PARAM_KEY = `${ADDON_ID}/enabled`;
```

### `match` function — conditional rendering

Controls where the addon shows:

| `match` predicate | When the addon shows |
| --- | --- |
| `({ tabId }) => tabId === 'my-addon/tab'` | Only on a custom tab |
| `({ viewMode }) => viewMode === 'story'` | Only when viewing a story |
| `({ viewMode }) => viewMode === 'docs'` | Only when viewing docs |
| `({ tabId, viewMode }) => !tabId && viewMode === 'story'` | Only on the main story canvas |

### Styling addons — Emotion

Storybook's manager uses [Emotion](https://emotion.sh/) for CSS-in-JS.
Match it to feel native:

```tsx
import { styled } from 'storybook/theming';

const StyledPanel = styled.div`
  padding: 16px;
  font-family: ${({ theme }) => theme.typography.fonts.base};
`;
```

The `theme` object gives you access to all Storybook theme variables
(`color.primary`, `appBg`, `barBg`, `textColor`, etc. — see
`storybook-config` → "Theming").

### Decorators that inject styles into the preview iframe

For a Toolbar addon that visually affects the rendered story (e.g.,
adds an outline), the *style injection* happens in the preview iframe,
not the manager. Pattern:

```ts
// src/helpers.ts — runs in preview iframe
export function clearStyles(selector: string) {
  document.querySelector(selector)?.remove();
}

export function addOutlineStyles(rootSelector: string, css: string) {
  const id = `addon-outline-styles`;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('style');
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = `${rootSelector} ${css}`;
}
```

```tsx
// src/withGlobals.ts — preview decorator
import type { Renderer, PartialStoryFn as StoryFunction } from 'storybook/internal/types';
import { useEffect, useMemo, useGlobals } from 'storybook/preview-api';
import { addOutlineStyles, clearStyles } from './helpers';
import { PARAM_KEY } from './constants';

export const withGlobals = (StoryFn: StoryFunction<Renderer>, context: any) => {
  const [globals] = useGlobals();
  const isActive = [true, 'true'].includes(globals[PARAM_KEY]);

  // Pick the right root selector for docs vs story mode
  const rootSelector = useMemo(() => {
    if (context.viewMode === 'docs') {
      return `#story--${context.id} [data-story-id="${context.id}"]`;
    }
    return '#storybook-root';
  }, [context.id, context.viewMode]);

  useEffect(() => {
    if (isActive) {
      addOutlineStyles(rootSelector, `* { outline: 1px solid red !important; }`);
    } else {
      clearStyles('#addon-outline-styles');
    }
    return () => clearStyles('#addon-outline-styles');
  }, [isActive, rootSelector]);

  return StoryFn();
};
```

```ts
// src/preview.ts
import { withGlobals } from './withGlobals';
export const decorators = [withGlobals];
```

## Writing a Preset addon (no UI, just config)

Useful for:
- Wiring up a third-party loader (e.g., Markdown loader, CSS-modules support)
- Registering decorators on the user's behalf
- Adding Babel plugins
- Bundling several addon registrations together

```ts
// src/preset.ts
import { dirname, join } from 'node:path';

// Register addons that this preset depends on:
export const addons = [
  '@storybook/addon-docs',
];

// Add Webpack rules / Vite plugins:
export const webpackFinal = async (config: any) => {
  config.module?.rules?.push({
    test: /\.md$/,
    use: ['raw-loader'],
  });
  return config;
};

export const viteFinal = async (config: any) => ({
  ...config,
  optimizeDeps: { ...config.optimizeDeps, include: [...(config.optimizeDeps?.include ?? []), 'lodash'] },
});

// Add a manager script:
export const managerEntries = (entries: string[] = []) => [
  ...entries,
  join(dirname(require.resolve('my-addon/package.json')), 'dist/manager.js'),
];

// Add preview annotations (decorators, parameters, etc.):
export const previewAnnotations = (entries: string[] = []) => [
  ...entries,
  join(dirname(require.resolve('my-addon/package.json')), 'dist/preview.js'),
];
```

The user just adds the package name to `addons` and gets everything:

```ts
addons: ['my-addon'],
```

### Local presets (inside a project)

A preset doesn't have to live in an npm package. Drop a file in
`.storybook/`:

```ts
// .storybook/my-preset.ts
export const webpackFinal = async (config) => config;
```

```ts
// .storybook/main.ts
addons: ['./my-preset'],
```

## Packaging and publishing

### Required `package.json` fields

```json
{
  "name": "my-storybook-addon",
  "version": "1.0.0",
  "description": "My first storybook addon",
  "author": "Your Name",
  "keywords": ["storybook-addon", "appearance", "style", "css", "layout", "debug"],

  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "node": "./dist/index.js",
      "require": "./dist/index.js",
      "import": "./dist/index.mjs"
    },
    "./manager": "./dist/manager.mjs",
    "./preview": "./dist/preview.mjs",
    "./package.json": "./package.json"
  },
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": ["dist/**/*", "README.md", "*.js", "*.d.ts"],

  "devDependencies": {
    "@storybook/addon-docs": "^10.0.0",
    "storybook": "^10.0.0"
  },

  "bundler": {
    "exportEntries": ["src/index.ts"],
    "managerEntries": ["src/manager.ts"],
    "previewEntries": ["src/preview.ts"]
  },

  "storybook": {
    "displayName": "My Storybook Addon",
    "unsupportedFrameworks": ["react-native"],
    "icon": "https://yoursite.com/icon.png"
  }
}
```

| Field | Purpose |
| --- | --- |
| `exports` | Entry points (Node + manager + preview). |
| `bundler` | Used by the Addon Kit's tsup config to know which entries to bundle. |
| `storybook.displayName` | Name shown in the integration catalog. |
| `storybook.icon` | Icon shown in the catalog. |
| `storybook.unsupportedFrameworks` | Mark frameworks where the addon won't work (catalog uses this for filtering). |
| `keywords: ['storybook-addon']` | **Required for catalog discoverability.** |

### Publishing via `auto`

The Addon Kit pre-installs [`auto`](https://github.com/intuit/auto):

```bash
# Generate GitHub labels (one-time):
npx auto create-labels

# Create a release:
npm run release
```

You need:
- An NPM access token with publish permissions (`NPM_TOKEN`)
- A GitHub personal access token with `repo` + `workflow` scopes (`GH_TOKEN`)
- A `.env` file (or CI secrets) with both

### CI automation

The Addon Kit ships a GitHub Actions workflow. Set `NPM_TOKEN` as a
repository secret. Merges to the default branch then auto-publish a
new release with an updated changelog.

## The integration catalog

Browse addons at https://storybook.js.org/addons. To get listed:

1. Publish to NPM with `keywords: ['storybook-addon']`.
2. (Recommended) Add `storybook.displayName`, `storybook.icon`,
   `storybook.unsupportedFrameworks`.
3. Wait for the catalog crawler to pick it up (a few hours).

## Common pitfalls

1. **`addons.register` runs but my Panel never appears.** Check that
   you're rendering in `manager.ts` (not `preview.ts`). UI registration
   only works in the manager runtime.
2. **`useGlobals()` returns stale values.** Make sure you imported from
   `storybook/manager-api` in the manager and `storybook/preview-api`
   in the preview. The two are different.
3. **Styles look out of place.** Use `styled` from `storybook/theming`
   and reference `theme` values. Hardcoded CSS won't follow Storybook's
   dark/light mode.
4. **My addon breaks Storybook on a different framework.** Test against
   the frameworks you support. Set `storybook.unsupportedFrameworks` in
   `package.json` to opt-out catalog matching.
5. **`emit(EVENT)` from preview doesn't reach manager.** Check that you
   used `useChannel({})` (returns `emit`) in the preview, not just
   `useChannel({ EVENT: handler })` (which only subscribes).
6. **My addon's `parameters` don't merge.** Pass an object (not an
   array) — Storybook deep-merges objects, but arrays are replaced.
7. **The "What's new" notification appears when my preset is registered.**
   This is Storybook's, not your addon's. Disable globally with
   `core.disableWhatsNewNotifications: true`.
8. **My addon's tsup build emits broken imports.** Don't customize
   `tsup.config.ts` beyond what the Addon Kit ships unless you know
   exactly what you're doing — the manager/preview/node split is
   delicate.

## Common community addons worth knowing

| Addon | Purpose |
| --- | --- |
| `@storybook/addon-docs` | Autodocs + MDX (essential) |
| `@storybook/addon-a11y` | Accessibility tests via axe-core |
| `@storybook/addon-vitest` | Storybook Test (Vitest browser mode) |
| `@chromatic-com/storybook` | Visual Tests via Chromatic |
| `@storybook/addon-themes` | Theme switcher with three patterns |
| `@storybook/addon-coverage` | Code coverage (test-runner only) |
| `@storybook/addon-styling-webpack` | Webpack loaders for CSS modules, Sass, PostCSS |
| `@storybook/addon-webpack5-compiler-swc` | Switch Webpack compiler from Babel to SWC |
| `@storybook/addon-webpack5-compiler-babel` | Babel compiler for Webpack |
| `@storybook/addon-svelte-csf` | Native Svelte story format |
| `@storybook/addon-mcp` | AI MCP server (React only) |
| `@storybook/preset-create-react-app` | CRA integration |
| `msw-storybook-addon` | MSW network mocking |
| `storybook-addon-pseudo-states` | CSS `:hover` / `:focus` / `:active` toggles |
| `addon-designs` (community) | Embed Figma in addon panel |
| `storybook-addon-vis` (community) | Local visual snapshot testing |

## See also

- `storybook-core` — install, CLI
- `storybook-config` — `addons` array, addon options, `addons.setConfig`
- `storybook-essentials` — built-in addon-like features
- `storybook-builders` — Vite/Webpack `presetFinal` hooks
- `storybook-testing` — `@storybook/addon-vitest`, `@chromatic-com/storybook`, `@storybook/addon-a11y`
- `storybook-frameworks` — framework-specific addons (compodoc, vue-component-meta, RN addons)
- `storybook-ai` — `@storybook/addon-mcp`
