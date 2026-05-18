# React with Storybook — full reference

Two framework packages target plain React (no meta-framework):

| Package | Builder | Recommendation |
| --- | --- | --- |
| `@storybook/react-vite` | Vite | **Default for React 16.8+** |
| `@storybook/react-webpack5` | Webpack 5 | Use only if Vite can't replicate your custom Webpack/Babel config (e.g., Module Federation) |

Both require React **16.8+** and ship `react-docgen` (fast) for argType
inference. Switch to `react-docgen-typescript` for TS enums,
`forwardRef`, or workspace-package prop inheritance.

## Install — Vite

```bash
npm create storybook@latest
# Or manually:
npm i -D @storybook/react-vite vite @storybook/addon-docs
```

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
};
export default config;
```

## Install — Webpack 5

```bash
npm create storybook@latest -- --type react_webpack5
# Or manually:
npm i -D @storybook/react-webpack5 webpack
npx storybook add @storybook/addon-webpack5-compiler-swc   # or compiler-babel
```

```ts
import type { StorybookConfig } from '@storybook/react-webpack5';
const config: StorybookConfig = {
  framework: '@storybook/react-webpack5',
  // ...
};
```

CRA users: install `@storybook/preset-create-react-app` (auto-detected
by the init wizard). It reuses CRA's Webpack/Babel config so SCSS/TS/
PostCSS work without extra setup.

Manually initialized React + Webpack apps: ensure `react-dom` is a
real dependency (not a transitive one) to avoid Storybook conflicts.

## Framework options

Both Vite and Webpack5 React frameworks accept:

```ts
framework: {
  name: '@storybook/react-vite',          // or react-webpack5
  options: {
    builder: {                             // pass-through to the builder
      // Vite: viteConfigPath, etc.
      // Webpack5: lazyCompilation, fsCache
    },
    strictMode: false,                     // React StrictMode wrapper (Webpack only)
    legacyRootApi: true,                   // use legacy ReactDOM.render — React 18+ only
  },
},
```

| Option | Frameworks | Description |
| --- | --- | --- |
| `strictMode` | react-webpack5 | Enables `React.StrictMode` around every story. |
| `legacyRootApi` | react-webpack5 | Falls back to `ReactDOM.render` instead of `createRoot`. For projects that haven't migrated to React 18's root API. |
| `builder` | both | Builder-specific options (see `storybook-builders`). |

## TypeScript options

```ts
typescript: {
  reactDocgen: 'react-docgen',              // 'react-docgen-typescript' | false
  reactDocgenTypescriptOptions: {
    tsconfigPath: './tsconfig.json',
    include: ['**/*.tsx'],
    propFilter: (prop) => !prop.parent?.fileName?.includes('node_modules'),
  },
  check: false,                              // Webpack-only: fork-ts-checker-webpack-plugin
  checkOptions: {},
  skipCompiler: false,                       // Webpack-only
},
```

Switch to `react-docgen-typescript` when:
- TS enums are missing from argTypes
- `React.forwardRef` components don't show their props
- Props inherited from workspace packages are missing (also add the workspace path to `include`)

Trade-off: 5–30 sec slower startup on large projects.

## React-only patterns

### `useArgs` in render functions

```tsx
import { useArgs } from 'storybook/preview-api';

export const Controlled: Story = {
  args: { value: '' },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs();
    return <input value={value} onChange={(e) => updateArgs({ value: e.target.value })} />;
  },
};
```

⚠️ Don't mix `useArgs` / `useState` (from `storybook/preview-api`) with React's own
`useState` / `useEffect` / `useRef` in the same render function — you'll get
"Invalid hook call" errors on rerender. Use Storybook's equivalents from
`storybook/preview-api`, or move state into a separate wrapper component.

### React Hooks in stories

You can use any React hook *inside the rendered component* freely (it's just
React). The constraint above applies only when **mixing** React hooks with
Storybook hooks in the same `render` function.

### React Server Components (RSC)

Set the feature flag in `main.ts`:

```ts
features: { experimentalRSC: true },
```

Storybook then wraps each story in a `<Suspense>` boundary. For stories
that break with the Suspense wrapper:

```ts
parameters: { react: { rsc: false } },
```

For RSCs that access Node-only resources (file system, DB clients), you
need to mock the data-access layer via Vite/Webpack aliases or an
addon like `storybook-addon-module-mock`. For network requests, use the
MSW addon.

## Migrating react-webpack5 → react-vite

```bash
npx storybook upgrade   # detects + offers the migration
```

If your project has heavy Webpack customizations, you may need to
manually rewrite `webpackFinal` callbacks as `viteFinal`. See
`storybook-builders` for the recipe.

## Common pitfalls

1. **`process.env.MY_VAR` undefined in Vite Storybook.** Vite doesn't
   expose `process.env`. Use `import.meta.env.STORYBOOK_MY_VAR`.
2. **`m.createRoot is not a function`** when using the Vitest addon on
   React 16 or 17 projects: alias `@storybook/react-dom-shim` to the
   React-16 shim in `vitest.config.ts`:
   ```ts
   resolve: { alias: { '@storybook/react-dom-shim': '@storybook/react-dom-shim/dist/react-16' } }
   ```
3. **`StrictMode` causes double-renders that confuse tests.** Disable
   per-story with `parameters: { react: { strictMode: false } }` (webpack
   framework only) or wrap stories in a non-strict context.
4. **Tailwind classes don't apply.** Tailwind needs `content` paths
   that include your story files. Add `"./src/**/*.stories.{ts,tsx}"`
   to `tailwind.config.js`. Import your CSS from
   `.storybook/preview.tsx`.
5. **`react-docgen-typescript` ignores enums.** It's known but rare —
   try the `react-docgen-typescript-plugin`'s `shouldIncludePropTagMap`
   option, or define `argTypes.<x>.options` manually.
