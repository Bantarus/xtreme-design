import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@gallery/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gallery/ui/card';

const meta = {
  title: 'Smoke/Card',
  component: Card,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Quarterly review</CardTitle>
        <CardDescription>Operations summary for Q2 2026.</CardDescription>
        <CardAction>
          <Button size="sm" variant="ghost">
            Export
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Throughput steady at 12.4k requests/min. Error rate down 18% from last quarter. Two
          regressions still open for review.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Dismiss</Button>
        <Button>Open report</Button>
      </CardFooter>
    </Card>
  ),
};
