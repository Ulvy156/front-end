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
  const authStore = useAuthStore()

  // Client requests go through the same-origin /api proxy (see routeRules in
  // nuxt.config.ts) so the browser treats refresh_token as a first-party
  // cookie. SSR requests skip the proxy and hit the backend directly.
  const apiBaseUrl = import.meta.client ? '/api' : config.public.apiBaseUrl

  const api = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
  })

  let refreshPromise: Promise<string | null> | null = null

  const applyAccessToken = (request: InternalAxiosRequestConfig, token?: string | null) => {
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
    accessToken.value = null
    authStore.clear()
  }

  const refreshAccessToken = async () => {
    try {
      const { data } = await axios.post(
        `${apiBaseUrl}/auth/refresh-token`,
        {},
        { withCredentials: true },
      )
      const nextToken = data?.accessToken ?? null
      accessToken.value = nextToken
      return nextToken
    } catch {
      // Refresh token is expired or missing — full session is dead
      clearSession()
      return null
    }
  }

  api.interceptors.request.use((request) => {
    const locale = (nuxtApp.$i18n as any)?.locale?.value ?? 'en'
    request.headers['accept-language'] = locale
    return applyAccessToken(request, accessToken.value)
  })

  api.interceptors.response.use(
    (response) => response,
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
        if (body?.message) appSettingsStore.setMaintenanceMessage(body.message)
        void appSettingsStore.refetchSettings()
      }

      // Only act on 401 responses from authenticated requests
      if (status !== 401 || !originalRequest) {
        return Promise.reject(error)
      }

      // Never intercept the refresh endpoint itself
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        return Promise.reject(error)
      }

      // Skip refresh when the request had no token — the 401 is from a public
      // endpoint (e.g. wrong login credentials) and there is nothing to refresh
      const hadToken = !!(originalRequest.headers as Record<string, string>)?.['Authorization']
      if (!hadToken) {
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

      const nextToken = await refreshPromise

      if (!nextToken) {
        return Promise.reject(error)
      }

      return api.request(applyAccessToken(originalRequest, nextToken))
    },
  )

  return {
    provide: {
      axios: api,
    },
  }
})
