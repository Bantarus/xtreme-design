---
name: storybook-essentials
description: >
  Storybook's built-in "essential" features — the always-on toolset that
  makes stories interactive without writing any addon glue. Covers Actions
  (`fn()` spies from `storybook/test`, `spyOn`, the `action()` function from
  `storybook/actions`, `argTypesRegex` auto-matching, `configureActions`
  with `limit`/`clearOnStoryChange`/`depth`, `expandLevel` parameter),
  Backgrounds (define color palette via `parameters.backgrounds.options`,
  per-story default via `globals.backgrounds.value`, grid overlay with
  `cellSize`/`cellAmount`/`offsetX`/`offsetY`/`opacity`, `INITIAL_VIEWPORTS`
  equivalents), Controls (full control-type matrix — `boolean`/`number`/
  `range`/`text`/`color`/`date`/`select`/`radio`/`check`/`object`/`file`,
  automatic type inference per framework, `matchers` regex for color/date,
  `expanded` mode, `sort: 'requiredFirst'`, `include`/`exclude` filters,
  `presetColors`, `disableSaveFromUI`, conditional controls with
  `if: { arg, eq, neq, exists, truthy, global }`, `mapping` for complex
  values, "Create new story" / "Edit story" UI workflow), Highlight (the
  `HIGHLIGHT` channel event with `selectors`/`priority`/`styles`/
  `hoverStyles`/`focusStyles`/`keyframes`/`menu` payload, custom
  `HighlightMenuItem` with `clickEvent`/`iconLeft`/`iconRight`,
  `REMOVE_HIGHLIGHT`, `RESET_HIGHLIGHT`, `SCROLL_INTO_VIEW`, used both
  directly and by the a11y addon), Measure & Outline (`m` keyboard shortcut
  for measure, click-to-toggle outline button, per-story disable via
  `parameters.measure.disable`/`parameters.outline.disable`), Themes
  (`@storybook/addon-themes` with three decorators —
  `withThemeFromJSXProvider` for Material UI / Styled Components / Emotion,
  `withThemeByClassName` for class-toggling theming, `withThemeByDataAttribute`
  for `data-theme="dark"` patterns), Toolbars & Globals (the `globalTypes`
  schema with `defaultValue`/`toolbar` having `title`/`icon`/`items`/
  `dynamicTitle`/`showName`, `initialGlobals` for default values,
  decorators reading `context.globals`, story-level `globals` override
  that locks toolbar selection, `globalTypes`+`@storybook/icons` for
  custom toolbar icons, advanced patterns for locale switchers with
  flag icons, `useGlobals()` / `updateGlobals()` from `storybook/
  manager-api` for reading/writing from inside an addon), and Viewport
  (default `MINIMAL_VIEWPORTS` — mobile1/mobile2/tablet/desktop, opt-in
  `INITIAL_VIEWPORTS` with 28 device presets — iPhone 5–14 Pro Max, Galaxy
  S5/S9, Nexus, Pixel, iPad/iPad Pro variants, defining custom viewports
  with `styles.{width,height}` + `type: 'desktop'|'mobile'|'tablet'|'other'`,
  rotation via `globals.viewport.isRotated`, per-story default viewport via
  `globals.viewport.value`, keyboard shortcuts alt-v / alt-shift-v /
  alt-ctrl-v). Use whenever the user mentions Actions panel, action logging,
  `fn()` spy, `spyOn`, `action()` function, backgrounds, background color
  switcher, grid overlay, Controls, control type, color picker, date
  picker, radio group, select, conditional controls, `mapping` for JSX
  args, dataset of viewports, viewport selector, responsive testing,
  iPhone / iPad / Galaxy / Pixel viewport presets, theme switcher,
  dark mode toggle in Storybook, `withThemeFromJSXProvider`,
  `withThemeByClassName`, `withThemeByDataAttribute`, globals, toolbar
  globals, `globalTypes`, custom toolbar item, locale switcher in
  Storybook, measure tool, outline tool, highlight DOM elements,
  `HIGHLIGHT` event, scroll into view, accessibility highlight menu.
---

# Storybook Essentials

