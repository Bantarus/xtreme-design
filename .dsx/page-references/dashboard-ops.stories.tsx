/**
 * @genre dashboard
 * @keywords ops, operations, kpi, monitoring, status, sre, devops, infrastructure, observability, internal, tool
 * @description Ops dashboard — sidebar nav, KPI strip, status table with row actions, recent activity timeline.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ActivityIcon,
  AlertCircleIcon,
  BellIcon,
  CheckCircleIcon,
  CircleIcon,
  HomeIcon,
  ServerIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';
import { Badge } from '@gallery/ui/badge';
import { Button } from '@gallery/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@gallery/ui/card';
import { Separator } from '@gallery/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@gallery/ui/table';

const meta = {
  title: 'Pages/Dashboard — Ops',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const nav = [
  { icon: HomeIcon, label: 'Overview', active: true },
  { icon: ServerIcon, label: 'Services' },
  { icon: UsersIcon, label: 'Customers' },
  { icon: ActivityIcon, label: 'Activity' },
  { icon: SettingsIcon, label: 'Settings' },
];

const services = [
  { name: 'api-gateway', region: 'us-east-1', status: 'healthy', latency: '42 ms' },
  { name: 'auth', region: 'us-east-1', status: 'healthy', latency: '18 ms' },
  { name: 'ingest-worker', region: 'us-west-2', status: 'degraded', latency: '410 ms' },
  { name: 'billing', region: 'eu-central-1', status: 'healthy', latency: '57 ms' },
  { name: 'webhooks', region: 'us-east-1', status: 'down', latency: '—' },
];

export const Default: Story = {
  render: () => (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <div className="px-6 py-5 font-mono text-sm font-semibold">ops.acme</div>
        <Separator />
        <nav className="flex flex-1 flex-col gap-1 p-3 text-sm">
          {nav.map((n) => (
            <button
              key={n.label}
              type="button"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-left transition-colors ${n.active ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <n.icon className="size-4" />
              {n.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-6 py-6">
        <header className="mb-6 flex items-baseline justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
            <p className="text-sm text-muted-foreground">Real-time status across all regions.</p>
          </div>
          <Button variant="outline" size="sm">
            <BellIcon /> Subscribe to alerts
          </Button>
        </header>

        <section className="grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Requests / min', value: '12.4k', delta: '+2.1%' },
            { label: 'P95 latency', value: '88 ms', delta: '-4 ms' },
            { label: 'Error rate', value: '0.21%', delta: '+0.03%' },
            { label: 'Active incidents', value: '1', delta: 'webhooks' },
          ].map((k) => (
            <Card key={k.label}>
              <CardHeader>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {k.label}
                </p>
                <CardTitle className="text-3xl">{k.value}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">{k.delta}</CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Services</h2>
            <Button variant="ghost" size="sm">
              View all →
            </Button>
          </header>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">P95</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((s) => (
                <TableRow key={s.name}>
                  <TableCell className="font-mono text-xs">{s.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.region}</TableCell>
                  <TableCell>
                    {s.status === 'healthy' && (
                      <Badge variant="outline" className="gap-1">
                        <CheckCircleIcon className="size-3 text-primary" /> healthy
                      </Badge>
                    )}
                    {s.status === 'degraded' && (
                      <Badge variant="outline" className="gap-1">
                        <CircleIcon className="size-3 text-warning" /> degraded
                      </Badge>
                    )}
                    {s.status === 'down' && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircleIcon className="size-3" /> down
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">{s.latency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </main>
    </div>
  ),
};
