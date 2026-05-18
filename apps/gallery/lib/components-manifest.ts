// Single source of truth for every component the gallery shows.
// The /components/[slug] route reads this; component-previews.tsx provides
// the matching JSX. Add a component: (1) add the entry here, (2) add a
// renderer keyed by slug in component-previews.tsx. That's the whole flow.

export type ComponentCategory =
  | 'Primitives'
  | 'Forms'
  | 'Navigation'
  | 'Overlays'
  | 'Feedback'
  | 'Data'
  | 'Layout';

export type ComponentEntry = {
  slug: string;
  name: string;
  category: ComponentCategory;
  description: string;
};

export const components: ComponentEntry[] = [
  // Primitives
  {
    slug: 'button',
    name: 'Button',
    category: 'Primitives',
    description:
      'The single primary action per view. Six variants × four sizes = 24 visible states.',
  },
  {
    slug: 'badge',
    name: 'Badge',
    category: 'Primitives',
    description: 'Status chips. Four variants: default, secondary, destructive, outline.',
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    category: 'Primitives',
    description: 'User glyph with optional fallback initials.',
  },
  {
    slug: 'separator',
    name: 'Separator',
    category: 'Primitives',
    description: 'Horizontal or vertical divider rendered as a hairline.',
  },

  // Forms
  {
    slug: 'input',
    name: 'Input',
    category: 'Forms',
    description: 'Default, disabled, with icon, invalid (aria-invalid).',
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    category: 'Forms',
    description: 'Multi-line input. Default, disabled, invalid.',
  },
  {
    slug: 'label',
    name: 'Label',
    category: 'Forms',
    description: 'Form field label, pairs with htmlFor.',
  },
  {
    slug: 'select',
    name: 'Select',
    category: 'Forms',
    description: 'Single-value picker with grouped options.',
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    category: 'Forms',
    description: 'Boolean toggle, three states: unchecked, checked, indeterminate.',
  },
  {
    slug: 'radio-group',
    name: 'Radio group',
    category: 'Forms',
    description: 'Mutually exclusive selection. Default and disabled states.',
  },
  {
    slug: 'switch',
    name: 'Switch',
    category: 'Forms',
    description: 'Binary toggle. Default and disabled states.',
  },
  {
    slug: 'slider',
    name: 'Slider',
    category: 'Forms',
    description: 'Numeric range. Single and double-handle ranges.',
  },

  // Navigation
  {
    slug: 'tabs',
    name: 'Tabs',
    category: 'Navigation',
    description: 'Switch between same-level views. Horizontal layout.',
  },
  {
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    category: 'Navigation',
    description: 'Hierarchical location indicator.',
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    category: 'Navigation',
    description: 'Page-by-page navigation.',
  },
  {
    slug: 'command',
    name: 'Command palette',
    category: 'Navigation',
    description: 'Searchable command list (⌘K-style).',
  },

  // Overlays
  {
    slug: 'dialog',
    name: 'Dialog',
    category: 'Overlays',
    description: 'Modal surface with backdrop and focus trap.',
  },
  {
    slug: 'alert-dialog',
    name: 'Alert dialog',
    category: 'Overlays',
    description: 'Confirm/destroy dialog with explicit primary + secondary actions.',
  },
  {
    slug: 'sheet',
    name: 'Sheet',
    category: 'Overlays',
    description: 'Side-attached panel (right / left / top / bottom).',
  },
  {
    slug: 'popover',
    name: 'Popover',
    category: 'Overlays',
    description: 'Anchored tertiary surface, non-modal.',
  },
  {
    slug: 'dropdown-menu',
    name: 'Dropdown menu',
    category: 'Overlays',
    description: 'Click-triggered menu with labels and separators.',
  },
  {
    slug: 'context-menu',
    name: 'Context menu',
    category: 'Overlays',
    description: 'Right-click triggered menu.',
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    category: 'Overlays',
    description: 'Hover-only label for icon-only triggers.',
  },
  {
    slug: 'hover-card',
    name: 'Hover card',
    category: 'Overlays',
    description: 'Richer hover-anchored preview surface.',
  },

  // Feedback
  {
    slug: 'alert',
    name: 'Alert',
    category: 'Feedback',
    description: 'Inline notification with optional icon. Default and destructive variants.',
  },
  {
    slug: 'progress',
    name: 'Progress',
    category: 'Feedback',
    description: 'Determinate progress bar.',
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    category: 'Feedback',
    description: 'Loading placeholder shape.',
  },
  {
    slug: 'sonner',
    name: 'Toast (sonner)',
    category: 'Feedback',
    description: 'Stack of dismissable notifications, top-right.',
  },

  // Data
  {
    slug: 'card',
    name: 'Card',
    category: 'Data',
    description: 'Surface container with header, content, footer.',
  },
  {
    slug: 'table',
    name: 'Table',
    category: 'Data',
    description: 'Tabular layout with header, rows, optional caption.',
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    category: 'Data',
    description: 'Vertically stacked collapsible sections.',
  },
  { slug: 'calendar', name: 'Calendar', category: 'Data', description: 'Month-grid date picker.' },

  // Layout
  {
    slug: 'scroll-area',
    name: 'Scroll area',
    category: 'Layout',
    description: 'Custom-styled scrollable region.',
  },
  {
    slug: 'aspect-ratio',
    name: 'Aspect ratio',
    category: 'Layout',
    description: 'Locks child to a specific aspect ratio.',
  },
];

export const categories: ComponentCategory[] = [
  'Primitives',
  'Forms',
  'Navigation',
  'Overlays',
  'Feedback',
  'Data',
  'Layout',
];

export function componentBySlug(slug: string): ComponentEntry | undefined {
  return components.find((c) => c.slug === slug);
}
