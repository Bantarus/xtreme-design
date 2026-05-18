---
name: storybook-docs
description: >
  Writing documentation for components and design systems with Storybook.
  Covers the `@storybook/addon-docs` (auto-installed since SB 8) feature
  set — Autodocs (auto-generated docs pages from your stories, enabled
  via the `autodocs` tag at project/component/story level, with
  customizable doc templates via `parameters.docs.page`, custom MDX-based
  templates, table of contents with `toc.contentsSelector` /
  `headingSelector` / `ignoreSelector` / `title` / `unsafeTocbotOptions`
  / `disable`, multi-component docs with `subcomponents`, custom Docs
  Container, separate docs theme via `parameters.docs.theme`), MDX 3
  (combining Markdown + JSX + CSF stories in one file, the `Meta` /
  `Story` / `Canvas` doc blocks, attached vs unattached docs, file-system-
  based MDX placement, importing markdown via `<Markdown />` block,
  cross-linking stories via `?path=/docs/some--id`, MDX migration
  troubleshooting via `npx @hipster/mdx2-issue-checker`, remark plugin
  setup including `remark-gfm` for GitHub-flavored markdown tables,
  React version handling — Preact uses React 17, Next.js uses canary
  React, mdxPluginOptions config, MDX experimental support in VSCode),
  every doc block (`<Meta />` with `of` / `title` / `name` / `isTemplate`,
  `<Title />` / `<Subtitle />` / `<Description />` from JSDoc,
  `<Primary />` first story, `<Story />` individual story render,
  `<Stories />` full collection, `<Canvas />` interactive story wrapper
  with `parameters.docs.canvas`, `<Controls />` interactive args table,
  `<ArgTypes />` static props table, `<Source />` raw code snippet with
  `parameters.docs.source` for language/transform, `<Markdown />` import
  external markdown, `<ColorPalette />` + `<ColorItem />` for design
  tokens, `<IconGallery />` + `<IconItem />` for icon docs, `<Typeset />`
  for typography systems, `<TableOfContents />` floating ToC,
  `<Unstyled />` to disable Storybook's MDX styling within a block,
  `useOf` hook for custom blocks), the Code panel (`parameters.docs.codePanel`
  to show source code alongside stories at meta/story/project level,
  same configuration as `<Source />`, replaces deprecated Storysource
  addon since SB 9), build & publish docs (`storybook dev --docs` for
  preview, `storybook build --docs` for build, output to `storybook-
  static` like normal builds, top-level item shows primary story, no
  toolbar in docs mode, Vercel/Netlify/S3 publishing). Use whenever the
  user mentions Storybook docs, Autodocs, `.stories.mdx`, MDX doc page,
  doc blocks, `<Canvas>` / `<Controls>` / `<Source>` / `<Stories>` /
  `<Story>` / `<Meta>` / `<Primary>` / `<Title>` / `<Subtitle>` /
  `<Description>` / `<ArgTypes>` / `<Markdown>` / `<ColorPalette>` /
  `<IconGallery>` / `<Typeset>` / `<TableOfContents>` / `<Unstyled>`,
  `autodocs` tag, table of contents in docs, custom docs template,
  documenting a design system, code panel, source code panel,
  `parameters.docs.codePanel`, MDX 3, MDX migration, `remark-gfm`,
  `storybook dev --docs`, docs-only build, building Storybook for
  documentation, JSDoc-driven docs, `addon-docs`, design tokens
  documentation, color palette in Storybook, typography in Storybook,
  attached vs unattached MDX docs.
---

# Storybook Documentation (Autodocs, MDX, Doc Blocks)

Storybook turns your stories into living documentation. Two ways to
author docs:

1. **Autodocs** — Storybook generates a default Docs page for each
   component from your CSF + JSDoc. Enable with `tags: ['autodocs']`.
   Zero MDX required.
2. **MDX** — write custom docs that mix Markdown + JSX + your stories.
   Place `.mdx` files in your `stories` glob.

Both share the same building blocks ("Doc Blocks") — the React
components like `<Canvas>`, `<Controls>`, `<Source>` that render
specific aspects of your stories. They're imported from
`@storybook/addon-docs/blocks` and work in both default templates and
custom MDX files.

