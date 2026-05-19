import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRightIcon, BarChart3Icon, CheckIcon, Code2Icon, ShieldCheckIcon } from 'lucide-react';
import { Badge } from '@gallery/ui/badge';
import { Button } from '@gallery/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@gallery/ui/card';
import { Separator } from '@gallery/ui/separator';

const meta = {
  title: 'Pages/Analytics Landing',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="font-mono text-sm font-semibold tracking-tight">trailhead.io</div>
        <nav className="hidden gap-6 text-sm text-muted-foreground sm:flex">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#docs">Docs</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
          <Button size="sm">Start free</Button>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10 text-center">
        <Badge variant="secondary" className="mb-6">
          v2.0 — cookieless by default
        </Badge>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          Analytics that respect your users.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          A privacy-first analytics tool for indie makers. Drop in one script, see real-time traffic,
          ship the next thing. No cookies, no consent banners, no nonsense.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg">
            Start tracking <ArrowRightIcon />
          </Button>
          <Button size="lg" variant="outline">
            See a live demo
          </Button>
        </div>
      </section>

      <Separator />

      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: BarChart3Icon,
              title: 'Real-time dashboards',
              body: 'Watch traffic, sources, and conversions update live — no five-minute refresh delay.',
            },
            {
              icon: ShieldCheckIcon,
              title: 'Privacy by default',
              body: 'No cookies, no fingerprints, no third-party scripts. GDPR and CCPA out of the box.',
            },
            {
              icon: Code2Icon,
              title: 'One-line install',
              body: 'Paste a single <script> tag. No SDK, no build step, no warmup window.',
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

      <section className="bg-muted py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">See your first pageview in 30 seconds.</h2>
          <p className="text-muted-foreground">
            Free for sites under 10k monthly pageviews. No credit card.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5 text-sm">
              <CheckIcon className="size-4 text-primary" /> No credit card
            </span>
            <span className="flex items-center gap-1.5 text-sm">
              <CheckIcon className="size-4 text-primary" /> Cancel anytime
            </span>
            <span className="flex items-center gap-1.5 text-sm">
              <CheckIcon className="size-4 text-primary" /> Self-host or hosted
            </span>
          </div>
          <Button size="lg" className="mt-2">
            Start free <ArrowRightIcon />
          </Button>
        </div>
      </section>
    </div>
  ),
};
