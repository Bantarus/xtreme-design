---
name: composition-patterns
description: Common page composition patterns — hero layouts, pricing grids, dashboard regions, form structures, empty-state archetypes — as exemplified by the .dsx/page-references/ corpus. Load when composing a new page or section story, or when a brief mentions a layout idea by name.
---

<!--
TODO(user): catalog the recurring layout patterns across the 10
reference stories in .dsx/page-references/. The references themselves
are the source of truth; this skill documents the abstractions.

Recommended sections:
  1. Hero archetypes — centered + dual-CTA (landing-saas), image-led
     editorial (landing-product), with-screenshot, with-form.
  2. Multi-column grids — three-up feature grid (cards), four-up KPI
     strip (dashboard-ops, dashboard-analytics), three-up pricing tier
     grid (pricing-tiered), responsive-collapse rules.
  3. Sidebar + main layouts — fixed sidebar nav (dashboard-ops),
     split-screen (auth-signin, landing-product /journal), three-pane
     (not currently in corpus).
  4. Form structures — single-card form (auth-signin, smoke/form),
     multi-section settings form (settings-profile), multi-step wizard
     (wizard-onboarding).
  5. Empty / error / null states — single-CTA empty (empty-state),
     friendly 404 with search recovery (error-404).
  6. Layout "negative space" rules — when to use `layout: 'centered'`
     vs `layout: 'fullscreen'` on the story meta; when a section needs
     a wrapper vs not.

For each pattern, link to the specific reference file:
   - hero/centered → .dsx/page-references/landing-saas.stories.tsx
   - dashboard/sidebar → .dsx/page-references/dashboard-ops.stories.tsx
   - …

The agent loads this skill plus the matched reference together; the
skill explains the pattern abstractly, the reference is the working
example.
-->
