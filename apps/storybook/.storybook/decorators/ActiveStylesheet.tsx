import type { Decorator } from '@storybook/react-vite';
import { useEffect } from 'react';

// Injects a <link rel="stylesheet"> for the selected design version at the
// END of <head>, so its :root { --color-* } block wins over preview.css's
// statically imported tokens.active.css via normal CSS cascade order.
//
// The "active" toolbar choice is a no-op: preview.css already imports the
// live tokens.active.css. Selecting "active" just removes any prior
// injected link. Any other value resolves to /versions/<id>/tokens.css,
// which the mirror script keeps in sync with .dsx/versions/<id>/tokens.css.
//
// One injected element at a time, identified by [data-dsx-version].
// Swapping the version takes ~30 ms in dev (link load + paint).

const MARKER_ATTR = 'data-dsx-version';

function removePreviousLink() {
  const prev = document.querySelector(`link[${MARKER_ATTR}]`);
  if (prev) prev.remove();
}

function injectLink(id: string) {
  removePreviousLink();
  if (id === 'active') return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `/versions/${id}/tokens.css`;
  link.setAttribute(MARKER_ATTR, id);
  document.head.appendChild(link);
}

export const ActiveStylesheet: Decorator = (Story, context) => {
  const designVersion = (context.globals.designVersion ?? 'active') as string;

  useEffect(() => {
    injectLink(designVersion);
    return () => removePreviousLink();
  }, [designVersion]);

  return <Story />;
};
