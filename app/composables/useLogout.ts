import { useQueryClient } from '@tanstack/vue-query'

export function useLogout() {
  const { $axios } = useNuxtApp()
  const accessToken = useAccessToken()
  const hasSession = useHasSession()
  const authStore = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  const logout = async () => {
    try {
      await $axios.post('/auth/logout')
    } finally {
      accessToken.value = null
      hasSession.value = null
      authStore.clear()
      queryClient.removeQueries({ queryKey: ['favourites'] })
      queryClient.removeQueries({ queryKey: ['profile'] })
      router.replace('/auth/login')
    }
  }

  return { logout }
}
