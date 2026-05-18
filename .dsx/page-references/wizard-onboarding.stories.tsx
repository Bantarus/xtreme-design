/**
 * @genre wizard
 * @keywords wizard, onboarding, multi, step, progress, walkthrough, setup, getting-started, install
 * @description Onboarding wizard — three-step progress indicator, current-step form, next/back navigation, skip link.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from 'lucide-react';
import { Button } from '@gallery/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gallery/ui/card';
import { Input } from '@gallery/ui/input';
import { Label } from '@gallery/ui/label';
import { Progress } from '@gallery/ui/progress';
import { RadioGroup, RadioGroupItem } from '@gallery/ui/radio-group';

const meta = {
  title: 'Pages/Wizard — Onboarding',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <span>Step 2 of 3</span>
            <button type="button" className="hover:text-foreground">
              Skip
            </button>
          </div>
          <Progress value={66} className="mt-3" />
          <CardTitle className="mt-4">Tell us about your workspace</CardTitle>
          <CardDescription>
            We'll pre-configure defaults; you can change everything later.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="workspace">Workspace name</Label>
            <Input id="workspace" placeholder="acme-prod" />
          </div>

          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium">How will you mostly use this?</legend>
            <RadioGroup defaultValue="prod">
              {[
                { value: 'prod', label: 'Production workloads' },
                { value: 'staging', label: 'Staging / preview environments' },
                { value: 'dev', label: 'Local development' },
              ].map((row) => (
                <Label
                  key={row.value}
                  htmlFor={row.value}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2 hover:bg-muted"
                >
                  <RadioGroupItem id={row.value} value={row.value} />
                  <span className="text-sm">{row.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </fieldset>

          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon /> Back
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                <CheckIcon className="mr-1 inline size-3 text-primary" /> Saved
              </span>
              <Button>
                Continue <ArrowRightIcon />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};
