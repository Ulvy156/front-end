# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**RokPteah** — a room rental platform for Cambodia built with Nuxt 4 + Vue 3. Supports English and Khmer (i18n), with property browsing, filtering, listing submission, user authentication, and role-based access control.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm generate     # Generate static site
pnpm preview      # Preview production build
pnpm postinstall  # Regenerate .nuxt/ types (run after adding middleware, pages, etc.)
```

No lint or test scripts are configured. Use `pnpm` as the package manager (not npm or yarn).

After adding a new middleware file, always run `pnpm postinstall` so Nuxt regenerates `.nuxt/types/middleware.d.ts` and TypeScript recognises the new key.

## Directory Layout

```
app/
├── pages/           # Nuxt file-based routing (incl. admin/ — admin-only pages)
├── features/        # Domain-driven feature modules
│   ├── auth/        # Login, sign-up, OTP, reset-password components & composables
│   ├── browse-properties/
│   ├── property-details/
│   ├── post-property/
│   ├── home/
│   ├── favourite/   # Favourite feature (TanStack Query)
│   └── admin/       # Admin dashboard, users, landlords, properties management
├── components/      # Shared UI components (ui/, navbar/, footer/, property/, auth/)
├── stores/          # Pinia stores (auth, propertyFilter, compareProperty)
├── composables/     # Reusable Vue composables (incl. useAccessToken — access-token cookie)
├── directives/      # Custom Vue directives (can.ts)
├── plugins/         # Nuxt plugins (axios, pinia persistence, vue-query, directives)
├── middleware/       # Route middleware (auth, user, landlord, admin)
├── layouts/         # Page layouts (default, auth, admin)
├── types/           # TypeScript type definitions (property-card, role)
├── utils/           # Shared logic (roleGuard factory, cookie helpers)
├── services/        # Thin API service layer
├── i18n/locales/    # Translation JSON files (en/, km/)
└── config/          # Static configuration objects
```

The **features/** directory is the main place for page-specific logic. Each feature contains its own components, composables, services, and interfaces. Shared or cross-feature UI lives in **components/**.

## Routing

File-based routing via `app/pages/`. Key routes:

| Route | Purpose | Middleware |
|---|---|---|
| `/` | Home — featured/latest listings | — |
| `/properties` | Browse & filter properties | — |
| `/properties/details/[id]` | Single property view | — |
| `/post-property` | Multi-step landlord listing form | `landlord` |
| `/user/profile` | User profile | `auth` |
| `/user/favourites` | Saved properties listing | `user` |
| `/auth/login`, `/auth/sign-up` | Auth pages | — |
| `/auth/reset-password` | 3-step forgot/reset password | — |
| `/auth/verify` | Standalone OTP verify (unverified account) | — |
| `/auth/callback` | Google OAuth redirect handler | — |
| `/auth/role-select` | Choose USER/LANDLORD after first OAuth/Telegram sign-up | — |
| `/admin` | Admin dashboard (stats, recent activity) | `admin` |
| `/admin/users` | Manage users (create/edit via drawer) | `admin` |
| `/admin/landlords` | Manage landlords & their properties | `admin` |
| `/admin/properties` | Manage property listings | `admin` |

Admin routes use the `admin` layout (sidebar nav via `AdminNavItem`) instead of `default`/`auth`.

## Further reading

These are plain references, not imports — do not read them by default. Read the specific file with the Read tool only when the current task touches that area.

- `docs/architecture.md` — state management, API/data fetching, auth flow, form/error handling patterns, env vars, UI stack
- `docs/roles-and-authorization.md` — Role enum, `v-can` vs `useRole()`, route middleware
- `docs/i18n.md` — locales, translation file layout, string rules
- `docs/coding-conventions.md` — naming conventions, reusable components/utils, Vue component rules, data fetching, forms, authorization, post-structural-change checklist
