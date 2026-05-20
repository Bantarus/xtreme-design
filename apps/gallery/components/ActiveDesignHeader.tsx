'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Meta = {
  name: string | null;
  description: string | null;
  version: string;
};

export function ActiveDesignHeader({
  initial,
}: {
  initial: { name: string | null; description: string | null };
}) {
  const params = useSearchParams();
  const v = params.get('v');
  const pinned = v && v !== 'active' ? v : null;
  const [meta, setMeta] = useState<Meta>({
    name: initial.name,
    description: initial.description,
    version: pinned ?? 'active',
  });

  useEffect(() => {
    let cancelled = false;
    const q = pinned ? `?v=${encodeURIComponent(pinned)}` : '';
    fetch(`/api/active${q}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: Meta) => {
        if (!cancelled) setMeta(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pinned]);

  return (
    <header className="sticky top-20 z-20 -mx-6 border-b border-border bg-background px-6 pb-6 pt-10 sm:-mx-8 sm:px-8 sm:pt-14">
      <p className="type-label-sm uppercase text-muted-foreground">
        <span>{meta.version}</span>
        <span aria-hidden> · </span>
        <span>gallery</span>
      </p>
      <h1 className="mt-1 type-display text-foreground">
        {meta.name ?? 'Active design system'}
      </h1>
      {meta.description ? (
        <p className="mt-2 max-w-prose type-body-lg text-muted-foreground">{meta.description}</p>
      ) : (
        <p className="mt-2 max-w-prose type-body-lg text-muted-foreground">
          The gallery is rendered deterministically from{' '}
          <code className="type-mono-sm">DESIGN.md</code>. Pick a component below to inspect it in
          the active palette. Page composition lives in Storybook.
        </p>
      )}
    </header>
  );
}
