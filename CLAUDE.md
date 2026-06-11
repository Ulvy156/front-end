# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rentify KH** — a room rental platform for Cambodia built with Nuxt 4 + Vue 3. Supports English and Khmer (i18n), with property browsing, filtering, listing submission, user authentication, and role-based access control.

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

## Architecture

### Directory Layout

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

### Routing

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

### Roles & Authorization

Three roles defined in `app/types/role.ts` as an enum — never use raw strings:

```ts
import { Role } from '~/types/role'
// Role.USER / Role.LANDLORD / Role.ADMIN
```

**Two tools for role-based UI — use the right one:**

| Tool | Use when | ADMIN behaviour |
|---|---|---|
| `v-can="'landlord'"` | Show/hide a single element | ADMIN sees everything |
| `useRole().isLandlord` | Render different UI per role | Strict — no ADMIN elevation |

```html
<!-- v-can — removes element from DOM when not allowed -->
<button v-can="'auth'">My Profile</button>
<button v-can="'user'">Save to Favourites</button>
<button v-can="'landlord'">Post Property</button>
<div    v-can="'admin'">Admin Panel</div>
```

```ts
// useRole — strict per-role conditionals
const { isUser, isLandlord, isAdmin, isAuth } = useRole()
```

**Route middleware** — protect pages by adding `definePageMeta`:

```ts
definePageMeta({ middleware: 'auth' })     // any logged-in user
definePageMeta({ middleware: 'user' })     // USER role (+ ADMIN)
definePageMeta({ middleware: 'landlord' }) // LANDLORD role (+ ADMIN)
definePageMeta({ middleware: 'admin' })    // ADMIN only
```

All four middleware files are 3-line wrappers around `createRoleGuard` in `app/utils/roleGuard.ts`. Add new middleware there to keep logic in one place.

### State Management

**Pinia** (client state — UI, filters, compare):
- **auth.store.ts** — Current user (`AuthUser | null`), getters: `isAuthenticated`, `isUser`, `isLandlord`, `isAdmin`
- **propertyFilter.ts** — Filter/pagination state; persisted to cookies (7-day expiry)
- **useCompareProperty.ts** — Property comparison utility

**TanStack Query** (server state — data that comes from and goes back to the API):
- Used for the **favourites feature** (`useFavourites()` in `features/favourite/composable/`)
- `useQuery` for fetching, `useMutation` for save/remove with optimistic updates
- Query client set up in `plugins/vue-query.client.ts`

**When to use which:**
- `useAsyncData` / `useFetch` — page-level reads, SSR-important (home, browse, property details)
- TanStack Query — mutations + cross-component shared state (favourites, future: reviews, bookings)
- Pinia — client-only UI state (filters, compare list, auth user)

### API & Data Fetching

- **Axios** plugin (`plugins/axios.ts`):
  - Attaches `Authorization: Bearer <token>` from cookie on every request
  - Attaches `accept-language: <locale>` on every request
  - On 401: auto-refreshes via `POST /auth/refresh-token`, retries, or redirects to login
- Base URL from `NUXT_PUBLIC_API_URL` (defaults to `http://localhost:8080`)
- Always use `useApi()` composable — never create a raw axios instance

### Auth Flow

Full auth implementation follows `back-end-room/API/INTEGRATION.md`. Key points:

- **Token storage**: access token via `useAccessToken()` (wraps `useCookie('access_token')`, max-age from `NUXT_PUBLIC_ACCESS_TOKEN_MAX_AGE`), refresh token is HttpOnly (server-managed)
- For non-reactive, client-only cookie reads/writes (e.g. one-off checks outside Vue setup), use the plain helpers in `app/utils/cookie.ts` (`getCookie`/`setCookie`/`deleteCookie`/`hasCookie`) instead of `useCookie`
- **After login**: `accessToken.value = data.accessToken` → `authStore.fetchProfile()`
- **Google OAuth**: button redirects to `${apiBaseUrl}/auth/google` → server redirects to `/auth/callback?token=...`
- **Telegram**: widget calls `window.onTelegramAuth` → `$axios.post('/auth/telegram-login', user)`
- **403 handling**: not-verified → redirect to `/auth/verify?email=...`; locked → show error toast
- **Logout**: `POST /auth/logout` → clear cookie → `authStore.clear()` → `queryClient.removeQueries(['favourites'])` → navigate to login

