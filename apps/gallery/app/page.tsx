import Link from 'next/link';
import { categories, components, type ComponentCategory } from '@/lib/components-manifest';

const paletteVars = [
  '--color-primary',
  '--color-surface',
  '--color-surface-muted',
  '--color-text',
  '--color-text-muted',
  '--color-border',
  '--color-success',
  '--color-warning',
  '--color-danger',
  '--color-info',
  '--color-focus-ring',
] as const;

export default function HomePage() {
  const grouped = new Map<ComponentCategory, typeof components>();
  for (const c of categories) grouped.set(c, components.filter((x) => x.category === c));

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14">
      <header className="border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">helios · gallery</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-foreground">Active design system</h1>
        <p className="mt-2 max-w-prose text-base text-muted-foreground">
          The gallery is rendered deterministically from <code className="font-mono">DESIGN.md</code>. Pick a
          component below to inspect it in the active palette. Page composition lives in Storybook.
        </p>
      </header>

      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Active palette</h2>
          <Link href="/tokens" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            /tokens →
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {paletteVars.map((v) => (
            <div key={v} className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5">
              <span
                aria-hidden
                className="block size-6 rounded-sm border border-border"
                style={{ background: `var(${v})` }}
              />
              <span className="font-mono text-xs text-foreground">{v}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 space-y-10">
        {categories.map((cat) => {
          const items = grouped.get(cat) ?? [];
          return (
            <div key={cat}>
              <h2 className="border-b border-border pb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {cat} ({items.length})
              </h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/components/${c.slug}`}
                      className="group block rounded-md border border-border bg-card p-3 transition-colors hover:border-border-strong"
                    >
                      <div className="text-sm font-medium text-foreground group-hover:text-primary">{c.name}</div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <footer className="mt-16 border-t border-border pt-6 text-xs text-muted-foreground">
        DESIGN.md is the only file the agent edits. Everything you see is rendered from it.
      </footer>
    </main>
  );
}
