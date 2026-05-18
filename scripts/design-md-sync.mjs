#!/usr/bin/env node
// Sync check between the active DESIGN.md and the immutable base.DESIGN.md.
// The contract: the active DESIGN.md must define AT LEAST every color
// (and component) name that base defines. Adding new names is fine — the
// pipeline propagates them. Dropping a base name is the failure mode the
// gallery cannot recover from, because the gallery imports those token
// names directly.
//
// Run manually via `pnpm design:sync`. Not wired to any hook.
//
// Exit 0 if active ⊇ base. Exit 1 otherwise, listing the missing names.

import { existsSync, readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';

function extractFrontMatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

function loadDesignMd(path) {
  if (!existsSync(path)) throw new Error(`${path} not found`);
  const md = readFileSync(path, 'utf8');
  const fm = extractFrontMatter(md);
  if (!fm) throw new Error(`${path} has no YAML front matter`);
  const parsed = parseYaml(fm);
  return {
    colors: new Set(Object.keys(parsed?.colors ?? {})),
    components: new Set(Object.keys(parsed?.components ?? {})),
  };
}

function main() {
  const base = loadDesignMd('base.DESIGN.md');
  const active = loadDesignMd('DESIGN.md');

  const missingColors = [...base.colors].filter((n) => !active.colors.has(n)).sort();
  const missingComponents = [...base.components].filter((n) => !active.components.has(n)).sort();
  const addedColors = [...active.colors].filter((n) => !base.colors.has(n)).sort();
  const addedComponents = [...active.components].filter((n) => !base.components.has(n)).sort();

  if (missingColors.length === 0 && missingComponents.length === 0) {
    const addedSummary =
      addedColors.length || addedComponents.length
        ? ` (active adds ${addedColors.length} color(s) + ${addedComponents.length} component(s) over base)`
        : '';
    process.stdout.write(
      `design-md-sync: OK — active DESIGN.md covers all ${base.colors.size} base colors and ${base.components.size} base components${addedSummary}.\n`,
    );
    process.exit(0);
  }

  process.stderr.write(
    'design-md-sync: DRIFT — active DESIGN.md is missing names that base.DESIGN.md defines.\n\n',
  );
  if (missingColors.length > 0) {
    process.stderr.write(`  Missing colors (${missingColors.length}):\n`);
    for (const n of missingColors) process.stderr.write(`    - ${n}\n`);
    process.stderr.write('\n');
  }
  if (missingComponents.length > 0) {
    process.stderr.write(`  Missing components (${missingComponents.length}):\n`);
    for (const n of missingComponents) process.stderr.write(`    - ${n}\n`);
    process.stderr.write('\n');
  }
  process.stderr.write(
    '  The gallery references base names directly; restore them in the active DESIGN.md before the pipeline can re-render.\n',
  );
  process.exit(1);
}

main();
