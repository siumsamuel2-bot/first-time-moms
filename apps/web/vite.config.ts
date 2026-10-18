import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Firstweeks',
        short_name: 'Firstweeks',
        description: 'Personalized postpartum support for first-time moms',
        theme_color: '#14b8a6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        categories: ['health', 'medical', 'lifestyle'],
        screenshots: [],
        shortcuts: [
          { name: 'Daily Check-in', url: '/check-in', description: 'Complete your daily check-in' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
    }),
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-select',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-switch',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-label',
            '@radix-ui/react-separator',
            '@radix-ui/react-avatar',
            '@radix-ui/react-toast',
            '@radix-ui/react-progress',
          ],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-form': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge'],
          'pages-auth': [
            './src/pages/LoginPage.tsx',
            './src/pages/SignupPage.tsx',
            './src/pages/ForgotPasswordPage.tsx',
            './src/pages/ResetPasswordPage.tsx',
            './src/pages/VerifyEmailPage.tsx',
            './src/pages/ResendVerificationPage.tsx',
          ],
          'pages-onboarding': ['./src/pages/OnboardingPage.tsx'],
          'pages-checkin': ['./src/pages/CheckInPage.tsx', './src/pages/HistoryPage.tsx'],
          'pages-dashboard': ['./src/pages/DashboardPage.tsx', './src/pages/ProfilePage.tsx'],
          'pages-clinician': [
            './src/pages/ClinicianDashboardPage.tsx',
            './src/pages/ClinicianPatientPage.tsx',
          ],
          'pages-provider': [
            './src/pages/ProviderSearchPage.tsx',
            './src/pages/ReferralsListPage.tsx',
            './src/pages/ReferralAcceptancePage.tsx',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
