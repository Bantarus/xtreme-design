import { ArrowRightIcon, CheckIcon, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const features = [
  {
    title: 'One file, one surface',
    body: 'DESIGN.md is the only thing the agent edits. The rest of the system renders itself.',
  },
  {
    title: 'Versioned by default',
    body: 'Every iteration is a snapshot. Swap between palettes with a URL param — no rebuild.',
  },
  {
    title: 'Multi-platform tokens',
    body: 'DTCG sources fan out to CSS, Tailwind, Flutter, Compose, and SwiftUI in one pass.',
  },
];

const tiers = [
  { name: 'Solo', price: '$0', features: ['Self-host', 'Unlimited DESIGN.md edits', '5 saved versions'], cta: 'Start free' },
  { name: 'Studio', price: '$24', features: ['Team workspaces', 'Unlimited versions', 'Compare A/B', 'Priority support'], cta: 'Start trial', featured: true },
  { name: 'Org', price: 'Talk', features: ['SSO', 'Audit log', 'Custom corpus', 'Dedicated reviewer'], cta: 'Contact sales' },
];

export default function LandingScene() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/scenes/landing" className="font-semibold tracking-tight">helios.io</Link>
          <nav className="hidden gap-6 text-sm sm:flex">
            <a className="text-muted-foreground hover:text-foreground" href="#features">Features</a>
            <a className="text-muted-foreground hover:text-foreground" href="#pricing">Pricing</a>
            <a className="text-muted-foreground hover:text-foreground" href="#docs">Docs</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">Sign in</Button>
            <Button size="sm">Start free</Button>
          </div>
        </div>
      </header>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <Badge variant="secondary" className="mb-6">v2 · now with A/B compare</Badge>
          <h1 className="mx-auto max-w-3xl text-5xl font-semibold tracking-tight leading-tight sm:text-6xl">
            Iterate your brand by editing one file.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Brief in plain English; ship a brand. DESIGN.md is the only surface — the gallery,
            tokens, and component library re-render themselves.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button size="lg">Start free <ArrowRightIcon data-icon="inline-end" /></Button>
            <Button size="lg" variant="outline"><ExternalLinkIcon data-icon="inline-start" /> View on GitHub</Button>
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-semibold tracking-tight">Why a scoped surface</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Three reasons we constrained the agent to one file instead of letting it touch the
            whole repo.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <CardTitle>{f.title}</CardTitle>
                  <CardDescription>{f.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-semibold tracking-tight">Pricing</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">Self-host is free forever. Pay for the hosted workflow.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {tiers.map((t) => (
              <Card key={t.name} className={t.featured ? 'border-2 border-primary' : undefined}>
                <CardHeader>
                  <CardTitle className="flex items-baseline justify-between">
                    {t.name}
                    {t.featured && <Badge>most picked</Badge>}
                  </CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-semibold text-foreground">{t.price}</span>
                    <span className="text-sm">{t.price === 'Talk' ? '' : ' / mo'}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {t.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <CheckIcon className="mt-0.5 size-4 text-success" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-4" />
                  <Button variant={t.featured ? 'default' : 'outline'} className="w-full">{t.cta}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Stay in the loop</h2>
          <p className="mt-2 text-muted-foreground">One email a month. New references, real users, no fluff.</p>
          <form className="mt-6 flex justify-center gap-2">
            <Input placeholder="you@example.com" className="max-w-xs" />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>

      <footer className="bg-muted/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted-foreground">
          <span>© 2026 helios.io · placeholder brand.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Status</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
