---
name: storybook-csf3
description: Storybook 10 CSF3 story conventions used in this template — Meta type, StoryObj, args, parameters, decorators, version-aware ActiveStylesheet, fullscreen layout. Load when writing or editing .stories.tsx files.
---

<!--
TODO(user): populate with the project-local conventions.

Authoritative reference: the storybook-stories skill (loaded automatically
when relevant). This skill should add the dsx-specific layer on top.

Recommended sections:
  1. Required shape — `Meta` + `StoryObj` + `satisfies` operator + the
     project's default `parameters.layout` choices (centered vs
     fullscreen — fullscreen for pages, centered for sections).
  2. Title conventions — Pages/<Name>, Sections/<Name>, Smoke/<Name>.
  3. Import policy — always from `@gallery/ui/<slug>`. Never invent
     components; surface gaps to the user.
  4. The version-aware ActiveStylesheet decorator (set up in
     apps/storybook/.storybook/preview.tsx). Every story inherits it; the
     user picks the active palette from the Storybook toolbar.
  5. When to use args + Controls vs a render function. For pages and
     sections, a single Default story with a render function is the norm.
     Args are reserved for component-level stories (smoke/ folder).
  6. Forbidden patterns — useState/useEffect in render bodies (use
     play functions), top-level fetches, side effects on import.
-->
