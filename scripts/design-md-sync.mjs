#!/usr/bin/env node
// Manual sync check: compare token NAMES between DESIGN.md front-matter and
// tokens/semantic.tokens.json. Report drift. Exit non-zero if names diverge.
//
// Not wired to any hook — run via `pnpm design:sync`.
//
// What counts as "drift":
//   - A color name present in DESIGN.md `colors:` but missing from
//     `tokens/semantic.tokens.json` `color.*` (or vice versa).
//
// What it intentionally does NOT check:
//   - VALUES (the two sources can hold different hex per design intent and
//     reconciliation is a separate review).
//   - Typography / spacing / radii names (those have more legitimate
//     divergence — semantic.tokens.json carries CSS-/Tailwind-shaped names).

import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';

function extractFrontMatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

function loadDesignMdColors(path = 'DESIGN.md') {
  const md = readFileSync(path, 'utf8');
  const fm = extractFrontMatter(md);
  if (!fm) throw new Error('DESIGN.md has no YAML front matter');
  const parsed = parseYaml(fm);
  const colors = parsed?.colors ?? {};
  return new Set(Object.keys(colors));
}

function loadSemanticColors(path = 'tokens/semantic.tokens.json') {
  const json = JSON.parse(readFileSync(path, 'utf8'));
  const color = json.color ?? {};
  const names = new Set();
  for (const k of Object.keys(color)) {
    if (k.startsWith('$')) continue;
    names.add(k);
  }
  return names;
}

function diff(a, b) {
  const onlyA = [...a].filter((x) => !b.has(x)).sort();
  const onlyB = [...b].filter((x) => !a.has(x)).sort();
  return { onlyA, onlyB };
}

function main() {
  const designMd = loadDesignMdColors();
  const semantic = loadSemanticColors();
  const { onlyA: onlyInDesignMd, onlyB: onlyInSemantic } = diff(designMd, semantic);

  if (onlyInDesignMd.length === 0 && onlyInSemantic.length === 0) {
    process.stdout.write(
      `design-md-sync: OK — ${designMd.size} color names align between DESIGN.md and tokens/semantic.tokens.json.\n`,
    );
    process.exit(0);
  }

  process.stderr.write('design-md-sync: DRIFT detected.\n\n');
  if (onlyInDesignMd.length > 0) {
    process.stderr.write(`  Only in DESIGN.md (${onlyInDesignMd.length}):\n`);
    for (const name of onlyInDesignMd) process.stderr.write(`    - ${name}\n`);
    process.stderr.write('\n');
  }
  if (onlyInSemantic.length > 0) {
    process.stderr.write(`  Only in tokens/semantic.tokens.json (${onlyInSemantic.length}):\n`);
    for (const name of onlyInSemantic) process.stderr.write(`    - ${name}\n`);
    process.stderr.write('\n');
  }
  process.stderr.write(
    '  Reconcile: add the missing name to whichever source is incomplete, or rename so both sources agree.\n',
  );
  process.exit(1);
}

main();
