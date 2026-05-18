/**
 * @genre pricing
 * @keywords pricing, plans, tiers, subscription, billing, free, pro, enterprise, monthly, annual, compare
 * @description Pricing page — three-tier card grid with feature lists, recommended-plan highlight, monthly/annual toggle, FAQ accordion.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@gallery/ui/accordion';
import { Badge } from '@gallery/ui/badge';
import { Button } from '@gallery/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gallery/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@gallery/ui/tabs';

const meta = {
  title: 'Pages/Pricing — Tiered',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const plans = [
  {
    name: 'Hobby',
    price: '$0',
    period: 'forever',
    blurb: 'For side projects and exploration.',
    features: ['1 project', '10k requests / day', 'Community support'],
    cta: 'Start free',
    variant: 'outline' as const,
  },
  {
    name: 'Pro',
    price: '$24',
    period: '/ month',
    blurb: 'For indie teams shipping in production.',
    features: ['10 projects', '1M requests / day', 'Email support', 'Branch databases'],
    cta: 'Start 14-day trial',
    variant: 'default' as const,
    highlight: true,
  },
  {
    name: 'Team',
    price: '$120',
    period: '/ month',
    blurb: 'For teams of 3–20 with shared environments.',
    features: ['Unlimited projects', '10M requests / day', 'SSO + audit log', 'SLA-backed support'],
    cta: 'Contact sales',
    variant: 'outline' as const,
  },
];

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Pricing that grows with you.
        </h1>
        <p className="mt-3 text-muted-foreground">Start free. Upgrade only when you need more.</p>
        <div className="mt-6 inline-block">
          <Tabs defaultValue="monthly">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="annual">Annual (−20%)</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.name} className={p.highlight ? 'border-primary shadow-md' : ''}>
              <CardHeader>
                <div className="flex items-baseline justify-between">
                  <CardTitle>{p.name}</CardTitle>
                  {p.highlight && <Badge>Recommended</Badge>}
                </div>
                <CardDescription>{p.blurb}</CardDescription>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckIcon className="mt-0.5 size-4 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={p.variant} className="mt-6 w-full">
                  {p.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">Frequently asked</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>Can I change plans anytime?</AccordionTrigger>
            <AccordionContent>
              Yes — upgrades take effect immediately; downgrades take effect at the next billing
              cycle. No prorating headaches.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>What happens if I exceed my plan limits?</AccordionTrigger>
            <AccordionContent>
              You stay served — we never throttle without warning. You'll get an email when you hit
              80%, and we'll suggest the next tier if you sustain it.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>Do you offer non-profit or student pricing?</AccordionTrigger>
            <AccordionContent>
              Yes — contact us with a .edu or 501(c)(3) reference; we'll set up Pro at no cost.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  ),
};
