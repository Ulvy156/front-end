import { effectScope, watchEffect } from 'vue'
import type { Directive } from 'vue'
import { Role, type CanPermission } from '~/types/role'

// v-can — show an element only to users who have the required role.
// Works like v-if: the element is removed from the page, not just hidden.
//
// 'auth'     → any logged-in user
// 'user'     → tenants (USER role). Admin can see it too.
// 'landlord' → landlords (LANDLORD role). Admin can see it too.
// 'admin'    → admins only
//
// Examples:
//   <button v-can="'auth'">My Profile</button>
//   <button v-can="'user'">Save to Favourites</button>
//   <button v-can="'landlord'">Post Property</button>
//   <div    v-can="'admin'">Admin Panel</div>

function isAllowed(
  authStore: ReturnType<typeof useAuthStore>,
  permission: CanPermission | CanPermission[],
): boolean {
  if (!authStore.isAuthenticated) return false

  // Admin can see everything
  if (authStore.user?.role === Role.ADMIN) return true

  const perms = Array.isArray(permission) ? permission : [permission]

  return perms.some((p) => {
    switch (p) {
      case 'auth':     return true
      case 'user':     return authStore.user?.role === Role.USER
      case 'landlord': return authStore.user?.role === Role.LANDLORD
      case 'admin':    return false // admin-only is already handled above
      default:         return false
    }
  })
}

export const vCan: Directive<HTMLElement, CanPermission | CanPermission[]> = {
  // SSR: auth state is never populated on the server (profile is fetched client-side),
  // so render all elements and let the client-side mounted hook handle show/hide.
  getSSRProps() {
    return {}
  },

  mounted(el, binding) {
    const authStore = useAuthStore()
    const anchor = document.createComment('v-can') // placeholder while the element is hidden
    let detached = false

    const scope = effectScope() // lets us stop the watcher when the element is removed

    scope.run(() => {
      watchEffect(() => {
        const allowed = isAllowed(authStore, binding.value)

        if (!allowed && !detached && el.parentNode) {
          el.parentNode.insertBefore(anchor, el)
          el.parentNode.removeChild(el)
          detached = true
        } else if (allowed && detached && anchor.parentNode) {
          anchor.parentNode.insertBefore(el, anchor)
          anchor.parentNode.removeChild(anchor)
          detached = false
        }
      })
    })

    ;(el as any)._vCan = scope
  },

  unmounted(el) {
    ;(el as any)._vCan?.stop()
  },
}
