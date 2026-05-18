import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
      <header className="mb-12 flex items-baseline justify-between border-b border-border pb-6">
        <div>
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Helios — dsx
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
            Design system smoke test
          </h1>
          <p className="mt-3 max-w-prose text-base text-muted-foreground">
            One of each installed component, rendered on a page that uses
            surface, text, and border tokens directly. Playwright snapshots
            this view at 360 / 768 / 1280.
          </p>
        </div>
        <Link
          href="/tokens"
          className="hidden text-sm font-medium text-primary underline-offset-4 hover:underline sm:inline"
        >
          /tokens →
        </Link>
      </header>

      <section className="space-y-10">
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              One primary action per view. Secondary, outline, and ghost
              variants share the same height and radius.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form fields</CardTitle>
            <CardDescription>
              Label + input pair with focus ring rendered against `surface`.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="grid w-full max-w-sm gap-2">
              <Label htmlFor="api-key">API key</Label>
              <Input id="api-key" type="text" placeholder="sk_live_…" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status badges</CardTitle>
            <CardDescription>
              Status-colored badges, rendered alongside the neutral default.
              Each clears WCAG AA contrast against its fill.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <Badge>Neutral</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overlays</CardTitle>
            <CardDescription>
              Dialog and dropdown-menu both lean on `--color-popover`,
              `--color-border`, and `--color-ring`. Open them to verify the
              token swap when toggling dark mode.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>
                Open dialog
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save changes?</DialogTitle>
                  <DialogDescription>
                    Confirm to write the current draft. This is a smoke-test
                    surface — wired up only to verify that `popover` and
                    `border` tokens render correctly.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="secondary" />}>
                    Cancel
                  </DialogClose>
                  <DialogClose render={<Button />}>Save</DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                Open menu
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Muted surface band</CardTitle>
            <CardDescription>
              This card sits on `--color-surface-muted` to demonstrate the
              tonal-layer pattern Helios uses instead of shadows.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Body copy on a muted surface uses `--color-text-muted` for
              metadata-style prose. WCAG AA ≥ 4.5:1 against muted background.
            </p>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-16 border-t border-border pt-6 text-xs text-muted-foreground">
        Helios placeholder · rename brand in DESIGN.md and tokens/ before
        shipping.
      </footer>
    </main>
  );
}
