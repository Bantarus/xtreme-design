'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Instant-swap mechanism. When `?v=<id>` is present, inject a <link rel="stylesheet">
// at the END of <head> so it wins the cascade over the build-time tokens.active.css.
// When the param is absent or "active", remove any previously injected link.
//
// Atomic swap: the new stylesheet is appended and we wait for its `onload`
// before removing the old override. While both are in the cascade, the later
// one wins — so the user never sees a "between" frame where the build-time
// baseline is rendered.

const LINK_ID = 'dsx-active-version-stylesheet';
const PENDING_PREFIX = 'dsx-pending-version-';

export function ActiveStylesheet() {
  const params = useSearchParams();
  const id = params.get('v');

  useEffect(() => {
    document.head
      .querySelectorAll(`link[id^="${PENDING_PREFIX}"]`)
      .forEach((node) => node.remove());

    const existing = document.getElementById(LINK_ID) as HTMLLinkElement | null;

    if (!id || id === 'active') {
      existing?.remove();
      return;
    }

    const href = `/api/versions/${encodeURIComponent(id)}/tokens.css`;
    if (existing && existing.getAttribute('href') === href) return;

    const link = document.createElement('link');
    link.id = `${PENDING_PREFIX}${id}`;
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => {
      existing?.remove();
      link.id = LINK_ID;
    };
    link.onerror = () => {
      link.remove();
    };
    document.head.appendChild(link);
  }, [id]);

  return null;
}
