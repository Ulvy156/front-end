import axios from 'axios'
import { Role } from '~/types/role'

type GuardRequirement = 'auth' | Role

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

async function refreshAndHydrate(
  config: ReturnType<typeof useRuntimeConfig>,
  accessToken: ReturnType<typeof useAccessToken>,
  hasSession: ReturnType<typeof useHasSession>,
  authStore: ReturnType<typeof useAuthStore>,
) {
  const headers: Record<string, string> = {}
  if (import.meta.server) {
    const cookie = useRequestHeaders(['cookie']).cookie
    if (cookie) headers.cookie = cookie
  }
  const { data } = await axios.post(
    `${config.public.apiBaseUrl}/auth/refresh-token`,
    {},
    { withCredentials: true, headers },
  )
  const token = data?.accessToken ?? null
  if (token) {
    accessToken.value = token
    hasSession.value = true
    await authStore.fetchProfile(token)
  }
}

export async function hydrateAuth() {
  const authStore = useAuthStore()
  if (authStore.user) return

  const accessToken = useAccessToken()
  const hasSession = useHasSession()
  const config = useRuntimeConfig()

  if (accessToken.value && !isTokenExpired(accessToken.value)) {
    await authStore.fetchProfile()
    return
  }

  accessToken.value = null

  // No evidence this visitor was ever authenticated — there is no refresh
  // token to redeem, so skip the API call instead of hitting it on every
  // anonymous page load.
  if (!hasSession.value) return

  try {
    await refreshAndHydrate(config, accessToken, hasSession, authStore)
  } catch {
    // Refresh token is also gone — user must log in again
    hasSession.value = null
  }
}

export function createRoleGuard(required: GuardRequirement) {
  return defineNuxtRouteMiddleware(async () => {
    const authStore = useAuthStore()

    // The global `session.global.ts` middleware already hydrates auth state
    // before any named page middleware runs; this is just a safety net in
    // case ordering ever changes.
    await hydrateAuth()

    if (!authStore.isAuthenticated) {
      return navigateTo('/auth/login')
    }

    if (required === 'auth') return

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
  if (userRole === Role.ADMIN) return '/admin'
  if (userRole === Role.LANDLORD) return '/landlord'
  return '/' // USER or unknown
}

export function resolvePostLoginRoute(role?: Role): string {
  if (role === Role.ADMIN) return '/admin'
  if (role === Role.LANDLORD) return '/landlord'
  return '/'
}
