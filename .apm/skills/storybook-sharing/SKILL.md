---
name: storybook-sharing
description: >
  Publishing, composing, and embedding Storybook to share with teammates
  and stakeholders. Covers building Storybook as a static web app
  (`storybook build`, output to `storybook-static`, preview locally
  with `http-server`, performance-optimized `--test` flag with
  `build.test.{disableBlocks,disableMDXEntries,disableAutoDocs,
  disableDocgen,disableSourcemaps,disableTreeShaking,disabledAddons}`,
  `--preview-only` mode for unsupported browsers with the
  `?navigator=true` IFRAME query, build-storybook for Angular via the
  Angular CLI builder), publishing to Chromatic (the recommended host,
  `npx chromatic --project-token=...`, full feature support — versioning,
  history, CPP, embed, Composition, Visual Tests addon integration, UI
  Review for PR scanning, GitHub Actions setup with
  `${{ secrets.CHROMATIC_PROJECT_TOKEN }}`), publishing to other hosts
  (GitHub Pages via `bitovi/github-actions-storybook-to-github-pages`,
  Vercel, Netlify, AWS S3, custom CI providers), the Component
  Publishing Protocol (CPP) — CPP level 0 (raw static) vs CPP level 1
  (versioned URLs with `?version=x.y.z`, `/index.json`, `/metadata.json`
  with `releases` field — Chromatic is the canonical level-1 service),
  Storybook Composition (`refs` in `main.ts`, compose published
  Storybooks via URL, compose local Storybooks across ports, function
  form for environment-specific refs, disable auto-composed package
  refs with `{ disable: true }`, addon limitations in composed
  Storybooks, `sourceUrl` for GitHub linking), Package Composition (the
  `storybook.url` field in published `package.json`, automatic version
  selection with Chromatic, showing a version selector for consumers,
  authoring vs consuming side), embedding stories (iframe embed via
  `?path=/story/x--y&full=1&shortcuts=false&singleStory=true`, oEmbed
  for Notion / Medium / Ghost, plain canvas embed via
  `iframe.html?id=x--y&viewMode=story`, docs embed via
  `iframe.html?id=x--y&viewMode=docs`, embeds work only with publicly-
  accessible Storybooks), design integrations (Figma via the official
  Storybook Connect plugin — embed stories IN Figma using Chromatic-
  published stories; the Designs addon `@storybook/addon-designs` to
  embed Figma IN Storybook via `parameters.design = { type: 'figma',
  url: '...' }`, also supports Adobe XD and Sketch; Zeplin via the
  community `storybook-zeplin` addon and Zeplin's native app integration;
  Zeroheight, UXPin, InVision DSM partnerships), and SEO (meta
  description tag in `manager-head.html`, noindex tag to keep your
  published Storybook out of search results). Use whenever the user
  mentions publishing Storybook, deploying Storybook, `storybook build`,
  Chromatic, GitHub Pages Storybook, Netlify Storybook, Vercel
  Storybook, Storybook composition, `refs` in main.ts, composed
  Storybook, package composition, embedded stories, iframe story
  embed, Figma integration, Zeplin integration, design addons,
  `@storybook/addon-designs`, Storybook Connect Figma plugin, oEmbed
  Storybook, sharing Storybook with team, CPP, `metadata.json`,
  `index.json`, versioned Storybook, preview-only mode, older browser
  support.
---

# Sharing Storybook

Storybook is a small, self-contained web app — once you build it, you
can host it anywhere. This skill covers the four ways to share:

1. **Publish** — host the static build for stakeholder review and
   long-term reference (Chromatic, GitHub Pages, Vercel, Netlify, S3, etc.).
2. **Compose** — pull other published Storybooks into your local one
   for cross-project component discovery.
3. **Embed** — drop a story into Notion, Medium, Ghost, your docs site,
   or anywhere that supports `<iframe>` or oEmbed.
4. **Integrate with design tools** — embed stories in Figma (or Figma
   designs in Storybook) via the official Storybook Connect plugin and
   the Designs addon.

## Build Storybook as a static web app

```bash
npm run build-storybook
# Or directly:
storybook build

# Output: ./storybook-static/
```

Preview locally:

```bash
npx http-server storybook-static -p 6006
# Or any static-file server you prefer.
```

### Performance-optimized build (`--test`)

When the published Storybook is consumed only by tests / Chromatic /
CI tooling (not humans), strip everything that doesn't affect rendering:

```bash
storybook build --test
```

