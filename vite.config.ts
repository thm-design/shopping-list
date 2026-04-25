import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    entries: ['src/**/*.{ts,tsx}'],
  },
  server: {
    host: true,
  },
  build: {
    sourcemap: true,
    copyPublicDir: true, // Copy public directory to dist after build
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'amplify-vendor': ['aws-amplify', '@aws-amplify/ui-react'],
          'lucide-vendor': ['lucide-react'],
        },
      },
    },
  },
  publicDir: 'public' // Serve public directory for dev and assets
})
