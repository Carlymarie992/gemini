import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular({
      tsconfig: './tsconfig.json',
    }),
  ],
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
  },
  server: {
    port: 3000,
    open: false,
  },
  preview: {
    port: 3000,
  },
  optimizeDeps: {
    include: ['rxjs', '@google/genai'],
  },
});