This enables `build.test.{disableBlocks, disableMDXEntries,
disableAutoDocs, disableDocgen, disableSourcemaps, disableTreeShaking}`
automatically. You can fine-tune in `main.ts` `build.test` if you need
partial optimization (e.g., keep Docgen on but disable sourcemaps).

See `storybook-config` → "`build.test` — perf-optimized builds" for
the full schema.

### Build for older browsers (`--preview-only`)

The Storybook manager UI requires Chrome 131+, Edge 134+, Firefox 136+,
Safari 18.3+. For older browsers, build **without** the manager:

```bash
storybook build --preview-only
```

Then the entry point becomes `iframe.html` (not `index.html`):

```
https://example.com/storybook/iframe.html?navigator=true
```

`?navigator=true` renders a basic HTML-only sidebar inside the preview
so users can still navigate stories. Works in any browser that supports
your component framework — defined entirely by your builder's target
list.

### Angular's CLI builder

```bash
ng run my-app:build-storybook
# Output goes to dist/storybook/my-app
```

See `storybook-frameworks/references/angular.md` for the full Angular
CLI builder reference.

## Publish — Chromatic (recommended)

[Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)
is made by the Storybook team and provides:

- Free Storybook hosting
- Built-in **Visual Tests** integration (see `storybook-testing`)
- **UI Review** for PR scanning (highlights new/changed stories)
- **Component history** + versioning (browse past commits)
- **CPP level 1** (versioned URLs, `index.json`, `metadata.json`)
- **Composition** support (your Storybook can be composed by others)
- **Secure private projects** with access control
- **Automatic MCP server publishing** (for the AI capabilities — see `storybook-ai`)

### Sign up + first build

1. Sign up at chromatic.com with GitHub/GitLab/Bitbucket/email.
2. Get a project token.
3. Run:
   ```bash
   npm i -D chromatic
   npx chromatic --project-token=<your-project-token>
   ```
4. Click the link Chromatic prints — your Storybook is live.

### CI workflow (GitHub Actions)

```yaml
# .github/workflows/chromatic.yml
name: Chromatic
on: push
jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }                    # full history for change detection
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: npm ci
      - uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

`CHROMATIC_PROJECT_TOKEN` goes in repo secrets (Settings → Secrets and
variables → Actions).

After this is set up, every PR gets a "UI Tests" / "UI Review" status
check linking to the Chromatic build.

### `chromatic.config.json`

```json
{
  "projectId": "Project:64cbcde96f99841e8b007d75",
  "buildScriptName": "build-storybook",
  "debug": false,
  "zip": true
}
```

| Option | Notes |
| --- | --- |
| `projectId` | Auto-set; identifies the project. |
| `buildScriptName` | If your build script isn't called `build-storybook`, set it here. |
| `debug` | Verbose output. |
| `zip` | Recommended for large projects — uploads a single zip rather than thousands of files. |

Full options: https://www.chromatic.com/docs/configure/

## Publish — other hosts

### GitHub Pages

Use the community action:

```yaml
# .github/workflows/storybook.yml
name: Storybook
on:
  push:
    branches: [main]
permissions: { pages: write, id-token: write }
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: bitovi/github-actions-storybook-to-github-pages@v1
        with:
          install_command: npm ci
          build_command: npm run build-storybook
          path: storybook-static
```

Configure GitHub Pages source to "GitHub Actions" in repo Settings.

### Vercel

Vercel auto-detects Storybook. In `vercel.json`:

```json
{
  "buildCommand": "npm run build-storybook",
  "outputDirectory": "storybook-static"
}
```

### Netlify

In `netlify.toml`:

```toml
[build]
  command = "npm run build-storybook"
  publish = "storybook-static"
