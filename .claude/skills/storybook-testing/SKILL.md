---
name: storybook-testing
description: >
  Testing UI components with Storybook — the whole testing surface area.
  Covers Storybook Test (the Vitest addon `@storybook/addon-vitest`,
  transformed stories → Vitest browser-mode tests, Playwright's Chromium
  default, watch mode in the Storybook UI, editor extensions, CLI
  `vitest --project=storybook`, `storybookScript` / `storybookUrl` for
  debugging, `tags.include/exclude/skip`, `configDir`, `disableAddonDocs`),
  the legacy test-runner (`@storybook/test-runner` — Jest + Playwright,
  full CLI flag table, `--index-json` mode, `--shard`, `--maxWorkers`,
  `--failOnConsole`, test-hook API with `prepare`/`setup`/`preVisit`/
  `postVisit`, getStoryContext / waitForPageReady helpers, `--includeTags`/
  `--excludeTags`/`--skipTags`, image snapshot recipe, auth headers
  via `getHttpHeaders`), interaction tests (the `play` function,
  Testing Library queries via `canvas` — `getByRole`/`findBy*`/`queryBy*`/
  `getAllBy*` query priorities, `screen` for outside-canvas queries —
  `userEvent` (click, dblClick, hover, type, keyboard, selectOptions,
  clear), `expect` matchers — `toBeInTheDocument`/`toBeVisible`/
  `toHaveAttribute`/`toHaveBeenCalled`/`toHaveBeenCalledWith`,
  `fn` spies with `mockReturnValue`/`mockResolvedValue`/
  `mockImplementation`/`mockName`, `mocked` typed wrapper, `spyOn`,
  `step` for grouping, `mount` for pre-render setup, `beforeAll` /
  `beforeEach` / `afterEach` lifecycle hooks at project/meta/story
  levels, debugging in the Interactions panel, permalinks for repros,
  shadow DOM testing for web components), accessibility tests (the
  `@storybook/addon-a11y` addon built on axe-core, default ruleset
  WCAG 2.0/2.1 A/AA + best practices, `parameters.a11y.config`/`options`/
  `context`/`test`, ruleset selection via `runOnly`, individual rule
  enable/disable, `parameters.a11y.test: 'off' | 'todo' | 'error'`
  workflow for incremental adoption, `developmentModeForBuild` for
  React `act()` integration to fix async-rendering false negatives,
  integration with the Vitest addon and the test-runner), visual tests
  (`@chromatic-com/storybook` addon, sign-in flow, baseline acceptance,
  GitHub/GitLab/Bitbucket/CircleCI/Travis/Jenkins/Azure CI integration,
  PR checks badging, `chromatic.config.json` options —
  `projectId`/`buildScriptName`/`debug`/`zip`, the
  why-visual-tests-are-better-than-snapshots case, comparison to other
  visual addons), snapshot tests (portable stories with Vitest/Jest/
  Playwright CT, `toMatchSnapshot()`, verifying expected errors with
  `Story.run()`/rejects-to-throw, replacement for deprecated Storyshots,
  test-runner-based snapshots as fallback), test coverage (built into
  Vitest addon via v8/Istanbul providers, `vitest --coverage` CLI flag,
  coverage report at `/coverage/index.html`, watermarks at 50/80,
  `coverage.provider` config, the why-all-tests-not-just-storybook
  argument for accurate coverage, IDE integrations via Vitest extension,
  test-runner `@storybook/addon-coverage` for non-Vite projects),
  CI integration (GitHub Actions / GitLab Pipelines / Bitbucket /
  CircleCI / Travis CI / Jenkins / Azure Pipelines starter workflows,
  Playwright Docker image `mcr.microsoft.com/playwright:vX.Y.Z-noble`,
  `SB_URL` env var pattern for linking to published Storybook, `deployment_status`
  trigger for Vercel/Netlify, coverage in CI, sharding tests across
  runners), reusing stories elsewhere (Cypress + `cy.mount`, Playwright
  E2E `page.goto('/iframe.html?id=...&viewMode=story')`, Jest/Vitest
  via portable stories with `composeStories` / `composeStory`, single-
  story render with `composeStory(story, meta, projectAnnotations)`),
  portable stories API (`composeStories(stories, projectAnnotations?)`,
  `composeStory(story, meta, projectAnnotations?, exportsName?)`,
  `setProjectAnnotations(annotations | annotations[])` in setup file,
  composed story exposes `.run()` / `.play()` / `.args` / `.argTypes` /
  `.parameters` / `.tags` / `.storyName`, the story pipeline — apply
  project annotations → compose → run via mount + play, overriding
  globals per story for testing different states, Vitest browser-mode
  setup, Jest setup with `jest.config.ts` + `setupFiles`, Playwright CT
  `createTest` factory for component tests, separate
  `Button.stories.portable.ts` file for the Playwright CT in-browser/in-
  node split, Next.js Jest config with `getPackageAliases` from
  `@storybook/nextjs/export-mocks`), mocking modules / network / providers
  (cross-reference to `storybook-stories`). Use whenever the user
  mentions testing in Storybook, Storybook Test, `addon-vitest`,
  `addon-test`, `storybook/test`, `fn()`, `spyOn`, `expect`, play function,
  interaction test, `@storybook/test-runner`, `test-storybook`, visual
  testing, Chromatic, accessibility test, axe-core, a11y addon,
  snapshot test, `toMatchSnapshot`, code coverage in Storybook,
  `vitest --coverage`, `composeStories`, `composeStory`,
  `setProjectAnnotations`, portable stories, Vitest browser mode,
  Playwright Component Tests, running stories in Jest, "test my
  components", "run my stories as tests", `play function`, mocking with
  fn or sb.mock from stories, debugging interaction tests, CI for
  Storybook, GitHub Actions Storybook test workflow, MSW handlers in
  stories for tests.
