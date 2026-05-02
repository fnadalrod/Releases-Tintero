import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
  ],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'plugin.js',
        assetFileNames: () => {
          return 'assets/[name]-[hash][extname]';
        },
        manualChunks: undefined,
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
