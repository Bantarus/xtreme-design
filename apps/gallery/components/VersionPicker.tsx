'use client';

import { SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
    <svg
      width="64"
      height="16"
      viewBox="0 0 64 16"
      className="overflow-hidden rounded-sm"
      aria-hidden
    >
      <title>palette</title>
      {hex.slice(0, 5).map((c, i) => (
        <rect key={`${i}-${c}`} x={i * 12.8} y={0} width={12.8} height={16} fill={c} />
      ))}
    </svg>
  );
}

type ChipProps = {
  label: string;
  isSelected: boolean;
  isSticky: boolean;
  onClick: () => void;
  onPrefetch?: () => void;
  visual: React.ReactNode;
  title?: string;
};

function Chip({ label, isSelected, isSticky, onClick, onPrefetch, visual, title }: ChipProps) {
  const classes = [
    'flex shrink-0 items-center gap-2 rounded-md border px-2 py-1.5 text-xs transition-colors',
    isSticky && 'sticky left-0 z-10 shadow-[6px_0_8px_-6px_rgba(0,0,0,0.08)]',
    isSelected
      ? 'border-primary bg-card text-foreground'
      : 'border-border bg-card text-muted-foreground hover:text-foreground',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      title={title}
      className={classes}
    >
      {visual}
      <span className="font-mono">{label}</span>
    </button>
  );
}

function prefetchVersionTokens(id: string) {
  if (typeof document === 'undefined') return;
  const href = `/api/versions/${encodeURIComponent(id)}/tokens.css`;
  if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'style';
  link.href = href;
  document.head.appendChild(link);
}

const activeVisual = <span className="block size-3 rounded-sm bg-foreground" aria-hidden />;

export function VersionPicker() {
  const [versions, setVersions] = useState<Version[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const selectedId = params.get('v') ?? 'active';
  const isActiveSelected = selectedId === 'active';

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

  const filtered = useMemo(() => {
    if (!versions) return [];
    const q = query.trim().toLowerCase();
    if (!q) return versions;
    return versions.filter((v) => v.name.toLowerCase().includes(q));
  }, [versions, query]);

  function setVersion(id: string | null) {
    const next = new URLSearchParams(params.toString());
    if (id === null || id === 'active') next.delete('v');
    else next.set('v', id);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  if (error) {
    return (
      <div className="sticky top-0 z-30 border-b border-border bg-muted px-4 py-2 text-xs text-muted-foreground">
        Version picker: {error}
      </div>
    );
  }
  if (!versions || versions.length === 0) {
    return (
      <div className="sticky top-0 z-30 border-b border-border bg-muted px-4 py-2 text-xs text-muted-foreground">
        Loading versions…
      </div>
    );
  }

  const selectedVersion = !isActiveSelected ? versions.find((v) => v.id === selectedId) : null;
  const flowVersions = filtered.filter((v) => v.id !== selectedId);

  return (
    <div className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-4">
        <label className="flex items-center gap-2 border-b border-border/60 py-2">
          <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter versions by name…"
            aria-label="Filter versions by name"
            className="w-full bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query.trim() && (
            <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">
              {filtered.length}/{versions.length}
            </span>
          )}
        </label>
        <div className="flex items-center gap-3 overflow-x-auto py-2">
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            version
          </span>

          {/* Sticky-left: the currently selected chip */}
          {isActiveSelected ? (
            <Chip
              label="active"
              isSelected
              isSticky
              onClick={() => setVersion(null)}
              visual={activeVisual}
            />
          ) : selectedVersion ? (
            <Chip
              label={selectedVersion.name}
              isSelected
              isSticky
              onClick={() => setVersion(selectedVersion.id)}
              onPrefetch={() => prefetchVersionTokens(selectedVersion.id)}
              title={selectedVersion.brief ?? selectedVersion.name}
              visual={<PaletteSwatch hex={selectedVersion.paletteHex} />}
            />
          ) : null}

          {/* Flow: every other chip. "active" goes first when a version is pinned. */}
          {!isActiveSelected && (
            <Chip
              label="active"
              isSelected={false}
              isSticky={false}
              onClick={() => setVersion(null)}
              visual={activeVisual}
            />
          )}
          {flowVersions.map((v) => (
            <Chip
              key={v.id}
              label={v.name}
              isSelected={false}
              isSticky={false}
              onClick={() => setVersion(v.id)}
              onPrefetch={() => prefetchVersionTokens(v.id)}
              title={v.brief ?? v.name}
              visual={<PaletteSwatch hex={v.paletteHex} />}
            />
          ))}

          {query.trim() && filtered.length === 0 && (
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              No versions match “{query.trim()}”.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
