'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Instant-swap mechanism. When `?v=<id>` is present, inject a <link rel="stylesheet">
// at the END of <head> so it wins the cascade over the build-time tokens.active.css.
// When the param is absent or "active", remove any previously injected link.
//
// No Next.js refresh, no fetch round-trip beyond the CSS file itself.

const LINK_ID = 'dsx-active-version-stylesheet';

export function ActiveStylesheet() {
  const params = useSearchParams();
  const id = params.get('v');

  useEffect(() => {
    const existing = document.getElementById(LINK_ID) as HTMLLinkElement | null;
    if (!id || id === 'active') {
      existing?.remove();
      return;
    }
    const href = `/api/versions/${encodeURIComponent(id)}/tokens.css`;
    if (existing && existing.getAttribute('href') === href) return;
    if (existing) existing.remove();
    const link = document.createElement('link');
    link.id = LINK_ID;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }, [id]);

  return null;
}
