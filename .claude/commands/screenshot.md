---
description: Screenshot a URL at the three dsx viewports (360/768/1280) via Playwright MCP and save to ./screenshots/.
argument-hint: <url>
---

Args:

- `url`: a fully-qualified URL (e.g., `http://localhost:3000/tokens`).

## Your job

1. Verify `mcp__playwright__*` tools are available (the user must have installed the `playwright` MCP server — see [README.md](../../README.md) for the install command).
2. For each viewport in `[360, 768, 1280]`:
   a. Navigate to the URL via `mcp__playwright__navigate` with the viewport set.
   b. Capture via `mcp__playwright__screenshot` and save to `screenshots/<slug-of-url>-<viewport>.png`.
3. Emit a markdown table of saved paths and pixel dimensions.

## What you MUST NOT do

- Do not auto-update Playwright snapshots in `tests/visual/`. Those are committed regression baselines. To update them deliberately, the user runs `pnpm test:visual:update`.
