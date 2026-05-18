/**
 * @genre empty
 * @keywords empty, state, zero, no, data, blank, first, time, onboarding, ghost, placeholder
 * @description Empty state — centered illustration block, headline, supporting copy, single primary CTA + secondary link.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FolderPlusIcon } from 'lucide-react';
import { Button } from '@gallery/ui/button';

const meta = {
  title: 'Pages/Empty State',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 text-center">
        <div className="grid size-16 place-items-center rounded-2xl border border-dashed border-border bg-muted">
          <FolderPlusIcon className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">No projects yet</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Projects group your databases, jobs, and secrets. Create one to get started — you can
          rename, archive, or transfer it later.
        </p>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <Button>Create your first project</Button>
          <Button variant="outline">Import from CSV</Button>
        </div>
        <a
          className="mt-2 text-xs text-muted-foreground underline-offset-4 hover:underline"
          href="#docs"
        >
          Read the projects guide →
        </a>
      </div>
    </div>
  ),
};