The `@storybook/addon-docs` package ships in the Recommended Storybook
install. If you went minimal, install it manually:

```bash
npx storybook add @storybook/addon-docs
```

## Autodocs

Storybook generates a Docs page for any component that has at least one
story tagged with `autodocs`. The default template includes Title,
Subtitle, Description, Primary story, Controls, and a Stories grid.

### Enable Autodocs project-wide

```ts
// .storybook/preview.ts
const preview: Preview = {
  tags: ['autodocs'],
};
```

### Or per-component / per-story

```ts
const meta = {
  component: Button,
  tags: ['autodocs'],         // applies to this component's docs page
} satisfies Meta<typeof Button>;

// Or per-story (less common):
export const Showcase: Story = { tags: ['autodocs'] };
```

### Disable for a specific component

```ts
const meta = {
  component: SecretComponent,
  tags: ['!autodocs'],
};
```

### Configuration in `main.ts`

```ts
// .storybook/main.ts
docs: {
  defaultName: 'Documentation',     // rename the Docs page (default 'Docs')
  docsMode: false,                  // true → docs-only Storybook (no story sidebar)
},
```

### Customize the docs page template

Override the default template in `preview.ts`:

```tsx
// .storybook/preview.tsx
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/addon-docs/blocks';

const preview: Preview = {
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <hr />
          <h2>Custom usage notes</h2>
          <p>Add anything React-renderable here.</p>
        </>
      ),
    },
  },
};
```

### Custom template via MDX

For non-React renderers (or just for the readability of MDX):

```mdx
{/* .storybook/preview-template.mdx */}
import { Meta, Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/addon-docs/blocks';

<Meta isTemplate />

<Title />
<Subtitle />
<Description />
<Primary />
<Controls />
<Stories />
```

```ts
// .storybook/preview.ts
import docsTemplate from './preview-template.mdx';

const preview: Preview = {
  parameters: { docs: { page: docsTemplate } },
};
```

### Table of contents (`toc`)

```ts
// .storybook/preview.ts
parameters: {
  docs: {
    toc: {
      title: 'On this page',
      headingSelector: 'h1, h2, h3',
      contentsSelector: '.sbdocs-content',
      ignoreSelector: '.docs-story h2',
      disable: false,
      unsafeTocbotOptions: { orderedList: true },
    },
  },
},
```

