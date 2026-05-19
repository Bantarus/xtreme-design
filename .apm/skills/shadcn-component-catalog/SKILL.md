---
name: shadcn-component-catalog
description: Catalog of available shadcn/ui components in this template, their props, variants, and common composition patterns. Load when composing UI from existing components, writing stories, or deciding which component fits a brief.
---

# shadcn-component-catalog

The dsx template ships with **34 shadcn 4.7 components** installed under `apps/gallery/components/ui/`. Stories import them from `@gallery/ui/<slug>`. The fence permits no new components — if a brief needs something not in this catalog, surface that to the user instead of inventing.

Source of truth: `apps/gallery/components/ui/*.tsx`. Descriptions and categorization: `apps/gallery/lib/components-manifest.ts`.

## Quick lookup

| Category | Components |
|---|---|
| **Primitives** | `button`, `badge`, `avatar`, `separator` |
| **Forms** | `input`, `textarea`, `label`, `select`, `checkbox`, `radio-group`, `switch`, `slider`, `input-group` |
| **Navigation** | `tabs`, `breadcrumb`, `pagination`, `command` |
| **Overlays** | `dialog`, `alert-dialog`, `sheet`, `popover`, `dropdown-menu`, `context-menu`, `tooltip`, `hover-card` |
| **Feedback** | `alert`, `progress`, `skeleton`, `sonner` (toast) |
| **Data** | `card`, `table`, `accordion`, `calendar` |
| **Layout** | `scroll-area`, `aspect-ratio` |

Import shape — always named, always from `@gallery/ui/<kebab-slug>`:

```ts
import { Button } from '@gallery/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@gallery/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@gallery/ui/dialog';
```

## Components in detail

### Button — `@gallery/ui/button`

Six variants × eight sizes. The single most important affordance per view.

| `variant` | When to use |
|---|---|
| `default` | The **one** primary action per view. Filled with `--color-primary`. |
| `outline` | Neutral secondary actions. Border + transparent fill. |
| `secondary` | Less-primary action that still needs weight. Filled with `--color-secondary`. |
| `ghost` | Tertiary action (toolbars, inline). No fill until hover. |
| `destructive` | Delete / remove / discard. Filled with destructive tint. |
| `link` | Inline text-style link inside prose. Use sparingly. |

| `size` | Use |
|---|---|
| `default` | Standard button (~h-8). |
| `xs`, `sm`, `lg` | Density variants. `sm` for compact toolbars, `lg` for hero CTAs. |
| `icon`, `icon-xs`, `icon-sm`, `icon-lg` | Square icon-only buttons. Always pair with an `aria-label`. |

```tsx
<Button>Save</Button>                        // default + default
<Button variant="outline" size="sm">Cancel</Button>
<Button size="icon" aria-label="Open menu"><MenuIcon /></Button>
```

**Type your variants.** When picking `variant` programmatically, use `as const` so TS narrows it:

```tsx
const plans = [{ ..., variant: 'default' as const }, { ..., variant: 'outline' as const }];
```

### Badge — `@gallery/ui/badge`

Six variants: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`. Used for status chips, counts, "new" markers.

```tsx
<Badge>New</Badge>
<Badge variant="secondary">Beta</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="outline" className="gap-1"><CheckIcon className="size-3" /> Ready</Badge>
```

### Card — `@gallery/ui/card`

Surface container. Exports: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`. All are plain `<div>`s with project styling.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Quarterly review</CardTitle>
    <CardDescription>Operations summary for Q2.</CardDescription>
    <CardAction><Button size="sm" variant="ghost">Export</Button></CardAction>
  </CardHeader>
  <CardContent>
    <p>Throughput steady at 12.4k requests/min.</p>
  </CardContent>
  <CardFooter className="justify-end gap-2">
    <Button variant="outline">Dismiss</Button>
    <Button>Open report</Button>
  </CardFooter>
</Card>
```

`CardAction` lives inside `CardHeader` and floats to the right via the project's flex setup. Use it for the secondary action paired with the title.

### Dialog / AlertDialog / Sheet — overlay surfaces

All three use **base-ui** primitives, not Radix. The Radix `asChild` prop is **gone** — use the `render` prop instead:

```tsx
// WRONG (Radix idiom, throws in shadcn 4.7)
<DialogTrigger asChild><Button>Open</Button></DialogTrigger>

// RIGHT
<DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
```

Children are forwarded automatically — `render` takes the wrapper component, children stay as children. Same pattern for `DialogClose`, `AlertDialogTrigger`, `AlertDialogAction`, `AlertDialogCancel`, `SheetTrigger`, `SheetClose`, `PopoverTrigger`, `DropdownMenuTrigger`, etc.

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action is irreversible.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose render={<Button variant="secondary" />}>Cancel</DialogClose>
      <DialogClose render={<Button />}>Save</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

`Sheet` adds a `side` prop on `SheetContent` — `"right" | "left" | "top" | "bottom"`. Default is right.

### Input / Textarea / Label — `@gallery/ui/input`, etc.

Plain HTML-shaped wrappers with project styling. Always pair `<Label htmlFor>` with `<Input id>` for accessibility:

```tsx
<div className="grid gap-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

For invalid state, set `aria-invalid` on the input — the project styles will pick it up.

### InputGroup — `@gallery/ui/input-group`

Wraps an input with addons (icons, buttons, text labels). Exports `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText`, `InputGroupInput`, `InputGroupTextarea`.

