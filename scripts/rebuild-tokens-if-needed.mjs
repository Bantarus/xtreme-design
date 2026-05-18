#!/usr/bin/env node
// PostToolUse hook: when DESIGN.md, tokens/**, or style-dictionary.config.mjs
// changes, rebuild the Style Dictionary outputs and re-export the Tailwind
// snippet from DESIGN.md. Silent on success.
//
// Reads the Claude Code hook payload from stdin to discover the changed
// file(s). Falls back to CLAUDE_FILE_PATHS env (newline-separated).

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { relative, isAbsolute, resolve } from 'node:path';

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function collectPaths() {
  const stdinRaw = readStdin();
  const paths = new Set();
  if (stdinRaw) {
    try {
      const payload = JSON.parse(stdinRaw);
      const input = payload.tool_input ?? {};
      if (input.file_path) paths.add(input.file_path);
      if (Array.isArray(input.files)) {
        for (const f of input.files) {
          if (typeof f === 'string') paths.add(f);
          else if (f?.file_path) paths.add(f.file_path);
        }
      }
    } catch {
      /* fall through */
    }
  }
  const env = process.env.CLAUDE_FILE_PATHS ?? '';
  for (const p of env.split(/\r?\n/)) {
    if (p.trim()) paths.add(p.trim());
  }
  return Array.from(paths);
}

function matters(absPath) {
  const cwd = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const rel = relative(cwd, absPath).replaceAll('\\', '/');
  if (rel.startsWith('tokens/') && rel.endsWith('.tokens.json')) return true;
  if (rel === 'style-dictionary.config.mjs') return true;
  if (rel === 'DESIGN.md') return true;
  return false;
}

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', env: process.env });
}

function main() {
  const cwd = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const paths = collectPaths().map((p) => (isAbsolute(p) ? p : resolve(cwd, p)));
  if (paths.length === 0) process.exit(0);

  const trigger = paths.some(matters);
  if (!trigger) process.exit(0);

  try {
    run('pnpm --silent tokens');
    run('npx --yes @google/design.md@latest export DESIGN.md --format tailwind > apps/web/app/_design-md-tokens.css');
  } catch (err) {
    process.stderr.write(`rebuild-tokens-if-needed: ${err?.message ?? err}\n`);
    process.exit(1);
  }
  process.exit(0);
}

main();
