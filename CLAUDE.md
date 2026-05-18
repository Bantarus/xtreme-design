# CLAUDE.md — dsx scaffold

You are working in **dsx**, the agent-native design system monorepo. Web-first; mobile is placeholder.

## Read first

The full set of rules — invariants, file map, token-to-Tailwind glossary, commands, workflow — lives in [docs/agent-rules.md](docs/agent-rules.md). **Read it before doing anything.** Non-Claude agents read the same rules via [AGENTS.md](AGENTS.md).

## Claude-specific shortcuts

- **Subagents** under `.claude/agents/`: `variant-generator`, `token-guardian`, `screenshot-critic`, `port-flutter`, `port-compose`. Delegate via the Agent tool with the matching `subagent_type`.
- **Slash commands** under `.claude/commands/`: `/variant`, `/tokens-build`, `/design-lint`, `/screenshot`.
- **Hooks** in `.claude/settings.json` enforce: no raw hex on Write/Edit (PreToolUse), biome format + token rebuild on save (PostToolUse), design-md lint at Stop. If a hook blocks you, fix the cause — never bypass.
- **Skills** under `.claude/skills/`: `tailwind-v4-shadcn`, `design-tokens-dtcg`, `flutter-port`. Use the matching skill when the task touches its surface.

## The shortest path through a UI task

1. Skim `DESIGN.md` (front-matter + relevant Components / Do's and Don'ts entry).
2. Pick the Tailwind utility or CSS variable from the glossary in [docs/agent-rules.md](docs/agent-rules.md#token--tailwind-class-glossary).
3. Edit the component. Never write raw hex.
4. `pnpm tokens && pnpm design:lint && pnpm --filter web build`.
5. If the visible output changed, decide whether to update Playwright baselines (`pnpm test:visual:update`) and explain why in the commit body.

## When you disagree with DESIGN.md

Open a question with the human. Do not unilaterally edit `DESIGN.md` to match your preferred implementation. The prose is normative; code follows.

## When you finish

End with a one or two sentence summary of what changed and what the human's next step is. Conventional-commits format for `git commit -m`. Do not push.
