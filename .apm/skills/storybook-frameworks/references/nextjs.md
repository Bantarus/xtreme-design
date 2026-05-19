# Next.js with Storybook — full reference

Two framework packages target Next.js:

| Package | Builder | Recommendation |
| --- | --- | --- |
| `@storybook/nextjs-vite` ⭐ | Vite (via `vite-plugin-storybook-nextjs`) | **Recommended for all new Next.js projects.** Required for the Vitest addon. |
| `@storybook/nextjs` | Webpack 5 | Only when you have custom Webpack/Babel that Vite can't replicate. |

Requires **Next.js 14.1+**. (For older Next.js, stay on `@storybook/nextjs`
and Storybook 8.x.)

## Install

```bash
npm create storybook@latest
# When the CLI asks Vite vs Webpack, prefer Vite unless you have a reason not to.
```

Manual:

```bash
# Vite (recommended)
npm i -D @storybook/nextjs-vite
# Webpack
npm i -D @storybook/nextjs
```

```ts
// .storybook/main.ts  (Vite)
const config: StorybookConfig = {
  framework: '@storybook/nextjs-vite',
  // ...
};

// .storybook/main.ts  (Webpack)
const config: StorybookConfig = {
  framework: '@storybook/nextjs',
  // ...
};
```

## What works out of the box

| Feature | Status |
| --- | --- |
| `next/image` (local + remote) | ✅ |
| `next/font/google` | ✅ (mockable in CI — see below) |
| `next/font/local` | ✅ — Vite handles paths automatically; Webpack requires `staticDirs` mapping |
| `next/head` | ✅ |
| `next/router` (pages dir) | ✅ — auto-mocked, navigation logged as Actions |
| `next/navigation` (app dir) | ✅ — set `parameters.nextjs.appDirectory: true` |
| `useSelectedLayoutSegment`/`useSelectedLayoutSegments`/`useParams` | ✅ — provide `parameters.nextjs.navigation.segments` |
| CSS Modules, Sass/SCSS, styled-jsx, Tailwind, PostCSS | ✅ — reuses Next.js's config |
| Absolute imports + module aliases (`@/components/*`) | ✅ |
| Subpath imports (`#components/...`) | ✅ |
| Runtime config (`publicRuntimeConfig`) | ✅ — `serverRuntimeConfig` is always empty |
| React Server Components | ✅ (experimental, behind `experimentalRSC` feature flag) |
| `sharp` for AVIF | required if you use AVIF — `npm i sharp` |

## Framework options

```ts
framework: {
  name: '@storybook/nextjs-vite',
  options: {
    nextConfigPath: '../next.config.js',     // absolute or relative path
    image: { unoptimized: true },             // props to apply to every <Image>
    builder: { /* Vite or Webpack options */ },
  },
},
```

## Mocking Next.js internals

The framework provides writable mock modules for all common Next.js
internal modules. Import from `@storybook/nextjs-vite/<module>.mock` (or
`@storybook/nextjs/<module>.mock` for the Webpack framework — same APIs).

### `cache.mock`

```ts
import { revalidatePath, revalidateTag } from '@storybook/nextjs-vite/cache.mock';
import { mocked } from 'storybook/test';

export const Refreshing: Story = {
  play: async () => {
    await someAction();
    await expect(mocked(revalidatePath)).toHaveBeenCalledWith('/dashboard');
  },
};
```

### `headers.mock` (writable!)

```ts
import { cookies, headers, draftMode } from '@storybook/nextjs-vite/headers.mock';

export const WithCookie: Story = {
  beforeEach: async () => {
    cookies().set('user', 'alice');
    headers().set('x-test', '1');
    draftMode().enable();
  },
};
```

