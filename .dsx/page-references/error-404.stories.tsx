/**
 * @genre error
 * @keywords error, 404, not-found, missing, broken, link, oops, page, fallback
 * @description 404 not-found page — large status code, friendly recovery copy, link back home + search box.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowLeftIcon, SearchIcon } from 'lucide-react';
import { Button } from '@gallery/ui/button';
import { Input } from '@gallery/ui/input';

const meta = {
  title: 'Pages/Error — 404',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 text-center">
        <p className="font-mono text-7xl font-semibold tracking-tight text-primary">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">This page wandered off.</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The link you followed may be broken, or the page may have moved. Try the homepage, or
          search the docs.
        </p>
        <form
          className="mt-2 flex w-full max-w-sm items-center gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input placeholder="Search the docs…" />
          <Button type="submit" size="icon" aria-label="Search">
            <SearchIcon />
          </Button>
        </form>
        <Button variant="outline" className="mt-2">
          <ArrowLeftIcon /> Back to home
        </Button>
      </div>
    </div>
  ),
};
