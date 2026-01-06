import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = axios.create({
    baseURL: config.public.apiBaseUrl,
    withCredentials: true, // keep if you use cookies / auth
  })

  // optional: request interceptor
  api.interceptors.request.use((request) => {
    return request
  })

  // optional: response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error)
    },
  )

  return {
    provide: {
      axios: api,
    },
  }
})
