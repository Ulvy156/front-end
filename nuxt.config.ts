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
  // Proxies same-origin /api/** to the backend so the browser sees the
  // refresh_token cookie as first-party (rentify-kh.vercel.app vs
  // back-end-room.onrender.com are different registrable domains, and
  // Safari/Brave/Chrome all block or are blocking third-party cookies —
  // that broke refresh-token persistence when calling the backend directly).
  routeRules: {
    '/api/**': {
      proxy: {
        to: `${process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8080'}/**`,
        // Without this, the proxy follows the backend's 302 (e.g. the
        // Google OAuth redirect to accounts.google.com) itself and streams
        // Google's HTML back under the rokpteah.com origin instead of
        // letting the browser navigate there — breaks Google's page (CSP
        // base-uri, relative-URL POSTs, CORS-blocked gstatic scripts).
        fetchOptions: { redirect: 'manual' },
      },
    },
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
  // Nuxt Icon's local icon server defaults to /api/_nuxt_icon/**, which the
  // /api/** proxy rule above swallows and forwards to the backend (404,
  // "failed to load icon" warnings for every icon). Move it off /api/**.
  icon: {
    localApiEndpoint: '/_nuxt_icon',
  },
  runtimeConfig: {
    public: {
      imageBaseUrl: process.env.NUXT_PUBLIC_IMAGE_BASE_URL,
      apiBaseUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8080',
      R2_PUB_URL: process.env.NUXT_PUBLIC_R2_PUB_URL,
      maptilerKey: process.env.NUXT_PUBLIC_MAPTILER_KEY || '',
      BASE_URL: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      // Must match the backend JWT access-token expiry (in seconds)
      accessTokenMaxAge: Number(process.env.NUXT_PUBLIC_ACCESS_TOKEN_MAX_AGE) || 900,
    }
  },
  image: {
    domains: ['localhost', process.env.NUXT_PUBLIC_R2_PUB_URL ?? ''],
    format: ['avif', 'webp']
  },
  css: ['./app/assets/css/main.css'],
  app: {
    head: {
      // Reinforces the CSS `color-scheme: light` in main.css — tells the
      // browser chrome (and anything reading <head> before CSS loads) this
      // site is light-only, so OS/browser dark mode doesn't flip native
      // form controls, scrollbars, or the mobile address bar tint.
      meta: [
        { name: 'color-scheme', content: 'light' },
      ],
    },
  },
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
    fallbackLocale: 'en',
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