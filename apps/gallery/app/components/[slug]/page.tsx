import Link from 'next/link';
import { notFound } from 'next/navigation';
import { components, componentBySlug } from '@/lib/components-manifest';
import { previews } from '@/lib/component-previews';

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = componentBySlug(slug);
  if (!entry) return notFound();
  const Preview = previews[slug];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:px-8 sm:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Gallery</Link>
        <span aria-hidden>/</span>
        <Link href="/" className="hover:text-foreground">{entry.category}</Link>
        <span aria-hidden>/</span>
        <span className="text-foreground">{entry.name}</span>
      </nav>

      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{entry.name}</h1>
        <p className="mt-2 max-w-prose text-base text-muted-foreground">{entry.description}</p>
      </header>

      <section>
        {Preview ? <Preview /> : (
          <p className="rounded-md border border-dashed border-border bg-muted p-6 text-sm text-muted-foreground">
            No preview registered for "{slug}". Add one in
            <code className="ml-1 font-mono">apps/gallery/lib/component-previews.tsx</code>.
          </p>
        )}
      </section>
    </main>
  );
}
