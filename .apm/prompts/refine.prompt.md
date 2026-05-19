---
description: Apply a targeted adjustment to an existing story file. Surgical edits only.
---

`$ARGUMENTS` is `<path-or-slug> <adjustment text…>`.

1. Resolve the target:
   - If the first token looks like a path (contains `/` or ends in `.stories.tsx`), use it as-is.
   - Otherwise treat it as a slug; try `apps/storybook/src/pages/<slug>.stories.tsx` first, then `apps/storybook/src/sections/<slug>.stories.tsx`. If neither exists, list candidates with `ls apps/storybook/src/pages apps/storybook/src/sections` and ask the user.
2. Read the target file in full.
3. The adjustment text is everything after the first token. Apply surgical edits — change tokens, copy, spacing, single elements. **Do not rewrite the file.** If the adjustment is too broad for surgical edits, surface that to the user and ask whether to proceed.
4. Skills `composition-patterns` and `shadcn-component-catalog` are auto-loaded — use them if the adjustment names a layout pattern or component.
5. Storybook hot-reloads. Output a short diff summary: file path, what you changed, what you intentionally left alone.
