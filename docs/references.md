# References — agent-native design system research

All sources consulted in the deep-dive, grouped by topic and roughly ordered by how load-bearing each one is for the conclusions. Last verified May 17–18, 2026.

## Part 1 — DESIGN.md primary sources

### The spec itself
- **Repository (canonical):** https://github.com/google-labs-code/design.md
- **Spec document:** https://github.com/google-labs-code/design.md/blob/main/docs/spec.md
- **Releases / changelog:** https://github.com/google-labs-code/design.md/releases
- **Contributing + CLA:** https://github.com/google-labs-code/design.md/blob/main/CONTRIBUTING.md
- **npm package:** https://www.npmjs.com/package/@google/design.md
- **Canonical example file (Heritage):** https://raw.githubusercontent.com/google-labs-code/design.md/main/examples/heritage.md

### Announcement and authorship
- **Google blog announcement (April 21, 2026):** https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/
- **David East on X (lead author, "DESIGN.md core team"):** https://x.com/_davideast
- **Stitch product page:** https://stitch.withgoogle.com/

### Google's adjacent tooling
- **stitch-skills repo:** https://github.com/google-labs-code/stitch-skills
- **design-md skill subdirectory:** https://github.com/google-labs-code/stitch-skills/tree/main/skills/design-md

### Reception, critique, third-party coverage
- **Hacker News thread (item 47887123):** https://news.ycombinator.com/item?id=47887123
- **Awesome Agents writeup:** https://awesomeagents.ai/news/google-design-md-open-source-spec/
- **MindwiredAI explainer:** https://mindwiredai.com/2026/04/23/design-md-is-now-open-source-googles-new-file-format-that-makes-ai-build-your-brand-correctly/
- **Pasquale Pillitteri (cites DesignWhine governance critique):** https://pasqualepillitteri.it/en/news/1251/google-stitch-design-md-open-source-spec-2026
- **AgentDock breakdown of Stitch vs Figma context:** https://agentdock.ai/academy/what-is-google-stitch-the-ai-design-tool-that-has-figma-worried
- **Tech-Insider on Stitch 2.0 (origin of DESIGN.md as Stitch export):** https://tech-insider.org/google-stitch-ai-design-tool-march-2026-update/
- **Codecademy step-by-step on Stitch (workflow context):** https://www.codecademy.com/article/google-stitch-tutorial-ai-powered-ui-design-tool

### Community curations and extractors
- **VoltAgent/awesome-design-md (brand DESIGN.md collection):** https://github.com/VoltAgent/awesome-design-md
- **VoltAgent/awesome-claude-design (68 files for Claude):** https://github.com/VoltAgent/awesome-claude-design
- **bergside/design-md-chrome (Chrome extension extractor):** https://github.com/bergside/design-md-chrome
- **DESIGN.md Style Extractor (Creators Toolbox):** https://creatorstoolbox.com/tools/designmd-style-extractor
- **Figma Community plugin "DESIGN.md Generator":** https://www.figma.com/community/plugin/1612814320994608244/design-md-generator

## Part 2 — AI component generation

### shadcn ecosystem (the center of gravity)
- **shadcn CLI 3.0 + MCP changelog (Aug 2025):** https://ui.shadcn.com/docs/changelog/2025-08-cli-3-mcp
- **Custom registry — getting started:** https://ui.shadcn.com/docs/registry/getting-started
- **Vercel template — shadcn registry starter:** https://vercel.com/templates/next.js/shadcn-ui-registry-starter
- **shadcn Registry Manager MCP (Playbooks listing):** https://playbooks.com/mcp/shadcn-registry-manager
- **AdminLTE — block library survey 2026:** https://adminlte.io/blog/shadcn-ui-block-libraries/
- **Aceternity UI CLI (registry-compatible):** https://ui.aceternity.com/docs/cli

### Hosted AI design tools
- **v0 by Vercel (Platform API + MCP):** https://v0.app/
- **21st.dev Magic — multi-variant generation:** https://21st.dev/magic
- **21st.dev Magic MCP server listing:** https://mcp.umin.ai/server/21st_dev_magic
- **Subframe — design tool built for code:** https://www.subframe.com/
- **Builder.io Visual Copilot:** https://www.builder.io/figma-to-code
- **Magic Patterns MCP (community port):** https://github.com/ryanleecode/magic-patterns-mcp
- **Magic Patterns overview:** https://www.aifun.cc/en/sites/magic-patterns.html
- **Lovable export guide (no real API):** https://shipper.now/export-code-lovable/
- **Onlook ("Cursor for designers") writeup:** https://www.blog.brightcoding.dev/2025/09/05/onlook-the-open-source-cursor-for-designers-that-lets-you-visually-build-style-and-edit-react-apps-with-ai/

