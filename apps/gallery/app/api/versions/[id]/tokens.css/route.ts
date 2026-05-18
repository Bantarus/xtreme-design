import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Reject path-traversal attempts.
  if (!/^[a-z0-9_-]+$/i.test(id)) {
    return new Response('invalid version id', { status: 400 });
  }
  try {
    const path = join(process.cwd(), '..', '..', '.dsx', 'versions', id, 'tokens.css');
    const css = await readFile(path, 'utf8');
    return new Response(css, {
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return new Response(`tokens.css not found for "${id}"`, { status: 404 });
  }
}
