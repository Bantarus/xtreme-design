'use client';

import { DsxLink } from '@/components/DsxLink';
import { useEffect, useState } from 'react';

type TokenRow = { name: string; value: string };

const PREFIXES = ['--color-', '--spacing-', '--radius-', '--font-'] as const;

function isColorVar(name: string): boolean {
  return name.startsWith('--color-');
}

export default function TokensPage() {
  const [rows, setRows] = useState<Record<string, TokenRow[]>>({});
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const sheets = Array.from(document.styleSheets);
    const seen = new Set<string>();
    const grouped: Record<string, TokenRow[]> = {
      '--color-': [],
      '--spacing-': [],
      '--radius-': [],
      '--font-': [],
    };

    for (const sheet of sheets) {
      let rules: CSSRuleList | undefined;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      if (!rules) continue;
      for (const rule of Array.from(rules)) {
        if (!(rule instanceof CSSStyleRule)) continue;
        for (let i = 0; i < rule.style.length; i++) {
          const prop = rule.style.item(i);
          if (!prop.startsWith('--')) continue;
          const matched = PREFIXES.find((p) => prop.startsWith(p));
          if (!matched) continue;
          if (seen.has(prop)) continue;
          seen.add(prop);
          grouped[matched].push({ name: prop, value: cs.getPropertyValue(prop).trim() });
        }
      }
    }

    for (const key of Object.keys(grouped)) {
      grouped[key].sort((a, b) => a.name.localeCompare(b.name));
    }
    setRows(grouped);
  }, [isDark]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:px-8 sm:py-16">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 type-label-sm uppercase text-muted-foreground"
      >
        <DsxLink href="/" className="hover:text-foreground">
          Gallery
        </DsxLink>
        <span aria-hidden>/</span>
        <span className="text-foreground">Tokens</span>
      </nav>
      <header className="mb-10 flex items-baseline justify-between border-b border-border pb-6">
        <div>
          <p className="type-label-sm uppercase text-muted-foreground">Helios — dsx</p>
          <h1 className="mt-2 type-display text-foreground">Tokens</h1>
          <p className="mt-3 max-w-prose type-body-md text-muted-foreground">
            Every CSS variable in the loaded stylesheets, grouped by prefix. Values come from
            `getComputedStyle(documentElement)` so they reflect the active theme.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            document.documentElement.classList.toggle('dark');
            setIsDark((v) => !v);
          }}
          className="rounded-md border border-border bg-background px-3 py-1.5 type-label-md text-foreground hover:bg-muted"
        >
          Toggle dark
        </button>
      </header>

      {PREFIXES.map((prefix) => {
        const list = rows[prefix] ?? [];
        if (list.length === 0) return null;
        return (
          <section key={prefix} className="mb-10">
            <h2 className="mb-4 type-mono-sm text-muted-foreground">
              {prefix}* ({list.length})
            </h2>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((r) => (
                <li
                  key={r.name}
                  className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2"
                >
                  {isColorVar(r.name) ? (
                    <span
                      aria-hidden
                      className="block size-6 shrink-0 rounded-sm border border-border"
                      style={{ background: r.value || 'transparent' }}
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="block size-6 shrink-0 rounded-sm border border-dashed border-border"
                    />
                  )}
                  <div className="min-w-0 flex-1 type-mono-sm">
                    <div className="truncate text-foreground">{r.name}</div>
                    <div className="truncate text-muted-foreground">{r.value || '∅'}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
