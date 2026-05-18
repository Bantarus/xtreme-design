/**
 * @genre settings
 * @keywords profile, account, preferences, security, privacy, danger, zone, configuration, user
 * @description Settings page — sidebar nav, profile form, preferences toggles, security block, danger zone with destructive action.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarFallback } from '@gallery/ui/avatar';
import { Button } from '@gallery/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gallery/ui/card';
import { Input } from '@gallery/ui/input';
import { Label } from '@gallery/ui/label';
import { Separator } from '@gallery/ui/separator';
import { Switch } from '@gallery/ui/switch';
import { Textarea } from '@gallery/ui/textarea';

const meta = {
  title: 'Pages/Settings — Profile',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your profile and preferences.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Public information displayed alongside your work.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarFallback>BR</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Change photo
              </Button>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" defaultValue="Bantarus" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="bantarus@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={3}
                defaultValue="Indie developer, design systems hobbyist."
              />
            </div>
            <div className="flex justify-end">
              <Button>Save changes</Button>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              {
                id: 'email-updates',
                label: 'Product updates',
                desc: 'Quarterly newsletter, no marketing.',
              },
              {
                id: 'weekly-digest',
                label: 'Weekly digest',
                desc: 'Activity summary every Monday.',
              },
              {
                id: 'beta-features',
                label: 'Beta features',
                desc: 'Opt into features still in active development.',
              },
            ].map((row) => (
              <div key={row.id} className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor={row.id} className="text-sm font-medium">
                    {row.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{row.desc}</p>
                </div>
                <Switch id={row.id} defaultChecked={row.id !== 'beta-features'} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Danger zone</CardTitle>
            <CardDescription>Irreversible actions. Be sure before you continue.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-xs text-muted-foreground">
                Removes your data and tokens immediately. Cannot be undone.
              </p>
            </div>
            <Button variant="destructive">Delete account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};
