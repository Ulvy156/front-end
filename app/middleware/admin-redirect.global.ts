import axios from 'axios'
import { Role } from '~/types/role'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // Hydrate auth store: try access token first, fall back to refresh token
  if (!authStore.user) {
    const accessToken = useAccessToken()
    const api = useApi()
    const config = useRuntimeConfig()

    if (accessToken.value) {
      await authStore.fetchProfile()
    } else {
      // Access-token cookie expired — try the HttpOnly refresh token
      try {
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
          // Fetch profile with the fresh token directly to avoid context issues
          const { data: profile } = await api.get('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          })
          authStore.setUser(profile)
        }
      } catch {
        // Refresh token is also gone — user must log in again
      }
    }
  }

  if (!authStore.isAuthenticated) return
  if (authStore.user?.role !== Role.ADMIN) return

  const path = to.path
  if (path.startsWith('/admin') || path.startsWith('/auth')) return

  return navigateTo('/admin', { replace: true })
})
