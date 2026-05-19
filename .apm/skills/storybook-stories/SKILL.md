---
name: storybook-stories
description: >
  How to write Storybook stories — the unit of work for everything else in
  Storybook (controls, docs, tests, visual snapshots, MCP manifests). Covers
  Component Story Format (CSF 3 — the current default, with default+named
  exports, `Meta`/`StoryObj` types, `satisfies` operator, `args`, `parameters`,
  `decorators`, `loaders`, `play`, `tags`, `render`, `name`, `id`,
  `includeStories`/`excludeStories`, story spreading and composition), CSF
  Next preview (`defineMain`/`definePreview`/`preview.meta`/`meta.story`/
  `<Story>.extend`/`.test`, full type safety, automatic prop inference,
  `preview.type<{ args }>()` for custom args), Svelte CSF (`defineMeta`,
  `<Story>` component, template snippets, `asChild`, slot/snippet migration
  from Svelte 4 to 5), args (story/component/global level, URL serialization
  with `!hex(...)`, `!date(...)`, `!null`, mapping complex values, `useArgs`
  for controlled stories), argTypes (control type matrix — `boolean`/`number`/
  `range`/`text`/`color`/`date`/`select`/`radio`/`check`/`object`/`file`,
  conditional rendering with `if: { arg, eq, neq, exists, truthy }`,
  `mapping`/`control.labels`/`options`, `table.category`/`subcategory`/
  `defaultValue`/`disable`/`readonly`, `name`, `description`, semantic
  `type` with `SBType`), parameters (story/meta/project levels, deep merging
  rules, `layout`, `options.storySort`, `test.{clearMocks,mockReset,
  restoreMocks,dangerouslyIgnoreUnhandledErrors}`), decorators (story/
  component/global, context object with `args`/`argTypes`/`globals`/`hooks`/
  `parameters`/`viewMode`, parameterized decorators, decorator inheritance
  order, framework-specific notes for Svelte/Vue/React), loaders (async data
  prep before render, `loaded` field on context, global loaders), play
  functions (`canvas` queries from Testing Library, `userEvent`, `expect`,
  `step` grouping, `mount` advanced API, composition across stories), tags
  (`dev`/`manifest`/`test`/`autodocs`/`play-fn`/`test-fn`, custom tags,
  `!tag` removal syntax, `defaultFilterSelection`, sidebar filtering),
  naming + hierarchy (`title`, `/` separators, single-story hoisting, roots,
  permalink `id`, custom `storyName`, `storySort`), multi-component stories
  (`subcomponents`, args reuse, `children` as arg, template components),
  stories for pages/screens (presentational vs connected, args composition,
  `ProfilePageContext` pattern), mocking data and modules (Vite/Webpack
  automocking with `sb.mock`, spy-only / fully automocked / `__mocks__`
  files, subpath imports `#lib/session`, builder aliases, mocking external
  modules like `uuid`/`lodash-es`/`node:fs`, `vi.mocked`/`mocked` typing,
  `beforeEach`/`beforeAll` setup, MSW for network requests with REST and
  GraphQL, mocking React/Solid context providers, `mock-context-container`
  pattern), and writing stories in TypeScript (`Meta<typeof Button>`,
  `StoryObj<typeof meta>`, intersection types for custom args, Vue
  generics, Svelte typed slots, Angular `Partial<T>` inference, Web
  Components `HTMLElementTagNameMap` registration). Use whenever the user
  mentions writing a story, story file, `.stories.ts(x)`, `*.stories.svelte`,
  CSF, args/argTypes/parameters/decorators/loaders/play, "control type",
  Testing Library queries inside a story, `fn()` from `storybook/test`,
  `composeStories` for unit tests, `play function`, "interactive story",
  tags, autodocs, story sorting, story id/permalink, mocking modules in
  stories, MSW addon, mocking providers, `useArgs`, story composition,
  CSF Next factory functions, `preview.meta(...)`, `meta.story(...)`,
  `defineMeta`, Svelte CSF migration, TypeScript story typing.
---

# Storybook Stories

A **story** is a single rendered state of a UI component. You write stories
in plain JavaScript / TypeScript modules using **Component Story Format
(CSF)** — an open standard based on ES6 exports — and Storybook turns
each exported story into:

- a sidebar entry
- a canvas render
- a row in the Controls panel
- a row in the auto-generated docs page
- (with `play`) an interaction test
- (with the Vitest addon) a real Vitest test
- (with Chromatic) a visual baseline
- (with `addon-mcp`) an entry in the AI agent's component manifest

Get the story right and every other Storybook feature compounds. Get it
wrong and you fight the tool. This skill is the comprehensive guide.

## The three flavors of CSF

Storybook supports three story file formats. **CSF 3** is the current
default and what nearly all examples in the official docs show.

| Flavor | When to use | Imports |
| --- | --- | --- |
| **CSF 3** (default, stable) | All new projects unless you opted into CSF Next | `import type { Meta, StoryObj } from '@storybook/<framework>'` |
| **CSF Next** (preview, type-safe factory API; React/Vue/Angular/Web Components only) | New TypeScript-heavy projects that want zero-boilerplate type inference and addon parameter autocompletion | `import preview from '../.storybook/preview'` |
| **Svelte CSF** (community-maintained, Svelte-only) | Svelte projects that prefer template syntax over JS objects | `import { defineMeta } from '@storybook/addon-svelte-csf'` |

You can mix flavors *between* files but **not within a single file**. The
rest of this skill uses CSF 3 unless noted. CSF Next migrations and Svelte
CSF specifics are covered in dedicated sections below.

## File layout

A story file lives next to its component:

```
components/
├── Button/
│   ├── Button.tsx           ← component
│   ├── Button.stories.tsx   ← stories (CSF) or Button.stories.mdx
│   └── Button.module.css
```

Story files are *development only* — they are never bundled into your
production app (your `stories` glob in `.storybook/main.ts` keeps them
isolated to Storybook).

## The anatomy of a CSF 3 file

