import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ActiveDesignHeader } from '@/components/ActiveDesignHeader';
import { DsxLink } from '@/components/DsxLink';
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

async function readActiveMeta(): Promise<{ name: string | null; description: string | null }> {
  try {
    const md = await readFile(join(process.cwd(), '..', '..', 'DESIGN.md'), 'utf8');
    const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) return { name: null, description: null };
    const fm = m[1];
    const strip = (s: string) => s.trim().replace(/^["']|["']$/g, '');
    const nameMatch = fm.match(/^name:\s*(.+)$/m);
    const descMatch = fm.match(/^description:\s*(.+)$/m);
    return {
      name: nameMatch ? strip(nameMatch[1]) : null,
      description: descMatch ? strip(descMatch[1]) : null,
    };
  } catch {
    return { name: null, description: null };
  }
}

export default async function HomePage() {
  const initial = await readActiveMeta();
  const grouped = new Map<ComponentCategory, typeof components>();
  for (const c of categories)
    grouped.set(
      c,
      components.filter((x) => x.category === c),
    );

  return (
    <main className="mx-auto max-w-6xl px-6 pb-10 sm:px-8 sm:pb-14">
      <ActiveDesignHeader initial={initial} />

      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Active palette
          </h2>
          <DsxLink
            href="/tokens"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            /tokens →
          </DsxLink>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {paletteVars.map((v) => (
            <div
              key={v}
              className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5"
            >
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
                    <DsxLink
                      href={`/components/${c.slug}`}
                      className="group block rounded-md border border-border bg-card p-3 transition-colors hover:border-border-strong"
                    >
                      <div className="text-sm font-medium text-foreground group-hover:text-primary">
                        {c.name}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {c.description}
                      </p>
                    </DsxLink>
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
