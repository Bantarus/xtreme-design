'use client';

import NextLink, { type LinkProps } from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

type DsxLinkProps = Omit<LinkProps, 'href'> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    href: string;
    children: ReactNode;
  };

// In-app Link that preserves the current `?v=` selection so navigating between
// pages (gallery ↔ /tokens ↔ /components/<slug>) keeps the picker's pinned
// version. External hrefs (anything not starting with `/`) and the explicit
// "reset" path (`/?reset`) pass through untouched.
export function DsxLink({ href, children, ...rest }: DsxLinkProps) {
  const params = useSearchParams();
  const v = params.get('v');
  let finalHref = href;
  if (v && href.startsWith('/') && !href.includes('v=')) {
    const sep = href.includes('?') ? '&' : '?';
    finalHref = `${href}${sep}v=${encodeURIComponent(v)}`;
  }
  return (
    <NextLink href={finalHref} {...rest}>
      {children}
    </NextLink>
  );
}
