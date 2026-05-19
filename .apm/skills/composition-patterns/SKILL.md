---
name: composition-patterns
description: Common page composition patterns — hero layouts, pricing grids, dashboard regions, form structures, empty-state archetypes — as exemplified by the .dsx/page-references/ corpus. Load when composing a new page or section story, or when a brief mentions a layout idea by name.
---

# composition-patterns

A catalog of the recurring layout patterns across the 10 page references in `.dsx/page-references/`. The references themselves are the source of truth — this skill names the abstractions and tells you which reference is the canonical example.

The agent loads this skill plus the matched reference together. This skill explains the **shape**; the reference is the **working example**. When in doubt, read the reference.

## Pattern → reference index

| Pattern | Canonical reference | Layout |
|---|---|---|
| Centered hero, dual CTA | [`landing-saas`](../../../.dsx/page-references/landing-saas.stories.tsx) | `fullscreen` |
| Image-led editorial hero | [`landing-product`](../../../.dsx/page-references/landing-product.stories.tsx) | `fullscreen` |
| Sidebar + main, KPI strip + table | [`dashboard-ops`](../../../.dsx/page-references/dashboard-ops.stories.tsx) | `fullscreen` |
| Page-level analytics, no sidebar | [`dashboard-analytics`](../../../.dsx/page-references/dashboard-analytics.stories.tsx) | `fullscreen` |
| Multi-section settings form, danger zone | [`settings-profile`](../../../.dsx/page-references/settings-profile.stories.tsx) | `fullscreen` |
| Three-tier pricing grid + FAQ | [`pricing-tiered`](../../../.dsx/page-references/pricing-tiered.stories.tsx) | `fullscreen` |
| Split-screen auth | [`auth-signin`](../../../.dsx/page-references/auth-signin.stories.tsx) | `fullscreen` |
| Single-CTA empty state | [`empty-state`](../../../.dsx/page-references/empty-state.stories.tsx) | `fullscreen` |
| Friendly 404 with search recovery | [`error-404`](../../../.dsx/page-references/error-404.stories.tsx) | `fullscreen` |
| Multi-step onboarding wizard | [`wizard-onboarding`](../../../.dsx/page-references/wizard-onboarding.stories.tsx) | `fullscreen` |

## Hero archetypes

### Centered hero with dual CTA — `landing-saas`

Use when: the brief is SaaS / product / B2B. Two CTAs, one primary (Start free), one secondary (Watch demo / Read docs). Optional badge above the headline ("v1.0 — shipping now").

Shape:
```
<header (logo + nav + sign-in/start) />
<section centered px-6 py-20>
  <Badge variant="secondary">…</Badge>          ← optional
  <h1 className="text-5xl ... sm:text-6xl">…</h1>
  <p className="mx-auto mt-5 max-w-2xl ...">…</p>
  <div className="mt-8 flex justify-center gap-3">
    <Button size="lg">Primary <ArrowRight /></Button>
    <Button size="lg" variant="outline">Secondary</Button>
  </div>
</section>
<Separator />
<section #features>…</section>
```

The `Separator` is doing real work — it visually closes the hero and opens the body.

### Image-led editorial hero — `landing-product`

Use when: the brief is consumer / lifestyle / editorial. Hero is an aspect-ratio image block (or muted placeholder) with the headline overlaid.

Shape:
```
<AspectRatio ratio={21/9} className="overflow-hidden rounded-lg bg-muted">
  <div className="flex h-full flex-col items-start justify-end gap-3 p-10">
    <Badge>…</Badge>
    <h1 className="max-w-md text-5xl ...">Headline</h1>
    <p className="max-w-md text-muted-foreground">Subhead</p>
    <Button size="lg">CTA <ArrowRight /></Button>
  </div>
</AspectRatio>
```

The `bg-muted` placeholder stays until the user drops in a real image. Compared to the centered hero, this one feels slower, more deliberate.

## Multi-column grids

### Three-up feature grid

Two reference instances:
- `landing-saas` — three `Card`s with icon + title + body.
- `pricing-tiered` — three pricing cards (highlight the middle one).

Both use `sm:grid-cols-3 gap-6`. Mobile collapses to a single column.

### Four-up KPI strip

Used in dashboards (`dashboard-ops`, `dashboard-analytics`). Each card holds:
- mono uppercase label (`<p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">`)
- big value (`<CardTitle className="text-3xl">`)
- tiny delta line in `<CardContent>` (text or `<Badge>`)

