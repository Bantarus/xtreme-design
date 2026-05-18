#!/usr/bin/env node
// Mirror the dsx version store into Storybook's static-served `public/`
// directory so the version-aware decorator can link <link rel="stylesheet">
// elements at runtime without CORS or cross-server fetches.
//
// Outputs (always overwrites; idempotent):
//   apps/storybook/public/tokens.active.css       — the active palette
//   apps/storybook/public/versions/_index.json    — full version index
//   apps/storybook/public/versions/<id>/tokens.css — every version's CSS
//   apps/storybook/.storybook/versions.json       — TINY list consumed by
//     the toolbar items at dev/build time (Vite picks up changes via HMR
//     so the toolbar list refreshes without a manual restart)

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const VERSIONS_ROOT = '.dsx/versions';
const INDEX_PATH = join(VERSIONS_ROOT, '_index.json');
const ACTIVE_TOKENS_CSS = 'apps/gallery/app/tokens.active.css';
const PUBLIC_DIR = 'apps/storybook/public';
const PUBLIC_VERSIONS_DIR = join(PUBLIC_DIR, 'versions');
const TOOLBAR_INDEX = 'apps/storybook/.storybook/versions.json';

function main() {
  if (!existsSync(INDEX_PATH)) {
    process.stdout.write('mirror: no .dsx/versions/_index.json — skipping.\n');
    return;
  }
  if (!existsSync('apps/storybook')) {
    process.stdout.write('mirror: apps/storybook absent — skipping.\n');
    return;
  }

  const idx = JSON.parse(readFileSync(INDEX_PATH, 'utf8'));

  mkdirSync(PUBLIC_VERSIONS_DIR, { recursive: true });

  // 1. Active palette (the default "active" toolbar choice).
  if (existsSync(ACTIVE_TOKENS_CSS)) {
    copyFileSync(ACTIVE_TOKENS_CSS, join(PUBLIC_DIR, 'tokens.active.css'));
  }

  // 2. Full _index.json (consumed at runtime by ActiveStylesheet decorator
  //    if it needs to look up palette previews).
  writeFileSync(
    join(PUBLIC_VERSIONS_DIR, '_index.json'),
    `${JSON.stringify(idx, null, 2)}\n`,
    'utf8',
  );

  // 3. Each version's tokens.css. We rebuild the directory tree so that
  //    deleted versions stop appearing on disk.
  const existingDirs = new Set(
    readdirSync(PUBLIC_VERSIONS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name),
  );
  const knownIds = new Set();
  for (const v of idx) {
    knownIds.add(v.id);
    const src = join(VERSIONS_ROOT, v.id, 'tokens.css');
    const destDir = join(PUBLIC_VERSIONS_DIR, v.id);
    mkdirSync(destDir, { recursive: true });
    if (existsSync(src)) {
      copyFileSync(src, join(destDir, 'tokens.css'));
    }
  }
  // Prune dirs for versions that no longer exist.
  for (const dir of existingDirs) {
    if (!knownIds.has(dir)) {
      rmSync(join(PUBLIC_VERSIONS_DIR, dir), { recursive: true, force: true });
    }
  }

  // 4. Toolbar-only index (id + name + paletteHex; small enough to import
  //    via JSON ESM, large enough to feed `<icon> Name` toolbar entries).
  const toolbar = idx.map((v) => ({
    id: v.id,
    name: v.name ?? v.id,
    paletteHex: v.paletteHex ?? [],
  }));
  writeFileSync(TOOLBAR_INDEX, `${JSON.stringify(toolbar, null, 2)}\n`, 'utf8');

  process.stdout.write(
    `mirror: ${idx.length} versions → ${PUBLIC_VERSIONS_DIR}/ (+ ${TOOLBAR_INDEX}).\n`,
  );
}

main();
