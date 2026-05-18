'use client';

import * as React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsScene() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">helios · settings</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Account settings</h1>
          <p className="mt-2 max-w-prose text-muted-foreground">Profile, preferences, and security. Changes save when you click Save.</p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="danger">Danger zone</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Public profile</CardTitle>
                <CardDescription>Visible to other workspace members.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="size-16"><AvatarFallback>BT</AvatarFallback></Avatar>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Upload</Button>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="prof-name">Display name</Label>
                    <Input id="prof-name" defaultValue="Bantarus" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="prof-handle">Handle</Label>
                    <Input id="prof-handle" defaultValue="@bantarus" />
                  </div>
                  <div className="grid gap-1.5 sm:col-span-2">
                    <Label htmlFor="prof-bio">Bio</Label>
                    <Textarea id="prof-bio" defaultValue="Solo indie developer. Iterating on design systems." />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="secondary">Cancel</Button>
                <Button>Save</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workspace preferences</CardTitle>
                <CardDescription>Defaults applied across all views.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-1.5 sm:max-w-sm">
                  <Label htmlFor="pref-tz">Timezone</Label>
                  <Select defaultValue="Europe/Paris">
                    <SelectTrigger id="pref-tz" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe / Paris</SelectItem>
                      <SelectItem value="Europe/London">Europe / London</SelectItem>
                      <SelectItem value="America/New_York">America / New York</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia / Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium">Theme</legend>
                  <RadioGroup defaultValue="system" className="flex gap-6">
                    {(['light', 'dark', 'system'] as const).map((t) => (
                      <div key={t} className="flex items-center gap-2">
                        <RadioGroupItem id={`theme-${t}`} value={t} />
                        <Label htmlFor={`theme-${t}`} className="capitalize">{t}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </fieldset>

                <Separator />

                <div className="space-y-4">
                  {[
                    { id: 'pref-email', label: 'Email notifications', sub: 'Weekly summary + critical alerts.', defaultChecked: true },
                    { id: 'pref-push', label: 'Push notifications', sub: 'Browser-level, when this tab is closed.', defaultChecked: false },
                    { id: 'pref-beta', label: 'Beta features', sub: 'Opt into experimental UI.', defaultChecked: false },
                  ].map((row) => (
                    <div key={row.id} className="flex items-start justify-between gap-4">
                      <div>
                        <Label htmlFor={row.id} className="text-sm">{row.label}</Label>
                        <p className="text-xs text-muted-foreground">{row.sub}</p>
                      </div>
                      <Switch id={row.id} defaultChecked={row.defaultChecked} />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="secondary">Cancel</Button>
                <Button>Save</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sign-in</CardTitle>
                <CardDescription>Password and two-factor authentication.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-1.5 sm:max-w-sm">
                  <Label htmlFor="pw-current">Current password</Label>
                  <Input id="pw-current" type="password" />
                </div>
                <div className="grid gap-1.5 sm:max-w-sm">
                  <Label htmlFor="pw-new">New password</Label>
                  <Input id="pw-new" type="password" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Two-factor authentication</p>
                    <p className="text-xs text-muted-foreground">App-based codes via Authenticator.</p>
                  </div>
                  <Badge variant="secondary">enabled</Badge>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button>Update password</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="danger" className="mt-6">
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="text-destructive">Delete account</CardTitle>
                <CardDescription>
                  This permanently removes your data. There is no undo.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="destructive">Delete my account</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
