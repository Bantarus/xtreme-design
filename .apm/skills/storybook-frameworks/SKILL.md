---
name: storybook-frameworks
description: >
  Per-framework Storybook setup — the framework package wires together a
  renderer (React, Vue, Angular, Svelte, Web Components, Preact, Solid,
  Qwik, Ember, HTML, React Native, Lit) with a builder (Vite or Webpack 5)
  and applies any framework-specific transformations (Next.js image
  optimization, Angular Compodoc integration, Vue SFC parsing, Svelte CSF,
  TanStack Router context). Covers framework package selection
  (`@storybook/react-vite`, `@storybook/react-webpack5`,
  `@storybook/nextjs-vite` recommended over `@storybook/nextjs`,
  `@storybook/vue3-vite`, `@storybook/angular`, `@storybook/svelte-vite`,
  `@storybook/sveltekit`, `@storybook/web-components-vite`,
  `@storybook/preact-vite`, `@storybook/react-native-web-vite`,
  `@storybook/tanstack-react`, `@storybook/html-vite`, `@storybook/ember`,
  community `@storybook/qwik` / `@storybook/solid`), CLI auto-detection
  via `npm create storybook@latest` and the manual `--type` fallback,
  per-framework requirements (React 16.8+, Vue 3+, Angular 18+, Next.js
  14.1+, Svelte 5+, SvelteKit 1+, Preact 8+/10+, RN 0.72+ + RNW 0.19+,
  Lit 3+), framework-specific `framework.options` (Next.js `nextConfigPath`/
  `image`/`builder`, React `strictMode`/`legacyRootApi`, Angular
  `enableIvy`/`enableNgcc`, Vue `docgen: 'vue-component-meta' |
  'vue-docgen-api' | false`, Svelte `docgen: boolean`, RN Web
  `modulesToTranspile`/`pluginReactOptions` with
  `jsxRuntime`/`jsxImportSource`/`babel.plugins`), the framework-feature-
  support matrix (which essentials/addons/docs blocks work for each core
  vs community framework — react/vue/angular/web-components are tier 1;
  ember/html/svelte/preact/qwik/solid are tier 2 with some gaps especially
  around Interactions for Ember), and routes to per-framework reference
  files that cover the deeper specifics. Use whenever the user mentions a
  specific framework + Storybook combination (Next.js Storybook, Vue 3
  Storybook, Angular Storybook, SvelteKit Storybook, etc.), framework
  selection or migration, `framework: '@storybook/...'`, `next/image` in
  Storybook, `next/router` / `next/navigation` mocks, Compodoc setup,
  `vue-component-meta`, Svelte CSF (`addon-svelte-csf`, `defineMeta`,
  Svelte 4 → 5 migration), `applicationConfig` / `moduleMetadata`
  decorators, Lit elements, `custom-elements.json`, TanStack Router
  stories, `parameters.tanstack.router`, React Native vs React Native
  Web vs both, `sveltekit_experimental.{forms,navigation,hrefs,stores,
  state}` mocks, framework feature support matrix. For framework deep-
  dives (full mock APIs, all parameters, every option), see the
  `references/` files in this skill.
---

# Storybook Frameworks

A **framework** in Storybook is an opinionated bundle of a **renderer**
(the code that turns a story object into DOM — different per UI library)
plus a **builder** (Vite or Webpack 5) plus the glue between them
(provider mocks, asset handlers, docgen tools). When you install
Storybook, the CLI picks a framework package for you based on what's in
your `package.json`.

This skill is the index and quick-reference. For each framework, a
companion `references/<framework>.md` file inside this skill directory
contains the full guide (mock APIs, every parameter, options object,
migration steps, framework-specific gotchas).

## The framework table

