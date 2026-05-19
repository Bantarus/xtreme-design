# React Native with Storybook — full reference

Two complementary frameworks. Most teams use **both**.

| Framework | Where | Builder | Pros | Cons |
| --- | --- | --- | --- | --- |
| `@storybook/react-native` | On-device (simulator / Expo Go / real device) | Metro | Full native fidelity, native modules work | Limited features — no addons, no MCP, no docs/a11y, no Chromatic |
| `@storybook/react-native-web-vite` | Browser via `react-native-web` 0.19+ | Vite | All Storybook features (docs, a11y, testing, Chromatic, MCP) | Only renders what `react-native-web` supports |

Requires **React Native 0.72+** and **React Native Web 0.19+**.

## Choosing the right framework

- **On-device** when:
  - You ship native modules (Reanimated, Camera, BLE, etc.).
  - You want to test on a real device or simulator.
  - You're embedding Storybook into your app for QA / Expo updates.
- **Web** when:
  - You want documentation, Chromatic visual tests, the Vitest addon,
    a11y audits, the MCP server.
  - You want to share Storybook with non-RN developers.
- **Both** when you want the best of each — the CLI's "Both" install
  option scaffolds parallel `.storybook/` configs.

## Install — React Native Web (Vite)

```bash
npm create storybook@latest    # pick "React Native Web" when prompted
# Manual:
npm i -D @storybook/react-native-web-vite vite
```

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-native-web-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-native-web-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
};
export default config;
```

## Install — On-device (React Native)

```bash
npm create storybook@latest    # pick "React Native"
```

The CLI will scaffold a Storybook config directory and require manual
steps to:
- Replace your app's entry to point to Storybook in dev mode.
- Wrap Metro config with Storybook's transformer.

Refer to the on-device Storybook README:
`https://github.com/storybookjs/react-native`.

## Install — Both

```bash
npm create storybook@latest    # pick "Both"
```

Creates `.storybook/` (RN web) and `.rnstorybook/` (on-device) with
appropriate configs. Each runs independently.

## React Native Web framework options

```ts
// .storybook/main.ts
framework: {
  name: '@storybook/react-native-web-vite',
  options: {
    modulesToTranspile: ['my-rn-library', 'react-native-svg'],
    pluginReactOptions: {
      jsxRuntime: 'automatic',                      // 'automatic' (default) | 'classic'
      jsxImportSource: 'react',                     // default
      babel: {
        plugins: ['@babel/plugin-proposal-export-namespace-from'],
        presets: [],
      },
      include: [/\.tsx?$/],
      exclude: [/node_modules/],
    },
  },
},
```

### `modulesToTranspile`

Transpile RN-style packages that aren't pre-built for the web. Common
examples: `react-native-svg`, `react-native-reanimated`, `nativewind`.

### `pluginReactOptions.babel` for Reanimated

```ts
options: {
  pluginReactOptions: {
    babel: {
      plugins: [
        '@babel/plugin-proposal-export-namespace-from',
        'react-native-reanimated/plugin',
      ],
    },
  },
},
```

### `pluginReactOptions.jsxImportSource` for NativeWind

```ts
options: {
  pluginReactOptions: { jsxImportSource: 'nativewind' },
},
```

## Migrating from `@storybook/addon-react-native-web`

The old Webpack-based addon is superseded by `@storybook/react-native-web-vite`.

```bash
# Upgrade Storybook to v8.5+
npx storybook upgrade

# Install the new framework
npm i -D @storybook/react-native-web-vite
```

Update `.storybook/main.ts`:

```diff
- import { StorybookConfig } from '@storybook/react-webpack5';
+ import { StorybookConfig } from '@storybook/react-native-web-vite';

  const config: StorybookConfig = {
-   framework: '@storybook/react-webpack5',
+   framework: '@storybook/react-native-web-vite',
    // ...
-   addons: ['@storybook/addon-react-native-web', /* ... */],
+   addons: [/* same minus the rnw addon */],
  };
```

Uninstall:

```bash
npm uninstall @storybook/react-webpack5 @storybook/addon-react-native-web
```

## Story format

Same CSF 3 as React, but you import your RN component:

```tsx
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Pressable, Text } from 'react-native';

const meta = {
  component: ({ label, onPress }: { label: string; onPress: () => void }) => (
    <Pressable onPress={onPress}>
      <Text>{label}</Text>
    </Pressable>
  ),
} satisfies Meta<any>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { label: 'Tap me', onPress: () => {} } };
```

## Common pitfalls

1. **"Cannot find module 'X'" for an RN library**. Add it to
   `modulesToTranspile` in framework options.
2. **`react-native-svg` blank icons**. Add `'react-native-svg'` to
   `modulesToTranspile`.
3. **Reanimated animations don't run**. Add the
   `react-native-reanimated/plugin` Babel plugin in
   `pluginReactOptions.babel.plugins`.
4. **NativeWind classes don't apply**. Set
   `pluginReactOptions.jsxImportSource: 'nativewind'`.
5. **Native modules crash**. They can only work on-device. Use
   the RN (Metro) framework for those, not the web framework.
6. **Different behavior between web and device**. Expected — RNW is a
   compatibility shim, not a perfect replica. Check
   [`react-native-web` compatibility docs](https://necolas.github.io/react-native-web/docs/react-native-compatibility/)
   for what's polyfilled.