Storybook ships with a set of **essential features** that work in every
Storybook project out of the box — Actions, Backgrounds, Controls,
Highlight, Measure & Outline, Themes, Toolbars & Globals, and Viewport.
They're each implemented as core features (no separate addon install),
and each can be **toggled off per project** via `features.<name>: false`
in `main.ts`.

This skill is the per-feature reference. Disabling and theming are in
`storybook-config`; testing-time hooks (a11y, visual, interactions) are
in `storybook-testing`.

## Disabling an essential

```ts
// .storybook/main.ts
const config: StorybookConfig = {
  features: {
    actions: false,
    backgrounds: false,
    controls: false,
    highlight: false,
    measure: false,
    outline: false,
    toolbars: false,
    viewport: false,
  },
};
```

Or, more commonly, disable per-story/component via parameters:

```ts
parameters: { backgrounds: { disable: true } }
```

The full parameter schema for each feature is in its dedicated section
below.

---

## Actions

The Actions panel logs callback invocations — every time your component
fires an `onClick`, `onChange`, `onSubmit`, etc., Storybook captures it
with its arguments.

### `fn()` from `storybook/test` (recommended)

```ts
import { fn } from 'storybook/test';

const meta = {
  component: Button,
  args: { onClick: fn() },          // auto-logged AND assertable in play
} satisfies Meta<typeof Button>;
```

When your component calls `onClick(...)`, Storybook:
1. Records it in the Actions panel.
2. Marks the call on the spy so `expect(args.onClick).toHaveBeenCalled()`
   in your play function works.

For a spy outside `args`:

```ts
const handleSubmit = fn().mockName('handleSubmit');
// the .mockName() is required — without it, Storybook can't label the action
```

### Auto-match callbacks with `argTypesRegex`

```ts
// .storybook/preview.ts
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
  },
};
```

This auto-creates an action for every arg whose type is inferred from
the component matching the regex.

> **Caveat**: auto-matched spies are **not available in your play
> function** as `args.onX`. If you write play functions that assert on
> callbacks, use `fn()` instead and skip the regex.

### `spyOn` for arbitrary functions

```ts
import { spyOn } from 'storybook/test';
import * as api from '../lib/api';

beforeEach: async () => {
  spyOn(api, 'fetchUser').mockName('fetchUser');
},
```

### The `action()` function (filtering / manual logging)

```ts
import { action } from 'storybook/actions';

play: async () => {
  someLib.on('event', (data) => action('library-event')(data));
},
```

Override `spyOn` to filter what gets logged:

```ts
// preview.ts
import { spyOn, action } from 'storybook/test';
spyOn(someLib, 'noisy').mockImplementation((...args) => {
  if (args[0] === 'important') action('noisy-important')(...args);
});
```

### Parameters (under the `actions` namespace)

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `actions.argTypesRegex` | `string` | – | Regex to auto-match arg names. See above caveats. |
| `actions.disable` | `boolean` | `false` | Hide the Actions panel for this story. |
| `actions.expandLevel` | `number` | `1` | How many levels deep to expand objects in logged actions. |

### Global config — `configureActions`

```ts
// .storybook/preview.ts
import { configureActions } from 'storybook/actions';

configureActions({
  limit: 50,                    // max actions shown (oldest discarded)
  clearOnStoryChange: true,
  depth: 10,                    // serialization depth
});
```

### Exports

```ts
import { action, configureActions } from 'storybook/actions';
import { fn, spyOn } from 'storybook/test';
```

---

## Backgrounds

Set the background color the story renders against, picked from the
toolbar.

### Configure available backgrounds (project-level)

```ts
// .storybook/preview.ts
const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        light: { name: 'Light',  value: '#ffffff' },
        dark:  { name: 'Dark',   value: '#000000' },
        blue:  { name: 'Brand',  value: '#0050aa' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'light' },     // initial selection
  },
};
```

### Per-component / per-story override

```ts
// Force every Button story to render on dark:
const meta = {
  component: Button,
  globals: { backgrounds: { value: 'dark' } },     // LOCKS the toolbar
};

// Or per story:
export const OnDark: Story = { globals: { backgrounds: { value: 'dark' } } };
```

Setting `globals` (not `parameters`) for backgrounds means the toolbar
control gets disabled — useful when a story only makes sense on a
specific background.

### Customize available backgrounds at meta level

