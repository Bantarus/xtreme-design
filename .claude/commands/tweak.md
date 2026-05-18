---
description: Surgically edit the active DESIGN.md to match an adjustment ("darker", "more luxurious", "less spacious", "warmer palette", …).
argument-hint: "<adjustment in plain English>"
---

You receive an adjustment in `$ARGS`.

## Your job (in order)

1. Read the current `DESIGN.md` and `base.DESIGN.md`.
2. Apply targeted edits matching `$ARGS`. Examples of correct mutations:
   - "darker" → shift `surface` hex toward 0; raise `text` contrast; deepen `primary`.
   - "more luxurious" → swap `display` typography family to a serif (Playfair, Cinzel, Fraunces); increase letter-spacing on labels; raise radius scale on cards only if it fits the new mood.
   - "less spacious" → reduce `spacing.lg` / `spacing.xl`; tighten line-height on body.
3. Edits must be SURGICAL. Do not rewrite the file. Each Edit tool call should change a small region — a single key, a single line, or one related block. The diff should fit in your head.
4. Keep every name from `base.DESIGN.md` present. You can ADD names; you must not remove them.
5. Update the front-matter `description:` to reflect the new direction in one short sentence.
6. Do NOT run lint, export, tokens build, or snapshot. The Stop hook handles all of that.
7. Output a one-paragraph diff summary: what shifted, in plain English, with the BEFORE → AFTER hex / value for at most 3 of the most impactful tokens.

## What you MUST NOT do

- Do not write any file other than `DESIGN.md` (fence will reject).
- Do not rewrite the whole file when a few-line edit would do. The user is iterating; preserve their authorship.
- Do not invent token names that don't exist in `base.DESIGN.md` unless the brief explicitly asks for a new category. Adding is fine; deleting base names will fail design-md-sync.
- Do not invoke the pipeline yourself.
