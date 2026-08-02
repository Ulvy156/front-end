import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios'

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const accessToken = useAccessToken()
  const freshAccessToken = useFreshAccessToken()
  const authStore = useAuthStore()

  // Client requests go through the same-origin /api proxy (see routeRules in
  // nuxt.config.ts) so the browser treats refresh_token/access_token as
  // first-party cookies. SSR requests skip the proxy and hit the backend directly.
  const apiBaseUrl = import.meta.client ? '/api' : config.public.apiBaseUrl

  const api = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
    // Bound SSR requests so a slow/cold backend fails fast instead of
    // hanging the whole page render (Lighthouse flagged a 3.6s+ TTFB caused
    // by this). Client requests are left unbounded — file uploads etc. can
    // legitimately take longer and have their own loading UI.
    timeout: import.meta.server ? 8000 : 0,
  })

  let refreshPromise: Promise<boolean> | null = null

  // Only needed for SSR: it's a direct server-to-server call to the backend,
  // so the browser's cookie jar never enters the picture — the token has to
  // be attached explicitly. Client requests rely on the browser attaching the
  // HttpOnly access_token cookie automatically via the same-origin proxy.
  const applyAccessToken = (request: InternalAxiosRequestConfig) => {
    if (!import.meta.server) return request
    const token = freshAccessToken.value ?? accessToken.value
    if (!token) return request
    const headers = AxiosHeaders.from(request.headers)
    headers.set('Authorization', `Bearer ${token}`)
    request.headers = headers
    return request
  }

  // Called when both tokens are gone — wipe local state.
  // Navigation to /auth/login is handled by route middleware, not here,
  // to avoid conflicting with in-flight middleware navigation.
  const clearSession = () => {
    authStore.clear()
  }

  const refreshAccessToken = async () => {
    const headers: Record<string, string> = {}
    if (import.meta.server) {
      const cookie = useRequestHeaders(['cookie']).cookie
      if (cookie) headers.cookie = cookie
    }
    try {
      const response = await axios.post(
        `${apiBaseUrl}/auth/refresh-token`,
        {},
        { withCredentials: true, headers },
      )
      // Composables can't be called after crossing this await without
      // restoring Nuxt's async context explicitly (see roleGuard.ts's
      // refreshAndHydrate for the same pattern).
      await nuxtApp.runWithContext(() => {
        if (import.meta.server) {
          const setCookie = response.headers['set-cookie']
          if (setCookie) useResponseHeader('set-cookie').value = setCookie
        }
        freshAccessToken.value = response.data?.accessToken ?? null
      })
      return true
    } catch {
      // Refresh token is expired or missing — full session is dead
      clearSession()
      return false
    }
  }

  api.interceptors.request.use((request) => {
    const locale = (nuxtApp.$i18n as any)?.locale?.value ?? 'en'
    request.headers['accept-language'] = locale
    return applyAccessToken(request)
  })

  api.interceptors.response.use(
    (response) => {
      // Any successful call proves maintenance mode is off — cheaper than a
      // dedicated polling timer, and reacts immediately to real traffic.
      const appSettingsStore = useAppSettingsStore()
      if (appSettingsStore.maintenanceMode) appSettingsStore.setMaintenanceMode(false)
      return response
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as RetriableRequestConfig | undefined
      const status = error.response?.status

      // MaintenanceGuard 503s every non-admin request during maintenance.
      // Just update the store here — session.global.ts already redirects to
      // /maintenance declaratively on the next navigation. Calling
      // navigateTo() from here too raced against that (every 503'd request
      // fired its own redirect) and caused a loop.
      if (status === 503) {
        const appSettingsStore = useAppSettingsStore()

        const body = error.response?.data as { message?: string } | undefined
        appSettingsStore.setMaintenanceMode(true)
        if (body?.message) appSettingsStore.setMaintenanceMessage(body.message)
      }

      // Rate-limited — redirect to a page showing a countdown from Retry-After.
      if (status === 429 && import.meta.client) {
        const rateLimitStore = useRateLimitStore()
        const header = error.response?.headers?.['retry-after']
        const seconds = header ? parseInt(header, 10) : NaN
        const retrySeconds = Number.isFinite(seconds) && seconds > 0 ? seconds : null
        rateLimitStore.trigger(retrySeconds, window.location.pathname + window.location.search)
        await nuxtApp.runWithContext(() => navigateTo('/rate-limited'))
      }

      // Only act on 401 responses from authenticated requests
      if (status !== 401 || !originalRequest) {
        return Promise.reject(error)
      }

      // Never intercept the refresh endpoint itself
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        return Promise.reject(error)
      }

      // Still getting 401 after a successful refresh — session is invalid
      if (originalRequest._retry) {
        clearSession()
        return Promise.reject(error)
      }

      originalRequest._retry = true

      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })

      const refreshed = await refreshPromise

      if (!refreshed) {
        return Promise.reject(error)
      }

      // No token to reattach manually — the retry picks up the freshly
      // rotated cookie the same way the original request would have.
      return api.request(applyAccessToken(originalRequest))
    },
  )

  return {
    provide: {
      axios: api,
    },
  }
})