```ts
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

// --- META (default export) -----------------------------------------------
const meta = {
  // `component` is what enables auto-Controls, auto-docs, the ArgTypes
  // doc block, the Visual Tests addon, and the AI manifest. Specify it.
  component: Button,

  // Optional explicit title. Without this, Storybook derives one from
  // the file path (CSF 3 auto-titles). See "Naming & hierarchy".
  title: 'Components/Button',

  // Default args inherited by every story unless overridden.
  args: {
    primary: false,
    label: 'Click me',
    // `fn()` creates a Vitest mock + spy. It auto-logs to the Actions
    // panel AND is queryable from your play function via `args.onClick`.
    onClick: fn(),
  },

  // Per-arg control overrides. argTypes are usually INFERRED from the
  // component (via react-docgen / vue-component-meta / Compodoc / etc.)
  // and only need to be specified here when you want to override.
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary', 'ghost'] },
  },

  parameters: {
    // Built-in: padded | centered | fullscreen
    layout: 'centered',
    // Per-addon parameters live in their own namespace.
    backgrounds: { value: 'dark' },
    docs: { description: { component: 'A button.' } },
  },

  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],

  // Project-wide implicit tags: `dev`, `manifest`, `test`. Add `autodocs`
  // to generate a Docs page, or custom tags for your own filtering.
  tags: ['autodocs', 'stable'],
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

// --- STORIES (named exports) ---------------------------------------------
export const Primary: Story = { args: { primary: true } };

// Spread to inherit + override.
export const Disabled: Story = {
  args: { ...Primary.args, disabled: true },
};

// Custom render — only when the default "spread args onto component" is
// insufficient (composing extra elements, providing children, etc.).
export const InAlert: Story = {
  args: { primary: true },
  render: (args) => (
    <Alert>
      Alert text
      <Button {...args} />
    </Alert>
  ),
};

// Play function — runs after render. Used by Storybook Test, the
// Interactions panel, and the test-runner.
import { expect, userEvent, within } from 'storybook/test';
export const Clicked: Story = {
  args: { onClick: fn() },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button'));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
```

### `Meta<typeof Button>` and `StoryObj<typeof meta>` — what they buy you

- `Meta<typeof Button>` constrains `args` to the component's prop shape and
  surfaces autocomplete on every argType.
- `satisfies Meta<typeof Button>` (TypeScript 4.9+) is the recommended
  pattern: it gives you the same constraint **plus** preserves the literal
  type of `meta.args` so that `StoryObj<typeof meta>` can infer "every
  required prop is already provided in meta.args" and stop complaining
  about missing required args on individual stories.
- `StoryObj<typeof meta>` then types `args`, `parameters`, the `render`
  function signature, the `play` function context, and any decorator
  context for every story.

If you have **custom args** (props not on the underlying component, like
slots or a "footer" arg used in the page), use an intersection:

```ts
type Props = ButtonProps & { footer?: ReactNode };
const meta = { component: Button } satisfies Meta<Props>;
```

Without `satisfies`, you can still type stories with the older pattern
(`const meta: Meta<typeof Button> = { ... }`), but you lose the "args
inheritance" type inference and have to mark args optional on every
story.

## Args

Args are the **data you pass to a story**. They are JSON-serializable
key/value pairs that map to your component's props/inputs/slots.

| Level | Where defined | Applied to |
| --- | --- | --- |
| **Story args** | `args` on a named export | That story only |
| **Component args** | `args` on the default export | Every story in the file (overridable) |
| **Global args** | `args` on the project preview default export | Every story in the project (overridable) |

```ts
// .storybook/preview.ts
import type { Preview } from '@storybook/react-vite';
const preview: Preview = {
  args: { theme: 'light' },   // applied to every story everywhere
};
export default preview;
```

### Args spreading & composition

```ts
const meta = { component: Button, args: { label: 'Hi', disabled: false } };
export const Primary = { args: { primary: true } };
// Inherit Primary.args, override one key:
export const PrimaryDisabled = { args: { ...Primary.args, disabled: true } };
// Inherit from a child component's story (composition):
import * as ButtonStories from '../Button/Button.stories';
export const Pair = {
  args: { leftLabel: ButtonStories.Primary.args.label, rightLabel: 'No' },
};
```

