#!/usr/bin/env node
// Pure transform: parse a DESIGN.md and emit a Tailwind-v4-compatible CSS
// snippet containing:
//   - `:root { --color-*, --radius-*, --text-*, --font-*, --tracking-*, --leading-* }`
//   - `@theme inline { ... }` mapping shadcn semantic tokens to dsx tokens
//
// Called by `scripts/pipeline.mjs`. Idempotent. Exits non-zero on parse error.
//
// Usage:
//   node scripts/design-md-to-css.mjs DESIGN.md > apps/gallery/app/tokens.active.css

import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';

function extractFrontMatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

function quoteFamily(value) {
  if (Array.isArray(value)) return value.map(quoteFamily).join(', ');
  return /\s/.test(value) ? `"${value}"` : value;
}

function emitCss(parsed) {
  const lines = [];
  lines.push('/**');
  lines.push(' * Active dsx tokens — generated from DESIGN.md by scripts/pipeline.mjs.');
  lines.push(' * Do not edit by hand. The agent edits DESIGN.md; this file is rendered.');
  lines.push(' */');
  lines.push(':root {');

  // colors
  const colors = parsed?.colors ?? {};
  for (const [name, value] of Object.entries(colors)) {
    if (typeof value !== 'string') continue;
    lines.push(`  --color-${name}: ${value.toLowerCase()};`);
  }

  // rounded → --radius-*
  const rounded = parsed?.rounded ?? {};
  for (const [name, value] of Object.entries(rounded)) {
    if (typeof value !== 'string') continue;
    lines.push(`  --radius-${name}: ${value};`);
  }

  // spacing → --spacing-* (Tailwind v4 also defines --spacing as a base unit; we expose names)
  const spacing = parsed?.spacing ?? {};
  for (const [name, value] of Object.entries(spacing)) {
    const v = typeof value === 'string' ? value : `${value}`;
    lines.push(`  --spacing-${name}: ${v};`);
  }

  // typography → flattened scales
  const typography = parsed?.typography ?? {};
  const families = new Set();
  for (const [name, def] of Object.entries(typography)) {
    if (!def || typeof def !== 'object') continue;
    if (def.fontFamily) {
      families.add(def.fontFamily);
      lines.push(`  --font-${name}: ${quoteFamily(def.fontFamily)};`);
    }
    if (def.fontSize) lines.push(`  --text-${name}: ${def.fontSize};`);
    if (def.fontWeight != null) lines.push(`  --font-weight-${name}: ${def.fontWeight};`);
    if (def.lineHeight != null) lines.push(`  --leading-${name}: ${def.lineHeight};`);
    if (def.letterSpacing) lines.push(`  --tracking-${name}: ${def.letterSpacing};`);
  }

  lines.push('}');
  lines.push('');

  // @theme inline: map Tailwind / shadcn theme keys onto dsx semantic tokens.
  // Tailwind v4 reads --color-* / --radius-* / --text-* / --font-* / --font-weight-*
  // / --tracking-* / --leading-* namespaces and generates utility classes from them.
  lines.push('@theme inline {');
  // semantic color aliases
  for (const name of Object.keys(colors)) {
    lines.push(`  --color-${name}: var(--color-${name});`);
  }
  // shadcn-required aliases mapped to dsx
  lines.push('  --color-background: var(--color-surface);');
  lines.push('  --color-foreground: var(--color-text);');
  lines.push('  --color-card: var(--color-surface);');
  lines.push('  --color-card-foreground: var(--color-text);');
  lines.push('  --color-popover: var(--color-surface);');
  lines.push('  --color-popover-foreground: var(--color-text);');
  lines.push('  --color-primary-foreground: var(--color-on-primary);');
  lines.push('  --color-secondary: var(--color-surface-muted);');
  lines.push('  --color-secondary-foreground: var(--color-text);');
  lines.push('  --color-muted: var(--color-surface-muted);');
  lines.push('  --color-muted-foreground: var(--color-text-muted);');
  lines.push('  --color-accent: var(--color-surface-muted);');
  lines.push('  --color-accent-foreground: var(--color-text);');
  lines.push('  --color-destructive: var(--color-danger);');
  lines.push('  --color-destructive-foreground: var(--color-on-primary);');
  lines.push('  --color-input: var(--color-border);');
  lines.push('  --color-ring: var(--color-focus-ring);');

  // radii
  for (const name of Object.keys(rounded)) {
    lines.push(`  --radius-${name}: var(--radius-${name});`);
  }
  if (rounded.md) lines.push('  --radius: var(--radius-md);');

  // typography scales — make font sizes available as text-<name>
  for (const name of Object.keys(typography)) {
    lines.push(`  --text-${name}: var(--text-${name});`);
  }

  lines.push('}\n');
  return lines.join('\n');
}

function main() {
  const path = process.argv[2] ?? 'DESIGN.md';
  const md = readFileSync(path, 'utf8');
  const fm = extractFrontMatter(md);
  if (!fm) {
    process.stderr.write(`design-md-to-css: ${path} has no YAML front matter\n`);
    process.exit(1);
  }
  let parsed;
  try {
    parsed = parseYaml(fm);
  } catch (err) {
    process.stderr.write(`design-md-to-css: YAML parse error in ${path}: ${err.message}\n`);
    process.exit(1);
  }
  process.stdout.write(emitCss(parsed));
}

main();
