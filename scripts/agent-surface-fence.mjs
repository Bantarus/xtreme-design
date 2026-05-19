#!/usr/bin/env node
// PreToolUse fence: the agent may only Write or Edit files on the dsx
// surface. Every other path is rejected with exit code 2 and a message
// explaining the contract.
//
// Tool-agnostic by design. The same script runs under Claude Code, Codex,
// Cursor, GitHub Copilot CLI, OpenCode — any client whose hook system
// pipes a JSON payload to stdin on a "pre tool use" event. Each client
// has a slightly different tool-name vocabulary; the adapter table below
// maps them to a single "is this a write?" predicate.
//
// Allowed surfaces (two, no more):
//   1. `DESIGN.md` (repo root) — the active design system.
//   2. `apps/storybook/src/**/*.stories.{ts,tsx}` — page/section composition.
//
// Rejected: Write/Edit on ANY other path. The agent surfaces the issue
// to the human, who handles non-surface changes manually.

import { readFileSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';

const STORY_PATTERN = /^apps\/storybook\/src\/.+\.stories\.(ts|tsx)$/;

// ── Adapter registry ───────────────────────────────────────────────────
// Each adapter knows one agent family's tool-name vocabulary and the path
// fields its tool_input payload uses. Adapters run in order; the first one
// that recognizes the tool name claims the payload.
//
// To add support for a new client: append an entry. To extend an existing
// adapter (e.g., a new write-shaped tool name surfaces): add to its
// `writeTools` set or `pathFields` list.

const ADAPTERS = [
  {
    // Claude Code: docs.claude.com/.../hooks → PreToolUse payload
    name: 'claude-code',
    writeTools: new Set(['Write', 'Edit', 'MultiEdit', 'NotebookEdit']),
    pathFields: ['file_path', 'notebook_path'],
  },
  {
    // Codex CLI: github.com/openai/codex/.../pre-tool-use.command.input.schema.json
    // Same envelope as Claude Code (tool_name + tool_input). Tool naming
    // is snake_case. Includes apply_patch for batch diffs.
    name: 'codex',
    writeTools: new Set(['write_file', 'edit_file', 'apply_patch', 'patch_file']),
    pathFields: ['file_path', 'path', 'target'],
  },
  {
    // Cursor: cursor.com/docs/agent/hooks → preToolUse payload
    // Same envelope; tool naming varies by extension.
    name: 'cursor',
    writeTools: new Set(['write_file', 'edit_file', 'apply_edits', 'create_file']),
    pathFields: ['file_path', 'path'],
  },
  {
    // GitHub Copilot CLI: same envelope by APM convention.
    name: 'copilot',
    writeTools: new Set(['write_file', 'edit_file', 'create_file', 'modify_file']),
    pathFields: ['file_path', 'path'],
  },
  {
    // OpenCode + unknown clients: presence-based fallback. Restricted to
    // write-canonical field names so read-shaped tools (Glob/Grep/Read
    // with `tool_input.path`) don't trip the fence. If a future write
    // tool surfaces with just `path` or `target`, give it its own adapter
    // entry above with the right `writeTools` set.
    name: 'generic',
    writeTools: null, // null = match any tool_name
    pathFields: ['file_path', 'notebook_path'],
  },
];

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function extractPath(input, fields) {
  if (!input || typeof input !== 'object') return null;
  for (const field of fields) {
    const value = input[field];
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return null;
}

function adapterFor(toolName, input) {
  for (const adapter of ADAPTERS) {
    if (adapter.writeTools === null) {
      // Generic fallback — only fires if a path is present.
      const path = extractPath(input, adapter.pathFields);
      if (path) return { adapter, path };
      continue;
    }
    if (!adapter.writeTools.has(toolName)) continue;
    const path = extractPath(input, adapter.pathFields);
    if (path) return { adapter, path };
  }
  return null;
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

  const toolName = typeof payload.tool_name === 'string' ? payload.tool_name : '';
  const input = payload.tool_input ?? {};

  const match = adapterFor(toolName, input);
  if (!match) {
    // No adapter matched — not a recognizable write. Pass through.
    process.exit(0);
  }

  const cwd =
    process.env.CLAUDE_PROJECT_DIR ?? process.env.APM_PROJECT_DIR ?? payload.cwd ?? process.cwd();
  const absPath = isAbsolute(match.path) ? match.path : resolve(cwd, match.path);
  const rel = relative(cwd, absPath).replaceAll('\\', '/');

  if (isAllowed(rel)) {
    process.exit(0);
  }

  const message =
    `dsx: the agent surface is DESIGN.md + apps/storybook/src/**/*.stories.{ts,tsx}.\n` +
    `  You tried to write: ${rel || match.path}\n` +
    `  Tool: ${toolName || '(unknown)'}    Adapter: ${match.adapter.name}\n\n` +
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