Layout: `<section className="grid gap-4 sm:grid-cols-4">`. Below `sm`, collapses to 1 column; tablets and up get all four side-by-side.

### Pricing tier grid (3-up with highlight)

`pricing-tiered` pattern. Middle plan gets:
```tsx
<Card className={p.highlight ? 'border-primary shadow-md' : ''}>
  <CardHeader>
    <div className="flex items-baseline justify-between">
      <CardTitle>{p.name}</CardTitle>
      {p.highlight && <Badge>Recommended</Badge>}
    </div>
    …
  </CardHeader>
</Card>
```

The visual contrast is `border-primary` + a slight shadow. The recommended badge is the readable callout.

## Sidebar + main layouts

### Fixed sidebar nav — `dashboard-ops`

```
<div className="flex min-h-screen">
  <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:flex md:flex-col">
    <header (workspace name)>
    <Separator />
    <nav>
      {items.map(i => <button className={active ? 'bg-muted ...' : '...'}>...</button>)}
    </nav>
  </aside>
  <main className="flex-1 px-6 py-6">
    <header>…</header>
    <section>KPI strip</section>
    <section>main content (table, list, etc.)</section>
  </main>
</div>
```

Sidebar hides below `md`. The active nav item gets `bg-muted font-medium text-foreground`; inactive items get `text-muted-foreground hover:bg-muted hover:text-foreground`.

### Split-screen (auth, editorial sidebar) — `auth-signin`

```
<div className="grid min-h-screen md:grid-cols-2">
  <aside className="hidden bg-muted p-12 md:flex md:flex-col justify-between">
    {/* logo + quote + © */}
  </aside>
  <main className="flex items-center justify-center p-6">
    <Card className="w-full max-w-sm">{/* form */}</Card>
  </main>
</div>
```

Same shape works for any "marketing + form" split — sign-in, sign-up, beta-signup, contact form with a quote.

## Form structures

### Single-card form — `auth-signin`, smoke `form`

```
<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Welcome back</CardTitle>
    <CardDescription>Sign in to your acme.dev account.</CardDescription>
  </CardHeader>
  <CardContent>
    {/* OAuth row */}
    <div className="grid gap-3">
      <Button variant="outline" className="w-full"><GithubIcon /> GitHub</Button>
      <Button variant="outline" className="w-full">Google</Button>
    </div>
    {/* OR divider — Separator with absolutely positioned "OR" span */}
    <div className="relative my-6">
      <Separator />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">OR</span>
    </div>
    {/* form fields */}
    <form className="grid gap-4">
      <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" /></div>
      ...
      <Button type="submit" className="mt-2 w-full">Sign in</Button>
    </form>
  </CardContent>
</Card>
```

The width cap (`max-w-sm`) and the centered card on a `bg-background` page are the load-bearing visual choices.

### Multi-section settings — `settings-profile`

```
<header (page title + subtitle) />
<Card>
  <CardHeader><CardTitle>Profile</CardTitle><CardDescription>…</CardDescription></CardHeader>
  <CardContent className="grid gap-4">
    {/* avatar + change-photo */}
    {/* field stacks */}
    {/* save button right-aligned */}
  </CardContent>
</Card>

<Separator className="my-8" />

<Card>
  <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
  <CardContent>
    {/* Switch rows */}
  </CardContent>
</Card>

<Separator className="my-8" />

<Card className="border-destructive/40">
  <CardHeader>
    <CardTitle className="text-destructive">Danger zone</CardTitle>
    <CardDescription>Irreversible actions. Be sure before you continue.</CardDescription>
  </CardHeader>
  <CardContent className="flex items-center justify-between">
    <div>{/* explanation */}</div>
    <Button variant="destructive">Delete account</Button>
  </CardContent>
</Card>
```

Three signals make the danger zone read as dangerous:
1. `border-destructive/40` on the Card.
2. `text-destructive` on the title.
3. `variant="destructive"` on the button.

### Multi-step wizard — `wizard-onboarding`

```
<Card className="w-full max-w-xl">
  <CardHeader>
    <div className="flex items-center justify-between text-xs font-mono ... text-muted-foreground">
      <span>Step 2 of 3</span>
      <button>Skip</button>
    </div>
    <Progress value={66} className="mt-3" />
    <CardTitle className="mt-4">…</CardTitle>
    <CardDescription>…</CardDescription>
  </CardHeader>
  <CardContent>
    {/* current step fields */}
    {/* footer: Back (ghost) | "Saved" indicator + Continue (primary) */}
  </CardContent>
</Card>
```

