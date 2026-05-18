import type { Preview } from '@storybook/react-vite';
import { ActiveStylesheet } from './decorators/ActiveStylesheet';
import versions from './versions.json';
import './preview.css';

// Toolbar items are baked at dev-time from .storybook/versions.json.
// The pipeline (scripts/mirror-storybook-versions.mjs) rewrites that file
// whenever a snapshot is created, so Vite HMR refreshes this list without
// a manual Storybook restart.
const versionItems = [
  { value: 'active', title: 'Active (live DESIGN.md)' },
  ...versions.map((v) => ({ value: v.id, title: `${v.name}` })),
];

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/ },
    },
  },
  globalTypes: {
    designVersion: {
      name: 'Design version',
      description: 'Active design system version',
      defaultValue: 'active',
      toolbar: {
        icon: 'paintbrush',
        items: versionItems,
        dynamicTitle: true,
      },
    },
  },
  decorators: [ActiveStylesheet],
};

export default preview;
