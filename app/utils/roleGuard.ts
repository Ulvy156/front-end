import { Role } from '~/types/role'

type GuardRequirement = 'auth' | Role

/**
 * Factory that creates a Nuxt route middleware from a role requirement.
 * All four middleware files call this — keeping the guard logic in one place.
 *
 * Access rules:
 *   'auth'         → any authenticated user; unauthenticated → /auth/login
 *   Role.USER      → USER (+ ADMIN); others → /
 *   Role.LANDLORD  → LANDLORD (+ ADMIN); others → /
 *   Role.ADMIN     → ADMIN only; others → /
 *
 * ADMIN bypasses USER and LANDLORD guards (full access principle).
 * Unauthenticated users are always redirected to /auth/login regardless of guard.
 */
export function createRoleGuard(required: GuardRequirement) {
  return defineNuxtRouteMiddleware(() => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
      return navigateTo('/auth/login')
    }

    if (required === 'auth') return // logged in — no role constraint

    const userRole = authStore.user?.role as Role | undefined
    if (!userRole) return navigateTo('/auth/login')

    const allowed = checkAccess(userRole, required)
    if (!allowed) {
      return navigateTo(resolveRedirect(userRole))
    }
  })
}

/**
 * Whether userRole satisfies the required access level.
 * ADMIN bypasses USER and LANDLORD guards but not the ADMIN guard itself.
 */
function checkAccess(userRole: Role, required: Role): boolean {
  if (userRole === Role.ADMIN) return true // ADMIN can access all routes
  return userRole === required             // strict match for USER and LANDLORD
}

/**
 * Where to send a user who tried to access a route they can't.
 * Redirects to the most meaningful page for their actual role.
 */
function resolveRedirect(userRole: Role): string {
  if (userRole === Role.LANDLORD) return '/post-property'
  return '/' // USER or unknown
}
