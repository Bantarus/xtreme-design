# Angular with Storybook — full reference

Single framework: `@storybook/angular`. Requires **Angular 18+ (up to
22.x is supported)** and uses **Webpack 5** under the hood (via the
Angular CLI builder).

## Install

```bash
npm create storybook@latest
# Auto-detects Angular and installs everything including Compodoc.
```

Manual install:

```bash
npm i -D @storybook/angular @compodoc/compodoc
```

Update `angular.json`:

```jsonc
{
  "projects": {
    "your-project": {
      "architect": {
        "storybook": {
          "builder": "@storybook/angular:start-storybook",
          "options": {
            "configDir": ".storybook",
            "browserTarget": "your-project:build",
            "port": 6006,
            "compodoc": true,
            "compodocArgs": ["-e", "json", "-d", "."]
          }
        },
        "build-storybook": {
          "builder": "@storybook/angular:build-storybook",
          "options": {
            "configDir": ".storybook",
            "browserTarget": "your-project:build",
            "outputDir": "dist/storybook/your-project",
            "compodoc": true,
            "compodocArgs": ["-e", "json", "-d", "."]
          }
        }
      }
    }
  }
}
```

## Run

```bash
ng run your-project:storybook
ng run your-project:build-storybook
```

⚠️ Don't use `storybook dev` or `storybook build` directly — the Angular
framework uses Angular CLI builders for compilation.

## Compodoc integration

Compodoc parses your TypeScript and JSDoc comments to populate the
Controls panel and Autodocs. Without it, Angular stories work but every
control is generic text.

1. Enable `compodoc: true` in **both** `storybook` and `build-storybook`
   targets in `angular.json`.
2. In `.storybook/preview.ts`:
   ```ts
   import { setCompodocJson } from '@storybook/addon-docs/angular';
   import docJson from '../documentation.json';
   setCompodocJson(docJson);
   ```
3. Add JSDoc to your inputs and outputs:
   ```ts
   @Component({ ... })
   export class Button {
     /** Label text on the button */
     @Input() label = '';
     /** Whether the button is disabled */
     @Input() disabled = false;
     /** Fired when clicked */
     @Output() click = new EventEmitter<MouseEvent>();
   }
   ```

## Application-wide providers (`applicationConfig` decorator)

For components that depend on `BrowserAnimationsModule`, root services,
or any `ModuleWithProviders.forRoot()` patterns:

```ts
import { applicationConfig, Meta } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

const meta: Meta<MyComponent> = {
  component: MyComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), provideHttpClient()],
    }),
  ],
};
```

`applicationConfig` is applied via `bootstrapApplication` — use it for
standalone components.

## Module-level dependencies (`moduleMetadata` decorator)

For components that need ngModules, declarations, or providers via the
traditional `@NgModule` pattern:

```ts
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

const meta: Meta<YourComponent> = {
  component: YourComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule],
      declarations: [HelperComponent],
      providers: [{ provide: ApiService, useValue: mockApi }],
    }),
  ],
};
export default meta;
type Story = StoryObj<YourComponent>;

export const Base: Story = {};
export const WithCustomProvider: Story = {
  decorators: [
    moduleMetadata({
      providers: [{ provide: ApiService, useValue: anotherMock }],
    }),
  ],
};
```

## Framework options

```ts
framework: {
  name: '@storybook/angular',
  options: {
    enableIvy: true,    // default since Angular 9
    enableNgcc: false,  // ngcc is no longer needed in modern Angular
    builder: { /* Webpack options */ },
  },
},
```

## Angular CLI builder options (`angular.json`)

Common options for the `@storybook/angular:start-storybook` builder:

| Option | Description |
| --- | --- |
| `browserTarget` | Build target string, e.g. `"my-app:build:dev"`. |
| `tsConfig` | Path to tsconfig. |
| `preserveSymlinks` | Skip real-path resolution (for pnpm). |
| `port` / `host` | Dev server bind. |
| `https` / `sslCa` / `sslCert` / `sslKey` | HTTPS dev server. |
| `smokeTest` | Exit after successful start (CI sanity check). |
| `ci` | Skip prompts and don't open browser. |
| `open` | Whether to open a browser. |
| `quiet` | Filter verbose build output. |
| `enableProdMode` | Disable Angular dev assertions. |
| `docs` | Start Storybook in documentation mode. |
| `compodoc` | Auto-run Compodoc before serving. |
| `compodocArgs` | Compodoc CLI args (e.g. `["-e", "json"]`). |
| `styles` | Array of global stylesheet paths. |
| `stylePreprocessorOptions` | E.g. `{ "includePaths": ["src/styles"] }`. |
| `assets` | Static asset folders. |
| `initialPath` | URL path to open by default. |
| `webpackStatsJson` | Emit Webpack stats JSON. |
| `previewUrl` | Use a custom preview URL. |
| `loglevel` | `trace`/`debug`/`info`/`warn`/`error`/`silent`. |
| `sourceMap` | Configure source maps. |
| `experimentalZoneless` | Enable Angular's zoneless change detection. |

Full schemas:
- [start-storybook](https://github.com/storybookjs/storybook/blob/next/code/frameworks/angular/start-schema.json)
- [build-storybook](https://github.com/storybookjs/storybook/blob/next/code/frameworks/angular/build-schema.json)

## Global styles

Set in `angular.json` (NOT in `preview.ts` — Angular bypasses
Storybook's normal CSS pipeline):

```jsonc
{
  "storybook": {
    "options": {
      "styles": [
        "@angular/material/prebuilt-themes/indigo-pink.css",
        "@fontsource/roboto/400.css",
        "src/styles.scss"
      ]
    }
  },
  "build-storybook": {
    "options": {
      "styles": ["@angular/material/prebuilt-themes/indigo-pink.css", "src/styles.scss"]
    }
  }
}
```

Apply to both `storybook` and `build-storybook` targets.

## TypeScript

- CSF 3 typing is basic (no full prop inference).
- **CSF Next** infers Angular component types but they're `Partial<T>`
  by default (required props aren't enforced).
- To enforce required props with CSF Next:
  ```ts
  interface MyProps { requiredProp: string; optionalProp?: number; }
  const meta = preview.type<{ args: MyProps }>().meta({ component: 'MyComponent' });
  ```

## Nx integration

If you use Nx, set up storybook through `nx generate @nx/angular:storybook-configuration`.
Nx versions ≥ 14.1.8 use the Storybook builder directly; older versions
use `@nrwl/storybook:build`. Style options go in the
`build-storybook` target.

## Common pitfalls

1. **Storybook fails to detect the framework.** Run from the project
   root (or the directory containing `angular.json`).
2. **All controls are blank.** Compodoc isn't generating
   `documentation.json` OR the preview isn't loading it. Check:
   - `compodoc: true` in `angular.json`
   - `setCompodocJson(docJson)` called in `preview.ts`
   - `documentation.json` exists in your repo root after running
     storybook (paths from `compodocArgs`)
3. **`BrowserAnimationsModule` is missing.** Add `provideAnimations()`
   via `applicationConfig` decorator.
4. **`satisfies` operator doesn't work.** Angular's decorator-based
   metadata isn't fully visible at compile time, so `satisfies Meta<...>`
   has limitations. Live with the slightly looser CSF 3 typing or use
   CSF Next with explicit `preview.type<{ args }>()`.
5. **Vitest addon not supported.** Use the test-runner instead. The
   Vitest addon requires Vite-based frameworks.
6. **Modern signal-based components.** Inputs declared with `input()` /
   `input.required<T>()` are detected by Compodoc, but you may need
   Compodoc 1.1.25+ for full support.
7. **Standalone components in stories.** Use `applicationConfig` for
   providers and import the standalone component into `moduleMetadata.imports`
   (yes, standalone components go in `imports`, not `declarations`).
8. **`enableProdMode: true` masks template errors.** Useful for visual
   testing but turn off for dev to see Angular's full diagnostic output.