---

# Testing UI with Storybook

Storybook is a testing platform. Every story is a test case — the
fact that the story renders is itself a "render test" (smoke test).
Add a `play` function and you've added an interaction test. Enable the
Vitest addon and every story runs through Vitest's browser mode in CI.
Connect to Chromatic and every story becomes a visual baseline.

This skill covers everything in the `writing-tests/` docs section: the
Vitest addon, the legacy test-runner, interaction tests, accessibility,
visual, snapshot, coverage, in-CI, end-to-end integrations, and the
portable-stories API.

## The two test execution engines

| Engine | Package | When to use |
| --- | --- | --- |
| **Vitest addon (Storybook Test)** ⭐ | `@storybook/addon-vitest` | React, Preact, Vue, Svelte, Web Components — **Vite-based** projects only. Recommended. |
| **Test-runner (legacy)** | `@storybook/test-runner` | Angular, Webpack-based React/Next.js, Ember, any non-Vite framework. Still maintained. |

| Feature | Vitest addon | Test-runner |
| --- | --- | --- |
| Interaction tests | ✅ | ✅ |
| Accessibility tests | ✅ | ✅ |
| Visual tests | ✅ (via Visual Tests addon) | ❌ |
| Snapshot tests | ❌ (use portable stories) | ✅ |
| Storybook UI integration | ✅ (testing widget) | ❌ |
| Editor extensions | ✅ (Vitest extension) | ❌ |
| CLI | ✅ (`vitest --project=storybook`) | ✅ (`test-storybook`) |
| CI | ✅ | ✅ |
| Tests via | Vitest | Jest |
| All frameworks | ❌ (Vite-only) | ✅ |
| Real browser | ✅ (Playwright Chromium) | ✅ (Playwright) |
| Coverage | ✅ (native) | ✅ (with `addon-coverage`) |
| Requires running Storybook | ❌ | ✅ |
| Addon extensibility | ✅ | ❌ |

> If you're starting fresh and using a Vite-based framework: use the
> Vitest addon. If you're on Angular, Ember, or stuck on Webpack:
> use the test-runner.

## Storybook Test — the Vitest addon

