# SvelteKit with Storybook — full reference

Framework: `@storybook/sveltekit`. Uses SvelteKit's own Vite under the
hood. Requires **SvelteKit 1+** and **Vite 5+**.

The story-authoring story is identical to plain Svelte
(`addon-svelte-csf`, see `svelte.md`). What this framework adds is
**mocking for SvelteKit-specific modules** (`$app/*`, `$env/*`,
`@sveltejs/kit/*`).

## Install

```bash
npm create storybook@latest    # auto-detects SvelteKit
```

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
  framework: '@storybook/sveltekit',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-svelte-csf'],
};
export default config;
```

## SvelteKit module support matrix

| Module | Status | Notes |
| --- | --- | --- |
| `$app/environment` | ✅ Supported | `version` is always empty in Storybook |
| `$app/forms` | ⚠️ Experimental | See [Mocking](#how-to-mock) |
| `$app/navigation` | ⚠️ Experimental | See [Mocking](#how-to-mock) |
| `$app/paths` | ✅ Supported | Requires SvelteKit 1.4.0+ |
| `$app/state` | ⚠️ Experimental | Requires SvelteKit 2.12+ |
| `$app/stores` | ⚠️ Experimental | Deprecated by SvelteKit upstream |
| `$env/static/public` | ✅ Supported | |
| `$env/dynamic/public` | 🚧 Partial | Dev only |
| `$lib` | ✅ Supported | |
| `@sveltejs/kit/*` | ✅ Supported | |
| `$env/dynamic/private` | ❌ Not supported | Server-side feature |
| `$env/static/private` | ❌ Not supported | Server-side feature |
| `$service-worker` | ❌ Not supported | Service worker context |

## How to mock — `parameters.sveltekit_experimental`

The framework exposes mocks under the `sveltekit_experimental`
parameter namespace.

### Navigation (`$app/navigation`)

```ts
parameters: {
  sveltekit_experimental: {
    navigation: {
      goto: (to, options) => console.log('goto', to),
      pushState: (url, state) => console.log('pushState', url),
      replaceState: (url, state) => console.log('replaceState', url),
      invalidate: (resource) => console.log('invalidate', resource),
      invalidateAll: () => console.log('invalidateAll'),
      afterNavigate: { from: null, to: { params: {} }, type: 'goto' },
    },
  },
},
```

If you don't provide a callback for a nav function, it logs to the
Actions panel by default.

### Form actions (`$app/forms`)

```ts
parameters: {
  sveltekit_experimental: {
    forms: {
      enhance: () => console.log('form enhance triggered'),
    },
  },
},
```

`enhance` fires when a form with `use:enhance` is submitted in your
story.

### Stores (`$app/stores`)

```ts
parameters: {
  sveltekit_experimental: {
    stores: {
      page: {
        url: new URL('https://example.com/profile/123'),
        params: { id: '123' },
        data: {},
      },
      navigating: { from: null, to: null },
      updated: false,
    },
  },
},
```

### State runes (`$app/state`, SvelteKit 2.12+)

```ts
parameters: {
  sveltekit_experimental: {
    state: {
      page: {
        url: new URL('https://example.com/'),
        params: {},
        data: {},
      },
      navigating: {},
      updated: { current: false },         // updated.check() is a no-op
    },
  },
},
```

### Link mocking (`<a href>` clicks)

By default, clicking an `<a href>` in a story logs to the Actions panel.
Override per-URL:

```ts
parameters: {
  sveltekit_experimental: {
    hrefs: {
      '/login':   (to, ev) => console.log('login clicked'),
      '/logout':  (to, ev) => console.log('logout clicked'),
      '\\/api/.*': { callback: (to) => console.log('api click', to), asRegex: true },
    },
  },
},
```

Keys are exact strings; set `asRegex: true` on a value object to treat
the key as a regex (mind the JavaScript string escapes — `\\/` for `/`).

## Svelte CSF for story authoring

SvelteKit projects use the same `@storybook/addon-svelte-csf` and same
story format as plain Svelte projects. See `svelte.md` for the full
guide on `defineMeta`, `<Story>`, `template` snippets, `asChild`, and
v4→v5 migration.

## Framework options

```ts
framework: {
  name: '@storybook/sveltekit',
  options: {
    docgen: true,
    builder: { /* Vite options */ },
  },
},
```

## Common pitfalls

1. **`$lib` import fails.** Check that your `svelte.config.js` defines
   the kit alias correctly — Storybook reads it.
2. **`$env/static/private` errors.** Server-side only — your component
   shouldn't import it. Refactor or pass the value as a prop.
3. **`goto()` doesn't navigate in the story.** That's expected —
   Storybook stories run in a static iframe. `goto` is mocked.
4. **`<a href="/profile">` clicks open in a new tab.** Define
   `parameters.sveltekit_experimental.hrefs` to override.
5. **`afterNavigate` callback isn't called.** It's only called when
   `onMount` fires for the story. Provide it via parameters; the
   framework simulates it for you.
6. **My SvelteKit version is too old for `$app/state`**. Upgrade to
   SvelteKit 2.12+ or use `$app/stores` instead.
