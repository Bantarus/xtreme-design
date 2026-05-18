import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@gallery/ui/button';
import { Input } from '@gallery/ui/input';
import { Label } from '@gallery/ui/label';

const meta = {
  title: 'Smoke/Form',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn: Story = {
  render: () => (
    <form
      className="flex w-[320px] flex-col gap-4 rounded-lg border border-border bg-card p-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="space-y-1.5">
        <h2 className="text-base font-semibold text-foreground">Sign in</h2>
        <p className="text-sm text-muted-foreground">
          Use your work email to continue.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" />
      </div>
      <Button type="submit" className="mt-2 w-full">
        Continue
      </Button>
    </form>
  ),
};