```

### AWS S3

```bash
npm run build-storybook
aws s3 sync storybook-static s3://my-storybook-bucket/ --acl public-read
# Then point CloudFront at the bucket
```

## Component Publishing Protocol (CPP)

Storybook's APIs interoperate with hosts that meet the **Component
Publishing Protocol**. Two levels:

| Level | Provides | Examples |
| --- | --- | --- |
| **CPP 0** | Serves a built Storybook (raw static hosting) | Netlify, Vercel, S3, GitHub Pages |
| **CPP 1** | Versioned endpoints (`?version=x.y.z`), `/index.json`, `/metadata.json` with `releases` | Chromatic |

CPP 1 unlocks:
- **Storybook Composition** (`refs` with version awareness)
- **Package Composition** (consumer Storybooks auto-pull the right version)
- **Embeds** with versioned URLs
- **`storybook composition`** UI (browse history, switch versions)

For most teams, **publish to Chromatic** to get CPP 1 for free.

## Storybook Composition

Composition pulls **other** Storybooks into your local one. The sidebar
shows the composed stories alongside your own. Useful for:

- Cross-team component reuse (designers and devs see one library)
- Audit usage of design system components across consuming apps
- Combine multiple Storybooks running on different ports in dev
- View Storybooks of different frameworks together (React + Vue + etc.)

### Compose published Storybooks (`refs`)

```ts
// .storybook/main.ts
const config: StorybookConfig = {
  refs: {
    designSystem: {
      title: 'Design System',
      url: 'https://design.example.com',
      expanded: false,
      sourceUrl: 'https://github.com/example/design-system',  // shows "View on GitHub" links
    },
    legacy: {
      title: 'Legacy v6',
      url: 'https://legacy.example.com',
      expanded: false,
    },
  },
};
```

### Compose local Storybooks (development)

```ts
refs: {
  react:   { title: 'React',   url: 'http://localhost:6006' },
  angular: { title: 'Angular', url: 'http://localhost:6007' },
},
```

Each Storybook needs to be running on its own port.

### Conditional refs via a function

```ts
refs: (config, { configType }) => {
  if (configType === 'DEVELOPMENT') {
    return {
      local: { title: 'Local', url: 'http://localhost:6007' },
    };
  }
  return {
    prod: { title: 'Production', url: 'https://design.example.com' },
  };
},
```

### Disable an auto-composed ref

If a package you depend on declares `storybook.url` in its
`package.json` (see [Package Composition](#package-composition)), it
auto-composes into your Storybook. Opt out:

```ts
refs: {
  '@some-design-system': { disable: true },
},
```

### Composition limitations

- **Addons** in composed Storybooks don't work as they normally do.
  Controls, Actions, Interactions panel — none of those are wired up
  for composed stories. You can only browse them.
- **Older Storybooks** without an `index.json` endpoint need manual
  generation: `storybook@<old-version> extract` (deprecated in 8.0+).

## Package Composition

For component-library / design-system authors: when consumers install
your package, their Storybook can auto-compose yours.

### Author side — declare in `package.json`

```json
{
  "name": "@example/design-system",
  "version": "2.4.0",
  "storybook": {
    "url": "https://design.example.com"
  }
}
```

Or with auto-versioning (Chromatic-hosted):

```json
{
  "storybook": {
    "url": "https://master--xyz123.chromatic.com"
  }
}
```

`xyz123` is the Chromatic project ID. Chromatic auto-routes the
consumer to the build matching the installed version.

### Consumer side — opt out per package

```ts
// .storybook/main.ts
refs: {
  '@example/design-system': { disable: true },
},
```

### Version selector

When the package's Storybook hosts a `metadata.json` with a `releases`
field (CPP 1 — Chromatic provides this), consumers see a dropdown to
switch between versions.

## Embedding stories

Embeds let you drop a story into wikis, blog posts, Figma, your
marketing site, etc. **Requires the Storybook to be publicly
accessible** (no authentication).

### Embed with the toolbar

```html
<iframe
  src="https://my-storybook.chromatic.com/?path=/story/shadowboxcta--default&full=1&shortcuts=false&singleStory=true"
  width="800" height="260"
></iframe>
```

Query params:
- `path=/story/<id>` — which story to display.
- `full=1` — fullscreen mode (hides sidebar).
- `shortcuts=false` — disable keyboard shortcuts.
- `singleStory=true` — hide all UI chrome.

### Embed without the toolbar (raw canvas)

```html
<iframe
  src="https://my-storybook.chromatic.com/iframe.html?id=shadowboxcta--default&viewMode=story&shortcuts=false&singleStory=true"
  width="800" height="200"
></iframe>
```

The `iframe.html` URL renders just the canvas — no manager.

### Embed documentation

```html
<iframe
  src="https://my-storybook.chromatic.com/iframe.html?id=shadowboxcta--docs&viewMode=docs&shortcuts=false&singleStory=true"
  width="800" height="400"
