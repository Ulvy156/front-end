# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rentify KH** — a room rental platform for Cambodia built with Nuxt 4 + Vue 3. Supports English and Khmer (i18n), with property browsing, filtering, listing submission, and user authentication.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm generate     # Generate static site
pnpm preview      # Preview production build
```

No lint or test scripts are configured. Use `pnpm` as the package manager (not npm or yarn).

## Architecture

### Directory Layout

```
app/
├── pages/           # Nuxt file-based routing
├── features/        # Domain-driven feature modules (home, auth, browse-properties, property-details, post-property)
├── components/      # Shared UI components (ui/, navbar/, footer/, property/, auth/, animation/)
├── stores/          # Pinia stores
├── composables/     # Reusable Vue composables
├── plugins/         # Nuxt plugins (axios interceptors, pinia persistence)
├── layouts/         # Page layouts (default, auth, admin)
├── middleware/       # Route middleware
├── services/        # Thin API service layer
├── types/           # TypeScript type definitions
├── i18n/locales/    # Translation JSON files (en, km)
└── config/          # Static configuration objects
└── utils/          # reusable logic across application
```

The **features/** directory is the main place for page-specific logic. Each feature contains its own components and composables (e.g., `features/browse-properties/composables/useBrowseProperties.ts`). Shared or cross-feature UI lives in **components/**.

### Routing

File-based routing via `app/pages/`. Key routes:

| Route | Purpose |
|---|---|
| `/` | Home — featured/latest listings |
| `/properties` | Browse & filter properties |
| `/properties/details/[id]` | Single property view |
| `/post-property` | Multi-step landlord listing form |
| `/auth/login`, `/auth/sign-up`, `/auth/reset-password` | Auth pages |
| `/user/profile` | User profile |

### State Management (Pinia)

- **auth.store.ts** — Current user (`AuthUser | null`), `isAuthenticated`, `isAdmin`, `isLandlord` getters
- **propertyFilter.ts** — All filter/pagination state; persisted to cookies (7-day expiry) via `pinia-plugin-persistedstate`
- **useCompareProperty.ts** — Property comparison utility

### API & Data Fetching

- **Axios** with a custom plugin (`plugins/axios.ts`) that:
  - Attaches Bearer tokens from cookies to every request
  - On 401: auto-refreshes via `POST /auth/refresh-token`, retries the original request, or clears session and redirects to `/auth/login` on failure
- Base URL from env var `NUXT_PUBLIC_API_URL` (defaults to `http://localhost:3001`)
- Data fetching uses Nuxt's `useAsyncData` wrapped in feature-level composables (e.g., `useHomePageData()`, `useBrowseProperties()`)
- Filter-triggered refetches are debounced 1000ms to avoid API spam

### Key Environment Variables

```
NUXT_PUBLIC_API_URL           # Backend API base URL
NUXT_PUBLIC_IMAGE_BASE_URL    # Image CDN base URL
NUXT_PUBLIC_R2_PUB_URL        # Cloudflare R2 public URL (property images)
NUXT_PUBLIC_GOOGLE_MAPS_KEY   # Google Maps API key
```

### Internationalization

Two locales: `en` (default) and `km` (Khmer). No URL prefix strategy — locale is detected or toggled manually. Translation files live in `i18n/locales/` split by domain (common, home, auth, filter, card, property, footer, post_property).

Font loading is locale-aware: Manrope for English, Noto Sans Khmer for Khmer.

### UI Stack

- **Tailwind CSS v4** (configured via `@tailwindcss/vite` — no `tailwind.config.ts`)
- **Element Plus** for form components and enterprise UI
- **@nuxt/icon** (Iconify) for icons
- **@vueuse/motion** for animations
- **dayjs** for date formatting
- **@vueup/vue-quill** for rich text editing in the post-property form
