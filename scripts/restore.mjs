#!/usr/bin/env node
// Restore a saved version's DESIGN.md back onto the active surface. The
// pipeline (Stop hook or watcher) then re-renders tokens.active.css and the
// gallery picks it up.
//
// Usage:
//   node scripts/restore.mjs <id-or-name>
//
// "base" is always restorable. Other ids must exist in .dsx/versions/_index.json.

import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { argv } from 'node:process';

const VERSIONS_ROOT = '.dsx/versions';
const INDEX_PATH = join(VERSIONS_ROOT, '_index.json');
const ACTIVE_DESIGN = 'DESIGN.md';

function loadIndex() {
  if (!existsSync(INDEX_PATH)) return [];
  return JSON.parse(readFileSync(INDEX_PATH, 'utf8'));
}

function resolveTarget(idx, q) {
  return idx.find((v) => v.id === q || v.name === q);
}

function main() {
  const q = argv[2];
  if (!q) {
    process.stderr.write('restore: pass an id (v1, v2, …) or a name.\n');
    process.exit(1);
  }
  const idx = loadIndex();
  const target = resolveTarget(idx, q);
  const dir = target ? join(VERSIONS_ROOT, target.id) : join(VERSIONS_ROOT, q);
  const src = join(dir, 'DESIGN.md');
  if (!existsSync(src)) {
    process.stderr.write(`restore: no DESIGN.md found at ${src}.\n`);
    process.exit(1);
  }
  copyFileSync(src, ACTIVE_DESIGN);
  process.stdout.write(`restore: ${target?.id ?? q} → DESIGN.md. Running pipeline…\n`);
  const r = spawnSync('node', ['scripts/pipeline.mjs'], { stdio: 'inherit' });
  process.exit(r.status ?? 0);
}

main();