```ts
const meta = {
  parameters: {
    backgrounds: {
      options: { red: { name: 'Red', value: '#f00' } },
    },
  },
};
```

### Grid overlay

```ts
parameters: {
  backgrounds: {
    grid: {
      cellSize: 20,            // major grid lines (default 20)
      cellAmount: 5,           // minor grid lines per major (default 5)
      offsetX: 16, offsetY: 16, // shift origin (defaults depend on layout)
      opacity: 0.5,             // 0–1 (default 0.5)
      disable: false,           // hide grid entirely
    },
  },
},
```

Toolbar globals: `backgrounds.value` (selected key) and `backgrounds.grid`
(boolean grid toggle).

### Disable

```ts
parameters: { backgrounds: { disable: true } }
```

### API

| Parameter | Type | Notes |
| --- | --- | --- |
| `backgrounds.options` | `Record<string, { name: string; value: string }>` | Available colors. |
| `backgrounds.grid` | object | See above. |
| `backgrounds.disable` | `boolean` | Hide the toolbar control. |

| Global | Type | Notes |
| --- | --- | --- |
| `backgrounds.value` | `string` | Key into `options`. |
| `backgrounds.grid` | `boolean` | Grid on/off. |

---

## Controls

Auto-generates UI for editing your story's args. Reads its options from
`argTypes` on the meta/story; see `storybook-stories` → "argTypes — the
control schema" for the full per-arg syntax.

### Project-level configuration

```ts
// .storybook/preview.ts
const preview: Preview = {
  parameters: {
    controls: {
      // Auto-pick the color/date controls based on prop name:
      matchers: { color: /(background|color)$/i, date: /Date$/ },
      expanded: true,             // show description + default columns
      sort: 'requiredFirst',      // 'none' | 'alpha' | 'requiredFirst'
      include: undefined,         // OR allowlist (regex or string[])
      exclude: [/^aria/, 'ref'],  // hide certain props
      presetColors: ['#ff0000', { color: '#0000ff', title: 'Brand' }],
      disableSaveFromUI: false,   // disable "save as new story" button
    },
  },
};
```

### Disable a specific arg

```ts
// Hide from the controls panel BUT still show in the docs table:
argTypes: { foo: { control: false } }

// Hide from BOTH the controls panel AND the docs table:
argTypes: { foo: { table: { disable: true } } }
```

### Conditional controls

```ts
argTypes: {
  // Show only when `advanced` is truthy:
  shadowSize: { control: 'number', if: { arg: 'advanced', truthy: true } },
  // Show only when `mode === 'edit'`:
  draftId: { control: 'text', if: { arg: 'mode', eq: 'edit' } },
  // Show based on a global:
  rtlOnly: { control: 'boolean', if: { global: 'direction', eq: 'rtl' } },
}
```

Operators: `truthy`, `exists`, `eq`, `neq`. Default (no operator) = `{ truthy: true }`.

### Mapping for complex / non-serializable values

```ts
argTypes: {
  icon: {
    options: ['none', 'arrow', 'cart'],
    mapping: { none: null, arrow: <ArrowIcon />, cart: <CartIcon /> },
    control: { type: 'select', labels: { none: '— none —' } },
  },
},
```

### Saving stories from the Controls UI

In recent Storybook versions, edits to controls in the UI can be saved
back as a new named story (or back to the existing story file). Disable
with:

```ts
parameters: { controls: { disableSaveFromUI: true } }
```

(This feature isn't supported in Svelte CSF — use plain CSF if you want
the round-trip.)

### Full parameter reference

| Parameter | Type | Notes |
| --- | --- | --- |
| `controls.disable` | `boolean` | Hide the Controls panel. |
| `controls.exclude` | `string[] \| RegExp` | Hide matching args. |
| `controls.include` | `string[] \| RegExp` | Allowlist matching args. |
| `controls.expanded` | `boolean` | Show description + defaults columns. |
| `controls.matchers` | `{ color?: RegExp, date?: RegExp }` | Auto-pick control by prop name. |
| `controls.presetColors` | `(string \| { color, title? })[]` | Color picker presets. |
| `controls.sort` | `'none' \| 'alpha' \| 'requiredFirst'` | Row order. |
| `controls.disableSaveFromUI` | `boolean` | Disable "save story" button. |

