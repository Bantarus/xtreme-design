/**
 * @genre landing
 * @keywords product, consumer, ecommerce, retail, lifestyle, photography, visual, brand, shop, store
 * @description Product-led landing for a consumer brand — large hero image area, three-product showcase, editorial section, newsletter signup.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRightIcon } from 'lucide-react';
import { AspectRatio } from '@gallery/ui/aspect-ratio';
import { Badge } from '@gallery/ui/badge';
import { Button } from '@gallery/ui/button';
import { Input } from '@gallery/ui/input';
import { Separator } from '@gallery/ui/separator';

const meta = {
  title: 'Pages/Landing — Product',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="font-mono text-sm font-semibold tracking-widest uppercase">Maison</div>
        <nav className="hidden gap-6 text-sm sm:flex">
          <a href="#shop">Shop</a>
          <a href="#about">About</a>
          <a href="#journal">Journal</a>
        </nav>
        <Button size="sm" variant="outline">
          Cart (0)
        </Button>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <AspectRatio ratio={21 / 9} className="overflow-hidden rounded-lg bg-muted">
          <div className="flex h-full flex-col items-start justify-end gap-3 p-10">
            <Badge>New this season</Badge>
            <h1 className="max-w-md text-5xl font-semibold tracking-tight">
              Made slowly, worn often.
            </h1>
            <p className="max-w-md text-muted-foreground">
              Three new pieces, cut from rain-fed linen in a workshop outside Porto.
            </p>
            <Button size="lg" className="mt-2">
              Shop the collection <ArrowRightIcon />
            </Button>
          </div>
        </AspectRatio>
      </section>

      <section id="shop" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Featured
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { name: 'Field Shirt', price: '€140', tag: 'Linen' },
            { name: 'Workshop Pant', price: '€180', tag: 'Cotton twill' },
            { name: 'Studio Apron', price: '€95', tag: 'Heavy canvas' },
          ].map((p) => (
            <div key={p.name} className="group">
              <AspectRatio ratio={4 / 5} className="overflow-hidden rounded-md bg-muted" />
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <div className="text-base font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.tag}</div>
                </div>
                <div className="text-sm font-medium">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section id="journal" className="mx-auto grid max-w-5xl gap-12 px-6 py-20 md:grid-cols-2">
        <AspectRatio ratio={4 / 5} className="overflow-hidden rounded-md bg-muted" />
        <div className="flex flex-col justify-center gap-4">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            From the journal
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">Why we still cut on a table.</h2>
          <p className="text-muted-foreground">
            A short essay on what we keep, what we let go, and the seventy-year-old shears we
            inherited from the previous tenant of our workshop.
          </p>
          <Button variant="link" className="self-start p-0">
            Read the essay →
          </Button>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 text-center">
          <h3 className="text-xl font-semibold">Stay close.</h3>
          <p className="text-sm text-muted-foreground">
            One letter a season. No discounts, no urgency.
          </p>
          <div className="mt-2 flex w-full gap-2">
            <Input placeholder="you@example.com" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  ),
};
