---
description: Rename the most recent auto-version slot to a human-meaningful name. Shell-style — no agent reasoning needed.
argument-hint: "<human name>"
---

Run exactly this, no preamble:

```bash
node scripts/snapshot.mjs --name "$ARGS"
```

Forward its stdout to the user verbatim. If it exits non-zero, surface the error message and stop. Do NOT attempt to fix the issue by editing files — the human owns version-store state.
