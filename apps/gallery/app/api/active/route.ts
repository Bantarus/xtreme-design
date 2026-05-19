import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function parseFrontMatter(md: string): { name: string | null; description: string | null } {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { name: null, description: null };
  const fm = m[1];
  const nameMatch = fm.match(/^name:\s*(.+)$/m);
  const descMatch = fm.match(/^description:\s*(.+)$/m);
  const strip = (s: string) => s.trim().replace(/^["']|["']$/g, '');
  return {
    name: nameMatch ? strip(nameMatch[1]) : null,
    description: descMatch ? strip(descMatch[1]) : null,
  };
}

async function resolveVersionName(repoRoot: string, id: string): Promise<string> {
  try {
    const raw = await readFile(join(repoRoot, '.dsx', 'versions', '_index.json'), 'utf8');
    const index = JSON.parse(raw) as Array<{ id: string; name: string }>;
    return index.find((v) => v.id === id)?.name ?? id;
  } catch {
    return id;
  }
}

export async function GET(req: NextRequest) {
  const v = req.nextUrl.searchParams.get('v');
  const repoRoot = join(process.cwd(), '..', '..');
  const isActive = !v || v === 'active';
  const path = isActive
    ? join(repoRoot, 'DESIGN.md')
    : join(repoRoot, '.dsx', 'versions', v, 'DESIGN.md');
  try {
    const md = await readFile(path, 'utf8');
    const parsed = parseFrontMatter(md);
    const version = isActive ? 'active' : await resolveVersionName(repoRoot, v as string);
    return NextResponse.json(
      { ...parsed, version },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'DESIGN.md not found', detail: (err as Error).message },
      { status: 404 },
    );
  }
}
