import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-streamlined',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index-streamlined.html'),
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8174, // Different port for streamlined version
  },
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
