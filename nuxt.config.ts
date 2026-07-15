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
      maptilerKey: process.env.NUXT_PUBLIC_MAPTILER_KEY || '',
      BASE_URL: 'http://localhost:3000',
      // Must match the backend JWT access-token expiry (in seconds)
      accessTokenMaxAge: Number(process.env.NUXT_PUBLIC_ACCESS_TOKEN_MAX_AGE) || 900,
      // Should roughly match the backend refresh-token expiry (in seconds).
      // Used only for the client-side "has_session" marker cookie, not the
      // (httpOnly, backend-owned) refresh token itself.
      refreshTokenMaxAge: Number(process.env.NUXT_PUBLIC_REFRESH_TOKEN_MAX_AGE) || 60 * 60 * 24 * 7,
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
    build: {
      // @maptiler/sdk is lazy-loaded (only fetched when BaseMap.client.vue mounts),
      // so its ~1.4MB chunk never blocks initial page load — raise the limit to
      // stop Vite flagging that known, already-isolated chunk on every build.
      chunkSizeWarningLimit: 1500,
    },
    server: {
      // ngrok's free-tier domain changes on every restart, so allow any host for local testing
      allowedHosts: true,
    },
    optimizeDeps: {
      include: [
        '@tanstack/vue-query',
        'axios',
        'dayjs',
        'dayjs/plugin/relativeTime',
        'lodash-unified',
        'pinia-plugin-persistedstate',
        '@maptiler/sdk',
      ],
    },
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
          'en/landlord.json',
          'en/legal.json',
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
          'km/landlord.json',
          'km/legal.json',
        ]
      }
    ],

    detectBrowserLanguage: false,
  },
})