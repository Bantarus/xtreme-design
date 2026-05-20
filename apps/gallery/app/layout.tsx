import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ActiveStylesheet } from '@/components/ActiveStylesheet';
import { VersionPicker } from '@/components/VersionPicker';
import { WebfontLoader } from '@/components/WebfontLoader';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'dsx — Helios gallery',
  description: 'The deterministic canvas. Rendered from DESIGN.md by scripts/pipeline.mjs.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Suspense fallback={null}>
          <ActiveStylesheet />
        </Suspense>
        <WebfontLoader />
        <Suspense fallback={null}>
          <VersionPicker />
        </Suspense>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
