#!/usr/bin/env node
// Extract a 5-color palette from a tokens.css file. Used by snapshot.mjs to
// populate `paletteHex` in `.dsx/versions/_index.json`. The picker renders
// this as a 5-stripe SVG.
//
// Priority: primary, surface, text, accent (or surface-muted), border. If
// any name is missing, the next-available semantic color is used.
//
// Usage:
//   node scripts/palette-thumbnail.mjs path/to/tokens.css
//     → prints JSON array of 5 lowercase hex strings to stdout.

import { readFileSync } from 'node:fs';

const PRIORITY = [
  'primary',
  'surface',
  'text',
  'accent',
  'border',
  'surface-muted',
  'success',
  'danger',
  'warning',
  'info',
  'on-primary',
  'text-muted',
  'border-strong',
  'focus-ring',
];

function loadColorMap(cssPath) {
  const css = readFileSync(cssPath, 'utf8');
  const map = new Map();
  const re = /--color-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    if (!map.has(m[1])) map.set(m[1], m[2].toLowerCase());
  }
  return map;
}

function pickPalette(map) {
  const out = [];
  for (const name of PRIORITY) {
    if (out.length === 5) break;
    const hex = map.get(name);
    if (hex && !out.includes(hex)) out.push(hex);
  }
  // Top up with whatever else exists, in encounter order.
  if (out.length < 5) {
    for (const [, hex] of map) {
      if (out.length === 5) break;
      if (!out.includes(hex)) out.push(hex);
    }
  }
  // Last-ditch padding.
  while (out.length < 5) out.push('#000000');
  return out;
}

function main() {
  const path = process.argv[2];
  if (!path) {
    process.stderr.write('palette-thumbnail: missing path argument\n');
    process.exit(1);
  }
  const map = loadColorMap(path);
  process.stdout.write(JSON.stringify(pickPalette(map)));
}

main();
