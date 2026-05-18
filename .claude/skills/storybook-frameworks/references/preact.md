# Preact (Vite) with Storybook — full reference

Framework: `@storybook/preact-vite`. Supports **Preact 8.x and 10.x**
(auto-detected). Requires **Vite 5+**.

## Install

```bash
npm create storybook@latest    # auto-detects Preact
# Manual:
npm i -D @storybook/preact-vite vite
```

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/preact-vite';
const config: StorybookConfig = {
  framework: '@storybook/preact-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
};
export default config;
```

## Story format

Identical to React stories (Preact's API is React-compatible). Use
`Meta<typeof Component>` + `StoryObj<typeof meta>`:

```tsx
import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Button } from './Button';

const meta = { component: Button } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { primary: true, label: 'Click' } };
```

## Framework options

```ts
framework: {
  name: '@storybook/preact-vite',
  options: {
    builder: { /* Vite options */ },
  },
},
```

## Preact-specific notes

- `useArgs` from `storybook/preview-api` works the same as in React.
- For Preact's `signals`, write them inside the rendered component, not
  inside the render function — see `storybook-stories` for the hook-
  mixing constraints.
- Addons that target React 18 internals (e.g. RSC features) generally
  don't apply.
- The addon ecosystem is smaller — most generic addons (docs, a11y,
  controls, viewport, backgrounds, themes) work. Check
  `sources/storybook/docs/configure/integration/frameworks-feature-support.mdx`
  for the full matrix.

## Common pitfalls

1. **JSX type errors**. Make sure `tsconfig.json` has `"jsxImportSource": "preact"`
   and your Preact-React-compat shim is in place if you use any React
   third-party libs.
2. **`react-docgen` doesn't infer props**. Preact projects rely on
   TypeScript types directly — set `typescript.reactDocgen: false` if
   docgen is causing more trouble than it solves.
3. **Vitest addon support**. Preact is supported by the Vitest addon
   via the Preact Vite framework — works out of the box. The Vitest
   addon installer should pick it up.
