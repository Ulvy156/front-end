# Roles & Authorization

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
