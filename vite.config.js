import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
});
