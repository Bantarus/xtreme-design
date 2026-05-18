---
name: storybook-csf3
description: Storybook 10 CSF3 story conventions used in this template — Meta type, StoryObj, args, parameters, decorators, version-aware ActiveStylesheet, fullscreen layout. Load when writing or editing .stories.tsx files.
---

# storybook-csf3

Project-local CSF3 conventions, layered on top of the generic `storybook-stories` reference (auto-loaded by Storybook 10). Most agent edits to `apps/storybook/src/**/*.stories.{ts,tsx}` should follow this shape exactly — deviations should be justified.

## Required shape

Every story file has **one default export (the meta) and at least one named export (the story)**. Use the `satisfies` operator so TS narrows the meta shape.

```ts
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@gallery/ui/button';

const meta = {
  title: 'Pages/SaaS Landing',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <main>…</main>
  ),
};
```

Two things to notice:
- `Meta` and `StoryObj` are **type-only** imports from `@storybook/react-vite`.
- The `satisfies` operator on the meta is non-negotiable. It's what gives `StoryObj<typeof meta>` its narrowed type.

If the story is component-focused (smoke tests in `__smoke__/`), include the `component` field:

```ts
const meta = {
  title: 'Smoke/Button',
  component: Button,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Button>;
```

## Layout choice — the single most important parameter

| `parameters.layout` | When | Path |
|---|---|---|
| `'fullscreen'` | Full-page compositions, the page spans the viewport | `apps/storybook/src/pages/<slug>.stories.tsx` |
| `'centered'` | Smaller, self-contained compositions in the middle of the canvas | `apps/storybook/src/sections/<slug>.stories.tsx`, smoke stories |
| omitted (defaults to `'padded'`) | Rarely — the Storybook chrome adds 16px padding, which usually fights the design | almost never |

Pages need `fullscreen` because hero sections, headers, footers all rely on `min-h-screen` and edge-to-edge backgrounds. Sections sit in the middle of the canvas; `centered` makes them feel like a card on a workbench.

## Title conventions

| Title prefix | Location | Use |
|---|---|---|
| `Pages/<Name>` | `apps/storybook/src/pages/` | Full-page stories produced by `/page`. |
| `Sections/<Name>` | `apps/storybook/src/sections/` | Smaller compositions produced by `/section`. |
| `Smoke/<Name>` | `apps/storybook/src/__smoke__/` | Wiring sanity checks. The agent should not modify these. |

Titles map directly to Storybook's sidebar grouping. Use Title Case for the human-readable name. Don't use slashes inside the name part — only one slash per title.

## Story export naming

Stories are named exports. For page/section compositions, there's almost always **just one** named export, called `Default`:

```ts
export const Default: Story = { render: () => <main>…</main> };
```

If you need to demonstrate variations (e.g., the same hero in two states), add additional named exports — `LoggedIn`, `Empty`, `WithError`. Always Title Case, starting with a letter.

Avoid exporting `Story1`, `Test`, or other generic names — they show up in the sidebar.

## render vs args

Two patterns. Pick by purpose:

### Render function (use for pages and sections)

```ts
export const Default: Story = {
  render: () => (
    <main className="min-h-screen bg-background">
      <header>…</header>
      <section>…</section>
    </main>
  ),
};
```

Use a `render` function when the story is a **composition** — the value is in the assembly of components, not in toggling props.

### Args (use for component smoke tests)

```ts
export const Primary: Story = {
  args: { variant: 'default', children: 'Click me' },
};
```

Use `args` when the story is **one component instance** and you want the Controls panel to manipulate it. Reserved for `__smoke__/` and (in future chapters) component-level stories.

## Imports — strict policy

| OK | Not OK |
|---|---|
| `import { Button } from '@gallery/ui/button';` | `import { Button } from '../../gallery/components/ui/button';` |
| `import { ArrowRightIcon } from 'lucide-react';` | inventing icon components |
| `import { Card, CardContent, CardHeader, CardTitle } from '@gallery/ui/card';` (named) | `import * as Card from '@gallery/ui/card';` |

The `@gallery/ui/*` alias resolves to `apps/gallery/components/ui/*` via Storybook's Vite config and tsconfig. The agent does NOT import from a different path or rewrite the alias.

If you can't find the component you need in `@gallery/ui/`, **stop and tell the user**. Don't invent a component.

## The version-aware decorator (already global)

Every story automatically inherits `ActiveStylesheet` from `apps/storybook/.storybook/preview.tsx`. You do **not** add it per-story. What this gives you:

