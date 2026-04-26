import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'AirList',
        short_name: 'AirList',
        description: 'A beautiful, simple shopping list app.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        display: 'standalone',
        background_color: '#ffffff',
        start_url: '/',
        orientation: 'portrait'
      }
    })
  ],
  optimizeDeps: {
    entries: ['src/**/*.{ts,tsx}'],
  },
  server: {
    host: true,
  },
  build: {
    sourcemap: true,
    copyPublicDir: true,
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
  publicDir: 'public'
})
