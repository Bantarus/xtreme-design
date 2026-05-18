import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The Storybook framework re-uses this Vite config via .storybook/main.ts.
// Aliases mirror the gallery's tsconfig so shadcn-generated components
// (which import `@/lib/utils`, `@/components/ui/*`) resolve unchanged.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: /^@gallery\/ui\/(.*)$/,
        replacement: path.resolve(__dirname, '../gallery/components/ui/$1'),
      },
      {
        find: /^@\/(.*)$/,
        replacement: path.resolve(__dirname, '../gallery/$1'),
      },
    ],
  },
});