Available write methods (in addition to Next.js's read methods):
- `cookies().set(name, value, options?)` / `cookies().delete(name)`
- `headers().append(name, value)` / `headers().set(name, value)` / `headers().delete(name)`

All return-value methods are mocks, so you can also assert:

```ts
await expect(headers().getAll.mock.calls).toEqual([['x-test']]);
```

### `navigation.mock` (app directory)

```ts
import { getRouter } from '@storybook/nextjs-vite/navigation.mock';
import { mocked } from 'storybook/test';
import { useRouter } from 'next/navigation';

export const NavigatesToProfile: Story = {
  play: async ({ canvas }) => {
    const router = getRouter();
    await userEvent.click(canvas.getByText('View profile'));
    await expect(router.push).toHaveBeenCalledWith('/profile/123');
  },
};
```

Override default segments/params:

```ts
parameters: {
  nextjs: {
    appDirectory: true,
    navigation: {
      pathname: '/dashboard/analytics',
      segments: ['dashboard', 'analytics'],   // useSelectedLayoutSegments
    },
  },
},
```

For `useParams`:

```ts
parameters: {
  nextjs: {
    navigation: {
      segments: [['slug', 'hello'], ['framework', 'nextjs']],
      // useParams() → { slug: 'hello', framework: 'nextjs' }
    },
  },
},
```

### `router.mock` (pages directory)

```ts
import { getRouter } from '@storybook/nextjs-vite/router.mock';

export const NavigatesAway: Story = {
  play: async () => {
    const router = getRouter();
    expect(router.pathname).toBe('/');
  },
};
```

Override defaults:

```ts
parameters: {
  nextjs: {
    router: { asPath: '/about', pathname: '/[slug]', query: { slug: 'about' } },
  },
},
```

Default router shape:

```ts
{
  locale: globals?.locale,
  asPath: '/',
  basePath: '/',
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
  route: '/',
  pathname: '/',
  query: {},
}
```

## App directory (`next/navigation`)

Set the parameter wherever the app-dir story imports `next/navigation`:

```ts
const meta = {
  parameters: { nextjs: { appDirectory: true } },
};
```

Or project-wide (recommended if your project is fully app-dir):

```ts
// .storybook/preview.ts
const preview: Preview = {
  parameters: { nextjs: { appDirectory: true } },
};
```

## Fonts

### `next/font/google`

Works without config. In CI, font fetching can fail and crash builds.
Mock it via `NEXT_FONT_GOOGLE_MOCKED_RESPONSES`:

```js
// mocked-google-fonts.js
module.exports = {
  'https://fonts.googleapis.com/css?family=Inter:wght@400;500;700&display=block': `
    @font-face { font-family: 'Inter'; ... src: url(...) format('woff2'); }
  `,
};
```

```yaml
# GitHub Actions
- uses: chromaui/action@latest
  env:
    NEXT_FONT_GOOGLE_MOCKED_RESPONSES: ${{ github.workspace }}/mocked-google-fonts.js
```

### `next/font/local`

```ts
import localFont from 'next/font/local';
const rubik = localFont({ src: './fonts/RubikStorm-Regular.ttf' });
```

- **Vite framework**: works automatically.
- **Webpack framework**: add the fonts folder to `staticDirs`:
  ```ts
  staticDirs: [{ from: '../src/components/fonts', to: 'src/components/fonts' }],
  ```

Not yet supported: `fallback`, `adjustFontFallback`, `preload`, `display`,
font-loader config in `next.config.js`.

## Module aliases & subpath imports

- **Module aliases** (`@/components/*`): work out of the box via your
  `tsconfig.json` `paths`.
- **Absolute imports** (from project root): work out of the box.
- **Subpath imports** (`#components/*` from `package.json` `imports`):
  preferred when you also want module mocking. See `storybook-stories`
  → "Subpath imports".

⚠️ Absolute imports **cannot** be mocked with Storybook's automocking
because the path is resolved at build time, not at runtime. Switch to
subpath imports or builder aliases for mocking.

## Mocking other modules

For non-Next.js modules, use the standard Storybook approaches (see
`storybook-stories` → "Mocking modules"):
- Automocking via `sb.mock(...)` in `.storybook/preview.ts`
- `__mocks__/<name>.ts` files
- Subpath imports
- Builder aliases

## React Server Components (experimental)

```ts
// .storybook/main.ts
features: { experimentalRSC: true },
```

The framework wraps every story in a Suspense boundary so async server
components can resolve. To disable per story:

```ts
parameters: { react: { rsc: false } },
```

Server components that access **server-side resources** (file system,
DB) need their data-access layer mocked. Options:
1. Refactor the page to extract a client component and write stories for the client component.
2. Mock the data-access module via `sb.mock` or `__mocks__/`.
3. Use MSW for network requests.

## Stories for pages that fetch data

```jsx
// app/profile/page.jsx — DOES NOT WORK in stories
async function getData() {
  const res = await fetch(...);
  return res.json();
}
export default async function Page() {
  const data = await getData();
  return <Profile {...data} />;
}
```

Refactor to:

```jsx
// app/profile/page.jsx
import { Profile } from './components/Profile';
async function getData() { /* server-only */ }
export default async function Page() {
  const data = await getData();
  return <Profile {...data} />;
}
```

Then write stories for `Profile`, not `Page`.

## Portable stories (Jest)

If you use Jest (not Vitest), the Next.js framework provides a helper:

```ts
// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js';
import { getPackageAliases } from '@storybook/nextjs/export-mocks';

const createJestConfig = nextJest({ dir: './' });
const config: Config = {
  testEnvironment: 'jsdom',
  moduleNameMapper: { ...getPackageAliases() },
};
export default createJestConfig(config);
```

Then import `composeStories` from `@storybook/nextjs`:

```ts
import { composeStories } from '@storybook/nextjs';
```

## Migrating Webpack → Vite

```bash
npx storybook automigrate nextjs-to-nextjs-vite
```

This updates `package.json`, `.storybook/main.ts`, and import statements.
If you had `webpackFinal`, you'll need to manually rewrite as
`viteFinal`. See `storybook-builders` → "Migrating from Webpack".

## Common pitfalls

1. **Image imports return strings, not `{ src, height, width }`** —
   you're treating them like raw asset imports. Next.js's `next/image`
   expects the import object form.
2. **`sharp` not installed** — `npm i sharp` or use `image: { unoptimized: true }`.
3. **`useRouter()` returns the real router, not the mock.** Ensure
   `appDirectory: true` for app-dir stories.
4. **Styles broken with Tailwind.** Tailwind's PostCSS works automatically
   — verify your `tailwind.config.js` `content` includes `*.stories.tsx`
   files and that you import your Tailwind CSS in `preview.tsx`.
5. **`Module not found: 'css-loader' / 'style-loader'`** with Yarn v2/v3
   PnP — install them as direct deps in your project.
6. **`MyEnv.local` isn't exposed.** Storybook only exposes `STORYBOOK_*`
   prefixed env vars. Rename or use `import.meta.env`.
7. **MSW handlers don't intercept server-component fetches.** MSW works
   in the browser only; server components run on the server. Refactor to
   client components or mock the data-access module.
