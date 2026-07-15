# Rules of Writing Code

**General**
- Follow existing project patterns — look at how the nearest similar feature is built before writing new code
- Follow DRY — shared logic belongs in `utils/` (factories, pure helpers) or `composables/` (reactive logic)
- No component longer than 300 lines — if it exceeds that, split into smaller components

**File & Component Naming**
- Feature components (`features/*/components/`): kebab-case (e.g. `property-card.vue`, `filter-price.vue`)
- Shared design-system primitives (`components/ui/`): PascalCase, prefixed `Base` (e.g. `BaseButton.vue`, `BaseCard.vue`)
- For other shared component folders (`components/navbar`, `components/property`, etc.), match the casing of existing siblings in that folder — don't mix conventions within the same directory
- Browser-only components (maps, Telegram widgets, icon rendering, language switcher) use the `.client.vue` suffix (e.g. `BaseMap.client.vue`, `telegram-login.client.vue`)
- Composables: `useXxx.ts`, one export per file, export name matches the filename
- Pinia stores: `xxx.store.ts` (e.g. `auth.store.ts`) for new stores
- Feature services (`features/*/services/`): plain exported functions shaped `(api: AxiosInstance, ...args) => Promise<T>` — no classes, no side effects beyond the HTTP call
- Feature types/interfaces (`features/*/types/` or `features/*/interface/`): kebab-case filenames, PascalCase exported types/interfaces

**Reusable Components & Utils — use these instead of rewriting inline**
- **Images from R2/CDN** — always use `BaseImage` (`components/ui/BaseImage.vue`). It constructs the full URL from `R2_PUB_URL` + the image key and handles error fallback. Never build the URL manually with `useRuntimeConfig().public.R2_PUB_URL`.
- **User initials** — use `initials(name)` from `utils/initials.ts`. Never redefine this function locally.
- **Icons** — use `BaseIcon` (`components/ui/BaseIcon.client.vue`). It wraps Iconify with the `lucide:` prefix.
- **Drawers** — use `BaseDrawer` (`components/ui/BaseDrawer.vue`) for side panels.
- Before writing a new helper, check `components/ui/` and `utils/` for an existing one. If a pattern appears in 2+ files, extract it into a shared component or util.

**Vue Components**
- Always `<script lang="ts" setup>`
- Type props with `defineProps<{ ... }>()`; reach for `withDefaults` only when a prop has a default value
- Type emits with the call-signature form: `defineEmits<{ (e: 'name', value: T): void }>()`
- Import order: framework (`vue`, `vue-i18n`) → shared composables/stores (`~/composables/...`, `~/stores/...`) → feature-local relative imports (`../...`) → types (`import type ...`) last
- Map backend response fields (often snake_case, e.g. `monthly_price`) to a camelCase view-model inside the feature component before passing data to shared `components/` — keep raw API shapes out of shared UI

**Data Fetching with TanStack Query**
- For mutations that update cached data, follow the optimistic-update pattern in `useFavourites()` (`features/favourite/composable/useFavourites.ts`): `onMutate` cancels in-flight queries and snapshots prior data, `onError` rolls back from that snapshot, `onSettled` calls `invalidateQueries` to resync with the server
- If pending/loading state for a mutation must be shared across multiple component instances (e.g. several cards toggling the same item), track it with `useState()` — `useMutation().isPending` is per-instance and won't reflect across components

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
