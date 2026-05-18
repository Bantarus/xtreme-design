'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Version = {
  id: string;
  name: string;
  createdAt: string;
  gitSha: string;
  brief?: string;
  paletteHex: string[];
};

function PaletteSwatch({ hex }: { hex: string[] }) {
  return (
    <svg width="64" height="16" viewBox="0 0 64 16" className="overflow-hidden rounded-sm" aria-hidden>
      <title>palette</title>
      {hex.slice(0, 5).map((c, i) => (
        <rect key={`${i}-${c}`} x={i * 12.8} y={0} width={12.8} height={16} fill={c} />
      ))}
    </svg>
  );
}

export function VersionPicker() {
  const [versions, setVersions] = useState<Version[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const activeId = params.get('v') ?? 'active';

  useEffect(() => {
    let cancelled = false;
    fetch('/api/versions')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: Version[]) => {
        if (!cancelled) setVersions(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function setVersion(id: string | null) {
    const next = new URLSearchParams(params.toString());
    if (id === null || id === 'active') next.delete('v');
    else next.set('v', id);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  if (error) {
    return (
      <div className="border-b border-border bg-muted px-4 py-2 text-xs text-muted-foreground">
        Version picker: {error}
      </div>
    );
  }
  if (!versions || versions.length === 0) {
    return (
      <div className="border-b border-border bg-muted px-4 py-2 text-xs text-muted-foreground">
        Loading versions…
      </div>
    );
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-4 py-2">
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          version
        </span>
        <button
          type="button"
          onClick={() => setVersion(null)}
          className={`flex shrink-0 items-center gap-2 rounded-md border px-2 py-1.5 text-xs transition-colors ${
            activeId === 'active'
              ? 'border-primary bg-background text-foreground'
              : 'border-border bg-background text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="block size-3 rounded-sm bg-foreground" aria-hidden />
          <span className="font-mono">active</span>
        </button>
        {versions.map((v) => {
          const active = activeId === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setVersion(v.id)}
              title={v.brief ?? v.name}
              className={`flex shrink-0 items-center gap-2 rounded-md border px-2 py-1.5 text-xs transition-colors ${
                active
                  ? 'border-primary bg-background text-foreground'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              <PaletteSwatch hex={v.paletteHex} />
              <span className="font-mono">{v.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
