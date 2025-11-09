import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true, // 5173 포트 강제 사용
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
