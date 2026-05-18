---
description: Restore a saved version's DESIGN.md back onto the active surface. Shell-style — no agent reasoning needed.
argument-hint: "<id or name>"
---

Run exactly this, no preamble:

```bash
node scripts/restore.mjs "$ARGS"
```

The script copies the requested version's `DESIGN.md` onto the active surface and runs the pipeline. Forward its stdout to the user verbatim. If it exits non-zero, surface the error message and stop. Do NOT attempt to fix the issue by editing files — restore is purely a state-swap.

After a successful restore, the user should refresh `http://localhost:3000` (no `?v=` query param) to see the active palette.
