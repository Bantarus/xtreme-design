#!/usr/bin/env node
// PreToolUse fence: the agent may only Write or Edit DESIGN.md. Every other
// path is rejected with exit code 2 and a message explaining the contract.
//
// Rationale: dsx is a scoped probabilistic surface. The deterministic
// translation from DESIGN.md to gallery / tokens / versions is performed by
// scripts/pipeline.mjs (the Stop hook). The agent should never touch
// generated artifacts, components, layout, or config — those are owned by
// the human and the pipeline.
//
// Allowed:
//   - Write/Edit on `DESIGN.md` (relative to repo root), including hex
//     literals anywhere in front-matter or prose. The DESIGN.md spec defines
//     hex as the canonical color value; we do not second-guess it here.
//
// Rejected:
//   - Write/Edit on ANY other path. The agent must surface the issue to the
//     human instead of editing components, settings, scripts, etc.
//
// The fence reads the Claude Code hook payload from stdin (preferred). It
// supports both `Write` (input.content) and `Edit` (input.new_string) tools.

import { readFileSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
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
  if (!/^(Write|Edit|MultiEdit|NotebookEdit)$/.test(toolName)) {
    process.exit(0);
  }

  const input = payload.tool_input ?? {};
  const filePath = input.file_path ?? input.notebook_path;
  if (!filePath) {
    process.exit(0);
  }

  const cwd = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const absPath = isAbsolute(filePath) ? filePath : resolve(cwd, filePath);
  const rel = relative(cwd, absPath).replaceAll('\\', '/');

  // The single allowed path.
  if (rel === 'DESIGN.md') {
    process.exit(0);
  }

  const message =
    `dsx: the agent surface is DESIGN.md only.\n` +
    `  You tried to write: ${rel || filePath}\n` +
    `  Tool: ${toolName}\n\n` +
    `  Everything visible in dsx — the gallery, the components, the build\n` +
    `  outputs, the version snapshots — is rendered deterministically from\n` +
    `  DESIGN.md by scripts/pipeline.mjs. The agent never edits those.\n\n` +
    `  If a non-DESIGN.md change is genuinely required (a bug in the\n` +
    `  pipeline, a missing component in the gallery, a config update), stop\n` +
    `  and explain the situation to the user. They will make the change\n` +
    `  manually.`;

  process.stderr.write(`${message}\n`);
  process.exit(2);
}

main();
