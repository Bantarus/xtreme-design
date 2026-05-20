'use client';

import { useEffect } from 'react';

// Reads the resolved --font-* CSS variables from <html>, deduplicates the
// families, and injects a single <link rel="stylesheet"> to Google Fonts.
// Re-runs whenever a stylesheet in <head> finishes loading — that's how we
// catch the gallery's version-switch (which appends a /versions/<id>/tokens.css
// link and overrides --font-* in the cascade) and the Storybook decorator's
// equivalent. Plus a couple of timed re-syncs cover the cached-stylesheet case
// where a `load` event never fires.
//
// Families Google Fonts doesn't host (Söhne, Berkeley Mono, Tungsten, …) are
// requested anyway; the request 404s silently and the browser falls back to
// system fonts. Same failure mode as before, just no longer applied uniformly
// to every version.

const FONT_SCALES = [
  'display',
  'headline-lg',
  'headline-md',
  'title-md',
  'body-lg',
  'body-md',
  'body-sm',
  'label-md',
  'label-sm',
  'mono-sm',
];

const SYSTEM_FAMILIES = new Set([
  'system-ui',
  'ui-sans-serif',
  'ui-serif',
  'ui-monospace',
  'sans-serif',
  'serif',
  'monospace',
  'inherit',
  'initial',
  'unset',
]);

const MARKER_ATTR = 'data-dsx-fonts';

function extractFamilies(): string[] {
  if (typeof window === 'undefined') return [];
  const styles = getComputedStyle(document.documentElement);
  const seen = new Set<string>();
  for (const scale of FONT_SCALES) {
    const raw = styles.getPropertyValue(`--font-${scale}`).trim();
    if (!raw) continue;
    const head = raw.split(',')[0].trim().replace(/^["']|["']$/g, '');
    if (!head || SYSTEM_FAMILIES.has(head.toLowerCase())) continue;
    seen.add(head);
  }
  return Array.from(seen).sort();
}

// Cover the full weight spectrum with the DISCRETE syntax (semicolons). The
// range form `:wght@100..900` only works for variable fonts and 400s on every
// static family (UnifrakturCook, IM Fell DW Pica, Press Start 2P, Audiowide,
// VT323, …). One bad family in the URL fails the whole stylesheet, so the
// range form silently breaks the page for any version using a static font.
// The discrete form is permissive: Google Fonts serves whichever weights of
// this list the family actually publishes.
const WEIGHT_AXIS = ':wght@100;200;300;400;500;600;700;800;900';

function buildHref(families: string[]): string | null {
  if (families.length === 0) return null;
  const params = families
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}${WEIGHT_AXIS}`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

function syncLink() {
  const href = buildHref(extractFamilies());
  const existing = document.querySelector(`link[${MARKER_ATTR}]`) as HTMLLinkElement | null;
  if (!href) {
    if (existing) existing.remove();
    return;
  }
  if (existing && existing.href === href) return;
  if (existing) existing.remove();
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute(MARKER_ATTR, '');
  document.head.appendChild(link);
}

function attachLoadListener(node: Element) {
  if (
    node instanceof HTMLLinkElement &&
    node.rel === 'stylesheet' &&
    !node.hasAttribute(MARKER_ATTR)
  ) {
    node.addEventListener('load', syncLink, { once: true });
  }
}

export function WebfontLoader() {
  useEffect(() => {
    syncLink();

    // Whenever a new stylesheet link is added to <head> (gallery's
    // ActiveStylesheet for ?v= switching, Storybook's decorator for the
    // toolbar), watch its load event and re-sync once the new CSS vars are
    // actually applied. Existing links may already be loaded; the timed
    // fallbacks below cover that case.
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node instanceof Element) attachLoadListener(node);
        }
      }
    });
    observer.observe(document.head, { childList: true, subtree: false });

    // Fallbacks: the version stylesheet may already be cached, in which case
    // its `load` event won't fire after appendChild. These two timers catch
    // the common "first paint after cached stylesheet" and "slow network"
    // cases without spinning a permanent poll.
    const t1 = window.setTimeout(syncLink, 200);
    const t2 = window.setTimeout(syncLink, 800);

    return () => {
      observer.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return null;
}
