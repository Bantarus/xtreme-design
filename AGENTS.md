# AGENTS.md — dsx scaffold

You are an AI coding assistant working in **dsx**, the agent-native design system monorepo. This file is for non-Claude tools (Codex, Cursor, Aider, Continue, etc.) — Claude Code uses the equivalent [CLAUDE.md](CLAUDE.md).

## Read first

The full set of rules — invariants, file map, token-to-Tailwind glossary, commands, workflow — lives in [docs/agent-rules.md](docs/agent-rules.md). **Read it before doing anything.**

## Non-Claude-specific notes

- The `.claude/` directory exists for Claude Code's hooks, subagents, slash commands, and skills. You will not invoke those features; ignore them. They do not influence your behavior — the policies are encoded in the scripts under `scripts/` and the rules in this file, both of which apply universally.
- Hooks you should know about (because they will reject your output if you violate them when the human is running Claude Code in parallel):
  - `scripts/block-raw-hex.mjs` blocks raw color literals.
  - `scripts/rebuild-tokens-if-needed.mjs` rebuilds tokens on relevant changes.
  - `scripts/design-md-sync.mjs` enforces DESIGN.md ↔ tokens name parity.

## The shortest path through a UI task

1. Skim `DESIGN.md` (front-matter + relevant Components / Do's and Don'ts entry).
2. Pick the Tailwind utility or CSS variable from the glossary in [docs/agent-rules.md](docs/agent-rules.md#token--tailwind-class-glossary).
3. Edit the component. Never write raw hex (#rrggbb, rgb(), hsl(), oklch(), …) into `.ts`/`.tsx`/`.css` outside the four allowed locations listed in the rules.
4. `pnpm tokens && pnpm design:lint && pnpm --filter web build`.
5. If the visible output changed, decide whether to update Playwright baselines (`pnpm test:visual:update`) and explain why in the commit body.

## When you disagree with DESIGN.md

Surface the disagreement to the human; do not unilaterally rewrite `DESIGN.md` to match your implementation preference.

## When you finish

End with a one or two sentence summary of what changed and what the human's next step is. Conventional-commits format for `git commit -m`. Do not push.
