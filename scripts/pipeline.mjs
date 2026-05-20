#!/usr/bin/env node
// The deterministic translation from DESIGN.md to everything else.
//
// Steps (each must exit 0, otherwise the pipeline stops):
//   1. `design-md lint DESIGN.md`
//   2. `node scripts/design-md-to-css.mjs DESIGN.md > apps/gallery/app/tokens.active.css`
//   3. `node scripts/design-md-to-tokens-json.mjs DESIGN.md > tokens/from-design-md.tokens.json`
//   4. `pnpm tokens` (Style Dictionary multi-platform fan-out)
//   5. `node scripts/snapshot.mjs --auto`
//
// Prints a one-line summary at the end pointing at the gallery URL. Intended
// to be invoked:
//   - by the Claude Code Stop hook (after every assistant turn)
//   - by the file watcher (scripts/watch.mjs) on DESIGN.md changes
//   - manually via `pnpm pipeline`

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { writeFileSync } from 'node:fs';

const STEPS = [
  {
    name: 'design-md lint',
    run: () =>
      spawnSync('npx', ['--yes', '@google/design.md@latest', 'lint', 'DESIGN.md'], {
        stdio: 'inherit',
      }),
  },
  {
    name: 'design-md → tokens.active.css',
    run: () => {
      const out = spawnSync('node', ['scripts/design-md-to-css.mjs', 'DESIGN.md'], {
        encoding: 'utf8',
      });
      if (out.status === 0) {
        writeFileSync('apps/gallery/app/tokens.active.css', out.stdout, 'utf8');
      } else {
        process.stderr.write(out.stderr ?? '');
      }
      return out;
    },
  },
  {
    name: 'design-md → tokens.json',
    run: () => {
      const out = spawnSync('node', ['scripts/design-md-to-tokens-json.mjs', 'DESIGN.md'], {
        encoding: 'utf8',
      });
      if (out.status === 0) {
        writeFileSync('tokens/from-design-md.tokens.json', out.stdout, 'utf8');
      } else {
        process.stderr.write(out.stderr ?? '');
      }
      return out;
    },
  },
  {
    name: 'style-dictionary build',
    run: () =>
      spawnSync('pnpm', ['--silent', 'tokens'], {
        stdio: 'inherit',
      }),
  },
  {
    name: 'snapshot --auto',
    run: () => spawnSync('node', ['scripts/snapshot.mjs', '--auto'], { stdio: 'inherit' }),
  },
  {
    name: 'mirror → apps/storybook',
    run: () => spawnSync('node', ['scripts/mirror-storybook-versions.mjs'], { stdio: 'inherit' }),
  },
];

function main() {
  if (!existsSync('DESIGN.md')) {
    process.stderr.write('pipeline: DESIGN.md not found at repo root.\n');
    process.exit(1);
  }

  const t0 = Date.now();
  for (const step of STEPS) {
    const r = step.run();
    if (r.status !== 0) {
      process.stderr.write(`\npipeline: ${step.name} failed (exit ${r.status}). Halted.\n`);
      process.exit(r.status ?? 1);
    }
  }
  const ms = Date.now() - t0;
  process.stdout.write(
    `\npipeline: DESIGN.md → gallery + storybook in ${ms} ms. Gallery → http://localhost:3000, Storybook → http://localhost:6006\n`,
  );
}

main();
