---
description: Compose a new full-page story from a brief, mutated from the nearest matching page reference.
---

Take the user's brief from $ARGUMENTS.

1. Run `node scripts/find-page-reference.mjs "$ARGUMENTS"` to score the bundled corpus in `.dsx/page-references/`. Read the top match's file in full.
2. The skills `shadcn-component-catalog`, `storybook-csf3`, and `composition-patterns` are auto-loaded by their descriptions when this command runs — consult them for any prop or pattern you're unsure about. Use `storybook-stories` for advanced CSF3 idioms.
3. Pick a kebab-case slug from the brief (e.g. "modern SaaS landing" → `saas-landing`). Write a new CSF3 story file at `apps/storybook/src/pages/<slug>.stories.tsx`. Use `title: 'Pages/<Human-readable name>'`, `parameters: { layout: 'fullscreen' }`, and a single `Default` story exporting realistic content.
4. **Mutate, do not copy.** Adjust the structure, copy, and component choices toward the brief. Keep the reference's good layout instincts; replace its content. If the brief asks for a section the reference doesn't have, add it; if it has a section the brief doesn't need, drop it.
5. Import components from `@gallery/ui/*` (e.g. `import { Button } from '@gallery/ui/button';`). Do not invent components that don't exist in `apps/gallery/components/ui/` — surface gaps to the user instead.
6. The Stop hook runs the pipeline. Storybook's dev server hot-reloads the new file automatically.
7. Output a one-line summary: reference picked, score, new file path, Storybook URL (`http://localhost:6006/?path=/story/pages-<slug>--default`).
