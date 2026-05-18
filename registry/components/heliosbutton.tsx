'use client';

import * as React from 'react';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const heliosButtonVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        glow: 'bg-primary text-primary-foreground shadow-[0_0_0_3px_var(--color-focus-ring)] hover:bg-primary/90 hover:shadow-[0_0_0_4px_var(--color-focus-ring)]',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export type HeliosButtonProps = React.ComponentProps<typeof ButtonPrimitive> &
  VariantProps<typeof heliosButtonVariants>;

export function HeliosButton({ className, variant, size, ...props }: HeliosButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="helios-button"
      className={cn(heliosButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

HeliosButton.displayName = 'HeliosButton';
