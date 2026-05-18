#!/usr/bin/env node
// Score every reference in .dsx/references/ against a brief string and
// return the top 3 by keyword match. Used by `/design` to pick which
// reference to mutate from.
//
// Algorithm:
//   1. Tokenize the brief: lowercase, split on whitespace + punctuation,
//      dedupe, drop short stopwords.
//   2. For each .dsx/references/*.md:
//      - Parse YAML front-matter, read `keywords:` array.
//      - Score = number of brief tokens that appear (substring,
//        case-insensitive) in any keyword.
//   3. Sort by (score desc, then alphabetical), keep top 3.
//   4. Emit JSON array: [{ path, score, keywords }, …]
//
// Usage:
//   node scripts/find-reference.mjs "online store for camping gear"

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

const REF_DIR = '.dsx/references';

const STOPWORDS = new Set([
  'a',
  'an',
  'the',
  'for',
  'of',
  'to',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'by',
  'with',
  'from',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'it',
  'this',
  'that',
  'these',
  'those',
  'we',
  'i',
  'you',
  'he',
  'she',
  'they',
  'my',
  'our',
  'your',
  'their',
  'as',
  'if',
  'so',
  'into',
  'onto',
  'than',
  'then',
  'too',
  'very',
  'can',
  'will',
  'just',
]);

function tokenize(text) {
  return Array.from(
    new Set(
      String(text)
        .toLowerCase()
        .split(/[^a-z0-9-]+/)
        .filter((t) => t.length > 1 && !STOPWORDS.has(t)),
    ),
  );
}

function extractFrontMatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

function loadKeywords(path) {
  try {
    const md = readFileSync(path, 'utf8');
    const fm = extractFrontMatter(md);
    if (!fm) return [];
    const parsed = parseYaml(fm);
    const kw = parsed?.keywords;
    if (!Array.isArray(kw)) return [];
    return kw.map((k) => String(k).toLowerCase());
  } catch {
    return [];
  }
}

function score(briefTokens, keywords) {
  let s = 0;
  for (const t of briefTokens) {
    if (keywords.some((k) => k.includes(t) || t.includes(k))) s += 1;
  }
  return s;
}

function main() {
  const brief = process.argv.slice(2).join(' ').trim();
  if (!brief) {
    process.stderr.write('find-reference: pass the brief as argv. Example:\n');
    process.stderr.write('  node scripts/find-reference.mjs "outdoor camping store, rugged"\n');
    process.exit(1);
  }
  const briefTokens = tokenize(brief);
  const files = readdirSync(REF_DIR).filter((f) => f.endsWith('.md'));
  const scored = files
    .map((f) => {
      const path = join(REF_DIR, f);
      const keywords = loadKeywords(path);
      return { path, score: score(briefTokens, keywords), keywords };
    })
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));
  const top = scored.slice(0, 3);
  process.stdout.write(JSON.stringify(top, null, 2));
}

main();