- The story renders in whatever palette the user has selected in the Storybook toolbar (paintbrush icon → "Active (live DESIGN.md)" or a specific version like `base`, `v3`, `camping-v1-approved`).
- When the user switches palettes, your story re-paints in <50 ms without recompiling.
- The `--color-primary`, `--color-foreground`, etc. CSS variables update; Tailwind utilities like `bg-primary` follow.

This means: **always use semantic Tailwind utilities** (`bg-background`, `text-foreground`, `border-border`, `bg-primary`, etc.) — never hex literals. Hex literals don't get re-themed by the version picker.

```tsx
// GOOD — re-themes with the version picker
<header className="bg-background text-foreground border-border">…</header>

// BAD — locked to one palette
<header className="bg-[#7A3E0C] text-white">…</header>
```

## Parameters reference (project-local)

```ts
parameters: {
  layout: 'fullscreen' | 'centered',  // see above
  backgrounds: { disable: true },     // already set globally; no need to repeat
  // Avoid setting other parameters in page/section stories unless you have a reason.
}
```

Two parameters are **always already on** via `preview.tsx`:
- `backgrounds: { disable: true }` — the version picker controls the background; Storybook's own background addon is hidden.
- `controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } }` — automatic Control type inference; you can usually ignore this.

## globalTypes — don't add new ones

`preview.tsx` defines exactly one global: `designVersion` (the toolbar paintbrush). Do not add per-story globals. If a story needs state, use React state inside the render function or a play function (rare for compositions).

## Forbidden patterns

- **`useState` / `useEffect` in render bodies.** Render bodies execute on every story-context change; side effects there will leak. Use a `play` function (rare) or pre-bake the state into the story constants.
- **Top-level `fetch` or other async at module scope.** Vite's HMR will re-run them on every save, and Storybook compiles stories lazily — the request will fire whenever the story loads.
- **Importing components from `apps/storybook/.storybook/`.** Storybook config is not a story dependency. If a story needs a decorator, it gets the global one; don't import `ActiveStylesheet` per story.
- **Importing from `apps/storybook/src/__smoke__/` into pages or sections.** Smoke tests are isolated; don't reuse their render bodies.
- **`as any` or `@ts-expect-error`.** If TypeScript complains, the component shape is wrong; fix the shape, don't suppress the error.
- **Inline `style={{ color: '#...' }}`.** Use Tailwind utilities so the version picker works.

## Minimal page template

When `/page` writes a new file, the result should look like this:

```tsx
/**
 * Generated by /page (chapter 2).
 * Brief: <user brief>
 * Reference: <.dsx/page-references/...> (score N)
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@gallery/ui/button';
// ...other @gallery/ui/* imports

const meta = {
  title: 'Pages/<Human Name>',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background text-foreground">
      {/* header */}
      {/* hero / main */}
      {/* sections */}
      {/* footer */}
    </div>
  ),
};
```

## Minimal section template

```tsx
/**
 * Generated by /section (chapter 2).
 * Brief: <user brief>
 * Reference: <.dsx/page-references/...> (score N)
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
// ...@gallery/ui/* imports

const meta = {
  title: 'Sections/<Human Name>',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-5xl">
        {/* the section content */}
      </div>
    </div>
  ),
};
```

Note: even in `'centered'` layout, wrap the section content in a `div` with `bg-background` so the section keeps the active palette even when the Storybook chrome's color is white.

## /refine guidelines

When editing an existing story:
- Read the whole file first. Understand the structure.
- Make **surgical** edits — change a class here, swap a component there, adjust a Tailwind spacing token. Don't rewrite.
- If the adjustment crosses multiple files or replaces the bulk of the story, surface that and ask whether to proceed.
- The fence permits the edit; Storybook hot-reloads automatically; the user inspects in the canvas.

## When TS complains

| Error | Fix |
|---|---|
| `Type 'string' is not assignable to type '"default" \| "outline" \| …'` | The variant came in as a wide string. Add `as const` at the source array, or annotate the variable's type. |
| `Property 'children' does not exist on type 'IntrinsicAttributes & …'` | The component doesn't accept children directly (e.g., `Input`). Restructure — `<Input>` is self-closing. |
| `Module not found: Can't resolve '@gallery/ui/foo'` | The component isn't installed. Surface to the user. |
| `JSX element class does not support attributes because it does not have a 'props' property` | You used `<MyComponent />` where `MyComponent` is not a React component. Probably imported a type or a non-component. |

## Output handoff (per `/page` or `/section`)

When the command completes, output one line:

```
landing-saas (score 4) → apps/storybook/src/pages/saas-landing.stories.tsx
View: http://localhost:6006/?path=/story/pages-saas-landing--default
```

That's the whole report. The pipeline + Storybook handle the rest.
