import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  build: {
    outDir: 'dist-idc',
    rollupOptions: { input: fileURLToPath(new URL('../../idc-workbench-preview.html', import.meta.url)) },
  },
});
