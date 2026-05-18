# Vue 3 with Storybook — full reference

Single framework: `@storybook/vue3-vite`. Requires **Vue 3+** and
**Vite 5+**. Vue 2 is end-of-life — pin Storybook to `7.x` if you
must support it.

## Install

```bash
npm create storybook@latest
# Manual:
npm i -D @storybook/vue3-vite vite
```

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/vue3-vite';
const config: StorybookConfig = {
  framework: '@storybook/vue3-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
};
export default config;
```

## Wiring up Vue plugins, components, mixins

```ts
// .storybook/preview.ts
import { setup } from '@storybook/vue3-vite';
import { createPinia } from 'pinia';
import MyPlugin from 'my-plugin';

setup((app) => {
  app.use(createPinia());
  app.use(MyPlugin);
  app.component('FontAwesomeIcon', FontAwesomeIcon);
  app.mixin({ /* ... */ });
});
```

`setup` runs **once** before stories render — exactly like
`createApp(App)` in a normal Vue app.

## Framework options

```ts
framework: {
  name: '@storybook/vue3-vite',
  options: {
    docgen: 'vue-docgen-api',          // default
    // OR for more powerful docgen:
    docgen: 'vue-component-meta',
    // OR with config (for multiple tsconfigs):
    docgen: { plugin: 'vue-component-meta', tsconfig: 'tsconfig.app.json' },
    // OR disable docgen for faster builds:
    docgen: false,
    builder: { /* Vite options */ },
  },
},
```

### `vue-docgen-api` (default)

The original Vue docgen tool. Supports `props`, `events`, `slots` for
options API and basic composition API. Fast but limited.

### `vue-component-meta` (opt-in, more powerful)

Maintained by the Vue team. Use when you want any of:

- **JSDoc-annotated prop descriptions and tags** (including `@since`,
  `@deprecated`):
  ```vue
  <script setup lang="ts">
    interface MyProps {
      /** The name of the user */
      name: string;
      /** @since 8.0.0 */
      category?: string;
    }
    withDefaults(defineProps<MyProps>(), { category: 'Uncategorized' });
  </script>
  ```
- **Typed emit events** from `defineEmits<{}>()`:
  ```vue
  <script setup lang="ts">
    interface MyEvents {
      /** Fired when item is changed */
      (event: 'change', item?: Item): void;
      (event: 'delete', id: string): void;
    }
    const emit = defineEmits<MyEvents>();
  </script>
  ```
- **Typed slots** from `defineSlots<{}>()`:
  ```ts
  defineSlots<{
    default(props: { num: number }): any;
    named(props: { str: string }): any;
  }>();
  ```
- **Exposed methods** from `defineExpose({...})` shown in the Controls.
- Support for all Vue component types — SFC, functional, options API,
  composition API — across `.vue`, `.ts`, `.tsx`, `.js`, `.jsx`.
- Default + named component exports.

Trade-off: noticeably slower build, especially on large projects.

### Multi-tsconfig projects (Vue with `tsconfig.app.json`)

If your project uses `tsconfig` references (e.g. `tsconfig.app.json`,
`tsconfig.node.json`), explicitly point the docgen plugin at the app
config:

```ts
options: {
  docgen: { plugin: 'vue-component-meta', tsconfig: 'tsconfig.app.json' },
},
```

Without this, you may see missing prop types or unresolvable
`@/some/import` aliases — a limitation of how `vue-component-meta` walks
tsconfigs.

### Disable docgen for performance

```ts
options: { docgen: false },
```

Saves significant build time on large libraries, at the cost of:
- No automatic argType inference.
- Controls and Autodocs won't auto-populate.

You'll need to define `argTypes` manually on every story file.

## CSF Next support

Vue 3 is one of the four supported renderers for CSF Next (see
`storybook-stories` → "CSF Next preview"). For generic Vue components
with `<script lang="ts" setup generic="T">`:

```ts
const meta = preview.meta({
  component: GenericList<{ id: number; name: string }>,
});

export const Example = meta.story({
  args: {
    items: [{ id: 1, name: 'John Doe' }],
    getLabel: (item) => item.name,  // correctly typed
  },
});
```

This fixes the long-standing CSF 3 issue where generic Vue components
default `T` to `unknown`.

## Vue-specific story patterns

### Reactive globals in decorators

Vue's reactivity needs globals to be passed through `setup` and accessed
via `computed`:

```ts
const decorators = [(Story, { globals }) => ({
  setup() {
    const theme = computed(() => globals.theme);
    return { theme };
  },
  template: `<div :data-theme="theme"><story/></div>`,
})];
```

### `updateArgs` in Vue decorators

Vue's `useArgs()` equivalent: `useArgs` from `storybook/preview-api`
works the same way but you call it from the decorator's `setup`:

```ts
import { useArgs } from 'storybook/preview-api';

const decorators = [(Story) => ({
  setup() {
    const [_args, updateArgs] = useArgs();
    return { onClick: () => updateArgs({ count: _args.count + 1 }) };
  },
  template: `<div @click="onClick"><story/></div>`,
})];
```

## TypeScript

- Install the [official Vue extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar) for VS Code (volar) for `.vue` file type inference.
- Use `vue-tsc` for type checking SFCs.
- The `Meta<typeof Component>` import path is `'@storybook/vue3-vite'`.

## Common pitfalls

1. **Controls panel shows all props as `object`.** Either the
   `component` annotation is missing on the meta, OR `docgen` failed
   to parse the SFC. Check console for parsing errors.
2. **`vue-component-meta` says "missing tsconfig".** Specify
   `docgen: { plugin: 'vue-component-meta', tsconfig: '...' }`.
3. **Story renders blank.** Check that you returned a valid Vue
   component from the render function (object form or `defineComponent`).
4. **Vitest addon test fails with "template compilation"**. Alias `vue`
   in `vitest.config.ts`:
   ```ts
   resolve: { alias: { vue: 'vue/dist/vue.esm-bundler.js' } }
   ```
5. **`provide` / `inject` doesn't reach the story.** Provide it from a
   decorator's `setup`, not from the `template`.
