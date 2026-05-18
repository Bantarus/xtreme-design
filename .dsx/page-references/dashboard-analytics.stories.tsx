/**
 * @genre dashboard
 * @keywords analytics, chart, metrics, report, business, growth, conversion, funnel, data, insights, executive
 * @description Analytics dashboard — date-range picker, four-metric strip, large chart placeholder, segmented tabs for breakdowns.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarIcon, DownloadIcon } from 'lucide-react';
import { Badge } from '@gallery/ui/badge';
import { Button } from '@gallery/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@gallery/ui/card';
import { Separator } from '@gallery/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gallery/ui/tabs';

const meta = {
  title: 'Pages/Dashboard — Analytics',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold tracking-tight">Growth</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CalendarIcon /> Last 30 days
            </Button>
            <Button variant="outline" size="sm">
              <DownloadIcon /> Export
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <section className="grid gap-4 sm:grid-cols-4">
          {[
            { label: 'MRR', value: '$48,210', delta: '+12.4%', positive: true },
            { label: 'New customers', value: '184', delta: '+8 vs prior', positive: true },
            { label: 'Activation rate', value: '62%', delta: '+3 pts', positive: true },
            { label: 'Churn', value: '2.8%', delta: '+0.2 pts', positive: false },
          ].map((m) => (
            <Card key={m.label}>
              <CardHeader>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {m.label}
                </p>
                <CardTitle className="text-3xl">{m.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={m.positive ? 'secondary' : 'outline'}>{m.delta}</Badge>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Revenue, 30-day trailing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-end justify-between gap-1 rounded-md bg-muted px-4 py-4">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-primary/70"
                  style={{ height: `${30 + Math.abs(Math.sin(i / 3)) * 60}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <Tabs defaultValue="channel">
          <TabsList>
            <TabsTrigger value="channel">By channel</TabsTrigger>
            <TabsTrigger value="region">By region</TabsTrigger>
            <TabsTrigger value="plan">By plan</TabsTrigger>
          </TabsList>
          <TabsContent value="channel" className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Organic', value: '52%' },
              { label: 'Paid search', value: '23%' },
              { label: 'Referral', value: '15%' },
              { label: 'Direct', value: '10%' },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-md border border-border px-4 py-3"
              >
                <span className="text-sm">{row.label}</span>
                <span className="font-mono text-sm">{row.value}</span>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="region" className="mt-4 text-sm text-muted-foreground">
            Aggregated by customer billing region.
          </TabsContent>
          <TabsContent value="plan" className="mt-4 text-sm text-muted-foreground">
            Aggregated by subscription tier.
          </TabsContent>
        </Tabs>
      </main>
    </div>
  ),
};
