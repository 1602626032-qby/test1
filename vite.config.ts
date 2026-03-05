import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 本地双击打开用 base: './'；部署到 GitHub Pages 用 base: '/'
const base = process.env.VITE_BASE === 'local' ? './' : '/';
const singleFile = process.env.VITE_SINGLEFILE === 'true';

export default defineConfig({
  base,
  plugins: [react(), ...(singleFile ? [viteSingleFile()] : [])],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});


