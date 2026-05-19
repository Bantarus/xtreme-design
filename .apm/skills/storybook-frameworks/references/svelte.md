# Svelte (Vite) with Storybook — full reference

Framework: `@storybook/svelte-vite`. For SvelteKit, see
`sveltekit.md` instead.

Requires **Svelte 5+** and **Vite 5+**. Svelte 4 projects work but
should plan to upgrade.

## Install

```bash
npm create storybook@latest    # auto-detects Svelte
# Manual:
npm i -D @storybook/svelte-vite vite @storybook/addon-svelte-csf
```

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
  framework: '@storybook/svelte-vite',
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|ts|svelte)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-svelte-csf'],
};
export default config;
```

The Svelte CSF addon is auto-installed since SB 8.2 when you initialize
a Svelte project.

## Svelte CSF — native template story syntax

Stories with `.stories.svelte` extension use Svelte's template syntax:

```svelte
<!-- Button.stories.svelte -->
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';

  const { Story } = defineMeta({
    component: Button,
    args: { label: 'Click', primary: false },
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
  });
</script>

<Story name="Primary" args={{ primary: true }} />

<Story name="Secondary" args={{ primary: false, label: 'Cancel' }} />

<Story name="With children">
  Click me!
</Story>
```

### Custom render with the `template` snippet

```svelte
<Story name="Primary in alert" args={{ primary: true, label: 'Click' }}>
  {#snippet template(args)}
    <Alert>
      Alert text
      <Button {...args} />
    </Alert>
  {/snippet}
</Story>
```

Attach a `template` snippet at the meta level to reuse across stories:

```svelte
<script module>
  const { Story } = defineMeta({
    component: Button,
    render: template,                       // refer to the snippet below
  });
</script>

{#snippet template(args)}
  <Alert>
    Alert text
    <Button {...args} />
  </Alert>
{/snippet}

<Story name="Default in alert" args={{ label: 'Button' }} />
<Story name="Primary in alert" args={{ label: 'Button', primary: true }} />
```

### `asChild` — render only children, ignore meta component

```svelte
<Story name="Default Button in alert" asChild>
  <Alert>
    <Button />
  </Alert>
</Story>
```

⚠️ `asChild` disables Controls — there's no `args` boundary for them to
operate on. Use the `template` snippet pattern instead if you need
both custom layout AND working Controls.

## Plain CSF as an alternative

If you prefer JS-object stories, write `.stories.ts` files using
standard CSF — the framework supports both. Note: the "save story from
Controls" UI feature only works with plain CSF, not Svelte CSF.

## Framework options

```ts
framework: {
  name: '@storybook/svelte-vite',
  options: {
    docgen: true,                  // default — false for faster builds (no auto Controls)
    builder: { /* Vite options */ },
  },
},
```

## Svelte CSF addon options

```ts
addons: [
  {
    name: '@storybook/addon-svelte-csf',
    options: {
      legacyTemplate: false,        // true for backward-compat with v4 `<Template>` (perf cost)
    },
  },
],
```

## Migrating Svelte CSF v4 → v5

Svelte CSF v5 brought several breaking changes. Run automigrate first:

```bash
npx storybook automigrate
```

### Manual migration steps

1. **Replace `<Meta />` / named `meta` export with `defineMeta(...)`**:
   ```diff
   - import { Meta } from '@storybook/addon-svelte-csf';
   + import { defineMeta } from '@storybook/addon-svelte-csf';
   - <Meta title="Button" />
   - export const meta = { title: 'Button', component: Button };
   + const { Story } = defineMeta({ title: 'Button', component: Button });
   ```

2. **Replace `<Template>` with the `template` snippet on `<Story>`**:
   ```diff
   - <Template let:args>
   -   <Alert>
   -     <Button {...args} />
   -   </Alert>
   - </Template>
   - <Story name="Primary" args={{ primary: true }} />
   + <Story name="Primary" args={{ primary: true }}>
   +   {#snippet template(args)}
   +     <Alert>
   +       <Button {...args} />
   +     </Alert>
   +   {/snippet}
   + </Story>
   ```
   Or set `legacyTemplate: true` in addon options temporarily.

3. **Replace `autodocs` with `tags`**:
   ```diff
   - <Story name="Primary" autodocs />
   + <Story name="Primary" tags={['autodocs']} />
   ```
   Same at the meta level — use `tags: ['autodocs']` in `defineMeta`.

4. **Snippets instead of slots** — Svelte 5 deprecates slots. The
   `template` snippet replaces the `default` slot of `<Template>`.

## TypeScript

Use the Svelte for VS Code extension (Volar Svelte mode) for type
inference on `.svelte` files. Run type checks with `svelte-check`.

For typed args in plain CSF:

```ts
import type { Meta, StoryObj } from '@storybook/svelte-vite';
const meta = { component: Button } satisfies Meta<typeof Button>;
type Story = StoryObj<typeof meta>;
```

## Common pitfalls

1. **Stories file ignored**. Make sure `*.stories.svelte` is in your
   `stories` glob.
2. **`<Story asChild>` breaks Controls**. Use `template` snippet instead.
3. **Controls show all props as `text`**. `docgen: false` was set — turn
   it back on (or define `argTypes` manually).
4. **Slot-based component shows no children in story.** With Svelte 5,
   use snippets via the `template` syntax. With Svelte 4, slots work
   directly in `<Template>` blocks.
5. **`<Template>` errors after v5 upgrade**. Either migrate to
   `{#snippet template(args)}` or enable `legacyTemplate: true` in
   addon options.
6. **Compose Svelte stories in unit tests**: portable stories support
   for Svelte is experimental — Svelte CSF doesn't yet support
   `composeStories`. Use plain CSF for portable-stories tests.