```tsx
<InputGroup>
  <InputGroupAddon><SearchIcon /></InputGroupAddon>
  <InputGroupInput placeholder="Search…" />
  <InputGroupButton size="icon-sm" aria-label="Clear"><XIcon /></InputGroupButton>
</InputGroup>
```

Reach for `InputGroup` whenever the brief mentions a search bar, a copy-to-clipboard input, a unit-suffixed numeric field, etc. Reach for plain `Input` otherwise.

### Tabs — `@gallery/ui/tabs`

Switcher between same-level views. Always supply `defaultValue` (uncontrolled) or `value` + `onValueChange` (controlled).

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="activity">…</TabsContent>
  <TabsContent value="settings">…</TabsContent>
</Tabs>
```

For toolbar-style tabs without an associated panel (e.g., a monthly/annual pricing toggle), use `Tabs` + `TabsList` + `TabsTrigger` only — skip `TabsContent`. The selection state still works.

### Table — `@gallery/ui/table`

Real `<table>` with project styling. Exports: `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption`.

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Latency</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map((r) => (
      <TableRow key={r.id}>
        <TableCell className="font-mono text-xs">{r.name}</TableCell>
        <TableCell><Badge variant="outline">{r.status}</Badge></TableCell>
        <TableCell className="text-right font-mono text-xs">{r.latency}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

For row actions (open / delete / edit), put a `DropdownMenu` in the last cell with `align="end"` on the content.

### Tabs vs Accordion vs Sheet

- **Tabs** — same-level switching, content visible immediately on click. Use for ≤6 sibling views.
- **Accordion** — vertical stacking, multiple sections potentially open. Use for FAQ, settings sections, file-tree.
- **Sheet / Dialog** — temporary surface for a workflow that interrupts the page. Reserve for actions, not browsing.

### Select / Combobox

`@gallery/ui/select` is for short, known option sets (≤20). For searchable/dynamic lists, use `@gallery/ui/command` (`Command`, `CommandInput`, `CommandList`, `CommandItem`) wrapped in a `Popover` for the ⌘K-style picker.

### Calendar

`@gallery/ui/calendar` exports `Calendar`. Backed by `react-day-picker@10`. Wrap in a `Popover` for inline date pickers; use full-width for a scheduling view.

### Sonner (toast)

`@gallery/ui/sonner` exports a `Toaster` component (mount it once at the app root) and the toast function from the `sonner` package:

```ts
import { toast } from 'sonner';
toast.success('Saved');
toast.error('Could not save');
```

Storybook stories generally don't need to mount `<Toaster />`; the gallery layout already does. If a story demonstrates a toast triggered by a button, include `<Toaster />` at the top of the render function.

## Composition recipes

### Form layout (single card)

`Card` + `CardHeader` + `CardContent` containing `<div className="grid gap-4">` of `<Label>` + `<Input>` pairs, then a `Button` row at the end. Match the pattern in `apps/storybook/src/__smoke__/form.stories.tsx`.

### Card + action button

Title in `CardTitle`, ghost or outline button in `CardAction`. See `dashboard-ops` and the smoke card story.

### Data table with row actions

`Table` whose last `TableCell` per row contains `DropdownMenu` with `align="end"` on the content. Items: View, Edit, Delete (the last one with `variant="destructive"` styling via `DropdownMenuItem` className).

### Split layout (auth, editorial)

`<div className="grid min-h-screen md:grid-cols-2">` with one side `bg-muted` for the marketing/quote side and the form/content on the other. See `auth-signin` reference.

### KPI strip

`<div className="grid gap-4 sm:grid-cols-4">` of four small `Card`s each holding a mono label, large value, and small delta line. See `dashboard-ops`, `dashboard-analytics`.

### Pricing grid

Three `Card`s in `sm:grid-cols-3`. Middle one gets `className="border-primary shadow-md"` and a `<Badge>Recommended</Badge>` next to the title. Plan data lives in a constant; map over it. See `pricing-tiered`.

### Empty state

Centered: dashed-border icon block + `h1` + supporting paragraph + one primary button + secondary link. See `empty-state` reference; the icon is `lucide-react`.

## Gotchas / not in scope

- **No `Form` component.** `pnpm dlx shadcn add form` silently no-ops in shadcn 4.7. Build forms ad-hoc with `<form>` + `Label` + `Input` + `Button`. Do NOT install a new component — surface the gap.
- **No `asChild` prop.** See Dialog section above. shadcn 4.7 uses `render={<Component />}` instead.
- **`Calendar.classNames` has a TS cast** (see `KNOWN-ISSUES.md`). Stories using `<Calendar />` work fine; you only encounter the cast when editing the component file itself, which the fence blocks anyway.
- **Form field components** like `FormControl`, `FormMessage`, `FormField` from shadcn — not installed. Use direct `Label`/`Input` patterns.
- **Tooltip provider** — `@gallery/ui/tooltip`'s `Tooltip` works standalone in stories. You don't need to wrap the story in a `TooltipProvider`.

## When the brief asks for something missing

If the brief needs:
- A new visual primitive (`Stepper`, `Combobox`, `Drawer`) → surface to the user: "the catalog doesn't include X; ship as Y, or ask the human to add X to the gallery."
- A different version of an existing component → use what's there. The agent does not edit `apps/gallery/components/ui/*`.
- A page with charts → use the inline CSS-bars pattern from `dashboard-analytics` (an array of `<div>` with `height: %`) — no chart library is installed.