### Parallel iteration patterns
- **Claude Code docs — worktrees:** https://code.claude.com/docs/en/worktrees
- **Boris Cherny on built-in worktree support (Threads):** https://www.threads.com/@boris_cherny/post/DVAAnexgRUj/introducing-built-in-git-worktree-support-for-claude-code-now-agents-can-run-in
- **Claude Fast — worktree guide:** https://claudefa.st/blog/guide/development/worktree-guide
- **Mejba Ahmed — parallel agents how-to:** https://www.mejba.me/blog/claude-code-git-worktrees-parallel-agents
- **SpillwaveSolutions/parallel-worktrees skill:** https://github.com/spillwavesolutions/parallel-worktrees
- **Crystal → Nimbalyst (kanban over parallel sessions):** https://github.com/stravu/crystal

### Vision-model feedback loops (Playwright/Chrome DevTools MCP)
- **Microsoft Playwright (project root):** https://github.com/microsoft/playwright
- **Playwright MCP — screenshot how-to (Shipyard):** https://shipyard.build/blog/playwright-mcp-screenshots/
- **Chrome DevTools MCP listing:** https://mcpservers.org/servers/github-com-chromedevtools-chrome-devtools-mcp
- **Fungies — top GitHub agent repos 2026 (star ranking):** https://fungies.io/top-github-repositories-ai-agent-frameworks-2026/

### Design tokens — DTCG and Style Dictionary
- **W3C DTCG — first stable version (Oct 28, 2025):** https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/
- **DesignZig summary of the stable release:** https://designzig.com/design-tokens-specification-reaches-first-stable-version-with-w3c-community-group/
- **Style Dictionary — DTCG support:** https://styledictionary.com/info/dtcg/
- **Style Dictionary — token concepts:** https://styledictionary.com/info/tokens/
- **Style Dictionary v4 migration guide:** https://styledictionary.com/versions/v4/migration/
- **Design Systems WTF — Style Dictionary explainer:** https://designsystems.wtf/style-dictionary/

### Tailwind v4 + shadcn theming
- **Tailwind v4 `@theme` directive (SeedFlip):** https://seedflip.co/blog/tailwind-v4-theme-directive
- **Joseph Goins — theming shadcn with Tailwind v4 + CSS vars:** https://medium.com/@joseph.goins/theming-shadcn-with-tailwind-v4-and-css-variables-d602f6b3c258
- **Mavik Labs — design tokens that scale with Tailwind v4 (2026):** https://www.maviklabs.com/blog/design-tokens-tailwind-v4-2026/

## Part 3 — Canvas/editor survey (open-source Figma alternatives)

### Penpot
- **Penpot Design Tokens product page:** https://penpot.app/collaboration/design-tokens
- **Tokens Studio — native tokens in Penpot:** https://tokens.studio/blog/tokens-studio-penpot-bringing-native-open-standard-design-tokens-to-everyone
- **Smashing — Penpot experimenting with MCP servers (Jan 2026):** https://www.smashingmagazine.com/2026/01/penpot-experimenting-mcp-servers-ai-powered-design-workflows/
- **Official Penpot MCP server:** https://github.com/penpot/penpot-mcp
- **Self-hosted Penpot MCP server (66 tools):** https://github.com/ancrz/penpot-mcp-server
- **DTCG typography composite drift (issue #8140):** https://github.com/penpot/penpot/issues/8140

### tldraw
- **tldraw MCP App announcement:** https://tldraw.dev/blog/tldraw-mcp-app
- **tldraw-desktop (Canvas API on :7236):** https://github.com/tldraw/tldraw-desktop
- **tldraw v3.0.0 release notes:** https://newreleases.io/project/github/tldraw/tldraw/release/v3.0.0
- **tldraw realtime collaboration MCP (community):** https://hexmos.com/freedevtools/mcp/realtime-collaboration/eperez28--tldraw/

### Storybook
- **Storybook MCP overview:** https://storybook.js.org/docs/ai/mcp/overview
- **Storybook MCP for React (announcement):** https://storybook.js.org/blog/storybook-mcp-for-react/

### Rive (read-only at runtime)
- **Rive runtimes:** https://rive.app/runtimes
- **Rive .riv format spec:** https://rive.app/docs/runtimes/advanced-topic/format
- **Rive text runtime guide:** https://help.rive.app/runtimes/text

### Graphite (vector + node graph, alpha)
- **Graphite — VentureGaps overview:** https://www.venturegaps.com/tools/graphite

### Figma (closed but documented)
- **Figma MCP server guide:** https://github.com/figma/mcp-server-guide

## Part 4 — Claude Code specifics

- **Claude Code skills docs:** https://code.claude.com/docs/en/skills
- **Ofox — hooks/subagents/skills complete guide:** https://ofox.ai/blog/claude-code-hooks-subagents-skills-complete-guide-2026/

## Notes on freshness

- DESIGN.md sources are all from April–May 2026, post-open-source release.
- Penpot MCP merged Feb 3, 2026; Smashing article from Jan 2026 reflects pre-merge state.
- Tailwind v4 references assume v4 stable; if you hit a beta-only feature, the migration article above documents what shipped vs what's still beta.
- DTCG references pin to the 2025.10 stable module — earlier articles describing tokens as "draft" predate this.
- HN reception is muted (37 points / 4 comments); do not over-weight it as community signal — the GitHub star trajectory (~5k → 13.6k in three weeks) is the more honest pulse.