The `Progress` value is the loadbearing visual — it gives the user a sense of distance traveled vs distance remaining. Always include "Step N of M" text above it for screen readers.

## Empty / error / null states

### Empty state — `empty-state`

A single, friendly invitation:
```
<div className="flex min-h-screen items-center justify-center bg-background px-6">
  <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 text-center">
    <div className="grid size-16 place-items-center rounded-2xl border border-dashed border-border bg-muted">
      <FolderPlusIcon className="size-8 text-muted-foreground" />
    </div>
    <h1 className="text-2xl font-semibold tracking-tight">No projects yet</h1>
    <p className="max-w-sm text-sm text-muted-foreground">…</p>
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button>Create your first project</Button>
      <Button variant="outline">Import from CSV</Button>
    </div>
    <a className="mt-2 text-xs text-muted-foreground underline-offset-4 hover:underline">Read the docs →</a>
  </div>
</div>
```

The dashed-border icon block in `bg-muted` is the canonical empty-state visual. Don't reach for an illustration unless the brief calls for one explicitly.

### 404 / friendly error — `error-404`

Same vertical-centered shape as empty-state, but lead with the status code in big mono primary type:
```
<p className="font-mono text-7xl font-semibold tracking-tight text-primary">404</p>
<h1 className="text-2xl ...">This page wandered off.</h1>
<p className="...">{recovery copy}</p>
<form className="flex w-full max-w-sm gap-2"><Input /><Button size="icon"><SearchIcon /></Button></form>
<Button variant="outline" className="mt-2"><ArrowLeftIcon /> Back to home</Button>
```

The recovery is the work — search + back-home. Don't write "Oops! Something went wrong" — name what happened.

## Negative-space rules

| Decision | Rule |
|---|---|
| `parameters.layout` | `'fullscreen'` for pages (anything with min-h-screen or a header bar), `'centered'` for sections that fit on a workbench. |
| Outer wrapper for fullscreen pages | `<div className="min-h-screen bg-background text-foreground">` — gives the version picker a surface to repaint. |
| Outer wrapper for centered sections | `<div className="bg-background px-6 py-12 text-foreground">` with an inner `mx-auto max-w-Nxl`. |
| Vertical rhythm | `py-20` for big landing-page sections, `py-12` for compact ones. `py-6` only inside cards. |
| Horizontal max-width | `max-w-4xl` for centered text (heros, prose), `max-w-5xl` for grids, `max-w-6xl` for full dashboards. Wider is rarely better. |
| Gap between cards in a grid | `gap-6` default. `gap-4` only for KPI strips where the cards are smaller. |
| Section separation | `Separator` between major sections in pages, `Separator className="my-8"` between cards in stacked settings forms. |
| Background bands | One `bg-muted` band per landing page max — usually a footer CTA or "from the journal" segment. |

## When the brief doesn't match a pattern

Many briefs fall in between patterns. The matcher will return the closest reference; **mutate, don't copy**:

- "A landing page for a developer tool, but the hero is image-first" → start from `landing-product` (image-led), borrow the dual-CTA pattern from `landing-saas`.
- "A dashboard with charts but no sidebar" → start from `dashboard-analytics`, drop the analytics tabs.
- "An onboarding screen but just one step, not multi-step" → start from `wizard-onboarding`, replace the `Progress` + step counter with a static badge.
- "A pricing card carousel for mobile" → start from `pricing-tiered`, swap `sm:grid-cols-3` for a horizontal scroll container.

If the brief doesn't match anything, ship from the closest reference and surface the gap: "The corpus doesn't have a `<thing>`; I shipped from `<X>` with adjustments. Add a `<thing>` to `.dsx/page-references/` if this is a recurring need."

## Anti-patterns

- **Stacking three full-bleed sections with no `Separator`s** — the eye loses track. Use `Separator` or an alternating `bg-background` / `bg-muted` band.
- **Repeating the same hero pattern in multiple sections** of the same page — only one hero per page.
- **Mixing icon sizes within a list** — pick one (`size-4` or `size-5`) per list.
- **Two `Button variant="default"` on the same screen** — by design system rule, only one primary action per view. The brief gets the second action; everything else is `outline`, `secondary`, `ghost`, or `link`.
- **Inline color literals** (`#7A3E0C`, `text-orange-700`) — break the version picker. Always semantic utilities.
- **`max-w-7xl` or `max-w-full` for content** — text becomes unreadable. Cap at `max-w-6xl` (dashboards) or `max-w-4xl` (prose).