---

## Backgrounds gotcha: layout-dependent defaults

The grid's `offsetX` / `offsetY` defaults depend on the `layout`
parameter:
- `layout: 'fullscreen'` → offsets default to **0**.
- `layout: 'padded'` (the default) → offsets default to **16**.

If your grid feels misaligned, set both offsets explicitly.

---

## Highlight

A first-class feature for marking up DOM nodes with overlays — used
directly by you, and indirectly by the Accessibility addon to mark
violations.

### Emit a highlight from a story or decorator

```ts
import { useChannel } from 'storybook/preview-api';
import { HIGHLIGHT } from 'storybook/highlight';

// From a decorator:
const decorators = [(Story) => {
  const emit = useChannel({});
  emit(HIGHLIGHT, {
    id: 'demo-highlight',
    selectors: ['.target', 'button.cta'],
    styles: { outline: '2px dashed #ff4785', backgroundColor: 'rgba(255,71,133,0.1)' },
    hoverStyles: { outline: '2px solid #ff4785' },
    focusStyles: { outline: '2px solid #1ea7fd' },
  });
  return <Story />;
}];
```

### Highlight menu (right-click style popover on the highlighted element)

```ts
emit(HIGHLIGHT, {
  selectors: ['.violation'],
  menu: [[
    {
      id: 'inspect',
      title: 'Inspect violation',
      description: 'Show why this element was flagged',
      iconLeft: 'info',
      clickEvent: 'MY_INSPECT_EVENT',
    },
  ]],
});

// Listen for the click:
useChannel({
  MY_INSPECT_EVENT: (itemId, details) => {
    console.log('clicked', itemId, details.element.outerHTML);
  },
});
```

`ClickEventDetails` contains `top`/`left`/`width`/`height`, all matching
`selectors`, and the `element` with `attributes`/`localName`/`tagName`/
`outerHTML`.

### Remove a single highlight by `id`

```ts
import { REMOVE_HIGHLIGHT } from 'storybook/highlight';
emit(REMOVE_HIGHLIGHT, 'demo-highlight');
```

### Reset all highlights

```ts
import { RESET_HIGHLIGHT } from 'storybook/highlight';
emit(RESET_HIGHLIGHT);
```

### Scroll an element into view (briefly highlights it)

```ts
import { SCROLL_INTO_VIEW } from 'storybook/highlight';
emit(SCROLL_INTO_VIEW, '#section-three', { behavior: 'smooth', block: 'center' });
```

### Recommendations

- Choose the **most specific selector** possible. Highlights run a
  document-wide query, so a vague selector affects more than you want.
- Highlights are automatically cleared on story navigation. Set
  `id` if you want to remove a specific one later.

### Disable

```ts
parameters: { highlight: { disable: true } }
```

---

## Measure & Outline

Two visual debugging tools in the toolbar:

| Tool | Toolbar icon | Keyboard | Behavior |
| --- | --- | --- | --- |
| Measure | 📏 | `m` | Hover any element to overlay its dimensions, padding, margin, border. |
| Outline | 🎚️ | (none — click only) | Toggle outlines on every UI element to spot alignment issues. |

No configuration needed beyond disabling:

```ts
parameters: {
  measure: { disable: true },
  outline: { disable: true },
}
```

---

## Themes (`@storybook/addon-themes`)

Provides three decorator factories for the most common theming patterns.
Install:

```bash
npx storybook add @storybook/addon-themes
```

### `withThemeFromJSXProvider` — for Material UI / Styled-Components / Emotion / etc.

```tsx
// .storybook/preview.tsx
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, GlobalStyle } from '../src/theme';

const preview = {
  decorators: [
    withThemeFromJSXProvider({
      themes: { light: lightTheme, dark: darkTheme },
      defaultTheme: 'light',
      Provider: ThemeProvider,
      GlobalStyles: GlobalStyle,
    }),
  ],
};
```

### `withThemeByClassName` — for class-toggling theming (Tailwind dark mode, custom CSS)

```ts
import { withThemeByClassName } from '@storybook/addon-themes';

const preview = {
  decorators: [
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },     // applied to <html>
      defaultTheme: 'light',
    }),
  ],
};
```

