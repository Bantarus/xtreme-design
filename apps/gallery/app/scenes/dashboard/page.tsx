'use client';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BellIcon,
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const kpis = [
  { label: 'MRR', value: '$48,210', delta: '+12.3%', direction: 'up' as const },
  { label: 'Active customers', value: '1,284', delta: '+4.1%', direction: 'up' as const },
  { label: 'Churn', value: '1.8%', delta: '-0.4pp', direction: 'down' as const },
  { label: 'Trial → paid', value: '38%', delta: '+2.0pp', direction: 'up' as const },
];

const events = [
  { id: 1, customer: 'Acme Corp', event: 'Upgraded to Pro', amount: '+$1,200', time: '2m ago' },
  { id: 2, customer: 'Globex', event: 'Trial extended', amount: '—', time: '17m ago' },
  { id: 3, customer: 'Hooli', event: 'Renewed annual', amount: '+$14,400', time: '1h ago' },
  { id: 4, customer: 'Initech', event: 'Churned', amount: '−$5,400', time: '3h ago' },
  { id: 5, customer: 'Vandelay Industries', event: 'New trial', amount: '—', time: '4h ago' },
];

export default function DashboardScene() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-md bg-primary" aria-hidden />
            <span className="font-semibold tracking-tight">helios.dashboard</span>
            <nav className="ml-6 hidden gap-4 text-sm sm:flex">
              <a className="text-foreground" href="#">Overview</a>
              <a className="text-muted-foreground hover:text-foreground" href="#">Customers</a>
              <a className="text-muted-foreground hover:text-foreground" href="#">Billing</a>
              <a className="text-muted-foreground hover:text-foreground" href="#">Insights</a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
              <Input placeholder="Search…" className="w-56 pl-8" />
            </div>
            <Button size="icon" variant="ghost"><BellIcon /></Button>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button size="sm" variant="ghost" />}>
                <Avatar className="mr-2 size-6"><AvatarFallback>BT</AvatarFallback></Avatar>
                Bantarus <ChevronDownIcon data-icon="inline-end" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
            <p className="mt-1 text-sm text-muted-foreground">Snapshot of revenue, customers, and activity for May.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Export</Button>
            <Button size="sm"><PlusIcon data-icon="inline-start" /> New customer</Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((k) => {
            const positive = k.direction === 'up';
            return (
              <Card key={k.label}>
                <CardHeader className="pb-2">
                  <CardDescription className="font-mono text-xs uppercase tracking-widest">{k.label}</CardDescription>
                  <CardTitle className="text-3xl">{k.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className={`inline-flex items-center gap-1 text-xs ${positive ? 'text-success' : 'text-destructive'}`}>
                    {positive ? <ArrowUpIcon className="size-3" /> : <ArrowDownIcon className="size-3" />}
                    {k.delta}
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">vs last month</span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Separator className="my-8" />

        <Tabs defaultValue="recent" className="w-full">
          <TabsList>
            <TabsTrigger value="recent">Recent activity</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <CardDescription>Last 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>When</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">{e.customer}</TableCell>
                        <TableCell>{e.event}</TableCell>
                        <TableCell className="font-mono">{e.amount}</TableCell>
                        <TableCell className="text-muted-foreground">{e.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="goals">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Quarter goals</CardTitle>
                <CardDescription>Q2 targets and progress.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { goal: 'MRR ≥ $60k', value: 80, badge: 'On track' as const },
                  { goal: 'Churn ≤ 1.5%', value: 55, badge: 'At risk' as const },
                  { goal: 'NPS ≥ 50', value: 92, badge: 'Ahead' as const },
                ].map((g) => (
                  <div key={g.goal} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span>{g.goal}</span>
                      <Badge variant={g.badge === 'At risk' ? 'destructive' : g.badge === 'Ahead' ? 'default' : 'secondary'}>
                        {g.badge}
                      </Badge>
                    </div>
                    <Progress value={g.value} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Generated weekly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>2026-05-15 — Revenue summary (May, week 3)</p>
                <p>2026-05-08 — Revenue summary (May, week 2)</p>
                <p>2026-05-01 — Revenue summary (May, week 1)</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
