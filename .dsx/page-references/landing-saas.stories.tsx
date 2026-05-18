/**
 * @genre landing
 * @keywords saas, marketing, hero, pricing, professional, trust, cta, b2b, software, indie, developer
 * @description Marketing landing for a SaaS product — hero with dual CTAs, three-up feature grid, social proof, and footer CTA band.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRightIcon, CheckIcon, ZapIcon, ShieldIcon, GitBranchIcon } from 'lucide-react';
import { Badge } from '@gallery/ui/badge';
import { Button } from '@gallery/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@gallery/ui/card';
import { Separator } from '@gallery/ui/separator';

const meta = {
  title: 'Pages/Landing — SaaS',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="font-mono text-sm font-semibold tracking-tight">acme.dev</div>
        <nav className="hidden gap-6 text-sm text-muted-foreground sm:flex">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#docs">Docs</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
          <Button size="sm">Get started</Button>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <Badge variant="secondary" className="mb-6">
          v1.0 — shipping now
        </Badge>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          Ship features, not migrations.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          A database, a queue, and an admin UI in one binary. Built for indie developers who want to
          spend their time on the product, not the platform.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg">
            Start free <ArrowRightIcon />
          </Button>
          <Button size="lg" variant="outline">
            Read the docs
          </Button>
        </div>
      </section>

      <Separator />

      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: ZapIcon,
              title: 'Zero-config',
              body: 'One binary, one config file, one port. No services to wire together.',
            },
            {
              icon: ShieldIcon,
              title: 'Encrypted by default',
              body: 'Data at rest and in transit, with rotating keys you never touch.',
            },
            {
              icon: GitBranchIcon,
              title: 'Branch your data',
              body: 'Spin up a copy of production for every PR — fast, cheap, isolated.',
            },
          ].map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <f.icon className="text-primary" />
                <CardTitle className="mt-2">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{f.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Trusted by builders at
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <span>Linear</span>
          <span>Resend</span>
          <span>Vercel</span>
          <span>Anthropic</span>
          <span>Stripe</span>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Start in 90 seconds.</h2>
          <p className="text-muted-foreground">
            Free for projects under 10k requests/day. No credit card.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <CheckIcon className="text-primary" />
            <span className="text-sm">No setup fees</span>
            <CheckIcon className="text-primary" />
            <span className="text-sm">Self-host or hosted</span>
          </div>
          <Button size="lg">Get started free</Button>
        </div>
      </section>
    </div>
  ),
};
