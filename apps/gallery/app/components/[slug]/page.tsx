import { DsxLink } from '@/components/DsxLink';
import { notFound } from 'next/navigation';
import { PreviewBySlug } from '@/lib/component-previews';
import { components, componentBySlug } from '@/lib/components-manifest';

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

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:px-8 sm:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <DsxLink href="/" className="hover:text-foreground">
          Gallery
        </DsxLink>
        <span aria-hidden>/</span>
        <DsxLink href="/" className="hover:text-foreground">
          {entry.category}
        </DsxLink>
        <span aria-hidden>/</span>
        <span className="text-foreground">{entry.name}</span>
      </nav>

      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{entry.name}</h1>
        <p className="mt-2 max-w-prose text-base text-muted-foreground">{entry.description}</p>
      </header>

      <section>
        <PreviewBySlug slug={slug} />
      </section>
    </main>
  );
}
