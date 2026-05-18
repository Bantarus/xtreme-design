'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Version = { id: string; name: string; paletteHex: string[] };

function PaletteSwatch({ hex }: { hex: string[] }) {
  return (
    <svg
      width="56"
      height="14"
      viewBox="0 0 56 14"
      aria-hidden
      className="rounded-sm overflow-hidden"
    >
      <title>palette</title>
      {hex.slice(0, 5).map((c, i) => (
        <rect key={`${i}-${c}`} x={i * 11.2} y={0} width={11.2} height={14} fill={c} />
      ))}
    </svg>
  );
}

function VersionLabel({ versions, id }: { versions: Version[] | null; id: string }) {
  const v = versions?.find((x) => x.id === id);
  return (
    <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        A/B
      </span>
      <span className="font-mono text-sm text-foreground">{id}</span>
      {v && <PaletteSwatch hex={v.paletteHex} />}
      {v?.name && v.name !== id && (
        <span className="text-xs text-muted-foreground">— {v.name}</span>
      )}
    </div>
  );
}

function CompareInner() {
  const params = useSearchParams();
  const a = params.get('a') ?? 'base';
  const b = params.get('b') ?? 'active';
  const [versions, setVersions] = useState<Version[] | null>(null);

  useEffect(() => {
    fetch('/api/versions')
      .then((r) => r.json())
      .then((d) => setVersions(d))
      .catch(() => setVersions([]));
  }, []);

  const aSrc = a === 'active' ? '/' : `/?v=${encodeURIComponent(a)}`;
  const bSrc = b === 'active' ? '/' : `/?v=${encodeURIComponent(b)}`;

  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex h-full flex-col border-r border-border">
        <VersionLabel versions={versions} id={a} />
        <iframe src={aSrc} title={`A: ${a}`} className="size-full flex-1 border-0 bg-background" />
      </div>
      <div className="flex h-full flex-col">
        <VersionLabel versions={versions} id={b} />
        <iframe src={bSrc} title={`B: ${b}`} className="size-full flex-1 border-0 bg-background" />
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading compare…</div>}>
      <CompareInner />
    </Suspense>
  );
}
