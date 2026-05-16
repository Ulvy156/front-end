import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios'

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const accessToken = useCookie<string | null>('access_token', { sameSite: 'lax' })
  const authStore = useAuthStore()

  const api = axios.create({
    baseURL: config.public.apiBaseUrl,
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

  // Called when both tokens are gone — wipe local state and send user to login
  const clearSession = () => {
    accessToken.value = null
    authStore.clear()
    if (import.meta.client) {
      router.replace('/auth/login')
    }
  }

  const refreshAccessToken = async () => {
    try {
      const { data } = await axios.post(
        `${config.public.apiBaseUrl}/auth/refresh-token`,
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
    return applyAccessToken(request, accessToken.value)
  })

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetriableRequestConfig | undefined
      const status = error.response?.status

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