| Option | Notes |
| --- | --- |
| `title` | String, ReactElement, or `null`. Caption above the ToC. |
| `headingSelector` | Default `h3` — adjust to include `h1`/`h2`. |
| `contentsSelector` | CSS selector for the container being scanned. |
| `ignoreSelector` | Headings inside this selector are skipped (default: inside Story blocks). |
| `disable` | Hide the ToC entirely. |
| `unsafeTocbotOptions` | Pass-through to [Tocbot](https://tscanlin.github.io/tocbot/). |

Override per-component / per-story by setting `toc` in the component's
`parameters.docs.toc` (or `toc: { disable: true }` to hide it on one page).

### Multi-component docs (`subcomponents`)

```ts
const meta = {
  component: List,
  subcomponents: { ListItem, ListSeparator },   // tabbed argTypes/controls table
} satisfies Meta<typeof List>;
```

The Docs page shows a tabbed ArgTypes/Controls table — one tab per
subcomponent. Subcomponents' argTypes are inferred (not user-overridable),
and Controls only affect the main component's args.

### Customize the Docs Container (advanced)

The Docs Container is the React component that wraps the docs page.
Replace it for global behavior changes:

```tsx
// .storybook/preview.tsx
import { DocsContainer } from '@storybook/addon-docs/blocks';

const MyContainer = ({ children, ...rest }) => (
  <div className="my-docs-wrapper">
    <DocsContainer {...rest}>{children}</DocsContainer>
  </div>
);

const preview: Preview = {
  parameters: { docs: { container: MyContainer } },
};
```

### Theme the Docs UI separately

```ts
import { themes } from 'storybook/theming';
parameters: { docs: { theme: themes.dark } },
```

Default Docs theme is always `light` regardless of the manager theme —
explicitly set this if you want them in sync.

### Custom MDX components

Override how MDX renders specific elements:

```tsx
parameters: {
  docs: {
    components: {
      code: ({ children }) => <MyCodeBlock>{children}</MyCodeBlock>,
      Canvas: MyCustomCanvas,
    },
  },
},
```

> MDX 3 "sandboxes" components: `code: MyCode` only applies to triple-
> backtick markdown blocks, NOT to raw `<code>` JSX. This is an MDX
> limitation.

### Addon options

```ts
// .storybook/main.ts
addons: [{
  name: '@storybook/addon-docs',
  options: {
    csfPluginOptions: null,        // disable CSF plugin (rare)
    mdxPluginOptions: {
      mdxCompileOptions: {
        remarkPlugins: [/* ... */],
        rehypePlugins: [/* ... */],
      },
    },
  },
}],
```

## MDX

Place `.mdx` files alongside your stories (matching the `stories` glob)
to create custom doc pages.

### Two flavors of MDX docs

#### 1. Attached docs (link to a component's stories)

Use `<Meta of={...} />`:

```mdx
{/* Button.mdx */}
import { Meta, Primary, Controls, Stories } from '@storybook/addon-docs/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button

A button is the most common interactive control.

<Primary />

## Props

<Controls />

## All variants

<Stories />
```

This attaches a `Docs` tab to the Button component's sidebar entry,
**replacing** any auto-generated docs page.

#### 2. Unattached / standalone docs

```mdx
{/* OnboardingGuide.mdx */}
import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Guides/Onboarding" />

# Onboarding

Welcome! This guide walks you through setting up the design system.

## Step 1

...
```

Or omit `<Meta />` entirely and let Storybook infer the title from the
file path (same auto-titling as CSF stories).

### Configure stories to include MDX

The default `stories` glob already includes `*.mdx`:

```ts
stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|tsx)']
```

If you opted out of MDX, re-enable:

```ts
stories: ['../src/**/*.@(mdx|stories.@(js|ts|tsx))']
```

### MDX 3 + GitHub Flavored Markdown tables

MDX 3 doesn't include GFM by default. For tables, footnotes, etc:

```bash
npm i -D remark-gfm
```

```ts
// .storybook/main.ts
addons: [{
  name: '@storybook/addon-docs',
  options: {
    mdxPluginOptions: {
      mdxCompileOptions: {
        remarkPlugins: [/* */],
      },
    },
  },
}],
```

(Actually adding `remark-gfm` to the array — pass it via the options.)

### Import markdown from a file

```mdx
import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import changelog from '../CHANGELOG.md?raw';

<Meta title="About/Changelog" />

# Changelog

<Markdown>{changelog}</Markdown>
```

The `?raw` suffix is Vite syntax for importing a file as a string.
For Webpack, use `raw-loader`.

### Cross-linking docs and stories

```md
[Read the auth guide](?path=/docs/guides-auth--docs)
[Open the Button primary story](?path=/story/components-button--primary)
```

Both `path` patterns work:
- `/docs/<id>` → opens the Docs tab.
- `/story/<id>` → opens the Canvas tab.

You can also use anchors:

```md
[Jump to API](?path=/docs/components-button--docs#api)
```

> Anchors are ignored in Canvas mode (Storybook uses query params to
> track Controls there).

### Multi-component MDX

Reference multiple components in one MDX:

```mdx
import * as ButtonStories from './Button.stories';
import * as IconStories from './Icon.stories';

<Meta title="Composites/Button + Icon" />

# Button + Icon

A Button often contains an Icon. Below are both components documented
together.

<Stories of={ButtonStories} />

## Icon

<Stories of={IconStories} />
```

### Known limitations

- Storybook's MDX implementation is **React-only**. Your docs render
  with React even if your stories use Vue/Svelte/Angular.
- For Preact projects, MDX always uses React 17 internally.
- For Next.js projects, MDX uses the canary React that ships with your
  installed Next.js (not the version in your project's `dependencies`).
- If you hit version mismatches, deleting `node_modules` and
  reinstalling usually resolves them.

### MDX migration

For projects upgrading from older MDX or Storybook 6.x MDX:

```bash
npx @hipster/mdx2-issue-checker
# Lists files with MDX 2/3 compatibility issues
```

VSCode users: install the [MDX extension](https://marketplace.visualstudio.com/items?itemName=unifiedjs.vscode-mdx)
and enable:

```json
{ "mdx.server.enable": true }
```

## Doc Blocks — the full inventory

All importable from `@storybook/addon-docs/blocks`. Customizable via
`parameters.docs.<blockName>` at story/meta/project level.

### Layout / metadata blocks

| Block | Purpose |
| --- | --- |
| `<Meta of={Stories} />` | Attach the MDX file to a component's stories. Without `of`, it's an unattached doc page. Use `isTemplate` for autodocs templates. |
| `<Title />` | The primary heading (component name). |
| `<Subtitle />` | Secondary heading. |
| `<Description />` | The component's description, sourced from JSDoc above the component. |
| `<TableOfContents />` | Floating right-side ToC. Configurable via `parameters.docs.toc`. |
| `<Unstyled>...</Unstyled>` | Disable Storybook's default MDX heading/paragraph styles within. |

### Story rendering blocks

| Block | Purpose |
| --- | --- |
| `<Primary />` | Renders the first story defined in the file, in a Canvas wrapper. |
| `<Story of={Stories.Primary} />` | Renders a specific story. |
| `<Canvas of={Stories.Primary} />` | Same as `<Story>` but wrapped in an interactive Canvas (toolbar, source). |
| `<Stories />` | Renders every story in the file, each in a Canvas. Equivalent to looping `<Canvas>` over all stories. |

### Props / API blocks

| Block | Purpose |
| --- | --- |
| `<Controls of={Stories.Primary} />` | Live controls table — edits update the rendered story. |
| `<ArgTypes of={Stories.Primary} />` | Static props table (no editing). Use when the story is rendered separately. |
| `<Source of={Stories.Primary} />` | Raw source code snippet. Customize via `parameters.docs.source`. |

### Design tokens / catalog blocks

| Block | Purpose |
| --- | --- |
| `<ColorPalette>...</ColorPalette>` + `<ColorItem title="..." subtitle="..." colors={['#fff', '#000']} />` | Document color tokens. |
| `<IconGallery>...</IconGallery>` + `<IconItem name="Icon name">{<MyIcon />}</IconItem>` | Document icon sets. |
| `<Typeset fontSizes={[12,14,18,24]} fontWeight={400} fontFamily="Inter" sampleText="..." />` | Document typography systems. |

### Importing external markdown

```jsx
<Markdown>{markdownString}</Markdown>
```

## Per-block configuration via `parameters`

Many blocks accept config via parameters in the matching namespace:

```ts
parameters: {
  docs: {
    canvas: { sourceState: 'shown', layout: 'centered' },     // <Canvas>
    source: { language: 'tsx', dark: false, format: true, transform: (code) => code },  // <Source>
    controls: { exclude: ['ref', /^aria/], expanded: true },  // <Controls> + <ArgTypes>
    story: { inline: true, height: '400px' },                 // <Story>
    argTypes: { exclude: ['ref'] },                            // <ArgTypes>
  },
},
```

Override on a single MDX block instead:

```mdx
<Controls exclude={['style']} />
<Canvas of={Stories.Primary} layout="fullscreen" />
<Source of={Stories.Primary} language="tsx" />
```

### `<Source>` parameters

```ts
parameters: {
  docs: {
    source: {
      language: 'tsx',                              // syntax highlighting
      dark: false,                                  // dark theme
      format: 'dedent',                              // 'dedent' | true | false
      type: 'dynamic',                               // 'auto' | 'code' | 'dynamic'
      code: 'const x = <Custom />',                  // override the auto-extracted code
      transform: (code, storyContext) => `// header\n${code}`,
    },
  },
},
```

### `<Story>` parameters

```ts
parameters: {
  docs: {
    story: {
      inline: true,                                  // render directly vs in an iframe
      height: '300px',                                // iframe height when inline=false
      iframeHeight: '300px',                          // same — older name
      autoplay: false,                                // run the play function in docs
    },
  },
},
```

`inline: false` is required for stories that have framework-specific
issues rendering directly in the docs container. Trade-off: Controls
won't update an iframed story (known limitation).

### `<Canvas>` parameters

```ts
parameters: {
  docs: {
    canvas: {
      sourceState: 'shown',                          // 'hidden' | 'shown' | 'none'
      layout: 'centered',                             // 'centered' | 'fullscreen' | 'padded'
    },
  },
},
```

## Custom Doc Blocks — `useOf`

For projects with bespoke documentation needs, write your own doc block:

```tsx
import { useOf } from '@storybook/addon-docs/blocks';

