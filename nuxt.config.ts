// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

// Report-Only for now — shipped without live testing against every provider
// (Google's consent screen, Telegram's popup widget, MapTiler's tiles/workers).
// It logs violations to the browser console instead of blocking anything, so
// nothing breaks. Watch the console across a login (Google + Telegram), a
// property-details map, and an image-heavy page for a few days, then rename
// the header below to `Content-Security-Policy` once it's clean.
const contentSecurityPolicy = [
  `default-src 'self'`,
  // Telegram's widget script, plus a hash for a small inline bootstrap
  // script telegram-widget.js injects itself (independent of our
  // data-auth-url vs data-onauth choice below) — everything else
  // (Nuxt/Element Plus/MapTiler) is bundled and self-hosted
  `script-src 'self' https://telegram.org 'sha256-mydg9AlvyoxjVj0zWJTf5x3zzK9+duNAKzZ7m+8vkl4='`,
  // Element Plus, MapLibre GL, and Tailwind arbitrary values all inject inline styles at runtime
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: ${process.env.NUXT_PUBLIC_R2_PUB_URL || ''} https://*.maptiler.com`,
  `font-src 'self' data:`,
  `connect-src 'self' https://*.maptiler.com`,
  // MapLibre GL (via @maptiler/sdk) parses vector tiles off the main thread using blob-URL workers
  `worker-src 'self' blob:`,
  // The Telegram Login button itself renders as an iframe from oauth.telegram.org
  `frame-src https://oauth.telegram.org`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  // Omitted while Report-Only: the spec makes this directive a no-op under
  // Report-Only (nothing to upgrade/block, so nothing to report), and
  // browsers log a console warning for it. Re-add once promoted to the
  // enforced `Content-Security-Policy` header.
].join('; ')

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
    // Flagged by Lighthouse best-practices audit.
    '/**': {
      headers: {
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        'X-Frame-Options': 'DENY',
        'Content-Security-Policy-Report-Only': contentSecurityPolicy,
        // Telegram Login's widget opens an oauth.telegram.org popup and
        // reports back via window.opener.postMessage. Plain 'same-origin'
        // severs window.opener for that cross-origin popup, so the widget's
        // onTelegramAuth callback never fires after the user approves in the
        // Telegram app — 'same-origin-allow-popups' keeps the isolation but
        // preserves the opener link for popups this page itself opens.
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
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
    // All icons come from the bundled lucide/mdi collections, which the
    // local server above serves in full — nothing is missing. Without this,
    // @iconify/vue "races" a request to the public api.iconify.design CDN
    // whenever the local route takes >750ms to respond (common on a cold
    // dev-server hit), which both leaks icon names to a third party and
    // violates the connect-src CSP.
    fallbackToApi: false,
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
    format: ['avif', 'webp'],
    // No provider-level default was set, so the Vercel image provider fell
    // back to q=100 on every request (Lighthouse: ~227 KiB of avoidable
    // image weight). 80 is visually lossless for photos at these display sizes.
    quality: 80,
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      // viewport-fit=cover lets env(safe-area-inset-*) resolve to the real
      // iPhone notch/home-indicator insets instead of 0, needed for the
      // fixed bottom tab bar (MobileBottomNav.vue) to clear the home indicator.
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
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
    resolve: {
      alias: [
        // dayjs's default entry (dayjs.min.js) is CJS-only with no "exports"
        // map, and Rolldown's CJS interop intermittently fails to wrap it
        // with a default export — "does not provide an export named
        // 'default'" when a page that imports it loads. dayjs ships a real
        // ESM build under esm/, so alias straight to that and skip the
        // interop step entirely. https://github.com/vitejs/rolldown-vite/issues/599
        { find: /^dayjs(\.js)?$/, replacement: 'dayjs/esm/index.js' },
        { find: /^dayjs\/plugin\/([^/]+?)(\.js)?$/, replacement: 'dayjs/esm/plugin/$1/index.js' },
      ],
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
    ssr: {
      // Rolldown (Vite's bundler as of Nuxt 4.5/Vite 8) mis-transforms
      // tslib's CJS helper exports (__extends, __assign, ...) when inlining
      // them into the SSR entry — "Cannot destructure property '__extends'
      // of '__toESM(...).default'" at runtime. tslib is pulled in via
      // @vueuse/motion's popmotion/framesync chain; keeping it external
      // makes Node require() it directly instead, sidestepping the bug.
      // https://github.com/vitejs/rolldown-vite/issues/599
      external: ['tslib'],
    },
  },
  fonts: {
    providers: {
      bunny: false,
      fontshare: false,
      adobe: false,
      fontsource: false,
      googleicons: false,
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