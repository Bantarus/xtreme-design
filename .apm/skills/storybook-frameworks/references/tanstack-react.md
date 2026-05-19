# TanStack React (Router / Start) with Storybook — full reference

Framework: `@storybook/tanstack-react`. Builds on `@storybook/react-vite`
and adds:

- Memory-backed TanStack Router context wrapped around every story
- Mocked `@tanstack/react-router` (navigation hooks work, navigation
  attempts logged as Actions)
- Mocked TanStack Start server functions (`createServerFn().handler(...)`
  becomes a Vitest mock)
- Mocked Start-specific runtime modules

Requires **React 18+** and **Vite 7+**.

## Install

```bash
npm create storybook@latest    # auto-detects TanStack Router/Start
# Manual:
npm i -D @storybook/tanstack-react vite
```

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/tanstack-react';

const config: StorybookConfig = {
  framework: '@storybook/tanstack-react',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
};
export default config;
```

## Render a TanStack Route as a story

Supply a route via `parameters.tanstack.router.route`:

```ts
// ProfilePage.stories.tsx
import { ProfileRoute } from '../routes/profile';

const meta = {
  parameters: {
    tanstack: {
      router: {
        route: ProfileRoute,
      },
    },
  },
} satisfies Meta;
export default meta;

export const Default = {};
```

Storybook extracts the route's React component and provides the router
context automatically.

## Dynamic params (`/$id`)

```ts
parameters: {
  tanstack: {
    router: {
      route: ProfileRoute,
      params: { id: '123' },
      routeOverrides: {
        '/profile/$id': {
          loader: () => ({ user: { id: '123', name: 'Test User' } }),
        },
      },
    },
  },
},
```

## Nested routes (rendering layouts)

When `route` is a file route connected to your route tree, Storybook
automatically includes parent layout routes. You can also pass the
whole `routeTree`:

```ts
import { routeTree } from '../routeTree.gen';

parameters: {
  tanstack: {
    router: {
      routeTree,                                    // the whole tree
      path: '/dashboard/settings',                  // which route to render
      routeOverrides: {
        '__root__': { beforeLoad: () => ({ authorized: true }) },
        '/dashboard': { loader: () => ({ user: {} }) },
      },
    },
  },
},
```

Use `'__root__'` to target the root route in `routeOverrides`.

## Non-route components

If you want to render a regular component that uses router hooks
(`useRouterState`, `useSearch`, `useParams`, `useLoaderData`), provide
context without setting `route`:

```ts
parameters: {
  tanstack: {
    router: {
      path: '/products/abc?tab=details',
      params: { id: 'abc' },
      query: { tab: 'details' },
      context: { user: { name: 'Test' } },          // injected as router context
    },
  },
},
```

## Search params, URL fragments, context

```ts
parameters: {
  tanstack: {
    router: {
      query: { tab: 'details', page: '2' },         // ?tab=details&page=2
      path: '/article/123#section-three',           // # fragment in path
      context: { queryClient: myQueryClient },
    },
  },
},
```

## Per-route overrides

`routeOverrides` lets you stub `loader`, `beforeLoad`, `validateSearch`,
`loaderDeps`, and `context` for any route without modifying the original
route definition:

```ts
parameters: {
  tanstack: {
    router: {
      route: DocumentRoute,
      routeOverrides: {
        '/documents/$id': {
          loader: () => ({ document: { id: '1', title: 'Hello' } }),
          beforeLoad: () => ({ canEdit: true }),
        },
        '__root__': {
          context: { theme: 'dark' },
        },
      },
    },
  },
},
```

## Mocking server functions (TanStack Start)

The framework replaces `createServerFn().handler(...)` results with
Vitest mock functions. Override per story:

```ts
// app/server-fns.ts
export const getUserData = createServerFn()
  .handler(async () => fetch('/api/user').then((r) => r.json()));

// MyComponent.stories.tsx
import { mocked } from 'storybook/test';
import { getUserData } from '../app/server-fns';

const meta = { component: MyComponent } satisfies Meta<typeof MyComponent>;
export default meta;

export const Success: Story = {
  beforeEach: async () => {
    mocked(getUserData).mockResolvedValue({ name: 'Jane', email: 'j@x.com' });
  },
};

export const Loading: Story = {
  beforeEach: async () => {
    mocked(getUserData).mockReturnValue(new Promise(() => {}));  // never resolves
  },
};