export function MyBlock({ of }) {
  const resolvedOf = useOf(of, ['story', 'meta', 'component']);
  if (resolvedOf.type === 'story') {
    return <div>Custom UI for {resolvedOf.story.name}</div>;
  }
  return null;
}
```

Use in MDX:

```mdx
<MyBlock of={Stories.Primary} />
```

## Code panel

The **Code panel** shows a story's source code alongside its render in
the **Canvas** view. It replaces the deprecated Storysource addon
(removed in SB 9).

Enable:

```ts
// .storybook/preview.ts
parameters: { docs: { codePanel: true } },
```

Or per component/story:

```ts
const meta = { parameters: { docs: { codePanel: true } } } satisfies Meta<...>;
```

It uses the same configuration as `<Source>` (above):

```ts
parameters: {
  docs: {
    codePanel: true,
    source: { language: 'tsx', transform: (code) => code },
  },
},
```

## Building and publishing documentation

### Docs-only dev server

```bash
storybook dev --docs
# Or as a package.json script:
# "storybook-docs": "storybook dev --docs"
```

Differences from regular dev mode:
- Sidebar items show only the docs entry (no expanded stories list).
- Each component shows its Docs page first.
- Toolbar is hidden.
- Suitable for users who only need to read documentation.

### Docs-only build

```bash
storybook build --docs
# Output goes to ./storybook-static/ as usual
```

```json
{ "scripts": { "build-storybook-docs": "storybook build --docs" } }
```

### Publish

Any static hosting service works — Vercel, Netlify, S3, GitHub Pages.
See `storybook-sharing` for the full publish guide.

## Common pitfalls

1. **Docs page is blank**. The component's stories file isn't tagged
   `autodocs`, OR `addon-docs` isn't installed. Check the addons array.
2. **`<Meta of={Stories} />` doesn't recognize the import**. Pass the
   **module namespace import**, not the default export:
   ```mdx
   import * as Stories from './Button.stories';
   <Meta of={Stories} />
   ```
3. **Stories don't render in MDX**. The `of=` prop must reference an
   exported named story:
   ```mdx
   <Story of={Stories.Primary} />     {/* correct */}
   <Story of={Primary} />              {/* wrong — Primary isn't in scope */}
   ```
4. **Tables / footnotes don't render**. Install `remark-gfm` and add
   to `mdxPluginOptions.mdxCompileOptions.remarkPlugins`.
5. **Description is missing**. Add JSDoc above your component export:
   ```ts
   /**
    * A button for user interactions.
    *
    * @summary Use for primary user actions.
    */
   export const Button = (...) => ...;
   ```
6. **`subcomponents` argTypes are blank**. Subcomponent argTypes can
   only be inferred — not manually overridden. Ensure the subcomponent
   has its own docgen (component type, JSDoc).
7. **Controls in docs don't update the story**. You set `inline: false`
   on the story — known limitation, the iframe doesn't share state with
   the Controls panel.
8. **ToC shows nothing**. Default `headingSelector` is `h3` — set it to
   `h1, h2, h3` if your content uses higher-level headings.
9. **`<ColorPalette>` colors look wrong**. The `colors` prop accepts an
   array of color strings; pass a single string like `colors={['#fff']}`,
   not `colors="#fff"`.
10. **Monorepo: auto-generated docs missing for some components**. The
    monorepo helper docs at
    `sources/storybook/docs/_snippets/storybook-fix-imports-autodocs-monorepo.md`
    show common fixes (import from the component source, not the package
    root; add path mappings to `tsconfig`).

## See also

- `storybook-core` — install, CLI (`storybook dev --docs`)
- `storybook-config` — `docs` namespace in `main.ts`, theming
- `storybook-stories` — `tags: ['autodocs']`, `subcomponents`
- `storybook-ai` — MDX content shapes how the docs manifest looks for AI agents
- `storybook-sharing` — publishing the built docs (Vercel/Netlify/etc.)
- `storybook-essentials` — Highlight feature used by the docs theme
