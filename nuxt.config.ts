// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Page data is fetched separately
  experimental: {
    payloadExtraction: true
  },
  // Compresses static files
  nitro: {
    compressPublicAssets: true
  },
  modules: [
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/image',
    '@element-plus/nuxt',
    // '@nuxt/icon',
    '@nuxtjs/i18n',
  ],
  runtimeConfig: {
    public: {
      imageBaseUrl: process.env.NUXT_PUBLIC_IMAGE_BASE_URL,
      apiBaseUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001',
      R2_PUB_URL: process.env.NUXT_PUBLIC_R2_PUB_URL
    }
  },
  image: {
    domains: ['localhost', process.env.NUXT_PUBLIC_R2_PUB_URL ?? ''],
    format: ['avif', 'webp']
  },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  fonts: {
    families: [
      {
        name: 'Manrope',
        provider: 'google',
        weights: [400, 600],
      },
      {
        name: 'Noto Sans Khmer',
        provider: 'google',
        weights: [400, 600],
      },
    ],
  },
  i18n: {
    langDir: 'locales',
    strategy: 'no_prefix', // no /km
    defaultLocale: 'en',

    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'km', file: 'km.json' },
    ],

    detectBrowserLanguage: false,
  },
})
