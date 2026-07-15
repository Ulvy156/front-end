# Architecture

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

### UI Stack

- **Tailwind CSS v4** (configured via `@tailwindcss/vite` — no `tailwind.config.ts`)
- **Element Plus** for form components and enterprise UI
- **@nuxt/icon** (Iconify, `lucide:` prefix) for icons
- **@vueuse/motion** for animations
- **dayjs** for date formatting
- **@vueup/vue-quill** for rich text editing in the post-property form
- **@tanstack/vue-query** for server state with mutations
