/**
 * @genre auth
 * @keywords auth, signin, login, signup, register, oauth, sso, password, email, magic, link, identity
 * @description Sign-in screen — split layout, OAuth providers, email-and-password form, footer with sign-up link.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GithubIcon } from 'lucide-react';
import { Button } from '@gallery/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gallery/ui/card';
import { Input } from '@gallery/ui/input';
import { Label } from '@gallery/ui/label';
import { Separator } from '@gallery/ui/separator';

const meta = {
  title: 'Pages/Auth — Sign in',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid min-h-screen bg-background text-foreground md:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-muted p-12 md:flex">
        <div className="font-mono text-sm font-semibold">acme.dev</div>
        <blockquote className="max-w-md text-2xl tracking-tight">
          "Set up in under a minute. Three weeks later I'm still here, still happy."
          <footer className="mt-4 text-sm font-normal text-muted-foreground">
            — Lea V., indie developer
          </footer>
        </blockquote>
        <div className="text-xs text-muted-foreground">© Acme, 2026</div>
      </aside>

      <main className="flex items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your acme.dev account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button variant="outline" className="w-full">
                <GithubIcon /> Continue with GitHub
              </Button>
              <Button variant="outline" className="w-full">
                Continue with Google
              </Button>
            </div>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>

            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="grid gap-2">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="h-auto p-0 text-xs">
                    Forgot?
                  </Button>
                </div>
                <Input id="password" type="password" />
              </div>
              <Button type="submit" className="mt-2 w-full">
                Sign in
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              New here?{' '}
              <a className="text-primary underline-offset-4 hover:underline" href="#signup">
                Create an account
              </a>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  ),
};
