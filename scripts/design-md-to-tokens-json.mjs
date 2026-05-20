#!/usr/bin/env node
// Pure transform: parse a DESIGN.md and emit DTCG 2025.10 token JSON in the
// split-path shape Style Dictionary's `tailwind/theme-inline` format expects
// (color.<name>, spacing.<name>, radius.<name>, font.{family,size,weight,
// lineHeight,letterSpacing}.<scale>).
//
// Called by `scripts/pipeline.mjs`. Idempotent: same DESIGN.md → byte-identical
// output. Exits non-zero on parse error.
//
// Usage:
//   node scripts/design-md-to-tokens-json.mjs DESIGN.md > tokens/from-design-md.tokens.json
//
// v1 scope: colors, typography (per-scale family/size/weight/lineHeight/
// letterSpacing), rounded → radius, spacing. The DESIGN.md `components:` block
// is intentionally skipped — its {ref} resolver + per-component CSS-var
// emission is a separate task.

import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';

function extractFrontMatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

function buildTokens(parsed, source) {
  const out = {
    $schema: 'https://schemas.designtokens.org/2025.10/format.json',
  };
  if (parsed?.description) {
    out.$description = parsed.description;
  } else if (parsed?.name) {
    out.$description = parsed.name;
  }

  const colors = parsed?.colors ?? {};
  const colorGroup = { $type: 'color' };
  for (const [name, value] of Object.entries(colors)) {
    if (typeof value !== 'string') continue;
    colorGroup[name] = { $value: value.toLowerCase() };
  }
  if (Object.keys(colorGroup).length > 1) out.color = colorGroup;

  const spacing = parsed?.spacing ?? {};
  const spacingGroup = { $type: 'dimension' };
  for (const [name, value] of Object.entries(spacing)) {
    const v = typeof value === 'string' ? value : `${value}`;
    spacingGroup[name] = { $value: v };
  }
  if (Object.keys(spacingGroup).length > 1) out.spacing = spacingGroup;

  // DESIGN.md uses `rounded:`; SD's tailwind/theme-inline format reads `radius.*`.
  const rounded = parsed?.rounded ?? {};
  const radiusGroup = { $type: 'dimension' };
  for (const [name, value] of Object.entries(rounded)) {
    const v = typeof value === 'string' ? value : `${value}`;
    radiusGroup[name] = { $value: v };
  }
  if (Object.keys(radiusGroup).length > 1) out.radius = radiusGroup;

  const typography = parsed?.typography ?? {};
  const family = { $type: 'fontFamily' };
  const size = { $type: 'dimension' };
  const weight = { $type: 'fontWeight' };
  const lineHeight = { $type: 'number' };
  const letterSpacing = { $type: 'dimension' };

  for (const [scale, def] of Object.entries(typography)) {
    if (!def || typeof def !== 'object') continue;
    if (def.fontFamily != null) family[scale] = { $value: def.fontFamily };
    if (def.fontSize != null) size[scale] = { $value: String(def.fontSize) };
    if (def.fontWeight != null) weight[scale] = { $value: def.fontWeight };
    if (def.lineHeight != null) lineHeight[scale] = { $value: def.lineHeight };
    if (def.letterSpacing != null) letterSpacing[scale] = { $value: def.letterSpacing };
  }

  const font = {};
  if (Object.keys(family).length > 1) font.family = family;
  if (Object.keys(weight).length > 1) font.weight = weight;
  if (Object.keys(size).length > 1) font.size = size;
  if (Object.keys(lineHeight).length > 1) font.lineHeight = lineHeight;
  if (Object.keys(letterSpacing).length > 1) font.letterSpacing = letterSpacing;
  if (Object.keys(font).length) out.font = font;

  // TODO v2: emit `components:` block as DTCG composite tokens once the
  // {ref} resolver + per-component CSS-var emission lands.

  return out;
}

function main() {
  const path = process.argv[2] ?? 'DESIGN.md';
  const md = readFileSync(path, 'utf8');
  const fm = extractFrontMatter(md);
  if (!fm) {
    process.stderr.write(`design-md-to-tokens-json: ${path} has no YAML front matter\n`);
    process.exit(1);
  }
  let parsed;
  try {
    parsed = parseYaml(fm);
  } catch (err) {
    process.stderr.write(`design-md-to-tokens-json: YAML parse error in ${path}: ${err.message}\n`);
    process.exit(1);
  }
  const tokens = buildTokens(parsed, path);
  process.stdout.write(`${JSON.stringify(tokens, null, 2)}\n`);
}

main();
