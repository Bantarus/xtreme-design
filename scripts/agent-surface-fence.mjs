#!/usr/bin/env node
// PreToolUse fence: the agent may only Write or Edit files on the dsx
// surface. Every other path is rejected with exit code 2 and a message
// explaining the contract.
//
// Rationale: dsx is a scoped probabilistic surface. The deterministic
// translation from these inputs to the gallery / Storybook / tokens / version
// snapshots is performed by scripts/pipeline.mjs (the Stop hook) and the
// Storybook build. The agent should never touch generated artifacts,
// components, layout, or config — those are owned by the human and the
// pipeline.
//
// Allowed surfaces (two, no more):
//   1. `DESIGN.md` (repo root) — the active design system. /design and
//      /tweak write here; the pipeline regenerates every visual artifact
//      from this file.
//   2. `apps/storybook/src/**/*.stories.{ts,tsx}` — page and section
//      compositions. /page, /section, and /refine write here; Storybook
//      hot-reloads them in place. The version picker decorator gives every
//      story the active palette automatically.
//
// Rejected:
//   - Write/Edit on ANY other path, including .storybook/ config files,
//     shadcn component sources, gallery routes, build scripts, settings,
//     docs. The agent must surface the issue to the human instead.
//
// The fence reads the Claude Code hook payload from stdin (preferred). It
// supports Write, Edit, MultiEdit, and NotebookEdit tools.

import { readFileSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';

const STORY_PATTERN = /^apps\/storybook\/src\/.+\.stories\.(ts|tsx)$/;

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function isAllowed(rel) {
  if (rel === 'DESIGN.md') return true;
  if (STORY_PATTERN.test(rel)) return true;
  return false;
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

  if (isAllowed(rel)) {
    process.exit(0);
  }

  const message =
    `dsx: the agent surface is DESIGN.md + apps/storybook/src/**/*.stories.{ts,tsx}.\n` +
    `  You tried to write: ${rel || filePath}\n` +
    `  Tool: ${toolName}\n\n` +
    `  Allowed:\n` +
    `    - DESIGN.md (chapter 1 — the active design system)\n` +
    `    - apps/storybook/src/**/*.stories.{ts,tsx} (chapter 2 — page composition)\n\n` +
    `  Everything else in dsx — the gallery, the shadcn components, the\n` +
    `  Storybook config, the build pipeline, the version store — is rendered\n` +
    `  deterministically from those two surfaces. The agent never edits them.\n\n` +
    `  If a non-surface change is genuinely required (a bug in the pipeline,\n` +
    `  a missing component, a Storybook config update), stop and explain\n` +
    `  the situation to the user. They will make the change manually.`;

  process.stderr.write(`${message}\n`);
  process.exit(2);
}

main();