export const Error: Story = {
  beforeEach: async () => {
    mocked(getUserData).mockRejectedValue(new Error('Network'));
  },
};
```

## Handling server-only dependencies

TanStack Start apps often import server-only modules (DB clients, auth
libs) at module scope. The framework handles three layers:

### Layer 1: Framework-level mocks (automatic)

Already covered: `@tanstack/react-start`, `@tanstack/react-start/server`,
`@tanstack/start-storage-context`, and `createServerFn`.

### Layer 2: App-level server modules (you provide)

For your own server-only modules (e.g. `~/db/client`,
`~/auth/index.server`), use a `__mocks__/` file to prevent the real
module from loading in the browser.

```ts
// .storybook/preview.ts
import { sb } from 'storybook/test';
sb.mock(import('../src/db/client.ts'));
```

```ts
// src/db/__mocks__/client.ts
import { fn } from 'storybook/test';
import type * as actual from '../client';
// Only import types — no server packages pulled into the browser
export const db: typeof actual.db = {
  query: fn(),
  insert: fn(),
  update: fn(),
  delete: fn(),
} as any;
```

> **Why a `__mocks__/` file, not automocking?** Automocking replaces
> *functions* but still **evaluates the original module** and its
> imports. For modules that import `postgres`, `pg`, or other Node-only
> packages, evaluation crashes the browser. `__mocks__/` files
> completely prevent evaluation of the original module.

### Layer 3: Identifying what to mock

Walk the error stack trace from top to bottom and stop at the first
import you wrote yourself. That's the module to mock.

| Error | Module to mock |
| --- | --- |
| `does not provide an export named 'default'` | The server-only module that crashed import |
| `AsyncLocalStorage is not defined` | The server-only module that uses it |

Two cases where you don't need a mock:
- The module is from `@tanstack/*` (framework handles it).
- The module only imports `createServerFn` (already mocked).

## TanStack Query integration

Provide a shared `QueryClient` to all stories:

```ts
// .storybook/preview.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const preview: Preview = {
  parameters: {
    tanstack: { router: { context: { queryClient } } },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  beforeEach: async () => {
    queryClient.clear();
  },
};
export default preview;
```

Seed query data per story via `beforeEach`:

```ts
import { queryClient } from '../../.storybook/preview';

export const WithCachedUser: Story = {
  beforeEach: async () => {
    queryClient.setQueryData(['user', '123'], { name: 'Jane' });
  },
};
```

## Framework options

```ts
framework: {
  name: '@storybook/tanstack-react',
  options: {
    builder: { /* Vite options */ },
  },
},
```

## Modules exported

```ts
// Direct access to the router mock layer (for assertions on nav spies):
import { /* ... */ } from '@storybook/tanstack-react/react-router';

// Direct access to the Start mock layer:
import { createServerFn } from '@storybook/tanstack-react/start';
```

## Migrating from `@storybook/react-vite`

```bash
npx storybook automigrate react-vite-to-tanstack-react
```

This:
1. Replaces `@storybook/react-vite` with `@storybook/tanstack-react` in `package.json`.
2. Updates `.storybook/main.ts` framework property.
3. Rewrites imports referencing `@storybook/react-vite`.
4. **Detects manual TanStack Router decorators** in `.storybook/preview.*`
   and other story files, and offers a clipboard-ready AI prompt to
   remove them (the framework provides a router automatically — manual
   decorators become redundant).

After migration, remove any manual `RouterProvider` / `createRouter` /
`createMemoryHistory` / `createRootRoute` decorators in `preview.tsx`.
For stories that need a specific route, use
`parameters.tanstack.router` instead.

## Common pitfalls

1. **`module does not provide an export named 'default'`** — a server-
   only module reached the browser. Walk the stack, find the first
   module you own, add a `__mocks__/` file.
2. **`AsyncLocalStorage is not defined`** — same: server-only module in
   the browser.
3. **Style imports missing** — import your `src/styles/app.css` from
   `.storybook/preview.tsx`.
4. **Provider not reaching stories** — add a project-level decorator in
   `preview.tsx`.
5. **React Server Components don't work** — TanStack React framework
   does NOT support RSCs (they require a server runtime). Refactor to a
   client component for stories.
6. **Manual router decorator still present after migration** — the
   automigration only updates files; you have to delete the manual
   decorator yourself. Use the clipboard prompt the migration provides
   if your AI assistant can help.
7. **`route` is a file route but no params are interpolated** — supply
   `params` under `parameters.tanstack.router`, matching the dynamic
   segments in the route path (`/$id` → `{ id: '...' }`).
