#!/usr/bin/env node
// Snapshot store for the dsx version picker.
//
// `.dsx/versions/_index.json` is the authoritative ordered list:
//   [{ id, name, createdAt, gitSha, brief?, paletteHex[5] }, …]
//
// Each version lives under `.dsx/versions/<id>/`:
//   DESIGN.md      — copy of the active DESIGN.md at snapshot time
//   tokens.css     — copy of apps/gallery/app/tokens.active.css
//   tokens/        — recursive copy of the active tokens/ directory
//   meta.json      — same shape as the _index.json entry
//
// Modes:
//   --auto           Invoked by the pipeline after every successful run.
//                    Allocates the next `v<N+1>` id (1-indexed; "base" is
//                    reserved). Inherits brief from previous version unless
//                    --brief "<…>" is supplied. Skips creation if the
//                    most-recent auto version's DESIGN.md is byte-identical
//                    to the current active DESIGN.md (idempotent).
//   --name "<text>"  Invoked by /snapshot. Renames the MOST RECENT version
//                    in _index.json. No new directory is created.

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { argv } from 'node:process';

const VERSIONS_ROOT = '.dsx/versions';
const INDEX_PATH = join(VERSIONS_ROOT, '_index.json');
const ACTIVE_DESIGN = 'DESIGN.md';
const ACTIVE_TOKENS_CSS = 'apps/gallery/app/tokens.active.css';
const TOKENS_DIR = 'tokens';

function loadIndex() {
  if (!existsSync(INDEX_PATH)) return [];
  return JSON.parse(readFileSync(INDEX_PATH, 'utf8'));
}

function saveIndex(idx) {
  mkdirSync(VERSIONS_ROOT, { recursive: true });
  writeFileSync(INDEX_PATH, `${JSON.stringify(idx, null, 2)}\n`, 'utf8');
}

function gitSha() {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'no-git';
  }
}

