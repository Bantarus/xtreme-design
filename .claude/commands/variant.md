---
description: Spawn N worktree-isolated UI variants of a component, explore a brief, screenshot each at 360/768/1280, and emit a comparison table.
argument-hint: <component-path> "<brief>" [N]
---

You orchestrate the `variant-generator` subagent. Args:

1. `component-path`: path to an existing component (e.g. `apps/web/components/ui/button.tsx`).
2. `brief`: a semicolon-separated string of visual directions (e.g. `"brutalist; glass; neumorphic"`).
3. `N` (optional): number of variants. Default = number of phrases in the brief.

## Your job

1. Parse the args. If `component-path` doesn't exist, abort and tell the user.
2. Read the component briefly so you know its name and current variant API.
3. Invoke the `variant-generator` subagent (via the Agent tool, `subagent_type: variant-generator`) with the component path, brief, and N as a self-contained prompt.
4. Wait for the agent to return its summary table.
5. Forward the table to the user verbatim. Add one paragraph at the top with your recommendation: which variant best matches the existing DESIGN.md prose, and which to discard.

## What you MUST NOT do

- Do not generate variants yourself. Delegate to the subagent so each variant runs in an isolated worktree.
- Do not edit `tokens/**` or `DESIGN.md`.
- Do not commit anything. The user reviews and commits.