The class is set on `<html>` so Tailwind's `dark:` variant picks it up
automatically.

### `withThemeByDataAttribute` — for `data-theme="dark"` patterns

```ts
import { withThemeByDataAttribute } from '@storybook/addon-themes';

const preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
};
```

Each decorator adds a toolbar globals item so users can pick the theme;
the picked value is also accessible from `context.globals.theme` if
you want to read it elsewhere.

---

## Toolbars & Globals

Globals are project-wide state stored outside any specific story — used
for things like the active theme, the locale, RTL/LTR direction, mock
auth state.

### Declare a global with a toolbar item

```ts
// .storybook/preview.ts
const preview: Preview = {
  initialGlobals: {
    locale: 'en',
    direction: 'ltr',
  },
  globalTypes: {
    locale: {
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
        title: 'Locale',
        icon: 'globe',                    // from @storybook/icons
        items: [
          { value: 'en', title: 'English', right: '🇬🇧' },
          { value: 'fr', title: 'French',  right: '🇫🇷' },
          { value: 'es', title: 'Spanish', right: '🇪🇸' },
        ],
        dynamicTitle: true,               // show current value in toolbar
        showName: false,                  // hide the label "Locale"
      },
    },
    direction: {
      description: 'Text direction',
      defaultValue: 'ltr',
      toolbar: {
        title: 'Direction', icon: 'transfer',
        items: ['ltr', 'rtl'],
      },
    },
  },
};
```

