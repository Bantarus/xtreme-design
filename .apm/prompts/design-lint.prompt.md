---
description: Run `@google/design.md lint DESIGN.md` and print the findings.
argument-hint: (no args)
---

Run `npx --yes @google/design.md@latest lint DESIGN.md --format json`. Parse the JSON, then summarize:

- `errors` count (must be 0)
- `warnings` count — 3 warnings about unreferenced `border`, `border-strong`, and `focus-ring` colors are EXPECTED (see [KNOWN-ISSUES.md](../../KNOWN-ISSUES.md)) and should be filtered from the user-visible report.
- Any other warning or info finding: print verbatim.

If `errors > 0`, end the message with a single recommended next step (e.g., "Fix the front-matter typo at colors.primary, then re-run /design-lint").
