#!/usr/bin/env node
// Score every page reference in .dsx/page-references/ against a brief
// and return the top 3. Used by `/page` and `/section` to pick which
// CSF3 story file to mutate from.
//
// References declare their genre + keywords in a leading JSDoc block:
//
//   /**
//    * @genre landing | dashboard | settings | pricing | auth | empty | error | wizard
//    * @keywords saas, marketing, hero, pricing, professional
//    * @description One-sentence purpose statement.
//    */
//
// Algorithm:
//   1. Tokenize the brief (lowercase, dedupe, drop short stopwords).
//   2. For each .dsx/page-references/*.stories.tsx:
//      - Extract @genre, @keywords, @description from the leading block.
//      - Score = brief tokens that appear in any keyword OR the genre.
//   3. Sort by (score desc, then alphabetical), keep top 3.
//   4. Emit JSON: [{ path, score, genre, keywords, description }, …]
//
// Usage:
//   node scripts/find-page-reference.mjs "modern SaaS landing for indie devs"

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const REF_DIR = '.dsx/page-references';

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

function extractBlock(src) {
  // Match the FIRST /** ... */ block in the file (must be near top).
  const m = src.match(/^\s*\/\*\*([\s\S]*?)\*\//);
  return m ? m[1] : '';
}

function extractTag(block, tag) {
  const re = new RegExp(`@${tag}\\s+([^\\n]+)`);
  const m = block.match(re);
  return m ? m[1].trim() : '';
}

function loadMeta(path) {
  try {
    const src = readFileSync(path, 'utf8');
    const block = extractBlock(src);
    if (!block) return { genre: '', keywords: [], description: '' };
    const genre = extractTag(block, 'genre').toLowerCase();
    const keywordsRaw = extractTag(block, 'keywords');
    const description = extractTag(block, 'description');
    const keywords = keywordsRaw
      .split(/[,\s]+/)
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
    return { genre, keywords, description };
  } catch {
    return { genre: '', keywords: [], description: '' };
  }
}

function score(briefTokens, genre, keywords) {
  let s = 0;
  const haystack = [genre, ...keywords].filter(Boolean);
  for (const t of briefTokens) {
    if (haystack.some((k) => k.includes(t) || t.includes(k))) s += 1;
  }
  return s;
}

function main() {
  const brief = process.argv.slice(2).join(' ').trim();
  if (!brief) {
    process.stderr.write('find-page-reference: pass the brief as argv. Example:\n');
    process.stderr.write(
      '  node scripts/find-page-reference.mjs "modern SaaS landing for indie devs"\n',
    );
    process.exit(1);
  }
  const briefTokens = tokenize(brief);
  const files = readdirSync(REF_DIR).filter((f) => f.endsWith('.stories.tsx'));
  const scored = files
    .map((f) => {
      const path = join(REF_DIR, f);
      const meta = loadMeta(path);
      return {
        path,
        score: score(briefTokens, meta.genre, meta.keywords),
        genre: meta.genre,
        keywords: meta.keywords,
        description: meta.description,
      };
    })
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));
  process.stdout.write(JSON.stringify(scored.slice(0, 3), null, 2));
}

main();
