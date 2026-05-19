---
description: Rebuild Style Dictionary outputs (CSS, Tailwind theme snippet, Flutter, Compose, iOS) and report the file diff.
argument-hint: (no args)
---

Run `pnpm tokens` and report:

1. The exit code (must be 0).
2. The list of files that changed in `build/` since the last commit (use `git status --short build/ 2>/dev/null || ls -la build/`).
3. If `apps/gallery` is already running (`http://localhost:3000`), poke it once with `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000` so the user knows whether the dev server picked up the new CSS.

Do not modify code. Do not commit. The user decides whether to keep the rebuild.
