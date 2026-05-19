---
description: Generate a fresh DESIGN.md from a brief by mutating the closest-matching reference in `.dsx/references/`.
argument-hint: "<brief in plain English>"
---

You receive a brief in `$ARGS`.

## Your job (in order)

1. Run `node scripts/find-reference.mjs "$ARGS"` and read its JSON output. The first array entry is the top-scoring reference. If the top score is `0`, fall back to `.dsx/references/editorial-heritage.md` — it is the neutral default.
2. Read the full content of the top reference (`Read` tool on its `path`).
3. Read the current `base.DESIGN.md` so you know which colors and components the gallery MUST keep populated.
4. Write a fresh `DESIGN.md` (overwrite the existing active file). Rules:
   - Preserve the reference's STRUCTURE (markdown section order, components keys, typography keys).
   - Preserve the reference's PROSE patterns and section headings.
   - MUTATE the palette, typography family, spacing/radii toward the brief. Do not copy hex values literally — shift hue, saturation, and value to match the brief's emotional direction.
   - Keep every color name that base.DESIGN.md defines. Adding new names is fine; dropping a base name will fail `scripts/design-md-sync.mjs`.
   - Keep every component slot that base.DESIGN.md defines. Same rule.
   - Insert a `description:` line in the front-matter that summarizes the brief in one sentence.
5. Do NOT run lint, export, tokens build, or snapshot. The Stop hook handles that automatically after your turn.
6. Output ONE sentence to the user:
   `Generated DESIGN.md from reference <name> (score <N>), mutated for: <brief one-liner>. View at http://localhost:3000.`

## What you MUST NOT do

- Do not literally copy the reference. The agent's value is in mutation, not transcription.
- Do not invent token names that don't exist in `base.DESIGN.md`. Adding NEW names is fine; dropping a base name will fail `design-md-sync`.
- Do not write any file other than `DESIGN.md`. The PreToolUse fence will reject anything else.
- Do not run the pipeline, lint, or tests yourself — those run automatically on Stop.