></iframe>
```

`viewMode=docs` and `id=<id>--docs` together display the auto-generated
or MDX docs page.

### oEmbed (for platforms with native support)

If your Storybook is hosted on Chromatic, you can paste the story URL
directly into platforms that support [oEmbed](https://oembed.com/):

| Platform | How |
| --- | --- |
| Medium | Paste URL → press Enter (embed auto-resizes). Stories are non-interactive while editing, interactive when published. |
| Notion | Type `/embed`, paste URL. Resize as needed. |
| Ghost | Type `/html`, paste an `<iframe>` URL. |

Non-Chromatic hosts: use a raw `<iframe>` instead of oEmbed.

## Design integrations

### Figma

Two integrations, opposite directions:

**Storybook Connect** (embed stories IN Figma):

1. Publish your Storybook to Chromatic.
2. Install [Storybook Connect](https://www.figma.com/community/plugin/1056265616080331589/Storybook-Connect)
   from the Figma plugin catalog.
3. In Figma, open the command palette (Cmd+/ or Ctrl+/) → "Storybook Connect".
4. Authenticate with Chromatic.
5. Select a component → paste the Storybook story URL → link it.

Linked stories show a Storybook icon in Figma's sidebar; click to
preview.

**Designs addon** (embed Figma IN Storybook):

```bash
npx storybook add @storybook/addon-designs
```

```ts
// In a story:
parameters: {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/abc123/Design?node-id=1%3A2',
  },
},
```

The Designs addon panel renders the linked Figma frame alongside the
story. Multiple designs per story:

```ts
parameters: {
  design: [
    { name: 'Light', type: 'figma', url: '...' },
    { name: 'Dark',  type: 'figma', url: '...' },
  ],
},
```

The Designs addon also supports:
- Adobe XD prototypes
- Sketch via export
- Pixel-perfect overlays (toggle in the panel)

### Zeplin

Use the community [`storybook-zeplin`](https://storybook.js.org/addons/storybook-zeplin)
addon to display Zeplin design specs in a story panel. Zeplin's native
app also supports embedding published Storybook links — see
[Zeplin's docs](https://support.zeplin.io/en/articles/5674596-connecting-your-storybook-instance-with-zeplin).

### Zeroheight, UXPin, InVision DSM

Each has a Storybook integration (with varying depth). Storybook
publishes from each platform — see
`sources/storybook/docs/sharing/design-integrations.mdx` for the full
list of supported design tools.

## SEO

If your published Storybook is publicly accessible, you may want to
configure how search engines treat it.

### Description meta tag

```html
<!-- .storybook/manager-head.html -->
<meta name="description" content="Example Co. Design System — UI components and patterns" />
```

### Prevent indexing

```html
<!-- .storybook/manager-head.html -->
<meta name="robots" content="noindex" />
```

This keeps your Storybook out of Google but doesn't prevent direct
access. For true privacy, deploy behind authentication (Chromatic
private projects, S3 + CloudFront with signed URLs, Vercel with
SSO, etc.).

## Reviewing with your team

Common pattern: link the published Storybook in PR descriptions or
Slack so designers and PMs can review without checking out code.

If you use Chromatic + GitHub:
- Every PR gets a `UI Tests` status check (visual diffs) linking to
  Chromatic.
- Every PR gets a `UI Review` status check listing new/changed stories.
- Mark these as **required checks** on `main` to block accidental UI
  regressions.

## Common pitfalls

1. **`storybook-static/` is huge.** Use `--test` for CI builds. For
   public hosting, enable gzip/brotli at the CDN level. Chromatic does
   this automatically.
2. **Images 404 in the published Storybook.** Check `staticDirs` — the
   `to` field controls where files end up. Absolute paths
   (`/logo.png`) work; relative paths break when published under a
   subpath.
3. **Composition shows "Failed to load".** The remote Storybook may not
   serve `/index.json` (older versions), or CORS is blocking the
   request. Configure the remote to allow your origin.
4. **Tailwind classes missing in the published build.** Same as in dev
   — Tailwind needs `content` paths that include `*.stories.tsx` and
   your CSS must be imported from `preview.tsx`.
5. **`?singleStory=true` still shows the toolbar.** Combine with
   `shortcuts=false` and `full=1`.
6. **Embedding stories from a private Storybook fails.** Embeds only
   work for publicly-accessible URLs. Either publish publicly, or use
   Chromatic private projects (which has its own embed mechanism with
   authentication).
7. **GitHub Pages build fails on Storybook 10's ESM main.** Older Node
   versions in the GH Action don't handle ESM. Use Node 20.19+ or 22.12+
   in `setup-node`.
8. **Chromatic build slow on large projects.** Enable `zip: true` in
   `chromatic.config.json`. Consider `--storybook-build-dir` if you
   build separately.

## See also

- `storybook-core` — `storybook build` CLI
- `storybook-config` — `refs` schema, `build.test` schema, `staticDirs`
- `storybook-testing` — Chromatic Visual Tests addon, in-CI integration
- `storybook-ai` — Chromatic auto-publishes MCP servers
- `storybook-frameworks` → angular.md — Angular CLI builder for `build-storybook`