| `toolbar` field | Type | Notes |
| --- | --- | --- |
| `title` | `string` | Tooltip label |
| `icon` | `string` | One of the [@storybook/icons](https://github.com/storybookjs/icons) names (e.g. `'globe'`, `'transfer'`, `'circlehollow'`) |
| `items` | `string[] \| MenuItem[]` | Available values |
| `dynamicTitle` | `boolean` | Show current value in the toolbar (great for short text values) |
| `showName` | `boolean` | Show the `title` next to the icon |
| `MenuItem.value` | `string` (Required) | Stored global value |
| `MenuItem.title` | `string` (Required) | Display label |
| `MenuItem.right` | `string` | Text shown on the right (emoji, key, code) |
| `MenuItem.icon` | `string` | Icon when selected |

### Consume a global in a decorator

```tsx
// .storybook/preview.tsx
const preview: Preview = {
  decorators: [
    (Story, { globals: { locale } }) => (
      <I18nProvider locale={locale}>
        <Story />
      </I18nProvider>
    ),
  ],
};
```

### Lock a global on a specific story

```ts
// Force this story to always render in French, disabling the toolbar item:
export const InFrench: Story = {
  globals: { locale: 'fr' },
};
```

### Consume a global in a story render

```ts
export const StoryWithLocale: Story = {
  render: (_args, { globals: { locale } }) => <Hello locale={locale} />,
};
```

### Reading / updating globals from an addon

```ts
import { useGlobals } from 'storybook/manager-api';

export const MyPanel = () => {
  const [globals, updateGlobals] = useGlobals();
  return (
    <button onClick={() => updateGlobals({ theme: globals.theme === 'dark' ? 'light' : 'dark' })}>
      Toggle theme
    </button>
  );
};
```

### Vue-specific reactivity

In Vue, globals must be passed through `setup()` and accessed via
`computed()` to stay reactive — plain template reads don't react to
toolbar changes.

---

## Viewport

Set the iframe dimensions for the rendered story — essential for
responsive testing.

### Default — `MINIMAL_VIEWPORTS`

```ts
mobile1: 320 × 568
mobile2: 414 × 896
tablet:  834 × 1112
desktop: 1024 × 1280
```

### Opt into `INITIAL_VIEWPORTS` (28 device presets)

```ts
// .storybook/preview.ts
import { INITIAL_VIEWPORTS } from 'storybook/viewport';

const preview: Preview = {
  parameters: {
    viewport: { options: INITIAL_VIEWPORTS },
  },
};
```

`INITIAL_VIEWPORTS` includes iPhone 5–14 Pro Max, Galaxy S5/S9, Nexus
5X/6P, Pixel/Pixel XL, iPad/iPad Pro 10.5"/11"/12.9". Full list with
dimensions at
`sources/storybook/docs/essentials/viewport.mdx`.

### Define custom viewports

```ts
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';

const myViewports = {
  kindlePaperwhite: {
    name: 'Kindle Paperwhite',
    styles: { width: '758px', height: '1024px' },
    type: 'tablet',
  },
  ultrawide: {
    name: 'Ultrawide monitor',
    styles: { width: '3840px', height: '1600px' },
    type: 'desktop',
  },
};

const preview: Preview = {
  parameters: {
    viewport: {
      options: { ...MINIMAL_VIEWPORTS, ...myViewports },
    },
  },
};
```

`type` must be `'desktop' | 'mobile' | 'tablet' | 'other'` — affects
the icon shown in the toolbar.

### Set a default viewport per story / component

```ts
const meta = {
  globals: { viewport: { value: 'iphone13', isRotated: false } },
};
// Or per-story:
export const Mobile: Story = { globals: { viewport: { value: 'iphone13' } } };
```

Globals (as opposed to parameters) **lock** the toolbar selection for
that story.

### Keyboard shortcuts

- `alt + v` → next viewport
- `alt + shift + v` → previous viewport
- `alt + ctrl + v` → reset

### Parameters / globals API

| Parameter | Notes |
| --- | --- |
| `viewport.options` | `Record<key, { name, styles: { width, height }, type }>` |
| `viewport.disable` | Hide the toolbar control |

| Global | Notes |
| --- | --- |
| `viewport.value` | Current viewport key (locks toolbar when set on story) |
| `viewport.isRotated` | `true` rotates 90° (portrait ↔ landscape) |

### Exports

```ts
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from 'storybook/viewport';
```

---

## Combining essentials with addons

Essentials and addons share the parameter namespace, so you can compose
them freely:

```ts
const meta = {
  component: ProductCard,
  parameters: {
    layout: 'centered',
    backgrounds: { value: 'gray' },
    viewport: { value: 'ipad' },
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
    msw: { handlers: [/* ... */] },
    chromatic: { viewports: [320, 768, 1024] },
  },
  globals: { theme: 'dark' },
} satisfies Meta<typeof ProductCard>;
```

This story would render centered on a gray background in iPad viewport
with dark theme, with the a11y addon's color-contrast rule disabled,
MSW intercepting network requests, and Chromatic taking snapshots at
three viewports.

## Common pitfalls

1. **Actions panel logs the same event twice.** You have both
   `actions.argTypesRegex` and `fn()` on the same arg. Use `fn()` and
   delete the regex.
2. **Custom theme switcher doesn't update the rendered component.**
   The decorator that reads `context.globals.theme` must be in
   `.storybook/preview.{ts,tsx}` (the preview iframe), not in
   `.storybook/manager.ts` (the UI). Globals are sent across the
   channel to the preview where decorators run.
3. **Vue decorator doesn't react to global changes.** Use Vue's
   `computed()` in `setup()` to make globals reactive in templates.
4. **`storybook/icons` doesn't have my icon.** The list is finite. Find
   it in [the package's source](https://github.com/storybookjs/icons),
   or render a custom React element directly as the toolbar item icon.
5. **`grid` overlay is invisible.** Check `opacity` (`0.5` default is
   subtle on light backgrounds), and verify the underlying background is
   not solid white.
6. **My viewport changes don't persist when navigating between stories.**
   They do persist — but if you set `globals.viewport` on a story, the
   toolbar lock disables changes for that story. Remove the
   story-level global to restore user freedom.
7. **Highlight selectors match too much.** Highlights run a document-
   wide query selector. Scope to a story-specific selector
   (e.g., `[data-story-id='button--primary'] button.cta`) when possible.
8. **Date control sends a UNIX timestamp, not a Date.** Known
   limitation. Convert in your render:
   ```ts
   render: (args) => <Calendar date={new Date(args.date)} />
   ```

## See also

- `storybook-core` — install and CLI
- `storybook-config` — `features.<name>: false` disabling, `manager.ts` UI config
- `storybook-stories` — argTypes / parameters / decorators / globalTypes schema
- `storybook-testing` — a11y addon's relationship to Highlight, interactions
- `storybook-addons` — `useGlobals` / `useChannel` for writing your own toolbar addon
