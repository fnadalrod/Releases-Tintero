import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin({
      jsAssetsFilterFunction: (chunk) => chunk.fileName === 'plugin.js',
    }),
  ],
  base: './',
  build: {
    cssCodeSplit: false,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.tsx',
      output: {
        entryFileNames: 'plugin.js',
        assetFileNames: () => {
          return 'assets/[name]-[hash][extname]';
        },
        manualChunks: undefined,
        format: 'iife',
        name: 'WorldCodexPlugin'
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
