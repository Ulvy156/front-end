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
  const accessToken = useCookie<string | null>('access_token', {
    sameSite: 'lax',
  })

  const api = axios.create({
    baseURL: config.public.apiBaseUrl,
    withCredentials: true,
  })

  let refreshPromise: Promise<string | null> | null = null

  const applyAccessToken = (request: InternalAxiosRequestConfig, token?: string | null) => {
    if (!token) {
      return request
    }

    const headers = AxiosHeaders.from(request.headers)
    headers.set('Authorization', `Bearer ${token}`)
    request.headers = headers

    return request
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
      accessToken.value = null
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
      const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh-token')

      if (
        status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        isRefreshRequest
      ) {
        if (status === 401) {
          accessToken.value = null
        }

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