The Vitest addon transforms every story into a real Vitest test using
the portable-stories API under the hood. Tests run in a Vitest browser
project (default: Playwright's Chromium browser).

### Install

```bash
npx storybook add @storybook/addon-vitest
```

This installs and configures the addon, sets up Vitest if you don't
have it, configures browser mode with Playwright Chromium, and asks if
you want to install Playwright browser binaries (say yes).

Manual setup (when the auto-installer can't handle your project): see
the [examples](#example-vitest-config-files) below.

### Project requirements

- Vite-based Storybook framework (`*-vite` packages, or
  `@storybook/nextjs-vite`)
- Vitest ≥ 3.0 (4.x recommended)
- (Optional) MSW ≥ 2.0 if you use the MSW addon

### Where tests run

1. **In the Storybook UI** — sidebar widget at the bottom of the sidebar.
2. **In the CLI** — `vitest --project=storybook`.
3. **In the editor** — Vitest's official VSCode extension or JetBrains
   integration.
4. **In CI** — exactly the same as the CLI invocation.

### Running tests in Storybook UI

Open Storybook, expand the testing widget at the bottom of the sidebar,
and click "Run tests". Status indicators appear next to each story
(green ✓ / red ✗ / yellow ⚠). Hover a story to see test results in a
menu and jump to the failure debugger.

Sub-test types (visible when you expand the widget):
- **Component tests** — render + play function execution
- **Accessibility** — when `@storybook/addon-a11y` is installed
- **Visual tests** — when `@chromatic-com/storybook` is installed
- **Coverage** — toggle to compute coverage during the run

Watch mode (eye icon) re-runs tests as you edit. Coverage and watch mode
are mutually exclusive — enabling watch disables coverage.

### CLI

```json
// package.json
{ "scripts": {
  "test": "vitest",
  "test-storybook": "vitest --project=storybook",
  "test-storybook:watch": "vitest --project=storybook --watch",
  "test-storybook:coverage": "vitest --project=storybook --coverage"
} }
```

### Debugging via story links

When tests fail in the CLI, the addon prints a story URL so you can
debug visually. By default the URL is `http://localhost:6006/...`. In
CI, override:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

export default defineConfig({
  test: {
    projects: [{
      plugins: [storybookTest({
        configDir: '.storybook',
        storybookUrl: process.env.SB_URL ?? 'http://localhost:6006',
        storybookScript: 'npm run storybook',  // auto-starts Storybook in watch mode
      })],
      browser: { enabled: true, provider: 'playwright', name: 'chromium' },
    }],
  },
});
```

### Example Vitest config files

Simple inline (most projects):

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

export default defineConfig({
  plugins: [storybookTest({ configDir: '.storybook' })],
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

Workspace form (Vitest < 3.2):

```ts
// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

export default defineWorkspace([
  './vitest.config.ts',
  {
    extends: './vitest.config.ts',
    plugins: [storybookTest({ configDir: '.storybook' })],
    test: {
      name: 'storybook',
      browser: { enabled: true, provider: 'playwright', headless: true, instances: [{ browser: 'chromium' }] },
      setupFiles: ['./vitest.setup.ts'],
    },
  },
]);
```

### Plugin options (`storybookTest({...})`)

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `configDir` | `string` | `.storybook` | Storybook config directory. **Required if non-default.** |
| `storybookScript` | `string` | – | If provided AND `storybookUrl` is not already serving, this script is run to start Storybook in watch mode. |
| `storybookUrl` | `string` | `http://localhost:6006` | Used for links in failure messages and (internally) to check if Storybook is running. |
| `tags` | `{ include, exclude, skip }` | `{ include: ['test'], exclude: [], skip: [] }` | See [Including/excluding tests](#includingexcludingskipping-tests). |
| `disableAddonDocs` | `boolean` | `true` | Disable MDX parsing during tests (faster). Set to `false` if stories actually need MDX. |

### Including/excluding/skipping tests

The Vitest addon uses Storybook tags by default:

```ts
storybookTest({
  tags: { include: ['test'], exclude: [], skip: [] },
}),
```

- **`include`** — story must have at least one matching tag to be tested.
- **`exclude`** — story is **not tested** and **not counted** in results.
- **`skip`** — story is not tested but **is counted** (shown as skipped).

If a tag is in both `include` and `exclude`, exclude wins.

Then in stories:

```ts
const meta = { tags: ['stable'] } satisfies Meta<typeof Button>;
export const Experimental: Story = { tags: ['experimental'] };
```

```ts
storybookTest({
  tags: { exclude: ['experimental'] },
}),
```

### Vitest plugin exports

```ts
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
```

That's the only export.

## Interaction tests

A **play function** runs after the story renders. With the Vitest
addon, it becomes the body of a real Vitest test.

### Basic example

```ts
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  component: LoginForm,
  args: { onSubmit: fn() },
} satisfies Meta<typeof LoginForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SubmitsValidCredentials: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'user@example.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'hunter2');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }));
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'hunter2',
    });
  },
};
```

### Querying with `canvas`

`canvas` is a scoped Testing Library instance bound to the story's root
element. Query priorities (mirror Testing Library upstream):

| Query type | Returns | Throws if | Awaited |
| --- | --- | --- | --- |
| `canvas.getBy*` | element | 0 or >1 matches | no |
| `canvas.queryBy*` | element \| null | >1 matches | no |
| `canvas.findBy*` | element | 0 or >1 matches | **yes** (default 1s timeout) |
| `canvas.getAllBy*` | element[] | 0 matches | no |
| `canvas.queryAllBy*` | element[] | – | no |
| `canvas.findAllBy*` | element[] | 0 matches | **yes** |

Query subjects, in **preferred order**:

1. `ByRole(role, { name, level, hidden, ... })` — best-practice
2. `ByLabelText(text)` — form fields
3. `ByPlaceholderText(text)`
4. `ByText(text)`
5. `ByDisplayValue(value)` — current value of `<input>`/`<textarea>`/`<select>`
6. `ByAltText(text)`
7. `ByTitle(text)`
8. `ByTestId(id)` — last resort

### Querying outside the canvas — `screen`

For portaled dialogs, popovers, tooltips that render outside the story
root:

```ts
import { screen } from 'storybook/test';

play: async () => {
  await userEvent.click(canvas.getByText('Open menu'));
  const item = await screen.findByRole('menuitem', { name: 'Settings' });
  await userEvent.click(item);
},
```

### Querying inside shadow DOM (Web Components)

Install `shadow-dom-testing-library` and register the queries in
`preview.ts` (see `storybook-frameworks/references/web-components.md`).
Then use `findByShadowRole(...)`, `getByShadowText(...)`, etc.

### `userEvent` — simulating user actions

Always `await` everything:

| Method | Example |
| --- | --- |
| `click` | `await userEvent.click(canvas.getByRole('button'))` |
| `dblClick` | `await userEvent.dblClick(elem)` |
| `hover` / `unhover` | `await userEvent.hover(elem)` / `await userEvent.unhover(elem)` |
| `tab` | `await userEvent.tab()` |
| `type` | `await userEvent.type(canvas.getByLabelText('Email'), 'a@b.c')` |
| `keyboard` | `await userEvent.keyboard('{Shift>}A{/Shift}')` |
| `clear` | `await userEvent.clear(canvas.getByLabelText('Email'))` |
| `selectOptions` | `await userEvent.selectOptions(canvas.getByRole('listbox'), ['1','2'])` |
| `deselectOptions` | `await userEvent.deselectOptions(canvas.getByRole('listbox'), '1')` |

> Without `await`, interactions don't show up in the Interactions panel
> and timing-based assertions become flaky.

### `expect` — assertions

```ts
import { expect } from 'storybook/test';
```

Combines Vitest's `expect` matchers with `@testing-library/jest-dom`:

| Matcher | Example |
| --- | --- |
| `toBeInTheDocument()` | `await expect(canvas.getByRole('alert')).toBeInTheDocument()` |
| `toBeVisible()` | `await expect(elem).toBeVisible()` |
| `toHaveAttribute(name, value?)` | `await expect(button).toHaveAttribute('aria-disabled', 'true')` |
| `toHaveTextContent(text)` | `await expect(label).toHaveTextContent('Success')` |
| `toHaveValue(value)` | `await expect(input).toHaveValue('hello')` |
| `toHaveBeenCalled()` | `await expect(args.onClick).toHaveBeenCalled()` |
| `toHaveBeenCalledWith(...)` | `await expect(args.onClick).toHaveBeenCalledWith({ id: 1 })` |
| `toHaveBeenCalledTimes(n)` | `await expect(args.onClick).toHaveBeenCalledTimes(2)` |

Full reference: [jest-dom matchers](https://github.com/testing-library/jest-dom),
[Vitest expect](https://vitest.dev/api/expect.html).

### `fn` — function spies (the canonical Storybook spy)

```ts
import { fn } from 'storybook/test';

const meta = {
  component: Button,
  args: { onClick: fn() },                  // spy automatically logs as Action
} satisfies Meta<typeof Button>;
```

Spy methods:

```ts
args.onClick.mockReturnValue(true);
args.onClick.mockResolvedValue({ id: 1 });
args.onClick.mockRejectedValue(new Error('fail'));
args.onClick.mockImplementation((x) => x * 2);
args.onClick.mockName('handleClick');       // labels it in the Actions panel
args.onClick.mockClear();
args.onClick.mockReset();
args.onClick.mockRestore();
```

### `mocked` — typed wrapper around vi.mocked

For mocked imports (set up via `sb.mock` — see `storybook-stories` →
"Mocking modules"):

```ts
import { mocked } from 'storybook/test';
import * as session from '../lib/session';

beforeEach: async () => {
  mocked(session.getUserFromSession).mockReturnValue({ name: 'Test' });
},
```

`mocked()` preserves the original function signature as a
`MockedFunction<T>` overlay.

### `spyOn` — spy on existing module exports

```ts
import { spyOn } from 'storybook/test';
import * as api from '../lib/api';

beforeEach: async () => {
  spyOn(api, 'fetchUser').mockName('fetchUser').mockResolvedValue({ id: 1 });
},
```

### Grouping with `step`

```ts
play: async ({ canvas, step }) => {
  await step('Fill the form', async () => {
    await userEvent.type(canvas.getByLabelText('Email'), 'a@b.c');
    await userEvent.type(canvas.getByLabelText('Password'), 'pw');
  });
  await step('Submit', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
  });
},
```

The Interactions panel groups assertions under each step label.

### `mount` — code that runs before component mounts

Sometimes you need to do setup work *before* the component renders
(e.g., to set up mocks the component reads at mount time, or to
provide dynamic props):

```ts
play: async ({ mount, args, canvas }) => {
  // Set up date BEFORE component mounts so its render is consistent:
  MockDate.set('2026-05-18');

  // Now mount the component (with optionally-different args/component):
  await mount(<Page {...args} initialNote={await fetchNote(args.id)} />);

  // After mount, regular interactions:
  await userEvent.click(canvas.getByText('Edit'));
},
```

Requirements:
1. **Destructure `mount` from the play function's context.** This tells
   Storybook to skip the default render and let you control it.
2. Your Storybook builder must transpile to **ES2017+** (otherwise
   the destructuring + async/await pattern doesn't survive
   transpilation).

If you call `mount()` with **no arguments**, the story's normal render
function runs.

### Lifecycle hooks

| Hook | Where | Runs |
| --- | --- | --- |
| `beforeAll` | `.storybook/preview.ts` | Once per test run, before any stories. Returns cleanup. |
| `beforeEach` | preview, meta, or story | Before each story render. Returns cleanup. |
| `afterEach` | preview, meta, or story | After story renders + play finishes. For post-render assertions only. **Don't use to reset state** — that's `beforeEach`'s cleanup. |

```ts
// .storybook/preview.ts
const preview: Preview = {
  beforeAll: async () => {
    await bootstrapApp();
    return () => teardownApp();
  },
  beforeEach: async () => {
    MockDate.set('2026-05-18');
    return () => MockDate.reset();    // cleanup
  },
  afterEach: async ({ canvas }) => {
    // assertions on final state — not for resetting!
  },
};
```

> `fn()` spies are restored automatically before each story (via
> `parameters.test.restoreMocks: true` by default).

### Debugging interaction tests

- **Interactions panel** — shows step-by-step execution with pause/
  resume/step controls. Click a failed step to jump to the assertion.
- **Permalinks** — the story URL is a fully reproducible test case;
  share it for debugging.
- **Failure links in CI** — when `storybookUrl` is set, failures
  print a link to the failing story in the published Storybook.

## Accessibility tests

Powered by `@storybook/addon-a11y` (built on Deque's
[axe-core](https://github.com/dequelabs/axe-core)).

### Install

```bash
npx storybook add @storybook/addon-a11y
```

### Configure

```ts
// .storybook/preview.ts
const preview: Preview = {
  parameters: {
    a11y: {
      context: 'body',                                   // axe.run scope
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
      options: { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } },
      test: 'error',                                     // 'off' | 'todo' | 'error'
    },
  },
  globals: {
    a11y: { manual: false },                              // set true to disable auto-runs
  },
};
```

### `parameters.a11y.test` — workflow control

| Value | Behavior |
| --- | --- |
| `'off'` | No automated tests. Manual checks still possible via the addon panel. |
| `'todo'` | Tests run; violations show as **warnings** in Storybook UI only. Use to mark known-broken components. |
| `'error'` | Tests run; violations show as **failing tests** in both UI and CI. |

### Rulesets

Default: WCAG 2.0/2.1 Level A & AA + best practices. Override:

```ts
parameters: {
  a11y: {
    options: {
      runOnly: { type: 'tag', values: ['wcag22aa'] },     // WCAG 2.2 AA only
      // OR explicit rule IDs:
      runOnly: { type: 'rule', values: ['color-contrast', 'label'] },
    },
  },
},
```

Full ruleset list at
`https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md`.

### Disable a specific rule

```ts
// In a story:
parameters: {
  a11y: { config: { rules: [{ id: 'region', enabled: false }] } },
},
```

Storybook globally disables the `region` rule by default (it doesn't
apply to isolated components and causes noise).

### Exclude elements from checks

```ts
parameters: {
  a11y: {
    context: { exclude: ['.no-a11y-check'] },
  },
},
```

### Disable auto-checks for a story

```ts
globals: { a11y: { manual: true } },
```

Useful for stories that demonstrate antipatterns.

### Workflow recommendation — incremental adoption

```ts
// 1. Set project-level default: fail on violations
// .storybook/preview.ts
parameters: { a11y: { test: 'error' } },

// 2. Triage existing failures: temporarily warn instead of fail
// in MyComponent.stories.tsx
parameters: { a11y: { test: 'todo' } },

// 3. Fix violations one by one, then remove the parameter:
// (no override needed — inherits project default 'error')
```

### Run via Vitest addon

Just enable the Accessibility checkbox in the testing widget. Or, in CI,
the tests run automatically for stories where `test === 'error'`.

### Run via test-runner

Set `parameters.a11y.test` and the test-runner picks it up. No extra
config needed.

### React `act()` and async components

If your accessibility tests have **false negatives** (no violations
reported even when you can see them in the Storybook UI), it's likely
because async React components (Suspense, RSC) hadn't finished
rendering when axe ran. Enable the `developmentModeForBuild` feature
flag:

```ts
// .storybook/main.ts
features: { developmentModeForBuild: true },
```

This sets `NODE_ENV=development` in built Storybook, enabling React's
`act()` utility which ensures all updates are flushed before
assertions.

## Visual tests

Use `@chromatic-com/storybook` (made by the Storybook team) for cloud-
based cross-browser visual testing.

### Install

```bash
npx storybook add @chromatic-com/storybook
```

A "Visual Tests" tab appears in the addon panel.

### First-time setup

1. Click the Visual Tests panel.
2. Sign in to Chromatic (or sign up — free for personal projects).
3. Pick a project or create one.
4. Click **"Catch a UI change"** to take baseline snapshots.

### Workflow

After making code changes:

1. Run visual tests (UI panel or testing widget).
2. Changed stories are 🟡 highlighted in the sidebar.
3. Open the Visual Tests panel to see pixel diffs.
4. **Accept** intentional changes (updates the baseline locally).
5. Push your code — accepted baselines sync to the cloud.

### CI integration

Automate `chromatic` in CI to scan PRs:

| CI provider | Docs |
| --- | --- |
| GitHub Actions | https://chromatic.com/docs/github-actions |
| GitLab Pipelines | https://chromatic.com/docs/gitlab |
| Bitbucket | https://chromatic.com/docs/bitbucket-pipelines |
| CircleCI | https://chromatic.com/docs/circleci |
| Travis CI | https://chromatic.com/docs/travisci |
| Jenkins | https://chromatic.com/docs/jenkins |
| Azure Pipelines | https://chromatic.com/docs/azure-pipelines |

Example GitHub Actions:

```yaml
# .github/workflows/chromatic.yml
name: Chromatic
on: push
jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: npm ci
      - uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

### `chromatic.config.json`

```json
{
  "projectId": "Project:64cbcde96f99841e8b007d75",
  "buildScriptName": "build-storybook",
  "debug": true,
  "zip": true
}
```

`zip: true` is recommended for large projects (uploads as a single zip
rather than thousands of small files).

Full option list:
https://www.chromatic.com/docs/configure/#options

### Visual vs snapshot tests

| Visual | Snapshot |
| --- | --- |
| Compares **rendered pixels** | Compares **DOM/HTML strings** |
| Catches real visual regressions | Catches DOM-structure changes (often noisy) |
| Easy to review (diff images) | Hard to spot semantic changes in HTML diffs |
| Cross-browser | Single representation |
| Cloud cost | Free (local) |

For most projects, visual tests + interaction tests + accessibility
tests give complete coverage with less false-positive noise than
snapshot tests. Snapshot tests are valuable for verifying expected
*errors* (see below).

## Snapshot tests

Use the **portable stories API** (`composeStories`) to render stories
in Vitest/Jest, then call `toMatchSnapshot()`:

```ts
// Button.test.ts
// @vitest-environment jsdom
import { expect, test } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react-vite';
import * as stories from './Button.stories';

const { Primary } = composeStories(stories);

test('Button primary matches snapshot', async () => {
  const { container } = render(<Primary />);
  expect(container).toMatchSnapshot();
});
```

If snapshots don't match, Vitest shows the diff. Update with
`vitest --update-snapshot` after confirming the change is intentional.

### Verifying an expected error

```tsx
// Button.tsx
function Button(props) {
  if (props.doNotUseThisItWillThrowAnError) throw new Error('I tried to tell you...');
  return <button {...props} />;
}

// Button.stories.js
export const ThrowError = {
  tags: ['!dev', '!test'],          // hide from sidebar, exclude from regular tests
  args: { doNotUseThisItWillThrowAnError: true },
};

// Button.test.ts
test('Button throws error', async () => {
  await expect(ThrowError.run()).rejects.toThrowError('I tried to tell you...');
});
```

### Test-runner snapshots (fallback for non-portable-stories setups)

The test-runner can also emit snapshots via its hook API — see [Test-
runner](#test-runner-legacy) below.

## Test coverage

Built into the Vitest addon (and via `addon-coverage` for the
test-runner).

### Enable

In Storybook UI: check the Coverage box in the testing widget.

In CLI:

```bash
vitest --project=storybook --coverage
```

Generates an HTML report at the configured `reportsDirectory`
(default `./coverage/`). Served at `/coverage/index.html` of running
Storybook.

### Install coverage support packages

```bash
# v8 (default)
npm i -D @vitest/coverage-v8
# OR Istanbul (more accurate but slower)
npm i -D @vitest/coverage-istanbul
```

### Configure

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',                     // 'v8' (default) | 'istanbul'
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      watermarks: { statements: [50, 80] },  // [low, high] — red/orange/green
      // Vitest auto-includes everything imported by your tests; refine with:
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.stories.*', '**/index.ts'],
    },
  },
});
```

### Storybook UI limitations

1. Coverage is computed only from **your stories**, not other Vitest
   tests.
2. Coverage is project-wide — you can't compute it for a single story.
3. **Watch mode disables coverage** (and vice versa).

### Coverage in CI

```bash
# Best practice: include ALL tests (stories + unit + integration) for accurate coverage
npm run test -- --coverage

# Or only Storybook:
npm run test-storybook -- --coverage
```

### Test-runner coverage (legacy)

For non-Vite projects, install `@storybook/addon-coverage`:

```bash
npx storybook add @storybook/addon-coverage
```

Then:

```bash
test-storybook --coverage
```

Reports go to `coverage/storybook/coverage-storybook.json`. Convert to
LCOV with `nyc report --reporter=lcov`.

Build-time options are documented at
`sources/storybook/docs/writing-tests/integrations/test-runner.mdx`.

## In CI

The basic pattern is "run the same `vitest --project=storybook` (or
`test-storybook`) command you run locally, in a CI container with
Playwright pre-installed."

### Recommended Docker image

```
mcr.microsoft.com/playwright:v1.58.2-noble
```

Always grab the latest version from
[Playwright Docker docs](https://playwright.dev/docs/docker#pull-the-image).

### Generic GitHub Actions

```yaml
# .github/workflows/test-ui.yml
name: UI Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.58.2-noble
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22.12.0 }
      - run: npm ci
      - run: npm run test-storybook
```

### Link test failures to published Storybook

Run your CI on a `deployment_status` trigger so it fires after Vercel/
Netlify publishes the new Storybook, and pass the URL:

```yaml
on: deployment_status
jobs:
  test:
    runs-on: ubuntu-latest
    container: { image: mcr.microsoft.com/playwright:v1.58.2-noble }
    if: github.event_name == 'deployment_status' && github.event.deployment_status.state == 'success'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22.12.0 }
      - run: npm ci
      - run: npm run test-storybook
        env:
          SB_URL: '${{ github.event.deployment_status.environment_url }}'
```

In `vitest.config.ts`:

```ts
storybookTest({ storybookUrl: process.env.SB_URL ?? 'http://localhost:6006' })
```

### Other CI providers

The patterns are equivalent — install Node, install deps, run
`npm run test-storybook`. Recipes at
`sources/storybook/docs/writing-tests/in-ci.mdx` for GitLab, Bitbucket,
CircleCI, Travis, Jenkins, Azure.

### Running other Vitest tests alongside

```json
{
  "scripts": {
    "test-storybook": "vitest --project=storybook",
    "test-unit": "vitest --project=unit",
    "test-all": "vitest"
  }
}
```

```yaml
- run: |
    npm run test-unit
    npm run test-storybook
```

Or just `npm run test-all` for everything in one shot.

## Reusing stories in other test environments

Stories are plain ES modules — they're reusable wherever JavaScript
runs.

### In Cypress (E2E)

```ts
// component-cypress-test.cy.ts
describe('LoginForm', () => {
  it('submits valid credentials', () => {
    cy.visit('http://localhost:6006/iframe.html?id=auth-loginform--filled-form&viewMode=story');
    cy.get('input[name=email]').should('have.value', 'user@example.com');
  });
});
```

### In Playwright (E2E)

```ts
// component-playwright-test.spec.ts
import { test, expect } from '@playwright/test';

test('LoginForm submits valid credentials', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=auth-loginform--filled-form&viewMode=story');
  await expect(page.getByLabel('Email')).toHaveValue('user@example.com');
});
```

The URL pattern is `?id=<storyId>&viewMode=story`. Find story IDs in
the URL when viewing a story in Storybook.

### In Vitest / Jest (Unit) — portable stories

```ts
// Button.test.ts
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react-vite';
import * as stories from './Button.stories';

const { InvalidCredentials } = composeStories(stories);

test('Shows error on bad password', async () => {
  await InvalidCredentials.run();              // mounts + runs play
  expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
});
```

## Portable stories API

The Vitest addon uses this internally. You only need it directly when
you can't use the Vitest addon (Jest, Playwright CT, or non-Vite
Storybook).

### Three steps

1. **Apply project annotations** in a setup file
   (`setProjectAnnotations(...)`).
2. **Compose stories** (`composeStories(stories)` or `composeStory(...)`).
3. **Run** — `await Story.run()` mounts + executes lifecycle hooks +
   runs play. Or render manually with `<Story.Component {...props} />`.

### Vitest setup

```ts
// vitest.setup.ts
import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/react-vite';
import * as previewAnnotations from './.storybook/preview';
import * as a11yAnnotations from '@storybook/addon-a11y/preview';

const annotations = setProjectAnnotations([previewAnnotations, a11yAnnotations]);

beforeAll(annotations.beforeAll);
```

With **CSF Next**, the setup is simpler:

```ts
import { beforeAll } from 'vitest';
import preview from './.storybook/preview';
beforeAll(preview.composed.beforeAll);
```

### Jest setup

```ts
// jest.setup.ts
import { setProjectAnnotations } from '@storybook/react';     // note: not @storybook/react-vite
import * as previewAnnotations from './.storybook/preview';
setProjectAnnotations([previewAnnotations]);
```

```js
// jest.config.js
module.exports = {
  setupFiles: ['./jest.setup.ts'],
  testEnvironment: 'jsdom',
};
```

### Playwright CT setup

Compose stories in a **separate file** because Playwright transforms
test files and runs parts in Node vs the browser:

```ts
// Button.stories.portable.ts (runs in browser)
import { composeStories } from '@storybook/react-vite';
import * as stories from './Button.stories';
export default composeStories(stories);
```

```ts
// Button.test.ts (runs in Node + browser per Playwright CT model)
import { createTest } from '@storybook/react-vite/experimental-playwright';
import { test as base } from '@playwright/experimental-ct-react';
import portableStories from './Button.stories.portable';

const test = createTest(base);

test('Primary renders', async ({ mount }) => {
  const component = await mount(<portableStories.Primary />);
  await expect(component).toContainText('Click me');
});
```

In `playwright/index.ts`:

```ts
import { setProjectAnnotations } from '@storybook/react-vite';
import * as previewAnnotations from '../.storybook/preview';
setProjectAnnotations([previewAnnotations]);
```

### `composeStories(csfExports, projectAnnotations?)`

Returns `Record<string, ComposedStoryFn>`. Each composed story has:

| Property | Type | Description |
| --- | --- | --- |
| `args` | `Record<string, any>` | Story args |
| `argTypes` | `ArgType` | Story argTypes |
| `id` | `string` | Story ID |
| `parameters` | `Record<string, any>` | Story parameters |
| `play` | `(context) => Promise<void>` | Just the play function |
| `run` | `(context) => Promise<void>` | Mounts + runs hooks + runs play |
| `storyName` | `string` | Display name |
| `tags` | `string[]` | Story tags |
| `.Component` (CSF Next only) | React component | The story as a renderable component |
| `.composed.{args, parameters, beforeAll}` (CSF Next only) | merged values | See `storybook-stories` → "CSF Next" |

### `composeStory(story, meta, projectAnnotations?, exportsName?)`

For a single story:

```ts
import { composeStory } from '@storybook/react-vite';
import * as stories from './Button.stories';
import meta from './Button.stories';

const Primary = composeStory(stories.Primary, meta);
await Primary.run();
```

### `setProjectAnnotations`

Called once per test process, typically in a setup file. Accepts either
a single annotation set or an array (later annotations override
earlier ones).

```ts
setProjectAnnotations([
  // Order matters — later wins
  previewAnnotations,
  a11yAnnotations,
  msw_storybook_addon_annotations,
]);
```

### Override globals per story

```ts
const StoryInSpanish = composeStory(
  stories.Default,
  meta,
  { globals: { locale: 'es' } },              // 3rd arg = annotations override
);
await StoryInSpanish.run();
```

### The story pipeline (what `.run()` actually does)

1. **Apply project annotations** — decorators, parameters, loaders,
   globals from all sets.
2. **Compose story** — merge story + meta + project annotations.
3. **Run** — execute loaders, mount component (with decorators
   wrapped), execute `play` function, return final result.

If your `play` contains `expect` assertions, failures propagate as
test failures.

## Test-runner (legacy)

The original Jest+Playwright test runner. Still recommended for
non-Vite frameworks (Angular, Webpack-based React, Ember).

> If you're using a Vite framework, prefer the Vitest addon. See
> [Migration from test-runner →](#migrating-from-test-runner-to-vitest-addon).

### Install

```bash
npx storybook add @storybook/test-runner
# Or manually:
npm i -D @storybook/test-runner
```

```json
{ "scripts": { "test-storybook": "test-storybook" } }
```

### Run

```bash
npm run storybook       # in one terminal — test-runner requires a running Storybook
npm run test-storybook  # in another
```

### Run against a deployed Storybook

```bash
test-storybook --url https://my-storybook.example.com
# or:
TARGET_URL=https://my-storybook.example.com test-storybook
```

### Full CLI flag table

| Flag | Notes |
| --- | --- |
| `--watch` / `--watchAll` | Re-run on file changes |
| `-c`, `--config-dir <dir>` | Storybook config dir |
| `--url <url>` | Target Storybook URL |
| `--browsers chromium firefox webkit` | Multiple browsers |
| `--maxWorkers <n>` | Parallelism |
| `--testTimeout <ms>` | Per-test timeout |
| `--shard <i/n>` | Distribute across CI runners |
| `--coverage` | Generate coverage |
| `--coverageDirectory <dir>` | Custom output |
| `--no-cache` / `--clearCache` | Disable / clear Jest cache |
| `--verbose` | Per-test results |
| `-u`, `--updateSnapshot` | Re-record snapshots |
| `--eject` | Generate `test-runner-jest.config.js` for customization |
| `--json --outputFile results.json` | JSON output |
| `--junit` | JUnit format |
| `--ci` | Fail on missing snapshots instead of writing them |
| `--failOnConsole` | Fail on browser console errors |
| `--includeTags "test-only,pages"` | Filter by tag |
| `--excludeTags "no-tests,tokens"` | Exclude by tag |
| `--skipTags "skip-test,layout"` | Skip + mark in output |
| `-s`, `--index-json` | Use Storybook's `/index.json` (for remote Storybooks) |
| `--no-index-json` | Disable index.json mode |

### Custom config (`.storybook/test-runner.ts`)

```bash
test-storybook --eject     # generates test-runner-jest.config.js
```

### Test hook API

```ts
// .storybook/test-runner.ts
import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext, waitForPageReady } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  setup() {
    // runs once before all tests
  },

  async prepare({ page, browserContext, testRunnerConfig }) {
    // runs once per browser context
  },

  async preVisit(page, context) {
    // before each story renders
  },

  async postVisit(page, context) {
    // after each story is rendered + play has run

    // Adjust viewport based on story parameters:
    const storyContext = await getStoryContext(page, context);
    const viewport = storyContext.parameters.viewport;
    if (viewport) {
      await page.setViewportSize({ width: parseInt(viewport.width), height: parseInt(viewport.height) });
    }

    await waitForPageReady(page);          // for image-snapshot stability
  },
};

export default config;
```

### Image snapshot recipe (test-runner)

```ts
// .storybook/test-runner.ts
import { toMatchImageSnapshot } from 'jest-image-snapshot';
expect.extend({ toMatchImageSnapshot });

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    await waitForPageReady(page);
    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: `${__dirname}/__image_snapshots__`,
      customSnapshotIdentifier: context.id,
    });
  },
};

export default config;
```

The Vitest addon doesn't yet do image snapshots; for image snapshots
on Vite projects, use the [Visual Tests addon](https://storybook.js.org/addons/@chromatic-com/storybook)
or community alternatives like
[`storybook-addon-vis`](https://github.com/repobuddy/visual-testing).

### Auth headers for protected Storybooks

```ts
// .storybook/test-runner.ts
const config: TestRunnerConfig = {
  getHttpHeaders: async (url) => {
    if (url.includes('private.example.com')) {
      return { Authorization: `Bearer ${process.env.SB_TOKEN}` };
    }
    return {};
  },
};
```

### `index.json` mode

For remote Storybooks where the source isn't available:

```bash
test-storybook --url https://remote.example.com --index-json
```

Storybook must serve `/index.json` (auto-generated since v7). Verify by
opening `https://remote.example.com/index.json` in a browser.

## Migrating from test-runner to Vitest addon

For React/Preact/Vue/Svelte/Web Components projects on Vite (or
Next.js Vite), migrate to the Vitest addon for a better experience.

### Steps

1. **Remove** `@storybook/test-runner` and `@storybook/addon-coverage`
   from `package.json` `devDependencies`.
2. **Delete** `test-runner-jest.config.js` and `.storybook/test-runner.ts`.
3. **Run** the install command:
   ```bash
   npx storybook add @storybook/addon-vitest
   ```
4. **Update** `package.json` script:
   ```diff
   - "test-storybook": "test-storybook"
   + "test-storybook": "vitest --project=storybook"
   ```
5. **Update CI workflow** to replace the build/serve/wait flow with a
   single `vitest` invocation. See [In CI](#in-ci).
6. **Image snapshots?** Use the [Chromatic Visual Tests addon](https://www.chromatic.com/storybook/)
   (cloud) or [`storybook-addon-vis`](https://github.com/repobuddy/visual-testing)
   (local).

### When you can't migrate

Stick with the test-runner if:
- You're on Webpack/Rspack and can't move to Vite.
- Your renderer isn't supported by the Vitest addon (Angular, Ember,
  Qwik, SolidJS, etc.).
- You depend on a test-runner hook that doesn't have an equivalent
  (the `prepare` hook is the most common case — file a Storybook
  discussion if this affects you).

## Mocking — quick links

The mocking story is detailed in `storybook-stories` → "Mocking data
and modules". Quick reference:

| Need | Approach |
| --- | --- |
| Spy / control a function arg | `fn()` from `storybook/test`, then `mocked(fn).mockReturnValue(...)` |
| Replace a JS module import | `sb.mock(import('./lib/...'))` in `preview.ts`, optionally with `__mocks__/` file |
| Intercept network requests | `msw-storybook-addon` + `parameters.msw.handlers` |
| Provide a context (React, Preact, Solid) | Wrap stories in a decorator that injects the mocked provider |
| Mock `Date` for time-sensitive stories | `mockdate` package in `beforeEach` |
| Restore mocks between stories | Automatic via `parameters.test.restoreMocks: true` (default) |
| Mock Next.js internals | `@storybook/nextjs-vite/{cache,headers,navigation,router}.mock` (see frameworks/nextjs) |
| Mock SvelteKit `$app/*` | `parameters.sveltekit_experimental.{navigation,forms,stores,state,hrefs}` (see frameworks/sveltekit) |
| Mock TanStack Start server functions | Automatic — use `mocked(serverFn).mockResolvedValue(...)` (see frameworks/tanstack-react) |

## FAQ

### What's the difference between interaction tests and visual tests?

Interaction tests **verify behavior** (clicks, form submissions, state
transitions). Visual tests **catch appearance regressions**
(colors, spacing, layout). Use both — they're complementary.

### What's the difference between the Vitest addon and writing Vitest tests with Testing Library directly?

The Vitest addon **transforms stories** into Vitest tests automatically.
You get the test for free by writing the story. With direct
Testing Library tests, you re-implement the rendering setup, decorators,
and providers per test file.

### My tests pass in Storybook UI but fail in CI

Run environments differ (resource limits, race conditions). Common
fixes:
- Disable Vitest isolation: `test.isolate: false` in vitest.config.ts.
- Shard your tests across multiple CI jobs: `vitest run --shard=1/3`.
- Use the Playwright Docker image (`mcr.microsoft.com/playwright:...`).
- Use `optimizeDeps.include` for problematic dependencies.

### `m.createRoot is not a function` (React)

React 16/17 project + Vitest addon → alias `@storybook/react-dom-shim`
to the React-16 shim:

```ts
// vitest.config.ts
resolve: { alias: { '@storybook/react-dom-shim': '@storybook/react-dom-shim/dist/react-16' } }
```

### `Vitest failed to find the current suite`

Pre-optimize dependencies that show up in
"new dependencies optimized" warnings:

```ts
// vite.config.ts
optimizeDeps: { include: ['lodash', 'date-fns'] }
```

### `Failed to fetch dynamically imported module` / `Cannot connect to the iframe`

CI overwhelmed. Either disable Vitest isolation or shard tests.

### Yarn PnP + test-runner

The test-runner uses `jest-playwright-preset` which doesn't fully
support Yarn 2/3 PnP. Switch `nodeLinker: node-modules` in
`.yarnrc.yml`, or migrate to the Vitest addon.

## See also

- `storybook-core` — install, CLI, telemetry
- `storybook-stories` — `play`, args, decorators, lifecycle, mocking modules
- `storybook-config` — `parameters.test.*`, `features.developmentModeForBuild`
- `storybook-essentials` — Actions panel, Highlight (a11y integration)
- `storybook-frameworks` — per-framework mock APIs (Next.js, SvelteKit, TanStack)
- `storybook-sharing` — publishing Storybook for CI failure links
- `storybook-ai` — testing toolset in the MCP server (`run-story-tests`)
- `storybook-migration` — test-runner → Vitest addon migration codemod
