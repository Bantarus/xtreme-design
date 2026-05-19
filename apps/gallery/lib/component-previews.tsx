'use client';

import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  CreditCardIcon,
  HomeIcon,
  InfoIcon,
  MailIcon,
  PencilIcon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
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
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
type ButtonSize = 'xs' | 'sm' | 'default' | 'lg';

const Cell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-3">
    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      {label}
    </div>
    <div className="flex min-h-10 flex-wrap items-center gap-2">{children}</div>
  </div>
);

const Grid: React.FC<{ children: React.ReactNode; cols?: 1 | 2 | 3 | 4 | 6 }> = ({
  children,
  cols = 3,
}) => (
  <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
    {children}
  </div>
);

function ButtonPreview() {
  const variants: ButtonVariant[] = [
    'default',
    'outline',
    'secondary',
    'ghost',
    'destructive',
    'link',
  ];
  const sizes: ButtonSize[] = ['xs', 'sm', 'default', 'lg'];
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          variant × size grid (24 cells)
        </h3>
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  variant\size
                </th>
                {sizes.map((s) => (
                  <th
                    key={s}
                    className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{v}</td>
                  {sizes.map((s) => (
                    <td key={s} className="px-3 py-3">
                      <Button variant={v} size={s}>
                        {v}
                      </Button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Grid cols={3}>
        <Cell label="disabled">
          <Button disabled>Disabled</Button>
          <Button disabled variant="secondary">
            Disabled
          </Button>
        </Cell>
        <Cell label="icon-only">
          <Button size="icon">
            <PencilIcon />
          </Button>
          <Button size="icon-sm" variant="outline">
            <CopyIcon />
          </Button>
          <Button size="icon-xs" variant="ghost">
            <TrashIcon />
          </Button>
        </Cell>
        <Cell label="with leading/trailing">
          <Button>
            <MailIcon data-icon="inline-start" /> Send
          </Button>
          <Button variant="outline">
            Next <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </Cell>
      </Grid>
    </div>
  );
}

function BadgePreview() {
  return (
    <Grid cols={4}>
      <Cell label="default">
        <Badge>Default</Badge>
      </Cell>
      <Cell label="secondary">
        <Badge variant="secondary">Secondary</Badge>
      </Cell>
      <Cell label="destructive">
        <Badge variant="destructive">Destructive</Badge>
      </Cell>
      <Cell label="outline">
        <Badge variant="outline">Outline</Badge>
      </Cell>
    </Grid>
  );
}

function AvatarPreview() {
  return (
    <Grid cols={3}>
      <Cell label="image">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/64?img=12" alt="avatar" />
          <AvatarFallback>BT</AvatarFallback>
        </Avatar>
      </Cell>
      <Cell label="fallback initials">
        <Avatar>
          <AvatarFallback>HX</AvatarFallback>
        </Avatar>
      </Cell>
      <Cell label="stacked">
        <div className="flex -space-x-3">
          {['JD', 'KM', 'LP', 'AB'].map((n) => (
            <Avatar key={n} className="border-2 border-background">
              <AvatarFallback>{n}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </Cell>
    </Grid>
  );
}

function SeparatorPreview() {
  return (
    <Grid cols={2}>
      <Cell label="horizontal">
        <div className="w-full space-y-3">
          <p className="text-sm">First section</p>
          <Separator />
          <p className="text-sm">Second section</p>
        </div>
      </Cell>
      <Cell label="vertical">
        <div className="flex h-12 items-center gap-3">
          <span className="text-sm">Left</span>
          <Separator orientation="vertical" />
          <span className="text-sm">Middle</span>
          <Separator orientation="vertical" />
          <span className="text-sm">Right</span>
        </div>
      </Cell>
    </Grid>
  );
}

function InputPreview() {
  return (
    <Grid cols={2}>
      <Cell label="default">
        <Input placeholder="you@example.com" className="w-full" />
      </Cell>
      <Cell label="disabled">
        <Input placeholder="locked" disabled className="w-full" />
      </Cell>
      <Cell label="invalid">
        <Input placeholder="bad@" aria-invalid className="w-full" />
      </Cell>
      <Cell label="with prefix icon">
        <div className="relative w-full">
          <MailIcon className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
          <Input placeholder="email" className="w-full pl-8" />
        </div>
      </Cell>
    </Grid>
  );
}

function TextareaPreview() {
  return (
    <Grid cols={2}>
      <Cell label="default">
        <Textarea placeholder="Write a note…" className="w-full" />
      </Cell>
      <Cell label="disabled">
        <Textarea placeholder="locked" disabled className="w-full" />
      </Cell>
      <Cell label="invalid">
        <Textarea placeholder="bad" aria-invalid className="w-full" />
      </Cell>
      <Cell label="prefilled">
        <Textarea defaultValue={'Two\nLines'} className="w-full" />
      </Cell>
    </Grid>
  );
}

function LabelPreview() {
  return (
    <Grid cols={2}>
      <Cell label="paired with input">
        <div className="w-full space-y-1.5">
          <Label htmlFor="lbl-email">Email</Label>
          <Input id="lbl-email" placeholder="you@example.com" className="w-full" />
        </div>
      </Cell>
      <Cell label="paired with checkbox">
        <div className="flex items-center gap-2">
          <Checkbox id="lbl-cb" />
          <Label htmlFor="lbl-cb">Remember me</Label>
        </div>
      </Cell>
    </Grid>
  );
}

function SelectPreview() {
  return (
    <Grid cols={2}>
      <Cell label="default">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pick a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Citrus</SelectLabel>
              <SelectItem value="lemon">Lemon</SelectItem>
              <SelectItem value="lime">Lime</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Berries</SelectLabel>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="raspberry">Raspberry</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Cell>
      <Cell label="disabled">
        <Select disabled>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="locked" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="x">x</SelectItem>
          </SelectContent>
        </Select>
      </Cell>
    </Grid>
  );
}

function CheckboxPreview() {
  return (
    <Grid cols={3}>
      <Cell label="unchecked">
        <Checkbox />
      </Cell>
      <Cell label="checked">
        <Checkbox defaultChecked />
      </Cell>
      <Cell label="disabled">
        <Checkbox disabled />
      </Cell>
      <Cell label="disabled + checked">
        <Checkbox disabled defaultChecked />
      </Cell>
    </Grid>
  );
}

function RadioGroupPreview() {
  return (
    <Grid cols={2}>
      <Cell label="default">
        <RadioGroup defaultValue="a" className="flex flex-col gap-2">
          {['a', 'b', 'c'].map((v) => (
            <div key={v} className="flex items-center gap-2">
              <RadioGroupItem id={`rg-${v}`} value={v} />
              <Label htmlFor={`rg-${v}`}>Option {v.toUpperCase()}</Label>
            </div>
          ))}
        </RadioGroup>
      </Cell>
      <Cell label="disabled">
        <RadioGroup defaultValue="a" disabled className="flex flex-col gap-2">
          {['a', 'b'].map((v) => (
            <div key={v} className="flex items-center gap-2">
              <RadioGroupItem id={`rgd-${v}`} value={v} />
              <Label htmlFor={`rgd-${v}`}>Option {v.toUpperCase()}</Label>
            </div>
          ))}
        </RadioGroup>
      </Cell>
    </Grid>
  );
}

function SwitchPreview() {
  return (
    <Grid cols={4}>
      <Cell label="off">
        <Switch />
      </Cell>
      <Cell label="on">
        <Switch defaultChecked />
      </Cell>
      <Cell label="disabled">
        <Switch disabled />
      </Cell>
      <Cell label="disabled + on">
        <Switch disabled defaultChecked />
      </Cell>
    </Grid>
  );
}

function SliderPreview() {
  return (
    <Grid cols={2}>
      <Cell label="single">
        <Slider defaultValue={[42]} className="w-full" />
      </Cell>
      <Cell label="range">
        <Slider defaultValue={[20, 70]} className="w-full" />
      </Cell>
      <Cell label="disabled">
        <Slider defaultValue={[42]} disabled className="w-full" />
      </Cell>
      <Cell label="stepped">
        <Slider defaultValue={[60]} step={10} className="w-full" />
      </Cell>
    </Grid>
  );
}

function TabsPreview() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent
        value="overview"
        className="mt-4 rounded-md border border-border p-4 text-sm text-muted-foreground"
      >
        Aggregate view of the workspace.
      </TabsContent>
      <TabsContent
        value="activity"
        className="mt-4 rounded-md border border-border p-4 text-sm text-muted-foreground"
      >
        Recent events for this workspace.
      </TabsContent>
      <TabsContent
        value="settings"
        className="mt-4 rounded-md border border-border p-4 text-sm text-muted-foreground"
      >
        Per-workspace preferences.
      </TabsContent>
    </Tabs>
  );
}

function BreadcrumbPreview() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function PaginationPreview() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">9</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function CommandPreview() {
  return (
    <Command className="rounded-lg border border-border">
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem>
            <HomeIcon /> Home
          </CommandItem>
          <CommandItem>
            <SettingsIcon /> Settings
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>
            <PencilIcon /> Edit profile
          </CommandItem>
          <CommandItem>
            <TrashIcon /> Delete account
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function DialogPreview() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm save</DialogTitle>
          <DialogDescription>
            Persist the current draft? You can revert from version history.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>Cancel</DialogClose>
          <DialogClose render={<Button />}>Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AlertDialogPreview() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>Delete</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete the workspace?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the workspace and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel render={<Button variant="secondary" />}>Cancel</AlertDialogCancel>
          <AlertDialogAction render={<Button variant="destructive" />}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SheetPreview() {
  return (
    <div className="flex gap-2">
      {(['right', 'left', 'top', 'bottom'] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline" />}>{side}</SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>{side} sheet</SheetTitle>
              <SheetDescription>
                Side-attached panel — useful for filters, drawers, and details.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose render={<Button />}>Done</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}

function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Open popover</PopoverTrigger>
      <PopoverContent>
        <p className="text-sm font-medium text-foreground">Quick edit</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Non-modal anchored surface. Closes on outside click or Escape.
        </p>
      </PopoverContent>
    </Popover>
  );
}

function DropdownMenuPreview() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Open menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ContextMenuPreview() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
        Right-click this area
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>File</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function TooltipPreview() {
  return (
    <div className="flex gap-3">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon" />}>
          <InfoIcon />
        </TooltipTrigger>
        <TooltipContent>Helpful context for icon-only triggers.</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
        <TooltipContent>Tooltips use --color-popover.</TooltipContent>
      </Tooltip>
    </div>
  );
}

function HoverCardPreview() {
  return (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="link" />}>@bantarus</HoverCardTrigger>
      <HoverCardContent>
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>BT</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">Bantarus</p>
            <p className="text-xs text-muted-foreground">Solo indie developer · joined 2024</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function AlertPreview() {
  return (
    <Grid cols={1}>
      <Cell label="default">
        <Alert>
          <InfoIcon />
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>
            Tokens regenerate automatically when you edit DESIGN.md.
          </AlertDescription>
        </Alert>
      </Cell>
      <Cell label="destructive">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Could not save</AlertTitle>
          <AlertDescription>Something went wrong. Please try again.</AlertDescription>
        </Alert>
      </Cell>
    </Grid>
  );
}

function ProgressPreview() {
  return (
    <Grid cols={1}>
      <Cell label="0%">
        <Progress value={0} className="w-full" />
      </Cell>
      <Cell label="33%">
        <Progress value={33} className="w-full" />
      </Cell>
      <Cell label="66%">
        <Progress value={66} className="w-full" />
      </Cell>
      <Cell label="100%">
        <Progress value={100} className="w-full" />
      </Cell>
    </Grid>
  );
}

function SkeletonPreview() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-3 pt-2">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

function SonnerPreview() {
  return (
    <div className="flex gap-3">
      <Button onClick={() => toast('Saved')}>Plain toast</Button>
      <Button variant="outline" onClick={() => toast.success('Pipeline complete')}>
        Success
      </Button>
      <Button variant="destructive" onClick={() => toast.error('Lint failed')}>
        Error
      </Button>
    </div>
  );
}

function CardPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage profile, billing, and security.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="card-name">Name</Label>
            <Input id="card-name" defaultValue="Bantarus" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="card-email">Email</Label>
            <Input id="card-email" defaultValue="hi@dsx.dev" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  );
}

function TablePreview() {
  const rows = [
    { id: 1, customer: 'Acme Corp', plan: 'Pro', mrr: '$1,200', status: 'active' },
    { id: 2, customer: 'Globex', plan: 'Starter', mrr: '$90', status: 'trial' },
    { id: 3, customer: 'Hooli', plan: 'Pro', mrr: '$1,200', status: 'active' },
    { id: 4, customer: 'Initech', plan: 'Enterprise', mrr: '$5,400', status: 'churned' },
  ];
  return (
    <Table>
      <TableCaption>Recent billing activity.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>MRR</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.customer}</TableCell>
            <TableCell>{r.plan}</TableCell>
            <TableCell>{r.mrr}</TableCell>
            <TableCell>
              <Badge
                variant={
                  r.status === 'active'
                    ? 'default'
                    : r.status === 'churned'
                      ? 'destructive'
                      : 'secondary'
                }
              >
                {r.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AccordionPreview() {
  return (
    <Accordion defaultValue={['a1']} className="w-full">
      <AccordionItem value="a1">
        <AccordionTrigger>What is dsx?</AccordionTrigger>
        <AccordionContent>
          An iteration template for design systems where the agent's only editable surface is
          DESIGN.md.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="a2">
        <AccordionTrigger>How is the gallery rendered?</AccordionTrigger>
        <AccordionContent>
          Deterministically from DESIGN.md via `scripts/pipeline.mjs`. No per-component prompting
          happens here.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="a3">
        <AccordionTrigger>Can I add my own components?</AccordionTrigger>
        <AccordionContent>
          Yes — manually. Add the file, add an entry to components-manifest, add a preview. The
          agent does not touch any of this.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function CalendarPreview() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border border-border"
    />
  );
}

function ScrollAreaPreview() {
  return (
    <ScrollArea className="h-40 w-full rounded-md border border-border p-4">
      <div className="space-y-2 pr-4">
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="text-sm text-foreground">
            Row {i + 1} — long enough to overflow the scroll area on purpose.
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function AspectRatioPreview() {
  return (
    <Grid cols={2}>
      <Cell label="16/9">
        <AspectRatio ratio={16 / 9} className="w-full overflow-hidden rounded-md bg-muted">
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            16 : 9
          </div>
        </AspectRatio>
      </Cell>
      <Cell label="1/1">
        <AspectRatio ratio={1} className="w-full overflow-hidden rounded-md bg-muted">
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            1 : 1
          </div>
        </AspectRatio>
      </Cell>
    </Grid>
  );
}

// IMPORTANT: this is a `'use client'` module. Server Components in Next.js 15
// can import React components from a client module (they get wrapped as client
// references), but they CANNOT meaningfully read named non-component exports
// — those don't cross the RSC boundary. Therefore the slug → preview lookup
// must live INSIDE this module, exposed as the `PreviewBySlug` component
// below. The `previews` record is exported for tests / debugging but should
// not be indexed from a Server Component.
export const previews: Record<string, React.FC> = {
  button: ButtonPreview,
  badge: BadgePreview,
  avatar: AvatarPreview,
  separator: SeparatorPreview,
  input: InputPreview,
  textarea: TextareaPreview,
  label: LabelPreview,
  select: SelectPreview,
  checkbox: CheckboxPreview,
  'radio-group': RadioGroupPreview,
  switch: SwitchPreview,
  slider: SliderPreview,
  tabs: TabsPreview,
  breadcrumb: BreadcrumbPreview,
  pagination: PaginationPreview,
  command: CommandPreview,
  dialog: DialogPreview,
  'alert-dialog': AlertDialogPreview,
  sheet: SheetPreview,
  popover: PopoverPreview,
  'dropdown-menu': DropdownMenuPreview,
  'context-menu': ContextMenuPreview,
  tooltip: TooltipPreview,
  'hover-card': HoverCardPreview,
  alert: AlertPreview,
  progress: ProgressPreview,
  skeleton: SkeletonPreview,
  sonner: SonnerPreview,
  card: CardPreview,
  table: TablePreview,
  accordion: AccordionPreview,
  calendar: CalendarPreview,
  'scroll-area': ScrollAreaPreview,
  'aspect-ratio': AspectRatioPreview,
};

// Client wrapper consumed by the Server Component route at
// apps/gallery/app/components/[slug]/page.tsx. Receives the slug as a plain
// prop, performs the lookup here (where the previews record is fully
// accessible during SSR + hydration), renders the matching preview or a
// helpful fallback.
export function PreviewBySlug({ slug }: { slug: string }) {
  const Preview = previews[slug];
  if (!Preview) {
    return (
      <p className="rounded-md border border-dashed border-border bg-muted p-6 text-sm text-muted-foreground">
        No preview registered for "{slug}". Add one in
        <code className="ml-1 font-mono">apps/gallery/lib/component-previews.tsx</code>.
      </p>
    );
  }
  return <Preview />;
}
