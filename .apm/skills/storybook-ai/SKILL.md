---
name: storybook-ai
description: >
  Storybook's AI capabilities — agentic setup, manifests, and the MCP
  server. Currently in preview and only supported for React projects.
  Covers Agentic setup (`storybook ai setup` CLI command for React+Vite
  projects, the "Set up Storybook for me with npm create storybook@latest"
  prompt pattern, the generated step-by-step Markdown the agent
  follows — analyze codebase, configure preview, support portals, mock
  network/storage/timers/navigation at the preview level, write stories
  for up to 10 components tagged `ai-generated`, add play functions /
  interaction tests, run Vitest to verify, install recommended addons
  like MCP), Manifests (auto-generated JSON describing components and
  docs to AI agents — components manifest from CSF + react-docgen prop
  extraction at `http://localhost:6006/manifests/components.json`, docs
  manifest from MDX files at `/manifests/docs.json`, manifest debugger
  at `/manifests/components.html`, opting into via `features.componentsManifest`,
  curating with the `manifest` tag — automatic on every story/doc by
  default, remove with `!manifest`, subcomponents inclusion, the
  recommendation to use `react-docgen-typescript` over `react-docgen`
  for AI accuracy, JSDoc `@summary` for component descriptions, story
  descriptions and summaries), the MCP server
  (`@storybook/addon-mcp` install via `npx storybook add @storybook/
  addon-mcp`, the local server at `http://localhost:6006/mcp` with a
  splash page listing tools, `mcp-add` CLI for wiring up Claude Code /
  Gemini CLI / OpenAI Codex / VS Code Copilot, AGENTS.md / CLAUDE.md
  guidance for agents, the three toolsets — dev (`get-storybook-story-
  instructions`, `preview-stories`), docs (`get-documentation`,
  `get-documentation-for-story`, `list-all-documentation`), test
  (`run-story-tests`), the self-healing test loop, MCP options
  (`toolsets.{dev,docs,test}` toggles), Composition support — composed
  Storybooks with manifests merge into the MCP responses), sharing the
  MCP server (publish with Chromatic for automatic MCP server hosting,
  or self-host with `@storybook/mcp` library and
  `createStorybookMcpHandler` — Node.js example, Netlify function
  example, prerequisites Node 20+ and `components.json`/`docs.json`),
  and best practices for AI-consumable stories (JSDoc descriptions
  with `@summary` tag, prop JSDoc comments, story descriptions
  explaining the why not the what, docs page summaries via
  `<Meta title="..." summary="..." />`, the explicit-vs-evaluated
  content gap in MDX, curating overwhelming context by removing
  `manifest` tag from antipattern stories or stories the agent
  shouldn't use). Use whenever the user mentions Storybook AI,
  agentic setup, `storybook ai setup`, manifests, MCP server,
  `@storybook/addon-mcp`, Model Context Protocol Storybook, `mcp-add`,
  `list-all-documentation`, `get-documentation`, `run-story-tests`,
  `manifest` tag, "Set up Storybook for me with npm create",
  `components.json` / `docs.json` manifests, AGENTS.md/CLAUDE.md for
  Storybook, AI-generated stories, JSDoc summary for components,
  self-healing test loop, Claude / Gemini / Codex integration with
  Storybook, Chromatic MCP hosting, self-hosting MCP, sharing MCP
  server with team.
---

# Storybook + AI

Storybook ships AI capabilities designed to make agentic development
productive: agents can read your component library, generate UI that
reuses your existing components, write stories to preview the result,
and run tests to verify their work.

> **Preview**: All three features (agentic setup, manifests, MCP server)
> are in preview and currently only supported for **React** projects
> (with the Vite builder for `storybook ai setup` specifically). Future
> support is planned for Vue, Angular, Web Components, and Svelte.

The features compose in three layers:

```
┌─────────────────────────────────────────────────────────────┐
│  1. Agentic setup (one-shot)                                 │
│     - storybook ai setup → generates project-specific MD     │
│     - agent reads it → configures Storybook + writes stories │
│     - tag stories `ai-generated` for human review            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Manifests (continuous)                                   │
│     - JSON describing your components, their props, their    │
│       stories, and your MDX docs                              │
│     - generated on every dev/build                            │
│     - includes JSDoc + react-docgen output                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  3. MCP server (continuous)                                  │
│     - Model Context Protocol endpoint at /mcp                │
│     - Exposes manifest content + story generation + test runs│
│     - Agents query it: list components, look up props,       │
│       generate stories, run tests                             │
│     - Self-healing loop: write → test → fix → test → ✓       │
└─────────────────────────────────────────────────────────────┘
```

## Agentic setup — adding Storybook to an existing project

For React+Vite projects, ask your AI agent to set up Storybook:

```
Set up Storybook for me with npm create storybook@latest and follow its instructions precisely
```

The CLI runs `storybook init`, and then offers to continue with
project-specific configuration. If you agree:

1. The CLI emits a long Markdown setup guide (you can preview it
   independently with `storybook ai setup`).
2. Your agent follows the guide step by step, applying each change
   to your codebase.

### What the guide covers

1. **Analyze the codebase** — read providers, global CSS, portals, data-fetching patterns.
2. **Configure `preview.tsx`** — set up decorators, global styles, framework-level providers.
3. **Support portals** — ensure portal roots exist in the Storybook preview DOM.
4. **Mock side effects** — intercept network (MSW), storage, timers, navigation at the preview level rather than per-story.
5. **Write stories** for up to 10 components, from simple to complex, tagging them `ai-generated` for your review.
6. **Add play functions** — implement interaction tests for the most important flows.
7. **Cover additional patterns** — expand coverage across the components the agent has already touched.
8. **Verify with Vitest** — run every new story and the type checker.
9. **Install useful addons** — including `@storybook/addon-mcp` for the next stage.

### Preview the setup guide independently

```bash
storybook ai setup
# Prints to stdout — pipe into your agent's chat
storybook ai setup --output storybook-setup.md
# Writes to a file you can paste into agents without shell access
```

CLI options:

```
storybook ai setup [options]
  -c, --config-dir <dir>      .storybook directory (default: .storybook)
  --package-manager <type>    npm | pnpm | yarn
  --disable-telemetry
  --debug
  --loglevel <level>          trace | debug | info | warn | error | silent
  --logfile [path]            Writes debug logs to a file
```

### After setup completes

1. Run Storybook: `npm run storybook`.
2. Review configuration files (`.storybook/main.ts`, `.storybook/preview.tsx`).
3. Review stories tagged `ai-generated`. Remove the tag once you've
   validated each.
4. Connect the MCP server to your agent (next section).
5. Read the [Best practices](#best-practices) below to maximize agent
   effectiveness going forward.

## Manifests — the JSON your agent reads

Storybook generates two manifests automatically:

| Manifest | URL | Source | Purpose |
| --- | --- | --- | --- |
| **Components** | `/manifests/components.json` | CSF files + react-docgen prop extraction | What components exist, their props, their stories, code snippets |
| **Docs (MDX)** | `/manifests/docs.json` | MDX files | What standalone docs exist, with their raw content |

Both update live in dev. In a built Storybook, they live at the same
paths under `storybook-static/manifests/`.

### Enable the components manifest

```ts
// .storybook/main.ts
features: { componentsManifest: true },
```

(The docs manifest is on by default; the components manifest is opt-in
while the schema stabilizes.)

### Example components manifest entry

```json
{
  "components": {
    "components-button": {
      "id": "components-button",
      "name": "Button",
      "path": "./src/components/Button/Button.stories.tsx",
      "import": "import { Button } from \"@example/ui\";",
      "description": "Primary UI component for user interaction",
      "stories": [
        {
          "id": "components-button--default",
          "name": "Default",
          "snippet": "const Default = () => <Button>Click</Button>;"
        },
        {
          "id": "components-button--disabled",
          "name": "Disabled",
          "snippet": "const Disabled = () => <Button disabled>Click</Button>;"
        }
      ],
      "reactDocgen": {
        "displayName": "Button",
        "props": {
          "primary": { "tsType": { "name": "boolean" }, "description": "Use the brand color", "defaultValue": { "value": "false" } },
          "size":    { "tsType": { "name": "union", "elements": [/*...*/] }, "description": "Size", "defaultValue": { "value": "'medium'" } }
        }
      }
    }
  }
}
```

### Example docs manifest entry

```json
{
  "docs": {
    "design-system-typography--docs": {
      "id": "design-system-typography--docs",
      "name": "Docs",
      "path": "./src/docs/Typography.mdx",
      "title": "Design System/Typography",
      "content": "# Typography\n\n## Font: Hind ..."
    }
  }
}
```

### The manifest debugger

```
http://localhost:6006/manifests/components.html
```

Shows both manifests in a human-readable form with any parsing
errors / warnings highlighted at the top. Use this to check what the
agent will actually see.

### Recommended: use `react-docgen-typescript` for accuracy

```ts
// .storybook/main.ts
typescript: {
  reactDocgen: 'react-docgen-typescript',
  reactDocgenTypescriptOptions: {
    propFilter: (prop) => !prop.parent?.fileName?.includes('node_modules'),
  },
},
```

`react-docgen-typescript` resolves TypeScript types (including enums,
unions, inherited types) more accurately than the faster default
`react-docgen`. Trade-off: 5–30s slower startup. **Worth it for AI use
cases** because manifest accuracy directly affects agent code quality.

### Curating the manifest with the `manifest` tag

Every story and standalone MDX doc has the `manifest` tag applied by
default. Remove it to exclude from the manifest:

```ts
// Hide a single story:
export const AntiPattern: Story = { tags: ['!manifest'] };

// Hide all stories in a file:
const meta = { component: Legacy, tags: ['!manifest'] };

// Hide an MDX docs page:
```

```mdx
<Meta title="Internal Notes" tags={['!manifest']} />
```

Use this for:
- Antipattern stories (the agent shouldn't reuse them)
- Internal-only docs
- Deprecated components

### Subcomponents in the manifest

When a story file declares `subcomponents`, the components manifest
includes a `subcomponents` object so agents understand child-component
APIs even when those subcomponents aren't meant to be used standalone:

```ts
const meta = {
  component: List,
  subcomponents: { ListItem, ListSeparator },
} satisfies Meta<typeof List>;
```

## The MCP server

Storybook's MCP server connects your live Storybook to AI agents via
the [Model Context Protocol](https://modelcontextprotocol.io/) — a
standard for exposing tools to agents.

### Installation

```bash
npx storybook add @storybook/addon-mcp
```

Then with Storybook running, the MCP endpoint is at
`http://localhost:6006/mcp`. Open in a browser to see a splash page
listing available tools.

### Connect to your agent

```bash
npx mcp-add
# Prompts for: MCP server URL (http://localhost:6006/mcp)
#              Name (e.g., "my-project-sb-mcp")
```

`mcp-add` writes the right config for your detected agent (Claude
Code, Gemini CLI, Codex, VS Code Copilot, etc.). Or follow the agent's
own MCP documentation:

| Agent | Docs |
| --- | --- |
| Claude Code | https://code.claude.com/docs/en/mcp#option-1-add-a-remote-http-server |
| Google Gemini CLI | https://geminicli.com/docs/tools/mcp-server/#adding-an-http-server |
| OpenAI Codex | https://developers.openai.com/codex/mcp/ |
| VS Code Copilot | https://code.visualstudio.com/docs/copilot/customization/mcp-servers |

### Configure your agent's instructions

Add to `AGENTS.md` (or `CLAUDE.md` if you're on Claude):

```md
When working on UI components, always use the `my-project-sb-mcp` MCP
tools to access Storybook's component and documentation knowledge
before answering or taking any action.

- **CRITICAL: Never hallucinate component properties!** Before using
  ANY property on a component (including common-sounding ones like
  `shadow`), you MUST use the MCP tools to check if the property is
  actually documented for that component.
- Query `list-all-documentation` to get a list of all components.
- Query `get-documentation` for that component to see all available
  properties and examples.
- Only use properties that are explicitly documented or shown in
  example stories.
- If a property isn't documented, do not assume — check back with the
  user.
- Use `get-storybook-story-instructions` to fetch the latest
  conventions for creating or updating stories.
- Check your work by running `run-story-tests`.
```

Replace `my-project-sb-mcp` with whatever name you gave the server
during `mcp-add` configuration.

### Three toolsets

The MCP server exposes three toolsets. Toggle via addon options:

```ts
// .storybook/main.ts
addons: [{
  name: '@storybook/addon-mcp',
  options: {
    toolsets: {
      dev: true,
      docs: true,
      test: true,
    },
  },
}],
```

#### Development toolset (`dev`)

| Tool | Purpose |
| --- | --- |
| `get-storybook-story-instructions` | Returns guidance on how to write good stories for this project — which props to capture, how to write interaction tests, what tags to use. |
| `preview-stories` | Returns story previews rendered in the agent's chat interface (if the agent supports [MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview)). Otherwise returns story links. |

#### Docs toolset (`docs`)

| Tool | Purpose |
| --- | --- |
| `list-all-documentation` | Returns the index of all components + unattached docs pages. The starting point for any "what components do we have?" query. |
| `get-documentation` | For a specific component, returns its description, props, first 3 stories, and an index of remaining stories. |
| `get-documentation-for-story` | For a specific story, returns the full story content + associated docs. Use when `get-documentation` doesn't have enough detail. |

#### Testing toolset (`test`)

Requires Storybook Test (the Vitest addon — see `storybook-testing`).

| Tool | Purpose |
| --- | --- |
| `run-story-tests` | Runs tests for specific stories, returns results including a11y violations (if a11y is enabled). Includes instructions for the agent to interpret results and fix issues. |

### The self-healing loop

The killer feature of the MCP server is the **dev → test → fix → test**
cycle:

1. **Agent gets a prompt**: "Build a login form."
2. Calls `list-all-documentation` and `get-documentation` to find
   relevant components (TextInput, Button).
3. Generates a `LoginForm` component composing them.
4. Uses `preview-stories` to show you the result.
5. You like it.
6. Agent uses `run-story-tests` to verify. Tests reveal a color-
   contrast a11y violation on the submit button.
7. Agent uses `get-documentation` again to look up your theme colors.
8. Fixes the button to use a documented color.
9. Re-runs `run-story-tests` → passes.

The agent does all of this without your intervention — you just see
the final, verified result.

## Sharing the MCP server

Once your team gets the docs toolset (the most useful part for cross-
team reuse), they can query your components without running your
Storybook locally.

### Option 1: Chromatic (automatic)

When you [publish your Storybook to Chromatic](../storybook-sharing/SKILL.md#publish-storybook-with-chromatic),
the MCP server is automatically published too. Get the URL from your
Chromatic project page, share with teammates, done.

- Private Storybooks → private MCP server (access-controlled).
- Public Storybooks → public MCP server.

### Option 2: Self-host with `@storybook/mcp`

```bash
npm i @storybook/mcp
```

Minimal Node.js server:

```ts
// server.ts
import { createStorybookMcpHandler } from '@storybook/mcp';

const storybookMcpHandler = await createStorybookMcpHandler({
  // Where to find the manifests:
  manifestsBaseUrl: 'https://your-storybook.example.com',
  // Or a local path during dev:
  // manifestsBaseUrl: 'file:///path/to/storybook-static',
});

export async function handleRequest(request: Request): Promise<Response> {
  if (new URL(request.url).pathname === '/mcp') {
    return storybookMcpHandler(request);
  }
  return new Response('Not found', { status: 404 });
}
```

Prerequisites:
- Node.js 20+
- A manifest source containing `components.json` (required) and
  `docs.json` (optional)

Reference implementations:
- Node.js process: https://github.com/storybookjs/mcp/tree/main/apps/self-host-mcp
- Netlify Function: https://github.com/storybookjs/mcp/tree/main/apps/self-host-mcp

> Note: the development and testing toolsets only work against a
> *running* Storybook with the addon installed. Self-hosting and
> Chromatic only expose the **docs toolset**.

## Composition support

If you compose other Storybooks into yours via `refs` (see
`storybook-sharing` → "Storybook Composition") AND the composed
Storybooks have manifests, the MCP server **automatically merges their
content** into its responses.

This means an agent connected to your Storybook can also reference
components from your composed design system, partner libraries, etc.
— without separate MCP server configuration.

## Best practices

The quality of agent output depends on how well-documented your
components are. The good news: most of these best practices help human
developers too.

### Component summary + description

Add JSDoc above your component's exported declaration:

```ts
/**
 * Button is used for user interactions that do not navigate to another
 * route. For navigation, use [Link](?path=/docs/link--default) instead.
 *
 * @summary for user interactions that do not navigate to another route
 */
export const Button: React.FC<ButtonProps> = ({ onClick }) => { /* ... */ };
```

Storybook surfaces:
- `@summary` (if present) — the agent gets this first.
- Otherwise, a truncated version of the full description.

Use Markdown for formatting and cross-links.

### Prop descriptions

JSDoc above each prop:

```ts
export interface ButtonProps {
  /** The icon to render before the button text */
  icon?: ReactNode;
  /** Optional click handler */
  onClick?: () => void;
  /** Disable the button — useful for loading states */
  disabled?: boolean;
}
```

### Story descriptions + summaries

For each story, explain the **why**, not the **what**:

```ts
export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use the loading state when the underlying action is async and you need to prevent double-submits.',
      },
    },
  },
};
```

Or with `@summary` on a JSDoc above the export (more concise):

```ts
/**
 * Disabled state — use when an action can't currently be performed.
 *
 * @summary use when an action can't currently be performed
 */
export const Disabled: Story = { args: { disabled: true } };
```

### Standalone docs summaries

For unattached MDX docs:

```mdx
import { Meta } from '@storybook/addon-docs/blocks';

<Meta
  title="Design Tokens/Colors"
  summary="A list of our color tokens, their usages, and guidelines for using them."
/>
```

### What goes in the docs manifest

The MDX manifest is generated by **static analysis** — it captures the
literal MDX source. Dynamic content (e.g., color tokens rendered from
a JS array via `<ColorPalette>`) is **not** captured because the values
aren't in the source.

❌ Won't appear in the manifest:

```mdx
<ColorPalette>
  {colors.map((c) => <ColorItem key={c.name} color={c.value} name={c.name} />)}
</ColorPalette>
```

✅ Will appear:

```mdx
<ColorPalette>
  <ColorItem name="Brand Blue" colors={['#0050aa']} />
  <ColorItem name="Brand Pink" colors={['#ff4785']} />
</ColorPalette>
```

For tokens that the agent needs to know, write them out explicitly.

### Curating: provide enough context, not too much

Too little context → agent uses nonexistent properties.
Too much context → agent gets overwhelmed and underperforms.

Use the `manifest` tag to remove:
- Antipattern stories
- Deprecated components
- Showcase / kitchen-sink stories with too many variants
- Tests that don't double as usage examples

```ts
const meta = { tags: ['!manifest'] };
export const Showcase: Story = { tags: ['!manifest'] };
```

```mdx
<Meta title="Internal/Architecture Notes" tags={['!manifest']} />
```

## Common pitfalls

1. **`storybook ai setup` fails on a non-React project.** Currently
   React + Vite only. Use the generic install (`npm create storybook@latest`)
   and write stories manually.
2. **MCP tools return "no components found".** Check
   `http://localhost:6006/manifests/components.json` exists. If empty,
   enable `features.componentsManifest: true` in `main.ts`.
3. **MCP server returns stale data.** It reads from manifests, which
   update on every story file change. Refresh your browser or restart
   Storybook if updates aren't propagating.
4. **`run-story-tests` returns "test runner not configured".** You
   need the Vitest addon set up. See `storybook-testing` for the
   install steps.
5. **Agent invents non-existent props.** Improve the manifest:
   - Switch to `react-docgen-typescript`
   - Add JSDoc to your props
   - Update your AGENTS.md to remind the agent to verify
6. **Manifest is too large to send to the agent.** Tag heavy stories
   `!manifest`. The full manifest is meant for the agent's filter —
   the `list-all-documentation` tool returns just an index.
7. **`react-docgen-typescript` makes builds painfully slow.** Limit
   `include` paths and use `propFilter` aggressively to skip
   node_modules. Most projects don't need every transitive prop.
8. **Composed Storybook's MCP doesn't propagate.** The composed
   Storybook must have a manifest. If it's hosted on Chromatic,
   manifests are automatic. If self-hosted, ensure
   `features.componentsManifest: true` is set there too.
9. **`@summary` doesn't show up in the docs page.** The summary is for
   AI — the docs page uses the full description. To customize the
   docs description, use `parameters.docs.description.component`.
10. **My Storybook is private — does sharing the MCP server expose
    components?** With Chromatic, private Storybook → private MCP
    (same access control). Self-hosting → you control auth.

## See also

- `storybook-core` — install, CLI (`storybook ai setup`)
- `storybook-config` — `features.componentsManifest` flag
- `storybook-stories` — `tags: ['!manifest']` recipe, JSDoc patterns
- `storybook-docs` — MDX docs become part of the docs manifest
- `storybook-testing` — Vitest addon (required for `run-story-tests`)
- `storybook-sharing` — Chromatic publishing auto-publishes the MCP server
- `storybook-frameworks/references/react.md` — `react-docgen` vs `react-docgen-typescript`