| Framework package | Renderer | Builder | When |
| --- | --- | --- | --- |
| `@storybook/react-vite` | React 16.8+ | Vite | New React projects. Default for Vite-based React apps. |
| `@storybook/react-webpack5` | React 16.8+ | Webpack 5 | Only if you have custom Webpack config Vite can't handle. CRA support via `@storybook/preset-create-react-app`. |
| `@storybook/nextjs-vite` ⭐ | Next.js 14.1+ | Vite (via `vite-plugin-storybook-nextjs`) | **Recommended for new Next.js projects.** Required for the Vitest addon. |
| `@storybook/nextjs` | Next.js 14.1+ | Webpack 5 | Existing Next.js projects with custom Webpack/Babel that can't migrate. |
| `@storybook/vue3-vite` | Vue 3+ | Vite | All Vue 3 projects. |
| `@storybook/angular` | Angular 18–21 | Webpack 5 (via Angular CLI builder) | All Angular projects. Run via `ng run <project>:storybook`. |
| `@storybook/svelte-vite` | Svelte 5+ | Vite | Plain Svelte (non-SvelteKit). |
| `@storybook/sveltekit` | SvelteKit 1+ | Vite | SvelteKit projects (uses SvelteKit's own Vite). |
| `@storybook/web-components-vite` | Lit 3+ / any Web Components | Vite | Lit, vanilla custom elements, FAST, Stencil-output. |
| `@storybook/preact-vite` | Preact 8.x / 10.x | Vite | Preact projects. |
| `@storybook/react-native-web-vite` | React Native 0.72+ on Web via `react-native-web` 0.19+ | Vite | RN component dev in a browser. Pair with `@storybook/react-native` for on-device. |
| `@storybook/react-native` | React Native 0.72+ | Metro | On-device, in-simulator/emulator story browsing. Native fidelity, limited features. |
| `@storybook/tanstack-react` | React 18+ | Vite 7+ | TanStack Router/Start applications — auto-provides router context, mocks `@tanstack/react-router`. |
| `@storybook/html-vite` | none (raw HTML/JS) | Vite | Vanilla JS/HTML component dev, design-system style guides. |
| `@storybook/ember` | Ember 4+ (via ember-cli-storybook) | Webpack 5 | Ember projects. |
| Community: `@storybook/qwik`, `@storybook/solid` (Solid Vite via `storybook-solidjs-vite`) | Qwik, SolidJS | various | Community-maintained. May lag behind core frameworks. |

> Lit is grouped under Web Components — there's no `@storybook/lit-vite`;
> use `@storybook/web-components-vite`.

## Installation

Standard install detects and picks the framework for you:

```bash
npm create storybook@latest
```

Force a specific framework when auto-detection fails or you want
something other than the default:

```bash
npm create storybook@latest -- --type react_vite
npm create storybook@latest -- --type nextjs_vite
npm create storybook@latest -- --type vue3
npm create storybook@latest -- --type angular
npm create storybook@latest -- --type svelte_vite
npm create storybook@latest -- --type sveltekit
npm create storybook@latest -- --type web_components
npm create storybook@latest -- --type preact
npm create storybook@latest -- --type html
npm create storybook@latest -- --type ember
npm create storybook@latest -- --type react_native_web
npm create storybook@latest -- --type react_native
npm create storybook@latest -- --type react_native_and_rnw   # install both
```

For new RN projects, the "Both" choice is the easiest way to get a
combined RN + RNW setup (separate `.storybook/` configs for each).

## The framework declaration in `main.ts`

```ts
// .storybook/main.ts
const config: StorybookConfig = {
  framework: '@storybook/react-vite',                    // simplest form
  // OR with options:
  framework: { name: '@storybook/nextjs-vite', options: { nextConfigPath: '../next.config.js' } },
};
```

Every framework also accepts:

```ts
framework: {
  name: '@storybook/react-webpack5',
  options: {
    builder: { lazyCompilation: true, fsCache: true },   // builder-specific options
  },
},
```

See `storybook-builders` for the Vite vs Webpack 5 builder reference and
[Builder API](./../../storybook-builders/SKILL.md#the-builder-api).

## Framework feature support — what works where

Three tiers of support:

| Feature | React | Vue 3 | Angular | Web Components | Ember | HTML | Svelte | Preact | Qwik | Solid |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Actions | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Backgrounds | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Controls | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Interactions | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Measure / Outline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Viewport | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| A11y | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Docs (Autodocs + blocks) | ✅ | ✅ | ✅ | ✅ | partial | ✅ | ✅ | ✅ | ✅ | ✅ |
| Test runner | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Vitest addon | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Test coverage | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Visual tests (Chromatic) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CSF Next | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Inline doc stories | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| AI manifest + MCP | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Agentic setup (`storybook ai setup`) | ✅ (Vite only) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

Source: `sources/storybook/docs/configure/integration/frameworks-feature-support.mdx`

> Deprecated frameworks (no longer maintained): **Aurelia**, **Marionette**,
> **Mithril**, **Rax**, **Riot**. See
> [Storybook End-of-Life repository](https://github.com/storybook-eol).

## Per-framework deep dives

Each framework has its own reference file in this skill's `references/`
directory with the **full** setup, options, mocking APIs, and
gotchas. Open the file matching what you're working on:

| Framework | Reference file |
| --- | --- |
| React (Vite or Webpack5) | `references/react.md` |
| Next.js (Vite or Webpack) | `references/nextjs.md` |
| Vue 3 (Vite) | `references/vue.md` |
| Angular | `references/angular.md` |
| Svelte (Vite) | `references/svelte.md` |
| SvelteKit | `references/sveltekit.md` |
| Web Components (Vite) | `references/web-components.md` |
| Preact (Vite) | `references/preact.md` |
| React Native + React Native Web | `references/react-native.md` |
| TanStack React (Router / Start) | `references/tanstack-react.md` |

Below are quick orientations for each. Open the reference file for
the full deep dive.

### React (Vite or Webpack 5)

```ts
framework: '@storybook/react-vite'        // recommended
framework: '@storybook/react-webpack5'    // legacy / specific Webpack needs
```

- `react-vite` options: `{ builder?: ViteBuilderOptions }` — that's it.
- `react-webpack5` options: same. CRA users: SCSS/TS work via
  `@storybook/preset-create-react-app` (auto-installed).
- Either picks `react-docgen` (fast) by default for argTypes. Switch to
  `react-docgen-typescript` via `typescript.reactDocgen` when you use TS
  enums, `forwardRef`, or workspace-package inheritance.

See `references/react.md` for the full guide.

### Next.js — `nextjs-vite` (recommended) vs `nextjs`

```ts
framework: '@storybook/nextjs-vite'    // recommended for all new Next.js projects
framework: '@storybook/nextjs'         // only if you have incompatible Webpack/Babel
```

Both auto-handle:
- `next/image` (local + remote, auto width/height)
- `next/font/google` and `next/font/local` (custom fonts)
- `next/head`
- `next/router` mocking (with `useRouter`, navigation logged as Actions)
- `next/navigation` mocking (with `useRouter`, `useSelectedLayoutSegment`,
  `useParams`, etc. — set `nextjs.appDirectory: true`)
- Sass/Less, CSS Modules, styled-jsx, Tailwind (Next.js's PostCSS)
- Absolute imports + module aliases (`@/components/*`)
- React Server Components (experimental, behind `features.experimentalRSC`)

Built-in mock modules:
- `@storybook/nextjs-vite/cache.mock` / `@storybook/nextjs/cache.mock`
- `@storybook/nextjs-vite/headers.mock` (writable `cookies()` / `headers()` / `draftMode()`)
- `@storybook/nextjs-vite/navigation.mock` (mocked router + `getRouter()`)
- `@storybook/nextjs-vite/router.mock`

See `references/nextjs.md` for the full guide (mock API examples,
RSC setup, font-mocking in CI, sharp install for image optimization).

### Vue 3 (Vite)

```ts
framework: '@storybook/vue3-vite'
```

Wire up custom directives / plugins / mixins via the framework's
`setup` function:

```ts
// .storybook/preview.ts
import { setup } from '@storybook/vue3-vite';
setup((app) => {
  app.use(MyPlugin);
  app.component('FontAwesomeIcon', FontAwesomeIcon);
});
```

Options:

```ts
framework: {
  name: '@storybook/vue3-vite',
  options: {
    docgen: 'vue-component-meta',     // 'vue-docgen-api' (default) | 'vue-component-meta' | false
    // For projects with multiple tsconfigs (vue-tsc style):
    docgen: { plugin: 'vue-component-meta', tsconfig: 'tsconfig.app.json' },
  },
},
```

`vue-component-meta` is more powerful than the default
`vue-docgen-api` — it understands SFC + script-setup props with JSDoc,
emitted events typed via `defineEmits<{}>()`, typed `defineSlots<{}>()`,
and `defineExpose()` properties. The trade-off is slower build time on
large projects.

Vue 2 is **end-of-life** — Storybook 8+ no longer supports it. Stuck on
Vue 2? Pin to `storybook@7`.

See `references/vue.md` for the full guide.

### Angular

```ts
framework: '@storybook/angular'
```

**Run via Angular CLI**, not the standalone `storybook` command:

```bash
ng run my-app:storybook
ng run my-app:build-storybook
```

This requires builder config in `angular.json`:

```jsonc
{
  "projects": {
    "my-app": {
      "architect": {
        "storybook":       { "builder": "@storybook/angular:start-storybook", "options": { "configDir": ".storybook", "browserTarget": "my-app:build", "port": 6006, "compodoc": true, "compodocArgs": ["-e", "json", "-d", "."] } },
        "build-storybook": { "builder": "@storybook/angular:build-storybook", "options": { "configDir": ".storybook", "browserTarget": "my-app:build", "outputDir": "dist/storybook/my-app", "compodoc": true, "compodocArgs": ["-e", "json", "-d", "."] } }
      }
    }
  }
}
```

**Compodoc** is how Angular components get docgen for the Controls panel
— install it, enable it in the builder, and import the generated
`documentation.json` from your preview:

```ts
// .storybook/preview.ts
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
setCompodocJson(docJson);
```

Angular-specific decorators:
- `applicationConfig` — provides application-level providers
  (`BrowserAnimationsModule`, etc.) via `bootstrapApplication`.
- `moduleMetadata` — provides ngModules, declarations, providers per
  story or component.

```ts
import { Meta, moduleMetadata } from '@storybook/angular';

const meta: Meta<YourComponent> = {
  component: YourComponent,
  decorators: [moduleMetadata({
    imports: [SomeModule],
    declarations: [SubComponent],
    providers: [{ provide: SomeService, useValue: mockSvc }],
  })],
};
```

Builder options are extensive (`browserTarget`, `tsConfig`, `port`,
`host`, `https`, `compodoc`/`compodocArgs`, `styles`,
`stylePreprocessorOptions`, `assets`, `enableProdMode`,
`experimentalZoneless`, etc.). See `references/angular.md`.

### Svelte (Vite)

```ts
framework: '@storybook/svelte-vite'   // plain Svelte projects
framework: '@storybook/sveltekit'     // SvelteKit projects (uses SvelteKit's Vite)
```

The community-maintained **Svelte CSF addon**
(`@storybook/addon-svelte-csf`) lets you write stories with Svelte
template syntax instead of plain CSF. Auto-installed when you initialize
Storybook in a Svelte project (since SB 8.2). Adds:

```svelte
<!-- Button.stories.svelte -->
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';
  const { Story } = defineMeta({ component: Button });
</script>

<Story name="Primary" args={{ label: 'Click', primary: true }} />
<Story name="With children">Click me</Story>
```

Framework options:

```ts
framework: { name: '@storybook/svelte-vite', options: { docgen: true } },
```

Svelte CSF addon options:

```ts
addons: [{ name: '@storybook/addon-svelte-csf', options: { legacyTemplate: false } }],
```

`legacyTemplate: true` re-enables the `<Template>` component from
Svelte CSF v4 (deprecated; has perf overhead).

### SvelteKit

Same `addon-svelte-csf` story format as Svelte Vite, plus mocks for
SvelteKit-specific modules:

```ts
parameters: {
  sveltekit_experimental: {
    forms:      { enhance: () => { /* ... */ } },
    navigation: { goto: () => {}, pushState: () => {}, replaceState: () => {}, invalidate: () => {}, invalidateAll: () => {}, afterNavigate: { /* ... */ } },
    hrefs:      { '/login': (to, ev) => {/* ... */}, '\\/api/.*': { callback: (to) => {}, asRegex: true } },
    stores:     { page: { url: new URL('https://example.com/') }, navigating: { from: null, to: null }, updated: false },
    state:      { page: {/* ... */}, navigating: {/* ... */}, updated: { current: false } },
  },
},
```

Supported `$app/*` modules: `$app/paths` (full), `$app/environment`,
`$app/forms` (exp.), `$app/navigation` (exp.), `$app/state` (exp.,
SvelteKit 2.12+), `$app/stores` (exp.).

Not supported: `$env/dynamic/private`, `$env/static/private`,
`$service-worker` (server-side / Service Worker only).

See `references/sveltekit.md` for the full mock API reference.

### Web Components (Vite)

```ts
framework: '@storybook/web-components-vite'
```

Works with any custom-element library (Lit, FAST, Stencil's web-components
output, vanilla). For argType inference, generate a `custom-elements.json`
manifest:

```bash
npm i -D @custom-elements-manifest/analyzer
npx custom-elements-manifest analyze
```

Then in `preview.ts`:

```ts
import { setCustomElementsManifest } from '@storybook/web-components-vite';
import customElements from '../custom-elements.json';
setCustomElementsManifest(customElements);
```

For shadow-DOM queries in play functions, install
`shadow-dom-testing-library` and register its queries:

```ts
// .storybook/preview.ts
import * as shadowQueries from 'shadow-dom-testing-library';
import { configureTestingLibrary } from '@storybook/web-components-vite';
configureTestingLibrary({ queries: shadowQueries });
```

Then in stories:

```ts
play: async ({ canvas }) => {
  await canvas.findByShadowRole('button', { name: 'Submit' });
},
```

CSF Next is supported — register your element in `HTMLElementTagNameMap`
for type inference (see `storybook-stories` → "Web Components specifics").

### Preact (Vite)

```ts
framework: '@storybook/preact-vite'
```

Minimal config. Preact 8 and 10 both supported (the framework auto-targets
your version). No special options beyond the `builder` pass-through.

### React Native + React Native Web

Two complementary frameworks for RN component dev:

| Framework | Where | Pros | Cons |
| --- | --- | --- | --- |
| `@storybook/react-native` | On-device (simulator / Expo Go / Detox) | Full native fidelity, native modules work | Limited features — no addons, no docs, no a11y, no MCP |
| `@storybook/react-native-web-vite` | In browser via `react-native-web` | All Storybook features (docs, a11y, test, Chromatic, MCP) | Only works for components that `react-native-web` can render |

Most teams choose **both**. The CLI's "Both" install option scaffolds
parallel `.storybook/` configs.

`react-native-web-vite` options:

```ts
framework: {
  name: '@storybook/react-native-web-vite',
  options: {
    modulesToTranspile: ['my-rn-library'],   // libs that aren't web-transpiled
    pluginReactOptions: {
      jsxRuntime: 'automatic',
      jsxImportSource: 'nativewind',          // for NativeWind users
      babel: {
        plugins: ['@babel/plugin-proposal-export-namespace-from', 'react-native-reanimated/plugin'],
      },
    },
  },
},
```

See `references/react-native.md` for the full setup (Reanimated,
NativeWind, on-device Metro config).

### TanStack React (Router / Start)

```ts
framework: '@storybook/tanstack-react'
```

Builds on `react-vite`. Automatically:
- Wraps every story in a **memory-backed TanStack Router** so `useNavigate`,
  `useSearch`, `useParams`, etc. work.
- Mocks `@tanstack/react-router` (navigation attempts logged as Actions).
- Mocks TanStack Start server functions
  (`createServerFn().handler(...)` becomes a Vitest mock).

Render a route as the story component:

```ts
parameters: {
  tanstack: {
    router: {
      route: ProfileRoute,        // a TanStack route
      path: '/profile/123',
      params: { id: '123' },
      query: { tab: 'overview' },
      routeOverrides: {
        '__root__': { loader: () => ({ user: { name: 'Test' } }) },
        '/profile/$id': { beforeLoad: () => ({ authorized: true }) },
      },
    },
  },
},
```

Mocking server functions per story:

```ts
import { getUserData } from '~/server-fns';
import { mocked } from 'storybook/test';

export const Success: Story = {
  beforeEach: async () => {
    mocked(getUserData).mockResolvedValue({ name: 'Jane' });
  },
};
```

For **server-only modules** that crash the browser (e.g. `~/db/client`
importing `postgres`), create a `__mocks__/` file and register it:

```ts
// .storybook/preview.ts
import { sb } from 'storybook/test';
sb.mock(import('../src/db/client.ts'));
```

See `references/tanstack-react.md` for the full TanStack Query
integration, route-tree-rendering, and server-only-module debugging
guide.

### HTML (Vite)

```ts
framework: '@storybook/html-vite'
```

Renderer-less framework — stories return raw HTML strings or DOM nodes.
Great for design-system style guides and vanilla-JS components.

### Ember

```ts
framework: '@storybook/ember'
```

Requires `@storybook/ember-cli-storybook` set up in `ember-cli-build.js`
to generate `storybook-docgen/index.json`. Limited feature set —
Interactions panel and test runner aren't supported.

```js
// ember-cli-build.js
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const emberCliStorybook = require('@storybook/ember-cli-storybook');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {});
  return emberCliStorybook(app);
};
```

Then in `preview.ts`:

```ts
import jsonMetadata from '../storybook-docgen';
const preview = { parameters: { docs: { extractComponentDescription: extractFromJson(jsonMetadata) } } };
```

## Choosing between options

### "Vite or Webpack for React?"

**Vite**, unless:
- You're on CRA and don't want to migrate.
- You have a custom Webpack config (a `webpack.config.js` that's
  doing heavy lifting like `module-federation` or unusual loaders).

### "Vite or Webpack for Next.js?"

**`@storybook/nextjs-vite`**, unless:
- You have `webpack: (config) => ...` customizations in
  `next.config.js` that Vite can't replicate.
- You have a `.babelrc` with plugins your code depends on.

You can't use the Vitest addon (Storybook Test) with the Webpack version.

### "On-device or web for React Native?"

- **On-device** if you ship native modules or want simulator fidelity.
- **Web** if you want docs, testing, Chromatic, addons. Most teams use
  both.

### "Svelte CSF or plain CSF for Svelte?"

- **Svelte CSF** for the natural Svelte template story syntax. Recommended.
- **Plain CSF** if you need a Storybook feature Svelte CSF doesn't
  support (it sometimes lags — e.g., "save story from Controls" doesn't
  work).

## Migrating between frameworks

| From → To | Codemod / how |
| --- | --- |
| `@storybook/react-webpack5` → `@storybook/react-vite` | `npx storybook automigrate` (auto-detected when running upgrade) |
| `@storybook/nextjs` → `@storybook/nextjs-vite` | `npx storybook automigrate nextjs-to-nextjs-vite` |
| `@storybook/react-vite` → `@storybook/tanstack-react` | `npx storybook automigrate react-vite-to-tanstack-react` |
| `@storybook/addon-react-native-web` → `@storybook/react-native-web-vite` | manual; see `references/react-native.md` |
| Storybook 8 → 9 → 10 | `npx storybook@9 upgrade`, then `npx storybook@10 upgrade` (one major at a time) |

See `storybook-migration` for the full upgrade guide.

## Common pitfalls

1. **"`storybook init` ignored my framework choice".** Re-run with
   `--type <name> --force`. The CLI sometimes auto-picks based on what
   it finds in `package.json` and overrides explicit flags.
2. **Next.js images break.** Make sure you have `next/image`'s peer
   `sharp` installed (`npm i sharp`). For local images, pass the
   imported object as `src`, not a string path.
3. **Vue stories work in dev but throw in test.** Vue's template
   compilation differs between in-browser and tools-bundled. For the
   Vitest addon, alias `vue` to `vue/dist/vue.esm-bundler.js` in
   `vitest.config.ts` (or `viteFinal` in main.ts).
4. **Angular Controls are all blank.** You either forgot to install
   Compodoc or forgot to register `setCompodocJson` in `preview.ts`.
   The builder also needs `"compodoc": true` in both `storybook` and
   `build-storybook` targets.
5. **Svelte CSF v5 migration leaves `<Template>` errors.** Set
   `legacyTemplate: true` in the addon options temporarily, then
   migrate templates to the `{#snippet template(args)}` syntax.
6. **TanStack story crashes with "module does not provide an export
   named 'default'".** A server-only module reached the browser. Walk
   the error stack trace until you find the first import you wrote
   yourself, then add a `__mocks__/` file for it. The framework's
   automatic mocks only cover `@tanstack/*` internals.
7. **React Native Web story is missing `react-native-svg`.** Add
   `'react-native-svg'` to `framework.options.modulesToTranspile`.
   Same for any RN-only library that doesn't ship a web build.
8. **`Storybook tests not detecting Web Components shadow DOM`.**
   Install `shadow-dom-testing-library` and register its queries; use
   `findByShadowRole(...)` instead of `findByRole(...)`.
9. **Cross-framework Storybook composition.** Use `refs` (see
   `storybook-sharing`). Each Storybook ref publishes its own
   manifest/index — composition is framework-agnostic.

## See also

- `storybook-core` — install, CLI, version landscape
- `storybook-config` — `framework`/`framework.options` schema, builder selection
- `storybook-builders` — Vite vs Webpack 5 customization, SWC/Babel
- `storybook-stories` — CSF 3 / CSF Next / Svelte CSF
- `storybook-testing` — which testing tools work with which framework (especially Vitest addon = Vite-only)
- `storybook-sharing` — Composition across multiple frameworks via `refs`
- `storybook-migration` — upgrading + migration codemods