### Form Validation Pattern

Use `useForm()` for any Element Plus form — eliminates `formRef`, `isLoading`, server-error boilerplate:

```ts
const { formRef, form, rules, isSubmitting, handleSubmit, setFieldError } = useForm(
  { email: '', password: '' },
  loginRules,   // from useAuthFormRules()
)

const submit = handleSubmit(async () => {
  // only runs after el-form validation passes
  // isSubmitting is managed automatically
})

// Show a backend error inline on a field (clears when user types):
setFieldError('email', extract(err))
```

```html
<el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="submit">
```

### Error Handling Pattern

Always use `useErrorMsg()` to extract backend error messages — never hardcode error strings:

```ts
const { extract } = useErrorMsg()
// Returns backend response message or t('common.somethingWentWrong') as fallback
notify.error(extract(err))
```

### Key Environment Variables

```
NUXT_PUBLIC_API_URL           # Backend API base URL (default: http://localhost:8080)
NUXT_PUBLIC_IMAGE_BASE_URL    # Image CDN base URL
NUXT_PUBLIC_R2_PUB_URL        # Cloudflare R2 public URL (property images)
NUXT_PUBLIC_GOOGLE_MAPS_KEY   # Google Maps API key
```

### Internationalization

Two locales: `en` (default) and `km` (Khmer). No URL prefix — locale toggled manually and stored in `localStorage`. Translation files live in `i18n/locales/en/` and `i18n/locales/km/`, split by domain:

`common`, `home`, `auth`, `filter`, `card`, `property`, `footer`, `post_property`, `favourites`, `admin`

**Never hardcode UI strings.** All user-facing text must use `t('key')`. Backend error messages are already localised by the server (via `accept-language` header) — pass them through `extract(err)` directly.

Font loading is locale-aware: Manrope for English, Noto Sans Khmer for Khmer.

### UI Stack

- **Tailwind CSS v4** (configured via `@tailwindcss/vite` — no `tailwind.config.ts`)
- **Element Plus** for form components and enterprise UI
- **@nuxt/icon** (Iconify, `lucide:` prefix) for icons
- **@vueuse/motion** for animations
- **dayjs** for date formatting
- **@vueup/vue-quill** for rich text editing in the post-property form
- **@tanstack/vue-query** for server state with mutations

## Rules of Writing Code

**General**
- Follow existing project patterns — look at how the nearest similar feature is built before writing new code
- Follow DRY — shared logic belongs in `utils/` (factories, pure helpers) or `composables/` (reactive logic)
- No component longer than 300 lines — if it exceeds that, split into smaller components

**Strings & i18n**
- Never hardcode UI strings — all user-facing text must go through `t('key')`
- Never hardcode backend error messages — the server already returns them in the user's language via the `accept-language` header; use `useErrorMsg().extract(err)` to read them
- Never hardcode role strings — always use the `Role` enum from `~/types/role`

**API & Data Fetching**
- Always use `useApi()` — never create a raw `axios` instance for API calls
- Use `useAsyncData` for page-level reads where SSR matters (home, browse, property details)
- Use TanStack Query (`useQuery` / `useMutation`) for data that has mutations or needs to stay in sync across components (favourites, user actions)
- Use Pinia only for client-only state that never comes from the server (filters, compare list, auth user object)

**Forms**
- Use `useForm()` for every Element Plus form — it handles `formRef`, `isSubmitting`, validation, and inline server errors
- Use `useAuthFormRules()` for auth form validation rules — rules use `t()` so they switch language automatically

**Authorization**
- Use `v-can` to show or hide a single UI element based on role
- Use `definePageMeta({ middleware: '...' })` to protect an entire route
- Use `useRole()` when you need to render different UI for different roles in the same template
- Never duplicate access logic — all middleware goes through `createRoleGuard` in `utils/roleGuard.ts`

**After structural changes**
- After adding a new middleware file — run `pnpm postinstall` to regenerate `.nuxt/types/middleware.d.ts`
- After adding a new i18n locale file — register it in `nuxt.config.ts` under both `en` and `km` locales
