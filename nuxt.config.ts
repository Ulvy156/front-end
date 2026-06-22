// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {},
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
    '@nuxt/icon',
    '@element-plus/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/motion/nuxt',
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    public: {
      imageBaseUrl: process.env.NUXT_PUBLIC_IMAGE_BASE_URL,
      apiBaseUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8080',
      R2_PUB_URL: process.env.NUXT_PUBLIC_R2_PUB_URL,
      googleMapsKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_KEY,
      BASE_URL: 'http://localhost:3000',
      // Must match the backend JWT access-token expiry (in seconds)
      accessTokenMaxAge: Number(process.env.NUXT_PUBLIC_ACCESS_TOKEN_MAX_AGE) || 900,
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
    providers: {
      bunny: false,
    },
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
      {
        code: 'en',
        files: [
          'en/common.json',
          'en/home.json',
          'en/auth.json',
          'en/filter.json',
          'en/card.json',
          'en/property.json',
          'en/footer.json',
          'en/post_property.json',
          'en/favourites.json',
          'en/admin.json',
          'en/profile.json',
          'en/feedback.json',
        ]
      },
      {
        code: 'km',
        files: [
          'km/common.json',
          'km/home.json',
          'km/auth.json',
          'km/filter.json',
          'km/card.json',
          'km/property.json',
          'km/footer.json',
          'km/post_property.json',
          'km/favourites.json',
          'km/admin.json',
          'km/profile.json',
          'km/feedback.json',
        ]
      }
    ],

    detectBrowserLanguage: false,
  },
})