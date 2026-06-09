import path from 'node:path'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@engine': path.resolve(__dirname, 'src/engine'),
      '@state': path.resolve(__dirname, 'src/state'),
      '@ui': path.resolve(__dirname, 'src/ui'),
      '@data': path.resolve(__dirname, 'src/data'),
    },
  },
})