function readUtf8(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

function readHash(versionDir) {
  const metaPath = join(versionDir, 'meta.json');
  if (existsSync(metaPath)) {
    try {
      const m = JSON.parse(readFileSync(metaPath, 'utf8'));
      if (typeof m.tokensCssSha256 === 'string') return m.tokensCssSha256;
    } catch {
      /* fall through */
    }
  }
  const cssPath = join(versionDir, 'tokens.css');
  if (existsSync(cssPath)) return sha256(readFileSync(cssPath));
  return null;
}

function paletteOf(tokensCssPath) {
  if (!existsSync(tokensCssPath)) return ['#000', '#000', '#000', '#000', '#000'];
  const out = execSync(`node scripts/palette-thumbnail.mjs "${tokensCssPath}"`, { encoding: 'utf8' });
  try {
    return JSON.parse(out);
  } catch {
    return ['#000', '#000', '#000', '#000', '#000'];
  }
}

function nextAutoId(idx) {
  let n = 1;
  for (const v of idx) {
    const m = /^v(\d+)$/.exec(v.id);
    if (m) n = Math.max(n, Number(m[1]) + 1);
  }
  return `v${n}`;
}

function persistVersion(id, name, brief, source) {
  const dir = join(VERSIONS_ROOT, id);
  mkdirSync(dir, { recursive: true });
  copyFileSync(source.design, join(dir, 'DESIGN.md'));
  if (existsSync(source.tokensCss)) copyFileSync(source.tokensCss, join(dir, 'tokens.css'));
  if (existsSync(source.tokensDir)) cpSync(source.tokensDir, join(dir, 'tokens'), { recursive: true });
  const persistedCssPath = join(dir, 'tokens.css');
  const meta = {
    id,
    name,
    createdAt: new Date().toISOString(),
    gitSha: gitSha(),
    brief,
    paletteHex: paletteOf(persistedCssPath),
    tokensCssSha256: existsSync(persistedCssPath) ? sha256(readFileSync(persistedCssPath)) : null,
  };
  writeFileSync(join(dir, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
  return meta;
}

function ensureBase(idx) {
  const hasBase = idx.some((v) => v.id === 'base');
  if (hasBase && existsSync(join(VERSIONS_ROOT, 'base', 'DESIGN.md'))) return idx;
  if (!existsSync('base.DESIGN.md')) return idx; // first ever run before Phase 2
  // Build a tokens.css for base by running design-md-to-css on base.DESIGN.md
  const baseDir = join(VERSIONS_ROOT, 'base');
  mkdirSync(baseDir, { recursive: true });
  copyFileSync('base.DESIGN.md', join(baseDir, 'DESIGN.md'));
  try {
    const css = execSync('node scripts/design-md-to-css.mjs base.DESIGN.md', { encoding: 'utf8' });
    writeFileSync(join(baseDir, 'tokens.css'), css, 'utf8');
  } catch {
    /* swallow; tokens.css absence is tolerated */
  }
  if (existsSync(TOKENS_DIR)) cpSync(TOKENS_DIR, join(baseDir, 'tokens'), { recursive: true });
  const baseCssPath = join(baseDir, 'tokens.css');
  const meta = {
    id: 'base',
    name: 'base',
    createdAt: new Date().toISOString(),
    gitSha: gitSha(),
    brief: 'Untouched reference DESIGN.md. Never overwritten.',
    paletteHex: paletteOf(baseCssPath),
    tokensCssSha256: existsSync(baseCssPath) ? sha256(readFileSync(baseCssPath)) : null,
  };
  writeFileSync(join(baseDir, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
  return [meta, ...idx.filter((v) => v.id !== 'base')];
}

function autoMode(brief) {
  let idx = loadIndex();
  idx = ensureBase(idx);

  // Idempotency: hash the would-be tokens.css (already regenerated by the
  // pipeline before this step). If it matches the most recent version's
  // tokens.css hash, the active state is indistinguishable from a prior
  // snapshot — skip. Handles the /restore-base-from-base case and the
  // tweak-then-tweak-back case.
  const lastEntry = idx[idx.length - 1];
  if (existsSync(ACTIVE_TOKENS_CSS) && lastEntry) {
    const activeHash = sha256(readFileSync(ACTIVE_TOKENS_CSS));
    const prevHash = readHash(join(VERSIONS_ROOT, lastEntry.id));
    if (prevHash && prevHash === activeHash) {
      saveIndex(idx);
      process.stdout.write(`snapshot: no-op snapshot skipped (tokens.css unchanged since ${lastEntry.id}).\n`);
      return;
    }
  }

  const lastNonBase = [...idx].reverse().find((v) => v.id !== 'base');
  const id = nextAutoId(idx);
  const inheritedBrief = brief ?? lastNonBase?.brief ?? undefined;
  const meta = persistVersion(id, id, inheritedBrief, {
    design: ACTIVE_DESIGN,
    tokensCss: ACTIVE_TOKENS_CSS,
    tokensDir: TOKENS_DIR,
  });
  idx.push(meta);
  saveIndex(idx);
  process.stdout.write(`snapshot: created ${id} (palette: ${meta.paletteHex.join(' ')}).\n`);
}

function nameMode(name) {
  if (!name) {
    process.stderr.write('snapshot: --name requires a value.\n');
    process.exit(1);
  }
  let idx = loadIndex();
  idx = ensureBase(idx);
  const last = [...idx].reverse().find((v) => v.id !== 'base');
  if (!last) {
    process.stderr.write('snapshot: no non-base version to rename. Run the pipeline first.\n');
    process.exit(1);
  }
  last.name = name;
  // Also write into the version's meta.json for symmetry.
  const metaPath = join(VERSIONS_ROOT, last.id, 'meta.json');
  if (existsSync(metaPath)) {
    const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
    meta.name = name;
    writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
  }
  saveIndex(idx);
  process.stdout.write(`snapshot: renamed ${last.id} → "${name}".\n`);
}

function main() {
  const args = argv.slice(2);
  const auto = args.includes('--auto');
  const nameIdx = args.indexOf('--name');
  const briefIdx = args.indexOf('--brief');
  const brief = briefIdx >= 0 ? args[briefIdx + 1] : undefined;

  if (auto) return autoMode(brief);
  if (nameIdx >= 0) return nameMode(args[nameIdx + 1]);
  process.stderr.write('snapshot: pass --auto (used by pipeline) or --name "<text>" (used by /snapshot).\n');
  process.exit(1);
}

main();
