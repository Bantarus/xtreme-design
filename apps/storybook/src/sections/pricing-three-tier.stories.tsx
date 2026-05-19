import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckIcon } from 'lucide-react';
import { Badge } from '@gallery/ui/badge';
import { Button } from '@gallery/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gallery/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@gallery/ui/tabs';

const meta = {
  title: 'Sections/Pricing Three-Tier',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    blurb: 'For personal sites and side projects.',
    features: ['1 site', '10k pageviews / month', 'Real-time dashboard', 'Community support'],
    cta: 'Start free',
    variant: 'outline' as const,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/ month',
    blurb: 'For indie makers running a few products.',
    features: [
      '10 sites',
      '500k pageviews / month',
      'Custom events & funnels',
      'Email reports',
      'Email support',
    ],
    cta: 'Start 14-day trial',
    variant: 'default' as const,
    highlight: true,
  },
  {
    name: 'Studio',
    price: '$79',
    period: '/ month',
    blurb: 'For small agencies and shared workspaces.',
    features: [
      'Unlimited sites',
      '5M pageviews / month',
      'Team seats & roles',
      'White-label dashboards',
      'Priority support',
    ],
    cta: 'Contact sales',
    variant: 'outline' as const,
  },
];

export const Default: Story = {
  render: () => (
    <section className="mx-auto max-w-5xl px-6 py-16 text-center">
      <h2 className="text-4xl font-semibold tracking-tight">Pricing that grows with your traffic.</h2>
      <p className="mt-3 text-muted-foreground">Start free. Upgrade only when you outgrow it.</p>

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
              <ul className="grid gap-2 text-left text-sm">
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
  ),
};
