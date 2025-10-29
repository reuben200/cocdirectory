import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
    name: 'Church Directory',
    short_name: 'CoC Directory',
    description: 'A directory that stores the contact details of the Churches of Christ',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    id: '/',
    icons: [
      {
        src: '/icons/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/pwa-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/pwa-512x512-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    lang: 'en',
    dir: 'ltr',
    categories: ['utilities', 'directory', 'productivity'],
  },


    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})