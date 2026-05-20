import type { Decorator } from '@storybook/react-vite';
import { WebfontLoader } from '@/components/WebfontLoader';

// Renders the gallery's WebfontLoader once per story so the font families
// declared by the active version's tokens.css actually get fetched. The
// loader self-syncs via a MutationObserver on <head>, so the same instance
// covers version-switch transitions without per-version remount.
export const WebfontLoaderDecorator: Decorator = (Story) => (
  <>
    <WebfontLoader />
    <Story />
  </>
);
