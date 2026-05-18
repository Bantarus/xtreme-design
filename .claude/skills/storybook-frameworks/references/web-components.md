# Web Components (Vite) with Storybook — full reference

Framework: `@storybook/web-components-vite`. Works with any web-
components library — **Lit 3+**, FAST, Stencil's compiled output,
vanilla custom elements.

Requires **Vite 5+**.

## Install

```bash
npm create storybook@latest    # auto-detects when Lit / custom elements are in package.json
# Manual:
npm i -D @storybook/web-components-vite vite
```

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  framework: '@storybook/web-components-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
};
export default config;
```

## Story format

Stories return a `TemplateResult` (Lit) or a DOM `Node`:

```ts
// Button.stories.ts
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './button';   // registers <my-button>

const meta: Meta = {
  component: 'my-button',
  argTypes: {
    label: { control: 'text' },
    primary: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj;

export const Primary: Story = {
  args: { label: 'Click', primary: true },
  render: (args) => html`<my-button ?primary=${args.primary} label=${args.label}></my-button>`,
};
```

Note `component` is a **string** (the custom element's tag name), not a
class reference.

## ArgType inference via `custom-elements.json`

Generate the manifest:

```bash
npm i -D @custom-elements-manifest/analyzer
npx custom-elements-manifest analyze
```

Wire it up in `preview.ts`:

```ts
// .storybook/preview.ts
import { setCustomElementsManifest } from '@storybook/web-components-vite';
import customElements from '../custom-elements.json';
setCustomElementsManifest(customElements);
```

Once registered, Storybook auto-populates Controls and Autodocs from
the manifest.

> Pre-v1.0 `custom-elements.json` files use the older
> `@custom-elements-manifest/analyzer` adapter. Newer projects should
> use the standard schema directly.

## Framework options

```ts
framework: {
  name: '@storybook/web-components-vite',
  options: {
    builder: { /* Vite options */ },
  },
},
```

No web-components-specific options — just the builder pass-through.

## Shadow DOM testing

The default Testing Library queries (`getByRole`, `getByText`, etc.)
**don't pierce shadow boundaries**. For stories with shadow DOM:

```bash
npm i -D shadow-dom-testing-library
```

Register the shadow queries in `preview.ts`:

```ts
// .storybook/preview.ts
import {
  getByShadowRole, findByShadowRole, queryByShadowRole,
  getByShadowText, findByShadowText, queryByShadowText,
  getByShadowLabelText, findByShadowLabelText, queryByShadowLabelText,
  /* ... and the *all* variants */
} from 'shadow-dom-testing-library';

// Optionally wrap and add to canvas globally:
```

Then in stories:

```ts
import { findByShadowRole } from 'shadow-dom-testing-library';

export const Click: Story = {
  play: async ({ canvas }) => {
    const button = await findByShadowRole(canvas.canvasElement, 'button', { name: 'Submit' });
    await userEvent.click(button);
  },
};
```

The full registration recipe is at
`sources/storybook/docs/_snippets/shadow-dom-testing-library-in-preview.md`.

## CSF Next

Web Components is one of the four CSF Next preview renderers. For type
inference, declare your element in `HTMLElementTagNameMap`:

```ts
// my-element.ts
declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
```

CSF Next infers `Partial<MyElementProps>` by default — to enforce
required props:

```ts
interface MyElementProps { requiredProp: string; optionalProp?: number; }
const meta = preview.type<{ args: MyElementProps }>().meta({ component: 'my-element' });
```

## Lit-specific tips

- Import your element-defining module from the story file
  (`import './button';`) so the custom element is registered before
  rendering.
- For reactive controllers and decorators, no special config — Lit
  works as-is.
- Stencil-compiled output: import the loader once in `preview.ts`:
  ```ts
  import { defineCustomElements } from '../dist/loader';
  defineCustomElements();
  ```

## Common pitfalls

1. **Story shows nothing**. The element isn't registered. Import the
   defining module from the story file before referencing the tag.
2. **All controls are `text`**. `custom-elements.json` isn't loaded.
   Re-run `npx custom-elements-manifest analyze` and confirm
   `setCustomElementsManifest(customElements)` in `preview.ts`.
3. **Boolean attributes don't work**. Use Lit's `?` prefix:
   `?disabled=${args.disabled}` (renders the attribute when truthy,
   removes when falsy).
4. **Tests can't find elements inside shadow DOM**. Install
   `shadow-dom-testing-library` and use the `*Shadow*` query variants.
5. **MDX docs don't render the component**. Custom elements need to be
   registered before MDX evaluates them. Import the defining module at
   the top of the MDX file:
   ```mdx
   import { Meta } from '@storybook/addon-docs/blocks';
   import '../src/components/button';

   <Meta title="Button" component="my-button" />
   ```
