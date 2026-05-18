import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Resolve relative to the repo root (where `pnpm dev` is launched).
    // process.cwd() in `next dev` is `apps/gallery`; the versions store is
    // two levels up.
    const path = join(process.cwd(), '..', '..', '.dsx', 'versions', '_index.json');
    const raw = await readFile(path, 'utf8');
    const index = JSON.parse(raw);
    return NextResponse.json(index, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'versions index not found', detail: (err as Error).message },
      { status: 404 },
    );
  }
}
