#!/usr/bin/env node
// PreToolUse hook: reject Write/Edit operations that introduce raw color
// literals (#RRGGBB, rgb(), rgba(), hsl(), hsla(), oklch(), oklab(), lab(),
// lch()) into TS/TSX/CSS files outside the allowed locations.
//
// Allowed locations (raw hex is intentional in these):
//   - DESIGN.md, KNOWN-ISSUES.md, README.md, AGENTS.md, CLAUDE.md, *.md
//   - tokens/** (DTCG sources)
//   - build/** (Style Dictionary outputs)
//   - node_modules/**
//   - style-dictionary.config.mjs
//   - scripts/** (this script, others use color regex)
//   - apps/web/app/globals.css (the only CSS that bridges tokens to Tailwind)
//
// Reads the Claude Code hook payload from stdin to get the proposed content
// (file_path + content for Write; file_path + new_string for Edit). Exits 2
// with a clear message on rejection so the user sees the blocker.

import { readFileSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function isAllowedPath(absPath) {
  const cwd = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const rel = relative(cwd, absPath).replaceAll('\\', '/');
  if (rel.startsWith('..')) return true; // outside project — let Claude handle it
  if (rel.endsWith('.md')) return true;
  if (rel.startsWith('tokens/')) return true;
  if (rel.startsWith('build/')) return true;
  if (rel.startsWith('node_modules/')) return true;
  if (rel.startsWith('scripts/')) return true;
  if (rel === 'style-dictionary.config.mjs') return true;
  if (rel === 'apps/web/app/globals.css') return true;
  return false;
}

function checkable(absPath) {
  return /\.(?:tsx?|css)$/.test(absPath);
}

const COLOR_PATTERNS = [
  { name: 'hex literal',  re: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g },
  { name: 'rgb()/rgba()', re: /\brgba?\s*\(/g },
  { name: 'hsl()/hsla()', re: /\bhsla?\s*\(/g },
  { name: 'oklch()',      re: /\boklch\s*\(/g },
  { name: 'oklab()',      re: /\boklab\s*\(/g },
  { name: 'lab()',        re: /\blab\s*\(/g },
  { name: 'lch()',        re: /\blch\s*\(/g },
];

function findViolations(text) {
  const hits = [];
  for (const { name, re } of COLOR_PATTERNS) {
    const matches = text.match(re);
    if (matches) hits.push(`${name} (${matches.slice(0, 3).join(', ')}${matches.length > 3 ? '…' : ''})`);
  }
  return hits;
}

function main() {
  const raw = readStdin();
  let payload;
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    payload = {};
  }

  const toolName = payload.tool_name ?? '';
  const input = payload.tool_input ?? {};
  if (!/^(Write|Edit)$/.test(toolName)) {
    process.exit(0);
  }

  const filePath = input.file_path;
  if (!filePath) process.exit(0);

  const absPath = isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath);
  if (!checkable(absPath)) process.exit(0);
  if (isAllowedPath(absPath)) process.exit(0);

  // The proposed text differs by tool:
  //   Write -> input.content (full file contents)
  //   Edit  -> input.new_string (just the replacement chunk)
  const candidate = (input.content ?? input.new_string ?? '').toString();
  if (!candidate) process.exit(0);

  const hits = findViolations(candidate);
  if (hits.length === 0) process.exit(0);

  const cwd = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const rel = relative(cwd, absPath).replaceAll('\\', '/');
  const message =
    `dsx: refused to write raw color literal(s) to ${rel}.\n` +
    `  Found: ${hits.join('; ')}\n` +
    '  Use a dsx token instead. Options:\n' +
    '    • Tailwind utility: bg-primary, text-foreground, border-border, ring-ring, ...\n' +
    '    • CSS variable:    color: var(--color-text); background: var(--color-surface);\n' +
    '  If the value really belongs to the design system, add it to DESIGN.md or tokens/ and run `pnpm tokens`.';

  process.stderr.write(`${message}\n`);
  process.exit(2);
}

main();