For **CSF Next**, the equivalent of `...Primary.args` is `...Primary.composed.args`
(see [CSF Next section](#csf-next-preview)).

### Args via the URL

Args can be set directly in the URL — handy for sharing a specific state:

```
?path=/story/components-avatar--default&args=size:64;style:rounded;label:!null
```

Rules:

- Format is `key:value;key:value` (semicolon-separated; URL-safe characters only).
- For XSS safety, **keys and values are restricted to alphanumerics + space +
  underscore + dash**. Anything else is silently dropped from the URL but is
  still settable from the Controls panel.
- Special encodings: `!null` for `null`, `!undefined` for `undefined`,
  `!hex(ff0000)` for colors, `!rgba(255,0,0,0.5)`, `!hsla(0,100%,50%,0.5)`,
  `!date(2026-05-18)` for Date objects.
- Nested paths: `obj.key:val;arr[0]:one;arr[1]:two`.
- URL args **extend and override** the story's defaults — they don't replace
  the whole args object.

### Controlled stories: `useArgs`

When a story needs to *react to its own args* (a controlled input that
should show its new value as the user types), use the `useArgs` hook from
`storybook/preview-api`:

```tsx
// Only available for renderers with hooks (React, Vue, Solid).
import { useArgs } from 'storybook/preview-api';

export const Controlled: Story = {
  args: { value: '' },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs();
    return <input value={value} onChange={(e) => updateArgs({ value: e.target.value })} />;
  },
};
```

**Critical rule for React**: do **not** mix React's `useState` / `useEffect`
/ `useRef` with `useArgs` (or any other `storybook/preview-api` hook) in
the same render function. The two hook systems share a fiber but
Storybook's hook context doesn't propagate through React's side-effects,
which causes "Invalid hook call" errors on rerender. Use Storybook's
equivalents (`useState`, `useEffect`, `useRef` from `storybook/preview-api`)
or move state into a wrapper component outside the render function.

### Mapping complex args

Non-serializable values (JSX elements, class instances) can't be sent
across the manager↔preview channel. Map them through a string key:

```ts
argTypes: {
  icon: {
    options: ['none', 'arrow', 'cart', 'star'],
    mapping: { none: null, arrow: <ArrowIcon/>, cart: <CartIcon/>, star: <StarIcon/> },
    control: { type: 'select', labels: { none: '— none —' } },
  },
},
```

`mapping` doesn't have to be exhaustive — anything missing from
`mapping` is used verbatim.

## argTypes — the control schema

`argTypes` are per-arg metadata: how to render the control, how to
document the prop, what semantic type it is, when to show/hide it.
Storybook **automatically infers them** from your `component` prop:

| Renderer | Inference tool |
| --- | --- |
| React | `react-docgen` (fast, default) or `react-docgen-typescript` (slower, more accurate) |
| Vue | `vue-docgen-api` (or `vue-component-meta` opt-in for full SFC/script-setup support) |
| Angular | Compodoc (`compodoc: true` in `angular.json`) |
| Svelte | JSDoc + svelte-language-tools |
| Web Components | `custom-elements.json` from `@custom-elements-manifest/analyzer` |
| Ember | `@storybook/ember-cli-storybook` adapter + `storybook-docgen/index.json` |

Inferred argTypes are merged with anything you specify; your values win.

### Control types — full matrix

| Data type | Control | Example |
| --- | --- | --- |
| `boolean` | `boolean` | `{ control: 'boolean' }` |
| `number` | `number` | `{ control: { type: 'number', min: 1, max: 30, step: 2 } }` |
| `number` | `range` | `{ control: { type: 'range', min: 1, max: 30, step: 3 } }` |
| `string` | `text` | `{ control: 'text' }` |
| `string` (color) | `color` | `{ control: { type: 'color', presetColors: ['red','#0f0','rgb(0,0,255)'] } }` |
| `string` (date) | `date` | `{ control: 'date' }` (⚠ returns a UNIX timestamp on change, not a Date object — convert in your render) |
| `enum` | `radio` | `{ control: 'radio', options: ['s','m','l'] }` |
| `enum` | `inline-radio` | inline version of `radio` |
| `enum` | `select` | `{ control: 'select', options: [10,20,30,40] }` |
| `enum` (multi) | `check` | `{ control: 'check', options: ['a','b','c'] }` |
| `enum` (multi) | `inline-check` | inline version |
| `enum` (multi) | `multi-select` | dropdown |
| `object`/`array` | `object` | `{ control: 'object' }` — JSON editor |
| `file` | `file` | `{ control: { type: 'file', accept: '.png,.jpg' } }` — returns array of object URLs |

Set `control: false` to **hide a control but keep documenting the prop**.
Use `table.disable: true` to **also hide it from the docs table**.

### Per-prop annotations

```ts
argTypes: {
  variant: {
    description: 'Visual variant of the button.',
    options: ['primary', 'secondary', 'ghost'],
    control: 'radio',
    table: {
      category: 'Appearance',
      subcategory: 'Style',
      defaultValue: { summary: 'primary', detail: 'The brand color' },
      type: { summary: 'string', detail: '"primary" | "secondary" | "ghost"' },
    },
    name: 'Visual variant',                  // display name in the Controls table
    type: { name: 'enum', value: ['primary','secondary','ghost'], required: true },
  },
},
```

> Renaming with `name` is purely cosmetic for the Controls panel — users
> still pass the *prop name* (`variant`) to the component. Use `name`
> when documenting a synthetic arg (e.g., an MDX-only arg) so the
> displayed label can be human-readable.

### Conditional controls (`if`)

Show/hide a control based on another arg or global:

```ts
argTypes: {
  // Show `placeholder` only when `disabled` is falsy:
  placeholder: { control: 'text', if: { arg: 'disabled', truthy: false } },
  // Show `tooltip` only when `size === 'large'`:
  tooltip: { control: 'text', if: { arg: 'size', eq: 'large' } },
  // Hide when the global theme is 'simple':
  shadow: { control: 'boolean', if: { global: 'theme', neq: 'simple' } },
}
```

Available operators: `truthy`, `exists`, `eq`, `neq`. Default (no
operator) is equivalent to `{ truthy: true }`.

### Custom regex matchers

In `.storybook/preview.ts`, use `controls.matchers` to auto-assign a
control type by prop name:

```ts
// .storybook/preview.ts
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,   // any prop ending in "color" / "background"
        date: /Date$/,                    // any prop ending in "Date"
      },
    },
  },
};
```

The CLI installs these defaults for new projects.

### Filtering, sorting, expanded mode

```ts
// .storybook/preview.ts (project-level)
parameters: {
  controls: {
    expanded: true,                                 // show description + default columns
    sort: 'requiredFirst',                          // 'none' | 'alpha' | 'requiredFirst'
    exclude: ['ref', /^aria/],                     // hide certain props
    // include: ['variant', 'size'],               // OR allowlist only
    disableSaveFromUI: false,                       // disable "save as new story" UI
    presetColors: ['#ff0000', { color: '#0000ff', title: 'Brand blue' }],
  },
},
```

## Parameters

Parameters are **static metadata** about a story — used to configure
addons and Storybook features. They merge from project → meta → story,
with deep merging for objects (arrays are overwritten).

```ts
// Story-level
export const X: Story = { parameters: { layout: 'fullscreen' } };

// Meta-level
const meta = { parameters: { backgrounds: { default: 'dark' } } } satisfies Meta<typeof X>;

// Project-level (preview.ts)
const preview: Preview = { parameters: { layout: 'centered' } };
```

### First-class Storybook parameters

| Parameter | Type | Notes |
| --- | --- | --- |
| `layout` | `'centered' \| 'fullscreen' \| 'padded'` | Canvas layout. Default `'padded'`. |
| `options.storySort` | `StorySortConfig \| StorySortFn` | Project-level only. See "Naming & hierarchy". |
| `test.clearMocks` | `boolean` | Run `.mockClear()` on `fn()` spies on unmount. Default `false`. |
| `test.mockReset` | `boolean` | Run `.mockReset()` on `fn()` spies on unmount. Default `false`. |
| `test.restoreMocks` | `boolean` | Run `.restoreMocks()` on `fn()` spies on unmount. Default **`true`**. |
| `test.dangerouslyIgnoreUnhandledErrors` | `boolean` | Stop the play function from failing when an unhandled error fires. |

All other parameters are contributed by addons or features:
`backgrounds`, `viewport`, `actions`, `controls`, `docs`, `a11y`,
`measure`, `outline`, `highlight`, `nextjs`, `tanstack`,
`sveltekit_experimental`, `msw`, `chromatic`, etc. — see the matching
sibling skill.

## Decorators

Decorators wrap a story in extra rendering — providers, padding,
theme contexts, mock routers. Three levels (story / component /
global), and they run **outer to inner** (global first, then meta,
then story).

```tsx
// Story-level (CSF 3)
export const Padded: Story = {
  decorators: [(Story) => <div style={{ padding: 16 }}><Story /></div>],
};

// Meta-level
const meta = {
  component: Button,
  decorators: [withTheme],
} satisfies Meta<typeof Button>;

// Project-level (preview.ts)
const preview: Preview = {
  decorators: [(Story) => <ThemeProvider><Story /></ThemeProvider>],
};
```

### Decorator context

The second argument to a decorator is the **story context**:

```ts
(Story, context) => {
  context.args        // resolved story args
  context.argTypes    // resolved argTypes
  context.globals     // current globals (toolbar values)
  context.parameters  // merged parameters
  context.viewMode    // 'story' | 'docs'
  context.hooks       // useArgs(), useGlobals() etc. — Storybook's hook context
}
```

Use the context to make decorators react to story metadata:

```tsx
// Decorator reads a parameter to pick a layout:
export const decorators = [
  (Story, { parameters }) => {
    const layout = parameters.pageLayout ?? 'app';
    return <Layout type={layout}><Story /></Layout>;
  },
];

// Then in a story:
export const Mobile: Story = { parameters: { pageLayout: 'mobile' } };
```

### Reactive globals & hooks (framework-specific notes)

- **Vue**: pass globals through `setup()` and use `computed()` for derived
  reactivity. Plain reads inside the template won't react to global
  changes.
- **React**: do **not** mix React hooks with Storybook hooks in the same
  render function (see [Controlled stories](#controlled-stories-useargs)).

### Providing data via decorators

The recommended pattern for connected components is to pass mocked data
through a context-provider decorator, so the component itself can stay
unchanged:

```tsx
// preview.ts
import { MockApolloProvider } from '../test/MockApolloProvider';
const preview: Preview = {
  decorators: [(Story) => <MockApolloProvider><Story /></MockApolloProvider>],
};
```

See [Mocking providers](#mocking-providers) below for the full pattern.

## Loaders

Loaders are **async functions that run before render** and inject
their result into the `context.loaded` object. They are an "escape
hatch" — args are the preferred way to pass data into a story.

```ts
export const RemoteData: Story = {
  loaders: [
    async () => ({ todo: await fetch('/api/todo/1').then((r) => r.json()) }),
  ],
  render: (args, { loaded: { todo } }) => <TodoItem {...todo} {...args} />,
};
```

Loader inheritance: all loaders run in parallel; later results override
earlier ones (project < meta < story). Set them globally in
`preview.ts` via the `loaders` export.

## Play functions

A play function is a small async snippet that runs after the story
renders. It's how Storybook Test executes interaction tests, and it
powers the Interactions panel in the UI.

```ts
import { expect, fn, userEvent, within } from 'storybook/test';

export const SubmitsForm: Story = {
  args: { onSubmit: fn() },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'a@b.c');
    await userEvent.type(canvas.getByLabelText('Password'), 'hunter2');
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ email: 'a@b.c', password: 'hunter2' });
  },
};
```

`canvas` is a scoped Testing Library instance (queries are limited to
the story root). To query the whole document (e.g. portaled
dialogs/popovers), use `screen` from `storybook/test`.

**Always `await`** every `userEvent.*` and `expect(...)` call. Without
`await`, the Interactions panel can't log the step and timing-based
tests become flaky.

Group related interactions with `step`:

```ts
play: async ({ canvas, step }) => {
  await step('Fill in the form', async () => {
    await userEvent.type(canvas.getByLabelText('Email'), 'a@b.c');
  });
  await step('Submit', async () => {
    await userEvent.click(canvas.getByRole('button'));
  });
},
```

For advanced setup that has to happen *before* the component renders,
use `mount` (destructured from the play context). See
`storybook-testing` for the full play-function reference (mount,
beforeAll, beforeEach, afterEach, mocking, fn spies, asserting on
mocked modules, accessibility integration).

## Tags

Tags are static strings attached to a story / meta / project that
control what Storybook does with the story.

### Built-in tags

| Tag | Default | What it does |
| --- | --- | --- |
| `dev` | applied | Story appears in the sidebar |
| `manifest` | applied | Story is included in the AI MCP manifest (React-only) |
| `test` | applied | Story runs under Vitest addon / test-runner |
| `autodocs` | not applied | A Docs page is generated for the component |
| `play-fn` | auto | Applied automatically to any story with a `play` |
| `test-fn` | auto | Applied to tests defined with the experimental `.test` CSF Next method |

### Custom tags

```ts
const meta = { tags: ['stable'] } satisfies Meta<typeof Button>;
export const Experimental: Story = { tags: ['experimental'] };
```

**Remove a tag** by prefixing with `!`:

```ts
// Hide a docs-only story from the dev sidebar:
export const ApiReference = { tags: ['autodocs', '!dev'] };
// Hide an experimental story from being tested:
export const NotReady = { tags: ['!test'] };
```

### Configure tag behavior in `main.ts`

```ts
// .storybook/main.ts
export default defineMain({
  // ...
  tags: {
    experimental: { defaultFilterSelection: 'exclude' },
  },
});
```

`defaultFilterSelection: 'exclude'` makes `experimental`-tagged stories
hidden by default in the sidebar filter menu (users can opt in).

### Sidebar filtering

The Storybook sidebar has a filter menu where users can include/exclude
by tag. Filters apply *before* search.

### Useful recipes

- **Docs-only story** (only in docs, not in dev sidebar):
  ```ts
  export const Showcase = { tags: ['autodocs', '!dev'] };
  ```
- **Combo grid for docs but individual tests**:
  ```ts
  export const Combo = { tags: ['autodocs', '!test'], render: () => <AllVariants /> };
  export const Primary = { args: { variant: 'primary' } };  // tested individually
  ```

## Naming and hierarchy

```
Components/         ← category (root)
  Forms/            ← folder (group)
    Button/         ← component
      Default       ← story
      Disabled
      Docs          ← autodocs page (if enabled)
```

### Explicit titling

```ts
const meta = { title: 'Components/Forms/Button', component: Button };
```

The `title` must be **statically analyzable** (no template literals,
variables, or function calls) — Storybook reads it at build time.

### Implicit titling (CSF 3 auto-title)

Omit `title` and Storybook derives it from the file path relative to your
`stories` glob:

```ts
stories: [{ directory: '../src/components', titlePrefix: 'Components' }]
// src/components/forms/Button.stories.ts → "Components/forms/Button"
```

Heuristics (since 6.5):

- File-name case is preserved (no startCase).
- Redundant filenames are collapsed: `components/MyComponent/MyComponent.stories.ts`
  → `Components/MyComponent` (not `Components/MyComponent/MyComponent`).
- `index.stories.ts` is treated the same as the directory name.

Revert to legacy startCase behavior with `sidebar.renderLabel` in
`.storybook/manager.ts`.

### Single-story hoisting

A component with one story whose display name matches the component name
gets hoisted: instead of appearing as `Button › Button`, it shows as just
`Button`. Disable by giving the story a different name.

### Permalinks (`id`)

Storybook generates IDs like `components-button--primary` from
`title + exportName`. To stabilize a URL through renames:

```ts
const meta = { title: 'OtherFoo/Bar', id: 'foo-bar' };
export const Moo = { name: 'Moo', /* but id stays foo-bar--baz */ };
```

### Sorting (project-level)

```ts
// .storybook/preview.ts
const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',            // 'alphabetical' | 'alphabetical-by-kind' | 'custom'
        order: ['Intro', 'Pages', ['Home', 'Login', '*'], 'Components', '*', 'WIP'],
        includeNames: false,
        locales: 'en-US',
      },
    },
  },
};

// Or a custom function:
options: {
  storySort: (a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }),
},
```

`order` accepts nested arrays (sorts 2nd-level groups) and `'*'` (a
catch-all wildcard).

### Disable category roots

By default the top-level node renders as a "root" (uppercase, not
collapsible). Disable in `.storybook/manager.ts`:

```ts
import { addons } from 'storybook/manager-api';
addons.setConfig({ sidebar: { showRoots: false } });
```

## Stories for multiple components

When two components are designed together (`List`/`ListItem`,
`Tabs`/`TabPanel`, `Card`/`CardHeader`), document them on a single page:

```ts
const meta = {
  component: List,
  subcomponents: { ListItem },     // shows up as a tab in ArgTypes/Controls
} satisfies Meta<typeof List>;

export const Filled: Story = {
  render: (args) => (
    <List>
      <ListItem>Item 1</ListItem>
      <ListItem>Item 2</ListItem>
    </List>
  ),
};
```

Subcomponents are documentation-only:
- Their argTypes are *inferred* and can't be overridden.
- The Controls panel only edits args of the main `component`.

### Reuse story data across components

```ts
import * as ListItemStories from '../ListItem/ListItem.stories';
export const Reused: Story = {
  render: () => (
    <List>
      {[ListItemStories.Checked.args, ListItemStories.Unchecked.args].map((args, i) => (
        <ListItem key={i} {...args} />
      ))}
    </List>
  ),
};
```

### "Template component" pattern

For complex composite components, define a thin wrapper that turns args
into JSX, then export many stories with different args:

```tsx
// Story-generating template
const Template = ({ items, ...rest }) => (
  <List {...rest}>
    {items.map((it) => <ListItem key={it.id} {...it} />)}
  </List>
);

const meta = { component: Template, args: { items: [] } } satisfies Meta<typeof Template>;
export const Empty = {};
export const Filled = { args: { items: [{ id: 1, text: 'A' }, { id: 2, text: 'B' }] } };
```

This lets all args show up in Controls, and you don't repeat the JSX in
every story's render function.

### `children` as an arg (React-only)

Pulling children out as an arg lets you preview a component with
different content from Controls:

```ts
argTypes: {
  children: { control: 'text' },
},
args: { children: 'Default text' },
```

Caveats:
- `children` must be JSON-serializable — strings work, JSX nodes don't.
- Use `mapping`/`control.labels` to map a string key to JSX in the
  render function.
- Be careful with third-party libraries that override `children`.

## Stories for pages and screens

### Presentational pages (recommended)

Push all data fetching / business logic to a single wrapper component
outside Storybook (e.g., `ProfilePageContainer` lives in your app;
`ProfilePage` is what you write stories for). The page becomes a pure
function of props, args composition just works, Controls behave
predictably.

### Args composition for pages

```ts
import * as HeaderStories from '../Header/Header.stories';
import * as ListStories from '../List/List.stories';

export const Full: Story = {
  args: {
    ...HeaderStories.LoggedIn.args,
    items: ListStories.WithItems.args.items,
  },
};
```

### Connected components — the `ProfilePageContext` pattern

For React projects where you can't fully separate the container, lift
container components into a React context so stories can swap them
for mocked counterparts:

```tsx
// ProfilePageContext.tsx
import { createContext } from 'react';
import { UserProfile } from './UserProfile';
import { ActivityFeed } from './ActivityFeed';

export const ProfilePageContext = createContext({ UserProfile, ActivityFeed });

// ProfilePage.tsx
function ProfilePage() {
  const { UserProfile, ActivityFeed } = useContext(ProfilePageContext);
  return <><UserProfile /><ActivityFeed /></>;
}

// In a story:
const meta = {
  component: ProfilePage,
  decorators: [
    (Story) => (
      <ProfilePageContext.Provider value={{ UserProfile: MockUserProfile, ActivityFeed: MockActivityFeed }}>
        <Story />
      </ProfilePageContext.Provider>
    ),
  ],
};
```

For "global" containers used on every page, set up a
`GlobalContainerContext` decorator in `preview.tsx`.

## Mocking data and modules

Storybook supports three layered mocking approaches: **module mocking**
(spy on or replace imports), **network mocking** (intercept `fetch`/
GraphQL with MSW), and **provider mocking** (wrap stories in a
mocked-context decorator). Use the right tool for the level you're
working at.

### Automocking — the recommended approach (Vite & Webpack)

In `.storybook/preview.ts`, register modules with `sb.mock(...)`:

```ts
// .storybook/preview.ts
import { sb } from 'storybook/test';

sb.mock(import('../lib/session.ts'),     { spy: true });   // spy-only
sb.mock(import('uuid'),                  { spy: true });
sb.mock(import('../lib/payment.ts'));                       // full automock (default)
sb.mock(import('../lib/audit-trail.ts'));                   // uses __mocks__/audit-trail.ts if present
```

Rules:
- Mocks can **only** be registered in `.storybook/preview.*`. You cannot
  call `sb.mock()` inside a story file.
- Path must be relative, include the file extension, and not use an alias.
- `spy: true` keeps the real implementation but lets you assert calls.
- Default (`spy: false`) replaces all exports with Vitest mock functions
  (the module is still *evaluated*, so any top-level side effects still
  fire — use a `__mocks__` file if you need to prevent evaluation).
- **Webpack caveat**: automocking only works for `node_modules` packages
  that ship ESM exclusively. For CJS-only packages, use a `__mocks__`
  file instead.

### Using a mocked module in stories

```ts
import * as session from '../lib/session';   // resolves to the mocked version
import { mocked } from 'storybook/test';      // typed wrapper around vi.mocked

export const LoggedIn: Story = {
  beforeEach: async () => {
    mocked(session.getUserFromSession).mockReturnValue({ name: 'Jane' });
  },
};

export const LoggedOut: Story = {
  beforeEach: async () => {
    mocked(session.getUserFromSession).mockReturnValue(null);
  },
};

// Assert in a play function:
export const Saves: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText('Save'));
    await expect(mocked(session.saveNote)).toHaveBeenCalledWith(/* ... */);
  },
};
```

Common spy methods: `mockReturnValue(v)`, `mockResolvedValue(v)`,
`mockRejectedValue(e)`, `mockImplementation(fn)`.

### `__mocks__` files (the "no side effects" mock)

When automocking would still evaluate problematic code (Node-only
imports, network calls at module load), provide a hand-written mock:

```
src/lib/
├── session.ts
└── __mocks__/
    └── session.ts          ← used when sb.mock(import('../lib/session.ts')) is registered
```

```ts
// src/lib/__mocks__/session.ts
import { fn } from 'storybook/test';
import type * as actual from '../session';
export const getUserFromSession = fn<typeof actual.getUserFromSession>()
  .mockName('getUserFromSession')
  .mockReturnValue({ name: 'Mocked User' });
```

For **npm packages**, the `__mocks__` directory goes at the project root
(`./__mocks__/uuid.ts`). For deep imports like `lodash-es/add`, mirror the
nested path: `./__mocks__/lodash-es/add.ts`.

> Mock files must be JS-or-TS ESM, and must export the same named
> exports as the original module.

### Subpath imports — Node's standard alternative

If you can edit your import statements, Node 16.10+ subpath imports give
you build-system-agnostic mocking:

```json
// package.json
{
  "imports": {
    "#lib/session": {
      "storybook": "./src/lib/session.mock.ts",
      "test": "./src/lib/session.mock.ts",
      "default": "./src/lib/session.ts"
    }
  }
}
```

Then in component code:

```ts
// AuthButton.tsx
import { getUserFromSession } from '#lib/session';   // resolves per `imports` map
```

Storybook applies the `"storybook"` condition automatically. Requires
`tsconfig` `moduleResolution: "Bundler"`, `"NodeNext"`, or `"Node16"`.

### Builder aliases (last resort)

If neither automocking nor subpath imports fit, alias the module in your
builder config. See `storybook-builders` for the syntax.

### Mocking network requests with MSW

Use the [`msw-storybook-addon`](https://storybook.js.org/addons/msw-storybook-addon/)
for REST and GraphQL:

```bash
# Install
npm install --save-dev msw msw-storybook-addon
# Generate the service worker file in /public
npx msw init public/ --save
```

```ts
// .storybook/preview.ts
import { initialize, mswLoader } from 'msw-storybook-addon';
initialize();

const preview = {
  loaders: [mswLoader],
  parameters: {
    msw: { handlers: [] },     // default: no mocks
  },
};
export default preview;
```

REST handlers per story:

```ts
import { http, HttpResponse } from 'msw';

export const Success: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/document/:id', () => HttpResponse.json({ title: 'Hello' })),
      ],
    },
  },
};

export const NotFound: Story = {
  parameters: {
    msw: {
      handlers: [http.get('/api/document/:id', () => new HttpResponse(null, { status: 404 }))],
    },
  },
};
```

GraphQL handlers:

```ts
import { graphql, HttpResponse } from 'msw';

parameters: {
  msw: {
    handlers: [
      graphql.query('GetDocument', () =>
        HttpResponse.json({ data: { document: { id: '1', title: 'Hi' } } })),
    ],
  },
},
```

Because `msw` is configured via parameters, you can set common handlers
at the project or meta level and override per story.

### Mocking providers (React / Preact / Solid)

Wrap stories in a decorator that injects mocked context:

```tsx
// .storybook/preview.tsx
import { ThemeProvider } from 'styled-components';
const preview = {
  decorators: [
    (Story, { parameters }) => (
      <ThemeProvider theme={parameters.theme === 'dark' ? darkTheme : lightTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};
```

Then per story:

```ts
export const Dark: Story = { parameters: { theme: 'dark' } };
export const Light: Story = { parameters: { theme: 'light' } };
```

The same pattern works for Redux, React Query, Apollo, Bits UI, Vuetify,
Angular Material themes, etc. Provider mocking is *only meaningful for
JSX-based renderers* (React, Preact, Solid).

### Lifecycle hooks for mocking

| Hook | Where | When it runs |
| --- | --- | --- |
| `beforeAll` | `.storybook/preview.ts` | Once per test run, before any stories. Returns a cleanup function. Best for bootstrap. |
| `beforeEach` | `.storybook/preview.ts`, meta, or story | Before each story render. Returns a cleanup function. Best for per-story setup. |
| `afterEach` | `.storybook/preview.ts`, meta, or story | After each story renders + play finishes. Best for post-render assertions. **Don't** use for state cleanup — use `beforeEach`'s returned cleanup instead. |

`fn()` mocks are restored automatically before each story (via
`parameters.test.restoreMocks: true` by default). You only need to
restore `mockdate` etc. manually.

## Writing stories in TypeScript

```ts
// Recommended — satisfies + StoryObj<typeof meta>
const meta = {
  component: Button,
  args: { primary: false },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = { args: { primary: true } };
```

### Custom args (intersection)

```ts
type Args = ComponentProps<typeof Page> & { footer?: ReactNode };
const meta = { component: Page } satisfies Meta<Args>;
type Story = StoryObj<typeof meta>;
```

### Vue specifics

- `<script setup lang="ts">` with `defineProps<{...}>()` + `defineEmits<{...}>()`
  is fully understood by `vue-component-meta` for type-correct Controls.
- CSF Next supports generic Vue components: pass the type parameter
  directly to the component reference:
  ```ts
  const meta = preview.meta({ component: GenericList<{ id: number; name: string }> });
  ```

### Svelte specifics

- Native Svelte CSF (`<Story name="..." args={{...}} />`) types args
  through `defineMeta`. Plain CSF works too.
- Story `name` is also used as the export name unless you set `exportName`.

### Angular specifics

- CSF 3 has basic TS support but doesn't infer component types.
- CSF Next infers types but they're `Partial<T>` (required props aren't
  enforced). Use `preview.type<{ args: MyProps }>().meta({ ... })` to
  enforce them.

### Web Components specifics

- CSF 3 provides only basic typing (no generics on `Meta`/`StoryObj`).
- CSF Next can infer types **if** the element is declared in the global
  `HTMLElementTagNameMap`:
  ```ts
  declare global {
    interface HTMLElementTagNameMap { 'my-element': MyElement }
  }
  ```

## CSF Next (preview)

CSF Next is an evolution of CSF 3 that uses **factory functions** for
full type inference. Currently in preview for React, Vue, Angular, and
Web Components.

### Setup — three files

```ts
// .storybook/main.ts
import { defineMain } from '@storybook/react-vite/node';
export default defineMain({
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
});
```

```ts
// .storybook/preview.tsx
import { definePreview } from '@storybook/react-vite';
import addonA11y from '@storybook/addon-a11y';

export default definePreview({
  addons: [addonA11y()],                    // addon types flow through!
  parameters: { a11y: { options: { xpath: true } } },   // type-checked
});
```

```ts
// Button.stories.ts
import preview from '../.storybook/preview';
import { Button } from './Button';

const meta = preview.meta({
  component: Button,
  parameters: { layout: 'centered' },
});

export const Primary = meta.story({ args: { primary: true } });

// Extend a story:
export const PrimaryDisabled = Primary.extend({ args: { disabled: true } });

// Reuse args from another story (note the new `composed` namespace):
export const Variant = meta.story({
  args: { ...Primary.composed.args, variant: 'ghost' },
});
```

`.extend(...)` merging rules:
- `args` are **shallow-merged**.
- `parameters` are **deep-merged** except arrays (replaced).
- `decorators` and `tags` are **concatenated**.

### Custom arg types in CSF Next

```ts
type CustomProps = ComponentProps<typeof Button> & { customProp: string };
const meta = preview.type<{ args: CustomProps }>().meta({
  component: Button,
  render: ({ customProp, ...args }) => <>{customProp}<Button {...args} /></>,
});
```

### Tests with `.test` (experimental)

Requires `features.experimentalTestSyntax: true` in `main.ts`. A
more ergonomic alternative to play-function-as-test:

```ts
const Disabled = Primary.extend({ args: { disabled: true } });

Disabled.test('does not fire onClick', async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole('button'));
  await expect(args.onClick).not.toHaveBeenCalled();
});
```

### Reusing CSF Next stories in tests — no `composeStories` needed

```ts
import * as stories from './Button.stories';
const { Primary } = stories;   // already a runnable story

await Primary.run();           // mounts + runs lifecycle hooks
expect(screen.getByText('Click me')).toBeInTheDocument();
```

Each story exposes `.run()`, `.Component`, `.composed.args`,
`.composed.parameters`, `.composed.beforeAll`.

### Vitest setup file with CSF Next

```ts
// vitest.setup.ts
import { beforeAll } from 'vitest';
import preview from './.storybook/preview';
beforeAll(preview.composed.beforeAll);
```

(That's it — no `setProjectAnnotations` wiring needed.)

### Migrating CSF 3 → CSF Next

```bash
npx storybook automigrate csf-factories
# For monorepos:
npx storybook automigrate csf-factories --config-dir packages/ui/.storybook
```

Manual migration steps are documented at
`sources/storybook/docs/api/csf/csf-next.mdx`. Old CSF files keep
working — you can adopt CSF Next file by file.

## Svelte CSF (template-syntax stories)

If the project is Svelte, the community-maintained
[`@storybook/addon-svelte-csf`](https://github.com/storybookjs/addon-svelte-csf)
lets you author stories with Svelte's native template syntax. It's
auto-installed by the CLI for Svelte/SvelteKit projects since
Storybook 8.2.

### Basic example

```svelte
<!-- Button.stories.svelte -->
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';

  const { Story } = defineMeta({
    component: Button,
    args: { label: 'Click' },
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
  });
</script>

<Story name="Primary" args={{ primary: true }} />
<Story name="With children">
  Button text as children
</Story>
```

### Custom render via snippet

```svelte
<Story name="In alert" args={{ primary: true }}>
  {#snippet template(args)}
    <Alert>
      Alert text
      <Button {...args} />
    </Alert>
  {/snippet}
</Story>
```

You can also attach a `template` snippet to `defineMeta` to reuse across
stories.

### `asChild` — render only the children, ignore the meta component

```svelte
<Story name="Default Button in alert" asChild>
  <Alert>
    <Button />
  </Alert>
</Story>
```

> `asChild` disables args-based features (Controls won't work) because
> the rendered tree is your raw children, not the meta component.

### Migration from Svelte CSF v4 → v5

- Replace `<Meta />` / named `meta` export with `defineMeta(...)`.
- Replace `<Template let:args>` blocks with the `template` snippet on
  `<Story>` (or set `legacyTemplate: true` in the addon options as a
  temporary back-compat).
- `<Story autodocs />` → `<Story tags={['autodocs']} />`.

See `storybook-frameworks` (Svelte/SvelteKit section) for the full
migration walkthrough.

## Includes / excludes / non-story exports

Mix stories and non-story exports (mocked data, helper functions) in the
same file by configuring `includeStories` / `excludeStories`:

```ts
const meta = {
  component: List,
  includeStories: /^[A-Z]/,           // anything UpperCamelCase is a story
  // or: excludeStories: ['mockData', /Helper$/],
} satisfies Meta<typeof List>;

export const mockData = [{ id: 1 }, { id: 2 }];   // not a story
export const Default = { args: { items: mockData } };  // story
```

Storybook's recommended convention is to start story exports with an
uppercase letter and non-stories with lowercase.

## Story id, export name, and display name

| Mechanism | Affects | Example |
| --- | --- | --- |
| Named export | Story ID, URL, default display name | `export const Primary = {...}` → id `button--primary` |
| `name` property | Display name in the sidebar | `Primary.name = 'Primary Variant'` |
| `id` on meta | Stable URL through renames | `meta.id = 'button-v2'` |
| `exportName` (Svelte CSF only) | Underlying export when `name` clashes | `<Story name="Primary!" exportName="PrimaryExclamation" />` |

Use `name` when:
- You want emoji, special chars, or reserved keywords ("default") as the
  display name.
- You want to rename without breaking permalinks.

## Common gotchas

1. **"My required args are missing" TS error.** Use `satisfies Meta<typeof Component>`
   on the meta. Without it, TS doesn't know your meta `args` provide the
   required ones, so it complains on every story that omits them.
2. **`useArgs()` errors with "Invalid hook call".** You're calling React's
   `useState`/`useEffect`/etc. in the same render function as a Storybook
   hook. Replace them with the equivalents from `storybook/preview-api`,
   or move state out of the story's `render` into a wrapper component.
3. **Actions panel logs the same event twice.** You have both
   `actions.argTypesRegex` and `fn()` on the same arg. Use `fn()` and
   delete the regex — `argTypesRegex`-bound spies are NOT queryable in
   your play function.
4. **`fn()` arg loses its spy state between stories.** Storybook
   restores `fn()` mocks before each story by default
   (`parameters.test.restoreMocks: true`). To preserve calls across
   stories, set `restoreMocks: false` at the meta level.
5. **My mocks aren't typed correctly.** Use `mocked()` from `storybook/test`
   instead of accessing the raw module — it preserves the original
   signature with `MockedFunction<T>` overlay.
6. **CSF 3 story spread doesn't merge deeply.** `args: { ...Primary.args }`
   is shallow. For nested objects, spread each level explicitly or use
   CSF Next's `.extend(...)` (which deep-merges parameters but still
   shallow-merges args by design).
7. **Svelte stories using `asChild` lose Controls.** That's by design —
   Controls need an `args` boundary to know what to wire up. Use a
   `template` snippet instead.
8. **Auto-title generates the wrong path.** Check that your `stories`
   glob in `main.ts` uses `directory` + `titlePrefix` (object form), not
   just a plain glob string. With a glob, titles are derived from the
   first `**/` matched.
9. **Web Components Controls are all `text`.** You need a
   `custom-elements.json` manifest and have to register it in
   `preview.ts` via `setCustomElementsManifest(...)`. See
   `storybook-frameworks` → Web Components.
10. **Story export named `default`** breaks because `default` is the
    meta. Use any other name and set `name: 'Default'` for display.

## See also

- `storybook-core` — install, CLI, version landscape
- `storybook-config` — `.storybook/main.ts`, `preview.ts`, `manager.ts` reference
- `storybook-essentials` — controls/actions/backgrounds/viewport/themes/highlight/measure
- `storybook-testing` — Vitest addon, test-runner, play functions, portable stories, mocking
- `storybook-docs` — Autodocs, MDX, doc blocks
- `storybook-frameworks` — per-renderer/-framework conventions (React, Vue, Svelte, Angular, …)
- `storybook-ai` — JSDoc → manifest → MCP server (best practices for AI-consumable stories)
- `storybook-migration` — CSF 2→3→Next migration, Svelte CSF v5 migration
